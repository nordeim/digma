#!/usr/bin/env python3
"""rider-fixes-s191.py — the Session 191 count-family rider: the +12
count movement's own receipt across the pin families (the S186/S187/
S188/S189/S190 rider-fixes form — the rider re-anchors the LIVE claims that
the deliberate movement moved; frozen records never rewritten):

  1. the s185/s186/s187/s188/s189/s190 live Unit-total row / checklist /
     command-row pins (252/2637 -> 253/2649);
  2. the s185/s186/s187/s188/s189/s190 Last-Updated ordinal phrases (the
     one-hundred-and-thirty-eighth audit -> the one-hundred-and-
     thirty-ninth audit — the title-pin rider family's known form);
  3. the s185 project_state pin (the prefixed form) + the s186/s187/
     s188/s189/s190 project_state pins (the bare form) (2637 -> 2649);
  4. the s185/s186/s187/s188/s189/s190 pair-unity toBe members (UNIT/FILES);
  5. the s181/s182/s183/s184 anchored-declaration census literals
     (71/70 -> 72/71 — the grep uniq -c form).

NO layer-total rider this cycle — the layer STAYS at 14,373 (the
zero-movement form).

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/rider-fixes-s191.py
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


# --- 1-4. the s185/s186/s187/s188/s189/s190 live count pins --------------------------
for nn in (185, 186, 187, 188, 189, 190):
    patch(f"tests/lows-s{nn}.test.ts", [
        # the live Unit-total row / checklist / command-row pins
        ('expect(padSource).toContain("| **Unit total** | **252 files** | **2637** | | Vitest |");',
         'expect(padSource).toContain("| **Unit total** | **253 files** | **2649** | | Vitest |");'),
        ('expect(padSource).toContain("- [ ] `bun run test` → 2637/2637");',
         'expect(padSource).toContain("- [ ] `bun run test` → 2649/2649");'),
        ('"| `bun run test` / `bun run test:watch` | repo root | unit tests (2637 checks / 252 files) |",',
         '"| `bun run test` / `bun run test:watch` | repo root | unit tests (2649 checks / 253 files) |",'),
        # the Last-Updated ordinal phrase
        ('expect(lastUpdated).toContain("the one-hundred-and-thirty-eighth audit");',
         'expect(lastUpdated).toContain("the one-hundred-and-thirty-ninth audit");'),
        # the project_state pin (the s185 prefixed form)
        ("expect(skillSource).toContain('project_state: \"2637 unit checks green');",
         "expect(skillSource).toContain('project_state: \"2649 unit checks green');"),
        # the pair-unity toBe members
        ('expect(UNIT).toBe("2637");',
         'expect(UNIT).toBe("2649");'),
        ('expect(FILES).toBe("252");',
         'expect(FILES).toBe("253");'),
    ])

# --- 5. the s181/s182/s183/s184 anchored-declaration census literals -----------
for nn in (181, 182, 183, 184):
    patch(f"tests/lows-s{nn}.test.ts", [
        ("expect(unitOut.trim()).toBe(`71 const UNIT = \"${UNIT}\";`);",
         "expect(unitOut.trim()).toBe(`72 const UNIT = \"${UNIT}\";`);"),
        ("expect(filesOut.trim()).toBe(`70 const FILES = \"${FILES}\";`);",
         "expect(filesOut.trim()).toBe(`71 const FILES = \"${FILES}\";`);"),
    ])

# --- 6. the s186/s187/s188/s189/s190 bare-form project_state pins --------------------
# (the fuller 'project_state:' prefixed form rode in wave 4 above for
# s185; s186..s190 carry the BARE substring form — the two
# pin-form shapes of the same live claim, the s159 family's own
# reminder that the rider enumerates forms, not intentions)
for nn in (186, 187, 188, 189, 190):
    patch(f"tests/lows-s{nn}.test.ts", [
        ('expect(skillSource).toContain("2637 unit checks green");',
         'expect(skillSource).toContain("2649 unit checks green");'),
    ])
