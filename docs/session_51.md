# Session 51 — The Twenty-Second Parity Audit: The Password-Reset
Landing Page + Round-Trip (S46-1 + S46-2 + S46-3 + S46-4)

**Date:** 2026-10-01 · **Code state at start:** `4126e55` (session 45
delivered at `7dc6869`; the operator's `docs/session_50.md` transcript
push on top) · **Code state at end:** this commit · **Docs:** PAD v1.25.0 ·
digma_SKILL v1.24.0 (lesson F33)

## Directive

The operator's session-51 directive: refresh the workspace, re-internalize
the mandated docs (AGENTS, CLAUDE, README, PAD, digma_SKILL, the session
logs, the worklog), validate the understanding against the codebase, then
iterate to visual and functional parity with
`https://digma-371dfd0d.base44.app/` — paying particular attention to the
MOBILE NAVIGATION menu (watching for the Tailwind v4 bug class), using the
repo's skills (Tailwind v4, clone-app-pat-pro, agent-browser, tdd), the
scandihaven tech-stack patterns, a TDD remediation pass, the vitest +
playwright suites, the `DATABASE_URL="file:../db/custom.db"` + `db/` at the
repo root configuration, fresh screenshots under `docs/screenshots/`, a
verified `.env.example`, aligned docs, and the SSH-wrapper push to `main`.

## The audit (twenty-second consecutive)

**Baseline before any change:** the workspace refreshed (`git pull` —
`4126e55`, the operator's session-50 transcript), the fast gates green
(lint · typecheck · 117/117 unit), the dev server healthy with the
`[db] DATABASE_URL -> …/digma/db/custom.db` anchor, the DB seeded (1 user,
2 projects, 6 elements, 1 team, 3 members), and the standing configs
verified (vitest + playwright wired with `skills/` excluded everywhere).

**The method:** the session-49 suggested next steps drove the target
selection — the reference's PASSWORD-RESET LANDING PAGE (the never-audited
`/reset-password` surface) probed with UI sweeps + `fetch`-level
round-trips + network-panel correlation (`agent-browser network requests`
caught the real base44-scoped endpoint paths when the guessed path
405'd). No reference board mutations; the only reference-side actions were
reset probes on the operator's own account plus two throwaway token shapes.

### Reference findings (live-measured; desktop 1440×900, mobile 390×844)

- **RA-65 (decisive, NEW — the password-reset landing page + API).** The
  reference's `/reset-password` is PUBLIC and session-agnostic (renders
  while logged in — no redirect). Two states keyed on `?token=`: the
  **"Invalid Reset Link"** card (the `lucide-circle-alert h-10 w-10
  text-red-600` icon, the h2 `text-2xl font-bold text-gray-900` centered,
  "This password reset link is invalid or has expired.", the primary
  "Back to Login" → `/login`) for a missing/empty/differently-named param;
  the **"Set new password"** form for any NON-EMPTY token (the
  `text-center space-y-2` header + "Enter your new password for Digma",
  the New/Confirm Password inputs with lock icons and **NO `minLength`**
  (measured -1 — the RA-63 family), the "Must be at least 8 characters"
  helper, the `space-y-3` stack of the primary "Reset password" + the
  BARE `w-full text-sm text-gray-600` "Back to login" — the reference's
  own capitalization asymmetry). A DISTINCT card family from the login
  card: the flat `bg-gray-50` page + `rounded-lg border-0 shadow-lg
  bg-white` card + `p-6 pt-12 pb-10 px-12` padding. The API:
  `POST /auth/reset-password` with exactly `{reset_token, new_password}`
  (the field names measured via the FastAPI 422), the token validated
  BEFORE the password, the invalid token → `400 "Invalid or expired reset
  token"` rendered as the inline destructive alert; the request endpoint
  answers the no-enumeration `200` with the exact message and the token
  never travels in any response (email-only). The mismatch guard renders
  the inline "Passwords do not match" alert. The success path is
  UNMEASURABLE (email-only).
- **RA-66 (NEW — the query-param contract):** `?code=abc123` and
  `?token=` (empty) both render the invalid card; only a non-empty
  `token` opens the form.
- **The team-invite accept flow: UNMEASURABLE** — the reference's Create
  Team buttons remain dead (re-verified: both buttons open zero dialogs),
  so no team or invite surface can exist.
- **R3 re-confirmed (22nd): mobile nav failure class A at 390×844** — the
  reference's desktop nav computes `display: none`, the only header button
  is the unlabeled 36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s48/ref-04-mobile-dashboard-390.png`.
- **Standing surfaces re-verified:** the desktop nav flex with NO pill at
  `/`, the "Good morning, \<first word\> ✨" greeting, the Recent sort
  default `last_accessed`, the Dashboard's "Create New Design".
- **The clone's mobile navigation verified LIVE, end-to-end at 390×844**
  (the operator's particular focus): the 44×44 hamburger with the stable
  aria contract; the Sheet opens with 44px link targets;
  `data-scroll-locked` engages; Escape closes with focus return; a link
  tap navigates AND dismisses; at 768 the hamburger computes
  `display:none` and the desktop nav `flex`. **The Tailwind v4 failure
  class A is NOT present in the clone — the 22nd session.**

### Clone findings

- **S46-1 (High):** no `/reset-password` route existed — the entire
  landing page (both states) was missing.
- **S46-2 (High):** no reset API — the forgot flow made NO API call at
  all (a pure client-side card transition).
- **S46-3 (Medium):** the schema lacked reset-token columns.
- **S46-4 (Medium):** the self-hosted demo needed the in-app delivery of
  the reset link (the ADR-014 family).

## The remediation plan

`docs/remediation-plan-session46.md` — written and validated line-by-line
against the codebase before execution. Four slices: **A** (the schema
columns + the forgot-password request route), **B** (the reset-password
submit route), **C** (the landing page with the measured chrome), **D**
(the forgot wiring + the in-app link).

## The TDD execution

**RED (unit):** 4 failures at the absent seams (`normalizeResetToken`,
`resetTokenAlive`).

**RED (smoke):** the new RA-65/66 section (under its own two
`X-Forwarded-For` buckets — `203.0.113.46` for the nine contract calls,
`203.0.113.47` for the demo-password restore) ran **11 failures at their
exact assertions** against the pre-fix build (the route 404s + the
cascading login checks) with all 45 pre-existing checks passing — no
collateral.

**RED (e2e):** the new `tests/e2e/reset-password.spec.ts` (its own XFF
bucket) ran **7/7 pins failing** (the page 404).

**GREEN:** the four slices landed — and the round-trip pin then caught a
real deploy bug: the first implementation built the resetUrl from
`new URL(request.url).origin`, which the standalone server reconstructs
from its BIND address — the link carried `http://0.0.0.0:3100`, Chrome
refuses cookies on that host, and the post-login session vanished (the
page bounced back to a pristine login card). **The fix: the resetUrl is
RELATIVE** (`/reset-password?token=…`) — it resolves against the page's
own origin everywhere. Folded into lesson **F33**.

**Full gate green: lint · typecheck · 121 unit (+4) · build 23 routes
(+3) · smoke 56/56 (+11) · e2e 136/136 (+7).**

## The live verification (dev server, post-fix)

- The forgot submit calls the route and the sent card renders the green
  alert + the in-app link ("reset your password directly").
- The link opens the "Set new password" form with the live token; a new
  password lands the "Password reset" success card (the green "You can
  now sign in with your new password." alert).
- The OLD password 401s; the NEW password signs in ("Good morning,
  Designer ✨").
- The demo password restored (the DB left in its seeded contract).

## Delivery

- The standard 16 screenshots re-captured (every dimension verified —
  1440×900, 390×844, 768×900) + **17-reset-invalid.png +
  18-reset-form.png** (the new surface) + the ref-audit-s48 provenance
  set (4 reference shots: the invalid card, the form, the mobile form,
  the mobile dashboard) and verification set (3 clone shots: the sent
  card with the in-app link, the success card, the mobile reset form) —
  all VLM content-checked.
- `.env.example` verified unchanged (no new env vars — the token is
  crypto-random, the TTL a constant); included in the commit.
- Docs aligned: PAD v1.25.0 (the revision block + §6.3 + §7.1 + the
  file-tree/key-files rows), AGENTS.md (the auth bullet's reset contracts
  + the counts + the relative-URL rule), CLAUDE.md (ditto + the pin
  inventory), README.md (the reset-round-trip row + the counts), digma_SKILL
  v1.24.0 (lesson **F33** — never build a URL from `request.url` in a
  standalone deploy; the origin-flip trace diagnostic; the
  truncated-token probe gotcha; the route-announcer alert), the plan's
  execution status, this log, and the worklog entry.
- Full gate re-verified green before the commit; pushed to `main` via
  `docs/ssh_git_wrapper_v3.py` (the key shredded after).

## Suggested next steps

The reference's remaining unaudited surfaces for a twenty-third session:
the verify-email flow's success path stays unmeasurable (the code is
email-only — confirmed at the response-body level in sessions 45 and 46),
but the reference's SIGN-IN card eye-toggle family could use a
fresh double-check (the clone's eye toggle is a documented superset —
re-confirm the reference still ships none on its auth cards); the
Teams-page Create-Team dead chrome is now 22 sessions stale as a datum
(re-verify once more before any future port decision); and a CLONE-side
polish pass over the present-mode overlay at mobile viewports (pure
superset — the reference's Present is dead, 20 confirmations) would round
out the mobile surface. The password-reset surface itself is now fully
ported — the residual reference behaviors (the valid-token success card,
the emailed-link delivery) are documented coherent supersets and need no
further probing.
