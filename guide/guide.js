/* guide.js — renders GUIDE_CONTENT, handles search filter, language toggle,
   theme toggle, and draws the two inline SVG diagrams. */

(function () {
  const $ = id => document.getElementById(id);
  let lang = localStorage.getItem('guide_lang') || 'en'; // 'en' | 'te'

  // Strip IAST diacritics so plain-ASCII searches ("mahaprana") match
  // diacritic text ("mahāprāṇa") — most users won't type IAST marks.
  function normDiacritics(s) {
    return (s || '').toLowerCase()
      .replace(/[ḥṃṁṅñṭḍṇśṣḷ]/g, c => ({ 'ḥ':'h','ṃ':'m','ṁ':'m','ṅ':'n','ñ':'n','ṭ':'t','ḍ':'d','ṇ':'n','ś':'s','ṣ':'s','ḷ':'l' }[c] || c))
      .replace(/[āīūṛṝ]/g, c => ({ 'ā':'a','ī':'i','ū':'u','ṛ':'r','ṝ':'r' }[c] || c));
  }

  // ── Diagrams ─────────────────────────────────────────────────
  function sthanaDiagram() {
    // Side-profile head outline with a curved guide-line from throat (back)
    // to lips (front), each of the 6 articulation zones marked as a dot on
    // that line with its own isolated label column below — avoids any
    // label collision regardless of viewport width.
    const zones = [
      { key: 'Kaṇṭha', sub: 'throat', letters: 'a, ā, ka-varga, ha', color: '#c86a6a', x: 40 },
      { key: 'Tālu',   sub: 'palate', letters: 'i, ī, ca-varga, ya', color: '#6aa8d8', x: 150 },
      { key: 'Mūrdhā', sub: 'roof',   letters: 'ṛ, ṝ, ṭa-varga, ra', color: '#8bc48a', x: 260 },
      { key: 'Danta',  sub: 'teeth',  letters: 'ḷ, ta-varga, la, sa', color: '#c8a84b', x: 370 },
      { key: 'Oṣṭha',  sub: 'lips',   letters: 'u, ū, pa-varga', color: '#e07c3a', x: 480 },
      { key: 'Nāsikā', sub: 'nose',   letters: 'ña, ma, ṅa, ṇa, na', color: '#b083c8', x: 590 }
    ];
    const dotY = 40;
    const dots = zones.map(z => `<circle cx="${z.x}" cy="${dotY}" r="9" fill="${z.color}" opacity="0.75"/>`).join('');
    const labels = zones.map(z => `
      <text x="${z.x}" y="${dotY + 30}" text-anchor="middle" class="diagram-label-strong">${z.key}</text>
      <text x="${z.x}" y="${dotY + 46}" text-anchor="middle" class="diagram-label">${z.sub}</text>
      <text x="${z.x}" y="${dotY + 61}" text-anchor="middle" class="diagram-label">${z.letters}</text>
    `).join('');
    return `
    <svg viewBox="0 0 630 110" width="630" height="110">
      <line x1="40" y1="${dotY}" x2="590" y2="${dotY}" stroke="var(--muted)" stroke-width="1.5" opacity="0.4"/>
      ${dots}
      ${labels}
    </svg>`;
  }

  function matraDiagram() {
    const bars = [
      { label: 'Hrasva (1 mātrā)', w: 60, y: 20 },
      { label: 'Dīrgha (2 mātrās)', w: 120, y: 60 },
      { label: 'Pluta (3 mātrās)', w: 180, y: 100 }
    ];
    const rows = bars.map(b => `
      <rect x="0" y="${b.y}" width="${b.w}" height="22" rx="6" fill="var(--accent)" opacity="0.55"/>
      <text x="${b.w + 10}" y="${b.y + 16}" class="diagram-label-strong">${b.label}</text>
    `).join('');
    return `<svg viewBox="0 0 300 135" width="300" height="135">${rows}</svg>`;
  }

  const DIAGRAMS = { sthana: sthanaDiagram, matra: matraDiagram };

  // ── Rendering ────────────────────────────────────────────────
  function pick(field) {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.en || '';
  }

  function renderVerse(v, extraClass) {
    if (!v) return '';
    const translation = pick(v.translation);
    return `<div class="verse-card ${extraClass || ''}">
      <div class="verse-sa">${v.sa}</div>
      <div class="verse-ro">${v.ro}</div>
      ${v.source ? `<div class="verse-source">${v.source}</div>` : ''}
      ${translation ? `<div class="verse-translation">${translation}</div>` : ''}
    </div>`;
  }

  function renderRule(r) {
    const en = pick(r.en);
    const warn = pick(r.warn);
    const sub = pick(r.sub);
    const term = pick(r.term);
    const letters = pick(r.letters);
    return `<div class="rule-item${r.tentative ? ' tentative' : ''}">
      <span class="rule-term">${term}</span>${sub ? `<span class="rule-sub">${sub}</span>` : ''}${r.tentative ? `<span class="tentative-tag">${lang === 'te' ? 'సమీక్ష అవసరం' : 'needs review'}</span>` : ''}
      ${r.sutra ? `<div class="rule-sutra">${r.sutra}</div>` : ''}
      ${letters ? `<div class="rule-letters">${letters}</div>` : ''}
      ${en ? `<div class="rule-en">${en}</div>` : ''}
      ${warn ? `<div class="rule-warn">⚠ ${warn}</div>` : ''}
    </div>`;
  }

  function renderSection(sec) {
    const el = document.createElement('details');
    el.className = 'section' + (sec.draft ? ' draft' : '');
    el.id = 'sec-' + sec.id;
    el.open = true;
    el.dataset.searchText = normDiacritics(JSON.stringify(sec));

    let html = `<summary class="section-head">
      <span class="section-icon">${sec.icon || ''}</span>
      <span class="section-title">${pick(sec.title)}</span>
      ${sec.draft ? '<span class="draft-badge">DRAFT — please review</span>' : ''}
    </summary><div class="section-body">`;

    if (sec.body) {
      sec.body.forEach(b => {
        html += `<div class="body-para">${lang === 'te' && b.te ? b.te : b.en}</div>`;
      });
    }
    if (sec.verse) html += renderVerse(sec.verse);
    if (sec.diagram && DIAGRAMS[sec.diagram]) {
      html += `<div class="diagram-wrap">${DIAGRAMS[sec.diagram]()}</div>`;
    }
    if (sec.items) html += `<div class="rule-list">${sec.items.map(renderRule).join('')}</div>`;
    if (sec.rule) {
      html += `<div class="verse-example"><div class="ref">${sec.rule.source}</div>
        <div class="text">${sec.rule.sa}</div>
        <div class="note">${sec.rule.ro} — ${pick(sec.rule.translation)}</div></div>`;
    }
    if (sec.examples) {
      html += `<div class="example-row">${sec.examples.map(ex => `
        <div class="example-chip">${ex.sa}<span class="ro">${ex.ro}</span></div>
      `).join('')}</div>`;
      html += `<div class="example-note">${sec.examples.map(ex => pick(ex.note)).join(' · ')}</div>`;
    }
    if (sec.verseExample) {
      html += `<div class="verse-example"><div class="ref">${pick(sec.verseExample.ref)}</div>
        <div class="text">${sec.verseExample.text}</div>
        <div class="note">${pick(sec.verseExample.note)}</div></div>`;
    }
    if (sec.body2) {
      sec.body2.forEach(b => {
        html += `<div class="body-para">${lang === 'te' && b.te ? b.te : b.en}</div>`;
      });
    }
    if (sec.verse2) html += renderVerse(sec.verse2);
    if (sec.items2) html += `<div class="rule-list">${sec.items2.map(renderRule).join('')}</div>`;
    html += '</div>';

    el.innerHTML = html;
    return el;
  }

  // ── Consolidated references table ───────────────────────────
  // Auto-collected from every verse/verse2/rule/sutra across all
  // sections, rather than hand-duplicated, so it can't drift out of
  // sync with the content above it.
  function collectReferences() {
    const rows = [];
    const seen = new Set();
    const add = (source, sa, note) => {
      const key = source + '|' + sa;
      if (!source || !sa || seen.has(key)) return;
      seen.add(key);
      rows.push({ source, sa, note: note || '' });
    };
    GUIDE_CONTENT.sections.forEach(sec => {
      if (sec.verse) add(sec.verse.source, sec.verse.sa, sec.verse.translation);
      if (sec.verse2) add(sec.verse2.source, sec.verse2.sa, sec.verse2.translation);
      if (sec.rule) add(sec.rule.source, sec.rule.sa, sec.rule.translation);
      (sec.items || []).concat(sec.items2 || []).forEach(it => {
        if (it.sutra) add(it.sub || it.term, it.sutra, it.en);
      });
    });
    return rows;
  }

  function renderReferencesSection() {
    const rows = collectReferences();
    const el = document.createElement('details');
    el.className = 'section';
    el.id = 'sec-references';
    el.open = true;
    el.dataset.searchText = normDiacritics(JSON.stringify(rows));
    el.innerHTML = `<summary class="section-head">
      <span class="section-icon">📚</span>
      <span class="section-title">${lang === 'te' ? 'అనుబంధం — అన్ని ప్రామాణిక గ్రంథాలు, శ్లోకాలు' : 'References — Every Source Verse, Collected'}</span>
    </summary>
    <div class="section-body">
    <div class="body-para">${lang === 'te'
      ? 'పైన ఉన్న అన్ని విభాగాల నుండి సేకరించిన శ్లోకాలు, సూత్రాలు — ఒకే చోట త్వరిత శోధన కోసం.'
      : 'Every cited verse and sūtra from every section above, collected in one place for quick lookup.'}</div>
    <div class="ref-list">
      ${rows.map(r => `<div class="ref-row"><div class="ref-source">${r.source}</div><div class="ref-sa">${r.sa}</div></div>`).join('')}
    </div>
    </div>`;
    return el;
  }

  function renderAll() {
    $('hero-title').textContent = pick(GUIDE_CONTENT.title);
    $('hero-sub').textContent = pick(GUIDE_CONTENT.subtitle);
    document.title = pick(GUIDE_CONTENT.title) + ' · smruti.samskruti.info';

    const main = $('guide-main');
    main.innerHTML = '';
    GUIDE_CONTENT.sections.forEach(sec => main.appendChild(renderSection(sec)));
    main.appendChild(renderReferencesSection());

    const toc = $('guide-toc');
    toc.innerHTML = GUIDE_CONTENT.sections.map(sec =>
      `<a href="#sec-${sec.id}">${sec.icon || ''} ${pick(sec.title)}</a>`
    ).join('') + `<a href="#sec-references">📚 ${lang === 'te' ? 'అనుబంధం' : 'References'}</a>`;
  }

  // ── Search ───────────────────────────────────────────────────
  function applySearch(q) {
    const query = normDiacritics(q.trim());
    document.querySelectorAll('.section').forEach(el => {
      const match = !query || (el.dataset.searchText || '').includes(query);
      el.dataset.hidden = match ? 'false' : 'true';
    });
  }

  // ── Init ─────────────────────────────────────────────────────
  function setLang(l) {
    lang = l;
    localStorage.setItem('guide_lang', l);
    document.querySelectorAll('.script-toggle button').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
    renderAll();
  }

  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('guide_theme', t);
    document.querySelectorAll('.theme-toggle button').forEach(b => b.classList.toggle('active', b.dataset.theme === t));
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    setLang(lang);

    const savedTheme = localStorage.getItem('guide_theme');
    if (savedTheme) setTheme(savedTheme);

    document.querySelectorAll('.script-toggle button').forEach(b => {
      b.addEventListener('click', () => setLang(b.dataset.lang));
    });
    document.querySelectorAll('.theme-toggle button').forEach(b => {
      b.addEventListener('click', () => setTheme(b.dataset.theme));
    });
    $('guide-search')?.addEventListener('input', e => applySearch(e.target.value));

    // TOC links: force-open the target section before the browser's
    // default anchor-jump, so you never land on a collapsed section.
    $('guide-toc')?.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (target && target.tagName === 'DETAILS') target.open = true;
    });

    // Expand/collapse all
    $('guide-expand-all')?.addEventListener('click', () => {
      document.querySelectorAll('details.section').forEach(d => { d.open = true; });
    });
    $('guide-collapse-all')?.addEventListener('click', () => {
      document.querySelectorAll('details.section').forEach(d => { d.open = false; });
    });

    // Back-to-top floating button
    const topBtn = $('back-to-top');
    if (topBtn) {
      window.addEventListener('scroll', () => {
        topBtn.classList.toggle('visible', window.scrollY > 400);
      });
      topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  });
})();
