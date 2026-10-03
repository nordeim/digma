# Remediation Plan — Session 66 (the Fourteenth Audit)

**Date:** 2026-10-03 · **Trigger:** the operator's session-89/90-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the `.env` database contract, the vitest/playwright suites, the TDD remediation, the screenshots, the aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's hunk-by-hunk review of the session-65 delivery (all five
S65 seams verified intact in source at baseline: the `thumbnailFit`
min-fit + centering seam at `lib/editor.ts:484` consumed by the
measured ResizeObserver wrapper in `project-card.tsx:109-112`, the
`resetSliderGesture` closure terminal at `properties-panel.tsx:450`
consumed at the shared section bodies `:1198/:1303` + both mobile Sheet
hosts `editor-view.tsx:761/:912` + both loadProject heals `:1078/:1089`,
the field-surface coalescing on both number inputs
(`properties-panel.tsx:104-130/:196-216`), the Low batch (the h1's
`suppressHydrationWarning`, the bell's gray-500, the last-@ authority
split at `db-path.ts:130`, the dropzone's real `onDragOver/onDrop`
`:708-715`, the six DialogContent S60-F forms), and the ONE shared
`call()` seam at `src/lib/call.ts` with the three views importing it),
then the FOURTEENTH Mode C audit: two independent fresh-eyes full-file
reviews by separate agents over the least-recently-reviewed surfaces —
auditor A over the editor core (editor-view/editor-store/canvas/
properties-panel/toolbar/layers/components/AI panel/lib/editor/
lib/ai-assistant/call — last independently reviewed session 64; the
interleaving findings verified empirically with a scratch simulation
outside the repo replicating the exact store + closure semantics),
auditor B over the server + lib/config/infra side (all 18 API route
files, the 11 pure lib seams, proxy.ts, the prisma schema + seed, the
vitest/playwright/smoke test infra, the 6 configs, both auth screens —
last independently reviewed session 64; the redaction re-derivation
executed as a 17-form probe) — against the `skills/code-review-checklist`
dimensions with the AGENTS/CLAUDE documented contracts loaded first.
Every chosen finding individually re-verified by the lead in source
before this plan. The baseline gate re-proven green BEFORE any change
(426 unit / 82 files · build 23 routes · 56 smoke · 221 e2e), the DB
re-seeded to the pristine 1/2/6/1/3 contract, the parent-shell
`DATABASE_URL` trap neutralized (the `unset` discipline in every
db-touching command).

## Reference findings (42nd audit — no drift, no new gaps)

The standing datums re-verified on
`https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 +
mobile 390×844, the real CDP fill login): the desktop nav 124/96/92 × 36;
the greeting "Good morning, sepnetflix2023 ✨" (the name populated); Quick
Stats 1 Projects / 0 Teams / Pro Plan; the Recent sort `last_accessed` /
"1 file found"; zero kbd affordances; the Create-Team dead chrome the 42nd
("Create Team" + "Create Your First Team", 2 clicks, 0 dialogs); R3 mobile
nav failure class A the 42nd (nav `display:none`, links 0×0, no hamburger
— the dashboard AND the editor page; evidence `ref-audit-s76/ref-01` and
`ref-02`); the mobile editor header clipping Share/Present at 390
re-measured exactly (Share L385–R458, Present L466–R551 — byte-identical
to the session-63/64/65 measurement; evidence `ref-audit-s76/ref-02`);
the board at 9 layers ("9 layers" + "Test Project One", opened through
the project-card ANCHOR after the generic card probe missed — the
anchor's own text is "Type here...", the project name lives in the
sibling h3; the same first-attempt miss as sessions 62/63/64/65).
Evidence set: `docs/screenshots/ref-audit-s76/` (ref-00 desktop
dashboard, ref-01 mobile dashboard 390, ref-02 mobile editor 390,
ref-03 desktop Recent grid, ref-04 desktop editor).

The clone's mobile navigation verified live, end-to-end at 390×844 —
the 43rd consecutive session, ALL GREEN via the single-call verifier
`scripts/verify-nav-s66.sh` (9/9: the 44×44 hamburger with the aria
contract at [16,10], the Sheet dialog with 44px links +
aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape
with focus return + lock release, navigate-and-dismiss, the md-crossing
close, the 768 boundary, and the class-A guard — the Tailwind v4
failure class A NOT present).

## The code audit findings (Mode C — fourteenth pass)

The session-65 delivery itself is clean (all five seams verified to
hold; the 426/56/221 gate re-proven green at baseline before any
change; auditor B: "NEW session-65 defects: NONE found" — the findings
below are pre-existing classes, three of them widened by S65-C's new
surfaces). The two fresh-eyes passes found **0 Critical / 0 High /
7 Medium / 6 Low / 9 Informational** combined — every chosen finding
individually re-verified by the lead in source:

- **A-1 (Medium): a canvas pointerdown inside a typing burst's 150ms
  window silently DROPS the burst's undo entry.** `canvas.tsx:181` (the
  move branch's `beginGesture()`) and `:484` (the resize branch's) —
  the store's `beginGesture` (`editor-store.ts:374`) is an
  unconditional overwrite. The interleave: type into a number field →
  `textTick` arms the store's gestureSnapshot at the PRE-typing state
  S0; within 150ms pointer-down an element (the canvas handler runs
  BEFORE the input's blur — blur is mousedown's default action) → the
  canvas's begin overwrites S0 with the post-typing S1; the field's
  blur → `finish("field")` → ownership check fails → no-op; the drag's
  endGesture pushes S1. Net: `past` never contains S0 — the typed
  change cannot be undone separately. Pre-existing class (the Content
  input since S62-A); S65-C widened it to ~15 number-field surfaces.
- **A-2 (Medium): the closure's `begin()` can clobber a LIVE canvas
  gesture mid-drag (multi-touch).** `properties-panel.tsx:361-380` —
  `begin()` calls `store.beginGesture()` with no foreign-gesture guard
  (textTick's ride-under guard at `:401-405` is the doctrine begin
  lacks). Finger 1 drags an element (canvas gesture armed at the
  pre-drag state); finger 2 focuses a number field in the mobile Sheet
  → the field's focus-begin overwrites the armed snapshot with the
  MID-DRAG state → the drag's history entry is corrupted (or deleted:
  the field's blur finish now OWNS the mid-drag snapshot, `changed`
  false → `cancelGesture()` → the canvas's own pointerup pushes
  nothing). The S65-C ownership design guarded the closure's terminals
  but not its arm path.
- **A-3 (Medium): the native color-picker surfaces commit a full
  history snapshot PER picker change event.** `properties-panel.tsx:256-262`
  (HexColorRow's `type="color"` swatch — Fill, Stroke, Text Color,
  Background Color), `:596-601` (the gradient stop colors), and
  `editor-store.ts:365-371` (`setBackgroundColor` pushes `past`
  unconditionally). Chrome's picker fires continuous `input` events
  while dragging in the popup; no gesture is armed on those surfaces,
  so the update helper's gesture-aware argument reads true → every
  intermediate color pushes a full 60-deep snapshot. The exact
  S62-A/S65-C defect class on the one input family neither pass
  reached.
- **A-4 (Medium): bare focus of any number field arms a store gesture
  with NO idle escape — a transient autosave deferral loop.**
  `properties-panel.tsx:104/:196` (`onFocus={() => sliderGesture.begin("field")}`)
  + `editor-view.tsx:229-232` (markSaved's gesture deferral) +
  `:310-315` (the re-arming subscriber). The 150ms idle starts only at
  the first COMMITTING keystroke; a pure focus (clicking into X to
  read, no typing yet) arms the gesture indefinitely. With pending
  unsaved changes each PUT response hits `gestureSnapshot !== null` →
  `setUnsaved()` → the 800ms subscriber re-arms → an endless loop WHILE
  FOCUSED: the badge flickers Saving…/Unsaved at ~1 PUT/s. Self-heals
  at blur/typing/unmount (not the S65-B permanent HIGH), but S65-C
  widened it from the Content input to every number field. Auditor A's
  informational finding 9 is the shared root: the focus-begin is
  redundant — textTick's begin-on-demand already covers burst starts.
- **B-4 (Low): the auth routes' input-cap asymmetry.**
  `register/route.ts:31` caps name/email/password at 80/200/200 (the
  S62-G fix), but `login/route.ts:19-20` (email+password unbounded →
  `scryptSync` on arbitrary length), `verify-otp`, `resend-otp`,
  `forgot-password` (email), and `reset-password`'s token are uncapped
  — App Router handlers have no default body-size cap; huge strings
  reach scrypt and SQLite equality lookups. Rate-limited to 10/15
  min/IP, so a consistency defect, not an exploitable hole.
- **B-7 (Low): `redactDatabaseUrl` passes malformed credentialed
  strings through verbatim.** `db-path.ts:127-131` — the authority
  regex stops at a raw `/`/`?`/`#`, so `postgres://user:pa/ss@host/db`
  (a raw delimiter inside the password) and schemeless
  `user:pass@host` return UNREDACTED, against the seam's own contract
  ("the secret never prints"). Auditor B's 17-form execution probe
  verified every parseable form correct (multi-@, percent-encoded,
  IPv6, mysql, fragments) — the leak is only the malformed family.
- **B-8 (Low): the `AUTH_SECRET` fallback engages without warning.**
  `auth.ts:18-20` — `process.env.AUTH_SECRET || "digma-dev-only-insecure-secret"`
  with no boot-time log: a production deploy that forgets the variable
  mints forgeable tokens silently.
- **A-5 (Low): the S65-D dropzone fix is local to the dashed zone.**
  A file dropped anywhere else in the editor (canvas, panel chrome)
  still falls through to the browser default and navigates the tab to
  the blob.
- **A-6 (Low): the image upload has no keyboard path.**
  `properties-panel.tsx:717-731` — the file input is
  `className="hidden"` (display:none — removed from the tab order and
  the a11y tree) and the clickable `<label>` is not focusable.
- **The deferred batch (documented, not chosen):** B-1/B-5 the auth
  enumeration oracles (bounded by the 10/15min/IP limiter + the
  documented no-enumeration discipline; the resetUrl oracle vanishes
  under `DIGMA_DISABLE_IN_APP_RESET=1`), B-15 the ai-assistant route's
  missing rate limit (a dedicated-limit design that respects the
  standing gate's shared-IP budget — the e2e/smoke suites drive the
  route from one localhost IP), B-5 the stateless-session revocation
  gap (the tokenVersion schema-column + token-format change, needing
  dedicated auth re-pinning — sharpened this session: password reset
  does not evict previously minted tokens), B-6 the single-tenant
  data-ownership posture (matches the reference's own model), the
  elements POST/PUT row-builder semantic drift (the dedup family), the
  dead schema columns, the list-payload perf (`include: { elements }`
  ships full rows), the lint gate's disabled correctness rule classes,
  the smoke trap's discipline-only mitigation, the playwright
  `reuseExistingServer` leftover-server hazard, and the informational
  batch (the clamped-draft divergence, the AI fetch lifecycle, the
  duplicated hashPassword seam, the inert sanitizer type cast, the
  verify-otp concurrent-attempts message, the call.ts scope-comment
  overstatement).

### Verified clean (explicitly re-checked)

The MobileNav contract in full (9/9 via the verifier, the 43rd
consecutive session); the five session-65 spec files are REAL (no
vacuous anchors — both auditors re-derived the pins independently);
the S65 seams all present; the thumbnailFit math re-derived; the
reset/ownership semantics simulation-verified; the redaction
re-derivation executed (17 forms); the call() seam's 10 call sites
verified; globals.css v4 discipline; the vitest/playwright isolation
(skills/ excluded by pattern, :3100 + `db/e2e.db` +
`DIGMA_DISABLE_AI_LLM=1`, storageState, workers=1); the smoke bucket
discipline (verified arithmetically exact); the store selector
discipline; the elements route contract (ELEMENT_LIMIT, transactional
replace, P2025/P2003); the autosave machine (serialized flushes,
guards, keepalive); the auth correctness (scrypt + timingSafeEqual,
atomic verify ceiling, P2002 catch); the rate limiter math + XFF
last-hop keying; zero XSS/injection sinks repo-wide; the proxy
exact-match 307s; the prisma cascades + idempotent seed; the
server-side gating on every page; the five-state auth card.

## The chosen session work (TDD)

### S66-A — the gesture-arm interleaving family (A-1 + A-2 + A-4)

Three coordinated changes to the one gesture seam (the S64-B/S65-C
ownership doctrine reaching the two directions it missed):

1. **The canvas flush-foreign-first (A-1):** `resetSliderGesture()`
   BEFORE `beginGesture()` at both canvas arm sites (`canvas.tsx:181`
   move branch, `:484` resize branch). The closure's CHANGED burst
   flushes its one entry (the typed change keeps its undo step);
   an unchanged one cancels; a canvas-foreign gesture passes untouched
   (the ownership guard inside reset). The store's beginGesture then
   arms fresh — both entries land in `past` (pre-typing AND
   pre-drag), the exact S64-B flush-first doctrine mirrored.
2. **The begin foreign-ride guard (A-2):** `begin(surface)` reads the
   LIVE store state (re-read after the flush branch — the captured
   snapshot predates it) and when the store carries a FOREIGN gesture
   (non-null, not `armed`), rides under it (`armed = null`, no
   `beginGesture` call) — textTick's `:401-405` doctrine reaching the
   arm path. A live canvas gesture can no longer be clobbered by a
   panel surface's focus/pointerdown begin.
3. **Drop the redundant focus-begins (A-4):** `NumberField` and
   `GuardedNumberInput` lose `onFocus={() => sliderGesture.begin("field")}`;
   the Content input loses `onFocus={() => sliderGesture.begin("text")}`.
   textTick's begin-on-demand covers burst starts (the first COMMITTING
   event arms); a bare focus arms NOTHING — the autosave's
   markSaved deferral can no longer loop on a read-only focus. The
   blur finishes stay (safety terminals — they end a live burst
   immediately instead of waiting out the 150ms idle; they no-op when
   nothing is armed). The slider's pointerdown-begin is untouched (a
   real gesture start with ticks following immediately).

Unit pins: the source contracts (the reset-before-begin ordering at
both canvas sites; the begin guard's live re-read + ride-under form;
the ABSENCE of the three focus-begins; the preservation of the blur
finishes + the textTick commits + the slider pointerdown wiring).
E2E pins: the type-then-drag TWO-undo contract (fill the Content
input, drag the element within the 150ms idle window — undo #1
restores the pre-drag text, undo #2 the PRE-TYPING text; pre-fix the
burst's entry is gone) and the bare-focus convergence (drag an
element, immediately focus the X field WITHOUT typing — the Saved
badge must converge while focused; pre-fix the deferral loop keeps it
oscillating).

### S66-B — the color-picker coalescing (A-3)

1. **HexColorRow's swatch** (`properties-panel.tsx:256-262`): the
   `type="color"` onChange commits through `sliderGesture.textTick()`
   first (the idle-coalesced burst — continuous popup input events,
   one history entry per picker drag) + `onBlur={() =>
   sliderGesture.finish("text")}` (the popup close ends the burst
   immediately). The hex TEXT input stays discrete (keyboard-only
   changes are discrete intent per the S62-A doctrine — a full-hex
   entry commits exactly once).
2. **The gradient stop color swatches** (`:596-601`): the same
   textTick + blur wiring.
3. **`setBackgroundColor`** (`editor-store.ts:365-371`): the
   gesture-aware conditional history push, matching `updateElements`'
   commit form (`state.gestureSnapshot ? {} : { past: push, future: [] }`)
   — a picker drag commits history-free; the terminal endGesture pushes
   the ONE pre-picker snapshot. The autosave's captured-backgroundColor
   response guard (S60-A) is untouched — it reads saveState, not
   history.

Unit pins: the source contracts (the swatch's textTick-before-commit
ordering + the blur finish on both surfaces; the conditional past
push) + preservation (the hex text input's discrete commit unchanged;
the update helper's gesture-aware argument unchanged).
E2E pin: the picker-drag one-undo contract (dispatch five synthetic
input events on the Fill swatch, blur, ONE Ctrl+Z — the fill restores
the ORIGINAL color; pre-fix the per-event stack restores an
intermediate color on the first undo).

### S66-C — the Low batch (B-4 + B-7 + B-8 + A-5 + A-6)

- **B-4:** the five uncapped auth routes gain the register-family
  length caps (login: email ≤ 200 + password ≤ 200; verify-otp:
  email ≤ 200 + code ≤ 32; resend-otp: email ≤ 200; forgot-password:
  email ≤ 200; reset-password: token ≤ 200 — the password cap exists
  from session 64) — each answering the same 400 VALIDATION envelope
  shape register answers ("… must be reasonably sized").
- **B-7:** `redactDatabaseUrl` fails closed — when the strict
  authority parse finds no `@` but the string carries a LATER one
  (the raw-delimiter-in-password family), the whole span from the
  scheme to the LAST `@` collapses to `***` (over-redaction is the
  documented safe direction; `postgres://user:pa/ss@host/db` →
  `postgres://***@host/db`). The schemeless non-URL stays verbatim
  (out of contract — documented).
- **B-8:** the `AUTH_SECRET` fallback fires a ONE-TIME `console.warn`
  per process (a module-level once-guard; the seam runs per token
  mint/verify) naming the fix (`openssl rand -hex 32`).
- **A-5:** the editor mounts a window-level `dragover` + `drop`
  preventDefault pair (with cleanup) — a file dropped anywhere in the
  editor no longer navigates the tab to the blob; the dashed
  dropzone's own handlers still run first at the target.
- **A-6:** the upload label becomes keyboard-reachable — `tabIndex={0}`
  + `role="button"` + an Enter/Space keydown that clicks it (the
  label's activation behavior forwards to the hidden input) + a
  visible focus ring. The visible text stays the accessible name.

Unit pins: the five source contracts + the redaction behavioral pins
(the malformed family redacted, the schemeless passthrough, the
preservation of the standing forms) + the once-guard form.

## Planned counts

Unit: +18 pins across three new spec files
(`tests/gesture-arm-s66.test.ts` 7, `tests/color-coalesce-s66.test.ts`
5, `tests/low-batch-s66.test.ts` 6) → **~444 = 426 + 18**. E2E: +3 pins
in `tests/e2e/session66-fixes.spec.ts` (the type-then-drag two-undo,
the bare-focus convergence, the picker-drag one-undo) → **~224 = 221 +
3**.

## RED expectations

Unit RED: the canvas sites without the reset-before-begin ordering;
the begin without the live re-read + ride-under guard; the three
focus-begins still present (the absence pins fail); the swatch
without the textTick/blur wiring; setBackgroundColor's unconditional
push; the five routes without caps; the malformed redaction forms
leaking; no once-guard warn; no label keyboard wiring; no window drop
guard. E2E RED against the pre-fix standalone build: the second undo
after type-then-drag restores the WRONG (older-than-pre-typing) state;
the bare-focus badge count 0 after the 10s poll; the picker's first
undo restores an intermediate color.

## Execution order

S66-A → S66-B → S66-C (the interleaving family first — B's swatch
wiring rides the seam A stabilizes — then the Lows) → unit GREEN →
build → e2e RED (pre-fix standalone) → e2e GREEN → smoke → full gate →
live verification + screenshots → docs → commit + push.

## Execution status

- [x] S66-A — the gesture-arm interleaving family
- [x] S66-B — the color-picker coalescing
- [x] S66-C — the Low batch
- [x] Full gate green — zero regressions (lint · typecheck · 453 unit = 426 + 27 / 85 files · build 23 routes · 56 smoke · 224 e2e = 221 + 3)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the S66 build after the changes — the 43rd consecutive session; the standard 32 re-captured + the ref-audit-s76 evidence set with clone-15 the bare-focus convergence evidence captured BY the e2e pin at the verified-assertion moment + clone-16 the picker one-undo evidence with the inline seeded-restore check + clone-17 the upload keyboard-path evidence with the inline focusability check)

## Execution notes (the realized counts + the en-route work)

Unit: +27 checks across three new spec files (gesture-arm-s66 7,
color-coalesce-s66 6, low-batch-s66 14) → **453 = 426 + 27** (the plan
estimated ~+18 — the realized low-batch file carries the redaction
behavioral pins + the five route-cap pins + the warn/guard/label pins,
richer than the estimate).

E2E: +3 pins in `tests/e2e/session66-fixes.spec.ts` → **224 = 221 +
3**, all three honestly RED against the pre-fix standalone build at
exactly the defect assertions (the second undo after type-then-drag
restoring the TYPED text "Edited headline" instead of the pre-typing
"Fixture headline"; the bare-focus badge count 0 after the 10s poll;
the picker's first undo restoring #dd0033 — one intermediate color
deep).

**The en-route work (the F53 lessons):**

1. **The session-65 number-field e2e pin failed POST-fix — the S65-C
   `textTick` HARDCODED its arm under the text surface label while the
   field's blur terminal says `finish("field")`.** The mismatch was
   masked in session 65 (the focus-begin had already armed the field
   surface and the tick rode under it); with the focus arm retired the
   field bursts armed under the WRONG label, the field's blur
   no-opped, and the gesture outlived the blur by the full 150ms idle
   — the pin's Ctrl+Z landed in that window, hit the still-armed
   snapshot, and no-opped (received 250, expected 160). The tick's
   surface became a PARAMETER (text default; the fields pass "field")
   — exactly what the S65-C documentation SAID but the implementation
   never did.

2. **The capture script's picker check initially used a synthetic
   canvas click (pointerdown + pointerup in ONE eval) — React only
   flushes the pointerdown's setDrag between macrotasks**, so the
   same-eval pointerup saw `drag === null`, skipped the plain-click
   CANCEL path, and left the canvas gesture ARMED; the picker's
   commits then correctly rode under it (the ownership guard doing its
   job) and the undo found an empty past. The check moved onto the
   Background Color row (no canvas click, no drag state machine) —
   exercising the S66-B seam end-to-end through the gesture-aware
   setBackgroundColor.

3. **The login route initially missed the `fail` import** — the
   typecheck gate caught it; the piped-tail gate chain (`cmd | tail`
   swallows the exit code) still ran the later gates against the
   broken code, so the full e2e was re-run on the final code (224
   passed twice).

4. **The e2e picker pin's first form expected the UPPERCASE hex** —
   the native color input normalizes its values to lowercase; the
   intermediate-state poll reads the browser-normalized form while the
   final restored value keeps the SEEDED case.
