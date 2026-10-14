#!/usr/bin/env python3
"""The session-131 docs update: the count-family re-anchor (1857 = 1839 + 18
unit / 193 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s131.test.ts, and the spec-constants re-anchor for the
per-session count-honesty family.

Frozen historical rows (the session-130 bullets, the v1.109.0 header's own
record, the worklog's delivery records) are NEVER touched — the F106
live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s131.py
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
    ("| Unit tests (1839 checks) | `bun run test` |",
     "| Unit tests (1857 checks) | `bun run test` |"),
    ("`bun run test` (1839) → `bun run build`",
     "`bun run test` (1857) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (1839 checks, Vitest) |",
     "| `bun run test` | Unit tests (1857 checks, Vitest) |"),
    ("- **Unit Tests** (Vitest, 1839 checks):",
     "- **Unit Tests** (Vitest, 1857 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 1839 checks",
     "| Unit tests | Vitest | 5 | 1857 checks"),
    ("bun run test              # unit tests — 1839 checks",
     "bun run test              # unit tests — 1857 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "1839 unit checks green',
     'project_state: "1857 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 1839 checks; `*.test.ts` only |",
     "| Unit tests | Vitest | ≥5.0.1 | 1857 checks; `*.test.ts` only |"),
    ("bun run test          # 1839/1839",
     "bun run test          # 1857/1857"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s131 spec + the Unit-total + the two command/checklist
# sites (the v1.109.0 header line 6 stays FROZEN — it is the prior session's
# own record)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s130 row and the Unit total
    (
        " | `tests/lows-s130.test.ts` | 19 | tests | Vitest |\n| **Unit total** | **192 files** | **1839** | | Vitest |",
        " | `tests/lows-s130.test.ts` | 19 | tests | Vitest |\n"
        "| Unit — THE PRESENT OVERLAY'S SWAP-WINDOW UNMOUNT + THE LAYERS ARMS' STAND-DOWN + THE DOC-CENSUS PAIR (the seventy-ninth audit's chosen work: S131-A — the overlay's mount composed with the load gate, the S121-A family's last arm: an already-open presentation unmounts through a same-route swap GET window instead of painting the outgoing board, remounting on the incoming board when the window clears, the failure path settling on the Untitled fallback (A131-I1); S131-B — the layers-panel pointer arms' gesture stand-down at the eye/lock/trash buttons and the DnD drop, the S124-B form, the deferred queue's head A125-I1 closed (the keyboard Delete twin's registered asymmetry resolved, the armed-burst coverage the A125-I2 safe direction, the HTML5 layers drag arming no gesture so the drop's guard is never self-blocking); S131-C — the §7.1 combined-row retirement (B131-I1: the two session-63 combined summary rows retired, the per-file retroactive rows the enumeration, a mechanical row-sum had read 8 over the Unit total); S131-D — the §4.1 mermaid era-label repair (B131-I2: the pre-S41 illustrative snapshot named accurately); S131-E — the worklog audit-lineage reconstruction note (B131-I3); the survival set — the S121-A trigger gate, the S124-B Undo/Redo stand-downs, the S130 seams (one wheel arm, the finally guard, the pan capture), the s131 script provenance anchors (live131/nav131/seo-s131 — the 107th audit, the 108th session, the 68th clip ordinal, the S130 delivery at HEAD c36cdf3)) | `tests/lows-s131.test.ts` | 18 | tests | Vitest |\n"
        "| **Unit total** | **193 files** | **1857** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 1839/1839",
     "- [ ] `bun run test` → 1857/1857"),
    # 3. the command table row
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1839 checks / 192 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (1857 checks / 193 files) |"),
])

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "1839";', 'const UNIT = "1857";')
    text = text.replace('const FILES = "192";', 'const FILES = "193";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 1857/193:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 1857 = 1839 + 18 unit / 193 files")
