#!/usr/bin/env python3
"""Derive capture-session186.sh + capture-census-s186.py from the s185
forms, and add the s196 mapping to the dimension checker (Session 186 —
the 134th Mode C audit cycle, the trap-4 subtractive repair + F173
registrations cycle). The honest raw-diff convention: the s186 header
replacing the s185 header + the log/session pair (the three AUTH_SECRET
harness-boot lines carried unchanged from the S181-C cascade — zero new
boot lines this cycle). This cycle's S186-A remediation PAINTS PIXELS at
the login minimal states (the back-link→header gap restored from the 8px
overlap to the honest 16px/24px rhythm on the signup/forgot/verify
cards): fresh captures expected at every login-family shot (the fix's
own purpose); the DIMENSION checker gains the s196 mapping (the 162nd
reference audit's evidence set).

Run from the repo root:  python3 scripts/derive-capture-s186.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session186.sh ----------------------------------------------------
src = (ROOT / "capture-session185.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s186 form replacing
    # the s185 form (the honest count carried in the diff)
    (
        """# Session 185 screenshot capture — the standard set re-captured on
# the S185 code (the receipt-count truth repair + F172 registrations
# cycle: the 133rd audit's 0C/0H/0M/1L/7I census — the second
# consecutive cycle with Low-severity members, again surfaced by
# measurement depth; the layer total STAYING 14,359 (the FIRST
# zero-movement cycle since S182 — the comment-text repair painting
# no lines), the comment-truth 25 TRUE / 1 FALSE (the FALSE member
# the prior cycle's own receipt comment, repaired in-cycle), the
# deferral premises holding their 59th consecutive cycle — the
# standard set re-taken at the S184 delivery + the S185 remediation
# (the S185-A count-truth repair is COMMENT-TEXT ONLY: zero
# rendered-pixel changes — byte-identical captures expected, the
# honest zero-pixel form)""",
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
    ),
    ("digma-capture185.log", "digma-capture186.log"),
    ('S="agent-browser --session clone185"', 'S="agent-browser --session clone186"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session186.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session186.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s185 run-ordinals in the new capture script
# (the header's "the S185 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s185 script's own "the S184
# delivery" reference; only the run tokens are residues)
for residue in ("capture185", "clone185", "session 185", "Session 185"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session186.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s186.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session185" does NOT contain
# "s185" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s185.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s185.py", "capture-census-s186.py"),
    ("capture-session185.sh", "capture-session186.sh"),
    ("Session 185 capture census", "Session 186 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s186.py").write_text(cdst)
print("capture-census-s186.py: derived (all tokens replaced explicitly)")

# --- the s196 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S195 = dict(S194)
"""
SITE_1_NEW = """S195 = dict(S194)

# s196 mapping (session 186 — the 162nd reference audit's evidence set + the
# S186 capture set). The standing S195 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S186 tree); no NEW
# witness this session (the S186-A gap restoration changes SPACING inside
# the login cards, not any captured element's dimensions; the capture set
# honestly expects fresh pixels at the login-family shots with unchanged
# dimensions).
S196 = dict(S195)
"""
if "S196 = dict(S195)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s195/"):
        return S195.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s195/"):
        return S195.get(Path(name).stem)
    if name.startswith("ref-audit-s196/"):
        return S196.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s196/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s195").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s195").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s196").glob("*.png")]
"""
if '(ROOT / "ref-audit-s196").glob' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s196 mapping added at all three sites")
