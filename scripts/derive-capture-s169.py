#!/usr/bin/env python3
"""Derive capture-session169.sh from the s168 form (Session 169 — the
117th Mode C audit cycle, the docblock era-scoping correction +
binding-shadow rename cycle). The exact convention: 24 raw diff lines
(the 10-line s169 header replacing the 10-line s168 form + the
log/session pair's +/- lines — the honest count, the s154..s168
cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s169.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session168.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s169 form
    # replacing the 10-line s168 form
    (
        """# Session 168 screenshot capture — the standard set re-captured on
# the S168 code (the call() docblock scope correction cycle: the
# 116th audit's combined 0C/0H/0M/1L/2I census — a ONE-LOW-TWO-
# INFORMATIONAL cycle, the second consecutive source-carrying cycle
# (call.ts 59 -> 76 OUTSIDE the layer, the layer STAYS 14,307), the
# comment-truth sampling 142 with 141 TRUE / 1 FALSE (the FALSE
# member the finding itself, fixed in-cycle), the deferral premises
# holding their 41st consecutive cycle — the standard set re-taken
# at the S167 delivery + the S168 remediation (the docblock scope
# correction + the registration pair; zero parity exposure)""",
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
    ),
    ("digma-capture168.log", "digma-capture169.log"),
    ('S="agent-browser --session clone168"', 'S="agent-browser --session clone169"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session169.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session169.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s169 header): {len(diff)}")

# residue check (only the s168-specific forms are residues; the new
# header's own "142 TRUE / 0 FALSE" / "42nd" spellings are the
# s169 forms, never residues)
for residue in ("capture168", "clone168", "S168 code", "116th audit", "A168-L-1", "141 TRUE / 1 FALSE", "41st consecutive", "59 -> 76"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session169.sh")
print("capture-session169.sh: residue scan clean")
