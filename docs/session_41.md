# Session 41 — The Seventeenth Parity Audit: Avatar-Stack + Teams-Page Bundle-Decoded Contracts (S37-1 + S37-2 + S37-3 + S37-4)

**Date:** 2026-09-30 · **Code state at start:** `427b5e2` (session 35 delivered; transcript
push = `docs/session_40.md`) · **Code state at end:** this commit · **Docs:** PAD v1.20.0 ·
digma_SKILL v1.19.0 (lesson F28)

## Directive

The session-35 suggested next steps pointed at the reference's editor avatar-stack identity
semantics and its Teams-page role labels — two seams sixteen sessions of audits had read
only as rendered chrome, never as IDENTITY or PAGE-STRUCTURE contracts. The standing sweep
(mobile nav, general parity) ran as usual.

## The audit (seventeenth consecutive)

**Baseline before any change:** workspace refreshed (`git pull` — fast-forward to `427b5e2`,
bringing in the operator's `docs/session_40.md` transcript push), `.env` verified with
`DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root, dev server healthy with the
DB anchor logged. Fast gates green: lint · typecheck · 92/92 unit. Configs verified: vitest
(92) + playwright (99), both excluding `skills/`. The session-35 fixes (access-based stats,
17:00 greeting, unconditional Try line, flat hero) verified in place.

**The method continued from session 35:** the reference account now owns ZERO teams and its
Teams page CANNOT create any (both Create buttons measured dead — see RA-42), so the card
and page-structure contracts could not be observed on a live team. The audit decoded the
reference's shipped client bundle (`assets/index-CFEZghM7.js`) at each render-site string
and live-measured everything the DOM could still show.

### Reference findings (live-measured + bundle-decoded; desktop 1440×900, mobile 390×844)

- **RA-41 (decisive, decoded + live-measured) — the editor avatar stack renders TWO
  HARDCODED placeholder collaborators.** The decoded `M4({projectId})` seeds `useState`
  through a `useEffect` with `[{id:1,name:"Alex Design",color:"#3b82f6",cursor:{x:150,
  y:200}},{id:2,name:"Sarah UI",color:"#10b981",cursor:{x:300,y:150}}]` — never fetched,
  never the logged-in account (the live account is `sepnetflix2023` while the stack shows
  "A" for "Alex Design"), and the `cursor` data is never rendered anywhere (dead
  collaboration theater — avatars only). The chips render `name.charAt(0)` with
  `title={name}` on `w-8 h-8 rounded-full border-2 border-white text-xs font-medium
  text-white` + the hardcoded colors — the clone's chip chrome already matched exactly.
  The counter is `flex items-center gap-1 text-gray-400 text-sm` + `lucide-users w-4 h-4`
  + `t.length` (= "2") and is **UNGATED** — live-measured `display: flex` at BOTH
  1440×900 AND 390×844.
- **RA-42 (decoded + live-verified) — the reference CANNOT create teams.** Both the header
  "Create Team" and the empty-state "Create Your First Team" buttons render with NO
  `onClick` (the decoded `Fe` button components carry only className + children); clicking
  either live produces ZERO `[role=dialog]` elements. No team-creation dialog exists in
  the bundle (no "Team Name"/"Invite Member"/"Team Description" strings). Dead chrome —
  the RA-28 dead-control family.
- **RA-43 (decoded) — the reference's team card chrome:** `bg-white rounded-xl border
  border-gray-200 p-6 hover:shadow-lg transition-all duration-300` (24px padding, no base
  shadow, no hover border-color change); the header row `flex items-start justify-between
  mb-4` carrying a `w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl`
  chip (Users `w-6 h-6` white — ALWAYS the fixed gradient; the card NEVER paints a team
  color) and a DEAD ellipsis button (`text-gray-400 hover:text-gray-600`, `w-5 h-5`, no
  onClick); the name BELOW the row at `h3 text-xl font-semibold text-gray-900 mb-2`
  (20px); the description `text-gray-500 text-sm mb-4 line-clamp-2`; a footer `flex
  items-center justify-between text-sm` whose left slot is the member COUNT (`flex
  items-center gap-2 text-gray-500` + Users `w-4 h-4` + `((members?.length)||0) +
  " members"` — ALWAYS plural, "1 members" is its own grammar bug) and whose right slot
  is a DEAD "Manage" ghost button (`text-blue-600 hover:text-blue-700`, no onClick).
  **NO member list, NO role labels, NO member avatars render anywhere on the card** —
  members exist only as a count.
- **RA-44 (decoded + live-measured) — the Teams page structure:** the page header sits in
  its own FULL-WIDTH BORDERED BAND (`border-b border-gray-200 bg-white`, live-measured
  113px tall) wrapping `max-w-7xl mx-auto px-6 py-6` — FLAT `px-6` at every viewport —
  with the row `flex flex-col md:flex-row justify-between items-start md:items-center
  gap-4` (h1 `text-3xl font-bold` live-measured 30px + the Create Team button
  live-measured 36px tall / 12px radius / 14px text / the standard `shadow` token); the
  grid container is SEPARATE: `max-w-7xl mx-auto px-6 py-8`. Loading state: SIX
  `bg-gray-100 rounded-xl h-48 animate-pulse` skeleton cards. Team fetch:
  `entities.Team.list("-updated_date")`.
- **R3 — mobile nav failure class A re-confirmed** at 390×844 (the **17th consecutive
  session**; evidence: `docs/screenshots/ref-audit-s36/ref-02-mobile-teams-390.png` — the
  desktop nav computes `display:none` and the reference's ONLY header button is the search
  toggle, whose `w-80` input itself computes width 0 at 390, its own responsive quirk).

### Clone findings

- **S37-1 (Low): the avatar stack's second chip titled "Collaborator"** — the reference's
  verbatim identity is "Sarah UI" (RA-41). The first chip renders the REAL user — the
  deliberate working superset over the reference's hardcoded "Alex Design" (the RA-40
  header-slot family), re-documented.
- **S37-2 (Low): the avatar counter was `hidden … sm:flex`** — `display: none` at
  390×844 — the reference's counter is ungated and visible at mobile (RA-41).
- **S37-3 (Medium): the Teams page merged header + grid in ONE `px-4 py-8 sm:px-6`
  container with an `mt-8` wrapper and NO band** — the reference renders the header in
  its own bordered band (flat `px-6 py-6`) and the grid in a separate `px-6 py-8`
  container (RA-44). The skeleton rendered 3 × `h-44` (the reference's is 6 × `h-48`).
- **S37-4 (Medium): the team card chrome diverged on seven sub-items** (RA-43): `p-5
  shadow-sm hover:border-gray-300 hover:shadow-md` vs `p-6 hover:shadow-lg duration-300`;
  the 40×40 SOLID `team.color` chip vs the 48×48 fixed blue→purple GRADIENT; the name
  `text-base` beside the chip vs `text-xl mb-2` below the row; the member count in the
  header at `text-xs` vs the footer at `text-sm` with the Users icon; the description
  `text-gray-600` vs `text-gray-500`.
- **S37-5 (docs): the dead-chrome ledger + the supersets.** The clone's CreateTeamDialog,
  Delete-confirm, Invite Member, and member LIST with role labels (`member.role ??
  member.email ?? "Member"` — this audit's original target, which has NO reference
  counterpart at all) are working supersets, now explicitly documented; the reference's
  always-plural "N members" grammar bug is not ported (the clone's proper singular stays,
  the RA-35 family); the team `color` field remains collected by the superset dialog but
  is no longer painted on the card.

## The remediation plan

`docs/remediation-plan-session37.md` — written and re-validated line-by-line against the
codebase before execution. Three slices: **Slice A** (the avatar-stack contract: the
"Sarah UI" title + the ungated counter), **Slice B** (the Teams header band + separate
flat-px-6 containers + the 6 × h-48 skeleton), **Slice C** (the team-card chrome port —
seven sub-items).

## The TDD execution

**RED (e2e):** 7/7 failed against the pre-fix build at their exact assertions — the avatar
title at `Expected: "Sarah UI", Received: "Collaborator"`, the mobile counter at
`Expected: "flex", Received: "none"`, the band pair at `Expected: true, Received: false`
(desktop AND mobile), the Create-Team shadow pin (see below), the card chrome at
`Expected: "24px", Received: "20px"`, and the skeleton at `Expected: 6`. (The member-list
superset guard passed by design — it pins working behavior.)

**The RED phase caught a wrong pin (the F28 lesson):** the Create-Team-shadow test
asserted `box-shadow: none` from the bundle decode alone — the decoded custom className
carries no shadow, but it MERGES onto the reference's Fe button base whose default
variant renders `shadow`. The pin failed against the clone's own already-correct
rendering; the live re-measure confirmed the reference's button DOES paint the standard
shadow token (`rgba(0,0,0,0.1) 0px 1px 3px 0px, …`). The pin was corrected to assert the
VISIBLE shadow layers, and the initial "drop the shadow" code change was REVERTED — the
wrong direction would have shipped a divergence in the name of parity.

**GREEN:** Slice A (the second chip's `title="Sarah UI"` + the counter ungated to `flex
items-center gap-1 text-sm text-gray-400`). Slice B (the bordered band with flat
`px-6 py-6`, the separate `px-6 py-8` grid container, the 6 × `h-48` skeleton, the
button shadow KEPT). Slice C (the card port: `p-6 hover:shadow-lg duration-300`, the
48px gradient chip, the `text-xl` name below the row, the footer count row, the
`text-gray-500` description).

Full gate green: **lint · typecheck · 92 unit (unchanged — every fix is DOM chrome) ·
build 20 routes · 28 smoke · 107 e2e (+8).**

## The live verification (dev server, post-fix)

- The avatar stack renders "D"/"Designer" (the real user) + "S"/"Sarah UI" on #10B981;
  the counter computes `display: flex` with text "2" at BOTH 1440×900 and 390×844.
- The Teams page: the band live-measures **113px tall** (the reference's exact number),
  the content container computes 24px padding at BOTH viewports, the card computes 24px
  padding with the 48px linear-gradient chip and the 20px name, and the footer count row
  renders "3 members" at 14px with the Users icon.
- The clone's mobile nav re-verified end-to-end at 390×844 (44×44 trigger, drawer with
  Dashboard/Recent/Teams, scroll-lock, tap-navigate-and-dismiss → `/Teams`, body overflow
  restored) — the Tailwind v4 failure class A remains NOT present in the clone.
- The seed re-run surfaced the exported-shell `DATABASE_URL` trap at a coarser grain: the
  tool-call shell RE-INHERITS the parent environment every invocation, so an `unset` from
  a previous command does not persist — unset and run in the SAME command (documented in
  AGENTS.md; the stale parent `.env` artifact disabled en route).

## Delivery

- The standard 16 screenshots re-captured from the remediated dev server (re-seeded
  first; the desktop set re-captured at 1440×900 after a viewport-trace audit caught the
  first pass rendering at 390) → `docs/screenshots/`; audit provenance →
  `docs/screenshots/ref-audit-s36/` (the reference's empty Teams page at 1440 and 390 —
  the R3 evidence — plus the search-toggle click and the clone's counter/mobile-menu
  verification shots).
- `.env.example` re-verified (unchanged — no new env vars this session); included in the
  commit.
- Docs aligned: PAD v1.20.0 (revision block + §7.1 table + §7.4 checklist + key-files
  rows), AGENTS.md (the avatar-stack + Teams bullets + the gate counts + the environment
  trap nuance), CLAUDE.md (ditto), README.md (the Teams/editor-chrome rows + the e2e
  row), digma_SKILL v1.19.0 (lesson **F28** — a decoded custom className merges onto the
  component's base classes: decode reads intent, live-verify the render before pinning,
  and treat a RED failure against believed-correct code as the pin's own audit; a page
  whose controls are all dead has no reference BEHAVIOR to port — audit it as
  chrome-plus-superset territory), the plan's execution status, this log, and the worklog
  Task 42 entry.
- Full gate re-verified green before the commit; pushed to `main` via
  `docs/ssh_git_wrapper_v3.py` (the key shredded after).
