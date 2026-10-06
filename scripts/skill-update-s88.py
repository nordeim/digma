#!/usr/bin/env python3
"""skill-update-s88.py — the digma_SKILL v1.66.0 bump + lesson F75 (S88-C)."""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKILL = ROOT / "digma_SKILL.md"
src = SKILL.read_text(encoding="utf-8")

# ---- 1. the front-matter version -------------------------------------------
if "version: 1.65.0" not in src:
    sys.exit("MISS: the digma_SKILL version front-matter")
src = src.replace("version: 1.65.0", "version: 1.66.0", 1)

# ---- 2. lesson F75 appended after F74 ---------------------------------------
f75 = """
75. **F75 — the session-88 family: the dynamic-bound composition gap and the pattern-shaped enumerator's coverage hole. (1) THE DYNAMIC-BOUND COMPOSITION GAP: four sessions of clamp enumeration (S84-B's panel fields, S86-B's AI patches and multiplicative scale, S87-B's gesture paths) checked every field's STATIC client bound against its static server twin — and the radius field's DYNAMIC bound (cornerRadiusMax = min(w,h)/2, DERIVED from two other fields, both themselves server-bounded) escaped every pass because no literal number sat at the consumer for the family grep to reach: a 5000x5000 element (fully legal since the W/H fields widened to the server's 100000 ceiling) computed a dynamic max of 2500 while the server clamped the field at 2000 — a typed 2500 rendered locally then visibly teleported on the store-replacing PUT. The audit question for every client-side DYNAMIC bound (a cap derived from other fields): does it COMPOSE with the server's static bound on the same field — min(dynamic, server-ceiling) INSIDE the one helper every consumer rides? The composition is one line when the bound already flows through a single seam (cornerRadiusMax), covering every consumer on every surface with zero call-site changes; the reference-measured behavior survives untouched because every measured element sits far below the cap. (2) THE PATTERN-SHAPED ENUMERATOR'S COVERAGE HOLE: a live-derived pin whose enumeration counts LITERAL call shapes (the S87-D form: the askAssistant invocations, the inline getByRole fill, the getByLabel const within 3 lines) certifies only the patterns it knows — a future spec that touches the family in a NEW shape (a different locator, a fill further below the const, a Send-click without a fill, a direct API fetch) consumes the real budget while the pin stays green at the stale count, the B87-L2 drift one layer over. The structural closure is TWO-BODIED: (a) widen the enumeration to the FAMILY (the locator-family co-location form — any locator call naming the assistant's INPUT surface, the textbox/input/Message/Ask discriminator telling the input apart from the panel's HEADING checks, with a send interaction within the statement window); and (b) the COVERAGE-COMPLETENESS companion — every file that touches the family's markers must either contribute at least one enumerated send or appear in an explicit EXEMPTED record with its reason (the locate-only height check; the limiter-trip test whose fetches ARE the budget's own verifier). The count pin alone can stay green while reality drifts; the coverage pin fails on the UNACCOUNTED file even when the count matches. Generalize: any live-derived enumerator over source patterns deserves the same two bodies — the widest family form for the count, and the marker sweep that demands every touching file is counted or consciously exempted.**
"""
anchor = 'and each check that mutates shared state should clean up after itself or tolerate the leftovers (the witness deletes the AI-added elements before staging).**'
if anchor not in src:
    sys.exit("MISS: the F74 anchor")
src = src.replace(anchor, anchor + f75, 1)

SKILL.write_text(src, encoding="utf-8")
print("digma_SKILL v1.66.0: version + lesson F75 applied")
