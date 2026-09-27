---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
---

# Digma

## Core Identity & Purpose

Digma is a collaborative design workspace — a production-ready clone of the reference app at `https://digma-371dfd0d.base44.app/`. It is a single Next.js App Router application with five page routes (`/`, `/Dashboard`, `/login`, `/Recent`, `/Teams`, `/Editor?projectId=` — capitalized for reference parity, with root `/` and lowercase `/login`; legacy lowercase URLs 307-redirect via `src/middleware.ts`), a DOM-element canvas editor with an AI assistant, Prisma/SQLite persistence, and cookie-session auth. It is maintained as a single-developer repo (`main` only) pushed to `git@github.com:nordeim/digma`.

The key technical decisions that shape everything else: Tailwind 4 CSS-first theming (no `tailwind.config.js`), one Zustand store as the single source of truth for editor state, a full-list element replace contract for persistence, and a degrade-not-fail AI assistant. Details: `Project_Architecture_Document.md` (the definitive blueprint), `AGENTS.md` (operator quick-reference), `README.md` (user-facing).

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

Follow this six-phase workflow for all implementation tasks:

1. **ANALYZE** — Deep, multi-dimensional requirement mining. Never make surface-level assumptions. Identify explicit requirements, implicit needs, and potential ambiguities. Explore multiple solution approaches. Perform risk assessment.
2. **PLAN** — Structured execution roadmap with sequential phases. Present plan for explicit user confirmation. Never proceed without validation.
3. **VALIDATE** — Explicit confirmation checkpoint. Obtain explicit user approval before implementation. Address any concerns or modifications.
4. **IMPLEMENT** — Modular, tested, documented builds. Set up proper environment. Implement in logical, testable components. Create documentation alongside code.
5. **VERIFY** — Rigorous QA against success criteria. Execute comprehensive testing. Review for best practices, security, performance. Consider edge cases and accessibility.
6. **DELIVER** — Complete handoff with knowledge transfer. Provide complete solution with instructions. Document challenges and solutions. Suggest improvements and next steps.

### Project-Specific Principles

- **The local gate is the only gate.** There is no hosted CI. Nothing is pushed until `lint → typecheck → test → build → smoke → e2e` is green.
- **Degrade, never fail.** The AI assistant falls back to a deterministic parser; the client `call()` helper turns API failures into toasts + `null`, never thrown errors into render.
- **Server components by default.** Pages fetch and gate server-side; interactivity is isolated in `use client` view components.
- **The clone is the spec.** Visual and behavioral parity with the reference app is the acceptance bar — except the mobile navigation, which the reference app is missing and this clone fixes deliberately.

## Implementation Standards

### General Coding Practices

- **Early Returns**: Prefer early returns over deeply nested conditionals.
- **Composition over Inheritance**: Favor composition patterns.
- **Self-Documenting Code**: Clear naming and structure.
- **Test-Driven Development**: Follow Red-Green-Refactor cycle for pure domain seams (`src/lib/*.test.ts` pin the contracts before wiring UI).

### Language & Framework Guidelines

**TypeScript**

- Strict mode is on EXCEPT `noImplicitAny: false` (sandbox default, kept intentionally). `bun run typecheck` is the type gate — `next.config.ts` sets `ignoreBuildErrors`, so the build will NOT surface type errors.
- Never introduce `any` in new code; prefer `unknown` + narrowing.
- Explicit return types on exported functions in `src/lib/`.

**React 19 / Next.js 16 (App Router)**

- Handle all UI states: loading, error, empty, success. Show loading state ONLY when no data exists yet.
- **Never call `setState` synchronously in an effect body** — the React 19 ESLint rule `react-hooks/set-state-in-effect` flags it. Sanctioned patterns: render-time state adjustment (compare + store prev in state), or an async function inside the effect (async boundaries are exempt).
- **Never use `useState`/`useEffect` for external stores** — use `useSyncExternalStore` (see the toast store).
- Login success uses `router.push(fromUrl)` + `router.refresh()` — never `window.location` assignments (the header/user swap depends on the server re-resolving the session).
- `use client` is explicit on every interactive component; pages stay server components.
- Next Image is not used for canvas art (DOM shapes + CSS gradients instead); metadata lives in `src/app/layout.tsx`.

**Tailwind 4 (CSS-first)**

- There is NO `tailwind.config.js` and there never will be. Tokens are literal hex in a plain `@theme` block in `src/app/globals.css`; animations come from `tw-animate-css` (imported in CSS, not a JS plugin).
- Never use `var()` chains inside a plain `@theme` block — the current v4 build drops them (literal hex only; only `--font-*` may use `var()`). This is the #1 "flat/minimal look" bug.
- Editor chrome uses the `editor-*` utilities (`--color-editor-bg/panel/border/text`), not raw hex.
- No safelists (unsupported in v4); `@source inline()` if ever needed.

**Validation**

- Hand-rolled in route handlers + `src/lib/validation.ts` (trim, length caps, enum membership, hex checks, numeric clamps). No schema library — do not introduce Zod halfway.

## Development Workflow

### Environment Setup

```bash
bun install
cp .env.example .env
bun run db:push
bun run db:seed
bun run dev
```

Demo login: `demo@digma.app` / `Digma1234!`. Dev server: http://localhost:3000.

### Build Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Start development server (:3000, logs to `dev.log`) |
| `bun run build` | Production build (+ copies static/public into standalone) |
| `bun run start` | Production standalone server (`.next/standalone/server.js`) |
| `bun run test` | Unit tests (62 checks, Vitest) |
| `bun run test:e2e` | Browser E2E (44 Playwright checks; needs a build; boots :3100 with its own `db/e2e.db`) |
| `bun run lint` | ESLint 9 + next config |
| `bun run typecheck` | `tsc --noEmit` |
| `bunx prisma generate` | Prisma client after schema change |
| `bun run db:push` / `db:seed` | Recreate DB / seed demo workspace |
| `./scripts/smoke-test.sh` | 28-check HTTP smoke suite against standalone server |

**Gate order before every push:** `bun run lint` → `bun run typecheck` → `bun run test` → `bun run build` → `./scripts/smoke-test.sh` → `bun run test:e2e`.

## Testing Strategy

### Test Pyramid

- **Unit Tests** (Vitest, 62 checks): pure domain seams in `src/lib/*.test.ts` + `tests/db-path.test.ts` — editor geometry/clamps (incl. the scale-aware visual bounds + transform chain), AI assistant parsing/sanitization, greeting time buckets, rate limiter, team stats, db-path resolution contract (incl. the `DIGMA_REPO_ROOT` anchor).
- **Smoke Tests** (28 checks, `scripts/smoke-test.sh`): HTTP-level — every route, auth gating, login/logout, CRUD, health, stats. Run it with the dev server STOPPED (the script only kills standalone/`next start` processes; a lingering `next dev` steals :3000).
- **E2E Tests** (Playwright, 44 checks): critical user journeys — login/logout/validation, the auth-card state structure suite (sign-up swaps to the reference's minimal card: "Back to sign in" + h2, no logo/social; Confirm Password with inline mismatch validation; forgot renders "Reset your password" + email-only), dashboard→editor→draw→autosave→AI assistant (incl. the no-crash pin: the reference app itself blanks out on AI submission — this clone must answer, mutate the canvas, and stay interactive), project create/rename/delete, teams, the mobile-navigation regression suite pinned at 390×844, the Untitled-editor contract (unknown/missing projectId → working editor, create-on-first-save, URL adoption), and the editor-panels suite (chip toggles incl. their responsive visibility — hidden below md, Properties chip below lg — Select All flip, the five properties sections, and the Transform scale contract: slider 0.1–3.0, "1.0x" readout, persisted transform chain).

### Test Commands

```bash
bun run test           # unit (fast, no server needed)
./scripts/smoke-test.sh  # after `bun run build`
bun run test:e2e       # after `bun run build`; standalone server on :3100
```

## Code Quality Standards

### Linting & Formatting

```bash
bun run lint
```

ESLint 9 with `eslint-config-next`; `skills/` and build output dirs are ignored (don't remove those ignores). React 19 hook rules are enforced — treat every `set-state-in-effect` finding as a real bug, not a warning to suppress.

## Git & Version Control

### Branching Strategy

- `main` only — no feature branches. Atomic commits (one logical change per commit).

### Commit Standards

- Conventional Commits with emoji prefixes: `:art: feat: …`, `:memo: docs: …`, `:bug: fix: …`.
- Never commit `.env`, `*.key`, `db/*.db`, `node_modules/`, `dev.log`/`server.log` (all gitignored).
- Push through the SSH wrapper from the repo root: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo> --remote git@github.com:nordeim/digma.git` — runbook: `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Error Handling & Debugging

### Error Handling Approach

- API routes build responses with `ok()`/`fail()` from `src/lib/api.ts` — envelope is `{ ok, data } | { ok, error: { code, message } }`. Client views unwrap through the `call()` helper (failures → destructive toast + `null`, never a thrown error into render).
- The AI assistant degrades, never fails: LLM down / malformed output / rejected sanitization → deterministic fallback parser. Both paths speak the same `{ reply, operations[] }` contract.
- Anticipate potential failures; user-facing messages are human copy (toast titles + descriptions), not raw error strings.

### Debugging Tools

- Dev server logs: `dev.log` (tee'd). The `[db] DATABASE_URL -> …` startup line is the first thing to check for SQLite path issues.
- **Environment trap:** a parent workspace `.env` or an exported shell `DATABASE_URL` silently overrides the repo's relative SQLite URL — symptom: `Error code 14: Unable to open the database file`. Unset the var or delete the stale parent `.env`, then restart.
- E2E traces: `test-results/` (Playwright artifacts); `page.locator('button[aria-controls="mobile-nav-sheet"]')` is the stable mobile-nav locator (Radix marks the app `aria-hidden` while the sheet is open, so role-based locators can't see the trigger).

## Communication & Documentation

- Explain "why", not just "what" — the PAD records rationale for every consequential decision; commit messages carry the reason.
- Document assumptions and constraints where they're enforced (e.g. the element-replace contract is documented in the store and pinned by e2e, not in a wiki).
- Four-document set: `README.md` (users), `AGENTS.md` (operator quick-reference), `CLAUDE.md` (this file — agent instructions), `Project_Architecture_Document.md` (definitive blueprint).

## Project-Specific Standards

### Architecture

- **Session-gated pages.** Every `page.tsx` calls `getSessionUser()` and `redirect("/login?from_url=…")`; client views never gate themselves. All API reads/mutations call `requireSession()` first (401 envelope otherwise). Only `/api/health` and `/api/auth/*` are public.
- **Editor state lives in ONE Zustand store** (`src/components/editor/editor-store.ts`) — elements, selection, tool, zoom/pan, save flag, undo/redo snapshots. Views and panels read the store and call actions; nothing else owns canvas state. **Unknown/missing `?projectId` opens the "Untitled" editor** (`UNTITLED_PROJECT` in `editor-view.tsx`): the first autosave `POST`s `/api/projects`, binds the id (`attachProject`), and adopts the URL via `history.replaceState` (ADR-009; pinned by `tests/e2e/untitled-editor.spec.ts`).
- **The bottom-left editor chips are independent panel toggles** (ADR-010): Layers / Components / Properties each flip their own panel's visibility (Components renders a second `w-60` column); default ON/OFF/ON; the chips render only where their panels can — bar `hidden md:flex`, Properties chip `hidden lg:inline-block` (dead controls that lie via `aria-pressed` are a bug); pinned by `tests/e2e/editor-panels.spec.ts`. The properties panel follows the reference's five-section layout (Position & Size, Corner Radius with linked per-corner inputs, Fill & Stroke with Solid/Gradient/Image pills, Transform with rotation slider + number input and the persisted per-element Scale 0.1–3.0 rendered as `translate(x,y) scale(s) rotate(r)`, Opacity) plus a fixed header block and a Background Color swatch + hex row when nothing is selected.
- **Elements are client-sovereign rows.** Local ids (`local-…`) are created optimistically; the server transactionally deletes + recreates the full list on every save (order = array order). Don't add per-element PATCH autosave — the replace contract is what makes undo/redo and AI batch operations safe.
- **Toast store is `globalThis`-backed** (`src/hooks/use-toast.ts`): state AND listener set live on `globalThis.__digmaToastInfra` (Turbopack chunk-splitting can hand two copies of a module-level singleton to different client chunks). Consumption uses `useSyncExternalStore`. The Toaster renders plain divs — a Radix Toast controlled-`open` list never mounted reliably.
- **Mobile navigation is a deliberate FIX, not parity.** The reference app ships no mobile nav (desktop nav `hidden md:flex`, no fallback — Tailwind v4 failure class A). This clone adds the hamburger + Sheet drawer (`MobileNav` in `app-header.tsx`): `md:hidden` trigger with stable `aria-label="Navigation menu"`, 44px targets, Radix focus trap/Escape/scroll-lock, links wrapped in `SheetClose`. `tests/e2e/mobile-navigation.spec.ts` pins all of it.
- **Routes are CAPITALIZED** (`/Dashboard`, `/Recent`, `/Teams`, `/Editor?projectId=`; root `/` and `/login` lowercase) — reference parity (ADR-008). Legacy lowercase URLs 307 via `src/middleware.ts`. Never express those redirects in `next.config.ts redirects()` — Next 16 matches redirect sources case-insensitively (per-rule `caseSensitive` is ignored; observed self-loop).

### API Design

- All routes return the `ok()/fail()` envelope. Rate-limited auth routes: 10 attempts/IP/15 min → `429 RATE_LIMITED` + `Retry-After` (per-process only).
- Auth is hand-rolled (`src/lib/auth.ts`): scrypt hashes + HMAC-SHA256 stateless tokens in an httpOnly `digma_session` cookie (7-day TTL; signing key from the `AUTH_SECRET` env).

### Database / Data Layer

- Prisma 6 + SQLite. `src/lib/db.ts` instantiates the client (singleton in dev); `src/lib/db-path.ts` resolves the relative `file:` URL against anchor dirs (first containing `prisma/schema.prisma` wins) because the standalone `server.js` runs `process.chdir()` into `.next/standalone` before any module executes.
- **The anchor detection in `candidateRoots()` must use side-effect `roots.push(...)` — NOT helper return values** — the production minifier inlines-and-drops unused returns, which silently ate the standalone detector (observed and fixed; `tests/db-path.test.ts` pins the contract; don't reintroduce).
- Schema: `User`, `Project`, `DesignElement`, `Team`, `TeamMember`. Element order = `sortOrder` = array order on save.

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | SQLite file URL (relative `file:` resolved by `db-path.ts`) | `file:../db/custom.db` |
| `AUTH_SECRET` | HMAC key for session tokens (`src/lib/auth.ts`; insecure dev-only fallback when unset) | any 32+ char string |
| `DIGMA_REPO_ROOT` | Optional explicit repo-root anchor for db-path resolution (escape hatch for containers) | absolute path |
| `NODE_ENV` | Set by scripts (`production` for `bun run start`) | `production` |

## Success Metrics

You are successful when:

- The full gate (`lint → typecheck → test → build → smoke → e2e`) is green before every push.
- Visual/behavioral parity with the reference app holds (dashboard, recent, teams, editor, login) AND the mobile navigation works (the deliberate improvement).
- No regressions in the pinned contracts: db-path resolution, element replace, AI assistant fallback, toast cross-chunk delivery.

## System Integration

### Available Tools

- **bash**: Execute terminal operations
- **read**: Read files and directories
- **glob**: Find files by pattern
- **edit**: Make exact string replacements
- **write**: Write files to filesystem

## Anti-Patterns to Avoid

- **Over-Engineering**: Don't build for hypothetical needs (no per-element PATCH, no schema library, no hosted CI).
- **Magic Numbers/Strings**: Use named constants (clamps and enums in `src/lib/validation.ts`).
- **`window.location` for auth redirects** — breaks the server-component user swap.
- **Module-level singletons for client state** — Turbopack splits chunks; use `globalThis`.
- **Legacy Tailwind config** — any `tailwind.config.js` reintroduction is a bug.
- **`AlertDialog` global confirms** — deletes confirm inline/dialogs local to the card.
