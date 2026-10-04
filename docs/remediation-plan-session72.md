# Remediation Plan — Session 72 (the Twentieth Audit)

**Date:** 2026-10-04 · **Trigger:** the operator's session-101/102-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the `.env` database contract with `db/` at the repo root, the vitest/playwright suites, the TDD remediation, the screenshots, the aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's hunk-by-hunk review of the session-71 delivery (the S71-A call() migration, the S71-B in-flight descriptor, the S71-C server pair, the S71-D guards batch — each seam re-verified in source at baseline), then the TWENTIETH Mode C audit: two independent fresh-eyes full-file reviews by separate agents — auditor A over the editor core + client view layer, auditor B over the server + lib/config/infra side (all 18 API route files + the 10 pure lib seams + both prisma files + the 8 configs + the test infra + both auth screens) — against the `skills/code-review-checklist` dimensions with the AGENTS/CLAUDE documented contracts loaded first. Every chosen finding individually re-verified by the lead in source before this plan. The baseline gate re-proven BEFORE any change (lint · typecheck · 666 unit / 107 files · build · 58 smoke · e2e run in chunks under the tool-call time limit), the DB verified at the pristine 1/2/6/1/3 contract, the parent-shell `DATABASE_URL` trap neutralized (the stale parent `.env` DELETED — the exported var persists in the sandbox shell, so the `unset` discipline stays in every db-touching command).

## Reference findings (48th audit — no drift, no new gaps)

The standing datums re-verified on `https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 + mobile 390×844, the real CDP fill login): the desktop nav 124/96/92 × 36; the greeting "Good morning, sepnetflix2023 ✨" (the name populated, the morning bucket); Quick Stats 1 Projects / 0 Teams / Pro Plan; the Recent sort `last_accessed` / "1 file found"; zero kbd affordances; the Create-Team dead chrome the 48th (2 clicks, 0 dialogs); R3 mobile nav failure class A the 48th (nav `display:none`, links 0×0, no hamburger — the dashboard AND the editor page; evidence `ref-audit-s82/ref-01` and `ref-02`); the mobile editor header clipping Share/Present at 390 re-measured exactly (Share L385–R458, Present L466–R551 — byte-identical to the session-63…71 measurement); the board at 9 layers ("9 layers" + "Test Project One", opened through the project-card ANCHOR after the generic card probe missed — the same first-attempt miss family as sessions 62–71). Evidence set: `docs/screenshots/ref-audit-s82/` (ref-00 desktop dashboard, ref-01 mobile dashboard 390, ref-02 mobile editor 390, ref-03 desktop Recent, ref-04 desktop editor).

The clone's mobile navigation verified live, end-to-end at 390×844 — the 49th consecutive session, ALL GREEN via the single-call verifier `scripts/verify-nav-s72.sh` (9/9: the 44×44 hamburger with the aria contract at [16,10], the Sheet dialog with 44px links + aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape with focus return + lock release, navigate-and-dismiss, the md-crossing close, the 768 boundary, and the class-A guard — the Tailwind v4 failure class A NOT present).

## The code audit findings (Mode C — twentieth pass)

**THE HEADLINE FINDING (the lead's, surfaced by the baseline e2e gate): the session-71 delivery shipped a REAL functional regression that its own documented "full e2e green" claim missed.**

- **S72-0 (HIGH — the S71-A migration regression, the lead): the rename unwrap was LOST in the call() migration.** `src/components/project-card.tsx:259-271` — `InlineProjectRename.commit()` migrated from the hand-rolled fetch (which read `body.data.project as ProjectSummaryDTO`) onto `call<ProjectSummaryDTO>(...)` — but `call()` returns `body.data`, and the PATCH route answers `ok({ project })`, so `renamed` is the WRAPPER `{ project: {...} }`, typed as the project itself. `onRenamed(renamed)` hands the wrapper to every consumer's `prev.map((p) => (p.id === updated.id ? updated : p))` — `updated.id` is `undefined`, nothing matches, and **the card title NEVER updates after a successful rename** on all three surfaces (the Recent grid card, the Recent list card, the Dashboard grid card). The server-side rename persists (a reload shows the new name) — this is the S58-A "stale name" defect reintroduced in a new form, six sessions after S58-A closed it. Empirically confirmed: the standing `tests/e2e/session58-fixes.spec.ts` rename pin is DETERMINISTICALLY RED against the current build (the PATCH 200 + the correct response DTO captured in the Playwright trace; the h3 still showing "Marketing Hero Banner"; three consecutive failures); the grouped-run cascade — the rename-back cleanup never runs, so the later session58/59/60 specs read the mutated seeded name and fail 7 more (all pass in isolation, exactly the cascade signature).

The two fresh-eyes passes found (combined with the lead's): **0 Critical / 1 High / 1 Medium / 8 Low / 8 Informational** — every chosen finding individually re-verified by the lead in source:

- **L-A2 (Low — auditor A F2): the Toaster renders BENEATH the Present overlay.** `toaster.tsx:17` is `z-[100]`; `PresentOverlay` (`editor-view.tsx:729`) is `fixed inset-0 z-[200]`. The autosave machine keeps running during a presentation — its failure family (`toast.error("Autosave failed"…)`, the S68-D "Session expired" terminal, the network-error toast) paints BEHIND the fullscreen overlay for the toast's whole lifetime whenever a flush fails while presenting.
- **L-B1 (Low — auditor B F1): the elements POST bare-throws P2003.** `elements/route.ts:86-93` — after the `loadProject` pre-check, the create runs unguarded; a concurrent project DELETE between the pre-check and the create fires the FK violation as an unstructured 500. The exact sibling the S69-C pass fixed (members POST's P2003 → NOT_FOUND 404) and this route's own PUT (which catches P2025/P2003).
- **L-B2 (Low — the documented deferred B-L2, auditor B F2): the login timing oracle.** `login/route.ts:40-41` — the `!user ||` short-circuit skips the scrypt work for unknown emails, so response latency distinguishes registered emails even after S71-C closed the status-code oracle. The fix: burn a dummy scrypt on the miss branch (the constant-work envelope).
- **L-B4 (Low — auditor B F4): the clampText fold's ninth site.** `teams/[id]/route.ts:36` — the PATCH's description field still hand-rolls `typeof … trim().slice(0, 300) || null` — behaviorally identical to `clampText(body.description, 300)`. The S71-D fold migrated 8 sites and missed this one — exactly the twin-hazard the fold's rationale names.
- **L-B5 (Low — NEW, auditor B): the five TOCTOU count-then-create ceilings (the documented deferred #1).** `projects/route.ts:61`, `duplicate/route.ts:26`, `teams/route.ts:55`, `members/route.ts:37`, `elements/route.ts:61` — each counts, checks, then creates in a SEPARATE await; a burst of concurrent POSTs between the count and the create inserts past the ceiling. The fix: move the count inside the create's transaction (SQLite serializes writers; the interactive transaction closes the window).
- **M-A1 (Medium — auditor A F1, adjudicated as DOC-HONESTY this session): the PAD overclaims rotation-aware resize math.** `canvas.tsx:257-296` applies world-axis deltas to the local width/height (inverse-mapping translate+scale only) while the handles render on the rotation-aware AABB — for a 90°-rotated element the "e" handle drag grows the local width, which renders downward. AGENTS.md's S64-C bullet (outline/handles/marquee) is accurate; `PAD:730`'s "…and resize math now run on the VISUAL footprint" is the overclaim (the :1186 verified-correct sweep tested zoom/scale, never rotation). The honest fix this session: correct the PAD sentence + the bounds-rotation test header (rotated resize stays out of scope, documented); the implementation is deferred.
- **The honesty riders (Low/Info, both auditors):** the stale hit-test comment (`canvas.tsx:461` — the pre-wall "unlocked" wording), the stale tool enumeration (`editor-view.tsx:440` — seven keys vs the nine-tool seam), the dead `minV` parameter (`canvas.tsx:266`), the stale elements-POST doc comment (describes a client integration that no longer exists), the dishonest DELETE type annotations (`call<{ project: { id: string } }>` vs the route's `{ deleted: true }` — works by truthiness, lies by type), and the PAD §4 drift (the `@@index([projectId])`/`@@index([sortOrder])` reference, the "32px ceiling" fontSize claim vs the real 1–500/1–200 clamps, the "keyed to the app user by query" sentence vs ADR-003's shared pool, the schema's fontWeight comment vs the 300–800 enum).

### The deferred batch (documented, verified, not chosen this session)

The name-cap asymmetry (POST rejects >120, PATCH silently truncates — a product-semantics decision; the UI's maxLength caps make it unreachable), the unbounded GET /api/projects aggregate (a take/cursor or image-fill policy for the list family), the rotated-resize implementation (M-A1's code half), the at-rest token hashing (posture-gated on the ADR-014 knobs), the rate-limit bucket eviction amortization, the fillImageThumb client-side downscale, the duplicate/elements-GET/elements-POST zero-consumer decision, the hidden-panel render cost below md/lg, the S71-B pending-re-run refinement, the server-side elementSummary re-derivation, and the informational asymmetries (marquee×locked, shift-click semantics).

### Verified clean (explicitly re-checked)

The session-71 delivery's other seams (the S71-B descriptor under every edge interleaving — exit-before-flight, exit-during-flight, Untitled both sides, the pending requeue, the 401 terminal; the S71-C resend uniform 400 + the login fold + the sortOrder clamp + the composite index; the S71-D lint ladder + rangeFillPercent + the elementSummary builder pin); every OTHER `call<T>` consumer against its route's `ok()` shape (the known-bug class swept: teams/stats/projects/POST-create all honest); the authz/session gating on all 18 routes; the body-size guard family (14/14, before-parse); the rate limiter's depth-aware keying; the verify-otp atomicity; the delete/update race catches (except L-B1); the seed idempotence; the crypto end-to-end; the configs' skills/ exclusions; the React 19 discipline; the Tailwind 4 contract; the a11y restructures; the stretched-button/button-region forms.

## The chosen session work (TDD)

### S72-A — the rename unwrap fix + the DELETE type honesty (S72-0 + the type riders)

1. **The unwrap.** `InlineProjectRename.commit()` types the call honestly — `call<{ project: ProjectSummaryDTO }>` — and unwraps before the callback: `if (renamed?.project) { toast.success(...); onRenamed(renamed.project); }`. Every consumer (the Recent grid card, the Recent list card, the Dashboard grid card) heals through the one seam.
2. **The DELETE type honesty.** The two DELETE sites (`project-card.tsx` + `recent-view.tsx`) annotate `call<{ deleted: boolean }>` — matching the route's `ok({ deleted: true })` (works by truthiness before; honest by type now).
3. **TDD:** the standing `session58` rename e2e pin IS the honest RED (deterministically failing on the current build); unit RED pins on the unwrap contract + the DELETE annotations → GREEN.

### S72-B — the Toaster above the Present overlay (L-A2)

`toaster.tsx` flips `z-[100]` → `z-[300]` — above the present overlay's `z-[200]`, above every dialog/sheet's `z-50`. The autosave failure family (and every other toast) becomes visible during a presentation. Unit source pin: the toaster's z literal exceeds the present overlay's z literal.

### S72-C — the elements POST P2003 envelope + the login timing equalizer (L-B1 + L-B2)

1. **The P2003 catch.** The elements POST's create wraps in the members-POST S69-C form: `P2003` → `fail("NOT_FOUND", "Project not found", 404)` (a concurrent project DELETE answers through the envelope, never an unstructured 500).
2. **The timing equalizer.** `src/lib/password.ts` gains the lazy `timingEqualizerHash()` (a precomputed scrypt hash of a throwaway constant, computed once per process on first miss); `login/route.ts` burns `verifyPassword(password, timingEqualizerHash())` on the unknown-email branch — the constant-work envelope closes the latency oracle while the 401 envelope stays byte-identical. The resend-otp/forgot-password write-timing residues stay documented (their writes are necessary work).

### S72-D — the honesty batch (L-B4 + the comment/PAD riders)

1. **The ninth clampText site.** `teams/[id]/route.ts` description field migrates onto `clampText(body.description, 300)` — the fold completes.
2. **The comment/code honesty riders:** the canvas hit-test comment's "unlocked" wording → the wall's actual contract; the editor shortcuts header's seven-key enumeration → the TOOL_SHORTCUTS seam; the elements POST's stale client-integration doc comment → the honest API-surface status; the dead `minV(n)` parameter → the plain `minVisual` constant.
3. **The PAD riders:** §4's stale index reference → the composite; the "32px ceiling" fontSize sentence → the real clamps; the "keyed to the app user by query" sentence → the ADR-003 shared-pool posture; the schema's fontWeight comment → the 300–800 enum; `PAD:730`'s "resize math" overclaim → the accurate outline/handles/marquee scope with the rotated-resize deferral note; the bounds-rotation test header aligned.

### S72-E — the TOCTOU count-then-create ceilings (L-B5 — the five sites)

Each site's count moves INSIDE the create's interactive transaction (SQLite serializes writers; the window between count and create closes):
1. `projects/route.ts` — count + create inside `db.$transaction` (over-cap → the same VALIDATION 400 envelope).
2. `duplicate/route.ts` — the count moves inside the EXISTING copy transaction's prefix.
3. `teams/route.ts` — count + the nested create (with the first-member create) inside one transaction.
4. `members/route.ts` — count + create inside one transaction (the P2003 catch survives around it).
5. `elements/route.ts` — count + the sortOrder clamp + create inside one transaction (the clamp's count fallback now reads the transactional count; the S72-C P2003 catch wraps the transaction).

The envelopes, the message strings, and the status codes stay byte-identical — only the atomicity changes. The standing unit pins on the ceiling forms re-anchor onto the transactional contracts (the established convention, each with the contract-change comment).

## Planned counts

Unit: +~35 pins across three new spec files (`rename-unwrap-s72`, `server-lows-s72`, `honesty-lows-s72`) → **~701**. E2E: no new spec files — the standing session58 rename pin provides the honest RED→GREEN evidence, and the full 240-check suite re-runs as the regression net (the 8 baseline failures collapse: 1 real defect + 7 cascades). Smoke: unchanged at **58** (the envelopes stay byte-identical).

## RED expectations

Unit RED: the unwrap form absent (the `call<ProjectSummaryDTO>` direct-pass form present); the DELETE annotations dishonest; the toaster z ≤ present z; the P2003 catch absent at the elements POST; the timing equalizer absent; the ninth inline twin present; the five transactional forms absent. E2E RED (already present, honestly documented): the session58 rename pin fails deterministically on the pre-fix build — PATCH 200 + correct DTO + the stale h3.

## Execution order

S72-A (the headline regression first) → S72-B → S72-C → S72-D → S72-E (the server batch: C+D+E share the db-touching surface) → unit GREEN → build → e2e GREEN (the full suite in chunks) → smoke → full gate → live verification + screenshots → docs → commit + push.

## Execution status

- [x] S72-A — the rename unwrap fix + the DELETE type honesty (the headline regression)
- [x] S72-B — the Toaster above the Present overlay (z-[300] over z-[200])
- [x] S72-C — the elements POST P2003 envelope + the login timing equalizer
- [x] S72-D — the honesty batch (the ninth clampText site + the comments + the PAD riders)
- [x] S72-E — the five TOCTOU count-then-create ceilings moved inside their create transactions
- [x] Full gate green — zero regressions (lint · typecheck · 692 unit = 666 + 26 / 110 files · build · 58 smoke · 240 e2e — the full e2e re-run on the final code in chunks; the standing session58 rename pin the honest RED → GREEN evidence, deterministically RED pre-fix with the trace, GREEN post-fix at 1.9s; the previously-cascading 8-failure grouped run now 14/14 in 34s)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the final build — the 49th consecutive session; the standard 32 re-captured + the ref-audit-s82 evidence set + THREE NEW inline checks — the rename-heal live (healed:true), the toaster-over-present computed z (300>200), the login timing floor (39ms — pre-fix ~2-5ms); dimension-checked 265/265, VLM 21/21; the DB re-seeded pristine after every mutating phase)

## Execution notes (the realized counts + the en-route work)

Unit: +26 checks across three new spec files (rename-unwrap-s72 5, server-lows-s72 11, honesty-lows-s72 10) → **692 = 666 + 26**. SIX standing pins legitimately re-anchored onto the restructured contracts (each with the contract-change comment, the session-66/69/70/71 convention): the two auth re-export pins (server-lows-s70 + server-low-s62 — timingEqualizerHash joined the list), the members P2003 pin (route-race-s69 — the tx create), the member-color pin (db-redaction), the teams-email validation-order pin, and the elements-cap pin (the tx count/create ordering).

E2E: no new spec files — the standing session58 rename pin IS the honest RED → GREEN evidence (deterministically RED on the pre-fix build — the PATCH 200 + the correct DTO + the stale h3 in the trace; GREEN at 1.9s post-fix); the full 240-check suite re-ran green in chunks. Smoke: unchanged at **58** (the envelopes stay byte-identical).

**The en-route work (the F59 lessons):** (1) the migration-unwrap regression itself — a consolidation migration must preserve the PAYLOAD UNWRAP, not just the call shape (the type parameter is the assertion); (2) the cascade fingerprint — one deterministic failure that skips its cleanup poisons every later spec sharing the server process (the rename-back never ran; 7 downstream failures that all passed in isolation); (3) the detached-DOM read — a captured h3 reference reads stale text after React replaces the node (re-query after the mutation); (4) the sliced-spec false match — a handler body sliced to EOF false-matches the NEXT function's guards (bound every slice at the next export boundary). Corollary held: the baseline gate exists to catch shipped-but-claimed-green work — the session-71 delivery's documented "full e2e green" was a claim; the re-proven baseline caught the regression the claim missed.
