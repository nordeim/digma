# Remediation Plan — Session 73 (the Twenty-First Audit)

**Date:** 2026-10-04 · **Trigger:** the operator's session-103/104-cycle directive (refresh the workspace, re-validate the codebase against the mandated docs, audit the recent changes with the repo `skills/`, iterate to parity with `https://digma-371dfd0d.base44.app/` paying particular attention to the mobile navigation menu and possible TailwindCSS v4 bugs, the `.env` database contract with `db/` at the repo root, the vitest/playwright suites, the TDD remediation, the screenshots, the aligned docs, and the SSH-wrapper push to main only).

## The audit method

The lead's re-verification of the session-72 delivery (all five S72 seams verified intact in source at baseline — the rename unwrap + DELETE type honesty, the Toaster z-[300], the P2003 + timing-equalizer pair, the ninth clampText site, the five transactional ceilings), then the TWENTY-FIRST Mode C audit: two independent fresh-eyes full-file reviews by separate agents — auditor A over the editor core + client view layer, auditor B over the server + lib/config/infra side — against the `skills/code-review-checklist` dimensions with the AGENTS/CLAUDE documented contracts loaded first. Every chosen finding individually re-verified by the lead in source before this plan. The baseline gate re-proven BEFORE any change (lint · typecheck · 692 unit / 110 files · build · 58 smoke · e2e run in chunks — **all green, zero regressions; the prior session's claimed gate results HELD this cycle**, the F59 corollary satisfied), the DB verified at the pristine 1/2/6/1/3 contract, the parent-shell `DATABASE_URL` trap neutralized (the stale parent `.env` already deleted; the exported var persists in the sandbox shell, so the `unset` discipline stays in every db-touching command).

## Reference findings (49th audit — no drift, no new gaps)

The standing datums re-verified on `https://digma-371dfd0d.base44.app/` (agent-browser, desktop 1440×900 + mobile 390×844, the real CDP fill login): the desktop nav 124/96/92 × 36; the greeting "Good morning, sepnetflix2023 ✨" (the name populated, the morning bucket); Quick Stats 1 Projects / 0 Teams / Pro Plan; the Recent sort `last_accessed` / "1 file found"; zero kbd affordances; the Create-Team dead chrome the 49th (2 clicks, 0 dialogs); R3 mobile nav failure class A the 49th (nav `display:none`, links 0×0, no hamburger — the dashboard AND the editor page); the mobile editor header clipping Share/Present at 390 re-measured exactly (Share L385–R458, Present L466–R551 — byte-identical to the session-63…72 measurement); the board at 9 layers ("9 layers" + "Test Project One", opened through the project-card ANCHOR after the generic probe missed — the same first-attempt miss family as sessions 62–72). Evidence set: `docs/screenshots/ref-audit-s83/` (ref-00 desktop dashboard, ref-01 mobile dashboard 390, ref-02 mobile editor 390, ref-03 desktop Recent, ref-04 desktop editor).

The clone's mobile navigation verified live, end-to-end at 390×844 — the 50th consecutive session, ALL GREEN via the single-call verifier `scripts/verify-nav-s73.sh` (9/9: the 44×44 hamburger with the aria contract at [16,10], the Sheet dialog with 44px links + aria-describedby, the scroll lock, the focus trap over 6 Tabs, Escape with focus return + lock release, navigate-and-dismiss, the md-crossing close, the 768 boundary, and the class-A guard — the Tailwind v4 failure class A NOT present).

## The code audit findings (Mode C — twenty-first pass)

**0 Critical / 0 High / 2 Medium / 5 Low / 8 Informational** combined (auditor A: 0/0/2/1/3; auditor B: 0/0/0/4/5) — every chosen finding individually re-verified by the lead in source:

- **A-F1 (Medium): the PresentOverlay drops the canvas's textAlign→justifyContent mapping.** `editor-view.tsx:793-795` — the present text branch sets `display: flex` + `alignItems: center` + `textAlign` but NO `justifyContent`: the text node becomes a content-sized flex item, so `textAlign` has zero visible effect and centered/right text renders LEFT-ALIGNED in presentation mode. The canvas's ground truth (`canvas.tsx:676-685`) maps the alignment to justify-content so it is VISIBLE — the render-surface divergence on the same model field.
- **A-F2 (Low): the CanvasThumbnail carries the same missing mapping.** `project-card.tsx:179-181` — every 320×200 card thumbnail on Dashboard/Recent renders centered text left-aligned while the canvas, the PNG export, and the SVG export render it centered — an internally inconsistent projection of one field across the app's render sites.
- **A-F3 (Low — doc-honesty): the cited `canvasStyleFor` seam does not exist.** Grep across `src/` returns only four COMMENT citations (`editor-view.tsx:783`, `tests/present-text.test.ts:10,48`, `tests/e2e/session58-fixes.spec.ts:215`) — no such export in `src/lib/editor.ts`. The "EXACT contract" claim masked A-F1 for 15 sessions.
- **B-F1 (Low): the duplicate's post-commit re-read can answer `201 { project: null }`.** `duplicate/route.ts:72-79` — a concurrent DELETE of the copy between the transaction commit and the re-read yields a success-status envelope with a null payload; every sibling in the race-hygiene family answers 404 for a vanished row. The one post-commit read left unguarded.
- **B-F2 (Low): the row-heavy interactive transactions rely on Prisma's default 5s timeout.** The elements PUT (deleteMany + createMany of up to 2000 rows under the 32 MB cap + update + findMany) and the duplicate copy transaction — a max-ceiling save on a slow self-hosted disk can exceed 5s → the P2028-family abort escapes as an unstructured 500 (the no-bare-throw family this route's own comments enforce).
- **B-F3 (Low): the smoke gate's parent-env trap is operator discipline, not a mechanism.** `scripts/smoke-test.sh` never checks `DATABASE_URL` — a parent export pointing at a second seeded checkout makes the gate false-green. The S64-D doctrine ("a mechanism, not an intention") argues for closing it mechanically.
- **B-F4 (Low): residual timing oracles on forgot-password and resend-otp.** The known-email branches pay a `randomBytes` + SQLite write the unknown branches don't — the S72-C login family's siblings. Marginal leak (register's explicit 409 enumerates anyway) → documented as an accepted posture this session.
- **A-F4 (Info): dead `||` fallback in the card's opened label** (`project-card.tsx:361-364` — `toLocaleDateString` never returns `""`; a corrupt date renders "Opened Invalid Date").
- **A-F5 (Info): O(n·m) selection membership scans in the canvas render path** (`canvas.tsx:89-93,475` — a Set closes it).
- **A-F6 (Info): the layer drag-reorder is pointer-only** (reference parity softens — deferred).
- **B-F5 (Info — doc-honesty): the db-path standalone-trap comment states the WRONG mechanism.** Live probes (bun + node): the Prisma 6 runtime anchors relative `file:` URLs against the schema directory the client was generated against, NOT the process CWD — the standalone trap is real (the traced schema copy relocates the anchor) but the chdir is causally irrelevant; the wrong mechanism steers future path debugging toward chdir-based non-fixes.
- **B-F6 (Info): verify-otp's line-107 condition is half-dead** (`user.verifyCode !== code || verifiedResult.count === 0` — the second disjunct is always true at that point; the first is dead).
- **B-F7 (Info): the list GET's `?template=` filter has zero consumers** (extends the S72-D honest API-surface family).
- **B-F8 (Info): the projects POST response is the one list-family reply still off the thumbnail projection, and the client comment claims otherwise** (`include: { elements: true }` full-row form; the comment says "no element include").
- **B-F9 (Info): check-db-contract validates 4 of the pristine contract's 5 counts** (members===3 missing).

### The deferred queue (documented, deepened this audit — not all chosen)

The at-rest token hashing (ADR-014 posture-gated; logout clears the cookie, reset evicts via tokenVersion — acceptable for the self-hosted single-tenant posture), the rate-limit bucket eviction amortization (O(n) sweep per call; delete-on-access or counter-modulo when it matters), the duplicate/elements-GET/elements-POST zero-consumer decision (the S72-D honest API-surface note now extended to `?template=`), the hidden-panel render cost below md/lg (the panels are display:none-but-mounted; a matchMedia mount gate when it matters), the server-side elementSummary re-derivation (the sanitizer + the locked-delete re-guard bound the blast radius), the informational asymmetries (marquee×locked, shift-click semantics, the pointer-only layer reorder), and the forgot/resend residual timing oracles (B-F4 — the PAD deviation note this session).

## The chosen session work (TDD)

### S73-A — the textAlign→justifyContent mapping across ALL render surfaces (A-F1 + A-F2 + A-F3)

1. **The pure seam.** `src/lib/editor.ts` gains `textAlignToJustify(align: string | null | undefined): "flex-start" | "center" | "flex-end"` — the one mapping every text render site consumes.
2. **The canvas migrates onto it** (behavior identical — the ternary moves into the seam).
3. **The present branch** (`editor-view.tsx`) gains `justifyContent: el.type === "text" ? textAlignToJustify(el.textAlign) : undefined` — centered text renders centered in Present mode.
4. **The thumbnail branch** (`project-card.tsx` CanvasThumbnail) gains the same line — every card thumbnail renders the alignment.
5. **The phantom citation becomes true**: the four `canvasStyleFor` comment citations corrected to the real seam (`textAlignToJustify` + the inline canvas text chain).
6. **TDD**: unit pins on the seam + the three consumption sites + the citation correction; e2e pin — set the seeded Headline's alignment to center through the real Text Align buttons, enter Present, assert the computed `justify-content: center`.

### S73-B — the duplicate post-commit null guard (B-F1)

The re-read gains `if (!project) return fail("NOT_FOUND", "Project not found", 404);` — the vanished-copy race answers through the envelope like every sibling. Unit source pin.

### S73-C — the row-heavy transaction timeouts (B-F2)

The elements PUT transaction and the duplicate copy transaction gain `{ timeout: 30_000 }` — a max-ceiling save on a slow disk no longer aborts at the default 5s. Unit source pins.

### S73-D — the smoke-gate parent-env mechanism + the contract's fifth count (B-F3 + B-F9)

1. `scripts/smoke-test.sh` gains the refusal guard at the top: a non-empty exported `DATABASE_URL` answers a refusal message + exit 1 (the operator discipline becomes a mechanism — the false-green second-checkout case dies).
2. `scripts/check-db-contract.ts` adds `members === 3` (the fifth count of the pristine contract).

### S73-E — the name-cap symmetry (the deferred #1, DQ-1)

The projects PATCH's name field moves from `clampText(body.name, 120)` to the POST's explicit form: trim, empty → the existing 400, length > 120 → the SAME `fail("VALIDATION", "Project name is too long (max 120)", 400)` — explicit-over-silent, matching the POST's shipped, pinned contract. The description fields stay truncate-at-500 (the documented product semantics: names are identity — reject; descriptions are prose — truncate). Unreachable from the app (the UI's maxLength=120 on both input surfaces). Unit pins on the PATCH's reject form.

### S73-F — the unbounded list aggregate bound + the upload downscale (the deferred #2, DQ-2 + DQ-3)

1. **The bound.** The list GET (`projects/route.ts`) gains `take: PROJECT_LIMIT` — the aggregate is bounded by construction at the product ceiling (500 rows; the views render all — the reference has no pagination either; the honest bound replaces the unbounded findMany).
2. **The bytes.** The upload seam (`properties-panel.tsx`) gains the client-side downscale: after the whitelist check, images with a dimension over `FILL_IMAGE_MAX_DIM` (1200) are drawn to an offscreen canvas at ≤1200 longest side and re-encoded; the SHRUNK result is used only when actually shorter than the original. The pure helpers (`FILL_IMAGE_MAX_DIM`, `shouldDownscale(w, h)`, `downscaledDimensions(w, h)` — the fit math) live in `src/lib/editor.ts`; the DOM-dependent draw stays in the component. Every payload family (the autosave PUT, the detail GET, the list GET) shrinks for future uploads at once. The 500 KB file gate stays (defense in depth).
3. **TDD**: unit pins on the pure helpers + the component wiring source contract; e2e pin — upload a 2400×2400 PNG through the real input, assert the persisted fillImage decodes at ≤1200.

### S73-G — the rotated-resize semantics decision: DEFERRED with the design-space closed (the deferred #3, M-A1's code half)

The lead's post-audit design analysis (below) found the implementation is NOT a pure math generalization — it requires a PRODUCT-SEMANTICS decision the reference audit has never probed. Deferring with the complete characterization:

1. **The geometry (auditor A's verified evidence).** The handles render on the rotation-aware AABB (`boundsOf` folds the four rotated corners); the drag math never sees rotation (world-axis `point.x − x` formulas on the local extents). At 90° the "e" handle renders on the world-east face — which is the LOCAL top edge, and its world-x is pinned at `el.x` by the origin: **no local-axis growth can ever move the AABB's east face east**. The current code grows the local width on an eastward drag, which renders DOWNWARD (the wrong axis).
2. **The design space (the lead's analysis — why no mechanical fix exists):** (a) the *local-axis projection* design (inverse-map the pointer delta onto the rotated local axes, anchor the opposite corner) is byte-identical at rotation 0 and mathematically clean — but at 90° an eastward drag projects to ZERO on the local x-axis, so `Math.max(≈0, minVisual)` COLLAPSES the element while the pointer sits far away — a worse UX than the current wrong-axis growth; (b) the *proportional-world* design (the dragged AABB face follows the pointer; the element scales uniformly) matches the user's perception — but it changes the r=0 semantics (edge drags would grow BOTH dimensions) and violates the documented "resizing never rescales" contract; no single semantic reduces to the current behavior at r=0 AND follows the pointer at r=90 — the choice is a product decision, not a derivation.
3. **The process fix (the next cycle's first probe):** the reference app itself is a Figma-like editor — its OWN rotated-resize behavior (per-axis-local handles rotated with the element vs. AABB handles with proportional scaling) is the parity answer. The next reference audit probes it live (rotate an element 90°, drag its resize handle, measure which axis grows and whether the face follows the pointer) BEFORE the semantics are chosen. The PAD's S72-D rotation-scope correction stays accurate (rotated resize documented out of scope); this plan records the closed design space so the implementing session starts from the decision, not the discovery.

### S73-H — the honesty batch (the riders)

1. **B-F5**: the db-path header's mechanism corrected to schema-anchoring (the AGENTS bullet + the `db-path.ts` comment; the standalone trap's REAL cause — the traced schema copy — stays).
2. **B-F6**: verify-otp's half-dead condition simplified to the honest form (`verifiedResult.count === 0` alone, the comment stating why the first disjunct died).
3. **B-F7**: the `?template=` / `?search=` honest API-surface note (the S72-D family extension).
4. **B-F8**: the projects POST's include flips to the bounded projection (`elements: { select: THUMBNAIL_ELEMENT_SELECT }`) + the client comment corrected.
5. **A-F4**: the openedLabel's dead fallback → the `Number.isNaN` guard.
6. **A-F5**: the canvas's selection membership → the Set.
7. **B-F4**: the forgot/resend residual timing oracles recorded in the PAD's deviation ledger (the accepted posture, the login fix's documented residue).

## Planned counts

Unit: +~35 pins across three new spec files (`text-align-parity-s73`, `server-lows-s73`, `upload-downscale-s73`) → **~727**. E2E: +2 checks in one new spec file (`session73-fixes.spec.ts` — the present-mode centered text, the upload downscale round-trip) → **~242**. Smoke: unchanged at **58** (the refusal guard adds no check — it refuses before any check runs).

## RED expectations

Unit RED: the seam + the two consumption lines absent (the present/thumbnail branches carry no justifyContent); the duplicate re-read unguarded; the timeout options absent; the smoke guard absent; the members count absent; the PATCH truncate form present (the reject form absent); the take absent; the downscale helpers absent; the rider forms absent. E2E RED: the two new spec checks fail on the pre-fix build (the centered text renders `justify-content: normal` in Present; the 2400px image persists at full size).

## Execution order

S73-A (the headline parity fix) → S73-B → S73-C → S73-D → S73-E → S73-F → S73-H (the riders) → unit GREEN → build → e2e GREEN (the full suite in chunks) → smoke → full gate → live verification + screenshots → docs → commit + push.

## Execution status

- [x] S73-A — the textAlign→justifyContent mapping across all render surfaces (the seam + the canvas migration + the present branch + the thumbnail branch + the phantom citation retired)
- [x] S73-B — the duplicate post-commit null guard (the 404 envelope)
- [x] S73-C — the row-heavy transaction timeouts (the elements PUT + the duplicate at 30s)
- [x] S73-D — the smoke-gate parent-env mechanism (the refusal guard, two-way proven: exit 1 with the export, 58/58 without) + the fifth contract count (members === 3)
- [x] S73-E — the name-cap symmetry (the PATCH carries the POST's exact validation shape; descriptions stay truncate-at-500)
- [x] S73-F — the list aggregate bound (take: PROJECT_LIMIT) + the upload downscale (the pure helpers + downscaleDataUrl + the min-length guard)
- [x] S73-G — the rotated-resize semantics decision: DEFERRED with the design space closed (the full analysis in the plan body; the next cycle's reference probe decides the semantics)
- [x] S73-H — the honesty batch (the db-path mechanism correction in code + AGENTS + the skill's pitfalls/debug rows, the verify-otp live condition, the POST projection include + the client comment, the openedLabel NaN guard, the canvas Set membership, the `?template=` note, the B-F4 deviation row in the PAD's known-gaps table)
- [x] Full gate green — zero regressions (lint · typecheck · 724 unit = 692 + 32 / 113 files · build · 58 smoke · 243 e2e = the documented 240 + 3 new — the full e2e re-run on the final code in chunks; the RED → GREEN transitions honest: 24 unit defect pins + the two e2e defect checks deterministically RED pre-fix)
- [x] Live verification + screenshots + docs + push (the mobile nav 9/9 re-verified on the final build — the 50th consecutive session; the standard 32 re-captured + the ref-audit-s83 evidence set (5 reference + 10 clone) + THREE NEW inline checks — the present-mode alignment center, the card-thumbnail alignment center, the name-cap PATCH 400; dimension-checked 280/280 (the checker extended with the S83 mapping + the glob), VLM 21/21; the DB re-seeded pristine after every mutating phase)

## Execution notes (the realized counts + the en-route work)

Unit: +32 checks across three new spec files (text-align-parity-s73 8, server-lows-s73 15, upload-downscale-s73 9) → **724 = 692 + 32**. ONE standing pin legitimately re-anchored (the s70 verify-otp wrong-code display locator moved onto the live condition — the half-dead disjunct it anchored died, the contract-change comment + the widened window for the new comment block).

E2E: +3 checks in `tests/e2e/session73-fixes.spec.ts` (the present-mode centered text — computed justify-content center through the REAL Align-center button; the Recent card thumbnail's same; the upload downscale round-trip — a browser-generated 2400×2400 PNG through the real file input decoding at ≤1200 with the square aspect) → **243**. Smoke: unchanged at **58** (the refusal guard adds no check — it refuses before any check runs; proven two-way).

**The en-route work (the F60 lessons):** (1) the phantom-citation mask — a comment citing a seam that does not exist upheld a false "EXACT contract" claim for 15 sessions (grep every preservation reference before trusting it; the honest fix either corrects the citation or makes it true by extracting the real seam); (2) the render-surface divergence class — one model field rendered by N surfaces drifts silently when a fix lands on ONE (the audit question is "does every render site carry the SAME mapping", and the flex-row text-node trap: display:flex + textAlign with NO justifyContent means text-align has zero visible effect on a content-sized flex item); (3) the design-space-before-implementation discipline — the rotated-resize generalization looked mechanical until the 90° analysis showed both candidate semantics fail a hard requirement (a documented deferral with the full analysis beats a shipped wrong semantic; probe the reference's own behavior first); (4) the discipline-becomes-mechanism pattern — any documented "always run X as Y" ritual is a missing guard in the script itself (the refusal check converts the documentation into enforcement). Corollaries: the F58 comment-literal discipline's FIFTH appearance (the retirement comment quoting the dead identifier tripped the retirement pin — reword history notes instead of quoting them), and the sliced-spec window discipline (widen the locator's character window when a new comment block lands between the anchor and the pinned form).
