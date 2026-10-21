#!/usr/bin/env python3
"""Derive capture-session170.sh from the s169 form (Session 170 — the
118th Mode C audit cycle, the count-truth registration + below-threshold/
premises registrations cycle). The exact convention: 24 raw diff lines
(the 10-line s170 header replacing the 10-line s169 form + the
log/session pair's +/- lines — the honest count, the s154..s169
cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s170.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session169.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s170 form
    # replacing the 10-line s169 form
    (
        """# Session 169 screenshot capture — the standard set re-captured on
# the S169 code (the docblock era-scoping correction + binding-shadow
# rename cycle: the 117th audit's combined 0C/0H/0M/0L/4I census —
# a FOUR-INFORMATIONAL cycle, the cleanest census form since S165,
# the third consecutive source-carrying cycle (call.ts 76 -> 80
# OUTSIDE the layer + the line-neutral route rename, the layer STAYS
# 14,307), the comment-truth sampling 142 TRUE / 0 FALSE (the
# fourth zero-false census), the deferral premises holding their
# 42nd consecutive cycle — the standard set re-taken at the S168
# delivery + the S169 remediation (zero parity exposure)""",
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
    ),
    ("digma-capture169.log", "digma-capture170.log"),
    ('S="agent-browser --session clone169"', 'S="agent-browser --session clone170"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session170.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session170.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s170 header): {len(diff)}")

# residue check (only the s169-specific forms are residues; the new
# header's own "141 TRUE / 0 FALSE" / "43rd" spellings are the
# s170 forms, never residues)
for residue in ("capture169", "clone169", "S169 code", "117th audit", "A169-I-2", "142 TRUE / 0 FALSE", "42nd consecutive", "76 -> 80"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session170.sh")
print("capture-session170.sh: residue scan clean")
