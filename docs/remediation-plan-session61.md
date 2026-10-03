# Remediation Plan — Session 61 (the Thirty-Seventh Audit)

**Date:** 2026-10-03 · **Trigger:** the operator's session-81 directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the scandihaven tech-stack patterns as reference, TDD, the standing vitest + playwright gates, `DATABASE_URL="file:../db/custom.db"` with `db/` at the repo root, the screenshots under `docs/screenshots/`, a verified `.env.example`, aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's hunk-by-hunk review of the session-60 delivery (all eight S60
seams verified intact in source — the autosave background-color
mid-flight guard at `editor-view.tsx:219`, the tool-shortcut modifier
bail at `:382`, the Create-Team email validation at
`teams/route.ts:42`, the elements POST cap at `elements/route.ts:75`,
the zero-op LLM passthrough at `ai-assistant.ts:321`, the
`[&>button]:h-11` close-X on all three Sheets, the Share clipboard
branch at `editor-view.tsx:973`, and the exported
`MultiSelectionSection`), then the NINTH Mode C audit: two independent
fresh-eyes full-file reviews by separate agents over the
least-recently-reviewed surfaces — auditor A over the editor
sub-components (`layers-panel.tsx`, `toolbar.tsx`,
`components-panel.tsx`, `ai-assistant.tsx`, `canvas.tsx`, a fresh pass
over `editor-store.ts`), auditor B over the non-editor surfaces
(`app-header.tsx` MobileNav fresh pass, the dashboard/recent/teams
views, `project-card.tsx`, both auth screens, the vendored `ui/*`
primitives, `globals.css` `@theme`, `layout.tsx`/`page.tsx`/`proxy.ts`,
`use-toast.ts`) — against the `skills/code-review-checklist` dimensions
with the AGENTS/CLAUDE documented contracts loaded first. Every chosen
finding individually re-verified by the lead in source before this
plan. The baseline gate re-proven green BEFORE any change (288 unit /
56 smoke / 207 e2e / build 23 routes), the DB re-seeded to the pristine
1/2/6/1 contract.

## Reference findings (37th audit — no drift, no new gaps)

The standing datums re-verified on
`https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 +
mobile 390×844): the desktop nav 124/96/92 × 36; the greeting "Good
evening, sepnetflix2023 ✨" (the name populated, the evening bucket —
the session ran after 17:00); Quick Stats 1/0/1/Pro; the Recent sort
`last_accessed` (displayed "Last Opened") / "1 file found"; zero kbd
affordances; the Create-Team dead chrome the 37th (2 clicks, 0 dialogs
over the empty Teams state — buttons "Create Team" / "Create Your First
Team" both present, zero dialogs after each click); R3 mobile nav
failure class A the 37th (nav `display:none`, all three links 0×0, no
hamburger; evidence `ref-audit-s71/ref-01`); the mobile editor header
clipping Share/Present at 390 (Share L385–R458, Present L466–R551 —
both fully offscreen; evidence `ref-audit-s71/ref-02`); the board at 9
layers — Frame 1, Text 8, Circle 7, Line 6, Line 5, Rectangle 4,
Rectangle 3, Rectangle 2, Rectangle 1. Evidence set:
`docs/screenshots/ref-audit-s71/` (ref-00 desktop dashboard, ref-01
mobile dashboard 390, ref-02 mobile editor 390, ref-03 desktop Recent).

The clone's mobile navigation verified live, end-to-end at 390×844 —
the 38th consecutive session, ALL GREEN via the single-call verifier
(9/9: the 44×44 hamburger with the aria contract at [16,10], the Sheet
dialog with 44px links + aria-describedby, the scroll lock, the focus
trap, Escape with focus return + lock release, navigate-and-dismiss,
the md-crossing close, the 768 boundary, the class-A guard; the
Tailwind v4 failure class A NOT present).

## The code audit findings (Mode C — ninth pass)

The session-60 delivery itself is clean (all eight seams verified to
hold; the 288/56/207 gate re-proven green at baseline before any
change). The two fresh-eyes passes found **0 Critical / 0 High / 2
Medium / 10 Low / 10 Informational** combined — every chosen finding
individually re-verified by the lead in source:

- **M-1 (Medium): the destructive token pair fails WCAG AA contrast.**
  `globals.css:29-30` — `--color-destructive: #ef4444` with
  `--color-destructive-foreground: #ffffff` computes to **3.76:1**,
  below the 4.5:1 AA minimum for normal-size text. Every "Yes, Delete"
  confirm (project delete, team delete — the inline confirm dialogs at
  `project-card.tsx`, `recent-view.tsx`, `teams-view.tsx`) and every
  destructive toast description renders sub-AA. Fix under the a11y
  working-superset doctrine (the MobileNav family): `#dc2626` (red-600,
  **4.83:1**, already a pinned `@theme` token — no palette drift). No
  e2e pin touches the destructive background (the
  `rgb(239, 68, 68)` pin at `mobile-properties.spec.ts:219` is ELEMENT
  FILL data typed into the hex input, not the token).
- **M-2 (Medium): the gray-400 micro-labels fail AA at 12px.**
  `text-gray-400` (`#9ca3af` on white = **2.54:1**) at three sites —
  the project-card opened-date row (`project-card.tsx:432`), the
  MobileNav drawer footer (`app-header.tsx:121`), the Dashboard
  list-row dates (`dashboard-view.tsx:343`). Fix: `text-gray-500`
  (`#6b7280`, **4.83:1**) — the codebase is already internally
  inconsistent (the "Pro Plan" label and Recent's "Opened" use
  gray-500). The parity-pinned gray-400 sites (the editor avatar
  counter at `parity.spec.ts:495/543`, the Teams member counter) are
  NOT touched.
- **A-L-1 (Low): double-clicking an eye/lock row action enters rename
  mode.** `layers-panel.tsx:133-136` — the row's `onDoubleClick` fires
  rename activation; the nested eye/lock buttons stop propagation on
  click ONLY, so a rapid double-toggle (a natural gesture) silently
  steals focus into the rename input. Fix: the S59-A nested-control
  guard pattern in the dblclick handler.
- **A-L-2 (Low): `loadProject` never resets zoom/pan/tool.**
  `editor-store.ts:144-161` — the store is a module singleton surviving
  App Router soft navigation; project B opens with project A's viewport
  and armed tool (a left-armed Line tool draws on first click). Fix:
  the load boundary resets `zoom: 1, panX: 0, panY: 0, tool: "select"`.
- **A-L-3 (Low): `applyOperations` validates ids against a stale store
  snapshot within one AI batch.** `ai-assistant.tsx:66` — the single
  `useEditorStore.getState()` capture is read for id-membership after
  earlier operations in the same batch mutated the live store; a
  duplicate-id LLM reply pushes junk undo entries, spurious unsaved
  PUTs, and an inflated `applied` count. Fix: re-read live state per
  operation.
- **A-L-4 (Low): "Select All" is a dead lying control when every layer
  is hidden.** `layers-panel.tsx:62-80` — with elements present and all
  hidden, the label reads "Select All" but the click selects
  visible-only = nothing. Fix: disable the control in that state (the
  0-element "Deselect All" quirk is deliberately preserved — pinned).
- **A-L-5 (Low): the client add paths remain uncapped at the
  2000-element ceiling — the residual half of S60-D.**
  `editor-store.ts:206-237` (`addElements` has no cap) — crossing 2000
  client-side (patient drawing or repeated AI batch-adds) wedges every
  subsequent autosave PUT in a 400-retry loop. Fix: the store clamps at
  the shared `ELEMENT_LIMIT` seam with an honest return; the AI
  `applied` count and the canvas call sites answer the cap.
- **B-L-1 (Low): the Dashboard carries ~64px of phantom scroll.**
  `dashboard-view.tsx:95-96` — the inner `min-h-screen` div defeats
  the outer `min-h-[calc(100vh-4rem)]` main, so the page is always
  ≥104vh. Fix: the gradient moves to the main element; the inner div
  loses `min-h-screen`.
- **B-L-2 (Low): the bell trigger is a 36px target with incomplete
  dialog semantics.** `app-header.tsx:240-258` — `p-2` + `h-5` icon =
  36px, below the project's own 44px convention for header controls on
  mobile (the bell is the ONLY header control beside the 44px hamburger
  at 390); the popover carries `role="dialog"` but the trigger lacks
  `aria-haspopup="dialog"`. Fix: `h-11 w-11 flex items-center justify-center`
  + `aria-haspopup="dialog"` (the bell popover's Escape/close behavior
  is pinned at `workspace.spec.ts:94` — the role queries are
  unchanged).
- **B-L-4 (Low): "View all" is a plain `<a>` — a full document reload.**
  `dashboard-view.tsx:183-189` — every other internal link uses
  `next/link`. Fix: `Link`.
- **B-L-5 (Low): card open is blocked on the lastOpened PATCH
  round-trip.** `project-card.tsx:316-324` and `recent-view.tsx:109-117`
  — `openProject()` awaits the PATCH before `router.push`; on a slow
  network the click appears dead. Fix: navigate first, PATCH
  fire-and-forget (the failure path already degrades to navigate).
- **A-3 (deferred from session-60, now designed): no flush on refresh /
  tab close / browser Back.** The machine flushes only via the 800ms
  timer and `exit()`; no `pagehide`/`sendBeacon`/`keepalive` anywhere
  in `src` (grep-verified again this session). Edits inside the
  debounce window are lost on F5/tab close. Design now decided: a
  `pagehide` keepalive flush over the captured-body contract, with the
  honest 64KB keepalive body limit guarded (boards whose full-list body
  exceeds it are skipped — the PUT sends the FULL element list, so the
  guard is load-bearing), Untitled-mode skipped (the creation POST's
  adoption contract is out of unload scope), and the listener cleaned
  up on unmount.
- **A-6 (deferred — decision recorded): a transient load failure (5xx)
  on a valid projectId lands in Untitled; the next autosave duplicates
  the project.** For a 404 that is ADR-009 parity. The honest fix needs
  a retry/error editor state — a new UI surface, deliberately deferred
  again this cycle (the session already carries nine slices).
- **Informational (documented, not scheduled):** the canvas move/pan
  deltas accumulate through React state (a ref would be immune to
  render jank — latent, not observed); the plain-wheel pan ignores
  `deltaMode` (Firefox line-mode feels sluggish); no `touch-action:
  none` on the canvas container (touch drags can be stolen by
  overscroll); the shift+marquee preserve-then-replace incoherence; the
  double selection chrome on `CanvasElement`; the hamburger's inert
  sr-only span; the X/Menu icon swap that can never be seen; the 24px
  Toaster dismiss X (meets WCAG 2.5.8, below the 44px convention — a
  secondary affordance); the missing `autoComplete` hints on auth
  inputs; the header sharing z-50 with the portal layer.

### Verified clean (explicitly re-checked)

The complete MobileNav contract (fresh pass — the md-crossing listener
guarded and cleaned up, setState only in the callback, no
pathname-watching effect); the desktop nav's exact-pathname pill; the
Tailwind v4 `@theme` discipline (no `tailwind.config.js`, literal hexes
only, the v3-pinned palette, the literal `--font-sans`); the toast infra
(`globalThis.__digmaToastInfra` + `useSyncExternalStore`); the auth
card's five states with `router.push(fromUrl)` + `refresh()`; the
`safeFromUrl` guard; `proxy.ts`'s exact-match 307s; the store's
60-snapshot caps, gesture seam, locked walls, and markSaved remap; the
canvas hit test, memo discrimination, and listener cleanups; the
layers-row S59-A keyboard exemption; the AI route's sanitize caps and
the locked wall at the client apply seam; the S58-B ellipsis pairing
(the list variant's click-only stop is verified NOT a defect — no
keydown handler on that root); zero set-state-in-effect bodies; no
`window.location` auth redirects; no XSS surfaces.

## The chosen session work (TDD)

### S61-A — the destructive-token AA contrast (M-1)

`globals.css` `@theme`: `--color-destructive: #dc2626` (red-600, 4.83:1
with the white foreground — AA-passing). The reference-palette pin
block already carries red-600 for the editor's status colors, so no
new token enters the theme. Every destructive button/toast repaints
through the single token.

### S61-B — the gray-400 micro-label contrast (M-2)

The three sub-AA `text-gray-400` micro-labels flip to `text-gray-500`:
the project-card opened-date row (`project-card.tsx:432`), the
MobileNav drawer footer (`app-header.tsx:121`), the Dashboard list-row
dates (`dashboard-view.tsx:343`). The parity-pinned gray-400 sites (the
editor avatar counter, the Teams member counter) are untouched —
preservation pins guard them.

### S61-C — the loadProject viewport/tool reset (A-L-2)

`loadProject`'s reset object gains `zoom: 1, panX: 0, panY: 0, tool:
"select"` — the documented session boundary (S57-A already treats it
as such for `gestureSnapshot`). A project opened after another now
starts at 100%, centered, with the Select tool armed.

### S61-D — the layers-panel honesty batch (A-L-1 + A-L-4)

The row's `onDoubleClick` gains the S59-A nested-control guard
(`closest("button, input")` → return) — a double-toggle on eye/lock no
longer steals focus into rename. The Select All control disables when
`elements.length > 0 && visible.length === 0` (the honest dead-state
label stays "Select All", the 0-element "Deselect All" quirk is
untouched — pinned) with `disabled:cursor-not-allowed
disabled:opacity-50` styling.

### S61-E — the AI apply live-state re-read (A-L-3)

`applyOperations` re-reads `useEditorStore.getState()` inside each
update/delete branch for the id-membership and locked filters — a
multi-op batch that removes-then-references an id no longer passes the
stale membership check, pushes no junk undo entry, and reports no
inflated `applied` count.

### S61-F — the client-side element cap (A-L-5)

`src/lib/editor.ts` exports `ELEMENT_LIMIT = 2000` (the single seam);
the elements route's three literals import it (one source of truth);
`addElements` clamps — `room = ELEMENT_LIMIT - elements.length`, a
non-positive room returns `[]`, the batch is sliced to the room; the
`addElement` wrapper's return widens to `string | null` (both canvas
call sites already ignore it); the AI add branch counts `applied` only
when ids came back; both canvas draw commit sites (the text tool's
immediate-add and the pointerup draw commit) toast "Element limit
reached" when the add is refused. The server PUT cap remains the
backstop.

### S61-G — the dashboard phantom-scroll fix (B-L-1)

The gradient classes move onto the `main` element
(`min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white
to-purple-50`); the inner div drops `min-h-screen` (it keeps its
structure classes). The page is exactly 100vh with the in-flow 4rem
header — no phantom scroll; the gradient still paints the full
viewport.

### S61-H — the open-navigation batch (B-L-4 + B-L-5 + B-L-2)

"View all" becomes a `next/link` `Link` (a soft navigation — no
document reload, prefetch restored). Both `openProject` variants
(grid + list) drop the `await` — the PATCH fires in flight, the
navigation is immediate. The bell trigger becomes a 44px flex-centered
target carrying `aria-haspopup="dialog"` (the icon stays h-5 w-5; the
popover's role/Escape pins at `workspace.spec.ts:94` are untouched).

### S61-I — the unload keepalive flush (A-3, the deferred data-loss item)

A `pagehide` listener beside the autosave machine (added and cleaned up
with the editor's lifecycle): when `saveState !== "saved"` and a real
`projectId` exists, the listener fires the captured-body PUT with
`keepalive: true` — the browser completes it through the unload. The
honest limits are coded, not hidden: the JSON body is size-guarded
(keepalive bodies are capped at 64KB in Chromium — a board whose
full-list body exceeds ~60KB is skipped, documented); Untitled mode is
skipped (the creation POST's adoption contract is out of unload scope);
an in-flight flush makes the listener a no-op (the machine's own PUT
may complete; the keepalive PUT is an idempotent full-replace either
way).

## Planned counts

Unit: +19 pins across seven new spec files
(`tests/contrast-tokens.test.ts` 4, `tests/load-reset.test.ts` 3,
`tests/layers-honesty.test.ts` 3, `tests/ai-live-state.test.ts` 2,
`tests/elements-client-cap.test.ts` 3, `tests/dashboard-scroll.test.ts`
2, `tests/open-nav.test.ts` 2) → **307 = 288 + 19**. E2E: +6 pins in a
new `tests/e2e/session61-fixes.spec.ts` (the destructive-button
computed color, the cross-project zoom/tool reset, the soft "View all"
navigation, the immediate open + landed PATCH, the cap-refused draw,
the pagehide keepalive flush) → **213 = 207 + 6**.

## RED expectations

Unit RED: the `@theme` destructive value still `#ef4444`; the three
gray-400 sites still present; `loadProject`'s set object missing the
four resets; the dblclick guard absent; the select-all button not
disabled-gated; the per-branch `getState()` re-read absent; the
`ELEMENT_LIMIT` export absent / `addElements` unclamped; the inner div
still `min-h-screen` / the main still gradient-less; the plain `<a
href="/Recent">` still present / the `await` still before
`router.push` / the bell still `p-2` without `aria-haspopup`; the
`pagehide` listener + `keepalive: true` + the size guard absent. E2E
RED against the pre-fix standalone build: the "Yes, Delete" button
computing `rgb(239, 68, 68)`; project B opening at project A's zoom
with the armed tool; the "View all" click tearing down the document; a
card click awaiting the PATCH before the URL change; the element #2001
draw committing; the pagehide dispatch issuing no PUT.

## Execution order

S61-A → S61-B → S61-C → S61-D → S61-E → S61-F → S61-G → S61-H →
S61-I (the two Mediums first, then the store/editor Lows, then the
view Lows, then the deferred data-loss item) → unit GREEN → build →
e2e RED → e2e GREEN → smoke → full gate → live verification +
screenshots → docs → commit + push.

## Execution status

- [x] S61-A — the destructive-token AA contrast
- [x] S61-B — the gray-400 micro-label contrast
- [x] S61-C — the loadProject viewport/tool reset
- [x] S61-D — the layers-panel honesty batch
- [x] S61-E — the AI apply live-state re-read
- [x] S61-F — the client-side element cap
- [x] S61-G — the dashboard phantom-scroll fix
- [x] S61-H — the open-navigation batch
- [x] S61-I — the unload keepalive flush
- [x] Full gate green — zero regressions (lint · typecheck · 316 unit = 288 + 28 · build 23 routes · 56 smoke · 213 e2e = 207 + 6)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the S61 build after the app-header changes; the standard 32 + the ref-audit-s71 evidence set captured — clone-07 the 44px-bell fix evidence {found:true,w:44,h:44,haspopup:dialog}, clone-08 the AA-destructive confirm evidence {dialog:true,bg:rgb(220, 38, 38)} — the F42 inline checks throughout; dimension-checked 101/101; VLM content-verified 15/15; the DB re-seeded to the pristine contract after every mutating phase)

## Execution notes (the realized counts + the en-route root-cause work)

Unit: +28 pins across EIGHT new spec files (contrast-tokens 6, load-reset 3,
layers-honesty 3, ai-live-state 2, elements-client-cap 4, dashboard-scroll
2, open-nav 4, unload-flush 4 — one more file than planned: the unload-flush
spec absorbed the en-route work below) → **316 = 288 + 28** (the plan
estimated 307 = 288 + 19). Two existing pins' legitimate contract updates:
the S60-D elements-cap pins re-anchored on the shared ELEMENT_LIMIT seam
(same checks, same message — one source of truth with the client clamp),
and the S57-F layers-a11y select-all pin re-anchored on the hoisted
component-level visible computation (the flip still reads exactly that
family).

E2E: +6 pins in `tests/e2e/session61-fixes.spec.ts` → **213 = 207 + 6**,
all six honestly RED against the pre-fix standalone build at exactly the
defect assertions (the Yes-Delete computing rgb(239, 68, 68); project B
opening at project A's 144% zoom with the Rectangle tool armed; the
View-all click tearing down the document — the soft-nav marker died; the
card click blocked on the held PATCH; the element #2001 committing —
"2001 layers• 1 selected" in the failure DOM; no PUT within 600ms of the
pagehide dispatch). The cap-refused pin needed the F36c hydration gate
(the "2000 layers" count proves the client-side load completed — a bare
toolbar-visibility gate passes on the SSR HTML before the listeners
attach).

**The en-route root-cause work (the session's deepest find — the
adoption-clobber family):** the first full e2e run after the S61-I
implementation flipped the standing untitled-editor persistence pin —
after a draw in Untitled mode, the created project persisted with ZERO
elements. Instrumented server-side PUT logging (a temporary console.log
in the elements route + booting the standalone server on the e2e port so
Playwright's reuseExistingServer adopts it + a temporary query-param
state dump on the suspect request) captured the smoking gun: `PUT
listLen=1` (the machine's flush) followed 186ms later by `PUT
?dbgEls=0&dbgSave=unsaved listLen=0` — the keepalive PUT faithfully
persisting an EMPTY list. The root cause: Next 14.1+ integrates
`window.history.replaceState` into the App Router, so the Untitled
adoption's replaceState (inside ensureProject) RE-RAN the load effect
mid-autosave; the re-run's GET raced the machine's own first PUT,
returned the project WITHOUT the just-drawn elements, and the
unconditional loadProject clobbered the live store with the stale server
list; the machine's mid-flight reference guard then flipped the store
unsaved — and the keepalive wiped the just-saved element through the
unload. The pre-fix code carried the SAME clobber race, masked only by
the reload beating the 800ms re-flush timer. TWO fixes: (1) the loader's
**adoption-clobber guard** — skip the re-load when the store already
holds the target project (`useEditorStore.getState().projectId ===
projectId`; a refresh (fresh store) and a soft navigation to another
project both still load); (2) the keepalive's `if (flushing) return`
guard REMOVED — a regular in-flight fetch does NOT survive page teardown
(observed live: the machine's PUT canceled mid-flight at reload), so
declining behind it lost exactly the edits the listener exists to save.
Both carried by the extended unload-flush unit spec (the adoption-guard
pin + the flushing-guard-absence pin); the untitled-editor pin re-proven
GREEN; the FULL suite 213/213.

En-route test-bug fixes (the pins, not the code): the cap-refused pin's
hydration gate (above); the destructive and cap pins' fixtures moved
after a `page.goto("/")` (about:blank cannot resolve the relative
fixture fetch — the F45 discipline); the zoom-reset pin's navigation
re-anchored on the editor's own "Back to dashboard" button (the editor
does not render the workspace header's Digma-home link); the immediate-
open pin's release callback cast for TypeScript's callback-assignment
narrowing.
