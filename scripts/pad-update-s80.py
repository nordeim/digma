#!/usr/bin/env python3
"""Session 80 — PAD v1.59.0 update (the established pattern).

Updates:
1. Header version + summary
2. New v1.59.0 revision block (inserted above the v1.58.0 block)
3. §7.1 test table: the two new s80 spec rows + the e2e row + totals
4. §10 known-gaps rows (the s80 posture rows)
5. §11 line-count refresh for the touched files
6. The command-table counts (924 / 131 files / 61 smoke / 258 e2e)

Every anchor asserted before replacing (the F57(4) silent-no-op lesson).
"""
import re
from pathlib import Path

PAD = Path("/home/z/my-project/digma/Project_Architecture_Document.md")
text = PAD.read_text()
replacements = 0


def sub_once(pattern: str, repl: str, label: str, count=1) -> None:
    global text, replacements
    new, n = re.subn(pattern, repl, text, count=count)
    if n != count:
        raise SystemExit(f"ANCHOR MISS ({label}): expected {count}, got {n}")
    text = new
    replacements += n
    print(f"OK: {label}")


# ---- 1. Header ------------------------------------------------------------
sub_once(
    r"# Digma — Master Project Architecture Document \(PAD\) v1\.58\.0",
    "# Digma — Master Project Architecture Document (PAD) v1.59.0",
    "header title",
)
sub_once(
    r"\*\*Last Updated:\*\* 2026-10-05 \(v1\.58\.0 — .*?see the v1\.58\.0 revision block; the prior summary — the project-scope pass — see the v1\.57\.0 revision block\)\*\*Audience:\*\*",
    "**Last Updated:** 2026-10-05 (v1.59.0 — the boundary-drain/epoch-reset/history-coalescing/runtime-header-gate/docs-honesty pass: S80-A the autosave handle's drain closes the S79-B boundary flush's in-flight race (the fire-and-forget boundary captured NOTHING when the 800ms timer's flush was mid-PUT — an edit landing while a flush was in flight was silently lost when the incoming GET resolved first: loadProject stamped \"saved\", the machine's swap guard dropped the outgoing response BEFORE the elements-reference guard could setUnsaved, and the pending re-run early-returned on the loaded \"saved\"; the boundary is now AWAITED — the drain polls the machine's busy closure at 25ms with a 5s deadline — and a SECOND flush+drain pair runs after the GET, before loadProject wipes the store, guarded by the SAME named-outgoing contract so the Untitled board's first-save adoption can never cancel the pending load), S80-B the epoch-aware transcript reset (the Untitled-to-Untitled load — a soft swap to an UNKNOWN projectId, both sides falling to the Untitled fallback — is projectId-shaped like a no-op but the epoch moves; the widened guard requires BOTH an unchanged projectId AND an unchanged epoch), S80-C the AI apply's scale+patch one-entry coalescing (scaleElements gains the optional commit parameter; a combined operation wraps in beginGesture/endGesture — ONE undo entry facing the right direction), S80-D the runtime header gate (three curl -sI checks in the smoke suite verify the S79-D anti-clickjacking trio against the live server — the source-text pins alone could not see a next.config regression), S80-E the docs honesty batch (the noImplicitAny claims removed from the doctrine files after S79-C removed the flag itself, the e2e counts aligned, the resend-otp email-only asymmetry called out in DEPLOYMENT.md, the /api/health envelope exemption documented), S80-F the worklog repair (the session-79 entry appended retroactively — the commit claimed it but it landed in the parent workspace only); the 56th reference audit: no drift; the mobile nav 9/9 the 57th consecutive session — see the v1.59.0 revision block; the prior summary — the board-epoch pass — see the v1.58.0 revision block)**Audience:**",
    "header last-updated",
)

# ---- 2. The v1.59.0 revision block ----------------------------------------
BLOCK = """#### Revision Block — v1.59.0 (Tracked Changes)

- `[SR]` **The boundary-drain/epoch-reset/history-coalescing/runtime-header-gate/docs-honesty pass (session 80, S80-A..S80-F — the twenty-eighth Mode C audit's chosen work):**
  1. **S80-A (A80-M1 — the headline): the autosave handle's DRAIN closes the S79-B boundary flush's in-flight race.** The S79-B swap-boundary flush was fire-and-forget — `flush()` sets `pending = true` and returns when a flush is already in flight, so the boundary call captured NOTHING when the 800ms timer's flush was mid-PUT. The loss chain (all seven links verified in source): edit A1 goes in flight; edit A2 lands mid-flight (the documented edit-during-flight case); the user soft-swaps to B; the boundary `flushNow()` early-returns on `flushing`; B's GET resolves BEFORE the outgoing PUT's response; `loadProject(B)` stamps `saveState: "saved"` and wipes `past`/`future`; the outgoing response is dropped by the machine's swap guard BEFORE the elements-reference guard could `setUnsaved()`; the pending re-run early-returns on the loaded `"saved"` — A2 gone, unrecoverably. The fix: `useAutosave`'s handle gains a `drain` property (the `AutosaveHandle` type — `(() => void) & { drain: () => Promise<void> }`; the composition keeps every existing `flushNow()` invocation byte-identical) — the load effect AWAITS `flushNow.drain()` after the boundary `flushNow()` (the machine's busy closure `flushing || pending` polled at 25ms with a 5-second deadline — a hung PUT cannot block navigation forever; on timeout the load proceeds into exactly the pre-fix race, the documented no-worse residual), and a SECOND flush+drain pair runs after the GET's `response.ok` check, BEFORE `loadProject` — capturing any edit that landed during the GET window (the 800ms timer may not have fired yet; `flushNow` forces it synchronously; the common case pays nothing — an early-return on "saved" plus an immediately-idle drain). The post-GET pair carries the SAME named-outgoing guard as the boundary: the UNTITLED board deliberately skips — its first-save POST's adoption (`attachProject` + `replaceState`) would flip the searchParams mid-load, cancel the pending load, and the adoption re-run's skip would strand the page on the created project (the S79-B leave-scope contract, enforced at the post-GET point too — the en-route discovery: the first post-GET form without the guard deterministically stranded the s79 Untitled-boundary e2e on the created project). The `cancelled` flag is re-checked after each drain. Pinned by `tests/client-lows-s80.test.ts` + the e2e in-flight race discriminator (the `page.route` 700ms PUT delay — the autosave-race spec's own pattern — makes the in-flight window deterministic: pre-fix A reads A1's value, post-fix A2's).
  2. **S80-B (A80-L1): the epoch-aware transcript reset for the Untitled-to-Untitled load.** The subscription's early return fired on `state.projectId === prevState.projectId` alone — an Untitled-to-Untitled LOAD (a soft swap to an UNKNOWN projectId; both sides fall to the Untitled fallback's `loadProject(UNTITLED_PROJECT)`) is projectId-shaped like a no-op (`"" === ""`) but the epoch moves — a lineage break that replaced the canvas while the stale conversation (and its belt-defused dead Revert — the S79-A epoch belt makes the click a silent no-op, the "control that lies about its state" class) survived the load. The widened guard requires BOTH an unchanged projectId AND an unchanged epoch; the genuine Untitled adoption (attachProject: `"" -> id`, epoch unchanged) keeps its exemption. Pinned by the widened-condition pin + the e2e unknown-swap discriminator.
  3. **S80-C (A80-L2): the AI apply's scale+patch coalesces to ONE history entry.** One `update` operation carrying both `scale` and a patch pushed TWO `past` snapshots (`scaleElements` and `updateElements` each commit) — "make it red and 25% bigger" cost two Ctrl+Z presses with a visible intermediate state (the one-entry-per-intent S56-A/S62-A doctrine violated for this one interleaving). `scaleElements` gains the optional `commit` parameter (mirroring `updateElements`' own form — every existing call site unchanged); the apply wraps a combined operation in `beginGesture()`/`endGesture()` with both halves committing `false` — ONE entry (the pre-op snapshot, facing the right direction). Pinned by the signature + coalescing pins + the BEHAVIORAL store pin (driven directly through the store: one gesture, `past` grows by exactly ONE, one undo restores BOTH the size and the fill).
  4. **S80-D (B80-L2): the runtime header gate for the S79-D trio.** The anti-clickjacking headers were pinned as SOURCE TEXT ONLY (five regexes over next.config.ts); no runtime gate verified the real response headers — a future regression (a next.config refactor, a Next major change) would pass all six gates silently. The smoke suite gains three `curl -sI` checks (X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin against the live standalone server) — 58 -> 61 smoke checks.
  5. **S80-E (B80-L1 + B80-L3 + B80-I5 + the lead's findings — the docs honesty batch):** the doctrine files still claimed `noImplicitAny: false` after S79-C removed it from tsconfig.json (AGENTS.md:116, CLAUDE.md:46, PAD's tech-stack row — the remediation plan's own "the claim becomes fully true" promise executed as a text edit this session); the e2e counts stalled at the session-78 numbers in three places (CLAUDE.md:93, README.md:318, digma_SKILL.md's `project_state` frontmatter); DEPLOYMENT.md's public-deploy posture paragraph now names the resend-otp asymmetry explicitly (register delivers only to the registrant; login's unverified branch regenerates only after `verifyPassword`; resend-otp delivers the fresh code to ANY caller knowing the email — the chain reaches only UNVERIFIED accounts; the knobs close it); AGENTS.md documents `/api/health` as the lone non-envelope route (the liveness probe's own shape).
  6. **S80-F (A80-L3): the worklog repair.** The session-79 commit (32c913b) claimed "the worklog entry" but the repo `worklog.md` was never updated (the entry landed in the parent workspace's worklog only — the last entry was session-78). The retroactive session-79 entry appended (honestly labeled) + the session-80 entry at delivery.
  7. **The 56th reference audit: no drift** (all standing datums byte-identical — the Share L385-R458/Present L466-R551 clipping the 17th consecutive session; the kbd/dead-chrome re-probes through the JSON-wrapped eval form); the clone's mobile nav 9/9 the **57th** consecutive session (re-verified on the final S80 build). Unit **924 = 899 + 25 across 131 files** (24 defect pins deterministically RED pre-fix; one preservation pin GREEN-by-design — the S79-A adoption exemption; TWO standing pins legitimately re-anchored — the s78 transcript-reset guard onto the widened epoch-aware form, the s68 updateElements call onto the commit-argument form — both intents unchanged, both documented in the pins themselves; the autosave-identity segment marker re-anchored onto the handle composition, the s71/s80 re-anchor lineage); e2e **258** (+2 — the in-flight boundary race discriminator with the route-delayed PUT, the Untitled-to-Untitled transcript reset; both order-independent self-relative forms); smoke **61** (+3 — the runtime header trio, GREEN-immediately by design — the drift mechanism, not a defect fix). **Docs aligned:** this revision block + the §7.1 table + the §10 rows + the §11 line counts + the command-table counts + the doctrine-file honesty batch.
"""
sub_once(
    r"#### Revision Block — v1\.58\.0 \(Tracked Changes\)",
    BLOCK + "\n#### Revision Block — v1.58.0 (Tracked Changes)",
    "revision block insert",
)

# ---- 3. §7.1 test table ---------------------------------------------------
sub_once(
    r"\| Unit — the site-precise transaction family pin \+ the get-seed-ids redaction \+ the tsconfig strictness fold \+ the anti-clickjacking header block \(S79-C/D\) \| `tests/server-lows-s79\.test\.ts` \| 8 \| tests \| Vitest \|",
    "| Unit — the site-precise transaction family pin + the get-seed-ids redaction + the tsconfig strictness fold + the anti-clickjacking header block (S79-C/D) | `tests/server-lows-s79.test.ts` | 8 | tests | Vitest |\n| Unit — the boundary-drain handle + the awaited boundary + the post-GET pair + the epoch-aware reset + the scale+patch coalescing incl. the behavioral one-entry pin (S80-A/B/C) | `tests/client-lows-s80.test.ts` | 13 | tests | Vitest |\n| Unit — the runtime smoke-header pins + the docs-honesty absence pins (S80-D/E) | `tests/server-lows-s80.test.ts` | 12 | tests | Vitest |",
    "7.1 s80 unit rows",
)
sub_once(
    r"\| \*\*Unit total\*\* \| \*\*129 files\*\* \| \*\*899\*\* \| \| Vitest \|",
    "| **Unit total** | **131 files** | **924** | | Vitest |",
    "7.1 unit total",
)
sub_once(
    r"\| E2E — the Untitled-boundary soft-swap reset \+ the swap-boundary flush persistence \(order-independent\) \+ the hidden-selection chrome \(S79-A/B/E\) \| `tests/e2e/session79-fixes\.spec\.ts` \| 3 \| tests/e2e \| Playwright \|",
    "| E2E — the Untitled-boundary soft-swap reset + the swap-boundary flush persistence (order-independent) + the hidden-selection chrome (S79-A/B/E) | `tests/e2e/session79-fixes.spec.ts` | 3 | tests/e2e | Playwright |\n| E2E — the in-flight boundary race (the route-delayed PUT — order-independent self-relative values) + the Untitled-to-Untitled transcript reset (S80-A/B) | `tests/e2e/session80-fixes.spec.ts` | 2 | tests/e2e | Playwright |",
    "7.1 s80 e2e row",
)
sub_once(
    r"\| \*\*E2E total\*\* \| \*\*36 files\*\* \| \*\*256\*\* \| \| Playwright \|",
    "| **E2E total** | **37 files** | **258** | | Playwright |",
    "7.1 e2e total",
)

# ---- 4. §10 known-gaps rows ------------------------------------------------
sub_once(
    r"\| MEDIUM \| Next 16 `redirects\(\)` matches sources case-insensitively",
    "| LOW | The multi-selection dashed box spans HIDDEN members (the bounds derive from the unfiltered selection; the S79-E gate requires only a visible member) | Cosmetic — the box is pointer-events-none + aria-hidden over blank canvas; the mixed-visibility case is the documented behavior | Documented posture (session 80, S80 deferral #1) |\n| LOW | resend-otp delivers the fresh verification code to ANY caller knowing the email (no ownership proof — register delivers only to the registrant, login's unverified branch only after verifyPassword) | A takeover chain over UNVERIFIED accounts only (the window between register and verify); bounded by the rate limiter; closed by DIGMA_DISABLE_IN_APP_OTP=1 | Documented posture (session 80, S80-E; DEPLOYMENT.md names the asymmetry) |\n| LOW | buildElementRow's visible/locked accept truthy JSON (the string \"false\" coerces to true) | API-consumer-only — the DTO types booleans and the client is the only writer in the documented deployment; the Prisma default matches the undefined branch | Documented posture (session 80, S80 deferral #7) |\n| MEDIUM | Next 16 `redirects()` matches sources case-insensitively",
    "10 posture rows",
)

# ---- 5. §11 line counts ----------------------------------------------------
sub_once(
    r"\| `src/components/editor/editor-view\.tsx` \| 1727 \|",
    "| `src/components/editor/editor-view.tsx` | 1809 |",
    "11 editor-view count",
)
sub_once(
    r"\| `src/components/editor/editor-store\.ts` \| 479 \|",
    "| `src/components/editor/editor-store.ts` | 483 |",
    "11 editor-store count",
)

# ---- 6. Command-table counts -------------------------------------------------
sub_once(
    r"`bun run test` / `bun run test:watch` \| repo root \| unit tests \(899 checks / 129 files\) \|",
    "`bun run test` / `bun run test:watch` | repo root | unit tests (924 checks / 131 files) |",
    "command-table unit count",
)

PAD.write_text(text)
print(f"\\nDONE: {replacements} replacements — PAD v1.59.0")
