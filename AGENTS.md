# AGENTS.md — Digma

Single Next.js 16 app (App Router) that clones the reference Digma design workspace: five page routes (`/`, `/login`, `/recent`, `/teams`, `/editor?projectId=`), a DOM-element canvas editor with an AI assistant, Prisma/SQLite persistence, and cookie-session auth. Clone remote: `https://github.com/nordeim/digma.git`; pushes go to the SSH remote via `docs/ssh_git_wrapper_v3.py`.

## Commands

| Task | Command |
|------|---------|
| Install | `bun install` (or `npm install`) |
| Dev server (port 3000) | `bun run dev` |
| Production build | `bun run build` |
| Production server | `bun run start` |
| Lint | `bun run lint` |
| Type check | `bun run typecheck` |
| Unit tests (54 checks) | `bun run test` |
| Browser E2E (23 checks; needs a build) | `bun run test:e2e` |
| Prisma client after schema change | `bunx prisma generate` |
| Recreate DB from schema | `bun run db:push` |
| Seed demo workspace | `bun run db:seed` |
| End-to-end smoke suite | `./scripts/smoke-test.sh` (needs `bun run build` first) |

**Gate order before every push:** `bun run lint` → `bun run typecheck` → `bun run test` (54) → `bun run build` → `./scripts/smoke-test.sh` (28 checks) → `bun run test:e2e` (23 Playwright checks — boots the standalone server on :3100 against its own `db/e2e.db`). There is no hosted CI; the local gate is the only gate. `next.config.ts` sets `ignoreBuildErrors` — the explicit `typecheck` step is what catches type errors; never skip it.

First-run setup: `bun install && cp .env.example .env && bun run db:push && bun run db:seed && bun run dev`. Demo login: `demo@digma.app` / `Digma1234!`.

**Environment trap:** a parent workspace `.env` (or an exported shell `DATABASE_URL`) silently overrides the repo's relative SQLite URL with an absolute path to a different (or missing) file — symptom: `Error code 14: Unable to open the database file`. The `[db] DATABASE_URL -> …` startup log line is the diagnostic; unset the var or delete the stale parent `.env`.

## Architecture facts you would otherwise guess wrong

- **Every page is session-gated server-side.** `page.tsx` files call `getSessionUser()` and `redirect("/login?from_url=…")` — the client views never gate themselves. All API reads/mutations are session-gated too (`requireSession()` first line, 401 envelope otherwise). Only `/api/health` and `/api/auth/*` are public.
- **The editor state lives in ONE Zustand store** (`src/components/editor/editor-store.ts`) — elements, selection, tool, zoom/pan, save flag, undo/redo snapshots. Views and panels read the store and call actions; nothing else owns canvas state. Mutations flip `saveState` to `unsaved`; the autosave effect (in `editor-view.tsx`) debounces 800ms and `PUT`s the FULL element list to `/api/projects/[id]/elements`, then remaps ids from the response so selection survives the replace.
- **Elements are client-sovereign rows.** Local ids (`local-…`) are created optimistically by the store; the server transactionally deletes+recreates the full list on every save (order = array order). Don't add per-element PATCH autosave — the replace contract is what makes undo/redo and AI batch operations safe.
- **The AI assistant degrades, never fails.** `POST /api/ai-assistant` tries `z-ai-web-dev-sdk` (server-side only), sanitizes the LLM's JSON through `src/lib/ai-assistant.ts` (`sanitizeLlmOperations` — type/enum/hex/clamps), and falls back to the deterministic parser (`parseFallbackCommand`) when the SDK is down, the output is malformed, or sanitization rejects it. Both paths speak the same `{ reply, operations[] }` contract; the client applies operations (`add`/`update`/`delete`, `update` may carry `scale`).
- **API envelope is `{ ok, data } | { ok, error: { code, message } }`** — build responses with `ok()`/`fail()` from `src/lib/api.ts`. Client views unwrap through the `call()` helper (failures → destructive toast + `null`, never a thrown error into render).
- **Auth is hand-rolled** (`src/lib/auth.ts`): scrypt hashes + HMAC-SHA256 stateless tokens in an httpOnly `digma_session` cookie (7-day TTL). Login success uses `router.push(fromUrl)` + `router.refresh()` — never `window.location` assignments (the header/user swap depends on the server re-resolving the session). Auth routes are rate-limited (`src/lib/rate-limit.ts`): 10 attempts/IP/15 min → `429 RATE_LIMITED` + `Retry-After`; per-process only.
- **Toast store is `globalThis`-backed** (`src/hooks/use-toast.ts`): Turbopack code-splitting can hand two copies of a module-level singleton to different client chunks (page bundle vs. root-layout Toaster) — the state AND the listener set live on `globalThis.__digmaToastInfra`, and consumption uses `useSyncExternalStore` (the React-19-safe pattern; never a `useState` initializer or effect-body `setState`). The Toaster itself is plain divs — a Radix Toast controlled-`open` list never mounted reliably.
- **SQLite URL normalization (the standalone chdir trap):** the Prisma CLI resolves relative `file:` URLs against `prisma/schema.prisma`; the runtime engine anchors them against CWD — and Next's standalone `server.js` runs `process.chdir(__dirname)` into `.next/standalone` before any module executes. `src/lib/db-path.ts` resolves against anchor dirs (first one containing `prisma/schema.prisma` wins); `tests/db-path.test.ts` pins the contract. **The anchor detection in `candidateRoots()` must use side-effect `roots.push(...)` — NOT helper return values: the production minifier inlines-and-drops unused returns, which silently ate the standalone detector in the shipped bundle (observed and fixed; don't reintroduce).**
- **The mobile navigation is a deliberate FIX, not parity.** The reference app ships NO mobile nav (desktop nav `hidden md:flex`, no fallback — Tailwind v4 failure class A). This clone adds the hamburger + Sheet drawer (`MobileNav` in `app-header.tsx`): `md:hidden` trigger with a stable `aria-label="Navigation menu"` + `aria-expanded`/`aria-controls`, 44px targets, Radix focus trap/Escape/scroll-lock, links wrapped in `SheetClose` so a tap navigates AND dismisses. No pathname-reset effect is needed (remount-per-route + SheetClose handle it) — and the React 19 `set-state-in-effect` lint rule forbids that pattern anyway. `tests/e2e/mobile-navigation.spec.ts` pins all of it; when the dialog is open, Radix marks the app `aria-hidden`, so role-based locators can't see the trigger — assert via `page.locator('button[aria-controls="mobile-nav-sheet"]')`.
- **Tailwind 4 is CSS-first — there is NO `tailwind.config.js`.** Tokens are literal hex in a plain `@theme` block in `src/app/globals.css` (shadcn semantics + editor palette); animations come from `tw-animate-css` (imported in CSS, not a JS plugin). Never add a legacy config file (the #1 "flat/minimal look" bug), never use `var()` chains inside a plain `@theme` (they're dropped by the current v4 build — literal hex only; only `--font-*` may use `var()`), and don't rely on safelists (unsupported in v4 — use `@source inline()` if ever needed).
- **Validation is hand-rolled** in route handlers + `src/lib/validation.ts` (trim, length caps, enum membership, hex checks, numeric clamps). No schema library — do not introduce Zod halfway.
- **TypeScript is strict except `noImplicitAny: false`** (sandbox default; kept intentionally). `bun run typecheck` is the type gate — the build won't surface type errors.

## Conventions that differ from defaults

- **Editor colors are `editor-*` Tailwind utilities** (`--color-editor-bg/panel/border/text` in `@theme`) — use them for the dark chrome instead of re-typing `#0d1117` hex.
- **Icons render at lucide default stroke** everywhere except editor panel headers where a softer look is used via smaller sizes. Toolbar buttons carry `title="{Tool} ({shortcut})"`.
- **Element types:** `rectangle | ellipse | line | text | frame | image | path` — `image`/`path` are in the vocabulary but currently minimal (pen/image tools select; creation routes through the same store).
- **Deletes confirm inline or via dialogs local to the card** (team cards swap Delete → "Yes, Delete / Cancel"); project deletes go through the ellipsis menu with an explicit confirm step. Never reintroduce `AlertDialog` global confirms.
- **ESLint ignores `skills/`** (the operator's skill catalog, not app code) plus build output dirs — don't remove those ignores.
- **`use client` is explicit** on every interactive component; pages stay server components.

## Git

- **`main` only.** No feature branches.
- Conventional Commits with emoji prefixes: `:art: feat: …`, `:memo: docs: …`, `:bug: fix: …`.
- Never commit `.env`, `*.key`, `db/*.db`, `node_modules/`, `dev.log`/`server.log` (all gitignored).
- Push through the SSH wrapper from the repo root: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo> --remote git@github.com:nordeim/digma.git` — runbook: `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.
