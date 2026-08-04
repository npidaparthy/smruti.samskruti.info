#!/usr/bin/env python3
"""
merge-vsn-names.py — ONE-TIME consolidation: pull the unique value out of
data/vsn/content/vsn-names.json (978 names, build-time intermediate) into
data/vsn/vsn-1000-names.json (1010 names, the canonical live file), so
vsn-1000-names.json becomes the single source of truth and
content/vsn-names.json can be archived.

What gets merged in, per name:
  - dative       {sa, te, ro}  — not present in vsn-1000-names.json at all
  - chant        {sa, te, ro}  — vsn-1000-names.json only has a Devanagari
                                  `mantra` string; this adds te/ro scripts
  - meaning._d   (en_d, te_d, sa_d) — detailed explanations, vsn-1000-names.json
                                       only has short one-liners

The existing flat `en`/`te`/`sa` short-meaning fields are converted into a
nested `meaning: {en, en_d, te, te_d, sa, sa_d}` block (matching the richer
shape content/vsn-names.json already used). Everything else — name,
name_te, name_ro, ak, anta, linga, mantra, n, sh — is left untouched.

Matching is by name text (content/'s 978 names split compounds differently
than vsn-1000-names.json's 1010, so indices don't align — see the fallback
chain below, same approach build-vsn-unified.py already uses for sa
meanings): exact match, then normalized (strip common Sanskrit case
endings), then first word of a compound name.

Usage:
  python3 scripts/merge-vsn-names.py            # writes vsn-1000-names.json in place
  python3 scripts/merge-vsn-names.py --dry-run   # report match stats only, no write
"""

import json, sys, pathlib

ROOT = pathlib.Path(__file__).parent.parent
IN_1000 = ROOT / 'data' / 'vsn' / 'vsn-1000-names.json'
IN_978  = ROOT / 'data' / 'vsn' / 'content' / 'vsn-names.json'
OUT     = IN_1000

SUFFIXES = ['म्', 'ः', 'त्', 'द्', 'ं', 'न्', 'क्', 'ण्', 'ष्', 'श्', 'ग्']


def norm(s):
    s = s.strip()
    for suf in SUFFIXES:
        if s.endswith(suf):
            s = s[:-len(suf)]
    return s.lower()


def build_lookup(names_978):
    """name-text (and normalized, and per-word) -> full 978-entry."""
    lookup = {}

    def add(key, entry):
        if key and key not in lookup:
            lookup[key] = entry

    for entry in names_978:
        sa_name = (entry.get('name') or {}).get('sa', '').strip()
        if not sa_name:
            continue
        add(sa_name, entry)
        add(norm(sa_name), entry)
        for word in sa_name.split():
            add(word, entry)
            add(norm(word), entry)
    return lookup


def find_match(name, lookup):
    if name in lookup:
        return lookup[name]
    if norm(name) in lookup:
        return lookup[norm(name)]
    first = name.split()[0] if name.split() else name
    if first in lookup:
        return lookup[first]
    if norm(first) in lookup:
        return lookup[norm(first)]
    return None


def main():
    dry_run = '--dry-run' in sys.argv

    base = json.loads(IN_1000.read_text(encoding='utf-8'))
    names_1000 = base['names']
    names_978 = json.loads(IN_978.read_text(encoding='utf-8'))['names']

    lookup = build_lookup(names_978)

    matched = 0
    unmatched = []

    for entry in names_1000:
        name = (entry.get('name') or '').strip()
        donor = find_match(name, lookup)

        short_en = entry.get('en', '').strip()
        short_te = entry.get('te', '').strip()
        short_sa = entry.get('sa', '').strip()

        meaning = {'en': short_en, 'en_d': '', 'te': short_te, 'te_d': '', 'sa': short_sa, 'sa_d': ''}

        if donor:
            matched += 1
            d_meaning = donor.get('meaning') or {}
            meaning['en_d'] = d_meaning.get('en_d', '').strip()
            meaning['te_d'] = d_meaning.get('te_d', '').strip()
            meaning['sa_d'] = d_meaning.get('sa_d', '').strip()
            # Prefer content/'s sa short meaning if we didn't already have one
            if not meaning['sa'] and d_meaning.get('sa'):
                meaning['sa'] = d_meaning['sa'].strip()

            if donor.get('dative'):
                entry['dative'] = donor['dative']
            if donor.get('chant'):
                entry['chant'] = donor['chant']
        else:
            unmatched.append(name)

        # Replace flat en/te/sa with nested meaning
        entry['meaning'] = meaning
        entry.pop('en', None)
        entry.pop('te', None)
        entry.pop('sa', None)

    print(f"Matched (dative/chant/detail pulled in): {matched}/{len(names_1000)}")
    print(f"Unmatched (short meanings only, no detail/dative/chant): {len(unmatched)}")
    if unmatched:
        print("First 15 unmatched names:")
        for n in unmatched[:15]:
            print(f"  {n}")

    if dry_run:
        print("\n--dry-run: not writing.")
        return

    base['names'] = names_1000
    OUT.write_text(json.dumps(base, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"\nWrote {OUT}")


if __name__ == '__main__':
    main()
