# Session 47 — The Twentieth Parity Audit: The Whole-Component Decode + the
Auth Submit Round-Trips (S43-1 + S43-2 + S43-3 + S43-4 + S43-5 + S43-6)

**Date:** 2026-09-30 · **Code state at start:** `e187e53` (session 41
delivered; transcript push = `docs/session_46.md`) · **Code state at end:**
this commit · **Docs:** PAD v1.23.0 · digma_SKILL v1.22.0 (lesson F31)

## Directive

The session-45 suggested next steps pointed at four never-swept surfaces:
the reference's gradient stops' remove path (a bundle-decode of its
stop-row JSX would settle whether a hover-trash exists), the editor's Image
tool (RA-14 measured dead — but now that the clone paints image fills, an
Image-tool pipeline would be its own superset), the present mode's chrome
at mobile viewports, and a functional sweep of the reference's
signup/forgot SUBMIT paths (the validation states were pinned; the server
round-trips never were). The standing sweeps (mobile nav, general parity)
ran as usual.

## The audit (twentieth consecutive)

**Baseline before any change:** workspace refreshed (`git pull` —
fast-forward to `e187e53`, bringing in the operator's
`docs/session_46.md` transcript push), `.env` verified with
`DATABASE_URL="file:../db/custom.db"`, `db/` at the repo root, dev server
healthy. Fast gates green: lint · typecheck · 107/107 unit. Configs
verified: vitest + playwright, both excluding `skills/`. The session-41
fixes (the fill tabs, the inline rename, the gradient avatar pair) verified
in place.

**The method — the whole-component decode:** where the DOM sweep left
ambiguity, the reference's ENTIRE `j4` GradientPanel function was
extracted from the shipped bundle (`assets/index-CFEZghM7.js`) — the
handlers' bodies (`m`/`g`/`y`/`b`) proved more decisive than any
interaction. Every decoded contract was live-verified before pinning (the
F28 rule); every control was exercised through its observable consequence
and its persistence path (paint → PUT → reload → re-read). All reference
mutations were reverted before the audit closed (the circle's gradient
probes cleared through the Solid hex edit and verified flat through a
reload — the two-fill forced-change discipline after one reload raced the
debounced autosave; the board left pristine at "Test Project One"). One
probe account (`digma.audit.probe.43@gmail.com`) was created through the
reference's own signup flow to exercise its verify-email surface.

### Reference findings (live-measured; desktop 1440×900, mobile 390×844)

- **RA-55 (decisive, live + decoded verbatim): the gradient stop rows
  carry a REMOVE control — a red X gated at the two-stop minimum.** With
  3+ stops every row renders the shadcn ghost variant + `h-6 w-6 p-0
  text-red-400 hover:text-red-300` carrying `lucide-x w-3 h-3`; the decoded
  guard is `i.length>2 && <Button onClick={()=>y(w)}>`. Live-measured:
  `btns:[0,0]` at two stops, `[1,1,1]` at three, before AND after
  mouse-away (not hover-gated); clicking remove drops the row immediately.
- **RA-57 (the model decode): the reference's gradient persistence is the
  CSS STRING in `fill`.** The decoded commit function `m(type, angle)`
  builds `linear-gradient(Ndeg, …)` / `radial-gradient(circle, …)` and
  writes it INTO the `fill` prop (+ `fillType`, `gradientType`,
  `gradientAngle`); the stops array is `useState([{position:0,
  color:"#3b82f6"},{position:100,color:"#8b5cf6"}])` — fixed defaults,
  never hydrated, never persisted. The ADD (`g`) and REMOVE (`y`) update
  only the local state — live-measured: 3 stops in the panel painting a
  2-stop gradient until the next committing control fires (the STOP EDIT
  `b`, the type toggle, or the angle slider commit through `m()`).
- **RA-56 (live + decoded): the Angle section renders ONLY for Linear
  gradients** (`c.gradientType==="linear" && …`) — with Radial active the
  0–360 slider is absent from the DOM entirely.
- **RA-61 (live-verified end-to-end + decoded): the Image tabpanel carries
  a functional Background Size select** — rendered when
  `fillType==="image" && backgroundImage`: a Radix Select (trigger `mt-1
  bg-[#0d1117] border-[#30363d] text-white text-sm h-8`, options Cover /
  Contain / Auto / Stretch) over `backgroundSize` (the upload handler sets
  `fill=url(…)`, `backgroundImage`, `backgroundSize:"cover"`,
  `backgroundPosition:"center"`). Live: the upload painted cover + center;
  selecting Contain flipped the canvas paint to `background-size:
  contain`.
- **RA-58 (decisive, NEW surface): the signup submit transitions to a
  FOURTH auth-card state — "Verify your email."** The register (200) swaps
  the card to the shield-check icon circle, the h2, the email paragraph,
  SIX auto-advancing `w-10 h-11` digit inputs, the helper line, the
  slate-900 "Verify email" submit, and the timerless "Didn't receive the
  code? Resend" row. The wrong code → `POST /auth/verify-otp` 400 → the
  inline "Invalid verification code. 4 attempts remaining." (the counter
  decrements — measured 4→3, five total); the resend → `POST
  /auth/resend-otp` 200 with NO cooldown and no UI change. The login on a
  correct-password-but-UNVERIFIED account returns the SAME generic 400
  "Invalid email or password" — a dead end with no path back to the card.
- **RA-59 (decisive, NEW surface): the forgot submit transitions to a
  "Check your email" success card** — the mail icon circle, the h2, the
  email paragraph, the GREEN alert (`bg-green-50/70 border-green-200` +
  "Please check your email for the password reset link. It may take a few
  minutes to arrive."), and a FULL-WIDTH bottom "Back to sign in" button
  (no top back-link on this state).
- **RA-60: the sign-in failure renders an INLINE alert inside the form** —
  `role=alert`, `bg-red-50/70 border-red-200 rounded-xl p-4`, `text-red-700
  text-sm`, "Invalid email or password"; NO toast.
- **RA-14 re-confirmed (20th): the Image TOOL is dead** (a drag draws
  nothing; no dialog, no file input, no error). **Present re-confirmed
  dead (20th). R3 re-confirmed (20th): mobile nav failure class A** (the
  dead unlabeled 36px bell; evidence:
  `docs/screenshots/ref-audit-s42/ref-01-mobile-dashboard-390.png`).

### Clone findings

- **S43-1 (High):** no stop-remove control (the 8-stop cap had no
  removal). **S43-2 (Medium):** the Angle section always rendered.
  **S43-3 (High):** no Background Size select — no background-size
  contract in the paint chain. **S43-4 (High):** the signup went straight
  to the dashboard — no verify-email state. **S43-5 (Medium):** the forgot
  submit toasted and stayed on the form. **S43-6 (Medium):** the login
  failure toasted "Sign in failed" instead of the inline alert.

## The remediation plan

`docs/remediation-plan-session43.md` — written and re-validated
line-by-line against the codebase before execution. Six slices: **A** (the
`removeGradientStop` seam + the X buttons above the two-stop minimum),
**B** (the Angle Linear-only gate), **C** (the `fillImageFit` column + the
`fillImageSizeFor`/`clampFillImageFit` seams + the select + the four-key
paint chain), **D** (the inline sign-in error alert), **E** (the
check-your-email success card), **F** (the verify-email state + the
register/verify-otp/resend-otp route trio + the login's UNVERIFIED
recovery branch — the self-hosted in-app code delivery documented as
ADR-014).

## The TDD execution

**RED (unit):** 10 new checks at their exact assertions (the missing
exports and the fillPaintFor image-fit contract).

**RED (e2e):** the git-stash discipline — 6/6 new pins failed at their
exact assertions against the PRE-FIX BUILD while the 68 pre-existing pins
in the two touched specs passed (no collateral). The pre-fix failures: the
toast showed instead of the inline alert (twice); the register went
straight to the dashboard; the remove buttons were absent; the Angle
section rendered for Radial; the select was absent.

**The GREEN phase caught ONE implementation flaw (lesson F31):** the
canvas's key-by-key paint assignment dropped the new
`backgroundSize`/`backgroundPosition` keys — the thumbnail/present sites
use the spread and picked them up; the computed `background-size` read
"auto" until the canvas's and `elementToStyle`'s assignments were
extended. One pin-side locator fix: the RA-59 "no top back-link" assertion
initially matched the bottom back button too (the same accessible name) —
scoped to `button.-mb-2`.

**GREEN:** all six slices landed (see the plan's execution status).
**En-route ops catches:** the exported-shell `DATABASE_URL` trap at the
SMOKE layer (the smoke server created an EMPTY database — every auth route
500'd with `The table main.User does not exist`; the same-command unset
discipline applied and documented); the prisma CLI variant of the same
trap caught at db push.

Full gate green: **lint · typecheck · 117 unit (+10) · build 20 routes ·
35 smoke (+7) · 128 e2e (+5).**

## The live verification (dev server, post-fix)

- The wrong-credentials login renders the inline "Invalid email or
  password" alert (`border-red-200 bg-red-50/70`); no toast.
- The forgot submit transitions to the check-your-email card (the h2, the
  green alert, the 368px full-width back button; no top link).
- The signup transitions to the verify-email card (the h2, six inputs, the
  code note "…your verification code is 568718"); the wrong code renders
  "Invalid verification code. 4 attempts remaining."; the correct code
  lands the session and the dashboard greets the new account.
- The CTA's Gradient tab: 0 remove buttons at two stops → 3 at three stops
  (the 24×24 red X) → the remove drops the row AND repaints the 2-stop
  chain instantly; Radial hides the Angle section while the radial paint
  lands; Linear restores it.
- The Image tab's upload paints cover + center with the select reading
  "Cover"; Contain flips the computed background-size live.
- The clone's mobile nav re-verified at 390×844 (the drawer opens, the
  three links render; the Tailwind v4 failure class A remains NOT present
  — the 20th session).

## Delivery

- The standard 16 screenshots re-captured from the remediated dev server
  (every dimension verified — 1440×900, 390×844, 768×900) →
  `docs/screenshots/`; the audit provenance →
  `docs/screenshots/ref-audit-s42/` (the reference's mobile-dashboard /
  gradient-stop-remove / verify-email-error / check-email-success shots +
  the clone's check-email / verify-email / stop-remove / radial-no-angle /
  background-size verification shots).
- `.env.example` re-verified (unchanged — no new env vars; the
  verification flow needs no configuration); included in the commit.
- Docs aligned: PAD v1.23.0 (the revision block + §7.1 + §7.4 + ADR-014 +
  the key-files rows + the ADR-013 consequence amendment), AGENTS.md (the
  fill-tab remove/Angle-gate/Background-Size bullets + the five-state auth
  bullet + the counts + the smoke DATABASE_URL trap + the e2e auth-call
  budget), CLAUDE.md (ditto + the pin inventory), README.md (the
  properties-panel and auth rows + the counts), digma_SKILL v1.22.0
  (lesson **F31** — decode the whole component function; the seam-key
  threading through every consumer; the same-name locator ambiguity; the
  smoke-suite DATABASE_URL trap), the plan's execution status, this log,
  and the worklog Task 45 entry.
- Full gate re-verified green before the commit; pushed to `main` via
  `docs/ssh_git_wrapper_v3.py` (the key shredded after).

## Suggested next steps

The reference's still-unaudited surfaces worth a twenty-first session: the
verify-email flow's SUCCESS path on the reference (a real OTP was never
deliverable — the probe account's code went to an unreadable inbox; the
success-state UI and the post-verify redirect remain unmeasured), the
present mode's mobile chrome on the CLONE side (the reference's Present is
dead — the clone's overlay is pure superset; a mobile-viewport pass over
the clone's own overlay would be polish, not parity), the reference's
password-RESET landing page (the reset email's link target — if it renders
a card state the clone lacks), or a functional sweep of the reference's
team-invite accept flow (the emails invite members — the accept path's UI
is unaudited).
