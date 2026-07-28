/* vsn.js — Vishnu Sahasranama names tab
 * Sources: vsn-1000-names.json · vsn-verse-tokens.json · nakshatras.json
 * Depends on: transliterate.js (Transliterate global), i18n.js (t() global)
 */

const VsnModule = (() => {
  'use strict';

  // ── State ─────────────────────────────────────────────────────────
  let _script   = window._script || 'te';
  let _pada     = 4;
  let _sdFilter = '';
  let _query    = '';
  let _names    = null;   // { n → nameObj }
  let _verses   = null;   // array
  let _naks     = null;   // 27 nakshatras
  let _inited   = false;

  // ── Chip colors — mid-luminance, readable on light AND dark bg ────
  const COLORS = [
    '#c03060','#2878c8','#1e9040','#b04820',
    '#7c28b0','#007878','#c07000','#285898',
    '#888000','#a00050','#0058a8','#608000',
  ];

  // ── Sandhi → filter key and i18n key ─────────────────────────────
  const SD_KEY = {
    'विसर्ग':'vis','जश्त्व':'jsh','पूर्वरूप':'pur',
    'श्चुत्व':'sch','अनुस्वार':'ans','परसवर्ण':'par',
  };
  const SD_I18N = {
    vis:'vsn_sd_visarga', jsh:'vsn_sd_jashtva', pur:'vsn_sd_poorva',
    sch:'vsn_sd_shchutva', ans:'vsn_sd_anusvara', par:'vsn_sd_parasavarna',
  };
  const SD_COLOR = {
    vis:'#b03000', jsh:'#1a7a30', pur:'#1a3a8a',
    sch:'#7a1a7a', ans:'#005a7a', par:'#8a4400',
  };

  // ── Helpers ───────────────────────────────────────────────────────
  function tr(text) {
    if (!text) return '';
    return Transliterate.convert(text, 'sa', _script);
  }

  function tdig(n) {
    if (_script === 'sa') return String(n).replace(/\d/g, d => '०१२३४५६७८९'[+d]);
    if (_script === 'te') return String(n).replace(/\d/g, d => '౦౧౨౩౪౫౬౭౮౯'[+d]);
    return String(n);
  }

  function getNak(sh) {
    return _naks.find(n => sh >= n.vsn_shloka_from && sh <= n.vsn_shloka_to);
  }

  // ── Init: load data, bind global events, render ───────────────────
  async function init() {
    if (_inited) return;
    _inited = true;
    _script = window._script || 'te';

    const panel = document.getElementById('vsn-names');
    if (!panel) return;
    panel.innerHTML = `<div class="vsn-loading">${t('vsn_loading')}</div>`;

    try {
      const [nm, tk, nak] = await Promise.all([
        fetch('/data/vsn/vsn-1000-names.json?v=2').then(r => r.json()),
        fetch('/data/vsn/vsn-verse-tokens.json').then(r => r.json()),
        fetch('/data/vsn/content/nakshatras.json').then(r => r.json()),
      ]);
      _names  = {};
      for (const n of nm.names) _names[n.n] = n;
      _verses = tk.verses;
      _naks   = nak;
      _render();
    } catch (e) {
      panel.innerHTML = `<div class="vsn-error">${t('vsn_load_error')}</div>`;
    }

    // Sync with global settings changes
    window.addEventListener('scriptChange',  () => { _script = window._script || 'te'; _render(); });
    window.addEventListener('uiLangChange',  () => _render());
  }

  // ── Full render ───────────────────────────────────────────────────
  function _render() {
    if (!_names) return;
    const panel = document.getElementById('vsn-names');
    if (!panel) return;
    panel.innerHTML = _buildLayout();
    _bindEvents();
    _applyFilter();
    _applySearch(_query);
    document.dispatchEvent(new CustomEvent('vsn-rendered'));
  }

  // ── Layout ────────────────────────────────────────────────────────
  function _buildLayout() {
    const sdBtns = [
      ['', 'vsn_filter_all'],
      ['vis','vsn_sd_visarga'],['jsh','vsn_sd_jashtva'],['pur','vsn_sd_poorva'],
      ['sch','vsn_sd_shchutva'],['ans','vsn_sd_anusvara'],['par','vsn_sd_parasavarna'],
    ].map(([k, ik]) =>
      `<button class="vsn-sf${_sdFilter===k?' act':''}" data-sd="${k}">${t(ik)}</button>`
    ).join('');

    const sc = (s) => `<button${_script===s?' class="act"':''} data-sc="${s}">${
      s==='te'?'తె': s==='sa'?'देव':'IAST'
    }</button>`;

    return `
<div class="vsn-hdr">
  <div class="vsn-hdr-r1">
    <span class="vsn-title">${t('vsn_title')}</span>
    <div class="vsn-script-tog" id="vsn-script">${sc('te')}${sc('sa')}${sc('ro')}</div>
  </div>
  <div class="vsn-hdr-r2">
    <div class="vsn-pada-tog" id="vsn-pada">
      <button${_pada===4?' class="act"':''} data-p="4">${t('vsn_4pada')}</button>
      <button${_pada===2?' class="act"':''} data-p="2">${t('vsn_2pada')}</button>
    </div>
    <span class="vsn-stat">${t('vsn_stat')}</span>
  </div>
  <div class="vsn-search-row">
    <input class="vsn-search" id="vsn-search" type="search"
      placeholder="${t('vsn_search_ph')}" value="${_query.replace(/"/g,'&quot;')}" autocomplete="off">
  </div>
</div>
<div class="vsn-sd-strip" id="vsn-sd-strip">${sdBtns}</div>
<div class="vsn-scroll" id="vsn-scroll">
  ${_buildVerseList()}
  <button class="vsn-top-btn" id="vsn-top-btn">${t('vsn_scroll_top')}</button>
</div>
${_buildPopup()}`;
  }

  // ── Verse list with nakshatra headers ─────────────────────────────
  function _buildVerseList() {
    const parts = [];
    let prevNak = -1;

    for (const v of _verses) {
      const nak = getNak(v.s);

      if (nak && nak.num !== prevNak) {
        prevNak = nak.num;
        const totalNames = _verses
          .filter(v2 => v2.s >= nak.vsn_shloka_from && v2.s <= nak.vsn_shloka_to)
          .reduce((s, v2) => s + v2.tokens.filter(t => t.type==='name').length, 0);

        parts.push(`
<div class="vsn-nak-hdr" data-nak="${nak.num}">
  <span class="vsn-nak-num">${nak.num}</span>
  <span class="vsn-nak-name">${tr(nak.name.sa) || nak.name.te}</span>
  <div class="vsn-nak-right">
    <div class="vsn-nak-deity">${tr(nak.nakshatra_deity.sa) || nak.nakshatra_deity.te} · ${tr(nak.nakshatra_graha.sa) || nak.nakshatra_graha.te}</div>
    <div class="vsn-nak-tags">
      <span>${nak.rashi.symbol} ${tr(nak.rashi.sa) || nak.rashi.te}</span>
      <span>${t('vsn_shloka_label')} ${tdig(nak.vsn_shloka_from)}–${tdig(nak.vsn_shloka_to)}</span>
      <span>${totalNames} ${t('vsn_names_unit')}</span>
    </div>
  </div>
</div>`);
      }

      const nameToks  = v.tokens.filter(t => t.type==='name');
      const padaLabel = nak
        ? `${tr(nak.name.sa) || nak.name.te} ${t('vsn_pada_label')} ${tdig(v.s - nak.vsn_shloka_from + 1)}`
        : `${t('vsn_shloka_label')} ${tdig(v.s)}`;

      // Verse text — 2-pada uses v.padas, 4-pada uses v.padas4 (different sandhi at pada boundaries)
      const srcPadas = (_pada === 4 && v.padas4) ? v.padas4 : v.padas;
      const lineHtml = srcPadas.map(p => `<div class="vsn-vline">${tr(p)}</div>`).join('');

      // Name chips — build search index attrs inline
      const chipHtml = v.tokens.map(tok => {
        if (tok.type !== 'name') {
          return `<span class="vsn-chip vsn-av">${tok.word ? Transliterate.convert(tok.word, 'ro', _script) : ''}</span>`;
        }
        const nm  = _names[tok.n];
        const sd  = tok.sandhi;
        const key = sd ? (SD_KEY[sd.type]||'') : '';
        const col = COLORS[(tok.n-1) % COLORS.length];
        const disp = nm ? tr(nm.name) : tok.vf;
        // data-disp = rendered name (current script) for script-aware text search
        return `<span class="vsn-chip${sd?' vsn-sd':''}" style="color:${col}"
          data-n="${tok.n}" data-sd="${key}" data-color="${col}"
          data-cf="${(tok.cf||'').replace(/"/g,'&quot;')}"
          data-disp="${disp.replace(/"/g,'&quot;')}"
          data-dev="${nm?nm.name.replace(/"/g,'&quot;'):''}"
          data-anta="${nm?nm.anta:''}" data-linga="${nm?nm.linga:''}">${disp}</span>`;
      }).join('');

      parts.push(`
<div class="vsn-vcard" data-sh="${v.s}" data-names="${nameToks.map(t=>t.n).join(',')}">
  <div class="vsn-vcard-top">
    <span class="vsn-pada-lbl">${padaLabel}</span>
    <span class="vsn-count-pill">${nameToks.length} ${t('vsn_names_unit')}</span>
  </div>
  <div class="vsn-vtext">${lineHtml}<span class="vsn-snum">∥${tdig(v.s)}∥</span></div>
  <div class="vsn-chips">${chipHtml}</div>
</div>`);
    }

    return parts.join('\n');
  }

  // ── Nakshatra panel ───────────────────────────────────────────────
  function _buildNakPanel() {
    return `
<div class="vsn-pop-overlay" id="vsn-nak-overlay" style="display:none">
  <div class="vsn-popup vsn-nak-popup">
    <div class="vsn-pop-hd vsn-nak-hd" id="vsn-nak-hd">
      <button class="vsn-pop-close" id="vsn-nak-close">✕</button>
      <div class="vsn-nak-hero-num" id="vsn-nak-hero-num"></div>
      <div class="vsn-nak-hero-name" id="vsn-nak-hero-name"></div>
      <div class="vsn-nak-hero-sub" id="vsn-nak-hero-sub"></div>
    </div>
    <div class="vsn-pop-body vsn-nak-body" id="vsn-nak-body"></div>
  </div>
</div>`;
  }

  function _openNakPanel(nakNum, cx, cy) {
    const nak = _naks.find(n => n.num === nakNum);
    if (!nak) return;

    const totalNames = _verses
      .filter(v => v.s >= nak.vsn_shloka_from && v.s <= nak.vsn_shloka_to)
      .reduce((s, v) => s + v.tokens.filter(t => t.type==='name').length, 0);

    const hd = document.getElementById('vsn-nak-hd');
    const rasColor = ['#8b5e3c','#5a7a3a','#6a4a8a','#3a6a8a'][nakNum % 4];
    hd.style.background = rasColor;
    document.getElementById('vsn-nak-hero-num').textContent = nak.num;
    document.getElementById('vsn-nak-hero-name').textContent = tr(nak.name.sa) || nak.name.te;
    const deityStr = tr(nak.nakshatra_deity?.sa) || nak.nakshatra_deity?.te || '';
    document.getElementById('vsn-nak-hero-sub').textContent =
      `${nak.rashi.symbol} ${tr(nak.rashi.sa) || nak.rashi.te}  ·  ${deityStr}`;

    function row(label, val) {
      if (!val) return '';
      return `<div class="vsn-nak-row"><span class="vsn-nak-lbl">${label}</span><span class="vsn-nak-val">${val}</span></div>`;
    }
    function tf(field) { return field ? (tr(field.sa) || field.te || '') : ''; }

    const sounds = nak.sound_syllables
      ? Object.values(nak.sound_syllables).map(s => tr(s.sa) || s.te || '').join('  ')
      : '';
    const body = document.getElementById('vsn-nak-body');
    body.innerHTML = `
<div class="vsn-nak-pills">
  <span class="vsn-nak-pill">${t('vsn_shloka_label')} ${tdig(nak.vsn_shloka_from)}–${tdig(nak.vsn_shloka_to)}</span>
  <span class="vsn-nak-pill">${totalNames} ${t('vsn_names_unit')}</span>
  <span class="vsn-nak-pill">${nak.stars} ⭐</span>
</div>
<div class="vsn-nak-rows">
${row(t('vsn_nak_deity'),      tf(nak.nakshatra_deity))}
${row(t('vsn_nak_graha'),      tf(nak.nakshatra_graha))}
${row(t('vsn_nak_animal'),     tf(nak.nakshatra_animal))}
${row(t('vsn_nak_rashi'),      (tr(nak.rashi.sa) || nak.rashi.te) + ' ' + nak.rashi.symbol)}
${row(t('vsn_nak_rashi_lord'), tf(nak.rashi_lord))}
${row(t('vsn_nak_gana'),       tf(nak.gana))}
${row(t('vsn_nak_tattva'),     tf(nak.tattva))}
${row(t('vsn_nak_dosha'),      tf(nak.dosha))}
${row(t('vsn_nak_varna'),      tf(nak.varna))}
${row(t('vsn_nak_nadi'),       tf(nak.nadi))}
${row(t('vsn_nak_gemstone'),   tf(nak.gemstone))}
${row(t('vsn_nak_syllables'),  sounds)}
${row(t('vsn_nak_symbol'),     tf(nak.symbol))}
</div>
${nak.mantra ? `<div class="vsn-mantra vsn-nak-mantra">${tr(nak.mantra.sa)}</div>` : ''}`;

    const overlay = document.getElementById('vsn-nak-overlay');
    overlay.style.display = 'block';
    const popup = overlay.querySelector('.vsn-popup');
    _positionPopup(popup, cx || window.innerWidth/2, cy || window.innerHeight/2);
  }

  // ── Popup ─────────────────────────────────────────────────────────
  function _buildPopup() {
    return `
${_buildNakPanel()}
<div class="vsn-pop-overlay" id="vsn-pop-overlay" style="display:none">
  <div class="vsn-popup">
    <div class="vsn-pop-hd" id="vsn-pop-hd">
      <button class="vsn-pop-close" id="vsn-pop-close">✕</button>
      <div class="vsn-pop-meta">
        <span class="vsn-pop-num" id="vsn-pop-num"></span>
        <div class="vsn-pop-gram" id="vsn-pop-gram"></div>
      </div>
      <div class="vsn-pop-name" id="vsn-pop-name"></div>
    </div>
    <div class="vsn-pop-tabs" id="vsn-pop-tabs">
      <button class="vsn-pop-tab act" data-t="info">${t('vsn_details')}</button>
      <button class="vsn-pop-tab" data-t="meaning">${t('vsn_meaning')}</button>
    </div>
    <div class="vsn-pop-body" id="vsn-pop-info">
      <div class="vsn-mantra" id="vsn-pop-mantra"></div>
      <div id="vsn-pop-sd"></div>
    </div>
    <div class="vsn-pop-body" id="vsn-pop-meaning" style="display:none">
      <div class="vsn-mean-block">
        <div class="vsn-mean-lang">English</div>
        <div class="vsn-mean-text" id="vsn-mean-en"></div>
      </div>
      <div class="vsn-mean-block">
        <div class="vsn-mean-lang">తెలుగు</div>
        <div class="vsn-mean-text" id="vsn-mean-te"></div>
      </div>
    </div>
  </div>
</div>`;
  }

  // ── Events ────────────────────────────────────────────────────────
  function _bindEvents() {
    const panel = document.getElementById('vsn-names');

    panel.addEventListener('click', e => {
      // Script toggle
      const sc = e.target.closest('#vsn-script [data-sc]');
      if (sc) {
        _script = sc.dataset.sc;
        window._script = _script;
        _render();
        return;
      }
      // Pada toggle
      const pa = e.target.closest('#vsn-pada [data-p]');
      if (pa) { _pada = +pa.dataset.p; _render(); return; }
      // Sandhi filter
      const sf = e.target.closest('#vsn-sd-strip [data-sd]');
      if (sf) { _sdFilter = sf.dataset.sd; _applyFilter(); return; }
      // Chip click
      const chip = e.target.closest('.vsn-chip[data-n]');
      if (chip) { _openPopup(+chip.dataset.n, chip.dataset.color, e.clientX, e.clientY); return; }
      // Scroll-to-top (also handled via direct bind below)
      if (e.target.closest('#vsn-top-btn')) { _scrollTop(); return; }
      // Nakshatra header click → open nak panel
      const nakHdr = e.target.closest('.vsn-nak-hdr');
      if (nakHdr) { _openNakPanel(+nakHdr.dataset.nak, e.clientX, e.clientY); return; }
      // Nakshatra panel close
      if (e.target.id === 'vsn-nak-overlay') { document.getElementById('vsn-nak-overlay').style.display='none'; return; }
      if (e.target.id === 'vsn-nak-close')   { document.getElementById('vsn-nak-overlay').style.display='none'; return; }
      // Popup overlay close
      if (e.target.id === 'vsn-pop-overlay') { _closePopup(); return; }
      if (e.target.id === 'vsn-pop-close')   { _closePopup(); return; }
      // Popup tab switch
      const pt = e.target.closest('#vsn-pop-tabs [data-t]');
      if (pt) {
        panel.querySelectorAll('.vsn-pop-tab').forEach(b => b.classList.remove('act'));
        pt.classList.add('act');
        document.getElementById('vsn-pop-info').style.display    = pt.dataset.t==='info'    ? '' : 'none';
        document.getElementById('vsn-pop-meaning').style.display = pt.dataset.t==='meaning' ? '' : 'none';
      }
    });

    // Search
    const srch = document.getElementById('vsn-search');
    if (srch) {
      srch.addEventListener('input', () => {
        _query = srch.value;
        _applySearch(_query);
      });
    }

    // Direct bind for fixed top button (outside panel event bubble)
    const topBtn = document.getElementById('vsn-top-btn');
    if (topBtn) topBtn.addEventListener('click', _scrollTop);
  }

  function _scrollTop() {
    const sc = document.getElementById('vsn-scroll');
    if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Filter (sandhi dim) ───────────────────────────────────────────
  function _applyFilter() {
    const panel = document.getElementById('vsn-names');
    if (!panel) return;
    panel.querySelectorAll('.vsn-sf').forEach(b => b.classList.toggle('act', b.dataset.sd===_sdFilter));
    panel.querySelectorAll('.vsn-chip[data-n]').forEach(chip => {
      chip.classList.toggle('vsn-dim', !!_sdFilter && chip.dataset.sd!==_sdFilter);
    });
  }

  // ── Search ───────────────────────────────────────────────────────
  // Phonetic normalise: strip diacritics then collapse aspirate digraphs
  // so "vishnu"→"visnu" matches diacritic-stripped "viṣṇuḥ"→"visnuh"
  function _phon(s) {
    const nd = (s||'').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    return nd.replace(/sh/g,'s').replace(/kh/g,'k').replace(/gh/g,'g')
             .replace(/ch/g,'c').replace(/jh/g,'j').replace(/th/g,'t')
             .replace(/dh/g,'d').replace(/ph/g,'p').replace(/bh/g,'b')
             .replace(/ks/g,'k');
  }

  // Matches: plain number → verse#; #N → name#; otherwise text search
  function _applySearch(q) {
    const panel = document.getElementById('vsn-names');
    if (!panel) return;

    const raw     = (q || '').trim().toLowerCase();
    const rawNorm = _phon(raw);

    if (!raw) {
      panel.querySelectorAll('.vsn-vcard, .vsn-nak-hdr').forEach(el => el.style.display = '');
      return;
    }

    const verseNum = /^\d+$/.test(raw) ? +raw : null;
    const nameNum  = /^#(\d+)$/.test(raw) ? +raw.slice(1) : null;
    const nakVisible = {};

    panel.querySelectorAll('.vsn-vcard').forEach(card => {
      const sh    = +card.dataset.sh;
      const names = (card.dataset.names||'').split(',').map(Number);
      let show = false;

      if (verseNum !== null) {
        show = (sh === verseNum);
      } else if (nameNum !== null) {
        show = names.includes(nameNum);
      } else {
        for (const chip of card.querySelectorAll('.vsn-chip[data-n]')) {
          const nm = _names[+chip.dataset.n];
          if (
            (chip.dataset.disp||'').toLowerCase().includes(raw) ||
            (chip.dataset.dev||'').toLowerCase().includes(raw) ||
            _phon(chip.dataset.cf).includes(rawNorm) ||
            _phon(chip.dataset.anta).includes(rawNorm) ||
            _phon(chip.dataset.linga).includes(rawNorm) ||
            (chip.dataset.sd||'').includes(raw) ||
            (nm && _phon(nm.en).includes(rawNorm)) ||
            (nm && (nm.te||'').toLowerCase().includes(raw))
          ) { show = true; break; }
        }
      }

      card.style.display = show ? '' : 'none';
      if (show) { const nak = getNak(sh); if (nak) nakVisible[nak.num] = true; }
    });

    panel.querySelectorAll('.vsn-nak-hdr').forEach(hdr => {
      hdr.style.display = nakVisible[+hdr.dataset.nak] ? '' : 'none';
    });
  }

  // ── Position a popup near the click, clamped to viewport ──────────
  function _positionPopup(el, cx, cy) {
    const W = window.innerWidth, H = window.innerHeight;
    const pw = Math.min(360, W * 0.92);
    const ph = Math.min(el.scrollHeight || 500, H * 0.75);
    let left = cx + 12;
    let top  = cy - 20;
    if (left + pw > W - 8) left = cx - pw - 12;
    if (left < 8) left = 8;
    if (top + ph > H - 8) top = H - ph - 8;
    if (top < 8) top = 8;
    el.style.left = left + 'px';
    el.style.top  = top  + 'px';
  }

  // ── Popup ─────────────────────────────────────────────────────────
  function _openPopup(n, color, cx, cy) {
    const nm = _names[n];
    if (!nm) return;

    let sd = null;
    for (const v of _verses) {
      const tok = v.tokens.find(t => t.type==='name' && t.n===n);
      if (tok?.sandhi) { sd = tok.sandhi; break; }
    }

    const col = color || COLORS[(n-1) % COLORS.length];
    document.getElementById('vsn-pop-num').textContent  = '#' + n;
    document.getElementById('vsn-pop-hd').style.background = col;
    document.getElementById('vsn-pop-name').textContent = tr(nm.name);
    document.getElementById('vsn-pop-gram').innerHTML   =
      [nm.anta, nm.linga].filter(Boolean).map(x => `<span>${tr(x)}</span>`).join('');
    document.getElementById('vsn-pop-mantra').textContent = tr(nm.mantra);

    const sdEl = document.getElementById('vsn-pop-sd');
    if (sd) {
      const key = SD_KEY[sd.type]||'';
      const sdCol = SD_COLOR[key]||'#555';
      sdEl.innerHTML = `
<div class="vsn-sd-card" style="background:${sdCol}">
  <div class="vsn-sd-type">${tr(sd.sa)}</div>
  <div class="vsn-sd-detail">${sd.lhs} → ${sd.vf}</div>
  ${sd.sutra_ref?`<div class="vsn-sd-sutra">${sd.sutra} (${sd.sutra_ref})</div>`:''}
</div>`;
    } else {
      sdEl.innerHTML = `<div class="vsn-no-sd">${t('vsn_no_sandhi')}</div>`;
    }

    const enEl = document.getElementById('vsn-mean-en');
    const teEl = document.getElementById('vsn-mean-te');
    if (nm.en || nm.te) {
      enEl.textContent = nm.en||'';
      teEl.textContent = nm.te||'';
    } else {
      enEl.innerHTML  = `<em class="vsn-mean-empty">${t('vsn_meaning_soon')}</em>`;
      teEl.textContent = '';
    }

    // Default to meaning tab
    document.querySelectorAll('.vsn-pop-tab').forEach(b => b.classList.remove('act'));
    document.querySelector('.vsn-pop-tab[data-t="meaning"]').classList.add('act');
    document.getElementById('vsn-pop-info').style.display    = 'none';
    document.getElementById('vsn-pop-meaning').style.display = '';
    const overlay = document.getElementById('vsn-pop-overlay');
    overlay.style.display = 'block';
    const popup = overlay.querySelector('.vsn-popup');
    _positionPopup(popup, cx || window.innerWidth/2, cy || window.innerHeight/2);
  }

  function _closePopup() {
    const ov = document.getElementById('vsn-pop-overlay');
    if (ov) ov.style.display = 'none';
  }

  return { init };
})();
