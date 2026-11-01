#!/usr/bin/env python3
"""S198 dispatch-figure derivation, part 2 — live at this tree (F125/F140-C/
F163/F183 doctrine: every figure re-derived at dispatch, never quoted).

Covers: the pinned-constants form (UNIT/FILES), the encodeURIComponent
census, the src/lib census, requireSession, readBoundedJson, the ceilings.
"""
from pathlib import Path
import re
import subprocess

ROOT = Path("/home/z/my-project/digma")

tests = sorted((ROOT / "tests").glob("*.test.ts")) + sorted(
    (ROOT / "src" / "lib").glob("*.test.ts")
)
unit_pins = files_pins = 0
stale = []
for p in tests:
    t = p.read_text()
    if re.search(r'"2721"', t):
        unit_pins += 1
    if re.search(r'"259"', t):
        files_pins += 1
    for m in re.findall(r'"(2[4-7]\d\d)"', t):
        if m not in ("2721",):
            stale.append((p.name, m))
print(f"PINNED CONSTANTS: {unit_pins} UNIT + {files_pins} FILES")
print(f"STALE (non-2721 2xxx literals): {sorted(set(stale)) if stale else 'none'}")

# encodeURIComponent census (layer six files vs src-wide)
layer_six = [
    ROOT / "src/components/editor/ai-assistant.tsx",
    ROOT / "src/components/editor/editor-view.tsx",
    ROOT / "src/components/editor/properties-panel.tsx",
    ROOT / "src/components/editor/canvas.tsx",
    ROOT / "src/components/project-card.tsx",
    ROOT / "src/components/recent-view.tsx",
]
enc_layer = sum(
    len(re.findall(r"encodeURIComponent\(", p.read_text())) for p in layer_six
)
src_all = [
    p
    for p in list((ROOT / "src").rglob("*.ts")) + list((ROOT / "src").rglob("*.tsx"))
    if ".test." not in p.name
]
enc_src = sum(len(re.findall(r"encodeURIComponent\(", p.read_text())) for p in src_all)
print(f"ENCODE-URI-COMPONENT: {enc_layer} across the layer's six files / {enc_src} src/-wide")

# src/lib census
lib_files = [p for p in sorted((ROOT / "src" / "lib").glob("*.ts")) if ".test." not in p.name]
lib_lines = sum(len(p.read_text().splitlines()) for p in lib_files)
call_ts = len((ROOT / "src" / "lib" / "call.ts").read_text().splitlines())
print(f"SRC/LIB: {len(lib_files)} non-test files, {lib_lines} lines, call.ts = {call_ts}")

# requireSession (exact await form) + import-line count (the known false positive)
rs = rs_import = 0
for p in (ROOT / "src" / "app" / "api").rglob("route.ts"):
    t = p.read_text()
    rs += len(re.findall(r"await requireSession\(", t))
    rs_import += len(re.findall(r"^import .*requireSession", t, re.M))
print(f"requireSession: {rs} under the exact await form ({rs_import} import lines — the false-positive form)")

# readBoundedJson + direct request.json()
rbj = rsj = 0
for p in (ROOT / "src" / "app" / "api").rglob("route.ts"):
    t = p.read_text()
    rbj += len(re.findall(r"readBoundedJson\(", t))
    rsj += len(re.findall(r"request\.json\(\)", t))
print(f"readBoundedJson: {rbj} parse sites / direct request.json(): {rsj}")

# ceilings
et = (ROOT / "src" / "lib" / "editor.ts").read_text().splitlines()
for i, l in enumerate(et, 1):
    if "ELEMENT_LIMIT" in l and "2000" in l:
        print(f"ELEMENT_LIMIT 2000 at editor.ts:{i}")
        break
vt = (ROOT / "src" / "lib" / "validation.ts").read_text().splitlines()
for i, l in enumerate(vt, 1):
    if re.search(r"(PROJECT|USER|TEAM|MEMBER)_LIMIT\s*=\s*\d+", l):
        print(f"validation.ts:{i}: {l.strip()}")
