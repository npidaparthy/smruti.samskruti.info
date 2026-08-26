/* reader.js — Reader tab: chapter selection, verse display, prev/next/random */

const Reader = (() => {
  let index        = null;
  let chapterCache = {};
  let allShlokas   = [];
  let selectedChs  = new Set();
  let pool         = [];
  let current      = null;
  let currentPos   = 0;
  let activeText   = 'gita';   // 'gita' | 'vsn' | 'sl'
  let _votdSh      = null;
  let _votdVsnSh   = null;
  let bgMetaChapters = null;
  let keyVersesMode = false;
  let bookmarksMode = false;
  // 'dhyana' | 'mahatyam' | null — which pseudo-chapter chip (if any) is
  // selected in the Gita chapter grid. See C.GITA_EXTRA_CHAPTERS.
  let extraChapterMode = null;
  let extraChapterCache = {};

  // VSN-only bespoke state (names browser, meta/about panel — see
  // renderVsnAbout/renderVerse's VSN-only extras). Not part of the
  // generic ranged-text engine below.
  let vsnNames          = [];
  let vsnNamesLoaded    = false;
  let vsnNameCountMap   = null;
  let vsnMeta           = null;
  let bgMeta            = null;

  // Generic engine for texts with C.TEXTS[id].grouping === 'ranges'|'single'
  // (currently vsn, sl — Reader-only for now; see constants.js TEXTS.sl
  // comment). One text id → its own shlokas + selected-range-keys, so a new
  // text of this shape needs a data file + one C.TEXTS entry, no reader.js
  // changes. Gita stays its own bespoke branch throughout this file — it
  // has real chapters, an about panel, VOTD, progress tracking, etc. that
  // no future text is expected to want, so it isn't part of this engine.
  const rangedState = {}; // id -> { shlokas: [], selectedGroups: Set<string> }
  function rs(id) { return rangedState[id] || (rangedState[id] = { shlokas: [], selectedGroups: new Set() }); }
  function isRangedText(id) {
    const cfg = C.TEXTS[id];
    return !!cfg && (cfg.grouping === 'ranges' || cfg.grouping === 'single');
  }

  const $ = id => document.getElementById(id);

  // ── Key verses & bookmarks ────────────────────────────────────
  const KEY_VERSE_IDS = new Set([
    '2.19','2.20','2.47','2.48','2.62','2.63',
    '3.21','3.35','4.7','4.8','5.22','6.5','6.6',
    '7.7','8.7','9.22','9.26','9.27','10.20','11.32',
    '12.13','12.20','13.28','15.1','15.7','15.15','18.65','18.66',
  ]);
  const BOOKMARKS_KEY = 'smriti_bookmarks';

  function getBookmarks() {
    try { return new Set(JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]')); } catch(e) { return new Set(); }
  }
  function saveBookmarks(set) {
    try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...set])); } catch(e) {}
  }
  function verseId(sh) {
    if (isRangedText(activeText)) return `${activeText}.${sh.s}`;
    if (sh._extra)                return `${sh._extra}.${sh.s}`;
    return `${sh.c}.${sh.s}`;
  }

  // ── Helpers ───────────────────────────────────────────────────
  function padaText(pada, script) {
    if (!pada) return '';
    const s = script || window._script || 'te';
    return pada[s] || pada.ro || '';
  }

  function speakerBadgeClass(speaker) {
    return { krishna:'badge-krishna', arjuna:'badge-arjuna',
             sanjaya:'badge-sanjaya', dhritarashtra:'badge-dhritarashtra' }[speaker] || 'badge-krishna';
  }

  // Issue #10: speaker label follows lipi, not UI lang
  function speakerLabel(speaker) {
    const script = window._script || 'te';
    const key = script === 'sa' ? 'sa' : script === 'ro' ? 'ro' : 'te';
    return (C.SPEAKER_LABEL[speaker] && C.SPEAKER_LABEL[speaker][key]) || speaker;
  }

  // Issue #10: chapter title follows lipi script
  function chapterTitle(sh) {
    const chData = chapterCache[sh.c];
    if (!chData) return `Ch ${sh.c}`;
    const script = window._script || 'te';
    const key = script === 'sa' ? 'sa' : script === 'ro' ? 'ro' : 'te';
    return chData.title?.[key] || chData.title?.en || `Ch ${sh.c}`;
  }

  // ── Data loading ──────────────────────────────────────────────
  // Generic loader for any C.TEXTS entry with grouping 'ranges'|'single'.
  // `cfg.numberField` (e.g. sl.json's "v") lets a text number its verses
  // under a different key than "s" — aliased here so the rest of the file
  // (sort/pool-index code, all of which reads .s) never has to know.
  async function loadRangedText(id) {
    const state = rs(id);
    if (state.shlokas.length) return state.shlokas;
    const cfg = C.TEXTS[id];
    const r = await fetch(C[cfg.shlokasPath]);
    const data = await r.json();
    const numField = cfg.numberField;
    state.shlokas = (data.shlokas || []).map(sh => numField ? { ...sh, s: sh[numField] } : sh);
    return state.shlokas;
  }
  // Thin, readable aliases for call sites that are inherently VSN/SL-
  // specific already (VOTD, names/meta lookups) — they don't need to know
  // about the generic engine.
  const loadVsn = () => loadRangedText('vsn');
  const loadSl  = () => loadRangedText('sl');

  async function loadVsnNames() {
    if (vsnNamesLoaded) return vsnNames;
    try {
      const r = await fetch(C.VSN_NAMES);
      const data = await r.json();
      vsnNames = data.names || [];
    } catch (e) {}
    vsnNamesLoaded = true;
    return vsnNames;
  }

  async function loadVsnNameCountMap() {
    if (vsnNameCountMap) return vsnNameCountMap;
    vsnNameCountMap = new Map();
    try {
      const r = await fetch(C.VSN_TOKENS);
      const data = await r.json();
      (data.verses || []).forEach(v => {
        const cnt = v.tokens.filter(t => t.type === 'name').length;
        if (cnt) vsnNameCountMap.set(v.s, cnt);
      });
    } catch (e) {}
    return vsnNameCountMap;
  }

  async function loadVsnMeta() {
    if (vsnMeta) return vsnMeta;
    const r = await fetch(C.VSN_META);
    vsnMeta = await r.json();
    return vsnMeta;
  }

  function renderVsnAbout(meta, script) {
    const panel = $('vsn-about');
    if (!panel) return;
    panel.style.display = '';

    const isRo = script === 'ro', isDn = script === 'sa';
    const _p  = o => (o && (isRo ? (o.iast || o.english) : (isDn ? (o.devanagari || o.iast) : (o.telugu || o.iast || o.english)))) || '';
    const _set = (id, val) => { const el = $(id); if (el) el.textContent = val; };
    const _html = (id, val) => { const el = $(id); if (el) el.innerHTML = val; };

    const ec   = meta.epic_context || {};
    const hs   = meta.historical_summary || {};
    const lang = (isRo || window._uiLang === 'en') ? 'english' : 'telugu';
    const L    = (en, te) => (isRo || window._uiLang === 'en') ? en : te;

    // Header title
    _set('vsn-meta-title', _p(meta.mantra_details && meta.mantra_details.title));

    // Video embed
    const iv = meta.intro_video || {};
    const videoEl = $('vsn-meta-video');
    const ytId = (iv.youtube_id || '').replace(/.*(?:youtu\.be\/|v=)/, '').split('?')[0].trim();
    if (videoEl && ytId) {
      videoEl.style.display = '';
      _set('vsn-ml-video', L('Introduction Video', 'పరిచయ వీడియో'));
      const frame = $('vsn-video-frame');
      const embedSrc = `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`;
      if (frame && frame.src !== embedSrc) frame.src = embedSrc;
    } else if (videoEl) {
      videoEl.style.display = 'none';
    }

    // 1. What is VSN
    _set('vsn-ml-what', L('What is Viṣṇu Sahasranāma?', 'విష్ణు సహస్రనామం అంటే ఏమిటి?'));
    const wv = meta.what_is_vsn || {};
    _set('vsn-mv-what', wv[lang] || wv.english || '');

    // 2. Origin
    _set('vsn-ml-origin',   L('Origin & Tradition', 'ఉత్పత్తి & సంప్రదాయం'));
    _set('vsn-ml-source',   L('Source text', 'గ్రంథం'));
    _set('vsn-mv-source',   _p(ec.source_text));
    _set('vsn-ml-parvam',   L('Parva', 'పర్వం'));
    _set('vsn-mv-parvam',   _p(ec.parvam));
    _set('vsn-ml-adhyaya',  L('Adhyāya', 'అధ్యాయం'));
    _set('vsn-mv-adhyaya',  ec.adhyaya ? ec.adhyaya.number + ' · ' + _p(ec.adhyaya.text) : '');
    const wc = meta.when_composed || {};
    _set('vsn-ml-composed', L('Dating', 'రచనాకాలం'));
    _set('vsn-mv-composed', ((isRo ? wc.scholarly : wc.traditional) || wc.traditional || {})[lang] ||
      ((isRo ? wc.scholarly : wc.traditional) || wc.traditional || {}).english || '');

    // 3. Who to whom + story
    _set('vsn-ml-story',    L('The Story — Who Spoke to Whom?', 'కథాసందర్భం — ఎవరు ఎవరికి చెప్పారు?'));
    _set('vsn-ml-speaker',  L('Speaker', 'వక్త'));
    _set('vsn-mv-speaker',  _p(ec.speaker && ec.speaker.name));
    _set('vsn-ml-listener', L('Listener', 'శ్రోత'));
    _set('vsn-mv-listener', _p(ec.listener && ec.listener.name));
    const narr = hs.narrative_context;
    _set('vsn-mv-narrative', narr ? (narr[lang] || narr.english) : '');

    // 4. Why VSN
    _set('vsn-ml-why', L('Why Recite These Names?', 'ఈ నామాలను ఎందుకు పఠించాలి?'));
    const wy = meta.why_vsn || {};
    _set('vsn-mv-why', wy[lang] || wy.english || '');

    // 5. Six questions + verse
    _set('vsn-ml-questions', L('The Six Questions Yudhiṣṭhira Asked Bhīṣma', 'యుధిష్ఠిరుడు భీష్ముని అడిగిన షట్ ప్రశ్నలు'));
    const sq = hs.the_six_questions || {};
    const qv = sq.shloka;
    const verseEl = $('vsn-mv-q-verse');
    if (verseEl && qv) {
      const verseText = isRo ? (qv.iast || '') : (isDn ? (qv.devanagari || '') : (qv.telugu || qv.iast || ''));
      verseEl.textContent = verseText;
      verseEl.style.display = verseText ? '' : 'none';
    }
    const ql = $('vsn-mv-questions');
    if (ql && sq.list) {
      ql.innerHTML = '';
      sq.list.forEach(q => {
        const li = document.createElement('li');
        li.textContent = q[lang] || q.english;
        ql.appendChild(li);
      });
    }

    // 6. Auspicious times
    _set('vsn-ml-times', L('When to Recite', 'పారాయణకు శ్రేష్ఠమైన సమయాలు'));
    const at = meta.auspicious_times || {};
    const daily = at.daily || {};
    _set('vsn-mv-daily', daily[lang] || daily.english || '');
    const daysEl = $('vsn-mv-days');
    if (daysEl && at.special_days) {
      daysEl.innerHTML = '';
      at.special_days.forEach(d => {
        const pill = document.createElement('div');
        pill.className = 'vsn-day-pill';
        const name = isRo ? d.name : (d.name_te || d.name);
        const note = isRo ? d.note_en : (d.note_te || d.note_en);
        pill.innerHTML = `<span class="vsn-day-name">${name}</span><span class="vsn-day-note">${note}</span>`;
        daysEl.appendChild(pill);
      });
    }

    // 7. Phalaśruti
    _set('vsn-ml-phalashruti', L('Phalaśruti — Fruits of Recitation', 'ఫలశ్రుతి — పారాయణ ఫలములు'));
    const ps = meta.phalashruti || {};
    _set('vsn-mv-phalashruti-text', (ps.summary && (ps.summary[lang] || ps.summary.english)) || '');
    const fl = $('vsn-mv-fruits');
    if (fl && ps.key_fruits) {
      fl.innerHTML = '';
      ps.key_fruits.forEach(f => {
        const li = document.createElement('li');
        const primary = isRo ? (f.english || '') : (f.telugu || f.english);
        li.innerHTML = `<span class="fruit-primary">${primary}</span>` +
          (!isRo ? `<span class="fruit-sub">${f.english}</span>` : '');
        fl.appendChild(li);
      });
    }
  }

  function hideVsnAbout() {
    const panel = $('vsn-about');
    if (panel) panel.style.display = 'none';
  }

  async function loadBgMeta() {
    if (bgMeta) return bgMeta;
    const r = await fetch(C.BG_META);
    bgMeta = await r.json();
    return bgMeta;
  }

  function renderBgAbout(meta, script) {
    const panel = $('bg-about');
    if (!panel) return;
    panel.style.display = '';

    const isRo = script === 'ro', isDn = script === 'sa';
    const L    = (en, te) => (isRo || window._uiLang === 'en') ? en : te;
    const _p   = o => (o && (isRo ? (o.iast || o.en) : (isDn ? (o.sa || o.iast) : (o.te || o.iast || o.en)))) || '';
    const _set = (id, val) => { const el = $(id); if (el) el.textContent = val; };
    const _html= (id, val) => { const el = $(id); if (el) el.innerHTML = val; };
    const _gn  = C.TEXT_LABELS.gita[isRo ? 'ro' : isDn ? 'sa' : 'te']; // canonical title

    // Header title
    _set('bg-meta-title', _p(meta.identity && meta.identity.name));

    // Tagline
    const tl = meta.identity && meta.identity.tagline;
    _set('bg-mv-tagline', tl ? (isRo ? tl.en : (tl.te || tl.en)) : '');

    // Stat strip labels
    _set('bg-sl-verses',   L('verses', 'శ్లోకాలు'));
    _set('bg-sl-chapters', L('chapters', 'అధ్యాయాలు'));
    _set('bg-sl-speakers', L('speakers', 'వక్తలు'));
    _set('bg-sl-meters',   L('meters', 'ఛందస్సులు'));

    // 1. What is BG
    _set('bg-ml-what', L('What is the Bhagavad Gītā?', `${_gn} అంటే ఏమిటి?`));
    const src = meta.source || {};
    const classification = (src.classification || []).join(' · ');
    const composed = src.when_composed || {};
    const whatText = L(
      `The Bhagavad Gītā is a 700-verse scripture embedded in the Mahābhārata (${src.chapters_in_mbh || ''}). Classified as ${classification}, it is the divine dialogue between Śrī Kṛṣṇa and Arjuna on the Kurukṣetra battlefield.`,
      `${_gn} మహాభారతంలో భాగమైన 700 శ్లోకాల గ్రంథం. ఇది ${classification} గా వర్గీకరించబడింది. కురుక్షేత్ర యుద్ధభూమిపై శ్రీ కృష్ణుడు అర్జునునికి బోధించిన దివ్య సంభాషణ.`
    );
    _set('bg-mv-what', whatText);

    // 2. Source & Setting
    _set('bg-ml-source',   L('Source & Setting', 'గ్రంథం & సందర్భం'));
    _set('bg-ml-scripture',L('Scripture', 'మూలగ్రంథం'));
    _set('bg-mv-scripture',_p(src.scripture) + (src.chapters_in_mbh ? '  ·  ' + src.chapters_in_mbh : ''));
    _set('bg-ml-parva',    L('Parva', 'పర్వం'));
    _set('bg-mv-parva',    _p(src.parva));
    _set('bg-ml-setting',  L('Where', 'స్థలం'));
    const sett = meta.setting || {};
    _set('bg-mv-setting',  _p(sett.place) + (sett.location_detail ? '  —  ' + (isRo ? sett.location_detail.en : sett.location_detail.te) : ''));
    _set('bg-ml-composed', L('Dating', 'రచనాకాలం'));
    _set('bg-mv-composed', isRo ? composed.scholarly : composed.traditional);

    // 3. Speaker breakdown
    _set('bg-ml-speakers', L('Who Spoke — Verse Breakdown', 'ఎవరు ఎన్ని శ్లోకాలు పలికారు?'));
    const speakersEl = $('bg-mv-speakers');
    if (speakersEl && meta.speakers) {
      speakersEl.innerHTML = '';
      const order = ['primary','questioner','narrator','frame'];
      const colors = { primary: 'var(--bg-gold)', questioner: 'var(--bg-amber)', narrator: 'var(--bg-amber-lt)', frame: 'var(--bg-amber-pale)' };
      order.forEach(key => {
        const sp = meta.speakers[key];
        if (!sp) return;
        const card = document.createElement('div');
        card.className = 'bg-speaker-card';
        const pct = sp.percent || 0;
        card.innerHTML = `
          <div class="bg-spk-name">${_p(sp.speaker)}</div>
          <div class="bg-spk-bar-wrap"><div class="bg-spk-bar" style="width:${pct}%;background:${colors[key]}"></div></div>
          <div class="bg-spk-stats"><span class="bg-spk-v">${sp.verses}</span><span class="bg-spk-pct">${pct}%</span></div>
          <div class="bg-spk-role">${isRo ? sp.role.en : (sp.role.te || sp.role.en)}</div>`;
        speakersEl.appendChild(card);
      });
    }

    // 4. Chapters at a glance
    _set('bg-ml-chapters', L('18 Chapters — Yoga & Benefit', '18 అధ్యాయాలు — యోగం & ఫలం'));
    const chEl = $('bg-mv-chapters');
    const _pTitle = title => (title && (isRo ? (title.ro || title.en) : (isDn ? (title.sa || title.ro) : (title.te || title.ro || title.en)))) || '';
    if (chEl && meta.chapters) {
      chEl.innerHTML = '';
      meta.chapters.forEach(ch => {
        const row = document.createElement('div');
        row.className = 'bg-ch-row';
        const ps = ch.phalashruti;
        row.innerHTML = `
          <span class="bg-ch-num">${ch.ch}</span>
          <div class="bg-ch-info">
            <div class="bg-ch-header">
              <span class="bg-ch-name">${_pTitle(chapterCache[ch.ch]?.title)}</span>
              <span class="bg-ch-v">${ch.verses} ${L('śloka','శ్లో')}</span>
            </div>
            ${ps ? `<span class="bg-ch-fruit">${isRo ? ps.en : (ps.te || ps.en)}</span>` : ''}
          </div>`;
        row.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('searchNavigate', { detail: { text: 'gita', ch: ch.ch, s: 1 } }));
        });
        chEl.appendChild(row);
      });
    }

    // 5. Real-life benefits
    _set('bg-ml-benefits', L('Gītā in Real Life', `నిజ జీవితంలో ${_gn}`));
    const benEl = $('bg-mv-benefits');
    if (benEl && meta.real_life_benefits) {
      benEl.innerHTML = '';
      meta.real_life_benefits.forEach(b => {
        const card = document.createElement('div');
        card.className = 'bg-benefit-card';
        card.innerHTML = `<div class="bg-ben-area">${isRo ? b.area.en : (b.area.te || b.area.en)}</div>
          <div class="bg-ben-detail">${isRo ? b.detail.en : (b.detail.te || b.detail.en)}</div>`;
        benEl.appendChild(card);
      });
    }

    // 6. Chandas
    _set('bg-ml-chandas', L('Meters (Chandas)', 'ఛందస్సు'));
    const chandEl = $('bg-mv-chandas');
    if (chandEl && meta.chandas) {
      chandEl.innerHTML = '';
      meta.chandas.forEach(c => {
        const row = document.createElement('div');
        row.className = 'bg-chanda-row';
        row.innerHTML = `<span class="bg-chanda-name">${isRo ? c.name.iast : c.name.en}</span>
          <span class="bg-chanda-syl">${c.syllables}</span>
          <span class="bg-chanda-usage">${c.usage}</span>
          <span class="bg-chanda-note">${isRo ? c.note.en : (c.note.te || c.note.en)}</span>`;
        chandEl.appendChild(row);
      });
    }

    // 7. Commentators
    _set('bg-ml-commentators', L('Great Commentators', 'మహా వ్యాఖ్యాతలు'));
    const comEl = $('bg-mv-commentators');
    if (comEl && meta.commentators) {
      comEl.innerHTML = '';
      meta.commentators.forEach(c => {
        const card = document.createElement('div');
        card.className = 'bg-comment-card';
        card.innerHTML = `<div class="bg-com-name">${c.name}</div>
          <div class="bg-com-period">${c.period} · ${c.school}</div>
          <div class="bg-com-note">${isRo ? c.note.en : (c.note.te || c.note.en)}</div>`;
        comEl.appendChild(card);
      });
    }

    // 8. Three-part division
    const tri = meta.tripartite;
    const triEl = $('bg-mv-tripartite');
    if (triEl && tri) {
      _set('bg-ml-tripartite', L('Three Sections of the Gītā', `${_gn} త్రిభాగ విభజన`));
      _set('bg-mv-tri-intro', isRo ? tri.en : (tri.te || tri.en));
      triEl.innerHTML = '';
      (tri.parts || []).forEach(p => {
        const card = document.createElement('div');
        card.className = 'bg-tri-card';
        card.style.borderLeftColor = p.color || 'var(--bg-amber)';
        card.innerHTML = `
          <div class="bg-tri-header">
            <span class="bg-tri-ch">Ch ${p.chapters}</span>
            <span class="bg-tri-name">${_p(p.name)}</span>
          </div>
          <div class="bg-tri-theme">${isRo ? p.theme.en : (p.theme.te || p.theme.en)}</div>`;
        triEl.appendChild(card);
      });
    }

    // 9. Gita Jayanti
    const gj = meta.gita_jayanti;
    if (gj) {
      _set('bg-ml-jayanti', L('Gītā Jayantī', 'గీతా జయంతి'));
      _set('bg-mv-jayanti', isRo ? gj.en : (gj.te || gj.en));
    }

    // 10. Vyasa-Ganesha story
    const vg = meta.vyasa_ganesha;
    if (vg) {
      _set('bg-ml-vyasa', L('How the Mahābhārata Was Written', 'మహాభారతం ఎలా రచించబడింది?'));
      _set('bg-mv-vyasa', isRo ? vg.en : (vg.te || vg.en));
    }

    // 11. World's largest Gita
    const wl = meta.worlds_largest_gita;
    if (wl) {
      _set('bg-ml-largest', L("World's Largest Bhagavad Gītā", `ప్రపంచంలో అతి పెద్ద ${_gn}`));
      _set('bg-mv-largest', isRo ? wl.en : (wl.te || wl.en));
    }

    // 12. Gems of Mahabharata
    const gems = meta.gems_of_mahabharata;
    const gemsEl = $('bg-mv-gems');
    if (gemsEl && gems) {
      _set('bg-ml-gems', L('Jewels of the Mahābhārata', 'మహాభారత రత్నాలు'));
      _set('bg-mv-gems-intro', isRo ? gems.intro.en : (gems.intro.te || gems.intro.en));
      gemsEl.innerHTML = '';
      (gems.gems || []).forEach(g => {
        const card = document.createElement('div');
        card.className = 'bg-gem-card';
        const isThis = g.name.iast && g.name.iast.includes('Gītā');
        card.innerHTML = `
          <div class="bg-gem-header">
            <span class="bg-gem-name${isThis ? ' bg-gem-highlight' : ''}">${_p(g.name)}</span>
            <span class="bg-gem-v">${g.verses} ${L('verses','శ్లో')}</span>
          </div>
          <div class="bg-gem-parva">${isRo ? g.parva.en : (g.parva.te || g.parva.en)}</div>
          <div class="bg-gem-note">${isRo ? g.note.en : (g.note.te || g.note.en)}</div>`;
        gemsEl.appendChild(card);
      });
    }

    // 13. Quotes
    const quotesEl = $('bg-mv-quotes');
    if (quotesEl && meta.quotes) {
      _set('bg-ml-quotes', L('What the World Says', 'ప్రపంచం ఏమంటోంది?'));
      quotesEl.innerHTML = '';
      meta.quotes.forEach(q => {
        const card = document.createElement('div');
        card.className = 'bg-quote-card';
        card.innerHTML = `
          <div class="bg-quote-text">"${isRo ? q.quote.en : (q.quote.te || q.quote.en)}"</div>
          <div class="bg-quote-attr">
            <span class="bg-quote-name">${q.person}</span>
            <span class="bg-quote-ctx">${isRo ? q.context.en : (q.context.te || q.context.en)}</span>
          </div>`;
        quotesEl.appendChild(card);
      });
    }

    // 14. Akṣauhiṇī
    const ak = meta.akshauhinii;
    if (ak) {
      _set('bg-ml-akshauhini', L('What is an Akṣauhiṇī?', 'అక్షౌహిణీ అంటే ఏమిటి?'));
      _set('bg-mv-akshauhini-intro', isRo ? ak.intro.en : (ak.intro.te || ak.intro.en));
      // Video
      const akVid = $('bg-mv-akshauhini-video');
      const akYt = (ak.intro_video && ak.intro_video.youtube_id) || '';
      if (akVid && akYt) {
        akVid.style.display = '';
        const fr = $('bg-akshauhini-frame');
        const embedSrc = `https://www.youtube-nocookie.com/embed/${akYt}?rel=0&modestbranding=1`;
        if (fr && fr.src !== embedSrc) fr.src = embedSrc;
      }
      // War strength cards
      const warEl = $('bg-mv-akshauhini-war');
      if (warEl && ak.war_strength) {
        const ws = ak.war_strength;
        warEl.innerHTML = `
          <div class="bg-war-strip">
            <div class="bg-war-card bg-war-pandava">
              <div class="bg-war-side">${L('Pāṇḍavas','పాండవులు')}</div>
              <div class="bg-war-n">${ws.pandava.akshauhiniis}</div>
              <div class="bg-war-label">${L('akṣauhiṇīs','అక్షౌహిణీలు')}</div>
              <div class="bg-war-total">${ws.pandava.total_warriors.toLocaleString()} ${L('warriors','సైనికులు')}</div>
            </div>
            <div class="bg-war-vs">⚔️</div>
            <div class="bg-war-card bg-war-kaurava">
              <div class="bg-war-side">${L('Kauravas','కౌరవులు')}</div>
              <div class="bg-war-n">${ws.kaurava.akshauhiniis}</div>
              <div class="bg-war-label">${L('akṣauhiṇīs','అక్షౌహిణీలు')}</div>
              <div class="bg-war-total">${ws.kaurava.total_warriors.toLocaleString()} ${L('warriors','సైనికులు')}</div>
            </div>
          </div>
          <div class="bg-war-combined">${L('Total: 18 akṣauhiṇīs · ','మొత్తం: 18 అక్షౌహిణీలు · ')}${ws.combined.total_warriors.toLocaleString()} ${L('warriors','సైనికులు')}</div>`;
      }
      // Table headers
      _set('bg-al-unit', L('Unit','యూనిట్'));
      _set('bg-al-chariot', '🐎 ' + L('Chariots','రథాలు'));
      _set('bg-al-elephant', '🐘 ' + L('Elephants','గజాలు'));
      _set('bg-al-cavalry', '🏇 ' + L('Cavalry','అశ్వాలు'));
      _set('bg-al-infantry', '⚔️ ' + L('Infantry','పదాతి'));
      const tbody = $('bg-mv-akshauhini-rows');
      if (tbody && ak.unit_breakdown) {
        tbody.innerHTML = '';
        ak.unit_breakdown.hierarchy.forEach(u => {
          const tr = document.createElement('tr');
          const isLast = u.name === 'Akṣauhiṇī';
          tr.className = isLast ? 'bg-ak-highlight' : '';
          tr.innerHTML = `<td class="bg-ak-name">${u.name}</td>
            <td>${u.chariots.toLocaleString()}</td>
            <td>${u.elephants.toLocaleString()}</td>
            <td>${u.cavalry.toLocaleString()}</td>
            <td>${u.infantry.toLocaleString()}</td>`;
          tbody.appendChild(tr);
        });
      }
    }

    // 15. Names
    const namesData = meta.names;
    if (namesData) {
      _set('bg-ml-names', L('Names of Kṛṣṇa & Arjuna in the Gītā', `${_gn}లో కృష్ణ & అర్జున నామాలు`));
      _set('bg-nt-krishna', L('Śrī Kṛṣṇa','శ్రీ కృష్ణుడు') + ` (${namesData.krishna.length})`);
      _set('bg-nt-arjuna',  L('Arjuna','అర్జునుడు') + ` (${namesData.arjuna.length})`);
      _set('bg-nl-sortby', L('Sort:','వరుస:'));
      _set('bg-ns-ch',    L('Chapter','అధ్యాయం'));
      _set('bg-ns-name',  L('Name','నామం'));
      _set('bg-ns-count', L('Count','సంఖ్య'));

      let currentWho = 'krishna';
      let currentSort = 'ch';

      function parseRef(ref) {
        const [c, s] = ref.split('.').map(Number);
        return { ch: c, s };
      }

      function renderNames() {
        const grid = $('bg-mv-names');
        if (!grid) return;
        const list = [...(namesData[currentWho] || [])];
        // Sort using first occurrence
        if (currentSort === 'name') {
          list.sort((a, b) => (a.iast || a.name).localeCompare(b.iast || b.name));
        } else if (currentSort === 'count') {
          list.sort((a, b) => (b.count || b.occurrences?.length || 0) - (a.count || a.occurrences?.length || 0));
        } else {
          list.sort((a, b) => {
            const fa = parseRef((a.occurrences || [])[0] || '99.99');
            const fb = parseRef((b.occurrences || [])[0] || '99.99');
            return fa.ch !== fb.ch ? fa.ch - fb.ch : fa.s - fb.s;
          });
        }
        grid.innerHTML = '';
        list.forEach(n => {
          const occs = n.occurrences || [];
          const displayName = isRo ? (n.iast || n.name) : (isDn ? (n.sa || n.iast || n.name) : (n.te || n.name));
          const card = document.createElement('div');
          card.className = 'bg-name-card';
          // Build occurrence chips
          const chips = occs.map(ref => {
            const { ch, s } = parseRef(ref);
            return `<span class="bg-name-ref" data-ch="${ch}" data-s="${s}">${ref}</span>`;
          }).join('');
          card.innerHTML = `
            <div class="bg-name-header">
              <span class="bg-name-iast">${displayName}</span>
              ${!isRo ? `<span class="bg-name-te-sub">${n.iast || n.name}</span>` : ''}
              <span class="bg-name-count">${n.count || occs.length}×</span>
            </div>
            <div class="bg-name-meaning">${isRo ? n.meaning_en : (n.meaning_te || n.meaning_en)}</div>
            <div class="bg-name-refs">${chips}</div>`;
          card.querySelectorAll('.bg-name-ref').forEach(chip => {
            chip.addEventListener('click', e => {
              e.stopPropagation();
              const ch = +chip.dataset.ch, s = +chip.dataset.s;
              const nameStr = n.iast || n.name;
              window.dispatchEvent(new CustomEvent('searchNavigate', {
                detail: { text: 'gita', ch, s, highlightName: nameStr }
              }));
            });
          });
          grid.appendChild(card);
        });
      }

      renderNames();

      document.querySelectorAll('[data-who]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-who]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentWho = btn.dataset.who;
          renderNames();
        });
      });
      document.querySelectorAll('[data-sort]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentSort = btn.dataset.sort;
          renderNames();
        });
      });
    }

    // 16. Popular culture
    const cult = meta.in_popular_culture;
    const cultEl = $('bg-mv-culture');
    if (cultEl && cult) {
      _set('bg-ml-culture', L('Gītā in Telugu Cinema', `తెలుగు సినిమాలో ${_gn}`));
      cultEl.innerHTML = '';
      (cult.telugu_films || []).forEach(f => {
        const card = document.createElement('div');
        card.className = 'bg-film-card';
        const verseChip = f.verse_ref
          ? `<span class="bg-name-ref bg-film-verse-chip" data-ref="${f.verse_ref}">${f.verse_ref}</span>`
          : '';
        card.innerHTML = `
          <div class="bg-film-title">${f.film} <span class="bg-film-year">(${f.year})</span>${verseChip}</div>
          <div class="bg-film-note">${isRo ? f.note_en : (f.note_te || f.note_en)}</div>`;
        if (f.verse_ref) {
          const chip = card.querySelector('.bg-film-verse-chip');
          chip?.addEventListener('click', () => {
            const [ch, s] = f.verse_ref.split('.').map(Number);
            $('bg-meta-details')?.removeAttribute('open');
            window.dispatchEvent(new CustomEvent('searchNavigate', { detail: { text: 'gita', ch, s } }));
          });
        }
        cultEl.appendChild(card);
      });
      if (cult.note_en) {
        const note = document.createElement('div');
        note.className = 'bg-film-disclaimer';
        note.textContent = isRo ? cult.note_en : (cult.note_te || cult.note_en);
        cultEl.appendChild(note);
      }
    }

    // 17. Interesting facts
    _set('bg-ml-facts', L('Did You Know?', 'మీకు తెలుసా?'));
    const factEl = $('bg-mv-facts');
    if (factEl && meta.interesting_facts) {
      factEl.innerHTML = '';
      meta.interesting_facts.forEach(f => {
        const li = document.createElement('li');
        li.textContent = isRo ? f.en : (f.te || f.en);
        factEl.appendChild(li);
      });
    }
  }

  function hideBgAbout() {
    const panel = $('bg-about');
    if (panel) panel.style.display = 'none';
  }

  async function loadIndex() {
    if (index) return index;
    const r = await fetch(C.GITA_INDEX);
    index = await r.json();
    return index;
  }

  async function loadChapter(num) {
    if (chapterCache[num]) return chapterCache[num];
    const r = await fetch(C.CHAPTER_PATH(num), { cache: 'no-store' });
    const data = await r.json();
    chapterCache[num] = data;
    return data;
  }

  // Populates chapterCache for all 18 chapters (titles + full text) so the
  // BG about panel's chapter list can read titles from the single source
  // of truth (ch*.json) instead of the removed bg-meta.json duplicate.
  async function loadAllChapterTitles() {
    const idx = await loadIndex();
    await Promise.all(idx.chapters.map(entry => loadChapter(entry.chapter)));
  }

  // Dhyāna Ślokas / Geetha Māhātmyam — pseudo-chapters of the Gita text
  // (see C.GITA_EXTRA_CHAPTERS), not separate texts. Their JSON numbers
  // verses "num", not "s"/"c" like real chapters — alias so the generic
  // sort/pool-index code (which reads .s, and treats missing .c as a
  // no-chapter marker same as VSN/SL) works unmodified. `_extra` tags the
  // shloka with which pseudo-chapter it came from, for bookmarks/rendering.
  async function loadExtraChapter(id) {
    if (extraChapterCache[id]) return extraChapterCache[id];
    const cfg = C.GITA_EXTRA_CHAPTERS.find(e => e.id === id);
    const r = await fetch(C[cfg.shlokasPath]);
    const data = await r.json();
    const shlokas = (data.shlokas || []).map(sh => ({ ...sh, s: sh.num, _extra: id }));
    extraChapterCache[id] = shlokas;
    return shlokas;
  }

  async function ensureAllLoaded() {
    if (allShlokas.length) return;
    const idx = await loadIndex();
    for (const entry of idx.chapters) {
      const ch = await loadChapter(entry.chapter);
      allShlokas.push(...ch.shlokas);
    }
  }

  async function loadSelectedChapters() {
    if (isRangedText(activeText)) {
      const cfg   = C.TEXTS[activeText];
      const all   = await loadRangedText(activeText);
      const state = rs(activeText);
      if (bookmarksMode) {
        const bms = getBookmarks();
        pool = all.filter(s => bms.has(`${activeText}.${s.s}`));
      } else if (cfg.grouping === 'single' || state.selectedGroups.size === 0) {
        pool = [...all];
      } else {
        const groups = C[cfg.ranges] || [];
        pool = all.filter(s =>
          groups.some(g => state.selectedGroups.has(String(g.key ?? g.from)) && s.s >= g.from && s.s <= g.to)
        );
      }
      pool.sort((a, b) => a.s - b.s);
      return;
    }
    if (extraChapterMode) {
      const shlokas = await loadExtraChapter(extraChapterMode);
      if (bookmarksMode) {
        const bms = getBookmarks();
        pool = shlokas.filter(sh => bms.has(`${extraChapterMode}.${sh.s}`));
      } else {
        pool = [...shlokas];
      }
      pool.sort((a, b) => a.s - b.s);
      return;
    }
    if (keyVersesMode) {
      await ensureAllLoaded();
      pool = allShlokas.filter(sh => KEY_VERSE_IDS.has(`${sh.c}.${sh.s}`));
      pool.sort((a, b) => a.c !== b.c ? a.c - b.c : a.s - b.s);
      return;
    }
    if (bookmarksMode) {
      await ensureAllLoaded();
      const bms = getBookmarks();
      pool = allShlokas.filter(sh => bms.has(`${sh.c}.${sh.s}`));
      // Include bookmarked verses from the two pseudo-chapters too, since
      // their bookmark ids ("dhyana.N"/"mahatyam.N") aren't in allShlokas.
      for (const extra of C.GITA_EXTRA_CHAPTERS) {
        const shlokas = await loadExtraChapter(extra.id);
        pool.push(...shlokas.filter(sh => bms.has(`${extra.id}.${sh.s}`)));
      }
      pool.sort((a, b) => a.c !== b.c ? a.c - b.c : a.s - b.s);
      return;
    }
    if (selectedChs.size === 0) {
      await ensureAllLoaded();
      pool = [...allShlokas];
    } else {
      pool = [];
      for (const num of selectedChs) {
        const ch = await loadChapter(num);
        pool.push(...ch.shlokas);
      }
    }
    pool.sort((a, b) => a.c !== b.c ? a.c - b.c : a.s - b.s);
  }

  // ── Text select ───────────────────────────────────────────────
  function updateTextSelectLabels() {
    const sel = $('r-text-select');
    if (!sel) return;
    const script = window._script || 'te';
    const key = script === 'sa' ? 'sa' : script === 'ro' ? 'ro' : 'te';
    Object.keys(C.TEXT_LABELS).forEach(id => {
      const opt = sel.querySelector(`option[value="${id}"]`);
      if (opt) opt.textContent = C.TEXT_LABELS[id][key] || C.TEXT_LABELS[id].en || id;
    });
  }

  // ── Chapter / group button grid ───────────────────────────────
  async function activateBookmarksFilter() {
    await loadSelectedChapters();
    if (!pool.length) { showEmptyBookmarksState(); return; }
    currentPos = Math.floor(Math.random() * pool.length);
    renderVerse(pool[currentPos]);
  }

  function showEmptyBookmarksState() {
    pool = [];
    const box = $('r-verse-box');
    if (!box) return;
    box.style.display = 'none';
    $('r-meaning-wrap').style.display  = 'none';
    $('r-conclusion-wrap').style.display = 'none';
    let msg = $('r-empty-state');
    if (!msg) {
      msg = document.createElement('p');
      msg.id = 'r-empty-state';
      msg.className = 'muted';
      msg.style.cssText = 'text-align:center;padding:24px 16px';
      box.after(msg);
    }
    msg.textContent = window._uiLang === 'en'
      ? 'No bookmarks yet. Tap ♡ on any verse to save it here.'
      : 'ఇంకా ఏ శ్లోకమూ సేవ్ కాలేదు. ఏదైనా శ్లోకంపై ♡ నొక్కండి.';
    msg.style.display = '';
  }

  let _chGridToken = 0;
  async function buildChapterGrid() {
    const wrap = $('r-ch-wrap');
    if (!wrap) return;
    const myToken = ++_chGridToken;
    wrap.innerHTML = '';

    if (isRangedText(activeText)) {
      const cfg    = C.TEXTS[activeText];
      const state  = rs(activeText);
      const groups = cfg.grouping === 'ranges' ? (C[cfg.ranges] || []) : [];

      const allBtn = document.createElement('button');
      allBtn.className = 'ch-btn all' + (state.selectedGroups.size === 0 && !bookmarksMode ? ' active' : '');
      allBtn.textContent = t('all');
      allBtn.addEventListener('click', () => {
        bookmarksMode = false;
        state.selectedGroups.clear();
        updateRangedGroupBtns(wrap, activeText);
        pickRandom();
      });
      wrap.appendChild(allBtn);

      // ♥ Bookmarks filter
      const bmFilterBtn = document.createElement('button');
      bmFilterBtn.className = 'ch-btn ch-btn-bm' + (bookmarksMode ? ' active' : '');
      bmFilterBtn.textContent = '♥';
      bmFilterBtn.title = window._uiLang === 'en' ? 'Bookmarks' : 'నచ్చిన శ్లోకాలు';
      bmFilterBtn.addEventListener('click', () => {
        bookmarksMode = !bookmarksMode;
        if (bookmarksMode) state.selectedGroups.clear();
        updateRangedGroupBtns(wrap, activeText);
        if (bookmarksMode) activateBookmarksFilter();
        else pickRandom();
      });
      wrap.appendChild(bmFilterBtn);

      groups.forEach(grp => {
        const key = String(grp.key ?? grp.from);
        const btn = document.createElement('button');
        btn.className = 'ch-btn' + (state.selectedGroups.has(key) ? ' active' : '');
        btn.textContent = grp.label;
        btn.dataset.key = key;
        btn.addEventListener('click', () => {
          bookmarksMode = false;
          state.selectedGroups.has(key) ? state.selectedGroups.delete(key) : state.selectedGroups.add(key);
          updateRangedGroupBtns(wrap, activeText);
          pickRandom();
        });
        wrap.appendChild(btn);
      });

      // Text-specific extras — the generic engine only owns the chip UI;
      // anything bespoke (VSN's "about" panel) stays an explicit per-id
      // hook rather than something every ranged text has to carry.
      hideBgAbout();
      if (activeText === 'vsn') {
        loadVsnMeta().then(meta => { if (activeText === 'vsn') renderVsnAbout(meta, window._script || 'te'); });
      } else {
        hideVsnAbout();
      }
      return;
    }

    hideVsnAbout();
    // Show BG about panel
    Promise.all([loadBgMeta(), loadAllChapterTitles()]).then(([meta]) => { if (activeText === 'gita') renderBgAbout(meta, window._script || 'te'); });

    // Gita chapter grid
    const idx = await loadIndex();
    if (activeText !== 'gita') return;  // guard: user may have switched while loading
    if (myToken !== _chGridToken) return;  // guard: a newer buildChapterGrid() call superseded this one
    wrap.innerHTML = '';  // in case a superseded call already appended before we could check
    const isNoneActive = selectedChs.size === 0 && !keyVersesMode && !bookmarksMode && !extraChapterMode;

    const allBtn = document.createElement('button');
    allBtn.className = 'ch-btn all' + (isNoneActive ? ' active' : '');
    allBtn.textContent = t('all');
    allBtn.addEventListener('click', () => {
      keyVersesMode = false;
      bookmarksMode = false;
      extraChapterMode = null;
      selectedChs.clear();
      updateChBtnStates();
      hideChapterSummary();
      pickRandom();
    });
    wrap.appendChild(allBtn);

    // ⭐ Key verses filter
    const starBtn = document.createElement('button');
    starBtn.className = 'ch-btn ch-btn-star' + (keyVersesMode ? ' active' : '');
    starBtn.textContent = '⭐';
    starBtn.title = window._uiLang === 'en' ? 'Key Verses' : 'ముఖ్య శ్లోకాలు';
    starBtn.addEventListener('click', () => {
      keyVersesMode = !keyVersesMode;
      if (keyVersesMode) { bookmarksMode = false; extraChapterMode = null; selectedChs.clear(); hideChapterSummary(); }
      updateChBtnStates();
      pickRandom();
    });
    wrap.appendChild(starBtn);

    // ♥ Bookmarks filter
    const bmFilterBtn = document.createElement('button');
    bmFilterBtn.className = 'ch-btn ch-btn-bm' + (bookmarksMode ? ' active' : '');
    bmFilterBtn.textContent = '♥';
    bmFilterBtn.title = window._uiLang === 'en' ? 'Bookmarks' : 'నచ్చిన శ్లోకాలు';
    bmFilterBtn.addEventListener('click', async () => {
      bookmarksMode = !bookmarksMode;
      if (bookmarksMode) { keyVersesMode = false; extraChapterMode = null; selectedChs.clear(); hideChapterSummary(); }
      updateChBtnStates();
      if (bookmarksMode) activateBookmarksFilter();
      else pickRandom();
    });
    wrap.appendChild(bmFilterBtn);

    // Extra pseudo-chapter chip (🙏 Dhyāna Ślokas / 📜 Geetha Māhātmyam).
    // Not a real chapter number — clicking it loads its own JSON file as
    // the pool, same UX as clicking a numbered chapter button.
    function makeExtraChip(cfg) {
      const btn = document.createElement('button');
      btn.className = 'ch-btn ch-btn-extra' + (extraChapterMode === cfg.id ? ' active' : '');
      const label = window._uiLang === 'en' ? cfg.label_en : cfg.label_te;
      btn.textContent = `${cfg.icon} ${label}`;
      btn.dataset.extra = cfg.id;
      btn.title = label;
      btn.addEventListener('click', async () => {
        keyVersesMode = false;
        bookmarksMode = false;
        selectedChs.clear();
        const wasSelected = extraChapterMode === cfg.id;
        extraChapterMode = wasSelected ? null : cfg.id;
        updateChBtnStates();
        hideChapterSummary();
        if (!wasSelected) {
          const shlokas = await loadExtraChapter(cfg.id);
          if (shlokas.length) { pool = shlokas; renderVerse(shlokas[0]); return; }
        }
        pickRandom();
      });
      return btn;
    }
    C.GITA_EXTRA_CHAPTERS.filter(c => c.position === 'before').forEach(cfg => wrap.appendChild(makeExtraChip(cfg)));

    for (const entry of idx.chapters) {
      const btn = document.createElement('button');
      btn.className = 'ch-btn';
      btn.textContent = entry.chapter;
      btn.dataset.ch = entry.chapter;
      btn.addEventListener('click', async () => {
        keyVersesMode = false;
        bookmarksMode = false;
        extraChapterMode = null;
        const wasSelected = selectedChs.has(entry.chapter);
        selectedChs.clear();
        if (!wasSelected) selectedChs.add(entry.chapter);
        updateChBtnStates();
        if (selectedChs.size === 1) showChapterSummary([...selectedChs][0]);
        else hideChapterSummary();
        if (!wasSelected) {
          const chData = await loadChapter(entry.chapter);
          const shlokas = chData.shlokas || [];
          if (shlokas.length) { pool = shlokas; renderVerse(shlokas[0]); return; }
        }
        pickRandom();
      });
      wrap.appendChild(btn);
    }

    C.GITA_EXTRA_CHAPTERS.filter(c => c.position === 'after').forEach(cfg => wrap.appendChild(makeExtraChip(cfg)));
  }

  // ── Chapter summary card ──────────────────────────────────────
  async function loadBgMetaChapters() {
    if (bgMetaChapters) return bgMetaChapters;
    const meta = await loadBgMeta();
    bgMetaChapters = {};
    (meta.chapters || []).forEach(ch => { bgMetaChapters[ch.ch] = ch; });
    return bgMetaChapters;
  }

  async function showChapterSummary(chNum) {
    let card = $('r-ch-summary');
    if (!card) {
      card = document.createElement('div');
      card.id = 'r-ch-summary';
      card.className = 'ch-summary-card';
      $('r-ch-wrap')?.after(card);
    }
    const script = window._script || 'te';
    const lang   = window._uiLang === 'en' ? 'en' : 'te';
    const meta   = await loadBgMetaChapters();
    const ch     = meta[chNum];
    const chData = await loadChapter(chNum);
    if (!ch) { card.hidden = true; return; }

    const nameKey = script === 'ro' ? 'ro' : script === 'sa' ? 'sa' : 'te';
    const yogaName = chData.title?.[nameKey] || chData.title?.ro || '';
    const phalashruti = ch.phalashruti?.[lang] || ch.phalashruti?.en || '';

    // Speaker breakdown
    const speakers = {};
    (chData.shlokas || []).forEach(sh => {
      if (sh.speaker) speakers[sh.speaker] = (speakers[sh.speaker] || 0) + 1;
    });
    const speakerHtml = Object.entries(speakers).map(([sp, cnt]) => {
      const badge = { krishna:'badge-krishna', arjuna:'badge-arjuna', sanjaya:'badge-sanjaya', dhritarashtra:'badge-dhritarashtra' }[sp] || 'badge-krishna';
      return `<span class="badge ${badge}">${sp} ${cnt}</span>`;
    }).join(' ');

    card.innerHTML = `
      <div class="ch-summary-yoga">${yogaName}</div>
      <div class="ch-summary-meta">${ch.verses} ${lang === 'te' ? 'శ్లోకాలు' : 'verses'} · ${speakerHtml}</div>
      ${phalashruti ? `<div class="ch-summary-phalashruti">${phalashruti}</div>` : ''}
    `;
    card.hidden = false;
  }

  function hideChapterSummary() {
    const card = $('r-ch-summary');
    if (card) card.hidden = true;
  }

  function updateRangedGroupBtns(wrap, id) {
    const state = rs(id);
    wrap.querySelector('.ch-btn.all')?.classList.toggle('active', state.selectedGroups.size === 0 && !bookmarksMode);
    wrap.querySelector('.ch-btn-bm')?.classList.toggle('active', bookmarksMode);
    wrap.querySelectorAll('.ch-btn[data-key]').forEach(btn => {
      btn.classList.toggle('active', state.selectedGroups.has(btn.dataset.key));
    });
  }

  function updateChBtnStates() {
    const wrap = $('r-ch-wrap');
    if (!wrap) return;
    const isNoneActive = selectedChs.size === 0 && !keyVersesMode && !bookmarksMode && !extraChapterMode;
    const allBtn = wrap.querySelector('.ch-btn.all');
    if (allBtn) allBtn.classList.toggle('active', isNoneActive);
    wrap.querySelector('.ch-btn-star')?.classList.toggle('active', keyVersesMode);
    wrap.querySelector('.ch-btn-bm')?.classList.toggle('active', bookmarksMode);
    wrap.querySelectorAll('.ch-btn[data-ch]').forEach(btn => {
      btn.classList.toggle('active', selectedChs.has(Number(btn.dataset.ch)));
    });
    wrap.querySelectorAll('.ch-btn[data-extra]').forEach(btn => {
      btn.classList.toggle('active', extraChapterMode === btn.dataset.extra);
    });
    // Reading-progress badge and VOTD card only make sense for the 700
    // real Gita verses, not the pseudo-chapters.
    const pb = $('r-progress-badge'); if (pb) pb.hidden = !!extraChapterMode;
    if (extraChapterMode) { const vc = $('r-votd-card'); if (vc) vc.hidden = true; }
  }

  // ── Verse rendering ───────────────────────────────────────────
  function renderVerse(sh) {
    current = sh;
    // gita verses share .c+.s; vsn/sl only have .s (both undefined .c would
    // otherwise false-match every verse against each other)
    const idx = pool.findIndex(x => (activeText === 'gita' ? x.c === sh.c : true) && x.s === sh.s);
    if (idx !== -1) currentPos = idx;
    const box = $('r-verse-box'); if (box) box.style.display = '';
    const es = $('r-empty-state'); if (es) es.style.display = 'none';
    const mw = $('r-meaning-wrap'); if (mw) mw.style.display = '';
    const script = window._script || 'te';

    const refEl = $('r-verse-ref');
    if (isRangedText(activeText)) {
      const cfg = C.TEXTS[activeText];
      refEl.innerHTML = '';
      const vBadge = document.createElement('span');
      vBadge.className = 'badge badge-shloka';
      vBadge.textContent = `${cfg.badgePrefix || activeText.toUpperCase()} · ${sh.s}`;
      refEl.appendChild(vBadge);

      // Optional "section" sub-badge (e.g. SL's Ānanda Laharī / Saundarya
      // Laharī split) — data-driven via a `section: true` flag on
      // qualifying entries in the text's ranges array.
      if (cfg.grouping === 'ranges') {
        const grp = (C[cfg.ranges] || []).find(g => g.section && sh.s >= g.from && sh.s <= g.to);
        if (grp) {
          const secBadge = document.createElement('span');
          secBadge.className = 'ref-title';
          secBadge.textContent = grp.label;
          refEl.appendChild(secBadge);
        }
      }

      // VSN-only extras: names-count + nakshatra badges. Genuinely unique
      // to VSN's own data/feature set (Avadhānam nakshatra modal, name
      // token counts) — not part of the generic ranged-text shape, so
      // they stay an explicit per-id hook rather than generalized.
      if (activeText === 'vsn') {
        const cntBadge = document.createElement('span');
        cntBadge.className = 'badge badge-names-count';
        cntBadge.style.display = 'none';
        refEl.appendChild(cntBadge);
        loadVsnNameCountMap().then(map => {
          const cnt = map.get(sh.s);
          if (cnt) { cntBadge.textContent = `${cnt} ${t('names_count')}`; cntBadge.style.display = ''; }
        });

        const nkNum  = Math.ceil(sh.s / 4);
        const padNum = (sh.s - 1) % 4 + 1;
        const nkBadge = document.createElement('span');
        nkBadge.className = 'badge badge-nakshatra';
        nkBadge.style.display = 'none';
        nkBadge.style.cursor  = 'pointer';
        refEl.appendChild(nkBadge);
        fetch(C.NAKSHATRAS).then(r => r.json()).then(nks => {
          const nk = nks.find(n => n.num === nkNum);
          const nkName = nk ? (nk.name.sa ? Transliterate.convert(nk.name.sa, 'sa', script) : nk.name.te) : `Nakshatra ${nkNum}`;
          const syllObj = nk && nk.sound_syllables ? nk.sound_syllables[`p${padNum}`] : null;
          const syllable = syllObj ? (syllObj.sa ? Transliterate.convert(syllObj.sa, 'sa', script) : syllObj.te || '') : '';
          nkBadge.textContent = `★ ${nkName} · ${t('pada')} ${padNum}${syllable ? ` · ${syllable}` : ''}`;
          nkBadge.style.display = '';
          nkBadge.onclick = () => Avadhaanam.showNakshatraModal(nkNum, padNum);
        });
      }
    } else if (sh._extra) {
      // Pseudo-chapter verse (dhyana/mahatyam) — no chapter number, so
      // skip the sh.c-based badge/title below.
      refEl.innerHTML = '';
      const cfg = C.GITA_EXTRA_CHAPTERS.find(e => e.id === sh._extra);
      const vBadge = document.createElement('span');
      vBadge.className = 'badge badge-shloka';
      vBadge.textContent = `${cfg ? cfg.icon : sh._extra} · ${sh.s}`;
      refEl.appendChild(vBadge);

      // Speaker is a plain {te,ro,sa} text object for these texts, unlike
      // the enum-keyed speaker badges gita chapters use.
      if (sh.speaker) {
        const spBadge = document.createElement('span');
        spBadge.className = 'ref-title';
        const key = script === 'sa' ? 'sa' : script === 'ro' ? 'ro' : 'te';
        spBadge.textContent = sh.speaker[key] || sh.speaker.ro || '';
        refEl.appendChild(spBadge);
      }
    } else {
      refEl.innerHTML = `
        <span class="badge badge-ch">${sh.c}</span>
        <span class="badge badge-shloka">${sh.s}</span>
        <span class="ref-title">${chapterTitle(sh)}</span>
      `;
      if (sh.speaker) {
        const badge = document.createElement('span');
        badge.className = `badge ${speakerBadgeClass(sh.speaker)}`;
        badge.textContent = speakerLabel(sh.speaker);
        refEl.appendChild(badge);
      }
      if (KEY_VERSE_IDS.has(`${sh.c}.${sh.s}`)) {
        const starBadge = document.createElement('span');
        starBadge.className = 'badge badge-key';
        starBadge.textContent = '⭐';
        refEl.appendChild(starBadge);
      }
    }

    // Bookmark button (both Gita and VSN)
    {
      const bms  = getBookmarks();
      const vid  = verseId(sh);
      const isBookmarked = bms.has(vid);
      const bmBtn = document.createElement('button');
      bmBtn.className = 'bm-btn' + (isBookmarked ? ' active' : '');
      bmBtn.title = window._uiLang === 'en' ? 'Bookmark' : 'సేవ్ చేయి';
      bmBtn.textContent = isBookmarked ? '♥' : '♡';
      bmBtn.addEventListener('click', () => {
        const bms2 = getBookmarks();
        if (bms2.has(vid)) { bms2.delete(vid); bmBtn.textContent = '♡'; bmBtn.classList.remove('active'); }
        else               { bms2.add(vid);    bmBtn.textContent = '♥'; bmBtn.classList.add('active'); }
        saveBookmarks(bms2);
        if (bookmarksMode) {
          if (getBookmarks().size === 0) buildChapterGrid();
        }
      });
      refEl.appendChild(bmBtn);
    }

    const verseEl = $('r-verse-text');
    verseEl.innerHTML = '';
    // Pada count is usually 4 (p1-p4), but Geetha Māhātmyam verse 6 has
    // 6 padas (p1-p6) — derive the actual keys instead of hardcoding.
    const padaKeys = Object.keys(sh)
      .filter(k => /^p\d+$/.test(k))
      .sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));
    // Half-verse texts (h1/h2 — e.g. Sankshepa Ramayanam, which keeps each
    // verse as two halves rather than guessed quarter-padas) get a mid
    // danda after the first half instead of every-2nd-pada.
    const halfKeys = padaKeys.length ? [] : Object.keys(sh)
      .filter(k => /^h\d+$/.test(k))
      .sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));
    padaKeys.forEach((pk, i) => {
      const span = document.createElement('span');
      span.className = 'verse-pada';
      let text = padaText(sh[pk], script);
      if (sh[pk] && sh[pk].cont) text += '-';
      const isLast = i === padaKeys.length - 1;
      if (!isLast && (i + 1) % 2 === 0) text += ' ।';
      if (isLast) text += sh.c ? ` ॥ ${sh.c}.${sh.s} ॥` : ` ॥${sh.s}॥`;
      span.textContent = text;
      verseEl.appendChild(span);
    });
    halfKeys.forEach((hk, i) => {
      const span = document.createElement('span');
      span.className = 'verse-pada';
      let text = padaText(sh[hk], script);
      const isLast = i === halfKeys.length - 1;
      if (!isLast) text += ' ।';
      if (isLast) text += ` ॥${sh.s}॥`;
      span.textContent = text;
      verseEl.appendChild(span);
    });

    renderMeaning(sh);
    renderConclusion(sh);
    renderNotesPanel(sh);
    if (_pendingHighlight) { highlightVerseName(_pendingHighlight); _pendingHighlight = null; }
    if (_pendingSearchHL) { const p = _pendingSearchHL; _pendingSearchHL = null; setTimeout(() => highlightSearchQuery(p.q, p.scope), 250); }
    saveLastVerse(sh);
  }

  function renderConclusion(sh) {
    const wrap = $('r-conclusion-wrap');
    if (!wrap) return;
    if (activeText !== 'gita') { wrap.style.display = 'none'; return; }
    const chData = chapterCache[sh.c];
    if (!chData || !chData.conclusion) { wrap.style.display = 'none'; return; }
    const shlokas = chData.shlokas || [];
    const lastS   = shlokas[shlokas.length - 1]?.s;
    if (sh.s !== lastS) { wrap.style.display = 'none'; return; }

    const script  = window._script || 'te';
    const lang    = window._meaningLang || 'en';
    const c       = chData.conclusion;
    const text    = script === 'ro' ? c.ro : script === 'sa' ? c.sa : c.te;
    const meaning = c.meaning?.[lang]?.short || c.meaning?.en?.short || '';

    $('r-conclusion-text').textContent    = text;
    $('r-conclusion-meaning').textContent = meaning;
    wrap.style.display = '';
  }

  let _pendingHighlight   = null;
  let _pendingSearchHL    = null;

  function showNameBackBtn(nameLabel) {
    let btn = $('r-name-back-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'r-name-back-btn';
      btn.className = 'r-name-back-btn';
      $('r-verse-box')?.before(btn);
    }
    btn.textContent = '← ' + nameLabel;
    btn.style.display = '';
    btn.onclick = () => {
      $('bg-meta-details')?.setAttribute('open', '');
      // Open names section and scroll to it
      const namesSec = $('bg-ml-names')?.closest('details');
      if (namesSec) namesSec.open = true;
      setTimeout(() => $('bg-ml-names')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      btn.style.display = 'none';
    };
  }

  function highlightVerseName(nameIast) {
    const verseEl = $('r-verse-text');
    if (!verseEl) return;
    // Build search terms: iast form + simple normalisation
    const norm = s => s.toLowerCase()
      .replace(/[āáà]/g,'a').replace(/[īíì]/g,'i').replace(/[ūúù]/g,'u')
      .replace(/[ṭṭ]/g,'t').replace(/[ḍḍ]/g,'d').replace(/[ṇṇ]/g,'n')
      .replace(/[śṣ]/g,'s').replace(/[ṛṛ]/g,'r').replace(/[ñṅ]/g,'n')
      .replace(/[ḥ]/g,'h').replace(/[ṃṁ]/g,'m');
    const target = norm(nameIast);
    let found = false;
    verseEl.querySelectorAll('.verse-pada').forEach(span => {
      const t = norm(span.textContent);
      if (!found && t.includes(target)) {
        span.classList.add('verse-pada-highlight');
        found = true;
        setTimeout(() => span.classList.remove('verse-pada-highlight'), 2500);
      }
    });
    if (!found) {
      // Flash the whole verse box
      verseEl.classList.add('verse-box-flash');
      setTimeout(() => verseEl.classList.remove('verse-box-flash'), 900);
    }
  }

  function highlightSearchQuery(query, scope) {
    if (!query) return;
    // Build diacritic-tolerant regex: each Latin char optionally matches its accented variants
    const dMap = {
      a:'[aāáàäâã]',i:'[iīíìïî]',u:'[uūúùüû]',e:'[eéèëê]',o:'[oóòöô]',
      r:'[rṛ]',n:'[nṇṅñ]',s:'[sśṣ]',t:'[tṭ]',d:'[dḍ]',
      m:'[mṃṁ]',h:'[hḥ]',l:'[lḷ]'
    };
    const q = query.trim();
    if (!q) return;
    const pattern = q.toLowerCase().split('').map(c => dMap[c] || c.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('');
    const re = new RegExp(pattern, 'gi');

    function hlText(text) {
      return text.replace(new RegExp(pattern, 'gi'), m => `<mark class="search-hl">${m}</mark>`);
    }
    function applyHL(el) {
      if (!el) return;
      // Use innerHTML replacement on leaf text containers (safe — content is from trusted JSON)
      if (!el.querySelector('*')) {
        // Leaf element — replace text directly
        const t = el.textContent;
        if (new RegExp(pattern,'i').test(t)) el.innerHTML = hlText(t);
      } else {
        el.querySelectorAll('*').forEach(child => {
          if (!child.querySelector('*')) {
            const t = child.textContent;
            if (new RegExp(pattern,'i').test(t)) child.innerHTML = hlText(t);
          }
        });
      }
    }

    if (scope === 'verse' || scope === 'both') {
      $('r-verse-text')?.querySelectorAll('.verse-pada').forEach(span => applyHL(span));
    }
    if (scope === 'meaning' || scope === 'both') {
      applyHL($('r-meaning-short'));
    }

    // Clear on next navigation (handled by renderVerse resetting innerHTML)
  }

  function renderMeaning(sh) {
    const lang  = window._meaningLang || 'en';
    const mtype = document.querySelector('#r-mtype-group .pill.active')?.dataset.mtype || 'short';
    const out   = $('r-meaning-short');

    // VSN shloka: show names + meanings (show names even if meanings not yet added)
    if (activeText === 'vsn' && sh) {
      loadVsnNames().then(() => {
        const verseNames = vsnNames.filter(n => n.sh === sh.s);
        if (!verseNames.length) { out.style.display = 'none'; return; }
        const script = window._script || 'te';
        const frag = document.createDocumentFragment();
        verseNames.forEach(n => {
          const nameText = n.name[script] || n.name.ro || '';
          const mean = n.meaning || {};
          const short = (lang === 'te' ? mean.te : lang === 'sa' ? mean.sa : mean.en) || mean.en || '';
          const detail = (lang === 'te' ? mean.te_d : lang === 'sa' ? mean.sa_d : mean.en_d) || '';
          const m = mtype === 'long' ? [short, detail].filter(Boolean).join(' — ') : short;
          const row = document.createElement('div');
          row.className = 'vsn-name-meaning-row';
          row.innerHTML = `<span class="vsn-nm-name">${nameText}</span><span class="vsn-nm-sep"> = </span><span class="vsn-nm-meaning">${m || '…'}</span>`;
          frag.appendChild(row);
        });
        out.innerHTML = '';
        out.appendChild(frag);
        out.style.display = '';
      });
      return;
    }

    if (!sh || !sh.meaning) { out.style.display = 'none'; return; }
    const m = sh.meaning[lang] || sh.meaning.en;
    if (!m) { out.style.display = 'none'; return; }

    if (mtype === 'wbw') {
      // wbw usually lives at m.wbw (English-only, BG's original shape).
      // Newer texts (dhyana-slokas, geetha-mahatyam) store it as a
      // top-level sibling of `meaning`, keyed per language: sh.wbw[lang].
      const wbwRows = (m.wbw && m.wbw.length) ? m.wbw
                    : (sh.wbw && sh.wbw[lang] && sh.wbw[lang].length) ? sh.wbw[lang]
                    : null;
      if (!wbwRows) {
        out.innerHTML = lang !== 'en'
          ? `<span class="meaning-empty wbw-note">పద×పదం అర్థం English లో మాత్రమే లభ్యం. / Word-by-word only available in English.</span>`
          : `<span class="meaning-empty">${t('no_meaning')}</span>`;
        out.style.display = '';
        return;
      }
      const uiLang = window._uiLang || 'te';
      const table = document.createElement('table');
      table.className = 'wbw-table';
      table.innerHTML = `<tr><th>${uiLang === 'te' ? 'పదం' : 'Word'}</th><th>${uiLang === 'te' ? 'వ్యాకరణం' : 'Grammar'}</th><th>${uiLang === 'te' ? 'అర్థం' : 'Meaning'}</th></tr>`;
      wbwRows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.word}</td><td>${row.grammar}</td><td>${row.meaning}</td>`;
        table.appendChild(tr);
      });
      out.innerHTML = '';
      out.appendChild(table);
    } else if (mtype === 'long') {
      out.textContent = m.long || m.short || t('no_meaning');
    } else {
      out.textContent = m.short || t('no_meaning');
    }
    out.style.display = '';
  }

  // ── Navigation ────────────────────────────────────────────────
  async function pickRandom() {
    await loadSelectedChapters();
    if (!pool.length) return;
    currentPos = Math.floor(Math.random() * pool.length);
    renderVerse(pool[currentPos]);
  }

  function navPrev() {
    if (!pool.length) return;
    currentPos = (currentPos - 1 + pool.length) % pool.length;
    renderVerse(pool[currentPos]);
  }

  function navNext() {
    if (!pool.length) return;
    currentPos = (currentPos + 1) % pool.length;
    renderVerse(pool[currentPos]);
  }

  function playAudio() {
    if (!current) return;
    const ch = chapterCache[current.c];
    if (!ch || !ch.audio) return;
    let url = ch.audio;
    if (current.audio_ts) url += (url.includes('?') ? '&' : '?') + `t=${current.audio_ts}`;
    window.open(url, '_blank', 'noopener');
  }

  // ── Last-visited persistence ──────────────────────────────────
  const LS_KEY       = 'gita_last_verse';
  const LS_SEEN_KEY  = 'smriti_seen';

  function getSeenSet() {
    try { return new Set(JSON.parse(localStorage.getItem(LS_SEEN_KEY) || '[]')); } catch(e) { return new Set(); }
  }

  function saveLastVerse(sh) {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ text: activeText, ch: sh.c, s: sh.s, extra: sh._extra || null })); } catch(e) {}
    // Track reading progress (Gita only; 700 total)
    if (activeText === 'gita' && sh.c && sh.s) {
      try {
        const seen = getSeenSet();
        seen.add(`${sh.c}.${sh.s}`);
        localStorage.setItem(LS_SEEN_KEY, JSON.stringify([...seen]));
        updateProgressBadge(seen.size);
      } catch(e) {}
    }
  }

  function updateProgressBadge(count) {
    const el = document.getElementById('r-progress-badge');
    if (el) el.textContent = `${count} / 700`;
  }

  // ── Personal notes ────────────────────────────────────────────
  const LS_NOTES_KEY = 'smriti_notes';

  function getNotes() {
    try { return JSON.parse(localStorage.getItem(LS_NOTES_KEY) || '{}'); } catch(e) { return {}; }
  }
  function saveNote(id, text) {
    const notes = getNotes();
    if (text.trim()) notes[id] = text.trim();
    else delete notes[id];
    try { localStorage.setItem(LS_NOTES_KEY, JSON.stringify(notes)); } catch(e) {}
  }

  function renderNotesPanel(sh) {
    const wrap = document.getElementById('r-notes-wrap');
    if (!wrap || !sh) return;
    const id  = verseId(sh);
    const en  = window._uiLang === 'en';
    const saved = getNotes()[id] || '';

    wrap.innerHTML = `
      <details class="notes-details" ${saved ? 'open' : ''}>
        <summary class="notes-summary">
          <span class="notes-icon">${saved ? '✎' : '✎'}</span>
          <span class="notes-label">${en ? 'My note' : 'నా గమనిక'}</span>
          ${saved ? '<span class="notes-dot">●</span>' : ''}
        </summary>
        <textarea class="notes-ta" id="r-notes-ta" rows="3"
          placeholder="${en ? 'Write your note here…' : 'మీ గమనిక ఇక్కడ రాయండి…'}">${saved}</textarea>
        <div class="notes-actions">
          <button class="notes-save" id="r-notes-save">${en ? 'Save' : 'సేవ్'}</button>
          ${saved ? `<button class="notes-clear" id="r-notes-clear">${en ? 'Clear' : 'తొలగించు'}</button>` : ''}
        </div>
      </details>
    `;

    document.getElementById('r-notes-save')?.addEventListener('click', () => {
      const text = document.getElementById('r-notes-ta')?.value || '';
      saveNote(id, text);
      renderNotesPanel(sh);
    });
    document.getElementById('r-notes-clear')?.addEventListener('click', () => {
      saveNote(id, '');
      renderNotesPanel(sh);
    });
  }

  async function restoreLastVerse() {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
      if (!saved) return false;
      if (isRangedText(saved.text) && saved.s) {
        activeText = saved.text;
        const sel = $('r-text-select'); if (sel) sel.value = saved.text;
        buildChapterGrid();
        const shlokas = await loadRangedText(saved.text);
        const target = shlokas.find(x => x.s === saved.s);
        if (target) { pool = shlokas; renderVerse(target); return true; }
      } else if (saved.text === 'gita' && saved.extra && saved.s) {
        activeText = 'gita';
        extraChapterMode = saved.extra;
        await buildChapterGrid();
        updateChBtnStates();
        const shlokas = await loadExtraChapter(saved.extra);
        const target = shlokas.find(x => x.s === saved.s);
        if (target) { pool = shlokas; renderVerse(target); return true; }
      } else if (saved.text === 'gita' && saved.ch && saved.s) {
        const chData = await loadChapter(saved.ch);
        const shlokas = chData.shlokas || [];
        const target = shlokas.find(x => x.s === saved.s);
        if (target) { pool = shlokas; renderVerse(target); return true; }
      }
    } catch(e) {}
    return false;
  }


  // ── Focus mode ────────────────────────────────────────────────
  function toggleFocusMode() {
    const on = document.body.classList.toggle('focus-mode');
    const btn = $('r-focus-btn');
    if (btn) btn.textContent = on ? '⊠' : '⛶';
  }

  // ── VOTD card ─────────────────────────────────────────────────
  function showVotdCard(sh) {
    const isVsn = !sh.c;
    let card = $('r-votd-card');
    if (!card) {
      card = document.createElement('div');
      card.id = 'r-votd-card';
      card.className = 'votd-card';
      $('r-verse-box')?.before(card);
    }
    const en     = window._uiLang === 'en';
    const script = window._script || 'te';
    const line1  = padaText(sh.p1, script) + ' |';
    const line2  = padaText(sh.p2, script) + ' ।';
    const ml     = window._meaningLang || 'en';
    const short  = sh.meaning?.[ml]?.short || sh.meaning?.en?.short || sh.meaning?.te?.short || '';
    const ref    = isVsn ? `VSN · ${sh.s}` : `${sh.c}.${sh.s}`;
    const gotoLabel = en ? 'Read in context →' : 'శ్లోకానికి వెళ్ళు →';
    card.innerHTML = `
      <div class="votd-header">
        <span class="votd-sun">☀</span>
        <span class="votd-label">${en ? "Today's Verse" : 'నేటి శ్లోకం'}</span>
        <span class="votd-ref">${ref}</span>
        <button class="votd-close" id="r-votd-close">✕</button>
      </div>
      <div class="votd-verse">${line1}<br>${line2}…</div>
      ${short ? `<div class="votd-meaning">${short}</div>` : ''}
      <button class="votd-goto" id="r-votd-goto">${gotoLabel}</button>
    `;
    card.hidden = false;
    $('r-votd-close')?.addEventListener('click', () => { card.hidden = true; });
    $('r-votd-goto')?.addEventListener('click', () => {
      card.hidden = true;
      if (isVsn) {
        if (activeText !== 'vsn') {
          activeText = 'vsn';
          const sel = $('r-text-select'); if (sel) sel.value = 'vsn';
          buildChapterGrid();
        }
        loadVsn().then(shlokas => {
          const target = shlokas.find(x => +x.s === +sh.s);
          if (target) { pool = shlokas; renderVerse(target); }
        });
      } else {
        if (activeText !== 'gita') {
          activeText = 'gita';
          const sel = $('r-text-select'); if (sel) sel.value = 'gita';
          buildChapterGrid();
        }
        loadChapter(sh.c).then(chData => {
          const target = (chData.shlokas || []).find(x => +x.s === +sh.s);
          if (target) { pool = chData.shlokas; renderVerse(target); }
        });
      }
    });
  }

  async function loadAndShowVotd() {
    const idx = todayVerseIndex();
    const idxData = await loadIndex();
    let offset = idx;
    for (const entry of idxData.chapters) {
      const chData = await loadChapter(entry.chapter);
      const shlokas = chData.shlokas || [];
      if (offset < shlokas.length) { _votdSh = shlokas[offset]; showVotdCard(_votdSh); return; }
      offset -= shlokas.length;
    }
  }

  async function checkGitaJayanti() {
    try {
      const r = await fetch(C.EKADASHI, { cache: 'no-store' });
      const data = await r.json();
      const today = new Date().toISOString().slice(0, 10);
      let jayanti = null;
      for (const yr of Object.values(data.dates || {})) {
        for (const e of yr) {
          if (e.id === 'mokshada') {
            const diff = (new Date(e.date) - new Date(today)) / 86400000;
            if (diff >= -1 && diff <= 3) { jayanti = e; break; }
          }
        }
        if (jayanti) break;
      }
      if (!jayanti) return;
      const en = window._uiLang === 'en';
      const banner = document.createElement('div');
      banner.id = 'r-jayanti-banner';
      banner.className = 'jayanti-banner';
      banner.innerHTML = `
        <span class="jayanti-icon">🌟</span>
        <span class="jayanti-text">${en ? 'Gītā Jayantī — ' + jayanti.date : 'గీతా జయంతి — ' + jayanti.date}</span>
        <button class="jayanti-goto" id="r-jayanti-goto">18.66 →</button>
        <button class="jayanti-close" id="r-jayanti-close">✕</button>
      `;
      $('r-verse-box')?.before(banner);
      $('r-jayanti-close')?.addEventListener('click', () => banner.remove());
      $('r-jayanti-goto')?.addEventListener('click', () => {
        banner.remove();
        if (activeText !== 'gita') { activeText = 'gita'; const sel = $('r-text-select'); if (sel) sel.value = 'gita'; buildChapterGrid(); }
        loadChapter(18).then(chData => {
          const target = (chData.shlokas || []).find(x => +x.s === 66);
          if (target) { pool = chData.shlokas; renderVerse(target); }
        });
      });
    } catch(e) {}
  }

  async function loadAndShowVsnVotd() {
    const shlokas = await loadVsn();
    if (!shlokas.length) return;
    const idx = Math.floor(Date.now() / 86400000) % shlokas.length;
    _votdVsnSh = shlokas[idx];
    showVotdCard(_votdVsnSh);
  }

  // ── Today's verse ─────────────────────────────────────────────
  function todayVerseIndex() {
    const daysSinceEpoch = Math.floor(Date.now() / 86400000);
    return daysSinceEpoch % 700; // 0-699
  }

  async function goToTodayVerse() {
    const idx = todayVerseIndex();
    // Map index → chapter + shloka across all 18 chapters
    const idxData = await loadIndex();
    let offset = idx;
    for (const entry of idxData.chapters) {
      const chData = await loadChapter(entry.chapter);
      const shlokas = chData.shlokas || [];
      if (offset < shlokas.length) {
        if (activeText !== 'gita') {
          activeText = 'gita';
          const sel = $('r-text-select'); if (sel) sel.value = 'gita';
          buildChapterGrid();
        }
        pool = shlokas;
        renderVerse(shlokas[offset]);
        $('r-verse-box')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      offset -= shlokas.length;
    }
  }

  // ── Public init ───────────────────────────────────────────────
  function init() {
    buildChapterGrid();
    updateTextSelectLabels();

    // ☀ Today's verse pill — shows/hides the VOTD card
    const todayBtn = document.createElement('button');
    todayBtn.id = 'r-today-btn';
    todayBtn.className = 'pill';
    todayBtn.title = "Today's verse";
    todayBtn.textContent = '☀';
    $('r-random')?.parentElement?.insertBefore(todayBtn, $('r-random'));
    todayBtn.addEventListener('click', () => {
      const card = $('r-votd-card');
      if (card && !card.hidden) { card.hidden = true; }
      else if (activeText === 'vsn') { loadAndShowVsnVotd(); }
      else if (activeText === 'sl') { /* no SL votd feed */ }
      else { loadAndShowVotd(); }
    });

    // Reading progress badge — inserted after the nav row
    const progressBadge = document.createElement('div');
    progressBadge.id = 'r-progress-badge';
    progressBadge.className = 'r-progress-badge';
    const initialSeen = getSeenSet();
    progressBadge.textContent = `${initialSeen.size} / 700`;
    document.getElementById('r-verse-box')?.after(progressBadge);

    // ⛶ Focus mode button — appended after the → nav button
    const focusBtn = document.createElement('button');
    focusBtn.id = 'r-focus-btn';
    focusBtn.className = 'nav-btn';
    focusBtn.title = 'Focus / Chanting mode';
    focusBtn.textContent = '⛶';
    $('r-next')?.after(focusBtn);
    focusBtn.addEventListener('click', toggleFocusMode);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.body.classList.contains('focus-mode')) toggleFocusMode();
    });

    // ↗ Share button — appended to nav row before focus btn
    const shareBtn = document.createElement('button');
    shareBtn.id = 'r-share-btn';
    shareBtn.className = 'nav-btn';
    shareBtn.title = 'Share verse card';
    shareBtn.textContent = '↗';
    focusBtn.before(shareBtn);
    shareBtn.addEventListener('click', async () => {
      if (!current) return;
      // Share module builds the card payload itself (incl. VSN's daily-card
      // h1/h2/names lookup) -- reader.js just hands over the verse + which text.
      Share.shareVerse(current, activeText);
    });

    // Restore last visited verse, or load ch1.s1 for first-timers; then show VOTD card
    restoreLastVerse().then(restored => {
      if (!restored) {
        loadChapter(1).then(chData => {
          const shlokas = chData.shlokas || [];
          if (shlokas.length) { pool = shlokas; renderVerse(shlokas[0]); }
          else pickRandom();
        }).catch(pickRandom);
      }
      const cfg0 = C.TEXTS[activeText];
      if (activeText === 'vsn') {
        loadAndShowVsnVotd();
      } else if ((cfg0 && !cfg0.hasVotd) || extraChapterMode) {
        const vc = $('r-votd-card'); if (vc) vc.hidden = true;
      } else {
        loadAndShowVotd();
      }
      // 700-verse progress tracking is a Gita-specific concept — hide for
      // every other text/pseudo-chapter, not just vsn/sl.
      const pb0 = $('r-progress-badge'); if (pb0) pb0.hidden = (activeText !== 'gita' || !!extraChapterMode);
      checkGitaJayanti();
    });

    $('r-random').addEventListener('click', pickRandom);
    $('r-prev').addEventListener('click', navPrev);
    $('r-next').addEventListener('click', () => { resetAutoAdvance(); navNext(); });
    $('r-play').addEventListener('click', playAudio);

    // Auto-advance
    let _aaTimer = null;
    function resetAutoAdvance() {
      clearTimeout(_aaTimer);
      const aa = window._autoAdvance || { on: false, secs: 9 };
      if (aa.on) _aaTimer = setTimeout(() => { navNext(); resetAutoAdvance(); }, aa.secs * 1000);
    }
    const _origRender = renderVerse;
    window.addEventListener('autoAdvanceChange', e => {
      window._autoAdvance = e.detail;
      clearTimeout(_aaTimer);
      if (e.detail.on) resetAutoAdvance();
    });
    // Restart timer on any navigation
    const _patchNav = () => resetAutoAdvance();
    $('r-prev').addEventListener('click', _patchNav);
    $('r-random').addEventListener('click', _patchNav);
    if (window._autoAdvance?.on) resetAutoAdvance();

    const textSel = $('r-text-select');
    if (textSel) {
      textSel.addEventListener('change', () => {
        activeText = textSel.value;
        selectedChs.clear();
        Object.values(rangedState).forEach(s => s.selectedGroups.clear());
        buildChapterGrid();
        if (isRangedText(activeText)) {
          loadRangedText(activeText).then(shlokas => { if (shlokas.length) { pool = shlokas; renderVerse(shlokas[0]); } });
        } else {
          pickRandom();
        }
        const isVsn = activeText === 'vsn';
        const cfg = C.TEXTS[activeText];
        const hasVotd = !!(cfg && cfg.hasVotd);
        const namesBtn = $('r-vsn-names-btn'); if (namesBtn) namesBtn.style.display = isVsn ? '' : 'none';
        const pb = $('r-progress-badge'); if (pb) pb.hidden = activeText !== 'gita';
        // Switch VOTD to match text mode — texts that opt out (hasVotd
        // false/unset, e.g. SL) just get the card hidden.
        const vc = $('r-votd-card');
        if (isVsn) { if (_votdVsnSh) showVotdCard(_votdVsnSh); else loadAndShowVsnVotd(); }
        else if (!hasVotd) { if (vc) vc.hidden = true; }
        else { if (vc) vc.hidden = true; if (_votdSh) showVotdCard(_votdSh); else loadAndShowVotd(); }
      });
    }

    // Names toggle button (visible only when VSN is selected)
    const namesBtn = $('r-vsn-names-btn');
    if (namesBtn) {
      if (activeText === 'vsn') namesBtn.style.display = '';
      namesBtn.addEventListener('click', () => {
        VsnModule?.init();
        $('r-content').style.display = 'none';
        const nv = $('vsn-names');
        if (nv) { nv.style.display = 'flex'; nv.style.flexDirection = 'column'; }
      });
    }

    // Back button inside names view (injected after VsnModule renders)
    document.addEventListener('vsn-rendered', () => {
      const nv = $('vsn-names');
      if (!nv || nv.querySelector('#r-names-back')) return;
      const back = document.createElement('button');
      back.id = 'r-names-back';
      back.className = 'r-names-back-btn';
      back.textContent = '← ' + t('help_back').replace('← ','');
      back.addEventListener('click', () => {
        nv.style.display = 'none';
        $('r-content').style.display = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      nv.insertBefore(back, nv.firstChild);
    }, { once: false });

    // Autoplay video when meta panel opens; pause when closed
    const metaDetails = $('vsn-meta-details');
    if (metaDetails) {
      metaDetails.addEventListener('toggle', () => {
        const frame = $('vsn-video-frame');
        if (!frame || !frame.src.includes('embed/')) return;
        const base = frame.src.replace(/[?&]autoplay=\d/, '');
        frame.src = metaDetails.open
          ? base + (base.includes('?') ? '&' : '?') + 'autoplay=1'
          : base;
      });
    }

    window.addEventListener('scriptChange', () => {
      updateTextSelectLabels();
      if (current) renderVerse(current);
      if (activeText === 'vsn' && vsnMeta) renderVsnAbout(vsnMeta, window._script || 'te');
      if (activeText === 'gita' && bgMeta) renderBgAbout(bgMeta, window._script || 'te');
      const vc = $('r-votd-card'); if (_votdSh && vc && !vc.hidden) showVotdCard(_votdSh);
    });

    window.addEventListener('readerNavigate', async e => {
      const { text, sh, ch, s, highlightName, hlQuery, hlScope } = e.detail;
      if (highlightName) _pendingHighlight = highlightName;
      if (hlQuery) _pendingSearchHL = { q: hlQuery, scope: hlScope || 'both' };
      const sel = $('r-text-select');
      if (isRangedText(text)) {
        if (activeText !== text) {
          activeText = text;
          if (sel) sel.value = text;
          buildChapterGrid();
        }
        const shlokas = await loadRangedText(text);
        const target  = shlokas.find(x => x.s === sh);
        if (target) { pool = shlokas; renderVerse(target); }
      } else if (C.GITA_EXTRA_CHAPTERS.some(e => e.id === text)) {
        // Dhyāna Ślokas / Geetha Māhātmyam pseudo-chapter — e.g. from a
        // Library bookmark tap (see library.js's goTo/parseId).
        if (activeText !== 'gita' || extraChapterMode !== text) {
          activeText = 'gita';
          extraChapterMode = text;
          if (sel) sel.value = 'gita';
          await buildChapterGrid();
          updateChBtnStates();
        }
        const shlokas = await loadExtraChapter(text);
        const target  = shlokas.find(x => x.s === sh);
        if (target) { pool = shlokas; renderVerse(target); }
      } else {
        if (activeText !== 'gita') {
          activeText = 'gita';
          if (sel) sel.value = 'gita';
          buildChapterGrid();
        }
        const chData  = await loadChapter(ch);
        const shlokas = chData.shlokas || [];
        const target  = shlokas.find(x => +x.s === s);
        if (target) {
          pool = shlokas; renderVerse(target);
          // If navigated from a name chip, close bg panel and scroll to verse
          if (highlightName) {
            $('bg-meta-details')?.removeAttribute('open');
            showNameBackBtn(highlightName);
            setTimeout(() => $('r-name-back-btn')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
          }
        }
      }
    });
    document.querySelectorAll('#r-mtype-group .pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#r-mtype-group .pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (current) renderMeaning(current);
      });
    });
    window.addEventListener('meaningLangChange', () => {
      if (current) { renderMeaning(current); renderConclusion(current); }
      const vc = $('r-votd-card'); if (_votdSh && vc && !vc.hidden) showVotdCard(_votdSh);
    });
    window.addEventListener('uiLangChange', () => {
      buildChapterGrid();
      if (current) renderVerse(current);
      const vc = $('r-votd-card'); if (_votdSh && vc && !vc.hidden) showVotdCard(_votdSh);
    });
  }

  return { init, renderVerse, getCurrentShloka: () => current };
})();
