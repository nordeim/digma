#!/usr/bin/env python3
"""Derive capture-session153.sh from the s152 form (Session 153 — the
101st Mode C audit cycle, the identity-churn-closure cycle). The exact
convention: 24 raw diff lines (the 10-line s153 header replacing the
10-line s152 form + the log/session pair's +/- lines — the honest
count, the s152 cycle's own 23 rode the 10-replacing-9 form).

Run from the repo root:  python3 scripts/derive-capture-s153.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session152.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s153 form
    # replacing the 10-line s152 form
    (
        """# Session 152 screenshot capture — the standard set re-captured on
# the S152 code (the UTF-16-slice-closure pass: the 100th audit's
# combined 0C/0H/0M/0L/0I census — the SECOND zero-finding cycle
# after S143's first, the F138 guard's first verification PASSED
# (the s151 plan 6/6 ticked at its own delivery commit eabe08c),
# B148-I2 closed by the S152-A surrogate-pair-safe truncation seam
# (truncateUtf16Safe at the nine censused members) — the standard
# set re-taken at the S151 delivery + the S152 remediation (five
# source files edited: validation, team, register, duplicate, ai-
# assistant; zero parity exposure — astral input only)""",
        """# Session 153 screenshot capture — the standard set re-captured on
# the S153 code (the identity-churn-closure pass: the 101st audit's
# combined 0C/0H/0M/0L/0I census — the THIRD zero-finding cycle
# after S143's and S152's, the F138 guard's second verification
# PASSED (the s152 plan 6/6 ticked at its own delivery commit
# b916639), A117-I1 + A120-I1 closed by the S153-A identity seams
# (sameIdSequence + reuseStableElements at the seven censused store
# members) — the standard set re-taken at the S152 delivery + the
# S153 remediation (two source files edited; zero parity exposure —
# content-identical commits only)""",
    ),
    ("digma-capture152.log", "digma-capture153.log"),
    ('S="agent-browser --session clone152"', 'S="agent-browser --session clone153"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session153.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session153.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s153 header): {len(diff)}")

# residue check
for residue in ("capture152", "clone152", "S152 code", "100th audit", "B148-I2", "UTF-16-slice-closure pass"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session153.sh")
print("capture-session153.sh: residue scan clean")
