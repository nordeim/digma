#!/usr/bin/env python3
"""doc-update-s176.py — the Session 176 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2452 = 2440 + 12 unit / 238 files across every
live claim site, the §7.1 row for the s176 spec, the AGENTS session-176
bullet, the prior-spec forward-guard ROLLING re-anchors (the s154..s175
count-truth guards' version literals onto v1.155.0), the s151..s175
SKILL-version pins onto v1.154.0, the s158 title pin onto v1.155.0,
the s173 + s174 + s175 per-spec title-pin riders onto v1.155.0 (the
family's fourth member), and the spec-constants re-anchor (the
pair-unity family).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s176.py
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
    ("| Unit tests | Vitest | 5 | 2440 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2452 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2440 checks on the pure domain seams",
     "bun run test              # unit tests — 2452 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows ----------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2440 checks) | `bun run test` |",
     "| Unit tests (2452 checks) | `bun run test` |"),
    ("`bun run test` (2440) → `bun run build`",
     "`bun run test` (2452) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker, riding
    # the s175 bullet's tail — the F106 live-claim classification)
    ("the count-family re-anchor 2440 = 2428 + 12 unit / 237 files (the family's live anchor)",
     "the count-family re-anchor 2452 = 2440 + 12 unit / 238 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2440 checks, Vitest) |",
     "| `bun run test` | Unit tests (2452 checks, Vitest) |"),
    ("(2440 unit / 73 smoke / 262 e2e)",
     "(2452 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2440 checks):",
     "- **Unit Tests** (Vitest, 2452 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2440 unit checks green',
     'project_state: "2452 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2440 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2452 checks;"),
    ("bun run test          # 2440/2440",
     "bun run test          # 2452/2452"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **237 files** | **2440** | | Vitest |",
     "| **Unit total** | **238 files** | **2452** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2440/2440",
     "- [ ] `bun run test` → 2452/2452"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2440 checks / 237 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2452 checks / 238 files) |"),
])

# --- The §7.1 row for the s176 spec (inserted after the s175 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE DISPATCH-FIGURE CORRECTION + FIFTH-GENERATION COORDINATE + CONTINUITY REGISTRATIONS (the one-hundred-and-twenty-fourth audit's chosen work, a ZERO-SOURCE-FINDING all-Informational cycle — the auditors' census A 0C/0H/0M/0L/4I + B 0C/0H/0M/0L/3I, every member on the doc/directive/registration surface): S176-A — the dispatch-figure correction (B176-I-1, the QUOTED-LIVE TRAP): the per-route dispatch figure for projects/[id]/duplicate/route.ts read 153 through at least two prior dispatch cycles while the live file has carried 156 since the S152 delivery (b916639e) — the stale member rode inside the re-verified 2,450 total because the total absorbs per-file drift (the internal-consistency probe: the dispatch list hand-sums 2,447 against its stated 2,450 — the mismatch indicts the decomposition, never the tree); a '(wc live)' phrase in a prior record describes the run that made it, never the cycle that quotes it; the correction: the per-file figure family's first LIVE pin (the spec reads the route file at runtime, 156) + the internal-consistency probe mechanized (the 18 per-file figures re-derived live and summed against the total); the F163 lesson (the quoted-live trap member) lands in the digma_SKILL + S176-B — the premises registration (the s176-id-stable-premises-note at the 50th consecutive cycle, the four premises re-derived live and holding, the judgment carried unchanged) + S176-C the per-session pin family (12 pins: 6 RED doc-side members / 6 green-at-birth incl. the source-survival member carrying the corrected per-file figure pinned LIVE; RED 6/6 EXACT on the FIRST run, zero spec-form repairs; the F138 guard's TWENTY-SEVENTH instance riding the survival form — the s175 plan's record pinned 5/5 ticked at 76c27cf2 per the pre-armed session_439/440 directive) and the collateral family (the count-family re-anchor 2452 = 2440 + 12 unit / 238 files; the layer-total family STAYING at 14,307 — the ninth consecutive STAYS figure, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450 — the per-file correction registered, the total never at fault; the s151..s175 SKILL-version pins onto v1.154.0; the s154..s175 forward-guard rolling re-anchors onto v1.155.0; the s158 title pin onto v1.155.0; the s173+s174+s175 per-spec title-pin riders onto v1.155.0 — the family's fourth member; e2e stays 262; smoke stays 73) | `tests/lows-s176.test.ts` | 12 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s175.test.ts` | 12 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s175 §7.1 anchor row not found")
if "`tests/lows-s176.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s176 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-176 bullet (inserted above the s175 bullet) -----------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The dispatch-figure correction + continuity + fifth-generation registration seams (session 176, "
    "S176-A..S176-C — the one-hundred-and-twenty-fourth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/0L/4I + B 0C/0H/0M/0L/3I, a zero-source-finding all-Informational cycle, every claim "
    "lead-verified at its seams — every member on the doc/directive/registration surface):** (a) THE "
    "DISPATCH-FIGURE CORRECTION (S176-A, B176-I-1 — the QUOTED-LIVE TRAP): the per-route dispatch "
    "figure for projects/[id]/duplicate/route.ts read 153 through at least two prior dispatch cycles "
    "while the live file has carried 156 since the S152 delivery (b916639e) — the stale member rode "
    "inside the re-verified 2,450 total because the total absorbs per-file drift; the internal-"
    "consistency probe catches it (the dispatch list hand-sums 2,447 against its stated 2,450 — the "
    "mismatch indicts the decomposition, never the tree); a '(wc live)' phrase in a prior record "
    "describes the run that made it, never the cycle that quotes it; the correction: pin 156, never "
    "re-quote 153 (the per-file figure family's first LIVE pin) + the internal-consistency probe "
    "mechanized in the spec (the 18 per-file figures re-derived live and summed against the total); "
    "the F163 lesson lands in the digma_SKILL (the quoted-live trap member — the dispatch-figure "
    "provenance arm); (b) THE PREMISES REGISTRATION (S176-B): the s176-id-stable-premises-note (the "
    "50th consecutive cycle: the four premises re-derived live and pinned — P1's twelve churn-"
    "consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard "
    "stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's "
    "zero-storage perimeter; the judgment carried unchanged); (c) THE PER-SESSION PIN FAMILY "
    "(S176-C): 12 pins — 6 RED doc-side members / 6 green-at-birth incl. the source-survival member "
    "carrying the corrected figure pinned LIVE at 156 (the registration notes landed before the "
    "spec's birth; RED 6/6 EXACT on the FIRST run, zero spec-form repairs; the F138 guard's "
    "TWENTY-SEVENTH instance — the s175 plan's record pinned 5/5 ticked at 76c27cf2 per the "
    "pre-armed session_439/440 directive). Pinned by `tests/lows-s176.test.ts` (the count-family "
    "re-anchor 2452 = 2440 + 12 unit / 238 files — the family's live anchor; the 22-file layer at "
    "14,307 — the ninth consecutive STAYS figure, the zero-source-change form; the route layer at "
    "2,450 — the per-file correction registered, the total never at fault; the comment-truth census "
    "141 sampled / 141 TRUE / 0 FALSE — the zero-false census restored at the first cycle after "
    "the born-stale member).\n"
)
marker = "- **The comment-truth repair + continuity + coordinate-fourth-generation registration seams (session 175,"
if "`tests/lows-s176.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s175 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-176 bullet inserted")
else:
    print("AGENTS.md: session-176 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s175 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
SPECS = []
for nn in range(151, 176):
    SPECS.append(f"tests/lows-s{nn}.test.ts")
for name in SPECS:
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.153\\.0" in text:
        text = text.replace("version: 1\\.153\\.0", "version: 1\\.154\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.154.0)")
    elif "version: 1\\.154\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s175 forward count-truth guards' rolling re-anchors
# (v1.154.0 -> v1.155.0 — the s154 guard's TWENTY-SECOND rolling instance,
#     the s155 guard's TWENTY-FIRST, the s156 guard's TWENTIETH, the s157
#     guard's NINETEENTH, the s158 guard's EIGHTEENTH, the s159 guard's
#     SEVENTEENTH, the s160 guard's SIXTEENTH, the s161 guard's FIFTEENTH,
#     the s162 guard's FOURTEENTH, the s163 guard's THIRTEENTH, the s164
#     guard's TWELFTH, the s165 guard's ELEVENTH, the s166 guard's TENTH,
#     the s167 guard's NINTH, the s168 guard's EIGHTH, the s169 guard's
#     SEVENTH, the s170 guard's SIXTH, the s171 guard's FIFTH, the s172
#     guard's FOURTH, the s173 guard's THIRD, the s174 guard's SECOND,
#     the s175 guard's FIRST) — the F40 rider at the count-truth guard
#     family.
GUARDS = []
for nn in range(154, 176):
    GUARDS.append(f"tests/lows-s{nn}.test.ts")
for name in GUARDS:
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.154.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.155.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.154\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.155\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.154.0 -> v1.155.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s176 cycle's own rider
#     form, its seventeenth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.154.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.155.0",'),
])

# (3) the per-spec title-pin riders (the F40 family at the title pin —
#     the s173, s174, AND s175 specs carry the per-spec title member
#     born hard-coded onto their own chain heads; every later cycle
#     re-anchors them onto the CURRENT head, exactly the s158
#     title-lag form; the family now established at s173/s174/s175/s176).
#     The title regex + the Last-Updated containment are LIVE claims
#     (the head moves every cycle); the count re-anchors' /v1.154.0/
#     containments stay (the v1.154.0 chain entry is retained forever —
#     a frozen-record form, still true).
patch("tests/lows-s173.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.154\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.155\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.154.0");',
     '    expect(lastUpdated).toContain("v1.155.0");'),
])
patch("tests/lows-s174.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.154\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.155\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.154.0");',
     '    expect(lastUpdated).toContain("v1.155.0");'),
])
patch("tests/lows-s175.test.ts", [
    ("      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.154\\.0$/m,",
     "      /^# Digma — Master Project Architecture Document \\(PAD\\) v1\\.155\\.0$/m,"),
    ('    expect(lastUpdated).toContain("v1.154.0");',
     '    expect(lastUpdated).toContain("v1.155.0");'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2440";' in text:
        assert text.count('const UNIT = "2440";') == 1
        text = text.replace('const UNIT = "2440";', 'const UNIT = "2452";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2452";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "237";' in text:
        assert text.count('const FILES = "237";') == 1
        text = text.replace('const FILES = "237";', 'const FILES = "238";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "238";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
