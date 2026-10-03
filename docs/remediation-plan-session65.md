# Remediation Plan — Session 65 (the Thirteenth Audit)

**Date:** 2026-10-03 · **Trigger:** the operator's session-88-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the scandihaven tech-stack patterns as reference, TDD, the standing vitest + playwright gates, `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, the screenshots under `docs/screenshots/`, a verified `.env.example`, aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's hunk-by-hunk review of the session-64 delivery (all seven
S64 seams verified intact in source at baseline: the mobile helper's
gesture-aware commit at `editor-view.tsx:823`, the surface-token
sliderGesture at `properties-panel.tsx:285-347`, the rotation-aware
`boundsOf` at `lib/editor.ts:409-429`, the `DIGMA_DISABLE_IN_APP_RESET`
gate at `forgot-password/route.ts:53`, the register P2002 catch at
`register/route.ts:74` + the reset-password 200-char cap, the
`redactDatabaseUrl` seam at `db-path.ts:118` routed through `db.ts:15`
+ the unified `memberColorFor` at `teams/route.ts:62`, and the
single-sourced `isTypingTarget` at `lib/editor.ts:214` with the canvas
pointer captures and zero ring classes), then the THIRTEENTH Mode C
audit: two independent fresh-eyes full-file reviews by separate agents
over the least-recently-reviewed surfaces — auditor A over the client
view layer (dashboard-view, recent-view, teams-view, project-card,
app-header, login-screen, reset-password-screen, logo, use-toast,
layout + globals + every page — last independently reviewed session
63), auditor B over the lib/ui/config/infra side (the 11 pure lib
seams, the 10 vendored ui primitives, the 4 editor panel components,
the test infra, the 6 configs + proxy, the prisma schema + seed, and
the seven session-64 spec files — last independently reviewed session
63) — against the `skills/code-review-checklist` dimensions with the
AGENTS/CLAUDE documented contracts loaded first. Every chosen finding
individually re-verified by the lead in source before this plan. The
baseline gate re-proven green BEFORE any change (396 unit / 77 files ·
build 23 routes · 56 smoke · 218 e2e), the DB re-seeded to the
pristine 1/2/6/1/3 contract, the parent-shell `DATABASE_URL` trap
neutralized (the `unset` discipline in every db-touching command).

## Reference findings (41st audit — no drift, no new gaps)

The standing datums re-verified on
`https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 +
mobile 390×844, the real CDP fill login): the desktop nav 124/96/92 × 36;
the greeting "Good morning, sepnetflix2023 ✨" (the name populated); Quick
Stats 1 Projects / 0 Teams / Pro Plan; the Recent sort `last_accessed` /
"1 file found"; zero kbd affordances; the Create-Team dead chrome the
41st ("Create Team" + "Create Your First Team", 2 clicks, 0 dialogs); R3
mobile nav failure class A the 41st (nav `display:none`, all three links
0×0, no hamburger — the dashboard AND the editor page; evidence
`ref-audit-s75/ref-01` and `ref-02`); the mobile editor header clipping
Share/Present at 390 re-measured exactly (Share L385–R458, Present
L466–R551 — byte-identical to the session-63/64 measurement; evidence
`ref-audit-s75/ref-02`); the board at 9 layers ("9 layers" + "Test
Project One", opened through the project-card ANCHOR — the generic card
probe missed again, the same first-attempt miss as sessions 62/63/64;
the anchor's own text is "Type here...", the project name lives in the
sibling h3). Evidence set: `docs/screenshots/ref-audit-s75/` (ref-00
desktop dashboard, ref-01 mobile dashboard 390, ref-02 mobile editor
390, ref-03 desktop Recent grid, ref-04 desktop editor, ref-05 desktop
Recent list view).

The reference's own 40×40 list thumbnail re-confirmed against the PAD's
session-39 decode (RA-48): the list card's left slot carries "the SAME
mini-canvas **scaled inside**" — the reference SCALES the fitted canvas
into the 40×40 box. The clone's implementation paints a fixed 320×200
space it never scales — the audit's A-1 below is exactly the drift
between the documented contract and the implementation.

The clone's mobile navigation verified live, end-to-end at 390×844 —
the 42nd consecutive session, ALL GREEN via the single-call verifier
`scripts/verify-nav-s65.sh` (9/9: the 44×44 hamburger with the aria
contract at [16,10], the Sheet dialog with 44px links +
aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape
with focus return + lock release, navigate-and-dismiss, the md-crossing
close, the 768 boundary, and the class-A guard — the Tailwind v4
failure class A NOT present).

## The code audit findings (Mode C — thirteenth pass)

The session-64 delivery itself is clean (all seven seams verified to
hold; the 396/56/218 gate re-proven green at baseline before any
change). The two fresh-eyes passes found **0 Critical / 2 High /
1 Medium / 8 Low / 11 Informational** combined — every chosen finding
individually re-verified by the lead in source:

- **A-1 (High): `CanvasThumbnail` never scales its fixed 320×200
  painted space to the parent.** `project-card.tsx:67-176` — the
  component computes the content fit into a hard-coded `boxW=320 /
  boxH=200` coordinate space and anchors it at the parent's top-left
  (`absolute` + `transformOrigin: left top`, no scale-to-parent
  transform), so the parent's `overflow-hidden` crops everything past
  its own bounds. Measured with the seeded demo-project coordinates: in
  the Recent list's 40×40 slot (`recent-view.tsx:151`) only a corner
  sliver of the fitted content is visible (the seeded Glow ellipse,
  Headline, and CTA measure `visibleW/H = 0` — invisible); in a
  229×143 grid slot at lg the crop is ~27%/25% of the fitted content;
  at ≥1280 the crop shrinks to ~6%/1.5% — which is why the 1440×900
  evidence, the S63 painted-pixel overlay probes, and the VLM passes
  never caught it. The PAD's own RA-48 decode documents the reference's
  list thumbnail as "the SAME mini-canvas scaled inside" — the
  implementation drifted from the documented contract on the day it was
  ported.
- **B-1 (High): the `sliderGesture` closure leaks a live gesture when
  its host surface unmounts mid-drag.** `properties-panel.tsx:285-347`
  — the four terminals are all element-scoped pointer events
  (`:378-381`); when the mobile Sheet or the desktop panel closes
  mid-drag (the lg-crossing close at `editor-view.tsx:795-806`, the
  `onOpenChange` overlay/Escape/X paths, the chip-toggle unmount at
  `:1421-1425`), `pointerup`/`pointercancel`/`lostpointercapture` never
  reach the detached slider — `activeSurface` stays `"slider"` and the
  store's `gestureSnapshot` stays set. Consequences, all traced in
  source: (a) the autosave's markSaved deferral (`editor-view.tsx:229
  -232`) + the subscriber re-arm (`:310-315`) loop ~1 PUT/s with the
  badge never reaching "Saved" — the S57-A failure mode, now reachable
  WITHIN a session; (b) the gesture-aware commit args
  (`properties-panel.tsx:1170`, `editor-view.tsx:823`) read false —
  every subsequent panel edit silently stops pushing undo history until
  a canvas gesture heals it; (c) after navigation, `loadProject`
  (`editor-store.ts:176`) resets `gestureSnapshot` but NOT the module
  closure, and the same-surface `begin` (`properties-panel.tsx:324`)
  then skips `beginGesture` entirely — the pinned S62-A
  one-entry-per-gesture contract regresses.
- **B-2 (Medium): the number-input family pushes one history snapshot
  per keystroke.** `properties-panel.tsx:104-114` (`NumberField`) and
  `:181-188` (`GuardedNumberInput`) commit every finite keystroke live,
  feeding the `update` helper whose third argument
  (`gestureSnapshot === null`) is `true` outside a gesture — typing
  "250" into X pushes 3 full 60-deep snapshots; a focused session
  across X/Y/W/H/Font-Size/stop fields floods the stack. The identical
  harm class S62-A fixed for the sliders and the Content input (which
  got focus/blur + the 150ms idle-coalesced `textTick`); the number
  inputs got nothing.
- **A-2 (Low): the greeting's SSR/hydration text mismatch.**
  `dashboard-view.tsx:82` — `useMemo(() => greetingFor(), [])` computes
  the bucket on the server at request time and again during client
  hydration; across the 12:00/17:00 bucket boundaries with divergent
  clocks React 19 logs a text-content hydration error and discards the
  server text (the UI self-corrects — the same family as the documented
  locale-less date, which stays deferred).
- **A-3 (Low): the bell trigger below WCAG 1.4.11.**
  `app-header.tsx:259` — the icon-only Notifications button's glyph is
  `text-gray-400` (2.54:1 on white) against the 3:1 non-text floor; the
  S61-H pass fixed its 44px target and `aria-haspopup` while the color
  stayed. Not a parity-pinned site (verified: `contrast-tokens.test.ts`
  pins only the editor avatar counter).
- **B-3 (Low): `redactDatabaseUrl` leaks the tail of an `@`-containing
  password.** `db-path.ts:118-124` — `([^@]*)@(.*)` splits at the FIRST
  `@`, so `postgres://user:p@ss@host/db` redacts to
  `user:***@ss@host/db` (the `ss` is password material). Practical
  exposure is low (well-formed URLs percent-encode `@`), but the seam
  exists precisely for hand-written strings; a redaction seam's contract
  is "never print the secret".
- **B-4 (Low): the Image tab's dashed dropzone accepts no drops.**
  `properties-panel.tsx:592-611` — the dropzone carries no
  `onDragOver`/`onDrop` (the only drop handlers in the repo are the
  layers rows); a real drop onto the advertised dropzone falls through
  to the browser default and navigates the editor tab to the file blob.
- **B-5 (Low): the vendored Dialog's Close X is below the 44px touch
  floor.** `ui/dialog.tsx:44-47` — an un-sized `absolute right-4 top-4`
  wrapper around an `h-4 w-4` X (~28px target). The S60-F convention
  (`[&>button]:h-11 [&>button]:w-11` at the consumption site) patched
  the three Sheets + MobileNav but not the six DialogContent sites
  (teams-view ×2, recent-view, editor-view's shortcuts dialog,
  project-card ×2).
- **A-5 (Low): the `call()` helper is triplicated with drift.**
  `dashboard-view.tsx:25-41` and `teams-view.tsx:38-54` (identical
  init-aware copies), `recent-view.tsx:49-62` (a GET-only variant that
  has ALREADY LOST `init` support — the drift has happened; latent at
  its GET-only call sites). AGENTS documents ONE `call()` seam — the
  S64-G isTypingTarget drift family waiting to happen again.
- **The deferred batch (documented, not chosen):** A-4 the grid-card
  `role="button"` owning interactive descendants (the S58-B keydown-stop
  seam exists precisely because of this nesting — restructuring the card
  is the Mode D family), the informational set (the dead `.safe-bottom`
  CSS rule, the MobileNav sr-only dead span, the vestigial card wrapper
  + unreachable date fallback, the list-empty bordered sliver, the
  RecentListCard click-only stop, the Teams chip initial hardening, the
  `clampNumber` null-vs-undefined coercion, the duplicated
  hashPassword/clamp seams, the inert sanitizer type cast, the "1
  circles" plural quirk, the lint gate's disabled correctness rule
  classes), plus the standing session-64 deferred queue (B-5 session
  revocation, B-15 the AI route rate limit, the bfcache persisted guard,
  the enumeration oracles, the dead schema columns, the list-payload
  perf, the row-builder dedup, B-13, A-7, A-9, A-10).

### Verified clean (explicitly re-checked)

The MobileNav contract in full (9/9 via the verifier); all seven
session-64 pins are REAL (no vacuous anchors — auditor B re-derived the
boundsOf math independently and matched); the S64 seams all present;
globals.css v4 discipline (literal hex, no var() chains, zero
v3-opacity utilities repo-wide); the vitest/playwright isolation
(skills/ excluded by pattern, :3100 + `db/e2e.db` +
`DIGMA_DISABLE_AI_LLM=1`, storageState, workers=1); the store selector
discipline; the layers drag-reorder math; the smoke bucket discipline;
the proxy exact-match 307s; the prisma cascades + idempotent seed; the
server-side gating + `from_url` preservation on every page; the
five-state auth card; no XSS sinks; the sort contracts; the
ignore-guards on every mount effect.

## The chosen session work (TDD)

### S65-A — the thumbnail parent-fit (A-1)

`src/lib/editor.ts` exports a pure `thumbnailFit(parentW, parentH,
boxW, boxH)` → `{ scale, tx, ty }`: the min-fit scale with the
centering translate (`tx = (parentW − boxW·scale)/2`, `ty =
(parentH − boxH·scale)/2`; degenerate non-positive parent dimensions
return the identity `{1, 0, 0}`). `CanvasThumbnail` gains a measured
wiring: a `useLayoutEffect` + `ResizeObserver` on the root container
computing `thumbnailFit(el.clientWidth, el.clientHeight, 320, 200)`,
applied to the existing absolute wrapper as
`transform: translate(tx, ty) scale(scale)` (transformOrigin stays
`left top`). The 16:10 grid parents scale to the exact fill (tx = ty =
0 — the wide path is pixel-identical at ≥1280 where the card is wider
than 320); the 40×40 list slots render the fitted 40×25 mini-canvas
centered — the PAD's RA-48 "scaled inside" contract. The painted
structure (the fit math, the element rendering) is unchanged — one
wrapper transform. Unit pins: behavioral pins on `thumbnailFit` (the
16:10 exact fill, the square min-fit + centering, the degenerate
identity) + the wiring source contract (the observer + the transform
form) + preservation (the fit math unchanged). E2E pin: every painted
element div inside each thumbnail root must have its bounding rect
CONTAINED within the root's rect — RED pre-fix (the seeded elements
sit at x > 40 in the list slot), GREEN post-fix.

### S65-B — the sliderGesture reset seam (B-1)

The closure gains `reset()`: clear the idle timer, then flush — a
CHANGED leaked gesture ends (`endGesture()` — the partial drag keeps
its one undo entry), an unchanged one cancels (`cancelGesture()`), and
`changed`/`activeSurface` return to the clean state; exported from the
module as `resetSliderGesture`. Consumed at the three host surfaces'
UNMOUNT (Radix unmounts the Sheet content on every close path — the
overlay tap, Escape, the X, the lg-crossing, navigation): the desktop
`PropertiesPanel`'s unmount cleanup, `MobilePropertiesEditor`'s, and
`MobileCanvasProperties`' — and at the `loadProject` wiring in
`editor-view.tsx` (heals a closure leaked across a same-session
project swap where the store reset leaves the closure stale). Unit
pins: the source contracts (the reset shape — flush-changed /
cancel-unchanged / clear-idle; the three unmount cleanups; the
loadProject heal) + preservation pins for the S64-B surface contracts.
E2E pin: pointerdown on the mobile Sheet's opacity slider + two moves
+ Escape MID-DRAG (the Sheet unmounts, the pointerup never lands) →
the Saved badge must converge to "Saved" within the autosave window
(pre-fix: the deferral loop keeps it "Saving…"/"Unsaved" forever) AND a
subsequent slider drag still gets its one-undo entry.

### S65-C — the number-input gesture coalescing (B-2)

`NumberField` + `GuardedNumberInput` get the Content input's exact
wiring (the S62-A doctrine reaching the fields it missed):
`onFocus={() => sliderGesture.begin("field")}`,
`onBlur={() => sliderGesture.finish("field")}`, and the committing
onChange branch calls `sliderGesture.textTick()` before `onChange(
parsed)` (the idle-coalesced burst — one history entry per typing
burst, the live value contract unchanged). The empty-draft guard
(S21-2) and the abandoned-draft blur restore are untouched. Unit pins:
the source contracts (the three handlers on both components, the
textTick-before-commit ordering) + the preservation pins for the
S21-2 guard. E2E pin: select-all + type "250" into the desktop panel's
X field (three per-digit commits pre-fix), blur, ONE Ctrl+Z — pre-fix
restores 25 (the per-digit stack), post-fix restores the pre-typing
value.

### S65-D — the Low batch (A-2 + A-3 + B-3 + B-4 + B-5)

- `dashboard-view.tsx`: the greeting `h1` gains
  `suppressHydrationWarning` (the server bucket renders until
  hydration patches it — the current self-correcting behavior minus
  the console error; pixel-identical).
- `app-header.tsx:259`: the bell glyph `text-gray-400` →
  `text-gray-500` (the S61-B family; the parity-pinned gray-400 sites
  untouched — the standing contrast-tokens preservation pin guards the
  avatar counter).
- `db-path.ts`: `redactDatabaseUrl` parses the AUTHORITY segment
  (everything after `scheme://` up to the first `/`, `?`, `#`) and
  splits userinfo at the LAST `@` within it — a password containing
  `@` redacts whole; the existing behavioral pins (the postgres form,
  the file: passthrough, the credential-less passthrough) must hold
  unchanged.
- `properties-panel.tsx`: the dashed dropzone gains `onDragOver`
  (preventDefault) + `onDrop` (preventDefault + the image/* type
  check mirroring the input's accept + `readFile`) — a real drop
  uploads instead of navigating the tab to the blob.
- The six `DialogContent` sites gain the S60-F form
  `[&>button]:h-11 [&>button]:w-11` (teams-view ×2, recent-view,
  editor-view's shortcuts dialog, project-card ×2) — the Close X
  reaches the 44px floor like the Sheets' closes; the glyph's absolute
  anchoring is unchanged.

Unit pins: the five source contracts + the redaction behavioral pins
(the multi-@ postgres/mysql forms, the last-@ authority split, the
preservation of the three standing forms).

### S65-E — the shared `call()` seam (A-5)

A new `src/lib/call.ts` ("use client") carrying the init-aware form
verbatim (the dashboard/teams copy — the superset); the three views
delete their local copies and import the seam (recent's GET-only call
sites pass no init — behavior-identical). Unit pins: the source
contracts (the module's init-aware form, zero local `async function
call` copies remain, the three imports present).

## Planned counts

Unit: +25 pins across seven new spec files
(`tests/thumbnail-fit.test.ts` 5, `tests/slider-reset.test.ts` 4,
`tests/number-coalesce.test.ts` 4, `tests/low-batch-s65.test.ts` 5,
`tests/redact-multi-at.test.ts` 3, `tests/call-seam.test.ts` 3, + the
wiring pins folded into the above) → **~421 = 396 + 25**. E2E: +3 pins
in `tests/e2e/session65-fixes.spec.ts` (the thumbnail containment, the
mid-drag Sheet-close convergence + one-undo, the number-field
one-undo-per-burst) → **221 = 218 + 3**.

## RED expectations

Unit RED: `thumbnailFit` absent; the CanvasThumbnail wrapper without
the measured transform; the closure without `reset` + the three
unmount paths without the cleanup; the number inputs without the
gesture handlers; the h1 without `suppressHydrationWarning`; the bell
at gray-400; the first-@ redaction (the multi-@ pins fail); the
dropzone without the drop handlers; the DialogContent sites without
the S60-F form; three local `call()` copies present. E2E RED against
the pre-fix standalone build: the list-slot thumbnail's seeded
elements overflow the 40×40 root; the mid-drag Sheet close leaves the
badge unconverged; the number-field undo steps into the middle of the
burst.

## Execution order

S65-A → S65-B → S65-C → S65-D → S65-E (the Highs first, then the
Medium, then the Lows in dependency order) → unit GREEN → build → e2e
RED (pre-fix standalone) → e2e GREEN → smoke → full gate → live
verification + screenshots → docs → commit + push.

## Execution status

- [x] S65-A — the thumbnail parent-fit
- [x] S65-B — the sliderGesture reset seam
- [x] S65-C — the number-input gesture coalescing
- [x] S65-D — the Low batch
- [x] S65-E — the shared call() seam
- [x] Full gate green — zero regressions (lint · typecheck · 426 unit = 396 + 30 / 82 files · build 23 routes · 56 smoke · 221 e2e = 218 + 3)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the S65 build after the changes — the 42nd consecutive session; the standard 32 re-captured + the ref-audit-s75 evidence set with clone-13 the mid-drag convergence evidence captured BY the e2e pin at the verified-assertion moment + clone-14 the list-thumbnail fit evidence with the inline containment check; dimension-checked 152/152; VLM content-verified 17/17; the DB re-seeded to the pristine contract after every mutating phase; .env.example verified unchanged — the five slices add no env vars, the source's five env reads all covered)

## Execution notes (the realized counts + the en-route work)

Unit: +30 checks across five new spec files (thumbnail-fit 7,
slider-reset 6, number-coalesce 6, low-batch-s65 8, call-seam 3) →
**426 = 396 + 30** (the plan estimated ~421 across seven files — the
realized set folds the redaction pins into the low-batch file and
carries richer multi-assertion behavioral pins).

E2E: +3 pins in `tests/e2e/session65-fixes.spec.ts` (the list-view
thumbnail containment, the mid-drag Sheet-close convergence, the
number-field one-undo-per-burst) → **221 = 218 + 3**, all three
honestly RED against the pre-fix standalone build at exactly the
defect assertions (the list slots at "root 40x40 child 0,0 320x200";
the badge count 0 after the 10s poll; the undo receiving 25, expected
160).

**The en-route work (the F52 lessons):**

1. **The S65-B cleanup first landed on the mobile Sheet HOSTS — and
   the convergence pin stayed RED.** The host stays mounted while the
   portal CONTENT unmounts on every close path; the one seam that
   covers them all is the SHARED section body both hosts render
   (`PropertiesSections` — the desktop panel's body AND the Sheet's
   content). The reset moved there (the host-level cleanups kept as
   defense-in-depth).

2. **The S65-C wiring tripped THREE standing pins through two real
   interleaving defects of its own.** (a) The shared `textTick`'s idle
   timer hardcoded its owning surface's label — for the new "field"
   surface the idle was a NO-OP (the gesture never ended; the mobile
   S53-A opacity pin's badge never converged). The idle now ends
   whichever surface owns the gesture, captured at arm time. (b) A
   field-burst idle pending when a CANVAS drag begins fired
   MID-DRAG — the canvas arms its own gestures through the store
   directly — pushing the mid-drag state into history and breaking
   the standing canceled-drag undo pin (editor-integrity). Every
   closure terminal now verifies OWNERSHIP (the snapshot reference
   the closure armed vs the store's current one; a foreign gesture
   passes through untouched). (c) Two standing pins legitimately
   re-anchored onto the surface-capturing idle forms (the
   slider-surface textTick pin + the slider-gesture Content-input
   pin — each with the contract-change comment).

3. **The thumbnail containment pin's first form checked every
   descendant div — and failed POST-fix on the content-fit's own
   transform carrier** (its rect maps through the transform; its
   paint is its children). The refined check covers the WRAPPER (the
   scale carrier — the defect's own mechanism) and the element divs
   (those with inline left/top), skipping the structural carrier.

4. **The capture script's F42 case patterns reject unescaped
   parentheses in bash patterns** (the session-64 script's second
   alternative forms) — the escaped-space forms match alone.
