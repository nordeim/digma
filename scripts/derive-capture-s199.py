#!/usr/bin/env python3
"""Derive capture-session199.sh + capture-census-s199.py from the s198
forms, and add the s209 mapping to the dimension checker (Session 199 —
the 147th Mode C audit cycle, the below-threshold registrations cycle,
the second consecutive zero-Low census). The honest raw-diff
convention: the s199 header replacing the s198 header (13 changed
lines, line 14 identical into the s198 form) + the log/session pair.
This cycle's remediation is the REGISTRATION-ONLY form (zero source
changes, the layer STAYING at 14,373, no F40 rider, zero pixels
moved): byte-identical captures expected at the standing norm (the
honest zero-pixel form); the DIMENSION checker gains the s209 mapping
(the 175th reference audit's evidence set).

THE HONEST COUNT this cycle: 30 raw diff lines EXPECTED (the s199
header carrying 13 changed lines — line 14 identical into the s198
form — + the log/session pair's 2 x 2 = 30); the MEASURED count is
the record (the F174 lesson — the s196 cycle's own
30-expected/28-measured correction the precedent).

Run from the repo root:  python3 scripts/derive-capture-s199.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session199.sh ----------------------------------------------------
src = (ROOT / "capture-session198.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s199 form replacing
    # the s198 form (the honest count carried in the diff)
    (
        """# Session 198 screenshot capture — the standard set re-captured on
# the S198 code (the below-threshold registrations cycle, the first
# zero-Low census since session 192: the 146th audit's
# 0C/0H/0M/0L/4I census — zero behavioral source-code defect, zero
# comment-truth defect, the comment-truth 77 sampled / 77 TRUE /
# 0 FALSE (the first all-TRUE census, the S197 repair verified
# live-reproducing); the TWELFTH consecutive cycle under the same
# v1.2.0 master-skill vocabulary (the vocabulary-HOLD cycle in the
# honest folder-level form); the layer total STAYING
# 14,373 (the below-threshold form — zero source changes, no F40
# rider), the deferral premises holding their 73rd consecutive
# cycle — the standard set re-taken at the S197 delivery + the S198""",
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
    ),
    ("digma-capture198.log", "digma-capture199.log"),
    ('S="agent-browser --session clone198"', 'S="agent-browser --session clone199"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session199.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session199.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s198 run-ordinals in the new capture script
# (the header's "the S198 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s198 script's own "the S197
# delivery" reference; only the run tokens are residues)
for residue in ("capture198", "clone198", "session 198", "Session 198"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session199.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s199.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session198" does NOT contain
# "s198" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s198.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s198.py", "capture-census-s199.py"),
    ("capture-session198.sh", "capture-session199.sh"),
    ("Session 198 capture census", "Session 199 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s199.py").write_text(cdst)
print("capture-census-s199.py: derived (all tokens replaced explicitly)")

# --- the s209 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S208 = dict(S207)
"""
SITE_1_NEW = """S208 = dict(S207)

# s209 mapping (session 199 — the 175th reference audit's evidence set + the
# S199 capture set). The standing S208 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S199 tree); no NEW
# witness this session (the below-threshold registrations cycle paints no
# pixels; the capture set honestly expects byte-identical files at the
# standing time-dependent-pixel norm).
S209 = dict(S208)
"""
if "S209 = dict(S208)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s208/"):
        return S208.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s208/"):
        return S208.get(Path(name).stem)
    if name.startswith("ref-audit-s209/"):
        return S209.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s209/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s208").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s208").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s209").glob("*.png")]
"""
if 'ROOT / "ref-audit-s209"' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s209 mapping added (three sites)")
