#!/usr/bin/env python3
"""Derive capture-session187.sh + capture-census-s187.py from the s186
forms, and add the s197 mapping to the dimension checker (Session 187 —
the 135th Mode C audit cycle, the window-start-label correction + F174
registrations cycle). The honest raw-diff convention: the s187 header
replacing the s186 header + the log/session pair (the three AUTH_SECRET
harness-boot lines carried unchanged from the S181-C cascade — zero new
boot lines this cycle). This cycle's remediation is REGISTRATION-ONLY
(zero source-code movement, the layer STAYING 14,365): byte-identical
captures expected at the standing norm (the honest zero-pixel form);
the DIMENSION checker gains the s197 mapping (the 163rd reference
audit's evidence set).

Run from the repo root:  python3 scripts/derive-capture-s187.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session187.sh ----------------------------------------------------
src = (ROOT / "capture-session186.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s187 form replacing
    # the s186 form (the honest count carried in the diff)
    (
        """# Session 186 screenshot capture — the standard set re-captured on
# the S186 code (the trap-4 subtractive repair + F173 registrations
# cycle: the 134th audit's 0C/0H/0M/1L/6I census — the third
# consecutive cycle with Low-severity members, again surfaced by
# measurement depth; the layer total MOVING 14,359 -> 14,365 (the F40
# rider — the receipt comment's own +6, a deliberate remediation
# never drift), the comment-truth 31 TRUE / 0 FALSE (the zero-false
# direction returning), the deferral premises holding their 60th
# consecutive cycle — the standard set re-taken at the S185 delivery
# + the S186 remediation (the S186-A trap-4 repair PAINTS PIXELS at
# the login minimal states: the back-link→header gap restored from
# the 8px overlap to the honest 16px/24px rhythm — fresh captures
# expected at every login-family shot, the fix's own purpose)""",
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
    ),
    ("digma-capture186.log", "digma-capture187.log"),
    ('S="agent-browser --session clone186"', 'S="agent-browser --session clone187"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session187.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session187.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s186 run-ordinals in the new capture script
# (the header's "the S186 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s186 script's own "the S185
# delivery" reference; only the run tokens are residues)
for residue in ("capture186", "clone186", "session 186", "Session 186"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session187.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s187.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session186" does NOT contain
# "s186" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s186.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s186.py", "capture-census-s187.py"),
    ("capture-session186.sh", "capture-session187.sh"),
    ("Session 186 capture census", "Session 187 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s187.py").write_text(cdst)
print("capture-census-s187.py: derived (all tokens replaced explicitly)")

# --- the s197 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S196 = dict(S195)
"""
SITE_1_NEW = """S196 = dict(S195)

# s197 mapping (session 187 — the 163rd reference audit's evidence set + the
# S187 capture set). The standing S196 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S187 tree); no NEW
# witness this session (the registration-only cycle paints no pixels;
# the capture set honestly expects byte-identical files at the standing
# time-dependent-pixel norm).
S197 = dict(S196)
"""
if "S197 = dict(S196)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s196/"):
        return S196.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s196/"):
        return S196.get(Path(name).stem)
    if name.startswith("ref-audit-s197/"):
        return S197.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s197/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s196").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s196").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s197").glob("*.png")]
"""
if '(ROOT / "ref-audit-s197").glob' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s197 mapping added at all three sites")
