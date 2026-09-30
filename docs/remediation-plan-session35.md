# Digma — Session 35 Remediation Plan (v1.19.0 target)

**Date:** 2026-09-30 · **Input:** sixteenth live parity audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-33 code @ `a927a7f`, clean re-seeded DB), desktop
1440×900 + mobile 390×844 + tablet 768×900, DOM/computed-style level + **functional interaction
testing** + **client-bundle decoding** (the session-37 next-steps directive: the reference's
Quick Stats computation and its AI-panel input details, plus the standing mobile-nav sweep).
**Method:** every finding below was verified live in the reference's DOM (or decoded from its
shipped JS bundle — `assets/index-CFEZghM7.js`, fetched and grepped this session) AND functionally
in the clone's DOM before entering this plan; the plan was re-validated line-by-line against the
codebase before execution.

---

## Context

Session 33 (commit `f874a3d` + the transcript push `a927a7f`, PAD v1.18.0) closed the dynamic
panel contracts (the corner-radius max, the default font's fallback chain, the background-color
persistence). This session executed the session-37 next-steps directive: **the reference's
Quick Stats computation and its AI-panel input details** — two seams that seventeen sessions of
audits had read only as rendered output, never as COMPUTED values.

The method extended this session: where observation could not discriminate a formula (both
seeded projects were created AND updated AND opened within the 7-day window — every candidate
formula yields the same number), the audit **read the reference's shipped client bundle** —
fetching `assets/index-CFEZghM7.js` and grepping the render sites — which decoded every formula
exactly (lesson F27: when observation cannot discriminate, read the shipped code; the bundle is
the reference's own source of truth).

The baseline fast gates were re-run green BEFORE any change: lint ✅ · typecheck ✅ · 88/88
unit ✅ (the full gate — build/smoke/e2e — re-verified after the changes). Dev server healthy
with the DB anchored at the repo root. Test suites verified present: vitest (88 checks) +
playwright (96 checks), both excluding `skills/`. `.env` carries
`DATABASE_URL="file:../db/custom.db"` with the `db/` folder at the repo root (re-seeded this
session — 1 user / 2 projects / 6 elements / 1 team / 3 members).

### What the sweep found in the REFERENCE (live-measured / bundle-decoded this session)

- **RA-31 — the reference's Quick Stats LIVE-UPDATE without reload** — verified
  bidirectionally: after creating a probe project the card read 2 Projects / 2 Active this week
  (no reload), and after deleting it the card read 1 / 1 again. The reference computes the stats
  CLIENT-SIDE from its entity lists (`GET /entities/Project?sort=-last_accessed` +
  `GET /entities/Team?sort=-updated_date` — no stats endpoint exists; the numbers are
  `projects.length` / `teams.length` / a filter over the project list).
- **RA-37 (bundle-decoded, decisive) — the reference's "Active this week" formula is
  ACCESS-based:** `project.last_accessed || project.created_date > now − 7d` — decoded verbatim
  from its bundle: `e.filter(D=>{const W=new Date(D.last_accessed||D.created_date),K=new
  Date;return K.setDate(K.getDate()-7),W>K}).length`. NOT edit-based: a project edited 8+ days
  ago but OPENED today counts as active on the reference.
- **RA-38 (bundle-decoded) — the reference's greeting time buckets are `<12 morning ·
  <17 afternoon · else evening`** — `D<12?"Good morning":D<17?"Good afternoon":"Good evening"`.
- **RA-39 (bundle-decoded) — the reference's greeting renders the FIRST WORD of the user's
  full name with a "Designer" fallback:** `full_name?.split(" ")[0] || "Designer"` — an account
  "Jane Doe" is greeted as "Jane".
- **RA-40 (bundle-decoded) — the reference's header name slot is the STATIC LITERAL
  "Designer"** — `children:"Designer"` in its JSX, never the account's name (the greeting below
  uses the real name; the header slot is unwired placeholder chrome, the same bug family as its
  dead Background Color control, RA-28).
- **RA-32 — the reference's AI send button DISABLES when the input is empty and enables with
  content** (measured both states live).
- **RA-33 — the reference's "Try: …" suggestions line renders UNCONDITIONALLY** — it persists
  after the first send AND after the second (double-measured, F18) with the reply rendered.
  The clone's "initial state only" gating rests on a stale justification ("the reference's
  post-send DOM is unmeasurable") that session 27's reply measurements already dissolved.
- **RA-34 — the reference renders a "Working on it…" indicator while the AI is processing**
  (textual parity with the clone's existing indicator confirmed live); its replies remain
  claim theater ("I am clearing the canvas for you by deleting all existing elements." +
  "1 action(s) performed" over an EMPTY canvas).
- **RA-35 — the reference's project-card THUMBNAIL renders LINE elements WITH the 2px white
  box border** (plus a clipped negative-coordinate SVG diagonal) — while its CANVAS renders
  lines border-0 + SVG only (session 29, RA-8). The reference's own thumbnail leaks the
  border-from-stroke style chain across element types — the exact S29-1 bug class the clone
  fixed at every render site. The thumbnail also confirmed: the frame renders border-only
  WITHOUT the label (RA-19 ✓ again), the card renders a LIVE DOM re-render of the canvas (the
  entity's `thumbnail` unsplash URL field is UNUSED by the card), and the frame wrapper carries
  `aspect-[16/10] bg-gradient-to-br from-blue-50 to-purple-50`.
- **RA-36 — the reference's dashboard hero renders FLAT at every viewport** (measured at
  390×844): h1 `text-4xl` = **36px**, paragraph `text-lg` = **18px**, containers
  `max-w-7xl mx-auto px-6 py-12` = **24px/48px padding**, text block plain `flex-1` with
  `text-align: start` (LEFT-aligned, wrapping to 2 lines), the buttons row
  `flex flex-col sm:flex-row gap-4` computing `justify-content: normal` (LEFT at sm, measured
  at 768×900), and the stats wrapper `flex-1 max-w-sm` rendering **content-width 250px** at
  mobile (not full-width).
- **R3 — the reference's mobile nav still ships failure class A** at 390×844 (nav
  `display: none`, NO hamburger — the **sixteenth consecutive session**; evidence:
  `docs/screenshots/ref-audit-s34/ref-03-mobile-hero-390.png`).

### What the sweep VERIFIED CORRECT in the clone (no change — parity or the working superset)

- The AI input's chrome (h-8 text-xs, `p-3 border-t` wrapper, `flex gap-2` form, blue-600 send
  with the lucide-send w-3 h-3), the disabled-when-empty send button (RA-32), the "Working on
  it…" indicator (RA-34), and the "Try: …" line's classes/text (RA-33's chrome).
- The Quick Stats card's chrome (identical utilities — the reference's `text-md` heading class
  is a no-op in its CDN Tailwind, computing to the same 16px as the clone's `text-base`).
- The Create-button's leading Plus icon COMPUTES to 16px in BOTH apps (each Button's
  `[&_svg]:size-4` override wins over the icon's own `w-5 h-5` — F25: computed paint, not
  classes).
- The stats live-update behavior (RA-31 parity via route remount — every dashboard visit
  re-fetches `/api/stats`).
- The clone's mobile navigation works end-to-end at 390×844 (re-verified live this session:
  44×44 trigger, drawer with all three links, scroll-lock while open, tap-navigate-AND-dismiss
  → `/Teams` + sheet gone, body overflow restored). **The Tailwind v4 mobile-nav bug (failure
  class A) is NOT present in the clone.**
- The clone's thumbnail: live DOM re-render with the project background color, the
  `aspect-[16/10]` frame, and the coherent border-0 line (the deliberate superset over RA-35's
  reference-side leak).

### Findings (all verified live in both apps; the clone with functional/computed proof)

| # | Finding | Severity |
|---|---------|----------|
| S35-1 | **The clone's Quick Stats "Active this week" is EDIT-based (`updatedAt ≥ now−7d`) — the reference's is ACCESS-based (`last_accessed \|\| created_date > now−7d`, RA-37).** A project edited 8+ days ago but opened today counts as active on the reference and NOT on the clone (the inverse: edited today but unopened for 8+ days counts on the clone and not on the reference). The clone's `Project.lastOpenedAt` is its `last_accessed` analog (touched by the open flow) and is always set (`@default(now())`), so the reference's created-fallback is structurally satisfied. The seed's two fixed dates (Sep 26 / Sep 25 lastOpenedAt) sit inside the window today, so the divergence is invisible on fresh seed data — a LATENT contract divergence (the F26 element-size lesson generalized: a formula pinned on data that never exercises its boundary is unpinned). | **Medium** |
| S35-2 | **The clone's greeting afternoon boundary is 18:00 — the reference's is 17:00 (RA-38).** Every hour from 17:00–17:59 renders "Good afternoon" on the clone and "Good evening" on the reference. The existing unit test PINS the wrong boundary (`17:59 → "Good afternoon"`) — a historical measurement taken on hours that never discriminated the boundary. | **Medium** |
| S35-3 | **The clone's greeting renders the full `user.name` — the reference renders the first word with a "Designer" fallback (RA-39).** A user "Jane Doe" is greeted "Jane" on the reference and "Jane Doe" on the clone. (Invisible on the demo account — the seed's user is the single word "Designer".) | **Low** |
| S35-4 | **The clone's header name slot renders `{user.name}` — the reference renders the static literal "Designer" (RA-40).** The reference's slot is unwired placeholder chrome (its own greeting uses the real name); the clone's real-name rendering is the deliberate WORKING SUPERSET (the eye/zoom/bg-control family) and stays — but the docs currently claim "avatar + name/plan" parity, which is INACCURATE: the measured reference renders a static label. The fix is documentary: record the measured literal and mark the superset. | **Low (docs)** |
| S35-5 | **The clone's AI "Try: …" suggestions line hides after the first user message — the reference renders it ALWAYS (RA-33, double-measured).** The clone's gating condition (`messages.every(m => m.role !== "user")`) rests on a stale justification — "the reference's post-send DOM is unmeurable (its assistant crashes on submission)" — that session 27's live reply measurements already dissolved (its deletes answer with theater; its ADDS crash, its other commands reply). The line's post-send persistence is directly measurable and measured. | **Medium** |
| S35-6 | **The clone's dashboard hero responsive-izes chrome the reference renders FLAT (RA-36):** (a) hero container `px-4 py-8 sm:px-6 sm:py-12` vs the reference's `px-6 py-12` (16/32px vs 24/48px at mobile); (b) text block `flex-1 text-center lg:text-left` vs plain `flex-1` (the reference's mobile hero text is LEFT-aligned, measured `text-align: start`); (c) h1 `text-3xl sm:text-4xl` vs `text-4xl` (30px vs 36px at mobile); (d) paragraph `text-base sm:text-lg` + `mx-auto lg:mx-0` vs `text-lg` flat (16px vs 18px, centered vs left); (e) buttons row `justify-center … lg:justify-start` vs `flex flex-col gap-4 sm:flex-row` (the clone CENTERS the buttons at the sm breakpoint — measured `justify-content: center` at 768px — where the reference computes `normal`/left); (f) stats wrapper `w-full flex-1 sm:max-w-sm` vs `flex-1 max-w-sm` (the clone's card is FULL-WIDTH 358px at mobile vs the reference's content-width 250px); (g) the lower container `px-4 py-8 sm:px-6 sm:py-12` vs `px-6 py-12`. Desktop rendering is unchanged by every sub-item (the responsive variants only diverge below sm/lg). | **Medium (mobile/sm visual)** |

**Deliberate superset notes (no change):** the clone's real-name header slot stays (S35-4 —
documented honestly); the clone's border-0 thumbnail line stays (RA-35 — the reference's own
style-chain leak, the S29-1 bug class, is not ported back); the clone's honest AI replies, working
controls, and mobile navigation all stay.

---

## P1 — Code changes (TDD, four coherent slices)

### Slice A — S35-2 + S35-3: the greeting contract (bundle-decoded)

**Files:** `src/lib/greeting.ts`, `src/lib/greeting.test.ts`,
`src/components/dashboard-view.tsx`.

1. **The boundary** (`src/lib/greeting.ts`): `if (hour < 17) return "Good afternoon";` — the
   reference's decoded `D<17` (RA-38). Update the file's header comment (switches at 12:00 and
   **17:00**).
2. **The name helper** (`src/lib/greeting.ts`): export
   `greetingName(fullName?: string | null): string` returning
   `fullName?.trim().split(/\s+/)[0] || "Designer"` — the reference's decoded
   `full_name?.split(" ")[0] || "Designer"` (RA-39), hardened against whitespace-only names.
3. **The render** (`src/components/dashboard-view.tsx`): the h1 greeting becomes
   `{greeting}, {greetingName(user.name)} ✨` (the combinator stays `greetingFor()`).

### Slice B — S35-1: the access-based stats formula (bundle-decoded)

**Files:** `src/app/api/stats/route.ts`, `tests/e2e/backdate-portfolio.ts` (NEW),
`tests/e2e/global-setup.ts`, `tests/e2e/parity.spec.ts`.

4. **The formula** (`src/app/api/stats/route.ts`): `activeThisWeek` counts
   `db.project.count({ where: { lastOpenedAt: { gte: weekAgo } } })` — the clone's
   `last_accessed` analog (RA-37). `lastOpenedAt` is always set (`@default(now())`), so the
   reference's `|| created_date` fallback is structurally satisfied. The route's comment gains
   the decoded reference formula.
5. **The e2e discriminator** (`tests/e2e/backdate-portfolio.ts` + `global-setup.ts`): the
   global setup gains a post-seed step that backdates the "Portfolio Website Redesign" seed
   project's `lastOpenedAt` to **now − 11 days** (Prisma's `@updatedAt` bumps `updatedAt` to
   now on that write — producing EXACTLY the discriminating state: recently-updated,
   long-unopened). No existing spec asserts Portfolio or the Recent-page order (verified), so
   the state change is safe; the dev seed is untouched (e2e-only).
6. **The e2e pin** (`tests/e2e/parity.spec.ts`, a new session-35 describe):
   "the Quick Stats card counts ACCESS-based activity (RA-37)" — fetch `/api/projects` and
   `/api/stats` through the page; assert `stats.activeThisWeek === projects.filter(p =>
   new Date(p.lastOpenedAt) > now−7d).length`. The assertion is ORDER-INDEPENDENT (it derives
   the expected tally from the fetched list, so later specs' created projects cannot break it).
   Pre-fix: the edit-based count includes the backdated project → 2 ≠ 1 → RED.

### Slice C — S35-5: the unconditional "Try: …" line

**Files:** `src/components/editor/ai-assistant.tsx`, `tests/e2e/workspace.spec.ts`.

7. **The render** (`ai-assistant.tsx`): delete the
   `messages.every((message) => message.role !== "user")` gate — the `<p className="mt-1
   text-xs text-gray-500">` line renders unconditionally (RA-33). The comment block is
   rewritten: the line is ALWAYS rendered (double-measured on the reference post-send,
   session 35); the historical "initial state only" note records the stale-justification lesson.
8. **The e2e pin** (`workspace.spec.ts`, the existing no-crash AI test): after the reply
   arrives and the canvas grows, assert the Try: line is STILL visible
   (`await expect(page.getByText(/^Try:/)).toBeVisible()`). Pre-fix: the gate hides it after
   the first send → RED.

### Slice D — S35-6: the flat hero chrome

**Files:** `src/components/dashboard-view.tsx`, `tests/e2e/parity.spec.ts`.

9. **The classes** (`dashboard-view.tsx`, the seven measured sub-items — desktop-neutral,
   mobile/sm-aligning):
   - hero container: `mx-auto max-w-7xl px-6 py-12`
   - text block: `flex-1` (drop `text-center lg:text-left`)
   - h1: `mb-3 text-4xl font-bold`
   - paragraph: `mb-6 max-w-xl text-lg text-purple-100`
   - buttons row: `flex flex-col gap-4 sm:flex-row`
   - stats wrapper: `flex-1 max-w-sm` (drop `w-full` + `sm:`)
   - lower container: `mx-auto max-w-7xl px-6 py-12`
10. **The e2e pin** (`parity.spec.ts`, the session-35 describe with
    `test.use({ viewport: { width: 390, height: 844 } })`): the h1 computes `font-size:
    36px` AND `text-align: start` (left-aligned, RA-36); the hero container's computed
    `padding-left` is `24px`; the stats card's width is its CONTENT width (< 340px, not
    full-width). Plus a second test at 768×900: the Create New Design button's row computes
    `justify-content: normal` (left-aligned at sm). Pre-fix: 30px/center/16px/358px/center →
    RED at each assertion.

### Tests (RED first)

- **Unit** — `src/lib/greeting.test.ts`:
  - CORRECTED boundary pins: `17:00 → "Good evening"` (was afternoon — the wrong-contract pin),
    `16:59 → "Good afternoon"` (the new boundary's lower edge); `18:00`/`23:59` evening and
    `12:00` afternoon pins unchanged (they were already right); `11:59`/`00:01` morning pins
    unchanged.
  - NEW `greetingName` describe: `"Jane Doe" → "Jane"`; `"Designer" → "Designer"`;
    `"" → "Designer"`; `undefined → "Designer"`; `"  Jane Doe  " → "Jane"` (trim-hardened).
- **E2E** — `tests/e2e/parity.spec.ts` (session-35 describe) + `workspace.spec.ts` (the
  post-send Try-line assertion): the three tests above (stats discriminator, hero flat chrome
  at 390 + 768, Try-line post-send).

## P2 — Documentation alignment (post-fix)

- **PAD → v1.19.0:** new revision block (the S35-1…S35-6 findings + the reference-side
  RA-31…RA-40/R3 measurements + the sixteenth-audit record + the bundle-decode method); the
  dashboard section's greeting contract (17:00 boundary + first-word name + the "Designer"
  fallback) and the stats contract (access-based, the decoded formula); the hero's flat-chrome
  record; the header-slot honesty note (the reference's static "Designer" vs the clone's
  real-name superset); the AI-panel suggestions-line contract (unconditional); §7.1/§7.4 counts
  refreshed.
- **AGENTS.md:** the greeting/stats/hero facts + the header-slot superset record + the counts.
- **CLAUDE.md:** ditto (the architecture-facts paragraph + the env/test counts).
- **README.md:** the dashboard feature row (access-based Quick Stats + the first-word greeting)
  + the AI panel row (the always-on suggestions line) + the counts.
- **digma_SKILL.md → v1.18.0:** lesson **F27** (when observation cannot discriminate a formula,
  READ THE SHIPPED BUNDLE — fetch the JS, grep the render site, decode the exact expression;
  the reference's own code is the ground truth its DOM only samples. Corollaries: a stale
  justification ("unmeasurable") must be re-audited once its blocking condition dissolves —
  session 27 dissolved the AI-crash blocker and session 35 found the Try-line contract had
  flipped; and chrome measured at ONE viewport does not generalize — flat vs responsive classes
  are a parity dimension, so measure COMPUTED styles at EACH breakpoint) + the §5/§6 rows + the
  counts.
- `docs/remediation-plan-session35.md` (this plan + execution status) +
  `docs/session_39.md` (this session's structured log) + the worklog Task 41 entry.

## P3 — Delivery

- Screenshots: re-capture the standard set from the remediated dev server (re-seeded first)
  → `docs/screenshots/`; audit provenance → `docs/screenshots/ref-audit-s34/` (the reference's
  16th-audit dashboard, its thumbnail cards with the bordered line boxes, its mobile hero at
  390, its post-send Try line; the crop pair as the line-border evidence).
- `.env.example`: re-verify against the codebase (unchanged this session — no new env vars) —
  included in the commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …`.
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build →
  ./scripts/smoke-test.sh → test:e2e` — all green before push.
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- The clone's real-name header slot (S35-4 stays a documented superset — the reference's
  static "Designer" literal is unwired placeholder chrome, not a contract to port).
- The clone's border-0 thumbnail line (RA-35 — the reference's own style-chain leak is
  deliberately not ported back into any render site).
- The clone's honest AI replies + working Revert (the reference's claim theater stays
  un-ported), its mobile navigation (re-verified end-to-end), its stats CLIENT contract
  (route-based vs the reference's client-side computation — same visible numbers, the
  clone's /api/stats architecture stays), and every standing decision from sessions 1–33.
- The dev seed's dates (the backdate is e2e-only, in the e2e DB).
- The historical PAD revision blocks (the v1.x "18:00 boundary" record stays as history; the
  new block documents the re-measure).

---

## Execution status (end of session 35)

**All items EXECUTED and GREEN.** RED first (the exact captured assertions): the unit layer
failed 5/5 at their exact points — the corrected boundary pin at `expected 'Good afternoon'
to be 'Good evening'` (the 17:00 hour), and the four `greetingName` tests at `TypeError:
greetingName is not a function` (the helper did not exist yet). The e2e layer failed 4/4
against the pre-fix build at their exact assertions — the stats discriminator at
`Expected: 1, Received: 2` (the edit-based count included the 11-day-backdated project), the
sm buttons row at `Expected: "normal", Received: "center"`, the flat mobile hero at
`Expected: "36px", Received: "30px"`, and the post-send Try line at `element(s) not found`
(the gate hid it). Then GREEN (Slice A: the 17:00 boundary + `greetingName` feeding the h1;
Slice B: `lastOpenedAt ≥ weekAgo` in the stats route + the backdate-portfolio e2e seed
amendment + the order-independent discriminator pin; Slice C: the gate deleted, the line
unconditional; Slice D: the seven flat hero classes). Full gate green: **92 unit (+4) / 28
smoke / 99 e2e (+3, plus the post-send Try-line assertion folded into the no-crash AI
test)**.

**Live verification (dev server, post-fix):** the greeting renders through `greetingName`
("Good morning, Designer ✨" — the demo account's single word; the multi-word contract is
unit-pinned); the h1 computes 36px / `text-align: start` at 390×844 (was 30px centered), the
paragraph 18px, the container padding 24px, the stats card content-width 239px (was 358px
full-width); at 768×900 the buttons row computes `justify-content: normal` with the Create
button at the row's left edge (was centered); at 1440×900 the desktop rendering is unchanged
(36px h1 / 384px capped card / left-aligned row); the AI flow (send "add 2 blue squares" →
reply + honest footer + the Try line STILL visible post-send) verified live with the canvas
restored afterward (6 elements, frame scale 1 / rotation 0 — undo + autosave).

**The audit's standing sweeps:** the reference's mobile nav re-confirmed failure class A at
390×844 (the 16th consecutive session; evidence `docs/screenshots/ref-audit-s34/`); the
clone's mobile nav re-verified end-to-end (44×44 trigger, drawer, scroll-lock,
tap-navigate-and-dismiss, body overflow restored) — the Tailwind v4 failure class A remains
NOT present in the clone. The reference's project board left pristine (the probe project
deleted through its own native-confirm flow, RA-16 re-verified en route).
