# Session 22 — Interactive-control functional-quality parity pass (the layers drag-reorder made PRECISE, the properties number inputs' empty-draft semantics, the hex input's accessible name), ninth full parity re-audit

**Date:** 2026-09-29 · **Operator prompt:** refresh workspace → review docs (`AGENTS.md`, `CLAUDE.md`, `README.md`, `PAD`, `digma_SKILL.md`, `docs/session_20.md`, `docs/remediation-plan-session19.md`, `worklog.md`, `docs/session_21.md`) → validate against the codebase → iterate to parity with `https://digma-371dfd0d.base44.app/` (login audited) → mobile-nav + Tailwind v4 watch → db at repo root + `DATABASE_URL="file:../db/custom.db"` → vitest/playwright suites → remediation plan → TDD execution → screenshots → `.env.example` → docs → SSH-wrapper push to `main`.

## 1. Environment & baseline

| Step | Result |
|------|--------|
| Workspace refresh: fresh `git clone` (the sandbox workspace had been reset); HEAD `560d232` (session-20 work `f86119f` + its transcript) | ✅ |
| Docs review: `AGENTS.md`, `CLAUDE.md`, `README.md`, `PAD v1.11.0`, `digma_SKILL.md v1.10.0`, `docs/session_20.md`, `docs/remediation-plan-session19.md`, `worklog.md` (Tasks 1–33), `docs/session_21.md` (transcript) | ✅ |
| Codebase validation: capitalized routes + `src/proxy.ts`, session gates, Zustand store, mobile-nav Sheet, vitest/playwright/eslint/tsconfig all excluding `skills/`, `@theme` literal fonts + reference-palette pins, the session-20 fixes in place (the canvas `visible` filter, the rename chrome, the lucide lock with opacity flip) | ✅ |
| DB placement: `.env` created from `.env.example` → `DATABASE_URL="file:../db/custom.db"`; `db/` at the repo root (custom.db pushed + seeded); `[db] DATABASE_URL -> file:/home/z/my-project/digma/db/custom.db` startup line. The parent-workspace `.env` trap is PRESENT (a `/home/z/my-project/.env` with a `DATABASE_URL`) — neutralized with the `env -u DATABASE_URL` discipline on every gate command | ✅ |
| Test suites verified present: `vitest.config.ts` (74 checks) + `playwright.config.ts` (66 checks → 70 after this session) — both excluding `skills/` | ✅ |
| Baseline fast gates green pre-change: lint ✅ · typecheck ✅ · 74/74 unit ✅ (the full gate — build 20 routes, 28/28 smoke, 70/70 e2e — re-verified green after the changes) | ✅ |
| Scandihaven reference + skills reviewed: `AGENTS.md`/`CLAUDE.md`/`PAD`/`scandihaven_SKILL.md` + `skills/skills-catalog.md` (clone, shallow); the digma repo's own `skills/` catalog (agent-browser v0.38.1 used for the audit; Tailwind-v4, TDD, and clone-app-pat-pro skills consulted) | ✅ |

## 2. Live parity re-audit — the ninth consecutive (agent-browser, 1440×900 + 390×844)

This session executed the session-20 "next steps" directive — the F19 functional sweep of the remaining unaudited interactive paths: **the layers drag-reorder**, **the canvas marquee**, **the properties number inputs' commit semantics**, and **the zoom cluster at live zoom levels** — plus the standard parity-hold sweep.

| # | Finding | Severity |
|---|---------|----------|
| S21-1 | **The clone's layers drag-reorder was broken three ways — precise insertion never happened.** (a) The per-row wrapper's `onDragOver` fired AFTER the row's own handler (DOM bubbling) and OVERWROTE the row's computed index with a crude `after ? elements.length : 0` — every drop resolved to top/bottom-of-list (live-verified: dragging Glow onto Accent Bar's row CENTER sent Glow to the TOP instead of one position down). (b) Even unclobbered, the row's index math was inverted (an ELEMENT index stored where a DISPLAY position was consumed — a double conversion wrong for every non-middle row). (c) The `dragOver` state was never rendered (no drop indicator) and the wrapper's `onDrop` called a local no-op — while the row's own `onDrop` read `dragOver` from its render closure, so a same-tick dragover+drop read stale/null state and silently no-oped (the RED e2e run's exact failure). The reference's own drag-reorder is DEAD (rows `draggable="true"` but no reorder ever happens; the SELECTED row renders `draggable="false"` — its dead-drag mechanism). | **High** |
| S21-2 | **The clone's properties NumberField committed an empty draft as 0.** `onChange` ran `Number("") → 0 → isFinite → commit` — clearing the X input instantly teleported the element to x=0 (live-verified: `translate(120px, 80px)` → `translate(0px, 80px)`); every intermediate keystroke pushed its own undo snapshot + autosave flip. The reference's own inputs are display-only NO-OPS (typed 100, blurred, Enter, ArrowUp — its element never moved, the spinner didn't even change the value). | **High** |
| S21-3 | **The Canvas Properties hex input rendered `aria-label="undefined hex"`** — the template literal lacked the `?? "Color"` fallback its sibling swatch input has. | **Low** |

**Reference-side functional-sweep results (no clone change — its own bug class, documented):** the reference's marquee selection is a NO-OP (a full-canvas drag covering all three stacked shapes produced no rect, no counter, no selection); its properties number inputs are no-ops (above); its zoom cluster is erratic (click-by-click: zoom-in 100→120% then dead; one zoom-out click jumped to 500% `matrix(5,…)`; an async settle to a fit-to-view 32%; zoom-in then INVERTED (32→16%); both buttons dead after; the 16% state persists across reloads — the zoom is saved into the project); its selection ring carries NO paint (the `ring-2 ring-blue-500 ring-offset-1` classes are overridden by the element's serialized inline `box-shadow: none`) and it renders NO resize handles — selection is visible only via the row bg + the "N selected" badge.

**Verified parity-hold (all green, no change):** the mobile navigation end-to-end at 390×844 (the reference STILL ships failure class A — nav `display:none`, NO hamburger, the 36×36 bell only; the clone's 44×44 trigger + drawer with all three links + scroll lock + tap-navigate-and-dismiss + Escape close, hidden at 768 with the desktop nav `flex`); the zoom-cluster chrome (identical pill/button class strings in both DOMs — `absolute top-4 left-4 z-10 flex items-center gap-2`, the pill + lucide zoom-in/out magnifier chips); the "N selected" badge (identical: `absolute top-4 right-4 bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-gray-300 pointer-events-none`); the selected row `bg-blue-600 text-white`; the five properties sections + 10 number inputs with matching widths + `w-8 h-8` color swatches + the shadcn-Input hex field; the clone's marquee verified working (a drag over two fully-contained elements selects exactly them — "2 selected", the dashed rect rendered).

## 3. Remediation plan + TDD execution

`docs/remediation-plan-session21.md` — written with the measured DOM/functional facts (the wrapper-clobber traced via instrumented drag events; the empty→0 commit verified live on the clone's Accent Bar; the reference's no-op inputs verified on every commit path), validated line-by-line against the codebase, then executed:

- **RED:** 3 of the 5 new tests failed at their exact assertions — the lower-half drag test received the UNCHANGED order (the same-tick dispatch read `dragOver` from a stale closure — null — and the row's guard silently no-oped: the stale-closure bug caught red-handed); the empty-draft test saw the element teleport to `translate(0px, …)`; the hex-name test found "undefined hex".
- **GREEN (Slice A — `layers-panel.tsx`):** the wrapper's clobbering `onDragOver`/no-op `onDrop`, the local no-op function, and the dead `dragOver` state DELETED; the row's `onDragOver` reduced to `preventDefault()`; the row's `onDrop` rewritten STATELESS — `remaining = store.elements minus dragged; targetIndex = remaining.indexOf(target); after ? targetIndex : targetIndex + 1` into `reorderElements` (rows render in REVERSE element order, so "below row X on screen" = X's index in the remaining array).
- **GREEN (Slice B — `properties-panel.tsx`):** `NumberField.onChange` skips empty drafts (mid-edit, not a request for 0); `onBlur` restores an abandoned empty/unparseable draft to the display value. A non-empty finite draft still commits live (the working superset over the reference's display-only inputs).
- **GREEN (Slice C — `properties-panel.tsx`):** `aria-label={`${label ?? "Color"} hex`}` — the same fallback the sibling swatch input has.
- **Test engineering en route:** the drag tests dispatch REAL HTML5 drag events (dragstart → dragover → drop) with a real `DataTransfer` carrying `text/layer-id` via `page.evaluate` — the drop-time computation needs no prior state, so a same-tick dispatch is faithful; each drag test WAITS for the autosave's green "Saved" badge before leaving the page (the 800ms debounce's cleanup DISCARDS a pending flush — without the wait, the next test's re-open would load the un-mutated order); the second drag test's expected order was corrected after the first GREEN run showed the precise landing (a drop on Glow's UPPER half lands CTA Label directly above Glow — position 3, not the seeded top).
- **Live verification:** dragging Glow onto Headline's upper half lands Glow DIRECTLY above Headline (pre-fix: a six-position jump); clearing the X input keeps the Accent Bar at `translate(120px, 80px)` (pre-fix: instant teleport to x=0); typing 200 commits live; clear+blur restores "200"; the hex input's accessible name reads "Color hex".

## 4. Gate (all green at v1.12.0)

| Gate | Result |
|------|--------|
| `bun run lint` | ✅ clean |
| `bun run typecheck` | ✅ clean |
| `bun run test` | ✅ **74/74** (unchanged) |
| `bun run build` | ✅ 20 routes (Proxy registered) |
| `./scripts/smoke-test.sh` | ✅ **28/28** (dev server stopped) |
| `bun run test:e2e` | ✅ **70/70** (+4: the two drag-reorder precision tests, the empty-draft test, the hex accessible-name test) |

## 5. Docs & artifacts

- Screenshots re-captured from the remediated dev server → `docs/screenshots/` (the standard 16: login, dashboard, recent, teams, editor, untitled, mobile ×4, tablet, components, transform-scale, signup ×2, forgot); audit provenance → `docs/screenshots/ref-audit-s21/` (the reference's mobile failure-class-A captures ×2, the reference's stuck-at-10% zoom, the reference's no-op properties input with the typed-but-ignored value, the clone's working mobile menu, the clone post-fix precise-reorder, the clone empty-draft-no-jump).
- `.env.example` re-verified against the codebase (DATABASE_URL relative rule, `DIGMA_REPO_ROOT`, `AUTH_SECRET`) — unchanged, included in the commit.
- PAD → **v1.12.0** (revision block: the S21-1…S21-3 findings + the reference-side functional-sweep results + the F20 lesson + the ninth-audit record; the layers-panel/properties rows; §7.4 checklist 70/70; counts).
- `AGENTS.md` / `CLAUDE.md` / `README.md`: the drag-reorder/empty-draft facts + counts 66→70.
- `digma_SKILL.md` → **v1.11.0**: lesson **F20** (state-dependent drop handlers are a two-front bug — clobbered by later-bubbling handlers AND stale in the closure; compute insertion indices from the EVENT at drop time; corollary: `Number("") === 0` is a commit trap — an empty field is MID-EDIT, never a request for 0) + the §5 LayersPanel/PropertiesPanel rows refreshed + counts.
- `docs/remediation-plan-session21.md` (this session's plan + execution status) + `docs/session_22.md` (this log) + `worklog.md` Task 34 entry.

## 6. Suggested next steps

- Remaining PAD §10 scope cuts stand (gradient/image fills, per-corner radii, rotation-aware bounds, forgot-mail delivery, in-process rate limiter, session revocation) — none are release blockers.
- On the next session, the F19/F20 sweep could next cover: the canvas resize-handle paths at non-default zoom (the scale-aware write-back is unit-pinned but not e2e-pinned), the drag-MOVE commit semantics on locked/hidden elements, and the marquee's edge behavior (partial-containment elements, shift-add to selection).
