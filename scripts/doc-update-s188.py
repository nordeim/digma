#!/usr/bin/env python3
"""doc-update-s188.py — the Session 188 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2613 = 2600 + 13 unit / 250 files across every
live claim site, the §7.1 row for the s188 spec, the AGENTS
session-188 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s187 count-truth guards' version literals onto v1.167.0),
the s151..s187 SKILL-version pins onto v1.166.0, the s158 title pin
onto v1.167.0, the s173..s187 per-spec title-pin riders onto v1.167.0
(the family's sixteenth member — the s187 spec's title pin joining),
the census-literal lockstep riders (the s185 + s186 + s187 specs' rg
probes), and the spec-constants re-anchor (the pair-unity family).

THE F40 LAYER RIDER IS ENGAGED this cycle — the S188-A comment-truth
amendment's own +8 lines MOVE the layer (14,365 -> 14,373,
properties-panel.tsx 2,370 -> 2,378); the toBe sites ride in
rider-fixes-s188.py (the named form).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s188.py
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
    ("| Unit tests | Vitest | 5 | 2600 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2613 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2600 checks on the pure domain seams",
     "bun run test              # unit tests — 2613 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2600 checks) | `bun run test` |",
     "| Unit tests (2613 checks) | `bun run test` |"),
    ("`bun run test` (2600) → `bun run build`",
     "`bun run test` (2613) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # the em-dash form; the s187 bullet's paren form is a FROZEN record)
    ("the collateral family — the count-family re-anchor 2600 = 2588 + 12 unit / 249 files (the family's live anchor)",
     "the collateral family — the count-family re-anchor 2613 = 2600 + 13 unit / 250 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2600 checks, Vitest) |",
     "| `bun run test` | Unit tests (2613 checks, Vitest) |"),
    ("(2600 unit / 73 smoke / 262 e2e)",
     "(2613 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2600 checks):",
     "- **Unit Tests** (Vitest, 2613 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2600 unit checks green',
     'project_state: "2613 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2600 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2613 checks;"),
    ("bun run test          # 2600/2600",
     "bun run test          # 2613/2613"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **249 files** | **2600** | | Vitest |",
     "| **Unit total** | **250 files** | **2613** | | Vitest |"),
    ("- [ ] `bun run test` → 2600/2600",
     "- [ ] `bun run test` → 2613/2613"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2600 checks / 249 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2613 checks / 250 files) |"),
])

# --- The §7.1 row for the s188 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S188_ROW = (
    "| Unit — THE EXCLUSION-CLAUSE COMMENT-TRUTH REPAIR + F175 REGISTRATIONS (the one-hundred-and-thirty-sixth audit's chosen work, the SECOND consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since) — 0C/0H/0M/0L/3I, the SECOND consecutive zero-Low cycle, every member informational — one comment-truth clause, one §8 letter posture, one environment note — zero source-code defect, zero mutation surface; the comment-truth census 31 sampled, 30 TRUE / 1 FALSE — the first FALSE census member in three cycles, surfaced by MEASUREMENT DEPTH at the keydown gate): S188-A — THE COMMENT-TRUTH REPAIR (the S185 receipt-count-truth form, A-I-1): the S129-A comment's 'modifier combos must never arm' clause at properties-panel.tsx:509-513 corrected — the gate reads event.key alone (a modifier HELD WITH a member key DOES arm; net-zero: no engine applies a value change to a range input under held modifiers, the idle terminal's changed===false cancel — the at-bound residual's sibling) and the arm-on-any-member-key form registered as the DELIBERATE robust posture (the S130-A wheel lesson — narrowing the gate would re-open the un-armed-change flooding class); comment-text only, but the amendment's own +8 lines MOVE the layer (14,365 -> 14,373, properties-panel.tsx 2,370 -> 2,378 — the F40 rider fully engaged) + S188-B the per-session pin family (13 pins: 7 RED (the source contract + the doc-side collateral) / 6 green-at-birth (the two worklog-registration notes, the F138 guard's THIRTY-NINTH instance — the s187 plan's record pinned 4/4 ticked at 33123311, the script-provenance member, the audit-entry member, the standing-figures member); the MEASURED birth form with TWO pin-form corrections applied at birth (the comment-truth census spelling + the 13-pin census arithmetic — the s159 family) and ONE forecast-to-measured correction applied in-cycle (the +9 forecast corrected onto the +8 measured movement — the s159 measured-form family's own lesson); the constants born rolling-safe at the POST-spec figures 2613/250) and the collateral family (the count-family re-anchor 2613 = 2600 + 13 unit / 250 files; the spec-constants sweep 69 UNIT + 68 FILES with the census-literal lockstep riders for the s185 + s186 + s187 specs' rg probes; the layer-total family MOVING at 14,373 — the +8 the comment amendment's own receipt, the F40 rider fully engaged (the 26 toBe sites + the s186/s187 LAYER_TOTAL constants); the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its fourteenth re-quote cycle; the env census figure 17 sites across 9 vars; the s151..s187 SKILL-version pins onto v1.166.0; the s154..s187 forward-guard rolling re-anchors onto v1.167.0; the s158 title pin onto v1.167.0; the s173..s187 per-spec title-pin riders onto v1.167.0 — the family's sixteenth member; e2e stays 262; smoke stays 73) | `tests/lows-s188.test.ts` | 13 | tests | Vitest |\n"
)
if "lows-s188.test.ts" not in pad_text:
    anchor = "| **Unit total** | **250 files** | **2613** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S188_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s188 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s188 §7.1 row already present")

# --- The AGENTS session-188 bullet (inserted above the s187 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The exclusion-clause comment-truth repair + F175 registration seams (session 188, S188-A..S188-B — the one-hundred-and-thirty-sixth Mode C audit's chosen work, the SECOND consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since) — the auditors' census A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/1I combined 0C/0H/0M/0L/3I, the SECOND consecutive zero-Low cycle, every member informational — one comment-truth clause, one §8 letter posture, one environment note — zero source-code defect, zero mutation surface; the comment-truth census 31+0 sampled / 30 TRUE / 1 FALSE — the first FALSE census member in three cycles, surfaced by MEASUREMENT DEPTH at the keydown gate):** (a) S188-A THE COMMENT-TRUTH REPAIR (A-I-1, the S185 receipt-count-truth form) — the S129-A comment's 'modifier combos must never arm' clause at properties-panel.tsx:509-513 corrected: the gate reads event.key alone, so a modifier HELD WITH a member key (Ctrl/Cmd/Alt+Arrow…) DOES arm — net-zero (no engine applies a value change to a range input under held modifiers; the idle terminal's changed===false cancel, the at-bound residual's sibling) — and the arm-on-any-member-key form registered as the DELIBERATE robust posture (the S130-A wheel lesson: every modality that might change the value arms; narrowing the gate would strand a hypothetical modifier-adjusting engine's changes un-armed against the onChange's unconditional tick() mark, re-opening the per-change history-flooding class); comment-text only in the source file, the amendment's own +8 lines MOVING the layer 14,365 -> 14,373 (properties-panel.tsx 2,370 -> 2,378 — the F40 rider fully engaged); (b) THE F175 LESSON — THE EXCLUSION-CLAUSE TRUTH MEMBER (the F168..F174 record-truth family's next member, at the guard-clause layer): an enumeration guard's prose exclusion clause ('X must never pass') is itself a behavior claim about the guard's discrimination — when the gate tests only the enumerated dimension (SLIDER_KEYS.has(event.key) reads the key alone), any orthogonal dimension held WITH a member value (a modifier + Arrow) passes at the letter, and the clause must name its own discrimination dimension; AND when the over-inclusive arm is the DELIBERATE robust form, the honest repair amends the CLAUSE, never the guard; (c) S188-B the 13-pin spec (7 RED / 6 green-at-birth, the MEASURED birth form with two pin-form corrections at birth — the comment-truth census spelling + the 13-pin census arithmetic, the s159 family — and one forecast-to-measured correction in-cycle: the +9 forecast corrected onto the +8 measured movement; the constants born rolling-safe at 2613/250) with the collateral family (the count-family re-anchor 2613 = 2600 + 13 unit / 250 files (the family's live anchor); the layer-total family MOVING at 14,373 (the F40 rider fully engaged); the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its fourteenth re-quote cycle; the F138 guard's THIRTY-NINTH instance — the s187 plan 4/4 ticked at 33123311; the 164th reference audit NO DRIFT with the clip byte-identical the 125th consecutive session; mobile nav 9/9 the 165th session — the directive's particular focus; pins S128..S187 804/804 across 60 entering).\n"
)
if "session 188, S188-A..S188-B" not in agents_text:
    anchor = "- **The window-start-label correction + F174 registration seams (session 187"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-188 bullet inserted")
else:
    print("AGENTS.md: session-188 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s187 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 188):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.165\\.0" in text:
        text = text.replace("version: 1\\.165\\.0", "version: 1\\.166\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.166.0)")
    elif "version: 1\\.166\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.165.0")' in text:
        text = text.replace('toContain("1.165.0")', 'toContain("1.166.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.165.0")' in text:
        text = text.replace('toContain("version: 1.165.0")', 'toContain("version: 1.166.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.166.0")' in text or 'toContain("version: 1.166.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s187 forward count-truth guards' rolling re-anchors
# (v1.166.0 -> v1.167.0 — the s154 guard's THIRTY-FOURTH rolling
#     instance, the s155 guard's THIRTY-THIRD, ..., the s187 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 188):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.166.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.167.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.166\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.167\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.166.0 -> v1.167.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its twenty-ninth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.166.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.167.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the two-line rider form; every later
#     cycle re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s187 — the
#     s187 spec's title pin joining as the SIXTEENTH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.166\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.167\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.166.0");',
         '    expect(lastUpdated).toContain("v1.167.0");'),
    ])

# (3b) the s185 + s186 + s187 specs' title-pin forms (the family's own
#      shapes — the toMatch single-line form, not the two-line rider
#      form above):
for spec in (185, 186, 187):
    patch(f"tests/lows-s{spec}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.166\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.167\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.166.0");',
         'expect(lastUpdated).toContain("v1.167.0");'),
    ])

# --- the census-literal lockstep rider (the s185 + s186 + s187 specs' rg-census probes) -------
# The s185 + s186 + s187 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s188
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
for spec_name in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts", "tests/lows-s187.test.ts"):
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2600"', '"2613"').replace('"249"', '"250"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(68);", "expect(unitFiles).toBe(69);"),
        ("expect(filesFiles).toBe(67);", "expect(filesFiles).toBe(68);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 68/67 -> 69/68)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2600";' in text:
        assert text.count('const UNIT = "2600";') == 1
        text = text.replace('const UNIT = "2600";', 'const UNIT = "2613";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2613";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "249";' in text:
        assert text.count('const FILES = "249";') == 1
        text = text.replace('const FILES = "249";', 'const FILES = "250";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "250";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
