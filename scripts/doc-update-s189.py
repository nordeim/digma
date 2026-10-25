#!/usr/bin/env python3
"""doc-update-s189.py — the Session 189 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2625 = 2613 + 12 unit / 251 files across every
live claim site, the §7.1 row for the s189 spec, the AGENTS
session-189 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s188 count-truth guards' version literals onto v1.168.0),
the s151..s188 SKILL-version pins onto v1.167.0, the s158 title pin
onto v1.168.0, the s173..s188 per-spec title-pin riders onto v1.168.0
(the family's seventeenth member — the s188 spec's title pin joining),
the census-literal lockstep riders (the s185/s186/s187/s188 specs' rg
probes), and the spec-constants re-anchor (the pair-unity family).

NO F40 layer rider this cycle — the layer STAYS at 14,373 (the
zero-movement form: no source-code movement, no remediation receipt).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s189.py
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
    ("| Unit tests | Vitest | 5 | 2613 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2625 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2613 checks on the pure domain seams",
     "bun run test              # unit tests — 2625 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2613 checks) | `bun run test` |",
     "| Unit tests (2625 checks) | `bun run test` |"),
    ("`bun run test` (2613) → `bun run build`",
     "`bun run test` (2625) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the s188 bullet's paren
    # form is a FROZEN record)
    ("the collateral family — the count-family re-anchor 2613 = 2600 + 13 unit / 250 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2625 = 2613 + 12 unit / 251 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2613 checks, Vitest) |",
     "| `bun run test` | Unit tests (2625 checks, Vitest) |"),
    ("(2613 unit / 73 smoke / 262 e2e)",
     "(2625 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2613 checks):",
     "- **Unit Tests** (Vitest, 2625 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2613 unit checks green',
     'project_state: "2625 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2613 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2625 checks;"),
    ("bun run test          # 2613/2613",
     "bun run test          # 2625/2625"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **250 files** | **2613** | | Vitest |",
     "| **Unit total** | **251 files** | **2625** | | Vitest |"),
    ("- [ ] `bun run test` → 2613/2613",
     "- [ ] `bun run test` → 2625/2625"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2613 checks / 250 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2625 checks / 251 files) |"),
])

# --- The §7.1 row for the s189 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S189_ROW = (
    "| Unit — THE PREMISE-LABEL TRUTH REGISTRATIONS (the one-hundred-and-thirty-seventh audit's chosen work, the THIRD consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since) — 0C/0H/0M/0L/2I, the THIRD consecutive zero-Low cycle, every member informational — one carried §8 letter posture, one premise-label record-precision registration — zero source-code defect, zero mutation surface; the comment-truth census 31 sampled, 31 TRUE / 0 FALSE — the fully-TRUE form's first cycle since S187, the S188-A amendment's own clause now verifying TRUE): S189-A — THE REGISTRATION PAIR (the S187 registration-cycle form, ZERO source-code movement): the s189-id-stable-premises-note at the 64th consecutive cycle carrying the CANONICAL quartet in exactly one place (P1 the twelve-site value-based census at the post-S188-A coordinates :1385/:1749/:1754/:2215; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + THE B-I-1 REGISTRATION (the S188-B worklog entry's divergent quartet composition documented — every underlying fact TRUE in both, frozen records stay frozen per S132-C, the canonical form lives in the bracketed note alone) + the s189-below-threshold-note (THE F176 LESSON — THE PREMISE-LABEL TRUTH MEMBER: a deferral-premise quartet's member labels are themselves record claims — when the same cycle's records carry different quartet compositions, every underlying fact can be true in both while the composition dilutes the canonical form; the honest repair registers the canonical composition in exactly ONE place and registers the divergence, never editing frozen records; AND the dispatch brief must QUOTE the canonical quartet verbatim, never paraphrase it — the divergence's root cause names its own fix + the eighteenth-generation carriers :2855/:2914/:2983 + the s188 row :2854 verified EXACT with the F174-corrected window :2835..:2854 = s169..s188 (20 rows) :2834 the S168 row + the vocabulary-HOLD third consecutive + the honest environment record (the trap caught BEFORE the first db operation) + the F138 FORTIETH instance) + S189-B the per-session pin family (12 pins: 5 RED — the doc-side collateral / 7 green-at-birth — the two worklog-registration notes, the F138 guard's FORTIETH instance (the s188 plan's record pinned 4/4 ticked at f03aceda), the script-provenance member, the audit-entry member, the standing-figures member, the layer-STAYS member; the MEASURED birth form — 5 RED / 7 green exact on the first run, zero pin-form corrections; the constants born rolling-safe at the post-spec figures 2625/251) and the collateral family (the count-family re-anchor 2625 = 2613 + 12 unit / 251 files; the spec-constants sweep 70 UNIT + 69 FILES with the census-literal lockstep riders for the s185 + s186 + s187 + s188 specs' rg probes; the layer-total family STAYING at 14,373 — the zero-movement form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its fifteenth re-quote cycle; the env census figure 17 sites across 9 vars; the s151..s188 SKILL-version pins onto v1.167.0; the s154..s188 forward-guard rolling re-anchors onto v1.168.0; the s158 title pin onto v1.168.0; the s173..s188 per-spec title-pin riders onto v1.168.0 — the family's seventeenth member; e2e stays 262; smoke stays 73) | `tests/lows-s189.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s189.test.ts" not in pad_text:
    anchor = "| **Unit total** | **251 files** | **2625** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S189_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s189 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s189 §7.1 row already present")

# --- The AGENTS session-189 bullet (inserted above the s188 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The premise-label truth registrations (session 189, S189-A..S189-B — the one-hundred-and-thirty-seventh Mode C audit's chosen work, the THIRD consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since; the THIRD consecutive hold) — the auditors' census A 0C/0H/0M/0L/1I + B 0C/0H/0M/0L/1I combined 0C/0H/0M/0L/2I, the THIRD consecutive zero-Low cycle, every member informational — one carried §8 letter posture, one premise-label record-precision registration — zero source-code defect, zero mutation surface; the comment-truth census 31+0 sampled / 31 TRUE / 0 FALSE — the fully-TRUE form's first cycle since S187, the S188-A amendment's own clause now verifying TRUE):** (a) S189-A THE REGISTRATION PAIR (the S187 registration-cycle form, ZERO source-code movement): the s189-id-stable-premises-note at the 64th consecutive cycle carrying the CANONICAL quartet in exactly one place (P1 the twelve-site value-based census at the post-S188-A coordinates — properties-panel :1385/:1749/:1754/:2215, editor-store markSaved :241-281/addElements :354/updateElements :418/scaleElements :469/moveElements :531-567/deleteElements :570/reorderElements :607/toggleVisibility :656/toggleLock :680, layers-panel :39, ai-assistant :401-403/:589; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack :373/:381/:382/:399/:409; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + THE B-I-1 REGISTRATION (the S188-B worklog entry's divergent quartet composition documented — its P2 named the addElement :347 -> addElements :354 batch guards, a canonical-P1 census member, while the canonical P2 is the index-stable remap; every underlying fact TRUE in both, the divergence purely quartet composition; frozen records stay frozen per S132-C, the canonical form lives in the bracketed note alone, every future dispatch brief quotes the canonical quartet verbatim) + the s189-below-threshold-note (THE F176 LESSON — THE PREMISE-LABEL TRUTH MEMBER: a deferral-premise quartet's member labels are themselves record claims — when the same cycle's records carry different quartet compositions, every underlying fact can be true in both while the composition dilutes the canonical form; the honest repair registers the canonical composition in exactly ONE place and registers the divergence, never editing frozen records; AND the dispatch brief must QUOTE the canonical quartet verbatim, never paraphrase it — an auditor composing against a paraphrase re-derives true facts under borrowed labels, and the labels are the claim; + the eighteenth-generation carriers :2855/:2914/:2983 + the s188 row :2854 verified EXACT with the F174-corrected window :2835..:2854 = s169..s188 (20 rows), :2834 the S168 row; + the vocabulary-HOLD registration third consecutive; + the honest environment record — the exported-shell DATABASE_URL trap caught BEFORE the first db operation, the pristine 1/2/6/1/3 form on the FIRST guarded push); (b) S189-B the 12-pin spec (5 RED / 7 green-at-birth exact on the first run, zero pin-form corrections — the MEASURED birth form; the constants born rolling-safe at 2625/251) with the collateral family (the count-family re-anchor 2625 = 2613 + 12 unit / 251 files (the family's live anchor); the layer-total family STAYING at 14,373 (the zero-movement form — no F40 rider needed); the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its fifteenth re-quote cycle; the F138 guard's FORTIETH instance — the s188 plan 4/4 ticked at f03aceda, the sweep s151..s188 at 38 plans 218/0; the 165th reference audit NO DRIFT with the clip byte-identical the 126th consecutive session; mobile nav 9/9 the 166th session; pins S128..S189 829/829 across 62).\n"
)
if "session 189, S189-A..S189-B" not in agents_text:
    anchor = "- **The exclusion-clause comment-truth repair + F175 registration seams (session 188"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-189 bullet inserted")
else:
    print("AGENTS.md: session-189 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s188 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 189):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.166\\.0" in text:
        text = text.replace("version: 1\\.166\\.0", "version: 1\\.167\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.167.0)")
    elif "version: 1\\.167\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.166.0")' in text:
        # the s181/s182/s183/s184 specs' toContain literal form (the spec
        # pins the version line by substring — the rolling re-anchor at
        # the literal layer)
        text = text.replace('toContain("1.166.0")', 'toContain("1.167.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.166.0")' in text:
        # the s185/s186/s187/s188 specs' fuller toContain form (the version-line substring
        # with the field prefix — the rolling re-anchor at the literal layer)
        text = text.replace('toContain("version: 1.166.0")', 'toContain("version: 1.167.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.167.0")' in text or 'toContain("version: 1.167.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s188 forward count-truth guards' rolling re-anchors
# (v1.167.0 -> v1.168.0 — the s154 guard's THIRTY-FIFTH rolling
#     instance, the s155 guard's THIRTY-FOURTH, ..., the s188 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 189):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.167.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.168.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.167\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.168\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.167.0 -> v1.168.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its twenty-ninth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.167.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.168.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s188 — the
#     s188 spec's title pin joining as the SEVENTEENTH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.167\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.168\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.167.0");',
         '    expect(lastUpdated).toContain("v1.168.0");'),
    ])

# (3b) the s185 + s186 + s187 + s188 specs' title-pin forms (the
#      FOURTEENTH..SEVENTEENTH members' own shape — the toMatch
#      single-line form, not the two-line rider form above):
for nn in (185, 186, 187, 188):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.167\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.168\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.167.0");',
         'expect(lastUpdated).toContain("v1.168.0");'),
    ])

# --- the census-literal lockstep rider (the s185/s186/s187/s188 specs' rg-census probes) -------
# The s185..s188 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s189
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
import re as _re
for spec_name in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts", "tests/lows-s187.test.ts", "tests/lows-s188.test.ts"):
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2613"', '"2625"').replace('"250"', '"251"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(69);", "expect(unitFiles).toBe(70);"),
        ("expect(filesFiles).toBe(68);", "expect(filesFiles).toBe(69);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 69/68 -> 70/69)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2613";' in text:
        assert text.count('const UNIT = "2613";') == 1
        text = text.replace('const UNIT = "2613";', 'const UNIT = "2625";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2625";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "250";' in text:
        assert text.count('const FILES = "250";') == 1
        text = text.replace('const FILES = "250";', 'const FILES = "251";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "251";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
