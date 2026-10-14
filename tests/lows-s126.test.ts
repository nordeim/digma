import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-126 spec (the seventy-fourth audit's chosen work):
//
// S126-A — THE CANVAS POINTERDOWN'S LIVE-DRAG ENTRY GUARD (A126-M1,
//   the headline Medium): the drag state machine is single-pointer
//   (one shared drag) while pointer events are multi-pointer — a
//   second canvas pointerdown through a live first-pointer
//   move/resize drag ran the fresh-pointerdown logic and REPLACED the
//   drag state. The marquee/pan branches never touch the gesture and
//   onPointerUp's move/resize arm is the armed snapshot's only canvas
//   terminal, so the first pointer's armed gestureSnapshot was
//   ORPHANED — the session-57 H-1 chain resurrected: the autosave's
//   gesture-deferral re-arming the 800ms timer into a ~1.1s full-list
//   PUT loop forever, the keyboard and header undo arms dead through
//   their own stand-downs, panel edits committing history-free. The
//   hit branch was worse in the other direction: beginGesture
//   OVERWRITING the armed snapshot mid-drag (the pre-drag layout
//   unreachable via undo) and the replaced lastX/lastY teleporting
//   the second selection by the inter-finger delta. The closure: the
//   entry guard at onPointerDown's head — the dropped pointerdown the
//   honest refusal (the S123-A/S124-B/S125-A dropped-click doctrine).
//
// S126-B — THE SLIDER TERMINAL'S PER-INPUT TOKENS (A126-L1 — the
//   release-side twin of the S125-B closure): all five panel sliders
//   shared the one "slider" token, so after a second pointer's press
//   armed a FRESH gesture (the S125-B flush + fresh arm), the FIRST
//   pointer's release on the first slider passed finish's token
//   check AND the ownership check (the closure's own armed update
//   made the first release OWN the second gesture) and terminated it
//   — cancelGesture discarding the second slider's armed snapshot, or
//   endGesture pushing its entry mid-drag, the surviving ticks then
//   committing per-tick (the S62-A flooding). The closure: the
//   begin/finish tokens derive from the INPUT (the SliderRow's
//   `slider:${label}` template + the four inline per-section forms) —
//   a stale release early-returns at the token check, the active
//   surface's own terminal the sole ender.
//
// S126-C — THE SKILL PER-FILE LINE-COUNT RE-ANCHORS (B126-L1): the
//   three hand-maintained claims drifted (editor-store 483 vs the
//   live 730; auth.ts 127 vs 147; globals.css 138 vs 267) — an
//   uncovered doc surface no count sweep ever reached (the F112
//   sweep-census member applied to the count family).
//
// S126-D — THE PAD TOKEN-FORM RE-ANCHOR + THE S9 CODE SWAP (B126-L2
//   + B126-I1): the §6.1 S3 row and the ADR-003 entry still
//   described the pre-S67-A three-part `userId.expiry` token — the
//   live payload since S67-A is `userId.tokenVersion.expiry`, the
//   version the revocation dimension the reset-eviction rides; and
//   the S9 example enumeration named `UNAUTHORIZED`, a code the API
//   never emits (the live 401 code is `UNAUTHENTICATED`).
//
// The script family (the S118-C convention, s126 form): the s126
//   parity scripts ride their OWN tokens (live126 / nav126 /
//   digma-seo-s126.log, the 102nd audit / 103rd session / 63rd clip
//   ordinals, the S125 delivery at HEAD d6a0b5f), never the frozen
//   s125 forms.

const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const propertiesPanelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const aiAssistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const authSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/auth.ts"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const refAudit126Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s126.sh"),
  "utf8",
);
const nav126Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s126.sh"),
  "utf8",
);
const seo126Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s126.sh"),
  "utf8",
);

/** The live citation parenthetical — the form the S124-D/S125-C
 * re-anchors retire. The registration comments may NAME the
 * historical form (quoted, never parenthesized — the repo's honesty
 * convention). */
const LIVE_CITATION = /\(ADR-\d+ in the inherited architecture\)/;

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

describe("lows-s126 — the seventy-fourth audit's chosen work", () => {
  // ---- S126-A: the canvas pointerdown's live-drag entry guard -----

  it("DEFECT (source): the canvas onPointerDown carries the live-drag entry guard at its head — before the pan branch, before every drag-state write", () => {
    const headAt = canvasSource.indexOf("function onPointerDown(event: React.PointerEvent) {");
    expect(headAt).toBeGreaterThan(-1);
    const panAt = canvasSource.indexOf("if (event.button === 1 || isPanning())", headAt);
    expect(panAt).toBeGreaterThan(-1);
    const head = canvasSource.slice(headAt, panAt);
    // The guard itself, inside the head window (after the signature,
    // before the pan branch's first setDrag).
    expect(head).toMatch(/if \(drag\.kind !== "none"\) return;/);
  });

  it("DEFECT (source): the S126-A registration names the interleave — the orphaned snapshot, the PUT loop, the dead undo arms, the teleport, the honest refusal", () => {
    const headAt = canvasSource.indexOf("function onPointerDown(event: React.PointerEvent) {");
    const panAt = canvasSource.indexOf("if (event.button === 1 || isPanning())", headAt);
    const region = canvasSource.slice(headAt, panAt);
    const collapsedRegion = collapsed(region);
    expect(collapsedRegion).toMatch(/S126-A/);
    expect(collapsedRegion).toMatch(/A126-M1/);
    expect(collapsedRegion).toMatch(/ORPHANED|orphaned/);
    expect(collapsedRegion).toMatch(/PUT loop/);
    expect(collapsedRegion).toMatch(/teleport/);
    expect(collapsedRegion).toMatch(/honest refusal/);
    expect(collapsedRegion).toMatch(/marquee and pan/);
  });

  // ---- S126-B: the slider terminal's per-input tokens -------------

  it("DEFECT (source): the SliderRow's gesture tokens derive from the row's own label — the template form at all four handlers", () => {
    const rowAt = propertiesPanelSource.indexOf("function SliderRow({");
    expect(rowAt).toBeGreaterThan(-1);
    const rowEnd = propertiesPanelSource.indexOf("function ", rowAt + 10);
    const row = propertiesPanelSource.slice(rowAt, rowEnd);
    expect(row).toMatch(/sliderGesture\.begin\(`slider:\$\{label\}`\)/);
    expect(row).toMatch(/sliderGesture\.finish\(`slider:\$\{label\}`\)/);
    expect((row.match(/sliderGesture\.finish\(`slider:\$\{label\}`\)/g) ?? []).length).toBe(3);
  });

  it("DEFECT (source): the four inline slider sites carry their own per-input tokens — the gradient angle, rotation, scale, and opacity forms", () => {
    expect(propertiesPanelSource).toMatch(/sliderGesture\.begin\("slider:Gradient angle"\)/);
    expect(propertiesPanelSource).toMatch(/sliderGesture\.finish\("slider:Gradient angle"\)/);
    expect(propertiesPanelSource).toMatch(/sliderGesture\.begin\("slider:Rotation"\)/);
    expect(propertiesPanelSource).toMatch(/sliderGesture\.finish\("slider:Rotation"\)/);
    expect(propertiesPanelSource).toMatch(/sliderGesture\.begin\("slider:Scale"\)/);
    expect(propertiesPanelSource).toMatch(/sliderGesture\.finish\("slider:Scale"\)/);
    expect(propertiesPanelSource).toMatch(/sliderGesture\.begin\("slider:Opacity"\)/);
    expect(propertiesPanelSource).toMatch(/sliderGesture\.finish\("slider:Opacity"\)/);
  });

  it("DEFECT (census): no shared \"slider\" token remains at any call site — the per-input census closes", () => {
    expect(propertiesPanelSource).not.toMatch(/sliderGesture\.(begin|finish)\("slider"\)/);
  });

  it("DEFECT (source): the S126-B registration at the finish seam names the release-side twin — the first release owning the second gesture, the sole-ender doctrine", () => {
    const finishAt = propertiesPanelSource.indexOf("const finish = (surface: string) => {");
    expect(finishAt).toBeGreaterThan(-1);
    const region = propertiesPanelSource.slice(
      Math.max(0, finishAt - 2200),
      finishAt + 200,
    );
    const collapsedRegion = collapsed(region);
    expect(collapsedRegion).toMatch(/S126-B/);
    expect(collapsedRegion).toMatch(/A126-L1/);
    expect(collapsedRegion).toMatch(/release-side twin/);
    expect(collapsedRegion).toMatch(/sole ender/);
  });

  // ---- S126-C: the SKILL per-file line-count re-anchors ------------

  it("DEFECT (docs): the SKILL's editor-store line claim matches the live count (730)", () => {
    expect(skillSource).toMatch(/editor-store\.ts` \(730 lines\)/);
    expect(skillSource).not.toMatch(/editor-store\.ts` \(483 lines\)/);
  });

  it("DEFECT (docs): the SKILL's auth.ts line claim matches the live count (147)", () => {
    expect(skillSource).toMatch(/147 lines in `src\/lib\/auth\.ts`/);
    expect(skillSource).not.toMatch(/127 lines in `src\/lib\/auth\.ts`/);
  });

  it("DEFECT (docs): the SKILL's globals.css line claim matches the live count (267)", () => {
    expect(skillSource).toMatch(/src\/app\/globals\.css` \(267 lines\)/);
    expect(skillSource).not.toMatch(/src\/app\/globals\.css` \(138 lines\)/);
  });

  // ---- S126-D: the PAD token-form re-anchor + the S9 code swap -----

  it("DEFECT (docs): the PAD §6.1 S3 row carries the four-part versioned token — the three-part form retired", () => {
    const rowAt = padSource.indexOf("| S3 |");
    expect(rowAt).toBeGreaterThan(-1);
    const row = padSource.slice(rowAt, padSource.indexOf("\n", rowAt));
    expect(row).toMatch(/userId\.tokenVersion\.expiry/);
    expect(row).not.toMatch(/over `userId\.expiry`/);
  });

  it("DEFECT (docs): the PAD's ADR-003 entry carries the four-part token form with the version/eviction clause", () => {
    const adrAt = padSource.indexOf("ADR-003: Hand-rolled scrypt");
    expect(adrAt).toBeGreaterThan(-1);
    const region = padSource.slice(adrAt, adrAt + 1100);
    expect(region).toMatch(/userId\.tokenVersion\.expiry\.signature/);
    expect(region).not.toMatch(/`userId\.expiry\.signature`/);
  });

  it("DEFECT (docs): the PAD §6.1 S9 example enumeration names the code the API emits — UNAUTHENTICATED, never UNAUTHORIZED", () => {
    const rowAt = padSource.indexOf("| S9 |");
    expect(rowAt).toBeGreaterThan(-1);
    const row = padSource.slice(rowAt, padSource.indexOf("\n", rowAt));
    expect(row).toMatch(/UNAUTHENTICATED/);
    expect(row).not.toMatch(/UNAUTHORIZED/);
  });

  // ---- SURVIVAL: the S125/S124 seams keep their forms --------------

  it("SURVIVAL (source): the S125-A AI Revert stand-down keeps its form — the capture, the guard, the dispatch, after the epoch belt", () => {
    const dispatchAt = aiAssistantSource.indexOf("store.restoreSnapshot(message.revertSnapshot)");
    expect(dispatchAt).toBeGreaterThan(-1);
    const region = aiAssistantSource.slice(Math.max(0, dispatchAt - 1600), dispatchAt + 80);
    const collapsedRegion = collapsed(region);
    expect(collapsedRegion).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect(collapsedRegion).toMatch(/if \(store\.gestureSnapshot\) return;/);
    expect(collapsedRegion).toMatch(/S125-A/);
  });

  it("SURVIVAL (source): the S125-B begin flush and arm branches keep their forms — the surface-difference conditions stay gone", () => {
    const beginAt = propertiesPanelSource.indexOf("begin: (surface: string) => {");
    expect(beginAt).toBeGreaterThan(-1);
    const bodyEnd = propertiesPanelSource.indexOf("tick: () => {", beginAt);
    const body = propertiesPanelSource.slice(beginAt, bodyEnd);
    expect(body).toMatch(/if \(activeSurface !== null && changed && ownsCurrentGesture\(\)\) \{\s*store\.endGesture\(\);/);
    expect(body).not.toMatch(/activeSurface !== surface && changed/);
    expect(body).toMatch(/const live = useEditorStore\.getState\(\);\s*if \(live\.gestureSnapshot === null\) \{\s*live\.beginGesture\(\);/);
    expect(body).not.toMatch(/activeSurface === null \|\| activeSurface !== surface/);
  });

  it("SURVIVAL (source): the S125-C auth citation keeps its form — the PAD registry anchor, no live inherited-architecture parenthetical", () => {
    expect(authSource).not.toMatch(LIVE_CITATION);
    expect(authSource).toMatch(/PAD ADR-003/);
  });

  it("SURVIVAL (source): the S124-B pointer stand-down keeps its form — both buttons' capture, guard, dispatch, in order", () => {
    const undoAt = editorViewSource.indexOf('aria-label="Undo"');
    const redoAt = editorViewSource.indexOf('aria-label="Redo"');
    expect(undoAt).toBeGreaterThan(-1);
    expect(redoAt).toBeGreaterThan(-1);
    const region = editorViewSource.slice(Math.max(0, undoAt - 1800), redoAt + 400);
    const collapsedRegion = collapsed(region);
    expect(collapsedRegion).toMatch(/const store = useEditorStore\.getState\(\);/);
    expect((collapsedRegion.match(/if \(store\.gestureSnapshot\) return;/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });

  // ---- SURVIVAL: the s126 script provenance ------------------------

  it("SURVIVAL (scripts): the s126 ref-audit provenance — live126, the 102nd audit, the 63rd clip ordinal, the S125 delivery at HEAD d6a0b5f", () => {
    expect(refAudit126Source).toMatch(/--session live126/);
    expect(refAudit126Source).toMatch(/102nd reference audit/);
    expect(refAudit126Source).toMatch(/byte-identical the 63rd/);
    expect(refAudit126Source).toMatch(/HEAD d6a0b5f/);
    expect(refAudit126Source).not.toMatch(/live125|101st reference audit|345eba9/);
  });

  it("SURVIVAL (scripts): the s126 verify-nav provenance — nav126, the 103rd session, the S126-cycle, the FINAL S126 build", () => {
    expect(nav126Source).toMatch(/--session nav126/);
    expect(nav126Source).toMatch(/103rd session, S126-cycle/);
    expect(nav126Source).toMatch(/FINAL S126 build/);
    expect(nav126Source).not.toMatch(/nav125|102nd session/);
  });

  it("SURVIVAL (scripts): the s126 seo-check provenance — the s126 log token, the S126-cycle summary", () => {
    expect(seo126Source).toMatch(/digma-seo-s126\.log/);
    expect(seo126Source).toMatch(/session 126, S126-cycle/);
    expect(seo126Source).not.toMatch(/digma-seo-s125\.log|session 125, S125-cycle/);
  });
});
