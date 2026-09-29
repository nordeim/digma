# Digma — Session 15 Remediation Plan (v1.9.0 target)

**Date:** 2026-09-29 · **Input:** sixth live parity audit of `https://digma-371dfd0d.base44.app/`
vs the local clone (dev server, post-session-14 code @ `88f93de`), desktop 1440×900 and
mobile 390×844, DOM/computed-style level (post-hydration, 4–10 s settles) + VLM
screenshot cross-checks + zoom-crop forensics + SVG-path evidence. **Method:** every
finding below was verified in BOTH apps' DOM before entering this plan, and the plan
was re-validated line-by-line against the codebase before execution.

---

## Context

Session 14 (commit `c5e5b6a` + `88f93de`, PAD v1.8.0) restored the AI-assistant
suggestions line (the session-8 misread reversed) and recorded the fifth consecutive
full parity audit. This session re-audited with fresh eyes (the sixth audit), applying
the F16 discipline (negative claims re-measured) and — new this session — auditing
DIALOG and PANEL interiors at the same DOM depth as pages. That dialog-level depth is
where the findings live: the page-level chrome (nav, hero, cards, editor shell, auth
states) all re-verified at parity, but the Create-project dialog's template grid, the
color-swatch selected state, and the properties panel's slider suite carry
measurable gaps.

The baseline full gate was re-run green BEFORE any change: lint ✅ · typecheck ✅ ·
72/72 unit ✅ · build 20 routes ✅ · 28/28 smoke ✅ (dev stopped) · 54/54 e2e ✅.

### Verified parity-hold (no change — the sixth consecutive audit)

- **Nav pill exact-match scope** (session-12 fix holds): no pill at `/`, pill on
  `/Dashboard`, `/Recent`, `/Teams` — re-measured settled this session.
- **Mobile navigation** (the operator-flagged surface): the reference STILL ships
  Tailwind v4 failure class A at 390×844 (nav `display:none`, no hamburger — its one
  header button is the 36×36 notifications bell). The clone's fix re-verified
  END-TO-END: 44×44 trigger with stable `aria-label="Navigation menu"` +
  `aria-expanded` + `aria-controls`, drawer with all three links,
  `data-scroll-locked` body, tap "Recent" → navigates AND dismisses; tablet 768
  (nav visible, no burger) clean.
- **The AI assistant panel** (the session-14 fix holds): the `Try:` suggestions line
  verified in the reference DOM this session (exact text + wrapper/form/sibling
  structure identical in both apps); the no-crash contract verified live on the
  clone ("Add 3 colored circles" → reply + 3 canvas elements + zero JS errors).
- **Editor chrome**: 9-tool rail (identical titles measured both apps), zoom
  cluster, top bar (Share/Present + Saved pill), panel chips default ON/OFF/ON,
  canvas grid, layers panel.
- **Auth 3 states** (ADR-013): sign-in branded card; sign-up minimal card
  ("Create your account" h2, "Back to sign in", Confirm Password "Re-enter
  password", Password "Min. 8 characters", no name field, no logo, no social);
  forgot ("Reset your password", email-only, "Send reset link") — all verified in
  both DOMs.
- **Login page (F16 re-verification of the negative pins):** nothing renders below
  the login card (measured: zero text nodes below the card rect in the reference),
  no demo-account hint, the brand chip carries the mark on the black field with no
  gradient backing (the reference's hosted mark URL unchanged from session 12 —
  pixel-verified identical then; the clone's SVG recreation stays pinned).
- **Dashboard / Recent / Teams chrome**: hero gradient, glass stats card, Create
  New Design opens the same-titled dialog with the same fields (name input "My
  Awesome Design", Description textarea "Describe your project...", Background
  Color row with the same four presets + custom picker, Choose Template grid with
  identical Unsplash thumbnails, Cancel/Create Project buttons with the same
  purple→pink gradient), `#171717` active view toggles, flat Teams main +
  `rgb(37,99,235)` Create Team, Recent subtitle.
- **The reference's no-ops re-confirmed** (documented deliberate supersets in the
  clone): Create Team button (no dialog/toast/navigation), project-card ellipsis
  (no menu), Explore Templates (no dialog/toast/navigation), Fill's Gradient/Image
  tabs (data-state stays inactive — the tab control is broken in the reference).
- **VLM false alarms investigated and dismissed via DOM** (the documented
  discipline): the dashboard pair's differences are all data-content (account
  name, stats counts, thumbnails — different accounts); the editor pair's "icon
  difference" (the lucide-image icon reads as a "frame" at 16px) and "cursor
  overlay"; the "All Projects missing" flag (the section heading sits at y=795,
  its grid extends past the fold); the extra "N" avatar (the dev-only Next.js
  overlay, absent in production builds).

### Findings (all verified in both DOMs / with SVG-path evidence)

| # | Finding | Severity |
|---|---------|----------|
| S15-1 | **Create-dialog template card icons.** The reference renders a distinct lucide icon per template card — `file-text` (Blank Canvas), `smartphone` (Mobile App), `monitor` (Desktop App), `globe` (Website) — classes `w-3 h-3 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0`, with NO selected/unselected opacity variation. The clone renders `Plus` on all four cards (SVG path `M5 12h14`/`M12 5v14` measured on the clone vs the reference's per-card document/sphere paths) and dims unselected icons to `opacity-40`. | **High** |
| S15-2 | **Create-dialog color-swatch selected check.** The reference renders a `Check` SVG (`lucide-check w-4 h-4 sm:w-5 sm:h-5`, `style="color: white"`) inside the selected preset swatch; the unselected swatches are empty. The clone renders a text character `✓` at `text-xs` (12px, font glyph). Border colors match (purple-500 on selected, gray-200 off — class vs inline-style, same computed paint). | **Medium** |
| S15-3 | **Properties-panel sliders + row structures.** The reference's five slider rows (Radix sliders: 6px `rounded-full bg-primary/20` track with a `bg-primary` fill, 16px white thumb with `1px solid rgba(23,23,23,0.5)` border, `shadow` measured transparent) vs the clone's native `accent-blue-600` range inputs (blue platform thumb — VLM-confirmed visible difference on zoom crops). Row structures measured per section: All Corners `flex items-center gap-2 mt-1` + `w-8 text-right` numeric readout; Stroke Width same + `w-8` readout; Rotation `flex items-center gap-3 mt-2` + `w-16` number input + `°` suffix div; Scale `flex items-center gap-3 mt-2` + `w-12` "1.0x" readout; Opacity — **no label** — `flex items-center gap-3` + `w-16` number input + `%` suffix div. The clone: SliderRow rows use `mt-2 gap-3` everywhere, the Rotation row lacks the `°` suffix, and the Opacity row carries a label + a `w-8` "100%" readout instead of the editable number input + `%` suffix. | **Medium** |
| S15-4 | **Corner-radius slider max.** Reference `aria-valuemax="50"`; clone `max={75}` (and clamps to 75). | **Low-Med** |
| S15-5 | **Fill & Stroke mode pills.** The reference renders a segmented control: a `h-9 items-center justify-center rounded-lg p-1 grid w-full grid-cols-3 bg-[#30363d]` tablist track with `rounded-md px-3 py-1 text-xs font-medium` tabs, the active tab carrying `bg-background text-foreground shadow` (white on dark). The clone renders three separate `rounded-md` buttons in a `mb-3 flex gap-1` row with `bg-blue-600 text-white` active. | **Medium** |
| S15-6 | **Stroke Width control.** The reference: a slider row (label + Radix slider min 0 max 20 + `w-8` readout, default 1). The clone: a plain `NumberField` (number input, no slider). | **Low-Med** |
| S15-7 | **Create Project button icon.** The reference's submit button is text-only ("Create Project"); the clone prepends a `<Plus />` icon. (The gradient — `rgb(147,51,234) → rgb(219,39,119)` — matches.) | **Low** |
| S15-8 | **Docs record the wrong facts.** AGENTS/CLAUDE/README/PAD document "slider 0–75" for corner radius (the reference is 0–50); the docs describe the Fill pills and stroke-width control loosely (no segmented-control/slider facts); `digma_SKILL.md`'s properties-panel rows miss the same. | **Low** |

---

## P1 — Code changes (TDD, two slices)

### Slice A — the Create-project dialog (S15-1, S15-2, S15-7)

**Files:** `src/components/project-card.tsx` (the template-card grid ~lines 485–524,
the color-swatch row ~lines 440–478, the submit button ~line 537).

- **S15-1:** import `FileText`, `Smartphone`, `Monitor`, `Globe` from `lucide-react`;
  render per-template icons via a local `TEMPLATE_ICONS` map keyed by the
  `TEMPLATE_META` keys (`blank | mobile | desktop | website`); icon classes
  `h-3 w-3 flex-shrink-0 text-purple-600 sm:h-4 sm:w-4`; REMOVE the
  `selected ? "opacity-100" : "opacity-40"` variation (the reference shows the
  same icon at opacity 1 in both states).
- **S15-2:** replace `<span className="text-xs text-white">✓</span>` (line 460)
  with `<Check className="h-4 w-4 text-white sm:h-5 sm:w-5" aria-hidden />`
  (import `Check` from lucide-react — the measured reference icon).
- **S15-7:** drop the `<Plus />` from the submit button (text-only, like the
  reference).
- **Tests (RED first):** `tests/e2e/parity.spec.ts` — one new test
  ("the create-project dialog follows the reference's template-card + swatch +
  submit chrome (session 15)") asserting: each template card's title row carries
  the correct lucide icon (`svg.lucide-file-text` on Blank Canvas,
  `svg.lucide-smartphone` on Mobile App, `svg.lucide-monitor` on Desktop App,
  `svg.lucide-globe` on Website); no `svg.lucide-plus` anywhere in the dialog;
  the icons compute to opacity 1 in both selected and unselected states; the
  selected color swatch contains an `svg.lucide-check` (and no `✓` text node);
  the Create Project button contains no svg.

### Slice B — the properties panel (S15-3, S15-4, S15-5, S15-6)

**Files:** `src/components/editor/properties-panel.tsx` (SliderRow, the radius /
stroke-width / rotation / scale / opacity rows, the Fill & Stroke pills) +
`src/app/globals.css` (the slider CSS).

- **S15-3 (visuals):** add an `editor-range` class to globals.css and apply it to
  all five range inputs (replacing `accent-blue-600`):
  - `::-webkit-slider-runnable-track`: `height: 6px; border-radius: 9999px;
    background: linear-gradient(to right, #171717 var(--range-fill, 0%),
    rgba(23,23,23,0.2) var(--range-fill, 0%))` — the measured track + fill;
  - `::-webkit-slider-thumb`: `appearance: none; height: 16px; width: 16px;
    border-radius: 9999px; background: #fff; border: 1px solid
    rgba(23,23,23,0.5); margin-top: -5px` — the measured thumb;
  - `::-moz-range-track` / `::-moz-range-progress` / `::-moz-range-thumb`
    equivalents (Firefox centers the thumb natively; the progress pseudo carries
    the fill);
  - each slider sets `style={{ "--range-fill": "<pct>%" }}` from its
    value/min/max so the fill length matches the reference's `bg-primary` span.
- **S15-3 (rows):** SliderRow container → `mt-1 flex items-center gap-2`; the
  Rotation row → `mt-2 flex items-center gap-3` + append the `°` suffix div
  (`text-xs text-gray-300`); the Scale row stays `mt-2 gap-3` + `w-12` readout;
  the Opacity row restructured to the reference: NO label, `flex items-center
  gap-3`, slider + `w-16` editable number input (value 0–100) + `%` suffix div
  (`text-xs text-gray-300`).
- **S15-4:** radius `max={50}` + clamp 0–50 (the panel's onChange and the
  SliderRow bounds).
- **S15-5:** the Fill & Stroke pills restructured into the segmented control:
  container `mb-3 grid h-9 w-full grid-cols-3 items-center justify-center
  rounded-lg bg-[#30363d] p-1`; buttons `rounded-md px-3 py-1 text-xs font-medium
  transition-all` with the active (Solid) tab `bg-white text-gray-900 shadow` and
  the inactive tabs `text-gray-400 hover:text-white`. Behavior preserved: the
  Gradient/Image taps keep the scope-cut toast (the reference's own tabs are
  no-ops — verified this session).
- **S15-6:** Stroke Width becomes a `SliderRow` (label "Stroke Width", min 0,
  max 20, `w-8` numeric readout) replacing the `NumberField`; the readout stays
  editable-through-the-slider (the reference's row is not an editable input —
  measured: a `w-8` div readout).
- **Tests (RED first):** `tests/e2e/editor-panels.spec.ts` — a new describe
  ("properties panel reference chrome (session 15)") asserting: the radius
  slider's `max` attribute is "50"; all five sliders carry the `editor-range`
  class; the stroke-width control is a `role=slider` with min 0 / max 20 (after
  setting a stroke via the Stroke hex field); the Fill pills container carries
  the segmented-control classes and the active tab paints white
  (pixel-read backgroundColor); the Rotation row renders the `°` suffix; the
  Opacity row has no "Opacity" label span, renders a `w-16` number input and a
  `%` suffix. `tests/theme.test.ts` — extend with the slider CSS contract: the
  `editor-range` rules exist in globals.css with the measured track/thumb values
  and `accent-blue-600` is gone from the panel's range inputs (source-pin, like
  the other CSS contracts).

## P2 — Documentation alignment (post-fix)

- **PAD → v1.9.0:** new revision block (the S15-1…S15-8 findings + the
  dialog-depth lesson); the properties-panel facts updated (radius 0–50, the
  Radix-look slider contract, the segmented Fill pills, the stroke-width slider,
  the opacity row structure); §7.1/§11 counts and line-counts refreshed.
- **AGENTS.md:** the properties-panel architecture fact updated (slider 0–50,
  slider styling, segmented pills, stroke-width slider, opacity row).
- **CLAUDE.md:** the editor-panels facts ditto.
- **README.md:** the properties-panel feature row updated (radius 0–50,
  stroke-width slider, segmented Fill pills).
- **digma_SKILL.md → v1.8.0:** lesson **F17** (dialogs and panel interiors
  deserve the same DOM-level audit depth as pages — three of this session's
  four code findings lived inside a dialog the previous five audits graded by
  its shell); §17/§6 facts refreshed; counts.
- **docs/session_15.md** (this session's log) + `worklog.md` Task 31 entry.

## P3 — Delivery

- Screenshots: re-capture the standard set from the remediated dev server →
  `docs/screenshots/` (the editor views now show the reference-styled sliders +
  segmented pills); audit provenance (reference + clone pairs incl. the dialog
  closeups and the zoom-crop slider evidence) → `docs/screenshots/ref-audit-s15/`.
- `.env.example`: re-verify against the codebase (unchanged this session) —
  included in the commit.
- Environment discipline for every gate command: `env -u DATABASE_URL …`.
- Gate (dev server STOPPED before smoke): `lint → typecheck → test → build →
  ./scripts/smoke-test.sh → test:e2e` — all green before push (expected: 73+
  unit / 28 smoke / 56+ e2e).
- Push: `python3 docs/ssh_git_wrapper_v3.py --key-file <key outside repo>
  --remote git@github.com:nordeim/digma.git`, main only, per
  `docs/how-to-git-push-using-ssh-wrapper_SKILL.md`.

## Explicitly NOT changing (verified correct / deliberate)

- The mobile navigation fix (verified end-to-end again this session; the
  reference still ships failure class A).
- The nav-pill exact-match scope, the proxy redirects, the brand mark, the
  auth-card states, the palette pins, the literal-font tokens, the autosave
  replace contract, the Untitled editor, the AI degrade-not-fail pipeline
  (re-verified live this session), the toast infra — all pinned by existing
  suites.
- The clone's working supersets (Create Team dialog, card ellipsis menu with
  rename/delete, clipboard Share, Present mode, Explore Templates toast) — the
  reference's own equivalents are no-ops (re-verified this session).
- The reference's own bugs deliberately not cloned (AI crash, Tailwind CDN in
  production, no-op Create Team/ellipsis/Explore/Gradient-Image tabs, missing
  mobile nav, no-`aria-current` nav).
- The Gradient/Image fill functionality (scope cut stands; only the pill
  VISUALS change to the segmented control).
- The historical PAD revision blocks (precedent: they record what happened).
- The remaining PAD §10 scope cuts (per-corner radii, gradient fills,
  forgot-mail delivery, in-process rate limiter, session revocation) — none are
  release blockers.

---

## Execution status (end of session 16)

**All items EXECUTED and GREEN** — RED first (the 2 new unit checks failed exactly at
the `.editor-range` assertions; all 8 new e2e tests failed against the pre-fix
build), then GREEN: Slice A (`project-card.tsx` — the `TEMPLATE_ICONS` map with
file-text/smartphone/monitor/globe, the Check SVG, the text-only submit), Slice B
(`properties-panel.tsx` + `globals.css` — the `.editor-range` Radix-look CSS with
`--range-fill` fills, the SliderRow re-geometry, radius max 50, the segmented Fill
control, the stroke-width slider, the `°`/`%` suffixes, the opacity row
restructure). Live-verified in the browser post-fix (icons/check/button/sliders/
track/suffixes all match the reference's measured DOM; VLM confirms slider visual
equivalence). Full gate green: **74 unit (+2) / 28 smoke / 62 e2e (+8)**. Docs
aligned at PAD v1.9.0 / digma_SKILL v1.8.0 (lesson F17).
