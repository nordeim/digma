import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-196 spec (the one-hundred-and-forty-fourth audit's chosen
// work — the TENTH consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle; the operator's 2026-10-25 fd2037e3 revision
// byte-unchanged since): 0C/0H/0M/1L/5I combined — a THIRD consecutive
// comment-truth Low, zero behavioral source-code defect, one
// documentation-truth defect with a THREE-SITE one-word fix surface;
// five informational members — one carried posture (the §8 letter
// posture at its ninth consecutive carry), one positive steady-state
// verification (the F179 graduated conventions BOTH confirmed at
// their SIXTH full-cycle test — the fourth steady-state cycle, the
// watch recorded per F180), and three dispatch-brief-side
// F181/F182-class catches (A-I-3 the scope misquote + the subset
// composition, B-I-1 the e2e member labels, B-I-2 the probe path —
// the F183 class: every one a RECALLED figure not re-run); the
// comment-truth census 49 sampled, 48 TRUE / 1 FALSE — the THIRD
// consecutive FALSE member, again by the fresh-eyes numeric
// re-derivation, the FALSE member being the L-1 stale datum-fold
// count figure itself):
//
// S196-A — THE REGISTRATION PAIR (the S187..S195
//   registration-cycle form): the s196-id-stable-premises-note at
//   the 71st consecutive cycle carrying the CANONICAL quartet in
//   exactly one place (the dispatch QUOTING it verbatim — the F176
//   prescription's SEVENTH full-cycle test, zero label drift again,
//   the quoting form the standing convention per F178, the
//   graduated form watched per F179 and confirmed in the steady-
//   state watch per F180) + the s196-below-threshold-note (THE F183
//   recalled-figure truth lesson + the twenty-sixth-generation
//   verification + the L-1 comment-truth registration + the
//   dispatch-currency-honored registration + the vocabulary-HOLD +
//   the honest environment record — the CONTINUATION form this
//   cycle: the workspace NOT reset between sessions, the environment
//   surviving from the s195 session and verified before the gates
//   rode it). The layer STAYS at 14,373 — the in-place
//   comment-correction form (the L-1 fix changes one word at three
//   live claim sites, zero line-count movement), no F40 rider.
//
// S196-B — THE PER-SESSION PIN FAMILY: 12 pins — 5 RED (the doc-side
//   collateral members + the L-1 fix's own regression pin) / 7
//   green-at-birth (the two worklog-registration members, the F138
//   guard's FORTY-SEVENTH instance — the s195 plan's record pinned
//   5/5 ticked at a4a4f02e, the script-provenance member, the
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
const s195PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session195.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s196.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s196.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s196.sh"),
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

const editorSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/editor.ts"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2697 delivery checks + this
 *  spec's 12 = 2709 unit, the 257 delivery files + this spec = 258;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s196 lesson). */
const UNIT = "2709";
const FILES = "258";

/** The MEASURED layer figures (the s159 measured form — the STAYS
 *  form this cycle: the L-1 comment fix is the in-place one-word
 *  substitution at three live claim sites, zero line-count
 *  movement, the layer holding at the S188-A amendment's
 *  post-delivery figure — the in-place comment-correction form's own
 *  receipt, no F40 rider). */
const LAYER_TOTAL = 14373;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The S196 anchors BOTH carry the standing
 *  spelling (digma-s196-auditor-A / digma-s196-auditor-B — the
 *  dispatch briefs specified them and both auditors honored the
 *  form). B's entry landed FIRST (running to auditor A's separator)
 *  and A's second (running to the bracketed registration note). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const ends = [
    worklogSource.indexOf("\n---\n", at),
    worklogSource.indexOf("\n[s196-id-stable-premises-note:", at),
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

describe("lows-s196: the comment-truth repair + recalled-figure registrations", () => {
  it("DEFECT (docs): the AGENTS session-196 bullet carries the completion members — the per-auditor census lines, the TENTH consecutive vocabulary-HOLD cycle, the F183 recalled-figure truth lesson, the L-1 comment-truth repair, and the layer-total family STAYING at 14,373 (the in-place comment-correction form)", () => {
    expect(collapsed(agentsSource)).toContain("session 196, S196-A..S196-B");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/1L/3I + B 0C/0H/0M/0L/2I");
    expect(collapsed(agentsSource)).toContain("the TENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F183 LESSON — THE RECALLED-FIGURE MEMBER");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.175.0 chain entry carries the S196 derivation (2709 = 2697 + 12 unit / 258 files) + the §7.1 row for the s196 spec, the layer-total family STAYING at 14,373 (the in-place comment-correction form, no F40 rider) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    expect(collapsed(padSource)).toContain("2709 = 2697 + 12 unit / 258 files");
    expect(padSource).toContain("lows-s196.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,373");
    expect(collapsed(padSource)).toContain("the route figure STAYING at 2,461");
    expect(padSource).toContain("| **Unit total** | **258 files** | **2709** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2709/2709");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2709 checks / 258 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.175.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.175\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.175.0");
    expect(lastUpdated).toContain("the one-hundred-and-forty-fourth audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.174.0 + the F183 recalled-figure truth lesson (a figure or probe statement carried from a prior record into a new brief is itself an unverified claim about the CURRENT tree; the exact-form rule binds at every RE-USE — the prior record's own probe RE-RUN at the current tree before the figure rides the brief) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.174.0");
    expect(skillSource).toContain("183. **F183");
    expect(collapsed(skillSource)).toContain("THE RECALLED-FIGURE MEMBER");
    expect(skillSource).toContain("2709 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s195 + s194 pair as the standing witnesses) + the anchored declaration census pins 77 UNIT / 76 FILES + the L-1 fix's own regression pin (the corrected figure at all THREE live claim sites — the code site + the two doc mirrors — the stale figure gone from each, the frozen records staying)", () => {
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
    // the L-1 fix: the corrected figure at all three live claim sites,
    // the stale figure gone from each (the frozen session-104 records
    // stay — the s104 plan, the s104 spec's birth-record comments, the
    // PAD's frozen v1.83.0 chain line, the worklog's s104 records).
    expect(editorSource).toContain("hand-spelled at nine sites");
    expect(editorSource).not.toContain("hand-spelled at eight sites");
    expect(agentsSource).toContain("nine hand-spelled `#0D1117` sites");
    expect(agentsSource).not.toContain("eight hand-spelled `#0D1117` sites");
    expect(padSource).toContain("hand-spelled at nine sites (the store initial");
    expect(padSource).not.toContain("hand-spelled at eight sites (the store initial");
  });

  it("SURVIVAL (worklog): the bracketed s196-below-threshold-note registers the twenty-sixth-generation verification (:2844..:2868 = s171..s195, 25 rows, :2843 the s170 row, :2842 the s169 row — the F174-corrected window form verified at its own generation) + the F183 RECALLED-FIGURE truth lesson + the L-1 comment-truth registration + the dispatch-currency-honored registration + the A-I-1 carried §8 letter posture + the vocabulary-HOLD registration + the honest environment record (the CONTINUATION form — the workspace NOT reset between sessions, the environment surviving from the s195 session, verified before the gates rode it) + the F138 FORTY-SEVENTH instance + the twenty-seventh-generation pre-registration", () => {
    expect(worklogSource).toContain("[s196-below-threshold-note: THE TWENTY-SIXTH-GENERATION COORDINATE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s196-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s196-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F183 LESSON — THE RECALLED-FIGURE MEMBER");
    expect(collapsed(note)).toContain(":2844..:2868 = s171..s195 (TWENTY-FIVE rows, arithmetic-consistent) with :2843 the s170 row and :2842 the s169 row");
    expect(collapsed(note)).toContain("THE L-1 COMMENT-TRUTH REGISTRATION");
    expect(collapsed(note)).toContain("THE DISPATCH-CURRENCY-HONORED REGISTRATION");
    expect(collapsed(note)).toContain("THE A-I-1 CARRIED §8 LETTER POSTURE");
    expect(collapsed(note)).toContain("THE VOCABULARY-HOLD REGISTRATION");
    expect(collapsed(note)).toContain("THE CONTINUATION FORM");
    expect(collapsed(note)).toContain("FORTY-SEVENTH INSTANCE");
    expect(collapsed(note)).toContain("THE TWENTY-SEVENTH-GENERATION PRE-REGISTRATION");
  });

  it("SURVIVAL (worklog): the bracketed s196-id-stable-premises-note registers the CANONICAL quartet — the 71st ordinal, the four premises at their seams, the F176 quoting prescription's SEVENTH full-cycle test (zero label drift again, the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180), and the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s196-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SEVENTY-FIRST CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s196-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s196-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CANONICAL QUARTET");
    expect(collapsed(note)).toContain("the F176 prescription's SEVENTH full-cycle test — zero label drift again");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan): the F138 guard's FORTY-SEVENTH instance — the s195 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_556/557 directive; the forty-fifth consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S196 total rides the spec's own census: 901 + 12 = 913)", () => {
    const ticked = s195PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s195PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(901 + 12).toBe(913);
  });

  it("SURVIVAL (scripts): the s196 script provenance — live196/nav196/digma-seo-s196 tokens, the 172nd/173rd/133rd ordinals, the S195 delivery at a4a4f02e, zero s195 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live196");
    expect(refAuditSource).toContain("the 172nd reference audit");
    expect(refAuditSource).toContain("the S195 delivery at HEAD a4a4f02e");
    expect(refAuditSource).toContain("byte-identical the 133rd");
    expect(refAuditSource).not.toContain("live195");
    expect(refAuditSource).not.toContain("171st reference audit");
    expect(navSource).toContain("nav196");
    expect(navSource).toContain("173rd session, S196-cycle");
    expect(navSource).toContain("the S195 delivery a4a4f02e + the S196 remediation");
    expect(navSource).not.toContain("nav195");
    expect(seoSource).toContain("digma-seo-s196");
    expect(seoSource).toContain("session 196, S196-cycle");
    expect(seoSource).not.toContain("digma-seo-s195");
  });

  it("SURVIVAL (worklog): the two s196 audit entries ride at their Task-ID anchors with their census lines — auditor A's 1L/3I at the standing anchor (with the 49-sampled comment-truth census at 48 TRUE / 1 FALSE — the honest form, the FALSE member being the L-1 stale-count finding, the THIRD consecutive FALSE member, all caught by deriving more; the pin subset 130/130 across the 12 dispatched files; the THIRD-consecutive-comment-truth-Low registration; and the 22-file layer census at 14,373) and auditor B's 0L/2I at the standing anchor (with the 71st premises cycle, the 13 + 6 + 1 + 5 = 25 write-set arithmetic, and the 18-route census at 2,461) — both spellings at the standing form", () => {
    const a = auditEntry("Task ID: digma-s196-auditor-A");
    expect(a).toContain("1 Low / 3 Informational");
    expect(collapsed(a)).toContain("48 TRUE / 1 FALSE");
    expect(collapsed(a)).toContain("130/130 PASSED across the 12 dispatched files");
    expect(a).toContain("14,373");
    expect(collapsed(a)).toContain("THIRD consecutive comment-truth Low");
    const b = auditEntry("Task ID: digma-s196-auditor-B");
    expect(collapsed(b)).toContain("0 Low / 2 Informational");
    expect(collapsed(b)).toContain("the 71st consecutive cycle");
    expect(collapsed(b)).toContain("13 + 6 + 1 + 5 = 25");
    expect(b).toContain("2,461");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the twenty-second re-quote cycle), call.ts still exactly 80 lines", () => {
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

  it("SURVIVAL (layer): the in-place comment-correction form's own receipt — the layer total STAYING at 14,373 (the L-1 fix changing one word at three live claim sites, zero line-count movement, no F40 rider) derived LIVE with the PER-FILE probe closing, editor.ts at exactly 1,263 (the L-1 fix site — the in-place substitution moving no line), properties-panel.tsx at exactly 2,378, globals.css STAYING at 300, login-screen.tsx STAYING at 747", () => {
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
  });
});
