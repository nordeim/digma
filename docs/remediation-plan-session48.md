# Remediation Plan — Session 48 (the Twenty-Fourth Audit)

**Date:** 2026-10-01 · **Trigger:** the operator's session-54 directive (refresh, re-validate the codebase against the mandated docs, iterate to parity with `https://digma-371dfd0d.base44.app/`, pay particular attention to the mobile navigation menu, use TDD, capture screenshots, align docs, push via the SSH wrapper) · **Code state at start:** `41d09c2` (session 47 delivered at `af14cd7` + the operator's `docs/session_54.md` transcript push)

## The audit method

The twenty-fourth consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
driven by the session-53 suggested next steps: the editor's mobile
keyboard-map affordance, a canvas performance probe at high element counts,
and the Teams member-card avatar drift check. The standing sweeps ran as
usual: R3 (the mobile nav failure class, 24th), the desktop drift check, and
a full live verification of the CLONE's mobile navigation at 390×844 (the
operator's particular focus). No reference board mutations; the only
reference-side actions were the operator's own account login + read-only
probes (+ two clicks on the reference's own dead Create-Team buttons).

## Reference findings (re-confirmations — no drift)

- **The Teams Create-Team dead chrome (24th datum): still dead.** Both
  buttons (the header "Create Team" and the empty-state "Create Your First
  Team") open ZERO dialogs — live-verified one click each
  (`[role=dialog]` count 0 after each). The reference's Teams page now
  renders its EMPTY state ("No teams yet") — its data changed since session
  37 (when a team card was measurable), so the session-53 suggested
  member-card avatar drift check is UNMEASURABLE this session; the
  session-37 pins stand as the recorded contract.
- **R3 re-confirmed (24th): mobile nav failure class A at 390×844** — the
  reference's desktop nav computes `display: none`, its links collapse to
  0×0, and the only header button is the unlabeled 36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s52/ref-01-mobile-dashboard-390.png`.
- **Standing surfaces re-verified (no drift):** the desktop nav flex with
  the exact-match purple-50 pill on `/Teams` (and none at `/Dashboard`'s
  siblings), the greeting — now "Good morning, Designer ✨" (the account's
  name was emptied since session 47's "sepnetflix2023" reading;
  **the decoded "Designer" fallback is thereby LIVE-CONFIRMED** — the
  bundle-decoded `full_name?.split(" ")[0] || "Designer"` contract, pinned
  by the clone's `greetingName` unit suite), Quick Stats (1 Projects / 0
  Teams / 1 Active this week / Pro — matching the emptied Teams state),
  "Create New Design", the Recent sort default `last_accessed`, and the
  pristine "Test Project One" board.
- **The reference's editor carries NO keyboard-shortcut affordance
  anywhere (24th datum):** its tool buttons' titles carry no shortcut text
  ("Select", "Hand", … — measured at BOTH 1440×900 and 390×844), zero
  `kbd` elements, no shortcut dialog, no cheat-sheet. The clone's
  `title="{Tool} ({shortcut})"` convention is its own documented superset.
- **The reference's mobile editor header ALSO clips Share/Present at
  390×844:** measured Share at L385–R458 and Present at L466–R551 — both
  beyond the 390 viewport (the same horizontal overflow the clone ships).
  Evidence: `docs/screenshots/ref-audit-s52/ref-02-mobile-editor-header-390.png`.

### The clone's mobile navigation verified LIVE, end-to-end at 390×844

(the operator's particular focus): the 44×44 hamburger with the stable
`aria-label="Navigation menu"` + `aria-expanded` + `aria-controls` contract;
the Sheet opens as a dialog with the three links at 44px targets;
`data-scroll-locked` engages on `<body>` with `overflow: hidden`; Escape
closes with focus returning to the trigger AND the scroll lock releasing; a
link tap navigates AND dismisses; at 768 the hamburger computes
`display: none` and the desktop nav `flex`. **The Tailwind v4 failure class
A is NOT present in the clone — the 24th consecutive session.**

## Clone findings (the gaps)

- **S48-1 (Bug — the shortcut titles lie): the toolbar advertises keyboard
  shortcuts the handler never wires.** The toolbar's TOOLS array titles
  every button `"{label} ({shortcut})"` — including "Pen Tool (P)" and
  "Image (I)" — but `useEditorShortcuts()`'s switch only maps
  v/h/f/r/o/l/t. Pressing P or I does nothing: two of the nine advertised
  shortcuts are fiction, and the map lives in TWO places (the toolbar's
  TOOLS array vs the handler's switch) with no coherence pin. The reference
  has no shortcut affordance at all (24th datum), so this is a
  superset-honestness fix within the clone's own family: make the
  advertised shortcuts real by extracting the single-source
  `TOOL_SHORTCUTS` seam into `src/lib/editor.ts`, wiring both the handler
  and the toolbar through it, and pinning the map's completeness in the
  unit layer.
- **S48-2 (Medium — the mobile editor header clip): Share and Present
  render OFF-SCREEN at 390×844.** Live-measured on BOTH the dev server and
  the production standalone build: Share at L413–R485, Present at
  L493–R582 — beyond the 390 viewport, inside the root `overflow-hidden`
  (clipped, unreachable). **A real phone user cannot enter Present mode or
  use Share** — which makes session 47's Present-mode mobile EXIT polish
  unreachable-in-practice (the polish polished a door that cannot be
  opened on a phone). The e2e present-mode pins still PASS because
  **Playwright's synthetic click dispatches to off-viewport elements** —
  verified with a throwaway probe spec in the exact e2e context (Present
  at L496–R582 at 390; the click still fires). The reference clips its own
  Share/Present at 390 too (parity at the "both broken" level — a
  reference data point, not a porting obligation), but the clone's mobile
  editor is the DOCUMENTED-IMPROVEMENT family (ADR-010's full-width
  canvas; F34's touch-coherent conventions): the header must not hide
  touch controls a phone needs. Fix: `flex-wrap` the header below sm
  (`sm:h-12` keeps the desktop single-row pixel-identical), name
  truncation guards so long names degrade gracefully, `ml-auto` on the
  right group so the wrapped row right-aligns. The avatar stack + UNGATED
  counter stay visible at every viewport (the RA-41 pinned contract —
  they move to the wrapped row, still visible at 390).

### Documented deviations (recorded for the ledger)

- The header wrap is a WORKING-SUPERSET surface (the reference's own
  header clips Share/Present at mobile — measured, evidence ref-02): the
  clone's mobile-editor improvement family (ADR-010), the same class as
  the full-width canvas and the mobile-nav fix itself.
- Wiring P/I completes the clone's own advertised shortcut map (the
  reference has no shortcut affordance — pure superset).
- **Considered and declined (with reasoning):** the session-53 suggested
  "mobile shortcut cheat-sheet affordance" — on a phone, a list of
  keyboard shortcuts is unusable documentation (no keyboard exists); the
  measured REAL mobile affordance gap was the header clip, which S48-2
  fixes. Desktop shortcut discoverability (the titles are hover-only)
  remains a future candidate if the operator wants it.
- **The canvas performance probe (session-53 suggestion #2) — probed and
  documented, no action:** a scratch project with 120 rectangles through
  the public API (full-list PUT ≈ 1.5s round-trip; the transactional
  replace held), the editor loaded all 120 (canvas children 125, layer
  DOM rendered), idle pacing a full 62 rAF frames/sec, and a synthetic
  60-move drag averaged ~39ms/frame — on the DEV server (Turbopack dev
  mode + React devtools overhead), so not a reliable regression signal.
  A dedicated production-build profiler pass (React profiler, paint
  metrics, memoization audit of the 120-element canvas) is a separate
  task; nothing parity-relevant found. The scratch project was deleted;
  the DB verified back at its pristine seeded contract.

## The remediation slices

### Slice A — the single-source shortcut map (S48-1)

`src/lib/editor.ts`:

1. **The seam:** `TOOL_SHORTCUTS: Array<{ id: EditorTool; shortcut: string }>`
   — the nine measured tools (select/V, hand/H, frame/F, rectangle/R,
   ellipse/O, line/L, pen/P, text/T, image/I) — plus
   `toolForShortcut(key: string): EditorTool | null` (lowercase-normalized
   lookup, null for unmapped keys).
2. `src/components/editor/toolbar.tsx` consumes the seam for its titles
   (the TOOLS array keeps only label/icon; the shortcut comes from the
   seam — ONE source of truth).
3. `src/components/editor/editor-view.tsx`'s `useEditorShortcuts` replaces
   the hand-rolled switch with `toolForShortcut(event.key.toLowerCase())`
   — wiring P and I for the first time.

### Slice B — the mobile header wrap (S48-2)

`src/components/editor/editor-view.tsx` → the `<header>`:

1. **Wrap below sm:** `flex h-12 …` → `flex min-h-12 flex-wrap … gap-y-1
   py-1 sm:h-12 sm:py-0` — at mobile the right group (undo/redo,
   avatars + counter, Share, Present) wraps onto its own row (~100px
   header); at ≥sm the content fits one row inside the fixed 48px —
   **pixel-identical to today** (the wrap is inert when content fits).
2. **Right-align the wrapped row:** the right group gains `ml-auto` (row 2
   right-aligned; single-row desktop unchanged — justify-between +
   ml-auto compose to the same position).
3. **Truncation guards:** `min-w-0` + `truncate` down the left group's
   chain (group → name block → h1) and `flex-shrink-0` on the right
   group, so a long project name truncates instead of forcing the wrap at
   mid widths (an en-route improvement: today a long name overflows
   invisibly).
4. The avatar stack + UNGATED counter stay exactly as pinned (RA-41) —
   they render on the wrapped row at mobile, still visible at 390.

## The TDD plan

- **Unit (RED first):** `src/lib/editor.test.ts` gains the
  `TOOL_SHORTCUTS`/`toolForShortcut` suite — the nine-tool completeness
  (every `EditorTool` in the vocabulary maps), the P and I cases (RED —
  the seam doesn't exist), the case-insensitivity, and the null for
  unmapped keys. **GREEN:** Slice A lands; the count goes 121 → +N.
- **E2E (RED first):** `tests/e2e/editor-mobile-header.spec.ts` — a new
  spec (the established mobile-suite pattern):
  - Mobile describe (390×844, hasTouch): **Share and Present are
    IN-VIEWPORT** (bounding-box `right ≤ 390 && left ≥ 0` — RED: measured
    Present L493–R582 today); **tapping Present enters the overlay and
    tapping Exit leaves it** (the full mobile round-trip — the
    enter-affordance guard the session-47 suite could not pin); **the
    avatar cluster + "2" counter are visible at 390** (the RA-41
    contract guard — the wrap must not hide them); tapping Share opens
    nothing harmful (the clipboard-degrade guard — Share stays a
    superset).
  - Desktop describe (1280×800): the header renders a SINGLE 48px row
    (height 48, Share/Present visible in-viewport) — the
    desktop-no-regression guard.
  - **RED:** the geometry pin fails at Present's `right` (582 > 390) and
    the tap-round-trip pin fails (the tap can't reach the button — a
    `tap()` on an off-viewport element times out where the synthetic
    `click()` silently fired); the guards pass. **GREEN:** Slice B lands;
    the count goes 142 → 142+M.
- **The F35 lesson (test engineering):** a Playwright `click()` on an
  off-viewport element still fires (CDP-level dispatch, no
  in-viewport requirement) — so a passing click pin does NOT prove touch
  reachability. Pin REACHABILITY as GEOMETRY (bounding box inside the
  viewport) and pin BEHAVIOR separately (the synthetic click remains the
  behavior tool). Recorded in digma_SKILL with the session-47
    present-mode pins' pass-while-clipped as the case study.
- **Full gate after GREEN:** `lint → typecheck → unit → build → smoke
  (dev server stopped, unset DATABASE_URL same-command) → e2e`.

## Execution status

- [x] Slice A — the single-source TOOL_SHORTCUTS seam + the P/I wiring
- [x] Slice B — the mobile header wrap (sm:h-12, ml-auto, truncation guards) + the icon-only Share/Present below sm (the labeled pair measured 95+107px and overflowed the wrapped row by 33px — the F34 device-coherent family: aria-labels keep the accessible names, ≥sm restores the labeled pill pixel-identical)
- [x] Unit suite (+5 → 126) — RED (the seam absent, 5 failures at the exact assertions) then GREEN
- [x] E2E spec (+6 → 148) — RED (the geometry pin at Present right 582 > 390 and the avatar-counter guard at right 397 > 390; the 4 behavior/desktop guards passing) then GREEN; a first-draft assertion bug caught en route (boundingBox() returns {x,y,width,height}, not {left,right} — the undefined-property reads failed vacuously; fixed before the real RED)
- [x] Full gate green — lint · typecheck · 126 unit · build 23 routes · 56 smoke · 148 e2e
- [x] Live verification + screenshots (the ref-audit-s52 provenance set: ref-01/ref-02 reference evidence + clone-01/02/03 verification; the standard 20 re-captured + 21-mobile-editor-header + 22-mobile-present-entry; the key shots VLM content-checked) + docs aligned (PAD v1.27.0, AGENTS, CLAUDE, README, digma_SKILL v1.26.0 lesson F35, session_55.md, worklog)

En-route catches (folded into the record): (a) the pre-fix Share/Present
"71×56" live measurements were flex-SQUEEZE artifacts — the buttons' true
content width is 95/107px (the un-wrapped row compressed them via
flex-shrink), which is why the first wrap attempt still overflowed row 2 by
33px and the icon-only form was needed; (b) the session-47 present-mode
pins' pass-while-clipped is the F35 case study — Playwright's synthetic
click/tap dispatch to off-viewport elements, so a passing click pin proves
NOTHING about touch reachability.
