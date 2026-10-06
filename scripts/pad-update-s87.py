#!/usr/bin/env python3
"""Session 87 — the PAD §11 line-count row refresh (the S87 source edits).

The row-sum doctrine (S86-C): any file edit forces its §11 row update in
the same commit. The S87 slices touched four files:
  editor-store.ts     494 -> 506  (the moveElements clamp + the import)
  editor-view.tsx    1969 -> 1989 (the skip-branch registration + comment)
  canvas.tsx          776 -> 787  (the draw/resize clamps + the import)
  properties-panel.tsx 1562 -> 1581 (the two extended blur handlers)
"""
import re
import sys

PAD = "/home/z/my-project/digma/Project_Architecture_Document.md"

ROWS = {
    "src/components/editor/editor-store.ts": 506,
    "src/components/editor/editor-view.tsx": 1989,
    "src/components/editor/canvas.tsx": 787,
    "src/components/editor/properties-panel.tsx": 1581,
}

with open(PAD, encoding="utf-8") as f:
    text = f.read()

changed = 0
for file, lines in ROWS.items():
    # The §11 row form: | `file` | NNN | ...
    pattern = re.compile(r"(\| `" + re.escape(file) + r"` \| )(\d+)( \|)")
    m = pattern.search(text)
    if not m:
        print(f"MISS: {file} — row not found")
        sys.exit(1)
    old = int(m.group(2))
    if old != lines:
        text = pattern.sub(r"\g<1>" + str(lines) + r"\g<3>", text, count=1)
        print(f"{file}: {old} -> {lines}")
        changed += 1
    else:
        print(f"{file}: already {lines}")

with open(PAD, "w", encoding="utf-8") as f:
    f.write(text)
print(f"updated {changed} rows")
