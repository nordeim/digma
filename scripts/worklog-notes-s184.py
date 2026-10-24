#!/usr/bin/env python3
"""worklog-notes-s184.py — land the Session 184 registration notes at the
repo worklog (the standing precedent: the registration notes land BEFORE
the spec's birth), then transplant the two s184 auditor entries from the
host worklog at their Task-ID anchors:

  [s184-id-stable-premises-note: ...]   (the 58th consecutive cycle)
  [s184-below-threshold-note: ...]      (the cycle's members)
  Task ID: 3-a / 3-b                    (the transplanted audit records)

Idempotent: skips if the anchor already present.
"""
from pathlib import Path

WORKLOG = Path("/home/z/my-project/digma/worklog.md")
HOST = Path("/home/z/my-project/worklog.md")

B_NOTE = (
    "[s184-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE FIFTY-EIGHTH CONSECUTIVE CYCLE, all four premises re-derived LIVE this cycle by auditor B, all four HOLDING: P1 the churn-consuming registrations value-based or honest-refusal at all twelve sites (editor-store markSaved :241-281 with the remap.get(id) ?? id + reuseStableElements + sameIdSequence mechanisms, addElements :354, updateElements :418, scaleElements :469, moveElements the VALUE-based moved flag :531-567, deleteElements :570, reorderElements :607, toggleVisibility :656, toggleLock :680; properties-panel patchDiffers guards :1372/:1741/:2202; layers-panel the honest-refusal retype posture — THE S134-B REGISTRATION TEXT AT :39 (the coordinate CORRECTED this cycle per B-I-2: the prior cycles' ':84' falls inside the S133-C row-click block :80-:97, a DIFFERENT honest-refusal member — the premise holds at BOTH sites, the F170 family's coordinate member applied); ai-assistant send-time targetIds :403 — the twelve sites CLIENT-LAYER, the elements route P3's site); P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack in the registered order (disposed :373, swap :381, elements-reference :382, background :399, gesture :409); P3 the replace-transaction seams at elements/route.ts:365-382 (deleteMany :366 + createMany :368 + project.update :370 + the inside-read findMany :378, one $transaction :365, timeout 30_000 :382; duplicate :113 the same 30s form); P4 the value-based perimeter (zero web-storage anywhere in src/ — rg localStorage|sessionStorage|indexedDB across src/ exit 1; the two censused members — fillImageBytes the maintained counter at POST-gate/PUT-recompute/duplicate-seed, backgroundColor the S33-3 same-transaction form). The judgment carried unchanged from the prior fifty-seven cycles: the structural rewrite's regression risk continues to outweigh its churn-optimality benefit at this stability level — nothing in this cycle's census (a 0C/0H/0M/2L/6I cycle whose two Lows are a one-guard OTP scoping and a token/interpolation paint family, zero store surface) grows a mutation-surface member that would promote it. The premises-pinning doctrine (F130, carried): a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred, and pin them so the re-derivation is mechanical.]"
)

BELOW_THRESHOLD_NOTE = (
    "[s184-below-threshold-note: THE THIRTEENTH-GENERATION COORDINATE "
    "VERIFIED + THE RENDERED-OUTPUT EVIDENCE REMEDIATION REGISTRATIONS + "
    "CONTINUITY REGISTRATIONS (the cycle's census A 0C/0H/0M/2L/3I + B "
    "0C/0H/0M/0L/3I combined 0C/0H/0M/2L/6I — the first Low-severity "
    "members since S181, surfaced by measurement depth under the SAME "
    "v1.1.0 vocabulary for the FOURTH consecutive cycle): THE FROZEN-"
    "RECORD COORDINATE THIRTEENTH GENERATION (the family's thirteenth "
    "instance, the SECOND verified under the corrected arithmetic — the "
    "F169 member's second verification): the S183 delivery's own two PAD "
    "insertions (the v1.162.0 Last-Updated chain line at :6 + the s183 "
    "§7.1 row at :2844) shifted the registered thirteenth-generation "
    "carriers +2 to :2845 (the Unit total) / :2904 (the checklist) / "
    ":2973 (the command row) — the carriers AND the window :2831..:2844 "
    "AND the s183 row at :2844 ALL EXACT as the s183-below-threshold-note "
    "pre-registered (verified live by the lead at the cycle's open AND "
    "auditor B independently — the same corrected arithmetic's second "
    "application, every figure exact, the off-by-one class NOT "
    "recurring). THE F171 LESSON — THE RENDERED-OUTPUT EVIDENCE MEMBER "
    "(the F168/F169/F170 record-truth family's next member): a posture "
    "claim about RENDERED output (an interpolation family, a shadow "
    "geometry) is verified against the REFERENCE'S RENDERED PIXELS — "
    "sampled from the standing reference-audit captures — never against "
    "the source classes' letter alone; the measurement that turned A-L-2 "
    "from a registerable cosmetic into an evidence-backed remediation "
    "(the 160th-audit capture's hero-banner midzone sampled 4x closer to "
    "sRGB than oklab: dist 101 vs 405 at the purple-to-pink midzone, the "
    "exact pink-600 hex at the via position — the reference renders the "
    "sRGB family while the clone's gradient utilities render oklab; the "
    "shadow-sm member the same evidence class: tailwindcss@4.3.3's own "
    "theme.css carries --shadow-sm byte-identical to --shadow, the v3 "
    "DEFAULT geometry — one notch heavier than the v3 sm the shadcn "
    "chrome was designed against). THE S184 REMEDIATION REGISTRATIONS: "
    "S184-A the OTP append-into-filled-cell guard (A-L-1 — the "
    "distribution branch scoped to index === 0, the one-time-code "
    "autofill target; the append path falls to slice(-1)); S184-B the "
    "rendered-output remediation (A-L-2 — the --shadow-sm v3-geometry "
    "pin + the brand-gradient family onto inline sRGB linear-gradient() "
    "styles per the skill's own trap-3 prescription, the teams chip's "
    "class hook preserved for the e2e query, the neutral washes staying "
    "on the utilities); S184-C the comment-truth repair (A-I-3 — the "
    "properties-panel stale single-pointer rationale annotated "
    "superseded; the zero-false direction breaking its eight-cycle "
    "streak on this member, repaired in-cycle); S184-D the doc-side "
    "registrations (B-I-1 the write-path unknown-error rethrow tail — "
    "the PAD deviation-ledger entry, the S130-C read-path deviation's "
    "write-path complement; B-I-3 the e2e write-set annotation — the "
    "five-handler no-e2e family named at the PAD's e2e row). THE "
    "STANDING POSTURES CARRIED: A-I-1 the plain-@theme letter (all-"
    "literal values, functionally equivalent, the in-file documented "
    "form); A-I-2 the bell-popover non-modal role=dialog letter; the "
    "S67-C shared auth: bucket; the validation.ts-with-substance ADR; "
    "the S130-C read-path no-envelope posture; the ELEVEN raw-fetch "
    "sites; the five-div stopPropagation family; the B183-era postures "
    "carried verbatim. THE FOURTEENTH GENERATION PRE-REGISTRATION — THE "
    "MEASURED FORM (the F169/F171 discipline: never a +2 forecast when "
    "the delivery's insertion count exceeds two): this cycle's delivery "
    "adds MORE than the two standard PAD insertions (the v1.163.0 chain "
    "line at :6 + the s184 §7.1 row + the deviation-ledger entry + the "
    "e2e-row annotation + the S184-B posture rows) — the fourteenth-"
    "generation carriers are therefore pre-registered AT THE MEASURED "
    "POST-COLLATERAL COORDINATES, the figures appended to this note "
    "after the collateral lands and BEFORE the delivery commit (the "
    "measured form, the s159 pin-form precedent at the registration "
    "layer). The same-vocabulary hold: the FOURTH consecutive cycle "
    "under skills/web-application/SKILL.md v1.1.0 (unchanged since the "
    "operator's 2026-10-23 revision); the honest environment record: "
    "the workspace RESET this cycle (a fresh clone, chromium-1248 "
    "provisioned before the e2e run, the exported-shell DATABASE_URL "
    "trap guarded by env -u on every DB-touching gate); the layer "
    "MOVING this cycle (14,313 -> the measured post-remediation figure "
    "— the first movement since S181, the F40 rider engaging, a "
    "deliberate remediation never drift); the route figure STAYING at "
    "2,461 (elements 420 — its ninth re-quote cycle); e2e stays 262; "
    "smoke stays 73; the pins S128..S184 = 749 + the spec's measured "
    "pins across 57 spec files.]"
)

text = WORKLOG.read_text()
if "s184-id-stable-premises-note" in text:
    raise SystemExit("s184 notes already landed — nothing to do")

anchor = "the s184 spec should pin the s183 plan's ticked record at this delivery commit — the F138 guard's thirty-fifth instance"
if anchor not in text:
    raise SystemExit("ANCHOR NOT FOUND — the s183 lead entry tail missing")

# --- transplant the two auditor entries from the host worklog ----------
host = HOST.read_text()

def extract_entry(task_id: str) -> str:
    at = host.index(f"Task ID: {task_id}")
    # back up to the '---' separator line above the entry
    sep = host.rfind("\n---\n", 0, at)
    entry = host[sep + len("\n---\n"):].split("\n---\n")[0]
    return entry.rstrip("\n")

auditor_a = extract_entry("3-a")
auditor_b = extract_entry("3-b")
if "0C / 0H / 0M / 2L / 3I" not in auditor_a and "0C/0H/0M/2L/3I" not in auditor_a:
    raise SystemExit("auditor A entry malformed — census line missing")
if "0C / 0H / 0M / 0L / 3I" not in auditor_b and "0C/0H/0M/0L/3I" not in auditor_b:
    raise SystemExit("auditor B entry malformed — census line missing")

addition = (
    "\n\n" + B_NOTE + "\n\n" + BELOW_THRESHOLD_NOTE + "\n\n---\n"
    + auditor_a + "\n\n---\n" + auditor_b + "\n"
)
WORKLOG.write_text(text.rstrip("\n") + "\n" + addition.lstrip("\n"))
lines = WORKLOG.read_text().count("\n") + 1
print(f"notes + auditor transplants landed: worklog now {lines} lines")
