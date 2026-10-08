#!/usr/bin/env python3
"""Session 97 (S97-E) — the docs pass. Mechanical count re-anchors +
the new rows/blocks. Follows the pad-update-s9X.py family convention."""
import re

ROOT = "/home/z/my-project/digma"
NEW_UNIT = "1196"
NEW_FILES = "159"

def sub_file(path, pairs, count_expected=None):
    with open(path, encoding="utf-8") as f:
        s = f.read()
    total = 0
    for old, new in pairs:
        n = s.count(old)
        if n == 0:
            print(f"  !! MISS in {path}: {old[:80]!r}")
            continue
        s = s.replace(old, new)
        total += n
    with open(path, "w", encoding="utf-8") as f:
        f.write(s)
    print(f"  {path}: {total} replacements")

# ---------------------------------------------------------------------------
# 1. The prior-session spec constants (UNIT/FILES + the re-anchor comment)
# ---------------------------------------------------------------------------
for spec in [
    "tests/doc-lows-s84.test.ts",
    "tests/doc-lows-s91.test.ts",
    "tests/server-lows-s81.test.ts",
    "tests/lows-s92.test.ts",
    "tests/editor-utilities-s93.test.ts",
    "tests/lows-s94.test.ts",
    "tests/lows-s95.test.ts",
    "tests/lows-s96.test.ts",
]:
    sub_file(
        f"{ROOT}/{spec}",
        [
            ('const UNIT = "1183";', f'const UNIT = "{NEW_UNIT}";'),
            ('const FILES = "158";', f'const FILES = "{NEW_FILES}";'),
            ('"1183"', f'"{NEW_UNIT}"'),
            ("1183/158", f"{NEW_UNIT}/{NEW_FILES}"),
        ],
    )

# The re-anchor comment rides only the family's head members (the s96
# + s81 + s84 + s91 forms carry the lineage comment block).
for spec in ["tests/lows-s96.test.ts", "tests/server-lows-s81.test.ts",
             "tests/doc-lows-s84.test.ts", "tests/doc-lows-s91.test.ts"]:
    sub_file(
        f"{ROOT}/{spec}",
        [(
            "// Session 96 (S96-E): re-anchored — 1183 unit / 158 files (the s96",
            "// Session 97 (S97-E): re-anchored — 1196 unit / 159 files (the s97\n"
            "// delivery's lows-s97 +13).\n"
            "// Session 96 (S96-E): re-anchored — 1183 unit / 158 files (the s96",
        )] if "// Session 96 (S96-E): re-anchored — 1183 unit / 158 files (the s96" in open(f"{ROOT}/{spec}").read() else [],
    )

# ---------------------------------------------------------------------------
# 2. AGENTS.md — the commands table, the gate-order parenthetical
# ---------------------------------------------------------------------------
sub_file(
    f"{ROOT}/AGENTS.md",
    [
        ("| Unit tests (1183 checks) | `bun run test` |",
         f"| Unit tests ({NEW_UNIT} checks) | `bun run test` |"),
        ("`bun run test` (1183) → `bun run build`",
         f"`bun run test` ({NEW_UNIT}) → `bun run build`"),
    ],
)

# ---------------------------------------------------------------------------
# 3. CLAUDE.md — the three count sites
# ---------------------------------------------------------------------------
sub_file(
    f"{ROOT}/CLAUDE.md",
    [
        ("| `bun run test` | Unit tests (1183 checks, Vitest) |",
         f"| `bun run test` | Unit tests ({NEW_UNIT} checks, Vitest) |"),
        ("(1183 unit / 63 smoke / 262 e2e)",
         f"({NEW_UNIT} unit / 63 smoke / 262 e2e)"),
        ("- **Unit Tests** (Vitest, 1183 checks):",
         f"- **Unit Tests** (Vitest, {NEW_UNIT} checks):"),
    ],
)

# ---------------------------------------------------------------------------
# 4. README.md — the two count sites
# ---------------------------------------------------------------------------
sub_file(
    f"{ROOT}/README.md",
    [
        ("| 1183 checks on the pure domain seams",
         f"| {NEW_UNIT} checks on the pure domain seams"),
        ("bun run test              # unit tests — 1183 checks on the pure domain seams",
         f"bun run test              # unit tests — {NEW_UNIT} checks on the pure domain seams"),
    ],
)

# ---------------------------------------------------------------------------
# 5. digma_SKILL.md — version + project_state + the count sites
# ---------------------------------------------------------------------------
sub_file(
    f"{ROOT}/digma_SKILL.md",
    [
        ("version: 1.74.0", "version: 1.75.0"),
        ('project_state: "1183 unit checks green',
         f'project_state: "{NEW_UNIT} unit checks green'),
        ("| Unit tests | Vitest | ≥5.0.1 | 1183 checks; `*.test.ts` only |",
         f"| Unit tests | Vitest | ≥5.0.1 | {NEW_UNIT} checks; `*.test.ts` only |"),
        ("bun run test          # 1183/1183",
         f"bun run test          # {NEW_UNIT}/{NEW_UNIT}"),
    ],
)

# ---------------------------------------------------------------------------
# 6. PAD — §7.1 rows (the lows-s97 row + Unit-total), §11 rows, the
#    pre-ship checklist, the appendix command table, the title/version
# ---------------------------------------------------------------------------
sub_file(
    f"{ROOT}/Project_Architecture_Document.md",
    [
        # Title + Last-Updated
        ("# Digma — Master Project Architecture Document (PAD) v1.75.0",
         "# Digma — Master Project Architecture Document (PAD) v1.76.0"),
        # §7.1: the new spec row after the lows-s96 row
        ("| Unit — the inline-style token indirection + the ordinal repairs + the provenance-comment pins (S96-A..S96-C) | `tests/lows-s96.test.ts` | 9 | tests | Vitest |",
         "| Unit — the inline-style token indirection + the ordinal repairs + the provenance-comment pins (S96-A..S96-C) | `tests/lows-s96.test.ts` | 9 | tests | Vitest |\n"
         "| Unit — the fallback-white seam + the faithful census + the team-name rejection pins (S97-A..S97-D) | `tests/lows-s97.test.ts` | 13 | tests | Vitest |"),
        # §7.1 Unit-total row
        ("| **Unit total** | **158 files** | **1183** | | Vitest |",
         f"| **Unit total** | **{NEW_FILES} files** | **{NEW_UNIT}** | | Vitest |"),
        # §11: editor.ts + project-card.tsx rows (the S97-edited files)
        ("| `src/lib/editor.ts` | 960 |",
         "| `src/lib/editor.ts` | 978 |"),
        ("| `src/components/project-card.tsx` | 831 |",
         "| `src/components/project-card.tsx` | 832 |"),
        # The pre-ship checklist
        ("- [ ] `bun run test` → 1183/1183",
         f"- [ ] `bun run test` → {NEW_UNIT}/{NEW_UNIT}"),
        # The appendix command table
        ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1183 checks / 158 files) |",
         f"| `bun run test` / `bun run test:watch` | repo root | unit tests ({NEW_UNIT} checks / {NEW_FILES} files) |"),
    ],
)

print("done")
