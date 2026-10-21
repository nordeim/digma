#!/usr/bin/env python3
"""worklog-notes-s169.py — land the Session 169 auditors' block at the
repo worklog (the standing precedent: the registration notes land BEFORE
the spec's birth). Appends:

  --- 
  Task ID: digma-s169-audit-B   (auditor B's entry, the premises note riding inside)
  Task ID: digma-s169-audit-A   (auditor A's entry, the below-threshold note riding inside)
  ---

Idempotent: skips if the anchor already present.
"""
from pathlib import Path

WORKLOG = Path("/home/z/my-project/digma/worklog.md")
B_ENTRY = Path("/home/z/my-project/auditor-B-entry-s169.md")
A_ENTRY = Path("/home/z/my-project/auditor-A-entry-s169.md")
B_NOTE = Path("/home/z/my-project/auditor-B-note-s169.md")

BELOW_THRESHOLD_NOTE = (
    "[s169-below-threshold-note: THE FIVE S168 BELOW-THRESHOLD OBSERVATIONS "
    "RE-VERIFIED + THE COMPONENTS-PANEL NO-OP (A169-I-1 + A169-I-3, both "
    "Informational, Verified — lead-verified live at their seams; the "
    "below-threshold deferral family's standing re-verification + the "
    "documented-scope-cut class): the five S168-registered below-threshold "
    "observations recomputed live at the 117th cycle, all five still "
    "accurately described, still below-threshold, correctly located — "
    "(a) the Insert handler's inline four-draw-type membership at "
    "editor-view.tsx:982-985 (TOOL_TO_TYPE stays module-local in "
    "canvas.tsx:48-53; a cross-module export for a four-member check buys "
    "nothing); (b) the no-op-guards counting-unit nuance at "
    "editor-store.ts:758-762 (the guards hold under the family-descendant "
    "counting unit — eleven other guards plus undo/redo — while a raw grep "
    "counts more return-{} arms; the counting unit is the registered form); "
    "(c) the gradient-stop same-reference posture at editor.ts:986 (the "
    "8-stop cap returns the SAME array reference and the properties-panel "
    "patchDiffers no-op bail rides reference identity — coherent by "
    "construction); (d) the no-op dismiss timers at use-toast.ts:59-61 (the "
    "5s setTimeout not cleared by dismiss; the late callback is an "
    "idempotent id-filter bounded by the slice(-5) cap); (e) the mobile "
    "crossing-close family with its S167-corrected location precision (the "
    "lg-crossing PAIR at editor-view.tsx:1403/:1530, both matchMedia("
    "\"(min-width: 1024px)\"); app-header.tsx:67 carrying ONLY the "
    "md-crossing member at 768px). REGISTERED, not promoted — the deferral "
    "postures carried per the standing plans. PLUS A169-I-3: "
    "components-panel.tsx:23-30's aria-label=\"New component\" button "
    "carries no onClick — the reference's own + control is a no-op "
    "(measured) and component authoring is a documented scope cut (PAD "
    "§10), declared in the file's own docblock; surfaced for the record "
    "only, registered as the standing parity posture.]"
)

text = WORKLOG.read_text()
if "Task ID: digma-s169-audit-B" in text:
    print("already landed — skip (idempotent)")
    raise SystemExit(0)

b_entry = B_ENTRY.read_text().strip()
a_entry = A_ENTRY.read_text().strip()
b_note = B_NOTE.read_text().strip()

block = (
    "\n---\n\n"
    + b_entry
    + "\n\n"
    + b_note
    + "\n\n"
    + a_entry
    + "\n\n"
    + BELOW_THRESHOLD_NOTE
    + "\n---\n"
)

WORKLOG.write_text(text.rstrip("\n") + "\n" + block)
print("landed: the s169 auditors' block (B entry + premises note + A entry + below-threshold note)")
