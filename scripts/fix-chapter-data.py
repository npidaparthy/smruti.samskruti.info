#!/usr/bin/env python3
"""
fix-chapter-data.py — Fix meaning-block shifts in ch01.json and ch13.json.

Chapter 1:
  s=33..46 each have the meaning for the NEXT verse (off by +1).
  s=47 has a conclusion text instead of a verse meaning.
  Fix: shift meanings back (s=34←s=33, ..., s=47←s=46).
       s=33 is left without a meaning (1.33 meaning is absent from data).
       Conclusion text saved as chapter-level "conclusion" field.

Chapter 13:
  The Arjuna question (13.0) verse text is missing; its meaning sits at s=1.
  s=1..34 meanings are all shifted +1 (meaning at s=N describes verse N-1).
  Fix: insert s=0 shloka with standard verse text + current s=1 meaning.
       Shift meanings back (s=1←s=2, ..., s=33←s=34).
       s=34 is left without a meaning (13.34 meaning absent from data).
  Also: update bg-meta.json ch13 occurrence refs (13.N → 13.(N-1)).
"""

import json
from pathlib import Path

ROOT    = Path(__file__).parent.parent
CH01    = ROOT / "data" / "chapters" / "ch01.json"
CH13    = ROOT / "data" / "chapters" / "ch13.json"
BGMETA  = ROOT / "data" / "bg-meta.json"


def save(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    print(f"  ✓ saved {path.relative_to(ROOT)}")


# ── Fix Chapter 1 ─────────────────────────────────────────────────────────────

def fix_ch01():
    print("\nFixing ch01.json …")
    d = json.load(open(CH01, encoding="utf-8"))
    by_s = {sh["s"]: sh for sh in d["shlokas"]}

    # Extract conclusion from s=47 before shifting
    conclusion = by_s[47].get("meaning", {})
    conclusion_en = conclusion.get("en", {}).get("short", "") if conclusion else ""
    print(f"  Conclusion text (from s=47): \"{conclusion_en[:80]}\"")

    # Shift meanings: s=47←46, 46←45, ..., 34←33
    for s in range(47, 33, -1):
        prev = by_s.get(s - 1, {})
        if "meaning" in prev:
            by_s[s]["meaning"] = prev["meaning"]
        elif "meaning" in by_s[s]:
            del by_s[s]["meaning"]

    # s=33 has no correct meaning in the data — remove the now-duplicated block
    if "meaning" in by_s[33]:
        del by_s[33]["meaning"]
        print("  s=33: meaning removed (1.33 meaning missing from source data)")

    # Save conclusion at chapter level
    d["conclusion"] = conclusion
    print(f"  s=47: meaning set to Sañjaya's closing verse; old conclusion moved to chapter level")

    save(CH01, d)


# ── Fix Chapter 13 ────────────────────────────────────────────────────────────

ARJUNA_Q = {
    "c": 13, "s": 0,
    "speaker": "arjuna",
    "p1": {"ro": "arjuna uvāca",           "te": "అర్జున ఉవాచ",          "dn": "अर्जुन उवाच"},
    "p2": {"ro": "prakṛtiṃ puruṣaṃ caiva", "te": "ప్రకృతిం పురుషం చైవ", "dn": "प्रकृतिं पुरुषं चैव"},
    "p3": {"ro": "kṣetraṃ kṣetrajñam eva ca", "te": "క్షేత్రం క్షేత్రజ్ఞమేవ చ", "dn": "क्षेत्रं क्षेत्रज्ञमेव च"},
    "p4": {"ro": "etad veditum icchāmi",    "te": "ఏతద్వేదితుమిచ్ఛామి",   "dn": "एतद्वेदितुमिच्छामि"},
    "p5": {"ro": "jñānaṃ jñeyaṃ ca keśava","te": "జ్ఞానం జ్ఞేయం చ కేశవ", "dn": "ज्ञानं ज्ञेयं च केशव"},
}

def fix_ch13():
    print("\nFixing ch13.json …")
    d = json.load(open(CH13, encoding="utf-8"))
    by_s = {sh["s"]: sh for sh in d["shlokas"]}

    # s=0: Arjuna question verse text + meaning currently at s=1
    s0 = dict(ARJUNA_Q)
    if "meaning" in by_s[1]:
        s0["meaning"] = by_s[1]["meaning"]
    print(f"  Inserted s=0: Arjuna question verse + meaning \"{s0.get('meaning',{}).get('en',{}).get('short','')[:70]}\"")

    # Shift meanings: s=1←s=2, ..., s=33←s=34
    for s in range(1, 34):
        nxt = by_s.get(s + 1, {})
        if "meaning" in nxt:
            by_s[s]["meaning"] = nxt["meaning"]
        elif "meaning" in by_s[s]:
            del by_s[s]["meaning"]

    # s=34 has no correct meaning now — remove
    if "meaning" in by_s[34]:
        del by_s[34]["meaning"]
        print("  s=34: meaning removed (13.34 meaning missing from source data)")

    # Rebuild shlokas list: s=0 first, then s=1..34
    d["shlokas"] = [s0] + [by_s[s] for s in sorted(k for k in by_s if k >= 1)]
    print(f"  Total shlokas now: {len(d['shlokas'])} (was 34, now 35 with s=0)")

    save(CH13, d)


# ── Update bg-meta.json ch13 occurrence refs ──────────────────────────────────

def fix_bgmeta_ch13():
    print("\nUpdating bg-meta.json ch13 references …")
    meta = json.load(open(BGMETA, encoding="utf-8"))
    changed = []

    for speaker in ("krishna", "arjuna"):
        for entry in meta["names"][speaker]:
            old = entry.get("occurrences", [])
            new = []
            for ref in old:
                ch, s = ref.split(".")
                if ch == "13":
                    new_s = int(s) - 1
                    new_ref = f"13.{new_s}"
                    changed.append(f"  {entry['iast']}: {ref} → {new_ref}")
                    new.append(new_ref)
                else:
                    new.append(ref)
            entry["occurrences"] = new

    for line in changed:
        print(line)

    save(BGMETA, meta)


if __name__ == "__main__":
    fix_ch01()
    fix_ch13()
    fix_bgmeta_ch13()
    print("\nDone. Run audit-names.py to verify bg-meta.json after the renumber.")
