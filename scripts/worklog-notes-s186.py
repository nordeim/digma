#!/usr/bin/env python3
"""worklog-notes-s186.py — land the Session 186 registration notes at the
repo worklog (the standing precedent: the registration notes land BEFORE
the spec's birth), then transplant the two s186 auditor entries from the
host worklog at their Task-ID anchors:

  [s186-id-stable-premises-note: ...]   (the 60th consecutive cycle)
  [s186-below-threshold-note: ...]      (the cycle's members)
  Task ID: digma-s186-3-a / digma-s186-3-b  (the transplanted audit records)

Idempotent: skips if the anchor already present.
"""
from pathlib import Path

WORKLOG = Path("/home/z/my-project/digma/worklog.md")
HOST = Path("/home/z/my-project/worklog.md")

B_NOTE = (
    "[s186-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SIXTIETH CONSECUTIVE CYCLE, all four premises re-derived LIVE this cycle by auditor B, all four HOLDING: P1 the churn-consuming registrations value-based or honest-refusal at all twelve sites (editor-store markSaved :241-281 with the remap.get(id) ?? id + reuseStableElements + sameIdSequence mechanisms, addElements :354, updateElements :418, scaleElements :469, moveElements the VALUE-based moved flag :531-567, deleteElements :570, reorderElements :607, toggleVisibility :656, toggleLock :680; properties-panel patchDiffers guards :1372/:1741/:2202; layers-panel the honest-refusal retype posture at :39 (the coordinate corrected at S184); ai-assistant the send-time targetIds capture :589 with the apply-time patchWouldChange value compare :403 — the S185-corrected coordinates, both verified again this cycle) — the twelve sites CLIENT-LAYER, the elements route P3's site; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack in the registered order (disposed :373, swap :381, elements-reference :382, background :399, gesture :409) — THE FILE LABEL CORRECTED THIS CYCLE per the S186 B-I-1 finding: the dispatch brief named elements/route.ts for this member while those same coordinates in that file are the P2024/P2028 transaction-abort catch arm; the remap (oldIds :413, the remap Map :414, the forEach :415-:418, the markSaved call carrying the remap :419) lives in editor-view.tsx — the registered form has carried the correct file since S178; the F170 family's FILE-LABEL member, the cycle after the line-label member; the premise holds exactly at the stated coordinates in editor-view.tsx; P3 the replace-transaction seams at elements/route.ts:365-382 (deleteMany :366 + createMany :368 + project.update :370 + the inside-read findMany :378, one $transaction :365, timeout 30_000 :382; duplicate :113 the same 30s form); P4 the value-based perimeter (zero web-storage anywhere in src/ — rg localStorage|sessionStorage|indexedDB across src/ exit 1; the two censused members — fillImageBytes the maintained counter at POST-gate/PUT-recompute/duplicate-seed, backgroundColor the S33-3 same-transaction form). The judgment carried unchanged from the prior fifty-nine cycles: the structural rewrite's regression risk continues to outweigh its churn-optimality benefit at this stability level — nothing in this cycle's census (a 0C/0H/0M/1L/6I cycle whose one Low is a two-class composition repair on a non-store surface) grows a mutation-surface member that would promote it. The premises-pinning doctrine (F130, carried): a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred, and pin them so the re-derivation is mechanical.]"
)

BELOW_THRESHOLD_NOTE = (
    "[s186-below-threshold-note: THE FIFTEENTH-GENERATION COORDINATE "
    "VERIFIED + THE COPIED-COMPOSITION TRUTH LESSON + CONTINUITY "
    "REGISTRATIONS (the cycle's census A 0C/0H/0M/1L/4I + B "
    "0C/0H/0M/0L/2I combined 0C/0H/0M/1L/6I — the THIRD consecutive "
    "cycle with Low-severity members, again surfaced by measurement "
    "depth under the SAME v1.1.0 vocabulary for the SIXTH consecutive "
    "cycle): THE FROZEN-RECORD COORDINATE FIFTEENTH GENERATION (the "
    "family's fifteenth instance, the FOURTH verified under the "
    "corrected arithmetic — the F169 member's fourth verification): "
    "the S185 delivery's own two PAD insertions (the v1.164.0 "
    "Last-Updated chain line at :6 + the s185 §7.1 row at :2848) "
    "shifted the registered fifteenth-generation carriers +2 to :2849 "
    "(the Unit total) / :2908 (the checklist) / :2977 (the command "
    "row) — the carriers AND the s185 row at :2848 ALL EXACT as the "
    "s185-below-threshold-note's appended post-collateral figures "
    "pre-registered (verified live by the lead at the cycle's open AND "
    "auditor B independently with every row label in the window "
    ":2833..:2848 read live — the corrected arithmetic's FOURTH "
    "application, every carrier figure exact, the s170..s185 family "
    "at :2833..:2848 with :2832 the s169 row). THE F173 LESSON — THE "
    "COPIED-COMPOSITION TRUTH MEMBER (the F168/F169/F170/F171/F172 "
    "record-truth family's next member, at the engine-version layer): "
    "a class composition measured from a reference rendered by a "
    "DIFFERENT engine version is itself a rendering claim about the "
    "TARGET's engine — the composition re-derived under the target's "
    "own cascade law before shipping (the S186 A-L-1 member: the "
    "reference's v3-born -mb-2 on the login minimal-card back-link "
    "composed with space-y's margin on the LATER sibling under v3's "
    "* + * margin-top implementation (24-8=16px), but under v4's "
    ":where(.space-y-6 > :not(:last-child)) margin-block-end "
    "implementation the child's own (0,1,0) utility REPLACES the "
    "(0,0,0) :where() margin — an 8px overlap present since the "
    "minimal card's birth, undetected by 185 cycles because the "
    "ref-audit clip family never captures the login minimal states "
    "and the e2e asserted visibility only; the F171 rendered-output "
    "lesson EXTENDED from the token/gradient layer to the "
    "composition layer — and the skill's own §12 trap-4 prescription "
    "the mirror form: the explicit mt-* rides the LATER child, never "
    "stacked mb on the space-y child itself). THE S186 REMEDIATION "
    "REGISTRATIONS: S186-A the trap-4 subtractive repair (A-L-1 — the "
    "-mb-2 dropped from the back-link, the minimal-conditional -mt-2 "
    "mirrored onto the header wrapper at :333, the 16px/24px rhythm "
    "restored; the e2e locator retired with the class + the geometry "
    "pin added — the count(1) one-button form on the sent state, the "
    "24px computed-gap assertion on the 1280px viewport of the signup "
    "test; the layer MOVING to the measured figure — the F40 rider "
    "engaging, a deliberate remediation never drift). THE STANDING "
    "POSTURES CARRIED: A-I-1 the S96-A closed-set receipt's "
    "context-scoped claim (the phrase TRUE for all 12 gradient inline "
    "styles; the layer's other hex sites the documented S97-A data "
    "carve-outs — the dispatch's broader 'zero hex literals in TSX' "
    "paraphrase not the tree's claim, the F172 scope-precision note); "
    "A-I-2 the plain-@theme vocabulary nuance (the trap-1/2 intent "
    "satisfied with the documented :root-emission rationale); A-I-3 "
    "the two documented raw-fetch deviations (the RA-60 auth-card "
    "inline alert + the autosave machine's serialized transport); "
    "A-I-4 the S184-A OTP guard's dispatch coordinate corrected to "
    ":246 (the autoComplete conditional at :401 — the substance "
    "holding, the F170 family's coordinate member, the THIRD "
    "consecutive coordinate-correction cycle); B-I-2 the e2e "
    "write-set numeric closure with the no-e2e five enumerated "
    "(elements GET, elements POST, duplicate POST, teams/[id] PATCH, "
    "members POST — the no-first-party-consumer family, unit-covered; "
    "logout e2e-covered via the reset-password spec); the S67-C "
    "shared auth: bucket; the validation.ts-with-substance ADR; the "
    "S130-C read-path no-envelope posture and its S184-D write-path "
    "twin; the A-I-1 OTP index-0 append-into-filled-cell residual "
    "(S184-A's documented tradeoff); the four Unsplash URLs, the "
    "components-panel no-op +, the stopPropagation-only div wrappers; "
    "the s184-era postures carried verbatim. THE SIXTEENTH GENERATION "
    "PRE-REGISTRATION — THE MEASURED FORM (the F169/F171 discipline "
    "carried): this cycle's delivery carries the standard two PAD "
    "insertions (the v1.165.0 chain line at :6 + the s186 §7.1 row) "
    "— the sixteenth-generation carriers are therefore expected at "
    "the +2 form (:2851/:2910/:2979, the s186 row at :2850, the "
    "corrected s170..s186 family at :2833..:2850 with :2832 the s169 "
    "row) BUT the figures are appended to this note at the MEASURED "
    "post-collateral coordinates after the collateral lands and "
    "BEFORE the delivery commit (the measured form governs — never a "
    "forecast when the insertion count is in any doubt). The "
    "same-vocabulary hold: the SIXTH consecutive cycle under "
    "skills/web-application/SKILL.md v1.1.0 (unchanged since the "
    "operator's 2026-10-23 revision); the honest environment record: "
    "the workspace RESET this cycle (a fresh clone, chromium-1248 "
    "provisioned before the e2e run, the exported-shell DATABASE_URL "
    "trap guarded by env -u on every DB-touching gate); the comment-"
    "truth census 31 sampled / 31 TRUE / 0 FALSE — the zero-false "
    "direction RETURNING after two single-false cycles; the route "
    "figure STAYING at 2,461 (elements 420 — its eleventh re-quote "
    "cycle); e2e stays 262 (assertions only — the geometry pin riding "
    "an existing test); smoke stays 73; the pins S128..S185 = 778 "
    "across 58 spec files entering, the s186 spec joining as the "
    "59th.]"
)

text = WORKLOG.read_text()
if "[s186-below-threshold-note:" in text:
    raise SystemExit("s186 notes already landed")

# the anchor: the tail of the s185 lead entry (the last entry in the
# repo worklog before this cycle's additions)
anchor = "The gates: unit 2574/2574 across 247 · e2e 262/262 · nav 9/9 (the 162nd session) · the 161st reference audit NO DRIFT (the clip byte-identical the 122nd session) · pins 778/778 · capture 86 (73 fresh + 13 byte-identical) · dimensions 1014/1014 · F138 36th passed · the premises 59th cycle"
if anchor not in text:
    raise SystemExit("ANCHOR NOT FOUND — the s185 lead entry tail missing")

# --- transplant the two auditor entries from the host worklog ----------
host = HOST.read_text()

def extract_entry(task_id: str) -> str:
    at = host.index(f"Task ID: {task_id}")
    # back up to the '---' separator line above the entry
    sep = host.rfind("\n---\n", 0, at)
    entry = host[sep + len("\n---\n"):].split("\n---\n")[0]
    return entry.rstrip("\n")

auditor_a = extract_entry("digma-s186-3-a")
auditor_b = extract_entry("digma-s186-3-b")
if "0C/0H/0M/1L/4I" not in auditor_a and "0C / 0H / 0M / 1L / 4I" not in auditor_a:
    raise SystemExit("auditor A entry malformed — census line missing")
if "0C/0H/0M/0L/2I" not in auditor_b and "0C / 0H / 0M / 0L / 2I" not in auditor_b:
    raise SystemExit("auditor B entry malformed — census line missing")

addition = (
    "\n\n" + B_NOTE + "\n\n" + BELOW_THRESHOLD_NOTE + "\n\n---\n"
    + auditor_a + "\n\n---\n" + auditor_b + "\n"
)
WORKLOG.write_text(text.rstrip("\n") + "\n" + addition.lstrip("\n"))
lines = WORKLOG.read_text().count("\n") + 1
print(f"notes + auditor transplants landed: worklog now {lines} lines")
