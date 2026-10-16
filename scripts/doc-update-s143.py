#!/usr/bin/env python3
"""The session-143 docs update: the count-family re-anchor (2025 = 2013 + 12
unit / 205 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s143.test.ts, the AGENTS session-143 bullet (the LIVE ANCHOR
family's carry), and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-142 bullet's own count record, the
v1.121.0 header's record, the worklog's delivery records) are NEVER touched
— the F106 live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s143.py
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
    ("| Unit tests (2013 checks) | `bun run test` |",
     "| Unit tests (2025 checks) | `bun run test` |"),
    ("`bun run test` (2013) → `bun run build`",
     "`bun run test` (2025) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2013 checks, Vitest) |",
     "| `bun run test` | Unit tests (2025 checks, Vitest) |"),
    ("(2013 unit / 73 smoke / 262 e2e)",
     "(2025 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2013 checks):",
     "- **Unit Tests** (Vitest, 2025 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("Vitest | 5 | 2013 checks",
     "Vitest | 5 | 2025 checks"),
    ("# unit tests — 2013 checks",
     "# unit tests — 2025 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2013 unit checks green',
     'project_state: "2025 unit checks green'),
    ("≥5.0.1 | 2013 checks; `*.test.ts` only |",
     "≥5.0.1 | 2025 checks; `*.test.ts` only |"),
    ("bun run test          # 2013/2013",
     "bun run test          # 2025/2025"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s143 spec + the Unit-total + the checklist + the
# §9.2 command-table count (the v1.121.0 header line stays FROZEN — it is
# the prior session's own record)
S143_ROW = (
    "| Unit — THE ZERO-FINDING CENSUS / DEFERRAL-PREMISES REGISTRATION PASS (the ninety-first audit's chosen work: S143-A — the zero-finding census registration (the 91st Mode C audit's combined census reads 0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational — the FIRST zero-finding combined census in the plan history: a live sweep of every prior remediation plan finds zero carriers of the 0-Low/0-I combined form in either the long or the compressed shape, the minimum Informational count any prior plan carries at a 0-Low combined census being 2, and the 1-Informational carriers all carrying Lows or Mediums alongside; the census's evidence trail: the two audit entries at their Task-ID anchors digma-s143-audit-A/digma-s143-audit-B — the 22-file 13,869-line client layer read line-by-line with the fifteen mandated families run live green 217/217, the 18 route files at 2,445 lines read completely with the write-site census 21/16 the fifteenth consecutive cycle, the catch census 17 = 16+1, the env census 16 = 15+1 across 9 vars the tenth consecutive, the doc-census claim-by-claim, the DB read-only pristine 1/2/6/1/3; the worklog's bracketed s143-clean-census-note + the plan-history pins: a clean verdict is a count-truth claim like any other — pin the census so the next cycle's drift comparison starts from live truth, and the plan-history zero-finding claim is itself a census-of-censuses that must be re-derived, never quoted); S143-B — the id-stable PUT deferral-premises registration (the deferred queue's head item, the premises re-derived live: the four churn-consuming registrations all value-based or honest-refusal — the fillKey compare-and-adjust ~:1847, the rename session's index-matching refusal layers-panel ~:30-42 the S134-B registration, the DnD pair's id-match guard editor-store ~:352 the S109-A registration, the AI targetIds send-time capture ai-assistant ~:575-583 with its own \"Registered, not remapped\" comment; the index-stable remap editor-view ~:413-419 with the gesture-deferral gate ~:409-412; the replace transaction's registered seams — deleteMany/createMany/project.update at elements/route.ts ~:366/:368/:370, the S73-C 30s timeout, the S56-H inside-read, the S112-C counter recompute; the value-based perimeter S135-B/S136-C/S137-A holding with zero uncensused members; the judgment carried unchanged from the S128-S142 cycles — regression risk outweighs churn-optimality benefit at this stability level; the worklog's bracketed s143-id-stable-premises-note + the premises pins: a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred, and pin them so the re-derivation is mechanical); the survival set — the S142-A/B/C registrations verbatim, the s143 script provenance anchors (live143/nav143/seo-s143 — the 119th audit, the 120th session, the 80th clip ordinal, the S142 delivery at HEAD bc9bd38)) | `tests/lows-s143.test.ts` | 12 | tests | Vitest |\n"
)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s142 row and the Unit total
    (
        "the S141 delivery at HEAD 1f376be)) | `tests/lows-s142.test.ts` | 12 | tests | Vitest |\n| **Unit total** | **204 files** | **2013** | | Vitest |",
        "the S141 delivery at HEAD 1f376be)) | `tests/lows-s142.test.ts` | 12 | tests | Vitest |\n"
        + S143_ROW
        + "| **Unit total** | **205 files** | **2025** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 2013/2013",
     "- [ ] `bun run test` → 2025/2025"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2013 checks / 204 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2025 checks / 205 files) |"),
])

# --- the AGENTS session-143 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The zero-finding-census/deferral-premises registration seams (session 143, S143-A..S143-C — the ninety-first Mode C audit's chosen work, the zero-finding cycle):** (a) THE ZERO-FINDING CENSUS REGISTRATION (S143-A — the 91st audit's combined census reads 0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational, the FIRST zero-finding combined census in the plan history): a live sweep of every prior docs/remediation-plan-session*.md finds zero carriers of the 0-Low/0-I combined census form — the minimum Informational count any prior plan carries at a 0-Low combined census is 2, and the 1-Informational carriers all carry Lows or Mediums alongside; the census's evidence trail: the two audit entries at their Task-ID anchors (the 22-file 13,869-line client layer read line-by-line, the fifteen mandated pin families S128..S142 run live green 217/217, the full 2013/204 suite re-run green; the 18 route files at 2,445 lines read completely, the write-site census 21 statements / 16 handler surfaces the fifteenth consecutive cycle, the catch census 17 = 16 instanceof-dialect + 1 SDK-fallback by balanced-brace extraction, the env census 16 = 15 reads + 1 write-back across 9 vars the tenth consecutive, the doc-census claim-by-claim with the §11 table at exactly 38 rows and the count family live-true at all 15 claim coordinates, the DB read-only pristine 1/2/6/1/3); the count-truth doctrine extended: a clean verdict is a count-truth claim like any other — pin the census so the next cycle's drift comparison starts from live truth, and the plan-history zero-finding claim is itself a census-of-censuses that must be re-derived every time it is cited, never quoted; the worklog's bracketed s143-clean-census-note; the live truth PINNED by the spec's plan-history sweep (zero prior carriers asserted with the plan count checked) + the audit-anchor pins (the two entries found by their Task-ID anchors with their 0-Informational census lines) + the family arithmetic 193 + 12 + 12 = 217; (b) THE ID-STABLE PUT DEFERRAL-PREMISES REGISTRATION (S143-B — the deferred queue's head item, the premises re-derived live): the four churn-consuming registrations all value-based or honest-refusal (the fillKey compare-and-adjust at properties-panel ~:1847, the rename session's index-matching refusal at layers-panel ~:30-42 the S134-B registration, the DnD pair's id-match guard at editor-store ~:352 the S109-A registration, the AI targetIds send-time capture at ai-assistant ~:575-583 with its own \"Registered, not remapped\" comment naming the id-stable PUT as the family's structural follow-up); the index-stable remap at editor-view ~:413-419 with the gesture-deferral gate at ~:409-412; the replace transaction's registered seams (deleteMany + createMany + project.update at elements/route.ts ~:366/:368/:370, the S73-C 30s timeout, the S56-H inside-read, the S112-C counter recompute riding the rowStoredBytes seam); the value-based perimeter S135-B/S136-C/S137-A holding with zero uncensused members; the judgment carried unchanged from the S128-S142 cycles: the structural rewrite's regression risk continues to outweigh its churn-optimality benefit at this stability level; the count-truth doctrine extended: a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred, and pin them so the re-derivation is mechanical; the worklog's bracketed s143-id-stable-premises-note; the live truth PINNED by the spec's four-site content pins + the remap/transaction seam pins; (c) the per-session pin family (tests/lows-s143.test.ts — 12 pins: 3 RED / 9 survival — the two worklog registrations + the count re-anchor in the DEFECT form; the three s143 script derivations 22/66/6) and the collateral family (the count family 2025 = 2013 + 12 unit / 205 files; zero §11 line-count changes — no source file edited this cycle, the all-registration shape). Pinned by `tests/lows-s143.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s142.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-143 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "2013";', 'const UNIT = "2025";')
    text = text.replace('const FILES = "204";', 'const FILES = "205";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 2025/205:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 2025 = 2013 + 12 unit / 205 files")
