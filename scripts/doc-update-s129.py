#!/usr/bin/env python3
"""Session 129 — the docs alignment: PAD v1.108.0 (title drift repaired
en-route: the title sat at v1.105.0 for two deliveries), the AGENTS
session-129 bullet, the digma_SKILL v1.107.0 bump with lesson F116,
the PAD §11 rows (canvas/properties-panel/seed/elements), the §7.1
lows-s129 row + Unit-total, and the count-family re-anchor
1808 -> 1820 / 190 -> 191 across every live claim site.

Run from the repo root:  python3 scripts/doc-update-s129.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

S129_SUMMARY = (
    "**Last Updated:** 2026-10-14 (v1.108.0 — the keyboard-arm/dead-flag/seed-hoist/by-design-note pass: "
    "S129-A THE SLIDERS' KEYBOARD ARM (A129-L1 — the seventy-seventh audit's Low: the five range inputs' gesture terminals were pointer-bound only — a keyboard-driven change (the arrow keys with OS key-repeat, PageUp/PageDown, Home/End) fired onChange with NO gesture armed, and the gesture-aware update committed a FULL history snapshot + redo wipe per keypress: holding an arrow across a 0-100 slider evicted the entire 60-deep past stack in seconds, the S62-A flooding class through the one dispatch surface the pointer seam never covered; the closure: the keyTick primitive composed on armText + the SLIDER_KEYS const + onKeyDown on all five inputs (the SliderRow template + the four inline literals) — the keydown arms the coalescing burst BEFORE the value change, the onChange's tick marks, the 150ms idle terminates: a key-repeat burst coalesces into ONE entry; NO blur terminal (a blur mid-pointer-drag would pass the same-surface token check and end the LIVE drag's gesture — the S126-B class); the live-pointer-drag discrimination `activeSurface === surface && idleTimer === null` -> return keeps the idle from re-arming mid-drag (the S123-C lesson — the keyboard ticks ride the live gesture with commit=false, the pointer's own terminals the sole enders)) "
    "+ S129-B THE DEAD moved FLAG RETIRED (A129-I1 — S128-B's unconditional endGesture removed the DragState move/resize members' optional moved flag's last reader; the type fields and both writes deleted, the orphaning registered at the type seam — the dead-member retirement convention's next member) "
    "+ S129-C THE SEED'S HASH HOIST (B129-I1 — the scrypt hash computed BEFORE the $transaction opens, register's own S83-D form: sync CPU work out of the SQLite writer window; the hash has no transaction dependency) "
    "+ S129-D THE ELEMENTS POST BY-DESIGN NOTE (B129-I2 — the P2025 arm's absence documented at the catch: the POST's only single-row-keyed write is the inner tx.project.update, which runs only after the FK-checked tx.designElement.create — SQLite's serialized writers mean the vanished-project race always answers P2003 at the create first; the verify-otp sibling's documented-absence form) "
    "+ S129-E the per-session pin family (tests/lows-s129.test.ts — 12 pins: 8 RED / 4 survival; the three s129 script derivations 22/66/6) "
    "+ the collateral family (the theme.test.ts window widening 800 -> 1100 + the low-batch-s66 label-scoped onKeyDown match — the F89/S102-B class; the PAD §11 rows canvas.tsx 971->978, properties-panel.tsx 2165->2224, seed.ts 191->198, elements route 413->420 with the enriched seam descriptions); "
    "the count-family re-anchor 1820 = 1808 + 12 unit / 191 files across every live claim site (54 sites); "
    "the 105th reference audit NO DRIFT (the clip pin byte-identical the 66th consecutive session); mobile nav 9/9 the 106th session; "
    "the seventy-seventh Mode C audit 0C/0H/0M/1L/4I; the PAD title's missed v1.106.0/v1.107.0 bumps repaired en-route — the title now carries v1.108.0)"
)

OLD_UPDATED_PREFIX = "**Last Updated:** 2026-10-14 (v1.107.0 — the pan-modality/net-zero-terminal/census-truth pass:"

# --- PAD: title + Last Updated -------------------------------------------
pad = (ROOT / "Project_Architecture_Document.md").read_text()

old_title = "# Digma — Master Project Architecture Document (PAD) v1.105.0"
new_title = "# Digma — Master Project Architecture Document (PAD) v1.108.0"
if old_title not in pad:
    raise SystemExit("MISSING PAD title anchor")
pad = pad.replace(old_title, new_title, 1)

# Replace the whole Last Updated line (it is one long line).
lines = pad.split("\n")
for i, ln in enumerate(lines):
    if ln.startswith(OLD_UPDATED_PREFIX):
        lines[i] = S129_SUMMARY
        break
else:
    raise SystemExit("MISSING PAD Last Updated anchor")
pad = "\n".join(lines)

# --- PAD: the §7.1 Unit-total + checklist + command table + new row ------
s71_sites = [
    (
        "| **Unit total** | **190 files** | **1808** | | Vitest |",
        "| **Unit total** | **191 files** | **1820** | | Vitest |",
    ),
    (
        "- [ ] `bun run test` → 1808/1808",
        "- [ ] `bun run test` → 1820/1820",
    ),
    (
        "unit tests (1808 checks / 190 files)",
        "unit tests (1820 checks / 191 files)",
    ),
]
for old, new in s71_sites:
    if old not in pad:
        raise SystemExit(f"MISSING PAD §7.1 anchor: {old[:60]!r}")
    pad = pad.replace(old, new, 1)

NEW_S71_ROW = (
    "| Unit — THE SLIDERS' KEYBOARD ARM (the seventy-seventh audit's Low: A129-L1 — the five range inputs' gesture terminals were pointer-bound only, so a keyboard-driven change fired onChange with no gesture armed and the gesture-aware update committed a full history snapshot + redo wipe per keypress — the S62-A flooding class through the keyboard dispatch surface; the keyTick primitive composed on armText, the SLIDER_KEYS const, onKeyDown on all five inputs, the 150ms idle the sole terminal (no blur — a mid-drag blur would end the live gesture, the S126-B class), the live-pointer-drag discrimination keeping the idle from re-arming mid-drag (the S123-C lesson)) + THE DEAD moved FLAG RETIRED (S129-B — the DragState move/resize members' optional moved flag orphaned by S128-B's unconditional endGesture, the type fields and both writes deleted with the registration at the type seam) + THE SEED'S HASH HOIST (S129-C — the scrypt hash computed before the $transaction opens, register's S83-D form) + THE ELEMENTS POST BY-DESIGN NOTE (S129-D — the P2025 arm's absence documented at the catch: the inner tx.project.update runs only after the FK-checked create, the vanished-project race always answering P2003 first) + the s129 script family pins (the live129/nav129/seo-s129 provenance anchors — the 105th audit, the 106th session, the 66th clip ordinal, the S128 delivery at HEAD 5322b3b) + the S128 survival pins (the pan-modality refusal, the unconditional endGesture, the transactional wipe) | `tests/lows-s129.test.ts` | 12 | tests | Vitest |"
)
anchor_row = None
for ln in pad.split("\n"):
    if ln.startswith("| Unit — THE HANDLE'S PAN-MODALITY REFUSAL"):
        anchor_row = ln
        break
if anchor_row is None:
    raise SystemExit("MISSING §7.1 s128 row anchor")
pad = pad.replace(anchor_row, anchor_row + "\n" + NEW_S71_ROW, 1)

# --- PAD: the §11 rows ----------------------------------------------------
s11_sites = [
    (
        "| `src/components/editor/canvas.tsx` | 971 |",
        "| `src/components/editor/canvas.tsx` | 978 |",
    ),
    (
        "| `src/components/editor/properties-panel.tsx` | 2165 |",
        "| `src/components/editor/properties-panel.tsx` | 2224 |",
    ),
    (
        "| `src/app/api/projects/[id]/elements/route.ts` | 413 |",
        "| `src/app/api/projects/[id]/elements/route.ts` | 420 |",
    ),
    (
        "| `prisma/seed.ts` | 191 |",
        "| `prisma/seed.ts` | 198 |",
    ),
]
for old, new in s11_sites:
    if old not in pad:
        raise SystemExit(f"MISSING PAD §11 anchor: {old[:60]!r}")
    pad = pad.replace(old, new, 1)

# The §11 seam-description enrichments (append into each row's purpose cell).
canvas_row_old = "renders only VISIBLE elements (S19); the LOCKED pointer wall (S23)"
canvas_row_new = (
    "renders only VISIBLE elements (S19); the DEAD moved FLAG RETIREMENT (S129-B — the DragState "
    "move/resize members' optional moved flag, orphaned by S128-B's unconditional endGesture, deleted "
    "with the registration at the type seam — the dead-member retirement convention); the LOCKED pointer wall (S23)"
)
if canvas_row_old not in pad:
    raise SystemExit("MISSING canvas §11 description anchor")
pad = pad.replace(canvas_row_old, canvas_row_new, 1)

panel_row_old = "| `src/components/editor/properties-panel.tsx` | 2224 | Reference five-section layout + Transform scale (ADR-011/012);"
panel_row_new = (
    "| `src/components/editor/properties-panel.tsx` | 2224 | Reference five-section layout + Transform scale (ADR-011/012); "
    "THE SLIDERS' KEYBOARD ARM (S129-A — the keyTick primitive on armText + the SLIDER_KEYS const + onKeyDown on all five "
    "range inputs: a keyboard-driven change coalesces through the 150ms idle into ONE history entry instead of committing "
    "per keypress, the live-pointer-drag discrimination keeping the idle from re-arming mid-drag);"
)
if panel_row_old not in pad:
    raise SystemExit("MISSING panel §11 description anchor")
pad = pad.replace(panel_row_old, panel_row_new, 1)

seed_row_old = "the TRANSACTIONAL WIPE — S128-E / B128-I1: the whole wipe+insert rides ONE interactive $transaction with the 30s timeout (the normalize-member-emails form, the S62-G doctrine's last writer) — a mid-run failure leaves the DB at the pre-seed state, all-or-nothing) |"
seed_row_new = (
    "the TRANSACTIONAL WIPE — S128-E / B128-I1: the whole wipe+insert rides ONE interactive $transaction with the 30s timeout "
    "(the normalize-member-emails form, the S62-G doctrine's last writer) — a mid-run failure leaves the DB at the pre-seed "
    "state, all-or-nothing; the HASH HOIST — S129-C / B129-I1: the scrypt hash computed BEFORE the transaction opens, "
    "register's own S83-D form — sync CPU work out of the SQLite writer window) |"
)
if seed_row_old not in pad:
    raise SystemExit("MISSING seed §11 description anchor")
pad = pad.replace(seed_row_old, seed_row_new, 1)

elements_row_old = "+ the FULL-ROW ship registered at the GET seam (S124-C / B124-I2 — every sibling list-family route rides THUMBNAIL_ELEMENT_SELECT, this route ships full rows by design for the API-consumer contract, the ~25 MB worst-case aggregate inside the 32 MB body-cap family) |"
elements_row_new = (
    "+ the FULL-ROW ship registered at the GET seam (S124-C / B124-I2 — every sibling list-family route rides THUMBNAIL_ELEMENT_SELECT, "
    "this route ships full rows by design for the API-consumer contract, the ~25 MB worst-case aggregate inside the 32 MB body-cap family) "
    "+ the BY-DESIGN P2025 NOTE (S129-D / B129-I2 — the POST catch documents the absent arm's reasoning: the inner tx.project.update "
    "runs only after the FK-checked create, so the vanished-project race always answers P2003 first — the verify-otp sibling's form) |"
)
if elements_row_old not in pad:
    raise SystemExit("MISSING elements §11 description anchor")
pad = pad.replace(elements_row_old, elements_row_new, 1)

(ROOT / "Project_Architecture_Document.md").write_text(pad)
print("PAD updated: title v1.108.0 + Last Updated + §7.1 (4 sites + new row) + §11 (4 counts + 4 descriptions)")

# --- AGENTS.md: counts + the session-129 bullet --------------------------
ag = (ROOT / "AGENTS.md").read_text()
ag_sites = [
    (
        "| Unit tests (1808 checks) | `bun run test` |",
        "| Unit tests (1820 checks) | `bun run test` |",
    ),
    (
        "`bun run test` (1808) → `bun run build`",
        "`bun run test` (1820) → `bun run build`",
    ),
]
for old, new in ag_sites:
    if old not in ag:
        raise SystemExit(f"MISSING AGENTS anchor: {old[:60]!r}")
    ag = ag.replace(old, new, 1)

AGENTS_BULLET = (
    "- **The keyboard-arm/dead-flag/seed-hoist/by-design-note seams (session 129, S129-A..S129-E — the seventy-seventh Mode C audit's chosen work):** "
    "(a) THE SLIDERS' KEYBOARD ARM (A129-L1 — the Low: every range input's gesture terminal was pointer-bound only, so keyboard-driven changes "
    "(the arrow keys with OS key-repeat, PageUp/PageDown, Home/End) committed a full history snapshot + redo wipe per keypress — the S62-A flooding "
    "class through the keyboard surface; the closure: the keyTick primitive on armText + the SLIDER_KEYS const + onKeyDown on the five inputs, the "
    "150ms idle the sole terminal (no blur — a mid-drag blur would end the live gesture, the S126-B class), the live-pointer-drag discrimination at "
    "the head (the S123-C lesson)) + (b) THE DEAD moved FLAG RETIRED (A129-I1: the DragState move/resize members' optional moved flag write-only "
    "since S128-B — the type fields and both writes deleted, the dead-member retirement convention) + (c) THE SEED'S HASH HOIST (B129-I1: the scrypt "
    "hash computed before the $transaction — register's own S83-D form, sync CPU work out of the writer window) + (d) THE ELEMENTS POST BY-DESIGN "
    "NOTE (B129-I2: the P2025 arm's absence documented at the catch — the vanished-project race always answers P2003 at the FK-checked create first) "
    "+ (e) the per-session pin family (tests/lows-s129.test.ts — 12 pins: 8 RED / 4 survival) and the collateral family (the theme window widening "
    "800->1100 + the s66 label-scoped match; the PAD §11 rows canvas 971->978, properties-panel 2165->2224, seed 191->198, elements 413->420; the "
    "count family 1820 = 1808 + 12 unit / 191 files across 54 sites). Pinned by `tests/lows-s129.test.ts`."
)
s128_bullet_prefix = "- **The pan-modality/net-zero-terminal/census-truth seams (session 128,"
idx = ag.find(s128_bullet_prefix)
if idx == -1:
    raise SystemExit("MISSING AGENTS s128 bullet anchor")
# Insert the new bullet AFTER the s128 bullet's line.
line_end = ag.find("\n", idx)
ag = ag[: line_end + 1] + AGENTS_BULLET + "\n" + ag[line_end + 1 :]
(ROOT / "AGENTS.md").write_text(ag)
print("AGENTS updated: 2 count sites + the session-129 bullet")

# --- CLAUDE.md / README.md / digma_SKILL.md: the count sites -------------
count_sites = [
    ("CLAUDE.md", "| `bun run test` | Unit tests (1808 checks, Vitest) |", "| `bun run test` | Unit tests (1820 checks, Vitest) |"),
    ("CLAUDE.md", "(1808 unit / 73 smoke / 262 e2e)", "(1820 unit / 73 smoke / 262 e2e)"),
    ("CLAUDE.md", "- **Unit Tests** (Vitest, 1808 checks):", "- **Unit Tests** (Vitest, 1820 checks):"),
    ("README.md", "| Unit tests | Vitest | 5 | 1808 checks", "| Unit tests | Vitest | 5 | 1820 checks"),
    ("README.md", "# unit tests — 1808 checks", "# unit tests — 1820 checks"),
    ("digma_SKILL.md", 'project_state: "1808 unit checks green', 'project_state: "1820 unit checks green'),
    ("digma_SKILL.md", "| Unit tests | Vitest | ≥5.0.1 | 1808 checks; `*.test.ts` only |", "| Unit tests | Vitest | ≥5.0.1 | 1820 checks; `*.test.ts` only |"),
    ("digma_SKILL.md", "bun run test          # 1808/1808", "bun run test          # 1820/1820"),
]
for rel, old, new in count_sites:
    p = ROOT / rel
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"MISSING count anchor in {rel}: {old[:60]!r}")
    p.write_text(text.replace(old, new, 1))
print("CLAUDE/README/digma_SKILL count sites re-anchored (8)")

# --- digma_SKILL.md: the version bump + lesson F116 ----------------------
sk = (ROOT / "digma_SKILL.md").read_text()
sk_old_version = "version: 1.106.0"
sk_new_version = "version: 1.107.0"
if sk_old_version not in sk:
    raise SystemExit("MISSING SKILL version anchor")
sk = sk.replace(sk_old_version, sk_new_version, 1)

F116 = (
    "\n116. **F116 — the session-129 family: an input-modality census must reach every dispatch surface that can fire the change event (the sliders' pointer-bound gesture terminals left the keyboard modality unarmed — arrow keys with OS key-repeat committed a full history snapshot per keypress, the S62-A flooding class through the one surface the pointer seam never covered); a retired discrimination's flag is dead state the retirement must delete (the S128-B unconditional endGesture orphaned the DragState moved flag — write-only state misleads the next reader into assuming it still discriminates); a doctrine adopted at one site is a claim falsified by grep at its siblings (the S83-D hash-outside-the-transaction doctrine survived at register while the S128-E seed rewrite placed hashPassword inside the writer window — sweep the siblings when a doctrine lands, re-sweep when a sibling is REWRITTEN); and an absent error-arm carries its reasoning at the seam (the by-design-absence note — a future tx-body edit inherits the guard's justification, not just its silence).** THE INPUT-MODALITY CENSUS MEMBER (A129-L1): the S62-A gesture seam was armed at pointerdown and terminated at pointerup/cancel/lostcapture — but a native range input changes value through the keyboard too, and every one of those changes routed through the gesture-aware update's no-gesture-live branch (commit=true, one full snapshot per keypress). The audit question for every gesture-aware surface: which input modalities can fire the change event, and does EACH carry the arm? The keyboard arm composes on the existing text-family primitive (armText — begin-on-demand + foreign-ride + idle re-arm) with two load-bearing discriminations: the arm fires only on value-changing keys (the SLIDER_KEYS set — Tab/F5 must never arm), and a live pointer gesture on the same surface must not re-arm the idle (the 150ms terminal would endGesture mid-drag — the S123-C lesson applied at composition time). The terminal question carries equal weight: the idle is the keyboard family's SOLE terminal because a blur mid-pointer-drag would pass the same-surface token check and end the live drag (the S126-B class) — every candidate terminal is audited against every sibling modality before it ships. THE DEAD-STATE RETIREMENT MEMBER (A129-I1): when a closure removes a discrimination, the discriminating flag becomes write-only state — grep for readers in the SAME commit and delete the flag with the closure, registering the retirement at the type seam; a surviving write-only flag is a claim about behavior the tree no longer has. THE DOCTRINE-SIBLING MEMBER (B129-I1): the S83-D doctrine (compute the scrypt hash before the transaction) was adopted at register and re-derived at the S128-E seed rewrite's own transaction — the rewrite reintroduced the exact shape the doctrine closed because doctrine adoption is point-in-time. The sweep question at every transaction-writing surface: does this body carry sync CPU work the doctrine moved out? THE DOCUMENTED-ABSENCE MEMBER (B129-I2): an error-arm's absence can be sound (the unreachable P2025 at the elements POST) while undocumented — the reasoning lives only in the auditor's head and a future reordering silently inherits an unguarded window; the by-design note at the catch (the verify-otp sibling's form) makes the absence a maintained claim: re-derive the note when the tx body changes.\n"
)
f115_anchor = "115. **F115 —"
idx = sk.find(f115_anchor)
if idx == -1:
    raise SystemExit("MISSING SKILL F115 anchor")
# Append F116 after the F115 entry (find the end of that line).
line_end = sk.find("\n", idx)
sk = sk[: line_end + 1] + F116 + sk[line_end + 1 :]
(ROOT / "digma_SKILL.md").write_text(sk)
print("digma_SKILL updated: v1.107.0 + lesson F116")

# --- the per-session spec UNIT/FILES constants ---------------------------
unit_specs = [
    "lows-s92", "lows-s94", "lows-s95", "lows-s96", "lows-s97", "lows-s98",
    "lows-s99", "lows-s100", "lows-s101", "lows-s102", "lows-s103",
    "lows-s104", "lows-s105", "lows-s106", "lows-s107", "lows-s108",
    "editor-utilities-s93", "doc-lows-s84", "doc-lows-s91",
    "server-lows-s81",
]
files_specs = [
    "lows-s92", "lows-s94", "lows-s95", "lows-s96", "lows-s97", "lows-s98",
    "lows-s99", "lows-s100", "lows-s101", "lows-s102", "lows-s103",
    "lows-s104", "lows-s105", "lows-s106", "lows-s107", "lows-s108",
    "editor-utilities-s93", "doc-lows-s84", "doc-lows-s91",
]
changed = 0
for name in unit_specs:
    p = ROOT / f"tests/{name}.test.ts"
    text = p.read_text()
    if 'const UNIT = "1808";' not in text:
        raise SystemExit(f"MISSING UNIT constant in {name}")
    p.write_text(text.replace('const UNIT = "1808";', 'const UNIT = "1820";'))
    changed += 1
for name in files_specs:
    p = ROOT / f"tests/{name}.test.ts"
    text = p.read_text()
    if 'const FILES = "190";' not in text:
        raise SystemExit(f"MISSING FILES constant in {name}")
    p.write_text(text.replace('const FILES = "190";', 'const FILES = "191";'))
    changed += 1
print(f"spec constants re-anchored: {changed} (20 UNIT + 19 FILES)")
print("docs-update-s129 complete")
