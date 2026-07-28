#!/usr/bin/env python3
"""Build data/vsn/vsn-1000-names.json — unified 1000+8 name list with te/en/sa meanings.

Steps:
  1. Load vsn-1000-names.json (base: 1000 names, te+en meanings)
  2. Map sa meanings from vsn-names.json (978 names) by name-text matching
  3. Generate sa meanings for unmatched names via Claude API
  4. Add 10 names from shloka 108 (n=1001-1010)
  5. Write updated vsn-1000-names.json

Run from repo root:
  python3 scripts/build-vsn-unified.py

Requires ANTHROPIC_API_KEY env var for sa meaning generation.
"""

import json, re, sys, os, pathlib, time

ROOT = pathlib.Path(__file__).parent.parent
IN_1000  = ROOT / 'data' / 'vsn' / 'vsn-1000-names.json'
IN_978   = ROOT / 'data' / 'vsn' / 'content' / 'vsn-names.json'
OUT      = ROOT / 'data' / 'vsn' / 'vsn-1000-names.json'

sys.path.insert(0, str(ROOT / 'scripts'))
from transliterate import dev_to_te, dev_to_iast

# ── Shloka 108 names (user-confirmed; duplicates flagged for later review) ────
SHLOKA_108 = [
    {'name': 'वनमाली',   'ro': 'vanamālī'},
    {'name': 'गदी',      'ro': 'gadī'},
    {'name': 'शार्ङ्गी', 'ro': 'śārṅgī'},
    {'name': 'शङ्खी',   'ro': 'śaṅkhī'},
    {'name': 'चक्री',   'ro': 'cakrī'},
    {'name': 'नन्दकी',  'ro': 'nandakī'},
    {'name': 'श्रीमान्','ro': 'śrīmān'},
    {'name': 'नारायणः', 'ro': 'nārāyaṇaḥ'},
    {'name': 'विष्णुः', 'ro': 'viṣṇuḥ'},
    {'name': 'वासुदेवः','ro': 'vāsudevaḥ'},
]

# ── Name-text normalisation for matching ─────────────────────────────────────
def norm(s):
    """Strip common Sanskrit endings for fuzzy matching."""
    s = s.strip()
    for suf in ['म्','ः','त्','द्','ं','न्','क्','ण्','ष्','श्','ग्']:
        if s.endswith(suf):
            s = s[:-len(suf)]
    return s.lower()

# ── Load source files ─────────────────────────────────────────────────────────
print("Loading vsn-1000-names.json …")
base_data = json.loads(IN_1000.read_text(encoding='utf-8'))
names_1000 = base_data['names']

print("Loading vsn-names.json (978) …")
names_978 = json.loads(IN_978.read_text(encoding='utf-8'))['names']

# ── Build sa-meaning lookup from 978-names ────────────────────────────────────
sa_lookup = {}
for n in names_978:
    sa_name = n['name'].get('sa', '').strip()
    meaning = n.get('meaning', {})
    if not meaning.get('sa', '').strip():
        continue
    sa_lookup[sa_name] = meaning['sa'].strip()
    sa_lookup[norm(sa_name)] = meaning['sa'].strip()
    # also index individual words of compound entries
    for word in sa_name.split():
        sa_lookup[word] = meaning['sa'].strip()
        sa_lookup[norm(word)] = meaning['sa'].strip()

# ── Map sa meanings onto 1000-names ──────────────────────────────────────────
matched = 0
unmatched = []

for entry in names_1000:
    if entry.get('sa', '').strip():
        matched += 1
        continue
    name = entry['name'].strip()
    sa_m = sa_lookup.get(name) or sa_lookup.get(norm(name))
    if not sa_m:
        # try first word of compound names
        first = name.split()[0]
        sa_m = sa_lookup.get(first) or sa_lookup.get(norm(first))
    if sa_m:
        entry['sa'] = sa_m
        matched += 1
    else:
        unmatched.append(entry)

print(f"Mapped sa meanings: {matched}/{len(names_1000)}")
print(f"Need AI generation: {len(unmatched)}")

# ── Generate sa meanings via Claude API ───────────────────────────────────────
if unmatched:
    api_key = os.environ.get('ANTHROPIC_API_KEY', '')
    if not api_key:
        print("\nWARNING: ANTHROPIC_API_KEY not set — skipping sa generation.")
        print("Set the key and re-run to fill remaining sa meanings.")
    else:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=api_key)
        except ImportError:
            print("ERROR: anthropic package not installed. Run: pip install anthropic")
            sys.exit(1)

        print(f"\nGenerating sa meanings for {len(unmatched)} names …")
        BATCH = 20

        for i in range(0, len(unmatched), BATCH):
            batch = unmatched[i:i+BATCH]
            names_block = '\n'.join(
                f'{j+1}. {e["name"]} | en: {e.get("en","")} | te: {e.get("te","")}'
                for j, e in enumerate(batch)
            )
            prompt = f"""You are a Sanskrit scholar generating concise Sanskrit definitions for names of Vishnu from Vishnu Sahasranama.

For each name below, give a SHORT Sanskrit definition (1–5 words, noun compound or bahuvrīhi style, nominative singular).
Match the style of these examples: जगदात्मकः, व्यापनशीलः, यज्ञरूपः, त्रिकालनियन्ता, सत्तास्वरूपः

Names:
{names_block}

Reply with ONLY a numbered list matching the input order. One line per name. Format:
1. <Sanskrit definition>
2. <Sanskrit definition>
…"""

            msg = client.messages.create(
                model='claude-sonnet-5',
                max_tokens=1024,
                messages=[{'role': 'user', 'content': prompt}]
            )
            lines = [l.strip() for l in msg.content[0].text.strip().split('\n') if l.strip()]
            for j, entry in enumerate(batch):
                if j < len(lines):
                    sa_val = re.sub(r'^\d+\.\s*', '', lines[j]).strip()
                    entry['sa'] = sa_val

            print(f"  Generated {min(i+BATCH, len(unmatched))}/{len(unmatched)}")
            if i + BATCH < len(unmatched):
                time.sleep(0.5)

# ── Add transliterated te/ro name fields ──────────────────────────────────────
print("\nAdding te/ro name transliterations …")
for entry in names_1000:
    sa_name = entry['name']
    entry['name_te'] = dev_to_te(sa_name)
    entry['name_ro'] = dev_to_iast(sa_name)

# ── Append shloka 108 names ───────────────────────────────────────────────────
print("Appending shloka 108 names (n=1001–1010) …")
existing_sa = {e['name'] for e in names_1000}
for i, sh108 in enumerate(SHLOKA_108):
    n_val = 1001 + i
    duplicate = sh108['name'] in existing_sa
    entry = {
        'n':       n_val,
        'sh':      108,
        'name':    sh108['name'],
        'name_te': dev_to_te(sh108['name']),
        'name_ro': sh108['ro'],
        'en':      '',
        'te':      '',
        'sa':      '',
        'duplicate_of': next(
            (e['n'] for e in names_1000 if e['name'] == sh108['name']), None
        ) if duplicate else None,
    }
    names_1000.append(entry)
    flag = ' [DUPLICATE]' if duplicate else ''
    print(f"  n={n_val} {sh108['name']}{flag}")

# ── Write output ──────────────────────────────────────────────────────────────
base_data['names'] = names_1000
base_data['total'] = len(names_1000)
OUT.write_text(json.dumps(base_data, ensure_ascii=False, indent=2), encoding='utf-8')
print(f"\nDone. Written {len(names_1000)} names → {OUT.relative_to(ROOT)}")

# Summary
no_sa = [e for e in names_1000 if not e.get('sa','').strip()]
no_te_meaning = [e for e in names_1000 if not e.get('te','').strip()]
print(f"  Missing sa meaning: {len(no_sa)}")
print(f"  Missing te meaning: {len(no_te_meaning)}")
