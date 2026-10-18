#!/usr/bin/env python3
"""Derive capture-session154.sh from the s153 form (Session 154 — the
102nd Mode C audit cycle, the selectedIds identity-churn completion +
count-truth repair cycle). The exact convention: 24 raw diff lines (the
10-line s154 header replacing the 10-line s153 form + the log/session
pair's +/- lines — the honest count, the s153 cycle's own 24).

Run from the repo root:  python3 scripts/derive-capture-s154.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session153.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s154 form
    # replacing the 10-line s153 form
    (
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
        """# Session 154 screenshot capture — the standard set re-captured on
# the S154 code (the selectedIds identity-churn completion + the
# count-truth repair: the 102nd audit's combined 0C/0H/0M/1L/1I
# census — the layer-total defect dual-observed (B154-L1/A154-I1,
# the s153 collateral's aggregate understated by the +60 its own
# decomposition names) + the three-arm residual (A154-I2) closed by
# the S154-A sameIdSequence keep-form at undo/redo/restoreSnapshot —
# the standard set re-taken at the S153 delivery + the S154
# remediation (one source file edited; zero parity exposure — the
# selection fully surviving keeps its reference only)""",
    ),
    ("digma-capture153.log", "digma-capture154.log"),
    ('S="agent-browser --session clone153"', 'S="agent-browser --session clone154"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session154.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session154.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s154 header): {len(diff)}")

# residue check
for residue in ("capture153", "clone153", "S153 code", "101st audit", "identity-churn-closure pass", "A117-I1"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session154.sh")
print("capture-session154.sh: residue scan clean")
