#!/usr/bin/env python3
"""Derive capture-session152.sh from the s151 form (Session 152 — the
100th Mode C audit cycle, the UTF-16-slice-closure cycle). The exact
convention: 23 raw diff lines (the 10-line s152 header replacing the
9-line s151 form + the log/session pair's +/- lines — the honest
count, the s150 cycle's own 23 rode the same 10-line header form).

Run from the repo root:  python3 scripts/derive-capture-s152.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session151.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 9-line s152 form
    # replacing the 9-line s151 form (9 removed + 9 added + the
    # log/session pair's +/- lines = 22 — derived live below; the
    # convention prints the true count)
    (
        """# Session 151 screenshot capture — the standard set re-captured on
# the S151 code (the receipt-integrity pass: the 99th audit's
# combined 0C/0H/0M/0L/1I census — B151-I1 independently observed
# by both auditors, the s150 plan's six execution boxes shipped
# unticked at their own delivery commit, repaired by the S151-A
# tick pass with the S151-B registration (the s151-receipt-note +
# the F138 spec-pinned-receipt doctrine) — the standard set
# re-taken at the S150 delivery + the S151 remediation (docs only:
# zero source edits this cycle)""",
        """# Session 152 screenshot capture — the standard set re-captured on
# the S152 code (the UTF-16-slice-closure pass: the 100th audit's
# combined 0C/0H/0M/0L/0I census — the SECOND zero-finding cycle
# after S143's first, the F138 guard's first verification PASSED
# (the s151 plan 6/6 ticked at its own delivery commit eabe08c),
# B148-I2 closed by the S152-A surrogate-pair-safe truncation seam
# (truncateUtf16Safe at the nine censused members) — the standard
# set re-taken at the S151 delivery + the S152 remediation (five
# source files edited: validation, team, register, duplicate, ai-
# assistant; zero parity exposure — astral input only)""",
    ),
    ("digma-capture151.log", "digma-capture152.log"),
    ('S="agent-browser --session clone151"', 'S="agent-browser --session clone152"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session152.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session152.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 23 — the 10-line s152 header): {len(diff)}")

# residue check
for residue in ("capture151", "clone151", "S151 code", "99th audit", "B151-I1", "receipt-integrity pass"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session152.sh")
print("capture-session152.sh: residue scan clean")
