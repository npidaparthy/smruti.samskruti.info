#!/usr/bin/env python3
"""
generate-meanings.py — generate meanings for Gita shlokas via Claude API
Writes source/meanings/{en,te,sa}/chNN.txt

Usage:
  python3 scripts/generate-meanings.py --ch 10         # chapter 10 only
  python3 scripts/generate-meanings.py --ch 10 15      # chapters 10 and 15
  python3 scripts/generate-meanings.py --all           # all 18 chapters (~$1.40)
  python3 scripts/generate-meanings.py --ch 10 --lang en  # English only
"""

import json, time, argparse, re, sys
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("Install anthropic SDK:  pip install anthropic")
    sys.exit(1)

ROOT   = Path(__file__).parent.parent
SRC    = ROOT / 'source'
DATA   = SRC / 'gita-data-all-padas.json'

client = anthropic.Anthropic()

PROMPT_TEMPLATE = """You are a Sanskrit scholar with deep knowledge of the Bhagavad Gita, Telugu language, and Vedantic philosophy.

Generate meanings for Bhagavad Gita Chapter {ch}, Shloka {s}.

Sanskrit (Devanāgarī):
p1: {p1_dn}
p2: {p2_dn}
p3: {p3_dn}
p4: {p4_dn}

Full shloka (IAST): {full_ro}

Return ONLY a JSON object with these keys (no markdown, no explanation):
{{
  "short_en": "One clear English sentence capturing the essence",
  "long_en": "3-5 sentence English commentary explaining the philosophical meaning and context",
  "short_te": "ఒక స్పష్టమైన తెలుగు వాక్యం (essence in Telugu)",
  "long_te": "3-5 వాక్యాల తెలుగు వ్యాఖ్యానం (commentary in Telugu)",
  "short_sa": "एकं संस्कृतवाक्यम् सारम् (one Sanskrit sentence)",
  "long_sa": "3-5 वाक्यानि संस्कृते व्याख्यानम् (Sanskrit prose commentary)",
  "wbw": [
    {{"word": "word-in-IAST", "grammar": "grammatical-form", "meaning": "meaning-in-English"}},
    ...one entry per distinct word or compound...
  ]
}}

Guidelines:
- short_* must be ONE sentence only
- long_* must be original prose, not copied from any copyrighted translation
- Sanskrit meanings should be in classical Sanskrit prose (not modern Hindi)
- wbw: list significant words; for compounds write the compound as one entry
- Ensure meanings are appropriate for devotees and students of the Gita"""


def load_shlokas():
    with open(DATA, encoding='utf-8') as f:
        return json.load(f)


def get_chapter_shlokas(shlokas, chapter):
    return sorted([s for s in shlokas if s['c'] == chapter], key=lambda x: x['s'])


def format_shloka_prompt(sh):
    def p(pada): return sh.get(pada, {}).get('dn', sh.get(pada, {}).get('ro', ''))
    def r(pada): return sh.get(pada, {}).get('ro', '')
    full_ro = ' | '.join([r('p1'), r('p2'), r('p3'), r('p4')])
    return PROMPT_TEMPLATE.format(
        ch=sh['c'], s=sh['s'],
        p1_dn=p('p1'), p2_dn=p('p2'), p3_dn=p('p3'), p4_dn=p('p4'),
        full_ro=full_ro
    )


def call_claude(prompt, retries=3):
    for attempt in range(retries):
        try:
            msg = client.messages.create(
                model='claude-haiku-4-5-20251001',
                max_tokens=1024,
                messages=[{'role': 'user', 'content': prompt}]
            )
            text = msg.content[0].text.strip()
            # Strip markdown code fences if present
            text = re.sub(r'^```(?:json)?\s*', '', text)
            text = re.sub(r'\s*```$', '', text)
            return json.loads(text)
        except json.JSONDecodeError as e:
            print(f'    [warn] JSON parse error (attempt {attempt+1}): {e}')
            if attempt == retries - 1:
                return None
            time.sleep(2)
        except Exception as e:
            print(f'    [error] API call failed (attempt {attempt+1}): {e}')
            if attempt == retries - 1:
                return None
            time.sleep(5)


def format_wbw(wbw_list):
    lines = []
    for entry in (wbw_list or []):
        w = entry.get('word', '')
        g = entry.get('grammar', '')
        m = entry.get('meaning', '')
        lines.append(f'  {w} | {g} | {m}')
    return '\n'.join(lines)


def write_meaning_files(ch, shloka_num, result):
    if not result:
        return

    for lang, short_key, long_key in [
        ('en', 'short_en', 'long_en'),
        ('te', 'short_te', 'long_te'),
        ('sa', 'short_sa', 'long_sa'),
    ]:
        out_dir = SRC / 'meanings' / lang
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / f'ch{ch:02d}.txt'

        short = result.get(short_key, '')
        long  = result.get(long_key, '')
        wbw   = result.get('wbw', []) if lang == 'en' else []

        block = f'# {ch}.{shloka_num}\n'
        block += f'short: {short}\n'
        block += f'long: {long}\n'
        if wbw:
            block += 'wbw:\n'
            block += format_wbw(wbw) + '\n'
        block += '---\n'

        # Append to file
        with open(out_file, 'a', encoding='utf-8') as f:
            f.write(block)


def already_generated(ch, shloka_num):
    """Check if English meaning file already has this shloka."""
    en_file = SRC / 'meanings' / 'en' / f'ch{ch:02d}.txt'
    if not en_file.exists():
        return False
    content = en_file.read_text(encoding='utf-8')
    return f'# {ch}.{shloka_num}\n' in content


def generate_chapter(chapter, all_shlokas, delay=0.5):
    shlokas = get_chapter_shlokas(all_shlokas, chapter)
    if not shlokas:
        print(f'  No shlokas found for chapter {chapter}')
        return

    # Clear existing files for this chapter before regenerating
    for lang in ['en', 'te', 'sa']:
        f = SRC / 'meanings' / lang / f'ch{chapter:02d}.txt'
        if f.exists():
            # Remove entries that will be regenerated
            pass  # We'll append; check already_generated to skip

    print(f'\nChapter {chapter} — {len(shlokas)} shlokas')
    ok = skip = fail = 0

    for sh in shlokas:
        s = sh['s']
        if already_generated(chapter, s):
            print(f'  {chapter}.{s} ✓ (cached)')
            skip += 1
            continue

        print(f'  {chapter}.{s} ...', end=' ', flush=True)
        prompt = format_shloka_prompt(sh)
        result = call_claude(prompt)

        if result:
            write_meaning_files(chapter, s, result)
            print('✓')
            ok += 1
        else:
            print('✗ FAILED')
            fail += 1

        time.sleep(delay)

    print(f'  Chapter {chapter}: {ok} generated, {skip} cached, {fail} failed')


def main():
    ap = argparse.ArgumentParser(description='Generate Gita meanings via Claude API')
    ap.add_argument('--ch',   nargs='+', type=int, help='Chapter number(s) to generate')
    ap.add_argument('--all',  action='store_true',  help='Generate all 18 chapters')
    ap.add_argument('--delay',type=float, default=0.5, help='Delay between API calls (seconds)')
    args = ap.parse_args()

    if not args.ch and not args.all:
        ap.print_help()
        sys.exit(1)

    all_shlokas = load_shlokas()
    chapters = list(range(1, 19)) if args.all else args.ch

    total_start = time.time()
    for ch in chapters:
        generate_chapter(ch, all_shlokas, delay=args.delay)

    elapsed = time.time() - total_start
    print(f'\nDone in {elapsed:.1f}s')
    print(f'Run  python3 scripts/build.py  to merge meanings into chapter JSON.')


if __name__ == '__main__':
    main()
