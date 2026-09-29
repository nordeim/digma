# Session 20 — Layer-row functional-semantics parity pass (the eye's canvas contract, the rename input chrome, the lock's opacity semantics), eighth full parity re-audit

**Date:** 2026-09-29 · **Operator prompt:** refresh workspace → review docs (`AGENTS.md`, `CLAUDE.md`, `README.md`, `PAD`, `digma_SKILL.md`, `docs/session_18.md`, `docs/remediation-plan-session17.md`, `worklog.md`, `docs/session_19.md`) → validate against the codebase → iterate to parity with `https://digma-371dfd0d.base44.app/` (login audited) → mobile-nav + Tailwind v4 watch → db at repo root + `DATABASE_URL="file:../db/custom.db"` → vitest/playwright suites → remediation plan → TDD execution → screenshots → `.env.example` → docs → SSH-wrapper push to `main`.

## 1. Environment & baseline

| Step | Result |
|------|--------|
| Workspace refresh: `git pull` (`3dba7be..9d99477` — `docs/session_19.md`, the session-18 transcript, fetched) | ✅ |
| Docs review: `AGENTS.md`, `CLAUDE.md`, `README.md`, `PAD v1.10.0`, `digma_SKILL.md v1.9.0`, `docs/session_18.md`, `docs/remediation-plan-session17.md`, `worklog.md` (Tasks 1–32), `docs/session_19.md` (transcript) | ✅ |
| Codebase validation: capitalized routes + `src/proxy.ts`, session gates, Zustand store, mobile-nav Sheet, vitest/playwright/eslint/tsconfig all excluding `skills/`, `@theme` literal fonts + reference-palette pins, the session-18 fixes in place (trash button, radius 75) | ✅ |
| DB placement verified: `.env` → `DATABASE_URL="file:../db/custom.db"`; `db/` at the repo root (custom.db + e2e.db); `[db] DATABASE_URL -> file:/home/z/my-project/digma/db/custom.db` startup line. The parent-workspace `.env` trap is PRESENT (a parent `.env` with a `DATABASE_URL` exists at `/home/z/my-project/.env`) — neutralized with the `env -u DATABASE_URL` discipline on every gate command | ✅ |
| Test suites verified present: `vitest.config.ts` (74 checks) + `playwright.config.ts` (63 checks → 66 after this session) — both excluding `skills/` | ✅ |
| Baseline fast gates green pre-change: lint ✅ · typecheck ✅ · 74/74 unit ✅ (the full gate — build 20 routes, 28/28 smoke, 66/66 e2e — re-verified green after the changes) | ✅ |

## 2. Live parity re-audit — the eighth consecutive (agent-browser, 1440×900 + 390×844, settled 4–10 s)

This session executed the session-18 "next steps" directive: a FUNCTIONAL sweep of the reference's eye/lock actions (the headline), the layers-panel rename input, and the AI-bubble post-send structure (unmeasurable — the reference's assistant still crashes: its `charAt` TypeError re-appeared in the console from its `assets/index-*.js`), plus the standard parity-hold sweep.

| # | Finding | Severity |
|---|---------|----------|
| S19-1 | **The rename input's chrome diverges.** Measured live in the reference (double-click on "Rectangle 2"'s name): the input that replaces the name div carries the shadcn-Input base plus editor overrides — `rounded-md`, a VISIBLE `border-[#30363d]`, `h-6 px-2 py-1`, `text-sm`, `shadow-sm`, focus ring only on `focus-visible`. The clone shipped `rounded px-1 ring-1 ring-blue-500` — an always-on blue ring, no border, wrong rounding/padding/height. | **Medium** |
| S19-2 | **The lock is opacity-based in the reference, not icon-swap-based.** Measured live on three rows (Rectangle 3 locked via a real click): the SAME `lucide lucide-lock w-3 h-3` icon in both states, the svg's class flipping `opacity-50` (unlocked) ↔ `opacity-100` (locked). The reference's lock is FUNCTIONAL (its locked canvas element gains `cursor-not-allowed` + inline `cursor: default`; its inline style overrides the class, so the observable cursor is `default` — the clone's `pointer-events: none` approach is observably equivalent). The clone shipped two different hand-inlined padlock SVGs with no opacity distinction. | **Medium** |
| S19-3 | **The clone's eye toggle was functionally inconsistent — the canvas rendered hidden elements.** The reference's eye is a NO-OP (verified live TWICE with real clicks: the icon stays `lucide-eye` and the canvas element stays rendered). The clone's eye was a HALF-working superset: the row icon swapped and the hit-test/marquee/present/thumbnails honored `visible` — but the canvas STILL painted hidden elements (verified live: after "Hide layer" the element remained `display: block; visibility: visible`). The row said hidden; the canvas said visible. | **High** |
| S19-4 | **The eye/lock icons were hand-inlined SVGs; the reference's DOM carries lucide-react components** (`class="lucide lucide-eye w-3 h-3"`). | **Low** |

**Verified parity-hold (all green, no change):** the layer-row structure (three hover actions — eye/lock/red-trash, session-17 fixes re-verified in both DOMs), the rename TRIGGER semantics (double-click opens a prefilled input; Escape closes — behavior matched, only chrome diverged), the mobile navigation end-to-end at 390×844 (the reference STILL ships Tailwind v4 failure class A — nav `display:none`, NO hamburger, the 36×36 bell only; the clone's 44×44 trigger + drawer + scroll lock + tap-navigate-and-dismiss + Escape close all re-verified, and the hamburger is hidden at 768 with the desktop nav `flex`), the nav-pill exact-match scope on `/Recent`, the Teams page (flat body, one Create Team button — both apps), the Recent sort control (four options + two 40×40 toggles + count badge — reference), the greeting hero, Tailwind v4 health on the clone (no legacy config, zero `@apply`, Inter on `<body>`, the clone's console clean — the `NaN`/uncontrolled-input console entries traced to the reference's tab, and the `cdn.tailwindcss.com` warning is the reference's CDN build).

## 3. Remediation plan + TDD execution

`docs/remediation-plan-session19.md` — written with the measured DOM facts (the rename input's full class string; the three-row lock-opacity evidence; the eye no-op verified with live clicks on the reference and the unfiltered canvas verified live on the clone), validated line-by-line against the codebase, then executed:

- **RED:** the three new tests failed at their exact assertions — the eye test at `toHaveCount(before - 1)` (the canvas kept 6 elements), the rename test at the chrome pins (the class string was the old `rounded px-1 ring-1 ring-blue-500`), the lock test at `toHaveClass(/lucide-lock/)` (the svg carried only `h-3 w-3` — a hand-inlined svg).
- **GREEN (Slice A — `canvas.tsx`):** the element map now filters `el.visible` — the same contract as the hit-test, marquee, presentation, and thumbnails. The eye is now a COHERENT working superset over the reference's no-op.
- **GREEN (Slice B — `layers-panel.tsx`):** the rename input carries the reference's measured chrome (`h-6 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-2 py-1 text-sm text-white shadow-sm transition-colors … focus-visible:ring-1 focus-visible:ring-ring …`) — the always-on blue ring is gone; the border + h-6/px-2 geometry + shadow match.
- **GREEN (Slice C — `layers-panel.tsx`):** the eye/eye-off/lock SVGs replaced with lucide-react `Eye`/`EyeOff`/`Lock` components; the lock is a SINGLE `Lock` icon with `cn("h-3 w-3", el.locked ? "opacity-100" : "opacity-50")` — the reference's measured DOM (`lucide lucide-lock w-3 h-3 opacity-50/100`, the same icon both states).
- **Test engineering en route:** the eye test identifies its target by NAME (rows render in REVERSE order — DOM position ≠ row position: the first row's element is the LAST canvas node); the rename test's negative class checks anchor at class-list boundaries (`/(?:^|\s)ring-1(\s|$)/`) so the legitimate `focus-visible:ring-1` never trips the "no always-on ring" assertion.
- **Live verification:** the clone's row buttons now render `lucide lucide-eye h-3 w-3` / `lucide lucide-lock h-3 w-3 opacity-50` (→ `opacity-100` on lock, the same svg — verified with live clicks both directions); "Hide layer" removes exactly that element from the canvas DOM (6 → 5, the named element absent, the row stays; "Show layer" restores it); the rename input renders the measured class string live; the rename round-trip works (type → blur → the row label updates; Escape cancels).

## 4. Gate (all green at v1.11.0)

| Gate | Result |
|------|--------|
| `bun run lint` | ✅ clean |
| `bun run typecheck` | ✅ clean |
| `bun run test` | ✅ **74/74** (unchanged) |
| `bun run build` | ✅ 20 routes (Proxy registered) |
| `./scripts/smoke-test.sh` | ✅ **28/28** (dev server stopped) |
| `bun run test:e2e` | ✅ **66/66** (+3: the eye-hide canvas test, the rename-chrome test, the lock-opacity test) |

## 5. Docs & artifacts

- Screenshots re-captured from the remediated dev server → `docs/screenshots/` (the standard 16: login, dashboard, recent, teams, editor, untitled, mobile ×4, tablet, components, transform-scale, signup ×2, forgot); audit provenance → `docs/screenshots/ref-audit-s19/` (the reference's rename-input live state, the three-row lock-opacity evidence, the reference mobile failure-class-A capture, the clone post-fix editor, the clone eye-hide canvas evidence).
- `.env.example` re-verified against the codebase (DATABASE_URL relative rule, `DIGMA_REPO_ROOT`, `AUTH_SECRET`) — unchanged, included in the commit.
- PAD → **v1.11.0** (revision block: the S19-1…S19-4 findings + the F19 lesson + the eighth-audit record; the canvas row + layers-panel rows; §7.4 checklist 66/66; counts).
- `AGENTS.md` / `CLAUDE.md` / `README.md`: the layer-row action facts (the eye's canvas contract, the rename chrome, the opacity-based lock) + counts 63→66 (+ the CLAUDE.md E2E paragraph's stale "radius max 50" corrected to 75 with the session-17 note).
- `digma_SKILL.md` → **v1.10.0**: lesson **F19** (audit FUNCTIONAL semantics, not just chrome — a control can look complete and do half its job; trace every interactive control's full data path to its observable consequence, on BOTH apps — that sweep is what distinguishes "the reference can't do X" (superset territory) from "the clone half-does X" (bug territory)) + the §5 LayersPanel/Canvas rows refreshed + counts.
- `docs/remediation-plan-session19.md` (this session's plan + execution status) + `docs/session_20.md` (this log) + `worklog.md` Task 33 entry.

## 6. Suggested next steps

- Remaining PAD §10 scope cuts stand (gradient/image fills, per-corner radii, rotation-aware bounds, forgot-mail delivery, in-process rate limiter, session revocation) — none are release blockers.
- On the next session, continue the F19 functional sweep: the marquee/drag-reorder functional paths (both apps), the reference's zoom-cluster behavior at live zoom levels, and the properties-panel number inputs' commit semantics (Enter vs blur vs spinners) — the chrome is pinned; the FUNCTIONAL contracts are the remaining unaudited layer.
