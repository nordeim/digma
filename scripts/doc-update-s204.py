#!/usr/bin/env python3
"""doc-update-s204.py — the Session 204 GREEN collateral, part 1 (the
below-threshold registration-cycle form — live claim sites, never frozen
records): the count-family re-anchor 2809 = 2796 + 13 unit / 266 files
across every live claim site, the §7.1 row for the s204 spec, the AGENTS
session-204 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s203 count-truth guards' version literals onto v1.183.0),
the s151..s203 SKILL-version pins onto v1.182.0, the s158 title pin
onto v1.183.0, the s173..s203 per-spec title-pin riders onto v1.183.0
(the family's thirty-second member — the s203 spec's title pin joining),
the census-literal lockstep riders (the s185..s203 specs' rg probes —
nineteen members, s203 joining), and the spec-constants re-anchor
(the pair-unity family).

The registration-only remediation form this cycle (the registration
pair + the spec + the collateral the only mutations — zero src/
changes); the layer STAYS at 14,373 (no F40 rider).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s204.py
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
    ("| Unit tests | Vitest | 5 | 2796 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2809 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2796 checks on the pure domain seams",
     "bun run test              # unit tests — 2809 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2796 checks) | `bun run test` |",
     "| Unit tests (2809 checks) | `bun run test` |"),
    ("`bun run test` (2796) → `bun run build`",
     "`bun run test` (2809) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the per-session bullets'
    # paren forms are FROZEN records)
    ("the collateral family — the count-family re-anchor 2796 = 2783 + 13 unit / 265 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2809 = 2796 + 13 unit / 266 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2796 checks, Vitest) |",
     "| `bun run test` | Unit tests (2809 checks, Vitest) |"),
    ("(2796 unit / 73 smoke / 262 e2e)",
     "(2809 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2796 checks):",
     "- **Unit Tests** (Vitest, 2809 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2796 unit checks green',
     'project_state: "2809 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2796 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2809 checks;"),
    ("bun run test          # 2796/2796",
     "bun run test          # 2809/2809"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **265 files** | **2796** | | Vitest |",
     "| **Unit total** | **266 files** | **2809** | | Vitest |"),
    ("- [ ] `bun run test` → 2796/2796",
     "- [ ] `bun run test` → 2809/2809"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2796 checks / 265 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2809 checks / 266 files) |"),
])

# --- The §7.1 row for the s204 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S204_ROW = (
    "| Unit — THE BELOW-THRESHOLD REGISTRATIONS + THE F188 THIRD-FULL-CYCLE PASS (the one-hundred-and-fifty-second audit's chosen work, the EIGHTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — 0C/0H/0M/0L/3I, a BELOW-THRESHOLD cycle, the fifth zero-Low census in seven cycles, zero behavioral source-code defect, zero comment-truth defect; the comment-truth census 550 sampled — 234 client-layer + 316 route/lib — 550 TRUE / 0 FALSE, THE ALL-TRUE CENSUS RESTORED (the streak at one); THE F188 POINTER-FOLLOWING GUARD'S THIRD FULL-CYCLE PASS: 54 pointer members followed to their targets (20 client-layer + 34 route/lib), ALL TRUE — both prior catches confirmed standing, not recurring (auth.ts:27-29 → README:349; db.ts:4-5 → PAD:2319 §3.3 Pattern 1); three members, all label-precision class, zero source-side defect — B204-I-1 the enumeration-precision member (elements/route.ts:31-33's S124-C full-row-registration parenthetical — the family fact TRUE (all four list-family routes ride THUMBNAIL_ELEMENT_SELECT + withThumbFills), the label imprecise at two points (the thumbnail include lives on the detail route's PATCH response, the detail GET keeping full rows by documented contract; \"recent\" a client view, not a route) — the phrase quoted verbatim from the PAD's canonical record at PAD:120, pin-safe; the comment-only one-clause amendment + the PAD:120 re-anchor CARRIED under the below-threshold zero-source-change discipline, the B202-I-5 precedent), B204-I-2 the lead's-own-brief label-precision member (the e2e-count pin singularly attributed to server-lows-s81 while the tree carries TWO members of the const E2E \"262\" form — server-lows-s81:159 + doc-lows-s84:66, both correctly excluded; the corrected phrasing registered), and A204-I-1 the lead's-own-brief label-precision member (the brief's \"api.ts:48-50\" label — the line-count figure \"api.ts 48 → 50\" written in colon-delimited coordinate form while the content sits at api.ts:23-24; the fix registered: the next dispatch quotes the live coordinate or the registered line-count form)): S204-A — THE REGISTRATION PAIR (the below-threshold registration-cycle form): the s204-id-stable-premises-note at the 79th consecutive cycle carrying the CANONICAL quartet verbatim (the dispatch QUOTING it — the F176 prescription's FIFTEENTH full-cycle test, zero label drift) + the s204-below-threshold-note (the thirty-fourth-generation coordinate verification :2885/:2944/:3013 + the s203 row :2884 + the F174-corrected window :2860..:2884 = s179..s203 + THE F188 THIRD-FULL-CYCLE PASS (550 sampled / 550 TRUE / 0 FALSE with 54 pointers followed, all TRUE) + the below-threshold census registration + the B204-I-1 registration CARRIED + the B204-I-2 + A204-I-1 registrations + the standing postures carried (the B-I-1 fifth carry) + the honest REBUILT environment record (the FIFTH consecutive reset — the fresh clone at 2afb1f1c, the environment rebuilt: the 476-package install (bun 1.3.14's own counter — the s203 record's 477 that environment's own measured figure, both derived by the same command), the .env recreated, the DB re-seeded pristine 1/2/6/1/3, chromium-1248 re-provisioned) + the dispatch-currency TWELFTH steady-state cycle + the vocabulary-HOLD EIGHTEENTH + the F138 FIFTY-FIFTH instance — the s203 plan 6/6 at 0d65640d, the sweep s151..s203 at 53 plans 285/0 + the thirty-fifth-generation pre-registration :2887/:2946/:3015); S204-B the per-session pin family (13 pins: the MEASURED birth form 5 RED (the AGENTS session-204 bullet, the count re-anchor + the §7.1 row, the PAD title, the SKILL version, the pair-unity constants) / 8 green-at-birth (the two worklog-registration notes, the audit-entry members, the F138 55th + the pin-family arithmetic 1000 + 13 = 1013, the script-provenance member, the standing-figures member, the carried-member receipt — the B204-I-1 phrase pinned VERBATIM as still present, the CARRY the receipt, the layer + frozen-record member); ONE en-route spec-form repair caught at the birth runs before any record shipped: the audit-entry pin's B-side ordinal phrase corrected to the entry's own numeral form (the s203 F143-class birth correction precedent); the constants born rolling-safe at the POST-spec figures 2809/266) and the collateral family (the count-family re-anchor 2809 = 2796 + 13 unit / 266 files; the spec-constants sweep 85 UNIT + 84 FILES with the census-literal lockstep riders for the s185..s203 specs' rg probes (nineteen members — s203 joining); the layer-total family STAYING at 14,373 — the registration-only form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its thirtieth re-quote cycle; the s151..s203 SKILL-version pins onto v1.182.0; the s154..s203 forward-guard rolling re-anchors onto v1.183.0; the s158 title pin onto v1.183.0; the s173..s203 per-spec title-pin riders onto v1.183.0 — the family's thirty-second member; e2e stays 262; smoke stays 73) | `tests/lows-s204.test.ts` | 13 | tests | Vitest |\n"
)
if "lows-s204.test.ts" not in pad_text:
    anchor = "| **Unit total** | **266 files** | **2809** | | Vitest |"
    at = pad_text.index(anchor)
    pad_text = pad_text[:at] + S204_ROW + pad_text[at:]
    pad.write_text(pad_text)
    print("PAD: the s204 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s204 §7.1 row already present")

# --- The AGENTS session-204 bullet (inserted above the s203 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The below-threshold registrations + the F188 third-full-cycle pass (session 204, S204-A..S204-D — the one-hundred-and-fifty-second Mode C audit's chosen work, the EIGHTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — the auditors' census A 0C/0H/0M/0L/1I + B 0C/0H/0M/0L/2I combined 0C/0H/0M/0L/3I, a BELOW-THRESHOLD cycle, the fifth zero-Low census in seven cycles, zero behavioral source-code defect, zero comment-truth defect — the comment-truth census 550 sampled / 550 TRUE / 0 FALSE, THE ALL-TRUE CENSUS RESTORED (the streak at one); THE F188 POINTER-FOLLOWING GUARD'S THIRD FULL-CYCLE PASS: 54 pointer members followed (20 client-layer + 34 route/lib), ALL TRUE, both prior catches confirmed standing not recurring; three members, all label-precision class, zero source-side defect: B204-I-1 the enumeration-precision member (elements/route.ts:31-33's S124-C parenthetical — the family fact TRUE, the label imprecise at two points (the thumbnail include lives on the detail route's PATCH response, the detail GET keeping full rows by documented contract; \"recent\" a client view, not a route) — the phrase quoted verbatim from the PAD:120 canonical record, pin-safe; the comment-only amendment + the PAD re-anchor CARRIED under the below-threshold zero-source-change discipline, the B202-I-5 precedent), B204-I-2 the lead's-own-brief label-precision member (the e2e-count pin singularly attributed to server-lows-s81 while the tree carries TWO members of the const E2E \"262\" form — server-lows-s81:159 + doc-lows-s84:66, both correctly excluded; the corrected phrasing registered), A204-I-1 the lead's-own-brief label-precision member (the brief's \"api.ts:48-50\" label — the line-count figure \"api.ts 48 → 50\" written in colon-delimited coordinate form while the content sits at api.ts:23-24; the fix registered — the next dispatch quotes the live coordinate or the registered line-count form)):** (a) S204-A — THE REGISTRATION PAIR (the below-threshold registration-cycle form): the s204-id-stable-premises-note at the 79th consecutive cycle carrying the CANONICAL quartet verbatim (the F176 prescription's FIFTEENTH full-cycle test, zero label drift again) + the s204-below-threshold-note with THE F188 THIRD-FULL-CYCLE PASS registration (the thirty-fourth-generation coordinate verification :2885/:2944/:3013 + the s203 row :2884 + the F174-corrected window :2860..:2884 = s179..s203 + the below-threshold census registration + the B204-I-1 registration CARRIED + the B204-I-2 + A204-I-1 registrations + the standing postures carried (the B-I-1 fifth carry) + the honest REBUILT environment record (the FIFTH consecutive reset — the fresh clone at 2afb1f1c, the environment rebuilt: the 476-package install (bun 1.3.14's own counter), the .env recreated, the DB re-seeded pristine 1/2/6/1/3, chromium-1248 re-provisioned) + the dispatch-currency TWELFTH steady-state cycle + the vocabulary-HOLD EIGHTEENTH + the F138 FIFTY-FIFTH instance — the s203 plan 6/6 at 0d65640d, the sweep s151..s203 at 53 plans 285/0 + the thirty-fifth-generation pre-registration); (b) S204-B the 13-pin spec (the MEASURED birth form 5 RED / 8 green with ONE en-route spec-form repair caught at the birth runs: the audit-entry pin's B-side ordinal phrase corrected to the entry's own numeral form — the s203 F143-class birth correction precedent; the constants born rolling-safe at 2809/266) with the collateral family (the count-family re-anchor 2809 = 2796 + 13 unit / 266 files (the family's live anchor); the layer-total family STAYING at 14,373 (the registration-only form — no F40 rider); the route figure STAYING at 2,461; the 180th reference audit NO DRIFT with the clip byte-identical the 141st consecutive session; mobile nav 9/9 the 181st session; pins S128..S203 1000/1000 across 76).\n"
)
if "session 204, S204-A..S204-D" not in agents_text:
    anchor = "- **The F188 second-cycle catch + the B202-I-5 landing + the B203-L-1 re-anchor (session 203"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-204 bullet inserted")
else:
    print("AGENTS.md: session-204 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s203 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 204):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.181\\.0" in text:
        text = text.replace("version: 1\\.181\\.0", "version: 1\\.182\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.182.0)")
    elif "version: 1\\.182\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.181.0")' in text:
        text = text.replace('toContain("1.181.0")', 'toContain("1.182.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.181.0")' in text:
        text = text.replace('toContain("version: 1.181.0")', 'toContain("version: 1.182.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.182.0")' in text or 'toContain("version: 1.182.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s203 forward count-truth guards' rolling re-anchors
# (v1.182.0 -> v1.183.0 — the s154 guard's FIFTY-FIRST rolling
#     instance, the s155 guard's FIFTIETH, ..., the s203 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 204):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.182.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.183.0 PAD block quotes for the layer total (the"),
        ("    /v1\\.182\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,",
         "    /v1\\.183\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.182.0 -> v1.183.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its forty-fourth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.182.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.183.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s203 — the
#     s203 spec's title pin joining as the THIRTY-SECOND member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.182\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.183\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.182.0");',
         '    expect(lastUpdated).toContain("v1.183.0");'),
    ])

# (3b) the s185 + s186 + ... + s203 specs' title-pin forms (the
#      NINETEENTH..THIRTY-SECOND members' own shape — the toMatch
#      single-line form, not the two-line rider form above):
for nn in tuple(range(185, 204)):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.182\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.183\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.182.0");',
         'expect(lastUpdated).toContain("v1.183.0");'),
    ])

# --- the census-literal lockstep rider (the s185..s203 specs' rg-census probes) -------
# The s185..s203 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s204
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
for spec_name in [f"tests/lows-s{nn}.test.ts" for nn in range(185, 204)]:
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2796"', '"2809"').replace('"265"', '"266"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(84);", "expect(unitFiles).toBe(85);"),
        ("expect(filesFiles).toBe(83);", "expect(filesFiles).toBe(84);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 84/83 -> 85/84)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2796";' in text:
        assert text.count('const UNIT = "2796";') == 1
        text = text.replace('const UNIT = "2796";', 'const UNIT = "2809";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2809";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "265";' in text:
        assert text.count('const FILES = "265";') == 1
        text = text.replace('const FILES = "265";', 'const FILES = "266";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "266";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
