#!/usr/bin/env python3
"""S187 dispatch-figure derivation, live at this tree (F125/F140-C/F163
doctrine: every figure re-derived at dispatch, never quoted from records).

Covers: the 22-file layer per-file census + total; the 18-route per-file
census + total + the internal-consistency probe; the write/handler/catch
censuses; the env census; the file census; the spec constants.

Run from the repo root:  python3 scripts/dispatch-s187.py
"""
from pathlib import Path
import re

ROOT = Path("/home/z/my-project/digma")

# --- 1. the 22-file client layer ------------------------------------------
layer_files = [
    "src/app/globals.css",
    "src/components/app-header.tsx",
    "src/components/dashboard-view.tsx",
    "src/components/editor/ai-assistant.tsx",
    "src/components/editor/canvas.tsx",
    "src/components/editor/components-panel.tsx",
    "src/components/editor/editor-store.ts",
    "src/components/editor/editor-view.tsx",
    "src/components/editor/layers-panel.tsx",
    "src/components/editor/properties-panel.tsx",
    "src/components/editor/toolbar.tsx",
    "src/components/login-screen.tsx",
    "src/components/logo.tsx",
    "src/components/project-card.tsx",
    "src/components/recent-view.tsx",
    "src/components/reset-password-screen.tsx",
    "src/components/teams-view.tsx",
    "src/hooks/use-media-query.ts",
    "src/hooks/use-toast.ts",
    "src/lib/ai-assistant.ts",
    "src/lib/editor.ts",
    "src/lib/export-png.ts",
]
layer_total = 0
per_file = {}
for f in layer_files:
    n = len((ROOT / f).read_text().splitlines())
    per_file[f] = n
    layer_total += n
print(f"LAYER: {len(layer_files)} files, {layer_total} lines total")
for f, n in per_file.items():
    print(f"  {f}: {n}")

# --- 2. the 18 route files + internal-consistency probe --------------------
routes = sorted((ROOT / "src" / "app" / "api").rglob("route.ts"))
route_total = 0
route_per_file = {}
for p in routes:
    n = len(p.read_text().splitlines())
    route_per_file[str(p)] = n
    route_total += n
print(f"\nROUTES: {len(routes)} files, {route_total} lines total")
for f, n in route_per_file.items():
    print(f"  {f}: {n}")
hand = sum(route_per_file.values())
print(f"INTERNAL-CONSISTENCY PROBE: hand-sum {hand} == stated total {route_total}: "
      f"{'PASS' if hand == route_total else 'FAIL'}")

# --- 3. write census (non-comment lines) ------------------------------------
write_kws = re.compile(r"\.(create|createMany|update|updateMany|delete|deleteMany|upsert)\(")
stmts, wfiles = 0, set()
db_dot, tx_dot, sdk = 0, 0, 0
for p in routes:
    in_block_comment = False
    for line in p.read_text().splitlines():
        s = line.strip()
        if s.startswith("/*"):
            in_block_comment = True
        if in_block_comment:
            if "*/" in s:
                in_block_comment = False
            continue
        if s.startswith("//") or s.startswith("*"):
            continue
        if write_kws.search(s):
            stmts += 1
            wfiles.add(p)
            if "db." in s:
                db_dot += 1
            elif "tx." in s:
                tx_dot += 1
            elif ".create(" in s and ("ZAI" in s or "completions" in s or "sdk" in s.lower()):
                sdk += 1
            else:
                # count multi-word forms by prefix
                if re.search(r"\bdb\.", s):
                    db_dot += 1
                elif re.search(r"\btx\.", s):
                    tx_dot += 1
                else:
                    sdk += 1
print(f"\nWRITE CENSUS: {stmts} statements across {len(wfiles)} files "
      f"= {db_dot} db. + {tx_dot} tx. + {sdk} SDK-shaped")

# --- 4. handler census -------------------------------------------------------
handlers, write_handlers, sync_handlers = 0, 0, 0
for p in routes:
    text = p.read_text()
    parts = re.split(r"(?=export (?:async )?function (?:GET|POST|PUT|PATCH|DELETE))", text)
    for part in parts:
        if part.startswith("export async function"):
            handlers += 1
            if write_kws.search(part):
                write_handlers += 1
        elif part.startswith("export function"):
            sync_handlers += 1
            if write_kws.search(part):
                write_handlers += 1
print(f"HANDLER CENSUS: {handlers} async + {sync_handlers} sync, "
      f"{write_handlers} write-carrying")

# --- 5. catch census ---------------------------------------------------------
catch_blocks, instanceof_catches = 0, 0
for p in routes:
    text = p.read_text()
    for m in re.finditer(r"catch\s*\(([^)]*)\)\s*\{", text):
        catch_blocks += 1
        window = text[m.end():m.end() + 300]
        if "instanceof" in window:
            instanceof_catches += 1
print(f"CATCH CENSUS: {catch_blocks} blocks, {instanceof_catches} inline-instanceof")

# --- 6. env census -----------------------------------------------------------
env_re = re.compile(r"process\.env\.([A-Z_][A-Z0-9_]*)")
env_sites, env_vars = 0, set()
for p in sorted((ROOT / "src").rglob("*.ts")) + sorted((ROOT / "src").rglob("*.tsx")):
    if p.suffix == ".ts" and ".test." in p.name:
        continue
    for m in env_re.finditer(p.read_text()):
        env_sites += 1
        env_vars.add(m.group(1))
print(f"ENV CENSUS (src/ non-test): {env_sites} sites across {len(env_vars)} vars: "
      f"{sorted(env_vars)}")

# --- 7. file census ----------------------------------------------------------
test_files = sorted((ROOT / "tests").glob("*.test.ts"))
lib_test = sorted((ROOT / "src" / "lib").glob("*.test.ts"))
print(f"\nFILE CENSUS: tests/ {len(test_files)} + src/lib {len(lib_test)} = "
      f"{len(test_files) + len(lib_test)}")

# --- 8. spec constants -------------------------------------------------------
unit_count, files_count = 0, 0
for p in test_files:
    text = p.read_text()
    unit_count += len(re.findall(r"^\s*(?:test|it)\(", text, re.M))
    files_count += 1
for p in lib_test:
    text = p.read_text()
    unit_count += len(re.findall(r"^\s*(?:test|it)\(", text, re.M))
    files_count += 1
print(f"SPEC CONSTANTS: {unit_count} UNIT + {files_count} FILES")
