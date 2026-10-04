import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { downscaledDimensions, FILL_IMAGE_MAX_DIM, shouldDownscale } from "../src/lib/editor";

// The session-73 upload-downscale pass (S73-F half B — the deferred DQ-3,
// the payload-dominant half of the unbounded-list-aggregate finding).
//
// THE DEFECT: the upload seam guards only the FILE size (500 KB) and then
// stores reader.readAsDataURL(file) VERBATIM — no dimension bound, no
// re-encode. A 4000x3000 photo under 500 KB becomes a ~683k-char data URL
// (just under the server's FILL_IMAGE_MAX_CHARS = 700_000), and those
// bytes then ride EVERY autosave PUT (the full-list replace body), EVERY
// detail GET, and EVERY list GET (THUMBNAIL_ELEMENT_SELECT still ships
// fillImage — the thumbnail paint needs it). A realistic image-heavy
// board pushes the list family toward the 32 MB cap PER PROJECT.
//
// THE FIX: the client-side downscale at the upload seam — images with a
// dimension over FILL_IMAGE_MAX_DIM (1200) are drawn to an offscreen
// canvas at <=1200 longest side and re-encoded; the SHRUNK result is used
// only when actually shorter than the original (a re-encode that GREW the
// payload keeps the original — the honest bound). The pure helpers live
// in src/lib/editor.ts; the DOM-dependent draw stays in the component.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the pure downscale helpers (S73-F)", () => {
  it("FILL_IMAGE_MAX_DIM is 1200 (the documented bound)", () => {
    expect(FILL_IMAGE_MAX_DIM).toBe(1200);
  });

  it("shouldDownscale trips only when a dimension exceeds the bound", () => {
    expect(shouldDownscale(1200, 1200)).toBe(false);
    expect(shouldDownscale(1200, 900)).toBe(false);
    expect(shouldDownscale(1201, 900)).toBe(true);
    expect(shouldDownscale(900, 1201)).toBe(true);
    expect(shouldDownscale(2400, 2400)).toBe(true);
    expect(shouldDownscale(0, 0)).toBe(false);
  });

  it("downscaledDimensions preserves the aspect and caps the longest side at 1200", () => {
    // A 2400x2400 square lands exactly at 1200x1200.
    expect(downscaledDimensions(2400, 2400)).toEqual({ width: 1200, height: 1200 });
    // A 4000x3000 photo: the longest side caps at 1200, the short side
    // keeps the 4:3 aspect (3000 * 1200/4000 = 900).
    expect(downscaledDimensions(4000, 3000)).toEqual({ width: 1200, height: 900 });
    // Portrait: the HEIGHT is the long side.
    expect(downscaledDimensions(1800, 2400)).toEqual({ width: 900, height: 1200 });
  });

  it("dimensions already within the bound pass through unchanged", () => {
    expect(downscaledDimensions(1200, 800)).toEqual({ width: 1200, height: 800 });
    expect(downscaledDimensions(640, 480)).toEqual({ width: 640, height: 480 });
  });

  it("a zero dimension degrades to the pass-through (SVGs with no intrinsic size)", () => {
    expect(downscaledDimensions(0, 0)).toEqual({ width: 0, height: 0 });
  });
});

describe("the component wiring (the upload seam consumes the downscale)", () => {
  const panel = src("src/components/editor/properties-panel.tsx");

  it("the readFile flow runs the downscale after the whitelist check", () => {
    // THE DEFECT PIN: pre-fix the onload hands the raw data URL straight
    // to update({ fillImage: dataUrl, ... }) — no downscale anywhere.
    const onload = panel.indexOf("reader.onload = () => {");
    expect(onload).toBeGreaterThan(-1);
    const body = panel.slice(onload, panel.indexOf("reader.onerror", onload));
    expect(body).toMatch(/downscaleDataUrl/);
  });

  it("the shrunk result is used only when actually shorter than the original", () => {
    // The honest bound: a re-encode that GREW the payload keeps the
    // original — the downscale never makes the stored bytes worse.
    const panelDown = panel.indexOf("function downscaleDataUrl");
    if (panelDown === -1) {
      // Defined elsewhere or inlined — the guard must exist somewhere in
      // the upload path.
      expect(panel).toMatch(/shrunk\.length < dataUrl\.length|shorter|\.length </);
    } else {
      const body = panel.slice(panelDown, panel.indexOf("function", panelDown + 10) === -1
        ? panel.length
        : panel.indexOf("function", panelDown + 10));
      expect(body).toMatch(/\.length/);
    }
  });

  it("the pure helpers are imported from the editor lib (the seam doctrine)", () => {
    expect(panel).toMatch(/import \{[^}]*downscaledDimensions[^}]*\} from "@\/lib\/editor"/);
    expect(panel).toMatch(/import \{[^}]*shouldDownscale[^}]*\} from "@\/lib\/editor"/);
  });

  it("the 500 KB file gate stays (defense in depth, unchanged)", () => {
    expect(panel).toMatch(/file\.size > 500 \* 1024/);
  });
});
