#!/usr/bin/env python3
"""doc-update-s194.py — the Session 194 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2685 = 2673 + 12 unit / 256 files across every
live claim site, the L-1 one-figure comment correction (#8200DB ->
#9810FA at globals.css:48 + the AGENTS/PAD mirrors — the in-place
comment-correction form), the §7.1 row for the s194 spec, the AGENTS
session-194 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s193 count-truth guards' version literals onto v1.173.0),
the s151..s193 SKILL-version pins onto v1.172.0, the s158 title pin
onto v1.173.0, the s173..s193 per-spec title-pin riders onto v1.173.0
(the family's twenty-second member — the s193 spec's title pin
joining), the census-literal lockstep riders (the s185..s193 specs'
rg probes — nine members, s193 joining), and the spec-constants
re-anchor (the pair-unity family).

NO F40 layer rider this cycle — the layer STAYS at 14,373 (the
in-place comment-correction form: one comment line changed at
globals.css:48, zero line-count movement).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s194.py
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

# --- THE L-1 FIX (the one-figure comment correction — the in-place form) ------
# The stale purple-600 figure corrected onto the installed dependency's own
# rendering at the three live claim sites (the frozen session_8/9 records
# stay untouched — historical evidence; the §19 code-wins doctrine).
patch("src/app/globals.css", [
    ("purple-600 = #8200DB vs #9333EA",
     "purple-600 = #9810FA vs #9333EA"),
])
patch("AGENTS.md", [
    ("purple-600 `#8200DB` vs `#9333EA`",
     "purple-600 `#9810FA` vs `#9333EA`"),
])
patch("Project_Architecture_Document.md", [
    ("v4 purple-600 = `#8200DB` vs `#9333EA`",
     "v4 purple-600 = `#9810FA` vs `#9333EA`"),
])

# --- README.md — the count rows ----------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2673 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2685 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2673 checks on the pure domain seams",
     "bun run test              # unit tests — 2685 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2673 checks) | `bun run test` |",
     "| Unit tests (2685 checks) | `bun run test` |"),
    ("`bun run test` (2673) → `bun run build`",
     "`bun run test` (2685) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the s193/s194 bullets'
    # paren forms are FROZEN records)
    ("the collateral family — the count-family re-anchor 2673 = 2661 + 12 unit / 255 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2685 = 2673 + 12 unit / 256 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2673 checks, Vitest) |",
     "| `bun run test` | Unit tests (2685 checks, Vitest) |"),
    ("(2673 unit / 73 smoke / 262 e2e)",
     "(2685 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2673 checks):",
     "- **Unit Tests** (Vitest, 2685 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2673 unit checks green',
     'project_state: "2685 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2673 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2685 checks;"),
    ("bun run test          # 2673/2673",
     "bun run test          # 2685/2685"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **255 files** | **2673** | | Vitest |",
     "| **Unit total** | **256 files** | **2685** | | Vitest |"),
    ("- [ ] `bun run test` → 2673/2673",
     "- [ ] `bun run test` → 2685/2685"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2673 checks / 255 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2685 checks / 256 files) |"),
])

# --- The §7.1 row for the s194 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S194_ROW = (
    "| Unit — THE COMMENT-TRUTH REPAIR + PROSE-FIGURES-ARE-CLAIMS REGISTRATIONS (the one-hundred-and-forty-second audit's chosen work, the EIGHTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since) — 0C/0H/0M/1L/4I, the seven-cycle zero-Low streak ended at an honest comment-truth Low, zero behavioral source-code defect, one documentation-truth defect with a three-site fix surface — one comment-truth Low (the stale purple-600 measured figure, corrected in-place), one carried posture (the §8 letter posture at its seventh consecutive carry), one positive steady-state verification (the F179 graduated conventions BOTH confirmed at their FOURTH full-cycle test — the second steady-state cycle, the watch recorded per F180), one dispatch-currency registration, one vocabulary-HOLD registration; the comment-truth census 49 sampled, 48 TRUE / 1 FALSE — the fully-TRUE form's five-cycle streak ended by the fresh-eyes numeric re-derivation, the FALSE member being the Low itself): S194-A — THE REGISTRATION PAIR (the S187..S193 registration-cycle form): the s194-id-stable-premises-note at the 69th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its FIFTH full-cycle test, zero label drift again, the quoting form the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180; P1 the twelve-site value-based census at the post-S188-A coordinates; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s194-below-threshold-note (THE F181 LESSON — THE PROSE-FIGURES-ARE-CLAIMS MEMBER: every figure quoted in prose is a live claim about the current tree; provenance is not proof — the session that first measured a figure is the session that can be wrong, and a carried figure is a claim that stopped being checked the day it was written; the guard: numeric re-derivation of every figure a sampled comment carries, illustrative figures included — a reader cannot tell operative from illustrative until it is wrong — and the same rule for dispatch briefs and doc mirrors; the census did its job this cycle — the fully-TRUE streak ended not by sampling less but by deriving more) + the L-1 comment-truth registration (the one-figure correction onto the installed dependency's own rendering at the three live claim sites — globals.css:48 + the AGENTS/PAD mirrors, one commit, same-commit lockstep, the frozen session-8/9 records untouched; zero rendering impact — the purple-600 token pinned to the v3 hex at globals.css:97, the app never consuming the v4 default, palette-pins 14/14) + the twenty-fourth-generation carriers :2865/:2924/:2993 + the s193 row :2864 verified EXACT with the F174-corrected window :2840..:2864 = s169..s193 (25 rows) :2839 the s168 row + the vocabulary-HOLD eighth consecutive + the honest environment record (the SANDBOX-RESET form — the workspace reset between sessions, the fresh clone verified before the gates rode it, the DB re-seeded pristine, chromium-1248 re-provisioned before the first e2e; the trap caught before the first db operation) + the F138 FORTY-FIFTH instance) + S194-B the per-session pin family (12 pins: 5 RED — the doc-side collateral + the L-1 fix's own regression pin / 7 green-at-birth — the two worklog-registration notes, the F138 guard's FORTY-FIFTH instance (the s193 plan's record pinned 4/4 ticked at fb2ac5c2), the script-provenance member, the audit-entry members (both anchors at their standing spellings), the standing-figures member, the layer-STAYS member; the MEASURED birth form — 5 RED / 7 green EXACT on the first run, zero pin-form corrections at birth (the bracket-free discipline applied at note-writing time); the constants born rolling-safe at the post-spec figures 2685/256) and the collateral family (the count-family re-anchor 2685 = 2673 + 12 unit / 256 files; the spec-constants sweep 75 UNIT + 74 FILES with the census-literal lockstep riders for the s185..s193 specs' rg probes (nine members — s193 joining); the layer-total family STAYING at 14,373 — the in-place comment-correction form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its twentieth re-quote cycle; the env census figure 17 sites across 9 vars; the s151..s193 SKILL-version pins onto v1.172.0; the s154..s193 forward-guard rolling re-anchors onto v1.173.0; the s158 title pin onto v1.173.0; the s173..s193 per-spec title-pin riders onto v1.173.0 — the family's twenty-second member; e2e stays 262; smoke stays 73) | `tests/lows-s194.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s194.test.ts" not in pad_text:
    anchor = "| **Unit total** | **256 files** | **2685** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S194_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s194 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s194 §7.1 row already present")

# --- The AGENTS session-194 bullet (inserted above the s193 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The comment-truth repair + prose-figures-are-claims registrations (session 194, S194-A..S194-B — the one-hundred-and-forty-second Mode C audit's chosen work, the EIGHTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since; the EIGHTH consecutive hold) — the auditors' census A 0C/0H/0M/1L/2I + B 0C/0H/0M/0L/2I combined 0C/0H/0M/1L/4I, the seven-cycle zero-Low streak ended at an honest comment-truth Low, zero behavioral source-code defect, one documentation-truth defect with a three-site fix surface — one comment-truth Low (the stale purple-600 measured figure at globals.css:48, corrected in-place onto the installed dependency's own rendering at all three live claim sites), one carried posture (the §8 letter posture at its seventh consecutive carry), one positive steady-state verification (the F179 graduated conventions BOTH confirmed at their FOURTH full-cycle test — the second steady-state cycle, the watch recorded per F180), one dispatch-currency registration, one vocabulary-HOLD registration; the comment-truth census 49+0 sampled / 48 TRUE / 1 FALSE — the fully-TRUE form's five-cycle streak ended by the fresh-eyes numeric re-derivation, the FALSE member being the Low itself):** (a) S194-A THE REGISTRATION PAIR (the S187..S193 registration-cycle form): the s194-id-stable-premises-note at the 69th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its FIFTH full-cycle test, zero label drift again; P1 the twelve-site value-based census at the post-S188-A coordinates — properties-panel :1385/:1749/:1754/:2215, editor-store markSaved :241-281/addElements :354/updateElements :418/scaleElements :469/moveElements :531-567/deleteElements :570/reorderElements :607/toggleVisibility :656/toggleLock :680, layers-panel :39, ai-assistant :401-403/:589; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack :373/:381/:382/:399/:409; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s194-below-threshold-note (THE F181 LESSON — THE PROSE-FIGURES-ARE-CLAIMS MEMBER: every figure quoted in prose is a live claim about the current tree; provenance is not proof — the session that first measured a figure is the session that can be wrong, and a carried figure is a claim that stopped being checked the day it was written; the guard: numeric re-derivation of every figure a sampled comment carries, illustrative figures included, and the same rule for dispatch briefs and doc mirrors — a figure without a live derivation is a claim, and a claim can be false; the census did its job this cycle — the fully-TRUE streak ended not by sampling less but by deriving more) + THE TWENTY-FOURTH-GENERATION carriers :2865/:2924/:2993 + the s193 row :2864 verified EXACT with the F174-corrected window :2840..:2864 = s169..s193 (25 rows), :2839 the s168 row; + the vocabulary-HOLD registration eighth consecutive; + the honest environment record — the SANDBOX-RESET form: the workspace reset between sessions (the prior session's tool-layer outage), the fresh clone at 8b32bebc verified before the gates rode it (a fresh 477-package install, the DB re-created at the repo root and re-seeded to the pristine 1/2/6/1/3 census, chromium-1248 re-provisioned BEFORE the first e2e — the S167-incident shape pre-empted), the exported-shell DATABASE_URL trap caught BEFORE the first db operation, every db-touching command guarded from the first call); (b) S194-B the 12-pin spec (5 RED / 7 green-at-birth EXACT on the first run — zero pin-form corrections at birth, the bracket-free discipline applied at note-writing time; the constants born rolling-safe at 2685/256) with the collateral family (the count-family re-anchor 2685 = 2673 + 12 unit / 256 files (the family's live anchor); the L-1 one-figure correction at the three live claim sites — the in-place comment-correction form; the layer-total family STAYING at 14,373 (the in-place comment-correction form — no F40 rider needed); the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its twentieth re-quote cycle; the F138 guard's FORTY-FIFTH instance — the s193 plan 4/4 ticked at fb2ac5c2, the sweep s151..s193 at 43 plans 238/0; the 170th reference audit NO DRIFT with the clip byte-identical the 131st consecutive session; mobile nav 9/9 the 171st session; pins S128..S194 889/889 across 67).\n"
)
if "session 194, S194-A..S194-B" not in agents_text:
    anchor = "- **The steady-state watch registrations (session 193"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-194 bullet inserted")
else:
    print("AGENTS.md: session-194 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s193 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 194):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.171\\.0" in text:
        text = text.replace("version: 1\\.171\\.0", "version: 1\\.172\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.172.0)")
    elif "version: 1\\.172\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.171.0")' in text:
        # the s181/s182/s183/s184 specs' toContain literal form (the spec
        # pins the version line by substring — the rolling re-anchor at
        # the literal layer)
        text = text.replace('toContain("1.171.0")', 'toContain("1.172.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.171.0")' in text:
        # the s185..s193 specs' fuller toContain form (the version-line substring
        # with the field prefix — the rolling re-anchor at the literal layer)
        text = text.replace('toContain("version: 1.171.0")', 'toContain("version: 1.172.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.172.0")' in text or 'toContain("version: 1.172.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s193 forward count-truth guards' rolling re-anchors
# (v1.172.0 -> v1.173.0 — the s154 guard's FORTY-FIRST rolling
#     instance, the s155 guard's FORTIETH, ..., the s193 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 194):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.172.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.173.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.172\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.173\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.172.0 -> v1.173.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its thirty-fourth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.172.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.173.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s193 — the
#     s193 spec's title pin joining as the TWENTY-SECOND member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.172\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.173\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.172.0");',
         '    expect(lastUpdated).toContain("v1.173.0");'),
    ])

# (3b) the s185 + s186 + s187 + s188 + s189 + s190 + s191 + s192 + s193 specs'
#      title-pin forms (the SIXTEENTH..TWENTY-SECOND members' own shape — the
#      toMatch single-line form, not the two-line rider form above):
for nn in (185, 186, 187, 188, 189, 190, 191, 192, 193):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.172\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.173\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.172.0");',
         'expect(lastUpdated).toContain("v1.173.0");'),
    ])

# --- the census-literal lockstep rider (the s185..s193 specs' rg-census probes) -------
# The s185..s193 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s194
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
import re as _re
for spec_name in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts", "tests/lows-s187.test.ts", "tests/lows-s188.test.ts", "tests/lows-s189.test.ts", "tests/lows-s190.test.ts", "tests/lows-s191.test.ts", "tests/lows-s192.test.ts", "tests/lows-s193.test.ts"):
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2673"', '"2685"').replace('"255"', '"256"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(74);", "expect(unitFiles).toBe(75);"),
        ("expect(filesFiles).toBe(73);", "expect(filesFiles).toBe(74);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 74/73 -> 75/74)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2673";' in text:
        assert text.count('const UNIT = "2673";') == 1
        text = text.replace('const UNIT = "2673";', 'const UNIT = "2685";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2685";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "255";' in text:
        assert text.count('const FILES = "255";') == 1
        text = text.replace('const FILES = "255";', 'const FILES = "256";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "256";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
