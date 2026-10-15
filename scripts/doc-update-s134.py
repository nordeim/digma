#!/usr/bin/env python3
"""The session-134 docs update: the count-family re-anchor (1916 = 1894 + 22
unit / 196 files) across every LIVE claim site, the PAD §7.1 row for
tests/lows-s134.test.ts, the AGENTS session-134 bullet (the LIVE ANCHOR
family's carry), and the spec-constants re-anchor for the per-session
count-honesty family.

Frozen historical rows (the session-133 bullet's own count record, the
v1.112.0 header's record, the worklog's delivery records) are NEVER touched
— the F106 live-claim-sites-only doctrine.

Run from the repo root:  python3 scripts/doc-update-s134.py
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
    ("| Unit tests (1894 checks) | `bun run test` |",
     "| Unit tests (1916 checks) | `bun run test` |"),
    ("`bun run test` (1894) → `bun run build`",
     "`bun run test` (1916) → `bun run build`"),
])

# --- CLAUDE.md ---------------------------------------------------------------
patch("CLAUDE.md", [
    ("| `bun run test` | Unit tests (1894 checks, Vitest) |",
     "| `bun run test` | Unit tests (1916 checks, Vitest) |"),
    ("`bun run test:e2e` (1894 unit / 73 smoke / 262 e2e).",
     "`bun run test:e2e` (1916 unit / 73 smoke / 262 e2e)."),
    ("- **Unit Tests** (Vitest, 1894 checks):",
     "- **Unit Tests** (Vitest, 1916 checks):"),
])

# --- README.md ---------------------------------------------------------------
patch("README.md", [
    ("| Unit tests | Vitest | 5 | 1894 checks",
     "| Unit tests | Vitest | 5 | 1916 checks"),
    ("bun run test              # unit tests — 1894 checks",
     "bun run test              # unit tests — 1916 checks"),
])

# --- digma_SKILL.md -----------------------------------------------------------
patch("digma_SKILL.md", [
    ('project_state: "1894 unit checks green',
     'project_state: "1916 unit checks green'),
    ("| Unit tests | Vitest | ≥5.0.1 | 1894 checks; `*.test.ts` only |",
     "| Unit tests | Vitest | ≥5.0.1 | 1916 checks; `*.test.ts` only |"),
    ("bun run test          # 1894/1894",
     "bun run test          # 1916/1916"),
])

# --- Project_Architecture_Document.md ----------------------------------------
# the §7.1 row for the s134 spec + the Unit-total + the checklist + the
# §9.2 command-table count (the v1.112.0 header line stays FROZEN — it is
# the prior session's own record)
patch("Project_Architecture_Document.md", [
    # 1. the new §7.1 row, inserted between the s133 row and the Unit total
    (
        "the s133 script provenance anchors (live133/nav133/seo-s133 — the 109th audit, the 110th session, the 70th clip ordinal, the S132 delivery at HEAD 9e34254)) | `tests/lows-s133.test.ts` | 21 | tests | Vitest |\n| **Unit total** | **195 files** | **1894** | | Vitest |",
        "the s133 script provenance anchors (live133/nav133/seo-s133 — the 109th audit, the 110th session, the 70th clip ordinal, the S132 delivery at HEAD 9e34254)) | `tests/lows-s133.test.ts` | 21 | tests | Vitest |\n"
        "| Unit — THE RESIZE ARM'S LIVE-ELEMENT READ + THE EVERY-SAVE ID-CHURN REGISTRATIONS (the eighty-second audit's chosen work: S134-A — the resize handle's pointerdown reads the LIVE element through the handler's own store capture (the render-captured selected memo's live twin: the row found by live-selection membership, the drag's geometry AND identity inheriting the fresh id, the memo fallback keeping the deleted-mid-window floor — the A133-I1 family's last fixable member); S134-B — the layers-rename strand's by-design registration (the S129-D form: the id-keyed session vs the every-save churn, the unmount draft loss (Chromium fires no blur on node removal — the S78-C datum), the wrong-row trade refused, the store-level remap-handoff the closure form); S134-C — the upload chain's remap-strand registration (the S129-D form inside commitUpload: the async chain's frozen id, the live-read fallthrough, the S109-A no-op floor, the re-pick cost); S134-D — the registration family (the DnD pair's honest drop-refusal, the fillKey comment-truth repair (the every-save churn fires the tab re-derive on any save), the draw-commit sibling (the active foreign slider drag's intent-order inversion — the A88-I1 posture class), the AI send's targetIds registration (the S105-B honest-count floor), the PATCH clampColor stale-fallback registration); S134-E — the PAD §10 B84-I3 row repair (the login sibling joins the resend-otp arm — the family's registry carries its full census); the survival set — the S133 seams (the hit-branch live read, the desktop update live read, the S133-C/S133-D registrations, the §9.2 row), the flush census staying 3 + the draw block's S119-B tokens, the commitUpload helper structure + the S113-B target-scope tokens, the render-side visibility gate, the s134 script provenance anchors (live134/nav134/seo-s134 — the 110th audit, the 111th session, the 71st clip ordinal, the S133 delivery at HEAD c366767)) | `tests/lows-s134.test.ts` | 20 | tests | Vitest |\n"
        "| **Unit total** | **196 files** | **1916** | | Vitest |",
    ),
    # 2. the pre-ship checklist
    ("- [ ] `bun run test` → 1894/1894",
     "- [ ] `bun run test` → 1916/1916"),
    # 3. the §9.2 command table count
    ("| `bun run test` / `bun run test:watch` | repo root | unit tests (1894 checks / 195 files) |",
     "| `bun run test` / `bun run test:watch` | repo root | unit tests (1916 checks / 196 files) |"),
])

# --- the AGENTS session-134 bullet (the LIVE ANCHOR family's carry) -----------
AGENTS_BULLET = """- **The resize-live-read/every-save-churn-registrations seams (session 134, S134-A..S134-F — the eighty-second Mode C audit's chosen work):** (a) THE RESIZE ARM'S LIVE-ELEMENT READ (S134-A / A134-I1 — the eighty-second audit's Informational, the A133-I1 family's last fixable member): the resize handle's pointerdown read the RENDER-CAPTURED selected memo while markSaved's every-save id remap can land between the render and the pointerdown — the stale el.id armed a DEAD RESIZE (the S109-A id-guard no-opping every tick, endGesture net-zero); the closure reads the LIVE element at pointerdown time through the handler's own store capture (markSaved remaps selectedIds too), the drag's geometry AND identity inheriting the fresh id, the memo fallback keeping the deleted-mid-window floor; (b) THE LAYERS-RENAME STRAND'S BY-DESIGN REGISTRATION (S134-B / A134-L1 — the Low): the rename session keys on the render-bound row id, and the every-save churn unmounts the focused input mid-edit — Chromium fires no blur on node removal (the S78-C datum), so the typed draft is lost; registered with the wrong-row trade refused (the S133-C rationale) and the store-level remap-handoff named as the closure form; (c) THE UPLOAD CHAIN'S REMAP-STRAND REGISTRATION (S134-C / A134-L2 — the Low): commitUpload's async chain holds the file-pick-time element, a save response landing mid-chain rekeys the id, the live-read falls to the stale row, and the commit no-ops through the S109-A guard — the silently dropped upload registered with the re-pick cost; (d) THE REGISTRATION FAMILY (S134-D — the smalls fold): the DnD pair's honest drop-refusal, the fillKey comment-truth repair (the every-save churn fires the tab re-derive on any save — the cosmetic snap-back registered), the draw-commit sibling (the active foreign slider drag's intent-order inversion, no data loss — the A88-I1 posture class), the AI send's targetIds registration (the S105-B honest-count floor the designed boundary), the PATCH clampColor stale-fallback registration (the elements-PUT empty-string sibling named); (e) THE PAD §10 B84-I3 ROW REPAIR (S134-E / B134-L1: the login sibling joins the resend-otp arm — the row the S133-D registration cites carries the family's full census); (f) the per-session pin family (tests/lows-s134.test.ts — 20 pins: 11 RED / 9 survival; the three s134 script derivations 22/66/6) and the collateral family (the s79 epoch-window widening 6000→7000 — the F89/S102-B class; the PAD §11 rows canvas 1010→1042, properties-panel 2281→2307, layers-panel 401→436, ai-assistant.tsx 798→813 with the enriched S134 seam descriptions; the count family 1916 = 1894 + 22 unit / 196 files). Pinned by `tests/lows-s134.test.ts`.\n"""

agents = ROOT / "AGENTS.md"
text = agents.read_text()
anchor = "Pinned by `tests/lows-s133.test.ts`.\n"
if anchor not in text:
    raise SystemExit(f"MISSING AGENTS anchor: {anchor!r}")
text = text.replace(anchor, anchor + AGENTS_BULLET, 1)
agents.write_text(text)
print("AGENTS.md: the session-134 bullet added (the LIVE ANCHOR carry)")

# --- the per-session spec constants (the standing convention) ----------------
tests_dir = ROOT / "tests"
changed = []
for p in sorted(tests_dir.glob("*.test.ts")):
    text = p.read_text()
    orig = text
    text = text.replace('const UNIT = "1894";', 'const UNIT = "1916";')
    text = text.replace('const FILES = "195";', 'const FILES = "196";')
    if text != orig:
        p.write_text(text)
        changed.append(p.name)

print(f"{len(changed)} spec files re-anchored onto 1916/196:")
for name in changed:
    print(f"  {name}")

print("count-family re-anchor complete: 1916 = 1894 + 22 unit / 196 files")
