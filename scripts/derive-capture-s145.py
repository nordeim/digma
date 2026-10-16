#!/usr/bin/env python3
"""Derive capture-session145.sh from the s144 form (Session 145 — the
93rd Mode C audit cycle). The exact convention: 25 raw diff lines
(the 11-line s144 header replaced by the 10-line s145 form + the
log/session pair's +/- lines).

Run from the repo root:  python3 scripts/derive-capture-s145.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session144.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s145 form
    # replacing the 11-line s144 form (11 removed + 10 added + the
    # log/session pair's +/- lines = 25)
    (
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
        """# Session 145 screenshot capture — the standard set re-captured on
# the S145 code (the enum-completion/scope/docset/filter
# registration pass: the 93rd audit's combined 0C/0H/0M/0L/4I
# census — A145-I1 the sanctioned-set enumeration gap (the s144
# note's "the two" omitting the S65-A measure and the S111-B
# adoption settle), A145-I2 the template-literal scope, B145-I1
# the count doc set, B145-I2 the smoke filter — all record-only,
# the worklog's four bracketed s145 notes riding the spec's pins;
# no source file edited, the all-registration shape — the standard
# set re-taken at the S144 delivery + S145
""",
    ),
    ("digma-capture144.log", "digma-capture145.log"),
    ('S="agent-browser --session clone144"', 'S="agent-browser --session clone145"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session145.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session145.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture144", "clone144", "S144 code", "92nd audit"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session145.sh")
print("residue scan clean")
