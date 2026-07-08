/* avadhaanam.js — Avadhānam tab: test modes, reveal, nakshatra panel */

const Avadhaanam = (() => {
  let chapterCache = {};
  let nakshatras   = null;
  let allShlokas   = [];
  let vsnShlokas   = [];
  let vsnNames     = [];
  let pool         = [];
  let selectedChs  = new Set();
  let vsnSelectedGroups     = new Set(); // empty = All; keyed by grp.from
  let vsnNameSelectedGroups = new Set(); // empty = All; keyed by grp.from
  let vsnNameCountMap       = null;     // shloka_num → name count, loaded once
  let current      = null;
  let currentPos   = 0;
  let revealed     = false;
  let activeText   = 'gita';

  const $ = id => document.getElementById(id);

  // ── Bookmark helpers (shared key with reader.js) ──────────────
  const BM_KEY = 'smriti_bookmarks';
  function getBM()      { try { return new Set(JSON.parse(localStorage.getItem(BM_KEY) || '[]')); } catch(e) { return new Set(); } }
  function saveBM(set)  { try { localStorage.setItem(BM_KEY, JSON.stringify([...set])); } catch(e) {} }
  function avId(sh)     { return activeText === 'vsn' ? `vsn.${sh.s}` : `${sh.c}.${sh.s}`; }

  // ── Helpers ───────────────────────────────────────────────────
  function padaText(pada, script) {
    if (!pada) return '';
    const s = script || window._script || 'te';
    return pada[s] || pada.ro || '';
  }

  function speakerBadgeClass(spk) {
    return { krishna:'badge-krishna', arjuna:'badge-arjuna',
             sanjaya:'badge-sanjaya', dhritarashtra:'badge-dhritarashtra' }[spk] || 'badge-krishna';
  }

  // Issue #10: speaker label follows lipi, not UI lang
  function speakerLabel(spk) {
    const script = window._script || 'te';
    const key = script === 'sa' ? 'sa' : script === 'ro' ? 'ro' : 'te';
    return (C.SPEAKER_LABEL[spk] && C.SPEAKER_LABEL[spk][key]) || spk;
  }

  // Issue #10: chapter title follows lipi script
  function chapterTitle(sh) {
    const chData = chapterCache[sh.c];
    if (!chData) return `Ch ${sh.c}`;
    const script = window._script || 'te';
    const key = script === 'sa' ? 'sa' : script === 'ro' ? 'ro' : 'te';
    return chData.title?.[key] || chData.title?.en || `Ch ${sh.c}`;
  }

  function refText(item) {
    if (activeText !== 'gita') {
      if (item.name) return `VSN · నామం · ${item.n}`;  // namavali entry
      return `VSN · ${item.s}`;
    }
    return `${item.c} · ${item.s} · ${chapterTitle(item)}`;
  }

  // ── Data loading ──────────────────────────────────────────────
  async function loadChapter(num) {
    if (chapterCache[num]) return chapterCache[num];
    const r = await fetch(C.CHAPTER_PATH(num));
    const data = await r.json();
    chapterCache[num] = data;
    return data;
  }

  async function loadNakshatras() {
    if (nakshatras) return nakshatras;
    const r = await fetch(C.NAKSHATRAS);
    nakshatras = await r.json();
    return nakshatras;
  }

  async function loadGitaAll() {
    if (allShlokas.length) return;
    for (let c = 1; c <= 18; c++) {
      const ch = await loadChapter(c);
      allShlokas.push(...ch.shlokas);
    }
  }

  async function loadVsn() {
    if (vsnShlokas.length) return vsnShlokas;
    try {
      const r = await fetch(C.VSN_SHLOKAS);
      const data = await r.json();
      vsnShlokas = data.shlokas || [];
    } catch (e) {
      console.warn('VSN shlokas not available:', e);
      vsnShlokas = [];
    }
    return vsnShlokas;
  }

  async function loadVsnNames() {
    if (vsnNames.length) return vsnNames;
    try {
      const r = await fetch(C.VSN_NAMES);
      const data = await r.json();
      vsnNames = data.names || [];
    } catch (e) {
      console.warn('VSN names not available:', e);
      vsnNames = [];
    }
    return vsnNames;
  }

  async function loadVsnNameCountMap() {
    if (vsnNameCountMap) return vsnNameCountMap;
    const names = await loadVsnNames();
    vsnNameCountMap = new Map();
    names.forEach(n => vsnNameCountMap.set(n.sh, (vsnNameCountMap.get(n.sh) || 0) + 1));
    return vsnNameCountMap;
  }

  function isNameMode() {
    const m = getMode();
    return m === 'name' || m === 'namenum';
  }

  async function buildPool() {
    if (activeText === 'gita') {
      if (selectedChs.size === 0) {
        await loadGitaAll();
        pool = [...allShlokas];
      } else {
        pool = [];
        for (const num of selectedChs) {
          const ch = await loadChapter(num);
          pool.push(...ch.shlokas);
        }
      }
      pool.sort((a, b) => a.c !== b.c ? a.c - b.c : a.s - b.s);
    } else if (isNameMode()) {
      await loadVsnNames();
      if (vsnNameSelectedGroups.size === 0) {
        pool = [...vsnNames];
      } else {
        pool = vsnNames.filter(na =>
          C.VSN_NAME_GROUPS.some(g => vsnNameSelectedGroups.has(g.from) && na.n >= g.from && na.n <= g.to)
        );
      }
    } else {
      await loadVsn();
      if (vsnSelectedGroups.size === 0) {
        pool = [...vsnShlokas];
      } else {
        pool = vsnShlokas.filter(sh =>
          C.VSN_GROUPS.some(g => vsnSelectedGroups.has(g.from) && sh.s >= g.from && sh.s <= g.to)
        );
      }
    }
  }

  // ── Text select ───────────────────────────────────────────────
  // Issue #12: text dropdown labels follow lipi
  function updateTextSelectLabels() {
    const sel = $('a-text-select');
    if (!sel) return;
    const script = window._script || 'te';
    const key = script === 'sa' ? 'sa' : script === 'ro' ? 'ro' : 'te';
    const gitaOpt = sel.querySelector('option[value="gita"]');
    const vsnOpt  = sel.querySelector('option[value="vsn"]');
    if (gitaOpt) gitaOpt.textContent = C.TEXT_LABELS.gita[key] || 'Bhagavad Gita';
    if (vsnOpt)  vsnOpt.textContent  = C.TEXT_LABELS.vsn[key]  || 'Vishnu Sahasranama';
  }

  // ── Chapter / group button grid ───────────────────────────────
  function buildChapterGrid() {
    const wrap = $('a-ch-wrap');
    if (!wrap) return;
    wrap.innerHTML = '';

    if (activeText === 'gita') {
      const allBtn = document.createElement('button');
      allBtn.className = 'ch-btn all' + (selectedChs.size === 0 ? ' active' : '');
      allBtn.textContent = t('all');
      allBtn.addEventListener('click', () => {
        selectedChs.clear();
        updateChBtns();
        pickRandom();
      });
      wrap.appendChild(allBtn);

      for (let i = 1; i <= 18; i++) {
        const btn = document.createElement('button');
        btn.className = 'ch-btn' + (selectedChs.has(i) ? ' active' : '');
        btn.textContent = i;
        btn.dataset.ch = i;
        btn.addEventListener('click', () => {
          selectedChs.has(i) ? selectedChs.delete(i) : selectedChs.add(i);
          updateChBtns();
          // Issue #5: auto-pick random verse on chapter select
          pickRandom();
        });
        wrap.appendChild(btn);
      }
    } else if (isNameMode()) {
      const allBtn = document.createElement('button');
      allBtn.className = 'ch-btn all' + (vsnNameSelectedGroups.size === 0 ? ' active' : '');
      allBtn.textContent = t('all');
      allBtn.addEventListener('click', () => {
        vsnNameSelectedGroups.clear();
        updateVsnNameGroupBtns(wrap);
        buildPool().then(() => pickRandom());
      });
      wrap.appendChild(allBtn);
      C.VSN_NAME_GROUPS.forEach(grp => {
        const btn = document.createElement('button');
        btn.className = 'ch-btn' + (vsnNameSelectedGroups.has(grp.from) ? ' active' : '');
        btn.textContent = grp.label;
        btn.dataset.from = grp.from;
        btn.addEventListener('click', () => {
          vsnNameSelectedGroups.has(grp.from) ? vsnNameSelectedGroups.delete(grp.from) : vsnNameSelectedGroups.add(grp.from);
          updateVsnNameGroupBtns(wrap);
          buildPool().then(() => pickRandom());
        });
        wrap.appendChild(btn);
      });
    } else {
      const allBtn = document.createElement('button');
      allBtn.className = 'ch-btn all' + (vsnSelectedGroups.size === 0 ? ' active' : '');
      allBtn.textContent = t('all');
      allBtn.addEventListener('click', () => {
        vsnSelectedGroups.clear();
        updateVsnGroupBtns(wrap);
        buildPool().then(() => pickRandom());
      });
      wrap.appendChild(allBtn);
      C.VSN_GROUPS.forEach(grp => {
        const btn = document.createElement('button');
        btn.className = 'ch-btn' + (vsnSelectedGroups.has(grp.from) ? ' active' : '');
        btn.textContent = grp.label;
        btn.dataset.from = grp.from;
        btn.addEventListener('click', () => {
          vsnSelectedGroups.has(grp.from) ? vsnSelectedGroups.delete(grp.from) : vsnSelectedGroups.add(grp.from);
          updateVsnGroupBtns(wrap);
          buildPool().then(() => pickRandom());
        });
        wrap.appendChild(btn);
      });
    }
  }

  function updateChBtns() {
    const wrap = $('a-ch-wrap');
    if (!wrap) return;
    wrap.querySelector('.ch-btn.all')?.classList.toggle('active', selectedChs.size === 0);
    wrap.querySelectorAll('.ch-btn[data-ch]').forEach(btn => {
      btn.classList.toggle('active', selectedChs.has(Number(btn.dataset.ch)));
    });
  }

  function updateVsnGroupBtns(wrap) {
    wrap.querySelector('.ch-btn.all')?.classList.toggle('active', vsnSelectedGroups.size === 0);
    wrap.querySelectorAll('.ch-btn[data-from]').forEach(btn => {
      btn.classList.toggle('active', vsnSelectedGroups.has(Number(btn.dataset.from)));
    });
  }

  function updateVsnNameGroupBtns(wrap) {
    wrap.querySelector('.ch-btn.all')?.classList.toggle('active', vsnNameSelectedGroups.size === 0);
    wrap.querySelectorAll('.ch-btn[data-from]').forEach(btn => {
      btn.classList.toggle('active', vsnNameSelectedGroups.has(Number(btn.dataset.from)));
    });
  }

  // ── Test mode dropdown ────────────────────────────────────────
  function buildModeSelect() {
    const sel = $('a-mode-select');
    if (!sel) return;
    sel.innerHTML = '';
    const modes = activeText === 'gita' ? C.TEST_MODES_GITA : C.TEST_MODES_VSN;
    // Follow lipi: Devanagari/Telugu use Telugu labels; IAST uses English
    const script = window._script || 'te';
    const useTe = script !== 'ro';
    modes.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = useTe ? m.label_te : m.label_en;
      sel.appendChild(opt);
    });
    const saved = Settings.get(C.LS.TEST_MODE, 'pada1');
    if ([...sel.options].some(o => o.value === saved)) sel.value = saved;
  }

  function getMode() {
    return $('a-mode-select')?.value || 'pada1';
  }

  // ── Verse rendering ───────────────────────────────────────────
  function renderCurrent() {
    if (!current) return;
    const mode   = getMode();
    const script = window._script || 'te';
    revealed     = false;

    // Ref row: badges built fresh each render (no static elements inside refEl)
    const refEl = $('a-verse-ref');
    refEl.innerHTML = '';
    if (activeText === 'gita') {
      const chBadge = document.createElement('span');
      chBadge.className = 'badge badge-ch';
      chBadge.textContent = current.c;
      const sBadge = document.createElement('span');
      sBadge.className = 'badge badge-shloka';
      sBadge.textContent = current.s;
      const titleSpan = document.createElement('span');
      titleSpan.className = 'ref-title';
      titleSpan.textContent = chapterTitle(current);
      refEl.appendChild(chBadge);
      refEl.appendChild(sBadge);
      refEl.appendChild(titleSpan);
      if (current.speaker) {
        const spkBadge = document.createElement('span');
        spkBadge.className = `badge ${speakerBadgeClass(current.speaker)}`;
        spkBadge.textContent = speakerLabel(current.speaker);
        refEl.appendChild(spkBadge);
      }
    } else if (current.name) {
      // Namavali entry
      const nBadge = document.createElement('span');
      nBadge.className = 'badge badge-shloka';
      nBadge.textContent = `# ${current.n}`;
      refEl.appendChild(nBadge);
      const lbl = document.createElement('span');
      lbl.className = 'ref-title';
      lbl.textContent = t('namavali');
      refEl.appendChild(lbl);
    } else {
      const sBadge = document.createElement('span');
      sBadge.className = 'badge badge-shloka';
      sBadge.textContent = `VSN · ${current.s}`;
      refEl.appendChild(sBadge);
      // Names count badge — filled async
      const cntBadge = document.createElement('span');
      cntBadge.className = 'badge badge-names-count';
      cntBadge.style.display = 'none';
      refEl.appendChild(cntBadge);
      loadVsnNameCountMap().then(map => {
        const cnt = map.get(current.s);
        if (cnt) { cntBadge.textContent = `${cnt} ${t('names_count')}`; cntBadge.style.display = ''; }
      });
    }

    // Bookmark button
    {
      const vid = avId(current);
      const isBookmarked = getBM().has(vid);
      const bmBtn = document.createElement('button');
      bmBtn.className = 'bm-btn' + (isBookmarked ? ' active' : '');
      bmBtn.title = window._uiLang === 'en' ? 'Bookmark' : 'సేవ్ చేయి';
      bmBtn.textContent = isBookmarked ? '♥' : '♡';
      bmBtn.addEventListener('click', () => {
        const bms = getBM();
        if (bms.has(vid)) { bms.delete(vid); bmBtn.textContent = '♡'; bmBtn.classList.remove('active'); }
        else              { bms.add(vid);    bmBtn.textContent = '♥'; bmBtn.classList.add('active'); }
        saveBM(bms);
      });
      refEl.appendChild(bmBtn);
    }

    // Nakshatra badge appended to refEl (VSN only, created fresh)
    let nkBadge = null;
    if (activeText !== 'gita') {
      nkBadge = document.createElement('span');
      nkBadge.id = 'a-naksh-badge';
      nkBadge.className = 'badge badge-nakshatra';
      nkBadge.style.display = 'none';
      refEl.appendChild(nkBadge);
    }

    const verseEl   = $('a-verse-text');
    const hintEl    = $('a-verse-hint');
    const promptBox = $('a-prompt-box');

    verseEl.innerHTML = '';
    promptBox.style.display = 'none';

    // Highlight the entire word in text that contains the name or any sandhi variant.
    // Variants tried: (1) full name, (2) stem without ః, (3) stem without initial vowel (avagraha elision).
    function highlightHtml(text, name) {
      if (!name) return null;
      const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const stem = name.endsWith('ః') ? name.slice(0, -1)   // Telugu
                 : name.endsWith('ः') ? name.slice(0, -1)   // Devanagari
                 : name;
      const teVowels = 'అఆఇఈఉఊఋఌఎఏఐఒఓఔ';
      const dnVowels = 'अआइईउऊऋॠऌएऐओऔ';
      const initIsVowel = teVowels.includes(stem[0]) || dnVowels.includes(stem[0]);
      const stemNoInit  = (initIsVowel && stem.length > 2) ? stem.slice(1) : null;

      // Split preserving whitespace, check each non-space token against variants
      const tokens = text.split(/(\s+)/);
      let matched = false;
      const result = tokens.map(tok => {
        if (/\s/.test(tok)) return esc(tok);
        if (tok.includes(name) || tok.includes(stem) ||
            (stemNoInit && tok.includes(stemNoInit))) {
          matched = true;
          return `<mark class="name-hl">${esc(tok)}</mark>`;
        }
        return esc(tok);
      }).join('');
      return matched ? result : null;
    }

    // Populate nakshatra star badge for a given VSN shloka number
    function populateNkBadge(shNum) {
      if (!nkBadge) return;
      const nkNum  = Math.ceil(shNum / 4);
      const padNum = (shNum - 1) % 4 + 1;
      loadNakshatras().then(nks => {
        const nk = nks.find(n => n.num === nkNum);
        const nkName = nk ? (script === 'ro' ? nk.name.iast : (nk.name.te || nk.name.iast)) : `Nakshatra ${nkNum}`;
        const syllObj = nk && nk.sound_syllables ? nk.sound_syllables[`p${padNum}`] : null;
        const syllable = syllObj ? (script === 'ro' ? syllObj.iast : (syllObj.te || syllObj.iast)) : '';
        nkBadge.textContent = `★ ${nkName} · ${t('pada')} ${padNum}${syllable ? ` · ${syllable}` : ''}`;
        nkBadge.style.display = '';
        nkBadge.style.cursor  = 'pointer';
        nkBadge.onclick = () => showNakshatraModal(nkNum, padNum);
      });
    }

    // Render 4 hidden shloka spans for a VSN shloka, with optional name highlight
    function renderVsnHiddenShlokaSpans(sh, sc, nameForHighlight) {
      ['p1','p2','p3','p4'].forEach(pk => {
        const span = document.createElement('span');
        span.className = 'verse-pada hidden';
        let text = sh[pk] ? (sh[pk][sc] || sh[pk].ro || '') : '';
        if (pk === 'p2') text += ' ।';
        if (pk === 'p4') text += ` ॥${sh.s}॥`;
        const html = nameForHighlight ? highlightHtml(text, nameForHighlight) : null;
        if (html) span.dataset.html = html; else span.dataset.text = text;
        verseEl.appendChild(span);
      });
    }

    // Helper to make a pada span with ।॥ c.s ॥
    function makePadaSpan(pk, i, hidden) {
      const span = document.createElement('span');
      let text = padaText(current[pk], script);
      if (current[pk] && current[pk].cont) text += '-';
      if (pk === 'p2') text += ' ।';
      if (pk === 'p4') text += current.c ? ` ॥ ${current.c}.${current.s} ॥` : ` ॥${current.s}॥`;

      if (hidden) {
        span.className = 'verse-pada hidden';
        span.setAttribute('data-hint', `p${i + 1}`);
        span.dataset.text = text;
      } else {
        span.className = 'verse-pada';
        span.textContent = text;
      }
      return span;
    }

    // ── VSN Namavali modes ────────────────────────────────────────
    if (activeText === 'vsn' && current.name) {
      // Nakshatra badge from the shloka this name belongs to
      populateNkBadge(current.sh);
      // current is a name entry {n, sh, name, dative, chant}
      const nameText  = current.name[script]  || current.name.ro  || '';
      const chantText = current.chant[script] || current.chant.ro || '';

      if (mode === 'namenum') {
        // Show name number; pre-render 4 hidden shloka spans for fixed height
        promptBox.style.display = '';
        $('a-prompt-label').textContent = t('prompt_namenum');
        $('a-prompt-value').textContent = `# ${current.n}`;
        // Render 4 empty placeholders immediately (fixed height), fill async
        ['p1','p2','p3','p4'].forEach(() => {
          const span = document.createElement('span');
          span.className = 'verse-pada hidden';
          verseEl.appendChild(span);
        });
        loadVsn().then(shlokas => {
          const sh = shlokas.find(s => s.s === current.sh);
          if (!sh) return;
          const spans = verseEl.querySelectorAll('.verse-pada.hidden');
          ['p1','p2','p3','p4'].forEach((pk, i) => {
            let text = sh[pk] ? (sh[pk][script] || sh[pk].ro || '') : '';
            if (pk === 'p2') text += ' ।';
            if (pk === 'p4') text += ` ॥${sh.s}॥`;
            const html = highlightHtml(text, nameText);
            if (html) spans[i].dataset.html = html; else spans[i].dataset.text = text;
          });
        });
      } else {
        // mode === 'name': show name + akshara count + chant form, then 4 hidden shloka spans
        const nameSpan = document.createElement('span');
        nameSpan.className = 'verse-pada name-prompt';
        if (current.akshara) {
          nameSpan.textContent = `${nameText}`;
          const akBadge = document.createElement('sup');
          akBadge.className = 'akshara-badge';
          akBadge.textContent = current.akshara;
          nameSpan.appendChild(akBadge);
        } else {
          nameSpan.textContent = nameText;
        }
        verseEl.appendChild(nameSpan);

        // Chant form: OM <dative> namaḥ ।
        const chantText = current.chant ? (current.chant[script] || current.chant.ro || '') : '';
        if (chantText) {
          const chantSpan = document.createElement('span');
          chantSpan.className = 'verse-pada chant-line';
          chantSpan.textContent = chantText;
          verseEl.appendChild(chantSpan);
        }

        ['p1','p2','p3','p4'].forEach(() => {
          const span = document.createElement('span');
          span.className = 'verse-pada hidden';
          verseEl.appendChild(span);
        });
        loadVsn().then(shlokas => {
          const sh = shlokas.find(s => s.s === current.sh);
          if (!sh) return;
          const spans = verseEl.querySelectorAll('.verse-pada.hidden');
          ['p1','p2','p3','p4'].forEach((pk, i) => {
            let text = sh[pk] ? (sh[pk][script] || sh[pk].ro || '') : '';
            if (pk === 'p2') text += ' ।';
            if (pk === 'p4') text += ` ॥${sh.s}॥`;
            const html = highlightHtml(text, nameText);
            if (html) spans[i].dataset.html = html; else spans[i].dataset.text = text;
          });
        });
      }
      hintEl.textContent = t('hint_reveal');
      hintEl.style.display = '';

    // ── Shloka modes (p1–p4) — Gita and VSN ─────────────────────
    } else if (mode.startsWith('pada')) {
      if (activeText === 'vsn') populateNkBadge(current.s);
      const shownIdx = parseInt(mode[4]) - 1;

      ['p1','p2','p3','p4'].forEach((pk, i) => {
        verseEl.appendChild(makePadaSpan(pk, i, i !== shownIdx));
      });

      hintEl.textContent = t('hint_reveal');
      hintEl.style.display = '';

    } else if (mode === 'versenum') {
      if (activeText === 'vsn') populateNkBadge(current.s);
      promptBox.style.display = '';
      $('a-prompt-label').textContent = t('prompt_versenum');
      $('a-prompt-value').textContent = current.c ? `${current.c}.${current.s}` : `VSN ${current.s}`;
      renderHiddenAll(verseEl, script);
      hintEl.textContent = t('hint_reveal');
      hintEl.style.display = '';

    } else if (mode === 'alpha') {
      const p1text = padaText(current.p1, script);
      promptBox.style.display = '';
      $('a-prompt-label').textContent = t('prompt_alpha');
      $('a-prompt-value').textContent = p1text.split(' ')[0];
      renderHiddenAll(verseEl, script);
      hintEl.textContent = t('hint_reveal');
      hintEl.style.display = '';

    } else if (mode === 'uvacha') {
      promptBox.style.display = '';
      $('a-prompt-label').textContent = t('prompt_uvacha');
      $('a-prompt-value').textContent = `${speakerLabel(current.speaker)} — ${chapterTitle(current)}`;
      renderHiddenAll(verseEl, script);
      hintEl.textContent = t('hint_reveal');
      hintEl.style.display = '';

    } else if (mode === 'firstverse') {
      promptBox.style.display = '';
      $('a-prompt-label').textContent = t('prompt_firstverse');
      $('a-prompt-value').textContent = chapterTitle(current);
      const first = pool.find(s => s.c === current.c && s.s === 1) || current;
      current = first;
      refEl.innerHTML = `
        <span class="badge badge-ch">${current.c}</span>
        <span class="badge badge-shloka">${current.s}</span>
        <span class="ref-title">${chapterTitle(current)}</span>
      `;
      renderHiddenAll(verseEl, script);
      hintEl.textContent = t('hint_reveal');
      hintEl.style.display = '';

    } else if (mode === 'lastverse') {
      promptBox.style.display = '';
      $('a-prompt-label').textContent = t('prompt_lastverse');
      $('a-prompt-value').textContent = chapterTitle(current);
      const chShlokas = pool.filter(s => s.c === current.c);
      const last = chShlokas[chShlokas.length - 1] || current;
      current = last;
      refEl.innerHTML = `
        <span class="badge badge-ch">${current.c}</span>
        <span class="badge badge-shloka">${current.s}</span>
        <span class="ref-title">${chapterTitle(current)}</span>
      `;
      renderHiddenAll(verseEl, script);
      hintEl.textContent = t('hint_reveal');
      hintEl.style.display = '';

    } else if (mode === 'nakshatra') {
      const nkNum   = Math.ceil(current.s / 4);
      const padaNum = (current.s - 1) % 4 + 1;
      loadNakshatras().then(nks => {
        const nk = nks.find(n => n.num === nkNum);
        const nkName = nk ? (script === 'ro' ? nk.name.iast : (nk.name.te || nk.name.iast)) : `Nakshatra ${nkNum}`;
        promptBox.style.display = '';
        $('a-prompt-label').textContent = t('prompt_nakshatra');
        $('a-prompt-value').textContent = `${nkName} · ${t('pada')} ${padaNum}`;
      });
      renderHiddenAll(verseEl, script);
      hintEl.textContent = t('hint_reveal');
      hintEl.style.display = '';

    } else if (mode === 'namerev') {
      // First name of shloka → recall full verse; pool = shlokas
      populateNkBadge(current.s);
      renderHiddenAll(verseEl, script);
      loadVsnNames().then(names => {
        const firstName = names.find(n => n.sh === current.s);
        if (!firstName) return;
        const nameText = firstName.name[script] || firstName.name.ro || '';
        promptBox.style.display = '';
        $('a-prompt-label').textContent = t('prompt_namerev');
        $('a-prompt-value').textContent = nameText;
        // Update hidden spans to include highlight where name appears
        verseEl.querySelectorAll('.verse-pada.hidden').forEach(span => {
          const text = span.dataset.text || '';
          const html = highlightHtml(text, nameText);
          if (html) { span.dataset.html = html; delete span.dataset.text; }
        });
      });
      hintEl.textContent = t('hint_reveal');
      hintEl.style.display = '';
    }


    renderMeaning(current);
  }

  function renderHiddenAll(verseEl, script) {
    ['p1','p2','p3','p4'].forEach((pk, i) => {
      const span = document.createElement('span');
      span.className = 'verse-pada hidden';
      span.setAttribute('data-hint', `p${i + 1}`);
      let text = padaText(current[pk], script);
      if (current[pk] && current[pk].cont) text += '-';
      if (pk === 'p2') text += ' ।';
      if (pk === 'p4') text += current.c ? ` ॥ ${current.c}.${current.s} ॥` : ` ॥${current.s}॥`;
      span.dataset.text = text;
      verseEl.appendChild(span);
    });
  }

  function revealAll() {
    if (revealed) {
      renderCurrent();
      return;
    }
    revealed = true;
    const verseEl = $('a-verse-text');

    verseEl.querySelectorAll('.verse-pada.hidden').forEach(span => {
      span.classList.remove('hidden');
      if (span.dataset.html) {
        span.innerHTML = span.dataset.html;
      } else {
        span.textContent = span.dataset.text || '';
      }
    });

    $('a-verse-hint').textContent = t('hint_revealed');
  }

  // ── Meaning rendering ─────────────────────────────────────────
  function renderMeaning(sh) {
    const lang  = window._meaningLang || 'en';
    const mtype = document.querySelector('#a-mtype-group .pill.active')?.dataset.mtype || 'short';
    const out   = $('a-meaning-out');

    // VSN shloka: show names + meanings for names in this verse
    if (activeText === 'vsn' && sh && !sh.name) {
      const shNum = sh.s;
      out.innerHTML = '';
      loadVsnNames().then(names => {
        const verseNames = names.filter(n => n.sh === shNum);
        if (!verseNames.length) { out.innerHTML = `<span class="meaning-empty">${t('no_meaning')}</span>`; return; }
        const script = window._script || 'te';
        const frag = document.createDocumentFragment();
        verseNames.forEach(n => {
          const nameText = n.name[script] || n.name.ro || '';
          const m = n.meaning ? (n.meaning[lang] || n.meaning.en || '') : '';
          const row = document.createElement('div');
          row.className = 'vsn-name-meaning-row';
          row.innerHTML = `<span class="vsn-nm-name">${nameText}</span><span class="vsn-nm-sep"> = </span><span class="vsn-nm-meaning">${m || '…'}</span>`;
          frag.appendChild(row);
        });
        out.innerHTML = '';
        out.appendChild(frag);
      });
      return;
    }

    // VSN name entry: show meaning for just this name
    if (activeText === 'vsn' && sh && sh.name) {
      const m = sh.meaning ? (sh.meaning[lang] || sh.meaning.en || '') : '';
      out.textContent = m || t('no_meaning');
      return;
    }

    if (!sh || !sh.meaning) {
      out.innerHTML = `<span class="meaning-empty">${t('no_meaning')}</span>`;
      return;
    }
    const m = sh.meaning[lang] || sh.meaning.en;
    if (!m) {
      out.innerHTML = `<span class="meaning-empty">${t('no_meaning')}</span>`;
      return;
    }
    // Issue #14: WBW only available in EN
    if (mtype === 'wbw') {
      if (lang !== 'en') {
        out.innerHTML = `<span class="meaning-empty wbw-note">పద×పదం అర్థం English లో మాత్రమే లభ్యం. / Word-by-word only available in English.</span>`;
        return;
      }
      if (!m.wbw || !m.wbw.length) {
        out.innerHTML = `<span class="meaning-empty">${t('no_meaning')}</span>`;
        return;
      }
      const table = document.createElement('table');
      table.className = 'wbw-table';
      const uiLang = window._uiLang || 'te';
      table.innerHTML = `<tr><th>${uiLang === 'te' ? 'పదం' : 'Word'}</th><th>${uiLang === 'te' ? 'వ్యాకరణం' : 'Grammar'}</th><th>${uiLang === 'te' ? 'అర్థం' : 'Meaning'}</th></tr>`;
      m.wbw.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.word}</td><td>${row.grammar}</td><td>${row.meaning}</td>`;
        table.appendChild(tr);
      });
      out.innerHTML = '';
      out.appendChild(table);
    } else if (mtype === 'short') {
      out.textContent = m.short || t('no_meaning');
    } else if (mtype === 'long') {
      out.textContent = m.long || m.short || t('no_meaning');
    }
  }

  // ── Navigation ────────────────────────────────────────────────
  async function pickRandom() {
    await buildPool();
    if (!pool.length) return;
    currentPos = Math.floor(Math.random() * pool.length);
    current = pool[currentPos];
    renderCurrent();
  }

  function navPrev() {
    if (!pool.length || !current) return;
    currentPos = (currentPos - 1 + pool.length) % pool.length;
    current = pool[currentPos];
    renderCurrent();
  }

  function navNext() {
    if (!pool.length || !current) return;
    currentPos = (currentPos + 1) % pool.length;
    current = pool[currentPos];
    renderCurrent();
  }

  function playAudio() {
    if (!current) return;
    const ch = chapterCache[current.c];
    if (!ch || !ch.audio) return;
    let url = ch.audio;
    if (current.audio_ts) url += (url.includes('?') ? '&' : '?') + `t=${current.audio_ts}`;
    window.open(url, '_blank', 'noopener');
  }

  // ── Nakshatra modal ───────────────────────────────────────────
  // ── Focus mode (avadhānam) ────────────────────────────────────
  function toggleAvFocusMode() {
    const on = document.body.classList.toggle('focus-mode');
    const btn = $('a-focus');
    if (btn) btn.textContent = on ? '⊠' : '⛶';
  }

  let _lastNkNum = null, _lastPadNum = null;

  async function showNakshatraModal(num, padNum) {
    _lastNkNum = num; _lastPadNum = padNum;
    const nks = await loadNakshatras();
    const nk = nks.find(n => n.num === num);
    if (!nk) return;
    const script = window._script || 'te';
    const isRo = script === 'ro';
    const isDn = script === 'sa';

    // name: IAST for ro, Devanagari for dn, Telugu otherwise
    const primaryName = isRo ? nk.name.iast : (isDn ? (nk.name.sa || nk.name.iast) : (nk.name.te || nk.name.iast));
    $('nm-name-te').textContent   = primaryName;
    $('nm-name-iast').textContent = `${nk.name.iast} · Nakshatra ${nk.num} of 27`;
    $('nm-stars').textContent     = `${nk.stars} star${nk.stars > 1 ? 's' : ''}`;
    $('nm-shape').textContent     = (nk.symbol && nk.symbol.en) || '';

    // _pri: primary script field; _sub: subtitle (iast or en)
    const _pri = o => (o && (isRo ? (o.iast || o.en) : (isDn ? (o.sa || o.iast) : (o.te || o.iast)))) || '';
    const _sub = o => (o && (o.iast || o.en)) || '';
    const _set = (id, val) => { const el = $(id); if (el) el.textContent = val; };

    _set('nm-rashi-symbol', (nk.rashi && nk.rashi.symbol) || '');
    _set('nm-rashi-te',        _pri(nk.rashi));
    _set('nm-rashi-en',        _sub(nk.rashi));
    _set('nm-graha-te',        _pri(nk.nakshatra_graha));
    _set('nm-graha-iast',      _sub(nk.nakshatra_graha));
    _set('nm-deity-te',        _pri(nk.nakshatra_deity));
    _set('nm-deity-en',        _sub(nk.nakshatra_deity));
    _set('nm-gana-te',         _pri(nk.gana));
    _set('nm-gana-iast',       _sub(nk.gana));
    _set('nm-tattva-te',       _pri(nk.tattva));
    _set('nm-tattva-en',       (nk.tattva && nk.tattva.en) || '');
    _set('nm-dosha-te',        _pri(nk.dosha));
    _set('nm-nadi-te',         _pri(nk.nadi));
    _set('nm-animal-te',       _pri(nk.nakshatra_animal));
    _set('nm-animal-iast',     _sub(nk.nakshatra_animal));
    _set('nm-varna-te',        _pri(nk.varna));
    _set('nm-varna-iast',      _sub(nk.varna));
    _set('nm-pur-te',          _pri(nk.purushardha));
    _set('nm-pur-iast',        _sub(nk.purushardha));
    _set('nm-gem-te',          _pri(nk.gemstone));
    _set('nm-gem-en',          (nk.gemstone && nk.gemstone.en) || '');
    _set('nm-rashi-lord-te',   _pri(nk.rashi_lord));
    _set('nm-rashi-lord-iast', _sub(nk.rashi_lord));

    const shRange = `${nk.vsn_shloka_from}–${nk.vsn_shloka_to}`;
    const syllables = nk.sound_syllables
      ? Object.entries(nk.sound_syllables)
          .map(([p, v]) => {
            const highlight = padNum && p === `p${padNum}` ? '→ ' : '';
            const syll = isRo ? (v.iast || v.te) : (isDn ? (v.sa || v.iast) : (v.te || v.iast));
            return `${highlight}${syll}`;
          }).join('  ')
      : '';
    const parts = [`${t('nm_vsn_shlokas')}: ${shRange}`];
    if (syllables) parts.push(syllables);
    $('nm-vsn').textContent = parts.join('  ·  ');

    const mantraEl = $('nm-mantra');
    if (mantraEl) {
      const mantraText = nk.mantra
        ? (isRo ? nk.mantra.iast : (isDn ? nk.mantra.sa : nk.mantra.te))
        : '';
      mantraEl.textContent = mantraText;
      mantraEl.className = 'naksh-mantra-text' + (isDn ? ' script-dn' : isRo ? ' script-ro' : ' script-te');
    }

    const noteEl = $('nm-mantra-note');
    if (noteEl) {
      const nkName = _pri(nk.name);
      const deity  = _pri(nk.nakshatra_deity);
      if (isRo) {
        noteEl.textContent = deity
          ? `Chanting this mantra daily with devotion invokes the blessings of ${deity} and bestows peace, protection, and prosperity upon those born under ${nkName}.`
          : `Chanting this mantra daily with devotion bestows peace, protection, and prosperity upon those born under ${nkName}.`;
      } else {
        noteEl.textContent = deity
          ? `${deity} అనుగ్రహం కొరకు ఈ మంత్రమును నిత్యము భక్తితో జపించినచో ${nkName} నక్షత్రజాతులకు శాంతి, రక్షణ, సమృద్ధి లభించును.`
          : `ఈ మంత్రమును నిత్యము భక్తితో జపించినచో ${nkName} నక్షత్రజాతులకు శాంతి, రక్షణ, సమృద్ధి లభించును.`;
      }
    }

    $('naksh-modal').classList.add('open');
  }

  function closeNakshatraModal() {
    $('naksh-modal').classList.remove('open');
  }

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    buildModeSelect();
    buildChapterGrid();
    updateTextSelectLabels();

    // Issue #5: auto-pick random verse on load
    pickRandom();

    $('a-random').addEventListener('click', pickRandom);
    $('a-prev').addEventListener('click', navPrev);
    $('a-next').addEventListener('click', navNext);
    $('a-reveal').addEventListener('click', revealAll);
    $('a-play').addEventListener('click', playAudio);

    $('a-text-select').addEventListener('change', e => {
      activeText = e.target.value;
      selectedChs.clear();
      allShlokas = [];
      pool = [];
      current = null;
      vsnSelectedGroups.clear(); vsnNameSelectedGroups.clear();
      buildModeSelect();
      buildChapterGrid();
      buildPool().then(() => pickRandom());
    });

    $('a-mode-select').addEventListener('change', () => {
      Settings.set(C.LS.TEST_MODE, getMode());
      if (activeText === 'vsn') {
        // Rebuild grid and pool when switching between shloka and namavali modes
        buildChapterGrid();
        buildPool().then(() => pickRandom());
      } else if (current) {
        renderCurrent();
      }
    });

    document.querySelectorAll('#a-mtype-group .pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#a-mtype-group .pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (current) renderMeaning(current);
      });
    });

    document.querySelectorAll('#a-mlang-group .pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#a-mlang-group .pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    $('naksh-close').addEventListener('click', closeNakshatraModal);
    $('naksh-modal').addEventListener('click', e => {
      if (e.target === $('naksh-modal')) closeNakshatraModal();
    });

    $('a-help-btn').addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('showHelp', { detail: 'avadhanam' }));
    });

    $('a-share')?.addEventListener('click', () => {
      if (!current || !window.Share) return;
      const chTitle = activeText === 'gita' ? chapterTitle(current) : 'Vishnu Sahasranāma';
      const ml = window._meaningLang || 'en';
      const meaning = current.meaning?.[ml]?.short || current.meaning?.en?.short || '';
      Share.shareVerse(current, chTitle, meaning);
    });

    $('a-focus')?.addEventListener('click', toggleAvFocusMode);

    window.addEventListener('scriptChange', () => {
      updateTextSelectLabels();
      buildModeSelect();
      if (current) renderCurrent();
      if (_lastNkNum && $('naksh-modal').classList.contains('open'))
        showNakshatraModal(_lastNkNum, _lastPadNum);
    });
    window.addEventListener('meaningLangChange', () => { if (current) renderMeaning(current); });
    window.addEventListener('uiLangChange', () => {
      buildModeSelect();
      buildChapterGrid();
      if (current) renderCurrent();
    });
  }

  return { init, showNakshatraModal };
})();
