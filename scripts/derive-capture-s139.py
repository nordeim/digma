#!/usr/bin/env python3
"""Derive capture-session139.sh from the s138 form (Session 139 — the
87th Mode C audit cycle). The exact convention: 25 raw diff lines
(header block + log + session tokens).

Run from the repo root:  python3 scripts/derive-capture-s139.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session138.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — 10 lines replacing the
    # s138 form's 11 (11 removed + 10 added + the log/session pair's
    # +/- lines = 25)
    (
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
        """# Session 139 screenshot capture — the standard set re-captured on the
# S139 code (the census-scoping/posture/enumeration/arithmetic
# registration pass's own continuation: the S139-A census-scoping
# registration record-only (the worklog's bracketed
# s139-dispatch-brief-census-note names the scope beside the count),
# the S139-B/C/D registrations likewise record-only (the posture,
# the enumeration, the arithmetic — the worklog's bracketed notes +
# the spec's pins, zero journey surfaces involved; no source file
# edited this cycle, the all-registration shape) — the standard set's
# forms riding unchanged
""",
    ),
    ("digma-capture138.log", "digma-capture139.log"),
    ('S="agent-browser --session clone138"', 'S="agent-browser --session clone139"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session139.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session139.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 25): {len(diff)}")

# residue check
for residue in ("capture138", "clone138"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session139.sh")
print("residue scan clean")
