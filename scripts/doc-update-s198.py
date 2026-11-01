#!/usr/bin/env python3
"""doc-update-s198.py — the Session 198 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2733 = 2721 + 12 unit / 260 files across every
live claim site, the §7.1 row for the s198 spec, the AGENTS
session-198 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s197 count-truth guards' version literals onto v1.177.0),
the s151..s197 SKILL-version pins onto v1.176.0, the s158 title pin
onto v1.177.0, the s173..s197 per-spec title-pin riders onto v1.177.0
(the family's twenty-sixth member — the s197 spec's title pin
joining), the census-literal lockstep riders (the s185..s197 specs'
rg probes — thirteen members, s197 joining), and the spec-constants
re-anchor (the pair-unity family).

NO source-code fix this cycle — the BELOW-THRESHOLD form (zero
behavioral defect, zero comment-truth defect); the layer STAYS at
14,373 (no F40 rider).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s198.py
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
    ("| Unit tests | Vitest | 5 | 2721 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2733 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2721 checks on the pure domain seams",
     "bun run test              # unit tests — 2733 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2721 checks) | `bun run test` |",
     "| Unit tests (2733 checks) | `bun run test` |"),
    ("`bun run test` (2721) → `bun run build`",
     "`bun run test` (2733) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the per-session bullets'
    # paren forms are FROZEN records)
    ("the collateral family — the count-family re-anchor 2721 = 2709 + 12 unit / 259 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2733 = 2721 + 12 unit / 260 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2721 checks, Vitest) |",
     "| `bun run test` | Unit tests (2733 checks, Vitest) |"),
    ("(2721 unit / 73 smoke / 262 e2e)",
     "(2733 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2721 checks):",
     "- **Unit Tests** (Vitest, 2733 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2721 unit checks green',
     'project_state: "2733 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2721 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2733 checks;"),
    ("bun run test          # 2721/2721",
     "bun run test          # 2733/2733"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **259 files** | **2721** | | Vitest |",
     "| **Unit total** | **260 files** | **2733** | | Vitest |"),
    ("- [ ] `bun run test` → 2721/2721",
     "- [ ] `bun run test` → 2733/2733"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2721 checks / 259 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2733 checks / 260 files) |"),
])

# --- The §7.1 row for the s198 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S198_ROW = (
    "| Unit — THE BELOW-THRESHOLD REGISTRATIONS + THE BRIEF-PARAPHRASE LESSON (the one-hundred-and-forty-sixth audit's chosen work, the TWELFTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision, while the operator's own 6d412aa6 push refreshed the skills CATALOG around it: three new operator skills + the count 340 to 345, outside the app code and outside the audit scope) — 0C/0H/0M/0L/4I, a BELOW-THRESHOLD cycle, the first zero-Low census since session 192, zero behavioral source-code defect, zero comment-truth defect — the comment-truth census 77 sampled, 77 TRUE / 0 FALSE, the FIRST all-TRUE census since the family's s193 formalization, the S197 repair independently verified live-reproducing (auditor A's own re-derivation: the round-trip wire row at 501 minimal / 528 representative straddling the corrected ~510, the id-less product at 352); four informational members — three dispatch-brief-side (A-I-1 the trap-4 axis definitions paraphrased into size-axis prose where the standing F177 axes are negative-margin composition — single-side -mt-/-mb-/-ml-/-mr- vs compound -mx-/-my- on space-y children; B-I-1 the src/lib named list inventing a seed-helpers.ts that never existed while omitting five live files (db.ts, greeting.ts, password.ts, team.ts, utils.ts); B-I-2 the e2e write-set arithmetic mislabeled a file count where 13 + 6 + 1 + 5 = 25 is the HANDLER census decomposed by e2e coverage) + one source-side observation carried as a frozen-birth-record nuance (B-I-3 the S67-B ~722 KB/~1.45 GB defect-arithmetic family — true at its own S67-era caps, deliberately preserved by the S112-D and S117-A re-anchors, pinned at request-surface-s67 + server-lows-s76; under the current per-field caps the pre-parse worst case re-derives at ~912 KB/row approximately ~1.8 GB, the 32 MB guard's invariant holding under every form — the current-era fact registered, the frozen family untouched)): S198-A — THE REGISTRATION PAIR (the S187..S197 registration-cycle form): the s198-id-stable-premises-note at the 73rd consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its NINTH full-cycle test, zero label drift again, the quoting form the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180; P1 the twelve-site value-based census at the post-S188-A coordinates; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s198-below-threshold-note (THE F185 LESSON — THE BRIEF-PARAPHRASE MEMBER: the F182 every-figure-is-a-claim doctrine's definition-side extension — a dispatch brief's own definitions, lists, and labels are claims too; the s198 brief's figures came from the records and verified, its definitions came from the lead's recall and drifted (the trap-4 axes garbled into size-axis prose, the src/lib list inventing a file, the 25-arithmetic labeled a file count); the guard: a dispatch brief QUOTES the standing registration's forms verbatim — axes, file lists, arithmetic labels — never paraphrases from recall + the first all-TRUE comment-truth census registration + the B-I-3 frozen-birth-record nuance registration + the twenty-eighth-generation carriers :2873/:2932/:3001 + the s197 row :2872 verified EXACT with the F174-corrected window :2848..:2872 = s173..s197 (25 rows) :2847 the s172 row :2846 the s171 row + the honest folder-level vocabulary-HOLD registration (the folder-level EMPTY-diff form superseded by the file-level form — the directive-named master skill's own file the vocabulary anchor, the catalog around it the operator's to refresh) + the dispatch-currency-honored registration (the SIXTH steady-state cycle) + the honest environment record (the SANDBOX-RESET form the fourth — the fresh clone verified before the gates rode it; the DB re-created and re-seeded pristine 1/2/6/1/3; chromium-1248 re-provisioned before the first e2e; the trap caught and guarded from the first call) + the F138 FORTY-NINTH instance) + S198-B the per-session pin family (12 pins: 5 RED — the doc-side collateral members / 7 green-at-birth — the two worklog-registration notes, the F138 guard's FORTY-NINTH instance (the s197 plan's record pinned 5/5 ticked at 5af71b9f), the script-provenance member, the audit-entry members (both anchors at their standing spellings), the standing-figures member, the layer-STAYS member, the B-I-3 frozen-record member; the MEASURED birth form — 5 RED / 7 green EXACT on the FIRST completed run, the run itself completing in 427ms with the apparent timeout the known vitest worker-pool quirk; the constants born rolling-safe at the post-spec figures 2733/260) and the collateral family (the count-family re-anchor 2733 = 2721 + 12 unit / 260 files; the spec-constants sweep 79 UNIT + 78 FILES with the census-literal lockstep riders for the s185..s197 specs' rg probes (thirteen members — s197 joining); the layer-total family STAYING at 14,373 — the below-threshold form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its twenty-fourth re-quote cycle; the env census figure 17 sites across 9 vars; the s151..s197 SKILL-version pins onto v1.176.0; the s154..s197 forward-guard rolling re-anchors onto v1.177.0; the s158 title pin onto v1.177.0; the s173..s197 per-spec title-pin riders onto v1.177.0 — the family's twenty-sixth member; e2e stays 262; smoke stays 73) | `tests/lows-s198.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s198.test.ts" not in pad_text:
    anchor = "| **Unit total** | **260 files** | **2733** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S198_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s198 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s198 §7.1 row already present")

# --- The AGENTS session-198 bullet (inserted above the s197 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The below-threshold registrations + the brief-paraphrase lesson (session 198, S198-A..S198-B — the one-hundred-and-forty-sixth Mode C audit's chosen work, the TWELFTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM — the master skill's own file byte-unchanged since the operator's 2026-10-25 fd2037e3 revision, while the operator's own 6d412aa6 push refreshed the skills CATALOG around it: three new operator skills + the count 340 to 345, outside the app code and outside the audit scope) — the auditors' census A 0C/0H/0M/0L/1I + B 0C/0H/0M/0L/3I combined 0C/0H/0M/0L/4I, a BELOW-THRESHOLD cycle, the first zero-Low census since session 192, zero behavioral source-code defect, zero comment-truth defect — the comment-truth census 77 sampled / 77 TRUE / 0 FALSE, the FIRST all-TRUE census since the family's s193 formalization, the S197 repair independently verified live-reproducing; four informational members: three dispatch-brief-side (A-I-1 the trap-4 axis definitions paraphrased into size-axis prose where the standing F177 axes are negative-margin composition — single-side vs compound on space-y children; B-I-1 the src/lib named list inventing a seed-helpers.ts that never existed while omitting five live files (db.ts, greeting.ts, password.ts, team.ts, utils.ts); B-I-2 the e2e write-set arithmetic mislabeled a file count where 13 + 6 + 1 + 5 = 25 is the HANDLER census decomposed by e2e coverage) + one source-side observation carried as a frozen-birth-record nuance (B-I-3 the S67-B ~722 KB/~1.45 GB defect-arithmetic family — true at its own era, deliberately preserved by the S112-D/S117-A re-anchors, the current-era ~1.8 GB worst case registered without touching the frozen family)):** (a) S198-A THE REGISTRATION PAIR (the S187..S197 registration-cycle form): the s198-id-stable-premises-note at the 73rd consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its NINTH full-cycle test, zero label drift again) + the s198-below-threshold-note (THE F185 LESSON — THE BRIEF-PARAPHRASE MEMBER: the F182 every-figure-is-a-claim doctrine's definition-side extension — a dispatch brief's own definitions, lists, and labels are claims too; the s198 brief's figures came from the records and verified, its definitions came from the lead's recall and drifted (the trap-4 axes garbled into size-axis prose, the src/lib list inventing a file, the 25-arithmetic labeled a file count); the guard: a dispatch brief QUOTES the standing registration's forms verbatim — axes, file lists, arithmetic labels — never paraphrases from recall + THE FIRST ALL-TRUE COMMENT-TRUTH CENSUS REGISTRATION (77 sampled / 77 TRUE / 0 FALSE) + THE B-I-3 FROZEN-BIRTH-RECORD NUANCE REGISTRATION + the twenty-eighth-generation carriers :2873/:2932/:3001 + the s197 row :2872 verified EXACT with the F174-corrected window :2848..:2872 = s173..s197 (25 rows), :2847 the s172 row, :2846 the s171 row + the honest folder-level vocabulary-HOLD registration (the folder-level EMPTY-diff form superseded by the file-level form) + the honest environment record — the SANDBOX-RESET form this cycle (the workspace found empty, the fresh clone at 6d412aa6 verified before the gates rode it — the S197 delivery 5af71b9f + the session_563/564 log pushes, zero source drift; a fresh 477-package install; the DB re-created at the repo root and re-seeded to the pristine 1/2/6/1/3 census; chromium-1248 re-provisioned BEFORE the first e2e; the exported-shell DATABASE_URL trap ACTIVE and guarded with env -u from the first call)); (b) S198-B the 12-pin spec (5 RED / 7 green-at-birth EXACT on the FIRST completed run — the run itself completing in 427ms, the apparent timeout the known vitest worker-pool quirk; the constants born rolling-safe at 2733/260) with the collateral family (the count-family re-anchor 2733 = 2721 + 12 unit / 260 files (the family's live anchor); the layer-total family STAYING at 14,373 (the below-threshold form — no F40 rider needed); the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its twenty-fourth re-quote cycle; the F138 guard's FORTY-NINTH instance — the s197 plan 5/5 ticked at 5af71b9f, the sweep s151..s197 at 47 plans 258/0; the 174th reference audit NO DRIFT with the clip byte-identical the 135th consecutive session; mobile nav 9/9 the 175th session; pins S128..S198 937/937 across 71).\n"
)
if "session 198, S198-A..S198-B" not in agents_text:
    anchor = "- **The comment-truth repair + born-stale-coordinate registrations (session 197"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-198 bullet inserted")
else:
    print("AGENTS.md: session-198 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s197 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 198):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.175\\.0" in text:
        text = text.replace("version: 1\\.175\\.0", "version: 1\\.176\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.176.0)")
    elif "version: 1\\.176\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.175.0")' in text:
        # the s181/s182/s183/s184 specs' toContain literal form (the spec
        # pins the version line by substring — the rolling re-anchor at
        # the literal level)
        text = text.replace('toContain("1.175.0")', 'toContain("1.176.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.175.0")' in text:
        # the s185..s197 specs' fuller toContain form (the version-line substring
        # with the field prefix — the rolling re-anchor at the literal layer)
        text = text.replace('toContain("version: 1.175.0")', 'toContain("version: 1.176.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.176.0")' in text or 'toContain("version: 1.176.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s197 forward count-truth guards' rolling re-anchors
# (v1.176.0 -> v1.177.0 — the s154 guard's FORTY-FIFTH rolling
#     instance, the s155 guard's FORTY-FOURTH, ..., the s197 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 198):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.176.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.177.0 PAD block quotes for the layer total (the"),
        ("    /v1\\.176\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,",
         "    /v1\\.177\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.176.0 -> v1.177.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its thirty-eighth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.176.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.177.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s197 — the
#     s197 spec's title pin joining as the TWENTY-SIXTH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.176\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.177\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.176.0");',
         '    expect(lastUpdated).toContain("v1.177.0");'),
    ])

# (3b) the s185 + s186 + s187 + s188 + s189 + s190 + s191 + s192 + s193 + s194 + s195 + s196 + s197
#      specs' title-pin forms (the SIXTEENTH..TWENTY-SIXTH members' own shape —
#      the toMatch single-line form, not the two-line rider form above):
for nn in (185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.176\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.177\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.176.0");',
         'expect(lastUpdated).toContain("v1.177.0");'),
    ])

# --- the census-literal lockstep rider (the s185..s197 specs' rg-census probes) -------
# The s185..s197 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s198
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
for spec_name in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts", "tests/lows-s187.test.ts", "tests/lows-s188.test.ts", "tests/lows-s189.test.ts", "tests/lows-s190.test.ts", "tests/lows-s191.test.ts", "tests/lows-s192.test.ts", "tests/lows-s193.test.ts", "tests/lows-s194.test.ts", "tests/lows-s195.test.ts", "tests/lows-s196.test.ts", "tests/lows-s197.test.ts"):
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2721"', '"2733"').replace('"259"', '"260"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(78);", "expect(unitFiles).toBe(79);"),
        ("expect(filesFiles).toBe(77);", "expect(filesFiles).toBe(78);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 78/77 -> 79/78)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2721";' in text:
        assert text.count('const UNIT = "2721";') == 1
        text = text.replace('const UNIT = "2721";', 'const UNIT = "2733";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2733";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "259";' in text:
        assert text.count('const FILES = "259";') == 1
        text = text.replace('const FILES = "259";', 'const FILES = "260";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "260";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
