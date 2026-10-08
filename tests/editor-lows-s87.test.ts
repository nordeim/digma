import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { clampPositionField, clampSizeField } from "../src/lib/editor";

// The session-87 editor low batch (S87-A + S87-B + S87-C — the
// thirty-fifth audit's A87-M1 + A87-L1 + A87-L2).
//
// S87-A — THE DEFECT (A87-M1, the headline): the machine-carries skip
// branch records NO leave transport. When the user exits while the
// autosave machine's PUT₁ is in flight with NO newer edit
// (machineCarriesThisState true — the exit-inside-the-save-window
// interleaving), the cleanup correctly skips its duplicate PUT₂ but also
// leaves leaveTransportFor null (only the !machineCarriesThisState
// branch registers). A same-project re-entry mount drains the null
// registry, awaits nothing, and fires its GET — which can answer BEFORE
// PUT₁ lands (a large board's full-list replace takes seconds):
// loadProject then replaces the store's still-correct element list with
// the pre-edit server state and stamps it "saved"; the machine's
// response is disposed-gated so the healing markSaved never lands — the
// pre-exit edit silently reverted, and the next local edit's full-list
// PUT permanently deletes it server-side. This is the S85-A GET/PUT race
// surviving in the one branch the registry never covered.
//
// THE FIX: the skip branch registers the machine's own surviving flight
// as the transport — leaveTransportFor = { projectId: state.projectId,
// done: softLeaveDescriptor.flightDone } — the registry's done already
// accepts a bare promise, and the one-shot drain now covers the fourth
// and last interleaving.
//
// S87-B — THE DEFECT (A87-L1): the draw commit, the resize write-back,
// and moveElements' accumulated position are the last unclamped
// consumers of the server's ±100000 / 0..100000 bounds — an element
// dragged (or drawn after panning) past ±100000 canvas units renders
// locally, then visibly TELEPORTS to the clamped bound ~1s later on the
// store-replacing save (the S84-B/S86-B teleport family's canvas
// members).
//
// S87-C — THE DEFECT (A87-L2): a parseable-but-clamped draft never
// resyncs when the clamp maps it back to the field's current value —
// type 500000 into an X field already at 100000 and the field displays
// 500000 indefinitely while model/canvas/server hold 100000 (the S78-C
// "a control that lies about its state" class; the S79-E HexColorRow
// blur-restore's numeric sibling).

const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);

const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);

// ---------------------------------------------------------------------------
// S87-A — the skip-branch transport registration (A87-M1, the headline)
// ---------------------------------------------------------------------------

describe("the skip-branch transport registration (S87-A / A87-M1)", () => {
  it("SOURCE — the machine-carries skip branch registers the machine's own flight as the transport", () => {
    // THE DEFECT PIN: pre-fix the skip branch registers nothing —
    // only the reference-mismatch branch registers. The machine's
    // surviving flight IS the transport for the pure-duplicate exit: a
    // same-project re-entry mount must await PUT₁ before its GET.
    // Session 99 (S99-C): the registration rides the ONE seam
    // (registerLeaveTransport — the keyed Map).
    expect(editorViewSource).toMatch(
      /\} else \{\s*\/\/ Session 87 \(S87-A \/ A87-M1\)[\s\S]{0,1600}?registerLeaveTransport\(state\.projectId, softLeaveDescriptor\.flightDone\);/
    );
  });

  it("SOURCE — the skip-branch registration names the S85-A race it closes (the GET-before-PUT₁ window)", () => {
    // The comment must carry the doctrine: the mount's GET can answer
    // before the machine's surviving PUT lands — the registry's keyed
    // drain covers this fourth interleaving (S99-C: the "and last"
    // claim retired — the X→Y→X fifth interleaving taught otherwise).
    expect(editorViewSource).toMatch(/can answer BEFORE PUT₁|can answer before PUT₁/i);
    expect(editorViewSource).toMatch(/fourth interleaving|fourth and last interleaving|last uncovered interleaving/i);
  });

  it("SOURCE — the registration sits INSIDE the machineCarriesThisState skip (not the mismatch branch)", () => {
    // The structure: the if (!machineCarriesThisState) { …mismatch
    // chain… } is followed by the else { …bare-promise registration… } —
    // the two registrations are mutually exclusive, one transport per
    // leave. Session 99 (S99-C): the anchors ride the seam call forms.
    const mismatchIdx = editorViewSource.indexOf("registerLeaveTransport(");
    const elseIdx = editorViewSource.indexOf("} else {", mismatchIdx);
    const regIdx = editorViewSource.indexOf("registerLeaveTransport(state.projectId, softLeaveDescriptor.flightDone)", mismatchIdx);
    expect(mismatchIdx).toBeGreaterThan(-1);
    expect(elseIdx).toBeGreaterThan(mismatchIdx);
    expect(regIdx).toBeGreaterThan(elseIdx);
    // And the registration is close behind the else (same block, not a
    // distant coincidence).
    expect(regIdx - elseIdx).toBeLessThan(1700);
  });
});

// ---------------------------------------------------------------------------
// S87-B — the canvas gesture clamp family (A87-L1)
// ---------------------------------------------------------------------------

describe("the canvas gesture clamps at the last unbounded consumers (S87-B / A87-L1)", () => {
  it("BEHAVIORAL — clampPositionField holds the drag-accumulation boundary (the ±100000 contract)", () => {
    // THE DEFECT PIN: pre-fix moveElements commits el.x + dx raw — an
    // accumulated drag past ±100000 (reachable in ~5-10 max-zoom-out
    // drags: 2000 screen px at zoom 0.1 = 20000 units each) renders
    // locally then teleports on the store-replacing save.
    expect(clampPositionField(50000 + 60000)).toBe(100000);
    expect(clampPositionField(-50000 - 60000)).toBe(-100000);
    expect(clampPositionField(100000)).toBe(100000);
    expect(clampPositionField(-100000)).toBe(-100000);
    expect(clampPositionField(0)).toBe(0);
    // The interior stays interior (no false clamping).
    expect(clampPositionField(4200)).toBe(4200);
  });

  it("BEHAVIORAL — clampSizeField holds the draw/resize boundary (the type-aware floor + the 100000 ceiling)", () => {
    expect(clampSizeField(120000, "rectangle")).toBe(100000);
    expect(clampSizeField(120000, "line")).toBe(100000);
    expect(clampSizeField(0.5, "rectangle")).toBe(1);
    expect(clampSizeField(0.5, "line")).toBe(0.5);
    expect(clampSizeField(88, "rectangle")).toBe(88);
  });

  it("SOURCE — moveElements clamps the accumulated position on both products", () => {
    // THE DEFECT PIN: pre-fix the products ride `el.x + dx` / `el.y + dy`
    // raw. The S84-B helper (mirroring the server's
    // clampNumber(raw?.x, -100000, 100000, …) bound) joins the
    // accumulated path.
    expect(storeSource).toMatch(/x: clampPositionField\(el\.x \+ dx\)/);
    expect(storeSource).toMatch(/y: clampPositionField\(el\.y \+ dy\)/);
    // The bare accumulated forms are gone.
    expect(storeSource).not.toMatch(/x: el\.x \+ dx,/);
    expect(storeSource).not.toMatch(/y: el\.y \+ dy,/);
  });

  it("SOURCE — the draw commit clamps x/y and the size products", () => {
    // THE DEFECT PIN: pre-fix the draw commit passes drag.x / drag.y /
    // drag.w / drag.h raw into addElement.
    expect(canvasSource).toMatch(
      /store\.addElement\(\{\s*type: drag\.type,\s*x: clampPositionField\(drag\.x\),\s*y: clampPositionField\(drag\.y\),/
    );
    expect(canvasSource).toMatch(
      /width: drag\.type === "line" \? clampSizeField\(drag\.w, "line"\) : clampSizeField\(Math\.max\(drag\.w, 1\), drag\.type\),/
    );
    expect(canvasSource).toMatch(
      /height: drag\.type === "line" \? clampSizeField\(drag\.h, "line"\) : clampSizeField\(Math\.max\(drag\.h, 1\), drag\.type\),/
    );
  });

  it("SOURCE — the resize write-back clamps the full geometry patch", () => {
    // THE DEFECT PIN: pre-fix the write-back passes x / y raw and the
    // type-aware floor form on width/height (no ceiling).
    expect(canvasSource).toMatch(
      /store\.updateElements\(\s*\[el\.id\],\s*\{\s*x: clampPositionField\(x\),\s*y: clampPositionField\(y\),\s*width: clampSizeField\(Math\.max\(w \/ s, el\.type === "line" \? 0 : 1\), el\.type\),\s*height: clampSizeField\(Math\.max\(h \/ s, el\.type === "line" \? 0 : 1\), el\.type\),\s*\},\s*false,\s*\);/
    );
  });

  it("SOURCE — the canvas imports the clamp helpers from the editor lib", () => {
    expect(canvasSource).toMatch(
      /import \{[\s\S]{0,400}?clampPositionField,[\s\S]{0,400}?clampSizeField,[\s\S]{0,400}?\} from "@\/lib\/editor";/
    );
  });
});

// ---------------------------------------------------------------------------
// S87-C — the number-field draft resync (A87-L2)
// ---------------------------------------------------------------------------

describe("the number-field blur resyncs a clamped-back draft (S87-C / A87-L2)", () => {
  it("SOURCE — NumberField's blur resyncs whenever the committed value differs from the draft", () => {
    // THE DEFECT PIN: pre-fix the blur restores the draft only for
    // empty/unparseable edits — a parseable draft whose consumer clamp
    // mapped it back to the CURRENT value (500000 typed into a field
    // already at 100000) never resyncs: the field lies about the
    // committed state indefinitely. The extended form: any parseable
    // draft whose committed value differs resyncs from the model.
    expect(panelSource).toMatch(
      /if \(draft\.trim\(\) === "" \|\| !Number\.isFinite\(parsed\)\) setDraft\(display\);[\s\S]{0,600}?else if \(parsed !== value\) \{[\s\S]{0,400}?setDraft\(display\);/
    );
  });

  it("SOURCE — GuardedNumberInput's blur carries the same extended resync", () => {
    // The inline form (Rotation/Opacity/gradient stops) shares the
    // NumberField contract — the S78-C "a control that lies" class
    // closes on BOTH components.
    const guardedBlurMatches = panelSource.match(
      /onBlur=\{\(\) => \{[\s\S]{0,900}?if \(draft\.trim\(\) === "" \|\| !Number\.isFinite\(parsed\)\) setDraft\(display\);[\s\S]{0,600}?else if \(parsed !== value\) \{[\s\S]{0,400}?setDraft\(display\);/g,
    );
    expect(guardedBlurMatches).not.toBeNull();
    expect(guardedBlurMatches!.length).toBeGreaterThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// The survival family — the sibling contracts must ride through unchanged
// ---------------------------------------------------------------------------

describe("the S87 survival family (the sibling contracts unchanged)", () => {
  it("SURVIVAL — the S86-A ordering chain rides through unchanged (the mismatch branch's machineFlight form)", () => {
    expect(editorViewSource).toMatch(
      /const machineFlight =\s*softLeaveDescriptor !== null && softLeaveDescriptor\.projectId === state\.projectId\s*\? softLeaveDescriptor\.flightDone\s*: Promise\.resolve\(\);/
    );
    // Session 99 (S99-C): the chain rides the registerLeaveTransport
    // seam now — the ordering intent (PUT₂ strictly after PUT₁)
    // unchanged.
    expect(editorViewSource).toMatch(
      /registerLeaveTransport\(\s*state\.projectId,\s*machineFlight\s*\.then\(\(\) =>\s*fetch\(/m
    );
  });

  it("SURVIVAL — the machineCarriesThisState expression survives byte-identically (the skip's identity test)", () => {
    expect(editorViewSource).toMatch(
      /const machineCarriesThisState =\s*softLeaveDescriptor !== null &&\s*softLeaveDescriptor\.projectId === state\.projectId &&\s*softLeaveDescriptor\.elements === state\.elements &&\s*softLeaveDescriptor\.backgroundColor === state\.backgroundColor;/
    );
  });

  it("SURVIVAL — the S85-A drain site survives (the same-project await, S99-C's keyed form)", () => {
    expect(editorViewSource).toMatch(
      /const transport = leaveTransports\.get\(projectId\);\s*if \(transport\) \{\s*leaveTransports\.delete\(projectId\);\s*await transport;/
    );
  });

  it("SURVIVAL — scaleElements' clampSizeField products ride through unchanged (S86-B)", () => {
    expect(storeSource).toMatch(/width: clampSizeField\(el\.width \* factor, el\.type\)/);
    expect(storeSource).toMatch(/height: clampSizeField\(el\.height \* factor, el\.type\)/);
  });

  it("SURVIVAL — the draw-commit cap contract rides through (the ELEMENT_LIMIT toast form)", () => {
    expect(canvasSource).toMatch(/Element limit reached/);
    expect(canvasSource).toMatch(/Boards hold at most \$\{ELEMENT_LIMIT\} elements\./);
  });
});
