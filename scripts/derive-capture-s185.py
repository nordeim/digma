#!/usr/bin/env python3
"""Derive capture-session185.sh + capture-census-s185.py from the s184
forms, and add the s195 mapping to the dimension checker (Session 185 —
the 133rd Mode C audit cycle, the receipt-count truth repair + F172
registrations cycle). The honest raw-diff convention: the s185 header
replacing the s184 header + the log/session pair (the three AUTH_SECRET
harness-boot lines carried unchanged from the S181-C cascade — zero new
boot lines this cycle). This cycle's S185-A remediation is COMMENT-TEXT
ONLY (the receipt-count correction in the --shadow-sm pin's own comment
— zero rendered-pixel changes): the capture set honestly expects
BYTE-IDENTICAL screenshots (the standard set re-taken at the S184
delivery + the S185 remediation, the comment repair painting no
pixels); the DIMENSION checker is unaffected (no size changes).

Run from the repo root:  python3 scripts/derive-capture-s185.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session185.sh ----------------------------------------------------
src = (ROOT / "capture-session184.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s185 form replacing
    # the s184 form (the 15-line s184 header -> the 14-line s185
    # header, the honest count carried in the diff)
    (
        """# Session 184 screenshot capture — the standard set re-captured on
# the S184 code (the rendered-output-evidence OTP-guard + shadow-pin
# + sRGB-gradient remediations + F171 registrations cycle: the 132nd
# audit's 0C/0H/0M/2L/6I census — the first Low-severity members
# since S181, both surfaced by measurement depth; the layer total
# MOVING 14,313 -> 14,359 (the first movement since S181, the F40
# rider), the comment-truth 25 TRUE / 1 FALSE (the stale rationale
# repaired in-cycle), the deferral premises holding their 58th
# consecutive cycle — the standard set re-taken at the S183 delivery
# + the S184 remediation (the S184-B rendered-output remediation
# PAINTS PIXELS: the sRGB brand gradients + the v3 shadow-sm notch —
# fresh captures expected at every remediated surface, the fix's own
# purpose)""",
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
    ),
    ("digma-capture184.log", "digma-capture185.log"),
    ('S="agent-browser --session clone184"', 'S="agent-browser --session clone185"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session185.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session185.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s184 run-ordinals in the new capture script
# (the header's "the S184 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s184 script's own "the S183
# delivery" reference; only the run tokens are residues)
for residue in ("capture184", "clone184", "session 184", "Session 184"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session185.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s185.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session184" does NOT contain
# "s184" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s184.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s184.py", "capture-census-s185.py"),
    ("capture-session184.sh", "capture-session185.sh"),
    ("Session 184 capture census", "Session 185 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s185.py").write_text(cdst)
print("capture-census-s185.py: derived (all tokens replaced explicitly)")

# --- the s195 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S194 = dict(S193)
"""
SITE_1_NEW = """S194 = dict(S193)

# s195 mapping (session 185 — the 161st reference audit's evidence set + the
# S185 capture set). The standing S194 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S185 tree); no NEW
# witness this session (the S185-A count-truth repair is comment-text
# only — zero rendered-pixel changes, zero dimension changes; the capture
# set honestly expects byte-identical PNGs, the zero-pixel form).
S195 = dict(S194)
"""
if "S195 = dict(S194)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s194/"):
        return S194.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s194/"):
        return S194.get(Path(name).stem)
    if name.startswith("ref-audit-s195/"):
        return S195.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s195/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s194").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s194").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s195").glob("*.png")]
"""
if '(ROOT / "ref-audit-s195").glob' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s195 mapping added at all three sites")
