#!/usr/bin/env python3
"""Derive capture-session176.sh from the s175 form (Session 176 — the
124th Mode C audit cycle, the dispatch-figure correction + continuity +
fifth-generation coordinate registrations cycle). The exact convention:
24 raw diff lines (the 10-line s176 header replacing the 10-line s175
form + the log/session pair's +/- lines — the honest count, the
s154..s175 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s176.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session175.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s176 form
    # replacing the 10-line s175 form
    (
        """# Session 175 screenshot capture — the standard set re-captured on
# the S175 code (the comment-truth repair + continuity + coordinate-
# fourth-generation registrations cycle: the 123rd audit's
# 0C/0H/0M/1L/7I combined census — the first source-surface finding
# since S169, the EIGHTH consecutive STAYS figure (the layer STAYING
# 14,307 via the line-count-neutral comment reword), the comment-truth
# sampling 140 TRUE / 1 FALSE (the nine-cycle zero-false streak
# ended), the deferral premises holding their 49th consecutive
# cycle — the standard set re-taken at the S174 delivery + the
# S175 remediation (zero parity exposure — the repaired clause never a rendered truth)""",
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
    ),
    ("digma-capture175.log", "digma-capture176.log"),
    ('S="agent-browser --session clone175"', 'S="agent-browser --session clone176"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session176.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session176.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s176 header): {len(diff)}")

# residue check (only the s175-specific forms are residues; the new
# header's own "141 TRUE / 0 FALSE" / "50th" spellings are the
# s176 forms, never residues — the "at the S175 delivery" phrase is
# the new header's own naming of the parent delivery)
for residue in ("capture175", "clone175", "S175 code", "123rd audit", "the EIGHTH consecutive", "the S174 delivery + the S175 remediation"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session176.sh")
print("capture-session176.sh: residue scan clean")
