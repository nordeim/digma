# Digma — Session 19 Remediation Plan (v1.11.0 target)

**Date:** 2026-09-29 · **Input:** eighth live parity audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-18 code @ `9d99477`), desktop 1440×900 and
mobile 390×844, DOM/computed-style level (post-hydration, 4–10 s settles) + functional
interaction testing. **Method:** every finding below was verified in BOTH apps' DOM before
entering this plan, and the plan was re-validated line-by-line against the codebase before
execution.

---

## Context

Session 18 (commit `3dba7be` + `9d99477`, PAD v1.10.0) closed the layer-row-interior parity
gaps (the trash hover action + the corner-radius reversal) and recorded the seventh
consecutive full parity audit. This session executed the session-18 "next steps"
directive — the eighth audit, aimed at the three remaining unaudited interiors:
**the layers-panel RENAME input** (the double-click inline editor), **the AI-assistant
message bubbles' post-send structure**, and **a functional sweep of the reference's
eye/lock actions** — plus the standard parity-hold sweep.

The AI-bubble post-send structure remains unmeasurable (the reference still crashes
blank-screen on AI submission — the `TypeError: Cannot read properties of undefined
(reading 'charAt')` from its `assets/index-*.js` reproduced in the console this session;
the clone's no-crash contract stays pinned by `tests/e2e/workspace.spec.ts`). The rename
input and the eye/lock functional sweep both yielded measurable findings.

The baseline fast gates were re-run green BEFORE any change: lint ✅ · typecheck ✅ ·
74/74 unit ✅ (the full gate — build/smoke/e2e — re-verified after the changes). Dev
server healthy with `[db] DATABASE_URL -> file:/home/z/my-project/digma/db/custom.db`
(the `env -u DATABASE_URL` discipline for every gate command; the parent-workspace
`.env` trap is present and neutralized).

### Verified parity-hold (no change — the eighth consecutive audit)

- **Mobile navigation (the operator-flagged surface):** the reference STILL ships
  Tailwind v4 failure class A at 390×844 (nav `display:none`, NO hamburger — its one
  header button remains the 36×36 notifications bell). The clone's fix re-verified
  END-TO-END: the 44×44 trigger with stable `aria-label="Navigation menu"` +
  `aria-expanded`/`aria-controls`, the drawer opens with all three links,
  `data-scroll-locked` body, tap "Recent" → navigates to `/Recent` AND dismisses,
  Escape closes, and the hamburger is hidden at 768 with the desktop nav `flex`.
- **Reference's own bugs re-confirmed:** the AI-submission crash (the `charAt`
  TypeError from base44 assets), failure-class-A mobile nav.
- **Page-level chrome:** nav pill exact-match scope on `/Recent` (clone), Teams flat
  body + one Create Team button (both apps), Recent sort select with the same four
  options + two 40×40 view toggles + count badge (reference), greeting hero.
- **The rename TRIGGER semantics** (double-click on the row name opens an input
  prefilled with the current name; Escape closes it) — the clone matches the
  reference's BEHAVIOR; only the input's chrome diverges (S19-1 below).
- **Tailwind v4 health:** no legacy `tailwind.config.*`, zero `@apply`, Inter renders
  on `<body>`, the clone's console is clean (the `NaN`/`uncontrolled-input` console
  entries trace to the reference tab; the `cdn.tailwindcss.com` warning is the
  reference's CDN build).
- **Layer-row structure (session-17 fixes re-verified):** three hover actions per row
  (eye, lock, red trash `text-red-400 hover:bg-red-500/20`, `lucide-trash2 w-3 h-3`)
  — identical in both apps.

### Findings (all verified in both DOMs; the eye one with live functional proof on both apps)

| # | Finding | Severity |
|---|---------|----------|
| S19-1 | **The layer-row RENAME input's chrome diverges from the reference.** Measured live in the reference (double-click on "Rectangle 2"'s name): the input that replaces the name div inside the `flex-1 min-w-0` wrapper renders the shadcn-Input base plus editor overrides — `flex w-full rounded-md border py-1 shadow-sm transition-colors … md:text-sm text-sm bg-[#0d1117] border-[#30363d] text-white h-6 px-2` (a 6px `rounded-md`, a VISIBLE `border-[#30363d]`, height `h-6`, padding `px-2 py-1`, `shadow-sm`, focus ring only via `focus-visible:ring-1`). The clone renders `w-full rounded bg-[#0d1117] px-1 text-sm text-white outline-none ring-1 ring-blue-500` — wrong rounding (4px vs 6px), no border, an ALWAYS-ON blue ring (`ring-1 ring-blue-500` renders unfocused), `px-1` instead of `h-6 px-2 py-1`, no shadow. | **Medium** |
| S19-2 | **The lock row-icon semantics diverge: the reference is opacity-based, not icon-swap-based.** Measured live on three rows (Rectangle 3 locked via a real click, Rectangles 1/2 unlocked): the reference renders the SAME `lucide lucide-lock w-3 h-3` icon in BOTH states, flipping only the svg's opacity class — `opacity-50` unlocked / `opacity-100` locked. The lock is FUNCTIONAL in the reference: the locked canvas element gains the `cursor-not-allowed` class + `cursor: default` inline (and the drag is disabled). The clone renders two different hand-inlined padlock SVGs with NO opacity distinction. | **Medium** |
| S19-3 | **The clone's eye/visibility toggle is functionally inconsistent — the canvas never hides hidden elements.** The reference's eye is a NO-OP (verified TWICE with real clicks: the icon stays `lucide-eye` and the canvas element stays `opacity: 1` rendered — the reference's no-op class, like its Create Team/ellipsis buttons). The clone's eye is a HALF-working superset: clicking "Hide layer" flips the row icon (eye → eye-off) and excludes the element from click hit-testing, marquee selection, presentation mode, and thumbnails — but the canvas STILL RENDERS the element (verified live: after "Hide layer" the element remains `display: block; visibility: visible` in the DOM with its paint). The row icon says hidden; the canvas says visible — an internally inconsistent state, worse than either a full implementation or a full no-op. | **High** |
| S19-4 | **The eye/lock icons are hand-inlined SVGs; the reference's DOM carries lucide-react components.** The reference's row buttons render `class="lucide lucide-eye w-3 h-3"` / `lucide lucide-lock w-3 h-3` (component-generated). The clone hand-inlines both the eye/eye-off and the lock SVGs (only the trash uses lucide-react). Refactoring to lucide-react matches the reference DOM, simplifies the row, and is the natural vehicle for S19-2. | **Low** |

**Deliberate superset notes (no change):** the clone keeps its working eye semantics
(icon swap + hit-test/marquee/present/thumbnail exclusion — a Figma-like working
superset over the reference's no-op, per the documented convention that the clone fixes
the reference's own bugs); the aria-labels on the row buttons ("Hide layer"/"Show
layer", "Lock layer"/"Unlock layer", "Delete layer …") stay (the invisible a11y
superset). The clone's locked-canvas approach (`pointer-events: none` — the cursor
falls through to the canvas's `default`) is observably equivalent to the reference's
inline `cursor: default` (which overrides its own `cursor-not-allowed` class) — no
canvas change for lock.

---

## P1 — Code changes (TDD, three slices)

### Slice A — S19-3: the canvas must not render hidden elements

**Files:** `src/components/editor/canvas.tsx` (the element map, ~line 335:
`{elements.map((el) => (<CanvasElement …/>)`).

- Change the map to filter first: `{elements.filter((el) => el.visible).map((el) => …)}`
  — the SAME `visible` contract the click hit-test (line 128), the marquee containment
  (line 241), presentation mode, and the thumbnails already enforce. This closes the
  inconsistency: every consumer of `element.visible` now agrees, and the eye toggle
  becomes a complete working superset (hide on canvas + row icon + hit-test + present).
- **Tests (RED first):** `tests/e2e/editor-panels.spec.ts` — a new test
  ("the layer eye toggle hides the element on the canvas (session 19)") asserting:
  the canvas starts with N `[data-element-id]` elements matching the N layer rows;
  clicking a row's "Hide layer" button removes EXACTLY that element from the canvas
  DOM (count N → N−1, the hidden id absent) while the row itself remains; clicking
  "Show layer" brings it back (count N−1 → N, the id present again).

### Slice B — S19-1: the rename input carries the reference's measured chrome

**Files:** `src/components/editor/layers-panel.tsx` (the rename input, ~line 162).

- Replace the className with the reference's measured set, following the AI-input
  precedent (a raw input with the functional class string — the `file:*` and
  `md:text-sm` variants from the shadcn base carry no weight here):
  `h-6 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-2 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`
  — the visible deltas: `rounded-md` (6px), a real `border-[#30363d]` border (not a
  ring), `h-6 px-2 py-1`, `shadow-sm`, and the focus ring ONLY on `focus-visible`.
- **Tests (RED first):** a new test ("the layer rename input carries the reference
  chrome (session 19)") asserting: double-clicking a row's name swaps in an input
  (prefilled with the row's name) carrying `h-6`, `px-2`, `border-[#30363d]`,
  `bg-[#0d1117]`, `rounded-md`, `text-sm`, and NOT the always-on `ring-1` /
  `ring-blue-500`; typing a new name and blurring renames the row; Escape cancels
  (the row keeps its old name).

### Slice C — S19-2 + S19-4: lucide-react eye/lock + the lock's opacity semantics

**Files:** `src/components/editor/layers-panel.tsx` (the eye and lock button blocks,
~lines 170–214).

- Replace the hand-inlined eye/eye-off SVGs with lucide-react `Eye` / `EyeOff`
  components (`className="h-3 w-3"`, `aria-hidden`, `strokeWidth={2}` — the same
  call shape as the existing `Trash2`).
- Replace BOTH hand-inlined lock SVGs with a single lucide-react `Lock` component
  whose className flips the measured opacity: `cn("h-3 w-3", el.locked ? "opacity-100"
  : "opacity-50")` — the reference's exact DOM (`lucide lucide-lock w-3 h-3 opacity-50`
  unlocked / `opacity-100` locked, same icon both states).
- Keep the aria-label swap ("Lock layer" ↔ "Unlock layer", "Hide layer" ↔ "Show
  layer") — the invisible a11y superset, consistent with prior sessions.
- **Tests (RED first):** a new test ("the layer lock icon follows the reference's
  opacity semantics (session 19)") asserting: an unlocked row's lock button contains
  an `svg.lucide-lock` with `opacity-50` (and NOT `opacity-100`); clicking it flips
  the SAME svg to `opacity-100` (a class flip, not an icon swap — the svg element
  before/after is still `lucide-lock`); clicking again returns `opacity-50`. Plus a
  chrome assertion inside the same test: the eye button renders `svg.lucide-eye`
  (lucide component, not a hand-inlined svg) at `h-3 w-3`.

## P2 — Documentation alignment (post-fix)

- **PAD → v1.11.0:** new revision block (the S19-1…S19-4 findings + the eighth-audit
  record); the layers-panel facts gain the rename-input chrome, the lock opacity
  semantics, and the eye working-superset note (canvas now honors `visible`); §7.1/§7.4
  counts refreshed (e2e 63 → 66).
- **AGENTS.md:** the layers-panel architecture fact (rename input chrome, lock
  opacity-based icon, eye hides on canvas — working superset over the reference's
  no-op eye).
- **CLAUDE.md:** the editor-panels facts ditto.
- **README.md:** the Layers panel feature row (the eye now actually hides the element
  from the canvas; the lock icon follows the reference's opacity flip).
- **digma_SKILL.md → v1.10.0:** lesson **F19** (audit FUNCTIONAL semantics, not just
  chrome — the eye toggle LOOKED complete in the DOM (it swaps icons) but the canvas
  never hid the element; "test what the control DOES" is the functional extension of
  session 17's interactive-control corollary) + the §5 LayersPanel/eye/lock rows
  refreshed + counts.
- `docs/remediation-plan-session19.md` (this plan + execution status) +
  `docs/session_20.md` (this session's structured log) + `worklog.md` Task 33 entry.

## P3 — Delivery

- Screenshots: re-capture the standard set from the remediated dev server →
  `docs/screenshots/`; audit provenance (the reference's rename-input live state, the
  three-row lock-opacity evidence, the reference mobile failure-class-A capture, the
  clone post-fix pair incl. a hidden-layer canvas capture) →
  `docs/screenshots/ref-audit-s19/`.
- `.env.example`: re-verify against the codebase (unchanged this session) — included
  in the commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …`.
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build →
  ./scripts/smoke-test.sh → test:e2e` — all green before push (74 unit / 28 smoke /
  66 e2e — +3 net-new: the eye-hide, the rename chrome, the lock-opacity tests).
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- The mobile navigation fix (re-verified end-to-end; the reference still ships
  failure class A) — pinned by `tests/e2e/mobile-navigation.spec.ts`.
- The trash hover action, the row selection semantics, the drag-reorder, the reverse
  ordering, the counter with its blue selected suffix — re-verified this session.
- The clone's locked-canvas mechanism (`pointer-events: none`) — observably equivalent
  to the reference's inline `cursor: default` (which overrides its own
  `cursor-not-allowed` class); no canvas change.
- The AI-assistant message-bubble post-send structure — unmeasurable on the reference
  (its assistant still crashes); the clone's no-crash contract stays pinned.
- The properties panel's slider maxes (radius 75, stroke 0–20, rotation ±180, scale
  0.1–3.0, opacity 0–100) — verified at the session-17/18 re-measures.
- The clone's working supersets (Create Team dialog, card ellipsis menu, clipboard
  Share, Present mode, Explore Templates toast, Untitled editor) and the reference's
  own bugs deliberately not cloned (AI crash, failure-class-A mobile nav, no-op
  Create Team/ellipsis/Explore/Gradient-Image tabs, no-op eye).
- The remaining PAD §10 scope cuts (per-corner radii, gradient fills, forgot-mail
  delivery, in-process rate limiter, session revocation) — none are release blockers.
- The historical PAD revision blocks (precedent: they record what happened — the new
  block documents this session's findings).

---

## Execution status (end of session 20)

**All items EXECUTED and GREEN** — RED first (the eye test failed at `toHaveCount(before - 1)`
— the canvas kept 6 elements after "Hide layer"; the rename test failed at the chrome pins
— the input carried the old `rounded px-1 ring-1 ring-blue-500`; the lock test failed at
`toHaveClass(/lucide-lock/)` — the svg was a hand-inlined path with no lucide/opacity
classes), then GREEN: Slice A (`canvas.tsx` — the element map filters `el.visible`, the
same contract as the hit-test/marquee/present/thumbnails), Slice B (`layers-panel.tsx` —
the rename input re-chromed to the measured set: `h-6 w-full rounded-md border
border-[#30363d] bg-[#0d1117] px-2 py-1 text-sm text-white shadow-sm …` with the focus
ring only on `focus-visible`), Slice C (`layers-panel.tsx` — lucide-react Eye/EyeOff/Lock
components; a single `Lock` icon with the measured opacity flip). En-route test
engineering: the eye test identifies its target by NAME (rows render in REVERSE order —
DOM position ≠ row position), and the rename test's negative class checks anchor at
class-list boundaries so `focus-visible:ring-1` never trips the assertion. Live
verification: `lucide lucide-lock h-3 w-3 opacity-50` → `opacity-100` (same svg, live
clicks both directions); "Hide layer" removes exactly the named element from the canvas
(6 → 5 → 6); the rename input renders the measured class string; the rename round-trip +
Escape-cancel work. Full gate green: **74 unit / 28 smoke / 66 e2e (+3)**. Docs aligned at
PAD v1.11.0 / digma_SKILL v1.10.0 (lesson F19).
