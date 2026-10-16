#!/usr/bin/env python3
"""The session-143 version bumps: the PAD v1.122.0 header (the chain
prepended, the v1.121.0 entry retained) and the digma_SKILL v1.121.0 +
lesson F130 (the clean-census member: a clean verdict is a count-truth
claim like any other — pin the census so the next cycle's drift
comparison starts from live truth, and the plan-history zero-finding
claim is itself a census-of-censuses that must be re-derived, never
quoted; the deferral-premises member: a deferral decision's premises
are live claims — re-derive them every cycle the item stays deferred,
and pin them so the re-derivation is mechanical).

Run from the repo root:  python3 scripts/version-bump-s143.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.122.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-16 (v1.122.0 — the zero-finding-census/deferral-premises registration pass: S143-A THE ZERO-FINDING CENSUS REGISTRATION (the 91st Mode C audit's combined census reads 0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational — the FIRST zero-finding combined census in the plan history): a live sweep of every prior docs/remediation-plan-session*.md (117 plans, this cycle's own plan excluded — it carries the form as the registration's referent, never as a census) finds zero carriers of the 0-Low/0-I combined form in either the long form or the compressed 0C/0H/0M/0L/0I form; the minimum Informational count any prior plan carries at a 0-Low combined census is 2 (the s135-s142 distribution: 2I x3 / 3I x4 / 4I x2 / 5I x1), and the 1-Informational carriers (s59/s65/s76/s126/s128) all carry Lows or Mediums alongside — a clean-slate zero-finding census appears in no prior plan; the census's evidence trail: the two audit entries at their Task-ID anchors digma-s143-audit-A/digma-s143-audit-B (the 22-file 13,869-line client layer read line-by-line with the fifteen mandated families S128..S142 run live green 217/217 and the full 2013/204 suite re-run green; the 18 route files at 2,445 lines read completely with the write-site census 21 statements / 16 handler surfaces the FIFTEENTH consecutive cycle, the catch census 17 = 16 instanceof-dialect + 1 SDK-fallback by balanced-brace extraction, the env census 16 = 15 reads + 1 write-back across 9 vars the TENTH consecutive, the doc-census claim-by-claim with the §11 table at exactly 38 rows all-exact and the count family live-true at all 15 claim coordinates with zero shift, the DB read-only pristine 1/2/6/1/3 with the sole user demo@digma.app); the registration: the worklog's bracketed s143-clean-census-note + the spec's plan-history pins — the count-truth doctrine extended: a clean verdict is a count-truth claim like any other — pin the census so the next cycle's drift comparison starts from live truth, and the plan-history zero-finding claim is itself a census-of-censuses that must be re-derived every time it is cited, never quoted) + S143-B THE ID-STABLE PUT DEFERRAL-PREMISES REGISTRATION (the deferred queue's head item, the premises re-derived live): the four churn-consuming registrations all value-based or honest-refusal — the fillKey compare-and-adjust (properties-panel.tsx ~:1847), the rename session's index-matching refusal (layers-panel.tsx ~:30-42, the S134-B registration: the retype cost is the honest refusal), the DnD pair's id-match guard ("moved ? {…} : {}", editor-store.ts ~:352, the S109-A registration), the AI targetIds send-time capture (ai-assistant.tsx ~:575-583, its own "Registered, not remapped" comment naming the id-stable PUT as the family's structural follow-up); the index-stable remap at the markSaved boundary (editor-view.tsx ~:413-419) with the gesture-deferral gate (~:409-412); the replace transaction's registered seams intact (deleteMany + createMany + project.update at elements/route.ts ~:366/:368/:370, the S73-C 30s timeout, the S56-H inside-read, the S112-C counter recompute riding the rowStoredBytes seam); the value-based perimeter (S135-B/S136-C/S137-A) holding with zero uncensused members; the judgment carried unchanged from the S128-S142 cycles: the structural rewrite's regression risk continues to outweigh its churn-optimality benefit at this stability level; the registration: the worklog's bracketed s143-id-stable-premises-note + the spec's premises pins — the count-truth doctrine extended: a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred, and pin them so the re-derivation is mechanical) + S143-C the per-session pin family (tests/lows-s143.test.ts — 12 pins: 3 RED / 9 survival, the two worklog registrations + the count re-anchor in the DEFECT form; the three s143 script derivations 22/66/6; two spec-form repairs at birth, both in the audit-entry helper's slice form — the entry-boundary extension and the line-start backup, the census lines riding ~7-8k chars past the Task-ID anchors) and the collateral family (the count-family re-anchor 2025 = 2013 + 12 unit / 205 files across every live claim site + the twenty-four prior-session spec constants; ZERO §11 line-count changes — no source file edited this cycle, the all-registration shape); the 119th reference audit NO DRIFT (the clip pin byte-identical the 80th consecutive session); mobile nav 9/9 the 120th session; the ninety-first Mode C audit 0C/0H/0M/0L/0I)
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

if "v1.122.0" in text.split("\n")[0]:
    print("PAD: v1.122.0 already applied (idempotent skip)")
else:
    # the title bump
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.121.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.122.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)

    # the header chain prepend (insert the v1.122.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.121.0 line)
    anchor = "**Last Updated:** 2026-10-16 (v1.121.0 —"
    assert anchor in text, "PAD v1.121.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.122.0 title + header chain prepended (v1.121.0 retained)")

# --- 2. the digma_SKILL v1.121.0 + F130 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

old_ver = "version: 1.120.0"
new_ver = "version: 1.121.0"
assert old_ver in stext, "SKILL version anchor missing"
stext = stext.replace(old_ver, new_ver, 1)

F130 = """130. **F130 — the session-143 family: a clean verdict is a count-truth claim like any other (the clean-census member). THE ZERO-FINDING SHAPE (S143-A): the 91st audit's combined 0C/0H/0M/0L/0I is itself a claim about the audit history — the plan-history "first zero-finding census" figure is a census-of-censuses; PIN THE CENSUS SO THE NEXT CYCLE'S DRIFT COMPARISON STARTS FROM LIVE TRUTH, AND RE-DERIVE THE CENSUS-OF-CENSUSES EVERY TIME IT IS CITED, NEVER QUOTE IT (the sweep found zero prior carriers of the 0-Low/0-I form; the next cycle re-runs the sweep — this cycle's own plan now carries the form as a registration's referent and must stay excluded from the sweep's denominator). THE DEFERRAL-PREMISES MEMBER (S143-B): a deferral decision's premises are live claims — the id-stable PUT's four value-based perimeter sites, the index-stable remap, and the replace transaction's registered seams re-derived at their seams; RE-DERIVE THEM EVERY CYCLE THE ITEM STAYS DEFERRED, AND PIN THEM SO THE RE-DERIVATION IS MECHANICAL. THE DOCTRINE, EXTENDED: COUNT THE LIST, PIN THE COUNT, NAME THE TRUE PATH, RUN THE QUOTED COMMAND, NAME THE SCOPE BESIDE THE COUNT, COUNT THE CLAIM SITES, MAKE THE DECOMPOSITION SUM, NAME THE LIST BESIDE THE FROZEN COUNT, MOVE BOTH MEMBERS OF A COUNT PAIR TOGETHER, DERIVE COORDINATES LIVE OR NAME ANCHORS ONLY, REGISTER THE ACCEPTED TRADEOFF WHERE THE NEXT AUDITOR WILL FIND IT, NAME THE LOOP BY ITS FOR HEADER OR ITS EXACT FOR..DONE SPAN, NAME THE DIRECTORY THAT ACTUALLY HOLDS THE COUNT OR ENUMERATE THE MEMBERS, WALK THE WHOLE DOMAIN BEFORE WRITING "THE ONLY", NAME THE FILTER THAT YIELDS THE COUNT — PIN THE CENSUS, RE-DERIVE THE CENSUS-OF-CENSUSES NEVER QUOTE IT, RE-DERIVE A DEFERRAL'S PREMISES EVERY CYCLE THE ITEM STAYS DEFERRED.**
"""

# insert F130 after the F129 item (find the end of the F129 line)
idx = stext.find("129. **F129 — the session-142 family:")
if idx == -1:
    raise SystemExit("F129 item not found")
# find the end of that line (the next newline after idx)
line_end = stext.find("\n", idx)
if line_end == -1:
    raise SystemExit("F129 line end not found")
stext = stext[:line_end + 1] + F130 + stext[line_end + 1:]

# the last_updated field stays 2026-10-16 (same-day cycle)
skill.write_text(stext)
print("digma_SKILL: v1.121.0 + F130 (the clean-census member; the deferral-premises member)")
