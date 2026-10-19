#!/usr/bin/env python3
"""Derive capture-session160.sh from the s159 form (Session 160 — the
108th Mode C audit cycle, the guarded draft restore + layers keyboard
superset + canvas draw-creation registration + Informational quintet
cycle). The exact convention: 24 raw diff lines (the 10-line s160
header replacing the 10-line s159 form + the log/session pair's +/-
lines — the honest count, the s154..s159 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s160.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session159.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s160 form
    # replacing the 10-line s159 form
    (
        """# Session 159 screenshot capture — the standard set re-captured on
# the S159 code (the describeRejection string-honesty + the
# StrictMode-safe mount discriminator + the layers pointer-only
# registration + the Informational pair: the 107th audit's combined
# 0C/0H/0M/2L/3I census — the non-string message hole (I159-B-I1)
# closed by the S159-A typeof narrow, the dev StrictMode staleness
# (L159-A-L2) closed by the S159-B commit-riding flip, the layers
# pointer-only gap registered, the Set + divider pair closed — the
# standard set re-taken at the S158 delivery + the S159 remediation
# (one helper + one view + one canvas + one comment; zero parity)""",
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
    ),
    ("digma-capture159.log", "digma-capture160.log"),
    ('S="agent-browser --session clone159"', 'S="agent-browser --session clone160"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session160.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session160.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s160 header): {len(diff)}")

# residue check
for residue in ("capture159", "clone159", "S159 code", "107th audit", "2L/3I", "I159-B-I1", "L159-A-L2"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session160.sh")
print("capture-session160.sh: residue scan clean")
