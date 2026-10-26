#!/usr/bin/env python3
"""doc-update-s192.py — the Session 192 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2661 = 2649 + 12 unit / 254 files across every
live claim site, the §7.1 row for the s192 spec, the AGENTS
session-192 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s191 count-truth guards' version literals onto v1.171.0),
the s151..s191 SKILL-version pins onto v1.170.0, the s158 title pin
onto v1.171.0, the s173..s191 per-spec title-pin riders onto v1.171.0
(the family's twentieth member — the s191 spec's title pin joining),
the census-literal lockstep riders (the s185..s191 specs' rg probes),
and the spec-constants re-anchor (the pair-unity family).

NO F40 layer rider this cycle — the layer STAYS at 14,373 (the
zero-movement form: no source-code movement, no remediation receipt).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s192.py
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
    ("| Unit tests | Vitest | 5 | 2649 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2661 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2649 checks on the pure domain seams",
     "bun run test              # unit tests — 2661 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2649 checks) | `bun run test` |",
     "| Unit tests (2661 checks) | `bun run test` |"),
    ("`bun run test` (2649) → `bun run build`",
     "`bun run test` (2661) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the s191/s192 bullets'
    # paren forms are FROZEN records)
    ("the collateral family — the count-family re-anchor 2649 = 2637 + 12 unit / 253 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2661 = 2649 + 12 unit / 254 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2649 checks, Vitest) |",
     "| `bun run test` | Unit tests (2661 checks, Vitest) |"),
    ("(2649 unit / 73 smoke / 262 e2e)",
     "(2661 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2649 checks):",
     "- **Unit Tests** (Vitest, 2661 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2649 unit checks green',
     'project_state: "2661 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2649 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2661 checks;"),
    ("bun run test          # 2649/2649",
     "bun run test          # 2661/2661"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **253 files** | **2649** | | Vitest |",
     "| **Unit total** | **254 files** | **2661** | | Vitest |"),
    ("- [ ] `bun run test` → 2649/2649",
     "- [ ] `bun run test` → 2661/2661"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2649 checks / 253 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2661 checks / 254 files) |"),
])

# --- The §7.1 row for the s192 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S192_ROW = (
    "| Unit — THE CONVENTION-GRADUATION TRUTH REGISTRATIONS (the one-hundred-and-fortieth audit's chosen work, the SIXTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since) — 0C/0H/0M/0L/4I, the SIXTH consecutive zero-Low cycle, every member informational — two carried postures (the §8 letter posture at its fifth consecutive carry; the vocabulary-HOLD at its sixth), two POSITIVE standing-convention verifications (the F177 axis-named dispatch form and the dispatch-currency dual form BOTH verified at their SECOND full-cycle test — graduating per F179) — zero source-code defect, zero mutation surface; the comment-truth census 48 sampled, 48 TRUE / 0 FALSE — the fully-TRUE form's FOURTH consecutive cycle): S192-A — THE REGISTRATION PAIR (the S187/S189/S190/S191 registration-cycle form, ZERO source-code movement): the s192-id-stable-premises-note at the 67th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its THIRD full-cycle test, zero label drift again, the quoting form the standing convention per F178, the graduated form watched per F179; P1 the twelve-site value-based census at the post-S188-A coordinates; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s192-below-threshold-note (THE F179 LESSON — THE CONVENTION-GRADUATION TRUTH MEMBER: a promoted convention's second full-cycle verification graduates it from repair-under-observation to standing infrastructure — from that point the audit's registration duty inverts: the convention's absence from a dispatch becomes itself reportable drift, not merely the presence of a carried form; a convention graduated but unwatched is a convention that can be silently retired — the watch is what keeps the graduation real (this cycle's two positive members being exactly that form: the F177 axis-named trap-4 clause and the dispatch-currency dual form both carried and both closing EXACT at their second full-cycle test) + the dispatch-currency-honored registration (the live HEAD 074cf222 stated at dispatch time matching exactly, zero lag) + the twenty-second-generation carriers :2861/:2920/:2989 + the s191 row :2860 verified EXACT with the F174-corrected window :2838..:2860 = s169..s191 (23 rows) :2837 the S168 row + the vocabulary-HOLD sixth consecutive + the honest environment record (the trap caught BEFORE the first db operation; the smoke gate green on its first guarded invocation — no S110-B trip this cycle) + the F138 FORTY-THIRD instance) + S192-B the per-session pin family (12 pins: 5 RED — the doc-side collateral / 7 green-at-birth — the two worklog-registration notes, the F138 guard's FORTY-THIRD instance (the s191 plan's record pinned 4/4 ticked at 551f5117), the script-provenance member, the audit-entry members (both anchors at their standing spellings), the standing-figures member, the layer-STAYS member; the MEASURED birth form — 5 RED / 7 green EXACT on the first run, zero pin-form corrections at birth (the bracket-free discipline applied at note-writing time — no s159 truncation class this cycle); the constants born rolling-safe at the post-spec figures 2661/254) and the collateral family (the count-family re-anchor 2661 = 2649 + 12 unit / 254 files; the spec-constants sweep 73 UNIT + 72 FILES with the census-literal lockstep riders for the s185 + s186 + s187 + s188 + s189 + s190 + s191 specs' rg probes (seven members); the layer-total family STAYING at 14,373 — the zero-movement form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its eighteenth re-quote cycle; the env census figure 17 sites across 9 vars; the s151..s191 SKILL-version pins onto v1.170.0; the s154..s191 forward-guard rolling re-anchors onto v1.171.0; the s158 title pin onto v1.171.0; the s173..s191 per-spec title-pin riders onto v1.171.0 — the family's twentieth member; e2e stays 262; smoke stays 73) | `tests/lows-s192.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s192.test.ts" not in pad_text:
    anchor = "| **Unit total** | **254 files** | **2661** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S192_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s192 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s192 §7.1 row already present")

# --- The AGENTS session-192 bullet (inserted above the s191 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The convention-graduation truth registrations (session 192, S192-A..S192-B — the one-hundred-and-fortieth Mode C audit's chosen work, the SIXTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since; the SIXTH consecutive hold) — the auditors' census A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/2I combined 0C/0H/0M/0L/4I, the SIXTH consecutive zero-Low cycle, every member informational — two carried postures (the §8 letter posture at its fifth consecutive carry; the vocabulary-HOLD at its sixth), two POSITIVE standing-convention verifications (the F177 axis-named dispatch form and the dispatch-currency dual form BOTH verified at their SECOND full-cycle test — graduating per F179) — zero source-code defect, zero mutation surface; the comment-truth census 48+0 sampled / 48 TRUE / 0 FALSE — the fully-TRUE form's FOURTH consecutive cycle):** (a) S192-A THE REGISTRATION PAIR (the S187/S189/S190/S191 registration-cycle form, ZERO source-code movement): the s192-id-stable-premises-note at the 67th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its THIRD full-cycle test, zero label drift again; P1 the twelve-site value-based census at the post-S188-A coordinates — properties-panel :1385/:1749/:1754/:2215, editor-store markSaved :241-281/addElements :354/updateElements :418/scaleElements :469/moveElements :531-567/deleteElements :570/reorderElements :607/toggleVisibility :656/toggleLock :680, layers-panel :39, ai-assistant :401-403/:589; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack :373/:381/:382/:399/:409; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s192-below-threshold-note (THE F179 LESSON — THE CONVENTION-GRADUATION TRUTH MEMBER: a promoted convention's second full-cycle verification graduates it from repair-under-observation to standing infrastructure — from that point the audit's registration duty inverts: the convention's absence from a dispatch becomes itself reportable drift, not merely the presence of a carried form; a convention graduated but unwatched is a convention that can be silently retired — the watch is what keeps the graduation real (this cycle's two positive members being exactly that form: the F177 axis-named trap-4 clause carried in the auditor-A dispatch with BOTH axes named as separate enumerations and both closing EXACT — single-side one live layer site login-screen.tsx:339, compound the layer sweep EMPTY with the one live src-wide site ui/dropdown-menu.tsx:65 outside the layer; and the dispatch-currency dual form carried in both briefs with the live HEAD 074cf222 stated at dispatch time matching exactly, zero lag); + THE TWENTY-SECOND-GENERATION carriers :2861/:2920/:2989 + the s191 row :2860 verified EXACT with the F174-corrected window :2838..:2860 = s169..s191 (23 rows), :2837 the S168 row; + the vocabulary-HOLD registration sixth consecutive; + the honest environment record — the exported-shell DATABASE_URL trap caught BEFORE the first db operation, the pristine 1/2/6/1/3 form on the FIRST guarded push, the smoke gate green on its FIRST guarded invocation — no S110-B trip this cycle, the guard applied from the first call); (b) S192-B the 12-pin spec (5 RED / 7 green-at-birth EXACT on the first run — zero pin-form corrections at birth, the bracket-free discipline applied at note-writing time; the constants born rolling-safe at 2661/254) with the collateral family (the count-family re-anchor 2661 = 2649 + 12 unit / 254 files (the family's live anchor); the layer-total family STAYING at 14,373 (the zero-movement form — no F40 rider needed); the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its eighteenth re-quote cycle; the F138 guard's FORTY-THIRD instance — the s191 plan 4/4 ticked at 551f5117, the sweep s151..s191 at 41 plans 230/0; the 168th reference audit NO DRIFT with the clip byte-identical the 129th consecutive session; mobile nav 9/9 the 169th session; pins S128..S192 865/865 across 65).\n"
)
if "session 192, S192-A..S192-B" not in agents_text:
    anchor = "- **The repair-verification truth registrations (session 191"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-192 bullet inserted")
else:
    print("AGENTS.md: session-192 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s191 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 192):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.169\\.0" in text:
        text = text.replace("version: 1\\.169\\.0", "version: 1\\.170\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.170.0)")
    elif "version: 1\\.170\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.169.0")' in text:
        # the s181/s182/s183/s184 specs' toContain literal form (the spec
        # pins the version line by substring — the rolling re-anchor at
        # the literal layer)
        text = text.replace('toContain("1.169.0")', 'toContain("1.170.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.169.0")' in text:
        # the s185..s191 specs' fuller toContain form (the version-line substring
        # with the field prefix — the rolling re-anchor at the literal layer)
        text = text.replace('toContain("version: 1.169.0")', 'toContain("version: 1.170.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.170.0")' in text or 'toContain("version: 1.170.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s191 forward count-truth guards' rolling re-anchors
# (v1.170.0 -> v1.171.0 — the s154 guard's THIRTY-NINTH rolling
#     instance, the s155 guard's THIRTY-EIGHTH, ..., the s191 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 192):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.170.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.171.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.170\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.171\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.170.0 -> v1.171.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its thirty-second instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.170.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.171.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s191 — the
#     s191 spec's title pin joining as the TWENTIETH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.170\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.171\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.170.0");',
         '    expect(lastUpdated).toContain("v1.171.0");'),
    ])

# (3b) the s185 + s186 + s187 + s188 + s189 + s190 + s191 specs' title-pin forms (the
#      FIFTEENTH..TWENTIETH members' own shape — the toMatch
#      single-line form, not the two-line rider form above):
for nn in (185, 186, 187, 188, 189, 190, 191):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.170\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.171\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.170.0");',
         'expect(lastUpdated).toContain("v1.171.0");'),
    ])

# --- the census-literal lockstep rider (the s185..s191 specs' rg-census probes) -------
# The s185..s191 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s192
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
import re as _re
for spec_name in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts", "tests/lows-s187.test.ts", "tests/lows-s188.test.ts", "tests/lows-s189.test.ts", "tests/lows-s190.test.ts", "tests/lows-s191.test.ts"):
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2649"', '"2661"').replace('"253"', '"254"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(72);", "expect(unitFiles).toBe(73);"),
        ("expect(filesFiles).toBe(71);", "expect(filesFiles).toBe(72);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 72/71 -> 73/72)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2649";' in text:
        assert text.count('const UNIT = "2649";') == 1
        text = text.replace('const UNIT = "2649";', 'const UNIT = "2661";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2661";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "253";' in text:
        assert text.count('const FILES = "253";') == 1
        text = text.replace('const FILES = "253";', 'const FILES = "254";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "254";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
