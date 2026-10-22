#!/usr/bin/env python3
"""doc-update-s173.py — the Session 173 GREEN collateral, part 1 (the
registration-cycle form — live claim sites, never frozen records): the
count-family re-anchor 2416 = 2404 + 12 unit / 235 files across every
live claim site, the §7.1 row for the s173 spec, the AGENTS session-173
bullet, the prior-spec forward-guard ROLLING re-anchors (the s154..s172
count-truth guards' version literals onto v1.152.0), the s151..s172
SKILL-version pins onto v1.151.0, the s158 title pin onto v1.152.0, and
the spec-constants re-anchor (the pair-unity family).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/doc-update-s173.py
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
    ("| Unit tests | Vitest | 5 | 2404 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2416 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2404 checks on the pure domain seams",
     "bun run test              # unit tests — 2416 checks on the pure domain seams"),
])

# --- AGENTS.md — the count rows ----------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2404 checks) | `bun run test` |",
     "| Unit tests (2416 checks) | `bun run test` |"),
    ("`bun run test` (2404) → `bun run build`",
     "`bun run test` (2416) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker, riding
    # the s172 bullet's tail — the F106 live-claim classification)
    ("the count-family re-anchor 2404 = 2392 + 12 unit / 234 files (the family's live anchor)",
     "the count-family re-anchor 2416 = 2404 + 12 unit / 235 files (the family's live anchor)"),
])

# --- CLAUDE.md — the count rows -----------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2404 checks, Vitest) |",
     "| `bun run test` | Unit tests (2416 checks, Vitest) |"),
    ("(2404 unit / 73 smoke / 262 e2e)",
     "(2416 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2404 checks):",
     "- **Unit Tests** (Vitest, 2416 checks):"),
])

# --- digma_SKILL.md — the count rows ------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2404 unit checks green',
     'project_state: "2416 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.5 | 2404 checks;",
     "| Unit tests | Vitest | ≥5.0.5 | 2416 checks;"),
    ("bun run test          # 2404/2404",
     "bun run test          # 2416/2416"),
])

# --- Project_Architecture_Document.md — the count rows -------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **234 files** | **2404** | | Vitest |",
     "| **Unit total** | **235 files** | **2416** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2404/2404",
     "- [ ] `bun run test` → 2416/2416"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2404 checks / 234 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2416 checks / 235 files) |"),
])

# --- The §7.1 row for the s173 spec (inserted after the s172 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE BELOW-THRESHOLD + DIRECTIVE-SIDE + POSTURE-PRECISION REGISTRATIONS (the one-hundred-and-twenty-first audit's chosen work, the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/3I — a ZERO-SOURCE-FINDING all-Informational cycle, the SIXTH consecutive STAYS cycle, every actionable member on the doc/directive/registration surface): S173-A — the below-threshold + directive-side + posture-precision registration (the six-member batch at the bracketed s173-below-threshold-note): B173-I-1 the ELEMENT_LIMIT message-literal family (the three \"Too many elements (max 2000)\" envelope literals at elements/route.ts:261/:276/:308 vs the shared ELEMENT_LIMIT enforcement seam, the promotion form registered), A173-I-2 the Tailwind posture-precision datum (26 phantom oklch-resolved rules sourced from the operator's skills/ catalog via v4 automatic content detection — the detection perimeter is the REPO, not the app; the posture must name both the consumed set and the scanner's source perimeter; the exclusion lever @source not '../skills' registered, not promoted — the STAYS convention), B173-I-2 the directive-side decomposition correction (\"227 tests/ + 7 src/lib\"), B173-I-3 the frozen-record PAD coordinate re-anchor, the A173-I-1/I-3 continuity pair + S173-B — the premises registration (the s173-id-stable-premises-note at the 47th consecutive cycle, the four premises re-derived live and holding, the judgment carried unchanged) + S173-C the per-session pin family (12 pins: 6 RED doc-side members / 6 green-at-birth — the registration notes landed before the spec's birth; RED 6/6 EXACT on the FIRST run, zero spec-form repairs; the F138 guard's TWENTY-FOURTH instance riding the survival form — the s172 plan's record pinned 6/6 ticked at f37fe6aa per the pre-armed session_421/422 directive) and the collateral family (the count-family re-anchor 2416 = 2404 + 12 unit / 235 files; the layer-total family STAYING at 14,307 — the sixth consecutive STAYS cycle, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450; the s151..s172 SKILL-version pins onto v1.151.0; the s154..s172 forward-guard rolling re-anchors onto v1.152.0; the s158 title pin onto v1.152.0; e2e stays 262; smoke stays 73) | `tests/lows-s173.test.ts` | 12 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s172.test.ts` | 12 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s172 §7.1 anchor row not found")
if "`tests/lows-s173.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s173 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-173 bullet (inserted above the s172 bullet) -----------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The below-threshold + directive-side + posture-precision registration seams (session 173, "
    "S173-A..S173-C — the one-hundred-and-twenty-first audit's chosen work, the auditors' census "
    "A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/3I, every claim lead-verified at its seams — a "
    "ZERO-SOURCE-FINDING all-Informational cycle, the SIXTH consecutive STAYS cycle):** (a) "
    "THE BELOW-THRESHOLD + DIRECTIVE-SIDE + POSTURE-PRECISION REGISTRATION (S173-A, the "
    "six-member batch at the bracketed s173-below-threshold-note): B173-I-1 the ELEMENT_LIMIT "
    "message-literal family (the three \"Too many elements (max 2000)\" envelope literals at "
    "elements/route.ts:261/:276/:308 hard-coding the ceiling while the enforcement reads the "
    "shared ELEMENT_LIMIT seam — zero impact today, the promotion form registered); A173-I-2 "
    "the Tailwind posture-precision datum (26 phantom oklch-resolved rules in the compiled "
    "artifact for classes consumed nowhere in src/, sourced from the operator's skills/ "
    "catalog via v4 automatic content detection — the detection perimeter is the REPO, not "
    "the app; bytes-only dead weight, zero rendering impact; the standing correction: a "
    "dead-class posture must name BOTH the consumed set AND the scanner's source perimeter; "
    "the exclusion lever @source not '../skills' registered, not promoted per the STAYS "
    "convention); B173-I-2 the directive-side decomposition correction (\"227 tests/ + 7 "
    "src/lib\"); B173-I-3 the frozen-record PAD coordinate re-anchor; the A173-I-1/I-3 "
    "continuity pair (the five S168 below-threshold observations re-verified; the "
    "components-panel PAD §10 posture); the comment-truth census 141 sampled, 141 TRUE / 0 "
    "FALSE — the EIGHTH consecutive zero-false sampling; (b) THE PREMISES REGISTRATION "
    "(S173-B): the s173-id-stable-premises-note (the 47th consecutive cycle: the four "
    "premises re-derived live and pinned — P1's twelve churn-consuming sites value-based or "
    "honest-refusal, P2's index-stable remap behind the five-guard stack, P3's "
    "replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage "
    "perimeter; the judgment carried unchanged); (c) THE PER-SESSION PIN FAMILY (S173-C): 12 "
    "pins — 6 RED doc-side members / 6 green-at-birth (the registration notes landed before "
    "the spec's birth; RED 6/6 EXACT on the FIRST run, zero spec-form repairs). Pinned by "
    "`tests/lows-s173.test.ts` (the count-family re-anchor 2416 = 2404 + 12 unit / 235 files "
    "— the family's live anchor; the 22-file layer at 14,307 — the STAYS-cycle form, the "
    "zero-source-change cycle; the route layer at 2,450 — untouched).\n"
)
marker = "- **The README noun-unit repair + below-threshold/premises registration seams (session 172,"
if "`tests/lows-s173.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s172 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-173 bullet inserted")
else:
    print("AGENTS.md: session-173 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s172 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts", "tests/lows-s167.test.ts", "tests/lows-s168.test.ts", "tests/lows-s169.test.ts", "tests/lows-s170.test.ts", "tests/lows-s171.test.ts", "tests/lows-s172.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.150\\.0" in text:
        text = text.replace("version: 1\\.150\\.0", "version: 1\\.151\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.151.0)")
    elif "version: 1\\.151\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s172 forward count-truth guards' rolling re-anchors
# (v1.151.0 -> v1.152.0 — the s154 guard's NINETEENTH rolling instance,
#     the s155 guard's EIGHTEENTH, the s156 guard's SEVENTEENTH, the s157
#     guard's SIXTEENTH, the s158 guard's FIFTEENTH, the s159 guard's
#     FOURTEENTH, the s160 guard's THIRTEENTH, the s161 guard's TWELFTH,
#     the s162 guard's ELEVENTH, the s163 guard's TENTH, the s164 guard's
#     NINTH, the s165 guard's EIGHTH, the s166 guard's SEVENTH, the s167
#     guard's SIXTH, the s168 guard's FIFTH, the s169 guard's FOURTH,
#     the s170 guard's THIRD, the s171 guard's SECOND, the s172 guard's
#     FIRST) — the F40 rider at the count-truth guard family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts", "tests/lows-s167.test.ts", "tests/lows-s168.test.ts", "tests/lows-s169.test.ts", "tests/lows-s170.test.ts", "tests/lows-s171.test.ts", "tests/lows-s172.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.151.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.152.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.151\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.152\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.151.0 -> v1.152.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s173 cycle's own rider
#     form, its fourteenth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.151.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.152.0",'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2404";' in text:
        assert text.count('const UNIT = "2404";') == 1
        text = text.replace('const UNIT = "2404";', 'const UNIT = "2416";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2416";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "234";' in text:
        assert text.count('const FILES = "234";') == 1
        text = text.replace('const FILES = "234";', 'const FILES = "235";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "235";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
