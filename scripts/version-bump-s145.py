#!/usr/bin/env python3
"""The session-145 version bumps: the PAD v1.124.0 header (the chain
prepended, the v1.123.0 entry retained) and the digma_SKILL v1.123.0 +
lesson F132 (the registration-self-application member: an every-X
registration's own enumeration is subject to the exhaustiveness doctrine
it registers — derive the enumeration from the live set the records
name, never from the finding's own examples; the scope-generation
member: a census riding consecutive record generations must carry its
scope beside the count in EVERY generation; the doc-set-classification
member: a count-family census must derive its doc set from the live tree
and classify frozen coincidental literals out, naming the filter; the
offsetting-errors member: a recorded derivation method must be the
filter that yields the figure — two offsetting errors producing a
correct figure are recorded as such, never left as the method).

Run from the repo root:  python3 scripts/version-bump-s145.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.124.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-17 (v1.124.0 — the enum-completion/template-literal-scope/count-docset/smoke-filter registration pass: S145-A THE SANCTIONED-SET ENUMERATION-COMPLETION REGISTRATION (A145-I1 — the 93rd audit's first Informational, the registration form): the s144-setstate-enum-note (worklog :3810) enumerates "the two sanctioned setState-in-effect-execution sites the layer's own registrations name explicitly" — S55-A (the PresentOverlay measure, editor-view.tsx:1032-1042) and S77-E (the async-prefix re-arm, :1729) — but the layer's own registrations name FOUR: the s140-audit-A (:3401) and s141-audit-A (:3498) records both carry "the sanctioned layout-effect measure-before-paint forms S55-A/S65-A" (the S65-A CanvasThumbnail measure — project-card.tsx:114-125, setFit inside measure() invoked synchronously in the useLayoutEffect, its in-code comment naming "the measurement lands before the first paint"), and the S111-B four-path taxonomy the note itself cites censuses the adoption settle (editor-view.tsx:1698, setLoading(false) in the effect's sync body — "the adoption path settles it there"); zero code defect — all four forms React-sanctioned, registered in-code, pinned by the standing specs; the defect is the registration's own enumeration precision — the A144-I1 class recurring one generation later inside the registration that established the doctrine; the registration: the worklog's bracketed s145-enum-completion-note + the spec's four-site content pins — the count-truth doctrine extended: an every-X registration's own enumeration is subject to the exhaustiveness doctrine it registers — derive the enumeration from the live set the records name, never from the finding's own examples) + S145-B THE TEMPLATE-LITERAL CLASSNAME SCOPE-MEMBERSHIP REGISTRATION (A145-I2 — the 93rd audit's second Informational): the s140/s141 records' "exactly TWO template-literal className sites in the layer — layout.tsx:26 … and properties-panel.tsx:1656" names a non-layer member inside an "in the layer" claim (layout.tsx is not one of the 22); the s142/s143 records drop the scope words but keep the scopeless "exactly 2"; the live truth: exactly 2 at the src/ scope (properties-panel.tsx:1656 the Text Align button + src/app/layout.tsx:26 the next/font variable) and exactly 1 at the 22-file layer scope; the S139-A scope-naming doctrine's own N−1 member; the registration: the worklog's bracketed s145-template-literal-scope-note + the spec's two-scope census pins — the count-truth doctrine extended: a census riding consecutive record generations must carry its scope beside the count in EVERY generation) + S145-C THE COUNT-FAMILY DOC-SET/COINCIDENTAL-LITERAL REGISTRATION (B145-I1 — the 93rd audit's third Informational): the s145 dispatch brief's "2037/206 at 15 live claim sites" mis-derived — the five named docs carry 14 live claim coordinates (the 15th grep line being PAD :253's FROZEN "editor-view 2037" line-count literal from the S105-H row), the repo-wide live truth 17 claim coordinates across 6 docs (digma_SKILL.md included); the forward collisions named ("2049" at PAD :159/:171, "207" at PAD :1462 — frozen figures the re-anchor's new members coincide with, so the doc-update anchors by CONTENT, never by bare figure); the registration: the worklog's bracketed s145-count-docset-note + the spec's frozen-classification + pair-unity pins — the count-truth doctrine extended: a count-family census must derive its doc set from the live tree — enumerate the carriers — and every bare-figure grep must classify frozen session-history rows out of the claim set, naming the filter) + S145-D THE SMOKE-FILTER COINCIDENTAL-CORRECTNESS REGISTRATION (B145-I2 — the 93rd audit's fourth Informational): the brief's ok-call derivation subtracted a non-member (the :46 function definition matches `ok(`, never `ok `) and missed the real 69th member (the :292 prose literal "reset ok (got $RESET_OK_STATUS)"); the two offsetting errors produce the correct 68; the filter that actually yields 68 is the call form `ok "`; the registration: the worklog's bracketed s145-smoke-filter-note + the spec's filter pins — the count-truth doctrine extended (the F131 name-the-filter member at its coincidental-correctness shape): a recorded derivation method must be the filter that yields the figure — two offsetting errors producing a correct figure are recorded as such, never left as the method) + S145-E the per-session pin family (tests/lows-s145.test.ts — 12 pins: 5 RED / 7 survival, the four worklog registrations + the count re-anchor in the DEFECT form; the three s145 script derivations 22/66/6 exact on the first derivation; five spec-form repairs at birth — the missing-paren typo, the layer-scope census regex onto the template-literal form, the api/ segment in the ENDPOINT loop pin, the note-slice line-start backup, the loop-span extraction onto the exact for..done walk with the indented done) and the collateral family (the count-family re-anchor 2049 = 2037 + 12 unit / 207 files across every live claim site + the twenty-six spec constants; ONE honest prior-spec repair — the s144 live-derivation pin's hard-coded toBe(206) onto the growth-floor form toBeGreaterThanOrEqual(Number(FILES)), the B144-I1 latent-fragility class at the assertion-body shape, the s145 spec born with the same form; ZERO §11 line-count changes — no source file edited this cycle, the all-registration shape); the 121st reference audit NO DRIFT (the clip pin byte-identical the 82nd consecutive session); mobile nav 9/9 the 122nd session; the ninety-third Mode C audit 0C/0H/0M/0L/4I)
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

if "v1.124.0" in text.split("\n")[0]:
    print("PAD: v1.124.0 already applied (idempotent skip)")
else:
    # the title bump
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.123.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.124.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)

    # the header chain prepend (insert the v1.124.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.123.0 line)
    anchor = "**Last Updated:** 2026-10-16 (v1.123.0 —"
    assert anchor in text, "PAD v1.123.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.124.0 title + header chain prepended (v1.123.0 retained)")

# --- 2. the digma_SKILL v1.123.0 + F132 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

old_ver = "version: 1.122.0"
new_ver = "version: 1.123.0"
assert old_ver in stext, "SKILL version anchor missing"
stext = stext.replace(old_ver, new_ver, 1)

# the last_updated moves to 2026-10-17 (this cycle's date)
old_lu = "last_updated: 2026-10-16"
new_lu = "last_updated: 2026-10-17"
assert old_lu in stext, "SKILL last_updated anchor missing"
stext = stext.replace(old_lu, new_lu, 1)

F132 = """132. **F132 — the session-145 family: an every-X registration's own enumeration is subject to the exhaustiveness doctrine it registers (the registration-self-application member). THE N−1 SHAPE (A145-I1): the s144-setstate-enum-note — the registration that ESTABLISHED the enumeration-exhaustiveness doctrine — enumerated "the two sanctioned setState-in-effect-execution sites" while the layer's own records name FOUR (the S55-A measure, the S65-A CanvasThumbnail measure its own phrase carriers name, the S77-E re-arm, the S111-B adoption settle its own cited taxonomy censuses): DERIVE THE ENUMERATION FROM THE LIVE SET THE RECORDS NAME, NEVER FROM THE FINDING'S OWN EXAMPLES — the doctrine-applier is not exempt from the doctrine. THE SCOPE-GENERATION MEMBER (A145-I2): a census riding consecutive record generations must carry its scope beside the count in EVERY generation — a later record's dropped scope word ("exactly 2" without "at the src/ scope") un-names the scope an earlier record established, and a member list naming a file outside the audited set (layout.tsx "in the layer") is a scope-membership defect even when every named site is safe. THE DOC-SET-CLASSIFICATION MEMBER (B145-I1): a count-family census must derive its doc set from the live tree — enumerate the carriers (17 across 6 docs, not "15" from a bare grep that swallowed PAD :253's frozen "editor-view 2037" line-count literal) — and every bare-figure grep must CLASSIFY FROZEN SESSION-HISTORY ROWS OUT of the claim set, naming the filter; the forward-collision corollary: the re-anchor's new figures (2049/207) coincide with frozen historical literals (PAD :159/:171/:1462), so a doc-update anchors by CONTENT — long unique strings, exactly-one-hit patches — never by bare figure. THE OFFSETTING-ERRORS MEMBER (B145-I2): a recorded derivation method must be THE FILTER THAT YIELDS THE FIGURE — two offsetting errors (subtracting the :46 definition that matches `ok(` never `ok `, missing the :292 prose that is the real 69th member) coincidentally produce the correct 68; a future sweep following the recorded method verbatim cannot reproduce the figure — record the coincidental correctness as such, never leave the broken method as the instruction. THE DOCTRINE, EXTENDED: COUNT THE LIST, PIN THE COUNT, NAME THE TRUE PATH, RUN THE QUOTED COMMAND, NAME THE SCOPE BESIDE THE COUNT, COUNT THE CLAIM SITES, MAKE THE DECOMPOSITION SUM, NAME THE LIST BESIDE THE FROZEN COUNT, MOVE BOTH MEMBERS OF A COUNT PAIR TOGETHER, DERIVE COORDINATES LIVE OR NAME ANCHORS ONLY, REGISTER THE ACCEPTED TRADEOFF WHERE THE NEXT AUDITOR WILL FIND IT, NAME THE LOOP BY ITS FOR HEADER OR ITS EXACT FOR..DONE SPAN, NAME THE DIRECTORY THAT ACTUALLY HOLDS THE COUNT OR ENUMERATE THE MEMBERS, WALK THE WHOLE DOMAIN BEFORE WRITING "THE ONLY", NAME THE FILTER THAT YIELDS THE COUNT, PIN THE CENSUS, RE-DERIVE THE CENSUS-OF-CENSUSES NEVER QUOTE IT, RE-DERIVE A DEFERRAL'S PREMISES EVERY CYCLE THE ITEM STAYS DEFERRED, AN EVERY-X ENUMERATION MUST BE EXHAUSTIVE OVER THE SANCTIONED FORMS THE CODE'S OWN COMMENTS DISTINGUISH, DERIVE BOTH MEMBERS OF A BRIEF'S COUNT PAIR FROM THE SAME LIVE TREE — A REGISTRATION'S OWN ENUMERATION IS SUBJECT TO ITS OWN DOCTRINE, A CENSUS CARRIES ITS SCOPE IN EVERY GENERATION, A DOC-SET IS DERIVED FROM THE LIVE TREE WITH FROZEN LITERALS CLASSIFIED OUT BY A NAMED FILTER, A RECORDED METHOD MUST BE THE FILTER THAT YIELDS THE FIGURE.**
"""

# insert F132 after the F131 item (find the end of the F131 line)
idx = stext.find("131. **F131 — the session-144 family:")
if idx == -1:
    raise SystemExit("F131 item not found")
# find the end of that line (the next newline after idx)
line_end = stext.find("\n", idx)
if line_end == -1:
    raise SystemExit("F131 line end not found")
stext = stext[:line_end + 1] + F132 + stext[line_end + 1:]

skill.write_text(stext)
print("digma_SKILL: v1.123.0 + F132 (the registration-self-application member; the scope-generation member; the doc-set-classification member; the offsetting-errors member)")
