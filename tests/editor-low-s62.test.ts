import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The editor Low batch (session 62, S62-F — the tenth audit's A-L1 +
// A-L3 + A-L4 + A-L5).
//
// A-L1: the keepalive body guard measured UTF-16 CODE UNITS
// (`payload.length > 60_000`), not bytes — a CJK/emoji-heavy body
// under 60,000 units can exceed Chromium's 64KB keepalive BYTE cap,
// pass the guard, and be silently rejected by the browser. THE FIX:
// `new Blob([payload]).size` measures bytes.
//
// A-L3: the two canvas cap-refused toasts hardcoded the literal
// "2000" — the S61-F design is ONE source of truth (ELEMENT_LIMIT);
// the honest message interpolates the seam.
//
// A-L4: the deterministic add-reply overclaimed at the ceiling — at
// 1,998 elements "Add 3 circles" creates 2, the footer honestly reads
// "2 action(s) performed", but the reply asserted "Added 3 circles."
// THE FIX: the client apply seam annotates the reply when applied <
// operations.length.
//
// A-L5: the dead `setName` store action — zero callers (grep), and
// the PUT body never carries the name; any future caller would flip
// unsaved, save, and silently never persist (the S60-A bug shape).
// THE FIX: deleted.

const viewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const aiComponentSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);

describe("the editor Low batch (session 62, S62-F)", () => {
  it("A-L1: the keepalive body guard measures BYTES (Blob.size), not code units", () => {
    // THE DEFECT PIN: pre-fix the guard was
    //   if (payload.length > 60_000) return;
    // — code units, not bytes.
    expect(viewSource).toMatch(/if \(new Blob\(\[payload\]\)\.size > 60_000\) return;/);
    expect(viewSource).not.toMatch(/if \(payload\.length > 60_000\) return;/);
  });

  it("A-L3: the canvas cap toasts interpolate the ELEMENT_LIMIT seam (no literal)", () => {
    // THE DEFECT PIN: pre-fix both sites read
    //   `Boards hold at most 2000 elements.`
    const count = canvasSource.match(/Boards hold at most \$\{ELEMENT_LIMIT\} elements\./g) ?? [];
    expect(count.length).toBe(2);
    expect(canvasSource).not.toMatch(/Boards hold at most 2000 elements\./);
    // The import exists (the seam is actually referenced, not just
    // interpolated from elsewhere).
    expect(canvasSource).toMatch(/import \{[^}]*\bELEMENT_LIMIT\b[^}]*\} from "@\/lib\/editor";/);
  });

  it("A-L4: the AI apply seam annotates the reply when the cap refused part of the batch", () => {
    // THE DEFECT PIN: pre-fix the reply asserted the requested count
    // regardless of what actually landed.
    // Session 105 (S105-B — a legitimate contract update): the import
    // grew clampSizeField + patchDiffers (the per-target truth block's
    // seams) — the ELEMENT_LIMIT member stays.
    expect(aiComponentSource).toMatch(
      /const capped =\s*\n?\s*actionCount < operations\.length &&\s*\n?\s*useEditorStore\.getState\(\)\.elements\.length >= ELEMENT_LIMIT;/,
    );
    expect(aiComponentSource).toMatch(/the board is at its element limit/);
    expect(aiComponentSource).toMatch(
      /import \{ ELEMENT_LIMIT, clampSizeField, patchDiffers, type DesignElementDTO \} from "@\/lib\/editor";/,
    );
  });

  it("A-L5: the dead setName action is gone from the store", () => {
    // THE DEFECT PIN: pre-fix the store carried the dead action (the
    // latent persistence trap).
    expect(storeSource).not.toMatch(/setName: \(/);
    expect(storeSource).not.toMatch(/setName: \(name\)/);
  });
});
