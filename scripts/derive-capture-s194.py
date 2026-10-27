#!/usr/bin/env python3
"""Derive capture-session194.sh + capture-census-s194.py from the s193
forms, and add the s204 mapping to the dimension checker (Session 194 —
the 142nd Mode C audit cycle, the comment-truth repair cycle). The
honest raw-diff convention: the s194 header replacing the s193 header
+ the log/session pair (the three AUTH_SECRET harness-boot lines
carried unchanged from the S181-C cascade — zero new boot lines this
cycle). This cycle's remediation is the ONE-LINE COMMENT CORRECTION
(the layer STAYING at 14,373 — the in-place comment-correction form,
no F40 rider, one comment line changed, zero pixels moved):
byte-identical captures expected at the standing norm (the honest
zero-pixel form); the DIMENSION checker gains the s204 mapping (the
170th reference audit's evidence set).

THE HONEST COUNT this cycle: 30 raw diff lines (the s193 form's own
count was 18 — seven header lines + the log/session pair; this
cycle's header moves THIRTEEN lines because the cycle's own
character descriptors genuinely moved: the zero-Low streak ENDING,
the comment-truth census shape changing 48/0 to 49/48/1, and the
remediation form changing from zero-movement to
in-place-correction — 13 x 2 + the log/session pair's 2 x 2 = 30,
the streak-end form's own receipt; every unchanged header line of
the s193 form stays unchanged).

Run from the repo root:  python3 scripts/derive-capture-s194.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session194.sh ----------------------------------------------------
src = (ROOT / "capture-session193.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s194 form replacing
    # the s193 form (the honest count carried in the diff)
    (
        """# Session 193 screenshot capture — the standard set re-captured on
# the S193 code (the steady-state watch registrations cycle: the
# 141st audit's 0C/0H/0M/0L/4I census — the SEVENTH consecutive
# zero-Low cycle, every member informational, zero source-code
# defect; the SEVENTH consecutive cycle under the same v1.2.0
# master-skill vocabulary (the vocabulary-HOLD cycle); the layer
# total STAYING 14,373 (the zero-movement form — the
# registration-only cycle, no F40 rider), the comment-truth 48
# TRUE / 0 FALSE (the fully-TRUE form's FIFTH consecutive cycle),
# the deferral premises holding their 68th consecutive cycle — the
# standard set re-taken at the S192 delivery + the S193
# registration-only remediation (zero source-code movement:
# byte-identical captures expected, the honest zero-pixel form)""",
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
    ),
    ("digma-capture193.log", "digma-capture194.log"),
    ('S="agent-browser --session clone193"', 'S="agent-browser --session clone194"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session194.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session194.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s193 run-ordinals in the new capture script
# (the header's "the S193 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s193 script's own "the S192
# delivery" reference; only the run tokens are residues)
for residue in ("capture193", "clone193", "session 193", "Session 193"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session194.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s194.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session193" does NOT contain
# "s193" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s193.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s193.py", "capture-census-s194.py"),
    ("capture-session193.sh", "capture-session194.sh"),
    ("Session 193 capture census", "Session 194 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s194.py").write_text(cdst)
print("capture-census-s194.py: derived (all tokens replaced explicitly)")

# --- the s204 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S203 = dict(S202)
"""
SITE_1_NEW = """S203 = dict(S202)

# s204 mapping (session 194 — the 170th reference audit's evidence set + the
# S194 capture set). The standing S203 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S194 tree); no NEW
# witness this session (the comment-correction cycle paints no pixels;
# the capture set honestly expects byte-identical files at the standing
# time-dependent-pixel norm).
S204 = dict(S203)
"""
if "S204 = dict(S203)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s203/"):
        return S203.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s203/"):
        return S203.get(Path(name).stem)
    if name.startswith("ref-audit-s204/"):
        return S204.get(Path(name).stem)
"""
if 'startswith("ref-audit-s204/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s203").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s203").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s204").glob("*.png")]
"""
if 'ROOT / "ref-audit-s204"' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s204 mapping landed at all three sites")
