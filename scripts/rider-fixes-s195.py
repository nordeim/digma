#!/usr/bin/env python3
"""rider-fixes-s195.py — the Session 195 count-family rider: the +12
count movement's own receipt across the pin families (the S186..S194
rider-fixes form — the rider re-anchors the LIVE claims that
the deliberate movement moved; frozen records never rewritten):

  1. the s185..s194 live Unit-total row / checklist / command-row
     pins (256/2685 -> 257/2697);
  2. the s185..s194 Last-Updated ordinal phrases (the
     one-hundred-and-forty-second audit -> the
     one-hundred-and-forty-third audit — the title-pin rider
     family's known form);
  3. the s185 project_state pin (the prefixed form) + the s186..s194
     project_state pins (the bare form) (2685 -> 2697);
  4. the s185..s194 pair-unity toBe members (UNIT/FILES);
  5. the s181/s182/s183/s184 anchored-declaration census literals
     (75/74 -> 76/75 — the grep uniq -c form).

NO layer-total rider this cycle — the layer STAYS at 14,373 (the
in-place comment-correction form).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/rider-fixes-s195.py
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


# --- 1-4. the s185..s194 live count pins --------------------------
for nn in (185, 186, 187, 188, 189, 190, 191, 192, 193, 194):
    patch(f"tests/lows-s{nn}.test.ts", [
        # the live Unit-total row / checklist / command-row pins
        ('expect(padSource).toContain("| **Unit total** | **256 files** | **2685** | | Vitest |");',
         'expect(padSource).toContain("| **Unit total** | **257 files** | **2697** | | Vitest |");'),
        ('expect(padSource).toContain("- [ ] `bun run test` → 2685/2685");',
         'expect(padSource).toContain("- [ ] `bun run test` → 2697/2697");'),
        ('"| `bun run test` / `bun run test:watch` | repo root | unit tests (2685 checks / 256 files) |",',
         '"| `bun run test` / `bun run test:watch` | repo root | unit tests (2697 checks / 257 files) |",'),
        # the Last-Updated ordinal phrase
        ('expect(lastUpdated).toContain("the one-hundred-and-forty-second audit");',
         'expect(lastUpdated).toContain("the one-hundred-and-forty-third audit");'),
        # the project_state pin (the s185 prefixed form)
        ("expect(skillSource).toContain('project_state: \"2685 unit checks green');",
         "expect(skillSource).toContain('project_state: \"2697 unit checks green');"),
        # the pair-unity toBe members
        ('expect(UNIT).toBe("2685");',
         'expect(UNIT).toBe("2697");'),
        ('expect(FILES).toBe("256");',
         'expect(FILES).toBe("257");'),
    ])

# --- 5. the s181/s182/s183/s184 anchored-declaration census literals -----------
for nn in (181, 182, 183, 184):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(unitOut.trim()).toBe(`75 const UNIT = \"${UNIT}\";`);",
         "expect(unitOut.trim()).toBe(`76 const UNIT = \"${UNIT}\";`);"),
        ("expect(filesOut.trim()).toBe(`74 const FILES = \"${FILES}\";`);",
         "expect(filesOut.trim()).toBe(`75 const FILES = \"${FILES}\";`);"),
    ])

# --- 6. the s186..s194 bare-form project_state pins --------------------
# (the fuller 'project_state:' prefixed form rode in wave 4 above for
# s185; s186..s194 carry the BARE substring form — the two
# pin-form shapes of the same live claim, the s159 family's own
# reminder that the rider enumerates forms, not intentions)
for nn in (186, 187, 188, 189, 190, 191, 192, 193, 194):
    patch(f"tests/lows-s{nn}.test.ts", [
        ('expect(skillSource).toContain("2685 unit checks green");',
         'expect(skillSource).toContain("2697 unit checks green");'),
    ])
