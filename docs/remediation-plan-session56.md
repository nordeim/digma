# Remediation Plan — Session 56 (the Thirty-Second Audit)

**Date:** 2026-10-02 · **Trigger:** the operator's session-69/70 directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and the Tailwind v4 bug class, use the scandihaven tech-stack patterns, TDD, vitest + playwright, `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, screenshots under `docs/screenshots/`, a verified `.env.example`, aligned docs, push via the SSH wrapper to `main` only) · **Code state at start:** `9d830cc` (session 55 delivered at `c485fb9` + the operator's session-70 log push)

## The audit method

The thirty-second consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
PLUS the fourth systematic **Mode C code audit of the recent changes** —
this session run DEEPER than the prior three passes: alongside the
checklist scan of the session-55 delivery (the `useLayoutEffect` fit
seam, the two `matchMedia` lg-crossing listeners — both verified intact
in source), an independent full-file review of the editor's
state/persistence/interaction seams (editor-store, autosave hook,
canvas gestures, the elements route, the export seams, the properties
panel) against the code-review-checklist dimensions (correctness, data
integrity, error handling, maintainability, consistency). Every finding
below was individually re-verified against the source before entering
this plan (the six-phase VALIDATE step).

## Reference findings (32nd audit — no drift, no new gaps)

- **R3 re-confirmed (32nd): mobile nav failure class A at 390×844** —
  the reference's desktop nav computes `display: none`, its three links
  collapse to 0×0, no hamburger exists, and the only header button is
  the unlabeled 36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s66/ref-01-mobile-dashboard-390.png`.
- **The Teams Create-Team dead chrome (32nd datum): still dead** — both
  buttons open ZERO dialogs (live-verified one click each; the
  `[role=dialog]` count stayed 0 after both).
- **Standing surfaces re-verified (no drift):** the greeting "Good
  morning, sepnetflix2023 ✨" (the name populated — the morning bucket);
  Quick Stats 1 Projects / 0 Teams / 1 Active this week / Pro; the
  Recent sort default "Last Opened" / "1 file found"; the board at 9
  layers — still "Test Project One"; the desktop nav 124/96/92 × 36.
- **The reference's mobile editor header STILL clips Share/Present at
  390×844:** Share L385–R458, Present L466–R551 (evidence
  `ref-audit-s66/ref-02-mobile-editor-header-390.png`); the chip-bar
  datum (the AI input + the clipped Canvas-Properties pair); zero `kbd`
  affordances (32nd datum).

### The clone's mobile navigation verified LIVE, end-to-end at 390×844

(the operator's particular focus — the 32nd consecutive session, all
green; the Tailwind v4 failure class A NOT present): the 44×44 hamburger
with the stable `aria-label="Navigation menu"` + `aria-expanded`/
`aria-controls` contract; the Sheet as a `role=dialog` (288px drawer)
with the three links at 44px targets; `data-scroll-locked` on `<body>`;
focus in the trap; Escape close with focus return + lock release;
navigate-and-dismiss; the 768 boundary (the hamburger `display:none`,
the desktop nav `flex`). **The audit DID find the drawer's own boundary
gap — finding N-1 below.**

## The code audit findings (Mode C — fourth pass, run deeper)

The session-55 delivery itself is clean (both seams verified to hold;
the 185/56/177 gate re-proven green at baseline before any change).
The deeper pass over the interaction/persistence seams found
**2 High / 7 Medium / 6 Low / 2 Informational** — every one verified in
source before this plan was written:

- **H-1 (High): the gesture undo direction is INVERTED.** Canvas
  drags/resizes mutate live without history (by design), but the
  pointer-UP `store.commit()` (`canvas.tsx:261-264`) pushes
  `snapshotOf(state)` — the POST-drag state (`editor-store.ts:307-311`).
  The first Ctrl+Z after any drag restores the state the canvas is
  already in (a silent no-op); the pre-drag layout is unreachable
  except by also reverting an older action. A plain CLICK on an element
  (kind `move`, zero movement) pushes a redundant snapshot AND wipes the
  redo stack (`future: []`) — clicking around destroys redo without any
  mutation. The session-28 log's "two-step undo restoring an accidental
  drag" is this defect's signature. No e2e pins drag-then-single-undo.
- **H-2 (High): the autosave race loses edits made during an in-flight
  PUT.** `flush()` (`editor-view.tsx:87-126`) is unserialized and
  `markSaved` (`editor-store.ts:143-150`) unconditionally replaces
  `elements` with the server list and sets `saveState: "saved"`. An edit
  landing between the PUT body build and its response is silently
  reverted locally, marked Saved, and never re-flushed (the timer's
  callback early-returns on non-"unsaved"). In Untitled mode two
  concurrent flushes can also double-`POST /api/projects`.
- **M-1: autosave failure paths leave `saveState` stuck at "saving".**
  All three failure branches (`ensureProject` → null, `!response.ok`,
  the network catch) return after a toast without resetting the state —
  no retry, a lying "Saving…" badge, and `exit()` (which flushes only
  on `"unsaved"`) then skips the flush.
- **M-2: `exit()`'s flush omits `backgroundColor`.** The autosave PUT
  carries the full body (session 33's S33-3) but `exit()`
  (`editor-view.tsx:784-798`) sends elements-only — a Background change
  followed by Back within the 800ms debounce is silently lost on reload
  (the route treats an absent background as "untouched"). In Untitled
  mode `exit()` skips the flush entirely.
- **M-3: the editor's keyboard shortcuts stay live behind the
  PresentOverlay.** The stand-down guard
  (`editor-view.tsx:163`) matches only `[role="dialog"][data-state="open"]`
  (Radix); the hand-rolled overlay carries `role="dialog"` but no
  `data-state`. While presenting, Delete deletes the (invisible)
  selection, tool keys switch tools, and `?` opens the shortcuts dialog
  over the presentation.
- **M-4: the image-fill whitelist disagrees between client and server.**
  The client accepts any `data:image/…`
  (`properties-panel.tsx:473`); the server's `clampFillImage` whitelists
  only png/jpeg/jpg/gif/svg+xml/webp (`elements/route.ts:28-31`). A BMP
  or AVIF fill paints correctly, then the first autosave PUT nulls it
  server-side and `markSaved` adopts the sanitized list — the fill
  silently vanishes ~1s later with no toast.
- **M-5: every slider tick / keystroke pushes a full undo snapshot.**
  `updateElements` defaults `commit = true` and no properties consumer
  passes `false` — one opacity drag ≈ 20-60 snapshots against the
  60-entry cap, silently evicting the whole prior history. **DEFERRED
  (see dispositions).**
- **M-6: Ctrl+wheel zoom never calls `preventDefault`.** The React
  `onWheel` handler (`canvas.tsx:270-277`) zooms the canvas while the
  browser's native ctrl+wheel page-zoom (and trackpad pinch, delivered
  as ctrl+wheel) fires simultaneously — and React 17+ registers root
  wheel listeners as PASSIVE, so the fix must be a native non-passive
  listener on the container.
- **M-7: the click hit-test ignores `scale` (and mis-anchors rotation).**
  `elementIsPointInside` (`canvas.tsx:44-57`) tests the UNSCALED
  width/height rect while the render chain is
  `translate(x,y) scale(s) rotate(r)` (origin 0px 0px,
  `canvas.tsx:471-472`) — an element at scale 2 renders 4× its hit
  area, so clicks on the outer visual region fall through. The
  rotation branch also rotates around the unscaled CENTER, which does
  not match the render's corner-anchored rotation.
- **L-1: a bare `throw new Error("invalid type at …")` inside the
  elements route's row map escapes the `{ ok, error }` envelope as an
  unstructured 500** (`elements/route.ts:137`).
- **L-2: the route's response `findMany` runs OUTSIDE the
  `$transaction`** — a concurrent PUT landing between the commit and
  the read returns a list this request did not write
  (`elements/route.ts:184-187`).
- **L-3: `toggleVisibility`/`toggleLock` never push undo history**
  (`editor-store.ts:287-297`) — an eye/lock toggle is not individually
  undoable; Ctrl+Z reverts it only bundled with an older action.
- **L-4: the PresentOverlay declares `aria-modal="true"` with no focus
  trap** — Tab escapes the overlay into background content.
- **L-5: the bell popover carries `role="dialog"` with no Escape-close**
  (`app-header.tsx:217-226`) — keyboard users cannot dismiss it.
- **L-6: `boundsOf` ignores rotation** (`src/lib/editor.ts:370-384`) —
  the selection outline and marquee containment misalign for rotated
  elements. **DEFERRED (see dispositions).**
- **N-1 (new, this session's own scan): the mobile NAV drawer survives
  the md crossing.** The two editor Sheets got the lg-crossing close in
  S55-B, but the nav drawer's trigger is `md:hidden`
  (`app-header.tsx:55`) with the portal at `document.body` and NO
  `matchMedia` listener — an OPEN drawer survives the 768 crossing
  floating over the desktop layout where the desktop nav is the
  sanctioned surface. The same defect class, the same fix pattern.
- **I-1 / I-2 (Info, no change warranted):** no per-user ownership
  checks on project routes (the documented shared-workspace design);
  multi-selection has no mobile properties surface (scope-cut).

### Verified clean (explicitly re-checked)

The session-55 seams hold exactly as documented (the
`React.useLayoutEffect` fit at `editor-view.tsx:330` with `compute()`
inside; both `matchMedia("(min-width: 1024px)")` listeners guarded by
`open` with `setOpen` only in the event callback). The undo snapshot
CONTENT already carries `backgroundColor` and filters stale selection
ids. The export seams are clean (blob revoke timing, the XML
declaration, the single anchor helper). The full baseline gate was
re-proven green BEFORE any change: lint, typecheck, 185/185 unit,
build, 56/56 smoke, 177/177 e2e.

## The chosen session work (TDD)

### S56-A — the gesture undo direction (H-1 + L-3)

- The store gains a transient gesture seam: `beginGesture()` captures
  `snapshotOf(state)` into a `gestureSnapshot` field; `endGesture()`
  pushes THAT pre-gesture snapshot into `past` (clearing `future`);
  `cancelGesture()` discards it.
- The canvas captures the PRE-gesture state at pointer-DOWN (the move
  branch and the resize-handle branch both call `beginGesture()`), and
  at pointer-UP pushes it only when the gesture actually moved — a
  `moved` flag on the DragState set in the move/resize branches of
  `onPointerMove`. A plain click (no movement) cancels — no redundant
  snapshot, redo preserved.
- `toggleVisibility`/`toggleLock` join the history-committed family
  (push `past`, clear `future`).
- **Unit pins (behavioral + source):** `tests/gesture-undo.test.ts` —
  the store driven directly (beginGesture → moveElements → endGesture →
  undo() restores the pre-gesture position; a cancelled gesture pushes
  nothing; the eye/lock toggles become single-step undoable) plus
  canvas source-contract pins (beginGesture at both gesture starts,
  endGesture/cancelGesture at pointer-up keyed to `moved`, no bare
  `store.commit()` in `onPointerUp`).
- **E2e pin:** drag → a SINGLE Ctrl+Z → the position restored.

### S56-B — the autosave state machine (H-2 + M-1)

- `flush()` serializes: an in-flight guard plus a pending flag; a flush
  requested while one runs re-runs after it completes (no concurrent
  PUTs, no double project creation).
- The edit-during-flight guard: the flush captures the elements ARRAY
  REFERENCE when it builds the PUT body; on the response, if the
  current reference differs (any mutation landed — the store's
  immutable updates guarantee it) it does NOT `markSaved` — it sets
  `saveState: "unsaved"` (a new `setUnsaved` action) so the follow-up
  flush persists the newer state. If the store's `projectId` swapped
  (navigated to another editor), the stale response is dropped
  entirely.
- Every failure path resets `saveState` to `"unsaved"` (auto re-arm
  via the existing subscriber) with the toast on the FIRST consecutive
  failure only (no toast spam while offline).
- **Unit pin:** `tests/autosave-machine.test.ts` — the serialized
  flush, the reference guard, and the failure resets as source
  contracts.
- **E2e pin:** a route-intercepted 700ms-delayed PUT; edit A commits,
  edit B lands mid-flight; after the dust settles the canvas shows (and
  reloads with) edit B — pre-fix it reverts to A.

### S56-C — exit() flushes through the same machine (M-2)

- `useAutosave` exposes its `flush`; `exit()` calls it whenever
  `saveState !== "saved"` — the full body (elements +
  `backgroundColor`) and the Untitled-mode `ensureProject` flow through
  the SAME serialized path (ADR-009 honored at the exit seam); the
  duplicated elements-only fetch in `exit()` is deleted.
- **E2e pin:** change the canvas background → click Back immediately →
  reopen the project → the background persisted.

### S56-D — present-mode integrity (M-3 + L-4)

- The PresentOverlay's dialog div carries `data-state="open"` — the
  EXISTING stand-down guard then covers it (no shortcuts, no Delete,
  no `?` over the presentation; Escape stays the overlay's own exit).
- A Tab keydown loop keeps focus on the exit affordance — honoring
  `aria-modal="true"`.
- **Unit pin:** `tests/present-integrity.test.ts`. **E2e pin:** open
  Present → press Delete → exit → the element still exists.

### S56-E — the image-fill whitelist parity (M-4)

- The client's data-URL check tightens from `startsWith("data:image/")`
  to exactly the server's five families (png/jpeg/jpg/gif/svg+xml/
  webp) — a BMP/AVIF/ICO pick now gets the EXISTING "Unsupported
  image" toast at read time instead of vanishing after the first
  autosave.
- **Unit pin:** `tests/image-whitelist.test.ts` (the client/server
  regex parity). **E2e pin:** setInputFiles a BMP buffer → the toast.

### S56-F — the ctrl+wheel native listener (M-6)

- The canvas registers a native `wheel` listener on its container with
  `{ passive: false }` and calls `preventDefault()` in the ctrl/meta
  branch (the browser's page-zoom must not ride along); the pan branch
  and the zoom clamps flow through the same store actions; the React
  `onWheel` prop is removed.
- **Unit pin:** `tests/canvas-wheel.test.ts` (source contract: the
  non-passive registration + the preventDefault in the ctrl branch).

### S56-G — the render-consistent hit test (M-7)

- `elementIsPointInside` inverse-maps the point through the render
  chain — `local = rotate(-r) · ((p − (x,y)) / s)` — testing
  `0 ≤ local ≤ (width, height)`: scale-aware AND anchored to the
  render's corner-origin rotation (the old center-anchored branch was
  geometrically inconsistent with `translate·scale·rotate`).
- **Unit pin:** `tests/hit-test.test.ts` (the function exported for
  the pure-geometry pins: the scale-2 outer region, the 90° quad).
  **E2e pin:** scale an element to 2 → click the visual outer region →
  it selects.

### S56-H — the elements route hardening (L-1 + L-2)

- The row-map's bare `throw` becomes a pre-validation loop returning
  `fail("VALIDATION", …, 400)` (the envelope contract).
- The response `findMany` moves INSIDE the interactive transaction.
- **Unit pin:** `tests/route-envelope.test.ts` (source contract).

### S56-I — the nav drawer's md-crossing close + the bell Escape (N-1 + L-5)

- `MobileNav` gains the S55-B pattern at the md boundary: a
  `matchMedia("(min-width: 768px)")` change listener (registered only
  while open, `setOpen(false)` only in the callback) — an OPEN drawer
  closes when the viewport reaches the desktop surface.
- The bell popover closes on Escape (a keydown listener while open,
  the outside-pointerdown pattern).
- **Unit pin:** `tests/nav-crossing.test.ts`. **E2e pins:** the drawer
  crossing 390→1280; the bell Escape.

### Deferred with rationale

- **M-5 (undo coalescing for continuous panel edits):** real
  granularity problem, but the fix (commit-on-blur plumbing through
  every panel consumer, or store-side time-window coalescing) changes
  undo semantics for every consumer and demands its own interaction
  analysis; not a data-loss defect (undo works, the history is
  fine-grained). Deferred as the standing top backlog item.
- **L-6 (rotation-aware `boundsOf`):** the fix interlocks with the
  resize-handle geometry — the handles render FROM `boundsOf` while the
  resize drag math assumes the unrotated model box; a coherent fix
  demands the full rotated-interaction design (rotated handles,
  visual-space resize under rotation). The hit-test half (S56-G) IS
  fixed this session because it is self-contained.
- **I-1 / I-2:** documented design (the shared-workspace clone; the
  mobile multi-selection scope-cut) — no change.

## Planned counts

unit 185 + ~20 = ~205 (gesture-undo 5 + autosave-machine 3 +
present-integrity 3 + image-whitelist 2 + canvas-wheel 2 + hit-test 3 +
route-envelope 2 + nav-crossing 2, final count per RED phase); e2e
177 + ~9 = ~186; smoke 56; build 23 routes.

## RED expectations

- **unit:** the behavioral store specs fail at the absent
  begin/end/cancelGesture actions and the non-undoable toggles; the
  source-contract specs fail at the absent serialization/guard/reset
  seams, the absent `data-state`, the loose image check, the passive
  wheel path, the unscaled hit test, the bare throw, and the absent
  nav `matchMedia`.
- **e2e (against the pre-fix standalone build):** the drag-undo pin
  fails at the still-dragged position after ONE Ctrl+Z; the
  delayed-PUT pin fails at the canvas reverting to edit A; the
  exit-background pin fails at the reverted background; the
  present-Delete pin fails at the vanished element; the BMP pin fails
  at the missing toast; the scale-hit pin fails at the fall-through
  click; the nav-crossing pin fails at the surviving dialog; the bell
  pin fails at the surviving popover.

## Execution order

1. S56-A unit RED → the store gesture seam + the canvas wiring +
   the toggle history → unit GREEN + fast gates.
2. S56-B unit RED → the serialized machine → GREEN.
3. S56-C (the exit seam rides S56-B's machine) → fast gates.
4. S56-D / S56-E / S56-F / S56-G / S56-H / S56-I unit RED → seams →
   GREEN.
5. E2E RED against the pre-fix standalone build (the current build
   predates the src changes) → rebuild → e2e GREEN.
6. Full gate: `lint → typecheck → test → build → smoke (dev server
   stopped, `unset DATABASE_URL` same-command) → test:e2e`.
7. Live verification on the dev server (the gesture undo, the
   mid-flight edit survival, the exit background persistence, the
   present-mode Delete stand-down, the scale-2 click, the nav crossing,
   the mobile nav re-verified the 32nd) + the screenshot set (the
   standard 32 + the ref-audit-s66 evidence set).
8. Docs: PAD v1.35.0, digma_SKILL v1.34.0, AGENTS/CLAUDE/README rows +
   counts, this plan's execution status, the session log
   (docs/session_71.md), the repo worklog entry.

## Execution status

- [x] S56-A — the gesture undo direction (unit +7: the
  `beginGesture/endGesture/cancelGesture` store seam with the
  `gestureSnapshot` pre-state, the canvas pointer-up wiring, the
  plain-click no-snapshot pin, the toggle history)
- [x] S56-B — the autosave state machine (unit +4: the serialized
  flush chain, the mid-flight edit survival, the failure-path reset,
  the Untitled double-POST guard + the gesture-deferral adoption)
- [x] S56-C — exit() flush parity (rides S56-B's machine — the full
  body including `backgroundColor`, Untitled-mode create-then-flush)
- [x] S56-D — present-mode integrity (unit +2: the overlay
  `data-state="open"` + the Tab focus loop → the stand-down guard
  matches, tool keys stand down behind the presentation)
- [x] S56-E — image-fill whitelist parity (unit +2: the normalized
  `jpeg|jpg|png|webp|gif|svg` check on both sides)
- [x] S56-F — the ctrl+wheel native listener (unit +2: the
  `non-passive capture` wheel seam on the canvas container)
- [x] S56-G — the render-consistent hit test (unit +3: the
  center-based rotation model matching the render transform)
- [x] S56-H — the elements route hardening (unit +2: the validated
  envelope + the 4xx JSON error shape instead of the bare throw)
- [x] S56-I — the nav drawer md-crossing close + the bell Escape
  (unit +5: the `matchMedia("(min-width: 768px)")` close listener +
  the bell popover's Escape dismissal)
- [x] Full gate green — zero regressions (lint · typecheck · 212 unit
  = 185 + 27 · build 23 routes · 56 smoke · 187 e2e = 177 + 10;
  re-verified pre-commit: lint · typecheck · 212 unit · build)
- [x] Live verification + screenshots + docs (the gesture undo, the
  mid-flight edit survival, the present-mode Delete stand-down, the
  bell Escape, the nav crossing at 768, the mobile nav contract the
  32nd consecutive session; the standard 32 + the ref-audit-s66
  evidence set re-captured on the S56 build — 55/55
  dimension-checked, the key shots VLM content-verified; docs at PAD
  v1.35.0 / digma_SKILL v1.34.0 / session_71.md)
