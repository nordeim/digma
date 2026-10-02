# Remediation Plan — Session 58 (the Thirty-Fourth Audit)

**Date:** 2026-10-02 · **Trigger:** the operator's session-73/74 directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and the Tailwind v4 bug class, use the scandihaven tech-stack patterns, TDD, vitest + playwright, `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, screenshots under `docs/screenshots/`, a verified `.env.example`, aligned docs, push via the SSH wrapper to `main` only) · **Code state at start:** `e9833d0` (session 57 delivered at `3e95a18` + the operator's session-74 log push)

## The audit method

The thirty-fourth consecutive live parity audit on
`https://digma-371dfd0d.base44.app` (desktop 1440×900, mobile 390×844),
PLUS the sixth systematic **Mode C code audit of the recent changes** —
this session's pass combined (a) the lead auditor's hunk-by-hunk review of
the session-57 delivery (all six seams re-verified intact in source: the
`loadProject` gestureSnapshot reset at editor-store.ts:160, the
`onPointerCancel={onPointerUp}` wiring + the `buttons === 0` hover guard
at canvas.tsx:186/373, the disposed gates + the ensureProject adoption
guard + the captured PUT body in editor-view.tsx, the extended menu
stand-down selector at editor-view.tsx:295, `isSpaceActivationTarget` at
canvas.tsx:518, the AI did-flag at ai-assistant.tsx:98-107, the
visible-aware select-all flip + the eye focus variant + the single toolbar
separator), (b) TWO independent fresh-eyes full-file reviews by separate
agents — auditor A over the non-editor views + auth screens + page files
(dashboard-view, recent-view, teams-view, app-header, login-screen,
reset-password-screen, project-card, the app pages, use-toast, the Sheet
and Toaster wrappers), auditor B over the complete API surface + libs +
the full editor-view.tsx (every route handler, api.ts, auth.ts,
rate-limit.ts, validation.ts, team.ts, greeting.ts, editor.ts, utils.ts,
db.ts, db-path.ts, ai-assistant.ts, export-png.ts, seed.ts, schema.prisma,
proxy.ts) — against the code-review-checklist dimensions, and (c) the
lead's own re-verification of EVERY chosen finding in source before this
plan. The baseline gate was re-proven green BEFORE any change: lint ·
typecheck · 231 unit · build 23 routes · 56 smoke · 192 e2e.

## Reference findings (34th audit — no drift, no new gaps)

- **R3 re-confirmed (34th): mobile nav failure class A at 390×844** —
  the reference's desktop nav computes `display: none`, its three links
  collapse to 0×0, no hamburger exists, and the only header button is
  the unlabeled 36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s68/ref-01-mobile-dashboard-390.png`.
- **The Teams Create-Team dead chrome (34th datum): still dead** — both
  buttons clicked, the `[role=dialog]` count stayed 0, still on `/Teams`.
- **Standing surfaces re-verified (no drift):** the greeting "Good
  morning, sepnetflix2023 ✨" (H1, the name populated — the morning
  bucket); Quick Stats 1 Projects / 0 Teams / 1 Active this week / Pro;
  the Recent sort default "last_accessed" (displayed "Last Opened") /
  "1 file found"; the board at 9 layers — still "Test Project One"
  (evidence ref-03); the desktop nav 124/96/92 × 36 with the 36px
  unlabeled bell (evidence ref-00); zero `kbd` affordances (34th datum).
- **The reference's mobile editor header STILL clips Share/Present at
  390×844:** Share L385–R458, Present L466–R551 (re-measured exactly;
  evidence `docs/screenshots/ref-audit-s68/ref-02-mobile-editor-header-390.png`).

### The clone's mobile navigation verified LIVE, end-to-end at 390×844

(the operator's particular focus — the 34th consecutive session, all
green via the single-call verifier
`/home/z/my-project/scripts/verify-mobile-nav-s58.sh`, 8/8 PASS; the
Tailwind v4 failure class A NOT present): the 44×44 hamburger with the
stable `aria-label="Navigation menu"` + `aria-expanded`/`aria-controls`
contract at [16,10]; the Sheet as a `role=dialog` (288px drawer) with
the three links at 44px targets and the aria-describedby wiring;
`data-scroll-locked` on `<body>`; focus in the trap; Escape close with
focus return + lock release; navigate-and-dismiss; the S56-I
md-crossing close re-verified live (390→1280 — the drawer unmounts with
lock release); the 768 boundary (the hamburger `display:none`, the
desktop nav `flex`).

## The code audit findings (Mode C — sixth pass)

The session-57 delivery itself is clean (all six seams verified to
hold; the 231/56/192 gate re-proven green at baseline before any
change). The two fresh-eyes passes found **0 High / 6 Medium / 12 Low /
8 Informational** combined — every chosen finding individually
re-verified by the lead in source:

- **A-M-1: the Recent GRID rename silently reverts to the old name.**
  `recent-view.tsx:386` — the grid branch's `onRenamed` ignores the
  updated DTO that `ProjectCard` passes (the PATCH response's fresh
  project) and re-inserts the STALE pre-rename closure object
  (`p.id === project.id ? project : p`), so the card title shows the OLD
  name immediately after a successful rename + "Project renamed" toast,
  until a reload. The LIST branch does it correctly (`:397-399` uses the
  `updated` arg); the Dashboard refetches — only the Recent grid (the
  DEFAULT view) is broken, and the rename e2e pin only exercises `/`.
- **A-M-2: keyboard activation of the card's ellipsis menu navigates to
  the editor instead.** `project-card.tsx:385` — the ellipsis wrapper
  stops CLICK only; its two sibling seams (the rename row `:240-241`,
  the delete dialog `:460-461`) stop click AND keydown. The card root's
  `onKeyDown` fires `openProject()` on any Enter/Space bubbling from
  descendants, so focusing the ellipsis and pressing Enter both toggles
  the menu AND navigates to `/Editor?projectId=…`, unmounting the menu
  (Radix's trigger/menu-item keydown handlers never stopPropagation; the
  portaled menu items bubble through the React tree — the documented
  S31-3 mechanism). Keyboard users cannot Rename/Delete from any grid
  card on Dashboard or Recent.
- **A-M-3 (security): open redirect via unvalidated `from_url` after
  login/verify (CWE-601).** `login-screen.tsx:31/140/175` —
  `fromUrl = params.get("from_url") || "/"` is never validated, then
  `router.push(fromUrl)` after sign-in and after OTP verify. Next 16's
  router hard-navigates external URLs (`location.assign`) — a crafted
  link `/login?from_url=https://attacker.example` sends the victim
  off-site immediately after authentication.
- **A-M-4: the header search does nothing when already on /Recent.**
  `recent-view.tsx:259` + `app-header.tsx:171` — the view seeds its
  search state from the param via a `useState` INITIALIZER with no
  sync; on a same-route soft navigation (searching from the header
  while already on /Recent) the URL updates but the filter and the
  page's own search box never change.
- **B-M-1: the PresentOverlay collapses multi-line TEXT elements to a
  single line.** `editor-view.tsx:545-573` — the present-mode text style
  has NO `whiteSpace`/`overflow` (and `fontSize ?? undefined` instead of
  the canvas's `?? 16`), while the canvas seam (`editor.ts:355-359`)
  carries `whiteSpace: "pre-wrap"` + `overflow: "hidden"` + `?? 16` +
  `fontWeight ?? "500"`. The seeded project's own Headline carries
  `text: "Design faster,\ntogether."` — in Present mode HTML collapses
  the newline into one overflowing line.
- **B-M-2: `GET /api/projects` embeds the FULL element list of EVERY
  project (unbounded payload) + dead query params.**
  `api/projects/route.ts:16-25` — no `take`/projection; each element may
  legally carry a ~700K-char `fillImage` data URL; the `search`/`
  template` params have zero client callers. **Deferred with rationale
  below** (an API-surface design change feeding the thumbnail contract).
- **A-L-1: the team delete confirm has no in-flight guard.**
  `teams-view.tsx:228` — the "Yes, Delete" button has no
  `disabled`/submitting state (unlike both project delete dialogs:
  `project-card.tsx:476`, `recent-view.tsx:244` — the
  `disabled={deleting}` convention); a double-click fires two DELETEs
  and the loser renders a spurious destructive toast.
- **A-L-2: the Editor session-expiry redirect drops `?projectId`.**
  `Editor/page.tsx:12` — `redirect("/login?from_url=/Editor")` discards
  the query string; after re-login the user lands on `/Editor` in
  Untitled mode instead of the project they were opening.
- **A-L-3: the Dashboard Quick Stats go stale after an in-page delete.**
  `dashboard-view.tsx:205/307` — `onDeleted` only filters the project
  list; `/api/stats` is never refetched (the create path DOES:
  `:353`), so the hero's counts keep the pre-delete values.
- **B-L-2: the reset-password 429 lacks the documented `Retry-After`
  header.** `reset-password/route.ts:21` — `fail("RATE_LIMITED", …, 429)`
  while all five sibling auth routes build the raw envelope with
  `headers: { "Retry-After": … }` (the AGENTS-documented limiter
  contract).
- **B-L-6: a dead ternary in the fallback add-shapes reply.**
  `ai-assistant.ts:210` — `fill.toLowerCase() === "#3b82f6" ? "" : ""`
  — both branches yield `""`; the color-naming intent never fires. The
  honest fix is REMOVING the dead code (the reply "Added N squares." is
  the PINNED contract — three e2e/unit sites — so implementing the
  color-naming intent would break the documented replies).
- **B-L-7: Share in Untitled mode copies a projectId-less URL.**
  `editor-view.tsx:894` — `window.location.href` before the first
  autosave adopts the created id copies `/Editor`, which opens a fresh
  empty Untitled editor for the recipient.
- **Deferred (with rationale):** B-M-2 (above — needs an API-surface
  design decision: projection vs summary vs pagination; the current
  include feeds CanvasThumbnail, the reference does the same, and the
  payload is bounded by the PUT's 2000-row/700K-char caps); B-L-1 (the
  TOCTOU P2025/P2003 races escaping the envelope as raw 500s — the
  double-click LOSER gets an unstructured 500 instead of the 404
  envelope; cosmetic shape, no corruption; a try/catch sweep across six
  routes); B-L-3 (resend-otp's 409 enumeration asymmetry — auth-parity-
  sensitive, the reference's own resend behavior unmeasured, the IP
  limiter bounds probing); B-L-4 (register's uncapped name/email —
  bounded by the shape regex; apply with the validation doctrine on the
  next touch); B-L-5 (verify-otp's non-atomic counter — the parallel
  window is bounded by the 10/15min limiter); B-L-8 (Math.random OTP vs
  the misdocumented "crypto-random" — the code rides in the response to
  the same requester); B-L-9 (the duplicate route's non-transactional
  create + name-cap bypass — a crash-window orphan with no user-visible
  path); I-1..I-8 (the informational set: the shared-workspace
  ownership design, the XFF trust + O(n) limiter sweep, the unthrottled
  AI route, the POST-elements divergence, clampNumber's null coercion,
  the dead thumbnailSeed, the autosave 401 loop note, the triplicated
  call() helper).

### Verified clean (explicitly re-checked)

All six session-57 seams hold exactly as documented (verified in source
this session — see the audit method). Additionally verified clean by the
fresh-eyes passes: every API route's session-gating (requireSession
first line on every non-public route), the elements route's S56 seams,
the auth routes' RA-58..66 contracts, the export-png escaping, db-path's
anchor detection, the use-toast globalThis singleton, the MobileNav +
bell popover + md-crossing listener, the reset-password-screen phases,
the teams API validation, the proxy exact-match redirects, and the
editor-view autosave machine's full file (serialization, disposed
gates, adoption guard, captured body, gesture deferral, pending
re-run, the two mobile Sheets' lifecycle).

## The chosen session work (TDD)

### S58-A — the Recent grid rename staleness (A-M-1)

- The grid branch's `onRenamed` adopts the updated DTO:
  `onRenamed={(updated) => setProjects((prev) => prev.map((p) => (p.id
  === updated.id ? updated : p)))}` — matching the list branch exactly.
- **Unit pin:** `tests/recent-grid-rename.test.ts` — the source
  contract (the grid branch consumes the `updated` arg, not the stale
  `project` closure).
- **E2e pin:** rename in the Recent GRID (the default view) via the
  ellipsis → inline rename → the card title shows the NEW name
  immediately (no reload); the test renames back in `finally` (the
  order-independence discipline).

### S58-B — the ellipsis keyboard stand-down (A-M-2)

- The ellipsis wrapper (`project-card.tsx:385`) gains
  `onKeyDown={(event) => event.stopPropagation()}` — the file's own
  established convention (the rename row and the delete dialog both
  stop click AND keydown). Enter/Space on the ellipsis trigger now
  toggles the menu WITHOUT navigating; Enter/Space on the portaled menu
  items no longer bubbles to the card root.
- **Unit pin:** `tests/ellipsis-keyboard.test.ts` — the source
  contract (THREE wrapper seams each stopping both click and keydown).
- **E2e pin:** focus the ellipsis on a Recent card → press Enter → the
  menu opens AND the URL stays `/Recent` (no editor navigation).

### S58-C — the login redirect integrity (A-M-3 + A-L-2)

- `safeFromUrl(raw)` in `src/lib/validation.ts`: the target must be
  site-local — a leading `/` that is NOT protocol-relative `//`;
  anything else (absolute URLs, backslashes, empty) falls back to `/`.
- `login-screen.tsx` consumes it: `const fromUrl =
  safeFromUrl(params.get("from_url"))`.
- The Editor page's session-expiry bounce preserves the project:
  `redirect(\`/login?from_url=${encodeURIComponent(target)}\`)` where
  the target is `/Editor?projectId=<id>` when present (Next 16
  `searchParams` Promise prop), `/Editor` otherwise.
- **Unit pins:** `src/lib/validation.test.ts` — the behavioral pins
  (site-local passes verbatim; `https://…` → `/`; `//evil` → `/`; empty
  → `/`; a path with a query passes). Plus the source-contract pins:
  the login screen consumes `safeFromUrl`; the Editor page encodes the
  projectId into the bounce.
- **E2e pin:** `/login?from_url=https://attacker.example` + a
  successful demo sign-in → the URL stays on the app (the dashboard),
  never the external origin — in `auth.spec.ts` under a DEDICATED
  `X-Forwarded-For` bucket (the session-45/46 pattern; the shared-bucket
  budget stays at 9/10).

### S58-D — the header-search same-route sync (A-M-4)

- `RecentView` gains the render-time compare-and-adjust pattern (the
  S53-A GuardedNumberInput family — the repo's sanctioned
  adjust-state-during-render idiom, no effect): a `paramsKey` snapshot
  state; when `params.toString()` differs, both the key and the search
  re-derive from the fresh params. Same-route header searches now
  update the page's filter; the sort stays untouched (the RA-45
  "resets on fresh LOAD" contract — a param change is not a fresh
  load).
- **Unit pin:** `tests/header-search-sync.test.ts` — the source
  contract (the compare-and-adjust seam present, seeded from the param).
- **E2e pin:** on `/Recent`, submit a header search for a term that
  matches nothing → the "No files found" state renders (the filter
  ran); clear it via the header → the files return.

### S58-E — the PresentOverlay text fidelity (B-M-1)

- The present-mode text style gains the canvas seam's exact contract:
  `whiteSpace: "pre-wrap"`, `overflow: "hidden"`,
  `fontSize: el.fontSize ?? 16`, `fontWeight: el.fontWeight ?? "500"` —
  multi-line text presents as it renders on the canvas (the seeded
  Headline's own "Design faster,\ntogether." becomes the live datum).
- **Unit pin:** `tests/present-text.test.ts` — the source contract
  (the four style seams present in the present overlay's text branch,
  matching `canvasStyleFor`).
- **E2e pin:** present the seeded project → the Headline element's
  computed `white-space` is `pre-wrap` (and the rendered `innerText`
  keeps the two lines).

### S58-F — the Low batch (A-L-1 + A-L-3 + B-L-2 + B-L-6 + B-L-7)

- The team card's "Yes, Delete" gains the `deleting` in-flight guard
  (`disabled={deleting}`, the project-card convention).
- The Dashboard's `onDeleted` also refreshes the stats
  (`refresh()` beside the list filter — the create path's precedent).
- The reset-password 429 gains `Retry-After` via the raw-envelope
  pattern (the five sibling routes' convention).
- The fallback add-shapes reply's dead ternary is REMOVED (the reply
  string unchanged — the pinned contract).
- `onShare` guards the Untitled mode: an empty `store.projectId`
  renders an honest "Share unavailable" toast instead of copying a
  projectId-less URL.
- **Unit pins:** `tests/low-batch-s58.test.ts` — the five source
  contracts.
- **E2e pins:** a double-click on the team delete (a route-intercepted
  delay) fires ONE DELETE; a Dashboard in-page delete refreshes the
  stats card; Share in Untitled mode shows the unavailable toast.

## Planned counts

unit 231 + ~17 = ~248 (recent-grid-rename 2 + ellipsis-keyboard 2 +
validation behavioral 4 + redirect source pins 3 + header-search-sync 2 +
present-text 3 + low-batch 5, final count per RED phase); e2e 192 + ~8 =
~200; smoke 56; build 23 routes.

## RED expectations

- **unit:** the grid-rename pin fails at the stale closure; the
  ellipsis pin fails at the missing keydown stop; the behavioral
  safeFromUrl pins fail at the absent export; the redirect pins fail at
  the raw `params.get("from_url")` and the projectId-less bounce; the
  search-sync pin fails at the initializer-only state; the present-text
  pins fail at the absent style seams; the low-batch pins fail at the
  absent guard/refresh/header/toast seams and the present dead ternary.
- **e2e (against the pre-fix standalone build):** the grid-rename pin
  fails at the OLD title; the ellipsis pin fails at the navigated URL;
  the from_url pin fails at the external origin; the header-search pin
  fails at the unfiltered list; the present-text pin fails at
  `white-space: normal`; the team double-click pin fails at two DELETEs;
  the stats pin fails at the stale count; the Share pin fails at the
  copied toast.

## Execution order

1. S58-A unit RED → the one-line seam → unit GREEN + fast gates.
2. S58-B unit RED → the keydown stop → GREEN.
3. S58-C unit RED (behavioral + source) → `safeFromUrl` + the login
   consumption + the Editor bounce → GREEN.
4. S58-D / S58-E / S58-F unit RED → the seams → GREEN (231 + ~17).
5. E2E RED against the pre-fix standalone build (the current build
   predates the src changes) → rebuild → e2e GREEN.
6. Full gate: `lint → typecheck → test → build → smoke (dev server
   stopped, `unset DATABASE_URL` same-command) → test:e2e`.
7. Live verification on the standalone build (the mobile nav contract
   re-verified the 34th session running — re-run AFTER the code
   changes) + the screenshot set (the standard 32 + the ref-audit-s68
   evidence set).
8. Docs: PAD v1.37.0, digma_SKILL v1.36.0, AGENTS/CLAUDE/README rows +
   counts, this plan's execution status, the session log
   (docs/session_75.md), the repo worklog entry.

## Execution status

- [x] S58-A — the Recent grid rename staleness (unit +2: the grid branch's
      onRenamed consumes the updated DTO + the list-branch preservation
      pin; e2e: the GRID card shows the NEW name immediately, renamed
      back in the same test)
- [x] S58-B — the ellipsis keyboard stand-down (unit +3: the three
      click+keydown stop pairings + the wrapper pairing + the card-root
      Enter/Space preservation; e2e: Enter on the focused ellipsis opens
      the menu with the URL staying /Recent — pre-fix live-reproduced the
      navigation to /Editor)
- [x] S58-C — the login redirect integrity (unit +7: four behavioral
      safeFromUrl pins + the export/login/Editor-bounce source pins;
      e2e +2 under a DEDICATED XFF bucket: the external from_url NEVER
      leaves the app after sign-in — pre-fix the hard navigation
      live-reproduced — and the site-local /Teams round-trip preserved)
- [x] S58-D — the header-search same-route sync (unit +2: the
      compare-and-adjust seam + the sort fresh-load-only preservation;
      e2e: a header search while on /Recent filters to "No files found"
      and mirrors the page's own search box; clearing restores)
- [x] S58-E — the PresentOverlay text fidelity (unit +3: the
      pre-wrap/overflow/16-500 seams matching canvasStyleFor; e2e: the
      seeded Headline's computed white-space is pre-wrap and the newline
      survives the presentation)
- [x] S58-F — the Low batch (unit +5: the team deleting guard + the
      stats refresh + the Retry-After + the dead ternary gone with the
      pinned reply unchanged + the Share Untitled guard; e2e +3: the
      route-delayed double-click fires exactly ONE DELETE, the stats
      count returns to the pre-create value after the in-page delete,
      Share in Untitled mode answers the honest unavailable toast)
- [x] Full gate green — zero regressions (lint · typecheck · 253 unit
      = 231 + 22 · build 23 routes · 56 smoke · 201 e2e = 192 + 9; the
      fast gates re-verified pre-commit)
- [x] Live verification + screenshots + docs (the mobile nav contract
      re-verified ALL GREEN on the S58 build — 8/8 via the single-call
      verifier, the 34th consecutive session, re-run AFTER the code
      changes; the standard 32 re-captured + the ref-audit-s68 evidence
      set — ref-00/01/02/03 + clone-01/04/05/06 + clone-07 the
      multi-line-present fix evidence — 41 shots ZERO failures, the
      F42(b) drawer-state check inline; 72/72 dimension-checked across
      the standing sets; the key shots VLM-verified — 13/14 direct PASS
      + the one FAIL adjudicated by live geometry per F44b: the exit
      button at [1263,840,161,44] fully in-viewport at 1440×900, the
      board fitted at scale(1.28571) = 900/700; the DB re-seeded to the
      pristine contract after the captures and re-verified; .env.example
      verified unchanged — the six slices add no env vars; docs at PAD
      v1.37.0 / digma_SKILL v1.36.0 (lesson F45) / session_75)
