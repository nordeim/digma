# Digma — Session 25 Remediation Plan (v1.14.0 target)

**Date:** 2026-09-29 · **Input:** eleventh live parity audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-24 code @ `f96ad80`, clean re-seeded DB), desktop
1440×900 and mobile 390×844, DOM/computed-style level + **functional interaction testing** (the
F19/F21 functional sweep the session-25 log directed: the marquee's interaction with the wall, the
draw-tool paths over locked regions, the keyboard paths — `Delete` on a locked selection — and
the zoom-cluster behavior at the step boundaries). **Method:** every finding below was verified
in BOTH apps' DOMs (or measured as the reference's own dead path) before entering this plan, and
the plan was re-validated line-by-line against the codebase before execution.

---

## Context

Session 24 (commit `28619fb` + transcript pushes `823bb27`/`f96ad80`, PAD v1.13.0) closed the
locked-element pointer-contract gaps (the WALL: the hit-test terminal on the topmost locked
element, the `cursor-not-allowed` chrome, no resize handles on a locked selection, the
`moveElements` locked guard) and recorded the tenth consecutive full parity audit. This session
executed the session-25 next-steps directive — the sweep of the remaining interactive paths that
touch the wall: **the marquee over locked elements**, **the draw-tool paths over locked
regions**, **the keyboard paths (`Delete` on a locked selection)**, and the **zoom-cluster step
boundaries**.

The baseline fast gates were re-run green BEFORE any change: lint ✅ · typecheck ✅ · 74/74 unit ✅
(the full gate — build/smoke/e2e — re-verified after the changes). Dev server healthy with the DB
anchored at the repo root (`[db] DATABASE_URL -> file:/home/z/my-project/digma/db/custom.db`;
the `env -u DATABASE_URL` discipline for every gate command; the parent-workspace `.env` trap
is present and neutralized). Test suites verified present: vitest (74 checks) + playwright
(75 checks), both excluding `skills/`.

### What the sweep found in the REFERENCE (live-measured this session)

- **R1 — the reference's row-trash DELETES a locked layer.** Live on its own canvas (two
  rectangles persisted locked from the session-24 audit): a real-mouse click on the locked
  row's trash removed the layer immediately (3 layers → 2, no confirm — same immediacy as its
  unlocked trash, measured session 17). The lock blocks CANVAS interaction, not the explicit
  row-level management action. **This is new parity data: the clone's row trash (which also
  deletes locked elements) is CORRECT and must stay untouched.**
- **R2 — the reference's keyboard layer is entirely DEAD.** `Delete` on a row-selected
  element is a no-op for BOTH locked and unlocked selections (verified with the row
  highlighted `bg-blue-600` and the "1 selected" badge present — the element never left).
  Arrow-key nudge is a no-op too (the unlocked selected Rectangle's transform was unchanged
  after ArrowRight + ArrowDown). There is NO keyboard parity data: any working keyboard
  behavior in the clone is superset territory — and a superset must be internally coherent
  (the F21 lesson).
- **R3 — the reference's draw-tool over a locked region WORKS.** With the Rectangle tool
  active, a real-mouse drag STARTING on the locked element's footprint (inside the canvas
  wrapper's clip) created the new element on top and auto-selected it (3 → 4 layers). The
  wall does NOT block drawing. (Two earlier "no-op" readings this session were test artifacts:
  the drags started in the AI-assistant strip below the canvas wrapper — outside the pointer
  surface in both apps.)
- **R4 — the reference's marquee remains a NO-OP** (re-confirmed, fourth consecutive session:
  a full-canvas drag covering all four elements produced no rect, no counter, no selection).
- **R5 — the reference's mobile nav still ships failure class A** at 390×844 (nav
  `display: none`, NO hamburger, the 36×36 bell only — re-confirmed this session).
- **R6 — the reference's zoom cluster is still erratic**: five synchronous zoom clicks left
  the pill reading unchanged ("128%"), then an async settle landed it at 107% (a ×1.2-divided
  step — the same step math the clone ships, but rendered asynchronously and unreliably).

### What the sweep VERIFIED CORRECT in the clone (no change — parity or the working superset)

- **The draw-tool over locked regions works** (parity with R3): with the Rectangle tool, a
  real-mouse drag starting on the locked Glow's center created a new element on top
  (6 → 7 layers, auto-selected, `setTool("select")` after the draw) — the draw branch in
  `canvas.tsx` runs before any hit-test, exactly the reference's semantics.
- **The marquee excludes locked elements from containment selection** (the documented
  sensible superset — the reference's marquee is dead, R4): a marquee fully containing ONLY
  the locked Glow selected NOTHING; a marquee containing the Glow + three unlocked elements
  selected exactly the three unlocked ones (Headline, CTA Button, CTA Label).
- **The row-trash on a locked element deletes it** (parity with R1): the trash click on the
  locked Glow row removed it (6 → 5 layers), and Ctrl+Z restored it.
- **The mobile-nav fix holds end-to-end** at 390×844 (44×44 trigger with the stable
  aria-label, drawer with all three links, `data-scroll-locked` body, tap "Recent" →
  navigates AND dismisses) and the hamburger is hidden at 768 while the desktop nav shows.
- **Undo/autosave worked throughout the tests** (the frame's accidental drag + two-step undo
  restored both the position and the layer count; the autosave's "Saved" badge settled every
  mutation).
- **The clone's zoom cluster** (clean synchronous ×1.2 steps, clamped 0.05–8) remains the
  working superset over R6's async erratic cluster.

### Findings (all verified live in both apps; the clone one with functional proof)

| # | Finding | Severity |
|---|---------|----------|
| S25-1 | **The keyboard `Delete`/`Backspace` path has no locked guard — a row-selected locked element is DELETED by the keyboard, and Select All + Delete deletes the locked members too.** `editor-view.tsx`'s shortcut handler calls `store.deleteElements(store.selectedIds)` unconditionally, and the store's `deleteElements` filters by id only (no lock check — correct for the row trash, per R1). Live-verified pre-fix: (a) row-select the locked Glow → press `Delete` → the Glow vanished (6 → 5 layers); (b) Select All (6 selected, Glow locked) → press `Delete` → ALL six layers deleted including the locked Glow ("0 layers"). This is the S23-3 `moveElements` incoherence repeated in the keyboard seam: the wall blocks canvas drag (moveElements skips locked ids), blocks canvas resize (no handles on a locked selection), blocks click-through (the hit-test is terminal) — but the keyboard delete seam deletes exactly the elements the wall protects. The reference's keyboard is dead (R2 — no parity data), so the clone's keyboard is superset territory and must be internally coherent. **The fix goes in the KEYBOARD HANDLER (filter the locked ids out of the selection before `deleteElements`), NOT in `deleteElements` itself — the row trash shares that store action and must keep deleting locked elements (reference parity, R1).** | **Medium** |

**Deliberate superset notes (no change):** the clone keeps its working marquee (containment
semantics with locked exclusion — the reference's marquee is dead), its clean multiplicative
zoom, its working keyboard shortcuts (the reference's are dead — the superset now coherent
with the wall), its draw-over-locked parity, and its row-click selection of locked elements
(parity). The AI assistant's `delete` operations remain explicit-instruction semantics (the
same class as the row trash — the reference's own AI crashes on submission, no parity data);
this session's fix is scoped to the keyboard seam only.

---

## P1 — Code changes (TDD, one coherent slice)

### Slice A — S25-1: the wall's keyboard contract

**Files:** `src/components/editor/editor-view.tsx`.

1. **The keyboard Delete/Backspace filters locked ids out of the selection before the delete** —
   the shortcut handler:
   ```tsx
   if (event.key === "Delete" || event.key === "Backspace") {
     if (store.selectedIds.length > 0) {
       event.preventDefault();
       // The wall's keyboard contract (S25-1): locked elements never ride
       // along with a keyboard delete — the same guard moveElements carries
       // (S23-3). The layer-row TRASH is the explicit per-element delete and
       // DELIBERATELY deletes locked elements (the reference's measured
       // semantics — its locked rectangle's trash removed it while its
       // keyboard was entirely dead).
       const unlockedIds = store.elements
         .filter((el) => store.selectedIds.includes(el.id) && !el.locked)
         .map((el) => el.id);
       if (unlockedIds.length > 0) store.deleteElements(unlockedIds);
     }
     return;
   }
   ```
   A selection of ONLY locked elements is a full no-op (the wall consumes the key); a mixed
   selection deletes exactly its unlocked members (mirroring Select All + drag, S23-3); an
   all-unlocked selection deletes as before (the working superset preserved). The surviving
   locked ids stay selected (`deleteElements` already filters `selectedIds` to the deleted
   ids only).

- **Tests (RED first):** `tests/e2e/editor-panels.spec.ts` — a new describe
  ("keyboard delete locked contract (session 25)") with four tests, following the
  session-23 suite's conventions (`openSeededEditor`, the idempotent `lockGlow` helper,
  `waitForSaved` after mutating tests):
  1. "Delete on a row-selected locked element is a no-op — the wall's keyboard
     contract" — lock the Glow, row-select it ("1 selected"), press `Delete`, assert the
     Glow row is STILL present, the layer counter still reads "6 layers", and "1 selected"
     persists (pre-fix: the row disappears, "5 layers").
  2. "Select All + Delete deletes only the unlocked elements" — lock the Glow, click
     Select All ("6 selected"), press `Delete`, assert exactly 5 layers remain AND the
     Glow row survives (pre-fix: 0 layers, no rows); then `waitForSaved`.
  3. "Delete on an unlocked selection still deletes (the working superset preserved)" —
     row-select the Headline (unlocked), press `Delete`, assert the Headline row is gone
     ("5 layers"), then Ctrl+Z restores it ("6 layers"); `waitForSaved` (control test —
     pins the path the fix must not break; GREEN pre-fix by design).
  4. "the layer-row trash deletes a locked element (reference parity — the explicit row
     action is not blocked by the wall)" — lock the Glow, click its row trash, assert the
     Glow row is gone ("5 layers"), Ctrl+Z restores (R1's boundary pin — prevents a future
     over-reach into `deleteElements`; GREEN pre-fix by design).

## P2 — Documentation alignment (post-fix)

- **PAD → v1.14.0:** new revision block (the S25-1 finding + the reference-side R1/R2
  measurements + the eleventh-audit record); the editor/keyboard facts gain the locked-keyboard
  contract (the Delete seam filters locked ids; the row trash deliberately does not);
  §7.1/§7.4 counts refreshed (e2e 75 → 79).
- **AGENTS.md:** the keyboard-shortcut facts + the wall's keyboard contract (Delete skips
  locked; the row trash is the explicit path that deletes locked elements — reference parity).
- **CLAUDE.md:** ditto (the editor facts + the architecture notes).
- **README.md:** the canvas editor feature row (the keyboard Delete respects the lock; the
  row trash does not — the reference's measured boundary) + the test counts.
- **digma_SKILL.md → v1.13.0:** lesson **F22** (a reference control being DEAD is not the
  same as there being no contract — when the reference cannot exercise a path (its keyboard
  is a no-op), the clone's working superset still needs an internally coherent design, and
  the coherence criterion comes from the wall metaphor the reference DID measure elsewhere:
  port the blocked-interaction semantics from the paths the reference can exercise onto the
  paths it cannot) + §5/§6 rows refreshed + counts.
- `docs/remediation-plan-session25.md` (this plan + execution status) +
  `docs/session_28.md` (this session's structured log — session 26 by the work count; the
  session_26.md and session_27.md filenames hold the operator-pushed transcripts of the
  session-24 conversation) + `worklog.md` Task 36 entry.

## P3 — Delivery

- Screenshots: re-capture the standard set from the remediated dev server (re-seeded first) →
  `docs/screenshots/`; audit provenance (the reference's locked-row-trash evidence, the
  reference's mobile failure-class-A capture, the clone's post-fix keyboard-wall state) →
  `docs/screenshots/ref-audit-s25/`.
- `.env.example`: re-verify against the codebase (unchanged this session) — included in the
  commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …`.
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build →
  ./scripts/smoke-test.sh → test:e2e` — all green before push (74 unit / 28 smoke /
  79 e2e — +4 net-new: the locked-Delete no-op test, the Select-All-Delete-keeps-locked
  test, the unlocked-Delete control test, the trash-on-locked boundary pin).
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- `deleteElements` in the store (NO locked guard — the row trash shares it and deletes
  locked elements at reference parity, R1; the AI assistant's delete operations likewise
  stay explicit-instruction semantics).
- The draw-tool paths (parity with R3 — the draw branch runs before any hit-test in both
  apps).
- The marquee implementation (locked exclusion re-verified live both ways this session; the
  reference's marquee is dead).
- The mobile navigation fix (re-verified end-to-end this session; the reference still ships
  failure class A) — pinned by `tests/e2e/mobile-navigation.spec.ts`.
- The zoom cluster (the clone's clean synchronous ×1.2 steps; the reference's cluster is
  erratic, R6).
- The undo/history machinery (exercised heavily during the audit — worked throughout).
- The AI-assistant no-crash contract, the Untitled-editor contract, the toast cross-chunk
  store, the db-path resolution (all pinned; untouched).
- The remaining PAD §10 scope cuts (gradient/image fills, per-corner radii, rotation-aware
  bounds, forgot-mail delivery, in-process rate limiter, session revocation, arrow-key
  nudge — the reference has no working nudge either, so adding one is scope creep, not
  parity) — none are release blockers.
- The historical PAD revision blocks (precedent: they record what happened — the new
  block documents this session's findings).

---

## Execution status (end of session 26)

**All items EXECUTED and GREEN.** RED first (the two wall-contract tests failed at their EXACT
assertions against the pre-fix build): the locked-Delete test captured `glowOnCanvas = 0` —
the row-selected locked Glow was DELETED by the key (S25-1's exact live-audit symptom, 6 → 5
layers); the Select-All-Delete test captured `glowOnCanvas = 0` — ALL six layers deleted
including the locked Glow ("0 layers"). The two boundary pins were GREEN pre-fix by design
(the unlocked-Delete control and the trash-on-locked reference-parity pin — they pin the
behavior the fix must preserve). Then GREEN (Slice A: the keyboard handler filters
`store.elements` to the selected-and-unlocked ids and deletes only those — the guard lives in
the keyboard seam, NOT in `deleteElements`, whose locked-deleting row-trash path stays
reference parity). Full gate green: **74 unit / 28 smoke / 79 e2e (+4)**. Docs aligned at
PAD v1.14.0 / digma_SKILL v1.13.0 (lesson F22). Live verification: pressing Delete with the
locked Glow row-selected leaves the canvas at "6 layers• 1 selected" with the Glow row intact
(pre-fix: 5 layers, no Glow); Select All + Delete leaves exactly "1 layer• 1 selected" — the
locked Glow alone with its selection preserved (pre-fix: 0 layers); the unlocked Headline
still deletes via the key; the locked Glow's row trash still deletes it (reference parity,
undo-recoverable).

En-route test engineering: the first RED run failed with a CASCADE — the hard `expect` failed
AFTER the autosave had already flushed the deletion during the 10s assertion-retry window, so
the next tests' lockGlow helper found no Glow row (its prerequisites were deleted by the
previous test's failure). The suite was restructured to **CAPTURE-RESTORE-ASSERT**: capture
the outcome immediately after the key press (non-retrying reads), restore the canvas with
Ctrl+Z + the autosave wait BEFORE asserting, then assert on the captured values — every test's
exit state is clean regardless of pass/fail (the pattern is recorded as F22's test-engineering
corollary).
