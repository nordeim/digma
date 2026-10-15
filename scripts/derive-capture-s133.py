#!/usr/bin/env python3
"""Derive capture-session133.sh from the s132 form (Session 133 — the
81st Mode C audit cycle). The exact convention: 25 raw diff lines
(header block + log + session tokens).

Run from the repo root:  python3 scripts/derive-capture-s133.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session132.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — 10 lines replacing the
    # s132 form's 11 (11 removed + 10 added + the log/session pair = 25)
    (
        """# Session 132 screenshot capture — the standard set re-captured on the
# S132 code (the marquee-live-list/by-design-registration/env-census
# pass's own continuation: the S132-A live-list read changes zero
# standard journeys (every capture marquee journey runs against the
# settled store — the live read and the render-captured list agree
# outside the sub-frame window, the selection identical), the S132-B
# by-design registration comment-only (the s66 preservation contract
# riding unchanged — the hex text journeys' discrete commits the
# same form), the S132-C worklog note record-only, and the count
# family doc-only (the §11 rows and the gate-order lines) — the
# window-scoped guard + doc truth, + forms riding unchanged
""",
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
    ),
    ("digma-capture132.log", "digma-capture133.log"),
    ('S="agent-browser --session clone132"', 'S="agent-browser --session clone133"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session133.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session133.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture132", "clone132"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session133.sh")
print("residue scan clean")
