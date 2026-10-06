import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { clampText } from "../src/lib/validation";
import { clampSizeField } from "../src/lib/editor";

// The session-86 editor low batch (S86-A + S86-B — the thirty-fourth
// audit's A86-L3 + A86-L1 + A86-L2).
//
// S86-A — THE DEFECT (A86-L3, the headline): the S71-B reference-mismatch
// double-PUT could complete OUT OF ORDER. When an edit lands between the
// autosave machine's capture and the unmount, the cleanup fires PUT₂ (the
// NEWER state) while the machine's PUT₁ (the OLDER state) is still in
// flight — and HTTP does not guarantee the landing order of two parallel
// same-project full-replace PUTs. If PUT₁ lands last the server silently
// regresses to the pre-edit state; the sharpest edge is the re-entry: the
// S85-A registry awaited only PUT₂, so the mount's GET could read PUT₁'s
// regressed result (the fresh-load fix loading the STALE state). The
// machine's own pending re-run (+800ms) usually repairs the regression,
// but the window exists and the registry's drain half didn't cover it.
//
// THE FIX: the machine's in-flight descriptor (inFlightRef) gains a
// flightDone promise handle resolved in the flush's finally; the cleanup's
// reference-mismatch branch chains its PUT₂ STRICTLY AFTER the machine's
// PUT₁, and the leaveTransportFor registry's done carries the whole
// sequence — the server sees the older PUT land first, the newer last, and
// a same-project re-entry mount awaits BOTH legs before its GET.
//
// S86-B — THE DEFECTS (A86-L1 + A86-L2): the AI apply seam committed
// element text RAW (the add path's partial.text and the update path's
// patch.text — the fallback's quoted content and the sanitizer's slice
// never TRIM) against the server's clampText(raw?.text, 2000) and the
// store-replacing PUT response: edge whitespace rendered locally (the
// canvas's pre-wrap makes it visible content) then visibly lost on the
// ~1s round-trip; a whitespace-only AI text nulled to empty after save.
// And scaleElements had NO 100000 ceiling — the sanitizer bounds the
// MULTIPLIER (0.05..20) but not the PRODUCT, so an ×20 scale on a
// >5000-wide element rendered locally then VISIBLY TELEPORTED to the
// server's 100000 bound when the store-replacing PUT landed.

const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);

const assistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);

// ---------------------------------------------------------------------------
// S86-A — the leave-transport ordering closure (A86-L3, the headline)
// ---------------------------------------------------------------------------

describe("the leave-transport ordering closure (S86-A / A86-L3)", () => {
  it("SOURCE — the in-flight descriptor carries the flightDone promise handle", () => {
    // THE DEFECT PIN: pre-fix the descriptor carries only the CAPTURED
    // state references ({ projectId, elements, backgroundColor }) — the
    // cleanup can tell WHETHER a flight is live but can never tell WHEN
    // it completes, so it cannot sequence its own newer-state PUT after
    // the machine's older-state PUT. The handle is the ordering closure's
    // primitive.
    expect(editorViewSource).toMatch(
      /const inFlightRef = React\.useRef<\{\s*projectId: string;\s*elements: ProjectDTO\["elements"\];\s*backgroundColor: string;\s*flightDone: Promise<void>;\s*\} \| null>\(null\);/
    );
  });

  it("SOURCE — the flush creates the flight's completion promise before the descriptor goes live", () => {
    // The descriptor must be live BEFORE setSaving() (the S71-B ordering
    // — exit() runs the flush's synchronous prefix before the unmount
    // cleanup can read it), so the promise and its resolver are created
    // at the same site the descriptor is assigned.
    expect(editorViewSource).toMatch(
      /let resolveFlightDone: \(\) => void = \(\) => \{\};\s*const flightDone = new Promise<void>\(\(resolve\) => \{\s*resolveFlightDone = resolve;\s*\}\);/
    );
    expect(editorViewSource).toMatch(
      /inFlightRef\.current = \{\s*projectId: capturedProjectId,\s*elements: capturedElements,\s*backgroundColor: capturedBackgroundColor,\s*flightDone,\s*\};[\s\S]{0,80}?store\.setSaving\(\);/
    );
  });

  it("SOURCE — the flush's finally resolves the flight (the descriptor dies with the flight, the completion with it)", () => {
    // THE DEFECT PIN: pre-fix the finally only clears the descriptor —
    // nothing signals the flight's completion to a boundary that already
    // captured it. The finally is the ONE completion site (success,
    // failure, and every early return flow through it).
    expect(editorViewSource).toMatch(
      /finally \{[\s\S]{0,300}?resolveFlightDone\(\);\s*flushing = false;/
    );
  });

  it("SOURCE — the cleanup's reference-mismatch branch chains its PUT strictly after the machine's flight", () => {
    // THE DEFECT PIN: pre-fix the mismatch branch fires its own PUT₂
    // immediately (fire-and-forget) while the machine's PUT₁ is still in
    // flight — two parallel same-project full-replace PUTs whose landing
    // order HTTP doesn't guarantee. The chain: PUT₂'s fetch runs in a
    // .then on the captured flight (or Promise.resolve() when no flight
    // is live / it targets another project).
    expect(editorViewSource).toMatch(
      /const machineFlight =\s*softLeaveDescriptor !== null && softLeaveDescriptor\.projectId === state\.projectId\s*\? softLeaveDescriptor\.flightDone\s*: Promise\.resolve\(\);/
    );
    expect(editorViewSource).toMatch(
      /leaveTransportFor = \{\s*projectId: state\.projectId,\s*done: machineFlight\s*\.then\(\(\) =>\s*fetch\(/
    );
  });

  it("SOURCE — the S71-B comment block names the ordering case (the out-of-order landing hazard)", () => {
    // The doc's own posture assumed ordered landing ("the safety net for
    // the NEWER state") — the honest comment names the ordering the chain
    // now guarantees.
    expect(editorViewSource).toMatch(/out-of-order|landing order/i);
  });

  it("SOURCE — the registry's module-level note carries the sequence semantics", () => {
    // The S85-A registry's note: the at-unmount PUT becomes awaitable.
    // The S86-A extension: the transport is now the machine's flight AND
    // the cleanup's PUT chained onto it — the mount awaits the SEQUENCE.
    expect(editorViewSource).toMatch(
      /the transport is now the SEQUENCE/i
    );
    expect(editorViewSource).toMatch(
      /machine's in-flight PUT₁ awaited first, the cleanup's newer-state PUT₂/i
    );
  });
});

// ---------------------------------------------------------------------------
// S86-B(a) — the AI apply seam's text clamp (A86-L1)
// ---------------------------------------------------------------------------

describe("the AI apply seam clamps element text at the consumer (S86-B / A86-L1)", () => {
  it("BEHAVIORAL — clampText's whitespace contract re-pinned at the AI consumer seam", () => {
    // THE DEFECT PIN: the AI path's length half is already bounded (the
    // route message cap 1000 / the sanitizer slice 500 < 2000), but the
    // WHITESPACE half fired — the fallback's quoted content (' hello ')
    // and the LLM's free-form text arrive with edge whitespace, render
    // locally (pre-wrap), then visibly lose it on the store-replacing
    // round-trip. The server's own helper holds the contract the consumer
    // must now mirror.
    expect(clampText("  AI edge whitespace  ", 2000)).toBe("AI edge whitespace");
    expect(clampText("   ", 2000)).toBeNull();
    expect(clampText("kept  inner  spaces", 2000)).toBe("kept  inner  spaces");
    expect(clampText("a".repeat(2001), 2000)).toBe("a".repeat(2000));
  });

  it("SOURCE — the add path's partial.text clamps through clampText", () => {
    // THE DEFECT PIN: pre-fix the add path commits
    // `partial.text = operation.element.text` RAW — the S85-B TextSection
    // fix covered the panel surface; the AI apply path is the family's
    // missed consumer (the same PUT round-trips both).
    expect(assistantSource).toMatch(
      /partial\.text = clampText\(operation\.element\.text, 2000\)/
    );
  });

  it("SOURCE — the update path's patch.text clamps through clampText", () => {
    // THE DEFECT PIN: pre-fix the update path commits
    // `patch.text = operation.patch.text` RAW.
    expect(assistantSource).toMatch(
      /patch\.text = clampText\(operation\.patch\.text, 2000\)/
    );
  });

  it("SOURCE — the apply seam imports clampText from the validation seam", () => {
    // The import path mirrors the TextSection's (@/lib/validation — the
    // same helper the server's buildElementRow consumes; never a local
    // re-implementation).
    expect(assistantSource).toMatch(/import \{ clampText \} from "@\/lib\/validation";/);
  });
});

// ---------------------------------------------------------------------------
// S86-B(b) — scaleElements' 100000 ceiling (A86-L2)
// ---------------------------------------------------------------------------

describe("scaleElements clamps the product to the server's bound (S86-B / A86-L2)", () => {
  it("BEHAVIORAL — clampSizeField holds the multiplicative boundary (the ×20-on-5000 contract)", () => {
    // THE DEFECT PIN: pre-fix scaleElements computes
    // Math.max(el.width * factor, floor) — the sanitizer bounds the
    // multiplier (0.05..20) but never the product, so ×20 on a 5000-wide
    // element reaches 100000 exactly and ×20 on a 20000-wide element
    // (the sanitizer's own width cap) reaches 400000 — rendered locally,
    // then visibly teleported to 100000 when the store-replacing PUT
    // lands (the S84-B teleport family's multiplicative member).
    expect(clampSizeField(5000 * 20, "rectangle")).toBe(100000);
    expect(clampSizeField(20000 * 20, "rectangle")).toBe(100000);
    expect(clampSizeField(100 * 1.25, "rectangle")).toBe(125);
    // The type-aware floor survives the multiplicative path.
    expect(clampSizeField(0 * 20, "line")).toBe(0);
    expect(clampSizeField(0.01 * 0.05, "rectangle")).toBe(1);
  });

  it("SOURCE — scaleElements consumes clampSizeField on BOTH products", () => {
    // THE DEFECT PIN: pre-fix the products ride the bare Math.max floor
    // form (editor-store.ts:300-313). The S84-B helper (mirroring the
    // server's clampNumber(raw?.width, 0, 100000, …) bound) joins the
    // multiplicative path — every sibling (the panel fields, the
    // sanitizer's width/height patches) is already bounded.
    expect(storeSource).toMatch(
      /width: clampSizeField\(el\.width \* factor, el\.type\)/
    );
    expect(storeSource).toMatch(
      /height: clampSizeField\(el\.height \* factor, el\.type\)/
    );
    // The bare multiplicative forms are gone.
    expect(storeSource).not.toMatch(
      /width: Math\.max\(el\.width \* factor,/
    );
    expect(storeSource).not.toMatch(
      /height: Math\.max\(el\.height \* factor,/
    );
  });

  it("SOURCE — the store imports clampSizeField from the editor lib", () => {
    expect(storeSource).toMatch(
      /import \{[\s\S]{0,200}?clampSizeField,[\s\S]{0,200}?\} from "@\/lib\/editor";/
    );
  });
});

// ---------------------------------------------------------------------------
// The survival family — the sibling contracts must ride through unchanged
// ---------------------------------------------------------------------------

describe("the S86 survival family (the sibling contracts unchanged)", () => {
  it("SURVIVAL — the machineCarriesThisState skip branch survives byte-identically (a pure duplicate still skips)", () => {
    expect(editorViewSource).toMatch(
      /const machineCarriesThisState =\s*softLeaveDescriptor !== null &&\s*softLeaveDescriptor\.projectId === state\.projectId &&\s*softLeaveDescriptor\.elements === state\.elements &&\s*softLeaveDescriptor\.backgroundColor === state\.backgroundColor;/
    );
  });

  it("SURVIVAL — the S85-A registry's drain site survives (the mount awaits the same-project transport)", () => {
    expect(editorViewSource).toMatch(
      /const transport = leaveTransportFor;\s*leaveTransportFor = null;\s*if \(transport && transport\.projectId === projectId\) \{\s*await transport\.done;/
    );
  });

  it("SURVIVAL — the S85-B TextSection's clamp form rides through unchanged", () => {
    const panelSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
      "utf8",
    );
    expect(panelSource).toMatch(/maxLength=\{2000\}/);
    expect(panelSource).toMatch(
      /const clamped = clampText\(element\.text, 2000\) \?\? "";/
    );
  });

  it("SURVIVAL — the fallback parser's add-text grammar is unchanged (the capture witness depends on it)", () => {
    // The fallback's quoted-content form ('[quoted content with its edge
    // whitespace]') is the S86-B capture witness's driver — the grammar
    // must keep preserving the quoted content verbatim.
    const libSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/lib/ai-assistant.ts"),
      "utf8",
    );
    expect(libSource).toMatch(
      /const quoted = message\.match\(\/"\(\[\^"\]\+\)"\|'\(\[\^'\]\+\)'\/\);/
    );
    expect(libSource).toMatch(
      /const content = quoted\?\.\[1\] \?\? quoted\?\.\[2\] \?\? "Text";/
    );
  });

  it("SURVIVAL — scaleElements' optional commit parameter (S80-C) rides through unchanged", () => {
    // The AI apply's combined scale+patch coalescing depends on the
    // commit=false form; the ceiling must not disturb it.
    expect(storeSource).toMatch(
      /scaleElements: \(ids, factor, commit = true\) =>/
    );
  });
});
