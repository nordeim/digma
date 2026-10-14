#!/usr/bin/env python3
"""Session 128 — the docs alignment: the PAD v1.107.0 header + §7.1 rows,
the AGENTS session-128 bullet, the digma_SKILL v1.106.0 bump + lesson F115.

Run from the repo root:  python3 scripts/doc-update-s128.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# ---------------------------------------------------------------------------
# 1. PAD — the §7.1 rows
# ---------------------------------------------------------------------------
pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

# the schema-hygiene row: 15 -> 16 (the S128-D family pin)
old_row = "| Unit — the schema-push + row-builder seam (S70-B) | `tests/schema-hygiene-s70.test.ts` | 15 | tests | Vitest |"
new_row = "| Unit — the schema-push + row-builder seam (S70-B) + the TeamMember index pair (S128-D) | `tests/schema-hygiene-s70.test.ts` | 16 | tests | Vitest |"
assert old_row in text, "schema-hygiene §7.1 row anchor missing"
text = text.replace(old_row, new_row)

# the new lows-s128 row directly after the lows-s127 row (the row that
# ends with "| `tests/lows-s127.test.ts` | 22 | tests | Vitest |")
s127_row_end = "| `tests/lows-s127.test.ts` | 22 | tests | Vitest |"
assert s127_row_end in text, "lows-s127 §7.1 row anchor missing"
s128_row = (
    s127_row_end
    + "\n| Unit — THE HANDLE'S PAN-MODALITY REFUSAL + THE CLICK TERMINAL'S "
    "UNCONDITIONAL ENDGESTURE (the seventy-sixth audit's two Lows: A128-L1 — "
    "the handle's arm carried no isPanning() check while the container's pan "
    "branch was unreachable through the stopPropagation, so a pan-intent "
    "press on a handle ran the full resize arm; the refusal mirrors the "
    "container's precedence, the 8×8 dead zone the registered trade; A128-L2 "
    "— the moved-flag discrimination discarded the armed anchor on a plain "
    "click while the panel's S66-A ride-under had committed real edits under "
    "it, no history entry for the ride; the unconditional endGesture puts "
    "the S111-A net-zero guard at the owning layer) + THE SCHEMA-HYGIENE "
    "FAMILY PIN (S128-D — the S127-D attribution re-anchor: the pair form "
    "added to the family home, the per-session pin retained) + THE SEED'S "
    "TRANSACTIONAL WIPE (S128-E — the whole wipe+insert one interactive "
    "$transaction, the 30s timeout, the S62-G doctrine's last writer) + the "
    "write-census re-anchor pins (S128-C — the 21/16 truth in both S127 "
    "doc-of-record lines) + the s128 script family pins (the live128/nav128/"
    "seo-s128 provenance anchors — the 104th audit, the 105th session, the "
    "65th clip ordinal, the S127 delivery at HEAD bc3d70b) + the S127 "
    "survival pins (the guard pair, the foreign-move/release refusals) | "
    "`tests/lows-s128.test.ts` | 12 | tests | Vitest |"
)
text = text.replace(s127_row_end, s128_row)

# ---------------------------------------------------------------------------
# 2. PAD — the v1.107.0 header (the full S128 chain)
# ---------------------------------------------------------------------------
header_start = text.index("**Last Updated:**")
header_end = text.index("\n", header_start)
old_header = text[header_start:header_end]
new_header = (
    "**Last Updated:** 2026-10-14 (v1.107.0 — the pan-modality/net-zero-terminal/census-truth pass: "
    "S128-A THE HANDLE'S PAN-MODALITY REFUSAL (A128-L1 — the seventy-sixth audit's first Low: the "
    "container's pointerdown routes pan-intent presses to the pan branch (`button === 1 || "
    "isPanning()` — the Hand tool or Space held), but the handle's S127-A closure mirrored only the "
    "entry guard + the button gate and its stopPropagation (the S59-G one-dispatch contract) kept "
    "the container's pan branch unreachable — so a pan-intent press landing on a corner handle "
    "(8×8px, pointer-events-auto, rendered for an unlocked single selection) passed both guards and "
    "ran the FULL RESIZE ARM: an unintended, autosave-persisted element resize from a pan-intent "
    "press; the closure: `if (isPanning()) return;` at the handle's head after the entry guard, "
    "before the button gate — mirroring the container's own precedence; the dropped press the "
    "honest refusal (the S123-A/S124-B/S125-A/S126-A/S127-A doctrine), the 8×8 handle a dead zone "
    "under a pan-intent press the registered safe-direction trade) + "
    "S128-B THE CLICK TERMINAL'S UNCONDITIONAL ENDGESTURE (A128-L2 — the seventy-sixth audit's "
    "second Low: the canvas move/resize terminal discriminated on its own drag.moved flag — "
    "`if (drag.moved) endGesture else cancelGesture` — while the panel's S66-A ride-under commits "
    "its slider/text ticks with commit=false under a foreign (canvas-owned) gesture; when the "
    "canvas gesture ended with a real move the endGesture pushed the armed anchor as ONE entry "
    "covering the ride (the S123-C registration), but when the canvas pointer never moved (a plain "
    "click) the cancelGesture DISCARDED the anchor — the ride's real, persisted edits landed with "
    "NO history entry, the pre-ride state unreachable by a single Ctrl+Z; reachable single-pointer "
    "too (press-and-hold an element, edit a panel field, release); the closure: the terminal calls "
    "endGesture UNCONDITIONALLY — the S111-A net-zero guard at the layer that owns the transition "
    "(the F96/F97 doctrine) owns the pure-click case (identity-equal snapshots: no past push, no "
    "future wipe — behavior-identical to the old cancel branch) and pushes the anchor when a ride "
    "changed the net state) + "
    "S128-C THE WRITE-CENSUS RE-ANCHOR (B128-L1 — the F112 sweep-census class applied to the "
    "audit-census family: the S127 records claimed 20 write statements / 15 handler surfaces, the "
    "live grep re-derivation counts 21/16 — the elements route alone carries five statements on "
    "two write-bearing methods; the two doc-of-record lines re-anchored onto the truth and the "
    "write-census joins the per-session doc-sweep checklist) + "
    "S128-D THE SCHEMA-HYGIENE FAMILY PIN (B128-L2 — the S127-D attribution re-anchor: the "
    "pair-form pin shipped only in tests/lows-s127.test.ts while the record named the "
    "schema-hygiene-s70 family file; the pin added to the family home, the per-session pin "
    "retained verbatim, the attribution line re-anchored) + "
    "S128-E THE SEED'S TRANSACTIONAL WIPE (B128-I1 — the S62-G doctrine's last writer: the wipe+"
    "insert rode sequential awaits, a mid-run failure leaving a half-seeded DB healed only by "
    "re-running; the whole body now rides ONE interactive $transaction with the 30s timeout, the "
    "normalize-member-emails form) + "
    "S128-F the per-session pin family (tests/lows-s128.test.ts — 12 pins: 8 RED / 4 survival; "
    "the three s128 script derivations 22/66/6) + the collateral family (the gesture-undo and "
    "lows-s118 pins re-anchored onto the S128-B/S128-E forms — the F89/S102-B class; the PAD §11 "
    "rows canvas.tsx 945->971, seed.ts 174->191 with the enriched seam descriptions); "
    "the count-family re-anchor 1808 = 1795 + 13 unit / 190 files across every live claim site "
    "(52 sites); the 104th reference audit NO DRIFT (the clip pin byte-identical the 65th "
    "consecutive session); mobile nav 9/9 the 105th session; the seventy-sixth Mode C audit "
    "0C/0H/0M/4L/1I)"
)
text = text[:header_start] + new_header + text[header_end:]
pad.write_text(text)
print("PAD: v1.107.0 header + §7.1 rows (schema-hygiene 16, the new lows-s128 row 12)")

# ---------------------------------------------------------------------------
# 3. AGENTS.md — the session-128 bullet after the session-127 bullet
# ---------------------------------------------------------------------------
agents = ROOT / "AGENTS.md"
atext = agents.read_text()
s127_bullet_start = atext.index("- **The pointer-ownership/status-sweep seams (session 127")
s127_bullet_end = atext.index("\n", s127_bullet_start)
s128_bullet = (
    "\n- **The pan-modality/net-zero-terminal/census-truth seams (session 128, S128-A..S128-F — "
    "the seventy-sixth Mode C audit's chosen work):** (a) THE HANDLE'S PAN-MODALITY REFUSAL "
    "(A128-L1 — the first Low: the container's pointerdown routes pan-intent presses to the pan "
    "branch, but the handle's S127-A closure mirrored only the entry guard + the button gate and "
    "its stopPropagation kept the pan branch unreachable — a pan-intent press on a corner handle "
    "ran the FULL RESIZE ARM (an unintended, autosave-persisted mutation); the closure: "
    "`if (isPanning()) return;` at the handle's head mirroring the container's precedence, the "
    "8×8 dead zone the registered safe-direction trade) + (b) THE CLICK TERMINAL'S UNCONDITIONAL "
    "ENDGESTURE (A128-L2 — the second Low: the moved-flag discrimination discarded the armed "
    "anchor on a plain click while the panel's S66-A ride-under had committed real edits under "
    "it — no history entry for the ride, the pre-ride state unreachable by one Ctrl+Z; the "
    "closure: the unconditional `store.endGesture()` — the S111-A net-zero guard owns the click "
    "case (behavior-identical) and pushes the anchor when a ride changed the net state) + "
    "(c) THE WRITE-CENSUS RE-ANCHOR (B128-L1: the S127 records' 20/15 claim re-anchored onto the "
    "live 21/16 truth — the write-census joins the per-session doc-sweep checklist) + (d) THE "
    "SCHEMA-HYGIENE FAMILY PIN (B128-L2: the S127-D pair-form pin added to its family home "
    "`tests/schema-hygiene-s70.test.ts`, the per-session lows-s127 pin retained, the attribution "
    "re-anchored) + (e) THE SEED'S TRANSACTIONAL WIPE (B128-I1: the whole wipe+insert one "
    "interactive $transaction with the 30s timeout — the S62-G doctrine's last writer) + (f) "
    "the per-session pin family (tests/lows-s128.test.ts — 12 pins: 8 RED / 4 survival) and the "
    "collateral family (the gesture-undo/lows-s118 pin re-anchors; the PAD §11 rows canvas "
    "945->971, seed 174->191; the count family 1808 = 1795 + 13 unit / 190 files across 52 "
    "sites). Pinned by `tests/lows-s128.test.ts`."
)
atext = atext[:s127_bullet_end] + s128_bullet + atext[s127_bullet_end:]
agents.write_text(atext)
print("AGENTS: the session-128 bullet inserted after the session-127 bullet")

# ---------------------------------------------------------------------------
# 4. digma_SKILL.md — the v1.106.0 bump + lesson F115
# ---------------------------------------------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()
stext = stext.replace("version: 1.105.0", "version: 1.106.0", 1)

f114_end = stext.index("\n", stext.index("114. **F114 —"))
f115 = (
    "\n115. **F115 — the session-128 family: a surface's input-MODALITY gates must be re-derived "
    "at every private entrance (the handle carried the entry guard and the button gate but not "
    "the PAN gate — the container's modality routing was unreachable through the "
    "stopPropagation, so a pan-intent press ran the resize arm); and a gesture terminal that "
    "discriminates on its OWN surface's change flag strands foreign rides that committed under "
    "it — the net-zero guard at the owning layer replaces per-surface discrimination (the "
    "terminal's cancel edge is a commit edge for every rider); and an audit census carried in a "
    "doc-of-record is a live claim — the census count joins the doc-sweep family (a "
    "grep-falsifiable number in a session record propagates into the next audit's expectations).** "
    "THE MODALITY-CENSUS MEMBER (A128-L1): the S127-A closure mirrored the container's guard "
    "census onto the handle but the census was incomplete — the container's pointerdown carries "
    "THREE gates ahead of the arm (the live-drag entry guard, the pan-modality routing, the "
    "button discrimination), and the handle's copy carried two; every private entrance re-derives "
    "the FULL gate census, and the modality gates are the easily-missed ones because their harm "
    "is an unintended ACTION rather than a corrupted state. THE TERMINAL-OWNERSHIP MEMBER "
    "(A128-L2): the S66-A ride-under commits changes under a gesture owned by another surface, "
    "so the owner's terminal is ALSO the rider's commit edge — a terminal that cancels on its "
    "own zero-change flag discards the rider's real changes from history (the state survives, "
    "the undo boundary does not); the fix shape is always the owning layer's net-zero guard, "
    "never a second discrimination flag. THE CENSUS-IN-THE-DOC MEMBER (B128-L1): the write-site "
    "census lived in two session records at 20/15 while the tree carried 21/16 — an audit "
    "expectation inherited from a doc is a live claim that must sweep like every other count."
)
stext = stext[:f114_end] + f115 + stext[f114_end:]
skill.write_text(stext)
print("digma_SKILL: v1.106.0 + lesson F115 appended")
