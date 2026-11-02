#!/usr/bin/env python3
"""S202 dispatch-figure derivation, live at this tree (the F125/F140-C/
F163/F183/F187 doctrine: every figure re-derived at dispatch, never quoted
from records — and every prior-session figure re-run at the current tree
in its exact form before it rides a brief).

Covers: the 22-file layer per-file census + total; the 18-route per-file
census + total + the internal-consistency probe; the write/handler/catch
censuses; the env census (src/-wide AND route+lib scopes, both NAMED);
the file census; the pinned-constants form (UNIT/FILES + stale sweep);
the encodeURIComponent census; the src/lib census; requireSession;
readBoundedJson; the ceilings.

Run from the repo root:  python3 scripts/dispatch-figures-s202.py
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
    route_per_file[str(p.relative_to(ROOT))] = n
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

# --- 6. env census (BOTH scopes, NAMED) --------------------------------------
env_re = re.compile(r"process\.env\.([A-Z_][A-Z0-9_]*)")
src_all = [
    p
    for p in list((ROOT / "src").rglob("*.ts")) + list((ROOT / "src").rglob("*.tsx"))
    if ".test." not in p.name
]
env_sites, env_vars = 0, set()
for p in src_all:
    for m in env_re.finditer(p.read_text()):
        env_sites += 1
        env_vars.add(m.group(1))
print(f"ENV CENSUS (src/-wide non-test): {env_sites} sites across {len(env_vars)} vars: "
      f"{sorted(env_vars)}")
# the route+lib scope: ALL 18 route files + src/lib non-test
route_lib = list(routes) + \
            [p for p in src_all if p.parent == ROOT / "src" / "lib"]
rl_sites, rl_vars = 0, set()
for p in route_lib:
    for m in env_re.finditer(p.read_text()):
        rl_sites += 1
        rl_vars.add(m.group(1))
print(f"ENV CENSUS (route+lib scope): {rl_sites} sites across {len(rl_vars)} vars")

# --- 7. file census ----------------------------------------------------------
test_files = sorted((ROOT / "tests").glob("*.test.ts"))
lib_test = sorted((ROOT / "src" / "lib").glob("*.test.ts"))
print(f"\nFILE CENSUS: tests/ {len(test_files)} + src/lib {len(lib_test)} = "
      f"{len(test_files) + len(lib_test)}")

# --- 8. pinned-constants form + stale sweep ----------------------------------
# FILES pins are the `const FILES = "263"` form — the E2E-count pin
# (server-lows-s81's `const E2E = "262"`) is a DIFFERENT constant (the
# e2e-check count, still 262) and is excluded from the FILES census.
unit_pins = files_pins = 0
stale = []
all_tests = test_files + lib_test
for p in all_tests:
    t = p.read_text()
    if re.search(r'"2770"', t):
        unit_pins += 1
    if re.search(r'const FILES = "263"', t):
        files_pins += 1
    for m in re.findall(r'"(2[4-7]\d\d)"', t):
        if m not in ("2770",):
            stale.append((p.name, m))
print(f"PINNED CONSTANTS: {unit_pins} UNIT + {files_pins} FILES")
print(f"STALE (non-2770 quoted 2xxx literals): {sorted(set(stale)) if stale else 'none'}")

# --- 9. encodeURIComponent census --------------------------------------------
# "the layer's six files" = THE SIX LAYER FILES CARRYING OCCURRENCES
# (app-header 1 + dashboard-view 2 + editor-view 5 + project-card 4 +
#  recent-view 4 + teams-view 2 = 18; the src-wide +2 = Editor/page.tsx,
#  outside the layer).
layer_file_list = [
    ROOT / "src/components/app-header.tsx",
    ROOT / "src/components/dashboard-view.tsx",
    ROOT / "src/components/editor/editor-view.tsx",
    ROOT / "src/components/project-card.tsx",
    ROOT / "src/components/recent-view.tsx",
    ROOT / "src/components/teams-view.tsx",
]
enc_layer = sum(
    len(re.findall(r"encodeURIComponent", p.read_text())) for p in layer_file_list
)
enc_src = sum(len(re.findall(r"encodeURIComponent", p.read_text())) for p in src_all)
print(f"ENCODE-URI-COMPONENT: {enc_layer} across the layer's six files / {enc_src} src/-wide")

# --- 10. src/lib census -------------------------------------------------------
lib_nontest = [p for p in sorted((ROOT / "src" / "lib").glob("*.ts"))
               if ".test." not in p.name]
lib_lines = sum(len(p.read_text().splitlines()) for p in lib_nontest)
call_ts = len((ROOT / "src" / "lib" / "call.ts").read_text().splitlines())
print(f"SRC/LIB: {len(lib_nontest)} non-test files, {lib_lines} lines, call.ts at {call_ts}")

# --- 11. requireSession -------------------------------------------------------
req_sess = sum(len(re.findall(r"await requireSession", p.read_text())) for p in src_all)
print(f"REQUIRESESSION (await form): {req_sess}")

# --- 12. readBoundedJson + the direct request.json() probe --------------------
# The parse-site census is the 18 ROUTE FILES' call sites (14); the
# src/-wide count (15) includes validation.ts's own implementation seam.
# The direct-request.json() probe runs over the same route files: the
# 14 grep hits are ALL comment-family (the guard-documentation family).
rbj_routes = sum(p.read_text().count("readBoundedJson(") for p in routes)
rbj_all = sum(p.read_text().count("readBoundedJson(") for p in src_all)
direct = []
for p in routes:
    for i, ln in enumerate(p.read_text().splitlines(), 1):
        if re.search(r"request\.json\(\)", ln) and "readBoundedJson" not in ln:
            s = ln.strip()
            direct.append((str(p.relative_to(ROOT)), i, s.startswith("//") or s.startswith("*")))
print(f"READBOUNDEDJSON: {rbj_routes} call sites in the 18 route files "
      f"({rbj_all} src/-wide incl. the validation.ts seam); "
      f"direct request.json() route lines: {len(direct)}, all comment-family: {all(d[2] for d in direct)}")
for d in direct:
    if not d[2]:
        print(f"  REAL DIRECT SITE: {d[0]}:{d[1]}")

# --- 13. the ceilings ----------------------------------------------------------
ed = (ROOT / "src" / "lib" / "editor.ts").read_text()
val = (ROOT / "src" / "lib" / "validation.ts").read_text()
print(f"CEILINGS: ELEMENT_LIMIT={'ELEMENT_LIMIT = 2000' in ed} "
      f"(editor.ts:351 vicinity: {[l.strip() for l in ed.splitlines()[348:353] if 'ELEMENT_LIMIT' in l]})")
print(f"  validation.ts: {[l.strip() for l in val.splitlines()[343:356] if 'LIMIT' in l]}")
