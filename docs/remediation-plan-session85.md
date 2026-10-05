# Remediation Plan — Session 85 (the Thirty-Third Audit)

**Date:** 2026-10-06 · **Trigger:** the operator's session-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the `.env` database contract with `db/` at the repo root, the vitest/playwright suites, the TDD remediation, the screenshots, the aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's re-verification of the session-84 delivery (all four S84 seams verified intact in source at baseline — the RA-59 XFF carve-out at `auth.spec.ts:244`, the `exec env -u …` webServer command at `playwright.config.ts:88-89`, the register derived-name cap at `register/route.ts:99`, the `clampPositionField/clampSizeField/clampFontSizeField` family consumed at the five panel sites), then the THIRTY-THIRD Mode C audit: two independent fresh-eyes full-file reviews by separate agents — auditor A over the editor core + client view layer (editor-store, editor-view, properties-panel, canvas, ai-assistant, every app view, the vendored ui primitives, both hooks, lib/editor + lib/ai-assistant, the s84 spec files — the unit gate re-run green 1024/1024 in the auditor's own environment), auditor B over the server + lib/config/infra side (all 18 route files, all libs, prisma schema + seed, every root config, the smoke/check/nav scripts, the e2e infrastructure, `.env.example`, the doctrine files' stale-count sweep — lint + typecheck + unit 1024/1024 + the Playwright `--list` 260-test enumeration re-run green) — against the `skills/code-review-checklist` dimensions with the AGENTS/CLAUDE documented contracts loaded first. Every chosen finding individually re-verified by the lead in source before this plan.

**The baseline gate state — the F59 corollary HOLDS this cycle** (the second consecutive): lint ✓, typecheck ✓, unit **1024/1024 across 141 files** ✓, build ✓, smoke **63/63** ✓, e2e **260/260** ✓ (all six gates re-run by the lead at baseline). The session-84 "full gate green" claim is TRUE at the current tree.

**The environment repair en-route (M-B85-1, auditor B's operational finding):** the sandbox's parent shell exports `DATABASE_URL=file:/home/z/my-project/db/custom.db`, so the lead's first `db:push && db:seed` landed OUTSIDE the repo (the documented AGENTS.md environment trap — the exported var wins over `.env`). Re-seeded with `unset DATABASE_URL && bun run db:push && bun run db:seed`; `scripts/check-db-contract.ts` now prints `PRISTINE CONTRACT OK` (1/2/6/1/3) at the resolved repo path `file:/home/z/my-project/digma/db/custom.db`. The worklog's setup entry was location-inaccurate until this repair.

## Reference findings (61st audit — no drift on the standing datums)

The standing datums re-verified on `https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 + mobile 390×844, the real CDP login with the operator's credentials, evidence `docs/screenshots/ref-audit-s95/`): the desktop nav 124/96/92 × 36; the greeting with the populated name + sparkle ("Good evening, sepnetflix2023 ✨"); Quick Stats 1 Projects / 0 Teams / Pro Plan; the Recent sort `last_accessed` / "1 file found"; zero kbd affordances (the string-concatenation IIFE re-probe: `kbd=0`); the Create-Team dead chrome (clicked → `dialogs=0`); R3 mobile nav failure class A (nav `display:none`, links 0×0, no hamburger — the dashboard AND the editor page); the mobile editor header clipping Share/Present at 390 re-measured EXACTLY (Share L385–R458, Present L466–R551 — byte-identical the 22nd consecutive session); the board's project text-verified ("Test Project One"). **NO DRIFT — no parity work required this cycle.**

The clone's mobile navigation verified live end-to-end at 390×844 — the **62nd consecutive session**, ALL GREEN via the single-call verifier `scripts/verify-nav-s85.sh` (9/9: the 44×44 hamburger with the aria contract at [16,10], the Sheet's 44px links + aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape with focus return + lock release, navigate-and-dismiss, the md-crossing close, the 768 boundary, and the class-A guard — the Tailwind v4 failure class A NOT present). Verified on the session-84 build at HEAD `3a8081a`.

## The code audit findings (Mode C — thirty-third pass)

**0 Critical / 0 High / 1 Medium / 4 Low / 4 Informational** combined (auditor A: 0/0/1/1/4; auditor B: 0/0/0/3/0 — the operational M-B85-1 already repaired en-route, its diagnostic-quality residual L-B85-2 below) — every chosen finding individually re-verified by the lead in source:

- **A85-M1 (Medium — THE HEADLINE): same-project editor re-entry skips the load GET — stale singleton state shown.** `src/components/editor/editor-view.tsx:1346` — the S61-I adoption guard keys on store identity alone: `if (useEditorStore.getState().projectId === projectId) { setLoading(false); … return; }`. The zustand store is a module singleton with NO reset on unmount (the autosave cleanup flushes but never clears `projectId`), so the most common navigation flow — Editor(X) → Back/dashboard → open X again — mounts a FRESH `EditorView` over the stale store, the guard fires, and the server GET is skipped entirely. The doc's own enumeration ("a refresh (fresh store) and a soft navigation to ANOTHER project both still load") omits the third case: soft re-entry to the SAME project. Consequences until a hard refresh: (1) **stale project name** — rename X from Recent/Dashboard between visits and the editor header keeps the old name, propagating into `exportFilename(store.projectName)` for the whole session; (2) **stale elements** — edits written by another tab/device are not shown, and the next local edit full-list-PUTs over them (client-sovereign replace); (3) **cross-session undo history** — `past`/`future` survive the leave/re-enter cycle, inconsistent with the "load is a lineage break" doctrine. Corroborating: session 62's S62-C comment patches THIS very skip branch for re-entry ("…survived re-entry THROUGH the skip") — the badge symptom was patched, the content/name staleness half never addressed. No e2e spec re-enters the same project after an out-of-editor rename, so the suite cannot see it.
- **A85-L1 (Low): the TEXT Content input lacks the client-side clamp its siblings carry — the S84-B teleport family's missed member.** `src/components/editor/properties-panel.tsx:959-969` (the shared TextSection both the desktop panel and the mobile Sheet render): the Content input carries NO `maxLength` and commits `update({ text: event.target.value })` raw — against the server seam `clampText(raw?.text, 2000)` (`src/lib/editor.ts:939`: trim + slice(0, 2000), all-whitespace → null) and the store-replacing PUT response (`editor-store.ts:204-211` `markSaved`). Exactly the A84-L1 class: paste >2000 chars → renders locally, silently truncates to 2000 a second later (caret jump); edge whitespace → visibly lost on the round-trip (the canvas renders `whiteSpace: pre-wrap`); whitespace-only content → nulls to empty after save. Every sibling text surface carries the guard (layers rename `maxLength={80}` + trim-at-commit at `layers-panel.tsx:197,216`; project rename `maxLength={120}`; descriptions 500) — the Content input is the one unclamped editable surface whose value round-trips through the store-replacing PUT.
- **B85-L1 (Low — the F68/F70 count family's recurrence): PAD §7.1 per-row counts ×2.** `Project_Architecture_Document.md:2255` — the server-lows-s84 row says 10 tests; the file contains **11** `it()` blocks (the S84 delivery's own arithmetic — "1024 = 994 + 30" with client-lows-s84=10 and doc-lows-s84=9 — requires 11; the row was born miscounted in the S84 commit itself). `PAD:2261` — the workspace.spec row says 10; Playwright lists **11** (the session-56 bell test landed after the row was last touched). The §7.1 unit rows now sum to 1023 against the (correct) total 1024; the e2e rows sum to 259 against 260. The count pins (doc-lows-s84 pins the TOTALS) cannot see per-row drift — the exact recurrence mode the F68/F70 lessons name.
- **B85-L2 (Low): `check-db-contract.ts` crashes with a raw Prisma dump on a missing DB file instead of its clean diagnostic.** `scripts/check-db-contract.ts:82` — `main().finally(() => prisma.$disconnect())` with NO `.catch`; a missing SQLite file at the resolved URL rejects the first `prisma.user.count()` and bun prints a minified `PrismaClientInitializationError` stack; the script's designed `CONTRACT MISMATCH — re-seed needed` line never prints. Fails closed (exit ≠ 0, no false-green) — diagnostic quality only, but a fresh checkout / trapped seed is the checker's MOST LIKELY failure mode (observed live during this session's own M-B85-1 repair).

**The informational set (S85-E):** A85-I1 (the dead `FILES = "140"` constant in `tests/doc-lows-s84.test.ts:27` — declared, never asserted, wrong vs reality 141: a dead copy one edit away from becoming a live wrong pin); A85-I2 (session_127.md + commit ea258f8 claim "the FULL auth.spec (17 tests)" — the spec carries exactly 16 `test(` blocks; AGENTS's live "(16 checks)" is the correct one — a delivery-time miscount in the newest session log, corrected by a line in session_129, the historical record kept); A85-I3 (the H-field's displayed `min={0}` vs the enforced type-aware floor — `properties-panel.tsx:1081` renders `min={0}` while W carries `min={element.type === "line" ? 0 : 1}` and both onChange paths clamp through `clampSizeField`; cosmetic display asymmetry); A85-I4 (the locale-dependent name sort — `recent-view.tsx:80` `b.name.localeCompare(a.name)` collates per the runtime locale; the S84-D en-US pin family covered date rendering, the sort sibling was left bare); B85-I1 (`.env.example:86`'s "read by the Playwright config, not the app" header — `E2E_BASE_URL` is actually read by five spec files, `E2E_PORT` by the config).

Auditor A's clean-layer verifications: zero XSS sinks (repo-wide grep); the autosave machine's full seam stack coherent; the gesture seam family coherent; the S84-B clamp family complete at all five consumers with the client-narrower siblings documented; the AI layer's sanitizer + abort + scope/epoch belts verified; the mobile nav + touch floors + a11y contracts all present. Auditor B's clean-layer verifications: all 18 routes' envelope/rate-limit/body-cap/transaction contracts; the rate-limit layer's fail-closed parsing; the auth/crypto family (scrypt + timingSafeEqual + tokenVersion eviction + single-use reset); the e2e auth budget honestly 9 of 10 at every claim site (call-level enumeration); the smoke suite's 63 checks verified arithmetically; the seed contract 1/2/6/1/3 verified in source AND live; the `skills/` folder excluded from every gate; `.env.example` covering all 7 app env reads.

## The deferred queue decisions (the lead's judgment on the open questions)

1. **The standing deferred queue carries forward unchanged** (the fillImageThumb codec-or-protocol trade awaiting a forcing function; the LLM server-side timeout with its "verified absent" SDK note; the VLM re-verification awaiting the quota window; the S73-G rotated-resize posture; the A84-I1 isTypingTarget whitelist posture; the B84-I3 resend-otp inert residue posture).
2. **A85-I3 (the H-field displayed min) — folded into S85-E** (the one-attribute display fix rides the small-honesty batch; the enforced clamp is already coherent).
3. **A85-I4 (the locale-dependent sort) — folded into S85-E** with the explicit-locale one-liner (the S84-D family's own form; ASCII names unaffected, diacritic names currently order per-device).

## The chosen session work (TDD)

### S85-A — the same-project re-entry fresh load (A85-M1, the headline)

The guard at `editor-view.tsx:1346` gains the mount discriminator — the `isMountRun` capture (line :1304, read BEFORE the boundary block flips `firstRunRef`) already discriminates the mount from the in-instance re-run:

```ts
if (!isMountRun && useEditorStore.getState().projectId === projectId) {
```

A FRESH mount re-entering the same project (isMountRun=true) now falls through to the standard GET + `loadProject` (fresh name, fresh elements, lineage-break undo semantics — the refresh doctrine extended to soft re-entry); the adoption re-run (isMountRun=false, the S61-I replaceState case) keeps its skip byte-identically.

**The leave-transport registry (the race closure):** the re-entry mount's GET can race the previous instance's at-unmount PUT (the S62-C soft-leave fetch at editor-view.tsx:478-489 — fire-and-forget, fired AT unmount). A module-level registry records that PUT's promise; the mount run awaits it (same project) before the GET:

```ts
// module scope
let leaveTransportFor: { projectId: string; done: Promise<unknown> } | null = null;
// the cleanup records; the mount's load awaits + clears
```

The machine's own in-flight PUT (the S71-B same-reference skip case) started strictly BEFORE unmount and is covered by navigation latency — the same semantics the accepted refresh path (pagehide keepalive PUT vs the fresh GET) already carries; the registry closes the at-unmount leg. The S62-C comment and the S81-B mount-guard comment gain the re-entry case; the S61-I comment block's enumeration gains its third case.

Pins: e2e behavioral (deterministically RED pre-fix — rename the project from the dashboard, re-enter the editor, the header shows the FRESH name; a second-tab element edit, re-enter, the canvas shows the fresh element) + unit source pins (the guard's `!isMountRun` form; the registry's record and await forms; the S62-C cleanup's record site).

### S85-B — the Text Content clamp (A85-L1)

The shared TextSection's Content input (properties-panel.tsx:959-969) mirrors the layers-rename sibling's form: `maxLength={2000}` on the input (the length teleport closed at typing time) + trim-at-commit on blur with the no-change guard (the whitespace teleport closed at commit time — `update({ text: clamped })` only when the clamped form differs). The onBlur extends the existing `sliderGesture.finish("text")` (order: gesture finish, then the clamped commit). The mobile Sheet rides the shared composition — one seam covers both surfaces.

Pins: unit source pins (the `maxLength={2000}` attr + the blur-commit clamp form at the TextSection) + behavioral pins where the pure seam allows (the `clampText(value, 2000)` boundary family — 2000/2001 chars, edge whitespace, whitespace-only → the server's own helper, already exported from `src/lib/validation.ts:39`, re-pinned at the consumer seam).

### S85-C — the PAD §7.1 row repair + the row-sum pin (B85-L1)

Correct the two stale rows (server-lows-s84: 10 → **11**; workspace.spec: 10 → **11**). Add THE ROW-SUM PIN — a unit test that parses the §7.1 table, sums the unit rows, sums the e2e rows, and asserts each sum equals its total row (1024 / 260) — closing the F68/F70 family for the table itself: a per-row drift can never again hide behind a correct total (this session's exact finding mode becomes structurally un-redistributable).

### S85-D — the check-db-contract clean diagnostic (B85-L2)

`scripts/check-db-contract.ts` — `main()` gains a `.catch` answering the clean diagnostic (`DATABASE FILE MISSING (or unreachable) — re-seed: unset DATABASE_URL && bun run db:push && bun run db:seed`, exit 1), so the checker's most likely failure mode prints its designed instruction instead of a minified Prisma stack.

### S85-E — the small-honesty batch (the Informational set)

(a) `tests/doc-lows-s84.test.ts:27` — the dead `FILES = "140"` becomes a LIVE pin: corrected to "141" and asserted against the doctrine files' 141-files claims (the dead copy can never silently rot again); (b) `session_129.md` carries the session_127 "17 tests" correction line (the historical record kept); (c) the H-field's displayed `min` aligns with the enforced type-aware floor (`min={element.type === "line" ? 0 : 1}`); (d) the recent-view name sort pins the explicit locale (`localeCompare(a.name, "en")` — the S84-D family's form); (e) `.env.example:86`'s header reworded to name both readers ("the Playwright config for E2E_PORT; five spec files for E2E_BASE_URL").

### S85-F — the session log + the worklog + the docs counts

`docs/session_129.md` (2×85 − 41 = 129), the repo worklog entry, the parent workspace worklog entry, and every count site updated to the delivered reality (the unit total grows by the new spec files' pins; the e2e total grows by the S85-A behavioral pins).

## The gate plan

The full gate re-run after the remediation: lint → typecheck → unit (the new total) → build → smoke 63 → e2e (the new total). The DB re-seeded to the pristine contract after every mutating phase; the mobile-nav contract re-verified on the final build (the single-call verifier); the screenshot capture re-run with the standard set + the S85 inline checks (the re-entry fresh-name witness, the text-clamp witness); the dimension checker's mapping extended.

## Execution status

- [x] Baseline gate re-proven green (1024 / 141 files / 63 / 260) — the F59 corollary HOLDS
- [x] 61st reference audit — NO DRIFT on any standing datum
- [x] 62nd mobile-nav verification — 9/9 GREEN (baseline + the final S85 build)
- [x] M-B85-1 environment repair (the DB re-seeded at the repo path, PRISTINE CONTRACT OK)
- [x] S85-A — EXECUTED: the guard's `!isMountRun` discriminator + the leaveTransportFor registry; the e2e RED proof ran BOTH ways live (the pre-fix guard rebuilt → both discriminators RED on the stale-name/stale-elements assertions; the restore → GREEN); unit source pins green
- [x] S85-B — EXECUTED: maxLength={2000} + the trim-at-commit no-change-guard blur; the behavioral clampText family + the source pins green; the capture's clone-41 live witness ({len:2000, afterBlur:2000, capped:true})
- [x] S85-C — EXECUTED: the two rows corrected (10→11 ×2) + the row-sum pin; **the pin's first run caught FOUR more never-rowed files** (present-overlay 2 / sheet-lifecycle 3 / recent-mount-guard 1 / reset-url-guard 2) — all rows added retroactively
- [x] S85-D — EXECUTED: the .catch clean diagnostic; live-witnessed by renaming the DB file away and back
- [x] S85-E — EXECUTED: the FILES constant live-dynamic, the H-field min, the "en" sort locale, the .env.example header, the session_129 correction line
- [x] S85-F — EXECUTED: session_129.md + the worklog + digma_SKILL v1.63.0 (lesson F72) + the counts (1047/143/262) across every live claim site + the AGENTS session-85 seam bullet
- [x] The full gate + the live verification + the capture: lint · typecheck · 1047 unit / 143 files · build · 63 smoke · 262 e2e — ALL GREEN; the capture with clone-40/clone-41; dimensions 444/444; the DB pristine after every mutating phase
- [x] The docs alignment + the commit + the SSH-wrapper push

## Execution notes (en-route discoveries)

1. **The row-sum pin earned its keep in its first run** — beyond the two planned row corrections, the pin caught four pre-existing files whose tests the totals carried while the table never listed them (the retroactive-row repair mirrors session 84's s83-rows repair — the same family, one generation back each time).
2. **The standing-pin re-anchoring set was EIGHT, not the initially-expected two** — the guard-form change (S85-A) and the onBlur block form (S85-B) each rippled through their pin families (client-lows-s77, gesture-arm-s66, slider-gesture, soft-leave-flush ×3, unload-flush); the count changes rippled through four more (doc-lows-s69, server-lows-s80, doc-lows-s84, server-lows-s81). Every re-anchor documents its intent in the pin — the F68/F70 discipline.
3. **The F42 escape-strip hazard** (F72 lesson 5): the capture script derived through Python string insertion silently lost the `\"` escapes inside the clone-41 eval — the eval that worked interactively returned empty in the script; byte-level verification against the working form found it. The `tr` unescaped-backslash warning on the same line was the tell.
4. **The F64 ordering rule's fifth appearance**: the two new capture checks initially ran AFTER the s76 reset-replay check (which evicts the browser session via the tokenVersion bump) — everything after it is unauthenticated; the checks moved BEFORE it.
5. **The e2e RED proof** was run as a live revert (the pre-fix guard form rebuilt, both discriminators failing on the stale assertions, the restore rebuilding to green) — the strongest RED evidence the discipline allows.

