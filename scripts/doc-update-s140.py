#!/usr/bin/env python3
"""The session-140 docs update: the count-family re-anchor (1989 = 1977 + 12
unit / 202 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s140.test.ts, the AGENTS session-140 bullet (the LIVE ANCHOR
family's carry), and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-139 bullet's own count record, the
v1.118.0 header's record, the worklog's delivery records) are NEVER touched
— the F106 live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s140.py
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
    ("| Unit tests (1977 checks) | `bun run test` |",
     "| Unit tests (1989 checks) | `bun run test` |"),
    ("`bun run test` (1977) → `bun run build`",
     "`bun run test` (1989) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (1977 checks, Vitest) |",
     "| `bun run test` | Unit tests (1989 checks, Vitest) |"),
    ("(1977 unit / 73 smoke / 262 e2e).",
     "(1989 unit / 73 smoke / 262 e2e)."),
    ("- **Unit Tests** (Vitest, 1977 checks):",
     "- **Unit Tests** (Vitest, 1989 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("Vitest | 5 | 1977 checks",
     "Vitest | 5 | 1989 checks"),
    ("# unit tests — 1977 checks",
     "# unit tests — 1989 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "1977 unit checks green',
     'project_state: "1989 unit checks green'),
    ("≥5.0.1 | 1977 checks; `*.test.ts` only |",
     "≥5.0.1 | 1989 checks; `*.test.ts` only |"),
    ("bun run test          # 1977/1977",
     "bun run test          # 1989/1989"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s140 spec + the Unit-total + the checklist + the
# §9.2 command-table count (the v1.118.0 header line stays FROZEN — it is
# the prior session's own record)
S140_ROW = (
    "| Unit — THE FROZEN-RECORD/COUNT-PAIR/COORDINATE-LIVENESS REGISTRATION PASS (the eighty-eighth audit's chosen work: S140-A — the frozen-record census-scoping registration (A140-I1, the A139-I1 class at its FROZEN-RECORD shape: the \"aliveRef chain at all four heads\" true of chain LINKS never guards — the S123-B comment's own 4-link enum vs exactly 3 explicit guards at :1271/:1381/:1411, the two pure transforms (downscaleDataUrl, thumbnailFor) landing at the guarded terminal commitUpload; the \"setState-in-render at all six sites\" true at the 19-file list scope, the 22-file list carrying SEVEN with the recent-view.tsx:301-304 sibling (the S58-D paramsKey/search sync); the worklog's bracketed s140-frozen-record-census-note + the decomposition pins: the 3-guard census with the S123-B comment enum, the recent-view seventh site present); S140-B — the count-pair unity registration (B140-I1, the B139-I2 arithmetic shape's sibling: the brief's \"1977/200\" stale file member vs the live 1977/201 at all 15 sites — a count PAIR is one claim, not two independently-editable figures; the worklog's bracketed s140-count-pair-note + the pair-unity pins: every live-form site the same checks member, every files-member site the same files member, the co-occurring §9.2 row same-generation); S140-C — the coordinate-liveness registration (B140-I2, the A138-I1 brief-lineage class at its COORDINATE-STALENESS shape: the brief's PAD coordinates :7/:2755/:2814/:2883 vs the live :6/:2757/:2816/:2885 — the S139 delivery's own +2 PAD growth; the worklog's bracketed s140-coordinate-staleness-note + the content-derived PAD-site pins: the four sites found by their content forms, never by coordinates); the survival set — the S139-A..S139-D registrations verbatim, the s140 script provenance anchors (live140/nav140/seo-s140 — the 116th audit, the 117th session, the 77th clip ordinal, the S139 delivery at HEAD 6407d66)) | `tests/lows-s140.test.ts` | 12 | tests | Vitest |\n"
)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s139 row and the Unit total
    (
        "the S138 delivery at HEAD 45db29a)) | `tests/lows-s139.test.ts` | 12 | tests | Vitest |\n| **Unit total** | **201 files** | **1977** | | Vitest |",
        "the S138 delivery at HEAD 45db29a)) | `tests/lows-s139.test.ts` | 12 | tests | Vitest |\n"
        + S140_ROW
        + "| **Unit total** | **202 files** | **1989** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 1977/1977",
     "- [ ] `bun run test` → 1989/1989"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1977 checks / 201 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (1989 checks / 202 files) |"),
])

# --- the AGENTS session-140 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The frozen-record/count-pair/coordinate-liveness registration seams (session 140, S140-A..S140-D — the eighty-eighth Mode C audit's chosen work):** (a) THE FROZEN-RECORD CENSUS-SCOPING REGISTRATION (S140-A / A140-I1 — the audit's first Informational, the registration form): the census-scoping class recurring inside the FROZEN records — the s136/s138/s139 audit-A entries' "commitUpload's aliveRef chain at all four heads" is true of chain LINKS (the S123-B comment's own enum: FileReader onload → downscaleDataUrl → thumbnailFor → commitUpload) never of guards (exactly 3 explicit at :1271/:1381/:1411, the two pure transforms landing at the guarded terminal), and the s138/s139 entries' "setState-in-render at all six sites" is true at the 19-file list scope while the 22-file list carries SEVEN (the S58-D sibling at recent-view.tsx:301-304); every figure live-true at its unnamed scope; blast radius zero (frozen records never rewritten per S132-C); the count-truth doctrine extended: a frozen record's count is live truth only at its named LIST — when the list grows, re-derive the count; the worklog's bracketed s140-frozen-record-census-note; the live truth PINNED by the spec's decomposition pins (the 3-guard census with the comment enum, the recent-view seventh site); (b) THE COUNT-PAIR UNITY REGISTRATION (S140-B / B140-I1): the dispatch brief's "1977/200 count-family" carried a stale file-count member — all 15 live sites carry 1977 checks / 201 files; a count PAIR is ONE claim, not two independently-editable figures (the unit member updated without the file member is the B139-I2 arithmetic shape's sibling); the worklog's bracketed s140-count-pair-note; the live truth PINNED by the spec's pair-unity pins (every live-form site the same checks member, the co-occurring §9.2 row same-generation); (c) THE COORDINATE-LIVENESS REGISTRATION (S140-C / B140-I2): the brief's PAD claim-site coordinates were the frozen pre-delivery snapshot (:7/:2755/:2814/:2883 vs the live :6/:2757/:2816/:2885 — the S139 delivery's own +2 PAD growth); doc-site COORDINATES are live claims about doc layout — derive them live at dispatch or name doc+section anchors only; the worklog's bracketed s140-coordinate-staleness-note; the live truth PINNED by the spec's content-derived PAD-site pins (the four sites found by content, never coordinates); (d) the per-session pin family (tests/lows-s140.test.ts — 12 pins: 4 RED / 8 survival — the three worklog registrations + the count re-anchor in the DEFECT form; the three s140 script derivations 22/66/6) and the collateral family (the count family 1989 = 1977 + 12 unit / 202 files; zero §11 line-count changes — no source file edited this cycle, the all-registration shape). Pinned by `tests/lows-s140.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s139.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-140 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "1977";', 'const UNIT = "1989";')
    text = text.replace('const FILES = "201";', 'const FILES = "202";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 1989/202:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 1989 = 1977 + 12 unit / 202 files")
