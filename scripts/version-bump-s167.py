#!/usr/bin/env python3
"""The session-167 version bumps: the PAD onto v1.146.0 (the title onto the
new chain head — the S158-C post-run title verification holding its tenth
cycle) and the digma_SKILL onto v1.145.0 + lesson F154 (the
family-completion-census member; inserted after F153 — ascending order).

Frozen historical rows (the session-146..166 bullets' own count
records, the v1.125.0..v1.145.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its tenth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s167.py
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

# --- digma_SKILL.md — the v1.145.0 bump + F154 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.144.0", "version: 1.145.0"),
])

# The F154 lesson, inserted AFTER F153 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f154 = (
    "154. **F154 — the session-167 family: the FAMILY-COMPLETION-CENSUS member (the S148-C "
    "completion class's scope lesson).** The session-167 audit found A167-L-1: the S148-C "
    "cycle completed the errorTitle family's delete member in teams-view.tsx (the "
    "\"Delete failed\" option + its registration comment) while the SAME FILE's create-team "
    "and invite-member POSTs stayed generic — nineteen cycles later the family reopened at "
    "the missed siblings (a failed create/invite toasted the seam's generic \"Something went "
    "wrong\" while every sibling action surface carried site copy). THE LESSON: a "
    "family-completion fix is itself a census claim — when completing a per-surface family "
    "(error copy, guards, gesture tokens), enumerate EVERY consumer of the seam in EVERY "
    "file at fix time, never inherit the finding's own enumeration; the completion must "
    "close member-by-member at the whole-family scope (grep the seam's consumer surface, "
    "count the live carriers — excluding the registration comments' quoted mentions — and "
    "pin the census in the spec), or the next audit finds the missed sibling. A family "
    "claim's scope is the seam's FULL consumer census, re-derived live at fix time.**\n"
)
f153_end = "the member-count must CLOSE, not just the member-list be true.**\n"
if f153_end not in text:
    raise SystemExit("F153 end anchor not found")
if "**F154 — the session-167 family" not in text:
    at = text.index(f153_end) + len(f153_end)
    text = text[:at] + f154 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F154 lesson inserted after F153")
else:
    print("digma_SKILL.md: F154 lesson already present")

# --- Project_Architecture_Document.md — the v1.146.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.146.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.145.0",
     "# Digma — Master Project Architecture Document (PAD) v1.146.0"),
])

# The new v1.146.0 Last-Updated entry, inserted ABOVE the retained
# v1.145.0 entry (the chain head).
# THE S158-C FIX (holding its tenth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-21 (v1.146.0 — the errorTitle pair completion + registration pair pass, the one-hundred-and-fifteenth audit's chosen work, the auditors' census A 0C/0H/0M/1L/1I + B 0C/0H/0M/0L/0I — a ONE-LOW-ONE-INFORMATIONAL cycle, the first source-carrying cycle since S162, every claim lead-verified live at its seams: S167-A THE ERRORTITLE PAIR COMPLETION (A167-L-1, the S148-C family closed at its full consumer census): teams-view.tsx's create-team POST and invite-member POST called the shared call() seam WITHOUT { errorTitle } — a failed create/invite toasted the generic \"Something went wrong\" while every sibling action surface carries site copy (the S148-C cycle completed the family's DELETE member in this very file and missed the create/invite members beside it — the family-completion census scoped to the finding's surfaces, never re-derived at the seam's full consumer census); both POSTs restructured onto the family's own multi-arg call form (the project-card create's exact shape) with { errorTitle: \"Could not create the team\" } and { errorTitle: \"Invite failed\" } + the registration comments at both seams (the S148-C precedent's form); the family closes at SEVEN call() consumers; teams-view.tsx 528 → 540 (+12); the 22-file layer 14,295 → 14,307 (the first movement since S162 — the F40 prior-spec riders ride) + S167-B THE REGISTRATION PAIR: the bracketed s167-401-terminal-note (the A167-I-1 standing registration — the S68-D dead-session terminal enforced at the machine's flush and the drain's busy predicate but NOT at the two one-shot boundary transports, the unmount cleanup's exit PUT and the pagehide onUnload keepalive PUT, both guarded only on saveState + projectId; a dead session's exit fires ONE doomed PUT — single-shot, no loop, response ignored, defensible-by-design (the boundary PUT can succeed after re-auth in another tab); the doctrine: a terminal's enforcement scope is itself a census — name every transport that can still fire post-terminal, and either guard it or register the one-shot exemption honestly) + the s167-id-stable-premises-note (the 40th consecutive cycle — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S167-C the per-session pin family (tests/lows-s167.test.ts — 15 pins: 7 RED incl. the two source-side members (the spec born BEFORE the source fix, the TDD form — the first source-side RED members since S162) and the pair-unity RED-until-collateral / 8 green-at-birth, the registrations landed before the spec's birth per the standing precedent; RED 7/8 EXACT after ONE spec-form repair — the audit-entry pin's finding designation onto the entries' own L1/I1 spellings (the pin matches the record as it landed, never a projected designation); a second spec-form repair at the source-green pass — the family-census counting form onto the line-start carrier match, excluding the registration comments' quoted mentions; the F138 guard's EIGHTEENTH instance riding the survival form — the s166 plan's record pinned 5/5 ticked at 7d4cd446 per the pre-armed session_381 directive) and the collateral family (the count-family re-anchor 2330 = 2315 + 15 unit / 229 files across every live claim site; the layer-total family MOVING 14,295 → 14,307 — the §11 teams-view row 528 → 540 with the S167-A registration tail, the F40 riders: the s156/s157/s158/s163/s164/s165/s166 layer-total hard pins onto 14307 (eleven pins across seven specs, the s162 precedent's own form); the s151..s166 SKILL-version pins onto v1.145.0; the s154..s166 forward-guard rolling re-anchors onto v1.146.0 — the guard family's thirteenth through first rolling instances; the s158 title pin onto v1.146.0; the route figure STAYS 2,450; e2e stays 262; smoke stays 73) — the 22-file layer at **14,307 lines** (the MOVES-cycle form after four STAYS cycles: teams-view +12 under the errorTitle pair completion); the 143rd reference audit NO DRIFT (the clip pin byte-identical the 104th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s177/); mobile nav 9/9 the 144th session (the Tailwind v4 class-A guard holds — verified on the FINAL S167 build); the one-hundred-and-fifteenth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/1L/1I — the comment-truth audit ~142 sampled with 142 TRUE / 0 FALSE, the third consecutive zero-false sampling; auditor B's 0C/0H/0M/0L/0I — the F138 sweep's eighteenth instance all-clean, the count-family live sweep all-true, the deferral premises the 40th consecutive cycle all four holding); the honest environment record: the workspace REBUILT after a reset (the fresh clone, the deps reinstalled, the DB seeded pristine 1/2/6/1/3 on the first probe, one infrastructure incident honestly recorded — the missing chromium_headless_shell-1243 failing the first e2e run before bunx playwright install chromium re-provisioned it, the source never at fault; the trap guarded by the env -u prefix on every DB-touching gate)\n"
)
retained = "**Last Updated:** 2026-10-20 (v1.145.0 — the write-set arithmetic-closure correction registration pass"
if retained not in text:
    raise SystemExit("the retained v1.145.0 entry anchor not found")
if "**Last Updated:** 2026-10-21 (v1.146.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.146.0 chain entry inserted (v1.145.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.146.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 10th) -----
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
