#!/usr/bin/env python3
"""
build.py — smriti.samskruti.info data builder
Merges source data → data/chapters/chNN.json + data/gita-index.json + data/texts/vsn/nakshatras.json

Usage:
  python3 scripts/build.py               # build everything
  python3 scripts/build.py --text gita   # build only Gita
  python3 scripts/build.py --text vsn    # build only VSN
  python3 scripts/build.py --ch 10       # build only chapter 10
"""

import json, re, sys, os, argparse
from pathlib import Path
from collections import defaultdict

ROOT   = Path(__file__).parent.parent
SRC    = ROOT / 'source'
DATA   = ROOT / 'data'

# ── helpers ──────────────────────────────────────────────────────────────────

def load_json(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)

def save_json(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))
    print(f'  wrote {path.relative_to(ROOT)}  ({path.stat().st_size // 1024} KB)')

def strip_cont(text):
    """Remove trailing dash that marks compound continuation."""
    return text.rstrip('-').rstrip()

def has_cont(text):
    return text.rstrip().endswith('-')

# ── parse chapter-titles.txt ─────────────────────────────────────────────────

def parse_chapter_titles():
    path = SRC / 'chapter-titles.txt'
    chapters = {}
    if not path.exists():
        print(f'  [warn] {path} not found — using empty chapter titles')
        return chapters

    current = None
    for raw in path.read_text(encoding='utf-8').splitlines():
        line = raw.strip()
        if not line or line.startswith('#'):
            continue

        # New chapter block: "chNN: ..."
        m = re.match(r'^(ch\d+):\s+(.*)', line)
        if m:
            key = m.group(1)
            num = int(key[2:])
            rest = m.group(2)
            current = num
            chapters[num] = {
                'chapter': num,
                'title': {},
                'yoga': '',
                'opening_speaker': '',
                'first_verse': '',
                'last_verse': '',
                'uvacha': {'dhritarashtra': 0, 'sanjaya': 0, 'arjuna': 0, 'krishna': 0},
                'audio': None
            }
            _apply_title_fields(chapters[num], rest)
            continue

        # Continuation line (indented)
        if current:
            _apply_title_fields(chapters[current], line)

    return chapters

def _apply_title_fields(ch, text):
    """Parse pipe-separated key=value pairs into chapter dict."""
    for part in text.split('|'):
        part = part.strip()
        if not part:
            continue
        if '=' in part:
            k, v = part.split('=', 1)
            k, v = k.strip(), v.strip()
            if k == 'en':
                ch['title']['en'] = v
            elif k == 'te':
                ch['title']['te'] = v
            elif k == 'sa':
                ch['title']['sa'] = v
            elif k == 'ro':
                ch['title']['ro'] = v
            elif k == 'yoga_en':
                ch['yoga'] = v
            elif k == 'opening_speaker':
                ch['opening_speaker'] = v
            elif k == 'first_verse':
                ch['first_verse'] = v
            elif k == 'last_verse':
                ch['last_verse'] = v
            elif k.startswith('uvacha_'):
                speaker = k[7:]
                try:
                    ch['uvacha'][speaker] = int(v)
                except ValueError:
                    pass

# ── parse audio.txt ──────────────────────────────────────────────────────────

def parse_audio():
    path = SRC / 'audio.txt'
    chapter_audio = {}
    shloka_ts = {}
    if not path.exists():
        return chapter_audio, shloka_ts

    for raw in path.read_text(encoding='utf-8').splitlines():
        line = raw.strip()
        if not line or line.startswith('#'):
            continue
        if ':' not in line:
            continue
        key, _, val = line.partition(':')
        key = key.strip()
        val = val.strip()
        # shloka timestamp: "ch10:1: 45"
        m = re.match(r'^ch(\d+)$', key)
        if m:
            # check if val starts with a URL or has another colon (shloka ts)
            chapter_audio[int(m.group(1))] = val
        else:
            m2 = re.match(r'^ch(\d+):(\d+)$', key)
            if m2:
                c, s = int(m2.group(1)), int(m2.group(2))
                try:
                    shloka_ts[(c, s)] = int(val)
                except ValueError:
                    pass
    return chapter_audio, shloka_ts

# ── parse meanings txt ───────────────────────────────────────────────────────

def parse_meanings(lang, chapter_num):
    """
    Parse source/meanings/<lang>/chNN.txt
    Returns dict: shloka_num -> {short, long, wbw:[{word,grammar,meaning}]}
    """
    path = SRC / 'meanings' / lang / f'ch{chapter_num:02d}.txt'
    if not path.exists():
        return {}

    results = {}
    current_s = None
    current_block = {}
    wbw_mode = False

    def flush():
        if current_s is not None and current_block:
            entry = {}
            if 'short' in current_block:
                entry['short'] = current_block['short']
            if 'long' in current_block:
                entry['long'] = current_block['long']
            if 'wbw' in current_block:
                entry['wbw'] = current_block['wbw']
            results[current_s] = entry

    for raw in path.read_text(encoding='utf-8').splitlines():
        line = raw.rstrip()

        # Separator between shlokas
        if line.strip() == '---':
            flush()
            current_s = None
            current_block = {}
            wbw_mode = False
            continue

        # Shloka header: "# C.S"
        m = re.match(r'^#\s*(\d+)\.(\d+)\s*$', line.strip())
        if m:
            flush()
            current_s = int(m.group(2))
            current_block = {}
            wbw_mode = False
            continue

        if current_s is None:
            continue

        stripped = line.strip()

        # wbw block start
        if stripped == 'wbw:':
            wbw_mode = True
            current_block['wbw'] = []
            continue

        if wbw_mode:
            # wbw line: "  word | grammar | meaning"
            if stripped and stripped.startswith('#'):
                continue
            if stripped:
                parts = [p.strip() for p in stripped.split('|')]
                if len(parts) >= 3:
                    current_block['wbw'].append({
                        'word': parts[0],
                        'grammar': parts[1],
                        'meaning': parts[2]
                    })
                elif len(parts) == 2:
                    current_block['wbw'].append({'word': parts[0], 'grammar': '', 'meaning': parts[1]})
            else:
                wbw_mode = False
            continue

        # short / long
        m_short = re.match(r'^short:\s*(.*)', stripped)
        if m_short:
            current_block['short'] = m_short.group(1)
            continue

        m_long = re.match(r'^long:\s*(.*)', stripped)
        if m_long:
            current_block['long'] = m_long.group(1)
            continue

        # Continuation of long (indented lines after long:)
        if 'long' in current_block and line.startswith('  '):
            current_block['long'] += ' ' + stripped
            continue

    flush()
    return results

# ── build speaker map ─────────────────────────────────────────────────────────

def build_speaker_map(shlokas_raw):
    """
    Infer speaker per shloka from the raw data.
    The existing JSON has no speaker field — we derive it from _m flags and
    known chapter-level patterns, then the chapter-titles.txt uvacha counts
    serve as validation.

    For MVP, we set speaker based on a manually curated map of
    (chapter, shloka) → speaker. This covers the uvāca verse positions.
    A future script can refine this from OCR of the reference image.
    """
    # Known uvāca positions (chapter, shloka_number) → speaker
    # Derived from reference table and standard Gita texts
    uvacha_map = {
        # Ch 1
        (1,1): 'dhritarashtra',
        (1,2): 'sanjaya',
        (1,21): 'arjuna',
        (1,28): 'arjuna',
        (1,46): 'sanjaya',
        # Ch 2
        (2,1): 'sanjaya',
        (2,4): 'arjuna',
        (2,9): 'sanjaya',
        (2,10): 'krishna',
        (2,54): 'arjuna',
        (2,55): 'krishna',
        (2,70): 'krishna',
        # Ch 3
        (3,1): 'arjuna',
        (3,3): 'krishna',
        (3,36): 'arjuna',
        (3,37): 'krishna',
        # Ch 4
        (4,1): 'krishna',
        (4,4): 'arjuna',
        (4,5): 'krishna',
        # Ch 5
        (5,1): 'arjuna',
        (5,2): 'krishna',
        # Ch 6
        (6,1): 'krishna',
        (6,33): 'arjuna',
        (6,35): 'krishna',
        (6,37): 'arjuna',
        (6,39): 'krishna',
        # Ch 7
        (7,1): 'krishna',
        # Ch 8
        (8,1): 'arjuna',
        (8,3): 'krishna',
        # Ch 9
        (9,1): 'krishna',
        # Ch 10
        (10,1): 'krishna',
        (10,12): 'arjuna',
        (10,19): 'krishna',
        # Ch 11
        (11,1): 'arjuna',
        (11,5): 'krishna',
        (11,9): 'sanjaya',
        (11,15): 'arjuna',
        (11,35): 'sanjaya',
        (11,36): 'arjuna',
        (11,47): 'krishna',
        (11,50): 'sanjaya',
        (11,51): 'arjuna',
        (11,52): 'krishna',
        # Ch 12
        (12,1): 'arjuna',
        (12,2): 'krishna',
        # Ch 13
        (13,1): 'krishna',
        # Ch 14
        (14,1): 'krishna',
        (14,21): 'arjuna',
        (14,22): 'krishna',
        # Ch 15
        (15,1): 'krishna',
        # Ch 16
        (16,1): 'krishna',
        # Ch 17
        (17,1): 'arjuna',
        (17,2): 'krishna',
        # Ch 18
        (18,1): 'arjuna',
        (18,2): 'krishna',
        (18,36): 'krishna',
        (18,73): 'arjuna',
        (18,74): 'sanjaya',
        (18,76): 'sanjaya',
        (18,78): 'sanjaya',
    }

    speaker_by_shloka = {}
    current_speaker = 'krishna'

    for sh in sorted(shlokas_raw, key=lambda x: (x['c'], x['s'])):
        key = (sh['c'], sh['s'])
        if key in uvacha_map:
            current_speaker = uvacha_map[key]
        speaker_by_shloka[key] = current_speaker

    return speaker_by_shloka

# ── build Gita chapters ───────────────────────────────────────────────────────

def build_gita(only_chapter=None):
    print('\n── Building Gita ──')

    src_json = SRC / 'gita-data-all-padas.json'
    if not src_json.exists():
        # Try karthikeya path
        alt = Path.home() / 'Projects/claude/karthikeya/assets/gita-data-all-padas.json'
        if alt.exists():
            import shutil
            shutil.copy(alt, src_json)
            print(f'  copied from {alt}')
        else:
            print(f'  ERROR: {src_json} not found. Copy gita-data-all-padas.json to source/')
            return

    raw = load_json(src_json)
    chapter_titles = parse_chapter_titles()
    chapter_audio, shloka_ts = parse_audio()
    speaker_map = build_speaker_map(raw)

    # Group shlokas by chapter
    by_chapter = defaultdict(list)
    for sh in raw:
        by_chapter[sh['c']].append(sh)

    index_entries = []

    chapters_to_build = [only_chapter] if only_chapter else range(1, 19)

    for ch_num in chapters_to_build:
        shlokas_raw = sorted(by_chapter.get(ch_num, []), key=lambda x: x['s'])
        if not shlokas_raw:
            print(f'  [warn] no shlokas for chapter {ch_num}')
            continue

        # Load meanings for all 3 langs
        meanings = {
            lang: parse_meanings(lang, ch_num)
            for lang in ['en', 'te', 'sa']
        }

        ch_meta = chapter_titles.get(ch_num, {
            'chapter': ch_num,
            'title': {'en': f'Chapter {ch_num}', 'te': f'అధ్యాయం {ch_num}', 'sa': ''},
            'yoga': '',
            'opening_speaker': '',
            'first_verse': '',
            'last_verse': '',
            'uvacha': {'dhritarashtra': 0, 'sanjaya': 0, 'arjuna': 0, 'krishna': 0},
            'audio': None
        })

        ch_out = {
            'chapter': ch_num,
            'title': ch_meta.get('title', {}),
            'yoga': ch_meta.get('yoga', ''),
            'opening_speaker': ch_meta.get('opening_speaker', ''),
            'first_verse': ch_meta.get('first_verse', ''),
            'last_verse': ch_meta.get('last_verse', ''),
            'uvacha': ch_meta.get('uvacha', {}),
            'audio': chapter_audio.get(ch_num),
            'shlokas': []
        }

        for sh in shlokas_raw:
            c, s = sh['c'], sh['s']

            def clean_pada(p_dict):
                """Remove kn, add cont flag if trailing dash."""
                out = {}
                for script in ['ro', 'te', 'dn']:
                    val = p_dict.get(script, '')
                    if val:
                        if has_cont(val):
                            out['cont'] = True
                        out[script] = strip_cont(val)
                return out

            shloka_out = {
                'c': c,
                's': s,
                'speaker': speaker_map.get((c, s), 'krishna'),
                'p1': clean_pada(sh.get('p1', {})),
                'p2': clean_pada(sh.get('p2', {})),
                'p3': clean_pada(sh.get('p3', {})),
                'p4': clean_pada(sh.get('p4', {})),
            }

            ts = shloka_ts.get((c, s))
            if ts:
                shloka_out['audio_ts'] = ts

            # Merge meanings
            m_out = {}
            for lang in ['en', 'te', 'sa']:
                entry = meanings[lang].get(s)
                if entry:
                    m_out[lang] = entry
            if m_out:
                shloka_out['meaning'] = m_out

            # similar_to placeholder (Phase 2)
            # shloka_out['similar_to'] = []

            ch_out['shlokas'].append(shloka_out)

        out_path = DATA / 'chapters' / f'ch{ch_num:02d}.json'
        save_json(out_path, ch_out)

        index_entries.append({
            'chapter': ch_num,
            'title': ch_meta.get('title', {}),
            'yoga': ch_meta.get('yoga', ''),
            'count': len(shlokas_raw),
            'audio': chapter_audio.get(ch_num),
            'uvacha': ch_meta.get('uvacha', {})
        })

    if not only_chapter:
        save_json(DATA / 'gita-index.json', {
            'text': 'gita',
            'total': 700,
            'chapters': index_entries
        })
        print('  wrote data/gita-index.json')

    print(f'  Gita build complete.')

# ── build VSN nakshatras ──────────────────────────────────────────────────────

def build_vsn_nakshatras():
    print('\n── Building VSN nakshatras ──')
    path = SRC / 'texts' / 'vsn' / 'nakshatras.txt'
    if not path.exists():
        print(f'  [warn] {path} not found')
        return

    nakshatras = []
    current = {}

    def flush():
        if current:
            nakshatras.append(dict(current))

    for raw in path.read_text(encoding='utf-8').splitlines():
        line = raw.strip()
        if not line or line.startswith('#') and not re.match(r'^#\s*\d+', line):
            continue

        # Nakshatra header: "# N"
        if re.match(r'^#\s*\d+\s*$', line):
            flush()
            current = {'num': int(line.lstrip('#').strip())}
            continue

        if line == '---':
            flush()
            current = {}
            continue

        # Key: value pairs (pipe-separated on same line)
        for part in line.split('|'):
            part = part.strip()
            if ':' not in part:
                continue
            k, _, v = part.partition(':')
            k, v = k.strip(), v.strip()
            current[k] = v

    flush()

    # Attach shloka range as numbers
    for n in nakshatras:
        rng = n.get('vsn_shlokas', '')
        if rng and '-' in rng:
            a, b = rng.split('-')
            n['vsn_from'] = int(a)
            n['vsn_to'] = int(b)

    out_path = DATA / 'texts' / 'vsn' / 'nakshatras.json'
    save_json(out_path, nakshatras)
    print(f'  built {len(nakshatras)} nakshatras')

# ── main ─────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description='smriti build script')
    ap.add_argument('--text', choices=['gita', 'vsn', 'all'], default='all')
    ap.add_argument('--ch', type=int, help='Build single chapter only (Gita)')
    args = ap.parse_args()

    DATA.mkdir(parents=True, exist_ok=True)
    (DATA / 'chapters').mkdir(exist_ok=True)
    (DATA / 'texts' / 'vsn').mkdir(parents=True, exist_ok=True)

    if args.text in ('gita', 'all'):
        build_gita(only_chapter=args.ch)

    if args.text in ('vsn', 'all') and not args.ch:
        build_vsn_nakshatras()
        # Build VSN shlokas from IAST source
        vsn_src = SRC / 'texts' / 'vsn' / 'vsn-shlokas.txt'
        if vsn_src.exists():
            print('\n── Building VSN shlokas ──')
            from transliterate import build_vsn_shlokas
            build_vsn_shlokas(str(vsn_src), str(DATA / 'vsn-shlokas.json'))

    print('\nDone.')

if __name__ == '__main__':
    main()
