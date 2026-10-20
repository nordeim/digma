#!/usr/bin/env python3
"""Derive capture-session167.sh from the s166 form (Session 167 — the
115th Mode C audit cycle, the errorTitle pair completion cycle). The exact
convention: 24 raw diff lines (the 10-line s167 header replacing the
10-line s166 form + the log/session pair's +/- lines — the honest count,
the s154..s166 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s167.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session166.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s167 form
    # replacing the 10-line s166 form
    (
        """# Session 166 screenshot capture — the standard set re-captured on
# the S166 code (the write-set arithmetic-closure correction
# registration cycle: the 114th audit's combined 0C/0H/0M/0L/1I
# census — a ONE-INFORMATIONAL cycle, the B166-I-1 e2e write-set
# phrase corrected onto the standing coherent census (19 + 1 + 5 =
# 25), the comment-truth sampling 142 TRUE / 0 FALSE (the second
# zero-false census), the deferral premises holding their 39th
# consecutive cycle — the cycle's registrations worklog-only with
# ZERO source changes — the standard set re-taken at the S165
# delivery + the S166 registrations (zero parity exposure by construction)""",
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
    ),
    ("digma-capture166.log", "digma-capture167.log"),
    ('S="agent-browser --session clone166"', 'S="agent-browser --session clone167"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session167.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session167.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s167 header): {len(diff)}")

# residue check (only the s166-specific forms are residues; the new
# header's own "third zero-false census" / "40th" spellings are the
# s167 forms, never residues — and ONE-LOW-ONE-INFORMATIONAL is NOT
# a residue marker because it contains the s166 substring)
for residue in ("capture166", "clone166", "S166 code", "114th audit", "B166-I-1", "19 + 1 + 5", "second zero-false", "39th consecutive", "worklog-only"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session167.sh")
print("capture-session167.sh: residue scan clean")
