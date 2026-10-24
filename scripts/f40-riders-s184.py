#!/usr/bin/env python3
"""f40-riders-s184.py — the Session 184 F40 rider family (the layer's
first movement since S181 engages the riders): the prior specs'
hard-coded STAYS expectations re-anchored onto the measured post-S184
figures — toBe(14313) -> toBe(14357) across the carrying specs — plus
the SKILL's globals.css live line-count claim re-anchored (273 -> 298),
the s126 spec's literal lockstepped (the pin's intent — the SKILL claim
matches the live count — preserved), and the PAD §11 inventory rows for
the five moving files (login-screen 733 -> 741, properties-panel
2,365 -> 2,370, globals.css 273 -> 298, dashboard-view 424 -> 427,
teams-view 540 -> 543, each with its tail STAYS-clause reworded where
present).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/f40-riders-s184.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- (1) the layer-total riders: toBe(14313) -> toBe(14357) -------------------
layer_specs = []
for spec in sorted((ROOT / "tests").glob("lows-s*.test.ts")):
    text = spec.read_text()
    if "toBe(14313)" in text:
        n = text.count("toBe(14313)")
        text = text.replace("toBe(14313)", "toBe(14357)")
        spec.write_text(text)
        layer_specs.append((spec.name, n))
print(f"layer riders: {len(layer_specs)} specs re-anchored toBe(14313) -> toBe(14357)")
for name, n in layer_specs:
    print(f"  {name}: {n} site(s)")

# --- (2) the SKILL's globals.css live line-count claim --------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()
old_claim = "The single source is the `@theme` block in `src/app/globals.css` (273 lines)."
new_claim = "The single source is the `@theme` block in `src/app/globals.css` (298 lines)."
if new_claim not in stext:
    assert old_claim in stext, "SKILL globals.css claim anchor not found"
    stext = stext.replace(old_claim, new_claim, 1)
    skill.write_text(stext)
    print("digma_SKILL.md: the globals.css line-count claim re-anchored (273 -> 298)")
else:
    print("digma_SKILL.md: globals.css claim already on 298")

# --- (3) the s126 spec's literal (the lockstep) ---------------------------------
s126 = ROOT / "tests/lows-s126.test.ts"
t = s126.read_text()
pairs = [
    ('it("DEFECT (docs): the SKILL\'s globals.css line claim matches the live count (273)", () => {\n    expect(skillSource).toMatch(/src\\/app\\/globals\\.css` \\(273 lines\\)/);',
     'it("DEFECT (docs): the SKILL\'s globals.css line claim matches the live count (298)", () => {\n    expect(skillSource).toMatch(/src\\/app\\/globals\\.css` \\(298 lines\\)/);'),
]
applied = 0
for old, new in pairs:
    if new in t and old not in t:
        continue
    assert old in t, f"s126 anchor missing: {old[:70]!r}"
    t = t.replace(old, new, 1)
    applied += 1
s126.write_text(t)
print(f"tests/lows-s126.test.ts: {applied} literal lockstepped (273 -> 298)")

# --- (4) the PAD §11 inventory rows for the five moving files -------------------
pad = ROOT / "Project_Architecture_Document.md"
ptext = pad.read_text()

ROW_SUBS = [
    # login-screen 733 -> 741 (the S184-A guard + the S160-D comment extension)
    ("| `src/components/login-screen.tsx` | 733 | FIVE-state auth card",
     "| `src/components/login-screen.tsx` | 741 | FIVE-state auth card"),
    # properties-panel 2,365 -> 2,370 (the S184-C annotation; the tail
    # STAYS-clause reworded onto the honest movement)
    ("| `src/components/editor/properties-panel.tsx` | 2365 | Reference five-section layout",
     "| `src/components/editor/properties-panel.tsx` | 2370 | Reference five-section layout"),
    ("properties-panel.tsx STAYS 2,365, zero line-count drift",
     "properties-panel.tsx 2,365 -> 2,370 (the S184-C comment-truth annotation, the first movement since S161-D)"),
    # globals.css 273 -> 298 (the trap-5 pin + the trap-3 custom class)
    ("| `src/app/globals.css` | 273 | Tailwind 4 `@theme` tokens",
     "| `src/app/globals.css` | 298 | Tailwind 4 `@theme` tokens"),
    # dashboard-view 424 -> 427 (the hero/icon/CTA conversions)
    ("| `src/components/dashboard-view.tsx` | 424 | Gradient hero",
     "| `src/components/dashboard-view.tsx` | 427 | Gradient hero"),
    # teams-view 540 -> 543 (the chip hook comment + the title conversion)
    ("| `src/components/teams-view.tsx` | 540 | Teams page",
     "| `src/components/teams-view.tsx` | 543 | Teams page"),
]
applied = 0
for old, new in ROW_SUBS:
    if new in ptext and old not in ptext:
        continue
    assert old in ptext, f"PAD §11 row anchor missing: {old[:80]!r}"
    ptext = ptext.replace(old, new, 1)
    applied += 1
pad.write_text(ptext)
print(f"Project_Architecture_Document.md: {applied} §11 row site(s) re-anchored")

# --- (5) the README/CLAUDE/AGENTS/SKILL layer-claim sweep -----------------------
# (the live claim sites carrying the 14,313 figure — the frozen chain
#  records are never touched; the AGENTS session-184 bullet lands with
#  doc-update-s184.py carrying the new figure)
for name, old, new in [
    ("README.md", None, None),
]:
    pass  # README carries no layer claim (verified this cycle)

print("F40 riders complete — the deliberate-remediation form, never drift")
