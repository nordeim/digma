#!/usr/bin/env python3
"""rider-fixes-s197.py — the Session 197 count-family rider: the +12
count movement's own receipt across the pin families (the S186..S196
rider-fixes form — the rider re-anchors the LIVE claims that
the deliberate movement moved; frozen records never rewritten):

  1. the s185..s196 live Unit-total row / checklist / command-row
     pins (258/2709 -> 259/2721);
  2. the s185..s196 Last-Updated ordinal phrases (the
     one-hundred-and-forty-fourth audit -> the
     one-hundred-and-forty-fifth audit — the title-pin rider
     family's known form);
  3. the s185 project_state pin (the prefixed form) + the s186..s196
     project_state pins (the bare form) (2709 -> 2721);
  4. the s185..s196 pair-unity toBe members (UNIT/FILES);
  5. the s181/s182/s183/s184 anchored-declaration census literals
     (77/76 -> 78/77 — the grep uniq -c form).

NO layer-total rider this cycle — the layer STAYS at 14,373 (the
in-place comment-correction form).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/rider-fixes-s197.py
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


# --- 1-4. the s185..s196 live count pins --------------------------
for nn in (185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196):
    patch(f"tests/lows-s{nn}.test.ts", [
        # the live Unit-total row / checklist / command-row pins
        ('expect(padSource).toContain("| **Unit total** | **258 files** | **2709** | | Vitest |");',
         'expect(padSource).toContain("| **Unit total** | **259 files** | **2721** | | Vitest |");'),
        ('expect(padSource).toContain("- [ ] `bun run test` → 2709/2709");',
         'expect(padSource).toContain("- [ ] `bun run test` → 2721/2721");'),
        ('"| `bun run test` / `bun run test:watch` | repo root | unit tests (2709 checks / 258 files) |",',
         '"| `bun run test` / `bun run test:watch` | repo root | unit tests (2721 checks / 259 files) |",'),
        # the Last-Updated ordinal phrase
        ('expect(lastUpdated).toContain("the one-hundred-and-forty-fourth audit");',
         'expect(lastUpdated).toContain("the one-hundred-and-forty-fifth audit");'),
        # the project_state pin (the s185 prefixed form)
        ("expect(skillSource).toContain('project_state: \"2709 unit checks green');",
         "expect(skillSource).toContain('project_state: \"2721 unit checks green');"),
        # the pair-unity toBe members
        ('expect(UNIT).toBe("2709");',
         'expect(UNIT).toBe("2721");'),
        ('expect(FILES).toBe("258");',
         'expect(FILES).toBe("259");'),
    ])

# --- 5. the s181/s182/s183/s184 anchored-declaration census literals -----------
for nn in (181, 182, 183, 184):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(unitOut.trim()).toBe(`77 const UNIT = \"${UNIT}\";`);",
         "expect(unitOut.trim()).toBe(`78 const UNIT = \"${UNIT}\";`);"),
        ("expect(filesOut.trim()).toBe(`76 const FILES = \"${FILES}\";`);",
         "expect(filesOut.trim()).toBe(`77 const FILES = \"${FILES}\";`);"),
    ])

# --- 6. the s186..s196 bare-form project_state pins --------------------
# (the fuller 'project_state:' prefixed form rode in wave 4 above for
# s185; s186..s196 carry the BARE substring form — the two
# pin-form shapes of the same live claim, the s159 family's own
# reminder that the rider enumerates forms, not intentions)
for nn in (186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196):
    patch(f"tests/lows-s{nn}.test.ts", [
        ('expect(skillSource).toContain("2709 unit checks green");',
         'expect(skillSource).toContain("2721 unit checks green");'),
    ])
