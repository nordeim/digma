#!/usr/bin/env python3
"""worklog-notes-s173.py — land the Session 173 auditors' block at the
repo worklog (the standing precedent: the registration notes land BEFORE
the spec's birth). Appends:

  --- 
  Task ID: digma-s173-audit-B   (auditor B's entry, the premises note riding inside)
  Task ID: digma-s173-audit-A   (auditor A's entry, the below-threshold note riding inside)
  ---

Idempotent: skips if the anchor already present.
"""
from pathlib import Path

WORKLOG = Path("/home/z/my-project/digma/worklog.md")
B_ENTRY = Path("/home/z/my-project/auditor-B-entry-s173.md")
A_ENTRY = Path("/home/z/my-project/auditor-A-entry-s173.md")

B_NOTE = (
    "[s173-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE FORTY-SEVENTH CONSECUTIVE CYCLE, all four premises re-derived LIVE this cycle by auditor B, all four HOLDING: P1 the churn-consuming registrations value-based or honest-refusal at all twelve sites (editor-store markSaved/addElements/updateElements/scaleElements/moveElements/deleteElements/reorderElements/toggleVisibility/toggleLock; properties-panel fillKey :1858; layers-panel rename; ai-assistant send-time targetIds); P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack (disposed :373, swap :381, elements-reference :382, background :399, gesture :409); P3 the replace-transaction seams at elements/route.ts:365-382 (deleteMany + createMany + project.update + the inside-read findMany, one $transaction, timeout 30_000); P4 the value-based perimeter (zero localStorage/sessionStorage/indexedDB anywhere in src/). The judgment carried unchanged from the prior forty-six cycles: the structural rewrite's regression risk continues to outweigh its churn-optimality benefit at this stability level — nothing in this cycle's census (a ZERO-SOURCE-FINDING all-Informational cycle — the SIXTH consecutive STAYS cycle, the layer total STAYING 14,307, the route figure STAYING 2,450, every actionable member living on the doc/directive/registration surface) grows a mutation-surface member that would promote it. The premises-pinning doctrine (F130, carried): a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred, and pin them so the re-derivation is mechanical.]"
)

BELOW_THRESHOLD_NOTE = (
    "[s173-below-threshold-note: THE BELOW-THRESHOLD + DIRECTIVE-SIDE + "
    "POSTURE-PRECISION REGISTRATIONS (A173-I-1 + A173-I-2 + A173-I-3 "
    "auditor A's trio; B173-I-1 + B173-I-2 + B173-I-3 auditor B's trio — "
    "all Informational, Verified; the deferral family's standing "
    "re-verification): the five S168-registered below-threshold "
    "observations recomputed live at the 121st cycle by auditor A, all "
    "five still accurately described, still below-threshold, correctly "
    "located — (a) the Insert handler's inline four-draw-type membership "
    "at editor-view.tsx:982-985; (b) the no-op-guards counting-unit "
    "nuance at editor-store.ts:758-763; (c) the gradient-stop "
    "same-reference posture at editor.ts:986; (d) the no-op dismiss "
    "timers at use-toast.ts:59-61; (e) the mobile crossing-close family "
    "(the lg pair at editor-view.tsx:1403/:1530, the md member at "
    "app-header.tsx:67) — plus the components-panel no-op with its PAD "
    "§10 scope cut — carried per the standing plans. THE ELEMENT_LIMIT "
    "MESSAGE-LITERAL FAMILY (B173-I-1, below-threshold): the three 'Too "
    "many elements (max 2000)' envelope messages at elements/route.ts:"
    "261/:276/:308 hard-code the ceiling literal while the enforcement "
    "reads the shared ELEMENT_LIMIT seam (src/lib/editor.ts, consumed at "
    ":125/:144/:308); the spec pins (tests/elements-cap.test.ts:38/:56) "
    "pin the message string, not the constant; zero impact today "
    "(ELEMENT_LIMIT = 2000, the messages TRUE) — a future re-tune would "
    "leave the three messages and the two pins coherent-with-each-other "
    "but stale-against-the-constant; the promotion form if ever needed "
    "is the ${ELEMENT_LIMIT} interpolation at the three sites — "
    "REGISTERED, not promoted. THE POSTURE-PRECISION MEMBER (A173-I-2, "
    "the compile-output arm of the F89 evidence-truth family): the "
    "registered Tailwind dead-class posture said 'oklch appears in the "
    "compiled output only as v4 default-theme tokens for classes the app "
    "never consumes' — the live artifact additionally carries 26 "
    "generated utility rules with oklch (.bg-zinc-950/70, .shadow-"
    "indigo-900, .bg-amber-400/10 ...) for classes consumed NOWHERE in "
    "src/, sourced from the operator's skills/ catalog via v4 automatic "
    "content detection (the detection perimeter is the REPO, not the "
    "app — skills/ is out of audit scope but not out of the scanner's); "
    "bytes-only dead weight (~1-2 KB), zero rendering impact, the "
    "production minifier rewriting oklch to lab() in the shipped chunks; "
    "the standing correction: a dead-class posture must name BOTH the "
    "consumed set AND the scanner's source perimeter; the exclusion "
    "lever is the tool's own (@source not '../skills' in globals.css or "
    "a .gitignore entry) — REGISTERED, not promoted, per the STAYS "
    "convention (the layer total STAYING 14,307; a globals.css edit "
    "would MOVE it). THE DIRECTIVE-SIDE MEMBER (B173-I-2, the "
    "F157/A171-I-1/B172-I-2 class, in the audit directive itself, never "
    "in any source or frozen record): the s173 dispatch directive's "
    "count-family decomposition read '226 tests/ + 7 src/lib + 1 other' "
    "while the live derivation is 227 tests/ + 7 src/lib + 0 other "
    "(vitest: 234 files = 227 + 7; the 10 skills/ test files "
    "config-excluded); the total 234 closes either way; only the "
    "decomposition was stale (the 226+7 form was the s172-era "
    "pre-spec-birth figure). Next-generation correction: '227 tests/ + "
    "7 src/lib'. THE FROZEN-RECORD COORDINATE DRIFT (B173-I-3, the "
    "A147-I1/F134 class): the worklog's frozen s172 record names "
    "PAD:2821/:2880/:2949 as its count-family site list — pre-insertion "
    "coordinates; the s172 cycle's own two insertions (the §7.1 row + a "
    "revision-block line) shifted the live carriers to PAD:2822 (the "
    "s172 row) / :2823 (the Unit total) / :2882 (the checklist) / :2951 "
    "(the command row), line 2821 today holding the s171 frozen row "
    "(its then-true 2392/233); a future sweep following the record's "
    "PAD triplet would misread the s171 row as a live stale site; no "
    "gate hazard (the spec pins are content-form); this note IS the "
    "family's standing re-anchor disposition — frozen records never "
    "rewritten. THE PRE-EXISTING FAMILY carried with their postures per "
    "the s172-below-threshold-note (the B172-I-2 directive-side member "
    "with its landed next-generation correction; the A172-I-1..I-3 "
    "trio; the s171/s167/s168/s169/s170/s171 below-threshold families; "
    "the s167-401-terminal, s170-count-truth, s171-dependency-bump "
    "standing registrations). REGISTERED, not promoted.]"
)

text = WORKLOG.read_text()
if "Task ID: digma-s173-audit-B" in text:
    print("already landed — skip (idempotent)")
    raise SystemExit(0)

b_entry = B_ENTRY.read_text().strip()
a_entry = A_ENTRY.read_text().strip()

block = (
    "\n---\n\n"
    + b_entry
    + "\n\n"
    + B_NOTE
    + "\n\n"
    + a_entry
    + "\n\n"
    + BELOW_THRESHOLD_NOTE
    + "\n---\n"
)

WORKLOG.write_text(text.rstrip("\n") + "\n" + block)
print("landed: the s173 auditors' block (B entry + premises note + A entry + below-threshold note)")
