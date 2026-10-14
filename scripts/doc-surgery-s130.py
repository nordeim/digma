#!/usr/bin/env python3
"""S130-B doc surgery (the B130-L3 repair): split the fused F111/F112
line and relocate F113-F116 from after Appendix B into §12.

Content-anchored (no line numbers). Run from the repo root:
  python3 scripts/doc-surgery-s130.py
"""
from pathlib import Path

SKILL = Path("/home/z/my-project/digma/digma_SKILL.md")
text = SKILL.read_text()
lines = text.split("\n")

# --- 1. the F112 newline repair -------------------------------------------
fused_idx = None
for i, ln in enumerate(lines):
    if "112. **F112" in ln and not ln.startswith("112. **F112"):
        fused_idx = i
        break
if fused_idx is None:
    raise SystemExit("FUSED F112 LINE NOT FOUND — already repaired?")
fused = lines[fused_idx]
pos = fused.index("112. **F112")
f111_line = fused[:pos].rstrip()
f112_line = fused[pos:]
lines[fused_idx:fused_idx + 1] = [f111_line, f112_line]
print(f"split line {fused_idx + 1}: F111 ({len(f111_line)} chars) | F112 ({len(f112_line)} chars)")

# --- 2. the F113-F116 relocation ------------------------------------------
# find the F113..F116 block at the file tail (after Appendix B)
appb_idx = next(i for i, ln in enumerate(lines) if ln.startswith("## Appendix B"))
block_start = None
for i in range(appb_idx, len(lines)):
    if lines[i].startswith("113. **F113"):
        block_start = i
        break
if block_start is None:
    raise SystemExit("F113 BLOCK NOT FOUND after Appendix B — already relocated?")
# collect the four lesson lines (a blank may sit between F115 and F116)
prefixes = ("113. **F113", "114. **F114", "115. **F115", "116. **F116")
block = [ln for ln in lines[block_start:] if ln.startswith(prefixes)]
if len(block) != 4:
    raise SystemExit(f"UNEXPECTED BLOCK SHAPE: {len(block)} lesson lines")
# the removal window: from block_start through the F116 line
f116_tail_idx = next(
    i for i in range(block_start, len(lines)) if lines[i].startswith("116. **F116")
)
del lines[block_start:f116_tail_idx + 1]
# collapse any doubled blanks the removal may have left at the tail
while len(lines) >= 2 and lines[-1] == "" and lines[-2] == "":
    lines.pop()
# insert after the F112 line (find it again — indexes shifted)
f112_idx = next(i for i, ln in enumerate(lines) if ln.startswith("112. **F112"))
lines[f112_idx + 1:f112_idx + 1] = block
print(f"relocated {len(block)} lesson lines (F113-F116) into §12 after F112 (line {f112_idx + 2})")

# --- 3. sanity: §13 header directly follows the lessons block --------------
s13_idx = next(i for i, ln in enumerate(lines) if ln.startswith("## §13 Pitfalls to Avoid"))
f116_idx = next(i for i, ln in enumerate(lines) if ln.startswith("116. **F116"))
if not (f116_idx < s13_idx):
    raise SystemExit("SANITY FAILED: F116 not before §13")
appb_idx2 = next(i for i, ln in enumerate(lines) if ln.startswith("## Appendix B"))
if not (f116_idx < appb_idx2):
    raise SystemExit("SANITY FAILED: F116 not before Appendix B")
print(f"sanity OK: F116 at line {f116_idx + 1}, §13 at {s13_idx + 1}, Appendix B at {appb_idx2 + 1}")

SKILL.write_text("\n".join(lines))
print("written.")
