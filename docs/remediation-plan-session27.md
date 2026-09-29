# Digma — Session 27 Remediation Plan (v1.15.0 target)

**Date:** 2026-09-30 · **Input:** twelfth live parity audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-26 code @ `def52af`, clean re-seeded DB), desktop
1440×900 and mobile 390×844, DOM/computed-style level + **functional interaction testing** (the
session-26 next-steps directive: the AI assistant's `delete` operations on locked elements —
explicit instruction vs. wall — plus the properties-panel edits on a locked row-selection, and
the standing mobile-nav/keyboard/parity sweep). **Method:** every finding below was verified
live in the reference's DOM (or measured as its own dead/broken path) AND functionally in the
clone's DOM before entering this plan; the plan was re-validated line-by-line against the
codebase before execution.

---

## Context

Session 26 (commit `d7d52f5` + transcript pushes `56925a9`/`def52af`, PAD v1.14.0) closed the
wall's KEYBOARD seam (the Delete/Backspace shortcut filters locked ids out of the selection
before `deleteElements`) and recorded the eleventh consecutive parity audit. This session
executed the session-26 next-steps directive — the sweep of the AI assistant's `delete`
operations on locked elements and the properties-panel edits on a locked row-selection — plus
the standing mobile-nav re-verification.

The baseline fast gates were re-run green BEFORE any change: lint ✅ · typecheck ✅ · 74/74
unit ✅ (the full gate — build/smoke/e2e — re-verified after the changes). Dev server healthy
with the DB anchored at the repo root (`[db] DATABASE_URL -> file:/home/z/my-project/digma/db/custom.db`;
the `env -u DATABASE_URL` discipline for every gate command). Test suites verified present:
vitest (74 checks) + playwright (79 checks), both excluding `skills/`. `.env` carries
`DATABASE_URL="file:../db/custom.db"` with the `db/` folder at the repo root (recreated +
re-seeded this session — `db:push` reported in-sync, `db:seed` → 1 user / 2 projects / 6
elements / 1 team / 3 members).

### What the sweep found in the REFERENCE (live-measured this session)

- **RA-1 — the reference's AI delete on a LOCKED element leaves it on the canvas.** With
  Rectangle 2 persisted locked (its lock survived from the session-25 audit state), the
  instruction "delete Rectangle 2" produced a conversational reply — "I have deleted Rectangle 2
  from the canvas.", "1 action(s) performed", and a Revert control — but the canvas still read
  "4 layers" with Rectangle 2's row present, and a reload confirmed the persisted state never
  changed. **The locked element SURVIVED the AI's delete instruction.** This is the first
  measured outcome data for the AI × locked seam (the seam was previously unmeasurable — the
  reference's AI crashed on submission).
- **RA-2 — the reference's AI delete on an UNLOCKED element is the same theater.** "delete
  Rectangle 1" also replied "I have deleted Rectangle 1 from the canvas." + "1 action(s)
  performed" + Revert — and also changed nothing (4 layers after, 4 layers after reload). The
  reference's AI operations NEVER execute on its canvas, locked or unlocked: its replies are
  claimed-success text with no mutation behind them.
- **RA-3 — the reference's AI ADD command still CRASHES the app.** "add 3 colored circles"
  blanked the page (body text length 0, title intact) with the historically documented console
  error — `TypeError: Cannot read properties of undefined (reading 'charAt')` at
  `assets/index-CFEZghM7.js` — reproduced live this session (evidence:
  `docs/screenshots/ref-audit-s27/ref-01-ai-crash.png`). The delete commands answer; the add
  command dies.
- **RA-4 — the reference's AI reply carries a measured post-send footer (NEWLY measurable
  chrome).** Because the delete commands no longer crash its panel, the post-send reply DOM was
  measured for the first time (previously documented as unmeasurable): the reply bubble contains
  a `flex items-center justify-between` footer row with `<p class="text-xs font-semibold">1
  action(s) performed</p>` on the left and a Revert button on the right —
  `inline-flex items-center … rounded-md h-5 px-1 text-xs text-orange-400 hover:text-orange-300
  hover:bg-accent font-medium transition-colors` carrying a `lucide-rotate-ccw w-3 h-3 mr-1`
  glyph + the text "Revert". The conversation resets on reload (in-memory only).
- **R2 — the reference's properties-panel edit on a LOCKED row-selection EXECUTES and
  persists.** Row-selecting the locked Rectangle 2 and editing its X input (500 → 620) moved
  the canvas element (`translate(663.358px, …)` = model x 620 at zoom 1.07) and the position
  survived a reload. The lock blocks CANVAS interaction — not the explicit properties editing
  surface. (Parity confirmed for the clone's same behavior: its properties edit on the locked
  Glow moved it to x=520 and back.)
- **R3 — the reference's mobile nav still ships failure class A** at 390×844 (nav
  `display: none`, NO hamburger, the 36×36 bell only — re-confirmed this session, the twelfth
  consecutive; evidence: `docs/screenshots/ref-audit-s27/ref-02-mobile-failure-classA.png`).

### What the sweep VERIFIED CORRECT in the clone (no change — parity or the working superset)

- **The properties-panel edit on a locked row-selection works** (parity with R2): the X input
  moved the locked Glow to model x=520 (canvas `translate(520px, 140px)`) and the restore edit
  returned it — the same explicit-surface semantics the reference measured. The AI `update`
  path rides the same class (explicit instruction on the editing surface) and stays untouched.
- **The keyboard Delete on a locked selection is still a no-op** (the session-26 S25-1 fix
  holds): pressing Delete with the locked Glow row-selected left "6 layers" + "1 selected" with
  the Glow row intact.
- **The mobile-nav fix holds end-to-end** at 390×844: the 44×44 trigger visible, the drawer
  opens with all three links, `data-scroll-locked` on the body, tapping "Recent" navigates AND
  dismisses; the hamburger hides at 768 while the desktop nav shows (`display: flex`, 3 links).
- **The AI assistant's no-crash + working-mutation contract holds on the reference's crash
  path**: "add 3 colored circles" answered "Added 3 colored circles", the canvas grew 6 → 9
  layers, and the page stayed fully interactive (the exact command that blanks the reference).

### Findings (all verified live in both apps; the clone with functional proof)

| # | Finding | Severity |
|---|---------|----------|
| S27-1 | **The AI assistant's `delete` operation has NO locked guard — an instruction-level delete removes exactly the elements the wall protects.** `src/components/editor/ai-assistant.tsx`'s `applyOperations` delete branch filters operation ids for existence only, then calls `store.deleteElements(targets)` unconditionally (the same store action the row trash shares — correctly unlocked, per R1/session-25). Live-verified pre-fix: the locked Glow row-selected → AI "delete selected" → the Glow VANISHED (6 → 5 layers) with the reply "Selected element deleted". The wall blocks canvas drag/resize/click-through (S23-…), marquee containment, and — since session 26 — the keyboard Delete for locked elements; the AI seam is the one remaining delete path that deletes them. The reference's only measured outcome for the same seam (RA-1): the locked element SURVIVES the AI delete. Per F22 (port the wall's blocked-interaction semantics onto the paths the reference cannot exercise — the coherence criterion comes from the wall metaphor the reference DID measure) and now backed by RA-1's direct outcome measurement, the AI delete must filter locked ids. **The guard lives in `applyOperations` (the client seam where AI operations meet the store), NOT in `deleteElements`** — the row trash keeps deleting locked elements at reference parity, and the LLM path (which can emit arbitrary ids) is caught by the same client seam. | **Medium** |
| S27-2 | **The clone's AI reply bubble lacks the reference's newly-measured post-send footer** (RA-4): the action-count line (`text-xs font-semibold` "N action(s) performed") and the orange `rotate-ccw` Revert control. The clone's post-send DOM was built from the pre-crash unmeasurable state (plain bubble + timestamp only). The count line is a faithful + honest port (the clone's count reflects operations ACTUALLY applied — post-locked-filter); the Revert control must WORK (a dead control that lies is a repo-documented bug class — worse than not shipping it): each assistant message that applied operations captures a pre-apply canvas snapshot, and Revert restores it through a store-level restore that is itself undoable (Ctrl+Z undoes the revert). | **Low** |

**Deliberate superset notes (no change):** the clone keeps its working AI mutation engine (the
reference's is reply theater — RA-2 — plus a crash on adds — RA-3); the AI `update` operations
stay unlocked (the properties-panel class the reference itself executes on locked elements,
R2); the clone's honest reply text (which reports skipped locked elements) is a deliberate
improvement over the reference's false "I have deleted…" claims; the reference's per-message
Revert FUNCTION is unmeasurable (its operations never execute — there is nothing to revert), so
the clone's Revert is designed from the clone's own honest machinery (snapshot + undoable
restore) wearing the reference's measured chrome.

---

## P1 — Code changes (TDD, two coherent slices)

### Slice A — S27-1: the wall's AI contract (the delete seam)

**Files:** `src/components/editor/ai-assistant.tsx`, `src/app/api/ai-assistant/route.ts`,
`src/lib/ai-assistant.ts`.

1. **The client enforcement seam** — `applyOperations`'s delete branch filters locked ids
   before `deleteElements` (the same guard shape as the keyboard seam, S25-1):

   ```tsx
   } else if (operation.op === "delete") {
     // The wall's AI contract (S27-1): locked elements never ride along with an
     // instruction-level delete — the same guard the keyboard seam carries (S25-1).
     // The layer-row TRASH is the explicit per-element delete and DELIBERATELY
     // deletes locked elements (reference parity R1/session-25); an AI instruction
     // is an indirect selection-level action, and the reference's only measured
     // outcome for the seam (RA-1) is the locked element SURVIVING its AI delete.
     const targets = operation.ids.filter(
       (id) => store.elements.some((el) => el.id === id && !el.locked),
     );
     if (targets.length > 0) store.deleteElements(targets);
   }
   ```

   This catches BOTH operation sources (deterministic fallback + LLM — the LLM can emit
   arbitrary ids, so the client seam is the only complete enforcement point).

2. **The honest reply (the server seam)** — the fallback must not claim deletions the wall
   blocked:
   - `ai-assistant.tsx` `send()`: the POST body gains `lockedTargetIds` (the selected ids whose
     elements are locked) and the `elementSummary` gains a `[locked]` marker per locked element
     (so the LLM can shape honest replies too).
   - `route.ts`: reads/validates `lockedTargetIds` (same validation as `targetIds`), passes it
     to `parseFallbackCommand(message, targetIds, lockedTargetIds)`, and appends a
     locked-elements line to the LLM system prompt ("Locked elements cannot be deleted or moved
     by assistant operations").
   - `ai-assistant.ts` `parseFallbackCommand(message, targetIds, lockedTargetIds = [])`: the
     delete branch computes the unlocked targets and shapes honest replies —
     `unlocked.length === 0 && targetIds.length > 0` → "The selection is locked — unlock it
     first, then ask me to delete it." with `operations: []`; a mixed selection → "Deleted N
     element(s) — skipped M locked (unlock them to delete)." targeting only the unlocked ids;
     no locked targets → the legacy "Deleted N elements." behavior (backwards-compatible
     default parameter keeps every existing two-arg caller working).

### Slice B — S27-2: the reply footer chrome (newly-measured reference parity)

**Files:** `src/components/editor/editor-store.ts`, `src/components/editor/ai-assistant.tsx`.

3. **The store gains a `restoreSnapshot(snapshot)` action** — the revert mechanism:

   ```ts
   restoreSnapshot: (snapshot) =>
     set((state) => ({
       past: [...state.past, snapshotOf(state)].slice(-60),
       future: [],
       elements: snapshot.elements,
       backgroundColor: snapshot.backgroundColor,
       selectedIds: state.selectedIds.filter((id) =>
         snapshot.elements.some((el) => el.id === id)),
       saveState: "unsaved",
     })),
   ```

   The restore pushes the CURRENT state onto `past` first — a revert is itself undoable
   (Ctrl+Z undoes the revert), exactly like every other mutation.

4. **The reply bubble renders the reference's measured footer** (RA-4's exact classes): the
   assistant `ChatMessage` gains `actionCount` (the number of operations ACTUALLY applied —
   post-locked-filter), `revertSnapshot` (a pre-apply `{ elements, backgroundColor }` deep
   copy, captured before the first operation applies), and `reverted` (footer state). When
   `actionCount > 0 && !reverted`, the bubble renders:

   ```tsx
   <div className="flex items-center justify-between">
     <p className="text-xs font-semibold">{actionCount} action(s) performed</p>
     <button type="button" onClick={() => revertMessage(message.id)}
       className="inline-flex items-center rounded-md h-5 px-1 text-xs font-medium text-orange-400 transition-colors hover:bg-accent hover:text-orange-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
       <RotateCcw className="h-3 w-3 mr-1" aria-hidden />Revert
     </button>
   </div>
   ```

   `revertMessage` calls `store.restoreSnapshot(message.revertSnapshot)` and marks the message
   `reverted` (the footer disappears — the message settles into plain history; the reference's
   own post-revert DOM is unmeasurable). `applyOperations` returns the applied count. A reply
   that executed nothing (the locked-only no-op, the helpful unknown-command answers) renders
   no footer — honest: nothing was performed.

- **Tests (RED first):**
  - Unit — `src/lib/ai-assistant.test.ts`, a new describe
    ("parseFallbackCommand — locked-aware delete (session 27)"):
    1. "delete with a locked target deletes only the unlocked ids and says so" —
       targetIds `[a, b]`, lockedTargetIds `[b]` → the operation deletes exactly `[a]` and the
       reply reports the deletion AND the skip (pre-fix: the operation deletes `[a, b]`).
    2. "delete with an all-locked selection is a declined no-op" — targetIds `[b]`,
       lockedTargetIds `[b]` → `operations: []` and the reply mentions the lock (pre-fix: the
       operation deletes `[b]`).
    3. "delete with no locked targets keeps the legacy behavior" — targetIds `[a, b]`,
       lockedTargetIds `[]` → deletes `[a, b]`, "Deleted 2 elements." (boundary pin — GREEN
       pre-fix by design).
    4. "the locked-aware parameter defaults for old callers" — a two-arg
       `parseFallbackCommand("delete selected", [a])` call deletes `[a]` (backwards-compat
       pin — GREEN pre-fix by design).
  - E2E — `tests/e2e/editor-panels.spec.ts`, a new describe ("AI delete locked contract
    (session 27)"), following the session-25 CAPTURE-RESTORE-ASSERT discipline (the autosave
    flushes during the assertion-retry window — a RED failure must never leave the shared e2e
    DB mutated):
    1. "AI delete on a row-selected locked element is a no-op — the wall's AI contract" — lock
       the Glow (idempotent `lockGlow`), row-select it ("1 selected"), submit "delete
       selected" to the assistant, assert the Glow row survives, 6 layers, and the reply
       mentions the lock (pre-fix: the Glow vanishes, 5 layers, "Selected element deleted").
    2. "AI delete with Select All deletes only the unlocked elements" — lock the Glow, Select
       All ("• 6 selected"), submit "delete selected", assert exactly 5 layers remain with the
       Glow among them; Ctrl+Z restores to 6; `waitForSaved` (pre-fix: 0 layers).
    3. "AI delete on an unlocked selection still deletes (the working superset preserved)" —
       row-select the Headline, submit "delete selected", assert the Headline row gone ("5
       layers"), Ctrl+Z restores; `waitForSaved` (control — GREEN pre-fix by design).
    4. "the AI reply carries the reference's action footer and a working Revert (session 27)" —
       submit "add 2 blue squares", assert the footer line "2 action(s) performed" renders in
       the reply bubble, click Revert, assert the canvas returns to the pre-message layer
       count and the footer disappears; `waitForSaved`.

## P2 — Documentation alignment (post-fix)

- **PAD → v1.15.0:** new revision block (the S27-1/S27-2 findings + the reference-side
  RA-1…RA-4/R2/R3 measurements + the twelfth-audit record); the editor/AI facts gain the
  wall's AI contract (the delete seam filters locked ids; the reply reports the skip; the row
  trash and the AI `update` path stay unlocked — the explicit-surface classes) and the reply
  footer chrome (the action-count line + the working Revert); §7.1/§7.4 counts refreshed
  (unit 74 → 78, e2e 79 → 83).
- **AGENTS.md:** the AI-assistant facts row gains the locked-delete contract + the footer
  chrome; the test counts refreshed.
- **CLAUDE.md:** ditto (the editor architecture facts + the testing notes).
- **README.md:** the AI design assistant feature row (the wall's AI contract + the Revert
  footer) + the test counts.
- **digma_SKILL.md → v1.14.0:** lesson **F23** (a LYING reference control still yields outcome
  data — when the reference's reply claims an action its canvas never performed, the CLAIM is
  worthless but the OUTCOME is measurable: the locked element survived its AI delete, and that
  outcome — not the claim — is the parity signal; port outcomes, never claims) + the §5/§6
  rows + the counts.
- `docs/remediation-plan-session27.md` (this plan + execution status) +
  `docs/session_31.md` (this session's structured log — the session_29/session_30 filenames
  hold the operator-pushed transcripts of the session-26 conversation) + `worklog.md` Task 37
  entry.

## P3 — Delivery

- Screenshots: re-capture the standard set from the remediated dev server (re-seeded first) →
  `docs/screenshots/`; audit provenance already captured this session
  (`docs/screenshots/ref-audit-s27/`: the reference's AI crash, its mobile failure-class-A) +
  the clone's post-fix AI-wall and footer states.
- `.env.example`: re-verify against the codebase (unchanged this session) — included in the
  commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …`.
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build →
  ./scripts/smoke-test.sh → test:e2e` — all green before push (78 unit / 28 smoke /
  83 e2e — +4 unit, +4 e2e net-new: the locked-aware delete suite + the AI-wall suite +
  the footer/Revert pin).
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- `deleteElements` in the store (NO locked guard — the row trash shares it and deletes locked
  elements at reference parity, R1/session-25; the AI `update` operations likewise stay
  explicit-instruction semantics on the editing-surface class the reference itself executes
  on locked elements, R2).
- The properties-panel edit path on locked selections (verified parity this session — the
  reference moved its locked element via the X input and persisted it).
- The keyboard seam (the session-26 S25-1 fix — re-verified holding this session).
- The mobile navigation fix (re-verified end-to-end at 390×844 + hidden at 768; the reference
  still ships failure class A) — pinned by `tests/e2e/mobile-navigation.spec.ts`.
- The AI no-crash contract and the deterministic fallback's add/update/unknown branches
  (re-verified on the reference's own crash path this session — 6 → 9 layers, page
  interactive).
- The undo/history machinery (the revert rides it — `restoreSnapshot` pushes to `past` like
  every mutation).
- The reference's FALSE reply claims ("I have deleted X" while X remains) — deliberately NOT
  ported; the clone's replies state what actually happened (honesty over parity-theater).
- The historical PAD revision blocks (precedent: they record what happened — the new block
  documents this session's findings).

---

## Execution status (end of session 27)

**All items EXECUTED and GREEN.** RED first (the exact captured assertions):
`ai-assistant.test.ts`'s two wall-contract unit tests failed against the pre-fix parser (the
locked-aware delete produced the UNFILTERED delete `[a, b]` and the legacy "Deleted 2
elements." reply; the all-locked selection produced a delete operation instead of the declined
no-op) — the two boundary pins (no-locked-targets legacy behavior + the two-arg
backwards-compat call) were GREEN by design. The e2e wall-contract tests failed RED against
the pre-fix build (the row-selected locked Glow VANISHED via the AI delete — `glowOnCanvas = 0`;
the Select-All variant wiped all six). Then GREEN (Slice A: `applyOperations`'s delete branch
filters locked ids + the locked-aware fallback replies + `lockedTargetIds` plumbed client →
route → parser; Slice B: the `restoreSnapshot` store action + the reply footer with the
reference's measured chrome and a WORKING Revert). Full gate green: **78 unit / 28 smoke /
83 e2e (+4 / +4)**. Docs aligned at PAD v1.15.0 / digma_SKILL v1.14.0 (lesson F23). Live
verification: the locked Glow row-selected + AI "delete selected" → "6 layers" with the Glow
intact and the reply declining the locked selection; Select All + AI delete → exactly "1
layer" (the locked Glow alone, selection preserved); the unlocked Headline still deletes via
the AI; the reply footer reads "2 action(s) performed" after "add 2 blue squares" and Revert
returns the canvas to its pre-message state (Ctrl+Z undoes the revert itself).

**En-route discoveries (executed beyond the written plan, both test-engineering class):**

1. **The z-ai SDK is REACHABLE from the standalone e2e server — a deterministic AI seam was
   required.** The first RED run's reply was "Deleted selected element" (LLM-shaped, NOT the
   fallback's "Deleted 1 element.") with BOGUS ids — the pre-fix locked Glow survived one run
   by LLM luck, not by the wall, and every AI reply assertion was non-deterministic. Fix
   executed: the route gained the explicit `DIGMA_DISABLE_AI_LLM=1` force-degrade knob (the
   honest, explicit form of the SDK-is-down degrade path the try/catch already owned), the
   Playwright webServer env sets it, and the existing workspace no-crash test's reply
   assertion was re-pinned from the LLM's echo phrasing ("Added 2 blue squares") to the
   fallback's deterministic "Added 2 squares." The LLM path stays covered by its
   degrade-not-fail contract; the fallback's contracts are now exactly pinned. `.env.example`
   documents the knob.
2. **Two test-side assertion corrections in the new suite itself** (the code under test was
   already correct): the Select-All test's expected layer count 5 → 1 (exactly the locked
   Glow remains — the five unlocked ARE deleted), and the footer test's reply assertion
   re-pinned to the deterministic fallback phrasing.

En-route test engineering: the AI-wall e2e tests follow the session-25
CAPTURE-RESTORE-ASSERT discipline — the outcome is captured immediately after the assistant's
reply settles, the canvas is restored (Ctrl+Z + the autosave wait) BEFORE any assertion runs,
and the assertions read the captured values. The footer/Revert test restores via its own
Revert click (the feature under test is the recovery path).
