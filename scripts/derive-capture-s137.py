#!/usr/bin/env python3
"""Derive capture-session137.sh from the s136 form (Session 137 — the
85th Mode C audit cycle). The exact convention: 25 raw diff lines
(header block + log + session tokens).

Run from the repo root:  python3 scripts/derive-capture-s137.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session136.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — 11 lines replacing the
    # s136 form's 11 (11 removed + 11 added + the log/session pair's
    # +/- lines = 25)
    (
        """# Session 136 screenshot capture — the standard set re-captured on the
# S136 code (the logout-gate/mint-registration/perimeter-trace/census-pair
# pass's own continuation: the S136-A logout gate changes zero standard
# journeys (every capture journey rides a live session — the gate's own
# consumer census, the login form the first step of every journey), the
# S136-B/C/D registrations comment-only (the mint registration, the
# guardedUpdate perimeter, and the AI delete-arm trace touch zero
# journeys), the S136-E doc-census pair record-only (the §11 rider and
# the worklog's bracketed note touch zero journeys) — the capture set's
# own evidence contract unchanged, the standard set's forms riding
# unchanged
""",
        """# Session 137 screenshot capture — the standard set re-captured on the
# S137 code (the enumeration-repair/census-registration pass's own
# continuation: the S137-A repair comment-only (the perimeter
# registration's membership list corrected — the guardedUpdate seam,
# its five wrapper consumers, the FillStroke direct-seam rider, and
# every standard journey ride unchanged; the value-based compare and
# the churn-immunity substance untouched, the patchDiffers census
# staying exactly 11), the S137-B census registration record-only (the
# worklog's bracketed note and the spec's survival pins touch zero
# journeys) — the standard set's forms riding unchanged
""",
    ),
    ("digma-capture136.log", "digma-capture137.log"),
    ('S="agent-browser --session clone136"', 'S="agent-browser --session clone137"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session137.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session137.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture136", "clone136"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session137.sh")
print("residue scan clean")
