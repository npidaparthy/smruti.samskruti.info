"""
transliterate.py — IAST → Devanagari and Telugu script conversion.
Used by build.py to generate dn/te padas from IAST source.
"""

# ── IAST → Devanagari ─────────────────────────────────────────────────────────
# Longest-match first (two-char sequences before single-char)
IAST_TO_DN = [
    # Digraphs first
    ('kh', 'ख'), ('gh', 'घ'), ('ch', 'च'), ('jh', 'झ'), ('ṭh', 'ठ'),
    ('ḍh', 'ढ'), ('th', 'थ'), ('dh', 'ध'), ('ph', 'फ'), ('bh', 'भ'),
    ('śh', 'श'),
    # Vowels (long before short where needed)
    ('ā',  'ā'),  # placeholder — handled in vowel map below
    # Handled via vowel map
]

# We'll use a simpler character-by-character + digraph approach:
DN_MAP = {
    # Independent vowels
    'a':  'अ', 'ā':  'आ', 'i':  'इ', 'ī':  'ई',
    'u':  'उ', 'ū':  'ऊ', 'ṛ':  'ऋ', 'ṝ':  'ॠ',
    'e':  'ए', 'ai': 'ऐ', 'o':  'ओ', 'au': 'औ',
    'ṃ':  'ं', 'ḥ':  'ः', 'ḫ':  'ः',
    # Consonants
    'k':  'क', 'kh': 'ख', 'g':  'ग', 'gh': 'घ', 'ṅ':  'ङ',
    'c':  'च', 'ch': 'छ', 'j':  'ज', 'jh': 'झ', 'ñ':  'ञ',
    'ṭ':  'ट', 'ṭh': 'ठ', 'ḍ':  'ड', 'ḍh': 'ढ', 'ṇ':  'ण',
    't':  'त', 'th': 'थ', 'd':  'द', 'dh': 'ध', 'n':  'न',
    'p':  'प', 'ph': 'फ', 'b':  'ब', 'bh': 'भ', 'm':  'म',
    'y':  'य', 'r':  'र', 'l':  'ल', 'v':  'व',
    'ś':  'श', 'ṣ':  'ष', 's':  'स', 'h':  'ह',
    'ḷ':  'ळ', 'kṣ': 'क्ष', 'jñ': 'ज्ञ',
    "'":  'ऽ',  # avagraha
    ' ':  ' ', '-':  '‍', # zero-width joiner for virama continuation
}

TE_MAP = {
    # Independent vowels
    'a':  'అ', 'ā':  'ఆ', 'i':  'ఇ', 'ī':  'ఈ',
    'u':  'ఉ', 'ū':  'ఊ', 'ṛ':  'ఋ', 'ṝ':  'ౠ',
    'e':  'ఎ', 'ē':  'ఏ', 'ai': 'ఐ', 'o':  'ఒ', 'ō':  'ఓ', 'au': 'ఔ',
    'ṃ':  'ం', 'ḥ':  'ః',
    # Consonants
    'k':  'క', 'kh': 'ఖ', 'g':  'గ', 'gh': 'ఘ', 'ṅ':  'ఙ',
    'c':  'చ', 'ch': 'ఛ', 'j':  'జ', 'jh': 'ఝ', 'ñ':  'ఞ',
    'ṭ':  'ట', 'ṭh': 'ఠ', 'ḍ':  'డ', 'ḍh': 'ఢ', 'ṇ':  'ణ',
    't':  'త', 'th': 'థ', 'd':  'ద', 'dh': 'ధ', 'n':  'న',
    'p':  'ప', 'ph': 'ఫ', 'b':  'బ', 'bh': 'భ', 'm':  'మ',
    'y':  'య', 'r':  'ర', 'l':  'ల', 'v':  'వ',
    'ś':  'శ', 'ṣ':  'ష', 's':  'స', 'h':  'హ',
    'ḷ':  'ళ', "'":  'ఽ',
    ' ':  ' ',
}

# Vowel signs (mātrā) — when a vowel follows a consonant
DN_MAATRA = {
    'a':  '',    # inherent vowel — no sign (but need virama when no vowel)
    'ā':  'ा', 'i':  'ि', 'ī':  'ी',
    'u':  'ु', 'ū':  'ू', 'ṛ':  'ृ',
    'e':  'े', 'ai': 'ै', 'o':  'ो', 'au': 'ौ',
}

TE_MAATRA = {
    'a':  '',
    'ā':  'ా', 'i':  'ి', 'ī':  'ీ',
    'u':  'ు', 'ū':  'ూ', 'ṛ':  'ృ',
    'e':  'ే', 'ai': 'ై', 'o':  'ో', 'au': 'ౌ',
    'ē':  'ే', 'ō':  'ో',
}

VOWELS = set(['a','ā','i','ī','u','ū','ṛ','ṝ','e','ē','ai','o','ō','au'])
CONSONANTS_DN = {k: v for k, v in DN_MAP.items() if k not in VOWELS and k not in ('ṃ','ḥ',' ','-',"'")}
CONSONANTS_TE = {k: v for k, v in TE_MAP.items() if k not in VOWELS and k not in ('ṃ','ḥ',' ',"'")}


def _tokenize(text):
    """
    Tokenize IAST text into a sequence of (type, value) pairs:
      type in: 'vowel', 'consonant', 'anusvara', 'visarga', 'space', 'punct', 'avagraha'
    Digraphs are consumed first.
    """
    tokens = []
    i = 0
    while i < len(text):
        c2 = text[i:i+2]
        c1 = text[i]
        # Two-char consonants
        if c2 in ('kh','gh','ch','jh','ṭh','ḍh','th','dh','ph','bh','kṣ','jñ'):
            tokens.append(('consonant', c2))
            i += 2
        elif c2 in ('ai','au','ṝ'):
            tokens.append(('vowel', c2))
            i += 2
        elif c1 == 'ṃ':
            tokens.append(('anusvara', 'ṃ'))
            i += 1
        elif c1 == 'ḥ':
            tokens.append(('visarga', 'ḥ'))
            i += 1
        elif c1 == "'":
            tokens.append(('avagraha', "'"))
            i += 1
        elif c1 in 'aāiīuūṛeēoō':
            tokens.append(('vowel', c1))
            i += 1
        elif c1 in 'kgcjṭḍtdnpbmyrlvśṣshṅñṇḷf':
            tokens.append(('consonant', c1))
            i += 1
        elif c1 == ' ':
            tokens.append(('space', ' '))
            i += 1
        elif c1 == '-':
            tokens.append(('space', ' '))
            i += 1
        else:
            tokens.append(('punct', c1))
            i += 1
    return tokens


def iast_to_script(text, script='dn'):
    """Convert IAST text to Devanagari or Telugu."""
    cmap = DN_MAP if script == 'dn' else TE_MAP
    mmap = DN_MAATRA if script == 'dn' else TE_MAATRA
    virama = '्' if script == 'dn' else '్'
    cons_map = CONSONANTS_DN if script == 'dn' else CONSONANTS_TE

    tokens = _tokenize(text)
    out = []
    i = 0
    while i < len(tokens):
        typ, val = tokens[i]
        if typ == 'space':
            out.append(' ')
            i += 1
        elif typ == 'punct':
            out.append(val)
            i += 1
        elif typ == 'anusvara':
            out.append('ं' if script == 'dn' else 'ం')
            i += 1
        elif typ == 'visarga':
            out.append('ः' if script == 'dn' else 'ః')
            i += 1
        elif typ == 'avagraha':
            out.append('ऽ' if script == 'dn' else 'ఽ')
            i += 1
        elif typ == 'vowel':
            # Independent vowel (not preceded by consonant in this token position)
            vmap = DN_MAP if script == 'dn' else TE_MAP
            out.append(vmap.get(val, val))
            i += 1
        elif typ == 'consonant':
            # Gather consonant cluster, then look ahead for vowel
            cluster = [val]
            j = i + 1
            while j < len(tokens) and tokens[j][0] == 'consonant':
                cluster.append(tokens[j][1])
                j += 1

            # Check for following vowel
            following_vowel = None
            if j < len(tokens) and tokens[j][0] == 'vowel':
                following_vowel = tokens[j][1]
                j += 1

            # Build the cluster
            if len(cluster) == 1:
                c = cons_map.get(cluster[0], cluster[0])
                if following_vowel is None or following_vowel == '':
                    # Need virama (end of cluster / word)
                    out.append(c + virama)
                else:
                    maatra = mmap.get(following_vowel, '')
                    out.append(c + maatra)
            else:
                # Consonant cluster: all but last get virama, last gets vowel sign
                for idx, con in enumerate(cluster[:-1]):
                    out.append(cons_map.get(con, con))
                    out.append(virama)
                last_c = cons_map.get(cluster[-1], cluster[-1])
                if following_vowel is None:
                    out.append(last_c + virama)
                else:
                    maatra = mmap.get(following_vowel, '')
                    out.append(last_c + maatra)
            i = j
        else:
            out.append(val)
            i += 1

    return ''.join(out)


def parse_vsn_shlokas(path):
    """Parse vsn-shlokas.txt into list of {s, p1, p2, p3, p4} dicts."""
    shlokas = []
    current = None
    with open(path, encoding='utf-8') as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith('#') and not line.startswith('# '):
                continue
            if line.startswith('# ') and line[2:].strip().isdigit():
                if current:
                    shlokas.append(current)
                current = {'s': int(line[2:].strip()), 'p1':'','p2':'','p3':'','p4':''}
            elif line.startswith('p') and ':' in line and current:
                key, _, val = line.partition(':')
                key = key.strip()
                val = val.strip()
                if key in ('p1','p2','p3','p4'):
                    current[key] = val
    if current:
        shlokas.append(current)
    return shlokas


def build_vsn_shlokas(src_path, out_path):
    """Parse IAST source, transliterate to dn+te, write JSON."""
    import json
    shlokas_raw = parse_vsn_shlokas(src_path)
    shlokas = []
    for raw in shlokas_raw:
        entry = {'s': raw['s']}
        for pada in ('p1','p2','p3','p4'):
            iast = raw.get(pada, '')
            entry[pada] = {
                'ro': iast,
                'dn': iast_to_script(iast, 'dn'),
                'te': iast_to_script(iast, 'te'),
            }
        shlokas.append(entry)

    out = {
        'text': 'vsn',
        'total': len(shlokas),
        'shlokas': shlokas,
    }
    import pathlib
    pathlib.Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, separators=(',',':'))
    print(f'  wrote {out_path}  ({len(shlokas)} shlokas)')


# ── Devanagari → Telugu / IAST ────────────────────────────────────────────────
_VIRAMA_DN = '्'

_DEV_VOWELS_INDEP = {
    'अ':('a','అ'),  'आ':('ā','ఆ'),  'इ':('i','ఇ'),  'ई':('ī','ఈ'),
    'उ':('u','ఉ'),  'ऊ':('ū','ఊ'),  'ऋ':('ṛ','ఋ'),  'ॠ':('ṝ','ౠ'),
    'ऌ':('ḷ','ఌ'),  'ए':('e','ఏ'),  'ऐ':('ai','ఐ'), 'ओ':('o','ఓ'), 'औ':('au','ఔ'),
}
_DEV_MATRAS = {
    'ा':('ā','ా'),  'ि':('i','ి'),  'ी':('ī','ీ'),  'ु':('u','ు'),
    'ू':('ū','ూ'),  'ृ':('ṛ','ృ'),  'ॄ':('ṝ','ౄ'),  'ॢ':('ḷ','ౢ'),
    'े':('e','ే'),  'ै':('ai','ై'), 'ो':('o','ో'),  'ौ':('au','ౌ'),
}
_DEV_CONS = {
    'क':('k','క'),  'ख':('kh','ఖ'), 'ग':('g','గ'),  'घ':('gh','ఘ'), 'ङ':('ṅ','ఙ'),
    'च':('c','చ'),  'छ':('ch','ఛ'), 'ज':('j','జ'),  'झ':('jh','ఝ'), 'ञ':('ñ','ఞ'),
    'ट':('ṭ','ట'),  'ठ':('ṭh','ఠ'), 'ड':('ḍ','డ'),  'ढ':('ḍh','ఢ'), 'ण':('ṇ','ణ'),
    'त':('t','త'),  'थ':('th','థ'), 'द':('d','ద'),  'ध':('dh','ధ'), 'न':('n','న'),
    'प':('p','ప'),  'फ':('ph','ఫ'), 'ब':('b','బ'),  'भ':('bh','భ'), 'म':('m','మ'),
    'य':('y','య'),  'र':('r','ర'),  'ल':('l','ల'),  'व':('v','వ'),
    'श':('ś','శ'),  'ष':('ṣ','ష'), 'स':('s','స'),  'ह':('h','హ'),  'ळ':('ḷ','ళ'),
}
_DEV_MISC_TE  = {'ं':'ం','ः':'ః','ँ':'ఁ','ऽ':"'", 'ॐ':'ఓం',
                  '।':'।','॥':'॥',' ':' ','\n':'\n',
                  '०':'౦','१':'౧','२':'౨','३':'౩','४':'౪',
                  '५':'౫','६':'౬','७':'౭','८':'౮','९':'౯'}
_DEV_MISC_RO  = {'ं':'ṃ','ः':'ḥ','ँ':'m̐','ऽ':"'", 'ॐ':'oṃ',
                  '।':'.','॥':'..', ' ':' ','\n':'\n',
                  '०':'0','१':'1','२':'2','३':'3','४':'4',
                  '५':'5','६':'6','७':'7','८':'8','९':'9'}


def dev_to_te(text):
    """Devanagari → Telugu (isomorphic character map)."""
    out = []
    for c in text:
        if   c in _DEV_VOWELS_INDEP: out.append(_DEV_VOWELS_INDEP[c][1])
        elif c in _DEV_MATRAS:        out.append(_DEV_MATRAS[c][1])
        elif c in _DEV_CONS:          out.append(_DEV_CONS[c][1])
        elif c == _VIRAMA_DN:         out.append('్')
        elif c in _DEV_MISC_TE:       out.append(_DEV_MISC_TE[c])
        else:                         out.append(c)
    return ''.join(out)


def dev_to_iast(text):
    """Devanagari → IAST (context-aware: handles inherent 'a' vowel)."""
    out = []
    chars = list(text)
    i = 0
    while i < len(chars):
        c = chars[i]
        nxt = chars[i+1] if i+1 < len(chars) else ''
        if c == 'ॐ':
            out.append('oṃ')
        elif c in _DEV_VOWELS_INDEP:
            out.append(_DEV_VOWELS_INDEP[c][0])
        elif c in _DEV_CONS:
            out.append(_DEV_CONS[c][0])
            if nxt == _VIRAMA_DN:
                i += 1  # consume virama, no inherent vowel
            elif nxt in _DEV_MATRAS:
                out.append(_DEV_MATRAS[nxt][0])
                i += 1  # consume matra
            else:
                out.append('a')  # inherent 'a'
        elif c == _VIRAMA_DN:
            pass  # already consumed above
        elif c in _DEV_MATRAS:
            out.append(_DEV_MATRAS[c][0])
        elif c in _DEV_MISC_RO:
            out.append(_DEV_MISC_RO[c])
        else:
            out.append(c)
        i += 1
    return ''.join(out)


if __name__ == '__main__':
    import sys, pathlib
    root = pathlib.Path(__file__).parent.parent
    src = root / 'source' / 'texts' / 'vsn' / 'vsn-shlokas.txt'
    out = root / 'data' / 'vsn-shlokas.json'
    build_vsn_shlokas(str(src), str(out))
