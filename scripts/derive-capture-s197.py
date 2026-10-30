#!/usr/bin/env python3
"""Derive capture-session197.sh + capture-census-s197.py from the s196
forms, and add the s207 mapping to the dimension checker (Session 197 —
the 145th Mode C audit cycle, the comment-truth repair cycle, the
fourth consecutive). The honest raw-diff convention: the s197 header
replacing the s196 header + the log/session pair (the three
AUTH_SECRET harness-boot lines carried unchanged from the S181-C
cascade — zero new boot lines this cycle). This cycle's remediation is
the TWO-FIGURE COMMENT CORRECTION at six live claim sites (the layer
STAYING at 14,373 — the in-place comment-correction form, no F40
rider, two figures changed, zero pixels moved): byte-identical
captures expected at the standing norm (the honest zero-pixel form);
the DIMENSION checker gains the s207 mapping (the 173rd reference
audit's evidence set).

THE HONEST COUNT this cycle: 24 raw diff lines EXPECTED (the s197
header carrying 10 changed lines — lines 4/6/13/14 of the s196 form
identical into the s197 form — + the log/session pair's 2 x 2 = 24);
the MEASURED count is the record (the F174 lesson — the s196 cycle's
own 30-expected/28-measured correction the precedent).

Run from the repo root:  python3 scripts/derive-capture-s197.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session197.sh ----------------------------------------------------
src = (ROOT / "capture-session196.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the s197 form replacing
    # the s196 form (the honest count carried in the diff)
    (
        """# Session 196 screenshot capture — the standard set re-captured on
# the S196 code (the comment-truth repair cycle, the third
# consecutive: the 144th audit's 0C/0H/0M/1L/5I census — a third
# consecutive comment-truth Low, zero behavioral source-code defect;
# the TENTH consecutive cycle under the same v1.2.0 master-skill
# vocabulary (the vocabulary-HOLD cycle); the layer total STAYING
# 14,373 (the in-place comment-correction form — one word changed
# at three live claim sites, no F40 rider), the comment-truth 49
# sampled / 48 TRUE / 1 FALSE (the honest form — the third
# consecutive FALSE member, all count figures, the fix applied),
# the deferral premises holding their 71st consecutive cycle — the
# standard set re-taken at the S195 delivery + the S196
# comment-correction remediation (zero pixels moved: byte-identical
# captures expected, the honest zero-pixel form)""",
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
    ),
    ("digma-capture196.log", "digma-capture197.log"),
    ('S="agent-browser --session clone196"', 'S="agent-browser --session clone197"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session197.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session197.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s196 run-ordinals in the new capture script
# (the header's "the S196 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s196 script's own "the S195
# delivery" reference; only the run tokens are residues)
for residue in ("capture196", "clone196", "session 196", "Session 196"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session197.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s197.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session196" does NOT contain
# "s196" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s196.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s196.py", "capture-census-s197.py"),
    ("capture-session196.sh", "capture-session197.sh"),
    ("Session 196 capture census", "Session 197 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s197.py").write_text(cdst)
print("capture-census-s197.py: derived (all tokens replaced explicitly)")

# --- the s207 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S206 = dict(S205)
"""
SITE_1_NEW = """S206 = dict(S205)

# s207 mapping (session 197 — the 173rd reference audit's evidence set + the
# S197 capture set). The standing S206 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S197 tree); no NEW
# witness this session (the comment-correction cycle paints no pixels;
# the capture set honestly expects byte-identical files at the standing
# time-dependent-pixel norm).
S207 = dict(S206)
"""
if "S207 = dict(S206)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s206/"):
        return S206.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s206/"):
        return S206.get(Path(name).stem)
    if name.startswith("ref-audit-s207/"):
        return S207.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s207/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s206").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s206").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s207").glob("*.png")]
"""
if 'ROOT / "ref-audit-s207"' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s207 mapping added (three sites)")
