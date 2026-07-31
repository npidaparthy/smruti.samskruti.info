#!/usr/bin/env python3
"""
merge-bg-quiz.py — combine hand-authored quiz questions with the auto-generated
fallback bank into the final file the frontend serves.

Sources (in priority order per verse):
  1. Hand-authored questions in data/quiz/bg/chNN/*.json — any number of
     questions per verse, richer variety (vocabulary, context, meaning, etc).
     Grouped by verse.c/verse.s read from each question object itself, so
     filenames don't matter and a verse can be spread across multiple files.
  2. data/quiz/bg-quiz-auto.json — the offline-generated fallback (one
     "match the meaning" question per verse), used only for verses that
     don't have any authored questions yet.

Run this after adding/editing files under data/quiz/bg/ to rebuild
data/quiz/bg-quiz.json (the file quiz.js actually fetches).

Usage:
  python3 scripts/merge-bg-quiz.py
"""

import json, glob
from pathlib import Path

ROOT = Path(__file__).parent.parent
AUTHORED_DIR = ROOT / 'data' / 'quiz' / 'bg'
AUTO_PATH = ROOT / 'data' / 'quiz' / 'bg-quiz-auto.json'
OUT_PATH = ROOT / 'data' / 'quiz' / 'bg-quiz.json'

REQUIRED_TOP = ('id', 'verse', 'q', 'choices', 'explanation')


def validate(q, source):
    problems = []
    for key in REQUIRED_TOP:
        if key not in q:
            problems.append(f"missing '{key}'")
    if problems:
        return problems
    v = q['verse']
    if 'c' not in v or 's' not in v:
        problems.append("verse missing c/s")
    if not q['q'].get('en') or not q['q'].get('te'):
        problems.append("q.en/te missing")
    if not q['explanation'].get('en') or not q['explanation'].get('te'):
        problems.append("explanation.en/te missing")
    choices = q.get('choices', [])
    if len(choices) != 4:
        problems.append(f"expected 4 choices, got {len(choices)}")
    correct = [c for c in choices if c.get('correct')]
    if len(correct) != 1:
        problems.append(f"expected exactly 1 correct choice, got {len(correct)}")
    for c in choices:
        if not c.get('en') or not c.get('te'):
            problems.append(f"choice {c.get('id', '?')} missing en/te")
    return problems


def load_authored():
    by_verse = {}
    seen_ids = {}
    for path in sorted(AUTHORED_DIR.glob('ch*/*.json')):
        rel = path.relative_to(ROOT)
        try:
            data = json.loads(path.read_text(encoding='utf-8'))
        except Exception as e:
            print(f"SKIP (invalid JSON): {rel} — {e}")
            continue
        if not isinstance(data, list):
            print(f"SKIP (not a list): {rel}")
            continue
        for q in data:
            problems = validate(q, rel)
            if problems:
                print(f"SKIP question {q.get('id', '?')} in {rel}: {'; '.join(problems)}")
                continue
            if q['id'] in seen_ids:
                print(f"WARNING duplicate id '{q['id']}' in {rel} (first seen in {seen_ids[q['id']]}) — keeping first")
                continue
            seen_ids[q['id']] = rel
            key = (q['verse']['c'], q['verse']['s'])
            by_verse.setdefault(key, []).append(q)
    return by_verse


def main():
    authored = load_authored()
    auto = json.loads(AUTO_PATH.read_text(encoding='utf-8'))

    merged = []
    authored_verse_count = 0
    fallback_verse_count = 0
    used_keys = set()

    for q in auto:
        key = (q['verse']['c'], q['verse']['s'])
        if key in authored:
            if key not in used_keys:
                merged.extend(authored[key])
                authored_verse_count += 1
                used_keys.add(key)
        else:
            merged.append(q)
            fallback_verse_count += 1

    # Authored verses not present in the auto bank at all (shouldn't happen
    # since auto covers all 701, but don't silently drop authored work).
    for key, qs in authored.items():
        if key not in used_keys:
            merged.extend(qs)
            authored_verse_count += 1

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding='utf-8')

    print()
    print(f"Authored verses: {authored_verse_count}  (questions: {sum(len(v) for v in authored.values())})")
    print(f"Fallback verses (auto, 1 question each): {fallback_verse_count}")
    print(f"Total questions written: {len(merged)}")
    print(f"-> {OUT_PATH}")


if __name__ == '__main__':
    main()
