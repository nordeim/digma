import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-127 spec (the seventy-fifth audit's chosen work):
//
// S127-A — THE RESIZE-HANDLE POINTERDOWN'S LIVE-DRAG ENTRY GUARD +
//   BUTTON GATE (A127-M1's pointerdown face + A127-I1): the handle's
//   onPointerDown's FIRST statement is event.stopPropagation() (the
//   S59-G one-dispatch contract), so the event never reaches the
//   container's S126-A-guarded onPointerDown — the ONE canvas
//   pointerdown site the S126-A closure did not cover. A second
//   pointer pressing a resize handle through a live first-pointer
//   move/resize drag ran the unconditional beginGesture (OVERWRITING
//   the armed pre-drag snapshot — the A125-L2 lost-entry class) and
//   setDrag (REPLACING the shared drag state — the A126-M1 class),
//   and both pointers then drove the one resize through their
//   separate captures — the element teleporting by the inter-finger
//   delta per event until the first release. The closure: the same
//   entry guard at the handle's head + the button gate the
//   stopPropagation hid from the container's own :146 form (A127-I1).
//
// S127-B — THE DRAG'S POINTER OWNERSHIP (A127-M1's move/release face —
//   the lead's extension of the auditor's fix shape): the drag state
//   carried NO pointer identity, and the container's onPointerMove
//   branches on drag.kind alone — so a second pointer whose pointerdown
//   was REFUSED (at the container or the handle) still injected its
//   pressed moves into the live drag (the handle's wrapper forwarding
//   AND the plain-canvas hit-testing path — the latter an S126-A
//   residual), and a foreign pointer's up/leave/cancel TERMINATED the
//   live drag mid-flight. The closure: pointerId on every non-none
//   DragState member + the foreign-move refusal in onPointerMove
//   (AFTER the S57-A ghost guard — the heal-any-pointer doctrine is
//   load-bearing: the owner's lost-up scenario has no further owner
//   events, so an owner-discriminated heal would wedge the drag) +
//   the foreign-release refusal in onPointerUp (the event-optional
//   signature; the ghost heal's no-arg call stays non-discriminating
//   BY DESIGN) + the handle's up-wrapper passing its event.
//
// S127-C — THE PAD §10 STATUS RE-ANCHORS (B127-L1 — the F112
//   sweep-census class applied to §10's Status column): ten rows
//   whose defects were closed by later sessions (S114-D's Promise.race
//   25s bound; S101-A's strict boolean forms; S111-A's net-zero
//   endGesture guard; S102-B's P2025 arms; S111-D's @@unique + 409
//   sentinel + P2002; S78-E's take; S97-C's team-name half) still
//   read "Open (posture)"/"Open (queued)" — grep-falsifiable doc
//   drift. The §10 Status column joins the per-session doc-sweep
//   checklist.
//
// S127-D — THE TEAMMEMBER REDUNDANT INDEX DROP (B127-I1): the
//   @@index([teamId]) served no query since S111-D's
//   @@unique([teamId, email]) — the composite's leftmost prefix
//   serves every teamId query (the S71-C redundant-index doctrine's
//   missed sibling).
//
// The script family (the S118-C convention, s127 form): the s127
//   parity scripts ride their OWN tokens (live127 / nav127 /
//   digma-seo-s127.log, the 103rd audit / 104th session / 64th clip
//   ordinals, the S126 delivery at HEAD 7c44f6f), never the frozen
//   s126 forms.

const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const propertiesPanelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const schemaSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/schema.prisma"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const refAudit127Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s127.sh"),
  "utf8",
);
const nav127Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s127.sh"),
  "utf8",
);
const seo127Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s127.sh"),
  "utf8",
);

/** The comment-stripped collapsed view (the F89/F100 form the s118+
 * specs established: line prefixes stripped BEFORE the join so
 * multi-line comment targets stay visible). */
function collapsed(source: string): string {
  return source
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\/\/|#|\*)\s?/, "").trim())
    .filter((l) => l.length > 0)
    .join(" ");
}

/** The §10 row at its leading text — the row's single line. */
function padRow(leading: string): string {
  const at = padSource.indexOf(leading);
  expect(at).toBeGreaterThan(-1);
  return padSource.slice(at, padSource.indexOf("\n", at));
}

describe("lows-s127 — the seventy-fifth audit's chosen work", () => {
  // ---- S127-A: the handle's live-drag entry guard + button gate ----

  it("DEFECT (source): the handle's onPointerDown carries the live-drag entry guard AND the button gate — after the stopPropagation, before the beginGesture/setDrag pair", () => {
    const downAt = canvasSource.indexOf("onPointerDown={(event) => {");
    expect(downAt).toBeGreaterThan(-1);
    const beginAt = canvasSource.indexOf("useEditorStore.getState().beginGesture();", downAt);
    expect(beginAt).toBeGreaterThan(-1);
    const head = canvasSource.slice(downAt, beginAt);
    // The S59-G one-dispatch contract stays FIRST — the guard rides
    // behind it, closing the bypass the stopPropagation opened.
    const stopAt = head.indexOf("event.stopPropagation();");
    const guardAt = head.indexOf('if (drag.kind !== "none") return;');
    expect(stopAt).toBeGreaterThan(-1);
    expect(guardAt).toBeGreaterThan(stopAt);
    expect(head).toMatch(/if \(drag\.kind !== "none"\) return;/);
    expect(head).toMatch(/if \(event\.button !== 0\) return;/);
  });

  it("DEFECT (source): the S127-A registration names the bypass — the stopPropagation, the uncovered site, the overwrite, the replacement, the dual-drive, the honest refusal, the button gate", () => {
    const downAt = canvasSource.indexOf("onPointerDown={(event) => {");
    const beginAt = canvasSource.indexOf("useEditorStore.getState().beginGesture();", downAt);
    const collapsedRegion = collapsed(canvasSource.slice(downAt, beginAt));
    expect(collapsedRegion).toMatch(/S127-A/);
    expect(collapsedRegion).toMatch(/A127-M1/);
    expect(collapsedRegion).toMatch(/S59-G/);
    expect(collapsedRegion).toMatch(/S126-A/);
    expect(collapsedRegion).toMatch(/dual-drive/);
    expect(collapsedRegion).toMatch(/honest refusal/);
    expect(collapsedRegion).toMatch(/button gate/);
    expect(collapsedRegion).toMatch(/A127-I1/);
  });

  // ---- S127-B: the drag's pointer ownership -------------------------

  it("DEFECT (source): every non-none DragState member carries pointerId — the ownership field on all five arms", () => {
    expect(canvasSource).toMatch(/\| \{ kind: "draw"; pointerId: number;/);
    expect(canvasSource).toMatch(/\| \{ kind: "move"; pointerId: number;/);
    expect(canvasSource).toMatch(/\| \{ kind: "resize"; pointerId: number;/);
    expect(canvasSource).toMatch(/\| \{ kind: "marquee"; pointerId: number;/);
    expect(canvasSource).toMatch(/\| \{ kind: "pan"; pointerId: number;/);
  });

  it("DEFECT (census): all five drag arms set pointerId at their arm sites — the event's own pointer identity", () => {
    expect((canvasSource.match(/pointerId: event\.pointerId,/g) ?? []).length).toBe(5);
  });

  it("DEFECT (source): the foreign-move refusal sits in onPointerMove AFTER the S57-A ghost guard — the heal-any-pointer doctrine preserved, the injection closed", () => {
    const moveAt = canvasSource.indexOf("function onPointerMove(event: React.PointerEvent) {");
    expect(moveAt).toBeGreaterThan(-1);
    const ghostAt = canvasSource.indexOf("if (event.buttons === 0) {", moveAt);
    const panAt = canvasSource.indexOf('if (drag.kind === "pan") {', moveAt);
    expect(ghostAt).toBeGreaterThan(-1);
    expect(panAt).toBeGreaterThan(ghostAt);
    const window = canvasSource.slice(ghostAt, panAt);
    expect(window).toMatch(/if \(event\.pointerId !== drag\.pointerId\) return;/);
  });

  it("DEFECT (source): the S127-B foreign-move registration names the injection paths and the S57-A ordering rationale", () => {
    const moveAt = canvasSource.indexOf("function onPointerMove(event: React.PointerEvent) {");
    const panAt = canvasSource.indexOf('if (drag.kind === "pan") {', moveAt);
    const collapsedRegion = collapsed(canvasSource.slice(moveAt, panAt));
    expect(collapsedRegion).toMatch(/S127-B/);
    expect(collapsedRegion).toMatch(/A127-M1/);
    expect(collapsedRegion).toMatch(/foreign/);
    expect(collapsedRegion).toMatch(/S57-A/);
    expect(collapsedRegion).toMatch(/heal/);
    expect(collapsedRegion).toMatch(/handle's own onPointerMove wrapper/);
  });

  it("DEFECT (source): the foreign-release refusal — onPointerUp takes the optional event and refuses a foreign pointer's up/leave/cancel", () => {
    expect(canvasSource).toMatch(/function onPointerUp\(event\?: React\.PointerEvent\) \{/);
    const upAt = canvasSource.indexOf("function onPointerUp(event?: React.PointerEvent) {");
    const region = canvasSource.slice(upAt, upAt + 1600);
    expect(region).toMatch(/if \(event && event\.pointerId !== drag\.pointerId\) return;/);
  });

  it("DEFECT (source): the handle's up-wrapper passes its event — the captured owner's terminal reaches the discrimination", () => {
    expect(canvasSource).toMatch(/onPointerUp=\{\(event\) => \{\s*event\.stopPropagation\(\);\s*onPointerUp\(event\);/);
  });

  // ---- S127-C: the PAD §10 status re-anchors -------------------------

  it("DEFECT (docs): the two LLM-timeout rows flip onto the S114-D closure — the Promise.race bound, never 'Open (queued)'", () => {
    const row1 = padRow("The LLM server-side timeout: the installed z-ai-web-dev-sdk");
    expect(row1).toMatch(/Fixed \(session 114, S114-D/);
    expect(row1).not.toMatch(/Open \(queued/);
    const row2 = padRow("The LLM completion call's server-side timeout");
    expect(row2).toMatch(/Fixed \(session 114, S114-D/);
    expect(row2).not.toMatch(/Open \(kept queued\)/);
  });

  it("DEFECT (docs): the truthy-JSON row flips onto the S101-A strict forms", () => {
    const row = padRow("buildElementRow's visible/locked booleans — the strict forms since S101-A");
    expect(row).toMatch(/Fixed \(session 101, S101-A/);
    expect(row).not.toMatch(/Documented posture \(session 80, S80 deferral #7\)/);
  });

  it("DEFECT (docs): the no-op-inert-entry row flips onto the S111-A net-zero guard", () => {
    const row = padRow("A no-op coalesced AI operation and the net-zero drag");
    expect(row).toMatch(/Fixed \(session 111, S111-A/);
    expect(row).not.toMatch(/Documented posture \(session 81, S81 deferral #2\)/);
  });

  it("DEFECT (docs): the two no-P2025 rows flip onto the S102-B arms", () => {
    const row1 = padRow("The auth family's user-row updates — the P2025 arms live since S102-B");
    expect(row1).toMatch(/Fixed \(session 102, S102-B/);
    expect(row1).not.toMatch(/Open \(accepted posture — unreachable via the API/);
    const row2 = padRow("The auth routes' read-then-update P2025 escape (session 78's posture — closed)");
    expect(row2).toMatch(/Fixed \(session 102, S102-B/);
    expect(row2).not.toMatch(/Open \(posture\)/);
  });

  it("DEFECT (docs): the members-duplicate row flips onto the S111-D unique + sentinel + P2002 family", () => {
    const row = padRow("The members POST duplicate (teamId, email) rows (session 78's posture — closed)");
    expect(row).toMatch(/Fixed \(session 111, S111-D/);
    expect(row).not.toMatch(/No unique constraint on the pair and no pre-check/);
  });

  it("DEFECT (docs): the three partial rows register their closures — the team-name half (S97-C), the take member (S78-E), the withThumbFills mechanism (S113-D)", () => {
    const nameCap = padRow("The name-cap reject doctrine — projects and TEAMS reject");
    expect(nameCap).toMatch(/Partially fixed \(session 97, S97-C/);
    const postureBatch = padRow("The informational asymmetries (session 76's posture batch)");
    expect(postureBatch).toMatch(/S78-E/);
    expect(postureBatch).not.toMatch(/missing take sibling/);
    const thumb = padRow("The fillImageThumb for already-stored images");
    expect(thumb).toMatch(/S113-D/);
    expect(thumb).not.toMatch(/still ships full fillImage data URLs on the four list-family responses/);
  });

  it("DEFECT (docs): the §10 header carries the status-sweep registration — the column joins the per-session doc-sweep checklist", () => {
    const headerAt = padSource.indexOf("## 10. Known Issues & Outstanding Tasks");
    expect(headerAt).toBeGreaterThan(-1);
    const region = collapsed(padSource.slice(headerAt, headerAt + 900));
    expect(region).toMatch(/S127-C/);
    expect(region).toMatch(/status sweep/);
    expect(region).toMatch(/delivered-session ledger/);
  });

  // ---- S127-D: the TeamMember redundant index drop -------------------

  it("DEFECT (schema): the TeamMember index pair — the composite unique present, the redundant single-column index gone", () => {
    // The pins anchor on the ATTRIBUTE-at-line-start forms (the
    // F50(1) lesson: precision over censorship — the schema's own
    // registration comments legitimately NAME the dropped index in
    // prose).
    expect(schemaSource).toMatch(/@@unique\(\[teamId, email\]\)/);
    expect(schemaSource).not.toMatch(/^\s*@@index\(\[teamId\]\)\s*$/m);
  });

  // ---- SURVIVAL: the S126 seams keep their forms ----------------------

  it("SURVIVAL (source): the S126-A container guard keeps its form — the head window before the pan branch", () => {
    const headAt = canvasSource.indexOf("function onPointerDown(event: React.PointerEvent) {");
    expect(headAt).toBeGreaterThan(-1);
    const panAt = canvasSource.indexOf("if (event.button === 1 || isPanning())", headAt);
    expect(panAt).toBeGreaterThan(-1);
    const head = canvasSource.slice(headAt, panAt);
    expect(head).toMatch(/if \(drag\.kind !== "none"\) return;/);
  });

  it("SURVIVAL (source): the S126-B per-input slider tokens keep their forms — the shared-token census stays closed", () => {
    expect(propertiesPanelSource).toMatch(/sliderGesture\.begin\(`slider:\$\{label\}`\)/);
    expect(propertiesPanelSource).toMatch(/sliderGesture\.finish\("slider:Gradient angle"\)/);
    expect(propertiesPanelSource).not.toMatch(/sliderGesture\.(begin|finish)\("slider"\)/);
  });

  it("SURVIVAL (source): the S57-A ghost heal keeps its non-discriminating no-arg call — the heal-any-pointer doctrine", () => {
    expect(canvasSource).toMatch(/if \(event\.buttons === 0\) \{\s*onPointerUp\(\);\s*return;/);
  });

  // ---- SURVIVAL: the s127 script provenance ---------------------------

  it("SURVIVAL (scripts): the s127 ref-audit provenance — live127, the 103rd audit, the 64th clip ordinal, the S126 delivery at HEAD 7c44f6f", () => {
    expect(refAudit127Source).toMatch(/--session live127/);
    expect(refAudit127Source).toMatch(/103rd reference audit/);
    expect(refAudit127Source).toMatch(/byte-identical the 64th/);
    expect(refAudit127Source).toMatch(/HEAD 7c44f6f/);
    expect(refAudit127Source).not.toMatch(/live126|102nd reference audit|d6a0b5f/);
  });

  it("SURVIVAL (scripts): the s127 verify-nav provenance — nav127, the 104th session, the S127-cycle, the FINAL S127 build", () => {
    expect(nav127Source).toMatch(/--session nav127/);
    expect(nav127Source).toMatch(/104th session, S127-cycle/);
    expect(nav127Source).toMatch(/FINAL S127 build/);
    expect(nav127Source).not.toMatch(/nav126|103rd session/);
  });

  it("SURVIVAL (scripts): the s127 seo-check provenance — the s127 log token, the S127-cycle summary", () => {
    expect(seo127Source).toMatch(/digma-seo-s127\.log/);
    expect(seo127Source).toMatch(/session 127, S127-cycle/);
    expect(seo127Source).not.toMatch(/digma-seo-s126\.log|session 126, S126-cycle/);
  });
});
