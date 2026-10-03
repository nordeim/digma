# Remediation Plan — Session 67 (the Fifteenth Audit)

**Date:** 2026-10-03 · **Trigger:** the operator's session-91/92-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the `.env` database contract with `db/` at the repo root, the vitest/playwright suites, the TDD remediation, the screenshots, the aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's hunk-by-hunk review of the session-66 delivery (all five
S66 seams verified intact in source at baseline: the canvas
flush-foreign-first at `canvas.tsx:191/:497` — `resetSliderGesture()`
BEFORE `beginGesture()` at both arm sites; the `begin()` foreign-ride
guard with the live re-read + ownership check
(`properties-panel.tsx:381-395`); the three focus-begins retired
(grep-verified zero `onFocus={() => sliderGesture.begin}` sites); the
color-picker coalescing — the swatch + gradient-stop `textTick()`
wiring (`properties-panel.tsx:271-276/:653-658`) and the
gesture-aware `setBackgroundColor` (`editor-store.ts:365-375`); and
the Low batch — the five auth-route caps, the fail-closed
`redactDatabaseUrl`, the `AUTH_SECRET` once-guard warn, the window
dragover/drop guard, the upload label's keyboard path), then the
FIFTEENTH Mode C audit: two independent fresh-eyes full-file reviews
by separate agents over the least-recently-reviewed surfaces —
auditor A over the client view layer (dashboard-view, recent-view,
teams-view, project-card, app-header, login-screen,
reset-password-screen, logo, use-toast, layout, globals.css, every
page, proxy.ts — last independently reviewed session 65), auditor B
over the server + lib/infra side (all 18 API route files, the 13 pure
lib seams, prisma schema + seed, the test infra, the 6 configs —
carrying the documented deferred backlog for verification and
sharpening) — against the `skills/code-review-checklist` dimensions
with the AGENTS/CLAUDE documented contracts loaded first. Every
chosen finding individually re-verified by the lead in source before
this plan. The baseline gate re-proven green BEFORE any change (lint
· typecheck · 453 unit / 85 files · build 23 routes · 56 smoke · 224
e2e — zero drift from session 66), the DB re-seeded to the pristine
1/2/6/1/3 contract, the parent-shell `DATABASE_URL` trap neutralized
(the `unset` discipline in every db-touching command).

## Reference findings (43rd audit — no drift, no new gaps)

The standing datums re-verified on
`https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 +
mobile 390×844, the real CDP fill login): the desktop nav 124/96/92 × 36;
the greeting "Good evening, sepnetflix2023 ✨" (the name populated, the
evening bucket — the time-appropriate form); Quick Stats 1 Projects / 0
Teams / Pro Plan; the Recent sort `last_accessed` / "1 file found"; zero
kbd affordances; the Create-Team dead chrome the 43rd ("Create Team" +
"Create Your First Team", 2 clicks, 0 dialogs); R3 mobile nav failure
class A the 43rd (nav `display:none`, links 0×0, no hamburger — the
dashboard AND the editor page; evidence `ref-audit-s77/ref-01` and
`ref-02`); the mobile editor header clipping Share/Present at 390
re-measured exactly (Share L385–R458, Present L466–R551 — byte-identical
to the session-63/64/65/66 measurement; evidence `ref-audit-s77/ref-02`);
the board at 9 layers ("9 layers" + "Test Project One", opened through
the project-card ANCHOR after the generic card probe missed — the same
first-attempt miss family as sessions 62/63/64/65/66). Evidence set:
`docs/screenshots/ref-audit-s77/` (ref-00 desktop dashboard, ref-01
mobile dashboard 390, ref-02 mobile editor 390, ref-03 desktop Recent
grid, ref-04 desktop editor).

The clone's mobile navigation verified live, end-to-end at 390×844 —
the 44th consecutive session, ALL GREEN via the single-call verifier
`scripts/verify-nav-s67.sh` (9/9: the 44×44 hamburger with the aria
contract at [16,10], the Sheet dialog with 44px links +
aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape
with focus return + lock release, navigate-and-dismiss, the md-crossing
close, the 768 boundary, and the class-A guard — the Tailwind v4
failure class A NOT present).

## The code audit findings (Mode C — fifteenth pass)

The session-66 delivery itself is clean (all five seams verified to
hold; the 453/56/224 gate re-proven green at baseline before any
change; auditor B: "the session-66 delivery itself introduced no new
defects on the server/lib surface"). The two fresh-eyes passes found
**0 Critical / 0 High / 4 Medium / 9 Low / 13 Informational**
combined — every chosen finding individually re-verified by the lead
in source:

- **M-1 (Medium — the documented B-5, sharpened): password reset does
  NOT evict previously minted session tokens.** `auth.ts:68-85` — the
  token is stateless `userId.expiry.HMAC`; `parseSessionToken` checks
  signature + TTL only; `getSessionUser` (`auth.ts:119-128`) checks
  only that the user exists. The reset route
  (`reset-password/route.ts:68-75`) writes `passwordHash` + nulls the
  reset token — nothing else. Every cookie minted before the reset
  stays valid for the full 7-day TTL: a stolen/observed cookie (or a
  shared-device session) outlives the password reset performed
  specifically to kill it — the canonical OWASP session-revocation
  failure. Empirically confirmed by the repo's own smoke suite: the
  `/tmp/smoke-cookies.txt` jar minted at `smoke-test.sh:42` (BEFORE
  the reset round-trip at `:224-231`) still authorizes the
  "Authenticated reads"/CRUD sections at `:271-352`.
- **M-2 (Medium — the documented B-15): `/api/ai-assistant` has no
  rate limit.** `ai-assistant/route.ts:21-22` — `requireSession()` is
  the only gate; the route then awaits an LLM chat completion with
  `maxDuration = 60`. An authenticated caller can drive unbounded LLM
  completions — API cost burn plus held server work. Deliberately
  deferred in session 66 because a SHARED bucket would break the
  e2e/smoke suites (they drive the route from one localhost IP against
  the 10/15-min auth budget) — the fix is a DEDICATED bucket.
- **M-3 (Medium — the documented enumeration family, sharpened on the
  OTP half): the in-band OTP delivery has no production suppression
  knob.** `resend-otp/route.ts:54` hands the verification code to ANY
  unauthenticated caller who knows an unverified account's email;
  `register/route.ts:80` and `login/route.ts:58` (the unverified
  branch) deliver the code the same way. The sibling half of the
  ADR-014 family has had its knob since session 64
  (`DIGMA_DISABLE_IN_APP_RESET` suppresses the `resetUrl`), but there
  is NO `DIGMA_DISABLE_IN_APP_OTP` — a production deploy cannot close
  the OTP half without source edits.
- **M-4 (Medium — NEW, the widening of the S66-C class): the elements
  PUT accepts a ~1.45 GB request body.** The S66-C caps bounded
  per-field lengths on the auth routes and per-field caps exist on the
  element family (`fillImage` ≤ 700,000 chars, count ≤ 2000) — but the
  PRODUCT is unbounded: `elements/route.ts:134` parses `request.json()`
  into memory before any validation runs; App Router handlers have no
  default body-size cap (the repo's own S66-C finding). An
  authenticated caller OOMs a small self-hosted box and holds the
  SQLite write lock inside the interactive transaction.
- **L-1 (Low — NEW): no creation ceiling on the projects/teams/members
  routes.** The element family has `ELEMENT_LIMIT` (2000);
  `projects/route.ts:29-48`, `teams/route.ts:22-72`,
  `teams/[id]/members/route.ts:12-37`, and
  `projects/[id]/duplicate/route.ts:10-52` have none — an
  authenticated loop inserts unbounded rows (each duplicate copies up
  to 2000 element rows per call).
- **A-L-1 (Low, auditor A): the Dashboard's list view renders a stray
  empty bordered container when the filtered list is empty.**
  `dashboard-view.tsx:336-369` — the bordered list container renders
  unconditionally; the empty-state message is a separate gated block
  BELOW it — a 2px rounded gray hairline above "No projects match".
  The Recent view gates correctly (`recent-view.tsx:402-433`) — a
  local inconsistency. Survived because no e2e drives the Dashboard's
  list toggle (auditor A's Info-1 gap).
- **A-L-2 (Low, auditor A): `DashboardView` duplicates its
  `Promise.all` fetch body** — `dashboard-view.tsx:38-46` vs `:50-66`
  paste the same fetch verbatim in `refresh` and the initial effect.
- **The deferred batch (documented, not chosen):** the rate-limit
  XFF-trust topology knob (B-side L-1 — direct standalone exposure
  makes the last-hop key client-controlled), the list-payload
  projection (L-2 — `include: { elements }` ships full rows), the
  elements row-builder dedup (L-3 — three builders, three default
  conventions; the natural Mode D carrier), the dead schema columns
  (L-4 — `thumbnailSeed`/`src`/`path`/`zIndex` never read), the
  ProjectCard role="button" nesting restructure (A-L-4), the dead
  `@radix-ui/react-toast` dependency, the toast assertive-role polish,
  the team-color swatch names, the ADR-014 enumeration-tradeoff
  sentence, and the informational batch (the TOCTOU count-then-create,
  the verify-otp stale attempts read, the duplicated hashPassword, the
  inert sanitizer cast, the call.ts comment, the prompt-injection
  surface note).

### Verified clean (explicitly re-checked)

The MobileNav contract in full (9/9 via the verifier, the 44th
consecutive session); the five session-66 spec files are REAL (both
auditors re-derived the pins independently); the S66 seams all
present; the session-66 S66-C fixes re-verified (the five cap
families answering the register-family 400 envelope; the redaction
re-probed with 11 forms — every parseable form correct; the AUTH_SECRET
once-guard); the auth crypto (scrypt + `timingSafeEqual` with length
guards, HMAC-SHA256, httpOnly/sameSite-lax/secure cookies); the
`rate-limit.ts` fixed-window math + opportunistic eviction; the
`validation.ts` clamp family incl. `safeFromUrl`; the pure seams
(`editor.ts` bounds/thumbnailFit re-derived, `export-png.ts`
escapeXml at every seam, `greeting.ts`, `team.ts`); all 18 route
envelopes + session gates + P2002/P2025/P2003 catches; the
vitest/playwright isolation (skills/ excluded by pattern, :3100 +
`db/e2e.db` + `DIGMA_DISABLE_AI_LLM=1`, storageState, workers=1); the
smoke bucket discipline (arithmetically coherent); `.env.example`
covering all five source env reads; zero XSS/injection sinks
repo-wide; the login/reset screens' five-state contracts; the
`globalThis` toast store; the proxy exact-match 307s.

## The chosen session work (TDD)

### S67-A — the tokenVersion revocation family (M-1 / B-5)

The one true auth-correctness gap in the deferred queue — the
stateless-session revocation doctrine reaching the format it needed:

1. **The schema column:** `tokenVersion Int @default(0)` on User (the
   `@default(0)` keeps every existing row and the seed untouched);
   `bunx prisma generate` + `db:push` on `db/custom.db` (the e2e
   `global-setup.ts` pushes `db/e2e.db` itself per run).
2. **The token format:** `createSessionToken(userId, tokenVersion)`
   embeds the version — the payload becomes
   `${userId}.${tokenVersion}.${expiry}` (a 4-part token);
   `parseSessionToken` validates 4 parts with a numeric version and
   returns `{ userId, tokenVersion } | null`.
3. **The verify seam:** `getSessionUser` selects `tokenVersion` and
   rejects on mismatch (`user.tokenVersion !== parsed.tokenVersion →
   null`) — a pre-revocation cookie parses, signs, and is STILL
   rejected at the database seam.
4. **The eviction:** the reset route's update gains
   `tokenVersion: { increment: 1 }` — every cookie minted before the
   reset dies with the password change. The two `setSessionCookie`
   call sites (login `:65`, verify-otp `:95` — both hold the full
   user row) pass the live version.
5. **The smoke re-pinning:** the suite's own pre-reset jar becomes
   the revocation EVIDENCE — a new check after the reset round-trip
   ("the pre-reset session cookie is revoked (401)" — the jar minted
   at `:42` against `/api/stats` must now 401), then a re-login under
   a NEW dedicated XFF bucket (`203.0.113.48`) re-mints
   `/tmp/smoke-cookies.txt` with the restored `Digma1234!` so every
   later section runs unchanged.
6. **The e2e re-pinning:** the reset round-trip in
   `tests/e2e/reset-password.spec.ts` moves onto a DEDICATED scratch
   account (registered + verified inside the spec; the demo user's
   `tokenVersion` stays untouched — the shared storageState keeps
   authorizing the ~50 specs that run after reset-password
   alphabetically), and the spec gains the revocation pin: capture
   the scratch account's session cookie (`context().cookies()`), run
   the reset, then the OLD cookie against `/api/auth/me` must 401.

Unit pins (`tests/revocation-s67.test.ts`): the schema contract
(the `tokenVersion` column with `@default(0)`), the 4-part token
format + the numeric-version validation in `parseSessionToken`, the
`getSessionUser` version comparison (select + mismatch rejection),
the reset route's `tokenVersion: { increment: 1 }`, both call sites
passing the live version, and the preservation pins (the signature
`timingSafeEqual` form, the TTL check, the cookie attributes).

E2E pin: the revocation round-trip above (the pre-reset cookie
rejected 401 post-reset; pre-fix it still authorizes).

### S67-B — the request-surface hardening batch (M-4 + L-1)

The unbounded authenticated request surfaces closed in one style:

1. **The aggregate body cap (M-4):** `validation.ts` gains
   `REQUEST_BODY_LIMIT_BYTES` (32 MB) and
   `bodySizeRejected(contentLength: string | null): boolean` (pure —
   unit-testable; `null`/non-numeric passes: chunked uploads carry no
   content-length, the per-field caps still bound those). The
   elements PUT and POST check it BEFORE `request.json()` and answer
   the VALIDATION 400 envelope ("Elements payload too large (max
   32 MB)").
2. **The creation ceilings (L-1):** `validation.ts` gains
   `PROJECT_LIMIT` (500), `TEAM_LIMIT` (100), `MEMBER_LIMIT` (100) —
   coherent-superset decisions at self-hosted scale, documented as
   such. The projects POST (count → reject "Too many projects (max
   500)"), the duplicate route (same ceiling before the copy — each
   duplicate also copies up to 2000 element rows), the teams POST
   ("Too many teams (max 100)"), and the members POST
   ("Too many members (max 100)").

Unit pins (`tests/request-surface-s67.test.ts`): the pure
`bodySizeRejected` behavioral pins (under/at/over/null/ garbage
forms), the source contracts (the BEFORE-`request.json()` ordering at
both element routes; the four ceiling checks with their envelope
messages), the constants' single-sourcing (one home in
`validation.ts`, imported by every route).

### S67-C — the AI limiter + the OTP knob (M-2 + M-3's knob half)

1. **The dedicated AI bucket (M-2):** `rate-limit.ts` gains
   `AI_LIMIT` (20) / `AI_WINDOW_MS` (5 min) and
   `aiRateLimit(ip, now?)` keyed `ai:${ip}` — NEVER the shared
   `auth:` bucket (the documented deferral reason). The route calls
   it right after `requireSession()` and answers the 429 envelope
   family (`RATE_LIMITED`, "Too many assistant requests. Try again
   in a moment.", `Retry-After`). The e2e suite's 3 assistant sends +
   the smoke's 2 stay far under 20; the limiter pin isolates itself
   under a dedicated XFF bucket (`198.51.100.99`) exactly like the
   auth-family specs.
2. **The OTP suppression knob (M-3's knob half):** the
   `DIGMA_DISABLE_IN_APP_OTP` env var, mirroring
   `DIGMA_DISABLE_IN_APP_RESET`'s exact form —
   `process.env.DIGMA_DISABLE_IN_APP_OTP !== "1"` gates the
   `verificationCode` field to null on all three delivery sites
   (`register/route.ts:80`, `resend-otp/route.ts:54`,
   `login/route.ts:58`). With the knob set, a production deploy with
   a real email service closes BOTH halves of the ADR-014 family in
   one step. `.env.example` documents it beside its sibling.

Unit pins (`tests/ai-limit-otp-s67.test.ts`): the `aiRateLimit`
behavioral pins (the 20-call budget, the 21st denied, the Retry-After
window math, the `ai:` key prefix NEVER colliding with the auth
bucket), the source contracts (the route's limiter call ordering —
BEFORE the body parse; the three knob sites; the `.env.example`
documentation row).

E2E pin: the AI 429 (21 rapid sends under the dedicated XFF bucket →
the 429 envelope with Retry-After).

### S67-D — the client Low batch (A-L-1 + A-L-2 + the Info-1 gap)

1. **The list-view empty-state gating (A-L-1):** the Dashboard's
   bordered list container renders only when `filtered.length > 0`
   (the Recent view's own form — the hairline never renders above
   "No projects match").
2. **The shared load seam (A-L-2):** the duplicated
   `Promise.all([projects, stats])` fetch body collapses into ONE
   `load()` consumed by both `refresh` and the guarded initial
   effect — behavior-identical (same deps, same toast surface).
3. **The missing coverage (Info-1):** a new e2e drives the Dashboard
   list toggle + a non-matching search → asserts the "No projects
   match" empty state AND the ABSENCE of the stray bordered container
   (`div.overflow-hidden.rounded-lg.border` count 0 — honestly RED
   pre-fix at count 1).

## Planned counts

Unit: +~24 pins across four new spec files
(`tests/revocation-s67.test.ts` ~8, `tests/request-surface-s67.test.ts`
~7, `tests/ai-limit-otp-s67.test.ts` ~6, plus the standing
preservation pins folded into each) → **~477 = 453 + 24**. E2E: +3 pins
in `tests/e2e/session67-fixes.spec.ts` (the revocation round-trip, the
AI 429, the Dashboard list empty-state) plus the reset-password spec's
scratch-account re-pinning → **~227 = 224 + 3**. Smoke: +2 (the
pre-reset revocation check + the re-login) → **~58**.

## RED expectations

Unit RED: no `tokenVersion` column; the 3-part token; no version
comparison in `getSessionUser`; no increment in the reset route; the
call sites passing one argument; no `bodySizeRejected`; no ceiling
checks; no `aiRateLimit`; no `ai:` bucket; no OTP knob at the three
sites; the list container ungated; the duplicated fetch body. E2E RED
against the pre-fix standalone build: the pre-reset cookie STILL
AUTHORIZES `/api/auth/me` after the reset (200, expected 401); the
AI route's 21st rapid send still answers 200 (no limiter); the
Dashboard's stray bordered container present at count 1. Smoke RED:
the pre-reset jar still authorizes `/api/stats` post-reset.

## Execution order

S67-A → S67-B → S67-C → S67-D (the auth-correctness gap first — the
schema change rides one `db:push`; the request-surface batch and the
limiter batch share the validation/route style; the client Low last)
→ unit GREEN → build → e2e RED (pre-fix standalone) → e2e GREEN →
smoke → full gate → live verification + screenshots → docs → commit +
push.

## Execution status

- [x] S67-A — the tokenVersion revocation family
- [x] S67-B — the request-surface hardening batch
- [x] S67-C — the AI limiter + the OTP knob
- [x] S67-D — the client Low batch
- [x] Full gate green — zero regressions (lint · typecheck · 488 unit = 453 + 35 / 89 files · build 23 routes · 58 smoke = 56 + 2 · 227 e2e = 224 + 3)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the S67 build after the changes — the 44th consecutive session; the standard 32 re-captured + the ref-audit-s77 evidence set with clone-18 the revocation redirect + clone-19 the dashboard list empty state captured BY the e2e pins at the verified-assertion moments)

## Execution notes (the realized counts + the en-route work)

Unit: +35 checks across four new spec files (revocation-s67 9,
request-surface-s67 12, ai-limit-otp-s67 10, client-lows-s67 4) →
**488 = 453 + 35** (the plan estimated ~+24 — the realized pins carry
the full source-contract families plus the behavioral
`bodySizeRejected`/`aiRateLimit` executions).

E2E: +3 pins in `tests/e2e/session67-fixes.spec.ts` → **227 = 224 +
3**, all three honestly RED against the pre-fix standalone build at
exactly the defect assertions (the pre-reset cookie still authorizing
`/` after the reset; the 21st assistant request answering 200; the
stray bordered container at count 1). The reset-password round-trip
legitimately re-anchored onto a scratch account (the tokenVersion
contract change — a demo reset now evicts the shared storageState,
failing every spec running after reset-password.spec.ts
alphabetically).

Smoke: +2 → **58 = 56 + 2** (the pre-reset revocation check — the
suite's own jar minted before the round-trip must 401 after it; the
post-restore re-login under the dedicated 203.0.113.48 bucket).

**The en-route work (the F54 lessons):**

1. **The revocation pin's first draft asserted `/api/auth/me` answers
   401 for a dead session** — the route's CONTRACT is the user probe,
   not the gate: it answers 200 `{ user: null }` when signed out
   (always has). The pin's honest form asserts the session-GUARDED
   route (`/api/stats` → 401, the same form the smoke suite's logout
   check uses) — an API route's 200 can carry a null payload, so
   "unauthenticated" must be pinned on a route that actually GATES.

2. **The re-pinned reset round-trip initially timed out clicking
   "Forgot password?"** — the scratch session landed LIVE in the
   spec's context and `/login` bounces authenticated visits back to
   the workspace (the reference's own behavior), so the forgot flow
   needs the signed-out card: a logout fetch before it (the old demo
   form never hit this because the spec's storageState opt-out left it
   unauthenticated).

3. **The lint gate caught the shared-load seam's first form** — a
   direct `load(() => ignore)` call inside the effect trips
   react-hooks/set-state-in-effect's interprocedural analysis (it
   traces into the useCallback's setState body), while the original
   local-async-runner shape passes: the runner keeps the analysis
   honest, the seam keeps the dedup.

4. **The dashboard empty-state pin's first locator read 3 containers**
   — the bare class selector matched the stats card and project cards
   too; the zero-children filter discriminates the defect container
   exactly (1 pre-fix, 0 post-fix).
