#!/usr/bin/env python3
"""doc-update-s201.py — the Session 201 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2770 = 2757 + 13 unit / 263 files across every
live claim site, the §7.1 row for the s201 spec, the AGENTS
session-201 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s200 count-truth guards' version literals onto v1.180.0),
the s151..s200 SKILL-version pins onto v1.179.0, the s158 title pin
onto v1.180.0, the s173..s200 per-spec title-pin riders onto v1.180.0
(the family's twenty-ninth member — the s200 spec's title pin
joining), the census-literal lockstep riders (the s185..s200 specs'
rg probes — sixteen members, s200 joining), and the spec-constants
re-anchor (the pair-unity family).

The CT-1 fix is DOC-SIDE ONLY this cycle (the README Troubleshooting
AUTH_SECRET rotation row — zero src/ changes); the layer STAYS at
14,373 (no F40 rider).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s201.py
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
    ("| Unit tests | Vitest | 5 | 2757 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2770 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2757 checks on the pure domain seams",
     "bun run test              # unit tests — 2770 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2757 checks) | `bun run test` |",
     "| Unit tests (2770 checks) | `bun run test` |"),
    ("`bun run test` (2757) → `bun run build`",
     "`bun run test` (2770) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the per-session bullets'
    # paren forms are FROZEN records)
    ("the collateral family — the count-family re-anchor 2757 = 2745 + 12 unit / 262 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2770 = 2757 + 13 unit / 263 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2757 checks, Vitest) |",
     "| `bun run test` | Unit tests (2770 checks, Vitest) |"),
    ("(2757 unit / 73 smoke / 262 e2e)",
     "(2770 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2757 checks):",
     "- **Unit Tests** (Vitest, 2770 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2757 unit checks green',
     'project_state: "2770 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2757 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2770 checks;"),
    ("bun run test          # 2757/2757",
     "bun run test          # 2770/2770"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **262 files** | **2757** | | Vitest |",
     "| **Unit total** | **263 files** | **2770** | | Vitest |"),
    ("- [ ] `bun run test` → 2757/2757",
     "- [ ] `bun run test` → 2770/2770"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2757 checks / 262 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2770 checks / 263 files) |"),
])

# --- The §7.1 row for the s201 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S201_ROW = (
    "| Unit — THE CT-1 POINTER FIX + THE POINTER-FOLLOWING REGISTRATIONS (the one-hundred-and-forty-ninth audit's chosen work, the FIFTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — 0C/0H/0M/1L/6I, THE FIRST LOW-CARRYING CENSUS SINCE SESSION 197 (the three-cycle zero-Low streak ending), zero behavioral source-code defect, ONE comment-truth defect — the CT-1 stale pointer (auth.ts:28's README-troubleshooting cross-reference: the rotation FACT true, the POINTER false, the row never existing at any commit — a birth-era stale pointer); the comment-truth census 253 sampled, 252 TRUE / 1 FALSE, the largest sample yet, the all-TRUE streak ending at three; seven members — one comment-truth Low (CT-1), two label-precision catches (A-I-1/CT-2 the s200 record's ten-raw-fetch count word under-counting the tree's ELEVEN sites — the code's own call.ts:22 registration the correct form, the current-era fact registered beside the frozen records; B201-I-4 the no-e2e-five write-carrying qualifier over-covering elements GET the read-only member), one session-prep probe-label bug (B201-I-5 — the CEILINGS probe string, fixed in this cycle's delivery), and three carried standing postures (B-I-1 the docblock-symmetry carry at its second, B-I-2 the me-route form, B-I-3 the skill-side §7 vocabulary)): S201-A — THE CT-1 FIX (the README Troubleshooting AUTH_SECRET rotation row — the pointer's target made TRUE while delivering the ops content the comment promises; ZERO src/ changes, the layer STAYING at 14,373, the routes STAYING at 2,461, src/lib STAYING at 3,249) + THE F188 LESSON — THE POINTER-FOLLOWING MEMBER (the census-method family's completion: a comment's cross-reference is a claim about its TARGET's content — verifying the referenced FACT is not verifying the POINTER; born from the catch: the stale pointer surviving THREE consecutive all-TRUE censuses because the samplers verified the rotation fact without following the README pointer; the guard: the census FOLLOWS every pointer and verifies the target carries the promised content — a fact-and-pointer pair is two claims, and the pointer is the one that rots silently; the lineage F182 → F185 → F186 → F187 → F188) + the registration pair (the s201-id-stable-premises-note at the 76th consecutive cycle carrying the CANONICAL quartet in exactly one place — the dispatch QUOTING it verbatim, the F176 prescription's TWELFTH full-cycle test, zero label drift + the s201-census-note with the thirty-first-generation coordinate verification :2879/:2938/:3007 + the s200 row :2878 + the F174-corrected window :2854..:2878 = s176..s200 + the honest REBUILT environment record + the dispatch-currency-honored registration — the NINTH steady-state cycle, the live HEAD 92bce2b9 + the vocabulary-HOLD FIFTEENTH + the §8 letter posture carry FOURTEENTH + the F138 FIFTY-SECOND instance + the thirty-second-generation pre-registration :2881/:2940/:3009); S201-C the per-session pin family (13 pins: 7 RED — the CT-1 fix-member, the B201-I-5 probe-string fix-member, and the five doc-side collateral members / 6 green-at-birth — the two worklog-registration notes, the script-provenance member, the audit-entry members, the standing-figures member, the layer-STAYS member; the MEASURED birth form — 7 RED / 6 green on the FIRST completed run, two en-route corrections before any record shipped: the eleven-registration pin's comment-marker assertion form, the census note's PAD-row disposition corrected to the frozen-record form; the constants born rolling-safe at the POST-spec figures 2770/263) and the collateral family (the count-family re-anchor 2770 = 2757 + 13 unit / 263 files; the spec-constants sweep 82 UNIT + 81 FILES with the census-literal lockstep riders for the s185..s200 specs' rg probes (sixteen members — s200 joining); the layer-total family STAYING at 14,373 — the doc-side-only form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its twenty-seventh re-quote cycle; the env census figure 17 sites across 9 vars at the src/-wide scope, NAMED; the s151..s200 SKILL-version pins onto v1.179.0; the s154..s200 forward-guard rolling re-anchors onto v1.180.0; the s158 title pin onto v1.180.0; the s173..s200 per-spec title-pin riders onto v1.180.0 — the family's twenty-ninth member; e2e stays 262; smoke stays 73) | `tests/lows-s201.test.ts` | 13 | tests | Vitest |\n"
)
if "lows-s201.test.ts" not in pad_text:
    anchor = "| **Unit total** | **263 files** | **2770** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S201_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s201 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s201 §7.1 row already present")

# --- The AGENTS session-201 bullet (inserted above the s200 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The CT-1 pointer fix + the pointer-following registrations (session 201, S201-A..S201-C — the one-hundred-and-forty-ninth Mode C audit's chosen work, the FIFTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — the auditors' census A 0C/0H/0M/0L/1I + B 0C/0H/0M/1L/5I combined 0C/0H/0M/1L/6I, THE FIRST LOW-CARRYING CENSUS SINCE SESSION 197 (the three-cycle zero-Low streak ending), zero behavioral source-code defect, ONE comment-truth defect — the comment-truth census 253 sampled / 252 TRUE / 1 FALSE, the largest sample yet, the all-TRUE streak ending at three; seven members: one comment-truth Low (CT-1 the auth.ts:28 README-troubleshooting stale pointer — the fact true, the pointer false, the row never existing at any commit), two label-precision catches (A-I-1/CT-2 the s200 record's ten-raw-fetch count word under-counting the tree's ELEVEN sites — the code's own call.ts:22 registration the correct form, the current-era fact registered beside the frozen records; B201-I-4 the no-e2e-five write-carrying qualifier over-covering elements GET the read-only member), one session-prep probe-label bug (B201-I-5 — the CEILINGS probe string, fixed this cycle), and three carried standing postures (B-I-1 the docblock-symmetry carry at its second, B-I-2 the me-route form, B-I-3 the skill-side §7 vocabulary)):** (a) S201-A THE CT-1 FIX — the README Troubleshooting AUTH_SECRET rotation row (the pointer's target made TRUE while delivering the ops content the comment promises; ZERO src/ changes — the layer STAYING at 14,373, the routes STAYING at 2,461, src/lib STAYING at 3,249) + THE F188 LESSON — THE POINTER-FOLLOWING MEMBER (a comment's cross-reference is a claim about its target's content — verifying the referenced fact is not verifying the pointer; the census follows every pointer and verifies the target carries the promised content; a fact-and-pointer pair is two claims, and the pointer is the one that rots silently; born from the catch: the stale pointer surviving three consecutive all-TRUE censuses because the samplers verified the fact without following the pointer) + the label-precision registrations (the ELEVEN current-era fact registered beside the frozen s200 records — the s200 plan, the worklog entries, the PAD v1.179.0 chain line, and the PAD s200 per-session row ALL untouched per the frozen-record doctrine; the no-e2e-five corrected phrasing; the probe string fixed) + the registration pair (the premises note at the 76th cycle carrying the canonical quartet verbatim — the F176 prescription's TWELFTH full-cycle test; the census note with the thirty-first-generation verification + the honest REBUILT environment record — the workspace reset, the fresh clone at 92bce2b9, the environment rebuilt: the 477-package install, the .env recreated, the DB re-seeded pristine 1/2/6/1/3, chromium-1248 re-provisioned + the dispatch-currency NINTH steady-state cycle + the vocabulary-HOLD FIFTEENTH + the F138 FIFTY-SECOND instance — the s200 plan 4/4 at fd669ce4, the sweep s151..s200 at 50 plans 270/0 + the thirty-second-generation pre-registration); (b) S201-C the 13-pin spec (the MEASURED birth form 7 RED / 6 green — two en-route corrections before any record shipped: the eleven-registration pin's comment-marker assertion form, the census note's PAD-row disposition corrected to the frozen-record form; the constants born rolling-safe at 2770/263) with the collateral family (the count-family re-anchor 2770 = 2757 + 13 unit / 263 files (the family's live anchor); the layer-total family STAYING at 14,373 (the doc-side-only form — no F40 rider); the route figure STAYING at 2,461; the 177th reference audit NO DRIFT with the clip byte-identical the 138th consecutive session; mobile nav 9/9 the 178th session; pins S128..S200 961/961 across 73).\n"
)
if "session 201, S201-A..S201-C" not in agents_text:
    anchor = "- **The below-threshold registrations + the quoted-form-inheritance lesson (session 200"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-201 bullet inserted")
else:
    print("AGENTS.md: session-201 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s200 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 201):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.178\\.0" in text:
        text = text.replace("version: 1\\.178\\.0", "version: 1\\.179\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.179.0)")
    elif "version: 1\\.179\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.178.0")' in text:
        text = text.replace('toContain("1.178.0")', 'toContain("1.179.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.178.0")' in text:
        text = text.replace('toContain("version: 1.178.0")', 'toContain("version: 1.179.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.179.0")' in text or 'toContain("version: 1.179.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s200 forward count-truth guards' rolling re-anchors
# (v1.179.0 -> v1.180.0 — the s154 guard's FORTY-EIGHTH rolling
#     instance, the s155 guard's FORTY-SEVENTH, ..., the s200 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 201):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.179.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.180.0 PAD block quotes for the layer total (the"),
        ("    /v1\\.179\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,",
         "    /v1\\.180\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.179.0 -> v1.180.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its forty-first instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.179.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.180.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s200 — the
#     s200 spec's title pin joining as the TWENTY-NINTH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.179\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.180\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.179.0");',
         '    expect(lastUpdated).toContain("v1.180.0");'),
    ])

# (3b) the s185 + s186 + ... + s200 specs' title-pin forms (the
#      SIXTEENTH..TWENTY-NINTH members' own shape — the toMatch
#      single-line form, not the two-line rider form above):
for nn in tuple(range(185, 201)):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.179\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.180\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.179.0");',
         'expect(lastUpdated).toContain("v1.180.0");'),
    ])

# --- the census-literal lockstep rider (the s185..s200 specs' rg-census probes) -------
# The s185..s200 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s201
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
for spec_name in [f"tests/lows-s{nn}.test.ts" for nn in range(185, 201)]:
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2757"', '"2770"').replace('"262"', '"263"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(81);", "expect(unitFiles).toBe(82);"),
        ("expect(filesFiles).toBe(80);", "expect(filesFiles).toBe(81);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 81/80 -> 82/81)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2757";' in text:
        assert text.count('const UNIT = "2757";') == 1
        text = text.replace('const UNIT = "2757";', 'const UNIT = "2770";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2770";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "262";' in text:
        assert text.count('const FILES = "262";') == 1
        text = text.replace('const FILES = "262";', 'const FILES = "263";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "263";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
