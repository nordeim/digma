#!/usr/bin/env python3
"""Session 86 (S86-C / B86-L2): refresh the PAD §11 key-files line counts.

The live-derived §11 pin (tests/doc-lows-s86.test.ts) found SIX stale rows
(the five audited + auth.spec.ts). This script refreshes each row's count
to the file's actual line count (wc -l semantics: newline-terminated lines).
"""
import sys

PAD = "Project_Architecture_Document.md"

# file -> stale claimed count (for verification that we're replacing what we think)
rows = {
    "src/components/editor/editor-store.ts": ("483", 494),
    "src/components/editor/editor-view.tsx": ("1870", 1969),
    "src/components/editor/properties-panel.tsx": ("1528", 1562),
    "src/components/editor/ai-assistant.tsx": ("586", 603),
    "src/lib/editor.ts": ("915", 948),
    "src/components/dashboard-view.tsx": ("415", 420),
    "tests/e2e/auth.spec.ts": ("343", 361),
}

with open(PAD, "r", encoding="utf-8") as f:
    text = f.read()

changed = 0
for path, (stale, actual) in rows.items():
    old = f"| `{path}` | {stale} |"
    new = f"| `{path}` | {actual} |"
    if old in text:
        text = text.replace(old, new)
        changed += 1
        print(f"OK   {path}: {stale} -> {actual}")
    elif new in text:
        print(f"SKIP {path}: already {actual}")
    else:
        print(f"MISS {path}: neither {stale} nor {actual} found")
        sys.exit(1)

with open(PAD, "w", encoding="utf-8") as f:
    f.write(text)
print(f"done: {changed} rows refreshed")
