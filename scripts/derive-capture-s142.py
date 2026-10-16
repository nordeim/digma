#!/usr/bin/env python3
"""Derive capture-session142.sh from the s141 form (Session 142 — the
90th Mode C audit cycle). The exact convention: 25 raw diff lines
(the 10-line s141 header replaced by the 11-line s142 form + the
log/session pair's +/- lines).

Run from the repo root:  python3 scripts/derive-capture-s142.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session141.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — 11 lines replacing the
    # s141 form's 10 (10 removed + 11 added + the log/session pair's
    # +/- lines = 25)
    (
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
        """# Session 142 screenshot capture — the standard set re-captured on
# the S142 code (the path-scope/stop-row-floor/catch-scope
# registration pass's own continuation: the S142-A frozen-record
# path-scope overcover, the S142-B touch-floor ledger completeness,
# and the S142-C compressed-scope catch census registrations all
# record-only (the worklog's bracketed s142-path-scope-note +
# s142-stop-row-floor-note + s142-catch-scope-note + the spec's
# five-way decomposition, stop-row, and 17/16+1 pins — zero journey
# surfaces touched, zero source files edited, the all-registration
# shape carried) — the standard capture set's forms riding unchanged
# on the remediated tree at the S142 delivery
""",
    ),
    ("digma-capture141.log", "digma-capture142.log"),
    ('S="agent-browser --session clone141"', 'S="agent-browser --session clone142"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session142.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session142.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture141", "clone141"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session142.sh")
print("residue scan clean")
