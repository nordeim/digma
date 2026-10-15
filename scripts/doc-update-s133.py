#!/usr/bin/env python3
"""The session-133 docs update: the count-family re-anchor (1894 = 1873 + 21
unit / 195 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s133.test.ts, the AGENTS session-133 bullet (the LIVE ANCHOR
family's carry), and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-132 bullet's own count record, the
v1.111.0 header's record, the worklog's delivery records) are NEVER touched
— the F106 live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s133.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

def patch(path: str, subs: list[tuple[str, str]]) -> None:
    p = ROOT / path
    text = p.read_text()
    for old, new in subs:
        if old not in text:
            raise SystemExit(f"MISSING in {path}: {old[:100]!r}")
        n = text.count(old)
        if n != 1:
            raise SystemExit(f"AMBIGUOUS ({n} hits) in {path}: {old[:100]!r}")
        text = text.replace(old, new)
    p.write_text(text)
    print(f"{path}: {len(subs)} live claim sites re-anchored")

# --- AGENTS.md --------------------------------------------------------------
patch("AGENTS.md", [
    ("| Unit tests (1873 checks) | `bun run test` |",
     "| Unit tests (1894 checks) | `bun run test` |"),
    ("`bun run test` (1873) → `bun run build`",
     "`bun run test` (1894) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (1873 checks, Vitest) |",
     "| `bun run test` | Unit tests (1894 checks, Vitest) |"),
    ("`bun run test:e2e` (1873 unit / 73 smoke / 262 e2e).",
     "`bun run test:e2e` (1894 unit / 73 smoke / 262 e2e)."),
    ("- **Unit Tests** (Vitest, 1873 checks):",
     "- **Unit Tests** (Vitest, 1894 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 1873 checks",
     "| Unit tests | Vitest | 5 | 1894 checks"),
    ("bun run test              # unit tests — 1873 checks",
     "bun run test              # unit tests — 1894 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "1873 unit checks green',
     'project_state: "1894 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 1873 checks; `*.test.ts` only |",
     "| Unit tests | Vitest | ≥5.0.1 | 1894 checks; `*.test.ts` only |"),
    ("bun run test          # 1873/1873",
     "bun run test          # 1894/1894"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s133 spec + the Unit-total + the checklist + the
# §9.2 command-table count (the v1.111.0 header line stays FROZEN — it is
# the prior session's own record)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s132 row and the Unit total
    (
        "the s132 script provenance anchors (live132/nav132/seo-s132 — the 108th audit, the 109th session, the 69th clip ordinal, the S131 delivery at HEAD 7513c09)) | `tests/lows-s132.test.ts` | 16 | tests | Vitest |\n| **Unit total** | **194 files** | **1873** | | Vitest |",
        "the s132 script provenance anchors (live132/nav132/seo-s132 — the 108th audit, the 109th session, the 69th clip ordinal, the S131 delivery at HEAD 7513c09)) | `tests/lows-s132.test.ts` | 16 | tests | Vitest |\n"
        "| Unit — THE HIT BRANCH'S LIVE-LIST READ + THE HOST-DRIFT REPAIR + THE BY-DESIGN REGISTRATIONS (the eighty-first audit's chosen work: S133-A — the pointerdown hit branch reads the LIVE list through the handler's own store capture: the hit test, the shift-toggle, and the select commit never read the render-captured subscription (the A132-I1 family's census extension — a stale hit.id stranding a dangling selection and arming a dead move-drag, the S109-A id-guard no-opping every tick; the move-drag's ids inheriting the live-derived nextIds); S133-B — the desktop panel's update reads the LIVE selection at commit time, the mobile host's own read direction (the host-drift repair: the render-captured selectedIds closure vs the mobile twin's live s.selectedIds — the two hosts now share the one read direction, the pin-compatible literals preserved by construction); S133-C — the layers row-click's by-design registration (the S129-D documented-absence form: the id BOUND AT RENDER, index-matching the wrong-element trade, the family's theoretical sub-frame); S133-D — the login route's B84-I3 sibling registration (the unverified-branch update's stale-verifyCode race named — the S70-D conditional form the promotion path, the sub-10ms race self-healing); S133-E — the PAD §9.2 db:reset row repair (the dead script name retired, the honest reset path db:push + db:seed named); the survival set — the S132 seams (the marquee live-list read, the A130-I1 registration, the s66 preservation contract), the S131 seams (the composed mount, the four layers stand-downs), the S130 arms (the keyTick head, one wheel twin), the mobile host's live-update form, the desktop update's pin-compatible literals, the login catch arms, the s133 script provenance anchors (live133/nav133/seo-s133 — the 109th audit, the 110th session, the 70th clip ordinal, the S132 delivery at HEAD 9e34254)) | `tests/lows-s133.test.ts` | 21 | tests | Vitest |\n"
        "| **Unit total** | **195 files** | **1894** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 1873/1873",
     "- [ ] `bun run test` → 1894/1894"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1873 checks / 194 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (1894 checks / 195 files) |"),
])

# --- the AGENTS session-133 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The hit-branch-live-list/host-drift/by-design-registrations seams (session 133, S133-A..S133-F — the eighty-first Mode C audit's chosen work):** (a) THE HIT BRANCH'S LIVE-LIST READ (S133-A / A133-I1 — the eighty-first audit's Informational, the A132-I1 family's census extension): the pointerdown hit test, the shift-toggle, and the select commit all read the RENDER-CAPTURED subscription while markSaved's id remap can land between the render and the pointerdown — a stale hit.id stranding a dangling selection and arming a dead move-drag (the S109-A id-guard no-ops every tick); the closure reads the LIVE list at pointerdown time through the handler's own store capture, the move-drag's ids inheriting the live-derived nextIds; (b) THE DESKTOP UPDATE'S LIVE-SELECTION READ (S133-B / A133-I1 — the host-drift repair): the desktop panel's `update` passed the render-captured selectedIds closure while the MOBILE host's twin already read the live s.selectedIds — the first argument now reads the live selection at commit time (the S132-A family form, the two hosts sharing the one read direction, the pin-compatible literals preserved by construction); (c) THE LAYERS ROW-CLICK'S BY-DESIGN REGISTRATION (S133-C / A133-I1 — the S129-D documented-absence form): the row click's id is BOUND AT RENDER — no live-read form exists (index-matching would trade the cosmetic self-healing dangling selection for a REAL wrong-element selection), the window the family's theoretical sub-frame; (d) THE LOGIN ROUTE'S B84-I3 SIBLING REGISTRATION (S133-D / B133-I2 — the unverified-branch update registered as the stale-verifyCode race's missed sibling: the S70-D conditional form the closure if ever promoted, the sub-10ms race self-healing, the family's standing disposition); (e) THE PAD §9.2 db:reset ROW REPAIR (S133-E / B133-I1: the command table listed the script S63-G deleted 70 sessions ago — the honest reset path db:push + db:seed named); (f) the per-session pin family (tests/lows-s133.test.ts — 21 pins: 10 RED / 11 survival; the three s133 script derivations 22/66/6) and the collateral family (the PAD §11 rows canvas 998→1010, properties-panel 2272→2281, layers-panel 386→401 with the enriched S133 seam descriptions; the count family 1894 = 1873 + 21 unit / 195 files). Pinned by `tests/lows-s133.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s132.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-133 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "1873";', 'const UNIT = "1894";')
    text = text.replace('const FILES = "194";', 'const FILES = "195";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 1894/195:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 1894 = 1873 + 21 unit / 195 files")
