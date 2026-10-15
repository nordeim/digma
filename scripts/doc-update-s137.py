#!/usr/bin/env python3
"""The session-137 docs update: the count-family re-anchor (1955 = 1944 + 11
unit / 199 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s137.test.ts, the AGENTS session-137 bullet (the LIVE ANCHOR
family's carry), and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-136 bullet's own count record, the
v1.115.0 header's record, the worklog's delivery records) are NEVER touched
— the F106 live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s137.py
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
    ("| Unit tests (1944 checks) | `bun run test` |",
     "| Unit tests (1955 checks) | `bun run test` |"),
    ("`bun run test` (1944) → `bun run build`",
     "`bun run test` (1955) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (1944 checks, Vitest) |",
     "| `bun run test` | Unit tests (1955 checks, Vitest) |"),
    ("(1944 unit / 73 smoke / 262 e2e).",
     "(1955 unit / 73 smoke / 262 e2e)."),
    ("- **Unit Tests** (Vitest, 1944 checks):",
     "- **Unit Tests** (Vitest, 1955 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("Vitest | 5 | 1944 checks",
     "Vitest | 5 | 1955 checks"),
    ("# unit tests — 1944 checks",
     "# unit tests — 1955 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "1944 unit checks green',
     'project_state: "1955 unit checks green'),
    ("≥5.0.1 | 1944 checks; `*.test.ts` only |",
     "≥5.0.1 | 1955 checks; `*.test.ts` only |"),
    ("bun run test          # 1944/1944",
     "bun run test          # 1955/1955"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s137 spec + the Unit-total + the checklist + the
# §9.2 command-table count (the v1.115.0 header line stays FROZEN — it is
# the prior session's own record)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s136 row and the Unit total
    (
        "the flush census staying 3 + the draw block's S119-B tokens) | `tests/lows-s136.test.ts` | 16 | tests | Vitest |\n| **Unit total** | **198 files** | **1944** | | Vitest |",
        "the flush census staying 3 + the draw block's S119-B tokens) | `tests/lows-s136.test.ts` | 16 | tests | Vitest |\n"
        "| Unit — THE ENUMERATION-REPAIR/CENSUS-REGISTRATION PASS (the eighty-fifth audit's chosen work: S137-A — the S136-C enumeration-truth repair (A137-I1, the FIX form: the registration's membership list corrected — the five true wrapper consumers (PositionSize/CornerRadius/Text/Transform/Opacity) named, FillStrokeSection registered as the direct-seam rider through its sub-panels (HexColorRow/GradientPanel/ImagePanel), never the wrapper; the churn-immunity substance preserved token-for-token; the patchDiffers call-site census staying 11; the lows-s136 S136-C window widened 1500→2000, the documented spec-window repair); S137-B — the buildElementRow census registration (B137-I1: the frozen s136 record's \"24 fields\" figure off-by-one against the live 25 — one-to-one with DesignElement's 25 writable domain columns, stale since S113-D's fillImageThumb; the count-truth class recurring inside an audit census line itself; the frozen record never rewritten, the live truth pinned); the survival set — the five-consumer membership truth at the seams (each section's wrapper wiring + FillStroke's sub-panel composition + the sub-panels' own seam calls), the S136-A/B/C/D registrations verbatim, the patchDiffers census 11 + the flush census 3, the §11 38-data-row truth, the s137 script provenance anchors (live137/nav137/seo-s137 — the 113th audit, the 114th session, the 74th clip ordinal, the S136 delivery at HEAD 2dbf341)) | `tests/lows-s137.test.ts` | 11 | tests | Vitest |\n"
        "| **Unit total** | **199 files** | **1955** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 1944/1944",
     "- [ ] `bun run test` → 1955/1955"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1944 checks / 198 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (1955 checks / 199 files) |"),
])

# --- the AGENTS session-137 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The enumeration-repair/census-registration seams (session 137, S137-A..S137-C — the eighty-fifth Mode C audit's chosen work):** (a) THE PERIMETER'S ENUMERATION-TRUTH REPAIR (S137-A / A137-I1 — the audit's one Informational, the FIX form): the S136-C registration's membership list over-listed FillStroke as a guardedUpdate consumer (born in the S136 GREEN-phase rewording onto \"the patchDiffers seam\") — the five true wrapper consumers are PositionSize/CornerRadius/Text/Transform/Opacity; FillStrokeSection rides the SAME value-based seam DIRECTLY through its sub-panels (HexColorRow/GradientPanel/ImagePanel), never the wrapper; the functional perimeter claim (value-based, churn-immune through markSaved's every-save id remap) held for all six sections — only the membership phrase was wrong (the B135-I1/B136-I2 count-truth class at its one-member enumeration shape); the repair names the five consumers + the direct-seam rider, the membership pinned at every seam; the lows-s136 S136-C window widened 1500→2000 (the documented spec-window repair, the s134/s135/s136 precedent); (b) THE buildElementRow CENSUS REGISTRATION (S137-B / B137-I1): the frozen s136-audit-B record's \"24 fields\" figure is off-by-one — the row-builder carries exactly 25 fields, one-to-one with DesignElement's 25 writable domain columns (stale since session 113's S113-D added fillImageThumb; the count-truth class recurring inside an audit census line itself — the sweeps verified the one-to-one membership, never the count); the frozen record never rewritten; the corrected figure registered in the worklog's bracketed s137-buildElementRow-census-note; the live truth PINNED by the spec's survival pins (the return-type field count = 25, the schema's writable column count = 25, the name sets identical); (c) the per-session pin family (tests/lows-s137.test.ts — 11 pins: 1 RED / 10 survival; the three s137 script derivations 22/66/6) and the collateral family (the PAD §11 row properties-panel 2349→2354 with the enriched S137 seam description; the count family 1955 = 1944 + 11 unit / 199 files). Pinned by `tests/lows-s137.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s136.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-137 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "1944";', 'const UNIT = "1955";')
    text = text.replace('const FILES = "198";', 'const FILES = "199";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 1955/199:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 1955 = 1944 + 11 unit / 199 files")
