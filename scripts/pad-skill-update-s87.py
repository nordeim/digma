#!/usr/bin/env python3
"""Session 87 — the PAD v1.66.0 header + revision block, the digma_SKILL
v1.65.0 bump + lesson F74, and the AGENTS session-87 seam bullet."""

PAD = "/home/z/my-project/digma/Project_Architecture_Document.md"
SKILL = "/home/z/my-project/digma/digma_SKILL.md"
AGENTS = "/home/z/my-project/digma/AGENTS.md"

# ---------------------------------------------------------------------------
# 1. The PAD header: v1.65.0 -> v1.66.0 (the title + the Last Updated line)
# ---------------------------------------------------------------------------
with open(PAD, encoding="utf-8") as f:
    pad = f.read()

pad = pad.replace(
    "# Digma — Master Project Architecture Document (PAD) v1.65.0",
    "# Digma — Master Project Architecture Document (PAD) v1.66.0",
)

S87_SUMMARY = (
    "v1.66.0 — the skip-branch-transport/canvas-gesture-clamp/draft-resync/docs-honesty pass: "
    "S87-A the skip-branch transport registration (the headline, A87-M1 — the machine-carries "
    "skip branch recorded NO leave transport: when the user exits while the autosave machine's "
    "PUT₁ is in flight with NO newer edit — the exit-inside-the-save-window interleaving — the "
    "cleanup correctly skipped its duplicate PUT₂ but also left leaveTransportFor null, so a "
    "same-project re-entry mount drained the null registry, awaited nothing, and fired its GET, "
    "which could answer BEFORE PUT₁ lands — loadProject then replaced the store's still-correct "
    "element list with the pre-edit server state and stamped it saved, the machine's "
    "disposed-gated response never healing it — the pre-exit edit silently reverted and the next "
    "local edit's full-list PUT permanently deleted it server-side; the S85-A GET/PUT race "
    "surviving in the one branch the registry never covered; the fix: the skip branch registers "
    "the machine's own surviving flight as the transport — leaveTransportFor = { projectId, "
    "done: softLeaveDescriptor.flightDone } — the registry's one-shot drain now covering the "
    "fourth and last interleaving; pinned by the editor-lows-s87 source pins, the session85-fixes "
    "re-entry discriminators re-running green as the survival proof), "
    "S87-B the canvas gesture clamp family (A87-L1: the draw commit, the resize write-back, and "
    "moveElements' accumulated position were the last unclamped consumers of the server's "
    "±100000 / 0..100000 bounds — an element dragged past ±100000 canvas units (reachable in "
    "~5-10 max-zoom-out drags) rendered locally then visibly teleported to the clamped bound on "
    "the store-replacing save; all three paths now ride clampPositionField/clampSizeField, the "
    "S84-B family's canvas members closed; live-witnessed by the capture's clone-45 — the "
    "Headline staged at x=95000, zoomed to 0.1 + panned into view, dragged +790 viewport px "
    "(canvas dx=7900), reads back EXACTLY 100000), "
    "S87-C the number-field draft resync (A87-L2: a parseable-but-clamped draft never resynced "
    "when the clamp mapped it back to the field's current value — 500000 typed into an X field "
    "already at 100000 displayed 500000 indefinitely while model/canvas/server held 100000, the "
    "S78-C a-control-that-lies class; the blur now resyncs whenever Number(draft) !== value, on "
    "BOTH NumberField and GuardedNumberInput — the S79-E HexColorRow blur-restore's numeric "
    "sibling; live-witnessed by the capture's clone-44 — staged AT the bound, 150000 typed, "
    "mid-edit 150000, after-blur EXACTLY 100000), "
    "S87-D the docs-honesty batch (B87-L1: the S86-C seven-calls repair had missed its own "
    "inline twin — reset-password.spec.ts:137's the same six-call budget — while the header said "
    "seven; the twin re-anchored AND the doc-lows-s86 negative pin widened to /six.call/i so the "
    "hyphenated form can never survive a repair again; B87-L2: session67-fixes.spec.ts:148 "
    "claimed the other specs' three sends in the shared ai:unknown bucket while the call-level "
    "enumeration finds NINE — the sessions-78/79/80 deliveries had silently outgrown the count; "
    "re-anchored with the enumeration in the comment AND pinned LIVE-DERIVED by the new "
    "doc-lows-s87 — the pin greps the specs' send interactions and asserts the comment's number "
    "equals the enumeration, the reader-count form extended to the AI budget), "
    "S87-E the logs + the counts 1076 -> 1098 unit / 145 -> 147 files across every live claim "
    "site (the two new spec files: editor-lows-s87 16 + doc-lows-s87 6) — see the v1.66.0 "
    "revision block; the prior summary — the leave-transport-ordering pass — see the v1.65.0 "
    "revision block) "
)

import re

# The Last Updated line: the v1.65.0 summary's leading "(v1.65.0 — " gains the
# v1.66.0 summary ahead of it (the established nesting form).
m = re.search(r"\*\*Last Updated:\*\* 2026-10-06 \(v1\.65\.0 — ", pad)
assert m, "the Last Updated anchor not found"
pad = pad.replace(
    "**Last Updated:** 2026-10-06 (v1.65.0 — ",
    "**Last Updated:** 2026-10-06 (" + S87_SUMMARY + "(v1.65.0 — ",
    1,
)

# ---------------------------------------------------------------------------
# 2. The revision block — v1.66.0, inserted before the v1.64.0 block
# ---------------------------------------------------------------------------
REV = """#### Revision Block — v1.66.0 (Tracked Changes)

1. **S87-A (A87-M1, the headline): the skip-branch transport registration.** The machine-carries skip branch (editor-view.tsx:507-550) — the exit-inside-the-save-window interleaving where the autosave machine's PUT₁ carries exactly the live state — correctly skipped its duplicate PUT₂ but ALSO left `leaveTransportFor` null: only the reference-mismatch branch registered. A same-project re-entry mount (editor → Back → re-open) drained the null registry, awaited nothing, and fired its GET — which could answer BEFORE PUT₁ lands (a large board's full-list replace takes seconds). `loadProject` then replaced the store's still-correct element list with the pre-edit server state and stamped it "saved"; the machine's response is disposed-gated (`if (disposed) return`) so the healing `markSaved` never landed. The user-visible symptom: the pre-exit edit silently reverted, and the next local edit's full-list PUT PERMANENTLY DELETED it server-side. THE FIX: the skip branch registers the machine's own surviving flight as the transport — `leaveTransportFor = { projectId: state.projectId, done: softLeaveDescriptor.flightDone }` — the registry's `done` already accepts a bare promise, and the one-shot drain now covers the fourth and last interleaving (the S85-A GET/PUT race closed in the one branch it had never covered; the S86-A ordering untouched — the mismatch branch's chain rides through unchanged). Pinned by the editor-lows-s87 source pins (deterministically RED pre-fix); the session85-fixes re-entry discriminators re-run green as the survival proof — the same no-deterministic-e2e-discriminator class the S86-A ordering window carried.
2. **S87-B (A87-L1): the canvas gesture clamp family.** The draw commit (canvas.tsx), the resize write-back (canvas.tsx), and `moveElements`' accumulated position (editor-store.ts) were the LAST unclamped consumers of the server's `clampNumber(raw?.x, -100000, 100000)` / `clampNumber(raw?.width, 0, 100000)` bounds — an element dragged (or drawn after panning) past ±100000 canvas units rendered locally, then visibly TELEPORTED to the clamped bound ~1s later on the store-replacing save. All three paths now ride `clampPositionField`/`clampSizeField` (the S84-B helpers mirroring the server's `buildElementRow` bounds at the consumer — the type-aware floor survives inside the helper). The capture's clone-45 is the live witness: the Headline staged at x=95000 through the panel, zoomed to 0.1 through the canvas's own ctrl+wheel seam (synthetic WheelEvents on the native non-passive listener — no pointer-capture semantics), panned into view through the plain-wheel seam, then dragged +790 viewport px with agent-browser's REAL mouse pipeline (CDP input carries a live pointerId — the canvas's setPointerCapture arm would throw on a synthetic dispatchEvent pointer; canvas dx = 790/0.1 = 7900 — the unbounded product 102900), and the X field reads back EXACTLY 100000.
3. **S87-C (A87-L2): the number-field draft resync.** `NumberField` and `GuardedNumberInput` (properties-panel.tsx) restored the draft on blur ONLY for empty/unparseable edits — a parseable draft whose consumer clamp mapped it back to the field's CURRENT value (500000 typed into an X field already at 100000 — `clampPositionField(500000)` returns 100000, the model never moves, no render fires) displayed 500000 indefinitely while model/canvas/server held 100000: the S78-C "a control that lies about its state" class, at every field already at its bound (Rotation ±180, Opacity 100, W/H bounds). THE FIX: the blur resyncs the draft from the committed model value whenever `Number(draft) !== value` — the S79-E HexColorRow blur-restore's numeric sibling, on BOTH components. The capture's clone-44 is the live witness — staged AT the bound (X=100000), 150000 typed (mid-edit the field reads 150000 — the lying state), blur, and the field reads EXACTLY 100000.
4. **S87-D (B87-L1 + B87-L2): the docs-honesty batch.** (a) `reset-password.spec.ts:137`'s inline twin — "the same six-call budget" — survived the S86-C header repair (the repair fixed :15's "seven auth calls" and left the hyphenated twin; `doc-lows-s86.test.ts`'s negative pin `not.toMatch(/six auth calls/)` was blind to "six-call"); the twin re-anchored to the seven-call form and the negative pin WIDENED to `/six.call/i` so both twins are covered forever. (b) `session67-fixes.spec.ts:148` claimed "the other specs' three sends" in the shared `ai:unknown` bucket — the call-level enumeration finds NINE (editor-panels ×4 — the askAssistant helper at :1047/:1080/:1106 + the direct send at :1133; workspace ×1 at :126; session78 ×1 at :38; session79 ×2 at :48/:114; session80 ×1 at :152; 11 headroom under the 20/5min ceiling): the sessions-78/79/80 deliveries had silently outgrown the comment. Re-anchored with the enumeration IN the comment, and pinned LIVE-DERIVED by the new `tests/doc-lows-s87.test.ts` (the pin enumerates the send interactions across the spec sources — the helper invocations plus the direct forms, each helper definition's body-fill subtracted back out — and asserts the comment's number equals the enumeration: the F72 reader-count form extended to the AI budget, the count can never again rot).
5. **S87-E: the logs + the counts.** `docs/session_133.md` (2×87 − 41 = 133), the repo worklog entry, the parent workspace worklog entry, the digma_SKILL v1.65.0 bump with lesson F74, this revision block, and every count site updated to the delivered reality — 1076 -> 1098 unit / 145 -> 147 files (the two new spec files: editor-lows-s87 16 pins + doc-lows-s87 6 pins = 22; FOUR standing-pin sets legitimately re-anchored with the intents documented: doc-lows-s84's UNIT/FILES constants onto 1098/147, server-lows-s81's UNIT constant onto 1098, doc-lows-s86's §11 line-count rows onto the four grown files — editor-view 1969→1989, editor-store 494→506, canvas 776→787, properties-panel 1562→1581 — the row-sum doctrine's forcing function; client-lows-s70's resize/draw pins onto the clampSizeField-wrapped forms — the S87-B re-anchoring, the F68/F70 discipline).

"""

anchor = "#### Revision Block — v1.64.0 (Tracked Changes)"
assert anchor in pad
pad = pad.replace(anchor, REV + anchor, 1)

with open(PAD, "w", encoding="utf-8") as f:
    f.write(pad)
print("PAD v1.66.0 done")

# ---------------------------------------------------------------------------
# 3. digma_SKILL v1.65.0 + lesson F74
# ---------------------------------------------------------------------------
with open(SKILL, encoding="utf-8") as f:
    skill = f.read()

skill = skill.replace("version: 1.64.0", "version: 1.65.0")

F74 = (
    "74. **F74 — the session-87 family: the skip-branch's null transport, the gesture-path clamp "
    "enumeration, the clamped-back draft's silent display, the repair's own twin, and the "
    "cross-check state contamination. (1) THE SKIP-BRANCH'S NULL TRANSPORT: a boundary registry "
    "that records the transport in ONE branch of a conditional leaves every OTHER branch "
    "unregistered — the S85-A registry covered the reference-mismatch exit (the newer-state "
    "PUT₂) and the S86-A pass ordered its legs, but the pure-duplicate skip (the machine's own "
    "PUT₁ IS the transport) recorded NOTHING, so the re-entry GET raced the very flight the skip "
    "branch had just identified as live. The audit question for every boundary registry: does "
    "EVERY branch of the boundary's conditional either register its transport or consciously "
    "decline (with the decline justified)? The fix is one line when the branch already holds the "
    "awaitable — the machine's own flightDone. (2) THE GESTURE-PATH CLAMP ENUMERATION: the "
    "F73 multiplier-vs-product lesson's enumeration discipline extends to INTERACTION paths — "
    "the panel fields (S84-B), the AI patches (S86-B), and the multiplicative scale (S86-B) were "
    "all bounded while the DRAW COMMIT, the RESIZE WRITE-BACK, and the DRAG ACCUMULATION (the "
    "raw `el.x + dx` form) wrote unbounded values against the same server clamps — because the "
    "clamp family's audit enumerated the TYPING paths and never the POINTER paths. For each "
    "server-side clamp, enumerate every client WRITE path: typed, patched, computed — AND "
    "gestured. (3) THE CLAMPED-BACK DRAFT'S SILENT DISPLAY: a control whose consumer clamps its "
    "input has TWO resync paths (the render-time compare when the model changes, the blur "
    "restore when the input is empty/unparseable) — and BOTH miss the case where the clamp maps "
    "the input back to the model's CURRENT value (no model change, no empty draft): the field "
    "displays a value that never existed anywhere. The complete contract: on blur, resync "
    "whenever the PARSED draft differs from the COMMITTED value — the S78-C a-control-that-lies "
    "doctrine's closure at the numeric family. (4) THE REPAIR'S OWN TWIN: a docs repair that "
    "corrects the HEADER site of a claim while an INLINE twin of the same claim survives — and "
    "the pin guarding the repair patterns the SPACED form while the twin wears the HYPHENATED "
    "form (six auth calls vs six-call) — the negative pin must cover the WHOLE claim family "
    "(the widened /six.call/i form), and the honest repair greps the file for EVERY form before "
    "declaring victory. (5) THE CROSS-CHECK STATE CONTAMINATION: a capture script (or any "
    "multi-check harness) whose checks share page state races full-list PUTs across hard "
    "navigations — the fresh GET can answer before the prior page's PUT lands, and the stale-read "
    "store's own PUT then REPLACES the server list (deleting the intermediate elements) — the "
    "same family the app's soft-nav boundary closes with the transport registry, manifesting in "
    "the HARNESS itself; the hardening: witnesses must locate their targets by NAME (the "
    "aria-label), never by incidental geometry (a width window the contaminated state can "
    "leave), and each check that mutates shared state should clean up after itself or tolerate "
    "the leftovers (the witness deletes the AI-added elements before staging).**\n"
)

# The lesson appends after F73 (the last numbered lesson).
import re as _re
lessons = list(_re.finditer(r"^73\. \*\*F73", skill, _re.M))
assert lessons, "the F73 anchor not found"
# find the end of the F73 block (the next blank-line-delimited block start or EOF)
f73_start = lessons[0].start()
# The F73 entry is one long line ending with **
f73_end = skill.index("\n", f73_start)
insert_at = f73_end + 1
skill = skill[:insert_at] + "\n" + F74 + skill[insert_at:]

with open(SKILL, "w", encoding="utf-8") as f:
    f.write(skill)
print("digma_SKILL v1.65.0 + F74 done")

# ---------------------------------------------------------------------------
# 4. The AGENTS session-87 seam bullet (appended after the session-86 bullet)
# ---------------------------------------------------------------------------
with open(AGENTS, encoding="utf-8") as f:
    agents = f.read()

BULLET = (
    "- **The skip-branch-transport/canvas-gesture-clamp/draft-resync/docs-honesty seams (session 87, "
    "S87-A..S87-E — the thirty-fifth Mode C audit's chosen work):** (a) THE SKIP-BRANCH TRANSPORT "
    "REGISTRATION (the headline, A87-M1) — the machine-carries skip branch left leaveTransportFor "
    "null (only the reference-mismatch branch registered), so a same-project re-entry mount's GET "
    "could answer before the machine's own surviving PUT₁ lands — loadProject replaced the "
    "still-correct store with the pre-edit server state, the disposed-gated response never healed "
    "it, and the next local edit's full-list PUT permanently deleted the edit server-side; the skip "
    "branch now registers the machine's flightDone as the transport (the registry's one-shot drain "
    "covers the fourth and last interleaving); (b) THE CANVAS GESTURE CLAMP FAMILY (A87-L1) — the "
    "draw commit, the resize write-back, and moveElements' accumulated position ride "
    "clampPositionField/clampSizeField (the last unclamped consumers of the server's ±100000 / "
    "0..100000 bounds — an out-of-range drag previously rendered locally then visibly teleported "
    "on the store-replacing save); (c) THE NUMBER-FIELD DRAFT RESYNC (A87-L2) — both numeric input "
    "components resync the draft on blur whenever Number(draft) !== value (a clamped-back draft "
    "previously displayed its unclamped value indefinitely — the S78-C a-control-that-lies class); "
    "(d) THE DOCS-HONESTY BATCH (B87-L1/L2) — the reset-password spec's inline seven-call twin "
    "re-anchored (the S86-C repair's own miss) with the doc-lows-s86 negative pin widened to "
    "/six.call/i, and the session-67 shared-ai-bucket comment re-anchored to the enumerated NINE "
    "sends + pinned LIVE-DERIVED by the new doc-lows-s87 (the reader-count form extended to the "
    "AI budget); (e) the logs + the counts 1076 -> 1098 unit / 145 -> 147 files across every live "
    "claim site (147 files).\n"
)

anchor86 = agents.rstrip().endswith("across every live claim site.")
# Append after the session-86 bullet: find its tail and insert the new bullet after it.
tail86 = "(d) the logs + the counts 1047 -> 1076 unit / 143 -> 145 files across every live claim site."
if tail86 in agents:
    agents = agents.replace(tail86, tail86 + "\n" + BULLET.rstrip("\n"), 1)
    with open(AGENTS, "w", encoding="utf-8") as f:
        f.write(agents)
    print("AGENTS session-87 seam bullet done")
else:
    print("AGENTS anchor NOT found — the bullet needs manual insertion")
