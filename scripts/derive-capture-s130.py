#!/usr/bin/env python3
"""Derive capture-session130.sh from the s129 form (Session 130 — the
78th Mode C audit cycle). The exact convention: 25 raw diff lines
(header block + log + session tokens).

Run from the repo root:  python3 scripts/derive-capture-s130.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session129.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor)
    (
        """# Session 129 screenshot capture — the standard set re-captured on the
# S129 code (the keyboard-arm/dead-flag/seed-hoist/by-design-note pass's
# own continuation: the S129-A keyboard arm adds a modality no capture
# journey exercises (every slider journey rides the pointer pipeline —
# the arm's keydown path inert under pointer-driven changes; the keyTick
# discrimination keeps the idle from re-arming mid-drag, so a
# pointer-dragged slider pushes exactly as before), the S129-B dead-flag
# retirement pure deletion (write-only state, zero behavioral surface),
# the S129-C seed hash hoist computing the identical demo rows (the hash
# outside the writer window), and the S129-D by-design note doc-only — window-scoped arm + doc truth, +""",
        """# Session 130 screenshot capture — the standard set re-captured on the
# S130 code (the wheel-arm/doc-census/read-path-posture pass's own
# continuation: the S130-A wheel arm adds an engine-dependent modality no
# capture journey exercises (every slider journey rides the pointer
# pipeline on the Chromium matrix — the never-wheeling engine's arm
# terminating net-zero through the 150ms idle, the wheel path inert
# under pointer-driven changes), the S130-B doc-census sweep doc-only,
# the S130-C read-path posture registration comment-only, the S130-D
# finally guard passing identically while alive, and the S130-E pan
# capture alignment behavior-identical on the standard journeys —
# window-scoped arm + doc truth, +""",
    ),
    ("digma-capture129.log", "digma-capture130.log"),
    ('S="agent-browser --session clone129"', 'S="agent-browser --session clone130"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session130.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session130.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture129", "clone129"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session130.sh")
print("residue scan clean")
