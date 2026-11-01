#!/usr/bin/env python3
"""Derive capture-session200.sh + capture-census-s200.py from the s199
forms, and add the s210 mapping to the dimension checker (Session 200 —
the 148th Mode C audit cycle, the below-threshold registrations cycle,
the third consecutive zero-Low census). The honest raw-diff
convention: the s200 header replacing the s199 header (13 changed
lines) + the log/session pair. This cycle's remediation is the
REGISTRATION-ONLY form (zero source changes, the layer STAYING at
14,373, no F40 rider, zero pixels moved): byte-identical captures
expected at the standing norm (the honest zero-pixel form); the
DIMENSION checker gains the s210 mapping (the 176th reference audit's
evidence set).

THE HONEST COUNT this cycle: 30 raw diff lines EXPECTED (the s200
header carrying 13 changed lines + the log/session pair's 2 x 2);
the MEASURED count is the record (the F174 lesson — the s199 cycle's
own 30-expected/26-measured correction the standing precedent).

Run from the repo root:  python3 scripts/derive-capture-s200.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session200.sh ----------------------------------------------------
src = (ROOT / "capture-session199.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s200 form replacing
    # the s199 form (the honest count carried in the diff)
    (
        """# Session 199 screenshot capture — the standard set re-captured on
# the S199 code (the below-threshold registrations cycle, the second
# consecutive zero-Low census: the 147th audit's 0C/0H/0M/0L/6I
# census — zero behavioral source-code defect, zero comment-truth
# defect, the comment-truth 162 sampled / 162 TRUE / 0 FALSE (the
# second consecutive all-TRUE census, the first all-TRUE form held
# at a more-than-doubled sample); the THIRTEENTH consecutive cycle
# under the same v1.2.0 master-skill vocabulary (the vocabulary-HOLD
# cycle in the honest folder-level form); the layer total STAYING
# 14,373 (the below-threshold form — zero source changes, no F40
# rider), the deferral premises holding their 74th consecutive
# cycle — the standard set re-taken at the S198 delivery + the S199""",
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
# S199 delivery + the S200""",
    ),
    ("digma-capture199.log", "digma-capture200.log"),
    ('S="agent-browser --session clone199"', 'S="agent-browser --session clone200"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session200.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session200.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s199 run-ordinals in the new capture script
# (the header's "the S199 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s199 script's own "the S198
# delivery" reference; only the run tokens are residues)
for residue in ("capture199", "clone199", "session 199", "Session 199"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session200.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s200.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session199" does NOT contain
# "s199" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s199.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s199.py", "capture-census-s200.py"),
    ("capture-session199.sh", "capture-session200.sh"),
    ("Session 199 capture census", "Session 200 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s200.py").write_text(cdst)
print("capture-census-s200.py: derived (all tokens replaced explicitly)")

# --- the s210 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S209 = dict(S208)
"""
SITE_1_NEW = """S209 = dict(S208)

# s210 mapping (session 200 — the 176th reference audit's evidence set + the
# S200 capture set). The standing S209 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S200 tree); no NEW
# witness this session (the below-threshold registrations cycle paints no
# pixels; the capture set honestly expects byte-identical files at the
# standing time-dependent-pixel norm).
S210 = dict(S209)
"""
if "S210 = dict(S209)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s209/"):
        return S209.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s209/"):
        return S209.get(Path(name).stem)
    if name.startswith("ref-audit-s210/"):
        return S210.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s210/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s209").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s209").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s210").glob("*.png")]
"""
if 'ROOT / "ref-audit-s210"' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s210 mapping added (three sites)")
