#!/usr/bin/env python3
"""rider-fixes-s187.py — the Session 187 lockstep rider family (the
full-unit-gate's expected failures, each ridden to green):

  (1) the s181..s184 declaration-census literals 67/66 -> 68/67 (the
      count-form assertions over the rg census);
  (2) the s185 + s186 specs' absolute literals — the PAD count rows
      (248/2588 -> 249/2600, the checklist, the command row), the
      lastUpdated ordinal phrase (one-hundred-and-thirty-fourth ->
      one-hundred-and-thirty-fifth), and the pair-unity toBe("2588")
      -> toBe("2600").

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/rider-fixes-s187.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")


def patch(path: str, subs: list[tuple[str, str]]) -> None:
    p = ROOT / path
    text = p.read_text()
    applied = 0
    for old, new in subs:
        if new in text and old not in text:
            continue  # already applied (idempotent re-run)
        if old not in text:
            raise SystemExit(f"MISSING in {path}: {old[:100]!r}")
        n = text.count(old)
        if n != 1:
            raise SystemExit(f"AMBIGUOUS ({n} hits) in {path}: {old[:100]!r}")
        text = text.replace(old, new)
        applied += 1
    p.write_text(text)
    print(f"{path}: {applied} rider sites re-anchored")

# --- (1) the s181..s184 declaration-census literals ---------------------------
for spec in (181, 182, 183, 184):
    patch(f"tests/lows-s{spec}.test.ts", [
        ("    expect(unitOut.trim()).toBe(`67 const UNIT = \"${UNIT}\";`);",
         "    expect(unitOut.trim()).toBe(`68 const UNIT = \"${UNIT}\";`);"),
        ("    expect(filesOut.trim()).toBe(`66 const FILES = \"${FILES}\";`);",
         "    expect(filesOut.trim()).toBe(`67 const FILES = \"${FILES}\";`);"),
    ])

# --- (2) the s185 + s186 absolute literals ------------------------------------
for spec in (185, 186):
    patch(f"tests/lows-s{spec}.test.ts", [
        ('    expect(padSource).toContain("| **Unit total** | **248 files** | **2588** | | Vitest |");',
         '    expect(padSource).toContain("| **Unit total** | **249 files** | **2600** | | Vitest |");'),
        ('    expect(padSource).toContain("- [ ] `bun run test` → 2588/2588");',
         '    expect(padSource).toContain("- [ ] `bun run test` → 2600/2600");'),
        ('      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2588 checks / 248 files) |",',
         '      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2600 checks / 249 files) |",'),
        ('    expect(lastUpdated).toContain("the one-hundred-and-thirty-fourth audit");',
         '    expect(lastUpdated).toContain("the one-hundred-and-thirty-fifth audit");'),
        ('    expect(UNIT).toBe("2588");',
         '    expect(UNIT).toBe("2600");'),
    ])

print("rider family complete")

# --- (3) the s185 + s186 SKILL-count + FILES-pair literals (found by the
#     second full-gate run — the honest measured form; the two specs carry
#     DIFFERENT spellings of the SKILL-count member):
patch("tests/lows-s185.test.ts", [
    ('project_state: "2588 unit checks green',
     'project_state: "2600 unit checks green'),
    ('    expect(FILES).toBe("248");',
     '    expect(FILES).toBe("249");'),
])
patch("tests/lows-s186.test.ts", [
    ('    expect(skillSource).toContain("2588 unit checks green");',
     '    expect(skillSource).toContain("2600 unit checks green");'),
    ('    expect(FILES).toBe("248");',
     '    expect(FILES).toBe("249");'),
])
print("second-wave rider sites complete")
