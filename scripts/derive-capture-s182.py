#!/usr/bin/env python3
"""Derive capture-session182.sh from the s181 form (Session 182 — the
130th Mode C audit cycle, the same-vocabulary-hold schema-comment-
lockstep + eleventh-generation-corrected + F169 registrations cycle).
The honest raw-diff convention: the s182 header replacing the s181
header + the log/session pair (the three AUTH_SECRET harness-boot
lines carried unchanged from the S181-C cascade — zero new boot lines
this cycle, the zero-source-change capture form).

Run from the repo root:  python3 scripts/derive-capture-s182.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session181.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 12-line s182 form
    # replacing the 12-line s181 form
    (
        """# Session 181 screenshot capture — the standard set re-captured on
# the S181 code (the new-skill-lens cursor + hashed-reset +
# auth-secret-fail-hard remediations + tenth-generation + F168
# registrations cycle: the 129th audit's 0C/0H/0M/3L/7I census —
# the first non-Informational members in six cycles, all three Lows
# surfaced by the NEW master skill's contract vocabulary, the layer
# total MOVING 14,307 -> 14,313 (the FIRST movement in fourteen
# cycles — the F40 rider engaging, a deliberate remediation), the
# comment-truth 22 TRUE / 0 FALSE (the zero-false direction holding
# its sixth consecutive cycle), the deferral premises holding their
# 55th consecutive cycle — the standard set re-taken at the S180
# delivery + the S181 remediation (the cursor affordance + the two auth hardenings)""",
        """# Session 182 screenshot capture — the standard set re-captured on
# the S182 code (the same-vocabulary-hold schema-comment-lockstep +
# eleventh-generation-corrected + F169 registrations cycle: the 130th
# audit's 0C/0H/0M/0L/8I census — a ZERO-SOURCE-FINDING
# all-Informational cycle under the SAME master-skill vocabulary,
# the layer total STAYING 14,313 (the first STAYS re-quote of the
# post-S181 figure), the comment-truth 22+14 TRUE / 0 FALSE (the
# zero-false direction holding its seventh consecutive cycle), the
# deferral premises holding their 56th consecutive cycle — the
# standard set re-taken at the S181 delivery + the S182 remediation
# (the schema-comment lockstep — zero parity exposure)""",
    ),
    ("digma-capture181.log", "digma-capture182.log"),
    ('S="agent-browser --session clone181"', 'S="agent-browser --session clone182"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session182.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session182.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the 12-line header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check (only the s181-specific forms are residues; the new
# header's own "at the S181 delivery" phrase is the s182 form's
# naming of the parent delivery, never a residue)
for residue in ("capture181", "clone181", "S181 code", "129th audit", "3L/7I", "the sixth consecutive", "the S180 delivery + the S181 remediation", "55th consecutive", "14,307 -> 14,313"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session182.sh")
print("capture-session182.sh: residue scan clean")
