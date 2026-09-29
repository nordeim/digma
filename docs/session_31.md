# Session 31 — The Twelfth Parity Audit: the Wall's AI Seam (S27-1 + S27-2)

**Date:** 2026-09-30 · **Code state at start:** `def52af` (session 26 delivered; transcript
pushes `56925a9`/`def52af` = `docs/session_29.md` / `docs/session_30.md`) · **Code state at
end:** this commit · **Docs:** PAD v1.15.0 · digma_SKILL v1.14.0 (lesson F23)

## Directive

The session-26 next-steps list: the AI assistant's `delete` operations on locked elements
(explicit instruction vs. wall — "its AI crashes, no parity data"), the properties panel's
edits on a locked row-selection (the documented working superset), and the standing sweep
(mobile nav, keyboard wall, general parity).

## The audit (twelfth consecutive)

**Baseline before any change:** workspace refreshed (`git clone` fresh — `.env` created with
`DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root, `db:push` in-sync, `db:seed` →
1 user / 2 projects / 6 elements / 1 team / 3 members, dev server healthy with the DB anchor
logged). Fast gates green: lint · typecheck · 74/74 unit. Configs verified: vitest (74) +
playwright (79), both excluding `skills/`. The session-26 keyboard fix (S25-1) verified in
place at `editor-view.tsx` (the `unlockedIds` filter).

### Reference findings (live-measured, desktop 1440×900 + mobile 390×844)

- **RA-1 — the reference's AI delete on a LOCKED element leaves it on the canvas.** With
  Rectangle 2 persisted locked, "delete Rectangle 2" produced the reply "I have deleted
  Rectangle 2 from the canvas." + "1 action(s) performed" + a Revert control — and the canvas
  still read "4 layers" with the row present; a reload confirmed the persisted state never
  changed. **The first measured outcome data for the AI × locked seam.**
- **RA-2 — the same theater for UNLOCKED deletes.** "delete Rectangle 1" also claimed success
  and also changed nothing (4 layers after, 4 after reload). The reference's AI operations
  never execute — its replies are claimed-success text with no mutation behind them.
- **RA-3 — the reference's AI ADD still crashes the app.** "add 3 colored circles" blanked
  the page (body length 0) with the historical `TypeError: Cannot read properties of
  undefined (reading 'charAt')` in its bundle — reproduced live, screenshotted
  (`docs/screenshots/ref-audit-s27/ref-01-ai-crash.png`).
- **RA-4 — the reference's post-send reply DOM measured FOR THE FIRST TIME** (its delete
  commands no longer crash the panel, so the reply finally rendered): the bubble carries a
  `flex items-center justify-between` footer — `<p class="text-xs font-semibold">1 action(s)
  performed</p>` + a Revert button (`rounded-md h-5 px-1 text-xs text-orange-400
  hover:text-orange-300 hover:bg-accent`, a `lucide-rotate-ccw w-3 h-3 mr-1` glyph). The
  conversation resets on reload (in-memory only).
- **R2 — the reference's properties-panel edit on a LOCKED row-selection EXECUTES and
  persists** (X: 500 → 620 moved the locked element; survived reload). The lock blocks
  CANVAS interaction, not the explicit editing surface. Parity confirmed for the clone's
  same behavior (its X edit moved the locked Glow to 520 and back).
- **R3 — mobile nav failure class A re-confirmed** at 390×844 (nav `display: none`, zero
  hamburger, the 36×36 bell only — the twelfth consecutive session;
  `docs/screenshots/ref-audit-s27/ref-02-mobile-failure-classA.png`).

### Clone findings

- **S27-1 (Medium): the AI assistant's `delete` operation had NO locked guard.**
  `applyOperations`'s delete branch filtered ids for existence only and called
  `store.deleteElements(targets)` unconditionally. Live-verified pre-fix: the locked Glow
  row-selected + AI "delete selected" → the Glow VANISHED (6 → 5 layers) with the reply
  claiming success — the wall's one remaining open delete seam (pointer, keyboard, and
  marquee all already respect it).
- Verified correct (no change): the properties edit on locked selections (R2 parity), the
  keyboard Delete wall (S25-1 holds), the mobile nav end-to-end at 390×844 + hidden at 768,
  the AI no-crash contract on the reference's own crash path ("add 3 colored circles" →
  9 layers, page interactive).

## The remediation plan

`docs/remediation-plan-session27.md` — written and re-validated line-by-line against the
codebase before execution. Two coherent slices: **Slice A** (S27-1 — the wall's AI contract
at three seams: the client `applyOperations` filter as the enforcement, `lockedTargetIds`
plumbed client → route → parser for honest replies, the LLM system prompt listing locked
ids) and **Slice B** (S27-2 — the reference's newly-measured reply footer: the honest
"N action(s) performed" count + a WORKING Revert via a pre-apply snapshot restored through
a new `restoreSnapshot` store action that is itself undoable).

## The TDD execution

**RED (unit):** the two wall-contract tests failed at their exact assertions — the
locked-aware delete returned the UNFILTERED `['el-1', 'el-2']` (the locked `el-2` rode
along), and the all-locked selection produced a delete operation instead of the declined
no-op. The two boundary pins (no-locked legacy behavior + the two-arg back-compat call)
were GREEN by design.

**RED (e2e):** 3 of the 4 new tests failed against the pre-fix build. Two test-side
discoveries en route, both fixed honestly rather than worked around:

1. **The z-ai SDK is REACHABLE from the standalone e2e server** — the LLM path won and its
   free-form reply ("Deleted selected element", with bogus ids) made the AI assertions
   non-deterministic (the pre-fix locked Glow survived one run by LLM luck, not by the
   wall). Fix: the route gained the explicit `DIGMA_DISABLE_AI_LLM=1` force-degrade knob,
   the Playwright webServer sets it, and the workspace test's reply assertion was re-pinned
   to the fallback's deterministic "Added 2 squares." — the LLM path stays covered by its
   degrade-not-fail contract.
2. Two assertion typos in my own new tests (the Select-All layer count 5 → 1 — only the
   locked Glow remains; the footer test's LLM-era phrasing). Fixed; the code under test
   was already correct.

**GREEN:** all fast gates + the new suites. **Full gate green: lint · typecheck · 78 unit
(+4) · build 20 routes · 28 smoke · 83 e2e (+4).**

## The live verification (dev server, post-fix)

- The locked Glow row-selected + AI "delete selected" → "6 layers • 1 selected", the Glow
  intact (on the LLM path the reply still CLAIMED deletion — the client guard held the wall
  regardless; the deterministic fallback replies honestly with the locked-decline).
- Select All + AI "delete selected" → exactly "1 layer" — the locked Glow alone with its
  selection preserved; Ctrl+Z restored all six.
- "add 2 blue squares" → 8 layers, the footer "2 action(s) performed", and the Revert click
  returned the canvas to 6 with the footer settled away; Ctrl+Z after the revert brought
  the two squares BACK (the revert is itself undoable).

## Delivery

- 16 standard screenshots re-captured (re-seeded first) + the audit-provenance set
  (`docs/screenshots/ref-audit-s27/`: the reference's AI crash, its mobile failure-class-A,
  the clone's post-fix AI-wall and footer/Revert states).
- `.env.example` verified + extended with the `DIGMA_DISABLE_AI_LLM` knob (included in the
  commit).
- Docs aligned: PAD v1.15.0 (revision block + ADR-006 + §7.4 counts), AGENTS.md, CLAUDE.md,
  README.md, digma_SKILL v1.14.0 (lesson **F23** — a LYING reference control still yields
  outcome data: port outcomes, never claims), the plan's execution status, this log, and
  the worklog Task 37 entry.
- Full gate re-verified green before the commit; secret scan clean; pushed to
  `main` via `docs/ssh_git_wrapper_v3.py` (the key shredded after).
