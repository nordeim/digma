#!/usr/bin/env python3
"""rider-fixes-s186.py — the Session 186 GREEN collateral, part 3: the
remaining rider-family locksteps surfaced by the first full unit run
(the S186-A remediation's own collateral — every member an expected
rider, none a drift):

  1. the s145 template-literal className census (the S186-A wrapper's
     template literal is the THIRD src-scope member / the SECOND
     layer-scope member)
  2. the PAD §11 key-files rows (login-screen 741 -> 747; the e2e
     auth.spec 375 -> 392 — the geometry pin's own lines)
  3. the s181..s184 declaration-census literals (66/65 -> 67/66)
  4. the s185 spec's absolute literals (the pair-unity assertions
     2574/247 -> 2588/248; the PAD live-row pins; the SKILL
     project_state pin; the title pin's ordinal phrase onto the
     current chain head)

Idempotent: every patch skips if already applied.
Run from the repo root:  python3 scripts/rider-fixes-s186.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")


def patch(path: str, subs: list[tuple[str, str]], count: int | None = None) -> None:
    p = ROOT / path
    text = p.read_text()
    applied = 0
    for old, new in subs:
        if new in text and old not in text:
            continue  # already applied (idempotent re-run)
        if old not in text:
            raise SystemExit(f"MISSING in {path}: {old[:100]!r}")
        n = text.count(old)
        if count is not None and n != count:
            raise SystemExit(f"AMBIGUOUS ({n} hits, expected {count}) in {path}: {old[:100]!r}")
        text = text.replace(old, new)
        applied += 1
    p.write_text(text)
    print(f"{path}: {applied} rider sites re-anchored")

# --- 1. the s145 template-literal className census -----------------------------
# The S186-A wrapper's template literal is the THIRD src-scope member
# (the two content forms + the minimal-conditional composition form)
# and the SECOND layer-scope member. The worklog note pins (frozen)
# stay; only the LIVE census pins ride.
patch("tests/lows-s145.test.ts", [
    ("expect(srcScopeTemplateLiterals).toBe(2);", "expect(srcScopeTemplateLiterals).toBe(3);"),
    ("expect(layerScopeTemplateLiterals).toBe(1);", "expect(layerScopeTemplateLiterals).toBe(2);"),
])

# --- 2. the PAD §11 key-files rows ---------------------------------------------
patch("Project_Architecture_Document.md", [
    ("| `src/components/login-screen.tsx` | 741 |",
     "| `src/components/login-screen.tsx` | 747 |"),
    ("| `tests/e2e/auth.spec.ts` | 375 |",
     "| `tests/e2e/auth.spec.ts` | 392 |"),
])

# --- 3. the s181..s184 declaration-census literals -----------------------------
for spec in ("s181", "s182", "s183", "s184"):
    patch(f"tests/lows-{spec}.test.ts", [
        ("expect(unitOut.trim()).toBe(`66 const UNIT = \"${UNIT}\";`);",
         "expect(unitOut.trim()).toBe(`67 const UNIT = \"${UNIT}\";`);"),
        ("expect(filesOut.trim()).toBe(`65 const FILES = \"${FILES}\";`);",
         "expect(filesOut.trim()).toBe(`66 const FILES = \"${FILES}\";`);"),
    ])

# --- 4. the s185 spec's absolute literals --------------------------------------
patch("tests/lows-s185.test.ts", [
    # the pair-unity assertions (the declaration rode via the sweep; the
    # assertions carry the same figures — the pair-unity contract):
    ('expect(UNIT).toBe("2574");', 'expect(UNIT).toBe("2588");'),
    ('expect(FILES).toBe("247");', 'expect(FILES).toBe("248");'),
    # the PAD live-row pins (the rows the doc-update script rode):
    ('expect(padSource).toContain("| **Unit total** | **247 files** | **2574** | | Vitest |");',
     'expect(padSource).toContain("| **Unit total** | **248 files** | **2588** | | Vitest |");'),
    ('expect(padSource).toContain("- [ ] `bun run test` → 2574/2574");',
     'expect(padSource).toContain("- [ ] `bun run test` → 2588/2588");'),
    ('expect(padSource).toContain(\n      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2574 checks / 247 files) |",\n    );',
     'expect(padSource).toContain(\n      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2588 checks / 248 files) |",\n    );'),
    # the SKILL project_state pin:
    ('expect(skillSource).toContain(\'project_state: "2574 unit checks green\');',
     'expect(skillSource).toContain(\'project_state: "2588 unit checks green\');'),
    # the title pin's ordinal phrase rides onto the CURRENT chain head
    # (the s158 title-lag form — the Last-Updated line the pin finds is
    # the current head's):
    ('expect(lastUpdated).toContain("the one-hundred-and-thirty-third audit");',
     'expect(lastUpdated).toContain("the one-hundred-and-thirty-fourth audit");'),
])
