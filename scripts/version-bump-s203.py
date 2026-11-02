#!/usr/bin/env python3
"""version-bump-s203.py — the Session 203 GREEN collateral, part 2: the
PAD v1.182.0 bump (the title + the new Last-Updated chain line, the
v1.181.0 line retained as frozen history) and the digma_SKILL v1.181.0
bump with the F188 second-cycle-catch registration (the guard's own
test record appended to the F188 entry — the complete-population form's
first FALSE pointer).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/version-bump-s203.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- The PAD title + the new chain line ---------------------------------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

old_title = "# Digma — Master Project Architecture Document (PAD) v1.181.0"
new_title = "# Digma — Master Project Architecture Document (PAD) v1.182.0"
if new_title not in text:
    assert old_title in text, "PAD title anchor not found"
    text = text.replace(old_title, new_title, 1)

CHAIN = (
    "**Last Updated:** 2026-11-02 (v1.182.0 — the F188 second-cycle catch + the B202-I-5 landing + the B203-L-1 re-anchor pass, the one-hundred-and-fifty-first audit's chosen work, the SEVENTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — 0C/0H/0M/1L/1I, a LOW-CARRYING cycle, the below-threshold streak ending at one, zero behavioral source-code defect, one comment-truth defect CAUGHT AND FIXED in the same cycle; the comment-truth census 683 sampled — 366 client-layer + 317 route/lib — 682 TRUE / 1 FALSE, THE LARGEST SAMPLE YET; THE F188 POINTER-FOLLOWING GUARD'S SECOND FULL-CYCLE TEST — AND ITS FIRST CATCH: 73 pointer members followed to their targets (38 client-layer + 35 route/lib), 72 TRUE / 1 FALSE — the one FALSE exactly the class the guard exists for (src/lib/db.ts:4-5's Pattern B parenthetical: the FACT true and live, the POINTER's target dead at the clone commit 13e3bdaf's PAD rewrite — survived the s201/s202 enumerated-family passes, caught by the complete-population form at the guard's first full-coverage route/lib dispatch); two members — B203-L-1 the CT-class stale pointer (the comment-side one-line re-anchor onto the PAD's live target, PAD §3.3 Pattern 1 the minifier-safe anchor collection, LANDING as S203-B) and B202-I-5 the enumeration-precision member (the registered deferred member LANDING as S203-A — the one-clause amendment at api.ts naming verify-otp's two mid-window re-selects inside the S130-C parenthetical, api.ts 48 → 50, src/lib 3,249 → 3,251, zero behavioral change), every claim lead-verified live at its seams: S203-A THE B202-I-5 AMENDMENT (the registered deferred member's own landing cycle — the first cycle above the below-threshold line; the one-clause form, the spec's pin the TDD receipt, pin-safe verified against the lows-s130/lows-s124/lows-s97/doc-lows-s83 token families) + S203-B THE B203-L-1 RE-ANCHOR (the cycle's own Low; the db.ts:4-5 pointer onto the PAD's live target, the in-place form, db.ts staying at 33 lines, the fact and the S74-D history untouched) + S203-C THE REGISTRATION PAIR (the s203-id-stable-premises-note at the 78th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its FOURTEENTH full-cycle test, zero label drift again; the graduated form watched per F179 and confirmed in the steady-state watch per F180 — the ELEVENTH steady-state cycle) + the s203-census-note (the thirty-third-generation coordinate verification :2883/:2942/:3011 + the s202 row :2882 ALL EXACT with the F174-corrected window :2858..:2882 = s178..s202 (TWENTY-FIVE rows) :2857 the s177 row :2856 the s176 row + THE F188 SECOND-FULL-CYCLE CATCH + the LOW-CARRYING census registration + the B203-L-1 registration + the B202-I-5 landing registration + the continuity registrations (the B-I-1 docblock-symmetry carry at its fourth) + the honest folder-level vocabulary-HOLD registration (seventeenth consecutive) + the dispatch-currency-honored registration (the ELEVENTH steady-state cycle — the stated HEAD dfeb45f4 matching exactly; the honest dispatch-machinery record — the subagent channel's two-step brief-file form) + the honest environment record — THE REBUILT FORM (the third consecutive reset between sessions: the fresh clone at dfeb45f4, the environment REBUILT — the 477-package bun install, the .env recreated from the tracked template, the schema pushed + the DB seeded to the pristine 1/2/6/1/3 census, chromium-1248 + headless shell re-provisioned, paramiko 5.1.0; the exported-shell DATABASE_URL trap ACTIVE and guarded with env -u from the first call) + the F138 FIFTY-FOURTH instance (the s202 plan 4/4 at 3a8c62aa, the sweep s151..s202 at 52 plans 279/0) + the thirty-fourth-generation pre-registration (:2885/:2944/:3013, the s203 row :2884, the window :2860..:2884 = s179..s203, :2859 the s178 row, :2858 the s177 row)) + S203-D the per-session pin family (tests/lows-s203.test.ts — 13 pins: 7 RED (the AGENTS session-203 bullet, the count re-anchor + the §7.1 row, the PAD title, the SKILL version, the pair-unity constants, the two amendment members — the api.ts re-select-family naming + the db.ts live-target re-anchor) / 6 green-at-birth (the two worklog-registration notes, the audit-entry members, the F138 54th + the pin-family arithmetic 987 + 13 = 1000, the script-provenance member, the standing-figures member); the MEASURED birth form — 7 RED / 6 green with ONE en-route spec-form repair caught at the birth runs before any record shipped: the audit-entry pin's census phrase corrected to the B-side '1 Low / 1 Informational' (the s202 F143-class birth correction); the constants born rolling-safe at the POST-spec figures 2796/265) and the collateral family (the count-family re-anchor 2796 = 2783 + 13 unit / 265 files across every live claim site; the spec-constants sweep 84 UNIT + 83 FILES with the census-literal lockstep riders for the s185..s202 specs' rg probes (eighteen members — s202 joining); the layer-total family STAYING at 14,373 — the comment-only form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its twenty-ninth re-quote cycle; the s151..s202 SKILL-version pins onto v1.181.0; the s154..s202 forward-guard rolling re-anchors onto v1.182.0; the s158 title pin onto v1.182.0; the s173..s202 per-spec title-pin riders onto v1.182.0 — the family's thirty-first member; e2e stays 262; smoke stays 73) — the 22-file layer at **14,373 lines** (the STAYS form — the comment-only cycle: the two amendments + the registration pair + the spec the only mutations, no F40 rider); the 179th reference audit NO DRIFT (the clip pin byte-identical the 140th consecutive session — exit 0 confirmed on a triple-run; evidence in docs/screenshots/ref-audit-s213/); mobile nav 9/9 the 180th session (the Tailwind v4 class-A guard holds — verified live on the FINAL build AND by construction in auditor A's pass — the directive's particular focus); SEO 4/4; the pin family S128..S202 987/987 across 75; the one-hundred-and-fifty-first Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/0I — THE SECOND CONSECUTIVE ZERO-FINDING AUDITOR-A CENSUS IN THE RECORD: the 22-file client layer line-by-line with every per-file figure verified live, the comment-truth audit 366 sampled with 366 TRUE / 0 FALSE and 38 pointer-members followed to their targets all TRUE (the F188 guard's second full-cycle pass on the client side), the security sweep zero across all patterns, the Tailwind v4 posture sound with the F177 axis-named trap-4 hunt closing CLEAN at both axes EXACT, the §8/§9/§12/§13 contract check, the S202 registration seams verified, the mobile navigation menu verified by construction — the directive's particular focus, the client-layer pin subset 131/131 across the 12 rolled files in A's own live run (−lows-s194, +lows-s202), the deferral premises P1/P2 holding at every named coordinate with zero drift, the raw-fetch ELEVEN confirmed at the enumerated coordinates; auditor B's 0C/0H/0M/1L/1I — the 18 route files line-by-line with ALL 18 per-file figures EXACT (the B202-I-1 retirement honored — register 146 / resend-otp 122) and the family sum closing at 2,461, the src/lib full read (14 non-test files, 3,249 lines, call.ts at exactly 80 — the live list derived by command), the route-layer correctness checklist all-PASS, the §5/§6/§7/§16/§17 contract check, the write/handler/catch/env censuses all exact, the S202 seams (the 13-pin spec green in B's own run, the FULL unit gate 2783/2783 across 264 in B's own run, the thirty-third-generation carriers exact), the deferral premises the 78th consecutive cycle all four holding under the verbatim-quoted quartet (the F176 prescription's FOURTEENTH full-cycle test — zero label drift again), the e2e write-set arithmetic 13+6+1+5=25 closing as the handler census decomposed by e2e coverage with the no-e2e six per the B202-I-2 registered phrasing probe-verified zero-hit, and the route/lib comment-truth census 317 sampled / 316 TRUE / 1 FALSE with 35 pointer members followed — the F188 guard's second brief-riding dispatch catching the first FALSE pointer (the B203-L-1 stale Pattern B target), the auth-family security review PASS, the standing carried members all intact zero drift)\n"
)
if "v1.182.0 — the F188 second-cycle catch + the B202-I-5 landing + the B203-L-1 re-anchor pass" not in text:
    anchor = "**Last Updated:** 2026-11-02 (v1.181.0 —"
    at = text.index(anchor)
    text = text[:at] + CHAIN + text[at:]
    pad.write_text(text)
    print("PAD: title v1.182.0 + the new chain line landed")
else:
    pad.write_text(text)
    print("PAD: v1.182.0 already landed")

# --- The digma_SKILL bump + the F188 second-cycle-catch registration -------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()
stext = stext.replace("version: 1.180.0", "version: 1.181.0", 1)

F188_CATCH = (
    " The guard's second test record (session 203, the one-hundred-and-fifty-first audit): THE F188 POINTER-FOLLOWING GUARD'S SECOND FULL-CYCLE TEST — AND ITS FIRST CATCH — the complete-population census forms (the client side 366-sampled with 38 pointers; the route/lib side 317-sampled with 35 pointers — 73 pointer members followed, 72 TRUE / 1 FALSE) catching a stale pointer NO enumerated-family pass had ever listed: src/lib/db.ts:4-5's \"(Pattern B in the architecture doc)\" parenthetical — the FACT true and live (normalize the SQLite URL BEFORE the first client is constructed), the POINTER's target dead since the clone commit 13e3bdaf's PAD rewrite (the scaffold-era PAD:470 carried the section), survived the s201/s202 enumerated-family passes, caught by the complete-population form at the guard's first full-coverage route/lib dispatch — the one FALSE exactly the class the guard exists for (the fact staying true while the document drifts); the comment-truth census 683 sampled / 682 TRUE / 1 FALSE, the largest sample yet; the fix the comment-side one-line re-anchor (the pointer onto the PAD's live target — Pattern 1 in PAD §3.3, the minifier-safe anchor collection), zero behavioral surface."
)
if "THE F188 POINTER-FOLLOWING GUARD'S SECOND FULL-CYCLE TEST — AND ITS FIRST CATCH" not in stext:
    # append to the F188 entry, just before its closing double-asterisk
    anchor = "the s201 follow-up-pass dispatch gap closed by construction).**"
    assert anchor in stext, "F188 tail anchor not found"
    stext = stext.replace(
        anchor,
        "the s201 follow-up-pass dispatch gap closed by construction)."
        + F188_CATCH
        + "**",
        1,
    )
    skill.write_text(stext)
    print("digma_SKILL: v1.181.0 + the F188 second-cycle-catch registration landed")
else:
    skill.write_text(stext)
    print("digma_SKILL: v1.181.0 + the F188 catch registration already present")

# --- verify the title lines ------------------------------------------------------
assert "# Digma — Master Project Architecture Document (PAD) v1.182.0" in (ROOT / "Project_Architecture_Document.md").read_text()
assert "version: 1.181.0" in (ROOT / "digma_SKILL.md").read_text()
print("title verification: PAD v1.182.0 + SKILL v1.181.0 both live")
