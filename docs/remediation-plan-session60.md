# Remediation Plan — Session 60 (the Thirty-Sixth Audit)

**Date:** 2026-10-02 · **Trigger:** the operator's session-77/78 directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the scandihaven tech-stack patterns as reference, TDD, the standing vitest + playwright gates, `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, the screenshots under `docs/screenshots/`, a verified `.env.example`, aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's hunk-by-hunk review of the session-59 delivery (all eight S59
seams verified intact in source — the layers-row nested-control guard, the
colorFor word boundary, the exactly-3-or-6 sanitizer regexes, the add-branch
defined-key partial, the multi-selection fill commit, the spaceDown blur
reset, the handle stopPropagation wrappers, the AbortSignal timeout), then
the EIGHTH Mode C audit: two independent fresh-eyes full-file reviews by
separate agents over the least-recently-reviewed surfaces — auditor A over
`editor-view.tsx` (the editor shell — autosave/present/shortcuts/panel
chips/mobile Sheets) + `app-header.tsx` (the shared chrome + MobileNav),
auditor B over the complete API surface (all 18 route handlers) + the lib
layer (`api/validation/auth/rate-limit/greeting/team/db/db-path/export-png`
+ the sanitizer) — against the `skills/code-review-checklist` dimensions
with the AGENTS documented contracts loaded first. Every chosen finding
individually re-verified by the lead in source before this plan.

## Reference findings (36th audit — no drift, no new gaps)

The standing datums re-verified on
`https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 +
mobile 390×844): the desktop nav 124/96/92 × 36 with the 36px unlabeled
bell; the greeting "Good morning, sepnetflix2023 ✨" (the name populated,
the morning bucket); Quick Stats 1/0/1/Pro; the Recent sort
`last_accessed` (displayed "Last Opened") / "1 file found"; the board at 9
layers — still "Test Project One"; zero kbd affordances (36th datum); the
Create-Team dead chrome the 36th (2 clicks, 0 dialogs over the empty Teams
state); R3 mobile nav failure class A the 36th (nav `display:none`, all
three links 0×0, no hamburger, only the dead unlabeled 36px bell; evidence
`ref-audit-s70/ref-01`); the mobile editor header clipping Share/Present
at 390 (Share L394–R467, Present L475–R559 — both fully offscreen; the
standing class; evidence `ref-audit-s70/ref-02`). Evidence set:
`docs/screenshots/ref-audit-s70/` (ref-00 desktop dashboard, ref-01 mobile
dashboard 390, ref-02 mobile editor 390, ref-03 desktop Recent).

The clone's mobile navigation verified live, end-to-end at 390×844 — the
36th consecutive session, ALL GREEN via the single-call verifier (8/8: the
44×44 hamburger with the aria contract at [16,10], the Sheet dialog with
44px links + aria-describedby, the scroll lock, the focus trap, Escape with
focus return + lock release, navigate-and-dismiss, the md-crossing close,
the 768 boundary; the Tailwind v4 failure class A NOT present).

## The code audit findings (Mode C — eighth pass)

The session-59 delivery itself is clean (all eight seams verified to hold;
the 269/56/204 gate re-proven green at baseline before any change — the
DB drifted to 8 elements from a lingering next-server process and was
re-seeded to the pristine 1/2/6/1 contract first). The two fresh-eyes
passes found **0 High / 1 Medium / 10 Low / 9 Informational** combined —
every chosen finding individually re-verified by the lead in source:

- **A-1 (Medium): the autosave's edit-during-flight guard covers elements
  but NOT backgroundColor.** `editor-view.tsx:202-229` — the S56-B
  reference guard compares only `now.elements !== capturedElements`
  before `markSaved`. `setBackgroundColor` (editor-store) flips
  `saveState: "unsaved"` WITHOUT touching the elements array reference,
  so a Background Color change landing while the PUT is in flight passes
  the guard, `markSaved` stamps `"saved"`, and the armed retry timer
  early-returns on `"saved"` — the new color is silently never PUT and
  reverts on reload while the badge reads "Saved". The PUT body already
  carries `backgroundColor: capturedBackgroundColor` (S57-B), so the
  capture variable exists; the response-time compare is simply missing.
  Same data-loss class as the S56-B/S57-B family.
- **A-2 (Low): tool shortcuts dispatch under Ctrl/Cmd chords.** The
  keydown handler's meta branches intercept only z/y/=/-/0 and return;
  every other modifier chord falls through to
  `toolForShortcut(event.key)`. Ctrl+F (browser find), Ctrl+P (print),
  Ctrl+O, Cmd+V etc. reach the page with `key:"f"/"p"/"o"/"v"` — the
  browser performs its native action AND the editor silently switches to
  Frame/Pen/Ellipse/Select behind the user's back.
- **B-L-1 (Low): the Create-Team inline first-member creation skips the
  email validation the members route enforces.** `teams/route.ts:36-49`
  gates on a raw truthy `body?.memberEmail` and writes
  `email: clampOptionalText(...)` with NO format check, while the sibling
  invite route validates `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` and 400s. The
  Create Team dialog sends unvalidated input, so "abc" in the Create Team
  dialog silently creates a garbage member while the same input in the
  Invite Member dialog is rejected.
- **B-L-2 (Low): the 2000-element ceiling exists only on the PUT — the
  POST and every client add path are uncapped.** The PUT rejects
  `list.length > 2000` with 400, but the POST computes `count` only for
  the sortOrder default and never caps. Crossing 2000 (scripted POSTs or
  patiently drawing element #2001) makes EVERY subsequent autosave PUT
  fail with the "Too many elements (max 2000)" 400 toast — the design is
  unsavable until the user deletes back below the cap.
- **B-L-3 (Low): a zero-operation LLM reply is silently discarded in
  favor of the canned fallback.** `ai-assistant.ts:313` —
  `if (!reply || operations.length === 0) return null;` rejects a
  well-formed non-empty `reply` carrying zero operations, so the route
  keeps the deterministic fallback. With the LLM enabled (the production
  default — only e2e forces the degrade), any conversational model answer
  with no operations is thrown away and the user always sees the canned
  "I can add shapes…" reply. The client already handles empty
  `operations[]` safely (`applied = 0`).
- **A-4 (Low): the mobile Sheets' built-in Close X is ~20px — below the
  project's own 44px touch floor.** The vendored SheetContent's close
  button has no size classes (`X` is `h-5 w-5`, no padding). MobileNav
  fixes exactly this on the SAME vendored component with
  `[&>button]:h-11 [&>button]:w-11`; the two editor Sheets
  (MobilePropertiesEditor, MobileCanvasProperties) don't carry it, so
  their primary in-Sheet dismiss affordance is well under the documented
  44px floor.
- **A-5 (Low): Share silently no-ops when `navigator.clipboard` is
  undefined.** `navigator.clipboard?.writeText(url).then(…).catch(…)` —
  the optional chain short-circuits the ENTIRE expression when clipboard
  is absent (insecure-context deployments), so neither the success toast
  nor the `.catch` fallback toast ever fires: the Share button does
  nothing at all, with zero feedback.
- **A-7 (Low): no mobile properties surface for multi-selection.**
  `MobilePropertiesEditor` renders only at `selectedIds.length === 1`;
  `MobileCanvasProperties` only at `=== 0`. The desktop panel gained the
  multi-selection Fill/Stroke branch (S59-E), but below lg with a marquee
  multi-selection (reachable via touch drag) NEITHER chip renders — no
  properties surface of any kind, a gap the chip family's own
  completeness rationale no longer describes.
- **A-3 (deferred): no flush on refresh / tab close / browser Back.** The
  machine flushes only via the 800ms timer and `exit()`; no
  `beforeunload`/`pagehide`/`sendBeacon`/`keepalive` anywhere in `src`
  (grep-verified). Edits inside the debounce window are lost on F5/tab
  close. A new persistence surface (the captured-body contract over a
  keepalive fetch) — deferred as a design item, not a seam fix.
- **A-6 (deferred): a transient load failure (5xx/network) on a valid
  projectId lands in Untitled — the next autosave duplicates the
  project.** The loader treats any non-ok/throwing GET identically
  (silent Untitled). For a 404 that is ADR-009 parity; for a transient
  500 the user's next edit POSTs a brand-new duplicate. Distinguishing
  needs a UX decision (retry vs error state vs Untitled) — deferred to
  the next UX pass.
- **Informational (documented, not scheduled):** A-8 the PresentOverlay
  aria-label teaches "press Escape" on touch devices (the visible label
  got the F34 device-coherent treatment, the aria-label did not); A-9 the
  dead `toast` import in app-header.tsx; A-10 the MobileNav trigger's
  inert sr-only Open/Close span (the stable aria-label wins the
  accessible-name computation); A-11 the left panels mounting invisibly
  below md; A-12 the ShortcutsDialog's missing DialogDescription; B-I-1
  the login VERIFY_EMAIL 403 carrying data fields outside the envelope
  (the client depends on the shape); B-I-2 the 429 raw-envelope +
  Retry-After block copy-pasted six times (the drift class that produced
  S58-F); B-I-3 `paintFor`'s dead `defs` return value (the double
  parseGradient); B-I-4 the 6-digit verify-code generator in three
  copies; B-I-5 the PUT's caps multiplying to a ~1.4 GB request body
  (a Content-Length guard if ever revisited).

### Verified clean (explicitly re-checked)

The autosave machine's four `disposed` gates + the captured-body contract
+ the projectId swap guard + the gesture deferral (all intact except
A-1's background compare); the PresentOverlay's data-state stand-down,
text fidelity contract, fit, scroll lock, focus move/return, and the 44px
Exit; the shortcuts stand-down behind dialogs AND menus; the panel chips'
independent toggles with defaults ON/OFF/ON; the mobile Sheets'
SheetDescription wiring + the lg-crossing close + the render-time
compare-and-adjust; the UNTITLED contract + the replaceState adoption
guard; the MobileNav contract (the 36th live verification, 8/8); the
desktop nav's exact-pathname pill; zero set-state-in-effect bodies;
every listener/effect cleaned up; session gating + the envelope on all 13
non-public handlers; the S56-H elements seams; the S58-C safeFromUrl;
the color contracts (HEX_COLOR, clampColor, the S59-B/C seams); the
S56-E image whitelist; the rate limiter on all six auth routes including
the reset-password Retry-After; the auth crypto (scrypt +
timingSafeEqual); the db-path anchor resolution (side-effect pushes); the
export-png contracts (the shared triggerBlobDownload, the XML
declaration, the image fill="none"); the AI route's sanitize caps + the
locked wall at the client apply seam; the stats access-based contract;
no CSRF exposure (sameSite=lax + JSON bodies).

## The chosen session work (TDD)

### S60-A — the autosave background-color mid-flight guard (A-1)

The response-time guard gains the background compare beside the elements
compare: `if (now.backgroundColor !== capturedBackgroundColor) {
now.setUnsaved(); return; }` — a Background Color change landing while
the PUT is in flight keeps the newer color (markSaved would stamp
"saved" over it), and the follow-up flush persists it. The same
keep-the-newer-state doctrine as the elements guard, closing the body's
other half.

### S60-B — the tool-shortcut modifier bail (A-2)

The keydown handler bails before the tool dispatch when
`event.ctrlKey || event.metaKey || event.altKey` is set — the tool keys
are single-key shortcuts by contract (the toolbar's "(V)" titles), and a
modifier chord is either an intercepted editor action (z/y/=/-/0,
already returned) or a browser/OS action the editor must leave alone.

### S60-C — the Create-Team inline member email validation (B-L-1)

The inline first-member creation validates the email with the SAME
regex the members route enforces before creating the member: an invalid
`memberEmail` returns `fail("VALIDATION", "Enter a valid email
address", 400)` — the two invite paths answer identically. A valid email
or an absent email create exactly as before.

### S60-D — the elements POST cap (B-L-2)

The POST rejects when the project is already at the ceiling: after the
existing `count` query, `if (count >= 2000) return fail("VALIDATION",
"Too many elements (max 2000)", 400);` — the same message and contract
the PUT carries, enforced at the only other write path. The design can
no longer be pushed past the autosave ceiling through the single-element
route.

### S60-E — the zero-op LLM reply passthrough (B-L-3)

The sanitizer's guard splits: `if (!reply) return null; return { reply,
operations };` — a well-formed non-empty reply with zero operations
flows through (the client already renders `applied = 0` safely); only an
empty/missing reply still rejects to the fallback. The LLM's
conversational answers reach the user.

### S60-F — the mobile Sheet close-X 44px targets (A-4)

Both editor SheetContents (MobilePropertiesEditor,
MobileCanvasProperties) carry the MobileNav's own fix for the same
vendored component: `[&>button]:h-11 [&>button]:w-11` (plus flex
centering) — the built-in Close X meets the project's 44px touch floor
at every Radix Sheet in the app.

### S60-G — the Share clipboard fallback branch (A-5)

`onShare` branches on `navigator.clipboard` presence: present → the
existing writeText().then(success).catch(fallback) chain; absent → the
fallback toast fires DIRECTLY ("Share this project" + the URL) — the
button always answers, never silently no-ops.

### S60-H — the mobile multi-selection properties surface (A-7)

The desktop panel's multi-selection section exports as
`MultiSelectionSection` (the CanvasBackgroundSection pattern — the
shared-section architecture) and the mobile chip's condition widens to
ANY non-empty selection: the selector returns the selection snapshot,
the Sheet body renders `PropertiesSections` for a single element OR
`MultiSelectionSection` for several, and the `update` callback applies
to ALL selected ids (the desktop panel's own
`updateElements(selectedIds, patch)` contract). A marquee multi-selection
on a phone now surfaces the Fill/Stroke rows exactly like the desktop.

## Planned counts

Unit: +18 pins across six new spec files
(`tests/autosave-background.test.ts` 3, `tests/tool-modifiers.test.ts` 2,
`tests/teams-email.test.ts` 3, `tests/elements-cap.test.ts` 2,
`tests/ai-zero-op.test.ts` 3, `tests/mobile-surface-s60.test.ts` 5 — the
Sheet close-X size + the Share fallback + the multi-selection surface) →
**287 = 269 + 18**. E2E: +3 pins in a new
`tests/e2e/session60-fixes.spec.ts` (the background-color mid-flight
survival, the Ctrl+F no-tool-switch, the mobile multi-selection Sheet) →
**207 = 204 + 3**.

## RED expectations

Unit RED: the background compare absent (the source pin fails at the
missing `now.backgroundColor !== capturedBackgroundColor`), the modifier
bail absent, the teams create-path regex absent, the POST count-cap
absent, the combined `!reply || operations.length === 0` guard still
present, the `[&>button]:h-11` classes absent on the editor Sheets, the
clipboard optional-chain still present, the `MultiSelectionSection`
export absent / the chip still single-selection-gated. E2E RED against
the pre-fix standalone build: a background change landing mid-flight PUT
reverts after reload (the stored color is the pre-change value), a
Ctrl+F chord flips the active tool (aria-pressed / toolbar title), a
mobile multi-selection renders NO Edit-properties chip (the button
count at bottom-right is zero).

## Execution order

S60-A → S60-B → S60-C → S60-D → S60-E → S60-F → S60-G → S60-H (the
Medium first, then the pure-seam Lows, then the API Lows, then the
mobile-surface Lows) → unit GREEN → build → e2e RED → e2e GREEN → smoke
→ full gate → live verification + screenshots → docs → commit + push.

## Execution status

- [x] S60-A — the autosave background-color mid-flight guard
- [x] S60-B — the tool-shortcut modifier bail
- [x] S60-C — the Create-Team inline member email validation
- [x] S60-D — the elements POST cap
- [x] S60-E — the zero-op LLM reply passthrough
- [x] S60-F — the mobile Sheet close-X 44px targets
- [x] S60-G — the Share clipboard fallback branch
- [x] S60-H — the mobile multi-selection properties surface
- [x] Full gate green — zero regressions (lint · typecheck · 288 unit = 269 + 19 · build 23 routes · 56 smoke · 207 e2e = 204 + 3)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 — the 8 checks + the class-A guard — the 37th session on the S60 build; the DB re-seeded to the pristine contract after every mutating phase; the standard 32 + the ref-audit-s70 evidence set captured with the F42 inline checks — clone-07 the S60-H marquee-Sheet evidence with chip:true/selected:true/dialog:true/multiRegion:true; dimension-checked 91/91; VLM content-verified 15/15 — clone-07's call initially rate-limited 429 after the batch, re-verified on retry)

## Execution notes (the realized counts)

Unit: +19 pins across six new spec files (`tests/autosave-background.test.ts` 3, `tests/tool-modifiers.test.ts` 2, `tests/teams-email.test.ts` 3, `tests/elements-cap.test.ts` 2, `tests/ai-zero-op.test.ts` 3, `tests/mobile-surface-s60.test.ts` 6 — one more than planned: the multi-selection surface needed the export-consumption + the any-selection guard + the Sheet-body branch as separate pins) → **288 = 269 + 19** (the plan estimated 287). The session-52 sanitizer pin (`src/lib/ai-assistant.test.ts` — "returns null when the reply or operations are missing") legitimately changed contract with S60-E: a zero-op reply now passes through — updated in the same commit with the contract-change comment.

E2E: +3 pins in `tests/e2e/session60-fixes.spec.ts` → **207 = 204 + 3**, all three honestly RED against the pre-fix standalone build at exactly the defect assertions (the background reverting to Edit A's #1a2b3c after reload; the Frame tool's aria-pressed true after Ctrl+F; the multi-selection's zero Edit-properties chips). The session-52 mobile-properties marquee pin flipped from the no-chip guard to the any-selection contract (the S60-H legitimate change) — equally RED pre-fix, GREEN post-fix. The multi-selection pin builds its selection with a MARQUEE drag (the hasTouch discipline — click() modifiers do not survive the touch pipeline) and asserts the shared MultiSelectionSection renders with the Fill Color hex applying to every selected id.

En-route test-bug fixes (the pins, not the code): the teams-email preservation pin re-anchored on the normalized local (`...(memberEmail` — the fix normalizes before the gate; a line-break-aware ternary anchor); the tool-modifiers pin re-anchored on the exact dispatch statement (`const tool = toolForShortcut(event.key);` — the S60-B explanatory comment itself quotes the bare call and a bare indexOf found the COMMENT first).
