#!/usr/bin/env python3
"""Derive capture-session165.sh from the s164 form (Session 165 — the
113th Mode C audit cycle, the fifth zero-finding census registration
cycle). The exact convention: 24 raw diff lines (the 10-line s165
header replacing the 10-line s164 form + the log/session pair's +/-
lines — the honest count, the s154..s164 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s165.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session164.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s165 form
    # replacing the 10-line s164 form
    (
        """# Session 164 screenshot capture — the standard set re-captured on
# the S164 code (the cross-file citation + census-scoping + honest-
# census comment-truth pass: the 112th audit's combined 0C/0H/0M/3L/4I
# census — the Insert center math's numeric cross-file citation
# (A164-L-1) reworded onto the seam-named form, the panel's census
# (A164-L-2) scoped onto the file-local reading, the false "NON-
# creation" phrase (B164-L1) corrected onto the honest projects-POST
# census — all five deliveries comment-only with zero rendered
# movement — the standard set re-taken at the S163 delivery + the
# S164 remediation (five comment-only files; zero parity exposure)""",
        """# Session 165 screenshot capture — the standard set re-captured on
# the S165 code (the fifth zero-finding census registration cycle:
# the 113th audit's combined 0C/0H/0M/0L/0I census — THE FIFTH zero-
# finding census in the 165-plan history, the comment-truth sampling
# 140 TRUE / 0 FALSE (the first zero-false census), the deferral
# premises holding their 38th consecutive cycle, the five below-
# threshold observations registered — the cycle's two registrations
# worklog-only with ZERO source changes — the standard set re-taken
# at the S164 delivery + the S165 registrations (zero source files
# touched; zero parity exposure by construction)""",
    ),
    ("digma-capture164.log", "digma-capture165.log"),
    ('S="agent-browser --session clone164"', 'S="agent-browser --session clone165"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session165.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session165.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s165 header): {len(diff)}")

# residue check (the "NON-" prefix is NOT a residue marker — the body's
# own "NON-MUTATING by construction" standing check at :2181 predates
# the s164 form; only the s164-specific forms are residues)
for residue in ("capture164", "clone164", "S164 code", "112th audit", "3L/4I", "A164-L-1", "cross-file citation", "NON-creation"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session165.sh")
print("capture-session165.sh: residue scan clean")
