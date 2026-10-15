#!/usr/bin/env python3
"""Derive capture-session136.sh from the s135 form (Session 136 — the
84th Mode C audit cycle). The exact convention: 25 raw diff lines
(header block + log + session tokens).

Run from the repo root:  python3 scripts/derive-capture-s136.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session135.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — 11 lines replacing the
    # s135 form's 11 (11 removed + 11 added + the log/session pair's
    # +/- lines = 25)
    (
        """# Session 135 screenshot capture — the standard set re-captured on the
# S135 code (the viewport/wouldCommit-registrations/census-corrections
# pass's own continuation: the S135-A/B registrations comment-only (the
# toCanvas mapper and the multi-selection rows' would-commit truth ride
# unchanged — the render-consistency doctrine and the churn-immunity
# datum change zero standard journeys, every capture selection and drag
# journey running against the settled store), the S135-C/D notes
# record-only (the worklog's bracketed census corrections touch zero
# journeys) — the capture set's own evidence contract unchanged, the
# standard set's forms riding unchanged
""",
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
    ),
    ("digma-capture135.log", "digma-capture136.log"),
    ('S="agent-browser --session clone135"', 'S="agent-browser --session clone136"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session136.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session136.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture135", "clone135"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session136.sh")
print("residue scan clean")
