# Digma — Session 29 Remediation Plan (v1.16.0 target)

**Date:** 2026-09-30 · **Input:** thirteenth live parity audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-27 code @ `3a57ad7`, clean re-seeded DB), desktop
1440×900 and mobile 390×844, DOM/computed-style level + **functional interaction testing** (the
session-27 next-steps directive: the AI `update` operations on hidden elements, the
presentation/thumbnail paths, plus the standing mobile-nav/parity sweep). **Method:** every
finding below was verified live in the reference's DOM (or measured as its own dead/broken
path) AND functionally in the clone's DOM before entering this plan; the plan was re-validated
line-by-line against the codebase before execution.

---

## Context

Session 27 (commit `afd235f` + transcript push `3a57ad7`, PAD v1.15.0) closed the wall's AI
seam (the instruction-level delete filters locked ids) and ported the reference's
newly-measured reply footer with a working Revert. This session executed the session-27
next-steps directive — the AI update-on-hidden sweep and the presentation/thumbnail paths —
plus a fresh hunt through the never-audited element-type seams (lines, text panels).

The baseline fast gates were re-run green BEFORE any change: lint ✅ · typecheck ✅ · 78/78
unit ✅ (the full gate — build/smoke/e2e — re-verified after the changes). Dev server healthy
with the DB anchored at the repo root (`[db] DATABASE_URL -> file:/home/z/my-project/digma/db/custom.db`;
the `env -u DATABASE_URL` discipline for every gate command). Test suites verified present:
vitest (78 checks) + playwright (83 checks), both excluding `skills/`. `.env` carries
`DATABASE_URL="file:../db/custom.db"` with the `db/` folder at the repo root (re-seeded this
session — `db:push` in-sync, `db:seed` → 1 user / 2 projects / 6 elements / 1 team / 3
members).

### What the sweep found in the REFERENCE (live-measured this session)

- **RA-5 — the reference's AI UPDATE path is the same claim theater as its deletes.**
  Row-selecting Rectangle 1 and submitting "make selected elements red" produced the reply "I
  have updated the selected rectangle to red." + "1 action(s) performed" + a Revert control —
  and the canvas fill stayed `rgb(59, 130, 246)` on ALL FOUR rectangles; a reload confirmed
  the persisted state never changed. The session-27 RA-2 finding (deletes never execute)
  extends to updates: the reference's AI mutations are ALL claim theater.
- **RA-6 — the reference's Share button is a dead no-op.** Clicking it produced no dialog, no
  overlay, no portal children, no navigation (verified by fixed/absolute overlay scan + full
  snapshot diff).
- **RA-7 — the reference's Present button is a dead no-op.** No navigation, no fullscreen
  element, no dialog, no overlay — the DOM is byte-identical after the click.
- **RA-8 — the reference's LINE element renders as an SVG diagonal stroke, not a filled box**
  (the decisive new datum). Drawing with its Line tool creates a transparent positioning div
  (fill `transparent`, no borders) containing:
  `<svg class="overflow-visible absolute top-0 left-0" style="pointer-events: stroke">` with
  `<line x1="0" y1="0" x2="W" y2="H" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round">`.
  The measured line model defaults: **fill=transparent, stroke=#FFFFFF, strokeWidth=2** (the
  Stroke Width slider reads 2 for a fresh line; the SVG stroke-width follows it). The SVG is
  `overflow-visible` so a drag that ends up-left of its start still renders the full stroke.
- **RA-9 — the reference's properties panel renders the Corner Radius section
  TYPE-CONDITIONALLY.** Measured on fresh draws: RECTANGLE shows POSITION & SIZE | CORNER
  RADIUS | FILL & STROKE | TRANSFORM | OPACITY; LINE and ELLIPSE show POSITION & SIZE | FILL
  & STROKE | TRANSFORM | OPACITY (no Corner Radius); TEXT shows POSITION & SIZE | TEXT |
  TRANSFORM | OPACITY (no Corner Radius AND no Fill & Stroke).
- **RA-10 — the reference's TEXT section is fully measured for the first time:** `Content`
  (a single-line INPUT whose VALUE — not placeholder — is the default content **"Type
  here..."**), `Font Size` (number input, 16 default), `Color` (a color picker + hex row,
  #ffffff default), `Font Family` (a Radix Select combobox —
  `role="combobox"`, shadcn trigger chrome, w-255 h-32 — with SEVEN options: Inter,
  Roboto, Arial, Helvetica, Times New Roman, Georgia, Verdana), and `Text Align` (a
  segmented lucide button group — `align-left`/`align-center`/`align-right` icons on
  `flex items-center gap-1 mt-2`). **Both functional controls verified live:** picking Arial
  changed the canvas text's computed `font-family` to "Arial"; clicking the center button
  changed its computed `text-align` to "center". There is NO font-weight control.
- **RA-11 — the reference's undo is FRAGMENTED per pointer-move.** After ONE drag gesture
  (fine-grained pointermove events), the undo button enabled — and it took FIVE undo clicks
  to return the element to its origin, with the FIRST undo moving the element FURTHER away
  (-11,368 → -27,360) before the path home. The clone's gesture-level `commit()` (one history
  entry per gesture) is the coherent design — verified in code, no change.
- **RA-12 — the reference's zoom buttons are dead** (107% never changes through zoom-in/out
  clicks) — reconfirmed standing data.
- **R3 — the reference's mobile nav still ships failure class A** at 390×844 (nav
  `display: none`, NO hamburger, the 36×36 bell only — the thirteenth consecutive session;
  evidence: `docs/screenshots/ref-audit-s29/ref-02-mobile-failure-classA.png`). The reference's
  MOBILE EDITOR is a squeezed desktop layout (measured: Layers at x=64, AI Assistant crushed
  to ~93px, Canvas Properties at x=413 — off-screen — and the tool rail invisible).
- Standing reconfirmations: the eye toggle is still a no-op (icon never flips, canvas never
  changes — 13th consecutive); the reference's canvas drag only engages with multi-event
  pointermove streams (single-jump drags no-op).

### What the sweep VERIFIED CORRECT in the clone (no change — parity or the working superset)

- **The AI update path WORKS** (the counterpart of RA-5's theater): row-selecting the CTA
  Button and submitting "make selected elements red" changed its canvas fill blue →
  `rgb(239, 68, 68)` with the honest "1 action(s) performed" footer; the **Revert restored
  the fill and settled the footer away** (the session-27 machinery working on the update
  path).
- **The AI update on a HIDDEN element is coherent explicit-surface semantics**: hiding the
  Glow (the working eye), row-selecting it, and submitting "make selected elements green"
  mutated the model (#10b981 in the panel's hex row while hidden) and the canvas showed the
  green after unhiding — the same class the reference itself executes on locked elements
  (session-27 R2). The hidden element never renders while hidden (canvas fill count 4 → 3).
- **The presentation path**: the clone's Present is a working fullscreen overlay (z-200,
  #0d1117 bg, all 6 shapes, fit-to-viewport scale, Escape exits) — the working superset over
  the reference's dead RA-7 button. The clone's Share copies the URL + toasts — the working
  superset over the dead RA-6 button.
- **The thumbnail structure is parity-exact**: `aspect-[16/10] bg-gradient-to-br
  from-blue-50 to-purple-50` wrapper, `rgb(13, 17, 23)` canvas area, live scaled element
  renders (the reference's own card DOM measured and compared class-for-class).
- **The mobile nav works end-to-end at 390×844** (44×44 trigger, drawer with 3 links,
  scroll-lock, tap-navigate-and-dismiss, hidden at 768) and the mobile editor keeps the
  documented full-width-canvas improvement.
- **The undo granularity is gesture-level** (one `commit()` per gesture — the RA-11
  counterpart done right), the drag/resize coordinate math is zoom-correct, and the line
  layer-row icon is already `lucide-minus` (parity with the reference's measured row).

### Findings (all verified live in both apps; the clone with functional proof)

| # | Finding | Severity |
|---|---------|----------|
| S29-1 | **The clone's LINE rendering is correct on the CANVAS but wrong at three seams: the box BORDER, the THUMBNAIL, and PRESENT mode.** The canvas's `CanvasElement` already renders the reference's SVG diagonal (`stroke ?? "#FFFFFF"`, `strokeWidth \\|\\| 2`, `linecap="round"`, `overflow-visible`) and `defaultElementFor("line")` already carries the measured defaults (`fill: null, stroke: "#FFFFFF", strokeWidth: 2`) — but (a) the shared style chain also applies the box BORDER from stroke (`if (element.stroke && element.strokeWidth > 0) style.border = …`), so a drawn line renders a 2px WHITE RECTANGLE around the diagonal (live-verified: `border: 2px rgb(255,255,255)`; the reference's line div measured `border-0` on all four sides — evidence `docs/screenshots/ref-audit-s29/clone-05-line-bordered-box.png`); and (b) `CanvasThumbnail` (project-card.tsx) and `PresentOverlay` (editor-view.tsx) have NO line branch at all — they render the bordered empty box WITHOUT the SVG stroke (fill=null → no background; the thumbnail's project card and the presentation show an empty outlined rectangle where the canvas shows a stroke). The port: skip the border for lines at all three sites and render the same SVG diagonal in the thumbnail and present overlay. | **Medium** |
| S29-2 | **The properties panel renders the Corner Radius section for every element type; the reference renders it type-conditionally (RA-9).** Measured: hidden for LINE and ELLIPSE (and TEXT, see S29-3); shown for RECTANGLE. A corner-radius slider on a corner-less shape is incoherent chrome (the same class as resize-handles on a locked element, S23-2). Unmeasured types (frame/image/path) keep the current show behavior. | **Low** |
| S29-3 | **The text element's properties panel diverges from the reference's measured TEXT layout (RA-10).** The clone renders SIX sections for a text selection (Position & Size, Corner Radius, Fill & Stroke, Transform, Opacity, Text); the reference renders FOUR (Position & Size, TEXT, Transform, Opacity). The clone's TEXT section carries Content (textarea), Font Size, Weight (select), Align (select); the reference's carries Content (INPUT, value "Type here..."), Font Size (16), Color (picker + hex row), Font Family (Radix combobox, 7 fonts, FUNCTIONAL — applies to the canvas), Text Align (segmented lucide buttons, FUNCTIONAL). The text's COLOR control belongs in the TEXT section (the reference hides Fill & Stroke for text entirely). The Font Family port needs a model field (`fontFamily`) — schema addition + DTO + defaults + validation enum + rendering at all three render sites. The Weight control is NOT in the reference's measured chrome (the model field and rendering keep honoring it — the panel just stops exposing it, exactly like the reference). The text default content "Text" → "Type here..." (the reference's measured VALUE). | **Medium** |

**Deliberate superset notes (no change):** the clone keeps its WORKING AI mutation engine
(the reference's is claim theater — RA-5); the clone's Share/Present work (the reference's
are dead — RA-6/RA-7); the clone's gesture-level undo stays (the reference's is fragmented —
RA-11); the clone's working zoom buttons stay (the reference's are dead — RA-12); the
clone's working eye/drag/keyboard stay. The reference's FALSE reply claims are deliberately
NOT ported (F23: port outcomes, never claims).

---

## P1 — Code changes (TDD, three coherent slices)

### Slice A — S29-1: the line's border-less stroke at every render site

**Files:** `src/components/editor/canvas.tsx`, `src/components/project-card.tsx`,
`src/components/editor/editor-view.tsx`.

1. **The line model defaults and the canvas SVG ALREADY EXIST** — verified line-by-line AND
   live this session: `defaultElementFor("line")` returns `fill: null, stroke: "#FFFFFF",
   strokeWidth: 2` and `CanvasElement` renders the reference's diagonal SVG
   (`stroke ?? "#FFFFFF"`, `strokeWidth || 2`, `linecap="round"`, `overflow-visible`). The
   gaps are the border and the two off-canvas render sites:

2. **`CanvasElement` skips the box border for lines** — the border-from-stroke style line
   gains an `element.type !== "line"` guard (the reference's line div measured border-0 on
   all four sides; the stroke feeds the SVG, never the box). A user-set fill still paints
   the box background (the reference's own div renders its fill).

3. **`CanvasThumbnail` renders the SVG diagonal** (project-card.tsx gains its first line
   branch): the same `<svg><line x1=0 y1=0 x2={w} y2={h} …/></svg>` child, border skipped
   for lines — so the dashboard/recent cards show the stroke the canvas shows.

4. **`PresentOverlay` renders the SVG diagonal** (same branch; border skipped for lines).

5. **The seed is NOT changed** (its 6 elements contain no line — the e2e expectations pin
   the exact layer list; new e2e tests draw their own lines).

### Slice B — S29-2: the type-conditional Corner Radius section

**Files:** `src/components/editor/properties-panel.tsx`.

4. The Corner Radius section wraps in
   `{!["line", "ellipse", "text"].includes(single.type) && (…)}` — the measured hidden set.
   Frame/image/path keep showing it (unmeasured; the current behavior).

### Slice C — S29-3: the text panel's measured TEXT layout

**Files:** `prisma/schema.prisma`, `src/lib/editor.ts`, `src/lib/validation.ts`,
`src/components/editor/properties-panel.tsx`, `src/components/editor/canvas.tsx`,
`src/components/project-card.tsx`, `src/components/editor/editor-view.tsx`,
`src/components/ui/select.tsx` (NEW — the shadcn Select on the already-installed
`@radix-ui/react-select`).

5. **The model**: `prisma/schema.prisma` DesignElement gains `fontFamily String?`;
   `DesignElementDTO` gains `fontFamily: string | null`; `defaultElementFor("text")` sets
   `text: "Type here..."`, `fontSize: 16` (the measured fixed default — the height-clamp
   formula goes), `fontFamily: "Inter"`; validation gains a `FONT_FAMILIES` enum
   (Inter, Roboto, Arial, Helvetica, Times New Roman, Georgia, Verdana — the measured
   options) enforced on write. `db:push` re-runs (additive column, `--accept-data-loss` is
   the script default); the e2e global-setup re-pushes its own scratch DB.

6. **The rendering**: the text branch at all three render sites gains
   `fontFamily: element.fontFamily ?? "Inter"` (and keeps the existing color/size/weight
   chain).

7. **The panel restructure** (the measured four-section layout):
   - Corner Radius: hidden for text (Slice B's set).
   - Fill & Stroke: hidden for text (`single.type !== "text"`).
   - The TEXT section (measured chrome): `Content` — a single-line INPUT (value
     `single.text ?? ""`); `Font Size` — NumberField (existing); `Color` — the existing
     `HexColorRow` bound to `single.fill` (label "Color"); `Font Family` — a Select
     combobox over `FONT_FAMILIES` (trigger chrome matching the reference's measured
     `role="combobox"` shadcn trigger); `Text Align` — a segmented lucide button group
     (`AlignLeft`/`AlignCenter`/`AlignRight` icons, the active button carrying the
     reference's pressed state) writing `textAlign`. The Weight select control is REMOVED
     from the panel (the model field + rendering keep honoring it — the seeded weights keep
     rendering; the reference exposes no weight control).

- **Tests (RED first):**
  - Unit — `src/lib/editor.test.ts`, a new describe ("element defaults — the text contract
    (session 29)"):
    1. "a fresh text element carries the reference's content/font defaults" —
       `defaultElementFor("text", …)` returns `text: "Type here..."`, `fontSize: 16`,
       `fontFamily: "Inter"` (pre-fix: `text: "Text"`, no fontFamily, height-clamped
       fontSize).
    2. "a fresh line carries the reference's stroke defaults" — a regression pin of the
       existing correct defaults (`fill: null`, `stroke: "#FFFFFF"`, `strokeWidth: 2`) —
       GREEN by design (they already match).
    3. `validation` — the fontFamily enum accepts "Arial" and rejects "Comic Sans" (new).
  - E2E — `tests/e2e/editor-panels.spec.ts`, a new describe ("line + text element rendering
    (session 29)"):
    1. "drawing a line renders the SVG diagonal stroke with NO box border" — select the
       Line tool, drag a line on the canvas, assert the new element renders an
       `svg > line` with `stroke="#FFFFFF"` and `stroke-width="2"` and computed
       `border-top-width: 0px` (pre-fix: `border: 2px rgb(255, 255, 255)` — the white box
       around the diagonal).
    2. "a line selection hides the Corner Radius section" — row-select the drawn line,
       assert the panel's section list is exactly [Position and size, Fill and stroke,
       Transform, Opacity] (pre-fix: includes "Corner radius").
    3. "an ellipse selection hides the Corner Radius section" — row-select the seeded Glow,
       same assertion.
    4. "a text selection renders the reference's four-section layout with the TEXT
       controls" — row-select the seeded Headline, assert the section list is exactly
       [Position and size, Text, Transform, Opacity] (no Corner radius, no Fill and stroke),
       the Content input carries the text, the Font Family combobox shows "Inter", and the
       Text Align segmented buttons render three icon buttons (pre-fix: six sections with
       textarea + Weight select).
    5. "changing the Font Family applies to the canvas text" — open the combobox, pick
       "Arial", assert the canvas text element's computed font-family becomes Arial (the
       reference's own live-verified behavior).
    6. "the layer row still says Line while the canvas shows the stroke" (the
       coherence pin — the S19-3 class).

## P2 — Documentation alignment (post-fix)

- **PAD → v1.16.0:** new revision block (the S29-1/S29-2/S29-3 findings + the
  reference-side RA-5…RA-12/R3 measurements + the thirteenth-audit record); the
  element-types fact row gains the line's SVG stroke contract + the text panel's measured
  layout; §7.1/§7.4 counts refreshed.
- **AGENTS.md:** the element-type facts + the panel's type-conditional sections + the counts.
- **CLAUDE.md:** ditto.
- **README.md:** the feature rows + the counts.
- **digma_SKILL.md → v1.15.0:** lesson **F24** (a dead reference RENDERING path is measured
  by its DOM, not by its absence of errors — the reference's line looked "invisible" until
  the SVG child was inspected; measure the element's actual children before concluding a
  control is dead) + the §5/§6 rows + the counts.
- `docs/remediation-plan-session29.md` (this plan + execution status) +
  `docs/session_33.md` (this session's structured log) + the worklog Task 38 entry.

## P3 — Delivery

- Screenshots: re-capture the standard set from the remediated dev server (re-seeded first) →
  `docs/screenshots/`; audit provenance already captured this session
  (`docs/screenshots/ref-audit-s29/`: the reference's AI-update theater, its mobile
  failure-class-A, its mobile editor squeeze, its invisible-line DOM + the SVG reveal).
- `.env.example`: re-verify against the codebase (unchanged this session) — included in the
  commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …`.
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build →
  ./scripts/smoke-test.sh → test:e2e` — all green before push.
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- The AI update path (works — the RA-5 counterpart), the AI-on-hidden explicit-surface
  semantics, the reply footer/Revert machinery (re-verified on the update path this session).
- The Share and Present working supersets (the reference's are dead — RA-6/RA-7).
- The gesture-level undo commit (the reference's is fragmented — RA-11).
- The thumbnail structure, the mobile nav fix, the mobile editor improvement (re-verified
  end-to-end this session).
- The seeded fontWeight rendering (the model field and render chain stay; only the panel
  control goes — the reference's measured chrome).
- The reference's claim-theater replies, dead zoom buttons, no-op eye (13 consecutive
  measurements) — not ported.
- The historical PAD revision blocks.

---

## Execution status (end of session 29)

**All items EXECUTED and GREEN.** RED first (the exact captured assertions): `editor.test.ts`'s
text-defaults test failed at `'Text' !== 'Type here...'` (plus fontSize 32 ≠ 16 and no
fontFamily); the line-border contract failed at `'2px solid #FFFFFF' !== undefined`; the text
font chain failed (no fontFamily in the style); `validation.test.ts` failed at import
(clampFontFamily did not exist). The e2e suite failed 5/5 against the pre-fix build — the line
test at the exact border assertion (`Expected: "0px", Received: "2px"` — the white box around
the diagonal), the two Corner-Radius-hidden tests at the extra section, the text-layout test at
the six-section list, and the Font Family test at the missing combobox. Then GREEN (Slice A:
the border guard at all three render sites + the thumbnail/present SVG diagonals; Slice B: the
type-conditional Corner Radius guard; Slice C: the `fontFamily` model field + schema + defaults
+ validation enum + the shadcn Select + the measured TEXT section + the segmented Text Align
buttons). Full gate green: **82 unit / 28 smoke / 88 e2e (+4 / +5)**.

**En-route discoveries (executed beyond the written plan):**

1. **The audit's own first reading of the line rendering was WRONG — the code-check lesson
   F24(c).** The initial code read (a truncated grep window on `defaultElementFor`) concluded
   the line model defaults were missing and the canvas rendered a filled blue box; the live
   draw contradicted it (transparent div + SVG stroke already rendering), and the complete
   re-read found the existing line branch (`fill: null, stroke: "#FFFFFF", strokeWidth: 2`)
   and the existing canvas SVG. The plan was corrected BEFORE execution — S29-1's real scope
   was the box border + the two off-canvas render sites. The lesson is recorded as F24.
2. **The canvas never rendered `textAlign`** (the pre-fix Align select wrote a field no
   consumer read — a dead-control-that-lies). Fixed beyond the written plan: the CanvasElement
   text branch now renders `textAlign` + a `justify-content` mapping (left → flex-start,
   center → center, right → flex-end) so the segmented buttons are both functional AND
   visible; the thumbnail and present overlay render the textAlign too. Pinned by the e2e
   assertions (`text-align: center`, `justify-content: center`).
3. **Three existing e2e tests pinned the OLD five-section-always layout** (the
   one-element-selected sections test, the session-15 chrome describe's beforeEach selecting
   the text element). Test-side corrections: the sections test now pins BOTH measured layouts
   (the rectangle's five + the text's four), and the session-15 chrome beforeEach selects the
   CTA Button (the rectangle) — the chrome it pins (radius slider, fill pills, stroke width)
   is corner-able-type chrome. One en-route typo (`SEESED_PROJECT`) fixed mid-run.

Live verification (dev server, post-fix): the drawn line renders `border-top-width: 0px` with
the SVG stroke (#FFFFFF, width 2, round caps); the line/ellipse selections show the four-section
panel; the text selection shows [Position and size, Text, Transform, Opacity] with the Content
input, the Font Family combobox ("Inter"), and the three align buttons; picking Arial changes
the canvas text's computed font-family; clicking Align center changes its computed text-align
and justify-content; the project-card thumbnail renders the line's SVG diagonal.
