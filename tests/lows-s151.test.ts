import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-151 spec (the ninety-ninth audit's chosen work — the
// receipt-integrity cycle after S150's citation-and-receipt pass: one
// plan-execution-record tick + the falsified-claim registration + the
// F138 spec-pinned-receipt doctrine + the per-session pin family):
//
// S151-A — THE S150 PLAN'S UNTICKED EXECUTION RECORD (B151-I1,
//   independently observed by both auditors as A151-I1/B151-I1 — the
//   dual observation the cross-confirmation): the s150 remediation
//   plan's six execution boxes shipped `- [ ]` at its own delivery
//   commit 7b200e1 — the file's only commit — and stand unticked at
//   HEAD, the B150-I1 class recurring one generation later IN THE VERY
//   CYCLE THAT REGISTERED the F137 delivery-receipt doctrine (the plan's
//   own §2, the worklog lead entry, the AGENTS bullet, and F137's own
//   text all declared "the s150 plan itself ships TICKED at its own
//   delivery commit" — the live claim falsified by the delivered tree).
//   The structural gap: tests/lows-s150.test.ts pins the s149 plan's
//   ticked record but has NO pin on the s150 plan's own boxes — the
//   spec gate structurally could not catch the departure. The repair:
//   the six-box tick pass in place (the S146–S148/S150-B precedent for
//   a live plan's record). NOTE: the s150 plan's PROSE carries one
//   "(`- [ ]` → `- [x]`)" literal at its §2 — the tick pin therefore
//   scopes to the EXECUTION-RECORD SECTION (from the "## Execution
//   record" heading), never the whole file.
//
// S151-B — THE RECEIPT-INTEGRITY REGISTRATION: (a) the bracketed
//   s151-receipt-note in the worklog registering the falsified "ships
//   TICKED" claim (the S132-C convention — frozen records never
//   rewritten, corrections land as new notes); (b) the F138 doctrine
//   (the spec-pinned-receipt member): a delivery-receipt convention
//   that rides only its prose declaration ships violated by the very
//   cycle that registers it — the receipt must ride the NEXT cycle's
//   per-session spec pin (the prior plan's boxes pinned `[x]` at the
//   spec's birth), so an unticked delivery record fails a gate instead
//   of riding a green suite; the mechanical guard is always one cycle
//   behind by construction, which is exactly its point — the violation
//   becomes visible at the very next cycle's spec birth, never riding
//   two green cycles. THIS spec is that guard's first instance: the
//   S151-A pin below pins the PRIOR (s150) plan's record state.
//
// S151-C — the per-session pin family + the collateral (the count
//   re-anchor 2108 = 2100 + 8 unit / 213 files; the v1.130.0 chain;
//   the F138 lesson).
//
// The script family (the S118-C convention, s151 form): the s151 parity
//   scripts ride their OWN tokens (live151 / nav151 / digma-seo-s151,
//   the 127th audit / 128th session / 88th clip ordinals, the S150
//   delivery at HEAD 7b200e1), never the frozen s150 forms.

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
const s150PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session150.md"),
  "utf8",
);
const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s151.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s151.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s151.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the CURRENT live figures 2100/212; the doc-update script
 *  re-anchors the docs and these constants TOGETHER so the pair-unity
 *  pins stay green through the transition — the rolling-safe form at
 *  birth, the s140–s150 lesson). */
const UNIT = "2361";
const FILES = "231";

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
 *  count is 213 — the 212 delivery files + this spec itself joining as
 *  the 213th; the doc-update re-anchors the doc claim sites onto
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
// S151-A — the plan-execution-record tick pass (the ninety-ninth
// audit's B151-I1 — THIS PIN IS THE F138 MECHANICAL GUARD'S FIRST
// INSTANCE: the prior plan's record state pinned at the spec's birth)
// ---------------------------------------------------------------------------

describe("S151-A the s150 plan's execution-record tick pass (a remediation plan's execution record ships TICKED in its own delivery commit — the record is the delivery's receipt; the F138 spec-pinned-receipt guard: the prior plan's boxes pinned here, so an unticked delivery record fails a gate instead of riding a green suite)", () => {
  it("DEFECT (docs): the s150 plan's six execution boxes ticked in place — the S146-S150-B delivery-receipt convention restored for the prior cycle, zero unticked boxes remaining in the record section", () => {
    // The record section, scoped from the heading (the s150 plan's
    // PROSE carries one "(`- [ ]` → `- [x]`)" literal at its §2 — the
    // section scope is the honest pin form, never the whole file).
    const recordAt = s150PlanSource.indexOf("## Execution record");
    expect(recordAt).toBeGreaterThan(-1);
    const recordSection = s150PlanSource.slice(recordAt);
    // All six boxes ticked (the S150 delivery re-verified live at the
    // audit: the citation repair, the s149 tick pass, the 7-pin spec,
    // the count family, the docs, the gate+push — every step executed).
    expect(recordSection.match(/- \[x\]/g)?.length).toBe(6);
    // Zero unticked boxes remaining in the record section.
    expect(recordSection).not.toContain("- [ ]");
    // The execution record's own section still present (the repair
    // ticked the boxes, never removed the record).
    expect(s150PlanSource).toMatch(/## Execution record/);
    // The S146-S149 precedent form (the convention this restores —
    // every prior plan in the s140-s149 range fully ticked, the s149
    // departure repaired in place by S150-B and holding).
    for (const i of [146, 147, 148, 149]) {
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
// S151-B — the receipt-integrity registration (the falsified-claim
// note + the F138 spec-pinned-receipt doctrine)
// ---------------------------------------------------------------------------

describe("S151-B the receipt-integrity registration (a delivery-receipt convention that rides only its prose declaration ships violated by the very cycle that registers it — the receipt must ride the next cycle's spec pin, the prior plan's boxes pinned [x] at the spec's birth)", () => {
  it("SURVIVAL (worklog): the s151-receipt-note bracketed registration — the falsified \"ships TICKED\" claim registered as a NEW note (the S132-C convention: frozen records never rewritten, corrections land as new notes)", () => {
    // The bracketed note is present at its Task-ID anchor.
    const noteAt = worklogSource.indexOf("s151-receipt-note");
    expect(noteAt).toBeGreaterThan(-1);
    const lineStart = worklogSource.lastIndexOf("\n", noteAt) + 1;
    const head = worklogSource.slice(lineStart, lineStart + 500);
    expect(collapsed(head)).toMatch(/Task ID:/);
    // The note's own body carries the falsified-claim registration.
    const entry = auditEntry("s151-receipt-note");
    expect(collapsed(entry)).toMatch(/FALSIFIED "SHIPS TICKED" CLAIM REGISTERED/);
    expect(collapsed(entry)).toMatch(/frozen records never rewritten/);
    expect(collapsed(entry)).toMatch(/F138 spec-pinned-receipt doctrine/);
    // The frozen s150 lead entry itself NEVER rewritten — the
    // falsified declaration still stands as the historical capture
    // (the note is the correction, never the edit).
    expect(worklogSource).toContain(
      "the s150 plan itself ships TICKED at its own delivery",
    );
  });

  it("DEFECT (docs): the F138 lesson registered in the digma_SKILL — the spec-pinned-receipt member inserted after F137, the version bumped to v1.129.0", () => {
    // The version bump landed. [Session-152 re-anchor: the version field
    // is a live claim that moves with every cycle's bump — the rolling
    // form, the count-constant class; the s151 bump landed at v1.129.0,
    // the pin rides the CURRENT figure.]
    expect(skillSource).toMatch(/version: 1\.147\.0/);
    // The F138 lesson present, in the numbered-list form after F137.
    expect(skillSource).toMatch(/^137\. \*\*F137 —/m);
    expect(skillSource).toMatch(/^138\. \*\*F138 —/m);
    // The doctrine's own shape: the prose-declaration failure + the
    // spec-pin mechanical guard + the one-cycle-behind construction.
    const f138 = skillSource
      .split("\n")
      .find((l) => l.startsWith("138. **F138 —")) ?? "";
    expect(collapsed(f138)).toMatch(/spec-pinned receipt/);
    expect(collapsed(f138)).toMatch(
      /rides only its prose declaration ships violated by the very cycle that registers it/,
    );
    expect(collapsed(f138)).toMatch(
      /the prior plan's boxes pinned `\[x\]` at the spec's birth/,
    );
    // The frozen F137 lesson retained verbatim (the version bump
    // inserts after it, never edits it).
    expect(skillSource).toMatch(
      /^137\. \*\*F137 — the session-150 family: a live comment citing ANOTHER document's coordinate must ride a CONTENT-FORM ANCHOR/m,
    );
  });
});

// ---------------------------------------------------------------------------
// S151-C — the per-session pin family + the collateral (the count
// re-anchor 2108 = 2100 + 8 unit / 213 files; the v1.130.0 chain)
// ---------------------------------------------------------------------------

describe("S151-C the per-session pin family and the collateral (the count re-anchor 2108 = 2100 + 8 unit / 213 files; the receipt-integrity cycle's zero §11 re-anchors)", () => {
  it("SURVIVAL (worklog): the prior registrations verbatim — all TEN bracketed notes still present at their anchors (the frozen prior-session deliveries ride unchanged through the S151 registrations)", () => {
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
      "s151-receipt-note",
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

  it("SURVIVAL (worklog): the two s151 audit entries at their anchors with their census claims, and the dual observation carried (the ninety-ninth Mode C audit — the auditors' entries landed live during the audit phase, before this spec's birth; auditor A's entry carries its census inside the prose lead of its Stage Summary while auditor B's carries the standard census line — the spec pins each entry at its own live form, the S147 spec-form-repair-at-birth convention; BOTH entries independently name the SAME finding — the dual observation the cross-confirmation, the one distinct Informational of the combined census)", () => {
    // Auditor A's entry: the client-layer census (the prose form — the
    // entry's Stage Summary leads with the clean-dimension claim and
    // names the one Informational finding).
    const entryA = auditEntry("digma-s151-audit-A");
    expect(entryA).toContain("Task ID:");
    expect(collapsed(entryA)).toMatch(/clean at every audited dimension/);
    expect(collapsed(entryA)).toMatch(/A151-I1/);
    expect(collapsed(entryA)).toMatch(/\(Informational/);
    // Auditor B's entry: the server/infra/e2e census (the standard
    // census-line form).
    const entryB = auditEntry("digma-s151-audit-B");
    expect(entryB).toContain("Task ID:");
    expect(collapsed(entryB)).toMatch(
      /Census: 0 Critical \/ 0 High \/ 0 Medium \/ 0 Low \/ 1 Informational/,
    );
    expect(collapsed(entryB)).toMatch(/B151-I1/);
    // The findings themselves named in the entries — the dual
    // observation (both auditors, the same defect).
    for (const finding of ["A151-I1", "B151-I1"]) {
      expect(worklogSource).toContain(finding);
    }
  });

  it("SURVIVAL (scripts + live derivation): the s151 script provenance — live151/nav151/digma-seo-s151 tokens, the 127th/128th/88th ordinals, the S150 delivery at 7b200e1, zero s150 residue — and the files member derived at runtime riding the growth-floor form", () => {
    // The s151 parity scripts ride their OWN tokens.
    expect(refAuditSource).toContain("live151");
    expect(refAuditSource).toMatch(/127th reference audit/);
    expect(refAuditSource).toContain("byte-identical the 88th");
    expect(refAuditSource).toContain("7b200e1");
    expect(navSource).toContain("nav151");
    expect(navSource).toContain("digma-nav151");
    expect(navSource).toMatch(/128th session/);
    expect(navSource).toContain("7b200e1");
    expect(seoSource).toContain("digma-seo-s151");
    expect(seoSource).toMatch(/session 151, S151-cycle/);
    // Zero s150 residue in the s151 scripts (the F89 family).
    for (const [src, residues] of [
      [refAuditSource, ["live150", "s160", "126th", "byte-identical the 87th", "b2ebe05"]],
      [navSource, ["nav150", "127th session", "127th consecutive", "b2ebe05"]],
      [seoSource, ["seo-s150", "session 150,"]],
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

  it("DEFECT (docs): the count re-anchor — the v1.130.0 chain entry carries the S151 derivation (2108 = 2100 + 8 unit / 213 files) + the §7.1 row for the s151 spec", () => {
    expect(padSource).toContain("2108 = 2100 + 8 unit / 213 files");
    // The §7.1 row for the s151 spec (the per-file enumeration member —
    // 8 pins, the cycle's own census).
    expect(padSource).toMatch(/\| `tests\/lows-s151\.test\.ts` \| 8 \| tests \| Vitest \|/);
    // The chain entry itself names the session (the version bump landed).
    expect(padSource).toMatch(/v1\.130\.0/);
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
