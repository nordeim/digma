#!/usr/bin/env python3
"""The session-163 docs update: the count-family re-anchor (2270 = 2257 + 13
unit / 225 files across every live claim site), the LAYER-TOTAL family
STAYING at 14,295 (the first no-movement cycle since s155 — the two
rewords keep zero line-count drift; NO s156/s157/s158 rider this cycle),
the §7.1 row for the s163 spec, the §11 registration tails (two rows at
UNCHANGED figures — canvas.tsx stays 1,092, rate-limit.ts stays 190)
with the S163 registrations, the AGENTS session-163 bullet (carrying
the S163-A stale line-citation reword + the S163-B phantom route-mock
census reword), the F140 prior-spec re-anchor rider (the lows-s149
:503 pin onto the S163-A relative form — this cycle's only prior-spec
rider), the prior-spec forward-guard ROLLING re-anchors (the
s154..s162 count-truth guards' version literals onto v1.142.0), the
s151..s162 SKILL-version pins onto v1.141.0, the s158 title pin onto
v1.142.0, and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-146..162 bullets' own count
records, the v1.125.0..v1.141.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s163.py
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
    ("| Unit tests (2257 checks) | `bun run test` |",
     "| Unit tests (2270 checks) | `bun run test` |"),
    ("`bun run test` (2257) → `bun run build`",
     "`bun run test` (2270) → `bun run build`"),
    # the live-anchor paren phrase (the s152-cycle convention — the
    # family's rolling marker; the s162 bullet's paren form carries it)
    ("the count-family re-anchor 2257 = 2243 + 14 unit / 224 files (the family's live anchor)",
     "the count-family re-anchor 2270 = 2257 + 13 unit / 225 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2257 checks, Vitest) |",
     "| `bun run test` | Unit tests (2270 checks, Vitest) |"),
    ("(2257 unit / 73 smoke / 262 e2e)",
     "(2270 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2257 checks):",
     "- **Unit Tests** (Vitest, 2270 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2257 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2270 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2257 checks on the pure domain seams",
     "bun run test              # unit tests — 2270 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2257 unit checks green',
     'project_state: "2270 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2257 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2270 checks;"),
    ("bun run test          # 2257/2257",
     "bun run test          # 2270/2270"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **224 files** | **2257** | | Vitest |",
     "| **Unit total** | **225 files** | **2270** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2257/2257",
     "- [ ] `bun run test` → 2270/2270"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2257 checks / 224 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2270 checks / 225 files) |"),
])

# --- The §11 registration tails (appended to the two rows' ends, at
# --- UNCHANGED figures — the STAYS-cycle form) --------------------------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
reg_subs = [
    # canvas: the S163-A stale line-citation reword
    ("the S84-B teleport family's sixth member, the arm the family's five prior sweeps never named) |",
     "the S84-B teleport family's sixth member, the arm the family's five prior sweeps never named) + THE STALE LINE-CITATION REWORD (S163-A / L163-A-L1 — the two numeric in-file citations reworded onto the S160-D relative form: the S162-B comment block's own 6-line insertion had stale-dated the \":492\" draw-commit citation (born accurate against the pre-insertion file, then self-staled — the clamp pair lives at :498-499) and the S148-B marquee comment's \":503\" (accurate 14 cycles, staled — the gate lives at :509); both now name their referents relatively — \"the draw commit below\" / \"the commit above\" — immune to future insertions above; canvas.tsx STAYS 1,092, zero line-count drift) |"),
    # rate-limit: the S163-B phantom route-mock census reword
    ("the false \"ADR-009 in the inherited architecture\" parenthetical retired) |",
     "the false \"ADR-009 in the inherited architecture\" parenthetical retired) + THE PHANTOM ROUTE-MOCK CENSUS REWORD (S163-B / B163-L1 — the S73-A phantom-seam class: the S112-B crud-burn comment's \"route MOCKS, never server calls\" claim corrected onto the live 12-site census — 10 route.continue() pass-throughs on NON-creation routes (the PUT bucket-excluded by design), one fulfill-mock, one external abort; the ~31 burn arithmetic unchanged, the mechanism honestly named; rate-limit.ts STAYS 190, zero line-count drift) |"),
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

# --- The §7.1 row for the s163 spec (inserted after the s162 row). ------------
text = pad.read_text()
row = (
    "| Unit — THE STALE LINE-CITATION + PHANTOM ROUTE-MOCK COMMENT-TRUTH PASS (the one-hundred-and-eleventh audit's chosen work, the auditors' census A 0C/0H/0M/1L/0I + B 0C/0H/0M/1L/0I, every finding lead-verified live at its seams): S163-A — the stale line-citation reword (L163-A-L1, the numeric-locator member of the phantom-citation class: the S162-B comment block's own 6-line insertion at canvas.tsx:226-231 stale-dated every numeric in-file citation below it — the new comment's own \":492\" draw-commit citation born accurate then self-staled (the clamp pair at :498-499), the S148-B marquee comment's \":503\" accurate 14 cycles then staled (the gate at :509); both reworded onto the S160-D relative form — \"the draw commit below\" / \"the commit above\" — immune to future insertions above; zero line-count drift, canvas.tsx stays 1,092; the F140 rider re-anchoring the lows-s149 :503 pin onto the relative form) + S163-B — the phantom route-mock census reword (B163-L1, the S73-A phantom-seam class, the L162-A-L2 sibling: the S112-B crud-burn comment's \"route MOCKS, never server calls\" claim FALSE at the live tree — the census is 12 sites: 10 route.continue() pass-throughs to the real standalone server (several with injected delays), 1 fulfill-mock, 1 external abort; the defended ~31 arithmetic survives via the non-creation mechanism honestly named; zero line-count drift, rate-limit.ts stays 190) + S163-C the per-session pin family (13 pins: 8 RED incl. the pair-unity RED-until-collateral / 5 survival; the F138 guard's FOURTEENTH instance riding the survival form — the s162 plan's record pinned 6/6 ticked at ac277905 per the pre-armed session_357 directive; THE F138 GUARD'S THIRTEENTH VERIFICATION PASSED — the s162 plan 6/6 at its own delivery commit ac277905, the forward form held a twelfth consecutive cycle) and the collateral family (the count-family re-anchor 2270 = 2257 + 13 unit / 225 files; the layer-total family STAYS at 14,295 — the first no-movement cycle since s155, NO s156/s157/s158 rider; the s151..s162 SKILL-version pins onto v1.141.0; the s154..s162 forward-guard rolling re-anchors onto v1.142.0; the s158 title pin onto v1.142.0; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) | `tests/lows-s163.test.ts` | 13 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s162.test.ts` | 14 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s162 §7.1 anchor row not found")
if "`tests/lows-s163.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s163 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-163 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The stale-citation + phantom-route-mock comment-truth seams (session 163, "
    "S163-A..S163-C — the one-hundred-and-eleventh audit's chosen work, the auditors' census "
    "A 0C/0H/0M/1L/0I + B 0C/0H/0M/1L/0I, every finding lead-verified live at its seams):** (a) "
    "THE STALE LINE-CITATION REWORD (L163-A-L1, the numeric-locator member of the "
    "phantom-citation class): the S162-B comment block's own 6-line insertion at "
    "canvas.tsx:226-231 stale-dated every numeric in-file citation below it — the new "
    "comment's own \":492\" draw-commit citation was born accurate against the "
    "pre-insertion file then self-staled (the clamp pair lives at :498-499), and the "
    "S148-B marquee preview comment's \":503\" (accurate for 14 cycles) staled to :509; "
    "both reworded onto the RELATIVE form the same file already uses (the S160-D "
    "draw-preview precedent — \"the commit above\" with no number, precisely to dodge "
    "this class): \"the draw commit below\" / \"the commit above\" — immune to future "
    "insertions above; zero line-count drift (canvas.tsx stays 1,092; the 22-file layer "
    "total STAYS 14,295 — the first no-movement cycle since s155); the F140 rider "
    "re-anchors the lows-s149 \":503\" pin onto the relative form; (b) THE PHANTOM "
    "ROUTE-MOCK CENSUS REWORD (B163-L1, the S73-A phantom-seam class, the L162-A-L2 "
    "sibling): the S112-B crud-burn comment (rate-limit.ts:121-126) claimed \"the "
    "`page.route` interception sites in the specs are route MOCKS, never server calls\" — "
    "but the LIVE census is 12 sites: 10 route.continue() pass-throughs to the real "
    "standalone server (several with injected delays), 1 fulfill-mock, 1 external abort; "
    "the defended ~31 burn arithmetic survives via a different mechanism (none of the "
    "continued routes is one of the five creation POSTs — the PUTs bucket-excluded by "
    "design), now honestly named; the phantom phrase reworded onto the live census, "
    "zero line-count drift (rate-limit.ts stays 190). Pinned by "
    "`tests/lows-s163.test.ts` (13 pins: 8 RED incl. the pair-unity "
    "RED-until-collateral / 5 survival; ONE spec-form repair at the source-green pass — "
    "the marker-stripped doctrine-phrase form, the s158 spec-form lesson; the "
    "count-family re-anchor 2270 = 2257 + 13 unit / 225 files — the family's live "
    "anchor; the 22-file layer at 14,295 — the STAYS-cycle form).\n"
)
marker = "- **The insert-honest-completion + text-tool-sibling + phantom-correction seams (session 162,"
if "`tests/lows-s163.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s162 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-163 bullet inserted")
else:
    print("AGENTS.md: session-163 bullet already present")

# --- The F140 prior-spec re-anchor rider -------------------------------------
# (1) the lows-s149 :503 pin onto the S163-A relative form (the prior
#     claim stays TRUE at the current tree — the marquee comment still
#     cites the commit above; the citation's SPELLING moved with the
#     seam, the pin rides the delivered form — the s162-cycle rider's
#     own doctrine at the citation family).
patch("tests/lows-s149.test.ts", [
    ("    expect(collapsed(canvasSource)).toMatch(/the :503 commit above/);",
     "    expect(collapsed(canvasSource)).toMatch(\n      /\\(drag\\.w > 2 && drag\\.h > 2, the commit above\\)/,\n    );"),
])

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s162 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.140\\.0" in text:
        text = text.replace("version: 1\\.140\\.0", "version: 1\\.141\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.141.0)")
    elif "version: 1\\.141\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s162 forward count-truth guards' rolling re-anchors
# (v1.141.0 -> v1.142.0 — the s154 guard's NINTH rolling instance,
#     the s155 guard's EIGHTH, the s156 guard's SEVENTH, the s157 guard's
#     SIXTH, the s158 guard's FIFTH, the s159 guard's FOURTH, the s160
#     guard's THIRD, the s161 guard's SECOND, the s162 guard's FIRST) —
#     the F140 rider at the count-truth guard family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.141.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.142.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.141\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.142\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.141.0 -> v1.142.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s160..s162 cycle's own rider
#     form, its fourth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.141.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.142.0",'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2257";' in text:
        assert text.count('const UNIT = "2257";') == 1
        text = text.replace('const UNIT = "2257";', 'const UNIT = "2270";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2270";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "224";' in text:
        assert text.count('const FILES = "224";') == 1
        text = text.replace('const FILES = "224";', 'const FILES = "225";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "225";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
