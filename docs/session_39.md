# Session 39 — The Sixteenth Parity Audit: Bundle-Decoded Contracts (S35-1 + S35-2 + S35-3 + S35-5 + S35-6)

**Date:** 2026-09-30 · **Code state at start:** `a927a7f` (session 33 delivered; transcript
push = `docs/session_38.md`) · **Code state at end:** this commit · **Docs:** PAD v1.19.0 ·
digma_SKILL v1.18.0 (lesson F27)

## Directive

The session-37 next-steps list pointed at the reference's Quick Stats computation and its
AI-panel input details — two seams seventeen sessions of audits had read only as rendered
output, never as COMPUTED values. The standing sweep (mobile nav, general parity) ran as usual.

## The audit (sixteenth consecutive)

**Baseline before any change:** workspace refreshed (`git pull` — fast-forward to `a927a7f`,
bringing in the operator's `docs/session_38.md` transcript push), `.env` verified with
`DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root (re-seeded → 1 user / 2 projects /
6 elements / 1 team / 3 members), dev server healthy with the DB anchor logged. Fast gates
green: lint · typecheck · 88/88 unit. Configs verified: vitest (88) + playwright (96), both
excluding `skills/`. The session-33 fixes (dynamic corner max, font fallback chain, bg
persistence) verified in place.

**The method extension:** observation could not discriminate the target formulas — both seeded
projects were created AND updated AND opened within the 7-day window, so every candidate
"Active this week" formula rendered the same number, and the greeting's buckets could not be
separated without waiting for the clock. The audit therefore READ THE REFERENCE'S SHIPPED
CLIENT BUNDLE: `assets/index-CFEZghM7.js` fetched (621 KB) and grepped at each render-site
string, decoding every formula verbatim from the reference's own source.

### Reference findings (live-measured + bundle-decoded; desktop 1440×900, mobile 390×844, tablet 768×900)

- **RA-31 — the reference's Quick Stats LIVE-UPDATE without reload** — verified
  bidirectionally: creating a probe project moved the card 1→2 Projects / 1→2 Active this week
  (no reload); deleting it moved them back. The reference computes the stats CLIENT-SIDE from
  its entity lists (`GET /entities/Project?sort=-last_accessed` + `GET /entities/Team?sort=-
  updated_date` — no stats endpoint exists).
- **RA-37 (decisive, bundle-decoded) — "Active this week" counts projects whose
  `last_accessed || created_date` falls within the last 7 days** — ACCESS-based, not
  edit-based. Decoded verbatim: `e.filter(D=>{const W=new Date(D.last_accessed||
  D.created_date),K=new Date;return K.setDate(K.getDate()-7),W>K}).length`.
- **RA-38 (bundle-decoded) — the greeting's time buckets are `<12 morning · <17 afternoon ·
  else evening`** — `D<12?"Good morning":D<17?"Good afternoon":"Good evening"`.
- **RA-39 (bundle-decoded) — the greeting renders `full_name?.split(" ")[0] || "Designer"`**
  — the FIRST WORD of the account's full name, with "Designer" as the fallback (an account
  "Jane Doe" is greeted "Jane"; the live reference account greets "sepnetflix2023").
- **RA-40 (bundle-decoded) — the reference's header name slot is the STATIC literal
  "Designer"** — `children:"Designer"` in its JSX; never the account's name (unwired
  placeholder chrome, the RA-28 dead-control family). The clone's real-name slot is the
  deliberate working superset — the DOCS' "name/plan" parity claim was corrected this session.
- **RA-32 — the reference's AI send button disables when the input is empty, enables with
  content** (measured both states; clone parity confirmed).
- **RA-33 — the reference's "Try: …" suggestions line renders UNCONDITIONALLY** — it persisted
  after the first send AND the second, with the replies rendered (double-measured, F18). The
  reply chrome re-confirmed: "Working on it…" while processing (RA-34), then the
  claimed-success theater footer ("I am clearing the canvas for you by deleting all existing
  elements." + "1 action(s) performed" + Revert — over an EMPTY canvas).
- **RA-35 — the reference's project-card THUMBNAIL renders LINE elements WITH the 2px white
  box border plus a clipped negative-coordinate SVG diagonal** — while its CANVAS renders
  lines border-0 + SVG only (session 29, RA-8): the reference's own thumbnail leaks the
  border-from-stroke style chain across render sites. The clone's coherent border-0 line stays
  (documented deliberate superset). The thumbnail also confirmed: the frame renders border-only
  without the label (RA-19 again), the card is a LIVE DOM re-render (the entity's `thumbnail`
  unsplash URL field is unused by the card), and the frame wrapper is
  `aspect-[16/10] bg-gradient-to-br from-blue-50 to-purple-50`.
- **RA-36 — the reference's dashboard hero renders FLAT at every viewport** (measured at
  390×844 and 768×900): h1 `text-4xl` (36px) with `text-align: start` (LEFT-aligned,
  wrapping), paragraph `text-lg` (18px), containers `max-w-7xl mx-auto px-6 py-12`
  (24px/48px), text block plain `flex-1`, buttons row `flex flex-col sm:flex-row gap-4`
  computing `justify-content: normal` (LEFT at sm), stats wrapper `flex-1 max-w-sm` rendering
  content-width 250px at mobile.
- **R3 — mobile nav failure class A re-confirmed** at 390×844 (the **16th consecutive
  session**; evidence: `docs/screenshots/ref-audit-s34/ref-03-mobile-hero-390.png`).
- The reference's project board left pristine (the probe project deleted through its own
  native-confirm flow — RA-16 re-verified live en route).

### Clone findings

- **S35-1 (Medium): the Quick Stats "Active this week" count was EDIT-based (`updatedAt ≥
  now−7d`)** — the reference's is ACCESS-based (RA-37). A latent contract divergence invisible
  on fresh seed data (the F26 boundary lesson generalized to TIME).
- **S35-2 (Medium): the greeting's afternoon boundary was 18:00** — the reference's is 17:00
  (RA-38). The 17:00–17:59 hour diverged, and the unit test PINNED the wrong boundary.
- **S35-3 (Low): the greeting rendered the full `user.name`** — the reference renders the
  first word with the "Designer" fallback (RA-39).
- **S35-4 (Low, docs): the header's name slot renders `{user.name}`** — the reference's slot
  is the static literal "Designer" (RA-40). The clone's real-name rendering stays (the working
  superset); the docs' inaccurate "name/plan" parity claim corrected.
- **S35-5 (Medium): the AI "Try: …" line was hidden after the first user message** — the
  reference renders it ALWAYS (RA-33). The clone's gate rested on a stale justification
  ("the reference's post-send DOM is unmeasurable") that session 27's reply measurements had
  already dissolved — the clone had been diverging behind a dissolved excuse.
- **S35-6 (Medium): the dashboard hero responsive-ized chrome the reference renders FLAT**
  — seven sub-items (h1 30px→36px, paragraph 16px→18px centered→left, containers 16/32px→
  24/48px, text block centered→left, buttons row centered-at-sm→left, stats wrapper
  full-width→content-width at mobile, lower container likewise); all desktop-neutral.
- Verified correct (no change): the AI input's chrome and disabled-when-empty send button
  (RA-32), the "Working on it…" indicator (RA-34), the Create-button icon computing 16px in
  both apps (`[&_svg]:size-4` wins over `w-5 h-5` in both — F25: computed paint, not
  classes), the Quick Stats card chrome, the stats live-update via route remount (RA-31),
  the thumbnail's live-render approach, and the mobile nav end-to-end at 390×844 (44×44
  trigger, drawer, scroll-lock, tap-navigate-and-dismiss → `/Teams`, body overflow restored —
  the Tailwind v4 failure class A NOT present in the clone).

## The remediation plan

`docs/remediation-plan-session35.md` — written and re-validated line-by-line against the
codebase before execution. Four slices: **Slice A** (the greeting contract: the 17:00 boundary
+ the `greetingName` helper), **Slice B** (the access-based stats formula + the e2e
backdate discriminator), **Slice C** (the unconditional Try line), **Slice D** (the flat hero
chrome — seven class changes).

## The TDD execution

**RED (unit):** 5/5 failed at their exact points — the corrected boundary pin at
`expected 'Good afternoon' to be 'Good evening'` (17:00), and the four `greetingName`
tests at `TypeError: greetingName is not a function`.

**RED (e2e):** 4/4 failed against the pre-fix build at their exact assertions — the stats
discriminator at `Expected: 1, Received: 2` (the edit-based count included the backdated
project), the sm buttons row at `Expected: "normal", Received: "center"`, the flat mobile
hero at `Expected: "36px", Received: "30px"`, and the post-send Try line at
`element(s) not found`.

**GREEN:** Slice A (`greetingFor` switches at 17:00; `greetingName(fullName)` →
`fullName?.trim().split(/\s+/)[0] || "Designer"` feeding the h1). Slice B (the stats route
counts `lastOpenedAt ≥ now−7d` — the clone's `last_accessed` analog, always set; the e2e
global setup runs `tests/e2e/backdate-portfolio.ts`, backdating the Portfolio seed project's
`lastOpenedAt` 11 days so the pin discriminates; the parity spec derives its expected tally
from `/api/projects` — order-independent). Slice C (the `messages.every(...)` gate deleted —
the line renders unconditionally). Slice D (the seven flat classes ported).

Full gate green: **lint · typecheck · 92 unit (+4) · build 20 routes · 28 smoke · 99 e2e
(+3, plus the post-send Try-line assertion folded into the no-crash AI test).**

## The live verification (dev server, post-fix)

- The greeting renders "Good morning, Designer ✨" through `greetingName` (the demo account's
  single word — the first-word contract is unit-pinned for multi-word names).
- The h1 computes 36px / `text-align: start` at 390×844 (was 30px centered); the paragraph
  18px; the container padding 24px; the stats card content-width 239px (was 358px full-width).
- At 768×900 the buttons row computes `justify-content: normal` with the Create button at the
  row's left edge (was centered); at 1440×900 the desktop rendering is unchanged (36px / 384px
  capped card / left row).
- The AI panel: sent "add 2 blue squares" → the reply rendered ("Added 2 blue squares" + "2
  action(s) performed" + Revert) AND the "Try: …" line stayed visible post-send; the canvas
  restored (undo + autosave verified; 6 elements, frame scale 1 / rotation 0).
- The stats API: 2 Projects / 1 Teams / 2 Active this week on the dev seed (both projects
  recently opened — matching the access-based tally derived from the projects list).
- The clone's mobile nav re-verified end-to-end at 390×844 (trigger, drawer, scroll-lock,
  tap-navigate-and-dismiss → `/Teams`, body overflow restored).

## Delivery

- The standard 16 screenshots re-captured from the remediated dev server (re-seeded first) →
  `docs/screenshots/`; audit provenance → `docs/screenshots/ref-audit-s34/` (the reference's
  16th-audit dashboard, its thumbnail cards with the bordered line boxes, its mobile hero at
  390 — the R3 evidence, its post-send Try line, and the crop pair for the line-border
  evidence).
- `.env.example` re-verified (unchanged — no new env vars this session); included in the
  commit.
- Docs aligned: PAD v1.19.0 (revision block + §7.1 table + §7.4 checklist + the key-files
  rows), AGENTS.md (the dashboard-contracts bullet + the AI-line re-measure + counts),
  CLAUDE.md (ditto), README.md (the Dashboard/AI feature rows + counts), digma_SKILL v1.18.0
  (lesson **F27** — when observation cannot discriminate a formula, read the shipped bundle;
  re-audit every "unmeasurable" justification once its blocking condition dissolves; and
  chrome measured at one viewport does not generalize — measure computed styles at each
  viewport tier), the plan's execution status, this log, and the worklog Task 41 entry.
- Full gate re-verified green before the commit; pushed to `main` via
  `docs/ssh_git_wrapper_v3.py` (the key shredded after).
