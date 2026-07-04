/* names-review.js — In-app QA overlay for Krishna/Arjuna name occurrences.
   Activated by: ?review=names in the URL.
   Shows each name with colour-coded chips (green=correct, red=wrong, orange=missing).
   Click any chip to navigate to that verse with the name highlighted. */

const NamesReview = (() => {

  // ── Same norm() as search.js ───────────────────────────────────────────────
  function norm(s) {
    return (s || '').toLowerCase()
      .replace(/[ḥṃṁṅñṭḍṇśṣḷ]/g, c => ({'ḥ':'h','ṃ':'m','ṁ':'m','ṅ':'n','ñ':'n','ṭ':'t','ḍ':'d','ṇ':'n','ś':'s','ṣ':'s','ḷ':'l'}[c]||c))
      .replace(/[āīūṛ]/g, c => ({'ā':'a','ī':'i','ū':'u','ṛ':'r'}[c]||c))
      .replace(/sh/g, 's')
      .replace(/[^a-z0-9ఀ-౿]/g, '');
  }

  function nameInVerse(iast, sh) {
    const needle = norm(iast);
    const parts = ['p1','p2','p3','p4'].flatMap(k => {
      const p = sh[k] || {};
      return [p.ro || '', p.te || ''];
    }).join(' ');
    // After matching needle at position idx, next char must be vowel or end-of-word
    // so "bharatarsabha" does not match "bharata".
    const vowels = new Set([...'aeiou']);
    // Block only 'r' after needle — indicates compound continuation (bharata+rsabha).
    // All case-ending consonants (h, m, t, n, s, …) are legitimate and allowed.
    const afterOk = (w, idx, len) => { const c = w[idx + len]; return !c || c !== 'r'; };
    const stripped = needle.replace(/^[aeiou]+/, '');
    return parts.split(/\s+/).some(word => {
      const w = norm(word);
      // (a) normal
      if (w.startsWith(needle) && afterOk(w, 0, needle.length)) return true;
      // (b) mid-word after vowel (vowel-lengthening sandhi)
      const idx = w.indexOf(needle);
      if (idx > 0 && vowels.has(w[idx - 1]) && afterOk(w, idx, needle.length)) return true;
      // (c) initial-vowel elision sandhi (me'cyuta → mecyuta matches acyuta)
      if (stripped && stripped !== needle) {
        const idx2 = w.indexOf(stripped);
        if (idx2 > 0 && vowels.has(w[idx2 - 1]) && afterOk(w, idx2, stripped.length)) return true;
      }
      return false;
    });
  }

  // ── Data loading ────────────────────────────────────────────────────────────
  async function loadAll() {
    const [metaRes, idxRes] = await Promise.all([
      fetch('/data/bg-meta.json'),
      fetch('/data/gita-index.json'),
    ]);
    const meta = await metaRes.json();
    const idx  = await idxRes.json();

    // Load all chapters in parallel
    const chNums = idx.chapters.map(c => c.chapter);
    const chData = await Promise.all(
      chNums.map(n => fetch(`/data/chapters/ch${String(n).padStart(2,'0')}.json`).then(r => r.json()))
    );

    // Build ref→shloka map
    const verses = {};
    chData.forEach(d => {
      (d.shlokas || []).forEach(sh => { verses[`${sh.c}.${sh.s}`] = sh; });
    });

    return { meta, verses };
  }

  // ── Audit logic ─────────────────────────────────────────────────────────────
  function auditName(entry, verses) {
    const iast     = entry.iast || entry.name || '?';
    const declared = entry.occurrences || [];

    const wrong   = declared.filter(ref => {
      const sh = verses[ref];
      return !sh || !nameInVerse(iast, sh);
    });

    const declaredSet = new Set(declared);
    const missing = Object.entries(verses)
      .filter(([ref, sh]) => !declaredSet.has(ref) && nameInVerse(iast, sh))
      .map(([ref]) => ref)
      .sort((a, b) => {
        const [ac, as_] = a.split('.').map(Number);
        const [bc, bs]  = b.split('.').map(Number);
        return ac !== bc ? ac - bc : as_ - bs;
      });

    return { iast, declared, wrong: new Set(wrong), missing };
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  function buildOverlay(meta, verses) {
    const overlay = document.createElement('div');
    overlay.id = 'names-review-overlay';
    overlay.innerHTML = `
      <div class="nr-header">
        <h2 class="nr-title">Names Review — QA Mode</h2>
        <div class="nr-legend">
          <span class="nr-chip nr-ok">1.1</span> correct
          <span class="nr-chip nr-wrong">1.1</span> listed but absent
          <span class="nr-chip nr-missing">1.1</span> found but not listed
        </div>
        <button class="nr-close" title="Close">✕</button>
      </div>
      <div class="nr-body" id="nr-body"></div>`;

    overlay.querySelector('.nr-close').addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);

    const body = overlay.querySelector('#nr-body');

    for (const speaker of ['krishna', 'arjuna']) {
      const nameList = (meta.names || {})[speaker] || [];
      const section = document.createElement('div');
      section.className = 'nr-section';
      section.innerHTML = `<h3 class="nr-speaker">${speaker.charAt(0).toUpperCase() + speaker.slice(1)} — ${nameList.length} names</h3>`;
      body.appendChild(section);

      for (const entry of nameList) {
        const { iast, declared, wrong, missing } = auditName(entry, verses);
        const te = entry.te || '';
        const hasIssues = wrong.size > 0 || missing.length > 0;

        const card = document.createElement('div');
        card.className = 'nr-card' + (hasIssues ? ' nr-card-issues' : '');

        const status = hasIssues
          ? `<span class="nr-stat nr-stat-bad">⚠ ${wrong.size} wrong, ${missing.length} missing</span>`
          : `<span class="nr-stat nr-stat-ok">✓ OK</span>`;

        card.innerHTML = `
          <div class="nr-card-head">
            <span class="nr-name-iast">${iast}</span>
            <span class="nr-name-te">${te}</span>
            <span class="nr-counts">declared ${declared.length} · found ${declared.length - wrong.size + missing.length}</span>
            ${status}
          </div>
          <div class="nr-chips" data-iast="${iast}"></div>`;

        const chipsEl = card.querySelector('.nr-chips');

        // Declared chips
        for (const ref of declared) {
          const cls = wrong.has(ref) ? 'nr-wrong' : 'nr-ok';
          const chip = document.createElement('button');
          chip.className = `nr-chip ${cls}`;
          chip.textContent = ref;
          chip.title = wrong.has(ref) ? 'Listed but name NOT found in verse' : 'Correct';
          chip.addEventListener('click', () => navigateTo(ref, iast));
          chipsEl.appendChild(chip);
        }

        // Missing chips
        for (const ref of missing) {
          const chip = document.createElement('button');
          chip.className = 'nr-chip nr-missing';
          chip.textContent = ref;
          chip.title = 'Name found in verse but NOT listed in occurrences';
          chip.addEventListener('click', () => navigateTo(ref, iast));
          chipsEl.appendChild(chip);
        }

        section.appendChild(card);
      }
    }
  }

  function navigateTo(ref, iast) {
    const [ch, s] = ref.split('.').map(Number);
    // Hide overlay temporarily (keep in DOM so user can return via browser back)
    document.querySelectorAll('#names-review-overlay').forEach(el => el.style.display = 'none');
    // Switch to Reader tab
    document.querySelector('[data-tab="reader"]')?.click();
    // Navigate via readerNavigate (same event reader.js listens to)
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('readerNavigate', {
        detail: { text: 'gita', ch, s, hlQuery: iast, hlScope: 'verse' }
      }));
    }, 100);
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  async function init() {
    if (new URLSearchParams(location.search).get('review') !== 'names') return;
    if (document.getElementById('names-review-overlay')) return; // already initialised

    const el = document.createElement('div');
    el.id = 'names-review-overlay';
    el.className = 'nr-loading';
    el.textContent = 'Loading name data…';
    document.body.appendChild(el);

    try {
      const { meta, verses } = await loadAll();
      el.remove();
      buildOverlay(meta, verses);
    } catch (e) {
      el.textContent = 'Error loading data: ' + e.message;
    }
  }

  return { init };
})();
