# Digma — Session 33 Remediation Plan (v1.18.0 target)

**Date:** 2026-09-30 · **Input:** fifteenth live parity audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-31 code @ `f6a1b75`, clean re-seeded DB), desktop
1440×900 and mobile 390×844, DOM/computed-style level + **functional interaction testing** (the
session-31 next-steps directive: the reference's present-mode/zoom-cluster candidates re-pointed
at the never-FUNCTIONALLY-tested properties-panel controls, plus the standing mobile-nav sweep).
**Method:** every finding below was verified live in the reference's DOM (or measured as its own
dead/broken path) AND functionally in the clone's DOM before entering this plan; the plan was
re-validated line-by-line against the codebase before execution.

---

## Context

Session 31 (commit `e6d4202` + transcript push `f6a1b75`, PAD v1.17.0) closed the frame container
seam (the labeled transparent container at all three render sites), the project-delete confirm,
and the React-portal event-bubbling bug. This session executed the session-35 next-steps
directive — the reference's present-mode overlay internals measured dead (RA-7 standing: its
Present button is a no-op, so no overlay internals exist to measure), so the audit re-pointed at
the never-functionally-tested seam: the reference's properties-panel CONTROLS (its sliders and
color pickers had only ever been chrome/attribute-measured — sessions 16/17 read
`aria-valuemax`, session 15 read the row layouts; nothing had ever dragged a slider and watched
the canvas).

The baseline fast gates were re-run green BEFORE any change: lint ✅ · typecheck ✅ · 83/83
unit ✅ (the full gate — build/smoke/e2e — re-verified after the changes). Dev server healthy
with the DB anchored at the repo root (`[db] DATABASE_URL -> file:/home/z/my-project/digma/db/custom.db`).
Test suites verified present: vitest (83 checks) + playwright (93 checks), both excluding
`skills/`. `.env` carries `DATABASE_URL="file:../db/custom.db"` with the `db/` folder at the
repo root (re-seeded this session — 1 user / 2 projects / 6 elements / 1 team / 3 members).

### What the sweep found in the REFERENCE (live-measured this session)

- **RA-21 — the reference's Corner Radius slider is FUNCTIONAL.** Three keyboard increments
  (step 1) moved the slider 0→3 and the selected rectangle's canvas `border-radius` followed
  `0px → 3px` live. (First-ever functional datum for the reference's panel sliders — the
  historical record only held attribute reads.)
- **RA-22 — the reference's Fill color picker is FUNCTIONAL.** Setting `#ef4444` through the
  swatch input changed the canvas element's background to `rgb(239, 68, 68)` immediately.
- **RA-23 — the reference's Rotation slider is FUNCTIONAL.** Three increments appended
  `rotate(3deg)` to the element's inline transform.
- **RA-24 — the reference's Opacity slider is FUNCTIONAL.** Three decrements moved the element
  to `opacity: 0.97` (step 1 per key).
- **RA-26 — the reference's Stroke color picker is FUNCTIONAL.** Setting `#00ff00` painted
  `border: 1px solid rgb(0, 255, 0)` on the canvas element.
- **RA-27 — the reference's Stroke Width slider is FUNCTIONAL.** Two increments moved the
  stroke width 1→2 and the border-top-width followed live (after RA-26 made the stroke visible).
- **RA-25 — every panel slider/picker mutation PERSISTS across reload.** After a full reload the
  test rectangle still carried fill `rgb(239,68,68)`, radius `3px`, `scale(1.2) rotate(3deg)`,
  and opacity `0.97` — the reference's autosave covers panel mutations (its NUMBER inputs stay
  no-ops — the session-23 measurement stands; the asymmetry is its own bug class).
- **RA-29 — the Corner Radius slider's MAX is DYNAMIC: `min(width, height) / 2` of the selected
  element (the decisive new datum).** Triple-measured on three element sizes: a 200×150
  rectangle reads `aria-valuemax="75"` (= 150/2 — the historical "75" reading was THIS element's
  min/2, not a constant); a 46×23.366 rectangle reads `11.68298487339743` (= 23.366/2, unrounded);
  a 156×117 frame reads `58.41492436698704` (= 117/2). The formula fits all three exactly. The
  clone's slider is a FIXED 0–75 — the session-16/17 double-measurement that "confirmed 75" was
  measuring the same 200×150-class elements both times (the F18 rule extended: an attribute
  reading generalizes only across the element SIZES it was measured on).
- **RA-28 — the reference's Canvas Properties Background Color control is a DEAD no-op.** The
  swatch input accepts a new value transiently, but NO element on the page adopts the color (the
  canvas surface still renders `rgb(13, 17, 23)`), and the change does NOT survive reload (the
  input returns to `#0d1117`). A control that updates only its own input value — claim theater
  at the control level.
- **RA-30 — the reference's fresh TEXT element renders `font-family: Inter, sans-serif`
  (the default carries a fallback chain).** A fresh text measured computed
  `font-family: "Inter, sans-serif"` while its Font Family combobox displays `Inter`; a
  Roboto-selected text renders exactly `Roboto` and an Arial-selected text exactly `Arial` —
  ONLY the default Inter carries the `, sans-serif` fallback. (A stale prior-session audit
  artifact rendering `Arial` was corrected by the fresh-state re-measure — the F18 discipline.)
- **Architecture datum (no gap):** the reference bakes the zoom into each element's own
  transform — `translate(x·zoom, y·zoom) scale(elementScale) rotate(r) scale(zoom)` —
  mathematically equivalent to the clone's wrapper (`translate(pan) scale(zoom)` over
  per-element `translate(x,y) scale(s) rotate(r)`; uniform scales commute with rotation).
- **R3 — the reference's mobile nav still ships failure class A** at 390×844 (nav
  `display: none`, NO hamburger, the 36×36 bell only — the **fifteenth consecutive session**;
  evidence: `docs/screenshots/ref-audit-s32/ref-01-mobile-failure-classA.png`).

### What the sweep VERIFIED CORRECT in the clone (no change — parity or the working superset)

- **The clone's panel sliders and pickers all work** (the reference's are functional now too —
  parity confirmed from the other direction); the clone's NUMBER inputs also work (the standing
  superset over the reference's no-op inputs).
- **The clone's mobile navigation works end-to-end at 390×844** (re-verified live this session:
  the 44×44 trigger with `aria-label="Navigation menu"`, the drawer with all three links,
  scroll-lock while open, tap-navigate-AND-dismiss → `/Teams` + sheet gone, body overflow
  restored). **The Tailwind v4 mobile-nav bug (failure class A) is NOT present in the clone.**
- The clone's Background Color control changes the canvas LIVE (the superset over RA-28's dead
  control) — but see S33-3: the change does not persist.
- The fresh-text default font (Inter via the combobox), the seeded frame container contract,
  and the 83/83 unit baseline.

### Findings (all verified live in both apps; the clone with functional proof)

| # | Finding | Severity |
|---|---------|----------|
| S33-1 | **The clone's Corner Radius slider max is a FIXED 75 — the reference's is DYNAMIC `min(w,h)/2` (RA-29).** The seeded CTA Button (160×44) shows `max="75"` in the clone where the reference's contract gives 22 — the slider offers radii larger than half the element's height (incoherent chrome; CSS silently clamps the paint at 50%, so the control lies about its own range). The existing e2e pin `test("the corner-radius slider caps at 75")` measured the reference's 200×150-class audit rectangles and must be corrected to the dynamic contract (the session-29 precedent: tests follow the re-measured contract). The four per-corner NumberFields clamp only at ≥ 0 — the same incoherence one seam lower. | **Medium** |
| S33-2 | **The clone's canvas text renders computed `font-family: "Inter"` for the default — the reference renders `"Inter, sans-serif"` (RA-30).** All three render sites (canvas, thumbnail, present overlay) plus the documented `elementToStyle` contract write `fontFamily ?? "Inter"` — no fallback chain. When Inter is unavailable the reference falls back to the sans-serif stack; the clone falls to the UA default. The fix maps ONLY the default (null/undefined/"Inter") to `"Inter, sans-serif"` — Roboto/Arial/etc. render verbatim (measured). | **Low** |
| S33-3 | **The clone's Background Color control is LIVE-ONLY — the change never persists (the F19 "half-does X" class).** `setBackgroundColor` flips `saveState: "unsaved"` (store line ~295), the debounced autosave fires, but the PUT body carries ONLY `{ elements }` — the `backgroundColor` field never reaches the server. The `/api/projects/[id]` PATCH route accepts `backgroundColor` but nothing calls it for bg changes; the elements PUT route ignores it. Live-reproduced: set `#1a2b3c` → canvas paints it → reload → canvas reverted to `#0d1117` and the input reads `#0d1117`. A control that appears to work and silently loses its consequence on reload is bug territory (the F19 rule: trace the data path to its OBSERVABLE consequence — including across reload). | **Medium** |

**Deliberate superset notes (no change):** the clone keeps its working Background Color control
(the reference's is dead — RA-28; the fix makes the superset HONEST by persisting it); the
clone's working number inputs, zoom buttons, marquee, resize handles, painted selection ring,
eye, keyboard, AI mutations, and mobile nav all stay.

---

## P1 — Code changes (TDD, three coherent slices)

### Slice A — S33-1: the dynamic corner-radius max

**Files:** `src/lib/editor.ts`, `src/components/editor/properties-panel.tsx`,
`tests/e2e/editor-panels.spec.ts` (corrected pin).

1. **The helper** (`src/lib/editor.ts`): export
   `cornerRadiusMax(el: Pick<DesignElementDTO, "width" | "height">): number` returning
   `Math.min(el.width, el.height) / 2` — the reference's measured formula (RA-29; the raw
   unrounded value — the reference's own attribute carries `11.68298487339743`).
2. **The slider** (`properties-panel.tsx`): the All Corners `SliderRow` gets
   `max={cornerRadiusMax(single)}` and its `onChange` clamps
   `Math.min(Math.max(radius, 0), cornerRadiusMax(single))` (replacing the fixed 75 pair). The
   `SliderRow` fill-% math already divides by `(max - min)` so the track fill stays correct at
   any max.
3. **The per-corner NumberFields** (same section): each gains the same upper clamp
   (`Math.min(Math.max(radius, 0), cornerRadiusMax(single))`) — the linked-corner inputs and
   the slider share one coherent range (a value above the slider's max would peg the slider).
   The reference's own per-corner inputs carry no max attributes, but they are no-ops there —
   the clone's functional superset stays internally coherent (the F22 rule).
4. **The corrected e2e pin**: `test("the corner-radius slider caps at 75 …")` becomes the
   dynamic contract — the CTA Button (160×44) reads `max="22"`; a second selection (the Hero
   Section frame, 560×320) reads `max="160"`.

### Slice B — S33-2: the default font's fallback chain

**Files:** `src/lib/editor.ts`, `src/components/editor/canvas.tsx`,
`src/components/project-card.tsx`, `src/components/editor/editor-view.tsx`.

5. **The helper** (`src/lib/editor.ts`): export
   `canvasFontFamily(fontFamily?: string | null): string` returning `"Inter, sans-serif"` when
   the family is null/undefined/`"Inter"`, else the family verbatim (the measured RA-30 map:
   Inter → `Inter, sans-serif`; Roboto → `Roboto`; Arial → `Arial`).
6. **The three render sites + the documented contract**: `canvas.tsx`
   (`style.fontFamily = canvasFontFamily(element.fontFamily)`), `project-card.tsx` (thumbnail),
   `editor-view.tsx` (present overlay), and `elementToStyle`'s text branch all swap
   `?? "Inter"` → the helper. The Font Family COMBOBOX keeps displaying the model value
   (`Inter`) — the combobox contract is unchanged; only the render chain gains the fallback.

### Slice C — S33-3: the background color persistence

**Files:** `src/components/editor/editor-view.tsx`, `src/app/api/projects/[id]/elements/route.ts`.

7. **The autosave body** (`useAutosave`'s `flush`): the PUT body gains
   `backgroundColor: useEditorStore.getState().backgroundColor` alongside `elements` — the
   single save seam carries the full canvas state.
8. **The route** (`elements/route.ts` PUT): accept an optional `backgroundColor` (string) —
   `clampColor`-validated, written inside the existing `$transaction`'s `project.update` (the
   same atomic save as the element replace). Absent/invalid → the field is untouched
   (backward-compatible with every other caller).

### Tests (RED first)

- **Unit** — `src/lib/editor.test.ts`:
  - a new `cornerRadiusMax` describe: 160×44 → 22; 200×150 → 75; 156×117 → 58.5; 560×8 → 4
    (the seeded Accent Bar's exact-at-max case);
  - a new `canvasFontFamily` describe: `undefined`/`null`/`"Inter"` → `"Inter, sans-serif"`;
    `"Arial"` → `"Arial"`; `"Roboto"` → `"Roboto"`;
  - the `elementToStyle` text branch gains the default-chain case (`el({ type: "text" })` →
    `fontFamily === "Inter, sans-serif"`).
- **E2E** — `tests/e2e/editor-panels.spec.ts`, a new describe ("session 33"):
  1. "the corner-radius slider max is dynamic — half the element's smaller side (RA-29)" —
     select the CTA Button → `max="22"`; select the Hero Section frame → `max="160"`; fill the
     Top Left per-corner input with 75 on the CTA Button → the canvas `border-radius` settles
     at `22px` (the shared clamp).
  2. "the seeded text renders the reference's default font fallback chain (RA-30)" — the
     seeded Headline's computed `font-family` is `"Inter, sans-serif"` (pre-fix: `"Inter"`).
  3. "the canvas background color persists across reload (S33-3)" — deselect, fill the
     Background Color hex input `#1a2b3c`, wait for Saved, reload, assert the canvas surface
     still paints `rgb(26, 43, 60)` AND the hex input still reads `#1a2b3c`; then restore
     `#0d1117` + wait for Saved (a RED failure must never leave the shared e2e DB mutated).
  4. The corrected legacy pin (Slice A item 4) lives in the session-15 describe it came from.

## P2 — Documentation alignment (post-fix)

- **PAD → v1.18.0:** new revision block (the S33-1/S33-2/S33-3 findings + the reference-side
  RA-21…RA-30/R3 measurements + the fifteenth-audit record); the ADR-011 amendment (the corner
  radius cap is a FUNCTION of the element — `min(w,h)/2` — not the constant 75; the text
  render's default font chain carries the `, sans-serif` fallback); the persistence note for
  the canvas background (the autosave PUT carries it; the elements route writes it in the same
  transaction); §7.1/§7.4 counts refreshed.
- **AGENTS.md:** the element-type facts (the dynamic corner max + the font fallback chain) +
  the background-color persistence + the counts.
- **CLAUDE.md:** ditto.
- **README.md:** the properties-panel feature row (the dynamic corner cap) + the editor row
  (persisted canvas background) + the counts.
- **digma_SKILL.md → v1.17.0:** lesson **F26** (an attribute reading generalizes only across
  the element sizes it was measured on — the `aria-valuemax="75"` was a 200×150 element's
  `min(w,h)/2`; pin UI clamps as FUNCTIONS of the element state, never constants; and the F19
  echo — a control that works in-session but reverts on reload is the "half-does X" class:
  trace the data path through the RELOAD boundary) + the §5/§6 rows + the counts.
- `docs/remediation-plan-session33.md` (this plan + execution status) +
  `docs/session_37.md` (this session's structured log) + the worklog Task 40 entry.

## P3 — Delivery

- Screenshots: re-capture the standard set from the remediated dev server (re-seeded first)
  → `docs/screenshots/`; audit provenance → `docs/screenshots/ref-audit-s32/` (the reference's
  mobile failure-class-A, its editor with the functional sliders, the clone's working mobile
  nav).
- `.env.example`: re-verify against the codebase (unchanged this session — no new env vars) —
  included in the commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …`.
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build →
  ./scripts/smoke-test.sh → test:e2e` — all green before push.
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- The clone's functional panel controls (RA-21…27 parity from the other direction) and its
  working number inputs (the standing superset over the reference's no-op inputs).
- The reference's dead Background Color is NOT ported — the clone's working control stays and
  becomes honest (persisted).
- The mobile navigation fix (re-verified end-to-end this session — the reference still ships
  failure class A, R3 15th).
- The AI update path, Share/Present supersets, gesture-level undo, working zoom, the painted
  selection ring, the per-element transform order (measured equivalent), all standing
  decisions.
- The historical PAD revision blocks (the v1.10.0-era "75" pin stays as the historical record;
  the new block documents the re-measure).

---

## Execution status (end of session 33)

**All items EXECUTED and GREEN.** RED first (the exact captured assertions): the unit layer failed
5/5 at their exact points — the `elementToStyle` default-chain test at
`expected 'Inter' to be 'Inter, sans-serif'`, the `cornerRadiusMax` and `canvasFontFamily`
describes at `TypeError: … is not a function` (the helpers did not exist yet). The e2e layer
failed 3/3 against the pre-fix build at their exact assertions — the dynamic-max test at
`Expected: "22", Received: "75"` (the fixed slider max), the font-chain test at
`Expected: "Inter, sans-serif", Received: "Inter"`, and the bg-persistence test at
`Expected: "#1a2b3c", Received: "#0D1117"` (the silent reload revert). Then GREEN (Slice A:
`cornerRadiusMax()` feeding the slider max + its onChange clamp + the four per-corner clamps;
Slice B: `canvasFontFamily()` at all three render sites + `elementToStyle`; Slice C: the
autosave PUT body carrying `backgroundColor` + the elements route writing it inside the
transaction). The historical "caps at 75" e2e pin corrected to the dynamic contract in the same
commit. Full gate green: **88 unit (+5) / 28 smoke / 96 e2e (+3)**.

**Live verification (dev server, post-fix):** the CTA Button's All Corners slider reads
`max="22"` (min(160,44)/2); the seeded Headline renders computed `font-family: "Inter,
sans-serif"`; the background-color flow works end-to-end — set `#1a2b3c` through the hex input
→ Saved badge → reload → the input still reads `#1a2b3c` AND the canvas surface still paints
`rgb(26, 43, 60)` (pre-fix: full revert) — then restored to `#0D1117` (pristine seed state).

**The audit's standing sweeps:** the reference's mobile nav re-confirmed failure class A at
390×844 (the 15th consecutive session; evidence `docs/screenshots/ref-audit-s32/`); the clone's
mobile nav re-verified end-to-end (44×44 trigger, drawer, scroll-lock, tap-navigate-and-dismiss,
body overflow restored) — the Tailwind v4 failure class A remains NOT present in the clone. The
reference's project board left at its pre-audit layer count (the audit's fresh Text 10 deleted
through its own row trash; the slider-mutation rectangle persists as the audit playground's
record, consistent with prior sessions' practice).
