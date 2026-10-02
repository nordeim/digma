# Remediation Plan — Session 54 (the Thirtieth Audit)

**Date:** 2026-10-02 · **Trigger:** the operator's session-65/66 directive (refresh, re-validate the codebase against the mandated docs, audit the recent changes with the repo skills, iterate to parity with `https://digma-371dfd0d.base44.app/`, pay particular attention to the mobile navigation menu watching for the Tailwind v4 bug class, use TDD, capture screenshots, align docs, push via the SSH wrapper) · **Code state at start:** `145d579` (session 53 delivered at `ad8a246` + the operator's session-log push)

## The audit method

The thirtieth consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
PLUS the second systematic **Mode C code audit of the recent changes**
(the session-53 delivery: the GuardedNumberInput seam, the
CanvasBackgroundSection seam, the MobileCanvasProperties surface, the
export-png image fill) run across the review dimensions — correctness,
data integrity, error handling, maintainability, consistency — with the
`skills/` catalog's code-review-checklist as the tactical scan. No
reference board mutations; the only reference-side actions were the
operator's own account login + read-only probes (+ two clicks on the
reference's own dead Create-Team buttons).

## Reference findings (30th audit — no drift, no new gaps)

- **R3 re-confirmed (30th): mobile nav failure class A at 390×844** —
  the reference's desktop nav computes `display: none`, its three links
  collapse to 0×0, no hamburger exists, and the only header button is
  the unlabeled 36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s64/ref-01-mobile-dashboard-390.png`.
- **The Teams Create-Team dead chrome (30th datum): still dead.** Both
  buttons open ZERO dialogs (live-verified one click each; the
  `[role=dialog]` count stayed 0 after both). The Teams page still
  renders its EMPTY state.
- **Standing surfaces re-verified (no drift):** the greeting reads
  "Good evening, sepnetflix2023 ✨"; Quick Stats 1 Projects / 0 Teams /
  1 Active this week / Pro; the Recent sort default "Last Opened" with
  its "1 file found" count.
- **The board still carries 9 layers** (Rectangle 1-4, Line 5-6, Circle
  7, Text 8, Frame 1) — the project remains "Test Project One".
- **The reference's editor carries NO keyboard-shortcut affordance
  (30th datum):** zero `kbd` elements, no keyboard chip.
- **The reference's mobile editor header STILL clips Share/Present at
  390×844:** re-measured Share L385–R458, Present L466–R551 — the same
  failure class as sessions 48–53. Evidence:
  `docs/screenshots/ref-audit-s64/ref-02-mobile-editor-header-390.png`.
- **The session-51/52 mobile chip-bar datum re-confirmed:** the only
  inputs at mobile are the AI chat input + the background-color pair
  inside the clipped Canvas-Properties sliver (L453–R505, off-viewport)
  — zero usable text-content inputs at mobile.

### The clone's mobile navigation verified LIVE, end-to-end at 390×844

(the operator's particular focus): the 44×44 hamburger (L16, T10) with
the stable `aria-label="Navigation menu"` + `aria-expanded`/
`aria-controls` contract; the Sheet opens as a dialog with the three
links at 44px targets; `data-scroll-locked` engages on `<body>`; focus
lands inside the Sheet; Escape closes with focus returning to the
trigger AND the lock releasing; a link tap navigates AND dismisses; at
768 the hamburger computes `display: none` and the desktop nav `flex`
with visible links. **The Tailwind v4 failure class A is NOT present in
the clone — the 30th consecutive session.**

The session-53 surfaces re-verified live: the canvas chip 44×44
in-viewport at [330,464] with the mutual exclusion both ways; the
canvas Sheet's Background color hex edit painting the canvas
`rgb(30, 41, 59)` and persisting through reload (restored after); the
cleared Opacity value field left the selected element at its current
opacity (the guard held; a real value committed 30 → 0.3, restored).

## The code audit findings (Mode C — the session's own code-level audit)

The systematic review of the session-53 delivery found it clean against
every documented contract: the `GuardedNumberInput` implements the
S21-2 contract verbatim (draft state, the render-time
compare-and-adjust, the never-commit-an-empty-draft onChange, the
blur-restore) with the domain clamps at all three call sites (Rotation
−180..180, Opacity 0..100 → /100, the stops 0..100); the
`CanvasBackgroundSection` is the exported seam consumed by both surfaces
through the same `setBackgroundColor` path; the
`MobileCanvasProperties` follows the sanctioned patterns (the
render-time compare-and-adjust closes the Sheet on selection; the
zustand selectors subscribe to stable identity; the store is read at
call time); the export-png image branch carries `fill="none"` with its
unit pin. 0 Critical / 0 High / 0 Medium — the first session whose
audit opens with zero new actionable findings above Low.

The deferred findings from session 53 remain (documented, untouched):
F-3 (Low) the `PresentOverlay` synchronous `setScale` in the effect
body; F-4 (Low) the Sheet lifecycle edges; F-6 (Info) the Opacity
section/slider name collision (the test-side disambiguation exists);
F-7 (Info) the H `NumberField` `min={0}` vs the commit clamp for
non-line types; F-8 (Info) the historical tracked placeholder `.env`
(verified: no secrets). **F-5 (Info → this session's S54-B): the three
Sheets render no `SheetDescription`** — Radix's dialog contract wants a
description (or an explicit `aria-describedby={undefined}`); the
primitive already exports `SheetDescription`, no consumer uses it, and
screen readers get no purpose announcement for any of the three mobile
Sheets.

## The chosen session work

Two slices, each TDD — the session-65 suggestion list's two remaining
candidates (the SVG export format + the deferred a11y findings), both
pure clone supersets (the reference has no export affordance and no
mobile Sheets at all):

### S54-A — the SVG export format (the session-65 suggestion #2)

- **S54-A1 (the seam):** `src/lib/export-png.ts` gains
  `downloadSvg(svg: string, filename: string)` — the serializer's own
  SVG string wrapped in a `image/svg+xml;charset=utf-8` Blob, driven
  through the SAME anchor-trigger pattern as `downloadPng` (the pattern
  extracted into the internal `triggerBlobDownload(blob, filename)`
  consumed by both — no duplication). The SVG path is the TRUE vector
  artifact: no rasterization, no webfont fidelity limit (the serializer
  names the font family; a viewer with Inter installed renders it
  exactly), no 2× scale — the 1000×700 viewBox is the contract.
- **S54-A2 (the surface):** the Download chip becomes a
  `DropdownMenu` trigger (the vendored primitive, the
  project-card-ellipsis convention) — the same chrome, the same
  cluster position, the footprint IDENTICAL (the F38g placement study:
  no pinned geometry contract can shift — the trio DOM-boundary guard
  reads the pill's parent and the Download chip stays its SIBLING).
  The honest label (F39): the trigger becomes `aria-label="Download"` /
  `title="Download"` — it now opens a menu of formats, and a label that
  names one format would oversell. The menu: **"Download PNG"** (the
  2× raster path unchanged, the toast "PNG downloaded" unchanged) +
  **"Download SVG"** (the vector path, the toast "SVG downloaded").
  Both degrade to a toast on failure — never a thrown error into
  render.
- **S54-A3 (the tests):** unit — a source-contract spec
  (`tests/export-menu.test.ts`, the theme/canvas-memo pattern) pinning
  the `downloadSvg` export + its SVG MIME + the shared
  `triggerBlobDownload` consumption + the editor's menu consumption +
  the honest trigger label. e2e — `export-png.spec.ts` updated to the
  menu contract: the chip locator `getByRole("button", { name:
  "Download" })`; the PNG round-trips go through the menu item (the
  download event, the `.png` suggested filename, the PNG magic bytes +
  the 2000×1400 IHDR — unchanged assertions); NEW SVG pins: the
  download event with the `.svg` suggested filename, the file content
  starting with the `<?xml`/`<svg` scaffold + the `viewBox="0 0 1000
  700"` + the background fill, the "SVG downloaded" toast, the mobile
  geometry pin re-pinned on the trigger + the tap→menu→item round-trip,
  and the trio DOM-boundary guard (unchanged).

### S54-B — the SheetDescription completeness pass (F-5, the a11y slice)

- The three Sheets (the mobile-nav drawer in `app-header.tsx`, the
  `MobilePropertiesEditor` bottom Sheet, the `MobileCanvasProperties`
  bottom Sheet in `editor-view.tsx`) each render a `SheetDescription`
  (the primitive's own export, visually `sr-only` — the dialog's
  chrome is unchanged): the nav Sheet "Navigate between Digma's main
  pages."; the properties Sheet "Edit the selected element's
  properties."; the canvas Sheet "Edit the canvas background color."
  Radix wires the `aria-describedby` on the dialog automatically —
  screen readers announce the Sheet's purpose on open, and the Radix
  "Missing Description" dev warning is gone.
- **The tests:** unit — a source-contract spec
  (`tests/sheet-descriptions.test.ts`) pinning the three consumption
  sites render `SheetDescription` with non-empty text. e2e — the
  `aria-describedby` wiring pinned where the Sheets are already pinned:
  the nav Sheet (`mobile-navigation.spec.ts`) + the element and canvas
  Sheets (`mobile-properties.spec.ts`) — the dialog's
  `aria-describedby` attribute resolves to a real element carrying
  non-empty text.

## The test suites

- **Unit (source-contract + pure seams):** `tests/export-menu.test.ts`
  (the downloadSvg seam + the menu consumption + the honest label) +
  `tests/sheet-descriptions.test.ts` (the three SheetDescription sites)
  — following the theme/canvas-memo/properties-sections source-contract
  pattern. Expected: 176 + 6 = 182 (4 export-menu checks + 2
  sheet-descriptions checks).
- **E2E:** `tests/e2e/export-png.spec.ts` extended 6 → 9 (the three
  desktop tests go through the menu unchanged in substance + the
  SVG-download test + the SVG-toast test + the mobile SVG
  geometry/tap test); `tests/e2e/mobile-navigation.spec.ts` + 1 (the
  nav Sheet's aria-describedby); `tests/e2e/mobile-properties.spec.ts`
  + 2 (the element + canvas Sheets' aria-describedby). Expected:
  173 + 6 = 179.

**RED expectations:** unit — the new source-contract checks fail at the
absent `downloadSvg` export, the absent menu consumption, and the three
absent SheetDescription sites. e2e — the updated chip locator fails on
the pre-fix build (the trigger reads "Download PNG", the menu items are
absent); every SVG download pin fails (no `downloadSvg` path); the
aria-describedby pins fail (the attribute is absent — Radix omits it
when no Description renders).

## Execution order

1. S54-A unit RED (the source-contract spec) → the `downloadSvg` seam +
   the `triggerBlobDownload` extraction → the menu surface in
   `editor-view.tsx` → unit GREEN.
2. S54-B unit RED → the three SheetDescription additions → GREEN +
   fast gates (lint, typecheck).
3. E2E RED against the pre-fix build (the src changes stashed, the
   pre-fix code built and served) → rebuild with the new code → e2e
   GREEN.
4. Full gate: `lint → typecheck → test → build → smoke (dev server
   stopped, `unset DATABASE_URL` same-command) → test:e2e`.
5. Live verification on the dev server (the menu round-trips for both
   formats at desktop + mobile, the SVG file's content, the
   aria-describedby wiring, the mobile nav re-verified); the standard
   screenshot set re-captured where the UI changed (the export pair)
   + the ref-audit-s64 provenance set.
6. Docs: PAD v1.33.0, digma_SKILL v1.32.0, AGENTS/CLAUDE/README rows +
   counts, this plan's execution status, the session log, the repo
   worklog entry.

## Execution status

- [x] S54-A — the SVG export format (unit RED 2/2 at the absent `downloadSvg` seam + the absent menu consumption → GREEN; e2e RED 6/6 honestly reproduced against the stashed pre-fix build — the exact:true trigger locator absent, every menu item absent — then GREEN: the export spec restructured 4 → 6 tests with the SVG round-trips; en-route: the `<?xml encoding="UTF-8"?>` declaration prepended at the download seam — the saved file carries no HTTP charset header — distilled with the substring-locator rule as lesson F41)
- [x] S54-B — the SheetDescription completeness pass (unit RED 2/2 at the three absent sites → GREEN; e2e RED at exactly the aria-describedby assertions on the nav + element + canvas Sheets → GREEN — the pins landed inside the existing contract tests; zero regressions elsewhere)
- [x] Full gate green — lint · typecheck · 180 unit (+4) · build 23 routes · 56 smoke · 175 e2e (+2 net)
- [x] Live verification + screenshots (the menu round-trips for both formats at desktop + mobile — "Marketing Hero Banner.svg"/".png" toasts, the Untitled-mode fallback verified correct; the canvas Sheet's aria-describedby resolving to "Edit the canvas background color."; the mobile trigger 34×34 in-viewport; the mobile nav re-verified green the 30th; the standard 30 re-captured with the export pair renamed to the menu reality + the NEW 31/32 toast pair + the ref-audit-s64 set — 39/39 dimension-checked, the key shots VLM-verified all PASS; the DB re-seeded to the pristine contract)
- [x] Docs aligned (README — the export row + the screenshots block + the counts; AGENTS — the export bullet + the session-54 SheetDescription bullet + the counts; CLAUDE — the pyramid rows + the contract rows + the counts; PAD v1.33.0 — the header + the revision block; digma_SKILL v1.32.0 — lesson F41 + the project_state + the quick-ref row; this plan; docs/session_67.md; the repo worklog entry)
