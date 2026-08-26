/* library.js — My Library tab: bookmarked + noted verses (Gita + VSN) */

const Library = (() => {
  const $ = id => document.getElementById(id);

  const BOOKMARKS_KEY = 'smriti_bookmarks';
  const NOTES_KEY     = 'smriti_notes';

  let activeLibFilter  = 'all';   // 'all' | 'bookmarked' | 'noted'
  let activeTextFilter = 'all';   // 'all' | 'gita' | 'vsn' | ...
  let sortMode          = 'verse'; // 'verse' | 'recent'
  let gitaCache    = {};          // ch → shlokas[]
  let rangedCache  = {};          // text id (vsn/sl/...) → shlokas[], loaded once each
  let extraCache   = {};          // gita pseudo-chapter id (dhyana/mahatyam) → shlokas[]

  // ── Storage ──────────────────────────────────────────────────
  function getBookmarks() {
    try { return new Set(JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]')); } catch(e) { return new Set(); }
  }
  function saveBookmarks(set) {
    try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...set])); } catch(e) {}
  }
  function getNotes() {
    try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}'); } catch(e) { return {}; }
  }
  function saveNotes(notes) {
    try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch(e) {}
  }

  // Bookmark/note ids are "<text>.<s>" for any C.TEXTS ranged/single text
  // (vsn, sl, ...) or C.GITA_EXTRA_CHAPTERS pseudo-chapter (dhyana,
  // mahatyam) — see reader.js's verseId(). Falls back to Gita's "c.s"
  // shape for anything else.
  function isRangedTextId(text) {
    const cfg = C.TEXTS[text];
    return !!cfg && (cfg.grouping === 'ranges' || cfg.grouping === 'single');
  }
  function isExtraChapterId(text) {
    return (C.GITA_EXTRA_CHAPTERS || []).some(e => e.id === text);
  }

  // Dhyāna Ślokas / Geetha Māhātmyam are Gita pseudo-chapters, not their
  // own text (see constants.js GITA_EXTRA_CHAPTERS comment) — they must
  // not appear as a selectable "text" in the filter dropdown. For
  // filtering purposes only, fold them into 'gita' so a bookmark there
  // still shows up under the "గీత" filter; `card()`/data-loading keep
  // using the specific id (parsed.text) for the right icon/data source.
  function filterGroup(text) {
    return isExtraChapterId(text) ? 'gita' : text;
  }

  function parseId(id) {
    const dot = id.indexOf('.');
    if (dot > 0) {
      const prefix = id.slice(0, dot);
      if (isRangedTextId(prefix) || isExtraChapterId(prefix)) {
        return { text: prefix, s: +id.slice(dot + 1) };
      }
    }
    const [c, s] = id.split('.').map(Number);
    return { text: 'gita', c, s };
  }

  // ── Data loaders (mirror search.js's caching pattern) ──────────
  async function loadGitaCh(ch) {
    if (gitaCache[ch]) return gitaCache[ch];
    const r = await fetch(C.CHAPTER_PATH(ch));
    const d = await r.json();
    gitaCache[ch] = d.shlokas || [];
    return gitaCache[ch];
  }

  async function loadRangedShlokas(text) {
    if (rangedCache[text]) return rangedCache[text];
    const cfg = C.TEXTS[text];
    const r = await fetch(C[cfg.shlokasPath]);
    const d = await r.json();
    const numField = cfg.numberField;
    rangedCache[text] = (d.shlokas || []).map(sh => numField ? { ...sh, s: sh[numField] } : sh);
    return rangedCache[text];
  }

  async function loadExtraShlokas(id) {
    if (extraCache[id]) return extraCache[id];
    const cfg = (C.GITA_EXTRA_CHAPTERS || []).find(e => e.id === id);
    const r = await fetch(C[cfg.shlokasPath]);
    const d = await r.json();
    extraCache[id] = (d.shlokas || []).map(sh => ({ ...sh, s: sh.num }));
    return extraCache[id];
  }

  // ── Text filter dropdown (built from C.TEXT_LABELS — extensible) ──
  // Dhyāna Ślokas / Geetha Māhātmyam are NOT listed here — they're Gita
  // pseudo-chapters, not a text of their own (see filterGroup() above).
  // Selecting "గీత" already includes their bookmarks.
  function populateTextSelect() {
    const sel = $('lib-text-select');
    if (!sel) return;
    const uiLang = window._uiLang === 'en' ? 'en' : 'te';
    const allLabel = uiLang === 'en' ? 'All' : 'అన్నీ';
    const textOpts = Object.keys(C.TEXT_LABELS).map(key => {
      const label = C.TEXT_LABELS[key][uiLang] || C.TEXT_LABELS[key].en;
      return `<option value="${key}">${label}</option>`;
    });
    sel.innerHTML = `<option value="all">${allLabel}</option>` + textOpts.join('');
    sel.value = activeTextFilter;
  }

  // ── Navigation ───────────────────────────────────────────────
  function goTo(parsed) {
    if (parsed.text === 'gita') {
      window.dispatchEvent(new CustomEvent('searchNavigate', { detail: { text: 'gita', ch: parsed.c, s: parsed.s } }));
    } else {
      // vsn/sl (ranged texts) and dhyana/mahatyam (gita pseudo-chapters)
      // all navigate the same way: reader.js's readerNavigate handler
      // knows how to route each by id — see isRangedText()/
      // GITA_EXTRA_CHAPTERS there.
      window.dispatchEvent(new CustomEvent('searchNavigate', { detail: { text: parsed.text, sh: parsed.s } }));
    }
  }

  // Verse-ref badge label + a shared non-gita style bucket for any text
  // that isn't gita (vsn/sl get their configured badgePrefix, pseudo-
  // chapters get their icon).
  function textBadgeLabel(text, uiLang) {
    if (text === 'gita') return uiLang === 'en' ? 'Gītā' : 'గీతా';
    const cfg = C.TEXTS[text];
    if (cfg) return cfg.badgePrefix || text.toUpperCase();
    const extra = (C.GITA_EXTRA_CHAPTERS || []).find(e => e.id === text);
    return extra ? extra.icon : text;
  }

  // ── Card rendering ───────────────────────────────────────────
  function card(id, parsed, sh, isBookmarked, noteText) {
    const script = window._script || 'te';
    const lang   = window._meaningLang || 'en';
    const uiLang = window._uiLang === 'en' ? 'en' : 'te';

    const isGita = parsed.text === 'gita';
    const firstLine = sh && (sh.p1 || sh.h1);
    const p1 = (firstLine && (firstLine[script] || firstLine.ro)) || '';
    const m  = sh && sh.meaning && (sh.meaning[lang] || sh.meaning.en);
    const short = m && (m.short || (typeof m === 'string' ? m : ''));

    const div = document.createElement('div');
    div.className = 'srch-card ' + (isGita ? 'srch-card-gita' : 'srch-card-vsn');
    div.innerHTML = `
      <div class="srch-card-meta">
        <span class="srch-chip ${isGita ? 'srch-chip-gita' : 'srch-chip-vsn'}">${textBadgeLabel(parsed.text, uiLang)}</span>
        <span class="srch-card-ref">${isGita ? `${parsed.c}·${parsed.s}` : `శ్లో ${parsed.s}`}</span>
      </div>
      <div class="srch-card-title">${p1 || '…'}</div>
      ${short ? `<div class="srch-card-sub">${short.slice(0,90)}${short.length>90?'…':''}</div>` : ''}
      ${noteText ? `<div class="lib-note-preview">✎ ${noteText}</div>` : ''}
      <div class="lib-card-actions"></div>`;

    div.addEventListener('click', () => goTo(parsed));

    const actions = div.querySelector('.lib-card-actions');

    const bmBtn = document.createElement('button');
    bmBtn.className = 'bm-btn' + (isBookmarked ? ' active' : '');
    bmBtn.title = uiLang === 'en' ? 'Bookmark' : 'సేవ్ చేయి';
    bmBtn.textContent = isBookmarked ? '♥' : '♡';
    bmBtn.addEventListener('click', e => {
      e.stopPropagation();
      const bms = getBookmarks();
      if (bms.has(id)) bms.delete(id); else bms.add(id);
      saveBookmarks(bms);
      render();
    });
    actions.appendChild(bmBtn);

    if (noteText) {
      const rmBtn = document.createElement('button');
      rmBtn.className = 'lib-remove-note-btn';
      rmBtn.title = window.t ? window.t('lib_remove_note') : (uiLang === 'en' ? 'Remove note' : 'గమనిక తొలగించు');
      rmBtn.textContent = '✕';
      rmBtn.addEventListener('click', e => {
        e.stopPropagation();
        const notes = getNotes();
        delete notes[id];
        saveNotes(notes);
        render();
      });
      actions.appendChild(rmBtn);
    }

    return div;
  }

  // ── Main render ──────────────────────────────────────────────
  async function render() {
    const resultsEl = $('lib-results');
    if (!resultsEl) return;

    const bookmarks = getBookmarks();
    const notes     = getNotes();

    let ids = new Set([...bookmarks, ...Object.keys(notes)]);

    if (activeLibFilter === 'bookmarked') ids = new Set([...ids].filter(id => bookmarks.has(id)));
    else if (activeLibFilter === 'noted') ids = new Set([...ids].filter(id => notes[id]));

    let parsedList = [...ids].map(id => ({ id, parsed: parseId(id) }));
    if (activeTextFilter !== 'all') parsedList = parsedList.filter(x => filterGroup(x.parsed.text) === activeTextFilter);

    if (sortMode === 'recent') {
      // No real timestamps stored — approximate "recent" from each store's
      // own insertion order (Set/object key order = save order), normalized
      // 0..1 so bookmarks and notes lists of different lengths compare
      // reasonably. Good enough until there's real demand for exact
      // chronological ordering (would need an actual timestamp field).
      const bmOrder   = [...bookmarks];
      const noteOrder = Object.keys(notes);
      const recencyScore = id => {
        const bmIdx   = bmOrder.indexOf(id);
        const noteIdx = noteOrder.indexOf(id);
        const bmScore   = bmIdx   >= 0 ? (bmIdx + 1)   / bmOrder.length   : -1;
        const noteScore = noteIdx >= 0 ? (noteIdx + 1) / noteOrder.length : -1;
        return Math.max(bmScore, noteScore);
      };
      parsedList.sort((a, b) => recencyScore(b.id) - recencyScore(a.id));
    } else {
      parsedList.sort((a, b) => {
        const ag = filterGroup(a.parsed.text), bg = filterGroup(b.parsed.text);
        if (ag !== bg) return ag === 'gita' ? -1 : 1;
        if (a.parsed.text !== b.parsed.text) return a.parsed.text === 'gita' ? -1 : 1;
        const ac = a.parsed.c || 0, bc = b.parsed.c || 0;
        if (ac !== bc) return ac - bc;
        return a.parsed.s - b.parsed.s;
      });
    }

    if (!parsedList.length) {
      const uiLang = window._uiLang === 'en' ? 'en' : 'te';
      resultsEl.innerHTML = `<div class="srch-empty">
        <div>${uiLang === 'en' ? 'Nothing saved yet' : 'ఇంకా ఏమీ సేవ్ చేయలేదు'}</div>
        <div class="lib-empty-hint">${uiLang === 'en'
          ? "Tap ♡ on any verse to bookmark it, or ✎ to add a note — it'll show up here."
          : 'ఏదైనా శ్లోకంపై ♡ నొక్కి బుక్‌మార్క్ చేయండి, లేదా ✎ తో గమనిక రాయండి — ఇక్కడ కనిపిస్తుంది.'}</div>
        <button class="pill active lib-empty-cta">${uiLang === 'en' ? 'Browse Reader →' : 'పాఠం చూడండి →'}</button>
      </div>`;
      return;
    }

    resultsEl.innerHTML = '<div class="srch-loading">…</div>';
    const frag = document.createDocumentFragment();

    for (const { id, parsed } of parsedList) {
      let sh = null;
      try {
        if (parsed.text === 'gita') {
          const shlokas = await loadGitaCh(parsed.c);
          sh = shlokas.find(x => +x.s === parsed.s);
        } else if (isRangedTextId(parsed.text)) {
          const shlokas = await loadRangedShlokas(parsed.text);
          sh = shlokas.find(x => x.s === parsed.s);
        } else {
          const shlokas = await loadExtraShlokas(parsed.text);
          sh = shlokas.find(x => x.s === parsed.s);
        }
      } catch(e) {}
      frag.appendChild(card(id, parsed, sh, bookmarks.has(id), notes[id]));
    }

    resultsEl.innerHTML = '';
    resultsEl.appendChild(frag);
  }

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    populateTextSelect();

    $('lib-text-select')?.addEventListener('change', e => {
      activeTextFilter = e.target.value;
      render();
    });

    document.querySelectorAll('#lib-sort-group .pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#lib-sort-group .pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        sortMode = btn.dataset.libSort;
        render();
      });
    });

    document.querySelectorAll('#lib-filter-group .pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#lib-filter-group .pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeLibFilter = btn.dataset.libFilter;
        render();
      });
    });

    // Re-render whenever the tab is opened, so bookmarks/notes added
    // elsewhere (Reader, Avadhānam) are always reflected.
    document.querySelector('[data-tab="library"]')?.addEventListener('click', render);

    $('lib-results')?.addEventListener('click', e => {
      if (e.target.closest('.lib-empty-cta')) document.querySelector('[data-tab="reader"]')?.click();
    });

    window.addEventListener('uiLangChange', () => { populateTextSelect(); render(); });
    window.addEventListener('scriptChange',  render);
    window.addEventListener('meaningLangChange', render);
  }

  return { init, render };
})();
