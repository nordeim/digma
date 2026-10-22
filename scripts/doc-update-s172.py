#!/usr/bin/env python3
"""doc-update-s172.py — the Session 172 GREEN collateral, part 1 (the FIX
form — live claim sites, never frozen records): the S172-A README noun-unit
repair (B172-I-1), the count-family re-anchor 2404 = 2392 + 12 unit / 234
files across every live claim site, the §7.1 row for the s172 spec, the
AGENTS session-172 bullet, the prior-spec forward-guard ROLLING re-anchors
(the s154..s171 count-truth guards' version literals onto v1.151.0), the
s151..s171 SKILL-version pins onto v1.150.0, the s158 title pin onto
v1.151.0, and the spec-constants re-anchor (the pair-unity family).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s172.py
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

# --- README.md — the count rows + THE NOUN-UNIT RE-WORD (S172-A) -------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2392 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2404 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2392 checks on the pure domain seams",
     "bun run test              # unit tests — 2404 checks on the pure domain seams"),
    # THE S172-A NOUN-UNIT RE-WORD (B172-I-1): the file count 18 was
    # wearing the handler noun — onto the file unit with the handler
    # figure carried in parentheses.
    ("7 page routes + 18 API route handlers, standalone output",
     "7 page routes + 18 API route files (25 exported handlers), standalone output"),
    ("# 18 route handlers (auth, projects, elements, teams, stats, ai-assistant, health)",
     "# 18 route files / 25 handlers (auth, projects, elements, teams, stats, ai-assistant, health)"),
])

# --- AGENTS.md — the count rows ----------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2392 checks) | `bun run test` |",
     "| Unit tests (2404 checks) | `bun run test` |"),
    ("`bun run test` (2392) → `bun run build`",
     "`bun run test` (2404) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker, riding
    # the s171 bullet's tail — the F106 live-claim classification)
    ("the count-family re-anchor 2392 = 2377 + 15 unit / 233 files (the family's live anchor)",
     "the count-family re-anchor 2404 = 2392 + 12 unit / 234 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2392 checks, Vitest) |",
     "| `bun run test` | Unit tests (2404 checks, Vitest) |"),
    ("(2392 unit / 73 smoke / 262 e2e)",
     "(2404 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2392 checks):",
     "- **Unit Tests** (Vitest, 2404 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2392 unit checks green',
     'project_state: "2404 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2392 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2404 checks;"),
    ("bun run test          # 2392/2392",
     "bun run test          # 2404/2404"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **233 files** | **2392** | | Vitest |",
     "| **Unit total** | **234 files** | **2404** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2392/2392",
     "- [ ] `bun run test` → 2404/2404"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2392 checks / 233 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2404 checks / 234 files) |"),
])

# --- The §7.1 row for the s172 spec (inserted after the s171 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE README NOUN-UNIT REPAIR + THE BELOW-THRESHOLD/PREMISES REGISTRATIONS (the one-hundred-and-twentieth audit's chosen work, the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/2I — a ZERO-SOURCE-FINDING all-Informational cycle, the FIFTH consecutive STAYS cycle, every actionable member on the doc/directive surface): S172-A — the README noun-unit repair (the B172-I-1 remediation, the FIX form — live claim sites never frozen records): README's two noun-unit sites re-worded onto the file unit with the handler figure carried in parentheses (\"18 API route files (25 exported handlers)\" — the file count 18 had been wearing the handler noun while the live enumeration carries 25 exported handlers, 24 async + health's sync GET; the F159 noun-unit closure doctrine) + S172-B — the below-threshold + directive-side registration (the B172-I-2 remediation): the bracketed s172-below-threshold-note at the worklog — the directive-phrasing conflation registered with its next-generation correction (\"19 spec-exercised (13 write-carrying)\"), the A172-I-1..I-3 trio, the pre-existing families carried + S172-C — the premises registration (the s172-id-stable-premises-note at the 46th consecutive cycle, the four premises re-derived live and holding, the judgment carried unchanged) + S172-D the per-session pin family (12 pins: 6 RED doc-side members / 6 green-at-birth — the registration notes landed before the spec's birth; RED 6/6 EXACT after ONE spec-form repair — the repair-seam phrase onto the record's own spelling, the F143 phrase-case lesson's own instance; the F138 guard's TWENTY-THIRD instance riding the survival form — the s171 plan's record pinned 6/6 ticked at 85965bc6 per the pre-armed session_415/416 directive) and the collateral family (the count-family re-anchor 2404 = 2392 + 12 unit / 234 files; the layer-total family STAYING at 14,307 — the fifth consecutive STAYS cycle, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450; the s151..s171 SKILL-version pins onto v1.150.0; the s154..s171 forward-guard rolling re-anchors onto v1.151.0; the s158 title pin onto v1.151.0; e2e stays 262; smoke stays 73) | `tests/lows-s172.test.ts` | 12 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s171.test.ts` | 15 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s171 §7.1 anchor row not found")
if "`tests/lows-s172.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s172 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-172 bullet (inserted above the s171 bullet) -----------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The README noun-unit repair + below-threshold/premises registration seams (session 172, "
    "S172-A..S172-D — the one-hundred-and-twentieth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/2I, every claim lead-verified at its seams — a "
    "ZERO-SOURCE-FINDING all-Informational cycle, the FIFTH consecutive STAYS cycle):** (a) "
    "THE README NOUN-UNIT REPAIR (S172-A, the B172-I-1 remediation — the FIX form, live claim "
    "sites never frozen records): README:133's \"7 page routes + 18 API route handlers\" and "
    "README:184's \"# 18 route handlers\" named the FILE count with the HANDLER noun — the live "
    "enumeration carries 18 route FILES with 25 exported handlers (24 async + health's sync "
    "GET); both sites re-worded onto the file unit with the handler figure in parentheses "
    "(\"18 API route files (25 exported handlers)\"); the F159 noun-unit closure doctrine (a "
    "count and its noun must close in the same unit — the noun is as much a live claim as the "
    "number); (b) THE BELOW-THRESHOLD + DIRECTIVE-SIDE REGISTRATION (S172-B, the B172-I-2 "
    "remediation): the bracketed s172-below-threshold-note at the worklog — the s172 "
    "directive's \"19 spec-exercised write-carrying handlers\" phrasing registered with its "
    "next-generation correction (\"19 spec-exercised (13 write-carrying)\"), the A172-I-1..I-3 "
    "trio (the five S168 below-threshold observations re-verified; the components-panel PAD "
    "§10 posture; the A171-I-1 composition-language correction landed and verified), the "
    "pre-existing families carried; the comment-truth census 141 sampled, 141 TRUE / 0 FALSE "
    "— the SEVENTH consecutive zero-false sampling; (c) THE PREMISES REGISTRATION (S172-C): "
    "the s172-id-stable-premises-note (the 46th consecutive cycle: the four premises "
    "re-derived live and pinned — P1's twelve churn-consuming sites value-based or "
    "honest-refusal, P2's index-stable remap behind the five-guard stack, P3's "
    "replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage "
    "perimeter; the judgment carried unchanged); (d) THE PER-SESSION PIN FAMILY (S172-D): 12 "
    "pins — 6 RED doc-side members / 6 green-at-birth (the registration notes landed before "
    "the spec's birth; RED 6/6 EXACT after ONE spec-form repair — the repair-seam phrase onto "
    "the record's own spelling, the F143 phrase-case lesson's own instance). Pinned by "
    "`tests/lows-s172.test.ts` (the count-family re-anchor 2404 = 2392 + 12 unit / 234 files "
    "— the family's live anchor; the 22-file layer at 14,307 — the STAYS-cycle form, the "
    "zero-source-change cycle; the route layer at 2,450 — untouched).\n"
)
marker = "- **The dependency-bump doc-truth repair + dependency-bump registration seams (session 171,"
if "`tests/lows-s172.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s171 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-172 bullet inserted")
else:
    print("AGENTS.md: session-172 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s171 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts", "tests/lows-s167.test.ts", "tests/lows-s168.test.ts", "tests/lows-s169.test.ts", "tests/lows-s170.test.ts", "tests/lows-s171.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.149\\.0" in text:
        text = text.replace("version: 1\\.149\\.0", "version: 1\\.150\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.150.0)")
    elif "version: 1\\.150\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s171 forward count-truth guards' rolling re-anchors
# (v1.150.0 -> v1.151.0 — the s154 guard's EIGHTEENTH rolling instance,
#     the s155 guard's SEVENTEENTH, the s156 guard's SIXTEENTH, the s157
#     guard's FIFTEENTH, the s158 guard's FOURTEENTH, the s159 guard's
#     THIRTEENTH, the s160 guard's TWELFTH, the s161 guard's ELEVENTH,
#     the s162 guard's TENTH, the s163 guard's NINTH, the s164 guard's
#     EIGHTH, the s165 guard's SEVENTH, the s166 guard's SIXTH, the s167
#     guard's FIFTH, the s168 guard's FOURTH, the s169 guard's THIRD,
#     the s170 guard's SECOND, the s171 guard's FIRST) — the F40 rider
#     at the count-truth guard family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts", "tests/lows-s167.test.ts", "tests/lows-s168.test.ts", "tests/lows-s169.test.ts", "tests/lows-s170.test.ts", "tests/lows-s171.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.150.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.151.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.150\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.151\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.150.0 -> v1.151.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s172 cycle's own rider
#     form, its thirteenth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.150.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.151.0",'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2392";' in text:
        assert text.count('const UNIT = "2392";') == 1
        text = text.replace('const UNIT = "2392";', 'const UNIT = "2404";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2404";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "233";' in text:
        assert text.count('const FILES = "233";') == 1
        text = text.replace('const FILES = "233";', 'const FILES = "234";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "234";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
