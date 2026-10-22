#!/usr/bin/env python3
"""Derive capture-session173.sh from the s172 form (Session 173 — the
121st Mode C audit cycle, the below-threshold + directive-side +
posture-precision registrations cycle). The exact convention: 24 raw
diff lines (the 10-line s173 header replacing the 10-line s172 form +
the log/session pair's +/- lines — the honest count, the s154..s172
cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s173.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session172.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s173 form
    # replacing the 10-line s172 form
    (
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
    ),
    ("digma-capture172.log", "digma-capture173.log"),
    ('S="agent-browser --session clone172"', 'S="agent-browser --session clone173"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session173.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session173.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s173 header): {len(diff)}")

# residue check (only the s172-specific forms are residues; the new
# header's own "141 TRUE / 0 FALSE" / "47th" spellings are the
# s173 forms, never residues — the "at the S172 delivery" phrase is
# the new header's own naming of the parent delivery)
for residue in ("capture172", "clone172", "S172 code", "120th audit", "the FIFTH consecutive", "the S171 delivery + the S172 remediation"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session173.sh")
print("capture-session173.sh: residue scan clean")
