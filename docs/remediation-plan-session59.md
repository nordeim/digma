# Remediation Plan — Session 59 (the Thirty-Fifth Audit)

**Date:** 2026-10-02 · **Trigger:** the operator's session-75/76 directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and the Tailwind v4 bug class, use the scandihaven tech-stack patterns, TDD, vitest + playwright, `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, screenshots under `docs/screenshots/`, a verified `.env.example`, aligned docs, push via the SSH wrapper to `main` only) · **Code state at start:** `194e60a` (session 58 delivered at `d5b4384` + the operator's session-76 log push)

## The audit method

The lead's hunk-by-hunk review of the session-58 delivery (all six S58 seams
verified intact in source — the grid-rename DTO adoption, the ellipsis
click+keydown pairing, `safeFromUrl` + the Editor bounce's projectId, the
search compare-and-adjust, the PresentOverlay text contract, the five Low
fixes), then the SEVENTH Mode C audit: two independent fresh-eyes full-file
reviews by separate agents over the least-recently-reviewed surfaces —
auditor A over `canvas.tsx` + `properties-panel.tsx` (the two big editor
interaction files, last independently reviewed sessions 53/56), auditor B
over `editor-store.ts` + `ai-assistant.tsx` + `layers-panel.tsx` +
`toolbar.tsx` + `components-panel.tsx` + `src/lib/editor.ts` +
`src/lib/ai-assistant.ts` — against the `skills/code-review-checklist`
dimensions with the AGENTS documented contracts loaded first. Every chosen
finding individually re-verified by the lead in source (B-L-1 and B-L-3
additionally re-verified by live module probes).

## Reference findings (35th audit — no drift, no new gaps)

The standing datums re-verified on `https://digma-371dfd0d.base44.app/`
(agent-browser, desktop 1440×900 + mobile 390×844): the desktop nav
124/96/92 × 36 with the 36px unlabeled bell; the greeting "Good morning,
sepnetflix2023 ✨" (the name populated, the morning bucket); Quick Stats
1/0/1/Pro; the Recent sort `last_accessed` (displayed "Last Opened") /
"1 file found"; the board at 9 layers — still "Test Project One"; zero kbd
affordances (35th datum); the Create-Team dead chrome the 35th (2 clicks, 0
dialogs over the empty Teams state); R3 mobile nav failure class A the 35th
(nav `display:none`, all three links 0×0, no hamburger, only the dead
unlabeled 36px bell; evidence `ref-audit-s69/ref-01`); the mobile editor
header clipping Share/Present at 390 re-measured exactly (Share L385–R458,
Present L466–R551; evidence `ref-audit-s69/ref-02`). Evidence set:
`docs/screenshots/ref-audit-s69/` (ref-00 desktop dashboard, ref-01 mobile
dashboard 390, ref-02 mobile editor 390, ref-03 desktop Recent).

The clone's mobile navigation verified live, end-to-end at 390×844 — the
35th consecutive session, ALL GREEN via the single-call verifier (8/8: the
44×44 hamburger with the aria contract at [16,10], the Sheet dialog with
44px links + aria-describedby, the scroll lock, the focus trap, Escape with
focus return + lock release, navigate-and-dismiss, the md-crossing close,
the 768 boundary; the Tailwind v4 failure class A NOT present).

## The code audit findings (Mode C — seventh pass)

The session-58 delivery itself is clean (all six seams verified to hold;
the 253/56/201 gate re-proven green at baseline before any change). The two
fresh-eyes passes found **0 High / 1 Medium / 8 Low / 11 Informational**
combined — every chosen finding individually re-verified by the lead in
source:

- **B-M-1: the layer row's Enter/Space handler hijacks its own nested
  controls.** `layers-panel.tsx:147-153` — the row div's `onKeyDown`
  unconditionally `preventDefault()`s Enter/Space for ANY event bubbling
  from inside it, and its descendants include the rename input (`:157-183`,
  whose own handler never stops propagation) and the eye/lock/trash buttons
  (`:189-253`). Consequence (a): a Space typed in the rename input is
  canceled before character insertion — multi-word layer names are
  impossible to type by keyboard (the e2e rename pin uses Playwright's
  `fill()`, which sets the value without per-key keydowns, so the pin masks
  the defect). Consequence (b): Enter's and Space's native button
  activations are canceled by the bubbled `preventDefault`, so the
  eye/lock/trash buttons — made visually keyboard-reachable by S57-F's
  `focus:opacity-100` — are keyboard-inoperable; both keys merely
  re-select the row. This is the behavioral half of the deferred
  invalid-ARIA-nesting item; the Space half is a regression introduced by
  S57-F's own L-3 fix.
- **A-L-1: the shared pointer handlers double-dispatch during handle
  drags.** `canvas.tsx:458-459` — the resize handles carry
  `onPointerMove={onPointerMove}`/`onPointerUp={onPointerUp}` AND the same
  handlers sit on the container (`:370-373`); only the handle's
  pointerDown calls `stopPropagation()` (`:444`). With pointer capture on
  the handle, every pointermove/up runs twice (handle + bubbled container).
  Benign today (the resize branch is idempotent; `endGesture` no-ops the
  second call) but it doubles store dispatch per resize tick and is a
  latent trap for future non-idempotent drag logic.
- **A-L-2: `spaceDown` sticks after a window blur mid-hold.**
  `canvas.tsx:332-352` — the space-to-pan effect registers only
  keydown/keyup on window; if the window loses focus while Space is held
  (alt-tab, OS dialog) the keyup never arrives, `spaceDown` stays `true`,
  and the canvas silently locks into pan mode (left-clicks pan instead of
  selecting, cursor "grab") until the user taps Space again. No `blur`
  reset exists.
- **A-L-3: the multi-selection Fill row silently drops the clear (null)
  commit.** `properties-panel.tsx:1012-1015` —
  `onChange={(fill) => fill && update({ fill })}` discards `onChange(null)`
  (the hex field's emptied state), while the sibling Stroke row commits
  null (`:1017`) and the single-selection Solid tab also commits null.
  Clearing a multi-selection fill is a silent no-op — the field shows the
  "transparent" placeholder, then visibly snaps back on the next resync.
- **B-L-1: `colorFor` matches color words as substrings.**
  `src/lib/ai-assistant.ts:81-88` — plain `includes(word)` with no `\b`
  boundary (the SHAPES matcher two branches down DOES use `\b${word}\b`).
  Since `red` is the first COLORS key, any message containing "colored",
  "bordered", "squared", or "hundred" resolves to `#EF4444`; the panel's
  first advertised suggestion — "Add 3 colored circles" — deterministically
  creates three RED circles (live-probed this session:
  `fill:"#EF4444"`). No test pins the color.
- **B-L-2: the sanitizer's inline hex regex is laxer than the shared
  `clampColor` seam.** `src/lib/ai-assistant.ts:267, :284` — both fill
  checks use `/^#[0-9a-fA-F]{3,6}$/`, which accepts 4- and 5-digit hex
  (`#12345` passes but is invalid CSS), while the codebase's one hex
  validator (`validation.ts` `HEX_COLOR` — used by `clampColor` and by
  `parseGradient` in the same editor domain) rejects them. Net behavior: a
  sanitized LLM op applies an invalid fill locally (the browser drops it),
  then the elements PUT's `clampColor` rewrites it to the `#3B82F6`
  fallback — the op's claimed color silently becomes blue after save.
- **B-L-3: the AI add-branch's explicit-undefined keys overwrite
  `defaultElementFor`'s type defaults.** `ai-assistant.tsx:69-81` +
  `editor-store.ts:219-226` — the partial is built with always-present
  keys (`fill: operation.element.fill ?? undefined`, `text: … ?? undefined`,
  `fontSize: … ?? undefined`) and `addElements` spreads `...partial` AFTER
  `...draft`. A spread key with value `undefined` overwrites (live-probed:
  `merged.text = undefined`): an LLM `{"op":"add","element":{"type":"text",…}}`
  without text produces `text: undefined`, losing the measured fresh-text
  contract "Type here..." — the element renders invisible — and
  `fill: undefined` overwrites the text default `#FFFFFF` in memory. Only
  the LLM source hits this (the fallback always supplies fill/text).
- **B-L-4: no timeout/AbortController on the AI fetch — a hung call wedges
  the panel.** `ai-assistant.tsx:170-179` — the route's `maxDuration = 60`
  is a serverless-platform hint the self-hosted standalone server doesn't
  enforce, and a hung SDK call never rejects (the `catch` never fires).
  `sending` stays `true` forever — "Working on it…" persists and every
  subsequent submit is dead-early-returned by the `sending` guard until
  reload. Every other seam in the AI doctrine has a degrade path; this one
  has none for a hang.
- **B-L-5 (deferred): AI batch adds push one history snapshot per
  element.** One user instruction = N undo steps while the message's
  Revert button is atomic — the same granularity family as the standing
  M-5 coalescing backlog (documented disposition; not a data-loss class).
- **Deferred (with rationale):** B-L-5 (folds into the M-5 undo-coalescing
  backlog — a deliberate granularity design change); I-1 (the gradient
  stop `key={index}` — no state bleed found in practice, the guarded input
  resyncs); I-2 (the line-width min-clamp asymmetry — visual impact nil,
  the SVG render clamps its viewBox); I-3 (the panel's missing client-side
  caps — the server clamps and `markSaved` adopts; the S56-E
  snap-back-visible family, needs a UX decision on clamp-vs-reject);
  I-4 (the stale CanvasElement doc-comment); I-5 (the pan branch's
  non-primary buttons — reference behavior unmeasured); I-6 (the line Fill
  row — reference behavior unmeasured, flag for the next parity
  measurement); I-7 (undo/redo drops selection across a save boundary —
  cosmetic, selection is transient); I-8 (`reorderElements` identity
  rewrite — one full-canvas re-render per reorder, memo-identity contract
  intact across all other mutations); I-9 (`TOOL_META` lacks a
  completeness pin — the F35e residual, icon edition); I-10 (the update
  patch's dead `x`/`y` fields); I-11 (the type-unsafe casts at the
  LLM→store seam).

### Verified clean (explicitly re-checked)

The pointer WALL at all five enforcement sites; the hit-test inverse
mapping (`elementIsPointInside` — unit-pinned); the gesture lifecycle
(S56-A/S57-A — `beginGesture` at both starts, `endGesture` iff moved,
`onPointerCancel`, the `buttons === 0` ghost guard, `loadProject`'s
reset); the zoom clamps [0.1, 5] through every path; the
GuardedNumberInput/NumberField empty-draft guards with their domain
clamps; the type-conditional section layout; the shared-section exports
consumed by both desktop and the mobile sheets; zero `useEffect` in the
properties panel (all resync via render-time compare-and-adjust); the
60-snapshot history bound at all twelve push sites; the locked-element
wall at all three delete seams (keyboard filter / row trash parity / the
AI client filter with `lockedTargetIds`); the full-list replace contract
(no in-place mutation anywhere in the store); the TOOL_SHORTCUTS single
seam (unit-pinned); the honest operation counting (the did-flag); the AI
degrade path + XSS posture (React-escaped text, the sanitizer's numeric
clamps, ops cap 50, strings cap 500); the revert semantics (S27-2 —
fresh post-await snapshot, undoable restore); Zustand v5 correctness
(Object.is bail, fine-grained selectors, the AI panel's zero
subscriptions); `markSaved`'s id remap + selection filter; the layers DnD
drop-time index math; the Select All/Deselect visible-aware flip; the
suggestions line rendering unconditionally (RA-33).

## The chosen session work (TDD)

### S59-A — the layers-row keyboard exemption (B-M-1)

The row's `onKeyDown` gains the nested-control guard FIRST — events whose
`target` resolves inside a `button` or `input` (the rename field, the
eye/lock/trash trio) return untouched: Space types into the rename input,
Enter/Space activate the focused action button natively, and the row's own
activation contract (Enter/Space on the row proper) is preserved. The
guard mirrors the S58-B pairing convention (`closest("button, input")` —
the interactive family, the `isSpaceActivationTarget` doctrine's DOM
shape).

### S59-B — the colorFor word boundary (B-L-1)

`colorFor`'s loop becomes `new RegExp(`\\b${word}\\b`).test(lowered)` —
the SHAPES convention two branches below (line 197), on the color map.
"Add 3 colored circles" now resolves to NO color → the `?? "#3B82F6"`
default (the honest deterministic answer); "Add 3 red circles" keeps
`#EF4444`. The reply strings are untouched (the pinned contracts).

### S59-C — the sanitizer hex seam (B-L-2)

Both inline regexes (`:267`, `:284`) tighten from `{3,6}` to the shared
`HEX_COLOR` contract — exactly 3 or 6 hex digits. The fix imports the
doctrine: a 4- or 5-digit LLM hex now falls to `null` (the add branch) /
is omitted (the update patch) — the deterministic degrade instead of the
silent post-save blue rewrite.

### S59-D — the add-branch undefined-key omission (B-L-3)

The add partial in `applyOperations` includes a key ONLY when its value is
defined: `fill`/`text`/`fontSize` when not null, `radius` when nonzero.
`defaultElementFor`'s type defaults then survive the spread (the
"Type here..." text contract, the `#FFFFFF` text fill) and the
data-impurity variant (`fontSize: 16` persisted on non-text adds)
disappears.

### S59-E — the multi-selection fill clear (A-L-3)

The Fill row's onChange loses the truthiness guard —
`onChange={(fill) => update({ fill })}` — matching the sibling Stroke row
exactly. Clearing the hex field commits `fill: null` (the transparent
state) instead of silently snapping back.

### S59-F — the spaceDown blur reset (A-L-2)

The space-to-pan effect registers a `blur` listener on window that resets
`setSpaceDown(false)` — the keyup that never arrives (alt-tab mid-hold)
can no longer lock the canvas into pan mode. The listener joins the
existing teardown.

### S59-G — the handle move/up stopPropagation (A-L-1)

The resize handles' `onPointerMove`/`onPointerUp` wrappers call
`stopPropagation()` — mirroring the handle's own pointerDown seam
(`:444`). Each pointer event dispatches ONE handler (the handle's) during
a resize drag; the container's bubbling copy is suppressed. The resize
branch stays idempotent either way (the fix is the latent-trap closure).

### S59-H — the AI fetch abort timeout (B-L-4)

The fetch gains `signal: AbortSignal.timeout(30_000)` — a hung SDK call
rejects at 30s, the existing `catch` degrades to the "Assistant
unavailable" toast family, and `sending` returns to `false` (the panel
never wedges). 30s sits above the route's own LLM timeout budget and
below any reasonable human patience for a chat reply.

## Planned counts

Unit: +16 pins across four new spec files (`tests/layers-keyboard.test.ts`
3, `tests/ai-seams-s59.test.ts` 8, `tests/canvas-blur.test.ts` 3,
`tests/multi-select-fill.test.ts` 2) → **269 = 253 + 16**. E2E: +3 pins in
a new `tests/e2e/session59-fixes.spec.ts` (the rename-input Space typing,
the multi-selection fill clear, the eye-button Space activation) →
**204 = 201 + 3**.

## RED expectations

Unit RED: the layers-row guard absent (the source pin fails), the
colorFor substring probe ("colored" → red) fails at the boundary
assertion, the `{3,6}` regexes still present, the undefined-key spread
present, the truthiness guard present, the blur listener absent, the bare
handle handlers present, the AbortSignal absent. E2E RED against the
pre-fix standalone build: the rename input rejects a Space character
(value stays single-word), the multi-selection fill clear snaps back
(getComputedStyle fill ≠ transparent), the eye button does not toggle on
Space (the layer's aria-hidden stays false).

## Execution order

S59-A → S59-B → S59-C → S59-D → S59-E → S59-F → S59-G → S59-H (the
Medium first, then the pure-seam Lows, then the panel Lows, then the
canvas Lows, then the fetch seam) → unit GREEN → build → e2e RED → e2e
GREEN → smoke → full gate → live verification + screenshots → docs →
commit + push.

## Execution status

- [x] S59-A — the layers-row keyboard exemption (unit +3: the guard-before-activation source pin, the early-return shape, the row's own activation preservation)
- [x] S59-B — the colorFor word boundary (unit +3: the source pin + "colored"→default behavioral + "red"→#EF4444 preservation)
- [x] S59-C — the sanitizer hex seam (unit +3: the no-{3,6} source pin + the 4-digit→null behavioral + the 6-digit survival preservation)
- [x] S59-D — the add-branch undefined-key omission (unit +1: the no-??-undefined source pin + the conditional partial)
- [x] S59-E — the multi-selection fill clear (unit +2: the no-truthiness-guard pin + the Stroke sibling preservation; e2e the transparent-state commit)
- [x] S59-F — the spaceDown blur reset (unit +2: the blur listener + the reset/teardown)
- [x] S59-G — the handle move/up stopPropagation (unit +1: the wrapped handlers pin)
- [x] S59-H — the AI fetch abort timeout (unit +1: the AbortSignal.timeout(30_000) pin)
- [x] Full gate green — zero regressions (lint · typecheck · 269 unit · build 23 routes · 56 smoke · 204 e2e = 201 + 3)
- [x] Live verification + screenshots + docs + push (the mobile nav 8/8 the 35th on the S59 build; the clone-08 colored-circles default-blue evidence with the inlined color check; 72/72 dimension-checked; 15/15 VLM PASS; the DB re-seeded to the pristine contract after every mutating phase)
