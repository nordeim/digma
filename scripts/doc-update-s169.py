#!/usr/bin/env python3
"""The session-169 docs update: the count-family re-anchor (2361 = 2345 + 16
unit / 231 files across every live claim site), the LAYER-TOTAL family
STAYING at 14,307 (the second consecutive STAYS cycle — call.ts OUTSIDE the
22-file layer under the S169-A docblock era-scoping correction, the S169-B
rename LINE-NEUTRAL inside the route layer; ZERO F40 prior-spec riders, ZERO
§11 re-anchors), the §7.1 row for the s169 spec, the AGENTS session-169
bullet (carrying the S169-A era-scoping correction + the S169-B
binding-shadow rename + the S169-C registration pair + the S169-D
per-session pin family), the prior-spec forward-guard ROLLING re-anchors
(the s154..s168 count-truth guards' version literals onto v1.148.0), the
s151..s168 SKILL-version pins onto v1.147.0, the s158 title pin onto
v1.148.0, and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-146..168 bullets' own count
records, the v1.125.0..v1.147.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s169.py
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
    ("| Unit tests (2345 checks) | `bun run test` |",
     "| Unit tests (2361 checks) | `bun run test` |"),
    ("`bun run test` (2345) → `bun run build`",
     "`bun run test` (2361) → `bun run build`"),
    # the live-anchor paren phrase (the family's rolling marker, riding
    # the s168 bullet's tail — the F106 live-claim classification)
    ("the count-family re-anchor 2345 = 2330 + 15 unit / 230 files (the family's live anchor)",
     "the count-family re-anchor 2361 = 2345 + 16 unit / 231 files (the family's live anchor)"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2345 checks, Vitest) |",
     "| `bun run test` | Unit tests (2361 checks, Vitest) |"),
    ("(2345 unit / 73 smoke / 262 e2e)",
     "(2361 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2345 checks):",
     "- **Unit Tests** (Vitest, 2361 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2345 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2361 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2345 checks on the pure domain seams",
     "bun run test              # unit tests — 2361 checks on the pure domain seams"),
])

# --- digma_SKILL.md ----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2345 unit checks green',
     'project_state: "2361 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2345 checks;",
     "| Unit tests | Vitest | ≥5.0.1 | 2361 checks;"),
    ("bun run test          # 2345/2345",
     "bun run test          # 2361/2361"),
])

# --- Project_Architecture_Document.md — the count rows ------------------------
patch("Project_Architecture_Document.md", [
    # §8 Unit total row
    ("| **Unit total** | **230 files** | **2345** | | Vitest |",
     "| **Unit total** | **231 files** | **2361** | | Vitest |"),
    # §7.4 checklist row
    ("- [ ] `bun run test` → 2345/2345",
     "- [ ] `bun run test` → 2361/2361"),
    # §9.2 command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2345 checks / 230 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2361 checks / 231 files) |"),
])

# --- The §7.1 row for the s169 spec (inserted after the s168 row). ------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()
row = (
    "| Unit — THE DOCBLOCK ERA-SCOPING CORRECTION + BINDING-SHADOW RENAME PASS (the one-hundred-and-seventeenth audit's chosen work, the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/1I — a FOUR-INFORMATIONAL cycle, the cleanest census form since S165, the third consecutive source-carrying cycle): S169-A — the call() docblock era-scoping correction (the A169-I-2 remediation, the comment-truth family's tense arm): src/lib/call.ts's retained pre-S168 trailing clause spoke of the long-deleted files view's GET-only call sites in the PRESENT tense while its recent-view/dashboard-view siblings correctly tense the same history — the clause reworded onto the era-scoped past tense with the S169-A provenance at the seam, a comment-only change, call.ts 76 → 80, the file OUTSIDE the 22-file layer (the layer total STAYS 14,307 — the second consecutive STAYS cycle) + S169-B — the ai-assistant binding-shadow rename (the B169-I-1 remediation, the names-outlive-their-concepts family at the binding level): src/app/api/ai-assistant/route.ts:139's inner `const parsed = JSON.parse(...)` shadowing the outer body-parse binding at :48 renamed onto `modelReply` — a LINE-NEUTRAL two-line change (the file stays 154, the 18-file route layer STAYS 2,450 — zero F40 riders), the outer binding untouched, zero wire impact + S169-C — the registration pair (the bracketed s169-below-threshold-note — the A169-I-1 + A169-I-3 standing registration: the five S168 below-threshold observations re-verified at their seams, plus the components-panel no-op's documented PAD §10 scope cut + the s169-id-stable-premises-note at the 42nd consecutive cycle, landed by auditor B, the judgment carried unchanged) + S169-D the per-session pin family (16 pins: 7 RED incl. the two source-side members — the spec born BEFORE the source fixes, the TDD form, the third consecutive source-carrying cycle — and the five doc-side members / 9 green-at-birth; RED 7/9 EXACT after ONE spec-form repair — the 64KB-cap pin's closing-quote-then-slice substring; the F138 guard's TWENTIETH instance riding the survival form — the s168 plan's record pinned 5/5 ticked at b39fe71a per the pre-armed session_395 directive) and the collateral family (the count-family re-anchor 2361 = 2345 + 16 unit / 231 files; the layer-total family STAYING at 14,307 — zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450; the s151..s168 SKILL-version pins onto v1.147.0; the s154..s168 forward-guard rolling re-anchors onto v1.148.0 — the guard family's fifteenth through first rolling instances; the s158 title pin onto v1.148.0; e2e stays 262; smoke stays 73) | `tests/lows-s169.test.ts` | 16 | tests | Vitest |\n"
)
anchor_row = "`tests/lows-s168.test.ts` | 15 | tests | Vitest |\n"
if anchor_row not in text:
    raise SystemExit("s168 §7.1 anchor row not found")
if "`tests/lows-s169.test.ts`" not in text:
    at = text.index(anchor_row) + len(anchor_row)
    text = text[:at] + row + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: §7.1 row for lows-s169 inserted")
else:
    print("Project_Architecture_Document.md: §7.1 row already present")

# --- The AGENTS session-169 bullet (inserted above the s168 bullet) -----------
agents = ROOT / "AGENTS.md"
text = agents.read_text()
bullet = (
    "- **The docblock era-scoping correction + binding-shadow rename seams (session 169, "
    "S169-A..S169-D — the one-hundred-and-seventeenth audit's chosen work, the auditors' census "
    "A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/1I, every claim lead-verified at its seams — a "
    "FOUR-INFORMATIONAL cycle, the cleanest census form since S165, the third consecutive "
    "source-carrying cycle):** (a) THE CALL() DOCBLOCK ERA-SCOPING CORRECTION (S169-A, the "
    "A169-I-2 remediation — the comment-truth family's tense arm): the retained pre-S168 "
    "trailing clause spoke of the long-deleted files view's GET-only call sites in the present "
    "tense (\"are behavior-identical through this form\") while its recent-view/dashboard-view "
    "siblings tense the same history as history — the clause reworded onto the era-scoped past "
    "tense (\"the long-deleted files view's GET-only call sites were behavior-identical through "
    "this form\") with the S169-A provenance at the seam, a comment-only change (call.ts 76 → "
    "80, the file OUTSIDE the 22-file layer — the layer total STAYS 14,307, the second "
    "consecutive STAYS cycle); the comment-truth census 142 sampled, 142 TRUE / 0 FALSE — the "
    "return to zero-false after S168's real find (the fourth zero-false sampling in the "
    "record); (b) THE AI-ASSISTANT BINDING-SHADOW RENAME (S169-B, the B169-I-1 remediation — "
    "the names-outlive-their-concepts family at the binding level): ai-assistant/route.ts:139's "
    "inner `const parsed = JSON.parse(...)` SHADOWED the handler's outer body-parse binding at "
    ":48 — two concepts sharing one name in one function scope, zero behavioral impact today, "
    "the hazard a future edit referencing `parsed` in good faith and silently receiving the "
    "model's parsed reply (the S71-D drift class at the binding level); the inner binding "
    "renamed onto `modelReply`, a LINE-NEUTRAL two-line change (the file stays 154, the route "
    "layer STAYS 2,450 — zero F40 riders), the outer binding untouched; (c) THE REGISTRATION "
    "PAIR (S169-C): the s169-below-threshold-note (the A169-I-1 + A169-I-3 standing "
    "registration — the five S168 below-threshold observations re-verified at their seams "
    "with their postures, plus the components-panel no-op's documented PAD §10 scope cut) + "
    "the s169-id-stable-premises-note (the 42nd consecutive cycle: the four premises "
    "re-derived live and pinned — P1's twelve churn-consuming sites value-based or "
    "honest-refusal, P2's index-stable remap behind the five-guard stack, P3's "
    "replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage "
    "perimeter; the judgment carried unchanged); (d) THE PER-SESSION PIN FAMILY (S169-D): "
    "16 pins — 7 RED incl. the two source-side members (the spec born BEFORE the source "
    "fixes, the TDD form — the third consecutive source-carrying cycle) and the five "
    "doc-side members / 9 green-at-birth (the registrations landed before the spec's "
    "birth; RED 7/9 EXACT after ONE spec-form repair — the 64KB-cap pin's "
    "closing-quote-then-slice substring onto the source's own spelling). Pinned by "
    "`tests/lows-s169.test.ts` (the count-family re-anchor 2361 = 2345 + 16 unit / 231 "
    "files — the family's live anchor; the 22-file layer at 14,307 — the STAYS-cycle form, "
    "call.ts outside the layer; the route layer at 2,450 — the rename line-neutral).\n"
)
marker = "- **The call() docblock scope correction + registration pair seams (session 168,"
if "`tests/lows-s169.test.ts`" not in text:
    at = text.index(marker)
    # insert the new bullet ABOVE the s168 bullet (newest first)
    text = text[:at] + bullet + text[at:]
    agents.write_text(text)
    print("AGENTS.md: session-169 bullet inserted")
else:
    print("AGENTS.md: session-169 bullet already present")

# --- The prior-spec forward-guard ROLLING re-anchors --------------------------
# (0) the s151..s168 SKILL-version pins onto the CURRENT figure (the
#     rolling form the s152 cycle established — the version field is a
#     live claim that moves with every cycle's bump).
for name in ("tests/lows-s151.test.ts", "tests/lows-s152.test.ts", "tests/lows-s153.test.ts", "tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts", "tests/lows-s167.test.ts", "tests/lows-s168.test.ts"):
    f = ROOT / name
    text = f.read_text()
    if "version: 1\\.146\\.0" in text:
        text = text.replace("version: 1\\.146\\.0", "version: 1\\.147\\.0")
        f.write_text(text)
        print(f"{name}: the SKILL-version pin re-anchored onto the current figure (v1.147.0)")
    elif "version: 1\\.147\\.0" in text:
        print(f"{name}: version pin already on the current figure")
    else:
        raise SystemExit(f"{name}: version pin anchor not found")

# (1) the s154..s168 forward count-truth guards' rolling re-anchors
# (v1.147.0 -> v1.148.0 — the s154 guard's FIFTEENTH rolling instance,
#     the s155 guard's FOURTEENTH, the s156 guard's THIRTEENTH, the s157
#     guard's TWELFTH, the s158 guard's ELEVENTH, the s159 guard's TENTH,
#     the s160 guard's NINTH, the s161 guard's EIGHTH, the s162 guard's
#     SEVENTH, the s163 guard's SIXTH, the s164 guard's FIFTH, the s165
#     guard's FOURTH, the s166 guard's THIRD, the s167 guard's SECOND,
#     the s168 guard's FIRST) —
#     the F40 rider at the count-truth guard family.
for name in ("tests/lows-s154.test.ts", "tests/lows-s155.test.ts", "tests/lows-s156.test.ts", "tests/lows-s157.test.ts", "tests/lows-s158.test.ts", "tests/lows-s159.test.ts", "tests/lows-s160.test.ts", "tests/lows-s161.test.ts", "tests/lows-s162.test.ts", "tests/lows-s163.test.ts", "tests/lows-s164.test.ts", "tests/lows-s165.test.ts", "tests/lows-s166.test.ts", "tests/lows-s167.test.ts", "tests/lows-s168.test.ts"):
    f = ROOT / name
    text = f.read_text()
    changed = 0
    for old, new in [
        ("/** The figure the v1.147.0 PAD block quotes for the layer total (the",
         "/** The figure the v1.148.0 PAD block quotes for the layer total (the"),
        (r"    /v1\.147\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,",
         r"    /v1\.148\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,"),
    ]:
        if old in text:
            text = text.replace(old, new)
            changed += 1
    f.write_text(text)
    print(f"{name}: {changed} forward-guard sites rolling-re-anchored (v1.147.0 -> v1.148.0)")

# (2) the s158 title pin onto the incoming chain head (the title-lag
#     guard rides the CURRENT head — the s161..s168 cycle's own rider
#     form, its tenth instance).
patch("tests/lows-s158.test.ts", [
    ('      "# Digma — Master Project Architecture Document (PAD) v1.147.0",',
     '      "# Digma — Master Project Architecture Document (PAD) v1.148.0",'),
])

# --- The spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2345";' in text:
        assert text.count('const UNIT = "2345";') == 1
        text = text.replace('const UNIT = "2345";', 'const UNIT = "2361";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2361";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "230";' in text:
        assert text.count('const FILES = "230";') == 1
        text = text.replace('const FILES = "230";', 'const FILES = "231";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "231";' in text:
        files_files += 1  # already applied
print(f"spec-constants sweep: {unit_files} UNIT + {files_files} FILES re-anchored")
