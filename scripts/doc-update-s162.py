#!/usr/bin/env python3
"""The session-162 docs update: the count-family re-anchor (2257 = 2243 + 14
unit / 224 files across every live claim site), the LAYER-TOTAL re-anchor
(14,268 -> 14,295 — the fourth movement since S155: editor-view 2432 -> 2453,
canvas 1086 -> 1092), the §7.1 row for the s162 spec, the §11 rows (two
files) with the S162 registrations, the AGENTS session-162 bullet (carrying
the S162-A insert-branch honest completion + the S162-B text-tool sibling
promotion + the S162-C phantom-freehand correction), the F140 prior-spec
re-anchor riders (the lows-s161 Insert-centering pins onto the clamped
spelling; the s159 §11 viewRow/canvasRow figure pins; the s156/s157/s158
layer-total hard pins onto 14,295), the prior-spec forward-guard ROLLING
re-anchors (the s154..s161 count-truth guards' version literals onto
v1.141.0), the s151..s161 SKILL-version pins onto v1.140.0, the s158 title
pin onto v1.141.0, and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-146..161 bullets' own count
records, the v1.125.0..v1.140.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s162.py
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
    ("| Unit tests (2243 checks) | `bun run test` |",
     "| Unit tests (2257 checks) | `bun run test` |"),
    ("`bun run test` (2243) → `bun run build`",
     "`bun run test` (2257) → `bun run build`"),
    # the live-anchor paren phrase (the s152-cycle convention — the
    # family's rolling marker; the s161 bullet's paren form carries it)
    ("the count-family re-anchor 2243 = 2227 + 16 unit / 223 files (the family's live anchor)",
     "the count-family re-anchor 2257 = 2243 + 14 unit / 224 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2243 checks, Vitest) |",
     "| `bun run test` | Unit tests (2257 checks, Vitest) |"),
    ("(2243 unit / 73 smoke / 262 e2e)",
     "(2257 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2243 checks):",
     "- **Unit Tests** (Vitest, 2257 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2243 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2257 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2243 checks on the pure domain seams",
     "bun run test              # unit tests — 2257 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2243 unit checks green',
     'project_state: "2257 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2243 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2257 checks;"),
    ("bun run test          # 2243/2243",
     "bun run test          # 2257/2257"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **223 files** | **2243** | | Vitest |",
     "| **Unit total** | **224 files** | **2257** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2243/2243",
     "- [ ] `bun run test` → 2257/2257"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2243 checks / 223 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2257 checks / 224 files) |"),
])

# --- Project_Architecture_Document.md — the §11 rows (the two moved files) --
patch("Project_Architecture_Document.md", [
    ("| `src/components/editor/editor-view.tsx` | 2432 |",
     "| `src/components/editor/editor-view.tsx` | 2453 |"),
    ("| `src/components/editor/canvas.tsx` | 1086 |",
     "| `src/components/editor/canvas.tsx` | 1092 |"),
])

# --- The §11 registration tails (appended to the two rows' ends) ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
reg_subs = [
    # editor-view: the S162-A honest completion + the S162-C correction
    ("the S123-A gesture stand-down covers the branch by placement) |",
     "the S123-A gesture stand-down covers the branch by placement) + THE INSERT BRANCH'S HONEST COMPLETION (S162-A — L162-A-L1 + L162-A-L3, the one-hundred-and-tenth audit's chosen work: the branch's x/y now ride clampPositionField (the draw commit's own S87-B/S84-B deep-pan teleport guard — panBy is unbounded, a viewport center past ±100000 would otherwise commit off-bound and visibly teleport to the server's buildElementRow bound on the store-replacing save) and the cap-refused toast (the S61-F contract both canvas siblings honor — a silent dead Insert on a full board is the pre-fix behavior class)) + THE PHANTOM-FREEHAND CORRECTION (S162-C / L162-A-L2 — the registration comment's live creation census: the draw tools' drag + the text tool's click-to-place; the S160-C registration's phantom pen member corrected at the seam (TOOL_TO_TYPE maps only the four draw types, the pen creates nothing), the frozen records staying frozen per S132-C with the bracketed s162-phantom-freehand-note the standing correction)) |"),
    # canvas: the S162-B text-tool sibling promotion
    ("the marquee pair's S148-B alignment completed at the draw pair) |",
     "the marquee pair's S148-B alignment completed at the draw pair) + THE TEXT-TOOL ADD'S POSITION CLAMP (S162-B — L162-A-L1's unregistered sibling promoted: the text add's x/y ride clampPositionField in the draw commit's own one-line form — the S84-B teleport family's sixth member, the arm the family's five prior sweeps never named) |"),
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

# --- The §7.1 row for the s162 spec (inserted after the s161 row). ------------
text = pad.read_text()
row = (
    "| Unit — THE INSERT-BRANCH HONEST-COMPLETION + TEXT-TOOL SIBLING + PHANTOM-FREEHAND PASS (the one-hundred-and-tenth audit's chosen work, the auditors' census A 0C/0H/0M/3L/0I + B 0C/0H/0M/0L/0I, every finding lead-verified live at its seams): S162-A — the insert branch's honest completion (L162-A-L1 + L162-A-L3, one seam: the S161-B Insert branch passed RAW x/y to addElement while the draw commit it mirrors clamps both through clampPositionField (the S87-B/S84-B deep-pan teleport guard — panBy is unbounded, a viewport center past ±100000 commits off-bound and teleports to the server's buildElementRow bound on the store-replacing save), and the branch DISCARDED addElement's null return — the only one of the three addElement call sites ignoring the S61-F honest-refusal contract; the fix: the clamp pair in the draw commit's own one-line form + the siblings' two-line toast-on-null wrap + the import extension) + S162-B — the text-tool sibling promotion (L162-A-L1's unregistered member: the text-tool add's raw point at canvas.tsx:226 — the pre-existing UNREGISTERED sibling of the S84-B family, never named by the family's five prior sweeps — promoted alongside in the same one-line form) + S162-C — the phantom-freehand correction (L162-A-L2, the S73-A phantom-seam class: the S160-C registration's enumeration named \"the pen tool's freehand pointermove stream\" as a creation gesture that does not exist — TOOL_TO_TYPE maps only rectangle/ellipse/line/frame, the draw gate never opens for pen, zero e2e coverage; the registration's core claim stays TRUE; the source comment reworded onto the live census — the draw tools' drag + the text tool's click-to-place — the frozen records staying frozen per S132-C with the bracketed correction note) + S162-D the per-session pin family (14 pins: 9 RED incl. the pair-unity RED-until-collateral / 5 survival; the F138 guard's THIRTEENTH instance riding the survival form — the s161 plan's record pinned 8/8 ticked per the pre-armed session_351 directive; THE F138 GUARD'S TWELFTH VERIFICATION PASSED — the s161 plan 8/8 at its own delivery commit 0e0d05fd, the forward form held an eleventh consecutive cycle) and the collateral family (the count-family re-anchor 2257 = 2243 + 14 unit / 224 files; the F140 riders — the lows-s161 Insert-centering pins onto the clamped spelling, the s159 §11 viewRow/canvasRow figure pins onto 2453/1092, the s156/s157/s158 layer-total hard pins onto 14,295; the s151..s161 SKILL-version pins onto v1.140.0; the s154..s161 forward-guard rolling re-anchors onto v1.141.0 — the guard family's eighth through first rolling instances; the s158 title pin onto v1.141.0; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) | `tests/lows-s162.test.ts` | 14 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s161.test.ts` | 16 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s161 §7.1 anchor row not found")
if "`tests/lows-s162.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s162 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-162 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The insert-honest-completion + text-tool-sibling + phantom-correction seams (session 162, "
    "S162-A..S162-D — the one-hundred-and-tenth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/3L/0I + B 0C/0H/0M/0L/0I, every finding lead-verified live at its seams):** (a) "
    "THE INSERT BRANCH'S HONEST COMPLETION (L162-A-L1 + L162-A-L3, one seam): the S161-B Insert "
    "branch passed RAW x/y to addElement while the draw commit it mirrors clamps both through "
    "clampPositionField (the S87-B/S84-B deep-pan teleport guard — panBy is unbounded, a "
    "deep-panned viewport center past ±100000 would otherwise commit off-bound and visibly "
    "teleport to the server's buildElementRow bound on the store-replacing save), and the branch "
    "discarded addElement's null return — the only one of the three addElement call sites "
    "ignoring the S61-F honest-refusal contract (a silent dead Insert on a full board is the "
    "pre-fix behavior class); the fix carries the family's own guards: the clamp pair in the "
    "draw commit's own one-line form + the siblings' two-line toast-on-null wrap; (b) THE "
    "TEXT-TOOL SIBLING PROMOTION (L162-A-L1's unregistered member): the text-tool add's raw "
    "point — the pre-existing UNREGISTERED sibling of the S84-B family, never named by the "
    "family's five prior sweeps (the draw commit, the resize write-back, moveElements, the Text "
    "Content field, cornerRadius) — promoted alongside in the same one-line form; (c) THE "
    "PHANTOM-FREEHAND CORRECTION (L162-A-L2, the S73-A phantom-seam class): the S160-C "
    "registration's enumeration named \"the pen tool's freehand pointermove stream\" as a "
    "creation gesture that does not exist — TOOL_TO_TYPE maps only rectangle/ellipse/line/frame, "
    "the draw gate never opens for pen, zero e2e coverage; the registration's core claim (the "
    "creation gestures pointer-only, no keyboard path, the AI assistant a different mechanism) "
    "stays TRUE — the source comment reworded onto the live census (the draw tools' drag + the "
    "text tool's click-to-place), the frozen records staying frozen per S132-C with the "
    "bracketed s162-phantom-freehand-note the standing correction. Pinned by "
    "`tests/lows-s162.test.ts` (14 pins: 9 RED incl. the pair-unity RED-until-collateral / 5 "
    "survival; TWO spec-form repairs at the source-green pass — the look-back region form and "
    "the multi-line toast form, both onto the delivered source's own layout; the count-family "
    "re-anchor 2257 = 2243 + 14 unit / 224 files — the family's live anchor; the 22-file layer "
    "at 14,295 — the fourth movement since S155: editor-view +21, canvas +6).\n"
)
marker = "- **The pagehide-registration + insert-shape-delivery + picker-token seams (session 161,"
if "`tests/lows-s162.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s161 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-162 bullet inserted")
else:
    print("AGENTS.md: session-162 bullet already present")

# --- The F140 prior-spec re-anchor riders -------------------------------------
# (1) the lows-s161 Insert-centering pins onto the clamped spelling (the
#     prior claim stays TRUE at the current tree — the element is still
#     centered on the computed point; the centered form now rides the
#     clamp, the spelling moves with the seam).
patch("tests/lows-s161.test.ts", [
    ("    // The element centered on the computed point.\n    expect(branch).toContain(\"x: cx - w / 2\");\n    expect(branch).toContain(\"y: cy - h / 2\");",
     "    // The element centered on the computed point (the S162-A clamp\n    // wrap — the centered form now rides clampPositionField, the\n    // F140 re-anchor rider's spelling).\n    expect(branch).toContain(\"clampPositionField(cx - w / 2)\");\n    expect(branch).toContain(\"clampPositionField(cy - h / 2)\");"),
])

# (2) the s159 §11 viewRow/canvasRow figure pins onto the new figures
#     (the row re-anchor claims stay TRUE — the pinned figures move
#     with the rows).
patch("tests/lows-s159.test.ts", [
    ('    expect(viewRow).toContain("| 2432 |");',
     '    expect(viewRow).toContain("| 2453 |");'),
    ('    expect(canvasRow).toContain("| 1086 |");',
     '    expect(canvasRow).toContain("| 1092 |");'),
])

# (3) the s156/s157/s158 layer-total hard pins onto the new figure
#     (the rider's precedent: the s160/s161 re-anchors — the CLAIM
#     stays true, the pinned figure moves).
for name in ("tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts"):
    patch(name, [
        ("expect(liveLayerTotal).toBe(14268);",
         "expect(liveLayerTotal).toBe(14295);"),
    ])

# (4) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s160/s161 cycle's own rider
#     form, its third instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.140.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.141.0",'),
])

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s161 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.139\\.0" in text:
        text = text.replace("version: 1\\.139\\.0", "version: 1\\.140\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.140.0)")
    elif "version: 1\\.140\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s161 forward count-truth guards' rolling re-anchors
# (v1.140.0 -> v1.141.0 — the s154 guard's EIGHTH rolling instance,
#     the s155 guard's SEVENTH, the s156 guard's SIXTH, the s157 guard's
#     FIFTH, the s158 guard's FOURTH, the s159 guard's THIRD, the s160
#     guard's SECOND, the s161 guard's FIRST) — the F140 rider at the
#     count-truth guard family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.140.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.141.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.140\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.141\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.140.0 -> v1.141.0)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2243";' in text:
        assert text.count('const UNIT = "2243";') == 1
        text = text.replace('const UNIT = "2243";', 'const UNIT = "2257";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2257";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "223";' in text:
        assert text.count('const FILES = "223";') == 1
        text = text.replace('const FILES = "223";', 'const FILES = "224";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "224";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
