#!/usr/bin/env python3
"""The session-166 docs update: the count-family re-anchor (2315 = 2301 + 14
unit / 228 files across every live claim site), the LAYER-TOTAL family
STAYING at 14,295 (the fourth consecutive STAYS cycle — zero source changes
this cycle; NO s156/s157/s158 rider, NO F140 prior-spec rider), the §7.1
row for the s166 spec, the AGENTS session-166 bullet (carrying the
S166-A write-set arithmetic-closure correction registration + the S166-B
deferral-premises registration + the S166-C per-session pin family), the
prior-spec forward-guard ROLLING re-anchors (the s154..s165 count-truth
guards' version literals onto v1.145.0), the s151..s165 SKILL-version
pins onto v1.144.0, the s158 title pin onto v1.145.0, and the
spec-constants re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-146..165 bullets' own count
records, the v1.125.0..v1.144.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s166.py
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

# --- AGENTS.md --------------------------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (2301 checks) | `bun run test` |",
     "| Unit tests (2315 checks) | `bun run test` |"),
    ("`bun run test` (2301) → `bun run build`",
     "`bun run test` (2315) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker, riding
    # the s152 bullet's tail — the F106 live-claim classification)
    ("the count-family re-anchor 2301 = 2287 + 14 unit / 227 files (the family's live anchor)",
     "the count-family re-anchor 2315 = 2301 + 14 unit / 228 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2301 checks, Vitest) |",
     "| `bun run test` | Unit tests (2315 checks, Vitest) |"),
    ("(2301 unit / 73 smoke / 262 e2e)",
     "(2315 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2301 checks):",
     "- **Unit Tests** (Vitest, 2315 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2301 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2315 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2301 checks on the pure domain seams",
     "bun run test              # unit tests — 2315 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2301 unit checks green',
     'project_state: "2315 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2301 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2315 checks;"),
    ("bun run test          # 2301/2301",
     "bun run test          # 2315/2315"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **227 files** | **2301** | | Vitest |",
     "| **Unit total** | **228 files** | **2315** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2301/2301",
     "- [ ] `bun run test` → 2315/2315"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2301 checks / 227 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2315 checks / 228 files) |"),
])

# --- The §7.1 row for the s166 spec (inserted after the s165 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE WRITE-SET ARITHMETIC-CLOSURE CORRECTION REGISTRATION PASS (the one-hundred-and-fourteenth audit's chosen work, the auditors' census A 0C/0H/0M/0L/0I + B 0C/0H/0M/0L/1I — a ONE-INFORMATIONAL cycle, NOT a zero-finding census (the five zero-finding censuses remain s143/s152/s153/s156/s165, the plan-history claim re-derived live, zero others)): S166-A — the write-set arithmetic-closure correction registration (the B166-I-1 remediation, the S132-C standing-note form — the B164-L1 precedent's echo: the s165-B entry's e2e write-set phrase was over-membered by one under any single counting convention (20 exercised + 1 never-exercised + 5 zero-e2e = 26 member-slots for 25 handlers) while every underlying fact stayed true; the bracketed s166-write-set-closure-note the standing correction — 19 of the 25 exercised by the specs' own calls, every one asserted; health exercised and readiness-asserted only by the Playwright webServer probe (playwright.config.ts:97) — the 20-figure under the probe-inclusive convention; the arithmetic closure 19 + 1 + 5 = 25; the s165-B entry FROZEN per S132-C) + S166-B — the id-stable PUT deferral-premises registration (the 39th consecutive cycle: the four premises re-derived live and pinned — P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S166-C the per-session pin family (14 pins: 5 RED incl. the pair-unity RED-until-collateral / 9 green-at-birth — the registrations landed before the spec's birth per the standing precedent; RED 5/9 EXACT on the FIRST run, zero spec-form repairs; the F138 guard's SEVENTEENTH instance riding the survival form — the s165 plan's record pinned 5/5 ticked at 44914bec per the pre-armed session_375 directive) and the collateral family (the count-family re-anchor 2315 = 2301 + 14 unit / 228 files; the layer-total family STAYS at 14,295 — the fourth consecutive STAYS cycle, zero source changes, NO rider; the s151..s165 SKILL-version pins onto v1.144.0; the s154..s165 forward-guard rolling re-anchors onto v1.145.0; the s158 title pin onto v1.145.0; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) | `tests/lows-s166.test.ts` | 14 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s165.test.ts` | 14 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s165 §7.1 anchor row not found")
if "`tests/lows-s166.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s166 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-166 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The write-set arithmetic-closure correction + deferral-premises registration seams (session 166, "
    "S166-A..S166-C — the one-hundred-and-fourteenth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/0L/0I + B 0C/0H/0M/0L/1I, every claim lead-verified at its seams — a ONE-INFORMATIONAL "
    "cycle, NOT a zero-finding census (the five zero-finding censuses remain s143/s152/s153/s156/"
    "s165, the plan-history claim re-derived live, zero others)):** (a) THE WRITE-SET ARITHMETIC-"
    "CLOSURE CORRECTION REGISTRATION (S166-A, the B166-I-1 remediation — the S132-C standing-note "
    "form, the B164-L1 precedent's echo): the s165-B worklog entry's e2e write-set phrase was "
    "over-membered by one under any single counting convention (20 exercised + 1 never-exercised + "
    "5 zero-e2e = 26 member-slots for 25 handlers) while every underlying fact stayed true — the "
    "s163/s164 form had been coherent (\"20 exercised, all asserted except health\"), the s165 "
    "reword broke the closure; the bracketed s166-write-set-closure-note the standing correction "
    "(19 of the 25 exercised by the specs' own calls, every one asserted; health exercised and "
    "readiness-asserted only by the Playwright webServer probe at playwright.config.ts:97 — the "
    "20-figure under the probe-inclusive convention; the arithmetic closure 19 + 1 + 5 = 25; the "
    "s165-B entry FROZEN per S132-C); the comment-truth census 142 TRUE / 0 FALSE — the SECOND "
    "consecutive zero-false sampling; (b) THE DEFERRAL-PREMISES REGISTRATION (S166-B, the 39th "
    "consecutive cycle): the id-stable PUT's four premises re-derived live and pinned (P1's "
    "twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind "
    "the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s "
    "timeout, P4's zero-storage perimeter), the judgment carried unchanged (the one-Informational "
    "census this cycle's cleanest form of the statement that nothing grows a mutation-surface "
    "member that would promote the rewrite); (c) THE PER-SESSION PIN FAMILY (S166-C): 14 pins — "
    "5 RED incl. the pair-unity RED-until-collateral / 9 green-at-birth (the registrations "
    "landed before the spec's birth; the doc-side members RED until the collateral; RED 5/9 "
    "EXACT on the FIRST run, zero spec-form repairs). Pinned by `tests/lows-s166.test.ts` (the "
    "count-family re-anchor 2315 = 2301 + 14 unit / 228 files — the family's live anchor; the "
    "22-file layer at 14,295 — the fourth consecutive STAYS-cycle form, zero source changes "
    "this cycle).\n"
)
marker = "- **The fifth zero-finding census + deferral-premises registration seams (session 165,"
if "`tests/lows-s166.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s165 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-166 bullet inserted")
else:
    print("AGENTS.md: session-166 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s165 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.143\\.0" in text:
        text = text.replace("version: 1\\.143\\.0", "version: 1\\.144\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.144.0)")
    elif "version: 1\\.144\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s165 forward count-truth guards' rolling re-anchors
# (v1.144.0 -> v1.145.0 — the s154 guard's TWELFTH rolling instance,
#     the s155 guard's ELEVENTH, the s156 guard's TENTH, the s157
#     guard's NINTH, the s158 guard's EIGHTH, the s159 guard's SEVENTH,
#     the s160 guard's SIXTH, the s161 guard's FIFTH, the s162 guard's
#     FOURTH, the s163 guard's THIRD, the s164 guard's SECOND, the
#     s165 guard's FIRST) — the F140 rider at the count-truth guard
#     family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.144.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.145.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.144\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.145\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.144.0 -> v1.145.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s165 cycle's own rider
#     form, its seventh instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.144.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.145.0",'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2301";' in text:
        assert text.count('const UNIT = "2301";') == 1
        text = text.replace('const UNIT = "2301";', 'const UNIT = "2315";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2315";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "227";' in text:
        assert text.count('const FILES = "227";') == 1
        text = text.replace('const FILES = "227";', 'const FILES = "228";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "228";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
