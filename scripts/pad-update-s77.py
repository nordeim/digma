#!/usr/bin/env python3
"""Session 77 — PAD v1.56.0 update (the established pattern).

Updates:
1. Header version + summary
2. New v1.56.0 revision block (inserted above the v1.55.0 block)
3. §7.1 test table: the two new s77 spec rows + the e2e row + totals
4. §10 known-gaps rows (the P2024/P2028 closure + the canvas aria-label
   posture + the read-side stored-board twin)
5. §11 line-count refresh for the touched files
6. The command-table counts (840 / 125 files)

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
    r"# Digma — Master Project Architecture Document \(PAD\) v1\.55\.0",
    "# Digma — Master Project Architecture Document (PAD) v1.56.0",
    "header title",
)
sub_once(
    r"\*\*Last Updated:\*\* 2026-10-05 \(v1\.55\.0 — the reset-atomicity/intro-hydration/snapshot-cap/live-region-cleanup/toast-floor/honesty/rate-amortization pass:.*?\)",
    "**Last Updated:** 2026-10-05 (v1.56.0 — the primitive-close-floor/modifier-click/transcript-log-role/avatar-initial/loading-re-arm/server-pair/honesty pass: S77-A the vendored Sheet/Dialog primitives own the 44px close-target floor (the ten call-site [&>button]:h-11 overrides become inert — the S76-E toaster form generalized to the drift-hazard family's root), S77-B the Recent list title anchor preserves the browser's native Cmd/Ctrl/Shift/Alt+click behavior (the pre-fix unconditional preventDefault swallowed new-tab clicks on a file list), S77-C the AI chat transcript carries role=log (the implicit polite arrival region — the S76-D per-tick cleanup's complementary gap), S77-D the editor header avatar reaches the user-initial family's guarded form (trim + upper + fallback, the fourth site), S77-E the editor's different-project load branch re-arms the loading gate before its fetch (the soft-swap stale-project flash), S77-F the AI route's targetIds/lockedTargetIds gain the per-string length clamp (the last unbounded system-prompt interpolation) + the stale s67 ordering pin re-anchored onto the readBoundedJson marker, S77-G the honesty batch (the reorderElements Set form — the S74-B family's last member; the promised shared-buckets rate-limit pin delivered; the P2024/P2028 transaction-abort families answer the structured 503 UNAVAILABLE envelope on both the elements PUT and the duplicate route — the S73-C residual closed); the 53rd reference audit: no drift; the mobile nav 9/9 the 54th consecutive session — see the v1.56.0 revision block; the prior summary — the reset-atomicity pass — see the v1.55.0 revision block)",
    "header last-updated",
)

# ---- 2. The v1.56.0 revision block ----------------------------------------
BLOCK = """#### Revision Block — v1.56.0 (Tracked Changes)

- `[SR]` **The primitive-close-floor/modifier-click/transcript-log-role/avatar-initial/loading-re-arm/server-pair/honesty pass (session 77, S77-A..S77-G — the twenty-fifth Mode C audit's chosen work):**
  1. **S77-A (A77-L4 — the headline): the primitive 44px close-target floor.** The vendored `SheetContent`/`DialogContent` primitives' built-in close buttons stayed ~20px while the floor lived in TEN duplicated call-site `[&>button]:h-11` overrides — the S76-E toaster fix's drift-hazard twin (the F35e class applied to a11y: the next consumer forgetting the override silently ships a sub-floor mobile close target). The primitives now own the floor (`h-11 w-11 flex items-center justify-center`; the rendered geometry unchanged at every existing consumer — all ten already applied it); the overrides become inert belt-and-suspenders. Pinned by `tests/client-lows-s77.test.ts` + live-measured 44x44 in the capture.
  2. **S77-B (A77-L1): the modifier-click preservation on the Recent title anchor.** The `onClick` unconditionally `preventDefault()`ed — Cmd/Ctrl+click (new tab) and Shift+click (new window) were swallowed into a same-tab SPA navigation on a FILE LIST (every other navigation surface is a Button or a Next Link — modifier-aware). The handler bails before `preventDefault()` when any modifier is held; the SPA navigation + the silent lastOpened PATCH run on the plain path. Pinned + the e2e discriminator (the Ctrl+Click opens a real new tab — probed via the context's pages() because the popup event never fires for opener-less new tabs).
  3. **S77-C (A77-L2): the AI transcript's role=log.** The chat transcript container had no live region — assistant replies were never announced to screen readers (the S76-D per-tick cleanup's complementary gap: ARRIVAL announcements are the legitimate use, and messages append atomically). `role="log"` on the messages container (the implicit polite region; no per-message live attribute — the exactly-one-live-region contract holds).
  4. **S77-D (A77-L3): the editor avatar guarded initial.** The header's first chip rendered the bare `user.name.charAt(0)` — the one site without the family's guarded form (`trim().charAt(0).toUpperCase() || "D"`); a whitespace-leading name rendered a blank chip. The family's fourth site now guards.
  5. **S77-E (A77-L5, reachability-caveated): the project-swap loading re-arm.** The different-project load branch never set `loading` — a soft `/Editor?projectId=A` → `B` swap kept project A painting for the whole GET window (data integrity unaffected — the S57-B swap guards drop late responses). `setLoading(true)` at the branch head (after the same-project skip's early return; the Untitled fallback turns it off).
  6. **S77-F (B77-L1 + B77-L2): the server pair.** The AI route's `targetIds`/`lockedTargetIds` filters gained the per-string clamp (`i.length <= 64` — real ids are cuid-length; the count-only cap left the system prompt pad-able with ~32 MB of id-shaped prose beside the bounded siblings); the stale s67 ordering pin re-anchored onto the `readBoundedJson(` marker (the old `request.json()` marker matched only the doc comment — a false-passable pin).
  7. **S77-G: the honesty batch.** The `reorderElements` membership moved to the Set form (the S74-B family's last member); the s76 plan's promised shared-buckets rate-limit pin DELIVERED (the auth + ai families' budgets proven independent on the module-level shared Map); the P2024 (pool-wait) and P2028 (transaction-timeout) abort families now answer the structured 503 UNAVAILABLE envelope on the elements PUT (a new catch arm) and the duplicate route (which had NO catch at all — the transaction body moved into a helper so the catch wraps it without changing the transactional shape; the s73 timeout pin legitimately re-anchored).
  8. **The 53rd reference audit: no drift** (all standing datums byte-identical — the Share L385-R458/Present L466-R551 clipping the 14th consecutive session); the clone's mobile nav 9/9 the **54th** consecutive session (re-verified on the final S77 build). Unit **840 = 820 + 20 across 125 files** (11 defect pins deterministically RED pre-fix; one standing pin legitimately re-anchored — the s73 duplicate-transaction form); e2e **249** (+3 — the modifier-click pair + the dialog close-floor measurement; the full suite re-ran green); smoke unchanged at 58. **Docs aligned:** this revision block + the §7.1 table + the §10 rows + the §11 line counts + the command-table counts.

"""
sub_once(
    r"#### Revision Block — v1\.55\.0 \(Tracked Changes\)",
    BLOCK + "#### Revision Block — v1.55.0 (Tracked Changes)",
    "v1.56.0 revision block",
)

# ---- 3. §7.1 table rows + totals -------------------------------------------
sub_once(
    r"\| Unit — the honest ceiling comment \+ the fast-path stream cancel \+ the GET note \+ the rate amortization \(S76-F/G\) \| `tests/server-lows-s76\.test\.ts` \| 7 \| tests \| Vitest \|",
    "| Unit — the honest ceiling comment + the fast-path stream cancel + the GET note + the rate amortization (S76-F/G) | `tests/server-lows-s76.test.ts` | 7 | tests | Vitest |\n"
    "| Unit — the primitive close floor + the modifier bail + the transcript log role + the avatar initial + the loading re-arm (S77-A..E) | `tests/client-lows-s77.test.ts` | 12 | tests | Vitest |\n"
    "| Unit — the per-string id clamp + the P2024/P2028 arms + the Set form + the shared-buckets delivery (S77-F/G) | `tests/server-lows-s77.test.ts` | 8 | tests | Vitest |",
    "s77 unit rows",
)
sub_once(
    r"\| \*\*Unit total\*\* \| \*\*123 files\*\* \| \*\*820\*\* \| \| Vitest \|",
    "| **Unit total** | **125 files** | **840** | | Vitest |",
    "unit total",
)
sub_once(
    r"\| E2E — the toast dismiss 44px floor discriminator \(S76-E\) \| `tests/e2e/session76-fixes\.spec\.ts` \| 1 \| tests/e2e \| Playwright \|",
    "| E2E — the toast dismiss 44px floor discriminator (S76-E) | `tests/e2e/session76-fixes.spec.ts` | 1 | tests/e2e | Playwright |\n"
    "| E2E — the modifier-click new-tab discriminator + the plain-click preservation + the dialog close floor (S77-A/B) | `tests/e2e/session77-fixes.spec.ts` | 3 | tests/e2e | Playwright |",
    "s77 e2e row",
)
sub_once(
    r"\| \*\*E2E total\*\* \| \*\*33 files\*\* \| \*\*246\*\* \| \| Playwright \|",
    "| **E2E total** | **34 files** | **249** | | Playwright |",
    "e2e total",
)

# ---- 4. §10 rows ------------------------------------------------------------
sub_once(
    r"\| LOW \| The informational asymmetries \(session 76's posture batch\): the CanvasThumbnail's unconditional overflow clip.*?\| Open \(documented postures\) \|",
    "| LOW | The informational asymmetries (session 76's posture batch): the CanvasThumbnail's unconditional overflow clip (a line's round stroke caps can lose sub-half-pixels at its box edge in the 320x200 thumbnail), the present overlay's frame-label omission (content-only reading, undocumented as deliberate), the AI batch's per-op undo granularity (a reply's 8 adds = 8 Ctrl+Z steps beside the one-shot per-message Revert), and the teams GET's missing take sibling (bounded by construction anyway) | No reference datum exists for any of the four; each is a coherent-reading posture, not a defect | Open (documented postures) |\n"
    "| LOW | The P2024/P2028 transaction-abort families (session 77's closure) | The elements PUT's replace transaction and the duplicate route's copy transaction could abort with Prisma's pool-wait (P2024) or transaction-timeout (P2028) families — both escaped as unstructured 500s outside the envelope (the S73-C 30s raise mitigated likelihood, not the shape). CLOSED in S77-G: both routes answer the structured 503 UNAVAILABLE envelope (the duplicate's transaction body moved into a helper so the catch wraps it; the transactional shape unchanged — the s73 pin legitimately re-anchored) | Fixed (v1.56.0, S77-G) |\n"
    "| LOW | The canvas element's aria-label on role-less divs (session 77's posture) | The canvas carries `aria-label={element.name}` on plain divs with no role — not exposed to the accessibility tree. The layers panel rows are the elements' a11y surface (labels + actions); assigning per-element roles would add tree noise on a tool surface. Documented posture | Open (documented posture) |\n"
    "| LOW | The read-side twin of the >32 MB stored-board edge (session 77's posture) | The documented known edge covers the PUT's payload-too-large 400; the same constructible board (2000 x ~722 KB fillImage rows via scripted POSTs) is serialized verbatim by the project-detail GET and the duplicate source read — the response-side memory scales with the stored board. Constructing it requires 2000 authenticated POSTs; the write-side cap is the enforced bound | Open (documented posture — the known-edge family's read side) |",
    "s77 known-rows",
)

# ---- 5. §11 line counts -----------------------------------------------------
sub_once(
    r"\| `src/components/editor/editor-store\.tsx?` \| 438 \|",
    "| `src/components/editor/editor-store.ts` | 444 |",
    "editor-store count",
)
sub_once(
    r"\| `src/components/editor/editor-view\.tsx` \| 1649 \|",
    "| `src/components/editor/editor-view.tsx` | 1668 |",
    "editor-view count",
)
sub_once(
    r"\| `src/components/editor/ai-assistant\.tsx` \| 418 \|",
    "| `src/components/editor/ai-assistant.tsx` | 428 |",
    "ai-assistant count",
)
sub_once(
    r"\| `src/app/api/projects/\[id\]/elements/route\.ts` \| 244 \|",
    "| `src/app/api/projects/[id]/elements/route.ts` | 261 |",
    "elements route count",
)

# ---- 6. Command-table counts -------------------------------------------------
sub_once(
    r"\| `bun run test` / `bun run test:watch` \| repo root \| unit tests \(820 checks / 123 files\) \|",
    "| `bun run test` / `bun run test:watch` | repo root | unit tests (840 checks / 125 files) |",
    "command table unit count",
)

PAD.write_text(text)
print(f"\nPAD v1.56.0 update complete — {replacements} replacements")
