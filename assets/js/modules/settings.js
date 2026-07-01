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
      script:      get(LS.SCRIPT,       C.SCRIPT_DEFAULT),
      uiLang:      get(LS.UI_LANG,      C.UI_LANG_DEFAULT),
      meaningLang: get(LS.MEANING_LANG, C.MEANING_LANG_DEFAULT),
      fontSize:    get(LS.FONT_SIZE,    C.FONT_SIZE_DEFAULT),
      theme:       get(LS.THEME,        C.THEME_DEFAULT),
      activeText:  get(LS.TEXT,         'gita'),
      testMode:    get(LS.TEST_MODE,    'pada1'),
      lipiPreset:  +get(LS.LIPI_PRESET, '0'),
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
  }

  return { init, load, get, set };
})();
