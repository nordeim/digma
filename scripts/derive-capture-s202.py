#!/usr/bin/env python3
"""Derive capture-session202.sh + capture-census-s202.py from the s201
forms, and add the s212 mapping to the dimension checker (Session 202 —
the 150th Mode C audit cycle, the below-threshold registrations cycle
+ the F188 first-full-cycle census). The honest raw-diff convention:
the s202 header replacing the s201 header + the log/session pair.
This cycle's remediation is the REGISTRATION-ONLY form (the
registration pair + the spec the only mutations; the layer STAYING at
14,373, no F40 rider, zero app pixels moved): byte-identical captures
expected at the standing norm (the honest zero-pixel form); the
DIMENSION checker gains the s212 mapping (the 178th reference audit's
evidence set).

THE HONEST COUNT this cycle: 28 raw diff lines EXPECTED (the s202
header carrying 24 changed lines + the log/session pair's 2 x 2); the
MEASURED count is the record (the F174 lesson).

Run from the repo root:  python3 scripts/derive-capture-s202.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session202.sh ----------------------------------------------------
src = (ROOT / "capture-session201.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s202 form replacing
    # the s201 form (the honest count carried in the diff)
    (
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
        """# Session 202 screenshot capture — the standard set re-captured on
# the S202 code (the below-threshold registrations cycle + the F188
# first-full-cycle census: the 150th audit's 0C/0H/0M/0L/5I census —
# zero behavioral source-code defect, zero comment-truth defect, the
# comment-truth 627 sampled / 627 TRUE / 0 FALSE (the largest sample
# yet, the all-TRUE census restored; the F188 pointer-following
# guard's first full-cycle test PASSED — 53 pointers followed, every
# target carrying its promised content); the SIXTEENTH consecutive
# cycle under the same v1.2.0 master-skill vocabulary (the
# vocabulary-HOLD cycle in the honest folder-level form); the layer
# total STAYING 14,373 (the below-threshold registration-only form —
# zero src/ changes, no F40 rider), the deferral premises holding
# their 77th consecutive cycle — the standard set re-taken at the
# S201 delivery + the S202 registrations (zero app pixels moved:
# byte-identical captures expected, the honest zero-pixel form)""",
    ),
    ("digma-capture201.log", "digma-capture202.log"),
    ('S="agent-browser --session clone201"', 'S="agent-browser --session clone202"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session202.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session202.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s201 run-ordinals in the new capture script
# (the header's "the S201 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s201 script's own "the S200
# delivery" reference; only the run tokens are residues)
for residue in ("capture201", "clone201", "session 201", "Session 201"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session202.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s202.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session201" does NOT contain
# "s201" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s201.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s201.py", "capture-census-s202.py"),
    ("capture-session201.sh", "capture-session202.sh"),
    ("Session 201 capture census", "Session 202 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s202.py").write_text(cdst)
print("capture-census-s202.py: derived (all tokens replaced explicitly)")

# --- the s212 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S211 = dict(S210)
"""
SITE_1_NEW = """S211 = dict(S210)

# s212 mapping (session 202 — the 178th reference audit's evidence set + the
# S202 capture set). The standing S211 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S202 tree); no NEW
# witness this session (the below-threshold registrations cycle paints no
# app pixels; the capture set honestly expects byte-identical files at the
# standing time-dependent-pixel norm).
S212 = dict(S211)
"""
if "S212 = dict(S211)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s211/"):
        return S211.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s211/"):
        return S211.get(Path(name).stem)
    if name.startswith("ref-audit-s212/"):
        return S212.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s212/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s211").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s211").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s212").glob("*.png")]
"""
if 'ROOT / "ref-audit-s212"' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s212 mapping added (three sites)")
