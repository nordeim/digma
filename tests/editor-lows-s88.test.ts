import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cornerRadiusMax } from "@/lib/editor";

// The session-88 radius-ceiling pass (S88-A — the thirty-sixth audit's
// A88-L1, the S84-B teleport family's residual member).
//
// THE DEFECT: cornerRadiusMax capped the slider and the four per-corner
// NumberField commits at HALF THE SMALLER SIDE with no bound at the
// server's clampNumber(raw?.radius, 0, 2000, 0) — and since S87-B
// widened the panel W/H fields to the server's 100000 ceiling, an
// element whose smaller side exceeds 4000 is fully legal (a 5000x5000
// rect → dynamic max 2500). A radius typed to 2500 rendered locally,
// then VISIBLY TELEPORTED to 2000 ~1s later when the store-replacing
// autosave PUT landed — silently, no toast. The S84-B/S86-B/S87-B
// enumeration checked every field's STATIC client bound against its
// static server twin; the radius field's DYNAMIC bound (min/2, derived
// from two OTHER fields) escaped the enumeration because no literal
// number sat at the consumer.
//
// THE FIX: the 2000 ceiling composes INSIDE cornerRadiusMax — one seam
// covering all five consumers on BOTH surfaces (the mobile Sheet rides
// the shared PropertiesSections composition). The reference-measured
// dynamic behavior (RA-29: 200x150 → 75, 46x23.366 → 11.683, 156x117 →
// 58.5) is untouched — every measured element is far below the cap.

const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);

const panelSource = readFileSync(
  path.resolve(
    import.meta.dirname,
    "../src/components/editor/properties-panel.tsx",
  ),
  "utf8",
);

describe("the radius dynamic-max composes with the server's 2000 ceiling (S88-A / A88-L1)", () => {
  it("BEHAVIOR — a 5000x5000 element's radius max is the SERVER's 2000, not min/2's 2500", () => {
    // THE DEFECT PIN: pre-fix cornerRadiusMax({5000, 5000}) returns 2500
    // — the radius a user can legally type into the per-corner fields of
    // a fully-legal element, and the value the server then clamps to
    // 2000 on the store-replacing PUT (the visible teleport).
    expect(cornerRadiusMax({ width: 5000, height: 5000 })).toBe(2000);
  });

  it("BEHAVIOR — the max stays 2000 for any smaller side past 4000 (the W/H fields themselves reach 100000)", () => {
    // The reachability arithmetic: W/H accept up to 100000 (the S87-B
    // widened panel fields), so the smaller side — and min/2 — can be
    // driven arbitrarily far past 2000 by the element's own geometry.
    expect(cornerRadiusMax({ width: 999999, height: 999999 })).toBe(2000);
    expect(cornerRadiusMax({ width: 100000, height: 4001 })).toBe(2000);
    expect(cornerRadiusMax({ width: 9000, height: 4500 })).toBe(2000);
  });

  it("BEHAVIOR — the exact boundary: a 4000x4000 element's max is exactly 2000 (min/2 == the ceiling)", () => {
    expect(cornerRadiusMax({ width: 4000, height: 4000 })).toBe(2000);
    // One unit below the boundary: the dynamic doctrine still wins —
    // min/2 (1999) under the ceiling composes to itself.
    expect(cornerRadiusMax({ width: 3998, height: 4000 })).toBe(1999);
    expect(cornerRadiusMax({ width: 3998, height: 4000 })).not.toBe(2000);
  });

  it("BEHAVIOR (SURVIVAL) — the reference-measured dynamic family is untouched (RA-29)", () => {
    // Triple-measured on the reference: a 200x150 rectangle read
    // aria-valuemax="75"; a 46x23.366 rectangle read 11.68298487339743;
    // a 156x117 frame read 58.41492436698704. The cap sits far above
    // every measured element — the composition must not flatten the
    // dynamic doctrine at reference-scale geometry.
    expect(cornerRadiusMax({ width: 200, height: 150 })).toBe(75);
    expect(cornerRadiusMax({ width: 46, height: 23.366 })).toBe(11.683);
    expect(cornerRadiusMax({ width: 156, height: 117 })).toBe(58.5);
    expect(cornerRadiusMax({ width: 160, height: 44 })).toBe(22);
    expect(cornerRadiusMax({ width: 560, height: 8 })).toBe(4);
  });

  it("SOURCE — the ceiling composes INSIDE cornerRadiusMax (the single seam)", () => {
    // THE DEFECT PIN: pre-fix the body is the bare
    // `return Math.min(el.width, el.height) / 2;` — the composed form
    // carries the server's ceiling at the one seam every consumer rides.
    // Session 103 (S103-C / A-L3) re-anchor: the ceiling rides the named
    // single-source member (RADIUS_MAX) — the same number, the one map.
    expect(editorLibSource).toMatch(
      /return Math\.min\(Math\.min\(el\.width, el\.height\) \/ 2, RADIUS_MAX\)/,
    );
  });

  it("SOURCE (SURVIVAL) — all six cornerRadiusMax call sites still ride the seam (one seam, both surfaces)", () => {
    // The slider's max + the slider's onChange + the four per-corner
    // NumberField commits — six call sites, one helper, zero literal
    // 2000s at the consumers (the single source of the number).
    const rides = panelSource.match(/cornerRadiusMax\(element\)/g) ?? [];
    expect(rides.length).toBe(6);
    expect(panelSource).toMatch(/max=\{cornerRadiusMax\(element\)\}/);
    // No consumer smuggles its own radius ceiling past the seam.
    expect(panelSource).not.toMatch(/radius[^)\n]*2000/);
  });

  it("SOURCE (SURVIVAL) — the server's own clamp line keeps the canonical bounds (the single source of the number)", () => {
    // Session 103 (S103-C / A-L3) re-anchor: the ceiling now rides the
    // named single-source member (RADIUS_MAX) — the same number, the
    // one map of the domain (the S102-G POSITION_BOUND/SIZE_MAX form).
    expect(editorLibSource).toMatch(
      /radius: clampNumber\(raw\?\.radius, 0, RADIUS_MAX, 0\)/,
    );
  });
});
