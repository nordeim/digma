#!/usr/bin/env python3
"""Derive capture-session131.sh from the s130 form (Session 131 — the
79th Mode C audit cycle). The exact convention: 25 raw diff lines
(header block + log + session tokens).

Run from the repo root:  python3 scripts/derive-capture-s131.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session130.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor)
    (
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
        """# Session 131 screenshot capture — the standard set re-captured on the
# S131 code (the present-unmount/layers-stand-down/doc-census pass's
# own continuation: the S131-A mount composition changes zero standard
# journeys (no capture journey presents through a swap window — the
# overlay's mount and remount ride the settled loading false state),
# the S131-B layers arms' stand-down refusal-only through a live
# gesture (every capture journey's eye/lock/trash/reorder click runs
# gesture-free, the dispatch identical), the S131-C/D/E doc-and-record
# family — window-scoped guard + doc truth, +""",
    ),
    ("digma-capture130.log", "digma-capture131.log"),
    ('S="agent-browser --session clone130"', 'S="agent-browser --session clone131"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session131.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session131.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture130", "clone130"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session131.sh")
print("residue scan clean")
