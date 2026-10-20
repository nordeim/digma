#!/usr/bin/env python3
"""Derive capture-session166.sh from the s165 form (Session 166 — the
114th Mode C audit cycle, the write-set arithmetic-closure correction
registration cycle). The exact convention: 24 raw diff lines (the
10-line s166 header replacing the 10-line s165 form + the log/session
pair's +/- lines — the honest count, the s154..s165 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s166.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session165.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s166 form
    # replacing the 10-line s165 form
    (
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
    ),
    ("digma-capture165.log", "digma-capture166.log"),
    ('S="agent-browser --session clone165"', 'S="agent-browser --session clone166"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session166.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session166.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s166 header): {len(diff)}")

# residue check (only the s165-specific forms are residues; the new
# header's own "zero-false census" / "39th" spellings are the s166
# forms, never residues)
for residue in ("capture165", "clone165", "S165 code", "113th audit", "fifth zero-", "FIFTH zero-", "140 TRUE", "38th consecutive", "first zero-false"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session166.sh")
print("capture-session166.sh: residue scan clean")
