#!/usr/bin/env python3
"""Derive capture-session144.sh from the s143 form (Session 144 — the
92nd Mode C audit cycle). The exact convention: 25 raw diff lines
(the 10-line s143 header replaced by the 11-line s144 form + the
log/session pair's +/- lines).

Run from the repo root:  python3 scripts/derive-capture-s144.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session143.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 11-line s144 form
    # replacing the 10-line s143 form (10 removed + 11 added + the
    # log/session pair's +/- lines = 25)
    (
        """# Session 143 screenshot capture — the standard set re-captured on
# the S143 code (the zero-finding-census/deferral-premises
# registration pass's own continuation: the 91st audit returned the
# combined 0C/0H/0M/0L/0I census, the first zero-finding census in
# the plan history, and the S143-B id-stable PUT deferral-premises
# registration — both record-only, the worklog's bracketed
# s143-clean-census-note + s143-id-stable-premises-note riding the
# spec's plan-history sweep and four-site premises pins; no journey
# surface touched and no source file edited, the all-registration
# shape — the standard set re-taken at the S142 delivery + S143
""",
        """# Session 144 screenshot capture — the standard set re-captured on
# the S144 code (the frozen-enum-gap/brief-pair-epoch registration
# pass's own continuation: the 92nd audit returned the combined
# 0C/0H/0M/0L/2I census — A144-I1 the frozen-record React-19
# enumeration gap (the s143-audit-A phrase omitting the S55-A
# useLayoutEffect measure and the S77-E async-prefix re-arm) and
# B144-I1 the brief-lineage split-epoch count pair (the 2025/204
# form never a live state) — both record-only, the worklog's
# bracketed s144-setstate-enum-note + s144-count-pair-epoch-note
# riding the spec's pins; no source file edited, the all-registration
# shape — the standard set re-taken at the S143 delivery + S144
""",
    ),
    ("digma-capture143.log", "digma-capture144.log"),
    ('S="agent-browser --session clone143"', 'S="agent-browser --session clone144"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session144.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session144.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture143", "clone143"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session144.sh")
print("residue scan clean")
