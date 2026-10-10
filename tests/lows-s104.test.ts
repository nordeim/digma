import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as editorLib from "../src/lib/editor";

// The session-104 spec (the fifty-second audit's chosen work):
//
// S104-A — the no-op commit family's SEVENTH MEMBER (A-M1, the
//   headline): every number field (X/Y/W/H, Font Size, the four
//   corner-radius inputs, Rotation, Opacity, the gradient stop
//   positions) committed same-value retypes and clamp-identity
//   patches unguarded — the pure retype (select-all + retype of the
//   current value) and the clamp-identity form (typing 500000 into an
//   X field already at the 100000 ceiling) both armed the gesture,
//   landed an INERT history snapshot at the blur/idle terminal,
//   wiped redo, flipped the badge to a phantom Unsaved, and PUT a
//   byte-identical list. The S102-E/S103-A doctrine reaches the
//   numeric surfaces through a three-layer fix: the component guard
//   (`parsed !== value`), the gesture's arm/mark split (the arm keeps
//   its before-commit ordering so the snapshot captures the
//   pre-change state; the mark lands only after the consumer reports
//   a real commit — the blur/idle terminal's existing
//   changed ? endGesture : cancelGesture discrimination holds), and
//   the consumer layer riding the ONE patchDiffers seam through the
//   shared guardedUpdate helper. The Content input's onChange gains
//   its own blur path's same-value guard (the paste-identical text).
//
// S104-B — the stop-swatch short-hex expansion (A-L1): the A99-I1
//   class's missed surface — a stored 3-digit stop hex rendered the
//   swatch BLACK beside its truthful position row.
//
// S104-C — the canvas-background datum fold (A-L3): "#0D1117"
//   hand-spelled at eight sites (the store initial, UNTITLED_PROJECT,
//   the export fallback, the create-route default, the presets[0]
//   entry, the dialog's four belt fallbacks) — the FALLBACK_WHITE
//   class's own datum never got its fold.
//
// S104-D — the thumb-white token indirection (A-L2): the .editor-range
//   thumb's `background: #fff` duplicated the consumed --color-white
//   token the S95-A sweep never reached; the token joins @theme
//   explicitly and both thumbs consume it (the theme test's literal
//   pin re-anchors to the token form — the count family's forcing
//   function, documented in-place).
//
// S104-E — the register order swap (B-L1): the email FORMAT regex ran
//   before the O(1) length caps on the one public pre-auth route —
//   forgot-password's length-first order is the family's contract.
//
// S104-F — the E2E fallback derivation (B-L2): the seven spec
//   derivation sites hardcoded `:3100` in the fallback while the config
//   derives from E2E_PORT — an E2E_PORT-only override orphaned all
//   seven request-context specs against a dead port.
//
// S104-G — the skill-doc count repair (B-L3): "40 spec files" was
//   39 (40 only by counting the setup file — the F78 count-truth
//   class at the §12 cheat-sheet's own inline form).
//
// S104-H — the capture shot() fail-loud (B-L4): the S102-A curl-trio
//   discipline never reached the screenshot family — a failed or
//   0-byte capture write passed silently through the `;` sequencing.
//
// S104-I — the smalls fold (A-I1 + A-I2 + A-I3/B-I1): the
//   PresentOverlay's border truthy form, the EXPORT_SCALE dead
//   export, and the three type-alias dead exports.
//
// The S104 delivered counts — this file's 20 pins grow the suite
// 1312 -> 1332 unit / 165 -> 166 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1
// Unit-total row — so the whole family moves together in the same
// commit).
const UNIT = "1382";
const FILES = "169";

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

const PANEL = src("src/components/editor/properties-panel.tsx");
const EDITOR_VIEW = src("src/components/editor/editor-view.tsx");
const EDITOR_STORE = src("src/components/editor/editor-store.ts");
const EDITOR_LIB = src("src/lib/editor.ts");
const EXPORT_PNG = src("src/lib/export-png.ts");
const PROJECTS_ROUTE = src("src/app/api/projects/route.ts");
const PROJECT_CARD = src("src/components/project-card.tsx");
const GLOBALS = src("src/app/globals.css");
const REGISTER = src("src/app/api/auth/register/route.ts");
const SANITIZER = src("src/lib/ai-assistant.ts");
const SKILL = src("digma_SKILL.md");
const PAD = src("Project_Architecture_Document.md");
const AGENTS = src("AGENTS.md");
const VALIDATION = src("src/lib/validation.ts");

/** The rendered window of a named function component in the panel source. */
function componentWindow(name: string): string {
  const start = PANEL.indexOf(`function ${name}(`);
  expect(start).toBeGreaterThan(-1);
  const next = PANEL.indexOf("\nfunction ", start + 1);
  return PANEL.slice(start, next === -1 ? undefined : next);
}

describe("S104-A the number-field no-op commits (A-M1 — the headline, the family's seventh member)", () => {
  it("DEFECT: both number-input components carry the same-value guard — a retype of the current value never arms, never commits", () => {
    // RED pre-fix: the committing branch read
    // `if (Number.isFinite(parsed))` alone — the pure retype (the
    // draft already tells the truth about the committed value, the
    // S99-A doctrine) still armed the gesture and committed the
    // structurally identical patch.
    const guards = PANEL.match(/Number\.isFinite\(parsed\) && parsed !== value/g);
    expect(guards?.length).toBe(2);
    for (const name of ["NumberField", "GuardedNumberInput"]) {
      const w = componentWindow(name);
      expect(w).toMatch(/Number\.isFinite\(parsed\) && parsed !== value/);
    }
  });

  it("DEFECT: the arm/mark split — the gesture arms BEFORE the commit and marks only on a real commit", () => {
    // RED pre-fix: textTick coupled the arm and the changed-flag — a
    // clamp-identity commit (parsed 500000 clamped back to the current
    // 100000) armed the burst with changed=true, so the blur/idle
    // terminal ran endGesture and pushed the INERT pre-gesture
    // snapshot. The split: armText keeps the before-commit ordering
    // (the snapshot captures the pre-change state); markText lands
    // only when the consumer reports a real commit (the terminal's
    // existing changed ? endGesture : cancelGesture discrimination).
    for (const name of ["NumberField", "GuardedNumberInput"]) {
      const w = componentWindow(name);
      expect(w).toMatch(/sliderGesture\.armText\("field"\)/);
      const armIdx = w.indexOf('sliderGesture.armText("field")');
      const commitIdx = w.indexOf("onChange(parsed)");
      const markIdx = w.indexOf("sliderGesture.markText()");
      expect(armIdx).toBeGreaterThan(-1);
      expect(commitIdx).toBeGreaterThan(armIdx);
      expect(markIdx).toBeGreaterThan(commitIdx);
      expect(w).toMatch(/committed !== false/);
    }
  });

  it("DEFECT: the closure exports the armText/markText primitives and textTick delegates to both (the composition)", () => {
    // RED pre-fix: textTick was the only spelling of the text-path
    // arm — the number fields could not arm without marking.
    expect(PANEL).toMatch(/const armText = \(surface: string = "text"\) => \{/);
    expect(PANEL).toMatch(/const markText = \(\) => \{/);
    expect(PANEL).toMatch(/const markText = \(\) => \{[^}]*changed = true/);
    // textTick = armText + markText — the Content input and the
    // swatches keep their wiring byte-identical through the
    // composition.
    const start = PANEL.indexOf('textTick: (surface: string = "text") => {');
    expect(start).toBeGreaterThan(-1);
    const end = PANEL.indexOf("},", start);
    const body = PANEL.slice(start, end);
    expect(body).toMatch(/armText\(surface\)/);
    expect(body).toMatch(/markText\(\)/);
    // the arm bookkeeping moved with the primitive — the owning
    // surface is captured at ARM time (the S65-C contract survives
    // the split).
    const armStart = PANEL.indexOf('const armText = (surface: string = "text") => {');
    const armEnd = PANEL.indexOf("};", armStart);
    const armBody = PANEL.slice(armStart, armEnd);
    expect(armBody).toMatch(/activeSurface = surface/);
  });

  it("DEFECT: the guardedUpdate helper rides the ONE patchDiffers seam", () => {
    // RED pre-fix: no helper existed — every number-field consumer
    // called update unconditionally, so the clamp-identity form
    // (parsed beyond the clamp ceiling mapping back to the current
    // value) committed a structurally identical patch.
    expect(PANEL).toMatch(/function guardedUpdate\(/);
    const start = PANEL.indexOf("function guardedUpdate(");
    const end = PANEL.indexOf("\n};", start);
    const body = PANEL.slice(start, end);
    expect(body).toMatch(/patchDiffers\(element, patch\)/);
    expect(body).toMatch(/return true/);
    expect(body).toMatch(/return false/);
  });

  it("DEFECT: the element-patch consumers route through the guarded helper (the thirteen controls)", () => {
    // RED pre-fix: the consumers read
    // `onChange={(x) => update({ x: clampPositionField(x) })}` — the
    // patch construction was unconditional.
    expect(PANEL).toMatch(/onChange=\{\(x\) => patch\(\{ x: clampPositionField\(x\) \}\)\}/);
    expect(PANEL).toMatch(/onChange=\{\(y\) => patch\(\{ y: clampPositionField\(y\) \}\)\}/);
    expect(PANEL).toMatch(/onChange=\{\(width\) => patch\(\{ width: clampSizeField\(width, element\.type\) \}\)\}/);
    expect(PANEL).toMatch(/onChange=\{\(height\) => patch\(\{ height: clampSizeField\(height, element\.type\) \}\)\}/);
    expect(PANEL).toMatch(/patch\(\{ fontSize: clampFontSizeField\(fontSize\) \}\)/);
    expect(PANEL).toMatch(/patch\(\{ rotation: Math\.min\(Math\.max\(rotation, -180\), 180\) \}\)/);
    expect(PANEL).toMatch(/patch\(\{ opacity: Math\.min\(Math\.max\(value, 0\), 100\) \/ 100 \}\)/);
    expect(PANEL.match(/patch\(\{ radius: Math\.min\(Math\.max\(radius, 0\), cornerRadiusMax\(element\)\) \}\)/g)?.length).toBe(4);
    // the old unguarded forms are gone from the number-field consumers
    expect(PANEL).not.toMatch(/update\(\{ x: clampPositionField/);
    expect(PANEL).not.toMatch(/update\(\{ fontSize: clampFontSizeField/);
    expect(PANEL).not.toMatch(/update\(\{ rotation: Math\.min/);
    expect(PANEL).not.toMatch(/update\(\{ opacity: Math\.min/);
  });

  it("DEFECT: the gradient stop position compares through the seam before the stop patch", () => {
    // RED pre-fix: the stop-position consumer called setStop
    // unconditionally — a clamp-identity position (typing 200 into a
    // stop already at 100) committed a structurally identical
    // gradient (the serialized fillGradient identical).
    const start = PANEL.indexOf("label={`Stop ${index + 1} position`}");
    expect(start).toBeGreaterThan(-1);
    const end = PANEL.indexOf("/>", start);
    const body = PANEL.slice(start, end);
    expect(body).toMatch(/patchDiffers\(stop, \{ position: next \}\)/);
    expect(body).toMatch(/setStop\(index, \{ position: next \}\)/);
    expect(body).toMatch(/return true/);
    expect(body).toMatch(/return false/);
  });

  it("DEFECT: the Content input's onChange carries its blur path's own same-value guard", () => {
    // RED pre-fix: the typing path committed paste-identical text
    // (`update({ text: event.target.value })` with no compare) while
    // its own BLUR path already carried the `clamped !== (element.text
    // ?? "")` guard — the doctrine reached the blur only.
    const anchor = PANEL.indexOf('aria-label="Text content"');
    expect(anchor).toBeGreaterThan(-1);
    const start = PANEL.lastIndexOf("onChange={(event) => {", anchor);
    const end = PANEL.indexOf("}}", start);
    const body = PANEL.slice(start, end);
    expect(body).toMatch(/event\.target\.value !== \(element\.text \?\? ""\)/);
    const guardIdx = body.indexOf('event.target.value !== (element.text ?? "")');
    const tickIdx = body.indexOf("sliderGesture.textTick()");
    const commitIdx = body.indexOf("update({ text: event.target.value })");
    expect(guardIdx).toBeGreaterThan(-1);
    expect(tickIdx).toBeGreaterThan(guardIdx);
    expect(commitIdx).toBeGreaterThan(tickIdx);
  });

  it("SURVIVAL: the six S103 guard forms stay and the census grows to EIGHT (the helper + the stop position)", () => {
    // GREEN by design post-fix: the S102-E five + the S103-A
    // gradient-stop button = six stay; the guardedUpdate helper's one
    // call + the stop position's one call grow the census to eight.
    // Session 105 (S105-A / A-M1): the stop COLOR swatch joins the seam
    // — the census grows to NINE (the legitimate contract update; the
    // pre-S105 census closed at the number/position members while the
    // color-picker modality survived — lesson F92's very form).
    // Session 106 (S106-A / A-M1): the upload commit helper joins the
    // seam — the census grows to TEN (the file-input channel, the
    // member that lived outside the control census entirely).
    const guarded = PANEL.match(/patchDiffers\(/g);
    expect(guarded?.length).toBe(10);
    expect(PANEL).toMatch(/patchDiffers\(element, \{ textAlign: align \}\)/);
    expect(PANEL).toMatch(/patchDiffers\(gradient, \{ type: "linear" \}\)/);
    expect(PANEL).toMatch(/patchDiffers\(gradient, \{ type: "radial" \}\)/);
    expect(PANEL).toMatch(/patchDiffers\(element, \{ fontFamily \}\)/);
    expect(PANEL).toMatch(/patchDiffers\(element, \{ fillImageFit: fit \}\)/);
    expect(PANEL).toMatch(/patchDiffers\(gradient, \{ stops \}\)/);
    // the pure seam still discriminates a real patch from a no-op
    expect(editorLib.patchDiffers).toBeDefined();
    expect(editorLib.patchDiffers({ x: 1 }, { x: 1 })).toBe(false);
    expect(editorLib.patchDiffers({ x: 1 }, { x: 2 })).toBe(true);
  });
});

// ---------------------------------------------------------------------------

describe("S104-B the stop-swatch short-hex expansion (A-L1)", () => {
  it("DEFECT: the gradient-stop swatch binds the expanded hex (the S99-E form at the missed surface)", () => {
    // RED pre-fix: `value={stop.color}` — a stored 3-digit stop hex
    // (clampColor passes "#abc" verbatim) coerced the swatch to BLACK
    // (input[type=color] renders non-#rrggbb as #000000) beside its
    // truthful position row, while the gradient itself painted
    // correctly (CSS accepts the short form).
    const start = PANEL.indexOf('aria-label={`Stop ${index + 1} color`}');
    expect(start).toBeGreaterThan(-1);
    const end = PANEL.indexOf("/>", start);
    const body = PANEL.slice(start, end);
    expect(body).toMatch(/value=\{expandShortHex\(stop\.color\) \?\? "#000000"\}/);
  });
});

// ---------------------------------------------------------------------------

describe("S104-C the canvas-background datum fold (A-L3)", () => {
  it("DEFECT: DEFAULT_CANVAS_BACKGROUND is exported from editor.ts and the presets[0] entry consumes it", () => {
    // RED pre-fix: the datum was hand-spelled at eight sites with no
    // named constant — the FALLBACK_WHITE class's own datum.
    expect(EDITOR_LIB).toMatch(/export const DEFAULT_CANVAS_BACKGROUND = "#0D1117";/);
    expect(EDITOR_LIB).toMatch(/\{ title: "Dark", value: DEFAULT_CANVAS_BACKGROUND \}/);
    expect(editorLib.DEFAULT_CANVAS_BACKGROUND).toBe("#0D1117");
  });

  it("DEFECT: the true-default sites consume the constant (store, UNTITLED, export, create route, dialog belts)", () => {
    // RED pre-fix: every site carried the independent literal.
    expect(EDITOR_STORE).toMatch(/backgroundColor: DEFAULT_CANVAS_BACKGROUND,/);
    expect(EDITOR_VIEW).toMatch(/backgroundColor: DEFAULT_CANVAS_BACKGROUND,/);
    expect(EXPORT_PNG).toMatch(/options\.backgroundColor \?\? DEFAULT_CANVAS_BACKGROUND/);
    expect(PROJECTS_ROUTE).toMatch(/DEFAULT_CANVAS_BACKGROUND/);
    expect(PROJECTS_ROUTE).not.toMatch(/"#0D1117"/);
    expect(PROJECT_CARD.match(/CANVAS_BACKGROUND_PRESETS\[0\]\?\.value \?\? DEFAULT_CANVAS_BACKGROUND/g)?.length).toBe(3);
    expect(PROJECT_CARD).toMatch(/useState\(DEFAULT_CANVAS_BACKGROUND\)/);
    // the sanitizer's default param keeps its literal with the
    // provenance comment (the circular-import constraint — editor.ts
    // imports validation.ts; the S95-A comment precedent)
    expect(VALIDATION).toMatch(/DEFAULT_CANVAS_BACKGROUND in editor\.ts/);
    // the raw literals are gone from the true-default sites
    expect(EDITOR_STORE).not.toMatch(/"#0D1117"/);
    expect(EDITOR_VIEW).not.toMatch(/"#0D1117"/);
    expect(EXPORT_PNG).not.toMatch(/"#0D1117"/);
  });
});

// ---------------------------------------------------------------------------

describe("S104-D the thumb-white token indirection (A-L2)", () => {
  it("DEFECT: --color-white joins @theme explicitly and both thumb rules consume the token", () => {
    // RED pre-fix: the thumbs carried `background: #fff` — the exact
    // value the default --color-white token declares while bg-white /
    // text-white consume it live at 52+ sites (the S95-A sweep
    // enumerated only its own family). A future re-pin of white would
    // edit every utility site and silently miss the sliders.
    expect(GLOBALS).toMatch(/--color-white:\s*#ffffff;/);
    // (Pin design repair, mid-RED: the alternation's webkit branch
    // carries its leading dash — the pseudo is ::-webkit-slider-thumb.)
    const thumbs = GLOBALS.match(/\.editor-range::(?:-webkit-slider-thumb|-moz-range-thumb) \{[^}]*\}/g);
    expect(thumbs?.length).toBe(2);
    for (const thumb of thumbs ?? []) {
      expect(thumb).toMatch(/background:\s*var\(--color-white\)/);
    }
    expect(GLOBALS).not.toMatch(/background:\s*#fff;/);
  });
});

// ---------------------------------------------------------------------------

describe("S104-E the register order swap (B-L1)", () => {
  it("DEFECT: the length caps reject BEFORE the format regex (forgot-password's order)", () => {
    // RED pre-fix: the regex at :33 scanned first and the O(1)
    // length rejection at :41 second — the family's order outlier on
    // the one public route an attacker drives pre-auth.
    const caps = REGISTER.indexOf("must be reasonably sized");
    const format = REGISTER.indexOf("Enter a valid email address");
    expect(caps).toBeGreaterThan(-1);
    expect(format).toBeGreaterThan(-1);
    expect(caps).toBeLessThan(format);
  });
});

// ---------------------------------------------------------------------------

describe("S104-F the E2E fallback derivation (B-L2)", () => {
  it("DEFECT: all seven spec derivation sites derive the fallback from E2E_PORT (no orphaned port)", () => {
    // RED pre-fix: every site read
    // `process.env.E2E_BASE_URL ?? "http://localhost:3100"` — an
    // E2E_PORT-only override booted the webServer elsewhere while the
    // seven request-context specs pointed at the dead port.
    const specs = [
      "tests/e2e/auth.spec.ts",
      "tests/e2e/session58-fixes.spec.ts",
      "tests/e2e/session60-fixes.spec.ts",
      "tests/e2e/session61-fixes.spec.ts",
      "tests/e2e/session85-fixes.spec.ts",
      "tests/e2e/export-png.spec.ts",
      "tests/e2e/mobile-properties.spec.ts",
    ];
    for (const rel of specs) {
      const text = src(rel);
      expect(text, rel).not.toMatch(/\?\? "http:\/\/localhost:3100"/);
      expect(text, rel).toMatch(/E2E_BASE_URL \?\? `http:\/\/localhost:\$\{process\.env\.E2E_PORT \?\? 3100\}`/);
    }
  });
});

// ---------------------------------------------------------------------------

describe("S104-G the skill-doc count repair (B-L3)", () => {
  it("DEFECT: the §12 cheat-sheet names 39 spec files + the setup project (the honest count)", () => {
    // RED pre-fix: "40 spec files" — 40 is only reachable by counting
    // auth.setup.ts (a setup file matched by the setup project's own
    // testMatch, not a spec).
    expect(SKILL).toMatch(/39 spec files \+ the setup project/);
    expect(SKILL).not.toMatch(/40 spec files/);
  });
});

// ---------------------------------------------------------------------------

describe("S104-H the capture shot() fail-loud (B-L4)", () => {
  it("DEFECT: the s104 capture script's shot() asserts the write is non-empty (the S102-A discipline generalized)", () => {
    // RED pre-fix by construction: the script does not exist yet, and
    // the s103 form's `shot() { $S screenshot …; echo …; }` sequencing
    // passes a failed or 0-byte screenshot write silently — the curl
    // trio's fail-loud assertions never reached the screenshot family.
    const script = path.join(ROOT, "scripts", "capture-session104.sh");
    expect(existsSync(script)).toBe(true);
    const text = readFileSync(script, "utf8");
    const start = text.indexOf("shot() {");
    expect(start).toBeGreaterThan(-1);
    const end = text.indexOf("\n}", start);
    const body = text.slice(start, end);
    expect(body).toMatch(/\[ -s /);
    expect(body).toMatch(/exit 1/);
  });
});

// ---------------------------------------------------------------------------

describe("S104-I the smalls fold (A-I1 + A-I2 + A-I3/B-I1)", () => {
  it("DEFECT: the PresentOverlay's border gate rides the sibling strict form", () => {
    // RED pre-fix: `el.stroke && el.strokeWidth` (truthy) while the
    // three siblings read `> 0` — the S103-D form-alignment comment
    // claimed the family aligned; the one residual spelling.
    expect(EDITOR_VIEW).toMatch(/el\.stroke && el\.strokeWidth > 0/);
    expect(EDITOR_VIEW).not.toMatch(/el\.stroke && el\.strokeWidth[^ >]/);
  });

  it("DEFECT: EXPORT_SCALE is no longer exported (the F79 dead-export class)", () => {
    // RED pre-fix: `export const EXPORT_SCALE = 2;` — its only use is
    // svgToPngBlob's default parameter; no external consumer.
    expect(EXPORT_PNG).not.toMatch(/export const EXPORT_SCALE/);
    expect(EXPORT_PNG).toMatch(/const EXPORT_SCALE = 2;/);
  });

  it("DEFECT: the three type aliases with zero importers are no longer exported", () => {
    // RED pre-fix: `export type ShortcutHelpItem` (editor.ts),
    // `export type ElementStyle` (editor.ts), and `export type
    // LlmOperation` (ai-assistant.ts) — self-consumed only; the
    // value-level dead exports were swept in S63-G, the type-level
    // members predate that census.
    expect(EDITOR_LIB).not.toMatch(/export type ShortcutHelpItem/);
    expect(EDITOR_LIB).not.toMatch(/export type ElementStyle/);
    expect(SANITIZER).not.toMatch(/export type LlmOperation/);
    // the internal uses stay (the aliases remain, just unexported)
    expect(EDITOR_LIB).toMatch(/type ShortcutHelpItem =/);
    expect(EDITOR_LIB).toMatch(/type ElementStyle =/);
    expect(SANITIZER).toMatch(/type LlmOperation =/);
  });
});

// ---------------------------------------------------------------------------

describe("the S104 delivered counts (the count family's live anchor)", () => {
  it("LIVE ANCHOR: the delivered constants equal the PAD §7.1 Unit-total row (the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S103
    // delivery's 1312 / 165 files until the S104-J docs pass re-anchors
    // it to this file's grown totals (1331 / 166). The count family's
    // forcing function: the spec's constants and the PAD row must agree
    // in the same commit (the F68/F70 discipline).
    const padFiles = PAD.match(/\| \*\*Unit total\*\* \| \*\*(\d+) files\*\*/)?.[1];
    const padTests = PAD.match(
      /\| \*\*Unit total\*\* \| \*\*\d+ files\*\* \| \*\*(\d+)\*\*/,
    )?.[1];
    expect(FILES).toBe(padFiles);
    expect(UNIT).toBe(padTests);
    expect(AGENTS).toContain(`(${UNIT} checks)`);
    expect(AGENTS).toContain(`${FILES} files`);
  });
});
