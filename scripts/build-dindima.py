#!/usr/bin/env python3
"""
build-dindima.py — consolidate data/v-dindhima/dindima-NNN.json (94 files) +
_index.json into a single data/v-dindhima/dindima.json.

Each source file already has rich, hand-authored content (shlokam in
te/sa/iast, chandaH, granthaH, padavibhagam, anvayam, meaning, tatparyam) —
this script only reshapes field names/structure to match the app's other
ranged-text conventions (h1/h2 half-verses, meaning.{lang}.{short,long}),
it does not author any new content.

Mapping:
  shlokam.{te,sa,iast} (2-line, "\n"-joined) -> h1/h2.{te,sa,ro}
    ("iast" renamed to "ro" to match C.SCRIPTS / every other text)
  meaning.{te,en}   -> meaning.{te,en}.short
  tatparyam.{te,en} -> meaning.{te,en}.long
  padavibhagam, anvayam, chandaH, tags, granthaH.chapter -> preserved as-is,
    additive metadata not yet surfaced by the reader UI.

Usage:  python3 scripts/build-dindima.py
"""

import json
import re
from pathlib import Path

# Strips a trailing "॥ <verse-number> ॥" marker (Telugu/Devanagari/Arabic
# digits) — reader.js's renderVerse already appends its own "॥{s}॥", so the
# source's own embedded number would otherwise show up twice.
VERSE_NUM_MARKER = re.compile(r"\s*॥\s*[0-9౦-౯०-९]+\s*॥\s*$")

ROOT     = Path(__file__).parent.parent
SRC_DIR  = ROOT / "data" / "v-dindhima"
OUT_PATH = SRC_DIR / "dindima.json"


MID_DANDA = re.compile(r"\s*।\s*$")


def split_half(text):
    """A verse's te/sa/iast shlokam is two lines joined by \\n — split into
    (h1, h2). Line 1 already ends with its own mid-verse "।" (stripped here
    — reader.js's h1/h2 rendering branch adds its own, so leaving the
    source's copy in place would show a duplicate "। ।"). Line 2's trailing
    verse-number marker is stripped the same way (reader.js appends its own
    "॥{s}॥" too). Verse 94 has a trailing colophon line ("Om tat sat") after
    the verse proper; fold any line(s) past the first two into h2, after
    the number-marker strip."""
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if len(lines) < 2:
        raise ValueError(f"expected at least 2 lines, got {len(lines)}: {text!r}")
    h1_line = MID_DANDA.sub("", lines[0])
    h2_line = VERSE_NUM_MARKER.sub("", lines[1])
    return h1_line, " ".join([h2_line] + lines[2:])


def main():
    files = sorted(SRC_DIR.glob("dindima-*.json"))
    if len(files) != 94:
        raise ValueError(f"expected 94 verse files, found {len(files)}")

    shlokas = []
    for path in files:
        d = json.loads(path.read_text(encoding="utf-8"))
        num = int(d["id"].split("-")[1])

        te_h1, te_h2 = split_half(d["shlokam"]["te"])
        sa_h1, sa_h2 = split_half(d["shlokam"]["sa"])
        ro_h1, ro_h2 = split_half(d["shlokam"]["iast"])

        entry = {
            "s": num,
            "h1": {"te": te_h1, "sa": sa_h1, "ro": ro_h1},
            "h2": {"te": te_h2, "sa": sa_h2, "ro": ro_h2},
            "meaning": {
                "te": {"short": d["meaning"]["te"], "long": d["tatparyam"]["te"]},
                "en": {"short": d["meaning"]["en"], "long": d["tatparyam"]["en"]},
            },
            "chandaH": d["chandaH"],
            "tags": d["tags"],
            "padavibhagam": d["padavibhagam"],
            "anvayam": d["anvayam"],
        }
        chapter_note = d.get("granthaH", {}).get("chapter", "")
        if "(" in chapter_note:
            entry["note"] = chapter_note.split("(", 1)[1].rstrip(")")
        shlokas.append(entry)

    shlokas.sort(key=lambda e: e["s"])
    nums = [e["s"] for e in shlokas]
    if nums != list(range(1, 95)):
        raise ValueError(f"verse numbers not a clean 1..94 sequence: {nums}")

    grantha_sample = json.loads(files[0].read_text(encoding="utf-8"))["granthaH"]
    data = {
        "text": "vedanta_dindima",
        "title": {"te": grantha_sample["name_te"], "en": grantha_sample["name_en"]},
        "total": len(shlokas),
        "shlokas": shlokas,
    }

    OUT_PATH.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {OUT_PATH} — {len(shlokas)} verses")


if __name__ == "__main__":
    main()
