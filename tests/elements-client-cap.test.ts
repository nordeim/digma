import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The client-side element cap (session 61, S61-F — the ninth Mode C
// audit's A-L-5, the residual half of S60-D's B-L-2).
//
// S60-D capped the elements POST route; the PUT route already capped
// the list. But the CLIENT add path (editor-store addElements — the
// canvas draw commit, the text tool's immediate-add, the AI add
// branch) had no cap: crossing 2000 client-side wedged every
// subsequent autosave PUT in a 400-retry loop — the design became
// unsavable until the user deleted back below the ceiling.
//
// The fix: src/lib/editor.ts exports ELEMENT_LIMIT = 2000 (the single
// seam — the route imports it too), addElements clamps to the room
// left under the limit with an honest return, the addElement wrapper
// widens to string | null, and the AI add branch counts `applied` only
// when ids came back.

const editorLibSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const storeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-store.ts"),
  "utf8",
);
const routeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);
const aiSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);

describe("the client-side element cap (session 61, S61-F / A-L-5)", () => {
  it("lib/editor.ts exports the ELEMENT_LIMIT seam (2000)", () => {
    // THE DEFECT PIN: pre-fix the limit existed only as route literals.
    expect(editorLibSource).toMatch(/export const ELEMENT_LIMIT = 2000;/);
  });

  it("addElements clamps to the room left under the limit with an honest return", () => {
    // THE DEFECT PIN: pre-fix addElements appended unconditionally.
    const start = storeSource.indexOf("addElements: (partials) => {");
    expect(start).toBeGreaterThan(-1);
    const end = storeSource.indexOf("return created.map((el) => el.id);", start);
    const body = storeSource.slice(start, end);
    expect(body).toMatch(/ELEMENT_LIMIT\s*-\s*state\.elements\.length/);
    expect(body).toMatch(/partials\.slice\(/);
  });

  it("the elements route imports the shared seam (one source of truth with the client)", () => {
    // THE DEFECT PIN: pre-fix the route carried bare 2000 literals.
    expect(routeSource).toMatch(/import \{[^}]*ELEMENT_LIMIT[^}]*\} from "@\/lib\/editor";/);
    expect(routeSource).not.toMatch(/count >= 2000/);
    expect(routeSource).not.toMatch(/list\.length > 2000/);
  });

  it("the AI add branch counts applied only when the store actually added", () => {
    // THE DEFECT PIN: pre-fix the branch incremented applied
    // unconditionally after store.addElements([partial]).
    const start = aiSource.indexOf('if (operation.op === "add") {');
    expect(start).toBeGreaterThan(-1);
    const end = aiSource.indexOf('} else if (operation.op === "update") {', start);
    const branch = aiSource.slice(start, end);
    expect(branch).toMatch(/const addedIds = store\.addElements\(\[partial\]\);/);
    expect(branch).toMatch(/if \(addedIds\.length > 0\) applied \+= 1;/);
  });
});
