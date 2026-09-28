# Session 12 — Nav-pill route-scope fix (exact pathname match) + middleware→proxy migration + docs numeric realignment

**Date:** 2026-09-28 · **Operator prompt:** refresh workspace → review docs (`AGENTS.md`, `CLAUDE.md`, `README.md`, `PAD`, `digma_SKILL.md`, `docs/session_10.md`, `docs/remediation-plan-session10.md`, `worklog.md`, `docs/session_11.md`) → validate against the codebase → iterate to parity with `https://digma-371dfd0d.base44.app/` (login audited) → mobile-nav + Tailwind v4 watch → db at repo root + `DATABASE_URL="file:../db/custom.db"` → vitest/playwright suites → remediation plan → TDD execution → screenshots → `.env.example` → docs → SSH-wrapper push to `main`.

## 1. Environment & baseline

| Step | Result |
|------|--------|
| Workspace refresh: `git pull origin main` (`01cea0d..87733e3` — `docs/session_11.md` fetched) | ✅ |
| Docs review: `AGENTS.md`, `CLAUDE.md`, `README.md`, `PAD v1.6.0`, `digma_SKILL.md v1.5.0`, `docs/session_10.md`, `docs/remediation-plan-session10.md`, `worklog.md` (Tasks 1–28), `docs/session_11.md` (session-10 transcript) | ✅ |
| Codebase validation: capitalized routes + middleware, session gates, Zustand store, mobile-nav Sheet, vitest/playwright/eslint/tsconfig all excluding `skills/`, `bun.lock` sole lockfile, `@theme` literal fonts + reference-palette pins | ✅ |
| DB placement verified: `.env` → `DATABASE_URL="file:../db/custom.db"`; `db/` at the repo root (`custom.db` + `e2e.db` present); login round-trip works; `[db] DATABASE_URL -> file:<repo>/db/custom.db` startup line confirms | ✅ |
| The exported-shell-var trap re-handled: sandbox exports an absolute `DATABASE_URL` (outside the repo) — `env -u DATABASE_URL` discipline for every gate command; parent workspace `.env` already neutralized | ✅ |
| Baseline gates (pre-change): lint ✅ · typecheck ✅ · **72/72 unit** ✅ · build 20 routes ✅ · **28/28 smoke** ✅ (dev stopped) · **53/53 e2e** ✅ | ✅ |

## 2. Live parity re-audit (agent-browser + VLM cross-checks, 1440×900 + 768×1024 + 390×844, settled 4–10 s)

Logged into the reference (operator-supplied account). Audited `/login` (3 states), `/` , `/Dashboard`, `/Recent`, `/Teams`, `/Editor` — nav classes, hero, buttons, tool rail, zoom cluster, auth states; VLM screenshot comparisons on dashboard/login/editor pairs; downloaded + pixel-verified the re-hosted brand asset.

**The headline find — session 10's pill was correct but OVER-SCOPED to `/`:** the reference's nav active-state is an EXACT pathname match. Measured settled (5–10 s) on FOUR routes: at `/` all three links render `text-gray-600 hover:…` with NO `aria-current`; at `/Dashboard`, `/Recent`, `/Teams` the current route's link carries `bg-purple-50 text-purple-700`. Session 10 had restored the pill (right) but pinned it ON at `/` too (wrong — the clone's `isNavActive()` special-cased the root). **Lesson: when pinning a parity fact, pin its ROUTE SCOPE too.**

**Findings (all fixed this session):**

| # | Finding | Severity |
|---|---------|----------|
| S12-1 | **Clone rendered the Dashboard nav pill at `/` (root); the reference does not.** Fixed: `isNavActive()` → exact match (`pathname === href`); the parity pin rewritten as a THREE-state test (no pill at `/`, pill at `/Dashboard`, pill at `/Teams`; `aria-current` asserted present on the canonical route and absent at root). | **High** |
| S12-2 | **Next 16.3.6 deprecation: `middleware` → `proxy` convention.** The dev server printed the migration notice on every boot; PAD §10 had deferred it pending a pin. No test pinned the legacy redirects (verified: no `/recent`-style probe in `tests/` or `scripts/`). Method: characterization pin FIRST (`tests/e2e/workspace.spec.ts` — all four legacy paths 307 to canonical + query survival — written and passed against the OLD middleware), THEN `git mv src/middleware.ts src/proxy.ts` + export rename. Deprecation notice gone; pin stayed green. | Medium |
| S12-3 | **Stale numbers/contradictions in the current-state docs** (verified against the tree): PAD §7.1 parity row 7→9 + missing brand-mark row; workspace row 8→9; PAD §9.2 "62"→72; PAD §4.3/§9.1 seed "4 projects/3 teams"→2 projects/1 team (3 members); SKILL §2 "44 checks"→54; SKILL §17 chip-visibility claim corrected (the bar is `hidden md:flex`); SKILL §6/§19 line refs (editor-store 306→315, globals.css 101→162); SKILL Appendix B db-path 20→19; PAD §11 line counts refreshed (~18 files); `next.config.ts` "ADR-007 (inherited)" mis-attribution for `outputFileTracingRoot` corrected. | Low |

**Verified parity-hold (no change):** the brand mark — the reference RE-HOSTED its logo (old Supabase URL 404s; new `…082348336_782025-1820.jpeg`, same 651×470 art; downloaded + pixel-verified: all six shape hexes + `#0d1017` field + the purple–cyan gap match the session-10 decode exactly; the clone's inline-SVG recreation remains pixel-correct). Editor tool rail (all 9 lucide icons incl. `lucide-image` — the VLM's "grid icon" flag disproven by direct SVG extraction), zoom magnifiers, undo2/redo2. Auth 3 states (ADR-013 re-confirmed). Dashboard/Recent/Teams chrome. Login footer spacing 12 px in BOTH apps (VLM false alarm); nothing below the card. **Mobile nav**: the reference STILL ships failure class A at 390×844 (nav `display:none`, no hamburger — the one header button is a notifications bell); the clone's fix verified end-to-end (44×44 trigger, drawer, scroll lock, tap "Recent" → navigate + dismiss); tablet 768 + desktop 1280 clean. Tailwind v4 health: `@theme` literal fonts + palette pins, `tests/theme.test.ts` green, no legacy config. VLM false alarms investigated and dismissed via DOM (logo "letter D" misread at 96×96; footer spacing; toolbar icon).

## 3. Remediation plan (TDD)

`docs/remediation-plan-session12.md` — written, validated line-by-line against the codebase (seed counts, §7.1 rows, line counts, test counts all re-measured), then executed:

- **RED:** `tests/e2e/parity.spec.ts` nav test rewritten as the three-state pin → failed exactly at the root assertion (the clone painted `faf5ff` at `/`). The characterization pin (`tests/e2e/workspace.spec.ts` legacy-redirect test) passed against the OLD middleware as designed.
- **GREEN (fixes):** `app-header.tsx` `isNavActive()` → exact match; `src/middleware.ts` → `src/proxy.ts` (git mv + export `middleware` → `proxy` + comment updates); `next.config.ts` ADR attribution fix.
- **Verified en route:** build route table still shows the Proxy row; dev server boots with NO deprecation notice; `curl /recent` → 307 → `/Recent`; live browser check at `/` shows all-plain nav and at `/Dashboard` shows the pill.

## 4. Gate (all green at v1.7.0)

| Gate | Result |
|------|--------|
| `bun run lint` | ✅ clean |
| `bun run typecheck` | ✅ clean |
| `bun run test` | ✅ **72/72** |
| `bun run build` | ✅ 20 routes (Proxy registered; no deprecation warning) |
| `./scripts/smoke-test.sh` | ✅ **28/28** (dev server stopped) |
| `bun run test:e2e` | ✅ **54/54** (53 + 1 net-new legacy-redirect characterization pin) |

## 5. Docs & artifacts

- Screenshots re-captured from the remediated dev server → `docs/screenshots/` (the root dashboard now shows the un-highlighted nav — reference-exact); audit provenance → `docs/screenshots/ref-audit-s12/` (reference + clone pairs, the re-hosted logo download, mobile checks).
- `.env.example` re-verified against the codebase (DATABASE_URL relative rule, `DIGMA_REPO_ROOT`, `AUTH_SECRET`) — unchanged, included in the commit.
- PAD → **v1.7.0** (revision block; ADR-008 wording; §10 middleware row → Fixed; §7.1 rows + counts; §9.2; §4.3 seed; §11 line counts; checklist 54).
- `AGENTS.md` / `CLAUDE.md` / `README.md`: nav-pill exact-match fact, proxy references, counts (54 e2e).
- `digma_SKILL.md` → **v1.6.0**: counts, §17 chip claim, §6/§19 line refs, Appendix B, Pattern 5 (proxy), new lessons **F13** (pin the route scope), **F14** (characterization pin before convention migrations), **F15** (re-verify hosted assets when URLs change).

## 6. Suggested next steps

- Remaining PAD §10 scope cuts stand (gradient/image fill pills, per-corner radii, rotation-aware bounds, forgot-mail delivery, in-process rate limiter, session revocation) — none are release blockers.
- Re-run the first-run flow on a fresh clone (no exported `DATABASE_URL`) and eyeball the root dashboard against the settled reference — the nav should now match at every route.
