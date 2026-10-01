# Remediation Plan — Session 47 (the Twenty-Third Audit)

**Date:** 2026-10-01 · **Trigger:** the operator's session-52 directive (refresh, re-validate the codebase against the mandated docs, iterate to parity with `https://digma-371dfd0d.base44.app/`, pay particular attention to the mobile navigation menu, use TDD, capture screenshots, align docs, push via the SSH wrapper) · **Code state at start:** `e82206c` (session 46 delivered at `c231337` + the operator's `docs/session_52.md` transcript push)

## The audit method

The twenty-third consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
driven by the session-51 suggested next steps: the auth-card EYE-TOGGLE
family re-check, the Teams-page Create-Team dead-chrome datum, and the
clone-side Present-mode overlay polish at mobile viewports. The standing
sweeps ran as usual: R3 (the mobile nav failure class, 23rd), the desktop
drift check, and a full live verification of the CLONE's mobile navigation
at 390×844 (the operator's particular focus). No reference board
mutations; the only reference-side actions were the operator's own account
login + read-only probes.

## Reference findings (re-confirmations — no drift)

- **The auth-card eye-toggle family (23rd datum): NONE.** Live-measured
  on all three auth cards — the sign-in card's password input
  (`type=password`, `minLength: -1`, placeholder `••••••••`), the sign-up
  card's password + confirm inputs (both `minLength: -1`, no toggle), and
  the reset-password form's New/Confirm inputs (both `minLength: -1`, no
  toggle): NO toggle button near ANY input, NO eye-shaped button anywhere
  on any card. The clone ships none either — PARITY. (Session-51's
  suggested-next-steps text called the clone's auth-card eye toggle "a
  documented superset" — inaccurate: the eye-toggle SUPERSET in the docs
  is the LAYERS-PANEL eye (the reference's no-op visibility toggle) and
  the eye/zoom/bg-control family, never the auth cards. This session
  records the correction.)
- **The Teams-page Create-Team dead chrome (23rd datum): still dead.**
  Both buttons (the header "Create Team" and the empty-state "Create Your
  First Team") open ZERO dialogs — live-verified one click each. The
  clone's working Create-Team dialog stays the documented superset.
- **R3 re-confirmed (23rd): mobile nav failure class A at 390×844** — the
  reference's desktop nav computes `display: none`, its links collapse to
  0×0, and the only header button is the unlabeled 36px dead bell.
  Evidence: `docs/screenshots/ref-audit-s50/ref-01-mobile-dashboard-390.png`.
- **Standing surfaces re-verified (no drift):** the desktop nav flex with
  NO active pill at `/` (the exact-match contract; the pill renders only
  on the current route's link — verified on `/Teams`), the greeting "Good
  morning, sepnetflix2023 ✨", Quick Stats, "Create New Design", the
  Recent sort default `last_accessed`, and the pristine "Test Project
  One" board.

### The clone's mobile navigation verified LIVE, end-to-end at 390×844

(the operator's particular focus): the 44×44 hamburger with the stable
`aria-label="Navigation menu"` + `aria-expanded` + `aria-controls`
contract; the Sheet opens as a dialog with the three links at 44px
targets; `data-scroll-locked` engages on `<body>` with
`overflow: hidden`; focus moves into the sheet; Escape closes with focus
returning to the trigger AND the scroll lock releasing; a link tap
navigates AND dismisses; at 768 the hamburger computes `display: none`
and the desktop nav `flex`. **The Tailwind v4 failure class A is NOT
present in the clone — the 23rd consecutive session.** (Audit-method
note: one probe iteration mis-read the lock — `offsetParent` is null for
`position: fixed` elements, and `data-scroll-locked` lives on `<body>`,
not `<html>`; the re-probe with visibility-based checks confirmed every
contract green.)

## Clone findings (the gaps)

- **S47-1 (Medium — the session-51 suggested polish): the Present-mode
  overlay's exit affordance is desktop-keyboard-shaped at mobile
  viewports.** Live-measured at 390×844: the "Exit presentation (Esc)"
  button renders at **161×34px — UNDER the app's own 44px touch-target
  floor** (the mobile-nav hamburger and every Sheet link are 44px); the
  copy hardcodes "(Esc)" — a key that does not exist on a phone, making
  the label incoherent on the device that needs the button most; the
  overlay engages NO body scroll lock while presenting (the Sheet's
  `data-scroll-locked` + `overflow:hidden` convention exists but is not
  applied); and focus is NOT moved into the dialog on open (keyboard and
  screen-reader users stay on the Present trigger behind the overlay) or
  returned on exit. The overlay itself works — Escape exits, the button
  click exits, the fit-to-viewport scale computes — the gap is purely the
  mobile exit ergonomics + the dialog-management conventions. A pure
  superset surface (the reference's Present button is dead — 20+
  confirmations).
- **S47-2 (Low — doc drift): AGENTS.md's header references
  `src/middleware.ts`** for the legacy-lowercase 307 redirects, but the
  code ships `src/proxy.ts` (the Next 16.3 `proxy` convention — renamed
  in session 12; CLAUDE.md and the PAD's ADR-008 already document it
  correctly). `digma_SKILL.md`'s reuse-patterns line says "middleware"
  generically for the same redirect table.

### Documented deviations (recorded for the ledger)

- The Present overlay itself remains a WORKING SUPERSET (the reference's
  Present is dead chrome); this session polishes the superset's mobile
  ergonomics — no reference parity data exists for any of it.
- The responsive Esc hint (`hidden sm:inline`) is the clone's own
  device-coherent copy decision: phones (<640px) show "Exit
  presentation"; ≥640px viewports show "Exit presentation (Esc)". No
  reference contract involved.

## The remediation slices

### Slice A — the Present overlay's mobile exit affordance (S47-1)

`src/components/editor/editor-view.tsx` → `PresentOverlay`:

1. **The 44px touch floor:** the exit button's `px-4 py-2` → `min-h-11
   px-4` — 44px tall at every viewport (the mobile-nav convention).
2. **Device-coherent copy:** `Exit presentation (Esc)` → `Exit
   presentation` + `<span className="hidden sm:inline"> (Esc)</span>` —
   the accessible name drops the keyboard-only hint below sm.
3. **The body scroll lock:** a mount effect sets
   `data-scroll-locked="1"` + `overflow: hidden` on `<body>` (the
   react-remove-scroll convention the Sheet already pins); the cleanup
   removes both. Presenting and the workspace Sheet can never co-open
   (different routes), so no lock-owner conflict.
4. **Focus move + return:** a mount effect captures
   `document.activeElement` (the Present trigger), focuses the exit
   button, and the cleanup restores focus to the captured element — the
   Sheet's focus contract.
5. `aria-modal="true"` on the overlay (it already carries
   `role="dialog"` + `aria-label`) — the single-button dialog's correct
   semantics.

### Slice B — the doc drift (S47-2)

- `AGENTS.md` header: `src/middleware.ts` → `src/proxy.ts` (the Next
  16.3 `proxy` convention — with the historical note that session 12
  performed the rename).
- `digma_SKILL.md` reuse-patterns: "Exact-match `Record` lookups in
  middleware" → "…in `proxy.ts` (the Next 16.3 middleware convention)".

## The TDD plan

- **E2E (RED first): a new `tests/e2e/present-mode.spec.ts`** (the
  established pattern for overlay behavior — the mobile-nav suite pins
  the Sheet the same way; no pure seam exists to unit-test, and no API
  changes, so the smoke suite is untouched):
  - Mobile describe (390×844, hasTouch): the exit affordance is a
    ≥44px touch target (RED — currently 34); the accessible name drops
    the Esc hint below sm (RED — currently "(Esc)" always); tapping the
    exit button exits the overlay (guard — the control pin); the body
    scroll lock engages while presenting and releases on exit (RED);
    focus moves into the overlay on open and returns to the Present
    trigger on exit (RED).
  - Desktop describe (1280×800): Escape still exits AND the (Esc) hint
    renders at ≥sm (guard — the responsive-copy pin).
  - Six pins total → **142 e2e** (136 + 6).
- **GREEN:** Slice A lands; the RED pins flip; the full gate re-verified
  (`lint → typecheck → unit (121) → build → smoke (56, dev server
  stopped) → e2e (142)`).

## Execution status

- [x] Slice A — the Present overlay's mobile exit affordance (44px floor, coherent copy, scroll lock, focus move + return, aria-modal)
- [x] Slice B — the AGENTS.md + digma_SKILL.md middleware→proxy drift
- [x] E2E spec (+6 pins → 142) — RED (4 failing at the exact assertions: the 34px target, the Esc-only name, the absent lock, the absent focus move; the 2 guards passing) then GREEN
- [x] Full gate green — lint · typecheck · 121 unit · build 23 routes · 56 smoke · 142 e2e
- [x] Live verification + screenshots (the ref-audit-s50 provenance set + the standard set re-captured + the new present-mode shots) + docs aligned (PAD v1.26.0, AGENTS, CLAUDE, README, digma_SKILL v1.25.0 lesson F34, session_53.md, worklog)

Ops catch en route (the documented environment trap's dev-server form): the session's
dev-server restart inherited the workspace shell's exported out-of-repo
`DATABASE_URL` (the parent `.env`) and every API route 500'd against a MISSING
database — caught by the `[db] DATABASE_URL -> …` startup line, fixed by the
`unset DATABASE_URL && bun run dev` same-command restart. AGENTS.md's trap
paragraph and lesson F34(d) now name the dev server as exposed too.
