#!/usr/bin/env python3
"""
build-vsn.py — Parse data/vsn/source/ files and generate:
  data/vsn-shlokas.json  — 108 shlokas with sa/te/ro for p1..p4
  data/vsn-names.json    — 1008 names with sa/te/ro and dative form

Source files (all in data/vsn/source/):
  vsn-4-padas.txt       — Devanagari  (2 half-verses per shloka)
  vsn-4-padas_iast.txt  — IAST
  vsn-4-padas_te.txt    — Telugu

Usage: python3 scripts/build-vsn.py
"""

import re, json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from transliterate import dev_to_te, dev_to_iast

ROOT    = pathlib.Path(__file__).parent.parent
SRC_DIR = ROOT / 'data' / 'vsn' / 'source'
SRC_DN  = SRC_DIR / 'vsn-4-padas.txt'
SRC_RO  = SRC_DIR / 'vsn-4-padas_iast.txt'
SRC_TE  = SRC_DIR / 'vsn-4-padas_te.txt'
OUT_SHLOKAS = ROOT / 'data' / 'vsn-shlokas.json'
OUT_NAMES   = ROOT / 'data' / 'vsn-names.json'

DN_DIGITS = str.maketrans('०१२३४५६७८९', '0123456789')

def _parse_half_verses(path, strip_prefix=r'^ॐ\s*', num_marker=r'॥(\d+|[०-९]+)॥'):
    """
    Parse a vsn-4-padas*.txt file into list of {n, h1, h2}.
    Format: 2 content lines per shloka separated by blank lines.
    The second line carries the shloka number marker ॥N॥ (or ||N|| in IAST).
    """
    shlokas = []
    with open(path, encoding='utf-8') as f:
        lines = [l.rstrip() for l in f]

    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        # Detect shloka number — works for both Devanagari ॥N॥ and IAST ||N||
        m = re.search(r'[\|॥](\d+|[०-९]+)[\|॥]', line)
        if m:
            num_str = m.group(1).translate(DN_DIGITS)
            num = int(num_str)
            h2_raw = re.sub(r'[\|॥][०-९\d]+[\|॥].*', '', line).strip().rstrip('|।').strip()
            h1_raw = ''
            for j in range(i-1, -1, -1):
                prev = lines[j].strip()
                if prev:
                    h1_raw = re.sub(strip_prefix, '', prev).rstrip('|।').strip()
                    break
            shlokas.append({'n': num, 'h1': h1_raw, 'h2': h2_raw})
            i += 1
        else:
            i += 1
    return sorted(shlokas, key=lambda x: x['n'])


def parse_shlokas(path):
    """Parse vsn-4-padas.txt (Devanagari) into list of {n, h1, h2}."""
    return _parse_half_verses(path, strip_prefix=r'^ॐ\s*')


def parse_all_scripts():
    """
    Parse all 3 script files and return list of {n, h1_dn, h2_dn, h1_ro, h2_ro, h1_te, h2_te}.
    """
    dn = {s['n']: s for s in _parse_half_verses(SRC_DN, strip_prefix=r'^ॐ\s*')}
    ro = {s['n']: s for s in _parse_half_verses(SRC_RO, strip_prefix=r'^O[mṃ]\s*')}
    te = {s['n']: s for s in _parse_half_verses(SRC_TE, strip_prefix=r'^ఓం\s*')}

    result = []
    for n in sorted(dn):
        entry = {'n': n,
                 'h1_dn': dn[n]['h1'], 'h2_dn': dn[n]['h2'],
                 'h1_ro': ro.get(n, {}).get('h1', ''), 'h2_ro': ro.get(n, {}).get('h2', ''),
                 'h1_te': te.get(n, {}).get('h1', ''), 'h2_te': te.get(n, {}).get('h2', '')}
        result.append(entry)
    return result


def to_scripts(text):
    return {'sa': text, 'te': dev_to_te(text), 'ro': dev_to_iast(text)}


# ── Syllable-based pada splitter ─────────────────────────────────────────────

_VIRAMA_CH   = '्'
_MATRAS_SET  = set('ािीुूृॄेैोौॢ')
_IND_VOWELS  = set('अआइईउऊऋॠऌएऐओऔ')
_CONS_RANGE  = ('क', 'ह')  # [क–ह]

def _count_syllables(text):
    """Count vowel nuclei (syllables) in a Devanagari string."""
    count = 0
    chars = list(text)
    i = 0
    while i < len(chars):
        c = chars[i]
        if c in _IND_VOWELS:
            count += 1
        elif _CONS_RANGE[0] <= c <= _CONS_RANGE[1]:
            nxt = chars[i+1] if i+1 < len(chars) else ''
            if nxt == _VIRAMA_CH:
                i += 1       # skip virama — no syllable
            elif nxt in _MATRAS_SET:
                count += 1
                i += 1       # skip matra
            else:
                count += 1   # inherent 'a'
        # anusvara, visarga, space, etc. — skip
        i += 1
    return count

def _split_half(half_text):
    """
    Split a half-verse (p1+p2 or p3+p4) into two padas at the 8-syllable mark.
    Returns (first_pada, second_pada).
    """
    words = half_text.split()
    running = 0
    for i, w in enumerate(words):
        running += _count_syllables(w)
        if running >= 8:
            return ' '.join(words[:i+1]), ' '.join(words[i+1:])
    # fallback: split at midpoint
    mid = max(1, len(words) // 2)
    return ' '.join(words[:mid]), ' '.join(words[mid:])


def _split_half_parallel(dn_text, ro_text, te_text):
    """
    Split all 3 scripts using the DN syllable-count split point.
    Returns three (first, second) tuples.
    """
    dn_words = dn_text.split()
    ro_words = ro_text.split() if ro_text else []
    te_words = te_text.split() if te_text else []

    running = 0
    split_i = max(1, len(dn_words) // 2)  # fallback
    for i, w in enumerate(dn_words):
        running += _count_syllables(w)
        if running >= 8:
            split_i = i + 1
            break

    def _cut(words, idx):
        return ' '.join(words[:idx]), ' '.join(words[idx:])

    return _cut(dn_words, split_i), _cut(ro_words, split_i), _cut(te_words, split_i)


# ── Name extraction ──────────────────────────────────────────────────────────

VIRAMA_DN = '्'
U_MATRAS  = {'ु', 'ू'}   # u-class vowels → rephanta sandhi
I_MATRAS  = {'ि', 'ी'}   # i-class vowels → rephanta sandhi

def _last_vowel_type(s):
    """Return 'u', 'i', or None based on the last vowel sign in s."""
    for c in reversed(s):
        if c in U_MATRAS: return 'u'
        if c in I_MATRAS: return 'i'
        if c in {'ा', 'े', 'ो', 'ै', 'ौ', 'ृ'}: return 'a'
        if c == VIRAMA_DN: return None  # consonant cluster end
        if 'ऀ' <= c <= 'ॿ': break  # other Devanagari — stop
    return 'a'  # inherent a

def _syll_count_dn(text):
    """Count syllable nuclei in a Devanagari string (reuse logic from _count_syllables)."""
    return _count_syllables(text)

# Sanskrit prefix stems that look like rephanta sandhi but are not word junctions.
# Stored without the trailing matra (e.g. अनि → अन, अमू → अम).
_NOSPLIT_BEFORE_STEMS = {'अन', 'अम'}  # covers anir- and amūrti- prefixes

def split_token(tok):
    """
    Split a token that may contain multiple names joined by visarga sandhi.
    Returns list of canonical name strings (ः restored).

    Cases handled:
    1. Rephanta sandhi: Xu·r·C → Xuḥ + C...  (u/i + र् + consonant)
       Uses the RIGHTMOST valid rephanta to avoid splitting internal r-clusters
       (e.g. mūrti: split at junction र्, not at ū+र्+t inside the name).
       Guards:
         - before stem not a known prefix (anir-)
         - before ≥ 2 syllables (avoids dur-, nir-)
         - after ≥ 2 syllables (avoids yaḥ/tiḥ/dhā short tails)
    2. Avagraha: Xo·' → Xaḥ + a...
    3. Terminal ो → ः
    4. Terminal rephanta (र्$) → ः
    """
    results = []
    remaining = tok

    while remaining:
        # Find ALL rephanta positions; try from RIGHTMOST to leftmost
        all_m = list(re.finditer(r'([ुूिी])(र्)([क-ह])', remaining))
        split_found = False
        for m in reversed(all_m):
            before_text = remaining[:m.start(2)]
            after_text  = remaining[m.end(2):]
            before_sylls = _syll_count_dn(before_text)
            after_sylls  = _syll_count_dn(after_text)
            # Strip trailing matra to get stem for prefix check
            before_stem  = re.sub(r'[ािीुू]$', '', before_text)
            if before_stem in _NOSPLIT_BEFORE_STEMS:
                continue  # anir- prefix — keep the full name intact
            if before_sylls >= 2 and after_sylls >= 2:
                name = before_text
                name = re.sub(r'ो$', 'ः', name)
                if not name.endswith('ः'):
                    name += 'ः'
                results.append(name)
                remaining = after_text
                split_found = True
                break
        if split_found:
            continue
        # No valid rephanta split found — fall through

        # Avagraha: ोऽ → Xaḥ + a...
        m = re.search(r'ो(ऽ)', remaining)
        if m:
            # ो before avagraha = aḥ elision → restore ः
            name = remaining[:m.start(0)] + 'ः'  # strip ो, add ः
            remaining = 'अ' + remaining[m.end(1):]
            results.append(name)
            continue

        # No more splits — finalize remaining
        name = remaining.strip('।॥')
        name = re.sub(r'ो$', 'ः', name)   # terminal ao → aḥ
        name = re.sub(r'र्$', 'ः', name)  # terminal rephanta → ḥ
        # If ends in plain consonant with inherent 'a' (no matra, no virama, no ः),
        # it likely had a visarga that was elided (e.g. after avagraha split)
        if name and 'क' <= name[-1] <= 'ह' and name[-1] not in {'ं', 'ः', '्'}:
            name = name + 'ः'
        if name:
            results.append(name)
        break

    return [n for n in results if n]


# Particles and non-name tokens that appear in VSN text
_PARTICLES = {'च', 'एव', 'च्', 'न', 'तु', 'हि', 'वै', 'इव', 'किम्', 'अपि'}

# Post-processing corrections for names the parser cannot split correctly.
# Two root causes:
#   (a) visarga+vowel sandhi: visarga becomes plain र before vowels — regex can't find junction
#   (b) internal rephanta in words like कीर्ति/तीर्थ/मूर्ति confuse rightmost-heuristic
# Keys are exactly what split_token emits; values are the correct replacements.
_NAME_CORRECTIONS = {
    # shloka 77: dīptamūrtiḥ + amūrtimān joined by visarga+vowel sandhi
    'दीप्तमूर्तिरमूः': ['दीप्तमूर्तिः'],
    'तिमान्':           ['अमूर्तिमान्'],
    # shloka 77: anekamūrtiḥ + avyaktaḥ joined by visarga+vowel sandhi
    'अनेकमूः':         ['अनेकमूर्तिः'],
    'तिरव्यक्तः':      ['अव्यक्तः'],
    # shloka 92: puṇyakīrtiḥ + anāmayaḥ — internal kīrti rephanta fires instead of junction
    'पुण्यकीः':        ['पुण्यकीर्तिः'],
    'तिरनामयः':        ['अनामयः'],
    # shloka 92: manojavaḥ + tīrthakaraḥ — ḥ+t→s sandhi hides junction; internal tīrtha rephanta fires
    'मनोजवस्तीः':      ['मनोजवः'],
    'थकरः':            ['तीर्थकरः'],
    # shloka 89: amūrtiḥ + anaghaḥ — avagraha join prevents rephanta split, token stays fused
    'अमूर्तिरनघः':     ['अमूर्तिः', 'अनघः'],
    # shloka 89: guṇabhṛt + nirguṇaḥ — consonant-assimilation sandhi (भृत्+निर्→भृन्निर्)
    'गुणभृन्निः':      ['गुणभृत्', 'निर्गुणः'],
    # drop the spurious lone guṇaḥ that the above split produces (nirguṇaḥ already added via गुणभृन्निः)
    'गुणः':             [],
    # spurious shloka-number token (Devanagari ८६) that leaks into name stream
    '८६':              [],
}

def _apply_name_corrections(raw_names):
    """Replace known-wrong compound names with their correct components."""
    result = []
    for (sa, snum) in raw_names:
        corrected = _NAME_CORRECTIONS.get(sa)
        if corrected is not None:
            for c in corrected:
                result.append((c, snum))
        else:
            result.append((sa, snum))
    return result


def extract_names_from_shlokas(shlokas):
    """
    Extract individual name tokens from all 108 shlokas.
    Returns list of (name_sa, shloka_num) tuples.
    """
    names = []
    for shloka in shlokas:
        snum = shloka['n']
        for half in ('h1', 'h2'):
            text = shloka[half]
            tokens = text.split()
            for tok in tokens:
                tok = tok.strip('।॥')
                if not tok or tok in _PARTICLES:
                    continue
                for name in split_token(tok):
                    if name and name not in _PARTICLES:
                        names.append((name, snum))
    return _apply_name_corrections(names)

# Alias: used by build_shlokas with the parsed {n,h1,h2} dict

# ── Dative form ──────────────────────────────────────────────────────────────

# Unicode Devanagari chars
VISARGA  = 'ः'
VIRAMA   = '्'
AA_MATRA = 'ा'

def dative_form(name_sa):
    """
    Compute dative singular of a Sanskrit name (best-effort, covers most VSN stems).

    Stem classes by nominative ending:
      Xaḥ   (a-stem masc/neut)  → Xāya     e.g. भावः  → भावाय
      Xuḥ   (u-stem)            → Xave     e.g. विष्णुः → विष्णवे
      Xiḥ   (i-stem)            → Xaye     e.g. गतिः  → गतये
      Xā    (an-stem masc nom)  → Xne      e.g. भूतात्मा → भूतात्मने
      X्    (cons-stem)         → Xे       e.g. भूतकृत् → भूतकृते
      Xī    (in-stem)           → Xne      e.g. साक्षी  → साक्षिणे
      Xaṃ   (neut a-stem)       → Xāya     e.g. विश्वं  → विश्वाय
    """
    n = name_sa
    if not n:
        return n

    # a-stem / u-stem / i-stem: ends in ः
    if n.endswith(VISARGA):
        stem = n[:-1]
        if stem.endswith('ु') or stem.endswith('ू'):  # u-stem
            return stem[:-1] + 'वे'
        if stem.endswith('ि'):                         # i-stem
            return stem[:-1] + 'ये'
        if stem.endswith('ी'):                         # ī-stem / in-stem (approximate)
            return stem[:-1] + 'ये'
        if stem.endswith(AA_MATRA):                    # ā-stem → rare, treat as feminine
            return stem + 'यै'
        # Default: a-stem (inherent a at end, or consonant)
        return stem + 'ाय'

    # Consonant stem: ends in virama
    if n.endswith(VIRAMA):
        stem = n[:-1]  # drop virama; vowel-less consonant
        return stem + 'े'

    # Neuter a-stem: ends in anusvara ं  (e.g. विश्वं)
    if n.endswith('ं'):
        # Could be ā + anusvara (genitive pl. qualifier like योगविदां) — strip anusvara only
        stem = n[:-1]
        if stem.endswith(AA_MATRA):
            return stem + 'य'   # e.g. योगविदां → योगविदाय (avoid double ā)
        return stem + 'ाय'      # e.g. विश्वं → विश्वाय

    # an-stem (masc nom): ends in ā-matra  (e.g. भूतात्मा, विश्वकर्मा)
    if n.endswith(AA_MATRA):
        return n[:-1] + 'ने'

    # in-stem (masc nom): ends in ī  (e.g. साक्षी, योगी)
    if n.endswith('ी'):
        # strip ī, add -ine
        return n[:-1] + 'िने'

    # Fallback
    return n + 'ाय'


def make_chant(name_sa, num, shloka_num):
    """
    Build chant entry for one name:
      OM <dative> namaḥ ।
    Returns dict with sa/te/ro for name and chant, plus shloka reference.
    """
    dative_sa = dative_form(name_sa)
    chant_sa  = f'ॐ {dative_sa} नमः ।'
    return {
        'n': num,
        'sh': shloka_num,
        'akshara': _count_syllables(name_sa),
        'name': to_scripts(name_sa),
        'dative': to_scripts(dative_sa),
        'chant': to_scripts(chant_sa),
    }


# ── Main ─────────────────────────────────────────────────────────────────────

def build_shlokas():
    all_scripts = parse_all_scripts()
    out = []
    for s in all_scripts:
        (p1_dn, p2_dn), (p1_ro, p2_ro), (p1_te, p2_te) = _split_half_parallel(
            s['h1_dn'], s['h1_ro'], s['h1_te'])
        (p3_dn, p4_dn), (p3_ro, p4_ro), (p3_te, p4_te) = _split_half_parallel(
            s['h2_dn'], s['h2_ro'], s['h2_te'])
        out.append({
            's': s['n'],
            'p1': {'sa': p1_dn, 'ro': p1_ro, 'te': p1_te},
            'p2': {'sa': p2_dn, 'ro': p2_ro, 'te': p2_te},
            'p3': {'sa': p3_dn, 'ro': p3_ro, 'te': p3_te},
            'p4': {'sa': p4_dn, 'ro': p4_ro, 'te': p4_te},
        })

    result = {'text': 'vsn', 'total': len(out), 'shlokas': out}
    with open(OUT_SHLOKAS, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, separators=(',', ':'))
    print(f'  wrote {OUT_SHLOKAS}  ({len(out)} shlokas)')
    # Return raw DN shlokas for name extraction
    return [{'n': s['n'], 'h1': s['h1_dn'], 'h2': s['h2_dn']} for s in all_scripts]


def build_names(shlokas_raw):
    name_tokens = extract_names_from_shlokas(shlokas_raw)
    print(f'  extracted {len(name_tokens)} name tokens')

    # Preserve existing meanings so a rebuild never wipes manually added data
    existing_meanings = {}
    if OUT_NAMES.exists():
        try:
            existing = json.loads(OUT_NAMES.read_text(encoding='utf-8'))
            existing_meanings = {n['n']: n['meaning'] for n in existing.get('names', []) if n.get('meaning')}
            print(f'  preserving meanings for {len(existing_meanings)} names')
        except Exception:
            pass

    names_out = []
    for i, (name_sa, shloka_num) in enumerate(name_tokens, 1):
        entry = make_chant(name_sa, i, shloka_num)
        if i in existing_meanings:
            entry['meaning'] = existing_meanings[i]
        names_out.append(entry)

    result = {'text': 'vsn', 'total': len(names_out), 'names': names_out}
    with open(OUT_NAMES, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, separators=(',', ':'))
    print(f'  wrote {OUT_NAMES}  ({len(names_out)} names)')


if __name__ == '__main__':
    shlokas_raw = build_shlokas()
    build_names(shlokas_raw)
