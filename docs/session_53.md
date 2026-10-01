# Session 53 — The Twenty-Third Parity Audit: The Present-Mode Mobile Exit
Polish (S47-1 + S47-2)

**Date:** 2026-10-01 · **Code state at start:** `e82206c` (session 46
delivered at `c231337`; the operator's `docs/session_52.md` transcript
push on top) · **Code state at end:** this commit · **Docs:** PAD v1.26.0 ·
digma_SKILL v1.25.0 (lesson F34)

## Directive

The operator's session-52 directive: refresh the workspace, re-internalize
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

## The audit (twenty-third consecutive)

**Baseline before any change:** the workspace refreshed (`git pull` —
`e82206c`, the operator's session-52 transcript), the fast gates green
(lint · typecheck · 117→121 unit — the count already at 121 from session
46), the dev server healthy with the `[db] DATABASE_URL ->
…/digma/db/custom.db` anchor, the DB seeded (1 user, 2 projects, 6
elements, 1 team, 3 members, no residual reset tokens), and the standing
configs verified (vitest + playwright wired with `skills/` excluded
everywhere — include patterns, tsconfig, eslint).

**The method:** the session-51 suggested next steps drove the target
selection — the auth-card EYE-TOGGLE family re-check, the Teams-page
Create-Team dead-chrome datum, and the clone-side Present-mode overlay
polish at mobile viewports. UI sweeps + attribute reads on the reference
(`agent-browser` + an IIFE-wrapped DOM probe — a bare `const` in an eval
persists in the page context and collides on re-run); no reference board
mutations; the only reference-side actions were the operator's own account
login + read-only probes.

### Reference findings (live-measured; desktop 1440×900, mobile 390×844)

- **The auth-card eye-toggle family (23rd datum: NONE).** Measured on all
  three auth cards — the sign-in card's password input
  (`type=password`, `minLength: -1`, placeholder `••••••••`, 6 buttons
  total: the three social, Sign in, Forgot password?, Need an account?),
  the sign-up card's password + confirmPassword inputs (both
  `minLength: -1`, placeholders "Min. 8 characters" / "Re-enter
  password", 2 buttons), and the reset-password form's New/Confirm inputs
  (both `minLength: -1`, placeholder `••••••••`): NO toggle button near
  ANY input, NO eye-shaped button anywhere on any card. **The clone ships
  none either — parity.** Documentation correction recorded:
  session-51's suggested-next-steps text called "the clone's eye toggle"
  a documented superset — inaccurate; the eye-toggle SUPERSET in the docs
  is the LAYERS-PANEL eye (the reference's no-op visibility toggle, S19)
  and the eye/zoom/bg-control family, never the auth cards.
- **The Teams-page Create-Team dead chrome (23rd datum): still dead.**
  Both buttons (the header "Create Team" and the empty-state "Create Your
  First Team") open ZERO dialogs — live-verified one click each
  (`[role=dialog]` count 0 after each). The clone's working Create-Team
  dialog stays the documented superset.
- **R3 re-confirmed (23rd): mobile nav failure class A at 390×844** — the
  reference's desktop nav computes `display: none`, its links collapse to
  0×0, and the only header button is the unlabeled 36px dead bell.
  Evidence: `docs/screenshots/ref-audit-s50/ref-01-mobile-dashboard-390.png`
  (VLM-verified: no hamburger, no bottom nav, bell + avatar only).
- **Standing surfaces re-verified (no drift):** the desktop nav flex with
  NO active pill at `/` (the exact-match contract — the purple-50 pill
  renders only on the current route's link, verified on `/Teams`), the
  greeting "Good morning, sepnetflix2023 ✨", Quick Stats, "Create New
  Design", the Recent sort default `last_accessed`, and the pristine
  "Test Project One" board.
- **The clone's mobile navigation verified LIVE, end-to-end at 390×844**
  (the operator's particular focus): the 44×44 hamburger with the stable
  aria contract (`aria-label="Navigation menu"` + `aria-expanded` +
  `aria-controls="mobile-nav-sheet"`); the Sheet opens as a dialog with
  the three links at 44px targets; `data-scroll-locked` engages on
  `<body>` with `overflow: hidden`; focus moves into the sheet; Escape
  closes with focus returning to the trigger AND the lock releasing; a
  link tap navigates AND dismisses; at 768 the hamburger computes
  `display: none` and the desktop nav `flex`. **The Tailwind v4 failure
  class A is NOT present in the clone — the 23rd consecutive session.**
  (Audit-method note: one probe iteration mis-read the lock —
  `offsetParent` is null for `position: fixed` elements, and
  `data-scroll-locked` lives on `<body>`, not `<html>`; the re-probe
  with visibility-based checks confirmed every contract green.)

### Clone findings

- **S47-1 (Medium — the session-51 suggested polish): the Present-mode
  overlay's exit affordance was desktop-keyboard-shaped at mobile
  viewports.** Live-measured at 390×844: the "Exit presentation (Esc)"
  button rendered at **161×34px — under the app's own 44px touch-target
  floor** (the mobile-nav hamburger and every Sheet link are 44px); the
  copy hardcoded "(Esc)" — a key that does not exist on a phone; the
  overlay engaged NO body scroll lock while presenting; and focus was
  neither moved into the dialog on open nor returned on exit. The overlay
  itself worked (Escape exits, the button click exits, the fit-to-viewport
  scale computes) — the gap was purely the mobile exit ergonomics + the
  dialog-management conventions. A pure superset surface (the reference's
  Present button is dead — 20+ confirmations).
- **S47-2 (Low — doc drift):** AGENTS.md's header referenced
  `src/middleware.ts` for the legacy-lowercase 307 redirects, but the
  code ships `src/proxy.ts` (the Next 16.3 `proxy` convention — renamed
  in session 12; CLAUDE.md and the PAD's ADR-008 already documented it
  correctly). `digma_SKILL.md`'s reuse-patterns line said "middleware"
  generically for the same redirect table.

## The remediation plan

`docs/remediation-plan-session47.md` — written and validated line-by-line
against the codebase before execution. Two slices: **A** (the Present
overlay's mobile exit affordance — the 44px floor, the device-coherent
copy, the body scroll lock, the focus move + return, aria-modal) and
**B** (the middleware→proxy doc drift).

## The TDD execution

**RED (e2e):** the new `tests/e2e/present-mode.spec.ts` (the established
pattern for overlay behavior — the mobile-nav suite pins the Sheet the
same way; no pure seam exists to unit-test and no API changed, so the
unit and smoke layers are untouched) ran **4 failures at their exact
assertions** against the pre-fix build — the 34px touch target, the
Esc-only accessible name at mobile, the absent body lock, and the absent
focus move — with the 2 guards passing (tap-to-exit, desktop Escape +
the ≥sm hint) and the setup project green.

**GREEN:** the two slices landed — `min-h-11` on the exit button (44px at
every viewport), the `(Esc)` hint in a `hidden sm:inline` span, the
mount-effect scroll lock (`data-scroll-locked="1"` + `overflow: hidden`
on `<body>`, cleaned up on unmount), the focus move (onto the exit
affordance) + return (to the Present trigger), and `aria-modal="true"`
beside the existing `role="dialog"` + `aria-label`.

**Full gate green: lint · typecheck · 121 unit (unchanged) · build 23
routes (unchanged) · smoke 56/56 (unchanged) · e2e 142/142 (+6).**

## The live verification (dev server, post-fix)

- At 390×844: the exit button renders 129×44 (the touch floor met), the
  hint span computes `display: none` (the accessible name "Exit
  presentation"), `aria-modal="true"`, the body lock engages, and focus
  lands on the exit button.
- At 1440×900: 161×44 with the "(Esc)" hint in the name, focus on the
  exit button.
- The button click exits (the touch path) and Escape exits (the keyboard
  path); the lock releases on both; focus returns to the Present trigger.
- **The ops catch (the documented environment trap's dev-server form):**
  the session's first dev-server restart inherited the workspace shell's
  exported `DATABASE_URL=file:/home/z/my-project/db/custom.db` (the
  parent `.env` — an absolute out-of-repo URL that db-path.ts passes
  through untouched), so the server opened a MISSING database and every
  API route 500'd. The `[db] DATABASE_URL -> …` startup log line caught
  it immediately; the restart with `unset DATABASE_URL && bun run dev`
  in the SAME command anchored correctly at `<repo>/db/custom.db`.
  AGENTS.md's trap paragraph now names the dev server as exposed, and
  lesson F34(d) records the corollary.

## Delivery

- The standard 18 screenshots re-captured (every dimension verified —
  1440×900, 390×844, 768×900; the editor shots navigated by direct URL,
  the session-46 lesson) + **19-present-mobile.png +
  20-present-desktop.png** (the new pair) + the ref-audit-s50 set
  (ref-01 the reference's mobile dashboard failure-class-A evidence,
  clone-01/clone-02 the fixed overlay at both viewports) — the key shots
  VLM content-checked.
- `.env.example` verified unchanged (no new env vars — the session's
  changes are Tailwind classes, focus/lock effects, and docs); included
  in the commit.
- Docs aligned: PAD v1.26.0 (the revision block + the header + the
  file-tree/key-files rows + the e2e table), AGENTS.md (the proxy.ts
  correction + the counts + the environment-trap scope extension),
  CLAUDE.md (the counts + the pin inventory), README.md (the
  Present-mode row + the counts), digma_SKILL v1.25.0 (lesson **F34** —
  a keyboard-only affordance on a touch surface is an exit trap; the
  dialog-convention checklist for every takeover overlay; the
  accessible-name vs textContent distinction for responsive copy; probe
  fixed-position visibility via getComputedStyle, never offsetParent),
  the plan's execution status, this log, and the repo worklog entry.
- Full gate re-verified green before the commit; pushed to `main` via
  `docs/ssh_git_wrapper_v3.py` (the key shredded after).

## Suggested next steps

The reference's standing surfaces are all pinned and drift-free — the
23rd audit found no reference-side gaps. For a twenty-fourth session,
the remaining candidates are clone-side quality: a11y sweeps of the
editor's keyboard map at mobile viewports (the tool shortcuts assume a
physical keyboard — a mobile shortcut cheat-sheet affordance would be a
pure superset); a performance pass over the canvas at high element
counts (the full-list replace contract's behavior beyond the seed's 6
elements — a stress probe, not a reference parity item); and the
Teams-page member-card avatar colors could use a final drift check
against the reference's palette (the last full sweep was session 37).
The mobile navigation itself needs nothing — 23 consecutive sessions
green.
