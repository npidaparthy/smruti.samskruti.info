#!/usr/bin/env python3
"""
gen-bg-quiz.py — generate a Bhagavad Gita quiz question bank via Claude API.
Reads data/bg/content/chapters/chNN.json, writes data/quiz/bg-quiz.json.

Usage:
  python3 scripts/gen-bg-quiz.py --ch 2          # chapter 2 only
  python3 scripts/gen-bg-quiz.py --ch 2 4 18     # chapters 2, 4, 18
  python3 scripts/gen-bg-quiz.py --all           # all 18 chapters
  python3 scripts/gen-bg-quiz.py --all --resume  # skip verses already in output
"""

import json, time, argparse, sys
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("Install anthropic SDK:  pip install anthropic")
    sys.exit(1)

ROOT = Path(__file__).parent.parent
CHAPTERS_DIR = ROOT / 'data' / 'bg' / 'content' / 'chapters'
OUT_PATH = ROOT / 'data' / 'quiz' / 'bg-quiz.json'

client = anthropic.Anthropic()

PROMPT_TEMPLATE = """You are a Sanskrit scholar and teacher of the Bhagavad Gita, writing multiple-choice quiz questions for devotees studying the text.

Verse: Bhagavad Gita {c}.{s} ({yoga} yoga), spoken by {speaker}.

Sanskrit (Telugu script): {te_line}
Roman (IAST): {ro_line}

English meaning: {en_short}
Telugu meaning: {te_short}

Write ONE multiple-choice question testing understanding of this verse's meaning or teaching (not rote memorization of Sanskrit words). Provide 4 choices, exactly one correct, three plausible-but-wrong distractors drawn from related Gita concepts. Provide the question and explanation in both English and Telugu.

Return ONLY a JSON object, no markdown:
{{
  "concept": ["one-or-two-word-slug", "..."],
  "difficulty": 1,
  "q": {{"en": "...", "te": "..."}},
  "choices": [
    {{"id": "a", "en": "...", "te": "...", "correct": false}},
    {{"id": "b", "en": "...", "te": "...", "correct": false}},
    {{"id": "c", "en": "...", "te": "...", "correct": false}},
    {{"id": "d", "en": "...", "te": "...", "correct": false}}
  ],
  "explanation": {{"en": "...", "te": "..."}}
}}

Guidelines:
- difficulty: 1 (easy/well-known verse), 2 (moderate), or 3 (subtle/philosophical)
- concept: 1-3 short slugs like "karma", "atman", "detachment", "surrender"
- Exactly one choice must have "correct": true
- Shuffle which choice (a/b/c/d) is correct — don't always put it first"""


def load_chapter(ch):
    path = CHAPTERS_DIR / f'ch{ch:02d}.json'
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def format_prompt(sh, yoga):
    te_line = ' | '.join((sh.get(p, {}) or {}).get('te', '') for p in ('p1', 'p2', 'p3', 'p4'))
    ro_line = ' | '.join((sh.get(p, {}) or {}).get('ro', '') for p in ('p1', 'p2', 'p3', 'p4'))
    en = (sh.get('meaning', {}) or {}).get('en', {}) or {}
    te = (sh.get('meaning', {}) or {}).get('te', {}) or {}
    return PROMPT_TEMPLATE.format(
        c=sh['c'], s=sh['s'], yoga=yoga, speaker=sh.get('speaker', ''),
        te_line=te_line, ro_line=ro_line,
        en_short=en.get('short', ''), te_short=te.get('short', ''),
    )


def generate_question(sh, yoga):
    prompt = format_prompt(sh, yoga)
    for attempt in range(3):
        try:
            resp = client.messages.create(
                model="claude-haiku-4-5",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}],
            )
            text = next(b.text for b in resp.content if b.type == "text").strip()
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            return json.loads(text)
        except Exception as e:
            print(f"    retry {attempt + 1}/3: {e}")
            time.sleep(2)
    return None


def load_existing():
    if OUT_PATH.exists():
        with open(OUT_PATH, encoding='utf-8') as f:
            return json.load(f)
    return []


def save(questions):
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ch', nargs='+', type=int, help='Chapter number(s)')
    ap.add_argument('--all', action='store_true', help='All 18 chapters')
    ap.add_argument('--resume', action='store_true', help='Skip verses already in output')
    args = ap.parse_args()

    if not args.ch and not args.all:
        ap.error('specify --ch N [N ...] or --all')

    chapters = range(1, 19) if args.all else args.ch

    questions = load_existing() if args.resume else []
    existing_ids = {q['id'] for q in questions}

    for ch in chapters:
        data = load_chapter(ch)
        yoga = data.get('yoga', '')
        shlokas = data.get('shlokas', [])
        print(f"Chapter {ch} ({yoga}): {len(shlokas)} verses")

        for sh in shlokas:
            en = (sh.get('meaning', {}) or {}).get('en', {}) or {}
            if not en.get('short'):
                continue  # skip verses with no meaning yet

            qid = f"bg-{sh['c']}-{sh['s']}"
            if args.resume and qid in existing_ids:
                continue

            gen = generate_question(sh, yoga)
            if gen is None:
                print(f"  {sh['c']}.{sh['s']}: FAILED, skipping")
                continue

            record = {
                "id": qid,
                "verse": {"c": sh['c'], "s": sh['s']},
                "concept": gen.get('concept', []),
                "yoga": yoga,
                "difficulty": gen.get('difficulty', 2),
                "speaker": sh.get('speaker', ''),
                "q": gen.get('q', {}),
                "choices": gen.get('choices', []),
                "explanation": gen.get('explanation', {}),
            }
            questions.append(record)
            existing_ids.add(qid)
            print(f"  {sh['c']}.{sh['s']}: ok")
            save(questions)  # incremental save after every verse

    print(f"\nDone. {len(questions)} questions written to {OUT_PATH}")


if __name__ == '__main__':
    main()
