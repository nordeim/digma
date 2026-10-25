#!/usr/bin/env python3
"""rider-fixes-s188.py — the Session 188 F40 rider: the +8 layer movement's
own receipt across the pin families (the S186 rider-fixes form — the
rider re-anchors the LIVE claims that the deliberate movement moved;
frozen records never rewritten):

  1. the PAD §11 key-files row (properties-panel 2370 -> 2378 — the
     doc-lows-s86 live-derived table contract: any file edit forces its
     §11 row update in the same commit);
  2. the live layer-total measurement sites (toBe(14365) -> toBe(14373)
     across the carrying specs);
  3. the s186/s187 LAYER_TOTAL constants (14365 -> 14373);
  4. the s185/s186/s187 live Unit-total row / checklist / command-row
     pins (249/2600 -> 250/2613);
  5. the s185/s186/s187 Last-Updated ordinal phrases (the
     one-hundred-and-thirty-fifth audit -> the one-hundred-and-thirty-
     sixth audit — the title-pin rider family's known form);
  6. the s185/s186/s187 project_state pins (2600 -> 2613).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/rider-fixes-s188.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")


def patch(path: str, subs: list[tuple[str, str]], count_any: bool = False) -> None:
    p = ROOT / path
    text = p.read_text()
    applied = 0
    for old, new in subs:
        if old not in text:
            continue  # already applied or absent (idempotent)
        n = text.count(old)
        text = text.replace(old, new)
        applied += n
    p.write_text(text)
    print(f"{path}: {applied} rider sites re-anchored")


# --- 1. the PAD §11 key-files row ---------------------------------------------
patch("Project_Architecture_Document.md", [
    ("| `src/components/editor/properties-panel.tsx` | 2370 |",
     "| `src/components/editor/properties-panel.tsx` | 2378 |"),
])

# --- 2. the live layer-total measurement sites (every carrying spec) -----------
import glob

layer_specs = sorted(glob.glob(str(ROOT / "tests" / "*.test.ts")))
total_sites = 0
for spec in layer_specs:
    p = Path(spec)
    text = p.read_text()
    if "toBe(14365)" in text:
        n = text.count("toBe(14365)")
        text = text.replace("toBe(14365)", "toBe(14373)")
        p.write_text(text)
        total_sites += n
        print(f"{p.name}: {n} toBe(14365) -> toBe(14373)")
print(f"layer-total measurement sites: {total_sites} re-anchored across the carrying specs")

# --- 3. the s186/s187 LAYER_TOTAL constants ------------------------------------
for spec in ("tests/lows-s186.test.ts", "tests/lows-s187.test.ts"):
    patch(spec, [
        ("const LAYER_TOTAL = 14365;", "const LAYER_TOTAL = 14373;"),
    ])

# --- 4. the s185/s186/s187 live Unit-total row / checklist / command-row pins ---
for spec in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts", "tests/lows-s187.test.ts"):
    patch(spec, [
        ('expect(padSource).toContain("| **Unit total** | **249 files** | **2600** | | Vitest |");',
         'expect(padSource).toContain("| **Unit total** | **250 files** | **2613** | | Vitest |");'),
        ('expect(padSource).toContain("- [ ] `bun run test` → 2600/2600");',
         'expect(padSource).toContain("- [ ] `bun run test` → 2613/2613");'),
        ('"| `bun run test` / `bun run test:watch` | repo root | unit tests (2600 checks / 249 files) |",',
         '"| `bun run test` / `bun run test:watch` | repo root | unit tests (2613 checks / 250 files) |",'),
    ])

# --- 5. the s185/s186/s187 Last-Updated ordinal phrases -------------------------
for spec in ("tests/lows-s185.test.ts", "tests/lows-s186.test.ts", "tests/lows-s187.test.ts"):
    patch(spec, [
        ('expect(lastUpdated).toContain("the one-hundred-and-thirty-fifth audit");',
         'expect(lastUpdated).toContain("the one-hundred-and-thirty-sixth audit");'),
    ])

# --- 6. the s185/s186/s187 project_state pins ------------------------------------
patch("tests/lows-s185.test.ts", [
    ("expect(skillSource).toContain('project_state: \"2600 unit checks green');",
     "expect(skillSource).toContain('project_state: \"2613 unit checks green');"),
])
for spec in ("tests/lows-s186.test.ts", "tests/lows-s187.test.ts"):
    patch(spec, [
        ('expect(skillSource).toContain("2600 unit checks green");',
         'expect(skillSource).toContain("2613 unit checks green");'),
    ])

# --- 7. wave 2 — the s181..s184 uniq -c census literals (68/67 -> 69/68) ---------
for spec in (181, 182, 183, 184):
    patch(f"tests/lows-s{spec}.test.ts", [
        ("expect(unitOut.trim()).toBe(`68 const UNIT = \"${UNIT}\";`);",
         "expect(unitOut.trim()).toBe(`69 const UNIT = \"${UNIT}\";`);"),
        ("expect(filesOut.trim()).toBe(`67 const FILES = \"${FILES}\";`);",
         "expect(filesOut.trim()).toBe(`68 const FILES = \"${FILES}\";`);"),
    ])

# --- 8. wave 3 — the s185/s186/s187 pair-unity absolute literals ------------------
for spec in (185, 186, 187):
    patch(f"tests/lows-s{spec}.test.ts", [
        ('expect(UNIT).toBe("2600");', 'expect(UNIT).toBe("2613");'),
        ('expect(FILES).toBe("249");', 'expect(FILES).toBe("250");'),
    ])
