#!/usr/bin/env python3
"""Session 81 — PAD v1.60.0 update (the established pattern).

Updates:
1. Header version + summary
2. New v1.60.0 revision block (inserted above the v1.59.0 block)
3. §7.1 test table: the two new s81 spec rows + the totals (133 files / 943 unit / 259 e2e)
4. §10 known-gaps rows (the s81 posture rows)
5. §11 line-count refresh for the touched files
6. The command-table counts (943 / 133 files / 61 smoke / 259 e2e)

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
    r"# Digma — Master Project Architecture Document \(PAD\) v1\.59\.0",
    "# Digma — Master Project Architecture Document (PAD) v1.60.0",
    "header title",
)
sub_once(
    r"\*\*Last Updated:\*\* 2026-10-05 \(v1\.59\.0 — .*?the 56th reference audit: no drift; the mobile nav 9/9 the 57th consecutive session — see the v1\.59\.0 revision block; the prior summary — the board-epoch pass — see the v1\.58\.0 revision block\)\*\*Audience:\*\*",
    "**Last Updated:** 2026-10-05 (v1.60.0 — the foreign-gesture-guard/armed-drain/mount-PUT-guard/smoke-determinism/docs-honesty pass: S81-A the AI apply's coalescing pair guards against a live foreign gesture (the S80-C form was the editor's only UNGUARDED gesture arm site — a reply landing mid-slider-drag CLOBBERED the drag's pre-drag snapshot; the coalesce now arms only when gestureSnapshot === null, and under a foreign gesture both halves fall back to their explicit commit paths — the pre-S80-C two-entry form, the documented programmatic-caller contract — with the drag's snapshot INTACT), S81-B the drain sees the debounce-ARMED state (the busy predicate gained the saveState === \"unsaved\" disjunct — an edit landing during the post-GET pair's PUT flight kept the store \"unsaved\" with the 800ms timer armed while the machine itself read idle, and loadProject wiped the edit before its timer ever fired) plus the post-GET pair's MOUNT guard (an isMountRun capture gates the pair — a mount into a different project no longer re-PUTs the outgoing body the unmount cleanup already transported, the S71-B double-PUT class), S81-C the smoke gate forces DIGMA_DISABLE_AI_LLM=1 (the playwright webServer's own posture, extended — the smoke's exact-output AI assertions were running against the LIVE LLM path), S81-D the S80-A e2e discriminator's precondition assert (the Saving badge pinned before the pushState — the discriminator can no longer silently lose its RED-ness to timing), S81-E the docs honesty batch (eleven stale count sites corrected to the delivery counts across README/AGENTS/CLAUDE/PAD/digma_SKILL + DEPLOYMENT's db:push hazard call-out + the smoke hermeticity note); the 57th reference audit: no drift; the mobile nav 9/9 the 58th consecutive session — see the v1.60.0 revision block; the prior summary — the boundary-drain pass — see the v1.59.0 revision block)**Audience:**",
    "header last-updated",
)

# ---- 2. The v1.60.0 revision block ----------------------------------------
BLOCK = """#### Revision Block — v1.60.0 (Tracked Changes)

- `[SR]` **The foreign-gesture-guard/armed-drain/mount-PUT-guard/smoke-determinism/docs-honesty pass (session 81, S81-A..S81-F — the twenty-ninth Mode C audit's chosen work):**
  1. **S81-A (A81-M1 — the headline): the AI apply's coalescing pair guards against a live foreign gesture.** The S80-C form was the editor's only UNGUARDED gesture arm site: `if (coalesce) store.beginGesture();` ran with no foreign-gesture check while `beginGesture` overwrites `gestureSnapshot` unconditionally — an AI reply landing mid-slider-drag CLOBBERED the drag's pre-drag snapshot (the AI's `endGesture` pushed a MID-DRAG state and nulled the snapshot; the drag's own terminal no-op'd through the ownership guard; every subsequent slider tick committed per-entry — the S62-A flooding class). The two existing arm sites carry the interleave discipline (the canvas flushes the panel burst first; the panel closure's begin carries the S66-B foreign-ride guard). The fix: the coalesce arms ONLY when `useEditorStore.getState().gestureSnapshot === null`; under a live foreign gesture the pair falls back to the explicit `commit=true` paths (the pre-S80-C two-entry form — the documented programmatic-caller contract at the properties panel's update helper) and the drag's snapshot stays INTACT. Pinned by the widened-condition source pin + the BEHAVIORAL foreign-ride store pin (begin a drag → the fallback halves commit true → past grew by TWO with the gesture's snapshot UNTOUCHED → endGesture pushes the pre-drag entry → ONE undo restores the pre-drag position, scale, and fill) + the live mid-drag capture check (clone-34: ONE Ctrl+Z restores the pre-drag slider value).
  2. **S81-B (A81-L1 + A81-L2): the drain's armed-debounce coverage + the post-GET mount guard.** (a) The drain's busy predicate `flushing || pending` missed the debounce-armed state: an edit landing during the post-GET pair's PUT flight kept `saveState "unsaved"` with the 800ms subscriber timer armed while the machine itself went idle (the response's elements-reference guard had re-armed the timer; the `finally` had cleared `flushing`/`pending`) — the drain resolved on the idle machine and `loadProject` wiped the edit before its timer ever fired. The predicate gains the `saveState === "unsaved"` disjunct (bounded by the same 5s deadline — a continuously-editing user cannot block navigation; on timeout the documented no-worse residual covers both windows). (b) The post-GET pair lacked the first-run guard: a MOUNT into a different project re-PUT the outgoing body the unmount cleanup had already transported (the S71-B double-PUT class — a redundant full-replace transaction). The `isMountRun` capture (read BEFORE the first boundary flips `firstRunRef`) gates the pair; the SWAP run keeps the pair (the documented GET-window purpose), the adoption re-run keeps its identity skip. Pinned by the predicate disjunct + the capture pins + the e2e mount discriminator (count the PUTs to A's elements route through the mount navigation: pre-fix 2, post-fix 1 — the route-counting form; the RED verified against the pre-fix BUILD after the rebuild, the stale-build trap the session also hit).
  3. **S81-C (B81-L1): the smoke gate forces the fallback path.** The smoke suite pinned the AI fallback's exact output (three add operations) while the smoke server booted WITHOUT `DIGMA_DISABLE_AI_LLM=1` — the LLM path was live under an exact-output assertion (playwright.config.ts's own documented rationale: the SDK is reachable from the standalone server with free-form, non-deterministic replies). The boot line gains the knob — the e2e posture extended to the smoke gate; the AI checks are deterministic now. The B81-I2 pin-precision tightening: the three S80-D header pins' optional `\\^?` anchors pinned to the literal `^` (a future edit dropping the shipped grep's line-start anchor would otherwise keep the pins green). The B81-I3 hermeticity note: the smoke header documents the re-seed-after-run discipline (the suite registers 3 users + bumps the demo tokenVersion — non-hermetic against the dev DB by design).
  4. **S81-D (A81-L3): the S80-A e2e discriminator's precondition assert.** The in-flight race discriminator's RED-ness depended on the pushState landing while A1's PUT was in flight (~400ms of margin) and never asserted the precondition — a slow fill/poll on a loaded machine could let the machine go idle first and the PRE-FIX build would also persist A2 (a false green). The `Saving…` badge assert (the machine's synchronous `setSaving` prefix) pins the mid-flight precondition — GREEN-immediately by design, the precondition-strengthening family.
  5. **S81-E (B81-L-family + B81-I3 + B81-I4 — the docs honesty batch):** eleven stale count sites corrected to the session-81 delivery counts (README's tech-stack table 724→943 + 245→259 + the three smoke sites + the verification comment; AGENTS's commands table 256→259 + the gate-order 924→943/258→259; CLAUDE's command table + the test-pyramid bullets 796→943/245→259/58→61; PAD's §7.1 smoke row + the §7.4 checklist 117/35/128 → 943/61/259; digma_SKILL's §2 tool table 74/79 → 943/259 + the frontmatter project_state) — the S80-E batch corrected four sites; eleven more were left behind (the same family, the same session's own miss). DEPLOYMENT.md gains the `db:push --accept-data-loss` hazard call-out (§4 — the self-hosted deployer's re-provision flow) + the e2e/smoke count alignment (230→259, 58→61).
  6. **S81-F: the worklog + the session log** (`docs/session_121.md`) + this revision block.
  7. **The 57th reference audit: no drift** (all standing datums byte-identical — the Share L385-R458/Present L466-R551 clipping the 18th consecutive session; the kbd/dead-chrome re-probes through the JSON-wrapped eval form); the clone's mobile nav 9/9 the **58th** consecutive session (re-verified on the final S81 build). Unit **943 = 924 + 19 across 133 files** (17 defect pins deterministically RED pre-fix; two GREEN-by-design pins — the behavioral foreign-ride semantics pin + the anchor cross-check; FIVE standing pins legitimately re-anchored — the s80 258-count pins onto 259, the s69 DEPLOYMENT-count pin onto 61/259, the s81 CLAUDE-smoke regex onto the bold-marker form — all intents unchanged, all documented in the pins themselves); e2e **259** (+1 — the mount double-PUT discriminator, order-independent through the route counter); smoke **61** (unchanged — the knob changes the boot env, not the check count). **Docs aligned:** this revision block + the §7.1 table + the §10 rows + the §11 line counts + the eleven-count honesty batch.
"""
sub_once(
    r"#### Revision Block — v1\.59\.0 \(Tracked Changes\)",
    BLOCK + "\n#### Revision Block — v1.59.0 (Tracked Changes)",
    "revision block insert",
)

# ---- 3. §7.1 test table ---------------------------------------------------
sub_once(
    r"\| Unit — the runtime smoke-header pins \+ the docs-honesty absence pins \(S80-D/E\) \| `tests/server-lows-s80\.test\.ts` \| 12 \| tests \| Vitest \|",
    "| Unit — the runtime smoke-header pins + the docs-honesty absence pins (S80-D/E) | `tests/server-lows-s80.test.ts` | 12 | tests | Vitest |\n| Unit — the foreign-gesture coalesce guard + the behavioral foreign-ride pin + the machineBusy disjunct + the mount-guard pins (S81-A/B) | `tests/client-lows-s81.test.ts` | 7 | tests | Vitest |\n| Unit — the smoke-knob boot pin + the hermeticity note pin + the docs-honesty count pins (S81-C/E) | `tests/server-lows-s81.test.ts` | 12 | tests | Vitest |",
    "7.1 s81 unit rows",
)
sub_once(
    r"\| \*\*Unit total\*\* \| \*\*131 files\*\* \| \*\*924\*\* \| \| Vitest \|",
    "| **Unit total** | **133 files** | **943** | | Vitest |",
    "7.1 unit total",
)
sub_once(
    r"\| E2E — the in-flight boundary race \(the route-delayed PUT — order-independent self-relative values\) \+ the Untitled-to-Untitled transcript reset \(S80-A/B\) \| `tests/e2e/session80-fixes\.spec\.ts` \| 2 \| tests/e2e \| Playwright \|",
    "| E2E — the in-flight boundary race (the route-delayed PUT — order-independent self-relative values) + the Untitled-to-Untitled transcript reset (S80-A/B) | `tests/e2e/session80-fixes.spec.ts` | 2 | tests/e2e | Playwright |\n| E2E — the mount double-PUT guard (the route-counted transports through the mount navigation — pre-fix 2, post-fix 1) (S81-B) | `tests/e2e/session81-fixes.spec.ts` | 1 | tests/e2e | Playwright |",
    "7.1 s81 e2e row",
)
sub_once(
    r"\| \*\*E2E total\*\* \| \*\*37 files\*\* \| \*\*258\*\* \| \| Playwright \|",
    "| **E2E total** | **38 files** | **259** | | Playwright |",
    "7.1 e2e total",
)

# ---- 4. §10 known-gaps rows ------------------------------------------------
sub_once(
    r"\| MEDIUM \| Next 16 `redirects\(\)` matches sources case-insensitively",
    "| LOW | The AI apply's coalesced block is not try/finally'd (an exception between beginGesture/endGesture would strand the store mid-gesture) | Latent only — both halves are pure zustand sets over already-validated data; the exception path is unreachable today | Documented posture (session 81, S81 deferral #1) |\n| LOW | A no-op coalesced AI operation pushes an inert history entry (endGesture pushes unconditionally when armed) | Pre-existing (two inert entries pre-S80-C; one now); the pre-apply Revert snapshot covers recovery | Documented posture (session 81, S81 deferral #2) |\n| LOW | The drain's 5s-deadline timeout path still loses an edit made inside the final window (the load proceeds into the pre-fix race) | Bounded by the deadline — a continuously-editing user cannot block navigation; strictly narrower than every prior window | Documented posture (session 81, S81-B residual) |\n| MEDIUM | Next 16 `redirects()` matches sources case-insensitively",
    "10 posture rows",
)

# ---- 5. §11 line counts ----------------------------------------------------
sub_once(
    r"\| `src/components/editor/editor-view\.tsx` \| 1809 \|",
    "| `src/components/editor/editor-view.tsx` | 1844 |",
    "11 editor-view count",
)
sub_once(
    r"\| `src/components/editor/ai-assistant\.tsx` \| 550 \|",
    "| `src/components/editor/ai-assistant.tsx` | 586 |",
    "11 ai-assistant count",
)

# ---- 6. Command-table counts -------------------------------------------------
sub_once(
    r"`bun run test` / `bun run test:watch` \| repo root \| unit tests \(924 checks / 131 files\) \|",
    "`bun run test` / `bun run test:watch` | repo root | unit tests (943 checks / 133 files) |",
    "command-table unit count",
)

PAD.write_text(text)
print(f"\nDONE: {replacements} replacements — PAD v1.60.0")
