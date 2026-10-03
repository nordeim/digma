# Remediation Plan — Session 62 (the Tenth Audit)

**Date:** 2026-10-03 · **Trigger:** the operator's session-82-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the scandihaven tech-stack patterns as reference, TDD, the standing vitest + playwright gates, `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, the screenshots under `docs/screenshots/`, a verified `.env.example`, aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's hunk-by-hunk review of the session-61 delivery (all nine S61
seams verified intact in source at baseline — the `#dc2626` destructive
token at `globals.css:33`, the three gray-500 micro-labels, the
loadProject viewport/tool reset, the dblclick nested-control guard, the
AI apply live-state re-read, the `ELEMENT_LIMIT` seam + the store clamp,
the dashboard gradient-on-main, the View-all `Link` + the fire-and-forget
PATCH + the 44px `aria-haspopup` bell, the pagehide keepalive flush + the
adoption-clobber guard at `editor-view.tsx:986` + the flushing-guard
absence), then the TENTH Mode C audit: two independent fresh-eyes
full-file reviews by separate agents over the least-recently-reviewed
surfaces — auditor A over the editor core (`editor-view.tsx` full pass,
`editor-store.ts`, `canvas.tsx`, `properties-panel.tsx`, `lib/editor.ts`,
`lib/ai-assistant.ts`), auditor B over the server/infra side (all 18 API
routes, the auth/rate-limit/db/validation libs, `proxy.ts`,
`prisma/schema.prisma` + `seed.ts`, the e2e setup, both auth screens) —
against the `skills/code-review-checklist` dimensions with the
AGENTS/CLAUDE documented contracts loaded first. Every chosen finding
individually re-verified by the lead in source before this plan. The
baseline gate re-proven green BEFORE any change (316 unit / 56 smoke /
213 e2e / build 23 routes), the DB re-seeded to the pristine 1/2/6/1
contract.

## Reference findings (38th audit — no drift, no new gaps)

The standing datums re-verified on
`https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 +
mobile 390×844): the desktop nav 124/96/92 × 36; the greeting "Good
morning, sepnetflix2023 ✨" (the name populated); Quick Stats 1/0/1/Pro;
the Recent sort `last_accessed` / "1 file found"; zero kbd affordances;
the Create-Team dead chrome the 38th (2 clicks, 0 dialogs); R3 mobile nav
failure class A the 38th (nav `display:none`, all three links 0×0, no
hamburger; evidence `ref-audit-s72/ref-01`); the mobile editor header
clipping Share/Present at 390 (Share L385–R458, Present L466–R551;
evidence `ref-audit-s72/ref-02`); the board at 9 layers (Frame 1, Text
8, Circle 7, Line 6, Line 5, Rectangle 4–1). Evidence set:
`docs/screenshots/ref-audit-s72/` (ref-00 desktop dashboard, ref-01
mobile dashboard 390, ref-02 mobile editor 390, ref-03 desktop Recent,
ref-04 desktop editor).

The clone's mobile navigation verified live, end-to-end at 390×844 —
the 39th consecutive session, ALL GREEN via the single-call verifier
(9/9: the 44×44 hamburger with the aria contract at [16,10], the Sheet
dialog with 44px links + aria-describedby, the scroll lock, the focus
trap, Escape with focus return + lock release, navigate-and-dismiss, the
md-crossing close, the 768 boundary, the class-A guard; the Tailwind v4
failure class A NOT present).

## The code audit findings (Mode C — tenth pass)

The session-61 delivery itself is clean (all nine seams verified to
hold; the 316/56/213 gate re-proven green at baseline before any
change). The two fresh-eyes passes found **0 Critical / 0 High / 5
Medium / 15 Low / 8 Informational** combined — every chosen finding
individually re-verified by the lead in source:

- **A-M1 (Medium): S61-I's "browser Back" claim is unmet for in-app
  (soft) back navigation.** `editor-view.tsx:312-317` — the S61-I
  comment claims Back coverage, but the App Router's Dashboard → Editor
  → browser Back is a same-document popstate traversal: `pagehide`
  never fires, the effect's cleanup clears the 800ms timer, and no
  flush runs — an edit inside the debounce window dies. The S61-I e2e
  pin dispatches a synthetic `pagehide`, not a real Back traversal.
- **A-M2 (Medium): panel sliders commit one undo snapshot per tick.**
  `properties-panel.tsx` — every range input's `onChange` → `update` →
  `updateElements` with the default `commit=true` (store
  `:268-277`): one full `snapshotOf(state)` per intermediate value. A
  single 0→100 opacity drag floods the 60-deep `past` stack (earlier
  work becomes unreachable) and leaves per-tick undo granularity —
  the S56-A one-entry-per-gesture doctrine was never applied to panel
  controls.
- **A-M3 (Medium): the shell's `past`/`future` array subscriptions
  re-render the entire editor on every committed mutation.**
  `editor-view.tsx:956-957` — every commit creates a new array
  identity → the whole shell (Toolbar, LayersPanel, Canvas,
  PropertiesPanel, AiAssistant — none memoized) re-renders per
  keystroke/slider tick. The buttons only read `past.length === 0`.
- **B-M1 (Medium): rate-limit keying trusts the first
  (client-suppliable) `X-Forwarded-For` hop.** `rate-limit.ts:49-53` —
  a spoofing client prepends a fake IP; the proxy appends the real one;
  the code takes the fake. The auth brute-force defense
  (10/IP/15 min) is client-evadable. (The first-hop behavior is pinned
  at `src/lib/rate-limit.test.ts:51-53` — a legitimate contract update
  accompanies the fix. The e2e/smoke suites send single-value XFF
  headers — unaffected by last-hop keying.)
- **B-M2 (Medium): verify-otp's wrong-code counter is a non-atomic
  read-modify-write.** `verify-otp/route.ts:54-56` — `findUnique` read
  then `update` write as separate awaits: N concurrent wrong codes all
  read the same `verifyAttempts` and write the same increment — the
  documented 5-attempt ceiling undercounts under concurrency.
- **A-L1 (Low): the 60_000 keepalive body guard measures UTF-16 code
  units, not bytes.** `editor-view.tsx:295` — `payload.length > 60_000`
  counts code units; a CJK/emoji-heavy body can pass the guard and
  still exceed Chromium's 64KB keepalive byte cap (the fetch is
  rejected, silently swallowed). Pinned at
  `tests/unload-flush.test.ts:57` — a legitimate contract update.
- **A-L2 (Low): a disposed flush's terminal "saving" state survives
  re-entry through the adoption guard.** The disposed-gated response
  paths skip both `markSaved` and `setUnsaved`; re-entering the same
  project hits the S61-I guard (skip the re-load) — the only remaining
  `saveState` reset is bypassed and the badge reads "Saving…"
  indefinitely (nothing in flight, nothing retries). Also I4: an
  already-"unsaved" store at re-mount never arms the timer (the
  subscriber fires on changes only).
- **A-L3 (Low): the cap-refused toasts hardcode "2000".**
  `canvas.tsx:140,284` — the S61-F design is one source of truth
  (`ELEMENT_LIMIT`), yet the user-facing message duplicates the
  literal.
- **A-L4 (Low): the deterministic add-reply overclaims at the
  ceiling.** `ai-assistant.ts:220` — at 1,998 elements "Add 3 circles"
  creates 2; the footer honestly reads "2 action(s) performed" but the
  reply still asserts "Added 3 circles."
- **A-L5 (Low): the dead `setName` action carries a latent persistence
  trap.** `editor-store.ts:63,177` — no caller exists, and the PUT
  body never carries the name; any future caller would flip unsaved,
  save, and silently never persist (the S60-A bug shape). Zero test
  references (grep-verified).
- **B-L1 (Low): `Math.random()` verify-code generator — the comment
  claims "crypto-random", triplicated across three routes.**
  `register/route.ts:9-14`, `login/route.ts:42`,
  `resend-otp/route.ts:40` — a doc-integrity defect plus a DRY
  violation on the only email-ownership proof.
- **B-L3 (Low): unbounded input lengths on the public register
  route.** `register/route.ts:26-28` — no cap on `name`, `email`, or
  `password` (every other stored string is capped).
- **B-L5 (Low): the duplicate route's name can exceed the 120 cap; the
  copy is non-transactional.** `duplicate/route.ts:21-37` — 120+7
  chars; `create` + `createMany` as separate awaits (a failure between
  leaves a half-populated copy).
- **B-L7 (Low): a concurrent DELETE makes element/patch writes throw
  P2025 outside the envelope.** The routes `findUnique` first then
  update — a DELETE landing between makes Prisma throw an unstructured
  500 (violating the S56-H no-bare-throw discipline; the autosave PUT
  is exactly a long-running request).
- **A-L6/B-L2/B-L4/B-L6/B-L8/B-L9 (deferred — documented):** the
  bfcache `persisted` flush guard (Reasoned-only confidence, no
  reproduction); the resend-otp enumeration + login timing oracle
  (needs a reference-parity UX decision); the PATCH/POST
  reject-vs-truncate drift (same); the dead `thumbnailSeed` schema
  column (a prisma schema change + re-push); the list-endpoint full
  element payload (perf-at-scale); the POST/PUT row-builder dedup (a
  Mode D refactor). Informational batch: the canvas React-state
  deltas, `deltaMode`, `touch-action`, the second-pointerdown
  mid-gesture, the PresentOverlay board constants, the ADR-014
  in-response delivery, the single-role data model, the AI summary
  hygiene note, the unused server-side search params.

### Verified clean (explicitly re-checked)

The ELEMENT_LIMIT three-seam alignment (no off-by-one: client room
math, POST ceiling, PUT ceiling); the loadProject reset completeness
against the store's full field list; the Zustand immutable-update
discipline; the adoption-clobber guard's refresh matrix (fresh load,
cross-project nav, replaceState re-run, StrictMode); the
timer/exit/keepalive serialization; the elements PUT's
in-transaction response read; the AI sanitize boundary (typed
vocabulary, exactly-3-or-6 hex, 50-op cap, locked-wall client filter);
the teams email-regex parity across both invite paths; the
reset-lifecycle no-enumeration 200 + crypto-random 64-hex token; the
seed's pristine contract; the e2e isolation (`db/e2e.db`,
`DIGMA_DISABLE_AI_LLM=1`, the XFF override in global-setup); the
`safeFromUrl` guard on both consumers; no XSS surfaces; the
security posture of the editor surfaces (no `innerHTML`, hex-validated
LLM output, base64-family image whitelist).

## The chosen session work (TDD)

### S62-A — the slider/text gesture seam (A-M2)

The S56-A one-entry-per-gesture doctrine reaches the properties panel.
A module-level `sliderGesture` helper in `properties-panel.tsx`
(single-pointer-safe) wires `beginGesture()` on the range input's
`pointerdown`, `endGesture()`/`cancelGesture()` on the terminal signals
(`pointerup`/`pointercancel`/`lostpointercapture` — a gesture that
changed nothing cancels, the canvas `moved`/`cancel` convention). The
shared `SliderRow` component (Opacity, Rotation, Scale, Corner Radius,
Stroke Width) and the inline Gradient-angle slider carry the handlers.
The `update` helper's default commit becomes gesture-aware:
`commit = useEditorStore.getState().gestureSnapshot === null` — every
panel control inherits the seam (mid-gesture ticks commit without
history; the single gesture snapshot lands at `endGesture`). The
TextSection Content input gains the same seam on
focus/blur (one history entry per focus session; `onChange` ticks
commit gesture-aware). Keyboard-only slider use (arrow keys, no
pointer) commits per-press — discrete intent, unchanged.

### S62-B — the shell's boolean undo selectors (A-M3)

`const canUndo = useEditorStore((s) => s.past.length > 0); const
canRedo = useEditorStore((s) => s.future.length > 0);` replace the
array subscriptions at `editor-view.tsx:956-957`; the buttons' disabled
props read the booleans. The shell re-renders only on the
empty↔non-empty flip, not on every committed mutation.

### S62-C — the soft-leave flush + the stale-saving normalization (A-M1 + A-L2 + I4)

Two edits in `editor-view.tsx`. (1) The autosave effect's cleanup fires
the captured-current-state PUT BEFORE `disposed = true` — a direct
fire-and-forget full-replace (a regular fetch survives unmount: the
document persists through App Router soft navigation; no `keepalive`
and no body cap — those exist for real teardown only). The Untitled
skip mirrors S61-I (the creation POST's adoption contract is out of
leave scope). The machine's own `flush()` is NOT used (its response
handling is disposed-gated — the stuck-"saving" trap). (2) The load
effect's adoption-guard skip branch normalizes: `if
(useEditorStore.getState().saveState !== "saved")
useEditorStore.getState().setUnsaved()` — a stale "saving" (a disposed
flush's terminal state) arms the S56-B retry; an already-"unsaved"
re-entry re-arms the timer (Zustand notifies on every `set()` — the
subscriber fires). The F48 in-flight case is safe: the normalization's
`setUnsaved` arms the 800ms timer, the in-flight response's
`markSaved` converges to "saved", and the timer's flush early-returns
on "saved" — no spurious PUT.

### S62-D — the XFF last-hop keying (B-M1)

`clientIpOf` parses the LAST `x-forwarded-for` entry — the
proxy-appended real IP (a single-value header, the e2e/smoke form, is
both first and last — unaffected). The comment documents the trust
model. The unit pin at `src/lib/rate-limit.test.ts:51-53` updates to
the new contract (a legitimate contract change: the pre-fix pin
encoded the spoofable behavior).

### S62-E — the atomic verify-otp counter (B-M2)

`db.user.updateMany({ where: { id: user.id, verifyAttempts: { lt:
MAX_VERIFY_ATTEMPTS } }, data: { verifyAttempts: { increment: 1 } } })`
replaces the read-modify-write; `result.count === 0` → the exhausted
429 (the ceiling is now atomic under concurrency). The sequential
behavior (what every e2e pin covers) is unchanged.

### S62-F — the editor Low batch (A-L1 + A-L3 + A-L4 + A-L5)

The keepalive guard measures bytes: `if (new Blob([payload]).size >
60_000) return;` (the unit pin re-anchors on the Blob form). The two
canvas cap toasts interpolate `ELEMENT_LIMIT` (imported — no literal).
The AI apply seam annotates the reply when `applied <
operations.length` ("…— the board is at its element limit") — the
honest-reply doctrine. The dead `setName` action is deleted from the
store type and implementation (zero references, grep-verified).

### S62-G — the server Low batch (B-L1 + B-L3 + B-L5 + B-L7)

A `generateVerifyCode()` helper in `src/lib/auth.ts` using
`randomInt(100000, 1000000)` from `node:crypto` (the comment becomes
true); the three routes import it. The register route caps `name` ≤
80, `email` ≤ 200, `password` ≤ 200 (400 VALIDATION on overflow). The
duplicate route clamps the copy name to 120 and wraps `create` +
`createMany` in one `db.$transaction`. The elements PUT's transaction
catches `PrismaClientKnownRequestError` (P2025/P2003) → `fail(
"NOT_FOUND", "Project not found", 404)` — the envelope discipline; the
projects/[id] PATCH and teams/[id] PATCH routes gain the same guard.

## Planned counts

Unit: +21 pins across seven new spec files
(`tests/slider-gesture.test.ts` 5, `tests/undo-selectors.test.ts` 2,
`tests/soft-leave-flush.test.ts` 4, `tests/verify-atomic.test.ts` 2,
`tests/editor-low-s62.test.ts` 4, `tests/server-low-s62.test.ts` 4)
plus the XFF contract update inside `src/lib/rate-limit.test.ts` →
**337 = 316 + 21**. E2E: +2 pins in a new
`tests/e2e/session62-fixes.spec.ts` (the slider one-undo-restores-
pre-drag contract — RED pre-fix at per-tick granularity; the REAL
`goBack()` soft-leave flush — RED pre-fix with the edit lost) →
**215 = 213 + 2**.

## RED expectations

Unit RED: the gesture handler bundle absent from `SliderRow` and the
gradient slider; the `update` helper's default commit not
gesture-aware; the TextSection focus/blur seam absent; the array
subscriptions still present at the shell; the cleanup without the
pre-dispose PUT; the adoption-guard skip branch without the
normalization; `clientIpOf` still first-hop; the verify-otp counter
still read-modify-write; the keepalive guard still `.length`; the
canvas toasts still literal "2000"; the reply annotation absent;
`setName` still present; `Math.random` still in the three routes; the
register caps absent; the duplicate route still non-transactional; the
P2025 catch absent. E2E RED against the pre-fix standalone build: the
opacity drag + ONE Ctrl+Z leaving the value at a per-tick intermediate
(not 100); the goBack leaving the in-window edit unpersisted.

## Execution order

S62-A → S62-B → S62-C → S62-D → S62-E → S62-F → S62-G (the editor
Mediums first, then the server Mediums, then the two Low batches) →
unit GREEN → build → e2e RED (pre-fix standalone) → e2e GREEN → smoke
→ full gate → live verification + screenshots → docs → commit + push.

## Execution status

- [x] S62-A — the slider/text gesture seam (+ the en-route isTypingTarget range carve-out)
- [x] S62-B — the shell's boolean undo selectors
- [x] S62-C — the soft-leave flush + the stale-saving normalization
- [x] S62-D — the XFF last-hop keying
- [x] S62-E — the atomic verify-otp counter
- [x] S62-F — the editor Low batch
- [x] S62-G — the server Low batch
- [x] Full gate green — zero regressions (lint · typecheck · 343 unit = 316 + 27 / 63 files · build 23 routes · 56 smoke · 215 e2e = 213 + 2)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the S62 build after the editor-shell changes; the standard 32 re-captured + the ref-audit-s72 evidence set — clone-09 the slider one-undo evidence and clone-10 the soft-leave persistence evidence, both captured BY the e2e pins at the verified-assertion moment, the honest-moment discipline — dimension-checked 114/114; VLM content-verified 17/17; the DB re-seeded to the pristine contract after every mutating phase)

## Execution notes (the realized counts + the en-route work)

Unit: +27 pins across SIX new spec files (slider-gesture 7, undo-selectors 2,
soft-leave-flush 4, verify-atomic 4, editor-low-s62 4, server-low-s62 5)
plus the XFF contract update inside `src/lib/rate-limit.test.ts` (+1 net) →
**343 = 316 + 27** (the plan estimated 337 = 316 + 21 — the realized set
carries the en-route pins below). Three existing pins' legitimate contract
updates: the XFF last-hop pin (the pre-fix pin encoded the spoofable
first-hop behavior), the theme slider-window widening 400→600 (the gesture
handlers sit between `type` and `className` on every range input), and the
unload-flush Blob-form re-anchor (A-L1's byte guard).

E2E: +2 pins in `tests/e2e/session62-fixes.spec.ts` → **215 = 213 + 2**,
both honestly RED against the pre-fix standalone build at exactly the
defect assertions (one Ctrl+Z leaving the opacity at a per-tick
intermediate — received 6, expected 100; the goBack leaving the in-window
edit unpersisted — received 0, expected 1).

**The en-route work (three finds):**

1. **The isTypingTarget range carve-out.** Proving the slider e2e pin
   surfaced that the blanket `input` exemption in the editor's shortcut
   stand-down left Ctrl+Z dead with focus resting on the slider: 20 undo
   presses, zero movement — the drag's own history entry existed but was
   unreachable from the keyboard. A range input accepts no text; the
   carve-out (`type !== "range"`) lets the shortcuts through while text
   inputs keep the exemption. Carried by the slider-gesture unit pin.

2. **The idle-coalesced Content input.** The first implementation keyed
   the text gesture on focus/blur — the mobile-properties e2e pins caught
   it: `fill()` and the mobile Sheet hold focus indefinitely, so the open
   gesture kept the machine's gesture-deferral looping (PUT → setUnsaved
   → re-arm) and the Saved badge never converged. The delivered form
   re-arms a 150ms idle timer per keystroke (one history entry per typing
   burst; begin-on-demand starts a fresh gesture for a >150ms-separated
   burst). Documented as lesson F49(1).

3. **The honest-moment evidence discipline.** The capture script's
   external re-drive of the slider drag fought the input pipeline twice
   (agent-browser's `drag` is DnD-based — it does not move a range input;
   the synthetic-event sequence left the trailing native `change` outside
   the gesture window). The delivered form: the e2e pins capture their
   OWN `page.screenshot()` at the verified-assertion moment — the
   behavioral fixes' evidence belongs to the behavioral pins (they
   already own the working input pipeline). Documented as lesson F49(4).
