import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-70 list-payload projection (S70-C — the eighteenth audit's
// L-A3, the documented deferred #2).
//
// THE DEFECT: the list-family routes (GET /api/projects, the PATCH
// response, the duplicate response) ship FULL element rows — every column
// of every row including the ≤700 KB data-URL fillImage — to feed 320×200
// card thumbnails. The response side is NOT bounded by the 32 MB request
// cap; a realistic board with a handful of image fills makes every
// Dashboard/Recent mount a multi-MB JSON parse on a phone.
//
// THE FIX: the bounded thumbnail projection — THUMBNAIL_ELEMENT_SELECT
// (the exact fields CanvasThumbnail + boundsOf consume) applied to the
// list family; the detail GET (the editor's surface) keeps the full
// include; ThumbnailElementDTO + ProjectSummaryDTO type the projection;
// CanvasThumbnail's param widens to the thumbnail type.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the bounded thumbnail select on the list family (S70-C / L-A3)", () => {
  it("the projects LIST route projects the elements through the shared select", () => {
    // THE DEFECT PIN: pre-fix the GET ships include: { elements: {
    // orderBy: { sortOrder: "asc" } } } — every column of every row.
    const route = src("src/app/api/projects/route.ts");
    const get = route.slice(route.indexOf("export async function GET"));
    expect(get).toMatch(/THUMBNAIL_ELEMENT_SELECT/);
    expect(get).not.toMatch(/include: \{ elements: \{ orderBy: \{ sortOrder: "asc" \} \} \}/);
  });

  it("the PATCH response projects through the same select (the rename re-ships bounded rows)", () => {
    const route = src("src/app/api/projects/[id]/route.ts");
    const patch = route.slice(route.indexOf("export async function PATCH"));
    expect(patch).toMatch(/THUMBNAIL_ELEMENT_SELECT/);
    expect(patch).not.toMatch(/include: \{ elements: \{ orderBy: \{ sortOrder: "asc" \} \} \}/);
  });

  it("the duplicate response projects through the same select", () => {
    const route = src("src/app/api/projects/[id]/duplicate/route.ts");
    expect(route).toMatch(/THUMBNAIL_ELEMENT_SELECT/);
    // The SOURCE read (the copy input) may keep the full include — only
    // the RESPONSE ships bounded (the copy needs every column).
    const responseRead = route.slice(route.lastIndexOf("db.project.findUnique"));
    expect(responseRead).toMatch(/THUMBNAIL_ELEMENT_SELECT/);
  });

  it("the DETAIL GET keeps the full include (the editor's surface is unchanged)", () => {
    // THE PRESERVATION PIN: the editor mounts through GET
    // /api/projects/[id] and consumes every element field — the detail
    // route keeps the full-row include (only the LIST family projects).
    const route = src("src/app/api/projects/[id]/route.ts");
    // Bound the slice to the GET function itself (the PATCH below it
    // legitimately carries the projection).
    const getStart = route.indexOf("export async function GET");
    const patchStart = route.indexOf("export async function PATCH");
    const get = route.slice(getStart, patchStart);
    expect(get).toMatch(/include: \{ elements: \{ orderBy: \{ sortOrder: "asc" \} \} \}/);
    expect(get).not.toMatch(/THUMBNAIL_ELEMENT_SELECT/);
  });

  it("the shared select constant lives in the editor domain module and ships exactly the thumbnail fields", () => {
    // THE FIX PIN: one shared select — the fields CanvasThumbnail +
    // boundsOf consume, nothing else.
    const editor = src("src/lib/editor.ts");
    expect(editor).toMatch(/export const THUMBNAIL_ELEMENT_SELECT/);
    const selStart = editor.indexOf("export const THUMBNAIL_ELEMENT_SELECT");
    const selEnd = editor.indexOf("} as const;", selStart);
    const sel = editor.slice(selStart, selEnd);
    for (const field of [
      "id", "type", "x", "y", "width", "height", "rotation", "scale",
      "opacity", "fill", "fillGradient", "fillImage", "fillImageFit",
      "stroke", "strokeWidth", "radius", "text", "fontSize", "fontWeight",
      "fontFamily", "textAlign", "visible",
    ]) {
      expect(sel).toMatch(new RegExp(`\\b${field}: true\\b`));
    }
    // The dropped weight: name (frames render no thumbnail label, RA-19),
    // locked (thumbnails render locked elements — visible is the only
    // filter), sortOrder (the array IS the order), and the timestamps.
    expect(sel).not.toMatch(/\bname: true\b/);
    expect(sel).not.toMatch(/\blocked: true\b/);
    expect(sel).not.toMatch(/\bsortOrder: true\b/);
    expect(sel).not.toMatch(/createdAt/);
    expect(sel).not.toMatch(/updatedAt/);
  });
});

describe("the typed projection (S70-C)", () => {
  it("ThumbnailElementDTO + ProjectSummaryDTO exist in the editor domain module", () => {
    const editor = src("src/lib/editor.ts");
    expect(editor).toMatch(/export type ThumbnailElementDTO/);
    expect(editor).toMatch(/export type ProjectSummaryDTO/);
    // The thumbnail type is the DTO minus the projected-away fields.
    const tStart = editor.indexOf("export type ThumbnailElementDTO");
    const tEnd = editor.indexOf(";", tStart);
    const t = editor.slice(tStart, tEnd);
    expect(t).toMatch(/Omit<DesignElementDTO/);
    expect(t).toMatch(/"name"/);
    expect(t).toMatch(/"locked"/);
    expect(t).toMatch(/"sortOrder"/);
  });

  it("CanvasThumbnail consumes the thumbnail type (the narrowed param)", () => {
    const card = src("src/components/project-card.tsx");
    expect(card).toMatch(/ThumbnailElementDTO\[\]/);
  });

  it("the dashboard + recent views type their lists as the summary DTO", () => {
    const dash = src("src/components/dashboard-view.tsx");
    expect(dash).toMatch(/ProjectSummaryDTO/);
    const recent = src("src/components/recent-view.tsx");
    expect(recent).toMatch(/ProjectSummaryDTO/);
  });

  it("boundsOf widens structurally (the geometry-only Pick)", () => {
    // THE FIX PIN: boundsOf's signature accepts the thumbnail rows —
    // a Pick of the geometry fields (structural, both row kinds fit).
    const editor = src("src/lib/editor.ts");
    const bStart = editor.indexOf("export function boundsOf");
    const bEnd = editor.indexOf("{", bStart);
    const sig = editor.slice(bStart, bEnd);
    expect(sig).toMatch(/Pick<DesignElementDTO/);
    expect(sig).not.toMatch(/elements: DesignElementDTO\[\]/);
  });
});
