#!/usr/bin/env python3
"""rider-fixes-s196.py — the Session 196 count-family rider: the +12
count movement's own receipt across the pin families (the S186..S195
rider-fixes form — the rider re-anchors the LIVE claims that
the deliberate movement moved; frozen records never rewritten):

  1. the s185..s195 live Unit-total row / checklist / command-row
     pins (257/2697 -> 258/2709);
  2. the s185..s195 Last-Updated ordinal phrases (the
     one-hundred-and-forty-third audit -> the
     one-hundred-and-forty-fourth audit — the title-pin rider
     family's known form);
  3. the s185 project_state pin (the prefixed form) + the s186..s195
     project_state pins (the bare form) (2697 -> 2709);
  4. the s185..s195 pair-unity toBe members (UNIT/FILES);
  5. the s181/s182/s183/s184 anchored-declaration census literals
     (76/75 -> 77/76 — the grep uniq -c form).

NO layer-total rider this cycle — the layer STAYS at 14,373 (the
in-place comment-correction form).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/rider-fixes-s196.py
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


# --- 1-4. the s185..s195 live count pins --------------------------
for nn in (185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195):
    patch(f"tests/lows-s{nn}.test.ts", [
        # the live Unit-total row / checklist / command-row pins
        ('expect(padSource).toContain("| **Unit total** | **257 files** | **2697** | | Vitest |");',
         'expect(padSource).toContain("| **Unit total** | **258 files** | **2709** | | Vitest |");'),
        ('expect(padSource).toContain("- [ ] `bun run test` → 2697/2697");',
         'expect(padSource).toContain("- [ ] `bun run test` → 2709/2709");'),
        ('"| `bun run test` / `bun run test:watch` | repo root | unit tests (2697 checks / 257 files) |",',
         '"| `bun run test` / `bun run test:watch` | repo root | unit tests (2709 checks / 258 files) |",'),
        # the Last-Updated ordinal phrase
        ('expect(lastUpdated).toContain("the one-hundred-and-forty-third audit");',
         'expect(lastUpdated).toContain("the one-hundred-and-forty-fourth audit");'),
        # the project_state pin (the s185 prefixed form)
        ("expect(skillSource).toContain('project_state: \"2697 unit checks green');",
         "expect(skillSource).toContain('project_state: \"2709 unit checks green');"),
        # the pair-unity toBe members
        ('expect(UNIT).toBe("2697");',
         'expect(UNIT).toBe("2709");'),
        ('expect(FILES).toBe("257");',
         'expect(FILES).toBe("258");'),
    ])

# --- 5. the s181/s182/s183/s184 anchored-declaration census literals -----------
for nn in (181, 182, 183, 184):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(unitOut.trim()).toBe(`76 const UNIT = \"${UNIT}\";`);",
         "expect(unitOut.trim()).toBe(`77 const UNIT = \"${UNIT}\";`);"),
        ("expect(filesOut.trim()).toBe(`75 const FILES = \"${FILES}\";`);",
         "expect(filesOut.trim()).toBe(`76 const FILES = \"${FILES}\";`);"),
    ])

# --- 6. the s186..s195 bare-form project_state pins --------------------
# (the fuller 'project_state:' prefixed form rode in wave 4 above for
# s185; s186..s195 carry the BARE substring form — the two
# pin-form shapes of the same live claim, the s159 family's own
# reminder that the rider enumerates forms, not intentions)
for nn in (186, 187, 188, 189, 190, 191, 192, 193, 194, 195):
    patch(f"tests/lows-s{nn}.test.ts", [
        ('expect(skillSource).toContain("2697 unit checks green");',
         'expect(skillSource).toContain("2709 unit checks green");'),
    ])
