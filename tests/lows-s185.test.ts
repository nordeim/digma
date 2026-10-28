import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-185 spec (the one-hundred-and-thirty-third audit's chosen
// work — the FIFTH consecutive same-vocabulary cycle under
// skills/web-application/SKILL.md v1.1.0: 0C/0H/0M/1L/7I combined, the
// second consecutive cycle with Low-severity members, again surfaced by
// measurement depth):
//
// S185-A — THE COUNT-TRUTH REPAIR (A-L-1, the F78/S101-B count-
//   falsified-by-grep class at the receipt layer): the S184-B
//   --shadow-sm pin's own receipt comment claimed "the 23 shadow-sm
//   sites" — born stale the same cycle it was written (the raw grep
//   count includes the comment mentions and the token declaration
//   itself; the honest class-site count is 21: login-screen x5,
//   recent-view x4, dashboard-view x3, ui/button x3, properties-panel
//   x1, layers-panel x1, ai-assistant x1, ui/input x1, ui/select x1,
//   ui/textarea x1). Comment-text only, zero line movement.
//
// S185-B — THE REGISTRATIONS: the bracketed s185-id-stable-premises-
//   note (the 59th consecutive cycle, the P1 ai-assistant member's
//   send-time coordinate CORRECTED to :589 per B-I-1 — :403 the
//   apply-time patchWouldChange compare, the premise holding at both
//   sites, the F170 family's coordinate member) + the bracketed
//   s185-below-threshold-note (the fourteenth-generation carriers
//   :2847/:2906/:2975 verified EXACT — the corrected arithmetic's
//   third application + THE F172 LESSON: a count claim embedded in a
//   remediation's own receipt comment derives by the comment-
//   excluding class-site enumeration, never a raw grep + the B-I-2
//   window-composition correction (:2832..:2846 for the s170..s184
//   family; :2831 the s169 row) + the FIFTEENTH generation pre-
//   registered at the MEASURED post-collateral coordinates + the
//   postures + the same-vocabulary FIFTH + the honest environment
//   record).
//
// S185-C — THE PER-SESSION PIN FAMILY: 12 pins — 6 RED (the count-
//   truth source contract + the doc-side collateral members) / 6
//   green-at-birth (the two worklog-registration members, the F138
//   guard's THIRTY-SIXTH instance — the s184 plan's record pinned
//   7/7 ticked at 4217fff6, the script-provenance member, the
//   audit-entry member, the source-survival member) — the MEASURED
//   birth form (the s159 lesson: the spec's own arithmetic carries
//   the measured pin count, never the forecast).

const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s184PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session184.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s185.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s185.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s185.sh"),
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

const cssSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/globals.css"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2562 delivery checks + this
 *  spec's 12 = 2574 unit, the 246 delivery files + this spec = 247;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s185 lesson). */
const UNIT = "2709";
const FILES = "258";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice; the census lines ride kilobytes past the
 *  anchor). The s185 pair carries the FULL unique anchor form
 *  (digma-s185-3-a / digma-s185-3-b — no collision with the s184
 *  era's bare 3-a/3-b forms) but the scoping discipline holds:
 *  scoped AFTER the s185-below-threshold-note. */
const auditEntry = (anchor: string) => {
  const scope = worklogSource.indexOf("[s185-below-threshold-note:");
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

describe("lows-s185: the count-truth repair + the receipt-count registrations", () => {
  it("DEFECT (source): the S184-B receipt comment carries the HONEST class-site count — 21 shadow-sm sites (the comment-excluding enumeration), the stale comment-inclusive 23 form GONE (A-L-1, the F78/S101-B class at the receipt layer — the raw grep count includes the 2 comment mentions at ui/select.tsx:12 and layers-panel.tsx:294 and the token declaration itself)", () => {
    expect(collapsed(cssSource)).toContain(
      "v3 geometry so the 21 shadow-sm class sites render the intended notch",
    );
    expect(collapsed(cssSource)).not.toContain("23 shadow-sm sites");
    // the pin itself unchanged (the S184-B contract holding):
    expect(cssSource).toContain("--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);");
    // and the live count the receipt claims — derived, never quoted:
    const root = path.resolve(import.meta.dirname, "..");
    const out = execSync(
      'rg -c "shadow-sm" src --include-zero -g "*.tsx" -g "*.ts" || true',
      { cwd: root, encoding: "utf8" },
    );
    let classSites = 0;
    for (const ln of out.trim().split("\n").filter(Boolean)) {
      const [file, count] = ln.split(":");
      const src = readFileSync(path.join(root, file), "utf8");
      const commentMentions = (src.match(/^\s*\/\/.*shadow-sm/gm) ?? []).length;
      classSites += Number(count) - commentMentions - (file.endsWith("globals.css") ? 3 : 0);
    }
    expect(classSites).toBe(21);
  });

  it("SURVIVAL (worklog): the bracketed s185-below-threshold-note registers the fourteenth-generation verification (the carriers :2847/:2906/:2975 — the corrected arithmetic's THIRD application) + the F172 RECEIPT-COUNT TRUTH lesson + the B-I-2 window-composition correction (:2832..:2846 for the s170..s184 family) + the fifteenth pre-registered at the MEASURED post-collateral coordinates", () => {
    expect(worklogSource).toContain("[s185-below-threshold-note: THE FOURTEENTH-GENERATION COORDINATE VERIFIED");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s185-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s185-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F172 LESSON — THE RECEIPT-COUNT TRUTH MEMBER");
    expect(collapsed(note)).toContain("never a raw grep");
    expect(collapsed(note)).toContain("the honest class-site count 21");
    expect(collapsed(note)).toContain("THE B-I-2 WINDOW-COMPOSITION CORRECTION");
    expect(collapsed(note)).toContain(
      "the corrected composition for the s170..s184 family is :2832..:2846",
    );
    expect(collapsed(note)).toContain("THE FIFTEENTH GENERATION PRE-REGISTRATION — THE MEASURED FORM");
    expect(collapsed(note)).toContain("the FIFTH consecutive");
    expect(collapsed(note)).toContain("the first zero-movement cycle since S182");
  });

  it("SURVIVAL (worklog): the bracketed s185-id-stable-premises-note registers the premises — the four premises at their seams, the FIFTY-NINTH ordinal, the :589 coordinate correction (the send-time targetIds capture, :403 the apply-time compare), the carried judgment, the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s185-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE FIFTY-NINTH CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s185-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s185-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("SEND-TIME targetIds :589");
    expect(collapsed(note)).toContain("the APPLY-TIME patchWouldChange value compare");
    expect(collapsed(note)).toContain("the SECOND consecutive cycle carrying a coordinate correction");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan): the F138 guard's THIRTY-SIXTH instance — the s184 plan's execution record shipped 7/7 ticked, zero unticked (the pre-armed guard per the session_493/494 directive; the thirty-fourth consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S185 total rides the spec's own census: 766 + 12 = 778)", () => {
    const ticked = s184PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s184PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(7);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(766 + 12).toBe(778);
  });

  it("SURVIVAL (scripts): the s185 script provenance — live185/nav185/digma-seo-s185 tokens, the 161st/162nd/122nd ordinals, the S184 delivery at 4217fff6, zero s184 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live185");
    expect(refAuditSource).toContain("the 161st reference audit");
    expect(refAuditSource).toContain("the S184 delivery at HEAD 4217fff6");
    expect(refAuditSource).toContain("byte-identical the 122nd");
    expect(refAuditSource).not.toContain("live184");
    expect(refAuditSource).not.toContain("160th reference audit");
    expect(navSource).toContain("nav185");
    expect(navSource).toContain("162nd session, S185-cycle");
    expect(navSource).toContain("the S184 delivery 4217fff6 + the S185 remediation");
    expect(navSource).not.toContain("nav184");
    expect(seoSource).toContain("digma-seo-s185");
    expect(seoSource).toContain("session 185, S185-cycle");
    expect(seoSource).not.toContain("digma-seo-s184");
  });

  it("SURVIVAL (worklog): the two s185 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/1L/4I (with the 26-sampled comment-truth census at 25 TRUE / 1 FALSE, the mobile-nav-by-construction 9/9 pass, and the A-L-1 receipt-count member) and auditor B's 0C/0H/0M/0L/3I (with the 59th premises cycle, the fourteenth-generation coordinates :2847/:2906/:2975, and the write-set arithmetic closing at 25)", () => {
    const a = auditEntry("Task ID: digma-s185-3-a");
    expect(a).toContain("0C/0H/0M/1L/4I");
    expect(collapsed(a)).toContain("25 TRUE / 1 FALSE");
    expect(collapsed(a)).toContain("9/9");
    expect(a).toContain("21");
    const b = auditEntry("Task ID: digma-s185-3-b");
    // the s159 pin-form lesson: each entry's actual census spelling —
    // A's un-spaced "0C/0H/0M/1L/4I", B's spaced "0C / 0H / 0M / 0L / 3I".
    expect(collapsed(b)).toContain("0C / 0H / 0M / 0L / 3I");
    expect(collapsed(b)).toContain("59th");
    expect(collapsed(b)).toContain(":2847");
    expect(collapsed(b)).toContain("= 25");
  });

  it("SURVIVAL (source): the post-remediation tree's measured figures — the layer total STAYING at 14,359 (the first zero-movement cycle since S182 — the comment-text repair painting no lines) derived LIVE with the PER-FILE probe closing, the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the tenth re-quote cycle pre-armed), call.ts still exactly 80 lines, and the env census's attribution (17 sites across 9 vars)", () => {
    // The layer at the S186 figure: 14,365 — derived live, never quoted
    // (ridden from 14,359 by the S186-A F40 rider — the s185 STAYS form
    // was the s185 cycle's own live claim, now the s186 rider's).
    expect(liveLayerTotal).toBe(14373);
    const layerHandSum = Object.values(liveLayerPerFile).reduce(
      (a, b) => a + b,
      0,
    );
    expect(layerHandSum).toBe(liveLayerTotal);
    expect(liveLayerPerFile["src/app/globals.css"]).toBe(300);
    expect(liveLayerPerFile["src/components/login-screen.tsx"]).toBe(747);
    expect(liveLayerPerFile["src/components/editor/editor-view.tsx"]).toBe(2453);
    expect(liveLayerPerFile["src/components/editor/editor-store.ts"]).toBe(847);
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

  it("DEFECT (docs): the AGENTS session-185 bullet carries the completion members — the per-auditor census lines, the fifth-consecutive same-vocabulary hold, the A-L-1 count-truth remediation with the F172 lesson, and the layer STAYING at 14,359 (the first zero-movement cycle since S182)", () => {
    expect(collapsed(agentsSource)).toContain("session 185, S185-A..S185-C");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/1L/4I + B 0C/0H/0M/0L/3I");
    expect(collapsed(agentsSource)).toContain("FIFTH consecutive same-vocabulary cycle");
    expect(collapsed(agentsSource)).toContain("the F172 receipt-count truth lesson");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,359");
  });

  it("DEFECT (docs): the count re-anchor — the v1.164.0 chain entry carries the S185 derivation (2574 = 2562 + 12 unit / 247 files) + the §7.1 row for the s185 spec, the layer-total family STAYING at 14,359 (the first zero-movement cycle since S182) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    expect(collapsed(padSource)).toContain("2574 = 2562 + 12 unit / 247 files");
    expect(padSource).toContain("lows-s185.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,359");
    expect(collapsed(padSource)).toContain("the route figure STAYING at 2,461");
    expect(padSource).toContain("| **Unit total** | **258 files** | **2709** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2709/2709");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2709 checks / 258 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.164.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.175\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.175.0");
    expect(lastUpdated).toContain("the one-hundred-and-forty-fourth audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.163.0 + the F172 receipt-count truth lesson (a count claim embedded in a remediation's own receipt comment derives by the comment-excluding class-site enumeration, never a raw grep) + the globals.css line-count claim re-anchored onto the live count (300)", () => {
    expect(skillSource).toContain("version: 1.174.0");
    expect(skillSource).toContain("172. **F172");
    expect(collapsed(skillSource)).toContain("THE RECEIPT-COUNT TRUTH MEMBER");
    expect(collapsed(skillSource)).toContain("never a raw grep");
    expect(skillSource).toContain('project_state: "2709 unit checks green');
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s184 + s183 pair as the standing witnesses) + the anchored declaration census pins 66 UNIT / 65 FILES", () => {
    expect(UNIT).toBe("2709");
    expect(FILES).toBe("258");
    const root = path.resolve(import.meta.dirname, "..");
    const out = execSync(
      'rg -l \'^const UNIT = "2709";$\' tests/ src/lib/ | wc -l && rg -l \'^const FILES = "258";$\' tests/ src/lib/ | wc -l',
      { cwd: root, encoding: "utf8" },
    );
    const [unitFiles, filesFiles] = out.trim().split("\n").map(Number);
    expect(unitFiles).toBe(77);
    expect(filesFiles).toBe(76);
  });
});
