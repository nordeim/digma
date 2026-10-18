#!/usr/bin/env python3
"""Derive capture-session155.sh from the s154 form (Session 155 — the
103rd Mode C audit cycle, the census-enumeration completion + env-census
citation-repair cycle). The exact convention: 24 raw diff lines (the
10-line s155 header replacing the 10-line s154 form + the log/session
pair's +/- lines — the honest count, the s154 cycle's own 24).

Run from the repo root:  python3 scripts/derive-capture-s155.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session154.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s155 form
    # replacing the 10-line s154 form
    (
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
        """# Session 155 screenshot capture — the standard set re-captured on
# the S155 code (the census-enumeration completion + the env-census
# citation repair: the 103rd audit's combined 0C/0H/0M/0L/2I census
# — the first all-Informational census — the addElements enumeration
# residual (A155-I1) closed by the S155-A registration comments at
# the arm + the markSaved family exclusion census (comment-only,
# zero behavioral change) and the s154-B env-census per-var defect
# (B155-I1) registered by the bracketed worklog note — the standard
# set re-taken at the S154 delivery + the S155 remediation (one
# source file edited, comments only; zero parity exposure)""",
    ),
    ("digma-capture154.log", "digma-capture155.log"),
    ('S="agent-browser --session clone154"', 'S="agent-browser --session clone155"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session155.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session155.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s155 header): {len(diff)}")

# residue check
for residue in ("capture154", "clone154", "S154 code", "102nd audit", "selectedIds identity-churn completion", "A154-I2"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session155.sh")
print("capture-session155.sh: residue scan clean")
