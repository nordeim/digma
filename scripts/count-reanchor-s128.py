#!/usr/bin/env python3
"""Session 128 — the count-family re-anchor: 1795 -> 1808 unit /
189 -> 190 files across every live claim site (the F112 sweep-census
doctrine; historical session docs / remediation plans / the worklog
are frozen records and stay).

Run from the repo root:  python3 scripts/count-reanchor-s128.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# (file, old, new) — the exact live claim forms
SITES: list[tuple[str, str, str]] = [
    # --- PAD §7.1 Unit-total + checklist + command table ---
    (
        "Project_Architecture_Document.md",
        "| **Unit total** | **189 files** | **1795** | | Vitest |",
        "| **Unit total** | **190 files** | **1808** | | Vitest |",
    ),
    (
        "Project_Architecture_Document.md",
        "- [ ] `bun run test` → 1795/1795",
        "- [ ] `bun run test` → 1808/1808",
    ),
    (
        "Project_Architecture_Document.md",
        "unit tests (1795 checks / 189 files)",
        "unit tests (1808 checks / 190 files)",
    ),
    # --- AGENTS.md: commands table + gate order ---
    (
        "AGENTS.md",
        "| Unit tests (1795 checks) | `bun run test` |",
        "| Unit tests (1808 checks) | `bun run test` |",
    ),
    (
        "AGENTS.md",
        "`bun run test` (1795)",
        "`bun run test` (1808)",
    ),
    # --- CLAUDE.md: commands table + gate order + the unit-tests bullet ---
    (
        "CLAUDE.md",
        "| `bun run test` | Unit tests (1795 checks, Vitest) |",
        "| `bun run test` | Unit tests (1808 checks, Vitest) |",
    ),
    (
        "CLAUDE.md",
        "(1795 unit / 73 smoke / 262 e2e)",
        "(1808 unit / 73 smoke / 262 e2e)",
    ),
    (
        "CLAUDE.md",
        "- **Unit Tests** (Vitest, 1795 checks):",
        "- **Unit Tests** (Vitest, 1808 checks):",
    ),
    # --- README.md: tech-stack row + the quick-start comment ---
    (
        "README.md",
        "| Unit tests | Vitest | 5 | 1795 checks",
        "| Unit tests | Vitest | 5 | 1808 checks",
    ),
    (
        "README.md",
        "# unit tests — 1795 checks",
        "# unit tests — 1808 checks",
    ),
    # --- digma_SKILL.md: project_state + §2 table + the cheat-sheet ---
    (
        "digma_SKILL.md",
        'project_state: "1795 unit checks green',
        'project_state: "1808 unit checks green',
    ),
    (
        "digma_SKILL.md",
        "| Unit tests | Vitest | ≥5.0.1 | 1795 checks; `*.test.ts` only |",
        "| Unit tests | Vitest | ≥5.0.1 | 1808 checks; `*.test.ts` only |",
    ),
    (
        "digma_SKILL.md",
        "bun run test          # 1795/1795",
        "bun run test          # 1808/1808",
    ),
]

changed = 0
for rel, old, new in SITES:
    p = ROOT / rel
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"MISSING ANCHOR in {rel}: {old[:70]!r}")
    p.write_text(text.replace(old, new))
    changed += 1

# --- the per-session spec UNIT/FILES constants (the live-derivation
# family: every spec that pins the then-current count against the PAD's
# Unit-total row) ---
unit_specs = [
    "lows-s92", "lows-s94", "lows-s95", "lows-s96", "lows-s97", "lows-s98",
    "lows-s99", "lows-s100", "lows-s101", "lows-s102", "lows-s103",
    "lows-s104", "lows-s105", "lows-s106", "lows-s107", "lows-s108",
    "editor-utilities-s93", "doc-lows-s84", "doc-lows-s91",
    "server-lows-s81",
]
files_specs = [
    "lows-s92", "lows-s94", "lows-s95", "lows-s96", "lows-s97", "lows-s98",
    "lows-s99", "lows-s100", "lows-s101", "lows-s102", "lows-s103",
    "lows-s104", "lows-s105", "lows-s106", "lows-s107", "lows-s108",
    "editor-utilities-s93", "doc-lows-s84", "doc-lows-s91",
]
for name in unit_specs:
    p = ROOT / f"tests/{name}.test.ts"
    text = p.read_text()
    if 'const UNIT = "1795";' not in text:
        raise SystemExit(f"MISSING UNIT constant in {name}")
    p.write_text(text.replace('const UNIT = "1795";', 'const UNIT = "1808";'))
    changed += 1
for name in files_specs:
    p = ROOT / f"tests/{name}.test.ts"
    text = p.read_text()
    if 'const FILES = "189";' not in text:
        raise SystemExit(f"MISSING FILES constant in {name}")
    p.write_text(text.replace('const FILES = "189";', 'const FILES = "190";'))
    changed += 1

print(f"count-family re-anchored: {changed} sites (1808 = 1795 + 13 unit / 190 files)")
