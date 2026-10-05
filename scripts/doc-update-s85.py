#!/usr/bin/env python3
"""Session 85 (S85-F) — the doctrine count update: 1024 -> 1047 unit /
141 -> 143 files / 260 -> 262 e2e (39 -> 40 spec files). The LIVE claim
sites only — historical records (session logs, revision blocks, seam
bullets' transition notes) keep their own time's counts per doctrine."""
import re
import sys

REPLACEMENTS = [
    # (path, old, new, expected_count) — expected_count guards the family
    # grep (every replacement must fire exactly the expected number of
    # times; a mismatch aborts BEFORE writing).
]

def patch(path, pairs):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    for old, new, expected in pairs:
        n = text.count(old)
        if n != expected:
            print(f"ABORT: {path}: {old!r} found {n}x (expected {expected})")
            sys.exit(1)
        text = text.replace(old, new)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"patched {path}: {len(pairs)} site families")

# AGENTS.md already patched in the first run — skip if done
text = open("AGENTS.md", encoding="utf-8").read()
if "(1047)" not in text:
    patch("AGENTS.md", [
        ("| Unit tests (1024 checks) | `bun run test` |", "| Unit tests (1047 checks) | `bun run test` |", 1),
        ("| Browser E2E (260 checks; needs a build) | `bun run test:e2e` |", "| Browser E2E (262 checks; needs a build) | `bun run test:e2e` |", 1),
        ("`bun run test` (1024) → `bun run build`", "`bun run test` (1047) → `bun run build`", 1),
        ("(260 Playwright checks — boots the standalone server on :3100", "(262 Playwright checks — boots the standalone server on :3100", 1),
    ])

# CLAUDE.md — commands table, gate order, pyramid bullets
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (1024 checks, Vitest) |", "| `bun run test` | Unit tests (1047 checks, Vitest) |", 1),
    ("(1024 unit / 63 smoke / 260 e2e).", "(1047 unit / 63 smoke / 262 e2e).", 1),
    ("- **Unit Tests** (Vitest, 1024 checks):", "- **Unit Tests** (Vitest, 1047 checks):", 1),
    ("| `bun run test:e2e` | Browser EE (260 Playwright checks;", "| `bun run test:e2e` | Browser EE (262 Playwright checks;", 1),
    ("- **E2E Tests** (Playwright, 260 checks):", "- **E2E Tests** (Playwright, 262 checks):", 1),
])

# README.md — tech-stack rows + quick-start comments
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 1024 checks on the pure domain seams", "| Unit tests | Vitest | 5 | 1047 checks on the pure domain seams", 1),
    ("bun run test              # unit tests — 1024 checks on the pure domain seams", "bun run test              # unit tests — 1047 checks on the pure domain seams", 1),
    ("| E2E tests | Playwright | 1.63 | 260 browser checks", "| E2E tests | Playwright | 1.63 | 262 browser checks", 1),
    ("bun run test:e2e          # Playwright — 260 browser checks", "bun run test:e2e          # Playwright — 262 browser checks", 1),
])

# digma_SKILL.md — project_state + tool table + quick-start
patch("digma_SKILL.md", [
    ('project_state: "1024 unit checks green · 260 Playwright checks green', 'project_state: "1047 unit checks green · 262 Playwright checks green', 1),
    ("| Unit tests | Vitest | ≥5.0.1 | 1024 checks;", "| Unit tests | Vitest | ≥5.0.1 | 1047 checks;", 1),
    ("| E2E tests | Playwright | ≥1.63.0 | 260 checks;", "| E2E tests | Playwright | ≥1.63.0 | 262 checks;", 1),
    ("bun run test          # 1024/1024", "bun run test          # 1047/1047", 1),
    ("bun run test:e2e      # 260/260 (39 spec files;", "bun run test:e2e      # 262/262 (40 spec files;", 1),
])

# PAD — the §7.4 checklist + the §11 command table (the LIVE sites; the
# header/revision blocks are historical)
patch("Project_Architecture_Document.md", [
    ("- [ ] `bun run test` → 1024/1024", "- [ ] `bun run test` → 1047/1047", 1),
    ("- [ ] `bun run test:e2e` → 260/260", "- [ ] `bun run test:e2e` → 262/262", 1),
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1024 checks / 141 files) |", "| `bun run test` / `bun run test:watch` | repo root | unit tests (1047 checks / 143 files) |", 1),
])

# DEPLOYMENT.md — the verification command comment
patch("docs/DEPLOYMENT.md", [
    ("bun run test:e2e                              # 260 Playwright checks (local, needs a build)", "bun run test:e2e                              # 262 Playwright checks (local, needs a build)", 1),
])

print("ALL DOCTRINE COUNT SITES PATCHED")
