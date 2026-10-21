#!/usr/bin/env python3
"""The session-168 version bumps: the PAD onto v1.147.0 (the title onto the
new chain head — the S158-C post-run title verification holding its eleventh
cycle) and the digma_SKILL onto v1.146.0 + lesson F155 (the
docblock-universality member; inserted after F154 — ascending order).

Frozen historical rows (the session-146..167 bullets' own count
records, the v1.125.0..v1.146.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its eleventh cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s168.py
"""
from pathlib import Path
import re

ROOT = Path("/home/z/my-project/digma")

def patch(path: str, subs: list[tuple[str, str]]) -> None:
    p = ROOT / path
    text = p.read_text()
    applied = 0
    for old, new in subs:
        if new in text and old not in text:
            continue  # already applied (idempotent re-run)
        if old not in text:
            raise SystemExit(f"MISSING in {path}: {old[:100]!r}")
        n = text.count(old)
        if n != 1:
            raise SystemExit(f"AMBIGUOUS ({n} hits) in {path}: {old[:100]!r}")
        text = text.replace(old, new)
        applied += 1
    p.write_text(text)
    print(f"{path}: {applied} sites bumped")

# --- digma_SKILL.md — the v1.146.0 bump + F155 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.145.0", "version: 1.146.0"),
])

# The F155 lesson, inserted AFTER F154 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f155 = (
    "155. **F155 — the session-168 family: the DOCBLOCK-UNIVERSALITY member (the comment-truth "
    "family's docblock arm).** The session-168 audit found A168-L-1: src/lib/call.ts's docblock "
    "claimed \"Every client view fetches through this seam\" / \"the documented contract is ONE "
    "unwrap seam for every client view\" while ELEVEN deliberate raw-fetch bypass sites lived in "
    "client components (the auth cards' RA-60 inline-alert flows in login-screen x4 + "
    "reset-password-screen x1, the AI send's operations envelope, the editor's serialized "
    "autosave machine + load + boundary transports x5) — every bypass correct and "
    "self-documented at its own site, the docblock's UNIVERSAL the false member (the "
    "comment-truth census 142 sampled, 141 TRUE / 1 FALSE — the FALSE one IS the finding, the "
    "first false comment in four samplings). THE LESSON: a shared seam's docblock universality "
    "claim is itself a comment-truth claim — when the seam accretes deliberate bypass "
    "consumers, the universal goes false while every bypass stays correct; re-derive a seam's "
    "docblock scope at every census of its consumers (the consumer census and the docblock "
    "scope must close together), and the comment-truth sampling must cover the shared seams' "
    "own docblocks, not only inline comments — the S65-E docblock written when the claim was "
    "true went false three audit eras later without any code defect, and the prospective harm "
    "was real: a contributor trusting the universal and migrating the auth fetches through "
    "call() would regress the reference's inline sign-in alerts into destructive toasts.**\n"
)
f154_end = "A family claim's scope is the seam's FULL consumer census, re-derived live at fix time.**\n"
if f154_end not in text:
    raise SystemExit("F154 end anchor not found")
if "**F155 — the session-168 family" not in text:
    at = text.index(f154_end) + len(f154_end)
    text = text[:at] + f155 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F155 lesson inserted after F154")
else:
    print("digma_SKILL.md: F155 lesson already present")

# --- Project_Architecture_Document.md — the v1.147.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.147.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.146.0",
     "# Digma — Master Project Architecture Document (PAD) v1.147.0"),
])

# The new v1.147.0 Last-Updated entry, inserted ABOVE the retained
# v1.146.0 entry (the chain head).
# THE S158-C FIX (holding its eleventh cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-21 (v1.147.0 — the call() docblock scope correction + registration pair pass, the one-hundred-and-sixteenth audit's chosen work, the auditors' census A 0C/0H/0M/1L/2I + B 0C/0H/0M/0L/0I — a ONE-LOW-TWO-INFORMATIONAL cycle, the second consecutive source-carrying cycle, every claim lead-verified live at its seams: S168-A THE CALL() DOCBLOCK SCOPE CORRECTION (A168-L-1, the comment-truth family's docblock arm): src/lib/call.ts's docblock claimed \"Every client view fetches through this seam\" / \"the documented contract is ONE unwrap seam for every client view\" — while ELEVEN deliberate raw-fetch bypass sites lived in client components (login-screen x4 + reset-password-screen x1, the RA-60 inline-alert family; ai-assistant.tsx:560, the operations envelope; editor-view x5, the serialized autosave machine + load + boundary transports), every bypass correct and self-documented at its own site, the docblock's UNIVERSAL the false member (the comment-truth census 142 sampled, 141 TRUE / 1 FALSE — the FALSE one IS the finding, the first false comment in four samplings); the fix: the docblock reworded onto the accurate scope — the seam serves the envelope-consuming list views (Dashboard/Recent/Teams/project-card) while the three bypass families are named as deliberate non-consumers, the registration provenance at the seam — a COMMENT-ONLY change, zero source behavior, call.ts 59 → 76, the file OUTSIDE the 22-file layer (the layer total STAYS 14,307 — the first STAYS cycle since S166, zero F40 riders, zero §11 re-anchors) + S168-B THE REGISTRATION PAIR: the bracketed s168-below-threshold-note (the A168-I-1 + A168-I-2 standing registration — the five S167 below-threshold observations re-verified at their seams with their postures (the Insert handler's inline four-draw-type membership, the no-op-guards counting-unit nuance, the gradient-stop same-reference posture, the no-op dismiss timers, the mobile crossing-close family with its S167-corrected location precision) plus the components-panel no-op's documented PAD §10 scope cut) + the s168-id-stable-premises-note (the 41st consecutive cycle, landed by auditor B — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S168-C the per-session pin family (tests/lows-s168.test.ts — 15 pins: 7 RED incl. the two source-side members (the spec born BEFORE the source fix, the TDD form, the second consecutive source-carrying cycle) and the pair-unity RED-until-collateral / 8 green-at-birth, the registrations landed before the spec's birth per the standing precedent; RED 7/8 EXACT after ONE spec-form repair — the bypass-census pin's regex separator + RED-member redesign (the pin genuinely RED until the docblock names its census); a second spec-form repair at the source-green pass — the census phrase-case onto the docblock's own sentence-case spelling; the F138 guard's NINETEENTH instance riding the survival form — the s167 plan's record pinned 5/5 ticked at b8ca329f per the pre-armed session_388 directive) and the collateral family (the count-family re-anchor 2345 = 2330 + 15 unit / 230 files across every live claim site; the spec-constants sweep 49 UNIT + 48 FILES; the layer-total family STAYING at 14,307 — zero F40 riders; the s151..s167 SKILL-version pins onto v1.146.0; the s154..s167 forward-guard rolling re-anchors onto v1.147.0 — the guard family's fourteenth through first rolling instances; the s158 title pin onto v1.147.0; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) — the 22-file layer at **14,307 lines** (the STAYS-cycle form after the S167 MOVES: call.ts +17 outside the layer under the docblock scope correction); the 144th reference audit NO DRIFT (the clip pin byte-identical the 105th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s178/); mobile nav 9/9 the 145th session (the Tailwind v4 class-A guard holds — verified on the FINAL S168 build); the one-hundred-and-sixteenth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/1L/2I — the comment-truth audit 142 sampled with 141 TRUE / 1 FALSE, the FALSE member fixed in-cycle; auditor B's 0C/0H/0M/0L/0I — the F138 sweep's nineteenth instance all-clean, the count-family live sweep all-true, the deferral premises the 41st consecutive cycle all four holding); the honest environment record: the workspace INTACT from the prior cycle (no reset — the fast-forward pull 00986d17..974eb876, the DB pristine 1/2/6/1/3 on the first probe, the trap guarded by the env -u prefix on every DB-touching gate, zero infrastructure incidents)\n"
)
retained = "**Last Updated:** 2026-10-21 (v1.146.0 — the errorTitle pair completion + registration pair pass"
if retained not in text:
    raise SystemExit("the retained v1.146.0 entry anchor not found")
if "**Last Updated:** 2026-10-21 (v1.147.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.147.0 chain entry inserted (v1.146.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.147.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 11th) -----
# The title MUST equal the chain head's version after the bumps — never
# trusted from the patch list above.
final = pad.read_text()
title = final.split("\n")[0]
chain_head = re.search(r"\*\*Last Updated:\*\* [^(]+ \(v(\d+\.\d+\.\d+) —", final)
if not chain_head:
    raise SystemExit("POST-RUN VERIFICATION FAILED: no chain head found")
head_version = f"v{chain_head.group(1)}"
if not title.endswith(head_version):
    raise SystemExit(
        f"POST-RUN VERIFICATION FAILED: the title ({title[-12:]}) does not "
        f"name the chain head ({head_version}) — the S157 class of miss; "
        "rerun with the title patch applied first"
    )
print(f"POST-RUN VERIFICATION PASSED: the title names the chain head ({head_version})")
