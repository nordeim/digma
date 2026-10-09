import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-98 spec (the forty-sixth audit's chosen work):
//
// S98-A — the member name + email explicit rejection (B98-L1 + B98-L2,
// the headline): the S73-E/S97-C "names are identity — reject" doctrine's
// sibling completion ONE LAYER DEEPER. The S97-C swept the team-name pair
// (both routes reject >80); the member family — the doctrine's own first
// consumers — still carried the truncate form: the member NAME silently
// truncated at 80 (members/route.ts:58) while project/team/user names all
// reject, and the member EMAIL truncated at 200 BEFORE the format check
// (members/route.ts:30 + teams/route.ts:63) while every auth sibling
// rejects a >200 email ("reasonably sized" — a 200+ char email whose
// truncation still matches the regex stores a MANGLED address). The
// invite paths must answer identically to the auth family.
//
// S98-B — the CreateProjectDialog reset completion (A98-L1): reset()
// restored name/description/background/template but NOT customColor — after
// a custom pick and a reopen, isPreset is true and the color input showed
// the STALE pick (:746 value={isPreset ? customColor : background}). The
// CreateTeamDialog sibling resets its color (teams-view.tsx:340) — the
// unadopted twin, the F82 sibling lesson applied to UI reset contracts.
//
// S98-C — the census spelling-faithfulness hardening (A98-L2 + A98-L3):
// the F84 lesson's own continuation — a census scoped by SPELLING
// enumerates only the spellings it knows. The inline-style census matched
// HEX only (a token value re-spelled rgb()/rgba()/hsl() evades it), and
// the arbitrary-value class census enumerated utility PREFIXES
// (side-suffixed border-b-[#hex] and nested shadow-[...#fff] forms evade
// it). No live violation today (the only color-function spellings are the
// documented ring + grid pair; the bracket-hex sites are exactly the 3
// documented) — the defect is IN THE PIN, repaired in-commit in lows-s97
// (the color-function census + its closed set) and lows-s94 (the bracket
// catch-all), the S93-A re-anchor precedent. My own finding en route: the
// ring lives in a THIRD structural form — a local `const style:
// React.CSSProperties = {…}` object literal — that BOTH S97 census forms
// miss (no style={{ token, no style.x = assignment); the repaired census
// enumerates Form A (spans) + Form B (assignments) + Form C (typed local
// style objects), comments stripped.
//
// S98-D — the grid provenance record (A98-I1) + the AI fallback's
// DEFAULT_FILL indirection (A98-I2, the S97-B shape: one import, still
// data): the grid's rgba(255,255,255,0.1) pair was the one inline-style
// color literal without a provenance comment (its ring sibling carries
// the S96-C record); the fallback parser's `?? "#3B82F6"` re-stated
// DEFAULT_FILL's value raw (the S97-A carve-out names the AI color-word
// map + template fills — NOT this fallback line).
//
// The S98 delivered counts — this file's 15 pins + the lows-s97 repair's
// 1 new census pin grow the suite 1196 -> 1212 unit / 159 -> 160 files
// (the F68/F70 discipline: the constants ride the count family's live
// anchor — the PAD §7.1 Unit-total row — so the whole family moves
// together in the same commit).
const UNIT = "1292";
const FILES = "164";

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

const MEMBERS_ROUTE = src("src/app/api/teams/[id]/members/route.ts");
const TEAMS_ROUTE = src("src/app/api/teams/route.ts");
const PROJECT_CARD = src("src/components/project-card.tsx");
const AI_ASSISTANT = src("src/lib/ai-assistant.ts");
const CANVAS = src("src/components/editor/canvas.tsx");
const LOWS_S97 = src("tests/lows-s97.test.ts");
const LOWS_S94 = src("tests/lows-s94.test.ts");
const AGENTS = src("AGENTS.md");
const PAD = src("Project_Architecture_Document.md");

// ---------------------------------------------------------------------------
// The spelling-faithful census helpers (the S98-C forms — this spec carries
// its own live derivation; the repaired lows-s97/lows-s94 carry theirs).
// ---------------------------------------------------------------------------

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

const TSX_FILES = walkTsx(path.join(ROOT, "src"));

/** Strip // and {/* *} lines — the census counts CODE literals, not the
 * provenance comments that record them (the ring's comment mentions its
 * own literal; the code-only census counts the paint once). */
function stripComments(text: string): string {
  return text
    .split("\n")
    .filter((ln) => !/^\s*\/\//.test(ln))
    .join("\n")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
}

/** Form A — balanced-brace walking from every `style={{` token (the S97-A
 * repair's shape: template-literal braces are balanced pairs the walker
 * crosses). */
function inlineStyleSpans(text: string): string[] {
  const spans: string[] = [];
  let i = 0;
  while (true) {
    const start = text.indexOf("style={{", i);
    if (start === -1) break;
    let depth = 0;
    let j = start + "style=".length;
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

/** Form C — balanced-brace walking from every typed local style-object
 * literal (`const style: React.CSSProperties = {`): the S98 discovery —
 * the ring's form, missed by BOTH S97 census forms. */
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

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const COLOR_FN = /rgba?\([^)]*\)|hsla?\([^)]*\)/g;

/** The spelling-faithful color-literal census over the three structural
 * forms (A: style={{ spans, B: style.x = assignments, C: typed local
 * style objects), comments stripped: returns the distinct color literals
 * (hex AND color-function spellings). */
function faithfulColorLiterals(): Map<string, string[]> {
  const sites = new Map<string, string[]>();
  for (const f of TSX_FILES) {
    const text = stripComments(readFileSync(f, "utf8"));
    const found: string[] = [];
    for (const span of inlineStyleSpans(text)) {
      found.push(...(span.match(HEX) ?? []), ...(span.match(COLOR_FN) ?? []));
      HEX.lastIndex = 0;
      COLOR_FN.lastIndex = 0;
    }
    for (const ln of text.split("\n")) {
      if (/style\.\w+\s*=/.test(ln)) {
        found.push(...(ln.match(HEX) ?? []), ...(ln.match(COLOR_FN) ?? []));
        HEX.lastIndex = 0;
        COLOR_FN.lastIndex = 0;
      }
    }
    for (const span of typedStyleObjectSpans(text)) {
      found.push(...(span.match(HEX) ?? []), ...(span.match(COLOR_FN) ?? []));
      HEX.lastIndex = 0;
      COLOR_FN.lastIndex = 0;
    }
    if (found.length > 0) sites.set(path.basename(f), found);
  }
  return sites;
}

// ---------------------------------------------------------------------------
// S98-A — the member name + email explicit rejection (the headline)
// ---------------------------------------------------------------------------

describe("S98-A the member name + email explicit rejection (B98-L1 + B98-L2 — the S97-C doctrine's member-family completion)", () => {
  it("DEFECT: the members route rejects a too-long member name (names are identity — reject)", () => {
    // RED pre-fix: clampText(body?.name, 80) silently truncated a
    // 200-char scripted name while the project/team/user name families
    // all reject. The S97-C exact shape reaching the member family.
    expect(MEMBERS_ROUTE).toContain(
      'fail("VALIDATION", "Member name is too long (max 80)", 400)',
    );
    expect(MEMBERS_ROUTE).not.toMatch(/clampText\(body\?\.name,\s*80\)/);
    // the absent-name fallback survives (the derived display form — only
    // the present-but-too-long name rejects)
    expect(MEMBERS_ROUTE).toMatch(/memberDisplayFor\(email\)/);
  });

  it("DEFECT: the members route rejects a too-long email BEFORE the format check", () => {
    // RED pre-fix: clampText(body?.email, 200) truncated BEFORE the
    // regex — a 200+ char email whose truncation still matched stored a
    // MANGLED address while register answers the honest 400. The
    // rejection must precede the format check (the auth family's order).
    expect(MEMBERS_ROUTE).toContain(
      'fail("VALIDATION", "Email is too long (max 200)", 400)',
    );
    expect(MEMBERS_ROUTE).not.toMatch(/clampText\(body\?\.email,\s*200\)/);
    const rejectIdx = MEMBERS_ROUTE.indexOf("Email is too long");
    const formatIdx = MEMBERS_ROUTE.indexOf("[^\\s@]+@[^\\s@]+\\.[^\\s@]+");
    expect(rejectIdx).toBeGreaterThanOrEqual(0);
    expect(formatIdx).toBeGreaterThan(rejectIdx);
  });

  it("DEFECT: the teams route's first-member email carries the same explicit rejection", () => {
    // RED pre-fix: clampText(body?.memberEmail, 200) — the same
    // truncate-before-format form on the second invite path. The two
    // invite paths must answer identically (the S60-C contract's shape).
    expect(TEAMS_ROUTE).toContain(
      'fail("VALIDATION", "Email is too long (max 200)", 400)',
    );
    expect(TEAMS_ROUTE).not.toMatch(
      /clampText\(body\?\.memberEmail,\s*200\)/,
    );
  });

  it("SURVIVAL: the role stays truncate + the derived first-member name keeps its derivation (green by design)", () => {
    // The doctrine splits identity (reject) from labels/prose
    // (truncate): the role is a fixed-option label, not identity — the
    // same carve-out shape as the S97-C description. The teams route's
    // first-member NAME is derived from memberDisplayFor(memberEmail)
    // (never user-supplied), so no name rejection exists on that path.
    expect(MEMBERS_ROUTE).toMatch(/clampText\(body\?\.role,\s*80\)/);
    expect(TEAMS_ROUTE).toMatch(/clampText\(body\?\.memberRole,\s*80\)/);
    expect(TEAMS_ROUTE).toMatch(
      /name:\s*memberDisplayFor\(memberEmail\)/,
    );
  });
});

// ---------------------------------------------------------------------------
// S98-B — the CreateProjectDialog reset completion
// ---------------------------------------------------------------------------

describe("S98-B the CreateProjectDialog reset completion (A98-L1)", () => {
  it("DEFECT: reset() restores the customColor draft (the CreateTeamDialog sibling's form)", () => {
    // RED pre-fix: reset() restored name/description/background/template
    // but NOT customColor — after a custom pick and a reopen, isPreset
    // flipped true and the color input showed the stale pick (:746).
    // The sibling CreateTeamDialog.reset() resets its color state.
    const start = PROJECT_CARD.indexOf("function reset()");
    expect(start).toBeGreaterThanOrEqual(0);
    let depth = 0;
    let end = -1;
    for (let i = PROJECT_CARD.indexOf("{", start); i < PROJECT_CARD.length; i++) {
      if (PROJECT_CARD[i] === "{") depth++;
      else if (PROJECT_CARD[i] === "}") {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    const body = PROJECT_CARD.slice(start, end);
    expect(body).toContain("setCustomColor(");
    // the default mirrors the background reset's preset anchor exactly
    expect(body).toMatch(
      /setCustomColor\(CANVAS_BACKGROUND_PRESETS\[0\]\?\.value \?\? "#0D1117"\)/,
    );
  });
});

// ---------------------------------------------------------------------------
// S98-C — the census spelling-faithfulness hardening
// ---------------------------------------------------------------------------

describe("S98-C the census spelling-faithfulness hardening (A98-L2 + A98-L3 — the F84 continuation)", () => {
  it("DEFECT: the lows-s97 census carries the color-function enumeration (the in-commit repair)", () => {
    // RED pre-fix: the S97 faithful census matched HEX only — a token
    // value re-spelled rgb()/rgba()/hsl() evaded the closed set. The
    // repaired spec enumerates the color-function spellings as their own
    // closed set (the S93-A re-anchor precedent: a live-suite pin whose
    // shape is blind is a defect in the pin, not frozen evidence).
    expect(LOWS_S97).toMatch(/COLOR_FN|color-function census/);
    expect(LOWS_S97).toMatch(/rgba\(255, 255, 255, 0\.1\)/); // the grid member
    expect(LOWS_S97).toMatch(/rgba\(59, 130, 246, 0\.9\)/); // the ring member
  });

  it("DEFECT: the lows-s94 class census rides the bracket catch-all (no prefix enumeration)", () => {
    // RED pre-fix: HEX_CLASS enumerated utility prefixes — side-suffixed
    // (border-b-[#hex]) and nested (shadow-[...#fff]) forms evaded it.
    // The catch-all is the arbitrary-value SYNTAX itself: a dash-bracket
    // `-[\u2026#hex\u2026]` carrying a hex anywhere inside. Strictly more
    // faithful at the same cost (the delivered count stays exactly the
    // 3 documented sites).
    expect(LOWS_S94).not.toMatch(
      /\(\?:bg\|border\|text\|divide\|ring\|fill\|stroke/,
    );
    expect(LOWS_S94).toContain(
      "-\\[[^\\]]*#[0-9a-fA-F]{3,8}[^\\]]*\\]",
    );
  });

  it("LIVE: the real-corpus color-function census = exactly the documented pair (the ring + the grid)", () => {
    // The live derivation with the three-form spelling-faithful census:
    // Form A carries the grid pair (the 20px grid's two
    // rgba(255,255,255,0.1) spellings in one span), Form C carries the
    // ring (rgba(59,130,246,0.9) — the S96-C provenance record). Form B
    // carries none. The closed set is exactly the documented pair.
    const sites = faithfulColorLiterals();
    const all = [...sites.values()].flat();
    const fns = all.filter((c) => !c.startsWith("#"));
    expect(new Set(fns)).toEqual(
      new Set(["rgba(255, 255, 255, 0.1)", "rgba(59, 130, 246, 0.9)"]),
    );
  });

  it("LIVE: the real-corpus inline-style hex census still = exactly the Sarah datum (the S97 claim, re-derived)", () => {
    // The spelling-faithful census does not disturb the S97 hex claim:
    // exactly one inline-style hex site — the Sarah chip #10B981.
    const sites = faithfulColorLiterals();
    const hexes = [...sites.values()].flat().filter((c) => c.startsWith("#"));
    expect(hexes).toEqual(["#10B981"]);
    expect(sites.has("editor-view.tsx")).toBe(true);
  });

  it("LIVE: the bracket-hex class census (the catch-all form) = exactly the 3 documented sites", () => {
    // The live derivation of the repaired lows-s94 shape: the
    // catch-all over every src .ts/.tsx file finds exactly the
    // documented set (bg-[#21262d] x2 + hover:border-[#404040] x1).
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
      }
    };
    walk(path.join(ROOT, "src"));
    const text = files.map((f) => readFileSync(f, "utf8")).join("\n");
    // the arbitrary-value syntax itself: the dash-bracket form carrying a
    // hex anywhere inside (catches plain, side-suffixed, and nested)
    const sites =
      text.match(/-\[[^\]]*#[0-9a-fA-F]{3,8}[^\]]*\]/g) ?? [];
    const hexes = sites.map((m) => m.match(/#[0-9a-fA-F]{3,8}/)?.[0]);
    expect(sites.length).toBe(3);
    expect(hexes.filter((h) => h === "#21262d").length).toBe(2);
    expect(hexes.filter((h) => h === "#404040").length).toBe(1);
  });

  it("DEMO: the blindness class, documented — the hex-only matcher misses what the spelling-faithful census counts", () => {
    // The class documentation (green by construction — the reason
    // S98-C exists, pinned so the lesson survives): over a synthetic
    // corpus the OLD shapes find fewer sites than the faithful forms —
    // rgb()/rgba() spellings evade the HEX-only regex, side-suffixed and
    // nested bracket-hex forms evade the prefix enumeration.
    const corpus = [
      'const a = <div style={{ color: "rgb(37, 99, 235)" }} />;',
      'const b = <div style={{ color: "rgba(59, 130, 246, 0.9)" }} />;',
      'const c = <div className="border-b-[#123456]" />;',
      'const d = <div className="shadow-[0_0_2px_#fff]" />;',
    ].join("\n");
    const hexOnly = corpus.match(HEX) ?? [];
    const fns = corpus.match(COLOR_FN) ?? [];
    const catchAll =
      corpus.match(/-\[[^\]]*#[0-9a-fA-F]{3,8}[^\]]*\]/g) ?? [];
    // the blindness, precisely: the hex-only matcher sees the two
    // bracket-hex spellings but is BLIND to the color-function pair —
    // zero rgb()/rgba() matches while the faithful census counts both
    expect(fns.length).toBe(2); // the rgb() + rgba() spellings
    expect(catchAll.length).toBe(2); // border-b + shadow nested
    expect(hexOnly.length).toBe(2); // only the bracket-hex spellings
    expect(hexOnly.filter((c) => /^(rgb|hsl)/.test(c)).length).toBe(0); // the blindness
    expect(fns.length).toBeGreaterThan(0); // ...that the COLOR_FN form counts
    expect(fns.length + catchAll.length).toBe(4); // the faithful census counts all four
  });
});

// ---------------------------------------------------------------------------
// S98-D — the grid provenance record + the AI fallback indirection
// ---------------------------------------------------------------------------

describe("S98-D the grid provenance record + the AI fallback's DEFAULT_FILL indirection (A98-I1 + A98-I2)", () => {
  it("DEFECT: the canvas grid block carries its provenance record (the ring sibling's convention)", () => {
    // RED pre-fix: the grid's rgba(255, 255, 255, 0.1) pair was the one
    // inline-style color literal without a provenance record — the ring
    // (S96-C), the #484f58, and the .editor-range families all carry
    // theirs. The one-line record joins the block.
    const idx = CANVAS.indexOf("rgba(255, 255, 255, 0.1)");
    expect(idx).toBeGreaterThanOrEqual(0);
    const window = CANVAS.slice(Math.max(0, idx - 900), idx);
    expect(window).toMatch(/reference-measured 20px grid|20px like the reference/);
    expect(window).toMatch(/[Pp]rovenance|measured/);
  });

  it("DEFECT: the AI fallback parser's default fill rides DEFAULT_FILL (the S97-B shape)", () => {
    // RED pre-fix: colorFor(lowered) ?? "#3B82F6" — the fallback
    // re-stated DEFAULT_FILL's value raw while the constant is exported
    // in the same lib family. One import, still data (not chrome).
    expect(AI_ASSISTANT).toMatch(/colorFor\(lowered\) \?\? DEFAULT_FILL/);
    expect(AI_ASSISTANT).toMatch(
      /import \{ DEFAULT_FILL \} from "@\/lib\/editor"|import \{[^}]*DEFAULT_FILL[^}]*\} from "@\/lib\/editor"/,
    );
    // the fallback line is the ONLY #3B82F6 outside the documented
    // data carve-outs (the color-word map + the template fill)
    const lines = AI_ASSISTANT.split("\n").filter((ln) =>
      ln.includes("#3B82F6"),
    );
    const carveOuts = lines.filter(
      (ln) =>
        /blue:\s*"#3B82F6"/.test(ln) ||
        /fill:\s*"#3B82F6"/.test(ln) || // the login-template fill (authored data)
        /^\s*\/\//.test(ln), // comments (the S97 lineage record)
    );
    expect(lines.length - carveOuts.length).toBe(0);
  });

  it("SURVIVAL: the color-word map + the template fills stay literal (the S97-A data carve-out)", () => {
    // GREEN by design: the AI's authored data keeps its literals —
    // the color-word map (blue: #3B82F6) and the login-template fill.
    expect(AI_ASSISTANT).toMatch(/blue:\s*"#3B82F6"/);
    expect(AI_ASSISTANT).toMatch(/fill:\s*"#3B82F6", radius: 8/);
  });
});

// ---------------------------------------------------------------------------
// The live anchors (the count family's forcing function)
// ---------------------------------------------------------------------------

describe("S98 the survivals + the live anchors", () => {
  it("LIVE ANCHOR: the delivered constants equal the PAD §7.1 Unit-total row (the family moves together)", () => {
    // RED pre-fix by construction: the §7.1 row still reads the S97
    // delivery's 1196 / 159 files until the S98-E docs pass re-anchors
    // it to this file's grown totals (1210 / 160). The count family's
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
