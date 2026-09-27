---
name: digma
description: "Complete engineering skill for the Digma design-workspace clone (Next.js 16 App Router + React 19 + Tailwind 4 CSS-first + Zustand + Prisma/SQLite). Captures every hard-won lesson from building and parity-remediating the app: the mobile-nav Sheet fix, the standalone-server SQLite chdir trap, the Turbopack singleton-split toast bug, the Next 16 case-insensitive redirect loop, the Untitled-editor create-on-first-save contract, and the full local quality gate."
version: 1.3.0
last_updated: 2026-09-27
project_state: "62 unit checks green · 44 Playwright checks green · 28 smoke checks green · build 20 routes"
---

# Digma — Design-Workspace Clone: Complete Engineering Skill

> **How to use this document:** This is the single-source engineering reference for extending, debugging, onboarding onto, or replicating the Digma codebase. Every claim is verifiable against a file path or a runnable command. When code and this document disagree, the code wins — update the doc in the same commit.
>
> Companion documents: `Project_Architecture_Document.md` (the formal blueprint with ADR-001…009), `AGENTS.md` (operator quick-reference), `CLAUDE.md` (agent instructions), `README.md` (user-facing).

## Table of Contents

1. [§1 Project Identity & Design Philosophy](#1-project-identity--design-philosophy)
2. [§2 Tech Stack & Environment](#2-tech-stack--environment)
3. [§3 Bootstrapping & Configuration](#3-bootstrapping--configuration)
4. [§4 The Design System (Code-First, Tailwind v4)](#4-the-design-system-code-first-tailwind-v4)
5. [§5 Component Architecture & Patterns](#5-component-architecture--patterns)
6. [§6 State Management Deep Dive (the ONE Zustand store)](#6-state-management-deep-dive-the-one-zustand-store)
7. [§7 The AI Assistant Pipeline (degrade-not-fail)](#7-the-ai-assistant-pipeline-degrade-not-fail)
8. [§8 Auth & Security Implementation](#8-auth--security-implementation)
9. [§9 Anti-Patterns & Common Bugs](#9-anti-patterns--common-bugs)
10. [§10 Debugging Guide](#10-debugging-guide)
11. [§11 Pre-Ship Checklist](#11-pre-ship-checklist)
12. [§12 Lessons Learnt & How to Avoid Them](#12-lessons-learnt--how-to-avoid-them)
13. [§13 Pitfalls to Avoid](#13-pitfalls-to-avoid)
14. [§14 Best Practices](#14-best-practices)
15. [§15 Coding Patterns](#15-coding-patterns)
16. [§16 Coding Anti-Patterns](#16-coding-anti-patterns)
17. [§17 Responsive Breakpoint Reference](#17-responsive-breakpoint-reference)
18. [§18 Z-Index Layer Map](#18-z-index-layer-map)
19. [§19 Color & Token Reference (Complete)](#19-color--token-reference-complete)
20. [§20 The Complete TypeScript Interface Reference](#20-the-complete-typescript-interface-reference)
21. [Appendix A — The Meticulous Approach (six-phase workflow)](#appendix-a--the-meticulous-approach-six-phase-workflow)
22. [Appendix B — Quick Reference Card](#appendix-b--quick-reference-card)

---

## §1 Project Identity & Design Philosophy

**One sentence.** Digma is a Figma-like collaborative design workspace — a production-ready clone of `https://digma-371dfd0d.base44.app/` — built as a single Next.js 16 App Router app with a DOM-element canvas editor, an AI assistant, team management, and cookie-session auth, seeded with a demo workspace (`demo@digma.app` / `Digma1234!`).

**Design thesis.** "Reference-parity with a conscience": the UI is measured clone-for-clone from the live app (exact Tailwind classes extracted from its DOM; colors sampled; layout geometry reproduced), but every live-app BUG is deliberately fixed rather than replicated — most famously the missing mobile navigation (Tailwind v4 failure class A) and the unknown-projectId editor that silently corrupts the most-recent project's data.

**Non-negotiable rules.**

- The reference app is the visual spec; the live app's *dead* buttons (Share, Present, Explore Templates are no-ops there) ship WORKING here — every deviation is a superset, never a regression, and every deviation is documented in the PAD's Known Issues.
- The mobile navigation is a FIX, not parity: the reference has NO nav below `md` (`hidden md:flex`, no fallback). This clone's hamburger + Sheet drawer is the canonical example of the fix pattern (§15).
- Light workspace chrome on white; dark GitHub-style editor chrome (`#0d1117` family); purple `#8b5cf6` brand accent. No other accent hues.

**Anti-generic mandate.** No Bootstrap-style components, no default shadcn theming without the measured token overrides, no legacy `tailwind.config.js` (the #1 "flat/minimal look" bug in Tailwind v4), no `var()` chains inside a plain `@theme` block (dropped by the current v4 build — literal hex only).

**CTA hierarchy.** Purple gradient hero ("Create New Design" white-on-purple) → per-section primary buttons → ellipsis-menu destructive actions (never global `AlertDialog` confirms).

## §2 Tech Stack & Environment

| Layer | Technology | Version (locked) | Notes |
|---|---|---|---|
| Framework | Next.js (App Router, Turbopack, standalone output) | ≥16.3.6 | Server components for pages; route handlers double as the API |
| UI runtime | React | ≥19.3.0 | `useSyncExternalStore` for cross-chunk stores |
| Language | TypeScript (strict except `noImplicitAny: false`) | ≥5.9.3 | `bun run typecheck` is the type gate (build has `ignoreBuildErrors`) |
| Styling | Tailwind CSS (CSS-first) | ≥4.3.3 | NO `tailwind.config.js`; `@theme` in `globals.css` |
| Animation | tw-animate-css | ≥1.4.0 | CSS import, not a JS plugin |
| Primitives | shadcn/ui on Radix | Radix ^1.x per package.json | dialog, dropdown-menu, sheet, tabs, toaster (custom), button, input, label, textarea |
| Client state | Zustand | ≥5.0.15 | ONE editor store |
| ORM / DB | Prisma / SQLite | ≥6.19.3 / file | `db-path.ts` anchor resolution; `DIGMA_REPO_ROOT` env override |
| AI | z-ai-web-dev-sdk | ≥0.0.18 | Server-side only; deterministic fallback |
| Unit tests | Vitest | ≥5.0.1 | 62 checks; `*.test.ts` only |
| E2E tests | Playwright | ≥1.63.0 | 44 checks; standalone server on :3100 with its own `db/e2e.db` |
| Lint | ESLint + eslint-config-next | ≥9.39.5 | React 19 hook rules are errors |
| Runtime | Bun | ≥1.4.x | Dev + prod server; scripts in `package.json` |

**Environment variables (complete — matches `.env.example` exactly):**

| Variable | Required | Read by | Purpose |
|---|---|---|---|
| `DATABASE_URL` | yes | `src/lib/db.ts` via `db-path.ts` | SQLite URL; relative `file:../db/custom.db` resolves against `prisma/` |
| `AUTH_SECRET` | prod | `src/lib/auth.ts` | HMAC key for session tokens (insecure dev-only fallback when unset). NOT "SESSION_SECRET" — that was a doc drift, fixed |
| `DIGMA_REPO_ROOT` | no | `src/lib/db-path.ts` | Explicit repo-root anchor (container escape hatch); blank adds nothing |

**Commands (from `package.json`):**

```bash
bun install && cp .env.example .env && bun run db:push && bun run db:seed && bun run dev
bun run lint && bun run typecheck && bun run test        # fast gates
bun run build && ./scripts/smoke-test.sh && bun run test:e2e   # full gates
```

## §3 Bootstrapping & Configuration

**Configuration files and what they lock in:**

| File | What it configures |
|---|---|
| `next.config.ts` | `output: "standalone"`, `outputFileTracingRoot` pinned to the repo (ADR-007: prevents nested standalone paths when a parent lockfile exists), images remotePatterns (unsplash), `typescript.ignoreBuildErrors` (typecheck is the manual gate) |
| `postcss.config.mjs` | `@tailwindcss/postcss` v4 — CSS-first pipeline |
| `tsconfig.json` | strict TS (except `noImplicitAny: false`), `@/*` → `src/*`, **excludes `skills/`** |
| `eslint.config.mjs` | next/core-web-vitals + next/typescript; **ignores `skills/`** (the operator's skill catalog is not app code) |
| `vitest.config.ts` | includes `src/**/*.test.ts` + `tests/**/*.test.ts` only — skills/ never tested |
| `playwright.config.ts` | testDir `./tests/e2e`; :3100; own DB; setup project saves the session cookie once (rate-limiter friendly) |
| `src/middleware.ts` | Legacy lowercase → Capital 307 redirects (ADR-008) — see §9 #6 for why this lives in middleware and NOT next.config |

**First-run flow:** `bun install` → `cp .env.example .env` → `bun run db:push` (creates `db/custom.db`) → `bun run db:seed` (demo user, 2 projects — 6 elements on the Marketing Hero Banner — 1 team, 3 members) → `bun run dev` (:3000). Login `demo@digma.app` / `Digma1234!`.

**The environment trap (bit us twice):** a parent workspace `.env` or an exported shell `DATABASE_URL` shadows the repo's relative URL with an absolute path to a missing file — symptom `Error code 14: Unable to open the database file`. Diagnostic: the `[db] DATABASE_URL -> …` startup log line. Fix: `unset DATABASE_URL` before `bun run dev`, and never keep a parent `.env` above the repo.

## §4 The Design System (Code-First, Tailwind v4)

All tokens live in ONE plain `@theme` block in `src/app/globals.css` — LITERAL hex values (the v4 build drops `var()` chains in a plain `@theme`; only `--font-sans` may use `var(--font-inter)`).

**Workspace palette (light):** background `#ffffff`, foreground `#0f172a` (slate-900), primary `#8b5cf6` (brand purple), secondary `#f3e8ff`/`#5b21b6`, muted `#f9fafb`/`#6b7280`, accent `#f3f4f6`, destructive `#ef4444`, border/input `#e5e7eb`, ring `#8b5cf6`.

**Editor palette (GitHub-dark, measured from the reference DOM):** editor-bg `#0d1117`, editor-panel `#161b22`, editor-border `#30363d`, editor-text `#e6edf3`. Use the `bg-editor-bg`-style utilities (`--color-editor-*` tokens) — never re-type the hex.

**Editor chrome geometry (measured):** top bar `h-12` `border-b border-[#30363d] bg-[#161b22]`; toolbar icon rail `w-12`; zoom cluster = SEPARATE chips at `absolute left-4 top-4` — a `100%` display chip (`px-3 py-1 text-sm`), then zoom-in and zoom-out icon chips (`p-2`, lucide icons), `gap-2`; NO merged cluster, NO "Fit" button (reset stays on Ctrl/Cmd+0). Top-bar avatars: user initial on `#3B82F6` + second chip "S" on `#10B981`, `h-8 w-8` `rounded-full border-2 border-white`, `-space-x-2` overlap, Users-icon count "2".

**Motion:** `tw-animate-css` supplies Radix enter/exit classes; a global `prefers-reduced-motion: reduce` block collapses all durations to 0.01ms. The dashboard hero gradient is STATIC CSS (measured — the reference is static too).

**Focus:** global `:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 2px; }` — never remove it; WCAG-visible focus is load-bearing for the mobile-nav e2e suite.

## §5 Component Architecture & Patterns

**Counts:** 23 component files under `src/components/` (19 marked `"use client"`; the pages stay server components). 5-layer model (details in PAD §3.1): Persistence → pure domain (`src/lib`) → API routes → server pages → client views. Dependencies point downward only.

**Route map (v1.1.0, ADR-008):** `/` and `/Dashboard` (same view — the reference's links point at the capitalized one), `/login` (lowercase, like the reference), `/Recent`, `/Teams`, `/Editor?projectId=` (unknown/missing id → Untitled mode, ADR-009). Legacy lowercase `/recent|/teams|/editor|/dashboard` 307 via `src/middleware.ts`.

**Component inventory (the ones you will actually touch):**

| Component | File | Notes |
|---|---|---|
| AppHeader + MobileNav | `src/components/app-header.tsx` | Desktop nav `hidden md:flex` + the Sheet drawer fix; `isNavActive()` treats `/` and `/Dashboard` as one destination |
| DashboardView | `src/components/dashboard-view.tsx` | Gradient hero, Quick Stats glass card, Continue Working, All Projects grid, create-dialog wiring |
| ProjectCard (+ Create dialog) | `src/components/project-card.tsx` | Thumbnail art, ellipsis menu (rename/delete) with `stopPropagation`, the measured Create New Design File dialog |
| RecentView | `src/components/recent-view.tsx` | Sort combobox (Last Opened/Last Modified/Date Created/Name), list/grid toggle, "N files found" |
| TeamsView | `src/components/teams-view.tsx` | Team cards, member chips, invite dialog, inline confirm deletes |
| LoginScreen | `src/components/login-screen.tsx` | Three-state auth card (ADR-013): branded sign-in (logo + social); minimal sign-up (back-link, Confirm Password + inline mismatch validation, no Name field); minimal forgot (email-only) |
| EditorView | `src/components/editor/editor-view.tsx` | Shell + top bar + zoom cluster + autosave hook + Untitled-mode load + Present overlay + the panel-toggle chips (ADR-010) |
| editor-store | `src/components/editor/editor-store.ts` | THE Zustand store (§6) — incl. `selectAll()` |
| Canvas | `src/components/editor/canvas.tsx` | `role="application" aria-label="Design canvas"`; pointer draw/move/resize/select; wheel pan + ctrl-zoom |
| Toolbar | `src/components/editor/toolbar.tsx` | 8 tools; buttons carry `title="{Tool} ({shortcut})"` |
| LayersPanel | `src/components/editor/layers-panel.tsx` | Visibility/lock/reorder/rename; Select All ↔ Deselect All header toggle (`selected === layers ? Deselect : Select`, incl. the 0/0 quirk) |
| ComponentsPanel | `src/components/editor/components-panel.tsx` | The reference's second w-60 column (ADR-010): header + blue "+" + "No components yet" empty state; presentational (scope cut) |
| PropertiesPanel | `src/components/editor/properties-panel.tsx` | The reference's five-section layout (ADR-011): Position & Size, Corner Radius (slider + linked per-corner), Fill & Stroke (Solid/Gradient/Image pills + swatch/hex), Transform (rotation slider + number input, per-element Scale 0.1–3.0x persisted — ADR-012), Opacity; Canvas Properties → Background Color row when nothing selected |
| AiAssistant | `src/components/editor/ai-assistant.tsx` | Chat UI; "Working on it..." while sending; applies `{reply, operations[]}` |

**React 19 rules that bit us (all fixed with sanctioned patterns):**
1. NEVER `setState` synchronously in an effect body — `react-hooks/set-state-in-effect` is an ERROR. Use render-time state adjustment (compare + store prev in state) or an `async` function inside the effect (async continuations are exempt). See `properties-panel.tsx` and `editor-view.tsx` load effect.
2. NEVER `useState`/`useEffect` for external stores — `useSyncExternalStore` (see the toast store §9 #4).
3. Login success uses `router.push(fromUrl)` + `router.refresh()` — `window.location` assignments break the server-component user swap.

## §6 State Management Deep Dive (the ONE Zustand store)

`src/components/editor/editor-store.ts` (306 lines) owns ALL editor state: `projectId`, `projectName`, `backgroundColor`, `elements[]`, `selectedIds[]`, `tool`, `zoom/panX/panY`, `saveState`, `past[]/future[]` undo snapshots. Views and panels READ the store and CALL actions; nothing else owns canvas state.

**The replace contract (ADR-005).** Elements are client-sovereign rows: local ids (`local-…`) are created optimistically by `addElements`; the autosave debounces 800ms and `PUT`s the FULL element list to `/api/projects/[id]/elements`; the handler transactionally `deleteMany` + `createMany` (array order = `sortOrder` = z-draw order) and returns fresh server ids; the store remaps ids by index so selection survives. NEVER add per-element PATCH autosave — partial-failure complexity for zero user-visible gain, and it breaks undo/redo and AI batch operations.

**Untitled mode (ADR-009).** `loadProject(UNTITLED_PROJECT)` runs with `id: ""`. The autosave's `ensureProject()` seam is the ONLY place that materializes the project: `POST /api/projects` (name "Untitled", template blank) → `store.attachProject(id)` → `window.history.replaceState` adopts `/Editor?projectId=<id>`. Deviation note: the live app's unknown-id editor silently saves into the MOST-RECENT project (observed: a rectangle drawn at `projectId=test` landed in "Test Project One") — a data bug this clone deliberately does not copy.

**Undo/redo:** snapshots (elements + backgroundColor only, capped at 60) pushed by mutating actions; `commit()` after gesture end. Toolbar Undo/Redo disable via `past.length`/`future.length`.

**Autosave lifecycle:** `saveState ∈ saved | saving | unsaved`; the badge shows Saved (green `bg-green-500`) / Saving… (amber) / Unsaved (gray). `exit()` flushes only when a real `store.projectId` exists.

## §7 The AI Assistant Pipeline (degrade-not-fail)

Contract: `POST /api/ai-assistant { message, elements? }` → `{ ok, data: { reply, operations[] } }`. ALWAYS responds — even when the SDK is down.

```
client chat → POST /api/ai-assistant
                 ├─ try z-ai-web-dev-sdk (server-side only)
                 │    → sanitizeLlmOperations (src/lib/ai-assistant.ts:
                 │      type whitelist, enum membership, hex check,
                 │      numeric clamps, scale limits) → throws on invalid
                 └─ catch → parseFallbackCommand (deterministic keyword
                            parser: "add N colored circles", "make … red",
                            "delete selected", "create a login form", …)
both paths → same { reply, operations } envelope
client applies operations: add | update (may carry scale) | delete
```

**Rules.** The LLM is UNTRUSTED input — the sanitizer is the security boundary (never apply raw LLM JSON to the canvas). The fallback fails INERT (unknown phrasing → a help reply, never a wrong action). UI parity: greeting + timestamp, `placeholder="Create a blue button, make it bigger, delete selected..."`, "Working on it..." while sending, `Try: "Add 3 colored circles", …` examples line.

## §8 Auth & Security Implementation

**Hand-rolled (ADR-003), ~101 lines in `src/lib/auth.ts`:** scrypt password hashes (N=16384, salt:hash format, constant-time compare) + HMAC-SHA256 stateless tokens `userId.expiry.signature` in an httpOnly `digma_session` cookie (7-day TTL, `secure` in production). `getSessionUser()` verifies signature + expiry + user existence on every request.

**Gates:** every page calls `getSessionUser()` + `redirect("/login?from_url=…")`; every data route's first statement is `requireSession()` → 401 envelope. Only `/api/health` and `/api/auth/*` are public.

**Rate limiting:** fixed-window in-process, 10 attempts/IP/15 min → `429 RATE_LIMITED` + `Retry-After` (`src/lib/rate-limit.ts`). Per-process only (restart clears it; N instances track separately — accepted, documented).

**Validation:** hand-rolled in `src/lib/validation.ts` + per-route clamps — trim, length caps, enum membership, hex regex, numeric clamps (opacity 0–1, fontSize ceiling 32). NO schema library; do not introduce Zod halfway.

**Security rules S1–S9 and the threat model live in PAD §6.** Highlights: React escapes canvas text by default (no `dangerouslySetInnerHTML` anywhere); Prisma parameterized queries only; same-site cookies + JSON-only APIs (CSRF); the LLM sanitizer (S7).

## §9 Anti-Patterns & Common Bugs

1. **Tailwind v4 legacy config.** ANY `tailwind.config.js` reintroduction = the "flat/minimal look" bug. Tokens are literal hex in the plain `@theme` in `globals.css`.
2. **`var()` chains inside a plain `@theme`.** Dropped by the current v4 build. Literal hex only; only `--font-*` may use `var()`.
3. **Module-level singletons for client state (Turbopack).** Code-splitting hands two copies to different chunks — the Toaster never sees page-fired toasts. Fix: `globalThis.__digmaToastInfra` (state AND listener set) + `useSyncExternalStore` (§15 Pattern 2).
4. **Radix Toast controlled-`open` list.** Never mounted reliably in this setup. The Toaster renders plain divs.
5. **Minifier-safe db-path anchors.** Helper functions with unused returns get inlined-and-dropped by the production minifier — the standalone detector silently died in the shipped bundle. Anchors MUST be collected via side-effect `roots.push(...)` (§15 Pattern 1).
6. **next.config `redirects()` for casing changes.** Next 16 matches redirect SOURCES case-insensitively; the per-rule `caseSensitive` flag is NOT honored. A lowercase→Capital rule becomes a self-loop (`ERR_TOO_MANY_REDIRECTS` — observed on /Recent). Casing redirects live in `src/middleware.ts` with an exact-match lookup.
7. **`set-state-in-effect` (React 19).** Effect-body `setState` is a lint ERROR. Sanctioned: render-time adjust or async-in-effect.
8. **`window.location` auth redirects.** Breaks the server-component header swap. Use `router.push` + `router.refresh()`.
9. **Card menu clicks opening the project.** Menu buttons need `stopPropagation` — the card's onClick opens the editor.
10. **Per-element PATCH autosave.** Violates the replace contract (§6); breaks undo and AI batches.
11. **Dead-end error pages for the editor.** Unknown projectId opens Untitled mode (ADR-009) — never "Project not found".
12. **Env shadowing.** Parent `.env` / exported `DATABASE_URL` breaks SQLite resolution (§3 trap).
13. **`AlertDialog` global confirms.** Deletes confirm inline (team cards swap to "Yes, Delete / Cancel"; projects use the ellipsis menu's confirm step).
14. **Justified list items / sentence-splitting line breaks.** Lists are left-aligned; one item per line.
15. **Testing `skills/`.** The skills catalog is excluded from lint, compile, and every test config — keep it that way.
16. **Modeling the reference's panel chips as exclusive tabs.** The bottom-left `Layers | Components | Properties` chips are INDEPENDENT visibility toggles (Components ADDS a second w-60 column beside Layers; Properties removes the right w-72 panel; default ON/OFF/ON) — verified by replaying clicks against the live DOM. Exclusive Radix Tabs are the wrong semantics (ADR-010). Chip state: `bg-blue-600 text-white` = on.
17. **Inventing reference UI that isn't there.** The properties panel's background preset grid was never on the reference (presets live in the Create-Project dialog only) — the reference's Canvas Properties is a single Background Color swatch + hex row. Measure before you build; re-measure before you "fix".
18. **Dead controls below responsive breakpoints.** A toggle whose target is `hidden md:flex` must itself be `hidden md:flex` — chips that flip `aria-pressed` with no visible effect lie about state (fixed: the chip bar is `hidden md:flex`; the Properties chip additionally `hidden lg:inline-block` because its panel is `lg:flex`).
19. **Un-scaled bounds for scaled elements.** A per-element `scale` diverges the model footprint from the visual one — selection rings, marquee containment, fit-to-view, and thumbnails MUST go through one scale-aware seam (`boundsOf()` multiplies width/height by scale). Resize math runs in VISUAL space and divides the delta by scale on write-back (ADR-012).
20. **Trusting the reference's runtime health.** The live app crashes blank-screen on AI submission (`TypeError` reading `charAt`) and ships `cdn.tailwindcss.com` in production. Audit the reference's BEHAVIOR, not just its DOM — and pin your own robustness with a no-crash e2e.
21. **One fixed card layout for multi-state forms.** The reference's auth card RESTRUCTURES per mode: only sign-in renders the branded card (logo + social + divider + h1); sign-up/forgot swap to a minimal shell (back-link + h2, no logo/social). Auditing only the default state hides the divergence — walk EVERY state of a stateful component before declaring parity (ADR-013, pinned by 5 e2e checks in `tests/e2e/auth.spec.ts`).

## §10 Debugging Guide

| Symptom | First check | Root cause / fix |
|---|---|---|
| `Error code 14: Unable to open the database file` | The `[db] DATABASE_URL -> …` startup line | Env shadowing (§3 trap): `unset DATABASE_URL`, remove parent `.env`, restart |
| SQLite opens the WRONG file in production | db-path debug line: which anchor won | Standalone `chdir` trap; verify `candidateRoots()` pushes (§15 Pattern 1); `DIGMA_REPO_ROOT` overrides |
| `ERR_TOO_MANY_REDIRECTS` on a page | Any `redirects()` touching that path's casing | Next 16 case-insensitive source matching (§9 #6) — move to middleware |
| Toast fires but never renders | Two module instances? | Turbopack chunk split (§9 #3) — globalThis infra |
| E2E can't find the mobile-nav trigger | `page.locator('button[aria-controls="mobile-nav-sheet"]')` | Radix marks the app `aria-hidden` while the dialog is open — role locators go blind |
| E2e uses stale build | `pkill -f "standalone/server.js"` then re-run | `reuseExistingServer: true` reuses the old server after a rebuild |
| Dev server picks up old `.next` types after route renames | `rm -rf .next` + restart | Stale route validator types break `tsc` |
| Rate limiter blocks legit e2e logins | The setup project signs in ONCE, saves storageState | Per-test logins trip 10/IP/15min; never login per-test |
| Seeded elements vanish after manual editor testing | Expected | The replace contract: a save with an empty list wipes rows — re-seed (`bun run db:push && bun run db:seed`) |
| Toast appears then "fails" the check | It auto-dismissed (5s) | Assert immediately after the action |
| `page.goto` returns 307 chains | Legacy middleware redirect | Intentional: lowercase → Capital; assert the FINAL URL |

## §11 Pre-Ship Checklist

```bash
bun run lint          # clean — React 19 hook rules are errors
bun run typecheck     # clean — the build will NOT catch types
bun run test          # 62/62
bun run build         # 20 routes; static+public copied into standalone
./scripts/smoke-test.sh   # 28/28 (health, auth gate, CRUD, AI, rate limit, logout)
bun run test:e2e      # 39/39 (auth 6, workspace 9, mobile-nav 9, untitled 3, editor-panels 12)
git status            # no .env, *.key, db/*.db, dev.log, server.log staged
```

**Visual parity spot-checks (browser):** dashboard hero + Quick Stats + Continue Working + All Projects; Recent sort/view toggle; Teams cards; editor top bar (Untitled fallback at `/Editor` with no param), zoom cluster `[100%][+][−]`, avatars D+S+2; login card; **mobile at 390×844: hamburger → drawer → tap navigates AND closes.**

## §12 Lessons Learnt & How to Avoid Them

1. **F1 — Measure the live DOM, don't guess.** Every chrome detail (zoom chip order, avatar colors `#3B82F6`/`#10B981`, the `absolute top-4 left-4 gap-2` cluster) came from `document.querySelector(...).className` evals on the live app. Extract classes, then replicate.
2. **F2 — The live app is the spec, including its bugs — audit before cloning.** The unknown-projectId editor looked like a feature until persistence testing showed saves landing in the WRONG project. Clone the visible behavior, fix the data bug, document the deviation.
3. **F3 — Dead buttons on the reference are scope decisions.** Share/Present/Explore-Templates are no-ops live. Implement working versions (superset) and record it — or you'll "fix" them back to dead in a later pass.
4. **F4 — Route casing is user-visible parity.** `/Editor` vs `/editor` in the address bar is a real difference; Next makes fixing it non-trivial (F-lesson: the middleware discovery in §9 #6).
5. **F5 — TDD the seams.** db-path (unit), Untitled editor (e2e), create dialog — tests-first found the minifier trap and the redirect loop before they shipped.
6. **F6 — Dev data drifts.** Manual editor testing wipes seeded elements (replace contract). Re-seed before screenshots/demos.
7. **F7 — Docs drift the moment code lands.** SESSION_SECRET→AUTH_SECRET, DIGMA_REPO_ROOT documented-before-implemented. The PAD's rule: code wins, doc updated in the same commit.
8. **F8 — The local gate is the only gate.** No hosted CI — the §11 sequence is the whole quality story; never skip typecheck (the build won't catch types).
9. **F9 — Session harvesting beats per-test logins.** Rate-limited auth + e2e = the setup-project + storageState pattern.
10. **F10 — Paramiko shim when ssh is absent.** `docs/how-to-git-push-using-ssh-wrapper_SKILL.md` Appendix A; wrapper verifies the remote ref equals local HEAD after every push.

## §13 Pitfalls to Avoid

- Writing relative SQLite paths and assuming CWD stability (three different anchoring rules: Prisma CLI vs engine vs standalone chdir).
- Reverting `candidateRoots()` to return-value style "for cleanliness" — the minifier eats it.
- Expressing casing redirects in next.config (self-loop).
- Reaching for Radix Toast because "it's the shadcn way" (controlled-open never mounted here).
- A pathname-watching effect to close the mobile drawer — React 19 forbids the pattern AND `SheetClose asChild` already solves it.
- `title` attributes as the ONLY accessible name (agent-browser's role query missed them; Playwright includes them — know your locator semantics per tool).
- Testing against the dev DB with e2e (own `db/e2e.db` on :3100, always).
- Forgetting `useAutosave()` runs in Untitled mode too — every new editor feature must respect an empty `store.projectId` (the `ensureProject` seam is the single choke point).

## §14 Best Practices

- One Zustand store per cohesive domain; external singletons on `globalThis` + `useSyncExternalStore`.
- Full-list transactional replace for canvas persistence; id remap by index after save.
- `ok()/fail()` envelope everywhere; client `call()` unwrapper turns failures into toasts + `null`, never thrown errors into render.
- Server components gate + fetch; client views only render + interact.
- Side-effect-push anchor collection for anything the minifier could DCE.
- Exact-match `Record` lookups in middleware for casing redirects.
- Debounced autosave (800ms) + flush-on-exit when a real project exists.
- Degrade-not-fail AI with the sanitizer as the trust boundary.
- Re-seed after destructive manual testing; e2e DB is disposable by design.
- Keep `skills/` out of every gate (lint ignore, tsconfig exclude, test includes).

## §15 Coding Patterns

**Pattern 1 — Minifier-safe anchor collection (`src/lib/db-path.ts`):**

```typescript
export function candidateRoots(): string[] {
  const roots: string[] = [];
  const envRoot = process.env.DIGMA_REPO_ROOT?.trim();
  if (envRoot) roots.push(envRoot);            // side effect — cannot be DCE'd
  if (cwd.endsWith(path.join(".next", "standalone")) && existsSync(path.join(cwd, "server.js"))) {
    const repo = path.dirname(path.dirname(cwd));
    if (existsSync(path.join(repo, "prisma", "schema.prisma"))) roots.push(repo);
  }
  // ... module-dir anchor, then plain CWD
  roots.push(cwd);
  return [...new Set(roots)];
}
// resolveDatabaseUrl picks the first anchor containing prisma/schema.prisma
// and resolves relative file: URLs against its prisma/ dir (the CLI rule).
```

**Pattern 2 — Cross-chunk external store (`src/hooks/use-toast.ts`):**

```typescript
type Infra = { state: Store; listeners: Set<() => void> };
const infra: Infra = ((globalThis as any).__digmaToastInfra ??= createInfra());
export function useToast() {
  const snapshot = useSyncExternalStore(infra.subscribe, infra.getSnapshot, infra.getSnapshot);
  return { toasts: snapshot.toasts, toast: infra.push };
}
```

**Pattern 3 — Untitled create-on-first-save (`src/components/editor/editor-view.tsx`):**

```typescript
async function ensureProject(): Promise<string | null> {
  const store = useEditorStore.getState();
  if (store.projectId) return store.projectId;        // normal path
  const res = await fetch("/api/projects", { method: "POST", headers: {...},
    body: JSON.stringify({ name: store.projectName || "Untitled",
                           template: "blank", backgroundColor: store.backgroundColor }) });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.ok) return null;
  useEditorStore.getState().attachProject(body.data.project.id);
  window.history.replaceState(null, "", `/Editor?projectId=${body.data.project.id}`);
  return body.data.project.id;                        // flush continues into the PUT
}
```

**Pattern 4 — The MobileNav fix (`src/components/app-header.tsx`):**

```tsx
<nav className="hidden md:flex ...">{NAV_LINKS.map(...)}</nav>   {/* desktop */}
<Sheet>
  <SheetTrigger asChild>
    <button className="md:hidden" aria-label="Navigation menu"
            aria-controls="mobile-nav-sheet">                    {/* Radix adds aria-expanded */}
      <MenuIcon className="size-6" />
    </button>
  </SheetTrigger>
  <SheetContent id="mobile-nav-sheet" side="right" className="w-72 ...">
    {NAV_LINKS.map((l) => (
      <SheetClose asChild key={l.href}>
        <Link href={l.href} className="flex min-h-[44px] items-center ...">{l.label}</Link>
      </SheetClose>                                               {/* tap = navigate AND dismiss */}
    ))}
  </SheetContent>
</Sheet>
```

**Pattern 5 — Casing redirects in middleware (`src/middleware.ts`):**

```typescript
const LEGACY: Record<string, string> = { "/dashboard": "/Dashboard", "/recent": "/Recent",
                                         "/teams": "/Teams", "/editor": "/Editor" };
export function middleware(req: NextRequest) {
  const dest = LEGACY[req.nextUrl.pathname];              // EXACT lookup = case-sensitive
  if (dest) { const url = new URL(dest, req.url);
    req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));
    return NextResponse.redirect(url, 307); }
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard", "/recent", "/teams", "/editor"] };
```

## §16 Coding Anti-Patterns

- `useEffect(() => { setState(...) })` — use render-time adjust or async-in-effect.
- Module-level `const listeners = new Set()` in a client module — Turbopack duplicates it.
- `dangerouslySetInnerHTML` for canvas text — React escaping is the XSS wall.
- `fetch` in a server component — route handlers fetch via Prisma directly.
- Per-element API calls from the canvas — the store batches through the replace contract.
- `useSearchParams` in a server component (suspense boundary + `use client` instead).
- Hardcoded hex in editor chrome when `editor-*` utilities exist.
- Unguarded `fetch().json()` — always `.catch(() => null)` the body parse.
- Props drilling canvas state — the store is the only path.
- `try { ... } catch (e) { /* ignore */ }` around saves — surface a toast; silent data loss is worse.

## §17 Responsive Breakpoint Reference

The app has exactly TWO behavioral breakpoints plus the drawer-specific mobile range:

| Breakpoint | What changes |
|---|---|
| `< md` (768px) | Hamburger appears (`md:hidden`); desktop nav `hidden`; editor layers/components panels hidden and the right properties panel hidden below `lg` — the canvas keeps full width (the reference squeezes all columns instead — a bug not cloned); the panel chips stay visible; hero stacks |
| `≥ md` | Desktop nav; no hamburger EVER (e2e-pinned: "the desktop nav shows the links and never the hamburger") |
| `768px` exactly | Tablet check: nav links visible, no hamburger needed (e2e-pinned) |
| `390×844` | The pinned mobile-nav e2e viewport (drawer, focus trap, scroll lock, 44px targets) |

The mobile suite runs at 390×844 with `page.viewportSize` and `trigger.tap()` (not click) — taps exercise the real touch path.

## §18 Z-Index Layer Map

| Layer | Value | Where |
|---|---|---|
| Editor zoom cluster / canvas overlays | `z-10` | `editor-view.tsx` (top-left cluster) |
| Sheet/Dialog/Dropdown portals | `z-50` | `ui/sheet.tsx`, `ui/dialog.tsx`, `ui/dropdown-menu.tsx`, `app-header.tsx` (sticky header) |
| Presentation overlay | `z-[200]` | `editor-view.tsx` PresentOverlay |
| Toaster | `z-[100]` | `ui/toaster.tsx` — above dialogs, below presentation |

Rule: portal layers stack Radix-default (`z-50`); the Toaster outranks dialogs so save-failure toasts are visible above open dialogs; nothing else invents z values.

## §19 Color & Token Reference (Complete)

The single source is the `@theme` block in `src/app/globals.css` (101 lines). Full table in PAD §5.2. Editor accent colors used on canvas elements (fill defaults): `DEFAULT_FILL` and named colors in `src/lib/editor.ts` — clamped/verified through `src/lib/validation.ts` (hex regex) and `sanitizeLlmOperations` for AI-originated values.

Contrast (measured): foreground `#0f172a` on white ≈ 15.9:1 (AAA); muted-foreground `#6b7280` ≈ 5.9:1 (AA); editor text `#e6edf3` on `#0d1117` ≈ 13.4:1 (AAA). Top-bar avatars: `#3B82F6` (user) + `#10B981` ("S") on white text.

## §20 The Complete TypeScript Interface Reference

Authoritative shapes (see source for the full field lists):

```typescript
// src/lib/editor.ts
export type ElementType = "rectangle" | "ellipse" | "line" | "text" | "frame" | "image" | "path";
export type DesignElementDTO = { id: string; projectId: string; type: ElementType; name: string | null;
  x: number; y: number; width: number; height: number; rotation: number; opacity: number;
  fill: string | null; stroke: string | null; strokeWidth: number; radius: number;
  text: string | null; fontSize: number | null; fontWeight: string | null; textAlign: string | null;
  src: string | null; path: string | null; zIndex: number; visible: boolean; locked: boolean; sortOrder: number;
  createdAt: string; updatedAt: string };
export type ProjectDTO = { id: string; name: string; description: string | null; template: string;
  backgroundColor: string; lastOpenedAt: string; createdAt: string; updatedAt: string;
  elements?: DesignElementDTO[] };

// src/lib/ai-assistant.ts
export type AssistantOperation =
  | { op: "add"; element: Partial<DesignElementDTO> & { type: ElementType } }
  | { op: "update"; ids: string[]; patch: Partial<DesignElementDTO>; scale?: number }
  | { op: "delete"; ids: string[] };
export type AssistantResult = { reply: string; operations: AssistantOperation[] };

// src/lib/api.ts — the envelope
type Envelope<T> = { ok: true; data: T } | { ok: false; error: { code: string; message: string } };

// src/components/editor/editor-store.ts — store actions (subset)
interface EditorStore {
  loadProject(project: ProjectDTO): void;       // resets everything, saveState "saved"
  attachProject(id: string): void;              // Untitled mode: bind the created id, keep elements
  markSaved(elements: DesignElementDTO[], remap: Map<string, string>): void;
  // addElements / updateElements / deleteElements / scaleElements / moveElements /
  // reorderElements / toggleVisibility / toggleLock / setTool / setZoom / setPan /
  // setBackgroundColor / commit / undo / redo …
}
```

Prisma models (5): `User` (email unique, scrypt passwordHash, avatarColor), `Project` (template blank|mobile|desktop|website, backgroundColor, thumbnailSeed, lastOpenedAt), `DesignElement` (projectId FK cascade, sortOrder + zIndex indexed), `Team`, `TeamMember` (teamId FK cascade).

## Appendix A — The Meticulous Approach (six-phase workflow)

1. **ANALYZE** — multi-dimensional requirement mining; measure the live DOM before writing a line of UI.
2. **PLAN** — structured roadmap; map every section of a change to actual files.
3. **VALIDATE** — confirm the plan against the codebase (file paths, line numbers) before executing.
4. **IMPLEMENT** — TDD where a seam exists (unit for pure libs, e2e for flows); modular commits.
5. **VERIFY** — run the FULL §11 gate; visual parity spot-checks in a real browser, desktop AND 390×844.
6. **DELIVER** — update all four docs + this skill in the same commit; push via the SSH wrapper (remote-ref verified).

## Appendix B — Quick Reference Card

| Thing | Where |
|---|---|
| Route folders (capitalized) | `src/app/{Dashboard,Recent,Teams,Editor}/page.tsx` + root `page.tsx` + `login/` |
| Legacy redirects | `src/middleware.ts` |
| THE editor store | `src/components/editor/editor-store.ts` |
| Autosave + Untitled seam | `src/components/editor/editor-view.tsx` (`useAutosave`, `ensureProject`, `UNTITLED_PROJECT`) |
| db-path (chdir trap) | `src/lib/db-path.ts` + `tests/db-path.test.ts` (20 checks) |
| Toast infra | `src/hooks/use-toast.ts` + `src/components/ui/toaster.tsx` |
| Auth | `src/lib/auth.ts` (AUTH_SECRET, `digma_session`) |
| AI pipeline | `src/app/api/ai-assistant/route.ts` + `src/lib/ai-assistant.ts` |
| Mobile-nav fix | `src/components/app-header.tsx` (MobileNav) + `tests/e2e/mobile-navigation.spec.ts` |
| Untitled contract | `tests/e2e/untitled-editor.spec.ts` |
| Panel-toggle chips (ADR-010) | `src/components/editor/editor-view.tsx` (chips bar) + `src/components/editor/components-panel.tsx` + `tests/e2e/editor-panels.spec.ts` |
| Properties five-section layout (ADR-011) | `src/components/editor/properties-panel.tsx` |
| Per-element Scale + transform chain `translate scale rotate` (ADR-012) | `src/lib/editor.ts` (model + bounds), `canvas.tsx` (render + visual-space resize) |
| Smoke suite | `scripts/smoke-test.sh` (28 checks) |
| Design tokens | `src/app/globals.css` `@theme` |
| Push procedure | `docs/ssh_git_wrapper_v3.py` + `docs/how-to-git-push-using-ssh-wrapper_SKILL.md` |
| Demo login | `demo@digma.app` / `Digma1234!` |
| Reference app | `https://digma-371dfd0d.base44.app/` (`sepnetflix2023@outlook.com` / `$Abcd1234`) |
