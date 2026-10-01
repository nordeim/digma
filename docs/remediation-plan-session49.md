# Remediation Plan — Session 49 (the Twenty-Fifth Audit)

**Date:** 2026-10-01 · **Trigger:** the operator's session-56 directive (refresh, re-validate the codebase against the mandated docs, iterate to parity with `https://digma-371dfd0d.base44.app/`, pay particular attention to the mobile navigation menu, use TDD, capture screenshots, align docs, push via the SSH wrapper) · **Code state at start:** `f5ee715` (session 48 delivered at `0981042` + the operator's `docs/session_56.md` transcript push)

## The audit method

The twenty-fifth consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
driven by the session-55 suggested next steps: the production-build canvas
performance profile at high element counts (with the memoization audit),
the desktop shortcut-discoverability affordance, and the tablet-width
(567–640px) header sweep — plus the standing sweeps (R3 25th, the desktop
drift check, and the full live verification of the CLONE's mobile
navigation at 390×844, the operator's particular focus). No reference
board mutations; the only reference-side actions were the operator's own
account login + read-only probes (+ two clicks on the reference's own dead
Create-Team buttons).

## Reference findings (re-confirmations — no drift; three data changes, all confirming decoded contracts)

- **The Teams Create-Team dead chrome (25th datum): still dead.** Both
  buttons open ZERO dialogs (live-verified one click each; `[role=dialog]`
  count 0 after both). The Teams page still renders its EMPTY state
  ("No teams yet").
- **R3 re-confirmed (25th): mobile nav failure class A at 390×844** — the
  reference's desktop nav computes `display: none`, its links collapse to
  0×0, and the only header button is the unlabeled 36px dead bell. No
  hamburger anywhere. Evidence:
  `docs/screenshots/ref-audit-s54/ref-01-mobile-dashboard-390.png`.
- **Standing surfaces re-verified (no drift):** the desktop nav flex with
  the exact-match purple-50 pill on `/Teams` (and none on its siblings),
  "Create New Design", Quick Stats (1 Projects / 0 Teams / 1 Active this
  week / Pro), and the Recent sort default `last_accessed`.
- **Data change #1 — the greeting reads "Good morning, sepnetflix2023 ✨"
  again:** the account's name was RE-POPULATED since session 48 (which
  read "Good morning, Designer ✨" over the emptied name). Both directions
  of the bundle-decoded `full_name?.split(" ")[0] || "Designer"` contract
  are now LIVE-CONFIRMED (emptied → "Designer" in session 48; populated →
  the first word now).
- **Data change #2 — the reference board is no longer pristine:** the
  "Test Project One" canvas now carries NINE elements (Rectangle 1–4,
  Line 5–6, Circle 7, Text 8 with content "Type here...", Frame 1 —
  the layers panel reads "9 layers", zoom 128%, "Opened Oct 1"). This is
  the reference owner's own editor activity; the audits never mutate the
  reference board. The pristine-board datum from earlier sessions is
  RETIRED as stale; no clone-side action (the clone seeds its own demo
  workspace — different data by design).
- **The reference's editor STILL carries no keyboard-shortcut affordance
  (25th datum):** tool titles without shortcut text ("Select", "Hand", …),
  zero `kbd` elements, no dialog — re-measured at 1440×900.
- **The reference's mobile editor header STILL clips Share/Present at
  390×844:** re-measured Share L385–R458, Present L466–R551 — identical
  to session 48. Evidence:
  `docs/screenshots/ref-audit-s54/ref-02-mobile-editor-header-390.png`.

### The clone's mobile navigation verified LIVE, end-to-end at 390×844

(the operator's particular focus): the 44×44 hamburger with the stable
`aria-label="Navigation menu"` + `aria-expanded` + `aria-controls`
contract; the Sheet opens as a dialog with the three links at 44px
targets; `data-scroll-locked` engages on `<body>` with `overflow:
hidden`; Escape closes with focus returning to the trigger AND the lock
releasing; a link tap navigates AND dismisses; at 768 the hamburger
computes `display: none` and the desktop nav `flex`. **The Tailwind v4
failure class A is NOT present in the clone — the 25th consecutive
session.**

### The tablet-width header sweep (the session-55 suggestion #3) — GREEN, unpinned

Live-measured on the clone at 567/600/640×844: Share and Present render
IN-VIEWPORT at every width, and the header stays a SINGLE 48px row (the
wrap is inert where content fits — `flex-wrap` only engages below sm when
the row overflows). The endpoints re-verified: 390 (the two-row 77px
wrap, Share R318 / Present R374) and 1440 (single 48px row, labeled
pills). No gap found — but the mid-range geometry is not yet PINNED; the
e2e suite only pins 390 and the desktop row. S49-3 closes that.

## The production-build performance profile (the session-55 suggestion #1)

Executed as designed — the standalone production server (`.next/
standalone/server.js`) booted on :3200 against a scratch `db/perf.db`
(schema-pushed + seeded), a scratch project created, and 120 rectangles
pushed through the PUBLIC API (`PUT /api/projects/[id]/elements`). All
measurements on the production artifact, not the dev server:

- **Full-list PUT of 120 elements: 45ms** (the session-48 dev-server
  probe measured ≈1.5s — that number was dev-mode overhead, now
  confirmed; the transactional replace holds on the production build).
- **Idle with 120 rendered elements: 60fps** (181 frames / 3s, avg
  16.5ms, p95 16.7ms) with **zero long tasks**.
- **Synthetic element drag (40 pointer moves): 60fps** (242 frames, avg
  16.8ms, p95 16.8ms, max 33.3ms), **zero long tasks**, the element
  moved and the selection chrome rendered.
- **Zoom×5 + Ctrl+A select-all (120 selected): 60fps**, zero long tasks.
- **Page load with 120 elements: FCP 164ms, DCL 108ms**, no slow
  resources.

The scratch project and `db/perf.db` were deleted after the probe (the
dev DB untouched; verified).

### The memoization audit catch — S49-1 (the gap the profile's code audit found)

`src/components/editor/canvas.tsx`'s `CanvasElement` is a PLAIN function
component — **not wrapped in `React.memo`** — while TWO comments in the
file claim the opposite ("undefined for every other type keeps their
renders memoized across zoom changes", "non-frame elements keep their
memoized renders"). The `undefined`-zoom discrimination only does
anything WHEN the component is memoized; as shipped, every parent
`Canvas` re-render re-executes ALL element render functions (the DOM
diff then no-ops, which is why 120 rectangles still measure 60fps — but
the documented intent is unimplemented, and the cost compounds with
element count, complex elements (gradients/text/frame labels), and
low-end devices). The store already does the immutable half
(`elements.map(el => idSet.has(el.id) ? { ...el, ...patch } : el)` —
unchanged elements keep their object identity), so the fix is exactly
the wrapper the comments describe:

- `const MemoizedCanvasElement = React.memo(CanvasElement);` and the
  render site consumes it. Default shallow compare is correct: `element`
  identity (immutable updates), `selected` (boolean), `zoom` (undefined
  for non-frames). The internal `useEditorStore((s) => s.tool)`
  subscription still updates every element on tool changes (memo never
  blocks store-driven updates — the cursor contract holds).
- Effects: a drag re-renders ONLY the dragged element; a selection
  change re-renders only the flipped members; a zoom change re-renders
  only frames. The comments become true.
- **TDD:** the repo's established source-contract pattern
  (`tests/theme.test.ts`, `tests/brand-mark.test.ts`) pins it — a new
  `tests/canvas-memo.test.ts` asserting (RED pre-fix): the memo wrapper
  exists, the render site consumes the memoized component, and the
  frame-only zoom discrimination (`el.type === "frame" ? zoom :
  undefined`) is present. Runtime behavior stays pinned by the existing
  e2e drag/selection/zoom suites (they run against the real DOM — a
  broken memo would surface there).

## The desktop shortcut-discoverability affordance — S49-2 (the session-55 suggestion #2)

The toolbar titles advertise the nine tool shortcuts but are HOVER-ONLY
(and titles never appear on touch devices at all). The reference carries
NO shortcut affordance anywhere (24th/25th datum) — so a discoverability
surface is a pure clone-side superset in the same family as the titled
shortcuts themselves. Design (the app's own conventions):

1. **The seam grows the labels** (single source — the F35e lesson): each
   `TOOL_SHORTCUTS` entry gains `label` ("Select", "Hand", "Frame",
   "Rectangle", "Ellipse", "Line", "Pen Tool", "Text", "Image" — moved
   out of `toolbar.tsx`'s TOOL_META, which keeps only the icons;
   presentation vs domain data). The toolbar titles consume the seam's
   label+shortcut exactly as before.
2. **A new `EDITOR_SHORTCUTS` export** in `src/lib/editor.ts`: the
   grouped inventory the help dialog renders — the **Tools** group
   DERIVED from `TOOL_SHORTCUTS` (so the dialog can never list a
   shortcut the handler doesn't wire), plus **View** (Zoom in Ctrl+=,
   Zoom out Ctrl+-, Reset view Ctrl+0, Pan Space-hold) and **Editing**
   (Undo Ctrl+Z, Redo Ctrl+Shift+Z / Ctrl+Y, Delete Del/Backspace,
   Deselect Esc) — the exact commands `useEditorShortcuts` wires.
3. **The trigger:** a `Keyboard` lucide-icon chip appended to the zoom
   cluster (`absolute left-4 top-4` — visible at EVERY viewport incl.
   390), same chrome as the zoom buttons (`rounded-lg border
   border-[#30363d] bg-[#161b22] p-2 text-gray-400 hover:text-white`),
   `aria-label="Keyboard shortcuts"` + `title="Keyboard shortcuts (?)"`.
4. **The dialog:** the repo's shadcn Dialog pattern in the EDITOR'S dark
   chrome (bg-[#161b22], border-[#30363d], white text — the panels'
   family, not the light app chrome): title "Keyboard shortcuts", the
   three groups as sectioned rows (label left, `kbd` chips right —
   `rounded border border-[#30363d] bg-[#0d1117] px-1.5 py-0.5 text-xs`),
   the built-in X close + Radix-native Escape + focus return.
5. **The `?` key:** `useEditorShortcuts` gains an `event.key === "?"`
   branch calling an `onOpenShortcuts` callback (Shift+/ — the standard
   convention). While ANY Radix dialog is open the editor's global
   shortcuts STAND DOWN (a guard on
   `[role="dialog"][data-state="open"]` — the hand-rolled
   PresentOverlay carries no `data-state` and keeps its existing
   behavior): no accidental tool switches while reading the help.
6. **TDD:** unit RED — the label/completeness pins on the seam (every
   entry labeled, labels unique, the Tools group derives from
   TOOL_SHORTCUTS one-to-one, the View/Editing families present with
   their exact keys, every item carries ≥1 key); e2e RED — the new
   `tests/e2e/keyboard-shortcuts.spec.ts` (the chip visible + clickable,
   the dialog lists all nine tool shortcuts and the editor commands, `?`
   opens, Escape closes with focus return, the stand-down guard, and the
   MOBILE reachability geometry per F35 — the chip in-viewport at 390 +
   tap-opens).

## The tablet-geometry e2e pin — S49-3 (the session-55 suggestion #3, closed)

`tests/e2e/editor-mobile-header.spec.ts` gains a tablet describe at
600×844: Share/Present IN-VIEWPORT (right ≤ 600) and the header a SINGLE
48px row (height 48 — the wrap must NOT engage where content fits; the
mid-range boundary between the 390 wrap and the ≥sm single row).

## The docs alignment — S49-4

- README: the stale Testing-section counts ("121 checks" unit / "142
  browser checks" e2e — lines that lag the tech-stack table's correct
  126/148) updated to the post-session counts; the shortcut-discoverability
  row; the memoization note.
- PAD v1.28.0: the revision block + the file-tree/key-files/test-table
  rows.
- AGENTS.md: the counts + the shortcuts-dialog convention bullet.
- CLAUDE.md: the counts + the pin inventory.
- digma_SKILL v1.27.0: lesson **F36** (comments that describe
  unimplemented memoization are a lie with a expiry date — the
  source-contract pin pattern for render-memoization; and the
  discoverability affordance conventions).
- `docs/session_57.md` (this session's log) + the repo worklog entry +
  this plan's execution status.

## The TDD plan

- **Unit (RED first):** `src/lib/editor.test.ts` grows the label +
  `EDITOR_SHORTCUTS` pins (the seam absent → exact-assertion failures);
  the new `tests/canvas-memo.test.ts` runs RED against the un-memoized
  source. **GREEN:** the seam lands (labels + EDITOR_SHORTCUTS), the
  memo wrapper lands. Expected +N.
- **E2E (RED first):** `tests/e2e/keyboard-shortcuts.spec.ts` (the
  dialog absent → the chip/dialog/listing pins fail at their exact
  assertions) and the tablet describe in
  `tests/e2e/editor-mobile-header.spec.ts` (expected green immediately —
  it pins the live-verified current behavior; it is a regression lock,
  not a fix pin). **GREEN:** the affordance lands. Expected +8.
- **Full gate after GREEN:** `lint → typecheck → unit → build → smoke
  (dev server stopped, unset DATABASE_URL same-command) → e2e`.

## Execution status

- [x] S49-1 — the `React.memo` wrapper on `CanvasElement` (+ the source-contract unit suite `tests/canvas-memo.test.ts`)
- [x] S49-2 — the `TOOL_SHORTCUTS` labels + the `EDITOR_SHORTCUTS` seam + the Keyboard chip + the shortcuts dialog + the `?` key + the stand-down guard (+ the unit pins + `tests/e2e/keyboard-shortcuts.spec.ts`)
- [x] S49-3 — the tablet-geometry pins at 600×844 in `tests/e2e/editor-mobile-header.spec.ts`
- [x] Full gate green — lint · typecheck · unit · build 23 routes · smoke · e2e
- [x] Live verification + screenshots (the standard set re-captured + the new shortcuts-dialog pair + the ref-audit-s54 provenance set; key shots VLM content-checked)
- [x] Docs aligned (README counts + rows, PAD v1.28.0, AGENTS, CLAUDE, digma_SKILL v1.27.0 lesson F36, session_57.md, worklog)
