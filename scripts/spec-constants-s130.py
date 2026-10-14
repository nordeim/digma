#!/usr/bin/env python3
"""The session-130 spec-constants re-anchor: the per-session count-honesty
specs carry the LIVE UNIT/FILES constants (the standing convention — every
session re-anchors them onto the delivery's own counts).

1839 unit / 192 files (from 1820 / 191 — lows-s130.test.ts joins the tree
with 19 checks).

Run from the repo root:  python3 scripts/spec-constants-s130.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma/tests")

changed = []
for p in sorted(ROOT.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "1820";', 'const UNIT = "1839";')
    text = text.replace('const FILES = "191";', 'const FILES = "192";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 1839/192:")
for name in changed:
    print(f"  {name}")
