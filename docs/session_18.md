# Session 18 — Layer-row-interior parity pass (the reference's third hover action + the radius re-measure reversal), seventh full parity re-audit

**Date:** 2026-09-29 · **Operator prompt:** refresh workspace → review docs (`AGENTS.md`, `CLAUDE.md`, `README.md`, `PAD`, `digma_SKILL.md`, `docs/session_16.md`, `docs/remediation-plan-session15.md`, `worklog.md`, `docs/session_17.md`) → validate against the codebase → iterate to parity with `https://digma-371dfd0d.base44.app/` (login audited) → mobile-nav + Tailwind v4 watch → db at repo root + `DATABASE_URL="file:../db/custom.db"` → vitest/playwright suites → remediation plan → TDD execution → screenshots → `.env.example` → docs → SSH-wrapper push to `main`.

## 1. Environment & baseline

| Step | Result |
|------|--------|
| Workspace refresh: `git pull` (`6eb8c3a..48f7991` — `docs/session_17.md`, the session-16 transcript, fetched) | ✅ |
| Docs review: `AGENTS.md`, `CLAUDE.md`, `README.md`, `PAD v1.9.0`, `digma_SKILL.md v1.8.0`, `docs/session_16.md`, `docs/remediation-plan-session15.md`, `worklog.md` (Tasks 1–31), `docs/session_17.md` (transcript) | ✅ |
| Codebase validation: capitalized routes + `src/proxy.ts`, session gates, Zustand store, mobile-nav Sheet, vitest/playwright/eslint/tsconfig all excluding `skills/`, `@theme` literal fonts + reference-palette pins, `isNavActive()` exact match | ✅ |
| DB placement verified: `.env` → `DATABASE_URL="file:../db/custom.db"`; `db/` at the repo root (custom.db + e2e.db; `[db] DATABASE_URL -> <repo>/db/custom.db` startup line). The exported-shell-var trap re-handled (`env -u DATABASE_URL` discipline for every gate command) | ✅ |
| Baseline fast gates green pre-change: lint ✅ · typecheck ✅ · 74/74 unit ✅ (the full gate — build 20 routes, 28/28 smoke, 62/62 e2e — re-verified green after the changes) | ✅ |
| Test suites verified present: `vitest.config.ts` (74 checks) + `playwright.config.ts` (62 checks → 63 after this session) — both excluding `skills/` | ✅ |

## 2. Live parity re-audit — the seventh consecutive (agent-browser + VLM, 1440×900 + 768 + 390×844, settled 4–10 s)

This session executed the session-16 "next steps" directive: apply the F17 discipline to the remaining unaudited interiors — the **layers-panel row internals** (headline), the **Recent sort-control internals**, the **per-corner number inputs** — plus the standard parity-hold sweep.

**The layers-panel row audit found the session's headline gap AND a shipped regression:**

| # | Finding | Severity |
|---|---------|----------|
| S17-1 | **Layer rows missing the trash hover action.** The reference renders THREE hover actions per row — eye, lock, and a red delete (`p-1 hover:bg-red-500/20 rounded transition-colors opacity-0 group-hover:opacity-100 text-red-400`, `lucide-trash2 w-3 h-3`) — and the trash is FUNCTIONAL: a live click deleted the reference's layer immediately ("1 layer• 1 selected" → "0 layers", no confirm). The clone shipped only eye + lock. | **High** |
| S17-2 | **Corner-radius slider max is 75 — session 16's "50" was a misread.** Re-measured TWICE on fresh page loads with freshly drawn elements: `aria-valuemin="0" aria-valuemax="75"` both times (sessions 1–5 measured 75; session 16's single reading was the outlier — it shipped a regression dressed as a fix, defended by an e2e pin written from the same misread). | **Medium** |
| S17-3 | Docs recorded the wrong radius facts ("0–50, the reference's measured aria-valuemax, v1.9.0" in AGENTS/CLAUDE/README/PAD/SKILL). | **Low** |

**Verified parity-hold (all green, no change):** the Recent sort control internals (wrapper `flex items-center gap-2` + `lucide-calendar w-4 h-4 text-gray-400` + native select with the same four options and classes — identical), the view toggles (40×40, near-black active / white inactive), the count badge + search wrapper, the layers panel (header, Select-All button, counter with the `text-blue-400 ml-2` selected suffix — span-for-span identical, reverse ordering, empty state), the per-corner number inputs (`grid grid-cols-2 gap-3` + labels + `mt-1 h-8` input classes), the SliderRow geometry, the Teams empty state, the create-dialog + properties-panel chrome (session-16 fixes re-verified), the nav-pill exact-match scope on `/Dashboard`, the greeting hero. **Mobile navigation re-verified end-to-end** at 390×844: the reference STILL ships Tailwind v4 failure class A (nav `display:none`, no hamburger — its one header button is the 36×36 bell); the clone's 44×44 trigger opens the drawer, scroll-locks, and tap-navigate-and-dismiss works ("Recent" → `/Recent`). The reference's AI-submission crash re-confirmed (blank screen). The reference's Create Team remains a no-op (the clone's dialog is the documented superset).

## 3. Remediation plan + TDD execution

`docs/remediation-plan-session17.md` — written with the measured DOM facts (the trash button verified with a LIVE functional delete on the reference; the radius re-measured twice), validated line-by-line against the codebase, then executed:

- **RED:** the new trash test failed at `toBeVisible` ("element(s) not found" — no Delete-layer button existed); the flipped radius assertion failed at `toHaveAttribute("max", "75")` against the pre-fix build.
- **GREEN (Slice A — `layers-panel.tsx`):** the third hover action with the reference's exact chrome (`text-red-400 hover:bg-red-500/20` + `Trash2 h-3 w-3`), wired to the EXISTING store action `deleteElements([el.id])` — immediate delete (reference parity) with undo recovery (clone superset; the store already pushes the history snapshot and the autosave replace contract persists the removal).
- **GREEN (Slice B — `properties-panel.tsx`):** slider `max={75}` + clamp 0–75 — the reversal of session 16's misread, shipped with the F18 lesson.
- **Test engineering en route:** the new `aria-label="Delete layer …"` buttons collided with the old substring `getByRole` locators (strict-mode violations: "Layer Headline" matched the row AND its trash) — the row-click locators scoped with `exact: true` (editor-panels ×4, workspace ×1) and the untitled-editor `/Rectangle 1/` regex scoped to the exact row label.
- **Live verification:** the trash renders with the reference chrome, clicking deletes (2 rows → 1, counter updates), Ctrl+Z restores the deleted layer, the slider reads `max=75`; VLM cross-check confirms both apps' layer rows show eye/lock/red-trash in hover.

## 4. Gate (all green at v1.10.0)

| Gate | Result |
|------|--------|
| `bun run lint` | ✅ clean |
| `bun run typecheck` | ✅ clean |
| `bun run test` | ✅ **74/74** (unchanged) |
| `bun run build` | ✅ 20 routes (Proxy registered) |
| `./scripts/smoke-test.sh` | ✅ **28/28** (dev server stopped) |
| `bun run test:e2e` | ✅ **63/63** (+1: the layer-row trash test; the radius pin is a rewrite) |

## 5. Docs & artifacts

- Screenshots re-captured from the remediated dev server → `docs/screenshots/` (the standard 16: login, dashboard, recent, teams, editor with the trash in hover state, untitled, mobile ×4, tablet, components, transform-scale, signup ×2, forgot); audit provenance → `docs/screenshots/ref-audit-s17/` (the reference layer-row trash-hover evidence, the radius-75 properties panel, the reference mobile failure-class-A capture, the clone post-fix pair).
- `.env.example` re-verified against the codebase (DATABASE_URL relative rule, `DIGMA_REPO_ROOT`, `AUTH_SECRET`) — unchanged, included in the commit.
- PAD → **v1.10.0** (revision block: the S17-1…S17-3 findings + the F18 lesson + the seventh-audit record; the ADR-011 context's radius 0–75; the layers facts; §7.4 checklist 63/63; counts).
- `AGENTS.md` / `CLAUDE.md` / `README.md`: the layer-row trash fact + the radius 0–75 reversal note + counts 62→63.
- `digma_SKILL.md` → **v1.9.0**: lesson **F18** (a measurement that REVERSES a previously-verified fact needs double-measurement on fresh state before it ships — session 16's radius "50" single-read flipped a correct value and shipped a regression dressed as a fix; when a new reading contradicts N prior sessions, the burden of proof is on the new reading) + the interactive-control corollary (test what hover actions DO, not just what they look like); the §5 LayersPanel/PropertiesPanel rows refreshed; counts.
- `docs/remediation-plan-session17.md` (this session's plan + execution status) + `docs/session_18.md` (this log) + `worklog.md` Task 32 entry.

## 6. Suggested next steps

- Remaining PAD §10 scope cuts stand (gradient/image fills, per-corner radii, rotation-aware bounds, forgot-mail delivery, in-process rate limiter, session revocation) — none are release blockers.
- On the next session, continue the interior sweep with the F18 discipline: the layers-panel RENAME input (the double-click inline editor), the AI-assistant message bubbles' post-send structure (unmeasurable on the reference — its assistant crashes), and a functional sweep of the reference's eye/lock actions (visibility/locking semantics vs the clone's).
