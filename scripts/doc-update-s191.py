#!/usr/bin/env python3
"""doc-update-s191.py — the Session 191 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2649 = 2637 + 12 unit / 253 files across every
live claim site, the §7.1 row for the s191 spec, the AGENTS
session-191 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s190 count-truth guards' version literals onto v1.170.0),
the s151..s190 SKILL-version pins onto v1.169.0, the s158 title pin
onto v1.170.0, the s173..s190 per-spec title-pin riders onto v1.170.0
(the family's nineteenth member — the s190 spec's title pin joining),
the census-literal lockstep riders (the s185..s190 specs' rg probes),
and the spec-constants re-anchor (the pair-unity family).

NO F40 layer rider this cycle — the layer STAYS at 14,373 (the
zero-movement form: no source-code movement, no remediation receipt).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s191.py
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
    ("| Unit tests | Vitest | 5 | 2637 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2649 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2637 checks on the pure domain seams",
     "bun run test              # unit tests — 2649 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2637 checks) | `bun run test` |",
     "| Unit tests (2649 checks) | `bun run test` |"),
    ("`bun run test` (2637) → `bun run build`",
     "`bun run test` (2649) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the s190/s191 bullets'
    # paren forms are FROZEN records)
    ("the collateral family — the count-family re-anchor 2637 = 2625 + 12 unit / 252 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2649 = 2637 + 12 unit / 253 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2637 checks, Vitest) |",
     "| `bun run test` | Unit tests (2649 checks, Vitest) |"),
    ("(2637 unit / 73 smoke / 262 e2e)",
     "(2649 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2637 checks):",
     "- **Unit Tests** (Vitest, 2649 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2637 unit checks green',
     'project_state: "2649 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2637 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2649 checks;"),
    ("bun run test          # 2637/2637",
     "bun run test          # 2649/2649"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **252 files** | **2637** | | Vitest |",
     "| **Unit total** | **253 files** | **2649** | | Vitest |"),
    ("- [ ] `bun run test` → 2637/2637",
     "- [ ] `bun run test` → 2649/2649"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2637 checks / 252 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2649 checks / 253 files) |"),
])

# --- The §7.1 row for the s191 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S191_ROW = (
    "| Unit — THE REPAIR-VERIFICATION TRUTH REGISTRATIONS (the one-hundred-and-thirty-ninth audit's chosen work, the FIFTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since) — 0C/0H/0M/0L/4I, the FIFTH consecutive zero-Low cycle, every member informational — two carried postures (the §8 letter posture at its fourth consecutive carry; the vocabulary-HOLD at its fifth), two POSITIVE repair-verification registrations (the F177 axis-named dispatch form verified WORKING at its first full-cycle test; the dispatch-currency dual form honored EXACT) — zero source-code defect, zero mutation surface; the comment-truth census 48 sampled, 48 TRUE / 0 FALSE — the fully-TRUE form's THIRD consecutive cycle): S191-A — THE REGISTRATION PAIR (the S187/S189/S190 registration-cycle form, ZERO source-code movement): the s191-id-stable-premises-note at the 66th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its SECOND full-cycle test, zero label drift again, the quoting form the standing convention per F178; P1 the twelve-site value-based census at the post-S188-A coordinates; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s191-below-threshold-note (THE F178 LESSON — THE REPAIR-VERIFICATION TRUTH MEMBER: a prescribed repair's first full-cycle test is itself a recordable event — when a lesson prescribes a repaired form (the F177 axis-named enumeration; the dispatch-currency form), the next cycle's dispatch must carry the repaired form, and when the test passes, the honest registration records the verification AND promotes the repaired form to the standing convention, so the pre-repair form can never silently return; a repair verified but unregistered is a repair that can be quietly dropped — the registration is what turns a one-cycle fix into a convention + the dispatch-currency-honored registration (the live HEAD stated at dispatch time matching exactly, zero lag) + the twenty-first-generation carriers :2859/:2918/:2987 + the s190 row :2858 verified EXACT with the F174-corrected window :2837..:2858 = s169..s190 (22 rows) :2836 the S168 row + the vocabulary-HOLD fifth consecutive + the honest environment record (the trap caught BEFORE the first db operation; the smoke gate green on its first guarded invocation — no S110-B trip this cycle) + the F138 FORTY-SECOND instance) + S191-B the per-session pin family (12 pins: 5 RED — the doc-side collateral / 7 green-at-birth — the two worklog-registration notes, the F138 guard's FORTY-SECOND instance (the s190 plan's record pinned 4/4 ticked at 524c4b80), the script-provenance member, the audit-entry members (both anchors at their standing spellings — the s190 B-anchor divergence not recurring), the standing-figures member, the layer-STAYS member; the MEASURED birth form — 5 RED / 7 green EXACT on the first run, zero pin-form corrections at birth (the bracket-free discipline applied at note-writing time — no s159 truncation class this cycle); the constants born rolling-safe at the post-spec figures 2649/253) and the collateral family (the count-family re-anchor 2649 = 2637 + 12 unit / 253 files; the spec-constants sweep 72 UNIT + 71 FILES with the census-literal lockstep riders for the s185 + s186 + s187 + s188 + s189 + s190 specs' rg probes (six members); the layer-total family STAYING at 14,373 — the zero-movement form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its seventeenth re-quote cycle; the env census figure 17 sites across 9 vars; the s151..s190 SKILL-version pins onto v1.169.0; the s154..s190 forward-guard rolling re-anchors onto v1.170.0; the s158 title pin onto v1.170.0; the s173..s190 per-spec title-pin riders onto v1.170.0 — the family's nineteenth member; e2e stays 262; smoke stays 73) | `tests/lows-s191.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s191.test.ts" not in pad_text:
    anchor = "| **Unit total** | **253 files** | **2649** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S191_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s191 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s191 §7.1 row already present")

# --- The AGENTS session-191 bullet (inserted above the s190 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The repair-verification truth registrations (session 191, S191-A..S191-B — the one-hundred-and-thirty-ninth Mode C audit's chosen work, the FIFTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since; the FIFTH consecutive hold) — the auditors' census A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/2I combined 0C/0H/0M/0L/4I, the FIFTH consecutive zero-Low cycle, every member informational — two carried postures (the §8 letter posture at its fourth consecutive carry; the vocabulary-HOLD at its fifth), two POSITIVE repair-verification registrations (the F177 axis-named dispatch form verified WORKING at its first full-cycle test; the dispatch-currency dual form honored EXACT) — zero source-code defect, zero mutation surface; the comment-truth census 48+0 sampled / 48 TRUE / 0 FALSE — the fully-TRUE form's THIRD consecutive cycle):** (a) S191-A THE REGISTRATION PAIR (the S187/S189/S190 registration-cycle form, ZERO source-code movement): the s191-id-stable-premises-note at the 66th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its SECOND full-cycle test, zero label drift again; P1 the twelve-site value-based census at the post-S188-A coordinates — properties-panel :1385/:1749/:1754/:2215, editor-store markSaved :241-281/addElements :354/updateElements :418/scaleElements :469/moveElements :531-567/deleteElements :570/reorderElements :607/toggleVisibility :656/toggleLock :680, layers-panel :39, ai-assistant :401-403/:589; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack :373/:381/:382/:399/:409; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s191-below-threshold-note (THE F178 LESSON — THE REPAIR-VERIFICATION TRUTH MEMBER: a prescribed repair's first full-cycle test is itself a recordable event — when a lesson prescribes a repaired form, the next cycle's dispatch must carry the repaired form, and when the test passes, the honest registration records the verification AND promotes the repaired form to the standing convention, so the pre-repair form can never silently return; a repair verified but unregistered is a repair that can be quietly dropped — the registration is what turns a one-cycle fix into a convention (this cycle's two positive members being exactly that form: the F177 axis-named trap-4 clause carried in the auditor-A dispatch with BOTH axes named as separate enumerations and both closing EXACT — single-side one live layer site login-screen.tsx:339, compound the layer sweep EMPTY with the one live src-wide site ui/dropdown-menu.tsx:65 outside the layer; and the dispatch-currency dual form carried in both briefs with the live HEAD stated at dispatch time matching exactly, zero lag); + THE TWENTY-FIRST-GENERATION carriers :2859/:2918/:2987 + the s190 row :2858 verified EXACT with the F174-corrected window :2837..:2858 = s169..s190 (22 rows), :2836 the S168 row; + the vocabulary-HOLD registration fifth consecutive; + the honest environment record — the exported-shell DATABASE_URL trap caught BEFORE the first db operation, the pristine 1/2/6/1/3 form on the FIRST guarded push, the smoke gate green on its FIRST guarded invocation — no S110-B trip this cycle, the guard applied from the first call); (b) S191-B the 12-pin spec (5 RED / 7 green-at-birth EXACT on the first run — zero pin-form corrections at birth, the bracket-free discipline applied at note-writing time; the constants born rolling-safe at 2649/253) with the collateral family (the count-family re-anchor 2649 = 2637 + 12 unit / 253 files (the family's live anchor); the layer-total family STAYING at 14,373 (the zero-movement form — no F40 rider needed); the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its seventeenth re-quote cycle; the F138 guard's FORTY-SECOND instance — the s190 plan 4/4 ticked at 524c4b80, the sweep s151..s190 at 40 plans 226/0; the 167th reference audit NO DRIFT with the clip byte-identical the 128th consecutive session; mobile nav 9/9 the 168th session; pins S128..S191 853/853 across 64).\n"
)
if "session 191, S191-A..S191-B" not in agents_text:
    anchor = "- **The enumeration-axis truth registrations (session 190"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-191 bullet inserted")
else:
    print("AGENTS.md: session-191 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s190 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 191):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.168\\.0" in text:
        text = text.replace("version: 1\\.168\\.0", "version: 1\\.169\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.169.0)")
    elif "version: 1\\.169\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.168.0")' in text:
        # the s181/s182/s183/s184 specs' toContain literal form (the spec
        # pins the version line by substring — the rolling re-anchor at
        # the literal layer)
        text = text.replace('toContain("1.168.0")', 'toContain("1.169.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.168.0")' in text:
        # the s185..s190 specs' fuller toContain form (the version-line substring
        # with the field prefix — the rolling re-anchor at the literal layer)
        text = text.replace('toContain("version: 1.168.0")', 'toContain("version: 1.169.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.169.0")' in text or 'toContain("version: 1.169.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s190 forward count-truth guards' rolling re-anchors
# (v1.169.0 -> v1.170.0 — the s154 guard's THIRTY-SEVENTH rolling
#     instance, the s155 guard's THIRTY-SIXTH, ..., the s190 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 191):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.169.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.170.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.169\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.170\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.169.0 -> v1.170.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its thirty-first instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.169.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.170.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s190 — the
#     s190 spec's title pin joining as the NINETEENTH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.169\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.170\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.169.0");',
         '    expect(lastUpdated).toContain("v1.170.0");'),
    ])

# (3b) the s185 + s186 + s187 + s188 + s189 + s190 specs' title-pin forms (the
#      FIFTEENTH..NINETEENTH members' own shape — the toMatch
#      single-line form, not the two-line rider form above):
for nn in (185, 186, 187, 188, 189, 190):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.169\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.170\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.169.0");',
         'expect(lastUpdated).toContain("v1.170.0");'),
    ])

# --- the census-literal lockstep rider (the s185..s190 specs' rg-census probes) -------
# The s185..s190 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s191
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
import re as _re
for spec_name in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts", "tests/lows-s187.test.ts", "tests/lows-s188.test.ts", "tests/lows-s189.test.ts", "tests/lows-s190.test.ts"):
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2637"', '"2649"').replace('"252"', '"253"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(71);", "expect(unitFiles).toBe(72);"),
        ("expect(filesFiles).toBe(70);", "expect(filesFiles).toBe(71);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 71/70 -> 72/71)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2637";' in text:
        assert text.count('const UNIT = "2637";') == 1
        text = text.replace('const UNIT = "2637";', 'const UNIT = "2649";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2649";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "252";' in text:
        assert text.count('const FILES = "252";') == 1
        text = text.replace('const FILES = "252";', 'const FILES = "253";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "253";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
