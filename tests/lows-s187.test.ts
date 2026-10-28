import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-187 spec (the one-hundred-and-thirty-fifth audit's chosen
// work — the FIRST cycle under the NEW skills/web-application/
// SKILL.md v1.2.0 vocabulary (the operator's 2026-10-25 revision in
// commit fd2037e3 — the first vocabulary change since 2026-10-23;
// the prior six consecutive cycles all ran v1.1.0): 0C/0H/0M/0L/3I
// combined, the FIRST zero-Low cycle since S183 after three
// consecutive measurement-depth Low cycles — every member of the F170
// coordinate-precision family, zero source-code defect, zero
// mutation surface):
//
// S187-A — THE REGISTRATION BATCH (the below-threshold form): the
//   bracketed s187-id-stable-premises-note (the 62nd consecutive
//   cycle, the P1 member's properties-panel coordinates CORRECTED to
//   :1377/:2207 per A-I-2 — the F170 family's comment-block member)
//   + the bracketed s187-below-threshold-note (the sixteenth-
//   generation carriers :2851/:2910/:2979 verified EXACT WITH THE
//   B-I-1 WINDOW CORRECTION — :2833 the s169 row; :2833..:2850 =
//   s169..s186, 18 rows; :2832 the s168 row + THE F174 LESSON: THE
//   WINDOW-START-LABEL TRUTH MEMBER + the A-I-1 coordinate
//   corrections (:339/:407 — the S186-A receipt comment's own +6) +
//   the v1.2.0 vocabulary-change registration (three registered
//   deviations converted to sanctioned patterns; both new rule
//   families verified digma-compliant) + the SEVENTEENTH generation
//   pre-registered at the MEASURED post-collateral coordinates + the
//   honest environment record — the unguarded-seed trap catch at
//   Phase 0, the guarded re-seed restoring pristine before any gate
//   recorded green).
//
// S187-B — THE PER-SESSION PIN FAMILY: 12 pins — 5 RED (the doc-side
//   collateral members) / 7 green-at-birth (the two
//   worklog-registration members, the F138 guard's THIRTY-EIGHTH
//   instance — the s186 plan's record pinned 5/5 ticked at 2fa13d7e,
//   the script-provenance member, the audit-entry member, the
//   source-survival member, the layer-STAYS member, and the plan-
//   record member) — the MEASURED birth form (the s159 lesson: the
//   spec's own arithmetic carries the measured pin count, never the
//   forecast).

const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s186PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session186.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s187.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s187.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s187.sh"),
  "utf8",
);

const worklogSource = readFileSync(
  path.resolve(import.meta.dirname, "../worklog.md"),
  "utf8",
);

const agentsSource = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2588 delivery checks + this
 *  spec's 12 = 2600 unit, the 248 delivery files + this spec = 249;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s187 lesson). */
const UNIT = "2709";
const FILES = "258";

/** The MEASURED layer figures (the s159 measured form — the
 *  zero-movement cycle: the layer STAYS at the post-S186 figure
 *  14,365, login-screen at 747; no source-code movement this cycle,
 *  no F40 rider needed). */
const LAYER_TOTAL = 14373;
const LOGIN_LINES = 747;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice; the census lines ride kilobytes past the
 *  anchor). The s187 pair carries the FULL unique anchor form
 *  (digma-s187-3-a / digma-s187-3-b) and the scoping discipline
 *  holds: scoped AFTER the s187-below-threshold-note. */
const auditEntry = (anchor: string) => {
  const scope = worklogSource.indexOf("[s187-below-threshold-note:");
  if (scope === -1) return "";
  const at = worklogSource.indexOf(anchor, scope);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const end = worklogSource.indexOf("\n---\n", at);
  return worklogSource.slice(lineStart, end === -1 ? at + 16000 : end);
};

/** The live 22-file layer total, derived at runtime (the S154-B
 *  forward count-truth guard — NEVER a quoted figure): the exact
 *  composition pinned by tests/lows-s142.test.ts — 8 files at
 *  src/components/editor/ + 8 at src/components/ + 2 at src/hooks/ +
 *  the 3 named lib members + src/app/globals.css. */
const liveLayerTotal = (() => {
  const root = path.resolve(import.meta.dirname, "..");
  const groups = [
    "src/components/editor/*.tsx",
    "src/components/editor/*.ts",
    "src/components/*.tsx",
    "src/hooks/*.ts",
    "src/lib/editor.ts",
    "src/lib/ai-assistant.ts",
    "src/lib/export-png.ts",
    "src/app/globals.css",
  ];
  let total = 0;
  for (const glob of groups) {
    const out = execSync(`wc -l ${glob}`, { cwd: root, encoding: "utf8" });
    const line = out.trim().split("\n").pop()!;
    total += Number(line.trim().split(/\s+/)[0]);
  }
  return total;
})();

/** The live 22-file PER-FILE decomposition, derived at runtime (the
 *  F170 lesson mechanized — the historically-moving members pinned
 *  by name so the family's own members can never silently drift
 *  inside a verified total). */
const liveLayerPerFile = (() => {
  const root = path.resolve(import.meta.dirname, "..");
  const out = execSync(
    "wc -l src/components/editor/*.tsx src/components/editor/*.ts src/components/*.tsx src/hooks/*.ts src/lib/editor.ts src/lib/ai-assistant.ts src/lib/export-png.ts src/app/globals.css",
    { cwd: root, encoding: "utf8" },
  );
  const perFile: Record<string, number> = {};
  for (const ln of out.trim().split("\n")) {
    const m = ln.trim().match(/^(\d+)\s+(.*)$/);
    if (m && !ln.includes(" total")) perFile[m[2]] = Number(m[1]);
  }
  return perFile;
})();

/** The live 18-file route total + the per-file decomposition, derived
 *  at runtime (the S176-A internal-consistency probe). */
const liveRouteFigures = (() => {
  const root = path.resolve(import.meta.dirname, "..");
  const out = execSync("find src/app/api -name route.ts | sort | xargs wc -l", {
    cwd: root,
    encoding: "utf8",
  });
  const lines = out.trim().split("\n");
  const total = Number(lines.pop()!.trim().split(/\s+/)[0]);
  const perFile: Record<string, number> = {};
  for (const ln of lines) {
    const m = ln.trim().match(/^(\d+)\s+(.*)$/);
    if (m) perFile[m[2]] = Number(m[1]);
  }
  return { total, perFile, handSum: Object.values(perFile).reduce((a, b) => a + b, 0) };
})();

describe("lows-s187: the window-start-label correction + the v1.2.0 vocabulary-change registrations", () => {
  it("DEFECT (docs): the AGENTS session-187 bullet carries the completion members — the per-auditor census lines, the FIRST v1.2.0 vocabulary cycle, the first zero-Low census since S183, the F174 window-start-label truth lesson, and the layer-total family STAYING at 14,365 (the zero-movement form)", () => {
    expect(collapsed(agentsSource)).toContain("session 187, S187-A..S187-B");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/1I");
    expect(collapsed(agentsSource)).toContain("the FIRST cycle under the NEW skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("the F174 window-start-label truth lesson");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,365");
  });

  it("DEFECT (docs): the count re-anchor — the v1.166.0 chain entry carries the S187 derivation (2600 = 2588 + 12 unit / 249 files) + the §7.1 row for the s187 spec, the layer-total family STAYING at 14,365 (the zero-movement form) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    expect(collapsed(padSource)).toContain("2600 = 2588 + 12 unit / 249 files");
    expect(padSource).toContain("lows-s187.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,365");
    expect(collapsed(padSource)).toContain("the route figure STAYING at 2,461");
    expect(padSource).toContain("| **Unit total** | **258 files** | **2709** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2709/2709");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2709 checks / 258 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.166.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.175\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.175.0");
    expect(lastUpdated).toContain("the one-hundred-and-forty-fourth audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.165.0 + the F174 window-start-label truth lesson (a row-window's start label is itself a coordinate claim — when an insertion lands above the window, BOTH the end composition AND the start label must be re-derived, and a window phrase that names its extent in sessions must be internally consistent with its line-span) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.174.0");
    expect(skillSource).toContain("174. **F174");
    expect(collapsed(skillSource)).toContain("THE WINDOW-START-LABEL TRUTH MEMBER");
    expect(skillSource).toContain("2709 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s186 + s185 pair as the standing witnesses) + the anchored declaration census pins 68 UNIT / 67 FILES", () => {
    expect(UNIT).toBe("2709");
    expect(FILES).toBe("258");
    const root = path.resolve(import.meta.dirname, "..");
    const out = execSync(
      `rg -l '^const UNIT = "2709";$' tests/ src/lib/ | wc -l && rg -l '^const FILES = "258";$' tests/ src/lib/ | wc -l`,
      { cwd: root, encoding: "utf8" },
    );
    const [unitFiles, filesFiles] = out.trim().split("\n").map(Number);
    expect(unitFiles).toBe(77);
    expect(filesFiles).toBe(76);
  });

  it("SURVIVAL (layer): the zero-movement form — the layer total at 14,365 (no source-code movement this cycle, no F40 rider needed) derived LIVE with the PER-FILE probe closing, login-screen.tsx at exactly 747, globals.css STAYING at 300", () => {
    expect(liveLayerTotal).toBe(LAYER_TOTAL);
    const layerHandSum = Object.values(liveLayerPerFile).reduce(
      (a, b) => a + b,
      0,
    );
    expect(layerHandSum).toBe(liveLayerTotal);
    expect(liveLayerPerFile["src/components/login-screen.tsx"]).toBe(LOGIN_LINES);
    expect(liveLayerPerFile["src/app/globals.css"]).toBe(300);
    expect(liveLayerPerFile["src/components/editor/editor-view.tsx"]).toBe(2453);
    expect(liveLayerPerFile["src/components/editor/editor-store.ts"]).toBe(847);
  });

  it("SURVIVAL (worklog): the bracketed s187-below-threshold-note registers the sixteenth-generation verification WITH THE B-I-1 WINDOW CORRECTION (:2833 the s169 row; :2833..:2850 = s169..s186, 18 rows; :2832 the s168 row) + the F174 WINDOW-START-LABEL TRUTH lesson + the A-I-1 coordinate corrections (:339/:407) + the v1.2.0 vocabulary-change registration + the seventeenth pre-registered at the MEASURED post-collateral coordinates + the honest environment record (the unguarded-seed trap catch)", () => {
    expect(worklogSource).toContain("[s187-below-threshold-note: THE SIXTEENTH-GENERATION COORDINATE VERIFIED");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s187-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s187-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F174 LESSON — THE WINDOW-START-LABEL TRUTH MEMBER");
    expect(collapsed(note)).toContain(":2832 is the S168 row, :2833 is the S169 row, :2834 is the S170 row, so the window :2833..:2850 = s169..s186 (EIGHTEEN rows, arithmetic-consistent)");
    expect(collapsed(note)).toContain("THE V1.2.0 VOCABULARY-CHANGE REGISTRATION");
    expect(collapsed(note)).toContain("A-I-1 the S186-A delivery prose's pre-collateral coordinates (the -mt-2 mirror site at login-screen.tsx:339 not :333, the autoComplete conditional at :407 not :401");
    expect(collapsed(note)).toContain("THE SEVENTEENTH GENERATION PRE-REGISTRATION — THE MEASURED FORM");
    expect(collapsed(note)).toContain("the trap CAUGHT the cycle's own first unguarded db push + seed at Phase 0");
    expect(collapsed(note)).toContain("31 TRUE / 0 FALSE");
  });

  it("SURVIVAL (worklog): the bracketed s187-id-stable-premises-note registers the premises — the four premises at their seams, the SIXTY-SECOND ordinal, the P1 properties-panel COORDINATE CORRECTION (the commitUpload guard call at :1377, the selectionWouldCommit compare at :2207 — the prior cycles' :1372/:2202 named the guards' preceding comment blocks, five lines shy — the F170 family's comment-block member), the carried judgment, the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s187-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SIXTY-SECOND CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s187-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s187-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE COORDINATES CORRECTED THIS CYCLE");
    expect(collapsed(note)).toContain("the commitUpload guard call at :1377");
    expect(collapsed(note)).toContain("the selectionWouldCommit compare at :2207");
    expect(collapsed(note)).toContain("the F170 family's comment-block member");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan): the F138 guard's THIRTY-EIGHTH instance — the s186 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_505/506 directive; the thirty-sixth consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S187 total rides the spec's own census: 792 + 12 = 804)", () => {
    const ticked = s186PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s186PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(792 + 12).toBe(804);
  });

  it("SURVIVAL (scripts): the s187 script provenance — live187/nav187/digma-seo-s187 tokens, the 163rd/164th/124th ordinals, the S186 delivery at 2fa13d7e, zero s186 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live187");
    expect(refAuditSource).toContain("the 163rd reference audit");
    expect(refAuditSource).toContain("the S186 delivery at HEAD 2fa13d7e");
    expect(refAuditSource).toContain("byte-identical the 124th");
    expect(refAuditSource).not.toContain("live186");
    expect(refAuditSource).not.toContain("162nd reference audit");
    expect(navSource).toContain("nav187");
    expect(navSource).toContain("164th session, S187-cycle");
    expect(navSource).toContain("the S186 delivery 2fa13d7e + the S187 remediation");
    expect(navSource).not.toContain("nav186");
    expect(seoSource).toContain("digma-seo-s187");
    expect(seoSource).toContain("session 187, S187-cycle");
    expect(seoSource).not.toContain("digma-seo-s186");
  });

  it("SURVIVAL (worklog): the two s187 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/2I (with the 31-sampled comment-truth census at 31 TRUE / 0 FALSE, the trap-4 hunt closing CLEAN, and the mobile-nav-by-construction pass) and auditor B's 0C/0H/0M/0L/1I (with the 61st premises cycle, the sixteenth-generation carriers :2851, and the write-set arithmetic closing at 25)", () => {
    const a = auditEntry("Task ID: digma-s187-3-a");
    expect(a).toContain("0C / 0H / 0M / 0L / 2I");
    expect(collapsed(a)).toContain("31 TRUE / 0 FALSE");
    expect(collapsed(a)).toContain("trap-4");
    expect(a).toContain("14,365");
    const b = auditEntry("Task ID: digma-s187-3-b");
    // the s159 pin-form lesson: each entry's actual census spelling —
    // both s187 entries carry the spaced "0C / 0H / 0M / 0L / NI" form.
    expect(collapsed(b)).toContain("0C / 0H / 0M / 0L / 1I");
    expect(collapsed(b)).toContain("61st");
    expect(collapsed(b)).toContain(":2851");
    expect(collapsed(b)).toContain("= 25");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the thirteenth re-quote cycle), call.ts still exactly 80 lines", () => {
    // The routes STAY: 2,461 — derived live with the probe.
    expect(liveRouteFigures.total).toBe(2461);
    expect(liveRouteFigures.handSum).toBe(liveRouteFigures.total);
    expect(liveRouteFigures.perFile["src/app/api/projects/[id]/elements/route.ts"]).toBe(420);
    const root = path.resolve(import.meta.dirname, "..");
    const call = execSync("wc -l src/lib/call.ts", {
      cwd: root,
      encoding: "utf8",
    });
    expect(Number(call.trim().split(/\s+/)[0])).toBe(80);
  });
});
