#!/usr/bin/env python3
"""Derive capture-session149.sh from the s148 form (Session 149 — the
97th Mode C audit cycle, the all-registration-plus-one-comment-token
cycle). The exact convention: 25 raw diff lines (the 11-line s148
header replaced by the 10-line s149 form + the log/session pair's
+/- lines).

Run from the repo root:  python3 scripts/derive-capture-s149.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session148.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s149 form
    # replacing the 11-line s148 form (11 removed + 10 added + the
    # log/session pair's +/- lines = 25)
    (
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
        """# Session 149 screenshot capture — the standard set re-captured on
# the S149 code (the citation-repair/glyph-re-anchor/sweep-completion
# registration pass: the 97th audit's combined 0C/0H/0M/0L/4I census
# — A149-I1 the S148-B comment's born-drifted citation repaired in
# place (the :503 commit above, the F136 born-verified-citation
# doctrine), A149-I2 the glyph-note re-anchor (the F134 class
# across cycles), B149-I1/B149-I2 the fixed-sleep-note completion
# (the :101 re-anchor + the promise-wrapped members) — the standard
# set re-taken at the S148 delivery + the S149 remediation (one
# comment token edited: canvas)""",
    ),
    ("digma-capture148.log", "digma-capture149.log"),
    ('S="agent-browser --session clone148"', 'S="agent-browser --session clone149"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session149.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session149.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture148", "clone148", "S148 code", "96th audit", "s148-residuals-note"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session149.sh")
print("residue scan clean")
