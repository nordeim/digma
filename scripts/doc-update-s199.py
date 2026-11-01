#!/usr/bin/env python3
"""doc-update-s199.py — the Session 199 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2745 = 2733 + 12 unit / 261 files across every
live claim site, the §7.1 row for the s199 spec, the AGENTS
session-199 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s198 count-truth guards' version literals onto v1.178.0),
the s151..s198 SKILL-version pins onto v1.177.0, the s158 title pin
onto v1.178.0, the s173..s198 per-spec title-pin riders onto v1.178.0
(the family's twenty-seventh member — the s198 spec's title pin
joining), the census-literal lockstep riders (the s185..s198 specs'
rg probes — fourteen members, s198 joining), and the spec-constants
re-anchor (the pair-unity family).

NO source-code fix this cycle — the BELOW-THRESHOLD form (zero
behavioral defect, zero comment-truth defect); the layer STAYS at
14,373 (no F40 rider).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s199.py
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
    ("| Unit tests | Vitest | 5 | 2733 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2745 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2733 checks on the pure domain seams",
     "bun run test              # unit tests — 2745 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2733 checks) | `bun run test` |",
     "| Unit tests (2745 checks) | `bun run test` |"),
    ("`bun run test` (2733) → `bun run build`",
     "`bun run test` (2745) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the per-session bullets'
    # paren forms are FROZEN records)
    ("the collateral family — the count-family re-anchor 2733 = 2721 + 12 unit / 260 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2745 = 2733 + 12 unit / 261 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2733 checks, Vitest) |",
     "| `bun run test` | Unit tests (2745 checks, Vitest) |"),
    ("(2733 unit / 73 smoke / 262 e2e)",
     "(2745 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2733 checks):",
     "- **Unit Tests** (Vitest, 2745 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2733 unit checks green',
     'project_state: "2745 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2733 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2745 checks;"),
    ("bun run test          # 2733/2733",
     "bun run test          # 2745/2745"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **260 files** | **2733** | | Vitest |",
     "| **Unit total** | **261 files** | **2745** | | Vitest |"),
    ("- [ ] `bun run test` → 2733/2733",
     "- [ ] `bun run test` → 2745/2745"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2733 checks / 260 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2745 checks / 261 files) |"),
])

# --- The §7.1 row for the s199 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S199_ROW = (
    "| Unit — THE BELOW-THRESHOLD REGISTRATIONS + THE DERIVATION-METHOD LESSON (the one-hundred-and-forty-seventh audit's chosen work, the THIRTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — 0C/0H/0M/0L/6I, a BELOW-THRESHOLD cycle, the SECOND consecutive zero-Low census, zero behavioral source-code defect, zero comment-truth defect — the comment-truth census 162 sampled, 162 TRUE / 0 FALSE, the SECOND consecutive all-TRUE census, the first all-TRUE form independently held at a more-than-doubled sample; six informational members — one record-side (A-I-1 the s198 record's wire-row figure \"the id-less product at 352\" not reproducing under any natural construction — the live id-less products 370-389, the recorded construction never recorded, the live ~510/~1.02 MB claim verifying independently), four vocabulary/scope nuances (A-I-2 the plain @theme with literal hexes vs the skill §12's literal \"@theme inline\" wording — the substance holding; B-I-1 the documented rethrow-on-unknown posture vs §6's literal wording — every documented family enveloped, the in-code documentation governing; B-I-2 the skill's token-format generalization vs digma's S67-A documented wire format userId.tokenVersion.expiry.signature — skill-side, outside the app code; B-I-3 the env-census scope naming — 17/9 at src/-wide, 15/8 at route+lib, the S178 convention extended) + one frozen-record CONFIRMATION (B-I-4 the current-era pre-parse worst case re-derived EXACT at 912,084 bytes/row approximately 1.82 GB, matching the s198 registration, the 32 MB guard's invariant holding under every era-form)): S199-A — THE REGISTRATION PAIR (the S187..S198 registration-cycle form): the s199-id-stable-premises-note at the 74th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its TENTH full-cycle test, zero label drift again, the quoting form the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180; P1 the twelve-site value-based census at the post-S188-A coordinates; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s199-below-threshold-note (THE F186 LESSON — THE DERIVATION-METHOD MEMBER: the F183 never-accept-a-recalled-figure doctrine's record-side completion — a measured figure that rides a session record carries its derivation command — the construction, the scope, the command line — never a bare number; born from the s199 catch: the s198 record's 501/528 wire-row figures re-derived (528 exact at the seeded CTA Button row, 501 inside the minimal band) while the \"id-less product at 352\" did not reproduce under any natural construction (the live id-less products 370-389) — the unrecorded construction making the figure unverifiable-by-construction at every later cycle; the guard's scope member carrying B-I-3: a census figure names its scope + the second all-TRUE comment-truth census registration (162 sampled / 162 TRUE / 0 FALSE) + the A-I-1 frozen-record nuance registration (the current-era id-less 370-389 fact registered, the frozen s198 record untouched) + the twenty-ninth-generation carriers :2875/:2934/:3003 + the s198 row :2874 verified EXACT with the F174-corrected window :2850..:2874 = s174..s198 (25 rows) :2849 the s173 row :2848 the s172 row + the honest folder-level vocabulary-HOLD registration (thirteenth consecutive) + the dispatch-currency-honored registration (the SEVENTH steady-state cycle — the live HEAD 060b32c6 matching exactly) + the honest environment record — THE CONTINUATION FORM (the workspace intact, the git pull fast-forward 2b825367→060b32c6, the standing environment verified not rebuilt, the DB re-seeded pristine after the smoke drift) + the §8 letter posture carry (twelfth consecutive) + the F138 FIFTIETH instance) + S199-B the per-session pin family (12 pins: 5 RED — the doc-side collateral members / 7 green-at-birth — the two worklog-registration notes, the F138 guard's FIFTIETH instance (the s198 plan's record pinned 4/4 ticked at 834b3f9e), the script-provenance member, the audit-entry members (both anchors at their standing spellings), the standing-figures member, the layer-STAYS member, the A-I-1 frozen-record member; the MEASURED birth form — 5 RED / 7 green EXACT on the FIRST completed run, the run itself completing in 487ms with the apparent timeout the known vitest worker-pool quirk; the constants born rolling-safe at the post-spec figures 2745/261) and the collateral family (the count-family re-anchor 2745 = 2733 + 12 unit / 261 files; the spec-constants sweep 80 UNIT + 79 FILES with the census-literal lockstep riders for the s185..s198 specs' rg probes (fourteen members — s198 joining); the layer-total family STAYING at 14,373 — the below-threshold form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its twenty-fifth re-quote cycle; the env census figure 17 sites across 9 vars at the src/-wide scope, NAMED; the s151..s198 SKILL-version pins onto v1.177.0; the s154..s198 forward-guard rolling re-anchors onto v1.178.0; the s158 title pin onto v1.178.0; the s173..s198 per-spec title-pin riders onto v1.178.0 — the family's twenty-seventh member; e2e stays 262; smoke stays 73) | `tests/lows-s199.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s199.test.ts" not in pad_text:
    anchor = "| **Unit total** | **261 files** | **2745** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S199_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s199 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s199 §7.1 row already present")

# --- The AGENTS session-199 bullet (inserted above the s198 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The below-threshold registrations + the derivation-method lesson (session 199, S199-A..S199-B — the one-hundred-and-forty-seventh Mode C audit's chosen work, the THIRTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — the auditors' census A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/4I combined 0C/0H/0M/0L/6I, a BELOW-THRESHOLD cycle, the SECOND consecutive zero-Low census, zero behavioral source-code defect, zero comment-truth defect — the comment-truth census 162 sampled / 162 TRUE / 0 FALSE, the SECOND consecutive all-TRUE census, the first all-TRUE form independently held at a more-than-doubled sample; six informational members: one record-side (A-I-1 the s198 record's wire-row figure \"the id-less product at 352\" not reproducing under any natural construction — the live id-less products 370-389, the recorded construction never recorded, the live ~510/~1.02 MB claim verifying independently), four vocabulary/scope nuances (A-I-2 the plain @theme with literal hexes vs the skill §12's literal \"@theme inline\" wording; B-I-1 the documented rethrow-on-unknown posture vs §6's literal wording; B-I-2 the skill's token-format generalization vs digma's S67-A wire format — skill-side, outside the app code; B-I-3 the env-census scope naming — 17/9 at src/-wide, 15/8 at route+lib) + one frozen-record CONFIRMATION (B-I-4 the current-era 912,084 bytes/row approximately 1.82 GB re-derived EXACT, matching the s198 registration)):** (a) S199-A THE REGISTRATION PAIR (the S187..S198 registration-cycle form): the s199-id-stable-premises-note at the 74th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its TENTH full-cycle test, zero label drift again) + the s199-below-threshold-note (THE F186 LESSON — THE DERIVATION-METHOD MEMBER: the F183 never-accept-a-recalled-figure doctrine's record-side completion — a measured figure that rides a session record carries its derivation command — construction, scope, command line — never a bare number; born from the s199 catch: the s198 record's 501/528 wire-row figures re-derived (528 exact at the seeded CTA Button row, 501 inside the minimal band) while the \"id-less product at 352\" did not reproduce under any natural construction (the live id-less products 370-389) — the unrecorded construction making the figure unverifiable-by-construction at every later cycle; the guard's scope member carrying B-I-3 (a census figure names its scope) + THE SECOND ALL-TRUE COMMENT-TRUTH CENSUS REGISTRATION (162 sampled / 162 TRUE / 0 FALSE) + THE A-I-1 FROZEN-RECORD NUANCE REGISTRATION (the current-era id-less 370-389 fact, the frozen s198 record untouched) + the twenty-ninth-generation carriers :2875/:2934/:3003 + the s198 row :2874 verified EXACT with the F174-corrected window :2850..:2874 = s174..s198 (25 rows), :2849 the s173 row, :2848 the s172 row + the honest folder-level vocabulary-HOLD registration (thirteenth consecutive) + the dispatch-currency-honored registration (the SEVENTH steady-state cycle) + the honest environment record — THE CONTINUATION FORM this cycle (the workspace intact, the git pull fast-forward 2b825367→060b32c6, the standing environment verified not rebuilt — the DB re-seeded pristine after the smoke drift, the trap guarded from the first call)); (b) S199-B the 12-pin spec (5 RED / 7 green-at-birth EXACT on the FIRST completed run — the run itself completing in 487ms, the apparent timeout the known vitest worker-pool quirk; the constants born rolling-safe at 2745/261) with the collateral family (the count-family re-anchor 2745 = 2733 + 12 unit / 261 files (the family's live anchor); the layer-total family STAYING at 14,373 (the below-threshold form — no F40 rider needed); the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars at the src/-wide scope, NAMED; the elements-route figure 420 unchanged — its twenty-fifth re-quote cycle; the F138 guard's FIFTIETH instance — the s198 plan 4/4 ticked at 834b3f9e, the sweep s151..s198 at 48 plans 262/0; the 175th reference audit NO DRIFT with the clip byte-identical the 136th consecutive session; mobile nav 9/9 the 176th session; pins S128..S198 937/937 across 71).\n"
)
if "session 199, S199-A..S199-B" not in agents_text:
    anchor = "- **The below-threshold registrations + the brief-paraphrase lesson (session 198"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-199 bullet inserted")
else:
    print("AGENTS.md: session-199 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s198 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 199):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.176\\.0" in text:
        text = text.replace("version: 1\\.176\\.0", "version: 1\\.177\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.177.0)")
    elif "version: 1\\.177\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.176.0")' in text:
        # the s181/s182/s183/s184 specs' toContain literal form (the spec
        # pins the version line by substring — the rolling re-anchor at
        # the literal level)
        text = text.replace('toContain("1.176.0")', 'toContain("1.177.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.176.0")' in text:
        # the s185..s198 specs' fuller toContain form (the version-line substring
        # with the field prefix — the rolling re-anchor at the literal layer)
        text = text.replace('toContain("version: 1.176.0")', 'toContain("version: 1.177.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.177.0")' in text or 'toContain("version: 1.177.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s198 forward count-truth guards' rolling re-anchors
# (v1.177.0 -> v1.178.0 — the s154 guard's FORTY-SIXTH rolling
#     instance, the s155 guard's FORTY-FIFTH, ..., the s198 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 199):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.177.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.178.0 PAD block quotes for the layer total (the"),
        ("    /v1\\.177\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,",
         "    /v1\\.178\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.177.0 -> v1.178.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its thirty-ninth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.177.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.178.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s198 — the
#     s198 spec's title pin joining as the TWENTY-SEVENTH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.177\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.178\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.177.0");',
         '    expect(lastUpdated).toContain("v1.178.0");'),
    ])

# (3b) the s185 + s186 + s187 + s188 + s189 + s190 + s191 + s192 + s193 + s194 + s195 + s196 + s197 + s198
#      specs' title-pin forms (the SIXTEENTH..TWENTY-SEVENTH members' own shape —
#      the toMatch single-line form, not the two-line rider form above):
for nn in (185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.177\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.178\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.177.0");',
         'expect(lastUpdated).toContain("v1.178.0");'),
    ])

# --- the census-literal lockstep rider (the s185..s198 specs' rg-census probes) -------
# The s185..s198 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s199
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
for spec_name in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts", "tests/lows-s187.test.ts", "tests/lows-s188.test.ts", "tests/lows-s189.test.ts", "tests/lows-s190.test.ts", "tests/lows-s191.test.ts", "tests/lows-s192.test.ts", "tests/lows-s193.test.ts", "tests/lows-s194.test.ts", "tests/lows-s195.test.ts", "tests/lows-s196.test.ts", "tests/lows-s197.test.ts", "tests/lows-s198.test.ts"):
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2733"', '"2745"').replace('"260"', '"261"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(79);", "expect(unitFiles).toBe(80);"),
        ("expect(filesFiles).toBe(78);", "expect(filesFiles).toBe(79);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 79/78 -> 80/79)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2733";' in text:
        assert text.count('const UNIT = "2733";') == 1
        text = text.replace('const UNIT = "2733";', 'const UNIT = "2745";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2745";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "260";' in text:
        assert text.count('const FILES = "260";') == 1
        text = text.replace('const FILES = "260";', 'const FILES = "261";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "261";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
