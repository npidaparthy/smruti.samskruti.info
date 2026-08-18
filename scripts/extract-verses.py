#!/usr/bin/env python3
"""
extract-verses.py — dump verses from a chapter/stotram JSON file (Bhagavad
Gītā, Viṣṇu Sahasranāma, or Saundarya Laharī), in a choice of layouts
(--format), each combined with --nl the same way.

Formats:

  2line (default) — the classic two-line pada layout:
    p1.lang p2.lang ।
    p3.lang p4.lang ॥verse#॥

  4line — one pada per line:
    p1.lang
    p2.lang ।
    p3.lang
    p4.lang ॥verse#॥

  half — for files stored as half-shlokas (h1/h2) instead of quarter-padas
  (p1–p4) — e.g. data/vsn/vsn-daily-cards.json:
    h1.lang
    h2.lang ॥verse#॥

--nl <marker> collapses a verse's lines into a single output line, joining
them with <marker> instead of a newline (applies to all three formats —
for 4line, all of that verse's lines are joined by <marker>, not just two):

  p1.lang p2.lang ।<marker>p3.lang p4.lang ॥verse#॥

e.g. --nl NL with --format 2line produces:
  మయాధ్యక్షేణ ప్రకృతిః సూయతే సచరాచరమ్ ।NLహేతునానేన కౌన్తేయ జగద్విపరివర్తతే ॥10॥

Covers all three of this site's granthas — any file whose JSON has a
top-level (or nested, for BG chapter files) "shlokas" array works,
verse-numbered by either "s" (BG, VSN) or "v" (SL):

  Bhagavad Gītā      : data/bg/content/chapters/chNN.json  (per-chapter, p1-p4)
  Viṣṇu Sahasranāma  : data/vsn/content/vsn-shlokas.json   (108 shlokas, p1-p4)
  Viṣṇu Sahasranāma  : data/vsn/vsn-daily-cards.json       (108 shlokas, h1/h2 — use --format half)
  Saundarya Laharī   : data/sl/sl.json                     (all verses, p1-p4)

Usage:
  python3 scripts/extract-verses.py data/bg/content/chapters/ch01.json
  python3 scripts/extract-verses.py data/bg/content/chapters/ch01.json --lang ro
  python3 scripts/extract-verses.py data/bg/content/chapters/ch01.json --lang sa -o ch01.txt
  python3 scripts/extract-verses.py data/bg/content/chapters/ch01.json --nl NL
  python3 scripts/extract-verses.py data/bg/content/chapters/ch01.json --format 4line
  python3 scripts/extract-verses.py data/vsn/content/vsn-shlokas.json --lang te
  python3 scripts/extract-verses.py data/vsn/vsn-daily-cards.json --format half --lang sa
  python3 scripts/extract-verses.py data/sl/sl.json --lang sa
  python3 scripts/extract-verses.py data/bg/content/chapters/ch01.json --blank-line

  # Smoke-test all three granthas at once (2 verses each, no chapter_file needed):
  python3 scripts/extract-verses.py --test
"""

import json, argparse, sys
from pathlib import Path

FORMATS = ('2line', '4line', 'half')

# (label, path relative to repo root, format) — one file per grantha/shape
# this script is expected to handle. Used only by --test.
TEST_FILES = [
    ('Bhagavad Gītā (ch01)',        'data/bg/content/chapters/ch01.json', '2line'),
    ('Viṣṇu Sahasranāma (p1-p4)',   'data/vsn/content/vsn-shlokas.json',  '2line'),
    ('Viṣṇu Sahasranāma (h1/h2)',   'data/vsn/vsn-daily-cards.json',      'half'),
    ('Saundarya Laharī',            'data/sl/sl.json',                    '2line'),
]


def verse_parts(sh, lang, fmt):
    """Return this verse's output as a list of lines, per `fmt` — joined
    with '\\n' by default, or with --nl's marker if one was given."""
    def pada(key):
        return (sh.get(key) or {}).get(lang, '')
    # BG/VSN number verses with "s"; SL uses "v" — support both so one
    # script works across all granthas without a --key flag.
    vnum = sh.get('s', sh.get('v', '?'))

    if fmt == '2line':
        return [f"{pada('p1')} {pada('p2')} ।", f"{pada('p3')} {pada('p4')} ॥{vnum}॥"]
    if fmt == '4line':
        return [pada('p1'), f"{pada('p2')} ।", pada('p3'), f"{pada('p4')} ॥{vnum}॥"]
    if fmt == 'half':
        # half-shloka files store flat h1_<lang>/h2_<lang> keys, not
        # nested {lang: ...} objects like p1-p4 do.
        h1 = sh.get(f'h1_{lang}', '')
        h2 = sh.get(f'h2_{lang}', '')
        return [h1, f"{h2} ॥{vnum}॥"]
    raise ValueError(f"unknown format: {fmt}")


def render(data, lang, fmt='2line', nl=None, limit=None, blank_line=False):
    """Render data['shlokas'] (optionally truncated to `limit` verses)."""
    shlokas = data.get('shlokas', [])
    if limit:
        shlokas = shlokas[:limit]

    out_lines = []
    for i, sh in enumerate(shlokas):
        parts = verse_parts(sh, lang, fmt)
        if nl:
            out_lines.append(nl.join(parts))
        else:
            out_lines.extend(parts)
        if blank_line and i < len(shlokas) - 1:
            out_lines.append('')

    return '\n'.join(out_lines) + '\n'


def run_test(repo_root):
    """--test: run the extractor against one file per grantha/shape (2
    verses each) and print the params + output for each, so a change to
    this script (or to any data shape it reads) can be sanity-checked in
    one command instead of several by-hand invocations."""
    ok = True
    for label, rel_path, fmt in TEST_FILES:
        path = repo_root / rel_path
        print(f"\n{'=' * 60}")
        print(f"{label}  ({rel_path})")
        print(f"params: --format {fmt} --lang te --nl ' / ' (limit 2 for this smoke test only)")
        print('-' * 60)
        try:
            data = json.loads(path.read_text(encoding='utf-8'))
            out = render(data, lang='te', fmt=fmt, nl=' / ', limit=2)
            sys.stdout.write(out)
        except Exception as e:
            ok = False
            print(f"FAILED: {e}", file=sys.stderr)
    print(f"\n{'=' * 60}")
    print("all granthas OK" if ok else "one or more granthas FAILED — see above", file=sys.stderr)
    return 0 if ok else 1


def main():
    ap = argparse.ArgumentParser(
        description="Dump verses from a BG / VSN / Saundarya Laharī JSON file in a choice of pada layouts.",
        epilog=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    ap.add_argument('chapter_file', nargs='?', help='path to a chNN.json / vsn-shlokas.json / vsn-daily-cards.json / sl.json file (not needed with --test)')
    ap.add_argument('--format', choices=FORMATS, default='2line', help="pada layout: 2line (default, p1 p2|p3 p4), 4line (one pada per line), half (h1/h2 half-shloka files, e.g. vsn-daily-cards.json)")
    ap.add_argument('--lang', choices=['te', 'ro', 'sa'], default='te', help='script (default: te)')
    ap.add_argument('--nl', metavar='MARKER', help="collapse each verse's lines onto one output line, joined by this literal marker instead of a newline")
    ap.add_argument('-o', '--out', help='output file (default: stdout)')
    ap.add_argument('--blank-line', action='store_true', help='insert a blank line between verses')
    ap.add_argument('--test', action='store_true', help='smoke-test all granthas/shapes (BG/VSN p1-p4/VSN h1-h2/SL) at once, 2 verses each, no chapter_file needed')
    args = ap.parse_args()

    if args.test:
        sys.exit(run_test(Path(__file__).resolve().parent.parent))

    if not args.chapter_file:
        ap.error('chapter_file is required unless --test is given')

    data = json.loads(Path(args.chapter_file).read_text(encoding='utf-8'))
    text = render(data, args.lang, args.format, args.nl, blank_line=args.blank_line)

    if args.out:
        Path(args.out).write_text(text, encoding='utf-8')
        print(f"Wrote {len(data.get('shlokas', []))} verses to {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(text)


if __name__ == '__main__':
    main()
