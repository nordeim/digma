#!/usr/bin/env python3
"""Derive capture-session147.sh from the s146 form (Session 147 — the
95th Mode C audit cycle, the all-registration cycle after S146's
source-carrying pass). The exact convention: 25 raw diff lines (the
11-line s146 header replaced by the 10-line s147 form + the
log/session pair's +/- lines).

Run from the repo root:  python3 scripts/derive-capture-s147.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session146.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s147 form
    # replacing the 11-line s146 form (11 removed + 10 added + the
    # log/session pair's +/- lines = 25)
    (
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
        """# Session 147 screenshot capture — the standard set re-captured on
# the S147 code (the glyph-coordinate-re-anchor/sweep-enumeration-
# completion registration pass: the 95th audit's combined
# 0C/0H/0M/0L/2I census — A147-I1 the glyph-coordinate drift
# (the +9 shift re-anchored at content form, the effective-nine
# observation), B147-I1 the sweep-enumeration completion
# (session80:83 the 19th class-b member) — all record-only, the
# worklog's two bracketed s147 notes riding the spec's pins; no
# source file edited — the standard set re-taken at the S146
# delivery + S147""",
    ),
    ("digma-capture146.log", "digma-capture147.log"),
    ('S="agent-browser --session clone146"', 'S="agent-browser --session clone147"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session147.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session147.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture146", "clone146", "S146 code", "94th audit"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session147.sh")
print("residue scan clean")
