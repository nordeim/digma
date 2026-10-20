#!/usr/bin/env python3
"""Derive capture-session163.sh from the s162 form (Session 163 — the
111th Mode C audit cycle, the stale line-citation reword + phantom
route-mock census reword cycle). The exact convention: 24 raw diff
lines (the 10-line s163 header replacing the 10-line s162 form + the
log/session pair's +/- lines — the honest count, the s154..s162
cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s163.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session162.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s163 form
    # replacing the 10-line s162 form
    (
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
        """# Session 163 screenshot capture — the standard set re-captured on
# the S163 code (the stale line-citation reword + the phantom
# route-mock census reword: the 111th audit's combined 0C/0H/0M/2L/0I
# census — the two staled numeric in-file citations (L163-A-L1)
# reworded onto the S160-D relative form ("the draw commit below" /
# "the commit above"), the phantom "route MOCKS" census (B163-L1)
# corrected onto the live 12-site form — both deliveries
# comment-only with zero rendered movement — the standard set
# re-taken at the S162 delivery + the S163 remediation (two
# comment-only files; zero parity exposure)""",
    ),
    ("digma-capture162.log", "digma-capture163.log"),
    ('S="agent-browser --session clone162"', 'S="agent-browser --session clone163"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session163.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session163.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s163 header): {len(diff)}")

# residue check
for residue in ("capture162", "clone162", "S162 code", "110th audit", "3L/0I", "L162-A-L1", "L162-A-L3", "phantom-freehand"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session163.sh")
print("capture-session163.sh: residue scan clean")
