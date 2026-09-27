# Digma — Session 8 Remediation Plan (v1.5.0 target)

**Date:** 2026-09-28 · **Input:** live parity audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev + production builds), all pages at 1440×900 and 390×844,
computed-style level (not just screenshots). **Method:** every finding below was
verified in both apps' DOM (classes / computed styles) before entering this plan.

---

## P0 — Critical shipping bug (Tailwind v4 related — the one the operator asked to look for)

### R1. The entire app renders in the UA serif font ("Times New Roman") — since session 1
- **Evidence (dev AND production builds):** `getComputedStyle(document.body).fontFamily`
  → `"Times New Roman"`; `getComputedStyle(document.body).getPropertyValue('--font-sans')`
  → `""` (empty); `document.fonts.check('16px Inter')` → `false` (Inter never loads).
  Reference app: `ui-sans-serif, system-ui, sans-serif` (clean sans).
- **Root cause:** `src/app/globals.css` `@theme { --font-sans: var(--font-inter), … }`.
  Tailwind v4 emits this into `:root { … }`. next/font defines `--font-inter` via a
  class on `<body>`. CSS custom properties resolve their `var()` references at
  computed-value time **per element**: at `:root`/html `--font-inter` is undefined,
  so `--font-sans` computes to *guaranteed-invalid*; html's
  `font-family: var(--font-sans)` then falls back to the UA default (serif), and every
  descendant **inherits the already-broken computed value** (body's own
  `--font-inter` never gets a chance). The docs' "only `--font-*` may use `var()`"
  guidance is wrong — the var() chain survives the BUILD but breaks at RUNTIME.
- **Fix:** `--font-sans: "Inter", "Inter Fallback", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;`
  (literal font names; the `Inter` @font-face family registered by next/font is
  document-global, so this resolves at `:root`). Keep `--font-inter` on body (harmless;
  the `.font-sans` utility then resolves the same list).
- **Pin:** new unit test `tests/theme.test.ts` reads `src/app/globals.css` and asserts
  the `--font-sans` declaration contains the literal `Inter` and contains NO
  `var(--font-inter)` reference (the regression pin). New e2e check asserts the
  body's computed font-family is NOT the UA serif default.
- **Docs:** ADR-004 amendment (PAD revision block v1.5.0) + AGENTS.md/CLAUDE.md/
  digma_SKILL.md Tailwind-v4 rules updated.

## P1 — Visual parity gaps (clone vs reference, measured)

### R2. Header nav active state (clone adds one the reference doesn't have)
- Reference (on /Dashboard): ALL links `text-gray-600 hover:bg-gray-50 hover:text-gray-900` — no active variant.
- Clone: active link gets `bg-purple-50 text-purple-700` (`src/components/app-header.tsx:151-154`).
- **Fix:** remove the active branch in the DESKTOP nav (keep `aria-current="page"` — a11y, not visual).
  The MobileNav drawer keeps its own active styling (it is the clone's fix surface, not a parity surface).

### R3. Dashboard/Recent view-toggle active button color
- Reference: `bg-primary text-primary-foreground shadow hover:bg-primary/90` with their `--primary: #171717`
  (near-black) — measured `rgb(23,23,23)` = Tailwind **neutral-900**.
- Clone: purple `#8b5cf6` (default variant) — `dashboard-view.tsx:258-280`, `recent-view.tsx:111-127`.
- **Fix:** explicit `bg-neutral-900 text-white shadow-sm hover:bg-neutral-900/90` (v4 shadow scale) on the
  active toggle in both views; inactive stays ghost.

### R4. Teams page — 5 drifts
1. `main` has `bg-gradient-to-br from-gray-50 via-white to-purple-50` (`teams-view.tsx:89`); reference Teams main = plain. **Remove.**
2. "Create Team" button: clone = purple→pink gradient; reference = `shadow h-9 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium`. **Align (both header + empty-state button; empty-state: `shadow h-9 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white` default rounding).**
3. Empty state: clone = `py-20` + gradient circle + white icon + `font-bold` + `text-sm text-gray-600`;
   reference = `text-center py-16`, plain `lucide-users w-16 h-16 text-gray-300 mx-auto mb-4` (no circle),
   `text-xl font-semibold text-gray-900 mb-2`, `text-gray-500 mb-6` (default size). **Align.**
4. Header row: clone `sm:flex-row sm:items-center`; reference `flex flex-col md:flex-row justify-between items-start md:items-center gap-4`. **Align to md.**
5. Subtitle: clone `text-sm text-gray-600`; reference `text-gray-500 mt-1` (default 16px). **Align** (h1 drops `mb-1`, subtitle carries `mt-1`).

### R5. Recent page subtitle — same pattern as R4.5: reference `text-gray-500 mt-1`, clone `text-sm text-gray-600` + h1 `mb-1` (`recent-view.tsx`). **Align.**

### R6. Editor zoom control icons
- Reference: `[100% pill] [ZoomIn icon btn] [ZoomOut icon btn]` (order: in, then out), both
  `bg-[#161b22] border border-[#30363d] rounded-lg p-2 text-gray-400 hover:text-white`.
- Clone: `Plus` / `Minus` icons (`editor-view.tsx:512,520`). **Swap to lucide `ZoomIn`/`ZoomOut`, keep reference order + aria-labels.**

### R7. AI assistant panel — 5 drifts (`src/components/editor/ai-assistant.tsx` + the `h-56` wrapper at `src/components/editor/editor-view.tsx:526`)
1. Wrapper height: clone `h-56` (224px, editor-view.tsx:526); reference `h-80` (320px). **Align.**
2. Header: clone = gradient circle + Sparkles, no border; reference = `p-3 border-b border-[#30363d] flex items-center gap-2`
   + `Bot w-4 h-4 text-blue-400` + h3 + trailing `WandSparkles w-3 h-3 text-purple-400`. **Align.**
3. Assistant messages: clone = no avatar, `max-w-[85%] rounded-xl rounded-bl-sm px-3 py-2 text-gray-200`, timestamp inside bottom-right;
   reference = row avatar `w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full` (white `Bot w-3 h-3`) +
   `max-w-[80%]` bubble `p-2 rounded-lg text-xs bg-[#21262d] text-gray-300` + timestamp SIBLING below `text-xs text-gray-500 mt-1 text-left`. **Align** (user bubble: unmeasurable — the reference crashes on send; keep clone's user style but adopt the same bubble geometry).
4. Input area: clone = h-9 rounded-lg input with send icon inside + "Try: …" suggestions line;
   reference = `p-3 border-t border-[#30363d]` + form `flex gap-2`: input `flex-1 bg-[#0d1117] border-[#30363d] text-white text-xs h-8`
   + OUTSIDE send button `shadow rounded-md text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 h-8` with `Send w-3 h-3`. **Align; remove the suggestions line** (not in the reference). Keep the input's `aria-label` + the send button's `aria-label` (pinned by `workspace.spec.ts`).
5. Panel border-t moves to the h-80 wrapper like the reference (visual equivalence, structural alignment).

### R8. Layers row hover: clone `hover:bg-[#21262d]` (`layers-panel.tsx:132`); reference `hover:bg-[#30363d]`. **Align.**

### R9. Login demo-account hint line (clone-only): "New here? The seed ships a demo account — demo@digma.app / Digma1234!" — the reference has nothing (`login-screen.tsx`). **Remove** (creds stay in README/AGENTS). Logo chip = hosted JPEG on the reference (cannot copy, do not hotlink) — the inline SVG stays (documented substitute).

## P2 — Test suite work (the operator's "add vitest + playwright test suite by modifying the respective config files")

- `vitest.config.ts` / `playwright.config.ts` already exist, exclude `skills/`, and are wired to the
  gate. **Verification + targeted enhancement only** (no rewrite):
  - NEW `tests/theme.test.ts` (unit): the @theme font contract (R1 pin) — literal `Inter`, no `var(--font-inter)`;
    also pins "no legacy tailwind.config.js" and "no var() chains inside plain @theme color tokens".
  - NEW e2e checks (extend `tests/e2e/workspace.spec.ts` + `auth.spec.ts`): body font is not the UA serif
    (R1), no desktop nav active pill (R2), active view-toggle is near-black (R3), Teams page has no main
    gradient + blue Create Team button (R4), zoom buttons expose ZoomIn/ZoomOut (R6), AI panel structure
    (h-80 wrapper, Bot header icon, timestamp below bubble, blue send button) (R7), login hint absent (R9).
  - Re-verify all counts and update every doc that states them.

## P3 — Documentation alignment (post-fix)

- **PAD → v1.5.0:** revision block (R1–R9 + audit provenance), ADR-004 amendment (font tokens: literal
  names only — the var() runtime trap), updated test counts, file-tree PNG count, §7.4 checklist refresh.
- **AGENTS.md / CLAUDE.md:** Tailwind-v4 rule updated (the "only --font-* may use var()" exception is
  REMOVED — var() breaks at runtime via custom-property computed-value semantics when the referenced
  var is element-scoped); test counts; gate notes unchanged.
- **digma_SKILL.md:** counts, ADR range 001–013 → 001–013 + ADR-004a, scrub the reference-account
  credentials in Appendix B to placeholders (secret hygiene, consistent with the twice-scrubbed worklog).
- **docs/DEPLOYMENT.md:** full rewrite (currently stale ORBITAL content: wrong app name, removed env
  vars, wrong counts, `/var/lib/orbital/` paths).
- **README.md:** screenshots refreshed, design-system note (font fix), counts.
- **docs/session_8.md** (new) + repo `worklog.md` Task 27 entry.

## P4 — Delivery

- Screenshots: refresh all README shots from the remediated dev server (16 + new states) → `docs/screenshots/`.
- `.env.example`: verified against the codebase (DATABASE_URL relative rule, AUTH_SECRET, DIGMA_REPO_ROOT) — included in the commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …` (the sandbox exports an absolute
  `DATABASE_URL` that shadows the repo's relative URL — the documented trap).
- Gate: `lint → typecheck → test → build → ./scripts/smoke-test.sh (dev stopped) → test:e2e` — all green before push.
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo> --remote git@github.com:nordeim/digma.git`, main only.

## Explicitly NOT changing (verified correct / deliberate)

- Mobile navigation fix (reference still ships failure class A at 390×844 — no hamburger, nav `display:none`; clone's 44×44 trigger + Sheet drawer verified working end-to-end).
- Editor panel chips responsive guards (`hidden md:flex` / `hidden lg:inline-block`) — pinned by e2e.
- Untitled editor, autosave replace contract, AI degrade-not-fail — pinned by e2e.
- Card thumbnails render correctly (the "black" look is seed DATA — dark elements on dark canvas; the reference's blue is its own data). Optional seed retint considered and deferred (would churn e2e fixtures for zero parity gain).
- Login logo chip (hosted JPEG on the reference — inline SVG is the documented self-hosted substitute).
- Reference's own bugs deliberately not cloned (AI crash, Tailwind CDN, no-op buttons).

---

## Execution status (end of session 8)

**All items EXECUTED and GREEN** — R1–R10 fixed, 4 unit checks (`tests/theme.test.ts`) + 7 e2e checks (`tests/e2e/parity.spec.ts`) added TDD-first (RED → GREEN), full gate green (`lint · typecheck · 66/66 unit · build 20 routes · 28/28 smoke · 51/51 e2e`), 16 screenshots re-captured, docs aligned at PAD v1.5.0 / digma_SKILL v1.4.0. Two additions discovered during execution and included: the **reference-palette pins** (the v4 oklch palette drift — ADR-004a) and the **Recent toggle-group structure** (bare `flex gap-2`, not the Dashboard's gray container).
