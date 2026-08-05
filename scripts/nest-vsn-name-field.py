#!/usr/bin/env python3
"""
nest-vsn-name-field.py — ONE-TIME schema cleanup on vsn-1000-names.json:

  1. name (flat sa string) + name_te + name_ro  →  name: {sa, te, ro}
     (matching the already-nested dative/chant/meaning shapes). Verified
     first that fresh transliteration of `name` agrees with the stored
     name_te/name_ro for all 1010 entries — nothing is regenerated, just
     repackaged.
  2. ak  →  akshara  (avadhaanam.js's syllable-count badge reads
     `.akshara`, matching content/vsn-names.json's old field name — `ak`
     was silently never populating that badge for VSN names once
     avadhaanam.js/search.js are pointed at this file).

Usage:
  python3 scripts/nest-vsn-name-field.py
"""

import json, pathlib

ROOT = pathlib.Path(__file__).parent.parent
TARGET = ROOT / 'data' / 'vsn' / 'vsn-1000-names.json'


def main():
    data = json.loads(TARGET.read_text(encoding='utf-8'))
    names = data['names']

    for entry in names:
        sa = entry.pop('name')
        te = entry.pop('name_te', '')
        ro = entry.pop('name_ro', '')
        entry['name'] = {'sa': sa, 'te': te, 'ro': ro}

        if 'ak' in entry:
            entry['akshara'] = entry.pop('ak')

    data['names'] = names
    TARGET.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"Nested `name` and renamed ak→akshara for {len(names)} entries.")
    print(f"Wrote {TARGET}")


if __name__ == '__main__':
    main()
