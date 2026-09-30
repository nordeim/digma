# Session 43 — The Eighteenth Parity Audit: Recent-Toolbar + Zoom-Cluster Functional Contracts (S39-1 + S39-2 + S39-3 + S39-4)

**Date:** 2026-09-30 · **Code state at start:** `98732e5` (session 37 delivered; transcript
push = `docs/session_42.md`) · **Code state at end:** this commit · **Docs:** PAD v1.21.0 ·
digma_SKILL v1.20.0 (lesson F29)

## Directive

The session-41 suggested next steps pointed at the reference's Recent-page sort control
behavior and a functional sweep of its editor zoom cluster — two surfaces seventeen
sessions of audits had read only as CHROME (the sort select's classes were pinned in
session 7; the zoom cluster's classes in session 8) and never as BEHAVIOR. The standing
sweep (mobile nav, general parity) ran as usual.

## The audit (eighteenth consecutive)

**Baseline before any change:** workspace refreshed (`git pull` — fast-forward to
`98732e5`, bringing in the operator's `docs/session_42.md` transcript push), `.env`
verified with `DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root, dev server
healthy with the DB anchor logged. Fast gates green: lint · typecheck · 92/92 unit.
Configs verified: vitest (92) + playwright (107), both excluding `skills/`. The
session-37 fixes (the "Sarah UI" chip, the ungated counter, the Teams band, the
access-based stats) verified in place.

**The method — function-first with discriminating data (the F19 discipline):** the
reference account owned ONE project, so the audit created two probe projects named to
DISCRIMINATE — "AAA Alpha Probe" (alphabetically FIRST, created NEWEST) and "ZZZ Sort
Probe" (alphabetically LAST) — before touching any control. Both probes were deleted at
the audit's end (the native confirm intercepted and answered programmatically — never
blind-accepted; the reference's board left pristine at "Test Project One").

### Reference findings (live-measured; desktop 1440×900, mobile 390×844)

- **RA-45 (decisive) — the Recent sort control IS functional and ALL FOUR sorts are
  DESCENDING.** Every option change refetches `entities/Project?sort=-<field>`
  (network-captured: `-last_accessed`, `-updated_date`, `-created_date`, `-name`) and the
  rendered order follows the server response. The name sort measured "ZZZ Sort Probe" →
  "Test Project One" → "AAA Alpha Probe" (Z > T > A) on the three-project discriminator.
  The sort resets to `last_accessed` on every fresh page load (no persistence).
- **RA-46 — the search works, client-side, case-insensitive.** Typing filters with zero
  new network requests; "zzz" matched "ZZZ Sort Probe"; the count renders "1 file found"
  / "3 files found" (proper singular/plural); "0 files found" when nothing matches.
- **RA-47 — the view toggles work** (grid ↔ list): active = the shadcn default variant,
  inactive = outline; `w-10 h-10 p-0 text-xs rounded-md` with Grid3x3/List `w-4 h-4`.
- **RA-48 — the LIST view's card structure:** a `space-y-2` container (NOT a bordered
  table); each card `flex items-center justify-between p-3 bg-white border border-gray-200
  rounded-lg hover:shadow-sm transition-all duration-200 group` — NOT clickable itself
  (cursor auto, no onClick; only the name `<a>` navigates); the left slot carries a 40×40
  thumbnail (`w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md` — the
  same mini-canvas scaled inside, one shade darker than the grid's blue-50/purple-50) +
  the name (`font-semibold text-gray-800 group-hover:text-purple-600 transition-colors
  truncate block text-sm`); the right slot (`flex items-center gap-6 text-xs text-gray-500
  flex-shrink-0 ml-4`) carries `lucide-clock w-3 h-3` + "Sep 30, 2026" (month-short,
  day, YEAR — the grid's "Opened Sep 30" carries no year) + the ellipsis dropdown
  (`w-7 h-7 p-0` ghost). NO avatar stack in the list card.
- **RA-49 — the list ellipsis menu: Rename DEAD, Delete WORKS.** Rename closes the menu
  with no dialog, no input, no effect (the RA-28 dead-control family). Delete calls the
  native `window.confirm("Are you sure you want to delete \"<name>\"?")` — the same
  guard as the grid card (RA-16).
- **RA-50 (decisive) — the zoom cluster's BUTTONS are functional, ×1.2/÷1.2 steps,
  hard-clamped [10%, 500%].** Zoom-in multiplied per click to a hard 500% max;
  zoom-out divided per click (every intermediate pill reading matched the float ×5/6
  chain rounded: 500→417→347→289→241→201→167→139→116→97→81→67→56→47→39→32→27→23→19) to a
  hard 10% min. **Ctrl+wheel zoom is DEAD** (12% held through a ctrl+wheel gesture —
  RA-12 re-confirmed for the wheel path). **The historical "zoom erratic/dead" readings
  (sessions 19–29) were synchronous-click test artifacts** — batched `.click()` calls
  coalesce into one React render; with a wait between clicks the cluster steps cleanly.
- **RA-51 — the search-empty state:** `text-center py-16` with a BARE `lucide-search
  w-16 h-16 text-gray-300 mx-auto mb-4`, an h3 `text-xl font-semibold text-gray-900 mb-2`
  reading "No files found", and a `p text-gray-500` reading "Try adjusting your search
  terms or filters".
- **R3 — mobile nav failure class A re-confirmed** at 390×844 (the **18th consecutive
  session**; evidence: `docs/screenshots/ref-audit-s38/ref-05-mobile-recent-390.png` —
  the desktop nav computes `display:none` and the reference's ONLY header button is now a
  dead notification bell, `lucide-bell w-5 h-5` at 36px; its click produces zero
  dialogs/popovers).

### Clone findings

- **S39-1 (Medium): the name sort was ASCENDING** — `a.name.localeCompare(b.name)` vs
  the reference's DESCENDING `?sort=-name`.
- **S39-2 (Medium): the list view diverged structurally on six sub-items** — a
  table-style container with `border-t` dividers, a 10px gradient dot, a full
  `toLocaleString()` timestamp, no thumbnail, no ellipsis menu, the whole row clickable.
- **S39-3 (Low): the zoom clamps were [0.05, 8]** vs the reference's measured
  [0.1, 5].
- **S39-4 (Medium): the empty state diverged on five sub-items** — `py-20`, the
  gradient circle + Users icon, "No recent files" at `font-bold`, the other copy, and
  `text-sm text-gray-600`.

## The remediation plan

`docs/remediation-plan-session39.md` — written and re-validated line-by-line against the
codebase before execution. Four slices: **Slice A** (the name-sort direction flip),
**Slice B** (the `RecentListCard` port — the reference's chrome with the clone's working
Rename dialog + Delete-confirm as the documented superserset), **Slice C** (the zoom
clamps [0.1, 5]), **Slice D** (the empty-state port).

## The TDD execution

**RED (e2e):** 6/6 target tests failed against the pre-fix build at their exact
assertions — the name sort at `Expected: "Portfolio Website Redesign", Received:
"Marketing Hero Banner"`, the list container at `Expected: 1, Received: 0`
(`.space-y-2` missing), the list date/menu pair and the Delete-confirm pair failing on
the absent structure, the zoom floor at `Expected: "10%", Received: "5%"`, and the
empty state at `null` reads. (The 7th "passing" test in the run output was the auth
setup project, not a target.)

**The GREEN phase caught two pin-side flaws (the F28(a) discipline, extended by the new
F29(d)):** (a) the zoom-ceiling pin asserted 500% after 12 zoom-in clicks FROM THE 10%
FLOOR — 10 × 1.2¹² is 89%, not 500%; the failure was the PIN's arithmetic (counting
from 100%), not the code — corrected to 24 clicks (10 × 1.2²⁴ ≈ 795 → clamped 500).
(b) the list date/menu pin evaluated immediately after the toggle click — a race against
React's re-render — hardened with the auto-retrying `toHaveCount(1)` settle (and the
name-sort pin gained the same `toHaveText` settle after one flaky pass-order
observation). No code direction was changed by either correction.

**GREEN:** Slice A (`b.name.localeCompare(a.name)`). Slice B (the `RecentListCard`
component: the reference's exact card chrome, the exported `CanvasThumbnail` at 40×40 on
the blue-100/purple-100 gradient, the name-only link with the grid card's `lastOpened`
PATCH, the `Clock w-3 h-3` + month-short/day/year date, the `w-7 h-7` ellipsis with the
working Rename + Delete dialogs under the S31-3 stopPropagation seam). Slice C
(`clamp(zoom, 0.1, 5)` ×3). Slice D (the `py-16` + bare `lucide-search h-16 w-16` +
"No files found" + "Try adjusting your search terms or filters" block).

Full gate green: **lint · typecheck · 92 unit (unchanged) · build 20 routes · 28 smoke ·
113 e2e (+6).** (The smoke suite's first run failed 15 checks on "Error code 14: Unable
to open the database file" — the documented exported-`DATABASE_URL` environment trap
re-inherited by the tool-call shell; `unset DATABASE_URL && ./scripts/smoke-test.sh` in
the SAME command ran 28/28. No code was changed for it.)

## The live verification (dev server, post-fix)

- The name sort: selecting "Name" renders "Portfolio Website Redesign" before
  "Marketing Hero Banner" (P > M — descending).
- The list view: the container computes `space-y-2`; the row `p-3` (12px), the 40px
  thumbnail, the 14px name link with the `group-hover:text-purple-600` chain, and the
  "Sep 25, 2026" date (the seeded date, the reference's format).
- The list menu: Rename opens the working rename dialog (input + Save/Cancel); Delete
  opens the card-local "Delete project?" confirm (Cancel keeps both rows).
- The zoom: 25 zoom-out clicks hold the pill at **10%**; 24 zoom-in clicks hold it at
  **500%**; one click from 100% reads 120% (the ×1.2 step).
- The empty state: searching a no-match term renders the bare 64px `lucide-search`,
  "No files found" at weight 600, and "Try adjusting your search terms or filters" at
  `rgb(107, 114, 128)`.
- The clone's mobile nav re-verified end-to-end at 390×844 (44×44 trigger → sheet →
  scroll-lock → tap-navigate-and-dismiss → `/Teams` → overflow restored) — the Tailwind
  v4 failure class A remains NOT present in the clone (18th session).

## Delivery

- The standard 16 screenshots re-captured from the remediated dev server (re-seeded
  first; every dimension verified — desktop 1440×900, mobile 390×844, tablet 768×900)
  → `docs/screenshots/`; audit provenance → `docs/screenshots/ref-audit-s38/` (the
  reference's list/grid/sort/mobile shots + the clone's list/empty-state verification
  shots).
- `.env.example` re-verified (unchanged — no new env vars this session); included in the
  commit.
- Docs aligned: PAD v1.21.0 (revision block + §7.1 table + §7.4 checklist + the
  file-tree/key-files rows), AGENTS.md (the Recent-toolbar + zoom bullets + the counts),
  CLAUDE.md (ditto), README.md (the Recent row + the e2e row), digma_SKILL v1.20.0
  (lesson **F29** — a functional sweep must SPACE its interactions: batched synthetic
  clicks land in one React batch and read as "dead/erratic"; a control whose behavior
  depends on data you don't have needs discriminating probe data, not more clicking;
  check the network when a control changes rendered order; and pin arithmetic must count
  from the actual starting value), the plan's execution status, this log, and the
  worklog Task 43 entry.
- Full gate re-verified green before the commit; pushed to `main` via
  `docs/ssh_git_wrapper_v3.py` (the key shredded after).

## Suggested next steps

The reference's still-unaudited functional surfaces worth a nineteenth session: the
project card's ellipsis RENAME on the GRID view (the list-view rename measured dead —
the grid's may differ), the Dashboard's "Continue Working" card chrome vs the Recent
grid card (same component, different page context), or the properties panel's
Fill/Gradient/Image segmented control on the reference (its tabs were decoded as no-ops
in session 29 — a live functional sweep of each tab's paint path has never run).
