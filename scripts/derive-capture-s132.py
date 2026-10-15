#!/usr/bin/env python3
"""Derive capture-session132.sh from the s131 form (Session 132 — the
80th Mode C audit cycle). The exact convention: 25 raw diff lines
(header block + log + session tokens).

Run from the repo root:  python3 scripts/derive-capture-s132.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session131.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — 11 lines, the exact form
    (
        """# Session 131 screenshot capture — the standard set re-captured on the
# S131 code (the present-unmount/layers-stand-down/doc-census pass's
# own continuation: the S131-A mount composition changes zero standard
# journeys (no capture journey presents through a swap window — the
# overlay's mount and remount ride the settled loading false state,
# the failure path's Untitled settle the same form), the S131-B
# layers arms' stand-down refusal-only through a live gesture (every
# capture journey's eye/lock/trash/reorder click runs gesture-free,
# the dispatch identical), the S131-C/D/E doc-and-record family —
# window-scoped guard + doc truth, +
""",
        """# Session 132 screenshot capture — the standard set re-captured on the
# S132 code (the marquee-live-list/by-design-registration/env-census
# pass's own continuation: the S132-A live-list read changes zero
# standard journeys (every capture marquee journey runs against the
# settled store — the live read and the render-captured list agree
# outside the sub-frame window, the selection identical), the S132-B
# by-design registration comment-only (the s66 preservation contract
# riding unchanged — the hex text journeys' discrete commits the
# same form), the S132-C worklog note record-only, and the count
# family doc-only (the §11 rows and the gate-order lines) — the
# window-scoped guard + doc truth, + forms riding unchanged
""",
    ),
    ("digma-capture131.log", "digma-capture132.log"),
    ('S="agent-browser --session clone131"', 'S="agent-browser --session clone132"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session132.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session132.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture131", "clone131"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session132.sh")
print("residue scan clean")
