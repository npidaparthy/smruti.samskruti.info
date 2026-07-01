/* search.js — Search tab: VSN names + Gita verses */

const Search = (() => {
  const $ = id => document.getElementById(id);

  let vsnNames    = null;   // [{n, sh, name, meaning}]
  let gitaIndex   = null;
  let gitaCache   = {};     // ch number → shlokas[]
  let activeFilter = 'all';
  let debounceTimer = null;
  let lastQuery = '';

  // ── Data loaders ─────────────────────────────────────────────
  async function loadVsn() {
    if (vsnNames) return vsnNames;
    const r = await fetch('/data/vsn-names.json');
    const d = await r.json();
    vsnNames = d.names || [];
    return vsnNames;
  }

  async function loadGitaIndex() {
    if (gitaIndex) return gitaIndex;
    const r = await fetch('/data/gita-index.json');
    gitaIndex = await r.json();
    return gitaIndex;
  }

  async function loadGitaCh(ch) {
    if (gitaCache[ch]) return gitaCache[ch];
    const r = await fetch(`/data/chapters/ch${String(ch).padStart(2,'0')}.json`);
    const d = await r.json();
    gitaCache[ch] = d.shlokas || [];
    return gitaCache[ch];
  }

  // ── Normalisation ─────────────────────────────────────────────
  function norm(s) {
    return (s || '').toLowerCase()
      .replace(/[ḥṃṁṅñṭḍṇśṣḷ]/g, c => ({'ḥ':'h','ṃ':'m','ṁ':'m','ṅ':'n','ñ':'n','ṭ':'t','ḍ':'d','ṇ':'n','ś':'s','ṣ':'s','ḷ':'l'}[c]||c))
      .replace(/[āīūṛ]/g, c => ({'ā':'a','ī':'i','ū':'u','ṛ':'r'}[c]||c))
      .replace(/[^a-z0-9ఀ-౿]/g, '');
  }

  // Consonant skeleton: strips vowels + h so "krishna"→"krsn" matches "kṛṣṇa"→"krsn"
  function compact(s) {
    return norm(s).replace(/[aeiou]/g, '').replace(/h/g, '');
  }

  function matches(query, ...fields) {
    const q  = norm(query);
    const qc = compact(query);
    return fields.some(f => {
      const fn = norm(f);
      if (fn.includes(q)) return true;
      if (qc.length >= 3 && compact(f).includes(qc)) return true;
      return false;
    });
  }

  // ── Smart query detection ─────────────────────────────────────
  // Returns {type, ch, s} | {type, n} | {type, q}
  function parseQuery(raw) {
    const q = raw.trim();
    // Gita ref: 18.66 / 18:66 / 18-66
    const gitaRef = q.match(/^(\d{1,2})[.:\-](\d{1,3})$/);
    if (gitaRef) return { type: 'gita-ref', ch: +gitaRef[1], s: +gitaRef[2] };
    // Explicit VSN name: #42
    if (q.match(/^#(\d{1,4})$/)) return { type: 'vsn-num', n: +q.slice(1) };
    // Gita chapter: "ch 2" / "chapter 2"
    const chWord = q.match(/^ch(?:apter)?\s*(\d{1,2})$/i);
    if (chWord && +chWord[1] <= 18) return { type: 'gita-ch', ch: +chWord[1] };
    // Plain number — meaning depends on active filter (resolved in runSearch)
    if (q.match(/^\d{1,4}$/)) return { type: 'plain-num', n: +q };
    return { type: 'text', q };
  }

  // ── Result renderers ─────────────────────────────────────────
  function vsnCard(n, highlight) {
    const script = window._script || 'te';
    const lang   = window._meaningLang || 'en';
    const name   = n.name[script] || n.name.ro;
    const m      = (n.meaning && (n.meaning[lang] || n.meaning.en)) || '';
    const div = document.createElement('div');
    div.className = 'srch-card srch-card-vsn';
    div.innerHTML = `
      <div class="srch-card-meta">
        <span class="srch-chip srch-chip-vsn">VSN</span>
        <span class="srch-card-ref">#${n.n} · శ్లో ${n.sh}</span>
      </div>
      <div class="srch-card-title">${name}</div>
      ${m ? `<div class="srch-card-sub">${m}</div>` : ''}`;
    div.addEventListener('click', () => goToVsn(n.sh));
    return div;
  }

  function vsnShlokaCard(sh, namesInShloka) {
    const script = window._script || 'te';
    const firstNames = namesInShloka.slice(0, 3).map(n => n.name[script] || n.name.ro).join(' · ');
    const total = namesInShloka.length;
    const div = document.createElement('div');
    div.className = 'srch-card srch-card-vsn';
    div.innerHTML = `
      <div class="srch-card-meta">
        <span class="srch-chip srch-chip-vsn">VSN</span>
        <span class="srch-card-ref">శ్లో ${sh}</span>
        <span class="srch-card-speaker">${total} నామాలు</span>
      </div>
      <div class="srch-card-title">${firstNames}${total > 3 ? ' …' : ''}</div>`;
    div.addEventListener('click', () => goToVsn(sh));
    return div;
  }

  function gitaCard(sh) {
    const script = window._script || 'te';
    const lang   = window._meaningLang || 'en';
    const p1 = (sh.p1 && (sh.p1[script] || sh.p1.ro)) || '';
    const m  = sh.meaning && (sh.meaning[lang] || sh.meaning.en);
    const short = m && (m.short || (typeof m === 'string' ? m : ''));
    const div = document.createElement('div');
    div.className = 'srch-card srch-card-gita';
    div.innerHTML = `
      <div class="srch-card-meta">
        <span class="srch-chip srch-chip-gita"గీతా</span>
        <span class="srch-card-ref">${sh.c}·${sh.s}</span>
        ${sh.speaker ? `<span class="srch-card-speaker">${sh.speaker}</span>` : ''}
      </div>
      <div class="srch-card-title">${p1}</div>
      ${short ? `<div class="srch-card-sub">${short.slice(0,90)}${short.length>90?'…':''}</div>` : ''}`;
    div.addEventListener('click', () => goToGita(+sh.c, +sh.s));
    return div;
  }

  // ── Navigation ────────────────────────────────────────────────
  function goToVsn(sh) {
    window.dispatchEvent(new CustomEvent('searchNavigate', { detail: { text: 'vsn', sh } }));
  }

  function goToGita(ch, s) {
    window.dispatchEvent(new CustomEvent('searchNavigate', { detail: { text: 'gita', ch, s } }));
  }

  // ── Core search ───────────────────────────────────────────────
  async function runSearch(raw) {
    const resultsEl = $('srch-results');
    const hintEl    = $('srch-hint');
    if (!raw.trim()) {
      resultsEl.innerHTML = '';
      hintEl && (hintEl.style.display = '');
      return;
    }
    hintEl && (hintEl.style.display = 'none');
    resultsEl.innerHTML = '<div class="srch-loading">వెతుకుతున్నాం…</div>';

    const parsed = parseQuery(raw);
    const frag   = document.createDocumentFragment();
    let count = 0;

    // ── Exact jump: Gita ref ──
    if (parsed.type === 'gita-ref' && (activeFilter === 'all' || activeFilter === 'gita')) {
      const shlokas = await loadGitaCh(parsed.ch);
      const sh = shlokas.find(s => +s.s === parsed.s);
      if (sh) { frag.appendChild(gitaCard(sh)); count++; }
      else {
        const msg = document.createElement('div');
        msg.className = 'srch-empty';
        msg.textContent = `గీతా ${parsed.ch}·${parsed.s} దొరకలేదు`;
        frag.appendChild(msg); count++;
      }
    }

    // ── Explicit VSN name number (#42) ──
    else if (parsed.type === 'vsn-num') {
      const names = await loadVsn();
      const n = names.find(x => x.n === parsed.n);
      if (n) { frag.appendChild(vsnCard(n)); count++; }
      else {
        const msg = document.createElement('div');
        msg.className = 'srch-empty';
        msg.textContent = `VSN నామం #${parsed.n} దొరకలేదు`;
        frag.appendChild(msg); count++;
      }
    }

    // ── Gita chapter browse ──
    else if (parsed.type === 'gita-ch') {
      const shlokas = await loadGitaCh(parsed.ch);
      shlokas.slice(0, 20).forEach(sh => { frag.appendChild(gitaCard(sh)); count++; });
    }

    // ── Plain number — filter-aware ──
    else if (parsed.type === 'plain-num') {
      const N = parsed.n;

      if (activeFilter === 'vsn') {
        // Show VSN name #N
        const names = await loadVsn();
        const nameHit = names.find(x => x.n === N);
        if (nameHit) { frag.appendChild(vsnCard(nameHit)); count++; }
        // Also show VSN shloka #N if N ≤ 108
        if (N <= 108) {
          const namesInShloka = names.filter(x => x.sh === N);
          if (namesInShloka.length) { frag.appendChild(vsnShlokaCard(N, namesInShloka)); count++; }
        }
        if (count === 0) {
          const msg = document.createElement('div');
          msg.className = 'srch-empty';
          msg.textContent = `VSN నామం / శ్లోకం #${N} దొరకలేదు`;
          frag.appendChild(msg); count++;
        }
      }

      else if (activeFilter === 'gita') {
        // Show all ch·N verses across all 18 chapters
        const idx = await loadGitaIndex();
        for (const entry of idx.chapters) {
          const shlokas = await loadGitaCh(entry.chapter);
          const sh = shlokas.find(x => x.s === N);
          if (sh) { frag.appendChild(gitaCard(sh)); count++; }
        }
        if (count === 0) {
          const msg = document.createElement('div');
          msg.className = 'srch-empty';
          msg.textContent = `గీతాలో ${N}వ శ్లోకం ఏ అధ్యాయంలో దొరకలేదు`;
          frag.appendChild(msg); count++;
        }
      }

      else {
        // 'all' filter — treat as VSN name# (legacy behaviour) or gita-ch if ≤18
        if (N <= 18) {
          const shlokas = await loadGitaCh(N);
          shlokas.slice(0, 20).forEach(sh => { frag.appendChild(gitaCard(sh)); count++; });
        }
        if (N <= 1000) {
          const names = await loadVsn();
          const n = names.find(x => x.n === N);
          if (n) { frag.appendChild(vsnCard(n)); count++; }
        }
      }
    }

    // ── Full text search ──
    else if (parsed.type === 'text') {
      const q = parsed.q;

      if (activeFilter === 'all' || activeFilter === 'vsn') {
        const names = await loadVsn();
        const hits = names.filter(n =>
          matches(q, n.name.ro, n.name.te || '', n.name.sa || '',
            (n.meaning && n.meaning.en) || '',
            (n.meaning && n.meaning.te) || '')
        ).slice(0, 15);
        hits.forEach(n => { frag.appendChild(vsnCard(n)); count++; });
      }

      if (activeFilter === 'all' || activeFilter === 'gita') {
        const idx = await loadGitaIndex();
        for (const entry of idx.chapters) {
          const shlokas = await loadGitaCh(entry.chapter);
          const hits = shlokas.filter(sh => {
            const p1ro = (sh.p1 && sh.p1.ro) || '';
            const men  = sh.meaning && (sh.meaning.en || {});
            return matches(q, p1ro,
              (sh.p1 && sh.p1.te) || '',
              (typeof men === 'object' ? men.short || '' : men),
              (sh.meaning && sh.meaning.te && sh.meaning.te.short) || '');
          }).slice(0, 5);
          hits.forEach(sh => { frag.appendChild(gitaCard(sh)); count++; });
          if (count >= 30) break;
        }
      }
    }

    resultsEl.innerHTML = '';
    if (count === 0) {
      resultsEl.innerHTML = '<div class="srch-empty">ఫలితాలు దొరకలేదు · No results found</div>';
    } else {
      resultsEl.appendChild(frag);
      const total = document.createElement('div');
      total.className = 'srch-count';
      total.textContent = `${count} ఫలితాలు`;
      resultsEl.prepend(total);
    }
  }

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    const input   = $('srch-input');
    const clearBtn = $('srch-clear');
    const filters = document.querySelectorAll('[data-srch-filter]');

    if (!input) return;

    input.addEventListener('input', () => {
      const q = input.value;
      clearBtn && (clearBtn.style.display = q ? '' : 'none');
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => runSearch(q), 280);
    });

    clearBtn && clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      $('srch-results').innerHTML = '';
      $('srch-hint') && ($('srch-hint').style.display = '');
      input.focus();
    });

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.srchFilter;
        if (input.value.trim()) runSearch(input.value);
      });
    });

    // Focus input when tab becomes active
    document.querySelector('[data-tab="search"]')?.addEventListener('click', () => {
      setTimeout(() => input.focus(), 150);
    });
  }

  return { init };
})();
