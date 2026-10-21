#!/usr/bin/env python3
"""Derive capture-session168.sh from the s167 form (Session 168 — the
116th Mode C audit cycle, the call() docblock scope correction cycle). The
exact convention: 24 raw diff lines (the 10-line s168 header replacing the
10-line s167 form + the log/session pair's +/- lines — the honest count,
the s154..s167 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s168.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session167.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s168 form
    # replacing the 10-line s167 form
    (
        """# Session 167 screenshot capture — the standard set re-captured on
# the S167 code (the errorTitle pair completion cycle: the 115th
# audit's combined 0C/0H/0M/1L/1I census — a ONE-LOW-ONE-
# INFORMATIONAL cycle, the first source-carrying cycle since S162
# (teams-view +12, the layer 14,295 -> 14,307), the comment-truth
# sampling 142 TRUE / 0 FALSE (the third zero-false census), the
# deferral premises holding their 40th consecutive cycle — the
# standard set re-taken at the S166 delivery + the S167
# remediation (the errorTitle pair completion + the registration
# pair; zero parity exposure by construction)""",
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
    ),
    ("digma-capture167.log", "digma-capture168.log"),
    ('S="agent-browser --session clone167"', 'S="agent-browser --session clone168"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session168.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session168.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s168 header): {len(diff)}")

# residue check (only the s167-specific forms are residues; the new
# header's own "141 TRUE / 1 FALSE" / "41st" spellings are the
# s168 forms, never residues — and ONE-LOW-TWO-INFORMATIONAL is NOT
# a residue marker because it contains the s167 substring)
for residue in ("capture167", "clone167", "S167 code", "115th audit", "A167-L-1", "errorTitle pair completion + the", "third zero-false", "40th consecutive"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session168.sh")
print("capture-session168.sh: residue scan clean")
