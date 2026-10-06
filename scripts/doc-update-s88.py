#!/usr/bin/env python3
"""doc-update-s88.py — the session-88 docs count sweep (S88-F).

The F68/F70 discipline: every live claim site updated to the delivered
reality — 1098 -> 1112 unit / 147 -> 149 files — while the HISTORICAL
TRANSITION records ("1076 -> 1098 unit / 145 -> 147 files", the delivery
notes inside the revision blocks and seam bullets) survive untouched
(the S87-D lesson 4: the family grep must exclude TRANSITION records
from the count rewrites).

Targeted replacements only — no blind number sweeps:
  AGENTS.md    :15  | Unit tests (1098 checks) |           -> 1112
  AGENTS.md    :22  `bun run test` (1098)                   -> 1112
  AGENTS.md    :113 trailing "(147 files)."                 -> (149 files).
  CLAUDE.md    :92/:100/:106                                -> 1112
  README.md    :139/:323                                    -> 1112
  digma_SKILL  :6/:71/:242                                  -> 1112
  PAD          :2288 total row (147 files / 1098)           -> 149 / 1112
  PAD          :2347 `bun run test` -> 1098/1098            -> 1112/1112
  PAD          :2411 unit tests (1098 checks / 147 files)   -> 1112 / 149
  PAD §7.1     : doc-lows-s87 row 6 -> 8; + the two s88 rows
  doc-lows-s84 / server-lows-s81 : the UNIT/FILES constants re-anchored
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


def patch(path: str, pairs: list[tuple[str, str]], must: bool = True) -> None:
    p = ROOT / path
    src = p.read_text(encoding="utf-8")
    for old, new in pairs:
        if old not in src:
            if must:
                print(f"MISS: {path}: {old[:70]!r}")
                sys.exit(1)
            continue
        src = src.replace(old, new, 1)
    p.write_text(src, encoding="utf-8")
    print(f"patched {path}")


# ---- AGENTS.md -------------------------------------------------------------
patch(
    "AGENTS.md",
    [
        ("| Unit tests (1098 checks) | `bun run test` |",
         "| Unit tests (1112 checks) | `bun run test` |"),
        ("`bun run typecheck` → `bun run test` (1098)",
         "`bun run typecheck` → `bun run test` (1112)"),
        # The session-87 seam bullet's trailing LIVE file-count claim; the
        # "1076 -> 1098 unit / 145 -> 147 files" TRANSITION record on the
        # same line survives (a different substring).
        ("across every live claim site (147 files).",
         "across every live claim site (149 files)."),
    ],
)

# ---- CLAUDE.md -------------------------------------------------------------
patch(
    "CLAUDE.md",
    [
        ("| `bun run test` | Unit tests (1098 checks, Vitest) |",
         "| `bun run test` | Unit tests (1112 checks, Vitest) |"),
        ("(1098 unit / 63 smoke / 262 e2e)",
         "(1112 unit / 63 smoke / 262 e2e)"),
        ("**Unit Tests** (Vitest, 1098 checks)",
         "**Unit Tests** (Vitest, 1112 checks)"),
    ],
)

# ---- README.md -------------------------------------------------------------
patch(
    "README.md",
    [
        ("| Unit tests | Vitest | 5 | 1098 checks",
         "| Unit tests | Vitest | 5 | 1112 checks"),
        ("# unit tests — 1098 checks on the pure domain seams",
         "# unit tests — 1112 checks on the pure domain seams"),
    ],
)

# ---- digma_SKILL.md --------------------------------------------------------
patch(
    "digma_SKILL.md",
    [
        ('project_state: "1098 unit checks green',
         'project_state: "1112 unit checks green'),
        ("| Unit tests | Vitest | ≥5.0.1 | 1098 checks;",
         "| Unit tests | Vitest | ≥5.0.1 | 1112 checks;"),
        ("bun run test          # 1098/1098",
         "bun run test          # 1112/1112"),
    ],
)

# ---- PAD -------------------------------------------------------------------
patch(
    "Project_Architecture_Document.md",
    [
        # The §7.1 total row (the row-sum pin's arithmetic target).
        ("| **Unit total** | **147 files** | **1098** | | Vitest |",
         "| **Unit total** | **149 files** | **1112** | | Vitest |"),
        # The pre-ship checklist row.
        ("- [ ] `bun run test` → 1098/1098",
         "- [ ] `bun run test` → 1112/1112"),
        # The §11 tool-table row.
        ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1098 checks / 147 files) |",
         "| `bun run test` / `bun run test:watch` | repo root | unit tests (1112 checks / 149 files) |"),
        # The doc-lows-s87 row grows by the two S88-B pins (6 -> 8).
        ("| Unit — the live-derived ai-bucket send count + the seven-call twin pins (S87-D) | `tests/doc-lows-s87.test.ts` | 6 | tests | Vitest |",
         "| Unit — the live-derived ai-bucket send count + the seven-call twin pins + the S88-B coverage companion (S87-D/S88-B) | `tests/doc-lows-s87.test.ts` | 8 | tests | Vitest |"),
    ],
)

# The two new §7.1 rows ride directly after the doc-lows-s87 row.
patch(
    "Project_Architecture_Document.md",
    [
        (
            "| Unit — the live-derived ai-bucket send count + the seven-call twin pins + the S88-B coverage companion (S87-D/S88-B) | `tests/doc-lows-s87.test.ts` | 8 | tests | Vitest |\n",
            "| Unit — the live-derived ai-bucket send count + the seven-call twin pins + the S88-B coverage companion (S87-D/S88-B) | `tests/doc-lows-s87.test.ts` | 8 | tests | Vitest |\n"
            "| Unit — the radius-ceiling compose pins (S88-A) | `tests/editor-lows-s88.test.ts` | 7 | tests | Vitest |\n"
            "| Unit — the enumerator-widening + coverage-completeness source pins (S88-B) | `tests/doc-lows-s88.test.ts` | 5 | tests | Vitest |\n",
        ),
    ],
)

# ---- The standing-pin re-anchors -------------------------------------------
patch(
    "tests/doc-lows-s84.test.ts",
    [
        ('const UNIT = "1098";',
         'const UNIT = "1112";'),
        ('const FILES = "147";',
         'const FILES = "149";'),
    ],
)
patch(
    "tests/doc-lows-s84.test.ts",
    [
        (
            "// Session 85 (S85-F): re-anchored to the session-85 delivery counts —",
            "// Session 88 (S88-F): re-anchored to the session-88 delivery counts —\n"
            "// 1112 unit (1098 + editor-lows-s88 7 + doc-lows-s88 5 + doc-lows-s87\n"
            "// +2 — the S88-B coverage/exemption pins) / 149 files (+2) / 63 smoke\n"
            "// (unchanged) / 262 e2e (unchanged); the intents (the docs carry the\n"
            "// DELIVERED counts) unchanged.\n"
            "// Session 85 (S85-F): re-anchored to the session-85 delivery counts —",
        ),
    ],
)
patch(
    "tests/server-lows-s81.test.ts",
    [
        ('const UNIT = "1098";',
         'const UNIT = "1112";'),
        (
            "// Session 87 (S87-F): re-anchored again — 1098 unit / 147 files /",
            "// Session 88 (S88-F): re-anchored again — 1112 unit / 149 files /\n"
            "// 63 smoke (unchanged) / 262 e2e (unchanged — the two new UNIT spec\n"
            "// files: editor-lows-s88 7 + doc-lows-s88 5, plus doc-lows-s87 +2);\n"
            "// the intents unchanged.\n"
            "// Session 87 (S87-F): re-anchored again — 1098 unit / 147 files /",
        ),
    ],
)

print("doc-update-s88 sweep complete")
