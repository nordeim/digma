#!/usr/bin/env python3
"""The session-174 version bumps: the PAD onto v1.153.0 (the title onto the
new chain head — the S158-C post-run title verification holding its
seventeenth cycle) and the digma_SKILL onto v1.152.0 + lesson F161 (the
counting-unit-explicitness member; inserted after F160 — ascending order).

Frozen historical rows (the session-146..173 bullets' own count
records, the v1.125.0..v1.152.0 headers' records, the worklog's
delivery records — the B145-I1 coincidental-literal collisions) are
NEVER touched — the F106 live-claim-sites-only doctrine; every patch
anchors by CONTENT (long unique strings, exactly-one-hit), never by
bare figure.

THE S158-C FORWARD FORM (holding its seventeenth cycle): a bump script's
application is verified AT THE TREE after the run — the title diffed
against the chain head, never trusted from the patch list. The entry
insertion RE-READS the file after the title patch (the S157-class
stale-text clobber made impossible).

Run from the repo root:  python3 scripts/version-bump-s174.py
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

# --- digma_SKILL.md — the v1.152.0 bump + F161 ------------------------------
patch("digma_SKILL.md", [
    ("version: 1.151.0", "version: 1.152.0"),
])

# The F161 lesson, inserted AFTER F160 (ascending order).
skill = ROOT / "digma_SKILL.md"
text = skill.read_text()
f161 = (
    "161. **F161 — the session-174 family: the COUNTING-UNIT-EXPLICITNESS member "
    "(the evidence-truth family's measurement arm).** The session-174 audit re-derived the "
    "session-173 Tailwind phantom-rule registration with a fresh probe and measured 27 "
    "generated utility rules carrying oklch where the registration said 26 — both figures "
    "TRUE under their own counting units: 26 rules under the color-valued unit (rules whose "
    "declarations carry an oklch color value) and 27 under the raw-substring unit (rules "
    "whose text carries the token anywhere — the +1 being the .bg-linear-to-r/oklch "
    "interpolation-modifier variant whose class NAME carries \"oklch\" rather than an oklch "
    "color value). The registration had not drifted; it had never pinned its unit. THE "
    "LESSON: a registered count must name its counting unit whenever the artifact admits "
    "more than one defensible census — the same compiled CSS supports \"26 oklch-resolved "
    "utility rules\" and \"27 rules carrying oklch\", and the difference is unit ambiguity, "
    "not source drift; an unpinned unit is a method-dependent claim, and the next verifier "
    "inherits the burden of guessing the method (a census that must guess is a census that "
    "can false-alarm or false-pass — the false-alarm arm being the phantom-drift report, the "
    "false-pass arm being the verifier who matches the figure by silently choosing the "
    "record's unit after the fact). The honest forms: pin the unit IN the registration "
    "(\"26 color-valued rules — 27 under the raw-substring unit, the +1 being the "
    ".bg-linear-to-r/oklch modifier variant\") or name the derivation's counting form "
    "alongside the figure. The sweep discipline: when a registered figure is re-derived by a "
    "different instrument and the counts differ, suspect the UNIT before suspecting the "
    "source — reconcile the counting units first, then judge the drift; and when writing a "
    "NEW registration that carries a measured count, ask which other units the same artifact "
    "supports and name the one the record pins.**\n"
)
f160_end = "let the next source-carrying cycle decide.**\n"
if f160_end not in text:
    raise SystemExit("F160 end anchor not found")
if "**F161 — the session-174 family" not in text:
    at = text.index(f160_end) + len(f160_end)
    text = text[:at] + f161 + text[at:]
    skill.write_text(text)
    print("digma_SKILL.md: F161 lesson inserted after F160")
else:
    print("digma_SKILL.md: F161 lesson already present")

# --- Project_Architecture_Document.md — the v1.153.0 chain ---------------------
pad = ROOT / "Project_Architecture_Document.md"

# The title onto the new chain head v1.153.0.
patch("Project_Architecture_Document.md", [
    ("# Digma — Master Project Architecture Document (PAD) v1.152.0",
     "# Digma — Master Project Architecture Document (PAD) v1.153.0"),
])

# The new v1.153.0 Last-Updated entry, inserted ABOVE the retained
# v1.152.0 entry (the chain head).
# THE S158-C FIX (holding its seventeenth cycle): RE-READ the file after the
# title patch — the entry insertion must never write the stale
# pre-patch text back (the S157-class clobber made impossible).
text = pad.read_text()
entry = (
    "**Last Updated:** 2026-10-23 (v1.153.0 — the below-threshold + posture-precision + coordinate-next-generation registrations pass, the one-hundred-and-twenty-second audit's chosen work, the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/3I — a ZERO-SOURCE-FINDING all-Informational cycle, the SEVENTH consecutive STAYS cycle, every actionable member on the doc/directive/registration surface, every claim lead-verified live at its seams: S174-A THE BELOW-THRESHOLD + POSTURE-PRECISION + COORDINATE-NEXT-GENERATION REGISTRATION (the six-member batch at the bracketed s174-below-threshold-note): B174-I-1 the ELEMENT_LIMIT message-literal family (the three \"Too many elements (max 2000)\" envelope literals at elements/route.ts:261/:276/:308 hard-coding the ceiling while the enforcement reads the shared ELEMENT_LIMIT seam consumed at :125/:144/:308; zero impact today — ELEMENT_LIMIT = 2000, the messages TRUE; a future re-tune would leave the three messages and the two spec pins coherent-with-each-other but stale-against-the-constant; the promotion form `Too many elements (max ${ELEMENT_LIMIT})` registered, not promoted) + A174-I-2 + B174-I-3 the Tailwind posture-precision datum WITH ITS COUNTING-UNIT EXTENSION (the A173-I-2 datum re-verified live through the installed 4.3.3: oklch appears in the compiled output as 63 :root default-theme tokens for unconsumed members AND inside the phantom utility-rule family for classes consumed NOWHERE in src/, sourced from the operator's skills/ catalog via v4 automatic content detection, the detection perimeter being the REPO, not the app — skills/ out of audit scope but not out of the scanner's, not gitignored, no @source lever pulled; THE COUNTING-UNIT DATUM: the measured census is 26 rules under the color-valued unit (the registration's own '~26') and 27 under the raw-substring unit — the +1 being the .bg-linear-to-r/oklch interpolation-modifier variant whose class NAME carries the token rather than an oklch color value; the unpinned counting unit made the registered figure method-dependent; bytes-only dead weight ~1-2 KB, zero rendering impact, the production minifier rewriting oklch to lab(); the standing correction: a dead-class posture must name BOTH the consumed set AND the scanner's source perimeter AND the counting unit; the exclusion lever @source not \"../skills\" in globals.css or a .gitignore entry, registered not promoted per the STAYS convention — the layer total STAYING 14,307, a globals.css edit would MOVE it) + B174-I-2 the frozen-record PAD coordinate next-generation (the B173-I-3 registration's own 'live carriers' PAD:2822/:2823/:2882/:2951 derived TRUE at its derivation HEAD c66d20ae but shifted by the same session's delivery commit 05836930 inserting the v1.152.0 chain line + the s173 §7.1 row — the live carriers at HEAD :2823 (the s172 row) / :2825 (the Unit total) / :2884 (the checklist) / :2953 (the command row), line :2822 now holding the s171 frozen row and :2821 the s170 row; the dispatch brief quoted the pre-delivery coordinates — the brief-lineage shape recurring; frozen records never rewritten, the note IS the re-anchor, re-derive at dispatch per the S140-C coordinate-liveness doctrine) + the A174-I-1/I-3 continuity pair (the five S168 below-threshold observations re-verified; the components-panel PAD §10 posture) + S174-B THE PREMISES REGISTRATION: the s174-id-stable-premises-note (the 48th consecutive cycle — the four premises re-derived live and holding: P1's twelve churn-consuming sites value-based or honest-refusal, P2's index-stable remap behind the five-guard stack, P3's replace-transaction trio in one $transaction with the 30s timeout, P4's zero-storage perimeter; the judgment carried unchanged) + S174-C the per-session pin family (tests/lows-s174.test.ts — 12 pins: 6 RED doc-side members / 6 green-at-birth, the registration notes landed before the spec's birth per the standing precedent; RED 6/6 EXACT after ONE spec-form repair — the repair-seam phrase onto the record's own spelling, the F143 phrase-case lesson's own instance; the F138 guard's TWENTY-FIFTH instance riding the survival form — the s173 plan's record pinned 5/5 ticked at 05836930 per the pre-armed session_427/428 directive) and the collateral family (the count-family re-anchor 2428 = 2416 + 12 unit / 236 files across every live claim site; the spec-constants sweep 55 UNIT + 54 FILES — the +1 arithmetic the s174 spec's own rolling-safe birth; the layer-total family STAYING at 14,307 — the SEVENTH consecutive STAYS cycle, the zero-source-change form, zero F40 riders, zero §11 re-anchors; the route figure STAYING at 2,450; the s151..s173 SKILL-version pins onto v1.152.0; the s154..s173 forward-guard rolling re-anchors onto v1.153.0 — the guard family's twentieth through first rolling instances; the s158 title pin onto v1.153.0; e2e stays 262; smoke stays 73) — the 22-file layer at **14,307 lines** (the STAYS-cycle form, the seventh consecutive — the zero-source-change cycle touching zero source files); the 150th reference audit NO DRIFT (the clip pin byte-identical the 111th consecutive session — CLEAN ON THE FIRST RUN; evidence in docs/screenshots/ref-audit-s184/); mobile nav 9/9 the 151st session (the Tailwind v4 class-A guard holds — the drawer/44px-links/focus-trap/Escape/scroll-lock/md-crossing/768-boundary contracts all re-verified live); SEO 4/4; the one-hundred-and-twenty-second Mode C audit with every claim lead-verified live at its seams (auditor A's 0C/0H/0M/0L/3I — the comment-truth audit 141 sampled with 141 TRUE / 0 FALSE, the NINTH consecutive zero-false sampling; the security sweep zero across all seven patterns + the adjacent sinks; the Tailwind 4.3.3 dead-class probe with all consumed class forms generating, all 58 consumed color scale-shades hex-pinned, zero oklch for consumed classes; the five S168 below-threshold observations re-verified; the correctness focus traced clean — the undo/redo snapshot logic, the autosave machine end-to-end, the id-remap behind the five-guard stack); auditor B's 0C/0H/0M/0L/3I — every S173 registration seam verified TRUE live (the ELEMENT_LIMIT family at its literals/seam/pins, the count family re-run green 14/14, the spec constants 54 UNIT + 53 FILES exact, both worklog registrations present, the B173-I-3 re-anchor TRUE at its derivation commit with its next-generation shift registered), the e2e write-set arithmetic 19+1+5=25 HOLDS with every posture live-verified (13 of the 19 write-carrying), the F138 sweep's twenty-fifth instance all-clean (s151..s173, 140 ticked / 0 unticked, every per-plan commit enumerated), the deferral premises the 48th consecutive cycle all four holding); the honest environment record: the workspace INTACT from the S173 session (no sandbox reset this cycle — .env diff-clean with DATABASE_URL=\"file:../db/custom.db\", db/ at the repo root, the DB pristine 1/2/6/1/3, chromium-1248 present BEFORE the first e2e run — the S167-shape incident pre-empted a SIXTH consecutive cycle without occurring, the source never at fault; the trap guarded by the env -u prefix on every DB-touching gate)\n"
)
retained = "**Last Updated:** 2026-10-23 (v1.152.0 — the below-threshold + directive-side + posture-precision registrations pass"
if retained not in text:
    raise SystemExit("the retained v1.152.0 entry anchor not found")
if "**Last Updated:** 2026-10-23 (v1.153.0 —" not in text:
    at = text.index(retained)
    text = text[:at] + entry + text[at:]
    pad.write_text(text)
    print("Project_Architecture_Document.md: the v1.153.0 chain entry inserted (v1.152.0 retained)")
else:
    print("Project_Architecture_Document.md: the v1.153.0 entry already present")

# --- THE S158-C POST-RUN VERIFICATION (the forward form, holding its 17th) ----
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
