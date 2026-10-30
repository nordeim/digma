#!/usr/bin/env python3
"""doc-update-s197.py — the Session 197 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2721 = 2709 + 12 unit / 259 files across every
live claim site, the L-1 in-place figure correction (~380 -> ~510 and
~0.76 MB -> ~1.02 MB at SIX live claim sites — src/lib/editor.ts:365 +
:367 + AGENTS.md:201 + :202 + PAD :160 + :167 + :2791 — the in-place
comment-correction form; the frozen session-117/118 records stay
untouched: the s117/s118 specs' birth-record comments, the PAD
v1.96.0/v1.97.0 chain lines, the worklog's s117/s118 records, the
s117/s118 commit messages), the §7.1 row for the s197 spec, the AGENTS
session-197 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s196 count-truth guards' version literals onto v1.176.0),
the s151..s196 SKILL-version pins onto v1.175.0, the s158 title pin
onto v1.176.0, the s173..s196 per-spec title-pin riders onto v1.176.0
(the family's twenty-fifth member — the s196 spec's title pin
joining), the census-literal lockstep riders (the s185..s196 specs'
rg probes — twelve members, s196 joining), and the spec-constants
re-anchor (the pair-unity family).

NO F40 layer rider this cycle — the layer STAYS at 14,373 (the
in-place comment-correction form: two figures changed at six live
claim sites, zero line-count movement).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s197.py
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

# --- THE L-1 FIX (the in-place figure correction — six live claim sites) ------
# The stale per-row serialization figures corrected onto the lead's
# live re-derivation: the round-trip wire row (the detail GET's full
# Prisma rows with id + projectId + createdAt + updatedAt, spread
# through loadProject into the store, re-serialized by the autosave
# PUT) measures ~510 minimal (the lead's own computation 508, the
# auditor's 513) where the comment's ~380 reproduced only for the
# ID-LESS row-builder product (357 minimal; the frozen s117 record's
# own 12368 - 12002 = 366 arithmetic confirming the id-less basis);
# the companion 510 x 2000 = 1.02 MB. The frozen records stay
# untouched (the s117/s118 spec birth-record comments, the PAD
# v1.96.0/v1.97.0 chain lines :79/:80, the worklog's s117/s118
# records, the s117/s118 commit messages, the :167 lead-measured
# parenthetical's honest id-less provenance).
patch("src/lib/editor.ts", [
    ("(~380 chars measured — ids, coordinates, timestamps, field names,",
     "(~510 chars measured — ids, coordinates, timestamps, field names,"),
    ("fixed slack is ~0.76 MB, bounded inside the 8 MB headroom this",
     "fixed slack is ~1.02 MB, bounded inside the 8 MB headroom this"),
])
patch("AGENTS.md", [
    ("(~380 chars measured) stays outside the count — ~0.76 MB at ELEMENT_LIMIT, bounded inside the 8 MB headroom",
     "(~510 chars measured) stays outside the count — ~1.02 MB at ELEMENT_LIMIT, bounded inside the 8 MB headroom"),
    ("the ~0.76 MB fixed slack",
     "the ~1.02 MB fixed slack"),
])
patch("Project_Architecture_Document.md", [
    ("(~380 chars measured) stays outside the count — ~0.76 MB at ELEMENT_LIMIT, bounded inside the 8 MB headroom the 24 MB constant holds",
     "(~510 chars measured) stays outside the count — ~1.02 MB at ELEMENT_LIMIT, bounded inside the 8 MB headroom the 24 MB constant holds"),
    ("the fixed per-row serialization ~380 chars measured stays outside the count, ~0.76 MB at ELEMENT_LIMIT inside the 8 MB headroom",
     "the fixed per-row serialization ~510 chars measured stays outside the count, ~1.02 MB at ELEMENT_LIMIT inside the 8 MB headroom"),
    ("the ~0.76 MB fixed per-row slack",
     "the ~1.02 MB fixed per-row slack"),
])

# --- README.md — the count rows ----------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2709 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2721 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2709 checks on the pure domain seams",
     "bun run test              # unit tests — 2721 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2709 checks) | `bun run test` |",
     "| Unit tests (2721 checks) | `bun run test` |"),
    ("`bun run test` (2709) → `bun run build`",
     "`bun run test` (2721) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # disambiguated by the §11 continuation; the per-session bullets'
    # paren forms are FROZEN records)
    ("the collateral family — the count-family re-anchor 2709 = 2697 + 12 unit / 258 files (the family's live anchor), the §11 line-count re-anchors",
     "the collateral family — the count-family re-anchor 2721 = 2709 + 12 unit / 259 files (the family's live anchor), the §11 line-count re-anchors"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2709 checks, Vitest) |",
     "| `bun run test` | Unit tests (2721 checks, Vitest) |"),
    ("(2709 unit / 73 smoke / 262 e2e)",
     "(2721 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2709 checks):",
     "- **Unit Tests** (Vitest, 2721 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2709 unit checks green',
     'project_state: "2721 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2709 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2721 checks;"),
    ("bun run test          # 2709/2709",
     "bun run test          # 2721/2721"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **258 files** | **2709** | | Vitest |",
     "| **Unit total** | **259 files** | **2721** | | Vitest |"),
    ("- [ ] `bun run test` → 2709/2709",
     "- [ ] `bun run test` → 2721/2721"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2709 checks / 258 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2721 checks / 259 files) |"),
])

# --- The §7.1 row for the s197 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S197_ROW = (
    "| Unit — THE COMMENT-TRUTH REPAIR + BORN-STALE-COORDINATE REGISTRATIONS (the one-hundred-and-forty-fifth audit's chosen work, the ELEVENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since) — 0C/0H/0M/1L/2I, a FOURTH consecutive comment-truth Low, zero behavioral source-code defect, one documentation-truth defect with a SIX-SITE in-place figure fix surface — one comment-truth Low (the stale per-row serialization figure at editor.ts:365-367 — the ~380 against the comment's own ids-and-timestamps enumeration, the correct figure ~510 the round-trip wire row the PUT actually serializes, corrected in-place at the six live claim sites), two dispatch-brief-side coordinate catches (A-I-1 the born-stale PAD :312 coordinate — F184; B-I-1 the recalled 27th-generation carrier :2997 — the F183 class catching the lead's brief the third consecutive cycle); the comment-truth census 49 sampled, 48 TRUE / 1 FALSE — the FOURTH consecutive single-FALSE member, all count/illustrative figures, all caught by the fresh-eyes numeric re-derivation, the FALSE member being the Low itself): S197-A — THE REGISTRATION PAIR (the S187..S196 registration-cycle form): the s197-id-stable-premises-note at the 72nd consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its EIGHTH full-cycle test, zero label drift again, the quoting form the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180; P1 the twelve-site value-based census at the post-S188-A coordinates; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s197-below-threshold-note (THE F184 LESSON — THE BORN-STALE COORDINATE MEMBER: the F183 recalled-figure doctrine's record-side refinement — the s196 record's own :312 coordinate was TRUE pre-delivery and FALSE at the delivered tree, the delivery's own collateral riders (the version chain line + the §7.1 row, the very riders the convention mandates) inserting lines ABOVE the claimed row WITHIN the delivery commit itself; a cycle's plan-time coordinates are PRE-collateral measurements, and the delivery that creates the record can itself falsify the coordinates the record claims; the guard: at delivery, every coordinate the closing record states as a delivered fact — fix sites, carriers, rows — is RE-MEASURED at the DELIVERED tree before the record ships; the recall side unchanged per F183 — a coordinate recalled from any record, the current cycle's included, re-run at the current tree in its exact form) + the L-1 comment-truth registration (the in-place figure correction ~380 to ~510 + ~0.76 MB to ~1.02 MB at the six live claim sites, one commit; the figure born at session 117 with its own enumeration disagreeing since birth, carried 80 sessions, never re-derived until the fresh-eyes numeric re-derivation caught it; the bound itself correct and complete — the rowStoredBytes seam's arithmetic unit-pinned at lows-s117, the asserted invariant holding under every form; zero behavioral surface) + the twenty-seventh-generation carriers :2871/:2930/:2999 + the s196 row :2870 verified EXACT with the F174-corrected window :2846..:2870 = s172..s196 (25 rows) :2845 the s171 row :2844 the s170 row + the vocabulary-HOLD eleventh consecutive + the honest environment record (the SANDBOX-RESET form — the workspace found empty, the fresh clone verified before the gates rode it; the DB re-created and re-seeded pristine 1/2/6/1/3; chromium-1248 re-provisioned before the first e2e; the trap caught and guarded from the first call) + the F138 FORTY-EIGHTH instance) + S197-B the per-session pin family (12 pins: 5 RED — the doc-side collateral + the L-1 fix's own regression pin / 7 green-at-birth — the two worklog-registration notes, the F138 guard's FORTY-EIGHTH instance (the s196 plan's record pinned 5/5 ticked at 2106eaa8), the script-provenance member, the audit-entry members (both anchors at their standing spellings), the standing-figures member, the layer-STAYS member; the MEASURED birth form — 5 RED / 7 green EXACT on the FIRST run, zero pin-form corrections at birth; the constants born rolling-safe at the post-spec figures 2721/259) and the collateral family (the count-family re-anchor 2721 = 2709 + 12 unit / 259 files; the spec-constants sweep 78 UNIT + 77 FILES with the census-literal lockstep riders for the s185..s196 specs' rg probes (twelve members — s196 joining); the layer-total family STAYING at 14,373 — the in-place comment-correction form, no F40 rider; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its twenty-third re-quote cycle; the env census figure 17 sites across 9 vars; the s151..s196 SKILL-version pins onto v1.175.0; the s154..s196 forward-guard rolling re-anchors onto v1.176.0; the s158 title pin onto v1.176.0; the s173..s196 per-spec title-pin riders onto v1.176.0 — the family's twenty-fifth member; e2e stays 262; smoke stays 73) | `tests/lows-s197.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s197.test.ts" not in pad_text:
    anchor = "| **Unit total** | **259 files** | **2721** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S197_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s197 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s197 §7.1 row already present")

# --- The AGENTS session-197 bullet (inserted above the s196 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The comment-truth repair + born-stale-coordinate registrations (session 197, S197-A..S197-B — the one-hundred-and-forty-fifth Mode C audit's chosen work, the ELEVENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary (the vocabulary-HOLD cycle — the operator's 2026-10-25 fd2037e3 revision byte-unchanged since; the ELEVENTH consecutive hold) — the auditors' census A 0C/0H/0M/1L/1I + B 0C/0H/0M/0L/1I combined 0C/0H/0M/1L/2I, a FOURTH consecutive comment-truth Low, zero behavioral source-code defect, one documentation-truth defect with a SIX-SITE in-place figure fix surface — one comment-truth Low (the stale per-row serialization figure at editor.ts:365-367 — the ~380 chars and its ~0.76 MB companion true only for the id-less row-builder product while the comment's own enumeration names ids and timestamps; the correct figures ~510 chars / ~1.02 MB the round-trip wire row the autosave PUT actually serializes — the detail GET's full Prisma rows spread through loadProject; corrected in-place at the six live claim sites editor.ts:365/:367 + AGENTS.md:201/:202 + PAD :160/:167/:2791), two dispatch-brief-side coordinate catches (A-I-1 the born-stale PAD :312 coordinate — the s196 record's own figure falsified by its own delivery's collateral riders; B-I-1 the recalled 27th-generation carrier :2997 where the record's own form says :2999 — the F183 class catching the lead's brief the THIRD consecutive cycle); the comment-truth census 49 sampled / 48 TRUE / 1 FALSE — the FOURTH consecutive single-FALSE member, all count/illustrative figures, all caught by the fresh-eyes numeric re-derivation, the FALSE member being the Low itself):** (a) S197-A THE REGISTRATION PAIR (the S187..S196 registration-cycle form): the s197-id-stable-premises-note at the 72nd consecutive cycle carrying the CANONICAL quartet in exactly one place (the dispatch QUOTING it verbatim — the F176 prescription honored at its EIGHTH full-cycle test, zero label drift again; P1 the twelve-site value-based census at the post-S188-A coordinates — properties-panel :1385/:1749/:1754/:2215, editor-store markSaved :241-281/addElements :354/updateElements :418/scaleElements :469/moveElements :531-567/deleteElements :570/reorderElements :607/toggleVisibility :656/toggleLock :680, layers-panel :39, ai-assistant :401-403/:589; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack :373/:381/:382/:399/:409; P3 the replace-transaction seams at elements/route.ts:365-382 + duplicate :113; P4 the value-based perimeter) + the s197-below-threshold-note (THE F184 LESSON — THE BORN-STALE COORDINATE MEMBER: the F183 recalled-figure doctrine's record-side refinement — the s196 record's own :312 coordinate was TRUE pre-delivery (measured :312 at the parent a4a4f02e) and FALSE at the delivered tree (sitting :313 at 2106eaa8 and every tree since), because the s196 delivery's OWN collateral riders — the v1.175.0 version chain line + the s196 §7.1 row, the very riders the convention mandates — inserted lines ABOVE the claimed row WITHIN the delivery commit itself; a cycle's plan-time coordinates are PRE-collateral measurements, and the delivery that creates the record can itself falsify the coordinates the record claims; the guard: at delivery, every coordinate the closing record states as a delivered fact — fix sites, carriers, rows — is RE-MEASURED at the DELIVERED tree before the record ships; the recall side unchanged per F183 — a coordinate recalled from any record, the current cycle's included, re-run at the current tree in its exact form) + THE TWENTY-SEVENTH-GENERATION carriers :2871/:2930/:2999 + the s196 row :2870 verified EXACT with the F174-corrected window :2846..:2870 = s172..s196 (25 rows), :2845 the s171 row, :2844 the s170 row; + the vocabulary-HOLD registration eleventh consecutive; + the honest environment record — the SANDBOX-RESET form this cycle: the workspace found empty, the fresh clone at 49d54f41 verified before the gates rode it (the S196 delivery 2106eaa8 + the session_560 log push, zero source drift; a fresh 477-package install; the DB re-created at the repo root and re-seeded to the pristine 1/2/6/1/3 census; chromium-1248 re-provisioned BEFORE the first e2e; the exported-shell DATABASE_URL trap ACTIVE and guarded with env -u from the first call)); (b) S197-B the 12-pin spec (5 RED / 7 green-at-birth EXACT on the FIRST run — zero pin-form corrections at birth; the constants born rolling-safe at 2721/259) with the collateral family (the count-family re-anchor 2721 = 2709 + 12 unit / 259 files (the family's live anchor); the L-1 in-place figure correction at the SIX live claim sites; the layer-total family STAYING at 14,373 (the in-place comment-correction form — no F40 rider needed); the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its twenty-third re-quote cycle; the F138 guard's FORTY-EIGHTH instance — the s196 plan 5/5 ticked at 2106eaa8, the sweep s151..s196 at 46 plans 253/0; the 173rd reference audit NO DRIFT with the clip byte-identical the 134th consecutive session; mobile nav 9/9 the 174th session; pins S128..S197 925/925 across 70).\n"
)
if "session 197, S197-A..S197-B" not in agents_text:
    anchor = "- **The comment-truth repair + recalled-figure registrations (session 196"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-197 bullet inserted")
else:
    print("AGENTS.md: session-197 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s196 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 197):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.174\\.0" in text:
        text = text.replace("version: 1\\.174\\.0", "version: 1\\.175\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.175.0)")
    elif "version: 1\\.175\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.174.0")' in text:
        # the s181/s182/s183/s184 specs' toContain literal form (the spec
        # pins the version line by substring — the rolling re-anchor at
        # the literal level)
        text = text.replace('toContain("1.174.0")', 'toContain("1.175.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.174.0")' in text:
        # the s185..s196 specs' fuller toContain form (the version-line substring
        # with the field prefix — the rolling re-anchor at the literal layer)
        text = text.replace('toContain("version: 1.174.0")', 'toContain("version: 1.175.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.175.0")' in text or 'toContain("version: 1.175.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s196 forward count-truth guards' rolling re-anchors
# (v1.175.0 -> v1.176.0 — the s154 guard's FORTY-FOURTH rolling
#     instance, the s155 guard's FORTY-THIRD, ..., the s196 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 197):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.175.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.176.0 PAD block quotes for the layer total (the"),
        ("    /v1\\.175\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,",
         "    /v1\\.176\\.0[\\s\\S]{0,6000}?the 22-file layer at \\*\\*(\\d[\\d,]*) lines?\\*\\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.175.0 -> v1.176.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its thirty-seventh instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.175.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.176.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s184 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s196 — the
#     s196 spec's title pin joining as the TWENTY-FIFTH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.175\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.176\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.175.0");',
         '    expect(lastUpdated).toContain("v1.176.0");'),
    ])

# (3b) the s185 + s186 + s187 + s188 + s189 + s190 + s191 + s192 + s193 + s194 + s195 + s196
#      specs' title-pin forms (the SIXTEENTH..TWENTY-FIFTH members' own shape —
#      the toMatch single-line form, not the two-line rider form above):
for nn in (185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.175\\.0$/m);",
         "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.176\\.0$/m);"),
        ('expect(lastUpdated).toContain("v1.175.0");',
         'expect(lastUpdated).toContain("v1.176.0");'),
    ])

# --- the census-literal lockstep rider (the s185..s196 specs' rg-census probes) -------
# The s185..s196 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s197
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
for spec_name in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts", "tests/lows-s187.test.ts", "tests/lows-s188.test.ts", "tests/lows-s189.test.ts", "tests/lows-s190.test.ts", "tests/lows-s191.test.ts", "tests/lows-s192.test.ts", "tests/lows-s193.test.ts", "tests/lows-s194.test.ts", "tests/lows-s195.test.ts", "tests/lows-s196.test.ts"):
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2709"', '"2721"').replace('"258"', '"259"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(77);", "expect(unitFiles).toBe(78);"),
        ("expect(filesFiles).toBe(76);", "expect(filesFiles).toBe(77);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 77/76 -> 78/77)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2709";' in text:
        assert text.count('const UNIT = "2709";') == 1
        text = text.replace('const UNIT = "2709";', 'const UNIT = "2721";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2721";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "258";' in text:
        assert text.count('const FILES = "258";') == 1
        text = text.replace('const FILES = "258";', 'const FILES = "259";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "259";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
