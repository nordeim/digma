#!/usr/bin/env python3
"""worklog-notes-s185.py — land the Session 185 registration notes at the
repo worklog (the standing precedent: the registration notes land BEFORE
the spec's birth), then transplant the two s185 auditor entries from the
host worklog at their Task-ID anchors:

  [s185-id-stable-premises-note: ...]   (the 59th consecutive cycle)
  [s185-below-threshold-note: ...]      (the cycle's members)
  Task ID: digma-s185-3-a / digma-s185-3-b  (the transplanted audit records)

Idempotent: skips if the anchor already present.
"""
from pathlib import Path

WORKLOG = Path("/home/z/my-project/digma/worklog.md")
HOST = Path("/home/z/my-project/worklog.md")

B_NOTE = (
    "[s185-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE FIFTY-NINTH CONSECUTIVE CYCLE, all four premises re-derived LIVE this cycle by auditor B, all four HOLDING: P1 the churn-consuming registrations value-based or honest-refusal at all twelve sites (editor-store markSaved :241-281 with the remap.get(id) ?? id + reuseStableElements + sameIdSequence mechanisms, addElements :354, updateElements :418, scaleElements :469, moveElements the VALUE-based moved flag :531-567, deleteElements :570, reorderElements :607, toggleVisibility :656, toggleLock :680; properties-panel patchDiffers guards :1372/:1741/:2202; layers-panel the honest-refusal retype posture — the S134-B registration text at :39 (the coordinate corrected at S184 per its B-I-2); ai-assistant SEND-TIME targetIds :589 — THE COORDINATE CORRECTED THIS CYCLE per the S185 B-I-1 finding: the prior cycles' dispatch label ':403' names the APPLY-TIME patchWouldChange value compare (:401-:403, truthRows.some((el) => targetSet.has(el.id) && patchDiffers(el, patch))), while the send-time capture is targetIds: state.selectedIds at :589 inside the JSON.stringify body, its A134-I2 churn registration at :573-:583 — the premise holds at BOTH sites, the F170 family's coordinate member, the SECOND consecutive cycle carrying a coordinate correction) — the twelve sites CLIENT-LAYER, the elements route P3's site; P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack in the registered order (disposed :373, swap :381, elements-reference :382, background :399, gesture :409); P3 the replace-transaction seams at elements/route.ts:365-382 (deleteMany :366 + createMany :368 + project.update :370 + the inside-read findMany :378, one $transaction :365, timeout 30_000 :382; duplicate :113 the same 30s form); P4 the value-based perimeter (zero web-storage anywhere in src/ — rg localStorage|sessionStorage|indexedDB across src/ exit 1; the two censused members — fillImageBytes the maintained counter at POST-gate/PUT-recompute/duplicate-seed, backgroundColor the S33-3 same-transaction form). The judgment carried unchanged from the prior fifty-eight cycles: the structural rewrite's regression risk continues to outweigh its churn-optimality benefit at this stability level — nothing in this cycle's census (a 0C/0H/0M/1L/7I cycle whose one Low is a comment-text repair with zero runtime surface) grows a mutation-surface member that would promote it. The premises-pinning doctrine (F130, carried): a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred, and pin them so the re-derivation is mechanical.]"
)

BELOW_THRESHOLD_NOTE = (
    "[s185-below-threshold-note: THE FOURTEENTH-GENERATION COORDINATE "
    "VERIFIED + THE RECEIPT-COUNT TRUTH LESSON + CONTINUITY REGISTRATIONS "
    "(the cycle's census A 0C/0H/0M/1L/4I + B 0C/0H/0M/0L/3I combined "
    "0C/0H/0M/1L/7I — the second consecutive cycle with Low-severity "
    "members, again surfaced by measurement depth under the SAME v1.1.0 "
    "vocabulary for the FIFTH consecutive cycle): THE FROZEN-RECORD "
    "COORDINATE FOURTEENTH GENERATION (the family's fourteenth instance, "
    "the THIRD verified under the corrected arithmetic — the F169 "
    "member's third verification): the S184 delivery's own two PAD "
    "insertions (the v1.163.0 Last-Updated chain line at :6 + the s184 "
    "§7.1 row at :2846 — the registrations riding prose, not rows) "
    "shifted the registered fourteenth-generation carriers +2 to :2847 "
    "(the Unit total) / :2906 (the checklist) / :2975 (the command row) "
    "— the carriers AND the s184 row at :2846 ALL EXACT as the "
    "s184-below-threshold-note's appended post-collateral figures "
    "pre-registered (verified live by the lead at the cycle's open AND "
    "auditor B independently — the corrected arithmetic's third "
    "application, every carrier figure exact). THE B-I-2 WINDOW-"
    "COMPOSITION CORRECTION (registered this cycle): the registered "
    "window ':2831..:2846 (15 consecutive spec rows s170..s184)' "
    "internally disagrees by one row — the live window :2831..:2846 "
    "spans SIXTEEN consecutive §7.1 rows s169..s184, the s170 row "
    "sitting at :2832 (the v1.163.0 chain-line insertion at :6 shifted "
    "the family +1, which the window's lower-bound figure did not "
    "absorb; :2831 is the s169 row); the corrected composition for the "
    "s170..s184 family is :2832..:2846 — all four carrier coordinates "
    "unaffected (the composition member a window-edge figure, never a "
    "carrier). THE F172 LESSON — THE RECEIPT-COUNT TRUTH MEMBER (the "
    "F168/F169/F170/F171 record-truth family's next member, at the "
    "receipt-comment layer): a count claim embedded in a remediation's "
    "own receipt comment is itself a claim about the tree — derived by "
    "the same comment-excluding class-site enumeration the auditors "
    "apply, never a raw grep (the raw count includes the comment "
    "mentions and the token declaration itself: the S184-B receipt's "
    "'23 shadow-sm sites' was born stale the same cycle it was written "
    "— the raw grep returned 26 occurrences, the comment-inclusive "
    "src-minus-globals form 23, the honest class-site count 21 (the 2 "
    "comment mentions at ui/select.tsx:12 and layers-panel.tsx:294 "
    "excluded); the F78/S101-B count-falsified-by-grep class surfacing "
    "at the receipt layer — the fix's own documentation a fresh audit "
    "surface every cycle). THE S185 REMEDIATION REGISTRATIONS: S185-A "
    "the count-truth repair (A-L-1 — the receipt comment corrected to "
    "the honest 21 class sites, the comment-excluding enumeration form; "
    "comment-text only, zero line movement, the layer total STAYING at "
    "14,359 — the first zero-movement cycle since S182). THE STANDING "
    "POSTURES CARRIED: A-I-1 the OTP index-0 append-into-filled-cell "
    "residual (S184-A's documented tradeoff — the distribution branch "
    "fires for a manual append into a filled FIRST cell; omitting "
    "maxLength={1} load-bearing for the one-time-code autofill); A-I-2 "
    "the four external Unsplash template-preview URLs (the documented "
    "reference-parity decision); A-I-3 the components-panel New "
    "component no-op (the documented PAD §10 scope cut — the "
    "reference's own + is a no-op); A-I-4 the four stopPropagation-only "
    "div wrappers (the S31-3 seam); B-I-3 the e2e write-set numeric "
    "closure (the S184-D registration re-confirmed); the S67-C shared "
    "auth: bucket; the validation.ts-with-substance ADR; the S130-C "
    "read-path no-envelope posture and its S184-D write-path twin; the "
    "ELEVEN raw-fetch sites; the B183-era postures carried verbatim. "
    "THE FIFTEENTH GENERATION PRE-REGISTRATION — THE MEASURED FORM "
    "(the F169/F171 discipline carried): this cycle's delivery carries "
    "the standard two PAD insertions (the v1.164.0 chain line at :6 + "
    "the s185 §7.1 row) — the fifteenth-generation carriers are "
    "therefore expected at the +2 form (:2849/:2908/:2977, the s185 "
    "row at :2848, the corrected s170..s185 family at :2833..:2848 "
    "with :2832 the s169 row) BUT the figures are appended to this "
    "note at the MEASURED post-collateral coordinates after the "
    "collateral lands and BEFORE the delivery commit (the measured "
    "form governs — never a forecast when the insertion count is in "
    "any doubt). The same-vocabulary hold: the FIFTH consecutive "
    "cycle under skills/web-application/SKILL.md v1.1.0 (unchanged "
    "since the operator's 2026-10-23 revision); the honest environment "
    "record: the workspace RESET this cycle (a fresh clone, "
    "chromium-1248 provisioned before the e2e run, the exported-shell "
    "DATABASE_URL trap guarded by env -u on every DB-touching gate); "
    "the layer STAYING at 14,359 (the first zero-movement cycle since "
    "S182 — the comment-text repair painting no lines); the route "
    "figure STAYING at 2,461 (elements 420 — its tenth re-quote "
    "cycle); e2e stays 262; smoke stays 73; the pins S128..S184 = "
    "766 across 57 spec files entering, the s185 spec joining as the "
    "58th.]"
)

text = WORKLOG.read_text()
if "[s185-below-threshold-note:" in text:
    raise SystemExit("s185 notes already landed")

# the anchor: the tail of the s184 lead entry (the last entry in the
# repo worklog before this cycle's additions)
anchor = "The gates: unit 2562/2562 across 246 · e2e 262/262 · nav 9/9 (the 161st session) · the 160th reference audit NO DRIFT (the clip byte-identical the 121st session) · pins 766/766 · capture 86 (80 fresh — the honest pixel-painting receipt) · dimensions 1009/1009 · F138 35th passed · the premises 58th cycle"
if anchor not in text:
    raise SystemExit("ANCHOR NOT FOUND — the s184 lead entry tail missing")

# --- transplant the two auditor entries from the host worklog ----------
host = HOST.read_text()

def extract_entry(task_id: str) -> str:
    at = host.index(f"Task ID: {task_id}")
    # back up to the '---' separator line above the entry
    sep = host.rfind("\n---\n", 0, at)
    entry = host[sep + len("\n---\n"):].split("\n---\n")[0]
    return entry.rstrip("\n")

auditor_a = extract_entry("digma-s185-3-a")
auditor_b = extract_entry("digma-s185-3-b")
if "0C/0H/0M/1L/4I" not in auditor_a and "0C / 0H / 0M / 1L / 4I" not in auditor_a:
    raise SystemExit("auditor A entry malformed — census line missing")
if "0C/0H/0M/0L/3I" not in auditor_b and "0C / 0H / 0M / 0L / 3I" not in auditor_b:
    raise SystemExit("auditor B entry malformed — census line missing")

addition = (
    "\n\n" + B_NOTE + "\n\n" + BELOW_THRESHOLD_NOTE + "\n\n---\n"
    + auditor_a + "\n\n---\n" + auditor_b + "\n"
)
WORKLOG.write_text(text.rstrip("\n") + "\n" + addition.lstrip("\n"))
lines = WORKLOG.read_text().count("\n") + 1
print(f"notes + auditor transplants landed: worklog now {lines} lines")
