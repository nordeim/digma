#!/usr/bin/env python3
"""f40-riders-s181.py — the Session 181 F40 rider family (the layer's
first movement in fourteen cycles engages the riders): the prior specs'
hard-coded STAYS expectations re-anchored onto the measured post-S181
figures — toBe(14307) -> toBe(14313) across the 21 carrying specs
(s156..s180), toBe(2450) -> toBe(2461) across the 10 carrying specs
(s171..s180) — plus the SKILL's two live line-count claims re-anchored
(auth.ts 147 -> 158, globals.css 267 -> 273) and the s126 spec's two
literals lockstepped (the pin's intent — the SKILL claim matches the
live count — preserved; the literals track the deliberate change).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/f40-riders-s181.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- (1) the layer-total riders: toBe(14307) -> toBe(14313) -------------------
layer_specs = []
for spec in sorted((ROOT / "tests").glob("lows-s*.test.ts")):
    text = spec.read_text()
    if "toBe(14307)" in text:
        n = text.count("toBe(14307)")
        text = text.replace("toBe(14307)", "toBe(14313)")
        spec.write_text(text)
        layer_specs.append((spec.name, n))
print(f"layer riders: {len(layer_specs)} specs re-anchored toBe(14307) -> toBe(14313)")
for name, n in layer_specs:
    print(f"  {name}: {n} site(s)")

# --- (2) the route-total riders: toBe(2450) -> toBe(2461) ---------------------
route_specs = []
for spec in sorted((ROOT / "tests").glob("lows-s*.test.ts")):
    text = spec.read_text()
    if "toBe(2450)" in text:
        n = text.count("toBe(2450)")
        text = text.replace("toBe(2450)", "toBe(2461)")
        spec.write_text(text)
        route_specs.append((spec.name, n))
print(f"route riders: {len(route_specs)} specs re-anchored toBe(2450) -> toBe(2461)")
for name, n in route_specs:
    print(f"  {name}: {n} site(s)")

# --- (3) the SKILL's two live line-count claims --------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()
subs = [
    ("**Hand-rolled (ADR-003), 147 lines in `src/lib/auth.ts`:**",
     "**Hand-rolled (ADR-003), 158 lines in `src/lib/auth.ts`:**"),
    ("The single source is the `@theme` block in `src/app/globals.css` (267 lines).",
     "The single source is the `@theme` block in `src/app/globals.css` (273 lines)."),
]
applied = 0
for old, new in subs:
    if new in stext and old not in stext:
        continue
    assert old in stext, f"SKILL anchor missing: {old[:60]!r}"
    stext = stext.replace(old, new, 1)
    applied += 1
skill.write_text(stext)
print(f"digma_SKILL.md: {applied} live line-count claims re-anchored (auth.ts 158, globals.css 273)")

# --- (4) the s126 spec's two literals (the lockstep) ---------------------------
s126 = ROOT / "tests/lows-s126.test.ts"
t = s126.read_text()
pairs = [
    ('it("DEFECT (docs): the SKILL\'s auth.ts line claim matches the live count (147)", () => {\n    expect(skillSource).toMatch(/147 lines in `src\\/lib\\/auth\\.ts`/);',
     'it("DEFECT (docs): the SKILL\'s auth.ts line claim matches the live count (158)", () => {\n    expect(skillSource).toMatch(/158 lines in `src\\/lib\\/auth\\.ts`/);'),
    ('it("DEFECT (docs): the SKILL\'s globals.css line claim matches the live count (267)", () => {\n    expect(skillSource).toMatch(/src\\/app\\/globals\\.css` \\(267 lines\\)/);',
     'it("DEFECT (docs): the SKILL\'s globals.css line claim matches the live count (273)", () => {\n    expect(skillSource).toMatch(/src\\/app\\/globals\\.css` \\(273 lines\\)/);'),
]
applied = 0
for old, new in pairs:
    if new in t and old not in t:
        continue
    assert old in t, f"s126 anchor missing: {old[:70]!r}"
    t = t.replace(old, new, 1)
    applied += 1
s126.write_text(t)
print(f"tests/lows-s126.test.ts: {applied} literals lockstepped (147->158, 267->273)")
