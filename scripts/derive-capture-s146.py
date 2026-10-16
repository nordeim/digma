#!/usr/bin/env python3
"""Derive capture-session146.sh from the s145 form (Session 146 — the
94th Mode C audit cycle, the first source-carrying cycle since S128).
The exact convention: 25 raw diff lines (the 10-line s145 header
replaced by the 11-line s146 form + the log/session pair's +/- lines).

Run from the repo root:  python3 scripts/derive-capture-s146.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session145.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 11-line s146 form
    # replacing the 10-line s145 form (10 removed + 11 added + the
    # log/session pair's +/- lines = 25)
    (
        """# Session 145 screenshot capture — the standard set re-captured on
# the S145 code (the enum-completion/scope/docset/filter
# registration pass: the 93rd audit's combined 0C/0H/0M/0L/4I
# census — A145-I1 the sanctioned-set enumeration gap (the s144
# note's "the two" omitting the S65-A measure and the S111-B
# adoption settle), A145-I2 the template-literal scope, B145-I1
# the count doc set, B145-I2 the smoke filter — all record-only,
# the worklog's four bracketed s145 notes riding the spec's pins;
# no source file edited, the all-registration shape — the standard
# set re-taken at the S144 delivery + S145""",
        """# Session 146 screenshot capture — the standard set re-captured on
# the S146 code (the e2e-fixed-sleep-race/thumbnail-line-clip/
# avatar-code-point/duplicate-census pass: the 94th audit's
# combined 0C/0H/1M/3L/4I census — B146-M1 the e2e fixed-sleep
# race (the S77-B poll + the autosave-race causal API poll),
# A146-L2 the thumbnail line-clip (the text-gated overflow
# ternary), A146-L1 the avatar code-point spread (five sites +
# three honest prior-spec repairs), A146-I1 the duplicate census
# (the S95-B posture survives, the retirement reverted),
# A146-I2/I3 the accepted postures — the standard set re-taken
# at the S145 delivery + S146""",
    ),
    ("digma-capture145.log", "digma-capture146.log"),
    ('S="agent-browser --session clone145"', 'S="agent-browser --session clone146"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session146.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session146.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture145", "clone145", "S145 code", "93rd audit"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session146.sh")
print("residue scan clean")
