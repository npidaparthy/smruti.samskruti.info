/* settings.js — persistent preferences via localStorage */

const Settings = (() => {
  const LS = C.LS;

  function get(key, def) {
    return localStorage.getItem(key) || def;
  }
  function set(key, val) {
    localStorage.setItem(key, val);
  }

  function load() {
    return {
      script:       get(LS.SCRIPT,       C.SCRIPT_DEFAULT),
      uiLang:       get(LS.UI_LANG,      C.UI_LANG_DEFAULT),
      meaningLang:  get(LS.MEANING_LANG, C.MEANING_LANG_DEFAULT),
      fontSize:     get(LS.FONT_SIZE,    C.FONT_SIZE_DEFAULT),
      theme:        get(LS.THEME,        C.THEME_DEFAULT),
      activeText:   get(LS.TEXT,         'gita'),
      testMode:     get(LS.TEST_MODE,    'pada1'),
      lipiPreset:   +get(LS.LIPI_PRESET, '0'),
      audioSpeed:   get(LS.AUDIO_SPEED,  '1'),
      autoAdvance:  get(LS.AUTO_ADVANCE, 'off'),
      autoAdvanceSecs: +get('smriti_auto_advance_secs', '9'),
      avMeaning:    get(LS.AV_MEANING,   'show'),
    };
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'auto' ? '' : theme);
    if (theme === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function applyFontSize(size) {
    document.documentElement.setAttribute('data-font', size);
  }

  function applyLipiColor(idx) {
    const root = document.documentElement;
    const preset = C.LIPI_PRESETS[idx];
    if (!preset) {
      root.style.removeProperty('--lipi-color');
    } else {
      const isDark = root.getAttribute('data-theme') === 'dark' ||
        (!root.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.style.setProperty('--lipi-color', isDark ? preset.d : preset.l);
    }
  }

  function applyAll(s) {
    window._uiLang      = s.uiLang;
    window._script      = s.script;
    window._meaningLang = s.meaningLang;
    applyTheme(s.theme);
    applyFontSize(s.fontSize);
    applyLipiColor(s.lipiPreset);
    applyI18n();
    syncPillGroups(s);
  }

  function syncPillGroups(s) {
    // Script groups
    document.querySelectorAll('[data-script]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.script === s.script);
    });
    // UI lang
    document.querySelectorAll('[data-uilang]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.uilang === s.uiLang);
    });
    // Meaning lang (all groups)
    document.querySelectorAll('[data-mlang]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mlang === s.meaningLang);
    });
    // Font
    document.querySelectorAll('[data-font]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.font === s.fontSize);
    });
    // Theme
    document.querySelectorAll('[data-theme]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === s.theme);
    });
  }

  function init() {
    const s = load();
    applyAll(s);

    // Script pills (all groups)
    document.querySelectorAll('[data-script]').forEach(btn => {
      btn.addEventListener('click', () => {
        set(LS.SCRIPT, btn.dataset.script);
        window._script = btn.dataset.script;
        syncPillGroups(load());
        window.dispatchEvent(new CustomEvent('scriptChange', { detail: btn.dataset.script }));
      });
    });

    // UI lang toggle
    document.querySelectorAll('[data-uilang]').forEach(btn => {
      btn.addEventListener('click', () => {
        set(LS.UI_LANG, btn.dataset.uilang);
        window._uiLang = btn.dataset.uilang;
        syncPillGroups(load());
        applyI18n();
        window.dispatchEvent(new CustomEvent('uiLangChange'));
      });
    });

    // Meaning lang (all groups)
    document.querySelectorAll('[data-mlang]').forEach(btn => {
      btn.addEventListener('click', () => {
        set(LS.MEANING_LANG, btn.dataset.mlang);
        window._meaningLang = btn.dataset.mlang;
        syncPillGroups(load());
        window.dispatchEvent(new CustomEvent('meaningLangChange', { detail: btn.dataset.mlang }));
      });
    });

    // Font size
    document.querySelectorAll('#s-font-group [data-font]').forEach(btn => {
      btn.addEventListener('click', () => {
        set(LS.FONT_SIZE, btn.dataset.font);
        applyFontSize(btn.dataset.font);
        syncPillGroups(load());
      });
    });

    // Theme
    document.querySelectorAll('[data-theme]').forEach(btn => {
      btn.addEventListener('click', () => {
        set(LS.THEME, btn.dataset.theme);
        applyTheme(btn.dataset.theme);
        syncPillGroups(load());
        // re-apply lipi color after theme change (light/dark values differ)
        applyLipiColor(+get(LS.LIPI_PRESET, '0'));
      });
    });

    // Lipi color swatches
    document.querySelectorAll('.lipi-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        const idx = +sw.dataset.preset;
        set(LS.LIPI_PRESET, idx);
        applyLipiColor(idx);
        document.querySelectorAll('.lipi-swatch').forEach(s => s.classList.toggle('active', +s.dataset.preset === idx));
      });
    });
    // Mark active swatch on load
    const savedPreset = +get(LS.LIPI_PRESET, '0');
    document.querySelectorAll('.lipi-swatch').forEach(s => s.classList.toggle('active', +s.dataset.preset === savedPreset));

    // Audio speed
    document.querySelectorAll('[data-audiospeed]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.audiospeed === get(LS.AUDIO_SPEED, '1'));
      btn.addEventListener('click', () => {
        set(LS.AUDIO_SPEED, btn.dataset.audiospeed);
        window._audioSpeed = +btn.dataset.audiospeed;
        document.querySelectorAll('[data-audiospeed]').forEach(b => b.classList.toggle('active', b === btn));
        window.dispatchEvent(new CustomEvent('audioSpeedChange', { detail: +btn.dataset.audiospeed }));
      });
    });
    window._audioSpeed = +get(LS.AUDIO_SPEED, '1');

    // Auto-advance toggle + slider
    const aaSliderRow = document.getElementById('s-autoadvance-speed-row');
    const aaSlider    = document.getElementById('s-autoadvance-slider');
    const aaVal       = document.getElementById('s-autoadvance-val');
    const savedAA     = get(LS.AUTO_ADVANCE, 'off');
    const savedAASecs = +get('smriti_auto_advance_secs', '9');
    if (aaSlider) { aaSlider.value = savedAASecs; }
    if (aaVal)    { aaVal.textContent = savedAASecs; }
    if (aaSliderRow) aaSliderRow.style.display = savedAA === 'on' ? '' : 'none';
    document.querySelectorAll('[data-autoadvance]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.autoadvance === savedAA);
      btn.addEventListener('click', () => {
        const val = btn.dataset.autoadvance;
        set(LS.AUTO_ADVANCE, val);
        document.querySelectorAll('[data-autoadvance]').forEach(b => b.classList.toggle('active', b === btn));
        if (aaSliderRow) aaSliderRow.style.display = val === 'on' ? '' : 'none';
        window.dispatchEvent(new CustomEvent('autoAdvanceChange', { detail: { on: val === 'on', secs: +(aaSlider?.value || 9) } }));
      });
    });
    aaSlider?.addEventListener('input', () => {
      const secs = +aaSlider.value;
      if (aaVal) aaVal.textContent = secs;
      localStorage.setItem('smriti_auto_advance_secs', secs);
      window.dispatchEvent(new CustomEvent('autoAdvanceChange', { detail: { on: get(LS.AUTO_ADVANCE, 'off') === 'on', secs } }));
    });
    window._autoAdvance = { on: savedAA === 'on', secs: savedAASecs };

    // Avadhānam meaning default
    const savedAvM = get(LS.AV_MEANING, 'show');
    document.querySelectorAll('[data-avmeaning]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.avmeaning === savedAvM);
      btn.addEventListener('click', () => {
        set(LS.AV_MEANING, btn.dataset.avmeaning);
        window._avMeaning = btn.dataset.avmeaning;
        document.querySelectorAll('[data-avmeaning]').forEach(b => b.classList.toggle('active', b === btn));
        window.dispatchEvent(new CustomEvent('avMeaningChange', { detail: btn.dataset.avmeaning }));
      });
    });
    window._avMeaning = savedAvM;
  }

  async function loadBuildBadge() {
    const el = document.getElementById('s-build-badge');
    if (!el) return;
    let buildData = {};
    try {
      const r = await fetch('/version.json?_=' + Date.now());
      buildData = await r.json();
      el.textContent = 'version: ' + (buildData.version || '—');
      el.title = 'Built: ' + (buildData.built || '');
    } catch(e) { el.textContent = 'version: dev'; }

    // Easter egg — tap 5 times rapidly
    let taps = 0, tapTimer = null;
    el.addEventListener('click', () => {
      taps++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { taps = 0; }, 1500);
      if (taps >= 5) {
        taps = 0;
        showEasterEgg(buildData);
      }
    });
  }

  function _detectPlatform() {
    const ua  = navigator.userAgent;
    const plt = navigator.platform || '';
    // Device
    let device = 'Unknown';
    if (/iPhone/.test(ua))                              device = 'iPhone';
    else if (/iPad/.test(ua) || (plt === 'MacIntel' && navigator.maxTouchPoints > 1)) device = 'iPad';
    else if (/Android/.test(ua))                        device = 'Android';
    else if (/Win/.test(plt))                           device = 'Windows';
    else if (/Mac/.test(plt))                           device = 'Mac';
    else if (/Linux/.test(plt))                         device = 'Linux';
    // Mode
    const isPwa = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    const isElectron = /Electron/.test(ua);
    const mode = isElectron ? ' · App' : isPwa ? ' · PWA' : ' · Browser';
    return device + mode;
  }

  function showEasterEgg(d) {
    const seen   = JSON.parse(localStorage.getItem('smriti_seen')  || '[]').length;
    const bmarks = Object.keys(JSON.parse(localStorage.getItem('smriti_bookmarks') || '{}')).length;
    const notes  = Object.keys(JSON.parse(localStorage.getItem('smriti_notes')     || '{}')).length;
    const ov = document.createElement('div');
    ov.className = 'easter-overlay';
    ov.innerHTML = `
      <div class="easter-card">
        <h3>🔍 BUILD INFO</h3>
        <div class="easter-row"><span class="easter-key">version</span><span class="easter-val">${d.version || 'dev'}</span></div>
        <div class="easter-row"><span class="easter-key">commit</span><span class="easter-val">${d.commit || '—'}</span></div>
        <div class="easter-row"><span class="easter-key">built</span><span class="easter-val">${(d.built || '').slice(0,16).replace('T',' ')}</span></div>
        <div class="easter-row"><span class="easter-key">verses seen</span><span class="easter-val">${seen}</span></div>
        <div class="easter-row"><span class="easter-key">bookmarks</span><span class="easter-val">${bmarks}</span></div>
        <div class="easter-row"><span class="easter-key">notes</span><span class="easter-val">${notes}</span></div>
        <div class="easter-row"><span class="easter-key">platform</span><span class="easter-val">${_detectPlatform()}</span></div>
        <div class="easter-row"><span class="easter-key">offline</span><span class="easter-val">${navigator.onLine ? 'no' : 'yes'}</span></div>
        <button class="easter-close" id="easter-close-btn">close</button>
      </div>`;
    document.body.appendChild(ov);
    ov.querySelector('#easter-close-btn').addEventListener('click', () => ov.remove());
    ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  }

  return { init, load, get, set, loadBuildBadge };
})();
