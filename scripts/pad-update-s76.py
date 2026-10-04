#!/usr/bin/env python3
"""Session 76 — PAD v1.55.0 update (the established pattern).

Updates:
1. Header version + summary
2. New v1.55.0 revision block (inserted above the v1.54.0 block)
3. §7.1 test table: the three new s76 spec rows + the e2e row + totals
4. §10 known-gaps rows (the session's posture decisions + the amortization closure)
5. §11 line-count refresh for the touched files
6. The command-table counts (820 / 123 files)

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
    r"# Digma — Master Project Architecture Document \(PAD\) v1\.54\.0",
    "# Digma — Master Project Architecture Document (PAD) v1.55.0",
    "header title",
)
sub_once(
    r"\*\*Last Updated:\*\* 2026-10-04 \(v1\.54\.0 — the palette-pins-family-completion/chunked-parse-bound/DTO-parity/dead-script/panel-mount-gating/summary-sanitizer/honesty pass:.*?— see the v1\.53\.0 revision block\)",
    "**Last Updated:** 2026-10-05 (v1.55.0 — the reset-atomicity/intro-hydration/snapshot-cap/live-region-cleanup/toast-floor/honesty/rate-amortization pass: S76-A the reset-password single-use consumption becomes the ATOMIC conditional write its verify-otp sibling received in S70-D (the racing replay resolves through the where-clause), S76-B the AI-assistant intro timestamp carries the S65-D hydration suppression (the server/client clock divergence), S76-C the chat's revert snapshots cap at 10 retained (the unbounded element-shell family), S76-D the four per-tick live regions retire (the zoom chip + three slider readouts — the native range input announces its own value; the DISCRETE save-state badge keeps its), S76-E the toast dismiss control meets the 44px touch floor, S76-F the honesty batch (the 32 MB ceiling comment's honest 1.45 GB arithmetic, the readBoundedJson fast-path stream cancel, the elements-GET consumer note), S76-G the rate-limit eviction amortization IMPLEMENTED from the deferred queue (the min-resetAt watermark + the lazy per-entry reset — per-key observables identical, the sweep becomes memory reclamation); the deferred-queue decisions: the AI-assistant panel below md CLOSED as examined-and-not-applicable (visible reference chrome, zero store subscriptions), the fillImageThumb kept queued with the codec/protocol decision tree recorded; see the v1.55.0 revision block; the prior summary — the palette-pins-family-completion pass — see the v1.54.0 revision block)",
    "header last-updated",
)

# ---- 2. The v1.55.0 revision block ----------------------------------------
BLOCK = """#### Revision Block — v1.55.0 (Tracked Changes)

- `[SR]` **The reset-atomicity/intro-hydration/snapshot-cap/live-region-cleanup/toast-floor/honesty/rate-amortization pass (session 76, S76-A..S76-G — the twenty-fourth Mode C audit's chosen work):**
  1. **S76-A (B76-L1 — the headline): the reset-password single-use atomicity.** The token consumption was check-then-act — `findFirst` read the token, JS checked expiry, then `update({ where: { id } })` wrote the reset with ONLY the row id in the where-clause: a racing replay whose read interleaved before the legitimate commit could land its own write on the same row (the single-use invariant the route's own comment claims was not enforced atomically — the same shape the repo graded S70-D's verify-otp sibling). The fix mirrors the sibling: `updateMany({ where: { id, resetToken, resetTokenExpiresAt: { gt: new Date() } } })` with count 0 answering the same invalid-token 400 (the pre-read + the measured token-before-password ordering preserved). Pinned by `tests/reset-atomic-s76.test.ts` (5) + the live scripted double-spend in the capture script (first reset 200, the SAME token's replay 400).
  2. **S76-B (A76-M1): the AI-assistant intro-timestamp hydration fix.** `nowLabel()` ran in the `useState` initializer — once on the server (the panel is in the SSR output — outside the loading gate) and again at hydration; divergent clocks/timezones (the UTC production server) logged a text-content mismatch on every editor visit (the exact class the repo fixed for the Dashboard greeting in S65-D). The S65-D family form reaches the assistant's timestamp row (the user-side row never SSRs — untouched).
  3. **S76-C (A76-L1): the chat revert-snapshot cap.** Every applied reply stored a full shallow copy of the element list with no cap — the store's own history is 60 deep, but the chat's family accumulated unboundedly for the tab's lifetime. `MAX_RETAINED_REVERT_SNAPSHOTS = 10` + `stripAgedSnapshots` on append (older carriers keep their bubbles, lose the stale copy — the store's undo covers older states); the Revert control couples its render to the snapshot's presence (a control that cannot work must not render). Pinned by `tests/client-lows-s76.test.ts`.
  4. **S76-D (A76-L2): the per-tick live-region cleanup.** The zoom chip (per wheel tick) and three slider readout spans (per drag tick, beside the native range input's own announcements) carried polite live regions — a stream of near-duplicate screen-reader chatter during continuous interactions. The four sites drop the attribute; the DISCRETE save-state badge keeps its (state flips are the legitimate use). Live-verified in the capture (exactly one live region in the editor DOM, the badge).
  5. **S76-E (A76-L3): the toast dismiss 44px floor.** The dismiss control hit ~24px (a 16px glyph with p-1) — the one mobile close target below the repo's own floor. `h-11 w-11` with the glyph at h-4 w-4; live-measured 44x44 + the e2e discriminator (`tests/e2e/session76-fixes.spec.ts`).
  6. **S76-F: the honesty batch.** The 32 MB ceiling comment's "a 2000-element board of image fills sits far under it" overclaim reworded to the elements route's own arithmetic (2000 x ~722KB = ~1.45 GB sits far OVER; the ~30 MB typical board sits under; the scripted-elements-POST known edge noted); the `readBoundedJson` content-length fast path now CANCELS the unconsumed stream (the symmetric twin of the stream-counter path's own cancel — behaviorally pinned); the elements GET docstring gains the S72-D family's honest consumer note (the family's N−1).
  7. **S76-G (the deferred queue's design, IMPLEMENTED): the rate-limit eviction amortization.** `checkRate` swept the whole buckets Map on EVERY call — rotated-key growth cost O(n) per call, O(n²) over a burst. The watermark form: a `WeakMap<RateBuckets, number>` holds each instance's minimum live resetAt; the sweep runs only at/after the watermark, and an expired entry resets LAZILY at its own key's access — the per-key observable behavior is identical to the always-sweep form (pinned: the expired key resets on access), only the memory reclamation of UN-ACCESSED keys is deferred (pinned: the stale key lingers before the watermark, evicts after it). All existing rate-limit pins stayed green — no re-anchor needed.
  8. **The 52nd reference audit: no drift** (all standing datums byte-identical — the Share L385-R458/Present L466-R551 clipping the 13th consecutive session); the clone's mobile nav 9/9 the **53rd** consecutive session (re-verified on the final S76 build). Unit **820 = 796 + 24 across 123 files** (18 defect pins deterministically RED pre-fix; zero standing pins broken); e2e **246** (+1 the toast-floor discriminator; the full suite re-ran green in chunks); smoke unchanged at 58. **Docs aligned:** this revision block + the §7.1 table + the §10 rows + the §11 line counts.

"""
sub_once(
    r"#### Revision Block — v1\.54\.0 \(Tracked Changes\)",
    BLOCK + "#### Revision Block — v1.54.0 (Tracked Changes)",
    "v1.55.0 revision block",
)

# ---- 3. §7.1 table rows + totals -------------------------------------------
sub_once(
    r"\| Unit — the DTO parity \+ the summary sanitizer \+ the honesty batch \+ the dead-script absence \(S75-C/F/G\) \| `tests/server-lows-s75\.test\.ts` \| 9 \| tests \| Vitest \|",
    "| Unit — the DTO parity + the summary sanitizer + the honesty batch + the dead-script absence (S75-C/F/G) | `tests/server-lows-s75.test.ts` | 9 | tests | Vitest |\n"
    "| Unit — the reset-password atomic conditional write + the preserved ordering (S76-A) | `tests/reset-atomic-s76.test.ts` | 5 | tests | Vitest |\n"
    "| Unit — the intro hydration fix + the snapshot cap + the live-region cleanup + the toast floor (S76-B/C/D/E) | `tests/client-lows-s76.test.ts` | 12 | tests | Vitest |\n"
    "| Unit — the honest ceiling comment + the fast-path stream cancel + the GET note + the rate amortization (S76-F/G) | `tests/server-lows-s76.test.ts` | 7 | tests | Vitest |",
    "s76 unit rows",
)
sub_once(
    r"\| \*\*Unit total\*\* \| \*\*120 files\*\* \| \*\*796\*\* \| \| Vitest \|",
    "| **Unit total** | **123 files** | **820** | | Vitest |",
    "unit total",
)
sub_once(
    r"\| E2E — the hidden-panel mount gating discriminators \(S75-E\) \| `tests/e2e/session75-fixes\.spec\.ts` \| 2 \| tests/e2e \| Playwright \|",
    "| E2E — the hidden-panel mount gating discriminators (S75-E) | `tests/e2e/session75-fixes.spec.ts` | 2 | tests/e2e | Playwright |\n"
    "| E2E — the toast dismiss 44px floor discriminator (S76-E) | `tests/e2e/session76-fixes.spec.ts` | 1 | tests/e2e | Playwright |",
    "s76 e2e row",
)
sub_once(
    r"\| \*\*E2E total\*\* \| \*\*32 files\*\* \| \*\*245\*\* \| \| Playwright \|",
    "| **E2E total** | **33 files** | **246** | | Playwright |",
    "e2e total",
)

# ---- 4. §10 rows ------------------------------------------------------------
# 4a. The rate-limit amortization row: queued -> implemented
sub_once(
    r"\| LOW \| The rate-limit bucket eviction amortization \(standing queue, session 75's decision\) \| checkRate's full-Map sweep runs per call across both families' shared buckets; rotated-key growth costs O\(n²\) total CPU\. The amortized form \(per-key expiry check \+ threshold-triggered sweep\) changes the pure core's contract and re-anchors its unit pins; the windows \(15/5 min\) bound n modestly in the sanctioned single-proxy posture \| Open \(kept queued with the design recorded — touch it only when the limiter is otherwise on the worklist\) \|",
    "| LOW | The rate-limit bucket eviction amortization (standing queue since session 75) | checkRate's full-Map sweep ran per call (rotated-key growth O(n²) total). IMPLEMENTED in session 76 (S76-G): the min-resetAt watermark (a WeakMap side-channel) gates the sweep, and the lazy per-entry reset keeps the per-key observable identical to the always-sweep form — only UN-ACCESSED expired keys' reclamation is deferred to the watermark crossing. Pinned (amortization + reclamation + lazy-reset + source form) | Fixed (v1.55.0, S76-G) |",
    "rate-limit row",
)
# 4b. New rows appended after the zero-consumer row
sub_once(
    r"\| LOW \| The zero-consumer API surface: duplicate / elements GET / elements POST \(session 75's decision\) \| Verified zero first-party consumers \(elements POST is exercised by smoke's invalid-type probe\); the S73-B guard \+ the TOCTOU ceilings keep them safe \| Open \(document-and-keep — deleting the duplicate route is a product decision with no reference datum\) \|",
    "| LOW | The zero-consumer API surface: duplicate / elements GET / elements POST (session 75's decision) | Verified zero first-party consumers (elements POST is exercised by smoke's invalid-type probe); the S73-B guard + the TOCTOU ceilings keep them safe; the GET docstring gained the family's honest consumer note in S76-F | Open (document-and-keep — deleting the duplicate route is a product decision with no reference datum) |\n"
    "| LOW | The AI-assistant panel below md (the deferred-queue item session 75 flagged as unexamined) | CLOSED as examined-and-not-applicable (session 76): the panel is VISIBLE mobile chrome (the h-80 reference-measured column, no hidden/breakpoint classes on the wrapper) and subscribes to NOTHING in the store (zero useEditorStore selectors — event-time getState() only), so the S75-E defect class (subscribed invisible trees re-rendering per drag tick) does not apply; the honest residues (the unbounded chat snapshots + the intro hydration mismatch) were the session's S76-C/S76-B work items | Closed (session 76 — the architecture note with the evidence) |\n"
    "| LOW | The fillImageThumb for already-stored images (standing design-work deferral) | THUMBNAIL_ELEMENT_SELECT still ships full fillImage data URLs on the four list-family responses (the ~350 MB worst-case aggregate at the 500-row ceiling). The decision tree recorded (session 76): a server-side re-derivation needs an image codec Node does not ship (sharp = a new NATIVE dependency; pure-JS codecs = maintenance weight) or a client-supplied thumb field (a PROTOCOL change — the same trade the S75-F sanitizer note weighed); the write-seam form (derive at buildElementRow + a one-off backfill) is the design when a forcing function appears | Open (kept queued with the decision tree recorded) |\n"
    "| LOW | The informational asymmetries (session 76's posture batch): the CanvasThumbnail's unconditional overflow clip (a line's round stroke caps can lose sub-half-pixels at its box edge in the 320x200 thumbnail), the present overlay's frame-label omission (content-only reading, undocumented as deliberate), the AI batch's per-op undo granularity (a reply's 8 adds = 8 Ctrl+Z steps beside the one-shot per-message Revert), and the teams GET's missing take sibling (bounded by construction anyway) | No reference datum exists for any of the four; each is a coherent-reading posture, not a defect | Open (documented postures) |",
    "s76 known-rows",
)

# ---- 5. §11 line counts -----------------------------------------------------
sub_once(
    r"\| `src/components/editor/properties-panel\.tsx` \| 1503 \| Reference five-section layout \+ Transform scale \(ADR-011/012\); NumberField empty-draft semantics \(S21\); the Gradient tab's Angle gate \(Linear-only, RA-56\) \+ the stop-remove control \(RA-55\) \+ the Image tab's Background Size select \(RA-61\) \|",
    "| `src/components/editor/properties-panel.tsx` | 1507 | Reference five-section layout + Transform scale (ADR-011/012); NumberField empty-draft semantics (S21); the Gradient tab's Angle gate (Linear-only, RA-56) + the stop-remove control (RA-55) + the Image tab's Background Size select (RA-61); the per-tick readout spans carry no live region (S76-D — the native range input announces its own value) |",
    "properties-panel row",
)
sub_once(
    r"\| `src/components/editor/ai-assistant\.tsx` \| 383 \| Chat UI \(reference chrome: bot avatars, timestamp-below bubbles, blue send, the UNCONDITIONAL \"Try: …\" line\); applies `\{reply, operations\[\]\}` to the store \|",
    "| `src/components/editor/ai-assistant.tsx` | 418 | Chat UI (reference chrome: bot avatars, timestamp-below bubbles, blue send, the UNCONDITIONAL \"Try: …\" line); applies `{reply, operations[]}` to the store; the intro timestamp carries the S65-D hydration suppression (S76-B); the revert snapshots cap at 10 retained with the Revert render coupled to the snapshot's presence (S76-C) |",
    "ai-assistant row",
)
sub_once(
    r"\| `src/app/api/auth/reset-password/route\.ts` \| 91 \| The reset submit \(RA-65\): the reference's exact `\{reset_token, new_password\}` shape; the token validated BEFORE the password; 400 \"Invalid or expired reset token\"; the RA-63 weak-password text; the single-use token clear on success \|",
    "| `src/app/api/auth/reset-password/route.ts` | 103 | The reset submit (RA-65): the reference's exact `{reset_token, new_password}` shape; the token validated BEFORE the password; 400 \"Invalid or expired reset token\"; the RA-63 weak-password text; the single-use token clear on success — through the ATOMIC conditional write (S76-A: the where-clause carries the token + live expiry; count 0 answers the same 400) |",
    "reset-password row",
)
sub_once(
    r"\| `src/app/api/projects/\[id\]/elements/route\.ts` \| 236 \| Full-list transactional replace \(Pattern 3\) \|",
    "| `src/app/api/projects/[id]/elements/route.ts` | 244 | Full-list transactional replace (Pattern 3); the GET docstring carries the honest consumer note (S76-F) |",
    "elements route row",
)
sub_once(
    r"\| `src/lib/rate-limit\.ts` \| 120 \| Fixed-window in-process limiter \|",
    "| `src/lib/rate-limit.ts` | 147 | Fixed-window in-process limiter; the AMORTIZED eviction (S76-G — the min-resetAt watermark gates the sweep, the lazy per-entry reset keeps per-key observables identical) |",
    "rate-limit row",
)
sub_once(
    r"\| `src/lib/validation\.ts` \| 223 \| Caps, enums, hex checks, clamps \+ the `readBoundedJson` seam \(S75-B — the content-length fast path \+ the stream counter bounding the chunked-transfer family\) \|",
    "| `src/lib/validation.ts` | 234 | Caps, enums, hex checks, clamps + the `readBoundedJson` seam (S75-B — the content-length fast path + the stream counter bounding the chunked-transfer family; S76-F — the fast path cancels the unconsumed stream, the ceiling comment carries the honest 1.45 GB arithmetic) |",
    "validation row",
)
sub_once(
    r"\| `src/components/editor/editor-view\.tsx` \| 1649 \|",
    "| `src/components/editor/editor-view.tsx` | 1649 |",
    "editor-view line count (unchanged: one attribute removed)",
)

# ---- 6. Command-table counts -------------------------------------------------
sub_once(
    r"\| `bun run test` / `bun run test:watch` \| repo root \| unit tests \(796 checks / 120 files\) \|",
    "| `bun run test` / `bun run test:watch` | repo root | unit tests (820 checks / 123 files) |",
    "command table unit count",
)

PAD.write_text(text)
print(f"\\nDONE: {replacements} replacements applied")
