# Remediation Plan — Session 70 (the Eighteenth Audit)

**Date:** 2026-10-04 · **Trigger:** the operator's session-97/98-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the `.env` database contract with `db/` at the repo root, the vitest/playwright suites, the TDD remediation, the screenshots, the aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's hunk-by-hunk review of the session-69 delivery (all four
S69 seams verified intact in source at baseline: the depth-aware
`clientIpOf` + `proxyHopDepth` knob with the fail-closed family; the
8 dead radix deps gone + the BOTH-direction install-script parity; the
three P2025/P2003 envelope catches + the login VERIFY_EMAIL
null-tolerant guard; the AGENTS dedup + the lock comment + the
DEPLOYMENT refresh), then the EIGHTEENTH Mode C audit: two
independent fresh-eyes full-file reviews by separate agents — auditor A
over the editor core + client view layer, auditor B over the server +
lib/config/infra side (all 19 API route files — `auth/me` exists beyond
the documented 18) — against the `skills/code-review-checklist`
dimensions with the AGENTS/CLAUDE documented contracts loaded first.
Every chosen finding individually re-verified by the lead in source
before this plan (the F56 display-safe discipline — both auditors
independently byte-verified `rate-limit.ts` correct through the
bracket-eating display layer; the char-code probe is the truth). The
baseline gate re-proven green BEFORE any change (lint · typecheck ·
574 unit / 97 files · build 23 routes · 58 smoke · 231 e2e — zero
drift from session 69), the DB verified at the pristine 1/2/6/1/3
contract, the parent-shell `DATABASE_URL` trap neutralized (the
`unset` discipline in every db-touching command).

## Reference findings (46th audit — no drift, no new gaps)

The standing datums re-verified on
`https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 +
mobile 390×844, the real CDP fill login): the desktop nav 124/96/92 × 36;
the greeting "Good morning, sepnetflix2023 ✨" (the name populated, the
morning bucket — the evening datum re-verified sessions 63–69); Quick
Stats 1 Projects / 0 Teams / Pro Plan; the Recent sort `last_accessed` /
"1 file found"; zero kbd affordances; the Create-Team dead chrome the
46th (2 clicks, 0 dialogs); R3 mobile nav failure class A the 46th (nav
`display:none`, links 0×0, no hamburger — the dashboard AND the editor
page; evidence `ref-audit-s80/ref-01` and `ref-02`); the mobile editor
header clipping Share/Present at 390 re-measured exactly (Share
L385–R458, Present L466–R551 — byte-identical to the session-63…69
measurement); the board at 9 layers ("9 layers" + "Test Project One",
opened through the project-card ANCHOR after the generic card probe
missed — the same first-attempt miss family as sessions 62–69).
Evidence set: `docs/screenshots/ref-audit-s80/` (ref-00 desktop
dashboard, ref-01 mobile dashboard 390, ref-02 mobile editor 390,
ref-03 desktop Recent grid, ref-04 desktop editor).

The clone's mobile navigation verified live, end-to-end at 390×844 —
the 47th consecutive session, ALL GREEN via the single-call verifier
`scripts/verify-nav-s70.sh` (9/9: the 44×44 hamburger with the aria
contract at [16,10], the Sheet dialog with 44px links +
aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape
with focus return + lock release, navigate-and-dismiss, the md-crossing
close, the 768 boundary, and the class-A guard — the Tailwind v4
failure class A NOT present).

## The code audit findings (Mode C — eighteenth pass)

The session-69 delivery itself is clean (all four seams verified to
hold; the 574/58/231 gate re-proven green at baseline before any
change). The two fresh-eyes passes found **0 Critical / 0 High /
2 Medium / 7 Low / ~14 Informational** combined — every chosen
finding individually re-verified by the lead in source:

- **M-A1 (Medium — the documented deferred #5, auditor A F1): the
  ProjectCard root is a `role="button"` div with NESTED interactive
  descendants.** `project-card.tsx:387-399` — the card root carries
  `role="button"` + `tabIndex={0}` + the Enter/Space onKeyDown + the
  `Open ${name}` aria-label, while the rename `<Input>` (273), the
  Check/X `<Button>`s (291/301), and the ellipsis `<Button>` (446)
  render INSIDE it. WAI-ARIA prohibits interactive descendants inside
  a button role — AT flattens or misannounces the inner controls; the
  S31-3/S58-B stopPropagation wrappers are the compensating
  workaround family for exactly this structure. The reference's own
  card is a plain div — the clone added the role unilaterally.
- **M-A2 (Medium — the same family, auditor A F2): the layers row is
  the same violation.** `layers-panel.tsx:157-177` — the row div
  carries `role="button"` + `aria-pressed` + `tabIndex={0}` with the
  rename input (182) and the eye/lock/trash buttons (218/238/278)
  nested inside; the S59-A nested-control exemption inside the row's
  onKeyDown exists BECAUSE of the nesting.
- **L-A1 (Low — deferred #4, auditor B F-5): four dead schema
  columns + a useless index.** `prisma/schema.prisma` —
  `thumbnailSeed` (line 58, zero code references), `src`/`path`
  (92-93, written by both row-builders, zero read sites), `zIndex`
  (94, written + round-tripped through the DTO/store, zero read
  sites), and `@@index([sortOrder])` serving no query (every element
  query filters `projectId` first) while adding write amplification
  to every 2000-row replace.
- **L-A2 (Low — deferred #3, auditor B F-6): three element
  row-builders, three conventions.** The elements POST synthesizes
  defaults for OMITTED fields (fill→`#3B82F6`, stroke→`#FFFFFF`); the
  PUT NULLS omitted fields; the client's `defaultElementFor` is
  type-aware — the natural one-seam dedup.
- **L-A3 (Low — deferred #2, auditor B F-1): the list routes ship
  FULL element rows.** `projects/route.ts:22` (+ the PATCH response +
  the duplicate response) — `include: { elements: { orderBy: {
  sortOrder: "asc" } } }` ships every column of every row including
  the ≤700 KB data-URL `fillImage` to feed 320×200 card thumbnails;
  the response side is NOT bounded by the 32 MB request cap.
- **L-A4 (Low — auditor B F-2): the verify-otp exhaustion lock reads
  a STALE `verifyAttempts`.** `verify-otp/route.ts:65` — the lock
  check and the display derivation use the pre-read `findUnique`
  value; a request that read 4 can pass the lock after a concurrent
  request trips 5, and the success path's `db.user.update` (line 101)
  is non-conditional — the correct-code verify opens a session past
  the ceiling. The S62-E atomicity fixed the wrong-code INCREMENT;
  the success path never received it.
- **L-A5 (Low — auditor B F-4): the duplicated hashPassword seam.**
  `prisma/seed.ts:11-14` duplicates the scrypt parameter set
  (16-byte salt, 64-byte key) from `src/lib/auth.ts:37-41` — a change
  in auth.ts silently breaks demo login. (The direct import is wrong:
  auth.ts transitively imports `next/headers`/`next/server`/`lib/db`
  — the bare-`PrismaClient` seed script must stay Next-free.)
- **L-A6 (Low — auditor A F3): the `?` shortcut fires BEFORE the
  modifier bail.** `editor-view.tsx:450` vs `:514` — Ctrl+? / Cmd+? /
  Alt+? opens the shortcuts dialog and preventDefaults the chord (the
  tool-key family's own single-key contract violated at its own
  guard).
- **L-A7 (Low — auditor A F5): the line-width clamp asymmetry, four
  sites.** The draw commit is type-aware (`line ? w : max(w,1)` —
  `canvas.tsx:303`); the resize write-back floors ALL widths at 1
  (`canvas.tsx:284`); `scaleElements` floors width at 1 for every
  type AND height at 0 for every type (`editor-store.ts:286` —
  disagreeing with resize's non-line height floor of 1); the panel W
  field floors at 1 for every type (`properties-panel.tsx:980`). A
  0-extent line dimension silently becomes 1 on any later
  resize/scale/panel edit.
- **L-A8 (Low — auditor A F6): the SliderRow fill percentage has no
  degenerate guard.** `properties-panel.tsx:522` — `max === min`
  (a 0-dimension element: the route clamps width min 0) renders
  `--range-fill: NaN%`; an out-of-range persisted radius renders
  >100% (or negative) fills.

### The deferred batch (documented, verified, not chosen this session)

The exit() double-PUT redundancy (the machine flush + the cleanup PUT
pair on the exit-button path — needs the autosave in-flight
same-reference indicator design, S-M), the call.ts consolidation
(SIX card-level raw fetch sites — rename/lastOpened/delete/create +
the list-view pair; needs the errorTitle option + the silent
no-toast variant so the S61-H fire-and-forget PATCHes stay
toast-less), the TOCTOU count-then-create soft ceilings (five sites —
move the count inside the create transaction), the fillImageThumb
bounded-image variant of the projection (client-side canvas downscale
at upload — the real weight bound), the lint gate's re-enable ladder
(cheapest-first: no-unreachable/no-debugger/no-redeclare), the
resend-otp 409 enumeration family, the teams-view load seam + the
dashboard list-row lastOpened PATCH + the select/deselect flip dedup +
the dead toolbar index param (the informational client riders), the
login 403's non-envelope extra fields (documented, pinned), the
clampText/clampOptionalText fold, the rate-limit bucket eviction scan,
the at-rest token hashing (posture-gated on the ADR-014 knobs), and
the prompt-injection elementSummary contract pin (the surface is
enum/geometry-only today — the pin guards against future
"enrichment").

### Verified clean (explicitly re-checked)

The session-69 delivery in full (the depth-aware knob exercised
against the real module across 20 edge cases — empty/whitespace/
commas-only XFF, short lists, depth-0 header-blindness, the x-real-ip
fallback rules, IPv6 lists, unparsable/negative/truncating/huge env
values — all fail-closed, none trust-widening); the three race
catches; the install-script BOTH-direction parity (machine
set-compared); every `request.json()` site guarded (14/14); the
envelope discipline; the auth crypto end-to-end; the elements PUT
transaction + charset clamps; the MobileNav contract (9/9 via the
verifier, the 47th consecutive session); the lock-wall family; the
autosave machine; the export-png XML escaping; the sanitizer; the
smoke suite's XFF arithmetic; the proxy 307s; the db-path anchors;
the single-tenant posture (documented, deliberate).

## The chosen session work (TDD)

### S70-A — the a11y restructure batch (M-A1 + M-A2 — the #5 deferred item)

The two WAI-ARIA button-pattern violations the clone added
unilaterally, closed with the canonical restructures:

1. **The ProjectCard stretched-button form.** The card root becomes a
   plain `relative` div (losing `role="button"`/`tabIndex`/the
   onKeyDown/the `Open ${name}` aria-label); a real
   `<button type="button" aria-label={`Open ${project.name}`}>`
   renders as an `absolute inset-0 z-0` stretched layer carrying the
   whole-card open (mouse + keyboard, one path); the card content
   wrapper gains `relative z-10 pointer-events-none` with the
   interactive children (the inline rename row, the ellipsis trigger,
   the dialog wrappers) gaining `pointer-events-auto` — clicks on
   non-interactive content fall through to the stretched button. The
   `[aria-label^='Open ']` locator family (4 spec files) survives
   byte-identically. The S31-3 stopPropagation wrappers stay
   (belt-and-braces). A `focus-visible` ring lands on the stretched
   button (the pre-fix keyboard focus was invisible).
2. **The layers-row button-region form.** The row div becomes a plain
   container (losing `role="button"`/`aria-pressed`/`tabIndex`/the
   onKeyDown/onClick — keeping the drag-reorder handlers + the S61-D
   dblclick guard); the icon+name region becomes a real
   `<button type="button" aria-pressed={isSelected}
   aria-label={`Layer ${el.name ?? el.type}`}>` carrying select (the
   native Enter/Space activation replaces the hand-rolled onKeyDown);
   the rename input and the eye/lock/trash trio render as SIBLINGS
   (the S59-A nested-control exemption becomes structurally
   unnecessary — the keyboard contract holds by construction). The 23
   `getByRole("button", { name: "Layer …" })` locators across 7 spec
   files survive (the accessible name + role land on the select
   button).
3. **Unit pins (`tests/a11y-restructure-s70.test.ts`):** the source
   contracts — the card root carries no role/tabIndex; the stretched
   button form with the Open aria-label present; the
   pointer-events-none content layering present; the layers row
   carries no role/tabIndex; the select-button form with aria-pressed
   present; the rename input OUTSIDE the select button (the sibling
   structure); the S59-A exemption keydown gone.
4. **E2E pin (`tests/e2e/session70-fixes.spec.ts`):** the structural
   a11y contract live — the card root's role attribute absent + the
   stretched button keyboard-reachable (Enter opens the editor) + no
   button contains interactive descendants; the layers row's role
   absent + the select button present + Space selects. Honestly RED
   pre-fix (the roots carry `role="button"` today).

### S70-B — the one-schema-push batch (L-A1 + L-A2 — the #3/#4 deferred items)

1. **The four dead columns dropped + the index swapped.**
   `prisma/schema.prisma` loses `thumbnailSeed`/`src`/`path`/`zIndex`;
   `@@index([sortOrder])` becomes `@@index([projectId, sortOrder])`
   (serving the filter+order every element query actually runs). The
   DTO (`DesignElementDTO`) + `defaultElementFor` lose the three
   fields; the store's `addElements`/`replaceElements` explicit field
   lists lose their `zIndex` writes; the duplicate route's
   rest-spread copy drops them automatically; the seed never wrote
   them. `bunx prisma db push` + re-seed (the unset discipline); the
   e2e global-setup re-pushes its own `db/e2e.db` per run.
2. **The ONE shared row-builder seam.** `buildElementRow(raw, index,
   mode: "create" | "replace")` lands in `src/lib/editor.ts` (the
   element-domain module, beside `defaultElementFor`) — create-mode
   synthesizes the POST defaults (fill→`#3B82F6`, stroke→`#FFFFFF`,
   the visible/locked booleans), replace-mode nulls omitted fields
   (the PUT contract); both modes share the numeric clamps, the
   gradient re-serialize, and the image-family clamps. The elements
   route's POST and PUT consume it; the two hand-rolled builders are
   deleted.
3. **Unit pins (`tests/schema-hygiene-s70.test.ts`):** the
   `buildElementRow` behavioral matrix (create-mode synthesis vs
   replace-mode nulling; the clamps; the gradient re-serialize; the
   sortOrder/index) + the absence contracts (the schema has no
   `thumbnailSeed`/`src`/`path`/`zIndex`; the new composite index
   present; the DTO + the store + the routes write none of the dead
   fields).
4. **Fixture riders:** the seven test fixture literals that carry
   `zIndex: 0` (bounds-rotation, hit-test, gesture-undo,
   gesture-lifecycle, marquee-rotation-s68, editor.test,
   export-png.test) drop the line; the standing suite re-run is the
   regression net (the editor round-trips flow through the schema
   change).

### S70-C — the list-payload projection (L-A3 — the #2 deferred item)

1. **The bounded thumbnail select.** `THUMBNAIL_ELEMENT_SELECT` (a
   plain-const select object in `src/lib/editor.ts`) ships exactly
   the fields `CanvasThumbnail` + `boundsOf` consume — id, type, x,
   y, width, height, rotation, scale, opacity, fill, fillGradient,
   fillImage, fillImageFit, stroke, strokeWidth, radius, text,
   fontSize, fontWeight, fontFamily, textAlign, visible — NOT name,
   locked, sortOrder, or timestamps. Applied to the LIST family:
   `GET /api/projects` (list), the PATCH response, and the duplicate
   response. The detail GET (`/api/projects/[id]` — the editor's
   surface) KEEPS the full include.
2. **The typed projection.** `ThumbnailElementDTO =
   Omit<DesignElementDTO, "name" | "locked" | "sortOrder">` +
   `ProjectSummaryDTO = Omit<ProjectDTO, "elements"> & { elements:
   ThumbnailElementDTO[] }`; `CanvasThumbnail`'s param widens to the
   thumbnail type; `boundsOf`'s param widens structurally (a Pick of
   the geometry fields — `fillPaintFor` is already Pick-based); the
   dashboard + recent views type their state as `ProjectSummaryDTO[]`.
3. **Unit pins (`tests/list-projection-s70.test.ts`):** the three
   list-family routes carry `select: THUMBNAIL_ELEMENT_SELECT` (the
   source contract); the detail GET keeps the bare include; the
   thumbnail/summary types present; `CanvasThumbnail` consumes the
   thumbnail type.
4. **E2E pin:** the API-shape pin — a signed-in
   `request.get("/api/projects")` answers `elements[0]` WITHOUT
   name/locked/sortOrder (honestly RED pre-fix — they ship today) +
   the standing visual parity re-run (the thumbnails still render
   through the projection).

### S70-D — the server/client low batch (L-A4 + L-A5 + L-A6 + L-A7 + L-A8 + the doc riders)

1. **The verify-otp atomic success path (L-A4):** the success update
   becomes the conditional `updateMany({ where: { id, verifyCode:
   code, verifyAttempts: { lt: MAX } }, data: { verified: true,
   verifyCode: null, verifyAttempts: 0 } })`; `count === 0` → the
   discriminating re-read (locked vs wrong); the wrong-code display
   counter derives from a post-increment read (the stale pre-read
   display rider). The lock check at :65 stays as the fast-path
   display, but the atomic where-clause is the real enforcement.
2. **The pure password seam (L-A5):** `src/lib/password.ts` (node:crypto
   only — `hashPassword`/`verifyPassword`/`generateVerifyCode`);
   `src/lib/auth.ts` imports + re-exports (the register route's
   existing imports survive); `prisma/seed.ts` imports from the pure
   module (the bare-`PrismaClient` script stays Next-free).
3. **The `?`-shortcut reorder (L-A6):** the branch relocates below
   the modifier bail (line 514) with its comment — Ctrl+?/Cmd+?/Alt+?
   return at the bail; plain Shift+/ still opens the dialog.
4. **The line-width clamp symmetry (L-A7, four sites):** the resize
   write-back, `scaleElements`, and the panel W field become
   type-aware (`line → 0 floor, non-line → 1 floor`, both dimensions)
   matching the draw commit + the panel H field.
5. **The SliderRow degenerate guard (L-A8):** the fill percentage
   clamps (`max > min ? min(max(((v-min)/(max-min))*100, 0), 100) : 0`).
6. **The doc riders:** the ADR-014 enumeration-tradeoff sentence (the
   field-level nullness of `resetUrl`/`verificationCode` re-introduces
   account enumeration — the no-enumeration 200 covers the message
   body, not the payload shape; both delivery knobs restore the
   uniform shape) + the PAD's `/api/auth/me` sentence corrected (the
   route answers `200 { user: null }` for anonymous callers, not 401).
7. **Unit pins (`tests/server-lows-s70.test.ts` +
   `tests/client-lows-s70.test.ts`):** the verify-otp conditional form
   (the source contract + the preservation pins); the password seam
   (the behavioral hash/verify round-trip + the seed's import + the
   auth re-export); the `?`-reorder (the bail precedes the branch);
   the four clamp forms; the SliderRow guard; the PAD sentences.

## Planned counts

Unit: +~40 pins across four new spec files → **~614 = 574 + 40**.
E2E: +3 pins in `tests/e2e/session70-fixes.spec.ts` (the card a11y
structure, the layers-row a11y structure, the projection API shape) →
**234 = 231 + 3**. Smoke: unchanged at **58** (the S70-C projection
is response-shape only — the smoke suite's CRUD asserts survive the
narrower element rows; the S70-B schema push re-seeds first).

## RED expectations

Unit RED: the role/tabIndex source contracts fail (the violations are
present); the stretched-button/select-button forms absent; the
`buildElementRow` seam absent (the behavioral matrix fails on the
missing export); the dead-field absence contracts fail (the columns
+ DTO fields + store writes present); the projection select absent
(the bare include present); the thumbnail/summary types absent; the
verify-otp conditional form absent (the non-conditional update
present); the password module absent; the `?` branch precedes the
bail; the asymmetric clamp forms present; the unguarded percentage
present. E2E RED against the pre-fix standalone build: the card root
carries `role="button"` (the structural assertion fails); the layers
row carries it; the projection pin sees name/locked/sortOrder shipped.

## Execution order

S70-A → S70-B → S70-C → S70-D (the a11y restructures first — the two
Medium findings, the session's headline; the schema-push batch second
— the coordinated db push + re-seed mid-session; the projection third
— it rides the S70-B DTO change; the lows + doc riders last) → unit
GREEN → build → e2e GREEN → smoke → full gate → live verification +
screenshots → docs → commit + push.

## Execution status

- [x] S70-A — the a11y restructure batch
- [x] S70-B — the one-schema-push batch
- [x] S70-C — the list-payload projection
- [x] S70-D — the server/client low batch
- [x] Full gate green — zero regressions (lint · typecheck · 625 unit = 574 + 51 / 102 files · build · 58 smoke · 236 e2e = 231 + 5)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the final build — the 47th consecutive session; the standard 32 re-captured + the ref-audit-s80 evidence set with clone-21/22 captured BY the e2e pins + THREE NEW inline checks — the stretched-button card form, the button-region row form, the projected list payload — + the standing XFF rotation-bypass closure re-verified live in both directions; dimension-checked 233/233, VLM 21/21)

## Execution notes (the realized counts + the en-route work)

Unit: +51 checks across five new spec files (a11y-restructure-s70 10,
schema-hygiene-s70 15, list-projection-s70 9, server-lows-s70 10,
client-lows-s70 7) → **625 = 574 + 51**. TEN standing pins legitimately
re-anchored onto the restructured contracts (each with the
contract-change comment, the session-66/69 convention):
layers-honesty's S61-D guard selector (the refined data-layer-action
form), layers-a11y's L-3 Space activation (the native button),
layers-keyboard's three pins (the sibling structure + the refined
dblclick guard + the select button's onRowClick), ellipsis-keyboard's
two pins (the stretched-button form + the pointer-events-auto wrapper),
image-whitelist's server path (the clamp moved to the seam),
client-lows-s67's fetch typing (the summary DTO), server-low-s62's
B-L1 (the password.ts seam + the re-export), and the fixture riders
dropping the dead fields.

E2E: +5 pins in `tests/e2e/session70-fixes.spec.ts` → **236 = 231 +
5**, honestly RED 4/6 at exactly the defect assertions (the card's
tagName, the WAI-ARIA sweep's violations, the row's tagName, the
projection's shipped name). Smoke: unchanged at **58** (the schema push
re-seeded first).

**The en-route work (the F57 lessons):**

1. **The non-positioned-sibling stacking trap:** the stretched-button
   pattern needs BOTH pointer-events layering AND positioned stacking
   on EVERY content block — the card's p-3 content block lacked
   `relative z-10`, so the positioned z-0 stretched button painted
   ABOVE it and the hit test landed on the button even over the
   pointer-events-auto ellipsis (Playwright's "intercepts pointer
   events" retry loop, a 45s hang per test).
2. **The intercepted-click hang family:** an a11y restructure that
   changes the click surface surfaces as TIMEOUTS, not assertion
   failures — the getByText card-click family (13 spec files) and the
   hasText-filtered Open locators (an EMPTY stretched button matches
   no hasText filter) all migrated to the accessible-name forms.
3. **The destructive-push confirmation stall:** dropping columns makes
   `prisma db push` prompt; the piped execSync in the e2e
   global-setup cannot answer — the throwaway e2e db now pushes with
   `--accept-data-loss` (it re-seeds immediately after).
4. **The silent python-replace no-op:** two doc/test edits each missed
   their anchor on an exact-form mismatch (the crypto import's
   specifier spelling; a regex pin's escaped paren) and silently
   no-opped — anchors must be asserted before moving on.
5. **The comment-literal discipline's third appearance:** the session's
   own new comments quoted the removed forms (a role attribute, an
   import family, dead column names) and the absence pins read them —
   prose descriptions or declaration-form regexes.
6. **The slice-window arrow-function trap:** an `indexOf(">")` probe
   lands inside an onClick arrow function's `=>` before the tag's real
   closing bracket — width-based slices or explicit end-anchors.
