import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-198 spec (the one-hundred-and-forty-sixth audit's chosen
// work — the TWELFTH consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM: the master
// skill's own file byte-unchanged since the operator's 2026-10-25
// fd2037e3 revision, while the operator's own 6d412aa6 push refreshed
// the skills CATALOG around it — three new operator skills + the
// count 340 to 345, outside the app code and outside the audit
// scope): 0C/0H/0M/0L/4I combined — a BELOW-THRESHOLD cycle, the
// first zero-Low census since session 192, zero behavioral
// source-code defect, zero comment-truth defect; four informational
// members — three dispatch-brief-side (A-I-1 the trap-4 axis
// definitions paraphrased into size-axis prose, B-I-1 the src/lib
// named list inventing a seed-helpers.ts that never existed, B-I-2
// the e2e write-set arithmetic mislabeled a file count where it is
// the HANDLER census decomposed by e2e coverage) + one source-side
// observation carried as a frozen-birth-record nuance (B-I-3 the
// S67-B ~722 KB/~1.45 GB defect-arithmetic family, true at its own
// era, deliberately preserved by the S112-D/S117-A re-anchors, the
// current-era worst case ~1.8 GB registered without touching the
// frozen family); the comment-truth census 77 sampled, 77 TRUE /
// 0 FALSE — the FIRST all-TRUE census since the family's s193
// formalization, the S197 repair independently verified
// live-reproducing):
//
// S198-A — THE REGISTRATION PAIR (the S187..S197
//   registration-cycle form): the s198-id-stable-premises-note at
//   the 73rd consecutive cycle carrying the CANONICAL quartet in
//   exactly one place (the dispatch QUOTING it verbatim — the F176
//   prescription's NINTH full-cycle test, zero label drift again,
//   the quoting form the standing convention per F178, the graduated
//   form watched per F179 and confirmed in the steady-state watch
//   per F180) + the s198-below-threshold-note (THE F185
//   brief-paraphrase truth lesson + the twenty-eighth-generation
//   verification + the first all-true comment-truth census
//   registration + the B-I-3 frozen-birth-record nuance + the
//   honest folder-level vocabulary-HOLD form + the
//   dispatch-currency-honored registration + the honest environment
//   record — the SANDBOX-RESET form this cycle: the workspace found
//   empty, the fresh clone verified before the gates rode it). The
//   layer STAYS at 14,373 — the below-threshold form (zero source
//   changes this cycle), no F40 rider.
//
// S198-B — THE PER-SESSION PIN FAMILY: 12 pins — 5 RED (the doc-side
//   collateral members) / 7 green-at-birth (the two worklog-
//   registration members, the F138 guard's FORTY-NINTH instance —
//   the s197 plan's record pinned 5/5 ticked at 5af71b9f, the
//   script-provenance member, the audit-entry members — both anchors
//   at their standing spellings this cycle, the standing-figures
//   member, the layer-STAYS member, and the B-I-3 frozen-record
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
const s197PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session197.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s198.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s198.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s198.sh"),
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

const validationSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/validation.ts"),
  "utf8",
);

const elementsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2721 delivery checks + this
 *  spec's 12 = 2733 unit, the 259 delivery files + this spec = 260;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s198 lesson). */
const UNIT = "2783";
const FILES = "264";

/** The MEASURED layer figures (the s159 measured form — the STAYS
 *  form this cycle: the below-threshold remediation touches zero
 *  source lines, the layer holding at the S188-A amendment's
 *  post-delivery figure — no F40 rider). */
const LAYER_TOTAL = 14373;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The S198 anchors BOTH carry the standing
 *  spelling (digma-s198-auditor-A / digma-s198-auditor-B — the
 *  dispatch briefs specified them and both auditors honored the
 *  form). B's entry landed FIRST (running to its own separator) and
 *  A's second (running to its separator / the bracketed registration
 *  note). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const ends = [
    worklogSource.indexOf("\n---\n", at + 20),
    worklogSource.indexOf("\n[s198-id-stable-premises-note:", at),
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
    { cwd: root, encoding: "utf8",
    },
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

describe("lows-s198: the below-threshold registrations + the brief-paraphrase lesson", () => {
  it("DEFECT (docs): the AGENTS session-198 bullet carries the completion members — the per-auditor census lines, the TWELFTH consecutive vocabulary-HOLD cycle in the honest folder-level form, the F185 brief-paraphrase truth lesson, the first all-TRUE comment-truth census, and the layer-total family STAYING at 14,373 (the below-threshold form)", () => {
    expect(collapsed(agentsSource)).toContain("session 198, S198-A..S198-B");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/0L/1I + B 0C/0H/0M/0L/3I");
    expect(collapsed(agentsSource)).toContain("the TWELFTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F185 LESSON — THE BRIEF-PARAPHRASE MEMBER");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.177.0 chain entry carries the S198 derivation (2733 = 2721 + 12 unit / 260 files) + the §7.1 row for the s198 spec, the layer-total family STAYING at 14,373 (the below-threshold form, no F40 rider) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    expect(collapsed(padSource)).toContain("2733 = 2721 + 12 unit / 260 files");
    expect(padSource).toContain("lows-s198.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,373");
    expect(collapsed(padSource)).toContain("the route figure STAYING at 2,461");
    expect(padSource).toContain("| **Unit total** | **264 files** | **2783** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2783/2783");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2783 checks / 264 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.177.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.181\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.181.0");
    expect(lastUpdated).toContain("the one-hundred-and-fiftieth audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.176.0 + the F185 brief-paraphrase truth lesson (a dispatch brief's own definitions, lists, and labels are claims too; the brief QUOTES the standing registration's forms verbatim — axes, file lists, arithmetic labels — never paraphrases from recall) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.180.0");
    expect(skillSource).toContain("185. **F185");
    expect(collapsed(skillSource)).toContain("THE BRIEF-PARAPHRASE MEMBER");
    expect(skillSource).toContain("2783 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s197 + s196 pair as the standing witnesses) + the anchored declaration census pins 79 UNIT / 78 FILES", () => {
    expect(UNIT).toBe("2783");
    expect(FILES).toBe("264");
    const root = path.resolve(import.meta.dirname, "..");
    const out = execSync(
      `rg -l '^const UNIT = "2783";$' tests/ src/lib/ | wc -l && rg -l '^const FILES = "264";$' tests/ src/lib/ | wc -l`,
      { cwd: root, encoding: "utf8" },
    );
    const [unitFiles, filesFiles] = out.trim().split("\n").map(Number);
    expect(unitFiles).toBe(83);
    expect(filesFiles).toBe(82);
  });

  it("SURVIVAL (worklog): the bracketed s198-below-threshold-note registers the twenty-eighth-generation verification (:2848..:2872 = s173..s197, 25 rows, :2847 the s172 row, :2846 the s171 row — the F174-corrected window form verified at its own generation) + the F185 BRIEF-PARAPHRASE truth lesson + the first all-TRUE comment-truth census registration + the B-I-3 frozen-birth-record nuance registration + the dispatch-currency-honored registration + the A-I-1 carried §8 letter posture + the honest folder-level vocabulary-HOLD registration + the honest environment record (the SANDBOX-RESET form) + the F138 FORTY-NINTH instance + the twenty-ninth-generation pre-registration", () => {
    expect(worklogSource).toContain("[s198-below-threshold-note: THE TWENTY-EIGHTH-GENERATION COORDINATE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s198-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s198-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F185 LESSON — THE BRIEF-PARAPHRASE MEMBER");
    expect(collapsed(note)).toContain(":2848..:2872 = s173..s197 (TWENTY-FIVE rows, arithmetic-consistent) with :2847 the s172 row and :2846 the s171 row");
    expect(collapsed(note)).toContain("THE FIRST ALL-TRUE COMMENT-TRUTH CENSUS REGISTRATION");
    expect(collapsed(note)).toContain("THE B-I-3 FROZEN-BIRTH-RECORD NUANCE REGISTRATION");
    expect(collapsed(note)).toContain("THE DISPATCH-CURRENCY-HONORED REGISTRATION");
    expect(collapsed(note)).toContain("THE A-I-1 CARRIED §8 LETTER POSTURE");
    expect(collapsed(note)).toContain("THE VOCABULARY-HOLD REGISTRATION IN THE HONEST FOLDER-LEVEL FORM");
    expect(collapsed(note)).toContain("THE SANDBOX-RESET FORM");
    expect(collapsed(note)).toContain("FORTY-NINTH INSTANCE");
    expect(collapsed(note)).toContain("THE TWENTY-NINTH-GENERATION PRE-REGISTRATION");
  });

  it("SURVIVAL (worklog): the bracketed s198-id-stable-premises-note registers the CANONICAL quartet — the 73rd ordinal, the four premises at their seams, the F176 quoting prescription's NINTH full-cycle test (zero label drift again, the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180), and the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s198-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SEVENTY-THIRD CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s198-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s198-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CANONICAL QUARTET");
    expect(collapsed(note)).toContain("the F176 prescription's NINTH full-cycle test — zero label drift again");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan): the F138 guard's FORTY-NINTH instance — the s197 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_561/562 directive; the forty-seventh consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S198 total rides the spec's own census: 925 + 12 = 937)", () => {
    const ticked = s197PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s197PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(925 + 12).toBe(937);
  });

  it("SURVIVAL (scripts): the s198 script provenance — live198/nav198/digma-seo-s198 tokens, the 174th/175th/135th ordinals, the S197 delivery at 5af71b9f, zero s197 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live198");
    expect(refAuditSource).toContain("the 174th reference audit");
    expect(refAuditSource).toContain("the S197 delivery at HEAD 5af71b9f");
    expect(refAuditSource).toContain("byte-identical the 135th");
    expect(refAuditSource).not.toContain("live197");
    expect(refAuditSource).not.toContain("173rd reference audit");
    expect(navSource).toContain("nav198");
    expect(navSource).toContain("175th session, S198-cycle");
    expect(navSource).toContain("the S197 delivery 5af71b9f + the S198 remediation");
    expect(navSource).not.toContain("nav197");
    expect(seoSource).toContain("digma-seo-s198");
    expect(seoSource).toContain("session 198, S198-cycle");
    expect(seoSource).not.toContain("digma-seo-s197");
  });

  it("SURVIVAL (worklog): the two s198 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0L/1I at the standing anchor (with the 49-sampled comment-truth census at 49 TRUE / 0 FALSE — the FIRST all-TRUE census, the S197 repair independently verified live-reproducing; the pin subset 129/129 across the 12 dispatched files; and the 22-file layer census at 14,373) and auditor B's 0L/3I at the standing anchor (with the 73rd premises cycle, the 13 + 6 + 1 + 5 = 25 handler-census write-set arithmetic, and the 18-route census at 2,461) — both spellings at the standing form", () => {
    const a = auditEntry("Task ID: digma-s198-auditor-A");
    expect(a).toContain("0 Low / 1 Informational");
    expect(collapsed(a)).toContain("49 sampled, 49 TRUE / 0 FALSE");
    expect(collapsed(a)).toContain("129/129 across the 12 dispatched files");
    expect(a).toContain("14,373");
    expect(collapsed(a)).toContain("the FIRST all-TRUE census");
    const b = auditEntry("Task ID: digma-s198-auditor-B");
    expect(collapsed(b)).toContain("0 Low / 3 Informational");
    expect(collapsed(b)).toContain("the 73rd consecutive cycle");
    expect(collapsed(b)).toContain("13 + 6 + 1 + 5 = 25");
    expect(b).toContain("2,461");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the twenty-fourth re-quote cycle), call.ts still exactly 80 lines", () => {
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

  it("SURVIVAL (layer + frozen record): the below-threshold form's own receipt — the layer total STAYING at 14,373 (zero source changes this cycle, no F40 rider) derived LIVE with the PER-FILE probe closing, editor.ts at exactly 1,263, properties-panel.tsx at exactly 2,378, globals.css STAYING at 300, login-screen.tsx STAYING at 747, AND the B-I-3 frozen-birth-record family staying frozen + pinned (the S67-B ~722 KB/~1.45 GB arithmetic untouched at its claim sites, the era-anchored birth-record form)", () => {
    expect(liveLayerTotal).toBe(LAYER_TOTAL);
    const layerHandSum = Object.values(liveLayerPerFile).reduce(
      (a, b) => a + b,
      0,
    );
    expect(layerHandSum).toBe(liveLayerTotal);
    expect(liveLayerPerFile["src/lib/editor.ts"]).toBe(1263);
    expect(liveLayerPerFile["src/components/editor/properties-panel.tsx"]).toBe(2378);
    expect(liveLayerPerFile["src/app/globals.css"]).toBe(300);
    expect(liveLayerPerFile["src/components/login-screen.tsx"]).toBe(747);
    expect(liveLayerPerFile["src/components/editor/editor-view.tsx"]).toBe(2453);
    expect(liveLayerPerFile["src/components/editor/editor-store.ts"]).toBe(847);
    // the B-I-3 frozen family: the S67-era defect arithmetic stays
    // untouched (true at its own era, deliberately preserved by the
    // S112-D/S117-A re-anchors, pinned at request-surface-s67 +
    // server-lows-s76; the current-era ~1.8 GB fact registered in the
    // below-threshold note WITHOUT touching these records).
    expect(elementsRouteSource).toContain("2000 × ~722 KB ≈ 1.45 GB under the per-field caps");
    expect(validationSource).toContain("~2000 × ~722 KB ≈ 1.45 GB");
  });
});
