# Remediation Plan — Session 84 (the Thirty-Second Audit)

**Date:** 2026-10-06 · **Trigger:** the operator's session-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the `.env` database contract with `db/` at the repo root, the vitest/playwright suites, the TDD remediation, the screenshots, the aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's re-verification of the session-83 delivery (all four S83 seams verified intact in source at baseline — the isTypingTarget color carve-out at src/lib/editor.ts:288, the s69 pin re-anchored to 63/260 + 25 routes, the e2e hermetic env deletes in both playwright.config.ts and tests/e2e/global-setup.ts, the register hash-before-transaction at register/route.ts:84→:86), then the THIRTY-SECOND Mode C audit: two independent fresh-eyes full-file reviews by separate agents — auditor A over the editor core + client view layer (editor-store, editor-view, properties-panel, canvas, ai-assistant, every app view, the vendored ui primitives, both hooks, lib/editor, the s83 spec files — the unit gate re-run green 994/994 in the auditor's own environment), auditor B over the server + lib/config/infra side (all 18 route files, all libs, prisma schema + seed, every root config, the smoke/check scripts, the e2e infrastructure, `.env.example`, the doctrine files' stale-count sweep — the unit gate + the Playwright `--list` 260-test enumeration + lint + typecheck re-run green) — against the `skills/code-review-checklist` dimensions with the AGENTS/CLAUDE documented contracts loaded first. Every chosen finding individually re-verified by the lead in source (and, for the budget count, by live enumeration) before this plan.

**The baseline gate state — the F59 corollary HOLDS this cycle:** lint ✓, typecheck ✓, unit **994/994 across 138 files** ✓, build ✓, smoke **63/63** ✓, e2e **260/260** ✓ (all six gates re-run by the lead at baseline). The session-83 "full gate green" claim is TRUE at the current tree — the first cycle since session 81 where the inherited gate needed no repair.

## Reference findings (60th audit — no drift on the standing datums)

The standing datums re-verified on `https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 + mobile 390×844, the real CDP login with the operator's credentials, evidence `docs/screenshots/ref-audit-s94/`): the desktop nav 124/96/92 × 36; the greeting with the populated name + sparkle ("Good evening, sepnetflix2023 ✨" — the time bucket moved with the clock, the structure byte-identical); Quick Stats 1 Projects / 0 Teams / Pro Plan; the Recent sort `last_accessed` / "1 file found"; zero kbd affordances (the string-concatenation IIFE re-probe: `kbd=0`); the Create-Team dead chrome (clicked → `dialogs=0`, re-verified after a mid-audit reference-session expiry forced a re-login); R3 mobile nav failure class A (nav `display:none`, links 0×0, no hamburger — the dashboard AND the editor page); the mobile editor header clipping Share/Present at 390 re-measured EXACTLY (Share L385–R458, Present L466–R551 — byte-identical the 21st consecutive session); the board's project text-verified ("Test Project One"). **NO DRIFT — no parity work required this cycle.**

The clone's mobile navigation verified live end-to-end at 390×844 — the **61st consecutive session**, ALL GREEN via the single-call verifier `scripts/verify-nav-s84.sh` (9/9: the 44×44 hamburger with the aria contract at [16,10], the Sheet's 44px links + aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape with focus return + lock release, navigate-and-dismiss, the md-crossing close, the 768 boundary, and the class-A guard — the Tailwind v4 failure class A NOT present). Verified on the S83 build at HEAD `95d7406`.

**The en-route lesson (F71 candidate — the eval-invocation form):** the audit's re-probes initially failed with `{}` outputs that looked like the F63 plain-number quirk — the real cause was the MISSING IIFE invocation parens (a bare `(() => …)` arrow REFERENCE serializes as `{}`; every probe must be the INVOKED `(() => …)()` form). The session-83 "string-concatenation is the reliable re-probe" note survives, sharpened: the reliable form is string-concatenation INSIDE an invoked IIFE. A mid-audit reference-session expiry (the login redirect at the Teams page) also forced one re-login — the reference's session lifetime is shorter than an audit's tail.

## The code audit findings (Mode C — thirty-second pass)

**0 Critical / 0 High / 0 Medium / 4 Low / 5 Informational** combined (auditor A: 0/0/0/2/2; auditor B: 0/0/0/2/3) — every chosen finding individually re-verified by the lead in source:

- **B84-L1 (Low — THE HEADLINE): the e2e auth-call budget is 10 of 10, not the documented "9 of 10" — zero headroom, miscounted at four claim sites.** The shared-bucket (no-XFF) auth-limited enumeration: setup login (`auth.setup.ts:8`) + wrong-password/valid/redirect/envelope (`auth.spec.ts:37,:52,:61,:70`) + the RA-58 journey's register/wrong-verify/login-unverified/verify-correct (`:172,:198,:211,:221`) **+ the RA-59 forgot submit's `POST /api/auth/forgot-password` (`:232` — a rate-limited route, no XFF in its describe) = 10**. The limiter admits exactly 10 per window, so the suite passes today — at zero headroom. The comment at `auth.spec.ts:158-163` enumerates 9 and MISSES the RA-59 call; the same miscount lives at `AGENTS.md:22`, `CLAUDE.md:108`, and `Project_Architecture_Document.md:1643`. The F68/F70 count-drift family's recurrence — this time inside the BUDGET's own arithmetic.
- **A84-L1 (Low): the panel's number fields lack the server's clamps — out-of-range values visibly teleport on save.** `src/components/editor/properties-panel.tsx` — X (`:1064`) and Y (`:1065`) commit raw values (no ±100000 clamp), W (`:1071`) and H (`:1077`) carry only the type-aware floors (no 100000 ceiling), Font Size (`:971`) floors at 1 with no 500 ceiling. The server's `buildElementRow` clamps all five (`src/lib/editor.ts:874-877`, `:913`), and the PUT response replaces the store list — so typing X=500000 renders the element offscreen for ~1s (the debounce + PUT flight) then snaps to 100000. The Radius/Stroke/Rotation/Opacity siblings all clamp at their consumers (`:1100-1113`, `:1195`, `:1247`, `:1332`) — the asymmetry is the defect; Scale is a bounded slider (no free-form input).
- **B84-L2 (Low — live-proven): the S83-C hermetic env delete-list is complete for the app's seven documented reads but leaks the standalone RUNTIME's own knobs — `HOSTNAME` breaks the e2e server when exported.** `.next/standalone/server.js:9` reads `process.env.HOSTNAME || '0.0.0.0'`. Docker exports HOSTNAME (the container id); a resolvable HOSTNAME binds a non-loopback address so the webServer's `localhost:3100` health URL never answers, and an unresolvable one fails the boot outright (live-probed: exit 1). `KEEP_ALIVE_TIMEOUT` (`server.js:11`) is the sibling read. This sandbox does not export HOSTNAME (the e2e suite passes here), but the hermetic discipline's own standard — copy, delete the knobs, then override — should cover the runtime's reads too.
- **A84-I2 / B84-I2 (the small-honesty pair, folded into one slice):** (a) the Dashboard list-row date is locale-dependent — `dashboard-view.tsx:375` calls bare `toLocaleDateString()` while every sibling date site pins `"en-US"` (`recent-view.tsx:151`, `project-card.tsx:378`); (b) the register route's DERIVED name bypasses the 80-char cap — `register/route.ts:95` stores `name || email.split("@")[0] || "Designer"` uncapped (an email with a ~190-char local part passes the 200-char email cap and stores a ~190-char User.name), and the same family lives in the member-creation fallbacks (`teams/route.ts:94`, `teams/[id]/members/route.ts:58` — both consume the uncapped `memberDisplayFor`, `src/lib/team.ts:5-13`), violating S62-G's own "every stored string is capped" rationale on the derivation paths.

**The informational set (posture rows — see the deferred-queue decisions below):** A84-I1 (the isTypingTarget whitelist form), B84-I1 (the S83-C fix's source-text-only pins — no runtime witness), B84-I3 (resend-otp's unconditional update stranding an inert stale verifyCode), plus auditor A's clean-layer verifications (zero XSS sinks; the autosave machine's full seam set coherent; the mobile nav clean) and auditor B's clean-layer verifications (all 18 routes' envelope/rate-limit/body-cap/transaction contracts; the docs sweep found ZERO stale current-state counts — the F70 family grep now reaches every copy).

## The deferred queue decisions (the lead's judgment on the open questions)

1. **A84-L2 (the rotated-resize anchor math) — ALREADY DOCUMENTED as the S73-G deferred posture (PAD:140).** The auditor's finding re-confirms the known state: resize drags compute in the unrotated model box while handles render on the rotation-aware AABB. The S73-G decision stands — the design space is closed (both candidate semantics fail a hard requirement: the local-axis projection collapses on perpendicular drags at 90°; the proportional-world form changes r=0 behavior and violates "resizing never rescales"), and the reference has NO resize interaction at all (session 74's closed probe). NOT re-opened; the posture row already names the answer path (probe the reference first).
2. **A84-I1 (the isTypingTarget text-accepting whitelist) — POSTURE ROW.** Auditor A verified the family is COMPLETE for every focusable input the app renders today (the only exempt member, `input[type="file"]`, is `display:none` — unfocusable). The whitelist inversion is the structural form of the F70 taxonomy, but it re-shapes a just-delivered seam against zero live defects. Documented; the F70 lesson already teaches the enumeration discipline.
3. **B84-I1 (the S83-C source-text pins carry no runtime witness) — POSTURE ROW.** A runtime probe (export HOSTNAME, assert the boot) needs the smoke suite to spawn a second server — heavier than the value; the source pins + this session's S84-C pins hold the discipline. Note: S84-C's own form closes half the gap (the HOSTNAME delete is pinned at the source with the delete-list enumerated).
4. **B84-I3 (resend-otp's unconditional update can strand an inert stale verifyCode) — POSTURE ROW.** The residue is inert DB state (no route accepts a code for a verified account — `verify-otp/route.ts:52`); the S70-D conditional-updateMany family form is the documented closure if it ever matters.
5. **The standing deferred queue carries forward unchanged** (the fillImageThumb codec-or-protocol trade, the LLM server-side timeout with its "verified absent" SDK note, the VLM verification back-log awaiting the quota window).

## The chosen session work (TDD)

### S84-A — the e2e auth-budget repair (B84-L1, the headline)

The RA-59 forgot round-trip (`auth.spec.ts:228-251`) moves out of the "auth card state structure" describe into its OWN describe declaring its own `X-Forwarded-For` bucket (`198.51.100.84` — the session-45/46 siblings' own form, `:267`/`:305`). The shared bucket honestly returns to **9 of 10 with real headroom**; the RA-59 call lands in its dedicated bucket. The comment at `:158-163` is re-anchored to name the carve-out (the miss documented in the comment itself — the F70 closure applied to the budget's own arithmetic), and the three doctrine sites (`AGENTS.md:22`, `CLAUDE.md:108`, `PAD:1643`) gain the honest enumeration ("session 84's RA-59 forgot pin declares its own bucket"). PAD:1200's session-45 historical record stays (historical revision blocks carry their own time's claim).

Pins: the source pins (the RA-59 describe carries the XFF header; the file's shared-bucket enumeration comment names the carve-out) + the doctrine pins (the three sites' honest forms).

### S84-B — the panel number-field clamp family (A84-L1)

Three pure helpers in `src/lib/editor.ts` (the bounds are the server's own `buildElementRow` contract, mirrored at the consumer):

```ts
export function clampPositionField(value: number): number { … }        // ±100000
export function clampSizeField(value: number, type: ElementType): number { … }  // type-aware floor (line 0 / else 1), ceiling 100000
export function clampFontSizeField(value: number): number { … }        // 1..500
```

The panel's five consumers swap their raw/floor-only forms for the helpers (X `:1064`, Y `:1065`, W `:1071`, H `:1077`, Font Size `:971`). The mobile properties Sheet rides the SHARED `PropertiesSections` composition — one fix covers both surfaces.

Pins: the BEHAVIORAL family (the pure helpers called with the boundary values — pre-RED the helpers are absent) + the source pins (the five consumers use the helpers) + the survival pins (the Radius/Stroke/Rotation/Opacity sibling clamps unchanged; the W/H type-aware floors survive inside the helper; the NumberField empty-draft contract untouched).

### S84-C — the hermetic env covers the standalone runtime's reads (B84-L2 — REVISED EN-ROUTE by the F71 runtime discovery)

The planned form (widening the env object's delete-block with HOSTNAME/KEEP_ALIVE_TIMEOUT) was FALSIFIED by the session's own runtime witness: Playwright MERGES the webServer env object OVER process.env, so env-object deletes are NO-OPS for parent-exported vars — the S83-C hermeticity itself had never worked at runtime (its source-only pins certified theater for a cycle). The effective fix: the webServer command gains the prefix `exec env -u DIGMA_PROXY_HOPS -u DIGMA_DISABLE_IN_APP_RESET -u DIGMA_DISABLE_IN_APP_OTP -u DIGMA_REPO_ROOT -u HOSTNAME -u KEEP_ALIVE_TIMEOUT bun .next/standalone/server.js` — coreutils env execs bun directly (the ^bun pkill anchor survives) with all six knobs stripped at the spawn. The env object keeps only its real job: the five pinned OVERRIDES (merging is effective for overriding). The global-setup's deletes stay unchanged — Node's execSync env option REPLACES the environment, so deletes are effective there.

Pins: the source pins (the env -u prefix's full six-knob form; the four app knobs present; the ineffective delete forms ABSENT — the merge-semantics honesty) + the survival pins (the five pinned overrides + the global-setup forms). RUNTIME WITNESS (the standing verification form): the focused playwright run with HOSTNAME exported must pass, and the full auth.spec under the maximally hostile exported env (HOSTNAME + DIGMA_PROXY_HOPS=0 + DIGMA_DISABLE_IN_APP_OTP=1 + DIGMA_DISABLE_IN_APP_RESET=1) must pass — both delivered this session.

### S84-D — the small-honesty pair (A84-I2 + B84-I2)

1. The Dashboard list-row date pins the locale: `dashboard-view.tsx:375` → `toLocaleDateString("en-US")` (the minimal honest form — every en-US user's rendering is byte-identical, non-en-US devices become deterministic; the surface's own family form).
2. The derived-name family caps at 80: `memberDisplayFor` (`src/lib/team.ts`) caps its output at 80 (covering `teams/route.ts:94` and `teams/[id]/members/route.ts:58` — the shared pure seam), and the register route's derivation (`register/route.ts:95`) caps inline: `(name || email.split("@")[0] || "Designer").slice(0, 80)`.

Pins: the BEHAVIORAL memberDisplayFor family (a 190-char local part derives an 80-char name; the jane.doe/alex-ui/sarah_ui/empty survivors unchanged) + the source pins (the dashboard's en-US form; the register's capped form; the negative bare-form absent).

### S84-E — the docs honesty batch

The count sites updated to the delivery counts (994 → the realized unit count after this session's pins; the file count; any touched line counts); the three budget-claim sites' honest forms (S84-A's family); the PAD §7.1 table's session-84 rows; the PAD §10 posture rows for the deferred decisions above; the digma_SKILL lesson (F71 — the eval-invocation form) + the count sites; the AGENTS session-84 seam bullet; the CLAUDE count sites. The family grep re-runs across every doctrine file AND every count pin (the F70 discipline — now including the budget's own arithmetic, this cycle's own lesson).

### S84-F — the session log + the worklog

`docs/session_127.md` (the 2× audit-session − 41 mapping: 2×84 − 41 = 127) + the worklog entry + the PAD v1.63.0 revision block + the digma_SKILL v1.62.0 bump with lesson F71.

## Planned counts

Unit: +~20 pins across three new spec files (`client-lows-s84` — the clamp behavioral + source + survival family and the date pin, ~10; `server-lows-s84` — the hermeticity + derived-name + auth.spec carve-out pins, ~7; `doc-lows-s84` — the docs-honesty pins, ~4) → **~1014**. E2E: 260 (unchanged — the RA-59 re-bucketing moves a test between describes, adds none). Smoke: 63 (unchanged).

## RED expectations

Unit RED: the clamp behavioral pins (the helpers absent — the import itself fails); the clamp source pins (the raw/floor-only consumer forms present); the dashboard date pin (the bare form present); the HOSTNAME/KEEP_ALIVE pins (the deletes absent); the memberDisplayFor cap pin (the 190-char local part derives >80); the register cap pin (the uncapped form present); the auth.spec carve-out pin (the RA-59 describe lacks its own XFF); the doc pins (the stale claim forms present). E2E and smoke: unchanged by design (the RA-59 move is bucket-only; the suite must stay 260/260).

## Execution order

S84-A → S84-B → S84-C → S84-D → unit GREEN (the full suite) → lint → typecheck → build → smoke (63) → the full e2e suite (260) → full gate → live verification + screenshots (the capture script + the dimension checker) → `.env.example` verification → docs (S84-E + S84-F) → commit + push.

## Execution status

- [x] S84-A — the e2e auth-budget repair (the RA-59 XFF carve-out + the four claim sites; the shared bucket honestly at 9 of 10)
- [x] S84-B — the panel number-field clamp family (the pure helpers + the five consumers; the live clone-38 check: x:100000, w:100000, fontSize:500)
- [x] S84-C — the hermeticity moved into the webServer COMMAND (the env -u prefix — the F71 discovery falsified the env-object delete form; the runtime witness delivered: the focused run with HOSTNAME exported passes, the full auth.spec passes under the maximally hostile exported env)
- [x] S84-D — the small-honesty pair (the en-US date + the derived-name caps; the live clone-39 check: len:80, capped:true)
- [x] S84-E — the docs honesty batch (the realized counts 994 -> 1024 / 141 files — the planned ~1014 was the estimate; the delivery counts are the realized ones)
- [x] S84-F — the session log (docs/session_127.md) + the worklog entry
- [x] Full gate green — zero regressions (lint · typecheck · 1024 unit = 994 + 29 / 141 files · build · 63 smoke · 260 e2e)
- [x] Live verification + screenshots + docs + push (the capture with the two new inline checks clone-38/clone-39 + the standing set; the S84-C runtime witness delivered; mobile nav 9/9 the 61st consecutive session re-verified at baseline)

## Execution notes (the realized counts + the en-route work)

Unit: +30 checks across three new spec files (client-lows-s84 10, server-lows-s84 11 — the S84-C revision's merge-semantics discovery added the ineffective-delete absence pin, doc-lows-s84 9) -> **1024 = 994 + 30 / 141 files** (the planned ~1014 was the pre-RED estimate; the realized count is the delivery count). E2e: **260** (unchanged — the RA-59 re-bucketing moves a test between describes; the suite re-ran green AFTER the S84-C revision). Smoke: **63** (unchanged). TWO standing pins legitimately re-anchored (the S70-D W-floor pin onto the clampSizeField helper form — the intent byte-identical; the S83-C hermeticity pins onto the env -u command form — the intent STRENGTHENED from source-theater to the runtime-effective form, both documented in the pins) + the s81 count pin re-anchored to 1024/63/260.

**The F71 en-route lessons:** (1) the eval-invocation form (a bare arrow REFERENCE serializes as `{}` — every probe must be the INVOKED IIFE `(() => …)()`; the F63 quirk note sharpened); (2) the budget's own arithmetic (a "9 of 10" budget is a COUNT CLAIM — the family grep must reach the SPEC'S OWN CALLS, not only its comments; the RA-59 forgot POST rode the shared bucket at 10 of 10 for 41 sessions); (3) the web-server-env merge semantics (Playwright MERGES the env object OVER process.env — env-object deletes are NO-OPS; removal must happen at the spawn command via `env -u`; Node's execSync env REPLACES, so its deletes work — the trap is Playwright-specific; the S83-C fix was falsified a full cycle after its green delivery by this session's runtime witness); (4) the clamp asymmetry (a server clamp + a store-replacing PUT response = a consumer without the clamp visibly teleports; the fix mirrors the server's bounds through shared pure helpers, pinned behaviorally at the boundaries).
