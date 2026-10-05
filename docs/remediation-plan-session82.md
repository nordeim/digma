# Remediation Plan — Session 82 (the Thirtieth Audit)

**Date:** 2026-10-05 · **Trigger:** the operator's session-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the `.env` database contract with `db/` at the repo root, the vitest/playwright suites, the TDD remediation, the screenshots, the aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's re-verification of the session-81 delivery (all four S81 seams verified intact in source at baseline — the `gestureSnapshot === null` guard at ai-assistant.tsx:250, the `saveState === "unsaved"` disjunct at editor-view.tsx:364, the `isMountRun` capture at editor-view.tsx:1278 with the `!isMountRun` gate at :1388, and the smoke boot knob at smoke-test.sh:56), then the THIRTIETH Mode C audit: two independent fresh-eyes full-file reviews by separate agents — auditor A over the editor core + client view layer (editor-view.tsx ×1844, editor-store.ts ×483, canvas/toolbar/layers/components/properties/ai-assistant, the app-header + view components, the vendored ui primitives, use-toast, lib/call + lib/validation client seams), auditor B over the server + lib/config/infra side (all 18 route files, all libs, prisma schema + seed, every root config, the smoke/check-db-contract/get-seed-ids scripts, the e2e infra, `.env.example`) — against the `skills/code-review-checklist` dimensions with the AGENTS/CLAUDE documented contracts loaded first (the Mode C dimension set of docs/coding_agent_prompt.md §12). Every chosen finding individually re-verified by the lead in source before this plan. The baseline gate re-proven BEFORE any change (lint · typecheck · 943 unit / 133 files · build · 61 smoke · 259 e2e — **all green, zero regressions; the prior session's claimed gate results HELD**, the F59 corollary satisfied), the DB re-seeded to the pristine 1/2/6/1/3 contract after the smoke phase, the parent-shell `DATABASE_URL` trap neutralized (the `unset` discipline in every db-touching command).

## Reference findings (58th audit — no drift on the standing datums)

The standing datums re-verified on `https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 + mobile 390×844, the real CDP login with the operator's credentials, evidence `docs/screenshots/ref-audit-s92/`): the desktop nav 124/96/92 × 36; the greeting with the populated name + sparkle (the time bucket follows the wall clock); Quick Stats 1 Projects / 0 Teams / Pro Plan; the Recent sort `last_accessed` / "1 file found"; zero kbd affordances (the JSON-wrapped re-probe — the agent-browser plain-number eval quirk, F63's corollary, hit a THIRD time this session: both `{}` re-outputs needed the JSON-wrapped re-probe); the Create-Team dead chrome (click → 0 dialogs, re-probed the same way); R3 mobile nav failure class A the 58th (nav `display:none`, links 0×0, no hamburger — the dashboard AND the editor page); the mobile editor header clipping Share/Present at 390 re-measured exactly (Share L385–R458, Present L466–R551 — byte-identical to the session-63…81 measurement, the 19th consecutive session); the board's project text-verified. **NO DRIFT — no parity work required this cycle.**

The clone's mobile navigation verified live end-to-end at 390×844 — the **59th consecutive session**, ALL GREEN via the single-call verifier `scripts/verify-nav-s82.sh` (9/9: the 44×44 hamburger with the aria contract at [16,10], the Sheet's 44px links + aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape with focus return + lock release, navigate-and-dismiss, the md-crossing close, the 768 boundary, and the class-A guard — the Tailwind v4 failure class A NOT present; the `skills/nextjs16-tailwind4` §9 symmetrical-breakpoint pattern the skill family documents is the form the clone's `MobileNav` implements). Verified on the S81 build at HEAD `9ede741`.

## The code audit findings (Mode C — thirtieth pass)

**0 Critical / 1 High (documented posture) / 3 Medium / 6 Low / 10 Informational** combined (auditor A: 0/0/1/2/4; auditor B: 1/2/4/6 — B82-H1's own evidence marks it a documented posture; the lead's own doc-review findings — the stale-count family's survivors — folded into the B-side Low set) — every chosen finding individually re-verified by the lead in source:

- **A82-M1 (Medium — THE HEADLINE): the shortcuts stand-down guard misses the open Radix Select — letter keys over an open Font Family/Background Size listbox switch tools, and Delete deletes the selection behind the list.** `src/components/editor/editor-view.tsx:553` — the guard stands down behind `[role="dialog"][data-state="open"], [role="menu"][data-state="open"]` (the S57-C/S56-D family), but the Radix Select renders its open content as `role="listbox"` with `data-state="open"` and its trigger as `role="combobox"` — neither matches. Verified against the vendored `@radix-ui/react-select` dist source: the module carries ZERO `stopPropagation` calls and plain letter keys get typeahead handling WITHOUT `preventDefault` — every keydown over an open Select propagates to the editor's window listener, and `isTypingTarget` returns false (focus sits on the trigger button or an option div). With the Font Family list open, pressing I/R/A/H/T/V (6 of the 7 families) also arms the Image/Rectangle/Frame/Hand/Text/Select tool behind the list; **Delete/Backspace deletes the current canvas selection behind the list** — the exact S57-C defect class for the one remaining portal family.
- **A82-L1 (Low): the drain can never resolve after the 401 terminal — both boundary drains burn the full 5s deadline on any later swap.** `editor-view.tsx:364` — the S81-B widened predicate `flushing || pending || saveState === "unsaved"` assumed unsaved state is always transient; the S68-D 401 terminal breaks that assumption: on 401 the machine calls `markSessionDead()` and `setUnsaved()`, then every subsequent flush early-returns on `if (sessionDead) return` — `saveState` remains `"unsaved"` forever with nothing coming to drain it, `machineBusy()` is permanently true, and each awaited drain polls the full 5 seconds before its deadline timeout. Bounded latency on a rare path (terminal session + same-instance swap), but a genuine gap at the S81-B/S68-D seam.
- **B82-M3 (Medium): `check-db-contract.ts`'s foreign-export refusal prints the RAW (potentially credentialed) `DATABASE_URL`.** `scripts/check-db-contract.ts:36-43` — the refusal interpolates `liveDatabaseUrl.slice(0, 60)` and `ownDatabaseUrl` into `console.error` WITHOUT `redactDatabaseUrl()` while the script's own resolved-URL line at :53 routes through the seam precisely because "a Postgres-backed checkout never prints its credentialed connection string" — the missed sibling of the S64-F/S78-G/S79-C redaction family (get-seed-ids was fixed for exactly this class).
- **B82-L4 (Low): the register route has no user-count ceiling — the only unbounded creation surface.** Every authenticated creation surface carries a ceiling (500/100/100/2000, TOCTOU-safe in transactions); the PUBLIC register route has none. Each accepted request also burns one scrypt hash. The only bound is the auth rate limiter — per-IP on a spoofable XFF at the default trust depth.
- **B82-L5 (Low): no runtime gate probes the 32 MB body cap.** The bounded-input doctrine's flagship control is covered only by the unit seam (`tests/request-surface-s75.test.ts`). Neither the 61-check smoke gate nor any e2e spec sends an over-cap body to the live server — a regression in the seam's wiring would fail only source-regex pins. The S80-D form (runtime checks against the live standalone server) is the documented precedent: the header trio got exactly such checks after being source-pinned only.
- **B82-L-family (the lead's doc-review findings — the stale-count family, the S81-E batch's survivors):** `AGENTS.md:15` ("924 checks" vs the :22 gate-order's 943), `CLAUDE.md:92` ("924 checks" vs :106's 943), `PAD:2335` ("58 HTTP checks" vs §7.1's 61), `PAD:2441` ("35 HTTP checks"), `digma_SKILL.md:242-245` (§11's "72/72", "20 routes", "28/28", "54/54" — ancient counts), `digma_SKILL.md:64/:100` (the `noImplicitAny: false` claims — S79-C removed the flag; the S80-E batch corrected AGENTS/CLAUDE/PAD and left digma_SKILL behind), `digma_SKILL.md:156` ("346 lines" vs the real 483), `digma_SKILL.md:193` ("fontSize ceiling 32" vs the real 1–200 clamp at ai-assistant.ts:325), `README.md:133/:156/:184` ("16 API route handlers" vs the real 18; "5 page routes" while listing six, with `/reset-password` the seventh folder). The F68 count-drift family's recurrence: the S81-E batch corrected the sites one doc review surfaced and grep proved incomplete again.

## The deferred queue decisions (the lead's judgment on the open questions)

1. **B82-H1 (the in-band reset-token delivery default) — POSTURE ROW, unchanged.** The auditor rates the impact High (unauthenticated takeover of any known email on a knob-unset public deploy) and the finding is real — but the posture is triple-documented (ADR-0014 / S64-D / DEPLOYMENT.md §2 "Yes for public deploys") with the mitigation knob shipping since session 64. The candidate fixes all break the documented deployment model: a `NODE_ENV=production` gate breaks the local self-hosted production story (the PRIMARY documented deployment — the smoke suite itself boots standalone in production with the in-band round-trip as a checked behavior); an explicit opt-in knob grows the env surface the `.env.example` coverage contract pins at seven reads. The single-tenant self-hosted model (B82-M2, ADR-003) already presumes the operator reads DEPLOYMENT.md §2 before any public exposure; the reset knob rides the same documented gate. Documented with the auditor's reasoning in PAD §10 — the posture row is STRENGTHENED, not silently dropped.
2. **B82-M2 (no object-level authorization) — documented ADR-003 single-tenant posture, unchanged** (the reference app's own model; PAD §4.1 row).
3. **A82-L2 (the vendored Select primitive hardcodes editor dark chrome) — POSTURE ROW.** All current consumers are the dark properties panel; the token migration is a style refactor with no forcing function — the F35e drift-hazard class documented, the migration queued.
4. **B82-L6 (plaintext reset tokens/OTP in the User row) — POSTURE ROW** (consistent with the in-band delivery posture B82-H1; token-at-rest hashing is the standard complement when the delivery model changes).
5. **A82-I1 (the same-project skip's synchronous setLoading) — POSTURE ROW** (idempotent flip, no cascade; the comment-fix form is cosmetic).
6. **A82-I2 (exit()-during-in-flight-with-newer-edit can issue up to three PUTs) — POSTURE ROW** (converges; the documented safety-net rationale; the 3-PUT arithmetic noted).
7. **A82-I3 (the loading gate arms after the boundary drain — a stale-canvas flash window ≤5s on swaps) — POSTURE ROW** (cosmetic, bounded, data integrity unaffected — the S57-B swap guards drop late responses).
8. **A82-I4 (the tool rail's 32px buttons sit below the 44px floor on the phone band) — PARITY POSTURE** (the reference-measured geometry, the documented zoom-cluster family; the S78-F floor extension awaits a forcing function).
9. **B82-I7 (the LLM server-side timeout) — the queue note UPGRADED** (the SDK evidence is now conclusive: the installed z-ai-web-dev-sdk@0.0.18 has no AbortController/signal/timeout anywhere — the "unverified" note becomes "verified absent"; the Promise.race wrapper is the documented design when a forcing function appears). KEPT QUEUED.
10. **B82-I8/I9/I10/I11 (resend-otp asymmetry, verify-otp double-submit residue, duplicate member rows, the auth user-update trio's P2025) — documented posture rows, all verified still current.**
11. **B82-I12 (`.env.example` lacks the test-infra reads E2E_PORT/E2E_BASE_URL) — FOLDED INTO S82-E** (a commented test-infra block; the app-read coverage stays at seven, all covered).
12. **The standing deferred queue carries forward unchanged** (the fillImageThumb codec-or-protocol trade atop it, the VLM s80/s81 verification runs awaiting the quota window, the session-81 posture rows).

## The chosen session work (TDD)

### S82-A — the stand-down guard reaches the open Radix Select (A82-M1, the headline)

One widened selector at `editor-view.tsx:553` — the guard stands down behind the open listbox/combobox family:

```ts
document.querySelector(
  '[role="dialog"][data-state="open"], [role="menu"][data-state="open"], ' +
  '[role="listbox"][data-state="open"], [role="combobox"][aria-expanded="true"]',
)
```

The S57-C one-line form, extended to the one portal family it never reached. The vendored Radix Select's open content carries `role="listbox"` + `data-state="open"`; the trigger carries `role="combobox"` + `aria-expanded="true"` (both selectors are the belt — either alone covers the open state). With the guard standing down, letter keys typeahead-navigate the list ONLY (the Radix behavior), Delete no longer deletes the invisible selection, `?` no longer stacks the shortcuts dialog over the listbox, and Escape double-actioning is prevented (Radix closes the list; the global handler stands down). No other `listbox` exists in the app (the Recent sort is a native `<select>` — the OS-level dropdown carries no DOM role).

Pins: the source pin (the guard line carries the listbox + combobox selectors); the E2E discriminator — open the seeded editor, select the Headline text element (the Font Family row renders), open the Font Family combobox, wait for the listbox, press "r", assert the Rectangle tool's `aria-pressed` stays `"false"` and the Select tool stays active (pre-fix: the tool switches behind the list). The Delete-behind-the-list half rides the same guard (one assertion family, one mechanism).

### S82-B — the drain exempts the 401 terminal (A82-L1)

One widened predicate at `editor-view.tsx:364`:

```ts
const machineBusy = () =>
  !sessionDead && (flushing || pending || useEditorStore.getState().saveState === "unsaved");
```

A dead session's `saveState` is honestly "unsaved" forever (the S68-D terminal contract — the work is NOT saved and CANNOT be until the user signs in again); nothing will ever drain it; the machine is honest-idle. The exemption keeps the badge honest (the terminal contract is about flushes, not the drain) and returns the boundary drains to their sub-100ms common case on the dead-session path. `sessionDead` lives in the same effect closure the drain reads — the form the F67 composing-handle pattern sanctions.

Pins: the source pin (the predicate line carries the `!sessionDead` prefix).

### S82-C — the server pair: the redaction fold + the register user ceiling (B82-M3 + B82-L4)

1. **The redaction fold:** `check-db-contract.ts`'s refusal path routes both interpolations through `redactDatabaseUrl()` (already imported for the :53 line) — the S64-F/S78-G/S79-C family's missed sibling. A credentialed foreign export (e.g. `postgresql://user:pa55w0rd@host/db`) prints its redacted form; the refusal message keeps its full diagnostic shape.
2. **The register user ceiling:** `USER_LIMIT = 500` joins the `PROJECT_LIMIT`/`TEAM_LIMIT`/`MEMBER_LIMIT` family in `validation.ts` (the self-hosted spirit — 500 accounts is far past any documented single-tenant deployment); the register route's create moves into the family's TOCTOU-safe form (a count-guarded `$transaction`, the P2002 catch unchanged around it, the over-cap answer `fail("VALIDATION", "Too many users (max 500)", 400)` — the projects route's exact envelope shape). The public unbounded surface closes; the scrypt-DoS amortization rides the same bound.

Pins: the source pins (the refusal interpolations wrapped; the USER_LIMIT constant + the register transaction form + the over-cap envelope).

### S82-D — the smoke gate probes the body cap at RUNTIME (B82-L5)

Two new smoke checks (the S80-D runtime form — the source pins could never see a Next/undici stream regression):

1. **The content-length fast path:** a 33 MB `--data-binary @file` POST to `/api/auth/login` (a dedicated XFF identity — the auth rate limiter runs before the body parse) answers the 400 `VALIDATION` / "Request body too large (max 32 MB)" envelope.
2. **The chunked stream counter:** the same 33 MB body piped through stdin (`cat file | curl --data-binary @-` — curl switches to `Transfer-Encoding: chunked` on an unknown-size pipe) answers the SAME 400 envelope — the S75-B stream-counter family's only runtime witness.

Smoke: **61 → 63**. The header comment documents the probes + the dd contract (33 MB of /dev/zero in /tmp).

Pins: the source pin (the smoke script carries both probe forms + their assertions); the probes themselves GREEN-immediately by design (the cap already answers 400 — the checks are the drift mechanism, not a defect fix; the runtime-header family's own documented posture).

### S82-E — the docs honesty batch (B82-L-family + B82-I12)

The stale sites corrected to the delivery counts (written at DELIVERY time, after the realized unit/e2e/smoke totals are known — the F68 planned-count trap): `AGENTS.md:15` (943 → the realized count), `CLAUDE.md:92` (the same), `PAD:2335/:2441` (the smoke count at the realized 63), `digma_SKILL.md:242-245` (§11's pre-ship checklist onto the realized counts), `digma_SKILL.md:64/:100` (the `noImplicitAny: false` claims removed — the tsconfig is genuinely strict since S79-C), `digma_SKILL.md:156` ("346 lines" → 483), `digma_SKILL.md:193` ("fontSize ceiling 32" → the real 1–200 clamp), `README.md:133/:156/:184` ("16 API route handlers" → 18; "5 page routes" → the honest seven-folder list with `/reset-password`). `.env.example` gains the commented test-infra block (E2E_PORT / E2E_BASE_URL — the B82-I12 fold; the app-read coverage stays seven, all covered). The family grep re-runs across every doctrine file for every stale number (the F68 discipline: the batch must grep the whole family, not the sites one review surfaced).

### S82-F — the session log + the worklog

The session-82 worklog entry at delivery; `docs/session_123.md` (the structured log, the 2× audit-session − 41 mapping) + the operator-transcript pairing convention documented in session_121/122.

## Planned counts

Unit: +~12 pins across two new spec files (`client-lows-s82` — the stand-down selector pins + the drain predicate pin, ~5; `server-lows-s82` — the redaction pins + the USER_LIMIT pins + the smoke-probe pins + the doc-honesty pins, ~7) → **~955**. E2E: +1 (the open-Select tool-switch discriminator in `tests/e2e/session82-fixes.spec.ts`) → **~260**. Smoke: **63** (+2 — the body-cap runtime probes).

## RED expectations

Unit RED: the stand-down selector pin (the listbox/combobox selectors absent pre-fix); the drain predicate pin (the `!sessionDead` prefix absent pre-fix); the redaction pins (the raw interpolations present pre-fix); the USER_LIMIT pins (the constant + the transaction form + the envelope absent pre-fix); the smoke-probe source pin (the probes absent pre-fix); the doc-honesty pins (the stale claims present pre-fix). E2E RED: the open-Select tool-switch discriminator (pre-fix: the Rectangle tool's aria-pressed flips to true behind the open listbox — verified against the REBUILT pre-fix standalone, the F68 build discipline). Smoke GREEN-immediately: the two body-cap probes (the cap already answers 400 — the runtime drift mechanism, documented as such).

## Execution order

S82-A → S82-B → S82-C → S82-D → unit GREEN → lint → typecheck → build → smoke (63) → the full e2e suite (~260) → full gate → live verification + screenshots (the capture script + the dimension checker + the VLM probe) → `.env.example` verification → docs (S82-E + S82-F) → commit + push.

## Execution status

- [x] S82-A — the stand-down guard reaches the open Radix Select (the e2e RED proven against the REBUILT pre-fix standalone — the F68 build discipline; the en-route lesson: mid-open assertions need CSS locators, the open listbox marks the app root aria-hidden and blinds role locators)
- [x] S82-B — the drain exempts the 401 terminal
- [x] S82-C — the redaction fold + the register user ceiling (the route joins the s79 transaction-abort family pin's route list — the F61 enumeration discipline; the P2024/P2028 arms ride the transactional re-shape)
- [x] S82-D — the smoke body-cap runtime probes (the en-route discovery: a stdin pipe does NOT force chunked — curl 8.x buffers it and declares content-length; the explicit `Transfer-Encoding: chunked` header is the honest form, verified against a raw socket listener printing the wire headers)
- [x] S82-E — the docs honesty batch (the realized batch: AGENTS ×3, CLAUDE ×5, README ×7 incl. the route-count honesty, PAD §7.1/§7.4/§9.2/§11 ×7, digma_SKILL frontmatter + §2 + §11 + the three stale claims + the .env.example test-infra block)
- [x] S82-F — the session log (docs/session_123.md) + the worklog entry
- [x] Full gate green — zero regressions (lint · typecheck · 961 unit = 943 + 18 / 135 files · build · 63 smoke = 61 + 2 · 260 e2e = 259 + 1 — the full e2e re-run on the final code; the RED → GREEN transitions honest: 13 unit defect pins deterministically RED pre-fix; 5 GREEN-by-design survival pins; THREE standing pins legitimately re-anchored — the s81 machineBusy anchor, the s64 register-create form, the s79 TX_ROUTES family list — all intents unchanged, all documented in the pins themselves)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the final S82 build — the 59th consecutive session; the standard 32 re-captured + the ref-audit-s92 evidence set + the standing checks re-verified live + THREE NEW inline checks — the open-Select stand-down guard, the refusal redaction, the body-cap pair; dimensions 407/407; the DB re-seeded pristine after every mutating phase; the VLM window still exhausted — 429, the fourth consecutive session, the run the documented follow-up)

## Execution notes (the realized counts + the en-route work)

Unit: +18 checks across two new spec files (client-lows-s82 7, server-lows-s82 11) → **961 = 943 + 18 / 135 files**. E2e: +1 (the session82-fixes spec — the open-Select tool-switch discriminator) → **260**. Smoke: +2 (the body-cap runtime probes) → **63**. The s81 mount spec's racy `toBeHidden` locator re-anchored mid-session (the F66 order-independent discipline): the original assertion matched the DASHBOARD's project-card h3 — an element that eventually ALWAYS renders — passing only when the poll beat hydration; it failed intermittently in the full-suite runs (the A/B against the pre-fix build proved it flaky, not a regression — the failure reproduced on a build WITHOUT the S82 source changes on a re-run), and the deterministic re-anchor asserts the editor's `[data-element-id]` nodes count 0 on the Dashboard (an element never present on the target page).

**The F69 en-route lessons:** (1) the portal-role taxonomy (a stand-down guard keyed on ARIA roles must enumerate every overlay library's role shapes — Radix renders three: dialog, menu, listbox+combobox); (2) the honest-idle terminal state (a busy predicate keying on a state with a terminal variant must exempt the terminal); (3) the curl stdin-buffering trap (a piped body does NOT force chunked — the explicit header is the honest form, verified against a raw socket listener); (4) the racy toBeHidden on eventually-rendering elements (assert an element never present on the target page, or the positive landing surface — and check what a locator matches on BOTH pages before using it as a transition assertion); (5) the Radix aria-hidden blinding in the e2e form (mid-open assertions need CSS locators).
