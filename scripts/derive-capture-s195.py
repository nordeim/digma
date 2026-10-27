#!/usr/bin/env python3
"""Derive capture-session195.sh + capture-census-s195.py from the s194
forms, and add the s205 mapping to the dimension checker (Session 195 —
the 143rd Mode C audit cycle, the comment-truth repair cycle, the
second consecutive). The honest raw-diff convention: the s195 header
replacing the s194 header + the log/session pair (the three
AUTH_SECRET harness-boot lines carried unchanged from the S181-C
cascade — zero new boot lines this cycle). This cycle's remediation is
the ONE-LINE COMMENT CORRECTION (the layer STAYING at 14,373 — the
in-place comment-correction form, no F40 rider, one comment line
changed, zero pixels moved): byte-identical captures expected at the
standing norm (the honest zero-pixel form); the DIMENSION checker
gains the s205 mapping (the 171st reference audit's evidence set).

THE HONEST COUNT this cycle: 30 raw diff lines expected (the s194
form's own count — the header moving 13 lines line-for-line with the
cycle's own character descriptors: the second-consecutive-Low form,
the census shape staying 49/48/1, the premises ordinal moving to the
70th; 13 x 2 + the log/session pair's 2 x 2 = 30, the honest count;
every unchanged header line of the s194 form stays unchanged).

Run from the repo root:  python3 scripts/derive-capture-s195.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session195.sh ----------------------------------------------------
src = (ROOT / "capture-session194.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s195 form replacing
    # the s194 form (the honest count carried in the diff)
    (
        """# Session 194 screenshot capture — the standard set re-captured on
# the S194 code (the comment-truth repair cycle: the 142nd audit's
# 0C/0H/0M/1L/4I census — the seven-cycle zero-Low streak ended at
# an honest comment-truth Low, zero behavioral source-code defect;
# the EIGHTH consecutive cycle under the same v1.2.0 master-skill
# vocabulary (the vocabulary-HOLD cycle); the layer total STAYING
# 14,373 (the in-place comment-correction form — one comment line
# changed, no F40 rider), the comment-truth 49 sampled / 48 TRUE /
# 1 FALSE (the honest form — the FALSE member being the Low itself,
# the fix applied), the deferral premises holding their 69th
# consecutive cycle — the standard set re-taken at the S193
# delivery + the S194 comment-correction remediation (zero pixels
# moved: byte-identical captures expected, the honest zero-pixel form)""",
        """# Session 195 screenshot capture — the standard set re-captured on
# the S195 code (the comment-truth repair cycle, the second
# consecutive: the 143rd audit's 0C/0H/0M/1L/4I census — a second
# consecutive comment-truth Low, zero behavioral source-code defect;
# the NINTH consecutive cycle under the same v1.2.0 master-skill
# vocabulary (the vocabulary-HOLD cycle); the layer total STAYING
# 14,373 (the in-place comment-correction form — one comment line
# changed, no F40 rider), the comment-truth 49 sampled / 48 TRUE /
# 1 FALSE (the honest form — the second FALSE member in two cycles,
# both illustrative figures, the fix applied), the deferral premises
# holding their 70th consecutive cycle — the standard set re-taken
# at the S194 delivery + the S195 comment-correction remediation
# (zero pixels moved: byte-identical captures expected, the honest
# zero-pixel form)""",
    ),
    ("digma-capture194.log", "digma-capture195.log"),
    ('S="agent-browser --session clone194"', 'S="agent-browser --session clone195"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session195.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session195.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s194 run-ordinals in the new capture script
# (the header's "the S194 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s194 script's own "the S193
# delivery" reference; only the run tokens are residues)
for residue in ("capture194", "clone194", "session 194", "Session 194"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session195.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s195.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session194" does NOT contain
# "s194" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s194.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s194.py", "capture-census-s195.py"),
    ("capture-session194.sh", "capture-session195.sh"),
    ("Session 194 capture census", "Session 195 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s195.py").write_text(cdst)
print("capture-census-s195.py: derived (all tokens replaced explicitly)")

# --- the s205 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S204 = dict(S203)
"""
SITE_1_NEW = """S204 = dict(S203)

# s205 mapping (session 195 — the 171st reference audit's evidence set + the
# S195 capture set). The standing S204 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S195 tree); no NEW
# witness this session (the comment-correction cycle paints no pixels;
# the capture set honestly expects byte-identical files at the standing
# time-dependent-pixel norm).
S205 = dict(S204)
"""
if "S205 = dict(S204)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s204/"):
        return S204.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s204/"):
        return S204.get(Path(name).stem)
    if name.startswith("ref-audit-s205/"):
        return S205.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s205/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s204").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s204").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s205").glob("*.png")]
"""
if 'ROOT / "ref-audit-s205"' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s205 mapping added (three sites)")
