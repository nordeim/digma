#!/usr/bin/env python3
"""The session-161 docs update: the count-family re-anchor (2243 = 2227 + 16
unit / 223 files across every live claim site), the LAYER-TOTAL re-anchor
(14,190 -> 14,268 — the third movement since S155: editor-view 2371 -> 2432,
properties-panel 2354 -> 2365, editor.ts 1257 -> 1263), the §7.1 row for
the s161 spec, the §11 rows (three files) with the S161 registrations, the
AGENTS session-161 bullet (carrying the S161-A pagehide out-of-order
registration member with the unsound-skip correction + the S161-B
insert-shape keyboard surface delivery + the S161-D per-surface picker
tokens), the F140 prior-spec re-anchor riders (the nine picker-token pins
on color-coalesce-s66/lows-s105 onto the per-surface spelling; the s159
§11 viewRow figure pin onto 2432; the s156/s157/s158 layer-total hard
pins onto 14,268), the prior-spec forward-guard ROLLING re-anchors (the
s154..s160 count-truth guards' version literals onto v1.140.0), the
s151..s160 SKILL-version pins onto v1.139.0, and the spec-constants
re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-146..160 bullets' own count
records, the v1.125.0..v1.139.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s161.py
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
    ("| Unit tests (2227 checks) | `bun run test` |",
     "| Unit tests (2243 checks) | `bun run test` |"),
    ("`bun run test` (2227) → `bun run build`",
     "`bun run test` (2243) → `bun run build`"),
    # the live-anchor paren phrase (the s152-cycle convention — the
    # family's rolling marker; the s160 bullet's paren form carries it)
    ("the count-family re-anchor 2227 = 2210 + 17 unit / 222 files (the family's live anchor)",
     "the count-family re-anchor 2243 = 2227 + 16 unit / 223 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2227 checks, Vitest) |",
     "| `bun run test` | Unit tests (2243 checks, Vitest) |"),
    ("(2227 unit / 73 smoke / 262 e2e)",
     "(2243 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2227 checks):",
     "- **Unit Tests** (Vitest, 2243 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2227 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2243 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2227 checks on the pure domain seams",
     "bun run test              # unit tests — 2243 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2227 unit checks green',
     'project_state: "2243 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2227 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2243 checks;"),
    ("bun run test          # 2227/2227",
     "bun run test          # 2243/2243"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **222 files** | **2227** | | Vitest |",
     "| **Unit total** | **223 files** | **2243** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2227/2227",
     "- [ ] `bun run test` → 2243/2243"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2227 checks / 222 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2243 checks / 223 files) |"),
])

# --- Project_Architecture_Document.md — the §11 rows (the three moved files) --
patch("Project_Architecture_Document.md", [
    ("| `src/components/editor/editor-view.tsx` | 2371 |",
     "| `src/components/editor/editor-view.tsx` | 2432 |"),
    ("| `src/components/editor/properties-panel.tsx` | 2354 |",
     "| `src/components/editor/properties-panel.tsx` | 2365 |"),
    ("| `src/lib/editor.ts` | 1257 |",
     "| `src/lib/editor.ts` | 1263 |"),
])

# --- The §11 registration tails (appended to the three rows' ends) ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
reg_subs = [
    # editor-view: the S161-A registration + the S161-B delivery
    ("the X→Y→X back-navigation adoption preserved)) |",
     "the X→Y→X back-navigation adoption preserved)) + THE PAGEHIDE OUT-OF-ORDER REGISTRATION (S161-A / L161-A-L1 — the honest-limits completion: the pagehide keepalive PUT's out-of-order residual named at the seam — an edit landing inside the machine PUT's round-trip plus an instant close plus server reordering can regress the server to the older state, the residual the S86-A flightDone chain cannot reach at a synchronous listener; the same-reference skip alternative named UNSOUND (S61-I's observed-live teardown cancellation — the duplicate IS the safety net)) + THE INSERT-SHAPE KEYBOARD SURFACE (S161-B — the S160-C registered candidate follow-up DELIVERED, the working-superset doctrine: the global keydown's Insert branch inserts a default-sized element of the ACTIVE DRAW TOOL's type at the canvas viewport CENTER through the store's own addElements seam — the ELEMENT_LIMIT honest refusal + the selection commit by construction; the S123-A gesture stand-down covers the branch by placement) |"),
    # properties-panel: the S161-D picker tokens
    ("the membership pinned at every seam). |",
     "the membership pinned at every seam) + THE COLOR-PICKER GESTURE TOKENS (S161-D / I161-A-I2 — every picker swatch surface rode the ONE default \"text\" gesture token while the sliders carry per-input S126-B tokens; each picker surface now carries its own — the HexColorRow's label-derived picker:<label> (one JSX site covering its four consumers) and the gradient stop's per-stop token — a future non-modal picker no longer re-opens the stale-release class). |"),
    # editor.ts: the S161-B shortcuts-inventory member
    ("every field the row builder's clamps admit) |",
     "every field the row builder's clamps admit) + THE INSERT-SHAPE SHORTCUTS-INVENTORY MEMBER (S161-B — the EDITOR_SHORTCUTS Editing group gains the Insert shape / Ins entry so the help dialog's inventory advertises what the handler wires, the single-source doctrine). |"),
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

# --- The §7.1 row for the s161 spec (inserted after the s160 row). ------------
text = pad.read_text()
row = (
    "| Unit — THE PAGEHIDE OUT-OF-ORDER REGISTRATION + INSERT-SHAPE KEYBOARD SURFACE + PICKER GESTURE TOKENS PASS (the one-hundred-and-ninth audit's chosen work, the auditors' census A 0C/0H/0M/1L/2I + B 0C/0H/0M/0L/1I, every finding lead-verified live at its seams with two suggested-fix corrections): S161-A — the pagehide out-of-order registration (L161-A-L1, the S86-A out-of-order class's real-unload member, unregistered: the pagehide keepalive PUT fires whenever saveState !== \"saved\" — including \"saving\" with the machine's PUT1 in flight — with no ordering chain; the auditor's suggested same-reference skip CORRECTED as UNSOUND by the lead (S61-I's observed-live teardown cancellation means the duplicate IS the safety net); the honest remediation: the S61-I honest-limits comment's list gains the out-of-order member, zero PUT-logic change) + S161-B — the insert-shape keyboard surface (the S160-C registered candidate follow-up, DELIVERED — the working-superset doctrine: the global keydown's Insert branch — a default-sized element of the ACTIVE DRAW TOOL's type (rectangle/ellipse/frame/line; rectangle when a non-draw tool is active) at the canvas viewport CENTER, the inverse of the canvas's own pointer transform, through the store's addElements seam with the ELEMENT_LIMIT honest refusal and the selection commit by construction; the S123-A gesture stand-down covers the branch by placement; the EDITOR_SHORTCUTS Editing entry so the dialog advertises what the handler wires; editor-view.tsx 2371 → 2432, editor.ts 1257 → 1263) + S161-C — the canvas line-height floor registration (I161-A-I1, with the lead's correction of the family framing: the three sibling surfaces carry three different forms BY DESIGN — the SVG-viewport minimums, the bare endpoint, the DOM-STYLE 0-floor retained as the client mirror of the server's own 0-floor; zero source change) + S161-D — the color-picker gesture tokens (I161-A-I2 — the cycle's chosen closure: the HexColorRow's label-derived picker:<label> at both the tick and the blur finish plus the gradient stop's per-stop token, the S126-B per-input form reaching the picker family; the nine prior-spec pins riding the F140 re-anchor riders; properties-panel.tsx 2354 → 2365) + S161-E — the vitest isolate registration (I161-B-I1 — the runner's own reporter output: 222 workers at ~86ms each, ~18.97s of the 28.5s wall time; the hermetic per-file module registry retained as the SAFE default for a source-contract-pin suite; zero config change) + S161-F the per-session pin family (16 pins: 11 RED incl. the pair-unity RED-until-collateral / 5 survival; ONE spec-form repair at birth — the registration-note phrase-case onto the notes' own all-caps spellings (the s156 F143 precedent's class); the F138 guard's ELEVENTH instance riding the survival form — the s160 plan's record pinned 8/8 ticked per the pre-armed session_345 directive; THE F138 GUARD'S ELEVENTH VERIFICATION PASSED — the s160 plan 8/8 at its own delivery commit 78df96ee, the forward form held a tenth consecutive cycle) and the collateral family (the count-family re-anchor 2243 = 2227 + 16 unit / 223 files; the nine picker-token F140 riders on color-coalesce-s66/lows-s105; the s159 §11 viewRow figure rider 2371 → 2432; the s156/s157/s158 layer-total hard pins' F140 re-anchor rider onto 14,268 — the s160 14,095→14,190 precedent at the layer family; the s151..s160 SKILL-version pins onto v1.139.0; the s154..s160 forward-guard rolling re-anchors onto v1.140.0 — the guard family's seventh through first rolling instances; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) | `tests/lows-s161.test.ts` | 16 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s160.test.ts` | 17 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s160 §7.1 anchor row not found")
if "`tests/lows-s161.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s161 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-161 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The pagehide-registration + insert-shape-delivery + picker-token seams (session 161, "
    "S161-A..S161-F — the one-hundred-and-ninth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/1L/2I + B 0C/0H/0M/0L/1I, every finding lead-verified live at its seams):** (a) "
    "THE PAGEHIDE OUT-OF-ORDER REGISTRATION (L161-A-L1, the S86-A out-of-order class's "
    "real-unload member, unregistered until now): the pagehide keepalive PUT fires whenever "
    "saveState !== \"saved\" — including \"saving\" with the machine's PUT1 in flight — with no "
    "ordering chain, and an edit landing inside PUT1's round-trip plus an instant close plus "
    "server reordering can regress the server to the older state; THE LEAD'S CORRECTION of the "
    "auditor's suggested fix: the S71-B-style same-reference skip is UNSOUND at this seam — "
    "S61-I's own observed-live teardown cancellation means the \"byte-identical duplicate\" IS "
    "the safety net carrying the state through the unload, so skipping it regresses the S61-I "
    "edit-loss the guard removal itself fixed; the honest remediation is the registration "
    "(the S61-I honest-limits comment's list gains the out-of-order member — the residual the "
    "S86-A flightDone chain cannot reach at a synchronous listener; the pinned transport forms "
    "untouched); (b) THE INSERT-SHAPE KEYBOARD SURFACE (the S160-C registered candidate "
    "follow-up, DELIVERED — the working-superset doctrine): the global keydown's Insert branch "
    "inserts a default-sized element of the ACTIVE DRAW TOOL's type (rectangle/ellipse/frame/"
    "line; rectangle when a non-draw tool is active) at the canvas viewport CENTER — the "
    "inverse of the canvas's own pointer transform — through the store's addElements seam (the "
    "ELEMENT_LIMIT honest refusal + the selection commit by construction); the S123-A gesture "
    "stand-down covers the branch by placement; Insert is single-key (passes the modifier "
    "bail) and unmapped; the EDITOR_SHORTCUTS Editing entry keeps the dialog's inventory "
    "advertising what the handler wires; (c) the canvas line-height floor RETAINED as "
    "defense-in-depth (I161-A-I1, with the lead's correction of the family framing — the "
    "PresentOverlay/CanvasThumbnail Math.max(h, 1) forms are SVG-VIEWPORT minimums, "
    "export-png's y2 renders a bare endpoint, the canvas's 0-floor is the DOM-STYLE client "
    "mirror of the server's own 0-floor: three surfaces, three forms BY DESIGN); (d) the "
    "per-surface picker gesture tokens (I161-A-I2 — the cycle's chosen closure): every picker "
    "swatch surface rode the ONE default \"text\" gesture token while the sliders carry "
    "per-input S126-B tokens; each picker surface now carries its own — the HexColorRow's "
    "label-derived picker:<label> (one JSX site covering its four consumers) and the gradient "
    "stop's per-stop token — the S126-B form reaching the picker family; (e) the vitest "
    "isolate posture RETAINED (I161-B-I1 — the runner's own reporter output: 222 workers at "
    "~86ms each; the hermetic per-file module registry is the SAFE default for a "
    "source-contract-pin suite). Pinned by `tests/lows-s161.test.ts` (16 pins: 11 RED incl. "
    "the pair-unity RED-until-collateral / 5 survival; ONE spec-form repair at birth — the "
    "registration-note phrase-case onto the notes' own all-caps spellings; the count-family "
    "re-anchor 2243 = 2227 + 16 unit / 223 files — the family's live anchor; the 22-file "
    "layer at 14,268 — the third movement since S155: editor-view +61, properties-panel +11, "
    "editor +6).\n"
)
marker = "- **The guarded-restore + keyboard-superset + draw-creation-registration seams (session 160,"
if "`tests/lows-s161.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s160 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-161 bullet inserted")
else:
    print("AGENTS.md: session-161 bullet already present")

# --- The F140 prior-spec re-anchor riders -------------------------------------
# (1) the nine picker-token pins onto the per-surface spelling (the prior
#     claims stay TRUE at the current tree — the tick still fires before
#     the commit, the blur still finishes the burst; the spelling moves
#     with the seam onto the picker family's own tokens).
patch("tests/color-coalesce-s66.test.ts", [
    ("    expect(swatch![0]).toMatch(/sliderGesture\\.textTick\\(\\)/);",
     "    expect(swatch![0]).toMatch(/sliderGesture\\.textTick\\(`picker:/);"),
    ('    const tickIdx = swatch![0].indexOf("sliderGesture.textTick()");',
     '    const tickIdx = swatch![0].indexOf("sliderGesture.textTick(`picker:");'),
    ("    expect(stop![0]).toMatch(/sliderGesture\\.textTick\\(\\)/);",
     "    expect(stop![0]).toMatch(/sliderGesture\\.textTick\\(`picker:Stop/);"),
    ('    const tickIdx = stop![0].indexOf("sliderGesture.textTick()");',
     '    const tickIdx = stop![0].indexOf("sliderGesture.textTick(`picker:Stop");'),
    ("    expect(stop![0]).toMatch(/onBlur=\\{\\(\\) => sliderGesture\\.finish\\(\"text\"\\)\\}/);",
     "    expect(stop![0]).toMatch(/onBlur=\\{\\(\\) => sliderGesture\\.finish\\(`picker:Stop/);"),
])
patch("tests/lows-s105.test.ts", [
    ('    const tickIdx = swatch![0].indexOf("sliderGesture.textTick()");',
     '    const tickIdx = swatch![0].indexOf("sliderGesture.textTick(`picker:");'),
    ('    const tickIdx = stop![0].indexOf("sliderGesture.textTick()");',
     '    const tickIdx = stop![0].indexOf("sliderGesture.textTick(`picker:Stop");'),
    ("    expect(w).toMatch(/sliderGesture\\.textTick\\(\\)/);",
     "    expect(w).toMatch(/sliderGesture\\.textTick\\(`picker:/);"),
    ("    expect(w).toMatch(/onBlur=\\{\\(\\) => sliderGesture\\.finish\\(\"text\"\\)\\}/);",
     "    expect(w).toMatch(/onBlur=\\{\\(\\) => sliderGesture\\.finish\\(`picker:/);"),
])

# (2) the s159 §11 viewRow figure pin onto the new figure (the row
#     re-anchor claim stays TRUE — the pinned figure moves with the row).
patch("tests/lows-s159.test.ts", [
    ('    expect(viewRow).toContain("| 2371 |");',
     '    expect(viewRow).toContain("| 2432 |");'),
])

# (3) the s156/s157/s158 layer-total hard pins onto the new figure
#     (the rider's precedent: the s159 14,077→14,095 and s160
#     14,095→14,190 re-anchors — the CLAIM stays true, the pinned
#     figure moves).
for name in ("tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts"):
    patch(name, [
        ("expect(liveLayerTotal).toBe(14190);",
         "expect(liveLayerTotal).toBe(14268);"),
    ])

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s160 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.138\\.0" in text:
        text = text.replace("version: 1\\.138\\.0", "version: 1\\.139\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.139.0)")
    elif "version: 1\\.139\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s160 forward count-truth guards' rolling re-anchors
# (v1.139.0 -> v1.140.0 — the s154 guard's SEVENTH rolling instance,
#     the s155 guard's SIXTH, the s156 guard's FIFTH, the s157 guard's
#     FOURTH, the s158 guard's THIRD, the s159 guard's SECOND, the s160
#     guard's FIRST) — the F140 rider at the count-truth guard family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.139.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.140.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.139\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.140\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.139.0 -> v1.140.0)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2227";' in text:
        assert text.count('const UNIT = "2227";') == 1
        text = text.replace('const UNIT = "2227";', 'const UNIT = "2243";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2243";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "222";' in text:
        assert text.count('const FILES = "222";') == 1
        text = text.replace('const FILES = "222";', 'const FILES = "223";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "223";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")

# --- The MISSED-RIDER batch (surfaced by the full unit gate on the first -----
# --- post-doc run — the s160 precedent's own shape: the gate working as -------
# --- intended; every rider below re-anchors a prior-spec pin whose claim -------
# --- stays TRUE at the current tree) --------------------------------------------
# (4) the color-coalesce-s66 SWATCH finish pin (the second site the first
#     pass missed — the swatch region's own blur-terminal regex, the
#     twin of the :90 stop form the first batch carried).
patch("tests/color-coalesce-s66.test.ts", [
    ("    expect(swatch![0]).toMatch(/onBlur=\\{\\(\\) => sliderGesture\\.finish\\(\"text\"\\)\\}/);",
     "    expect(swatch![0]).toMatch(/onBlur=\\{\\(\\) => sliderGesture\\.finish\\(`picker:/);"),
])

# (5) the client-lows-s79 hex-row window widened — the S161-D registration
#     comment (~530 chars) sits between the row's head and the hex text
#     input's onBlur; 8000 -> 8600 (the S102-B legitimate-widening
#     convention, the row's own fifth widening).
patch("tests/client-lows-s79.test.ts", [
    ("    const body = panel.slice(start, start + 8000);",
     "    const body = panel.slice(start, start + 8600);"),
])

# (6) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s160 cycle's own rider form,
#     its second instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.139.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.140.0",'),
])
