#!/usr/bin/env python3
"""Derive capture-session180.sh from the s179 form (Session 180 — the
128th Mode C audit cycle, the continuity + ninth-generation coordinate +
dispatched-observation-refutation + collection-time-read registrations
cycle). The exact convention: 24 raw diff lines (the 10-line s180 header
replacing the 10-line s179 form + the log/session pair's +/- lines — the
honest count, the s154..s179 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s180.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session179.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s180 form
    # replacing the 10-line s179 form
    (
        """# Session 179 screenshot capture — the standard set re-captured on
# the S179 code (the continuity + eighth-generation coordinate +
# zod-claim-scope + display-mangling registrations cycle: the 127th
# audit's 0C/0H/0M/0L/5I combined census — the FOURTH consecutive
# zero-source-finding all-Informational cycle, the TWELFTH
# consecutive STAYS figure (the layer STAYING 14,307 via the
# zero-source-change form), the comment-truth sampling 22 TRUE /
# 0 FALSE (the zero-false direction holding its fourth consecutive
# cycle), the deferral premises holding their 53rd consecutive cycle —
# the standard set re-taken at the S178 delivery + the S179 remediation (zero parity exposure — every new member a registration member)""",
        """# Session 180 screenshot capture — the standard set re-captured on
# the S180 code (the continuity + ninth-generation coordinate +
# dispatched-observation-refutation + collection-time-read
# registrations cycle: the 128th audit's 0C/0H/0M/1L/8I census —
# src/ itself ZERO-FINDING for the FIFTH consecutive cycle (the
# one Low on the test-infrastructure surface), the THIRTEENTH
# consecutive STAYS figure (the layer STAYING 14,307 via the
# zero-source-change form), the comment-truth 22 TRUE / 0 FALSE
# (the zero-false direction holding its fifth consecutive cycle),
# the deferral premises holding their 54th consecutive cycle — the standard set re-taken at the S179 delivery + the S180 remediation (zero parity exposure — every new member a registration member)""",
    ),
    ("digma-capture179.log", "digma-capture180.log"),
    ('S="agent-browser --session clone179"', 'S="agent-browser --session clone180"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session180.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session180.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (the honest count — the 1-line STAYS carry identical to the s179 form; the s154..s179 cycles' own 24): {len(diff)}")

# residue check (only the s179-specific forms are residues; the new
# header's own "22 TRUE / 0 FALSE" / "54th" spellings are the
# s180 forms, never residues — the "at the S179 delivery" phrase is
# the new header's own naming of the parent delivery)
for residue in ("capture179", "clone179", "S179 code", "127th audit", "the FOURTH consecutive", "the S178 delivery + the S179 remediation"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session180.sh")
print("capture-session180.sh: residue scan clean")
