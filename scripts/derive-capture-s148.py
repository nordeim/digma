#!/usr/bin/env python3
"""Derive capture-session148.sh from the s147 form (Session 148 — the
96th Mode C audit cycle, the source-carrying cycle after S147's
all-registration pass). The exact convention: 25 raw diff lines (the
10-line s147 header replaced by the 11-line s148 form + the
log/session pair's +/- lines).

Run from the repo root:  python3 scripts/derive-capture-s148.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session147.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 11-line s148 form
    # replacing the 10-line s147 form (10 removed + 11 added + the
    # log/session pair's +/- lines = 25)
    (
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
        """# Session 148 screenshot capture — the standard set re-captured on
# the S148 code (the content-type-csrf-gate/marquee-form-alignment/
# deleteTeam-errorTitle/registration-batch pass: the 96th audit's
# combined 0C/0H/0M/1L/7I census — B148-L1 the Content-Type CSRF
# gate at the readBoundedJson seam (the login-CSRF closure, the
# F135 parse-gate-vs-transport-gate doctrine), A148-I1 the marquee
# preview's two-term threshold (the F88 form-alignment), A148-I2
# the deleteTeam errorTitle completion (the S71-A family), the
# five-posture registration batch (the s148-residuals-note) — the
# standard set re-taken at the S147 delivery + the S148 remediation
# (three source files edited: validation, canvas, teams-view)""",
    ),
    ("digma-capture147.log", "digma-capture148.log"),
    ('S="agent-browser --session clone147"', 'S="agent-browser --session clone148"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session148.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session148.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture147", "clone147", "S147 code", "95th audit"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session148.sh")
print("residue scan clean")
