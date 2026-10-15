#!/usr/bin/env python3
"""Derive capture-session138.sh from the s137 form (Session 138 — the
86th Mode C audit cycle). The exact convention: 25 raw diff lines
(header block + log + session tokens).

Run from the repo root:  python3 scripts/derive-capture-s138.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session137.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — 11 lines replacing the
    # s137 form's 10 (10 removed + 11 added + the log/session pair's
    # +/- lines = 25)
    (
        """# Session 137 screenshot capture — the standard set re-captured on the
# S137 code (the enumeration-repair/census-registration pass's own
# continuation: the S137-A repair comment-only (the perimeter
# registration's membership list corrected — the guardedUpdate seam,
# its five wrapper consumers, the FillStroke direct-seam rider, and
# every standard journey ride unchanged; the value-based compare and
# the churn-immunity substance untouched, the patchDiffers census
# staying exactly 11), the S137-B census registration record-only (the
# worklog's bracketed note and the spec's survival pins touch zero
# journeys) — the standard set's forms riding unchanged
""",
        """# Session 138 screenshot capture — the standard set re-captured on the
# S138 code (the path-truth/command-form registration pass's own
# continuation: the S138-A path-truth registration record-only (the
# worklog's bracketed s138-dispatch-brief-path-note names the five
# true paths — the audit brief's mis-scoping never touched a repo
# artifact; the spec's path-truth pins assert the tree, zero journey
# surfaces involved), the S138-B command-form registration likewise
# record-only (the worklog's bracketed note + the live-docs pins —
# the quoted census command's working form named, zero journey
# surfaces involved; no source file edited this cycle, the
# all-registration shape) — the standard set's forms riding unchanged
""",
    ),
    ("digma-capture137.log", "digma-capture138.log"),
    ('S="agent-browser --session clone137"', 'S="agent-browser --session clone138"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session138.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session138.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture137", "clone137"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session138.sh")
print("residue scan clean")
