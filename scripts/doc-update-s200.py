#!/usr/bin/env python3
"""doc-update-s200.py — the Session 200 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2757 = 2745 + 12 unit / 262 files across every
live claim site, the §7.1 row for the s200 spec, the AGENTS
session-200 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s199 count-truth guards' version literals onto v1.179.0),
the s151..s199 SKILL-version pins onto v1.178.0, the s158 title pin
onto v1.179.0, the s173..s199 per-spec title-pin riders onto v1.179.0
(the family's twenty-eighth member — the s199 spec's title pin
joining), the census-literal lockstep riders (the s185..s199 specs'
rg probes — fifteen members, s199 joining), and the spec-constants
re-anchor (the pair-unity family).

NO source-code fix this cycle — the BELOW-THRESHOLD form (zero
behavioral defect, zero comment-truth defect); the layer STAYS at
14,373 (no F40 rider).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s200.py
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

# --- README.md — the count rows ----------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2745 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2757 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2745 checks on the pure domain seams",
     "bun run test              # unit tests — 2757 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2745 checks) | `bun run test` |",
     "| Unit tests (2757 checks) | `bun run test` |"),
    ("`bun run test` (2745) → `bun run build`",
     "`bun run test` (2757) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the per-session bullets'
    # paren forms are FROZEN records)
    ("the collateral family — the count-family re-anchor 2745 = 2733 + 12 unit / 261 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2757 = 2745 + 12 unit / 262 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2745 checks, Vitest) |",
     "| `bun run test` | Unit tests (2757 checks, Vitest) |"),
    ("(2745 unit / 73 smoke / 262 e2e)",
     "(2757 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2745 checks):",
     "- **Unit Tests** (Vitest, 2757 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2745 unit checks green',
     'project_state: "2757 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2745 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2757 checks;"),
    ("bun run test          # 2745/2745",
     "bun run test          # 2757/2757"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **261 files** | **2745** | | Vitest |",
     "| **Unit total** | **262 files** | **2757** | | Vitest |"),
    ("- [ ] `bun run test` → 2745/2745",
     "- [ ] `bun run test` → 2757/2757"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2745 checks / 261 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2757 checks / 262 files) |"),
])

# --- The §7.1 row for the s200 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S200_ROW = (
    "| Unit — THE BELOW-THRESHOLD REGISTRATIONS + THE QUOTED-FORM-INHERITANCE LESSON (the one-hundred-and-forty-eighth audit's chosen work, the FOURTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — 0C/0H/0M/0L/6I, a BELOW-THRESHOLD cycle, the THIRD consecutive zero-Low census, zero behavioral source-code defect, zero comment-truth defect — the comment-truth census 223 sampled, 223 TRUE / 0 FALSE, the THIRD consecutive all-TRUE census, the largest sample yet; six informational members — one quoted-form label-precision catch (A-I-1 the brief's trap-3 label \"all four editor-* tokens defined and consumed\" — itself quoted verbatim from the s199 auditor record's own phrasing — imprecise for editor-text, the tree truth 3 of 4 consumed with --color-editor-text the S95-B defined-currently-unconsumed posture at 0 utility uses), three documented standing postures (A-I-2 the ten raw-fetch exceptions each documented per-seam; A-I-3 the components-panel no-op button — reference parity; B-I-2 the me route's 200 user-null introspection form), one docblock-symmetry gap (B-I-1 the team-rename PATCH route's :11 note — carried as a registered deferred-queue member), and one skill-side vocabulary nuance (B-I-3 the manual-guards seam vs the skill §7's Zod wording)): S200-A — THE REGISTRATION PAIR (the S187..S199 registration-cycle form): the s200-id-stable-premises-note at the 75th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its ELEVENTH full-cycle test, zero label drift again, the quoting form the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180; P1 the twelve-site value-based census at the post-S188-A coordinates; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s200-below-threshold-note (THE F187 LESSON — THE QUOTED-FORM-INHERITANCE MEMBER: the F185 quote-verbatim prescription's own completion — quoting a prior record's form verbatim protects against paraphrase drift but inherits the source record's own imprecision; born from the s200 catch: the s199 auditor record's trap-3 label carrying into the s200 brief's verbatim quote while the tree truth holds editor-text at the S95-B defined-unconsumed posture (the per-token counts editor-bg 15 / editor-panel 23 / editor-border 51 / editor-text 0); the guard: every quoted form that rides a brief is itself audited at the tree — a label is a claim wherever it appears, the verbatim form is not a truth certificate; where the source record's label proves imprecise, the catch registers as a label-precision gap in the record (the F186 record-gap form, never a defect claim against the quoting brief), the current-era fact registering beside the frozen record + the third all-TRUE comment-truth census registration (223 sampled / 223 TRUE / 0 FALSE) + the A-I-1 frozen-record label-precision registration + the B-I-1 docblock-symmetry registration + the thirtieth-generation carriers :2877/:2936/:3005 + the s199 row :2876 verified EXACT with the F174-corrected window :2852..:2876 = s175..s199 (25 rows) :2851 the s174 row :2850 the s173 row + the honest folder-level vocabulary-HOLD registration (fourteenth consecutive) + the dispatch-currency-honored registration (the EIGHTH steady-state cycle — the live HEAD 59852bc2 matching exactly) + the honest environment record — THE CONTINUATION FORM (the workspace intact, the git pull fast-forward 1a880d9f→59852bc2, the standing environment verified not rebuilt, the DB re-seeded pristine after the smoke drift) + the §8 letter posture carry (thirteenth consecutive) + the F138 FIFTY-FIRST instance) + S200-B the per-session pin family (12 pins: 5 RED — the doc-side collateral members / 7 green-at-birth — the two worklog-registration notes, the F138 guard's FIFTY-FIRST instance (the s199 plan's record pinned 4/4 ticked at f47eead0), the script-provenance member, the audit-entry members (both anchors at their standing spellings), the standing-figures member, the layer-STAYS member, the B-I-1 deferred-registration member; the MEASURED birth form — 5 RED / 7 green EXACT on the FIRST completed run (the apparent first-attempt timeout the known vitest worker-pool quirk — one GREEN-phase note-form correction en route: the below-threshold note's own teams id-param bracket form, the s159 note-internal-bracket truncation class caught at the birth run and fixed before the record); the constants born rolling-safe at the POST-spec figures 2757/262) and the collateral family (the count-family re-anchor 2757 = 2745 + 12 unit / 262 files; the spec-constants sweep 81 UNIT + 80 FILES with the census-literal lockstep riders for the s185..s199 specs' rg probes (fifteen members — s199 joining); the layer-total family STAYING at 14,373 — the below-threshold form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its twenty-sixth re-quote cycle; the env census figure 17 sites across 9 vars at the src/-wide scope, NAMED; the s151..s199 SKILL-version pins onto v1.178.0; the s154..s199 forward-guard rolling re-anchors onto v1.179.0; the s158 title pin onto v1.179.0; the s173..s199 per-spec title-pin riders onto v1.179.0 — the family's twenty-eighth member; e2e stays 262; smoke stays 73) | `tests/lows-s200.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s200.test.ts" not in pad_text:
    anchor = "| **Unit total** | **262 files** | **2757** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S200_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s200 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s200 §7.1 row already present")

# --- The AGENTS session-200 bullet (inserted above the s199 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The below-threshold registrations + the quoted-form-inheritance lesson (session 200, S200-A..S200-B — the one-hundred-and-forty-eighth Mode C audit's chosen work, the FOURTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/3I combined 0C/0H/0M/0L/6I, a BELOW-THRESHOLD cycle, the THIRD consecutive zero-Low census, zero behavioral source-code defect, zero comment-truth defect — the comment-truth census 223 sampled / 223 TRUE / 0 FALSE, the THIRD consecutive all-TRUE census, the largest sample yet; six informational members: one quoted-form label-precision catch (A-I-1 the brief's trap-3 label \"all four editor-* tokens defined and consumed\" — itself quoted verbatim from the s199 auditor record's own phrasing — imprecise for editor-text, the tree truth 3 of 4 consumed with --color-editor-text the S95-B defined-currently-unconsumed posture at 0 utility uses), three documented standing postures (A-I-2 the ten raw-fetch exceptions each documented per-seam; A-I-3 the components-panel no-op button — reference parity; B-I-2 the me route's 200 user-null introspection form), one docblock-symmetry gap (B-I-1 the team-rename PATCH route's :11 note — registered, carried as a deferred-queue member), and one skill-side vocabulary nuance (B-I-3 the manual-guards seam vs the skill §7's Zod wording)):** (a) S200-A THE REGISTRATION PAIR (the S187..S199 registration-cycle form): the s200-id-stable-premises-note at the 75th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its ELEVENTH full-cycle test, zero label drift again) + the s200-below-threshold-note (THE F187 LESSON — THE QUOTED-FORM-INHERITANCE MEMBER: the F185 quote-verbatim prescription's own completion — quoting a prior record's form verbatim protects against paraphrase drift but inherits the source record's own imprecision; born from the s200 catch: the s199 auditor record's trap-3 label carrying into the s200 brief's verbatim quote while the tree truth holds editor-text at the S95-B defined-unconsumed posture (the per-token counts editor-bg 15 / editor-panel 23 / editor-border 51 / editor-text 0); the guard: every quoted form that rides a brief is itself audited at the tree — a label is a claim wherever it appears, the verbatim form is not a truth certificate; where the source record's label proves imprecise, the catch registers as a label-precision gap in the record (the F186 record-gap form, never a defect claim against the quoting brief), the current-era fact registering beside the frozen record + THE THIRD ALL-TRUE COMMENT-TRUTH CENSUS REGISTRATION (223 sampled / 223 TRUE / 0 FALSE — 151 client-layer + 72 route/lib) + THE A-I-1 FROZEN-RECORD LABEL-PRECISION REGISTRATION (the current-era per-token counts 15/23/51/0 registered, the frozen s199 record untouched) + THE B-I-1 DOCBLOCK-SYMMETRY REGISTRATION (the team-rename PATCH route's site-level note named at its seam :11, carried as a deferred-queue member — the honest form under the below-threshold zero-source-change discipline) + the thirtieth-generation carriers :2877/:2936/:3005 + the s199 row :2876 verified EXACT with the F174-corrected window :2852..:2876 = s175..s199 (25 rows), :2851 the s174 row, :2850 the s173 row + the honest folder-level vocabulary-HOLD registration (fourteenth consecutive) + the dispatch-currency-honored registration (the EIGHTH steady-state cycle) + the honest environment record — THE CONTINUATION FORM this cycle (the workspace intact, the git pull fast-forward 1a880d9f→59852bc2, the standing environment verified not rebuilt — the DB re-seeded pristine after the smoke drift, the trap guarded from the first call)); (b) S200-B the 12-pin spec (5 RED / 7 green-at-birth EXACT on the FIRST completed run — one GREEN-phase note-form correction en route: the below-threshold note's own teams id-param bracket form, the s159 note-internal-bracket truncation class caught at the birth run and fixed before the record; the constants born rolling-safe at 2757/262) with the collateral family (the count-family re-anchor 2757 = 2745 + 12 unit / 262 files (the family's live anchor); the layer-total family STAYING at 14,373 (the below-threshold form — no F40 rider needed); the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars at the src/-wide scope, NAMED; the elements-route figure 420 unchanged — its twenty-sixth re-quote cycle; the F138 guard's FIFTY-FIRST instance — the s199 plan 4/4 ticked at f47eead0, the sweep s151..s199 at 49 plans 266/0; the 176th reference audit NO DRIFT with the clip byte-identical the 137th consecutive session; mobile nav 9/9 the 177th session; pins S128..S199 949/949 across 72).\n"
)
if "session 200, S200-A..S200-B" not in agents_text:
    anchor = "- **The below-threshold registrations + the derivation-method lesson (session 199"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-200 bullet inserted")
else:
    print("AGENTS.md: session-200 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s199 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 200):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.177\\.0" in text:
        text = text.replace("version: 1\\.177\\.0", "version: 1\\.178\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.178.0)")
    elif "version: 1\\.178\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.177.0")' in text:
        # the s181/s182/s183/s184 specs' toContain literal form (the spec
        # pins the version line by substring — the rolling re-anchor at
        # the literal level)
        text = text.replace('toContain("1.177.0")', 'toContain("1.178.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.177.0")' in text:
        # the s185..s199 specs' fuller toContain form (the version-line substring
        # with the field prefix — the rolling re-anchor at the literal layer)
        text = text.replace('toContain("version: 1.177.0")', 'toContain("version: 1.178.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.178.0")' in text or 'toContain("version: 1.178.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s199 forward count-truth guards' rolling re-anchors
# (v1.178.0 -> v1.179.0 — the s154 guard's FORTY-SEVENTH rolling
#     instance, the s155 guard's FORTY-SIXTH, ..., the s199 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 200):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.178.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.179.0 PAD block quotes for the layer total (the"),
        ("    /v1\\.178\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,",
         "    /v1\\.179\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.178.0 -> v1.179.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its fortieth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.178.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.179.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s199 — the
#     s199 spec's title pin joining as the TWENTY-EIGHTH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.178\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.179\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.178.0");',
         '    expect(lastUpdated).toContain("v1.179.0");'),
    ])

# (3b) the s185 + s186 + s187 + s188 + s189 + s190 + s191 + s192 + s193 + s194 + s195 + s196 + s197 + s198 + s199
#      specs' title-pin forms (the SIXTEENTH..TWENTY-EIGHTH members' own shape —
#      the toMatch single-line form, not the two-line rider form above):
for nn in (185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.178\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.179\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.178.0");',
         'expect(lastUpdated).toContain("v1.179.0");'),
    ])

# --- the census-literal lockstep rider (the s185..s199 specs' rg-census probes) -------
# The s185..s199 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s200
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
for spec_name in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts", "tests/lows-s187.test.ts", "tests/lows-s188.test.ts", "tests/lows-s189.test.ts", "tests/lows-s190.test.ts", "tests/lows-s191.test.ts", "tests/lows-s192.test.ts", "tests/lows-s193.test.ts", "tests/lows-s194.test.ts", "tests/lows-s195.test.ts", "tests/lows-s196.test.ts", "tests/lows-s197.test.ts", "tests/lows-s198.test.ts", "tests/lows-s199.test.ts"):
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2745"', '"2757"').replace('"261"', '"262"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(80);", "expect(unitFiles).toBe(81);"),
        ("expect(filesFiles).toBe(79);", "expect(filesFiles).toBe(80);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 80/79 -> 81/80)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2745";' in text:
        assert text.count('const UNIT = "2745";') == 1
        text = text.replace('const UNIT = "2745";', 'const UNIT = "2757";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2757";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "261";' in text:
        assert text.count('const FILES = "261";') == 1
        text = text.replace('const FILES = "261";', 'const FILES = "262";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "262";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
