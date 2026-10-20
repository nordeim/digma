#!/usr/bin/env python3
"""The session-165 version bumps: the PAD onto v1.144.0 (the title onto the
new chain head — the S158-C post-run title verification holding its eighth
cycle) and the digma_SKILL onto v1.143.0 + lesson F152 (the
zero-false-sampling + registration-cycle members; inserted after F151 —
ascending order).

Frozen historical rows (the session-146..164 bullets' own count
records, the v1.125.0..v1.143.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its eighth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s165.py
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

# --- digma_SKILL.md — the v1.143.0 bump + F152 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.142.0", "version: 1.143.0"),
])

# The F152 lesson, inserted AFTER F151 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f152 = (
    "152. **F152 — the session-165 family: the ZERO-FALSE-SAMPLING + REGISTRATION-CYCLE members. (a) THE "
    "ZERO-FALSE-SAMPLING MEMBER (the comment-truth family's terminal form): the session-165 "
    "comment-truth audit sampled ~140 claims across the 22-file client layer and found 140 "
    "TRUE / 0 FALSE — the FIRST zero-false sampling in the record's history — arrived at not "
    "by sampling less but by eleven consecutive comment-truth cycles (S154..S164) retiring "
    "every false member they found, each reword scoped, each census re-derived, each "
    "correction itself re-audited (the F151 correction-echo lesson). THE FORWARD FORM: a "
    "clean sampling is itself a count-truth claim — pin the TRUE/FALSE census so the next "
    "cycle's drift comparison starts from live truth, and NEVER relax the sampling to "
    "preserve the zero (the goal is true comments, not zero findings; a zero-false census "
    "raises the bar for the next audit, it does not retire it). (b) THE REGISTRATION-CYCLE "
    "MEMBER (the S143 doctrine's echo at the fifth zero-finding census): a zero-finding "
    "census is not a no-op cycle — the registrations ARE the deliverables (the census pin "
    "with its evidence trail, the deferral premises at their seams, the below-threshold "
    "observations named so the next auditor inherits them as candidates, not rediscoveries), "
    "and the next cycle's drift comparison starts from these pins; a clean verdict that is "
    "not pinned is a clean verdict the next cycle cannot verify.**\n"
)
f151_end = "may already be live at an existing site.**\n"
if f151_end not in text:
    raise SystemExit("F151 end anchor not found")
if "**F152 — the session-165 family" not in text:
    at = text.index(f151_end) + len(f151_end)
    text = text[:at] + f152 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F152 lesson inserted after F151")
else:
    print("digma_SKILL.md: F152 lesson already present")

# --- Project_Architecture_Document.md — the v1.144.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.144.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.143.0",
     "# Digma — Master Project Architecture Document (PAD) v1.144.0"),
])

# The new v1.144.0 Last-Updated entry, inserted ABOVE the retained
# v1.143.0 entry (the chain head).
# THE S158-C FIX (holding its eighth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-20 (v1.144.0 — the fifth zero-finding census registration pass, the one-hundred-and-thirteenth audit's chosen work, the auditors' census A 0C/0H/0M/0L/0I + B 0C/0H/0M/0L/0I — THE FIFTH ZERO-FINDING CENSUS in the 165-plan history (the plan-history claim re-derived live: s143/s152/s153/s156 the four priors), every claim lead-verified at its seams: S165-A THE CLEAN-CENSUS REGISTRATION (the S143 doctrine's fifth instance — a clean verdict is a count-truth claim like any other): the combined 0C/0H/0M/0L/0I census pinned with its evidence trail (the two audit entries at their Task-ID anchors, the 491/491 pin families S128..S164, the six green baseline gates, the 141st reference audit NO DRIFT with the clip datum byte-identical the 102nd consecutive session, mobile nav 9/9 the 142nd session, SEO 4/4, the dispatch figures live-exact, THE F138 GUARD'S SIXTEENTH VERIFICATION PASSED — the s164 plan 7/7 ticked at 008c14cf); the comment-truth census 140 TRUE / 0 FALSE — the FIRST ZERO-FALSE sampling in the record's history; auditor A's five below-threshold observations registered (the Insert handler's inline four-draw-type membership — the F35e two-maps shape frozen by the EditorTool union; the no-op-guards counting-unit nuance; the gradient-stop index-key posture carried; the no-op dismiss timers; the mobile lg-crossing close-effect pair) + S165-B THE ID-STABLE PUT DEFERRAL-PREMISES REGISTRATION (the 38th consecutive cycle): the four premises re-derived live and pinned (P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter), the judgment carried unchanged (the zero-finding census is the cleanest possible form of the statement that nothing grows a mutation-surface member that would promote the rewrite) + S165-C the per-session pin family (tests/lows-s165.test.ts — 14 pins: 5 RED incl. the pair-unity RED-until-collateral / 9 green-at-birth, the registrations landed before the spec's birth per the standing precedent; ONE spec-form repair at the RED birth — the marker-stripped layers-phrase form; the F138 guard's SIXTEENTH instance riding the survival form) and the collateral family (the count-family re-anchor 2301 = 2287 + 14 unit / 227 files across every live claim site; the layer-total family STAYS at 14,295 — the third consecutive STAYS cycle, zero source changes, NO s156/s157/s158 rider, NO F140 prior-spec rider; the s151..s164 SKILL-version pins onto v1.143.0; the s154..s164 forward-guard rolling re-anchors onto v1.144.0 — the guard family's eleventh through first rolling instances; the s158 title pin onto v1.144.0; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) — the 22-file layer at **14,295 lines** (the third consecutive STAYS-cycle form: zero source changes this registration cycle); the 141st reference audit NO DRIFT (the clip pin byte-identical the 102nd consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s175/); mobile nav 9/9 the 142nd session (the Tailwind v4 class-A guard holds — verified on the FINAL S165 build); the one-hundred-and-thirteenth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/0I — the comment-truth audit ~140 sampled with 140 TRUE / 0 FALSE, the first zero-false sampling; auditor B's 0C/0H/0M/0L/0I — the F138 sweep's sixteenth instance all-clean, the count-family live sweep all-true, the deferral premises the 38th consecutive cycle all four holding); the honest environment record: the workspace REBUILT after a reset (the clone fresh, the deps re-installed, the DB re-seeded — the exported-shell DATABASE_URL trap striking the FIRST db:seed before the env -u re-run landed the repo DB, the first smoke run's 50/66 the symptom, the re-seed + re-run 73/73)\n"
)
retained = "**Last Updated:** 2026-10-20 (v1.143.0 — the cross-file-citation + census-scoping + honest-census comment-truth pass"
if retained not in text:
    raise SystemExit("the retained v1.143.0 entry anchor not found")
if "**Last Updated:** 2026-10-20 (v1.144.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.144.0 chain entry inserted (v1.143.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.144.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 8th) -----
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
