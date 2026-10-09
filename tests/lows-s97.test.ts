import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-97 remediation — the FORTY-FIFTH audit's chosen work:
//
// S97-A (the headline, A97-M1 + A97-L1): the FALLBACK_WHITE single-source
// seam + the structurally faithful census. The S96 closed-set pin's regex
// (/style=\{\{[^}]*#hex[^}]*\}\}/) was BLIND to two structural forms: (a) a
// multi-line style={{...}} whose body carries a template literal with a }
// (rotate(${el.rotation}deg) terminates the [^}]* early — the #fff at the
// PresentOverlay and CanvasThumbnail text-color sites sat past the boundary,
// never scanned); (b) a style object built as a LOCAL VARIABLE (canvas.tsx
// style.color = element.fill ?? "#FFFFFF" — no style={{ token at all). The
// faithful census (balanced-brace walking + the variable form) counts FOUR
// pre-fix sites: the Sarah datum + the text-fill fallback trio — while the
// AGENTS/PAD record claimed "the ONLY literal hex in a TSX inline style is
// the Sarah chip's #10B981" and the pin passed VACUOUSLY. The F83 lesson one
// layer deeper: a census scoped by a REGEX enumerates only the syntax forms
// the regex knows — the pin's own shape is audit surface.
//
// The remediation's data/chrome separation (the F82/F83 doctrine): the
// text-fill/stroke fallback family is DATA — the model's null-fill default
// (what a text with no fill paints; the inline-style twins of the documented
// SVG-attribute family, AGENTS:33) — NOT chrome chasing a token counterpart.
// #ffffff is incidentally the declared value of five @theme tokens, but the
// fallback is the canvas DATA default, not a chrome paint; riding a token
// var() would re-pin the text default to the app-shell background token —
// semantically wrong. The correct seam is the SINGLE-SOURCE constant:
// FALLBACK_WHITE = "#FFFFFF" in editor.ts (beside DEFAULT_FILL), consumed
// at every render/model seam — closing the #fff/#FFFFFF spelling divergence
// (twelve hand-maintained copies of one datum, the F35e divergence class,
// already split two ways).
//
// The DATA carve-outs stay literal (the F83 separation): ai-assistant.ts's
// color-word map + template fills (the AI's authored data), the gradient
// add-stop's lowercase #ffffff (editor.ts — the reference's decoded RA-54
// datum), the globals.css measured #fff slider-thumb literals (the pinned
// plain-CSS family). Tests stay test data.
//
// S97-B (A97-L2): buildElementRow rides DEFAULT_FILL + FALLBACK_WHITE —
// the server's element synthesis joins the client's single sources (the
// raw #3B82F6 pair at editor.ts:929/:931 sat 676 lines below the exported
// constant).
//
// S97-C (B97-L1): the team-name explicit rejection — the S73-E "names are
// identity — reject" doctrine's unadopted sibling. The project family
// answers fail(VALIDATION, "Project name is too long (max 120)", 400)
// while the team family silently truncated at 80 (clampText) —
// UI-unreachable (both surfaces carry maxLength=80), API-consumer-only.
//
// S97-D (B97-I1): the api.ts envelope-comment carve-out — the "every
// handler" claim gains the /api/health exception (the liveness probe's
// bare { status, app, ts } shape, the one documented non-envelope route;
// pinned against README since doc-lows-s83, but api.ts itself was the one
// live claim site without it).

const EDITOR_TS = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const CANVAS = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const EDITOR_VIEW = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const PROJECT_CARD = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/project-card.tsx"),
  "utf8",
);
const EXPORT_PNG = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/export-png.ts"),
  "utf8",
);
const TEAMS_ROUTE = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/teams/route.ts"),
  "utf8",
);
const TEAMS_ID_ROUTE = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/teams/[id]/route.ts"),
  "utf8",
);
const API_TS = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/api.ts"),
  "utf8",
);
const LOWS_S96 = readFileSync(
  path.resolve(import.meta.dirname, "./lows-s96.test.ts"),
  "utf8",
);
const AGENTS = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
  "utf8",
);
const PAD = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);

/** Walk src/ collecting every .tsx source (the app code, not tests/e2e). */
function walkTsx(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkTsx(full));
    else if (/\.tsx$/.test(entry.name)) out.push(full);
  }
  return out;
}

const TSX_FILES = walkTsx(path.resolve(import.meta.dirname, "../src"));

/**
 * The FAITHFUL inline-style extraction — the S97-A repair. Balanced-brace
 * walking from every `style={{` token: template-literal braces
 * (`rotate(${el.rotation}deg)`) are balanced pairs the walker crosses,
 * so a hex past the boundary stays INSIDE the span (the blind [^}]* form
 * terminated early and never scanned it).
 */
function inlineStyleSpans(text: string): string[] {
  const spans: string[] = [];
  let i = 0;
  while (true) {
    const start = text.indexOf("style={{", i);
    if (start === -1) break;
    let depth = 0;
    let j = start + "style=".length; // at the first '{'
    for (; j < text.length; j++) {
      if (text[j] === "{") depth++;
      else if (text[j] === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    spans.push(text.slice(start, Math.min(j + 1, text.length)));
    i = j + 1;
  }
  return spans;
}

const HEX = /#[0-9a-fA-F]{3,8}\b/g;

// Session 98 (S98-C — A98-L2, the in-commit repair): the color-function
// spelling family joins the census — the F84 lesson's own continuation.
// A census scoped by SPELLING enumerates only the spellings it knows:
// the HEX-only matcher above is blind to a token value re-spelled
// rgb()/rgba()/hsl() (no live violation — the corpus's only
// color-function spellings are the documented ring + grid pair — the
// blindness was in the pin's shape, repaired here the S93-A way).
const COLOR_FN = /rgba?\([^)]*\)|hsla?\([^)]*\)/g;

/** Strip // and {/* *} lines — the code-only census counts paints, not
 * the provenance comments that record them (the ring's own comment
 * mentions its literal). */
function stripComments(text: string): string {
  return text
    .split("\n")
    .filter((ln) => !/^\s*\/\//.test(ln))
    .join("\n")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
}

/** Form C (the S98 discovery): balanced-brace walking from every typed
 * local style-object literal (`const style: React.CSSProperties = {`) —
 * the ring's form, missed by BOTH census forms above (no style={{ token,
 * no style.x = assignment). */
function typedStyleObjectSpans(text: string): string[] {
  const spans: string[] = [];
  let i = 0;
  while (true) {
    const token = text.indexOf("React.CSSProperties = {", i);
    if (token === -1) break;
    const start = text.lastIndexOf("const ", token);
    let depth = 0;
    let j = text.indexOf("{", token);
    for (; j < text.length; j++) {
      if (text[j] === "{") depth++;
      else if (text[j] === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    spans.push(text.slice(start, Math.min(j + 1, text.length)));
    i = j + 1;
  }
  return spans;
}

/** The color-function census: the spelling-faithful completion — Form A
 * (style={{ spans) + Form B (style.<prop> =) + Form C (typed local style
 * objects), comments stripped, counting rgb()/rgba()/hsl() spellings. */
function faithfulInlineColorFunctionSites(): string[] {
  const sites: string[] = [];
  for (const f of TSX_FILES) {
    const text = stripComments(readFileSync(f, "utf8"));
    const found: string[] = [];
    for (const span of inlineStyleSpans(text)) {
      found.push(...(span.match(COLOR_FN) ?? []));
      COLOR_FN.lastIndex = 0;
    }
    for (const ln of text.split("\n")) {
      if (/style\.\w+\s*=/.test(ln)) {
        found.push(...(ln.match(COLOR_FN) ?? []));
        COLOR_FN.lastIndex = 0;
      }
    }
    for (const span of typedStyleObjectSpans(text)) {
      found.push(...(span.match(COLOR_FN) ?? []));
      COLOR_FN.lastIndex = 0;
    }
    if (found.length > 0) sites.push(`${path.basename(f)}: ${found.join(",")}`);
  }
  return sites;
}

/** The faithful census: Form A (style={{...}} spans) + Form B (style.<prop> =). */
function faithfulInlineHexSites(): string[] {
  const sites: string[] = [];
  for (const f of TSX_FILES) {
    const text = readFileSync(f, "utf8");
    for (const span of inlineStyleSpans(text)) {
      const hexes = span.match(HEX) ?? [];
      HEX.lastIndex = 0;
      if (hexes.length > 0) sites.push(`${path.basename(f)}: ${hexes.join(",")}`);
    }
    for (const ln of text.split("\n")) {
      if (/style\.\w+\s*=/.test(ln)) {
        const hexes = ln.match(HEX) ?? [];
        HEX.lastIndex = 0;
        if (hexes.length > 0) sites.push(`${path.basename(f)} (variable form): ${hexes.join(",")}`);
      }
    }
  }
  return sites;
}

// The S97 delivered counts — this file's 13 pins grow the suite
// 1183 -> 1196 unit / 158 -> 159 files (the F68/F70 discipline: the
// constants ride the count family's live anchor — the PAD §7.1 Unit-total
// row — so the whole family moves together in the same commit).
const UNIT = "1356";
const FILES = "167";

describe("S97-A the FALLBACK_WHITE single-source seam + the faithful census (A97-M1 + A97-L1)", () => {
  it("DEFECT: editor.ts exports FALLBACK_WHITE — the single source for the render white", () => {
    // RED pre-fix: the constant does not exist. Post-fix it sits beside
    // DEFAULT_FILL with the provenance comment (the model's null-fill
    // default — data, not chrome; NOT a token indirection, the F82/F83
    // separation — riding a token var() would re-pin the canvas text
    // default to the app-shell background token).
    expect(EDITOR_TS).toMatch(/export const FALLBACK_WHITE = "#FFFFFF";/);
  });

  it("DEFECT: the four render-surface files consume FALLBACK_WHITE — zero raw white literals", () => {
    // RED pre-fix: canvas.tsx carries #FFFFFF x2, editor-view.tsx #fff +
    // #FFFFFF, project-card.tsx #fff + #FFFFFF, export-png.ts #FFFFFF x2
    // — eight hand-maintained copies of one datum, already split two
    // spellings (#fff vs #FFFFFF).
    for (const [name, src] of [
      ["canvas.tsx", CANVAS],
      ["editor-view.tsx", EDITOR_VIEW],
      ["project-card.tsx", PROJECT_CARD],
      ["export-png.ts", EXPORT_PNG],
    ] as const) {
      expect(src).toContain("FALLBACK_WHITE");
      expect(src, `${name} must not carry a raw white literal`).not.toMatch(/"#fff(fff)?"/);
    }
  });

  it("DEFECT: editor.ts's own render/model seams ride FALLBACK_WHITE (defaults + elementToStyle + buildElementRow)", () => {
    // RED pre-fix: defaultElementFor("text") :359, the line factory :380,
    // elementToStyle :524, and buildElementRow :946/:948 all spell the
    // raw literal. Post-fix the ONLY "#FFFFFF" literal in editor.ts is
    // the constant's own definition (plus the data carve-outs below).
    const lines = EDITOR_TS.split("\n");
    const literalLines = lines
      .map((ln, i) => ({ ln, i: i + 1 }))
      .filter(({ ln }) => /"#FFFFFF"/.test(ln));
    // The constant definition itself + nothing else in the render/model
    // seams (the gradient add-stop's lowercase #ffffff is a DIFFERENT
    // literal — the reference's decoded RA-54 datum, data-layer).
    expect(literalLines.length).toBe(1);
    expect(literalLines[0].ln).toMatch(/export const FALLBACK_WHITE/);
  });

  it("DEFECT (S97-B): buildElementRow rides DEFAULT_FILL — no raw #3B82F6 beside the exported constant", () => {
    // RED pre-fix: the synthesis spells "#3B82F6" twice while
    // DEFAULT_FILL is exported 676 lines above — two sources for the
    // brand default, the F35e divergence class.
    const rowStart = EDITOR_TS.indexOf("export function buildElementRow");
    // The function is the module's LAST export — the body runs to EOF
    // (its inline return TYPE carries its own braces; a first-\n} cut
    // would land inside the type).
    const body = EDITOR_TS.slice(rowStart);
    expect(body).not.toContain('"#3B82F6"');
    expect(body).toContain("DEFAULT_FILL");
    expect(body).toContain("FALLBACK_WHITE");
  });

  it("DEFECT: the FAITHFUL census — exactly ONE inline-style hex site (the Sarah datum)", () => {
    // RED pre-fix: FOUR sites (the blind regex's vacuous 1 + the
    // PresentOverlay #fff + the CanvasThumbnail #fff + the canvas.tsx
    // variable form). Post-fix: exactly the one documented datum site —
    // the Sarah chip #10B981, the reference's verbatim RA-41 identity
    // chip, no token counterpart, provenance-commented. A second site
    // trips this pin and the newcomer must either ride a token (chrome)
    // or join the documented set (data) — the F78 census discipline,
    // now with a census that actually counts.
    const sites = faithfulInlineHexSites();
    expect(sites).toEqual(["editor-view.tsx: #10B981"]);
  });

  it("DEFECT: the lows-s96 census regex REPAIRED to the faithful form (the delivered pin tells the truth)", () => {
    // RED pre-fix: lows-s96.test.ts still carries the structurally blind
    // INLINE_HEX_SITE regex (a class that could not cross a brace —
    // terminated at the first } inside a template literal, and blind to
    // the variable-built style form entirely) — the pin that passed
    // vacuously. The S93-A re-anchor precedent: a live-suite pin whose
    // shape is wrong is a defect in the pin itself, repaired in the same
    // commit. The repaired form walks balanced braces via the
    // inlineStyleSpans helper + scans the variable-form lines.
    expect(LOWS_S96).not.toContain("INLINE_HEX_SITE");
    expect(LOWS_S96).toContain("inlineStyleSpans");
    expect(LOWS_S96).toContain("(variable form)");
  });
});

describe("S98-C the color-function census (the in-commit repair — A98-L2/A98-L3, the forty-sixth audit)", () => {
  it("the spelling-faithful census counts rgb()/rgba()/hsl() — the closed set is exactly the ring + the grid", () => {
    // The F84 continuation: the HEX-only census above is blind to a
    // token value re-spelled as a color function. No live violation —
    // the three-form census (spans + assignments + the typed local
    // style objects the S98 discovery added) finds exactly the
    // documented pair: the selection ring rgba(59, 130, 246, 0.9) (the
    // S96-C provenance record, Form C — a local React.CSSProperties
    // object BOTH prior forms missed) and the 20px grid's
    // rgba(255, 255, 255, 0.1) pair (Form A — one span, two spellings).
    // A third literal trips this pin and the newcomer must either ride
    // a token (chrome) or join the documented set (data).
    const sites = faithfulInlineColorFunctionSites();
    expect(sites).toEqual([
      "canvas.tsx: rgba(255, 255, 255, 0.1),rgba(255, 255, 255, 0.1),rgba(59, 130, 246, 0.9)",
    ]);
  });
});

describe("S97-C the team-name explicit rejection (B97-L1)", () => {
  it("DEFECT: the create route rejects a too-long team name (the S73-E doctrine's sibling)", () => {
    // RED pre-fix: clampText(body?.name, 80) silently truncates a
    // 200-char scripted name. The project family's pinned form rejects:
    // fail(VALIDATION, "Project name is too long (max 120)", 400).
    expect(TEAMS_ROUTE).toContain('fail("VALIDATION", "Team name is too long (max 80)", 400)');
    expect(TEAMS_ROUTE).not.toMatch(/clampText\(body\?\.name,\s*80\)/);
  });

  it("DEFECT: the PATCH route's name branch carries the same explicit rejection", () => {
    expect(TEAMS_ID_ROUTE).toContain('fail("VALIDATION", "Team name is too long (max 80)", 400)');
    expect(TEAMS_ID_ROUTE).not.toMatch(/clampText\(body\.name,\s*80\)/);
  });

  it("the description stays truncate (prose — the doctrine's other half)", () => {
    // GREEN by design: the S73-E doctrine splits names (identity —
    // reject) from descriptions (prose — truncate). The team
    // description keeps its clampText form at both routes.
    expect(TEAMS_ROUTE).toMatch(/clampText\(body\?\.description,\s*300\)/);
  });
});

describe("S97-D the api.ts envelope-comment carve-out (B97-I1)", () => {
  it("DEFECT: the every-handler claim names the /api/health exception", () => {
    // RED pre-fix: src/lib/api.ts claims "every handler returns { ok,
    // data } or { ok, error }" while /api/health ships the bare
    // { status, app, ts } liveness shape — the documented carve-out
    // (pinned against README since doc-lows-s83) missing at the one
    // live claim site that states it as source.
    expect(API_TS).toMatch(/every handler except \/api\/health/);
  });
});

describe("S97 the survivals + the live anchors", () => {
  it("SURVIVAL: the Sarah datum keeps #10B981 with its provenance (green both sides)", () => {
    // The reference's verbatim RA-41 identity datum — no token
    // counterpart (--color-green-500 is #22c55e); it stays a literal
    // WITH its provenance comment, the #484f58 convention.
    expect(EDITOR_VIEW).toContain('backgroundColor: "#10B981"');
    const idx = EDITOR_VIEW.indexOf('backgroundColor: "#10B981"');
    const commentWindow = EDITOR_VIEW.slice(Math.max(0, idx - 800), idx);
    expect(commentWindow).toMatch(/RA-41|Sarah UI/);
  });

  it("SURVIVAL: the data carve-outs stay literal (the F82/F83 separation)", () => {
    // GREEN by design post-fix: the AI's authored data and the
    // reference's decoded gradient datum are DATA, not render fallbacks
    // — they keep their literals (the TEAM_COLORS class).
    const AI = readFileSync(
      path.resolve(import.meta.dirname, "../src/lib/ai-assistant.ts"),
      "utf8",
    );
    expect(AI).toContain('white: "#FFFFFF"');
    expect(EDITOR_TS).toContain('{ color: "#ffffff", position: 50 }');
  });

  it("LIVE ANCHOR: the delivered constants equal the PAD §7.1 Unit-total row (the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S96
    // delivery's 1183 / 158 files until the S97-E docs pass re-anchors
    // it to this file's grown totals (1196 / 159). The count family's
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
