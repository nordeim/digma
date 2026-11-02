#!/usr/bin/env python3
"""version-bump-s202.py — the Session 202 GREEN collateral, part 2: the
PAD v1.181.0 bump (the title + the new Last-Updated chain line, the
v1.180.0 line retained as frozen history) and the digma_SKILL v1.180.0
bump with the F188 first-full-cycle census registration (the lesson's
own test record appended to the F188 entry — no new numbered member
this cycle, the below-threshold form).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/version-bump-s202.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- The PAD title + the new chain line ---------------------------------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

old_title = "# Digma — Master Project Architecture Document (PAD) v1.180.0"
new_title = "# Digma — Master Project Architecture Document (PAD) v1.181.0"
if new_title not in text:
    assert old_title in text, "PAD title anchor not found"
    text = text.replace(old_title, new_title, 1)

CHAIN = (
    "**Last Updated:** 2026-11-02 (v1.181.0 — the below-threshold registrations + the F188 first-full-cycle census pass, the one-hundred-and-fiftieth audit's chosen work, the SIXTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — 0C/0H/0M/0L/5I, a BELOW-THRESHOLD cycle, the fourth zero-Low census in five cycles, zero behavioral source-code defect, zero comment-truth defect; the comment-truth census 627 sampled — 365 client-layer + 262 route/lib — 627 TRUE / 0 FALSE, THE LARGEST SAMPLE YET, THE ALL-TRUE CENSUS RESTORED (the streak at one); THE F188 POINTER-FOLLOWING GUARD'S FIRST FULL-CYCLE TEST PASSED — 53 pointer members followed to their targets (42 client-layer + 11 route/lib), every target carrying its promised content, the s201 follow-up-pass dispatch gap closed by construction (the route/lib census dimension riding auditor B's brief from the start); five members — one label-precision catch (B202-I-1 the dispatch brief's two per-file approximation markers — register 146 / resend-otp 122 the live figures, the F186 record-gap form, the approximation-marker form retired), one precision registration (B202-I-2 the no-e2e set strictly six — the B201-I-4 five + health GET the +1 liveness-carve-out bucket of the 13+6+1+5=25 arithmetic, health's coverage the smoke suite + the doc-lows-s83 pin), one enumeration-precision member carried (B202-I-5 api.ts's S130-C read-path census parenthetical omitting verify-otp's two mid-window re-selects :118/:160 — findUnique sites INSIDE the S124-A catch, protected, answering 503; the substance TRUE, the one-line amendment registered as the deferred-queue member and CARRIED under the below-threshold zero-source-change discipline, the B-I-1 precedent), and two documented standing postures (B202-I-3 register's 409 open enumeration by design, documented at forgot-password:78-79, the enumeration boundary closed; B202-I-4 the single-tenant ownership model — zero userId on Project/Team, requireSession authentication not authorization, the ADR-003 posture, the ownership FK the named promotion path), every claim lead-verified live at its seams: S202-A THE REGISTRATION PAIR (the s202-id-stable-premises-note at the 77th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its THIRTEENTH full-cycle test, zero label drift again, the quoting form the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180 — the TENTH steady-state cycle; P1 the twelve-site value-based census at the post-S188-A coordinates; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s202-below-threshold-note (the thirty-second-generation coordinate verification :2881/:2940/:3009 + the s201 row :2880 ALL EXACT with the F174-corrected window :2856..:2880 = s177..s201 (TWENTY-FIVE rows) :2855 the s176 row :2854 the s175 row + THE F188 FIRST FULL-CYCLE TEST registration + the below-threshold census registration + the B202-I-1 label-precision registration with the live 146/122 figures + the B202-I-2 precision registration + the B202-I-5 enumeration-precision registration carried + the continuity registrations (the B-I-1 docblock-symmetry carry at its third) + the honest folder-level vocabulary-HOLD registration (sixteenth consecutive) + the dispatch-currency-honored registration (the TENTH steady-state cycle — the stated HEAD 10e0acf7 matching exactly) + the honest environment record — THE REBUILT FORM (the second consecutive reset between sessions: the fresh clone at 10e0acf7, the environment REBUILT — the 477-package bun install, the .env recreated from the tracked template, the schema pushed + the DB seeded to the pristine 1/2/6/1/3 census, chromium-1248 + headless shell re-provisioned, paramiko 5.1.0; the exported-shell DATABASE_URL trap ACTIVE and guarded with env -u from the first call) + the F138 FIFTY-THIRD instance (the s201 plan 5/5 at e7e0ecde, the sweep s151..s201 at 51 plans 275/0) + the thirty-third-generation pre-registration (:2883/:2942/:3011, the s202 row :2882, the window :2858..:2882 = s178..s202, :2857 the s177 row, :2856 the s176 row)); S202-B the per-session pin family (tests/lows-s202.test.ts — 13 pins: 5 RED (the AGENTS session-202 bullet, the count re-anchor + the §7.1 row, the PAD title, the SKILL version, the pair-unity constants) / 8 green-at-birth (the two worklog-registration notes, the audit-entry members, the F138 53rd + the pin-family arithmetic 974 + 13 = 987, the script-provenance member, the standing-figures member, the layer-STAYS member, the B202-I-1 live per-file figures member); the MEASURED birth form — 5 RED / 8 green on the FIRST CLEAN RUN (the first forecast 8 RED / 5 green corrected by the measured arithmetic: the audit-entries pin green-at-birth under the notes-first landing convention, the two note pins green after the en-route note-form corrections), three en-route note-form corrections before any record shipped: the B202-I-5 registration phrase, the premises-pinning doctrine sentence, the vocabulary-hold standing phrasing; the constants born rolling-safe at the POST-spec figures 2783/264) and the collateral family (the count-family re-anchor 2783 = 2770 + 13 unit / 264 files across every live claim site; the spec-constants sweep 83 UNIT + 82 FILES with the census-literal lockstep riders for the s185..s201 specs' rg probes (seventeen members — s201 joining); the layer-total family STAYING at 14,373 — the below-threshold form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its twenty-eighth re-quote cycle; the s151..s201 SKILL-version pins onto v1.180.0; the s154..s201 forward-guard rolling re-anchors onto v1.181.0; the s158 title pin onto v1.181.0; the s173..s201 per-spec title-pin riders onto v1.181.0 — the family's thirtieth member; e2e stays 262; smoke stays 73) — the 22-file layer at **14,373 lines** (the STAYS form — the below-threshold cycle: the registration pair + the spec the only mutations, no F40 rider); the 178th reference audit NO DRIFT (the clip pin byte-identical the 139th consecutive session — exit 0 confirmed on a triple-run; evidence in docs/screenshots/ref-audit-s212/); mobile nav 9/9 the 179th session (the Tailwind v4 class-A guard holds — verified live on the FINAL build AND by construction in auditor A's pass — the directive's particular focus); SEO 4/4; the one-hundred-and-fiftieth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/0I — THE FIRST ZERO-FINDING AUDITOR CENSUS IN THE RECORD: the 22-file client layer line-by-line with every per-file figure verified live, the comment-truth audit 365 sampled with 365 TRUE / 0 FALSE and 42 pointer-members followed to their targets all TRUE (the F188 guard's first full-cycle test), the security sweep zero across all patterns, the Tailwind v4 posture sound with the F177 axis-named trap-4 hunt closing CLEAN at both axes EXACT, the §8/§9/§12/§13 contract check, the S201 registration seams verified, the mobile navigation menu verified by construction — the directive's particular focus, the client-layer pin subset 130/130 across the 12 rolled files in A's own live run (−lows-s193, +lows-s201), the deferral premises P1/P2 holding at every named coordinate with zero drift, the raw-fetch ELEVEN confirmed at the enumerated coordinates; auditor B's 0C/0H/0M/0L/5I — the 18 route files line-by-line with ALL 18 per-file figures matching the LIVE tree and the family sum closing (the brief's own two approximation markers caught and registered per F186 — register 146 / resend-otp 122, the reconciliation −14 + 30 exact), the src/lib full read (14 non-test files, 3,249 lines, call.ts at exactly 80 — the live list derived by command), the route-layer correctness checklist all-PASS (requireSession at all 17 call sites, readBoundedJson at all 14 parse sites with ZERO direct request.json() call sites, the ceilings verified at their exact constants, the ai: 20/5min + auth: 10/15min + crud: 60/5min rate shapes, the 32 MB cap before every parse, the OTP atomicity spans, the S181-B hash seam and S181-C fail-hard seam verified HOLDING end-to-end), the §5/§6/§7/§16/§17 contract check, the write/handler/catch/env censuses all exact, the S201 seams (the 13-pin spec green in B's own run, the FULL unit gate 2770/2770 across 263 in B's own run, the thirty-second-generation carriers exact), the deferral premises the 77th consecutive cycle all four holding under the verbatim-quoted quartet (the F176 prescription's THIRTEENTH full-cycle test — zero label drift again), the e2e write-set arithmetic 13+6+1+5=25 closing as the handler census decomposed by e2e coverage with the no-e2e five enumerated and probe-verified zero-hit and the strictly-six precision catch registered (health the +1 bucket), and the route/lib comment-truth census 262 sampled / 262 TRUE / 0 FALSE with 11 pointer families followed all TRUE — the F188 guard applied at its first brief-riding dispatch, the s201 dispatch-gap record closed by construction))\n"
)
if "v1.181.0 — the below-threshold registrations + the F188 first-full-cycle census pass" not in text:
    anchor = "**Last Updated:** 2026-11-01 (v1.180.0 —"
    at = text.index(anchor)
    text = text[:at] + CHAIN + text[at:]
    pad.write_text(text)
    print("PAD: title v1.181.0 + the new chain line landed")
else:
    pad.write_text(text)
    print("PAD: v1.181.0 already landed")

# --- The digma_SKILL bump + the F188 first-full-cycle registration -------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()
stext = stext.replace("version: 1.179.0", "version: 1.180.0", 1)

F188_TEST = (
    " The lesson's own test record (session 202, the one-hundred-and-fiftieth audit): THE F188 POINTER-FOLLOWING GUARD'S FIRST FULL-CYCLE TEST PASSED — riding a dispatch brief for the first time (both auditors' censuses), 53 pointer members followed to their targets (42 client-layer + 11 route/lib), every target carrying its promised content; the all-TRUE census restored at the largest sample yet (627 sampled / 627 TRUE / 0 FALSE — 365 client-layer + 262 route/lib, the route/lib dimension riding the brief from the start, the s201 follow-up-pass dispatch gap closed by construction)."
)
if "THE F188 POINTER-FOLLOWING GUARD'S FIRST FULL-CYCLE TEST PASSED" not in stext:
    # append to the F188 entry, just before its closing double-asterisk
    anchor = "the verification chain now closing at the claim's own destination.**"
    assert anchor in stext, "F188 tail anchor not found"
    stext = stext.replace(
        anchor,
        "the verification chain now closing at the claim's own destination."
        + F188_TEST
        + "**",
        1,
    )
    skill.write_text(stext)
    print("digma_SKILL: v1.180.0 + the F188 first-full-cycle registration landed")
else:
    skill.write_text(stext)
    print("digma_SKILL: version bumped; the F188 test registration already present")
