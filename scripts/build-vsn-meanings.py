#!/usr/bin/env python3
"""
build-vsn-meanings.py — merge source/meanings/vsn/names.json into data/vsn-names.json.

Usage: python3 scripts/build-vsn-meanings.py
"""

import json
from pathlib import Path

ROOT      = Path(__file__).parent.parent
NAMES_IN  = ROOT / 'data' / 'vsn-names.json'
MEANINGS  = ROOT / 'source' / 'meanings' / 'vsn' / 'names.json'
NAMES_OUT = ROOT / 'data' / 'vsn-names.json'

def main():
    data     = json.loads(NAMES_IN.read_text(encoding='utf-8'))
    meanings = json.loads(MEANINGS.read_text(encoding='utf-8'))

    # Support lookup by IAST name (preferred) or by position number (legacy)
    by_iast = meanings.get('_by_iast', {})
    by_pos  = {k: v for k, v in meanings.items() if k != '_by_iast'}

    hit = miss = 0
    for entry in data['names']:
        ro = entry['name'].get('ro', '')
        m = by_iast.get(ro) or by_pos.get(str(entry['n']))
        if m:
            entry['meaning'] = m
            hit += 1
        else:
            miss += 1

    NAMES_OUT.write_text(
        json.dumps(data, ensure_ascii=False, separators=(',', ':')),
        encoding='utf-8'
    )
    print(f'Merged: {hit} with meanings, {miss} without.')
    print(f'Wrote {NAMES_OUT}')

if __name__ == '__main__':
    main()
