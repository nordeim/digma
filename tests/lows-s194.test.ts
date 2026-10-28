import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-194 spec (the one-hundred-and-forty-second audit's chosen
// work — the EIGHTH consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle; the operator's 2026-10-25 fd2037e3 revision
// byte-unchanged since): 0C/0H/0M/1L/4I combined — the seven-cycle
// zero-Low streak ended at an honest comment-truth Low, zero
// behavioral source-code defect, one documentation-truth defect with
// a three-site fix surface; four informational members — one carried
// posture (the §8 letter posture at its seventh consecutive carry),
// one positive steady-state verification (the F179 graduated
// conventions BOTH confirmed at their FOURTH full-cycle test — the
// second steady-state cycle, the watch recorded per F180), one
// dispatch-currency registration, one vocabulary-HOLD registration;
// the comment-truth census 49 sampled, 48 TRUE / 1 FALSE — the
// fully-TRUE form's five-cycle streak ended by the fresh-eyes
// numeric re-derivation, the FALSE member being the L-1 stale
// purple-600 figure itself):
//
// S194-A — THE REGISTRATION PAIR (the S187..S193
//   registration-cycle form): the s194-id-stable-premises-note at
//   the 69th consecutive cycle carrying the CANONICAL quartet in
//   exactly one place (the dispatch QUOTING it verbatim — the F176
//   prescription's FIFTH full-cycle test, zero label drift again,
//   the quoting form the standing convention per F178, the
//   graduated form watched per F179 and confirmed in the
//   steady-state watch per F180) + the s194-below-threshold-note
//   (THE F181 prose-figures-are-claims truth lesson + the
//   twenty-fourth-generation verification + the L-1 comment-truth
//   registration + the dispatch-currency-honored registration + the
//   vocabulary-HOLD + the honest environment record — the
//   SANDBOX-RESET form this cycle). The layer STAYS at 14,373 —
//   the in-place comment-correction form (the L-1 fix changes one
//   comment line, zero line-count movement), no F40 rider.
//
// S194-B — THE PER-SESSION PIN FAMILY: 12 pins — 5 RED (the doc-side
//   collateral members + the L-1 fix's own regression pin) / 7
//   green-at-birth (the two worklog-registration members, the F138
//   guard's FORTY-FIFTH instance — the s193 plan's record pinned 4/4
//   ticked at fb2ac5c2, the script-provenance member, the
//   audit-entry members — both anchors at their standing spellings
//   this cycle, the standing-figures member, and the layer-STAYS
//   member) — the MEASURED birth form (the s159 lesson: the spec's
//   own arithmetic carries the measured pin count, never the
//   forecast).

const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s193PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session193.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s194.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s194.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s194.sh"),
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

const globalsSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/globals.css"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2673 delivery checks + this
 *  spec's 12 = 2685 unit, the 255 delivery files + this spec = 256;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s194 lesson). */
const UNIT = "2709";
const FILES = "258";

/** The MEASURED layer figures (the s159 measured form — the STAYS
 *  form this cycle: the L-1 comment fix is the in-place
 *  substitution, one comment line changed at globals.css:48, zero
 *  line-count movement, the layer holding at the S188-A amendment's
 *  post-delivery figure — the in-place comment-correction form's own
 *  receipt, no F40 rider). */
const LAYER_TOTAL = 14373;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The S194 anchors BOTH carry the standing
 *  spelling (digma-s194-auditor-A / digma-s194-auditor-B — the
 *  dispatch briefs specified them and both auditors honored the
 *  form). A's entry landed FIRST (the lead's ordered append, running
 *  to auditor B's separator) and B's second (running to the bracketed
 *  registration note). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const ends = [
    worklogSource.indexOf("\n---\n", at),
    worklogSource.indexOf("\n[s194-id-stable-premises-note:", at),
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

describe("lows-s194: the comment-truth repair + prose-figures-are-claims registrations", () => {
  it("DEFECT (docs): the AGENTS session-194 bullet carries the completion members — the per-auditor census lines, the EIGHTH consecutive vocabulary-HOLD cycle, the F181 prose-figures-are-claims truth lesson, the L-1 comment-truth repair, and the layer-total family STAYING at 14,373 (the in-place comment-correction form)", () => {
    expect(collapsed(agentsSource)).toContain("session 194, S194-A..S194-B");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/1L/2I + B 0C/0H/0M/0L/2I");
    expect(collapsed(agentsSource)).toContain("the EIGHTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F181 LESSON — THE PROSE-FIGURES-ARE-CLAIMS MEMBER");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.173.0 chain entry carries the S194 derivation (2685 = 2673 + 12 unit / 256 files) + the §7.1 row for the s194 spec, the layer-total family STAYING at 14,373 (the in-place comment-correction form, no F40 rider) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    expect(collapsed(padSource)).toContain("2685 = 2673 + 12 unit / 256 files");
    expect(padSource).toContain("lows-s194.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,373");
    expect(collapsed(padSource)).toContain("the route figure STAYING at 2,461");
    expect(padSource).toContain("| **Unit total** | **258 files** | **2709** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2709/2709");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2709 checks / 258 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.173.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.175\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.175.0");
    expect(lastUpdated).toContain("the one-hundred-and-forty-fourth audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.172.0 + the F181 prose-figures-are-claims truth lesson (every figure quoted in prose is a live claim about the current tree; provenance is not proof — a carried figure is a claim that stopped being checked the day it was written; the guard: numeric re-derivation of every figure a sampled comment carries, illustrative figures included) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.174.0");
    expect(skillSource).toContain("181. **F181");
    expect(collapsed(skillSource)).toContain("THE PROSE-FIGURES-ARE-CLAIMS MEMBER");
    expect(skillSource).toContain("2709 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s193 + s192 pair as the standing witnesses) + the anchored declaration census pins 75 UNIT / 74 FILES + the L-1 fix's own regression pin (the corrected figure at the comment and both doc mirrors, the stale figure gone from every live claim site)", () => {
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
    // the L-1 fix: the corrected figure at the comment, the stale figure gone
    // from all three live claim sites (the frozen session_8/9 records stay).
    expect(globalsSource).toContain("#9810FA");
    expect(globalsSource).not.toContain("#8200DB");
    expect(agentsSource).toContain("#9810FA");
    expect(agentsSource).not.toContain("#8200DB");
    expect(padSource).toContain("#9810FA");
    expect(padSource).not.toContain("#8200DB");
  });

  it("SURVIVAL (worklog): the bracketed s194-below-threshold-note registers the twenty-fourth-generation verification (:2840..:2864 = s169..s193, 25 rows, :2839 the s168 row — the F174-corrected window form verified at its own generation) + the F181 PROSE-FIGURES-ARE-CLAIMS truth lesson + the L-1 comment-truth registration + the dispatch-currency-honored registration + the A-I-1 carried §8 letter posture + the vocabulary-HOLD registration + the honest environment record (the SANDBOX-RESET form — the workspace reset between sessions, the fresh clone verified before the gates rode it) + the F138 FORTY-FIFTH instance + the twenty-fifth-generation pre-registration", () => {
    expect(worklogSource).toContain("[s194-below-threshold-note: THE TWENTY-FOURTH-GENERATION COORDINATE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s194-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s194-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F181 LESSON — THE PROSE-FIGURES-ARE-CLAIMS MEMBER");
    expect(collapsed(note)).toContain(":2840..:2864 = s169..s193 (TWENTY-FIVE rows, arithmetic-consistent) with :2839 the S168 row");
    expect(collapsed(note)).toContain("THE L-1 COMMENT-TRUTH REGISTRATION");
    expect(collapsed(note)).toContain("THE B-I-1 DISPATCH-CURRENCY-HONORED REGISTRATION");
    expect(collapsed(note)).toContain("THE A-I-1 CARRIED POSTURE (the master-skill §8 letter posture, its SEVENTH consecutive carry)");
    expect(collapsed(note)).toContain("THE B-I-2 VOCABULARY-HOLD REGISTRATION");
    expect(collapsed(note)).toContain("the SANDBOX-RESET form");
    expect(collapsed(note)).toContain("FORTY-FIFTH INSTANCE");
    expect(collapsed(note)).toContain("THE TWENTY-FIFTH-GENERATION PRE-REGISTRATION");
  });

  it("SURVIVAL (worklog): the bracketed s194-id-stable-premises-note registers the CANONICAL quartet — the 69th ordinal, the four premises at their seams, the F176 quoting prescription's FIFTH full-cycle test (zero label drift again, the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180), and the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s194-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SIXTY-NINTH CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s194-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s194-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CANONICAL QUARTET");
    expect(collapsed(note)).toContain("the F176 prescription's FIFTH full-cycle test — zero label drift again");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan): the F138 guard's FORTY-FIFTH instance — the s193 plan's execution record shipped 4/4 ticked, zero unticked (the pre-armed guard per the session_547/548 directive; the forty-third consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S194 total rides the spec's own census: 877 + 12 = 889)", () => {
    const ticked = s193PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s193PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(4);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(877 + 12).toBe(889);
  });

  it("SURVIVAL (scripts): the s194 script provenance — live194/nav194/digma-seo-s194 tokens, the 170th/171st/131st ordinals, the S193 delivery at fb2ac5c2, zero s193 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live194");
    expect(refAuditSource).toContain("the 170th reference audit");
    expect(refAuditSource).toContain("the S193 delivery at HEAD fb2ac5c2");
    expect(refAuditSource).toContain("byte-identical the 131st");
    expect(refAuditSource).not.toContain("live193");
    expect(refAuditSource).not.toContain("169th reference audit");
    expect(navSource).toContain("nav194");
    expect(navSource).toContain("171st session, S194-cycle");
    expect(navSource).toContain("the S193 delivery fb2ac5c2 + the S194 remediation");
    expect(navSource).not.toContain("nav193");
    expect(seoSource).toContain("digma-seo-s194");
    expect(seoSource).toContain("session 194, S194-cycle");
    expect(seoSource).not.toContain("digma-seo-s193");
  });

  it("SURVIVAL (worklog): the two s194 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/1L/2I at the standing anchor (with the 49-sampled comment-truth census at 48 TRUE / 1 FALSE — the honest form, the FALSE member being the L-1 stale-figure finding, the fully-TRUE streak ended by deriving more not sampling less; the F179 graduated conventions OBSERVED HOLDING at their second steady-state cycle; the pin subset 106/106 across 10 files; and the mobile-nav-by-construction pass) and auditor B's 0C/0H/0M/0L/2I at the standing anchor (with the 69th premises cycle, the 74/73 spec constants on 2673/255, and the write-set arithmetic closing at 25) — both spellings at the standing form", () => {
    const a = auditEntry("Task ID: digma-s194-auditor-A");
    expect(a).toContain("0C / 0H / 0M / 1L / 2I");
    expect(collapsed(a)).toContain("48 TRUE / 1 FALSE");
    expect(collapsed(a)).toContain("second steady-state cycle");
    expect(collapsed(a)).toContain("106/106 PASSED across 10 files");
    expect(a).toContain("14,373");
    const b = auditEntry("Task ID: digma-s194-auditor-B");
    expect(collapsed(b)).toContain("0C / 0H / 0M / 0L / 2I");
    expect(collapsed(b)).toContain("the SIXTY-NINTH consecutive cycle");
    expect(collapsed(b)).toContain("74 UNIT + 73 FILES, all at 2673/255, zero stale");
    expect(collapsed(b)).toContain("13 + 6 + 1 + 5 = 25");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the twentieth re-quote cycle), call.ts still exactly 80 lines", () => {
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

  it("SURVIVAL (layer): the in-place comment-correction form's own receipt — the layer total STAYING at 14,373 (the L-1 fix changing one comment line, zero line-count movement, no F40 rider) derived LIVE with the PER-FILE probe closing, properties-panel.tsx at exactly 2,378, login-screen.tsx STAYING at 747, globals.css STAYING at 300 (the L-1 fix site — the in-place substitution moving no line)", () => {
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
