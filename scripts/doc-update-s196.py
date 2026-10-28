#!/usr/bin/env python3
"""doc-update-s196.py — the Session 196 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2709 = 2697 + 12 unit / 258 files across every
live claim site, the L-1 one-word comment correction (eight -> nine at
THREE live claim sites — src/lib/editor.ts:309 + AGENTS.md:118 + PAD
:312 — the in-place comment-correction form; the frozen session-104
records stay untouched), the §7.1 row for the s196 spec, the AGENTS
session-196 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s195 count-truth guards' version literals onto v1.175.0),
the s151..s195 SKILL-version pins onto v1.174.0, the s158 title pin
onto v1.175.0, the s173..s195 per-spec title-pin riders onto v1.175.0
(the family's twenty-fourth member — the s195 spec's title pin
joining), the census-literal lockstep riders (the s185..s195 specs'
rg probes — eleven members, s195 joining), and the spec-constants
re-anchor (the pair-unity family).

NO F40 layer rider this cycle — the layer STAYS at 14,373 (the
in-place comment-correction form: one word changed at three live
claim sites, zero line-count movement).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s196.py
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

# --- THE L-1 FIX (the one-word comment correction — the in-place form) --------
# The stale datum-fold count figure corrected onto the deterministic
# re-derivation at the THREE live claim sites (the frozen session-104
# records stay untouched — historical evidence; the §19 code-wins
# doctrine; the comment's own enumeration and the S104-C diff both
# count NINE).
patch("src/lib/editor.ts", [
    ("hand-spelled at eight sites",
     "hand-spelled at nine sites"),
])
patch("AGENTS.md", [
    ("eight hand-spelled `#0D1117` sites",
     "nine hand-spelled `#0D1117` sites"),
])
patch("Project_Architecture_Document.md", [
    ("hand-spelled at eight sites (the store initial",
     "hand-spelled at nine sites (the store initial"),
])

# --- README.md — the count rows ----------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2697 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2709 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2697 checks on the pure domain seams",
     "bun run test              # unit tests — 2709 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2697 checks) | `bun run test` |",
     "| Unit tests (2709 checks) | `bun run test` |"),
    ("`bun run test` (2697) → `bun run build`",
     "`bun run test` (2709) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the per-session bullets'
    # paren forms are FROZEN records)
    ("the collateral family — the count-family re-anchor 2697 = 2685 + 12 unit / 257 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2709 = 2697 + 12 unit / 258 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2697 checks, Vitest) |",
     "| `bun run test` | Unit tests (2709 checks, Vitest) |"),
    ("(2697 unit / 73 smoke / 262 e2e)",
     "(2709 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2697 checks):",
     "- **Unit Tests** (Vitest, 2709 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2697 unit checks green',
     'project_state: "2709 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2697 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2709 checks;"),
    ("bun run test          # 2697/2697",
     "bun run test          # 2709/2709"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **257 files** | **2697** | | Vitest |",
     "| **Unit total** | **258 files** | **2709** | | Vitest |"),
    ("- [ ] `bun run test` → 2697/2697",
     "- [ ] `bun run test` → 2709/2709"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2697 checks / 257 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2709 checks / 258 files) |"),
])

# --- The §7.1 row for the s196 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S196_ROW = (
    "| Unit — THE COMMENT-TRUTH REPAIR + RECALLED-FIGURE REGISTRATIONS (the one-hundred-and-forty-fourth audit's chosen work, the TENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since) — 0C/0H/0M/1L/5I, a THIRD consecutive comment-truth Low, zero behavioral source-code defect, one documentation-truth defect with a THREE-SITE one-word fix surface — one comment-truth Low (the stale datum-fold count figure at editor.ts:309 — the eight against the comment's own nine-member enumeration and the S104-C diff's own nine folded sites, corrected in-place at the three live claim sites), one carried posture (the §8 letter posture at its ninth consecutive carry), one positive steady-state verification (the F179 graduated conventions BOTH confirmed at their SIXTH full-cycle test — the fourth steady-state cycle, the watch recorded per F180), three dispatch-brief-side F181/F182-class catches (A-I-3 the scope misquote + the subset composition, B-I-1 the e2e member labels, B-I-2 the probe path — every one a RECALLED figure not re-run); the comment-truth census 49 sampled, 48 TRUE / 1 FALSE — the THIRD consecutive FALSE member, all count/illustrative figures, all caught by the fresh-eyes numeric re-derivation, the FALSE member being the Low itself): S196-A — THE REGISTRATION PAIR (the S187..S195 registration-cycle form): the s196-id-stable-premises-note at the 71st consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its SEVENTH full-cycle test, zero label drift again, the quoting form the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180; P1 the twelve-site value-based census at the post-S188-A coordinates; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s196-below-threshold-note (THE F183 LESSON — THE RECALLED-FIGURE MEMBER: the F182 catcher-can-be-caught doctrine's operational refinement — the F182 guard was in place and stated in the brief's own text, and the lead STILL shipped three imprecise figures, because each was RECALLED from a prior record rather than RE-RUN at the current tree; a figure or probe statement carried from a prior record into a new brief is itself an unverified claim about the CURRENT tree; the exact-form rule binds at every RE-USE, and the re-use is where the imprecision enters — the s195 record's own probe form over tests/e2e/ degrading to over tests/ in the s196 brief's recall, the standing 18-across-the-layer's-six-files scope degrading to 18-across-src/, the s185..s194 subset composition re-composed from memory into wrong member labels; the guard: when a brief quotes a prior record's figure or probe, the prior record's own probe is RE-RUN at the current tree in its exact form — or the figure re-derived fresh — before it rides the brief; a recalled figure that is not re-derived is exactly the stale-carried figure F181 condemned, one level up the apparatus) + the L-1 comment-truth registration (the one-word in-place correction eight to nine at the THREE live claim sites editor.ts:309 + AGENTS.md:118 + PAD :312, one commit; the figure wrong AT BIRTH per the frozen s104 plan's own nine coordinates under the same eight claim, carried 92 sessions, never re-derived until the fresh-eyes numeric re-derivation caught it; the datum fold itself correct and complete — the constant exported, consumed at all nine sites, the s104 spec's pins asserting the consumption unaffected; zero behavioral surface) + the twenty-sixth-generation carriers :2869/:2928/:2997 + the s195 row :2868 verified EXACT with the F174-corrected window :2844..:2868 = s171..s195 (25 rows) :2843 the s170 row :2842 the s169 row + the vocabulary-HOLD tenth consecutive + the honest environment record (the CONTINUATION form — the workspace NOT reset between sessions this cycle: the environment surviving from the s195 session, verified before the gates rode it; the DB re-verified against the pristine 1/2/6/1/3 census after the e2e gate and re-seeded; the trap caught and guarded from the first call) + the F138 FORTY-SEVENTH instance) + S196-B the per-session pin family (12 pins: 5 RED — the doc-side collateral + the L-1 fix's own regression pin / 7 green-at-birth — the two worklog-registration notes, the F138 guard's FORTY-SEVENTH instance (the s195 plan's record pinned 5/5 ticked at a4a4f02e), the script-provenance member, the audit-entry members (both anchors at their standing spellings), the standing-figures member, the layer-STAYS member; the MEASURED birth form — 5 RED / 7 green EXACT on the FIRST run, zero pin-form corrections at birth; the constants born rolling-safe at the post-spec figures 2709/258) and the collateral family (the count-family re-anchor 2709 = 2697 + 12 unit / 258 files; the spec-constants sweep 77 UNIT + 76 FILES with the census-literal lockstep riders for the s185..s195 specs' rg probes (eleven members — s195 joining); the layer-total family STAYING at 14,373 — the in-place comment-correction form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its twenty-second re-quote cycle; the env census figure 17 sites across 9 vars; the s151..s195 SKILL-version pins onto v1.174.0; the s154..s195 forward-guard rolling re-anchors onto v1.175.0; the s158 title pin onto v1.175.0; the s173..s195 per-spec title-pin riders onto v1.175.0 — the family's twenty-fourth member; e2e stays 262; smoke stays 73) | `tests/lows-s196.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s196.test.ts" not in pad_text:
    anchor = "| **Unit total** | **258 files** | **2709** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S196_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s196 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s196 §7.1 row already present")

# --- The AGENTS session-196 bullet (inserted above the s195 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The comment-truth repair + recalled-figure registrations (session 196, S196-A..S196-B — the one-hundred-and-forty-fourth Mode C audit's chosen work, the TENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since; the TENTH consecutive hold) — the auditors' census A 0C/0H/0M/1L/3I + B 0C/0H/0M/0L/2I combined 0C/0H/0M/1L/5I, a THIRD consecutive comment-truth Low, zero behavioral source-code defect, one documentation-truth defect with a THREE-SITE one-word fix surface — one comment-truth Low (the stale datum-fold count figure at editor.ts:309, corrected in-place at the three live claim sites), one carried posture (the §8 letter posture at its ninth consecutive carry), one positive steady-state verification (the F179 graduated conventions BOTH confirmed at their SIXTH full-cycle test — the fourth steady-state cycle, the watch recorded per F180), three dispatch-brief-side F181/F182-class catches (A-I-3 the scope misquote + the subset composition, B-I-1 the e2e member labels, B-I-2 the probe path); the comment-truth census 49 sampled / 48 TRUE / 1 FALSE — the THIRD consecutive FALSE member, all count/illustrative figures, all caught by the fresh-eyes numeric re-derivation, the FALSE member being the Low itself):** (a) S196-A THE REGISTRATION PAIR (the S187..S195 registration-cycle form): the s196-id-stable-premises-note at the 71st consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its SEVENTH full-cycle test, zero label drift again; P1 the twelve-site value-based census at the post-S188-A coordinates — properties-panel :1385/:1749/:1754/:2215, editor-store markSaved :241-281/addElements :354/updateElements :418/scaleElements :469/moveElements :531-567/deleteElements :570/reorderElements :607/toggleVisibility :656/toggleLock :680, layers-panel :39, ai-assistant :401-403/:589; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack :373/:381/:382/:399/:409; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s196-below-threshold-note (THE F183 LESSON — THE RECALLED-FIGURE MEMBER: the F182 catcher-can-be-caught doctrine's operational refinement — the F182 guard was in place and stated in the brief's own text, and the lead STILL shipped three imprecise figures, because each was RECALLED from a prior record rather than RE-RUN at the current tree; a figure or probe statement carried from a prior record into a new brief is itself an unverified claim about the CURRENT tree; the exact-form rule binds at every RE-USE, and the re-use is where the imprecision enters — the s195 record's own probe form over tests/e2e/ degrading to over tests/ in the s196 brief's recall, the standing 18-across-the-layer's-six-files scope degrading to 18-across-src/, the s185..s194 subset composition re-composed from memory into wrong member labels; the guard: when a brief quotes a prior record's figure or probe, the prior record's own probe is RE-RUN at the current tree in its exact form — or the figure re-derived fresh — before it rides the brief; a recalled figure that is not re-derived is exactly the stale-carried figure F181 condemned, one level up the apparatus) + THE TWENTY-SIXTH-GENERATION carriers :2869/:2928/:2997 + the s195 row :2868 verified EXACT with the F174-corrected window :2844..:2868 = s171..s195 (25 rows), :2843 the s170 row, :2842 the s169 row; + the vocabulary-HOLD registration tenth consecutive; + the honest environment record — the CONTINUATION form this cycle: the workspace NOT reset between sessions (the environment surviving from the s195 session — node_modules present, chromium-1248 + headless shell present, the tree clean at a4a4f02e — verified before the gates rode it; the DB re-verified against the pristine 1/2/6/1/3 census after the e2e gate and re-seeded; the exported-shell DATABASE_URL trap ACTIVE and guarded with env -u from the first call — the discipline holding in the continuation form exactly as in the reset form)); (b) S196-B the 12-pin spec (5 RED / 7 green-at-birth EXACT on the FIRST run — zero pin-form corrections at birth; the constants born rolling-safe at 2709/258) with the collateral family (the count-family re-anchor 2709 = 2697 + 12 unit / 258 files (the family's live anchor); the L-1 one-word correction at the THREE live claim sites — the in-place comment-correction form; the layer-total family STAYING at 14,373 (the in-place comment-correction form — no F40 rider needed); the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its twenty-second re-quote cycle; the F138 guard's FORTY-SEVENTH instance — the s195 plan 5/5 ticked at a4a4f02e, the sweep s151..s195 at 45 plans 248/0; the 172nd reference audit NO DRIFT with the clip byte-identical the 133rd consecutive session; mobile nav 9/9 the 173rd session; pins S128..S196 913/913 across 69).\n"
)
if "session 196, S196-A..S196-B" not in agents_text:
    anchor = "- **The comment-truth repair + catcher-can-be-caught registrations (session 195"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-196 bullet inserted")
else:
    print("AGENTS.md: session-196 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s195 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 196):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.173\\.0" in text:
        text = text.replace("version: 1\\.173\\.0", "version: 1\\.174\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.174.0)")
    elif "version: 1\\.174\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.173.0")' in text:
        # the s181/s182/s183/s184 specs' toContain literal form (the spec
        # pins the version line by substring — the rolling re-anchor at
        # the literal level)
        text = text.replace('toContain("1.173.0")', 'toContain("1.174.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.173.0")' in text:
        # the s185..s195 specs' fuller toContain form (the version-line substring
        # with the field prefix — the rolling re-anchor at the literal layer)
        text = text.replace('toContain("version: 1.173.0")', 'toContain("version: 1.174.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.174.0")' in text or 'toContain("version: 1.174.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s195 forward count-truth guards' rolling re-anchors
# (v1.174.0 -> v1.175.0 — the s154 guard's FORTY-THIRD rolling
#     instance, the s155 guard's FORTY-SECOND, ..., the s195 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 196):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.174.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.175.0 PAD block quotes for the layer total (the"),
        ("    /v1\\.174\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,",
         "    /v1\\.175\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.174.0 -> v1.175.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its thirty-sixth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.174.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.175.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s195 — the
#     s195 spec's title pin joining as the TWENTY-FOURTH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.174\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.175\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.174.0");',
         '    expect(lastUpdated).toContain("v1.175.0");'),
    ])

# (3b) the s185 + s186 + s187 + s188 + s189 + s190 + s191 + s192 + s193 + s194 + s195
#      specs' title-pin forms (the SIXTEENTH..TWENTY-FOURTH members' own shape —
#      the toMatch single-line form, not the two-line rider form above):
for nn in (185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.174\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.175\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.174.0");',
         'expect(lastUpdated).toContain("v1.175.0");'),
    ])

# --- the census-literal lockstep rider (the s185..s195 specs' rg-census probes) -------
# The s185..s195 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s196
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
for spec_name in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts", "tests/lows-s187.test.ts", "tests/lows-s188.test.ts", "tests/lows-s189.test.ts", "tests/lows-s190.test.ts", "tests/lows-s191.test.ts", "tests/lows-s192.test.ts", "tests/lows-s193.test.ts", "tests/lows-s194.test.ts", "tests/lows-s195.test.ts"):
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2697"', '"2709"').replace('"257"', '"258"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(76);", "expect(unitFiles).toBe(77);"),
        ("expect(filesFiles).toBe(75);", "expect(filesFiles).toBe(76);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 76/75 -> 77/76)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2697";' in text:
        assert text.count('const UNIT = "2697";') == 1
        text = text.replace('const UNIT = "2697";', 'const UNIT = "2709";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2709";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "257";' in text:
        assert text.count('const FILES = "257";') == 1
        text = text.replace('const FILES = "257";', 'const FILES = "258";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "258";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
