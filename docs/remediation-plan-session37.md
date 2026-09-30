# Remediation Plan — Session 37 (the Seventeenth Audit)

**Date:** 2026-09-30 · **Trigger:** the operator's session-39/session-40 directive (the
session-35 suggested next steps: the reference's editor avatar-stack identity semantics and
its Teams-page role labels) · **Code state at start:** `427b5e2`

## The audit method

The seventeenth consecutive live parity audit on `https://digma-371dfd0d.base44.app`
(desktop 1440×900, mobile 390×844) with the session-35 method extension: where the live
DOM could not discriminate a contract (the reference account now owns ZERO teams — its
Teams page renders the empty state and CANNOT create any), the audit decoded the
reference's shipped client bundle (`assets/index-CFEZghM7.js`) at each render-site
string and live-measured everything else.

## Reference findings (RA-41 … RA-44 + R3)

- **RA-41 (bundle-decoded + live-measured) — the editor avatar stack renders TWO
  HARDCODED placeholder collaborators.** Decoded verbatim: a `M4({projectId})` component
  seeds `useState` through a `useEffect` with `[{id:1,name:"Alex Design",color:"#3b82f6",
  cursor:{x:150,y:200}},{id:2,name:"Sarah UI",color:"#10b981",cursor:{x:300,y:150}}]` —
  never fetched, never the logged-in account (the live account is `sepnetflix2023`), and
  the `cursor` data is never rendered anywhere (dead collaboration theater — avatars
  only). The chips render `name.charAt(0)` with `title={name}` on
  `w-8 h-8 rounded-full border-2 border-white text-xs font-medium text-white` +
  `backgroundColor: color` — the clone's chip chrome matches EXACTLY. The counter is
  `flex items-center gap-1 text-gray-400 text-sm` + `lucide-users w-4 h-4` + `t.length`
  (= "2") and is **UNGATED** — live-measured `display: flex` at BOTH 1440×900 AND
  390×844 (no `hidden sm:flex` gating exists in the reference's DOM).
- **RA-42 (bundle-decoded + live-verified) — the reference CANNOT create teams.** Both
  the header "Create Team" and the empty-state "Create Your First Team" buttons render
  with NO `onClick` property at all (the decoded `Fe` button components carry only
  className + children); clicking either live produces ZERO `[role=dialog]` elements in
  the DOM. No team-creation dialog exists in the bundle (no "Team Name"/"Invite
  Member"/"Team Description" strings). Dead chrome — the RA-28 dead-control family.
- **RA-43 (bundle-decoded) — the reference's team card chrome.** `bg-white rounded-xl
  border border-gray-200 p-6 hover:shadow-lg transition-all duration-300` (24px padding,
  NO base shadow, NO border-color change on hover); header row `flex items-start
  justify-between mb-4` carrying a `w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600
  rounded-xl` icon chip (Users `w-6 h-6 text-white` — ALWAYS the fixed blue→purple
  gradient; the card NEVER paints a team color) and a DEAD ellipsis button
  (`text-gray-400 hover:text-gray-600`, `w-5 h-5` icon, no onClick); the name renders
  BELOW the header row as `h3 text-xl font-semibold text-gray-900 mb-2` (20px); the
  description `text-gray-500 text-sm mb-4 line-clamp-2` (conditional); a footer `flex
  items-center justify-between text-sm` whose left slot is the member COUNT — `flex
  items-center gap-2 text-gray-500` + Users `w-4 h-4` + `((members?.length)||0) +
  " members"` (ALWAYS plural — "1 members" is its own grammar bug) — and whose right
  slot is a DEAD "Manage" ghost button (`text-blue-600 hover:text-blue-700`, `w-4 h-4
  mr-1` icon, no onClick). **NO member list, NO role labels, NO member avatars render
  anywhere on the reference's card** — the members exist only as a count.
- **RA-44 (bundle-decoded + live-measured) — the Teams page structure.** Page wrapper
  `min-h-screen bg-white`; the page header sits in its own FULL-WIDTH BORDERED BAND —
  `border-b border-gray-200 bg-white` (live-measured 113px tall) wrapping
  `max-w-7xl mx-auto px-6 py-6` with the row `flex flex-col md:flex-row
  justify-between items-start md:items-center gap-4` (h1 `text-3xl font-bold text-gray-900`
  live-measured 30px + `p text-gray-500 mt-1` + the Create Team button
  `bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium`,
  live-measured 36px tall / 12px radius / 14px text / the standard shadow token); the grid
  container is SEPARATE: `max-w-7xl mx-auto px-6 py-8` — FLAT `px-6` at every viewport
  (no `sm:` gating). Loading state: SIX `bg-gray-100 rounded-xl h-48 animate-pulse`
  skeleton cards. Empty state: `text-center py-16`, Users `w-16 h-16 text-gray-300`,
  `h3 text-xl font-semibold`, `p text-gray-500 mb-6`, and the "Create Your First Team"
  button at the Fe default padding (h-9 + the standard shadow token). Team fetch:
  `entities.Team.list("-updated_date")` (sorted by updated_date DESC).
- **R3 (17th consecutive) — mobile nav failure class A re-confirmed** at 390×844: the
  reference's desktop nav computes `display: none`, the ONLY header button is the search
  toggle (a `w-80` search input that itself computes width 0 at 390 — its own responsive
  quirk), and zero dialogs exist. The clone's mobile nav re-verified END-TO-END in the
  same session: the 44×44 trigger, the Sheet drawer (Dashboard/Recent/Teams links), the
  scroll lock (`body overflow: hidden`), tap-navigate-and-dismiss → `/Teams`, and the
  body overflow restored. The Tailwind v4 failure class A remains NOT present in the
  clone.

## Clone findings (the gaps to remediate)

- **S37-1 (Low): the editor avatar stack's second chip titles "Collaborator"** — the
  reference's is "Sarah UI" (RA-41) — a visible tooltip-content divergence in the
  reference's WORKING chrome. The FIRST chip renders the real user (`user.name`) — the
  deliberate WORKING SUPERSET over the reference's hardcoded "Alex Design" (the RA-40
  header-slot family: unwired placeholder identity on the reference, real identity in
  the clone) — unchanged, re-documented.
- **S37-2 (Low): the avatar counter is `hidden … sm:flex`** — `display: none` at
  390×844 — while the reference's counter is UNGATED and visible at mobile (RA-41,
  live-measured at both viewports).
- **S37-3 (Medium): the Teams page merges the header and grid in ONE container**
  (`mx-auto max-w-7xl px-4 py-8 sm:px-6`, grid at `mt-8`) — the reference renders the
  header in its own full-width `border-b border-gray-200` band (inner `px-6 py-6`) and
  the grid in a SEPARATE `px-6 py-8` container, FLAT `px-6` at every viewport (RA-44).
  The header row also omits the reference's `items-start` base. (The Create Team
  button's `shadow` was INITIALLY misread as a divergence — the bundle's decoded custom
  className merges onto the Fe button base whose default variant carries `shadow`; the
  live re-measure confirmed the reference's button DOES render the standard shadow
  token, so the clone's `shadow` class was already correct and stays — the F26
  className-reading lesson extends to decoded strings: custom classes are MERGED onto
  component bases, so read the base variant too.)
- **S37-4 (Medium): the team card chrome diverges on seven sub-items** (RA-43): card
  `p-5 shadow-sm hover:border-gray-300 hover:shadow-md` vs `p-6 hover:shadow-lg` +
  `duration-300` (no base shadow, no border-color change); the icon chip 40×40 SOLID
  `team.color` vs 48×48 blue→purple GRADIENT (the reference never paints the team
  color); the name `text-base` BESIDE the chip vs `text-xl mb-2` BELOW the header row;
  the member count in the HEADER (`text-xs text-gray-500`) vs the FOOTOR row
  (`text-sm text-gray-500` + Users `w-4 h-4` + "N members"); the description
  `text-gray-600` vs `text-gray-500`; the loading skeleton 3 × `h-44` vs 6 × `h-48`.
- **S37-5 (docs-only): the dead-chrome ledger and the supersets.** The reference's
  Create Team buttons, per-card ellipsis, and per-card "Manage" are ALL dead (RA-42/
  RA-43) — the clone's CreateTeamDialog, Delete-confirm, and Invite Member are the
  working supersets and stay. The member list with role labels — this audit's original
  target — has NO reference counterpart at all: the clone's
  `member.role ?? member.email ?? "Member"` sub-labels are its own superset design,
  unchanged. The reference's always-plural "N members" is its own grammar bug; the
  clone's proper singular "1 member" stays the coherent superset (the RA-35
  border-leak family: the reference's own bug is not ported). The team `color` field
  remains collected by the (superset) Create dialog but is no longer painted on the
  card (the reference's chip is a fixed gradient).

## The remediation slices

### Slice A — the avatar-stack contract (S37-1 + S37-2)

`src/components/editor/editor-view.tsx` (the top bar's avatar cluster):

1. The second chip's `title` becomes `"Sarah UI"` (the reference's verbatim identity —
   the comment updates: the reference's stack is hardcoded fake-cursor collaborators,
   "Alex Design" + "Sarah UI"; the clone's first chip stays the REAL user as the
   documented working superset over the reference's "Alex Design" placeholder).
2. The counter drops `hidden` + `sm:flex` — becoming `flex items-center gap-1 text-sm
   text-gray-400` (the reference's exact ungated classes; visible at every viewport
   including 390×844).

### Slice B — the Teams page header band + containers (S37-3)

`src/components/teams-view.tsx` (the page body):

1. The header row moves into its own full-width band: `border-b border-gray-200
   bg-white` wrapping `mx-auto max-w-7xl px-6 py-6` (flat `px-6` — no `sm:` gating),
   with the row ported to the reference's exact `flex flex-col md:flex-row
   justify-between items-start md:items-center gap-4`.
2. The grid/empty/loading container becomes SEPARATE: `mx-auto max-w-7xl px-6 py-8`
   (the `mt-8` wrapper goes away — the band's border + the container's own `py-8` carry
   the separation).
3. The Create Team button KEEPS its `shadow` token (the live re-measure confirmed the
   reference's button renders the standard shadow — the initial "no shadow" reading was
   a decode-only artifact caught during the RED phase; its `h-9` stays — the
   live-measured 36px height — as does `px-6 py-3 rounded-xl font-medium`).

### Slice C — the team card chrome port (S37-4)

`src/components/teams-view.tsx` (`TeamCard`):

1. Card container → the reference's exact `rounded-xl border border-gray-200 bg-white
   p-6 transition-all duration-300 hover:shadow-lg` (drop `shadow-sm`,
   `hover:border-gray-300`, `hover:shadow-md`).
2. Header row → `mb-4 flex items-start justify-between`: the chip becomes `flex h-12
   w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500
   to-purple-600` with `Users className="h-6 w-6 text-white"` (the fixed gradient —
   `team.color` no longer painted on the card); the Delete-confirm cluster stays in
   the right slot (the working superset over the reference's dead ellipsis).
3. The name moves BELOW the header row: `mb-2 text-xl font-semibold text-gray-900`.
4. The description → `text-gray-500` (was `text-gray-600`).
5. The member list (the superset) stays, then the FOOTER row: `flex items-center
   justify-between text-sm` wrapping the reference's count slot `flex items-center
   gap-2 text-gray-500` + `Users h-4 w-4` + `{n} {n === 1 ? "member" : "members"}`
   (the clone's proper pluralization stays — documented). The Invite Member button
   follows with `mt-4` (the clone's superset control; the reference's "Manage" is
   dead).
6. The loading skeleton → SIX `h-48` cards (was 3 × `h-44`).

### Slice D — documentation (S37-5)

The dead-chrome ledger + the supersets documented across the four-doc set (see
"Documentation alignment" below).

## The TDD plan (RED first, at the exact assertions)

All pins land in `tests/e2e/parity.spec.ts` as a session-37 describe pair (no new unit
seams — every fix is DOM chrome; the unit suite stays at 92):

1. **Editor avatar pins** (RED against the pre-fix DOM):
   - the second chip's `title` → `expect …toBe("Sarah UI")` (pre-fix: "Collaborator");
   - the counter's `display` at 390×844 → `toBe("flex")` (pre-fix: "none").
2. **Teams structure pins** (RED against the pre-fix DOM):
   - a `border-b` band exists in `main` AND contains the h1 (pre-fix: zero bands);
   - the content container's computed `padding-left` at 390×844 → `24px` (pre-fix:
     16px — the `px-4` base);
   - the Create Team button's computed `box-shadow` → `none` (pre-fix: a shadow token).
3. **Team card chrome pins** (RED against the pre-fix DOM):
   - the card's computed `padding` → `24px` (pre-fix: 20px);
   - the chip's `getBoundingClientRect().width` → `48` (pre-fix: 40) AND its
     `background-image` computes a `linear-gradient` (pre-fix: `none` — a solid color);
   - the h3's computed `font-size` → `20px` (pre-fix: 16px);
   - the count row: the "3 members" text renders with a `Users` svg sibling at
     `font-size: 14px` (pre-fix: the count sits in the header at 12px);
   - the description's computed `color` → `rgb(107, 114, 128)` (pre-fix:
     `rgb(75, 85, 99)`);
   - the member list STILL renders (the superset pin: "Alex Design" visible — guards
     the restructure against dropping the list).
4. **Skeleton pin** (route-delayed API): intercept `**/api/teams` with a 700ms delayed
   fulfillment, land on `/Teams`, count `main .animate-pulse` → `6` (pre-fix: 3) with
   `height: 192px` (pre-fix: 176px).

GREEN = the three code slices; then the full gate (lint → typecheck → 92 unit → build →
28 smoke → e2e) and the live re-verification on the dev server, including the mobile
nav sweep re-verification and the standard 16-screenshot re-capture.

## Validation against the codebase (pre-execution)

- `editor-view.tsx` lines ~463–482: the avatar cluster renders `title={user.name}` +
  `title="Collaborator"` and the counter `hidden items-center gap-1 text-sm
  text-gray-400 sm:flex` — matches S37-1/S37-2's pre-fix state. ✓
- `teams-view.tsx` lines ~88–147: the single merged container (`px-4 py-8 sm:px-6`),
  the `mt-8` grid wrapper, and the `shadow`-carrying Create buttons — matches S37-3's
  pre-fix state. ✓
- `TeamCard` lines ~185–245: `p-5 shadow-sm hover:border-gray-300 hover:shadow-md`, the
  40×40 solid-color chip, the header-inline `text-base` name + `text-xs` count, the
  `text-gray-600` description, and the 3 × `h-44` skeleton — matches S37-4's pre-fix
  state. ✓
- No e2e spec references the team color presets, the card chip chrome, or the avatar
  titles — the restructure breaks no existing pin (the only Teams-page e2e asserts the
  seeded team name + "Alex Design" member text, both preserved). ✓
- The `team.color` schema field, the CreateTeamDialog presets, and the member
  `role` labels are untouched (supersets). ✓

---

## Execution status (end of session 37)

**All items EXECUTED and GREEN.** RED first (the exact captured assertions): 7/7 target
tests failed against the pre-fix build — the avatar title at `Expected: "Sarah UI",
Received: "Collaborator"`, the mobile counter at `Expected: "flex", Received: "none"`,
the band pair at `Expected: true, Received: false` (desktop AND mobile), the Create-Team
shadow pin, the card chrome at `Expected: "24px", Received: "20px"`, and the skeleton at
`Expected: 6`; the member-list superset guard passed by design. **The RED phase caught a
wrong pin:** the Create-Team-shadow test asserted `box-shadow: none` from the bundle
decode alone — the decoded custom className MERGES onto the reference's Fe button base
whose default variant renders `shadow`, so the reference's button DOES paint the standard
shadow token (live re-measured). The pin was corrected to assert the visible layers, the
initial "drop the shadow" change was REVERTED, and the plan text above was corrected in
place (the F28 lesson). GREEN: Slice A (the "Sarah UI" title + the ungated counter),
Slice B (the bordered band + separate flat-px-6 containers + the 6 × h-48 skeleton),
Slice C (the seven card-chrome sub-items). Full gate green: **92 unit (unchanged) / 28
smoke / 107 e2e (+8)**.

**Live verification (dev server, post-fix):** the band live-measures 113px (the
reference's exact number); the content container computes 24px at BOTH 1440×900 and
390×844; the card computes 24px padding / the 48px linear-gradient chip / the 20px name /
the footer "3 members" row at 14px; the avatar stack renders "D"/"Designer" +
"S"/"Sarah UI" with the counter `display: flex` at BOTH viewports. The clone's mobile nav
re-verified end-to-end (the 17th session; the Tailwind v4 failure class A remains NOT
present). The reference's project board left pristine (its account owns zero teams; no
probe artifacts were possible or needed — the Create buttons are dead).
