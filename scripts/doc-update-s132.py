#!/usr/bin/env python3
"""The session-132 docs update: the count-family re-anchor (1873 = 1857 + 16
unit / 194 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s132.test.ts, the PAD §11 rows for the two edited source files,
and the spec-constants re-anchor for the per-session count-honesty family.

Frozen historical rows (the session-131 bullets, the v1.110.0 header's own
record, the worklog's delivery records) are NEVER touched — the F106
live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s132.py
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
    ("| Unit tests (1857 checks) | `bun run test` |",
     "| Unit tests (1873 checks) | `bun run test` |"),
    ("`bun run test` (1857) → `bun run build`",
     "`bun run test` (1873) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (1857 checks, Vitest) |",
     "| `bun run test` | Unit tests (1873 checks, Vitest) |"),
    ("`bun run test:e2e` (1857 unit / 73 smoke / 262 e2e).",
     "`bun run test:e2e` (1873 unit / 73 smoke / 262 e2e)."),
    ("- **Unit Tests** (Vitest, 1857 checks):",
     "- **Unit Tests** (Vitest, 1873 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 1857 checks",
     "| Unit tests | Vitest | 5 | 1873 checks"),
    ("bun run test              # unit tests — 1857 checks",
     "bun run test              # unit tests — 1873 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "1857 unit checks green',
     'project_state: "1873 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 1857 checks; `*.test.ts` only |",
     "| Unit tests | Vitest | ≥5.0.1 | 1873 checks; `*.test.ts` only |"),
    ("bun run test          # 1857/1857",
     "bun run test          # 1873/1873"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s132 spec + the Unit-total + the two command/checklist
# sites + the §11 rows for the two edited source files (the v1.110.0 header
# line 6 stays FROZEN — it is the prior session's own record)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s131 row and the Unit total
    (
        " | `tests/lows-s131.test.ts` | 18 | tests | Vitest |\n| **Unit total** | **193 files** | **1857** | | Vitest |",
        " | `tests/lows-s131.test.ts` | 18 | tests | Vitest |\n"
        "| Unit — THE MARQUEE LIVE-LIST READ + THE A130-I1 BY-DESIGN REGISTRATION + THE ENV-CENSUS NOTE (the eightieth audit's chosen work: S132-A — the marquee commit reads the LIVE list through the handler's own store capture, never the render-captured subscription: the marquee is the one id-consuming canvas drag that arms no gesture, so the autosave's gesture-deferral never covers it — a markSaved remap landing mid-marquee left a pointerup in the sub-frame window before React's re-render selecting the STALE local ids, a dangling selection (A132-I1); S132-B — the hex TEXT input's arm-less posture registered AT THE SEAM as the DELIBERATE S66-B contract (the deferred queue's head A130-I1 resolved by-design: the standing preservation pin holds the input out of the burst seam as discrete intent, one entry per complete entry; the per-field arm the s130 registration named would violate that prior-spec pin — the collision found at take-up); S132-C — the env-census narrative off-by-one corrected in the worklog's bracketed s132-env-census-note (B132-I1: the live truth 9 distinct app-read env vars / 16 read sites, the frozen records' stale figure named never rewritten); the survival set — the S131 seams (the composed mount, the four layers stand-downs), the S130 seams (the keyTick head, one wheel arm, the finally guard, the pan capture), the S124-B Undo/Redo stand-downs, the s66 preservation contract on the hex text slice, the s132 script provenance anchors (live132/nav132/seo-s132 — the 108th audit, the 109th session, the 69th clip ordinal, the S131 delivery at HEAD 7513c09)) | `tests/lows-s132.test.ts` | 16 | tests | Vitest |\n"
        "| **Unit total** | **194 files** | **1873** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 1857/1857",
     "- [ ] `bun run test` → 1873/1873"),
    # 3. the command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1857 checks / 193 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (1873 checks / 194 files) |"),
    # 4. the §11 canvas row: the count + the S132-A seam description
    (
        "| `src/components/editor/canvas.tsx` | 984 | Pointer events:",
        "| `src/components/editor/canvas.tsx` | 998 | Pointer events:",
    ),
    (
        "a ride-changed net state gets its one coalesced entry) |",
        "a ride-changed net state gets its one coalesced entry) + THE MARQUEE COMMIT'S LIVE-LIST READ (S132-A / A132-I1 — the eightieth audit's Informational: the marquee is the one id-consuming canvas drag that arms no gesture, so the autosave's gesture-deferral never covers it — a markSaved remap landing mid-marquee left a pointerup in the sub-frame window before React's re-render selecting the STALE local ids, a dangling selection self-healing on the next action; the commit now reads the LIVE list at commit time through the handler's own store capture — the getState() form every sibling branch rides) |",
    ),
    # 5. the §11 properties-panel row: the count + the S132-B seam description
    (
        "| `src/components/editor/properties-panel.tsx` | 2252 | Reference five-section layout",
        "| `src/components/editor/properties-panel.tsx` | 2272 | Reference five-section layout",
    ),
    (
        "a stale release early-returns at the token check, the active surface's own terminal the sole ender) |",
        "a stale release early-returns at the token check, the active surface's own terminal the sole ender) + THE A130-I1 BY-DESIGN REGISTRATION (S132-B — the deferred queue's head resolved: the hex TEXT input's arm-less posture registered as the DELIBERATE S66-B contract — the standing preservation pin holds the input out of the burst seam as discrete intent, one history entry per complete entry; the per-field arm the s130 registration named would violate that prior-spec pin; the modality census stands closed with the programmatic/AT residual carried; a commit under any live gesture rides commit=false at both update helpers — the S66-A ride-under, traced) |",
    ),
])

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "1857";', 'const UNIT = "1873";')
    text = text.replace('const FILES = "193";', 'const FILES = "194";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 1873/194:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 1873 = 1857 + 16 unit / 194 files")
