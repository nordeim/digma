#!/usr/bin/env python3
"""Derive capture-session177.sh from the s176 form (Session 177 — the
125th Mode C audit cycle, the continuity + sixth-generation coordinate +
config-forward-compat + commit-message event-naming registrations
cycle). The exact convention: 24 raw diff lines (the 10-line s177
header replacing the 10-line s176 form + the log/session pair's +/-
lines — the honest count, the s154..s176 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s177.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session176.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s177 form
    # replacing the 10-line s176 form
    (
        """# Session 176 screenshot capture — the standard set re-captured on
# the S176 code (the dispatch-figure correction + continuity +
# fifth-generation coordinate registrations cycle: the 124th audit's
# 0C/0H/0M/0L/7I combined census — a ZERO-SOURCE-FINDING all-
# Informational cycle, the NINTH consecutive STAYS figure (the layer
# STAYING 14,307 via the zero-source-change form), the comment-truth
# sampling 141 TRUE / 0 FALSE (the zero-false census restored), the
# deferral premises holding their 50th consecutive cycle — the
# standard set re-taken at the S175 delivery + the S176 remediation
# (zero parity exposure — the corrected figure a dispatch-record member)""",
        """# Session 177 screenshot capture — the standard set re-captured on
# the S177 code (the continuity + sixth-generation coordinate +
# config-lever + commit-message registrations cycle: the 125th
# audit's 0C/0H/0M/0L/10I combined census — the SECOND consecutive
# zero-source-finding all-Informational cycle, the TENTH consecutive
# STAYS figure (the layer STAYING 14,307 via the zero-source-change
# form), the comment-truth sampling 141 TRUE / 0 FALSE (the zero-
# false census holding its second consecutive cycle), the deferral
# premises holding their 51st consecutive cycle — the standard set
# re-taken at the S176 delivery + the S177 remediation (zero parity exposure — every new member a registration member)""",
    ),
    ("digma-capture176.log", "digma-capture177.log"),
    ('S="agent-browser --session clone176"', 'S="agent-browser --session clone177"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session177.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session177.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s177 header): {len(diff)}")

# residue check (only the s176-specific forms are residues; the new
# header's own "141 TRUE / 0 FALSE" / "51st" spellings are the
# s177 forms, never residues — the "at the S176 delivery" phrase is
# the new header's own naming of the parent delivery)
for residue in ("capture176", "clone176", "S176 code", "124th audit", "the NINTH consecutive", "the S175 delivery + the S176 remediation"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session177.sh")
print("capture-session177.sh: residue scan clean")
