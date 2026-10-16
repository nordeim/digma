#!/usr/bin/env python3
"""The session-144 docs update: the count-family re-anchor (2037 = 2025 + 12
unit / 206 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s144.test.ts, the AGENTS session-144 bullet (the LIVE ANCHOR
family's carry), and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-143 bullet's own count record, the
v1.122.0 header's record, the worklog's delivery records) are NEVER touched
— the F106 live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s144.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

def patch(path: str, subs: list[tuple[str, str]]) -> None:
    p = ROOT / path
    text = p.read_text()
    for old, new in subs:
        if old not in text:
            raise SystemExit(f"MISSING in {path}: {old[:100]!r}")
        n = text.count(old)
        if n != 1:
            raise SystemExit(f"AMBIGUOUS ({n} hits) in {path}: {old[:100]!r}")
        text = text.replace(old, new)
    p.write_text(text)
    print(f"{path}: {len(subs)} live claim sites re-anchored")

# --- AGENTS.md --------------------------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2025 checks) | `bun run test` |",
     "| Unit tests (2037 checks) | `bun run test` |"),
    ("`bun run test` (2025) → `bun run build`",
     "`bun run test` (2037) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2025 checks, Vitest) |",
     "| `bun run test` | Unit tests (2037 checks, Vitest) |"),
    ("(2025 unit / 73 smoke / 262 e2e)",
     "(2037 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2025 checks):",
     "- **Unit Tests** (Vitest, 2037 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("Vitest | 5 | 2025 checks",
     "Vitest | 5 | 2037 checks"),
    ("# unit tests — 2025 checks",
     "# unit tests — 2037 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2025 unit checks green',
     'project_state: "2037 unit checks green'),
    ("≥5.0.1 | 2025 checks; `*.test.ts` only |",
     "≥5.0.1 | 2037 checks; `*.test.ts` only |"),
    ("bun run test          # 2025/2025",
     "bun run test          # 2037/2037"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s144 spec + the Unit-total + the checklist + the
# §9.2 command-table count (the v1.122.0 header line stays FROZEN — it is
# the prior session's own record)
S144_ROW = (
    "| Unit — THE FROZEN-REACT-19-ENUMERATION-GAP / BRIEF-PAIR-EPOCH REGISTRATION PASS (the ninety-second audit's chosen work: S144-A — the frozen-record React-19 enumeration-gap registration (A144-I1 — the s143-audit-A record's clean-layer verification phrase at worklog :3711, the SOLE carrier verified by grep, reads \"zero setState-in-effect bodies — every effect's setState sits in an event callback, an awaited continuation, or a cleanup\", the three-member enumeration omitting the two sanctioned setState-in-effect-execution sites the layer's own registrations name — the S55-A PresentOverlay measure at editor-view.tsx:1032-1042 with setScale inside compute() invoked once synchronously beside its resize-listener registration, React's own documented useLayoutEffect measure-before-paint idiom, and the S77-E async-prefix re-arm at :1729 with setLoading(true) before the first await, the load effect's own comment placing it \"in the async prefix\" and the S111-B four-path taxonomy censusing the sync-prefix re-arms honestly; zero code defect — both forms React-sanctioned, registered in-code, pinned by the standing specs; the defect is the frozen summary's enumeration precision, the B142-I1 compressed-scope class at its React-contracts shape; the worklog's bracketed s144-setstate-enum-note + the spec's content-form pins: an every-X enumeration in a clean-layer summary must be exhaustive over the sanctioned forms the code's own comments distinguish — \"the async prefix\" and \"the awaited continuation\" are different locations and the summary may not collapse them); S144-B — the brief-lineage split-epoch count-pair registration (B144-I1 — the s144 dispatch brief's count-family expectation read \"2025/204 live-true at all 15 claim coordinates\", the live post-re-anchor unit member quoted beside the frozen s143-audit-B record's pre-re-anchor files member — a count pair that never existed as a live state; the live truth 2025/205 derived four independent ways — the doc claim sites, the live find (205 = 198 tests/ + 7 src/), the green full-suite run, all 15 coordinates carrying 2025 with zero shift; the B140-I2 coordinate-staleness class at its COUNT-member shape and the B140-I1 pair-unity doctrine violated in the brief lineage, never in the repo; the worklog's bracketed s144-count-pair-epoch-note + the spec's pair-unity + frozen-source pins: a dispatch brief quoting a count pair must derive BOTH members from the same live tree — never mix a live member with a prior record's frozen figure); the survival set — the S143-A/B registrations verbatim, the s144 script provenance anchors (live144/nav144/seo-s144 — the 120th audit, the 121st session, the 81st clip ordinal, the S143 delivery at HEAD 8069cba)) | `tests/lows-s144.test.ts` | 12 | tests | Vitest |\n"
)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s143 row and the Unit total
    (
        "| `tests/lows-s143.test.ts` | 12 | tests | Vitest |\n| **Unit total** | **205 files** | **2025** | | Vitest |",
        "| `tests/lows-s143.test.ts` | 12 | tests | Vitest |\n"
        + S144_ROW
        + "| **Unit total** | **206 files** | **2037** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 2025/2025",
     "- [ ] `bun run test` → 2037/2037"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2025 checks / 205 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2037 checks / 206 files) |"),
])

# --- the AGENTS session-144 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The frozen-enum-gap/brief-pair-epoch registration seams (session 144, S144-A..S144-C — the ninety-second Mode C audit's chosen work):** (a) THE FROZEN-REACT-19-ENUMERATION-GAP REGISTRATION (S144-A / A144-I1 — the 92nd audit's first Informational, the registration form): the s143-audit-A record's clean-layer verification line (worklog :3711 — the SOLE carrier of the phrase, verified by grep; the auditor's \":3614 and :3711\" companion coordinate itself the A142-I1 path-scope class, corrected by the lead's spot-verification) reads \"zero setState-in-effect bodies — every effect's setState sits in an event callback, an awaited continuation, or a cleanup\", the three-member enumeration omitting the two sanctioned setState-in-effect-execution sites the layer's own registrations name — the S55-A PresentOverlay measure (editor-view.tsx:1032-1042, setScale inside compute() invoked once synchronously beside its resize-listener registration — React's documented useLayoutEffect measure-before-paint idiom) and the S77-E async-prefix re-arm (:1729, setLoading(true) before the first await, its own comment placing it \"in the async prefix\"); zero code defect — both forms React-sanctioned, registered in-code, pinned by the standing specs; the defect is the frozen summary's enumeration precision (the B142-I1 compressed-scope class at its React-contracts shape); the count-truth doctrine extended: an every-X enumeration in a clean-layer summary must be exhaustive over the sanctioned forms the code's own comments distinguish — \"the async prefix\" and \"the awaited continuation\" are different locations and the summary may not collapse them; the worklog's bracketed s144-setstate-enum-note; the live truth PINNED by the spec's two-site content pins + the frozen-phrase anchor pin; (b) THE BRIEF-LINEAGE SPLIT-EPOCH COUNT-PAIR REGISTRATION (S144-B / B144-I1 — the 92nd audit's second Informational): the s144 dispatch brief's count-family expectation carried \"2025/204\" — the live post-re-anchor unit member quoted beside the frozen s143-audit-B record's pre-re-anchor files member (worklog :3684's Census-truths line), a count pair that never existed as a live state (at 204 files the unit count was 2013; at 2025 tests the file count is 205); the live truth 2025/205 derived four independent ways (the doc claim sites, the live find — 205 = 198 tests/ + 7 src/ — the green full-suite run, all 15 coordinates carrying 2025 with zero shift); the B140-I2 coordinate-staleness class at its COUNT-member shape and the B140-I1 pair-unity doctrine violated in the brief lineage, never in the repo; the count-truth doctrine extended — the brief-lineage pair-unity member: a dispatch brief quoting a count pair must derive BOTH members from the same live tree — never mix a live member with a prior record's frozen figure; the worklog's bracketed s144-count-pair-epoch-note; the live truth PINNED by the spec's pair-unity pins + the live file-count derivation (206 at the spec's own runtime, the spec itself the 206th file) + the frozen-source anchor pin; (c) the per-session pin family (tests/lows-s144.test.ts — 12 pins: 3 RED / 9 survival — the two worklog registrations + the count re-anchor in the DEFECT form; the three s144 script derivations 22/66/6) and the collateral family (the count family 2037 = 2025 + 12 unit / 206 files; zero §11 line-count changes — no source file edited this cycle, the all-registration shape). Pinned by `tests/lows-s144.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s143.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-144 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "2025";', 'const UNIT = "2037";')
    text = text.replace('const FILES = "205";', 'const FILES = "206";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 2037/206:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 2037 = 2025 + 12 unit / 206 files")
