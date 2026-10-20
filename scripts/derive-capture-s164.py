#!/usr/bin/env python3
"""Derive capture-session164.sh from the s163 form (Session 164 — the
112th Mode C audit cycle, the cross-file citation + census-scoping +
honest-census comment-truth cycle). The exact convention: 24 raw diff
lines (the 10-line s164 header replacing the 10-line s163 form + the
log/session pair's +/- lines — the honest count, the s154..s163
cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s164.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session163.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s164 form
    # replacing the 10-line s163 form
    (
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
        """# Session 164 screenshot capture — the standard set re-captured on
# the S164 code (the cross-file citation + census-scoping + honest-
# census comment-truth pass: the 112th audit's combined 0C/0H/0M/3L/4I
# census — the Insert center math's numeric cross-file citation
# (A164-L-1) reworded onto the seam-named form, the panel's census
# (A164-L-2) scoped onto the file-local reading, the false "NON-
# creation" phrase (B164-L1) corrected onto the honest projects-POST
# census — all five deliveries comment-only with zero rendered
# movement — the standard set re-taken at the S163 delivery + the
# S164 remediation (five comment-only files; zero parity exposure)""",
    ),
    ("digma-capture163.log", "digma-capture164.log"),
    ('S="agent-browser --session clone163"', 'S="agent-browser --session clone164"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session164.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session164.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s164 header): {len(diff)}")

# residue check
for residue in ("capture163", "clone163", "S163 code", "111th audit", "2L/0I", "L163-A-L1", "route-mock census reword", "route MOCKS"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session164.sh")
print("capture-session164.sh: residue scan clean")
