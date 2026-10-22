#!/usr/bin/env python3
"""Derive capture-session175.sh from the s174 form (Session 175 — the
123rd Mode C audit cycle, the comment-truth repair + continuity +
coordinate-fourth-generation registrations cycle). The exact convention:
24 raw diff lines (the 10-line s175 header replacing the 10-line s174
form + the log/session pair's +/- lines — the honest count, the
s154..s174 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s175.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session174.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s175 form
    # replacing the 10-line s174 form
    (
        """# Session 174 screenshot capture — the standard set re-captured on
# the S174 code (the below-threshold + posture-precision + coordinate-
# next-generation registrations cycle: the 122nd audit's
# 0C/0H/0M/0L/6I combined census — a ZERO-SOURCE-FINDING all-Informational
# cycle, the SEVENTH consecutive STAYS (the layer STAYS 14,307), the
# comment-truth sampling 141 TRUE / 0 FALSE (the ninth consecutive
# zero-false census), the deferral premises holding their 48th
# consecutive cycle — the standard set re-taken at the S173
# delivery + the S174 remediation (zero parity exposure — the
# counting-unit datum registered, never a rendered movement class)""",
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
    ),
    ("digma-capture174.log", "digma-capture175.log"),
    ('S="agent-browser --session clone174"', 'S="agent-browser --session clone175"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session175.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session175.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s175 header): {len(diff)}")

# residue check (only the s174-specific forms are residues; the new
# header's own "140 TRUE / 1 FALSE" / "49th" spellings are the
# s175 forms, never residues — the "at the S174 delivery" phrase is
# the new header's own naming of the parent delivery)
for residue in ("capture174", "clone174", "S174 code", "122nd audit", "the SEVENTH consecutive", "the S173 delivery + the S174 remediation"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session175.sh")
print("capture-session175.sh: residue scan clean")
