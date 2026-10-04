import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildElementRow } from "@/lib/editor";

// The session-70 one-schema-push batch (S70-B — the eighteenth audit's
// L-A1 + L-A2, the documented deferred #3/#4).
//
// THE DEFECTS: (L-A1) four dead schema columns — thumbnailSeed (zero code
// references), src/path (written by both element row-builders, zero read
// sites), zIndex (written + round-tripped through the DTO/store, zero
// read sites) — plus @@index([sortOrder]) serving no query (every element
// query filters projectId first) while adding write amplification to
// every 2000-row replace. (L-A2) three element row-builders with three
// conventions — the elements POST synthesizes defaults for OMITTED fields
// (fill→#3B82F6, stroke→#FFFFFF), the PUT NULLS omitted fields, the
// client's defaultElementFor is type-aware — the natural one-seam dedup.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the shared buildElementRow seam (S70-B / L-A2)", () => {
  it("create-mode synthesizes the POST defaults for omitted fill/stroke", () => {
    // THE DEFECT PIN: pre-fix the POST builder hand-rolls this synthesis.
    const row = buildElementRow({ type: "rectangle" }, 0, "create");
    expect(row.fill).toBe("#3B82F6");
    expect(row.stroke).toBe("#FFFFFF");
    expect(row.visible).toBe(true);
    expect(row.locked).toBe(false);
    expect(row.sortOrder).toBe(0);
  });

  it("replace-mode nulls omitted fill/stroke (the PUT contract)", () => {
    // THE DEFECT PIN: pre-fix the PUT builder hand-rolls this nulling —
    // the same field, two conventions, two builders.
    const row = buildElementRow({ type: "rectangle" }, 3, "replace");
    expect(row.fill).toBeNull();
    expect(row.stroke).toBeNull();
    expect(row.sortOrder).toBe(3);
  });

  it("explicit null fill/stroke null in BOTH modes (the clear actually clears)", () => {
    expect(buildElementRow({ type: "rectangle", fill: null, stroke: null }, 0, "create").fill).toBeNull();
    expect(buildElementRow({ type: "rectangle", fill: null, stroke: null }, 0, "create").stroke).toBeNull();
    expect(buildElementRow({ type: "rectangle", fill: null, stroke: null }, 0, "replace").fill).toBeNull();
    expect(buildElementRow({ type: "rectangle", fill: null, stroke: null }, 0, "replace").stroke).toBeNull();
  });

  it("invalid colors clamp to the fallback in both modes", () => {
    expect(buildElementRow({ type: "rectangle", fill: "not-a-color" }, 0, "create").fill).toBe("#3B82F6");
    expect(buildElementRow({ type: "rectangle", stroke: "zzz" }, 0, "replace").stroke).toBe("#FFFFFF");
  });

  it("the geometry clamps match the routes' historical forms", () => {
    const row = buildElementRow(
      { type: "rectangle", x: 1e9, y: -1e9, width: -5, height: 1e9, rotation: 99999, scale: 99, opacity: 5 },
      0,
      "replace",
    );
    expect(row.x).toBe(100000);
    expect(row.y).toBe(-100000);
    expect(row.width).toBe(0);
    expect(row.height).toBe(100000);
    expect(row.rotation).toBe(3600);
    expect(row.scale).toBe(20);
    expect(row.opacity).toBe(1);
  });

  it("the text fields clamp like the routes (the null-tolerant fontSize)", () => {
    const row = buildElementRow(
      { type: "text", text: "hello".repeat(1000), fontSize: null, fontWeight: "bold", fontFamily: "Bogus", textAlign: "sideways" },
      0,
      "replace",
    );
    expect(row.text!.length).toBeLessThanOrEqual(2000);
    expect(row.fontSize).toBeNull();
    expect(row.fontWeight).toBeNull();
    expect(row.fontFamily).toBeNull();
    expect(row.textAlign).toBeNull();
  });

  it("the gradient re-serializes through parseGradient (the JSON document round-trip)", () => {
    const row = buildElementRow(
      { type: "rectangle", fillGradient: JSON.stringify({ type: "linear", angle: 45, stops: [{ color: "#3b82f6", position: 0 }, { color: "#8b5cf6", position: 100 }] }) },
      0,
      "replace",
    );
    expect(row.fillGradient).toContain("linear");
    expect(row.fillGradient).toContain("45");
    // A malformed gradient nulls (the sanitize contract).
    const bad = buildElementRow({ type: "rectangle", fillGradient: "not-json" }, 0, "replace");
    expect(bad.fillGradient).toBeNull();
  });

  it("the image family clamps (the data-URL whitelist + the fit enum)", () => {
    expect(buildElementRow({ type: "rectangle", fillImage: "javascript:alert(1)" }, 0, "replace").fillImage).toBeNull();
    expect(
      buildElementRow({ type: "rectangle", fillImage: "data:image/png;base64,iVBORw0KGgo=" }, 0, "replace").fillImage,
    ).toBe("data:image/png;base64,iVBORw0KGgo=");
    expect(buildElementRow({ type: "rectangle", fillImageFit: "bogus" }, 0, "replace").fillImageFit).toBeNull();
    expect(buildElementRow({ type: "rectangle", fillImageFit: "stretch" }, 0, "replace").fillImageFit).toBe("stretch");
  });

  it("the name defaults through defaultNameFor when omitted", () => {
    const row = buildElementRow({ type: "rectangle" }, 4, "create");
    expect(row.name).toMatch(/Rectangle/);
    expect(buildElementRow({ type: "rectangle", name: "My Card" }, 0, "replace").name).toBe("My Card");
  });
});

describe("the elements routes consume the seam (the two builders are gone)", () => {
  const route = src("src/app/api/projects/[id]/elements/route.ts");

  it("both the POST and the PUT build their rows through buildElementRow", () => {
    // THE FIX PIN: the route imports + consumes the shared seam.
    expect(route).toMatch(/buildElementRow/);
    const post = route.slice(route.indexOf("export async function POST"));
    const put = route.slice(route.indexOf("export async function PUT"));
    expect(post).toMatch(/buildElementRow\(/);
    expect(put).toMatch(/buildElementRow\(/);
  });

  it("the hand-rolled fill synthesis forms are deleted (one convention, one seam)", () => {
    // THE DEFECT PIN: pre-fix the POST carries the ?? "#3B82F6" synthesis
    // inline and the PUT the null-on-omission form — two builders.
    expect(route).not.toMatch(/body\?\.fill === null \? null : clampColor/);
    expect(route).not.toMatch(/raw\?\.fill === null \|\| raw\?\.fill === undefined \? null : clampColor/);
  });
});

describe("the dead columns are gone (S70-B / L-A1)", () => {
  it("the schema carries none of the four dead columns and swaps the index", () => {
    // THE DEFECT PIN: pre-fix thumbnailSeed/src/path/zIndex all live in
    // prisma/schema.prisma and @@index([sortOrder]) serves no query.
    const schema = src("prisma/schema.prisma");
    // The pins anchor on the COLUMN-DECLARATION forms (Type + attribute
    // syntax) — the schema's doc comment legitimately names the dropped
    // columns in prose (the F50(1) lesson: precision over censorship).
    expect(schema).not.toMatch(/thumbnailSeed\s+Int/);
    expect(schema).not.toMatch(/\bsrc\s+String\?/);
    expect(schema).not.toMatch(/\bpath\s+String\?/);
    expect(schema).not.toMatch(/zIndex\s+Int/);
    // The composite index serves the filter+order every query runs.
    expect(schema).toMatch(/@@index\(\[projectId, sortOrder\]\)/);
    expect(schema).not.toMatch(/@@index\(\[sortOrder\]\)/);
  });

  it("the DTO and defaultElementFor carry none of the dead fields", () => {
    const editor = src("src/lib/editor.ts");
    // The DTO block (between the type declaration and ProjectDTO).
    const dtoStart = editor.indexOf("export type DesignElementDTO");
    const dtoEnd = editor.indexOf("export type ProjectDTO");
    const dto = editor.slice(dtoStart, dtoEnd);
    expect(dto).not.toMatch(/\bsrc:/);
    expect(dto).not.toMatch(/\bpath:/);
    expect(dto).not.toMatch(/\bzIndex:/);
    // defaultElementFor's literal.
    const defStart = editor.indexOf("export function defaultElementFor");
    const defEnd = editor.indexOf("if (type ===", defStart);
    const def = editor.slice(defStart, defEnd);
    expect(def).not.toMatch(/\bsrc: null,/);
    expect(def).not.toMatch(/\bpath: null,/);
    expect(def).not.toMatch(/\bzIndex: sortOrder,/);
  });

  it("the store's explicit field lists write none of the dead fields", () => {
    const store = src("src/components/editor/editor-store.ts");
    expect(store).not.toMatch(/zIndex:/);
  });

  it("the elements route writes none of the dead fields", () => {
    const route = src("src/app/api/projects/[id]/elements/route.ts");
    expect(route).not.toMatch(/\bsrc:/);
    expect(route).not.toMatch(/\bpath:/);
    expect(route).not.toMatch(/\bzIndex:/);
  });
});
