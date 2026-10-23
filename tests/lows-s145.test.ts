import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-145 spec (the ninety-third audit's chosen work — the
// registration shape, zero source changes):
//
// S145-A — THE SANCTIONED-SET ENUMERATION-COMPLETION REGISTRATION (A145-I1):
//   the s144-setstate-enum-note (worklog :3810, the S144-A registration)
//   enumerates "the two sanctioned setState-in-effect-execution sites the
//   layer's own registrations name explicitly" — S55-A (the PresentOverlay
//   measure, editor-view.tsx:1032-1042) and S77-E (the async-prefix re-arm,
//   :1729) — but the layer's own registrations name FOUR: the s140-audit-A
//   (:3401) and s141-audit-A (:3498) records both carry "the sanctioned
//   layout-effect measure-before-paint forms S55-A/S65-A" (the S65-A
//   CanvasThumbnail measure — project-card.tsx:114-125, setFit inside
//   measure() invoked synchronously in the useLayoutEffect, its in-code
//   comment naming "the measurement lands before the first paint"), and
//   the S111-B four-path taxonomy the note itself cites censuses the
//   adoption settle (editor-view.tsx:1698, setLoading(false) in the
//   effect's sync body — "the adoption path settles it there"). Zero code
//   defect — all four forms React-sanctioned, registered in-code, pinned
//   by the standing specs. The defect is the registration's own
//   enumeration precision — the A144-I1 class recurring one generation
//   later inside the registration that established the doctrine. The
//   registration: the worklog's bracketed s145-enum-completion-note +
//   these pins — the doctrine extended: an every-X registration's own
//   enumeration is subject to the exhaustiveness doctrine it registers —
//   derive the enumeration from the live set the records name, never
//   from the finding's own examples.
//
// S145-B — THE TEMPLATE-LITERAL CLASSNAME SCOPE-MEMBERSHIP REGISTRATION
//   (A145-I2): the s140/s141-audit-A records read "exactly TWO
//   template-literal className sites in the layer — layout.tsx:26 … and
//   properties-panel.tsx:1656" while the audits' own scope is the 22-file
//   layer list — layout.tsx is NOT one of the 22 (the layer's sole
//   src/app member is globals.css); the s142/s143 records drop the "in
//   the layer" words but keep the scopeless "exactly 2". The live truth:
//   exactly 2 at the src/ scope (properties-panel.tsx:1656 the Text
//   Align button whose conditional is a pair of complete literals, and
//   src/app/layout.tsx:26 the next/font variable, not a utility) and
//   exactly 1 at the 22-file layer scope. The S139-A scope-naming
//   doctrine's own N−1 member. The registration: the worklog's bracketed
//   s145-template-literal-scope-note + these pins — the doctrine
//   extended: a census riding consecutive record generations must carry
//   its scope beside the count in EVERY generation.
//
// S145-C — THE COUNT-FAMILY DOC-SET/COINCIDENTAL-LITERAL REGISTRATION
//   (B145-I1): the s145 dispatch brief's count-family expectation read
//   "2037/206 at 15 live claim sites" — the five named docs carry 14
//   live claim coordinates, the 15th grep line being PAD :253's FROZEN
//   "editor-view 2037" line-count literal from the S105-H row (a
//   different figure class numerically colliding with the live unit
//   count); the repo-wide live truth 17 claim coordinates across 6 docs
//   (digma_SKILL.md :6/:71/:242 included). The forward collisions named:
//   "2049" at PAD :159/:171 (frozen editor-view line-count arrows in the
//   S112-E/S111-E rows) and "207" at PAD :1462 — the exact figures the
//   2037+12 / 206+1 re-anchor produces, so the doc-update anchors by
//   CONTENT, never by bare figure. The registration: the worklog's
//   bracketed s145-count-docset-note + these pins — the doctrine
//   extended: a count-family census must derive its doc set from the
//   live tree, and every bare-figure grep must classify frozen
//   session-history rows out of the claim set, naming the filter.
//
// S145-D — THE SMOKE-FILTER COINCIDENTAL-CORRECTNESS REGISTRATION
//   (B145-I2): the brief's ok-call derivation read "68 ok-call lines
//   (69 `ok `-matching lines minus the function definition itself)" —
//   but the :46 definition matches `ok(`, never `ok ` (a non-member
//   subtracted), and the real 69th member is the :292 prose literal
//   ("reset ok (got $RESET_OK_STATUS)"); the two offsetting errors
//   produce the correct 68. The filter that actually yields 68 is the
//   call form `ok "`. The registration: the worklog's bracketed
//   s145-smoke-filter-note + these pins — the doctrine extended (the
//   F131 name-the-filter member at its coincidental-correctness shape):
//   a recorded derivation method must be the filter that yields the
//   figure — two offsetting errors producing a correct figure are
//   recorded as such, never left as the method.
//
// The script family (the S118-C convention, s145 form): the s145 parity
//   scripts ride their OWN tokens (live145 / nav145 / digma-seo-s145,
//   the 121st audit / 122nd session / 82nd clip ordinals, the S144
//   delivery at HEAD c623617), never the frozen s144 forms.

const worklogSource = readFileSync(
  path.resolve(import.meta.dirname, "../worklog.md"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const agentsSource = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
  "utf8",
);
const claudeSource = readFileSync(
  path.resolve(import.meta.dirname, "../CLAUDE.md"),
  "utf8",
);
const readmeSource = readFileSync(
  path.resolve(import.meta.dirname, "../README.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const projectCardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/project-card.tsx"),
  "utf8",
);
const layoutSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/layout.tsx"),
  "utf8",
);
const propertiesPanelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s145.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s145.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s145.sh"),
  "utf8",
);
const smokeSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/smoke-test.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the CURRENT live figures 2037/206; the doc-update script
 *  re-anchors the docs and these constants TOGETHER so the pair-unity
 *  pins stay green through the transition — the rolling-safe form at
 *  birth, the s140–s144 lesson). */
const UNIT = "2488";
const FILES = "241";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The PAD's live count-family rows, found by CONTENT (the S140-C
 *  doctrine: never by stale coordinates). */
const padUnitTotalRow = () =>
  padSource.split("\n").find((l) => l.includes("**Unit total**")) ?? "";
const padChecklistRow = () =>
  padSource.split("\n").find((l) => l.startsWith("- [ ] `bun run test` →")) ?? "";
const padCommandRow = () =>
  padSource
    .split("\n")
    .find((l) => l.includes("| `bun run test` / `bun run test:watch` |")) ?? "";

/** The frozen audit entries, found by their Task-ID anchors (the
 *  entries are frozen records; the anchors are the live claim). The
 *  entry spans to the next section separator — the Work Log bullets
 *  are massive single lines, the census lines ride kilobytes past
 *  the anchor (the s143 spec-form lesson: back up to the line start
 *  so the "Task ID:" prefix rides the slice). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const end = worklogSource.indexOf("\n---\n", at);
  return worklogSource.slice(lineStart, end === -1 ? at + 16000 : end);
};

/** The live test-file count, derived at runtime (the files member is a
 *  LIVE derivation, never a quoted figure): every *.test.ts under
 *  tests/ + src/ (skills/ excluded). At this spec's own runtime the
 *  count is 207 — the 206 delivery files + this spec itself joining
 *  as the 207th; the doc-update re-anchors the doc claim sites onto
 *  exactly this figure. */
const liveTestFileCount = (() => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    );
  const root = path.resolve(import.meta.dirname, "..");
  return [
    ...walk(path.join(root, "tests")),
    ...walk(path.join(root, "src")),
  ].filter((f) => f.endsWith(".test.ts")).length;
})();

/** The template-literal className census, derived at runtime (the
 *  A145-I2 truth — the count is scope-dependent, never a bare figure):
 *  at the src/ scope and at the 22-file layer scope. */
const countTemplateLiteralClassNames = (files: string[]): number =>
  files.reduce(
    (n, f) =>
      n +
      (readFileSync(path.resolve(import.meta.dirname, "..", f), "utf8").match(
        /className=\{`/g,
      )?.length ?? 0),
    0,
  );
const srcScopeTemplateLiterals = (() => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    );
  const root = path.resolve(import.meta.dirname, "..");
  return walk(path.join(root, "src"))
    .filter((f) => /\.(tsx|ts)$/.test(f))
    .map((f) => readFileSync(f, "utf8"))
    .reduce(
      (n, t) => n + (t.match(/className=\{`/g)?.length ?? 0),
      0,
    );
})();
const LAYER_FILES = [
  // 8 at src/components/editor/
  "src/components/editor/editor-view.tsx",
  "src/components/editor/properties-panel.tsx",
  "src/components/editor/canvas.tsx",
  "src/components/editor/ai-assistant.tsx",
  "src/components/editor/editor-store.ts",
  "src/components/editor/layers-panel.tsx",
  "src/components/editor/toolbar.tsx",
  "src/components/editor/components-panel.tsx",
  // 8 at src/components/
  "src/components/project-card.tsx",
  "src/components/login-screen.tsx",
  "src/components/teams-view.tsx",
  "src/components/recent-view.tsx",
  "src/components/dashboard-view.tsx",
  "src/components/app-header.tsx",
  "src/components/reset-password-screen.tsx",
  "src/components/logo.tsx",
  // 2 at src/hooks/
  "src/hooks/use-toast.ts",
  "src/hooks/use-media-query.ts",
  // 3 at src/lib/
  "src/lib/editor.ts",
  "src/lib/export-png.ts",
  "src/lib/ai-assistant.ts",
  // 1 at src/app/
  "src/app/globals.css",
];
const layerScopeTemplateLiterals = countTemplateLiteralClassNames(LAYER_FILES);

// ---------------------------------------------------------------------------
// S145-A — the sanctioned-set enumeration-completion registration (the
// ninety-third audit's A145-I1)
// ---------------------------------------------------------------------------

describe("S145-A the sanctioned-set enumeration-completion registration (an every-X registration's own enumeration is subject to the exhaustiveness doctrine it registers)", () => {
  it("DEFECT (worklog): the bracketed s145-enum-completion-note registers the N−1 form — the s144 note's \"the two\", the four-member live set (S55-A/S65-A/S77-E/S111-B), the phrase carriers, the self-application doctrine", () => {
    const noteAt = worklogSource.indexOf("s145-enum-completion-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 3600);
    // The finding's shape: the N−1 registration + its subject.
    expect(collapsed(note)).toMatch(/the two/i);
    expect(collapsed(note)).toMatch(/N−1|N-1/i);
    expect(collapsed(note)).toMatch(/s144-setstate-enum-note/);
    // The four members named.
    expect(collapsed(note)).toMatch(/S55-A/);
    expect(collapsed(note)).toMatch(/S65-A/);
    expect(collapsed(note)).toMatch(/S77-E/);
    expect(collapsed(note)).toMatch(/S111-B/);
    expect(collapsed(note)).toMatch(/project-card\.tsx/);
    expect(collapsed(note)).toMatch(/setFit/);
    expect(collapsed(note)).toMatch(/adoption settle|settles it there/i);
    // The phrase carriers (the s140/s141 records).
    expect(collapsed(note)).toMatch(/:3401|s140-audit-A/);
    expect(collapsed(note)).toMatch(/:3498|s141-audit-A/);
    expect(collapsed(note)).toMatch(/measure-before-paint forms S55-A\/S65-A/);
    // The zero-code-defect posture + the class.
    expect(collapsed(note)).toMatch(/zero code defect|no code defect/i);
    expect(collapsed(note)).toMatch(/A144-I1/);
    // The doctrine (the registration-self-application member).
    expect(collapsed(note)).toMatch(/subject to the exhaustiveness doctrine it registers|subject to the doctrine/i);
    expect(collapsed(note)).toMatch(/never from the finding's own examples/i);
  });

  it("SURVIVAL (source): the FOUR sanctioned setState-in-effect-execution sites live at their content forms (found by content, never by stale coordinates) — the S55-A measure, the S65-A CanvasThumbnail measure, the S77-E async-prefix re-arm, the S111-B adoption settle", () => {
    // The S55-A PresentOverlay measure: setScale inside compute(),
    // invoked once synchronously beside the resize-listener
    // registration (React's measure-before-paint idiom).
    expect(editorViewSource).toContain("React.useLayoutEffect(() => {");
    expect(editorViewSource).toContain("setScale(Math.min(width / 1000, height / 700));");
    expect(editorViewSource).toContain("compute();");
    expect(editorViewSource).toContain('window.addEventListener("resize", compute);');
    // The S65-A CanvasThumbnail measure: setFit inside measure(),
    // invoked once synchronously beside the resize-observer
    // registration — the same idiom, in project-card.
    expect(projectCardSource).toContain("React.useLayoutEffect(() => {");
    expect(projectCardSource).toContain("setFit(thumbnailFit(el.clientWidth, el.clientHeight, boxW, boxH));");
    expect(projectCardSource).toContain("measure();");
    expect(projectCardSource).toContain("the measurement lands before the first paint");
    // The S77-E async-prefix re-arm: setLoading(true) BEFORE the first
    // await, with the code's own comment placing it in the async prefix.
    expect(editorViewSource).toContain("call sits in the async prefix after the same-project skip's");
    expect(editorViewSource).toMatch(/setLoading\(true\);[\s\S]{0,400}const response = await fetch/);
    // The S111-B adoption settle: setLoading(false) in the sync body of
    // the adoption skip — the taxonomy's own "settles it there" member.
    expect(editorViewSource).toContain("the adoption path settles it there");
    expect(editorViewSource).toMatch(
      /if \(!isMountRun && useEditorStore\.getState\(\)\.projectId === projectId\) \{\s*setLoading\(false\);/,
    );
  });

  it("SURVIVAL (worklog): the frozen N−1 record located — the s144-setstate-enum-note's \"the two\" form, the s140/s141 phrase carriers riding \"S55-A/S65-A\", and the two s145 audit entries at their anchors with their 2-Informational census lines", () => {
    // The s144 note (frozen history, never rewritten — S132-C): its
    // enumeration says "the two", naming only S55-A + S77-E.
    const s144NoteAt = worklogSource.indexOf("s144-setstate-enum-note");
    expect(s144NoteAt).toBeGreaterThan(-1);
    const s144Note = worklogSource.slice(s144NoteAt, s144NoteAt + 3400);
    expect(collapsed(s144Note)).toMatch(/the two sanctioned setState-in-effect-execution sites/);
    expect(collapsed(s144Note)).toMatch(/S55-A/);
    expect(collapsed(s144Note)).toMatch(/S77-E/);
    expect(collapsed(s144Note)).not.toMatch(/S65-A/);
    // The s140/s141 phrase carriers (the records naming the PAIR).
    for (const anchor of ["digma-s140-audit-A", "digma-s141-audit-A"]) {
      const entry = auditEntry(anchor);
      expect(entry).toContain("Task ID:");
      expect(collapsed(entry)).toMatch(/measure-before-paint forms S55-A\/S65-A/);
    }
    // The two s145 audit entries with their census lines.
    for (const anchor of ["digma-s145-audit-A", "digma-s145-audit-B"]) {
      const entry = auditEntry(anchor);
      expect(entry).toContain("Task ID:");
      expect(collapsed(entry)).toMatch(
        /CENSUS: 0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 2 Informational/,
      );
    }
    // The findings themselves named in the entries.
    expect(worklogSource).toMatch(/A145-I1/);
    expect(worklogSource).toMatch(/A145-I2/);
    expect(worklogSource).toMatch(/B145-I1/);
    expect(worklogSource).toMatch(/B145-I2/);
  });
});

// ---------------------------------------------------------------------------
// S145-B — the template-literal className scope-membership registration
// (the ninety-third audit's A145-I2)
// ---------------------------------------------------------------------------

describe("S145-B the template-literal className scope-membership registration (a census riding consecutive record generations must carry its scope beside the count in EVERY generation)", () => {
  it("DEFECT (worklog): the bracketed s145-template-literal-scope-note registers the scope split — \"exactly TWO in the layer\" naming a non-layer member, the s142/s143 scopeless carry, the live 2-at-src/1-at-layer truth", () => {
    const noteAt = worklogSource.indexOf("s145-template-literal-scope-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 3000);
    // The finding's shape: the over-covering scope word.
    expect(collapsed(note)).toMatch(/in the layer/i);
    expect(collapsed(note)).toMatch(/layout\.tsx:26/);
    expect(collapsed(note)).toMatch(/properties-panel\.tsx:1656/);
    expect(collapsed(note)).toMatch(/not one of the 22|is not one of the 22/i);
    // The scope-split live truth.
    expect(collapsed(note)).toMatch(/2 at the src\/ scope|exactly 2 at the src\/ scope/i);
    expect(collapsed(note)).toMatch(/1 at the 22-file layer scope|exactly 1 at the 22-file layer scope/i);
    // The generation-carry class + the zero-code-defect posture.
    expect(collapsed(note)).toMatch(/S139-A/);
    expect(collapsed(note)).toMatch(/zero code defect|no code defect/i);
    expect(collapsed(note)).toMatch(/next\/font variable/i);
    // The doctrine (the scope-generation member).
    expect(collapsed(note)).toMatch(/in EVERY generation|in every generation/i);
  });

  it("SURVIVAL (live): the template-literal className census derived at runtime at BOTH scopes — exactly 2 at the src/ scope (the two content forms), exactly 1 at the 22-file layer scope; the s140/s141 frozen \"in the layer\" over-cover located", () => {
    // The live derivation (never a quoted figure): the fixed-string
    // count at this spec's own runtime, both scopes named.
    expect(srcScopeTemplateLiterals).toBe(2);
    expect(layerScopeTemplateLiterals).toBe(1);
    // The two src/-scope members at their content forms: the Text
    // Align button (a pair of complete literals inside the template)
    // and the next/font variable (not a utility).
    expect(propertiesPanelSource).toContain("className={`inline-flex h-8 w-10");
    expect(layoutSource).toContain("className={`${inter.variable} font-sans antialiased`}");
    // The frozen over-cover located: the s140/s141 records' phrase.
    for (const anchor of ["digma-s140-audit-A", "digma-s141-audit-A"]) {
      const entry = auditEntry(anchor);
      expect(entry).toContain("Task ID:");
      expect(collapsed(entry)).toMatch(/exactly TWO template-literal className sites in the layer/);
    }
  });
});

// ---------------------------------------------------------------------------
// S145-C — the count-family doc-set/coincidental-literal registration
// (the ninety-third audit's B145-I1)
// ---------------------------------------------------------------------------

describe("S145-C the count-family doc-set/coincidental-literal registration (a count-family census must derive its doc set from the live tree and classify frozen coincidental literals out, naming the filter)", () => {
  it("DEFECT (worklog): the bracketed s145-count-docset-note registers the doc-set mis-derivation — the brief's \"15\", the 14-live/17-repo-wide truth, the S105-H frozen literal, the 2049/207 forward collisions, the classification doctrine", () => {
    const noteAt = worklogSource.indexOf("s145-count-docset-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 3600);
    // The finding's shape: the brief's mis-derived figure.
    expect(collapsed(note)).toMatch(/15 live claim sites/i);
    expect(collapsed(note)).toMatch(/14 live claim coordinates|exactly 14/i);
    expect(collapsed(note)).toMatch(/17 claim coordinates across 6 docs|17 across 6 docs/i);
    expect(collapsed(note)).toMatch(/digma_SKILL\.md/);
    // The frozen coincidental literal classified out.
    expect(collapsed(note)).toMatch(/S105-H/);
    expect(collapsed(note)).toMatch(/editor-view 2037/);
    expect(collapsed(note)).toMatch(/line-count|line count/i);
    // The forward collisions named.
    expect(collapsed(note)).toMatch(/2049/);
    expect(collapsed(note)).toMatch(/:159/);
    expect(collapsed(note)).toMatch(/:171/);
    expect(collapsed(note)).toMatch(/:1462/);
    // The content-anchor doctrine.
    expect(collapsed(note)).toMatch(/by CONTENT|anchors by content/i);
    expect(collapsed(note)).toMatch(/classify[^.]*frozen|frozen[^.]*classify/i);
    expect(collapsed(note)).toMatch(/naming the filter/i);
  });

  it("SURVIVAL (frozen + live): the coincidental frozen literals located at their content forms — the S105-H \"editor-view 2037\" line-count row, the S112-E/S111-E \"2049\" arrows — and the live claim-form finders ride UNIT/FILES at every doc (the pair-unity form)", () => {
    // The frozen S105-H row: located by its DUAL content form — the
    // session marker AND the line-count LIST (the "editor-view 2037,
    // properties-panel 1788" enumeration) — a form only the frozen row
    // carries (the registration texts cite "editor-view 2037" alone,
    // never the full list, so the classification survives the
    // delivery's own citations).
    expect(
      padSource
        .split("\n")
        .filter((l) => l.includes("S105-H") && l.includes("editor-view 2037, properties-panel")).length,
    ).toBe(1);
    // The frozen collision arrows (the S112-E and S111-E rows).
    expect(padSource).toContain("editor-view 2049 → 2111");
    expect(padSource).toContain("editor-view 2044 → 2049");
    // The live claim forms, found by content, riding the constants —
    // every live claim site the same checks member, every files-member
    // site the same files member (the B140-I1 pair-unity doctrine).
    expect(agentsSource).toMatch(new RegExp(`\\| Unit tests \\(${UNIT} checks\\) \\| \`bun run test\` \\|`));
    expect(agentsSource).toMatch(new RegExp(`\`bun run test\` \\(${UNIT}\\) → \`bun run build\``));
    expect(claudeSource).toMatch(new RegExp(`Unit tests \\(${UNIT} checks, Vitest\\)`));
    expect(claudeSource).toMatch(new RegExp(`\\(${UNIT} unit / 73 smoke / 262 e2e\\)`));
    expect(claudeSource).toMatch(new RegExp(`Unit Tests\\*\\* \\(Vitest, ${UNIT} checks\\):`));
    expect(readmeSource).toMatch(new RegExp(`Vitest \\| 5 \\| ${UNIT} checks`));
    expect(readmeSource).toMatch(new RegExp(`# unit tests — ${UNIT} checks`));
    expect(skillSource).toContain(`project_state: "${UNIT} unit checks green`);
    expect(skillSource).toMatch(new RegExp(`≥5\\.0\\.5 \\| ${UNIT} checks`));
    expect(skillSource).toMatch(new RegExp(`bun run test\\s+# ${UNIT}/${UNIT}`));
    expect(padUnitTotalRow()).toContain(`**${FILES} files**`);
    expect(padUnitTotalRow()).toContain(`**${UNIT}**`);
    expect(padChecklistRow()).toContain(`${UNIT}/${UNIT}`);
    expect(padCommandRow()).toContain(`${UNIT} checks / ${FILES} files`);
  });
});

// ---------------------------------------------------------------------------
// S145-D — the smoke-filter coincidental-correctness registration (the
// ninety-third audit's B145-I2)
// ---------------------------------------------------------------------------

describe("S145-D the smoke-filter coincidental-correctness registration (a recorded derivation method must be the filter that yields the figure)", () => {
  it("DEFECT (worklog): the bracketed s145-smoke-filter-note registers the offsetting-errors form — the non-member subtracted, the missed prose member, the `ok \"` call-form filter, the 66+4+3 arithmetic", () => {
    const noteAt = worklogSource.indexOf("s145-smoke-filter-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 3000);
    // The finding's shape: the two offsetting errors.
    expect(collapsed(note)).toMatch(/ok\(\)|ok\(/);
    expect(collapsed(note)).toMatch(/non-member subtracted|subtracting a non-member/i);
    expect(collapsed(note)).toMatch(/:292/);
    expect(collapsed(note)).toMatch(/reset ok \(got/i);
    // The true filter + the arithmetic.
    expect(collapsed(note)).toMatch(/ok \\"|ok "/);
    expect(collapsed(note)).toMatch(/66 \+ 4 \+ 3|66\+4\+3/);
    expect(collapsed(note)).toMatch(/73/);
    // The doctrine (the offsetting-errors member).
    expect(collapsed(note)).toMatch(/offsetting errors/i);
    expect(collapsed(note)).toMatch(/never left as the method/i);
  });

  it("SURVIVAL (live): the smoke ok-call census derived at runtime by the call form — exactly 68 `ok \"` lines, the :292 prose the `ok `-grep's sole non-call member, the :46 definition matching `ok(` never `ok `, the two in-loop multi-fire sites at their content forms", () => {
    const lines = smokeSource.split("\n");
    // The true filter: the call form `ok "` — every match an invocation.
    const callLines = lines.filter((l) => l.includes('ok "'));
    expect(callLines.length).toBe(68);
    // The prose member: the `ok `-grep's sole non-call line.
    const prose = lines.filter((l) => l.includes("ok ") && !l.includes('ok "'));
    expect(prose.length).toBe(1);
    expect(prose[0]).toContain('bad "reset ok (got');
    // The function definition: matches `ok(`, never `ok `.
    const def = lines.filter((l) => l.includes("ok() {"));
    expect(def.length).toBe(1);
    expect(def[0]).not.toContain("ok ");
    // The two in-loop multi-fire sites (4x and 3x) at their forms.
    expect(smokeSource).toMatch(/ok "wrong code \$i reads/);
    expect(smokeSource).toMatch(/ok "GET \/api\/\$ENDPOINT envelope/);
    // The burn/wait loop bodies carry no ok sites INSIDE (the S141-B
    // range discipline — a loop-range citation names the exact
    // for..done span, never a freehand window that swallows the
    // post-loop guard): extract each loop's own for..done span and
    // assert it clean.
    const loopSpan = (header: string): string => {
      const at = smokeSource.indexOf(header);
      if (at === -1) return "";
      // The loop's `done` may carry leading indentation — walk line by
      // line to the first line whose trimmed content is exactly "done"
      // (the S141-B exact for..done span, never a freehand window).
      const lines = smokeSource.slice(at).split("\n");
      const span: string[] = [];
      for (const line of lines) {
        span.push(line);
        if (line.trim() === "done") break;
      }
      return span.join("\n");
    };
    expect(loopSpan("for i in $(seq 1 30); do")).not.toContain('ok "');
    expect(loopSpan("for i in $(seq 1 61); do")).not.toContain('ok "');
    expect(loopSpan("for BURN_ID in $CRUD_IDS; do")).not.toContain('ok "');
    expect(loopSpan("for i in $(seq 1 35); do")).not.toContain('ok "');
    expect(loopSpan("for i in $(seq 1 12); do")).not.toContain('ok "');
  });
});

// ---------------------------------------------------------------------------
// S145-E — the per-session pin family + the collateral (the count
// re-anchor 2049 = 2037 + 12 unit / 207 files)
// ---------------------------------------------------------------------------

describe("S145-E the per-session pin family and the collateral (the count re-anchor 2049 = 2037 + 12 unit / 207 files)", () => {
  it("SURVIVAL (worklog): the S144-A/B registrations verbatim — both bracketed notes still present at their anchors (the frozen prior-session delivery rides unchanged through the S145 registrations)", () => {
    for (const anchor of [
      "s144-setstate-enum-note",
      "s144-count-pair-epoch-note",
    ]) {
      const at = worklogSource.indexOf(anchor);
      expect(at).toBeGreaterThan(-1);
      // Back up to the line start so the "Task ID:" prefix rides the
      // slice (the s143 spec-form lesson — the anchor is mid-line).
      const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
      const head = worklogSource.slice(lineStart, lineStart + 500);
      expect(collapsed(head)).toMatch(/Task ID:/);
    }
    // The S144-A note's content still carries its registration form.
    const at = worklogSource.indexOf("s144-setstate-enum-note");
    const note = worklogSource.slice(at, at + 3400);
    expect(collapsed(note)).toMatch(/FROZEN-REACT-19-ENUMERATION-GAP REGISTRATION/);
    // The S144-B note's content still carries its registration form.
    const atB = worklogSource.indexOf("s144-count-pair-epoch-note");
    const noteB = worklogSource.slice(atB, atB + 3400);
    expect(collapsed(noteB)).toMatch(/BRIEF-LINEAGE SPLIT-EPOCH COUNT-PAIR REGISTRATION/);
  });

  it("SURVIVAL (scripts + live derivation): the s145 script provenance — live145/nav145/digma-seo-s145 tokens, the 121st/122nd/82nd ordinals, the S144 delivery at c623617, zero s144 residue — and the files member derived at runtime riding the growth-floor form", () => {
    // The s145 parity scripts ride their OWN tokens.
    expect(refAuditSource).toContain("live145");
    expect(refAuditSource).toMatch(/121st reference audit/);
    expect(refAuditSource).toContain("byte-identical the 82nd");
    expect(refAuditSource).toContain("c623617");
    expect(navSource).toContain("nav145");
    expect(navSource).toContain("digma-nav145");
    expect(navSource).toMatch(/122nd session/);
    expect(navSource).toContain("c623617");
    expect(seoSource).toContain("digma-seo-s145");
    expect(seoSource).toMatch(/session 145, S145-cycle/);
    // Zero s144 residue in the s145 scripts (the F89 family).
    for (const [src, residues] of [
      [refAuditSource, ["live144", "s154", "120th", "byte-identical the 81st", "8069cba"]],
      [navSource, ["nav144", "121st session", "121st consecutive", "8069cba"]],
      [seoSource, ["seo-s144", "session 144,"]],
    ] as const) {
      for (const residue of residues) {
        expect(src).not.toContain(residue);
      }
    }
    // The files member derived at runtime — the GROWTH-FLOOR form,
    // born rolling-safe (the B144-I1 latent-fragility lesson at the
    // assertion-body shape): the count only grows as per-session specs
    // join the tree; the exact figure is pinned by the pair-unity
    // pins above (every claim site the same members), and shrinkage
    // (a spec file leaving the tree) still trips the floor.
    expect(liveTestFileCount).toBeGreaterThanOrEqual(Number(FILES));
  });

  it("DEFECT (docs): the count re-anchor — the v1.124.0 chain entry carries the S145 derivation (2049 = 2037 + 12 unit / 207 files) + the §7.1 row for the s145 spec (the frozen record once landed; the live-pair unity carried by the pair-unity pins)", () => {
    expect(padSource).toContain("2049 = 2037 + 12 unit / 207 files");
    // The §7.1 row for the s145 spec (the per-file enumeration member).
    expect(padSource).toMatch(/\| `tests\/lows-s145\.test\.ts` \| 12 \| tests \| Vitest \|/);
    // The chain entry itself names the session (the version bump landed).
    expect(padSource).toMatch(/v1\.124\.0/);
  });
});
