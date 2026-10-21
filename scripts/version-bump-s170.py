#!/usr/bin/env python3
"""The session-170 version bumps: the PAD onto v1.149.0 (the title onto the
new chain head — the S158-C post-run title verification holding its
thirteenth cycle) and the digma_SKILL onto v1.148.0 + lesson F157 (the
count-and-enumeration-closure member; inserted after F156 — ascending
order).

Frozen historical rows (the session-146..169 bullets' own count
records, the v1.125.0..v1.148.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its thirteenth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s170.py
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

# --- digma_SKILL.md — the v1.148.0 bump + F157 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.147.0", "version: 1.148.0"),
    ("last_updated: 2026-10-21", "last_updated: 2026-10-22"),
])

# The F157 lesson, inserted AFTER F156 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f157 = (
    "157. **F157 — the session-170 family: the COUNT-AND-ENUMERATION-CLOSURE member (the "
    "count-truth family's frozen-record arm).** The session-170 audit found A170A-I-2: the "
    "S169-A frozen worklog entry stated \"my live count is 15 return-{} sites across 13 arms\" "
    "while its own parenthetical enumeration totaled SIXTEEN sites (2+1+1+2+2+1+1+1+1+1+1+1+1 "
    "= 16) — the stated figure matching neither the literal-statement unit (13 sites) nor the "
    "ternary-inclusive unit its own enumeration rode (16); and B170-I-1: the S169-B frozen "
    "entry split the e2e tree as \"(43 files: 36 spec + helpers/setup/backdate)\" while the "
    "live tree holds 39 spec + 4 helpers = 43 — the total exact, the split member "
    "born-drifted against its own s168 predecessor's coherent form. THE LESSON: a recorded "
    "count and its own enumeration must close arithmetically IN THE SAME UNIT — an entry "
    "that enumerates the ternary-inclusive form must state the ternary-inclusive figure, and "
    "a split that names a count must derive both sides; the A144-I1/S145-C doctrine's "
    "frozen-record arm: the drift class does not die at the doc boundary — a worklog entry "
    "is as much a count-truth surface as a code comment; and the correction form for a "
    "frozen record is ALWAYS the NEXT generation's registration, never a rewrite (the "
    "evidence-truth family: the frozen entry is the audit's own artifact, its drift a "
    "recorded fact about the audit, not a live claim about the tree — rewriting it would "
    "falsify the audit's own history).**\n"
)
f156_end = "the consumer census and the docblock's tense close together).**\n"
if f156_end not in text:
    raise SystemExit("F156 end anchor not found")
if "**F157 — the session-170 family" not in text:
    at = text.index(f156_end) + len(f156_end)
    text = text[:at] + f157 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F157 lesson inserted after F156")
else:
    print("digma_SKILL.md: F157 lesson already present")

# --- Project_Architecture_Document.md — the v1.149.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.149.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.148.0",
     "# Digma — Master Project Architecture Document (PAD) v1.149.0"),
])

# The new v1.149.0 Last-Updated entry, inserted ABOVE the retained
# v1.148.0 entry (the chain head).
# THE S158-C FIX (holding its thirteenth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-22 (v1.149.0 — the count-truth registration + below-threshold/premises registrations pass, the one-hundred-and-eighteenth audit's chosen work, the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/1I — a FOUR-INFORMATIONAL cycle, the second consecutive, the FIRST ALL-REGISTRATION cycle since S166, every claim lead-verified live at its seams: S170-A THE COUNT-TRUTH REGISTRATION PAIR (A170A-I-2 + B170-I-1, the count-truth family's frozen-record arm): the S169-A frozen entry's no-op-guards site arithmetic — its stated \"15 return-{} sites across 13 arms\" against its own parenthetical enumeration's SIXTEEN sites (2+1+1+2+2+1+1+1+1+1+1+1+1 = 16 across 13 arms), the stated figure matching neither the literal-statement unit (THIRTEEN sites :460 :461 :517 :518 :589 :646 :668 :691 :710 :744 :763 :790 :824 across eleven arms plus the undo/redo converts — the S160-D comment's registered statement unit, which remains TRUE) nor the ternary-inclusive unit its own enumeration rode (SIXTEEN), or EIGHTEEN sites across 15 arms with the converts — and the S169-B frozen entry's e2e file-split — its \"(43 files: 36 spec + helpers/setup/backdate)\" against the live tree's THIRTY-NINE .spec.ts + FOUR non-spec helpers (auth.setup.ts, backdate-portfolio.ts, global-setup.ts, helpers.ts) = 43, the total exact, the \"36 spec\" member born-drifted against its own s168 predecessor's coherent form; the remediation the bracketed s170-count-truth-note at the worklog — the corrected unit-dependent truth stated in full with each figure naming its unit, the frozen records never rewritten (the S140-A registration form: the frozen entry is the audit's own artifact, its drift a recorded fact about the audit, not a live claim about the tree); ZERO source changes (the all-registration form — the 22-file layer at **14,307 lines**, the THIRD consecutive STAYS cycle, zero F40 riders, zero §11 re-anchors; the 18-file route layer at 2,450, untouched) + S170-B THE BELOW-THRESHOLD REGISTRATION: the bracketed s170-below-threshold-note (the A170A-I-1 + A170A-I-3 standing registration — the five S168 below-threshold observations re-verified at their seams with their postures, the (b) member restated in its corrected unit-naming form, plus the components-panel no-op's documented PAD §10 scope cut) + S170-C THE PREMISES REGISTRATION: the s170-id-stable-premises-note (the 43rd consecutive cycle — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S170-D the per-session pin family (tests/lows-s170.test.ts — 16 pins: 5 RED doc-side members / 11 green-at-birth, the three registration notes landed before the spec's birth per the standing precedent; RED 5/11 EXACT after TWO spec-form repairs at the RED birth — the count-truth-note pin's e2e-split substring + the audit-entry pins' closing-paren form, both onto the records' own spellings; the F138 guard's TWENTY-FIRST instance riding the survival form — the s169 plan's record pinned 6/6 ticked at d09c8b1b per the pre-armed session_403 directive) and the collateral family (the count-family re-anchor 2377 = 2361 + 16 unit / 232 files across every live claim site; the layer-total family STAYING at 14,307 — zero F40 riders; the route figure STAYING at 2,450; the s151..s169 SKILL-version pins onto v1.148.0; the s154..s169 forward-guard rolling re-anchors onto v1.149.0 — the guard family's sixteenth through first rolling instances; the s158 title pin onto v1.149.0; e2e stays 262; smoke stays 73) — the 146th reference audit NO DRIFT (the clip pin byte-identical the 107th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s180/); mobile nav 9/9 the 147th session (the Tailwind v4 class-A guard holds); the one-hundred-and-eighteenth Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/3I — the comment-truth audit 141 sampled with 141 TRUE / 0 FALSE, the FIFTH consecutive zero-false sampling; auditor B's 0C/0H/0M/0L/1I — the F138 sweep's twenty-first instance all-clean (s151..s169, 117 ticked / 0 unticked), the count-family live sweep all-true (224 tests/ + 7 src/lib = 231 derived exactly, the strongest form — the full unit gate re-run green), the deferral premises the 43rd consecutive cycle all four holding); the honest environment record: the workspace REBUILT after a reset (the fresh clone, the deps reinstalled, the DB seeded pristine 1/2/6/1/3 on the first census; one infrastructure incident honestly recorded — the missing chromium_headless_shell-1243 re-provisioned BEFORE the first e2e run, the S167 incident's own shape pre-empted for the second consecutive cycle, the source never at fault; the trap guarded by the env -u prefix on every DB-touching gate)\n"
)
retained = "**Last Updated:** 2026-10-21 (v1.148.0 — the docblock era-scoping correction + binding-shadow rename pass"
if retained not in text:
    raise SystemExit("the retained v1.148.0 entry anchor not found")
if "**Last Updated:** 2026-10-22 (v1.149.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.149.0 chain entry inserted (v1.148.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.149.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 13th) -----
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
