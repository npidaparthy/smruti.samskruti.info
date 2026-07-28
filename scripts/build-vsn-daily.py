#!/usr/bin/env python3
"""Build data/vsn/vsn-daily-cards.json — one record per shloka for daily card generation.

Each record has:
  s        : shloka number
  sh       : shloka number (alias for idField)
  h1_te/sa/ro : first 2-pada line (p1+p2 joined) per script
  h2_te/sa/ro : second 2-pada line (p3+p4 joined) per script
  names_te : formatted names text for Telugu card
  names_sa : formatted names text for Sanskrit card
  names_en : formatted names text for English card

Run from repo root:
  python3 scripts/build-vsn-daily.py
"""

import json, pathlib, sys

ROOT     = pathlib.Path(__file__).parent.parent
SHLOKAS  = ROOT / 'data' / 'vsn' / 'content' / 'vsn-shlokas.json'
NAMES    = ROOT / 'data' / 'vsn' / 'vsn-1000-names.json'
OUT      = ROOT / 'data' / 'vsn' / 'vsn-daily-cards.json'

shlokas = json.loads(SHLOKAS.read_text(encoding='utf-8'))['shlokas']
names_data = json.loads(NAMES.read_text(encoding='utf-8'))['names']

# Group names by shloka (sh field), only main 1000 (exclude sh=108 extras)
from collections import defaultdict
by_shloka = defaultdict(list)
for n in names_data:
    if n['sh'] <= 107:
        by_shloka[n['sh']].append(n)

def fmt_names(snames, name_field, meaning_field, pill_label):
    """Format name list: pill header + numbered rows."""
    total = len(snames)
    rows = [f"― {total} {pill_label} ―"]
    for vn, n in enumerate(snames, 1):
        name = n.get(name_field) or n.get('name', '')
        meaning = n.get(meaning_field, '')
        rows.append(f"{vn}. {name} — {meaning}" if meaning else f"{vn}. {name}")
    return '\n'.join(rows)

records = []
for sh in shlokas:
    s = sh['s']
    snames = by_shloka.get(s, [])
    total_in_verse = len(snames)

    def h1(script): return sh['p1'][script] + ' ' + sh['p2'][script]
    def h2(script): return sh['p3'][script] + ' ' + sh['p4'][script]

    records.append({
        's':       s,
        'sh':      s,
        'h1_te':   h1('te'),
        'h2_te':   h2('te'),
        'h1_sa':   h1('sa'),
        'h2_sa':   h2('sa'),
        'h1_ro':   h1('ro'),
        'h2_ro':   h2('ro'),
        'names_te': fmt_names(snames, 'name_te', 'te', 'నామాలు'),
        'names_sa': fmt_names(snames, 'name',    'sa', 'नामानि'),
        'names_en': fmt_names(snames, 'name_ro', 'en', 'names'),
        'name_count': total_in_verse,
    })

OUT.write_text(json.dumps({'shlokas': records}, ensure_ascii=False, indent=2), encoding='utf-8')
print(f"Written {len(records)} shloka records → {OUT.relative_to(ROOT)}")

# Quick sanity check
sample = records[0]
print(f"\nShloka 1 sample:")
print(f"  h1_te: {sample['h1_te']}")
print(f"  h2_te: {sample['h2_te']}")
print(f"  names ({sample['name_count']}):")
for line in sample['names_te'].split('\n'):
    print(f"    {line}")
