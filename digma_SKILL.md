---
name: digma
description: "Complete engineering skill for the Digma design-workspace clone (Next.js 16 App Router + React 19 + Tailwind 4 CSS-first + Zustand + Prisma/SQLite). Captures every hard-won lesson from building and parity-remediating the app: the mobile-nav Sheet fix, the standalone-server SQLite chdir trap, the Turbopack singleton-split toast bug, the Next 16 case-insensitive redirect loop, the Untitled-editor create-on-first-save contract, and the full local quality gate."
version: 1.21.0
last_updated: 2026-09-30
project_state: "107 unit checks green · 123 Playwright checks green · 28 smoke checks green · build 20 routes"
---

# Digma — Design-Workspace Clone: Complete Engineering Skill

> **How to use this document:** This is the single-source engineering reference for extending, debugging, onboarding onto, or replicating the Digma codebase. Every claim is verifiable against a file path or a runnable command. When code and this document disagree, the code wins — update the doc in the same commit.
>
> Companion documents: `Project_Architecture_Document.md` (the formal blueprint with ADR-001…013 + ADR-004a), `AGENTS.md` (operator quick-reference), `CLAUDE.md` (agent instructions), `README.md` (user-facing).

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

**Anti-generic mandate.** No Bootstrap-style components, no default shadcn theming without the measured token overrides, no legacy `tailwind.config.js` (the #1 "flat/minimal look" bug in Tailwind v4), no `var()` chains inside a plain `@theme` block (dropped by the current v4 build for colors — and the `--font-*` var() exception was a TRAP: `--font-sans: var(--font-inter), …` computed to guaranteed-invalid at `:root` because next/font scopes `--font-inter` to `<body>`, silently rendering the whole app in the UA serif default for six sessions; literal values everywhere — `tests/theme.test.ts` pins it). The v4 default palette is oklch-tuned and visibly off from the reference's v3 palette — every consumed scale is pinned to the v3 hex in the `@theme` reference-palette block.

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
| Unit tests | Vitest | ≥5.0.1 | 74 checks; `*.test.ts` only |
| E2E tests | Playwright | ≥1.63.0 | 79 checks; standalone server on :3100 with its own `db/e2e.db` |
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
| `src/proxy.ts` | Legacy lowercase → Capital 307 redirects (ADR-008; the Next 16.3 `proxy` convention — migrated from middleware.ts in session 12) — see §9 #6 for why this lives in the proxy and NOT next.config |

**First-run flow:** `bun install` → `cp .env.example .env` → `bun run db:push` (creates `db/custom.db`) → `bun run db:seed` (demo user, 2 projects — 6 elements on the Marketing Hero Banner — 1 team, 3 members) → `bun run dev` (:3000). Login `demo@digma.app` / `Digma1234!`.

**The environment trap (bit us twice):** a parent workspace `.env` or an exported shell `DATABASE_URL` shadows the repo's relative URL with an absolute path to a missing file — symptom `Error code 14: Unable to open the database file`. Diagnostic: the `[db] DATABASE_URL -> …` startup log line. Fix: `unset DATABASE_URL` before `bun run dev`, and never keep a parent `.env` above the repo.

## §4 The Design System (Code-First, Tailwind v4)

All tokens live in ONE plain `@theme` block in `src/app/globals.css` — LITERAL values: hex for colors (the v4 build drops `var()` chains in a plain `@theme`) and font-family NAMES for fonts (`"Inter", "Inter Fallback", ui-sans-serif, …` — never `var(--font-inter)`, which breaks at runtime via custom-property computed-value semantics; ADR-004a). The reference ships the v3 palette, so every consumed default-palette scale is pinned to its v3 hex (v4 blue-600 `#155DFC` ≠ reference `#2563EB`).

**Workspace palette (light):** background `#ffffff`, foreground `#0f172a` (slate-900), primary `#8b5cf6` (brand purple), secondary `#f3e8ff`/`#5b21b6`, muted `#f9fafb`/`#6b7280`, accent `#f3f4f6`, destructive `#ef4444`, border/input `#e5e7eb`, ring `#8b5cf6`.

**Editor palette (GitHub-dark, measured from the reference DOM):** editor-bg `#0d1117`, editor-panel `#161b22`, editor-border `#30363d`, editor-text `#e6edf3`. Use the `bg-editor-bg`-style utilities (`--color-editor-*` tokens) — never re-type the hex.

**Editor chrome geometry (measured):** top bar `h-12` `border-b border-[#30363d] bg-[#161b22]`; toolbar icon rail `w-12`; zoom cluster = SEPARATE chips at `absolute left-4 top-4` — a `100%` display chip (`px-3 py-1 text-sm`), then zoom-in and zoom-out icon chips (`p-2`, lucide icons), `gap-2`; NO merged cluster, NO "Fit" button (reset stays on Ctrl/Cmd+0). Top-bar avatars: user initial on `#3B82F6` + second chip "S" on `#10B981`, `h-8 w-8` `rounded-full border-2 border-white`, `-space-x-2` overlap, Users-icon count "2".

**Motion:** `tw-animate-css` supplies Radix enter/exit classes; a global `prefers-reduced-motion: reduce` block collapses all durations to 0.01ms. The dashboard hero gradient is STATIC CSS (measured — the reference is static too).

**Focus:** global `:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 2px; }` — never remove it; WCAG-visible focus is load-bearing for the mobile-nav e2e suite.

## §5 Component Architecture & Patterns

**Counts:** 23 component files under `src/components/` (19 marked `"use client"`; the pages stay server components). 5-layer model (details in PAD §3.1): Persistence → pure domain (`src/lib`) → API routes → server pages → client views. Dependencies point downward only.

**Route map (v1.1.0, ADR-008):** `/` and `/Dashboard` (same view — the reference's links point at the capitalized one), `/login` (lowercase, like the reference), `/Recent`, `/Teams`, `/Editor?projectId=` (unknown/missing id → Untitled mode, ADR-009). Legacy lowercase `/recent|/teams|/editor|/dashboard` 307 via `src/proxy.ts`.

**Component inventory (the ones you will actually touch):**

| Component | File | Notes |
|---|---|---|
| AppHeader + MobileNav | `src/components/app-header.tsx` | Desktop nav `hidden md:flex` + the Sheet drawer fix; `isNavActive()` treats `/` and `/Dashboard` as one destination |
| DashboardView | `src/components/dashboard-view.tsx` | Gradient hero, Quick Stats glass card, Continue Working, All Projects grid, create-dialog wiring |
| ProjectCard (+ Create dialog) | `src/components/project-card.tsx` | Thumbnail art (incl. the session-29 line SVG diagonal — the same stroke the canvas renders, never a bordered box — and the session-31 frame border WITHOUT the label, RA-19), ellipsis menu (rename/delete) with `stopPropagation`, the session-31 "Delete project?" confirm dialog (Yes, Delete / Cancel — the reference's native-confirm guard in local-dialog chrome), and BOTH card-local dialogs wrapped in a `stopPropagation` div (click + keydown) because React PORTAL events bubble through the React tree (S31-3), the measured Create New Design File dialog |
| RecentView | `src/components/recent-view.tsx` | Sort combobox (Last Opened/Last Modified/Date Created/Name), list/grid toggle, "N files found" |
| TeamsView | `src/components/teams-view.tsx` | Team cards, member chips, invite dialog, inline confirm deletes |
| LoginScreen | `src/components/login-screen.tsx` | Three-state auth card (ADR-013): branded sign-in (logo + social); minimal sign-up (back-link, Confirm Password + inline mismatch validation, no Name field); minimal forgot (email-only) |
| EditorView | `src/components/editor/editor-view.tsx` | Shell + top bar + zoom cluster + autosave hook + Untitled-mode load + Present overlay + the panel-toggle chips (ADR-010) + the keyboard shortcuts — **the wall's KEYBOARD contract (session 25):** the Delete/Backspace handler filters locked ids out of the selection before `deleteElements` (a row-selected locked element survives the key; Select All + Delete removes exactly the unlocked members — mirroring `moveElements`' S23-3 guard). The guard lives in the KEYBOARD handler, NEVER in the shared `deleteElements` store action — the row trash is the explicit per-element action that deliberately deletes locked elements (the reference's measured semantics: its locked rectangle's trash removed it while its keyboard was entirely dead); the AI delete carries the SAME guard at its own seam (session 27) |
| editor-store | `src/components/editor/editor-store.ts` | THE Zustand store (§6) — incl. `selectAll()` |
| Canvas | `src/components/editor/canvas.tsx` | `role="application" aria-label="Design canvas"`; pointer draw/move/resize/select; wheel pan + ctrl-zoom; renders ONLY visible elements (`elements.filter(el => el.visible)` — session 19, the same contract as the hit-test/marquee/present/thumbnails); **the LOCKED pointer wall (session 23)** — the select-tool hit-test finds the TOPMOST VISIBLE element (locked included) and returns early when it is locked: no selection change, no deselect, no drag, NOTHING beneath is selected or displaced (the reference's measured wall — never `pointer-events: none`, which made the lock a window whose drags fell through); locked elements render the reference's `cursor-not-allowed`; a locked single-selection renders the outline but NO resize handles; `moveElements` skips locked ids. **The line/text type contracts (session 29):** a LINE renders as the reference's SVG diagonal (`stroke ?? "#FFFFFF"`, `strokeWidth ∥∥ 2`, round caps, overflow-visible) inside a transparent div — the stroke NEVER paints a box border; TEXT renders `fontFamily ?? "Inter"` + `textAlign` (mapped to justify-content so the alignment is visible). **The frame container contract (session 31, RA-13):** a FRAME renders as the reference’s LABELED CONTAINER — transparent body, 1px #555555 border via the STROKE model fields (`defaultElementFor("frame")` → `fill: null, stroke: "#555555", strokeWidth: 1, radius: 0`, painted by the shared style chain), plus an ALWAYS-ON name-label chip (`-top-5 left-0 text-xs text-gray-300 bg-[#161b22] px-1.5 py-0.5 pointer-events-none whitespace-nowrap`) counter-scaled `scale(1/zoom)` from `transform-origin: left top` — constant screen size at any zoom (a frame-only `zoom` prop on `CanvasElement` preserves memoization for every other type) |
| Toolbar | `src/components/editor/toolbar.tsx` | 8 tools; buttons carry `title="{Tool} ({shortcut})"` |
| LayersPanel | `src/components/editor/layers-panel.tsx` | Visibility/lock/TRASH (session 17: the reference's third hover action — red `text-red-400 hover:bg-red-500/20`, `lucide-trash2 w-3 h-3`, immediate delete, undo-recoverable) /PRECISE drag-reorder (session 21: the insertion index is computed FROM THE DROP EVENT — `remaining = elements minus dragged; targetIndex = remaining.indexOf(target); after ? targetIndex : targetIndex + 1` — stateless, never a `dragOver` state; a lower-half drop inserts directly below the target row, an upper-half drop directly above; the reference's own drag is dead) /rename (session 19: the rename input carries the reference's measured chrome — `h-6 px-2 py-1 text-sm bg-[#0d1117] border-[#30363d] text-white shadow-sm rounded-md`, focus ring only on focus-visible); the eye/lock icons are lucide-react components (session 19: the reference's DOM carries `lucide lucide-eye w-3 h-3`); the lock is OPACITY-based (the same `lucide-lock` icon both states, `opacity-50` unlocked ↔ `opacity-100` locked — the reference's measured semantics, NOT an icon swap); the eye is the working superset over the reference's no-op eye — the canvas honors `visible` (session 19: hidden elements do not render); Select All ↔ Deselect All header toggle (`selected === layers ? Deselect : Select`, incl. the 0/0 quirk) |
| ComponentsPanel | `src/components/editor/components-panel.tsx` | The reference's second w-60 column (ADR-010): header + blue "+" + "No components yet" empty state; presentational (scope cut) |
| PropertiesPanel | `src/components/editor/properties-panel.tsx` | The reference's TYPE-CONDITIONAL section layout (ADR-011, session 29): RECTANGLE keeps the five sections (Position & Size, Corner Radius slider 0–min(w,h)/2 + linked per-corner inputs clamped to the same DYNAMIC max (session 33, RA-29 — cornerRadiusMax() in src/lib/editor.ts; the historical fixed 75 was the 200×150 audit rectangle's own min/2), Fill & Stroke segmented control + swatch/hex + Stroke Width slider 0–20, Transform with rotation + ° suffix + per-element Scale 0.1–3.0x, Opacity); LINE/ELLIPSE hide Corner Radius; TEXT renders the measured four-section layout (Position & Size ∣ TEXT ∣ Transform ∣ Opacity) with Content INPUT ("Type here..." default), Font Size 16, Color picker+hex, the Font Family Select combobox (7 measured options, a new `fontFamily` model field), and segmented lucide Text Align buttons — NO Weight control (the model + rendering keep honoring it); Canvas Properties → Background Color row when nothing selected (the change PERSISTS — session 33: the autosave PUT carries backgroundColor, the elements route writes it in the same transaction; the reference's own control is dead, RA-28). All sliders carry `editor-range` — the reference's Radix look on native inputs (session 15, pinned by `tests/theme.test.ts` + e2e). The NumberField never commits an EMPTY draft (session 21: `Number("") === 0` is the trap — an empty field is mid-edit; a non-empty finite draft commits live; blur restores an abandoned draft); the hex input's accessible name falls back to "Color hex" when the label is omitted (session 21) |
| AiAssistant | `src/components/editor/ai-assistant.tsx` | Chat UI; "Working on it..." while sending; applies `{reply, operations[]}` — **the wall's AI contract (session 27, S27-1):** the `applyOperations` delete branch filters locked ids (the enforcement seam catching BOTH the fallback and LLM operation sources), the request carries `lockedTargetIds`, and the reply footer carries the reference's measured post-send chrome: the honest `text-xs font-semibold` "N action(s) performed" count (operations ACTUALLY applied — a walled no-op renders no footer) + the orange `rotate-ccw` Revert button that WORKS (a pre-apply snapshot restored through the store's `restoreSnapshot` — an undoable mutation; the footer settles away on revert) |

**React 19 rules that bit us (all fixed with sanctioned patterns):**
1. NEVER `setState` synchronously in an effect body — `react-hooks/set-state-in-effect` is an ERROR. Use render-time state adjustment (compare + store prev in state) or an `async` function inside the effect (async continuations are exempt). See `properties-panel.tsx` and `editor-view.tsx` load effect.
2. NEVER `useState`/`useEffect` for external stores — `useSyncExternalStore` (see the toast store §9 #4).
3. Login success uses `router.push(fromUrl)` + `router.refresh()` — `window.location` assignments break the server-component user swap.

## §6 State Management Deep Dive (the ONE Zustand store)

`src/components/editor/editor-store.ts` (346 lines) owns ALL editor state: `projectId`, `projectName`, `backgroundColor`, `elements[]`, `selectedIds[]`, `tool`, `zoom/panX/panY`, `saveState`, `past[]/future[]` undo snapshots (plus `restoreSnapshot` — the AI reply's per-message Revert, session 27: an UNDOABLE restore that pushes the current state onto `past` first, so Ctrl+Z undoes the revert itself). Views and panels READ the store and CALL actions; nothing else owns canvas state.

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
2. **`var()` chains inside a plain `@theme`.** Dropped by the current v4 build for colors — and broken at RUNTIME for fonts (next/font scopes `--font-inter` to `<body>`, so `var()` chains compute to guaranteed-invalid at `:root` and the app silently renders serif). Literal hex and literal font names only (ADR-004a; `tests/theme.test.ts` pins it).
3. **Module-level singletons for client state (Turbopack).** Code-splitting hands two copies to different chunks — the Toaster never sees page-fired toasts. Fix: `globalThis.__digmaToastInfra` (state AND listener set) + `useSyncExternalStore` (§15 Pattern 2).
4. **Radix Toast controlled-`open` list.** Never mounted reliably in this setup. The Toaster renders plain divs.
5. **Minifier-safe db-path anchors.** Helper functions with unused returns get inlined-and-dropped by the production minifier — the standalone detector silently died in the shipped bundle. Anchors MUST be collected via side-effect `roots.push(...)` (§15 Pattern 1).
6. **next.config `redirects()` for casing changes.** Next 16 matches redirect SOURCES case-insensitively; the per-rule `caseSensitive` flag is NOT honored. A lowercase→Capital rule becomes a self-loop (`ERR_TOO_MANY_REDIRECTS` — observed on /Recent). Casing redirects live in `src/proxy.ts` with an exact-match lookup.
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
| `ERR_TOO_MANY_REDIRECTS` on a page | Any `redirects()` touching that path's casing | Next 16 case-insensitive source matching (§9 #6) — move to the proxy |
| Toast fires but never renders | Two module instances? | Turbopack chunk split (§9 #3) — globalThis infra |
| E2E can't find the mobile-nav trigger | `page.locator('button[aria-controls="mobile-nav-sheet"]')` | Radix marks the app `aria-hidden` while the dialog is open — role locators go blind |
| E2e uses stale build | `pkill -f "standalone/server.js"` then re-run | `reuseExistingServer: true` reuses the old server after a rebuild |
| Dev server picks up old `.next` types after route renames | `rm -rf .next` + restart | Stale route validator types break `tsc` |
| Rate limiter blocks legit e2e logins | The setup project signs in ONCE, saves storageState | Per-test logins trip 10/IP/15min; never login per-test |
| Seeded elements vanish after manual editor testing | Expected | The replace contract: a save with an empty list wipes rows — re-seed (`bun run db:push && bun run db:seed`) |
| Toast appears then "fails" the check | It auto-dismissed (5s) | Assert immediately after the action |
| `page.goto` returns 307 chains | Legacy proxy redirect | Intentional: lowercase → Capital; assert the FINAL URL |

## §11 Pre-Ship Checklist

```bash
bun run lint          # clean — React 19 hook rules are errors
bun run typecheck     # clean — the build will NOT catch types
bun run test          # 72/72
bun run build         # 20 routes; static+public copied into standalone
./scripts/smoke-test.sh   # 28/28 (health, auth gate, CRUD, AI, rate limit, logout)
bun run test:e2e      # 54/54 (setup 1, auth 11, workspace 9, mobile-nav 9, untitled 3, editor-panels 12, parity 9)
git status            # no .env, *.key, db/*.db, dev.log, server.log staged
```

**Visual parity spot-checks (browser):** dashboard hero + Quick Stats + Continue Working + All Projects; Recent sort/view toggle (bare gap-2 row, near-black active); Teams cards (flat page, blue Create Team); editor top bar (Untitled fallback at `/Editor` with no param), zoom cluster `[100%][zoom-in][zoom-out]`, AI panel (bot avatars, timestamp-below bubbles), avatars D+S+2; login card (no demo hint); **mobile at 390×844: hamburger → drawer → tap navigates AND closes.**

## §12 Lessons Learnt & How to Avoid Them

1. **F1 — Measure the live DOM, don't guess.** Every chrome detail (zoom chip order, avatar colors `#3B82F6`/`#10B981`, the `absolute top-4 left-4 gap-2` cluster) came from `document.querySelector(...).className` evals on the live app. Extract classes, then replicate.
2. **F2 — The live app is the spec, including its bugs — audit before cloning.** The unknown-projectId editor looked like a feature until persistence testing showed saves landing in the WRONG project. Clone the visible behavior, fix the data bug, document the deviation.
3. **F3 — Dead buttons on the reference are scope decisions.** Share/Present/Explore-Templates are no-ops live. Implement working versions (superset) and record it — or you'll "fix" them back to dead in a later pass.
4. **F4 — Route casing is user-visible parity.** `/Editor` vs `/editor` in the address bar is a real difference; Next makes fixing it non-trivial (F-lesson: the redirect-source discovery in §9 #6).
5. **F5 — TDD the seams.** db-path (unit), Untitled editor (e2e), create dialog — tests-first found the minifier trap and the redirect loop before they shipped.
6. **F6 — Dev data drifts.** Manual editor testing wipes seeded elements (replace contract). Re-seed before screenshots/demos.
7. **F7 — Docs drift the moment code lands.** SESSION_SECRET→AUTH_SECRET, DIGMA_REPO_ROOT documented-before-implemented. The PAD's rule: code wins, doc updated in the same commit.
8. **F8 — The local gate is the only gate.** No hosted CI — the §11 sequence is the whole quality story; never skip typecheck (the build won't catch types).
9. **F9 — Session harvesting beats per-test logins.** Rate-limited auth + e2e = the setup-project + storageState pattern.
10. **F10 — Paramiko shim when ssh is absent.** `docs/how-to-git-push-using-ssh-wrapper_SKILL.md` Appendix A; wrapper verifies the remote ref equals local HEAD after every push.
11. **F11 — Measure SPAs POST-HYDRATION.** Session 8 read the reference's nav before client hydration landed (its SSR shell ships bare `<a>` tags) and recorded "no active pill" — the settled reference renders `bg-purple-50 text-purple-700` on the current route. Screenshots taken immediately after navigation can silently record a pre-hydration UI; wait for hydration (or assert via auto-retrying locators) before measuring parity. Session 10 reversed the finding and re-pinned it on two routes.
12. **F12 — A hosted image is still decodable geometry.** The reference's brand mark (a hosted JPEG) looked un-copyable until pixel forensics decoded it: three rows of split-pill D-shapes + a cyan circle on `#0d1017`. Redraw the decoded geometry as inline SVG (no asset file copied), validate by rendering the SVG to canvas and pixel-comparing against the source, and pin the hexes with a source-contract unit test.
13. **F13 — When pinning a parity fact, pin its ROUTE SCOPE too.** Session 10 restored the nav pill (correct) but over-scoped it to `/` — the reference's active check is an EXACT pathname match, so the root renders NO pill. Session 12 measured four settled routes and corrected the scope. A pin that asserts the right styling on the wrong route set is still a wrong pin.
14. **F14 — Characterization pin BEFORE convention migrations.** The middleware→proxy rename (Next 16.3) had been deferred because nothing pinned the redirect contract. Writing the legacy-redirect e2e FIRST (passing against the old middleware), then renaming, keeps the behavior proven through the migration — the migration becomes a no-op for the test suite instead of a leap of faith.
15. **F15 — Re-verify hosted reference assets when URLs change.** The reference re-hosted its logo (old Supabase URL 404s, new `.jpeg` URL, same 651×470 art). Download and pixel-compare the new asset against the recorded decode before assuming the clone's recreation still matches — and before trusting a VLM's small-thumbnail description (it misread the 96×96 chip as "a letter D"; the pixel decode is the ground truth).
16. **F16 — A negative parity claim needs the same re-measurement rigor as a positive one.** Session 8 recorded "the reference's AI panel has no suggestions line" while restructuring the input row — the reference's `Try:` hint line (below the form, inside the `p-3 border-t` wrapper) went unnoticed, the clone's own line was REMOVED, and an e2e pin (`toHaveCount(0)`) locked the wrong fact in for six sessions even though `digma_SKILL.md` §6 kept documenting the line (the code drifted from the project's own reference doc). "The reference has no X" is a claim about absence — prove it like a presence claim: measure the settled DOM, check the reference screenshots, and re-audit "no X" findings on later sessions exactly as you would re-check a positive one. Session 14 reversed it (the reference's DOM + its session-10/12 screenshots + the SKILL doc all carried the line) and re-pinned presence, classes, text, and position.
17. **F17 — Dialogs and panel interiors deserve the same DOM-level audit depth as pages.** Five consecutive page-level audits graded the create-project dialog and the properties panel by their SHELLS (title, fields, buttons present) — and missed seven measurable interior gaps: per-template lucide icons on the template cards (the clone shipped `Plus` ×4), the Check-SVG selected state on the color swatches (the clone shipped a `✓` text glyph), the text-only submit button, the Radix-look sliders (the clone shipped `accent-blue-600` platform thumbs), the radius cap (75 vs the reference's 50), the segmented Fill-mode control (the clone shipped separate blue pills), and the stroke-width slider (the clone shipped a plain number input). Zoom-crop forensics + SVG-path extraction beat full-page VLM reads for small controls — the VLM read the 16px per-card icons as "plus signs" on BOTH apps; the DOM was the ground truth. On the next audit, open every dialog, select an element, and measure the interior rows — not just the page chrome around them.
18. **F18 — A measurement that REVERSES a previously-verified fact needs double-measurement on fresh state before it ships.** Session 16 measured the reference's corner-radius slider ONCE, read `aria-valuemax="50"` (sessions 1–5 had all measured 75 — the reading was the outlier), and shipped 75→50 as a "fix" — a regression dressed as a fix, actively defended by an e2e pin written from the same misread. Session 17 caught it only because the session-16 next-steps directive pointed the next audit back at the panel interior: re-measured TWICE on fresh page loads with freshly drawn elements, `aria-valuemax="75"` both times — the reversal-of-a-reversal shipped as v1.10.0. The rule: when a new reading contradicts N prior sessions, the burden of proof is on the NEW reading — measure again on fresh state, and prefer a live functional check (draw, select, read the DOM) over a single attribute read. Positive parity claims inherit the F16 rigor. (Same session corollary: layer-row hover actions are interactive controls — test what they DO, not just what they look like; the reference's trash button live-deleted its layer.)
19. **F19 — Audit FUNCTIONAL semantics, not just chrome — a control can look complete and do half its job.** Session 19's functional sweep of the layer-row eye/lock found the eye toggle LOOKED finished in the DOM (it swaps the row icon eye ↔ eye-off, and the hit-test/marquee/present/thumbnail layers all honored `visible`) — but the CANVAS still rendered hidden elements: after "Hide layer" the row said hidden and the canvas said visible, an internally inconsistent state that seven chrome-level audits never caught because the icon swap was convincing. The rule: for every interactive control, trace the full data path to its OBSERVABLE consequence (click the eye → does the canvas actually lose the element?), not just the control's own rendered state. The same sweep measured the reference's lock as OPACITY-based (same lucide-lock icon, `opacity-50` ↔ `opacity-100` — a class flip, not an icon swap) and its eye as a NO-OP (the icon never flips, the canvas never changes) — functional sweeps on BOTH apps distinguish "the reference can't do X" (superset territory) from "the clone half-does X" (bug territory).
20. **F20 — State-dependent drop handlers are a two-front bug; compute insertion indices from the EVENT at drop time.** The layers drag-reorder looked working (rows dragged, drops re-ordered something) but was broken three independent ways at once: (a) a per-row wrapper `onDragOver` fired AFTER the row's own handler (DOM bubbling) and OVERWROTE the row's computed index with a crude top/bottom value — every drop silently resolved to list-top or list-bottom, never the precise position (live-verified: a one-position move became a six-position move); (b) the row's index math was INVERTED (an ELEMENT index stored where a DISPLAY position was consumed — a double conversion that is only coincidentally right at the exact middle of the list); (c) the row's `onDrop` read the `dragOver` state from its render closure, so a fast drag (dragover + drop in the same tick) read stale/null state and silently NO-OPED — the exact failure the RED e2e run produced. The fix deleted the state entirely and computes everything from the drop event itself: `remaining = elements minus dragged; targetIndex = remaining.indexOf(target); after ? targetIndex : targetIndex + 1` — stateless, precise, immune to clobbering and staleness. Generalize: any handler that needs "where the pointer is" should read it from the EVENT (clientX/clientY + currentTarget's rect), never from state captured at render time. Corollary (same session): `Number("") === 0` is a commit trap in every controlled number input — an EMPTY field is the user MID-EDIT, never a request for 0; guard the commit (`if (value.trim() === "") return`) and restore the display value on blur (S21-2, live-verified as an element teleporting to x=0 on field-clear).
21. **F21 — A control that "does nothing on X" can do it two ways — WALL or WINDOW — and the difference is data integrity.** The reference's lock is a WALL: its locked canvas element INTERCEPTS the pointer (cursor-not-allowed), the interaction is consumed, and NOTHING beneath is affected (measured live on its stacked rectangles: a drag on a locked-over-unlocked pair moved nothing; a click on a locked element selected nothing and preserved the current selection). The clone had implemented "locked = no canvas change" as a WINDOW: `pointer-events: none` + a hit-test that skips locked elements — the locked element was TRANSPARENT, so drags fell through and DISPLACED the element beneath (live-audited: dragging across the locked Glow teleported the Hero Section frame by the full drag delta — a data-integrity defect dressed as a superset). The fix makes the hit-test TERMINAL on the topmost locked element (locked = hit + early return; nothing under it is touched) and renders the reference's `cursor-not-allowed`. Generalize: when porting a "blocked" interaction from a reference, pin what happens to what's UNDER the blocked control — click through the blocked element onto an element beneath and check whether THAT moves/selects. "The control itself doesn't respond" is only half the contract; the other half is what the interaction corrupts on its way past. Same-session corollaries: a locked single-selection renders NO resize handles (a lock that blocks dragging but offers resizing is incoherent), and the store's `moveElements` skips locked ids (a Select-All multi-drag must not drag the locked members along).
22. **F22 — A reference control being DEAD is not the same as there being no contract.** Session 25's sweep of the keyboard paths found the reference's ENTIRE keyboard layer dead — `Delete` on a row-selected element never removed it (locked or unlocked, verified with the row highlighted and the "1 selected" badge present), arrow-nudge equally dead — so no keyboard parity data exists. The trap is to treat "the reference can't exercise this path" as "the clone is free to do anything here": the clone's WORKING keyboard is superset territory, and a superset must be internally COHERENT — the wall metaphor the reference DID measure (locked = no drag, no resize, no click-through, no ride-along on multi-drags) extends by coherence onto the paths the reference cannot demonstrate. The clone's keyboard Delete had no locked guard: a row-selected locked element was DELETED by the key (live-verified), and Select All + Delete wiped the locked members too — the same S23-3 incoherence in a new seam. The fix filters locked ids in the KEYBOARD handler only, because the same session measured the reference's row-trash DELETING a locked layer (the explicit per-element action ignores the wall — R1): port the blocked-interaction semantics from the measurable paths onto the unmeasurable ones, and pin the explicit-action boundary with its own test so a future "fix" can never over-reach into the shared store action. Test-engineering corollary (same session): a RED e2e failure must never leave the shared test DB mutated — the first RED run's hard `expect` failed with the deletion already flushed by the 800ms-debounced autosave during the 10s assertion-retry window, and the next tests' prerequisites vanished with the deleted element. The CAPTURE-RESTORE-ASSERT pattern (capture the outcome immediately, restore the canvas with Ctrl+Z + the autosave wait BEFORE asserting, then assert on the captured values) keeps every test's exit state clean regardless of pass/fail.
23. **F23 — A LYING reference control still yields outcome data: port outcomes, never claims.** Session 27's sweep of the AI seam re-measured the reference's assistant live and found it answering delete commands with claimed-success theater — "I have deleted Rectangle 2 from the canvas.", "1 action(s) performed", a Revert control — while its canvas NEVER changed (verified post-reply and after reload, locked AND unlocked targets; its add command still hard-crashes the app with the historical `charAt` TypeError). The CLAIM is worthless as parity data; the OUTCOME is not: its locked element SURVIVED the AI's delete, which is a direct measurement of the wall's AI seam — and that outcome (not the lying reply) is what the clone ports: the AI delete filters locked ids, and the clone's replies report the skip honestly (never the reference's false "I have deleted X" over an unchanged canvas). The same session newly measured the reference's post-send reply chrome for the first time (its deletes no longer crash the panel, so the reply DOM finally rendered): the "N action(s) performed" line + the orange rotate-ccw Revert — and the clone ports the chrome honestly (the count reflects operations ACTUALLY applied; a walled no-op renders no footer; the Revert WORKS via a pre-apply snapshot restored as an undoable mutation, because a dead control that lies is its own bug class). Corollary (test engineering): the z-ai SDK is REACHABLE from the standalone e2e server — the LLM path can win, and its free-form replies (and its id emissions) make every AI e2e assertion non-deterministic (observed live: the LLM replied "Deleted selected element" with bogus ids, so the pre-fix locked Glow survived by LLM luck, not by the wall). A reachable-but-non-deterministic dependency needs an explicit deterministic seam for pinned tests — `DIGMA_DISABLE_AI_LLM=1` on the e2e webServer — with the LLM path still covered by its degrade-not-fail contract.

24. **F24 — A dead-looking reference RENDERING path is measured by its DOM CHILDREN, not its computed styles.** Session 29's hunt through the never-audited element-type seams initially read the reference's LINE element as "invisible" — its div showed `background-color: rgba(0,0,0,0)` and border-0 on all four sides, so a freshly drawn line looked like a ghost box (only its selection ring betrayed its existence). Only inspecting the div's CHILD subtree revealed the truth: an `<svg class="overflow-visible" style="pointer-events: stroke">` carrying `<line x1=0 y1=0 x2=W y2=H stroke="#FFFFFF" stroke-width="2" stroke-linecap="round">` — a real, visible diagonal stroke that background/border/computed-style probes cannot see. The rule: before concluding a reference rendering path is dead or invisible, enumerate the element's actual CHILDREN (`innerHTML`) — SVG, canvas, and WebGL content all live below the computed-style horizon. Same-session corollaries: (a) the reference's properties panel renders its sections TYPE-CONDITIONALLY (rectangle: five sections; line and ellipse: no Corner Radius; text: no Fill & Stroke either — a panel layout measured on ONE element type does not generalize to the others); (b) a SHARED style chain leaks type contracts across element types — the clone's border-from-stroke line painted a white box around every line because one shared `if (stroke && strokeWidth) style.border` served every type; a type-specific rendering contract needs its type guard at EVERY consumer (canvas, thumbnail, present overlay); (c) truncated grep windows lie — reading `defaultElementFor` through a 30-line window made the audit report the line defaults as MISSING when they sat three lines below the cut; re-read the COMPLETE function before a code claim enters a remediation plan (the plan was corrected pre-execution, but only because the live draw contradicted the read).

25. **F25 — An inert reference CLASS is measured by its COMPUTED PAINT, not by its presence — and React PORTAL events bubble through the REACT tree, not the DOM tree.** Session 31's frame audit caught two measurement/engineering traps in one pass. (a) The reference's selected elements carry `ring-2 ring-blue-500 ring-offset-1` — classes that LOOK like a painted selection ring — but the inline style ships `box-shadow: none`, which OVERRIDES every class-based box-shadow: the ring never paints, a full-DOM scan found no painted shadow or outline anywhere, and the reference's canvas selection is effectively invisible (its layers row is the only feedback). The F24 rule generalized to computed styles: measure what the browser RENDERS (`getComputedStyle().boxShadow`), not which classes the DOM carries — and when a class and an inline style fight, the inline style wins. The clone's painted inline `0 0 0 2px rgba(59,130,246,0.9)` is the deliberate working superset (the class-based intent, executed). (b) The delete-confirm test failed mysteriously — Cancel clicked, dialog closed, and the page landed in the EDITOR: React propagates PORTAL events (Radix dialogs portal to body) through the REACT component tree, so clicks inside a card-local dialog bubbled straight to the card root's `openProject()` onClick and navigated. The RENAME dialog had the same latent bug all along (live-reproduced: its Cancel navigated too) — invisible because every flow that used it navigated anyway. The fix wraps card-local dialogs in a `stopPropagation` div (click AND keydown). Generalize: any interactive element rendered inside an onClick-wrapped container — even through a portal — needs its event bubble cut at the React seam, and a "Cancel that navigates" symptom is the fingerprint of a leaked portal bubble.

26. **F26 — An attribute reading generalizes only across the element SIZES it was measured on — pin UI clamps as FUNCTIONS of the element, never constants; and a control that works in-session but reverts on reload is the F19 "half-does X" class.** Session 33's functional sweep of the reference's properties controls caught two traps in one pass. (a) The corner-radius slider's `aria-valuemax="75"` had been read across SEVENTEEN sessions and double-measured (F18 discipline!) — and every reading was taken on 200×150-class audit rectangles whose `min(w,h)/2` IS 75. The functional sweep finally selected a small element (46×23) and read `11.68298487339743` — the max is `min(w,h)/2`, a FUNCTION of the selected element. The F18 rule extends: double-measurement is worthless when both measurements sample the same hidden variable (element size); vary the INPUT SPACE (small, large, frame) before pinning a clamp. UI clamps that reference element state must be ported as `cornerRadiusMax(el)`-style helpers feeding the control AND its commit clamp AND its sibling controls (the per-corner inputs) — a constant pin is a latent divergence the moment an element of a different size appears. (b) The clone's Background Color control looked complete: the swatch worked, the canvas painted, the store flipped unsaved, the autosave fired — but the PUT body carried only `{ elements }`, so the change silently reverted on reload. The F19 rule extends past the observable consequence to the observable consequence ACROSS RELOAD: a persistence seam is part of the control's data path, and the cheapest full-path test is set → wait-saved → reload → assert. Corollary (reference-side): its own Background Color control is DEAD (input value changes, nothing paints, nothing persists) — "works in-session, reverts on reload" (the clone's pre-fix bug) and "never worked at all" (the reference) are DIFFERENT contracts, and the clone's working superset must be made honest (persisted) rather than ported back to dead.
27. **F27 — When observation cannot discriminate a formula, READ THE SHIPPED BUNDLE — and re-audit every "unmeasurable" justification once its blocking condition dissolves; and chrome measured at ONE viewport does not generalize: flat vs responsive classes are a parity dimension of their own.** Session 35's audit of the reference's computed contracts (Quick Stats, the greeting) hit the observation wall: both seeded projects were created AND updated AND opened within the 7-day window, so every candidate "Active this week" formula yielded the same rendered number — and the greeting's buckets could not be discriminated without waiting for the clock. The method extended: fetch the reference's shipped JS bundle (`assets/index-*.js`), grep the render-site string ("Active this week"), and read the formula from its own source — `last_accessed || created_date > now−7d`, `D<12 ? morning : D<17 ? afternoon : evening`, `full_name?.split(" ")[0] || "Designer"`, and the header slot's static literal `children:"Designer"` all decoded verbatim. The bundle is the reference's ground truth its DOM only samples; observation discriminates BEHAVIOR, the bundle discriminates INTENT. Corollaries: (a) a STALE JUSTIFICATION is a standing debt — the clone's "Try:" line had been hidden post-send since session 14 on the justification "the reference's post-send DOM is unmeasurable (its assistant crashes)"; session 27 measured its replies rendering (the crash affects only its ADD commands), and session 35's re-audit found the line persists after every send — the clone had been diverging for fifteen sessions behind an excuse whose blocker had already dissolved. When a measurement is blocked, record the blocker, and re-attempt the measurement whenever the blocker's status changes. (b) A formula pinned on data that never exercises its boundary is UNPINNED (the F26 rule generalized from element sizes to TIME: the seed's fixed dates all sat inside the 7-day window; the e2e seed now backdates one project 11 days so the stats pin has its discriminating datum). (c) Responsive classes are parity-relevant BELOW the breakpoint they were measured at: the clone's hero had been "measured" at desktop where `text-3xl sm:text-4xl` computes equal to the reference's flat `text-4xl` — but at 390px the clone rendered 30px vs the reference's 36px, centered vs left, 16px padding vs 24px, full-width stats card vs content-width. Measure COMPUTED styles at EACH viewport tier (mobile 390 / sm 768 / desktop 1440) before declaring chrome parity; "equal at desktop" is not "equal".

28. **F28 — A decoded custom className MERGES onto the component's base classes — decode reads intent, but LIVE-VERIFY the render before pinning; and a page whose controls are ALL dead has no reference BEHAVIOR to port: audit it as chrome-plus-superset territory.** Session 37's Teams-page port misread the reference's Create Team button as shadowless because the bundle's decoded custom className (`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium`) carries no shadow — but that string MERGES onto the reference's shadcn button base, whose default variant renders `shadow`. The e2e pin (written from the decode alone) failed against the clone's own already-correct rendering, and the live re-measure confirmed the reference's button DOES paint the standard shadow token. The F26/F27 rules extend: a className reading (live OR decoded) never covers the whole paint — the component's base/variant classes merge underneath it, so decode BOTH layers (grep the bundle at the component definition, not just the call site) and live-verify the computed style before writing the pin. Decode discriminates INTENT, observation discriminates RENDER; a contract pinned from either alone is half-measured. Corollaries: (a) the RED phase is the pin's own audit — a pin that fails against code you believe is correct means ONE of them is wrong; re-measure the reference before "fixing" the code (the wrong direction would have SHIPPED a divergence in the name of parity). (b) The reference's Teams page rendered its Create Team buttons, per-card ellipsis, and per-card "Manage" ALL with no `onClick` (bundle-decoded: the JSX carries no handler; live-verified: zero dialogs after click) and its card renders NO member list — members exist only as a count. A page in that state has no reference BEHAVIOR to port: its parity surface is the PAGE STRUCTURE and the CARD CHROME (the bordered header band, the flat-px-6 containers, the fixed gradient chip, the footer count row), while every working control in the clone (the Create dialog, Delete confirm, Invite, the member list with role labels) is superset-only territory — document them as supersets, pin the chrome, and never mistake the superset's design choices for parity claims. (c) The exported-shell `DATABASE_URL` trap re-confirmed at a coarser grain: a tool-call shell re-inherits the parent environment every invocation, so an `unset` from a PREVIOUS command does not persist — unset and run in the SAME command, and when a seed/API fails with error code 14, print the resolved URL before anything else (the `bun -e` probe and `env | grep` are the two-second diagnosis).
29. **F29 — A functional sweep must SPACE its interactions (or read the outcome, not the control) — batched synthetic clicks land in ONE React batch and read as "dead/erratic"; and a control whose behavior depends on DATA you don't have needs discriminating probe data, not more clicking.** Session 39's button-by-button sweep of the reference's editor zoom cluster found it stepping CLEANLY (×1.2 in, ÷1.2 out, hard-clamped [10%, 500%]) — reversing five sessions of "zoom erratic/dead" readings whose own notes carried the tell ("five synchronous clicks left the pill unchanged, then an async settle landed a ×1.2-divided step"): the batched `.click()` calls coalesced into one React render and the intermediate states were never painted. The same session's sort-control audit needed TWO probe projects named to DISCRIMINATE ("AAA Alpha Probe" alphabetically-first-but-newest, "ZZZ Sort Probe" alphabetically-last) before the name sort's direction was observable — with the account's single project every order looked identical. The rules: (a) when functionally sweeping a live control, put a wait between interactions (or read the OUTCOME — the canvas transform, the network request — which lands outside the render batch); a control that reads "dead" under batched clicks is only UNTESTED. (b) Before sweeping a sort/filter/order control, ask what data would make each candidate behavior distinguishable, and CREATE that data (then clean it up — intercept the native confirm rather than blind-accepting destructive prompts). (c) Check the NETWORK when a control changes rendered order: the reference's select refetched `?sort=-<field>` for every option — the request log discriminates "server-side and DESCENDING" from "client-side and maybe-ascending" in one read. (d) The zoom-clamp pin math must count from the actual starting value: N clicks from the floor is floor × 1.2^N, not 100 × 1.2^N — the first draft of the pin asserted 500% after 12 clicks from 10% (89%) and the failure was the PIN's arithmetic, not the code (the F28(a) RED-phase-is-the-pin's-audit rule, generalized to exponents).

30. **F30 — A "dead" reference control decoded from a BUNDLE-FRAGMENT is still only half-measured — and Playwright's same-value fill plus a stale "Saved" badge are silent test-side no-op machines.** Session 41's functional sweep of the reference's Fill tabs decisively REVERSED the session-29 decode "the reference's own tabs are no-ops" — the tabs are a FULLY FUNCTIONAL editor (its Gradient tab paints live and persists; its Image tab uploads and paints). The original decode read the tab TRIGGERS' classNames from the bundle but never exercised the tabpanels' CONTROLS — a fragment-level decode proves presence, never behavior; before pinning "dead", click through the control's full data path (open the panel, move the slider, check the paint, RELOAD). The same session caught two test-side silent no-ops: (a) Playwright's `fill()` into a React-controlled input carrying the SAME value fires NO onChange (the value tracker sees no change — the fill "succeeds", nothing commits, no PUT fires); force a real change first (fill a different valid value, then the target). (b) A `waitForSaved` that only asserts the badge's "Saved" text passes on the STALE badge while the 800ms-debounced autosave is still pending — a reload then KILLS the timer (the store has the change; the DB does not); the deterministic wait is the elements PUT RESPONSE (`page.waitForResponse`) followed by the badge settle. Corollary (ops): a running `next dev` holds the prisma client generated AT BOOT — after a schema migration, restart it or every element write 500s with `PrismaClientValidationError` (the e2e server boots fresh and passes, making the dev-only failure look like a phantom divergence).

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

**Pattern 5 — Casing redirects in the proxy (`src/proxy.ts` — the Next 16.3 `proxy` convention; migrated from `middleware.ts` in session 12, characterization pin first):**

```typescript
const LEGACY: Record<string, string> = { "/dashboard": "/Dashboard", "/recent": "/Recent",
                                         "/teams": "/Teams", "/editor": "/Editor" };
export function proxy(req: NextRequest) {
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
| `< md` (768px) | Hamburger appears (`md:hidden`); desktop nav `hidden`; editor layers/components panels hidden and the right properties panel hidden below `lg` — the canvas keeps full width (the reference squeezes all columns instead — a bug not cloned); the panel-chip BAR itself is `hidden md:flex` (chips render only where their panels can); hero stacks |
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

The single source is the `@theme` block in `src/app/globals.css` (162 lines). Full table in PAD §5.2. Editor accent colors used on canvas elements (fill defaults): `DEFAULT_FILL` and named colors in `src/lib/editor.ts` — clamped/verified through `src/lib/validation.ts` (hex regex) and `sanitizeLlmOperations` for AI-originated values.

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
| Legacy redirects | `src/proxy.ts` |
| THE editor store | `src/components/editor/editor-store.ts` |
| Autosave + Untitled seam | `src/components/editor/editor-view.tsx` (`useAutosave`, `ensureProject`, `UNTITLED_PROJECT`) |
| db-path (chdir trap) | `src/lib/db-path.ts` + `tests/db-path.test.ts` (19 checks) |
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
| Reference app | `https://digma-371dfd0d.base44.app/` (operator-supplied credentials — ask the repo owner; never commit them) |
