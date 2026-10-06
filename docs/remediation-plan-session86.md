# Remediation Plan — Session 86 (the Thirty-Fourth Audit)

**Date:** 2026-10-06 · **Trigger:** the operator's session-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the `.env` database contract with `db/` at the repo root, the vitest/playwright suites, the TDD remediation, the screenshots, the aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's re-verification of the session-85 delivery (all four S85 seams verified intact in source at baseline — the `!isMountRun` re-entry guard at editor-view.tsx:1398, the `leaveTransportFor` registry recorded at the S62-C cleanup :493-503 and drained at :1357-1362, the TextSection `maxLength={2000}` + trim-at-commit :977-989, the H-field's type-aware displayed min :1112), then the THIRTY-FOURTH Mode C audit: two independent fresh-eyes full-file reviews by separate agents — auditor A over the editor core + client view layer (~11.4k lines: all 8 editor components, all app views, all 10 vendored primitives, both hooks, lib/editor + lib/ai-assistant, the S85 spec trio — the unit gate re-run green 1047/1047 in the auditor's own environment), auditor B over the server + lib/config/infra side (all 18 route files, all 12 server libs, prisma schema + seed, all 8 root configs, the 5 scripts, the e2e infrastructure, the newest spec files — lint + typecheck + unit 1047/1047 + the Playwright `--list` 262-test enumeration re-run green) — against the `skills/code-review-checklist` dimensions with the AGENTS/CLAUDE documented contracts loaded first. Every chosen finding individually re-verified by the lead in source before this plan.

**The baseline gate state — the F59 corollary HOLDS this cycle (the third consecutive):** lint ✓, typecheck ✓, unit **1047/1047 across 143 files** ✓, build ✓, smoke **63/63** ✓, e2e **262/262** ✓ (all six gates re-run by the lead at baseline). The session-85 "full gate green" claim is TRUE at the current tree.

**The environment at baseline:** `.env` carries the mandated `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root; the parent shell's exported `DATABASE_URL` trap unset at every gate invocation (the documented M-B85-1 discipline); `scripts/check-db-contract.ts` prints `PRISTINE CONTRACT OK` (1/2/6/1/3) at the resolved repo path.

## Reference findings (62nd audit — no drift on the standing datums)

The standing datums re-verified on `https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 + mobile 390×844, the real CDP login with the operator's credentials, evidence `docs/screenshots/ref-audit-s96/`): the desktop nav 124/96/92 × 36; the greeting with the populated name + sparkle; Quick Stats 1 Projects / 0 Teams / Pro Plan; the Recent sort `last_accessed` / "1 file found"; zero kbd affordances (the string-concatenation IIFE re-probe: `kbd=0`); the Create-Team dead chrome (clicked → `dialogs=0`); R3 mobile nav failure class A (nav `display:none`, links 0×0, no hamburger — the dashboard AND the editor page); the mobile editor header clipping Share/Present at 390 re-measured EXACTLY (Share L385–R458, Present L466–R551 — byte-identical the **23rd consecutive session**); the board's project text-verified ("Test Project One"). **NO DRIFT — no parity work required this cycle.**

The clone's mobile navigation verified live end-to-end at 390×844 — the **63rd consecutive session**, ALL GREEN via the single-call verifier `scripts/verify-nav-s86.sh` (9/9: the 44×44 hamburger with the aria contract at [16,10], the Sheet's 44px links + aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape with focus return + lock release, navigate-and-dismiss, the md-crossing close, the 768 boundary, and the class-A guard — the Tailwind v4 failure class A NOT present). Verified on the session-85 build at HEAD `a003732` (the first run hit a transient agent-browser eval hiccup on check 1 — empty string; the manual re-probe and the script re-run both GREEN, the 9/9 honest).

## The code audit findings (Mode C — thirty-fourth pass)

**0 Critical / 0 High / 0 Medium / 6 Low / 5 Informational** combined (auditor A: 0/0/0/3/2; auditor B: 0/0/0/3/3) — the second consecutive audit with zero Critical/High/Medium code defects; the chosen Low set is the clamp-family completion on the AI path, an ordering window in the leave transport, and the docs-honesty family. Every chosen finding individually re-verified by the lead in source:

- **A86-L1 (Low — the S85-B family's AI members): the AI apply seam commits element text RAW.** `src/components/editor/ai-assistant.tsx` — the add path builds `partial.text = operation.element.text` (:180) and the update path builds `patch.text = operation.patch.text` (:217) with NO clamp; the fallback's quoted content (`src/lib/ai-assistant.ts:251-254`) and the sanitizer's `slice(0, 500)` (:324) never TRIM. Against the server seam `clampText(raw?.text, 2000)` (`src/lib/editor.ts:939` — trim + slice, whitespace-only → null) and the store-replacing PUT response (`markSaved`), exactly the A85-L1 teleport class: the LENGTH half is bounded (route message cap 1000 / sanitizer 500 < 2000), but the WHITESPACE half fires — an AI-created or AI-updated text with edge whitespace renders locally (the canvas's `whiteSpace: pre-wrap` makes it visible), then visibly loses it on the ~1s round-trip; a whitespace-only AI text nulls to empty after the save. Every sibling surface carries the guard (the TextSection since S85-B; the layers rename; the project rename) — the AI apply path is the family's missed consumer.
- **A86-L2 (Low — the S84-B family's multiplicative member): `scaleElements` has no 100000 ceiling.** `src/components/editor/editor-store.ts:300-313` — `Math.max(el.width * factor, floor)` only; the consumer is the AI apply's `store.scaleElements(targets, operation.patch.scale, …)` (`ai-assistant.tsx:253`); the sanitizer bounds the MULTIPLIER (0.05..20, `lib/ai-assistant.ts:361`) but not the PRODUCT. Reachable: an LLM ×20 scale on a >5000-wide element (itself reachable via the sanitizer's 20000 width cap) or ~8 repeated "make it bigger" commands — the oversized width renders locally, then VISIBLY TELEPORTS to the server's 100000 bound (`clampNumber(raw?.width, 0, 100000, 100)`) when the store-replacing PUT lands. Every sibling path is bounded (the panel's `clampSizeField`, the gesture-bounded resize, the sanitizer-clamped AI width/height patches) — the multiplicative path is the family's missed member.
- **A86-L3 (Low — the S85-A registry's ordering gap): the S71-B reference-mismatch double-PUT can complete OUT OF ORDER.** `src/components/editor/editor-view.tsx:466-505` — when an edit lands between the machine's capture and the unmount (the `!machineCarriesThisState` reference-mismatch branch), the cleanup fires PUT₂ (the NEWER state) while the machine's PUT₁ (the OLDER state) is still in flight; HTTP does not guarantee the landing order of two parallel same-project full-replace PUTs. If PUT₁ lands last, the server silently regresses to the pre-edit state; the sharpest edge is the re-entry: the S85-A registry awaits only PUT₂, so the mount's GET can read PUT₁'s regressed result (the fresh-load fix loads the STALE state). The S71-B "safety net" posture assumed ordered landing — an assumption the transport never made. The machine's own pending re-run (+800ms, deliberately not disposed-gated) usually repairs the regression, but the window exists and the registry's drain half doesn't cover it.
- **B86-L1 (Low — the F68/F70 family's birth recurrence): `.env.example:88` "the five spec files" is stale at birth.** `E2E_BASE_URL` is read by **SIX** spec files (export-png, mobile-properties, session58-fixes, session60-fixes, session61-fixes, session85-fixes — the last landed in the SAME commit `6e21d43` as the S85-E header correction; the honesty fix undercounted its own delivery). Second copies: the `doc-lows-s85.test.ts:146` pin asserts `/five spec files/i` (a pin on a doc's count is a second copy — it stays green while the claim is wrong) and the PAD's §3 line.
- **B86-L2 (Low): the PAD §11 key-files table carries FIVE stale line counts.** editor-view **1870→1922** (grown by S85-A itself), properties-panel **1528→1562** (S85-B), editor.ts **915→948** (S84-B), dashboard-view **415→420** (S84-D), ai-assistant.tsx **586→589**. The other 24 rows verified exact by the auditor.
- **B86-L3 (Low): `README:287` "verify-otp … (burns on success, 3 attempts)" vs the implemented 5.** `MAX_VERIFY_ATTEMPTS = 5` (`verify-otp/route.ts:17`); AGENTS and PAD both say 5. Born in session 43 (the same commit that implemented the 5-attempt ceiling); survived 43 sessions because count-family greps never reach per-endpoint prose.
- **The informational set (S86-C):** B86-I1 (`reset-password.spec.ts:15` says "six auth calls" in its own XFF bucket; the call-level enumeration finds SEVEN — the invalid-token-submit test's `POST /api/auth/reset-password` is the uncounted seventh; 3 headroom, no risk); B86-I2 (`PAD:2318`'s smoke row says "bash + curl + **jq**" — the script has zero jq; it uses python3 at :345/:386/:401); B86-I3 (stale test TITLES with live assertions: `server-lows-s81.test.ts:147/156/169` say "61/259" while the assertions are live at 63/262, and `doc-lows-s84.test.ts:66`'s describe title carries "1024/141/260" vs the live 1047/143/262 constants — titles are the docs-family's unread members); A86-I1 (the number-field min/max DISPLAY attributes are partial — X/Y none, the four radius fields none; every value clamps at the consumer, so a spinner can only propose a value that snaps — a posture row); A86-I2 (the mobile Layers/Components posture and the toolbar's 32px reference-measured chrome — documented posture rows).

Auditor A's clean-layer verifications: the singleton-store hazard sweep — all nine projectId-identity guards enumerated, every one correctly discriminated; the autosave machine's full seam stack coherent; the gesture family coherent; zero XSS sinks; all three editor Sheets' aria contracts; the 44px touch floors; zero Tailwind v4 failure forms; the S85 spec trio's pins match shipped source. Auditor B's clean-layer verifications: the auth budget honestly 9 of 10 at CALL level; the §7.1 table verified row-by-row beyond the sum pin (zero mismatches); the TOCTOU ceilings; the body-cap complete at 14 sites; the P2002/P2003/P2025/P2024/P2028 arms; the seed contract verified live; all 7 app env reads covered; the route arithmetic real.

## The deferred queue decisions (the lead's judgment on the open questions)

1. **The standing deferred queue carries forward unchanged** (the fillImageThumb codec-or-protocol trade awaiting a forcing function; the LLM server-side timeout with its "verified absent" SDK note; the VLM re-verification awaiting the quota window; the S73-G rotated-resize posture; the A84-I1 isTypingTarget whitelist posture; the B84-I3 resend-otp inert residue posture).
2. **A86-I1 (the number-field display attributes) — a POSTURE ROW** (the enforced clamps are coherent at every consumer; the display-only min/max asymmetry can only propose values that snap — the S85-E H-field display fix closed the one member whose displayed floor was WRONG; these display gaps are cosmetic).
3. **A86-I2 (the mobile Layers/Components posture + the toolbar chrome) — POSTURE ROWS** (documented deliberate postures, re-confirmed).

## The chosen session work (TDD)

### S86-A — the leave-transport ordering closure (A86-L3, the headline)

The machine's in-flight descriptor (`inFlightRef`, editor-view.tsx:102) gains a `flightDone` promise handle — resolved in the flush's `finally` (the flight's true completion: the response handled, the descriptor cleared). The cleanup's reference-mismatch branch chains its PUT₂ STRICTLY AFTER the machine's PUT₁:

```ts
const descriptor = inFlightRef.current;
const machineFlight =
  descriptor !== null && descriptor.projectId === state.projectId
    ? descriptor.flightDone
    : Promise.resolve();
leaveTransportFor = {
  projectId: state.projectId,
  done: machineFlight
    .then(() =>
      fetch(`/api/projects/${state.projectId}/elements`, { method: "PUT", ... }),
    )
    .catch(() => null),
};
```

The server now sees PUT₁ (older) land before PUT₂ (newer) — the ordering the S71-B posture always assumed; the registry's `done` covers the whole sequence, so a same-project re-entry mount awaits BOTH legs before its GET (the S85-A drain half extended to the machine's flight). The `machineCarriesThisState` skip branch is untouched (a pure duplicate still skips byte-identically). The S71-B comment gains the ordering case; the S85-A registry's module-level note gains the sequence semantics.

Pins: unit source pins (the descriptor's `flightDone` field; the `finally`'s resolve site; the cleanup's chained `.then` form; the registry's `done` carrying the chain) + the behavioral boundary family where the pure seams allow. The e2e re-entry discriminators (session85-fixes) re-run green — the ordering fix must not disturb the S85-A contract.

### S86-B — the AI apply clamp family (A86-L1 + A86-L2)

(a) The text clamp: the apply seam's two sites consume `clampText(x, 2000)` — the add path's `partial.text` and the update path's `patch.text` (the import from `src/lib/validation.ts`, the same seam the TextSection's blur consumes). The AI-path length half is already bounded (< 2000); the trim half closes the whitespace teleport — an AI text now commits EXACTLY what the server will echo back. (b) The scale ceiling: `scaleElements` (editor-store.ts) consumes `clampSizeField(el.width * factor, el.type)` / `clampSizeField(el.height * factor, el.type)` — the S84-B helper mirroring the server's `clampNumber(raw?.width, 0, 100000, …)` bound; the multiplicative path joins every sibling in the bounded set.

Pins: unit behavioral pins on the pure seams (`clampText` boundary family re-pinned at the AI consumer; `clampSizeField` at the ×20-on-5000 boundary → 100000) + source pins at the three consumer sites.

### S86-C — the docs-honesty batch (B86-L1..L3 + the informational set)

(a) `.env.example:88` "the five spec files" → "the six spec files (+ session85-fixes)" and the `doc-lows-s85.test.ts` pin re-anchored onto a REALITY-DERIVED reader count (the spec greps `tests/e2e/*.spec.ts` for `E2E_BASE_URL` and asserts the doc's number equals the grep count — the pin can never again enshrine a stale claim; the F72 dead-constant lesson's live-dynamic form); the PAD's §3 line corrected. (b) The PAD §11 five line counts refreshed (1922 / 1562 / 948 / 420 / 589). (c) `README:287` "3 attempts" → "5 attempts". (d) `reset-password.spec.ts:15`'s "six auth calls" → "seven" (the invalid-token submit's reset POST named in the enumeration). (e) `PAD:2318`'s "bash + curl + jq" → "bash + curl + python3". (f) The stale test TITLES re-anchored onto their live assertion values (server-lows-s81's three titles → 63/262; doc-lows-s84's describe title → 1047/143/262).

### S86-D — the session log + the worklog + the docs counts

`docs/session_131.md` (2×86 − 41 = 131), the repo worklog entry, the parent workspace worklog entry, the digma_SKILL v1.64.0 bump with lesson F73, the PAD v1.65.0 revision block, and every count site updated to the delivered reality (the unit/e2e totals grow by the new spec files' pins; the row-sum pin enforces the §7.1 rows in the same commit).

## The gate plan

The full gate re-run after the remediation: lint → typecheck → unit (the new total) → build → smoke 63 → e2e (the new total). The DB re-seeded to the pristine contract after every mutating phase; the mobile-nav contract re-verified on the final build (the single-call verifier `verify-nav-s86.sh`); the screenshot capture re-run with the standard set + the S86 inline checks (the ordering witness, the AI clamp witness); the dimension checker's mapping extended.

## Execution status

- [x] Baseline gate re-proven green (1047 / 143 files / 63 / 262) — the F59 corollary HOLDS (third consecutive)
- [x] 62nd reference audit — NO DRIFT on any standing datum
- [x] 63rd mobile-nav verification — 9/9 GREEN (the session-85 build at HEAD a003732)
- [x] The 34th Mode C audit — 0 Critical / 0 High / 0 Medium / 6 Low / 5 Informational; every chosen finding lead-verified
- [x] S86-A — EXECUTED: the flightDone completion handle on the in-flight descriptor (created beside the assignment before setSaving, resolved in the flush's single finally) + the cleanup's chained PUT₂ (`machineFlight.then(() => fetch(...))`) + the registry's done carrying the WHOLE sequence; unit source pins green (deterministically RED pre-fix); the session85-fixes re-entry discriminators re-run green on the final build (the survival proof — no deterministic e2e discriminator exists for a network ordering race, which is exactly why the window survived 15 sessions)
- [x] S86-B — EXECUTED: `clampText(x, 2000)` at both AI apply sites (the add path's partial.text + the update path's patch.text) + `clampSizeField` on both scaleElements products; the behavioral boundary pins + source pins green; the capture's clone-42/clone-43 live witnesses
- [x] S86-C — EXECUTED: the .env.example "six spec files" + the reality-derived reader pin; the PAD §11 SEVEN rows refreshed (the live pin caught auth.spec.ts beyond the audit's five) + the live line-count pin; the README "5 attempts"; the reset-password spec's seven-calls comment (the invalid-token submit named); the PAD smoke row's python3; the stale test TITLES re-anchored
- [x] S86-D — EXECUTED: session_131.md + the worklog + digma_SKILL v1.64.0 (lesson F73) + the PAD v1.65.0 revision block + the counts (1047→1076 / 143→145) across every live claim site + the AGENTS session-86 seam bullet
- [x] The full gate + the live verification + the capture: lint · typecheck · 1076 unit / 145 files · build · 63 smoke · 262 e2e — ALL GREEN; the capture with clone-42/clone-43; the DB pristine after every mutating phase
- [x] The docs alignment + the commit + the SSH-wrapper push

## Execution notes (en-route discoveries)

1. **The live §11 pin caught a SIXTH stale row beyond the audit** — `tests/e2e/auth.spec.ts` (claimed 343, actual 361: the S84-A XFF carve-out additions had grown it) — the row-sum doctrine's forcing function demonstrated on delivery (a live-derived pin earns its keep in its first run, the second consecutive session a new pin did exactly that).
2. **The standing-pin re-anchoring set was SIX** — client-lows-s70's scaleElements floor (onto the clampSizeField helper form), client-lows-s80's slice window (1400 → 2600, the S86-B comment block's length), exit-flush-s71's descriptor + chained-PUT forms, soft-leave-flush's machineFlight form, doc-lows-s85's env-header pin (onto the six-readers reality). Every re-anchor documents its intent in the pin — the F68/F70 discipline.
3. **The mobile-nav verifier's first run hit a transient eval hiccup** (check 1 returned an empty string — the login had not settled when the Dashboard opened); the manual re-probe and the full re-run both GREEN 9/9 — the honest transient, documented in session_131.
4. **The scale-ceiling live witness is drivable through the fallback** — "add a rectangle" (deterministic geometry) + the layer-row selection + the panel's W field (60000) + three "make it bigger" commands (×1.25 each) land the product exactly at the 117187.5 unbounded value, so the clamped 100000 reads back as a W-field value — the ×20 LLM path is not needed for the live proof.
