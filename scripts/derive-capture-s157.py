#!/usr/bin/env python3
"""Derive capture-session157.sh from the s156 form (Session 157 — the
105th Mode C audit cycle, the non-Error rejection hardening +
witness-contract scope-honesty repair cycle). The exact convention:
24 raw diff lines (the 10-line s157 header replacing the 10-line s156
form + the log/session pair's +/- lines — the honest count, the
s154/s155/s156 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s157.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session156.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s157 form
    # replacing the 10-line s156 form
    (
        """# Session 156 screenshot capture — the standard set re-captured on
# the S156 code (the capture-script mechanical-restore hardening +
# the guard-ordering citation repair: the 104th audit's combined
# 0C/0H/0M/0L/0I census — the FOURTH zero-finding census and the
# first with both auditors individually clean — the B121-I1 witness-
# restore residual closed by the S156-A mechanical named-list script
# and the prior cycles' guard-ordering prose inversion (B156-N1)
# registered by the bracketed worklog note — the standard set
# re-taken at the S155 delivery + the S156 remediation (zero source
# files edited, scripts/-only; zero parity exposure)""",
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
    ),
    ("digma-capture156.log", "digma-capture157.log"),
    ('S="agent-browser --session clone156"', 'S="agent-browser --session clone157"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session157.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session157.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s157 header): {len(diff)}")

# residue check
for residue in ("capture156", "clone156", "S156 code", "104th audit", "FOURTH zero-finding", "B156-N1"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session157.sh")
print("capture-session157.sh: residue scan clean")
