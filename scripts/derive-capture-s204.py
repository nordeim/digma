#!/usr/bin/env python3
"""Derive capture-session204.sh + capture-census-s204.py from the s203
forms, and add the s214 mapping to the dimension checker (Session 204 —
the 152nd Mode C audit cycle, the below-threshold registrations + the
F188 third-full-cycle pass). The honest raw-diff convention: the s204
header replacing the s203 header + the log/session pair.
This cycle's remediation is the REGISTRATION-ONLY form (the registration
pair + the spec + the collateral the only mutations; the layer STAYING
at 14,373, no F40 rider, zero app pixels moved): byte-identical
captures expected at the standing norm (the honest zero-pixel form);
the DIMENSION checker gains the s214 mapping (the 180th reference
audit's evidence set).

THE HONEST COUNT this cycle: the MEASURED count is the record (the
F174 lesson — the forecast carries the header-pair arithmetic, the
measured figure ships).

Run from the repo root:  python3 scripts/derive-capture-s204.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session204.sh ----------------------------------------------------
src = (ROOT / "capture-session203.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s204 form replacing
    # the s203 form (the honest count carried in the diff)
    (
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
        """# Session 204 screenshot capture — the standard set re-captured on
# the S204 code (the below-threshold registrations + the F188
# third-full-cycle pass: the 152nd audit's 0C/0H/0M/0L/3I census —
# a BELOW-THRESHOLD cycle, the fifth zero-Low census in seven
# cycles, zero behavioral source-code defect, zero comment-truth
# defect, the comment-truth 550 sampled / 550 TRUE / 0 FALSE (the
# all-TRUE census restored — the streak at one; the F188
# pointer-following guard's third full-cycle pass: 54 pointers
# followed — 20 client-layer + 34 route/lib — ALL TRUE, both prior
# catches confirmed standing, not recurring); the EIGHTEENTH
# consecutive cycle under the same v1.2.0 master-skill vocabulary
# (the vocabulary-HOLD cycle in the honest folder-level form); the
# layer total STAYING 14,373 (the registration-only form — zero
# src/ changes, no F40 rider), the deferral premises holding their
# 79th consecutive cycle — the standard set re-taken at the S203
# delivery + the S204 registrations (zero app pixels moved:
# byte-identical captures expected, the honest zero-pixel form)""",
    ),
    ("digma-capture203.log", "digma-capture204.log"),
    ('S="agent-browser --session clone203"', 'S="agent-browser --session clone204"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session204.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session204.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s203 run-ordinals in the new capture script
# (the header's "the S203 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s203 script's own "the S202
# delivery" reference; only the run tokens are residues)
for residue in ("capture203", "clone203", "session 203", "Session 203"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session204.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s204.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session203" does NOT contain
# "s203" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s203.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s203.py", "capture-census-s204.py"),
    ("capture-session203.sh", "capture-session204.sh"),
    ("Session 203 capture census", "Session 204 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s204.py").write_text(cdst)
print("capture-census-s204.py: derived (all tokens replaced explicitly)")

# --- the s214 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S213 = dict(S212)
"""
SITE_1_NEW = """S213 = dict(S212)

# s214 mapping (session 204 — the 180th reference audit's evidence set + the
# S204 capture set). The standing S213 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S204 tree); no NEW
# witness this session (the registration-only cycle paints no
# app pixels; the capture set honestly expects byte-identical files at the
# standing time-dependent-pixel norm).
S214 = dict(S213)
"""
if "S214 = dict(S213)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s213/"):
        return S213.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s213/"):
        return S213.get(Path(name).stem)
    if name.startswith("ref-audit-s214/"):
        return S214.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s214/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s213").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s213").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s214").glob("*.png")]
"""
if 'ROOT / "ref-audit-s214"' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s214 mapping added (three sites)")
