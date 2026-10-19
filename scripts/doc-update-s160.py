#!/usr/bin/env python3
"""The session-160 docs update: the count-family re-anchor (2227 = 2210 + 17
unit / 222 files across every live claim site), the LAYER-TOTAL re-anchor
(14,095 -> 14,190 — the second movement since S155's comment-only pass:
ai-assistant 835 -> 853, layers-panel 436 -> 474, canvas 1080 -> 1086,
export-png 371 -> 378, editor-store 840 -> 847, login-screen 714 -> 733),
the §7.1 row for the s160 spec, the §11 rows (five files) with the S160
registrations, the AGENTS session-160 bullet (carrying the S160-C
canvas-draw-creation-pointer-only registration member + the S160-B
keyboard-superset delivery), the F140 prior-spec re-anchor riders (the
four setInput pins on lows-s105/s106/s122/s123 onto the guarded
spelling; the two return-state pins on lows-s114 onto the return {}
family form; the s156/s157/s158 layer-total hard pins onto 14,190; the
s158 title pin onto v1.139.0), the prior-spec forward-guard ROLLING
re-anchors (the s154..s159 count-truth guards' version literals onto
v1.139.0), the s151..s159 SKILL-version pins onto v1.138.0, and the
spec-constants re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-146..159 bullets' own count
records, the v1.125.0..v1.138.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s160.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

def patch(path: str, subs: list[tuple[str, str]]) -> None:
    p = ROOT / path
    text = p.read_text()
    applied = 0
    for old, new in subs:
        if new in text and old not in text:
            continue  # already applied (idempotent re-run)
        if old not in text:
            raise SystemExit(f"MISSING in {path}: {old[:100]!r}")
        n = text.count(old)
        if n != 1:
            raise SystemExit(f"AMBIGUOUS ({n} hits) in {path}: {old[:100]!r}")
        text = text.replace(old, new)
        applied += 1
    p.write_text(text)
    print(f"{path}: {applied} live claim sites re-anchored")

# --- AGENTS.md --------------------------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2210 checks) | `bun run test` |",
     "| Unit tests (2227 checks) | `bun run test` |"),
    ("`bun run test` (2210) → `bun run build`",
     "`bun run test` (2227) → `bun run build`"),
    # the live-anchor paren phrase (the s152-cycle convention — the
    # family's rolling marker; the s159 bullet's paren form carries it)
    ("the count-family re-anchor 2210 = 2195 + 15 unit / 221 files (the family's live anchor)",
     "the count-family re-anchor 2227 = 2210 + 17 unit / 222 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2210 checks, Vitest) |",
     "| `bun run test` | Unit tests (2227 checks, Vitest) |"),
    ("(2210 unit / 73 smoke / 262 e2e)",
     "(2227 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2210 checks):",
     "- **Unit Tests** (Vitest, 2227 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2210 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2227 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2210 checks on the pure domain seams",
     "bun run test              # unit tests — 2227 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2210 unit checks green',
     'project_state: "2227 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2210 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2227 checks;"),
    ("bun run test          # 2210/2210",
     "bun run test          # 2227/2227"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **221 files** | **2210** | | Vitest |",
     "| **Unit total** | **222 files** | **2227** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2210/2210",
     "- [ ] `bun run test` → 2227/2227"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2210 checks / 221 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2227 checks / 222 files) |"),
])

# --- Project_Architecture_Document.md — the §11 rows (the five moved files) ---
patch("Project_Architecture_Document.md", [
    ("| `src/components/editor/editor-store.ts` | 840 |",
     "| `src/components/editor/editor-store.ts` | 847 |"),
    ("| `src/components/editor/canvas.tsx` | 1080 |",
     "| `src/components/editor/canvas.tsx` | 1086 |"),
    ("| `src/components/login-screen.tsx` | 714 |",
     "| `src/components/login-screen.tsx` | 733 |"),
    ("| `src/components/editor/ai-assistant.tsx` | 835 |",
     "| `src/components/editor/ai-assistant.tsx` | 853 |"),
    ("| `src/components/editor/layers-panel.tsx` | 436 |",
     "| `src/components/editor/layers-panel.tsx` | 474 |"),
])

# --- The §11 registration tails (appended to the five rows' ends) -------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
reg_subs = [
    # editor-store: the S160-D(c) no-op family form
    ("the A117-I1 selection-array churn residual documented in place) |",
     "the A117-I1 selection-array churn residual documented in place) + THE UNDO/REDO NO-OP FAMILY FORM (S160-D / I160-L3 — the empty-stack guards returned the full-state reference while the store's other eleven no-op guards return {}: the family form, thirteen-for-thirteen now) |"),
    # canvas: the S160-D(a) draw-preview gate
    ("once per handle press, the form-consistency doctrine) |",
     "once per handle press, the form-consistency doctrine) + THE DRAW-PREVIEW GATE (S160-D / I160-A-I1 — the F88 form-alignment family's draw member: the preview rides the commit's own OR-form threshold (drag.w > 3 || drag.h > 3), the marquee pair's S148-B alignment completed at the draw pair) |"),
    # login-screen: the S160-D(d) OTP autofill distribution
    ("the sign-in failure's INLINE alert (RA-60) |",
     "the sign-in failure's INLINE alert (RA-60) + THE OTP AUTOFILL DISTRIBUTION (S160-D / I160-L4 — the change handler's slice(-1)-only form kept the last digit of a browser one-time-code autofill, discarding the other five; the multi-digit value now distributes across the six cells (the paste handler's own contract), the single-digit path unchanged) |"),
    # ai-assistant: the S160-A guarded restore + the S160-D(e) transpose
    ("the S105-B honest-count floor the designed boundary). |",
     "the S105-B honest-count floor the designed boundary) + THE GUARDED DRAFT RESTORE (S160-A / L160-L1 — the two failure-branch restores ride the functional form setInput((draft) => (draft === \"\" ? message : draft)): an empty input restores the old prompt, a draft typed during the async send window survives — the S105-B/S106-B closures' own unguarded edge closed) + THE SEND-SEAM SET FORM (S160-D / I160-A-I2 — the locked-target derivation's transpose retired: the locked-ids Set built once, the selection filtered by has(), the S73-H/S74-B/S77-G/S105-D/S159-D family's own form). |"),
    # layers-panel: the S160-B keyboard superset
    ("the S133-C rationale at the drop seam). |",
     "the S133-C rationale at the drop seam) + THE LAYERS KEYBOARD SUPERSET (S160-B — the S159-C registered candidate follow-up DELIVERED: the row's select button gains onKeyDown — F2 opens the rename (the dblclick block's own triple), Alt+ArrowUp/Alt+ArrowDown reorder by one (the DnD branch's own reorderElements convention, the store's clamp absorbing the boundary moves as the S78-C identical-order no-op), the S131-B gesture stand-down twin at the reorder head). |"),
]
applied_regs = 0
for old, new in reg_subs:
    if new in text and old not in text:
        continue
    if old not in text:
        raise SystemExit(f"MISSING §11 registration anchor: {old[:80]!r}")
    assert text.count(old) == 1, f"AMBIGUOUS §11 registration anchor: {old[:80]!r}"
    text = text.replace(old, new)
    applied_regs += 1
pad.write_text(text)
print(f"Project_Architecture_Document.md: {applied_regs} §11 registration tails appended")

# --- The §7.1 row for the s160 spec (inserted after the s159 row). ------------
text = pad.read_text()
row = (
    "| Unit — THE GUARDED DRAFT RESTORE + LAYERS KEYBOARD SUPERSET + CANVAS DRAW-CREATION POINTER-ONLY REGISTRATION + INFORMATIONAL QUINTET PASS (the one-hundred-and-eighth audit's chosen work, the auditors' census A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/1I + the lead's own 0C/0H/0M/1L/3I, every finding lead-verified live at its seams): S160-A — the guarded draft restore (L160-L1, the lead's own finding, the L158-L1 precedent of the lead's plan-validation discovery): the send path clears the draft BEFORE the await and the input stays editable through the whole async window (only the submit button disables), so the two unconditional setInput(message) restores (the response-error branch and the catch) clobbered a draft typed during the wait — the S105-B/S106-B closures' own unguarded edge; the fix: the functional form setInput((draft) => (draft === \"\" ? message : draft)) at BOTH sites (ai-assistant.tsx 835 → 853) + S160-B — the layers keyboard superset (the S159-C registered candidate follow-up, DELIVERED — the working-superset doctrine): the row's select button gains onKeyDown — F2 opens the rename (the dblclick block's own triple) and Alt+ArrowUp/Alt+ArrowDown reorder the layer by one (the rows render in REVERSE element order, so screen-up = later in the array: up inserts at index + 1, down at index − 1 in the elements-minus-self array — the DnD branch's own reorderElements convention, the store's clamp absorbing the boundary moves as the S78-C identical-order no-op); the global keydown's Alt bail means no chord conflict; the S131-B gesture stand-down twin at the reorder head; the layers-a11y row-slice pin preserved by design (layers-panel.tsx 436 → 474) + S160-C — the canvas draw-creation pointer-only registration (the lead's own audit-phase discovery, the S139-B/S159-C precedent at the canvas creation family): the ELEMENT-CREATION gestures are pointer-only with NO keyboard path to the creation gesture; the HONEST absent-equivalent — the AI assistant's text instructions create elements by keyboard but are a DIFFERENT MECHANISM (a natural-language batch operator, not a keyboard equivalent of the draw gesture), honestly named as such; the reference pointer-only too (parity); registered the 108th cycle, the worklog's bracketed s160-canvas-pointer-only-note landed BEFORE the spec's birth; the insert-shape keyboard surface the candidate follow-up; zero source change + S160-D — the Informational quintet: the draw preview gate aligned to the commit's own OR form (I160-A-I1, the F88 form-alignment family's draw member; canvas.tsx 1080 → 1086), the export-png fillImage membership unified onto the truthiness family (I160-L2 — the degenerate empty string uniformly no-image; export-png.ts 371 → 378), the store's undo/redo empty-stack guards on the return {} family form (I160-L3 — thirteen-for-thirteen with the other eleven no-op guards; editor-store.ts 840 → 847), the OTP autofill distribution (I160-L4 — the multi-digit change value distributes across the six cells, the paste handler's own contract; login-screen.tsx 714 → 733), and the AI send seam's transpose retired (I160-A-I2 — the locked-ids Set + the has() filter, the S73-H/S74-B/S77-G/S105-D/S159-D family's own form) + S160-E the per-session pin family (17 pins: 12 RED incl. the pair-unity RED-until-collateral / 5 survival; THREE spec-form repairs at birth — the audit-entry phrase-case onto the spelled-out deferral form (the s156 F143 precedent's class), the canvas commit-gate anchor onto the two-line adjacency (the draw COMMIT branch is the file's second \"draw\" branch), and the transpose pin onto the collapsed form (the landed filter call wraps its arrow body); the F138 guard's TENTH instance riding the survival form — the s159 plan's record pinned 8/8 ticked per the session_340 directive; THE F138 GUARD'S TENTH VERIFICATION PASSED — the s159 plan 8/8 at its own delivery commit 60e5fd1c, the forward form held a ninth consecutive cycle) and the collateral family (the count-family re-anchor 2227 = 2210 + 17 unit / 222 files; the four setInput F140 riders on lows-s105/s106/s122/s123; the two return-state F140 riders on lows-s114; the s156/s157/s158 layer-total hard pins' F140 re-anchor rider onto 14,190 — the s138/s139 823→840 and s159's own 14,077→14,095 precedents; the s151..s159 SKILL-version pins onto v1.138.0; the s154..s159 forward-guard rolling re-anchors onto v1.139.0 — the guard family's sixth through first rolling instances; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) | `tests/lows-s160.test.ts` | 17 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s159.test.ts` | 15 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s159 §7.1 anchor row not found")
if "`tests/lows-s160.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s160 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-160 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The guarded-restore + keyboard-superset + draw-creation-registration seams (session 160, "
    "S160-A..S160-E — the one-hundred-and-eighth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/1I + the lead's own 0C/0H/0M/1L/3I):** (a) a restore "
    "written to fix input loss must guard against clobbering NEWER input — the send path clears "
    "the AI draft BEFORE the await while the input stays editable through the async window, so "
    "the unconditional failure-branch restores clobbered a draft typed during the wait; the "
    "functional form `setInput((draft) => (draft === \"\" ? message : draft))` at BOTH branches "
    "(an empty input restores, a newer draft survives — the S105-B/S106-B closures' own "
    "unguarded edge closed at L160-L1); (b) a registered pointer-only gap's candidate "
    "follow-up is DELIVERED as a working superset on the row's real keyboard surface — the "
    "layers select button's onKeyDown: F2 opens the rename (the dblclick block's own triple) "
    "and Alt+ArrowUp/Alt+ArrowDown reorder by one (the DnD branch's own reorderElements "
    "convention — rows render in REVERSE element order, so screen-up = later in the array; the "
    "store's clamp absorbing the boundary moves as the S78-C identical-order no-op; the "
    "S131-B gesture stand-down twin; the global keydown's Alt bail means no chord conflict; "
    "the row container stays keyboard-free, the layers-a11y row-slice pin green by design); "
    "(c) THE CANVAS DRAW-CREATION POINTER-ONLY REGISTRATION (the lead's own audit-phase "
    "discovery — the S139-B resize-handle / S159-C layers precedent at the canvas creation "
    "family): the ELEMENT-CREATION gestures are pointer-only (the draw tools' "
    "pointerdown-to-pointerup drag, the pen tool's freehand pointermove stream) with no "
    "keyboard path to the creation gesture; the HONEST absent-equivalent — the AI assistant's "
    "text instructions DO create elements by keyboard but are a DIFFERENT MECHANISM (a "
    "natural-language batch operator, not a keyboard equivalent of the draw gesture), named "
    "as such rather than claimed as coverage; the reference pointer-only too (parity — the "
    "gap parity-borne); registered the 108th cycle (the worklog's bracketed "
    "s160-canvas-pointer-only-note landed BEFORE the spec's birth); the insert-shape keyboard "
    "surface the candidate follow-up, behind the standing members; (d) the Informational "
    "quintet: the draw preview gate rides the commit's own OR-form threshold (I160-A-I1, the "
    "F88 form-alignment family's draw member), the export-png fillImage membership unified "
    "onto the truthiness family (I160-L2), the store's undo/redo empty-stack guards on the "
    "return {} family form — thirteen-for-thirteen (I160-L3), the OTP autofill distribution "
    "(I160-L4 — the paste handler's own contract adopted by the change handler), and the AI "
    "send seam's transpose retired (I160-A-I2 — the locked-ids Set + has() filter, the "
    "S73-H/S74-B/S77-G/S105-D/S159-D family's own form at its transpose-direction member); "
    "(e) the probe-construction precision note (I160-B-I1, auditor B's live probe): the "
    "canonical throwing-getter probe shape under-tests — the native Error constructor "
    "installs the message as an own data property shadowing a prototype getter; construct "
    "the shape with the no-arg super() form or an own accessor (the contract itself total "
    "in every construction). Pinned by `tests/lows-s160.test.ts` (17 pins: 12 RED incl. the "
    "pair-unity RED-until-collateral / 5 survival; THREE spec-form repairs at birth — the "
    "audit-entry phrase-case, the canvas commit-gate adjacency anchor, the transpose "
    "collapsed form; the count-family re-anchor 2227 = 2210 + 17 unit / 222 files — the "
    "family's live anchor; the 22-file layer at 14,190 — the second movement since S155: "
    "ai-assistant +18, layers-panel +38, canvas +6, export-png +7, editor-store +7, "
    "login-screen +19).\n"
)
marker = "- **The string-honesty + StrictMode-flip + pointer-only-registration seams (session 159,"
if "`tests/lows-s160.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s159 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-160 bullet inserted")
else:
    print("AGENTS.md: session-160 bullet already present")

# --- The F140 prior-spec re-anchor riders -------------------------------------
# (1) the four setInput pins onto the guarded spelling (the prior claims
#     stay TRUE at the current tree — the restores are present, after
#     the guards, beside the toasts; the spelling moves with the seam).
patch("tests/lows-s105.test.ts", [
    ("expect(catchBody).toMatch(/setInput\\(message\\)/);",
     'expect(catchBody).toMatch(/setInput\\(\\(draft\\) => \\(draft === "" \\? message : draft\\)\\)/);'),
])
patch("tests/lows-s106.test.ts", [
    ('const restoreIdx = branch.indexOf("setInput(message)");',
     "const restoreIdx = branch.indexOf('setInput((draft) => (draft === \"\" ? message : draft))');"),
])
patch("tests/lows-s122.test.ts", [
    ('const restoreIdx = catchBlock.indexOf("setInput(message)");',
     "const restoreIdx = catchBlock.indexOf('setInput((draft) => (draft === \"\" ? message : draft))');"),
])
patch("tests/lows-s123.test.ts", [
    ("expect(aiAssistantSource).toMatch(/setInput\\(message\\)/);",
     'expect(aiAssistantSource).toMatch(/setInput\\(\\(draft\\) => \\(draft === "" \\? message : draft\\)\\)/);'),
])

# (2) the two return-state pins on lows-s114 onto the return {} family
#     form (the guard-presence claims stay TRUE — the spelling moves).
patch("tests/lows-s114.test.ts", [
    (r"expect(storeCollapsed).toMatch(/if \(state\.past\.length === 0\) return state;/);",
     r"expect(storeCollapsed).toMatch(/if \(state\.past\.length === 0\) return \{\};/);"),
    (r"expect(storeCollapsed).toMatch(/if \(state\.future\.length === 0\) return state;/);",
     r"expect(storeCollapsed).toMatch(/if \(state\.future\.length === 0\) return \{\};/);"),
])

# (3) the s156/s157/s158 layer-total hard pins onto the new figure
#     (the rider's precedent: the s155 823→840 and s159 14,077→14,095
#     re-anchors — the CLAIM stays true, the pinned figure moves).
for name in ("tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts"):
    patch(name, [
        ("expect(liveLayerTotal).toBe(14095);",
         "expect(liveLayerTotal).toBe(14190);"),
    ])

# (4) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — without the rider the pin would
#     freeze v1.138.0 against a moving title).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.138.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.139.0",'),
])

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s159 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.137\\.0" in text:
        text = text.replace("version: 1\\.137\\.0", "version: 1\\.138\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.138.0)")
    elif "version: 1\\.138\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s159 forward count-truth guards' rolling re-anchors
# (v1.138.0 -> v1.139.0 — the s154 guard's SIXTH rolling instance,
#     the s155 guard's FIFTH, the s156 guard's FOURTH, the s157 guard's
#     THIRD, the s158 guard's SECOND, the s159 guard's FIRST) — the
#     F140 rider at the count-truth guard family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.138.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.139.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.138\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.139\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.138.0 -> v1.139.0)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2210";' in text:
        assert text.count('const UNIT = "2210";') == 1
        text = text.replace('const UNIT = "2210";', 'const UNIT = "2227";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2227";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "221";' in text:
        assert text.count('const FILES = "221";') == 1
        text = text.replace('const FILES = "221";', 'const FILES = "222";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "222";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")

# --- The MISSED-RIDER batch (surfaced by the full unit gate on the first -----
# --- post-doc run — the s159 precedent's own shape: the gate working as -------
# --- intended; every rider below re-anchors a prior-spec pin whose claim -------
# --- stays TRUE at the current tree) --------------------------------------------
# (5) the S131-B four-guard census grows to FIVE — the S160-B keyboard
#     reorder arm joins the stand-down family (the claim "every
#     history-mutating arm stands down" extends: the four pointer arms
#     + the keyboard twin).
for name in ("tests/lows-s131.test.ts", "tests/lows-s132.test.ts", "tests/lows-s133.test.ts"):
    patch(name, [
        ("    const guards = layersSource.match(/if \\(store\\.gestureSnapshot\\) return;/g) ?? [];\n    expect(guards.length).toBe(4);",
         "    const guards = layersSource.match(/if \\(store\\.gestureSnapshot\\) return;/g) ?? [];\n    expect(guards.length).toBe(5);"),
    ])

# (6) the s106 DEFECT pin's branch window widened — the S160-A
#     registration comment (~550 chars) sits between the branch start
#     and the toast; 800 -> 1400 (the S102-B legitimate-widening
#     convention).
patch("tests/lows-s106.test.ts", [
    ("    const branch = AI_PANEL.slice(idx, idx + 800);",
     "    const branch = AI_PANEL.slice(idx, idx + 1400);"),
])

# (7) the s106/s122 SURVIVAL pins' bare restore spelling onto the
#     guarded form (the second-site riders the first pass missed).
patch("tests/lows-s106.test.ts", [
    ("    expect(catchBody).toMatch(/setInput\\(message\\)/);",
     '    expect(catchBody).toMatch(/setInput\\(\\(draft\\) => \\(draft === "" \\? message : draft\\)\\)/);'),
])
patch("tests/lows-s122.test.ts", [
    ("    expect(catchBlock).toMatch(/setInput\\(message\\)/);",
     '    expect(catchBlock).toMatch(/setInput\\(\\(draft\\) => \\(draft === "" \\? message : draft\\)\\)/);'),
])

# (8) the client-lows-s79 send-body window widened — the S160-A
#     comments + the S160-D(e) transpose retirement (~1,150 chars
#     together) pushed the epoch check past 7000; 7000 -> 8500 (the
#     S102-B convention, the live-measured distance ~7,400).
patch("tests/client-lows-s79.test.ts", [
    ("    const body = assistant.slice(start, start + 7000);",
     "    const body = assistant.slice(start, start + 8500);"),
])

# (9) the s138/s139 editor-store live-count + PAD §11 figure riders
#     (840 -> 847 — the S160-D(c) family-form comments' movement).
patch("tests/lows-s138.test.ts", [
    ('    expect(lineCount("../src/components/editor/editor-store.ts")).toBe(840);',
     '    expect(lineCount("../src/components/editor/editor-store.ts")).toBe(847);'),
    (r"    expect(padSource).toMatch(/\| `src\/components\/editor\/editor-store\.ts` \| 840 \|/);",
     r"    expect(padSource).toMatch(/\| `src\/components\/editor\/editor-store\.ts` \| 847 \|/);"),
])
patch("tests/lows-s139.test.ts", [
    ('    expect(lineCount("../src/components/editor/editor-store.ts")).toBe(840);',
     '    expect(lineCount("../src/components/editor/editor-store.ts")).toBe(847);'),
])

# (10) the s159 §11 canvas-row figure rider (1080 -> 1086 — the
#      S160-D(a) draw-preview gate registration's movement).
patch("tests/lows-s159.test.ts", [
    ('    expect(canvasRow).toContain("| 1080 |");',
     '    expect(canvasRow).toContain("| 1086 |");'),
])
