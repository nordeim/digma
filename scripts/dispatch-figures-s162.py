#!/usr/bin/env python3
"""S161 dispatch-figure derivation (the F125 live-derivation doctrine).
Derives every count the two auditors' dispatch briefs will carry — LIVE at
this tree, never quoted from a prior session's prose.

Run from the repo root:  python3 scripts/dispatch-figures-s162.py
"""
from pathlib import Path
import re

ROOT = Path("/home/z/my-project/digma")
SRC = ROOT / "src"

# --- the 22-file client layer (the exact composition, the s155 form) -------
editor = [
    "src/components/editor/editor-view.tsx",
    "src/components/editor/properties-panel.tsx",
    "src/components/editor/canvas.tsx",
    "src/components/editor/ai-assistant.tsx",
    "src/components/editor/editor-store.ts",
    "src/components/editor/layers-panel.tsx",
    "src/components/editor/toolbar.tsx",
    "src/components/editor/components-panel.tsx",
]
components = [
    "src/components/project-card.tsx",
    "src/components/login-screen.tsx",
    "src/components/teams-view.tsx",
    "src/components/recent-view.tsx",
    "src/components/dashboard-view.tsx",
    "src/components/app-header.tsx",
    "src/components/reset-password-screen.tsx",
    "src/components/logo.tsx",
]
hooks = [
    "src/hooks/use-toast.ts",
    "src/hooks/use-media-query.ts",
]
lib_layer = [
    "src/lib/editor.ts",
    "src/lib/ai-assistant.ts",
    "src/lib/export-png.ts",
]
css = ["src/app/globals.css"]

def wc(p):
    return len((ROOT / p).read_text().splitlines())

groups = {"editor": editor, "components": components, "hooks": hooks,
          "lib": lib_layer, "globals.css": css}
totals = {}
all22 = []
for name, files in groups.items():
    counts = {f: wc(f) for f in files}
    totals[name] = sum(counts.values())
    all22.extend(files)
    for f, c in counts.items():
        print(f"  {f}: {c}")
    print(f"  -> {name}: {totals[name]}")
layer_total = sum(totals.values())
print(f"22-FILE LAYER TOTAL: {layer_total} across {len(all22)} files")

# --- the 18 route files -----------------------------------------------------
routes = sorted((SRC / "app" / "api").rglob("route.ts"))
route_total = sum(len(p.read_text().splitlines()) for p in routes)
print(f"ROUTE FILES: {len(routes)} files, {route_total} lines")

# --- the env census (non-test src/) ----------------------------------------
env_sites = {}
for p in sorted(SRC.rglob("*.ts")) + sorted(SRC.rglob("*.tsx")):
    if ".test." in p.name:
        continue
    text = p.read_text()
    for m in re.finditer(r"process\.env", text):
        # capture the var name that follows
        tail = text[m.end():m.end() + 60]
        vm = re.match(r"\.([A-Z_0-9]+)", tail)
        var = vm.group(1) if vm else "<other>"
        env_sites.setdefault(var, []).append(f"{p.relative_to(ROOT)}")
print(f"ENV CENSUS: {sum(len(v) for v in env_sites.values())} process.env sites in non-test src/")
for var, sites in sorted(env_sites.items()):
    print(f"  {var}: x{len(sites)}")

# --- the catch census (non-test src/) ---------------------------------------
catch_total = 0
for p in sorted(SRC.rglob("*.ts")) + sorted(SRC.rglob("*.tsx")):
    if ".test." in p.name:
        continue
    catch_total += p.read_text().count("catch")
instanceof_dialect = 0
for p in sorted(SRC.rglob("*.ts")) + sorted(SRC.rglob("*.tsx")):
    if ".test." in p.name:
        continue
    instanceof_dialect += len(re.findall(r"catch.*?instanceof", p.read_text()))
print(f"CATCH CENSUS (raw 'catch' tokens, non-test src/): {catch_total}")

# --- the write census (Prisma write statements in route handlers) ----------
write_kws = [r"\.create\(", r"\.createMany\(", r"\.update\(", r"\.updateMany\(",
             r"\.delete\(", r"\.deleteMany\(", r"\.upsert\("]
write_stmts = 0
write_surfaces = set()
for p in routes:
    for i, line in enumerate(p.read_text().splitlines(), 1):
        if any(re.search(k, line) for k in write_kws):
            write_stmts += 1
            write_surfaces.add(str(p.relative_to(ROOT)))
print(f"WRITE CENSUS: ~{write_stmts} write statements across {len(write_surfaces)} route files")
