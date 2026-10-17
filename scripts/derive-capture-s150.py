#!/usr/bin/env python3
"""Derive capture-session150.sh from the s149 form (Session 150 — the
98th Mode C audit cycle, the citation-and-receipt cycle). The exact
convention: 23 raw diff lines (the 10-line s149 header replaced by
the 9-line s150 form + the log/session pair's +/- lines; the prior
cycles' 25 rode the 11-line s148 header form).

Run from the repo root:  python3 scripts/derive-capture-s150.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

src = (ROOT / "capture-session149.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 10-line s150 form
    # replacing the 10-line s149 form (10 removed + 10 added + the
    # log/session pair's +/- lines = 22... derived live below; the
    # convention prints the true count)
    (
        """# Session 149 screenshot capture — the standard set re-captured on
# the S149 code (the citation-repair/glyph-re-anchor/sweep-completion
# registration pass: the 97th audit's combined 0C/0H/0M/0L/4I census
# — A149-I1 the S148-B comment's born-drifted citation repaired in
# place (the :503 commit above, the F136 born-verified-citation
# doctrine), A149-I2 the glyph-note re-anchor (the F134 class
# across cycles), B149-I1/B149-I2 the fixed-sleep-note completion
# (the :101 re-anchor + the promise-wrapped members) — the standard
# set re-taken at the S148 delivery + the S149 remediation (one
# comment token edited: canvas)""",
        """# Session 150 screenshot capture — the standard set re-captured on
# the S150 code (the cross-document-citation-repair/execution-record-
# tick pass: the 98th audit's combined 0C/0H/0M/0L/2I census —
# A150-I1 the S96-C provenance comment's cross-document citation
# repaired in place (the PAD's RA-14…RA-20 re-measure record, the
# F137 cross-document-citation doctrine), B150-I1 the s149 plan's
# execution-record tick pass (the delivery-receipt convention) —
# the standard set re-taken at the S149 delivery + the S150
# remediation (one comment token edited: canvas)""",
    ),
    ("digma-capture149.log", "digma-capture150.log"),
    ('S="agent-browser --session clone149"', 'S="agent-browser --session clone150"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session150.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session150.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"convention check (expect 23 — the 9-line s150 header): {len(diff)}")

# residue check
for residue in ("capture149", "clone149", "S149 code", "97th audit", "s149-glyph-reanchor-note"):
    if residue in dst:
        raise SystemExit(f"RESIDUE {residue!r} left in capture-session150.sh")
print("residue scan clean")
