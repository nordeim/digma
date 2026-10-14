import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { useEditorStore } from "@/components/editor/editor-store";

// The session-118 spec (the sixty-sixth audit's chosen work):
//
// S118-A — the shift+marquee ADDITIVE COMMIT (A118-L1, the headline):
//   the pointerdown arm honors shift — `if (!event.shiftKey)
//   deselectAll()` preserves the selection a shift+drag starts from —
//   but the commit replaced it with the marquee's inside set alone:
//   every previously-selected element outside the rect silently
//   dropped (the additive intent falsified at commit; the store's own
//   select(ids, additive) union form already existed and the
//   layers-panel shift-click already rode it). The closure: the
//   DragState's marquee member captures shift at pointerdown, the
//   commit passes it — UNION semantics (an inside element already
//   selected stays selected; an empty shift+marquee preserves the
//   selection; the plain marquee byte-identical).
//
// S118-B — the flushIdleBurst PRIMITIVE + the AI apply's entry flush
//   (A118-L2 + the A117-I2 deferred member's closure): the apply's
//   synchronous arms (add/delete, and the update arm's coalesce
//   arming) pushed their snapshots BEFORE an armed panel burst's own
//   terminal pushed the PRE-burst snapshot — the S117-C/A117-I2
//   intent-order inversion. The S117-C fix ceiling ("the module's
//   inability to discriminate the idle-armed TEXT burst from the
//   ACTIVE slider drag") is the module's OWN STATE: begin() clears
//   the idle before every slider arm and slider ticks never re-arm
//   it, so idleTimer !== null holds EXACTLY when an idle-armed
//   text/field burst is in flight. The primitive flushes ONLY that
//   burst — a changed one's entry lands FIRST, an unchanged one
//   cancels — and passes an active drag through untouched (the S81-A
//   posture). After the flush gestureSnapshot === null, so the
//   coalesce arm engages instead of the commit=true fallback — the
//   deferred member CLOSED, the fallback remaining for its true
//   posture (the active drag).
//
// S118-C — the script token isolation (A118-L3): the s118 verify-nav
//   script rides its OWN agent-browser session token (nav118) + log
//   token (digma-nav118.log), never the frozen s117 forms — a shared
//   token bleeds a leaked daemon session's authenticated browser
//   state across sessions (the F89 hollow-evidence family at the
//   script layer; the B-L2 un-bumped-ordinal class). Pinned
//   bidirectionally: the s118 script never carries nav117, the frozen
//   s117 script keeps its own form.
//
// S118-D — the fine prints (A118-I1..I5): the PresentOverlay
//   memoization (React.memo + the useCallback-stable exit — the
//   fullscreen overlay re-rendered its whole subtree on every store
//   change while presenting); the seed's CENSUS-TRUE counter (the
//   seed writes rows directly and left fillImageBytes at the column
//   default 0 while the seeded board carries counted payload
//   post-S117-A — the same rowStoredBytes seam the duplicate route
//   rides; the schema's "start fresh" parenthetical named honest);
//   the worst-case re-anchor (the "~30 MB heaviest-legitimate" figure
//   was the fills-only-counter form — post-census the honest worst
//   case is ~25 MB: the 24 MB counted bound + the ~0.76 MB fixed
//   slack; editor.ts + the elements route's two claims + the
//   validation sticky-wedge note); the store select registration
//   (the additive consumer census + the A117-I1 churn context).

const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const aiSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const layersPanelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/layers-panel.tsx"),
  "utf8",
);
const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const elementsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);
const validationSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/validation.ts"),
  "utf8",
);
const seedSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/seed.ts"),
  "utf8",
);
const schemaSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/schema.prisma"),
  "utf8",
);
const nav118Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s118.sh"),
  "utf8",
);
const nav117Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s117.sh"),
  "utf8",
);
const refAudit118Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s118.sh"),
  "utf8",
);
const seo118Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s118.sh"),
  "utf8",
);

/** The comment-stripped collapsed view (the F89/F100 form: line
 * prefixes stripped BEFORE the join so multi-line targets stay
 * visible; the receiver-prefixed code forms discriminate code from
 * the repair's own prose). */
function collapsed(source: string): string {
  return source
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\/\/|#)\s?/, "").trim())
    .filter((l) => l.length > 0)
    .join(" ")
    .replace(/\s+/g, " ");
}

const storeCollapsed = collapsed(storeSource);
const aiCollapsed = collapsed(aiSource);

/** The marquee commit block slice (the s118 boundary form: the slice
 * starts AT the code line the commit rides — the drag.kind ===
 * "marquee" arm — so the doctrine comment above the select call sits
 * INSIDE the slice, never above its boundary). */
const marqueeStart = canvasSource.indexOf('} else if (drag.kind === "marquee") {');
const marqueeEnd = canvasSource.indexOf('} else if (drag.kind === "move"', marqueeStart);
const marqueeBlock = canvasSource.slice(marqueeStart, marqueeEnd);
const marqueeBlockCollapsed = collapsed(marqueeBlock);

beforeEach(() => {
  useEditorStore.setState({
    selectedIds: ["a", "b"],
  });
});

describe("S118-A the shift+marquee additive commit (A118-L1 — the headline)", () => {
  it("DEFECT (source): the marquee DragState member captures the shift flag at pointerdown", () => {
    // The type carries the flag... (re-anchored session 127, S127-B —
    // the pointer-ownership member: pointerId joins every non-none
    // DragState arm; the shift flag contract unchanged)
    expect(canvasSource).toMatch(
      /\| \{ kind: "marquee"; pointerId: number; startX: number; startY: number; x: number; y: number; w: number; h: number; shift: boolean \}/,
    );
    // ...and the pointerdown arm captures the live modifier.
    expect(canvasSource).toMatch(
      /setDrag\(\{ kind: "marquee", pointerId: event\.pointerId, startX: point\.x, startY: point\.y, x: point\.x, y: point\.y, w: 0, h: 0, shift: event\.shiftKey \}\);/,
    );
  });

  it("DEFECT (source): the commit rides the store's additive flag — the union, never the replace", () => {
    expect(marqueeBlock).toMatch(
      /store\.select\(inside\.map\(\(el\) => el\.id\), drag\.shift\);/,
    );
    // The doctrine comment names the member + the union semantics.
    expect(marqueeBlockCollapsed).toMatch(/S118-A/);
    expect(marqueeBlockCollapsed).toMatch(/additive/i);
    expect(marqueeBlockCollapsed).toMatch(/union/i);
  });

  it("DEFECT (source): the canvas header's selection enumeration registers the shift+marquee member", () => {
    const headerEnd = canvasSource.indexOf("type DragState =");
    const header = canvasSource.slice(0, headerEnd);
    const headerCollapsed = collapsed(header);
    expect(headerCollapsed).toMatch(/shift\+marquee/);
    expect(headerCollapsed).toMatch(/S118-A/);
  });

  it("SURVIVAL (source): the pointerdown deselect gate stays — the additive intent's own arm", () => {
    expect(canvasSource).toMatch(
      /if \(!event\.shiftKey\) useEditorStore\.getState\(\)\.deselectAll\(\);/,
    );
  });

  it("SURVIVAL (source): the store's select union form stays (the one seam the commit now rides)", () => {
    expect(storeCollapsed).toMatch(
      /additive \? \[\.\.\.new Set\(\[\.\.\.state\.selectedIds, \.\.\.ids\]\)\] : ids,/,
    );
  });
});

describe("S118-B the flushIdleBurst primitive + the AI apply's entry flush (A118-L2 + the A117-I2 closure)", () => {
  it("DEFECT (source): the primitive discriminates — ONLY the idle-armed burst flushes, never the active drag", () => {
    // The discrimination form: idleTimer === null is EXACTLY the
    // active-drag/no-burst posture (begin() clears the idle; slider
    // ticks never re-arm it) — the early return protects it.
    expect(panelSource).toMatch(
      /flushIdleBurst: \(\) => \{\s*if \(idleTimer === null\) return;\s*clearIdle\(\);\s*if \(activeSurface !== null\) finish\(activeSurface\);\s*\},/,
    );
    // The doctrine comment names the discrimination.
    const burstIdx = panelSource.indexOf("flushIdleBurst: () => {");
    expect(burstIdx).toBeGreaterThan(-1);
    const burstRegion = panelSource.slice(Math.max(0, burstIdx - 2200), burstIdx);
    const burstRegionCollapsed = collapsed(burstRegion);
    expect(burstRegionCollapsed).toMatch(/S118-B/);
    expect(burstRegionCollapsed).toMatch(/idleTimer/i);
    expect(burstRegionCollapsed).toMatch(/active slider drag|ACTIVE slider drag/);
  });

  it("DEFECT (source): the exported handle beside resetSliderGesture", () => {
    expect(panelSource).toMatch(
      /export const flushIdleBurst = \(\) => sliderGesture\.flushIdleBurst\(\);/,
    );
  });

  it("DEFECT (source): the AI apply's entry flush — the import + the order-verified call before the operations loop", () => {
    expect(aiSource).toMatch(/import \{ flushIdleBurst \} from "\.\/properties-panel";/);
    // The flush lands INSIDE applyOperations, BEFORE the loop (the
    // raw order form — the comment between the branch open and the
    // call rides the [\\s\\S] gap).
    expect(aiSource).toMatch(
      /function applyOperations\(operations: AiOperation\[\]\): number \{[\s\S]*?flushIdleBurst\(\);[\s\S]*?for \(const operation of operations\)/,
    );
  });

  it("DEFECT (source): the S81-A comment names the closed member — the ceiling dissolved, the fallback remains for the active drag", () => {
    expect(aiCollapsed).toMatch(/S118-B/);
    expect(aiCollapsed).toMatch(/flushIdleBurst/);
    expect(aiCollapsed).toMatch(/dissolved|CLOSED/i);
    // The s117 registration tokens survive the amendment verbatim.
    expect(aiCollapsed).toMatch(/S117-C/);
    expect(aiCollapsed).toMatch(/A117-I2/);
  });

  it("SURVIVAL (source): the canvas flush census stays 3 — the hit branch, the text branch, the resize arm", () => {
    const calls = canvasSource.match(/resetSliderGesture\(\);/g) ?? [];
    expect(calls.length).toBe(3);
  });

  it("SURVIVAL (source): the S81-A coalesce guard + the commit=true fallback arms stay (the active-drag posture)", () => {
    expect(aiCollapsed).toMatch(
      /const coalesce = operation\.patch\.scale !== undefined && Object\.keys\(patch\)\.length > 0 && useEditorStore\.getState\(\)\.gestureSnapshot === null;/,
    );
    expect(aiCollapsed).toMatch(
      /store\.scaleElements\(targets, operation\.patch\.scale, coalesce \? false : true\);/,
    );
    expect(aiCollapsed).toMatch(
      /store\.updateElements\(targets, patch, coalesce \? false : true\);/,
    );
  });

  it("SURVIVAL (source): begin()'s clearIdle stays — the discrimination's own foundation", () => {
    expect(panelSource).toMatch(/begin: \(surface: string\) => \{\s*clearIdle\(\);/);
  });
});

describe("S118-C the script token isolation (A118-L3)", () => {
  it("SURVIVAL (source): the s118 script rides its OWN token — nav118 + the isolated log, never the frozen s117 form", () => {
    expect(nav118Source).toMatch(/--session nav118/);
    expect(nav118Source).toMatch(/digma-nav118\.log/);
    // The isolation: the frozen token NEVER appears in the s118
    // artifact (a shared daemon session would bleed authenticated
    // browser state across sessions).
    expect(nav118Source).not.toMatch(/nav117/);
    // The run's own descriptors (the B-L2 pinned family).
    expect(nav118Source).toMatch(/95th consecutive session/);
    expect(nav118Source).toMatch(/the S117 delivery 9dd4321 \+ the S118 remediation/);
  });

  it("SURVIVAL (source): the frozen s117 script keeps its own token (the evidence form)", () => {
    expect(nav117Source).toMatch(/--session nav117/);
    expect(nav117Source).toMatch(/digma-nav117\.log/);
  });

  it("SURVIVAL (source): the ref-audit + seo-check s118 provenance anchors — the 94th form, the 55th consecutive clip ordinal", () => {
    expect(refAudit118Source).toMatch(/94th reference audit/);
    expect(refAudit118Source).toMatch(/byte-identical the 55th/);
    expect(refAudit118Source).toMatch(/consecutive session at the 94th audit/);
    expect(refAudit118Source).toMatch(/--session live118/);
    expect(refAudit118Source).toMatch(/ref-audit-s128/);
    expect(seo118Source).toMatch(/session 118, S118-cycle/);
    expect(seo118Source).toMatch(/digma-seo-s118\.log/);
  });
});

describe("S118-D the fine prints (A118-I1..I5)", () => {
  it("DEFECT (source): the PresentOverlay memoized + the render site rides the memoized form", () => {
    expect(editorViewSource).toMatch(/const MemoizedPresentOverlay = React\.memo\(PresentOverlay\);/);
    expect(editorViewSource).toMatch(/\{presenting && <MemoizedPresentOverlay onExit=\{exitPresent\} \/>\}/);
  });

  it("DEFECT (source): the useCallback-stable exit — the memo's prop stability (S118-D1)", () => {
    expect(editorViewSource).toMatch(
      /const exitPresent = React\.useCallback\(\(\) => setPresenting\(false\), \[\]\);/,
    );
    const exitIdx = editorViewSource.indexOf("const exitPresent = React.useCallback");
    expect(exitIdx).toBeGreaterThan(-1);
    const exitRegion = editorViewSource.slice(Math.max(0, exitIdx - 1600), exitIdx);
    const exitRegionCollapsed = collapsed(exitRegion);
    expect(exitRegionCollapsed).toMatch(/S118-D1/);
  });

  it("DEFECT (source): the seed's census-true counter — the rowStoredBytes seam, never the column default (S118-D2)", () => {
    expect(seedSource).toMatch(/import \{ rowStoredBytes \} from "\.\.\/src\/lib\/editor";/);
    expect(seedSource).toMatch(
      /fillImageBytes: p1elements\.reduce\(\(sum, el\) => sum \+ rowStoredBytes\(el\), 0\),/,
    );
  });

  it("DEFECT (source): the schema's counter comment names the census-true seeding (the honest parenthetical)", () => {
    const counterIdx = schemaSource.indexOf("fillImageBytes   Int");
    expect(counterIdx).toBeGreaterThan(-1);
    const counterRegion = schemaSource.slice(Math.max(0, counterIdx - 3200), counterIdx);
    const counterRegionCollapsed = collapsed(counterRegion);
    expect(counterRegionCollapsed).toMatch(/S118-D2/);
    expect(counterRegionCollapsed).toMatch(/census-true/i);
  });

  it("DEFECT (source): editor.ts's constant comment re-anchors onto the post-census figure — the validation sticky-wedge note with it (S118-D3)", () => {
    // The constant's own "~30 MB heaviest-legitimate form doctrine" was
    // the fills-only-counter worst case; post-census the honest figure
    // is ~25 MB (the 24 MB counted bound + the ~0.76 MB fixed slack).
    expect(editorLibSource).not.toMatch(/~30 MB/);
    expect(editorLibSource).toMatch(/~25 MB/);
    // The validation sticky-wedge note's heaviest-legitimate claim
    // carries the same staleness (the same doctrine family).
    expect(validationSource).not.toMatch(/~30 MB/);
    expect(validationSource).toMatch(/~25 MB/);
  });

  it("DEFECT (source): the elements route's two ~30 MB claims re-anchor — the pointer's own target (S118-D3)", () => {
    // The PUT's counter-maintenance comment + the transaction-timeout
    // rationale — the very target editor.ts's "see the elements
    // route's" pointer names.
    expect(elementsRouteSource).not.toMatch(/~30 MB/);
    expect(elementsRouteSource).toMatch(/~25 MB/);
  });

  it("DEFECT (source): the store select registration — the additive consumer census + the A117-I1 churn context (S118-D5)", () => {
    const selectIdx = storeSource.indexOf("select: (ids, additive) =>");
    expect(selectIdx).toBeGreaterThan(-1);
    const selectRegion = storeSource.slice(Math.max(0, selectIdx - 1800), selectIdx);
    const selectRegionCollapsed = collapsed(selectRegion);
    expect(selectRegionCollapsed).toMatch(/S118-D5/);
    expect(selectRegionCollapsed).toMatch(/layers-panel/);
    expect(selectRegionCollapsed).toMatch(/marquee/);
    expect(selectRegionCollapsed).toMatch(/A117-I1/);
  });

  it("SURVIVAL (source): the seed's date forms + the idempotent wipe order stay", () => {
    expect(seedSource).toMatch(/lastOpenedAt: daysAgo\(2\)/);
    expect(seedSource).toMatch(/lastOpenedAt: daysAgo\(3\)/);
    // Session 128 (S128-E / B128-I1 — the F89/S102-B re-anchor class):
    // the wipe family rides the interactive transaction's tx client
    // now (the $transaction wrap, the 30s timeout) — the ORDER is
    // unchanged (designElement -> project -> teamMember -> team ->
    // user, the child-first cascade form).
    expect(seedSource).toMatch(/await tx\.designElement\.deleteMany\(\);/);
  });

  it("SURVIVAL (source): the layers-panel shift-click additive consumer stays", () => {
    expect(layersPanelSource).toMatch(/store\.select\(\[id\], true\);/);
  });

  it("SURVIVAL (behavioral): the store's additive union dedupes and preserves order — the plain form replaces", () => {
    useEditorStore.getState().select(["b", "c"], true);
    expect(useEditorStore.getState().selectedIds).toEqual(["a", "b", "c"]);
    useEditorStore.getState().select(["d"]);
    expect(useEditorStore.getState().selectedIds).toEqual(["d"]);
  });
});
