import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The image-fill whitelist parity (session 56, S56-E — the Mode C audit's
// M-4).
//
// The client accepted ANY data:image/… URL while the server's
// clampFillImage whitelists exactly png/jpeg/jpg/gif/svg+xml/webp — a BMP
// or AVIF fill painted correctly client-side, then the first autosave PUT
// nulled it server-side (clampFillImage → null) and markSaved adopted the
// sanitized list: the fill silently vanished ~1s later with no toast.
//
// The fix: the client's read-time check accepts exactly the server's five
// families — a non-whitelisted pick gets the EXISTING "Unsupported image"
// toast at read time instead of vanishing after the first autosave.

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const routeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);

/** The MIME families each side accepts (jpe?g → jpeg|jpg, escapes flattened). */
function familiesOf(source: string): string[] {
  // Both sides write data-URL regex literals — the extracted text carries
  // the literal backslashes ("data:image\\/(png|…)"), so flatten them.
  const match = source.match(/data:image\\?\/\(([^)]+)\)/);
  if (!match) return [];
  return match[1]!
    .split("|")
    .map((family) => family.replace(/\\\+/g, "+"))
    .flatMap((family) => (family === "jpe?g" ? ["jpeg", "jpg"] : [family]))
    .sort();
}

describe("the image-fill whitelist parity (session 56, S56-E / M-4)", () => {
  it("the client checks a MIME-family whitelist (not a bare data:image/ prefix)", () => {
    // The read-time check is a family-whitelist regex literal in source…
    expect(panelSource).toContain("data:image\\/(png|jpe?g|gif|svg\\+xml|webp);base64,/");
    // …and the loose startsWith check is gone from the read path.
    expect(panelSource).not.toMatch(/dataUrl\.startsWith\("data:image\/"\)/);
  });

  it("the client and server accept the SAME five families", () => {
    expect(familiesOf(panelSource)).toEqual(familiesOf(routeSource));
    expect(familiesOf(panelSource)).toEqual(["gif", "jpeg", "jpg", "png", "svg+xml", "webp"]);
  });
});
