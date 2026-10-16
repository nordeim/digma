#!/usr/bin/env python3
"""The session-142 docs update: the count-family re-anchor (2013 = 2001 + 12
unit / 204 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s142.test.ts, the AGENTS session-142 bullet (the LIVE ANCHOR
family's carry), and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-141 bullet's own count record, the
v1.120.0 header's record, the worklog's delivery records) are NEVER touched
— the F106 live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s142.py
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
    ("| Unit tests (2001 checks) | `bun run test` |",
     "| Unit tests (2013 checks) | `bun run test` |"),
    ("`bun run test` (2001) → `bun run build`",
     "`bun run test` (2013) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2001 checks, Vitest) |",
     "| `bun run test` | Unit tests (2013 checks, Vitest) |"),
    ("(2001 unit / 73 smoke / 262 e2e)",
     "(2013 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2001 checks):",
     "- **Unit Tests** (Vitest, 2013 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("Vitest | 5 | 2001 checks",
     "Vitest | 5 | 2013 checks"),
    ("# unit tests — 2001 checks",
     "# unit tests — 2013 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2001 unit checks green',
     'project_state: "2013 unit checks green'),
    ("≥5.0.1 | 2001 checks; `*.test.ts` only |",
     "≥5.0.1 | 2013 checks; `*.test.ts` only |"),
    ("bun run test          # 2001/2001",
     "bun run test          # 2013/2013"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s142 spec + the Unit-total + the checklist + the
# §9.2 command-table count (the v1.120.0 header line stays FROZEN — it is
# the prior session's own record)
S142_ROW = (
    "| Unit — THE PATH-SCOPE/STOP-ROW-FLOOR/CATCH-SCOPE REGISTRATION PASS (the ninetieth audit's chosen work: S142-A — the frozen-record path-scope overcover registration (A142-I1, the B140-I2/B141-I1 coordinate-liveness class at its PATH-SCOPE shape: the s141-audit-A record's \"14 files at src/components/editor/ + 8 at src/components/\" over-covers the live editor directory by six files — the live five-way split is 8 at src/components/editor/ + 8 at src/components/ + 2 at src/hooks/ + 3 at src/lib/ + 1 at src/app/globals.css, the arithmetic 14+8=22 total-true, the record's own enumeration path-exact, only the compressed directory attribution over-covering; the worklog's bracketed s142-path-scope-note + the five-way decomposition pins: a directory attribution in a census record is a PATH claim as live as any line-number coordinate — name the directory that actually holds the count, or enumerate the members); S142-B — the touch-floor ledger completeness registration (A142-I2, the F61 N−1 lesson recurring INSIDE the floor ledger: the gradient stop-row control family — the Add-stop Button h-6 ~:1019, the stop color swatch h-6 w-6 ~:1064, the stop position input h-6 flex-1 ~:1087, the stop remove Button h-6 w-6 p-0 ~:1103, all ~24px below the 44px floor, mobile-reachable through the shared mobile Sheet — uncensused by every floor sweep since s105 while the ledger's only-ness form named only the Revert h-5; the controls RA-54/RA-55 reference-decoded chrome, parity-exempt, the defect the LEDGER's completeness claim; the worklog's bracketed s142-stop-row-floor-note + the stop-row pins: a floor ledger's only-ness claim must enumerate every below-floor family in the layer it certifies — walk the whole domain before writing \"the only\"); S142-C — the compressed-scope catch census registration (B142-I1, the B141-I1 coordinate/scope-liveness class at its COMPRESSED-SCOPE shape: the s141-audit-B record's \"catches 16 (src/app/api scope, all instanceof dialect)\" — the live truth is 17 catch blocks = 16 instanceof-dialect + 1 the ai-assistant SDK-fallback catch at route.ts:146, the count live-true only at the dialect-filtered scope, the compression turning the restrictive clause predicative while the parenthetical named only the file scope; the worklog's bracketed s142-catch-scope-note + the 17/16+1 pins: a compressed census line's scope must name the FILTER that yields the count (\"16 instanceof-dialect catches of 17 total\"), never a file scope alone)); the survival set — the S141-A/B registrations verbatim, the s142 script provenance anchors (live142/nav142/seo-s142 — the 118th audit, the 119th session, the 79th clip ordinal, the S141 delivery at HEAD 1f376be)) | `tests/lows-s142.test.ts` | 12 | tests | Vitest |\n"
)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s141 row and the Unit total
    (
        "the S140 delivery at HEAD 41eb288)) | `tests/lows-s141.test.ts` | 12 | tests | Vitest |\n| **Unit total** | **203 files** | **2001** | | Vitest |",
        "the S140 delivery at HEAD 41eb288)) | `tests/lows-s141.test.ts` | 12 | tests | Vitest |\n"
        + S142_ROW
        + "| **Unit total** | **204 files** | **2013** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 2001/2001",
     "- [ ] `bun run test` → 2013/2013"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2001 checks / 203 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2013 checks / 204 files) |"),
])

# --- the AGENTS session-142 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The path-scope/stop-row-floor/catch-scope registration seams (session 142, S142-A..S142-D — the ninetieth Mode C audit's chosen work):** (a) THE FROZEN-RECORD PATH-SCOPE OVERCOVER REGISTRATION (S142-A / A142-I1 — the audit's first Informational, the registration form; the B140-I2/B141-I1 coordinate-liveness class at its PATH-SCOPE shape): the s141-audit-A record's client-layer line scopes the 22-file read as \"14 files at src/components/editor/ + 8 at src/components/\" — the live editor directory holds exactly 8 of the 22; the 14 = those 8 + 2 at src/hooks/ + 3 at src/lib/ + 1 at src/app/globals.css, none of the six extra under the editor directory; the arithmetic 14+8=22 total-true, the record's own enumeration path-exact, only the compressed directory attribution over-covering; the count-truth doctrine extended: a directory attribution in a census record is a PATH claim as live as any doc-site line-number coordinate — name the directory that actually holds the count, or enumerate the members; the worklog's bracketed s142-path-scope-note; the live truth PINNED by the spec's five-way decomposition pins (the readdirSync census: exactly 8/8/2/3+1, the sum exactly 22, the frozen 14+8 phrase asserted present as the registration's referent); (b) THE TOUCH-FLOOR LEDGER COMPLETENESS REGISTRATION (S142-B / A142-I2 — the F61 N−1 lesson recurring INSIDE the floor ledger: an only-ness census must walk its whole domain): the gradient stop-row control family carries four controls below the 44px touch floor — the Add-stop Button (\"h-6 rounded-md px-2 text-xs\", ~:1019), the stop color swatch (\"h-6 w-6\", ~:1064), the stop position input (\"h-6 flex-1\", ~:1087), the stop remove Button (\"h-6 w-6 rounded-md p-0\", ~:1103) — all ~24px, mobile-reachable through the shared mobile Sheet, uncensused by every floor sweep since s105 while the ledger's only-ness form named only the Revert h-5; the controls are RA-54/RA-55 reference-decoded chrome (parity-exempt, the chrome stays); the defect is the LEDGER's completeness claim — the stop rows join the Revert h-5 and the ~34px utility chips as the standing below-floor members; the worklog's bracketed s142-stop-row-floor-note; the live truth PINNED by the spec's stop-row pins (the four control forms found by content + the Revert h-5 co-membership); (c) THE COMPRESSED-SCOPE CATCH CENSUS REGISTRATION (S142-C / B142-I1 — the B141-I1 coordinate/scope-liveness class at its COMPRESSED-SCOPE shape): the s141-audit-B record's Census-truths line compresses \"catches 16 (src/app/api scope, all instanceof dialect)\" — the live truth is 17 catch blocks in src/app/api: 16 in the Prisma instanceof dialect + 1 the ai-assistant SDK-fallback catch (route.ts:146, no instanceof arm); the count 16 is live-true ONLY at the dialect-filtered scope; the compression turned the prose's restrictive clause predicative while the parenthetical named only the file scope — a future mechanical sweep of \"catches in src/app/api\" answers 17 and mis-concludes the census wrong; the count-truth doctrine extended: a compressed census line's scope must name the FILTER that yields the count (\"16 instanceof-dialect catches of 17 total\"), never a file scope alone; the worklog's bracketed s142-catch-scope-note; the live truth PINNED by the spec's 17/16+1 pins (the balanced-brace census run live in the spec, the SDK-fallback seam asserted instanceof-free); (d) the per-session pin family (tests/lows-s142.test.ts — 12 pins: 4 RED / 8 survival — the three worklog registrations + the count re-anchor in the DEFECT form; the three s142 script derivations 22/66/6) and the collateral family (the count family 2013 = 2001 + 12 unit / 204 files; zero §11 line-count changes — no source file edited this cycle, the all-registration shape). Pinned by `tests/lows-s142.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s141.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-142 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "2001";', 'const UNIT = "2013";')
    text = text.replace('const FILES = "203";', 'const FILES = "204";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 2013/204:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 2013 = 2001 + 12 unit / 204 files")
