#!/usr/bin/env python3
"""
fix-vsn-dative-from-mantra.py — ONE-TIME correction: scripts/merge-vsn-names.py
pulled `dative`/`chant` from content/vsn-names.json, which was computed by
build-vsn.py's dative_form() heuristic — a simple rule-based function that
can't distinguish Sanskrit stem classes it was never designed for (tṛ-stem
agent nouns like bhartā/dhātā, in-stem cerebral-nasal names like sākṣī,
as-stem compounds like vasumanāḥ/viśvaretāḥ, root-final sandhi like vīrahā).

vsn-1000-names.json's own `mantra` field (present on 1000 of 1010 entries,
predating the merge) already has grammatically correct dative forms for
these cases. The merge overwrote/added `dative`/`chant` without checking
them against `mantra` first, silently regressing 165 entries.

This script re-derives `dative` and `chant` (sa/te/ro) FROM `mantra` for
every entry that has one, and leaves the merged (content/vsn-names.json
sourced) values alone only for the 10 shloka-108 entries that have no
mantra at all.

Usage:
  python3 scripts/fix-vsn-dative-from-mantra.py            # apply fix
  python3 scripts/fix-vsn-dative-from-mantra.py --dry-run  # report only
"""

import json, re, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from transliterate import dev_to_te, dev_to_iast

ROOT = pathlib.Path(__file__).parent.parent
TARGET = ROOT / 'data' / 'vsn' / 'vsn-1000-names.json'

MANTRA_RE = re.compile(r'^ॐ\s+(.+?)\s+नमः\s*।?\s*$')  # dative may be multi-word (compound names)


def to_scripts(text):
    return {'sa': text, 'te': dev_to_te(text), 'ro': dev_to_iast(text)}


def main():
    dry_run = '--dry-run' in sys.argv

    data = json.loads(TARGET.read_text(encoding='utf-8'))
    names = data['names']

    fixed = 0
    no_mantra = 0
    unparsed = 0

    for entry in names:
        mantra = entry.get('mantra', '').strip()
        if not mantra:
            no_mantra += 1
            continue
        m = MANTRA_RE.match(mantra)
        if not m:
            unparsed += 1
            print(f"  WARN: could not parse mantra for n={entry['n']} name={entry['name']}: \"{mantra}\"")
            continue
        dative_sa = m.group(1)
        chant_sa = f'ॐ {dative_sa} नमः ।'

        old_dative = (entry.get('dative') or {}).get('sa', '')
        if old_dative != dative_sa:
            fixed += 1

        entry['dative'] = to_scripts(dative_sa)
        entry['chant'] = to_scripts(chant_sa)

    print(f"Entries corrected (dative/chant now match mantra): {fixed}")
    print(f"Entries with no mantra (left as merged from content/vsn-names.json): {no_mantra}")
    print(f"Entries with unparseable mantra: {unparsed}")

    if dry_run:
        print("\n--dry-run: not writing.")
        return

    data['names'] = names
    TARGET.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"\nWrote {TARGET}")


if __name__ == '__main__':
    main()
