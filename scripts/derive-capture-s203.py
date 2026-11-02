#!/usr/bin/env python3
"""Derive capture-session203.sh + capture-census-s203.py from the s202
forms, and add the s213 mapping to the dimension checker (Session 203 —
the 151st Mode C audit cycle, the F188 second-cycle catch + the B202-I-5
landing + the B203-L-1 re-anchor). The honest raw-diff convention: the
s203 header replacing the s202 header + the log/session pair.
This cycle's remediation is the COMMENT-ONLY form (the two amendments +
the registration pair + the spec the only mutations; the layer STAYING
at 14,373, no F40 rider, zero app pixels moved): byte-identical
captures expected at the standing norm (the honest zero-pixel form);
the DIMENSION checker gains the s213 mapping (the 179th reference
audit's evidence set).

THE HONEST COUNT this cycle: 28 raw diff lines EXPECTED (the s203
header carrying 24 changed lines + the log/session pair's 2 x 2); the
MEASURED count is the record (the F174 lesson).

Run from the repo root:  python3 scripts/derive-capture-s203.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session203.sh ----------------------------------------------------
src = (ROOT / "capture-session202.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s203 form replacing
    # the s202 form (the honest count carried in the diff)
    (
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
        """# Session 203 screenshot capture — the standard set re-captured on
# the S203 code (the F188 second-cycle catch + the B202-I-5 landing +
# the B203-L-1 re-anchor: the 151st audit's 0C/0H/0M/1L/1I census —
# a LOW-CARRYING cycle, zero behavioral source-code defect, ONE
# comment-truth defect caught and fixed in the same cycle, the
# comment-truth 683 sampled / 682 TRUE / 1 FALSE (the largest sample
# yet; the F188 pointer-following guard's second full-cycle test —
# AND ITS FIRST CATCH: 73 pointers followed, 72 TRUE / 1 FALSE — the
# stale Pattern B target caught by the complete-population form); the
# SEVENTEENTH consecutive cycle under the same v1.2.0 master-skill
# vocabulary (the vocabulary-HOLD cycle in the honest folder-level
# form); the layer total STAYING 14,373 (the comment-only form — the
# two amendments the only src/ mutations, both comments, no F40
# rider), the deferral premises holding their 78th consecutive cycle
# — the standard set re-taken at the S202 delivery + the S203
# comment-only amendments (zero app pixels moved: byte-identical
# captures expected, the honest zero-pixel form)""",
    ),
    ("digma-capture202.log", "digma-capture203.log"),
    ('S="agent-browser --session clone202"', 'S="agent-browser --session clone203"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session203.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session203.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s202 run-ordinals in the new capture script
# (the header's "the S202 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s202 script's own "the S201
# delivery" reference; only the run tokens are residues)
for residue in ("capture202", "clone202", "session 202", "Session 202"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session203.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s203.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session202" does NOT contain
# "s202" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s202.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s202.py", "capture-census-s203.py"),
    ("capture-session202.sh", "capture-session203.sh"),
    ("Session 202 capture census", "Session 203 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s203.py").write_text(cdst)
print("capture-census-s203.py: derived (all tokens replaced explicitly)")

# --- the s213 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S212 = dict(S211)
"""
SITE_1_NEW = """S212 = dict(S211)

# s213 mapping (session 203 — the 179th reference audit's evidence set + the
# S203 capture set). The standing S212 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S203 tree); no NEW
# witness this session (the comment-only amendments cycle paints no
# app pixels; the capture set honestly expects byte-identical files at the
# standing time-dependent-pixel norm).
S213 = dict(S212)
"""
if "S213 = dict(S212)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s212/"):
        return S212.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s212/"):
        return S212.get(Path(name).stem)
    if name.startswith("ref-audit-s213/"):
        return S213.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s213/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s212").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s212").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s213").glob("*.png")]
"""
if 'ROOT / "ref-audit-s213"' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s213 mapping added (three sites)")
