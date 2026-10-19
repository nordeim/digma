#!/usr/bin/env python3
"""Derive capture-session159.sh from the s158 form (Session 159 — the
107th Mode C audit cycle, the describeRejection string-honesty +
StrictMode-safe mount discriminator + layers pointer-only registration +
Informational pair cycle). The exact convention: 24 raw diff lines (the
10-line s159 header replacing the 10-line s158 form + the log/session
pair's +/- lines — the honest count, the s154..s158 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s159.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session158.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s159 form
    # replacing the 10-line s158 form
    (
        """# Session 158 screenshot capture — the standard set re-captured on
# the S158 code (the total rejection-description + the toolbar px-
# honesty + the PAD title-lag repair: the 106th audit's combined
# 0C/0H/0M/1L/2I census — the auditors' third consecutive all-
# Informational pair — the String-totality hole (B158-I1) closed
# by the S158-A guarded describeRejection, the toolbar px mislabel
# (A158-I1) repaired at the comment layer, the PAD title lag
# (L158-L1) closed at the version seam — the standard set re-taken
# at the S157 delivery + the S158 remediation (one route line + one
# helper + one comment edited; zero parity exposure)""",
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
    ),
    ("digma-capture158.log", "digma-capture159.log"),
    ('S="agent-browser --session clone158"', 'S="agent-browser --session clone159"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session159.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session159.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s159 header): {len(diff)}")

# residue check
for residue in ("capture158", "clone158", "S158 code", "106th audit", "third consecutive all-Informational", "B158-I1", "A158-I1", "L158-L1"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session159.sh")
print("capture-session159.sh: residue scan clean")
