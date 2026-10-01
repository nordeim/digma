# Session 49 — The Twenty-First Parity Audit: The Verify-Otp Exhaustion
Contract + the Register Password Contract (S45-1 + S45-2 + S45-3 + S45-4)

**Date:** 2026-10-01 · **Code state at start:** `c9360ac` (session 43
delivered at `321cf02`; the operator's `docs/session_48.md` transcript push
on top) · **Code state at end:** this commit · **Docs:** PAD v1.24.0 ·
digma_SKILL v1.23.0 (lesson F32)

## Directive

The operator's session-49 directive: refresh the workspace, re-internalize
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

## The audit (twenty-first consecutive)

**Baseline before any change:** the workspace re-cloned (`git clone` — the
sandbox had been reset), `bun install`, `.env` written with
`DATABASE_URL="file:../db/custom.db"`, the `db/` folder created at the repo
root, `db:push` + `db:seed` (1 user, 2 projects, 6 elements, 1 team, 3
members), the dev server healthy with the `[db] DATABASE_URL ->
…/digma/db/custom.db` anchor log, and the fast gates green (lint ·
typecheck · 117/117 unit). The scandihaven repo cloned and its
README/structure reviewed (the Turborepo/pnpm/Next 16/React 19/Tailwind 4
CSS-first patterns the digma stack follows); the digma skills catalog
consulted for the Tailwind v4 failure classes, agent-browser, and the TDD
workflow.

**The method — the fetch-layer probe:** where the prior audits measured the
DOM and the network panel, this session drove the reference's auth
round-trips directly from the logged-in page (`fetch` from `agent-browser`
eval — status + body per call) and measured the input ATTRIBUTES on both
auth cards. All probes were confined to operator-sanctioned probe accounts
(`digma.audit.probe.45/46/48@gmail.com`, created through the reference's
own signup flow); the board stayed pristine at "Test Project One".

### Reference findings (live-measured; desktop 1440×900, mobile 390×844)

- **RA-62 (decisive, NEW — the verify-otp attempts-exhaustion path).**
  Wrong codes 1–4 → `400` "Invalid verification code. N attempts
  remaining." (decrementing 4→3→2→1); the FIFTH wrong code → **`429` "Too
  many failed attempts. Please request a new verification code."** rendered
  inline in the verify card (the same red `role=alert` family);
  every further attempt keeps answering 429; a **Resend resets the
  counter** (post-resend, a wrong code reads "4 attempts remaining."
  again). The register/resend responses carry `otp_expires_in_minutes: 10`
  — and the code itself never travels in ANY response (register:
  `{id, message, otp_expires_in_minutes, country_code}`; resend:
  `{message, otp_expires_in_minutes}`), confirming ADR-014's in-app
  delivery deviation stays necessary.
- **RA-63 (decisive, NEW — the register password contract, DOM + API +
  UI).** The reference's auth inputs carry **NO `minLength`** (measured
  `minLength: -1` on the sign-in AND sign-up password fields; the "Min. 8
  characters" placeholder is a hint, not a constraint). A weak password
  SUBMITS → `400` "Password must be at least 8 characters long" → rendered
  as the INLINE alert INSIDE the form (the same alert family as the
  sign-in failure). Also measured: a malformed email answers `422`
  (the reference's FastAPI backend leaking its framework), and a DUPLICATE
  email answers `200` "Registration successful" (the reference
  re-registers and re-emails — its own data-coherence bug).
- **RA-64 (NEW — OTP metadata):** the code expires in 10 minutes; not
  ported (moot under the in-app delivery — documented).
- **R3 re-confirmed (21st): mobile nav failure class A at 390×844** — the
  reference's desktop nav computes `display: none` (`hidden md:flex`), the
  only header button is the unlabeled 36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s46/ref-01-mobile-dashboard-390.png`.
- **The reference's mobile editor re-measured at 390×844:** its squeezed
  w-60 layers + w-72 properties columns DO render (the canvas mostly
  obscured — VLM-analyzed). The clone's full-width mobile canvas stays the
  documented deliberate improvement (ADR-010). Evidence:
  `docs/screenshots/ref-audit-s46/ref-02-mobile-editor-390.png`.
- **Standing surfaces re-verified:** the desktop nav flex with NO pill at
  `/`, the Recent sort default `last_accessed`, the "Good evening, \<first
  word\> ✨" greeting, the forgot-password no-enumeration 200.
- **The clone's mobile navigation verified LIVE, end-to-end at 390×844**
  (the operator's particular focus): hamburger 44×44 with the stable aria
  contract; the Sheet opens with 44px link targets; `data-scroll-locked`
  engages; Escape closes with focus return; a link tap navigates AND
  dismisses; the trigger re-renders per route; at 768 the hamburger
  computes `display:none` and the desktop nav `flex`. **The Tailwind v4
  failure class A is NOT present in the clone — the 21st session.**

### Clone findings

- **S45-1 (High):** the password inputs carried `minLength={8}` — the
  native validation bubble blocked submission, masking the API's
  inline-alert path (the reference has no minLength on either card).
- **S45-2 (Medium):** the register's weak-password message read "Password
  must be at least 8 characters" (missing the reference's "long").
- **S45-3 (Medium):** the verify-otp exhaustion answered `400` "Too many
  attempts. Request a new code." (the reference: `429` "Too many failed
  attempts. Please request a new verification code.").
- **S45-4 (Medium):** no exhaustion lock — the correct code still verified
  at `verifyAttempts ≥ 5`.

## The remediation plan

`docs/remediation-plan-session45.md` — written and validated line-by-line
against the codebase before execution. Three slices: **A** (remove the
`minLength` mask from both password inputs), **B** (align the register
message), **C** (the 429 exhaustion + the pre-check lock — the coherent
reading of the measured "Please request a new verification code").

## The TDD execution

**RED (smoke):** the new RA-62/63 section (under its own
`X-Forwarded-For: 203.0.113.45` rate-limit bucket — the limiter is
XFF-keyed, so the section's exactly-ten auth calls never touch the shared
bucket the final 429-burner depends on) ran **5 failures at their exact
assertions** against the pre-fix build: the weak-password message (400 but
without "long"), the exhaustion status (400, not 429), the lock (the
correct code verified — 200), and the two cascade failures (the post-lock
resend 409'd because the account was already verified; the final verify had
no code). All 40 pre-existing checks passed — no collateral.

**RED (e2e):** the new weak-password pin (under its own
`extraHTTPHeaders` XFF bucket) failed at the alert's absence — the native
validation bubble blocked submission, no inline alert ever rendered.

**GREEN:** the three slices landed. Full gate green: **lint · typecheck ·
117 unit (unchanged — the changes are route messages/statuses and input
attributes; the route layer is smoke+e2e covered per the repo's convention)
· build 20 routes · smoke 45/45 (+10) · e2e 129/129 (+1).**

## The live verification (dev server, post-fix)

- The weak-password sign-up renders the INLINE alert "Password must be at
  least 8 characters long" inside the form (the input computes
  `minLength: -1`; no native bubble).
- The exhaustion cadence renders exactly like the reference: "Invalid
  verification code. 4 attempts remaining." → 3 → 2 → 1 → "Too many failed
  attempts. Please request a new verification code." — and the CORRECT
  code at exhaustion renders the same locked message.
- The Resend recovery: a fresh code verifies and the session lands on the
  dashboard ("Good morning, live.verify.45 ✨" — the name derived from the
  email local-part, matching the reference's probe behavior).
- The clone's mobile nav re-verified at 390×844 (open/navigate/dismiss/
  Escape/focus-return/scroll-lock/tablet-hiding — all green).

## Delivery

- The standard 16 screenshots re-captured from the remediated dev server
  (every dimension verified — 1440×900, 390×844, 768×900; the signup shot
  re-captured after a hydration-race in the capture script was caught by
  the VLM content check) → `docs/screenshots/`; the audit provenance +
  verification set → `docs/screenshots/ref-audit-s46/` (the reference's
  mobile-dashboard + mobile-editor shots, the clone's weak-password-alert +
  verify-exhaustion-lock verification shots).
- `.env.example` verified unchanged (no new env vars — the exhaustion
  contract needs no configuration); included in the commit.
- Docs aligned: PAD v1.24.0 (the revision block + §6.3 + ADR-014's
  consequence amendment + the §7.1 counts), AGENTS.md (the auth bullet's
  exhaustion/lock/no-minLength contracts + the counts + the XFF budget
  note), CLAUDE.md (ditto + the pin inventory), README.md (the auth-flow
  row + the counts), digma_SKILL v1.23.0 (lesson **F32** — the
  client-side constraint that masks the server contract: measure the INPUT
  ATTRIBUTES; a status code is parity-relevant even when the UI renders
  identically; the coherent reading of a measured "please request a new
  code"; the XFF bucket technique for budget-busting test sections; the
  long-browser-session rate-limit accumulation ops catch), the plan's
  execution status, this log, and the worklog Task 47 entry.
- Full gate re-verified green before the commit; pushed to `main` via
  `docs/ssh_git_wrapper_v3.py` (the key shredded after).

## Suggested next steps

The reference's still-unaudited surfaces worth a twenty-second session: the
verify-email flow's SUCCESS path on the reference remains unmeasurable
(the code is email-only — confirmed this session at the response-body
level), but the reference's PASSWORD-RESET landing page (the reset email's
link target — a `/reset-password?token=…` surface the clone lacks
entirely) could be probed by requesting a reset for a probe account and
inspecting the emailed link's shape through the reference's own reset
endpoint; the team-invite accept flow (the reference's invitation emails'
link target) is the same class of probe; and a CLONE-side polish pass over
the present-mode overlay at mobile viewports (pure superset — the
reference's Present is dead) would round out the mobile surface.
