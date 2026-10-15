#!/usr/bin/env python3
"""Derive capture-session134.sh from the s133 form (Session 134 — the
82nd Mode C audit cycle). The exact convention: 25 raw diff lines
(header block + log + session tokens).

Run from the repo root:  python3 scripts/derive-capture-s134.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session133.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — 11 lines replacing the
    # s133 form's 10 (10 removed + 11 added + the log/session pair = 25)
    (
        """# Session 133 screenshot capture — the standard set re-captured on the
# S133 code (the hit-branch-live-list/host-drift/by-design-registrations
# pass's own continuation: the S133-A/B live-read changes zero standard
# journeys (every capture selection journey runs against the settled
# store — the live read and the render-captured list agree outside the
# sub-frame window, the selection and the edits identical), the S133-C/D
# registrations comment-only (the row-click journeys' dispatch the same
# form, the login journeys' unverified branch the standing twin), the
# S133-E doc row record-only — the window-scoped guard + doc truth,
# + forms riding unchanged
""",
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
    ),
    ("digma-capture133.log", "digma-capture134.log"),
    ('S="agent-browser --session clone133"', 'S="agent-browser --session clone134"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session134.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session134.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture133", "clone133"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session134.sh")
print("residue scan clean")
