#!/usr/bin/env python3
"""Session 86 (S86-F): the delivery-count update — 1047 -> 1076 unit /
143 -> 145 files across every LIVE claim site (transition records and
historical session-log/revision records stay)."""

import re
import sys

FILES = {
    "AGENTS.md": [
        ("| Unit tests (1047 checks) | `bun run test` |",
         "| Unit tests (1076 checks) | `bun run test` |"),
        ("`bun run test` (1047)", "`bun run test` (1076)"),
    ],
    "CLAUDE.md": [
        ("| `bun run test` | Unit tests (1047 checks, Vitest) |",
         "| `bun run test` | Unit tests (1076 checks, Vitest) |"),
        ("(1047 unit / 63 smoke / 262 e2e)",
         "(1076 unit / 63 smoke / 262 e2e)"),
        ("- **Unit Tests** (Vitest, 1047 checks):",
         "- **Unit Tests** (Vitest, 1076 checks):"),
    ],
    "README.md": [
        ("| Unit tests | Vitest | 5 | 1047 checks on the pure domain seams",
         "| Unit tests | Vitest | 5 | 1076 checks on the pure domain seams"),
        ("bun run test              # unit tests — 1047 checks on the pure domain seams",
         "bun run test              # unit tests — 1076 checks on the pure domain seams"),
    ],
    "digma_SKILL.md": [
        ('project_state: "1047 unit checks green',
         'project_state: "1076 unit checks green'),
        ("| Unit tests | Vitest | ≥5.0.1 | 1047 checks; `*.test.ts` only |",
         "| Unit tests | Vitest | ≥5.0.1 | 1076 checks; `*.test.ts` only |"),
        ("bun run test          # 1047/1047",
         "bun run test          # 1076/1076"),
    ],
    "Project_Architecture_Document.md": [
        ("- [ ] `bun run test` → 1047/1047",
         "- [ ] `bun run test` → 1076/1076"),
        ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1047 checks / 143 files) |",
         "| `bun run test` / `bun run test:watch` | repo root | unit tests (1076 checks / 145 files) |"),
    ],
    "tests/server-lows-s81.test.ts": [
        ('const UNIT = "1047";', 'const UNIT = "1076";'),
    ],
    "tests/doc-lows-s84.test.ts": [
        ('const UNIT = "1047";', 'const UNIT = "1076";'),
    ],
}

changed_total = 0
for path, pairs in FILES.items():
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    for old, new in pairs:
        if old in text:
            count = text.count(old)
            text = text.replace(old, new)
            changed_total += count
            print(f"OK   {path}: {count}x  {old[:60]}")
        elif new in text:
            print(f"SKIP {path}: already updated — {new[:60]}")
        else:
            print(f"MISS {path}: {old[:60]}")
            sys.exit(1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)

# The transition-record safety check: no bare live "1047 checks" claim
# survives outside historical transition forms.
for path in FILES:
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    stripped = re.sub(r"\d+ -> \d+", "", text)  # transitions are honest delivery notes
    if "1047 checks" in stripped or "1047/1047" in stripped:
        print(f"WARNING: {path} still carries a live 1047 claim — inspect manually")
print(f"done: {changed_total} replacements")
