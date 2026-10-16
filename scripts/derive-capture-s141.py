#!/usr/bin/env python3
"""Derive capture-session141.sh from the s140 form (Session 141 — the
89th Mode C audit cycle). The exact convention: 25 raw diff lines
(the 11-line s140 header replaced by the 10-line s141 form + the
log/session pair's +/- lines).

Run from the repo root:  python3 scripts/derive-capture-s141.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session140.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — 10 lines replacing the
    # s140 form's 11 (11 removed + 10 added + the log/session pair's
    # +/- lines = 25)
    (
        """# Session 140 screenshot capture — the standard set re-captured on the
# S140 code (the frozen-record/count-pair/coordinate-liveness
# registration pass's own continuation: the S140-A frozen-record
# census-scoping registration record-only (the worklog's bracketed
# s140-frozen-record-census-note names the list beside the frozen
# count), the S140-B count-pair and S140-C coordinate-liveness
# registrations likewise record-only (the worklog's bracketed
# notes + the spec's pins — zero journey surfaces touched, zero
# source files edited, the all-registration shape carried) — the
# standard capture set's forms riding unchanged on the remediated
# tree
""",
        """# Session 141 screenshot capture — the standard set re-captured on
# the S141 code (the keepalive-re-entry/range-overcover registration
# pass's own continuation: the S141-A keepalive re-entry race and the
# S141-B frozen-record range-overcover registrations both record-only
# (the worklog's bracketed s141-keepalive-re-entry-note +
# s141-range-overcover-note + the spec's acceptance-home and
# loop-span pins — zero journey surfaces touched, zero source files
# edited, the all-registration shape carried) — the standard
# capture set's forms riding unchanged on the remediated
# tree at the S141 delivery
""",
    ),
    ("digma-capture140.log", "digma-capture141.log"),
    ('S="agent-browser --session clone140"', 'S="agent-browser --session clone141"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session141.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session141.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture140", "clone140"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session141.sh")
print("residue scan clean")
