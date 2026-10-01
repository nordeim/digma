# Remediation Plan — Session 50 (the Twenty-Sixth Audit)

**Date:** 2026-10-01 · **Trigger:** the operator's session-58 directive (refresh, re-validate the codebase against the mandated docs, iterate to parity with `https://digma-371dfd0d.base44.app/`, pay particular attention to the mobile navigation menu, use TDD, capture screenshots, align docs, push via the SSH wrapper) · **Code state at start:** `6632c36` (session 49 delivered at `99c876f` + the operator's `docs/session_58.md` transcript push)

## The audit method

The twenty-sixth consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
driven by the session-58 suggested next steps — the editor's text-tool UX
at mobile (the properties panel is `lg:flex`, so a phone cannot edit text
content), the print/export surface, or a Lighthouse/a11y pass — plus the
standing sweeps (R3 26th, the desktop drift check, and the full live
verification of the CLONE's mobile navigation at 390×844, the operator's
particular focus). No reference board mutations; the only reference-side
actions were the operator's own account login + read-only probes (+ two
clicks on the reference's own dead Create-Team buttons).

## Reference findings (26th audit — no drift, no new gaps)

- **The Teams Create-Team dead chrome (26th datum): still dead.** Both
  buttons open ZERO dialogs (live-verified one click each;
  `[role=dialog]` count 0 after both). The Teams page still renders its
  EMPTY state ("No teams yet").
- **R3 re-confirmed (26th): mobile nav failure class A at 390×844** — the
  reference's desktop nav computes `display: none`, its links collapse to
  0×0, no hamburger exists, and the only header button is the unlabeled
  36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s56/ref-01-mobile-dashboard-390.png`.
- **Standing surfaces re-verified (no drift):** the greeting reads "Good
  morning, sepnetflix2023 ✨" (the account name still populated — the
  session-49 state); Quick Stats 1 Projects / 0 Teams / 1 Active this
  week / Pro; the Recent sort default `last_accessed` with its four
  options; the exact-match purple-50 pill on `/Teams`.
- **The reference's editor carries NO keyboard-shortcut affordance
  (26th datum):** nine tool titles without shortcut text, zero `kbd`
  elements, no dialog.
- **The reference's mobile editor header STILL clips Share/Present at
  390×844:** re-measured Share L385–R458, Present L466–R551 — identical
  to sessions 48/49. Evidence:
  `docs/screenshots/ref-audit-s56/ref-02-mobile-editor-header-390.png`.
- **The reference board still carries 9 layers** (the session-49 data
  state — the owner's own activity; the audits never mutate it).
- **The reference's mobile editor has NO properties panel and NO
  text-editing affordance at 390×844** (live-measured: no Position &
  Size container, zero text inputs). A clone-side mobile text-editing
  surface is therefore a PURE SUPERSET — the same documented
  mobile-editor improvement family as S47-1 (the Present exit) and
  S48-2 (the header wrap): the reference's failure is not a contract to
  copy.

### The clone's mobile navigation verified LIVE, end-to-end at 390×844

(the operator's particular focus): the 44×44 hamburger with the stable
`aria-label="Navigation menu"` + `aria-expanded`/`aria-controls`
contract; the Sheet opens as a dialog with the three links at 44px
targets; `data-scroll-locked` engages on `<body>` with `overflow:
hidden`; Escape closes with focus returning to the trigger AND the lock
releasing; a link tap navigates AND dismisses; at 768 the hamburger
computes `display: none` and the desktop nav `flex` (and at 390 the
inverse). **The Tailwind v4 failure class A is NOT present in the clone —
the 26th consecutive session.**

## The measured gap this session closes — mobile text editing

Live-verified on the clone at 390×844 (`/Editor?projectId=`): the
properties panel renders `hidden … lg:flex` (line 739 of
`editor-view.tsx`), so below lg there is NO properties surface of any
kind — the probe found ZERO text-content inputs in the whole editor. A
phone can DRAW a text element (the toolbar's Text tool works at mobile;
`addElements` selects the created element), but it can never EDIT the
content, font size, color, family, or alignment: the fresh element is
stuck at its "Type here..." default forever. The desktop panel's TEXT
section (properties-panel.tsx lines 618–697) carries all five controls —
Content (single-line input), Font Size, Color (picker + hex), Font
Family (Radix Select over the 7 measured options), Text Align
(segmented lucide buttons).

### S50-1 — the shared `TextSection` seam (single source, the F35e lesson)

The TEXT section JSX moves out of `properties-panel.tsx`'s inline
`single.type === "text"` block into an EXPORTED component — the
established shared-surface pattern (`InlineProjectRename` exported from
`project-card.tsx` and consumed by both the grid card and the list
card):

- `export function TextSection({ element, update }: { element:
  DesignElementDTO; update: (patch: Partial<DesignElementDTO>) => void })`
  in `properties-panel.tsx` — the exact current markup (Content input
  with `aria-label="Text content"`, Font Size NumberField, Color
  HexColorRow, Font Family Select, Text Align segmented group), with
  `single` → `element` and the panel's `update` passed in.
- The desktop panel consumes it inside its existing
  `single.type === "text"` guard — a PURE refactor, pixel-identical
  markup (the existing editor-panels e2e pins hold it).
- The new mobile surface (S50-2) consumes the SAME component — the two
  surfaces can never diverge (two maps of the same domain WILL diverge;
  F35e).
- **TDD:** the repo's source-contract pattern
  (`tests/canvas-memo.test.ts` / `tests/theme.test.ts`) — a new
  `tests/text-section.test.ts` pinning: the export exists, the
  properties panel consumes it (no inline `aria-label="Text content"`
  duplication outside the shared component), and the mobile surface
  (editor-view.tsx) consumes it too.

### S50-2 — the mobile text-editing surface (the working superset)

- **The trigger:** a floating "Edit text" chip at `absolute bottom-4
  right-4 z-10 lg:hidden` INSIDE the canvas's relative wrapper (the
  zoom cluster's `left-4 top-4` mirror; the bottom-left chip bar is
  `hidden md:flex` so there is no collision). It renders ONLY when the
  selection is EXACTLY ONE element AND its type is `text` (the same
  condition under which the desktop panel renders the TEXT section).
  Chrome: the zoom-cluster chip family (`rounded-lg border
  border-[#30363d] bg-[#161b22] p-2 text-gray-400 hover:text-white`)
  sized to the 44px touch floor (`min-h-11 min-w-11` — the F34
  convention, the mobile-nav family), the `Type` lucide icon,
  `aria-label="Edit text"`. Geometry pinned as GEOMETRY per F35
  (in-viewport bounding box), never a passing click.
- **The surface:** a Radix **Sheet** (`side="bottom"` — the primitive
  already supports it; the mobile-nav drawer established the Sheet
  contract family: focus trap, Escape + scrim close, scroll lock,
  44px targets) carrying the shared `TextSection` in the EDITOR'S dark
  chrome (`bg-[#161b22]` panel, `border-[#30363d]`, white text — the
  shortcuts-dialog family, NOT the light app chrome). `SheetTitle`
  "Edit text". The chip is a `SheetTrigger asChild` → Radix natively
  wires `aria-expanded`/`aria-controls` and the focus return (the
  mobile-nav contract). Radix moves focus to the first focusable on
  open — the Content input — so the soft keyboard opens on phones.
- **The data flow:** the surface subscribes to the store
  (`useEditorStore`), derives the single selected text element, and
  calls `updateElements([id], patch)` — the SAME store action the
  desktop panel uses, so the autosave (800ms debounced full-list PUT),
  undo/redo snapshots, and the "Unsaved" badge all flow unchanged.
- **Desktop no-regression:** `lg:hidden` removes the chip at ≥1024 where
  the panel lives; the panel itself is untouched markup (S50-1 is a
  pure refactor).

### S50-3 — the e2e pins (`tests/e2e/mobile-text-editing.spec.ts`)

Mobile describe at 390×844 (the established mobile-nav /
editor-mobile-header pattern; contexts arrive AUTHENTICATED via the
shared storageState):

1. **The geometry pin:** tap the seeded "Headline" text on the canvas →
   the chip appears IN-VIEWPORT (boundingBox inside 390×844) and
   measures ≥44×44 (the F34 floor).
2. **The no-chip guards:** a rectangle selection renders NO chip; a
   multi-selection (text + rectangle) renders NO chip; at 1280×800 the
   chip is ABSENT (`lg:hidden`) while the desktop panel's TEXT section
   still renders (the existing pins already cover the panel — this pin
   guards the boundary).
3. **The round-trip:** tap the chip → the Sheet opens
   (`[role=dialog][data-state=open]`) titled "Edit text" carrying the
   five controls with the seeded values ("Design faster,\ntogether.",
   Font Size 32) → type into Content → the canvas text updates live →
   the edit PERSISTS through a reload (the autosave PUT — the
   established reload-persistence pattern).
4. **The Sheet contract:** `data-scroll-locked` on `<body>` while open;
   Escape closes; focus returns to the chip; the canvas text kept the
   edit after the close.
5. **The fresh-text workflow:** draw a NEW text with the Text tool at
   mobile → the chip appears (addElements selects the created element)
   → open → the Content input carries "Type here..." → edit → the
   canvas updates.

**Unit RED expectations:** `tests/text-section.test.ts` fails at its
exact assertions pre-refactor (the export absent, the panel carrying
the inline section). **E2E RED expectations:** the new spec fails 7/7
against the pre-fix build (the chip absent at mobile). GREEN: unit +3
(137 = 134 + 3), e2e +7 (164 = 157 + 7) — counts confirmed at
execution.

## Execution order

1. S50-1 unit RED → the seam refactor → unit GREEN (the panel's
   existing pins re-run green — the pure-refactor proof).
2. S50-2 the chip + Sheet in `editor-view.tsx` → fast gates (lint,
   typecheck, unit).
3. S50-3 e2e RED against the pre-fix build → the build with the new
   code → e2e GREEN.
4. Full gate: `lint → typecheck → test → build → smoke (dev server
   stopped, unset DATABASE_URL same-command) → test:e2e`.
5. Live verification on the dev server at 390×844 + 1280×800; the
   standard screenshot set re-captured + the new mobile-text-editing
   pair + the ref-audit-s56 provenance set.
6. Docs: PAD v1.29.0, digma_SKILL v1.28.0 (lesson F37 — the
   mobile-editor family's generalization: an editing affordance whose
   only surface is desktop-gated is unreachable on the device class
   that needs it most; the shared-section seam), AGENTS/CLAUDE/README
   counts + rows, this plan's execution status, `docs/session_59.md`,
   the repo worklog entry.

## Execution status

- [x] S50-1 — the shared `TextSection` seam (+ `tests/text-section.test.ts`)
- [x] S50-2 — the mobile "Edit text" chip + the bottom Sheet carrying the shared section
- [x] S50-3 — `tests/e2e/mobile-text-editing.spec.ts` (geometry, guards, round-trip, Sheet contract, fresh-text workflow) — rewritten mid-execution onto a SELF-CONTAINED API-created fixture project (the full-suite runs found the shared seeded canvas is not a stable mid-suite fixture and the later parity specs pin the Recent-list count + name-sort discriminator; every test now creates its own project with KNOWN element geometry, deletes it in a finally, and an afterAll sweeps orphans)
- [x] Full gate green — lint · typecheck · 137 unit (+3) · build 23 routes · 56 smoke · 164 e2e (+7)
- [x] Live verification + screenshots (the standard 24 re-captured + the new 25/26 pair + the ref-audit-s56 provenance set; 31/31 dimension-checked, the key shots VLM-verified)
- [x] Docs aligned (README counts + rows + screenshots, PAD v1.29.0, AGENTS, CLAUDE, digma_SKILL v1.28.0 lesson F37, session_59.md, worklog)
