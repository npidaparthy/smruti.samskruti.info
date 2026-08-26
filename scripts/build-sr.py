#!/usr/bin/env python3
"""
build-sr.py — parse Sankshepa Ramayanam verse txt files -> data/sr/sr.json

Input:  data/sr/sankshepa-ramayanam.txt      (Telugu script)
        data/sr/sankshepa-ramayanam_sa.txt   (Devanagari)
        data/sr/sankshepa-ramayanam_iast.txt (IAST)

None of the three files' physical line breaks / blank-line blocks can be
trusted as verse boundaries: the Telugu file has a couple of malformed
"||N||" end markers, and the Devanagari/IAST files additionally contain
stray "1-1-19-"-style kanda-sarga-verse citations that don't exist in the
Telugu file, which throws off any line-count-based alignment between
files. What *is* reliable across all three: each verse ends with a
numeral (however mangled the surrounding danda punctuation), and verses
are numbered 1..100 in order with no gaps. So each file is scanned
independently for numeral positions, verses are cut at each numeral that
continues the 1..100 sequence (skipping any numeral that doesn't, e.g. a
stray citation digit), and the resulting per-file verse texts are then
matched up purely by verse number.

Each verse is kept as two halves (h1 up to the mid danda, h2 the rest)
rather than guessing pada (quarter-verse) boundaries.

Output: data/sr/sr.json
        One record per verse, h1/h2 nested {te, sa, ro}.
        meaning left empty ({}) for a later authoring pass — filled in as
        meaning.{en,te,sa}.{short,long}, with word-by-word only under
        meaning.en.wbw, matching the BG chapter files' schema.

Usage:  python3 scripts/build-sr.py
"""

import json, re
from pathlib import Path

ROOT    = Path(__file__).parent.parent
SRC_DIR = ROOT / "data" / "sr"
OUT_DIR = ROOT / "data" / "sr"

FILES = {
    "te": SRC_DIR / "sankshepa-ramayanam.txt",
    "sa": SRC_DIR / "sankshepa-ramayanam_sa.txt",
    "ro": SRC_DIR / "sankshepa-ramayanam_iast.txt",
}

TOTAL_VERSES = 100


STRAY_CITATION = re.compile(r"\d+-\d+-\d+-?")


def verse_texts(path: Path) -> dict[int, str]:
    """Cut the file into {verse_num: raw_text} by walking numeral tokens
    in order, keeping only the ones that continue the 1..100 sequence."""
    text = STRAY_CITATION.sub("", path.read_text(encoding="utf-8"))
    out = {}
    expect = 1
    cursor = 0
    for m in re.finditer(r"\d+", text):
        if int(m.group()) != expect:
            continue  # stray citation digit (e.g. "1-1-19-") — not a verse end
        # strip the closing danda(s) immediately before this digit — that's
        # residue from "...৷৷N৷৷", not a mid-verse marker to split on
        out[expect] = re.sub(r"[।৷]+\s*$", "", text[cursor:m.start()])
        end = m.end()
        trail = re.match(r"[।৷]*", text[end:])  # danda(s) closing this marker
        cursor = end + trail.end()
        expect += 1
        if expect > TOTAL_VERSES:
            break
    if expect != TOTAL_VERSES + 1:
        raise ValueError(f"{path.name}: only found verses up to {expect - 1}")
    return out


MID_MARKER = re.compile(r"[।৷]+")


def split_half(joined: str) -> tuple[str, str]:
    """Split a verse's raw text into (h1, h2) at the mid danda (either the
    usual single "।" or, in a couple of verses, a doubled "৷৷" used as a
    mid-verse marker instead of an end marker), falling back to the
    midpoint line break if no danda is present at all (scribal gap)."""
    joined = joined.lstrip()
    m = MID_MARKER.search(joined)
    if m:
        return joined[: m.end()], joined[m.end():]
    nl = joined.find("\n")
    if nl != -1:
        return joined[:nl], joined[nl:]
    raise ValueError(f"no mid danda or line break in: {joined!r}")


def clean(s: str) -> str:
    s = re.sub(r"^\s*[।৷]+\s*", "", s)   # leading danda/verse-marker remnants
    s = re.sub(r"[।৷]+\s*$", "", s)      # trailing danda/verse-marker remnants
    return re.sub(r"\s+", " ", s).strip()


def main():
    parsed = {lang: verse_texts(path) for lang, path in FILES.items()}

    shlokas = []
    for n in range(1, TOTAL_VERSES + 1):
        entry = {"s": n}
        for lang in FILES:
            h1, h2 = split_half(parsed[lang][n])
            entry.setdefault("h1", {})[lang] = clean(h1)
            entry.setdefault("h2", {})[lang] = clean(h2)
        entry["meaning"] = {}
        shlokas.append(entry)

    data = {
        "text": "sankshepa_ramayanam",
        "total": len(shlokas),
        "shlokas": shlokas,
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / "sr.json"
    out_path.write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )
    print(f"wrote {out_path} — {len(shlokas)} verses")


if __name__ == "__main__":
    main()
