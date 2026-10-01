# Remediation Plan — Session 45 (the Twenty-First Audit)

**Date:** 2026-10-01 · **Trigger:** the operator's session-49 directive (refresh, re-validate the codebase against the mandated docs, iterate to parity with `https://digma-371dfd0d.base44.app/`, pay particular attention to the mobile navigation menu, use TDD, capture screenshots, align docs, push via the SSH wrapper) · **Code state at start:** `c9360ac` (session 43 delivered at `321cf02` + the operator's `docs/session_48.md` transcript push)

## The audit method

The twenty-first consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
function-first per the F19/F30 disciplines, extended with direct
`fetch`-level API probing from the logged-in page (the register / verify /
resend round-trips observed at the HTTP layer — status, body, and the
rendered UI for each). All reference mutations were either reverted or
confined to operator-sanctioned probe accounts
(`digma.audit.probe.45/46/48@gmail.com`, created through the reference's own
signup flow — the same audit surface as session 43's probe). The board was
left pristine at "Test Project One" (no project mutations were needed this
session). The standing sweeps ran as usual: R3 (the mobile nav failure
class), the desktop drift check, and a full live verification of the CLONE's
mobile navigation at 390×844 (the operator's particular focus).

## Reference findings (RA-62, RA-63, RA-64 + re-confirmations)

- **RA-62 (decisive, NEW — the verify-otp attempts-exhaustion path, API +
  UI, live-measured end-to-end).** Wrong codes 1–4 → `400` "Invalid
  verification code. N attempts remaining." (the decrementing counter,
  4→3→2→1 — matching the session-43 reading). The FIFTH wrong code →
  **`429` "Too many failed attempts. Please request a new verification
  code."** — rendered inline in the verify card as the SAME red alert family
  (`role=alert`, live-observed). Every subsequent attempt keeps answering
  `429` with the same message. A **Resend resets the counter** (live
  measured: post-resend, a wrong code reads "4 attempts remaining." again).
  The register and resend responses carry `otp_expires_in_minutes: 10`
  (the code itself never travels in ANY response — measured on both: the
  register body is `{"id","message","otp_expires_in_minutes","country_code"}`
  and the resend body is `{"message","otp_expires_in_minutes"}`).
- **RA-63 (decisive, NEW — the register validation contract, DOM + API +
  UI).** The reference's auth inputs carry **NO `minLength`** — measured on
  BOTH cards (`minLength: -1` on the sign-in and sign-up password fields;
  the "Min. 8 characters" placeholder is a HINT, not a constraint). A weak
  password therefore SUBMITS: `POST /auth/register` → `400` **"Password
  must be at least 8 characters long"** → rendered as the INLINE alert
  INSIDE the form (live-observed: `role=alert`, the shadcn Alert base
  classes, the red family — the same alert chrome as the sign-in failure).
  A malformed email answers `422` (FastAPI-style validation detail — the
  reference's Python backend leaking its framework). A DUPLICATE email
  answers `200` "Registration successful" (the reference re-registers and
  re-emails — its own data-coherence bug).
- **RA-64 (NEW — the reference's OTP backend metadata).** The OTP expires
  in 10 minutes; the code is email-delivered only. The clone's in-app
  delivery (ADR-014) makes the expiry moot — documented, not ported.
- **R3 re-confirmed (21st): mobile nav failure class A at 390×844.** The
  reference's desktop nav computes `display: none` (its `hidden md:flex`),
  and the ONLY header button is the unlabeled 36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s46/ref-01-mobile-dashboard-390.png`.
- **The reference's mobile editor re-measured at 390×844:** its squeezed
  w-60 layers + w-72 properties columns DO render at 390 (measured
  `display: flex`/`block`), leaving the canvas mostly obscured — VLM analysis
  of the captured screenshot confirms the cramped layout. The clone's
  full-width mobile canvas stays the DOCUMENTED deliberate improvement
  (ADR-010; unchanged). Evidence:
  `docs/screenshots/ref-audit-s46/ref-02-mobile-editor-390.png`.
- **Standing surfaces re-verified on the reference:** the desktop nav
  renders flex with NO active pill at `/` (the exact-match contract), the
  Recent page's sort select defaults to `last_accessed`, the greeting
  renders "Good evening, \<first word\> ✨", and the forgot-password
  endpoint answers unknown emails with the no-enumeration `200`
  "If an account exists with this email…". All match the clone's pinned
  contracts.
- **The clone's mobile navigation verified live, end-to-end at 390×844**
  (the operator's particular focus): the hamburger renders at 44×44 with the
  stable `aria-label="Navigation menu"` + `aria-expanded` +
  `aria-controls="mobile-nav-sheet"`; the Sheet opens with the three links
  at 44px targets; `data-scroll-locked` engages; Escape closes with focus
  returning to the trigger; a link tap navigates AND dismisses; the trigger
  re-renders on the new route; at 768 the hamburger computes `display:none`
  and the desktop nav `flex`. **The Tailwind v4 failure class A is NOT
  present in the clone — the 21st consecutive session.**

## Clone findings (the gaps)

- **S45-1 (High): the password inputs carry `minLength={8}`**
  (`src/components/login-screen.tsx` — the password field and the Confirm
  Password field). The browser's NATIVE validation bubble blocks submission
  before the API is ever called, so a weak password renders the platform
  tooltip instead of the reference's measured INLINE alert. The reference
  has NO minLength on either card (RA-63, measured). This is a
  client-side-constraint-masks-the-server-contract bug — the exact class of
  subtle divergence the operator's directive flags.
- **S45-2 (Medium): the register route's weak-password message diverges** —
  "Password must be at least 8 characters" vs the reference's measured
  "Password must be at least 8 characters **long**".
- **S45-3 (Medium): the verify-otp exhaustion diverges** — the clone returns
  `400` "Too many attempts. Request a new code." where the reference returns
  **`429` "Too many failed attempts. Please request a new verification
  code."** (status + text; the message renders in the verify card's alert
  either way, but both the status and the copy are parity-relevant).
- **S45-4 (Medium): the exhaustion lock is missing** — at `verifyAttempts ≥
  5` the clone still accepts the CORRECT code (the success branch runs
  before any ceiling check). The reference's measured message demands a new
  code ("Please request a new verification code") and its measured recovery
  is the Resend (which resets the counter — RA-62). The coherent reading:
  once exhausted, the pending code is dead until a Resend (or the login's
  unverified-recovery branch, which already resets the counter). The
  reference's own exhausted-then-correct-code path is unmeasurable (the
  code is email-only), so the lock is implemented as the coherent
  interpretation of the measured message — the same superset convention as
  ADR-014's delivery deviation.

### Documented deviations (no change — recorded for the ledger)

- **Duplicate-email register:** the clone answers `409 CONFLICT` "An account
  with this email already exists" where the reference answers `200` and
  re-emails the duplicate (RA-63). The clone's behavior is the coherent
  superset over the reference's incoherence — unchanged.
- **Malformed-email status shape:** the clone answers `400` "Enter a valid
  email address" where the reference's FastAPI answers `422` with a
  framework-shaped detail array. The rendered UI outcome (an inline error)
  is equivalent; the 422 shape is the reference's Python-stack
  implementation detail — not ported.
- **OTP expiry (RA-64):** the clone's in-app code delivery carries no
  10-minute expiry — moot under ADR-014 (the code is delivered in the
  response, not emailed).
- **The mobile editor panels:** the reference's squeezed columns at 390 vs
  the clone's full-width canvas — ADR-010's documented improvement,
  re-confirmed this session.

## The remediation slices

### Slice A — remove the client-side minLength mask (S45-1)

- Delete `minLength={8}` from BOTH password inputs in
  `src/components/login-screen.tsx` (the shared password field and the
  Confirm Password field). The "Min. 8 characters" PLACEHOLDER stays (the
  reference carries it — already e2e-pinned).
- The route stays the validator (min 8 at the API), and the failure renders
  the inline alert through the existing `authError` seam (the RA-60 alert
  family, rendered inside the form for sign-in AND sign-up).

### Slice B — the register message alignment (S45-2)

- `src/app/api/auth/register/route.ts`: "Password must be at least 8
  characters" → "Password must be at least 8 characters long" (the
  reference's exact measured text).

### Slice C — the verify-otp exhaustion contract (S45-3 + S45-4)

- `src/app/api/auth/verify-otp/route.ts`:
  - The exhaustion branch: `fail("VERIFY_LOCKED", "Too many failed
    attempts. Please request a new verification code.", 429)` (was 400 +
    the short text).
  - A pre-check lock BEFORE the code comparison: at `verifyAttempts ≥
    MAX_VERIFY_ATTEMPTS` the route answers the same `429` — even for the
    CORRECT code (the pending code is dead until a Resend resets the
    counter; the login's unverified-recovery branch already resets it too).
- The decrementing "N attempts remaining" cadence is UNCHANGED (wrong codes
  1–4 → 400 with 4/3/2/1; the 5th → the 429) — matching RA-62 exactly.

## The TDD plan

- **Smoke (RED first):** a new section in `scripts/smoke-test.sh` — the
  RA-62/63 round-trip on a THIRD unverified account, run under a DEDICATED
  rate-limit bucket (`X-Forwarded-For: 203.0.113.45` — the limiter is
  XFF-keyed, so the section's 10 calls never touch the shared "unknown"
  bucket's budget): weak-password register → 400 + the exact "…long"
  message; register → code; five wrong codes (the 5th → 429 + the exact
  exhaustion message); the CORRECT code at exhaustion → 429 (the lock);
  resend → a differing code; the resent code verifies → the session
  resolves. Exactly 10 auth calls — the fresh bucket's full allowance.
- **E2E (RED first):** one new pin in `tests/e2e/auth.spec.ts` — the
  weak-password sign-up renders the INLINE alert "Password must be at
  least 8 characters long" (proving the native-bubble path is gone). The
  test declares its own `extraHTTPHeaders: { "X-Forwarded-For" }` so its
  register attempt lives outside the suite's 9/10 budget.
- **Unit:** no new pure seams — the changes are route messages/statuses and
  input attributes; the route layer is covered by smoke + e2e per the
  repo's convention (routes have never been unit-mocked here). The
  existing 117 unit checks must stay green.
- **GREEN:** the three slices land; the new smoke + e2e checks pass; the
  full gate re-verified (`lint → typecheck → 117 unit → build → smoke →
  e2e`).

## Execution status

- [x] Slice A — minLength removed from both password inputs (GREEN)
- [x] Slice B — the register message aligned ("…long") (GREEN)
- [x] Slice C — the 429 exhaustion + the pre-check lock (GREEN)
- [x] Smoke extension — the RA-62/63 round-trip (+10 checks; RED 5 failures at their exact assertions pre-fix, GREEN post-fix; the dedicated XFF bucket isolated it from the shared burner budget)
- [x] E2E pin — the weak-password inline alert (+1; RED at the alert's absence pre-fix — the native bubble blocked submission; GREEN post-fix; its own XFF bucket)
- [x] Full gate green — lint · typecheck · 117 unit · build 20 routes · smoke 45/45 · e2e 129/129
- [x] Live verification + screenshots (16 standard re-captured + the ref-audit-s46 provenance/verification set) + docs aligned (PAD v1.24.0, AGENTS, CLAUDE, README, digma_SKILL v1.23.0 lesson F32, session_49.md, worklog)
