#!/usr/bin/env python3
"""The session-136 version bumps: the PAD v1.115.0 header (the chain
prepended, the v1.114.0 entry retained) and the digma_SKILL v1.114.0 +
lesson F123 (the belt-coverage member; the consumer-census rider; the
table-count member).

Run from the repo root:  python3 scripts/version-bump-s136.py
"""
from pathlib import Path

ROOT = Path("/home/z/my-project/digma")

# --- 1. the PAD v1.115.0 header ------------------------------------------------
PAD_HEADER = """**Last Updated:** 2026-10-15 (v1.115.0 — the logout-gate/mint-registration/perimeter-trace/census-pair pass: S136-A THE LOGOUT SESSION GATE (B136-L1 — the eighty-fourth audit's one Low, the FIX form): the logout route read no body, required no session, and unconditionally set digma_session="" maxAge:0 — a cross-site top-level form POST (or a mode:"no-cors" fetch) drove the handler in the victim's browser, and sameSite:"lax" gates cookie SENDING, never cookie CLEARING, so the clearing Set-Cookie from the cross-site response still landed in the victim's jar (a forced-sign-out CSRF; every other mutation route was already safe through the session gate or the JSON-body gate — logout was the one mutation that needed neither, the §6 belt's over-covered member, the B125-I2 over-coverage class on the CSRF row); the closure gates the route on requireSession — the cross-site caller's cookie-less POST (lax withholds the session cookie on cross-site POSTs) 401s and the Set-Cookie NEVER LANDS; the consumer census proves the gate safe (the smoke suite's logout rides the post-restore RELOGIN jar with the current tokenVersion; the e2e reset-password scratch session is live per its own comment — the 401 fires only for the cookie-less caller, and a signed-out caller's logout is semantically empty); the B125-I2 no-limiter posture rides unchanged (the gate 401s before any work); the PAD §6 CSRF row tightened to name the closed carve-out) + S136-B THE LOGIN MINT'S STALE TOKENVERSION REGISTRATION (B136-I1 — the Informational, the B84-I3 stale-read family's THIRD member): the mint embeds the tokenVersion from the TOP-OF-HANDLER read, and the scrypt burn opens the ~100ms window — a same-account reset-password (valid token, another tab) committing inside that window increments the row past the read, the fresh login answers 200 + Set-Cookie, then every getSessionUser 401s (a dead-on-arrival mint); FAILS CLOSED (the S67-A designed-eviction direction), self-heals on re-login, the stale-session-survives direction closed (the conditional reset updateMany increments on every successful reset); the closure named: the verify-otp sibling's FRESH RE-SELECT before mint (verify-otp/route.ts:118-130); the PAD §10 B84-I3 row carries the full three-member census) + S136-C THE guardedUpdate PERIMETER REGISTRATION (A136-I2 — the Informational, the A135-I2 churn-immunity datum generalized family-wide): every section consuming the guardedUpdate helper (PositionSize/CornerRadius/Text/FillStroke/Transform/Opacity, both hosts' shared PropertiesSections) closes the RENDER-DERIVED element into the would-commit compare at the patchDiffers seam while the commit target rides the S133-B LIVE selectedIds read — and the value-based compare (VALUES, never ids) provably cannot fire through markSaved's every-save id remap on ANY member of the perimeter (the stale rows value-identical to the fresh rows); only a genuine selection-CONTENT change in the theoretical sub-frame diverges (the S133-C rationale extends verbatim); zero mutation surface, self-healing; the mid-gesture external mutation unreachable through every standing surface) + S136-D THE AI DELETE-ARM INTERLEAVING TRACE REGISTRATION (A136-I3 — the Informational, the by-design trace): the apply's delete arm is the ONE store-mutating surface that commits under a live gesture (the registered S81-A/S117-C programmatic-caller posture), so an apply landing while a resize drag is live can delete the element whose 8×8 handle HOLDS THE POINTER CAPTURE — the unmount implicitly releases the capture, a pointerup over non-canvas chrome leaks the drag state past its own terminal; the leak SELF-HEALS on the next canvas hover (the S57-A ghost guard's buttons===0 end path), the dead ticks no-op through the S109-A id-match guard, and the heal's endGesture pushes the pre-drag snapshot ONE entry after the delete's (the A88-I1 ORDER-ONLY posture) — NO DATA LOSS, every state reachable, the bounded deferral + the one-entry undo granularity note the full blast radius) + S136-E THE DOC-CENSUS PAIR (A136-I1 + B136-I2): the §11 header's CURATED-SUBSET rider (the table carries the audit-relevant surfaces — exactly 38 data rows; five client-layer files live only in §3) + the "39/39 §11 rows" audit figure corrected to the live 38-row truth (the B135-I1 count-truth class recurring — the figure byte-stable wrong across twelve consecutive deliveries because every sweep verified the rows' CONTENT, never the table's COUNT; the worklog's bracketed s136-§11-census-note, the frozen records never rewritten, the live count pinned by the spec's SURVIVAL docs pin)) + S136-F the per-session pin family (tests/lows-s136.test.ts — 16 pins: 8 RED / 8 survival; the three s136 script derivations 22/66/6) and the collateral family (the PAD §11 rows properties-panel.tsx 2327→2349, ai-assistant.tsx 813→835 with the enriched S136 seam descriptions; the count-family re-anchor 1944 = 1928 + 16 unit / 198 files across every live claim site + the twenty prior-session spec constants); the 112th reference audit NO DRIFT (the clip pin byte-identical the 73rd consecutive session); mobile nav 9/9 the 113th session; the eighty-fourth Mode C audit 0C/0H/0M/1L/5I)
"""

pad = ROOT / "Project_Architecture_Document.md"
text = pad.read_text()

if "v1.115.0" in text.split("\n")[0]:
    print("PAD: v1.115.0 already applied (idempotent skip)")
else:
    # the title bump
    old_title = "# Digma — Master Project Architecture Document (PAD) v1.114.0"
    new_title = "# Digma — Master Project Architecture Document (PAD) v1.115.0"
    assert old_title in text, "PAD title anchor missing"
    text = text.replace(old_title, new_title, 1)

    # the header chain prepend (insert the v1.115.0 line directly under the
    # Status/Companion lines, ABOVE the frozen v1.114.0 line)
    anchor = "**Last Updated:** 2026-10-15 (v1.114.0 —"
    assert anchor in text, "PAD v1.114.0 chain anchor missing"
    text = text.replace(anchor, PAD_HEADER + anchor, 1)
    pad.write_text(text)
    print("PAD: v1.115.0 title + header chain prepended (v1.114.0 retained)")

# --- 2. the digma_SKILL v1.114.0 + F123 ----------------------------------------
skill = ROOT / "digma_SKILL.md"
stext = skill.read_text()

old_ver = "version: 1.113.0"
new_ver = "version: 1.114.0"
assert old_ver in stext, "SKILL version anchor missing"
stext = stext.replace(old_ver, new_ver, 1)

F123 = """123. **F123 — the session-136 family: a security belt's documented coverage must be verified member-by-member against every route the belt claims to cover (the belt-coverage member). THE ASYMMETRY DATUM (B136-L1): sameSite gates cookie SENDING, never cookie CLEARING — a cross-site response's Set-Cookie still lands in the victim's jar, so "same-site cookies + JSON-only APIs" does NOT cover a mutation route that reads no body and requires no session; the CSRF row's premise was verified against form-encoding, never against the one mutation that needed neither — the belt's own coverage claim is a live claim like any doc figure, and it must be walked route-by-route (every mutation route is session-gated [lax withholds the cookie on cross-site POSTs, the gate 401s] or JSON-body-gated — the census finds the escapee). THE CONSUMER-CENSUS RIDER: before gating any route, census its live consumers — the logout gate is safe ONLY because every documented consumer carries a live session (the smoke suite's post-relogin jar, the e2e scratch session); a gate that breaks a signed-out consumer would trade a Low for a regression. THE TABLE-COUNT MEMBER (B136-I2, the B135-I1 count-truth rider's extension): a doc-census sweep verifies the rows' CONTENT; the table's own COUNT is a separate live claim — the "39/39 §11 rows" figure survived twelve deliveries because every sweep wc-verified each row, never counted the table (38 rows); count the TABLE, pin the count (the lows-s136 SURVIVAL docs pin), and register the curated-subset posture so future censuses never assume the figure.**
"""

# append F123 after F122 (the lessons list is numbered; F122 is item 122)
# insert F123 after the F122 item (the lessons list is numbered)
# insert F123 after the F122 item (find the end of the F122 line)
idx = stext.find("122. **F122 — the session-135 family:")
if idx == -1:
    raise SystemExit("F122 item not found")
# find the end of that line (the next newline after idx)
line_end = stext.find("\n", idx)
if line_end == -1:
    raise SystemExit("F122 line end not found")
stext = stext[:line_end + 1] + F123 + stext[line_end + 1:]
skill.write_text(stext)
print("digma_SKILL: v1.114.0 + F123 (the belt-coverage member; the consumer-census rider; the table-count member)")
