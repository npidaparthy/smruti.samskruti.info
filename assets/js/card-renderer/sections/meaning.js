/* ============================================================
 * VENDORED COPY -- do not hand-edit without also checking the source.
 *
 * Source: samskruti-archives/daily-tool/src/sections/meaning.js
 * https://github.com/npidaparthy/samskruti-archives/blob/99ad38b5ff3ed7b0e69408c0acdab30f710868fb/daily-tool/src/sections/meaning.js
 * Vendored: 2026-08-25 from commit 99ad38b5ff3ed7b0e69408c0acdab30f710868fb
 *
 * This is the same engine that renders /daily/ verse-of-the-day cards
 * (via CI + headless Chrome) -- vendored here (not loaded via CDN/URL)
 * on purpose. See README.md 'Share card renderer' for why, and for the
 * steps to re-sync these files after an upstream change.
 * ============================================================ */

/*
 * meaning.js — అర్థం / MEANING. Plain-language rendering of the verse.
 */
(function () {
  window.Sections.register('meaning', window.__makeTextSection({
    heading: ['అర్థం', 'MEANING'],
    color: 'headMeaning',
    ink: 'ink',
    startSize: 38,
    minSize: 16,
  }));
})();
