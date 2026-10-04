#!/usr/bin/env python3
"""Session 75 — PAD v1.54.0 update (the established pattern).

Updates:
1. Header version + summary
2. New v1.54.0 revision block (inserted above the v1.53.0 block)
3. §7.1 test table: the five new s75 spec rows + the unit/e2e totals
4. §10 known-gaps rows (the session's posture decisions)
5. §11 line-count refresh + the new files
6. The stale command-table counts (unit 117 -> the current reality; smoke 35 -> 58)

Every anchor asserted before replacing (the F57(4) silent-no-op lesson).
"""
import re
from pathlib import Path

PAD = Path("/home/z/my-project/digma/Project_Architecture_Document.md")
text = PAD.read_text()
orig = text
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
    r"# Digma — Master Project Architecture Document \(PAD\) v1\.53\.0",
    "# Digma — Master Project Architecture Document (PAD) v1.54.0",
    "header title",
)
sub_once(
    r"\*\*Last Updated:\*\* 2026-10-04 \(v1\.53\.0 — the family-completion/date-guard-sibling/refusal-sibling/neutral-pin/verify-otp-totality pass:[^)]*\)",
    "**Last Updated:** 2026-10-04 (v1.54.0 — the palette-pins-family-completion/chunked-parse-bound/DTO-parity/dead-script/panel-mount-gating/summary-sanitizer/honesty pass: S75-A the eleven consumed-but-unpinned chromatic scales join the @theme pins + the mechanical enumeration pin, S75-B the readBoundedJson seam bounds the chunked-transfer family the content-length guard could never see, S75-C the ThumbnailElementDTO type/wire parity, S75-D the dead check-db-state.ts deletion, S75-E the useMediaQuery mount gating unmounts the invisible panel trees below md/lg, S75-F the elementSummary server-side sanitizer, S75-G the honesty batch + the deferred-queue decisions — the at-rest token hashing CLOSED as not-applicable; see the v1.54.0 revision block; the prior summary — the family-completion pass: S74-A the elementToStyle fourth-surface justifyContent line, S74-B the panel Set siblings, S74-C the date-guard siblings, S74-D the db.ts mechanism comment, S74-E the check-db-contract refusal sibling, S74-F the honesty batch, S74-G the neutral-900 pin, S74-H the verify-otp terminal return, and the rotated-resize question CLOSED by the reference probe — see the v1.53.0 revision block)",
    "header last-updated",
)

# ---- 2. The v1.54.0 revision block ----------------------------------------
BLOCK = """#### Revision Block — v1.54.0 (Tracked Changes)

- `[SR]` **The palette-pins-family-completion/chunked-parse-bound/DTO-parity/dead-script/panel-mount-gating/summary-sanitizer/honesty pass (session 75, S75-A..S75-H — the twenty-third Mode C audit's chosen work):**
  1. **S75-A (A75-F1 — the headline): the palette-pins family completion.** The S74-G fix pinned exactly ONE member of the consumed-but-unpinned family (neutral-900) and declared it "the one consumed-but-unpinned scale" — the lead's mechanical enumeration found ELEVEN more consumed-but-unpinned CHROMATIC members (red-50/200/300/400, green-50/200, blue-100/200/800, orange-300/400), all taking the v4 oklch default TODAY (unlike the achromatic neutral-900, which round-trips): the reference-measured alert chrome (the login/reset cards' pale reds/greens, the RA-48 list-thumbnail gradient's blue-100, the Revert orange, the layer-trash red) shipped visibly off-palette. The F61 incomplete-family lesson recurring INSIDE the family-completion fix itself. All eleven join the pins block with their v3 hexes — AND the enumeration itself becomes a MECHANISM (`tests/palette-pins-s75.test.ts` extracts every utility-consumed scale member from src/ and asserts the consumed-vs-pinned difference is EMPTY). Pinned (14).
  2. **S75-B (B75-F1): the chunked-parse bound.** `bodySizeRejected` inspected only the content-length header — a Transfer-Encoding: chunked request carries none, so the guard passed and `request.json()` buffered the whole body before any per-field cap ran (six of the fourteen sites unauthenticated — the OOM rationale the family itself documented). The new `readBoundedJson(request)` seam carries two layers: the content-length fast path + a stream-read byte counter (reject + cancel past the 32 MB cap), keeping the null-on-unparseable contract. All fourteen parse sites migrate onto the seam; the s67/s68 per-site pins re-anchor onto the seam-consumption form (the guard lives inside the seam now). Pinned by `tests/request-surface-s75.test.ts` (20).
  3. **S75-C (B75-F2): the ThumbnailElementDTO type/wire parity.** The type's Omit list retained `projectId` while `THUMBNAIL_ELEMENT_SELECT` never ships the column — a type/wire divergence inside the S70-C seam itself (a future consumer trusting the type reads undefined). `"projectId"` joins the Omit; the Omit set and the SELECT's omission set are now the same set.
  4. **S75-D (B75-F3): the dead `scripts/check-db-state.ts` deleted.** Zero references repo-wide, a bare PrismaClient with no db-path resolution and no refusal guard — the refusal family's unlisted third sibling (the exact false-signal family the smoke and check-db-contract refusals killed). `check-db-contract.ts` is the living sibling.
  5. **S75-E (the deferred queue's #1): the hidden-panel mount gating.** Below md/lg the LayersPanel/ComponentsPanel/PropertiesPanel wrappers were CSS-hidden but the trees were FULLY MOUNTED and subscribed to `elements` — every drag tick re-rendered two invisible trees. The new `useMediaQuery(query)` hook (`src/hooks/use-media-query.ts`, useSyncExternalStore with a desktop-first getServerSnapshot — the SSR output is byte-identical and a below-md hydration unmounts the CSS-invisible panels without a mismatch) gates the three mounts; the toggle chips are themselves hidden below md/lg, so zero UI changes. The e2e discriminator: at 390×844 zero `[data-layer-row]` elements in the DOM (pre-fix: six, CSS-hidden); at desktop the rows return exactly. Pinned by `tests/client-lows-s75.test.ts` (7) + `tests/e2e/session75-fixes.spec.ts` (2).
  6. **S75-F (the deferred queue's middle option): the elementSummary server-side sanitizer.** The client-supplied summary was interpolated raw into the LLM's system role (route-capped at 3000 chars but newline/control-rich) — a scripted client could forge the prompt's line structure. The pure `sanitizeElementSummary` flattens to one line, strips control characters, and caps at 500; full server-side re-derivation was judged not worth a protocol change (no projectId rides the request; the injection is self-scoped). Pinned by `tests/server-lows-s75.test.ts` (9).
  7. **S75-G: the honesty batch + the deferred-queue decisions.** The verify-otp S74-H comment's family-uniformity claim corrected (the same handler's count===1 re-select answers its own vanished-user race with the no-enumeration 400); the dead `memberColorFor` import removed from project-card.tsx; the `sortProjects` comparators gain the corrupt-date guard (the date-guard family's sort sibling — NaN comparators placed rows implementation-definedly); the two duck-typed envelope catches (elements POST + register) unify onto the instanceof dialect. The QUEUE decisions: the at-rest token hashing CLOSED as not-applicable (no session store exists — the token is an HMAC-verifiable stateless cookie; hashing would require a session table, contradicting ADR-003); the rate-limit eviction amortization kept queued with its design recorded; the duplicate/elements-GET/elements-POST zero-consumer routes documented-and-kept; the fillImageThumb for already-stored images kept as the design-work deferral.
  8. **The 51st reference audit: no drift** (all standing datums byte-identical); the clone's mobile nav 9/9 the **52nd** consecutive session (re-verified on the final S75 build). Unit **796 = 746 + 50 across 120 files** (zero standing pins broken — the s67/s68 re-anchors are the documented contract evolutions); e2e **245** (the full suite re-ran green in chunks + the two new S75-E discriminators); smoke unchanged at 58. **Docs aligned:** this revision block + the §7.1 table + the §10 rows + the §11 line counts + the stale command-table counts.

"""
sub_once(
    r"#### Revision Block — v1\.53\.0 \(Tracked Changes\)",
    BLOCK + "#### Revision Block — v1.53.0 (Tracked Changes)",
    "v1.54.0 revision block",
)

# ---- 3. §7.1 rows + totals -------------------------------------------------
ROWS = """| Unit — the palette-pins family completion + the consumed-vs-pinned enumeration (S75-A) | `tests/palette-pins-s75.test.ts` | 14 | tests | Vitest |
| Unit — the readBoundedJson behavioral contract + the 14-site seam migration (S75-B) | `tests/request-surface-s75.test.ts` | 20 | tests | Vitest |
| Unit — the useMediaQuery hook + the gated mounts + the sort guard + the dead-import absence (S75-E/G) | `tests/client-lows-s75.test.ts` | 7 | tests | Vitest |
| Unit — the DTO parity + the summary sanitizer + the honesty batch + the dead-script absence (S75-C/F/G) | `tests/server-lows-s75.test.ts` | 9 | tests | Vitest |
| **Unit total** | **120 files** | **796** | | Vitest |"""
sub_once(
    r"\| \*\*Unit total\*\* \| \*\*116 files\*\* \| \*\*746\*\* \| \| Vitest \|",
    ROWS,
    "unit total row",
)
sub_once(
    r"\| \*\*E2E total\*\* \| \*\*31 files\*\* \| \*\*243\*\* \| \| Playwright \|",
    """| E2E — the hidden-panel mount gating discriminators (S75-E) | `tests/e2e/session75-fixes.spec.ts` | 2 | tests/e2e | Playwright |
| **E2E total** | **32 files** | **245** | | Playwright |""",
    "e2e total row",
)

# ---- 4. §10 rows -----------------------------------------------------------
NEW_ROWS = """| LOW | The clamp-floor draft desync in the number-input guard family (session 75, A75-F3) | Typing past a clamp floor leaves the raw draft displayed while the model holds the clamped value (the resync fires only on prevValue !== value); self-heals on the next external change; the store AND the server clamp — no data corruption | Open (accepted posture — cosmetic, e2e-only pinnable) |
| LOW | The Set-membership family's two event-scoped residues (session 75, A75-F4) | The keyboard Delete's locked filter and the pointerdown membership check keep the includes() form — both fire ONCE per event (not per render tick), so a Set would ADD allocation; the family boundary is deliberate: render-path sites use Sets, event-path sites keep includes() | Open (documented rationale — the F61 sibling-count discipline with the performance judgment recorded) |
| LOW | The informational asymmetries (session 75's posture batch): marquee×locked (the marquee excludes locked while Select-All includes them), shift-click canvas-vs-layers semantics (toggle vs add-only), the pointer-only layer reorder (HTML5 DnD, no keyboard path) | No reference parity datum exists for any of the three (its own reorder is dead) | Open (documented postures — coherent supersets) |
| LOW | The at-rest token hashing queue item is NOT APPLICABLE (session 75's closure) | There is no session store: the token exists only as an HMAC-verifiable stateless cookie; nothing token-shaped is persisted server-side to hash. Hashing would require introducing a session table — a different architecture with a DB write per request, contradicting ADR-003's stateless trade-off | Closed (session 75 — the architecture note; not a work item) |
| LOW | The rate-limit bucket eviction amortization (standing queue, session 75's decision) | checkRate's full-Map sweep runs per call across both families' shared buckets; rotated-key growth costs O(n²) total CPU. The amortized form (per-key expiry check + threshold-triggered sweep) changes the pure core's contract and re-anchors its unit pins; the windows (15/5 min) bound n modestly in the sanctioned single-proxy posture | Open (kept queued with the design recorded — touch it only when the limiter is otherwise on the worklist) |
| LOW | The zero-consumer API surface: duplicate / elements GET / elements POST (session 75's decision) | Verified zero first-party consumers (elements POST is exercised by smoke's invalid-type probe); the S73-B guard + the TOCTOU ceilings keep them safe | Open (document-and-keep — deleting the duplicate route is a product decision with no reference datum) |
"""
sub_once(
    r"\| LOW \| No hosted CI \|",
    NEW_ROWS + "| LOW | No hosted CI |",
    "known-gaps rows",
)

# ---- 5. The stale command-table counts ------------------------------------
sub_once(
    r"\| `bun run test` / `bun run test:watch` \| repo root \| unit tests \(117\) \|",
    "| `bun run test` / `bun run test:watch` | repo root | unit tests (796 checks / 120 files) |",
    "unit command row",
)
sub_once(
    r"\| `./scripts/smoke-test\.sh` \| scripts/ \| 35 HTTP checks \(needs build; unset DATABASE_URL in the same command\) \|",
    "| `./scripts/smoke-test.sh` | scripts/ | 58 HTTP checks (needs build; unset DATABASE_URL in the same command) |",
    "smoke command row",
)

assert text != orig
PAD.write_text(text)
print(f"PAD updated: {replacements} replacements")
