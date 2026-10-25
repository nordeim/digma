#!/usr/bin/env python3
"""Derive capture-session190.sh + capture-census-s190.py from the s189
forms, and add the s200 mapping to the dimension checker (Session 190 —
the 138th Mode C audit cycle, the enumeration-axis truth registrations
cycle). The honest raw-diff convention: the s190 header replacing the
s189 header + the log/session pair (the three AUTH_SECRET harness-boot
lines carried unchanged from the S181-C cascade — zero new boot lines
this cycle). This cycle's remediation is REGISTRATION-ONLY (the layer
STAYING at 14,373 — the zero-movement form, no F40 rider, zero
source-code change): byte-identical captures expected at the standing
norm (the honest zero-pixel form); the DIMENSION checker gains the
s200 mapping (the 166th reference audit's evidence set).

Run from the repo root:  python3 scripts/derive-capture-s190.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session190.sh ----------------------------------------------------
src = (ROOT / "capture-session189.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s190 form replacing
    # the s189 form (the honest count carried in the diff)
    (
        """# Session 189 screenshot capture — the standard set re-captured on
# the S189 code (the premise-label truth registrations cycle: the
# 137th audit's 0C/0H/0M/0L/2I census — the THIRD consecutive
# zero-Low cycle, every member informational, zero source-code
# defect; the THIRD consecutive cycle under the same v1.2.0
# master-skill vocabulary (the vocabulary-HOLD cycle); the layer
# total STAYING 14,373 (the zero-movement form — the
# registration-only cycle, no F40 rider), the comment-truth 31
# TRUE / 0 FALSE (the fully-TRUE form's first cycle since S187,
# the S188-A amendment's own clause now verifying TRUE), the
# deferral premises holding their 64th consecutive cycle — the
# standard set re-taken at the S188 delivery + the S189
# registration-only remediation (zero source-code movement:
# byte-identical captures expected, the honest zero-pixel form)""",
        """# Session 190 screenshot capture — the standard set re-captured on
# the S190 code (the enumeration-axis truth registrations cycle: the
# 138th audit's 0C/0H/0M/0L/3I census — the FOURTH consecutive
# zero-Low cycle, every member informational, zero source-code
# defect; the FOURTH consecutive cycle under the same v1.2.0
# master-skill vocabulary (the vocabulary-HOLD cycle); the layer
# total STAYING 14,373 (the zero-movement form — the
# registration-only cycle, no F40 rider), the comment-truth 31
# TRUE / 0 FALSE (the fully-TRUE form's SECOND consecutive cycle),
# the deferral premises holding their 65th consecutive cycle — the
# standard set re-taken at the S189 delivery + the S190
# registration-only remediation (zero source-code movement:
# byte-identical captures expected, the honest zero-pixel form)""",
    ),
    ("digma-capture189.log", "digma-capture190.log"),
    ('S="agent-browser --session clone189"', 'S="agent-browser --session clone190"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session190.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session190.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s189 run-ordinals in the new capture script
# (the header's "the S189 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s189 script's own "the S188
# delivery" reference; only the run tokens are residues)
for residue in ("capture189", "clone189", "session 189", "Session 189"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session190.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s190.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session189" does NOT contain
# "s189" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s189.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s189.py", "capture-census-s190.py"),
    ("capture-session189.sh", "capture-session190.sh"),
    ("Session 189 capture census", "Session 190 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s190.py").write_text(cdst)
print("capture-census-s190.py: derived (all tokens replaced explicitly)")

# --- the s200 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S199 = dict(S198)
"""
SITE_1_NEW = """S199 = dict(S198)

# s200 mapping (session 190 — the 166th reference audit's evidence set + the
# S190 capture set). The standing S199 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S190 tree); no NEW
# witness this session (the registration-only cycle paints no pixels;
# the capture set honestly expects byte-identical files at the standing
# time-dependent-pixel norm).
S200 = dict(S199)
"""
if "S200 = dict(S199)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s199/"):
        return S199.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s199/"):
        return S199.get(Path(name).stem)
    if name.startswith("ref-audit-s200/"):
        return S200.get(Path(name).stem)
"""
if 'startswith("ref-audit-s200/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s199").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s199").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s200").glob("*.png")]
"""
if 'ROOT / "ref-audit-s200"' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s200 mapping landed at all three sites")
