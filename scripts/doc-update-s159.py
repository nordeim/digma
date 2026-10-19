#!/usr/bin/env python3
"""The session-159 docs update: the count-family re-anchor (2210 = 2195 + 15
unit / 221 files across every live claim site), the LAYER-TOTAL re-anchor
(14,077 -> 14,095 — the first layer movement since S155's comment-only pass:
editor-view 2359 -> 2371, canvas 1075 -> 1080, toolbar 89 -> 90), the §7.1
row for the s159 spec, the §11 rows (validation.ts 370 -> 380, editor-view
2359 -> 2371, canvas.tsx 1075 -> 1080) with the S159 registrations, the
AGENTS session-159 bullet (carrying the S159-C layers-pointer-only
registration member), the s158 spec's F40 route/source-pin re-anchor (the
prior claim onto the current tree's typeof-narrowed spelling), the
s156/s157/s158 layer-total hard pins' F140 re-anchor rider (toBe(14077) ->
toBe(14095) — the s138/s139 823->840 precedent at the layer family), the
prior-spec forward-guard ROLLING re-anchors (the s154..s158 count-truth
guards' version literals onto v1.138.0, the F140 rider: the CLAIM stays
true, the pinned spelling moves with the current block), the s151..s158
SKILL-version pins onto v1.137.0, and the spec-constants re-anchor for the
per-session count-honesty family.

Frozen historical rows (the session-146..158 bullets' own count
records, the v1.125.0..v1.137.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s159.py
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
    ("| Unit tests (2195 checks) | `bun run test` |",
     "| Unit tests (2210 checks) | `bun run test` |"),
    ("`bun run test` (2195) → `bun run build`",
     "`bun run test` (2210) → `bun run build`"),
    # the live-anchor paren phrase (the s152-cycle convention — the
    # family's rolling marker; the s158 bullet's paren form carries it)
    ("the count-family re-anchor 2195 = 2182 + 13 unit / 220 files (the family's live anchor)",
     "the count-family re-anchor 2210 = 2195 + 15 unit / 221 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2195 checks, Vitest) |",
     "| `bun run test` | Unit tests (2210 checks, Vitest) |"),
    ("(2195 unit / 73 smoke / 262 e2e)",
     "(2210 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2195 checks):",
     "- **Unit Tests** (Vitest, 2210 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2195 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2210 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2195 checks on the pure domain seams",
     "bun run test              # unit tests — 2210 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2195 unit checks green',
     'project_state: "2210 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2195 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2210 checks;"),
    ("bun run test          # 2195/2195",
     "bun run test          # 2210/2210"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **220 files** | **2195** | | Vitest |",
     "| **Unit total** | **221 files** | **2210** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2195/2195",
     "- [ ] `bun run test` → 2210/2210"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2195 checks / 220 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2210 checks / 221 files) |"),
])

# --- Project_Architecture_Document.md — the §11 rows (the source-carrying -----
# --- form: the figures re-anchored + the S159 registrations appended) ----------
patch("Project_Architecture_Document.md", [
    ("| `src/lib/validation.ts` | 370 | Caps, enums, hex checks, clamps + the `readBoundedJson` seam",
     "| `src/lib/validation.ts` | 380 | Caps, enums, hex checks, clamps + the `readBoundedJson` seam"),
    ("S158-A — the `describeRejection` seam: the TOTAL rejection description, both arms inside ONE try answering \"[unloggable rejection]\" when the description itself throws — the B158-I1 closure at the coercion seam, consumed by the ai-assistant route's degrade-not-fail catch) + the `normalizeEmail` seam",
     "S158-A — the `describeRejection` seam: the TOTAL rejection description, both arms inside ONE try answering \"[unloggable rejection]\" when the description itself throws — the B158-I1 closure at the coercion seam, consumed by the ai-assistant route's degrade-not-fail catch; S159-A — the string-honesty member: the Error arm narrows the message (`typeof error.message === \"string\"` — an overridden non-string message answers the guarded default, the : string annotation a claim the mechanism keeps for every shape — the I159-B-I1 closure)) + the `normalizeEmail` seam"),
])

# --- The §11 editor-view.tsx / canvas.tsx rows (the S159-B/D movements) -------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
for old, new in [
    ("| `src/components/editor/editor-view.tsx` | 2359 |", "| `src/components/editor/editor-view.tsx` | 2371 |"),
    ("| `src/components/editor/canvas.tsx` | 1075 |", "| `src/components/editor/canvas.tsx` | 1080 |"),
]:
    if old in text:
        assert text.count(old) == 1, f"AMBIGUOUS §11 anchor: {old!r}"
        text = text.replace(old, new)
        print(f"Project_Architecture_Document.md: §11 row {old.split('|')[1].strip()} re-anchored")
    elif new in text:
        print(f"Project_Architecture_Document.md: §11 row already re-anchored")
    else:
        raise SystemExit(f"MISSING §11 anchor: {old[:80]!r}")
# The S159-B registration appended to the editor-view row (the
# source-carrying form — the row's registration tail).
s159b_reg = (
    " + THE STRICTMODE-SAFE MOUNT DISCRIMINATOR (S159-B / L159-A-L2 — the "
    "one-hundred-and-seventh audit's Low: the load effect's firstRunRef "
    "flipped in the SYNC PREFIX so a cancelled run still left it flipped — "
    "dev StrictMode's double-invoked effect then misread run #2 as a SWAP "
    "and a same-project re-entry mount took the S61-I adoption-skip over "
    "the stale singleton, precisely the S85-A staleness class reborn in "
    "dev; the fix: the flip rides the run's LOAD COMMITS — after the "
    "project loadProject and at the Untitled fallback's — so a cancelled "
    "pre-commit run leaves the discriminator at mount while a committed "
    "run's flip sticks (the X→Y→X back-navigation adoption preserved)) |"
)
ev_anchor = "the failure path settles on the Untitled fallback with loading false, so presenting follows the route) |"
if "THE STRICTMODE-SAFE MOUNT DISCRIMINATOR (S159-B" not in text:
    if ev_anchor not in text:
        raise SystemExit("editor-view §11 registration anchor not found")
    assert text.count(ev_anchor) == 1
    text = text.replace(ev_anchor, "the failure path settles on the Untitled fallback with loading false, so presenting follows the route)" + s159b_reg)
    print("Project_Architecture_Document.md: §11 editor-view row — the S159-B registration appended")
else:
    print("Project_Architecture_Document.md: S159-B registration already present")
# The S159-D registration appended to the canvas row.
s159d_reg = (
    " + THE RESIZE-HANDLE SET MEMBERSHIP FORM (S159-D / I159-A-I1 — the "
    "handle pointerdown's live-element lookup rides `new Set(store."
    "selectedIds)`, the S74-B family's own convention at its one missed "
    "site: once per handle press, the form-consistency doctrine) |"
)
cv_anchor = "the wheel-mid-drag window registered, self-healing, zero mutation surface). |"
if "THE RESIZE-HANDLE SET MEMBERSHIP FORM (S159-D" not in text:
    if cv_anchor not in text:
        raise SystemExit("canvas §11 registration anchor not found")
    assert text.count(cv_anchor) == 1
    text = text.replace(cv_anchor, "the wheel-mid-drag window registered, self-healing, zero mutation surface)" + s159d_reg)
    print("Project_Architecture_Document.md: §11 canvas row — the S159-D registration appended")
else:
    print("Project_Architecture_Document.md: S159-D registration already present")
pad.write_text(text)

# --- The §7.1 row for the s159 spec (inserted after the s158 row). ------------
text = pad.read_text()
row = (
    "| Unit — THE DESCRIBEREJECTION STRING-HONESTY + STRICTMODE-SAFE MOUNT DISCRIMINATOR + LAYERS POINTER-ONLY REGISTRATION + INFORMATIONAL PAIR PASS (the one-hundred-and-seventh audit's chosen work, the auditors' census A 0C/0H/0M/2L/2I + B 0C/0H/0M/0L/1I: S159-A — the describeRejection string-honesty hardening (I159-B-I1, lead-verified live at the seam): the S158-A seam's Error arm returned error.message VERBATIM and an Error whose message property was overridden to a non-string (Object.assign(new Error(\"x\"), { message: null }) — live-probed: returns null; with 42 returns 42) violated the function's own : string annotation; the never-throws contract was already TOTAL (auditor B's 17-shape live probe: zero escapes); the fix: the typeof-narrowed arm — total AND string-typed, the guarded default answering the non-string message shapes (validation.ts 370 → 380; the route unchanged except the attribution extended to \"(S157-A/S158-A/S159-A)\" — the route stays 154 lines) + S159-B — the StrictMode-safe mount discriminator (L159-A-L2, auditor A's finding, lead-traced line-by-line): the flip firstRunRef.current = false moved from the effect's sync prefix to the two load-COMMIT sites — a cancelled pre-commit run (dev StrictMode's simulated unmount mid-await) leaves the discriminator at mount so the re-run loads fresh (the S85-A contract restored in dev), a committed run's flip sticks (the X→Y→X back-navigation adoption preserved — the lost-edit regression of the naive restore-in-cleanup form designed out); editor-view.tsx 2359 → 2371; the 22-file layer at **14,095 lines** (the first layer movement since S155's comment-only pass: editor-view +12, canvas +5, toolbar +1) + S159-C — the layers pointer-only registration (L159-A-L1, the S139-B resize-handle precedent at the layers family): the rename's dblclick-only entry and the reorder's HTML5-DnD-only form registered with the HONEST absent-equivalent (no Name field in the properties panel — keyboard-only users cannot rename or reorder layers, WCAG 2.1.1 Level A; the reference pointer-only too — parity), the working-superset keyboard surface the CANDIDATE FOLLOW-UP; zero source change + S159-D — the layer's Informational pair: the canvas resize-handle lookup rides the Set membership form (I159-A-I1 — canvas.tsx 1075 → 1080) and the toolbar comment's divider clause completes the enumeration (I159-A-I2 — \"dividers between the navigate group (select/hand), the shape group, and the pen/text/image group\", toolbar.tsx 89 → 90) + S159-E the per-session pin family (15 pins: 10 RED incl. the BEHAVIORAL shape member riding the dynamic import + the pair-unity RED-until-collateral / 5 survival; TWO spec-form repairs at birth — the S159-C note pin's phrase-case onto the note's own 'NO keyboard rename surface' spelling (the s156 F143 precedent's class), and the §11 figures onto the MEASURED post-fix tree (editor-view 2,371 not the 2,367 forecast; toolbar 89 → 90; the layer total 14,095); the F138 guard's NINTH instance riding the survival form — the s158 plan's record pinned 7/7 ticked per the session_334 directive; THE F138 GUARD'S NINTH VERIFICATION PASSED — the s158 plan 7/7 at its own delivery commit 48923eb2, the forward form held an eighth consecutive cycle) and the collateral family (the count-family re-anchor 2210 = 2195 + 15 unit / 221 files; the s158 spec's F40 route/source-pin re-anchor onto the typeof-narrowed spelling; the s156/s157/s158 layer-total hard pins' F140 re-anchor rider onto 14,095 — the s138/s139 823→840 precedent; the s151..s158 SKILL-version pins onto v1.137.0; the s154..s158 forward-guard rolling re-anchors onto v1.138.0 — the guard family's fifth through first rolling instances; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) | `tests/lows-s159.test.ts` | 15 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s158.test.ts` | 13 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s158 §7.1 anchor row not found")
if "`tests/lows-s159.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s159 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-159 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The string-honesty + StrictMode-flip + pointer-only-registration seams (session 159, "
    "S159-A..S159-E — the one-hundred-and-seventh audit's chosen work, the auditors' census "
    "A 0C/0H/0M/2L/2I + B 0C/0H/0M/0L/1I):** (a) a `: string` annotation is a totality claim "
    "about the RETURN — the describeRejection Error arm narrows the message "
    "(`typeof error.message === \"string\"` — an overridden non-string message (null, a "
    "number) answers the guarded default; the I159-B-I1 closure at the string-honesty seam, "
    "the F145 totality doctrine extended to the return contract); (b) an effect-run "
    "discriminator flipped in the sync prefix is misread by the dev double-invoke — the "
    "flip rides the run's LOAD COMMIT, never the prefix (a cancelled pre-commit run leaves "
    "the discriminator at mount — the StrictMode re-run loads fresh, the S85-A contract "
    "restored in dev; a committed run's flip sticks — the X→Y→X back-navigation adoption "
    "preserved; the L159-A-L2 closure at editor-view.tsx's load effect); (c) THE LAYERS "
    "POINTER-ONLY REGISTRATION (L159-A-L1 — the S139-B resize-handle-keyboard-posture "
    "precedent at the layers family): the layer RENAME opens exclusively via the row's "
    "onDoubleClick (the reference's measured contract, S70-A) and the REORDER rides HTML5 "
    "DnD with no keyboard alternative — the HONEST absent-equivalent (no Name field in the "
    "properties panel, unlike the S139-B member whose panel equivalent existed): "
    "keyboard-only users cannot rename or reorder layers (WCAG 2.1.1 Level A); the "
    "reference pointer-only too (parity), the gap parity-borne — registered the session it "
    "was found after 106 audits without a naming; the working-superset keyboard surface "
    "(an F2/ellipsis-menu rename entry + move-up/move-down reorder items) the CANDIDATE "
    "FOLLOW-UP, riding the mobile-nav/export superset doctrine; (d) the membership scan "
    "rides the Set at every selection-consuming site (the canvas resize-handle's live-element "
    "lookup — I159-A-I1, the S74-B family's one missed site) and a comment's enumeration "
    "completes (the toolbar divider clause naming all three groups — I159-A-I2). Pinned by "
    "`tests/lows-s159.test.ts` (15 pins: 10 RED incl. the behavioral shape member + the "
    "pair-unity RED-until-collateral / 5 survival; the count-family re-anchor 2210 = 2195 + 15 "
    "unit / 221 files — the family's live anchor; the 22-file layer at 14,095 — the first "
    "movement since S155's comment-only pass).\n"
)
marker = "- **The total-coercion + toolbar-px + title-lag seams (session 158,"
if "`tests/lows-s159.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s158 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-159 bullet inserted")
else:
    print("AGENTS.md: session-159 bullet already present")

# --- The s158 spec's F40 route/source-pin re-anchor (the prior claim onto ----
# --- the current tree's spelling) ---------------------------------------------
# The S159-A fix narrowed the Error arm inside the guarded helper; the
# s158 spec's source pin re-anchors so the prior claim stays TRUE at the
# current tree (the F140 prior-spec re-anchor rider).
patch("tests/lows-s158.test.ts", [
    ('      "error instanceof Error ? error.message : String(error)",',
     '      \'typeof error.message === "string"\','),
    ('    expect(routeSource).toContain("every rejection shape (S157-A/S158-A)");',
     '    expect(routeSource).toContain("every rejection shape (S157-A/S158-A/S159-A)");'),
])

# --- The s157 spec's comment-attribution re-anchor (the F40 rider, the --------
# --- second prior generation) --------------------------------------------------
patch("tests/lows-s157.test.ts", [
    ('    expect(routeSource).toContain("every rejection shape (S157-A/S158-A)");',
     '    expect(routeSource).toContain("every rejection shape (S157-A/S158-A/S159-A)");'),
])

# --- The s158 spec's title pin rolling re-anchor (the title-lag guard rides ---
# --- the CURRENT chain head — the F140 rider at the title family; without ------
# --- the rider the pin would freeze v1.137.0 against a moving title) -----------
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.137.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.138.0",'),
])

# --- The s134/s135/s136 resize-arm live-element pins' F40 re-anchor rider ------
# (the S159-D Set form moved the spelling the three prior specs pin; the
#  claims stay TRUE at the current tree — the found-in-the-live-list-by-
#  the-live-selection contract unchanged, the membership form the family
#  convention's own spelling).
for name in ("tests/lows-s134.test.ts", "tests/lows-s135.test.ts", "tests/lows-s136.test.ts"):
    patch(name, [
        (r"      /const el = store\.elements\.find\(\(e\) => store\.selectedIds\.includes\(e\.id\)\) \?\? selected\[0\]!/,",
         r"      /const selectedIdSet = new Set\(store\.selectedIds\);\s*const el = store\.elements\.find\(\(e\) => selectedIdSet\.has\(e\.id\)\) \?\? selected\[0\]!/,"),
    ])

# --- The s156/s157/s158 layer-total hard pins' F140 re-anchor rider ------------
# (the layer MOVES this cycle — the first movement since the pins were
#  born; the rider's precedent: doc-update-s155.py's 823→840 re-anchor
#  of the s138/s139 §11 pins — the CLAIM stays true, the pinned figure
#  moves with the current tree.)
for name in ("tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts"):
    patch(name, [
        ("expect(liveLayerTotal).toBe(14077);",
         "expect(liveLayerTotal).toBe(14095);"),
    ])

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s158 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump; the S158 cycle's
#     own step, re-derived live this cycle).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.136\\.0" in text:
        text = text.replace("version: 1\\.136\\.0", "version: 1\\.137\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.137.0)")
    elif "version: 1\\.137\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s158 forward count-truth guards' rolling re-anchors
# (v1.137.0 -> v1.138.0 — the s154 guard's FIFTH rolling instance,
#     the s155 guard's FOURTH, the s156 guard's THIRD, the s157 guard's
#     SECOND, the s158 guard's FIRST) — the F140 rider at the count-truth
#     guard family: the CLAIM stays true, the pinned version literal moves
#     with the current block.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.137.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.138.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.137\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.138\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.137.0 -> v1.138.0)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2195";' in text:
        assert text.count('const UNIT = "2195";') == 1
        text = text.replace('const UNIT = "2195";', 'const UNIT = "2210";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2210";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "220";' in text:
        assert text.count('const FILES = "220";') == 1
        text = text.replace('const FILES = "220";', 'const FILES = "221";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "221";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
