#!/usr/bin/env python3
"""The session-165 docs update: the count-family re-anchor (2301 = 2287 + 14
unit / 227 files across every live claim site), the LAYER-TOTAL family
STAYING at 14,295 (the third consecutive STAYS cycle — zero source changes
this registration cycle; NO s156/s157/s158 rider, NO F140 prior-spec
rider), the §7.1 row for the s165 spec, the AGENTS session-165 bullet
(carrying the S165-A fifth-zero-finding-census registration + the S165-B
deferral-premises registration + the S165-C per-session pin family), the
prior-spec forward-guard ROLLING re-anchors (the s154..s164 count-truth
guards' version literals onto v1.144.0), the s151..s164 SKILL-version
pins onto v1.143.0, the s158 title pin onto v1.144.0, and the
spec-constants re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-146..164 bullets' own count
records, the v1.125.0..v1.143.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s165.py
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
    ("| Unit tests (2287 checks) | `bun run test` |",
     "| Unit tests (2301 checks) | `bun run test` |"),
    ("`bun run test` (2287) → `bun run build`",
     "`bun run test` (2301) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker, riding
    # the s152 bullet's tail — the F106 live-claim classification)
    ("the count-family re-anchor 2287 = 2270 + 17 unit / 226 files (the family's live anchor)",
     "the count-family re-anchor 2301 = 2287 + 14 unit / 227 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2287 checks, Vitest) |",
     "| `bun run test` | Unit tests (2301 checks, Vitest) |"),
    ("(2287 unit / 73 smoke / 262 e2e)",
     "(2301 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2287 checks):",
     "- **Unit Tests** (Vitest, 2301 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2287 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2301 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2287 checks on the pure domain seams",
     "bun run test              # unit tests — 2301 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2287 unit checks green',
     'project_state: "2301 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2287 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2301 checks;"),
    ("bun run test          # 2287/2287",
     "bun run test          # 2301/2301"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **226 files** | **2287** | | Vitest |",
     "| **Unit total** | **227 files** | **2301** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2287/2287",
     "- [ ] `bun run test` → 2301/2301"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2287 checks / 226 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2301 checks / 227 files) |"),
])

# --- The §7.1 row for the s165 spec (inserted after the s164 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE FIFTH ZERO-FINDING CENSUS REGISTRATION PASS (the one-hundred-and-thirteenth audit's chosen work, the auditors' census A 0C/0H/0M/0L/0I + B 0C/0H/0M/0L/0I — the FIFTH zero-finding census in the 165-plan history, the plan-history claim re-derived live: s143/s152/s153/s156 the four priors): S165-A — the clean-census registration (the S143 doctrine's fifth instance — a clean verdict is a count-truth claim: the combined 0C/0H/0M/0L/0I census pinned with its evidence trail — the two audit entries at their anchors, the 491/491 pin families, the six green gates, the 141st reference audit NO DRIFT with the clip datum byte-identical the 102nd consecutive session, mobile nav 9/9 the 142nd, SEO 4/4, the dispatch figures live-exact, the F138 sixteenth verification PASSED; the comment-truth census 140 TRUE / 0 FALSE — the FIRST ZERO-FALSE sampling in the record's history; auditor A's five below-threshold observations registered: the Insert handler's inline four-draw-type membership frozen by the EditorTool union, the no-op-guards counting-unit nuance, the gradient-stop posture carried, the no-op dismiss timers, the mobile lg-crossing close-effect pair) + S165-B — the id-stable PUT deferral-premises registration (the 38th consecutive cycle: the four premises re-derived live and pinned — P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S165-C the per-session pin family (14 pins: 5 RED incl. the pair-unity RED-until-collateral / 9 green-at-birth — the registrations landed before the spec's birth per the standing precedent; ONE spec-form repair at the RED birth — the marker-stripped layers-phrase form; the F138 guard's SIXTEENTH instance riding the survival form — the s164 plan's record pinned 7/7 ticked at 008c14cf per the pre-armed session_369 directive) and the collateral family (the count-family re-anchor 2301 = 2287 + 14 unit / 227 files; the layer-total family STAYS at 14,295 — the third consecutive STAYS cycle, zero source changes, NO rider; the s151..s164 SKILL-version pins onto v1.143.0; the s154..s164 forward-guard rolling re-anchors onto v1.144.0; the s158 title pin onto v1.144.0; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) | `tests/lows-s165.test.ts` | 14 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s164.test.ts` | 17 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s164 §7.1 anchor row not found")
if "`tests/lows-s165.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s165 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-165 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The fifth zero-finding census + deferral-premises registration seams (session 165, "
    "S165-A..S165-C — the one-hundred-and-thirteenth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/0L/0I + B 0C/0H/0M/0L/0I, every claim lead-verified at its seams — THE FIFTH "
    "ZERO-FINDING CENSUS in the 165-plan history, the plan-history claim re-derived live: "
    "s143/s152/s153/s156 the four priors):** (a) THE CLEAN-CENSUS REGISTRATION (S165-A, the "
    "S143 doctrine's fifth instance — a clean verdict is a count-truth claim like any other): "
    "the combined 0C/0H/0M/0L/0I census pinned with its evidence trail (the two audit entries "
    "at their Task-ID anchors, the 491/491 pin families S128..S164, the six green baseline "
    "gates — lint 0, typecheck 0, unit 2287/2287 across 226 files, build 27 routes, smoke "
    "73/73, e2e 262/262 zero flakes — the 141st reference audit NO DRIFT with the clip datum "
    "byte-identical the 102nd consecutive session, mobile nav 9/9 the 142nd session, SEO 4/4, "
    "the dispatch figures live-exact, THE F138 GUARD'S SIXTEENTH VERIFICATION PASSED — the "
    "s164 plan 7/7 ticked at 008c14cf); the comment-truth census 140 TRUE / 0 FALSE — the "
    "FIRST ZERO-FALSE sampling in the record's history (eleven consecutive comment-truth "
    "cycles retiring every false member they found); auditor A's five below-threshold "
    "observations registered, not fixed (the Insert handler's inline four-draw-type "
    "membership — the F35e two-maps shape, frozen by the EditorTool union; the no-op-guards "
    "counting-unit nuance; the gradient-stop index-key posture carried; the no-op dismiss "
    "timers for cap-evicted toasts; the mobile lg-crossing close-effect pair); (b) THE "
    "DEFERRAL-PREMISES REGISTRATION (S165-B, the 38th consecutive cycle): the id-stable "
    "PUT's four premises re-derived live and pinned (P1's twelve churn-consuming sites "
    "value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, "
    "P3's replace-transaction trio in one $transaction with the 30s timeout, P4's "
    "zero-storage perimeter), the judgment carried unchanged (the zero-finding census is "
    "the cleanest possible form of the statement that nothing grows a mutation-surface "
    "member that would promote the rewrite); (c) THE PER-SESSION PIN FAMILY (S165-C): 14 "
    "pins — 5 RED incl. the pair-unity RED-until-collateral / 9 green-at-birth (the "
    "registrations landed before the spec's birth; the doc-side members RED until the "
    "collateral; one spec-form repair at the RED birth — the marker-stripped layers-phrase "
    "form). Pinned by `tests/lows-s165.test.ts` (the count-family re-anchor 2301 = 2287 + "
    "14 unit / 227 files — the family's live anchor; the 22-file layer at 14,295 — the "
    "third consecutive STAYS-cycle form, zero source changes this registration cycle).\n"
)
marker = "- **The cross-file-citation + census-scoping + honest-census comment-truth seams (session 164,"
if "`tests/lows-s165.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s164 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-165 bullet inserted")
else:
    print("AGENTS.md: session-165 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s164 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.142\\.0" in text:
        text = text.replace("version: 1\\.142\\.0", "version: 1\\.143\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.143.0)")
    elif "version: 1\\.143\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s164 forward count-truth guards' rolling re-anchors
# (v1.143.0 -> v1.144.0 — the s154 guard's ELEVENTH rolling instance,
#     the s155 guard's TENTH, the s156 guard's NINTH, the s157 guard's
#     EIGHTH, the s158 guard's SEVENTH, the s159 guard's SIXTH, the s160
#     guard's FIFTH, the s161 guard's FOURTH, the s162 guard's THIRD,
#     the s163 guard's SECOND, the s164 guard's FIRST) — the F140 rider
#     at the count-truth guard family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.143.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.144.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.143\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.144\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.143.0 -> v1.144.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s160..s164 cycle's own rider
#     form, its sixth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.143.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.144.0",'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2287";' in text:
        assert text.count('const UNIT = "2287";') == 1
        text = text.replace('const UNIT = "2287";', 'const UNIT = "2301";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2301";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "226";' in text:
        assert text.count('const FILES = "226";') == 1
        text = text.replace('const FILES = "226";', 'const FILES = "227";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "227";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
