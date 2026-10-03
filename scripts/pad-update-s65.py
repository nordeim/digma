#!/usr/bin/env python3
"""Session 65 — PAD v1.44.0 update: header bump, revision block, §7.1 rows."""
import re
from pathlib import Path

PAD = Path("/home/z/my-project/digma/Project_Architecture_Document.md")
src = PAD.read_text()

# ---- 1. Header bump -------------------------------------------------------
src = src.replace(
    "# Digma — Master Project Architecture Document (PAD) v1.43.0",
    "# Digma — Master Project Architecture Document (PAD) v1.44.0",
    1,
)

# ---- 2. The new Last Updated summary line ---------------------------------
new_summary = """**Last Updated:** 2026-10-03 (v1.44.0 — the thumbnail-parent-fit/gesture-ownership/number-coalescing pass: the card thumbnail's fixed 320x200 painted space now SCALES to its rendered slot (the pure `thumbnailFit` min-fit + centering seam consumed by a measured ResizeObserver wrapper transform — the files-list's 40x40 slot previously showed a corner sliver with the seeded elements at ZERO visible area, and the grid's ratio-locked slot cropped up to ~28% of the fitted content at laptop widths; the PAD's own RA-48 decode documents the reference's list thumbnail as the mini-canvas SCALED INSIDE — the implementation had drifted from the documented contract the day it was ported) + the sliderGesture unmount reset seam (a slider drag alive at the moment the mobile Sheet closes never received its terminal pointer event on the detached element — the closure and the store's armed snapshot leaked, the autosave's saved-marking deferred forever with ~1 PUT/s, and every subsequent panel edit silently stopped pushing undo history; the reset terminal is consumed at the SHARED section bodies' unmount — the Sheet CONTENT unmounts on every close path while the host does not — plus the loadProject heal, plus OWNERSHIP verification on every terminal: the closure captures the snapshot it armed, and a canvas gesture that replaces it mid-flight passes through untouched, closing the en-route defect where the idle fired mid-canvas-drag, pushed the MID-DRAG state into history, and broke the canceled-drag undo) + the number-input burst coalescing (every DIGIT of a typed value previously pushed a full 60-deep snapshot — NumberField and GuardedNumberInput now carry the Content input's idle-coalesced field gesture, one history entry per typing burst; the textTick idle ends WHICHEVER surface owns the gesture) + the low batch (the greeting h1's suppressHydrationWarning for the bucket-boundary SSR/hydration text mismatch; the bell glyph gray-500 — the S61-B AA family; redactDatabaseUrl splits the authority at the LAST @ so a password containing the separator redacts whole; the dashed image dropzone wires real onDragOver/onDrop so a drop uploads instead of navigating the tab to the blob; the six DialogContent sites carry the S60-F 44px Close-X form) + the ONE shared client call() seam in src/lib/call.ts (the files view's GET-only local copy had already lost the init parameter — the drift the audit predicted had happened)): the 41st audit re-verified the reference's standing surfaces (the desktop nav 124/96/92 x 36; the greeting "Good morning, sepnetflix2023" with the name; Quick Stats 1/0/Pro; the Recent sort last_accessed / "1 file found"; zero kbd; the Create-Team dead chrome the 41st — 2 clicks, 0 dialogs; R3 mobile nav failure class A the 41st — nav display:none, links 0x0, no hamburger, evidence ref-audit-s75/ref-01; the mobile editor header clipping Share L385-R458 / Present L466-R551 at 390 re-measured EXACTLY, evidence ref-audit-s75/ref-02; the board at exactly 9 layers, opened through the project-card ANCHOR whose own text is "Type here..." — the same first-attempt miss as sessions 62/63/64) — no drift, no new gaps; the clone's mobile nav verified live end-to-end at 390x844 the 42nd consecutive session AND re-verified on the S65 build after the code changes (9/9 — the Tailwind v4 failure class A NOT present); the THIRTEENTH Mode C code audit — TWO fresh-eyes independent full-file reviews (auditor A over the client view layer — dashboard/recent/teams/project-card/app-header/login-screen/reset-password-screen/logo/use-toast/layout+globals+every page, last independently reviewed session 63; auditor B over the lib/ui/config/infra side — the 11 pure lib seams, the 10 vendored ui primitives, the 4 editor panel components, the test infra, the 6 configs + proxy, the prisma schema + seed, and the seven session-64 spec files, last independently reviewed session 63) found 0 Critical / 2 High / 1 Medium / 8 Low / 11 Informational, every chosen finding individually re-verified by the lead in source (the A-1 High verified against the PAD's own RA-48 decode); the session executed all five chosen slices S65-A..S65-E via TDD: unit RED 26 defect pins + 5 preservation pins across five new spec files -> unit GREEN 426 = 396 + 30; e2e RED honestly reproduced against the pre-fix standalone build at exactly the defect assertions (the list-slot thumbnails at "root 40x40 child 0,0 320x200" x5; the mid-drag Sheet close leaving the badge unconverged at count 0 after 10s; the number-field undo stepping to 25, expected 160) -> e2e GREEN 221 = 218 + 3; FULL GATE GREEN: lint - typecheck - 426 unit / 82 files - build 23 routes - 56 smoke - 221 e2e — zero regressions; the live verification on the S65 build (the mobile nav contract 9/9 re-verified); the screenshot capture — the standard 32 re-captured + the ref-audit-s75 evidence set (ref-00/01/02/03/04/05 from the 41st audit + clone-01/04/05/06 + the standing clone-07 44px-bell (now gray-500, inline-checked) and clone-08 AA-destructive evidence + clone-13 the S65-B mid-drag convergence evidence captured BY the e2e pin at the verified-assertion moment + clone-14 the S65-A list-thumbnail fit evidence with the inline containment check) — dimension-checked 152/152 across the standing sets (the checker extended with the S75 mapping), VLM content-verified 17/17 (clone-04's "side sheet" reading the standing F44b confirming-description class — the drawer IS open), the DB re-seeded to the pristine contract after every mutating phase; .env.example verified unchanged — the source's five process.env reads all covered, the five slices add no env vars) **Audience:** Senior Engineers, Tech Leads, DevOps, and Onboarding Engineers"""

old_summary_match = re.search(r"\*\*Last Updated:\*\* .+? \*\*Audience:\*\* Senior Engineers, Tech Leads, DevOps, and Onboarding Engineers", src, re.S)
assert old_summary_match, "summary line not found"
src = src.replace(old_summary_match.group(0), new_summary, 1)

# ---- 3. The new revision block ---------------------------------------------
revision_block = """#### Revision Block — v1.44.0 (Tracked Changes)

- `[SR]` **The thumbnail-parent-fit/gesture-ownership/number-coalescing
  pass — five slices (S65-A through S65-E) — the thirteenth Mode C
  audit's chosen work:**
  1. **S65-A (A-1 — the HIGH): the card thumbnail's painted space
     scales to its rendered slot.** A pure `thumbnailFit(parentW,
     parentH, boxW, boxH)` seam in `src/lib/editor.ts` computes the
     min-fit scale + the centering translate (a parent sharing the
     box's 16:10 aspect fills exactly — the wide grid path is
     pixel-identical to the historical full-box paint; degenerate
     non-positive parent dimensions return the identity), and
     `CanvasThumbnail` applies it to the existing absolute wrapper
     through a `useLayoutEffect` + `ResizeObserver` measured transform
     (`translate(tx, ty) scale(scale)`, transformOrigin `left top`).
     Pre-fix the fixed 320x200 box anchored at the parent's top-left
     and the overflow crop did the "sizing" — the files-list's 40x40
     slot showed a corner sliver (the seeded demo elements measured
     ZERO visible area) and the grid's ratio-locked slot cropped
     ~28% of the fitted content at laptop widths. The reference's own
     decoded contract (the session-39 RA-48 measurement) scales the
     mini-canvas INSIDE the slot. Pinned by `tests/thumbnail-fit.test.ts`
     + the e2e containment pin in `tests/e2e/session65-fixes.spec.ts`.
  2. **S65-B (B-1 — the HIGH): the `sliderGesture` closure gains the
     unmount reset terminal + ownership verification.** `reset()`
     clears the idle timer, ENDS a changed leaked gesture (its partial
     drag keeps the one undo entry), CANCELS an unchanged one, and
     cleans the closure state — the same convention as `finish`. It is
     consumed at the SHARED section bodies' unmount
     (`PropertiesSections` — the one component BOTH the desktop panel
     and the mobile element Sheet render; the Sheet's CONTENT unmounts
     on every close path — scrim tap, Escape, the dismiss control, the
     lg crossing, navigation — while the HOST stays mounted, so a
     host-level cleanup covers none of them), plus the `loadProject`
     heal (the store's load resets the SNAPSHOT but not the CLOSURE —
     a stale owner made the next same-surface begin skip arming,
     regressing the one-entry-per-gesture contract). Every terminal
     now verifies OWNERSHIP: the closure captures the snapshot
     reference it armed (`armed`), and a store whose current
     `gestureSnapshot` differs (a canvas gesture replaced it
     mid-flight — the canvas arms its own gestures through the store
     directly, never through this closure) passes through untouched
     with only the bookkeeping cleared. The en-route defect this
     closed: a field-burst idle pending when a canvas drag began fired
     MID-DRAG, pushed the mid-drag state into history, and left the
     canvas gesture's cancel path a no-op (the standing canceled-drag
     undo pin caught it). Pinned by `tests/slider-reset.test.ts` + the
     mid-drag-close convergence e2e pin.
  3. **S65-C (B-2 — the MEDIUM): the number-input family carries the
     idle-coalesced field gesture.** `NumberField` and
     `GuardedNumberInput` wire `begin("field")` on focus, the
     `textTick` BEFORE the value commit on the finite branch (it arms
     the burst gesture on demand, then the commit lands WITH the
     gesture aware — one history entry per typing burst instead of one
     full snapshot per DIGIT; typing a three-digit value into a
     position field previously produced three undo entries), and
     `finish("field")` on blur. The `textTick` idle now ends WHICHEVER
     surface owns the gesture (the surface captured at ARM time — a
     hardcoded text label made the idle a no-op for the field surface,
     leaving the gesture open forever and the autosave's saved-marking
     deferred behind the armed snapshot). The S21-2 empty-draft guard
     and the abandoned-draft blur restore are untouched. Pinned by
     `tests/number-coalesce.test.ts` + the one-undo-per-burst e2e pin.
  4. **S65-D (the Low batch — A-2 + A-3 + B-3 + B-4 + B-5):** the
     greeting h1 carries `suppressHydrationWarning` (the bucket
     computes once on the server at request time and once in the
     browser at hydration — across the boundaries with divergent
     clocks React logged a text-content hydration error on every such
     visit; the suppression keeps exactly the self-correcting
     behavior minus the error, pixel-identical); the notifications
     trigger's glyph is gray-500 (the S61-B AA family — the lightest
     gray measured 2.54:1 against the 3:1 non-text floor; not a
     parity-pinned site); `redactDatabaseUrl` parses the AUTHORITY
     segment and splits userinfo at the LAST @ within it (the pre-fix
     first-@ split leaked the tail of a password containing the
     separator — a redaction seam's contract is that the secret never
     prints; over-redaction is safe); the dashed image dropzone wires
     real `onDragOver`/`onDrop` (preventDefault + the image/* filter
     mirroring the hidden input's accept + the same reader — a real
     drop previously fell through to the browser default and
     navigated the editor tab to the file blob); and the six
     `DialogContent` sites (teams x2, recent, the shortcuts dialog,
     project-card x2) carry the S60-F `[&>button]:h-11
     [&>button]:w-11` form so the Close X reaches the 44px touch
     floor like the Sheets' closes. Pinned by
     `tests/low-batch-s65.test.ts`.
  5. **S65-E (A-5): the ONE shared client `call()` seam.**
     `src/lib/call.ts` carries the init-aware superset form (the
     Content-Type merge only when a body exists); the three views
     import it and carry no local copy — the files view's GET-only
     variant had ALREADY LOST the init parameter (the drift the
     isTypingTarget lesson predicted). Its GET-only call sites are
     behavior-identical through the shared form (a body-less init
     passes through unchanged). Pinned by `tests/call-seam.test.ts`.
- `[SR]` **The 41st reference audit — no drift, no new gaps.** All
  standing datums re-verified exactly (the desktop nav 124/96/92 x 36;
  the greeting with the populated name; Quick Stats 1/0/Pro; the Recent
  sort + "1 file found"; zero kbd; the Create-Team dead chrome the
  41st; R3 mobile nav failure class A the 41st — evidence
  `ref-audit-s75/ref-01`; the mobile editor header clipping
  re-measured byte-identically — Share L385-R458 / Present L466-R551;
  the board at 9 layers, opened through the project-card ANCHOR — the
  generic card probe missed again, the anchor's own text is
  "Type here...", the project name lives in the sibling h3). Evidence
  set: `docs/screenshots/ref-audit-s75/` (ref-00 through ref-05). The
  reference's own 40x40 list thumbnail re-confirmed against the RA-48
  decode ("the SAME mini-canvas scaled inside").
- `[SR]` **The clone's mobile nav verified the 42nd consecutive
  session** (9/9 via `scripts/verify-nav-s65.sh`) AND re-verified on
  the S65 build after the code changes (the properties panel and the
  editor shell were both touched).
- `[SR]` **The thirteenth Mode C audit — 0 Critical / 2 High / 1
  Medium / 8 Low / 11 Informational**, every chosen finding
  individually re-verified by the lead in source; the two fresh-eyes
  passes covered the least-recently-reviewed surfaces (the client view
  layer and the lib/ui/config/infra side — both last independently
  reviewed session 63). Auditor A verified the A-1 High empirically
  with a headless-Chromium repro of the exact seeded coordinates; the
  deferred batch documented in
  `docs/remediation-plan-session65.md`.
- `[SR]` **Counts:** unit 426 = 396 + 30 across 82 files (five new
  spec files: thumbnail-fit 7, slider-reset 6, number-coalesce 6,
  low-batch-s65 8, call-seam 3); e2e 221 = 218 + 3
  (`tests/e2e/session65-fixes.spec.ts`); smoke 56 (unchanged); build
  23 routes (unchanged). Three standing pins legitimately re-anchored
  onto the surface-capturing idle forms (the slider-surface textTick
  pin + the slider-gesture Content-input pin — each with the
  contract-change comment; the ownership guard's form asserted in the
  re-anchored pin).
- `[SR]` **Docs aligned:** this revision block + the §7.1 table to the
  82-file/426-unit + 24-file/221-e2e reality; AGENTS.md (the counts +
  the session-65 seam bullet); CLAUDE.md (the counts + the session-65
  seam rows); README.md (the counts + the project-card thumbnail row +
  the shared-call architecture note + the e2e suite row); digma_SKILL
  v1.43.0 (lesson F52); the remediation plan's execution status;
  `docs/session_89.md`; the worklog entry. `.env.example` verified
  unchanged (no new env vars — the five slices add none; the source's
  five process.env reads all covered).

"""
anchor = "#### Revision Block — v1.43.0 (Tracked Changes)"
assert anchor in src
src = src.replace(anchor, revision_block + anchor, 1)

# ---- 4. The §7.1 rows + totals ---------------------------------------------
old_unit_rows = """| Unit — editor Low batch (S64-G) | `tests/editor-low-s64.test.ts` | 6 | tests | Vitest |
| **Unit total** | **77 files** | **396** | | Vitest |"""
new_unit_rows = """| Unit — editor Low batch (S64-G) | `tests/editor-low-s64.test.ts` | 6 | tests | Vitest |
| Unit — thumbnail parent-fit (S65-A) | `tests/thumbnail-fit.test.ts` | 7 | tests | Vitest |
| Unit — sliderGesture reset + ownership (S65-B) | `tests/slider-reset.test.ts` | 6 | tests | Vitest |
| Unit — number-input burst coalescing (S65-C) | `tests/number-coalesce.test.ts` | 6 | tests | Vitest |
| Unit — low batch: multi-@ redaction + hydration + bell + dropzone + dialog close (S65-D) | `tests/low-batch-s65.test.ts` | 8 | tests | Vitest |
| Unit — the shared call() seam (S65-E) | `tests/call-seam.test.ts` | 3 | tests | Vitest |
| **Unit total** | **82 files** | **426** | | Vitest |"""
assert old_unit_rows in src
src = src.replace(old_unit_rows, new_unit_rows, 1)

old_e2e_rows = """| E2E — session 64 fixes: the mobile Sheet slider one-undo gesture (S64-A) | `tests/e2e/session64-fixes.spec.ts` | 1 | tests/e2e | Playwright |
| **E2E total** | **23 files** | **218** | | Playwright |"""
new_e2e_rows = """| E2E — session 64 fixes: the mobile Sheet slider one-undo gesture (S64-A) | `tests/e2e/session64-fixes.spec.ts` | 1 | tests/e2e | Playwright |
| E2E — session 65 fixes: the list-thumbnail containment + the mid-drag Sheet-close convergence + the number-field one-undo-per-burst (S65-A/B/C) | `tests/e2e/session65-fixes.spec.ts` | 3 | tests/e2e | Playwright |
| **E2E total** | **24 files** | **221** | | Playwright |"""
assert old_e2e_rows in src
src = src.replace(old_e2e_rows, new_e2e_rows, 1)

PAD.write_text(src)
print("PAD v1.44.0 written: header + revision block + §7.1 totals (82/426 + 24/221)")
