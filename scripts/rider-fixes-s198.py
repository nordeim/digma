#!/usr/bin/env python3
"""rider-fixes-s198.py — the Session 198 count-family rider: the +12
count movement's own receipt across the pin families (the S186..S197
rider-fixes form — the rider re-anchors the LIVE claims that
the deliberate movement moved; frozen records never rewritten):

  1. the s185..s197 live Unit-total row / checklist / command-row
     pins (259/2721 -> 260/2733);
  2. the s185..s197 Last-Updated ordinal phrases (the
     one-hundred-and-forty-fifth audit -> the
     one-hundred-and-forty-sixth audit — the title-pin rider
     family's known form);
  3. the s185 project_state pin (the prefixed form) + the s186..s197
     project_state pins (the bare form) (2721 -> 2733);
  4. the s185..s197 pair-unity toBe members (UNIT/FILES);
  5. the s181/s182/s183/s184 anchored-declaration census literals
     (78/77 -> 79/78 — the grep uniq -c form).

NO layer-total rider this cycle — the layer STAYS at 14,373 (the
below-threshold form).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/rider-fixes-s198.py
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


# --- 1-4. the s185..s197 live count pins --------------------------
for nn in (185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197):
    patch(f"tests/lows-s{nn}.test.ts", [
        # the live Unit-total row / checklist / command-row pins
        ('expect(padSource).toContain("| **Unit total** | **259 files** | **2721** | | Vitest |");',
         'expect(padSource).toContain("| **Unit total** | **260 files** | **2733** | | Vitest |");'),
        ('expect(padSource).toContain("- [ ] `bun run test` → 2721/2721");',
         'expect(padSource).toContain("- [ ] `bun run test` → 2733/2733");'),
        ('"| `bun run test` / `bun run test:watch` | repo root | unit tests (2721 checks / 259 files) |",',
         '"| `bun run test` / `bun run test:watch` | repo root | unit tests (2733 checks / 260 files) |",'),
        # the Last-Updated ordinal phrase
        ('expect(lastUpdated).toContain("the one-hundred-and-forty-fifth audit");',
         'expect(lastUpdated).toContain("the one-hundred-and-forty-sixth audit");'),
        # the project_state pin (the s185 prefixed form)
        ("expect(skillSource).toContain('project_state: \"2721 unit checks green');",
         "expect(skillSource).toContain('project_state: \"2733 unit checks green');"),
        # the pair-unity toBe members
        ('expect(UNIT).toBe("2721");',
         'expect(UNIT).toBe("2733");'),
        ('expect(FILES).toBe("259");',
         'expect(FILES).toBe("260");'),
    ])

# --- 5. the s181/s182/s183/s184 anchored-declaration census literals -----------
for nn in (181, 182, 183, 184):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(unitOut.trim()).toBe(`78 const UNIT = \"${UNIT}\";`);",
         "expect(unitOut.trim()).toBe(`79 const UNIT = \"${UNIT}\";`);"),
        ("expect(filesOut.trim()).toBe(`77 const FILES = \"${FILES}\";`);",
         "expect(filesOut.trim()).toBe(`78 const FILES = \"${FILES}\";`);"),
    ])

# --- 6. the s186..s197 bare-form project_state pins --------------------
# (the fuller 'project_state:' prefixed form rode in wave 3 above for
# s185; s186..s197 carry the BARE substring form — the two
# pin-form shapes of the same live claim, the s159 family's own
# reminder that the rider enumerates forms, not intentions)
for nn in (186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197):
    patch(f"tests/lows-s{nn}.test.ts", [
        ('expect(skillSource).toContain("2721 unit checks green");',
         'expect(skillSource).toContain("2733 unit checks green");'),
    ])
