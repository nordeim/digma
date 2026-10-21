#!/usr/bin/env python3
"""Land the s168 bracketed registration note in the repo worklog BEFORE the
spec's birth (the standing precedent). The s168-id-stable-premises-note was
already landed by auditor B at the worklog tail; this lands the cycle's own
below-threshold registration (A168-I-1 + A168-I-2).

Run from the repo root:  python3 scripts/worklog-notes-s168.py
"""
from pathlib import Path

WORKLOG = Path("/home/z/my-project/digma/worklog.md")

note = """
[s168-below-threshold-note: THE FIVE S167 BELOW-THRESHOLD OBSERVATIONS RE-VERIFIED + THE COMPONENTS-PANEL NO-OP (A168-I-1 + A168-I-2, both Informational, Verified — lead-verified live at their seams; the below-threshold deferral family's standing re-verification + the documented-scope-cut class): the five S167-registered below-threshold observations recomputed live at the 116th cycle, all five still accurately described, still below-threshold, correctly located — (a) the Insert handler's inline four-draw-type membership at editor-view.tsx:982-985 (TOOL_TO_TYPE stays module-local in canvas.tsx:48-53; a cross-module export for a four-member check buys nothing); (b) the no-op-guards counting-unit nuance at editor-store.ts:758-762 (the guards hold under the family-descendant counting unit — eleven other guards plus undo/redo — while a raw grep counts more return-{} arms; the counting unit is the registered form); (c) the gradient-stop same-reference posture at editor.ts:986 (the 8-stop cap returns the SAME array reference and the properties-panel patchDiffers no-op bail rides reference identity — coherent by construction); (d) the no-op dismiss timers at use-toast.ts:59-61 (the 5s setTimeout not cleared by dismiss; the late callback is an idempotent id-filter bounded by the slice(-5) cap); (e) the mobile crossing-close family with its S167-corrected location precision (the lg-crossing PAIR at editor-view.tsx:1403/:1530, both matchMedia("(min-width: 1024px)"); app-header.tsx:67 carrying ONLY the md-crossing member at 768px). REGISTERED, not promoted — the deferral postures carried per the standing plans. PLUS A168-I-2: components-panel.tsx:23-30's aria-label="New component" button carries no onClick — the reference's own + control is a no-op (measured) and component authoring is a documented scope cut (PAD §10), declared in the file's own docblock; surfaced for the record only, registered as the standing parity posture.]
"""

text = WORKLOG.read_text()
if "[s168-below-threshold-note:" in text:
    raise SystemExit("the s168 note already present")
if not text.endswith("\n"):
    text += "\n"
text += note
WORKLOG.write_text(text)
print("worklog.md: the s168 bracketed registration note appended "
      "(s168-below-threshold-note — joining auditor B's landed "
      "s168-id-stable-premises-note)")
