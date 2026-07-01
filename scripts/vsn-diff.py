#!/usr/bin/env python3
"""
vsn-diff.py — Compare VSN 2-pada (sandhied) vs 4-pada (sandhi-split) files.
Usage: python3 scripts/vsn-diff.py <2-pada-file> <4-pada-file> [output.html]
"""

import re, html, difflib, sys

def parse_2pada(path):
    with open(path) as f:
        lines = [l.rstrip() for l in f]
    shlokas = {}
    for i, line in enumerate(lines):
        m = re.search(r'॥\s*(\d+)\s*॥', line)
        if m:
            num = int(m.group(1))
            h2 = re.sub(r'॥\s*\d+\s*॥.*', '', line).strip().rstrip('।').strip()
            h1 = lines[i-1].strip().rstrip('।').strip()
            h1 = re.sub(r'^ॐ\s*', '', h1)
            shlokas[num] = (h1, h2)
    return shlokas

def parse_4pada(path):
    with open(path) as f:
        raw = f.read()
    shlokas = {}
    combined = ' '.join(raw.split('\n'))
    tokens = re.split(r'(॥\s*\d+\s*॥)', combined)
    current = ''
    for tok in tokens:
        m = re.match(r'॥\s*(\d+)\s*॥', tok)
        if m:
            num = int(m.group(1))
            text = current.strip()
            parts = [p.strip() for p in text.split('।') if p.strip()]
            h1 = parts[0] if len(parts) > 0 else ''
            h2 = parts[1] if len(parts) > 1 else ''
            shlokas[num] = (h1, h2)
            current = ''
        else:
            current = tok
    return shlokas

def char_diff_html(a, b):
    """Return (a_html, b_html) with per-character highlights."""
    ac, bc = list(a), list(b)
    matcher = difflib.SequenceMatcher(None, ac, bc, autojunk=False)
    a_html, b_html = '', ''
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        ea = html.escape(''.join(ac[i1:i2]))
        eb = html.escape(''.join(bc[j1:j2]))
        if tag == 'equal':
            a_html += ea
            b_html += eb
        elif tag == 'replace':
            a_html += f'<mark>{ea}</mark>'
            b_html += f'<mark>{eb}</mark>'
        elif tag == 'delete':
            a_html += f'<mark>{ea}</mark>'
        elif tag == 'insert':
            b_html += f'<mark>{eb}</mark>'
    return a_html, b_html

def generate_report(path_2pada, path_4pada, out_path):
    s2 = parse_2pada(path_2pada)
    s4 = parse_4pada(path_4pada)

    all_nums = sorted(set(s2) | set(s4))
    rows = []
    for n in all_nums:
        h2_1, h2_2 = s2.get(n, ('—', '—'))
        h4_1, h4_2 = s4.get(n, ('—', '—'))
        same = (h2_1 == h4_1 and h2_2 == h4_2)
        rows.append((n, h2_1, h2_2, h4_1, h4_2, same))

    diff_rows = [r for r in rows if not r[5]]
    same_count = sum(1 for r in rows if r[5])

    html_out = f"""<!DOCTYPE html>
<html lang="sa">
<head>
<meta charset="UTF-8">
<title>VSN Text Comparison</title>
<style>
  body {{ font-family: sans-serif; font-size: 14px; margin: 20px; }}
  h1 {{ font-size: 18px; }}
  .summary {{ background: #f0f4f8; padding: 10px 16px; border-radius: 6px; margin-bottom: 16px; }}
  table {{ border-collapse: collapse; width: 100%; }}
  th {{ background: #334; color: #fff; padding: 8px 10px; text-align: left; position: sticky; top: 0; }}
  td {{ padding: 7px 10px; vertical-align: top; border-bottom: 1px solid #ddd; }}
  tr:hover td {{ background: #f9f9e8; }}
  .num {{ text-align: center; font-weight: bold; color: #444; width: 40px; }}
  .half {{ font-family: 'Noto Serif Devanagari', serif; font-size: 15px; line-height: 1.7; }}
  mark {{ background: #ffe066; border-radius: 2px; padding: 0 1px; }}
  .label {{ font-size: 11px; color: #888; display: block; }}
  .diff-h1 {{ border-left: 4px solid #e07b00; }}
  .diff-h2 {{ border-left: 4px solid #0077cc; }}
  .diff-both {{ border-left: 4px solid #cc0033; }}
</style>
</head>
<body>
<h1>VSN: {path_2pada} vs {path_4pada}</h1>
<div class="summary">
  <b>Total shlokas:</b> {len(all_nums)} &nbsp;|&nbsp;
  <b>Identical:</b> {same_count} &nbsp;|&nbsp;
  <b>Differences:</b> {len(diff_rows)}
</div>
<table>
<tr>
  <th class="num">#</th>
  <th>2-padas (sandhied)</th>
  <th>4-padas (sandhi-split)</th>
</tr>
"""

    for n, h2_1, h2_2, h4_1, h4_2, _ in diff_rows:
        diff_h1 = h2_1 != h4_1
        diff_h2 = h2_2 != h4_2
        cls = 'diff-both' if (diff_h1 and diff_h2) else ('diff-h1' if diff_h1 else 'diff-h2')

        a1_html = html.escape(h2_1)
        b1_html = html.escape(h4_1)
        a2_html = html.escape(h2_2)
        b2_html = html.escape(h4_2)

        if diff_h1:
            a1_html, b1_html = char_diff_html(h2_1, h4_1)
        if diff_h2:
            a2_html, b2_html = char_diff_html(h2_2, h4_2)

        html_out += f"""
<tr class="{cls}">
  <td class="num">{n}</td>
  <td>
    <span class="label">H1 (p1+p2)</span><span class="half">{a1_html}</span>
    <span class="label" style="margin-top:4px">H2 (p3+p4)</span><span class="half">{a2_html}</span>
  </td>
  <td>
    <span class="label">H1 (p1+p2)</span><span class="half">{b1_html}</span>
    <span class="label" style="margin-top:4px">H2 (p3+p4)</span><span class="half">{b2_html}</span>
  </td>
</tr>"""

    html_out += "\n</table>\n</body>\n</html>"

    with open(out_path, 'w') as f:
        f.write(html_out)

    print(f"Written {out_path} — {len(diff_rows)} differing / {len(all_nums)} total shlokas")


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 scripts/vsn-diff.py <2-pada-file> <4-pada-file> [output.html]")
        sys.exit(1)
    p2 = sys.argv[1]
    p4 = sys.argv[2]
    out = sys.argv[3] if len(sys.argv) > 3 else 'vsn-diff-report.html'
    generate_report(p2, p4, out)
