#!/usr/bin/env python3
"""Session 66 — PAD v1.45.0 update: header bump, revision block, §7.1 rows."""
import re
from pathlib import Path

PAD = Path("/home/z/my-project/digma/Project_Architecture_Document.md")
src = PAD.read_text()

# ---- 1. Header bump -------------------------------------------------------
src = src.replace(
    "# Digma — Master Project Architecture Document (PAD) v1.44.0",
    "# Digma — Master Project Architecture Document (PAD) v1.45.0",
    1,
)

# ---- 2. The new Last Updated summary line ---------------------------------
new_summary = """**Last Updated:** 2026-10-03 (v1.45.0 — the gesture-arm-interleaving/color-picker-coalescing/low-batch pass: the one gesture seam's OWNERSHIP doctrine reaches the two directions it missed (the canvas's pointerdown now FLUSHES the panel closure's live typing burst BEFORE its own unconditional store arm — a burst alive inside its 150ms idle window previously lost its armed pre-typing snapshot and with it its undo entry, and the store's beginGesture is an unconditional overwrite; and the closure's begin() now carries textTick's FOREIGN-RIDE guard — a second finger focusing a panel field mid-canvas-drag previously clobbered the live canvas gesture, corrupting or deleting the drag's history entry) + the redundant focus-begins RETIRED from all three text/field surfaces (a bare read-only focus previously armed a store gesture with NO idle escape — the autosave's saved-marking looped at ~1 PUT/s while the field held focus; the arm now belongs to the first COMMITTING event alone, and the tick's surface became a PARAMETER so a field burst arms under its own token and its blur terminal actually ends it) + the color-picker per-event history flood closed (the Fill/Stroke/Text/Background swatches and the gradient stop colors ride the idle-coalesced burst — one history entry per picker drag instead of one full snapshot per intermediate popup color; setBackgroundColor's history push became gesture-aware, matching updateElements' commit form) + the low batch (the five uncapped auth routes gain the register-family length caps — unbounded passwords previously reached scryptSync and the SQLite lookups verbatim; redactDatabaseUrl fails closed on the malformed family — a password containing a raw path delimiter previously printed verbatim against the seam's own contract; the AUTH_SECRET insecure fallback now WARNS once per process instead of minting forgeable tokens in silence; the editor mounts a window-level dragover+drop guard so a drop outside the dashed dropzone no longer navigates the tab to the blob; the image upload's label is now keyboard-reachable — focusable, role=button, Enter/Space activation over the display:none input)): the 42nd audit re-verified the reference's standing surfaces (the desktop nav 124/96/92 x 36; the greeting "Good morning, sepnetflix2023" with the name; Quick Stats 1/0/Pro; the Recent sort last_accessed / "1 file found"; zero kbd; the Create-Team dead chrome the 42nd — 2 clicks, 0 dialogs; R3 mobile nav failure class A the 42nd — nav display:none, links 0x0, no hamburger, evidence ref-audit-s76/ref-01; the mobile editor header clipping Share L385-R458 / Present L466-R551 at 390 re-measured EXACTLY, evidence ref-audit-s76/ref-02; the board at exactly 9 layers, opened through the project-card ANCHOR whose own text is "Type here..." — the same first-attempt miss as sessions 62/63/64/65) — no drift, no new gaps; the clone's mobile nav verified live end-to-end at 390x844 the 43rd consecutive session AND re-verified on the S66 build after the code changes (9/9 — the Tailwind v4 failure class A NOT present); the FOURTEENTH Mode C code audit — TWO fresh-eyes independent full-file reviews (auditor A over the editor core — editor-view/editor-store/canvas/properties-panel/toolbar/layers/components/AI panel/lib/editor/lib/ai-assistant/call, the interleaving findings verified empirically with a scratch simulation replicating the exact store + closure semantics; auditor B over the server + lib/config/infra side — all 18 API route files, the 11 pure lib seams, proxy, prisma schema + seed, the test infra, the 6 configs, both auth screens, the redaction re-derivation executed as a 17-form probe; both last independently reviewed session 64) found 0 Critical / 0 High / 7 Medium / 6 Low / 9 Informational (the session-65 delivery itself clean — no new defects; the findings are pre-existing classes three of which S65-C widened), every chosen finding individually re-verified by the lead in source; the session executed all three chosen slices S66-A..S66-C via TDD: unit RED 20 defect pins + 7 preservation pins across three new spec files -> unit GREEN 453 = 426 + 27; e2e RED honestly reproduced against the pre-fix standalone build at exactly the defect assertions (the second undo after type-then-drag restoring the TYPED text instead of the pre-typing text; the bare-focus badge count 0 after the 10s poll; the picker's first undo restoring #dd0033 — one intermediate color deep) -> e2e GREEN 224 = 221 + 3; FULL GATE GREEN: lint - typecheck - 453 unit / 85 files - build 23 routes - 56 smoke - 224 e2e — zero regressions; the live verification on the S66 build (the mobile nav contract 9/9 re-verified); the screenshot capture — the standard 32 re-captured + the ref-audit-s76 evidence set (ref-00/01/02/03/04 from the 42nd audit + clone-01/04/05/06 + the standing clone-07 44px-bell and clone-08 AA-destructive evidence + clone-14 the standing list-thumbnail fit + clone-15 the S66-A bare-focus convergence evidence captured BY the e2e pin at the verified-assertion moment + clone-16 the S66-B picker one-undo evidence with the inline seeded-restore check + clone-17 the S66-C upload keyboard-path evidence with the inline focusability check) — dimension-checked 167/167 across the standing sets (the checker extended with the S76 mapping), VLM content-verified 19/19 (clone-04's "side sheet" reading the standing F44b confirming-description class — the drawer IS open), the DB re-seeded to the pristine contract after every mutating phase; .env.example verified unchanged — the source's five process.env reads all covered, the three slices add no env vars) **Audience:** Senior Engineers, Tech Leads, DevOps, and Onboarding Engineers"""

old_summary_match = re.search(
    r"\*\*Last Updated:\*\* .+? \*\*Audience:\*\* Senior Engineers, Tech Leads, DevOps, and Onboarding Engineers",
    src,
    re.S,
)
assert old_summary_match, "summary line not found"
src = src.replace(old_summary_match.group(0), new_summary, 1)

# ---- 3. The new revision block (inserted before the v1.44.0 block) --------
revision_block = """#### Revision Block — v1.45.0 (Tracked Changes)

- `[SR]` **The gesture-arm-interleaving/color-picker-coalescing/low-batch
  pass — three slices (S66-A through S66-C) — the fourteenth Mode C
  audit's chosen work:**
  1. **S66-A (A-1 + A-2 + A-4 — the Medium set): the gesture seam's
     ownership doctrine reaches the ARM path and the canvas's own
     begin.** (a) The canvas flush-foreign-first: `resetSliderGesture()`
     runs BEFORE `beginGesture()` at both canvas arm sites (the move
     branch and the resize handle branch) — the closure's CHANGED
     typing burst flushes its one entry (the typed change keeps its
     undo step), an unchanged one cancels, and a canvas-foreign
     gesture passes untouched; the store's arm then lands fresh with
     BOTH entries in history (pre-typing AND pre-drag). Pre-fix the
     canvas's unconditional store overwrite silently dropped a burst
     alive inside its 150ms idle window (the field's blur terminal
     no-ops on the ownership check). (b) The begin foreign-ride guard:
     `begin(surface)` re-reads the LIVE store state (after any flush —
     the captured snapshot predates it) and RIDES UNDER a foreign
     gesture instead of arming over it — textTick's `:401-405` doctrine
     reaching the arm path it missed. Pre-fix a second finger's
     field-focus mid-canvas-drag clobbered the live canvas gesture:
     the drag's end pushed a MID-DRAG state, or the field's blur then
     OWNED the mid-drag snapshot, cancelled it, and the canvas's own
     pointerup pushed nothing. (c) The focus-begin retirement:
     `NumberField`, `GuardedNumberInput`, and the Content input lose
     their `onFocus` arms — textTick's begin-on-demand covers burst
     starts and a read-only focus arms NOTHING (the pre-fix bare focus
     looped the autosave's saved-marking at ~1 PUT/s while the field
     held focus, the badge oscillating Saving…/Unsaved). The blur
     terminals stay (the early end of a live burst; a no-op when
     nothing is armed). Pinned by `tests/gesture-arm-s66.test.ts` +
     the two e2e pins in `tests/e2e/session66-fixes.spec.ts`.
  2. **S66-B (A-3 — the Medium): the color-picker surfaces ride the
     idle-coalesced burst.** `HexColorRow`'s `type="color"` swatch (the
     Fill, Stroke, Text Color, and Background rows) and the gradient
     stop-color swatches commit through `sliderGesture.textTick()`
     FIRST + a blur `finish` — Chrome's picker fires continuous input
     events while dragging in the popup, and the pre-fix path pushed a
     full 60-deep snapshot per intermediate color (one picker drag
     flooded the history stack and evicted earlier work). The hex TEXT
     input stays a discrete keyboard commit (the S62-A doctrine —
     keyboard-only changes are discrete intent). `setBackgroundColor`
     gains the gesture-aware conditional history push, matching
     `updateElements`' commit form (the swatch's armed burst commits
     history-free; the terminal endGesture pushes the ONE pre-picker
     snapshot). Pinned by `tests/color-coalesce-s66.test.ts` + the
     picker one-undo e2e pin.
  3. **S66-C (B-4 + B-7 + B-8 + A-5 + A-6 — the Low batch):** the five
     uncapped auth routes gain the register-family length caps (login
     email/password 200/200, verify-otp email 200 + code 32,
     resend-otp email 200, forgot-password email 200, reset-password
     token 200 — App Router handlers ship no default body-size cap, so
     unbounded strings reached scryptSync and the SQLite lookups
     verbatim; register capped since S62-G while its siblings did
     not); `redactDatabaseUrl` fails closed (a raw path/query/hash
     delimiter inside the password truncated the strict authority
     parse before the separator — `postgres://user:pa/ss@host/db`
     printed its credential verbatim; the span from the scheme to the
     LAST separator now collapses to `***`, over-redaction the
     documented safe direction); the `AUTH_SECRET` insecure fallback
     fires a ONE-TIME `console.warn` per process (a production deploy
     that forgot the variable previously minted forgeable tokens in
     complete silence); the editor mounts a window-level
     dragover+drop preventDefault pair with cleanup (a file dropped
     outside the dashed dropzone previously navigated the tab to the
     blob and lost the session); the image upload's label becomes
     keyboard-reachable (`tabIndex={0}` + `role="button"` + an
     Enter/Space keydown that clicks it — the label's activation
     behavior forwards to the display:none input via htmlFor — plus a
     visible focus ring). Pinned by `tests/low-batch-s66.test.ts`.
- `[SR]` **Counts:** unit 453 = 426 + 27 across 85 files (three new
  spec files: gesture-arm-s66 7, color-coalesce-s66 6, low-batch-s66
  14); e2e 224 = 221 + 3 (`tests/e2e/session66-fixes.spec.ts`); smoke
  56 (unchanged); build 23 routes (unchanged). Four standing pins
  legitimately re-anchored onto the retired-focus-arm contract forms
  (the number-coalesce pair, the slider-gesture Content-input pin, and
  the slider-surface consumer pin — each with the contract-change
  comment).
- `[SR]` **The en-route work (lesson F53):** (1) the session-65
  number-field e2e pin failed POST-fix — the S65-C `textTick`
  HARDCODED its arm under the text surface label while the field's
  blur terminal says `finish("field")`; the mismatch was masked in
  session 65 (the focus-begin had already armed the field surface and
  the tick rode under it), but with the focus arm retired the field
  bursts armed under the wrong label, the field's blur no-opped, and
  the gesture outlived the blur by the full 150ms idle — a Ctrl+Z in
  that window hit the still-armed snapshot and no-opped. The tick's
  surface became a PARAMETER (text default; the fields pass "field"),
  exactly what the S65-C documentation SAID but the implementation
  never did; (2) the capture script's picker check initially used a
  synthetic canvas click (pointerdown + pointerup in ONE eval) — React
  only flushes the pointerdown's setDrag between macrotasks, so the
  same-eval pointerup saw `drag === null`, skipped the plain-click
  CANCEL path, and left the canvas gesture armed; the check moved onto
  the Background Color row (no canvas click, no drag state machine);
  (3) the login route initially missed the `fail` import — the
  typecheck gate caught it before any push (the piped-tail gate chain
  still ran the later gates, a discipline note for future sessions).
- `[SR]` **Docs aligned:** this revision block + the §7.1 table to the
  85-file/453-unit + 25-file/224-e2e reality; AGENTS.md (the counts +
  the session-66 seam bullet); CLAUDE.md (the counts); README.md (the
  counts + the gesture-seam feature row); digma_SKILL.md v1.44.0
  (lesson F53 — the synthetic-event state-flush trap, the
  hardcoded-arm-label/blur-terminal mismatch family, the piped-tail
  gate-chain hazard, the color-input lowercase normalization);
  remediation-plan-session66 execution status; session_91.md; the
  worklog entry.
- `[D]` The audit's deferred set documented with rationale in
  `docs/remediation-plan-session66.md` (B-5 the stateless-session
  revocation gap — sharpened: password reset does not evict live
  tokens; B-15 the AI route rate limit; the enumeration oracles; the
  single-tenant ownership posture; the elements POST/PUT row-builder
  drift; the dead schema columns; the list-payload perf; the
  informational batch); the 42nd reference audit's evidence at
  `docs/screenshots/ref-audit-s76/` (ref-00/01/02/03/04 +
  clone-01/04/05/06/07/08/14 + clone-15 the bare-focus convergence
  evidence captured BY the e2e pin at the verified-assertion moment +
  clone-16 the picker one-undo evidence + clone-17 the upload
  keyboard-path evidence); dimension-checked 167/167 (the checker
  extended with the S76 mapping); VLM content-verified 19/19.

"""
anchor = "#### Revision Block — v1.44.0 (Tracked Changes)"
assert anchor in src, "v1.44.0 block anchor not found"
src = src.replace(anchor, revision_block + anchor, 1)

# ---- 4. The §7.1 table rows ------------------------------------------------
old_rows = """| Unit — the shared call() seam (S65-E) | `tests/call-seam.test.ts` | 3 | tests | Vitest |
| **Unit total** | **82 files** | **426** | | Vitest |"""
new_rows = """| Unit — the shared call() seam (S65-E) | `tests/call-seam.test.ts` | 3 | tests | Vitest |
| Unit — gesture-arm interleaving family (S66-A) | `tests/gesture-arm-s66.test.ts` | 7 | tests | Vitest |
| Unit — color-picker burst coalescing (S66-B) | `tests/color-coalesce-s66.test.ts` | 6 | tests | Vitest |
| Unit — low batch: auth caps + fail-closed redaction + secret warn + drop guard + upload keyboard (S66-C) | `tests/low-batch-s66.test.ts` | 14 | tests | Vitest |
| **Unit total** | **85 files** | **453** | | Vitest |"""
assert old_rows in src, "unit total rows not found"
src = src.replace(old_rows, new_rows, 1)

src = src.replace(
    "| **E2E total** | **24 files** | **221** | | Playwright |",
    "| **E2E total** | **25 files** | **224** | | Playwright |",
    1,
)

old_e2e_row = """| E2E — session 65 fixes: the list-thumbnail containment + the mid-drag Sheet-close convergence + the number-field one-undo-per-burst (S65"""
assert old_e2e_row in src
# append the session-66 row right after the session-65 row's line
lines = src.split("\n")
for i, line in enumerate(lines):
    if line.startswith("| E2E — session 65 fixes:"):
        lines.insert(
            i + 1,
            "| E2E — session 66 fixes: the type-then-drag two-undo + the bare-focus convergence + the picker-drag one-undo (S66-A/B) | `tests/e2e/session66-fixes.spec.ts` | 3 | tests/e2e | Playwright |",
        )
        break
src = "\n".join(lines)

PAD.write_text(src)
print("PAD v1.45.0 written")
