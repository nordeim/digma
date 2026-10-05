# Remediation Plan — Session 83 (the Thirty-First Audit)

**Date:** 2026-10-05 · **Trigger:** the operator's session-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the `.env` database contract with `db/` at the repo root, the vitest/playwright suites, the TDD remediation, the screenshots, the aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's re-verification of the session-82 delivery (all four S82 seams verified intact in source at baseline — the stand-down guard's listbox/combobox selectors at editor-view.tsx:578, the `!sessionDead` drain predicate at :375, the `USER_LIMIT` constant at validation.ts:242 with the register transaction form, the check-db-contract redaction folds at :45/:47, the smoke body-cap probes at smoke-test.sh:464-483), then the THIRTY-FIRST Mode C audit: two independent fresh-eyes full-file reviews by separate agents — auditor A over the editor core + client view layer (editor-view ×1871, editor-store ×483, canvas/toolbar/layers/panels/properties/ai-assistant, the app-header + view components, the vendored ui primitives, use-toast, lib/editor + validation + call client seams), auditor B over the server + lib/config/infra side (all 18 route files, all libs, prisma schema + seed, every root config, the smoke/check-db-contract/get-seed-ids scripts, the e2e infra, `.env.example`) — against the `skills/code-review-checklist` dimensions with the AGENTS/CLAUDE documented contracts loaded first. Every chosen finding individually re-verified by the lead in source before this plan.

**The baseline gate state — the F59 corollary BROKEN this cycle, honestly reported:** lint ✓, typecheck ✓, but the unit gate is **RED at 960/961** — the session-82 delivery's own S82-E docs pass updated `docs/DEPLOYMENT.md` to the 63-smoke/260-e2e counts and RE-ANCHORED the s81 count pins (`tests/server-lows-s81.test.ts:114-120`) but MISSED the older s69 pin (`tests/doc-lows-s69.test.ts:89-99` still expects "61 smoke / 259 e2e") — the exact hazard the F68 count-drift family names: the family grep must include the TESTS THAT PIN THE NUMBERS, not only the doctrine files. The session-82 "full gate green" claim was true at the moment the two s81 pins were fixed (the pre-push re-run) but the s69 pin's RED was masked by the run's tail truncation; the claim is contradicted by the current tree. The gate repair is this session's first slice.

## Reference findings (59th audit — no drift on the standing datums)

The standing datums re-verified on `https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 + mobile 390×844, the real CDP login with the operator's credentials, evidence `docs/screenshots/ref-audit-s93/`): the desktop nav 124/96/92 × 36; the greeting with the populated name + sparkle ("Good afternoon, sepnetflix2023 ✨"); Quick Stats 1 Projects / 0 Teams / Pro Plan; the Recent sort `last_accessed` / "1 file found"; zero kbd affordances (the string-concatenation re-probe form — the plain-number eval quirk hit a FOURTH time this session; the JSON-wrapped form ALSO answered `{}` this cycle, the string-concatenation form is the reliable re-probe); the Create-Team dead chrome (clicked → dialogs=0, re-probed the same way); R3 mobile nav failure class A (nav `display:none`, links 0×0, no hamburger — the dashboard AND the editor page); the mobile editor header clipping Share/Present at 390 re-measured EXACTLY (Share L385–R458, Present L466–R551 — byte-identical to the session-63…82 measurement, the 20th consecutive session); the board's project text-verified. **NO DRIFT — no parity work required this cycle.**

The clone's mobile navigation verified live end-to-end at 390×844 — the **60th consecutive session**, ALL GREEN via the single-call verifier `scripts/verify-nav-s83.sh` (9/9: the 44×44 hamburger with the aria contract at [16,10], the Sheet's 44px links + aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape with focus return + lock release, navigate-and-dismiss, the md-crossing close, the 768 boundary, and the class-A guard — the Tailwind v4 failure class A NOT present). Verified on the S82 build at HEAD `2f9ff7a`.

## The code audit findings (Mode C — thirty-first pass)

**0 Critical / 1 High (a live gate break, not a security defect) / 1 Medium / 5 Low / 6 Informational** combined (auditor A: 0/0/1/3/3; auditor B: 1/0/0/2/3; the research agents' doc-drift findings fold into the Low docs-honesty family) — every chosen finding individually re-verified by the lead in source:

- **B83-H1 (High — THE GATE BREAK): `tests/doc-lows-s69.test.ts:89-99` pins DEPLOYMENT.md at "61 smoke / 259 e2e" — the unit gate is deterministically RED at 960/961.** DEPLOYMENT.md:165-166 carries the session-82 counts (63 smoke / 260 e2e); the pin still expects the session-81 pair. The same file's :82-87 block pins "23 routes" (the "6 page routes + 18 API route files" arithmetic from DEPLOYMENT.md:14-15 — itself a birth miscount: the app ships 7 page routes and 25 exported handlers across the 18 route files). Every future session's F59 baseline re-proof fails until the pin is re-anchored.
- **A83-M1 (Medium — THE HEADLINE): `isTypingTarget`'s no-text carve-out misses `input[type="color"]` — undo/delete/tool keys are dead while focus rests on any color swatch.** `src/lib/editor.ts:280-283` — the predicate carves out only `range`; the S64-G rationale applies verbatim to `type="color"` (the native color picker accepts no text). The Fill/Stroke/Text/Background swatches in `properties-panel.tsx` render `<input type="color">`; after the native picker closes, focus rests on the swatch, and the global keydown's `isTypingTarget` returns true — `store.undo()` never runs (the most likely next action after a color pick), Delete/tool keys/`?` equally dead until the user clicks elsewhere. The byte-for-byte S64-G defect class on the one input type the carve-out never reached.
- **B83-L1 (Low): the e2e webServer leaks the operator's exported env into the "hermetic" server.** `playwright.config.ts:75` spreads `...process.env` (and `tests/e2e/global-setup.ts:14-17` does the same) — only DATABASE_URL/PORT/NODE_ENV/AUTH_SECRET/DIGMA_DISABLE_AI_LLM are pinned. An exported `DIGMA_PROXY_HOPS=0` collapses the whole auth budget into the shared bucket and breaks `auth.spec`'s arithmetic; `DIGMA_DISABLE_IN_APP_OTP=1` / `DIGMA_DISABLE_IN_APP_RESET=1` / `DIGMA_REPO_ROOT` all leak and fail the gate spuriously. The documented hermeticity posture covers the smoke parent DATABASE_URL trap, the stale-server pre-kill, and the AI knob — this leak class is undocumented.
- **B83-L2 (Low): the register route burns its scrypt hash INSIDE the interactive transaction.** `register/route.ts:89` — `passwordHash: hashPassword(password)` runs inside the `db.$transaction` callback: sync CPU work (the scrypt cost) inside the SQLite writer window, lengthening both the held transaction and the event-loop block mid-transaction. No functional issue at documented scale; the S82-C re-shape placed it there. Moving the hash above the transaction is behavior-identical and shortens the window.
- **B83-L3 (Low — the docs-honesty family, the S82-E batch's survivors):** ~25 stale sites across all six doctrine files + the s69 pin's own route-count block: `AGENTS.md:47` (auth.spec "14 checks" vs the real 16), `AGENTS.md:60` (mobile-properties "13 checks" vs the real 14), `AGENTS.md:3` + `CLAUDE.md:9` ("five page routes" enumerating six, omitting `/reset-password`), `README.md:168` ("6 models" listing five), `README.md:177/:190` ("3 states" vs the documented five login states), `README.md:36` (the mobile-nav pin phrasing), `README.md:265-271` + `CLAUDE.md:192-199` (env tables missing knobs of the seven-read coverage contract), `README.md:275` ("All endpoints" vs the `/api/health` carve-out), `README.md:277-292` (the API table's 14 endpoints vs the 18 handlers), PAD §7.1 (the table missing the three session-82 rows — client-lows-s82 7 / server-lows-s82 11 / session82-fixes 1), PAD:1781 ("56 HTTP checks"), PAD:1783 ("20 captured PNGs"), PAD §3.2 (primitives list omits `select`), PAD §11 (editor-view 1844 / db-path 165 / smoke-test 430 / validation 234 line counts), `digma_SKILL.md:6/:243` ("build 23 routes"), :126 (23 component files / 19 use-client), :187 (~101 auth lines), :510 (162 @theme lines), :582 (Appendix B "58 checks"), :567 (Appendix B route list omits reset-password), :67 (primitives omits `select`), and the in-code comment `ai-assistant.tsx:468-475` (the "exactly two live regions" claim vs the Toaster's transient polite regions). The F68 count-drift family's recurrence: the S82-E grep reached the doctrine files but not the PAD's own §7.1 table rows, the Appendix-B sites, or the line-count columns.

## The deferred queue decisions (the lead's judgment on the open questions)

1. **A83-L1 (cross-tab re-authentication never revives the autosave terminal) — POSTURE ROW.** The S68-D contract reads "the work is NOT saved and CANNOT be until the user signs in again"; the mechanism honors it via the same-tab flow (the editor unmounts on the /login navigation; remount resets the flag). The cross-tab flow (re-auth in a second tab, return to the still-open editor) leaves `sessionDead` set for the tab's lifetime — every edit re-arms the timer into a no-op, the badge honestly reads "Unsaved", manual export remains. The honest fix needs a session-revival signal the cookie layer does not expose (a re-validation flush risks the S57-B swap-guard family); the manual-export escape hatch and the honest badge keep it Low. Documented with the auditor's reasoning.
2. **A83-L2 (the mobile Sheets' selection-empty unmount drops focus to document.body) — POSTURE ROW.** The early-return `return null` unmounts the portal while `open` was still true, so Radix's controlled-close focus-return never fires. The trigger path is rare (selection emptying behind a modal scrim); the same component's lg-crossing close is the correct controlled form. A controlled-close re-shape touches the S65-B gesture-terminal seam — a cosmetic fix against a documented-stable surface. Documented.
3. **A83-L3 (the Components panel's "New component" dead button) — POSTURE ROW (the citation fixed in S83-E).** The control is the reference's own dead chrome carried by the clone (component authoring is the documented scope cut); the header comment's PAD §10 citation points at the element-vocabulary row that does not name this control — S83-E adds the honest row naming it.
4. **A83-I1 (the "exactly two live regions" comment claim) — FOLDED INTO S83-E** (the comment's honest form: the transcript + the badge are the two PERSISTENT regions; the Toaster adds transient polite regions).
5. **A83-I2 (template-preview raw `<img>`) — POSTURE ROW** (long-standing deliberate form; remote previews would need `remotePatterns`; no regression).
6. **A83-I3 (the per-instance "Session expired" toast on re-entry) — POSTURE ROW** (once per visit, bounded, honest — the flip side of A83-L1's lifetime semantics).
7. **B83-I2 (the chunked probe's HTTP/1.1-only form) — POSTURE ROW** (curl rejects manual TE headers over h2; the smoke script never passes `--http2`; the comment documents the contract).
8. **B83-I3 (check-db-contract's whitespace-padded over-refusal) — POSTURE ROW** (over-refusal in the safe direction).
9. **The standing deferred queue carries forward unchanged** (the fillImageThumb codec-or-protocol trade atop it, the LLM server-side timeout with its "verified absent" SDK note, the VLM s80/s81/s82 verification runs awaiting the quota window, the session-82 posture rows).

## The chosen session work (TDD)

### S83-A — the `isTypingTarget` carve-out reaches the color swatch (A83-M1, the headline)

One widened line at `src/lib/editor.ts:283`:

```ts
return type !== "range" && type !== "color";
```

The S64-G one-line form, extended to the one input type the carve-out never reached. A native color input accepts no text; the keyboard shortcuts (above all Ctrl+Z — the most likely next action after a Fill/Stroke pick) must not stand down behind it. Text/password/email inputs keep the exemption.

Pins: the BEHAVIORAL pin (the family's first true behavioral form — the predicate is a pure function; a stub `{ tagName: "INPUT", type: "color" }` element asserted to return FALSE pre-RED, with the `range` sibling and the `text` survivor asserted in the same block) + the source pin (the predicate line carries both carve-outs). The standing S64-G pin at `tests/slider-gesture.test.ts:173` legitimately re-anchored onto the widened form (the intent unchanged, documented in the pin's comment).

### S83-B — the gate repair (B83-H1)

Two re-anchors in `tests/doc-lows-s69.test.ts` + one doctrine fix:
1. The :89-99 block onto "63 smoke / 260 e2e" (the session-82 delivery counts — the pin's intent, "DEPLOYMENT.md carries the DELIVERY counts", is unchanged; the re-anchor comment documents the miss: the S82-E grep reached the doctrine files but not this older pin).
2. The :82-87 block onto the REAL route arithmetic: DEPLOYMENT.md:14-15 corrected to "the 7 page routes and the 18 API route files (25 routes total)" — the birth miscount fixed at the source; the pin re-anchored to `/25\s+routes/` with the negative forms updated.

The RED phase for this slice is the CURRENT gate state (960/961 — the pin is already red); the GREEN phase is the re-anchor itself. The DEPLOYMENT route-count half demonstrates its RED honestly: fix the doc first, the pin goes red on the "23 routes" assertion, then re-anchor.

### S83-C — the e2e server's hermetic env (B83-L1)

The `...process.env` spread in `playwright.config.ts:75` and `tests/e2e/global-setup.ts:14-17` gains the knob-deletion form — a copied env with the four app knobs deleted (`DIGMA_PROXY_HOPS`, `DIGMA_DISABLE_IN_APP_RESET`, `DIGMA_DISABLE_IN_APP_OTP`, `DIGMA_REPO_ROOT`) before the pinned overrides apply (PATH/HOME survive for the spawn; the five pinned overrides unchanged). An operator-exported knob can no longer leak into the "hermetic" e2e server.

Pins: the source pins (both files carry the delete discipline; the four knobs enumerated).

### S83-D — the register hash moves above the transaction (B83-L2)

`hashPassword(password)` computed before `db.$transaction` (a `const passwordHash` line above the `try`), the create's `passwordHash:` consuming the constant — behavior-identical (the hash is deterministic, the input validated above), the scrypt cost leaves the SQLite writer window. The P2022/P2028 arms and the over-cap sentinel unchanged.

Pins: the source pin (the hash line precedes the `$transaction` call; the create consumes the constant).

### S83-E — the docs honesty batch (B83-L3 + the folded I1)

The ~25 stale sites corrected to the verified realities, written at DELIVERY time with the realized counts (the F68 discipline): the AGENTS/CLAUDE/README/PAD/SKILL sites enumerated in the finding, the PAD §7.1 table's three session-82 rows, the in-code comment's honest form, the two env tables' coverage completion, the README API table's four missing auth endpoints, the health-envelope carve-out, and the PAD §10 posture rows for the deferred decisions above. The family grep re-runs across every doctrine file AND every count pin for every stale number (this cycle's own lesson: the grep must include `tests/doc-lows-*.test.ts` — the S82-E grep's blind spot).

### S83-F — the session log + the worklog

`docs/session_125.md` (the 2× audit-session − 41 mapping: 2×83 − 41 = 125) + the worklog entry + the PAD v1.62.0 revision block + the digma_SKILL v1.61.0 bump with lesson F70.

## Planned counts

Unit: +~16 pins across three new spec files (`client-lows-s83` — the isTypingTarget behavioral + source family, ~6; `server-lows-s83` — the hermeticity + hash-before-tx + gate-repair-adjacent pins, ~5; `doc-lows-s83` — the docs-honesty pins, ~5) → **~977**. E2E: 260 (unchanged — the color carve-out rides the unit behavioral pin; the S64-G sibling never carried an e2e discriminator). Smoke: 63 (unchanged). The gate repair returns the s69 pin to GREEN (the 960/961 red → the full green).

## RED expectations

Unit RED: the isTypingTarget behavioral pins (the color stub returns TRUE pre-fix); the source pin (the widened line absent); the hermeticity source pins (the delete discipline absent); the hash-before-tx source pin (the hash inside the transaction); the doc-honesty pins (the stale forms present). The s69 pin is ALREADY RED (the gate state, not a new pin). E2E and smoke: unchanged by design.

## Execution order

S83-A → S83-B → S83-C → S83-D → unit GREEN (the full suite — the s69 red closes with S83-B) → lint → typecheck → build → smoke (63) → the full e2e suite (260) → full gate → live verification + screenshots (the capture script + the dimension checker) → `.env.example` verification → docs (S83-E + S83-F) → commit + push.

## Execution status

- [x] S83-A — the isTypingTarget color carve-out (the BEHAVIORAL pin family — the pure predicate called with stub elements: the color stub FALSE pre-RED, the range sibling + the text-family + the non-input survivors asserted in the same block; the standing S64-G source pin re-anchored onto the widened form, the intent documented in the pin; the live capture check clone-37: `{layer:true,color:true,focused:true,rectPressed:true}` — "r" ARMS the Rectangle tool behind the focused swatch)
- [x] S83-B — the gate repair (the s69 pin's 61/259 block re-anchored to 63/260 with the miss documented in the pin — the RED phase was the CURRENT gate state itself, 960/961; the route-count block re-anchored 23 -> 25 with the DEPLOYMENT birth-miscount fixed at the source; the doc-first ordering demonstrated the pin's RED honestly before the re-anchor)
- [x] S83-C — the e2e hermetic env (both playwright.config.ts's webServer and tests/e2e/global-setup.ts: the env copy DELETES the four app knobs before the pinned overrides; the full e2e suite re-ran green under the discipline — 260/260)
- [x] S83-D — the register hash above the transaction (the const consumed by the create; the S82-C survival pin — count-guard/USER_LIMIT/abort arms — asserted unchanged)
- [x] S83-E — the docs honesty batch (the realized batch: ~25 sites across AGENTS/CLAUDE/README/PAD/digma_SKILL/DEPLOYMENT + the in-code live-regions comment — see the doc-lows-s83 spec's 21 pins; THREE standing pins legitimately re-anchored — the s64 slider-gesture source pin, the s78 live-regions pin, the s81 count pin onto 994/63/260 — all intents unchanged, all documented in the pins)
- [x] S83-F — the session log (docs/session_125.md) + the worklog entry
- [x] Full gate green — zero regressions (lint · typecheck · 994 unit = 961 + 33 / 138 files · build · 63 smoke · 260 e2e — the full e2e re-run on the final code; the RED -> GREEN transitions honest: 24 unit defect pins deterministically RED pre-fix across the three new spec files; 9 GREEN-by-design survival pins)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the final S83 build — the 60th consecutive session; the standard 32 re-captured + the ref-audit-s93 evidence set (14 shots) + the standing checks re-verified live + the new clone-37 color-swatch check; dimensions 421/421; the DB re-seeded pristine after every mutating phase; the VLM window not probed this cycle — the deterministic inline checks + the dimension check cover the session's evidence, the backlog documented)

## Execution notes (the realized counts + the en-route work)

Unit: +33 checks across three new spec files (client-lows-s83 6, server-lows-s83 6, doc-lows-s83 21) -> **994 = 961 + 33 / 138 files**. E2e: **260** (unchanged — the color carve-out rides the unit behavioral pin, the S64-G sibling's own form). Smoke: **63** (unchanged). THREE standing pins legitimately re-anchored (the s64 slider-gesture source pin onto the widened carve-out, the s78 live-regions pin onto the honest persistent/transient form, the s81 count pin onto the delivery counts). One en-route pin-form bug fixed during the RED phase (the global-setup DATABASE_URL regex missing the /db path segment — the pin's own form, caught by the first RED run).

**The F70 en-route lessons:** (1) the no-text-input taxonomy (a typing-target predicate must enumerate the whole no-text input family — range AND color; the pure predicate admits the family's first honest BEHAVIORAL pin); (2) the pin-grep closure of the count-drift family (a pin that pins a doc's count is a SECOND copy of that count — the family grep must reach both copies; the gate sat red for a cycle because the prior session's grep reached only the doctrine files); (3) the hermetic-env inheritance leak (a `...process.env` spread inherits every exported var — the hermetic form copies, DELETES the app knobs, then overrides); (4) the sync-cost-in-transaction smell (compute constants before `db.$transaction`, consume them inside).
