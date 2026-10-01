# Remediation Plan — Session 53 (the Twenty-Ninth Audit)

**Date:** 2026-10-02 · **Trigger:** the operator's session-63/64 directive (refresh, re-validate the codebase against the mandated docs, audit the recent changes with the repo skills, iterate to parity with `https://digma-371dfd0d.base44.app/`, pay particular attention to the mobile navigation menu watching for the Tailwind v4 bug class, use TDD, capture screenshots, align docs, push via the SSH wrapper) · **Code state at start:** `9eb1ba1` (session 52 delivered at `1e33cb6` + the operator's session-log pushes)

## The audit method

The twenty-ninth consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
PLUS this session's own addition: a systematic **Mode C code audit of the
recent changes** (the session-52 shared-section architecture, the
session-51 export seams, the standing mobile-nav contract) run across the
review dimensions — correctness, data integrity, error handling,
maintainability, consistency, dependency health — with findings classified
by severity and each fix driven TDD. No reference board mutations; the only
reference-side actions were the operator's own account login + read-only
probes (+ two clicks on the reference's own dead Create-Team buttons).

## Reference findings (29th audit — no drift, no new gaps)

- **R3 re-confirmed (29th): mobile nav failure class A at 390×844** — the
  reference's desktop nav computes `display: none`, its three links
  collapse to 0×0, no hamburger exists, and the only header button is the
  unlabeled 36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s62/ref-01-mobile-dashboard-390.png`.
- **The Teams Create-Team dead chrome (29th datum): still dead.** Both
  buttons open ZERO dialogs (live-verified one click each;
  `[role=dialog]` count 0 after both). The Teams page still renders its
  EMPTY state ("No teams yet").
- **Standing surfaces re-verified (no drift):** the greeting reads
  "Good evening, sepnetflix2023 ✨" (the name still populated; the
  time-of-day bucket moves with the clock); Quick Stats 1 Projects /
  0 Teams / 1 Active this week / Pro; the Recent sort default "Last
  Opened" with its Date Created / Name options; "1 file found".
- **The board still carries 9 layers** (Rectangle 1-4, Line 5-6, Circle 7,
  Text 8, Frame 1) — the project remains "Test Project One" (the owner's
  own rename; the layer stack unchanged — a data note, not a chrome
  drift).
- **The reference's editor carries NO keyboard-shortcut affordance
  (29th datum):** the nine tool titles without shortcut text, zero `kbd`
  elements, no dialog.
- **The reference's mobile editor header STILL clips Share/Present at
  390×844:** re-measured Share L394–R467, Present L475–R559 — the same
  failure class as sessions 48–52 (both fully off-screen). Evidence:
  `docs/screenshots/ref-audit-s62/ref-02-mobile-editor-header-390.png`.
- **The session-51/52 mobile chip-bar datum re-confirmed:** the bottom
  chip bar renders at 390 (Layers/Components/Properties at **24px**
  targets) and the only inputs at mobile are the AI chat input + the
  background-color picker pair — zero text-content inputs, **no USABLE
  properties surface at mobile** (the reference's own background-color
  pair lives in a clipped ~126px Canvas-Properties sliver — the datum
  that motivates S53-C below).

### The clone's mobile navigation verified LIVE, end-to-end at 390×844

(the operator's particular focus): the 44×44 hamburger with the stable
`aria-label="Navigation menu"` + `aria-expanded`/`aria-controls` contract;
the Sheet opens as a dialog with the three links at 44px targets;
`data-scroll-locked` engages on `<body>` with `overflow: hidden`; focus
lands inside the Sheet (the trap); Escape closes with focus returning to
the trigger AND the lock releasing; a link tap navigates AND dismisses; at
768 the hamburger computes `display: none` and the desktop nav `flex` with
visible links (and the inverse at 390). **The Tailwind v4 failure class A
is NOT present in the clone — the 29th consecutive session.**

The session-52 mobile properties surface also re-verified live: the
Edit-properties chip 44×44 in-viewport at [330,464] for the selected CTA
Button; the rectangle Sheet's five sections (Position and size, Corner
radius, Fill and stroke, Transform, Opacity — no TEXT); the text Sheet's
four sections; at 1440 the chip wrapper `display: none` with the panel's
sections the surface.

## The code audit findings (Mode C — the session's own code-level audit)

The systematic review of the recent changes (properties-panel.tsx,
editor-view.tsx, the three test files, export-png.ts, app-header.tsx,
the standing configs) found the session-52 delivery clean against every
documented contract (exports, gates, order, both consumers, honest chip
label, stable selector identity, the render-time compare-and-adjust, the
fixture discipline — all verified). The findings:

- **F-1 (Medium, Verified): the `Number("")===0` empty-draft trap on the
  three RAW number inputs.** `NumberField` implements the session-21
  S21-2 guard (an empty draft never commits), but the Rotation value
  (`TransformSection`), the Opacity value (`OpacitySection`), and the
  gradient stop positions (`GradientPanel`) are raw
  `<input type="number">` with `Number(event.target.value) || 0`
  commit-on-keystroke handlers — clearing the field (or typing a partial
  prefix like `-`) commits **0 immediately**: clearing Opacity commits
  `opacity: 0` and the element vanishes mid-edit (an autosave-persisted,
  undo-recoverable-but-jarring mutation), clearing Rotation teleports to
  0deg, clearing a stop commits 0%. The controlled input then snaps to
  the committed value, destroying the in-progress edit. Pre-existing —
  but the session-52 shared-section migration carried the trap onto the
  MOBILE Sheet, where a thumb clearing a field now vanishes the element.
  Range sliders are exempt (browsers clamp range values; no empty-draft
  state exists).
- **F-2 (Medium, Verified): `export-png.ts` image fills emit the parent
  shape with NO `fill` attribute** — SVG's initial fill (black) paints
  behind letterboxed (`contain`/`auto` → `xMidYMid meet`) and transparent
  images, where the DOM paint chain leaves the area transparent. Default
  `cover`/`stretch` fully cover the shape and hide the bug. One-line fix:
  the image branch returns `fill="none"`.
- **F-3 (Low, pre-existing, deferred): `PresentOverlay`'s mount/resize
  effect calls `setScale` synchronously in the effect body** (session 47;
  the sanctioned-pattern list exempts it from lint, one redundant render
  on mount, no user-visible defect — documented, not touched).
- **F-4 (Low, deferred): Sheet lifecycle edges** — an abrupt unmount when
  the selection vanishes while the Sheet is open (exit animation + focus
  return skipped) and the portaled content surviving an lg crossing.
  Rare, keyboard-guarded already (the shortcut handler stands down while
  a dialog is open); documented for a future polish pass.
- **F-5..F-8 (Informational, deferred): missing `aria-describedby` on the
  Sheets (Radix dev warning), the Opacity section/slider name collision
  (the F39 test-side disambiguation exists; the runtime name stays),
  the H `NumberField` `min={0}` for non-line types (spinner-only edge),
  and the historical tracked placeholder `.env` (no secrets ever entered
  history — verified).**

## The chosen session work

Three slices, each TDD: the two audit-driven correctness fixes (F-1,
F-2) + the session-63 suggestion #3 (the mobile Canvas Properties
surface — completing the mobile surface family). The reference's own
mobile editor carries its background-color pair only in a clipped sliver
(re-confirmed above), so the working Sheet stays the superior superset in
the documented mobile-editor improvement family (ADR-010, F34, F37).

### S53-A — the empty-draft guard completion (F-1, correctness)

A new internal `GuardedNumberInput` in `properties-panel.tsx`: the
`NumberField` S21-2 contract (a DRAFT state + the render-time
compare-and-adjust when the external value changes + the never-commit-
an-empty-draft `onChange` + the blur-restores-abandoned-draft `onBlur`)
in the INLINE chrome the reference measured for the value inputs (no
label wrapper — the input lives inside a flex row with a suffix; the
className arrives per site). The three sites route through it with their
clamps moving to the call site (the component commits the parsed number;
the consumer clamps):

- Rotation value: `update({ rotation: clamp(-180..180) })`, chrome
  `h-8 w-16 …px-3 py-1`, aria-label "Rotation value" (unchanged — the
  existing e2e locators keep resolving).
- Opacity value: `update({ opacity: clamp(0..100) / 100 })`, the same
  chrome, aria-label "Opacity value".
- Gradient stop position: `setStop(index, { position: clamp(0..100) })`,
  chrome `h-6 flex-1 …px-3`, aria-label `Stop {n} position`.

### S53-B — the SVG image fill (F-2, correctness)

`paintFor`'s image branch returns `attrs: 'fill="none"'` — the parent
shape paints nothing, the `<image>` child renders on top, and
letterboxed/transparent areas stay transparent exactly like the DOM.

### S53-C — the mobile Canvas Properties surface (the mobile family completion)

- **S53-C1 (the shared seam):** the panel's no-selection branch extracts
  into an exported `CanvasBackgroundSection({ backgroundColor, onChange })`
  (the `TextSection`/`PropertiesSections` pattern) — the section wrapper
  with its measured chrome (`aria-label="Background color"`, the
  uppercase `Background Color` heading, the `HexColorRow`). The desktop
  panel's branch becomes the one-liner consumption — a pure refactor,
  pixel-identical markup. The multi-selection branch stays panel-local.
- **S53-C2 (the mobile surface):** a `MobileCanvasProperties` component
  in `editor-view.tsx` — the Edit-properties chip's bottom-right
  counterpart rendering when NO element is selected (below `lg`,
  `lg:hidden`, the 44px F34 floor, the same dark bottom Sheet family).
  The chip carries an honest label (F39): `aria-label="Edit canvas
  properties"` with the `Palette` metaphor; the SheetTitle reads "Canvas
  properties"; the body renders the SAME `CanvasBackgroundSection` through
  the store's `setBackgroundColor` (the session-33 persistence path —
  the autosave PUT carries `backgroundColor` — flows unchanged). The
  render-time compare-and-adjust closes the Sheet when a selection
  appears; the zustand selector subscribes to `selectedIds.length === 0`
  and `backgroundColor` only (the shell stays free of element
  subscriptions).

## The test suites

- **Unit (source-contract + pure seams):** `tests/properties-sections.test.ts`
  extended (or a sibling spec) asserting the `GuardedNumberInput` seam —
  the component exists with the guard clauses (the empty-draft return +
  the `Number.isFinite` gate + the blur restore), and the THREE
  consumption sites route through it (no bare
  `Number(event.target.value) || 0` remains in the file); the
  `CanvasBackgroundSection` export + its two consumers + the honest chip
  label + the no-duplication markers. `src/lib/export-png.test.ts`
  extended with the image-fill `fill="none"` assertion (the rect AND the
  ellipse cases).
- **E2E (`tests/e2e/mobile-properties.spec.ts` extended on the
  self-contained fixture):** the empty-draft regression pin (clear the
  Opacity value input → the canvas element's opacity UNCHANGED — the
  element stays fully visible; then a real value commits — the RED
  failure pre-fix is the vanishing element); the canvas chip geometry at
  390×844 (in-viewport, ≥44px, rendered when nothing is selected); the
  canvas Sheet carries the Background color section; a background-color
  edit round-trip painting the canvas + persisting through reload; the
  chip absent while an element IS selected (the mutual-exclusion guard);
  the Sheet dialog contract (scroll lock, Escape, focus return); the lg
  boundary (at 1280 no chip — the panel is the surface).

**RED expectations:** unit — the new source-contract checks fail at the
absent `GuardedNumberInput`/`CanvasBackgroundSection` seams and the
un-guarded call sites; the export assertion fails at the missing
`fill="none"`. e2e — the empty-draft pin fails against the pre-fix build
(clearing Opacity commits 0); every `Edit canvas properties` locator
fails (the chip absent pre-fix).

## Execution order

1. S53-A unit RED (the source-contract spec) → the `GuardedNumberInput`
   + the three site migrations → unit GREEN.
2. S53-B unit RED (the export assertion) → the one-line fix → GREEN.
3. S53-C unit RED → the `CanvasBackgroundSection` seam + the panel
   consumption → the `MobileCanvasProperties` surface → GREEN + fast
   gates (lint, typecheck).
4. E2E RED against the pre-fix build → rebuild with the new code →
   e2e GREEN.
5. Full gate: `lint → typecheck → test → build → smoke (dev server
   stopped, `unset DATABASE_URL` same-command) → test:e2e`.
6. Live verification on the dev server (the three guarded inputs at
   mobile + desktop, the canvas chip + Sheet + the round-trip, the
   mobile nav re-verified); the standard screenshot set re-captured +
   the new 29/30 canvas-properties pair + the ref-audit-s62 provenance
   set.
7. Docs: PAD v1.32.0, digma_SKILL v1.31.0 (lesson F40), AGENTS/CLAUDE/
   README rows + counts, this plan's execution status, the session log,
   the repo worklog entry.

## Execution status

- [x] S53-A — the GuardedNumberInput seam + the three site migrations (unit RED 2/2 at the absent component → GREEN; the `properties-sections` no-duplication marker updated in the same step — `aria-label="Opacity value"` became the `label="Opacity value"` prop the component renders via `aria-label={label}`; e2e RED: the cleared-Opacity pin failed as the VANISHING element against the stashed pre-fix build; GREEN post-rebuild)
- [x] S53-B — the SVG image `fill="none"` (unit RED at the missing attribute → GREEN; one line in `paintFor`'s image branch)
- [x] S53-C — the CanvasBackgroundSection seam + the MobileCanvasProperties surface (unit RED 5/5 at the absent export → GREEN; e2e RED: every "Edit canvas properties" locator absent → GREEN 13/13 — TWO harness lessons fixed en route: the F36d aria-hidden trap hit from the canvas side (the background-paint assertion moved after the Sheet close) and the zoom-cluster click-block (canvas-local (40,40) lands ON the cluster — the position click moved to (40,100)))
- [x] Full gate green — lint · typecheck · 176 unit (+8) · build 23 routes · 56 smoke · 173 e2e (+4 net — the mobile-properties spec 9 → 13; the full suite order-validated)
- [x] Live verification + screenshots (the cleared Opacity field left the selected element at 0.3 NOT 0; blur restored the abandoned draft; a real value committed; the canvas chip 44×44 in-viewport at [330,464] with the mutual exclusion both ways; the Sheet's Background color section + the hex edit painting the canvas `rgb(30, 41, 59)` + persisting through reload; Escape + focus return + lock release; at 1440 the chip wrapper `display:none` + the panel's section the surface; the standard 30 re-captured — the NEW 29/30 canvas pair — + the ref-audit-s62 set, 38/38 dimension-checked, the key shots VLM-verified all PASS; the DB re-seeded to the pristine contract after the gate + capture sessions)
- [x] Docs aligned (README — the canvas-pair screenshots block + the counts; AGENTS — the session-53 bullet + the counts; CLAUDE — the guard/canvas-surface contract rows + the counts; PAD v1.32.0 — the header + the revision block; digma_SKILL v1.31.0 — lesson F40 + the project_state + the quick-ref row; this plan; docs/session_65.md; the repo worklog entry)
