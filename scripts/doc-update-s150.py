#!/usr/bin/env python3
"""The session-150 docs update: the count-family re-anchor (2100 = 2093 + 7
unit / 212 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s150.test.ts, the AGENTS session-150 bullet, and the
spec-constants re-anchor for the per-session count-honesty family.

NO §11 line-count re-anchors this cycle (canvas.tsx stays 1075 — the
S150-A citation repair re-wrapped at the same 7-line comment form; the
layer total stays 13,895).

Frozen historical rows (the session-146/147/148/149 bullets' own count
records, the v1.125.0/v1.126.0/v1.127.0/v1.128.0 headers' records, the
worklog's delivery records, the PAD's frozen session-history rows — the
B145-I1 coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s150.py
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
    ("| Unit tests (2093 checks) | `bun run test` |",
     "| Unit tests (2100 checks) | `bun run test` |"),
    ("`bun run test` (2093) → `bun run build`",
     "`bun run test` (2100) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2093 checks, Vitest) |",
     "| `bun run test` | Unit tests (2100 checks, Vitest) |"),
    ("(2093 unit / 73 smoke / 262 e2e)",
     "(2100 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2093 checks):",
     "- **Unit Tests** (Vitest, 2100 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2093 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2100 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2093 checks on the pure domain seams",
     "bun run test              # unit tests — 2100 checks on the pure domain seams"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2093 unit checks green',
     'project_state: "2100 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2093 checks; `*.test.ts` only |",
     "| Unit tests | Vitest | ≥5.0.1 | 2100 checks; `*.test.ts` only |"),
    ("bun run test          # 2093/2093",
     "bun run test          # 2100/2100"),
])

# --- Project_Architecture_Document.md -----------------------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **211 files** | **2093** | | Vitest |",
     "| **Unit total** | **212 files** | **2100** | | Vitest |"),
    ("- [ ] `bun run test` → 2093/2093",
     "- [ ] `bun run test` → 2100/2100"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2093 checks / 211 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2100 checks / 212 files) |"),
])

# --- the §7.1 row for the s150 spec (insert after the s149 row) ---------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

S149_ROW_TAIL = "`tests/lows-s149.test.ts` | 8 | tests | Vitest |"
S150_ROW = (
    "| Unit — THE CROSS-DOCUMENT-CITATION-REPAIR/EXECUTION-RECORD-TICK "
    "PASS (the ninety-eighth audit's chosen work, the "
    "citation-and-receipt cycle after S149's "
    "all-registration-plus-one-comment-token pass: S150-A — the S96-C "
    "provenance comment's cross-document citation repaired in place "
    "(A150-I1: canvas.tsx:950's selection-ring provenance comment "
    "cited \"PAD:1375\" as the record proving the reference's ring "
    "classes inert — the citation BORN-DRIFTED at the S96 delivery "
    "(at the parent commit 75a784b^ PAD:1375 WAS the RA-14…RA-20 "
    "row; the S96 cycle's own PAD v1.75.0 revision block prepended 8 "
    "lines, the record landing at :1383 in the delivered tree — the "
    "in-code token quoted from the s96 plan, never re-derived against "
    "the delivered tree, the exact F136 mechanism) and since drifted "
    "+362 (the live PAD:1375 is the F51 lesson body; the record lives "
    "at :1737 today); the repair replaces the bare coordinate with "
    "the CONTENT-FORM anchor \"the PAD's RA-14…RA-20 re-measure "
    "record\" (unique in the PAD), zero line-count drift — the "
    "live-comment convention); S150-B — the s149 plan's "
    "execution-record tick pass (B150-I1: the s149 remediation plan's "
    "seven execution boxes shipped unticked at its own delivery "
    "commit b2ebe05 — the lone departure from the S146/S147/S148 "
    "convention of ticking the plan's execution record in the "
    "delivery commit itself (8/6/8 boxes ticked at their single "
    "delivery commits); the seven-box tick pass restores the "
    "delivery-receipt convention); S150-C the per-session pin family "
    "(7 pins: 3 RED / 4 survival; one spec-form repair at birth — "
    "auditor A's entry carries its census as the prose lead of its "
    "Stage Summary while auditor B's carries the standard census "
    "line, the spec pinning each entry at its own live form) and the "
    "collateral family (the count-family re-anchor 2100 = 2093 + 7 "
    "unit / 212 files; ZERO §11 line-count re-anchors — the layer "
    "total stays 13,895; e2e stays 262; smoke stays 73) | "
    "`tests/lows-s150.test.ts` | 7 | tests | Vitest |"
)
if S150_ROW in text:
    print("PAD: s150 §7.1 row already present (idempotent skip)")
else:
    assert text.count(S149_ROW_TAIL) >= 1, "s149 §7.1 row tail anchor missing"
    # the s149 row is a long row; insert the s150 row right AFTER its line
    lines = text.split("\n")
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.endswith(S149_ROW_TAIL):
            out.append(S150_ROW)
            inserted = True
    assert inserted, "s149 §7.1 row not found as a full line tail"
    pad.write_text("\n".join(out))
    print("PAD: §7.1 row for tests/lows-s150.test.ts inserted after the s149 row")

# --- the AGENTS session-150 bullet (insert after the session-149 bullet) -------
agents = ROOT / "AGENTS.md"
atext = agents.read_text()
BULLET = (
    "- **The cross-document-citation-repair/execution-record-tick seams "
    "(session 150, S150-A..S150-C — the ninety-eighth Mode C audit's "
    "chosen work, the citation-and-receipt cycle after S149's "
    "all-registration-plus-one-comment-token pass):** (a) THE S96-C "
    "COMMENT'S CROSS-DOCUMENT CITATION (S150-A / A150-I1): "
    "canvas.tsx:950's S96-C selection-ring provenance comment cited "
    "\"PAD:1375\" as the record proving the reference's ring classes "
    "inert — the citation BORN-DRIFTED at the S96 delivery (at the "
    "parent commit 75a784b^ PAD:1375 WAS the RA-14…RA-20 row; the "
    "S96 cycle's own PAD v1.75.0 revision block prepended 8 lines, "
    "the record landing at :1383 in the delivered tree — the in-code "
    "token was quoted from the s96 plan drafted against the pre-bump "
    "tree, never re-derived against the tree the comment itself "
    "landed in, the exact F136 mechanism) and since drifted +362 "
    "(the live PAD:1375 is the F51 lesson body; the described record "
    "lives at :1737 today); the repair: the bare coordinate replaced "
    "by the CONTENT-FORM anchor \"the PAD's RA-14…RA-20 re-measure "
    "record\" (unique in the PAD, live-verified), zero line-count "
    "drift (canvas.tsx stays 1075); the doctrine (F137 — the "
    "cross-document-citation member): a live comment citing ANOTHER "
    "document's coordinate must ride a content-form anchor — the "
    "record's own name — never a bare line coordinate of a document "
    "that re-versions with prepended blocks every cycle; (b) THE "
    "S149 PLAN'S EXECUTION-RECORD TICK PASS (S150-B / B150-I1): the "
    "s149 remediation plan's seven execution boxes shipped unticked "
    "at its own delivery commit b2ebe05 — the lone departure from "
    "the S146/S147/S148 convention (8/6/8 boxes ticked at their "
    "single delivery commits); the seven-box tick pass restores the "
    "delivery-receipt convention in place; the doctrine (F137 — the "
    "plan-execution-record member): a remediation plan's execution "
    "record ships TICKED in its own delivery commit — the record is "
    "the delivery's receipt, and an unticked record reads as an "
    "unexecuted delivery to any future reader auditing by it; (c) "
    "the per-session pin family (tests/lows-s150.test.ts — 7 pins: "
    "3 RED / 4 survival; one spec-form repair at birth — auditor "
    "A's entry carries its census as prose while auditor B's carries "
    "the standard census line, the spec pinning each entry at its "
    "own live form) and the collateral family (the count family "
    "2100 = 2093 + 7 unit / 212 files; ZERO §11 line-count "
    "re-anchors — the layer total stays 13,895; e2e stays 262; "
    "smoke stays 73). Pinned by `tests/lows-s150.test.ts`."
)
if BULLET in atext:
    print("AGENTS: session-150 bullet already present (idempotent skip)")
else:
    anchor = "Pinned by `tests/lows-s149.test.ts`."
    assert atext.count(anchor) == 1, "AGENTS s149 bullet tail anchor missing"
    atext = atext.replace(anchor, anchor + "\n" + BULLET, 1)
    agents.write_text(atext)
    print("AGENTS: session-150 bullet inserted after the session-149 bullet")

# --- the spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    if 'const UNIT = "2093";' in text:
        assert text.count('const UNIT = "2093";') == 1
        text = text.replace('const UNIT = "2093";', 'const UNIT = "2100";')
        spec.write_text(text)
        unit_files += 1
    elif 'const UNIT = "2100";' in text:
        unit_files += 1  # already applied
    if 'const FILES = "211";' in text:
        assert text.count('const FILES = "211";') == 1
        text = text.replace('const FILES = "211";', 'const FILES = "212";')
        spec.write_text(text)
        files_files += 1
    elif 'const FILES = "212";' in text:
        files_files += 1  # already applied
print(f"spec constants re-anchored: UNIT in {unit_files} files, FILES in {files_files} files")
