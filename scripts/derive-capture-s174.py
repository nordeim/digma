#!/usr/bin/env python3
"""Derive capture-session174.sh from the s173 form (Session 174 — the
122nd Mode C audit cycle, the below-threshold + posture-precision +
coordinate-next-generation registrations cycle). The exact convention:
24 raw diff lines (the 10-line s174 header replacing the 10-line s173
form + the log/session pair's +/- lines — the honest count, the
s154..s173 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s174.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session173.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s174 form
    # replacing the 10-line s173 form
    (
        """# Session 173 screenshot capture — the standard set re-captured on
# the S173 code (the below-threshold + directive-side + posture-
# precision registrations cycle: the 121st audit's combined
# 0C/0H/0M/0L/6I census — a ZERO-SOURCE-FINDING all-Informational
# cycle, the SIXTH consecutive STAYS (the layer STAYS 14,307), the
# comment-truth sampling 141 TRUE / 0 FALSE (the eighth consecutive
# zero-false census), the deferral premises holding their 47th
# consecutive cycle — the standard set re-taken at the S172
# delivery + the S173 remediation (zero parity exposure — the
# phantom-rule datum registered, never a rendered movement class)""",
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
    ),
    ("digma-capture173.log", "digma-capture174.log"),
    ('S="agent-browser --session clone173"', 'S="agent-browser --session clone174"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session174.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session174.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s174 header): {len(diff)}")

# residue check (only the s173-specific forms are residues; the new
# header's own "141 TRUE / 0 FALSE" / "48th" spellings are the
# s174 forms, never residues — the "at the S173 delivery" phrase is
# the new header's own naming of the parent delivery)
for residue in ("capture173", "clone173", "S173 code", "121st audit", "the SIXTH consecutive", "the S172 delivery + the S173 remediation"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session174.sh")
print("capture-session174.sh: residue scan clean")
