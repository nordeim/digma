import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-150 spec (the ninety-eighth audit's chosen work — the
// cross-document-citation-repair/execution-record-tick cycle after
// S149's all-registration-plus-one-comment-token pass: one in-code
// cross-document citation repair + the plan-execution-record tick +
// the per-session pin family):
//
// S150-A — THE S96-C PROVENANCE COMMENT'S CROSS-DOCUMENT CITATION
//   (A150-I1): canvas.tsx:950's S96-C selection-ring provenance
//   comment cites "PAD:1375" as the record proving the reference's
//   ring classes inert — the citation was BORN-DRIFTED (at the S96
//   parent commit 75a784b^ PAD:1375 WAS the RA-14…RA-20 row; the
//   S96 cycle's own PAD v1.75.0 revision block prepended 8 lines, so
//   the record landed at :1383 in the delivered tree — the in-code
//   token was quoted from the s96 plan, never re-derived against the
//   delivered tree, the exact F136 mechanism) and has since drifted
//   +362 (the live PAD:1375 is the F51 lesson body; the record lives
//   at :1737 today). The repair: the bare coordinate replaced by the
//   CONTENT-FORM anchor — "the PAD's RA-14…RA-20 re-measure record"
//   (unique in the PAD) — a live comment is not a frozen record;
//   zero line-count drift. The doctrine (F137 — the
//   cross-document-citation member): a live comment citing ANOTHER
//   document's coordinate must ride a content-form anchor — the
//   record's own name — never a bare line coordinate of a document
//   that re-versions with prepended blocks every cycle.
//
// S150-B — THE S149 PLAN'S UNTICKED EXECUTION RECORD (B150-I1): the
//   s149 remediation plan's seven execution boxes shipped `- [ ]` at
//   its own delivery commit b2ebe05 — the lone departure from the
//   S146/S147/S148 convention (8/6/8 boxes ticked at their single
//   delivery commits); a future reader auditing the cycle by its
//   plan's execution record reads the delivery as unexecuted. The
//   repair: the seven-box tick pass (the delivery-receipt convention
//   restored in place). The doctrine (F137 — the
//   plan-execution-record member): a remediation plan's execution
//   record ships TICKED in its own delivery commit — the record is
//   the delivery's receipt.
//
// S150-C — the per-session pin family + the collateral (the count
//   re-anchor 2100 = 2093 + 7 unit / 212 files; the v1.129.0 chain;
//   the F137 lesson).
//
// The script family (the S118-C convention, s150 form): the s150 parity
//   scripts ride their OWN tokens (live150 / nav150 / digma-seo-s150,
//   the 126th audit / 127th session / 87th clip ordinals, the S149
//   delivery at HEAD b2ebe05), never the frozen s149 forms.

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
const s149PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session149.md"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s150.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s150.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s150.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the CURRENT live figures 2093/211; the doc-update script
 *  re-anchors the docs and these constants TOGETHER so the pair-unity
 *  pins stay green through the transition — the rolling-safe form at
 *  birth, the s140–s149 lesson). */
const UNIT = "2685";
const FILES = "256";

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
 *  count is 212 — the 211 delivery files + this spec itself joining as
 *  the 212th; the doc-update re-anchors the doc claim sites onto
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
// S150-A — the in-code cross-document citation repair (the ninety-eighth
// audit's A150-I1)
// ---------------------------------------------------------------------------

describe("S150-A the S96-C comment's cross-document citation repair (a live comment citing ANOTHER document must ride a content-form anchor — never a bare line coordinate of a document that re-versions with prepended blocks every cycle)", () => {
  it("DEFECT (source): the S96-C provenance comment's PAD citation repaired in place — the content-form anchor (the RA-14…RA-20 re-measure record) replaces the born-drifted bare coordinate, zero line-count drift, the ring value and the #484f58 convention forms unchanged", () => {
    // The repaired citation (the content-form anchor, whitespace-
    // collapsed across the comment's line wrap).
    expect(collapsed(canvasSource)).toMatch(
      /box-shadow: none — the PAD's RA-14…RA-20 re-measure record\)/,
    );
    // The born-drifted bare coordinate is GONE (the lone PAD-coordinate
    // citation in src/ at the audit).
    expect(canvasSource).not.toContain("PAD:1375");
    expect(canvasSource).not.toMatch(/PAD:\d+/);
    // The ring's own value unchanged (the alignment's anchor — the
    // working-superset paint).
    expect(canvasSource).toMatch(
      /boxShadow: selected \? "0 0 0 2px rgba\(59, 130, 246, 0\.9\)" : undefined,/,
    );
    // The registration comment's own forms unchanged (the S96-C
    // delivery — the repair corrected the citation, never the comment).
    expect(collapsed(canvasSource)).toMatch(/#484f58 convention/);
    expect(collapsed(canvasSource)).toMatch(/working-superset paint/);
    // The content-form anchor's target is UNIQUE in the PAD (the
    // drift-resistant form — the record's own row-header shape; the
    // bare RA-14…RA-20 token now also rides the delivery's own doc
    // citations — the v1.129.0 chain entry + the §7.1 row — so the
    // uniqueness pins the RECORD, never the bare token).
    expect(
      padSource.match(/The reference re-measured live \(RA-14…RA-20\)/g)
        ?.length,
    ).toBe(1);
    // The target record carries the datum the comment describes.
    expect(
      collapsed(
        padSource
          .split("\n")
          .find((l) => l.includes("The reference re-measured live (RA-14…RA-20)")) ?? "",
      ),
    ).toMatch(/box-shadow: none/);
  });
});

// ---------------------------------------------------------------------------
// S150-B — the plan-execution-record tick pass (B150-I1)
// ---------------------------------------------------------------------------

describe("S150-B the s149 plan's execution-record tick pass (a remediation plan's execution record ships TICKED in its own delivery commit — the record is the delivery's receipt, and an unticked record reads as an unexecuted delivery)", () => {
  it("DEFECT (docs): the s149 plan's seven execution boxes ticked in place — the S146-S148 delivery-receipt convention restored, zero unticked boxes remaining", () => {
    // All seven boxes ticked (the S149 delivery re-verified live at the
    // audit: the citation repair, the two notes, the 8-pin spec, the
    // count family, the docs, the gate+push — every step executed).
    expect(s149PlanSource.match(/- \[x\]/g)?.length).toBe(7);
    // Zero unticked boxes remaining in the plan's execution record.
    expect(s149PlanSource).not.toContain("- [ ]");
    // The execution record's own section still present (the repair
    // ticked the boxes, never removed the record).
    expect(s149PlanSource).toMatch(/## Execution record/);
    // The S146-S148 precedent form (the convention this restores —
    // every prior plan in the s140-s149 range fully ticked).
    for (const i of [146, 147, 148]) {
      const plan = readFileSync(
        path.resolve(
          import.meta.dirname,
          `../docs/remediation-plan-session${i}.md`,
        ),
        "utf8",
      );
      expect(plan).not.toContain("- [ ]");
    }
  });
});

// ---------------------------------------------------------------------------
// S150-C — the per-session pin family + the collateral (the count
// re-anchor 2100 = 2093 + 7 unit / 212 files; the v1.129.0 chain)
// ---------------------------------------------------------------------------

describe("S150-C the per-session pin family and the collateral (the count re-anchor 2100 = 2093 + 7 unit / 212 files; the cross-document-citation/execution-record cycle's zero §11 re-anchors)", () => {
  it("SURVIVAL (worklog): the prior registrations verbatim — all nine bracketed notes still present at their anchors (the frozen prior-session deliveries ride unchanged through the S150 registrations)", () => {
    for (const anchor of [
      "s146-fixed-sleep-note",
      "s146-thumbnail-overflow-note",
      "s146-avatar-codepoint-note",
      "s146-residuals-note",
      "s147-glyph-coordinates-note",
      "s147-sweep-enumeration-note",
      "s148-residuals-note",
      "s149-glyph-reanchor-note",
      "s149-sweep-completion-note",
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

  it("SURVIVAL (worklog): the two s150 audit entries at their anchors with their census claims, and the combined 0C/0H/0M/0L/2I census carried (the ninety-eighth Mode C audit — the auditors' entries landed live during the audit phase, before this spec's birth; one spec-form repair at birth: auditor A's entry carries its census as the prose lead of its Stage Summary — the 22-file layer clean at every audited dimension with the one Informational finding named — while auditor B's carries the standard census line; the spec pins each entry at its own live form, the S147 spec-form-repair-at-birth convention)", () => {
    // Auditor A's entry: the client-layer census (the prose form — the
    // entry's Stage Summary leads with the clean-dimension claim and
    // names the one Informational finding).
    const entryA = auditEntry("digma-s150-audit-A");
    expect(entryA).toContain("Task ID:");
    expect(collapsed(entryA)).toMatch(/clean at every audited dimension/);
    expect(collapsed(entryA)).toMatch(/A150-I1/);
    expect(collapsed(entryA)).toMatch(/\(Informational/);
    // Auditor B's entry: the server/infra/e2e census (the standard
    // census-line form).
    const entryB = auditEntry("digma-s150-audit-B");
    expect(entryB).toContain("Task ID:");
    expect(collapsed(entryB)).toMatch(
      /Census: 0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 1 Informational/,
    );
    expect(collapsed(entryB)).toMatch(/B150-I1/);
    // The findings themselves named in the entries.
    for (const finding of ["A150-I1", "B150-I1"]) {
      expect(worklogSource).toContain(finding);
    }
  });

  it("SURVIVAL (scripts + live derivation): the s150 script provenance — live150/nav150/digma-seo-s150 tokens, the 126th/127th/87th ordinals, the S149 delivery at b2ebe05, zero s149 residue — and the files member derived at runtime riding the growth-floor form", () => {
    // The s150 parity scripts ride their OWN tokens.
    expect(refAuditSource).toContain("live150");
    expect(refAuditSource).toMatch(/126th reference audit/);
    expect(refAuditSource).toContain("byte-identical the 87th");
    expect(refAuditSource).toContain("b2ebe05");
    expect(navSource).toContain("nav150");
    expect(navSource).toContain("digma-nav150");
    expect(navSource).toMatch(/127th session/);
    expect(navSource).toContain("b2ebe05");
    expect(seoSource).toContain("digma-seo-s150");
    expect(seoSource).toMatch(/session 150, S150-cycle/);
    // Zero s149 residue in the s150 scripts (the F89 family).
    for (const [src, residues] of [
      [refAuditSource, ["live149", "s159", "125th", "byte-identical the 86th", "5bea3ac"]],
      [navSource, ["nav149", "126th session", "126th consecutive", "5bea3ac"]],
      [seoSource, ["seo-s149", "session 149,"]],
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

  it("DEFECT (docs): the count re-anchor — the v1.129.0 chain entry carries the S150 derivation (2100 = 2093 + 7 unit / 212 files) + the §7.1 row for the s150 spec", () => {
    expect(padSource).toContain("2100 = 2093 + 7 unit / 212 files");
    // The §7.1 row for the s150 spec (the per-file enumeration member —
    // 7 pins, the cycle's own census).
    expect(padSource).toMatch(/\| `tests\/lows-s150\.test\.ts` \| 7 \| tests \| Vitest \|/);
    // The chain entry itself names the session (the version bump landed).
    expect(padSource).toMatch(/v1\.129\.0/);
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
