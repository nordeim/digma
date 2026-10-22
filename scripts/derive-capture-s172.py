#!/usr/bin/env python3
"""Derive capture-session172.sh from the s171 form (Session 172 — the
120th Mode C audit cycle, the README noun-unit repair + below-threshold/
premises registrations cycle). The exact convention: 24 raw diff
lines (the 10-line s172 header replacing the 10-line s171 form + the
log/session pair's +/- lines — the honest count, the s154..s171
cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s172.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session171.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s172 form
    # replacing the 10-line s171 form
    (
        """# Session 171 screenshot capture — the standard set re-captured on
# the S171 code (the dependency-bump doc-truth repair + dependency-
# bump registration cycle: the 119th audit's combined
# 0C/0H/2M/3L/7I census — a ZERO-SOURCE-FINDING cycle, every
# actionable member on the dependency/doc surface, the layer STAYS
# 14,307 (the fourth consecutive STAYS), the comment-truth sampling
# 141 TRUE / 0 FALSE (the sixth consecutive zero-false census), the
# deferral premises holding their 44th consecutive cycle — the
# standard set re-taken at the S170 delivery + the S171 remediation
# (zero parity exposure)""",
        """# Session 172 screenshot capture — the standard set re-captured on
# the S172 code (the README noun-unit repair + the
# below-threshold/premises registrations cycle: the 120th audit's
# combined 0C/0H/0M/0L/5I census — a ZERO-SOURCE-FINDING
# all-Informational cycle, the FIFTH consecutive STAYS (the layer
# STAYS 14,307), the comment-truth sampling 141 TRUE / 0 FALSE (the
# seventh consecutive zero-false census), the deferral premises
# holding their 46th consecutive cycle — the standard set re-taken
# at the S171 delivery + the S172 remediation (zero parity
# exposure)""",
    ),
    ("digma-capture171.log", "digma-capture172.log"),
    ('S="agent-browser --session clone171"', 'S="agent-browser --session clone172"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session172.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session172.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s172 header): {len(diff)}")

# residue check (only the s171-specific forms are residues; the new
# header's own "141 TRUE / 0 FALSE" / "46th" spellings are the
# s172 forms, never residues — the "at the S171 delivery" phrase is
# the new header's own naming of the parent delivery)
for residue in ("capture171", "clone171", "S171 code", "119th audit", "the fourth consecutive", "the S170 delivery + the S171 remediation"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session172.sh")
print("capture-session172.sh: residue scan clean")
