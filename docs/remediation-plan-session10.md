# Digma — Session 10 Remediation Plan (v1.6.0 target)

**Date:** 2026-09-28 · **Input:** live parity re-audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-8 code @ `546ee0a`), all pages at
1440×900 and 390×844, DOM/computed-style level (post-hydration) + VLM screenshot
cross-checks + painted-pixel reads. **Method:** every finding below was verified
in both apps' DOM before entering this plan, and the plan was re-validated
line-by-line against the codebase before execution.

---

## Context

Session 8 (commit `c788fd4`, PAD v1.5.0) closed 10 measured parity gaps (font
bug, palette pins, Teams page, AI panel chrome, …) with the full gate green at
66 unit / 28 smoke / 51 e2e. This session re-audited the reference with fresh
eyes and found **one session-8 measurement error to revert** plus **two
previously-unmeasured gaps** (both on surfaces session 8 classified as
"documented substitute / no change" or did not measure at the DOM level).

### Why the session-8 R2 reading was wrong (root cause)

Session 8 recorded "the desktop nav has NO active-state pill — measured live on
/Dashboard: all three links carry identical classes". Re-measurement this
session (post-hydration, three routes) shows the reference **does** render
`bg-purple-50 text-purple-700` on the current route's link. The reference is a
Base44 SPA whose SSR shell ships **bare `<a href>` tags with no classes** —
client hydration applies the full class set. A DOM read before hydration (or a
read of the static HTML, which contains only `<a href="/Recent">` etc.) sees
the un-styled pre-hydration state. Session 8's snapshot was taken in that
window; today's audit waited for hydration (`networkidle` + settle) and
cross-checked with two independent methods (VLM on screenshots — which flagged
"Teams nav item highlighted with a light purple background" — and direct
`className` extraction on /Dashboard, /Recent, /Teams — all three confirm).
**Lesson recorded:** parity measurements must be taken post-hydration on SPAs;
the e2e parity pins should assert the hydrated state (Playwright's
auto-retrying `expect` does this naturally).

### Findings (all verified in both DOMs)

| # | Finding | Severity |
|---|---------|----------|
| S10-1 | **Desktop nav active-state pill was wrongly REMOVED in session 8.** Reference (hydrated): current route's link = `bg-purple-50 text-purple-700` (no hover classes on the active variant); other links = `text-gray-600 hover:text-gray-900 hover:bg-gray-50`. Verified on /Dashboard, /Recent, /Teams. Clone today: every link is `text-gray-600 …` with transparent background (the session-8 "fix"), pinned by `tests/e2e/parity.spec.ts` "the desktop nav has NO active-state pill" — the pin itself is wrong and must be reversed. | **High** |
| S10-2 | **Login page carries a footer the reference doesn't have.** Clone renders a "Digma — design workspace" link centered below the auth card (`login-screen.tsx` lines ~323-330). Reference: measured zero text nodes below the card rect (`textBelowCard: []`). | **Medium** |
| S10-3 | **Brand mark differs everywhere.** The reference's logo is a colorful abstract mark on black — decoded pixel-precise this session: black `#0d1017` field; three rows of "split-pill" D-shapes (flat inner edge + semicircular outer edge): red `#f33559` + orange `#f4a24c` (top), purple `#b03af2` + **cyan circle `#4cb6f2` offset right** (middle; a ~40px black gap sits between purple and the circle), green `#20bc72` + blue `#325ddd` (bottom). Header renders it as a 32×32 `object-fit: fill` img (the 651×470 source stretched); the login chip renders it `object-cover` inside the `h-20 w-20 sm:h-24 sm:w-24 rounded-full shadow-lg ring-4 ring-white/50` container. The clone ships its own mark (slate rounded square + 2×2 colored squares) and paints the login chip's inner with a blue→purple gradient. Session 8 kept this as a "documented substitute" because the reference serves a hosted JPEG; the geometry is simple enough to recreate as inline SVG (measured + redrawn, no asset copied — the same approach used for every other UI surface). | **Medium** |

### Verified parity-hold (no change)

- Dashboard: hero (greeting/gradient/`text-xl font-bold` h1), Quick Stats card,
  Create New Design = `bg-white text-purple-600 hover:bg-gray-50` (identical
  class set), Explore Templates, view toggles (active = near-black `#171717`
  `bg-primary`, inactive ghost/accent — matches).
- Recent: bare `flex gap-2` toggle row (`w-10 h-10`), sort dropdown, search
  (`h-9` `md:w-80`), subtitle `text-gray-500 mt-1`.
- Teams: flat `main` (`min-h-[calc(100vh-4rem)]`), Create Team =
  `shadow h-9 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium`,
  empty state (`py-16`, plain `text-gray-300` Users glyph, `text-xl font-semibold`
  h3, blue "Create Your First Team" `rounded-md px-4 py-2`), `md:` header row.
- Editor: 9-tool rail with identical lucide icons in identical order (incl.
  `lucide-image` for Image — VLM's "different icon" flag was the dev-tools
  overlay obscuring the screenshot), zoom cluster `[100%][ZoomIn][ZoomOut]`,
  AI panel h-80 chrome (Bot header, avatar rows, timestamp-below bubbles,
  blue send), top bar, Share/Present colors.
- Login: three-state auth card (ADR-013 structure re-confirmed live on the
  reference: sign-up = minimal card + Confirm Password; forgot = "Reset your
  password" + email-only).
- Mobile: the reference STILL ships no mobile nav at 390×844 (nav
  `display:none`, no hamburger — failure class A). The clone's fix verified
  end-to-end again this session (44×44 trigger → drawer → tap "Recent" →
  navigates AND dismisses).
- Fonts/colors: the clone loads Inter (reference uses the `ui-sans-serif`
  system stack — Inter stays the documented self-hosted choice); all palette
  pins hold; every lucide icon matches (clone's extra `lucide-menu` = the
  mobile fix).
- Tailwind v4 health: `@theme` literal-font + palette pins verified in
  `globals.css`; `tests/theme.test.ts` green; no `tailwind.config.js`.

### Non-parity observations (documented, not fixed)

- Next 16.3.6 dev-server deprecation warning: the `middleware` file convention
  is deprecated in favor of `proxy` (still fully functional). Migration is a
  modernization task, not a parity task — recorded in PAD §10 instead.
- The dev-only Next.js dev-tools indicator ("N" button, bottom-left) appears
  in dev screenshots; it does not exist in production builds. Not a parity
  surface.

---

## P1 — Code changes (TDD, one slice per finding)

### S10-1. Restore the desktop nav active-state pill (revert of session-8 R2)

- **File:** `src/components/app-header.tsx` (desktop nav map, ~lines 143-158).
- **Fix:** mirror the MobileNav pattern that already ships in the same file:
  `active ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"`
  on the shared base `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors`.
  The reference's active variant carries NO hover classes; keep `aria-current="page"`
  (a11y, already present). Rewrite the code comment to record the corrected
  measurement + the hydration lesson.
- **Tests (RED first):**
  - `tests/e2e/parity.spec.ts`: REVERSE the "no active-state pill" test →
    "the desktop nav highlights the CURRENT route (reference parity)": on `/`
    the Dashboard link paints `faf5ff` (purple-50) with `7e22ce` (purple-700)
    text while Recent/Teams stay transparent; on `/Teams` the Teams link is
    the highlighted one (two-route pin so a static-class bug can't pass).
    Pixel-read via the canvas trick (v4 emits lab()/oklch() strings).
  - Confirm `tests/e2e/mobile-navigation.spec.ts` unaffected (drawer already
    styles active links).

### S10-2. Remove the login page's below-card footer

- **File:** `src/components/login-screen.tsx` (the `mt-4 text-center` block,
  ~lines 323-330) — delete the block and its now-dead `Link` import if unused
  elsewhere in the file.
- **Tests (RED first):** `tests/e2e/parity.spec.ts` (logged-out describe):
  "nothing renders below the auth card (reference parity)" — assert the
  card's parent contains no visible text nodes below the card rect, and the
  "design workspace" footer string is absent from the page.

### S10-3. Recreate the reference brand mark as inline SVG

- **Files:**
  - `src/components/logo.tsx` — replace `LogoMark` with the decoded mark
    (keep the exported name `LogoMark` so all call sites keep working; same
    default `h-8 w-8`). Draw in the source image's 651×470 coordinate space
    with two render modes: default square crop (viewBox `90 0 470 470`,
    default preserveAspectRatio — what the login chip shows) and a `stretch`
    prop (viewBox `0 0 651 470` + `preserveAspectRatio="none"` — reproduces
    the reference header's `object-fit: fill` squeeze at w-8 h-8).
    Geometry (from pixel measurement of the hosted mark):
    - red D-shape (flat right edge x=306, y 65→180; semicircle center
      (234.5, 122.5) r 57.5) `#f33559`
    - orange mirrored-D (flat left x=308, y 66→177; semicircle center
      (380.5, 121.5) r 55.5) `#f4a24c`
    - purple D-shape (flat right x=310, y 180→295; center (234.5, 237.5)
      r 57.5) `#b03af2`
    - cyan circle center (414, 235) r 62 `#4cb6f2` (offset right — the gap
      between purple's flat edge and the circle is part of the mark)
    - green D-shape (flat right x=306, y 295→410; center (234.5, 352.5)
      r 57.5) `#20bc72`
    - blue mirrored-D (flat left x=308, y 293→410; semicircle center
      (375.5, 351.5) r 58.5) `#325ddd`
    - background rect `#0d1017`
  - `src/components/app-header.tsx` — header usage: `<LogoMark stretch …>`
    reproduces the reference's stretched 32×32 img (square, no rounding —
    the reference header logo has `border-radius: 0`).
  - `src/components/login-screen.tsx` — chip inner: replace the
    `bg-gradient-to-br from-blue-500 to-purple-600` span content with the
    mark (square-crop mode, `h-full w-full`); the outer chip container
    (`rounded-full overflow-hidden shadow-lg ring-4 ring-white/50`) is
    already reference-exact and stays.
  - `public/logo.svg` — regenerate with the same mark (square crop) so the
    favicon/metadata icon matches.
- **Tests (RED first):**
  - `tests/theme.test.ts` (source-contract pattern, same as the existing
    `@theme` pins): `src/components/logo.tsx` contains all six brand hexes +
    the `#0d1017` field, contains a `<circle` (the cyan counter), and no
    `from-blue-500 to-purple-600` gradient remains in `login-screen.tsx`.
  - `tests/e2e/parity.spec.ts` (logged-out): the login chip contains the
    mark svg and its inner surface paints no gradient
    (`background-image: none`); the header renders the mark svg.

## P2 — Documentation alignment (post-fix)

- **PAD → v1.6.0:** revision block (S10-1/2/3 + the hydration-timing lesson +
  the audit provenance), §10 known-issues row for the Next 16 middleware →
  proxy deprecation (informational), test-count refresh.
- **AGENTS.md / CLAUDE.md:** nav-pill fact corrected (active pill IS reference
  parity — with the measurement lesson), logo-mark note updated (decoded
  inline-SVG recreation replaces the "substitute" wording), counts.
- **README.md:** design-system note (brand mark recreation), screenshots
  refreshed, counts.
- **digma_SKILL.md:** lessons + spot-checks + counts.
- **docs/session_10.md** (new session log) + `worklog.md` Task 28 entry.

## P3 — Delivery

- Screenshots: re-capture the affected surfaces (login 3 states, dashboard,
  recent, teams, editor, mobile set) from the remediated dev server →
  `docs/screenshots/` (session-10 pass).
- `.env.example`: re-verify against the codebase (DATABASE_URL relative rule,
  `DIGMA_REPO_ROOT`, `AUTH_SECRET`) — expected unchanged; include in commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …` (the
  sandbox exports an absolute `DATABASE_URL` that re-inherits into every
  shell; the parent workspace `.env` is neutralized to the same relative URL).
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build →
  ./scripts/smoke-test.sh → test:e2e` — all green before push.
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- Mobile navigation fix (reference still ships failure class A; clone verified
  end-to-end this session).
- Inter as the app font (the reference's `ui-sans-serif` system stack is its
  own choice; Inter is the clone's documented self-hosted font — pinned by
  `tests/theme.test.ts` + the parity font check).
- All session-8 parity fixes other than the reversed R2 (toggles, Teams page,
  zoom icons, AI panel chrome, layers hover, palette pins, literal fonts).
- `src/middleware.ts` (works; deprecation recorded in PAD §10).
- Editor chip guards, Untitled editor, autosave replace contract, AI
  degrade-not-fail, toast infra — all pinned by existing suites.
- The reference's own bugs deliberately not cloned (AI crash, Tailwind CDN,
  no-op Create Team buttons, missing mobile nav).

---

## Execution status (end of session 10)

**All items EXECUTED and GREEN** — S10-1/2/3 fixed, TDD-first (RED: 6 unit + 3 e2e failures as designed → GREEN), full gate green (`lint · typecheck · 72/72 unit (66+6 brand-mark) · build 20 routes · 28/28 smoke · 53/53 e2e (51+2 net-new parity checks)`). En-route validation: the recreated mark was rendered via canvas and pixel-verified against the reference before landing (all six shape centers + the gap + the field match to the hex); the nav pill's presence was confirmed by pixel forensics on a settled reference screenshot (181 purple-700 text + 3,910 lavender pill pixels vs zero in the immediate post-load capture — the hydration-timing root cause of session 8's misread, recorded as lesson F11 in `digma_SKILL.md` §12). 16 screenshots re-captured; docs aligned at PAD v1.6.0 / digma_SKILL v1.5.0.
