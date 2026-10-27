import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-192 spec (the one-hundred-and-fortieth audit's chosen
// work — the SIXTH consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle; the operator's 2026-10-25 fd2037e3 revision
// byte-unchanged since): 0C/0H/0M/0L/4I combined, the SIXTH
// consecutive zero-Low cycle, every member informational — two carried
// postures (the §8 letter posture at its fifth consecutive carry; the
// vocabulary-HOLD at its sixth), two POSITIVE standing-convention
// verifications (the F177 axis-named dispatch form and the
// dispatch-currency dual form BOTH verified at their SECOND
// full-cycle test — graduating per F179) — zero source-code defect,
// zero mutation surface; the comment-truth census 48 sampled,
// 48 TRUE / 0 FALSE — the fully-TRUE form's FOURTH consecutive
// cycle):
//
// S192-A — THE REGISTRATION PAIR (the S187/S189/S190/S191
//   registration-cycle form, ZERO source-code movement): the
//   s192-id-stable-premises-note at the 67th consecutive cycle
//   carrying the CANONICAL quartet in exactly one place (the
//   dispatch QUOTING it verbatim — the F176 prescription's THIRD
//   full-cycle test, zero label drift again, the quoting form the
//   standing convention per F178, the graduated form watched per
//   F179) + the s192-below-threshold-note (THE F179
//   convention-graduation truth lesson + the twenty-second-
//   generation verification + the dispatch-currency-honored
//   registration + the vocabulary-HOLD + the honest environment
//   record). The layer STAYS at 14,373 — the zero-movement form,
//   no F40 rider.
//
// S192-B — THE PER-SESSION PIN FAMILY: 12 pins — 5 RED (the doc-side
//   collateral members) / 7 green-at-birth (the two
//   worklog-registration members, the F138 guard's FORTY-THIRD
//   instance — the s191 plan's record pinned 4/4 ticked at
//   551f5117, the script-provenance member, the audit-entry members
//   — both anchors at their standing spellings this cycle, the
//   standing-figures member, and the layer-STAYS member) — the
//   MEASURED birth form (the s159 lesson: the spec's own arithmetic
//   carries the measured pin count, never the forecast).

const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s191PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session191.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s192.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s192.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s192.sh"),
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
 *  born at the POST-spec figures: the 2649 delivery checks + this
 *  spec's 12 = 2661 unit, the 253 delivery files + this spec = 254;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s192 lesson). */
const UNIT = "2673";
const FILES = "255";

/** The MEASURED layer figures (the s159 measured form — the STAYS
 *  form this cycle: the registration-only cycle moves no source
 *  line, the layer holding at the S188-A amendment's post-delivery
 *  figure — the zero-movement form's own receipt, no F40 rider). */
const LAYER_TOTAL = 14373;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The S192 anchors BOTH carry the standing
 *  spelling (digma-s192-auditor-A / digma-s192-auditor-B — the
 *  dispatch briefs specified them and both auditors honored the
 *  form). A's entry landed FIRST (:7711, running to auditor B's
 *  separator) and B's second (:7738, running to the bracketed
 *  registration note). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const ends = [
    worklogSource.indexOf("\n---\n", at),
    worklogSource.indexOf("\n[s192-id-stable-premises-note:", at),
  ].filter((i) => i !== -1);
  const end = ends.length ? Math.min(...ends) : at + 16000;
  return worklogSource.slice(lineStart, end);
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

describe("lows-s192: the convention-graduation truth registrations (the registration-only cycle)", () => {
  it("DEFECT (docs): the AGENTS session-192 bullet carries the completion members — the per-auditor census lines, the SIXTH consecutive zero-Low cycle, the vocabulary-HOLD cycle, the F179 convention-graduation truth lesson, and the layer-total family STAYING at 14,373 (the zero-movement form)", () => {
    expect(collapsed(agentsSource)).toContain("session 192, S192-A..S192-B");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/2I");
    expect(collapsed(agentsSource)).toContain("the SIXTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F179 LESSON — THE CONVENTION-GRADUATION TRUTH MEMBER");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.171.0 chain entry carries the S192 derivation (2661 = 2649 + 12 unit / 254 files) + the §7.1 row for the s192 spec, the layer-total family STAYING at 14,373 (the registration-only cycle, no F40 rider) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    expect(collapsed(padSource)).toContain("2661 = 2649 + 12 unit / 254 files");
    expect(padSource).toContain("lows-s192.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,373");
    expect(collapsed(padSource)).toContain("the route figure STAYING at 2,461");
    expect(padSource).toContain("| **Unit total** | **255 files** | **2673** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2673/2673");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2673 checks / 255 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.171.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.172\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.172.0");
    expect(lastUpdated).toContain("the one-hundred-and-forty-first audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.170.0 + the F179 convention-graduation truth lesson (a promoted convention's second full-cycle verification graduates it from repair-under-observation to standing infrastructure — from that point the audit's registration duty inverts: the convention's absence from a dispatch becomes itself reportable drift, not merely the presence of a carried form; a convention graduated but unwatched is a convention that can be silently retired) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.171.0");
    expect(skillSource).toContain("179. **F179");
    expect(collapsed(skillSource)).toContain("THE CONVENTION-GRADUATION TRUTH MEMBER");
    expect(skillSource).toContain("2673 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s191 + s190 pair as the standing witnesses) + the anchored declaration census pins 73 UNIT / 72 FILES", () => {
    expect(UNIT).toBe("2673");
    expect(FILES).toBe("255");
    const root = path.resolve(import.meta.dirname, "..");
    const out = execSync(
      `rg -l '^const UNIT = "2673";$' tests/ src/lib/ | wc -l && rg -l '^const FILES = "255";$' tests/ src/lib/ | wc -l`,
      { cwd: root, encoding: "utf8" },
    );
    const [unitFiles, filesFiles] = out.trim().split("\n").map(Number);
    expect(unitFiles).toBe(74);
    expect(filesFiles).toBe(73);
  });

  it("SURVIVAL (worklog): the bracketed s192-below-threshold-note registers the twenty-second-generation verification (:2838..:2860 = s169..s191, 23 rows, :2837 the S168 row — the F174-corrected window form verified at its own generation) + the F179 CONVENTION-GRADUATION TRUTH lesson + the dispatch-currency-honored registration + the A-I-1 carried §8 letter posture + the vocabulary-HOLD registration + the honest environment record (the trap caught BEFORE the first db operation) + the F138 FORTY-THIRD instance + the twenty-third-generation pre-registration", () => {
    expect(worklogSource).toContain("[s192-below-threshold-note: THE TWENTY-SECOND-GENERATION COORDINATE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s192-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s192-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F179 LESSON — THE CONVENTION-GRADUATION TRUTH MEMBER");
    expect(collapsed(note)).toContain(":2838..:2860 = s169..s191 (TWENTY-THREE rows, arithmetic-consistent) with :2837 the S168 row");
    expect(collapsed(note)).toContain("THE B-I-1 DISPATCH-CURRENCY-HONORED REGISTRATION");
    expect(collapsed(note)).toContain("THE A-I-1 CARRIED POSTURE (the master-skill §8 letter posture, its FIFTH consecutive carry)");
    expect(collapsed(note)).toContain("THE B-I-2 VOCABULARY-HOLD REGISTRATION");
    expect(collapsed(note)).toContain("CAUGHT BEFORE the first db operation ran");
    expect(collapsed(note)).toContain("FORTY-THIRD INSTANCE");
    expect(collapsed(note)).toContain("THE TWENTY-THIRD-GENERATION PRE-REGISTRATION");
  });

  it("SURVIVAL (worklog): the bracketed s192-id-stable-premises-note registers the CANONICAL quartet — the 67th ordinal, the four premises at their seams, the F176 quoting prescription's THIRD full-cycle test (zero label drift again, the standing convention per F178, the graduated form watched per F179), and the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s192-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SIXTY-SEVENTH CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s192-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s192-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CANONICAL QUARTET");
    expect(collapsed(note)).toContain("the F176 prescription's THIRD full-cycle test — zero label drift again");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan): the F138 guard's FORTY-THIRD instance — the s191 plan's execution record shipped 4/4 ticked, zero unticked (the pre-armed guard per the session_534/535 directive; the forty-first consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S192 total rides the spec's own census: 853 + 12 = 865)", () => {
    const ticked = s191PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s191PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(4);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(853 + 12).toBe(865);
  });

  it("SURVIVAL (scripts): the s192 script provenance — live192/nav192/digma-seo-s192 tokens, the 168th/169th/129th ordinals, the S191 delivery at 551f5117, zero s191 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live192");
    expect(refAuditSource).toContain("the 168th reference audit");
    expect(refAuditSource).toContain("the S191 delivery at HEAD 551f5117");
    expect(refAuditSource).toContain("byte-identical the 129th");
    expect(refAuditSource).not.toContain("live191");
    expect(refAuditSource).not.toContain("167th reference audit");
    expect(navSource).toContain("nav192");
    expect(navSource).toContain("169th session, S192-cycle");
    expect(navSource).toContain("the S191 delivery 551f5117 + the S192 remediation");
    expect(navSource).not.toContain("nav191");
    expect(seoSource).toContain("digma-seo-s192");
    expect(seoSource).toContain("session 192, S192-cycle");
    expect(seoSource).not.toContain("digma-seo-s191");
  });

  it("SURVIVAL (worklog): the two s192 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/2I at the standing anchor (with the 48-sampled comment-truth census at 48 TRUE / 0 FALSE — the fully-TRUE form's FOURTH consecutive cycle; the F178 standing conventions OBSERVED HOLDING at their second full-cycle test; the pin subset 82/82 across 8 files; and the mobile-nav-by-construction pass) and auditor B's 0C/0H/0M/0L/2I at the standing anchor (with the 67th premises cycle, the 72/71 spec constants on 2649/253, and the write-set arithmetic closing at 25) — both spellings at the standing form", () => {
    const a = auditEntry("Task ID: digma-s192-auditor-A");
    expect(a).toContain("0C / 0H / 0M / 0L / 2I");
    expect(collapsed(a)).toContain("48 TRUE / 0 FALSE");
    expect(collapsed(a)).toContain("second full-cycle test");
    expect(collapsed(a)).toContain("82/82 PASSED across 8 files");
    expect(a).toContain("14,373");
    const b = auditEntry("Task ID: digma-s192-auditor-B");
    expect(collapsed(b)).toContain("0C / 0H / 0M / 0L / 2I");
    expect(collapsed(b)).toContain("the 67th cycle");
    expect(collapsed(b)).toContain("72 UNIT + 71 FILES on the figures 2649/253");
    expect(collapsed(b)).toContain("13 + 6 + 1 + 5 = 25");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the eighteenth re-quote cycle), call.ts still exactly 80 lines", () => {
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

  it("SURVIVAL (layer): the zero-movement form's own receipt — the layer total STAYING at 14,373 (the registration-only cycle: no source-code movement, no remediation receipt, no F40 rider) derived LIVE with the PER-FILE probe closing, properties-panel.tsx at exactly 2,378, login-screen.tsx STAYING at 747, globals.css STAYING at 300", () => {
    expect(liveLayerTotal).toBe(LAYER_TOTAL);
    const layerHandSum = Object.values(liveLayerPerFile).reduce(
      (a, b) => a + b,
      0,
    );
    expect(layerHandSum).toBe(liveLayerTotal);
    expect(liveLayerPerFile["src/components/editor/properties-panel.tsx"]).toBe(2378);
    expect(liveLayerPerFile["src/components/login-screen.tsx"]).toBe(747);
    expect(liveLayerPerFile["src/app/globals.css"]).toBe(300);
    expect(liveLayerPerFile["src/components/editor/editor-view.tsx"]).toBe(2453);
    expect(liveLayerPerFile["src/components/editor/editor-store.ts"]).toBe(847);
  });
});
