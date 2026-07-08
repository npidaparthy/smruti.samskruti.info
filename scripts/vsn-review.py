#!/usr/bin/env python3
"""Generate scripts/vsn-review.html — VSN verse+names review page."""

import json, pathlib, collections

ROOT   = pathlib.Path(__file__).parent.parent
NAMES  = json.loads((ROOT / 'data/vsn/content/vsn-names.json').read_text())['names']
SHLOKAS = json.loads((ROOT / 'data/vsn/content/vsn-shlokas.json').read_text())['shlokas']
OUT    = ROOT / 'scripts' / 'vsn-review.html'

# Group names by shloka
by_sh = collections.defaultdict(list)
for n in NAMES:
    by_sh[n['sh']].append(n)

total_names   = len(NAMES)
with_meaning  = sum(1 for n in NAMES if n.get('meaning'))
no_meaning    = total_names - with_meaning

# ── HTML ──────────────────────────────────────────────────────────────────────
rows = []
for sh in SHLOKAS:
    sn   = sh['s']
    names_in_sh = by_sh.get(sn, [])
    n_count = len(names_in_sh)

    # verse padas (Devanagari preferred)
    def pada(p): return p.get('sa') or p.get('ro','')
    verse_lines = '<br>'.join(
        pada(sh[k]) for k in ('p1','p2','p3','p4') if k in sh
    )

    # name rows
    name_rows = []
    for nm in names_in_sh:
        n_num  = nm['n']
        n_sa   = nm['name'].get('sa','')
        n_ro   = nm['name'].get('ro','')
        n_te   = nm['name'].get('te','')
        m      = nm.get('meaning') or {}
        en     = m.get('en','') or ''
        en_d   = m.get('en_d','') or ''
        te     = m.get('te','') or ''
        sa_m   = m.get('sa','') or ''
        missing = '⚠' if not m else ''
        name_rows.append(f'''
        <tr class="name-row{'  no-meaning' if not m else ''}">
          <td class="n-num">{n_num}</td>
          <td class="n-sa">{n_sa}</td>
          <td class="n-ro">{n_ro}</td>
          <td class="n-te">{n_te}</td>
          <td class="n-en">{missing}{en}<span class="en-d">{(' — ' + en_d) if en_d else ''}</span></td>
          <td class="n-te-m">{te}</td>
          <td class="n-sa-m">{sa_m}</td>
        </tr>''')

    rows.append(f'''
  <div class="verse-block" data-sh="{sn}" data-names="{','.join(nm['name'].get('ro','').lower() for nm in names_in_sh)}">
    <div class="verse-hdr">
      <span class="verse-num">Verse {sn}</span>
      <span class="name-count">{n_count} names</span>
      {'<span class="badge-missing">⚠ missing meanings</span>' if any(not nm.get('meaning') for nm in names_in_sh) else ''}
    </div>
    <div class="verse-text">{verse_lines}</div>
    <table class="names-tbl">
      <thead><tr>
        <th>#</th><th>संस्कृत</th><th>IAST</th><th>తెలుగు</th>
        <th>English meaning</th><th>Telugu meaning</th><th>Sanskrit meaning</th>
      </tr></thead>
      <tbody>{''.join(name_rows)}</tbody>
    </table>
  </div>''')

html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>VSN Review — Verses + Names + Meanings</title>
<style>
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: system-ui, sans-serif; background: #f5f3ee; color: #1c1a14; padding: 16px; }}
h1 {{ font-size: 22px; font-weight: 700; margin-bottom: 4px; }}
.subtitle {{ font-size: 13px; color: #666; margin-bottom: 16px; }}

/* Stats bar */
.stats {{ display: flex; gap: 20px; background: #fff; border: 1px solid #ddd; border-radius: 8px;
          padding: 12px 16px; margin-bottom: 16px; flex-wrap: wrap; }}
.stat {{ font-size: 13px; }}
.stat strong {{ font-size: 18px; display: block; }}
.stat.warn strong {{ color: #c04000; }}
.stat.ok   strong {{ color: #1a7a30; }}

/* Filter bar */
.filter-bar {{ display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }}
.filter-bar input {{ flex: 1; min-width: 200px; padding: 7px 12px; border: 1px solid #ccc;
                     border-radius: 20px; font-size: 13px; background: #fff; }}
.filter-bar label {{ font-size: 12px; color: #555; display: flex; align-items: center; gap: 4px; cursor: pointer; }}
#verse-jump {{ width: 80px; }}

/* Verse blocks */
.verse-block {{ background: #fff; border: 1px solid #ddd; border-radius: 10px;
                padding: 14px 16px; margin-bottom: 16px; }}
.verse-block.hidden {{ display: none; }}
.verse-hdr {{ display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }}
.verse-num {{ font-weight: 800; font-size: 15px; color: #2a1a00; }}
.name-count {{ font-size: 12px; background: #ede8dc; border-radius: 10px; padding: 2px 8px; color: #5a3a00; }}
.badge-missing {{ font-size: 11px; background: #fdeaea; color: #a02020; border-radius: 10px; padding: 2px 8px; }}
.verse-text {{ font-family: 'Noto Serif Devanagari', serif; font-size: 14px; line-height: 1.8;
               color: #2a1060; margin-bottom: 10px; background: #f0ecf8; border-radius: 6px; padding: 10px 12px; }}

/* Names table */
.names-tbl {{ width: 100%; border-collapse: collapse; font-size: 12px; }}
.names-tbl th {{ background: #ede8dc; padding: 5px 8px; text-align: left; color: #3a2a00; font-weight: 700; white-space: nowrap; }}
.names-tbl td {{ padding: 5px 8px; border-bottom: 1px solid #f0ece0; vertical-align: top; }}
.names-tbl tr:last-child td {{ border-bottom: none; }}
.names-tbl tr.no-meaning td {{ background: #fff8f0; }}
.n-num  {{ width: 36px; color: #888; font-weight: 700; text-align: right; }}
.n-sa   {{ font-family: 'Noto Serif Devanagari', serif; font-size: 13px; color: #2a1060; white-space: nowrap; }}
.n-ro   {{ font-style: italic; color: #4a3a00; white-space: nowrap; }}
.n-te   {{ color: #1a4a1a; white-space: nowrap; }}
.n-en   {{ color: #1c1a14; }}
.en-d   {{ color: #666; font-size: 11px; }}
.n-te-m {{ color: #1a4a1a; font-size: 11px; }}
.n-sa-m {{ font-family: 'Noto Serif Devanagari', serif; font-size: 11px; color: #2a1060; }}

/* Result count */
#result-count {{ font-size: 12px; color: #666; margin-bottom: 10px; }}
</style>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>

<h1>VSN Review — Verses · Names · Meanings</h1>
<p class="subtitle">Generated {__import__('datetime').date.today()} · Source: data/vsn/content/</p>

<div class="stats">
  <div class="stat"><strong>{len(SHLOKAS)}</strong>Shlokas</div>
  <div class="stat"><strong>{total_names}</strong>Names total</div>
  <div class="stat ok"><strong>{with_meaning}</strong>With meaning</div>
  <div class="stat warn"><strong>{no_meaning}</strong>Missing meaning</div>
</div>

<div class="filter-bar">
  <input type="search" id="srch" placeholder="Filter by name (IAST), verse #, meaning…" oninput="filter()">
  <input type="number" id="verse-jump" placeholder="Verse #" min="1" max="108"
         oninput="jumpToVerse(this.value)">
  <label><input type="checkbox" id="only-missing" onchange="filter()"> Show only missing meanings</label>
</div>
<div id="result-count"></div>

{''.join(rows)}

<script>
const blocks = [...document.querySelectorAll('.verse-block')];

function filter() {{
  const q     = document.getElementById('srch').value.trim().toLowerCase();
  const miss  = document.getElementById('only-missing').checked;
  let shown   = 0;
  blocks.forEach(b => {{
    const shNum   = b.dataset.sh;
    const names   = b.dataset.names;
    const text    = (b.textContent || '').toLowerCase();
    const hasMiss = b.querySelector('.badge-missing');
    const matchQ  = !q || shNum === q || names.includes(q) || text.includes(q);
    const matchM  = !miss || hasMiss;
    const show    = matchQ && matchM;
    b.classList.toggle('hidden', !show);
    if (show) shown++;
  }});
  document.getElementById('result-count').textContent =
    q || miss ? `Showing ${{shown}} of ${{blocks.length}} verses` : '';
}}

function jumpToVerse(v) {{
  const n = parseInt(v);
  if (!n) return;
  const b = blocks.find(x => +x.dataset.sh === n);
  if (b) {{ b.classList.remove('hidden'); b.scrollIntoView({{behavior:'smooth', block:'start'}}); }}
}}
</script>
</body>
</html>'''

OUT.write_text(html, encoding='utf-8')
print(f'Written: {OUT}')
print(f'  {len(SHLOKAS)} shlokas, {total_names} names, {with_meaning} with meaning, {no_meaning} missing')
