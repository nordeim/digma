import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The SVG export format (session 54, S54-A — the session-65 suggestion
// #2). The PNG export (session 51) serializes the 1000×700 board
// through the pure `elementsToSvg` seam and rasterizes it at 2×; the
// serializer's own output IS a standalone SVG document, so a second
// download format costs a menu, not a new seam. The contract here is
// threefold:
//
// (a) THE SEAM — `downloadSvg(svg, filename)` wraps the serializer's
//     string in an `image/svg+xml;charset=utf-8` Blob and drives it
//     through the SAME anchor-trigger pattern as `downloadPng` (the
//     pattern extracted into the internal `triggerBlobDownload` helper
//     consumed by BOTH — the F35e single-source rule applied to the
//     download mechanics). The SVG path is the TRUE vector artifact:
//     no rasterization, no 2× scale, no webfont fidelity limit — the
//     1000×700 viewBox is the contract.
//
// (b) THE SURFACE — the zoom-cluster Download chip becomes a
//     DropdownMenu trigger (the vendored primitive, the
//     project-card-ellipsis convention) opening a two-item menu:
//     "Download PNG" (the 2× raster path unchanged) + "Download SVG"
//     (the vector path). The footprint is IDENTICAL to the single chip
//     — the F38g placement study holds trivially, no pinned geometry
//     contract can shift (the trio DOM-boundary guard reads the pill's
//     parent and the Download trigger stays its SIBLING).
//
// (c) THE HONEST LABEL (F39) — the trigger becomes aria-label/title
//     "Download": it now opens a menu of formats, and a label naming
//     one format would oversell what the control opens.
//
// This suite pins the seam as a SOURCE contract (the
// canvas-memo/guarded-number-input pattern); the download round-trips
// (the .svg suggested filename, the SVG scaffold bytes, the toast) are
// pinned by the export e2e spec.

const libSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/export-png.ts"),
  "utf8",
);
const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);

describe("downloadSvg — the SVG export seam (session 54, S54-A)", () => {
  it("exports downloadSvg with the SVG MIME and the shared anchor trigger", () => {
    expect(libSource).toMatch(/export function downloadSvg\(/);
    const start = libSource.indexOf("export function downloadSvg(");
    // The next top-level construct (or the file's end — the helper may
    // be the last export) bounds the body.
    let end = libSource.indexOf("\nexport ", start + 10);
    if (end < 0) end = libSource.indexOf("\nfunction ", start + 10);
    if (end < 0) end = libSource.length;
    expect(end, "the function definition must be findable").toBeGreaterThan(start);
    const body = libSource.slice(start, end);
    // The serializer's string becomes an SVG Blob — the MIME is the
    // contract (image/svg+xml; the charset matches svgToPngBlob's own).
    expect(body).toMatch(/image\/svg\+xml;charset=utf-8/);
    // The anchor mechanics are SHARED with downloadPng — one
    // triggerBlobDownload helper consumed by both (never two copies of
    // the createObjectURL/anchor.click/revoke dance): 1 definition +
    // exactly 2 call sites (downloadPng + downloadSvg).
    expect(libSource).toMatch(/function triggerBlobDownload\(blob: Blob, filename: string\)/);
    expect(libSource.match(/triggerBlobDownload\(/g)?.length ?? 0).toBe(3);
  });

  it("the editor's Download chip is a format MENU (PNG + SVG items), honestly labeled", () => {
    // The vendored dropdown primitive drives the chip (the
    // project-card-ellipsis convention).
    expect(viewSource).toMatch(/DropdownMenu\b/);
    expect(viewSource).toMatch(/DropdownMenuTrigger/);
    expect(viewSource).toMatch(/DropdownMenuItem/);
    // Both formats live in the menu with their honest names.
    expect(viewSource).toMatch(/Download PNG/);
    expect(viewSource).toMatch(/Download SVG/);
    // The HONEST trigger label: the chip opens a menu of formats, so
    // the accessible name is "Download" — a label naming one format
    // would oversell (F39). The stale single-format label is gone.
    expect(viewSource).toMatch(/aria-label="Download"/);
    expect(viewSource).not.toMatch(/aria-label="Download PNG"/);
    // The SVG path runs through the serializer's own string — the
    // vector artifact, no rasterization.
    expect(viewSource).toMatch(/downloadSvg\(/);
  });
});
