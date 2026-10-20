#!/usr/bin/env python3
"""The session-166 version bumps: the PAD onto v1.145.0 (the title onto the
new chain head — the S158-C post-run title verification holding its ninth
cycle) and the digma_SKILL onto v1.144.0 + lesson F153 (the
arithmetic-closure member; inserted after F152 — ascending order).

Frozen historical rows (the session-146..165 bullets' own count
records, the v1.125.0..v1.144.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its ninth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s166.py
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

# --- digma_SKILL.md — the v1.144.0 bump + F153 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.143.0", "version: 1.144.0"),
])

# The F153 lesson, inserted AFTER F152 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f153 = (
    "153. **F153 — the session-166 family: the ARITHMETIC-CLOSURE member (the census-scoping family's "
    "counting-convention lesson, the F151 correction-echo's arithmetic arm).** The session-166 audit "
    "found B166-I-1: the s165-B worklog entry's e2e write-set phrase had been reworded in s165 "
    "keeping every underlying FACT true (19 spec-exercised handlers, health probe-exercised, five "
    "zero-e2e) while breaking the census's ARITHMETIC COHERENCE — '20 exercised + health "
    "never-exercised + 5 zero-e2e' over-membered the 25-handler total by one under any single "
    "counting convention (the s163/s164 form had been coherent: '20 exercised, all asserted except "
    "health'). THE LESSON: a census claim is not just its underlying facts — it is the facts PLUS "
    "the counting convention that closes the arithmetic (exercised + probe-owned + zero-e2e = the "
    "total). When rewording a census, verify the member-slots sum to the named total under ONE "
    "stated convention, and state the convention when the figure is convention-dependent (the "
    "probe-inclusive 20 vs the specs'-own-calls 19). A reword that keeps every fact but breaks the "
    "closure is still a false census — the F151 correction-echo doctrine ('verify the corrected "
    "enumeration member-by-member') gains its arithmetic arm: the member-count must CLOSE, not just "
    "the member-list be true.**\n"
)
f152_end = "not pinned is a clean verdict the next cycle cannot verify.**\n"
if f152_end not in text:
    raise SystemExit("F152 end anchor not found")
if "**F153 — the session-166 family" not in text:
    at = text.index(f152_end) + len(f152_end)
    text = text[:at] + f153 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F153 lesson inserted after F152")
else:
    print("digma_SKILL.md: F153 lesson already present")

# --- Project_Architecture_Document.md — the v1.145.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.145.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.144.0",
     "# Digma — Master Project Architecture Document (PAD) v1.145.0"),
])

# The new v1.145.0 Last-Updated entry, inserted ABOVE the retained
# v1.144.0 entry (the chain head).
# THE S158-C FIX (holding its ninth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-20 (v1.145.0 — the write-set arithmetic-closure correction registration pass, the one-hundred-and-fourteenth audit's chosen work, the auditors' census A 0C/0H/0M/0L/0I + B 0C/0H/0M/0L/1I — a ONE-INFORMATIONAL cycle, NOT a zero-finding census (the five zero-finding censuses remain s143/s152/s153/s156/s165, the plan-history claim re-derived live, zero others), every claim lead-verified at its seams: S166-A THE WRITE-SET ARITHMETIC-CLOSURE CORRECTION REGISTRATION (the B166-I-1 remediation, the S132-C standing-note form — the B164-L1 precedent's echo): the s165-B worklog entry's e2e write-set phrase was over-membered by one under any single counting convention (20 exercised + 1 never-exercised + 5 zero-e2e = 26 member-slots for 25 handlers) while every underlying fact stayed true — the s163/s164 form had been coherent (\"20 exercised, all asserted except health\"), the s165 reword broke the closure; the bracketed s166-write-set-closure-note the standing correction (19 of the 25 exercised by the specs' own calls, every one asserted; health exercised and readiness-asserted only by the Playwright webServer probe at playwright.config.ts:97 — the 20-figure under the probe-inclusive convention; the arithmetic closure 19 + 1 + 5 = 25; the s165-B entry FROZEN per S132-C); the comment-truth census 142 TRUE / 0 FALSE — the SECOND consecutive zero-false sampling + S166-B THE ID-STABLE PUT DEFERRAL-PREMISES REGISTRATION (the 39th consecutive cycle): the four premises re-derived live and pinned (P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter), the judgment carried unchanged (the one-Informational census this cycle's cleanest form of the statement that nothing grows a mutation-surface member that would promote the rewrite) + S166-C the per-session pin family (tests/lows-s166.test.ts — 14 pins: 5 RED incl. the pair-unity RED-until-collateral / 9 green-at-birth, the registrations landed before the spec's birth per the standing precedent; RED 5/9 EXACT on the FIRST run, ZERO spec-form repairs — the first zero-repair RED birth in the record; the F138 guard's SEVENTEENTH instance riding the survival form — the s165 plan's record pinned 5/5 ticked at 44914bec per the pre-armed session_375 directive) and the collateral family (the count-family re-anchor 2315 = 2301 + 14 unit / 228 files across every live claim site; the layer-total family STAYS at 14,295 — the fourth consecutive STAYS cycle, zero source changes, NO s156/s157/s158 rider, NO F140 prior-spec rider; the s151..s165 SKILL-version pins onto v1.144.0; the s154..s165 forward-guard rolling re-anchors onto v1.145.0 — the guard family's twelfth through first rolling instances; the s158 title pin onto v1.145.0; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) — the 22-file layer at **14,295 lines** (the fourth consecutive STAYS-cycle form: zero source changes this cycle); the 142nd reference audit NO DRIFT (the clip pin byte-identical the 103rd consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s176/); mobile nav 9/9 the 143rd session (the Tailwind v4 class-A guard holds — verified on the FINAL S166 build); the one-hundred-and-fourteenth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/0I — the comment-truth audit ~142 sampled with 142 TRUE / 0 FALSE, the second consecutive zero-false sampling; auditor B's 0C/0H/0M/0L/1I — the B166-I-1 arithmetic-closure finding verified live at its seam, the F138 sweep's seventeenth instance all-clean, the count-family live sweep all-true, the deferral premises the 39th consecutive cycle all four holding); the honest environment record: the workspace INTACT from the prior cycle (no reset — the fast-forward pull da8a9235, the DB pristine 1/2/6/1/3 on the first probe, the trap guarded by the env -u prefix on every DB-touching gate)\n"
)
retained = "**Last Updated:** 2026-10-20 (v1.144.0 — the fifth zero-finding census registration pass"
if retained not in text:
    raise SystemExit("the retained v1.144.0 entry anchor not found")
if "**Last Updated:** 2026-10-20 (v1.145.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.145.0 chain entry inserted (v1.144.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.145.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 9th) -----
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
        "fix the title before committing."
    )
print(f"POST-RUN VERIFICATION PASSED: the title names the chain head ({head_version})")
