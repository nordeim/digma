#!/usr/bin/env python3
"""The s162 capture census: fresh vs byte-identical vs outside-window
residue (the honest form — the S156 convention)."""
import re
import subprocess
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# The capture script's shot window (every shot() call's filename, joined
# to the script's OUT=docs/screenshots base).
cap = (ROOT / "scripts" / "capture-session163.sh").read_text()
names = re.findall(r"shot ([a-zA-Z0-9_/.-]+\.png)", cap)
window = {f"docs/screenshots/{n}" for n in names}

# The git-modified set (unstaged).
out = subprocess.run(
    ["git", "diff", "--name-only"], cwd=ROOT, capture_output=True, text=True
).stdout.splitlines()
modified = set(out)

# The fresh shots: modified AND in the window.
fresh = modified & window
# Outside-window residue: modified screenshots NOT in the capture window.
residue = {m for m in modified if m.startswith("docs/screenshots/") and m not in window}

print(f"capture window: {len(window)} shots")
print(f"fresh (bytes differ): {len(fresh)}")
print(f"byte-identical (re-taken, no diff): {len(window) - len(fresh)}")
print(f"outside-window residue: {len(residue)}")
if residue:
    for r in sorted(residue):
        print(f"  RESIDUE: {r}")
    raise SystemExit(1)
print("ZERO outside-window residue — the census clean")
