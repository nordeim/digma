I'll internalize the operating instructions and continue the digma repository audit and remediation workflow. Let me set up the task tracking and begin.
**Task Type: Type 4 (Codebase Audit & Remediation) + Type 3 elements (dev server verification)**

Let me start with Step 1: refreshing the workspace.
The digma directory is empty — workspace has been reset. I'll clone the repo fresh as instructed.
Workspace refreshed successfully. Latest commit is `f80b191` (session-121 pass). Now Step 2: reading the core documents.
The docs are large. Let me read the persisted outputs systematically.
The docs are very large (AGENTS.md is 232KB). Let me take a strategic approach — read key sections myself and delegate deep exploration to agents in parallel.
Now let me read CLAUDE.md and README.md.
Now let me read digma_SKILL.md and scan the PAD structure.
Core docs absorbed. Now Step 3: reviewing the session documents — session_211, remediation-plan-session121, worklog, session_212.
Session 121 was delivered and pushed. My current run is **Session 122 — the 70th Mode C audit cycle**. Let me read the worklog tail to complete the picture.
Let me verify the session doc numbering pattern and check what the recent commits touched.
The pattern is clear: Session N produces `docs/session_(2N-1).md` (cycle log, main commit) + `docs/session_(2N).md` (process log, follow-up commit). My run is **Session 122 — the 70th Mode C audit cycle**, which will produce session_213/session_214 docs.

Let me now validate the S121 delivery against the codebase and set up the environment.
Confirmed the standing environment traps: no `.env`, no `db/`, and the parent-shell foreign `DATABASE_URL` is exported (the known trap — all commands must run under `env -u DATABASE_URL`). Let me set up the environment.
Database seeded with the PRISTINE CONTRACT (1 user / 2 projects / 6 elements / 1 team / 3 members). Now let me verify the S121 delivery seams in source.
All S121 seams verified intact (loadingRef :712/:808, aliveRef :134/:537, panel gates + placeholders, composed disabled forms, 16/16 pins green, line counts match PAD §11). Let me verify the version chain and check the skills catalog.
Version chain verified (SKILL v1.99.0, PAD v1.100.0, AGENTS session-121 bullet). Let me check the key skills for this cycle: tdd, tailwind v4, agent-browser, clone-app-pat-pro.
The relevant skills are available (`tdd`, `tailwind-patterns`, `agent-browser`, `clone-app-pat-pro`, `nextjs16-tailwind4`) — all already deeply embedded in the repo's established workflow. Now let me run the baseline six gates (lint → typecheck → unit → build → smoke → e2e).
Unit gate GREEN: 1688/1688 across 183 files (matches S121 delivery exactly). Now the build gate.
Smoke gate GREEN: 73/73. Now the final baseline gate — e2e (expect ~7 minutes).
E2E gate exited with code 1 — let me diagnose the failure.
All tests fail instantly (1ms) — this is an infrastructure failure, not test failures. Let me get the root error.
Root cause: the Playwright chromium browser binary is missing (fresh sandbox — the browser cache was lost with the reset). Installing it now.
**ALL SIX BASELINE GATES GREEN** — lint ✓ · typecheck ✓ · unit 1688/183 ✓ · build 27 routes ✓ · smoke 73/73 ✓ · e2e 262/262 (6.7m, zero flakes — the F59 corollary's 43rd consecutive).
Now deriving the s122 parity scripts from the s121 forms. First, let me study the s120→s121 derivation convention.
The derivation convention is clear (22/66/6 raw diff lines last cycle). Let me write the persisted derivation script with exact-replacement assertions, per the standing convention.
Diff count shows 0 — let me verify the derivation actually worked using the real diff command.
Derivation landed at 22/64/6 raw diff lines (byte-compatible with the s121 family of 22/66/6 — the 2-line delta is the multi-token consolidation). Let me verify no residue and check the ordinals in the derived scripts.
Derivation is clean and ordinal-correct. Now running the parity gates — first the **98th reference audit** against the live reference app (credentials via env per S92-B).
**98th reference audit: NO DRIFT** — clip pin byte-identical (`Share:L385-R458,Present:L466-R551` — the **59th consecutive session**), all standing datums verified. Now the **99th mobile-nav verification** on the baseline build.
Mobile nav 9/9 GREEN — but the final echo line shows missed replacements (the summary echo form). Let me fix the derivation.
Diff counts now byte-identical to the s121 family (22/66/6), mobile-nav **9/9 GREEN — the 99th session**. Now the SEO gate.
**ALL PARITY GATES GREEN** — 98th ref audit NO DRIFT (clip pin 59th consecutive) · 99th mobile-nav 9/9 · SEO 4/4. Now launching the **70th Mode C audit** — two fresh-eyes auditors in parallel.
Both auditors returned: combined **0 Critical / 0 High / 0 Medium / 2 Low / 4 Informational**. Per the F78 doctrine, every finding must be lead-verified in source at its seam. Let me verify each.
**A122-L1 VERIFIED REAL** — the catch branch (:614-621) restores the draft + toasts with no `aliveRef` check, falsifying the S121-B comment's "no draft restore into a dead input, no toast onto the next page". Now A122-L2.
**A122-L2 partially verified** — the guard reads the store's stale `projectId`. Let me verify the unknown-id 404 fallback path to complete the failure construction.
The 404→Untitled fallback is confirmed (ADR-009). **A122-L2 VERIFIED REAL** — the S58-F guard reads the stale singleton id through the unknown-id window, so Share answers "link copied" with a dead URL where the post-window answer is the honest "Share unavailable". Let me check the S121-D survival pin's exact form before designing the fix.
The pin asserts the BUTTON stays ungated (`shareBlock` not matching `disabled={loading}`) — a guard-level fix inside `onShare` doesn't touch it. Let me verify the UNTITLED_PROJECT id form and check pin exposure for the Share guard + catch path.
Pin exposure mapped. Let me verify the remaining seams: B122-I2 (password equalizer), A122-I1 (toolbar rendering), and the S121-A registration comment location for S122-C.
All seams lead-verified. Let me study the exact pin forms my fixes will collide with (s106 catch pin, s121 aliveRef pins, s58 Share pin).
Collision map complete — all surviving pins verified. Let me check password.ts pin exposure and confirm the auditors' worklog records.
All collisions mapped and survivable. Now writing the remediation plan for Session 122.
Plan written. Now the **TDD RED phase** — writing `tests/lows-s122.test.ts`. Let me study the s121 spec's structure first.
Now writing the s122 spec — `tests/lows-s122.test.ts` (the TDD RED phase).
Let me clean up a drafting artifact (the stray identity helper) before running RED.
Now running the RED phase — expecting the 8 DEFECT pins RED and 7 SURVIVAL pins GREEN.
**TDD RED CONFIRMED: 8 DEFECT RED / 7 SURVIVAL GREEN.** Now the GREEN phase — applying S122-A first (the catch-path liveness guard).
S122-A applied. Now S122-B — the Share guard's URL-truth composition.
S122-B applied. Now S122-C — the viewport-class exclusion registration at the loading-stand-down seam.
S122-C applied. Now S122-D — the password equalizer fine-print registration.
All four fixes applied. Running the GREEN phase.
**TDD GREEN: 15/15.** Now the full unit gate to enumerate the collateral family (forecast: the s58 guard pin).
Collateral family exactly as forecast: 3 failures / 2 files (the s58 guard pin + the PAD §11 line-count pair). Let me apply the F89 repairs.
Now the F89 pin repairs. First the s58 guard pin re-anchor.
s58 pin re-anchored. Now the PAD §11 rows (editor-view 2255 → 2285, ai-assistant 767 → 776, with the S122 seam members).
**Full unit gate GREEN: 1703/1703 across 184 files** — exactly the forecast. Now the count-family re-anchor (1703 = 1688 + 15 / 184 files) across every live claim site.
Let me check the dynamic assertion forms and the PAD §7.1 table structure before writing the re-anchor script.
Let me check the FILES pin assertions and AGENTS bullet claims before writing the re-anchor script.
The row-sum arithmetic stays coherent (1688+15=1703, 183+1=184). Writing the persisted count-family re-anchor script.
10 failures — the dynamic pins need the AGENTS session-122 bullet (carrying "184 files") and possibly other doc forms. Let me enumerate them.
The 10 failures are all the LIVE ANCHOR family requiring AGENTS to carry "184 files" — which arrives with the session-122 bullet. Now the docs step. Let me find the F108 lesson location and the AGENTS bullet insertion point.
Now the doc-versioning script — AGENTS session-122 bullet, SKILL v1.100.0 + F109, PAD v1.101.0.
The script has dead-code branches I need to clean before running (the CHAIN temp replacement would corrupt the PAD). Let me fix it.
**Full unit gate GREEN: 1703/1703 across 184 files.** Before the final gates, let me verify the Share-related e2e flows won't break under the composed guard.
Both Share e2e flows are safe under the composed guard (the refusal toast never navigates; the loaded case passes). Now the final gates — lint and typecheck first.
**ALL SIX FINAL GATES GREEN** — lint ✓ · typecheck ✓ · 1703/184 ✓ · build 27 routes ✓ · smoke 73/73 ✓ · e2e 262/262 zero flakes. Now the verify-nav + SEO re-run on the FINAL S122 build.
Nav 9/9 + SEO 4/4 on the FINAL build. Now the DB re-seed (the standing hygiene) and the capture script derivation.
Writing the s122 capture script (derived from the s121 form).
Capture script derived (33 raw diff lines, the s121 family form). Running the capture — this re-verifies every standing witness LIVE on the S122 tree and re-captures the standard screenshot set.
**ALL CAPTURED** — every standing witness re-verified LIVE on the S122 tree. Now the post-capture DB contract check and the e2e-touched evidence discrimination.
The boundary is clear: 10 e2e-touched PNGs (22:58-22:59, between the e2e run and the 23:02+ capture window) + the new ref-audit-s132 evidence (keep). Restoring the outside-window witnesses per the S122-F discipline.
**Dimension check: 699/699 OK.** Now updating the remediation plan's execution record and writing the session_213.md cycle log.
Now the commit. Let me verify the git status first (nothing forbidden: no .env, no db files, no keys).
All clean — no forbidden files. Creating the commit with the conventional form.
Commit `1eeb357` landed (104 files, clean tree). Now the SSH-wrapper push — reading the runbook first.
The paramiko shim is already deployed at `/home/z/my-project/bin/ssh`. Materializing the operator key and running the dry-run.
Key verified (ed25519). Now the dry-run.
Dry-run clean — fast-forward `f80b191..1eeb357` authenticated. Executing the real push.
All tasks complete. The push was remote-verified and the operator key shredded.
## Session 122 — the 70th Audit Cycle — Complete and Pushed ✅

**Delivered (S122-A..S122-F):**
- **S122-A (headline)**: the AI send's **catch-path liveness guard** — a network failure no longer restores the draft or toasts onto the departed page
- **S122-B**: the **Share guard's URL-truth composition** — closes the stale-singleton bypass through loading windows (the button stays ungated per the honest-exclusion pin)
- **S122-C/S122-D**: the viewport-class exclusion + equalizer fine-print registrations
- **S122-E/F**: the 15-pin spec family + the evidence-restore hygiene

**Evidence**: all six gates green (**1703 unit / 184 files · 73 smoke · 262 e2e zero flakes**) · 98th reference audit **NO DRIFT** (clip pin 59th consecutive) · mobile nav **9/9** (99th session, Tailwind v4 guard) · SEO 4/4 · dimensions 699/699. Docs aligned (PAD v1.101.0, SKILL v1.100.0 + F109).

**Audit verdict**: 0 Critical / 0 High / 0 Medium / 2 Low / 4 Informational — two fresh-eyes auditors, every finding lead-verified.

Pushed to main **`1eeb357`** (remote-verified via SSH wrapper, keys shredded). The next cycle (Session 123) will re-pull and audit the S122 seams — just say **"continue"** to start.
