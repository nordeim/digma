#!/usr/bin/env python3
"""Session 78 — PAD v1.57.0 update (the established pattern).

Updates:
1. Header version + summary
2. New v1.57.0 revision block (inserted above the v1.56.0 block)
3. §7.1 test table: the two new s78 spec rows + the e2e row + totals
4. §10 known-gaps rows (the P2024/P2028 family completion + the new
   posture rows: the layers-row shift-click add-only, the LLM server
   timeout kept queued, the verify-otp race, the duplicate members,
   the auth P2025 family)
5. §11 line-count refresh for the touched files
6. The command-table counts (876 / 127 files)

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
    r"# Digma — Master Project Architecture Document \(PAD\) v1\.56\.0",
    "# Digma — Master Project Architecture Document (PAD) v1.57.0",
    "header title",
)
sub_once(
    r"\*\*Last Updated:\*\* 2026-10-05 \(v1\.56\.0 — the primitive-close-floor/modifier-click/transcript-log-role/avatar-initial/loading-re-arm/server-pair/honesty pass:.*?\*Audience:\*\*",
    "**Last Updated:** 2026-10-05 (v1.57.0 — the project-scope/tx-envelope-family/no-op-commit/fill-precedence/list-bound/header-floor/honesty pass: S78-A the AI transcript and its revert carriers are project-scoped (the soft /Editor?projectId=A to B swap previously kept project A's conversation alive — a surviving Revert restored A's elements into B's store and the autosave machine PUT A's board into B; three coordinated layers: the send-time scopeId belt, the mid-flight refusal, the subscription reset with the Untitled-adoption exemption), S78-B the transaction-abort envelope family completed (the P2024/P2028 503 arms reach ALL SIX transaction-carrying routes — the projects/teams POSTs gained their first catch, the elements/members POSTs gained the arm beside their P2003), S78-C the no-op commit family (the layers rename blur commits only when the draft differs + the WebKit Escape-discard guard + the reorder identity bail), S78-D the multi-selection Fill row clears the higher-precedence paint siblings (the fillPaintFor precedence parity), S78-E the server pair (the teams GET take: TEAM_LIMIT + the sanitizer ids per-string clamp), S78-F the mobile editor-header 44px floor in the phone band (Back 28x28 pre-fix, Undo/Redo 32x32, Share/Present 32px — max-[480px] scoping keeps the session-55 tablet pins byte-identical), S78-G the honesty batch (the clamp twin fold, the TEST-ONLY doc, the DEPLOYMENT cookie-scheme reword, the redacted contract-script print, the buildElementRow doc, the two-live-regions reword, the onDeleted hoist, the member avatar guard, the dead span); the 54th reference audit: no drift; the mobile nav 9/9 the 55th consecutive session — see the v1.57.0 revision block; the prior summary — the primitive-close-floor pass — see the v1.56.0 revision block)**Audience:**",
    "header last-updated",
)

# ---- 2. The v1.57.0 revision block ----------------------------------------
BLOCK = """#### Revision Block — v1.57.0 (Tracked Changes)

- `[SR]` **The project-scope/tx-envelope-family/no-op-commit/fill-precedence/list-bound/header-floor/honesty pass (session 78, S78-A..S78-G — the twenty-sixth Mode C audit's chosen work):**
  1. **S78-A (A78-M1 — the headline): the project-scope guard on the AI transcript and its revert carriers.** The `messages` state and every `revertSnapshot` carrier were initialized once and NEVER project-scoped (zero projectId references in ai-assistant.tsx) — the S77-E fix established the soft project swap as a real path but the load-boundary family never reached the chat panel: after the swap the transcript kept project A's conversation, a surviving Revert called `restoreSnapshot` with A's elements into B's live store (flipping saveState to unsaved and triggering the autosave PUT of A's board into B — persisted cross-project clobber), and a mid-await send landed A's batch into B. Three coordinated layers: (1) every applied-reply message carries `scopeId` (the store's projectId at send time) and `revertMessage` bails when a NAMED scope no longer matches (a snapshot captured under Untitled follows the canvas through the adoption); (2) `send()` re-reads the scope after the await — a NAMED send-scope that no longer matches answers the honest refusal and never applies; (3) a store subscription resets the transcript to the intro bubble on a NAMED-scope transition EXCEPT the Untitled adoption (the conversation that built the user's own Untitled board survives its project's creation). Pinned by `tests/client-lows-s78.test.ts` + the e2e soft-swap discriminator + live-verified in the capture.
  2. **S78-B (B78-M1): the transaction-abort envelope family completion.** The S77-G P2024/P2028 503 arms reached only 2 of the 6 transaction-carrying routes. The four uncovered sites gained the arm: the projects POST and the teams POST (NO catch at all — the runCreateTx helper form, the S77-G pattern) and the elements POST and the members POST (the arm beside their existing P2003). The abort families are not row-size-dependent (a concurrent small create queues behind a row-heavy 30s-allowed writer and hits Prisma's DEFAULT 5s interactive timeout); every transaction site now answers the structured envelope. Pinned by the family-completeness pin in `tests/server-lows-s78.test.ts` (the arm counted across all six route files).
  3. **S78-C (A78-L1/L2/L5): the no-op commit family.** The layers rename blur committed an UNCHANGED name (no !== guard — a rename-open-then-blur pushed history, wiped redo, and fired a byte-identical PUT; the InlineProjectRename sibling's guard form now mirrored); the rename Escape path marks the draft discarded (WebKit fires blur on focused-node removal — the Chromium-only e2e matrix could never see it); `reorderElements` early-bails when the computed id sequence is identical (a drop onto the neighbor's lower half reproduces the same order — the inert history push + redundant PUT retired).
  4. **S78-D (A78-L3): the multi-selection Fill paint-precedence parity.** The multi Fill row committed `fill` alone while the paint seam's precedence is image > gradient > solid (`fillPaintFor`) — the change never painted for gradient/image-filled members. The row now mirrors the single-selection Solid tab's clearing form (fillGradient/fillImage/fillImageFit nulled beside the fill).
  5. **S78-E (B78-L1/L2): the server pair.** The teams GET gained `take: TEAM_LIMIT` (the S73-F list-bound family's missed sibling); `sanitizeLlmOperations`' ids filter gained the S77-F per-string clamp (the S68-C mirror re-run — `i.length <= 64`, the route-side form).
  6. **S78-F (A78-L4): the mobile editor-header 44px floor.** The Back button (28x28 — a phone's primary in-app exit, the smallest touch target in the whole client layer), Undo/Redo (32x32), and the icon-only Share/Present (32px tall) gained `max-[480px]:min-h-11` (+ `min-w-11` on the square forms) — the PHONE-BAND scoping keeps the session-55 tablet geometry pins (the 600px single 48px row / the 77px wrapped header) and the desktop row byte-identical. The five e2e raw-coordinate selection clicks re-anchored +28 (the header grew 73 to 101px at 390 — the geometry shift documented at every site).
  7. **S78-G: the honesty batch.** The `clamp` twin fold (ai-assistant.ts imports `clampNumber` from validation — the S71-D numeric leftover); the `standaloneRepoRoot` TEST-ONLY doc (the S63-G/S68-D family's missed member); DEPLOYMENT.md's cookie-scheme line reworded to the code's real mechanism (NODE_ENV — the X-Forwarded-Proto claim was never read); check-db-contract.ts routes its URL print through `redactDatabaseUrl` (the db.ts seam's sibling); the buildElementRow doc's replace-mode name semantics (an omitted name is SYNTHESIZED, the clamp lives in the seam); the S77-C comment's two-live-regions-by-design reword (the exactly-one claim was false as written — the badge + the transcript are BOTH live regions by design); the Dashboard's duplicated `onDeleted` twins hoisted to one `handleDeleted` seam; the teams member avatar's guarded initial; the MobileNav trigger's dead sr-only span dropped (aria-label owns the accessible name).
  8. **The 54th reference audit: no drift** (all standing datums byte-identical — the Share L385-R458/Present L466-R551 clipping the 15th consecutive session); the clone's mobile nav 9/9 the **55th** consecutive session (re-verified on the final S78 build). Unit **876 = 840 + 36 across 127 files** (34 defect pins deterministically RED pre-fix; three standing pins legitimately re-anchored — the s58 dashboard seam, the s59 multi-fill clearing form, the s68 sanitizer clamp — each a documented contract evolution); e2e **253** (+4 — the soft-swap transcript-reset discriminator + the three header-floor measurements; the full suite re-ran green; the five raw-coordinate sites re-anchored onto the shifted geometry); smoke unchanged at 58. **Docs aligned:** this revision block + the §7.1 table + the §10 rows + the §11 line counts + the command-table counts.

"""
sub_once(
    r"#### Revision Block — v1\.56\.0 \(Tracked Changes\)",
    BLOCK + "#### Revision Block — v1.56.0 (Tracked Changes)",
    "v1.57.0 revision block",
)

# ---- 3. §7.1 table rows + totals -------------------------------------------
sub_once(
    r"\| Unit — the per-string id clamp \+ the P2024/P2028 arms \+ the Set form \+ the shared-buckets delivery \(S77-F/G\) \| `tests/server-lows-s77\.test\.ts` \| 8 \| tests \| Vitest \|",
    "| Unit — the per-string id clamp + the P2024/P2028 arms + the Set form + the shared-buckets delivery (S77-F/G) | `tests/server-lows-s77.test.ts` | 8 | tests | Vitest |\n"
    "| Unit — the transcript scope guard + the no-op commit family + the fill precedence + the header floor + the client honesty set (S78-A/C/D/F/G) | `tests/client-lows-s78.test.ts` | 23 | tests | Vitest |\n"
    "| Unit — the tx-envelope family pin + the teams take + the sanitizer clamp + the server honesty set (S78-B/E/G) | `tests/server-lows-s78.test.ts` | 13 | tests | Vitest |",
    "s78 unit rows",
)
sub_once(
    r"\| \*\*Unit total\*\* \| \*\*125 files\*\* \| \*\*840\*\* \| \| Vitest \|",
    "| **Unit total** | **127 files** | **876** | | Vitest |",
    "unit total",
)
sub_once(
    r"\| E2E — the modifier-click new-tab discriminator \+ the plain-click preservation \+ the dialog close floor \(S77-A/B\) \| `tests/e2e/session77-fixes\.spec\.ts` \| 3 \| tests/e2e \| Playwright \|",
    "| E2E — the modifier-click new-tab discriminator + the plain-click preservation + the dialog close floor (S77-A/B) | `tests/e2e/session77-fixes.spec.ts` | 3 | tests/e2e | Playwright |\n"
    "| E2E — the soft-swap transcript-reset discriminator + the header-floor measurements (S78-A/F) | `tests/e2e/session78-fixes.spec.ts` | 4 | tests/e2e | Playwright |",
    "s78 e2e row",
)
sub_once(
    r"\| \*\*E2E total\*\* \| \*\*34 files\*\* \| \*\*249\*\* \| \| Playwright \|",
    "| **E2E total** | **35 files** | **253** | | Playwright |",
    "e2e total",
)
sub_once(
    r"\| `bun run test` / `bun run test:watch` \| repo root \| unit tests \(840 checks / 125 files\) \|",
    "| `bun run test` / `bun run test:watch` | repo root | unit tests (876 checks / 127 files) |",
    "command table counts",
)

# ---- 4. §10 known-gaps rows -------------------------------------------------
sub_once(
    r"\| LOW \| The P2024/P2028 transaction-abort families \(session 77's closure\) \| The elements PUT's replace transaction and the duplicate route's copy transaction could abort with Prisma's pool-wait \(P2024\) or transaction-timeout \(P2028\) families — both escaped as unstructured 500s outside the envelope \(the S73-C 30s raise mitigated likelihood, not the shape\)\. CLOSED in S77-G: both routes answer the structured 503 UNAVAILABLE envelope \(the duplicate's transaction body moved into a helper so the catch wraps it; the transactional shape unchanged — the s73 pin legitimately re-anchored\) \| Fixed \(v1\.56\.0, S77-G\) \|",
    "| LOW | The P2024/P2028 transaction-abort families (session 77's closure, session 78's family completion) | The S77-G arms reached only the elements PUT and the duplicate (2 of the 6 transaction-carrying routes); the abort families are not row-size-dependent (a concurrent small create queues behind a row-heavy 30s-allowed writer and hits Prisma's DEFAULT 5s interactive timeout). CLOSED in S78-B: ALL SIX sites answer the structured 503 UNAVAILABLE envelope (the projects/teams POSTs gained their first catch — the runCreateTx helper form; the elements/members POSTs gained the arm beside their P2003); the family-completeness pin counts the arm across the six route files so the next route cannot silently drift | Fixed (v1.57.0, S78-B) |",
    "P2024/P2028 family row",
)
sub_once(
    r"\| LOW \| The read-side twin of the >32 MB stored-board edge \(session 77's posture\) \|",
    "| LOW | The layers-row shift-click ADD-ONLY vs the canvas's toggle (session 78's posture) | The layer row's shift-click always ADDS membership while the canvas's shift-click TOGGLES it. The reference exposes no datum for the row's shift-click semantics (its own layers panel is DOM-dead); the row's add-only form pairs with the aria-pressed selection state — a stable, predictable surface (removal flows through Deselect All / Escape / the canvas's own toggle). Documented as intentional | Open (posture, v1.57.0) |\n"
    "| LOW | The LLM completion call's server-side timeout (session 78's queue) | The SDK call has no AbortSignal — a hung call pins the server handler beyond the client's 30s abort (which does not propagate). Bounded by the 20/5-min ai: bucket (request slots, not memory); the SDK's AbortSignal parameter support is unverified — a forcing function (a hung-SDK incident) picks this up | Open (kept queued) |\n"
    "| LOW | The verify-otp double-submit race (session 78's posture) | Two concurrent correct-code submissions race to a spurious wrong-code 400 + increment on an already-verified row. Reachable only by a genuine double-submit; harmless downstream; the fix (a verified: false condition in the increment's where-clause) would make the loser's answer distinguishable — contradicting the no-enumeration uniformity | Open (posture) |\n"
    "| LOW | The members POST permits duplicate (teamId, email) rows (session 78's posture) | No unique constraint on the pair and no pre-check — inviting the same email twice creates two identical rows (MEMBER_LIMIT bounds growth). A @@unique is a schema-push decision; the current behavior documented as known | Open (posture) |\n"
    "| LOW | The auth routes' read-then-update P2025 escape (session 78's posture) | A user row deleted out-of-band between the read and the update throws P2025 as a 500 on the login-unverified/resend/forgot paths. Only out-of-band DB mutation reaches it (the verify-otp route's own documented stance: no user-delete endpoint exists) | Open (posture) |\n"
    "| LOW | The read-side twin of the >32 MB stored-board edge (session 77's posture) |",
    "new posture rows",
)

# ---- 5. §11 line-count refresh ----------------------------------------------
subs = [
    (r"\| `src/components/editor/ai-assistant\.tsx` \| 428 \|", "| `src/components/editor/ai-assistant.tsx` | 505 |", "ai-assistant.tsx lines"),
    (r"\| `src/components/editor/editor-store\.ts` \| 444 \|", "| `src/components/editor/editor-store.ts` | 459 |", "editor-store.ts lines"),
    (r"\| `src/components/editor/editor-view\.tsx` \| 1668 \|", "| `src/components/editor/editor-view.tsx` | 1685 |", "editor-view.tsx lines"),
    (r"\| `src/components/editor/properties-panel\.tsx` \| 1507 \|", "| `src/components/editor/properties-panel.tsx` | 1515 |", "properties-panel.tsx lines"),
    (r"\| `src/components/editor/layers-panel\.tsx` \| 318 \|", "| `src/components/editor/layers-panel.tsx` | 348 |", "layers-panel.tsx lines"),
    (r"\| `src/components/app-header\.tsx` \| 299 \|", "| `src/components/app-header.tsx` | 304 |", "app-header.tsx lines"),
    (r"\| `src/lib/ai-assistant\.ts` \| 370 \|", "| `src/lib/ai-assistant.ts` | 379 |", "lib/ai-assistant.ts lines"),
    (r"\| `src/lib/editor\.ts` \| 909 \|", "| `src/lib/editor.ts` | 915 |", "lib/editor.ts lines"),
    (r"\| `src/app/api/projects/\[id\]/elements/route\.ts` \| 261 \|", "| `src/app/api/projects/[id]/elements/route.ts` | 273 |", "elements route lines"),
]
for pat, rep, label in subs:
    sub_once(pat, rep, label)

PAD.write_text(text)
print(f"\nPAD v1.57.0: {replacements} replacements")
