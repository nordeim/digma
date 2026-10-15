#!/usr/bin/env python3
"""The session-135 docs update: the count-family re-anchor (1928 = 1914 + 14
unit / 197 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s135.test.ts, the AGENTS session-135 bullet (the LIVE ANCHOR
family's carry), and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-134 bullet's own count record, the
v1.113.0 header's record, the worklog's delivery records) are NEVER touched
— the F106 live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s135.py
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
    ("| Unit tests (1914 checks) | `bun run test` |",
     "| Unit tests (1928 checks) | `bun run test` |"),
    ("`bun run test` (1914) → `bun run build`",
     "`bun run test` (1928) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (1914 checks, Vitest) |",
     "| `bun run test` | Unit tests (1928 checks, Vitest) |"),
    ("`bun run test:e2e` (1914 unit / 73 smoke / 262 e2e).",
     "`bun run test:e2e` (1928 unit / 73 smoke / 262 e2e)."),
    ("- **Unit Tests** (Vitest, 1914 checks):",
     "- **Unit Tests** (Vitest, 1928 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 1914 checks",
     "| Unit tests | Vitest | 5 | 1928 checks"),
    ("bun run test              # unit tests — 1914 checks",
     "bun run test              # unit tests — 1928 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "1914 unit checks green',
     'project_state: "1928 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 1914 checks; `*.test.ts` only |",
     "| Unit tests | Vitest | ≥5.0.1 | 1928 checks; `*.test.ts` only |"),
    ("bun run test          # 1914/1914",
     "bun run test          # 1928/1928"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s135 spec + the Unit-total + the checklist + the
# §9.2 command-table count (the v1.113.0 header line stays FROZEN — it is
# the prior session's own record)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s134 row and the Unit total
    (
        "the s134 script provenance anchors (live134/nav134/seo-s134 — the 110th audit, the 111th session, the 71st clip ordinal, the S133 delivery at HEAD c366767)) | `tests/lows-s134.test.ts` | 20 | tests | Vitest |\n| **Unit total** | **196 files** | **1914** | | Vitest |",
        "the s134 script provenance anchors (live134/nav134/seo-s134 — the 110th audit, the 111th session, the 71st clip ordinal, the S133 delivery at HEAD c366767)) | `tests/lows-s134.test.ts` | 20 | tests | Vitest |\n"
        "| Unit — THE VIEWPORT/WOULDCOMMIT REGISTRATIONS + THE CENSUS CORRECTIONS (the eighty-third audit's chosen work: S135-A — the toCanvas viewport member's by-design registration (the RENDER-CONSISTENCY doctrine: the mapper's render-captured pan/zoom read the SAME render-pass values as the board's own DOM transform, so the pointer-to-canvas mapping is always consistent with the viewport the user SEES — the read-direction family's direction INVERTED at this seam, a live store read would map through a transform the DOM has not applied yet; the wheel-mid-drag window registered, self-healing, zero mutation surface); S135-B — the wouldCommit member's by-design registration (the read-direction family's churn-IMMUNE member: selectionWouldCommit compares fill/stroke VALUES through patchDiffers, never ids, so markSaved's every-save id remap provably cannot fire the would-commit divergence; the suppressed-pick floor and the S133-C rationale registered at the MultiSelectionSection seam); S135-C — the Layer-1 census correction (the frozen-records form: the §3.1 brace names 13 Layer-1 modules, the 14th src/lib module is Layer-0 db.ts — the worklog's bracketed s135-layer1-census-note, the frozen v1.109.0/AGENTS session-130 figures never rewritten); S135-D — the worklog lineage note (the B131-I3 form: the 81st/82nd cycles' missing per-auditor entries documented, where the censuses survive); the survival set — the S134-A/B/C seams verbatim, the flush census staying 3 + the draw block's S119-B tokens, the S134-D AI targetIds registration, the PAD §3.1 brace's 13-module truth + the §10 B84-I3 row's both members, the s135 script provenance anchors (live135/nav135/seo-s135 — the 111th audit, the 112th session, the 72nd clip ordinal, the S134 delivery at HEAD a4a68a8)) | `tests/lows-s135.test.ts` | 14 | tests | Vitest |\n"
        "| **Unit total** | **197 files** | **1928** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 1914/1914",
     "- [ ] `bun run test` → 1928/1928"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1914 checks / 196 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (1928 checks / 197 files) |"),
])

# --- the AGENTS session-135 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The viewport/wouldCommit-registrations/census-corrections seams (session 135, S135-A..S135-E — the eighty-third Mode C audit's chosen work):** (a) THE toCanvas VIEWPORT MEMBER'S BY-DESIGN REGISTRATION (S135-A / A135-I1 — the Informational, the read-direction family's VIEWPORT member): toCanvas maps the pointer through the render-captured zoom/panX/panY trio — and the render-captured read is the CORRECT form here, the family's direction INVERTED at this seam (the RENDER-CONSISTENCY doctrine: the board's own DOM transform reads the SAME render-pass values, so the mapping is always consistent with the viewport the user SEES; a live store read would map through a transform the DOM has not applied yet — the drag visibly diverging from the pointer; the one member where the live-read vocabulary must NOT be applied); the censused window (a wheel-pan/ctrl+wheel-zoom between two pointermove ticks of a live drag) self-heals the following render, zero mutation surface; (b) THE wouldCommit MEMBER'S BY-DESIGN REGISTRATION (S135-B / A135-I2 — the Informational, the family's churn-IMMUNE member): MultiSelectionSection's render-derived selected rows close into selectionWouldCommit while the commit target rides the S133-B live read — but the helper compares fill/stroke VALUES (patchDiffers), never ids, so markSaved's every-save id remap provably cannot fire the divergence (only a genuine selection-content change in the sub-frame, the S133-C rationale extending verbatim); the suppressed-pick floor, zero mutation; (c) THE LAYER-1 CENSUS CORRECTION (S135-C / B135-I1 — the frozen-records form): the §3.1 Layer-1 brace names 13 modules (the 14th src/lib module is Layer-0 db.ts); the "14 modules" figure in the v1.109.0 revision entry + the AGENTS session-130 bullet was wrong at birth (it counted all src/lib modules) — the corrected figure registered in the worklog's bracketed s135-layer1-census-note, the frozen records never rewritten, the live truth pinned by the spec's SURVIVAL docs pin; (d) THE WORKLOG LINEAGE NOTE (S135-D / B135-I2 — the B131-I3 form): the 81st/82nd cycles' per-auditor entries never landed — the bracketed s135-lineage-note documents the gap and where the censuses survive (the remediation plans + the lead entries); this cycle's auditor entries resume the convention; (e) the per-session pin family (tests/lows-s135.test.ts — 14 pins: 6 RED / 8 survival; the three s135 script derivations 22/66/6) and the collateral family (the PAD §11 rows canvas 1042→1067, properties-panel 2307→2327 with the enriched S135 seam descriptions; the count family 1928 = 1914 + 14 unit / 197 files). Pinned by `tests/lows-s135.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s134.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-135 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "1914";', 'const UNIT = "1928";')
    text = text.replace('const FILES = "196";', 'const FILES = "197";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 1928/197:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 1928 = 1914 + 14 unit / 197 files")
