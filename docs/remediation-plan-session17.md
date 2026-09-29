# Digma — Session 17 Remediation Plan (v1.10.0 target)

**Date:** 2026-09-29 · **Input:** seventh live parity audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-16 code @ `48f7991`), desktop 1440×900 and
mobile 390×844, DOM/computed-style level (post-hydration, 4–10 s settles) + fresh-load
re-measurement discipline. **Method:** every finding below was verified in BOTH apps'
DOM before entering this plan, and the plan was re-validated line-by-line against the
codebase before execution.

---

## Context

Session 16 (commit `6eb8c3a` + `48f7991`, PAD v1.9.0) closed the dialog-and-panel-interior
parity gaps (create-dialog chrome + the properties panel's slider suite) and recorded the
sixth consecutive full parity audit. This session re-audited with fresh eyes (the seventh
audit), applying the session-16 "next steps" directive: audit the remaining unaudited
interiors at the same DOM depth — **the layers-panel row internals** (this session's
headline), the Recent sort-control internals, the per-corner number inputs — plus the
standard parity-hold sweep (mobile nav, nav pill, auth, editor chrome).

The baseline full gate was re-run green BEFORE any change: lint ✅ · typecheck ✅ ·
74/74 unit ✅ (build/smoke/e2e re-verified after the changes; dev server healthy with
`[db] DATABASE_URL -> <repo>/db/custom.db`).

### Verified parity-hold (no change — the seventh consecutive audit)

- **Recent-page sort control internals (first interior audit):** wrapper
  `div.flex.items-center.gap-2` with a `lucide-calendar w-4 h-4 text-gray-400` icon before
  the select; the select itself `text-sm border border-gray-300 rounded-lg px-3 py-1
  bg-white text-gray-700` with the same four options (`last_accessed` / `updated_date` /
  `created_date` / `name`) — identical in both apps (the clone adds focus states + an
  sr-only label: superset, invisible).
- **Recent view toggles + count badge + search wrapper:** 40×40 `w-10 h-10 rounded-md`
  toggles with the near-black active (grid) / white inactive (list);
  `div.text-sm.text-gray-400→gray-500` "N files found" badge; `div.relative.flex-1
  .md:w-80` search wrapper with the absolute `lucide-search` icon — all identical.
- **Layers-panel structure:** `w-60 bg-[#161b22] border-r` panel, `p-4 border-b` header
  (`text-sm font-medium text-white` h3 + the `text-xs text-gray-400` Select All button +
  the counter div), `flex-1 overflow-y-auto` body with the `p-2` rows wrapper, REVERSE
  row order (newest first), row classes `flex items-center gap-2 p-2 rounded-lg
  cursor-pointer transition-all duration-200 group relative` + selected `bg-blue-600
  text-white` / unselected `hover:bg-[#30363d] text-gray-300`, type icon `w-4 h-4
  flex-shrink-0`, name `flex-1 min-w-0 → text-sm font-medium truncate`, eye/lock hover
  buttons (`p-1 hover:bg-white/10 rounded transition-colors opacity-0
  group-hover:opacity-100`, `w-3 h-3` icons), empty state ("No layers yet" / "Start
  designing to see layers here"), and the counter's selected suffix —
  `<span class="text-blue-400 ml-2">• 1 selected</span>` — IDENTICAL in both apps.
- **Properties panel (session-16 fixes re-verified):** five sections, the `editor-range`
  slider suite, the segmented Fill pills, Stroke Width slider 0–20, the `°` / `%`
  suffixes, per-corner number inputs (`grid grid-cols-2 gap-3`, labels `text-xs
  text-gray-300`, inputs `mt-1 h-8 rounded-md border border-[#30363d] bg-[#0d1117]
  px-3 text-sm text-white`, `placeholder="0"`), SliderRow geometry (`mt-1 gap-2` + the
  `w-8 text-right` readout) — all at parity (EXCEPT the radius max — see S17-2).
- **Teams internals:** empty state (`text-center py-16`, `lucide-users w-16 h-16
  text-gray-300`, h3/p, blue-600 buttons) matches; the reference's Create Team remains
  a no-op (the clone's working dialog is the documented superset).
- **Mobile navigation (the operator-flagged surface):** the reference STILL ships
  Tailwind v4 failure class A at 390×844 (nav `display:none`, NO hamburger — its one
  header button is the 36×36 notifications bell). The clone's fix re-verified
  END-TO-END: 44×44 trigger with stable `aria-label="Navigation menu"`, drawer with all
  three links, `data-scroll-locked` body, tap "Recent" → navigates to `/Recent` AND
  dismisses.
- **Reference's own bugs re-confirmed:** the AI submission crash (blank screen after
  "Add 3 colored circles" — reproduced again this session; the clone answers, mutates
  the canvas, and stays interactive), failure-class-A mobile nav.
- **Desktop chrome spot checks:** nav pill exact-match scope on `/Dashboard`, greeting
  hero, editor tool rail — all hold.

### Findings (all verified in both DOMs; the trash button with live functional proof)

| # | Finding | Severity |
|---|---------|----------|
| S17-1 | **Layer rows are missing the TRASH hover action.** The reference renders THREE hover actions per layer row — eye, lock, and a red delete button: `p-1 hover:bg-red-500/20 rounded transition-colors opacity-0 group-hover:opacity-100 text-red-400` carrying `lucide-trash2 w-3 h-3`. The trash button is FUNCTIONAL in the reference: clicking it deleted the layer live during the audit (counter "1 layer• 1 selected" → "0 layers", draggable rows 1 → 0; no confirm dialog, immediate delete — the reference's own undo covers recovery). The clone renders only eye + lock. Proven on every row (re-verified on 3 rows: all carry it). | **High** |
| S17-2 | **Corner-radius slider max is 75 in the reference — session 16's "50" was a misread.** Measured TWICE this session on fresh page loads with freshly drawn elements: `aria-valuemin="0" aria-valuemax="75"` on the All Corners Radix thumb (sessions 1–5 measured 75 originally; session 16's single "50" reading was the outlier — it shipped a regression dressed as a fix). The clone now says 50 (slider `max` + clamp + e2e pin + four docs). Revert to 75 everywhere. | **Medium** |
| S17-3 | **Docs record the wrong radius facts.** AGENTS/CLAUDE/README/PAD/SKILL all document "slider 0–50 — the reference's measured aria-valuemax, v1.9.0" (session 16's S15-8 doc updates carried the misread). They must go back to 0–75 with the session-17 reversal note. | **Low** |

---

## P1 — Code changes (TDD, two slices)

### Slice A — the layer-row trash button (S17-1)

**Files:** `src/components/editor/layers-panel.tsx` (the row actions block, ~lines
166–212).

- Add the third hover action after the lock button, using the reference's measured
  chrome: `Trash2` from `lucide-react` at `h-3 w-3` inside a button with classes
  `rounded p-1 opacity-0 transition-colors hover:bg-red-500/20 group-hover:opacity-100
  text-red-400` (the reference's exact class set; the eye/lock buttons already use the
  same shape with `hover:bg-white/10`).
- `aria-label={\`Delete layer ${el.name ?? el.type}\`}` + `stopPropagation` (an
  action-button tap must not re-select the row — same contract as eye/lock).
- Click calls the EXISTING store action `useEditorStore.getState().deleteElements([el.id])`
  — the store already pushes the undo snapshot, clears the id from selection, and flips
  `saveState` to unsaved (autosave flushes the replace contract). The reference's trash
  is an immediate delete with no confirm; the clone's undo/redo (60 snapshots, Ctrl+Z)
  is the recovery path — a superset, matching the AGENTS.md delete-conventions row
  (layer-row delete joins the canvas `Delete` key as an inline delete; NO
  `AlertDialog` global confirm).
- **Tests (RED first):** `tests/e2e/editor-panels.spec.ts` — a new test
  ("layer rows carry the reference's trash hover action (session 17)") asserting: every
  layer row (`[role=button][aria-label^="Layer"]`) exposes a trash button with the
  `text-red-400` class + `hover:bg-red-500/20` + a `lucide-trash2` svg at `h-3 w-3`;
  clicking it removes exactly that row (row count N → N−1, the counter text updates,
  the deleted layer's row-button is gone while a sibling stays); the row's other
  buttons (eye/lock) still exist (3 actions per row).

### Slice B — the corner-radius max revert (S17-2)

**Files:** `src/components/editor/properties-panel.tsx` (the radius `SliderRow` ~lines
252–258) + `tests/e2e/editor-panels.spec.ts` (the session-15 radius pin, line 176–181)
+ the per-corner clamp comment if any.

- Slider `max={75}` and the onChange clamp `Math.min(Math.max(radius, 0), 75)`.
- The e2e pin: `await expect(slider).toHaveAttribute("max", "75")` with the comment
  corrected to record the session-17 double-measurement (fresh loads, fresh elements,
  `aria-valuemax="75"`; session 16's "50" was a misread — the reversal of a reversal).
- **Tests (RED first):** the existing session-15/16 test asserts `max="50"` — flip the
  assertion to `75` FIRST (it fails against the current build → RED), then change the
  component (→ GREEN). Also extend the radius readout check: set the slider to its max
  via the per-corner "Top Left" number input fill("75") → the readout shows 75 (the
  session-16 fill("50") sub-check in the opacity test is unrelated and stays).

## P2 — Documentation alignment (post-fix)

- **PAD → v1.10.0:** new revision block (the S17-1…S17-3 findings + the F18 lesson +
  the seventh-audit record); ADR-011's slider contract note re-measured (radius 0–75);
  the layers-panel facts gain the trash-row action; §7.1/§7.4 counts refreshed.
- **AGENTS.md:** the layers-panel architecture fact gains the trash hover action
  (immediate delete, undo-recoverable); the properties-panel fact's radius 0–50 → 0–75.
- **CLAUDE.md:** the editor-panels facts ditto (trash action + radius 0–75).
- **README.md:** the Layers panel feature row gains the per-row delete; the
  properties-panel row's radius 0–50 → 0–75.
- **digma_SKILL.md → v1.9.0:** lesson **F18** (a measurement that REVERSES a
  previously-verified fact needs double-measurement on fresh state before it ships —
  session 16's radius "50" single-read flipped a correct value and shipped a
  regression dressed as a fix; session 17's re-audit caught it only because the
  next-steps directive pointed at the panel interior again); the §5 LayersPanel row +
  PropertiesPanel radius refreshed; counts.
- `docs/remediation-plan-session17.md` (this plan + execution status) +
  `docs/session_18.md` (this session's structured log) + `worklog.md` Task 32 entry.

## P3 — Delivery

- Screenshots: re-capture the standard set from the remediated dev server →
  `docs/screenshots/`; this session's audit provenance (reference layer-row evidence
  incl. the live trash delete, the radius re-measure, the mobile re-verification) →
  `docs/screenshots/ref-audit-s17/`.
- `.env.example`: re-verify against the codebase (unchanged this session) — included
  in the commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …`.
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build →
  ./scripts/smoke-test.sh → test:e2e` — all green before push (74 unit / 28
  smoke / 63 e2e — +1 net-new trash-action test; the radius pin is a
  REWRITE of the session-15/16 test, not net-new).
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- The mobile navigation fix (re-verified end-to-end; the reference still ships
  failure class A).
- The eye/lock hover actions, the row selection semantics, the drag-reorder, the
  reverse ordering, the rename-on-double-click, the counter with its blue selected
  suffix — all pinned/verified this session.
- The properties panel's OTHER slider maxes (stroke 0–20, rotation ±180, scale
  0.1–3.0, opacity 0–100) — re-measured this session, all correct.
- The clone's working supersets (Create Team dialog, card ellipsis menu, clipboard
  Share, Present mode, Explore Templates toast, Untitled editor) and the reference's
  own bugs deliberately not cloned (AI crash, failure-class-A mobile nav, no-op
  Create Team/ellipsis/Explore/Gradient-Image tabs).
- The remaining PAD §10 scope cuts (per-corner radii, gradient fills, forgot-mail
  delivery, in-process rate limiter, session revocation) — none are release blockers.
- The historical PAD revision blocks (precedent: they record what happened, including
  session 16's misread — the new block documents the reversal).

---

## Execution status (end of session 18)

**All items EXECUTED and GREEN** — RED first (the new trash-action test failed at
`toBeVisible` "element(s) not found" — no Delete-layer button existed; the flipped
radius assertion failed at `toHaveAttribute("max", "75")` against the pre-fix build),
then GREEN: Slice A (`layers-panel.tsx` — the third hover action with the reference's
red chrome, wired to the existing `deleteElements` store action: immediate delete +
undo recovery + the autosave replace contract), Slice B
(`properties-panel.tsx` — slider `max={75}` + clamp 0–75, the reversal of session
16's misread). En-route test engineering: the new `aria-label="Delete layer …"`
buttons collided with the old substring `getByRole` locators — row-click locators
scoped with `exact: true` (5 in editor-panels.spec.ts, 1 in workspace.spec.ts) and
the untitled-editor `/Rectangle 1/` regex scoped to the exact row label. Live
verification: the reference's measured chrome renders (classes + icon), clicking
deletes (2 rows → 1, counter updates), Ctrl+Z restores (undo-recovery proven), the
slider `max=75` reads live; VLM cross-check confirms both apps' layer rows show
eye/lock/red-trash in hover. Full gate green: **74 unit / 28 smoke / 63 e2e (+1)**.
Docs aligned at PAD v1.10.0 / digma_SKILL v1.9.0 (lesson F18).
