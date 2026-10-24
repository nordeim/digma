#!/usr/bin/env python3
"""Derive capture-session183.sh + capture-census-s183.py from the s182
forms, and add the s193 mapping to the dimension checker (Session 183 —
the 131st Mode C audit cycle, the third-same-vocabulary
issuance-prose-lockstep + twelfth-generation-verified + F170
registrations cycle). The honest raw-diff convention: the s183 header
replacing the s182 header + the log/session pair (the three AUTH_SECRET
harness-boot lines carried unchanged from the S181-C cascade — zero new
boot lines this cycle, the zero-source-change capture form).

Run from the repo root:  python3 scripts/derive-capture-s183.py
"""
from pathlib import Path
import difflib

ROOT = Path("/home/z/my-project/digma/scripts")

# --- capture-session183.sh ----------------------------------------------------
src = (ROOT / "capture-session182.sh").read_text()
dst = src

subs = [
    # the header block (session descriptor) — the 12-line s183 form
    # replacing the 12-line s182 form
    (
        """# Session 182 screenshot capture — the standard set re-captured on
# the S182 code (the same-vocabulary-hold schema-comment-lockstep +
# eleventh-generation-corrected + F169 registrations cycle: the 130th
# audit's 0C/0H/0M/0L/8I census — a ZERO-SOURCE-FINDING
# all-Informational cycle under the SAME master-skill vocabulary,
# the layer total STAYING 14,313 (the first STAYS re-quote of the
# post-S181 figure), the comment-truth 22+14 TRUE / 0 FALSE (the
# zero-false direction holding its seventh consecutive cycle), the
# deferral premises holding their 56th consecutive cycle — the
# standard set re-taken at the S181 delivery + the S182 remediation
# (the schema-comment lockstep — zero parity exposure)""",
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
    ),
    ("digma-capture182.log", "digma-capture183.log"),
    ('S="agent-browser --session clone182"', 'S="agent-browser --session clone183"'),
]

changed = 0
for old, new in subs:
    if old not in dst:
        raise SystemExit(f"MISSING SUBSTRING: {old[:80]!r}")
    changed += dst.count(old)
    dst = dst.replace(old, new)

(ROOT / "capture-session183.sh").write_text(dst)

diff = [
    ln
    for ln in difflib.unified_diff(
        src.splitlines(), dst.splitlines(), lineterm="", n=0
    )
    if ln.startswith(("+", "-")) and not ln.startswith(("+++", "---"))
]
print(f"capture-session183.sh: {changed} substitution sites, {len(diff)} raw diff lines")
print(f"the honest count (the 12-line header pair + the log/session pair — the AUTH_SECRET boots carried unchanged): {len(diff)}")

# residue check: zero s182 run-ordinals in the new capture script
# (the header's "the S182 delivery" reference is the LEGITIMATE
# prior-delivery form — exactly the s182 script's own "the S181
# delivery" reference; only the run tokens are residues)
for residue in ("capture182", "clone182", "session 182", "Session 182"):
    if residue in dst:
        raise SystemExit(f"RESIDUE FOUND in capture-session183.sh: {residue!r}")
print("capture residue check: CLEAN")

# --- capture-census-s183.py ---------------------------------------------------
# (the sed-blind-spot lesson from s182: "session182" does NOT contain
# "s182" as a substring — every token replaced EXPLICITLY)
csrc = (ROOT / "capture-census-s182.py").read_text()
cdst = csrc
for old, new in [
    ("capture-census-s182.py", "capture-census-s183.py"),
    ("capture-session182.sh", "capture-session183.sh"),
    ("Session 182 capture census", "Session 183 capture census"),
]:
    if old not in cdst:
        raise SystemExit(f"MISSING SUBSTRING in census: {old[:80]!r}")
    cdst = cdst.replace(old, new)
(ROOT / "capture-census-s183.py").write_text(cdst)
print("capture-census-s183.py: derived (all tokens replaced explicitly)")

# --- the s193 mapping in check-screenshot-dimensions.py (three sites) ---------
dim = ROOT / "check-screenshot-dimensions.py"
dtext = dim.read_text()

SITE_1_OLD = """S192 = dict(S191)
"""
SITE_1_NEW = """S192 = dict(S191)

# s193 mapping (session 183 — the 159th reference audit's evidence set + the
# S183 capture set). The standing S192 witnesses carry their birth labels
# (the capture script re-verifies them LIVE on the S183 tree); no NEW
# witness this session (the S183 pass is the third-same-vocabulary cycle —
# zero source-code findings, the one remediation a PAD PROSE lockstep on
# two living doc rows painting no pixels, every captured surface
# byte-stable by construction).
S193 = dict(S192)
"""
if "S193 = dict(S192)" not in dtext:
    assert dtext.count(SITE_1_OLD) == 1, "site 1 anchor not unique"
    dtext = dtext.replace(SITE_1_OLD, SITE_1_NEW)

SITE_2_OLD = """    if name.startswith("ref-audit-s192/"):
        return S192.get(Path(name).stem)
"""
SITE_2_NEW = """    if name.startswith("ref-audit-s192/"):
        return S192.get(Path(name).stem)
    if name.startswith("ref-audit-s193/"):
        return S193.get(Path(name).stem)
"""
if 'name.startswith("ref-audit-s193/")' not in dtext:
    assert dtext.count(SITE_2_OLD) == 1, "site 2 anchor not unique"
    dtext = dtext.replace(SITE_2_OLD, SITE_2_NEW)

SITE_3_OLD = """    + [p for p in (ROOT / "ref-audit-s192").glob("*.png")]
"""
SITE_3_NEW = """    + [p for p in (ROOT / "ref-audit-s192").glob("*.png")]
    + [p for p in (ROOT / "ref-audit-s193").glob("*.png")]
"""
if '(ROOT / "ref-audit-s193").glob' not in dtext:
    assert dtext.count(SITE_3_OLD) == 1, "site 3 anchor not unique"
    dtext = dtext.replace(SITE_3_OLD, SITE_3_NEW)

dim.write_text(dtext)
print("check-screenshot-dimensions.py: the s193 mapping added at all three sites")
