# Session 35 — The Fourteenth Parity Audit: Frame Container Parity + Project-Delete Confirm (S31-1 + S31-2 + S31-3)

**Date:** 2026-09-30 · **Code state at start:** `77ac838` (session 29 delivered; transcript
push = `docs/session_34.md`) · **Code state at end:** this commit · **Docs:** PAD v1.17.0 ·
digma_SKILL v1.16.0 (lesson F25)

## Directive

The session-29 next-steps list: the reference's frame/image element rendering and its
create-dialog template behaviors — the last never-audited element-type seams — plus the
standing sweep (mobile nav, general parity).

## The audit (fourteenth consecutive)

**Baseline before any change:** workspace refreshed (`git pull` — fast-forward to `77ac838`),
`.env` verified with `DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root (re-seeded
→ 1 user / 2 projects / 6 elements / 1 team / 3 members), dev server healthy with the DB
anchor logged. Fast gates green: lint · typecheck · 82/82 unit. Configs verified: vitest (82)
+ playwright (88), both excluding `skills/`. The session-29 fixes (line SVG, type-conditional
panel, fontFamily) verified in place.

### Reference findings (live-measured, desktop 1440×900 + mobile 390×844)

- **RA-13 — the reference's FRAME element is a LABELED CONTAINER (the decisive new datum).**
  A fresh Frame-tool drag creates a transparent div (`background-color: transparent`),
  `border: 1px solid rgb(85, 85, 85)`, `border-radius: 0` — the border comes from the STROKE
  model fields (RA-18) — carrying an ALWAYS-ON name-label child (rendered unselected too):
  `absolute -top-5 left-0 text-xs text-gray-300 bg-[#161b22] px-1.5 py-0.5 pointer-events-none`
  with inline `transform: scale(1/zoom); transform-origin: left top; white-space: nowrap`
  (measured at 128% zoom: scale 0.778866 = 1/1.28392 — the label's TEXT stays a constant
  screen size at any zoom). Selection adds `ring-2 ring-blue-500 ring-offset-1` classes —
  which are INERT (see RA-20).
- **RA-14 — the reference's Image tool is a DEAD no-op** (no file input, no dialog, no
  element on drag or click).
- **RA-15 — the reference's create-dialog templates are COSMETIC** (the "Mobile App" template
  created a 0-layer project; the template is metadata only).
- **RA-16 — the reference's project delete confirms through a NATIVE `window.confirm()`**
  ("Are you sure you want to delete "X"?") — and it WORKS (the audit project vanished after
  accepting; the blocked-dialog error surfaced it during automation).
- **RA-17 — the reference's frame panel keeps ALL FIVE sections** (frames are corner-able —
  unlike line/ellipse/text).
- **RA-18 — the frame's Fill & Stroke panel values:** Fill `transparent` (a color input
  #000000 behind the literal text "transparent"), Stroke `#555555`, Stroke Width `1` — the
  frame's structural border is the standard stroke mechanism.
- **RA-19 — the reference's THUMBNAIL renders the frame's border but NOT its label** (the
  card's scaled frame div: `transparent`, `1px solid rgb(85,85,85)`, `border-radius: 0`, EMPTY
  innerHTML).
- **RA-20 — the reference's selection ring classes are INERT.** Its selected elements carry
  `ring-2 ring-blue-500 ring-offset-1`, but the inline style ships `box-shadow: none` —
  inline styles override the Tailwind ring's box-shadow, so NO selection ring ever paints (a
  full-DOM scan found no painted shadow or outline). The reference's canvas selection is
  invisible; the clone's painted inline ring is the deliberate working superset.
- **R3 — mobile nav failure class A re-confirmed** at 390×844 (the **14th consecutive
  session**; evidence: `docs/screenshots/ref-audit-s30/ref-02-mobile-failure-classA.png`).
- Standing reconfirmations: the reference's drag needs multi-event pointermove streams; a new
  element lands at the TOP of the layer list (newest-first — the clone's existing order is
  parity).

### Clone findings

- **S31-1 (Medium): the clone's FRAME rendering diverged from the container contract.** The
  pre-fix frame: solid `#161B22` fill, radius 8, no border, and a bare `text-[10px]
  text-gray-500` label with no chip chrome and NO counter-scale (live-measured 19px → 39px
  tall from 100% → 207% zoom). The seeded "Hero Section" frame carried the same solid-panel
  style.
- **S31-2 (Medium): the clone's project delete fired IMMEDIATELY** — the Delete menu item
  called `deleteProject()` directly (live-verified: the project vanished on the first click),
  contradicting both the documented confirm-step contract and the reference's native-confirm
  guard (RA-16).
- **S31-3 (Medium, en-route): every card-local dialog's Cancel silently NAVIGATED to the
  editor** — React propagates PORTAL events through the REACT tree, so clicks inside the
  (body-portaled) dialogs bubbled to the card root's `openProject()` onClick. The rename
  dialog had the same latent bug all along (live-reproduced pre-fix on both dialogs).
- Verified correct (no change): the image tool no-op (RA-14 parity), the cosmetic templates
  (RA-15 parity), the frame panel's five sections (RA-17 parity), the mobile nav end-to-end
  at 390×844 (44×44 trigger, drawer, scroll-lock, tap-navigate-and-dismiss, Escape,
  desktop-hidden — the Tailwind v4 failure class A is NOT present in the clone), the DB
  anchor, `.env`, and all three test configs.

## The remediation plan

`docs/remediation-plan-session31.md` — written and re-validated line-by-line against the
codebase before execution. Two slices: **Slice A** (the frame's labeled-container contract:
the defaults + the label chip + the counter-scale + the seed), **Slice B** (the
project-delete confirm dialog).

## The TDD execution

**RED (unit):** the frame-defaults test failed at `expected '#161B22' to be null`.

**RED (e2e):** 5/5 failed against the pre-fix build — the container test at
`Expected: "rgba(0, 0, 0, 0)", Received: "rgb(22, 27, 34)"`; the counter-scale test at
`Expected <= 3, Received: 13.83`; the seeded-frame and thumbnail tests at their contracts;
the delete-confirm test at the missing "Delete project?" heading.

**GREEN:** Slice A (`defaultElementFor("frame")` → `fill: null, stroke: "#555555",
strokeWidth: 1, radius: 0` — the shared style chain paints the border at the canvas,
thumbnail, and present sites with no further changes; the label chip with the reference's
measured chrome + `scale(1/zoom)` counter-scale; a frame-only `zoom` prop on `CanvasElement`
preserving memoization for every other type; the seed's Hero Section adopts the contract).
Slice B (the card-local "Delete project?" dialog — Cancel keeps, "Yes, Delete" removes).
The en-route S31-3 fix: both card-local dialogs wrap in a `stopPropagation` div (click AND
keydown) — the same convention the ellipsis-menu wrapper uses.

Full gate green: **lint · typecheck · 83 unit (+1) · build 20 routes · 28 smoke · 93 e2e
(+5).**

## The live verification (dev server, post-fix)

- The seeded Hero Section renders the container contract (transparent, 1px #555555 border,
  radius 0, the "Hero Section" chip with `bg rgb(22,27,34)`, 12px text, pointer-events none)
  — and a freshly drawn frame renders the same.
- **The label measured exactly 20px tall at BOTH 100% and 173% zoom** (pre-fix: 19px → 39px).
- The thumbnail renders the bordered container with NO label (RA-19 parity).
- The delete-confirm flow: Delete → dialog → Cancel keeps the project on the dashboard →
  Delete again → "Yes, Delete" removes it. The rename dialog's Cancel also stays on the
  dashboard (the S31-3 fix).

## Delivery

- The standard 16 screenshots re-captured from the remediated dev server (re-seeded first —
  the seeded canvas now shows the labeled container) → `docs/screenshots/`; audit provenance
  → `docs/screenshots/ref-audit-s30/` (the reference's dashboard/editor, its mobile
  failure-class-A, its squeezed mobile editor, its selected-rectangle no-ring state, and the
  clone's pre-fix zoom-scaled label → post-fix container).
- `.env.example` re-verified (unchanged — no new env vars this session); included in the
  commit.
- Docs aligned: PAD v1.17.0 (revision block + ADR-011 amendment + §7.1/§7.4 counts),
  AGENTS.md, CLAUDE.md, README.md, digma_SKILL v1.16.0 (lesson **F25** — an inert reference
  class is measured by its COMPUTED PAINT, not its presence; and React PORTAL events bubble
  through the React tree, so card-local dialogs need their bubble cut at the React seam), the
  plan's execution status, this log, and the worklog Task 39 entry.
- Full gate re-verified green before the commit; pushed to `main` via
  `docs/ssh_git_wrapper_v3.py` (the key shredded after).
