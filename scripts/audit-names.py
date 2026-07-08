#!/usr/bin/env python3
"""
audit-names.py — Cross-check bg-meta.json name occurrences against actual verse text.

For each Krishna/Arjuna name:
  - WRONG   : declared occurrence where the name is NOT found in any pada
  - MISSING : verse where name IS found but NOT declared in occurrences

No API calls. Pure local JSON matching.
Usage: python3 scripts/audit-names.py
"""

import json, glob, re, unicodedata, sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
BG_META  = ROOT / "data" / "bg-meta.json"
CHAPTERS = sorted(glob.glob(str(ROOT / "data" / "chapters" / "ch*.json")))

# ── Load all verse padas ──────────────────────────────────────────────────────

def load_verses():
    """Returns dict: "1.1" → {p1ro, p2ro, p3ro, p4ro, p1te, ...}"""
    verses = {}
    for f in CHAPTERS:
        d = json.load(open(f, encoding="utf-8"))
        for sh in d.get("shlokas", []):
            ref = f"{sh['c']}.{sh['s']}"
            verses[ref] = sh
    return verses

# ── Normalisation (mirrors search.js logic) ───────────────────────────────────

_IAST_MAP = str.maketrans({
    'ḥ':'h','ṃ':'m','ṁ':'m','ṅ':'n','ñ':'n','ṭ':'t','ḍ':'d','ṇ':'n',
    'ś':'s','ṣ':'s','ḷ':'l','ā':'a','ī':'i','ū':'u','ṛ':'r',
    'Ḥ':'h','Ṃ':'m','Ṁ':'m','Ṅ':'n','Ñ':'n','Ṭ':'t','Ḍ':'d','Ṇ':'n',
    'Ś':'s','Ṣ':'s','Ḷ':'l','Ā':'a','Ī':'i','Ū':'u','Ṛ':'r',
})

def norm(s):
    """Lowercase → IAST diacritics stripped → sh→s → non-alphanum removed."""
    s = s.lower().translate(_IAST_MAP)
    s = s.replace("sh", "s")
    s = re.sub(r"[^a-z0-9]", "", s)
    return s

def all_pada_text(sh):
    """Concatenate all 4 pada ro + te texts for a shloka."""
    parts = []
    for pk in ["p1","p2","p3","p4"]:
        p = sh.get(pk) or {}
        parts.append(p.get("ro",""))
        parts.append(p.get("te",""))
    return " ".join(parts)

_VOWELS = set('aeiou')

def _after_ok(w, idx, length):
    """Char immediately after the match must NOT be 'r' — that signals a
    compound continuation (bharata+rṣabha). All case-ending chars are fine."""
    rest = w[idx + length:]
    return not rest or rest[0] != 'r'

def _tail_short(w, idx, length):
    """After the match, at most 3 chars remain — a case suffix, not a long continuation.
    This prevents 'samadhavacala' (4 chars after 'madhava') matching 'mādhava'."""
    return len(w) - (idx + length) <= 3

def name_in_verse(name_iast, sh):
    """Match name_iast against verse tokens. Four cases:

    (a)  startsWith needle                    — normal: kesavam, janardana
    (a2) startsWith stem (needle – last vowel)— form variants: mahabaho→mahabah
         matches mahabahah, mahabahuh etc.
    (b)  needle mid-token, ≤3 chars after     — compound-final: adharmabhibhavatkrsna
         (replaces the old 'char-before-must-be-vowel' restriction)
    (c)  elided needle (strip initial vowels) mid-token after a vowel, ≤3 chars after
         — vowel-elision sandhi: me'cyuta→mecyuta matches acyuta
    """
    needle   = norm(name_iast)
    nlen     = len(needle)
    # stem: needle without trailing vowel(s), for form-variant matching (case a2)
    stem     = needle.rstrip('aeiou')
    stml     = len(stem)
    # elided: needle without leading vowel(s), for elision sandhi (case c)
    elided   = needle.lstrip('aeiou')
    elen     = len(elided)

    for raw_word in all_pada_text(sh).split():
        w = norm(raw_word)

        # (a) exact prefix
        if w.startswith(needle) and _after_ok(w, 0, nlen):
            return True

        # (a2) stem prefix — only for names ending in 'o' (Sanskrit vocative of u-stems,
        # e.g. Mahābāho). Drops the final 'o' so "mahabah" also matches "mahabahah"/"mahabahuh".
        # No other name in this list ends in 'o', so this is a targeted rule.
        if needle.endswith('o') and w.startswith(stem) and _after_ok(w, 0, stml):
            return True

        # (b) needle is last element of compound or sandhi — ≤3 chars trail after it
        idx = w.find(needle)
        if idx > 0 and _tail_short(w, idx, nlen) and _after_ok(w, idx, nlen):
            return True

        # (c) initial-vowel elision sandhi (me'cyuta → mecyuta matches acyuta)
        if elided and elided != needle:
            idx2 = w.find(elided)
            if (idx2 > 0 and w[idx2 - 1] in _VOWELS
                    and _tail_short(w, idx2, elen) and _after_ok(w, idx2, elen)):
                return True

    return False

# ── Main audit ────────────────────────────────────────────────────────────────

def audit():
    meta   = json.load(open(BG_META, encoding="utf-8"))
    verses = load_verses()
    names  = meta.get("names", {})

    total_wrong   = 0
    total_missing = 0

    for speaker in ("krishna", "arjuna"):
        name_list = names.get(speaker, [])
        print(f"\n{'='*60}")
        print(f"  {speaker.upper()} — {len(name_list)} names")
        print(f"{'='*60}")

        for entry in name_list:
            iast        = entry.get("iast", entry.get("name", "?"))
            te          = entry.get("te", "")
            declared    = entry.get("occurrences", [])
            count_field = entry.get("count", len(declared))

            # 1. Check declared occurrences — are they real?
            wrong   = []
            for ref in declared:
                sh = verses.get(ref)
                if sh is None:
                    wrong.append(f"{ref}(verse not found)")
                elif not name_in_verse(iast, sh):
                    wrong.append(ref)

            # 2. Find actual occurrences — anything missing?
            found_refs = [ref for ref, sh in verses.items()
                          if name_in_verse(iast, sh)]
            found_set    = set(found_refs)
            declared_set = set(declared)
            missing = sorted(found_set - declared_set,
                             key=lambda r: [int(x) for x in r.split(".")])

            # 3. Report
            status = "✓ OK" if not wrong and not missing else "✗ ISSUES"
            print(f"\n  {iast:22} ({te})  declared={len(declared)} found={len(found_refs)}  {status}")

            if wrong:
                total_wrong += len(wrong)
                print(f"    WRONG   (listed but name absent): {', '.join(wrong)}")
            if missing:
                total_missing += len(missing)
                print(f"    MISSING (found but not listed):   {', '.join(missing)}")
            if count_field != len(declared):
                print(f"    COUNT MISMATCH: count={count_field} but occurrences={len(declared)}")

    print(f"\n{'='*60}")
    print(f"  SUMMARY: {total_wrong} wrong entries, {total_missing} missing entries")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    audit()
