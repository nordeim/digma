#!/usr/bin/env python3
"""Derive capture-session179.sh from the s178 form (Session 179 — the
127th Mode C audit cycle, the continuity + eighth-generation coordinate +
zod-claim-scope + display-mangling registrations cycle). The exact
convention: 24 raw diff lines (the 10-line s179 header replacing the
10-line s178 form + the log/session pair's +/- lines — the honest
count, the s154..s178 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s179.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session178.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s179 form
    # replacing the 10-line s178 form
    (
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
    ),
    ("digma-capture178.log", "digma-capture179.log"),
    ('S="agent-browser --session clone178"', 'S="agent-browser --session clone179"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session179.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session179.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s179 header): {len(diff)}")

# residue check (only the s178-specific forms are residues; the new
# header's own "22 TRUE / 0 FALSE" / "53rd" spellings are the
# s179 forms, never residues — the "at the S178 delivery" phrase is
# the new header's own naming of the parent delivery)
for residue in ("capture178", "clone178", "S178 code", "126th audit", "the THIRD consecutive", "the S177 delivery + the S178 remediation"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session179.sh")
print("capture-session179.sh: residue scan clean")
