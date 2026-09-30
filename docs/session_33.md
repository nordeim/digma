# Session 33 — The Thirteenth Parity Audit: Line/Text Element-Type Parity (S29-1 + S29-2 + S29-3)

**Date:** 2026-09-30 · **Code state at start:** `3a57ad7` (session 27 delivered; transcript
push `3a57ad7` = `docs/session_32.md`) · **Code state at end:** this commit · **Docs:** PAD
v1.16.0 · digma_SKILL v1.15.0 (lesson F24)

## Directive

The session-27 next-steps list: the AI `update` operations on hidden elements, the
presentation/thumbnail paths, and the standing sweep (mobile nav, general parity). The hunt
then extended into the never-audited element-type seams — how LINES and TEXT elements render
and which panel sections they carry.

## The audit (thirteenth consecutive)

**Baseline before any change:** workspace refreshed (`git pull` — fast-forward to `3a57ad7`),
`.env` verified with `DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root
(`db:push` in-sync, `db:seed` → 1 user / 2 projects / 6 elements / 1 team / 3 members), dev
server healthy with the DB anchor logged. Fast gates green: lint · typecheck · 78/78 unit.
Configs verified: vitest (78) + playwright (83), both excluding `skills/`. The session-27
AI-wall fix (S27-1) and `restoreSnapshot` verified in place.

### Reference findings (live-measured, desktop 1440×900 + mobile 390×844)

- **RA-5 — the reference's AI UPDATE path is the same claim theater as its deletes.**
  "make selected elements red" on a row-selected rectangle → "I have updated the selected
  rectangle to red." + "1 action(s) performed" + Revert — and ALL FOUR canvas rectangles
  stayed `rgb(59, 130, 246)`; a reload confirmed the persisted state never changed. The
  reference's AI mutations never execute, locked or unlocked, delete or update.
- **RA-6 — the reference's Share button is a dead no-op** (no dialog, no overlay, no portal
  children, no navigation — verified by overlay scan + snapshot diff).
- **RA-7 — the reference's Present button is a dead no-op** (no fullscreen, no navigation, no
  dialog — the DOM is identical after the click).
- **RA-8 — the reference's LINE element renders as an SVG diagonal stroke (measured for the
  first time).** A transparent positioning div (fill "transparent", border-0 on all four
  sides) containing `<svg class="overflow-visible absolute top-0 left-0"
  style="pointer-events: stroke">` with `<line x1=0 y1=0 x2=W y2=H stroke="#FFFFFF"
  stroke-width="2" stroke-linecap="round">`. Model defaults: fill=transparent,
  stroke=#FFFFFF, strokeWidth=2 (the Stroke Width slider reads 2 for a fresh line). The
  initial "invisible line" reading was a measurement error — the stroke lives in the div's
  CHILD subtree, below the computed-style horizon (lesson F24).
- **RA-9 — the reference's properties panel renders its sections TYPE-CONDITIONALLY.**
  Measured on fresh draws: RECTANGLE shows the five sections; LINE and ELLIPSE hide Corner
  Radius; TEXT hides both Corner Radius AND Fill & Stroke.
- **RA-10 — the reference's TEXT section fully measured (and both its new controls verified
  FUNCTIONAL live):** POSITION & SIZE | TEXT | TRANSFORM | OPACITY, where TEXT carries
  Content (a single-line INPUT whose VALUE is the default "Type here..."), Font Size (16),
  Color (picker + hex), Font Family (a Radix combobox with exactly seven options — Inter,
  Roboto, Arial, Helvetica, Times New Roman, Georgia, Verdana; picking Arial changed the
  canvas text's computed font-family), and Text Align (segmented lucide align-left/center/
  right buttons; clicking center changed the computed text-align). No Weight control.
- **RA-11 — the reference's undo is FRAGMENTED per pointer-move:** one drag gesture took
  FIVE undo clicks to fully revert, with the FIRST undo moving the element FURTHER from its
  origin (-11,368 → -27,360) before the path home. The clone's gesture-level `commit()` is
  the coherent design (verified in code — one history entry per gesture).
- **RA-12 — the reference's zoom buttons are dead** (107% never changes) — standing data
  reconfirmed.
- **R3 — mobile nav failure class A re-confirmed** at 390×844 (nav `display: none`, zero
  hamburger, the 36×36 bell only — the thirteenth consecutive session). The reference's
  MOBILE EDITOR is a squeezed desktop layout (Layers at x=64, the AI panel crushed to ~93px,
  Canvas Properties at x=413 — off-screen — and the tool rail invisible).
- Standing reconfirmations: the eye toggle is still a no-op (13th); the reference's canvas
  drag only engages with multi-event pointermove streams.

### Clone findings

- **S29-1 (Medium): the LINE's stroke painted a box BORDER, and the thumbnail/present sites
  had no line branch.** The canvas already rendered the reference's SVG diagonal with the
  right model defaults — but the shared style chain's border-from-stroke line painted a 2px
  white rectangle around every drawn line (live-verified pre-fix:
  `border: 2px rgb(255,255,255)`; the reference's line div measures border-0), and
  `CanvasThumbnail` and `PresentOverlay` rendered lines as empty bordered boxes.
- **S29-2 (Low): the properties panel rendered Corner Radius for every type.** The reference
  hides it for line/ellipse/text — a corner-radius slider on a corner-less shape is
  incoherent chrome.
- **S29-3 (Medium): the text panel diverged from the reference's measured TEXT layout.** The
  clone rendered six sections (incl. Corner Radius + Fill & Stroke for text); the reference
  renders four with the TEXT section carrying the color and font controls. The port needed a
  new `fontFamily` model field.
- **En route (found during live verification, fixed beyond the plan): the canvas never
  rendered `textAlign`** — the old Align select wrote a field no consumer read (a
  dead-control-that-lies). The CanvasElement text branch now renders it (+ a
  justify-content mapping so the alignment is visible).
- Verified correct (no change): the AI update path (fills actually change + the honest
  footer + a working Revert on the update path — the RA-5 counterpart), the AI update on a
  HIDDEN element (explicit-surface semantics — coherent), the Share/Present working
  supersets (RA-6/RA-7 are dead in the reference), the thumbnail structure, the mobile nav
  end-to-end at 390×844 + hidden at 768, the mobile editor improvement, the undo
  gesture-granularity, and the drag/resize coordinate math.

## The remediation plan

`docs/remediation-plan-session29.md` — written and re-validated line-by-line against the
codebase before execution (the validation itself caught the audit's truncated-grep error:
the line model defaults and canvas SVG already existed, narrowing S29-1 to the border + the
two off-canvas sites — recorded as lesson F24(c)). Three coherent slices: **Slice A** (the
line's border-less stroke at every render site), **Slice B** (the type-conditional Corner
Radius), **Slice C** (the measured TEXT panel: the `fontFamily` model field + schema + the
FONT_FAMILIES validation enum + the shadcn Select + the segmented Text Align buttons).

## The TDD execution

**RED (unit):** the text-defaults test failed at `'Text' !== 'Type here...'` (fontSize 32 ≠
16, no fontFamily); the line-border contract failed at `'2px solid #FFFFFF' !== undefined`;
the font chain failed (no fontFamily in the style); clampFontFamily failed at import.

**RED (e2e):** all 5 new tests failed against the pre-fix build — the line test at the exact
border assertion (`Expected "0px", Received "2px"`), the Corner-Radius-hidden tests at the
extra section, the text-layout test at the six-section list, the Font Family test at the
missing combobox.

**GREEN:** all fast gates + the new suites. Three existing tests needed test-side
corrections (they pinned the OLD always-five-section layout — the session-15 chrome
describe's beforeEach now selects the rectangle; the sections test pins BOTH measured
layouts). Full gate green: **lint · typecheck · 82 unit (+4) · build 20 routes · 28 smoke ·
88 e2e (+5).**

## The live verification (dev server, post-fix)

- A drawn line renders `border-top-width: 0px` with the SVG stroke (#FFFFFF, width 2, round
  caps) — and the project-card thumbnail shows the same diagonal.
- The line and ellipse selections show exactly [Position and size, Fill and stroke,
  Transform, Opacity]; the text selection shows [Position and size, Text, Transform,
  Opacity] with the Content input, the "Inter" combobox, and the three align buttons.
- Picking Arial changes the canvas text's computed font-family; clicking Align center
  changes its computed text-align AND justify-content (the alignment is visible).
- The AI update path re-verified live: "make selected elements red" → the fill actually
  changes + the honest "1 action(s) performed" footer + a working Revert that restores the
  fill.

## Delivery

- 16 standard screenshots re-verified (pixel-identical — the seeded state renders the same;
  no visual regressions) + the audit-provenance set
  (`docs/screenshots/ref-audit-s29/`: the reference's AI-update theater, its mobile
  failure-class-A, its squeezed mobile editor, its line DOM + the SVG reveal, and the
  clone's pre-fix bordered box → post-fix SVG diagonal, the measured text panel, and the
  thumbnail line).
- `.env.example` re-verified (unchanged — no new env vars this session); included in the
  commit.
- Docs aligned: PAD v1.16.0 (revision block + ADR-011 amendment + §7.1 counts), AGENTS.md,
  CLAUDE.md, README.md, digma_SKILL v1.15.0 (lesson **F24** — a dead-looking reference
  RENDERING path is measured by its DOM children, not its computed styles; with the
  type-conditional-sections, shared-style-chain, and truncated-grep corollaries), the plan's
  execution status, this log, and the worklog Task 38 entry.
- Full gate re-verified green before the commit; pushed to `main` via
  `docs/ssh_git_wrapper_v3.py` (the key shredded after).
