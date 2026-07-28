/* transliterate.js
 * Convert text between Devanagari (sa), Telugu (te), and IAST romanisation (ro).
 * No external dependencies. Source of truth: vsn-1000-names.json (Devanagari field).
 *
 * Public API:
 *   Transliterate.convert(text, from, to)  → string
 *   Transliterate.detect(text)             → 'sa' | 'te' | 'ro'
 *
 * Scripts: 'sa' = Devanagari, 'te' = Telugu, 'ro' = IAST romanisation
 */

const Transliterate = (() => {
  'use strict';

  // ── Devanagari ↔ Telugu: direct 1-to-1 character map ──────────────────────
  // All Sanskrit phonemes present in VSN are covered.

  const D2T = {
    // Independent vowels
    'अ':'అ', 'आ':'ఆ', 'इ':'ఇ', 'ई':'ఈ', 'उ':'ఉ', 'ऊ':'ఊ',
    'ऋ':'ఋ', 'ॠ':'ౠ', 'ऌ':'ఌ', 'ए':'ఏ', 'ऐ':'ఐ', 'ओ':'ఓ', 'औ':'ఔ',
    // Vowel matras
    'ा':'ా', 'ि':'ి', 'ी':'ీ', 'ु':'ు', 'ू':'ూ',
    'ृ':'ృ', 'ॄ':'ౄ', 'े':'ే', 'ै':'ై', 'ो':'ో', 'ौ':'ౌ',
    // Virama, anusvara, visarga, chandrabindu, avagraha
    '्':'్', 'ं':'ం', 'ः':'ః', 'ँ':'ఁ', 'ऽ':'ఽ',
    // Consonants
    'क':'క', 'ख':'ఖ', 'ग':'గ', 'घ':'ఘ', 'ङ':'ఙ',
    'च':'చ', 'छ':'ఛ', 'ज':'జ', 'झ':'ఝ', 'ञ':'ఞ',
    'ट':'ట', 'ठ':'ఠ', 'ड':'డ', 'ढ':'ఢ', 'ण':'ణ',
    'त':'త', 'थ':'థ', 'द':'ద', 'ध':'ధ', 'न':'న',
    'प':'ప', 'फ':'ఫ', 'ब':'బ', 'भ':'భ', 'म':'మ',
    'य':'య', 'र':'ర', 'ल':'ల', 'व':'వ', 'ळ':'ళ',
    'श':'శ', 'ष':'ష', 'स':'స', 'ह':'హ',
    // Devanagari digits → Telugu digits
    '०':'౦', '१':'౧', '२':'౨', '३':'౩', '४':'౪',
    '५':'౫', '६':'౬', '७':'౭', '८':'౮', '९':'౯',
    // Punctuation kept as-is (danda, double danda)
  };

  // Telugu → Devanagari (auto-generated reverse)
  const T2D = Object.fromEntries(Object.entries(D2T).map(([d, t]) => [t, d]));

  // ── IAST → Devanagari tokeniser ────────────────────────────────────────────
  // Longest-match first. Order matters — digraphs before unigraphs.

  const I2D_CON = [
    ['kh','ख'], ['gh','घ'], ['ch','छ'], ['jh','झ'], ['ṭh','ठ'],
    ['ḍh','ढ'], ['th','थ'], ['dh','ध'], ['ph','फ'], ['bh','भ'],
    ['ṅ','ङ'],  ['ñ','ञ'],  ['ṇ','ण'],  ['ṭ','ट'],  ['ḍ','ड'],
    ['ś','श'],  ['ṣ','ष'],  ['ḷ','ळ'],
    ['k','क'],  ['g','ग'],  ['c','च'],  ['j','ज'],
    ['t','त'],  ['d','द'],  ['n','न'],  ['p','प'],  ['b','ब'],
    ['m','म'],  ['y','य'],  ['r','र'],  ['l','ल'],  ['v','व'],
    ['s','स'],  ['h','ह'],
  ];

  const I2D_VOW = [
    ['ai','ऐ'], ['au','औ'], ['ā','आ'], ['ī','ई'], ['ū','ऊ'],
    ['ṛ','ऋ'],  ['ṝ','ॠ'],  ['ḷ','ऌ'],
    ['a','अ'],  ['i','इ'],  ['u','उ'],  ['e','ए'],  ['o','ओ'],
  ];

  const I2D_MAT = {
    'ai':'ै', 'au':'ौ', 'ā':'ा', 'ī':'ी', 'ū':'ू',
    'ṛ':'ृ',  'ṝ':'ॄ',  'a':'',  'i':'ि',  'u':'ु',  'e':'े',  'o':'ो',
  };

  // Anusvara before a consonant → class nasal in Devanagari
  function _classNasal(iastRest) {
    if (!iastRest || iastRest[0] === ' ') return 'ं';
    const r2 = iastRest.slice(0, 2);
    if (r2 === 'kh' || r2 === 'gh') return 'ङ्';
    if (r2 === 'ch' || r2 === 'jh') return 'ञ्';
    if (r2 === 'ṭh' || r2 === 'ḍh') return 'ण्';
    if (r2 === 'th' || r2 === 'dh') return 'न्';
    if (r2 === 'ph' || r2 === 'bh') return 'म्';
    const r1 = iastRest[0];
    if ('kgṅ'.includes(r1))  return 'ङ्';
    if ('cjñ'.includes(r1))  return 'ञ्';
    if ('ṭḍṇ'.includes(r1)) return 'ण्';
    if ('tdn'.includes(r1))  return 'न्';
    if ('pbm'.includes(r1))  return 'म्';
    return 'ं';
  }

  // Normalise apostrophe variants to ASCII ' (for avagraha)
  function _normApos(s) {
    return s.replace(/[‘’ʼʹʾʿ]/g, chr => chr.charCodeAt(0) < 0x0300 ? "'" : chr);
  }

  function iast2dev(s) {
    s = s.replace(/ṁ/g, 'ṃ').replace(/m̐/g, 'ṃ'); // ṁ → ṃ
    s = _normApos(s);

    // tokenise into {t, ...} nodes
    const toks = []; let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (ch === 'ṃ') { // ṃ
        toks.push({ t:'misc', v: _classNasal(s.slice(i + 1)) }); i++; continue;
      }
      if (ch === 'ḥ') { toks.push({ t:'misc', v:'ः' }); i++; continue; } // ḥ
      if (ch === "'") {
        const prev = toks[toks.length - 1];
        const onVow = prev && (prev.t === 'v' || (prev.t === 'misc' && prev.v === 'अ'));
        toks.push({ t:'misc', v: onVow ? 'ऽ' : 'अ' }); i++; continue;
      }
      if (' \n\t.,।॥'.includes(ch)) { toks.push({ t:'misc', v:ch }); i++; continue; }

      const con = I2D_CON.find(([ic]) => s.startsWith(ic, i));
      if (con) { toks.push({ t:'c', ic:con[0], dc:con[1] }); i += con[0].length; continue; }

      const vow = I2D_VOW.find(([iv]) => s.startsWith(iv, i));
      if (vow) { toks.push({ t:'v', iv:vow[0], dv:vow[1] }); i += vow[0].length; continue; }

      toks.push({ t:'misc', v:ch }); i++;
    }

    // render tokens to Devanagari
    const out = []; let j = 0;
    while (j < toks.length) {
      const tok = toks[j], next = toks[j + 1];
      if (tok.t === 'c') {
        out.push(tok.dc);
        if (next && next.t === 'v') {
          const m = I2D_MAT[next.iv];
          if (m) out.push(m);
          j++;
        } else {
          out.push('्'); // virama — no following vowel
        }
      } else if (tok.t === 'v') {
        const prev = j > 0 ? toks[j - 1] : null;
        if (!prev || prev.t !== 'c') out.push(tok.dv); // standalone vowel only
      } else {
        if (tok.v) out.push(tok.v);
      }
      j++;
    }
    return out.join('').trim();
  }

  // ── Devanagari → IAST ─────────────────────────────────────────────────────
  // Build reverse lookup tables from the I2D tables above

  const _D2I_CON = Object.fromEntries(I2D_CON.map(([ia, dv]) => [dv, ia]));
  const _D2I_VOW = Object.fromEntries(I2D_VOW.map(([ia, dv]) => [dv, ia]));
  const _D2I_MAT = Object.fromEntries(
    Object.entries(I2D_MAT).filter(([, m]) => m !== '').map(([ia, m]) => [m, ia])
  );

  const _DEV_CONS = new Set(Object.keys(_D2I_CON));
  const _DEV_VOWS = new Set(Object.keys(_D2I_VOW));
  const _DEV_MATS = new Set(Object.keys(_D2I_MAT));
  const _DEV_VIRAMA = '्';

  function dev2iast(s) {
    const chars = [...s]; // Unicode-safe split
    const out = []; let i = 0;
    while (i < chars.length) {
      const ch = chars[i], nx = chars[i + 1];
      if (_DEV_CONS.has(ch)) {
        out.push(_D2I_CON[ch]);
        if (nx === _DEV_VIRAMA) {
          i += 2; continue; // consonant cluster — no inherent a
        }
        if (nx && _DEV_MATS.has(nx)) {
          out.push(_D2I_MAT[nx]);
          i += 2; continue;
        }
        out.push('a'); // inherent a
      } else if (_DEV_VOWS.has(ch)) {
        out.push(_D2I_VOW[ch]);
      } else if (ch === 'ं') {
        out.push('ṃ'); // ṃ
      } else if (ch === 'ः') {
        out.push('ḥ'); // ḥ
      } else if (ch === 'ँ') {
        out.push('m̐');
      } else if (ch === 'ऽ') {
        out.push("'");
      } else if (ch === _DEV_VIRAMA) {
        // orphaned virama — skip
      } else if (_DEV_MATS.has(ch)) {
        out.push(_D2I_MAT[ch]); // orphaned matra
      } else {
        out.push(ch); // digits, punctuation, etc.
      }
      i++;
    }
    return out.join('');
  }

  // ── Script detection ──────────────────────────────────────────────────────
  function detect(text) {
    for (const ch of text) {
      const cp = ch.codePointAt(0);
      if (cp >= 0x0900 && cp <= 0x097F) return 'sa';
      if (cp >= 0x0C00 && cp <= 0x0C7F) return 'te';
    }
    return 'ro';
  }

  // ── Public convert — pivot through Devanagari ─────────────────────────────
  function convert(text, from, to) {
    if (!text) return '';
    const f = from || detect(text);
    if (f === to) return text;

    // Step 1: normalise to Devanagari
    let dev;
    if      (f === 'sa') dev = text;
    else if (f === 'te') dev = [...text].map(c => T2D[c] !== undefined ? T2D[c] : c).join('');
    else                 dev = iast2dev(text); // 'ro'

    // Step 2: render to target
    if (to === 'sa') return dev;
    if (to === 'te') return [...dev].map(c => D2T[c] !== undefined ? D2T[c] : c).join('');
    if (to === 'ro') return dev2iast(dev);
    return text;
  }

  return { convert, detect, iast2dev, dev2iast };
})();

if (typeof module !== 'undefined') module.exports = Transliterate;
