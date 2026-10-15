import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-138 spec (the eighty-sixth audit's chosen work):
//
// S138-A — THE DISPATCH-BRIEF PATH-TRUTH REGISTRATION (A138-I1): the
//   audit dispatch brief's own scope enumeration mis-scoped five named
//   members against the live tree — editor-store.ts named under
//   src/lib lives at src/components/editor/editor-store.ts; parity.ts
//   named as a src/lib seam is tests/e2e/parity.spec.ts;
//   mobile-navigation named as a component is the e2e spec; theme and
//   brand-mark named as components are test files; forgot-password
//   named as a component is the login-screen's "forgot" mode. Every
//   FIGURE was live-true (the PAD §11 rows' own referents) — only the
//   PATHS were wrong (the A136-I1 brief-lineage class at its
//   path-scoping shape). Blast radius zero: the brief is not a repo
//   doc, the PAD §11 table carries the correct full paths, and the
//   audit covered the real files at their real locations. The
//   registration: the worklog's bracketed s138-dispatch-brief-path-note
//   + these path-truth pins — the count-truth doctrine extended: a
//   scope enumeration's PATHS are live claims about the tree.
//
// S138-B — THE PLAYWRIGHT-LIST COMMAND-FORM REGISTRATION (B138-I1):
//   the audit records' quoted `playwright --list` command form is not
//   copy-paste runnable — `bunx playwright --list` answers "error:
//   unknown option '--list'" while the working form `bunx playwright
//   test --list` answers "Total: 262 tests in 40 files" exactly as
//   claimed (the count live-true, only the form abbreviated). The bare
//   form appears only in frozen records (never rewritten per the
//   S132-C convention); no live claim site carries it. The
//   registration: the worklog's bracketed
//   s138-playwright-list-command-note + the live-docs pins — the
//   command-form member of the count-truth doctrine: a quoted command
//   is a live claim about a runnable tool, verify the FORM runs.
//
// The script family (the S118-C convention, s138 form): the s138
//   parity scripts ride their OWN tokens (live138 / nav138 /
//   digma-seo-s138.log, the 114th audit / 115th session / 75th clip
//   ordinals, the S137 delivery at HEAD da87a96), never the frozen
//   s137 forms.

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
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const editorSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);
const schemaSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/schema.prisma"),
  "utf8",
);
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s138.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s138.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s138.sh"),
  "utf8",
);

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The live line count of a repo file (the F101 live-pin doctrine) —
 *  the `wc -l` semantics (newline-char count), so a trailing newline
 *  never adds a phantom row the way split("\n").length does (the
 *  s138 RED-phase spec repair). */
const lineCount = (rel: string) =>
  (readFileSync(path.resolve(import.meta.dirname, rel), "utf8").match(/\n/g) ?? [])
    .length;

// ---------------------------------------------------------------------------
// S138-A — the dispatch-brief path-truth registration (A138-I1)
// ---------------------------------------------------------------------------

describe("S138-A the dispatch-brief path-truth registration (A138-I1 — the five true paths, the figures and paths pinned together)", () => {
  it("DEFECT (worklog): the bracketed s138-dispatch-brief-path-note registers the five true paths — the count-truth doctrine's path-scoping sibling", () => {
    const noteAt = worklogSource.indexOf("s138-dispatch-brief-path-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 2200);
    // The registration names the five TRUE paths.
    expect(collapsed(note)).toMatch(/src\/components\/editor\/editor-store\.ts/);
    expect(collapsed(note)).toMatch(/tests\/e2e\/parity\.spec\.ts/);
    expect(collapsed(note)).toMatch(/tests\/e2e\/mobile-navigation\.spec\.ts/);
    expect(collapsed(note)).toMatch(/tests\/theme\.test\.ts/);
    expect(collapsed(note)).toMatch(/tests\/brand-mark\.test\.ts/);
    // The finding's shape: every FIGURE live-true, only the PATHS wrong.
    expect(collapsed(note)).toMatch(/A138-I1/);
    expect(collapsed(note)).toMatch(/figures? (were |was )?live-true|live-true/i);
    expect(collapsed(note)).toMatch(/path/i);
    // The doctrine named (the count-truth family extended).
    expect(collapsed(note)).toMatch(/count-truth|F124/i);
  });

  it("SURVIVAL (tree): the five true paths exist at their real locations with the §11 figures exact — 730/1013/159/160/86 (the live-pin doctrine: paths AND counts derived from the tree)", () => {
    expect(lineCount("../src/components/editor/editor-store.ts")).toBe(730);
    expect(lineCount("../tests/e2e/parity.spec.ts")).toBe(1013);
    expect(lineCount("../tests/e2e/mobile-navigation.spec.ts")).toBe(159);
    expect(lineCount("../tests/theme.test.ts")).toBe(160);
    expect(lineCount("../tests/brand-mark.test.ts")).toBe(86);
    // The mis-scoped src/lib paths do NOT exist (the brief's error).
    for (const ghost of [
      "../src/lib/editor-store.ts",
      "../src/lib/parity.ts",
      "../src/components/editor/mobile-navigation.tsx",
      "../src/components/theme.tsx",
      "../src/components/brand-mark.tsx",
      "../src/components/forgot-password.tsx",
    ]) {
      expect(() => lineCount(ghost)).toThrow();
    }
  });

  it("SURVIVAL (docs): the PAD §11 rows name the TRUE full paths — the repo doc was never wrong (the brief-only blast radius)", () => {
    expect(padSource).toMatch(/\| `src\/components\/editor\/editor-store\.ts` \| 730 \|/);
    expect(padSource).toMatch(/\| `tests\/e2e\/parity\.spec\.ts` \| 1013 \|/);
    expect(padSource).toMatch(/\| `tests\/e2e\/mobile-navigation\.spec\.ts` \| 159 \|/);
    expect(padSource).toMatch(/\| `tests\/theme\.test\.ts` \| 160 \|/);
    expect(padSource).toMatch(/\| `tests\/brand-mark\.test\.ts` \| 86 \|/);
  });
});

// ---------------------------------------------------------------------------
// S138-B — the playwright-list command-form registration (B138-I1)
// ---------------------------------------------------------------------------

describe("S138-B the playwright-list command-form registration (B138-I1 — the working `test --list` form, the live docs clean)", () => {
  it("DEFECT (worklog): the bracketed s138-playwright-list-command-note registers the working form — `playwright test --list`, the bare form's frozen-record sites enumerated", () => {
    const noteAt = worklogSource.indexOf("s138-playwright-list-command-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 1800);
    // The working form named.
    expect(collapsed(note)).toMatch(/playwright test --list/);
    // The broken form named (the finding's subject).
    expect(collapsed(note)).toMatch(/unknown option/i);
    // The count was live-true — only the form abbreviated.
    expect(collapsed(note)).toMatch(/B138-I1/);
    expect(collapsed(note)).toMatch(/262 tests in 40 files|count (was )?live-true|live-true/i);
    // The frozen-records convention named.
    expect(collapsed(note)).toMatch(/frozen/i);
  });

  it("SURVIVAL (docs): the live command tables carry NO bare `playwright --list` form — the AGENTS Commands table and the PAD §9.2 rows quote only the runnable forms", () => {
    // The AGENTS Commands table: the e2e row rides the package script.
    expect(agentsSource).toMatch(/\| Browser E2E \(262 checks; needs a build\) \| `bun run test:e2e` \|/);
    // The §9.2 table: the same runnable form.
    expect(padSource).toMatch(/\| `bun run test:e2e` \| repo root \| Playwright suite/);
    // Neither COMMAND table carries the bare (broken) listing form. The
    // scan is scoped to the COMMAND tables themselves (the AGENTS "|"
    // rows and the PAD §9.2 section) — the frozen session bullets and
    // the §7.1 registration rows legitimately QUOTE the broken form
    // they register, and are not command tables (the s138 GREEN-phase
    // spec repair: the PAD-wide "|" scan tripped on this cycle's own
    // §7.1 collateral row quoting the form it registers).
    const agentsTableRows = agentsSource.split("\n").filter((l) => l.startsWith("|"));
    for (const row of agentsTableRows) {
      expect(row).not.toMatch(/playwright --list/);
    }
    const s92Start = padSource.indexOf("### 9.2 Common Commands");
    expect(s92Start).toBeGreaterThan(-1);
    const s92End = padSource.indexOf("### 9.3", s92Start);
    expect(s92End).toBeGreaterThan(s92Start);
    const s92 = padSource.slice(s92Start, s92End);
    for (const row of s92.split("\n").filter((l) => l.startsWith("|"))) {
      expect(row).not.toMatch(/playwright --list/);
    }
  });
});

// ---------------------------------------------------------------------------
// The standing survival set — the S137 delivery rides unchanged
// ---------------------------------------------------------------------------

describe("the standing survival set (the S137 delivery rides unchanged through the S138 registrations)", () => {
  it("SURVIVAL (source): the S137-A repaired enumeration rides unchanged — the FIVE true wrapper consumers + the FillStroke direct-seam rider", () => {
    const fnAt = panelSource.indexOf("function guardedUpdate(");
    expect(fnAt).toBeGreaterThan(-1);
    const w = panelSource.slice(Math.max(0, fnAt - 2000), fnAt);
    expect(w).toMatch(/S137-A/);
    expect(w).toMatch(/A137-I1/);
    expect(w).toMatch(/PositionSize\/CornerRadius\/Text\/Transform\/Opacity/);
    expect(w).toMatch(/FillStrokeSection/);
    expect(collapsed(w)).toMatch(/never (?:this|the) wrapper/i);
    expect(w).not.toMatch(/Text\/FillStroke\/Transform/);
  });

  it("SURVIVAL (source): the S137-B 25-field census rides unchanged — buildElementRow's return type one-to-one with the schema's writable columns", () => {
    const fnAt = editorSource.indexOf("export function buildElementRow(");
    expect(fnAt).toBeGreaterThan(-1);
    const typeStart = editorSource.indexOf("): {", fnAt);
    const typeEnd = editorSource.indexOf("} {", typeStart);
    const fields = [
      ...editorSource.slice(typeStart, typeEnd).matchAll(/^\s+([a-zA-Z]+)\??:/gm),
    ].map((m) => m[1]);
    expect(fields.length).toBe(25);
    expect(fields).toContain("fillImageThumb");
    const modelStart = schemaSource.indexOf("model DesignElement {");
    const modelEnd = schemaSource.indexOf("\n}", modelStart);
    const model = schemaSource.slice(modelStart, modelEnd);
    const columnLines = model
      .split("\n")
      .filter((l) => /^\s{2}[a-zA-Z]+\s+[A-Za-z]/.test(l) && !l.includes("@relation"));
    const writable = columnLines
      .map((l) => (/^\s{2}([a-zA-Z]+)/.exec(l))![1])
      .filter((c) => !["id", "projectId", "createdAt", "updatedAt"].includes(c));
    expect(writable.length).toBe(25);
    expect(new Set(fields)).toEqual(new Set(writable));
  });

  it("SURVIVAL (source): the patchDiffers call-site census stays 11 and the flush census stays 3", () => {
    const calls = panelSource.match(/patchDiffers\(/g) ?? [];
    expect(calls.length).toBe(11);
    const flush = canvasSource.match(/resetSliderGesture\(\);/g) ?? [];
    expect(flush.length).toBe(3);
  });

  it("SURVIVAL (docs): the §11 table names exactly 38 data rows — the count-truth pin carried forward", () => {
    const start = padSource.indexOf("## 11. Key Files Reference");
    expect(start).toBeGreaterThan(-1);
    const end = padSource.indexOf("## 12. Glossary", start);
    expect(end).toBeGreaterThan(start);
    const table = padSource.slice(start, end);
    const rows = table.match(/^\| `/gm) ?? [];
    expect(rows.length).toBe(38);
  });

  it("SURVIVAL (scripts): the s138 parity scripts ride their own tokens — live138/nav138/digma-seo-s138, the 114th/115th/75th ordinals, the S137 delivery at HEAD da87a96, zero s137 residue", () => {
    expect(refAuditSource).toContain("--session live138");
    expect(refAuditSource).toMatch(/114th reference audit/);
    expect(refAuditSource).toContain("da87a96");
    expect(refAuditSource).toContain("'clip=[Share:L385-R458,Present:L466-R551]'");
    expect(refAuditSource).toMatch(/75th/);
    expect(refAuditSource).not.toContain("live137");
    expect(refAuditSource).not.toContain("113th");
    expect(refAuditSource).not.toContain("s147");
    expect(navSource).toContain("nav138");
    expect(navSource).toMatch(/115th session/);
    expect(navSource).not.toContain("nav137");
    expect(navSource).not.toContain("114th session");
    expect(seoSource).toContain("digma-seo-s138");
    expect(seoSource).toMatch(/session 138, S138-cycle/);
    expect(seoSource).not.toContain("seo-s137");
    expect(seoSource).not.toContain("session 137, S137-cycle");
  });
});
