#!/usr/bin/env python3
"""Derive capture-session184.sh + capture-census-s184.py from the s183
forms, and add the s194 mapping to the dimension checker (Session 184 —
the 132nd Mode C audit cycle, the rendered-output-evidence OTP-guard +
shadow-pin + sRGB-gradient remediations + F171 registrations cycle).
The honest raw-diff convention: the s184 header replacing the s183
header + the log/session pair (the three AUTH_SECRET harness-boot lines
carried unchanged from the S181-C cascade — zero new boot lines this
cycle). NOTE: unlike the s183 zero-source-change form, THIS cycle's
S184-B remediation PAINTS PIXELS (the sRGB gradients + the v3 shadow
notch) — the capture set honestly expects FRESH screenshots at every
remediated surface (the fix's own purpose), the byte-identical count
falling accordingly; the DIMENSION checker is unaffected (no size
changes).

Run from the repo root:  python3 scripts/derive-capture-s184.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session184.sh ----------------------------------------------------
src = (ROOT / "capture-session183.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 12-line s184 form
    # replacing the 12-line s183 form
    (
        """# Session 183 screenshot capture — the standard set re-captured on
# the S183 code (the third-same-vocabulary issuance-prose-lockstep +
# twelfth-generation-verified + F170 registrations cycle: the 131st
# audit's 0C/0H/0M/0L/8I census — a ZERO-SOURCE-FINDING
# all-Informational cycle under the SAME master-skill vocabulary for
# the THIRD consecutive cycle, the layer total STAYING 14,313 (the
# second STAYS re-quote of the post-S181 figure), the comment-truth
# 22+14 TRUE / 0 FALSE (the zero-false direction holding its eighth
# consecutive cycle), the deferral premises holding their 57th
# consecutive cycle — the standard set re-taken at the S182 delivery
# + the S183 remediation (the issuance-prose lockstep — zero parity
# exposure)""",
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
    ),
    ("digma-capture183.log", "digma-capture184.log"),
    ('S="agent-browser --session clone183"', 'S="agent-browser --session clone184"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session184.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session184.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the 12-line header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s183 run-ordinals in the new capture script
# (the header's "the S183 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s183 script's own "the S182
# delivery" reference; only the run tokens are residues)
for residue in ("capture183", "clone183", "session 183", "Session 183"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session184.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s184.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session183" does NOT contain
# "s183" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s183.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s183.py", "capture-census-s184.py"),
    ("capture-session183.sh", "capture-session184.sh"),
    ("Session 183 capture census", "Session 184 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s184.py").write_text(cdst)
print("capture-census-s184.py: derived (all tokens replaced explicitly)")

# --- the s194 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S193 = dict(S192)
"""
SITE_1_NEW = """S193 = dict(S192)

# s194 mapping (session 184 — the 160th reference audit's evidence set + the
# S184 capture set). The standing S193 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S184 tree); no NEW
# witness this session (the S184-B rendered-output remediation changes
# PIXELS, not DIMENSIONS — every captured surface's geometry is
# byte-stable by construction; the fresh bitmaps are the fix's own
# receipt, the dimension set unchanged).
S194 = dict(S193)
"""
if "S194 = dict(S193)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s193/"):
        return S193.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s193/"):
        return S193.get(Path(name).stem)
    if name.startswith("ref-audit-s194/"):
        return S194.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s194/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s193").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s193").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s194").glob("*.png")]
"""
if '(ROOT / "ref-audit-s194").glob' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s194 mapping added at all three sites")
