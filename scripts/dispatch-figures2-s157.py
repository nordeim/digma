#!/usr/bin/env python3
"""S157 dispatch-figure derivation, part 2 — the auditor-dialect counts
(the write-statement/handler-surface census and the catch census in the
instanceof dialect + the SDK fallback). LIVE at this tree (F125).

Run from the repo root:  python3 scripts/dispatch-figures2-s157.py
"""
from pathlib import Path
import re

ROOT = Path("/home/z/my-project/digma")

routes = sorted((ROOT / "src" / "app" / "api").rglob("route.ts"))

# --- write statements (real Prisma write calls, not comment lines) --------
write_kws = re.compile(r"\.(create|createMany|update|updateMany|delete|deleteMany|upsert)\(")
stmts = 0
files = set()
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
            files.add(p)
print(f"WRITE CENSUS (non-comment lines): {stmts} statements across {len(files)} files")

# handler surfaces: count HTTP handler functions (export async function GET/POST/...)
handlers = 0
write_handlers = 0
for p in routes:
    text = p.read_text()
    # split by handler exports
    parts = re.split(r"(?=export async function (?:GET|POST|PUT|PATCH|DELETE))", text)
    for part in parts:
        if part.startswith("export async function"):
            handlers += 1
            if write_kws.search(part):
                write_handlers += 1
print(f"HANDLER CENSUS: {handlers} handlers, {write_handlers} carrying writes")

# --- catch census: the instanceof dialect + the SDK fallback ---------------
catch_blocks = 0
instanceof_catches = 0
sdk_fallback = 0
for p in routes:
    text = p.read_text()
    for m in re.finditer(r"catch\s*\(([^)]*)\)\s*\{", text):
        # look at the next 300 chars for instanceof usage
        window = text[m.end():m.end() + 300]
        catch_blocks += 1
        if "instanceof" in window:
            instanceof_catches += 1
print(f"CATCH CENSUS (routes): {catch_blocks} catch blocks, {instanceof_catches} instanceof-dialect")

# the lib layer catches (the SDK fallback family)
lib = ROOT / "src" / "lib"
lib_catches = 0
lib_instanceof = 0
for p in sorted(lib.rglob("*.ts")):
    if ".test." in p.name:
        continue
    text = p.read_text()
    for m in re.finditer(r"catch\s*\(([^)]*)\)\s*\{", text):
        window = text[m.end():m.end() + 300]
        lib_catches += 1
        if "instanceof" in window:
            lib_instanceof += 1
        if p.name == "ai-assistant.ts" and ("SDK" in window or "sdk" in window or "fallback" in window or "llm" in window.lower()):
            sdk_fallback += 1
print(f"CATCH CENSUS (non-test src/lib): {lib_catches} catch blocks, {lib_instanceof} instanceof-dialect, ai-assistant fallback-family: {sdk_fallback}")
