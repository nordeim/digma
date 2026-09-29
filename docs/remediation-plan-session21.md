# Digma — Session 21 Remediation Plan (v1.12.0 target)

**Date:** 2026-09-29 · **Input:** ninth live parity audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-20 code @ `560d232`), desktop 1440×900 and
mobile 390×844, DOM/computed-style level (post-hydration settles) + **functional interaction
testing** (the F19 functional sweep the session-20 log directed: the marquee/drag-reorder
paths and the properties-panel number inputs' commit semantics, plus the zoom cluster at
live zoom levels). **Method:** every finding below was verified in BOTH apps' DOM before
entering this plan, and the plan was re-validated line-by-line against the codebase before
execution.

---

## Context

Session 20 (commit `f86119f` + `560d232`, PAD v1.11.0) closed the layer-row
functional-semantics gaps (the eye's canvas contract, the rename input chrome, the lock's
opacity semantics) and recorded the eighth consecutive full parity audit. This session
executed the session-20 "next steps" directive — the F19 functional sweep of the remaining
unaudited interactive paths: **the layers-panel drag-reorder**, **the canvas marquee
selection**, **the properties-panel number inputs' commit semantics**, and **the zoom
cluster's behavior at live zoom levels** — plus the standard parity-hold sweep.

The baseline fast gates were re-run green BEFORE any change: lint ✅ · typecheck ✅ ·
74/74 unit ✅ (the full gate — build/smoke/e2e — re-verified after the changes). Dev
server healthy with `[db] DATABASE_URL -> file:/home/z/my-project/digma/db/custom.db`
(the `env -u DATABASE_URL` discipline for every gate command; the parent-workspace
`.env` trap is present and neutralized). Test suites verified present: vitest (74
checks) + playwright (66 checks), both excluding `skills/`.

### What the functional sweep found in the REFERENCE (no clone change — its own bug class)

- **The reference's marquee selection is a NO-OP.** A full-canvas drag from empty space
  across all three stacked shapes (150,150 → 700,650, covering their exact bounds)
  produced NO marquee rect, NO "N selected" counter, and NO selection after mouseup
  (verified with real mouse events). Like its no-op eye and its crashing AI assistant,
  the reference ships the marquee UI affordance (the select tool) without the function.
  The clone's marquee is the working superset — live-verified this session: dragging
  from empty space over two fully-contained elements selects exactly them ("2 selected",
  blue dashed rect rendered during the drag).
- **The reference's properties-panel number inputs are NO-OPS.** X/Y/W/H inputs (native
  spinbuttons, shadcn-Input chrome) were tested on EVERY commit path: typing `100` into
  X (input event), blurring, pressing Enter, and dispatching ArrowUp (spinner) — the
  canvas element's transform NEVER changed (`matrix(0.1, 0, 0, 1.2, 35.2)` throughout),
  and the ArrowUp didn't even change the input's value. The reference's inputs are
  display-only. The clone's inputs are the working superset — but S21-2 below is a real
  defect in that superset.
- **The reference's zoom cluster is erratic (its own bug).** Measured click-by-click
  with the pill text AND the shape transform traced together: zoom-in 100% → 120%
  (correct), then FURTHER zoom-in clicks are dead (capped at 120%); a single zoom-out
  click from 120% jumped to 500% (`matrix(5, …)`); the zoom then asynchronously settled
  to a non-round fit-to-view 32% (`matrix(0.324527, …)`); zoom-in from 32% then ran
  INVERTED (32% → 16%); after that BOTH buttons are dead; and the 16% state PERSISTS
  across reloads (it is saved into the project). The clone's zoom (multiplicative ±20%
  steps, clamp 0.05–8, Ctrl+wheel, Ctrl+0 reset) is the clean working superset; the
  cluster CHROME matches exactly (verified: pill + lucide zoom-in/zoom-out magnifier
  chips, `absolute top-4 left-4 z-10 flex items-center gap-2`, identical class strings).
- **The reference's selection visuals carry no paint and no handles.** The selected
  canvas element gains the classes `ring-2 ring-blue-500 ring-offset-1` — but its
  INLINE style serializes `box-shadow: none`, which overrides the ring classes: the
  selection ring computes to NOTHING (measured: `boxShadow: "none"` with the ring
  classes present). There are NO resize handles (0 resize-cursor elements, 0 small
  squares at the selection corners). The reference's selection is visible only via the
  layer row (`bg-blue-600 text-white`) and the "N selected" badge. The clone's visible
  inline-styled ring + 8-handle resize is the documented working superset (unchanged).
- **The reference's layer rows render `draggable="false"` while SELECTED** (measured on
  the selected row; unselected rows render `draggable="true"`). Since clicking a row
  selects it, this is the mechanism that makes its drag-reorder dead in practice. The
  reference's drag-reorder never reorders (verified with real HTML5 drags — the layer
  order never changed). The clone's rows stay draggable while selected — keep (the
  working superset; noted as a deliberate deviation).

### Verified parity-hold (no change — the ninth consecutive audit)

- **Mobile navigation (the operator-flagged surface):** the reference STILL ships
  Tailwind v4 failure class A at 390×844 (nav `display:none`, NO hamburger — its one
  header button remains the 36×36 bell). The clone's fix re-verified END-TO-END: the
  44×44 trigger with stable `aria-label="Navigation menu"`, the drawer opens with all
  three links, `data-scroll-locked` body, tap "Recent" → navigates to `/Recent` AND
  dismisses, and the hamburger is hidden at desktop width with the nav `flex`.
- **Zoom-cluster chrome:** identical pill/button class strings in both DOMs (above).
- **"N selected" badge:** identical in both DOMs — `absolute top-4 right-4 bg-[#161b22]
  border border-[#30363d] rounded-lg px-3 py-2 text-xs text-gray-300
  pointer-events-none` (the clone's measured pin holds).
- **Selected layer row:** `bg-blue-600 text-white` in both DOMs (the clone's row also
  keeps the unselected `text-gray-300 hover:bg-[#30363d]` — matching the reference's
  unselected rows).
- **Properties panel structure:** the same five sections (Position & Size, Corner
  Radius, Fill & Stroke, Transform, Opacity), the same 10 number inputs with the same
  widths (full-width X/Y/W/H + per-corner, `w-16` rotation/opacity), the same
  `w-8 h-8 rounded border border-[#30363d] bg-transparent` color swatches, and the
  shadcn-Input-based fill hex input.
- **The clone's marquee works** (the superset verified live — 2 contained elements
  selected, marquee rect rendered).

### Findings (all verified in both DOMs; the clone ones with live functional proof)

| # | Finding | Severity |
|---|---------|----------|
| S21-1 | **The clone's layers drag-reorder is broken three ways — precise insertion never happens.** (a) The per-row `div.relative` wrapper's `onDragOver` fires AFTER the row's own handler (DOM bubbling: row → wrapper) and OVERWRITES the row's carefully computed index with a crude `after ? elements.length : 0` — so every drop resolves to "top of list" or "bottom of list" and the row's precise index is clobbered. Live-verified: dragging Glow onto Accent Bar's row CENTER sent Glow to the TOP of the list (a one-position move became a six-position move). (b) Even unclobbered, the row's index math is inverted: it stores the target's ELEMENT index in `dragOver` but consumes it with `elements.length - dragOver` as if it were a DISPLAY position (a double conversion that is wrong for every non-middle row). (c) The `dragOver` state is never rendered (no drop indicator exists) and the wrapper's `onDrop` calls a local no-op `onDrop(0)` that only clears the dead state. Additionally the row's `onDrop` reads `dragOver` from its render closure — a fast drag (dragover + drop in the same tick) reads stale/null state and silently no-ops. The reference's own drag-reorder is dead (above), so the clone's FIXED implementation remains the working superset. | **High** |
| S21-2 | **The clone's properties NumberField commits an empty draft as 0 — clearing the X input teleports the element to x=0.** The `onChange` runs `Number("")` → `0` → `Number.isFinite(0)` → commits 0. Live-verified: with the Accent Bar selected (translate(120px, 80px)), clearing the X input instantly moved it to translate(0px, 80px) — an unintended jump the user never asked for. Typing a fresh number then commits every intermediate prefix ("1", "15", "150"), each pushing an undo snapshot and flipping the autosave — one logical edit becomes 3+ history entries, and Ctrl+Z must be pressed once per keystroke to recover. The reference's inputs are display-only (above), so the clone's input is the working superset — but this is exactly the F19 "half-working" pattern: the control commits, yet its empty/intermediate states corrupt the edit. | **High** |
| S21-3 | **The Canvas Properties Background Color hex input renders `aria-label="undefined hex"`.** The template literal `` `${label} hex` `` lacks the `?? "Color"` fallback its sibling swatch input has (`${label ?? "Color"} swatch`) — with the label omitted (the Canvas Properties usage, where the section heading carries it) the accessible name is the literal string "undefined hex". Visible in the accessibility tree (`textbox "undefined hex"`). | **Low** |

**Deliberate superset notes (no change):** the clone keeps its working marquee, working
zoom (clean ±20% multiplicative steps vs the reference's erratic jumps), visible
selection ring + 8 resize handles, and draggable-while-selected rows — all documented
above as fixes over the reference's own dead/buggy implementations, consistent with the
repo's "every deviation is a superset, never a regression" convention.

---

## P1 — Code changes (TDD, three slices)

### Slice A — S21-1: precise, stateless drag-reorder

**Files:** `src/components/editor/layers-panel.tsx`.

- **Delete the wrapper's handlers** (the `div.relative` `onDragOver`/`onDrop` — the
  clobbering crude handler + the no-op drop) and the local `onDrop(index)` function
  (lines 44–46) it called.
- **Delete the dead `dragOver` state** — it was never rendered; removing it also removes
  the stale-closure class of bugs (the drop no longer depends on any state).
- **Reduce the row's `onDragOver` to `event.preventDefault()`** — its only real job is
  allowing the drop (HTML5 DnD contract).
- **Rewrite the row's `onDrop` to compute the insertion index from the event itself**:
  ```tsx
  onDrop={(event) => {
    event.preventDefault();
    const fromId = event.dataTransfer.getData("text/layer-id");
    if (!fromId || fromId === el.id) return;
    const store = useEditorStore.getState();
    const remaining = store.elements.filter((e) => e.id !== fromId);
    const targetIndex = remaining.findIndex((e) => e.id === el.id);
    if (targetIndex === -1) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const after = event.clientY > rect.top + rect.height / 2;
    // Rows render in REVERSE element order, so "below row X on screen" =
    // insert at X's element index (X keeps its slot); "above row X" = one
    // later. reorderElements inserts at the given index in the
    // elements-minus-dragged array — the ends land exactly at the list
    // top/bottom via its clamp.
    store.reorderElements([fromId], after ? targetIndex : targetIndex + 1);
  }}
  ```
  The math (worked example, verified by hand): elements `[E0..E5]` display
  `[E5,E4,E3,E2,E1,E0]`; drag E5, drop on E2's row — lower half → insert at E2's
  remaining-index → E5 renders immediately BELOW E2; upper half → index+1 → immediately
  ABOVE E2; drop on the top row's upper half → clamp to end → the very top.
- **Tests (RED first):** `tests/e2e/editor-panels.spec.ts` — a new describe
  ("layers drag-reorder (session 21)") with two tests:
  1. "a drop on a row's lower half inserts the dragged row directly below it" —
     dispatch `dragstart` (with a real `DataTransfer` carrying `text/layer-id`) on the
     top row, then `drop` on the Glow row at 70% of its height; assert the resulting
     row order is the precise one-position-below order (CTA Label below Glow), NOT the
     pre-fix top-of-list landing.
  2. "a drop on a row's upper half inserts the dragged row directly above it" — same
     drag, drop at 30% height; assert the precise above-order.
  The events are dispatched via `page.evaluate` with real `DataTransfer` objects (the
  same technique as the live audit) — with the fix, the drop handler needs NO prior
  state, so a same-tick dispatch is faithful.

### Slice B — S21-2: the NumberField never commits an empty draft

**Files:** `src/components/editor/properties-panel.tsx` (`NumberField`).

- **`onChange`:** skip the commit when the draft is empty —
  `if (event.target.value.trim() === "") return;` before the parse (an empty field is
  the user MID-EDIT, not a request for 0; `Number("")` → 0 is the trap).
- **`onBlur`:** if the draft is empty or not finite, restore the display value
  (`setDraft(display)`) — the input never dead-ends showing a stale empty value after
  the user abandons an edit.
- Live typing of finite values still commits immediately (the established working
  superset over the reference's display-only inputs — responsive, and each keystroke
  is a real value the user typed).
- **Tests (RED first):** a new e2e test ("the properties number input never commits an
  empty draft (session 21)"): select the Accent Bar row, read its canvas transform
  (`translate(120px, 80px)`), CLEAR the X input via `fill("")` → assert the transform is
  UNCHANGED (the pre-fix code jumps to `translate(0px, …)`), then `fill("200")` →
  `translate(200px, …)`, then clear again and BLUR → the input restores "200" and the
  transform stays `translate(200px, …)`.

### Slice C — S21-3: the hex input's accessible name

**Files:** `src/components/editor/properties-panel.tsx` (`HexColorRow`).

- `aria-label={`${label ?? "Color"} hex`}` — the same fallback the sibling swatch input
  already uses (the Canvas Properties row then reads "Color hex").
- **Tests (RED first):** a new e2e test ("the canvas-properties hex input carries a real
  accessible name (session 21)"): with nothing selected, the Canvas Properties hex
  textbox is locatable by the accessible name "Color hex" and NOT by "undefined hex"
  (`getByRole("textbox", { name: "undefined hex" })` resolves to nothing).

## P2 — Documentation alignment (post-fix)

- **PAD → v1.12.0:** new revision block (the S21-1…S21-3 findings + the
  reference-side functional-sweep results + the ninth-audit record); the layers-panel
  facts gain the precise-drag-reorder contract; the properties-panel facts gain the
  empty-draft rule; §7.1/§7.4 counts refreshed (e2e 66 → 70).
- **AGENTS.md:** the drag-reorder fact (precise stateless insertion, the wrapper bug
  fixed) + the NumberField empty-draft rule.
- **CLAUDE.md:** ditto (the editor-panels facts).
- **README.md:** the Layers panel feature row (drag-reorder now actually precise) + the
  properties-panel row (inputs never commit empty drafts).
- **digma_SKILL.md → v1.11.0:** lesson **F20** (state-dependent drop handlers are a
  two-front bug: the state can be clobbered by a later-bubbling handler AND read stale
  from the closure — compute insertion indices from the event at drop time; plus the
  `Number("") === 0` commit trap) + §5/§6 rows refreshed + counts.
- `docs/remediation-plan-session21.md` (this plan + execution status) +
  `docs/session_22.md` (this session's structured log) + `worklog.md` Task 34 entry.

## P3 — Delivery

- Screenshots: re-capture the standard set from the remediated dev server →
  `docs/screenshots/`; audit provenance (the reference's mobile failure-class-A
  capture, the reference's no-op-input/no-op-marquee/erratic-zoom evidence, the clone
  post-fix precise-reorder + empty-draft captures) → `docs/screenshots/ref-audit-s21/`.
- `.env.example`: re-verify against the codebase (unchanged this session) — included
  in the commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …`.
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build →
  ./scripts/smoke-test.sh → test:e2e` — all green before push (74 unit / 28 smoke /
  70 e2e — +4 net-new: the two drag-reorder precision tests, the empty-draft test,
  the hex accessible-name test).
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- The mobile navigation fix (re-verified end-to-end; the reference still ships
  failure class A) — pinned by `tests/e2e/mobile-navigation.spec.ts`.
- The clone's marquee implementation (working superset over the reference's no-op;
  live-verified selecting exactly the contained elements).
- The clone's zoom implementation (clean multiplicative steps vs the reference's
  erratic cluster; chrome identical — verified).
- The visible selection ring + 8-handle resize (the superset over the reference's
  paintless ring classes + no handles).
- The rows' draggable-while-selected behavior (the reference disables drag on
  selection — its dead-drag mechanism; the clone's is the working superset).
- The layer-row three-action structure, the rename chrome, the lock opacity
  semantics, the eye's canvas contract (session-17/19 fixes — re-verified green).
- The properties panel's five-section layout, slider maxes, segmented Fill control,
  per-corner inputs (session-15/17/18 pins — re-verified).
- The AI-assistant no-crash contract, the Untitled-editor contract, the toast
  cross-chunk store, the db-path resolution (all pinned; untouched).
- The remaining PAD §10 scope cuts (gradient/image fills, per-corner radii,
  rotation-aware bounds, forgot-mail delivery, in-process rate limiter, session
  revocation) — none are release blockers.
- The historical PAD revision blocks (precedent: they record what happened — the new
  block documents this session's findings).

---

## Execution status (end of session 22)

**All items EXECUTED and GREEN.** RED first (3 of the 5 new tests failed at their exact
assertions against the pre-fix build): the lower-half drag test received the UNCHANGED
seeded order (the same-tick dragover+drop read `dragOver` from a stale render closure —
null — and the row's `if (fromId && dragOver !== null)` guard silently no-oped: the
stale-closure class of S21-1 caught red-handed by the e2e dispatch); the empty-draft
test saw the element teleport to `translate(0px, …)` on field-clear (S21-2's exact
live-audit symptom); the hex-name test found the accessible name "undefined hex"
(S21-3). Then GREEN (Slice A `layers-panel.tsx`: the wrapper's clobbering
`onDragOver`/no-op `onDrop`, the local no-op function, and the dead `dragOver` state
all DELETED; the row's `onDragOver` reduced to `preventDefault()`; the row's `onDrop`
rewritten stateless — `remaining = store.elements minus dragged; targetIndex =
remaining.indexOf(target); after ? targetIndex : targetIndex + 1` into
`reorderElements`; Slice B `properties-panel.tsx`: `NumberField.onChange` skips empty
drafts, `onBlur` restores an abandoned empty/unparseable draft to the display value;
Slice C: `aria-label={`${label ?? "Color"} hex`}`). En-route test engineering: the
second drag test's expected order was corrected after the first GREEN run showed the
precise landing (a drop on Glow's UPPER half lands CTA Label directly above Glow —
position 3, NOT the seeded top position the first draft asserted); each drag test
WAITS for the autosave's green "Saved" badge before leaving the page (the 800ms
debounce's cleanup DISCARDS a pending flush — without the wait the next test's re-open
would load the un-mutated order). Full gate green: **74 unit / 28 smoke / 70 e2e
(+4)**. Docs aligned at PAD v1.12.0 / digma_SKILL v1.11.0 (lesson F20). Live
verification: dragging Glow onto Headline's upper half lands Glow directly above
Headline (pre-fix: a six-position jump to the list top or bottom); clearing the X
input keeps the Accent Bar at `translate(120px, 80px)` (pre-fix: instant teleport to
`translate(0px, 80px)`); typing 200 commits live; clear+blur restores "200"; the
Canvas Properties hex input's accessible name reads "Color hex".
