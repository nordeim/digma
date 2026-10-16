#!/usr/bin/env python3
"""Derive capture-session140.sh from the s139 form (Session 140 — the
88th Mode C audit cycle). The exact convention: 25 raw diff lines
(the 10-line s139 header replaced by the 11-line s140 form + the
log/session pair's +/- lines).

Run from the repo root:  python3 scripts/derive-capture-s140.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session139.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — 11 lines replacing the
    # s139 form's 10 (10 removed + 11 added + the log/session pair's
    # +/- lines = 25)
    (
        """# Session 139 screenshot capture — the standard set re-captured on the
# S139 code (the census-scoping/posture/enumeration/arithmetic
# registration pass's own continuation: the S139-A census-scoping
# registration record-only (the worklog's bracketed
# s139-dispatch-brief-census-note names the scope beside the count),
# the S139-B/C/D registrations likewise record-only (the posture,
# the enumeration, the arithmetic — the worklog's bracketed notes +
# the spec's pins, zero journey surfaces involved; no source file
# edited this cycle, the all-registration shape) — the standard set's
# forms riding unchanged
""",
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
    ),
    ("digma-capture139.log", "digma-capture140.log"),
    ('S="agent-browser --session clone139"', 'S="agent-browser --session clone140"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session140.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session140.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture139", "clone139"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session140.sh")
print("residue scan clean")
