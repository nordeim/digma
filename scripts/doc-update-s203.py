#!/usr/bin/env python3
"""doc-update-s203.py — the Session 203 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2796 = 2783 + 13 unit / 265 files across every
live claim site, the §7.1 row for the s203 spec, the AGENTS
session-203 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s202 count-truth guards' version literals onto v1.182.0),
the s151..s202 SKILL-version pins onto v1.181.0, the s158 title pin
onto v1.182.0, the s173..s202 per-spec title-pin riders onto v1.182.0
(the family's thirty-first member — the s202 spec's title pin joining),
the census-literal lockstep riders (the s185..s202 specs' rg probes —
eighteen members, s202 joining), and the spec-constants re-anchor
(the pair-unity family).

The comment-only remediation form this cycle (the two amendments +
the registration pair + the spec the only source mutations); the layer
STAYS at 14,373 (no F40 rider).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s203.py
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
    ("| Unit tests | Vitest | 5 | 2783 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2796 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2783 checks on the pure domain seams",
     "bun run test              # unit tests — 2796 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2783 checks) | `bun run test` |",
     "| Unit tests (2796 checks) | `bun run test` |"),
    ("`bun run test` (2783) → `bun run build`",
     "`bun run test` (2796) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the per-session bullets'
    # paren forms are FROZEN records)
    ("the collateral family — the count-family re-anchor 2783 = 2770 + 13 unit / 264 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2796 = 2783 + 13 unit / 265 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2783 checks, Vitest) |",
     "| `bun run test` | Unit tests (2796 checks, Vitest) |"),
    ("(2783 unit / 73 smoke / 262 e2e)",
     "(2796 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2783 checks):",
     "- **Unit Tests** (Vitest, 2796 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2783 unit checks green',
     'project_state: "2796 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2783 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2796 checks;"),
    ("bun run test          # 2783/2783",
     "bun run test          # 2796/2796"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **264 files** | **2783** | | Vitest |",
     "| **Unit total** | **265 files** | **2796** | | Vitest |"),
    ("- [ ] `bun run test` → 2783/2783",
     "- [ ] `bun run test` → 2796/2796"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2783 checks / 264 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2796 checks / 265 files) |"),
])

# --- The §7.1 row for the s203 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S203_ROW = (
    "| Unit — THE F188 SECOND-CYCLE CATCH + THE B202-I-5 LANDING + THE B203-L-1 RE-ANCHOR (the one-hundred-and-fifty-first audit's chosen work, the SEVENTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — 0C/0H/0M/1L/1I, a LOW-CARRYING cycle, the below-threshold streak ending at one, zero behavioral source-code defect, one comment-truth defect CAUGHT AND FIXED in the same cycle; the comment-truth census 683 sampled — 366 client-layer + 317 route/lib — 682 TRUE / 1 FALSE, THE LARGEST SAMPLE YET; two members — B203-L-1 the CT-class stale pointer (src/lib/db.ts:4-5's Pattern B parenthetical citing a section the live PAD no longer carries — the fact true and live, the pointer's target dead at the clone commit 13e3bdaf's PAD rewrite, survived the s201/s202 enumerated-family passes, caught by the complete-population form at the F188 guard's first full-coverage route/lib dispatch) and B202-I-5 the enumeration-precision member (api.ts:18-32's S130-C read-path census three-family parenthetical omitting verify-otp's two mid-window re-selects :118/:160 — the substance TRUE, the registered deferred member LANDING this cycle)): S203-A — THE B202-I-5 AMENDMENT LANDS (the one-clause amendment at src/lib/api.ts naming the re-select family inside the S130-C parenthetical — verify-otp's two mid-window re-selects the named exception inside the S124-A catch, protected, answering 503 — api.ts 48 → 50 lines, src/lib 3,249 → 3,251, zero behavioral change); S203-B — THE B203-L-1 FIX LANDS (the db.ts:4-5 pointer re-anchored onto the PAD's live target — PAD §3.3 Pattern 1, the minifier-safe anchor collection — the in-place form, db.ts staying at 33 lines); S203-C — THE REGISTRATION PAIR (the s203-id-stable-premises-note at the 78th consecutive cycle carrying the CANONICAL quartet verbatim — the F176 prescription's FOURTEENTH full-cycle test, zero label drift + the s203-census-note with THE F188 SECOND-FULL-CYCLE CATCH (683 sampled / 682 TRUE / 1 FALSE with 73 pointers followed — 38 client-layer + 35 route/lib — 72 TRUE / 1 FALSE, the first FALSE pointer, the complete-population form's first catch) + the B203-L-1 registration + the B202-I-5 landing registration + the standing postures carried (the B-I-1 fourth carry) + the honest REBUILT environment record (the third consecutive reset — the fresh clone at dfeb45f4, the environment rebuilt: the 477-package install, the .env recreated, the DB re-seeded pristine 1/2/6/1/3, chromium-1248 re-provisioned) + the dispatch-currency ELEVENTH steady-state cycle + the vocabulary-HOLD SEVENTEENTH + the F138 FIFTY-FOURTH instance — the s202 plan 4/4 at 3a8c62aa, the sweep s151..s202 at 52 plans 279/0 + the thirty-fourth-generation pre-registration :2885/:2944/:3013); S203-D the per-session pin family (13 pins: 7 RED — the AGENTS session-203 bullet, the count re-anchor + the §7.1 row, the PAD title, the SKILL version, the pair-unity constants, the two amendment members — the api.ts re-select-family naming + the db.ts live-target re-anchor / 6 green-at-birth — the two worklog-registration notes, the audit-entry members, the F138 54th + the pin-family arithmetic 987 + 13 = 1000, the script-provenance member, the standing-figures member; the MEASURED birth form — 7 RED / 6 green with ONE en-route spec-form repair caught at the birth runs before any record shipped: the audit-entry pin's census phrase (the B-side '1 Low / 1 Informational' corrected from the forecast '0 Low / 1 Informational' — the s202 F143-class birth correction); the constants born rolling-safe at the POST-spec figures 2796/265) and the collateral family (the count-family re-anchor 2796 = 2783 + 13 unit / 265 files; the spec-constants sweep 84 UNIT + 83 FILES with the census-literal lockstep riders for the s185..s202 specs' rg probes (eighteen members — s202 joining); the layer-total family STAYING at 14,373 — the comment-only form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its twenty-ninth re-quote cycle; the s151..s202 SKILL-version pins onto v1.181.0; the s154..s202 forward-guard rolling re-anchors onto v1.182.0; the s158 title pin onto v1.182.0; the s173..s202 per-spec title-pin riders onto v1.182.0 — the family's thirty-first member; e2e stays 262; smoke stays 73) | `tests/lows-s203.test.ts` | 13 | tests | Vitest |\n"
)
if "lows-s203.test.ts" not in pad_text:
    anchor = "| **Unit total** | **265 files** | **2796** | | Vitest |"
    at = pad_text.index(anchor)
    pad_text = pad_text[:at] + S203_ROW + pad_text[at:]
    pad.write_text(pad_text)
    print("PAD: the s203 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s203 §7.1 row already present")

# --- The AGENTS session-203 bullet (inserted above the s202 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The F188 second-cycle catch + the B202-I-5 landing + the B203-L-1 re-anchor (session 203, S203-A..S203-D — the one-hundred-and-fifty-first Mode C audit's chosen work, the SEVENTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — the auditors' census A 0C/0H/0M/0L/0I + B 0C/0H/0M/1L/1I combined 0C/0H/0M/1L/1I, a LOW-CARRYING cycle, the below-threshold streak ending at one, zero behavioral source-code defect, one comment-truth defect CAUGHT AND FIXED in the same cycle — the comment-truth census 683 sampled / 682 TRUE / 1 FALSE, THE LARGEST SAMPLE YET; two members: B203-L-1 the CT-class stale pointer (src/lib/db.ts:4-5's Pattern B parenthetical citing a section the live PAD no longer carries — the fact true and live, the pointer's target dead at the clone commit 13e3bdaf's PAD rewrite, survived the s201/s202 enumerated-family passes, caught by the complete-population form at the F188 guard's first full-coverage route/lib dispatch — THE F188 POINTER-FOLLOWING GUARD'S SECOND FULL-CYCLE CATCH, its first FALSE pointer: 73 pointers followed (38 client-layer + 35 route/lib), 72 TRUE / 1 FALSE), and B202-I-5 the enumeration-precision member (api.ts's S130-C read-path census three-family parenthetical omitting verify-otp's two mid-window re-selects :118/:160 — the substance TRUE, the registered deferred member LANDING this cycle)):** (a) S203-A — THE B202-I-5 AMENDMENT LANDS (the registered deferred member's own landing cycle — the first cycle above the below-threshold line): the one-clause amendment at src/lib/api.ts naming the re-select family inside the S130-C parenthetical (verify-otp's two mid-window re-selects the named exception inside the S124-A catch, protected, answering 503) — api.ts 48 → 50, src/lib 3,249 → 3,251, zero behavioral change, the spec's pin the TDD receipt; (b) S203-B — THE B203-L-1 FIX LANDS (the cycle's own Low): the db.ts:4-5 pointer re-anchored onto the PAD's live target — PAD §3.3 Pattern 1, the minifier-safe anchor collection — the in-place one-line form, db.ts staying at 33 lines, the fact and the S74-D history untouched; (c) S203-C — THE REGISTRATION PAIR — the s203-id-stable-premises-note at the 78th consecutive cycle carrying the CANONICAL quartet verbatim (the F176 prescription's FOURTEENTH full-cycle test, zero label drift again) + the s203-census-note with THE F188 SECOND-FULL-CYCLE CATCH (the thirty-third-generation coordinate verification :2883/:2942/:3011 + the s202 row :2882 + the F174-corrected window :2858..:2882 = s178..s202 + the LOW-CARRYING census registration + the B203-L-1 registration + the B202-I-5 landing registration + the standing postures carried (the B-I-1 fourth carry) + the honest REBUILT environment record (the third consecutive reset — the fresh clone at dfeb45f4, the environment rebuilt: the 477-package install, the .env recreated, the DB re-seeded pristine 1/2/6/1/3, chromium-1248 re-provisioned) + the dispatch-currency ELEVENTH steady-state cycle + the vocabulary-HOLD SEVENTEENTH + the F138 FIFTY-FOURTH instance — the s202 plan 4/4 at 3a8c62aa, the sweep s151..s202 at 52 plans 279/0 + the thirty-fourth-generation pre-registration); (d) S203-D the 13-pin spec (the MEASURED birth form 7 RED / 6 green with ONE en-route spec-form repair caught at the birth runs: the audit-entry pin's census phrase corrected to the B-side '1 Low / 1 Informational' — the s202 F143-class birth correction; the constants born rolling-safe at 2796/265) with the collateral family (the count-family re-anchor 2796 = 2783 + 13 unit / 265 files (the family's live anchor); the layer-total family STAYING at 14,373 (the comment-only form — no F40 rider); the route figure STAYING at 2,461; the 179th reference audit NO DRIFT with the clip byte-identical the 140th consecutive session; mobile nav 9/9 the 180th session; pins S128..S202 987/987 across 75).\n"
)
if "session 203, S203-A..S203-D" not in agents_text:
    anchor = "- **The below-threshold registrations + the F188 first-full-cycle census (session 202"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-203 bullet inserted")
else:
    print("AGENTS.md: session-203 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s202 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 203):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.180\\.0" in text:
        text = text.replace("version: 1\\.180\\.0", "version: 1\\.181\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.181.0)")
    elif "version: 1\\.181\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.180.0")' in text:
        text = text.replace('toContain("1.180.0")', 'toContain("1.181.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.180.0")' in text:
        text = text.replace('toContain("version: 1.180.0")', 'toContain("version: 1.181.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.181.0")' in text or 'toContain("version: 1.181.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s202 forward count-truth guards' rolling re-anchors
# (v1.181.0 -> v1.182.0 — the s154 guard's FIFTIETH rolling
#     instance, the s155 guard's FORTY-NINTH, ..., the s202 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 203):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.181.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.182.0 PAD block quotes for the layer total (the"),
        ("    /v1\\.181\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,",
         "    /v1\\.182\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.181.0 -> v1.182.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its forty-third instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.181.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.182.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s202 — the
#     s202 spec's title pin joining as the THIRTY-FIRST member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.181\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.182\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.181.0");',
         '    expect(lastUpdated).toContain("v1.182.0");'),
    ])

# (3b) the s185 + s186 + ... + s202 specs' title-pin forms (the
#      EIGHTEENTH..THIRTY-FIRST members' own shape — the toMatch
#      single-line form, not the two-line rider form above):
for nn in tuple(range(185, 203)):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.181\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.182\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.181.0");',
         'expect(lastUpdated).toContain("v1.182.0");'),
    ])

# --- the census-literal lockstep rider (the s185..s202 specs' rg-census probes) -------
# The s185..s202 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s203
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
for spec_name in [f"tests/lows-s{nn}.test.ts" for nn in range(185, 203)]:
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2783"', '"2796"').replace('"264"', '"265"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(83);", "expect(unitFiles).toBe(84);"),
        ("expect(filesFiles).toBe(82);", "expect(filesFiles).toBe(83);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 83/82 -> 84/83)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2783";' in text:
        assert text.count('const UNIT = "2783";') == 1
        text = text.replace('const UNIT = "2783";', 'const UNIT = "2796";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2796";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "264";' in text:
        assert text.count('const FILES = "264";') == 1
        text = text.replace('const FILES = "264";', 'const FILES = "265";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "265";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
