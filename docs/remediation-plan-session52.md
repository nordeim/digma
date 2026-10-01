# Remediation Plan — Session 52 (the Twenty-Eighth Audit)

**Date:** 2026-10-01 · **Trigger:** the operator's session-61/62 directive (refresh, re-validate the codebase against the mandated docs, iterate to parity with `https://digma-371dfd0d.base44.app/`, pay particular attention to the mobile navigation menu, use TDD, capture screenshots, align docs, push via the SSH wrapper) · **Code state at start:** `626e25f` (session 51 delivered at `ecc1215` + the operator's `docs/session_62.md` transcript push)

## The audit method

The twenty-eighth consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
driven by the session-62 suggested next steps — a Lighthouse/a11y pass,
extending the mobile Sheet to the other properties sections, or an SVG
export format — plus the standing sweeps (R3 28th, the desktop drift
check, and the full live verification of the CLONE's mobile navigation at
390×844, the operator's particular focus). No reference board mutations;
the only reference-side actions were the operator's own account login +
read-only probes (+ two clicks on the reference's own dead Create-Team
buttons).

## Reference findings (28th audit — no drift, no new gaps)

- **R3 re-confirmed (28th): mobile nav failure class A at 390×844** —
  the reference's desktop nav computes `display: none`, its three links
  collapse to 0×0, no hamburger exists, and the only header button is
  the unlabeled 36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s60/ref-01-mobile-dashboard-390.png`.
- **The Teams Create-Team dead chrome (28th datum): still dead.** Both
  buttons open ZERO dialogs (live-verified one click each;
  `[role=dialog]` count 0 after both). The Teams page still renders its
  EMPTY state ("No teams yet").
- **Standing surfaces re-verified (no drift):** the greeting reads "Good
  morning, sepnetflix2023 ✨" (the name still populated); Quick Stats 1
  Projects / 0 Teams / 1 Active this week / Pro; the Recent sort default
  `last_accessed` with its four options; "1 file found".
- **The board still carries 9 layers** (Rectangle 1-4, Line 5-6, Circle
  7, Text 8, Frame 1) — the owner renamed the project to "Test Project
  One" (their own activity; the layer stack is unchanged — a data note,
  not a chrome drift).
- **The reference's editor carries NO keyboard-shortcut affordance
  (28th datum):** the nine tool titles without shortcut text, zero
  `kbd` elements, no dialog.
- **The reference's mobile editor header STILL clips Share/Present at
  390×844:** re-measured Share L385–R458, Present L466–R551 — the same
  failure class as sessions 48/49/50/51 (both fully off-screen).
  Evidence: `docs/screenshots/ref-audit-s60/ref-02-mobile-editor-header-390.png`.
- **The session-51 mobile chip-bar datum re-confirmed:** the reference's
  mobile editor renders its bottom chip bar at 390×844
  (Layers/Components/Properties at **24px** targets) with squeezed/
  clipped panels, and the only inputs at mobile are the AI chat input +
  the background-color picker pair (zero text-content inputs) — **no
  USABLE properties surface at mobile**, confirming the clone's
  deliberate gating + mobile Sheet as the superior working superset.

### The clone's mobile navigation verified LIVE, end-to-end at 390×844

(the operator's particular focus): the 44×44 hamburger with the stable
`aria-label="Navigation menu"` + `aria-expanded`/`aria-controls`
contract; the Sheet opens as a dialog with the three links at 44px
targets; `data-scroll-locked` engages on `<body>` with `overflow:
hidden`; focus lands inside the Sheet (trap); Escape closes with focus
returning to the trigger AND the lock releasing; a link tap navigates
AND dismisses; at 768 the hamburger computes `display: none` and the
desktop nav `flex` (and the inverse at 390). **The Tailwind v4 failure
class A is NOT present in the clone — the 28th consecutive session.**

## The chosen session work — the mobile properties Sheet (suggestion #2)

The session-62 suggestion list ranks extending the mobile Sheet to the
other properties sections as the convention-following step: the
session-50 architecture already established the shared-section pattern
(`TextSection` — one source, two surfaces), and the reference's mobile
editor still has NO usable properties surface (re-confirmed above), so
the extension stays a pure clone superset in the documented
mobile-editor improvement family (ADR-010, F34, F37).

### The gap (clone-side, live-measured)

The mobile bottom Sheet (session 50) carries ONLY the TEXT section —
below lg a phone can edit a selected text's content but NOT its
position, size, fill, stroke, corner radius, transform, or opacity; and
a selected RECTANGLE/ELLIPSE/LINE/FRAME has NO properties surface at
all at mobile (the chip is text-only). The desktop panel's other five
sections are panel-inline — extending the Sheet by copy-paste would
create the two-diverging-copies bug the F35e lesson names.

### S52-1 — the shared-section seams (properties-panel.tsx)

Extract the panel's inline sections into exported shared components
(the `TextSection` pattern — the consumer passes the element + an
update patcher):

- `PositionSizeSection` — the X/Y/W/H `NumberField` grid (the line's
  min-0 height discrimination inside).
- `CornerRadiusSection` — the dynamic-max slider (`cornerRadiusMax`) +
  the linked per-corner inputs clamped to the same max.
- `FillStrokeSection` — the Radix Solid/Gradient/Image tablist with the
  fill-tab derivation (the `fillKey` render-time compare-and-adjust)
  moved INSIDE the section, the `GradientPanel`/`ImagePanel` wiring,
  and the Stroke hex + width rows.
- `TransformSection` — the rotation slider + `w-16` number input + `°`
  suffix, and the scale slider + "1.0x" readout.
- `OpacitySection` — the slider + `w-16` number input + `%` suffix.
- **`PropertiesSections`** — the TYPE-CONDITIONAL COMPOSITION rendering
  the full stack in the reference's measured order: Position & Size →
  (Corner Radius unless line/ellipse/text) → (Fill & Stroke unless
  text) → (TEXT if text) → Transform → Opacity. The section ORDER and
  the type conditions live in ONE place — the F35e single-source rule
  applied to the layout itself, not just the controls.

The desktop panel's single-selection branch becomes
`<PropertiesSections element={single} update={update} />` — a PURE
refactor (pixel-identical markup, the fill-tab state moving inside the
section unchanged). The multi-selection and Canvas Properties branches
stay in the panel (no mobile equivalent).

### S52-2 — the mobile surface (editor-view.tsx)

`MobileTextEditor` becomes **`MobilePropertiesEditor`**:

- The zustand selector returns the selected element for ANY single
  selection (the same STABLE-identity pattern), so the chip surfaces
  for a rectangle/ellipse/line/frame/text alike.
- The chip relabels `aria-label="Edit properties"` (the Sheet it opens
  is no longer text-only — the label must stay honest) and swaps the
  `Type` icon for `SlidersHorizontal` (the properties metaphor); the
  chrome, the 44px F34 floor, `lg:hidden`, and the bottom-right
  placement are unchanged.
- The Sheet's `SheetTitle` becomes "Edit properties" and its body
  renders `<PropertiesSections element={selected}
  update={update} />` — the SAME composition the desktop panel renders.
- The update patcher re-derives the single selection at call time
  through `getState()` (the type check drops; `updateElements` is the
  same path) — autosave, undo/redo, and the Unsaved badge flow
  unchanged.
- The render-time compare-and-adjust closes the Sheet when the
  selection stops being a single element (any type).

### S52-3 — the test suites

- **Unit (`tests/properties-sections.test.ts`, new — the source-contract
  pattern of `text-section.test.ts`/`canvas-memo.test.ts`):** the five
  section exports with the element+update signature; the
  `PropertiesSections` composer export; its type-conditional layout
  (the corner-radius and fill-stroke gates, the text gate); the desktop
  panel's consumption through the composer; the mobile surface's
  consumption of the SAME composer; and the no-duplication markers (the
  `aria-label="Position and size"`, `Stroke Width`, `aria-label="Rotation"`,
  `aria-label="Opacity"` markers exist exactly once in each consuming
  file's domain). `tests/text-section.test.ts` updates its
  panel-consumption assertion to the composer form (the
  no-inline-duplication pin stays).
- **E2E (`tests/e2e/mobile-properties.spec.ts` — the session-50 spec
  renamed and extended, its fixture discipline intact):** the chip
  geometry at 390×844 (in-viewport, ≥44px); the RECTANGLE case (the chip
  surfaces + the Sheet carries Position & Size, Corner Radius, Fill &
  Stroke, Transform, Opacity and NO TEXT section — the type-conditional
  layout at mobile); a non-TEXT functional round-trip (the Fill Color
  edit paints the canvas + persists through the autosave); the
  MARQUEE multi-selection no-chip guard; the text round-trip (the five
  TEXT controls + an edit reaching the canvas + reload persistence);
  the Sheet dialog contract (scroll lock, Escape, focus return); the
  fresh-text workflow; and the lg boundary (at 1280 the chip is absent
  and the panel's sections are the surface).

**RED expectations:** unit — the new spec fails at the absent exports;
`text-section.test.ts` fails at its panel-consumption assertion once
the composer lands. e2e — the renamed chip is absent pre-fix (every
`Edit properties` locator fails).

## Execution order

1. S52-1 unit RED (the new spec at the absent seams) → the section
   exports + composer in `properties-panel.tsx` → unit GREEN (the
   `text-section.test.ts` assertion updated in the same step).
2. S52-2 the `MobilePropertiesEditor` in `editor-view.tsx` → fast
   gates (lint, typecheck, unit).
3. S52-3 e2e RED against the pre-fix build → `git mv` the spec →
   rewrite → rebuild with the new code → e2e GREEN.
4. Full gate: `lint → typecheck → test → build → smoke (dev server
   stopped, unset DATABASE_URL same-command) → test:e2e`.
5. Live verification on the dev server (the chip for a rectangle +
   a text at both viewports, the section layout, a fill edit
   round-trip); the standard screenshot set re-captured (the 25/26
   pair re-captured as the properties surface) + the ref-audit-s60
   provenance set.
6. Docs: PAD v1.31.0, digma_SKILL v1.30.0 (lesson F39), AGENTS/CLAUDE/
   README rows + counts, this plan's execution status, the session log,
   the repo worklog entry.

## Execution status

- [x] S52-1 — the shared-section seams + composer (PositionSizeSection, CornerRadiusSection, FillStrokeSection with the fill-tab derivation inside, TransformSection, OpacitySection, PropertiesSections) + `tests/properties-sections.test.ts` (8 checks; unit RED 8/8 at the absent seams then GREEN 168 = 160 + 8 — one marker bug fixed en route: `aria-label="Opacity"` matches the section AND the slider, the unique marker is the `Opacity value` input; `tests/text-section.test.ts` updated to the composer consumption in the same step)
- [x] S52-2 — the MobilePropertiesEditor surface (the "Edit properties" chip + the SlidersHorizontal icon for ANY single selection below lg; the Sheet carrying `<PropertiesSections>` through the same updateElements path)
- [x] S52-3 — `tests/e2e/mobile-properties.spec.ts` (the session-50 spec git-mv'd + extended to 8 checks; e2e RED 7 failed / 2 passed against the pre-fix build — the 2 passes: the auth setup + the vacuous multi-selection guard — then GREEN after the rebuild, with THREE locator bugs fixed en route: getByLabel("Opacity") resolved to 3, getByLabel("Fill Color") to 2, getByLabel("X") case-insensitively substring-matched the "hex" inputs — lesson F39)
- [x] Full gate green — lint · typecheck · 168 unit (+8) · build 23 routes · 56 smoke · 169 e2e (+1 net — the 8-check spec replacing the 7-check one; the full suite order-validated)
- [x] Live verification + screenshots (the chip [330,464] 44×44 in-viewport at 390 for the selected CTA Button; the rectangle Sheet's five sections; the fill edit round-trip `#EF4444` → Ctrl+Z restored `#3B82F6`; Escape + focus return; the text Sheet's four sections; at 1440 the chip wrapper display:none + the panel's sections the surface; the standard 28 re-captured — the 25/26 pair renamed to the properties surface, the 26 tap corrected from the rect's center (which selected its topmost label) to its exposed bottom strip — + the ref-audit-s60 set, 34/34 dimension-checked, the key shots VLM-verified all PASS)
- [x] Docs aligned (README — the mobile-properties row + the screenshots section + the counts; AGENTS — the shared-section bullet + the counts; CLAUDE — the pyramid rows + the counts; PAD v1.31.0 — the header + the revision block; digma_SKILL v1.30.0 — lesson F39 + the project_state + the quick-ref row; this plan; docs/session_63.md; the repo worklog entry)
