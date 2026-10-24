#!/usr/bin/env python3
"""doc-update-s186.py — the Session 186 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2588 = 2574 + 14 unit / 248 files across every
live claim site, the §7.1 row for the s186 spec, the AGENTS
session-186 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s185 count-truth guards' version literals onto v1.165.0),
the s151..s185 SKILL-version pins onto v1.164.0, the s158 title pin
onto v1.165.0, the s173..s185 per-spec title-pin riders onto v1.165.0
(the family's fourteenth member — the s185 spec's title pin joining),
the spec-constants re-anchor (the pair-unity family), and THE F40
LAYER-TOTAL RIDER (the layer MOVING 14,359 -> 14,365 — the deliberate
remediation's own receipt: the login-screen receipt comment's +6).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s186.py
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
    ("| Unit tests | Vitest | 5 | 2574 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2588 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2574 checks on the pure domain seams",
     "bun run test              # unit tests — 2588 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2574 checks) | `bun run test` |",
     "| Unit tests (2588 checks) | `bun run test` |"),
    ("`bun run test` (2574) → `bun run build`",
     "`bun run test` (2588) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site)
    ("the collateral family — the count-family re-anchor 2574 = 2562 + 12 unit / 247 files (the family's live anchor)",
     "the collateral family — the count-family re-anchor 2588 = 2574 + 14 unit / 248 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2574 checks, Vitest) |",
     "| `bun run test` | Unit tests (2588 checks, Vitest) |"),
    ("(2574 unit / 73 smoke / 262 e2e)",
     "(2588 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2574 checks):",
     "- **Unit Tests** (Vitest, 2588 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2574 unit checks green',
     'project_state: "2588 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2574 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2588 checks;"),
    ("bun run test          # 2574/2574",
     "bun run test          # 2588/2588"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **247 files** | **2574** | | Vitest |",
     "| **Unit total** | **248 files** | **2588** | | Vitest |"),
    ("- [ ] `bun run test` → 2574/2574",
     "- [ ] `bun run test` → 2588/2588"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2574 checks / 247 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2588 checks / 248 files) |"),
])

# --- The §7.1 row for the s186 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S186_ROW = (
    "| Unit — THE TRAP-4 SUBTRACTIVE REPAIR + F173 REGISTRATIONS (the one-hundred-and-thirty-fourth audit's chosen work, the SIXTH consecutive same-vocabulary cycle — 0C/0H/0M/1L/6I, the third consecutive cycle with Low-severity members, again surfaced by measurement depth — the A-L-1 live computed-DOM + shipped-CSS + pixel evidence): S186-A — THE TRAP-4 SUBTRACTIVE REPAIR (A-L-1, the §12 trap-4 subtractive member + F173): the minimal-card back-link's v3-born -mb-2 composed with the LATER sibling's space-y margin under v3 (24-8=16px mobile / 32-8=24px sm+) but REPLACED v4's :where() margin-block-end (the (0,1,0) utility over the (0,0,0) :where()) — an 8px overlap on the signup/forgot/verify states since the minimal card's birth, undetected by 185 cycles (the ref-audit clips never capture the login minimal states; the e2e asserted visibility only); mirrored per the skill's own §12 form — the -mb-2 dropped, the explicit -mt-2 riding the header wrapper (the LATER child) in the minimal-conditional form, the 16px/24px rhythm restored; the e2e locator retired with the class + the geometry pin added (the count(1) one-button form on the sent state; the 24px computed-gap assertion on the 1280px viewport of the signup test — the class family no longer geometrically unpinned; the layer MOVING 14,359 -> 14,365, the F40 rider engaging — a deliberate remediation never drift) + S186-B — THE REGISTRATIONS (the s186-id-stable-premises-note at the 60th consecutive cycle with the P2 member's FILE LABEL corrected to editor-view.tsx:413-419 per B-I-1 — the F170 family's file-label member, the cycle after the line-label member + the s186-below-threshold-note with the fifteenth-generation carriers :2849/:2908/:2977 verified EXACT — the corrected arithmetic's FOURTH application + THE F173 LESSON: a class composition measured from a reference rendered by a DIFFERENT engine version is itself a rendering claim about the target's engine — the composition re-derived under the target's own cascade law before shipping + the A-I-4 coordinate correction (the S184-A guard at :246) + the A-I-1 scope-precision note + the SIXTEENTH generation pre-registered at the MEASURED post-collateral coordinates) + S186-C the per-session pin family (14 pins: 8 RED — the trap-4 source contract + the e2e rider + the doc-side collateral / 6 green-at-birth — the two worklog-registration notes, the F138 guard's THIRTY-SEVENTH instance (the s185 plan's record pinned 5/5 ticked at d8e29f63), the script-provenance member, the audit-entry member, the source-survival member, the source-standing member; the MEASURED birth form with three pin-form corrections applied at birth (the note-internal-bracket truncation class — a NEW member of the s159 family: the bracket-delimited registration notes carry no internal ']' characters, the markSaved and teams-id forms; the A-I-4 phrase spelling; the pin-count arithmetic 13 -> 14); the constants born rolling-safe at the post-spec figures 2588/248) and the collateral family (the count-family re-anchor 2588 = 2574 + 14 unit / 248 files; the spec-constants sweep 67 UNIT + 66 FILES; the layer-total family MOVING at 14,365 — the F40 rider fully engaged (40 toBe sites across 26 specs + the two login-screen per-file pins 741 -> 747 + the s185 live comment), a deliberate remediation never drift; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its twelfth re-quote cycle; the env census figure 17 sites across 9 vars; the s151..s185 SKILL-version pins onto v1.164.0; the s154..s185 forward-guard rolling re-anchors onto v1.165.0; the s158 title pin onto v1.165.0; the s173..s185 per-spec title-pin riders onto v1.165.0 — the family's fourteenth member; e2e stays 262 (assertions only); smoke stays 73) | `tests/lows-s186.test.ts` | 14 | tests | Vitest |\n"
)
if "lows-s186.test.ts" not in pad_text:
    anchor = "| **Unit total** | **248 files** | **2588** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S186_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s186 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s186 §7.1 row already present")

# --- The AGENTS session-186 bullet (inserted above the s185 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The trap-4 subtractive repair + F173 registration seams (session 186, S186-A..S186-C — the one-hundred-and-thirty-fourth Mode C audit's chosen work, the SIXTH consecutive same-vocabulary cycle — the auditors' census A 0C/0H/0M/1L/4I + B 0C/0H/0M/0L/2I combined 0C/0H/0M/1L/6I, the third consecutive cycle with Low-severity members, again surfaced by measurement depth under the same skills/web-application/SKILL.md v1.1.0 vocabulary — A-L-1 by live computed-DOM measurement + shipped-CSS cascade analysis + pixel evidence; the comment-truth census 31+0 sampled / 31 TRUE / 0 FALSE — the zero-false direction returning after two single-false cycles):** (a) S186-A THE TRAP-4 SUBTRACTIVE REPAIR (A-L-1, the §12 trap-4 subtractive member + F173) — the minimal-card back-link's v3-born -mb-2 (login-screen.tsx:314) composed with the LATER sibling's space-y margin under v3 (24-8=16px) but REPLACED v4's :where() margin-block-end (an 8px overlap on the signup/forgot/verify states since the minimal card's birth, undetected by 185 cycles); mirrored per the skill's own §12 form — the -mb-2 dropped, the explicit -mt-2 riding the header wrapper (the LATER child) minimal-only, the 16px/24px rhythm restored; the e2e locator retired with the class (the count(1) one-button form) + the geometry pin added (24px computed gap on the 1280px viewport); the layer MOVING at 14,365 (the F40 rider engaging, a deliberate remediation never drift); (b) S186-B THE REGISTRATIONS — the s186-id-stable-premises-note at the 60th consecutive cycle (the P2 member's file label corrected to editor-view.tsx:413-419 per B-I-1 — the F170 family's file-label member, the cycle after the line-label member) + the s186-below-threshold-note (the fifteenth-generation carriers :2849/:2908/:2977 verified EXACT — the corrected arithmetic's fourth application; the F173 copied-composition truth lesson: a class composition measured from a reference rendered by a DIFFERENT engine version is itself a rendering claim about the target's engine — the composition re-derived under the target's own cascade law before shipping; the A-I-4 coordinate correction — the S184-A guard at :246; the A-I-1 scope-precision note; the SIXTEENTH generation pre-registered at the MEASURED post-collateral coordinates); (c) S186-C the 14-pin spec (8 RED / 6 green-at-birth, the MEASURED birth form with three pin-form corrections applied at birth — the note-internal-bracket truncation class a new member of the s159 family; the constants born rolling-safe at 2588/248) with the collateral family (the count-family re-anchor 2588 = 2574 + 14 unit / 248 files (the family's live anchor); the layer-total family MOVING at 14,365 — the F40 rider fully engaged; the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its twelfth re-quote cycle pre-armed; the F138 guard's THIRTY-SEVENTH instance — the s185 plan 5/5 ticked at d8e29f63; the 162nd reference audit NO DRIFT with the clip byte-identical the 123rd consecutive session; mobile nav 9/9 the 163rd session; pins S128..S185 778/778 across 58).\n"
)
if "session 186, S186-A..S186-C" not in agents_text:
    anchor = "- **The receipt-count truth repair + F172 registration seams (session 185"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-186 bullet inserted")
else:
    print("AGENTS.md: session-186 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s185 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 186):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.163\\.0" in text:
        text = text.replace("version: 1\\.163\\.0", "version: 1\\.164\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.164.0)")
    elif "version: 1\\.164\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.163.0")' in text:
        # the s181/s182/s183/s184 specs' toContain literal form (the spec
        # pins the version line by substring — the rolling re-anchor at
        # the literal layer)
        text = text.replace('toContain("1.163.0")', 'toContain("1.164.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.163.0")' in text:
        # the s185 spec's fuller toContain form (the version-line substring
        # with the field prefix — the rolling re-anchor at the literal layer)
        text = text.replace('toContain("version: 1.163.0")', 'toContain("version: 1.164.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.164.0")' in text or 'toContain("version: 1.164.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s185 forward count-truth guards' rolling re-anchors
# (v1.164.0 -> v1.165.0 — the s154 guard's THIRTY-SECOND rolling
#     instance, the s155 guard's THIRTY-FIRST, ..., the s185 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 186):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.164.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.165.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.164\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.165\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.164.0 -> v1.165.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its twenty-seventh instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.164.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.165.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s185 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s185 — the
#     s185 spec's title pin joining as the FOURTEENTH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.164\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.165\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.164.0");',
         '    expect(lastUpdated).toContain("v1.165.0");'),
    ])

# (3b) the s185 spec's title-pin form (the FOURTEENTH member's own shape —
#      the toMatch single-line form, not the two-line rider form above):
patch("tests/lows-s185.test.ts", [
    ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.164\\.0$/m);",
     "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.165\\.0$/m);"),
    ('expect(lastUpdated).toContain("v1.164.0");',
     'expect(lastUpdated).toContain("v1.165.0");'),
])

# --- THE F40 LAYER-TOTAL RIDER (the layer MOVING 14,359 -> 14,365) -------------
# The 26 spec toBe riders (40 sites — the s163..s180 era specs carry
# two each) + the two login-screen per-file pins (741 -> 747) + the
# s185 spec's live comment. The frozen records (the AGENTS/PAD chain
# entries and session bullets) are NEVER touched — the historical
# narrative stays; only the live-derivation assertions ride.
rider_specs = sorted(set(
    str(p) for p in (ROOT / "tests").glob("lows-s*.test.ts")
    if "toBe(14359)" in p.read_text()
))
toBe_sites = 0
for spec in rider_specs:
    p = ROOT / spec
    text = p.read_text()
    n = text.count("toBe(14359)")
    text = text.replace("toBe(14359)", "toBe(14365)")
    p.write_text(text)
    toBe_sites += n
print(f"F40 layer rider: {len(rider_specs)} specs, {toBe_sites} toBe sites ridden 14359 -> 14365")

# the two login-screen per-file pins (the s184 + s185 specs):
for spec in ("tests/lows-s184.test.ts", "tests/lows-s185.test.ts"):
    p = ROOT / spec
    text = p.read_text()
    old = 'expect(liveLayerPerFile["src/components/login-screen.tsx"]).toBe(741);'
    new = 'expect(liveLayerPerFile["src/components/login-screen.tsx"]).toBe(747);'
    if old in text:
        text = text.replace(old, new)
        p.write_text(text)
        print(f"{spec}: the login-screen per-file pin ridden 741 -> 747")
    elif new in text:
        print(f"{spec}: the login-screen per-file pin already at 747")

# the s185 spec's live comment (the assertion it describes rode above):
p = ROOT / "tests/lows-s185.test.ts"
text = p.read_text()
old_c = "    // The layer STAYS: 14,359 — derived live, never quoted."
new_c = "    // The layer at the S186 figure: 14,365 — derived live, never quoted\n    // (ridden from 14,359 by the S186-A F40 rider — the s185 STAYS form\n    // was the s185 cycle's own live claim, now the s186 rider's)."
if old_c in text:
    text = text.replace(old_c, new_c)
    p.write_text(text)
    print("tests/lows-s185.test.ts: the live comment ridden to the s186 form")
elif new_c in text:
    print("tests/lows-s185.test.ts: the live comment already ridden")

# --- the census-literal lockstep rider (the s185 spec's rg-census probe) -------
# The s185 spec's pair-unity member greps the tree for the declaring
# specs and counts them — the rg command's digit literals and the
# expected counts ride WITH the sweep (the s186 member of the lockstep
# family; runs BEFORE the sweep so the s185 spec's dual occurrences
# resolve to one).
import re as _re
p185 = ROOT / "tests/lows-s185.test.ts"
t185 = p185.read_text()
rg_line = [ln for ln in t185.split("\n") if "rg -l" in ln and "const UNIT" in ln]
assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
new_rg_line = rg_line[0].replace('"2574"', '"2588"').replace('"247"', '"248"')
applied = 0
if new_rg_line != rg_line[0]:
    t185 = t185.replace(rg_line[0], new_rg_line)
    applied += 1
for old_s, new_s in [
    ("expect(unitFiles).toBe(66);", "expect(unitFiles).toBe(67);"),
    ("expect(filesFiles).toBe(65);", "expect(filesFiles).toBe(66);"),
]:
    if new_s in t185 and old_s not in t185:
        continue
    assert old_s in t185, f"census literal MISSING: {old_s}"
    t185 = t185.replace(old_s, new_s)
    applied += 1
p185.write_text(t185)
print(f"tests/lows-s185.test.ts: {applied} census-literal lockstep sites ridden (rg digits + 66/65 -> 67/66)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2574";' in text:
        assert text.count('const UNIT = "2574";') == 1
        text = text.replace('const UNIT = "2574";', 'const UNIT = "2588";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2588";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "247";' in text:
        assert text.count('const FILES = "247";') == 1
        text = text.replace('const FILES = "247";', 'const FILES = "248";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "248";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")

