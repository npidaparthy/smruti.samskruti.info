/* ============================================================
 * VENDORED COPY -- do not hand-edit without also checking the source.
 *
 * Source: samskruti-archives/daily-tool/src/sections/commentary.js
 * https://github.com/npidaparthy/samskruti-archives/blob/99ad38b5ff3ed7b0e69408c0acdab30f710868fb/daily-tool/src/sections/commentary.js
 * Vendored: 2026-08-25 from commit 99ad38b5ff3ed7b0e69408c0acdab30f710868fb
 *
 * This is the same engine that renders /daily/ verse-of-the-day cards
 * (via CI + headless Chrome) -- vendored here (not loaded via CDN/URL)
 * on purpose. See README.md 'Share card renderer' for why, and for the
 * steps to re-sync these files after an upstream change.
 * ============================================================ */

/*
 * commentary.js — తాత్పర్యం / COMMENTARY. The deeper explanation (tatparyam).
 */
(function () {
  window.Sections.register('commentary', window.__makeTextSection({
    heading: ['తాత్పర్యం', 'COMMENTARY'],
    color: 'headCommentary',
    ink: 'ink2',
    startSize: 32,
    minSize: 14,
  }));
})();
