import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as editorLib from "../src/lib/editor";
import * as exportLib from "../src/lib/export-png";

// The session-103 spec (the fifty-first audit's chosen work):
//
// S103-A — the no-op family's LAST TWO MEMBERS (A-L1 + A-L2, the
//   headline — the S78-C/S102-E doctrine's completion): the
//   Add-Gradient-Stop button (the family's unguarded SIXTH member,
//   born one session before the five-site sweep) commits unguarded at
//   the 8-stop cap — addGradientStop returns the SAME REFERENCE there,
//   so the click routes a structurally identical patch through
//   apply-with-commit (the inert snapshot / wiped redo / phantom
//   Unsaved badge / redundant PUT). And the HexColorRow's complete-hex
//   commit fires onChange for the element's CURRENT color — the
//   text-input surface the blur/click/select sweeps never reached.
//
// S103-B — the line stroke-width-0 render truth (A-L4): all four
//   line-paint sites read `strokeWidth || 2` while the sibling border
//   checks use the strict `> 0` form — and the stored 0 the panel's
//   own slider offers rendered as a 2px stroke (the stored-vs-rendered
//   disagreement; the slider's 0 position was dead). The stored number
//   IS the render truth now: SVG stroke-width="0" paints no stroke,
//   the border-0 semantics lines share with rectangles; fresh lines
//   keep defaultGeometry's 2.
//
// S103-C — the named-bounds completion (A-L3 — the F35e residuals the
//   S102-G fold left): fontSize 1..500, the radius ceiling 2000, and
//   the scale domain 0.05..20 each hand-mirrored in two spellings
//   (the scale one a CROSS-FILE mirror into the AI sanitizer).
//
// S103-D — the smalls fold (A-I1 + A-I2): the transcript intro
//   hand-mirrored at the mount initializer and the scope-reset
//   replacement; the PresentOverlay's radius coercion form.
//
// S103-E — the docs/infra fold (B-L1 + B-L2 + B-I1 + B-I2): the
//   DIGMA_SITE_URL knob missing from README's and CLAUDE's env tables
//   (the F87 sibling-sweep — the knob's "second home"); the skill
//   doc's §8 still describing the pre-S67-A three-part token; the
//   doc-lows-s69 title stale against its own 262 assertion; the smoke
//   boot line inheriting the parent shell's app knobs where the
//   playwright webServer strips them (the mechanism over discipline).
//
// The S103 delivered counts — this file's 20 pins grow the suite
// 1292 -> 1312 unit / 164 -> 165 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1
// Unit-total row — so the whole family moves together in the same
// commit).
const UNIT = "1356";
const FILES = "167";

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

const EDITOR_LIB = src("src/lib/editor.ts");
const PANEL = src("src/components/editor/properties-panel.tsx");
const EDITOR_VIEW = src("src/components/editor/editor-view.tsx");
const CANVAS = src("src/components/editor/canvas.tsx");
const PROJECT_CARD = src("src/components/project-card.tsx");
const ASSISTANT_UI = src("src/components/editor/ai-assistant.tsx");
const SANITIZER = src("src/lib/ai-assistant.ts");
const EXPORT_PNG = src("src/lib/export-png.ts");
const README = src("README.md");
const CLAUDE = src("CLAUDE.md");
const SKILL = src("digma_SKILL.md");
const S69_SPEC = src("tests/doc-lows-s69.test.ts");
const SMOKE = src("scripts/smoke-test.sh");
const DEPLOYMENT = src("docs/DEPLOYMENT.md");
const ENV_EXAMPLE = src(".env.example");
const AGENTS = src("AGENTS.md");
const PAD = src("Project_Architecture_Document.md");

// The pure seams — accessed through the namespace (an undefined
// export is a clean RED, never a file-level crash).
const ns = editorLib as unknown as Record<string, unknown>;
const patchDiffers = ns.patchDiffers as
  | (<T extends object>(element: T, patch: Partial<T>) => boolean)
  | undefined;
const addGradientStop = ns.addGradientStop as
  | ((stops: editorLib.GradientStop[]) => editorLib.GradientStop[])
  | undefined;
const elementsToSvg = (exportLib as unknown as Record<string, unknown>)
  .elementsToSvg as
  | ((elements: editorLib.DesignElementDTO[], options?: Record<string, unknown>) => string)
  | undefined;

// A minimal full-form element row (the buildElementRow output shape).
function row(partial: Partial<editorLib.DesignElementDTO>): editorLib.DesignElementDTO {
  return {
    id: "el",
    projectId: "p",
    type: "line",
    name: null,
    x: 0,
    y: 0,
    width: 200,
    height: 100,
    rotation: 0,
    scale: 1,
    opacity: 1,
    visible: true,
    locked: false,
    fill: null,
    stroke: "#FFFFFF",
    strokeWidth: 2,
    radius: 0,
    text: null,
    fontSize: null,
    fontWeight: null,
    fontFamily: null,
    textAlign: null,
    fillImage: null,
    fillGradient: null,
    sortOrder: 0,
    ...partial,
  } as editorLib.DesignElementDTO;
}

// ---------------------------------------------------------------------------

describe("S103-A the no-op family's last two members (A-L1 + A-L2 — the headline)", () => {
  it("DEFECT: the Add-Gradient-Stop click routes through the patchDiffers seam (the cap bail)", () => {
    // RED pre-fix: the button's onClick called apply unconditionally —
    // at the 8-stop cap addGradientStop returns the SAME array
    // reference, so the click committed a structurally identical
    // gradient (the exact corruption the five S102-E sites closed).
    expect(PANEL).toMatch(
      /const stops = addGradientStop\(gradient\.stops\);\s*\n\s*if \(patchDiffers\(gradient, \{ stops \}\)\) apply\(\{ \.\.\.gradient, stops \}\);/,
    );
  });

  it("DEFECT: the HexColorRow's complete-hex branch carries the case-insensitive changed-value guard", () => {
    // RED pre-fix: a complete-hex onChange of the element's CURRENT
    // color (select-all + paste of the same hex) fired the commit
    // unguarded — the text-input surface the blur/click/select sweeps
    // never reached. The guard compares COLORS (case-insensitive):
    // a different case of the same color is not a commit.
    const hexTest = PANEL.indexOf("/^#[0-9a-fA-F]{6}$/.test(next)");
    const guard = PANEL.indexOf('next.toUpperCase() !== (value ?? "").toUpperCase()');
    const commit = PANEL.indexOf("onChange(next)");
    expect(hexTest).toBeGreaterThan(-1);
    expect(guard).toBeGreaterThan(hexTest);
    expect(commit).toBeGreaterThan(guard);
  });

  it("BEHAVIORAL: the gradient cap's own-reference contract feeds the bail — the seam composition", () => {
    // The A-L1 fix's foundation: addGradientStop at the cap returns
    // the SAME reference (the seam's documented contract), so
    // patchDiffers(gradient, { stops }) answers false there and true
    // below the cap (a new array with one more stop).
    expect(addGradientStop).toBeDefined();
    expect(patchDiffers).toBeDefined();
    const eight: editorLib.GradientStop[] = Array.from({ length: 8 }, (_, i) => ({
      color: "#ffffff",
      position: i * 10,
    }));
    expect(addGradientStop!(eight)).toBe(eight);
    const gradient = { type: "linear" as const, angle: 90, stops: eight };
    expect(patchDiffers!(gradient, { stops: eight })).toBe(false);
    const seven = eight.slice(0, 7);
    const grown = addGradientStop!(seven);
    expect(grown).not.toBe(seven);
    expect(grown.length).toBe(8);
    expect(patchDiffers!({ ...gradient, stops: seven }, { stops: grown })).toBe(true);
  });

  it("DEFECT: the five S102-E sites stay guarded AND the gradient-stop click joins them (the census)", () => {
    // The five S102-E forms are the survival content; the COUNT is the
    // defect pin — pre-fix the panel carries exactly FIVE patchDiffers
    // call sites (the gradient-stop button unguarded); post-fix SIX.
    // Session 104 (S104-A — a legitimate contract update): the guardedUpdate
    // helper's ONE call + the gradient stop position's ONE call grow the
    // census to EIGHT (the no-op family's seventh member — the number
    // fields — rides the same seam through the shared helper).
    // Session 105 (S105-A — the same family's continuation): the stop
    // COLOR swatch joins the seam — the census grows to NINE.
    const guarded = PANEL.match(/patchDiffers\(/g);
    expect(guarded?.length).toBe(9);
    expect(PANEL).toMatch(/patchDiffers\(element, \{ textAlign: align \}\)/);
    expect(PANEL).toMatch(/patchDiffers\(gradient, \{ type: "linear" \}\)/);
    expect(PANEL).toMatch(/patchDiffers\(gradient, \{ type: "radial" \}\)/);
    expect(PANEL).toMatch(/patchDiffers\(element, \{ fontFamily \}\)/);
    expect(PANEL).toMatch(/patchDiffers\(element, \{ fillImageFit: fit \}\)/);
  });
});

// ---------------------------------------------------------------------------

describe("S103-B the line stroke-width-0 render truth (A-L4)", () => {
  it("DEFECT: no strokeWidth || 2 truthiness fallback remains at any line-paint site", () => {
    // RED pre-fix: all four render sites (the canvas, the Present
    // overlay, the card thumbnail, the PNG export) read
    // `strokeWidth || 2` — the dead undefined branch plus the 0→2
    // rewrite the stored truth. The sibling border checks at the
    // very same files use the strict `> 0` form.
    expect(CANVAS).not.toMatch(/strokeWidth\{?=?\s*element\.strokeWidth \|\| 2/);
    expect(CANVAS).not.toMatch(/strokeWidth \|\| 2/);
    expect(EDITOR_VIEW).not.toMatch(/strokeWidth \|\| 2/);
    expect(PROJECT_CARD).not.toMatch(/strokeWidth \|\| 2/);
    expect(EXPORT_PNG).not.toMatch(/strokeWidth \|\| 2/);
  });

  it("BEHAVIORAL: the export renders the STORED stroke width — 0 renders stroke-width=\"0\" (no stroke), 2 keeps 2", () => {
    // RED pre-fix: the export's `|| 2` rewrote a stored 0 as
    // stroke-width="2" — the exported file painted a stroke the
    // canvas's own slider had set to zero.
    expect(elementsToSvg).toBeDefined();
    const zero = elementsToSvg!([row({ strokeWidth: 0 })]);
    expect(zero).toContain("<line");
    expect(zero).toContain('stroke-width="0"');
    expect(zero).not.toContain('stroke-width="2"');
    const two = elementsToSvg!([row({ strokeWidth: 2 })]);
    expect(two).toContain('stroke-width="2"');
  });

  it("SURVIVAL: the line contract's neighbors stay — defaultGeometry's 2, the RA-8 round cap, the slider clamp form", () => {
    // GREEN by design: fresh lines still carry strokeWidth 2 from
    // defaultGeometry (the render truth change never touches the
    // creation default); the round cap + no-box-border contract
    // stays; the panel's own 0..20 slider clamp form stays.
    expect(EDITOR_LIB).toMatch(/stroke: FALLBACK_WHITE, strokeWidth: 2, fill: null/);
    expect(EXPORT_PNG).toMatch(/stroke-linecap="round"/);
    expect(PANEL).toMatch(/Math\.min\(Math\.max\(strokeWidth, 0\), 20\)/);
    const two = elementsToSvg!([row({ strokeWidth: 2 })]);
    expect(two).toContain('stroke-linecap="round"');
  });
});

// ---------------------------------------------------------------------------

describe("S103-C the named-bounds completion (A-L3 — the F35e residuals)", () => {
  it("DEFECT: the fontSize domain is single-sourced — FONT_SIZE_MIN/FONT_SIZE_MAX at both spellings", () => {
    // RED pre-fix: clampFontSizeField's Math.min(Math.max(value, 1),
    // 500) hand-mirrored buildElementRow's clampNumber(raw?.fontSize,
    // 1, 500, 16).
    expect(EDITOR_LIB).toMatch(/export const FONT_SIZE_MIN = 1;/);
    expect(EDITOR_LIB).toMatch(/export const FONT_SIZE_MAX = 500;/);
    expect(EDITOR_LIB).toMatch(/Math\.min\(Math\.max\(value, FONT_SIZE_MIN\), FONT_SIZE_MAX\)/);
    expect(EDITOR_LIB).toMatch(
      /clampNumber\(raw\?\.fontSize, FONT_SIZE_MIN, FONT_SIZE_MAX, 16\)/,
    );
  });

  it("DEFECT: the radius ceiling is single-sourced — RADIUS_MAX at both spellings", () => {
    // RED pre-fix: cornerRadiusMax's Math.min(..., 2000) hand-mirrored
    // buildElementRow's clampNumber(raw?.radius, 0, 2000, 0).
    expect(EDITOR_LIB).toMatch(/export const RADIUS_MAX = 2000;/);
    expect(EDITOR_LIB).toMatch(/Math\.min\(Math\.min\(el\.width, el\.height\) \/ 2, RADIUS_MAX\)/);
    expect(EDITOR_LIB).toMatch(/clampNumber\(raw\?\.radius, 0, RADIUS_MAX, 0\)/);
    expect(EDITOR_LIB).not.toMatch(/clampNumber\(raw\?\.radius, 0, 2000, 0\)/);
  });

  it("DEFECT: the scale domain is single-sourced — SCALE_MIN/SCALE_MAX across the cross-file mirror", () => {
    // RED pre-fix: buildElementRow's clampNumber(raw?.scale, 0.05,
    // 20, 1) hand-mirrored the AI sanitizer's clamp(patchRaw.scale,
    // 0.05, 20, 1) — a CROSS-FILE two-spelling.
    expect(EDITOR_LIB).toMatch(/export const SCALE_MIN = 0\.05;/);
    expect(EDITOR_LIB).toMatch(/export const SCALE_MAX = 20;/);
    expect(EDITOR_LIB).toMatch(/clampNumber\(raw\?\.scale, SCALE_MIN, SCALE_MAX, 1\)/);
    expect(SANITIZER).toMatch(/clamp\(patchRaw\.scale, SCALE_MIN, SCALE_MAX, 1\)/);
    expect(SANITIZER).not.toMatch(/clamp\(patchRaw\.scale, 0\.05, 20, 1\)/);
  });

  it("SURVIVAL: the S102-G named bounds stay", () => {
    // GREEN by design: POSITION_BOUND/SIZE_MAX keep their both-spelling
    // consumption from S102-G.
    expect(EDITOR_LIB).toMatch(/export const POSITION_BOUND = 100000;/);
    expect(EDITOR_LIB).toMatch(/export const SIZE_MAX = 100000;/);
    expect(EDITOR_LIB).toMatch(/clampNumber\(raw\?\.x, -POSITION_BOUND, POSITION_BOUND, 0\)/);
  });
});

// ---------------------------------------------------------------------------

describe("S103-D the smalls fold (A-I1 + A-I2)", () => {
  it("DEFECT: the transcript intro is ONE constant consumed at both sites", () => {
    // RED pre-fix: the identical intro string appeared verbatim at the
    // mount initializer and the scope-reset replacement — a future
    // edit to one drifts the other.
    const literal = /Hi! I'm your AI design assistant\. I can make changes direct/;
    const matches = ASSISTANT_UI.match(literal);
    expect(matches).not.toBeNull();
    expect(matches?.length).toBe(1);
    expect(ASSISTANT_UI).toMatch(/const AI_ASSISTANT_INTRO/);
    const consumers = ASSISTANT_UI.match(/text: AI_ASSISTANT_INTRO/g);
    expect(consumers?.length).toBe(2);
  });

  it("DEFECT: the PresentOverlay's radius member rides the strict sibling form", () => {
    // RED pre-fix: `el.radius || undefined` — the coercion spelling
    // while canvas.tsx and project-card.tsx use `> 0` at the same
    // render family.
    expect(EDITOR_VIEW).toMatch(
      /el\.type === "ellipse" \? "50%" : el\.radius > 0 \? el\.radius : undefined/,
    );
    expect(EDITOR_VIEW).not.toMatch(/el\.radius \|\| undefined/);
  });
});

// ---------------------------------------------------------------------------

describe("S103-E the docs/infra fold (B-L1 + B-L2 + B-I1 + B-I2)", () => {
  it("DEFECT: README's Environment Variables table carries the DIGMA_SITE_URL row", () => {
    // RED pre-fix: the S99-G knob documented in .env.example,
    // DEPLOYMENT.md, and AGENTS.md — but not README's table (the
    // F87 sibling-sweep: a knob joins every home its family holds).
    expect(README).toMatch(/DIGMA_SITE_URL/);
  });

  it("DEFECT: CLAUDE's Environment Variables table carries the DIGMA_SITE_URL row", () => {
    // RED pre-fix: the same gap in CLAUDE.md's table — the census
    // convention names it as a knob's second home.
    expect(CLAUDE).toMatch(/DIGMA_SITE_URL/);
  });

  it("DEFECT: the skill doc's auth section describes the four-part versioned token", () => {
    // RED pre-fix: §8 said `userId.expiry.signature` with no
    // tokenVersion anywhere — the pre-S67-A form, falsifiable against
    // auth.ts:54's four-part payload and auth.ts:124's eviction check.
    expect(SKILL).toMatch(/userId\.version\.expiry/);
    expect(SKILL).toMatch(/tokenVersion/);
    expect(SKILL).not.toMatch(/userId\.expiry\.signature/);
  });

  it("DEFECT: the doc-lows-s69 count pin's title matches its own 262 assertion", () => {
    // RED pre-fix: the title said "(63 smoke / 260 e2e)" while the
    // body's assertion (re-anchored at S85-F) requires 262.
    expect(S69_SPEC).toMatch(/\(63 smoke \/ 262 e2e\)/);
    expect(S69_SPEC).not.toMatch(/\(63 smoke \/ 260 e2e\)/);
  });

  it("DEFECT: the smoke boot line strips the parent shell's app knobs (the env -u mechanism)", () => {
    // RED pre-fix: only DATABASE_URL was refused (the S73-D
    // mechanism — it stays); the boot line inherited every other app
    // knob from the parent shell while the playwright webServer
    // strips the seven-knob family. The mechanism over discipline.
    const boot = SMOKE.match(/env -u[^\n]*standalone\/server\.js/);
    expect(boot).not.toBeNull();
    expect(boot?.[0]).toContain("-u DIGMA_PROXY_HOPS");
    expect(boot?.[0]).toContain("-u DIGMA_DISABLE_IN_APP_RESET");
    expect(boot?.[0]).toContain("-u DIGMA_DISABLE_IN_APP_OTP");
    expect(boot?.[0]).toContain("-u DIGMA_REPO_ROOT");
    expect(boot?.[0]).toContain("-u DIGMA_SITE_URL");
    expect(boot?.[0]).toContain("-u HOSTNAME");
    expect(boot?.[0]).toContain("-u KEEP_ALIVE_TIMEOUT");
    expect(boot?.[0]).toContain("DIGMA_DISABLE_AI_LLM=1");
  });

  it("SURVIVAL: the neighbors stay — the other DIGMA_SITE_URL homes, the s69 assertions, the DATABASE_URL refusal", () => {
    // GREEN by design: the knob's existing homes stay documented; the
    // s69 assertion forms stay; the smoke DATABASE_URL refusal (the
    // false-green family's mechanism) stays.
    expect(ENV_EXAMPLE).toMatch(/DIGMA_SITE_URL/);
    expect(DEPLOYMENT).toMatch(/DIGMA_SITE_URL/);
    expect(AGENTS).toMatch(/DIGMA_SITE_URL/);
    expect(S69_SPEC).toMatch(/63 .*smoke/);
    expect(S69_SPEC).toMatch(/262/);
    expect(SMOKE).toMatch(/REFUSED: DATABASE_URL is exported in the parent shell/);
  });
});

// ---------------------------------------------------------------------------

describe("the S103 delivered counts (the count family's live anchor)", () => {
  it("LIVE ANCHOR: the delivered constants equal the PAD §7.1 Unit-total row (the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S102
    // delivery's 1292 / 164 files until the S103-F docs pass re-anchors
    // it to this file's grown totals (1312 / 165). The count family's
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
