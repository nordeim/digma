# Remediation Plan — Session 64 (the Twelfth Audit)

**Date:** 2026-10-03 · **Trigger:** the operator's session-86-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the scandihaven tech-stack patterns as reference, TDD, the standing vitest + playwright gates, `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, the screenshots under `docs/screenshots/`, a verified `.env.example`, aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's hunk-by-hunk review of the session-63 delivery (all seven
S63 seams verified intact in source at baseline: the v4
`bg-black/0 … group-hover:bg-black/10` overlay form at
`project-card.tsx:380`, the Teams gray-500 micro-labels at
`teams-view.tsx:275/280`, the `userInitial` prop threaded through both
views, the layers rename `maxLength={80}` at `layers-panel.tsx:188`,
the `safeFromUrl(resetUrl)` guard at `login-screen.tsx:455`, the
Recent `ignore` mount guard at `recent-view.tsx:284`, and the five
dead-code deletions each grep-verified — the `avatarColor` hits that
remain are the DB-backed `SessionUser` shape and the team-member model
field, both legitimate), then the TWELFTH Mode C audit: two
independent fresh-eyes full-file reviews by separate agents over the
least-recently-reviewed surfaces — auditor A over the editor core
(`editor-view.tsx`, `editor-store.ts`, `canvas.tsx`,
`properties-panel.tsx`, the toolbar/layers/components panels, the AI
panel, `lib/editor.ts`, `lib/ai-assistant.ts` — 6,132 lines, last
independently reviewed session 62), auditor B over the server + test
infra side (all 17 API route files, the auth/rate-limit/db/db-path/
validation/api/greeting/team libs, `proxy.ts`, the prisma schema +
seed, the vitest/playwright configs + global setup + smoke script,
both auth screens) — against the `skills/code-review-checklist`
dimensions with the AGENTS/CLAUDE documented contracts loaded first.
Every chosen finding individually re-verified by the lead in source
before this plan. The baseline gate re-proven green BEFORE any change
(363 unit / 70 files · build 23 routes · 56 smoke · 217 e2e), the DB
re-seeded to the pristine 1/2/6/1/3 contract.

## Reference findings (40th audit — no drift, no new gaps)

The standing datums re-verified on
`https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 +
mobile 390×844, the real CDP fill login): the desktop nav 124/96/92 × 36;
the greeting "Good morning, sepnetflix2023 ✨" (the name populated); Quick
Stats 1 Projects / 0 Teams / Pro Plan; the Recent sort `last_accessed` /
"1 file found"; zero kbd affordances; the Create-Team dead chrome the
40th ("Create Team" + "Create Your First Team", 2 clicks, 0 dialogs); R3
mobile nav failure class A the 40th (nav `display:none`, all three links
0×0, no hamburger — the dashboard AND the editor page; evidence
`ref-audit-s74/ref-01` and `ref-02`); the mobile editor header clipping
Share/Present at 390 re-measured exactly (Share L385–R458, Present
L466–R551 — byte-identical to the session-63 measurement; evidence
`ref-audit-s74/ref-02`); the board at 9 layers (the "9 layers" counter +
"Test Project One", opened through the project-card anchor after the
generic card probe missed — the same first-attempt miss as sessions
62/63). Evidence set: `docs/screenshots/ref-audit-s74/` (ref-00 desktop
dashboard, ref-01 mobile dashboard 390, ref-02 mobile editor 390, ref-03
desktop Recent, ref-04 desktop editor).

The clone's mobile navigation verified live, end-to-end at 390×844 —
the 41st consecutive session, ALL GREEN via the single-call verifier
`scripts/verify-nav-s64.sh` (9/9: the 44×44 hamburger with the aria
contract at [16,10], the Sheet dialog with 44px links +
aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape
with focus return + lock release, navigate-and-dismiss, the md-crossing
close, the 768 boundary, and the class-A guard — the Tailwind v4
failure class A NOT present).

## The code audit findings (Mode C — twelfth pass)

The session-63 delivery itself is clean (all seven seams verified to
hold; the 363/56/217 gate re-proven green at baseline before any
change). The two fresh-eyes passes found **0 Critical / 1 High /
3 Medium / 11 Low / 10 Informational** combined — every chosen finding
individually re-verified by the lead in source:

- **A-1 (High): the mobile properties Sheet's `update` helper omits
  the gesture-aware commit.** `editor-view.tsx:828-832` —
  `s.updateElements(s.selectedIds, patch)` without the third argument
  (the store defaults `commit = true`). The desktop panel's helper
  (`properties-panel.tsx:1127-1141`) passes
  `useEditorStore.getState().gestureSnapshot === null` — the S62-A
  fix. The mobile Sheet renders the SAME `PropertiesSections`
  composition (every slider wired to `sliderGesture`), so every slider
  tick and every Content keystroke ON MOBILE pushes a full history
  snapshot: the exact S62-A per-tick flooding defect, re-introduced on
  the one surface the session-62 fix missed. A single 0→100 opacity
  drag on a phone floods the 60-deep `past` stack (~100 entries)
  evicting earlier undo history, and `endGesture` then pushes a
  duplicate entry. The unit pin (`tests/slider-gesture.test.ts`) pins
  `panelSource` only; the e2e pin (`session62-fixes.spec.ts`) drags
  the desktop slider only.
- **A-2 (Medium): the `sliderGesture` begin/blur interleaving race.**
  `properties-panel.tsx:284-323` — the Content input wires
  `onFocus={sliderGesture.begin}` + `onBlur={sliderGesture.finish}`;
  the sliders wire `onPointerDown={sliderGesture.begin}` +
  pointerup/cancel/lostpointercapture `finish`. Moving from a typing
  burst directly onto a slider: pointerdown fires BEFORE the blur (the
  focus transfer is the pointerdown's default action), so the slider's
  `begin()` resets `changed = false` and unconditionally overwrites
  the open gesture snapshot (`beginGesture` has no guard — the
  pre-typing snapshot is LOST, the text edit unreachable by undo),
  then the Content blur's `finish()` sees `changed === false` →
  `cancelGesture()` → the fresh slider gesture is wiped
  (`gestureSnapshot === null` → even the gesture-aware commit reverts
  to per-tick flooding for that whole drag). Both gestures lost in one
  interleaving.
- **A-3 (Medium): `boundsOf` ignores rotation while the hit-test
  honors it.** `lib/editor.ts:380-394` computes the footprint from
  x/y/width×scale only; the canvas hit-test (`elementIsPointInside`,
  `canvas.tsx:59-73`) inverse-maps through the corner-anchored
  rotation. A rotated element is SELECTED where it renders but its
  selection outline, resize handles, marquee containment, and resize
  math all run on the unrotated footprint — a 90°-rotated element's
  outline/handles land completely off its visual bounds. The clone's
  rotation is a superset feature; a superset must be internally
  coherent (the F22 doctrine).
- **B-1 (Medium): the forgot-password route returns the live reset
  token in the response with no production gate.**
  `api/auth/forgot-password/route.ts:49-63` — `resetUrl` (carrying
  the live 64-hex single-use token) rides the 200 for any known email,
  unauthenticated, with no env-gate mechanism (contrast
  `DIGMA_DISABLE_AI_LLM` for the LLM seam). The ADR-014 self-hosted
  deviation is documented as an intention ("production with an email
  service should switch the delivery") — but an intention is not a
  mechanism. The no-enumeration comment is contradicted by the payload
  itself (null vs token).
- **B-4 (Low, new): the register route's findUnique→create race.**
  `register/route.ts:40-53` — a concurrent same-email register throws
  P2002 uncaught → an unstructured 500 (the S56-H/S62-G bare-throw
  family; those sessions caught P2025/P2003 on the elements/PATCH
  routes but missed the register's create).
- **B-12 (Low, new): the reset-password route omits register's
  200-char password cap.** `reset-password/route.ts:53-60` — the
  register route caps password length at 200 (`register/route.ts:33`);
  the reset path accepts unbounded passwords (scrypt cost is
  length-independent — hygiene, but a contract asymmetry).
- **B-6 (Low, new): the resolved `DATABASE_URL` is logged verbatim.**
  `db.ts:13` — `console.log(\`[db] DATABASE_URL -> ${resolvedUrl}…\`)`;
  `db-path.ts` passes postgres URLs through unchanged, so embedded
  credentials (`postgres://user:pass@host/db`) hit stdout the day the
  URL isn't SQLite (the .env.example documents the postgres option).
- **B-7 (Low, new): the two member-creation paths disagree on
  avatarColor.** `teams/route.ts:57` hardcodes `"#3B82F6"` while
  `members/route.ts:32` uses `memberColorFor(email)` — the same email
  invited through the Create-Team dialog vs the Invite Member dialog
  renders two different colors (the S60-C "identical paths" principle
  stated in the route's own comments).
- **A-4 (Low): `isTypingTarget` is duplicated with drifted
  semantics.** `canvas.tsx:540-545` carries a copy WITHOUT the S62-A
  `input[type=range]` carve-out that `editor-view.tsx:357-374` carries
  — two copies of one domain predicate, already drifted.
- **A-5 (Low): no pointer capture on the move/draw/marquee drags.**
  `canvas.tsx:109-183` — the pan branch (line 111) and the resize
  handles (line 468) capture the pointer, but the draw/move/marquee
  branches don't; `onPointerLeave={onPointerUp}` (line 394) terminates
  any drag the instant the pointer crosses into the toolbar/panels/
  assistant — the element stops following and commits mid-drag.
- **A-6 (Low): dead `ring-2 ring-blue-500 ring-offset-0` classes.**
  `canvas.tsx:654` — the inline `boxShadow` selection paint (line 601)
  overrides the Tailwind ring's box-shadow; the classes never paint in
  the selected state (grep-verified zero pins reference them).
- **A-8 (Info, promoted): the TEXT Color row swallows the null
  clear.** `properties-panel.tsx:665` —
  `onChange={(fill) => fill && update({ fill })}` drops the null while
  the sibling Fill/Stroke rows commit it (the S59-E "the Stroke row's
  contract"; the elements route explicitly accepts `fill: null` at
  lines 94/170; the canvas renders `element.fill ?? "#FFFFFF"` for
  text — the coherent clear → default-white).
- **The deferred batch (documented, not chosen):** B-5 the reset
  without session revocation (stateless tokens carry no version — the
  fix is a `tokenVersion` schema column + token-format change + full
  auth re-pinning, the Mode D family), B-15 the unthrottled
  authenticated ai-assistant route (a rate limit risks the standing
  gate's shared-IP budget — needs a dedicated-limit design), B-13 the
  stale attempts-remaining read (display-only under concurrency),
  B-14 the XFF-less direct-exposure shared bucket (documented
  single-proxy assumption), A-7 the exit double-PUT (the fetch-dedup
  backlog family), A-9 the same-route projectId swap (latent — no
  in-app link does it), A-10 the `?` modifier ordering, B-2/B-3 the
  enumeration timing oracles, B-8 the POST/PUT row-builder dedup,
  B-9 the OTP short-paste wipe, B-10 the dead schema columns, B-11 the
  list-endpoint full element payload, and the standing session-63
  informational batch.

### Verified clean (explicitly re-checked)

The MobileNav contract in full (9/9 via the verifier); the XSS/injection
surface (no `dangerouslySetInnerHTML` in src; LLM reply/element text
render as React text nodes; fills hex-validated both sides; `fillImage`
whitelisted at upload AND server); ELEMENT_LIMIT's four-consumer
alignment; the autosave machine (serialization/pending re-run, captured
body, elements+background guards, gesture deferral, disposed gating,
adoption guard, soft-leave PUT-before-dispose, keepalive Blob guard);
the locked wall's six seams; CSRF (SameSite=Lax + JSON-only bodies
across every mutation route); the open-redirect guards (`safeFromUrl`
at both consumption sites); the crypto discipline (CSPRNG codes,
`timingSafeEqual` on password and HMAC); the verify-otp atomic ceiling
+ exhaustion lock; the reset round-trip (token-before-password,
single-use clear, 60-min window); the elements PUT transaction +
envelope catches; the duplicate route's `$transaction`; `proxy.ts`
exact-match 307s; the test infra isolation (skills excluded, :3100 +
`db/e2e.db` + `DIGMA_DISABLE_AI_LLM=1`, storageState, the 9/10 auth
budget); the seed's pristine 1/2/6/1/3; `.env.example` matches the
four env reads. No `window.location` auth redirects, no array-identity
subscription traps, no Tailwind config reintroduction.

## The chosen session work (TDD)

### S64-A — the mobile helper's gesture-aware commit (A-1)

`editor-view.tsx:828-832`: the mobile `update` helper passes
`s.gestureSnapshot === null` as the third argument — the exact form the
desktop helper carries (the S62-A doctrine reaching the surface it
missed). Unit pin: the source contract in the mobile helper's body
(the third-argument form), plus the desktop helper's preservation pin.

### S64-B — the surface-aware sliderGesture (A-2)

`properties-panel.tsx:284-323`: the helper gains a SURFACE token.
`begin(surface)` — when a DIFFERENT surface's gesture is open and
changed, FLUSH it first (`endGesture()` — the text burst keeps its one
undo entry) before beginning the new gesture; then record the active
surface. `finish(surface)` — a no-op when the active surface differs
(the foreign Content blur arriving after the slider's begin must not
cancel the slider's fresh gesture). `textTick` carries the "text"
surface. The single-machine design is preserved (module-level,
single-pointer-safe). Unit pins: the source contracts (the surface
token in begin/finish, the foreign-flush, the textTick surface) +
preservation pins for the moved/cancel convention.

### S64-C — the rotation-aware `boundsOf` (A-3)

`lib/editor.ts:380-394`: compute the axis-aligned bounding box of the
corner-anchored rotated rect — the four rotated corners
(`(x,y)`, `(x + w·cosθ, y + w·sinθ)`, `(x − h·sinθ, y + h·cosθ)`,
`(x + w·cosθ − h·sinθ, y + w·sinθ + h·cosθ)`, all × scale) folded into
min/max. The `rotation === 0` path returns the current math EXACTLY
(pixel-identical for the unrotated 99%). Unit pins: behavioral pins in
`src/lib/editor.test.ts` (the rotation=0 identity against the old
formula's results, the 90° w/h swap, the 45° enlarged AABB, the
scale composition) + the consumer preservation (the three import sites
unchanged).

### S64-D — the resetUrl production gate (B-1)

The route reads a new env knob: `DIGMA_DISABLE_IN_APP_RESET` — when
`"1"`, `resetUrl` stays `null` for existing accounts too (the
documented production swap becomes a mechanism; the no-enumeration
200 + message is unchanged either way). The client already degrades
gracefully (`login-screen.tsx:90` guards
`typeof body?.data?.resetUrl === "string"`; the sent card renders the
link only when non-null). `.env.example` gains the documented knob +
the README env table gains the row (the source's env reads go 4 → 5).
Unit pins: the source contract (the env read + the gate branch) + the
client guard precondition.

### S64-E — the register race + the reset cap (B-4 + B-12)

`register/route.ts`: the `db.user.create` is wrapped in a try/catch —
a `P2002` (unique-email) answers the same `409 CONFLICT` envelope the
findUnique path answers (the S62-G bare-throw family closed on this
route). `reset-password/route.ts`: the password gains register's
200-char cap (the same VALIDATION 400 family). Unit pins: the source
contracts.

### S64-F — the URL redaction + the unified member color (B-6 + B-7)

`db-path.ts`: a pure `redactDatabaseUrl(url)` export — a
`scheme://user:password@host` form redacts to
`scheme://user:***@host` (the `file:` family and non-credentialed URLs
pass through verbatim); `db.ts` routes the startup log line through
it. `teams/route.ts:57`: `avatarColor: memberColorFor(memberEmail)` —
the one helper both invite paths share (the S60-C identical-paths
principle). Unit pins: `redactDatabaseUrl` behavioral pins (the
postgres credential form, the mysql form, the file: passthrough, the
credential-less passthrough) + the member-color source contract.

### S64-G — the editor Low batch (A-4 + A-5 + A-6 + A-8)

- `src/lib/editor.ts` exports `isTypingTarget` (the S62-A form WITH the
  range carve-out); `editor-view.tsx` + `canvas.tsx` delete their local
  copies and consume the seam (one domain predicate, one source).
- The canvas `onPointerDown`'s draw/move/marquee branches call
  `(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)`
  (the pan/resize branches' own pattern) — drags survive the pointer
  crossing into the chrome.
- The dead `ring-2 ring-blue-500 ring-offset-0` classes deleted (the
  inline boxShadow is the one selection-paint seam; grep-verified zero
  pins).
- The TEXT Color row commits the null clear
  (`onChange={(fill) => update({ fill })}`) — the sibling rows'
  contract; the canvas default renders #FFFFFF.

Unit pins: the single-source contract (the export + both consumers +
zero local copies), the pointer-capture presence on the three
branches, the ring-class absence, the text-color null commit.

## Planned counts

Unit: +19 pins across seven new spec files
(`tests/mobile-update-gesture.test.ts` 3, `tests/slider-surface.test.ts`
4, `src/lib/editor.test.ts` +4 behavioral (the rotation-aware bounds),
`tests/reset-url-gate.test.ts` 3, `tests/server-low-s64.test.ts` 3,
`tests/db-redaction.test.ts` 4, `tests/editor-low-s64.test.ts` 5) →
**382 = 363 + 19**. E2E: +1 new pin (the mobile Sheet's slider
one-undo-per-gesture at 390×844 in `tests/e2e/session64-fixes.spec.ts`
— the S64-A surface, mirroring the session-62 desktop pin with the
REAL mouse) → **218 = 217 + 1**.

## RED expectations

Unit RED: the mobile helper without the third argument; the
sliderGesture helper without the surface token (the begin/finish
signatures unchanged); `boundsOf` ignoring rotation (the 90° pin
fails); the route without the env read; the register create without
the P2002 catch; the reset without the cap; the log line without the
redaction; the hardcoded avatar color; the two local `isTypingTarget`
copies; the ring classes present; the text-color guard `fill &&`. E2E
RED against the pre-fix standalone build: the mobile slider drag
leaving per-tick undo granularity (one Ctrl+Z restores one tick, not
the pre-drag value).

## Execution order

S64-A → S64-B → S64-C → S64-D → S64-E → S64-F → S64-G (the High
first, then the Mediums, then the Lows in dependency order) → unit
GREEN → build → e2e RED (pre-fix standalone) → e2e GREEN → smoke →
full gate → live verification + screenshots → docs → commit + push.

## Execution status

- [x] S64-A — the mobile helper's gesture-aware commit
- [x] S64-B — the surface-aware sliderGesture
- [x] S64-C — the rotation-aware boundsOf
- [x] S64-D — the resetUrl production gate
- [x] S64-E — the register race + the reset cap
- [x] S64-F — the URL redaction + the unified member color
- [x] S64-G — the editor Low batch
- [x] Full gate green — zero regressions (lint · typecheck · 396 unit = 363 + 33 / 77 files · build 23 routes · 56 smoke · 218 e2e = 217 + 1)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the S64 build after the changes — the 41st consecutive session; the standard 32 re-captured + the ref-audit-s74 evidence set with clone-12 the mobile slider one-undo evidence captured BY the e2e pin at the verified-assertion moment — the honest-moment discipline; dimension-checked 138/138; VLM content-verified 16/16 with clone-04 and clone-12's readings adjudicated; the DB re-seeded to the pristine contract after every mutating phase; .env.example extended with the DIGMA_DISABLE_IN_APP_RESET knob — five env reads covered)

## Execution notes (the realized counts + the en-route work)

Unit: +33 checks across seven new spec files (mobile-update-gesture 3,
slider-surface 6, bounds-rotation 6, reset-url-gate 3, server-low-s64 3,
db-redaction 6, editor-low-s64 6) → **396 = 363 + 33** (the plan estimated
382 = 363 + 19 — the realized set carries richer preservation pins and
multi-assertion behavioral pins).

E2E: +1 pin in `tests/e2e/session64-fixes.spec.ts` (the mobile Sheet's
slider one-undo-per-gesture) → **218 = 217 + 1**, honestly RED against
the pre-fix standalone build at exactly the defect assertion.

**The en-route work (the F51 lessons):**

1. **The first pin draft could not discriminate.** Pressing Ctrl+Z
   behind the OPEN Sheet silently no-ops (the S49-2 dialog stand-down
   guard), and the gesture's own endGesture entry lands AFTER the
   per-tick flood — the FIRST undo restores the pre-drag value in BOTH
   builds. The pin restructured onto the SECOND undo (the one the
   per-tick stack betrays) with the Sheet closed first via Escape:
   pre-fix received 13 (one tick into the drag), post-fix holds 100.

2. **The autosave remap emptied the selection mid-pin.** markSaved
   remaps selectedIds to the server's fresh ids while the restored
   snapshot carries the pre-save ids — the undo's survival filter
   drops them, and the "Edit properties" chip vanishes. The pin
   re-selects the element (a plain canvas tap) before re-opening the
   Sheet; the VALUE contract is what the pin owns.

3. **Six standing pins legitimately re-anchored.** The slider wiring's
   surface-token arrow wrappers changed the matched forms (the
   SliderRow bundle, the four inline sliders, the Content focus/blur,
   the isTypingTarget seam move to lib/editor.ts, the gesture-undo
   move-branch ordering with the capture between, and the theme test's
   extraction window 600 → 800) — each with the contract-change
   comment, never deleted.

4. **One VLM misread adjudicated.** clone-12's first pass read the
   small w-8 slider readout as "blank" — the zoom probe confirmed
   "100 %" with the handle at max (exactly the verified state; the
   F44b adjudication class). clone-04's "side sheet, not bottom
   sheet" reading is the standing confirming-description class (the
   drawer IS open).
