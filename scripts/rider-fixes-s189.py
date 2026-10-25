#!/usr/bin/env python3
"""rider-fixes-s189.py — the Session 189 count-family rider: the +12
count movement's own receipt across the pin families (the S186/S187
rider-fixes form — the rider re-anchors the LIVE claims that the
deliberate movement moved; frozen records never rewritten):

  1. the s185/s186/s187/s188 live Unit-total row / checklist /
     command-row pins (250/2613 -> 251/2625);
  2. the s185/s186/s187/s188 Last-Updated ordinal phrases (the
     one-hundred-and-thirty-sixth audit -> the one-hundred-and-
     thirty-seventh audit — the title-pin rider family's known form);
  3. the s185/s186/s187/s188 project_state pins (2613 -> 2625);
  4. the s185/s186/s187/s188 pair-unity toBe members (UNIT/FILES);
  5. the s181/s182/s183/s184 anchored-declaration census literals
     (69/68 -> 70/69 — the grep uniq -c form).

NO layer-total rider this cycle — the layer STAYS at 14,373 (the
zero-movement form).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/rider-fixes-s189.py
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


# --- 1-4. the s185/s186/s187/s188 live count pins ------------------------------
for nn in (185, 186, 187, 188):
    patch(f"tests/lows-s{nn}.test.ts", [
        # the live Unit-total row / checklist / command-row pins
        ('expect(padSource).toContain("| **Unit total** | **250 files** | **2613** | | Vitest |");',
         'expect(padSource).toContain("| **Unit total** | **251 files** | **2625** | | Vitest |");'),
        ('expect(padSource).toContain("- [ ] `bun run test` → 2613/2613");',
         'expect(padSource).toContain("- [ ] `bun run test` → 2625/2625");'),
        ('"| `bun run test` / `bun run test:watch` | repo root | unit tests (2613 checks / 250 files) |",',
         '"| `bun run test` / `bun run test:watch` | repo root | unit tests (2625 checks / 251 files) |",'),
        # the Last-Updated ordinal phrase
        ('expect(lastUpdated).toContain("the one-hundred-and-thirty-sixth audit");',
         'expect(lastUpdated).toContain("the one-hundred-and-thirty-seventh audit");'),
        # the project_state pin
        ("expect(skillSource).toContain('project_state: \"2613 unit checks green');",
         "expect(skillSource).toContain('project_state: \"2625 unit checks green');"),
        # the pair-unity toBe members
        ('expect(UNIT).toBe("2613");',
         'expect(UNIT).toBe("2625");'),
        ('expect(FILES).toBe("250");',
         'expect(FILES).toBe("251");'),
    ])

# --- 5. the s181/s182/s183/s184 anchored-declaration census literals -----------
for nn in (181, 182, 183, 184):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(unitOut.trim()).toBe(`69 const UNIT = \"${UNIT}\";`);",
         "expect(unitOut.trim()).toBe(`70 const UNIT = \"${UNIT}\";`);"),
        ("expect(filesOut.trim()).toBe(`68 const FILES = \"${FILES}\";`);",
         "expect(filesOut.trim()).toBe(`69 const FILES = \"${FILES}\";`);"),
    ])

# --- 6. the s186/s187/s188 bare-form project_state pins ------------------------
# (the fuller 'project_state:' prefixed form rode in wave 4 above for
# s185; s186/s187/s188 carry the BARE substring form — the two
# pin-form shapes of the same live claim, the s159 family's own
# reminder that the rider enumerates forms, not intentions)
for nn in (186, 187, 188):
    patch(f"tests/lows-s{nn}.test.ts", [
        ('expect(skillSource).toContain("2613 unit checks green");',
         'expect(skillSource).toContain("2625 unit checks green");'),
    ])
