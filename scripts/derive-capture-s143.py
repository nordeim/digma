#!/usr/bin/env python3
"""Derive capture-session143.sh from the s142 form (Session 143 — the
91st Mode C audit cycle). The exact convention: 25 raw diff lines
(the 11-line s142 header replaced by the 11-line s143 form + the
log/session pair's +/- lines).

Run from the repo root:  python3 scripts/derive-capture-s143.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session142.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 11-line s143 form
    # replacing the 11-line s142 form (11 removed + 11 added + the
    # log/session pair's +/- lines = 25 when the pair's +/- counts as 3)
    (
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
    ),
    ("digma-capture142.log", "digma-capture143.log"),
    ('S="agent-browser --session clone142"', 'S="agent-browser --session clone143"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session143.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session143.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture142", "clone142"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session143.sh")
print("residue scan clean")
