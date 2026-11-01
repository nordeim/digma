#!/usr/bin/env python3
"""Derive capture-session201.sh + capture-census-s201.py from the s200
forms, and add the s211 mapping to the dimension checker (Session 201 —
the 149th Mode C audit cycle, the CT-1 pointer-fix registrations cycle,
the first Low-carrying census since session 197). The honest raw-diff
convention: the s201 header replacing the s200 header + the log/session
pair. This cycle's remediation is the DOC-SIDE-ONLY form (one README
Troubleshooting row the only doc mutation; the layer STAYING at 14,373,
no F40 rider, zero app pixels moved): byte-identical captures expected
at the standing norm (the honest zero-pixel form); the DIMENSION
checker gains the s211 mapping (the 177th reference audit's evidence
set).

THE HONEST COUNT this cycle: 28 raw diff lines EXPECTED (the s201
header carrying 12 changed lines + the log/session pair's 2 x 2); the
MEASURED count is the record (the F174 lesson — the s199 cycle's own
30-expected/26-measured correction the standing precedent).

Run from the repo root:  python3 scripts/derive-capture-s201.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session201.sh ----------------------------------------------------
src = (ROOT / "capture-session200.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s201 form replacing
    # the s200 form (the honest count carried in the diff)
    (
        """# Session 200 screenshot capture — the standard set re-captured on
# the S200 code (the below-threshold registrations cycle, the third
# consecutive zero-Low census: the 148th audit's 0C/0H/0M/0L/6I
# census — zero behavioral source-code defect, zero comment-truth
# defect, the comment-truth 223 sampled / 223 TRUE / 0 FALSE (the
# third consecutive all-TRUE census, the largest sample yet); the
# FOURTEENTH consecutive cycle under the same v1.2.0 master-skill
# vocabulary (the vocabulary-HOLD cycle in the honest folder-level
# form); the layer total STAYING 14,373 (the below-threshold form —
# zero source changes, no F40 rider), the deferral premises holding
# their 75th consecutive cycle — the standard set re-taken at the
# S199 delivery + the S200
# below-threshold registrations (zero pixels moved: byte-identical
# captures expected, the honest zero-pixel form)""",
        """# Session 201 screenshot capture — the standard set re-captured on
# the S201 code (the CT-1 pointer-fix registrations cycle, the first
# Low-carrying census since session 197: the 149th audit's
# 0C/0H/0M/1L/6I census — zero behavioral source-code defect, ONE
# comment-truth defect (the CT-1 stale pointer — the fix the README
# Troubleshooting AUTH_SECRET rotation row, zero src/ changes), the
# comment-truth 253 sampled / 252 TRUE / 1 FALSE (the largest sample
# yet, the all-TRUE streak ending at three; the F188 pointer-
# following lesson born); the FIFTEENTH consecutive cycle under the
# same v1.2.0 master-skill vocabulary (the vocabulary-HOLD cycle in
# the honest folder-level form); the layer total STAYING 14,373 (the
# doc-side-only form — one README row the only doc mutation, no F40
# rider), the deferral premises holding their 76th consecutive
# cycle — the standard set re-taken at the S200 delivery + the S201
# doc-side registrations (zero app pixels moved: byte-identical
# captures expected, the honest zero-pixel form)""",
    ),
    ("digma-capture200.log", "digma-capture201.log"),
    ('S="agent-browser --session clone200"', 'S="agent-browser --session clone201"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session201.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session201.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s200 run-ordinals in the new capture script
# (the header's "the S200 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s200 script's own "the S199
# delivery" reference; only the run tokens are residues)
for residue in ("capture200", "clone200", "session 200", "Session 200"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session201.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s201.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session200" does NOT contain
# "s200" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s200.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s200.py", "capture-census-s201.py"),
    ("capture-session200.sh", "capture-session201.sh"),
    ("Session 200 capture census", "Session 201 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s201.py").write_text(cdst)
print("capture-census-s201.py: derived (all tokens replaced explicitly)")

# --- the s211 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S210 = dict(S209)
"""
SITE_1_NEW = """S210 = dict(S209)

# s211 mapping (session 201 — the 177th reference audit's evidence set + the
# S201 capture set). The standing S210 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S201 tree); no NEW
# witness this session (the doc-side-only registrations cycle paints no
# app pixels; the capture set honestly expects byte-identical files at the
# standing time-dependent-pixel norm).
S211 = dict(S210)
"""
if "S211 = dict(S210)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s210/"):
        return S210.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s210/"):
        return S210.get(Path(name).stem)
    if name.startswith("ref-audit-s211/"):
        return S211.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s211/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s210").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s210").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s211").glob("*.png")]
"""
if 'ROOT / "ref-audit-s211"' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s211 mapping added (three sites)")
