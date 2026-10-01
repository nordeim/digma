# Remediation Plan — Session 46 (the Twenty-Second Audit)

**Date:** 2026-10-01 · **Trigger:** the operator's session-51 directive (refresh, re-validate the codebase against the mandated docs, iterate to parity with `https://digma-371dfd0d.base44.app/`, pay particular attention to the mobile navigation menu, use TDD, capture screenshots, align docs, push via the SSH wrapper) · **Code state at start:** `4126e55` (session 45 delivered at `7dc6869` + the operator's `docs/session_50.md` transcript push)

## The audit method

The twenty-second consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
focused on the session-49 suggested next steps: the PASSWORD-RESET LANDING
PAGE (the never-audited `/reset-password` surface the clone lacked
entirely) and the team-invite accept flow. The method combined UI sweeps
with `fetch`-level probing from the logged-in page (the session-45
technique — status + body per call, network-panel correlation via
`agent-browser network requests`). No reference board mutations were
made; the only reference-side actions were the operator-sanctioned
password-reset probes on the operator's own account
(`sepnetflix2023@outlook.com`) and two throwaway token shapes. The
standing sweeps ran as usual: R3 (the mobile nav failure class, 22nd),
the desktop drift check, and a full live verification of the CLONE's
mobile navigation at 390×844 (the operator's particular focus).

## Reference findings (RA-65, RA-66 + re-confirmations)

- **RA-65 (decisive, NEW — the password-reset landing page + API,
  live-measured end-to-end).** The reference carries a full
  `/reset-password` surface the clone lacked entirely:
  - **The route is PUBLIC and session-agnostic** — it renders while
    logged in (no redirect; unlike `/login`, which bounces authenticated
    visits to the workspace).
  - **Two states keyed on the `?token=` query param.** Missing, empty,
    or differently-named param → the **"Invalid Reset Link"** card: a
    `lucide-circle-alert` icon at `h-10 w-10 text-red-600` (40×40), the
    h2 "Invalid Reset Link" (`text-2xl font-bold text-gray-900`,
    centered), the p "This password reset link is invalid or has
    expired." (`text-gray-600`), and the "Back to Login" button
    (PRIMARY: gray-900 bg, white text, 44px, w-full) which navigates to
    `/login`. Any NON-EMPTY `token` → the **"Set new password"** form: a
    `text-center space-y-2` header block (the h2 "Set new password" +
    the p "Enter your new password for Digma"), the "New Password" field
    (id `password`) and the "Confirm New Password" field (id
    `confirmPassword`) — each `type=password`, `required`, placeholder
    `••••••••`, a `lucide-lock` icon at `left-3`, **NO eye toggle, and
    NO `minLength`** (measured `minLength: -1` on both — the RA-63
    family), 44px tall — the helper p "Must be at least 8 characters"
    (`text-xs text-gray-500`), and a `space-y-3` button stack: "Reset
    password" (primary, 44px, w-full) + "Back to login" (a BARE
    `w-full text-sm text-gray-600 hover:text-gray-700` link-button, 20px).
    Note the capitalization asymmetry: the invalid state's button reads
    "Back to **L**ogin", the form state's "Back to **l**ogin".
  - **A DISTINCT card family from the login card.** The reset page's
    wrapper is `min-h-screen flex items-center justify-center bg-gray-50
    p-4` (a FLAT gray-50 — not the login's
    `bg-gradient-to-br from-slate-50 to-slate-100`), and its card is
    `rounded-lg max-w-md w-full overflow-hidden border-0 shadow-lg
    bg-white` (shadow-lg, plain white — not the login's `rounded-2xl
    shadow-2xl bg-white/95 backdrop-blur-sm`), with the padding
    `p-6 pt-12 pb-10 px-12` (the invalid state adds `text-center
    space-y-6`; the form state `space-y-8`).
  - **The API contract (fetch-measured).** `POST
    /auth/reset-password` with **`{reset_token, new_password}`** (the
    exact field names revealed by the FastAPI 422 on a wrong shape): an
    invalid token → `400` `{"message": "Invalid or expired reset
    token"}` rendered as the INLINE destructive alert
    (`bg-red-50/50 border-red-200` — the RA-60 alert family). **The
    token is validated BEFORE the password** (an invalid token + a weak
    password still answers the token error).
  - **The reset request.** `POST /auth/reset-password-request` → the
    no-enumeration `200` `{"message":"If an account exists with this
    email, you will receive a password reset link."}` — **the token
    never travels in any response** (email-only delivery, the same
    family as the OTP — ADR-014).
  - **The client-side mismatch guard:** differing confirm → the INLINE
    alert "Passwords do not match" (no submit; the same guard family as
    the reference's register card).
  - **Mobile 390×844:** the card renders at 358px wide (the p-4
    gutters), no horizontal overflow.
  - **The success path (a valid token) is UNMEASURABLE** — the token is
    email-only. The coherent reading (documented as the superset): the
    hash updates, the token clears, and the card transitions to a
    success state before the return to login.
- **RA-66 (NEW — the query-param contract):** only a NON-EMPTY `token`
  param opens the form — `?code=abc123` and `?token=` (empty) both
  render the invalid state (live-measured both).
- **The team-invite accept flow: UNMEASURABLE** — the reference's
  Create Team buttons remain dead (re-verified this session: both the
  header and empty-state buttons open zero dialogs), so no team (and no
  invite surface) can ever exist on the reference account.
- **R3 re-confirmed (22nd): mobile nav failure class A at 390×844** —
  the reference's desktop nav computes `display: none` (`hidden
  md:flex`), the only header button is the unlabeled 36px dead bell.
  Evidence: `docs/screenshots/ref-audit-s48/ref-04-mobile-dashboard-390.png`.
- **Standing surfaces re-verified on the reference:** the desktop nav
  renders flex with NO active pill at `/` (the exact-match contract),
  the greeting renders "Good morning, \<first word\> ✨", the Recent
  page's sort select defaults to `last_accessed`, the Dashboard's
  "Create New Design" button, the login/forgot cards (the clone's
  S43-5 ports intact). All match the clone's pinned contracts.
- **The clone's mobile navigation verified live, end-to-end at
  390×844** (the operator's particular focus): the hamburger renders at
  44×44 with the stable `aria-label="Navigation menu"` + `aria-expanded`
  + `aria-controls="mobile-nav-sheet"`; the Sheet opens with the three
  links at 44px targets; `data-scroll-locked` engages; Escape closes
  with focus returning to the trigger; a link tap navigates AND
  dismisses; at 768 the hamburger computes `display:none` and the
  desktop nav `flex`. **The Tailwind v4 failure class A is NOT present
  in the clone — the 22nd consecutive session.**

## Clone findings (the gaps)

- **S46-1 (High): the `/reset-password` route does not exist** — the
  entire landing page (both states) is missing from the clone.
- **S46-2 (High): the reset API does not exist** — the forgot flow makes
  NO API call at all (a pure client-side card transition; the comment
  documents "the demo account's reset lives in db:seed").
- **S46-3 (Medium): the schema has no reset-token columns** — the User
  model needs `resetToken` + `resetTokenExpiresAt`.
- **S46-4 (Medium): the in-app delivery of the reset link** — the
  self-hosted demo needs a working path (the ADR-014 family): the
  request response carries the reset URL when the account exists, and
  the "sent" card renders it in the info-alert family.

### Documented deviations (recorded for the ledger)

- **The valid-token success path:** unmeasurable (email-only) — the
  clone implements the coherent reading (the hash update, the token
  clear, a success card, then login), the same superset convention as
  ADR-014.
- **The token delivery:** in-app (the response carries the reset URL
  for existing accounts) — the no-enumeration MESSAGE stays verbatim;
  production with an email service should switch the delivery and drop
  the URL.
- **The malformed-email 422:** the reference's FastAPI shape — NOT
  ported (the clone's 400 "Enter a valid email address" stays, the
  session-45 recorded deviation).

## The remediation slices

### Slice A — the schema + the request route (S46-3 + the request half of S46-2)

- `prisma/schema.prisma`: `resetToken String?` + `resetTokenExpiresAt
  DateTime?` on User (with the RA-65 comment block).
- `POST /api/auth/forgot-password`: rate-limited (the same
  `authRateLimit` family — the reference's reset endpoints sit behind
  its auth limiter too); validates the email shape (400 "Enter a valid
  email address"); ALWAYS answers the no-enumeration 200 with the
  reference's exact message; for an existing account generates a
  crypto-random 32-hex-char token + a 60-minute expiry, stores it, and
  includes `resetUrl` in the response data (null for unknown accounts —
  the ADR-014 in-app delivery).
- `db:push` + the dev-server restart (the prisma-client boot-time
  staleness trap, lesson F30).

### Slice B — the reset route (the submit half of S46-2)

- `POST /api/auth/reset-password` with `{reset_token, new_password}`
  (the reference's exact field names): rate-limited; the token lookup
  (unknown/expired/cleared → 400 "Invalid or expired reset token");
  **the token validated BEFORE the password**; a weak password → 400
  "Password must be at least 8 characters long" (the RA-63 exact text);
  success → the hash updated, the token CLEARED (single-use), 200
  "Password reset successfully".

### Slice C — the landing page (S46-1)

- `src/app/reset-password/page.tsx` — PUBLIC (no `getSessionUser`
  redirect — the reference renders it while logged in), force-dynamic,
  metadata title "Reset password" (the clone's own per-route metadata
  convention; the reference titles every page "Digma").
- `src/components/reset-password-screen.tsx` — the client component:
  `useSearchParams().get("token")` — non-empty → the form state, else
  the invalid state (RA-66); the measured chrome VERBATIM (the flat
  gray-50 wrapper, the `rounded-lg shadow-lg bg-white` card, both
  padding/layout variants, the circle-alert invalid state, the form
  with lock icons + no eye toggle + no minLength + the helper, the
  space-y-3 button stack, the capitalization asymmetry); the mismatch
  guard ("Passwords do not match" inline alert); the submit → the route
  → a 400 renders the inline destructive alert; success → the success
  card (the coherent superset: the h2 "Password reset" + the green
  alert + the full-width "Back to login" → `/login`, the sent-card
  family).

### Slice D — the forgot wiring + the in-app link (S46-4)

- `src/components/login-screen.tsx`: the forgot submit calls
  `POST /api/auth/forgot-password` (email payload); a 200 still
  transitions to the "sent" card (the reference's behavior — the
  no-enumeration message renders regardless); the sent card ADDITIONALLY
  renders the in-app reset link in the blue info-alert family when the
  response carries one ("Self-hosted mode: … reset your password
  directly: [link]" — the verify card's convention).

## The TDD plan

- **Unit (RED first):** new pure seams in `src/lib/validation.ts`:
  `normalizeResetToken(raw)` (null for missing/empty — the RA-66
  contract) and `resetTokenAlive(expiresAt, now?)` (the expiry check:
  null → false, past → false, future → true). The existing 117 checks
  must stay green.
- **Smoke (RED first):** a new section in `scripts/smoke-test.sh` under
  a DEDICATED XFF bucket (`203.0.113.46` — the limiter is XFF-keyed):
  the request with the demo email → 200 + the exact no-enumeration
  message + a resetUrl; the request with an unknown email → 200 + the
  same message + null; the invalid token → the 400 token error; the
  invalid token + a weak password → the TOKEN error (the ordering pin);
  the valid token + a weak password → the 400 "…long" message; the
  valid token + a new password → 200; the OLD password now 401s; the
  NEW password signs in; the token replay → the 400 token error; the
  RESTORE round-trip (a fresh token resets the demo password back to
  `Digma1234!`). Exactly 10 auth calls — the fresh bucket's full
  allowance.
- **E2E (RED first):** a new `tests/e2e/reset-password.spec.ts` (its
  own XFF bucket, logged-out): the no-token landing renders the invalid
  card and "Back to Login" navigates to `/login`; the empty-token and
  `?code=` variants render the invalid card (RA-66); the with-token
  form renders the measured structure (heading, both fields, the
  helper, both buttons, no `minLength`); the mismatch guard; the
  invalid-token submit renders the inline alert; the FULL round-trip
  (forgot → the sent card carries the in-app link → follow it → set a
  new password → the success state → back to login → sign in with the
  NEW password).
- **GREEN:** the four slices land; the new unit/smoke/e2e checks pass;
  the full gate re-verified (`lint → typecheck → unit → build → smoke →
  e2e`).

## Execution status

- [x] Slice A — the schema columns + the forgot-password request route (GREEN)
- [x] Slice B — the reset-password submit route (GREEN)
- [x] Slice C — the landing page (both states, the measured chrome) (GREEN)
- [x] Slice D — the forgot wiring + the in-app reset link (GREEN)
- [x] Unit seams (+4 checks → 121) — RED (4 failures at the absent seams) then GREEN
- [x] Smoke section (+11 checks → 56, two dedicated XFF buckets) — RED (11 failures: the 404s + the cascading logins; all 45 pre-existing passing) then GREEN
- [x] E2E spec (+7 pins → 136, own XFF bucket) — RED (7/7 failing at the missing page) then GREEN — **the GREEN phase caught the 0.0.0.0 origin (the absolute resetUrl broke the standalone deploy's cookie flow; fixed as the RELATIVE URL, lesson F33)**
- [x] Full gate green — lint · typecheck · 121 unit · build 23 routes · 56 smoke · 136 e2e
- [x] Live verification + screenshots (the standard 16 re-captured + 17-reset-invalid + 18-reset-form + the ref-audit-s48 provenance/verification set) + docs aligned (PAD v1.25.0, AGENTS, CLAUDE, README, digma_SKILL v1.24.0 lesson F33, session_51.md, worklog)
