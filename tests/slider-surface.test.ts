import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The sliderGesture surface-aware interleaving (session 64, S64-B —
// the twelfth audit's A-2).
//
// THE DEFECT: the module-level sliderGesture helper tracked ONE
// `changed` flag with no notion of WHICH surface owned the open
// gesture. Typing in the Content input (a text gesture with its
// pre-typing snapshot armed) and then pointer-downing a slider
// interleaved destructively: the slider's begin() reset `changed`
// and OVERWROTE the gesture snapshot (the text burst's pre-state was
// lost — its edit became unreachable by undo); the Content blur's
// finish() then arrived (blur follows pointerdown — the focus
// transfer is the pointerdown's default action) and, seeing
// `changed === false`, cancelled the slider's FRESH gesture — leaving
// gestureSnapshot null, which reverts even the gesture-aware commit
// to per-tick flooding for that whole drag. Both gestures lost in
// one interleaving.
//
// THE FIX: the helper gains a SURFACE token. begin(surface) FLUSHES a
// changed foreign gesture first (endGesture — the text burst keeps
// its one undo entry) before beginning the new one and recording the
// owner; finish(surface) is a NO-OP when the active surface differs
// (the foreign blur must not cancel the slider's fresh gesture).

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);

describe("the surface-aware sliderGesture (session 64, S64-B / A-2)", () => {
  it("the helper's begin carries a surface parameter and records the active surface", () => {
    // THE DEFECT PIN: pre-fix begin took no parameter and tracked no
    // owner — the interleaving clobbered the open gesture blindly.
    expect(panelSource).toMatch(/begin: \(surface: string\) => \{/);
    expect(panelSource).toMatch(/activeSurface = surface/);
  });

  it("begin flushes a CHANGED foreign gesture before starting (the text burst keeps its undo entry)", () => {
    // THE DEFECT PIN: pre-fix begin overwrote the snapshot
    // unconditionally — a superseded typing burst's pre-state was
    // lost. The fix pushes the superseded gesture's snapshot into
    // history FIRST (the one-entry-per-gesture doctrine holds across
    // the interleave).
    const start = panelSource.indexOf("begin: (surface: string) => {");
    expect(start).toBeGreaterThan(-1);
    const end = panelSource.indexOf("},", start);
    const body = panelSource.slice(start, end);
    expect(body).toMatch(/changed/);
    expect(body).toMatch(/store\.endGesture\(\)/);
  });

  it("finish is a no-op for a foreign surface (the stale blur must not cancel the new gesture)", () => {
    // THE DEFECT PIN: pre-fix finish ended/cancelled whatever gesture
    // was open regardless of who owned it — the Content blur arriving
    // after the slider's begin cancelled the slider's gesture. The
    // fix returns early when the surfaces differ.
    const start = panelSource.indexOf("const finish = (surface: string) => {");
    expect(start).toBeGreaterThan(-1);
    const end = panelSource.indexOf("};", start);
    const body = panelSource.slice(start, end);
    expect(body).toMatch(/activeSurface !== surface/);
    expect(body).toMatch(/return;/);
  });

  it("the textTick path carries the owning surface (the idle-coalesced burst keeps its owner)", () => {
    // The text variant's begin-on-demand + idle re-arm must carry the
    // same owner token so a superseding slider's flush and the
    // eventual idle/blur finish resolve against the right surface.
    // Session 65 (S65-C) CONTRACT CHANGE: the idle now ends WHICHEVER
    // surface owns the gesture — the number fields feed this same tick
    // under their own "field" token, and a hardcoded text label made
    // the idle a NO-OP for them (the gesture never ended; the autosave
    // deferral looped forever). The surface is captured at ARM time,
    // and the finish's ownership guard keeps a canvas-superseded burst
    // from touching the store.
    // Session 66 (S66-A, en-route — a legitimate contract update): the
    // surface became the tick's PARAMETER (defaulting to the text
    // surface) instead of a hardcoded arm label — the field surfaces
    // pass their own token so their blur terminals end their bursts
    // immediately (the hardcoded label made the field blur a no-op
    // once the focus arm retired; the gesture outlived the blur by the
    // full idle and a Ctrl+Z in that window no-opped).
    const start = panelSource.indexOf('textTick: (surface: string = "text") => {');
    expect(start).toBeGreaterThan(-1);
    const end = panelSource.indexOf("},", start);
    const body = panelSource.slice(start, end);
    expect(body).toMatch(/activeSurface = surface/);
    expect(body).toMatch(/const idleSurface = activeSurface \?\? surface/);
    expect(body).toMatch(/finish\(idleSurface\)/);
  });

  it("the SliderRow and Content wiring pass their surface tokens (the consumers)", () => {
    // The slider inputs begin/finish with the slider surface; the
    // Content input's blur terminal carries the text surface.
    // Session 66 (S66-A / A-4 — a legitimate contract update): the
    // text surface's ARM moved off the focus event (the held-focus
    // autosave loop) into textTick's begin-on-demand branch — the
    // arm-on-demand line below is the text surface's arm now. The
    // slider's pointerdown pair is unchanged.
    expect(panelSource).toMatch(/sliderGesture\.begin\("slider"\)/);
    expect(panelSource).toMatch(/sliderGesture\.finish\("slider"\)/);
    // Session 66 (S66-A, en-route): the text surface's arm is the
    // tick's DEFAULT parameter — the swatches and the Content input
    // arm under "text" (their blur terminals match), the number fields
    // pass "field" explicitly.
    expect(panelSource).toMatch(/textTick: \(surface: string = "text"\) => \{/);
    expect(panelSource).toMatch(/sliderGesture\.textTick\("field"\)/);
    expect(panelSource).toMatch(/sliderGesture\.finish\("text"\)/);
  });

  it("the moved/cancel convention survives the refactor (the preservation)", () => {
    // PRESERVATION: the S62-A contract — a gesture that changed
    // nothing cancels (no no-op history entry); a changed one ends.
    expect(panelSource).toMatch(/if \(changed\) store\.endGesture\(\);\s*else store\.cancelGesture\(\);/);
  });
});
