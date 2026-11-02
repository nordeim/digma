#!/usr/bin/env python3
"""rider-fixes-s202.py — the Session 202 count-family rider: the +13
count movement's own receipt across the pin families (the S186..S201
rider-fixes form — the rider re-anchors the LIVE claims that
the deliberate movement moved; frozen records never rewritten):

  1. the s185..s201 live Unit-total row / checklist / command-row
     pins (263/2770 -> 264/2783);
  2. the s185..s201 Last-Updated ordinal phrases (the
     one-hundred-and-forty-ninth audit -> the
     one-hundred-and-fiftieth audit — the title-pin rider
     family's known form);
  3. the s185 project_state pin (the prefixed form) + the s186..s201
     project_state pins (the bare form) (2770 -> 2783);
  4. the s185..s201 pair-unity toBe members (UNIT/FILES);
  5. the s181/s182/s183/s184 anchored-declaration census literals
     (82/81 -> 83/82 — the grep uniq -c form).

NO layer-total rider this cycle — the layer STAYS at 14,373 (the
below-threshold form).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/rider-fixes-s202.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")


def patch(path: str, subs: list[tuple[str, str]]) -> None:
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


# --- 1-4. the s185..s201 live count pins --------------------------
for nn in tuple(range(185, 202)):
    patch(f"tests/lows-s{nn}.test.ts", [
        # the live Unit-total row / checklist / command-row pins
        ('expect(padSource).toContain("| **Unit total** | **263 files** | **2770** | | Vitest |");',
         'expect(padSource).toContain("| **Unit total** | **264 files** | **2783** | | Vitest |");'),
        ('expect(padSource).toContain("- [ ] `bun run test` → 2770/2770");',
         'expect(padSource).toContain("- [ ] `bun run test` → 2783/2783");'),
        ('"| `bun run test` / `bun run test:watch` | repo root | unit tests (2770 checks / 263 files) |",',
         '"| `bun run test` / `bun run test:watch` | repo root | unit tests (2783 checks / 264 files) |",'),
        # the Last-Updated ordinal phrase
        ('expect(lastUpdated).toContain("the one-hundred-and-forty-ninth audit");',
         'expect(lastUpdated).toContain("the one-hundred-and-fiftieth audit");'),
        # the project_state pin (the s185 prefixed form)
        ("expect(skillSource).toContain('project_state: \"2770 unit checks green');",
         "expect(skillSource).toContain('project_state: \"2783 unit checks green');"),
        # the pair-unity toBe members
        ('expect(UNIT).toBe("2770");',
         'expect(UNIT).toBe("2783");'),
        ('expect(FILES).toBe("263");',
         'expect(FILES).toBe("264");'),
    ])

# --- 5. the s181/s182/s183/s184 anchored-declaration census literals -----------
for nn in (181, 182, 183, 184):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(unitOut.trim()).toBe(`82 const UNIT = \"${UNIT}\";`);",
         "expect(unitOut.trim()).toBe(`83 const UNIT = \"${UNIT}\";`);"),
        ("expect(filesOut.trim()).toBe(`81 const FILES = \"${FILES}\";`);",
         "expect(filesOut.trim()).toBe(`82 const FILES = \"${FILES}\";`);"),
    ])

# --- 6. the s186..s201 bare-form project_state pins --------------------
# (the fuller 'project_state:' prefixed form rode in wave 3 above for
# s185; s186..s201 carry the BARE substring form — the two
# pin-form shapes of the same live claim, the s159 family's own
# reminder that the rider enumerates forms, not intentions)
for nn in tuple(range(186, 202)):
    patch(f"tests/lows-s{nn}.test.ts", [
        ('expect(skillSource).toContain("2770 unit checks green");',
         'expect(skillSource).toContain("2783 unit checks green");'),
    ])
