# Digma — Session 12 Remediation Plan (v1.7.0 target)

**Date:** 2026-09-28 · **Input:** live parity re-audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-10 code @ `87733e3`), all pages at
1440×900, 768×1024 and 390×844, DOM/computed-style level (post-hydration, 4–10 s
settles) + VLM screenshot cross-checks + painted-pixel reads of the re-hosted
brand asset. **Method:** every finding below was verified in both apps' DOM
before entering this plan, and the plan was re-validated line-by-line against
the codebase before execution.

---

## Context

Session 10 (commit `01cea0d` + `87733e3`, PAD v1.6.0) closed the session-8 R2
reversal (nav active pill restored), the brand-mark recreation, and the login
footer parity, with the full gate green at 72 unit / 28 smoke / 53 e2e. This
session re-audited the reference with fresh eyes (the fourth consecutive live
audit) and found **one measured parity gap** (a refinement of the session-10
pill finding — the pill's ROUTE SCOPE was wrong, not the pill itself), **one
modernization item** whose pinning prerequisite is now in place (the
middleware → proxy migration Next 16.3.6 asks for on every boot), and **a set
of stale numbers** in the current-state docs (all verified against the tree).

### Why the session-10 pill pin needs a scope fix

Session 10 proved the pill exists (post-hydration, three routes, pixel
forensics) and restored it — but pinned it ON at `/` (root) as well as
`/Teams`, treating `/` as "the Dashboard route". This session measured the
reference's nav on FOUR routes with long settles (5–10 s, well past
hydration):

| Reference route | Active link | Classes |
|---|---|---|
| `/` (root) | **NONE** | all three links `text-gray-600 hover:text-gray-900 hover:bg-gray-50`, no `aria-current` |
| `/Dashboard` | Dashboard | `bg-purple-50 text-purple-700` (no hover classes) |
| `/Recent` | Recent | `bg-purple-50 text-purple-700` |
| `/Teams` | Teams | `bg-purple-50 text-purple-700` |

The reference's active-state logic is an **exact pathname match** — the
Dashboard link's href is `/Dashboard`, and the root path `/` matches nothing,
so the reference renders the dashboard view with a completely un-highlighted
nav. The clone's `isNavActive()` special-cases the root
(`if (href === "/Dashboard") return pathname === "/Dashboard" || pathname === "/"`),
which is a superset the reference does not ship. Parity is the spec → the
root special case goes.

### Findings (all verified in both DOMs / against the tree)

| # | Finding | Severity |
|---|---------|----------|
| S12-1 | **Clone renders the Dashboard nav pill at `/` (root); the reference does not.** Reference: exact pathname match — at `/` no link is active (settled 10 s: all links plain, no `aria-current`); at `/Dashboard`, `/Recent`, `/Teams` the current route's link carries `bg-purple-50 text-purple-700`. Clone today: `isNavActive()` returns true for `/Dashboard` when pathname is `/` OR `/Dashboard`. Pinned WRONG by `tests/e2e/parity.spec.ts` ("Dashboard (the `/` route) is the active one"). | **High** |
| S12-2 | **Next 16.3.6 deprecation: the `middleware` file convention → `proxy`.** The dev server prints the migration notice on every boot; PAD §10 tracks it as deferred "to a dedicated session with the smoke suite as the pin" — but the smoke suite has NO lowercase-redirect check and neither does any e2e spec (verified: no `/recent`-style probe exists in `tests/` or `scripts/`). The migration therefore needs a characterization pin FIRST (the redirects are ADR-008 contract), then the rename. Scandihaven — the reference tech-stack pattern — already runs `proxy.ts`. | **Medium** |
| S12-3 | **Stale numbers/contradictions in the current-state docs** (verified against the tree): PAD §7.1 lists the parity suite at 7 checks (actual 9; the column sums to 51 vs the doc's own "53"); PAD §9.2 says "62 unit tests" (actual 72); PAD §4.3/§9.1 describe the seed as "4 projects … 3 teams" (actual: 2 projects, 1 team with 3 members — PAD §3.2 and digma_SKILL §3 have it right); digma_SKILL §2 says "44 e2e checks" (actual 53); digma_SKILL Appendix B says db-path has "20 checks" (actual 19); digma_SKILL §17 claims the panel chips "stay visible below md" (the chip bar is `hidden md:flex` — the v1.3.0 revision block itself documents the fix); digma_SKILL §6/§19 line refs drifted (editor-store 306→315, globals.css 101→162); PAD §11 line counts drifted on ~12 files; `next.config.ts` attributes `outputFileTracingRoot` to "ADR-007 (inherited)" — ADR-007 is the toast-store ADR; no numbered ADR covers the tracing root. | **Low** |

### Verified parity-hold (no change)

- **Brand mark**: the reference re-hosted its logo (old Supabase URL 404s;
  new URL `…/082348336_782025-1820.jpeg`, same 651×470 art). Downloaded and
  pixel-verified this session: all six shape hexes + the `#0d1017` field +
  the purple–cyan gap match session 10's decode exactly — the clone's
  recreated inline-SVG mark remains pixel-correct. No change.
- **Editor tool rail**: all 9 tools with identical lucide icons in identical
  order (incl. `lucide-image` for Image — the VLM's "grid icon" flag was a
  misread at 16 px, disproven by direct SVG extraction); zoom cluster
  `[100%][zoom-in][zoom-out]`; undo2/redo2; arrow-left back.
- **Auth 3 states** (ADR-013 re-confirmed live): sign-in branded card; sign-up
  minimal card (h2 "Create your account", back-link, no logo/social,
  Email/Password/Confirm Password, no name field); forgot ("Reset your
  password", email-only, "Send reset link").
- **Login footer**: nothing renders below the card in either app; the
  Sign-in-button → footer-links gap measures 12 px in BOTH (the VLM's
  "larger spacing" flag was a false alarm).
- **Dashboard** (hero, Quick Stats, `bg-white text-purple-600` Create button,
  Explore Templates ghost, near-black view toggles), **Recent** (subtitle,
  bare toggle row), **Teams** (flat main, `bg-blue-600` Create Team, empty
  state) — all match.
- **Mobile navigation**: the reference STILL ships failure class A at
  390×844 (desktop nav `display:none`, no hamburger — the single header
  button is a notifications bell). The clone's fix verified end-to-end this
  session: 44×44 trigger (`aria-expanded` flips), drawer with all three
  links, `data-scroll-locked` body, tap "Recent" → navigates AND dismisses.
  Tablet 768: nav visible, no burger. Desktop 1280: nav visible, no burger.
- **Tailwind v4 health**: `@theme` literal fonts + reference-palette pins
  verified in `globals.css`; `tests/theme.test.ts` green; no
  `tailwind.config.js`; fonts render Inter (not the UA serif).
- **Full gate baseline green at `87733e3`**: lint ✅ · typecheck ✅ · 72/72
  unit ✅ · build 20 routes ✅ · 28/28 smoke ✅ · 53/53 e2e ✅ (run this
  session before any change).

### Non-parity observations (documented, not fixed)

- The dev-only Next.js dev-tools indicator ("N" button, bottom-left) appears
  in dev screenshots; it does not exist in production builds. Not a parity
  surface.
- The reference's nav carries no `aria-current` on the active link (a11y
  gap in the reference); the clone keeps `aria-current="page"` on the active
  link as a documented a11y superset.

---

## P1 — Code changes (TDD, one slice per finding)

### S12-1. Nav active pill: exact pathname match (no pill at `/`)

- **File:** `src/components/app-header.tsx` (~lines 29–31, `isNavActive`).
- **Fix:** drop the root special case — `function isNavActive(pathname: string, href: string): boolean { return pathname === href; }`.
  Both the desktop nav and the MobileNav drawer consume the helper, so the
  drawer's active styling follows automatically (the drawer is the clone's
  own design; the reference has no mobile nav to mirror). `aria-current`
  stays driven by the same flag (a11y superset, documented). Rewrite the
  code comment to record the four-route measurement.
- **Tests (RED first):** `tests/e2e/parity.spec.ts` — rewrite the nav test
  into a three-route pin:
  1. At `/`: all three links paint `000000` (transparent) and none carries
     `aria-current` (the reference's exact-match behavior at root).
  2. At `/Dashboard`: the Dashboard link paints `faf5ff` with
     `rgb(126, 34, 206)` text; Recent/Teams transparent; Dashboard carries
     `aria-current="page"`.
  3. At `/Teams`: the Teams link paints `faf5ff` (the existing second-route
     pin, unchanged).
  Pixel-read via the existing canvas trick (v4 emits lab()/oklch() strings).

### S12-2. middleware → proxy (characterization pin, then migrate)

- **Pin FIRST (passes against the current middleware — a characterization
  test, not a RED test):** `tests/e2e/workspace.spec.ts` — "legacy
  lowercase routes 307-redirect to the canonical capitalized routes":
  `/dashboard`, `/recent`, `/teams` land on the canonical route with the
  view heading visible; `/editor?projectId=x` preserves the query through
  the redirect. This closes the pinning gap that deferred the migration in
  PAD §10.
- **Migration:** `git mv src/middleware.ts src/proxy.ts`; rename the export
  `middleware` → `proxy` (Next 16.3's convention — the file and function
  names are the contract; `config.matcher` stays an inline literal); update
  the header comment (keep the ADR-008 rationale verbatim — the case-
  insensitive `redirects()` self-loop lesson stays relevant).
- **Verification:** the build's route table still shows the Proxy
  (Middleware) row; the dev server no longer prints the deprecation notice;
  the new characterization test + the full smoke suite (28) + e2e stay
  green. Net e2e count 53 → 54.

### S12-3. Documentation alignment (see P2)

No code change — the fixes land in the docs + one code comment
(`next.config.ts`'s "ADR-007 (inherited)" mis-attribution).

## P2 — Documentation alignment (post-fix)

- **PAD → v1.7.0:** revision block (S12-1/2/3 + the route-scope lesson:
  "when pinning a parity fact, pin its ROUTE SCOPE too — the session-10
  pill was correct but over-scoped to `/`"); §10 middleware row → Fixed
  (this session, with the characterization-pin-first method); §7.1 parity
  count 7 → 9 (+54 e2e total); §9.2 "62" → 72; §4.3/§9.1 seed counts →
  2 projects / 1 team (3 members); §11 line-count refresh; nav-pill fact
  updated (root shows no pill — exact match).
- **AGENTS.md / CLAUDE.md:** `src/middleware.ts` → `src/proxy.ts` wording
  (ADR-008 section + command notes); nav-pill fact gains the root
  exception; middleware-deprecation mentions removed.
- **README.md:** architecture diagram + file-tree `middleware.ts` →
  `proxy.ts`; e2e count 53 → 54.
- **digma_SKILL.md:** §2 e2e 44 → 54; §17 chip-visibility claim corrected;
  §6/§19 line refs; Appendix B db-path 20 → 19; middleware → proxy lesson.
- **`next.config.ts` comment:** fix the "ADR-007 (inherited)" attribution
  (describe the tracing-root rationale without a wrong ADR number).
- **docs/session_12.md** (new session log) + `worklog.md` Task 29 entry.

## P3 — Delivery

- Screenshots: re-capture the affected surfaces from the remediated dev
  server (dashboard at `/` — the nav is now un-highlighted there — plus the
  standard set) → `docs/screenshots/` (session-12 pass); audit provenance
  stays in `docs/screenshots/ref-audit-s12/`.
- `.env.example`: re-verify against the codebase (DATABASE_URL relative
  rule, `DIGMA_REPO_ROOT`, `AUTH_SECRET`) — expected unchanged; include in
  the commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …`
  (the sandbox exports an absolute `DATABASE_URL` that re-inherits into
  every shell; the parent workspace `.env` is neutralized to the same
  relative URL).
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build
  → ./scripts/smoke-test.sh → test:e2e` — all green before push (expected:
  72 unit / 28 smoke / 54 e2e).
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- The nav pill itself on canonical routes (`/Dashboard`, `/Recent`,
  `/Teams`) — session 10's restoration stands; only the root scope changes.
- Mobile navigation fix (reference still ships failure class A; clone
  verified end-to-end this session — trigger, drawer, scroll lock,
  navigate-and-dismiss, tablet/desktop breakpoints).
- The brand mark (re-verified pixel-identical against the re-hosted
  reference asset — new URL, same art).
- Inter as the app font; palette pins; literal `@theme` tokens; all
  session-8/10 parity fixes other than the pill's root scope.
- Editor chip guards, Untitled editor, autosave replace contract, AI
  degrade-not-fail, toast infra — all pinned by existing suites.
- The reference's own bugs deliberately not cloned (AI crash, Tailwind CDN,
  no-op Create Team buttons, missing mobile nav, no-`aria-current` nav).
- Remaining PAD §10 scope cuts (gradient/image fill pills, per-corner
  radii, rotation-aware bounds, forgot-mail delivery, in-process rate
  limiter, session revocation) — none are release blockers.

---

## Execution status (end of session 12)

**All items EXECUTED and GREEN** — S12-1/2/3 fixed, TDD-first (RED: the rewritten nav pin failed exactly at the root-pill assertion; GREEN: `isNavActive()` exact match + the proxy rename). The S12-2 method worked as designed: the legacy-redirect characterization pin passed against the OLD middleware first, then survived the rename untouched. En-route validation: build still registers the Proxy row with no deprecation warning; `curl /recent` → 307 → `/Recent`; live browser check shows the plain nav at `/` and the pill at `/Dashboard`. Full gate green: **72 unit / 28 smoke / 54 e2e (53 + 1 net-new characterization pin)**. Docs aligned at PAD v1.7.0 / digma_SKILL v1.6.0 (incl. lessons F13/F14/F15).
