#!/usr/bin/env python3
"""doc-update-s187.py — the Session 187 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2600 = 2588 + 12 unit / 249 files across every
live claim site, the §7.1 row for the s187 spec, the AGENTS
session-187 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s186 count-truth guards' version literals onto v1.166.0),
the s151..s186 SKILL-version pins onto v1.165.0, the s158 title pin
onto v1.166.0, the s173..s186 per-spec title-pin riders onto v1.166.0
(the family's fifteenth member — the s186 spec's title pin joining),
the census-literal lockstep rider (the s186 spec's rg probe), and the
spec-constants re-anchor (the pair-unity family).

NO F40 layer rider this cycle — the layer STAYS at 14,365 (the
zero-movement form: no source-code movement, no remediation receipt).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s187.py
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
    ("| Unit tests | Vitest | 5 | 2588 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2600 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2588 checks on the pure domain seams",
     "bun run test              # unit tests — 2600 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows + the canonical rolling live anchor -----------
patch("AGENTS.md", [
    ("| Unit tests (2588 checks) | `bun run test` |",
     "| Unit tests (2600 checks) | `bun run test` |"),
    ("`bun run test` (2588) → `bun run build`",
     "`bun run test` (2600) → `bun run build`"),
    # the canonical rolling live anchor (the s152 bullet's tail site —
    # the em-dash form; the s186 bullet's paren form is a FROZEN record)
    ("the collateral family — the count-family re-anchor 2588 = 2574 + 14 unit / 248 files (the family's live anchor)",
     "the collateral family — the count-family re-anchor 2600 = 2588 + 12 unit / 249 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2588 checks, Vitest) |",
     "| `bun run test` | Unit tests (2600 checks, Vitest) |"),
    ("(2588 unit / 73 smoke / 262 e2e)",
     "(2600 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2588 checks):",
     "- **Unit Tests** (Vitest, 2600 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2588 unit checks green',
     'project_state: "2600 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2588 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2600 checks;"),
    ("bun run test          # 2588/2588",
     "bun run test          # 2600/2600"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **248 files** | **2588** | | Vitest |",
     "| **Unit total** | **249 files** | **2600** | | Vitest |"),
    ("- [ ] `bun run test` → 2588/2588",
     "- [ ] `bun run test` → 2600/2600"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2588 checks / 248 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2600 checks / 249 files) |"),
])

# --- The §7.1 row for the s187 spec (inserted before the Unit total row) ------
pad = ROOT / "Project_Architecture_Document.md"
pad_text = pad.read_text()
S187_ROW = (
    "| Unit — THE WINDOW-START-LABEL CORRECTION + F174 REGISTRATIONS (the one-hundred-and-thirty-fifth audit's chosen work, the FIRST cycle under the NEW skills/web-application/SKILL.md v1.2.0 vocabulary — the operator's 2026-10-25 revision, the first vocabulary change since 2026-10-23 — 0C/0H/0M/0L/3I, the FIRST zero-Low cycle since S183, every member of the F170 coordinate-precision family): S187-A — THE REGISTRATIONS (the s187-id-stable-premises-note at the 62nd consecutive cycle with the P1 member's properties-panel coordinates CORRECTED to :1377/:2207 per A-I-2 — the F170 family's comment-block member + the s187-below-threshold-note with the sixteenth-generation carriers :2851/:2910/:2979 verified EXACT WITH THE B-I-1 WINDOW CORRECTION — :2832 is the S168 row, :2833 is the S169 row, so the window :2833..:2850 = s169..s186 (18 rows, arithmetic-consistent), the registered s170..s186 phrase internally inconsistent at 18 line-slots vs 17 sessions (the v1.165.0 chain-line insertion at :6 shifted every §7.1 row +1 — the note extended the window's end but never shifted the start label) + THE F174 LESSON: THE WINDOW-START-LABEL TRUTH MEMBER — a row-window's start label is itself a coordinate claim: when an insertion lands above the window, BOTH the end composition AND the start label must be re-derived, and a window phrase that names its extent in sessions must be internally consistent with its line-span (N line-slots name N sessions; a span-label mismatch is the tell) + the A-I-1 coordinate corrections (the -mt-2 mirror site at login-screen.tsx:339 not :333, the autoComplete conditional at :407 not :401 — the S186-A receipt comment's own +6) + the v1.2.0 vocabulary-change registration (three of digma's registered deviations converted to sanctioned patterns — the shared-bucket rate-limit shape, the S181-C fail-hard, the DIGMA_PROXY_HOPS client-IP contract; both new rule families verified digma-compliant at line level — the OTP attempt-counter atomicity (updateMany at every increment site), the smoke-gate executed-vs-passed arithmetic (the two-bucket closure form); the §12 trap catalog byte-unchanged and agreeing with F173) + the SEVENTEENTH generation pre-registered at the MEASURED post-collateral coordinates + the honest environment record (the unguarded-seed trap catch at Phase 0 — the exported-shell DATABASE_URL trap biting the cycle's own db push + seed, the guarded re-push + re-seed restoring the pristine 1/2/6/1/3 form before any gate recorded green)) + S187-B the per-session pin family (12 pins: 5 RED — the doc-side collateral / 7 green-at-birth — the two worklog-registration notes, the F138 guard's THIRTY-EIGHTH instance (the s186 plan's record pinned 5/5 ticked at 2fa13d7e), the script-provenance member, the audit-entry member, the source-survival member, the layer-STAYS member; the MEASURED birth form with one pin-form correction applied at birth (the window-phrase spelling — the s159 family); the constants born rolling-safe at the post-spec figures 2600/249) and the collateral family (the count-family re-anchor 2600 = 2588 + 12 unit / 249 files; the spec-constants sweep 68 UNIT + 67 FILES with the census-literal lockstep rider for the s186 spec's rg probe; the layer-total family STAYING at 14,365 — the zero-movement form, no F40 rider needed; the route figure STAYING at 2,461 with the elements-route figure 420 unchanged — its thirteenth re-quote cycle; the env census figure 17 sites across 9 vars; the s151..s186 SKILL-version pins onto v1.165.0; the s154..s186 forward-guard rolling re-anchors onto v1.166.0; the s158 title pin onto v1.166.0; the s173..s186 per-spec title-pin riders onto v1.166.0 — the family's fifteenth member; e2e stays 262; smoke stays 73) | `tests/lows-s187.test.ts` | 12 | tests | Vitest |\n"
)
if "lows-s187.test.ts" not in pad_text:
    anchor = "| **Unit total** | **249 files** | **2600** | | Vitest |"
    assert anchor in pad_text, "Unit total row not yet re-anchored"
    pad_text = pad_text.replace(anchor, S187_ROW + anchor)
    pad.write_text(pad_text)
    print("PAD: the s187 §7.1 row inserted before the Unit total row")
else:
    print("PAD: the s187 §7.1 row already present")

# --- The AGENTS session-187 bullet (inserted above the s186 bullet) -----------
agents = ROOT / "AGENTS.md"
agents_text = agents.read_text()
BULLET = (
    "- **The window-start-label correction + F174 registration seams (session 187, S187-A..S187-B — the one-hundred-and-thirty-fifth Mode C audit's chosen work, the FIRST cycle under the NEW skills/web-application/SKILL.md v1.2.0 vocabulary (the operator's 2026-10-25 revision — the first vocabulary change since 2026-10-23; the prior six consecutive cycles all ran v1.1.0) — the auditors' census A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/1I combined 0C/0H/0M/0L/3I, the FIRST zero-Low cycle since S183 after three consecutive measurement-depth Low cycles, every member of the F170 coordinate-precision family — zero source-code defect, zero mutation surface; the comment-truth census 31+0 sampled / 31 TRUE / 0 FALSE — the zero-false direction holding a second consecutive cycle):** (a) the v1.2.0 vocabulary-change registration — the revision materially favorable to digma: three of digma's registered deviations converted to sanctioned patterns (the shared-bucket rate-limit shape (auth: 10/15min + ai: 20/5min + crud: 60/5min) now §5's named in-family alternative; the S181-C fail-hard secret enforcement now §5's cited adopted pattern; the DIGMA_PROXY_HOPS client-IP contract now §16's named pattern), both new rule families verified digma-compliant at line level (the OTP attempt-counter ATOMICITY — updateMany-atomic at every increment site, zero read-then-write counters; the smoke-gate executed-vs-passed arithmetic — the two-bucket closure form, no skip path), the §12 Tailwind v4 trap catalog byte-unchanged and its trap-4 prescription exactly the S186-A fix's form (the repo's F173 lesson and the master skill now agreeing), the fresh-clone rule's digma record accurate with the cp-before-first-consumer arm satisfied (README:230/331, AGENTS:24); (b) S187-A THE REGISTRATIONS — the s187-id-stable-premises-note at the 62nd consecutive cycle (the P1 member's properties-panel coordinates corrected to :1377/:2207 per A-I-2 — the F170 family's comment-block member) + the s187-below-threshold-note (the sixteenth-generation carriers :2851/:2910/:2979 verified EXACT with the B-I-1 WINDOW CORRECTION — :2832 is the S168 row, :2833 is the S169 row, the window :2833..:2850 = s169..s186 (18 rows); the F174 window-start-label truth lesson: a row-window's start label is itself a coordinate claim — when an insertion lands above the window, BOTH the end composition AND the start label must be re-derived, and a window phrase that names its extent in sessions must be internally consistent with its line-span; the A-I-1 coordinate corrections — the -mt-2 mirror site at :339, the autoComplete conditional at :407; the SEVENTEENTH generation pre-registered at the MEASURED post-collateral coordinates; the honest environment record — the unguarded-seed trap catch at Phase 0, the guarded re-seed restoring pristine before any gate recorded green); (c) S187-B the 12-pin spec (5 RED / 7 green-at-birth, the MEASURED birth form with one pin-form correction at birth — the window-phrase spelling, the s159 family; the constants born rolling-safe at 2600/249) with the collateral family (the count-family re-anchor 2600 = 2588 + 12 unit / 249 files (the family's live anchor); the layer-total family STAYING at 14,365 (the zero-movement form — no F40 rider needed); the route figure STAYING at 2,461; the env census figure 17 sites across 9 vars; the elements-route figure 420 unchanged — its thirteenth re-quote cycle; the F138 guard's THIRTY-EIGHTH instance — the s186 plan 5/5 ticked at 2fa13d7e; the 163rd reference audit NO DRIFT with the clip byte-identical the 124th consecutive session; mobile nav 9/9 the 164th session; pins S128..S186 792/792 across 59).\n"
)
if "session 187, S187-A..S187-B" not in agents_text:
    anchor = "- **The trap-4 subtractive repair + F173 registration seams (session 186"
    at = agents_text.index(anchor)
    agents_text = agents_text[:at] + BULLET + agents_text[at:]
    agents.write_text(agents_text)
    print("AGENTS.md: session-187 bullet inserted")
else:
    print("AGENTS.md: session-187 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s186 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 187):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.164\\.0" in text:
        text = text.replace("version: 1\\.164\\.0", "version: 1\\.165\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.165.0)")
    elif "version: 1\\.165\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    elif 'toContain("1.164.0")' in text:
        # the s181/s182/s183/s184 specs' toContain literal form (the spec
        # pins the version line by substring — the rolling re-anchor at
        # the literal layer)
        text = text.replace('toContain("1.164.0")', 'toContain("1.165.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the toContain form)")
    elif 'toContain("version: 1.164.0")' in text:
        # the s185/s186 specs' fuller toContain form (the version-line substring
        # with the field prefix — the rolling re-anchor at the literal layer)
        text = text.replace('toContain("version: 1.164.0")', 'toContain("version: 1.165.0")')
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (the version-field toContain form)")
    elif 'toContain("1.165.0")' in text or 'toContain("version: 1.165.0")' in text:
        print(f"{name}: version pin already on the current figure (the toContain form)")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s186 forward count-truth guards' rolling re-anchors
# (v1.165.0 -> v1.166.0 — the s154 guard's THIRTY-THIRD rolling
#     instance, the s155 guard's THIRTY-SECOND, ..., the s186 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
GUARDS = []
for nn in range(154, 187):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.165.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.166.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.165\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.166\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.165.0 -> v1.166.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — its twenty-eighth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.165.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.166.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173..s185 specs carry the per-spec title member born
#     hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173..s186 — the
#     s186 spec's title pin joining as the FIFTEENTH member this
#     cycle).
for rider in (173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184):
    patch(f"tests/lows-s{rider}.test.ts", [
        ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.165\\.0$/m,",
         "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.166\\.0$/m,"),
        ('    expect(lastUpdated).toContain("v1.165.0");',
         '    expect(lastUpdated).toContain("v1.166.0");'),
    ])

# (3b) the s185 + s186 specs' title-pin forms (the FOURTEENTH and
#      FIFTEENTH members' own shape — the toMatch single-line form,
#      not the two-line rider form above):
patch("tests/lows-s185.test.ts", [
    ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.165\\.0$/m);",
     "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.166\\.0$/m);"),
    ('expect(lastUpdated).toContain("v1.165.0");',
     'expect(lastUpdated).toContain("v1.166.0");'),
])
patch("tests/lows-s186.test.ts", [
    ("expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.165\\.0$/m);",
     "expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.166\\.0$/m);"),
    ('expect(lastUpdated).toContain("v1.165.0");',
     'expect(lastUpdated).toContain("v1.166.0");'),
])

# --- the census-literal lockstep rider (the s185 + s186 specs' rg-census probes) -------
# The s185 + s186 specs' pair-unity members grep the tree for the
# declaring specs and count them — the rg commands' digit literals and
# the expected counts ride WITH the sweep (the lockstep family's s187
# member; runs BEFORE the sweep so each spec's dual occurrences
# resolve to one).
import re as _re
for spec_name in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts"):
    p = ROOT / spec_name
    t = p.read_text()
    rg_line = [ln for ln in t.split("\n") if "rg -l" in ln and "const UNIT" in ln]
    if not rg_line:
        print(f"{spec_name}: no rg census line (already ridden or absent)")
        continue
    assert len(rg_line) == 1, f"expected one rg census line, found {len(rg_line)}"
    new_rg_line = rg_line[0].replace('"2588"', '"2600"').replace('"248"', '"249"')
    applied = 0
    if new_rg_line != rg_line[0]:
        t = t.replace(rg_line[0], new_rg_line)
        applied += 1
    for old_s, new_s in [
        ("expect(unitFiles).toBe(67);", "expect(unitFiles).toBe(68);"),
        ("expect(filesFiles).toBe(66);", "expect(filesFiles).toBe(67);"),
    ]:
        if new_s in t and old_s not in t:
            continue
        assert old_s in t, f"census literal MISSING in {spec_name}: {old_s}"
        t = t.replace(old_s, new_s)
        applied += 1
    p.write_text(t)
    print(f"{spec_name}: {applied} census-literal lockstep sites ridden (rg digits + 67/66 -> 68/67)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2588";' in text:
        assert text.count('const UNIT = "2588";') == 1
        text = text.replace('const UNIT = "2588";', 'const UNIT = "2600";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2600";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "248";' in text:
        assert text.count('const FILES = "248";') == 1
        text = text.replace('const FILES = "248";', 'const FILES = "249";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "249";' in text:
        files_files += 1  # already applied
print(f"spec constants: {unit_files} UNIT + {files_files} FILES on the new figures")
