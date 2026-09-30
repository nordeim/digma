---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
---

# Digma

## Core Identity & Purpose

Digma is a collaborative design workspace — a production-ready clone of the reference app at `https://digma-371dfd0d.base44.app/`. It is a single Next.js App Router application with five page routes (`/`, `/Dashboard`, `/login`, `/Recent`, `/Teams`, `/Editor?projectId=` — capitalized for reference parity, with root `/` and lowercase `/login`; legacy lowercase URLs 307-redirect via `src/proxy.ts` — the Next 16.3 `proxy` convention), a DOM-element canvas editor with an AI assistant, Prisma/SQLite persistence, and cookie-session auth. It is maintained as a single-developer repo (`main` only) pushed to `git@github.com:nordeim/digma`.

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
- Never use `var()` chains inside a plain `@theme` block — the current v4 build drops them for color/space tokens (literal values only), **and the `--font-*` exception was a trap**: `--font-sans: var(--font-inter), …` survives the build but next/font scopes `--font-inter` to a class on `<body>`, so at `:root` the chain computes to guaranteed-invalid and the ENTIRE app silently inherited the UA serif default ("Times New Roman") for six sessions. Fonts are literal names: `"Inter", "Inter Fallback", ui-sans-serif, …` (`tests/theme.test.ts` pins it).
- The default v4 oklch palette renders visibly different from the reference's v3 palette (blue-600 `#155DFC` vs `#2563EB`); every consumed scale is pinned to the v3 hex in the `@theme` reference-palette block.
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
| `bun run test` | Unit tests (83 checks, Vitest) |
| `bun run test:e2e` | Browser E2E (93 Playwright checks; needs a build; boots :3100 with its own `db/e2e.db` and `DIGMA_DISABLE_AI_LLM=1` — the deterministic AI seam) |
| `bun run lint` | ESLint 9 + next config |
| `bun run typecheck` | `tsc --noEmit` |
| `bunx prisma generate` | Prisma client after schema change |
| `bun run db:push` / `db:seed` | Recreate DB / seed demo workspace |
| `./scripts/smoke-test.sh` | 28-check HTTP smoke suite against standalone server |

**Gate order before every push:** `bun run lint` → `bun run typecheck` → `bun run test` → `bun run build` → `./scripts/smoke-test.sh` → `bun run test:e2e` (83 unit / 93 e2e).

## Testing Strategy

### Test Pyramid

- **Unit Tests** (Vitest, 83 checks): pure domain seams in `src/lib/*.test.ts` + `tests/db-path.test.ts` + `tests/theme.test.ts` (the `@theme` contract: literal font names, no var() chains, no legacy config — plus the editor-slider CSS contract: the `.editor-range` Radix-look rules and no `accent-blue-600` on panel sliders) + `tests/brand-mark.test.ts` (the brand-mark source contract) + `src/lib/validation.test.ts` (the `clampFontFamily` enum — session 29) — editor geometry/clamps (incl. the scale-aware visual bounds + transform chain + the session-29 line-border contract: a line's stroke never paints a box border + the text font chain `fontFamily ?? "Inter"` + the session-31 frame container-defaults pin: `fill: null, stroke: "#555555", strokeWidth: 1, radius: 0` and the shared-style-chain border), AI assistant parsing/sanitization (incl. the session-27 locked-aware delete), greeting time buckets, rate limiter, team stats, db-path resolution contract (incl. the `DIGMA_REPO_ROOT` anchor), and the element-defaults pins (the text contract: content "Type here...", fontSize 16, fontFamily "Inter" — session 29).
- **Smoke Tests** (28 checks, `scripts/smoke-test.sh`): HTTP-level — every route, auth gating, login/logout, CRUD, health, stats. Run it with the dev server STOPPED (the script only kills standalone/`next start` processes; a lingering `next dev` steals :3000).
- **E2E Tests** (Playwright, 93 checks): critical user journeys — login/logout/validation, the auth-card state structure suite, dashboard→editor→draw→autosave→AI assistant (incl. the no-crash pin), project create/rename/delete (incl. the session-31 delete-confirm Cancel/Yes-Delete test), teams, the legacy-lowercase→canonical 307 redirect characterization pin, the mobile-navigation regression suite pinned at 390×844, the Untitled-editor contract, the editor-panels suite (chip toggles, Select All flip, the properties sections — **TYPE-CONDITIONAL since session 29: Corner Radius hidden for line/ellipse/text, Fill & Stroke hidden for text, the TEXT section with the Font Family combobox + segmented Text Align buttons — plus the session-29 line rendering pins: the SVG diagonal with NO box border, the line/ellipse Corner-Radius-hidden tests, the text four-section layout, and the Font-Family/Text-Align functional tests — and the session-31 frame container pins: the labeled transparent container chrome, the label's zoom counter-scale, the seeded-frame contract, and the thumbnail border-without-label**), and the parity suites.

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
- The AI assistant degrades, never fails: LLM down / malformed output / rejected sanitization → deterministic fallback parser. Both paths speak the same `{ reply, operations[] }` contract. **The wall's AI contract (S27-1): an instruction-level delete never removes locked elements** — the client's `applyOperations` delete branch filters locked ids (the enforcement seam), the request carries `lockedTargetIds`, the fallback skips them with honest replies, and the LLM's system prompt lists locked ids as never-delete; the AI `update` operations stay unlocked (the properties-panel explicit-surface class). `DIGMA_DISABLE_AI_LLM=1` force-degrades to the fallback (the e2e webServer sets it — the SDK is reachable from the standalone server and its free-form replies made AI assertions non-deterministic). The reply bubble carries the reference's measured post-send footer (session 27): the honest "N action(s) performed" count + a WORKING orange rotate-ccw Revert (a pre-apply snapshot restored through the store's `restoreSnapshot` — an undoable mutation).
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
- **The bottom-left editor chips are independent panel toggles** (ADR-010): Layers / Components / Properties each flip their own panel's visibility (Components renders a second `w-60` column); default ON/OFF/ON; the chips render only where their panels can — bar `hidden md:flex`, Properties chip `hidden lg:inline-block` (dead controls that lie via `aria-pressed` are a bug); pinned by `tests/e2e/editor-panels.spec.ts`. The layer rows carry THREE hover actions (session 17): eye, lock, and the reference's red trash (`text-red-400 hover:bg-red-500/20`, `lucide-trash2 w-3 h-3`, IMMEDIATE delete — undo is the recovery path; e2e-pinned). The layer-row actions follow the reference's measured semantics (session 19): the lock is OPACITY-based (the same `lucide-lock` icon in both states, `opacity-50` unlocked ↔ `opacity-100` locked), the eye/lock icons are lucide-react components (never hand-inlined SVGs), the rename input (double-click) carries the reference's measured chrome (`h-6 px-2 py-1 text-sm bg-[#0d1117] border-[#30363d] text-white shadow-sm rounded-md`, focus ring only on `focus-visible`), and the eye is the clone's working superset over the reference's no-op eye — the row icon swaps eye ↔ eye-off AND the canvas honors `visible` (hidden elements do not render). **The lock's CANVAS contract is a pointer WALL (session 23, reference parity):** the canvas hit-test finds the TOPMOST VISIBLE element (locked included) and returns early when it is locked — no selection change, no deselect, no drag, and NOTHING beneath is selected or displaced; the locked element renders the reference's `cursor-not-allowed` (never `pointer-events: none` — that made the lock a WINDOW whose drags fell through and displaced the element beneath); a locked single-selection renders the outline but NO resize handles; `moveElements` skips locked ids. Pinned by the five session-23 lock-wall e2e tests. **The lock's KEYBOARD contract (session 25):** the `Delete`/`Backspace` shortcut filters locked ids out of the selection before `deleteElements` — a row-selected locked element survives the key, and Select All + Delete removes exactly the unlocked members — while the layer-row TRASH deliberately keeps deleting locked elements (the reference's measured semantics: its locked rectangle's trash removed it while its keyboard layer is entirely dead — no keyboard parity data). The guard lives in the keyboard handler (`editor-view.tsx`), NEVER in the shared `deleteElements` store action. Pinned by the four session-25 e2e tests (which use CAPTURE-RESTORE-ASSERT: capture the outcome, restore the canvas with Ctrl+Z + the autosave wait BEFORE asserting, then assert on the captured values — a RED failure must never leave the shared e2e DB mutated). **The layers drag-reorder computes its insertion index AT DROP TIME (session 21, stateless)** — the row's `onDrop` derives `remaining = elements minus dragged; targetIndex = remaining.indexOf(target); after ? targetIndex : targetIndex + 1` from the drop event's `clientY` and the store, with NO React state involved (the reference's own drag-reorder is dead — rows `draggable` but nothing ever reorders, and its selected row renders `draggable="false"`; the clone's precise implementation is the working superset). **The properties NUMBER inputs never commit an EMPTY draft** — `Number("") === 0` is the trap; clearing a field must not teleport the element to 0 (a non-empty finite draft commits live; blur restores an abandoned empty draft). The properties panel follows the reference's TYPE-CONDITIONAL section layout (session 29): RECTANGLE keeps the five sections (Position & Size; Corner Radius with linked per-corner inputs and a 0–75 slider; Fill & Stroke as a SEGMENTED Solid/Gradient/Image control plus a Stroke Width slider 0–20; Transform with rotation slider + `w-16` number input + `°` suffix and the persisted per-element Scale 0.1–3.0 rendered as `translate(x,y) scale(s) rotate(r)`; Opacity as slider + `w-16` number input + `%` suffix with no row label); LINE and ELLIPSE hide Corner Radius; TEXT renders the measured four-section layout (Position & Size | TEXT | Transform | Opacity) where the TEXT section carries Content (a single-line INPUT, fresh default "Type here..."), Font Size (16), Color (picker + hex bound to `fill`), Font Family (a Radix Select combobox over the 7 measured options — a new `fontFamily` model field, functional on the canvas), and segmented lucide Text Align buttons (the canvas renders `textAlign` + a justify-content mapping) — no Weight control (the model field and rendering keep honoring it). Plus a fixed header block and a Background Color swatch + hex row when nothing is selected. **A LINE element renders as the reference's SVG diagonal** (session 29, RA-8): a transparent div (border-0 — the stroke never paints a box border) carrying `<svg class="overflow-visible"><line … stroke="#FFFFFF" stroke-width="2" stroke-linecap="round">` at ALL THREE render sites (canvas, thumbnail, present overlay). **A FRAME renders as the reference's LABELED CONTAINER (session 31, RA-13):** `defaultElementFor("frame")` → `fill: null, stroke: "#555555", strokeWidth: 1, radius: 0` (the 1px border is the standard stroke mechanism through the shared style chain — canvas, thumbnail, present), plus an always-on name-label chip (`-top-5 left-0 text-xs text-gray-300 bg-[#161b22] px-1.5 py-0.5 pointer-events-none whitespace-nowrap`) counter-scaled `scale(1/zoom)` from `transform-origin: left top` so the text stays a constant screen size at any zoom (a frame-only `zoom` prop on `CanvasElement`); the thumbnail renders the border WITHOUT the label (RA-19); frames keep all five panel sections (RA-17). Every panel slider carries the `editor-range` class — the reference's Radix look (6px rounded track + 16px white thumb via `globals.css`); never `accent-blue-600` on panel sliders.
- **Elements are client-sovereign rows.** Local ids (`local-…`) are created optimistically; the server transactionally deletes + recreates the full list on every save (order = array order). Don't add per-element PATCH autosave — the replace contract is what makes undo/redo and AI batch operations safe.
- **Toast store is `globalThis`-backed** (`src/hooks/use-toast.ts`): state AND listener set live on `globalThis.__digmaToastInfra` (Turbopack chunk-splitting can hand two copies of a module-level singleton to different client chunks). Consumption uses `useSyncExternalStore`. The Toaster renders plain divs — a Radix Toast controlled-`open` list never mounted reliably.
- **The desktop nav highlights the current CANONICAL route** (`bg-purple-50 text-purple-700` on the active link — an exact pathname match: no pill at `/`, pill on `/Dashboard`, `/Recent`, `/Teams`; session 12 corrected session 10's over-scope; pinned on three states by the parity suite).
- **The brand mark is the recreated reference mark** (`logo.tsx`): split-pill rows + the cyan circle on `#0d1017`, inline SVG redrawn from pixel measurement; square-crop mode for the login chip, `stretch` mode for the header. Pinned by `tests/brand-mark.test.ts`.
- **Mobile navigation is a deliberate FIX, not parity.** The reference app ships no mobile nav (desktop nav `hidden md:flex`, no fallback — Tailwind v4 failure class A). This clone adds the hamburger + Sheet drawer (`MobileNav` in `app-header.tsx`): `md:hidden` trigger with stable `aria-label="Navigation menu"`, 44px targets, Radix focus trap/Escape/scroll-lock, links wrapped in `SheetClose`. `tests/e2e/mobile-navigation.spec.ts` pins all of it.
- **Routes are CAPITALIZED** (`/Dashboard`, `/Recent`, `/Teams`, `/Editor?projectId=`; root `/` and `/login` lowercase) — reference parity (ADR-008). Legacy lowercase URLs 307 via `src/proxy.ts` (Next 16.3 `proxy` convention; migrated from middleware.ts in session 12 — characterization pin written first). Never express those redirects in `next.config.ts redirects()` — Next 16 matches redirect sources case-insensitively (per-rule `caseSensitive` is ignored; observed self-loop).

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
