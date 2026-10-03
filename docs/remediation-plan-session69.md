# Remediation Plan — Session 69 (the Seventeenth Audit)

**Date:** 2026-10-04 · **Trigger:** the operator's session-95/96-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the `.env` database contract with `db/` at the repo root, the vitest/playwright suites, the TDD remediation, the screenshots, the aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's hunk-by-hunk review of the session-68 delivery (all four
S68 seams verified intact in source at baseline: the `bodySizeRejected`
guard at all 14 parse sites with the BEFORE-parse/AFTER-gates ordering;
the marquee's `boundsOf` containment; the sanitizer's 100-id cap + the
named `AssistantUpdatePatch` with zero never-casts; the autosave's
`sessionDead` 401 terminal + the playwright pre-kill +
`reuseExistingServer: false` + the react-toast removal), then the
SEVENTEENTH Mode C audit: two independent fresh-eyes full-file reviews
by separate agents over the least-recently-reviewed surfaces — auditor A
over the editor core + client view layer (editor-view, editor-store,
canvas, properties-panel, toolbar, layers-panel, components-panel, the
AI panel, lib/editor, lib/ai-assistant, lib/call, lib/export-png, the
dashboard/recent/teams views, project-card, app-header), auditor B over
the server + lib/config/infra side (all 18 API route files, the pure lib
seams, proxy.ts, the prisma schema + seed, the test infra, the 6
configs, both auth screens — carrying the documented deferred backlog
for verification and sharpening) — against the
`skills/code-review-checklist` dimensions with the AGENTS/CLAUDE
documented contracts loaded first. Every chosen finding individually
re-verified by the lead in source before this plan (display-safe reads —
the tool-output layer eats bracket sequences, so every quoted line was
re-read with a bracket-marker viewer). The baseline gate re-proven
green BEFORE any change (lint · typecheck · 537 unit / 93 files ·
build 23 routes · 58 smoke · 230 e2e — zero drift from session 68),
the DB re-seeded to the pristine 1/2/6/1/3 contract, the parent-shell
`DATABASE_URL` trap neutralized (the `unset` discipline in every
db-touching command).

## Reference findings (45th audit — no drift, no new gaps)

The standing datums re-verified on
`https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 +
mobile 390×844, the real CDP fill login): the desktop nav 124/96/92 × 36;
the greeting "Good evening, sepnetflix2023 ✨" (the name populated, the
evening bucket); Quick Stats 1 Projects / 0 Teams / Pro Plan; the Recent
sort `last_accessed` / "1 file found"; zero kbd affordances; the
Create-Team dead chrome the 45th (2 clicks, 0 dialogs); R3 mobile nav
failure class A the 45th (nav `display:none`, links 0×0, no hamburger —
the dashboard AND the editor page; evidence `ref-audit-s79/ref-01` and
`ref-02`); the mobile editor header clipping Share/Present at 390
re-measured exactly (Share L385–R458, Present L466–R551 — byte-identical
to the session-63…68 measurement; evidence `ref-audit-s79/ref-02`); the
board at 9 layers ("9 layers" + "Test Project One", opened through the
project-card ANCHOR after the generic card probe missed — the same
first-attempt miss family as sessions 62–68). Evidence set:
`docs/screenshots/ref-audit-s79/` (ref-00 desktop dashboard, ref-01
mobile dashboard 390, ref-02 mobile editor 390, ref-03 desktop Recent
grid, ref-04 desktop editor).

The clone's mobile navigation verified live, end-to-end at 390×844 —
the 46th consecutive session, ALL GREEN via the single-call verifier
`scripts/verify-nav-s69.sh` (9/9: the 44×44 hamburger with the aria
contract at [16,10], the Sheet dialog with 44px links +
aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape
with focus return + lock release, navigate-and-dismiss, the md-crossing
close, the 768 boundary, and the class-A guard — the Tailwind v4
failure class A NOT present).

## The code audit findings (Mode C — seventeenth pass)

The session-68 delivery itself is clean (all four seams verified to
hold; the 537/58/230 gate re-proven green at baseline before any
change). The two fresh-eyes passes found **0 Critical / 0 High /
3 Medium / 10 Low / ~10 Informational** combined — every chosen
finding individually re-verified by the lead in source:

- **M-A (Medium — the PROMOTED M-class carry-over, backlog #1, verified
  + sharpened): the XFF trust model has no topology knob.**
  `src/lib/rate-limit.ts:77-84` — `clientIpOf` returns the LAST
  `x-forwarded-for` hop verbatim, falling back to `x-real-ip` ||
  "unknown". The implicit trust model is *exactly one appending proxy*:
  (a) a direct-exposure deploy — a client rotates `X-Forwarded-For` per
  request and every request keys a fresh bucket, fully bypassing the
  auth 10/15 min AND ai 20/5 min limits; (b) two or more proxy hops —
  the last hop is the innermost proxy's IP, so all users collapse into
  ONE bucket (the self-DoS family); (c) an XFF-stripping proxy
  collapses everyone into `"unknown"`. Practical impact bounded today
  only because the OTP/reset credentials ride the response (ADR-014)
  — which is itself bounded by the limiter M-A shows is bypassable.
  The knob: a deploy-declared trust depth (`DIGMA_PROXY_HOPS`, default
  1 = the current last-hop trust).
- **M-B (Medium — NEW, auditor B): `scripts/install_packages.sh` is a
  stale bootstrap that cannot build the app.** The script's explicit
  package list misses `@radix-ui/react-dropdown-menu` and
  `@radix-ui/react-tabs` (both imported by vendored ui components) and
  installs `tailwindcss-animate` (NOT in package.json — the app uses
  `tw-animate-css`). A fresh environment bootstrapped by the script
  fails to compile.
- **M-C (Medium — the documented ADR-014 posture, sharpened): the
  default-posture credential delivery + the bypassable limiter are one
  posture item.** The reset URL rides the forgot-password response to
  any caller knowing the email; the OTP code rides register/resend;
  the only bound is the rate limiter M-A shows is bypassable in a
  direct-exposure deploy. The knobs exist (`DIGMA_DISABLE_IN_APP_RESET`,
  `DIGMA_DISABLE_IN_APP_OTP`) but `docs/DEPLOYMENT.md` §3 documents
  neither — the fix is the deploy-posture documentation riding S69-A.
- **L-A (Low — NEW, the S68-D class × 8): eight dead radix
  dependencies.** `package.json` carries `@radix-ui/react-alert-dialog`,
  `react-avatar`, `react-popover`, `react-radio-group`,
  `react-scroll-area`, `react-separator`, `react-switch`,
  `react-tooltip` — zero imports each (grep-verified; live: dialog,
  dropdown-menu, tabs, select, slot, label). Same defect class the
  S68-D work removed for `react-toast`.
- **L-B (Low — NEW): the DELETE handlers bare-throw P2025 under race
  (envelope violation).** `projects/[id]/route.ts:86` and
  `teams/[id]/route.ts:65` — `await db.*.delete({ where: { id } })` with
  no catch; two concurrent DELETEs make the loser throw past the
  `{ ok, error }` envelope (the sibling PATCH handlers carry the
  S62-G catch). Also `teams/[id]/members/route.ts:41` — the member
  create bare-throws P2003 when racing a team DELETE.
- **L-C (Low — NEW, an S67-C aftershock): the login screen's OTP-knob
  dead end.** `login-screen.tsx:123` — the VERIFY_EMAIL recovery guard
  requires a truthy `body?.verificationCode`; under
  `DIGMA_DISABLE_IN_APP_OTP=1` the route answers `verificationCode:
  null` (`login/route.ts:71`), so the guard fails and an unverified
  user gets the generic inline error with NO path to the verify card —
  the knob posture locks them out of the recovery flow entirely.
  Register's sibling already degrades correctly (the `?? ""` form).
- **L-D (Low — the lead's own find): the AGENTS.md session-68 seam
  bullet is TRIPLECTATED.** Lines 94/95/96 are byte-identical (md5
  verified) — the session-68 doc-update script appended the bullet
  three times. CLAUDE.md/README/PAD are clean.
- **L-E (Low — auditor A): the layers-panel lock comment describes the
  FORBIDDEN implementation.** `layers-panel.tsx:255-257` — "the clone's
  pointer-events:none approach is the observably equivalent working
  implementation" — the exact pattern AGENTS.md forbids (the S23-1
  window bug); the real mechanism is the hit-test wall +
  `cursor-not-allowed` chrome. A maintainer "restoring" what the
  comment claims would reintroduce S23-1.
- **L-F (Low — auditor A): the layers row's keyboard activation uses
  the file's only double-cast.** `layers-panel.tsx:175` —
  `event as unknown as React.MouseEvent` (a KeyboardEvent cast to a
  MouseEvent). Benign today (only `shiftKey` is read) but it is the
  one remaining `as unknown as` in the editor core after S68-C's
  zero-cast sweep.
- **L-G (Low — verified + sharpened): DEPLOYMENT.md drift.** Line 14
  "the 14 API route handlers (20 routes total)" (actual: 18 route
  files / 23 build routes); `:103` "28 E2E checks" and `:104` "51
  Playwright checks" (actual: 58 smoke / 230 e2e); §3's env table
  documents only `DIGMA_REPO_ROOT` — none of the four `DIGMA_*` knobs;
  §5 Updating never mentions that deploying S67+ over a pre-S67 build
  one-time-evicts every session cookie (the tokenVersion deploy
  eviction); no single-tenant posture note.
- **L-H (Low — documented backlog #2, verified): the list-payload
  projection.** The LIST routes ship full element rows (incl. data-URL
  `fillImage` up to ~700 KB each) to feed the card thumbnails.
- **L-I (Low — documented backlog #3, verified): three element
  row-builders, three default conventions.** POST synthesizes
  fill/stroke; PUT nulls omitted; the client is type-aware (+ the
  sortOrder/zIndex default drifts).
- **L-J (Low — documented backlog #7, verified exactly): the lint
  gate's 27 disabled rules in 4 classes.**

### The deferred batch (documented, verified, not chosen this session)

The list-payload projection (#2/L-H — real only at self-hosted scale;
needs the bounded thumbnail payload shape), the elements row-builder
dedup + the dead schema columns (#3/#4 — one schema-push batch: POST
synthesizes vs PUT nulls vs client type-aware; `thumbnailSeed` never
read/written, `src`/`path`/`zIndex` written never read), the
ProjectCard role="button" nesting restructure (#5 — the WAI-ARIA
button pattern violation; the reference's own card is a plain div, so
the clone added the ARIA unilaterally) and its layers-row sibling
(auditor A's finding 3), the lint gate's disabled rule classes (#7 —
re-enable cheapest-first: no-undef/no-unreachable/no-debugger), the
ADR-014 enumeration-tradeoff sentence, the a11y restructure family,
the exit() double-PUT redundancy (the cleanup's second PUT — idempotent
but doubles the route load), the call.ts consolidation (four card-level
raw fetch copies — `project-card.tsx` ×3, `recent-view.tsx` ×1), the
`AssistantUpdatePatch` dead x/y fields, the canvas drag-state ordering
assumption, the line-width clamp asymmetry (draw allows line width 0;
resize/scale floor it at 1), the `SliderRow` NaN% degenerate guard, the
`?`-shortcut-before-modifier-bail edge, the TOCTOU count-then-create
soft ceilings, the verify-otp stale attempts read, the duplicated
hashPassword seam (seed vs lib/auth), the prompt-injection surface
note, and the smoke script's shared-bucket arithmetic comment (the
register2 call carries no XFF — the comment undercounts by one; folded
into S69-D as the honest-comment fix).

### Verified clean (explicitly re-checked)

The MobileNav contract in full (9/9 via the verifier, the 46th
consecutive session); the session-68 spec files real (the four unit
files + the e2e pins); the S68-A ordering at every parse site
(auditor B re-derived all 14); the auth crypto end-to-end (scrypt +
timingSafeEqual, the 4-part token, the DB-seam version comparison, no
tokenVersion leak); the creation ceilings; the dedicated `ai:` bucket;
the OTP knob at its three delivery sites; the sanitizer ids cap + the
named patch type + zero never-casts; the autosave machine's serialized
flush chain + the 401 terminal + the disposed gates; the entire gesture
seam family (S56–S66 — the flush-foreign-first arms, the foreign-ride
guard, the ownership verification, the retired focus-begins, the
surface-parameter tick, the unmount resets); the pointer wall family
(S23/S25/S27); the rotation-aware `boundsOf` (auditor A independently
re-derived the corner math); the memoization contracts; zero
XSS/injection sinks (`escapeXml` at every SVG seam, the fillImage
whitelist both sides); the `skills/` exclusion (zero imports, all four
gates); the smoke/e2e re-pinning arithmetic coherent; the proxy 307s;
the seed idempotency; the db-path anchor chain; the fail-closed
`redactDatabaseUrl`.

## The chosen session work (TDD)

### S69-A — the XFF-trust topology knob (M-A + M-C's documentation half)

The promoted M-class carry-over, closed:

1. **The depth-aware `clientIpOf`:** `src/lib/rate-limit.ts` gains the
   exported pure `proxyHopDepth()` (reads `DIGMA_PROXY_HOPS`; unset or
   unparsable → 1; negative → 1) and `clientIpOf` keys on
   `hops[hops.length - depth]`:
   - depth 0: ignore `x-forwarded-for` AND `x-real-ip` entirely →
     `"unknown"` (the direct-exposure posture: one honest shared bucket
     instead of a fully bypassable per-request rotation);
   - depth N≥1: the hop added by the Nth trusted appending proxy —
     depth 1 = the LAST hop (the standing S62-D behavior, the default);
   - a short list (`hops.length < depth`): `"unknown"` (fail closed —
     an attacker sending a 1-value XFF under depth 2 cannot rotate
     buckets);
   - the `x-real-ip` fallback only at depth ≥ 1 and only when XFF is
     absent (the standing behavior preserved at the default).
   The default is 1 so EVERY existing pin survives byte-identically
   (the e2e/smoke suites' single-value XFF is the last hop — the key
   at depth 1). The doc comment updated honestly: the S62-D last-hop
   doctrine becomes the depth-1 default of the declared-trust family.
2. **`.env.example`:** the `DIGMA_PROXY_HOPS` knob documented (the
   trust-depth paragraph: 0 = direct exposure, N = N appending proxies).
3. **`docs/DEPLOYMENT.md`:** §2 the trust-assumption sentence (declare
   the proxy topology you actually run); §3 the `DIGMA_PROXY_HOPS` row
   + the `DIGMA_DISABLE_IN_APP_RESET` / `DIGMA_DISABLE_IN_APP_OTP` /
   `DIGMA_DISABLE_AI_LLM` rows + the public-deploy mandatory-knob
   posture sentence (M-C: with the knobs unset, email knowledge +
   a direct-exposure deploy is an account-takeover primitive).
4. **Unit pins (`tests/proxy-hops-s69.test.ts`):** the behavioral
   family — depth 0 ignores a rotating XFF (every request keys
   `"unknown"`); depth 1 returns the last hop (the standing contract);
   depth 2 returns the second-from-last; a short list fails closed;
   the x-real-ip fallback applies only at depth ≥ 1 with XFF absent;
   the unset-env default = 1; the unparsable/negative forms clamp to 1
   — plus the source contract (the env read + the exported depth
   seam) and the preservation pins (the S62-D single-value form).

### S69-B — the dependency/bootstrap hygiene batch (M-B + L-A)

1. **The 8 dead radix dependencies removed** from `package.json` (+
   `bun install` regenerates `bun.lock`) — the S68-D react-toast
   precedent × 8: `react-alert-dialog`, `react-avatar`,
   `react-popover`, `react-radio-group`, `react-scroll-area`,
   `react-separator`, `react-switch`, `react-tooltip` (grep-verified
   zero imports each; the six live ones stay).
2. **`scripts/install_packages.sh` regenerated from `package.json`:**
   the exact dependency + devDependency list (dropping dead
   `tailwindcss-animate`, adding the missing `react-dropdown-menu` /
   `react-tabs` / every live package), with the source-of-truth
   comment (package.json is the single source; the script is the
   explicit-list bootstrap for sandbox installs).
3. **Unit pins (`tests/dependency-hygiene-s69.test.ts`):** the absence
   contracts (the 8 deps absent from package.json; zero imports
   repo-wide; `tailwindcss-animate` absent from the script) + the
   parity contract (every package.json dependency AND devDependency
   appears in the script; every script package appears in
   package.json — the drift can never silently return).

### S69-C — the route-race + OTP-knob client batch (L-B + L-C)

1. **The P2025/P2003 catches:** `projects/[id]` DELETE and
   `teams/[id]` DELETE wrap their `db.*.delete` in the sibling PATCH's
   exact S62-G form (P2025 → `fail("NOT_FOUND", "Project not found" |
   "Team not found", 404)`); the members POST wraps its
   `db.teamMember.create` (P2003 → `fail("NOT_FOUND", "Team not
   found", 404)` — the team vanished mid-invite).
2. **The login screen's VERIFY_EMAIL guard opens the verify card
   regardless of the code's nullness:** the 403 + code match suffices;
   `enterVerify(String(body?.verificationCode ?? ""))` — register's
   exact degrade form (S67-C). Under the knob the card opens with the
   empty hint (the emailed-code posture); the default posture is
   byte-identical.
3. **Unit pins (`tests/route-race-s69.test.ts`):** the source
   contracts per race site (the try/catch + the Prisma code test +
   the fail envelope + the 404 family) + the login guard source
   contract (the null-tolerant `?? ""` form; the guard no longer
   requires the truthy code) + the preservation pins (the sibling
   PATCH catches unchanged; the register degrade form unchanged).
4. **E2E pin (`tests/e2e/session69-fixes.spec.ts`):** the knob-posture
   login round-trip — `page.route()` fulfills the login POST with the
   route's REAL documented shape under the knob (`403` +
   `{ ok: false, error: { code: "VERIFY_EMAIL", … }, email,
   verificationCode: null }` — the shape `login/route.ts:66-74`
   answers), then asserts the verify card OPENS (the "Verify your
   email" h2 + the six digit inputs). Pre-fix RED: the generic inline
   error renders and the digit inputs never appear (the dead end).

### S69-D — the docs/comment/typing low batch (L-D + L-E + L-F + L-G + the x/y rider + the smoke comment)

1. **AGENTS.md deduplicated:** the session-68 seam bullet appears
   exactly ONCE (the triplication removed — the content itself
   verified to match the shipped code).
2. **The layers-panel lock comment rewritten** (L-E): the real
   mechanism in prose — the hit-test wall + the `cursor-not-allowed`
   chrome (NEVER a pointer-events suppression — described in prose,
   not the quotable forbidden literal, the F50(1) lesson).
3. **The layers-row double-cast removed** (L-F): `onRowClick`'s
   parameter typed structurally (`{ shiftKey: boolean }` — both event
   families satisfy it) and the `as unknown as` cast deleted.
4. **`docs/DEPLOYMENT.md` refreshed** (L-G): the counts corrected
   (18 API route files / 23 build routes; 58 smoke / 230 e2e); §5 the
   one-time-cookie-eviction note (deploying S67+ over a pre-S67 build
   evicts every session cookie once — the tokenVersion comparison);
   the single-tenant posture note; the knobs rows ride S69-A.
5. **The smoke script's shared-bucket arithmetic comment corrected**
   (the register2 call carries no XFF — the shared "unknown" bucket
   holds 8 calls before the burner, not 7).
6. **The `AssistantUpdatePatch` dead x/y fields deleted** (the
   informational rider): the sanitizer never builds them, the client
   never applies them — the type describes exactly what flows.
7. **Unit pins (`tests/doc-lows-s69.test.ts`):** the double-cast
   absence (zero `as unknown as` in layers-panel.tsx), the lock
   comment contract (the forbidden compact literal absent from the
   file), the AGENTS.md no-duplication contract (the session-68 bullet
   header appears exactly once), the DEPLOYMENT.md counts (the 23-route
   / 58 / 230 forms present; the stale 14/20/28/51 forms absent), the
   eviction-note presence, the x/y-field absence in
   `src/lib/ai-assistant.ts`.

## Planned counts

Unit: +~26 pins across four new spec files
(`tests/proxy-hops-s69.test.ts` ~9, `tests/dependency-hygiene-s69.test.ts`
~5, `tests/route-race-s69.test.ts` ~8, `tests/doc-lows-s69.test.ts` ~7,
minus overlaps) → **~563 = 537 + 26**. E2E: +1 pin in
`tests/e2e/session69-fixes.spec.ts` (the knob-posture login verify-card
round-trip) → **231 = 230 + 1**. Smoke: unchanged at **58** (the
S69-A default depth is behavior-identical; the S69-C catches are
transparent to the suite's non-racing calls).

## RED expectations

Unit RED: no `proxyHopDepth` / no depth-aware `clientIpOf` (the
behavioral pins fail on the missing seam; the depth-0 rotation pin
fails — the pre-fix returns the attacker's rotated IPs); the 8 dead
deps present + the install-script parity fails (dropdown-menu/tabs
missing; tailwindcss-animate extra); no try/catch at the three race
sites; the login guard requires the truthy code (the null-tolerant
source contract fails); the `as unknown as` cast present; the
forbidden lock-comment literal present; the AGENTS.md bullet ×3; the
stale DEPLOYMENT counts present; the x/y fields present. E2E RED
against the pre-fix standalone build: the mocked knob-posture login
answers the generic inline error — the verify card never opens
(expected the h2 + six digit inputs).

## Execution order

S69-A → S69-B → S69-C → S69-D (the promoted M-class knob first — the
session's headline; the hygiene batch second — mechanical; the
route-race/client-guard third; the docs/comment batch last) → unit
GREEN → build → e2e RED (pre-fix standalone) → e2e GREEN → smoke →
full gate → live verification + screenshots → docs → commit + push.

## Execution status

- [x] S69-A — the XFF-trust topology knob
- [x] S69-B — the dependency/bootstrap hygiene batch
- [x] S69-C — the route-race + OTP-knob client batch
- [x] S69-D — the docs/comment/typing low batch
- [x] Full gate green — zero regressions (lint · typecheck · 574 unit = 537 + 37 / 97 files · build 23 routes · 58 smoke · 231 e2e = 230 + 1)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the S69 build after the changes — the 46th consecutive session; the standard 32 re-captured + the ref-audit-s79 evidence set with clone-21 the knob-posture verify card captured BY the e2e pin at the verified-assertion moment + the NEW live S69-A XFF rotation-bypass check in the capture script — depth 0: ten rotating single-value XFF headers key ONE shared bucket, the eleventh answers 429; the default depth: the same rotation keys ten distinct buckets, the eleventh sails through)

## Execution notes (the realized counts + the en-route work)

Unit: +37 checks across four new spec files (proxy-hops-s69 12,
dependency-hygiene-s69 6, route-race-s69 7, doc-lows-s69 12) →
**574 = 537 + 37** (the plan estimated ~26 — the doc-lows file
carries the full DEPLOYMENT.md contract family and the proxy-hops
file carries the complete behavioral matrix). ONE legitimate
contract re-anchor: the S62-D source pin in
`tests/verify-atomic.test.ts` re-anchored onto the depth-aware index
form (the BEHAVIORAL last-hop contract is pinned unchanged in
`src/lib/rate-limit.test.ts` and `tests/proxy-hops-s69.test.ts` —
only the source-form assertion moved).

E2e: +1 pin in `tests/e2e/session69-fixes.spec.ts` → **231 = 230 +
1**, honestly RED against the pre-fix standalone build at exactly
the defect assertion (the knob-posture 403 answered the generic
inline error — the verify-card heading never rendered). Smoke:
unchanged at **58**.

**The en-route work (the F56 lessons):**

1. **The display-layer bracket-eating trap:** the tool-output layer
   silently ate every `[h` pair, so the perfectly correct
   `return hops[hops.length - 1]` READ as the "corrupted"
   `hopsops.length - 1]` across four independent readers (sed, cat,
   python repr, JSON.stringify) — while every gate stayed green.
   The discipline (now lesson F56): re-read the exact bytes (hex
   dump / a bracket-marker viewer) before treating surprising
   "corruption" in a green-gated file as a defect — and byte-reverify
   every quoted code line in an auditor's report the same way.

2. **The Next.js route-announcer alert:** the e2e pin's final
   assertion (`getByRole("alert")` count 0) failed against a
   body-level, visually-hidden `__next_route_announcer__` element
   (role="alert" + aria-live=assertive — the router's screen-reader
   feature, injected after client-side navigation). The fix: scope
   alert assertions inside the content root
   (`page.locator("main").getByRole("alert")`) and assert the error
   MESSAGE text — diagnosed by dumping the matched element's
   outerHTML through `locator.first().evaluate()`.

3. **The substring absence pin:** `type.includes("y?: number")`
   false-matched `opacity?: number` (the y-substring at the end of
   the legitimate field name) — absence pins now anchor on
   word-boundary regexes (`/\by\?: number/`).

4. **The prose-mention command parse:** the install-script parity
   pin's "find the npm install line" helper matched the verb in the
   regenerated script's HEADER COMMENT (which mentions "bun install
   / npm install" in prose) instead of the command line — the anchor
   is now the executable form (a line whose trimmed text starts with
   the verb).

5. **The json.dump rider:** a Python rewrite of package.json
   escaped the description's em-dash to `\u2014` (cosmetic diff
   noise) — `ensure_ascii=False` keeps the literal UTF-8.
