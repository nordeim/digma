#!/usr/bin/env python3
"""Derive capture-session198.sh + capture-census-s198.py from the s197
forms, and add the s208 mapping to the dimension checker (Session 198 —
the 146th Mode C audit cycle, the below-threshold registrations cycle,
the first zero-Low census since session 192). The honest raw-diff
convention: the s198 header replacing the s197 header + the
log/session pair (the three AUTH_SECRET harness-boot lines carried
unchanged from the S181-C cascade — zero new boot lines this cycle).
This cycle's remediation is the REGISTRATION-ONLY form (zero source
changes, the layer STAYING at 14,373, no F40 rider, zero pixels
moved): byte-identical captures expected at the standing norm (the
honest zero-pixel form); the DIMENSION checker gains the s208 mapping
(the 174th reference audit's evidence set).

THE HONEST COUNT this cycle: 30 raw diff lines EXPECTED (the s198
header carrying 13 changed lines — line 14 identical into the s197
form — + the log/session pair's 2 x 2 = 30); the MEASURED count is
the record (the F174 lesson — the s196 cycle's own
30-expected/28-measured correction the precedent).

Run from the repo root:  python3 scripts/derive-capture-s198.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session198.sh ----------------------------------------------------
src = (ROOT / "capture-session197.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s198 form replacing
    # the s197 form (the honest count carried in the diff)
    (
        """# Session 197 screenshot capture — the standard set re-captured on
# the S197 code (the comment-truth repair cycle, the fourth
# consecutive: the 145th audit's 0C/0H/0M/1L/2I census — a fourth
# consecutive comment-truth Low, zero behavioral source-code defect;
# the ELEVENTH consecutive cycle under the same v1.2.0 master-skill
# vocabulary (the vocabulary-HOLD cycle); the layer total STAYING
# 14,373 (the in-place comment-correction form — two figures changed
# at six live claim sites, no F40 rider), the comment-truth 49
# sampled / 48 TRUE / 1 FALSE (the honest form — the fourth
# consecutive single-FALSE member, all count figures, the fix
# applied), the deferral premises holding their 72nd consecutive
# cycle — the standard set re-taken at the S196 delivery + the S197
# comment-correction remediation (zero pixels moved: byte-identical
# captures expected, the honest zero-pixel form)""",
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
# cycle — the standard set re-taken at the S197 delivery + the S198
# below-threshold registrations (zero pixels moved: byte-identical
# captures expected, the honest zero-pixel form)""",
    ),
    ("digma-capture197.log", "digma-capture198.log"),
    ('S="agent-browser --session clone197"', 'S="agent-browser --session clone198"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session198.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session198.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s197 run-ordinals in the new capture script
# (the header's "the S197 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s197 script's own "the S196
# delivery" reference; only the run tokens are residues)
for residue in ("capture197", "clone197", "session 197", "Session 197"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session198.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s198.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session197" does NOT contain
# "s197" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s197.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s197.py", "capture-census-s198.py"),
    ("capture-session197.sh", "capture-session198.sh"),
    ("Session 197 capture census", "Session 198 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s198.py").write_text(cdst)
print("capture-census-s198.py: derived (all tokens replaced explicitly)")

# --- the s208 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S207 = dict(S206)
"""
SITE_1_NEW = """S207 = dict(S206)

# s208 mapping (session 198 — the 174th reference audit's evidence set + the
# S198 capture set). The standing S207 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S198 tree); no NEW
# witness this session (the below-threshold registrations cycle paints no
# pixels; the capture set honestly expects byte-identical files at the
# standing time-dependent-pixel norm).
S208 = dict(S207)
"""
if "S208 = dict(S207)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s207/"):
        return S207.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s207/"):
        return S207.get(Path(name).stem)
    if name.startswith("ref-audit-s208/"):
        return S208.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s208/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s207").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s207").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s208").glob("*.png")]
"""
if 'ROOT / "ref-audit-s208"' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s208 mapping added (three sites)")
