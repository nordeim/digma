# Session 61 — The Twenty-Seventh Parity Audit: The Canvas PNG Export (S51-1 + S51-2 + S51-3)

**Date:** 2026-10-01 · **Code state at start:** `fc2e5aa` (session 50
delivered at `27f9945`; the operator's `docs/session_60.md` transcript
push on top) · **Code state at end:** this commit · **Docs:** PAD
v1.30.0 · digma_SKILL v1.29.0 (lesson F38)

## Directive

The operator's session-60 directive: refresh the workspace, re-internalize
the mandated docs (AGENTS, CLAUDE, README, PAD, digma_SKILL, the session
logs, the worklog), validate the understanding against the codebase, then
iterate to visual and functional parity with
`https://digma-371dfd0d.base44.app/` — paying particular attention to the
MOBILE NAVIGATION menu (watching for the Tailwind v4 bug class),
using the repo's skills (Tailwind v4, clone-app-pat-pro, agent-browser,
tdd), the scandihaven tech-stack patterns, a TDD remediation pass, the
vitest + playwright suites, the `DATABASE_URL="file:../db/custom.db"` +
`db/` at the repo root configuration, fresh screenshots under
`docs/screenshots/`, a verified `.env.example`, aligned docs, and the
SSH-wrapper push to `main`.

## The audit (twenty-seventh consecutive)

**Baseline before any change:** the workspace refreshed (`git pull` —
`fc2e5aa`, the operator's session-60 transcript), the fast gates green
(lint · typecheck · 137 unit), the dev server healthy with the
`[db] DATABASE_URL -> …/digma/db/custom.db` anchor, the DB seeded (1
user, 2 projects, 6 elements, 1 team — the pristine contract), and the
standing configs verified (vitest + playwright wired with `skills/`
excluded everywhere; `.env` carrying the root-anchored relative URL;
`.env.example` matching the codebase). The documented environment trap
demonstrated itself live during validation — the parent workspace
exports `DATABASE_URL=file:/home/z/my-project/db/custom.db`
(out-of-repo; the first Prisma probe died with Error code 14 until the
unset-in-the-same-command discipline applied).

**The method:** the session-60 suggested next step #1 drove the target —
the canvas print/export surface (PNG) — plus the standing sweeps (R3
27th, the desktop drift check, and the full live verification of the
clone's mobile navigation at 390×844, the operator's particular focus).
No reference board mutations; the only reference-side actions were the
operator's own account login + read-only probes (+ two clicks on the
reference's own dead Create-Team buttons and one click on its own mobile
Properties chip — a client-side visibility toggle, not a data mutation).

### Reference findings (live-measured; desktop 1440×900, mobile 390×844)

- **The Teams Create-Team dead chrome (27th datum): still dead.** Both
  buttons open ZERO dialogs (live-verified one click each; the
  `[role=dialog]` count stayed 0 after both). The Teams page still
  renders its EMPTY state ("No teams yet").
- **R3 re-confirmed (27th): mobile nav failure class A at 390×844** —
  the reference's desktop nav computes `display: none`, its three links
  collapse to 0×0, no hamburger exists, and the only header button is
  the unlabeled 36px dead bell. Evidence:
  `docs/screenshots/ref-audit-s58/ref-01-mobile-dashboard-390.png`.
- **Standing surfaces re-verified (no drift):** the greeting reads
  "Good morning, sepnetflix2023 ✨" (the name still populated — the
  session 49/50 state); Quick Stats 1 Projects / 0 Teams / 1 Active this
  week / Pro; the Recent sort default `last_accessed` with its four
  options; the board still carries 9 layers (Rectangle 1-4, Line 5-6,
  Circle 7, Text 8, Frame 1).
- **The reference's editor carries NO keyboard-shortcut affordance
  (27th datum):** the nine tool titles without shortcut text, zero
  `kbd` elements, no dialog.
- **The reference's mobile editor header STILL clips Share/Present at
  390×844:** re-measured Share L394–R467, Present L475–R559 — the same
  failure class as sessions 48/49/50 (both fully off-screen). Evidence:
  `docs/screenshots/ref-audit-s58/ref-02-mobile-editor-header-390.png`.
- **A REFINEMENT of the session-50 mobile-editor datum:** the
  reference's mobile editor DOES render its bottom chip bar at 390×844
  (Layers/Components/Properties at **24px** targets — under any touch
  floor) and its panels at SQUEEZED/CLIPPED widths (Layers 210px of its
  240px design; the Properties panel a ~126px off-screen sliver of
  288px), and the chips ARE functional toggles (clicking Properties
  closed the sliver — client-side state only). The functional
  conclusion stands: **no USABLE properties/text-editing surface at
  mobile** — a 126px clipped panel cannot carry the five TEXT controls,
  the chip targets are 24px, and the only inputs at mobile are the AI
  chat input + the background-color picker pair (zero text-content
  inputs, confirming the session-50 measurement). The clone's
  deliberate gating + the Edit-text chip + bottom Sheet remain the
  superior working superset.

### The clone's mobile navigation verified LIVE, end-to-end at 390×844

(the operator's particular focus): the 44×44 hamburger with the stable
`aria-label="Navigation menu"` + `aria-expanded`/`aria-controls`
contract; the Sheet opens as a dialog (labelled via its "Digma"
SheetTitle) with the three links at 44px targets; `data-scroll-locked`
engages on `<body>` with `overflow: hidden`; Escape closes with focus
returning to the trigger AND the lock releasing; a link tap navigates
AND dismisses; at 768 the hamburger computes `display: none` and the
desktop nav `flex` (and the inverse at 390). **The Tailwind v4 failure
class A is NOT present in the clone — the 27th consecutive session.**

## The delivered work — the canvas PNG export (the session-60 suggestion #1)

A pure clone superset (the reference has no export anywhere; Present is
its only output surface). The placement was studied BEFORE building:
the first design put the Download chip in the editor header, but the
tablet 600 short-name pin asserts a single 48px row and the header's
right group sits ~20px under that threshold — a 44px button would break
the pin. The chip lives in the zoom cluster (the Keyboard chip's S49-2
direct sibling), which carries no flex arithmetic, renders at every
viewport (the F37 rule), and matches the export's semantics (a canvas
action). Measured at 390×844 the five-chip cluster spans ~232px — fully
in-viewport.

- **S51-1 — the pure seams (`src/lib/export-png.ts`):**
  `elementsToSvg` serializes the fixed 1000×700 board (the Present
  overlay's own canvas area — "the export is the presentation, as a
  file") as a standalone SVG document whose mapping rules mirror the
  DOM render sites: the transform chain (CSS `translate(x,y) scale(s)
  rotate(r)` with origin 0 0 ≡ the SVG transform attribute); the ONE
  paint chain with `<defs>` gradient serialization (the CSS-angle →
  SVG-vector math) + the image `preserveAspectRatio` table; the
  **border-box stroke inset** (Tailwind preflight vs the centered SVG
  stroke — sw/2 per side); the line's SVG diagonal (RA-8); the
  flex-centered text geometry (text-anchor/x +
  `dominant-baseline="central"` + per-line tspans, block-centered);
  the frame's border-without-label (RA-19); visible skipped, locked
  rendered. Plus `exportFilename` and the browser-only rasterize
  helpers (`svgToPngBlob` at 2× — with the documented webfont fidelity
  limit — and `downloadPng`).
- **S51-2 — the chip + handler in `editor-view.tsx`:** the cluster
  chip chrome, the lucide `Download` icon, `aria-label` +
  `title` "Download PNG", visible at every viewport; the handler reads
  the store at call time (`getState()` — no new shell subscriptions)
  and toasts on both paths (the degrade-not-fail discipline).
- **S51-3 — the tests:** `src/lib/export-png.test.ts` (23 unit checks
  on every mapping rule) + `tests/e2e/export-png.spec.ts` (4 e2e
  checks on the SELF-CONTAINED API-created fixture — F37c: created per
  test, deleted in finally, swept in afterAll): the cluster's
  DOM-boundary guard (the reference-measured trio keeps exactly Zoom
  in + Zoom out), the click-produced download (the `.png` suggested
  filename, the PNG magic bytes, the IHDR 2000×1400), the success
  toast, and the F35 in-viewport mobile geometry + the tap-produced
  download.

## The TDD execution

**RED (unit):** the spec ran at the absent module (`Cannot find package
'@/lib/export-png'`). **GREEN:** 160 = 137 + 23 — with two first-draft
assertion bugs fixed en route (the text renders as
`<tspan>Hello</tspan>` not `>Hello</text>`; the multi-line first-line y
is H/2 − (n−1)·line/2, not H/2).

**RED (e2e):** the spec ran 4/4 failures against the pre-fix build (the
chip absent; the 5th "pass" was the auth setup project). **GREEN:**
168 = 164 + 4 — with one locator bug fixed en route: the cluster guard
first used `locator.filter(fn)` (which receives a Locator, not an
Element — `.first()` matched an outer div whose parent contains
everything); the parity spec's childless-"100%"-pill discriminator is a
`page.evaluate` pattern, and the guard became the same evaluate.

**Full gate green: lint · typecheck · 160 unit (+23) · build 23 routes
(unchanged) · smoke 56/56 (unchanged) · e2e 168/168 (+4 — the full
suite order-validated; the parity pins green, no fixture leakage).**

## The live verification (dev server, post-fix)

- The chip at [501,64] 34×34 at 1440×900 — the Keyboard chip's direct
  sibling (8px gap, the cluster's `gap-2`).
- The click → the success toast "PNG downloaded /
  Marketing Hero Banner.png".
- The chip at [261,93] 34×34 IN-VIEWPORT at 390×844; the tap → the
  same download round-trip.

## Delivery

- The standard 26 screenshots re-captured (the auth-card set
  re-captured after a viewport-ordering bug in the first capture
  script — 01/14–18 first landed at 390) + **27-export-png-desktop.png
  + 28-export-png-mobile.png** (the new pair) + the ref-audit-s58 set
  (ref-01 the reference's mobile dashboard failure-class-A evidence,
  ref-02 the reference's clipped header, clone-01/02/03 the baseline +
  the export toast + the mobile chip) — 33/33 dimension-checked, the
  key shots VLM content-verified (all PASS).
- `.env.example` verified unchanged (no new env vars — a pure seam, a
  chip, and tests); included in the commit.
- Docs aligned: PAD v1.30.0 (the header + the revision block), AGENTS.md
  (the counts + the export bullet), CLAUDE.md (the counts + the pin
  inventory), README.md (the counts + the export row + the screenshots
  section), digma_SKILL v1.29.0 (lesson **F38** — the DOM→SVG export
  mapping rules; the webfont fidelity limit; the placement study:
  before placing new editor chrome, audit it against EVERY pinned
  geometry contract it could shift; assert the download ARTIFACT bytes,
  never the UI state; the locator.filter vs page.evaluate
  discriminator), the plan's execution status, this log, and the repo
  worklog entry.
- Full gate re-verified green before the commit; pushed to `main` via
  `docs/ssh_git_wrapper_v3.py` (the key shredded after).

## Suggested next steps

The reference's standing surfaces remain pinned and drift-free — the
27th audit found no reference-side gaps. For a twenty-eighth session,
the remaining candidates from the session-60 list: a
Lighthouse/accessibility pass over the five routes (the mobile-nav and
dialog contracts are already a11y-shaped; a systematic sweep would pin
contrast/focus-order/lighthouse scores — the production standalone
server makes the run reproducible); extending the mobile Sheet to the
other properties sections (Position & Size, Fill & Stroke — the
shared-section architecture makes that a small,
convention-following step); or an SVG export format alongside the PNG
(the serializer already produces the SVG — a second download option
would be a menu, not a new seam). The mobile navigation itself needs
nothing — 27 consecutive sessions green.
