import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  clampFontSizeField,
  clampPositionField,
  clampSizeField,
} from "../src/lib/editor";

// The session-84 client low batch (S84-B + S84-D(a) — the thirty-second
// audit's A84-L1 + A84-I2).
//
// S84-B — THE DEFECT (A84-L1): the properties panel's number fields
// lacked the server's clamps. X/Y committed RAW values (typing 500000
// rendered the element offscreen), W/H carried only the type-aware
// floors (no ceiling), and Font Size floored at 1 with no 500 ceiling —
// while the server's buildElementRow clamps all five (x/y ±100000,
// w/h 0..100000, fontSize 1..500) and the PUT response REPLACES the
// store list, so every out-of-range value visibly teleported on save
// (~1s of local/persisted disagreement, the element snapping back to
// 100000/500 after the round-trip). The Radius/Stroke/Rotation/Opacity
// siblings all clamp at their consumers — the asymmetry was the defect.
//
// THE FIX: three pure helpers in src/lib/editor.ts (the server's own
// bounds, mirrored at the consumer), consumed by the five panel fields
// (X, Y, W, H, Font Size). The mobile properties Sheet rides the SHARED
// PropertiesSections composition — one fix covers both surfaces.
//
// S84-D(a) — THE DEFECT (A84-I2): the Dashboard list-row date called
// bare toLocaleDateString() — locale-dependent on the device — while
// every sibling date site pins "en-US" (recent-view.tsx:151,
// project-card.tsx:378). THE FIX: the surface pins "en-US" (the
// minimal honest form — every en-US rendering byte-identical).

const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);

const dashboardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/dashboard-view.tsx"),
  "utf8",
);

// ---------------------------------------------------------------------------
// S84-B — the panel number-field clamp family (A84-L1)
// ---------------------------------------------------------------------------

describe("the panel number-field clamps mirror the server's bounds (S84-B / A84-L1)", () => {
  it("BEHAVIORAL — clampPositionField bounds X/Y to the server's ±100000", () => {
    // THE DEFECT PIN: pre-fix the helper is absent (the import fails).
    // The server's buildElementRow clamps x/y to [-100000, 100000].
    expect(clampPositionField(500000)).toBe(100000);
    expect(clampPositionField(-500000)).toBe(-100000);
    expect(clampPositionField(1234)).toBe(1234);
    expect(clampPositionField(0)).toBe(0);
    expect(clampPositionField(-100000)).toBe(-100000);
    expect(clampPositionField(100000)).toBe(100000);
  });

  it("BEHAVIORAL — clampSizeField keeps the type-aware floor AND gains the 100000 ceiling", () => {
    // THE DEFECT PIN: pre-fix W/H carried only the floors (a line floors
    // at 0, every other shape at 1 — the S70-D contract) with NO
    // ceiling; the server clamps width/height to [0, 100000].
    expect(clampSizeField(500000, "rectangle")).toBe(100000);
    expect(clampSizeField(-50, "rectangle")).toBe(1);
    expect(clampSizeField(-50, "line")).toBe(0);
    expect(clampSizeField(0, "line")).toBe(0);
    expect(clampSizeField(123, "ellipse")).toBe(123);
    expect(clampSizeField(100000, "text")).toBe(100000);
  });

  it("BEHAVIORAL — clampFontSizeField bounds the panel's Font Size to the server's 1..500", () => {
    // THE DEFECT PIN: pre-fix the field floored at 1 with no ceiling;
    // the server clamps fontSize to [1, 500] (a 1000 typed into the
    // panel rendered huge then snapped to 500 on save).
    expect(clampFontSizeField(1000)).toBe(500);
    expect(clampFontSizeField(0)).toBe(1);
    expect(clampFontSizeField(-7)).toBe(1);
    expect(clampFontSizeField(16)).toBe(16);
    expect(clampFontSizeField(500)).toBe(500);
  });

  it("SOURCE — the X and Y consumers route through clampPositionField (the raw update forms gone)", () => {
    // THE DEFECT PIN: pre-fix the fields read `update({ x })` — raw.
    expect(panelSource).toMatch(/update\(\{ x: clampPositionField\(x\) \}\)/);
    expect(panelSource).toMatch(/update\(\{ y: clampPositionField\(y\) \}\)/);
  });

  it("SOURCE — the W and H consumers route through clampSizeField (the floor-only forms gone)", () => {
    // THE DEFECT PIN: pre-fix the fields carried the type-aware floors
    // inline with no ceiling.
    expect(panelSource).toMatch(
      /update\(\{ width: clampSizeField\(width, element\.type\) \}\)/,
    );
    expect(panelSource).toMatch(
      /update\(\{ height: clampSizeField\(height, element\.type\) \}\)/,
    );
  });

  it("SOURCE — the Font Size consumer routes through clampFontSizeField (the floor-only form gone)", () => {
    expect(panelSource).toMatch(
      /update\(\{ fontSize: clampFontSizeField\(fontSize\) \}\)/,
    );
  });

  it("SURVIVAL — the sibling clamps are unchanged (Radius/Stroke/Rotation/Opacity keep their own forms)", () => {
    // The standing contract: every sibling field already clamps at its
    // consumer — the fix must not touch them.
    expect(panelSource).toMatch(/Math\.min\(Math\.max\(radius, 0\), cornerRadiusMax\(element\)\)/);
    expect(panelSource).toMatch(/Math\.min\(Math\.max\(strokeWidth, 0\), 20\)/);
    expect(panelSource).toMatch(/Math\.min\(Math\.max\(rotation, -180\), 180\)/);
    expect(panelSource).toMatch(/Math\.min\(Math\.max\(value, 0\), 100\) \/ 100/);
  });

  it("SURVIVAL — the server's own clamp line keeps the canonical bounds (the single source of the numbers)", () => {
    expect(editorLibSource).toMatch(/x: clampNumber\(raw\?\.x, -100000, 100000, 0\)/);
    expect(editorLibSource).toMatch(/width: clampNumber\(raw\?\.width, 0, 100000, 100\)/);
    expect(editorLibSource).toMatch(/clampNumber\(raw\?\.fontSize, 1, 500, 16\)/);
  });
});

// ---------------------------------------------------------------------------
// S84-D(a) — the Dashboard list-row date pins the locale (A84-I2)
// ---------------------------------------------------------------------------

describe("the Dashboard list-row date is locale-deterministic (S84-D / A84-I2)", () => {
  it("SOURCE — the list-row date pins en-US (the bare locale-dependent form gone)", () => {
    // THE DEFECT PIN: pre-fix the row called bare toLocaleDateString()
    // — the rendering depended on the device's locale while every
    // sibling date site pins "en-US".
    expect(dashboardSource).toMatch(/toLocaleDateString\("en-US"\)/);
    expect(dashboardSource).not.toMatch(/(?<!")toLocaleDateString\(\)(?!")/);
  });

  it("SURVIVAL — the sibling date sites keep their own en-US forms (the family contract)", () => {
    // The two sibling sites (recent-view, project-card) already pin
    // en-US with their own option sets — unchanged by this fix.
    const recentSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/recent-view.tsx"),
      "utf8",
    );
    const cardSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/project-card.tsx"),
      "utf8",
    );
    expect(recentSource).toMatch(/toLocaleDateString\("en-US", \{/);
    expect(cardSource).toMatch(/toLocaleDateString\("en-US", \{ month: "short", day: "numeric" \}\)/);
  });
});
