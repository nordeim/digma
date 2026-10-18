#!/usr/bin/env python3
"""Derive capture-session156.sh from the s155 form (Session 156 — the
104th Mode C audit cycle, the capture-script mechanical-restore
hardening + guard-ordering citation-repair cycle). The exact
convention: 24 raw diff lines (the 10-line s156 header replacing the
10-line s155 form + the log/session pair's +/- lines — the honest
count, the s154/s155 cycles' own 24).

Run from the repo root:  python3 scripts/derive-capture-s156.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session155.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s156 form
    # replacing the 10-line s155 form
    (
        """# Session 155 screenshot capture — the standard set re-captured on
# the S155 code (the census-enumeration completion + the env-census
# citation repair: the 103rd audit's combined 0C/0H/0M/0L/2I census
# — the first all-Informational census — the addElements enumeration
# residual (A155-I1) closed by the S155-A registration comments at
# the arm + the markSaved family exclusion census (comment-only,
# zero behavioral change) and the s154-B env-census per-var defect
# (B155-I1) registered by the bracketed worklog note — the standard
# set re-taken at the S154 delivery + the S155 remediation (one
# source file edited, comments only; zero parity exposure)""",
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
    ),
    ("digma-capture155.log", "digma-capture156.log"),
    ('S="agent-browser --session clone155"', 'S="agent-browser --session clone156"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session156.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session156.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 24 — the 10-line s156 header): {len(diff)}")

# residue check
for residue in ("capture155", "clone155", "S155 code", "103rd audit", "census-enumeration completion", "A155-I1"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session156.sh")
print("capture-session156.sh: residue scan clean")
