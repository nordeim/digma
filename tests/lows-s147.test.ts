import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-147 spec (the ninety-fifth audit's chosen work — the
// all-registration cycle, the S143–S145 precedent shape after S146's
// source-carrying pass: two Informational record-precision registrations,
// zero source edits):
//
// S147-A — THE GLYPH-COORDINATE RE-ANCHOR REGISTRATION (A147-I1): the
//   A146-I3 registration's project-card glyph coordinates
//   ("project-card:508/:518" in the frozen s146-residuals-note) were
//   captured on the PRE-S146-B tree — S146-B's own +9 insertion below
//   line 203 (the thumbnail overflow registration comment) shifted the
//   censused pair to :517/:527 live, while the current :508 is
//   coincidentally occupied by a DIFFERENT glyph (MoreHorizontal — an
//   icon-only aria-labeled button, outside the census class). The
//   re-anchor: a NEW bracketed note (frozen records never rewritten —
//   the S132-C convention) re-anchoring the members onto the live
//   :517/:527 with CONTENT-FORM identification (Pencil/Trash2 by glyph
//   name), plus the sibling observation: the teams-view:220 member sits
//   inside a parent div that itself carries aria-hidden (:218) — the
//   member is already AT-hidden, the effective outstanding
//   a11y-convergence set is NINE, not ten. The doctrine (F134 — the
//   enumeration-survival member): a census's member coordinates are
//   live claims that must survive the cycle's own edits — when the same
//   cycle's fix inserts lines above censused coordinates, the census
//   rides content-form anchors, never bare coordinates.
//
// S147-B — THE SWEEP-CENSUS ENUMERATION-COMPLETION REGISTRATION
//   (B147-I1): the s146-fixed-sleep-note's class-sweep census counted
//   19 class-b members but enumerated only 18 — session80-fixes.spec.ts:83
//   (the "flush A1 is IN FLIGHT" debounce-orchestration sleep, the
//   S81-D-hardened form) was referenced in the note ONLY as the
//   comparator ("the hardened form both [twins] lack"), never
//   enumerated in the census parenthetical with its own class-b
//   assignment. The completion: a NEW bracketed note naming session80:83
//   as the 19th class-b member (debounce-orchestration class,
//   S81-D-hardened). The doctrine (F134 — the comparator-member member):
//   a class-sweep's enumeration must be complete over its own counted
//   set — a member referenced only as a comparator is still a counted
//   member requiring its own assignment.
//
// S147-C — the per-session pin family + the collateral (the count
//   re-anchor 2073 = 2063 + 10 unit / 209 files; the v1.126.0 chain;
//   the F134 lesson).
//
// The script family (the S118-C convention, s147 form): the s147 parity
//   scripts ride their OWN tokens (live147 / nav147 / digma-seo-s147,
//   the 123rd audit / 124th session / 84th clip ordinals, the S146
//   delivery at HEAD 3cf1742), never the frozen s146 forms.

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
const projectCardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/project-card.tsx"),
  "utf8",
);
const teamsViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/teams-view.tsx"),
  "utf8",
);
const globalsSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/globals.css"),
  "utf8",
);
const editorViewSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/editor-view.tsx"),
  "utf8",
);
const session80Source = readFileSync(
  path.resolve(import.meta.dirname, "../tests/e2e/session80-fixes.spec.ts"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s147.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s147.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s147.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the CURRENT live figures 2073/209; the doc-update script
 *  re-anchors the docs and these constants TOGETHER so the pair-unity
 *  pins stay green through the transition — the rolling-safe form at
 *  birth, the s140–s146 lesson). */
const UNIT = "2085";
const FILES = "210";

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

/** The frozen audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:" prefix
 *  rides the slice; the census lines ride kilobytes past the anchor). */
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
 *  count is 209 — the 208 delivery files + this spec itself joining as
 *  the 209th; the doc-update re-anchors the doc claim sites onto
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

/** The live e2e waitForTimeout census, derived at runtime (the sweep
 *  truth — the count is a LIVE derivation, never quoted): every spec
 *  file under tests/e2e/, the instances and the carrying files both
 *  counted. Post-S146-A repair: 19 across 12. */
const waitForTimeoutCensus = (() => {
  const dir = path.resolve(import.meta.dirname, "../tests/e2e");
  const files = readdirSync(dir).filter((f) => f.endsWith(".spec.ts"));
  let instances = 0;
  const carriers: string[] = [];
  for (const f of files) {
    const text = readFileSync(path.join(dir, f), "utf8");
    const n = text.match(/waitForTimeout/g)?.length ?? 0;
    if (n > 0) {
      instances += n;
      carriers.push(f);
    }
  }
  return { instances, carriers: carriers.length };
})();

// ---------------------------------------------------------------------------
// S147-A — the glyph-coordinate re-anchor registration (the ninety-fifth
// audit's A147-I1)
// ---------------------------------------------------------------------------

describe("S147-A the glyph-coordinate re-anchor registration (a census's member coordinates are live claims that must survive the cycle's own edits — content-form over bare coordinates)", () => {
  it("DEFECT (worklog): the bracketed s147-glyph-coordinates-note registers the drift — the pre-S146-B capture, the +9 shift, the live :517/:527 at content form (Pencil/Trash2), the MoreHorizontal-at-:508 misidentification hazard, the effective-nine observation, the team.ts carry", () => {
    const noteAt = worklogSource.indexOf("s147-glyph-coordinates-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 4200);
    // The finding's shape: the A147-I1 registration with the frozen
    // record's own coordinates named.
    expect(collapsed(note)).toMatch(/A147-I1/);
    expect(collapsed(note)).toMatch(/:508\/:518/);
    expect(collapsed(note)).toMatch(/\+9/);
    expect(collapsed(note)).toMatch(/:517\/:527/);
    // The coincidental occupation named (the misidentification hazard).
    expect(collapsed(note)).toMatch(/MoreHorizontal/i);
    // The content-form doctrine (F134 — the enumeration-survival member).
    expect(collapsed(note)).toMatch(/content[- ]form/i);
    expect(collapsed(note)).toMatch(/survive the cycle's own edits/i);
    // The sibling observation: the already-AT-hidden teams-view member —
    // the effective outstanding set is nine, not ten.
    expect(collapsed(note)).toMatch(/aria-hidden/);
    expect(collapsed(note)).toMatch(/teams-view:218|teams-view:220/);
    expect(collapsed(note)).toMatch(/nine, not ten|NINE, not ten/i);
    // The team.ts carry (the out-of-layer sibling, not promoted).
    expect(collapsed(note)).toMatch(/team\.ts/);
  });

  it("SURVIVAL (live): the glyph truth at content forms — project-card carries the Pencil/Trash2 text-labeled glyphs (the re-anchored members), teams-view's Users glyph sits inside an aria-hidden parent (the already-converged member), NO bare-coordinate pin in this spec (the content-form doctrine at the assertion-body shape)", () => {
    // The re-anchored members at their content forms (the census
    // members by GLYPH NAME + adjacent text label, never coordinates).
    expect(projectCardSource).toMatch(/<Pencil\s*\/>/);
    expect(projectCardSource).toMatch(/<Trash2\s*\/>/);
    expect(projectCardSource).toContain("Rename");
    expect(projectCardSource).toContain("Delete");
    // The teams-view member's parent carries aria-hidden (the
    // already-AT-hidden form — the effective-nine observation's truth).
    // The censused member is the h-6 w-6 text-white Users glyph (the
    // content discriminator — the :139/:282 siblings carry their own
    // aria-hidden attributes and different size forms).
    const usersAt = teamsViewSource.indexOf(
      '<Users className="h-6 w-6 text-white"',
    );
    expect(usersAt).toBeGreaterThan(-1);
    const before = teamsViewSource.slice(Math.max(0, usersAt - 400), usersAt);
    expect(before).toContain("aria-hidden");
    // The doctrine at the assertion-body shape: this spec pins the
    // glyph census by CONTENT, never by line coordinates (the very
    // drift class A147-I1 registers — a coordinate pin here would
    // reproduce the defect it registers).
    expect(teamsViewSource).toMatch(
      /<Users className="h-6 w-6 text-white"\s*\/>/,
    );
  });

  it("SURVIVAL (source): the S146 source fixes still at their forms — the thumbnail ternary, the avatar code-point spread, the --color-editor-text token PRESENT (the S95-B posture surviving the S147 cycle)", () => {
    // The S146-B thumbnail ternary (the F88 form-alignment held).
    expect(projectCardSource).toContain(
      'overflow: el.type === "text" ? "hidden" : undefined,',
    );
    // The S146-C avatar code-point form (the editor-view canonical site).
    expect(editorViewSource).toContain(
      '{[...user.name.trim()][0]?.toUpperCase() ?? "D"}',
    );
    // The S95-B/S146-D token posture (the duplicate-census lesson held).
    expect(globalsSource).toContain("--color-editor-text:");
  });
});

// ---------------------------------------------------------------------------
// S147-B — the sweep-census enumeration-completion registration (the
// ninety-fifth audit's B147-I1)
// ---------------------------------------------------------------------------

describe("S147-B the sweep-census enumeration-completion registration (a class-sweep's enumeration must be complete over its own counted set — a comparator reference is not an enumeration)", () => {
  it("DEFECT (worklog): the bracketed s147-sweep-enumeration-note registers the completion — the 18-of-19 gap in the s146-fixed-sleep-note's census parenthetical, session80:83 named as the 19th class-b member (debounce-orchestration, S81-D-hardened), the comparator-is-not-enumeration doctrine", () => {
    const noteAt = worklogSource.indexOf("s147-sweep-enumeration-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 3000);
    // The finding's shape.
    expect(collapsed(note)).toMatch(/B147-I1/);
    expect(collapsed(note)).toMatch(/18 of 19|18-of-19/i);
    expect(collapsed(note)).toMatch(/session80-fixes\.spec\.ts:83|session80:83/);
    // The completed assignment: the 19th class-b member.
    expect(collapsed(note)).toMatch(/19th class-b member/i);
    expect(collapsed(note)).toMatch(/debounce[- ]orchestration/i);
    // The doctrine (F134 — the comparator-member member).
    expect(collapsed(note)).toMatch(/comparator/i);
    expect(collapsed(note)).toMatch(
      /still a counted member requiring its own assignment/i,
    );
  });

  it("SURVIVAL (live): the enumeration-completion census derived at runtime — session80-fixes.spec.ts carries exactly 2 waitForTimeout members (the :38 route-delay injection + the :83 debounce orchestration), the full sweep 19 instances across 12 spec files (the S146-A post-repair truth held through the S147 cycle)", () => {
    // The live derivation (never a quoted figure).
    expect(waitForTimeoutCensus.instances).toBe(19);
    expect(waitForTimeoutCensus.carriers).toBe(12);
    // The completed member's own file census: exactly the two class-b
    // members — the :38 route-delay injection and the :83 debounce
    // orchestration (the 19th member, now enumerated).
    expect(
      (session80Source.match(/waitForTimeout/g) ?? []).length,
    ).toBe(2);
    expect(session80Source).toContain("waitForTimeout(700)");
    expect(session80Source).toContain("waitForTimeout(1_000)");
    // The S81-D hardened form the 19th member carries (the
    // precondition assert that follows the debounce sleep).
    expect(session80Source).toContain("flush A1 is IN FLIGHT");
    expect(session80Source).toMatch(/Saving…/);
  });
});

// ---------------------------------------------------------------------------
// S147-C — the per-session pin family + the collateral (the count
// re-anchor 2073 = 2063 + 10 unit / 209 files; the v1.126.0 chain)
// ---------------------------------------------------------------------------

describe("S147-C the per-session pin family and the collateral (the count re-anchor 2073 = 2063 + 10 unit / 209 files; the all-registration cycle's zero §11 changes)", () => {
  it("SURVIVAL (worklog): the S146 registrations verbatim — all four bracketed notes still present at their anchors (the frozen prior-session delivery rides unchanged through the S147 registrations)", () => {
    for (const anchor of [
      "s146-fixed-sleep-note",
      "s146-thumbnail-overflow-note",
      "s146-avatar-codepoint-note",
      "s146-residuals-note",
    ]) {
      const at = worklogSource.indexOf(anchor);
      expect(at).toBeGreaterThan(-1);
      // Back up to the line start so the "Task ID:" prefix rides the
      // slice (the s143 spec-form lesson — the anchor is mid-line).
      const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
      const head = worklogSource.slice(lineStart, lineStart + 500);
      expect(collapsed(head)).toMatch(/Task ID:/);
    }
    // The S146-D note's content still carries its registration form.
    const at = worklogSource.indexOf("s146-residuals-note");
    const note = worklogSource.slice(at, at + 4200);
    expect(collapsed(note)).toMatch(/duplicate census|duplicate-census/i);
    expect(collapsed(note)).toMatch(/an already-registered posture is not a finding/i);
  });

  it("DEFECT (worklog): the two s147 audit entries at their anchors with their census lines, and the combined 0C/0H/0M/0L/2I census carried (the ninety-fifth Mode C audit)", () => {
    // Auditor A's entry: the client-layer census.
    const entryA = auditEntry("digma-s147-audit-A");
    expect(entryA).toContain("Task ID:");
    expect(collapsed(entryA)).toMatch(
      /Census: 0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 1 Informational/,
    );
    // Auditor B's entry: the server/infra/e2e census.
    const entryB = auditEntry("digma-s147-audit-B");
    expect(entryB).toContain("Task ID:");
    expect(collapsed(entryB)).toMatch(
      /Census: 0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 1 Informational/,
    );
    // The findings themselves named in the entries.
    for (const finding of ["A147-I1", "B147-I1"]) {
      expect(worklogSource).toContain(finding);
    }
  });

  it("SURVIVAL (scripts + live derivation): the s147 script provenance — live147/nav147/digma-seo-s147 tokens, the 123rd/124th/84th ordinals, the S146 delivery at 3cf1742, zero s146 residue — and the files member derived at runtime riding the growth-floor form", () => {
    // The s147 parity scripts ride their OWN tokens.
    expect(refAuditSource).toContain("live147");
    expect(refAuditSource).toMatch(/123rd reference audit/);
    expect(refAuditSource).toContain("byte-identical the 84th");
    expect(refAuditSource).toContain("3cf1742");
    expect(navSource).toContain("nav147");
    expect(navSource).toContain("digma-nav147");
    expect(navSource).toMatch(/124th session/);
    expect(navSource).toContain("3cf1742");
    expect(seoSource).toContain("digma-seo-s147");
    expect(seoSource).toMatch(/session 147, S147-cycle/);
    // Zero s146 residue in the s147 scripts (the F89 family).
    for (const [src, residues] of [
      [refAuditSource, ["live146", "s156", "122nd", "byte-identical the 83rd", "f06ad89"]],
      [navSource, ["nav146", "123rd session", "123rd consecutive", "f06ad89"]],
      [seoSource, ["seo-s146", "session 146,"]],
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

  it("DEFECT (docs): the count re-anchor — the v1.126.0 chain entry carries the S147 derivation (2073 = 2063 + 10 unit / 209 files) + the §7.1 row for the s147 spec", () => {
    expect(padSource).toContain("2073 = 2063 + 10 unit / 209 files");
    // The §7.1 row for the s147 spec (the per-file enumeration member —
    // 10 pins, the cycle's own census).
    expect(padSource).toMatch(/\| `tests\/lows-s147\.test\.ts` \| 10 \| tests \| Vitest \|/);
    // The chain entry itself names the session (the version bump landed).
    expect(padSource).toMatch(/v1\.126\.0/);
  });

  it("SURVIVAL (docs): the pair-unity claim forms riding the constants at every doc — the frozen coincidental literals classified out (the B145-I1 doctrine), every live claim site the same members", () => {
    // The frozen S105-H row: located by its DUAL content form — the
    // classification that survives every re-anchor's own citations.
    expect(
      padSource
        .split("\n")
        .filter((l) => l.includes("S105-H") && l.includes("editor-view 2037, properties-panel")).length,
    ).toBe(1);
    // The frozen collision arrows (the S112-E and S111-E rows) —
    // frozen editor-view line counts, never live claims.
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
    expect(skillSource).toMatch(new RegExp(`≥5\\.0\\.1 \\| ${UNIT} checks`));
    expect(skillSource).toMatch(new RegExp(`bun run test\\s+# ${UNIT}/${UNIT}`));
    expect(padUnitTotalRow()).toContain(`**${FILES} files**`);
    expect(padUnitTotalRow()).toContain(`**${UNIT}**`);
    expect(padChecklistRow()).toContain(`${UNIT}/${UNIT}`);
    expect(padCommandRow()).toContain(`${UNIT} checks / ${FILES} files`);
  });
});
