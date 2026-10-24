#!/usr/bin/env python3
"""version-bump-s183.py — the Session 183 GREEN collateral, part 2: the
PAD v1.162.0 bump (the title + the new Last-Updated chain line, the
v1.161.0 line retained as frozen history) and the digma_SKILL v1.161.0
bump with lesson F170 (the dispatch per-file figure family member).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/version-bump-s183.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- The PAD title + the new chain line ---------------------------------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

old_title = "# Digma — Master Project Architecture Document (PAD) v1.161.0"
new_title = "# Digma — Master Project Architecture Document (PAD) v1.162.0"
if new_title not in text:
    assert old_title in text, "PAD title anchor not found"
    text = text.replace(old_title, new_title, 1)

CHAIN = (
    "**Last Updated:** 2026-10-24 (v1.162.0 — the third-same-vocabulary issuance-prose-lockstep + twelfth-generation-verified + F170 registrations pass, the one-hundred-and-thirty-first audit's chosen work, the THIRD consecutive same-vocabulary cycle — 0C/0H/0M/0L/8I, a zero-source-finding all-Informational census under the same skills/web-application/SKILL.md v1.1.0 vocabulary, the S181/S182 remediations verified holding at every re-derived seam, every non-posture member doc-side, dispatch-side or registration-side, every claim lead-verified live at its seams: S183-A THE ISSUANCE-PROSE LOCKSTEP (B182-I-2's follow-up, the prose cycle the s182 record itself proposed): the two LIVING issuance-prose rows — the auth-flow prose and the §11 forgot-password inventory row — lockstepped in place to name the STORED form (the SHA-256 hex hash of the crypto-random token, S181-B hashed-at-rest; the raw token rides only the delivery URL), the frozen S46 port row untouched per the S181-D era-scoping doctrine, zero line-count movement on both rows, the issuance-true/storage-silent posture CLOSED on the living surface (the authoritative storage truth now named at every living claim site: the revision blocks since v1.160.0, the schema comment since S182-A, the auth-flow prose and the §11 row since S183-A); S183-B THE REGISTRATIONS: the s183-id-stable-premises-note (the 57th consecutive cycle, all four premises re-derived live by auditor B and holding) + the s183-below-threshold-note (the twelfth-generation coordinate VERIFIED at every figure under the corrected arithmetic — the carriers :2843/:2902/:2971 AND the window :2830..:2842 AND the s182 row at :2842 all EXACT as pre-registered, the F169 member holding its first verification, the off-by-one class NOT recurring; the A183-I-1 dispatch per-file figure family correction: the lead's auditor-A brief carried 12/22 stale figures recalled from the S140-era record while the total was live-derived and exact and the repo NOT drifted — auditor A caught it by counting every file, the family summing to 14,065 against its own stated 14,313 total; the F170 lesson: a dispatch brief's per-file figure family is itself a claim about the tree — every member derives live at dispatch AND the family's sum closes against its own stated total; the THIRTEENTH generation pre-registered with the same corrected arithmetic: the carriers to :2845/:2904/:2973, the §7.1 rows owning s170..s183 at :2831..:2844, the s183 row at :2844 — every figure from the same two-insertion +2 shift); S183-C the per-session pin family (tests/lows-s183.test.ts — 12 pins: 6 RED (the two prose-lockstep forms + the doc-side collateral: the AGENTS session-183 bullet, the count re-anchor, the PAD title, the SKILL + F170, the pair-unity constants) / 6 green-at-birth (the two worklog-registration notes, the F138 guard's THIRTY-FOURTH instance — the s182 plan's record pinned 5/5 ticked at 80303e97 per the pre-armed session_481/482 directive, the script-provenance member, the audit-entry member, the source-survival member with the F170 per-file probe mechanized — the two historically-drifting members pinned by name); the MEASURED birth form — two pin-form corrections applied at birth (the audit-entry members' quoted forms aligned to the entries' actual wording), the arithmetic carrying the measured count, never the forecast (the s159 lesson); the constants born rolling-safe at the POST-spec figures 2545/245) and the collateral family (the count-family re-anchor 2545 = 2533 + 12 unit / 245 files across every live claim site; the spec-constants sweep 64 UNIT + 63 FILES; the layer-total family STAYING at 14,313 — the THIRD consecutive cycle at the post-S181 figure, the second STAYS re-quote; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its EIGHTH re-quote cycle pre-armed; the env census figure 17 sites across 9 vars — the standing form; the s151..s182 SKILL-version pins onto v1.161.0; the s154..s182 forward-guard rolling re-anchors onto v1.162.0; the s158 title pin onto v1.162.0; the s173..s182 per-spec title-pin riders onto v1.162.0 — the family's eleventh member; e2e stays 262; smoke stays 73) — the 22-file layer at **14,313 lines** (the STAYS form, the third consecutive cycle at the post-S181 figure); the route layer at 2,461 with the internal-consistency probe passing; the 159th reference audit NO DRIFT (the clip pin byte-identical the 120th consecutive session — exit 0 confirmed on a triple-run with all standing datums identical; evidence in docs/screenshots/ref-audit-s193/); mobile nav 9/9 the 160th session (the Tailwind v4 class-A guard holds — verified live on the standing build AND by construction in auditor A's pass); SEO 4/4; the one-hundred-and-thirty-first Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/5I — the 22-file client layer read line-by-line with the A183-I-1 per-file drift caught by counting every file (12/22 brief figures stale, the live tree exact, the repo byte-identical to the S182 delivery), the comment-truth census 22 sampled with 22 TRUE / 0 FALSE (the zero-false direction holding the eighth consecutive cycle), the security sweep zero across all patterns, the mobile navigation menu verified by construction — the directive's particular focus, the §8/§9/§12/§13 contract check PASS with the postures carried, the correctness focus traced clean — the gesture seam, the autosave machine, the id-remap); auditor B's 0C/0H/0M/0L/3I — the 18 route files line-by-line with ALL 18 per-file figures matching the LIVE tree (zero dispatch-figure errors on B's brief), the src/lib full read (14 non-test files at 3,249, call.ts at exactly 80 lines), the route-layer correctness checklist all-PASS, the §5/§6/§7/§16/§17 contract check with the S181-B hash seam and the S181-C fail-hard seam both verified HOLDING end-to-end, the write/handler/catch/env censuses all exact (23/14 = 10+11+2, 25/24/17, 17 = 16+1, 17 sites/9 vars), the S182 seams (the 12-pin spec verified, the 63/62 constants zero-stale, the twelfth-generation carriers at their exact coordinates), the deferral premises the 57th consecutive cycle all four holding, the e2e write-set arithmetic 19+1+5=25 closing; the honest environment record: the workspace RESET this cycle (a fresh git clone at HEAD b27d71a6; bun install 477 packages; .env the documented cp form; db/ at the repo root pushed + seeded pristine 1/2/6/1/3 and re-seeded after every DB-touching gate; chromium-1248 AND chromium_headless_shell-1248 provisioned BEFORE the e2e run — the standing cache absent post-reset; the six baseline gates first-run green — lint 0, typecheck 0, unit 2533/2533 across 244, build 27 routes with the [db] anchor at the repo root, smoke 73/73, e2e 262/262 zero flakes 6.6m; the trap guarded by env -u on every DB-touching gate; the vitest isolate note confirmed live again — the registered forward-compat lever, not promoted))\n"
)
if "v1.162.0 — the third-same-vocabulary issuance-prose-lockstep + twelfth-generation-verified" not in text:
    anchor = "**Last Updated:** 2026-10-24 (v1.161.0 —"
    at = text.index(anchor)
    text = text[:at] + CHAIN + text[at:]
    pad.write_text(text)
    print("PAD: title v1.162.0 + the new chain line landed")
else:
    pad.write_text(text)
    print("PAD: v1.162.0 already landed")

# --- The digma_SKILL bump + F170 ----------------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()
stext = stext.replace("version: 1.160.0", "version: 1.161.0", 1)

F170 = (
    "170. **F170 — the session-183 family: the DISPATCH PER-FILE FIGURE FAMILY member (the F168/F169 sibling at the family layer).** The session-183 lead's auditor-A dispatch brief carried a stale per-file figure family — 12 of 22 figures off against the live tree (editor-view 2453 vs the brief's 2449, editor-store 847 vs 730, editor.ts 1263 vs 1189, and nine more; the figures recalled from the S140-era worklog record rather than live-derived), the family summing to 14,065 against its own stated 14,313 total — while the TOTAL was live-derived and exact and the repo itself had NOT drifted (src/ byte-identical to the prior delivery; the error was in the BRIEF, not the tree). Auditor A caught it by counting every file and checking the family's own sum. THE LESSON: a dispatch brief's per-file figure FAMILY is itself a claim about the tree — every member derives live at dispatch (`wc -l` per file at dispatch time), never from a prior record's recall, AND the family's internal sum closes against its own stated total before the brief ships. A stale member inside an exact total sends the auditor hunting drift that does not exist; the family's own sum is the cheapest possible gate. The spec-layer mechanization (tests/lows-s183.test.ts): the per-file decomposition re-derived live and summed against the total at every future run, the historically-drifting members pinned by name.**\n"
)
if "170. **F170" not in stext:
    # insert after F169's trailing newline (the lessons are numbered lines)
    anchor = "an inconsistently-shifted window anchors a phantom coordinate in the record.**\n"
    assert anchor in stext, "F169 tail anchor not found"
    stext = stext.replace(anchor, anchor + F170, 1)
    skill.write_text(stext)
    print("digma_SKILL: v1.161.0 + F170 landed")
else:
    skill.write_text(stext)
    print("digma_SKILL: version bumped; F170 already present")
