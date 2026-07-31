#!/usr/bin/env python3
"""
build-bg-quiz-offline.py — build the full BG quiz question bank WITHOUT calling
any LLM API. Uses the meaning.short text already present in each chapter's
JSON: the verse's own short meaning is the correct answer; three other verses'
short meanings (from different chapters where possible) are distractors.

Every one of the 701 verses gets exactly one question. The verse itself
(IAST for the English question, Telugu script for the Telugu question) is
shown as the prompt; the {c}.{s} reference only appears in the explanation,
so the question doesn't give away the answer.

Usage:
  python3 scripts/build-bg-quiz-offline.py
"""

import json, random
from pathlib import Path

ROOT = Path(__file__).parent.parent
CHAPTERS_DIR = ROOT / 'data' / 'bg' / 'content' / 'chapters'
OUT_PATH = ROOT / 'data' / 'quiz' / 'bg-quiz-auto.json'

random.seed(42)  # reproducible shuffles across runs

# Well-known verses get difficulty 1; everything else defaults to 2.
WELL_KNOWN = {
    (2, 47), (2, 20), (2, 62), (2, 63), (2, 14), (2, 22), (2, 70),
    (3, 21), (4, 7), (4, 8), (4, 11), (6, 5), (6, 6), (7, 19),
    (9, 22), (9, 26), (9, 34), (10, 41), (11, 32), (12, 13), (12, 14),
    (15, 7), (18, 66), (18, 78),
}


def load_all_verses():
    verses = []
    for ch in range(1, 19):
        path = CHAPTERS_DIR / f'ch{ch:02d}.json'
        data = json.load(open(path, encoding='utf-8'))
        yoga = data.get('yoga', '')
        for sh in data.get('shlokas', []):
            en = (sh.get('meaning') or {}).get('en') or {}
            te = (sh.get('meaning') or {}).get('te') or {}
            if not en.get('short') or not te.get('short'):
                continue
            verses.append({
                'c': sh['c'], 's': sh['s'], 'speaker': sh.get('speaker', ''),
                'yoga': yoga,
                'ro': ' | '.join((sh.get(p, {}) or {}).get('ro', '') for p in ('p1', 'p2', 'p3', 'p4')),
                'te': ' | '.join((sh.get(p, {}) or {}).get('te', '') for p in ('p1', 'p2', 'p3', 'p4')),
                'short_en': en['short'].strip(),
                'short_te': te['short'].strip(),
                'long_en': en.get('long', '').strip(),
                'long_te': te.get('long', '').strip(),
            })
    return verses


def pick_distractors(all_verses, idx, n=3):
    """Pick n other verses as distractors, preferring the SAME chapter (same
    yoga/theme) so the wrong choices are topically close to the correct one
    — a distractor from an unrelated chapter is too easy to spot by content
    alone, which defeats the point of testing verse-level understanding."""
    me = all_verses[idx]
    same_chapter = [v for j, v in enumerate(all_verses) if j != idx and v['c'] == me['c']]
    if len(same_chapter) >= n:
        return random.sample(same_chapter, n)
    # Chapter too short (e.g. ch1 narration-only stretches) — top up from
    # everywhere else rather than reusing same-chapter verses twice.
    rest = [v for j, v in enumerate(all_verses) if j != idx and v['c'] != me['c']]
    return same_chapter + random.sample(rest, n - len(same_chapter))


def build_choices(verse, distractors):
    ids = ['a', 'b', 'c', 'd']
    entries = [{'en': verse['short_en'], 'te': verse['short_te'], 'correct': True}]
    for d in distractors:
        entries.append({'en': d['short_en'], 'te': d['short_te'], 'correct': False})
    random.shuffle(entries)
    for i, e in enumerate(entries):
        e['id'] = ids[i]
    return entries


def build_question(verse):
    return {
        'en': f"Which of these best describes the meaning of this verse?\n\n“{verse['ro']}”",
        'te': f"ఈ శ్లోకానికి సరైన అర్థం ఏది?\n\n“{verse['te']}”",
    }


def build_explanation(verse):
    ref = f"({verse['c']}.{verse['s']})"
    en = verse['long_en'] or verse['short_en']
    te = verse['long_te'] or verse['short_te']
    return {
        'en': f"{en} — Bhagavad Gita {ref}",
        'te': f"{te} — భగవద్గీత {ref}",
    }


def main():
    verses = load_all_verses()
    print(f"Loaded {len(verses)} verses with meanings")

    questions = []
    for i, v in enumerate(verses):
        distractors = pick_distractors(verses, i)
        choices = build_choices(v, distractors)
        questions.append({
            'id': f"bg-{v['c']}-{v['s']}",
            'verse': {'c': v['c'], 's': v['s']},
            'concept': [v['yoga']] if v['yoga'] else [],
            'yoga': v['yoga'],
            'difficulty': 1 if (v['c'], v['s']) in WELL_KNOWN else 2,
            'speaker': v['speaker'],
            'q': build_question(v),
            'choices': choices,
            'explanation': build_explanation(v),
        })

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(questions)} questions to {OUT_PATH}")


if __name__ == '__main__':
    main()
