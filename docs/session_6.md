# Session 6 — Auth-Card State Parity + Search-Input Alignment

**Session date:** 2026-09-27 · **Base:** `2951a4f` (session 4's remediation delivered at `1c375a9`; `2951a4f` added `docs/session_5.md`)
**Focus:** fresh live-app audit of the remaining surfaces (auth card states, Recent/Teams, zoom, canvas events) → remediation of the auth-card state divergence (ADR-013) and minor search-input styling drift.

> This session restarted once: the first half (workspace refresh, docs review, baseline gates, and the start of the audit) was interrupted by a main-session tool-infrastructure failure; progress was preserved in `worklog.md` (Task ID 23) and the audit resumed from the zoom-pill comparison.

## 1. Workspace refresh & docs review

- Workspace had been reset → re-cloned `https://github.com/nordeim/digma.git` at HEAD `2951a4f` (clean, in sync).
- Re-read `AGENTS.md`, `CLAUDE.md`, `README.md`, `Project_Architecture_Document.md` (v1.3.0), `digma_SKILL.md` (v1.2.0), `docs/session_4.md`, `docs/session_5.md`, `worklog.md` (Task IDs 1–22) — then validated against the codebase: capitalized routes + middleware, `.env` `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root (pushed + seeded), `.env.example` matching, `vitest.config.ts`/`playwright.config.ts`/`eslint.config.mjs`/`tsconfig.json` all excluding `skills/`, `bun.lock` as the sole lockfile.
- Baseline fast gates: lint ✅ · typecheck ✅ · 62/62 unit ✅ · dev server healthy (`unset DATABASE_URL` discipline).

## 2. Fresh live-app parity audit

What still holds:

- **Mobile nav: the reference is STILL broken** — at 390×844 the nav is `hidden md:flex` → `display: none`, no hamburger, only the bell visible (Tailwind v4 class-A failure). The clone's hamburger + Sheet drawer re-verified working end-to-end (44×44 trigger, drawer links, `data-scroll-locked`, Escape close).
- Dashboard (headers, hero, Quick Stats, Continue Working, All Projects subtitles), Recent (headings, subtitle, sort combobox, "N files found"), Teams (heading + empty-state text), editor zoom pill (exact DOM classes), AI assistant panel (greeting, placeholder, suggestions), Untitled editor, toolbar (9 tools), layer auto-naming ("Rectangle 1") — all parity-holds.
- **The reference's Teams "Create Team" buttons are no-ops** (no dialog, no error — both the header and empty-state buttons). The clone's working create flow is the documented superset. Same for the header search (no-op on the reference; the clone's filters via `/Recent?search=`).

New findings (this session's gaps):

- **The auth card RESTRUCTURES per mode** — the reference's `/login` renders the branded card (logo chip + 3 social buttons + "or" divider + h1 "Welcome to Digma" + bottom toggles) ONLY in sign-in mode. Sign-up swaps to a minimal card: "Back to sign in" back-link + h2 "Create your account" (no subtitle) + Email + Password (`placeholder="Min. 8 characters"`) + **Confirm Password** (`placeholder="Re-enter password"`) + "Create account", with inline **"Passwords do not match"** validation on mismatch (`text-red-700 text-sm` alert) and NO name field, NO logo, NO social buttons. Forgot renders the same minimal shell with h2 "Reset your password" + "Enter your email and we'll send you a link to reset your password" + email-only + "Send reset link". The v1.3.0 clone kept the full branded card and its own Name field in every mode — the sign-up/forgot states had never been audited.
- **Search-input styling drift:** the reference's file searches are `h-9` `rounded-md` (icon at `left-3`/`pl-9`; Recent wrapper `md:w-80`, dashboard `lg:w-64`) — the clone had `h-10`/`rounded-lg` and `lg:w-64` on Recent.
- Methodology note: synthetic CDP mouse events (agent-browser) do NOT trigger React pointer handlers on either app — draw flows stay pinned by Playwright's native `page.mouse` API (`tests/e2e/untitled-editor.spec.ts`).

## 3. Remediation (TDD)

**R1 — Auth-card state parity (ADR-013).** Red first: 5 new e2e checks in `tests/e2e/auth.spec.ts` (minimal signup card incl. no-logo/no-social, Confirm Password + placeholders + no-Name, inline mismatch validation without navigation, back-link round-trip, forgot state with email-only + the reset toast) — verified 5 failed / 7 passed. Green: `login-screen.tsx` now derives `minimal = mode !== "signin"`: the branded block renders only in sign-in; sign-up/forgot render the back-link (arrow-left icon, measured classes) + h2 shell. Sign-up adds the Confirm Password input with a client-side equality guard (mismatch → `role="alert"` red inline error, submission blocked) and the reference's password placeholder; the Name field is gone (the register payload derives the name from the email local-part — the API already had that fallback). The bottom toggles render only in sign-in mode. Two spec-locator bugs fixed during red→green (`getByLabel("Password", { exact: true })` for the two password fields; the forgot toast assertion needed the required email filled first). **12/12 auth checks green.**

**R2 — Search-input alignment.** Recent search: wrapper `md:w-80`, input `h-9 rounded-md pl-9 pr-3 shadow-sm` (icon stays at `left-3`); dashboard search aligned to `rounded-md`/`pr-3`.

**R3 — e2e pins.** The 5 new auth-card checks are the regression pin (suite total 39 → 44).

## 4. Gate & verification

- lint ✅ · typecheck ✅ · **62/62 unit** ✅ · build ✅ · **28/28 smoke** ✅ · **44/44 e2e** ✅
- Smoke suite run with the dev server stopped (the documented port trap).
- Browser verification: signup/forgot DOM text matches the reference structure exactly; mismatch error renders and blocks; back-link round-trips; **16 screenshots** captured under `docs/screenshots/` (13 refreshed + new `14-signup.png`, `15-signup-validation.png`, `16-forgot.png`).

## 5. Docs realignment

README (auth feature row + auth gallery + 44 count + e2e description), PAD v1.4.0 (revision block, **ADR-013**, test distribution, file tree, key files), AGENTS.md (auth-card fact + counts), CLAUDE.md (pyramid + counts), digma_SKILL.md v1.3.0 (project state, counts, §9 anti-pattern #21, component inventory), this session log, worklog.

## 6. Remaining scope cuts (documented, not blockers)

Gradient/Image fills stay non-functional (the reference's own pills are no-ops); per-corner radii stay linked; rotation-aware bounds stay out (the reference doesn't do them either); `image`/`path` element types stay vocabulary-only; the forgot flow toasts instead of sending mail (no mail transport in a self-hosted clone); no session revocation / no hosted CI. The reference's own no-ops (Share/Present, header search, Create Team, the AI crash) remain deliberately not cloned — the clone's working versions are the documented supersets.
