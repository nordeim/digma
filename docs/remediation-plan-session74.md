# Remediation Plan — Session 74 (the Twenty-Second Audit)

**Date:** 2026-10-04 · **Trigger:** the operator's session-105/106-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the `.env` database contract with `db/` at the repo root, the vitest/playwright suites, the TDD remediation, the screenshots, the aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's re-verification of the session-73 delivery (all eight S73 seams verified intact in source at baseline — the textAlignToJustify seam at all three render sites, the duplicate 404 guard, the 30s transaction timeouts, the smoke refusal + the fifth count, the name-cap symmetry, the take bound + the downscale helpers, the honesty batch), then the TWENTY-SECOND Mode C audit: two independent fresh-eyes full-file reviews by separate agents — auditor A over the editor core + client view layer, auditor B over the server + lib/config/infra side — against the `skills/code-review-checklist` dimensions with the AGENTS/CLAUDE documented contracts loaded first. Every chosen finding individually re-verified by the lead in source before this plan. The baseline gate re-proven BEFORE any change (lint · typecheck · 724 unit / 113 files · build · 58 smoke · the full e2e suite in chunks — **all green, zero regressions; the prior session's claimed gate results HELD this cycle**, the F59 corollary satisfied), the DB verified at the pristine 1/2/6/1/3 contract, the parent-shell `DATABASE_URL` trap neutralized (no parent `.env`; the exported var persists in the sandbox shell, so the `unset` discipline stays in every db-touching command).

## Reference findings (50th audit — no drift on the standing datums + THE ROTATED-RESIZE PROBE'S ANSWER)

The standing datums re-verified on `https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 + mobile 390×844, the real CDP login): the desktop nav 124/96/92 × 36; the greeting "Good morning, sepnetflix2023 ✨"; Quick Stats 1 Projects / 0 Teams / Pro Plan; the Recent sort `last_accessed` / "1 file found"; zero kbd affordances; the Create-Team dead chrome the 50th (2 clicks, 0 dialogs); R3 mobile nav failure class A the 50th (nav `display:none`, links 0×0, no hamburger — the dashboard AND the editor page); the mobile editor header clipping Share/Present at 390 re-measured exactly (Share L385–R458, Present L466–R551 — byte-identical to the session-63…73 measurement); the board at 9 layers (opened directly by URL after the anchor-miss family; the board restored to its pristine positions after the probe's mutations). Evidence set: `docs/screenshots/ref-audit-s84/` (ref-00…ref-04 + the probe-01…04 evidence).

**The rotated-resize probe (the session-73 S73-G deferral's mandated first probe — performed live with real CDP mouse drags):**

1. **The reference HAS NO RESIZE HANDLES.** A selected element renders `ring-2 ring-blue-500 ring-offset-1` (a Tailwind ring outline) and NOTHING else — no handle elements anywhere in the DOM (zero elements under 16px near the selection; zero elements with a resize cursor in the WHOLE document), `cursor: move` on every part of the element including edges and corners. The visually-suggested "8 handles" in a casual screenshot read are the ring's corners — pixel-level crop + VLM verification confirms: **0 handles, outline only.**
2. **Edge/corner drags MOVE, never resize.** A +75px eastward drag starting 5px inside the right edge of a selected 200×150 rectangle moved `translate` from 182.527→257.527 (+75 exactly) with the width unchanged — the whole element is one move target (the reference's only size controls are the properties panel's W/H number inputs).
3. **The reference's canvas hit-testing IGNORES ROTATION.** With Rectangle 1 rotated 90° (via the properties panel's rotation input — which works and renders correctly), a click at screen (560,200) — a point on VISUALLY EMPTY canvas, 15px EAST of the rotated AABB's right edge — SELECTED the rotated element; a click/drag on its visual AABB (e.g. its east face at (540,180)/(540,240)) hits NOTHING (the marquee fires, the selection drops). The hit-test resolves against the UNROTATED footprint (translate+scale only) while the paint applies the full transform chain — a reference BUG (another member of its dead-chrome family: the no-op eye, the dead Create Team, the claimed-success AI deletes).
4. **A 90° edge drag therefore does NOTHING** (the pointer events land on empty canvas per the broken hit-test) — there is NO rotated-resize behavior to measure because there is no resize interaction at all.

**The design-space resolution (S73-G's successor decision):** the reference offers NO parity answer for rotated resize — its drag-resize does not exist, and its rotated hit-testing is itself broken. The clone's 8-handle resize + rotation-aware hit-test (`rotate(−r)·((p−(x,y))/s)`, S56-C) is already the working superset with full design freedom. Per the session-73 closed design space (both candidate semantics fail a hard requirement: the local-axis projection collapses the element on perpendicular drags at 90°; the proportional-world form changes r=0 semantics and violates "resizing never rescales"), the decision: **KEEP the current world-axis growth on rotated elements and convert the deferral into the DOCUMENTED KNOWN LIMITATION** (the PAD's known-gaps table gains the row, with the reference probe's evidence) — the rotated-resize semantic upgrade becomes a documented non-goal, not an open deferral. The board's elements were restored to their pristine positions after the probe (verified: all 9 translates byte-identical; rotation reverted; deselected).

The clone's mobile navigation verified live, end-to-end at 390×844 — the 51st consecutive session, ALL GREEN via the single-call verifier `scripts/verify-nav-s74.sh` (9/9: the 44×44 hamburger with the aria contract at [16,10], the Sheet's 44px links + aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape with focus return + lock release, navigate-and-dismiss, the md-crossing close, the 768 boundary, and the class-A guard — the Tailwind v4 failure class A NOT present).

## The code audit findings (Mode C — twenty-second pass)

**0 Critical / 0 High / 5 Low / 8 Informational** combined (auditor A: 0/0/3/3; auditor B: 0/0/2/5) — every chosen finding individually re-verified by the lead in source:

- **A74-L1 (Low): `elementToStyle`'s text branch omits the `justifyContent` mapping — the S73-A fix's own fourth surface.** `src/lib/editor.ts:471-479` — the TEST-ONLY style seam pins `display:flex + alignItems:center + textAlign` but NOT the justification, while the canvas it claims to mirror now carries the seam (`canvas.tsx:691-693`). Its doc comment says it "exists so the unit suite pins the geometry the canvas must reproduce" — post-S73-A that claim is false for the text-alignment half. The session-73 headline defect class (one model field, N render surfaces, the fix reaches N−1) surviving INSIDE the parity fix, 23 lines below `textAlignToJustify` itself.
- **A74-L2 (Low): the S73-H Set-membership fix closed only the canvas — the two panel siblings still scan.** `properties-panel.tsx:1462` (`elements.filter((el) => selectedIds.includes(el.id))` — re-runs on EVERY drag tick, the panel subscribes to `elements`) and `layers-panel.tsx:45-46` (`visible.every((el) => selectedIds.includes(el.id))` — same cadence). The same O(n·m) worst case at ELEMENT_LIMIT that A-F5 cited.
- **A74-L3 (Low): the S73-H corrupt-date guard landed on 1 of 3 date-formatting sites.** `recent-view.tsx:135-138` and `dashboard-view.tsx:369` still render "Invalid Date" on a corrupt `lastOpenedAt`, while `project-card.tsx:377-379` carries the NaN guard.
- **B74-F1 (Low): db.ts's header still asserts the RETIRED chdir mechanism.** `src/lib/db.ts:4-6` — "the engine against the CWD" is exactly the wrong mechanism session-73's live probes disproved (the runtime anchors against the schema directory the client was generated against); the S73-H correction fixed db-path.ts + AGENTS + the skill but missed this second code site.
- **B74-F2 (Low): `check-db-contract.ts` resolves the parent-exported `DATABASE_URL` verbatim.** `scripts/check-db-contract.ts:7` — under the sandbox's standing exported var the script validates a FOREIGN checkout's DB (the exact false-green family the smoke refusal killed); the refusal guard landed in `smoke-test.sh` only. The F60 discipline-becomes-mechanism lesson argues for both siblings.
- **B74-F3 (Info): the stale "three list-family routes" count.** `src/lib/editor.ts:187-190` — S73-H made the projects POST the FOURTH consumer of `THUMBNAIL_ELEMENT_SELECT`; the seam's own doc is stale by one.
- **B74-F4 (Info — doctrine scope): the name-cap doctrine (S73-E) is project-scoped only.** Team names and element names still silently truncate at 80 (`clampText(..., 80)`) while projects reject >120 with the pinned 400. Scriptable-only (every UI surface carries maxLength). Decision this session: DOCUMENT the project-scoped scope in the PAD (the honest note) — extending the reject doctrine to teams/elements is a product-semantics change with no reference datum.
- **B74-F5 (Info — race-hygiene residue): the auth family's four user-row updates carry no P2025 catch.** `login/route.ts:69`, `resend-otp/route.ts:69`, `forgot-password/route.ts:74`, `reset-password/route.ts:76` — unreachable via the API (no user-delete endpoint exists; only the seed wipes users). Decision: the accepted-posture note (the PAD's known-gaps family).
- **B74-F6 (Info): verify-otp's structural fall-through.** After the S73-H simplification the handler has no terminal return after the `if (verifiedResult.count === 0)` block — a count outside {0,1} (impossible for a unique-id `updateMany`) would return `undefined` (an empty 200). `noImplicitReturns` is off, so the compiler cannot force totality.
- **B74-F7 (Info — doc-honesty): the PAD §931 S58-E bullet still cites the phantom `canvasStyleFor` seam.** The retirement pin scans only src/tests; the living architecture doc keeps the retired name that masked the session-73 headline for 15 sessions.
- **A74-I1 (Info): the thumbnail clips what the canvas/present show.** `project-card.tsx:194` sets `overflow: "hidden"` unconditionally (a line's round-cap stroke overhang paints outside its w×h box on the canvas but is cut in the fixed 320×200 preview). Cosmetic (≤ strokeWidth/2 px); the fixed-size preview box clipping by design is the coherent posture — documented, no change.
- **A74-I2 (Info — Tailwind v4 trap family): `bg-neutral-900` is the one consumed-but-unpinned palette scale.** `dashboard-view.tsx:304,318`, `recent-view.tsx:340,354` — the @theme pins block pins gray/slate but NOT neutral; the block's own rule ("every palette scale the app consumes is pinned") is violated. No visible drift today (v4's achromatic oklch round-trips to the same #171717), but a future neutral-500/700 use would silently take the oklch default — the exact trap the block documents.
- **A74-I3 (Info): a same-route `projectId` switch never re-arms `loading`.** `editor-view.tsx:1161-1229` — a manual URL param change renders the OLD canvas until the new GET resolves. Vanishing-rare cosmetic; store/autosave correctness unaffected — documented, no change.

### The deferred queue (documented, deepened this audit — not all chosen)

The at-rest token hashing (ADR-014 posture-gated; unchanged), the rate-limit bucket eviction amortization (O(n) sweep per call; unchanged), the fillImageThumb for ALREADY-STORED images (the downscale bounds future uploads only; unchanged), the duplicate/elements-GET/elements-POST zero-consumer decision (unchanged), the hidden-panel render cost below md/lg (unchanged), the server-side elementSummary re-derivation (unchanged), the informational asymmetries (marquee×locked, shift-click semantics, the pointer-only layer reorder; unchanged), the forgot/resend residual timing oracles (the PAD's deviation row; unchanged), the NEW B74-F4 (the name-cap doctrine's project scope — documented this session), the NEW B74-F5 (the auth user-update P2025 residue — the accepted-posture note this session), and the CLOSED rotated-resize question (the probe's answer + the documented known limitation this session).

## The chosen session work (TDD)

### S74-A — the elementToStyle justifyContent line (A74-L1, the S73-A family completion)

The text branch gains `style.justifyContent = textAlignToJustify(el.textAlign)` — the TEST-ONLY seam now reproduces the canvas's full text geometry (the doc comment's own claim becomes true again). Unit pin: the seam's text-branch source carries the mapping; the existing font pins stay green.

### S74-B — the Set membership at the two panel siblings (A74-L2, the A-F5 family completion)

`properties-panel.tsx`'s `selected` filter and `layers-panel.tsx`'s `allVisibleSelected` flip move to Set membership (`new Set(selectedIds)` — the canvas's own S73-H form). Behavior identical (id membership is id membership); the per-drag-tick scans close. Unit pins: both source sites carry the Set form.

### S74-C — the corrupt-date guard at the two remaining sites (A74-L3, the A-F4 family completion)

`recent-view.tsx`'s `openedLabel` and `dashboard-view.tsx`'s list-row date gain the SAME `Number.isNaN` guard form as `project-card.tsx:377-379` (each site keeps its own measured format — RA-48 pins the three distinct shapes; the GUARD is the shared part). Unit pins: both source sites carry the guard.

### S74-D — the db.ts mechanism comment (B74-F1)

The header's second sentence corrected to the schema-anchoring mechanism (matching `db-path.ts:8-12` — the runtime anchors relative `file:` URLs against the schema directory the client was generated against, NOT the process CWD; the standalone trap is the traced schema copy). The `server-lows-s73` pin extended to cover db.ts's header (the retirement now scans both code sites).

### S74-E — the check-db-contract refusal mechanism (B74-F2)

`scripts/check-db-contract.ts` gains the smoke-test.sh refusal form at the top: a non-empty exported `DATABASE_URL` answers the teaching message + exit 1 (the operator discipline `unset DATABASE_URL && …` becomes a mechanism in BOTH siblings; the false-green foreign-checkout case dies here too). Unit pin: the script source carries the guard; two-way proven in the gate run.

### S74-F — the honesty batch (B74-F3 + B74-F7 + B74-F4 + B74-F5 + the rotated-resize known-limitation row)

1. The stale "three list-family routes" → "four list-family routes (list GET, PATCH response, duplicate response, POST response)" — the seam's doc matches reality.
2. The PAD §931 S58-E bullet's `(matching canvasStyleFor)` citation retired — the bullet now cites the real seam family (`textAlignToJustify` at the three DOM render sites + the SVG export's text-anchor codomain; the historical note reworded per the F58 comment-literal discipline — history notes never quote the dead identifier).
3. The PAD's known-gaps table gains the rotated-resize row (the probe's evidence: the reference has no resize interaction at all — ring-only selection, edge drags move, the rotation-blind hit-test — and the clone's world-axis growth on rotated elements is the documented known limitation, both candidate semantics having failed hard requirements in the session-73 analysis).
4. The PAD's known-gaps table gains the B74-F4 scope row (the name-cap reject doctrine is project-scoped; teams/elements truncate-at-80 — the documented product posture) and the B74-F5 posture row (the auth family's user-row updates carry no P2025 catch — unreachable via the API, the accepted posture).

### S74-G — the neutral-900 palette pin (A74-I2, the Tailwind v4 trap family)

`--color-neutral-900: #171717` joins the @theme reference-palette pins block — the four view-toggle sites (`bg-neutral-900 … hover:bg-neutral-900/90`) become drift-proof by the block's own rule. Unit pin: the theme test's pins-block contract extended (or a new pin in the s74 spec) — the literal hex present, the rule honored.

### S74-H — the verify-otp terminal return (B74-F6)

The handler gains the terminal `return fail("NOT_FOUND", "User not found", 404)` after the count===0 block (the vanished-user race family's form — the impossible-count fall-through now answers the envelope instead of an empty 200). Unit pin: the source contract (the terminal return present after the block).

## Planned counts

Unit: +~20 pins across three new spec files (`text-align-parity-s74`, `client-lows-s74`, `server-lows-s74`) → **~744**. E2E: unchanged at **243** (no new spec — the chosen fixes are source-contract level; the standing suite is the regression net; the S72 precedent). Smoke: unchanged at **58** (the refusal guard in check-db-contract adds no check — it refuses before any count runs).

## RED expectations

Unit RED: the elementToStyle justifyContent line absent; the two panel Set forms absent (the includes() forms present); the two date guards absent; db.ts's retired mechanism sentence present; the check-db-contract guard absent; the "three list-family routes" count present; the PAD §931 phantom citation present; the neutral-900 pin absent; the verify-otp terminal return absent. (The PAD citation/count pins are doc-source pins — the same source-contract discipline the repo's spec files already use for docs, e.g. the S69 doc-lows family.)

## Execution order

S74-A → S74-B → S74-C → S74-D → S74-E → S74-F → S74-G → S74-H → unit GREEN → lint → typecheck → build → the full e2e suite in chunks → smoke → full gate → live verification + screenshots + `.env.example` verification → docs → commit + push.

## Execution status

- [x] S74-A — the elementToStyle justifyContent line (the TEST-ONLY seam reproduces the canvas's full text geometry)
- [x] S74-B — the Set membership at the properties-panel filter + the layers-panel flip (the per-drag-tick scans closed)
- [x] S74-C — the corrupt-date guard at recent-view's openedLabel + the Dashboard's list-row date (the A-F4 family complete at all three sites)
- [x] S74-D — the db.ts header's schema-anchoring mechanism (both code sites now carry the corrected mechanism; the s73 pin extended)
- [x] S74-E — the check-db-contract refusal mechanism (the F60 discipline-becomes-mechanism lesson reaching the sibling; two-way proven)
- [x] S74-F — the honesty batch (the four-consumer count; the PAD §931 citation retired; the rotated-resize known-limitation row with the probe's evidence; the B74-F4 scope row; the B74-F5 posture row)
- [x] S74-G — the neutral-900 palette pin (the @theme pins block's own rule honored for the four view-toggle sites)
- [x] S74-H — the verify-otp terminal return (the vanished-user family form; the impossible-count fall-through answers the envelope)
- [x] Full gate green — zero regressions (lint · typecheck · ~744 unit / ~116 files · build · 58 smoke · 243 e2e — the full e2e re-run on the final code in chunks; the RED → GREEN transitions honest: the unit defect pins deterministically RED pre-fix)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the final build — the 51st consecutive session; the standard 32 re-captured + the ref-audit-s84 evidence set; the DB re-seeded pristine after every mutating phase)

## Execution notes (the realized counts + the en-route work)

Unit: +22 checks across three new spec files (text-align-parity-s74 4, client-lows-s74 7, server-lows-s74 11) → **746 = 724 + 22 / 116 files**. ZERO standing pins re-anchored (the fixes are additive — no contract restructured). E2E: unchanged at **243** (the full suite re-ran green in chunks — 247 chunked checks, the standing regression net). Smoke: unchanged at **58** (the check-db-contract refusal proven two-way: exit 1 with the foreign export, the pristine OK + exit 0 without).

**The en-route lessons (F61):** (1) the incomplete-family lesson — three consecutive audits found the same shape (a fix landing on N−1 of N sibling sites: the render-surface family's fourth surface, the Set family's two panel siblings, the date-guard family's two formatting siblings, the mechanism-comment family's second code site, the refusal mechanism's sibling script); the audit question matures from "does every render site carry the same mapping" to "**grep the whole family before declaring a fix complete** — the sibling count is a first-class fact of the plan"; (2) the probe-before-design discipline REWARDED — the rotated-resize question that looked like a pure semantics fork dissolved under the reference probe into "there is no reference behavior to copy" (the deferral converts to a documented non-goal with evidence, the cheapest possible resolution); (3) the reference's OWN bugs are parity data — the rotation-blind hit-test joins the dead-chrome family (the clone's rotation-aware hit-test is the documented working superset, no change needed); (4) the doc-source pin discipline — the PAD's own prose carried the retired phantom citation for a full session after the src-wide retirement (the retirement pin scanned only src/tests; the s69 doc-lows family pattern extends to the PAD's historical revision blocks).

**The en-route engineering notes:** the check-db-contract refusal guard's first form (presence-only) REFUSED EVERY RUN — `bun run` auto-loads the repo's own `.env` into `process.env`, so the guard must COMPARE the live value against the `.env` file's own value (a real shell export wins over `.env`; a differing value is the foreign-export signature — the bun-.env conflation corollary in lesson F61); the VLM flip-flops on handle-like chrome (2 yes / 2 no across four reads of the same evidence — the ring's corners look like handles at screenshot scale), so the probe's decisive datum is verified PROGRAMMATICALLY (the pixel analysis at the expected handle coordinates: 0.0% light at all four corners, ring-line-level 2.8–5.5% at the edge midpoints — a real 8–10px handle occupies 15–20%+ of a 22×22 sample).
