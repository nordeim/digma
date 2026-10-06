#!/usr/bin/env python3
"""pad-update-s88.py — the PAD v1.67.0 header + revision block (S88-C)."""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAD = ROOT / "Project_Architecture_Document.md"
src = PAD.read_text(encoding="utf-8")

# ---- 1. the title line ------------------------------------------------------
old_title = "# Digma — Master Project Architecture Document (PAD) v1.66.0"
new_title = "# Digma — Master Project Architecture Document (PAD) v1.67.0"
if old_title not in src:
    sys.exit("MISS: the PAD title line")
src = src.replace(old_title, new_title, 1)

# ---- 2. the Last-Updated header chain ---------------------------------------
# The new v1.67.0 summary is prepended; the v1.66.0 summary becomes the
# prior-summary pointer; the older chain survives byte-identically (the
# transition records inside are HISTORY, never rewritten).
old_head = "**Last Updated:** 2026-10-06 (v1.66.0 — the skip-branch-transport/canvas-gesture-clamp/draft-resync/docs-honesty pass:"
new_head = (
    "**Last Updated:** 2026-10-06 (v1.67.0 — the radius-ceiling-compose/enumerator-widening pass: "
    "S88-A the radius dynamic-max composing with the server's 2000 ceiling (the headline, A88-L1 — "
    "cornerRadiusMax capped the Corner Radius slider and the four per-corner NumberField commits at "
    "HALF THE SMALLER SIDE with no bound at the server's clampNumber(raw?.radius, 0, 2000, 0), and "
    "since S87-B widened the panel W/H fields to the server's 100000 ceiling an element whose smaller "
    "side tops 4000 is fully legal — a 5000x5000 rect's dynamic max 2500 let a typed 2500 render "
    "locally then visibly TELEPORT to 2000 ~1s later on the store-replacing autosave PUT, silently, "
    "no toast; the S84-B teleport family's residual member, escaping four sessions of clamp "
    "enumeration because the DYNAMIC bound (min/2, derived from two OTHER fields) left no literal "
    "number at the consumer for the family grep to reach; the fix: the 2000 ceiling composes INSIDE "
    "cornerRadiusMax — Math.min(Math.min(el.width, el.height) / 2, 2000) — one seam covering all six "
    "call sites (the slider max + the slider onChange + the four per-corner commits) on BOTH surfaces "
    "through the shared PropertiesSections composition, the reference-measured RA-29 dynamic behavior "
    "untouched (every measured element far below the cap); live-witnessed by the capture's clone-46 — "
    "the CTA Button staged at 5000x5000, the slider max reads EXACTLY 2000, a 2500 typed into Top "
    "Left commits clamped and the field reads EXACTLY 2000 immediately and after the save), "
    "S88-B the AI-bucket enumerator widening + the coverage-completeness companion (B88-L1, the "
    "F68/F70/F74 family's forward-looking member — the S87-D live-derived enumerator counted only "
    "three LITERAL shapes: the askAssistant invocations, the inline getByRole-textbox fill, the "
    "getByLabel const with the fill within 3 lines; a future spec sending the assistant a message in "
    "any other shape would consume the REAL shared ai: bucket while the pin stayed green at a stale "
    "\"nine\", and comment + pin + reality would diverge exactly the way B87-L2 diverged — the "
    "failure mode the nastiest class: a mid-suite 429 RATE_LIMITED envelope with no reply, every "
    "deterministic-fallback assertion timing out at 15s and cascading; the fix: the enumerator "
    "widened to the LOCATOR-FAMILY CO-LOCATION form — any assistant-TEXTBOX locator line (any "
    "locator family, the textbox/input/Message/Ask/placeholder/aria-label discriminator telling the "
    "textbox apart from the assistant PANEL's heading checks) with a send interaction within the "
    "8-line statement window, PLUS the coverage-completeness companion pin: every spec file touching "
    "the family's markers (the textbox locator family, askAssistant, a direct fetch to the assistant "
    "API) must either contribute at least one enumerated send or appear in the explicit EXEMPTED "
    "list — parity.spec.ts the locate-only height check, session67-fixes.spec.ts the limiter-trip "
    "test whose 21 fetches ARE the budget's own verifier; the count itself unchanged at NINE, the "
    "widened form proven equivalent on its first run), "
    "S88-C the logs + the counts 1098 -> 1112 unit / 147 -> 149 files across every live claim site "
    "(the two new spec files: editor-lows-s88 7 + doc-lows-s88 5, plus doc-lows-s87's two S88-B "
    "pins; ONE standing-pin set legitimately re-anchored — the doc-lows-s86 §11 editor.ts row onto "
    "the grown file, 948 -> 960, the row-sum doctrine's forcing function; the doc-lows-s84 and "
    "server-lows-s81 UNIT/FILES constants onto 1112/149) — see the v1.67.0 revision block; the "
    "prior summary — the skip-branch-transport/canvas-gesture-clamp/draft-resync/docs-honesty pass "
    "— see the v1.66.0 revision block) "
    "(v1.66.0 — the skip-branch-transport/canvas-gesture-clamp/draft-resync/docs-honesty pass:"
)
if old_head not in src:
    sys.exit("MISS: the PAD Last-Updated header")
src = src.replace(old_head, new_head, 1)

# ---- 3. the v1.67.0 revision block (prepended above the v1.66.0 block) ------
block_v67 = """#### Revision Block — v1.67.0 (Tracked Changes)

1. **S88-A (A88-L1, the headline): the radius dynamic-max composes with the server's 2000 ceiling.** `cornerRadiusMax` (src/lib/editor.ts) returned `Math.min(el.width, el.height) / 2` — the RA-29 dynamic cap consumed by all six Corner Radius call sites (the slider's `max` + the slider's onChange + the four per-corner NumberField commits in properties-panel.tsx:1152-1166) — with NO bound at the server's `clampNumber(raw?.radius, 0, 2000, 0)` (editor.ts:938). Since S87-B widened the panel W/H fields to the server's 100000 ceiling, an element whose smaller side exceeds 4000 is fully legal (a 5000×5000 rect → dynamic max 2500): a radius typed to 2500 rendered locally, then visibly TELEPORTED to 2000 ~1s later when the store-replacing autosave PUT landed — silently, no toast. The S84-B/S86-B/S87-B clamp enumeration had checked every field's STATIC client bound against its static server twin; the radius field's DYNAMIC bound (derived from width/height — two OTHER fields, both themselves server-bounded) escaped the enumeration because no literal number sat at the consumer. THE FIX: the ceiling composes INSIDE the one seam every consumer rides — `Math.min(Math.min(el.width, el.height) / 2, 2000)` — covering both surfaces (the mobile Sheet rides the shared PropertiesSections composition) with zero consumer changes; the reference-measured dynamic family (200×150 → 75, 46×23.366 → 11.683, 156×117 → 58.5) is untouched. Pinned by `tests/editor-lows-s88.test.ts` (7 pins: the 5000×5000 behavioral pin deterministically RED pre-fix at 2500, the reachability family at 999999/100000×4001/9000×4500, the exact 4000×4000 boundary, the RA-29 survival family, the composed-form source pin, the six-call-sites survival pin, the server-line survival pin); live-witnessed by the capture's clone-46 (`{sliderMax:2000, midEdit:2000, after:2000, composed:true}` — the slider max at EXACTLY 2000, the typed 2500 committing clamped immediately and staying 2000 through the save round-trip).
2. **S88-B (B88-L1): the AI-bucket enumerator widening + the coverage-completeness companion.** The S87-D live-derived pin's `liveAssistantSendCount()` (tests/doc-lows-s87.test.ts) enumerated only three literal shapes — `askAssistant(page, ` invocations, the inline `getByRole("textbox", { name: "Message the AI design assistant" }).fill(` form, and the const-declaration form with `await input.fill(` within the next 3 lines. A future spec sending the assistant a message in any other shape (a fill further below the const, a different locator for the same textbox, a Send-click without a fill, a direct `fetch("/api/ai-assistant")`) would consume the real shared `ai:` bucket while the enumerator missed it — the pin staying green at a stale "nine" is exactly the B87-L2 drift one layer over, with the nastiest eventual failure mode (a mid-suite 429 envelope with no reply cascading through every 15s fallback assertion). THE FIX: (a) the enumerator widened to the LOCATOR-FAMILY CO-LOCATION form — any assistant-textbox locator line (the TEXTBOX_LOCATOR_FAMILY regex: any of getByRole/getByLabel/locator/getByPlaceholder with "assistant" co-occurring with the input discriminator textbox/input/textarea/Message/Ask/placeholder/aria-label — the discriminator tells the textbox apart from the assistant PANEL's `getByRole("heading", { name: "AI Assistant" })` visibility checks, which never match) counts a send when the interaction sits on the same line (the inline form) or within the next 8 lines (the const-declaration form — the fill may sit below intermediate awaits); (b) the COVERAGE-COMPLETENESS companion pin — every spec file matching the assistant-consumption marker family (the textbox locator family OR `askAssistant(` OR a fetch to `/api/ai-assistant`) must either contribute ≥1 enumerated send or appear in the explicit EXEMPTED record: parity.spec.ts (the locate-only height check — never sends) and session67-fixes.spec.ts (the limiter-trip test — its 21 direct fetches ARE the budget's own verifier, not a consumer of the headroom). The count stays NINE — the widened form's first run equals the old form's count (the equivalence proof); pinned by `tests/doc-lows-s88.test.ts` (5 pins: the locator-family source pin, the 8-line window source pin, the coverage-completeness presence pin, the exemption-list pin, the LIVE-count-form survival pin) + the two new pins inside doc-lows-s87 itself (the coverage sweep, the exemption-list exactness).
3. **The thirty-sixth Mode C audit's method (0 Critical / 0 High / 0 Medium / 2 Low / 6 Informational):** the lead's re-verification of all four S87 seams intact in source + two fresh-eyes full-file reviews by separate agents — auditor A over the editor core + client view layer (~11.5k lines, gates re-run green in its own environment), auditor B over the server + lib/config/infra side (all 18 routes, all server libs, the configs, the scripts, the e2e infrastructure — gates + a live smoke + a live full e2e re-run green). The informational set: A88-I1 the mid-slider-drag undo interleaving (POSTURE — the S64-G carve-out's own documented trade, no data loss), A88-I2 the Pen/Image select fall-through (the RA-14 documented parity), B88-I2 the clampNumber null coercion (the standing B87-I3 family), B88-I3 the read-family P2024 arm (POSTURE — reads never in the S77-G/S78-B family), B88-I4 the resend-otp/login unconditional-write residue (the standing posture), B88-I1 the LLM server-side timeout (the standing deferred row). The standing deferred queue carries forward unchanged.
4. **The 64th reference audit + the 65th mobile-nav verification.** NO DRIFT on any standing datum (the desktop nav 124/96/92 × 36; the greeting "Good morning, sepnetflix2023 ✨"; Quick Stats 1/0/Pro; the Recent sort last_accessed + "1 file found"; kbd=0 via the direct-expression re-probe — the F63/F71 IIFE-returns-`{}` quirk hit a FIFTH time this cycle, both the string-concatenation AND the JSON-wrapped forms failing where the plain-expression and non-IIFE string-concat forms worked; the Create-Team dead chrome dialogs=0; R3 mobile failure class A present on the reference; the Share/Present clipping byte-identical the 25th consecutive session — Share L385-R458, Present L466-R551; "Test Project One" verified). The clone's mobile nav 9/9 via `scripts/verify-nav-s88.sh` — the 65th consecutive session, verified at baseline AND on the final S88 build.
5. **S88-C: the logs + the counts.** `docs/session_135.md` (2×88 − 41 = 135), the repo worklog entry, the parent workspace worklog entry, the digma_SKILL v1.66.0 bump with lesson F75, this revision block, and every count site updated to the delivered reality — 1098 -> 1112 unit / 147 -> 149 files (the two new spec files: editor-lows-s88 7 pins + doc-lows-s88 5 pins + doc-lows-s87's 2 S88-B pins = 14; ONE standing-pin set legitimately re-anchored: the doc-lows-s86 §11 editor.ts row onto the grown file 948 -> 960 (the S88-A comment block), the row-sum doctrine's forcing function — plus the doc-lows-s84 and server-lows-s81 UNIT/FILES constants onto 1112/149, the F68/F70 discipline).

"""
anchor = "#### Revision Block — v1.66.0 (Tracked Changes)"
if anchor not in src:
    sys.exit("MISS: the v1.66.0 revision block anchor")
src = src.replace(anchor, block_v67 + anchor, 1)

PAD.write_text(src, encoding="utf-8")
print("PAD v1.67.0: title + header chain + revision block applied")
