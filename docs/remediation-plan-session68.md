# Remediation Plan — Session 68 (the Sixteenth Audit)

**Date:** 2026-10-04 · **Trigger:** the operator's session-93/94-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the `.env` database contract with `db/` at the repo root, the vitest/playwright suites, the TDD remediation, the screenshots, the aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's hunk-by-hunk review of the session-67 delivery (all four
S67 seams verified intact in source at baseline: the tokenVersion
4-part token + the database-seam version comparison + the reset's
increment eviction at `auth.ts:68-92/:137/:144` and
`reset-password/route.ts:78`; the pure `bodySizeRejected` 32 MB cap
BEFORE the parse at both element routes
(`elements/route.ts:70/:150`); the PROJECT/TEAM/MEMBER creation
ceilings at the four routes; the dedicated `ai:` limiter bucket +
the `DIGMA_DISABLE_IN_APP_OTP` knob at the three delivery sites; the
Dashboard's list-container gating + the ONE shared `load()` seam),
then the SIXTEENTH Mode C audit: two independent fresh-eyes full-file
reviews by separate agents over the least-recently-reviewed surfaces —
auditor A over the editor core (editor-view, editor-store, canvas,
properties-panel, toolbar, layers-panel, components-panel, the AI
panel, lib/editor, lib/ai-assistant, lib/call, lib/export-png — last
independently reviewed session 66), auditor B over the server +
lib/config/infra side (all 18 API route files, the 13 pure lib seams,
proxy.ts, the prisma schema + seed, the test infra, the 6 configs, both
auth screens — carrying the documented deferred backlog for
verification and sharpening) — against the
`skills/code-review-checklist` dimensions with the AGENTS/CLAUDE
documented contracts loaded first. Every chosen finding individually
re-verified by the lead in source before this plan. The baseline gate
re-proven green BEFORE any change (lint · typecheck · 488 unit /
89 files · build 23 routes · 58 smoke · 227 e2e — zero drift from
session 67), the DB re-seeded to the pristine 1/2/6/1/3 contract, the
parent-shell `DATABASE_URL` trap neutralized (the `unset` discipline
in every db-touching command).

## Reference findings (44th audit — no drift, no new gaps)

The standing datums re-verified on
`https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 +
mobile 390×844, the real CDP fill login): the desktop nav 124/96/92 × 36;
the greeting "Good evening, sepnetflix2023 ✨" (the name populated, the
evening bucket — the time-appropriate form); Quick Stats 1 Projects / 0
Teams / Pro Plan; the Recent sort `last_accessed` / "1 file found"; zero
kbd affordances; the Create-Team dead chrome the 44th ("Create Team" +
"Create Your First Team", 2 clicks, 0 dialogs); R3 mobile nav failure
class A the 44th (nav `display:none`, links 0×0, no hamburger — the
dashboard AND the editor page; evidence `ref-audit-s78/ref-01` and
`ref-02`); the mobile editor header clipping Share/Present at 390
re-measured exactly (Share L385–R458, Present L466–R551 — byte-identical
to the session-63/64/65/66/67 measurement; evidence `ref-audit-s78/ref-02`);
the board at 9 layers ("9 layers" + "Test Project One", opened through the
project-card ANCHOR after the generic card probe missed — the same
first-attempt miss family as sessions 62–67). Evidence set:
`docs/screenshots/ref-audit-s78/` (ref-00 desktop dashboard, ref-01
mobile dashboard 390, ref-02 mobile editor 390, ref-03 desktop Recent
grid, ref-04 desktop editor).

The clone's mobile navigation verified live, end-to-end at 390×844 —
the 45th consecutive session, ALL GREEN via the single-call verifier
`scripts/verify-nav-s68.sh` (9/9: the 44×44 hamburger with the aria
contract at [16,10], the Sheet dialog with 44px links +
aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape
with focus return + lock release, navigate-and-dismiss, the md-crossing
close, the 768 boundary, and the class-A guard — the Tailwind v4
failure class A NOT present).

## The code audit findings (Mode C — sixteenth pass)

The session-67 delivery itself is clean (all four seams verified to
hold; the 488/58/227 gate re-proven green at baseline before any
change; auditor B: "No. All five delivered seams hold exactly as
documented" — the only side effect is the deliberate one-time eviction
of all pre-S67 cookies on deploy). The two fresh-eyes passes found
**0 Critical / 0 High / 2 Medium / 6 Low / 14 Informational**
combined — every chosen finding individually re-verified by the lead
in source:

- **M-A (Medium — NEW, auditor B: the M-4 family is only half-closed):
  `bodySizeRejected` guards 2 of 14 `request.json()` parse sites.**
  The guard exists only at the two element routes
  (`elements/route.ts:70/:150`). Twelve other routes still buffer an
  unbounded body into memory before their per-field caps reject —
  **six of them unauthenticated**: `login/route.ts:18`,
  `register/route.ts:18`, `verify-otp/route.ts:28`,
  `resend-otp/route.ts:24`, `forgot-password/route.ts:28`,
  `reset-password/route.ts:30`; plus six authenticated:
  `projects/route.ts:33`, `projects/[id]/route.ts:34`,
  `teams/route.ts:26`, `teams/[id]/route.ts:20`,
  `teams/[id]/members/route.ts:20`, `ai-assistant/route.ts:34`. The
  S67-B rationale ("App Router handlers ship no default body-size
  cap; the guard bounds the parse itself") applies identically at
  every site: a credential-less attacker pushes a multi-GB body to
  `/api/auth/login` and Node buffers it before the 200-char cap
  answers 400.
- **M-1 (Medium — auditor A: drift from the documented S64-C
  contract): the marquee containment is not rotation-aware.**
  `canvas.tsx:313-325` tests the unrotated footprint
  (`el.x >= drag.x && el.x + el.width * s <= …`) while AGENTS.md
  documents "the selection outline, resize handles, and **marquee**
  now run on the VISUAL footprint". The outline/handles consume the
  rotation-aware `boundsOf` (`canvas.tsx:93`), so for a rotated
  element the marquee disagrees with the outline exactly where S64-C
  claims they agree.
- **L-A (Low — NEW, auditor B): `sanitizeLlmOperations` accepts an
  unbounded LLM-chosen `ids` array.** `src/lib/ai-assistant.ts:287-291`
  — `rawIds.filter(typeof string)` with no length cap (the route caps
  the client's own `targetIds` at 100 at `ai-assistant/route.ts:37`,
  but the model's reply is uncapped). A hallucinating model returning
  a huge ids array drives O(ids × elements) membership filters at the
  client seam.
- **L-2 (Low — auditor A): the autosave machine has no terminal state
  for auth failures — infinite silent retry on an expired session.**
  `editor-view.tsx:177-186` — every `!response.ok` resets to "unsaved"
  and re-arms, so a 401 (cookie expired mid-session) loops the PUT at
  ~1 req/s forever, toasting only once with the generic
  "Autosave failed".
- **L-3 (Low — auditor A + the documented 9d): two `as never`-family
  casts punch through the store's typing at the AI apply boundary.**
  `ai-assistant.tsx:132` (`store.updateElements(targets, patch as
  never)`) and `src/lib/ai-assistant.ts:308` (the conditional type
  resolves to `never` — the "inert sanitizer cast" the session-67 plan
  deferred; a `Record<string, unknown>` flows into the operations
  array with zero checking).
- **L-4 (Low — auditor A): dead exports + a stale doc claim in
  `src/lib/editor.ts`.** `fitToBounds` (`:451-466`) has zero production
  consumers and its comment claims "used by thumbnails + zoom-to-fit"
  (thumbnails consume `thumbnailFit` since S65-A); `normalizeRect`
  (`:308-320`) is consumer-less with no TEST-ONLY status note. Both
  carry unit pins (`editor.test.ts`, `bounds-rotation.test.ts`) — the
  honest fix is the session-63 `elementToStyle` precedent: the
  TEST-ONLY doc status, NOT deletion.
- **L-5 (Low — the documented backlog #6, verified): the dead
  `@radix-ui/react-toast` dependency.** Zero imports confirmed (the
  toast system is the custom globalThis store
  `src/hooks/use-toast.ts`); it rides in `package.json:35` and
  `scripts/install_packages.sh:1`.
- **L-6 (Low — the documented backlog #8, verified): the playwright
  `reuseExistingServer` leftover-server hazard.**
  `playwright.config.ts:63` — a leftover :3100 standalone server is
  silently reused; specs run against whatever stale build/code it
  carries, and its in-memory rate-limit buckets survive the DB re-seed
  (a prior run's exhausted `ai:`/`auth:` bucket fails later runs
  nondeterministically).

### The deferred batch (documented, verified, not chosen this session)

The XFF-trust topology knob (backlog #1 — `clientIpOf` trusts
`x-forwarded-for` + `x-real-ip` verbatim; a direct-exposure deploy is
fully bypassable by per-request header rotation, and an XFF-stripping
proxy self-DoSes everyone into one bucket; practical impact low while
the OTP rides the response — becomes real the day both ADR-014 knobs
are set), the list-payload projection (#2 — the list routes ship full
element rows incl. data-URLs; the card thumbnails consume them, so the
fix needs a bounded thumbnail payload — real only at self-hosted
scale), the elements row-builder dedup (#3 — three builders, three
default conventions: POST synthesizes fill/stroke, PUT nulls omitted,
the client is type-aware), the dead schema columns (#4 —
`thumbnailSeed` never read/written, `src`/`path` written never read,
`zIndex` written never read — rides the #3 schema push), the
ProjectCard role="button" nesting restructure (#5), the lint gate's
disabled rule classes (#7 — 27 rules off in 4 classes; re-enable
cheapest-first), the ADR-014 enumeration-tradeoff sentence, and the
informational batch (the TOCTOU count-then-create soft ceiling, the
verify-otp stale attempts read, the duplicated hashPassword seam, the
`AiOperation.update.patch` dead x/y type surface, the exit()
double-PUT redundancy, the canvas useState drag-state ordering
assumption, the line-width clamp asymmetry, the `SliderRow` NaN%
degenerate guard, the `call.ts` comment's overclaim, the
prompt-injection surface note, the deploy doc's one-time-cookie-eviction
note).

### Verified clean (explicitly re-checked)

The MobileNav contract in full (9/9 via the verifier, the 45th
consecutive session); the session-67 spec files are REAL (auditor B
re-derived the pins: `revocation-s67` 9, `request-surface-s67` 12,
`ai-limit-otp-s67` 11 checks matching the shipped source); the auth
crypto end-to-end (scrypt + `timingSafeEqual` with length guards,
HMAC, httpOnly/lax/secure cookies, no `tokenVersion` leak in any
response body); the fail-closed `redactDatabaseUrl` three-stage parse;
the OTP ceiling's atomic conditional `updateMany`; the no-enumeration
200; register's P2002 race catch; the elements PUT transaction with
the P2025/P2003 envelope catch; `safeFromUrl` at both client consumes;
the exact-match proxy 307s; the toast globalThis store; both auth
screens' five-state contracts; seed idempotency; the entire gesture
seam family (S56–S66) re-verified intact by auditor A (the
flush-foreign-first arm sites, the foreign-ride guard, the ownership
verification, the retired focus-begins, the surface-parameter tick);
the pointer wall family (S23/S25/S27); the autosave machine's
serialized flush chain; memoization + the boolean undo selectors; zero
XSS/injection sinks (React escaping, `escapeXml` at every SVG seam,
the `fillImage` whitelist on both sides); the `skills/` exclusion
(zero imports repo-wide — lint/tsconfig/vitest/playwright all exclude
it); the smoke/e2e re-pinning arithmetic re-derived coherent.

## The chosen session work (TDD)

### S68-A — the parse-guard family completion (M-A)

The session-67's own chosen work, finished:

1. **The guard at every parse site:** the 3-line
   `bodySizeRejected(request.headers.get("content-length"))` check
   BEFORE `request.json()` at all twelve remaining routes, each
   answering `fail("VALIDATION", "Request body too large (max 32 MB)",
   400)` — the elements routes keep their own pinned
   "Elements payload too large" message; the generic message reads
   honestly on every other surface. The ordering discipline: the guard
   sits AFTER the rate-limit/session gates where they exist (no parse
   work burns a rate-limit slot) and BEFORE the parse.
2. **Unit pins (`tests/request-surface-s68.test.ts`):** one behavioral
   family (the pure seam re-probed) + a source-contract pin per site
   asserting the guard's presence, the BEFORE-parse ordering (the
   `indexOf` discipline from `request-surface-s67.test.ts`), and the
   VALIDATION envelope form — plus the preservation pins (the two
   element routes' S67-B forms unchanged, the six unauthenticated
   sites' ordering AFTER the rate-limit gate).

### S68-B — the rotation-aware marquee (M-1)

The documented S64-C contract reaching the surface it missed:

1. **The containment on the visual footprint:** the marquee filter
   (`canvas.tsx:313-325`) consumes `boundsOf([el])` (already imported
   at `canvas.tsx:9` for the selection outline) — the four-corner
   rotated AABB replaces the inline unrotated footprint test. The
   rotation-0 fast path returns the historical math exactly
   (`boundsOf`'s own fast path), so every standing unrotated marquee
   pin is behavior-identical.
2. **Unit pins (`tests/marquee-rotation-s68.test.ts`):** the source
   contract (the filter consumes `boundsOf`, the old inline
   `el.x >= drag.x` footprint test absent) + the behavioral
   composition (the `boundsOf` rotated-AABB values re-derived for the
   pin geometry: a 200×100 rect at (400,200) rotated 45° corner-
   anchored yields the AABB [329.29, 541.42] × [200, 412.13]).
3. **E2E pins (`tests/e2e/session68-fixes.spec.ts`, desktop 1280×800,
   the fixture discipline):** a rotated element (rotation 45) with two
   discriminating marquee bands — (a) the POSITIVE: a band containing
   the VISUAL footprint but not the unrotated one
   ((325,195)→(560,415) in canvas coordinates) selects the element
   (pre-fix: no selection — the unrotated footprint sticks out past
   the band's right edge); (b) the NEGATIVE: a band containing the
   unrotated footprint but not the visual one ((395,195)→(605,305))
   selects NOTHING (pre-fix: "1 selected" — the unrotated test
   passes). Both bands start on empty canvas (outside both footprints
   — the hit-test would otherwise own the pointer).

### S68-C — the sanitizer hardening batch (L-A + L-3)

1. **The ids cap:** `rawIds.filter(...)` gains `.slice(0, 100)` —
   the route's own `targetIds` cap mirrored onto the model's reply
   (a hallucinated ids array can no longer drive an O(ids × elements)
   client filter).
2. **The named patch type:** `AiOperation`'s update variant's inline
   patch type becomes the exported `AssistantUpdatePatch`; the
   sanitizer builds `const patch: AssistantUpdatePatch = {}` and drops
   the broken conditional cast entirely
   (`operations.push({ op: "update", ids, patch })`); the client builds
   `const patch: Partial<DesignElementDTO> = {}` and calls
   `store.updateElements(targets, patch)` — BOTH `as never`-family
   casts deleted. The sanitizer's clamped field set is unchanged
   (fill/opacity/width/height/scale/text — the type now merely
   describes what the code already builds).
3. **Unit pins (`tests/sanitizer-ids-s68.test.ts`):** the ids cap
   behavioral pin (a 150-id LLM reply → 100 survive), the
   preservation pin (small ids arrays pass verbatim), the source
   contracts (the `.slice(0, 100)` form, the zero `as never` casts
   across both files, the exported `AssistantUpdatePatch` consumed by
   the variant), and the patch VALUE preservation (the clamped output
   unchanged — the type change is not a behavior change).

### S68-D — the client/test-infra low batch (L-2 + L-4 + L-5 + L-6)

1. **The autosave 401 terminal (L-2):** a `sessionDead` flag in the
   autosave effect's closure — the PUT's failure branch checks
   `response.status === 401` FIRST: one distinct toast ("Session
   expired" / "Your session has expired — sign in again to save your
   changes."), the badge honestly re-set to "Unsaved", and every
   later flush early-returns on the flag (no infinite retry loop at
   ~1 PUT/s against a dead cookie). The Untitled-mode `ensureProject`
   POST obeys the same terminal (a dead session must not loop the
   creation POST either). A network error or a 5xx keeps the existing
   retry family untouched.
2. **The playwright leftover-server guard (L-6):** the
   `webServer.command` pre-kills any stale standalone server before
   booting (`pkill -f "standalone/server[.]js"` — the bracket form so
   the command's own shell never matches itself; the smoke suite's own
   discipline) and `reuseExistingServer` flips to `false` (a leftover
   server is never silently reused — with the pre-kill, the fresh boot
   always wins the port).
3. **The dead dependency (L-5):** `@radix-ui/react-toast` removed
   from `package.json` (+ `bun.lock`) and
   `scripts/install_packages.sh` — grep-verified zero imports (the
   custom globalThis toast store owns the surface).
4. **The TEST-ONLY doc status (L-4):** `fitToBounds` and
   `normalizeRect` carry the honest TEST-ONLY marker (the
   session-63 `elementToStyle` precedent — both are unit-pinned
   geometry contracts with zero production consumers; the stale
   "used by thumbnails" claim corrected).

Unit pins (`tests/editor-lows-s68.test.ts`): the autosave 401
terminal source contract (the status check BEFORE the generic family,
the sessionDead early-return in flush, the distinct toast copy) +
preservation (the network-error catch keeps its retry); the
playwright config contract (the pre-kill command form, the
`reuseExistingServer: false`); the dead-dependency absence pins
(`package.json` lacks the dep, zero imports repo-wide); the TEST-ONLY
doc markers.

E2E pin (`tests/e2e/session68-fixes.spec.ts`): the 401 round-trip —
open a fixture editor, `context.clearCookies()`, edit the background
color (the S60-A surface), await the "Session expired" toast, make a
second edit, wait 3s, and assert the elements-PUT count stayed at
exactly 1 (pre-fix: the generic "Autosave failed" toast + a PUT every
~800ms retry — the count climbs past 3).

## Planned counts

Unit: +~26 pins across four new spec files
(`tests/request-surface-s68.test.ts` ~12, `tests/marquee-rotation-s68.test.ts`
~4, `tests/sanitizer-ids-s68.test.ts` ~6, `tests/editor-lows-s68.test.ts`
~8, minus overlaps) → **~514 = 488 + 26**. E2E: +3 pins in
`tests/e2e/session68-fixes.spec.ts` (the marquee positive + negative,
the autosave 401 terminal) → **~230 = 227 + 3**. Smoke: unchanged at
**58** (the S68-A guards are transparent to the suite's small bodies;
no new smoke sections).

## RED expectations

Unit RED: no `bodySizeRejected` at the twelve sites (the source
contracts fail on absence); the marquee filter without `boundsOf`; the
ids array uncapped; the `as never` casts present; no `sessionDead`
flag / no 401 discrimination in the autosave; `reuseExistingServer:
!process.env.CI`; the dead dependency present; no TEST-ONLY markers.
E2E RED against the pre-fix standalone build: the visual-footprint
band selects nothing (expected "1 selected"); the unrotated-footprint
band answers "1 selected" (expected 0); the 401 round-trip answers
the generic "Autosave failed" toast and the PUT count climbs past 1.

## Execution order

S68-A → S68-B → S68-C → S68-D (the request-surface family first —
mechanical, the session's own completion; the marquee geometry second;
the sanitizer typing third; the client/test-infra batch last) →
unit GREEN → build → e2e RED (pre-fix standalone) → e2e GREEN →
smoke → full gate → live verification + screenshots → docs → commit +
push.

## Execution status

- [x] S68-A — the parse-guard family completion
- [x] S68-B — the rotation-aware marquee
- [x] S68-C — the sanitizer hardening batch
- [x] S68-D — the client/test-infra low batch
- [x] Full gate green — zero regressions (lint · typecheck · 537 unit = 488 + 49 / 93 files · build 23 routes · 58 smoke · 230 e2e = 227 + 3)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the S68 build after the changes — the 45th consecutive session; the standard 32 re-captured + the ref-audit-s78 evidence set with clone-18 the marquee visual-footprint selection + clone-19 the session-expired terminal captured BY the e2e pins at the verified-assertion moments + clone-20 the live inline marquee check)

## Execution notes (the realized counts + the en-route work)

Unit: +49 checks across four new spec files (request-surface-s68 27,
marquee-rotation-s68 4, sanitizer-ids-s68 7, editor-lows-s68 11) →
**537 = 488 + 49** (the plan estimated ~+26 — the realized
request-surface file carries the full 12-site × 2-pin family plus the
three discipline pins, and the editor-lows file carries the full
401-terminal source-contract family).

E2E: +3 pins in `tests/e2e/session68-fixes.spec.ts` → **230 = 227 +
3**, all three honestly RED against the pre-fix standalone build at
exactly the defect assertions (the visual-footprint band selecting
nothing; the unrotated-footprint band answering "1 selected"; the
401 round-trip answering the generic "Autosave failed" toast with the
PUT count climbing). Smoke: unchanged at **58**.

**The en-route work (the F55 lessons):**

1. **The playwright webServer pre-kill first used the bracket form**
   (`server[.]js`) — and the command's own shell died within 16ms of
   boot: the shell's cmdline IS the full command string, whose tail
   contains the plain `bun .next/standalone/server.js` form, so the
   unanchored pattern matched the wrapper itself. The anchored
   `^bun .next/standalone` form matches only real bun server
   processes and never the sh -c wrapper.

2. **The never-cast removal's first comments quoted the removed
   literals** (`as never`, `as AiOperation extends { … }`) and the
   absence pins read the comments — the F50(1) lesson's second
   appearance. The comments now describe the removed form in prose.

3. **The marquee source-contract pin's first anchor read the
   LIVE-DRAW branch** (the first `drag.kind === "marquee"` match —
   the one that sets drag state, not the commit filter) and the
   TEST-ONLY pins sliced from the signature, past the JSDoc markers
   — both fixed with discriminating anchors (the second occurrence /
   `lastIndexOf("/**", …)`).

4. **The marquee capture check needs the REAL mouse pipeline** — the
   canvas's marquee arm calls `setPointerCapture` before `setDrag`,
   and a synthetic `dispatchEvent` pointer carries no active
   pointerId, so the capture THROWS and aborts the arm (the s67
   deselect tap worked only because its effect — deselectAll — sits
   BEFORE the capture call). agent-browser's `mouse move/down/up`
   commands drive real CDP input with live pointers; the anchored
   evidence (clone-20) uses them.
