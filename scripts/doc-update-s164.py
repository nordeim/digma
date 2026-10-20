#!/usr/bin/env python3
"""The session-164 docs update: the count-family re-anchor (2287 = 2270 + 17
unit / 226 files across every live claim site), the LAYER-TOTAL family
STAYING at 14,295 (the second consecutive STAYS cycle — all five
client-layer rewords keep zero line-count drift; NO s156/s157/s158 rider
this cycle), the §7.1 row for the s164 spec, the §11 registration tails
(four client-layer rows at UNCHANGED figures + rate-limit.ts 190 -> 191,
the ONLY line-count movement) with the S164 registrations, the AGENTS
session-164 bullet (carrying the S164-A cross-file citation reword +
the S164-B census-scoping/rounded-display reword + the S164-C honest
projects-POST census), the F140 prior-spec re-anchor rider (the
lows-s163 "NON-creation" pin onto the S164-C delivered census form —
this cycle's only prior-spec rider), the prior-spec forward-guard
ROLLING re-anchors (the s154..s163 count-truth guards' version
literals onto v1.143.0), the s151..s163 SKILL-version pins onto
v1.142.0, the s158 title pin onto v1.143.0, and the spec-constants
re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-146..163 bullets' own count
records, the v1.125.0..v1.142.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s164.py
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
    ("| Unit tests (2270 checks) | `bun run test` |",
     "| Unit tests (2287 checks) | `bun run test` |"),
    ("`bun run test` (2270) → `bun run build`",
     "`bun run test` (2287) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker, riding
    # the s152 bullet's tail — the F106 live-claim classification)
    ("the count-family re-anchor 2270 = 2257 + 13 unit / 225 files (the family's live anchor)",
     "the count-family re-anchor 2287 = 2270 + 17 unit / 226 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2270 checks, Vitest) |",
     "| `bun run test` | Unit tests (2287 checks, Vitest) |"),
    ("(2270 unit / 73 smoke / 262 e2e)",
     "(2287 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2270 checks):",
     "- **Unit Tests** (Vitest, 2287 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2270 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2287 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2270 checks on the pure domain seams",
     "bun run test              # unit tests — 2287 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2270 unit checks green',
     'project_state: "2287 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2270 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2287 checks;"),
    ("bun run test          # 2270/2270",
     "bun run test          # 2287/2287"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **225 files** | **2270** | | Vitest |",
     "| **Unit total** | **226 files** | **2287** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2270/2270",
     "- [ ] `bun run test` → 2287/2287"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2270 checks / 225 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2287 checks / 226 files) |"),
])

# --- The §11 registration tails (appended to the five rows' ends; the
# --- rate-limit row's figure 190 -> 191 — the ONLY movement) ------------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
reg_subs = [
    # rate-limit: the S164-C honest-census reword (figure 190 -> 191)
    ("| `src/lib/rate-limit.ts` | 190 |",
     "| `src/lib/rate-limit.ts` | 191 |"),
    ("the ~31 burn arithmetic unchanged, the mechanism honestly named; rate-limit.ts STAYS 190, zero line-count drift) |",
     "the ~31 burn arithmetic unchanged, the mechanism honestly named; rate-limit.ts STAYS 190, zero line-count drift) + THE NON-CREATION CENSUS REWORD (S164-C / B164-L1 — the B163-L1 echo, the phantom-census class recurring inside its own fix: the delivered \"NON-creation pass-throughs/delays\" phrase was FALSE at one of the ten pass-through sites — editor-integrity.spec.ts:118 delays the project-CREATE POST by 400ms and continues it to the real server, ONE of the five crud-bucket creation routes burning one token per run (the s163 record's census misread the site as a projects-GET interception — the URL glob looks like the collection route, but the handler branches on POST); the parenthetical reworded onto the honest census (the elements-PUTs bucket-excluded; one delayed projects-POST creation DOES burn a crud token per run), one fulfill-mock, one external abort; rate-limit.ts 190 -> 191, the ONLY line-count movement this cycle; the F140 rider re-anchoring the lows-s163 \"NON-creation\" pin onto the delivered census form) |"),
    # editor-view: the S164-A cross-file citation + S164-D historical-coordinate rewords
    ("the frozen records staying frozen per S132-C with the bracketed s162-phantom-freehand-note the standing correction)) |",
     "the frozen records staying frozen per S132-C with the bracketed s162-phantom-freehand-note the standing correction)) + THE CROSS-FILE CITATION + HISTORICAL-COORDINATE REWORDS (S164-A/S164-D — A164-L-1 + A164-I-1: the Insert center math's citation reworded onto the seam-named form \"(canvas.tsx's toCanvas)\" — the function-stable referent immune to insertions in either file, the F150 doctrine's cross-file extension, the numeric \":141-142\" coordinate gone; the S48-2 mobile-wrap comment's session-48-era \"(L413)\"/\"(L493)\" coordinates dropped — unverifiable at the live tree, the measurements staying frozen in the e2e spec header and the s48 records; editor-view.tsx STAYS 2,453, zero line-count drift) |"),
    # properties-panel: the S164-B census-scoping reword + the A164-I-4 posture
    ("each picker surface now carries its own — the HexColorRow's label-derived picker:<label> (one JSX site covering its four consumers) and the gradient stop's per-stop token — a future non-modal picker no longer re-opens the stale-release class). |",
     "each picker surface now carries its own — the HexColorRow's label-derived picker:<label> (one JSX site covering its four consumers) and the gradient stop's per-stop token — a future non-modal picker no longer re-opens the stale-release class) + THE CENSUS-SCOPING REWORD (S164-B — A164-L-2: the S113-B registration's \"the seam's own census stays ELEVEN\" scoped onto the file-local reading — \"the panel's own census stays ELEVEN\" — patchDiffers carries THIRTEEN app-wide production call sites (11 panel + editor-store + ai-assistant.tsx), the A139-I1 census-scoping form; the A164-I-4 gradient-stop index-key posture registered in the bracketed s164 note — bounded impact, a composite key would collide on duplicate stops; properties-panel.tsx STAYS 2,365, zero line-count drift). |"),
    # app-header: the S164-A test-name citation reword
    ("the user slot renders the REAL NAME — the reference's own slot is the static literal \"Designer\" (RA-40), the clone's is the documented working superset |",
     "the user slot renders the REAL NAME — the reference's own slot is the static literal \"Designer\" (RA-40), the clone's is the documented working superset + THE TEST-NAME CITATION REWORD (S164-A — A164-I-2: the bell popover's \"(workspace.spec.ts:94)\" re-cited by test name — \"the workspace.spec bell-Escape test\" — the referent stable under spec-file insertions; app-header.tsx STAYS 304, zero line-count drift) |"),
    # lib/editor: the S164-B rounded-display arithmetic reword
    ("THE INSERT-SHAPE SHORTCUTS-INVENTORY MEMBER (S161-B — the EDITOR_SHORTCUTS Editing group gains the Insert shape / Ins entry so the help dialog's inventory advertises what the handler wires, the single-source doctrine). |",
     "THE INSERT-SHAPE SHORTCUTS-INVENTORY MEMBER (S161-B — the EDITOR_SHORTCUTS Editing group gains the Insert shape / Ins entry so the help dialog's inventory advertises what the handler wires, the single-source doctrine) + THE ROUNDED-DISPLAY ARITHMETIC REWORD (S164-B — A164-I-3: the cornerRadiusMax doc's false-as-written \"= 23.366/2\"/\"= 117/2\" forms reworded onto the unrounded halves — \"= the unrounded 23.36596.../2 (the prose dims are rounded displays)\" — the displayed aria values are halves of the UNROUNDED dimensions while the prose dims are rounded displays; the implemented formula untouched; editor.ts STAYS 1,263, zero line-count drift). |"),
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
print(f"Project_Architecture_Document.md: {applied_regs} §11 registration tails applied (rate-limit 190 -> 191)")

# --- The §7.1 row for the s164 spec (inserted after the s163 row). ------------
text = pad.read_text()
row = (
    "| Unit — THE CROSS-FILE CITATION + CENSUS-SCOPING + HONEST-CENSUS COMMENT-TRUTH PASS (the one-hundred-and-twelfth audit's chosen work, the auditors' census A 0C/0H/0M/2L/4I + B 0C/0H/0M/1L/0I, every finding lead-verified live at its seams): S164-A — the cross-file citation + test-name citation reword (A164-L-1 + A164-I-2: the Insert center math's \"(canvas.tsx :141-142)\" numeric CROSS-FILE citation reworded onto the seam-named form \"(canvas.tsx's toCanvas)\" — the function-stable referent immune to insertions in either file; the bell popover's \"(workspace.spec.ts:94)\" re-cited by test name; zero line-count drift) + S164-B — the census-scoping + rounded-display reword (A164-L-2 + A164-I-3: the S113-B registration's \"the seam's own census stays ELEVEN\" scoped onto the panel-local reading — patchDiffers carries THIRTEEN app-wide call sites; the cornerRadiusMax doc's false-as-written \"= 23.366/2\" arithmetic reworded onto the unrounded halves — the prose dims are rounded displays; zero line-count drift) + S164-C — the NON-creation census reword (B164-L1, the B163-L1 echo: the delivered \"NON-creation pass-throughs/delays\" phrase FALSE at one of the ten pass-through sites — editor-integrity.spec.ts:118 delays the project-CREATE POST and continues it to the server, one of the five crud-bucket creation routes burning one token per run; the parenthetical reworded onto the honest census; rate-limit.ts 190 -> 191, the ONLY movement; the F140 rider re-anchoring the lows-s163 pin) + S164-D — the historical-coordinate drop (the session-48-era \"(L413)\"/\"(L493)\" coordinates gone from the S48-2 comment) + the A164-I-4 gradient-stop index-key posture registered + S164-E the per-session pin family (17 pins: 11 RED incl. the pair-unity RED-until-collateral / 6 survival; the F138 guard's FIFTEENTH instance riding the survival form — the s163 plan's record pinned 5/5 ticked at e004e57d per the pre-armed session_363 directive; THE F138 GUARD'S FOURTEENTH VERIFICATION PASSED — the s163 plan 5/5 at its own delivery commit e004e57d, the forward form held a thirteenth consecutive cycle) and the collateral family (the count-family re-anchor 2287 = 2270 + 17 unit / 226 files; the layer-total family STAYS at 14,295 — the second consecutive STAYS cycle, NO s156/s157/s158 rider; the s151..s163 SKILL-version pins onto v1.142.0; the s154..s163 forward-guard rolling re-anchors onto v1.143.0; the s158 title pin onto v1.143.0; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) | `tests/lows-s164.test.ts` | 17 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s163.test.ts` | 13 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s163 §7.1 anchor row not found")
if "`tests/lows-s164.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s164 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-164 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The cross-file-citation + census-scoping + honest-census comment-truth seams (session 164, "
    "S164-A..S164-E — the one-hundred-and-twelfth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/2L/4I + B 0C/0H/0M/1L/0I, every finding lead-verified live at its seams):** (a) "
    "THE CROSS-FILE CITATION REWORD (A164-L-1, the F150 family's cross-file member): "
    "editor-view.tsx:978's \"the canvas's own pointer transform (canvas.tsx :141-142)\" was a "
    "NUMERIC CROSS-FILE line citation — accurate today but falsified by any insertion above "
    "canvas.tsx:141, with neither file's maintainer seeing the break; reworded onto the "
    "seam-named form \"(canvas.tsx's toCanvas)\" — the function-stable referent; the bell "
    "popover's \"(workspace.spec.ts:94)\" re-cited by test name (\"the workspace.spec "
    "bell-Escape test\") — the A164-I-2 sibling, the same fragile numeric form across files; "
    "(b) THE CENSUS-SCOPING REWORD (A164-L-2, the A139-I1 form): the S113-B registration's "
    "\"the seam's own census stays ELEVEN\" was true only under the unstated file-local "
    "reading — patchDiffers carries THIRTEEN app-wide production call sites (11 panel + "
    "editor-store :454 + ai-assistant.tsx :403); scoped onto \"the panel's own census stays "
    "ELEVEN\"; the A164-I-3 sibling: the cornerRadiusMax doc's arithmetic false as written "
    "(\"11.68298487339743 = 23.366/2\" — 23.366/2 is 11.683), reworded onto the unrounded "
    "halves (the prose dims are rounded displays); (c) THE HONEST PROJECTS-POST CENSUS "
    "REWORD (B164-L1, the B163-L1 echo — the phantom-census class recurring inside its own "
    "fix): the S163-B delivered phrase \"NON-creation pass-throughs/delays\" was FALSE at "
    "one of the ten pass-through sites — editor-integrity.spec.ts:118 delays the "
    "project-CREATE POST by 400ms and continues it to the real server, ONE of the five "
    "crud-bucket creation routes burning one token per run (the s163 record's census "
    "misread the site as a projects-GET interception — the URL glob looks like the "
    "collection route, but the handler branches on POST); the parenthetical reworded onto "
    "the honest census (the elements-PUTs bucket-excluded; one delayed projects-POST "
    "creation DOES burn a crud token per run), rate-limit.ts 190 -> 191 — the ONLY "
    "line-count movement, the 22-file layer total STAYING at 14,295 (the second "
    "consecutive STAYS cycle); the F140 rider re-anchoring the lows-s163 \"NON-creation\" "
    "pin onto the delivered census form; (d) THE HISTORICAL-COORDINATE DROP (A164-I-1): "
    "the S48-2 mobile-wrap comment's session-48-era \"(L413)\"/\"(L493)\" coordinates — "
    "unverifiable at the live tree — dropped; the A164-I-4 gradient-stop index-key "
    "posture registered in the bracketed s164 note (bounded impact; a composite key would "
    "collide on duplicate stops). Pinned by `tests/lows-s164.test.ts` (17 pins: 11 RED "
    "incl. the pair-unity RED-until-collateral / 6 survival; the count-family re-anchor "
    "2287 = 2270 + 17 unit / 226 files — the family's live anchor; the 22-file layer at "
    "14,295 — the second consecutive STAYS-cycle form).\n"
)
marker = "- **The stale-citation + phantom-route-mock comment-truth seams (session 163,"
if "`tests/lows-s164.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s163 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-164 bullet inserted")
else:
    print("AGENTS.md: session-164 bullet already present")

# --- The F140 prior-spec re-anchor rider -------------------------------------
# (1) the lows-s163 "NON-creation" pin onto the S164-C delivered census form
#     (the prior claim's SPELLING moved with the seam — the pin rides the
#     delivered form, the s162/s163-cycle riders' own doctrine at the
#     census family).
patch("tests/lows-s163.test.ts", [
    ('    expect(collapsed(rateLimitSource)).toContain(\n      "NON-creation pass-throughs/delays",\n    );',
     '    expect(collapsed(rateLimitSource)).toContain(\n      "pass-throughs/delays (the elements-PUTs",\n    );\n    expect(collapsed(rateLimitSource)).toContain(\n      "one delayed projects-POST creation DOES burn a",\n    );'),
])

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s163 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.141\\.0" in text:
        text = text.replace("version: 1\\.141\\.0", "version: 1\\.142\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.142.0)")
    elif "version: 1\\.142\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s163 forward count-truth guards' rolling re-anchors
# (v1.142.0 -> v1.143.0 — the s154 guard's TENTH rolling instance,
#     the s155 guard's NINTH, the s156 guard's EIGHTH, the s157 guard's
#     SEVENTH, the s158 guard's SIXTH, the s159 guard's FIFTH, the s160
#     guard's FOURTH, the s161 guard's THIRD, the s162 guard's SECOND,
#     the s163 guard's FIRST) — the F140 rider at the count-truth
#     guard family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.142.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.143.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.142\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.143\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.142.0 -> v1.143.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s160..s163 cycle's own rider
#     form, its fifth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.142.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.143.0",'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2270";' in text:
        assert text.count('const UNIT = "2270";') == 1
        text = text.replace('const UNIT = "2270";', 'const UNIT = "2287";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2287";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "225";' in text:
        assert text.count('const FILES = "225";') == 1
        text = text.replace('const FILES = "225";', 'const FILES = "226";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "226";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
