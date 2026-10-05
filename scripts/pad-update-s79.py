#!/usr/bin/env python3
"""Session 79 — PAD v1.58.0 update (the established pattern).

Updates:
1. Header version + summary
2. New v1.58.0 revision block (inserted above the v1.57.0 block)
3. §7.1 test table: the two new s79 spec rows + the e2e row + totals
4. §10 known-gaps rows (the new posture rows: scrypt cost, the rename
   silent discard, the CSP decision)
5. §11 line-count refresh for the touched files
6. The command-table counts (899 / 129 files)

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
    r"# Digma — Master Project Architecture Document \(PAD\) v1\.57\.0",
    "# Digma — Master Project Architecture Document (PAD) v1.58.0",
    "header title",
)
sub_once(
    r"\*\*Last Updated:\*\* 2026-10-05 \(v1\.57\.0 — .*?\*Audience:\*\*",
    "**Last Updated:** 2026-10-05 (v1.58.0 — the board-epoch/swap-flush/pin-precision/frame-deny/honesty pass: S79-A the boardEpoch lineage discriminator closes the S78-A scope guards' \"\" boundary (loadProject and attachProject produce the IDENTICAL projectId transition — a live Untitled editor soft-swapping to a named project passed all three guards at the boundary: the adoption-shaped exemption skipped the transcript reset, the falsy \"\"-scoped carrier passed the revert belt, the Untitled send passed the mid-flight guard — the Untitled board's elements could restore into the loaded project and the autosave machine would PUT them into it; the epoch increments ONLY on loadProject, so the exemption is load-aware, every carrier stamps scopeEpoch, and the mid-flight refusal extends to the epoch mismatch), S79-B the swap-boundary flush (the 800ms debounce window's silent loss — every flush transport was wired to a different boundary and the pending timer early-returned on the loaded \"saved\"; the load effect now flushes the outgoing NAMED project through the machine BEFORE setLoading, guarded by a first-run ref so the mount's unmount-cleanup transport stays the owner — no double-PUT), S79-C the server/config hygiene batch (the s78 transaction-family pin tightened to SITE precision, the get-seed-ids redaction fold, the tsconfig noImplicitAny contradiction removed), S79-D the anti-clickjacking header block (X-Frame-Options: DENY + nosniff + Referrer-Policy — the framing vector closed), S79-E the client honesty pair (the hex row's abandoned-draft blur-restore + the hidden-selection chrome gating on visibility); the 55th reference audit: no drift; the mobile nav 9/9 the 56th consecutive session — see the v1.58.0 revision block; the prior summary — the project-scope pass — see the v1.57.0 revision block)**Audience:**",
    "header last-updated",
)

# ---- 2. The v1.58.0 revision block ----------------------------------------
BLOCK = """#### Revision Block — v1.58.0 (Tracked Changes)

- `[SR]` **The board-epoch/swap-flush/pin-precision/frame-deny/honesty pass (session 79, S79-A..S79-E — the twenty-seventh Mode C audit's chosen work):**
  1. **S79-A (A79-M1 — the headline): the boardEpoch lineage discriminator closes the S78-A scope guards' `""` boundary.** `loadProject` and `attachProject` produce the IDENTICAL store transition (`"" -> id`), so all three S78-A guards keyed on the projectId shape passed at the boundary: a live Untitled editor soft-swapping to a named project (the S77-E path — `/Editor` bare to `/Editor?projectId=B`) kept its transcript (the adoption-shaped exemption skipped the reset for a genuine LOAD), a surviving Revert restored the UNTITLED board's elements into B's store (flipping unsaved and triggering the autosave PUT into B — the persisted cross-project clobber S78-A was built to stop), and a mid-await send computed against the Untitled canvas applied its batch into B. The store gains `boardEpoch: number` (init 0) that `loadProject` increments (the set-callback form) and `attachProject` deliberately does NOT (the adoption is the same canvas lineage — the documented exemption): (1) the subscription's exemption is load-aware (`adoption && state.boardEpoch === prevState.boardEpoch` — an epoch move is a lineage break, not an adoption); (2) every applied message carries `scopeEpoch` stamped at send time and `revertMessage` bails when the epoch moved (the `""`-scoped carrier's discriminator — the scopeId belt stays as belt-and-suspenders); (3) the mid-flight refusal extends to `sendEpoch !== preApply.boardEpoch` (an Untitled send whose board was swapped mid-await answers the honest refusal; the adoption mid-await still applies). Pinned by `tests/client-lows-s79.test.ts` (the store pins incl. the behavioral load/adopt pair) + the e2e Untitled-boundary soft-swap discriminator + live-verified in the capture.
  2. **S79-B (A79-M2): the swap-boundary flush of the outgoing project's pending edits.** Every flush transport was wired to a different boundary — `exit()`'s flushNow (the only call site), the unmount cleanup's captured-state PUT (the autosave effect is keyed `[]`, so a same-route swap never runs it), `pagehide` — and the 800ms timer's flush early-returns once `loadProject(B)` stamps `saveState: "saved"`: an edit inside the debounce window before the swap was silently lost (unrecoverable — loadProject also clears past/future). The load effect now calls `flushNow()` BEFORE `setLoading(true)` on a same-instance re-run where the store holds a NAMED project the incoming load is about to replace: the machine captures the outgoing state synchronously (the S71-B ordering), `ensureProject()` returns the named id with no network call (the verified fast path), and the machine's own swap guard (`capturedProjectId && now.projectId !== capturedProjectId -> return`) drops the stale response after the load — the exact S57-B/S71-B design the exit() path exercises. A first-run ref distinguishes the mount (the previous instance's unmount-cleanup transport owns that boundary — no double-PUT); Untitled outgoing state deliberately skips (the documented ADR-009/S61-I/S62-C leave-scope contract). Pinned by the flush call-site pins + the e2e persistence discriminator (order-independent: before-count + 3).
  3. **S79-C (B79-L1/I2/I3): the server/config hygiene batch.** The S78-B transaction-abort family pin tightened to SITE precision (the elements route carries TWO `$transaction` sites — the old `>= 1` per-file form could not see single-site drift; the new form asserts arms >= `$transaction` count per file, the s75 parse-surface pin's file+handler discipline); `get-seed-ids.ts` routes its URL print through `redactDatabaseUrl` (the third sibling of the redaction family); `tsconfig.json` drops `"noImplicitAny": false` (verified live — typecheck stays green — `strict: true` now means strict, and the typecheck gate's compensating-control claim becomes fully true).
  4. **S79-D (B79-L2): the anti-clickjacking header block.** The whole config carried no `headers()` key; `sameSite: "lax"` does not protect a same-origin page embedded in an attacker's iframe (the framed app sends the session cookie on every in-frame request — a clickjacked logged-in victim can be driven into destructive UI). `next.config.ts` gains the block: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` on `/:path*`. A full CSP deliberately NOT chosen (the inline-style-heavy Tailwind surface would force `style-src 'unsafe-inline'`, weakening the policy to theater — the documented posture stays single-tenant self-hosted; this is the public-deploy belt).
  5. **S79-E (A79-L1 + A79-I2): the client honesty pair.** The Canvas Background hex row deliberately swallows a null clear (a canvas cannot be transparent) but the hex input had no blur-restore — a cleared field sat showing an empty input while the canvas kept painting the old color (the control lied about its state); `HexColorRow`'s hex input gains the abandoned-draft blur-restore (`onBlur -> setDraft(value ?? "")` — the GuardedNumberInput doctrine, sibling rows unchanged in effect: their null commits change the value and the resync fires). The canvas selection chrome now gates on visibility: the single-selection outline + handles require `selected[0].visible` and the multi-selection dashed box requires `selected.some((el) => el.visible)` (the element render filters `el.visible` — the repo's own S23 coherence contract; pre-fix an eye-hidden selected element kept a floating outline with 8 live draggable handles over blank canvas).
  6. **The 55th reference audit: no drift** (all standing datums byte-identical — the Share L385-R458/Present L466-R551 clipping the 16th consecutive session; the kbd/dead-chrome re-probes through the JSON-wrapped eval form); the clone's mobile nav 9/9 the **56th** consecutive session (re-verified on the final S79 build). Unit **899 = 876 + 23 across 129 files** (21 defect pins deterministically RED pre-fix; the site-precision family pin GREEN-immediately by design — the pin is the drift mechanism, not a defect fix; one standing comment-literal reword en route — the F58 lineage); e2e **256** (+3 — the Untitled-boundary soft-swap reset discriminator, the swap-boundary flush persistence discriminator, the hidden-selection chrome check; the flush discriminator is ORDER-INDEPENDENT — the full-suite run carries earlier specs' mutations of project A, the before-count + 3 form absorbs them); smoke unchanged at 58. **Docs aligned:** this revision block + the §7.1 table + the §10 rows + the §11 line counts + the command-table counts.

"""
sub_once(
    r"#### Revision Block — v1\.57\.0 \(Tracked Changes\)",
    BLOCK + "#### Revision Block — v1.57.0 (Tracked Changes)",
    "v1.58.0 revision block",
)

# ---- 3. §7.1 table rows + totals -------------------------------------------
sub_once(
    r"\| Unit — the tx-envelope family pin \+ the teams take \+ the sanitizer clamp \+ the server honesty set \(S78-B/E/G\) \| `tests/server-lows-s78\.test\.ts` \| 13 \| tests \| Vitest \|",
    "| Unit — the tx-envelope family pin + the teams take + the sanitizer clamp + the server honesty set (S78-B/E/G) | `tests/server-lows-s78.test.ts` | 13 | tests | Vitest |\n"
    "| Unit — the boardEpoch lineage discriminator + the load-aware transcript exemption + the scopeEpoch belt + the mid-flight epoch extension + the swap-boundary flush call site + the hex blur-restore + the hidden-selection gates (S79-A/B/E) | `tests/client-lows-s79.test.ts` | 15 | tests | Vitest |\n"
    "| Unit — the site-precise transaction family pin + the get-seed-ids redaction + the tsconfig strictness fold + the anti-clickjacking header block (S79-C/D) | `tests/server-lows-s79.test.ts` | 8 | tests | Vitest |",
    "s79 unit spec rows",
)
sub_once(
    r"\| \*\*Unit total\*\* \| \*\*127 files\*\* \| \*\*876\*\* \| \| Vitest \|",
    "| **Unit total** | **129 files** | **899** | | Vitest |",
    "unit total",
)
sub_once(
    r"\| E2E — the soft-swap transcript-reset discriminator \+ the header-floor measurements \(S78-A/F\) \| `tests/e2e/session78-fixes\.spec\.ts` \| 4 \| tests/e2e \| Playwright \|",
    "| E2E — the soft-swap transcript-reset discriminator + the header-floor measurements (S78-A/F) | `tests/e2e/session78-fixes.spec.ts` | 4 | tests/e2e | Playwright |\n"
    "| E2E — the Untitled-boundary soft-swap reset + the swap-boundary flush persistence (order-independent) + the hidden-selection chrome (S79-A/B/E) | `tests/e2e/session79-fixes.spec.ts` | 3 | tests/e2e | Playwright |",
    "s79 e2e spec row",
)
sub_once(
    r"\| \*\*E2E total\*\* \| \*\*35 files\*\* \| \*\*253\*\* \| \| Playwright \|",
    "| **E2E total** | **36 files** | **256** | | Playwright |",
    "e2e total",
)
sub_once(
    r"\| `bun run test` / `bun run test:watch` \| repo root \| unit tests \(876 checks / 127 files\) \|",
    "| `bun run test` / `bun run test:watch` | repo root | unit tests (899 checks / 129 files) |",
    "command table unit",
)

# ---- 4. §10 posture rows ----------------------------------------------------
sub_once(
    r"\| LOW \| The layers-row shift-click ADD-ONLY vs the canvas's toggle \(session 78's posture\) \|",
    "| LOW | The scrypt cost parameters (session 79's posture) | `src/lib/password.ts` uses the Node library defaults (N=16384, r=8, p=1); OWASP's current guidance recommends N=2^17 for new deployments. A cost raise needs a migration story (no rehash-on-login mechanism exists — every stored hash would need rotation); the per-IP limiter bounds unauthenticated hammering, so the honest action is the documented posture, not a silent change | Open (posture, v1.58.0) |\n"
    "| LOW | The layers rename's silent empty-draft discard (session 79's posture) | The layer rename's blur discards an emptied draft silently while the project-rename sibling answers with an explicit toast — the abandoned-empty-draft doctrine (the S21-2 family) is the documented convention for inline CLIENT-side renames, and the project-rename sibling validates through the server (the 400 -> the toast). The divergence is surface-appropriate, not a defect | Open (posture, v1.58.0) |\n"
    "| INFO | The full-CSP decision (session 79's posture) | A Content-Security-Policy is deliberately NOT shipped: the inline-style-heavy Tailwind surface would force `style-src 'unsafe-inline'`, weakening the policy to theater. The frame-deny + nosniff + referrer-policy trio (S79-D) is the honest minimal; the documented posture stays single-tenant self-hosted | Open (posture, v1.58.0) |\n"
    "| LOW | The layers-row shift-click ADD-ONLY vs the canvas's toggle (session 78's posture) |",
    "s79 posture rows",
)

# ---- 5. §11 line counts ------------------------------------------------------
sub_once(
    r"\| `src/components/editor/editor-store\.ts` \| 459 \|",
    "| `src/components/editor/editor-store.ts` | 479 |",
    "store lines",
)
sub_once(
    r"\| `src/components/editor/editor-view\.tsx` \| 1685 \|",
    "| `src/components/editor/editor-view.tsx` | 1727 |",
    "view lines",
)
sub_once(
    r"\| `src/components/editor/canvas\.tsx` \| 763 \|",
    "| `src/components/editor/canvas.tsx` | 776 |",
    "canvas lines",
)
sub_once(
    r"\| `src/components/editor/properties-panel\.tsx` \| 1515 \|",
    "| `src/components/editor/properties-panel.tsx` | 1528 |",
    "properties lines",
)
sub_once(
    r"\| `src/components/editor/ai-assistant\.tsx` \| 505 \|",
    "| `src/components/editor/ai-assistant.tsx` | 550 |",
    "assistant lines",
)

PAD.write_text(text)
print(f"PAD v1.58.0 written ({replacements} replacements)")
