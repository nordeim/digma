#!/usr/bin/env python3
"""worklog-notes-s172.py — land the Session 172 auditors' block at the
repo worklog (the standing precedent: the registration notes land BEFORE
the spec's birth). Appends:

  --- 
  Task ID: digma-s172-audit-B   (auditor B's entry, the premises note riding inside)
  Task ID: digma-s172-audit-A   (auditor A's entry, the below-threshold note riding inside)
  ---

Idempotent: skips if the anchor already present.
"""
from pathlib import Path

WORKLOG = Path("/home/z/my-project/digma/worklog.md")
B_ENTRY = Path("/home/z/my-project/auditor-B-entry-s172.md")
A_ENTRY = Path("/home/z/my-project/auditor-A-entry-s172.md")

B_NOTE = (
    "[s172-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE FORTY-SIXTH CONSECUTIVE CYCLE, all four premises re-derived LIVE this cycle by auditor B, all four HOLDING: P1 the churn-consuming registrations value-based or honest-refusal at all twelve sites (editor-store markSaved/addElements/updateElements/scaleElements/moveElements/deleteElements/reorderElements/toggleVisibility/toggleLock; properties-panel fillKey :1858; layers-panel rename; ai-assistant send-time targetIds); P2 the index-stable remap at editor-view.tsx:413-419 behind the five-guard stack (disposed :373, swap :381, elements-reference :382, background :399, gesture :409); P3 the replace-transaction seams at elements/route.ts:365-382 (deleteMany + createMany + project.update + the inside-read findMany, one $transaction, timeout 30_000); P4 the value-based perimeter (zero localStorage/sessionStorage/indexedDB anywhere in src/). The judgment carried unchanged from the prior forty-five cycles: the structural rewrite's regression risk continues to outweigh its churn-optimality benefit at this stability level — nothing in this cycle's census (a ZERO-SOURCE-FINDING all-Informational cycle — the FIFTH consecutive STAYS cycle, the layer total STAYING 14,307, the route figure STAYING 2,450, every actionable member living on the doc/directive surface) grows a mutation-surface member that would promote it. The premises-pinning doctrine (F130, carried): a deferral decision's premises are live claims — re-derive them every cycle the item stays deferred, and pin them so the re-derivation is mechanical.]"
)

BELOW_THRESHOLD_NOTE = (
    "[s172-below-threshold-note: THE BELOW-THRESHOLD + DIRECTIVE-SIDE REGISTRATIONS "
    "(A172-I-1 + A172-I-2 + A172-I-3 auditor A's trio; B172-I-2 the directive-side "
    "member — all Informational, Verified; the deferral family's standing "
    "re-verification): the five S168-registered below-threshold observations "
    "recomputed live at the 120th cycle by auditor A, all five still "
    "accurately described, still below-threshold, correctly located — "
    "(a) the Insert handler's inline four-draw-type membership at "
    "editor-view.tsx:982-985; (b) the no-op-guards counting-unit nuance at "
    "editor-store.ts:758-762 (thirteen literal return-{} statement sites "
    "live under the registered statement unit); (c) the gradient-stop "
    "same-reference posture at editor.ts:986; (d) the no-op dismiss timers "
    "at use-toast.ts:59-61; (e) the mobile crossing-close family (the lg "
    "pair at editor-view.tsx:1403/:1530, the md member at app-header.tsx:67) "
    "— plus the components-panel no-op with its PAD §10 scope cut — carried "
    "per the standing plans. THE DIRECTIVE-SIDE MEMBER (the F157/A171-I-1 "
    "class, in the audit directive itself, never in any source or frozen "
    "record): B172-I-2 — the s172 dispatch directive's item-4 phrasing '19 "
    "spec-exercised write-carrying handlers' conflates two distinct "
    "censuses: the frozen record's coherent form is '19 of the 25 exported "
    "handlers exercised by the specs' own calls', of which only 13 are "
    "write-carrying (forgot/resend/reset/register/login/verify-otp, "
    "projects POST/PATCH/DELETE, elements PUT, teams POST/DELETE, "
    "ai-assistant); the separate write-carrying census is 17 handlers "
    "(16 Prisma-write surfaces + the SDK-only ai-assistant) = 13 "
    "spec-exercised + 4 of the 5 zero-e2e; the underlying arithmetic "
    "19+1+5=25 is true; only the directive's 'write-carrying' qualifier is "
    "a mislabel. Next-generation correction: '19 spec-exercised (13 "
    "write-carrying)' or drop the qualifier. THE A-TRIO (registration "
    "continuity + positive confirmations): A172-I-1 the five below-threshold "
    "observations re-verified (the standing family); A172-I-2 the "
    "components-panel no-op's PAD §10 scope cut (the standing parity "
    "posture); A172-I-3 the A171-I-1 next-generation directive correction "
    "LANDED AND VERIFIED (this cycle's directive names all 22 files "
    "explicitly with per-file counts, the set closing at exactly 22 files / "
    "14,307 lines; the A171-I-2 toaster.tsx naming point moot — no radix "
    "file list carried). THE PRE-EXISTING FAMILY carried with their "
    "postures per the s171-below-threshold-note (the B171-I1..I4 members — "
    "I1 re-worded by S171-A onto the ^1.x/^2.x form, I2 re-worded onto the "
    "both-units form, I3 closed by the S171-A env-table completion, I4 the "
    "bun.lock workspace name never hand-edited) + the s167-401-terminal, "
    "s168/s169/s170/s171 below-threshold families carried per the standing "
    "plans. REGISTERED, not promoted.]"
)

text = WORKLOG.read_text()
if "Task ID: digma-s172-audit-B" in text:
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
print("landed: the s172 auditors' block (B entry + premises note + A entry + below-threshold note)")
