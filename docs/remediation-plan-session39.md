# Remediation Plan — Session 39 (the Eighteenth Audit)

**Date:** 2026-09-30 · **Trigger:** the operator's session-41/session-42 directive (the
session-41 suggested next steps: the reference's Recent-page sort control behavior and a
functional sweep of its editor zoom cluster) · **Code state at start:** `98732e5`

## The audit method

The eighteenth consecutive live parity audit on `https://digma-371dfd0d.base44.app`
(desktop 1440×900, mobile 390×844), function-first per the F19 discipline: the
never-functionally-tested Recent-page toolbar (sort / search / view toggles / list card)
and the editor zoom cluster were exercised end-to-end with discriminating data — two
probe projects ("AAA Alpha Probe", "ZZZ Sort Probe") were created on the reference to
separate the four sort orders from one another, then deleted (the board left pristine at
"Test Project One"; the native confirm was intercepted, never auto-accepted blind).

## Reference findings (RA-45 … RA-51 + R3)

- **RA-45 (decisive, live-measured with 3-project discrimination) — the Recent sort
  control IS functional and every sort is DESCENDING.** Each option change refetches
  `entities/Project?sort=-<field>` (network-verified: `-last_accessed`, `-updated_date`,
  `-created_date`, `-name`) and the rendered order follows the server response. The name
  sort measured "ZZZ Sort Probe", "Test Project One", "AAA Alpha Probe" (Z > T > A —
  descending, the `-` prefix). The select itself is a NATIVE `<select>` with
  `text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white text-gray-700` inside a
  `flex items-center gap-2` row with a `lucide-calendar w-4 h-4 text-gray-400` glyph, in
  a `flex items-center gap-4 mt-6` wrapper — the clone's chrome already matches. The
  sort RESETS to `last_accessed` on every fresh page load (no persistence; the clone's
  `useState` default matches).
- **RA-46 (live-measured) — the search box works, client-side, case-insensitive.**
  Typing filters with ZERO new network requests (the request log stays quiet); "zzz"
  matches "ZZZ Sort Probe"; the count text renders "1 file found" / "3 files found"
  (proper singular/plural). The clone matches all of this.
- **RA-47 (live-measured) — the view toggles work** (grid ↔ list). Active toggle = the
  shadcn default variant (`bg-primary text-primary-foreground shadow`), inactive =
  outline; both `text-xs w-10 h-10 p-0 rounded-md` with `lucide-grid3x3` /
  `lucide-list` `w-4 h-4`. The clone matches (plus `aria-label`/`aria-pressed`
  supersets).
- **RA-48 (live-measured) — the LIST view card structure.** Container `space-y-2`
  (separate cards, NOT a bordered table); card `flex items-center justify-between p-3
  bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all
  duration-200 group` — NOT clickable itself (`cursor: auto`, no onClick; only the name
  is a link); left slot `flex items-center gap-4 flex-1 min-w-0` carrying a 40×40
  thumbnail `w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md
  flex-shrink-0 overflow-hidden` (the SAME mini-canvas scaled inside — note
  blue-100/purple-100, one shade darker than the grid's blue-50/purple-50) and the name
  `<a class="font-semibold text-gray-800 group-hover:text-purple-600
  transition-colors truncate block text-sm">` navigating to the editor; right slot
  `flex items-center gap-6 text-xs text-gray-500 flex-shrink-0 ml-4` with
  `lucide-clock w-3 h-3` + "Sep 30, 2026" (month-short, day, YEAR — the grid's "Opened
  Sep 30" carries no year) + the ellipsis dropdown (`w-7 h-7 p-0` ghost). NO avatar
  stack renders in the list card (the grid footer's `-space-x-2` cluster is grid-only).
- **RA-49 (live-measured) — the list-view ellipsis menu carries Rename + Delete;
  Rename is DEAD, Delete WORKS.** Rename closes the menu with no dialog, no input, no
  effect (the RA-28 dead-control family). Delete calls the native
  `window.confirm("Are you sure you want to delete \"<name>\"?")` — the same guard as
  the grid card (RA-16).
- **RA-50 (live-measured) — the editor zoom cluster IS FUNCTIONAL via its BUTTONS,
  multiplicative steps, clamped [10%, 500%].** Zoom-in multiplies ×1.2 per click
  (100→120→…→500, hard max at 500%); zoom-out divides ÷1.2 (×5/6) per click
  (500→417→347→…→10, hard min at 10%); the pill displays `Math.round(zoom×100)`% —
  every intermediate reading matches the float ×5/6 chain rounded (116→97→81→67→56→47→
  39→32→27→23→19). **Ctrl+wheel zoom is DEAD** (12% stayed 12% through a ctrl+wheel
  gesture) — session 29's RA-12 reading re-confirmed for the wheel path; the buttons
  were never functionally tested until now. The cluster chrome (pill + two buttons,
  `absolute top-4 left-4 z-10 flex items-center gap-2`) already matches the clone.
- **RA-51 (live-measured) — the search-empty state.** `text-center py-16` carrying a
  BARE `lucide-search w-16 h-16 text-gray-300 mx-auto mb-4` (no gradient circle), an
  h3 `text-xl font-semibold text-gray-900 mb-2` titled **"No files found"**, and a
  `p text-gray-500` reading **"Try adjusting your search terms or filters"**; the count
  row renders "0 files found". (The zero-projects variant is unmeasurable without
  deleting the operator's only project — the F22 rule: port the measurable contract.)
- **R3 (18th consecutive) — mobile nav failure class A re-confirmed** at 390×844: the
  desktop nav computes `display:none` and the reference's ONLY header button is now a
  dead notification bell (`lucide-bell w-5 h-5`, 36px wide; click produces zero
  dialogs/popovers). The clone's mobile nav re-verified END-TO-END in the same session
  (44×44 trigger → sheet with Dashboard/Recent/Teams → scroll-lock → tap-navigate-
  and-dismiss → `/Teams` → body overflow restored). The Tailwind v4 failure class A
  remains NOT present in the clone.

## Clone findings (the gaps to remediate)

- **S39-1 (Medium): the clone's Name sort is ASCENDING** — `sortProjects`'s name
  branch reads `a.name.localeCompare(b.name)`; the reference's is DESCENDING
  (`?sort=-name`, measured Z > T > A). The three date sorts are already DESC in both.
- **S39-2 (Medium): the clone's LIST view diverges structurally on six sub-items**
  (RA-48): a table-style container (`overflow-hidden rounded-lg border border-gray-200
  bg-white` with `border-t` dividers) vs the reference's separate `space-y-2` cards; a
  10px gradient DOT vs the 40×40 mini-canvas thumbnail on the blue-100/purple-100
  gradient; NO ellipsis menu (no rename/delete in list view at all); the full
  `toLocaleString()` timestamp vs "Sep 30, 2026"; the whole row clickable vs
  name-only link; no `group`/hover-shadow chrome.
- **S39-3 (Low): the clone's zoom clamps are [0.05, 8]** — the reference's measured
  clamps are **[0.1, 5]** (RA-50: hard stops at 10% and 500%).
- **S39-4 (Medium): the clone's empty state diverges on five sub-items** (RA-51):
  `py-20` vs `py-16`; a purple/pink gradient circle with a white `Users` icon vs the
  BARE gray `lucide-search w-16 h-16`; h3 `font-bold` + "No recent files" vs
  `font-semibold` + "No files found"; the copy "Files you've recently worked on will
  appear here" vs "Try adjusting your search terms or filters"; `text-sm text-gray-600`
  vs `text-gray-500`.
- **S39-5 (docs): the supersets ledger.** The clone's working list-view Rename (the
  reference's is dead — RA-49), the card-local "Delete project?" confirm dialog (the
  reference's native confirm — the RA-16 superset family), Ctrl+wheel zoom (dead on
  the reference — RA-50), and the toggle `aria-label`/`aria-pressed` attributes are
  ALL working supersets, kept and documented.

## The remediation slices

### Slice A — the Name sort direction (S39-1)

`src/components/recent-view.tsx` (`sortProjects`, the name branch):

1. `a.name.localeCompare(b.name)` → `b.name.localeCompare(a.name)` — descending, the
   reference's `?sort=-name` contract. (The comment updates to cite RA-45.)

### Slice B — the list view port (S39-2)

`src/components/recent-view.tsx` (the list branch of the grid/list conditional):

1. Container: `space-y-2` (separate cards; the table container and `border-t`
   dividers go away).
2. Card: `flex items-center justify-between p-3 bg-white border border-gray-200
   rounded-lg hover:shadow-sm transition-all duration-200 group` — the card itself
   NOT clickable; only the name link navigates (and touches `lastOpenedAt` through
   the same PATCH the grid card's `openProject` uses).
3. Left slot: `flex items-center gap-4 flex-1 min-w-0` carrying the 40×40 thumbnail —
   `w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md flex-shrink-0
   overflow-hidden` wrapping the SAME `CanvasThumbnail` component the grid card uses
   (re-imported from `project-card.tsx`) — plus the name `<a>` with the reference's
   exact classes.
4. Right slot: `flex items-center gap-6 text-xs text-gray-500 flex-shrink-0 ml-4`
   carrying `Clock w-3 h-3` + `toLocaleDateString("en-US", { month: "short", day:
   "numeric", year: "numeric" })` (→ "Sep 30, 2026") + the ellipsis dropdown
   (`variant="ghost" size="iconSm" w-7 h-7 p-0`, `MoreHorizontal w-4 h-4`) with the
   clone's WORKING Rename dialog + "Delete project?" confirm (the S31/S37 card-local
   pattern ported to the list row — the reference's own Rename is dead and its Delete
   is a native confirm; both clone controls are the documented supersets). The
   dropdown wraps in the `stopPropagation` seam (the S31-3 portal-bubbling lesson —
   the row is no longer clickable, but the guard stays for defense-in-depth).
   NO avatar stack in the list card (RA-48).

### Slice C — the zoom clamps (S39-3)

`src/components/editor/editor-store.ts` (lines 154–156):

1. `clamp(zoom, 0.05, 8)` → `clamp(zoom, 0.1, 5)` in `setZoom`, `zoomIn`, and
   `zoomOut` — the reference's measured [10%, 500%] range (RA-50). The clone's
   Ctrl+wheel superset inherits the same coherent range through `setZoom`.

### Slice D — the empty state port (S39-4)

`src/components/recent-view.tsx` (the empty branch):

1. Container: `py-16 text-center` (was `py-20`).
2. Icon: the bare `lucide-search` at `h-16 w-16 text-gray-300 mx-auto mb-4` (was the
   gradient circle + `Users`).
3. h3: `mb-2 text-xl font-semibold text-gray-900` reading **"No files found"** (was
   `font-bold` + "No recent files").
4. p: `text-gray-500` reading **"Try adjusting your search terms or filters"** (was
   `text-sm text-gray-600` + the other copy).

### Slice E — documentation (S39-5)

The dead-chrome ledger + supersets documented across the four-doc set (see
"Documentation alignment" below).

## The TDD plan (RED first, at the exact assertions)

All pins land in `tests/e2e/parity.spec.ts` as a session-39 describe block (no new unit
seams — the sort key list and clamps are exercised through their rendered contracts;
the unit suite stays at 92):

1. **Name-sort pin** (RED against the pre-fix ASC order): navigate `/Recent`, select
   "Name" on `#recent-sort`, assert the FIRST card h3 is "Portfolio Website
   Redesign" (P > M over the seeded "Marketing Hero Banner") — pre-fix renders
   "Marketing Hero Banner" first.
2. **List-structure pins** (RED against the pre-fix table list): click the list toggle
   (`aria-label="List view"`), then
   - the list container `main .space-y-2` exists (pre-fix: zero);
   - the card's computed `padding` → `12px` (pre-fix: 16px left/right);
   - the thumbnail's `getBoundingClientRect().width` → `40` (pre-fix: the 10px dot);
   - the name anchor's computed `font-size` → `14px` with `text-decoration: underline`
     absent and href containing `/Editor` (the pre-fix row has no anchor);
   - the date text matches `/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/` (pre-fix:
     `toLocaleString` renders a full timestamp);
   - the ellipsis button exists in the card (pre-fix: none) and its menu opens with
     "Rename" + "Delete" items.
3. **List-menu superset pin**: clicking Delete opens the card-local "Delete project?"
   confirm dialog (the clone's superset guard — mirrors the grid card's pinned flow).
4. **Zoom-clamp pins** (RED against [0.05, 8]): open the seeded editor, then
   - 20 zoom-out clicks → the pill reads `10%` (pre-fix: `5%`);
   - 12 zoom-in clicks from 100% → the pill reads `500%` (pre-fix: `800%`);
   - one zoom-in from 100% → `120%` (the ×1.2 step contract, stable in both — the
     guard pin).
5. **Empty-state pins** (RED against the pre-fix block): search a no-match term, then
   - the h3 reads "No files found" (pre-fix: "No recent files");
   - the bare `lucide-search` svg renders at 64×64 (pre-fix: the gradient circle's
     inner Users icon renders 32px);
   - the copy reads "Try adjusting your search terms or filters".

GREEN = the four code slices; then the full gate (lint → typecheck → 92 unit → build
→ 28 smoke → e2e) and the live re-verification on the dev server, including the mobile
nav sweep re-verification and the standard 16-screenshot re-capture.

## Validation against the codebase (pre-execution)

- `recent-view.tsx` line 48: `return copy.sort((a, b) => a.name.localeCompare(b.name));`
  — matches S39-1's pre-fix state. ✓
- `recent-view.tsx` lines 189–210: the table-style list (`overflow-hidden rounded-lg
  border border-gray-200 bg-white`, `border-t` dividers, the `h-2.5 w-2.5` dot,
  `toLocaleString()` timestamp, no menu) — matches S39-2's pre-fix state. ✓
- `recent-view.tsx` lines 211–218: the empty state (`py-20`, the gradient circle +
  `Users h-8 w-8`, "No recent files" `font-bold`, "Files you've recently worked on
  will appear here") — matches S39-4's pre-fix state. ✓
- `editor-store.ts` lines 154–156: `clamp(zoom, 0.05, 8)` ×3 — matches S39-3's
  pre-fix state. ✓
- `CanvasThumbnail` is exported from `project-card.tsx` and takes
  `{ project, elements }` — reusable by the list row with no changes. ✓
- The grid card's Rename dialog + Delete-confirm + stopPropagation pattern
  (`project-card.tsx` lines ~280–560) ports to the list row as-is (state +
  handlers local to a `ListCard`-style block inside recent-view.tsx). ✓
- No e2e spec references the list view, the empty state, the zoom pill floors, or the
  name-sort order — the restructure breaks no existing pin (the only Recent-page e2e
  coverage is the sort control's existence + the smoke suite's route check). ✓
- The e2e DB's two seeded projects ("Marketing Hero Banner" M, "Portfolio Website
  Redesign" P) discriminate the name-sort direction. ✓

---

## Execution status (end of session 39)

**All items EXECUTED and GREEN.** RED first (the exact captured assertions): 6/6 target
tests failed against the pre-fix build — the name sort at `Expected: "Portfolio Website
Redesign", Received: "Marketing Hero Banner"` (the pre-fix ASC order), the list
container at `Expected: 1, Received: 0` (`.space-y-2` missing), the list date/menu pair
and the Delete-confirm pair failing on the absent structure, the zoom floor at
`Expected: "10%", Received: "5%"` (the pre-fix [0.05, 8] clamp), and the empty state at
`null` reads (the pre-fix `py-20` block). **The GREEN phase caught two pin-side flaws**
(the F28(a) discipline — a failure against believed-correct code audits the PIN): (a)
the zoom-ceiling pin originally asserted 500% after 12 zoom-in clicks, but counting
from the 10% floor 10 × 1.2¹² is 89% — the pin's arithmetic had counted from 100%;
corrected to 24 clicks (10 × 1.2²⁴ ≈ 795 → clamped 500). (b) The list date/menu pin
evaluated immediately after the toggle click (a React re-render race) — hardened with
the auto-retrying settle; the name-sort pin gained the same settle after one flaky
pass-order observation. Neither correction changed a code direction.

GREEN: Slice A (the name-sort flip to `b.name.localeCompare(a.name)`), Slice B (the
`RecentListCard` component — the reference's card chrome verbatim, the exported
`CanvasThumbnail` at 40×40 on `from-blue-100 to-purple-100`, the name-only link with
the grid card's `lastOpened` PATCH, `Clock w-3 h-3` + the month-short/day/year date,
the `w-7 h-7` ellipsis with the working Rename + Delete dialogs under the S31-3
stopPropagation seam), Slice C (`clamp(zoom, 0.1, 5)` ×3), Slice D (the `py-16` +
bare `lucide-search h-16 w-16` + "No files found" + "Try adjusting your search terms
or filters" empty block). Full gate green: **92 unit (unchanged) / 28 smoke / 113 e2e
(+6)** — the smoke suite's first run failed on the documented exported-`DATABASE_URL`
environment trap (re-inherited by the tool-call shell); `unset DATABASE_URL && …` in
the SAME command ran 28/28 with no code change.

**Live verification (dev server, post-fix):** the name sort renders Portfolio before
Marketing; the list row computes 12px padding / the 40px thumbnail / the 14px name
link / the "Sep 25, 2026" date; the Rename dialog opens with a working input and the
Delete opens the card-local confirm (Cancel keeps both rows); 25 zoom-out clicks hold
the pill at 10% and 24 zoom-in clicks hold it at 500%; the empty state renders the
bare 64px search icon + "No files found" + "Try adjusting your search terms or
filters" at `rgb(107, 114, 128)`. The clone's mobile nav re-verified end-to-end (the
18th session; the Tailwind v4 failure class A remains NOT present). The reference's
board left pristine (both probe projects deleted through the intercepted native
confirm; "Test Project One" remains).
