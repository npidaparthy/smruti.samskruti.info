#!/usr/bin/env python3
"""
generate-vsn-name-meanings.py — generate short meanings for all 1008 VSN names.

Batches 20 names per API call. Saves to source/meanings/vsn/names.json.
Run build-vsn-meanings.py after to merge into vsn-names.json.

Usage:
  python3 scripts/generate-vsn-name-meanings.py            # all 1008 names
  python3 scripts/generate-vsn-name-meanings.py --from 1 --to 100
  python3 scripts/generate-vsn-name-meanings.py --batch 101  # single batch by start n
"""

import json, time, argparse, re, sys
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("pip install anthropic"); sys.exit(1)

ROOT     = Path(__file__).parent.parent
NAMES_IN = ROOT / 'data' / 'vsn-names.json'
OUT_DIR  = ROOT / 'source' / 'meanings' / 'vsn'
OUT_FILE = OUT_DIR / 'names.json'

BATCH_SIZE = 20

client = anthropic.Anthropic()

PROMPT = """\
You are a Sanskrit scholar specialising in Vaiṣṇava theology and the Viṣṇu Sahasranāma.

Give short one-line meanings for each of the following Viṣṇu names (given in IAST).
Return ONLY a JSON object keyed by the name number (n), no markdown, no explanation.

Names:
{names_block}

Return format:
{{
  "1": {{"te": "తెలుగులో ఒక వాక్యం", "en": "one English sentence"}},
  "2": {{"te": "...", "en": "..."}},
  ...
}}

Guidelines:
- Each meaning must be ONE sentence only
- Telugu: natural modern Telugu, devout tone
- English: clear, scholarly, one sentence
- Focus on the theological/etymological meaning of the name itself
- Do not start every Telugu sentence with the same word"""


def load_names():
    data = json.loads(NAMES_IN.read_text(encoding='utf-8'))
    return data['names']


def load_existing():
    if OUT_FILE.exists():
        return json.loads(OUT_FILE.read_text(encoding='utf-8'))
    return {}


def save(existing):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding='utf-8')


def call_claude(batch, retries=3):
    names_block = '\n'.join(
        f'  n={n["n"]}: {n["name"]["ro"]} ({n["name"]["sa"]})'
        for n in batch
    )
    prompt = PROMPT.format(names_block=names_block)

    for attempt in range(retries):
        try:
            msg = client.messages.create(
                model='claude-haiku-4-5-20251001',
                max_tokens=2048,
                messages=[{'role': 'user', 'content': prompt}]
            )
            text = msg.content[0].text.strip()
            text = re.sub(r'^```(?:json)?\s*', '', text)
            text = re.sub(r'\s*```$', '', text)
            return json.loads(text)
        except json.JSONDecodeError as e:
            print(f'    [warn] JSON error (attempt {attempt+1}): {e}')
            if attempt == retries - 1: return None
            time.sleep(2)
        except Exception as e:
            print(f'    [error] API error (attempt {attempt+1}): {e}')
            if attempt == retries - 1: return None
            time.sleep(5)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--from', dest='from_n', type=int, default=1)
    ap.add_argument('--to',   dest='to_n',   type=int, default=1008)
    ap.add_argument('--delay',type=float, default=0.3)
    args = ap.parse_args()

    names    = [n for n in load_names() if args.from_n <= n['n'] <= args.to_n]
    existing = load_existing()

    # Filter already done
    todo = [n for n in names if str(n['n']) not in existing]
    print(f'Names {args.from_n}–{args.to_n}: {len(names)} total, {len(todo)} to generate, {len(names)-len(todo)} cached')

    batches = [todo[i:i+BATCH_SIZE] for i in range(0, len(todo), BATCH_SIZE)]
    ok = fail = 0

    for i, batch in enumerate(batches):
        ns = f"{batch[0]['n']}–{batch[-1]['n']}"
        print(f'  Batch {i+1}/{len(batches)} (names {ns}) ...', end=' ', flush=True)
        result = call_claude(batch)
        if result:
            existing.update({str(k): v for k, v in result.items()})
            save(existing)
            print(f'✓ ({len(result)} meanings)')
            ok += len(result)
        else:
            print('✗ FAILED')
            fail += len(batch)
        time.sleep(args.delay)

    print(f'\nDone. {ok} generated, {fail} failed. Total in file: {len(existing)}')
    print('Run  python3 scripts/build-vsn-meanings.py  to merge into vsn-names.json')


if __name__ == '__main__':
    main()
