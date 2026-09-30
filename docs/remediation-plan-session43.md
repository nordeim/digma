# Remediation Plan — Session 43 (the Twentieth Audit)

**Date:** 2026-09-30 · **Trigger:** the operator's session-45/session-46 directive (the session-45 suggested next steps: the reference's gradient stops' remove path, the editor's Image tool, the present mode at mobile viewports, and a functional sweep of the reference's signup/forgot SUBMIT paths — the validation states were pinned, the server round-trips never were) · **Code state at start:** `e187e53` (session 41 delivered)

## The audit method

The twentieth consecutive live parity audit on `https://digma-371dfd0d.base44.app`
(desktop 1440×900, mobile 390×844), function-first per the F19/F30 disciplines:
every control exercised through its observable consequence and its persistence
path (paint → PUT → reload → re-read), every decode live-verified before
pinning (the F28 rule). All reference mutations were reverted before the audit
closed and verified flat through a reload (the circle's solid #3b82f6 restored
through the Solid hex edit — the two-fill forced-change discipline; the
board left pristine at "Test Project One"). One probe account
(`digma.audit.probe.43@gmail.com`) was created through the reference's own
signup flow to exercise its verify-email surface (the operator-sanctioned
audit probe; no reference-side delete path exists for accounts).

## Reference findings (RA-55 … RA-61 + RA-14/Present/R3 re-confirmations)

- **RA-55 (decisive, live + bundle-decoded verbatim) — the gradient stop row
  carries a REMOVE control, gated at the two-stop minimum.** With 3+ stops,
  every stop row renders an X button: the shadcn Button ghost variant +
  `h-6 w-6 p-0 text-red-400 hover:text-red-300` carrying `lucide-x w-3 h-3`.
  The decoded guard: `i.length>2 && <Button onClick={()=>y(w)}>` — at 2 stops
  NO remove buttons render (live-measured: `btns:[0,0]` at 2, `btns:[1,1,1]`
  at 3, before AND after mouse-away — not hover-gated). Clicking remove drops
  the stop from the panel's rows immediately.
- **RA-56 (live + decoded) — the Angle section renders ONLY for Linear
  gradients.** The decoded JSX: `c.gradientType==="linear" && <div>…Angle…`.
  Live-measured: with Radial active the `[role=slider]` list carries ONLY the
  four panel sliders (stroke/rotation/scale/opacity — no 0–360 angle); the
  angle slider reappears the moment Linear is selected. A coherent design: a
  circle gradient has no direction.
- **RA-57 (decisive model decode — the reference's gradient persistence is
  the CSS STRING in `fill`, with the stops as panel-local defaults).** The
  decoded commit function: `m(type, angle)` builds
  `linear-gradient(Ndeg, color pos%, …)` / `radial-gradient(circle, …)` and
  writes it INTO the `fill` prop (+ `fillType:"gradient"`, `gradientType`,
  `gradientAngle`); the stops array is
  `useState([{position:0,color:"#3b82f6"},{position:100,color:"#8b5cf6"}])`
  — fixed defaults, NEVER hydrated from the element and never persisted.
  Consequences live-measured: the ADD button (`g`) and REMOVE (`y`) update
  ONLY the local stops state (the canvas paint does NOT change — 3 stops in
  the panel painting a 2-stop gradient); the STOP EDIT (`b`) commits through
  `m()` (it also re-fires on every subsequent commit); the type toggle and
  angle slider commit. The Tabs carry `defaultValue:"solid"` — the
  reset-to-Solid-on-selection quirk (session 41, RA-54) is decoded-confirmed.
  The clone's structured `fillGradient` JSON column with immediate commits
  and re-hydration stays the documented coherent superset (its data model
  was already the documented deviation); the reference's uncommitted
  add/remove is its own data-coherence bug and is NOT ported.
- **RA-58 (decisive, NEW surface — the signup submit transitions to a FOURTH
  auth-card state: "Verify your email").** `POST /auth/register` (200) →
  the card swaps to: the "Back to sign in" back-link, a
  `w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full` icon circle carrying
  `lucide-shield-check h-7 w-7 sm:h-8 sm:w-8 text-slate-700`, the h2
  `text-xl sm:text-2xl font-bold text-slate-900` "Verify your email", the
  paragraph `text-slate-600 text-sm sm:text-base` "We've sent a 6-digit code
  to" + `<br>` + the `font-medium text-slate-900` email, SIX single-digit
  inputs (`text-center w-10 h-11 text-base font-semibold`, `inputmode=
  "numeric"`, the first `autocomplete="one-time-code"` the rest "off") with
  AUTO-ADVANCE on type (live-measured: focus moves input[0]→input[1]), the
  helper `text-xs text-slate-500 text-center mt-3` "Enter the verification
  code sent to your email", the submit `w-full h-10 sm:h-11 bg-slate-900
  hover:bg-slate-800 text-white font-medium shadow-sm rounded-xl
  transition-all duration-200` "Verify email", and the "Didn't receive the
  code? **Resend**" row (`font-medium text-slate-700 hover:text-slate-700…`
  text-slate-700 hover:text-slate-900 — NO cooldown, live-measured
  un-disabled and timerless 2s and 4s after a resend). The wrong code →
  `POST /auth/verify-otp` 400 → the INLINE error "Invalid verification
  code. 4 attempts remaining." (`text-red-700 text-sm` — the attempts
  counter DECREMENTS per wrong code: measured 4 → 3). The resend →
  `POST /auth/resend-otp` 200 with no visible UI change.
- **RA-59 (decisive, NEW surface — the forgot submit transitions to a
  "Check your email" success card).** `POST /auth/reset-password-request`
  (200) → the card swaps to: the mail icon circle (the same
  `w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full` chrome carrying
  `lucide-mail h-7 w-7 sm:h-8 sm:w-8 text-slate-700`), the h2
  `text-xl sm:text-2xl font-bold text-slate-900` "Check your email", the
  paragraph "We've sent password reset instructions to" + `<br>` + the
  `font-medium` email, a GREEN alert (`role="alert"`, `bg-green-50/70
  border-green-200 rounded-xl p-4`, `text-green-700 text-sm`) reading
  "Please check your email for the password reset link. It may take a few
  minutes to arrive.", and a FULL-WIDTH "Back to sign in" button (`w-full
  flex items-center justify-center gap-2 text-sm text-slate-500
  hover:text-slate-700 font-medium transition-colors` + `lucide-arrow-left
  h-4 w-4`).
- **RA-60 (the sign-in error path): wrong credentials render an INLINE alert
  inside the form — no toast.** `POST /auth/login` 400 → the shadcn Alert
  base (`role="alert"`, `relative w-full border p-4 … rounded-xl`) on the
  red family (`bg-red-50/70 border-red-200`) carrying `text-red-700
  text-sm` "Invalid email or password", rendered INSIDE the form. The
  correct-password-on-UNVERIFIED-account login returns the SAME generic 400
  "Invalid email or password" (live-measured on the probe account) — the
  reference does not distinguish unverified accounts at login.
- **RA-61 (live-verified + decoded — the Image tabpanel carries a
  "Background Size" select).** The decoded JSX: rendered when
  `fillType==="image" && backgroundImage` — the label "Background Size"
  (`text-xs text-gray-300`) + a Radix Select (trigger `mt-1 bg-[#0d1117]
  border-[#30363d] text-white text-sm h-8`, options **Cover / Contain /
  Auto / Stretch** = `cover|contain|auto|"100% 100%"`, default `cover`)
  wired to the element's `backgroundSize`; the upload handler sets
  `fill=url(…)`, `fillType:"image"`, `backgroundImage`, `backgroundSize:
  "cover"`, `backgroundPosition:"center"`. Live-measured end-to-end: the
  upload painted `background-image: url(<hosted>) | background-size: cover
  | background-position: center`, and selecting Contain flipped the canvas
  paint to `background-size: contain` — a fully functional control. (The
  clone's Image tabpanel shipped with the dropzone only.)
- **RA-14 re-confirmed (20th):** the editor's Image TOOL remains dead — a
  drag on the canvas draws nothing (9 layers before and after), no dialog,
  no file input, no console error; the tool paints active-blue and sets a
  crosshair cursor.
- **Present re-confirmed dead (20th):** no fullscreen request, no overlay,
  no new tab, no network call, no error.
- **R3 re-confirmed (20th):** mobile nav failure class A at 390×844 — the
  desktop nav computes `display:none`, the ONLY header button is the
  unlabeled 36px dead bell, click → zero dialogs/menus/drawers (evidence:
  `docs/screenshots/ref-audit-s42/ref-01-mobile-dashboard-390.png`).

## Clone findings (the gaps)

- **S43-1 (High):** the GradientPanel's stop rows carry NO remove control —
  the reference's red X with its min-2 guard is missing (AGENTS.md
  documents the 8-stop cap with "no removal either").
- **S43-2 (Medium):** the Angle section always renders — the reference
  hides it for Radial gradients (RA-56).
- **S43-3 (High):** the ImagePanel has NO Background Size control — the
  reference's Cover/Contain/Auto/Stretch select (RA-61) is missing, and the
  image paint carries no background-size/position contract.
- **S43-4 (High):** the signup submit goes STRAIGHT to the dashboard — the
  reference's verify-email fourth state (RA-58) has no counterpart.
- **S43-5 (Medium):** the forgot submit shows a TOAST and stays on the form
  — the reference's check-your-email success card (RA-59) is missing.
- **S43-6 (Medium):** the login failure shows a destructive TOAST ("Sign in
  failed") — the reference renders the inline red alert "Invalid email or
  password" inside the form (RA-60).

## The remediation slices

### Slice A — the stop-remove control (S43-1)

- The pure seam `removeGradientStop(stops, index)` in `src/lib/editor.ts`:
  returns `stops.filter((_, i) => i !== index)` — guarded (at `length <= 2`
  the stops return UNCHANGED, the reference's decoded `i.length>2` guard).
- The GradientPanel's stop rows render, when `stops.length > 2`, the X
  button: shadcn ghost + `h-6 w-6 p-0 text-red-400 hover:text-red-300` +
  `lucide-x h-3 w-3`, `aria-label="Remove stop N"`.
- The remove COMMITS immediately through the store (the clone's coherent
  superset over the reference's uncommitted local state — the paint and the
  autosave PUT land at once; documented as the F2-family deviation).
- Unit: `removeGradientStop` removes the middle stop / the guard at 2 /
  keeps the array sorted by the existing invariant.
- E2E: add a stop → the X buttons render on every row → click one → the row
  count drops AND the canvas paint loses the white middle AND it persists
  through reload; at 2 stops the buttons vanish.

### Slice B — the Angle section's Linear-only gate (S43-2)

- `{gradient.type === "linear" && (…the Angle section…)}` in the
  GradientPanel (the decoded `c.gradientType==="linear"` conditional).
- E2E: with Radial active the Angle label and slider are ABSENT; switching
  to Linear restores them.

### Slice C — the Image tab's Background Size select (S43-3)

- New element field `fillImageFit String?` (prisma schema: the stored
  `cover|contain|auto|stretch` enum; the reference's `backgroundSize` with
  its `"100% 100%"` stretch value mapped at the paint seam).
- The pure seam `fillImageSizeFor(fit)` in `src/lib/editor.ts`:
  `cover→"cover" | contain→"contain" | auto→"auto" | stretch→"100% 100%"`,
  defaulting to cover for null/unknown — consumed at the ONE paint chain
  (canvas, thumbnail, present, elementToStyle): the image fill paints
  `background-size: <mapped>` + `background-position: center`.
- The ImagePanel renders, when the element carries a `fillImage`, the
  "Background Size" label + the Radix Select (the reference's trigger chrome
  `mt-1 bg-[#0d1117] border-[#30363d] text-white text-sm h-8`, options
  Cover/Contain/Auto/Stretch, the current fit checked).
- The elements route sanitize: `clampFillImageFit` (enum membership →
  null → treated as cover at the seam).
- Unit: the fit mapping (all four + the default), the sanitize.
- E2E: upload → the select renders with Cover → select Contain → the canvas
  paint flips to `background-size: contain` → persists through reload →
  the Solid hex edit still clears everything.

### Slice D — the sign-in inline error alert (S43-6)

- The login-screen renders, on a failed sign-in, the reference's inline
  alert INSIDE the form (above the submit row): `role="alert"` + the
  `border bg-red-50/70 border-red-200 rounded-xl p-4` chrome + the
  `text-red-700 text-sm` message "Invalid email or password" (the
  reference's exact text; the route's message aligned to it).
- The error TOAST retires for the auth failure path (the reference shows no
  toast — measured).
- E2E: submit wrong credentials → the alert renders with the exact text →
  no destructive toast → a correct login still navigates.

### Slice E — the forgot submit's check-your-email state (S43-5)

- New mode `"sent"` after the forgot submit: the reference's success card
  verbatim (RA-59) — the mail icon circle, the h2 "Check your email", the
  "We've sent password reset instructions to" paragraph with the
  `font-medium` email, the green alert, and the FULL-WIDTH "Back to sign
  in" button. The email input's value carries into the paragraph.
- The self-hosted deviation: no email is actually sent (no mail service in
  the clone) — the card is the UI-state port; the deviation is documented
  (the reference's own card claims an email that the clone cannot send).
- E2E: forgot submit → the success card renders (icon/h2/email/alert
  text) → "Back to sign in" returns to the sign-in card.

### Slice F — the signup's verify-email state (S43-4)

- Schema: `User` += `verified Boolean @default(true)` (the seeded demo
  account stays pre-verified — no seed change), `verifyCode String?`,
  `verifyAttempts Int @default(0)`.
- `POST /api/auth/register`: creates the user with `verified:false` +
  `verifyCode` = 6 random digits; NO session cookie; returns
  `{ user, verificationCode }` — the SELF-HOSTED delivery: no email
  service, so the code travels in the response and renders in the card's
  info alert (the documented deviation, the deterministic e2e seam).
- New `POST /api/auth/verify-otp` `{ email, code }`: match →
  `verified:true`, `verifyCode:null`, the session cookie set, `{ user }`;
  mismatch → `verifyAttempts++` → 400 "Invalid verification code. N
  attempts remaining." (N = 5 − attempts, matching the reference's
  decrement); at attempts ≥ 5 → 400 "Too many attempts. Request a new
  code." (the reference's exhausted state unmeasured — the coherent
  message); both rate-limited.
- New `POST /api/auth/resend-otp` `{ email }`: regenerates the code, resets
  the attempts → `{ verificationCode }`; rate-limited; NO cooldown (the
  reference's measured timerless resend).
- `POST /api/auth/login`: the password-verified-but-UNVERIFIED account →
  403 `VERIFY_EMAIL` carrying a fresh code — the client re-opens the verify
  card (the clone's WORKING SUPERSET over the reference's generic dead-end:
  its own unverified login returns the same generic "Invalid email or
  password" with no path back to the card; the clone keeps the working
  recovery path — the mobile-nav/eye-toggle superset family, documented).
- The client: the new mode `"verify"` — the reference's card verbatim
  (RA-58): the back-link, the shield-check circle, the h2, the email
  paragraph, the SIX `w-10 h-11` auto-advancing inputs (keyboard: digits
  advance, Backspace on empty retreats, Arrow keys move, paste fills the
  row), the helper line, the slate-900 submit, the Resend row, the
  wrong-code inline error (the attempts counter), and the self-hosted
  delivery note (an info alert carrying the code).
- The demo flow is unchanged (the seeded account is pre-verified; the
  login and all existing journeys keep their contracts).
- E2E: signup → the verify card renders (the icon/h2/6 inputs/the code
  note) → a wrong code → "Invalid verification code. 4 attempts
  remaining." → the correct code → the session lands → the dashboard →
  the new account appears; Resend → a fresh code verifies; the demo login
  unaffected.

### Docs

- PAD v1.23.0 (the revision block + §7.1 + §7.4 counts + the ADR-014
  email-verification deviation + the key-files rows), AGENTS.md (the
  gradient-remove/Angle-gate/Background-Size/auth-state bullets + counts),
  CLAUDE.md (ditto + the pin inventory), README.md (the properties/auth
  rows), digma_SKILL.md v1.22.0 (lesson F31), the plan's execution status,
  `docs/session_47.md`, the repo worklog. `.env.example` unchanged (no new
  env vars).

## Validation against the codebase (pre-execution)

- `src/lib/editor.ts` exports the session-41 seam family
  (`defaultGradient/gradientCss/addGradientStop/parseGradient/fillPaintFor`)
  at lines 350–430 — Slice A adds `removeGradientStop` beside them; Slice C
  adds `fillImageSizeFor` + the `fillImageFit` handling in `fillPaintFor`.
- `src/components/editor/properties-panel.tsx`: `GradientPanel` (line 243)
  renders the Angle section unconditionally (line 282–300 — Slice B's
  conditional wraps it) and the stop rows without remove buttons (line
  316–340 — Slice A appends the X button); `ImagePanel` (line 356) renders
  the dropzone only (Slice C appends the select under it, gated on
  `element.fillImage`).
- `prisma/schema.prisma`: `DesignElement` carries `fillGradient`/`fillImage`
  (lines 57–58) — Slice C adds `fillImageFit` beside them; `User` (line 16)
  gains the three verification fields (Slice F).
- `src/app/api/auth/register/route.ts` (49 lines): the session-cookie set
  (line 46) retires per Slice F; `login/route.ts` (33 lines): the unverified
  branch + the message alignment land here; the two new routes join the
  rate-limited family.
- `src/components/login-screen.tsx` (360 lines): `AuthMode` (line 10)
  extends to `"verify" | "sent"`; the minimal-card family (line 96) carries
  the two new states.
- The existing auth e2e pins are chrome/validation tests (no
  register-submit round-trip) — Slice F breaks no existing pin; the
  login-failure path is un-pinned (Slice D adds the first).
- The paint chain consumers: `elementToStyle` (lib), the canvas
  `CanvasElement`, the thumbnail, the present overlay — Slice C's
  background-size lands at each through the ONE `fillPaintFor` seam.

## Execution status (end of session 43)

**All six slices EXECUTED and GREEN.** TDD order held: unit RED first (10
new checks at their exact assertions — the missing
`removeGradientStop`/`fillImageSizeFor`/`clampFillImageFit` exports and the
`fillPaintFor` image-fit contract), then the schema push + the GREEN
implementation; e2e RED verified against the PRE-FIX BUILD via the
git-stash discipline (`git stash push src prisma/schema.prisma
scripts/smoke-test.sh src/lib/editor.test.ts` → regenerate → build → run →
**6/6 new pins failed at their exact assertions** while the 68 pre-existing
pins in the two touched specs passed (no collateral) → pop → rebuild →
green).

**The GREEN phase caught ONE implementation flaw (lesson F31):** the
canvas's key-by-key paint assignment (`if (paint.x) style.x = paint.x`)
DROPPED the new `backgroundSize`/`backgroundPosition` keys — the thumbnail
and present sites use the object spread and picked them up automatically,
but the canvas (and the same pattern in `elementToStyle`) assigned
key-by-key; the RA-61 pin's computed `background-size` read "auto" until
both assignments were extended. **One pin-side locator fix:** the RA-59
"no top back-link" assertion initially matched the bottom full-width back
button too (the SAME accessible name) — scoped to `button.-mb-2`.

**En-route ops catches:**
1. The exported-shell `DATABASE_URL` trap at the SMOKE layer — the smoke
   server inherited the parent shell's absolute URL and created an EMPTY
   database (`The table main.User does not exist`, every auth route 500);
   re-run with `unset DATABASE_URL && ./scripts/smoke-test.sh` in the SAME
   command; documented in AGENTS/CLAUDE/PAD §7.4.
2. The prisma db push initially created the wrong-path DB (the same trap at
   the CLI layer) — deleted, re-pushed with the same-command unset.

**GREEN summary:** Slice A (`removeGradientStop` + the X buttons above the
two-stop minimum, committing immediately through the store). Slice B (the
Angle section's `{gradient.type === "linear" && …}` gate). Slice C (the
`fillImageFit` column + `fillImageSizeFor`/`clampFillImageFit` seams + the
select + the four-key paint chain at canvas/thumbnail/present +
`elementToStyle`). Slice D (the inline `role=alert` red alert with the
route's aligned "Invalid email or password"; the toast retired). Slice E
(the `"sent"` check-your-email card with the green alert + the full-width
bottom back button). Slice F (the `"verify"` card + the register/verify/
resend route trio + the login's UNVERIFIED recovery branch + the seeded
accounts pre-verified via `@default(true)` — no seed change).

**Full gate green: 117 unit (+10) · build 20 routes · 35 smoke (+7) · 128
e2e (+5).**

**Live verification (dev server, post-fix):** the wrong-credentials login
renders the inline "Invalid email or password" alert; the forgot submit
transitions to the check-your-email card (h2 + green alert + the 368px
full-width back button, no top link); the signup transitions to the
verify-email card (h2 + six inputs + the code note "…your verification
code is 568718"); the wrong code renders "Invalid verification code. 4
attempts remaining."; the correct code lands the session and the dashboard
greets the new account; the CTA's Gradient tab shows 0 remove buttons at
two stops → 3 at three stops (the 24×24 red X) → the remove drops the row
AND repaints the 2-stop chain instantly; Radial hides the Angle section
while the radial paint lands; the Image tab's upload paints cover + center
with the select reading "Cover", and Contain flips the computed
background-size live. The clone's mobile nav re-verified live at 390×844
(the Tailwind v4 failure class A remains NOT present — the 20th session).
The standard 16 screenshots re-captured (1440×900 / 390×844 / 768×900) +
the ref-audit-s42 provenance (4 reference shots + 5 clone verification
shots).
