#!/usr/bin/env python3
"""Derive capture-session188.sh + capture-census-s188.py from the s187
forms, and add the s198 mapping to the dimension checker (Session 188 —
the 136th Mode C audit cycle, the exclusion-clause comment-truth repair
+ F175 registrations cycle). The honest raw-diff convention: the s188
header replacing the s187 header + the log/session pair (the three
AUTH_SECRET harness-boot lines carried unchanged from the S181-C
cascade — zero new boot lines this cycle). This cycle's remediation is
COMMENT-TEXT-ONLY in the source (the layer MOVING 14,365 -> 14,373 on
the amendment's own +8 lines — the F40 rider fully engaged, but zero
executable-code change): byte-identical captures expected at the
standing norm (the honest zero-pixel form); the DIMENSION checker gains
the s198 mapping (the 164th reference audit's evidence set).

Run from the repo root:  python3 scripts/derive-capture-s188.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session188.sh ----------------------------------------------------
src = (ROOT / "capture-session187.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s188 form replacing
    # the s187 form (the honest count carried in the diff)
    (
        """# Session 187 screenshot capture — the standard set re-captured on
# the S187 code (the window-start-label correction + F174
# registrations cycle: the 135th audit's 0C/0H/0M/0L/3I census — the
# FIRST zero-Low cycle since S183, every member of the F170
# coordinate-precision family, zero source-code defect; the FIRST
# cycle under the NEW v1.2.0 master-skill vocabulary — three of
# digma's registered deviations converted to sanctioned patterns;
# the layer total STAYING 14,365 (the zero-movement form — no
# remediation receipt), the comment-truth 31 TRUE / 0 FALSE (the
# zero-false direction holding a second consecutive cycle), the
# deferral premises holding their 62nd consecutive cycle — the
# standard set re-taken at the S186 delivery + the S187
# registration-only remediation (zero source-code movement:
# byte-identical captures expected, the honest zero-pixel form)""",
        """# Session 188 screenshot capture — the standard set re-captured on
# the S188 code (the exclusion-clause comment-truth repair + F175
# registrations cycle: the 136th audit's 0C/0H/0M/0L/3I census — the
# SECOND consecutive zero-Low cycle, every member informational,
# zero source-code defect; the SECOND consecutive cycle under the
# same v1.2.0 master-skill vocabulary (the vocabulary-HOLD cycle);
# the layer total MOVING 14,365 -> 14,373 (the F40 rider fully
# engaged — the comment amendment's own +8 lines, a deliberate
# remediation never drift, zero executable-code change), the
# comment-truth 30 TRUE / 1 FALSE (the first FALSE census member in
# three cycles — the S129-A clause itself, repaired in-cycle), the
# deferral premises holding their 63rd consecutive cycle — the
# standard set re-taken at the S187 delivery + the S188
# comment-truth remediation (comment-text only in the source:
# byte-identical captures expected, the honest zero-pixel form)""",
    ),
    ("digma-capture187.log", "digma-capture188.log"),
    ('S="agent-browser --session clone187"', 'S="agent-browser --session clone188"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session188.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session188.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s187 run-ordinals in the new capture script
# (the header's "the S187 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s187 script's own "the S186
# delivery" reference; only the run tokens are residues)
for residue in ("capture187", "clone187", "session 187", "Session 187"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session188.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s188.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session187" does NOT contain
# "s187" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s187.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s187.py", "capture-census-s188.py"),
    ("capture-session187.sh", "capture-session188.sh"),
    ("Session 187 capture census", "Session 188 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s188.py").write_text(cdst)
print("capture-census-s188.py: derived (all tokens replaced explicitly)")

# --- the s198 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S197 = dict(S196)
"""
SITE_1_NEW = """S197 = dict(S196)

# s198 mapping (session 188 — the 164th reference audit's evidence set + the
# S188 capture set). The standing S197 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S188 tree); no NEW
# witness this session (the comment-truth cycle paints no pixels;
# the capture set honestly expects byte-identical files at the standing
# time-dependent-pixel norm).
S198 = dict(S197)
"""
if "S198 = dict(S197)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s197/"):
        return S197.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s197/"):
        return S197.get(Path(name).stem)
    if name.startswith("ref-audit-s198/"):
        return S198.get(Path(name).stem)
"""
if 'startswith("ref-audit-s198/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s197").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s197").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s198").glob("*.png")]
"""
if 'ROOT / "ref-audit-s198"' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s198 mapping landed at all three sites")
