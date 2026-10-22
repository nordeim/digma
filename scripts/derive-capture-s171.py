#!/usr/bin/env python3
"""Derive capture-session171.sh from the s170 form (Session 171 — the
119th Mode C audit cycle, the dependency-bump doc-truth repair +
dependency-bump registration cycle). The exact convention: 24 raw diff
lines (the 10-line s171 header replacing the 10-line s170 form + the
log/session pair's +/- lines — the honest count, the s154..s170
cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s171.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session170.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s171 form
    # replacing the 10-line s170 form
    (
        """# Session 170 screenshot capture — the standard set re-captured on
# the S170 code (the count-truth registration + below-threshold/
# premises registrations cycle: the 118th audit's combined
# 0C/0H/0M/0L/4I census — a FOUR-INFORMATIONAL cycle, the second
# consecutive, the FIRST ALL-REGISTRATION cycle since S166 (zero
# source changes, the layer STAYS 14,307 — the third consecutive
# STAYS), the comment-truth sampling 141 TRUE / 0 FALSE (the fifth
# consecutive zero-false census), the deferral premises holding
# their 43rd consecutive cycle — the standard set re-taken at the
# S169 delivery + the S170 remediation (zero parity exposure)""",
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
    ),
    ("digma-capture170.log", "digma-capture171.log"),
    ('S="agent-browser --session clone170"', 'S="agent-browser --session clone171"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session171.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session171.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s171 header): {len(diff)}")

# residue check (only the s170-specific forms are residues; the new
# header's own "141 TRUE / 0 FALSE" / "44th" spellings are the
# s171 forms, never residues)
for residue in ("capture170", "clone170", "S170 code", "118th audit", "FIRST ALL-REGISTRATION", "the third consecutive", "the S169 delivery + the S170 remediation"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session171.sh")
print("capture-session171.sh: residue scan clean")
