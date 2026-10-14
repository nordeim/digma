import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-129 spec (the seventy-seventh audit's chosen work):
//
// S129-A — THE SLIDERS' KEYBOARD ARM (A129-L1 — the Low the
//   seventy-seventh audit's editor-side auditor found): every range
//   input's gesture terminal was pointer-bound only — a
//   keyboard-driven change (the arrow keys with OS key-repeat,
//   PageUp/PageDown, Home/End) fired onChange with NO gesture armed,
//   and the gesture-aware update committed a FULL history snapshot +
//   redo wipe PER KEYPRESS: holding an arrow across a 0-100 slider
//   evicted the entire 60-deep past stack in seconds (the S62-A
//   flooding class through the one dispatch surface the pointer seam
//   never covered). The closure: a keyTick primitive composed on
//   armText (the begin-on-demand + foreign-ride bookkeeping + the
//   idle re-arm), armed at keydown (which precedes the input's value
//   change), marked by the onChange's existing tick, terminated by
//   the 150ms idle — a key-repeat burst coalesces into ONE entry. NO
//   blur terminal (a blur mid-pointer-drag would pass the
//   same-surface token check and end the live drag's gesture — the
//   S126-B class); the live-pointer-drag discrimination at keyTick's
//   head (`activeSurface === surface && idleTimer === null` → return)
//   keeps the idle from re-arming mid-drag (the S123-C lesson).
//
// S129-B — THE DEAD moved FLAG RETIRED (A129-I1): S128-B's
//   unconditional endGesture removed the DragState move/resize
//   members' `moved?: boolean` flag's last reader — it had been
//   write-only since. The retirement: the two type fields and the
//   two writes deleted, the orphaning registered at the type seam
//   (the dead-member convention — the S72-D dead parameter, the
//   S100-D dead width prop, the S63-G dead avatar-color field).
//
// S129-C — THE SEED'S HASH HOIST (B129-I1): the S128-E rewrite
//   placed hashPassword() inside the interactive $transaction
//   callback — the exact shape register's own S83-D fix moved OUT of
//   the writer window ("sync CPU work inside the SQLite writer
//   window; the hash has no transaction dependency"). The hoist:
//   computed before the wrap, referenced in the create data.
//
// S129-D — THE ELEMENTS POST BY-DESIGN NOTE (B129-I2): the POST's
//   catch documents its P2003 and P2024/P2028 arms but never the
//   P2025 arm's absence — while every sibling with an absent arm
//   documents WHY at the seam (the verify-otp sibling's form). The
//   absence is sound (the inner tx.project.update runs only after
//   the FK-checked tx.designElement.create; SQLite's serialized
//   writers mean the vanished-project race always answers P2003 at
//   the create first) — the note names the reasoning so a future tx
//   body edit cannot silently inherit an unguarded window.
//
// The script family (the S118-C convention, s129 form): the s129
//   parity scripts ride their OWN tokens (live129 / nav129 /
//   digma-seo-s129.log, the 105th audit / 106th session / 66th clip
//   ordinals, the S128 delivery at HEAD 5322b3b), never the frozen
//   s128 forms.

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const seedSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/seed.ts"),
  "utf8",
);
const elementsSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);
const refAudit129Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s129.sh"),
  "utf8",
);
const nav129Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s129.sh"),
  "utf8",
);
const seo129Source = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s129.sh"),
  "utf8",
);

describe("lows-s129 — the seventy-seventh audit's chosen work", () => {
  // ---- S129-A: the sliders' keyboard arm --------------------------------

  it("DEFECT (source): the keyTick primitive — the keyboard arm composed on armText, with the live-pointer-drag discrimination at its head", () => {
    expect(panelSource).toMatch(
      /keyTick: \(surface: string\) => \{\s*\n\s*if \(activeSurface === surface && idleTimer === null\) return;\s*\n\s*armText\(surface\);\s*\n\s*\},/,
    );
  });

  it("DEFECT (source): the keyTick registration names the A129-L1 class — the per-keypress flooding, the idle terminal, the no-blur trade, the mid-drag discrimination", () => {
    const textTickAt = panelSource.indexOf('textTick: (surface: string = "text") => {');
    expect(textTickAt).toBeGreaterThan(-1);
    const keyTickAt = panelSource.indexOf("keyTick: (surface: string) => {");
    expect(keyTickAt).toBeGreaterThan(textTickAt);
    // The registration comment sits between textTick's family and the
    // new primitive — the only place these tokens live.
    const registration = panelSource.slice(textTickAt, keyTickAt);
    expect(registration).toMatch(/A129-L1/);
    expect(registration).toMatch(/keyboard/i);
    expect(registration).toMatch(/per\s+keypress/i);
    expect(registration).toMatch(/S62-A/);
    expect(registration).toMatch(/S126-B/);
    expect(registration).toMatch(/S123-C/);
  });

  it("DEFECT (source): the SLIDER_KEYS module const — exactly the eight value-changing keys, consumed by the keyboard arm", () => {
    expect(panelSource).toMatch(/const SLIDER_KEYS = new Set\(\[/);
    for (const key of [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
    ]) {
      expect(panelSource).toContain(`"${key}"`);
    }
    expect(panelSource).toMatch(/SLIDER_KEYS\.has\(event\.key\)/);
  });

  it("DEFECT (source): the shared SliderRow's range input carries the keyboard arm — the slider:${label} template form", () => {
    const start = panelSource.indexOf("function SliderRow(");
    expect(start).toBeGreaterThan(-1);
    const end = panelSource.indexOf("function ", start + 10);
    const body = panelSource.slice(start, end);
    expect(body).toMatch(
      /onKeyDown=\{\(event\) => \{\s*\n\s*if \(SLIDER_KEYS\.has\(event\.key\)\) sliderGesture\.keyTick\(`slider:\$\{label\}`\);\s*\n\s*\}\}/,
    );
  });

  it("DEFECT (source): the four inline range inputs carry the keyboard arm — the per-section literal tokens", () => {
    for (const label of ["Gradient angle", "Rotation", "Scale", "Opacity"]) {
      const idx = panelSource.indexOf(`aria-label="${label}"`);
      expect(idx).toBeGreaterThan(-1);
      // The handler bundle sits on the SAME input element as the label.
      const inputStart = panelSource.lastIndexOf("<input", idx);
      const inputEnd = panelSource.indexOf("onChange=", idx);
      const input = panelSource.slice(inputStart, inputEnd);
      expect(input).toMatch(
        new RegExp(
          `onKeyDown=\\{\\(event\\) => \\{[\\s\\S]*?sliderGesture\\.keyTick\\("slider:${label}"\\);[\\s\\S]*?\\}\\}`,
        ),
      );
    }
  });

  // ---- S129-B: the dead moved flag retired ------------------------------

  it("DEFECT (source): the DragState moved flag is RETIRED — the type fields gone, both writes gone, the S129-B registration at the type seam", () => {
    expect(canvasSource).not.toMatch(/moved\?: boolean/);
    expect(canvasSource).not.toMatch(/moved: true/);
    // The registration names the S128-B orphaning (the dead-member
    // retirement convention).
    const typeAt = canvasSource.indexOf("type DragState =");
    expect(typeAt).toBeGreaterThan(-1);
    const registration = canvasSource.slice(Math.max(0, typeAt - 1400), typeAt);
    expect(registration).toMatch(/S129-B/);
    expect(registration).toMatch(/A129-I1/);
    expect(registration).toMatch(/write-only/i);
  });

  // ---- S129-C: the seed's hash hoist ------------------------------------

  it("DEFECT (source): the seed's scrypt hash computed BEFORE the transaction — register's S83-D form, the S129-C registration", () => {
    const hoistAt = seedSource.indexOf('const demoPasswordHash = hashPassword("Digma1234!");');
    expect(hoistAt).toBeGreaterThan(-1);
    const txAt = seedSource.indexOf("db.$transaction(");
    expect(txAt).toBeGreaterThan(hoistAt);
    expect(seedSource).toContain("passwordHash: demoPasswordHash,");
    // The hash call no longer sits inside the transaction callback.
    const callbackStart = seedSource.indexOf("async (tx) => {", txAt);
    expect(callbackStart).toBeGreaterThan(-1);
    const refAt = seedSource.indexOf("passwordHash: demoPasswordHash", callbackStart);
    expect(refAt).toBeGreaterThan(callbackStart);
    const callback = seedSource.slice(callbackStart, refAt);
    expect(callback).not.toContain("hashPassword(");
    expect(seedSource).toMatch(/S129-C/);
  });

  // ---- S129-D: the elements POST by-design note -------------------------

  it("DEFECT (source): the elements POST catch documents the by-design-absent P2025 arm — the verify-otp sibling's form, the S129-D registration", () => {
    const postAt = elementsSource.indexOf("export async function POST");
    expect(postAt).toBeGreaterThan(-1);
    const catchAt = elementsSource.indexOf("} catch (error) {", postAt);
    expect(catchAt).toBeGreaterThan(postAt);
    const p2003At = elementsSource.indexOf("P2003", catchAt);
    expect(p2003At).toBeGreaterThan(catchAt);
    const note = elementsSource.slice(catchAt, p2003At);
    expect(note).toMatch(/P2025 arm stays absent BY DESIGN/);
    expect(note).toMatch(/S129-D/);
  });

  // ---- SURVIVAL: the S128 seams keep their forms ------------------------

  it("SURVIVAL (source): the S128-A pan-modality refusal verbatim — after the entry guard, before the button gate", () => {
    const downAt = canvasSource.indexOf("onPointerDown={(event) => {");
    expect(downAt).toBeGreaterThan(-1);
    const beginAt = canvasSource.indexOf("useEditorStore.getState().beginGesture();", downAt);
    expect(beginAt).toBeGreaterThan(downAt);
    const head = canvasSource.slice(downAt, beginAt);
    const stopAt = head.indexOf("event.stopPropagation();");
    const entryAt = head.indexOf('if (drag.kind !== "none") return;');
    const panAt = head.indexOf("if (isPanning()) return;");
    const buttonAt = head.indexOf("if (event.button !== 0) return;");
    expect(stopAt).toBeGreaterThan(-1);
    expect(entryAt).toBeGreaterThan(stopAt);
    expect(panAt).toBeGreaterThan(entryAt);
    expect(buttonAt).toBeGreaterThan(panAt);
  });

  it("SURVIVAL (source): the S128-B unconditional endGesture verbatim — the drag.moved discrimination and the cancelGesture branch stay GONE", () => {
    const armAt = canvasSource.indexOf('} else if (drag.kind === "move" || drag.kind === "resize") {');
    expect(armAt).toBeGreaterThan(-1);
    const endAt = canvasSource.indexOf('setDrag({ kind: "none" });', armAt);
    expect(endAt).toBeGreaterThan(armAt);
    const arm = canvasSource.slice(armAt, endAt);
    expect(arm).toContain("store.endGesture();");
    expect(arm).not.toContain("store.cancelGesture();");
    expect(arm).not.toMatch(/if \(drag\.moved\)/);
  });

  it("SURVIVAL (source): the S128-E seed transactional wipe verbatim — the $transaction wrap, the tx. writes, the 30s timeout", () => {
    expect(seedSource).toMatch(/db\.\$transaction\(/);
    expect(seedSource).toMatch(/timeout: 30_000/);
    expect(seedSource).toMatch(/tx\.designElement\.deleteMany/);
    expect(seedSource).toMatch(/tx\.user\.create/);
    expect(seedSource).toMatch(/tx\.project\.create/);
    expect(seedSource).toMatch(/tx\.teamMember\.create/);
    expect(seedSource).toMatch(/S128-E/);
  });

  it("SURVIVAL (scripts): the s129 parity scripts carry their OWN tokens — live129, the 105th audit, the 66th clip, the S128 delivery at HEAD 5322b3b", () => {
    expect(refAudit129Source).toContain("live129");
    expect(refAudit129Source).toContain("105th reference audit");
    expect(refAudit129Source).toContain("the 66th");
    expect(refAudit129Source).toContain("5322b3b");
    expect(refAudit129Source).not.toContain("live128");
    expect(nav129Source).toContain("nav129");
    expect(nav129Source).toContain("106th session");
    expect(nav129Source).not.toContain("nav128");
    expect(seo129Source).toContain("digma-seo-s129.log");
    expect(seo129Source).toContain("session 129, S129-cycle");
  });
});
