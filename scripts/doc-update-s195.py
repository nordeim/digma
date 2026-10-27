#!/usr/bin/env python3
"""doc-update-s195.py — the Session 195 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2697 = 2685 + 12 unit / 257 files across every
live claim site, the L-1 one-figure comment correction (12006 ->
12002 at src/lib/editor.ts:386 — the in-place comment-correction
form, ONE live claim site), the §7.1 row for the s195 spec, the AGENTS
session-195 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s194 count-truth guards' version literals onto v1.174.0),
the s151..s194 SKILL-version pins onto v1.173.0, the s158 title pin
onto v1.174.0, the s173..s194 per-spec title-pin riders onto v1.174.0
(the family's twenty-third member — the s194 spec's title pin
joining), the census-literal lockstep riders (the s185..s194 specs'
rg probes — ten members, s194 joining), and the spec-constants
re-anchor (the pair-unity family).

NO F40 layer rider this cycle — the layer STAYS at 14,373 (the
in-place comment-correction form: one comment line changed at
editor.ts:386, zero line-count movement).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s195.py
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
# The stale illustrative wire-length figure corrected onto the deterministic
# re-derivation at the ONE live claim site (the frozen session-117 records
# stay untouched — historical evidence; the §19 code-wins doctrine).
patch("src/lib/editor.ts", [
    ("but 12006 on the wire",
     "but 12002 on the wire"),
])

# --- README.md — the count rows ----------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2685 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2697 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2685 checks on the pure domain seams",
     "bun run test              # unit tests — 2697 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2685 checks) | `bun run test` |",
     "| Unit tests (2697 checks) | `bun run test` |"),
    ("`bun run test` (2685) → `bun run build`",
     "`bun run test` (2697) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the s193/s194/s195 bullets'
    # paren forms are FROZEN records)
    ("the collateral family — the count-family re-anchor 2685 = 2673 + 12 unit / 256 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2697 = 2685 + 12 unit / 257 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2685 checks, Vitest) |",
     "| `bun run test` | Unit tests (2697 checks, Vitest) |"),
    ("(2685 unit / 73 smoke / 262 e2e)",
     "(2697 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2685 checks):",
     "- **Unit Tests** (Vitest, 2697 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2685 unit checks green',
     'project_state: "2697 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2685 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2697 checks;"),
    ("bun run test          # 2685/2685",
     "bun run test          # 2697/2697"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **256 files** | **2685** | | Vitest |",
     "| **Unit total** | **257 files** | **2697** | | Vitest |"),
    ("- [ ] `bun run test` → 2685/2685",
     "- [ ] `bun run test` → 2697/2697"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2685 checks / 256 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2697 checks / 257 files) |"),
])

# --- The §7.1 row for the s195 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S195_ROW = (
    "| Unit — THE COMMENT-TRUTH REPAIR + CATCHER-CAN-BE-CAUGHT REGISTRATIONS (the one-hundred-and-forty-third audit's chosen work, the NINTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since) — 0C/0H/0M/1L/4I, a second consecutive comment-truth Low, zero behavioral source-code defect, one documentation-truth defect with a ONE-SITE fix surface — one comment-truth Low (the stale illustrative wire-length figure at editor.ts:386, corrected in-place), one carried posture (the §8 letter posture at its eighth consecutive carry), one positive steady-state verification (the F179 graduated conventions BOTH confirmed at their FIFTH full-cycle test — the third steady-state cycle, the watch recorded per F180), one dispatch-brief-side F181-class catch (B-I-1 — the lead's own brief's ceiling parenthetical), one probe-precision catch (B-I-2 — the literal probe form and the report's own probe figure); the comment-truth census 49 sampled, 48 TRUE / 1 FALSE — the second FALSE member in two cycles, both illustrative figures, both caught by the fresh-eyes numeric re-derivation, the FALSE member being the Low itself): S195-A — THE REGISTRATION PAIR (the S187..S194 registration-cycle form): the s195-id-stable-premises-note at the 70th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its SIXTH full-cycle test, zero label drift again, the quoting form the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180; P1 the twelve-site value-based census at the post-S188-A coordinates; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s195-below-threshold-note (THE F182 LESSON — THE CATCHER-CAN-BE-CAUGHT MEMBER: the F181 prose-figures-are-claims doctrine reflected onto the audit apparatus itself — the numeric re-derivation rule binds every figure in the chain, the tree's comments, the doc mirrors, the dispatch briefs, AND the audit reports' own probe figures; this cycle the F181 class caught the lead's own brief (the ceiling parenthetical) and the report's own probe figure (the corrected-probe count not reproducing verbatim); the catcher can be caught; the guard: every figure the apparatus states — briefs, reports, plans — is a claim subject to the same live re-derivation, and probe commands are stated in their exact reproducible form with their output verified) + the L-1 comment-truth registration (the one-figure in-place correction 12006 to 12002 at the ONE live claim site editor.ts:386, one commit; the deterministic re-derivation 12002 = 2000 control chars x the 6-char JSON escape + the 2 quotes, no 2000-char string able to serialize to 12006; the seam's own arithmetic correct and unit-pinned, zero behavioral surface) + the twenty-fifth-generation carriers :2867/:2926/:2995 + the s194 row :2866 verified EXACT with the F174-corrected window :2842..:2866 = s170..s194 (25 rows) :2841 the s169 row :2840 the s168 row + the vocabulary-HOLD ninth consecutive + the honest environment record (the SANDBOX-RESET form — the workspace reset between sessions again, the fresh clone verified before the gates rode it, the DB re-seeded pristine, chromium-1248 re-provisioned before the first e2e; the trap caught before the first db operation) + the F138 FORTY-SIXTH instance) + S195-B the per-session pin family (12 pins: 5 RED — the doc-side collateral + the L-1 fix's own regression pin / 7 green-at-birth — the two worklog-registration notes, the F138 guard's FORTY-SIXTH instance (the s194 plan's record pinned 5/5 ticked at d1eb9468), the script-provenance member, the audit-entry members (both anchors at their standing spellings), the standing-figures member, the layer-STAYS member; the MEASURED birth form — 5 RED / 7 green EXACT (the first run's sixth RED an audit-entry arithmetic-string correction at the worklog entry, not a pin-form correction — the spec itself born correct); the constants born rolling-safe at the post-spec figures 2697/257) and the collateral family (the count-family re-anchor 2697 = 2685 + 12 unit / 257 files; the spec-constants sweep 76 UNIT + 75 FILES with the census-literal lockstep riders for the s185..s194 specs' rg probes (ten members — s194 joining); the layer-total family STAYING at 14,373 — the in-place comment-correction form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its twenty-first re-quote cycle; the env census figure 17 sites across 9 vars; the s151..s194 SKILL-version pins onto v1.173.0; the s154..s194 forward-guard rolling re-anchors onto v1.174.0; the s158 title pin onto v1.174.0; the s173..s194 per-spec title-pin riders onto v1.174.0 — the family's twenty-third member; e2e stays 262; smoke stays 73) | `tests/lows-s195.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s195.test.ts" not in pad_text:
    anchor = "| **Unit total** | **257 files** | **2697** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S195_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s195 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s195 §7.1 row already present")

# --- The AGENTS session-195 bullet (inserted above the s194 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The comment-truth repair + catcher-can-be-caught registrations (session 195, S195-A..S195-B — the one-hundred-and-forty-third Mode C audit's chosen work, the NINTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since; the NINTH consecutive hold) — the auditors' census A 0C/0H/0M/1L/2I + B 0C/0H/0M/0L/2I combined 0C/0H/0M/1L/4I, a second consecutive comment-truth Low, zero behavioral source-code defect, one documentation-truth defect with a ONE-SITE fix surface — one comment-truth Low (the stale illustrative wire-length figure at editor.ts:386, corrected in-place onto the deterministic re-derivation), one carried posture (the §8 letter posture at its eighth consecutive carry), one positive steady-state verification (the F179 graduated conventions BOTH confirmed at their FIFTH full-cycle test — the third steady-state cycle, the watch recorded per F180), one dispatch-brief-side F181-class catch (B-I-1 — the lead's own brief's ceiling parenthetical), one probe-precision catch (B-I-2 — the literal probe form and the report's own probe figure); the comment-truth census 49 sampled / 48 TRUE / 1 FALSE — the second FALSE member in two cycles, both illustrative figures, both caught by the fresh-eyes numeric re-derivation, the FALSE member being the Low itself):** (a) S195-A THE REGISTRATION PAIR (the S187..S194 registration-cycle form): the s195-id-stable-premises-note at the 70th consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its SIXTH full-cycle test, zero label drift again; P1 the twelve-site value-based census at the post-S188-A coordinates — properties-panel :1385/:1749/:1754/:2215, editor-store markSaved :241-281/addElements :354/updateElements :418/scaleElements :469/moveElements :531-567/deleteElements :570/reorderElements :607/toggleVisibility :656/toggleLock :680, layers-panel :39, ai-assistant :401-403/:589; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack :373/:381/:382/:399/:409; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s195-below-threshold-note (THE F182 LESSON — THE CATCHER-CAN-BE-CAUGHT MEMBER: the F181 prose-figures-are-claims doctrine reflected onto the audit apparatus itself — the numeric re-derivation rule binds every figure in the chain, the tree's comments, the doc mirrors, the dispatch briefs, AND the audit reports' own probe figures; this cycle the F181 class caught the lead's own brief (B-I-1's ceiling parenthetical — elements 500/projects 100 stated where the code truth is 2000/500/500/100/100) and the report's own probe figure (B-I-2's corrected-probe count not reproducing verbatim); the catcher can be caught; the guard: every figure the apparatus states — briefs, reports, plans — is a claim subject to the same live re-derivation, and probe commands are stated in their exact reproducible form with their output verified) + THE TWENTY-FIFTH-GENERATION carriers :2867/:2926/:2995 + the s194 row :2866 verified EXACT with the F174-corrected window :2842..:2866 = s170..s194 (25 rows), :2841 the s169 row, :2840 the s168 row; + the vocabulary-HOLD registration ninth consecutive; + the honest environment record — the SANDBOX-RESET form again: the workspace reset between sessions, the fresh clone at 7be5ca31 verified before the gates rode it (a fresh 477-package install, the DB re-created at the repo root and re-seeded to the pristine 1/2/6/1/3 census, chromium-1248 re-provisioned BEFORE the first e2e — the S167-incident shape pre-empted), the exported-shell DATABASE_URL trap caught BEFORE the first db operation, every db-touching command guarded from the first call); (b) S195-B the 12-pin spec (5 RED / 7 green-at-birth EXACT — the first run's sixth RED an audit-entry arithmetic-string correction at the worklog entry, not a pin-form correction, the spec itself born correct; the constants born rolling-safe at 2697/257) with the collateral family (the count-family re-anchor 2697 = 2685 + 12 unit / 257 files (the family's live anchor); the L-1 one-figure correction at the ONE live claim site — the in-place comment-correction form; the layer-total family STAYING at 14,373 (the in-place comment-correction form — no F40 rider needed); the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its twenty-first re-quote cycle; the F138 guard's FORTY-SIXTH instance — the s194 plan 5/5 ticked at d1eb9468, the sweep s151..s194 at 44 plans 243/0; the 171st reference audit NO DRIFT with the clip byte-identical the 132nd consecutive session; mobile nav 9/9 the 172nd session; pins S128..S195 901/901 across 68).\n"
)
if "session 195, S195-A..S195-B" not in agents_text:
    anchor = "- **The comment-truth repair + prose-figures-are-claims registrations (session 194"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-195 bullet inserted")
else:
    print("AGENTS.md: session-195 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s194 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 195):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.172\\.0" in text:
        text = text.replace("version: 1\\.172\\.0", "version: 1\\.173\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.173.0)")
    elif "version: 1\\.173\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.172.0")' in text:
        # the s181/s182/s183/s184 specs' toContain literal form (the spec
        # pins the version line by substring — the rolling re-anchor at
        # the literal layer)
        text = text.replace('toContain("1.172.0")', 'toContain("1.173.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.172.0")' in text:
        # the s185..s194 specs' fuller toContain form (the version-line substring
        # with the field prefix — the rolling re-anchor at the literal layer)
        text = text.replace('toContain("version: 1.172.0")', 'toContain("version: 1.173.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.173.0")' in text or 'toContain("version: 1.173.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s194 forward count-truth guards' rolling re-anchors
# (v1.173.0 -> v1.174.0 — the s154 guard's FORTY-SECOND rolling
#     instance, the s155 guard's FORTY-FIRST, ..., the s194 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 195):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.173.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.174.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.173\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.174\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.173.0 -> v1.174.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its thirty-fifth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.173.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.174.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s194 — the
#     s194 spec's title pin joining as the TWENTY-THIRD member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.173\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.174\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.173.0");',
         '    expect(lastUpdated).toContain("v1.174.0");'),
    ])

# (3b) the s185 + s186 + s187 + s188 + s189 + s190 + s191 + s192 + s193 + s194
#      specs' title-pin forms (the SIXTEENTH..TWENTY-THIRD members' own shape —
#      the toMatch single-line form, not the two-line rider form above):
for nn in (185, 186, 187, 188, 189, 190, 191, 192, 193, 194):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.173\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.174\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.173.0");',
         'expect(lastUpdated).toContain("v1.174.0");'),
    ])

# --- the census-literal lockstep rider (the s185..s194 specs' rg-census probes) -------
# The s185..s194 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s195
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
import re as _re
for spec_name in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts", "tests/lows-s187.test.ts", "tests/lows-s188.test.ts", "tests/lows-s189.test.ts", "tests/lows-s190.test.ts", "tests/lows-s191.test.ts", "tests/lows-s192.test.ts", "tests/lows-s193.test.ts", "tests/lows-s194.test.ts"):
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2685"', '"2697"').replace('"256"', '"257"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(75);", "expect(unitFiles).toBe(76);"),
        ("expect(filesFiles).toBe(74);", "expect(filesFiles).toBe(75);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 75/74 -> 76/75)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2685";' in text:
        assert text.count('const UNIT = "2685";') == 1
        text = text.replace('const UNIT = "2685";', 'const UNIT = "2697";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2697";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "256";' in text:
        assert text.count('const FILES = "256";') == 1
        text = text.replace('const FILES = "256";', 'const FILES = "257";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "257";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
