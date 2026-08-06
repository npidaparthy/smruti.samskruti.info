/* library.js — My Library tab: bookmarked + noted verses (Gita + VSN) */

const Library = (() => {
  const $ = id => document.getElementById(id);

  const BOOKMARKS_KEY = 'smriti_bookmarks';
  const NOTES_KEY     = 'smriti_notes';

  let activeLibFilter  = 'all';   // 'all' | 'bookmarked' | 'noted'
  let activeTextFilter = 'all';   // 'all' | 'gita' | 'vsn' | ...
  let gitaCache = {};             // ch → shlokas[]
  let vsnShlokas = null;          // s → shloka (loaded once)

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

  function parseId(id) {
    if (id.startsWith('vsn.')) return { text: 'vsn', s: +id.slice(4) };
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

  async function loadVsnShlokas() {
    if (vsnShlokas) return vsnShlokas;
    const r = await fetch(C.VSN_SHLOKAS);
    const d = await r.json();
    vsnShlokas = d.shlokas || [];
    return vsnShlokas;
  }

  // ── Text filter dropdown (built from C.TEXT_LABELS — extensible) ──
  function populateTextSelect() {
    const sel = $('lib-text-select');
    if (!sel) return;
    const uiLang = window._uiLang === 'en' ? 'en' : 'te';
    const allLabel = uiLang === 'en' ? 'All' : 'అన్నీ';
    sel.innerHTML = `<option value="all">${allLabel}</option>` +
      Object.keys(C.TEXT_LABELS).map(key => {
        const label = C.TEXT_LABELS[key][uiLang] || C.TEXT_LABELS[key].en;
        return `<option value="${key}">${label}</option>`;
      }).join('');
    sel.value = activeTextFilter;
  }

  // ── Navigation ───────────────────────────────────────────────
  function goTo(parsed) {
    if (parsed.text === 'vsn') {
      window.dispatchEvent(new CustomEvent('searchNavigate', { detail: { text: 'vsn', sh: parsed.s } }));
    } else {
      window.dispatchEvent(new CustomEvent('searchNavigate', { detail: { text: 'gita', ch: parsed.c, s: parsed.s } }));
    }
  }

  // ── Card rendering ───────────────────────────────────────────
  function card(id, parsed, sh, isBookmarked, noteText) {
    const script = window._script || 'te';
    const lang   = window._meaningLang || 'en';
    const uiLang = window._uiLang === 'en' ? 'en' : 'te';

    const isVsn = parsed.text === 'vsn';
    const p1 = (sh && sh.p1 && (sh.p1[script] || sh.p1.ro)) || '';
    const m  = sh && sh.meaning && (sh.meaning[lang] || sh.meaning.en);
    const short = m && (m.short || (typeof m === 'string' ? m : ''));

    const div = document.createElement('div');
    div.className = 'srch-card ' + (isVsn ? 'srch-card-vsn' : 'srch-card-gita');
    div.innerHTML = `
      <div class="srch-card-meta">
        <span class="srch-chip ${isVsn ? 'srch-chip-vsn' : 'srch-chip-gita'}">${isVsn ? 'VSN' : (uiLang === 'en' ? 'Gītā' : 'గీతా')}</span>
        <span class="srch-card-ref">${isVsn ? `శ్లో ${parsed.s}` : `${parsed.c}·${parsed.s}`}</span>
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
    if (activeTextFilter !== 'all') parsedList = parsedList.filter(x => x.parsed.text === activeTextFilter);

    parsedList.sort((a, b) => {
      if (a.parsed.text !== b.parsed.text) return a.parsed.text === 'gita' ? -1 : 1;
      const ac = a.parsed.c || 0, bc = b.parsed.c || 0;
      if (ac !== bc) return ac - bc;
      return a.parsed.s - b.parsed.s;
    });

    if (!parsedList.length) {
      const uiLang = window._uiLang === 'en' ? 'en' : 'te';
      resultsEl.innerHTML = `<div class="srch-empty">
        <div>${uiLang === 'en' ? 'Nothing saved yet' : 'ఇంకా ఏమీ సేవ్ చేయలేదు'}</div>
        <div class="lib-empty-hint">${uiLang === 'en'
          ? "Tap ♡ on any verse to bookmark it, or ✎ to add a note — it'll show up here."
          : 'ఏదైనా శ్లోకంపై ♡ నొక్కి బుక్‌మార్క్ చేయండి, లేదా ✎ తో గమనిక రాయండి — ఇక్కడ కనిపిస్తుంది.'}</div>
      </div>`;
      return;
    }

    resultsEl.innerHTML = '<div class="srch-loading">…</div>';
    const frag = document.createDocumentFragment();

    for (const { id, parsed } of parsedList) {
      let sh = null;
      try {
        if (parsed.text === 'vsn') {
          const shlokas = await loadVsnShlokas();
          sh = shlokas.find(x => x.s === parsed.s);
        } else {
          const shlokas = await loadGitaCh(parsed.c);
          sh = shlokas.find(x => +x.s === parsed.s);
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

    window.addEventListener('uiLangChange', () => { populateTextSelect(); render(); });
    window.addEventListener('scriptChange',  render);
    window.addEventListener('meaningLangChange', render);
  }

  return { init, render };
})();
