#!/usr/bin/env python3
"""Derive capture-session151.sh from the s150 form (Session 151 — the
99th Mode C audit cycle, the receipt-integrity cycle). The exact
convention: 22 raw diff lines (the 9-line s150 header replaced by
the 9-line s151 form + the log/session pair's +/- lines; the s150
cycle's 23 rode the 10-line s149 header).

Run from the repo root:  python3 scripts/derive-capture-s151.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session150.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 9-line s151 form
    # replacing the 9-line s150 form (9 removed + 9 added + the
    # log/session pair's +/- lines = 22 — derived live below; the
    # convention prints the true count)
    (
        """# Session 150 screenshot capture — the standard set re-captured on
# the S150 code (the cross-document-citation-repair/execution-record-
# tick pass: the 98th audit's combined 0C/0H/0M/0L/2I census —
# A150-I1 the S96-C provenance comment's cross-document citation
# repaired in place (the PAD's RA-14…RA-20 re-measure record, the
# F137 cross-document-citation doctrine), B150-I1 the s149 plan's
# execution-record tick pass (the delivery-receipt convention) —
# the standard set re-taken at the S149 delivery + the S150
# remediation (one comment token edited: canvas)""",
        """# Session 151 screenshot capture — the standard set re-captured on
# the S151 code (the receipt-integrity pass: the 99th audit's
# combined 0C/0H/0M/0L/1I census — B151-I1 independently observed
# by both auditors, the s150 plan's six execution boxes shipped
# unticked at their own delivery commit, repaired by the S151-A
# tick pass with the S151-B registration (the s151-receipt-note +
# the F138 spec-pinned-receipt doctrine) — the standard set
# re-taken at the S150 delivery + the S151 remediation (docs only:
# zero source edits this cycle)""",
    ),
    ("digma-capture150.log", "digma-capture151.log"),
    ('S="agent-browser --session clone150"', 'S="agent-browser --session clone151"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session151.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session151.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 22 — the 9-line s151 header): {len(diff)}")

# residue check
for residue in ("capture150", "clone150", "S150 code", "98th audit", "A150-I1", "B150-I1"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session151.sh")
print("capture-session151.sh: residue scan clean")
