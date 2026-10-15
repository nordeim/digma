#!/usr/bin/env python3
"""Derive capture-session135.sh from the s134 form (Session 135 — the
83rd Mode C audit cycle). The exact convention: 25 raw diff lines
(header block + log + session tokens).

Run from the repo root:  python3 scripts/derive-capture-s135.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session134.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — 11 lines replacing the
    # s134 form's 11 (11 removed + 11 added + the log/session pair's
    # +/- lines = 25)
    (
        """# Session 134 screenshot capture — the standard set re-captured on the
# S134 code (the resize-live-read/every-save-churn-registrations pass's
# own continuation: the S134-A live read changes zero standard journeys
# (every capture resize journey runs against the settled store — the
# live read and the render-captured memo agree outside the sub-frame
# window, the geometry and the identity identical), the S134-B/C/D
# registrations comment-only (the rename and upload journeys' commits
# the same forms — the DnD, fillKey, draw-sibling, AI, and PATCH
# registrations touch zero journeys), the S134-E doc row record-only —
# the window-scoped guard + doc truth — the standard set's forms
# riding unchanged
""",
        """# Session 135 screenshot capture — the standard set re-captured on the
# S135 code (the viewport/wouldCommit-registrations/census-corrections
# pass's own continuation: the S135-A/B registrations comment-only (the
# toCanvas mapper and the multi-selection rows' would-commit truth ride
# unchanged — the render-consistency doctrine and the churn-immunity
# datum change zero standard journeys, every capture selection and drag
# journey running against the settled store), the S135-C/D notes
# record-only (the worklog's bracketed census corrections touch zero
# journeys) — the standard set's forms riding unchanged
""",
    ),
    ("digma-capture134.log", "digma-capture135.log"),
    ('S="agent-browser --session clone134"', 'S="agent-browser --session clone135"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session135.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session135.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture134", "clone134"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session135.sh")
print("residue scan clean")
