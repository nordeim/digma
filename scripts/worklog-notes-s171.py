#!/usr/bin/env python3
"""worklog-notes-s171.py — land the Session 171 auditors' block at the
repo worklog (the standing precedent: the registration notes land BEFORE
the spec's birth). Appends:

  --- 
  Task ID: digma-s171-audit-B   (auditor B's entry, the premises note riding inside)
  Task ID: digma-s171-audit-A   (auditor A's entry, the below-threshold note riding inside)
  ---

Idempotent: skips if the anchor already present.
"""
from pathlib import Path

WORKLOG = Path("/home/z/my-project/digma/worklog.md")
B_ENTRY = Path("/home/z/my-project/auditor-B-entry-s171.md")
A_ENTRY = Path("/home/z/my-project/auditor-A-entry-s171.md")

B_NOTE = (
    "[s171-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE FORTY-FIFTH CONSECUTIVE CYCLE, all four premises re-derived LIVE this cycle by auditor B, all four HOLDING: P1 the churn-consuming registrations value-based or honest-refusal at all twelve sites (editor-store markSaved/addElements/updateElements/scaleElements/moveElements/deleteElements/reorderElements/toggleVisibility/toggleLock; properties-panel fillKey :1858; layers-panel rename; ai-assistant send-time targetIds); P2 the index-stable remap at editor-view.tsx:412-419 behind the five-guard stack (disposed :373, swap :381, elements-reference :382, background :399, gesture :409); P3 the replace-transaction seams at elements/route.ts:365-382 (deleteMany + createMany + project.update + the inside-read findMany, one $transaction, timeout 30_000); P4 the value-based perimeter (zero localStorage/sessionStorage/indexedDB anywhere in src/). The judgment carried unchanged from the prior forty-four cycles: the structural rewrite's regression risk continues to outweigh its churn-optimality benefit at this stability level — nothing in this cycle's census (a 0C/0H cycle whose every actionable member lives on the dependency/doc surface, zero source-side findings, the layer total STAYING 14,307, every guarded seam held through the operator's dependency bump with all six gates re-verified green on the new stack) grows a mutation-surface member that would promote it. The premises-pinning doctrine (F130, carried): a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred, and pin them so the re-derivation is mechanical.]"
)

BELOW_THRESHOLD_NOTE = (
    "[s171-below-threshold-note: THE BELOW-THRESHOLD + PRE-EXISTING REGISTRATIONS "
    "(A171-I-1 + A171-I-2 the directive-side pair; B171-I1..I4 the pre-existing "
    "family — all Informational, Verified; the deferral family's standing "
    "re-verification): the five S168-registered below-threshold observations "
    "recomputed live at the 119th cycle by auditor A, all five still "
    "accurately described, still below-threshold, correctly located — "
    "(a) the Insert handler's inline four-draw-type membership at "
    "editor-view.tsx:982-985; (b) the no-op-guards counting-unit nuance at "
    "editor-store.ts:758-762 (thirteen literal return-{} statement sites "
    "live under the registered statement unit); (c) the gradient-stop "
    "same-reference posture at editor.ts:986; (d) the no-op dismiss timers "
    "at use-toast.ts:59-61; (e) the mobile crossing-close family (the lg "
    "pair at editor-view.tsx:1403/:1530, the md member at app-header.tsx:67) "
    "— plus the components-panel no-op with its PAD §10 scope cut — carried "
    "per the standing plans. THE DIRECTIVE-SIDE PAIR (the F157 scope-naming "
    "class one generation up, in the audit directive itself, never in any "
    "source or frozen record): A171-I-1 — the s171 directive's own 22-file "
    "parenthetical ('all non-test .tsx/.ts under src/components and "
    "src/hooks') derives 28 files / 12,652 lines live; the established "
    "22-file layer is that set MINUS the 10 ui/ primitives PLUS "
    "editor.ts/ai-assistant.ts/export-png.ts/globals.css = 22 / 14,307 "
    "(the composition the tests/lows-s170.test.ts runtime guard pins by its "
    "own glob groups); the next generation's directive should carry the "
    "composition language. A171-I-2 — the directive's radix file list named "
    "'toast.tsx'; the actual tenth ui/ file is toaster.tsx, a plain-div "
    "toaster consuming zero radix packages (@radix-ui/react-toast not "
    "installed; the @radix-ui imports confined to exactly the seven "
    "consumers); the next generation's directive should name toaster.tsx. "
    "THE PRE-EXISTING FAMILY (B171-I1..I4, inexact since before this "
    "cycle, registered with their postures): I1 — the 'Radix packages ^1.x "
    "per package.json' cells at PAD:1986/SKILL:67 while dropdown-menu "
    "^2.2.1/label ^2.1.17/select ^2.4.1 are ^2.x (inexact since the "
    "initial scaffold; the accurate form '^1.x/^2.x per package.json'); "
    "I2 — the 'Bun >=1.4.x' cells at PAD:1994/SKILL:74 against the live "
    "bun runtime 1.3.14 (the unit ambiguous against the bun-types ^1.4.3 "
    "family; the honest form names both units); I3 — SKILL:76's env-table "
    "header 'complete — matches .env.example exactly' listing three of "
    "the eight app vars (the five optional knobs absent; DEPLOYMENT.md "
    "§3 carries the complete table); I4 — bun.lock's workspace name "
    "'activity-map' (the scaffold template's name, carried since the "
    "initial commit) vs package.json/package-lock 'digma' — cosmetic (the "
    "root name is not consumed for resolution); the lockfile never "
    "hand-edited by the audit. REGISTERED, not promoted.]"
)

DEPENDENCY_BUMP_NOTE = (
    "[s171-dependency-bump-note: THE OPERATOR'S 129e49df REGISTERED — THE "
    "REPO'S FIRST-EVER DEPENDENCY-RANGE BUMP + THE package-lock.json "
    "CREATION (B171-M2 + B171-L3, both lead-verified live at their seams; "
    "the count-truth family's manifest arm, the frozen-record form — the "
    "commit's own message 'update session log' misdescribes its content, "
    "a recorded fact about the commit, never rewritten): WHAT LANDED — "
    "package.json's ranges moved (next ^16.3.6->^16.4.2, react/react-dom "
    "^19.3.0->^19.3.1, @playwright/test ^1.63.0->^1.64.1, vitest "
    "^5.0.1->^5.0.5, bun-types ^1.4.2->^1.4.3, and the six radix members "
    "dialog ^1.1.23->^1.3.1 / dropdown-menu ^2.1.24->^2.2.1 / label "
    "^2.1.15->^2.1.17 / select ^2.3.7->^2.4.1 / slot ^1.3.3->^1.5.0 / "
    "tabs ^1.1.21->^1.2.1), package-lock.json created (npm lockfileVersion "
    "3, 9,830 lines, 608 entries), bun.lock re-resolved, session_410.md "
    "added — ZERO src/ files touched, so the 22-file layer STAYED 14,307 "
    "and the route layer STAYED 2,450 by construction. THE GATE "
    "RE-VERIFICATION ON THE NEW STACK (this cycle, the honest environment "
    "record): all six baseline gates green — lint 0, typecheck 0 (tsc "
    "exit 0 on react 19.3.1/next 16.4.2/the six radix bumps, zero peer "
    "conflicts), unit 2377/2377 across 232 (vitest 5.0.5), build 27 "
    "routes with the [db] anchor at the repo root, smoke 73/73, e2e "
    "262/262 zero flakes (6.6m) — AND one infrastructure incident "
    "honestly pre-empted the THIRD consecutive cycle: Playwright 1.64.1 "
    "requires chromium-1248/chromium_headless_shell-1248 (the cache held "
    "only 1200/1243); re-provisioned by `bunx playwright install "
    "chromium` BEFORE the first e2e run, the S167 incident's own shape, "
    "the source never at fault. THE DUAL-LOCKFILE TRUTH: all 29 direct "
    "dependencies resolve IDENTICALLY across package.json / bun.lock / "
    "package-lock.json and satisfy their ranges — but ~45 transitive "
    "packages resolve differently between the two lockfiles (vite 8.3.0 "
    "vs 8.3.5, rolldown + its 15 platform bindings 1.2.9 vs 1.2.15, "
    "postcss 8.5.23 vs 8.5.31, axe-core 4.13.0 vs 4.14.0, the ten "
    "@typescript-eslint/* 8.70.1 vs 8.72.0, lightningcss 1.32.0 vs "
    "1.33.0-nested, @types/node 26.6.2 vs 26.6.5, zod 4.6.5 vs 4.6.7, "
    "undici-types 8.9.0 vs 8.12.3, browserslist/caniuse-lite, acorn, "
    "nanoid, enhanced-resolve — floating-range snapshots plus npm's "
    "nested semver sets where bun hoists), and npm ci would run six "
    "install-script packages where bun's trustedDependencies gates to "
    "one; EVERY GATE RUNS ON THE BUN TREE — the npm tree is registered "
    "as UNVERIFIED-AT-THE-TRANSITIVE-LAYER. THE CANONICAL-LOCKFILE "
    "JUDGMENT: bun.lock stays the gate-verified canonical (the AGENTS "
    "re-word carries the two-lockfile reality); package-lock.json stays "
    "the operator-committed npm mirror, never deleted or regenerated by "
    "the audit (the operator's own artifact); an npm-tree consumer "
    "regenerates or verifies before trusting. THE COLLATERAL MISSES "
    "(the bump's own doc-truth debt, closed by the S171-A repair in the "
    "same cycle): AGENTS:22's only-lockfile claim (B171-M1), README's "
    "16.3/1.63 cells (B171-L1), the PAD/SKILL floors (B171-L2). THE "
    "DOCTRINE (F158, the dependency-bump version-truth member): a "
    "dependency-range bump joins every version-claim site its family "
    "holds IN THE SAME COMMIT — the manifest's ^ floors are live claims "
    "quoted by the tech-stack tables (PAD §1.2, SKILL §2, README's "
    "cells) and the lockfile count is a live claim of the operative doc "
    "(AGENTS); a bump that lands without its doc sweep leaves every one "
    "of those sites stale-born, and the FIRST bump in a repo's history "
    "has no prior form to copy — so the bump commit must carry the "
    "doc-floor re-anchors, the lockfile-count truth, the infrastructure "
    "consequences (a Playwright bump moves the chromium revision — "
    "provision BEFORE the first e2e), and the registration note at the "
    "worklog.]"
)

text = WORKLOG.read_text()
if "Task ID: digma-s171-audit-B" in text:
    print("already landed — skip (idempotent)")
    raise SystemExit(0)

b_entry = B_ENTRY.read_text().strip()
a_entry = A_ENTRY.read_text().strip()

block = (
    "\n---\n\n"
    + b_entry
    + "\n\n"
    + B_NOTE
    + "\n\n"
    + a_entry
    + "\n\n"
    + BELOW_THRESHOLD_NOTE
    + "\n\n"
    + DEPENDENCY_BUMP_NOTE
    + "\n---\n"
)

WORKLOG.write_text(text.rstrip("\n") + "\n" + block)
print("landed: the s171 auditors' block (B entry + premises note + A entry + below-threshold note + dependency-bump note)")
