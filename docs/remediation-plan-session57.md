# Remediation Plan — Session 57 (the Thirty-Third Audit)

**Date:** 2026-10-02 · **Trigger:** the operator's session-71/72 directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and the Tailwind v4 bug class, use the scandihaven tech-stack patterns, TDD, vitest + playwright, `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, screenshots under `docs/screenshots/`, a verified `.env.example`, aligned docs, push via the SSH wrapper to `main` only) · **Code state at start:** `1ad63bc` (session 56 delivered at `5a32469` + the operator's session-72 log push)

## The audit method

The thirty-third consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
PLUS the fifth systematic **Mode C code audit of the recent changes** —
this session's pass combined (a) the lead auditor's hunk-by-hunk review of
the session-56 delivery (all nine seams re-verified intact in source),
(b) an independent fresh-eyes full-file review — by a separate agent —
of the editor files that had never had one (layers-panel, toolbar,
components-panel, ai-assistant, plus the shortcuts/AI/present regions of
editor-view and a fresh pass over canvas), against the
code-review-checklist dimensions, and (c) live-DOM verification of the
claims that could be probed on the running build (the Download menu's
role/data-state vs the stand-down guard). Every finding below was
individually re-verified against the source (or the live DOM) before
entering this plan.

## Reference findings (33rd audit — no drift, no new gaps)

- **R3 re-confirmed (33rd): mobile nav failure class A at 390×844** —
  the reference's desktop nav computes `display: none`, its three links
  collapse to 0×0, no hamburger exists, and the only header button is
  the unlabeled 36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s67/ref-01-mobile-dashboard-390.png`.
- **The Teams Create-Team dead chrome (33rd datum): still dead** — both
  buttons open ZERO dialogs (live-verified one click each; the
  `[role=dialog]` count stayed 0 after both; still on `/Teams`).
- **Standing surfaces re-verified (no drift):** the greeting "Good
  morning, sepnetflix2023 ✨" (the name populated — the morning bucket);
  Quick Stats 1 Projects / 0 Teams / 1 Active this week / Pro; the
  Recent sort default "Last Opened" / "1 file found"; the board at 9
  layers — still "Test Project One"; the desktop nav 124/96/92 × 36 with
  the 36px bell; zero `kbd` affordances (33rd datum).
- **The reference's mobile editor header STILL clips Share/Present at
  390×844:** Share L385–R458, Present L466–R551 (re-measured exactly;
  evidence `ref-audit-s67/ref-02-mobile-editor-header-390.png`); the
  chip-bar datum (the AI input + the clipped pair); the desktop baseline
  captured (`ref-audit-s67/ref-00-desktop-dashboard-1440.png`).

### The clone's mobile navigation verified LIVE, end-to-end at 390×844

(the operator's particular focus — the 33rd consecutive session, all
green; the Tailwind v4 failure class A NOT present): the 44×44 hamburger
with the stable `aria-label="Navigation menu"` + `aria-expanded`/
`aria-controls` contract at [16,10]; the Sheet as a `role=dialog`
(288px drawer) with the three links at 44px targets and the
aria-describedby wiring; `data-scroll-locked` on `<body>`; focus in the
trap; Escape close with focus return + lock release; navigate-and-
dismiss; the S56-I md-crossing close re-verified live (390→1280 — the
drawer unmounts with lock release); the 768 boundary (the hamburger
`display:none`, the desktop nav `flex`). Run via
`/home/z/my-project/scripts/verify-mobile-nav-s57.sh` — 8/8 PASS.

## The code audit findings (Mode C — fifth pass)

The session-56 delivery itself is clean (all nine seams verified to
hold; the 212/56/187 gate re-proven green at baseline before any
change). The fresh-eyes pass over the never-independently-reviewed
editor files found **1 High / 6 Medium / 8 Low / 7 Informational** —
every chosen finding individually re-verified:

- **H-1 (High): a leaked `gestureSnapshot` turns the autosave machine
  into an infinite PUT loop that never reaches "saved".** Three
  independently-verified links in the chain: (1) `loadProject`
  (`editor-store.ts:144-155`) resets projectId/elements/past/future/
  saveState but NOT `gestureSnapshot`; (2) the flush's post-success
  gesture-deferral (`editor-view.tsx:182-185`) calls `setUnsaved()` and
  returns whenever `gestureSnapshot !== null` — including a STALE one;
  (3) the subscriber (`editor-view.tsx:215-220`) re-arms the 800ms
  timer on every unsaved transition. Result: PUT → setUnsaved → 800ms →
  PUT → … forever, one full-elements PUT per cycle, the badge cycling
  Unsaved/Saving with `aria-live` announcements, `saveState` never
  reaching "saved" (so a later `exit()` flush would ALSO loop). A
  gesture leaks whenever its pointerdown never gets its pointerup/
  pointerleave pair — an unmount mid-drag (e.g. touch-drag with one
  finger + tap Back with another), or a `pointercancel` not followed by
  the spec's pointerleave. No code path clears a stale snapshot today
  (exhaustive grep: only beginGesture's overwrite, the pointer-up
  end/cancel, and the store-creation initial value).
- **M-1: the stale-response swap guard is bypassed in Untitled mode.**
  `editor-view.tsx:168` — `if (capturedProjectId && now.projectId !==
  capturedProjectId) return;` — the falsy `""` disables the guard
  exactly in Untitled mode. A stale Untitled flush response landing
  after the user exited and opened project X calls `now.setUnsaved()`
  over X's just-loaded state — a spurious full PUT of unchanged data
  plus an "Unsaved" badge flash on a pristine project.
- **M-2 (escalation of M-1): exiting during the `ensureProject` POST
  flight clobbers the NEXT project's store identity and URL.**
  `ensureProject` (`editor-view.tsx:85-105`) re-checks nothing after
  its `await`: the stale continuation runs `attachProject(createdId)` —
  overwriting project X's id in the module-singleton store — and
  `history.replaceState` rewrites the CURRENT history entry (now
  `/Editor?projectId=X`) to the created id. The subsequent PUT then
  writes the body read at call time — project X's elements — into the
  freshly created project: cross-project content duplication plus a
  store/URL mismatch. Narrow window, real data-integrity corruption.
- **M-3: the shortcuts stand-down guard misses the open DropdownMenu —
  the session-56 M-3 fix class, one role short.** The guard
  (`editor-view.tsx:253`) matches only `[role="dialog"]
  [data-state="open"]`; the Download format menu renders `role="menu"`
  with `data-state="open"` (live-DOM verified: menu present, guard
  matches nothing). While the menu is open, tool keys switch tools
  behind it, Delete deletes the invisible selection, `?` stacks the
  shortcuts dialog over the menu, and Escape double-actions (closes the
  menu AND deselects).
- **M-4: no `onPointerCancel` handling — a canceled pointer leaves a
  stuck drag AND a leaked gesture; `onPointerMove` has no
  buttons-pressed check.** The container wires only down/move/up/leave
  (`canvas.tsx:355-358`); a repo-wide grep finds no pointercancel
  handler. After a cancel, `drag` stays at kind move/resize and
  `onPointerMove` (`canvas.tsx:179-213`) checks only `drag.kind` — the
  next HOVER pointermove (buttons === 0) drags or resizes elements:
  ghost movement on hybrid touch+mouse devices. It is also the cleanest
  real-world trigger for H-1's leak loop.
- **M-5: the space-to-pan keydown `preventDefault` kills Space
  activation of every button on the editor page.**
  `canvas.tsx:323-328` — only typing targets are exempted; with focus
  on ANY button (Back, Undo/Redo, Share, Present, toolbar tools, panel
  chips) the window-level listener cancels the button's Space
  activation (Enter still works). A keyboard user cannot activate any
  editor control with Space while the canvas is mounted.
- **M-6: an AI update op carrying `scale` silently DROPS its sibling
  patch fields.** `ai-assistant.tsx:92-96` — the `continue` after
  `scaleElements` skips the `updateElements` call, so any fill/opacity/
  width/height/text built into the same patch is discarded. The LLM
  sanitizer CAN produce combined patches (`lib/ai-assistant.ts:279-284`
  copies all six fields into one patch), so "make the button red and
  25% bigger" applies only the scale while the footer reports the
  action as performed.
- **L-1: the Select All / Deselect All toggle can never flip when any
  layer is hidden.** `layers-panel.tsx:57` compares
  `selectedIds.length === elements.length` but `selectAll`
  (`editor-store.ts:196`) selects VISIBLE-only — with ≥1 hidden layer
  the count never reaches equality, the label stays "Select All", and
  every click re-runs `selectAll()`.
- **L-2: the eye button's keyboard focus reveal is dead — a broken
  Tailwind variant string.** `layers-panel.tsx:176` —
  `aria-hidden:focus:opacity-100` compiles to `[aria-hidden="true"]:
  focus:…` but the BUTTON never carries `aria-hidden` (only the inner
  Eye icon does), so the variant never matches; a keyboard-focused eye
  button stays invisible (the lock/trash buttons correctly use
  `focus:opacity-100`).
- **L-3: the layers row's keyboard contract is Enter-only (no Space
  activation).** `layers-panel.tsx:127-133` — `role="button"` rows must
  activate on Space per the WAI-ARIA pattern. (The deeper invalid-ARIA
  nesting — interactive descendants inside the role=button row — is
  deferred with rationale below.)
- **L-5: a double separator renders between Hand and Frame in the
  toolbar.** `toolbar.tsx:61` renders a divider before the `frame`
  entry AND `toolbar.tsx:79` renders a second one after index 1 (Hand)
  — two stacked 1px separators where the file's own comment describes
  one.
- **Deferred Lows (with rationale):** L-4 pointer capture for move/
  draw/marquee (a drag dies at the canvas boundary — a real
  interaction-feel gap, but the fix changes gesture semantics and
  deserves its own interaction analysis); L-20 zoom-to-cursor
  anchoring (the clone's own superset; the button cluster shares the
  origin-anchored behavior by reference parity); L-9 the AI chat's
  missing aria-live (an announcement-design question, not a one-line
  fix); L-14 the `loading` flag not resetting on a same-route
  projectId change (defensive — no in-app path navigates Editor→Editor
  today); L-8 `applyOperations` filtering against a stale elements
  snapshot (narrow: the LLM cannot know freshly minted local ids);
  I-1..I-7 the informational set (the lock-contract disagreement
  between canvas/layers/marquee — a design decision to document; the
  dead "New component" button — documented reference parity; present
  mode fitting the fixed 1000×700 board — the export-board contract;
  `setName` dead code; `isTypingTarget` duplicated in two files — fold
  into the next touch of either file; the viewport bleed across editor
  sessions — a quirk, not a defect).

### Verified clean (explicitly re-checked)

All nine session-56 seams hold exactly as documented: the store's
beginGesture/endGesture/cancelGesture with the pre-state
`gestureSnapshot` (`editor-store.ts:337-347`); the serialized autosave
machine (the in-flight guard, the pending re-run, the
reference-guard, the failure resets — `editor-view.tsx:77-201`); the
PresentOverlay `data-state="open"` + Tab loop; the image whitelist
parity regex; the non-passive native wheel listener with cleanup
(`canvas.tsx:305-319`); the render-consistent hit test inverting
`translate·scale·rotate` with origin 0px 0px; the route's
pre-validation loop + the transactional read; the nav drawer's
md-crossing listener; the bell Escape. The S56-G hit-test math and the
S56-A gesture wiring were independently re-derived by the fresh-eyes
pass and found correct.

## The chosen session work (TDD)

### S57-A — the gesture lifecycle hardening (H-1 + M-4)

- `loadProject` resets `gestureSnapshot: null` (the leak cannot cross
  an editor session boundary).
- The canvas container gains `onPointerCancel={onPointerUp}` — the
  same end path as pointer-up (endGesture when moved, cancelGesture
  when not, the drag state reset). Per the Pointer Events spec a
  pointercancel is NOT followed by pointerup, so the cancel path needs
  its own wiring (the spec's pointerleave may or may not fire depending
  on the cancel reason).
- `onPointerMove` gains a buttons-pressed guard at the top: any
  move/pan/resize/marquee/drag gesture with `event.buttons === 0`
  (a hover — the button was released or the pointer was canceled
  elsewhere) routes to the same end path instead of mutating: no ghost
  movement, no stuck drag.
- **Unit pins:** `tests/gesture-lifecycle.test.ts` — the behavioral
  store pin (beginGesture → loadProject → gestureSnapshot null; a
  leaked snapshot cannot survive the session boundary) + the canvas
  source-contract pins (the onPointerCancel wiring, the buttons guard
  before the mutation branches).
- **E2e pin:** start a drag → dispatch `pointercancel` → a hover
  pointermove does NOT move the element → Ctrl+Z still restores the
  pre-drag position (the canceled gesture ended cleanly through the
  end path).

### S57-B — the autosave identity guards (M-1 + M-2)

- The response paths gain a `disposed` gate: after every `await`, a
  disposed (unmounted) instance performs NO store mutation — no
  `markSaved`, no `setUnsaved`, no spurious unsaved over the next
  project's just-loaded state (M-1). The failure paths and the network
  catch keep their toast (the toast system is global and honest) but
  skip the `setUnsaved` retry-arm after unmount. The pending re-run in
  the finally block stays deliberately NOT disposed-gated — it IS the
  exit save (the exit flush requested while one was in flight); its
  own response then hits the disposed gate.
- `ensureProject` gains an adoption guard after its `await`: the
  `attachProject` + `history.replaceState` run ONLY when the instance
  is still live AND the store is still in Untitled mode
  (`projectId === ""`). The created id is still RETURNED (the PUT
  persists the untitled content server-side — the exit save works),
  but a stale continuation can never clobber another project's store
  identity or rewrite its URL (M-2).
- **Unit pins:** `tests/autosave-identity.test.ts` — the source
  contracts (the disposed gate before the store-mutating response
  paths; the adoption guard inside ensureProject).
- **E2e pin (route-intercepted):** a 400ms-delayed `POST
  /api/projects` — edit in Untitled mode → click Back immediately →
  enter the seeded project B → after the flight settles, the URL is
  still `/Editor?projectId=<B>`, B's layers are intact, and B's badge
  shows Saved (no spurious Unsaved cycle).

### S57-C — the stand-down guard covers open menus (M-3)

- The shortcuts guard's selector extends to
  `[role="dialog"][data-state="open"], [role="menu"][data-state="open"]`
  — the Download format menu joins the Radix dialogs and the
  PresentOverlay under the stand-down contract (no tool switches, no
  Delete, no `?` behind an open menu; Escape stays the menu's own
  close via Radix, no double-action deselect).
- **Unit pin:** `tests/menu-standdown.test.ts` (the extended selector
  as a source contract). **E2e pin:** open the Download menu → press
  Delete → close the menu → the element still exists.

### S57-D — the space-to-pan exemption for interactive targets (M-5)

- The space keydown exempts interactive elements (button, a,
  [role="button"], [role="slider"], [role="tab"], input, select,
  textarea — a `isSpaceActivationTarget` helper beside the existing
  `isTypingTarget`): Space activates the focused control instead of
  engaging the pan. Typing targets keep the existing exemption (they
  type the space).
- **Unit pin:** `tests/space-pan.test.ts` (the source contract: the
  exemption helper consulted in the keydown). **E2e pin:** focus a
  toolbar tool button → press Space → the tool activates
  (aria-pressed flips), the canvas does not pan.

### S57-E — the AI patch scale no longer drops siblings (M-6)

- The scale branch loses its `continue`: `scaleElements` applies, then
  the remaining sibling fields (fill/opacity/width/height/text) flow
  through `updateElements` as usual; `applied` counts the operation
  once (a did-flag), honoring the file's honest-count doctrine.
- **Unit pin:** `tests/ai-patch.test.ts` (the source contract: no
  bare `continue` in the scale branch; the single applied increment).

### S57-F — the Low a11y batch (L-1 + L-2 + L-3 + L-5)

- The eye button's broken variant string becomes `focus:opacity-100`
  (the lock/trash convention — a keyboard-focused eye button is
  visible).
- The Select All toggle's flip condition becomes "every visible
  element is selected" (`elements.some(el => el.visible) &&
  elements.filter(el => el.visible).every(el => selectedIds.includes(
  el.id))`) — the label flips with hidden layers present, and the
  empty-visible case stays "Select All".
- The layers row's keydown activates on Space as well as Enter (the
  WAI-ARIA button pattern).
- The toolbar's `index === 1` duplicate separator is removed (the
  frame/pen separators carry the grouping alone).
- **Unit pins:** `tests/layers-a11y.test.ts` (the four source
  contracts). **E2e pin:** hide a layer → click Select All → the
  label flips to "Deselect All".

## Planned counts

unit 212 + ~16 = ~228 (gesture-lifecycle 4 + autosave-identity 3 +
menu-standdown 2 + space-pan 2 + ai-patch 2 + layers-a11y 4, final
count per RED phase); e2e 187 + ~6 = ~193; smoke 56; build 23 routes.

## RED expectations

- **unit:** the behavioral gesture-lifecycle spec fails at loadProject's
  absent reset; the source-contract specs fail at the absent
  onPointerCancel wiring, the absent buttons guard, the absent disposed
  gate, the absent adoption guard, the old single-role selector, the
  unexempted space keydown, the scale branch's `continue`, and the four
  layers/toolbar defects.
- **e2e (against the pre-fix standalone build):** the pointercancel pin
  fails at the ghost-moved element (or the stuck drag); the
  exit-flight pin fails at the rewritten URL (or the spurious Unsaved
  cycle); the menu-Delete pin fails at the vanished element; the
  space-activation pin fails at the un-flipped aria-pressed; the
  select-all pin fails at the un-flipped label.

## Execution order

1. S57-A unit RED → the loadProject reset + the pointercancel wiring +
   the buttons guard → unit GREEN + fast gates.
2. S57-B unit RED → the disposed gates + the adoption guard → GREEN.
3. S57-C / S57-D / S57-E / S57-F unit RED → the seams → GREEN.
4. E2E RED against the pre-fix standalone build (the current build
   predates the src changes) → rebuild → e2e GREEN.
5. Full gate: `lint → typecheck → test → build → smoke (dev server
   stopped, `unset DATABASE_URL` same-command) → test:e2e`.
6. Live verification on the dev server (the pointercancel recovery,
   the exit-flight identity, the menu stand-down, the space activation,
   the mobile nav contract re-verified the 34th session running) + the
   screenshot set (the standard 32 + the ref-audit-s67 evidence set).
7. Docs: PAD v1.36.0, digma_SKILL v1.35.0, AGENTS/CLAUDE/README rows +
   counts, this plan's execution status, the session log
   (docs/session_73.md), the repo worklog entry.

## Execution status

- [x] S57-A — the gesture lifecycle hardening (unit +4: the loadProject
  `gestureSnapshot: null` reset + the behavioral leaked-gesture pin + the
  `onPointerCancel={onPointerUp}` wiring + the `event.buttons === 0`
  hover guard before every mutation branch)
- [x] S57-B — the autosave identity guards (unit +5: the three
  disposed-gated failure paths + the success-path disposed return + the
  ensureProject adoption guard (live + still-Untitled) + the captured
  PUT body — `capturedElements` + `capturedBackgroundColor`, never a
  live re-read across the await; discovered en-route while validating
  the M-2 e2e: the live body read was writing the next project's
  elements into the created project, silently losing the untitled
  content)
- [x] S57-C — the menu stand-down (unit +2: the extended
  `[role="dialog"][data-state="open"], [role="menu"][data-state="open"]`
  selector + the guard-before-handling order pin; live-DOM verified
  pre-fix: the menu present, the old guard matching nothing)
- [x] S57-D — the space-to-pan exemption (unit +2: the
  `isSpaceActivationTarget` helper + the keydown consultation before
  preventDefault)
- [x] S57-E — the AI patch scale siblings (unit +2: no `continue`
  between scaleElements and updateElements + the did-flag single
  increment)
- [x] S57-F — the Low a11y batch (unit +4: the eye focus variant + the
  visible-aware select-all flip with the empty-canvas quirk preserved +
  the row Space activation + the single toolbar separator)
- [x] Full gate green — zero regressions (lint · typecheck · 231 unit
  = 212 + 19 · build 23 routes · 56 smoke · 192 e2e = 187 + 5; the
  fast gates re-verified pre-commit)
- [x] Live verification + screenshots + docs (the mobile nav contract
  re-verified ALL GREEN on the S57 build — 8/8 via the single-call
  verifier; the menu stand-down live (6 elements survive Delete behind
  the open menu); the space activation live (Hand aria-pressed
  false → true); the toolbar sequence live (Select, Hand, SEP, Frame,
  Rectangle, Ellipse, Line, SEP, Pen, Text, Image — single separators);
  the exit-flight identity + the pointercancel recovery pinned by the
  e2e against the pre-fix build (the URL-rewrite failure
  live-reproducing the M-2 clobber); the standard 32 re-captured + the
  ref-audit-s67 evidence set — 36 shots ZERO failures (the F42 state
  check inline), 55/55 dimension-checked across the standing sets, the
  key shots VLM-verified with three VLM misreads adjudicated by live
  geometry (scale(1.28571) = the exact 900/700 fit; the exit button at
  [245,784,129,44] fully in-viewport; the reference's Share L385–R458
  being the clipping datum itself); docs at PAD v1.36.0 / digma_SKILL
  v1.35.0 (lesson F44) / session_73)
