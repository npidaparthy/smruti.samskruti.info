/* share.js — Share verse as an image card.
 *
 * Uses the vendored palm-leaf card renderer (assets/js/card-renderer/) --
 * the same canvas-drawing engine that renders /daily/ verse-of-the-day
 * cards -- so a card shared from the Reader/Avadhānam looks identical to
 * that verse's own daily card, if the daily rotation ever picks it.
 *
 * header/footer/theme values here mirror daily/config.json's site-wide
 * card.header/card.footer/card.theme and each feed's card.header.heading --
 * kept in sync by hand (they rarely change) rather than fetching
 * config.json at share time.
 */

const Share = (() => {
  const SITE_FOOTER = {
    left: 'స్మృతిః । स्मृतिः',
    middle: 'samskruti.info@gmail.com',
    right: 'https://smruti.samskruti.info',
  };
  const THEME = { template: 'palm-leaf', accent: '#c8a84b', grain: 8 };

  const HEADINGS = {
    gita: { te: n => `శ్రీమద్భగవద్గీతా ${n}`, sa: n => `श्रीमद्भगवद्गीता ${n}`, ro: n => `Śrīmad Bhagavadgītā ${n}` },
    vsn:  { te: 'శ్రీవిష్ణుసహస్రనామస్తోత్రమ్', sa: 'श्रीविष्णुसहस्रनामस्तोत्रम्', ro: 'Śrī Viṣṇu Sahasranāma Stotram' },
    sl:   { te: 'సౌన్దర్యలహరీ', sa: 'सौन्दर्यलहरी', ro: 'Saundarya Laharī' },
  };

  function scriptKey(script) {
    return script === 'sa' ? 'sa' : script === 'ro' ? 'ro' : 'te';
  }

  // ── VSN daily-card data (h1/h2 half-shlokas + pre-formatted names list) ──
  // Same source file the /daily/ VSN feed itself renders from.
  let vsnDailyCards = null;
  async function loadVsnDailyCards() {
    if (vsnDailyCards) return vsnDailyCards;
    const r = await fetch('/data/vsn/vsn-daily-cards.json');
    const d = await r.json();
    vsnDailyCards = d.shlokas || [];
    return vsnDailyCards;
  }

  function padaLines(sh, key) {
    return ['p1', 'p2', 'p3', 'p4']
      .map(k => sh[k] && (sh[k][key] || sh[k].ro))
      .filter(Boolean)
      .join('\n');
  }

  async function buildPayload(sh, textType) {
    const script = window._script || 'te';
    const key    = scriptKey(script);
    const lang   = window._meaningLang || 'en';

    if (textType === 'vsn') {
      const cards = await loadVsnDailyCards();
      const rec   = cards.find(c => c.sh === sh.s);
      const verse = rec ? [rec[`h1_${key}`], rec[`h2_${key}`]].filter(Boolean).join('\n') : '';
      const namesKey = key === 'ro' ? 'en' : key; // vsn-daily-cards.json has no names_ro
      const names = (rec && rec[`names_${namesKey}`]) || '';
      return {
        size: 1080, script, theme: THEME,
        header: { heading: HEADINGS.vsn[key] || HEADINGS.vsn.te, align: 'center' },
        footer: SITE_FOOTER,
        sections: [
          { type: 'verse', value: verse, opts: { meta: { script, syllables: 8 } } },
          { type: 'names', value: names },
        ],
      };
    }

    const m = sh.meaning && (sh.meaning[lang] || sh.meaning.en);
    const verse = padaLines(sh, key);

    if (textType === 'sl') {
      return {
        size: 1080, script, theme: THEME,
        header: { heading: HEADINGS.sl[key] || HEADINGS.sl.te, align: 'center' },
        footer: SITE_FOOTER,
        sections: [
          { type: 'verse', value: verse, opts: { meta: { script, syllables: 17 } } },
          { type: 'meaning', value: (m && m.short) || '' },
          { type: 'commentary', value: (m && m.long) || '' },
        ],
      };
    }

    // gita
    const headingFn = HEADINGS.gita[key] || HEADINGS.gita.te;
    return {
      size: 1080, script, theme: THEME,
      header: { heading: headingFn(`${sh.c}.${sh.s}`), align: 'center' },
      footer: SITE_FOOTER,
      sections: [
        { type: 'verse', value: verse, opts: { meta: { script, syllables: 8 } } },
        { type: 'meaning', value: (m && m.short) || '' },
        { type: 'commentary', value: (m && m.long) || '' },
      ],
    };
  }

  async function renderCard(payload) {
    // window.render() (card-renderer/renderer.js) looks up a fixed
    // #card canvas element -- create one just for this render, off-screen.
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    const canvas = document.createElement('canvas');
    canvas.id = 'card';
    canvas.style.cssText = 'position:fixed; left:-9999px; top:0; pointer-events:none;';
    document.body.appendChild(canvas);
    try {
      return window.render(payload);
    } finally {
      canvas.remove();
    }
  }

  async function shareVerse(sh, textType) {
    if (!sh) return;
    const payload = await buildPayload(sh, textType);
    const dataUrl = await renderCard(payload);

    const filename = textType === 'vsn' ? `vsn-${sh.s}.png`
      : textType === 'sl' ? `sl-${sh.s}.png`
      : `gita-${sh.c}-${sh.s}.png`;
    const title = textType === 'vsn' ? `Śrī Viṣṇu Sahasranāmam #${sh.s}`
      : textType === 'sl' ? `Saundarya Laharī ${sh.s}`
      : `Bhagavad Gītā ${sh.c}.${sh.s}`;

    if (navigator.canShare) {
      const res  = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title });
          return;
        } catch (e) { if (e.name === 'AbortError') return; }
      }
      downloadDataUrl(dataUrl, filename);
    } else {
      const win = window.open();
      win.document.write(`<img src="${dataUrl}" style="max-width:100%"><br><a download="${filename}" href="${dataUrl}">Download</a>`);
    }
  }

  function downloadDataUrl(dataUrl, filename) {
    const a = document.createElement('a');
    a.download = filename;
    a.href = dataUrl;
    a.click();
  }

  return { shareVerse };
})();
