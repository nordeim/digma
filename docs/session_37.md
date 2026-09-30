# Session 37 — The Fifteenth Parity Audit: Dynamic Panel Contracts (S33-1 + S33-2 + S33-3)

**Date:** 2026-09-30 · **Code state at start:** `f6a1b75` (session 31 delivered; transcript
push = `docs/session_36.md`) · **Code state at end:** this commit · **Docs:** PAD v1.18.0 ·
digma_SKILL v1.17.0 (lesson F26)

## Directive

The session-31 next-steps list pointed at the reference's present-mode overlay internals and its
zoom-cluster UI chrome. The present-mode candidate dissolved on contact (its Present button
measured dead in session 29 — no overlay internals exist to audit), so the audit re-pointed at
the seam those candidates shared: the reference's properties-panel CONTROLS, which seventeen
sessions of chrome-level audits had measured as attributes and layouts but never FUNCTIONALLY —
plus the standing sweep (mobile nav, general parity).

## The audit (fifteenth consecutive)

**Baseline before any change:** workspace refreshed (`git pull` — fast-forward to `f6a1b75`),
`.env` verified with `DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root (re-seeded
→ 1 user / 2 projects / 6 elements / 1 team / 3 members), dev server healthy with the DB
anchor logged. Fast gates green: lint · typecheck · 83/83 unit. Configs verified: vitest (83)
+ playwright (93), both excluding `skills/`. The session-31 fixes (frame container, delete
confirm, portal bubbling) verified in place.

### Reference findings (live-measured, desktop 1440×900 + mobile 390×844)

- **RA-21 — the reference's Corner Radius slider is FUNCTIONAL.** Three keyboard increments
  moved it 0→3 and the selected rectangle's canvas `border-radius` followed to `3px` live.
- **RA-22 — the Fill color picker is FUNCTIONAL** (`#3b82f6 → #ef4444` repainted the element).
- **RA-23 — the Rotation slider is FUNCTIONAL** (`rotate(3deg)` appended to the transform).
- **RA-24 — the Opacity slider is FUNCTIONAL** (reached `opacity: 0.97`).
- **RA-26 — the Stroke color picker is FUNCTIONAL** (`1px solid rgb(0,255,0)` painted).
- **RA-27 — the Stroke Width slider is FUNCTIONAL** (1→2 doubled the border).
- **RA-25 — every panel mutation PERSISTS across reload** (the red fill, radius 3,
  `scale(1.2) rotate(3deg)`, and opacity 0.97 all survived) — the reference's autosave covers
  panel mutations while its NUMBER inputs stay no-ops (the session-23 measurement stands).
- **RA-29 — the Corner Radius slider's MAX is DYNAMIC: `min(w,h)/2` of the selected element
  (the decisive new datum).** Triple-measured: a 200×150 rectangle reads
  `aria-valuemax="75"` (= 150/2 — the historical "fixed 75" was THIS element's min/2); a
  46×23.366 rectangle reads `11.68298487339743` (= 23.366/2, unrounded); a 156×117 frame
  reads `58.41492436698704` (= 117/2). Every prior reading had been taken on 200×150-class
  audit rectangles — the F18 double-measurement discipline held, but both measurements sampled
  the same hidden variable (element size).
- **RA-28 — the reference's Canvas Properties Background Color control is a DEAD no-op.** The
  swatch input accepts a new value transiently, nothing on the page adopts the color, and the
  change does not survive reload (the input returns to `#0d1117`).
- **RA-30 — the fresh TEXT element renders computed `font-family: "Inter, sans-serif"`** —
  only the DEFAULT carries the fallback chain (a Roboto-selected text renders exactly
  `Roboto`, an Arial-selected text exactly `Arial`). The combobox still displays `Inter`.
  (A stale prior-session artifact rendering `Arial` was corrected by the fresh-state
  re-measure — the F18 discipline.)
- **Architecture datum (no gap):** the reference bakes the zoom into each element's own
  transform — `translate(x·zoom, y·zoom) scale(elementScale) rotate(r) scale(zoom)` —
  mathematically equivalent to the clone's wrapper approach (uniform scales commute with
  rotation).
- **R3 — mobile nav failure class A re-confirmed** at 390×844 (the **15th consecutive
  session**; evidence: `docs/screenshots/ref-audit-s32/ref-01-mobile-failure-classA.png`).

### Clone findings

- **S33-1 (Medium): the clone's Corner Radius slider max was a FIXED 75** — the reference's is
  dynamic `min(w,h)/2`. On the seeded CTA Button (160×44) the clone offered radii larger than
  half the element's height (incoherent chrome; CSS silently clamps the paint at 50%, so the
  control lied about its own range). The four per-corner inputs clamped only at ≥ 0.
- **S33-2 (Low): the clone's canvas text rendered `"Inter"` for the default** — the reference
  renders `"Inter, sans-serif"` (a fallback chain when Inter is unavailable), at all three
  render sites.
- **S33-3 (Medium): the clone's Background Color control was LIVE-ONLY.** `setBackgroundColor`
  flipped `saveState: unsaved`, the debounced autosave fired, but the PUT body carried only
  `{ elements }` — the bg never reached the server and silently reverted on reload
  (live-reproduced: set `#1a2b3c` → reload → `#0d1117`). The F19 "half-does X" class — the
  control looked complete and worked in-session but lost its consequence across the reload
  boundary.
- Verified correct (no change): the clone's panel controls all work (parity from the other
  direction), the mobile nav end-to-end at 390×844 (44×44 trigger, drawer, scroll-lock,
  tap-navigate-and-dismiss, Escape, desktop-hidden — the Tailwind v4 failure class A is NOT
  present in the clone), the frame container contract, the DB anchor, `.env`, and all three
  test configs.

## The remediation plan

`docs/remediation-plan-session33.md` — written and re-validated line-by-line against the
codebase before execution. Three slices: **Slice A** (the dynamic corner-radius max: the
`cornerRadiusMax()` helper + the slider + the per-corner clamps + the corrected historical pin),
**Slice B** (the default font's fallback chain: the `canvasFontFamily()` helper at all three
render sites), **Slice C** (the background-color persistence: the autosave PUT body + the
elements route transaction).

## The TDD execution

**RED (unit):** 5/5 failed — the `elementToStyle` default-chain test at
`expected 'Inter' to be 'Inter, sans-serif'`; the `cornerRadiusMax`/`canvasFontFamily`
describes at `TypeError: … is not a function`.

**RED (e2e):** 3/3 failed against the pre-fix build — the dynamic-max test at
`Expected: "22", Received: "75"`; the font-chain test at `Expected: "Inter, sans-serif",
Received: "Inter"`; the bg-persistence test at `Expected: "#1a2b3c", Received: "#0D1117"`.

**GREEN:** Slice A (`cornerRadiusMax(single)` → `Math.min(w, h) / 2` feeds the slider's `max`,
its onChange clamp, and the four per-corner NumberField clamps — the section's controls share
one coherent range; the historical "caps at 75" e2e pin corrected to the dynamic contract).
Slice B (`canvasFontFamily()` maps null/undefined/"Inter" → `"Inter, sans-serif"`, chosen
families verbatim — at the canvas, the thumbnail, the present overlay, and `elementToStyle`;
the combobox still displays the model value). Slice C (the autosave PUT body carries
`backgroundColor`; the elements PUT route validates it with `clampColor` and writes it inside
the SAME `$transaction` as the element replace — absent/invalid → untouched).

Full gate green: **lint · typecheck · 88 unit (+5) · build 20 routes · 28 smoke · 96 e2e
(+3).**

## The live verification (dev server, post-fix)

- The CTA Button's All Corners slider reads `max="22"` (min(160,44)/2).
- The seeded Headline renders computed `font-family: "Inter, sans-serif"`.
- The background-color flow: set `#1a2b3c` → Saved badge → reload → the hex input still reads
  `#1a2b3c` AND the canvas surface still paints `rgb(26, 43, 60)` (pre-fix: full revert) —
  then restored to `#0D1117`.
- The clone's mobile nav re-verified end-to-end at 390×844 (trigger, drawer, scroll-lock,
  tap-navigate-and-dismiss → `/Teams`, body overflow restored).

## Delivery

- The standard 16 screenshots re-captured from the remediated dev server (re-seeded first) →
  `docs/screenshots/`; audit provenance → `docs/screenshots/ref-audit-s32/` (the reference's
  mobile failure-class-A, its editor with the functional sliders, the clone's working mobile
  nav).
- `.env.example` re-verified (unchanged — no new env vars this session); included in the
  commit.
- Docs aligned: PAD v1.18.0 (revision block + ADR-011 amendment + §7.1/§7.4 counts), AGENTS.md,
  CLAUDE.md, README.md, digma_SKILL v1.17.0 (lesson **F26** — an attribute reading generalizes
  only across the element SIZES it was measured on; pin UI clamps as FUNCTIONS of the element,
  never constants; and a control that works in-session but reverts on reload is the F19
  "half-does X" class: trace the data path through the RELOAD boundary), the plan's execution
  status, this log, and the worklog Task 40 entry.
- Full gate re-verified green before the commit; pushed to `main` via
  `docs/ssh_git_wrapper_v3.py` (the key shredded after).
