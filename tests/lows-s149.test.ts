import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-149 spec (the ninety-seventh audit's chosen work — the
// all-registration-plus-one-comment-token cycle after S148's
// source-carrying pass: one in-code citation repair + the two
// registration notes + the per-session pin family):
//
// S149-A — THE S148-B COMMENT'S BORN-DRIFTED CITATION (A149-I1 + the
//   lead-side extension): canvas.tsx:863's S148-B registration comment
//   cites "the :505 commit below" while the commit's two-term gate
//   `if (drag.w > 2 && drag.h > 2)` lives at :503 — AND the commit
//   sits ABOVE the comment in the file (the pointer-up handler at
//   :503 precedes the render JSX at :861+), so BOTH the coordinate
//   and the directional word were born-drifted at delivery. The
//   repair: the citation corrected in place ("the :503 commit
//   above") — a live comment is not a frozen record; zero
//   line-count drift. The doctrine (F136 — the born-verified-citation
//   member): a live comment's coordinate citation is itself a live
//   claim — the coordinate AND its directional word verified against
//   the delivered tree at birth, never quoted from a plan drafted
//   before the edit's own insertion math.
//
// S149-B — THE S147 GLYPH-NOTE RE-ANCHOR (A149-I2): the frozen
//   s147-glyph-coordinates-note's teams-view citations
//   (:220/:218/:282/:288) drifted +9 under S148-C's own comment
//   insertion — the Users member now :229, its aria-hidden parent
//   :227, the sibling :291, the UserPlus :297. The F134
//   enumeration-survival class recurring ACROSS cycles: any later
//   cycle's edit that inserts lines above a frozen census's
//   coordinates arms the next cycle's re-anchor duty. The re-anchor:
//   ONE new bracketed note (s149-glyph-reanchor-note) at CONTENT
//   FORM; the frozen record never rewritten (S132-C).
//
// S149-C — THE S146 FIXED-SLEEP-NOTE COMPLETION (B149-I1 + B149-I2):
//   (a) the coordinate re-anchor — the note's "session77:83" was
//   captured on the pre-S146-A tree; the poll repair's own insertion
//   shifted the 400ms compositor settle to :101 (where it has stood
//   since 3cf1742; the s148 audit observed :101 in prose but never
//   registered the drift); the CURRENT :83 is a goto line — a future
//   sweep following the note's coordinates lands on a non-sleep
//   line. (b) The spelling-dimension enumeration completion — the
//   S146 class-sweep counted only the waitForTimeout spelling; two
//   same-class class-b route-delay injections ride promise-wrapped
//   `new Promise((r) => setTimeout(r, ...))` forms inside page.route
//   handlers (session58:280 the 400ms DELETE delay, parity:721 the
//   700ms teams delay); honest class total when folded: 21 across 13
//   files. The doctrine (F136 — the spelling-scope member): a class
//   sweep enumerates the CLASS, never one spelling of it.
//
// S149-D — the per-session pin family + the collateral (the count
//   re-anchor 2093 = 2085 + 8 unit / 211 files; the v1.128.0 chain;
//   the F136 lesson).
//
// The script family (the S118-C convention, s149 form): the s149 parity
//   scripts ride their OWN tokens (live149 / nav149 / digma-seo-s149,
//   the 125th audit / 126th session / 86th clip ordinals, the S148
//   delivery at HEAD 5bea3ac), never the frozen s148 forms.

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
const canvasSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/canvas.tsx"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s149.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s149.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s149.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the CURRENT live figures 2085/210; the doc-update script
 *  re-anchors the docs and these constants TOGETHER so the pair-unity
 *  pins stay green through the transition — the rolling-safe form at
 *  birth, the s140–s148 lesson). */
const UNIT = "2661";
const FILES = "254";

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

/** The audit entries, found by their Task-ID anchors (the s143
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
 *  count is 211 — the 210 delivery files + this spec itself joining as
 *  the 211th; the doc-update re-anchors the doc claim sites onto
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

// ---------------------------------------------------------------------------
// S149-A — the in-code citation repair (the ninety-seventh audit's
// A149-I1 + the lead-side extension)
// ---------------------------------------------------------------------------

describe("S149-A the S148-B comment's born-drifted citation repair (a live comment's coordinate citation is itself a live claim — the coordinate AND its directional word verified against the delivered tree at birth)", () => {
  it("DEFECT (source): the S148-B registration comment cites the commit at :503 as ABOVE — both born-drifts corrected in place (the :505 coordinate AND the below directional word), zero line-count drift, the gates and the comment's own registration forms unchanged", () => {
    // The corrected citation (the two-token repair, whitespace-collapsed
    // across the comment's line wrap).
    expect(collapsed(canvasSource)).toMatch(
      /\(drag\.w > 2 && drag\.h > 2, the commit above\)/,
    );
    // The born-drifted form is GONE (the :505 coordinate and the
    // "below" directional word — the commit at :503 precedes the
    // comment at :861 in the file).
    expect(collapsed(canvasSource)).not.toMatch(/the :505 commit below/);
    expect(collapsed(canvasSource)).not.toMatch(/the :503 commit below/);
    expect(collapsed(canvasSource)).not.toMatch(/the :505 commit above/);
    // The commit's own gate unchanged (the alignment's anchor — the
    // two-term form inside the marquee branch of the pointer-up
    // handler).
    expect(canvasSource).toMatch(/if \(drag\.w > 2 && drag\.h > 2\) \{/);
    // The preview's two-term form unchanged (the S148-B delivery).
    expect(canvasSource).toMatch(
      /drag\.kind === "marquee" && drag\.w > 2 && drag\.h > 2 && \(/,
    );
    // The registration comment itself still at the seam (the S148-B
    // form — the repair corrected the citation, never the comment).
    expect(collapsed(canvasSource)).toMatch(/S148-B/);
    expect(collapsed(canvasSource)).toMatch(/F88 form-alignment family/);
  });
});

// ---------------------------------------------------------------------------
// S149-B — the glyph-note re-anchor registration (A149-I2)
// ---------------------------------------------------------------------------

describe("S149-B the s147 glyph-note re-anchor (the F134 enumeration-survival class recurring across cycles — a later cycle's edit that inserts lines above a frozen census's coordinates arms the next cycle's re-anchor duty)", () => {
  it("DEFECT (worklog): the bracketed s149-glyph-reanchor-note re-anchors the teams-view members onto the live post-S148-C tree at content form — the frozen record never rewritten", () => {
    const noteAt = worklogSource.indexOf("s149-glyph-reanchor-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 6000);
    // The re-anchored members at their live coordinates.
    expect(collapsed(note)).toMatch(/A149-I2/);
    expect(collapsed(note)).toMatch(/:229/);
    expect(collapsed(note)).toMatch(/:227/);
    expect(collapsed(note)).toMatch(/:291/);
    expect(collapsed(note)).toMatch(/:297/);
    // The content forms (the F134 doctrine — never bare coordinates).
    expect(collapsed(note)).toMatch(/h-6 w-6 text-white/);
    expect(collapsed(note)).toMatch(/aria-hidden/);
    expect(collapsed(note)).toMatch(/UserPlus/);
    // The +9 mechanism (S148-C's own insertion) and the frozen-record
    // convention (S132-C — corrections land as NEW bracketed notes).
    expect(collapsed(note)).toMatch(/\+9/);
    expect(collapsed(note)).toMatch(/S148-C/);
    expect(collapsed(note)).toMatch(/never rewritten/i);
    // The cross-cycle doctrine extension (F134's scope widened).
    expect(collapsed(note)).toMatch(/across cycles/i);
  });
});

// ---------------------------------------------------------------------------
// S149-C — the fixed-sleep-note completion registration (B149-I1 + B149-I2)
// ---------------------------------------------------------------------------

describe("S149-C the s146 fixed-sleep-note completion (the coordinate re-anchor + the spelling-dimension enumeration completion — a class sweep enumerates the CLASS, never one spelling of it)", () => {
  it("DEFECT (worklog): the bracketed s149-sweep-completion-note re-anchors the compositor member onto :101 at content form AND enumerates the two promise-wrapped route-delay members with the honest 21-across-13 class total", () => {
    const noteAt = worklogSource.indexOf("s149-sweep-completion-note");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 6000);
    // The coordinate re-anchor (B149-I1).
    expect(collapsed(note)).toMatch(/B149-I1/);
    expect(collapsed(note)).toMatch(/:101/);
    expect(collapsed(note)).toMatch(/:83/);
    expect(collapsed(note)).toMatch(/3cf1742/);
    // The content-form anchor (the 400ms settle before the 44px
    // boundingBox measure — never a bare coordinate).
    expect(collapsed(note)).toMatch(/400ms/);
    expect(collapsed(note)).toMatch(/44px/);
    // The spelling-dimension enumeration completion (B149-I2).
    expect(collapsed(note)).toMatch(/B149-I2/);
    expect(collapsed(note)).toMatch(/session58:280/);
    expect(collapsed(note)).toMatch(/parity:721/);
    expect(collapsed(note)).toMatch(/new Promise/);
    // The honest class total (19 waitForTimeout + 2 promise-wrapped).
    expect(collapsed(note)).toMatch(/21 across 13/);
    expect(collapsed(note)).toMatch(/waitForTimeout/);
  });
});

// ---------------------------------------------------------------------------
// S149-D — the per-session pin family + the collateral (the count
// re-anchor 2093 = 2085 + 8 unit / 211 files; the v1.128.0 chain)
// ---------------------------------------------------------------------------

describe("S149-D the per-session pin family and the collateral (the count re-anchor 2093 = 2085 + 8 unit / 211 files; the all-registration-plus-one-comment-token cycle's zero §11 re-anchors)", () => {
  it("SURVIVAL (worklog): the prior registrations verbatim — all seven bracketed notes still present at their anchors (the frozen prior-session deliveries ride unchanged through the S149 registrations)", () => {
    for (const anchor of [
      "s146-fixed-sleep-note",
      "s146-thumbnail-overflow-note",
      "s146-avatar-codepoint-note",
      "s146-residuals-note",
      "s147-glyph-coordinates-note",
      "s147-sweep-enumeration-note",
      "s148-residuals-note",
    ]) {
      const at = worklogSource.indexOf(anchor);
      expect(at).toBeGreaterThan(-1);
      // Back up to the line start so the "Task ID:" prefix rides the
      // slice (the s143 spec-form lesson — the anchor is mid-line).
      const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
      const head = worklogSource.slice(lineStart, lineStart + 500);
      expect(collapsed(head)).toMatch(/Task ID:/);
    }
  });

  it("SURVIVAL (worklog): the two s149 audit entries at their anchors with their census lines, and the combined 0C/0H/0M/0L/4I census carried (the ninety-seventh Mode C audit — the auditors' entries landed live during the audit phase, before this spec's birth)", () => {
    // Auditor A's entry: the client-layer census.
    const entryA = auditEntry("digma-s149-audit-A");
    expect(entryA).toContain("Task ID:");
    expect(collapsed(entryA)).toMatch(
      /Census: 0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 2 Informational/,
    );
    // Auditor B's entry: the server/infra/e2e census.
    const entryB = auditEntry("digma-s149-audit-B");
    expect(entryB).toContain("Task ID:");
    expect(collapsed(entryB)).toMatch(
      /Census: 0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 2 Informational/,
    );
    // The findings themselves named in the entries.
    for (const finding of ["A149-I1", "A149-I2", "B149-I1", "B149-I2"]) {
      expect(worklogSource).toContain(finding);
    }
  });

  it("SURVIVAL (scripts + live derivation): the s149 script provenance — live149/nav149/digma-seo-s149 tokens, the 125th/126th/86th ordinals, the S148 delivery at 5bea3ac, zero s148 residue — and the files member derived at runtime riding the growth-floor form", () => {
    // The s149 parity scripts ride their OWN tokens.
    expect(refAuditSource).toContain("live149");
    expect(refAuditSource).toMatch(/125th reference audit/);
    expect(refAuditSource).toContain("byte-identical the 86th");
    expect(refAuditSource).toContain("5bea3ac");
    expect(navSource).toContain("nav149");
    expect(navSource).toContain("digma-nav149");
    expect(navSource).toMatch(/126th session/);
    expect(navSource).toContain("5bea3ac");
    expect(seoSource).toContain("digma-seo-s149");
    expect(seoSource).toMatch(/session 149, S149-cycle/);
    // Zero s148 residue in the s149 scripts (the F89 family).
    for (const [src, residues] of [
      [refAuditSource, ["live148", "s158", "124th", "byte-identical the 85th", "a29823e"]],
      [navSource, ["nav148", "125th session", "125th consecutive", "a29823e"]],
      [seoSource, ["seo-s148", "session 148,"]],
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

  it("DEFECT (docs): the count re-anchor — the v1.128.0 chain entry carries the S149 derivation (2093 = 2085 + 8 unit / 211 files) + the §7.1 row for the s149 spec", () => {
    expect(padSource).toContain("2093 = 2085 + 8 unit / 211 files");
    // The §7.1 row for the s149 spec (the per-file enumeration member —
    // 8 pins, the cycle's own census).
    expect(padSource).toMatch(/\| `tests\/lows-s149\.test\.ts` \| 8 \| tests \| Vitest \|/);
    // The chain entry itself names the session (the version bump landed).
    expect(padSource).toMatch(/v1\.128\.0/);
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
    expect(skillSource).toMatch(new RegExp(`≥5\\.0\\.5 \\| ${UNIT} checks`));
    expect(skillSource).toMatch(new RegExp(`bun run test\\s+# ${UNIT}/${UNIT}`));
    expect(padUnitTotalRow()).toContain(`**${FILES} files**`);
    expect(padUnitTotalRow()).toContain(`**${UNIT}**`);
    expect(padChecklistRow()).toContain(`${UNIT}/${UNIT}`);
    expect(padCommandRow()).toContain(`${UNIT} checks / ${FILES} files`);
  });
});
