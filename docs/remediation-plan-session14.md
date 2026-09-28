# Digma — Session 14 Remediation Plan (v1.8.0 target)

**Date:** 2026-09-29 · **Input:** live parity re-audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-12 code @ `b2adf19`), all pages at
1440×900 and 390×844, DOM/computed-style level (post-hydration, 4–10 s settles)
+ VLM screenshot cross-checks + reference-screenshot forensics. **Method:** every
finding below was verified in both apps' DOM before entering this plan, and the
plan was re-validated line-by-line against the codebase before execution.

---

## Context

Session 12 (commit `0a9385e` + `b2adf19`, PAD v1.7.0) corrected the nav-pill
route scope (exact pathname match, no pill at `/`), migrated
`middleware.ts` → `proxy.ts` (characterization pin first), and realigned the
docs. This session re-audited the reference with fresh eyes (the fifth
consecutive live audit) with particular attention to the mobile navigation
menu (per operator instruction) and Tailwind v4 health. The baseline full
gate was re-run green BEFORE any change: lint ✅ · typecheck ✅ · 72/72 unit ✅
· build 20 routes ✅ · 28/28 smoke ✅ · 54/54 e2e ✅.

### The headline find — session 8's "no suggestions line" reading was incomplete

The reference's AI Assistant panel renders a suggestions line under the input
row. Measured settled this session (DOM, both states — fresh editor and
project editor):

```
<div class="p-3 border-t border-[#30363d]">          ← wrapper DIV (border + padding)
  <form class="flex gap-2">                          ← h-8 input + 32×32 blue-600 send
  <div class="mt-1 text-xs text-gray-500">
    Try: "Add 3 colored circles", "Make selected elements red", "Create a login form"
  </div>
</div>
```

Session 8's R8 fix restructured the clone's input to the reference's
`flex gap-2` form + separate blue send button (correct) but REMOVED the
clone's "Try:" line entirely — recording "no suggestions line" as the
reference fact. The evidence that this was a misread:

1. **The live reference DOM renders it today** (measured this session, two
   editor states, settled 5–6 s).
2. **The session-10 and session-12 reference screenshots show it** (VLM
   forensics on `docs/screenshots/ref-audit-s12/ref-04-editor.png` reads the
   exact line back).
3. **`digma_SKILL.md` §6 still documents it as UI parity** ("`Try: "Add 3
   colored circles", …` examples line") — the code drifted from the project's
   own deepest reference doc.

This mirrors the session-10 R2 reversal (the "no nav pill" misread): a
negative parity claim ("the reference has no X") that was never re-measured.

### Findings (all verified in both DOMs / against the tree)

| # | Finding | Severity |
|---|---------|----------|
| S14-1 | **Clone's AI Assistant panel is missing the reference's suggestions line.** Reference: a `p-3 border-t border-[#30363d]` wrapper DIV holds the `flex gap-2` form AND a `mt-1 text-xs text-gray-500` div with `Try: "Add 3 colored circles", "Make selected elements red", "Create a login form"` below it. Clone today: the `<form>` itself carries `border-t p-3` and no suggestions element; `tests/e2e/parity.spec.ts` pins the WRONG fact (`await expect(page.getByText(/^Try:/)).toHaveCount(0)`). The original build (13e3bda) carried the line with wrong classes (`mt-2 truncate text-[10px] text-gray-600`) — session 8 removed it instead of fixing the classes. | **High** |
| S14-2 | **Docs record the wrong "no suggestions line" fact / drift with the code.** `digma_SKILL.md` §6 (line 183) documents the examples line as UI parity (doc was RIGHT, code drifted); `src/components/editor/ai-assistant.tsx`'s header comment says "no suggestions line"; `tests/e2e/parity.spec.ts`'s comment ditto; the PAD v1.5.0 revision block records it (historical — stays untouched per precedent, the reversal is recorded in the NEW revision block); README/CLAUDE/AGENTS describe the AI panel chrome without the line. | **Low** |

### Verified parity-hold (no change — the fifth consecutive audit)

- **Nav pill route scope** (session-12 fix holds): reference and clone both
  render NO pill at `/` (all links plain, no `aria-current`) and the
  `bg-purple-50 text-purple-700` pill on `/Dashboard`, `/Recent`, `/Teams` —
  exact pathname match, re-measured settled on all four routes this session.
- **Mobile navigation** (THE operator-flagged surface): the reference STILL
  ships Tailwind v4 failure class A at 390×844 (nav `display:none`, no
  hamburger — the single header button is the 36×36 notifications bell). The
  clone's fix verified END-TO-END this session: 44×44 trigger with stable
  `aria-label="Navigation menu"` + `aria-expanded` + `aria-controls`, drawer
  opens with all three links, `data-scroll-locked` body, tap "Recent" →
  navigates AND dismisses, trigger stays available; tablet 768 (nav visible,
  no burger) and desktop 1280 (no burger) clean.
- **Editor chrome**: 9-tool rail with identical lucide icons (VLM's
  "7 icons" flag disproven by DOM — all 9 present); zoom cluster
  `absolute top-4 left-4 z-10 flex items-center gap-2` with [100%][svg][svg];
  top bar (project name, `bg-green-500` Saved pill, Share/Present); layers
  panel (header + Deselect All quirk, `text-xs text-gray-400
  hover:text-white` rows); canvas grid (identical linear-gradient 20px grid,
  opacity-20); AI header/bubbles/avatar chips/input/send button/placeholder
  ("Create a blue button, make it bigger, delete selected..." both) — all
  match except S14-1.
- **Auth 3 states** (ADR-013): sign-in branded card; sign-up minimal card
  (h2 "Create your account", back-link, Confirm Password "Re-enter password",
  Password "Min. 8 characters", no name field); forgot ("Reset your
  password", email-only, "Send reset link") — verified in both apps' DOM.
- **Dashboard/Recent/Teams chrome**: hero gradient (`from-gray-50 via-white
  to-purple-50`), Quick Stats glass (`bg-white/10 backdrop-blur-lg`), Create
  New Design (`bg-white text-purple-600`), near-black `#171717` active view
  toggle, Teams flat main + `rgb(37,99,235)` Create Team, Recent
  `mt-1 text-gray-500` subtitle — all match.
- **Login**: chip structure + slate glow sibling (identical in both DOMs),
  brand-mark URL unchanged from session 12 (pixel-verified then), nothing
  below the card, search inputs (`w-80` `pl-10` `rounded-lg`) identical.
- **Header avatar**: `w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600
  rounded-full` + User icon — identical in both DOMs.
- **Tailwind v4 health**: no `tailwind.config.js`; no `@apply`; no `[var(]`
  patterns; `@theme` literal fonts + palette pins; `tests/theme.test.ts`
  green; clone pages console-clean (the `cdn.tailwindcss.com` warning in the
  shared browser log came from the REFERENCE pages — the reference still
  ships the Tailwind CDN in production); `min-h-screen` usage matches the
  reference's own classes (parity wins over the `min-h-dvh` guidance).
- **Environment**: `.env` → `DATABASE_URL="file:../db/custom.db"`; `db/` at
  the repo root (fresh `db:push` + `db:seed` this session; startup line
  `[db] DATABASE_URL -> <repo>/db/custom.db`); the exported-shell-var trap
  re-handled (`env -u DATABASE_URL` discipline + parent `.env`
  neutralized); fresh-clone first-run flow verified (README order works:
  install → cp .env → db:push creates `db/` → seed → dev).
- **Vitest + Playwright suites**: both present and green
  (vitest.config.ts includes `src/**/*.test.ts` + `tests/**/*.test.ts`,
  node env, `@` alias; playwright.config.ts boots the standalone server on
  :3100 with its own `db/e2e.db`, setup-project storageState, workers: 1;
  both exclude `skills/`).
- **Baseline full gate green at `b2adf19`** (re-run this session before any
  change).

### Non-parity observations (documented, not fixed)

- The reference's editor tool buttons carry plain titles ("Select"); the
  clone's carry `"{Tool} tool"` accessible names + shortcut titles — a
  documented a11y superset (reference has none).
- The reference's `aria-current` absence on the active nav link is an a11y
  gap; the clone keeps `aria-current="page"` (documented superset).
- VLM false alarms investigated and dismissed via DOM this session: the
  "7 icons / missing Pen tool" editor flag (DOM shows all 9), the avatar
  letter difference (data content), the "cursor overlay" on the chip bar
  (screenshot artifact).

---

## P1 — Code change (TDD, one slice)

### S14-1. AI assistant: restore the reference's suggestions line

- **File:** `src/components/editor/ai-assistant.tsx` (the input form, ~lines
  185–210).
- **Fix:** restructure the input area to the reference's measured DOM:
  ```tsx
  <div className="border-t border-[#30363d] p-3">
    <form className="flex gap-2" onSubmit={…}>           {/* unchanged input + send */}
    {messages.every((m) => m.role !== "user") && (
      <p className="mt-1 text-xs text-gray-500">
        Try: {SUGGESTIONS.map((s) => `"${s}"`).join(", ")}
      </p>
    )}
  </div>
  ```
  with `const SUGGESTIONS = ["Add 3 colored circles", "Make selected elements
  red", "Create a login form"]` (the original build's constant, restored).
  The line renders while the conversation is in its initial state (no user
  message yet) — the ONLY reference state that is measurable (the reference
  itself crashes on AI submission, so its post-send DOM is unknowable; the
  clone's post-send behavior is its own design and stays unpinned).
- **Tests (RED first):** `tests/e2e/parity.spec.ts` — REVERSE the wrong pin:
  replace `await expect(page.getByText(/^Try:/)).toHaveCount(0)` with
  assertions that the line is VISIBLE, carries the reference's classes, sits
  BELOW the form (sibling) inside the `border-t` container, and reads the
  exact measured text. Also update the test's comment (the "no suggestions
  line" note → the reversal note).
- **Comment fix:** the component's header comment ("no suggestions line")
  → record the reversal + the measured structure.

## P2 — Documentation alignment (post-fix)

- **PAD → v1.8.0:** new revision block (S14-1 reversal + the lesson: "a
  negative parity claim needs the same re-measurement rigor as a positive
  one — 'the reference has no X' survived six sessions un-checked"); §5/§9
  AI-panel facts gain the suggestions line; test counts unchanged (72/54/28
  — the pin is a rewrite, not a net-new test).
- **AGENTS.md:** the AI-assistant architecture fact gains the suggestions
  line + the initial-state-only contract.
- **CLAUDE.md:** the parity-suite description (AI panel chrome) gains the
  suggestions line.
- **README.md:** the e2e parity-suite description ditto.
- **digma_SKILL.md:** §6 line 183 already documents the line (verified
  correct — no change needed there); add lesson **F16** (negative-parity
  re-measurement) to §12; refresh `project_state` + version → v1.7.0.
- **`tests/e2e/parity.spec.ts` + `ai-assistant.tsx` comments:** the
  reversal notes (part of P1's edits).
- **docs/session_14.md** (new session log) + `worklog.md` Task 30 entry.

## P3 — Delivery

- Screenshots: re-capture the standard set from the remediated dev server
  (the editor views now show the suggestions line) → `docs/screenshots/`;
  audit provenance (reference + clone pairs) → `docs/screenshots/ref-audit-s14/`.
- `.env.example`: re-verified against the codebase this session
  (DATABASE_URL relative rule, `DIGMA_REPO_ROOT`, `AUTH_SECRET`) —
  unchanged, included in the commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …`.
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build
  → ./scripts/smoke-test.sh → test:e2e` — all green before push (expected:
  72 unit / 28 smoke / 54 e2e — counts unchanged).
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- The mobile navigation fix (verified end-to-end again this session; the
  reference still ships failure class A).
- The nav-pill exact-match scope, the proxy redirects, the brand mark, the
  auth-card states, the palette pins, the literal-font tokens, the
  autosave replace contract, the Untitled editor, the AI degrade-not-fail
  pipeline, the toast infra — all pinned by existing suites and re-verified
  live this session.
- The vitest/playwright configs (verified healthy; `skills/` excluded
  everywhere).
- The historical v1.5.0 PAD revision block (records the session-8 reading
  as it happened — precedent: historical blocks stay untouched, the
  reversal is recorded in the new block).
- Remaining PAD §10 scope cuts (gradient/image fill pills, per-corner
  radii, rotation-aware bounds, forgot-mail delivery, in-process rate
  limiter, session revocation) — none are release blockers.
- The reference's own bugs deliberately not cloned (AI crash, Tailwind CDN
  in production, no-op Create Team buttons, missing mobile nav,
  no-`aria-current` nav).

---

## Execution status (end of session 14)

**All items EXECUTED and GREEN** — S14-1 fixed TDD-first: **RED** (the rewritten
parity pin failed exactly at `await expect(suggestion).toBeVisible()` —
"element(s) not found" — against the pre-fix build); **GREEN** (the component
restructure: the `p-3 border-t` wrapper div now holds the `flex gap-2` form +
the restored `mt-1 text-xs text-gray-500` suggestions `<p>` with the measured
text, rendered in the initial state only). Live-verified in the browser post-fix
(classes, text, and DOM position all match the reference's measured structure
exactly). Full gate green: **72 unit / 28 smoke / 54 e2e** (the pin is a
rewrite of the wrong session-8 assertion — test counts unchanged). S14-2 docs
alignment executed at PAD v1.8.0 / digma_SKILL v1.7.0 (lesson F16 added).
