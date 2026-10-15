#!/usr/bin/env python3
"""The session-137 version bumps: the PAD v1.116.0 header (the chain
prepended, the v1.115.0 entry retained) and the digma_SKILL v1.115.0 +
lesson F124 (the enumeration-truth member; the audit-census-line member;
the count-the-list doctrine).

Run from the repo root:  python3 scripts/version-bump-s137.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.116.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-15 (v1.116.0 — the enumeration-repair/census-registration pass: S137-A THE PERIMETER'S ENUMERATION-TRUTH REPAIR (A137-I1 — the eighty-fifth audit's one Informational, the FIX form): the S136-C registration's membership list over-listed FillStroke as a guardedUpdate consumer (born in the S136 GREEN-phase rewording onto "the patchDiffers seam" — the original A136-I2 text was true for FillStroke; the reword fixed the call-site census and broke the membership list in the same stroke) — the FIVE true wrapper consumers are PositionSize/CornerRadius/Text/Transform/Opacity, and FillStrokeSection rides the SAME value-based seam DIRECTLY through its sub-panels (HexColorRow/GradientPanel/ImagePanel), never the wrapper; the functional perimeter claim (value-based, churn-immune through markSaved's every-save id remap) HELD for all six sections — only the membership phrase was wrong (the B135-I1/B136-I2 count-truth class at its one-member enumeration shape); the repair names the five consumers + the direct-seam rider, the membership pinned at every seam (each section's wrapper wiring verified, FillStroke's sub-panel composition verified, the sub-panels' own seam calls verified); the churn-immunity substance preserved token-for-token (the A136-I2/S136-C/perimeter/VALUES-never-ids/churn-immune/S133-B/S133-C tokens surviving verbatim); the patchDiffers call-site census stays exactly 11 (the paren-free seam form preserved); the lows-s136 S136-C pin window widened 1500→2000 (the documented spec-window repair, the s134/s135/s136 precedent — the repaired registration grew past the frozen window's headroom)) + S137-B THE buildElementRow CENSUS REGISTRATION (B137-I1 — the Informational, the count-truth class's FOURTH member, the first inside an audit census line itself): the frozen s136-audit-B record's "24 fields" figure is off-by-one against the live row-builder — buildElementRow's return type carries exactly 25 fields, one-to-one with DesignElement's 25 writable domain columns (id/projectId/createdAt/updatedAt excluded; the relation line excluded); the figure was live-true before S113-D added fillImageThumb (session 113) and stale since — the sweeps verified the one-to-one MEMBERSHIP, never the count; the frozen record never rewritten (the S132-C convention); the corrected figure registered in the worklog's bracketed s137-buildElementRow-census-note; the live truth PINNED by the spec's survival pins (the return-type field count = 25, the schema's writable column count = 25, the name sets identical) so the figure can never silently falsify again) + S137-C the per-session pin family (tests/lows-s137.test.ts — 11 pins: 1 RED / 10 survival; the three s137 script derivations 22/66/6) and the collateral family (the PAD §11 row properties-panel.tsx 2349→2354 with the enriched S137 seam description; the count-family re-anchor 1955 = 1944 + 11 unit / 199 files across every live claim site + the twenty prior-session spec constants); the 113th reference audit NO DRIFT (the clip pin byte-identical the 74th consecutive session); mobile nav 9/9 the 114th session; the eighty-fifth Mode C audit 0C/0H/0M/0L/3I)
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

if "v1.116.0" in text.split("\n")[0]:
    print("PAD: v1.116.0 already applied (idempotent skip)")
else:
    # the title bump
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.115.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.116.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)

    # the header chain prepend (insert the v1.116.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.115.0 line)
    anchor = "**Last Updated:** 2026-10-15 (v1.115.0 —"
    assert anchor in text, "PAD v1.115.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.116.0 title + header chain prepended (v1.115.0 retained)")

# --- 2. the digma_SKILL v1.115.0 + F124 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

old_ver = "version: 1.114.0"
new_ver = "version: 1.115.0"
assert old_ver in stext, "SKILL version anchor missing"
stext = stext.replace(old_ver, new_ver, 1)

F124 = """124. **F124 — the session-137 family: a registration comment's membership LIST is itself a live claim (the enumeration-truth member — the count-truth family extended from counting tables to verifying enumeration membership). THE ONE-MEMBER SHAPE (A137-I1): the S136-C perimeter registration over-listed FillStroke as a guardedUpdate consumer — the phrase "every section consuming this helper" over-covered by exactly one member because the GREEN-phase rewording (onto "the patchDiffers seam", to protect the call-site census) silently changed WHICH sections the enumeration described; the functional claim (value-based, churn-immune) held for all six sections while the membership phrase was wrong for one — a comment can be functionally true and enumeratively false at the same time. THE AUDIT-CENSUS-LINE MEMBER (B137-I1): a figure quoted inside an audit record is a live claim about the code — verify it against the code, never against the prior record; the "24 fields" figure survived twenty-three sessions inside the audit census line because every sweep verified the one-to-one MEMBERSHIP of the row-builder's fields against the schema, never the COUNT (25 since session 113's fillImageThumb). THE DOCTRINE, GENERALIZED: COUNT THE LIST, PIN THE COUNT — whether the claim is a table's row count, an enumeration's membership, or a census line's figure, the sweep must derive the number from the live tree and the spec must pin it (the S136-E/S137-B survival pins), because the prior record's figure is evidence of what was WRITTEN, never proof of what IS.**
"""

# insert F124 after the F123 item (find the end of the F123 line)
idx = stext.find("123. **F123 — the session-136 family:")
if idx == -1:
    raise SystemExit("F123 item not found")
# find the end of that line (the next newline after idx)
line_end = stext.find("\n", idx)
if line_end == -1:
    raise SystemExit("F123 line end not found")
stext = stext[:line_end + 1] + F124 + stext[line_end + 1:]
skill.write_text(stext)
print("digma_SKILL: v1.115.0 + F124 (the enumeration-truth member; the audit-census-line member; the count-the-list doctrine)")
