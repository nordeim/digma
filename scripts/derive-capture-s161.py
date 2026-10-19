#!/usr/bin/env python3
"""Derive capture-session161.sh from the s160 form (Session 161 — the
109th Mode C audit cycle, the pagehide out-of-order registration +
insert-shape keyboard surface + picker gesture tokens cycle). The exact
convention: 24 raw diff lines (the 10-line s161 header replacing the
10-line s160 form + the log/session pair's +/-
lines — the honest count, the s154..s160 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s161.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session160.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s161 form
    # replacing the 10-line s160 form
    (
        """# Session 160 screenshot capture — the standard set re-captured on
# the S160 code (the guarded draft restore + the layers keyboard
# superset + the canvas draw-creation registration + the
# Informational quintet: the 108th audit's combined 0C/0H/0M/1L/6I
# census — the draft-clobber (L160-L1) closed by the S160-A guarded
# restore, the layers keyboard gap (the S159-C follow-up) closed by
# the S160-B superset, the canvas creation posture registered, the
# quintet closed — the standard set re-taken at the S159 delivery +
# the S160 remediation (two client views + one canvas + one lib +
# one store + one screen; zero parity exposure)""",
        """# Session 161 screenshot capture — the standard set re-captured on
# the S161 code (the pagehide out-of-order registration + the
# insert-shape keyboard surface + the picker gesture tokens: the
# 109th audit's combined 0C/0H/0M/1L/3I census — the pagehide
# out-of-order residual (L161-A-L1) registered with the unsound-skip
# correction, the insert-shape keyboard gap (the S160-C follow-up)
# closed by the S161-B superset, the line-height form map and the
# isolate posture registered, the picker token family closed — the
# standard set re-taken at the S160 delivery + the S161 remediation
# (one view + one panel + one lib; zero parity exposure)""",
    ),
    ("digma-capture160.log", "digma-capture161.log"),
    ('S="agent-browser --session clone160"', 'S="agent-browser --session clone161"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session161.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session161.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s161 header): {len(diff)}")

# residue check
for residue in ("capture160", "clone160", "S160 code", "108th audit", "1L/6I", "L160-L1", "I160-A-I1", "S160-B superset"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session161.sh")
print("capture-session161.sh: residue scan clean")
