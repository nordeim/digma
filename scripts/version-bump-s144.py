#!/usr/bin/env python3
"""The session-144 version bumps: the PAD v1.123.0 header (the chain
prepended, the v1.122.0 entry retained) and the digma_SKILL v1.122.0 +
lesson F131 (the enumeration-exhaustiveness member: an every-X
enumeration in a clean-layer summary must be exhaustive over the
sanctioned forms the code's own comments distinguish — "the async
prefix" and "the awaited continuation" are different locations and the
summary may not collapse them; the brief-pair-epoch member: a dispatch
brief quoting a count pair must derive BOTH members from the same live
tree — never mix a live member with a prior record's frozen figure).

Run from the repo root:  python3 scripts/version-bump-s144.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.123.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-16 (v1.123.0 — the frozen-enum-gap/brief-pair-epoch registration pass: S144-A THE FROZEN-REACT-19-ENUMERATION-GAP REGISTRATION (A144-I1 — the 92nd audit's first Informational, the registration form): the s143-audit-A record's clean-layer verification line (worklog :3711 — the SOLE carrier of the phrase, verified by grep; the auditor's ":3614 and :3711" companion coordinate itself the A142-I1 path-scope class, corrected by the lead's spot-verification) reads "zero setState-in-effect bodies — every effect's setState sits in an event callback, an awaited continuation, or a cleanup", the three-member enumeration omitting the two sanctioned setState-in-effect-execution sites the layer's own registrations name explicitly: the S55-A PresentOverlay measure (editor-view.tsx:1032-1042 — setScale inside compute(), invoked once synchronously for the initial fit beside its resize-listener registration; React's own documented useLayoutEffect measure-before-paint idiom) and the S77-E async-prefix re-arm (editor-view.tsx:1729 — setLoading(true) before the first await, the load effect's own comment placing it "in the async prefix", the S111-B four-path taxonomy censusing the sync-prefix re-arms honestly); zero code defect — both forms React-sanctioned, registered in-code, pinned by the standing specs; the defect is the frozen summary's enumeration precision (the B142-I1 compressed-scope class at its React-contracts shape); the registration: the worklog's bracketed s144-setstate-enum-note + the spec's content-form pins — the count-truth doctrine extended: an every-X enumeration in a clean-layer summary must be exhaustive over the sanctioned forms the code's own comments distinguish — "the async prefix" and "the awaited continuation" are different locations and the summary may not collapse them) + S144-B THE BRIEF-LINEAGE SPLIT-EPOCH COUNT-PAIR REGISTRATION (B144-I1 — the 92nd audit's second Informational): the s144 dispatch brief's count-family expectation carried "2025/204 live-true at all 15 claim coordinates" — the live post-re-anchor unit member (2025) quoted beside the frozen s143-audit-B record's pre-re-anchor files member (204, the worklog :3684 Census-truths line, the S142 delivery state): a count pair that never existed as a live state (at 204 files the unit count was 2013; at 2025 tests the file count is 205); the live truth 2025/205 derived four independent ways (the doc claim sites, the live find — 205 = 198 tests/ + 7 src/ — the green full-suite run, all 15 coordinates carrying 2025 with zero shift); the B140-I2 coordinate-staleness class at its COUNT-member shape (the A138-I1 brief-lineage family) and the B140-I1 pair-unity doctrine violated in the brief lineage, never in the repo — the repo carries the correct unified 2025/205 everywhere; the registration: the worklog's bracketed s144-count-pair-epoch-note + the spec's pair-unity + frozen-source pins — the count-truth doctrine extended: a dispatch brief quoting a count pair must derive BOTH members from the same live tree — never mix a live member with a prior record's frozen figure) + S144-C the per-session pin family (tests/lows-s144.test.ts — 12 pins: 3 RED / 9 survival, the two worklog registrations + the count re-anchor in the DEFECT form; the three s144 script derivations 22/66/6 exact on the first derivation; one spec-form repair at birth — the async-prefix regex window widened 200→400 chars, the S77-E comment block riding past the narrower window) and the collateral family (the count-family re-anchor 2037 = 2025 + 12 unit / 206 files across every live claim site + the twenty-five spec constants; ZERO §11 line-count changes — no source file edited this cycle, the all-registration shape); the 120th reference audit NO DRIFT (the clip pin byte-identical the 81st consecutive session); mobile nav 9/9 the 121st session; the ninety-second Mode C audit 0C/0H/0M/0L/2I)
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

if "v1.123.0" in text.split("\n")[0]:
    print("PAD: v1.123.0 already applied (idempotent skip)")
else:
    # the title bump
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.122.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.123.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)

    # the header chain prepend (insert the v1.123.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.122.0 line)
    anchor = "**Last Updated:** 2026-10-16 (v1.122.0 —"
    assert anchor in text, "PAD v1.122.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.123.0 title + header chain prepended (v1.122.0 retained)")

# --- 2. the digma_SKILL v1.122.0 + F131 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

old_ver = "version: 1.121.0"
new_ver = "version: 1.122.0"
assert old_ver in stext, "SKILL version anchor missing"
stext = stext.replace(old_ver, new_ver, 1)

F131 = """131. **F131 — the session-144 family: an every-X enumeration in a clean-layer summary must be exhaustive over the sanctioned forms the code's own comments distinguish (the enumeration-exhaustiveness member). THE FROZEN-ENUM-GAP SHAPE (A144-I1): the s143-audit-A record's phrase "zero setState-in-effect bodies — every effect's setState sits in an event callback, an awaited continuation, or a cleanup" omitted the two sanctioned setState-in-effect-execution sites the code's own registrations name — the S55-A useLayoutEffect measure (setScale inside compute(), the measure-before-paint idiom) and the S77-E async-prefix re-arm (setLoading(true) before the first await); "THE ASYNC PREFIX" AND "THE AWAITED CONTINUATION" ARE DIFFERENT LOCATIONS AND THE SUMMARY MAY NOT COLLAPSE THEM — a future mechanical sweep of "where do the effect-executed setStates sit?" answers the enumeration PLUS these two registered forms and mis-concludes the records wrong. THE BRIEF-PAIR-EPOCH MEMBER (B144-I1): a dispatch brief quoting a count pair must derive BOTH members from the same live tree — never mix a live member with a prior record's frozen figure (the "2025/204" pair never existed as a live state; at 204 files the count was 2013, at 2025 tests the file count is 205). THE DOCTRINE, EXTENDED: COUNT THE LIST, PIN THE COUNT, NAME THE TRUE PATH, RUN THE QUOTED COMMAND, NAME THE SCOPE BESIDE THE COUNT, COUNT THE CLAIM SITES, MAKE THE DECOMPOSITION SUM, NAME THE LIST BESIDE THE FROZEN COUNT, MOVE BOTH MEMBERS OF A COUNT PAIR TOGETHER, DERIVE COORDINATES LIVE OR NAME ANCHORS ONLY, REGISTER THE ACCEPTED TRADEOFF WHERE THE NEXT AUDITOR WILL FIND IT, NAME THE LOOP BY ITS FOR HEADER OR ITS EXACT FOR..DONE SPAN, NAME THE DIRECTORY THAT ACTUALLY HOLDS THE COUNT OR ENUMERATE THE MEMBERS, WALK THE WHOLE DOMAIN BEFORE WRITING "THE ONLY", NAME THE FILTER THAT YIELDS THE COUNT, PIN THE CENSUS, RE-DERIVE THE CENSUS-OF-CENSUSES NEVER QUOTE IT, RE-DERIVE A DEFERRAL'S PREMISES EVERY CYCLE THE ITEM STAYS DEFERRED — AN EVERY-X ENUMERATION MUST BE EXHAUSTIVE OVER THE SANCTIONED FORMS THE CODE'S OWN COMMENTS DISTINGUISH, DERIVE BOTH MEMBERS OF A BRIEF'S COUNT PAIR FROM THE SAME LIVE TREE.**
"""

# insert F131 after the F130 item (find the end of the F130 line)
idx = stext.find("130. **F130 — the session-143 family:")
if idx == -1:
    raise SystemExit("F130 item not found")
# find the end of that line (the next newline after idx)
line_end = stext.find("\n", idx)
if line_end == -1:
    raise SystemExit("F130 line end not found")
stext = stext[:line_end + 1] + F131 + stext[line_end + 1:]

# the last_updated field stays 2026-10-16 (same-day cycle)
skill.write_text(stext)
print("digma_SKILL: v1.122.0 + F131 (the enumeration-exhaustiveness member; the brief-pair-epoch member)")
