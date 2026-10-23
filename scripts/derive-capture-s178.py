#!/usr/bin/env python3
"""Derive capture-session178.sh from the s177 form (Session 178 — the
126th Mode C audit cycle, the continuity + seventh-generation coordinate +
dispatch-brief convention-naming + partial-event-shape registrations
cycle). The exact convention: 24 raw diff lines (the 10-line s178
header replacing the 10-line s177 form + the log/session pair's +/-
lines — the honest count, the s154..s177 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s178.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session177.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s178 form
    # replacing the 10-line s177 form
    (
        """# Session 177 screenshot capture — the standard set re-captured on
# the S177 code (the continuity + sixth-generation coordinate +
# config-lever + commit-message registrations cycle: the 125th
# audit's 0C/0H/0M/0L/10I combined census — the SECOND consecutive
# zero-source-finding all-Informational cycle, the TENTH consecutive
# STAYS figure (the layer STAYING 14,307 via the zero-source-change
# form), the comment-truth sampling 141 TRUE / 0 FALSE (the zero-
# false census holding its second consecutive cycle), the deferral
# premises holding their 51st consecutive cycle — the standard set
# re-taken at the S176 delivery + the S177 remediation (zero parity exposure — every new member a registration member)""",
        """# Session 178 screenshot capture — the standard set re-captured on
# the S178 code (the continuity + seventh-generation coordinate +
# dispatch-brief-convention + partial-event registrations cycle: the
# 126th audit's 0C/0H/0M/0L/5I combined census — the THIRD
# consecutive zero-source-finding all-Informational cycle, the
# ELEVENTH consecutive STAYS figure (the layer STAYING 14,307 via
# the zero-source-change form), the comment-truth sampling 17 TRUE /
# 0 FALSE (the zero-false direction holding its third consecutive
# cycle), the deferral premises holding their 52nd consecutive cycle —
# the standard set re-taken at the S177 delivery + the S178 remediation (zero parity exposure — every new member a registration member)""",
    ),
    ("digma-capture177.log", "digma-capture178.log"),
    ('S="agent-browser --session clone177"', 'S="agent-browser --session clone178"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session178.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session178.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s178 header): {len(diff)}")

# residue check (only the s177-specific forms are residues; the new
# header's own "17 TRUE / 0 FALSE" / "52nd" spellings are the
# s178 forms, never residues — the "at the S177 delivery" phrase is
# the new header's own naming of the parent delivery)
for residue in ("capture177", "clone177", "S177 code", "125th audit", "the SECOND consecutive", "the S176 delivery + the S177 remediation"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session178.sh")
print("capture-session178.sh: residue scan clean")
