#!/usr/bin/env python3
"""Derive capture-session162.sh from the s161 form (Session 162 — the
110th Mode C audit cycle, the insert-branch honest completion +
text-tool sibling promotion + phantom-freehand correction cycle). The
exact convention: 24 raw diff lines (the 10-line s162 header replacing
the 10-line s161 form + the log/session pair's +/- lines — the honest
count, the s154..s161 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s162.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session161.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s162 form
    # replacing the 10-line s161 form
    (
        """# Session 161 screenshot capture — the standard set re-captured on
# the S161 code (the pagehide out-of-order registration + the
# insert-shape keyboard surface + the picker gesture tokens: the
# 109th audit's combined 0C/0H/0M/1L/3I census — the pagehide
# out-of-order residual (L161-A-L1) registered with the unsound-skip
# correction, the insert-shape keyboard gap (the S160-C follow-up)
# closed by the S161-B superset, the line-height form map and the
# isolate posture registered, the picker token family closed — the
# standard set re-taken at the S160 delivery + the S161 remediation
# (one view + one panel + one lib; zero parity exposure)""",
        """# Session 162 screenshot capture — the standard set re-captured on
# the S162 code (the insert-branch honest completion + the text-tool
# sibling promotion + the phantom-freehand correction: the 110th
# audit's combined 0C/0H/0M/3L/0I census — the Insert branch's raw
# x/y (L162-A-L1) clamped in the draw commit's own form and the
# discarded null return (L162-A-L3) toasted per the S61-F contract,
# the text-tool unregistered sibling promoted, the phantom-freehand
# citation corrected at the seam — the standard set re-taken at the
# S161 delivery + the S162 remediation (two editor files; zero
# parity exposure)""",
    ),
    ("digma-capture161.log", "digma-capture162.log"),
    ('S="agent-browser --session clone161"', 'S="agent-browser --session clone162"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session162.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session162.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s162 header): {len(diff)}")

# residue check
for residue in ("capture161", "clone161", "S161 code", "109th audit", "1L/3I", "L161-A-L1", "S161-B superset"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session162.sh")
print("capture-session162.sh: residue scan clean")
