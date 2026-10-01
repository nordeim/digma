# Remediation Plan — Session 51 (the Twenty-Seventh Audit)

**Date:** 2026-10-01 · **Trigger:** the operator's session-60 directive (refresh, re-validate the codebase against the mandated docs, iterate to parity with `https://digma-371dfd0d.base44.app/`, pay particular attention to the mobile navigation menu, use TDD, capture screenshots, align docs, push via the SSH wrapper) · **Code state at start:** `fc2e5aa` (session 50 delivered at `27f9945` + the operator's `docs/session_60.md` transcript push)

## The audit method

The twenty-seventh consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
driven by the session-60 suggested next steps — the canvas print/export
surface (PNG), a Lighthouse/a11y pass, or extending the mobile Sheet to
the other properties sections — plus the standing sweeps (R3 27th, the
desktop drift check, and the full live verification of the CLONE's mobile
navigation at 390×844, the operator's particular focus). No reference
board mutations; the only reference-side actions were the operator's own
account login + read-only probes (+ two clicks on the reference's own
dead Create-Team buttons and one click on its own mobile Properties
chip — a client-side visibility toggle, not a data mutation).

## Reference findings (27th audit — no drift, no new gaps)

- **The Teams Create-Team dead chrome (27th datum): still dead.** Both
  buttons open ZERO dialogs (live-verified one click each;
  `[role=dialog]` count 0 after both). The Teams page still renders its
  EMPTY state ("No teams yet").
- **R3 re-confirmed (27th): mobile nav failure class A at 390×844** —
  the reference's desktop nav computes `display: none`, its three links
  collapse to 0×0, no hamburger exists, and the only header button is
  the unlabeled 36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s58/ref-01-mobile-dashboard-390.png`.
- **Standing surfaces re-verified (no drift):** the greeting reads "Good
  morning, sepnetflix2023 ✨" (the name still populated — the session
  49/50 state); Quick Stats 1 Projects / 0 Teams / 1 Active this week /
  Pro; the Recent sort default `last_accessed` with its four options;
  the board still carries 9 layers (Rectangle 1-4, Line 5-6, Circle 7,
  Text 8, Frame 1).
- **The reference's editor carries NO keyboard-shortcut affordance
  (27th datum):** the nine tool titles without shortcut text, zero
  `kbd` elements, no dialog.
- **The reference's mobile editor header STILL clips Share/Present at
  390×844:** re-measured Share L394–R467, Present L475–R559 — the same
  failure class as sessions 48/49/50 (both fully off-screen). Evidence:
  `docs/screenshots/ref-audit-s58/ref-02-mobile-editor-header-390.png`.
- **A REFINEMENT of the session-50 mobile-editor datum:** the
  reference's mobile editor DOES render its bottom chip bar at
  390×844 (Layers/Components/Properties at **24px** targets — under any
  touch floor) and its panels at SQUEEZED/CLIPPED widths (Layers 210px
  of its 240px design; the Properties panel a ~126px off-screen sliver
  of 288px), and the chips ARE functional toggles (clicking Properties
  closed the sliver — client-side state only). The functional
  conclusion stands: **no USABLE properties/text-editing surface at
  mobile** — a 126px clipped panel cannot carry the five TEXT controls,
  and the chip targets are 24px. The clone's deliberate gating (chips
  hidden below md/lg — dead controls that lie are a bug) + the
  Edit-text chip + bottom Sheet remain the superior working superset.
  The only inputs at mobile are the AI chat input + the background
  color picker pair (the clipped Canvas Properties sliver) — zero
  text-content inputs, confirming the session-50 measurement.

### The clone's mobile navigation verified LIVE, end-to-end at 390×844

(the operator's particular focus): the 44×44 hamburger with the stable
`aria-label="Navigation menu"` + `aria-expanded`/`aria-controls`
contract; the Sheet opens as a dialog (labelled via its "Digma"
SheetTitle) with the three links at 44px targets; `data-scroll-locked`
engages on `<body>` with `overflow: hidden`; Escape closes with focus
returning to the trigger AND the lock releasing; a link tap navigates
AND dismisses; at 768 the hamburger computes `display: none` and the
desktop nav `flex` (and the inverse at 390). **The Tailwind v4 failure
class A is NOT present in the clone — the 27th consecutive session.**

## The chosen session work — the canvas PNG export (suggestion #1)

Both the session-59 and session-60 logs rank a canvas print/export
surface (PNG) first among the next steps — a PURE clone superset (the
reference has no export anywhere; Present is its only output surface).
The session also re-checked the alternative placements against the
pinned contracts before committing to a design (below).

### The placement study (why the chip is NOT in the header)

The session-48/49 mobile/tablet header pins constrain any new header
chrome: the 600×844 short-name pin asserts the header stays a SINGLE
48px row when the content fits, and the current right group at ≥sm
(undo + redo + separator + avatars + labeled Share 95px + labeled
Present 107px) already sits within ~20px of that wrap threshold — a
44-52px Download button in the header would push the short-name
tablet case into a two-row wrap and BREAK the pinned 48px. The zoom
cluster (top-left canvas overlay, `absolute left-4 top-4`) has no such
constraint: it is not part of the header's flex arithmetic, it renders
at EVERY viewport (the F37 rule — an affordance gated to desktop is
unreachable on the device class that needs it most), and the S49-2
Keyboard chip already established the convention of clone-added
utility chips as sibling members of that cluster (the reference-measured
zoom trio keeps its own inner wrapper — the parity pin's DOM boundary
stays intact). Measured at 390×844 the five-chip cluster (pill +
zoom-out + zoom-in + Keyboard + Download) spans ~232px from left-4 —
fully in-viewport, no collision with the top-right "N selected" badge
or the bottom-right Edit-text chip.

### S51-1 — the pure export seams (`src/lib/export-png.ts`)

A new pure, DOM-free module (the `src/lib/editor.ts` discipline — the
export math is unit-testable everywhere):

- `elementsToSvg(elements, { backgroundColor })` → a standalone SVG
  document string of the fixed 1000×700 board (the Present overlay's
  own canvas area — "the export is the presentation, as a file"):
  `<svg xmlns width="1000" height="700" viewBox="0 0 1000 700">` + the
  background `<rect>` + per-element shapes in array order. Mapping
  rules (all mirroring the DOM render sites — canvas / thumbnail /
  present):
  - **Transform parity:** CSS `transform: translate(x,y) scale(s)
    rotate(r)` with `transform-origin: 0px 0px` is EXACTLY the SVG
    `transform="translate(x y) scale(s) rotate(r)"` (the same matrix
    product around the element's top-left). Opacity maps to the
    `opacity` attribute.
  - **rectangle / frame:** `<rect>` with `rx` for radius. A frame
    renders `fill="none"` + its stroke (the thumbnail convention,
    RA-19: the frame's label chip is EDITOR CHROME and stays OUT of
    the artifact). A rectangle's fill comes from the ONE paint chain
    (`fillPaintFor` precedence: image > gradient > solid).
  - **Border-box stroke inset:** Tailwind's preflight sets
    `box-sizing: border-box`, so the DOM border paints INSIDE the
    element's width/height; SVG strokes paint centered on the path.
    Parity: inset the rect by `strokeWidth/2` (x, y, and both
    dimensions reduced by the full strokeWidth) whenever a stroke
    paints.
  - **ellipse:** `<ellipse cx=W/2 cy=H/2 rx=W/2 ry=H/2>` (the CSS
    50% radius on the box), same stroke-inset math.
  - **line:** the SVG diagonal contract verbatim (RA-8): `<line x1=0
    y1=0 x2=W y2=H>` with `stroke-linecap="round"`, stroke default
    `#FFFFFF`, width default 2 — and NEVER a box border.
  - **text:** `<text>` with `font-family` from `canvasFontFamily`
    (the "Inter, sans-serif" default chain — RA-30), `font-size`
    (default 16), `font-weight` (default 500), `fill` from the
    element's own color contract (default `#FFFFFF` — text never takes
    the paint chain). Horizontal alignment via `text-anchor` +
    per-align x (left → `start` at x=0; center → `middle` at x=W/2;
    right → `end` at x=W — the flex justifyContent mapping made
    geometric). Vertical centering via the flex alignItems mapping:
    the block's first baseline at `y = H/2 - (n-1)·lineHeight/2` with
    `dominant-baseline="central"`, `lineHeight = fontSize · 1.2`, and
    `<tspan x dy=lineHeight>` per explicit `\n` line
    (`whiteSpace: pre-wrap` honored for explicit breaks; XML-escaping
    `& < >` in the content).
  - **gradient fills:** `<defs><linearGradient>` with the CSS-angle →
    SVG-vector math (CSS 0deg points UP: x1=0.5−sin(A)/2, y1=0.5+
    cos(A)/2, x2=0.5+sin(A)/2, y2=0.5−cos(A)/2 in objectBoundingBox
    units) + stops sorted by position (the `gradientCss` discipline);
    radial → `<radialGradient cx=0.5 cy=0.5 r=0.5>` (the `circle`
    form). Deterministic ids (`grad-0`, `grad-1`, …) so repeated
    exports are byte-stable.
  - **image fills:** `<image href=xlink width height
    preserveAspectRatio>` — cover → `xMidYMid slice`, contain/auto →
    `xMidYMid meet`, stretch → `none` (the `fillImageSizeFor` fit
    mapping translated to SVG). Documented deviation: CSS `auto`
    backgrounds tile (`background-repeat` default) while the SVG maps
    to meet — the rare case approximated, never crashed.
  - **visible=false → skipped** (the thumbnail/present filter);
    **locked elements RENDER** (the lock is an interaction wall, not a
    visual state).
  - Numbers rounded to 2 decimals (no 33.333333333333336 artifacts).
- `exportFilename(name)` → the download filename: path-hostile
  characters stripped, whitespace collapsed to single spaces, trimmed,
  fallback `"design"` when empty.
- **Browser-only rasterize helpers** (NOT unit-tested — node has no
  Image/canvas; they are e2e-pinned instead): `svgToPngBlob(svg,
  width, height, scale=2)` — the SVG string → Blob URL → `Image` →
  2×-scaled `<canvas>` → PNG Blob (2000×1400 output); and
  `downloadPng(blob, filename)` — the object-URL `<a download>` click.
  Known fidelity limit (documented in the seam): an `<img>`-rasterized
  SVG cannot see the DOCUMENT's webfonts — text renders in the
  platform's fallback when the family isn't installed (Inter on most
  systems); shapes, gradients, images, and geometry are exact.

### S51-2 — the UI surface (the zoom-cluster chip)

A "Download PNG" chip in the zoom cluster (the Keyboard chip's direct
sibling — the S49-2 pattern): the cluster chip chrome
(`rounded-lg border border-[#30363d] bg-[#161b22] p-2 text-gray-400
transition-colors hover:text-white`), the lucide `Download` icon,
`aria-label="Download PNG"` + `title="Download PNG"`, visible at every
viewport. The handler reads the store at call time (`getState()` — no
new shell subscriptions): elements + backgroundColor → `elementsToSvg`
→ `svgToPngBlob` → `downloadPng(\`exportFilename(projectName).png\`)`,
with the degrade-not-fail toasts on both paths (success: "PNG
downloaded"; failure: "Export failed"). The header, the Share/Present
pills, and all their pinned geometry stay untouched.

### S51-3 — the test suites

- **Unit (`src/lib/export-png.test.ts`, the TDD RED phase):** the SVG
  scaffold (xmlns/width/height/viewBox + the background rect); the
  rectangle mapping (fill, rx, the transform chain, the opacity attr);
  the border-box stroke inset (a 100×80 rect with strokeWidth 4 →
  x=2 y=2 width=96 height=76); the ellipse mapping; the line diagonal
  (round cap, no box border); the text mapping (the font chain, the
  text-anchor/x table, the vertical-centering math, the tspan split,
  the XML escape); the gradient defs (the 0deg bottom→top vector, the
  sorted stops, the url(#grad-N) fill, the radial form); the image
  preserveAspectRatio table; hidden-skipped + locked-renders; the
  frame's fill="none" + no label; `exportFilename` (strip, collapse,
  fallback).
- **E2E (`tests/e2e/export-png.spec.ts`):** a SELF-CONTAINED fixture
  per the F37c discipline (its own project via the public API with a
  rectangle + an ellipse + a text at known coordinates, deleted in a
  finally, swept in afterAll — the mobile-text-editing spec's
  pattern). Desktop (1280): the chip is visible in the zoom cluster;
  clicking it fires Playwright's download event with a `.png`
  suggested filename; the saved file starts with the PNG magic bytes
  and its IHDR reads 2000×1400 (the 2× raster). Mobile (390×844,
  hasTouch): the chip is IN-VIEWPORT (the F35 geometry rule) and a
  TAP produces the same download. Guards: the reference-measured zoom
  trio's DOM boundary is intact (the pill's parent still holds exactly
  pill + zoom-in + zoom-out).

**RED expectations:** unit — the new spec fails at its exact
assertions (the module absent). e2e — the new spec fails at the absent
chip (the download event never fires). GREEN: unit +~14, e2e +~5
(counts confirmed at execution).

## Execution order

1. S51-1 unit RED → the `export-png.ts` seams → unit GREEN.
2. S51-2 the chip + handler in `editor-view.tsx` → fast gates (lint,
   typecheck, unit).
3. S51-3 e2e RED against the pre-fix build → rebuild with the new code
   → e2e GREEN.
4. Full gate: `lint → typecheck → test → build → smoke (dev server
   stopped, unset DATABASE_URL same-command) → test:e2e`.
5. Live verification on the dev server (the chip at both viewports,
   the real download round-trip, the PNG dimensions); the standard
   screenshot set re-captured + the new export pair + the ref-audit-s58
   provenance set.
6. Docs: PAD v1.30.0, digma_SKILL v1.29.0 (lesson F38 — the DOM→SVG
   export mapping rules), AGENTS/CLAUDE/README counts + rows, this
   plan's execution status, `docs/session_61.md`, the repo worklog
   entry.

## Execution status

- [x] S51-1 — the pure export seams + `src/lib/export-png.test.ts` (23 checks; unit RED at the absent module then GREEN 160 = 137 + 23 — two first-draft assertion bugs fixed en route: the tspan-not-text node shape and the multi-line first-line y)
- [x] S51-2 — the Download PNG chip in the zoom cluster + the handler (getState() at call time; degrade-not-fail toasts on both paths)
- [x] S51-3 — `tests/e2e/export-png.spec.ts` (4 checks on the self-contained API-created fixture; e2e RED 4/4 against the pre-fix build then GREEN 168 = 164 + 4 — one locator bug fixed en route: the cluster guard moved to the parity spec's page.evaluate pattern)
- [x] Full gate green — lint · typecheck · 160 unit (+23) · build 23 routes · 56 smoke · 168 e2e (+4, the full suite order-validated)
- [x] Live verification + screenshots (the chip [501,64] at 1440 + [261,93] in-viewport at 390, the click/tap round-trip with the success toast; the standard 26 re-captured + the 27/28 pair + the ref-audit-s58 set — 33/33 dimension-checked, the key shots VLM-verified)
- [x] Docs aligned (README counts + the export row + the screenshots section, AGENTS/CLAUDE counts + the export bullet, PAD v1.30.0, digma_SKILL v1.29.0 lesson F38, session_61.md, the worklog entry)
