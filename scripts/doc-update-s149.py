#!/usr/bin/env python3
"""The session-149 docs update: the count-family re-anchor (2093 = 2085 + 8
unit / 211 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s149.test.ts, the AGENTS session-149 bullet, and the
spec-constants re-anchor for the per-session count-honesty family.

NO §11 line-count re-anchors this cycle (canvas.tsx stays 1075 — the
S149-A citation repair changes no line count; validation stays 336;
teams-view stays 528; the layer total stays 13,895).

Frozen historical rows (the session-146/147/148 bullets' own count
records, the v1.125.0/v1.126.0/v1.127.0 headers' records, the worklog's
delivery records, the PAD's frozen session-history rows — the B145-I1
coincidental-literal collisions) are NEVER touched — the F106
live-claim-sites-only doctrine; every patch anchors by CONTENT (long
unique strings, exactly-one-hit), never by bare figure.

Run from the repo root:  python3 scripts/doc-update-s149.py
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
    ("| Unit tests (2085 checks) | `bun run test` |",
     "| Unit tests (2093 checks) | `bun run test` |"),
    ("`bun run test` (2085) → `bun run build`",
     "`bun run test` (2093) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (2085 checks, Vitest) |",
     "| `bun run test` | Unit tests (2093 checks, Vitest) |"),
    ("(2085 unit / 73 smoke / 262 e2e)",
     "(2093 unit / 73 smoke / 262 e2e)"),
    ("- **Unit Tests** (Vitest, 2085 checks):",
     "- **Unit Tests** (Vitest, 2093 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 2085 checks on the pure domain seams",
     "| Unit tests | Vitest | 5 | 2093 checks on the pure domain seams"),
    ("bun run test              # unit tests — 2085 checks on the pure domain seams",
     "bun run test              # unit tests — 2093 checks on the pure domain seams"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "2085 unit checks green',
     'project_state: "2093 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 2085 checks; `*.test.ts` only |",
     "| Unit tests | Vitest | ≥5.0.1 | 2093 checks; `*.test.ts` only |"),
    ("bun run test          # 2085/2085",
     "bun run test          # 2093/2093"),
])

# --- Project_Architecture_Document.md -----------------------------------------
patch("Project_Architecture_Document.md", [
    ("| **Unit total** | **210 files** | **2085** | | Vitest |",
     "| **Unit total** | **211 files** | **2093** | | Vitest |"),
    ("- [ ] `bun run test` → 2085/2085",
     "- [ ] `bun run test` → 2093/2093"),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (2085 checks / 210 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (2093 checks / 211 files) |"),
])

# --- the §7.1 row for the s149 spec (insert after the s148 row) ---------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

S148_ROW_TAIL = "| `tests/lows-s148.test.ts` | 12 | tests | Vitest |"
S149_ROW = (
    "| Unit — THE CITATION-REPAIR/GLYPH-RE-ANCHOR/SWEEP-COMPLETION "
    "REGISTRATION PASS (the ninety-seventh audit's chosen work, the "
    "all-registration-plus-one-comment-token cycle after S148's "
    "source-carrying pass: S149-A — the S148-B comment's born-drifted "
    "citation repaired in place (A149-I1 + the lead-side extension: "
    "canvas.tsx's registration comment cited \"the :505 commit below\" "
    "while the commit's two-term gate lives at :503 AND sits ABOVE the "
    "comment — both the coordinate and the directional word born-"
    "drifted at delivery; the two-token repair, zero line-count drift, "
    "the live-comment convention: a live comment is not a frozen "
    "record); S149-B — the glyph-note re-anchor registration (A149-I2: "
    "the frozen s147-glyph-coordinates-note's teams-view citations "
    "drifted +9 under S148-C's own comment insertion — the Users "
    "member :220→:229, its aria-hidden parent :218→:227, the sibling "
    ":282→:291, the UserPlus :288→:297; the F134 enumeration-survival "
    "class recurring ACROSS cycles — any later cycle's edit inserting "
    "lines above a frozen census's coordinates arms the next cycle's "
    "re-anchor duty; ONE new bracketed note at content form, the "
    "frozen record never rewritten); S149-C — the fixed-sleep-note "
    "completion registration (B149-I1 the coordinate re-anchor — the "
    "s146 note's \"session77:83\" captured on the pre-S146-A tree, "
    "the poll repair's own insertion shifting the 400ms compositor "
    "settle to :101 where it has stood since 3cf1742, the current :83 "
    "a goto line; B149-I2 the spelling-dimension enumeration "
    "completion — two same-class class-b route-delay injections ride "
    "promise-wrapped new Promise setTimeout forms inside page.route "
    "handlers (session58:280 the 400ms DELETE delay, parity:721 the "
    "700ms teams delay), invisible to the waitForTimeout-scoped grep; "
    "the honest class total 21 across 13 files); S149-D the "
    "per-session pin family (8 pins: 4 RED / 4 survival — the "
    "citation-repair pin, the two note pins, the prior-registrations "
    "survival pin, the audit-entries survival pin (the auditors' "
    "entries landed live during the audit phase — the honest "
    "survival classification), the script-provenance survival pin, "
    "the docs re-anchor pin, the pair-unity forms riding the "
    "constants born rolling-safe) and the collateral family (the "
    "count-family re-anchor 2093 = 2085 + 8 unit / 211 files; ZERO "
    "§11 line-count re-anchors — no source line-count drift this "
    "cycle; the layer total stays 13,895) | "
    "`tests/lows-s149.test.ts` | 8 | tests | Vitest |"
)
if S149_ROW in text:
    print("PAD: s149 §7.1 row already present (idempotent skip)")
else:
    assert text.count(S148_ROW_TAIL) >= 1, "s148 §7.1 row tail anchor missing"
    # the s148 row is a long row; insert the s149 row right AFTER its line
    lines = text.split("\n")
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.endswith(S148_ROW_TAIL):
            out.append(S149_ROW)
            inserted = True
    assert inserted, "s148 §7.1 row not found as a full line tail"
    pad.write_text("\n".join(out))
    print("PAD: §7.1 row for tests/lows-s149.test.ts inserted after the s148 row")

# --- the AGENTS session-149 bullet (insert after the session-148 bullet) -------
agents = ROOT / "AGENTS.md"
atext = agents.read_text()
BULLET = (
    "- **The citation-repair/glyph-re-anchor/sweep-completion seams "
    "(session 149, S149-A..S149-D — the ninety-seventh Mode C audit's "
    "chosen work, the all-registration-plus-one-comment-token cycle "
    "after S148's source-carrying pass):** (a) THE S148-B COMMENT'S "
    "BORN-DRIFTED CITATION (S149-A / A149-I1 + the lead-side "
    "extension): canvas.tsx's S148-B registration comment cited \"the "
    ":505 commit below\" while the commit's two-term gate "
    "(drag.w > 2 && drag.h > 2) lives at :503 AND sits ABOVE the "
    "comment in the file (the pointer-up handler precedes the render "
    "JSX) — BOTH the coordinate and the directional word born-drifted "
    "at delivery (the plan and the spec both said :503; the in-code "
    "token was never re-derived after the edit's own insertion math); "
    "the two-token in-place repair (a live comment is not a frozen "
    "record), zero line-count drift; the doctrine (F136 — the "
    "born-verified-citation member): a live comment's coordinate "
    "citation is itself a live claim — the coordinate AND its "
    "directional word verified against the delivered tree at birth, "
    "never quoted from a plan drafted before the edit's own insertion "
    "math; (b) THE GLYPH-NOTE RE-ANCHOR (S149-B / A149-I2): the "
    "frozen s147-glyph-coordinates-note's teams-view citations "
    "(:220/:218/:282/:288) drifted +9 under S148-C's own comment "
    "insertion (the Users member :229, its aria-hidden parent :227, "
    "the sibling :291, the UserPlus :297; the :104/:147 members "
    "unchanged above the insertion) — the F134 enumeration-survival "
    "class recurring ACROSS cycles: any later cycle's edit that "
    "inserts lines above a frozen census's coordinates arms the next "
    "cycle's re-anchor duty; ONE new bracketed worklog note "
    "(s149-glyph-reanchor-note) at CONTENT FORM, the frozen record "
    "never rewritten (S132-C); (c) THE FIXED-SLEEP-NOTE COMPLETION "
    "(S149-C / B149-I1 + B149-I2): the s146-fixed-sleep-note's "
    "compositor member re-anchored from \"session77:83\" (captured on "
    "the pre-S146-A tree; the current :83 is a goto line) onto the "
    "live :101 at content form (the 400ms settle before the 44px "
    "boundingBox measure — where it has stood since 3cf1742, observed "
    "but never registered by the s148 audit), AND the spelling-"
    "dimension enumeration completed — two same-class class-b route-"
    "delay injections ride promise-wrapped new Promise setTimeout "
    "forms inside page.route handlers (session58:280 the 400ms DELETE "
    "delay, parity:721 the 700ms teams delay), invisible to the "
    "waitForTimeout-scoped sweep; the honest class total 21 across 13 "
    "files; the doctrine (F136 — the spelling-scope member): a class "
    "sweep enumerates the CLASS, never one spelling of it — the "
    "sanctioned spellings of a settle/injection class include "
    "waitForTimeout AND promise-wrapped setTimeout, so the sweep greps "
    "every sanctioned spelling or names the spelling scope beside the "
    "count; (d) the per-session pin family (tests/lows-s149.test.ts "
    "— 8 pins: 4 RED / 4 survival; the audit-entries pin the honest "
    "survival classification — the auditors' entries landed live "
    "during the audit phase, before the spec's birth) and the "
    "collateral family (the count family 2093 = 2085 + 8 unit / 211 "
    "files; ZERO §11 line-count re-anchors — the layer total stays "
    "13,895; e2e stays 262; smoke stays 73). Pinned by "
    "`tests/lows-s149.test.ts`."
)
if BULLET in atext:
    print("AGENTS: session-149 bullet already present (idempotent skip)")
else:
    anchor = "Pinned by `tests/lows-s148.test.ts`."
    assert atext.count(anchor) == 1, "AGENTS s148 bullet tail anchor missing"
    atext = atext.replace(anchor, anchor + "\n" + BULLET, 1)
    agents.write_text(atext)
    print("AGENTS: session-149 bullet inserted after the session-148 bullet")

# --- the spec-constants re-anchor (the per-session count-honesty family) -------
unit_files = 0
files_files = 0
for spec in sorted((ROOT / "tests").glob("*.test.ts")):
    text = spec.read_text()
    changed = False
    if 'const UNIT = "2085";' in text:
        assert text.count('const UNIT = "2085";') == 1
        text = text.replace('const UNIT = "2085";', 'const UNIT = "2093";')
        unit_files += 1
        changed = True
    if 'const FILES = "210";' in text:
        assert text.count('const FILES = "210";') == 1
        text = text.replace('const FILES = "210";', 'const FILES = "211";')
        files_files += 1
        changed = True
    if changed:
        spec.write_text(text)
print(f"spec constants re-anchored: UNIT in {unit_files} files, FILES in {files_files} files")
