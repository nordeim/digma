# Digma — Session 23 Remediation Plan (v1.13.0 target)

**Date:** 2026-09-29 · **Input:** tenth live parity audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-22 code @ `4f9017b`), desktop 1440×900 and
mobile 390×844, DOM/computed-style level + **functional interaction testing** (the
F19/F20 functional sweep the session-24 log directed: the resize-handle paths at
non-default zoom, the drag-move semantics on locked/hidden elements, and the marquee's
edge behavior — partial containment and shift-add). **Method:** every finding below was
verified in BOTH apps' DOMs before entering this plan, and the plan was re-validated
line-by-line against the codebase before execution.

---

## Context

Session 22 (commit `29c1d07` + transcript pushes `fd431fe`/`4f9017b`, PAD v1.12.0)
closed the interactive-control functional-quality gaps (the precise stateless
drag-reorder, the properties number inputs' empty-draft semantics, the hex input's
accessible name) and recorded the ninth consecutive full parity audit. This session
executed the next-steps directive — the F19/F20 sweep of the remaining interactive
paths: **the resize handles at non-default zoom**, **the drag-move semantics on locked
and hidden elements**, and **the marquee's edge behavior** — plus the standard
parity-hold sweep.

The baseline fast gates were re-run green BEFORE any change: lint ✅ · typecheck ✅ ·
74/74 unit ✅ (the full gate — build/smoke/e2e — re-verified after the changes). Dev
server healthy with the DB anchored at the repo root
(`[db] DATABASE_URL -> file:/home/z/my-project/digma/db/custom.db`; the
`env -u DATABASE_URL` discipline for every gate command; the parent-workspace `.env`
trap is present and neutralized). Test suites verified present: vitest (74
checks) + playwright (70 checks), both excluding `skills/`.

### What the functional sweep found in the REFERENCE (no clone change — its own bug class)

- **The reference's locked element is a pointer WALL.** Measured live on the stacked
  rectangles (Rectangle 2 locked over Rectangle 1, exactly overlapping): a real
  mouse drag on the stack moved NOTHING — the locked element does not move AND the
  unlocked element directly beneath it does not move either. A real click on a
  locked element selects NOTHING (no "N selected" badge, no ring classes) — and a
  real click on a locked element that is ROW-SELECTED (selected via its layer row)
  PRESERVES the selection (badge stays "1 selected"): the interaction is fully
  consumed, the selection state untouched. The locked element carries the
  `cursor-not-allowed` class (its measured chrome). The lock blocks canvas
  interaction the way a wall blocks a pointer: nothing passes through to what is
  beneath.
- **The reference's marquee is still a NO-OP** (re-confirmed this session: a
  full-canvas drag covering all three stacked shapes produced no rect, no counter,
  no selection — consistent with the session-22 finding).
- **The reference's zoom cluster is still erratic** (this session: the persisted
  stuck state loaded at 10%; the zoom-in button then worked step-by-step back to
  workable levels — 10 → 12 → 14 → 17 → 21 → … — after a reload; the erratic
  class persists).
- **The reference's mobile nav still ships failure class A** at 390×844 (nav
  `display: none`, NO hamburger, the 36×36 bell only — re-confirmed this session).

### What the sweep VERIFIED CORRECT in the clone (no change — the working superset)

- **The resize math at non-default zoom is EXACT.** Live-verified at 120% zoom: a
  60 screen-px east-handle drag grew the Headline's model width by exactly +50px
  (320 → 370) — the `toCanvas()` zoom division and the model-space resize
  arithmetic are correct (the handles do scale with the zoom wrapper — 8px × zoom
  — a cosmetic superset choice; the reference ships no handles at all).
- **The marquee's containment semantics are correct.** A marquee covering only the
  LEFT HALF of the CTA Button selected NOTHING (containment, not intersection); a
  marquee fully containing the CTA Label selected exactly it.
- **Canvas shift-click add/remove works.** Plain click → "1 selected"; real
  shift+click on a second element → "2 selected" + the dashed multi-outline;
  shift+click again → "1 selected" (removed).
- **Hidden elements are gone from the pointer world.** With the CTA Button hidden
  (eye), a click where it used to be selected the Hero Section frame beneath —
  the hidden element is neither rendered nor hit-testable (the session-20
  contract, coherent).
- **The locked element itself cannot be dragged.** A real drag on the locked Glow
  left its transform unchanged (the current `pointer-events: none` blocks the
  element's own drag) — but see S23-1: the drag falls THROUGH.
- **Row-click selects a locked element in BOTH apps** (the layer row is the
  selection path for locked elements — parity holds).

### Findings (all verified live in both apps; the clone ones with functional proof)

| # | Finding | Severity |
|---|---------|----------|
| S23-1 | **The clone's locked element is a pointer WINDOW, not a wall — a drag over it displaces the element BENEATH it.** The canvas click hit-test skips locked elements (`.find((el) => el.visible && !el.locked && …)` in `canvas.tsx`) AND the rendered element carries `pointerEvents: element.locked ? "none" : "auto"` — both make the locked element transparent to the pointer, so the interaction falls through to whatever is underneath. Live-verified: with Glow locked, a real drag on Glow's center DISPLACED the Hero Section frame beneath it (+100, +50 — the frame teleported 104px in canvas space); the reference's identical drag moved NOTHING (its lock intercepts and consumes). The same fall-through fires on click: clicking a locked element OVER another element selects the element beneath (replacing the current selection — the reference preserves it). This is a data-integrity defect: the user's locked element is "protected" while the elements under it get corrupted by exactly the interactions the lock was supposed to block. | **High** |
| S23-2 | **A row-selected locked element renders the 8 resize handles — a locked element is canvas-RESIZABLE.** The handles block renders for `selected.length === 1` with no lock check, so locking an element and row-selecting it offers the resize affordance the wall contract forbids (a locked element that cannot be canvas-dragged should not be canvas-RESIZED either — the internal inconsistency the F19 lesson flags). The reference ships no handles at all (measured twice), so this is superset-coherence, not chrome parity. | **Medium** |
| S23-3 | **`moveElements` has no locked guard — Select All + drag moves locked elements too.** The Layers header "Select All" selects every VISIBLE element (including locked ones — `elements.filter(el => el.visible)`), and a subsequent canvas drag of any unlocked selected element calls `moveElements(all ids)` which moves every id unconditionally, locked included. Same wall-contract incoherence in the store's move seam. | **Medium** |

**Deliberate superset notes (no change):** the clone keeps its working marquee
(containment semantics over the reference's no-op), its clean multiplicative zoom,
its visible selection ring + 8 resize handles (on UNLOCKED elements after this fix),
its precise drag-reorder, and its row-click selection of locked elements (parity).
The properties panel remains editable for a row-selected locked element (the
reference's inputs are display-only no-ops, so there is no parity data; the panel
stays the clone's working superset — the lock blocks CANVAS interaction, matching
the reference's wall). The marquee continues to exclude locked elements from
selection (sensible superset semantics; the reference's marquee is dead).

---

## P1 — Code changes (TDD, one coherent slice)

### Slice A — S23-1/2/3: the locked element as a pointer wall

**Files:** `src/components/editor/canvas.tsx`, `src/components/editor/editor-store.ts`.

1. **The hit-test treats the topmost VISIBLE element as terminal when locked** —
   `canvas.tsx`'s select-tool hit path:
   ```tsx
   // select tool: hit-test the TOPMOST VISIBLE element (a LOCKED element is
   // hit too — it is a pointer WALL: the interaction is consumed, nothing
   // beneath is selected, moved, or deselected — reference parity, S23-1).
   const hit = [...elements]
     .reverse()
     .find((el) => el.visible && elementIsPointInside(el, point.x, point.y));
   if (hit) {
     if (hit.locked) return; // wall: fully consumed, selection preserved
     … // existing select + move-drag logic, unchanged
   }
   ```
   Removing `!el.locked` from the find makes the locked topmost element the hit;
   the early return consumes the interaction (no select, no deselect, no drag) —
   exactly the reference's measured semantics (drag wall, click wall,
   selection-preserving).
2. **The locked element's chrome becomes the reference's** — `CanvasElement`:
   drop `pointerEvents: element.locked ? "none" : "auto"` (locked elements are
   pointer-INTERCEPTING now — the container's bubbled handlers do the logic), add
   the reference's measured `cursor-not-allowed` class when locked (the computed
   cursor is the reference's `not-allowed`; unlocked elements keep the existing
   inline default/crosshair cursor).
3. **A locked single-selection renders the outline but NO resize handles** — the
   handles block: `{!selected[0]!.locked && HANDLES.map(…)}` inside the existing
   single-selection outline wrapper (the outline still renders — the selection
   stays VISIBLE via the row highlight + outline; the transform affordance is
   what the wall forbids).
4. **`moveElements` skips locked ids** — the store's move seam gains the guard
   (and only flips `saveState` when something actually moved):
   ```ts
   moveElements: (ids, dx, dy) =>
     set((state) => {
       const idSet = new Set(ids);
       let moved = false;
       const elements = state.elements.map((el) => {
         if (idSet.has(el.id) && !el.locked) {
           moved = true;
           return { ...el, x: el.x + dx, y: el.y + dy };
         }
         return el;
       });
       return moved ? { elements, saveState: "unsaved" } : {};
     }),
   ```

- **Tests (RED first):** `tests/e2e/editor-panels.spec.ts` — a new describe
  ("locked-element pointer contract (session 23)") with five tests:
  1. "a drag over a locked element never displaces the element beneath it" —
     lock the Glow row, read the Hero Section frame's `style` (transform
     `translate(120px, 80px)`), perform a real `page.mouse` drag across Glow's
     center, assert the frame's transform is UNCHANGED (pre-fix: the frame
     teleports) and Glow's too.
  2. "a click on a locked element neither selects it nor clears the current
     selection" — row-select the Headline ("1 selected"), click the locked
     Glow's canvas center, assert the badge still reads "1 selected" (pre-fix:
     the click falls through to the Hero Section frame beneath Glow and REPLACES
     the selection — and at Glow's center, pre-fix even selects the frame).
  3. "the locked canvas element renders the reference's not-allowed cursor" —
     lock Glow, assert its canvas element's computed `cursor` is `not-allowed`
     (pre-fix: `none` pointer-events inherit the underlying cursor).
  4. "a locked single-selection renders the outline but no resize handles" —
     lock Glow, row-select it, assert the selection outline is present and the
     handle count is 0 (pre-fix: 8 handles).
  5. "Select All + drag moves only the unlocked elements" — click the Layers
     header "Select All", drag the Headline, assert the Headline moved AND the
     locked Glow's transform is unchanged (pre-fix: Glow moves too).
  The drag mechanics use `page.mouse` (real input events — the canvas listens
  to pointer events, which Playwright's mouse API produces); the
  `waitForAutosave(page)` helper is used after each mutating test (the
  session-21 discipline: the 800ms debounce's cleanup discards a pending
  flush).

## P2 — Documentation alignment (post-fix)

- **PAD → v1.13.0:** new revision block (the S23-1…S23-3 findings + the
  reference-side wall semantics + the tenth-audit record); the canvas facts gain
  the locked-pointer-wall contract (hit-test terminal, no handles on locked
  selection, `cursor-not-allowed` chrome); the store facts gain the
  `moveElements` locked guard; §7.1/§7.4 counts refreshed (e2e 70 → 75).
- **AGENTS.md:** the mobile-nav-adjacent lock facts — the lock bullet gains the
  wall contract (the reference's locked element intercepts the pointer; the
  clone's hit-test is terminal on locked; no fall-through).
- **CLAUDE.md:** ditto (the editor facts).
- **README.md:** the canvas editor feature row (locked elements are pointer
  walls — dragging over one never disturbs what's beneath) + the test counts.
- **digma_SKILL.md → v1.12.0:** lesson **F21** (a control that "does nothing on
  X" can do it two ways — as a WALL (intercept and consume; the reference's
  lock) or as a WINDOW (transparent; the clone's `pointer-events: none`) — and
  the difference is user-visible data integrity: the window lets the
  interaction fall through and corrupt the element BENEATH. When porting a
  "blocked" interaction, pin what happens to what's under it) + §5/§6 rows
  refreshed + counts.
- `docs/remediation-plan-session23.md` (this plan + execution status) +
  `docs/session_25.md` (this session's structured log — session 24 by the work
  count; the session_24.md filename holds the operator-pushed transcript of the
  session-22 conversation) + `worklog.md` Task 35 entry.

## P3 — Delivery

- Screenshots: re-capture the standard set from the remediated dev server →
  `docs/screenshots/`; audit provenance (the reference's locked-wall drag
  evidence, the reference's mobile failure-class-A capture, the clone post-fix
  locked-wall evidence) → `docs/screenshots/ref-audit-s23/`.
- `.env.example`: re-verify against the codebase (unchanged this session) —
  included in the commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …`.
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build →
  ./scripts/smoke-test.sh → test:e2e` — all green before push (74 unit / 28
  smoke / 75 e2e — +5 net-new: the locked-wall drag test, the
  selection-preserving click test, the not-allowed-cursor test, the
  no-handles-on-locked test, the Select-All-drag-skips-locked test).
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- The mobile navigation fix (re-verified end-to-end this session; the reference
  still ships failure class A) — pinned by `tests/e2e/mobile-navigation.spec.ts`.
- The resize math at non-default zoom (live-verified exact this session — the
  model-space arithmetic via `toCanvas()`'s zoom division).
- The marquee implementation (containment semantics verified live: partial →
  no selection, full → exactly the contained; the reference's marquee is a
  no-op) — including its locked-exclusion filter.
- The canvas shift-click add/remove semantics (verified live both directions).
- The hidden-element contract (not rendered, not hit-testable — session 20's
  fix, re-verified live this session).
- The properties panel's editability for a row-selected locked element (the
  reference's inputs are display-only no-ops — no parity data; the panel stays
  the working superset; the lock blocks canvas interaction only).
- The row-click selection path for locked elements (parity — both apps select
  via the row).
- The AI-assistant no-crash contract, the Untitled-editor contract, the toast
  cross-chunk store, the db-path resolution (all pinned; untouched).
- The remaining PAD §10 scope cuts (gradient/image fills, per-corner radii,
  rotation-aware bounds, forgot-mail delivery, in-process rate limiter, session
  revocation) — none are release blockers.
- The historical PAD revision blocks (precedent: they record what happened — the new
  block documents this session's findings).

---

## Execution status (end of session 24)

**All items EXECUTED and GREEN.** RED first (all 5 new tests failed at their exact
assertions against the pre-fix build): the locked-wall drag test saw the Hero Section
frame DISPLACED by the drag (S23-1's exact live-audit symptom — the fall-through);
the selection-preserving click test saw the badge flip from "1 selected" to the
frame's selection (the click-through replacing it); the cursor test read the
inherited cursor (not `not-allowed`); the handles test counted 8 handles on the
locked selection; the Select-All drag test moved the locked Glow. Then GREEN (Slice
A: the hit-test finds the topmost VISIBLE element and returns early when it is
locked — the wall; `CanvasElement` drops `pointer-events: none` and gains the
reference's `cursor-not-allowed` class; the single-selection outline renders without
handles when the selected element is locked; `moveElements` skips locked ids and
only flips `saveState` when something moved). Full gate green: **74 unit / 28 smoke
/ 75 e2e (+5)**. Docs aligned at PAD v1.13.0 / digma_SKILL v1.12.0 (lesson F21).
Live verification: dragging across the locked Glow leaves BOTH the frame beneath
and Glow itself untouched (pre-fix: the frame teleported +104px); clicking the
locked Glow with the Headline row-selected preserves "1 selected"; the locked
element's computed cursor reads `not-allowed`; the locked selection shows the
outline with 0 handles; Select All + drag moves the five unlocked elements and
leaves Glow in place.
