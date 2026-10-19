#!/usr/bin/env python3
"""The session-158 docs update: the count-family re-anchor (2195 = 2182 + 13
unit / 220 files across every live claim site), the §7.1 row for the s158
spec, the §11 validation.ts row re-anchor (355 → 370), the AGENTS
session-158 bullet, the s157 spec's F140 route-pin re-anchor (the prior
claim onto the current tree's spelling), the prior-spec forward-guard
ROLLING re-anchors (the s154/s155/s156/s157 count-truth guards' version
literals onto v1.137.0, the F140 rider: the CLAIM stays true, the pinned
spelling moves with the current block), the s151..s157 SKILL-version pins
onto v1.136.0, and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-146..157 bullets' own count
records, the v1.125.0..v1.136.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s158.py
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
    ("| Unit tests (2182 checks) | `bun run test` |",
     "| Unit tests (2195 checks) | `bun run test` |"),
    ("`bun run test` (2182) → `bun run build`",
     "`bun run test` (2195) → `bun run build`"),
    # the live-anchor paren phrase (the s152-cycle convention — the
    # family's rolling marker; the s152 bullet's paren form carries it)
    ("the count-family re-anchor 2182 = 2171 + 11 unit / 219 files (the family's live anchor)",
     "the count-family re-anchor 2195 = 2182 + 13 unit / 220 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2182 checks, Vitest) |",
     "| `bun run test` | Unit tests (2195 checks, Vitest) |"),
    ("(2182 unit / 73 smoke / 262 e2e)",
     "(2195 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2182 checks):",
     "- **Unit Tests** (Vitest, 2195 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2182 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2195 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2182 checks on the pure domain seams",
     "bun run test              # unit tests — 2195 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2182 unit checks green',
     'project_state: "2195 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2182 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2195 checks;"),
    ("bun run test          # 2182/2182",
     "bun run test          # 2195/2195"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **219 files** | **2182** | | Vitest |",
     "| **Unit total** | **220 files** | **2195** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2182/2182",
     "- [ ] `bun run test` → 2195/2195"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2182 checks / 219 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2195 checks / 220 files) |"),
])

# --- Project_Architecture_Document.md — the §11 validation.ts row -------------
# (the source-carrying form: the figure re-anchored + the S158-A seam
#  registration appended — the S148-A/S75-B/S76-F precedent)
patch("Project_Architecture_Document.md", [
    ("| `src/lib/validation.ts` | 355 | Caps, enums, hex checks, clamps + the `readBoundedJson` seam",
     "| `src/lib/validation.ts` | 370 | Caps, enums, hex checks, clamps + the `readBoundedJson` seam"),
    ("S118-D3 — the heaviest-legitimate figure re-anchored onto the post-census ~25 MB arithmetic) + the `normalizeEmail` seam",
     "S118-D3 — the heaviest-legitimate figure re-anchored onto the post-census ~25 MB arithmetic; S158-A — the `describeRejection` seam: the TOTAL rejection description, both arms inside ONE try answering \"[unloggable rejection]\" when the description itself throws — the B158-I1 closure at the coercion seam, consumed by the ai-assistant route's degrade-not-fail catch) + the `normalizeEmail` seam"),
])

# The §7.1 row for the s158 spec (inserted after the s157 row).
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE TOTAL REJECTION-DESCRIPTION + TOOLBAR PX-HONESTY + PAD TITLE-LAG REPAIR PASS (the one-hundred-and-sixth audit's chosen work, the auditors' third consecutive all-Informational census 0C/0H/0M/0L/2I plus the lead's L158-L1: S158-A — the total rejection-description hardening (B158-I1, lead-verified live at the seam): the S157-A hardening's String(error) arm was NOT total over rejection shapes — a null-prototype object makes String() itself throw, a hostile toString/Symbol.toPrimitive rethrows, a throwing message getter defeats the instanceof arm — in those shapes the catch's own log line threw INSIDE the catch, escaping POST as the bare 500 the catch exists to make impossible while the comment claimed \"every rejection shape\"; the fix: the pure describeRejection(error: unknown): string seam born in src/lib/validation.ts (both arms inside ONE try, the catch answering \"[unloggable rejection]\") consumed by the route's catch (the import extended in place — the route file stays 154 lines, the route layer stays 2,450, the file OUTSIDE the 22-file client layer, the layer total stays 14,077); validation.ts 355 → 370; S158-B — the toolbar comment px-honesty repair (A158-I1): the provenance comment's \"8px buttons\" reworded to the layer's own conversion form \"h-8 w-8 (32px) buttons\", comment-only at zero line movement (toolbar.tsx stays 89); S158-C — the PAD title-lag repair (L158-L1, the lead's plan-validation discovery): the S157 delivery's title bump never applied (the title at bafca7fb still read v1.135.0 while the chain head read v1.136.0 — the S157 \"docs aligned (PAD v1.136.0…)\" claim false at the title seam); the S158 version bump raises the title onto v1.137.0 (the new chain head — the live-claim form, never a history replay) with the bracketed s158-title-lag-repair-note landed before the spec's birth (the frozen records never rewritten, S132-C) and the forward form: a bump script's application is verified AT THE TREE after the run; S158-D the per-session pin family (13 pins: 8 RED incl. the BEHAVIORAL shape member riding the dynamic import + the pair-unity RED-until-collateral / 5 survival; ONE spec-form repair at birth — the toolbar pin rides the slash-comment-stripped collapsed form, the s157 shell-form repair's TS sibling) with the F138 guard's EIGHTH instance riding the survival form (the s157 plan's record pinned 6/6 ticked per the session_328 directive; THE F138 GUARD'S EIGHTH VERIFICATION PASSED — the s157 plan 6/6 at its own delivery commit bafca7fb, the forward form held a seventh consecutive cycle) and the forward count-truth guard's FIFTH instance (the layer-total pin derives the live 22-file figure at spec runtime against the v1.137.0 block's quote) and the collateral family (the count-family re-anchor 2195 = 2182 + 13 unit / 220 files; the §11 validation.ts row 355 → 370; the s157 spec's F140 route-pin re-anchor onto the describeRejection spelling; the 22-file layer total STAYS 14,077 — the route fix outside the layer, the toolbar fix comment-only; the s154/s155/s156/s157 forward-guard rolling re-anchors onto v1.137.0; e2e stays 262; smoke stays 73) | `tests/lows-s158.test.ts` | 13 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s157.test.ts` | 11 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s157 §7.1 anchor row not found")
if "`tests/lows-s158.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s158 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-158 bullet (appended to the architecture facts) -------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The total-coercion + toolbar-px + title-lag seams (session 158, "
    "S158-A..S158-D — the one-hundred-and-sixth audit's chosen work, the "
    "auditors' third consecutive all-Informational census 0C/0H/0M/0L/2I "
    "+ the lead's L158-L1):** (a) an operation inside a catch is itself a "
    "fallible operation — the ai-assistant degrade-not-fail catch "
    "describes its rejection through the TOTAL guarded form "
    "(`describeRejection` in src/lib/validation.ts: both arms inside ONE "
    "try, the catch answering \"[unloggable rejection]\" — a "
    "null-prototype object makes String() itself throw, a hostile "
    "toString rethrows, a throwing message getter defeats the instanceof "
    "arm; the B158-I1 closure at the coercion seam — the S157-A "
    "instanceof-narrowed form lives INSIDE the guard, its claim now "
    "mechanism-true for every rejection shape); (b) a pixel claim "
    "follows the layer's own conversion convention — the toolbar "
    "provenance comment names the class AND the converted px (\"h-8 w-8 "
    "(32px) buttons\"), never a bare step index (A158-I1 closed); (c) a "
    "bump script's application is verified AT THE TREE after the run — "
    "the PAD title diffed against the chain head (the S157 title bump "
    "never applied; the S158 bump raises the title onto v1.137.0, the "
    "L158-L1 closure); (d) the F138 guard's eighth verification PASSED "
    "(the s157 plan 6/6 at bafca7fb) and its eighth instance rides the "
    "s158 spec (the s157 plan's record pinned ticked at the spec's "
    "birth, per the session_328 directive). Pinned by "
    "`tests/lows-s158.test.ts` (13 pins: 8 RED incl. the behavioral "
    "shape member + the pair-unity RED-until-collateral / 5 survival; "
    "the count-family re-anchor 2195 = 2182 + 13 unit / 220 files — the "
    "family's live anchor).\n"
)
marker = "- **The non-Error-rejection + witness-contract scope-honesty seams (session 157,"
if "`tests/lows-s158.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s157 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-158 bullet inserted")
else:
    print("AGENTS.md: session-158 bullet already present")

# --- The s157 spec's F40 route-pin re-anchor (the prior claim onto the -------
# --- current tree's spelling) ------------------------------------------------
# The S158-A fix moved the instanceof-narrowed form INSIDE the guarded
# helper; the s157 spec's route pin re-anchors so the prior claim stays
# TRUE at the current tree (the F140 prior-spec re-anchor rider).
patch("tests/lows-s157.test.ts", [
    ('      "error instanceof Error ? error.message : String(error)",',
     '      "describeRejection(error)",'),
    ('    expect(routeSource).toContain("every rejection shape (S157-A)");',
     '    expect(routeSource).toContain("every rejection shape (S157-A/S158-A)");'),
])

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s157 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump; the S157 cycle's
#     own step, re-derived live this cycle).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.135\\.0" in text:
        text = text.replace("version: 1\\.135\\.0", "version: 1\\.136\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.136.0)")
    elif "version: 1\\.136\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154/s155/s156/s157 forward count-truth guards' rolling re-anchors
# (v1.136.0 -> v1.137.0 — the s154 guard's FOURTH rolling instance,
#     the s155 guard's THIRD, the s156 guard's SECOND, the s157 guard's
#     FIRST) — the F140 rider at the count-truth guard family: the
#     CLAIM stays true, the pinned version literal moves with the
#     current block.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.136.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.137.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.136\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.137\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.136.0 -> v1.137.0)")

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2182";' in text:
        assert text.count('const UNIT = "2182";') == 1
        text = text.replace('const UNIT = "2182";', 'const UNIT = "2195";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2195";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "219";' in text:
        assert text.count('const FILES = "219";') == 1
        text = text.replace('const FILES = "219";', 'const FILES = "220";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "220";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
