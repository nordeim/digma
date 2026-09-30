# Digma — Collaborative Design Workspace

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?logo=prisma)
![SQLite](https://img.shields.io/badge/DB-SQLite-003b57?logo=sqlite)

A production-grade, self-hosted clone of the reference Digma design workspace — a Figma-like app where teams create design files, sketch on a canvas with shape/text tools, steer an AI assistant that edits the canvas conversationally, and organize files into teams. Built as one deployable Next.js unit with cookie-session auth, a typed JSON API, and a Prisma/SQLite store.

## Overview

Digma gives every signed-in user a personal design workspace: a gradient-greeting dashboard with live Quick Stats, a Recently-opened file browser with sort/view controls, a Teams page with member invitations, and a full dark-themed canvas **Editor** (tools, layers, properties, zoom, autosave, undo/redo, AI assistant, presentation mode). The reference app shipped with a broken mobile navigation — its desktop nav was `hidden md:flex` with no fallback, leaving phones with no navigation at all (the Tailwind v4 "failure class A" documented in the repo's skills). This clone reproduces the desktop design faithfully and **fixes the mobile menu** with a hamburger + Sheet drawer that is focus-trapped, Escape-closable, scroll-locked, and pinned by an E2E regression suite.

## Key Features

| Feature | Description |
|---------|-------------|
| 🎨 **Canvas design editor** | DOM-element canvas over a 20px grid: draw rectangles/ellipses/lines/text/**labeled container frames**, marquee + click + shift-click selection, drag-move, 8-handle resize, rotate, opacity, fill/stroke/radius — all inline-styled like the reference |
| 🧰 **Tool rail + shortcuts** | Select/Hand/Frame/Rectangle/Ellipse/Line/Pen/Text/Image with `V H F R O L T` shortcuts, Space-to-pan, Ctrl+wheel zoom, `Delete`, `Ctrl+Z`/`Ctrl+Shift+Z`, `Ctrl+0` reset |
| 🗂 **Layers panel** | Reverse-ordered layer list with **precise drag-reorder** (drop-time index computation — a drop on a row's lower/upper half inserts directly below/above it; the reference's own drag is dead), per-layer visibility (eye — the toggle actually hides the element on the canvas), the reference's opacity-based lock (same lucide-lock icon, `opacity-50` ↔ `opacity-100`) — **locked elements are pointer WALLS: a drag over one never displaces the element beneath it, and a click preserves the current selection** (the reference's measured contract; the locked element renders `cursor-not-allowed` and a locked selection shows its outline without resize handles) — and the wall extends to the KEYBOARD: **Delete on a locked selection is a no-op, and Select All + Delete removes only the unlocked members** (the reference's own keyboard is dead — no parity data — so the clone's working keyboard stays coherent with the wall), and the reference's red **trash delete** (immediate, undo-recoverable — the one delete path that DELIBERATELY ignores the lock, exactly as the reference's own trash removed its locked layer), double-click rename with the reference's measured input chrome (`h-6 px-2 py-1` bordered editor input), live "N layers • N selected" counter
| ⚙️ **Properties panel** | The reference's five sections — Position & Size (X/Y/W/H inputs that never commit an empty draft — clearing a field keeps the element where it is, and blur restores the value), Corner Radius (slider with a DYNAMIC max — half the selected element's smaller side, `min(w,h)/2` — + per-corner inputs clamped to the same max), Fill & Stroke (segmented Solid/Gradient/Image control with a white active segment, swatch + hex rows, Stroke Width slider 0–20), Transform (rotation slider + number input + ° suffix, **per-element Scale 0.1–3.0x** — persisted, rendered as `translate(x,y) scale(s) rotate(r)`), Opacity (slider + number input + % suffix) — plus Text properties (the default font renders as `Inter, sans-serif` — the reference's measured fallback chain); "Canvas Properties" with a Background Color swatch + hex row when nothing is selected — **the change persists through the autosave** (the reference's own control is dead). All sliders render the reference's Radix-slider look (6px rounded track + 16px white thumb). Panel-toggle chips (bottom-left) independently show/hide the Layers, Components, and Properties panels — and render only where those panels can (hidden below md; the Properties chip waits for lg) |
| 🤖 **AI design assistant** | Chat panel below the canvas — LLM (`z-ai-web-dev-sdk`, server-side) parses instructions into element operations with a deterministic fallback parser ("Add 3 red circles", "Create a login form") — degrade-not-fail, never hard-fails. **The wall's AI contract:** an instruction-level delete never removes locked elements (the reference's own locked element survived its AI delete — measured), and the replies report the skip honestly. The reply bubble carries the reference's measured post-send footer — the "N action(s) performed" count and an orange **Revert** button that actually restores the pre-message canvas (itself undoable with Ctrl+Z) |
| 🕐 **Autosave + history** | 800ms-debounced full-list `PUT` with id remapping, "Saved / Saving… / Unsaved" badge, undo/redo history (60 snapshots) |
| 🖥 **Present mode** | Fullscreen, fit-to-viewport presentation of the canvas (Escape to exit); Share copies a deep link |
| 🏠 **Dashboard** | Time-aware greeting hero (purple→pink→blue gradient, glass Quick Stats card fed by `/api/stats`), Continue Working (4 most recent), All Projects with search + grid/list toggle |
| 🃏 **Project cards** | Live canvas thumbnails (content-bbox fit), opened-date, avatar stack, ellipsis menu with inline Rename + a "Delete project?" confirm dialog ("Yes, Delete / Cancel" — the reference's own guard, in chrome that matches the app) |
| 📅 **Recent** | Sort by Last Opened / Last Modified / Date Created / Name, search, grid/list views, "N files found" |
| 👥 **Teams** | Create-team dialog (name/description/color + first member invite), member cards with avatar colors, invite-by-email + role, inline delete confirm |
| 🔐 **Cookie-session auth** | scrypt password hashing + HMAC-signed sessions, per-IP rate limiting (10/15 min → 429 + `Retry-After`), zero external auth dependencies |
| 🚪 **Reference auth flow** | `/login` renders the auth card in three reference-exact states: sign-in (logo + social buttons + "or" divider); **sign-up** (minimal card — "Back to sign in" link + "Create your account" h2, no logo/social, Confirm Password field with inline "Passwords do not match" validation, no name field — the API derives it from the email); **forgot** ("Reset your password" + email-only + "Send reset link"); `?from_url=` return handling; Google/Microsoft/Facebook buttons render for parity and degrade to an explanatory toast (no OAuth credentials in a self-hosted clone) |
| 📱 **The mobile-navigation fix** | Hamburger (`md:hidden`, 44px target, stable aria-label + `aria-expanded`) opens a Radix Sheet drawer: focus-trapped, Escape + scrim close, scroll lock, links are SheetClose-wrapped so a tap navigates AND dismisses — pinned by 9 E2E checks at 390×844 |
| 🌗 **Editor chrome** | GitHub-dark palette (`#0d1117`/`#161b22`/`#30363d`) measured from the reference: top bar (back, project name, Saved badge, undo/redo, avatars, Share/Present), zoom pill, "N selected" badge |

## Screenshots

| Login | Dashboard | Editor |
|:---:|:---:|:---:|
| ![Login](docs/screenshots/01-login.png) | ![Dashboard](docs/screenshots/02-dashboard.png) | ![Editor](docs/screenshots/05-editor.png) |

| Recent | Teams | Editor (Untitled fallback) |
|:---:|:---:|:---:|
| ![Recent](docs/screenshots/03-recent.png) | ![Teams](docs/screenshots/04-teams.png) | ![Untitled editor](docs/screenshots/06-editor-untitled.png) |

<details>
<summary>Auth — the reference's per-mode card structure (sign-up + forgot)</summary>

| Sign-up | Sign-up (mismatch) | Forgot password |
|:---:|:---:|:---:|
| ![Sign-up](docs/screenshots/14-signup.png) | ![Sign-up validation](docs/screenshots/15-signup-validation.png) | ![Forgot](docs/screenshots/16-forgot.png) |

</details>

<details>
<summary>Mobile — including the navigation fix</summary>

| Dashboard | Navigation menu (the fix) | Teams | Editor |
|:---:|:---:|:---:|:---:|
| ![Mobile dashboard](docs/screenshots/07-mobile-dashboard.png) | ![Mobile menu](docs/screenshots/08-mobile-menu.png) | ![Mobile teams](docs/screenshots/09-mobile-teams.png) | ![Mobile editor](docs/screenshots/10-mobile-editor.png) |

</details>

<details>
<summary>Tablet (768)</summary>

![Tablet dashboard](docs/screenshots/11-tablet-dashboard.png)

</details>

<details>
<summary>Editor — panel toggles + Components panel (the chip bar)</summary>

![Editor with components panel](docs/screenshots/12-editor-components.png)

</details>

<details>
<summary>Editor — Transform section (rotation number input + the Scale slider, element at 2.0x + 15°)</summary>

![Editor transform scale](docs/screenshots/13-editor-transform-scale.png)

</details>

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Web framework | Next.js (App Router) | 16.3 | 5 page routes + 16 API route handlers, standalone output |
| UI runtime | React | 19 | Component model |
| Language | TypeScript | 5 (strict) | Type safety end-to-end |
| Styling | Tailwind CSS | 4 | CSS-first `@theme` tokens in `globals.css` — **no `tailwind.config.js`** |
| Components | shadcn/ui on Radix | vendored | dialog, dropdown-menu, sheet, tabs, toast, button, input, label, textarea |
| Client state | Zustand | 5 | The editor store (elements, selection, tool, zoom, history) |
| Unit tests | Vitest | 5 | 88 checks on the pure domain seams + the `@theme`, slider-CSS, brand-mark, font-family validation, frame container-defaults, and session-33 dynamic-contract (corner-radius max + the default font's fallback chain) contracts |
| E2E tests | Playwright | 1.63 | 96 browser checks incl. the mobile-navigation regression suite, the Untitled-editor contract, the panel-toggle/properties suites (incl. the slider + segmented-pill chrome pins, the layer-row trash action, the session-19 layer-row action pins: the eye toggle hides the element on the canvas, the rename input's reference chrome, the lock icon's opacity flip — the session-21 functional-quality pins: the two drag-reorder precision tests, the number-input empty-draft test, the hex input's real accessible name — the session-23 locked-pointer-wall pins: the drag-wall, selection-preserving click, not-allowed cursor, outline-without-handles, and Select-All-drag-skips-locked tests — the session-25 keyboard-delete locked-contract pins: the locked-Delete no-op, the Select-All-Delete-keeps-locked, the unlocked-Delete control, and the trash-on-locked reference-parity boundary — and the session-27 AI-delete locked-contract pins: the locked-AI-delete no-op, the Select-All-AI-delete-keeps-locked, the unlocked-AI-delete control, and the reply-footer/Revert pin — plus the session-29 line/text element-type pins: the SVG diagonal line with NO box border, the line/ellipse Corner-Radius-hidden tests, the text panel's four-section layout, and the Font-Family/Text-Align functional tests), the AI no-crash regression pin, the auth-card state structure suite (sign-up minimal card, Confirm Password validation, forgot state), the legacy-lowercase→canonical redirect pin (ADR-008, proven through the middleware→proxy migration), and the visual-parity suite (font, nav pill exact-match, toggles, Teams, zoom icons, AI panel, create-dialog icons/swatch/submit), plus the session-31 frame container pins (the labeled transparent container chrome, the label's zoom counter-scale, the seeded-frame contract, the thumbnail border-without-label) and the project delete-confirm pin (Cancel keeps, "Yes, Delete" removes), and the session-33 dynamic-contract pins (the corner-radius max = `min(w,h)/2` with the per-corner clamp, the default text's "Inter, sans-serif" fallback chain, and the background-color-persists-across-reload test) |
| ORM | Prisma | 6 | Schema, client, `db push`, seed |
| Database | SQLite | — | Zero-config local persistence (`db/custom.db`) |
| Auth | Node `crypto` (scrypt + HMAC) | — | Cookie sessions, no external auth service |
| AI | z-ai-web-dev-sdk | 0.0.x | Server-side assistant; deterministic fallback |
| Icons | lucide-react | 0.5.x | Icon set |
| Runtime | Bun (or Node ≥ 20) | — | Dev server, scripts, TS execution |

## Architecture

```mermaid
flowchart LR
    B[Browser] -->|GET / · /Dashboard · /Recent · /Teams · /Editor| P["Next.js pages (server components)<br/>session gate — redirect to /login"]
    M[legacy /recent · /teams · …] -->|307 redirect| P
    P --> B
    B -->|GET /login| L[Login route<br/>auth card]
    B -->|fetch JSON| A["API route handlers<br/>/api/* (16 routes)"]
    A -->|Prisma Client| D[("SQLite<br/>db/custom.db")]
    A -->|server-side| Z[z-ai-web-dev-sdk<br/>assistant commands]
    B -->|Zustand editor store| B
```

Every page resolves the session server-side and redirects unauthenticated visitors to `/login?from_url=…`. Client views fetch their data through the `call()` envelope unwrapper (failures become destructive toasts, never render crashes). The editor owns its state in one Zustand store — mutations push history snapshots and flip the store to `unsaved`, which a debounced effect flushes as a full-list `PUT` (server replaces the element set transactionally and returns fresh ids, which the store remaps so selection survives).

## File Hierarchy

```
📂 prisma/
  📄 schema.prisma          # 6 models: User, Project, DesignElement, Team, TeamMember (+relations)
  📄 seed.ts                # Idempotent demo workspace (user, 2 projects w/ canvas, team + 3 members)
📂 public/
  📄 logo.svg               # Brand mark (recreated from the reference: split pills + cyan circle on black)
📂 scripts/
  📄 smoke-test.sh          # 28-check E2E suite vs the production standalone server
📂 src/
  📂 app/
    📄 page.tsx             # Dashboard (session gate → DashboardView)
    📄 login/page.tsx       # Auth card route (3 states, from_url handling)
    📂 Dashboard/           # /Dashboard (canonical) — also served at /
    📂 Recent/              # /Recent files view
    📂 Teams/               # /Teams view
    📂 Editor/              # /Editor?projectId= — the canvas editor
    📄 layout.tsx           # Inter via next/font, Toaster, globals
    📄 globals.css          # Tailwind 4 @theme tokens (shadcn + editor palettes)
    📂 api/                 # 16 route handlers (auth, projects, elements, teams, stats, ai-assistant, health)
  📂 components/
    📂 editor/              # editor-view (shell/shortcuts/autosave/present/panel chips), canvas,
    │                       # toolbar, layers-panel, components-panel, properties-panel,
    │                       # ai-assistant, editor-store
    📄 app-header.tsx       # Shared chrome + THE MobileNav fix (hamburger + Sheet)
    📄 login-screen.tsx     # LoginCard (3 states, social degrade)
    📄 dashboard-view.tsx   # Hero, Quick Stats, Continue Working, All Projects
    📄 recent-view.tsx      # Sort/search/views
    📄 teams-view.tsx       # Team cards, create + invite dialogs
    📄 project-card.tsx     # Card + thumbnail + Create Project dialog
    📄 logo.tsx             # Inline SVG brand mark
    📂 ui/                  # shadcn primitives (button, dialog, dropdown-menu, sheet, tabs, toaster…)
  📄 proxy.ts              # Legacy lowercase routes → canonical 307 redirects (Next 16 `proxy` convention)
  📂 hooks/
    📄 use-toast.ts         # globalThis-backed toast store (useSyncExternalStore-safe)
  📂 lib/
    📄 editor.ts            # Element types, defaults, bounds/fit math — unit tested
    📄 editor-store? → components/editor/editor-store.ts
    📄 auth.ts              # scrypt + HMAC sessions, cookie lifecycle
    📄 api.ts               # ok()/fail() envelope + requireSession()
    📄 db-path.ts           # SQLite URL resolution (standalone chdir trap) — unit tested
    📄 db.ts                # Prisma singleton
    📄 rate-limit.ts        # Fixed-window per-IP auth throttling — unit tested
    📄 ai-assistant.ts      # Assistant fallback parser + LLM sanitizer — unit tested
    📄 team.ts              # Invite normalization — unit tested
    📄 greeting.ts          # Time-aware greeting — unit tested
    📄 validation.ts        # Manual guards (enums, clamps, length caps)
    📄 utils.ts             # cn() class merge
📂 tests/
  📂 e2e/                   # Playwright: auth, mobile-navigation (the fix), workspace,
  │                         # untitled-editor, editor-panels (chip toggles + properties)
  📄 db-path.test.ts        # The SQLite URL contract
📄 docs/
  📂 screenshots/           # App screenshots used by this README
```

## Quick Start

Requires **Bun** (recommended) or **Node.js ≥ 20** with npm.

```bash
# 1. Install dependencies
bun install                # or: npm install

# 2. Configure environment
cp .env.example .env       # defaults are correct for local use

# 3. Create + seed the database
bun run db:push            # or: npx prisma db push
bun run db:seed            # or: npx tsx prisma/seed.ts

# 4. Start the dev server
bun run dev                # or: npm run dev
```

Open <http://localhost:3000> and sign in with the seeded demo account:

| Email | Password |
|-------|----------|
| `demo@digma.app` | `Digma1234!` |

### Verify Setup

```bash
curl http://localhost:3000/api/health
# {"status":"ok","app":"digma","ts":"…"}

# Full end-to-end verification (28 checks: auth, CRUD, validation, rate limit, pages)
./scripts/smoke-test.sh    # builds must exist: run `bun run build` first
```

### Production

```bash
bun run build              # next build + standalone assembly
bun run start              # serves .next/standalone/server.js on :3000
```

## Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | SQLite connection string. Relative `file:` paths resolve against `prisma/schema.prisma` (the CLI rule) — `src/lib/db-path.ts` implements the same rule at runtime and handles the standalone server's `chdir` into `.next/standalone`. | `file:../db/custom.db` |
| `AUTH_SECRET` | Production | HMAC secret for session cookies. Generate with `openssl rand -hex 32`. Falls back to an insecure dev constant when unset. | — |
| `DIGMA_DISABLE_AI_LLM` | Optional | Set to `1` to force the AI assistant's deterministic fallback (the e2e suite pins its exact replies this way; also a production force-degrade knob). | — |
| `DIGMA_REPO_ROOT` | Optional | Explicit repo-root anchor for SQLite path resolution (container escape hatch). | — |

## API Reference

All endpoints return `{ "ok": true, "data": … }` or `{ "ok": false, "error": { "code", "message" } }`. 🔒 = requires session cookie.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Liveness probe |
| `/api/auth/register` | POST | Create account (name, email, password) — rate-limited |
| `/api/auth/login` | POST | Sign in, sets session cookie — rate-limited (10/IP/15 min, then `429 RATE_LIMITED`) |
| `/api/auth/logout` | POST | Clear session |
| `/api/auth/me` | GET | Current user |
| `/api/stats` 🔒 | GET | Dashboard Quick Stats (projects, teams, active this week, plan) |
| `/api/projects` 🔒 | GET / POST | List (search, template filters) / create |
| `/api/projects/[id]` 🔒 | GET / PATCH / DELETE | Detail (with elements) / rename·re-color·touch / delete |
| `/api/projects/[id]/duplicate` 🔒 | POST | Copy project + elements |
| `/api/projects/[id]/elements` 🔒 | GET / POST / PUT | List / add one / full-list replace (autosave, transactional) |
| `/api/teams` 🔒 | GET / POST | List with members / create (+ optional first member) |
| `/api/teams/[id]` 🔒 | PATCH / DELETE | Rename / delete |
| `/api/teams/[id]/members` 🔒 | POST | Invite by email + role |
| `/api/ai-assistant` 🔒 | POST | Assistant chat → `{ reply, operations[] }` (LLM first, deterministic fallback) |

## Design System

Measured from the reference app. Light workspace: white surfaces on a `gray-50 → white → purple-50` wash, `purple-600 → pink-600 → blue-600` gradient hero, glass `bg-white/10 backdrop-blur-lg` stats card, `text-2xl font-bold` section heads, purple-600 accents, Inter type. Editor: GitHub-dark chrome.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-background` | `#ffffff` | Page background |
| `--color-foreground` | `#0f172a` | Primary text (slate-900) |
| `--color-primary` | `#8b5cf6` | Purple-500 accents, active states |
| `--color-muted-foreground` | `#6b7280` | Secondary text (gray-500) |
| `--color-border` | `#e5e7eb` | Borders, inputs (gray-200) |
| `--color-editor-bg` | `#0d1117` | Editor canvas background |
| `--color-editor-panel` | `#161b22` | Editor panels, top bar, toolbar |
| `--color-editor-border` | `#30363d` | Editor borders/dividers |
| `--color-editor-text` | `#e6edf3` | Editor text |

Tokens are declared as **literal hex values in a plain `@theme` block** in `src/app/globals.css` — `var()` chains inside `@theme` are dropped by the current Tailwind v4 build (the Scandi Haven hard-won lesson), **and that rule extends to font tokens**: pointing `--font-sans` at `var(--font-inter)` compiles but computes to *guaranteed-invalid* at `:root` (next/font scopes the variable to `<body>`), silently rendering the whole app in the UA serif default — the v1.5.0 font fix ships literal font names and `tests/theme.test.ts` pins the contract. There is **no `tailwind.config.js` by design**: a leftover legacy config is the #1 cause of the "flat/minimal look" bug documented in the Tailwind v4 skills. Because the reference app ships the Tailwind v3 palette (via CDN), every consumed v4 default scale is **pinned to its v3 hex** in the same `@theme` block — v4's oklch-tuned palette renders visibly different (its blue-600 is `#155DFC` vs the reference's `#2563EB`).

Status colors: blue `#3B82F6` (default fill/active tool), green `#10B981` (Saved badge, Present), amber (Saving…), red `#EF4444` (destructive).

## Testing

```bash
bun run test              # unit tests — 88 checks on the pure domain seams
bun run test:e2e          # Playwright — 96 browser checks (needs `bun run build` first)
./scripts/smoke-test.sh   # curl E2E — 28 checks against the production build
```

The unit layer (Vitest) pins the pure seams — including the brand-mark source contract (`tests/brand-mark.test.ts`: the six measured hexes, the cyan circle counter, the dual render modes, no gradient chip backing): the SQLite URL resolution incl. the standalone `chdir` trap (`src/lib/db-path.ts`, pinned by `tests/db-path.test.ts`), the Tailwind v4 `@theme` contract (`tests/theme.test.ts` — literal font names with no `var()` chains, literal-hex color tokens, no legacy config), the assistant's deterministic parser + LLM-output sanitizer (`ai-assistant.test.ts`), the editor's geometry/default seams (`editor.test.ts`), the fixed-window rate limiter (`rate-limit.test.ts`), invite normalization (`team.test.ts`), and the greeting boundaries (`greeting.test.ts`).

The Playwright layer boots the production standalone server on :3100 with its own scratch database (`db/e2e.db`, schema-pushed + seeded by the global setup); a setup project signs the demo user in ONCE and shares the cookie via storageState (the auth rate limiter makes per-test logins a trap). The suites pin: the login round-trip (wrong password, valid credentials, authed redirect), **the auth-card state structure** (sign-up swaps to the reference's minimal card — "Back to sign in" + "Create your account" h2, no logo/social buttons, Confirm Password with inline "Passwords do not match" validation, no name field; forgot renders "Reset your password" + email-only + "Send reset link"; the back-link returns to the sign-in card), the workspace surface (dashboard stats/cards, path routes, 404 guard, create-project dialog, editor load with layers), the Untitled-editor contract (unknown/missing projectId → working editor, create-on-first-save, URL adoption), — and — the highest-regression-risk chrome — **the mobile navigation fix**: trigger visibility below `md` with 44px targets, drawer opens with all links, link taps navigate AND close, Escape closes with focus return, focus stays trapped, scroll locks (`data-scroll-locked`), and the hamburger never appears at ≥768. A dedicated `editor-panels` suite pins the reference's panel-toggle chips (independent Layers/Components/Properties visibility, default ON/OFF/ON, chips hidden where their panels can't render — below md, Properties chip below lg), the Layers header Select All/Deselect All flip, **the layer-row trash hover action** (the reference's third row action — eye, lock, and the red trash that deletes immediately; session 17), the properties panel's TYPE-CONDITIONAL section layout (session 29: RECTANGLE keeps the five sections — Position & Size, Corner Radius, Fill & Stroke, Transform, Opacity; LINE/ELLIPSE hide Corner Radius; TEXT renders Position & Size | TEXT | Transform | Opacity with the Font Family combobox + segmented Text Align buttons; Canvas Properties → Background Color row) and the line element's SVG diagonal rendering (no box border — at the canvas, thumbnail, and present sites), and the Transform section's scale contract (slider 0.1–3.0, "1.0x" readout, persisted transform chain). An AI-assistant regression test pins the degrade-not-fail contract — a submitted command must answer, mutate the canvas, and leave the page fully interactive (the reference app itself crashes blank-screen on the same input). A `parity` suite pins the measured reference chrome: the app renders Inter (never the UA serif default), the desktop nav carries the active-state pill on the current route (the session-10 reversal — session 8's "no pill" reading was a pre-hydration snapshot of the SPA; the settled reference renders `bg-purple-50 text-purple-700`, pinned on two routes), the active view toggle is the reference's near-black `#171717`, the Teams page is flat (no gradient wash) with solid blue-600 Create Team buttons, the zoom controls are magnifier icons (in-first), the AI panel follows the reference chrome (h-80 column, blue Bot header glyph, avatar-chip message rows with timestamps below the bubble, separate blue send button, and the `Try:` suggestions hint line under the input — the session-14 reversal of session 8's "no line" misread), the login card carries no demo-account hint and nothing renders below it, and the login chip carries the recreated brand mark (six measured shapes on the black field — no gradient backing; pinned by `tests/brand-mark.test.ts`).

The smoke suite boots the production standalone server and runs 28 checks: health, auth (valid/invalid/unauthenticated), all read endpoints (envelope asserted), project CRUD incl. rename + full-list element PUT + invalid-type rejection, team + member validation, the AI assistant (fallback adds exactly 3 circles; blank message 400), page renders, the 404 guard, logout invalidation, and the login rate limit (429).

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Error code 14: Unable to open the database file` | A parent workspace `.env` or exported shell var injects an absolute `DATABASE_URL` pointing elsewhere; or the server started outside the repo root | Start via `bun run start`/`bun run dev`; check the `[db] DATABASE_URL ->` startup log line; prefer relative `file:../db/custom.db` |
| Login suddenly returns 429 | Per-IP rate limit engaged (10 attempts / 15 min) | Wait for the window to reset (see `Retry-After`) or restart the server to clear in-memory buckets |
| Toasts never appear | (Fixed) the toast store is `globalThis`-backed so split client chunks share it — if you fork the code, keep that pattern | See `src/hooks/use-toast.ts` |
| "Continue with Google" shows a toast instead of signing in | Expected — the self-hosted clone carries no OAuth credentials (documented deviation) | Wire a real provider in `login-screen.tsx` if needed |
| AI assistant answers but adds generic shapes | SDK unavailable → deterministic fallback engaged (by design) | Configure the SDK environment for LLM-shaped plans |
| Prisma `P1003` / missing tables | Database not initialized | `bun run db:push && bun run db:seed` |

## License

No license file is present in this repository; all rights are reserved by default. Add an explicit license before redistributing.
