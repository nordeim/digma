#!/usr/bin/env python3
"""doc-update-s202.py — the Session 202 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2783 = 2770 + 13 unit / 264 files across every
live claim site, the §7.1 row for the s202 spec, the AGENTS
session-202 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s201 count-truth guards' version literals onto v1.181.0),
the s151..s201 SKILL-version pins onto v1.180.0, the s158 title pin
onto v1.181.0, the s173..s201 per-spec title-pin riders onto v1.181.0
(the family's thirtieth member — the s201 spec's title pin joining),
the census-literal lockstep riders (the s185..s201 specs' rg probes —
seventeen members, s201 joining), and the spec-constants re-anchor
(the pair-unity family).

The below-threshold registration-only form this cycle (ZERO source
changes); the layer STAYS at 14,373 (no F40 rider).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s202.py
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
    ("| Unit tests | Vitest | 5 | 2770 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2783 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2770 checks on the pure domain seams",
     "bun run test              # unit tests — 2783 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2770 checks) | `bun run test` |",
     "| Unit tests (2783 checks) | `bun run test` |"),
    ("`bun run test` (2770) → `bun run build`",
     "`bun run test` (2783) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the per-session bullets'
    # paren forms are FROZEN records)
    ("the collateral family — the count-family re-anchor 2770 = 2757 + 13 unit / 263 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2783 = 2770 + 13 unit / 264 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2770 checks, Vitest) |",
     "| `bun run test` | Unit tests (2783 checks, Vitest) |"),
    ("(2770 unit / 73 smoke / 262 e2e)",
     "(2783 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2770 checks):",
     "- **Unit Tests** (Vitest, 2783 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2770 unit checks green',
     'project_state: "2783 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2770 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2783 checks;"),
    ("bun run test          # 2770/2770",
     "bun run test          # 2783/2783"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **263 files** | **2770** | | Vitest |",
     "| **Unit total** | **264 files** | **2783** | | Vitest |"),
    ("- [ ] `bun run test` → 2770/2770",
     "- [ ] `bun run test` → 2783/2783"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2770 checks / 263 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2783 checks / 264 files) |"),
])

# --- The §7.1 row for the s202 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S202_ROW = (
    "| Unit — THE BELOW-THRESHOLD REGISTRATIONS + THE F188 FIRST-FULL-CYCLE CENSUS (the one-hundred-and-fiftieth audit's chosen work, the SIXTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — 0C/0H/0M/0L/5I, a BELOW-THRESHOLD cycle, the fourth zero-Low census in five cycles, zero behavioral source-code defect, zero comment-truth defect; the comment-truth census 627 sampled — 365 client-layer + 262 route/lib — 627 TRUE / 0 FALSE, THE LARGEST SAMPLE YET, THE ALL-TRUE CENSUS RESTORED (the streak at one); five members — one label-precision catch (B202-I-1 the dispatch brief's two per-file approximation markers — register 146 / resend-otp 122 the live figures, the F186 record-gap form), one precision registration (B202-I-2 the no-e2e set strictly six — health GET the +1 liveness-carve-out bucket of the 13+6+1+5=25 arithmetic), one enumeration-precision member carried (B202-I-5 api.ts's S130-C read-path census parenthetical omitting verify-otp's two mid-window re-selects :118/:160 — the substance TRUE, the one-line amendment registered and carried under the below-threshold zero-source-change discipline, the B-I-1 precedent), and two documented standing postures (B202-I-3 register's 409 open enumeration by design; B202-I-4 the single-tenant ownership model, ADR-003 documented)): S202-A — THE REGISTRATION PAIR (the s202-id-stable-premises-note at the 77th consecutive cycle carrying the CANONICAL quartet in exactly one place — the dispatch QUOTING it verbatim, the F176 prescription's THIRTEENTH full-cycle test, zero label drift + the s202-below-threshold-note with THE F188 POINTER-FOLLOWING GUARD'S FIRST FULL-CYCLE TEST PASSED — 53 pointer members followed to their targets (42 client-layer + 11 route/lib), every target carrying its promised content, the all-TRUE census restored at the largest sample yet; the thirty-second-generation coordinate verification :2881/:2940/:3009 + the s201 row :2880 + the F174-corrected window :2856..:2880 = s177..s201 + the honest REBUILT environment record + the dispatch-currency-honored registration — the TENTH steady-state cycle, the live HEAD 10e0acf7 + the vocabulary-HOLD SIXTEENTH + the F138 FIFTY-THIRD instance — the s201 plan 5/5 at e7e0ecde, the sweep s151..s201 at 51 plans 275/0 + the thirty-third-generation pre-registration :2883/:2942/:3011); S202-B the per-session pin family (13 pins: 5 RED — the AGENTS session-202 bullet, the count re-anchor + the §7.1 row, the PAD title, the SKILL version, the pair-unity constants / 8 green-at-birth — the two worklog-registration notes, the audit-entry members, the F138 53rd + the pin-family arithmetic 974 + 13 = 987, the script-provenance member, the standing-figures member, the layer-STAYS member, the B202-I-1 live per-file figures member; the MEASURED birth form — 5 RED / 8 green on the FIRST CLEAN RUN, three en-route note-form corrections before any record shipped: the B202-I-5 registration phrase, the premises-pinning doctrine sentence, the vocabulary-hold standing phrasing; the constants born rolling-safe at the POST-spec figures 2783/264) and the collateral family (the count-family re-anchor 2783 = 2770 + 13 unit / 264 files; the spec-constants sweep 83 UNIT + 82 FILES with the census-literal lockstep riders for the s185..s201 specs' rg probes (seventeen members — s201 joining); the layer-total family STAYING at 14,373 — the below-threshold form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its twenty-eighth re-quote cycle; the s151..s201 SKILL-version pins onto v1.180.0; the s154..s201 forward-guard rolling re-anchors onto v1.181.0; the s158 title pin onto v1.181.0; the s173..s201 per-spec title-pin riders onto v1.181.0 — the family's thirtieth member; e2e stays 262; smoke stays 73) | `tests/lows-s202.test.ts` | 13 | tests | Vitest |\n"
)
if "lows-s202.test.ts" not in pad_text:
    anchor = "| **Unit total** | **264 files** | **2783** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S202_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s202 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s202 §7.1 row already present")

# --- The AGENTS session-202 bullet (inserted above the s201 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The below-threshold registrations + the F188 first-full-cycle census (session 202, S202-A..S202-B — the one-hundred-and-fiftieth Mode C audit's chosen work, the SIXTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision) — the auditors' census A 0C/0H/0M/0L/0I + B 0C/0H/0M/0L/5I combined 0C/0H/0M/0L/5I, a BELOW-THRESHOLD cycle, the fourth zero-Low census in five cycles, zero behavioral source-code defect, zero comment-truth defect — the comment-truth census 627 sampled / 627 TRUE / 0 FALSE, THE LARGEST SAMPLE YET, THE ALL-TRUE CENSUS RESTORED (the streak at one); five members: one label-precision catch (B202-I-1 the dispatch brief's two per-file approximation markers — register 146 / resend-otp 122 the live figures, the F186 record-gap form), one precision registration (B202-I-2 the no-e2e set strictly six — health GET the +1 liveness-carve-out bucket), one enumeration-precision member carried (B202-I-5 api.ts's S130-C read-path census parenthetical omitting verify-otp's two mid-window re-selects :118/:160 — the substance TRUE, the amendment registered and carried), and two documented standing postures (B202-I-3 register's 409 open enumeration by design; B202-I-4 the single-tenant ownership model, ADR-003 documented)):** (a) S202-A THE REGISTRATION PAIR — the s202-id-stable-premises-note at the 77th consecutive cycle carrying the CANONICAL quartet verbatim (the F176 prescription's THIRTEENTH full-cycle test, zero label drift again) + the s202-below-threshold-note with THE F188 POINTER-FOLLOWING GUARD'S FIRST FULL-CYCLE TEST (53 pointer members followed to their targets — 42 client-layer + 11 route/lib — every target carrying its promised content, the all-TRUE census restored at the largest sample yet; the s201 follow-up-pass dispatch gap closed by construction — the route/lib census dimension riding the brief from the start) + the thirty-second-generation verification + the B202-I-1 label-precision registration with the live 146/122 figures + the B202-I-2 precision registration + the B202-I-5 enumeration-precision registration carried + the honest REBUILT environment record (the second consecutive reset between sessions — the fresh clone at 10e0acf7, the environment rebuilt: the 477-package install, the .env recreated, the DB re-seeded pristine 1/2/6/1/3, chromium-1248 re-provisioned) + the dispatch-currency TENTH steady-state cycle + the vocabulary-HOLD SIXTEENTH + the F138 FIFTY-THIRD instance — the s201 plan 5/5 at e7e0ecde, the sweep s151..s201 at 51 plans 275/0 + the thirty-third-generation pre-registration; (b) S202-B the 13-pin spec (the MEASURED birth form 5 RED / 8 green — three en-route note-form corrections before any record shipped: the B202-I-5 registration phrase, the premises-pinning doctrine sentence, the vocabulary-hold standing phrasing; the constants born rolling-safe at 2783/264) with the collateral family (the count-family re-anchor 2783 = 2770 + 13 unit / 264 files (the family's live anchor); the layer-total family STAYING at 14,373 (the below-threshold form — no F40 rider); the route figure STAYING at 2,461; the 178th reference audit NO DRIFT with the clip byte-identical the 139th consecutive session; mobile nav 9/9 the 179th session; pins S128..S201 974/974 across 74).\n"
)
if "session 202, S202-A..S202-B" not in agents_text:
    anchor = "- **The CT-1 pointer fix + the pointer-following registrations (session 201"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-202 bullet inserted")
else:
    print("AGENTS.md: session-202 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s201 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 202):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.179\\.0" in text:
        text = text.replace("version: 1\\.179\\.0", "version: 1\\.180\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.180.0)")
    elif "version: 1\\.180\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.179.0")' in text:
        text = text.replace('toContain("1.179.0")', 'toContain("1.180.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.179.0")' in text:
        text = text.replace('toContain("version: 1.179.0")', 'toContain("version: 1.180.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.180.0")' in text or 'toContain("version: 1.180.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s201 forward count-truth guards' rolling re-anchors
# (v1.180.0 -> v1.181.0 — the s154 guard's FORTY-NINTH rolling
#     instance, the s155 guard's FORTY-EIGHTH, ..., the s201 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 202):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.180.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.181.0 PAD block quotes for the layer total (the"),
        ("    /v1\\.180\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,",
         "    /v1\\.181\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.180.0 -> v1.181.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its forty-second instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.180.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.181.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s201 — the
#     s201 spec's title pin joining as the THIRTIETH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.180\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.181\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.180.0");',
         '    expect(lastUpdated).toContain("v1.181.0");'),
    ])

# (3b) the s185 + s186 + ... + s201 specs' title-pin forms (the
#      SEVENTEENTH..THIRTIETH members' own shape — the toMatch
#      single-line form, not the two-line rider form above):
for nn in tuple(range(185, 202)):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.180\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.181\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.180.0");',
         'expect(lastUpdated).toContain("v1.181.0");'),
    ])

# --- the census-literal lockstep rider (the s185..s201 specs' rg-census probes) -------
# The s185..s201 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s202
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
for spec_name in [f"tests/lows-s{nn}.test.ts" for nn in range(185, 202)]:
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2770"', '"2783"').replace('"263"', '"264"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(82);", "expect(unitFiles).toBe(83);"),
        ("expect(filesFiles).toBe(81);", "expect(filesFiles).toBe(82);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 82/81 -> 83/82)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2770";' in text:
        assert text.count('const UNIT = "2770";') == 1
        text = text.replace('const UNIT = "2770";', 'const UNIT = "2783";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2783";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "263";' in text:
        assert text.count('const FILES = "263";') == 1
        text = text.replace('const FILES = "263";', 'const FILES = "264";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "264";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
