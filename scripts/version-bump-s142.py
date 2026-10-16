#!/usr/bin/env python3
"""The session-142 version bumps: the PAD v1.121.0 header (the chain
prepended, the v1.120.0 entry retained) and the digma_SKILL v1.120.0 +
lesson F129 (the path-scope-attribution member: a directory attribution
in a census record is a path claim as live as any line-number coordinate
— name the directory that actually holds the count, or enumerate the
members; the ledger-completeness member: a floor ledger's only-ness
claim must walk its whole domain; the compressed-scope member: name the
filter that yields the count, never a file scope alone).

Run from the repo root:  python3 scripts/version-bump-s142.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.121.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-16 (v1.121.0 — the path-scope/stop-row-floor/catch-scope registration pass: S142-A THE FROZEN-RECORD PATH-SCOPE OVERCOVER REGISTRATION (A142-I1 — the ninetieth audit's first Informational, the registration form; the B140-I2/B141-I1 coordinate-liveness class at its PATH-SCOPE shape): the s141-audit-A record's client-layer line scopes the 22-file read as "14 files at src/components/editor/ + 8 at src/components/" — the live editor directory holds exactly 8 of the 22 (editor-view, properties-panel, canvas, ai-assistant, editor-store, layers-panel, toolbar, components-panel); the 14 = those 8 + 2 at src/hooks/ + 3 at src/lib/ + 1 at src/app/globals.css, none of the six extra under the editor directory; the arithmetic 14+8=22 total-true, the record's own file-by-file enumeration right below the phrase path-exact, only the compressed directory attribution over-covering; blast radius zero (frozen records never rewritten per S132-C); the registration: the worklog's bracketed s142-path-scope-note + the spec's five-way decomposition pins — the count-truth doctrine extended: a directory attribution in a census record is a PATH claim as live as any doc-site line-number coordinate — name the directory that actually holds the count, or enumerate the members) + S142-B THE TOUCH-FLOOR LEDGER COMPLETENESS REGISTRATION (A142-I2 — the F61 N−1 lesson recurring INSIDE the floor ledger: an only-ness census must walk its whole domain): the gradient stop-row control family (properties-panel.tsx) carries four controls below the 44px touch floor — the Add-stop Button ("h-6 rounded-md px-2 text-xs", ~:1019), the stop color swatch ("h-6 w-6", ~:1064), the stop position input ("h-6 flex-1", ~:1087), the stop remove Button ("h-6 w-6 rounded-md p-0", ~:1103) — all ~24px, mobile-reachable through the shared mobile Sheet, uncensused by every floor sweep since s105 while the ledger's only-ness form named only the Revert h-5; the controls are RA-54/RA-55 reference-decoded chrome (parity-exempt by the same doctrine that exempts the Revert — the chrome stays, the defect is the LEDGER's completeness claim; the stop rows join the Revert h-5 and the ~34px utility chips as the standing below-floor members); the registration: the worklog's bracketed s142-stop-row-floor-note + the spec's stop-row pins — the count-truth doctrine extended: a floor ledger's only-ness claim must enumerate every below-floor family in the layer it certifies — walk the whole domain before writing "the only") + S142-C THE COMPRESSED-SCOPE CATCH CENSUS REGISTRATION (B142-I1 — the B141-I1 coordinate/scope-liveness class at its COMPRESSED-SCOPE shape): the s141-audit-B record's Census-truths line compresses "catches 16 (src/app/api scope, all instanceof dialect)" — the live truth is 17 catch blocks in src/app/api: 16 in the Prisma instanceof dialect + 1 the ai-assistant SDK-fallback catch (route.ts:146, no instanceof arm; the record's own prose verifies it separately); the count 16 is live-true ONLY at the dialect-filtered scope; the compression turned the prose's restrictive clause ("every catch IN THE INSTANCEOF DIALECT") into a predicative one while the scope parenthetical named only the FILE scope the filter narrows — a future mechanical sweep of "catches in src/app/api" answers 17 and mis-concludes the census wrong; blast radius zero (no repo doc carries the figure; frozen records never rewritten per S132-C); the registration: the worklog's bracketed s142-catch-scope-note + the spec's 17/16+1 pins — the count-truth doctrine extended: a compressed census line's scope must name the FILTER that yields the count ("16 instanceof-dialect catches of 17 total"), never a file scope alone) + S142-D the per-session pin family (tests/lows-s142.test.ts — 12 pins: 4 RED / 8 survival, the three worklog registrations + the count re-anchor in the DEFECT form; the three s142 script derivations 22/66/6; zero pin-design flaws at birth — the balanced-brace catch census and the readdirSync directory decomposition both green on the first RED run) and the collateral family (the count-family re-anchor 2013 = 2001 + 12 unit / 204 files across every live claim site + the twenty-three prior-session spec constants; ZERO §11 line-count changes — no source file edited this cycle, the all-registration shape); the 118th reference audit NO DRIFT (the clip pin byte-identical the 79th consecutive session); mobile nav 9/9 the 119th session; the ninetieth Mode C audit 0C/0H/0M/0L/3I)
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

if "v1.121.0" in text.split("\n")[0]:
    print("PAD: v1.121.0 already applied (idempotent skip)")
else:
    # the title bump
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.120.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.121.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)

    # the header chain prepend (insert the v1.121.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.120.0 line)
    anchor = "**Last Updated:** 2026-10-16 (v1.120.0 —"
    assert anchor in text, "PAD v1.120.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.121.0 title + header chain prepended (v1.120.0 retained)")

# --- 2. the digma_SKILL v1.120.0 + F129 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

old_ver = "version: 1.119.0"
new_ver = "version: 1.120.0"
assert old_ver in stext, "SKILL version anchor missing"
stext = stext.replace(old_ver, new_ver, 1)

F129 = """129. **F129 — the session-142 family: a directory attribution in a census record is a PATH claim as live as any doc-site line-number coordinate (the path-scope-attribution member). THE PATH-SCOPE-OVERCOVER SHAPE (A142-I1): the frozen record's "14 files at src/components/editor/" silently absorbed the 2 hooks + 3 lib + 1 globals.css from three sibling directories — the arithmetic total-true, the enumeration path-exact, only the compressed attribution over-covering; NAME THE DIRECTORY THAT ACTUALLY HOLDS THE COUNT, OR ENUMERATE THE MEMBERS. THE LEDGER-COMPLETENESS MEMBER (A142-I2): a floor ledger's only-ness claim must enumerate every below-floor family in the layer it certifies — the F61 N−1 lesson recurring INSIDE the floor ledger: walk the whole domain before writing "the only". THE COMPRESSED-SCOPE MEMBER (B142-I1): a compressed census line's scope must name the FILTER that yields the count ("16 instanceof-dialect catches of 17 total"), never a file scope alone — the compression turned the restrictive clause predicative and a future mechanical sweep mis-concludes. THE DOCTRINE, EXTENDED: COUNT THE LIST, PIN THE COUNT, NAME THE TRUE PATH, RUN THE QUOTED COMMAND, NAME THE SCOPE BESIDE THE COUNT, COUNT THE CLAIM SITES, MAKE THE DECOMPOSITION SUM, NAME THE LIST BESIDE THE FROZEN COUNT, MOVE BOTH MEMBERS OF A COUNT PAIR TOGETHER, DERIVE COORDINATES LIVE OR NAME ANCHORS ONLY, REGISTER THE ACCEPTED TRADEOFF WHERE THE NEXT AUDITOR WILL FIND IT, NAME THE LOOP BY ITS FOR HEADER OR ITS EXACT FOR..DONE SPAN — NAME THE DIRECTORY THAT ACTUALLY HOLDS THE COUNT OR ENUMERATE THE MEMBERS, WALK THE WHOLE DOMAIN BEFORE WRITING "THE ONLY", NAME THE FILTER THAT YIELDS THE COUNT.**
"""

# insert F129 after the F128 item (find the end of the F128 line)
idx = stext.find("128. **F128 — the session-141 family:")
if idx == -1:
    raise SystemExit("F128 item not found")
# find the end of that line (the next newline after idx)
line_end = stext.find("\n", idx)
if line_end == -1:
    raise SystemExit("F128 line end not found")
stext = stext[:line_end + 1] + F129 + stext[line_end + 1:]

# the last_updated field stays 2026-10-16 (same-day cycle)
skill.write_text(stext)
print("digma_SKILL: v1.120.0 + F129 (the path-scope-attribution member; the ledger-completeness member; the compressed-scope member)")
