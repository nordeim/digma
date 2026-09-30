# Digma — Session 31 Remediation Plan (v1.17.0 target)

**Date:** 2026-09-30 · **Input:** fourteenth live parity audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-29 code @ `77ac838`, clean re-seeded DB), desktop
1440×900 and mobile 390×844, DOM/computed-style level + **functional interaction testing** (the
session-29 next-steps directive: the reference's frame/image element rendering and its
create-dialog template behaviors, plus the standing mobile-nav/parity sweep). **Method:** every
finding below was verified live in the reference's DOM (or measured as its own dead/broken
path) AND functionally in the clone's DOM before entering this plan; the plan was re-validated
line-by-line against the codebase before execution.

---

## Context

Session 29 (commit `51607c0` + transcript push `77ac838`, PAD v1.16.0) closed the line/text
element-type seams (the SVG diagonal at all three render sites, the type-conditional panel
sections, the measured TEXT layout with the functional Font Family combobox). This session
executed the session-29 next-steps directive — the frame and image element rendering plus the
create-dialog template behaviors — and re-ran the standing sweeps.

The baseline fast gates were re-run green BEFORE any change: lint ✅ · typecheck ✅ · 82/82
unit ✅ (the full gate — build/smoke/e2e — re-verified after the changes). Dev server healthy
with the DB anchored at the repo root (`[db] DATABASE_URL -> file:/home/z/my-project/digma/db/custom.db`).
Test suites verified present: vitest (82 checks) + playwright (88 checks), both excluding
`skills/`. `.env` carries `DATABASE_URL="file:../db/custom.db"` with the `db/` folder at the
repo root (re-seeded this session — 1 user / 2 projects / 6 elements / 1 team / 3 members).

### What the sweep found in the REFERENCE (live-measured this session)

- **RA-13 — the reference's FRAME element renders as a LABELED CONTAINER, not a filled panel
  (the decisive new datum).** A fresh Frame-tool drag creates a div with
  `background-color: transparent`, **`border: 1px solid rgb(85, 85, 85)`**, `border-radius: 0px`
  — and the border comes from the element's STROKE model fields (the Fill & Stroke panel reads
  Fill `transparent` and Stroke `#555555` with Stroke Width `1` for a fresh frame — RA-18
  below). The frame carries an **ALWAYS-ON NAME LABEL** (rendered in the unselected state
  too — measured after deselect): a child div
  `absolute -top-5 left-0 text-xs text-gray-300 bg-[#161b22] px-1.5 py-0.5 pointer-events-none`
  with inline `transform: scale(0.778866); transform-origin: left top; white-space: nowrap` —
  the scale is **1/zoom** (measured at 128% zoom: 0.778866 = 1/1.28392), so the label's TEXT
  stays at a constant screen size at any zoom while its distance from the frame scales with
  the canvas. Selection adds `ring-2 ring-blue-500 ring-offset-1` classes.
- **RA-14 — the reference's Image tool is a DEAD no-op.** No file input appears
  (`input[type=file]` count 0), no dialog, no overlay, and neither a drag nor a click creates
  an element (the layer count stays put).
- **RA-15 — the reference's create-dialog templates are COSMETIC.** Selecting "Mobile App",
  naming the project, and creating it produced a project with **0 layers** ("No layers yet.
  Start designing to s…") — the template selection carries metadata only; no elements are
  seeded by any template.
- **RA-16 — the reference's project delete confirms through a NATIVE `window.confirm()`
  ("Are you sure you want to delete "X"?")** — and it WORKS (the audit project vanished after
  accepting; measured live via the blocked-dialog error surfaced by the automation).
- **RA-17 — the reference's frame properties panel shows the FULL five sections**
  (Position & Size, Corner Radius, Fill & Stroke, Transform, Opacity) — the frame KEEPS Corner
  Radius (it is a corner-able type, unlike line/ellipse/text).
- **RA-18 — the frame's Fill & Stroke panel values:** the Fill row reads a color input
  `#000000` behind the text `transparent` (the fill is the literal string "transparent" in
  its model), the Stroke row reads `#555555` with Stroke Width `1` — the frame's structural
  border is the standard stroke mechanism, not special-cased rendering.
- **RA-19 — the reference's THUMBNAIL renders the frame's border but NOT its label** (the
  project card's scaled-down frame div measured `background-color: transparent; border: 1px
  solid rgb(85,85,85); border-radius: 0px` with EMPTY innerHTML — no label child).
- **RA-20 — the reference's selection ring classes are INERT.** Its selected elements carry
  `ring-2 ring-blue-500 ring-offset-1`, but the inline style sets `box-shadow: none` (measured
  on both the selected frame and a selected rectangle) — inline styles override the Tailwind
  ring's box-shadow, so **no selection ring ever paints**; a full-DOM scan found no painted
  box-shadow or outline element anywhere. The reference's canvas selection is invisible (the
  layers row + the properties panel are the only selection feedback). The clone's painted
  inline `box-shadow: 0 0 0 2px rgba(59,130,246,0.9)` is the WORKING SUPERSET — kept
  deliberately (the class-based intent, executed).
- **R3 — the reference's mobile nav still ships failure class A** at 390×844 (nav
  `display: none`, NO hamburger, the 36×36 bell only — the **fourteenth consecutive session**;
  evidence: `docs/screenshots/ref-audit-s30/ref-02-mobile-failure-classA.png`). Its mobile
  editor remains the squeezed desktop layout (re-measured: AI panel + Canvas Properties
  visible, properties off-screen).
- Standing reconfirmations: the reference's drag only engages with multi-event pointermove
  streams; a NEW element lands at the TOP of the layer list (newest-first — the clone's
  existing reverse-ordered list is parity).

### What the sweep VERIFIED CORRECT in the clone (no change — parity or the working superset)

- **The Image tool no-op is PARITY** (RA-14): the clone's `TOOL_TO_TYPE` maps only
  rectangle/ellipse/line/frame — the pen/image tools select but never draw, exactly like the
  reference's dead Image tool (live-verified: no element created on drag or click).
- **The create-dialog templates are COSMETIC — parity** (RA-15): creating with the "Mobile
  App" template produced a 0-layer project (the template is card-icon/list metadata only).
  The audit project was then deleted through the UI.
- **The frame properties panel keeps all five sections** (RA-17 parity): the type-conditional
  guard `!["line","ellipse","text"].includes(type)` excludes frames from nothing.
- **The mobile navigation works end-to-end at 390×844** (the deliberate fix over the
  reference's failure class A — re-verified live this session): the 44×44 trigger with the
  stable `aria-label="Navigation menu"` + `aria-expanded`/`aria-controls`, the drawer opening
  with all three links, scroll-lock while open, tap-navigate-AND-dismiss (clicked the Teams
  link → URL `/Teams` + sheet gone), Escape closes, and the trigger is 0×0 at desktop. **The
  Tailwind v4 mobile-nav bug (failure class A) is NOT present in the clone.**
- **The zoom buttons work** (the standing superset over the reference's dead zoom cluster).
- The DB anchor, `.env`, the vitest/playwright configs, and the 82/82 unit baseline.

### Findings (all verified live in both apps; the clone with functional proof)

| # | Finding | Severity |
|---|---------|----------|
| S31-1 | **The clone's FRAME rendering diverges from the reference's measured container contract (RA-13/RA-18/RA-19).** The clone's `defaultElementFor("frame")` returns `fill: "#161B22"` (a SOLID panel), `radius: 8`, `stroke: null` — so a fresh frame renders as a filled rounded rectangle with NO border (live-verified pre-fix: `bg: rgb(22,27,34)`, `border: 0px`, `radius: 8px`), while the reference's frame is a transparent, border-1px-#555555, radius-0 CONTAINER. The clone's label is a bare `text-[10px] text-gray-500` span with `-translate-y-full pb-1` — no chip background, no padding, no `pointer-events-none`, and NO counter-scale: at 207% zoom the label measured 39px tall vs 19px at 100% (it scales WITH the canvas; the reference's counter-scales to a constant screen size). The seeded "Hero Section" frame carries the same solid-panel style (`fill: "#161B22", radius: 12`). | **Medium** |
| S31-2 | **The clone's project delete fires IMMEDIATELY — no confirm step.** The Delete dropdown menu item calls `deleteProject()` directly (live-verified: the project vanished on the first click). This contradicts BOTH the documented contract (AGENTS.md/CLAUDE.md: "project deletes go through the ellipsis menu with an explicit confirm step") AND the reference's measured guard (RA-16: a native `window.confirm` before the DELETE). A destructive, undo-less action with no guard is a data-integrity bug (the deleted project's elements go with it — the editor's undo history cannot reach it). | **Medium** |

**Deliberate superset notes (no change):** the clone keeps its PAINTED selection ring
(`box-shadow: 0 0 0 2px rgba(59,130,246,0.9)` inline — the reference's ring classes are inert
behind its inline `box-shadow: none`, RA-20); the clone's working zoom buttons, Share/Present,
eye, keyboard, AI mutations, and mobile nav all stay. The reference's inert-ring "invisible
selection" is NOT ported (a UX regression, and the class intent is clear).

---

## P1 — Code changes (TDD, two coherent slices)

### Slice A — S31-1: the frame's labeled-container contract

**Files:** `src/lib/editor.ts`, `src/components/editor/canvas.tsx`,
`src/components/project-card.tsx`, `src/components/editor/editor-view.tsx`,
`prisma/seed.ts`.

1. **The model defaults** (`defaultElementFor("frame")`): `fill: null` (transparent — renders
   nothing, cleaner than the reference's literal `"transparent"` string and matching the
   line's `fill: null` precedent), `stroke: "#555555"`, `strokeWidth: 1`, `radius: 0`
   (replacing `fill: "#161B22", radius: 8`). The shared style chain's border-from-stroke line
   (`if (el.type !== "line" && el.stroke && el.strokeWidth > 0)`) then paints the 1px #555555
   border at the canvas, the thumbnail, and the present overlay with NO further changes —
   the frame's border is the standard stroke mechanism (RA-18).

2. **The label chrome** (`CanvasElement`'s frame branch in canvas.tsx): replace the bare span
   with the reference's measured chip —
   `absolute -top-5 left-0 text-xs text-gray-300 bg-[#161b22] px-1.5 py-0.5 pointer-events-none whitespace-nowrap`
   — carrying `style={{ transform: scale(1/zoom), transformOrigin: "left top" }}`. The label
   renders when the frame is selected AND unselected (the always-on contract — the reference's
   measured unselected DOM). `CanvasElement` gains a `zoom` prop, passed ONLY to frame
   elements (`zoom={el.type === "frame" ? zoom : undefined}`) so non-frame elements keep
   their memoized renders across zoom changes.

3. **The thumbnail and present overlay need NO label** (RA-19 — the reference's thumbnail
   renders the border only): verify both sites render the bordered transparent box via the
   existing shared style logic and add no label branch.

4. **The seed's "Hero Section" frame** adopts the container contract: `fill: null, stroke:
   "#555555", strokeWidth: 1, radius: 0` — the seeded canvas shows the reference's labeled
   container (the hero content sits inside a bordered box with the "Hero Section" chip). The
   seed's element type + create-data gains the `stroke`/`strokeWidth` fields. No e2e layer-
   list/count assertions change (the 6 elements and their names are untouched; the drag-wall
   tests capture-restore style within the test).

### Slice B — S31-2: the project-delete confirm step

**Files:** `src/components/project-card.tsx`.

5. **A local confirm dialog** (the card's existing rename-dialog pattern, per the clone's
   deletes-confirm-locally convention — never a global AlertDialog): the Delete menu item
   opens a small Dialog — "Delete project?" + the project name + a destructive "Yes, Delete"
   button + a "Cancel" button. `Yes, Delete` fires the existing `deleteProject()`; `Cancel`
   closes. The guard ports the reference's RA-16 confirm semantics (a destructive action
   requires an explicit second interaction) in the clone's established chrome.

### Tests (RED first)

- **Unit** — `src/lib/editor.test.ts`, a new test in the element-defaults describe:
  - "a fresh frame carries the reference's container defaults (session 31)" —
    `defaultElementFor("frame", …)` returns `fill: null`, `stroke: "#555555"`,
    `strokeWidth: 1`, `radius: 0` (pre-fix: `fill: "#161B22"`, `stroke: null`,
    `strokeWidth: 0`, `radius: 8`).
- **E2E** — `tests/e2e/editor-panels.spec.ts`, a new describe ("frame container rendering
  (session 31)"):
  1. "drawing a frame renders the labeled transparent container" — draw a frame with the
     Frame tool (the drawLine pattern), assert the element renders `background-color:
     rgba(0, 0, 0, 0)`, `border-top-width: 1px`, `border-top-color: rgb(85, 85, 85)`,
     `border-radius: 0px`, and a label child with the chip chrome (`background-color:
     rgb(22, 27, 34)` from `bg-[#161b22]`) carrying the frame's name; `pointer-events: none`
     on the label (pre-fix: solid `rgb(22, 27, 34)` fill, `border-top-width: 0px`,
     `border-radius: 8px`, a bare 10px gray label).
  2. "the frame label counter-scales at zoom (constant screen size)" — draw a frame, measure
     the label's bounding height at 100%, zoom to 200% via the zoom buttons, assert the
     label height stays within a ±3px tolerance (pre-fix: it doubles, 19 → 39px — the
     live-measured divergence).
  3. "the seeded Hero Section renders the container contract" — assert the seeded frame
     element carries `border-top-width: 1px` + `border-top-color: rgb(85, 85, 85)` and
     transparent background, with its "Hero Section" label chip visible (pre-fix: solid fill,
     no border).
  4. "the thumbnail renders the frame border without the label" — on the dashboard, the
     project card's thumbnail frame div carries the 1px #555555 border and NO label text
     (RA-19; pre-fix: the solid #161B22 panel).
  5. Cleanup discipline: undo every draw + wait for Saved (a RED failure must never leave
     the shared e2e DB mutated).
- **E2E** — `tests/e2e/workspace.spec.ts` (or parity), a new test:
  6. "project deletion confirms before deleting" — open the ellipsis menu, click Delete,
     assert the confirm dialog renders (the project is still on the board), click Cancel →
     the project survives; Delete again → "Yes, Delete" → the project card vanishes (the
     test creates its own project first and cleans up by deleting it).

## P2 — Documentation alignment (post-fix)

- **PAD → v1.17.0:** new revision block (the S31-1/S31-2 findings + the reference-side
  RA-13…RA-20/R3 measurements + the fourteenth-audit record); the element-types fact row
  gains the frame's container contract; §7.1/§7.4 counts refreshed.
- **AGENTS.md:** the element-type facts (the frame contract) + the project-delete confirm +
  the counts.
- **CLAUDE.md:** ditto.
- **README.md:** the layers-panel feature row (frames are labeled containers) + the project
  cards row (delete confirm) + the counts.
- **digma_SKILL.md → v1.16.0:** lesson **F25** (an inert reference class is measured by its
  COMPUTED PAINT, not by its presence — the reference's `ring-2` classes never painted behind
  the inline `box-shadow: none`; the F24 corollary generalized: measure what the browser
  RENDERS, and when a class and an inline style fight, the inline style wins) + the §5/§6
  rows + the counts.
- `docs/remediation-plan-session31.md` (this plan + execution status) +
  `docs/session_35.md` (this session's structured log) + the worklog Task 39 entry.

## P3 — Delivery

- Screenshots: re-capture the standard set from the remediated dev server (re-seeded first;
  the seeded canvas changes — the Hero Section frame becomes a labeled bordered container) →
  `docs/screenshots/`; audit provenance already captured this session
  (`docs/screenshots/ref-audit-s30/`: the reference's dashboard/editor, its mobile
  failure-class-A, its squeezed mobile editor, its selected-rectangle no-ring state, and the
  clone's pre-fix zoom-scaled label).
- `.env.example`: re-verify against the codebase (unchanged this session) — included in the
  commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …`.
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build →
  ./scripts/smoke-test.sh → test:e2e` — all green before push.
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- The Image tool no-op and the cosmetic templates (measured parity — RA-14/RA-15).
- The frame panel's five sections (RA-17 parity — frames keep Corner Radius).
- The painted selection ring (the working superset over the reference's inert classes,
  RA-20).
- The mobile navigation fix (re-verified end-to-end this session — the reference still ships
  failure class A, R3 14th).
- The AI update path, Share/Present supersets, gesture-level undo, working zoom, the
  reference's claim-theater replies — all standing decisions.
- The historical PAD revision blocks.

---

## Execution status (end of session 31)

**All items EXECUTED and GREEN.** RED first (the exact captured assertions): the unit
frame-defaults test failed at `expected '#161B22' to be null` (plus no stroke, radius 8); the
e2e suite failed 5/5 against the pre-fix build — the frame container test at the exact
background assertion (`Expected: "rgba(0, 0, 0, 0)", Received: "rgb(22, 27, 34)"` — the solid
#161B22 panel), the counter-scale test at `Expected <= 3, Received: 13.83` (the label scaled
with the canvas), the seeded-frame test at the same CSS contract, the thumbnail test at the
missing bordered container, and the delete-confirm test at the missing "Delete project?"
heading (the pre-fix code deleted immediately). Then GREEN (Slice A: the container defaults +
the measured label chip with the counter-scale + the frame-only `zoom` prop + the seed's Hero
Section contract; Slice B: the card-local "Delete project?" confirm dialog). Full gate green:
**83 unit (+1) / 28 smoke / 93 e2e (+5)**.

**En-route discoveries (executed beyond the written plan):**

1. **The React-portal event-bubbling bug (S31-3 — found while live-verifying the confirm).**
   The delete-confirm e2e test failed mysteriously: Cancel clicked, the dialog closed, and the
   page landed in the EDITOR. Live reproduction + diagnosis: React propagates PORTAL events
   (Radix dialogs portal to `document.body`) through the REACT component tree — so clicks
   inside a card-local dialog bubbled to the card root's `openProject()` onClick and
   navigated. **The RENAME dialog had the same latent bug all along** (live-reproduced: its
   Cancel navigated too — invisible because every flow that used it navigated anyway). Fixed:
   both card-local dialogs wrap in a `stopPropagation` div (click AND keydown — Enter inside
   the rename form must never reach the card's Enter/Space openProject handler), the same
   convention the ellipsis-menu wrapper already uses. Recorded as lesson F25(b).
2. **The reference's selection ring classes are INERT (RA-20 — measured while validating the
   frame chrome):** its selected elements carry `ring-2 ring-blue-500 ring-offset-1` but the
   inline style ships `box-shadow: none`, which overrides the Tailwind ring — no painted
   selection indicator anywhere (full-DOM scan). The clone's painted inline
   `0 0 0 2px rgba(59,130,246,0.9)` is the deliberate working superset. Recorded as lesson
   F25(a).
3. **The environment trap struck once mid-session** (the restarted dev server inherited the
   exported shell `DATABASE_URL` → `Error code 14`): fixed by restarting under
   `env -u DATABASE_URL` — the documented discipline held.

Live verification (dev server, post-fix): the seeded Hero Section renders the container
contract (`bg rgba(0,0,0,0)`, `border 1px rgb(85,85,85)`, `radius 0px`, the "Hero Section"
chip with `bg rgb(22,27,34)` + 12px text + pointer-events none); a freshly drawn frame
renders the same contract; **the label measured exactly 20px tall at BOTH 100% and 173% zoom**
(pre-fix: 19px → 39px); the thumbnail renders the bordered container with NO label; the
delete-confirm flow works end-to-end (Delete → dialog → Cancel keeps the project on the
dashboard → Delete again → "Yes, Delete" removes it); the rename dialog's Cancel stays on the
dashboard (the S31-3 fix).
