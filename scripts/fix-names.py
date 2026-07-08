#!/usr/bin/env python3
"""
fix-names.py — Apply audit corrections to bg-meta.json and produce a review HTML.

Actions per name (except Bharata missing — left for manual review):
  REMOVED : declared occurrence where name is absent → removed from occurrences[]
  ADDED   : found occurrence not declared → added to occurrences[]

Outputs:
  data/bg-meta.json          (updated in-place)
  scripts/fix-names-review.html  (open in browser to verify every change)
"""

import json, glob, re, unicodedata
from pathlib import Path
from datetime import datetime

ROOT     = Path(__file__).parent.parent
BG_META  = ROOT / "data" / "bg-meta.json"
CHAPTERS = sorted(glob.glob(str(ROOT / "data" / "chapters" / "ch*.json")))
OUT_HTML = Path(__file__).parent / "fix-names-review.html"

# ── Load verses ───────────────────────────────────────────────────────────────

def load_verses():
    verses = {}
    for f in CHAPTERS:
        d = json.load(open(f, encoding="utf-8"))
        for sh in d.get("shlokas", []):
            ref = f"{sh['c']}.{sh['s']}"
            verses[ref] = sh
    return verses

# ── Normalisation ─────────────────────────────────────────────────────────────

_IAST_MAP = str.maketrans({
    'ḥ':'h','ṃ':'m','ṁ':'m','ṅ':'n','ñ':'n','ṭ':'t','ḍ':'d','ṇ':'n',
    'ś':'s','ṣ':'s','ḷ':'l','ā':'a','ī':'i','ū':'u','ṛ':'r',
    'Ḥ':'h','Ṃ':'m','Ṁ':'m','Ṅ':'n','Ñ':'n','Ṭ':'t','Ḍ':'d','Ṇ':'n',
    'Ś':'s','Ṣ':'s','Ḷ':'l','Ā':'a','Ī':'i','Ū':'u','Ṛ':'r',
})
_VOWELS = set('aeiou')

def norm(s):
    s = s.lower().translate(_IAST_MAP)
    s = s.replace("sh", "s")
    s = re.sub(r"[^a-z0-9]", "", s)
    return s

def _after_ok(w, idx, length):
    rest = w[idx + length:]
    return not rest or rest[0] != 'r'

def _tail_short(w, idx, length):
    return len(w) - (idx + length) <= 3

def name_in_verse(name_iast, sh):
    needle  = norm(name_iast)
    nlen    = len(needle)
    stem    = needle.rstrip('aeiou')   # for -o vocative variant matching
    stml    = len(stem)
    elided  = needle.lstrip('aeiou')   # for initial-vowel elision sandhi
    elen    = len(elided)

    for raw_word in _pada_text(sh).split():
        w = norm(raw_word)
        # (a) exact prefix
        if w.startswith(needle) and _after_ok(w, 0, nlen):
            return True
        # (a2) stem prefix — only for -o vocative names (Mahābāho)
        if needle.endswith('o') and w.startswith(stem) and _after_ok(w, 0, stml):
            return True
        # (b) needle is last element of compound — ≤3 chars trail
        idx = w.find(needle)
        if idx > 0 and _tail_short(w, idx, nlen) and _after_ok(w, idx, nlen):
            return True
        # (c) initial-vowel elision sandhi (me'cyuta → mecyuta matches acyuta)
        if elided and elided != needle:
            idx2 = w.find(elided)
            if (idx2 > 0 and w[idx2-1] in _VOWELS
                    and _tail_short(w, idx2, elen) and _after_ok(w, idx2, elen)):
                return True
    return False

def _pada_text(sh):
    parts = []
    for pk in ["p1","p2","p3","p4"]:
        p = sh.get(pk) or {}
        parts.append(p.get("ro",""))
        parts.append(p.get("te",""))
    return " ".join(parts)

# ── Verse display helpers ─────────────────────────────────────────────────────

def verse_ro(sh):
    lines = []
    for pk in ["p1","p2","p3","p4"]:
        p = sh.get(pk) or {}
        ro = p.get("ro","")
        if ro: lines.append(ro)
    return lines

def verse_te(sh):
    lines = []
    for pk in ["p1","p2","p3","p4"]:
        p = sh.get(pk) or {}
        te = p.get("te","")
        if te: lines.append(te)
    return lines

def highlight(lines, iast):
    """Wrap the name (and common inflected forms) in <mark>."""
    needle = norm(iast)
    stripped = needle.lstrip('aeiou')
    result = []
    nlen   = len(needle)
    stem   = needle.rstrip('aeiou')
    stml   = len(stem)
    elided = needle.lstrip('aeiou')
    elen   = len(elided)
    for line in lines:
        out = []
        for word in line.split(' '):
            w = norm(word)
            matched = (
                (w.startswith(needle) and _after_ok(w, 0, nlen)) or
                (needle.endswith('o') and w.startswith(stem) and _after_ok(w, 0, stml)) or
                (w.find(needle) > 0 and _tail_short(w, w.find(needle), nlen) and _after_ok(w, w.find(needle), nlen)) or
                (elided and elided != needle and w.find(elided) > 0 and
                 w[w.find(elided)-1] in _VOWELS and _tail_short(w, w.find(elided), elen))
            )
            out.append(f'<mark>{word}</mark>' if matched else word)
        result.append(' '.join(out))
    return result

# ── Main ──────────────────────────────────────────────────────────────────────

def run():
    meta   = json.load(open(BG_META, encoding="utf-8"))
    verses = load_verses()
    names  = meta.get("names", {})
    changes = []   # list of dicts for HTML report

    for speaker in ("krishna", "arjuna"):
        for entry in names.get(speaker, []):
            iast        = entry.get("iast", entry.get("name", "?"))
            te          = entry.get("te", "")
            declared    = entry.get("occurrences", [])
            is_bharata  = norm(iast) == "bharata"

            # Compute wrong / missing
            wrong   = [ref for ref in declared
                       if not verses.get(ref) or not name_in_verse(iast, verses[ref])]
            declared_set = set(declared)
            missing = sorted(
                [ref for ref, sh in verses.items()
                 if ref not in declared_set and name_in_verse(iast, sh)],
                key=lambda r: [int(x) for x in r.split(".")]
            )

            # Record changes
            for ref in wrong:
                sh = verses.get(ref)
                changes.append({
                    "action":  "REMOVED",
                    "speaker": speaker,
                    "iast":    iast,
                    "te":      te,
                    "ref":     ref,
                    "ro":      verse_ro(sh) if sh else ["(verse not found)"],
                    "te_v":    verse_te(sh) if sh else [],
                    "hl_ro":   highlight(verse_ro(sh), iast) if sh else [],
                    "note":    "name absent from verse text",
                })

            if not is_bharata:
                for ref in missing:
                    sh = verses[ref]
                    changes.append({
                        "action":  "ADDED",
                        "speaker": speaker,
                        "iast":    iast,
                        "te":      te,
                        "ref":     ref,
                        "ro":      verse_ro(sh),
                        "te_v":    verse_te(sh),
                        "hl_ro":   highlight(verse_ro(sh), iast),
                        "note":    "name found in verse but was not listed",
                    })
            else:
                for ref in missing:
                    sh = verses[ref]
                    changes.append({
                        "action":  "BHARATA-REVIEW",
                        "speaker": speaker,
                        "iast":    iast,
                        "te":      te,
                        "ref":     ref,
                        "ro":      verse_ro(sh),
                        "te_v":    verse_te(sh),
                        "hl_ro":   highlight(verse_ro(sh), iast),
                        "note":    "found but NOT auto-added — check if vocative address or generic epithet",
                    })

            # Apply corrections to entry
            new_occ = [r for r in declared if r not in wrong]
            if not is_bharata:
                new_occ = sorted(
                    set(new_occ) | set(missing),
                    key=lambda r: [int(x) for x in r.split(".")]
                )
            entry["occurrences"] = new_occ
            entry["count"] = len(new_occ)

    # Write updated bg-meta.json
    with open(BG_META, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    print(f"✓ Updated {BG_META}")

    # Write HTML review
    write_html(changes)
    print(f"✓ Review page: {OUT_HTML}")
    print(f"  Changes: {sum(1 for c in changes if c['action']=='REMOVED')} removed, "
          f"{sum(1 for c in changes if c['action']=='ADDED')} added, "
          f"{sum(1 for c in changes if c['action']=='BHARATA-REVIEW')} Bharata pending review")

# ── HTML generation ───────────────────────────────────────────────────────────

def write_html(changes):
    removed  = [c for c in changes if c["action"] == "REMOVED"]
    added    = [c for c in changes if c["action"] == "ADDED"]
    bharata  = [c for c in changes if c["action"] == "BHARATA-REVIEW"]

    def card(c):
        action_cls = {"REMOVED": "rm", "ADDED": "add", "BHARATA-REVIEW": "bh"}[c["action"]]
        action_label = {"REMOVED": "REMOVED", "ADDED": "ADDED", "BHARATA-REVIEW": "⚠ BHARATA — check"}[c["action"]]
        ro_lines  = "".join(f"<div class='pada'>{l}</div>" for l in c["hl_ro"])
        te_lines  = "".join(f"<div class='pada te'>{l}</div>" for l in c["te_v"])
        return f"""
<div class="card {action_cls}">
  <div class="card-head">
    <span class="badge {action_cls}">{action_label}</span>
    <span class="ref">{c['ref']}</span>
    <span class="name">{c['iast']} <span class="te-name">{c['te']}</span></span>
    <span class="note">{c['note']}</span>
  </div>
  <div class="verse">{ro_lines}</div>
  <div class="verse">{te_lines}</div>
</div>"""

    sections = ""
    if removed:
        sections += f"<h2 class='sec-head rm-head'>Removed ({len(removed)}) — listed but name absent</h2>"
        sections += "".join(card(c) for c in removed)
    if added:
        sections += f"<h2 class='sec-head add-head'>Added ({len(added)}) — found but not listed</h2>"
        sections += "".join(card(c) for c in added)
    if bharata:
        sections += f"<h2 class='sec-head bh-head'>Bharata — manual review needed ({len(bharata)})</h2>"
        sections += "<p class='bh-note'>These verses contain 'bharata' but were NOT auto-added. Check each: is it a vocative address to Arjuna or a generic epithet / other usage?</p>"
        sections += "".join(card(c) for c in bharata)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Names Fix Review — {datetime.now().strftime('%Y-%m-%d')}</title>
<style>
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: system-ui, sans-serif; background: #f5f3ee; color: #1c1a14; padding: 20px; }}
h1 {{ font-size: 22px; margin-bottom: 6px; }}
.summary {{ font-size: 14px; color: #666; margin-bottom: 24px; }}
.sec-head {{ font-size: 16px; font-weight: 700; padding: 10px 0 8px; border-bottom: 2px solid currentColor; margin: 28px 0 14px; }}
.rm-head  {{ color: #b02020; border-color: #b02020; }}
.add-head {{ color: #1a7a30; border-color: #1a7a30; }}
.bh-head  {{ color: #8b5000; border-color: #8b5000; }}
.bh-note  {{ font-size: 13px; color: #8b5000; background: #fff8e6; border: 1px solid #f0d080; border-radius: 6px; padding: 8px 12px; margin-bottom: 14px; }}
.card {{ background: #fff; border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; border-left: 4px solid #ccc; }}
.card.rm  {{ border-left-color: #dc3545; }}
.card.add {{ border-left-color: #28a745; }}
.card.bh  {{ border-left-color: #fd7e14; }}
.card-head {{ display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }}
.badge {{ font-size: 11px; font-weight: 700; border-radius: 4px; padding: 2px 7px; text-transform: uppercase; }}
.badge.rm  {{ background: #dc3545; color: #fff; }}
.badge.add {{ background: #28a745; color: #fff; }}
.badge.bh  {{ background: #fd7e14; color: #fff; }}
.ref  {{ font-weight: 700; font-size: 14px; color: #333; }}
.name {{ font-size: 14px; font-weight: 600; }}
.te-name {{ font-size: 13px; font-weight: 400; color: #666; }}
.note {{ font-size: 11px; color: #888; margin-left: auto; }}
.verse {{ line-height: 1.7; margin-top: 4px; }}
.pada {{ font-size: 14px; color: #2a2010; }}
.pada.te {{ font-size: 14px; color: #3a3a3a; margin-top: 2px; }}
mark {{ background: #ffe135; color: #1a1000; border-radius: 2px; padding: 0 2px; font-weight: 700; }}
</style>
</head>
<body>
<h1>Names Fix Review</h1>
<p class="summary">Generated {datetime.now().strftime('%Y-%m-%d %H:%M')} &nbsp;·&nbsp;
  <strong>{len(removed)}</strong> removed &nbsp;·&nbsp;
  <strong>{len(added)}</strong> added &nbsp;·&nbsp;
  <strong>{len(bharata)}</strong> Bharata pending</p>
{sections}
</body>
</html>"""

    with open(OUT_HTML, "w", encoding="utf-8") as f:
        f.write(html)

if __name__ == "__main__":
    run()
