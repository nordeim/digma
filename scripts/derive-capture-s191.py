#!/usr/bin/env python3
"""Derive capture-session191.sh + capture-census-s191.py from the s190
forms, and add the s201 mapping to the dimension checker (Session 191 —
the 139th Mode C audit cycle, the repair-verification truth registrations
cycle). The honest raw-diff convention: the s191 header replacing the
s190 header + the log/session pair (the three AUTH_SECRET harness-boot
lines carried unchanged from the S181-C cascade — zero new boot lines
this cycle). This cycle's remediation is REGISTRATION-ONLY (the layer
STAYING at 14,373 — the zero-movement form, no F40 rider, zero
source-code change): byte-identical captures expected at the standing
norm (the honest zero-pixel form); the DIMENSION checker gains the
s201 mapping (the 167th reference audit's evidence set).

Run from the repo root:  python3 scripts/derive-capture-s191.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session191.sh ----------------------------------------------------
src = (ROOT / "capture-session190.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s191 form replacing
    # the s190 form (the honest count carried in the diff)
    (
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
        """# Session 191 screenshot capture — the standard set re-captured on
# the S191 code (the repair-verification truth registrations cycle: the
# 139th audit's 0C/0H/0M/0L/4I census — the FIFTH consecutive
# zero-Low cycle, every member informational, zero source-code
# defect; the FIFTH consecutive cycle under the same v1.2.0
# master-skill vocabulary (the vocabulary-HOLD cycle); the layer
# total STAYING 14,373 (the zero-movement form — the
# registration-only cycle, no F40 rider), the comment-truth 48
# TRUE / 0 FALSE (the fully-TRUE form's THIRD consecutive cycle),
# the deferral premises holding their 66th consecutive cycle — the
# standard set re-taken at the S190 delivery + the S191
# registration-only remediation (zero source-code movement:
# byte-identical captures expected, the honest zero-pixel form)""",
    ),
    ("digma-capture190.log", "digma-capture191.log"),
    ('S="agent-browser --session clone190"', 'S="agent-browser --session clone191"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session191.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session191.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s190 run-ordinals in the new capture script
# (the header's "the S190 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s190 script's own "the S189
# delivery" reference; only the run tokens are residues)
for residue in ("capture190", "clone190", "session 190", "Session 190"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session191.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s191.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session190" does NOT contain
# "s190" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s190.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s190.py", "capture-census-s191.py"),
    ("capture-session190.sh", "capture-session191.sh"),
    ("Session 190 capture census", "Session 191 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s191.py").write_text(cdst)
print("capture-census-s191.py: derived (all tokens replaced explicitly)")

# --- the s201 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S200 = dict(S199)
"""
SITE_1_NEW = """S200 = dict(S199)

# s201 mapping (session 191 — the 167th reference audit's evidence set + the
# S191 capture set). The standing S200 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S191 tree); no NEW
# witness this session (the registration-only cycle paints no pixels;
# the capture set honestly expects byte-identical files at the standing
# time-dependent-pixel norm).
S201 = dict(S200)
"""
if "S201 = dict(S200)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s200/"):
        return S200.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s200/"):
        return S200.get(Path(name).stem)
    if name.startswith("ref-audit-s201/"):
        return S201.get(Path(name).stem)
"""
if 'startswith("ref-audit-s201/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s200").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s200").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s201").glob("*.png")]
"""
if 'ROOT / "ref-audit-s201"' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s201 mapping landed at all three sites")
