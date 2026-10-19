#!/usr/bin/env python3
"""Derive capture-session158.sh from the s157 form (Session 158 — the
106th Mode C audit cycle, the total rejection-description + toolbar
px-honesty + PAD title-lag repair cycle). The exact convention: 24 raw
diff lines (the 10-line s158 header replacing the 10-line s157 form +
the log/session pair's +/- lines — the honest count, the s154..s157
cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s158.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session157.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s158 form
    # replacing the 10-line s157 form
    (
        """# Session 157 screenshot capture — the standard set re-captured on
# the S157 code (the non-Error rejection hardening + the witness-
# contract scope-honesty repair: the 105th audit's combined
# 0C/0H/0M/0L/2I census — the second consecutive all-Informational
# — the ai-assistant catch's non-Error rejection hole (B157-I1)
# closed by the S157-A instanceof-narrowed dereference and the
# witness-restore contract-line scope mislabel (B157-I2) repaired
# by the honest references spelling — the standard set re-taken at
# the S156 delivery + the S157 remediation (one route line edited;
# zero parity exposure)""",
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
    ),
    ("digma-capture157.log", "digma-capture158.log"),
    ('S="agent-browser --session clone157"', 'S="agent-browser --session clone158"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session158.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session158.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s158 header): {len(diff)}")

# residue check
for residue in ("capture157", "clone157", "S157 code", "105th audit", "second consecutive all-Informational", "B157-I1", "B157-I2"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session158.sh")
print("capture-session158.sh: residue scan clean")
