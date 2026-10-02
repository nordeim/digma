# Remediation Plan — Session 55 (the Thirty-First Audit)

**Date:** 2026-10-02 · **Trigger:** the operator's session-67/68 directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and the Tailwind v4 bug class, use the scandihaven tech-stack patterns, TDD, vitest + playwright, `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, screenshots under `docs/screenshots/`, a verified `.env.example`, aligned docs, push via the SSH wrapper to `main` only) · **Code state at start:** `e7a8b62` (session 54 delivered at `6dde036` + the operator's session-log push)

## The audit method

The thirty-first consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
PLUS the third systematic **Mode C code audit of the recent changes**
(the session-54 delivery: the `downloadSvg` seam, the
`triggerBlobDownload` single-source extraction, the DropdownMenu format
surface, the three SheetDescription sites) run across the review
dimensions — correctness, data integrity, error handling,
maintainability, consistency — with the `skills/` catalog's
code-review-checklist as the tactical scan. No reference board
mutations; the only reference-side actions were the operator's own
account login + read-only probes (+ two clicks on the reference's own
dead Create-Team buttons).

## Reference findings (31st audit — no drift, no new gaps)

- **R3 re-confirmed (31st): mobile nav failure class A at 390×844** —
  the reference's desktop nav computes `display: none`, its three links
  collapse to 0×0 (measured: all three at w0/h0), no hamburger exists,
  and the only header button is the unlabeled 36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s65/ref-01-mobile-dashboard-390.png`.
- **The Teams Create-Team dead chrome (31st datum): still dead.** Both
  buttons open ZERO dialogs (live-verified one click each; the
  `[role=dialog]` count stayed 0 after both). The Teams page still
  renders its EMPTY state.
- **Standing surfaces re-verified (no drift):** the greeting reads
  "Good morning, sepnetflix2023 ✨" (the name still populated — the
  bucket is time-of-day: morning at the audit hour vs evening in the
  prior sessions, the same populated-name contract); Quick Stats
  1 Projects / 0 Teams / 1 Active this week / Pro; the Recent sort
  default "Last Opened".
- **The board still carries 9 layers** (Rectangle 1-4, Line 5-6,
  Circle 7, Text 8, Frame 1 — Frame 1 / Text 8 live in the layer tree)
  — the project remains "Test Project One". Evidence:
  `docs/screenshots/ref-audit-s65/ref-03-desktop-editor-1440.png`.
- **The reference's editor carries NO keyboard-shortcut affordance
  (31st datum):** zero `kbd` elements, no keyboard chip.
- **The reference's mobile editor header STILL clips Share/Present at
  390×844:** re-measured Share L385–R458, Present L466–R551 — the same
  failure class as sessions 48–54. Evidence:
  `docs/screenshots/ref-audit-s65/ref-02-mobile-editor-header-390.png`.
- **The mobile chip-bar datum re-confirmed:** the only inputs at mobile
  are the AI chat input + the clipped Canvas-Properties pair — zero
  usable text-content inputs at mobile.

### The clone's mobile navigation verified LIVE, end-to-end at 390×844

(the operator's particular focus): the 44×44 hamburger (L16, T10) with
the stable `aria-label="Navigation menu"` + `aria-expanded`/
`aria-controls` contract; the Sheet opens as a `role=dialog` (288px
drawer) with the three links at 44px targets; `data-scroll-locked`
engages on `<body>`; focus lands inside the Sheet; Escape closes with
focus returning to the trigger AND the lock releasing; a link tap
navigates AND dismisses (verified onto /Teams with the exact-match pill
active); at 768 the hamburger computes `display: none` and the desktop
nav `flex` with visible links (121/95/92 × 36 — mirroring the
reference's own 124/96/92 × 36). **The Tailwind v4 failure class A is
NOT present in the clone — the 31st consecutive session.**

## The code audit findings (Mode C — third pass, the session-54 delivery)

Clean against every documented contract: the `downloadSvg` seam
prepends the `<?xml encoding="UTF-8"?>` declaration at the download
seam while `elementsToSvg` stays pure; `triggerBlobDownload` is the
ONE anchor-dance copy with exactly two consumers (`downloadPng` +
`downloadSvg`, the 5s revoke grace); the format menu carries the
honest "Download" label (F39) with both items degrading to toasts; the
three SheetDescription sites render sr-only purpose text with Radix
wiring the `aria-describedby`. **0 Critical / 0 High / 0 Medium / 0
new Low — the second consecutive session opening with zero new
actionable findings.**

## The findings inventory (the authoritative backlog)

- **F-3 (Low — actionable THIS session):** `PresentOverlay`'s
  mount-time `compute()` runs in a PASSIVE effect body — the
  synchronous `setScale` commits a second render after mount, and the
  first painted frame can flash at `scale(1)` before the viewport fit
  lands.
- **F-4 edge 2 (Low — actionable THIS session):** both mobile editor
  Sheets' portals render at `document.body` — the `lg:hidden` chip
  vanishes at the boundary but an OPEN Sheet survives the crossing,
  floating over the desktop editor where the desktop properties
  panel / canvas panel is the sanctioned surface.
- **F-4 edge 1 (Low — RE-DEFERRED with rationale):** the abrupt
  unmount on selection-vanish — the exit animation never runs because
  the null-guard unmounts the Sheet subtree in the same committed
  render as the render-time close. The fix demands an
  animation-completion presence machine (an exit-window state + an
  `onAnimationEnd` clear + a reduced-motion fallback timer + a
  re-selection reset) — fragile lifecycle state for a rare-path
  300ms aesthetic gain (the modal scrim already makes the
  vanishing-while-open path rare). The repo's no-over-engineering
  anti-pattern (digma_SKILL §9) outweighs the polish; documented as
  the standing decision.
- **F-6 / F-7 (Info — standing, no change warranted):** the Opacity
  section/slider name collision (the test-side disambiguation exists)
  and the H `NumberField` `min={0}` clamp nuance — no user-visible
  defect.
- **F-8 (Info — RESOLVED):** the historical tracked placeholder
  `.env` — verified NOT tracked now (`git ls-files` shows only
  `.env.example`; the working `.env` is gitignored).

## The chosen session work (TDD)

### S55-A — PresentOverlay measures before paint (F-3)

- The mount-time `compute()` + its resize subscription move from the
  passive `React.useEffect` to **`React.useLayoutEffect`** — React's
  sanctioned measure-before-paint hook: the layout-phase `setState`
  re-renders synchronously BEFORE the browser paints, so the first
  painted frame carries the fitted scale and the redundant mount
  render never becomes a visible artifact. (The listener registration
  in a layout effect is inert timing-wise; the setState-before-paint
  is the contract.)
- **Unit pin (source contract — the canvas-memo / sheet-descriptions
  pattern):** `tests/present-overlay.test.ts` — the overlay's fit
  effect is a `useLayoutEffect` whose body calls `compute()`
  (the `setScale` path); no passive mount-time compute remains.

### S55-B — the mobile Sheets close on the lg crossing (F-4 edge 2)

- Both `MobilePropertiesEditor` and `MobileCanvasProperties` gain a
  `matchMedia("(min-width: 1024px)")` change listener that closes the
  Sheet when the viewport reaches the desktop surface — the
  app-header bell's outside-pointerdown pattern (setState ONLY in the
  event callback, never the effect body; the listener registered only
  while `open`).
- **Unit pin:** `tests/sheet-lifecycle.test.ts` — exactly two
  `matchMedia("(min-width: 1024px)")` listeners in `editor-view.tsx`,
  one per Sheet component, each inside an effect guarded by `open`.
- **E2e pins:** the element Sheet + the canvas Sheet each get an
  lg-crossing test — open at 390×844, `setViewportSize(1280, 800)`,
  assert the dialog unmounts (and the desktop panel is the surface —
  extending the existing "at lg the chip is ABSENT" contract to the
  OPEN sheet).

### Planned counts

unit 180 + 4 = 184 (2 present-overlay + 2 sheet-lifecycle); e2e
175 + 2 = 177; smoke 56; build 23 routes.

## RED expectations

- **unit:** the source-contract specs fail at the absent
  `useLayoutEffect` (the overlay's fit effect is still passive) and
  the absent `matchMedia` listeners.
- **e2e:** against the pre-fix standalone build the two crossing
  tests fail at exactly the dialog-still-mounted assertion (the Sheet
  survives the crossing — the defect reproduced live).

## Execution order

1. S55-A unit RED → the `useLayoutEffect` seam → unit GREEN + fast
   gates (lint, typecheck).
2. S55-B unit RED → the two `matchMedia` listeners → GREEN.
3. E2E RED against the pre-fix build (the current standalone output
   predates the src changes) → rebuild with the new code → e2e GREEN.
4. Full gate: `lint → typecheck → test → build → smoke (dev server
   stopped, `unset DATABASE_URL` same-command) → test:e2e`.
5. Live verification on the dev server (the Sheets close on a live
   viewport crossing; the present overlay's first painted frame; the
   mobile nav re-verified) + the screenshot set (the standard 30 +
   the 31/32 export-toast pair + the ref-audit-s65 provenance set).
6. Docs: PAD v1.34.0, digma_SKILL v1.33.0, AGENTS/CLAUDE/README rows +
   counts, this plan's execution status, the session log
   (docs/session_69.md), the repo worklog entry.

## Execution status

- [x] S55-A — the PresentOverlay measure-before-paint seam (unit RED 2/2 at the absent useLayoutEffect seam — with one en-route test-bug fix: the pin's char-class regex tripped on the destructuring braces, corrected to the non-greedy dot-all form targeting the compute() CALL — then GREEN; the live overlay renders fitted at scale(0.39)=390/1000 with Escape exit + lock release)
- [x] S55-B — the Sheets' lg-crossing close (unit RED 3/3 at the absent matchMedia listeners — count 0 — then GREEN; e2e RED honestly reproduced 2/2 against the pre-fix standalone build at exactly the dialog-still-mounted assertion — the defect live — then GREEN after the rebuild; live-verified: both Sheets close on the 390-to-1280 crossing with lock release and the desktop panel the surface)
- [x] Full gate green — lint · typecheck · 185 unit (+5) · build 23 routes · 56 smoke · 177 e2e (+2) — zero regressions
- [x] Live verification + screenshots (the standard 32 re-captured on the S55 code + the ref-audit-s65 evidence set ref-00/01/02/03 + clone-01/04/05/06 — 47/47 dimension-checked, the key shots VLM content-verified all PASS; en-route lesson F42: the accessible-name no-separator trap + the evidence-shot state-verification rule — shots 14/15 and clone-01 re-captured; the DB re-seeded to the pristine contract)
- [x] Docs aligned (PAD v1.34.0 — the header + the revision block; digma_SKILL v1.33.0 — lesson F42 + the project_state counts; AGENTS/CLAUDE/README counts + the session-55 rows; this plan's execution status; docs/session_69.md; the repo worklog entry)
