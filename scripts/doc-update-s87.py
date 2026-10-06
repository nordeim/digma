#!/usr/bin/env python3
"""Session 87 — the S87-F doc-count sweep + the PAD §7.1 rows.

The delivery counts: 1076 -> 1098 unit / 145 -> 147 files (the two new
spec files: editor-lows-s87 16 tests + doc-lows-s87 6 tests = 22 pins).
The sweep covers every live claim site (AGENTS / CLAUDE / README /
digma_SKILL / PAD), the PAD §7.1 rows for the new spec files, and the
stale test TITLES in doc-lows-s84 + server-lows-s81 (re-anchored onto
the live constants, the S86-C discipline).
"""
import re
import sys

ROOT = "/home/z/my-project/digma/"

UNIT_OLD, UNIT_NEW = "1076", "1098"
FILES_OLD, FILES_NEW = "145", "147"


def sweep(path, extra=None):
    with open(ROOT + path, encoding="utf-8") as f:
        text = f.read()
    before = text
    # The unit-count sites (1076 -> 1098). The historical records
    # (revision blocks, changelogs, lesson logs) keep their numbers —
    # only the CURRENT-STATE claims swap. The forms: "(1076 checks)",
    # "(1076)", "1076/1076", "unit 1076", "1076 unit".
    text = text.replace(f"Unit tests ({UNIT_OLD} checks)", f"Unit tests ({UNIT_NEW} checks)")
    text = text.replace(f"`bun run test` ({UNIT_OLD})", f"`bun run test` ({UNIT_NEW})")
    text = text.replace(f"{UNIT_OLD}/{UNIT_OLD}", f"{UNIT_NEW}/{UNIT_NEW}")
    text = text.replace(f"unit {UNIT_OLD}", f"unit {UNIT_NEW}")
    text = text.replace(f"{UNIT_OLD} unit", f"{UNIT_NEW} unit")
    text = text.replace(f"({UNIT_OLD} checks / {FILES_OLD} files)", f"({UNIT_NEW} checks / {FILES_NEW} files)")
    text = text.replace(f"**{FILES_OLD} files** | **{UNIT_OLD}**", f"**{FILES_NEW} files** | **{UNIT_NEW}**")
    text = text.replace(f"{FILES_OLD} files", f"{FILES_NEW} files")
    text = text.replace(f"across {FILES_OLD}", f"across {FILES_NEW}")
    if extra:
        text = extra(text)
    if text != before:
        with open(ROOT + path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"{path}: updated")
    else:
        print(f"{path}: no changes (check manually)")


def pad_rows(text):
    # The §7.1 rows for the two new spec files (before the Unit total row).
    row = (
        "| Unit — the skip-branch transport registration + the canvas gesture clamps + the draft resync (S87-A/B/C) | `tests/editor-lows-s87.test.ts` | 16 | tests | Vitest |\n"
        "| Unit — the live-derived ai-bucket send count + the seven-call twin pins (S87-D) | `tests/doc-lows-s87.test.ts` | 6 | tests | Vitest |\n"
    )
    anchor = "| **Unit total** |"
    if "editor-lows-s87" in text:
        print("  PAD §7.1 rows already present")
        return text
    idx = text.index(anchor)
    return text[:idx] + row + text[idx:]


def titles_s84(text):
    # doc-lows-s84's describe title carries the S86-era counts.
    return text.replace("1076/145/262", "1098/147/262").replace("1076 unit", "1098 unit")


def titles_s81(text):
    # server-lows-s81's titles/constants — the live form stays dynamic;
    # any literal 1076/145 title re-anchors.
    return text.replace("1076/145", "1098/147").replace("1076 unit / 145", "1098 unit / 147")


sweep("AGENTS.md")
sweep("CLAUDE.md")
sweep("README.md")
sweep("digma_SKILL.md")
sweep("Project_Architecture_Document.md", extra=pad_rows)
sweep("tests/doc-lows-s84.test.ts", extra=titles_s84)
sweep("tests/server-lows-s81.test.ts", extra=titles_s81)
print("done")
