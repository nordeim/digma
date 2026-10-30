import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-197 spec (the one-hundred-and-forty-fifth audit's chosen
// work — the ELEVENTH consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle; the operator's 2026-10-25 fd2037e3 revision
// byte-unchanged since): 0C/0H/0M/1L/2I combined — a FOURTH consecutive
// comment-truth Low, zero behavioral source-code defect, one
// documentation-truth defect with a SIX-SITE in-place figure fix
// surface; two informational members — two dispatch-brief-side
// coordinate catches (A-I-1 the born-stale PAD :312 coordinate, B-I-1
// the recalled 27th-generation carrier :2997 — the F183 class catching
// the lead's brief the THIRD consecutive cycle); the comment-truth
// census 49 sampled, 48 TRUE / 1 FALSE — the FOURTH consecutive
// single-FALSE cycle, again by the fresh-eyes numeric re-derivation,
// the FALSE member being the L-1 stale per-row serialization figure
// itself):
//
// S197-A — THE REGISTRATION PAIR (the S187..S196
//   registration-cycle form): the s197-id-stable-premises-note at
//   the 72nd consecutive cycle carrying the CANONICAL quartet in
//   exactly one place (the dispatch QUOTING it verbatim — the F176
//   prescription's EIGHTH full-cycle test, zero label drift again,
//   the quoting form the standing convention per F178, the
//   graduated form watched per F179 and confirmed in the steady-
//   state watch per F180) + the s197-below-threshold-note (THE F184
//   born-stale-coordinate truth lesson + the twenty-seventh-
//   generation verification + the L-1 comment-truth registration +
//   the dispatch-currency-honored registration + the vocabulary-HOLD
//   + the honest environment record — the SANDBOX-RESET form this
//   cycle: the workspace found empty, the fresh clone verified
//   before the gates rode it). The layer STAYS at 14,373 — the
//   in-place comment-correction form (the L-1 fix swaps two figures
//   at six live claim sites, zero line-count movement), no F40
//   rider.
//
// S197-B — THE PER-SESSION PIN FAMILY: 12 pins — 5 RED (the doc-side
//   collateral members + the L-1 fix's own regression pin) / 7
//   green-at-birth (the two worklog-registration members, the F138
//   guard's FORTY-EIGHTH instance — the s196 plan's record pinned
//   5/5 ticked at 2106eaa8, the script-provenance member, the
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
const s196PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session196.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s197.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s197.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s197.sh"),
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
 *  born at the POST-spec figures: the 2709 delivery checks + this
 *  spec's 12 = 2721 unit, the 258 delivery files + this spec = 259;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s197 lesson). */
const UNIT = "2721";
const FILES = "259";

/** The MEASURED layer figures (the s159 measured form — the STAYS
 *  form this cycle: the L-1 comment fix is the in-place figure
 *  substitution at six live claim sites, zero line-count
 *  movement, the layer holding at the S188-A amendment's
 *  post-delivery figure — the in-place comment-correction form's own
 *  receipt, no F40 rider). */
const LAYER_TOTAL = 14373;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The S197 anchors BOTH carry the standing
 *  spelling (digma-s197-auditor-A / digma-s197-auditor-B — the
 *  dispatch briefs specified them and both auditors honored the
 *  form). B's entry landed FIRST (running to the separator) and A's
 *  second (running to the bracketed registration note). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const ends = [
    worklogSource.indexOf("\n---\n", at),
    worklogSource.indexOf("\n[s197-id-stable-premises-note:", at),
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

describe("lows-s197: the comment-truth repair + born-stale-coordinate registrations", () => {
  it("DEFECT (docs): the AGENTS session-197 bullet carries the completion members — the per-auditor census lines, the ELEVENTH consecutive vocabulary-HOLD cycle, the F184 born-stale-coordinate truth lesson, the L-1 comment-truth repair, and the layer-total family STAYING at 14,373 (the in-place comment-correction form)", () => {
    expect(collapsed(agentsSource)).toContain("session 197, S197-A..S197-B");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/1L/1I + B 0C/0H/0M/0L/1I");
    expect(collapsed(agentsSource)).toContain("the ELEVENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F184 LESSON — THE BORN-STALE COORDINATE MEMBER");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.176.0 chain entry carries the S197 derivation (2721 = 2709 + 12 unit / 259 files) + the §7.1 row for the s197 spec, the layer-total family STAYING at 14,373 (the in-place comment-correction form, no F40 rider) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    expect(collapsed(padSource)).toContain("2721 = 2709 + 12 unit / 259 files");
    expect(padSource).toContain("lows-s197.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,373");
    expect(collapsed(padSource)).toContain("the route figure STAYING at 2,461");
    expect(padSource).toContain("| **Unit total** | **259 files** | **2721** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2721/2721");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2721 checks / 259 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.176.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.176\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.176.0");
    expect(lastUpdated).toContain("the one-hundred-and-forty-fifth audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.175.0 + the F184 born-stale-coordinate truth lesson (a cycle's plan-time coordinates are PRE-collateral measurements, and the delivery that creates the record can itself falsify the coordinates the record claims; at delivery every stated coordinate is RE-MEASURED at the DELIVERED tree before the record ships) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.175.0");
    expect(skillSource).toContain("184. **F184");
    expect(collapsed(skillSource)).toContain("THE BORN-STALE COORDINATE MEMBER");
    expect(skillSource).toContain("2721 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s196 + s195 pair as the standing witnesses) + the anchored declaration census pins 78 UNIT / 77 FILES + the L-1 fix's own regression pin (the corrected figures at all SIX live claim sites — the code site + the two AGENTS mirrors + the three PAD mirrors — the stale figures gone from each, the frozen records staying)", () => {
    expect(UNIT).toBe("2721");
    expect(FILES).toBe("259");
    const root = path.resolve(import.meta.dirname, "..");
    const out = execSync(
      `rg -l '^const UNIT = "2721";$' tests/ src/lib/ | wc -l && rg -l '^const FILES = "259";$' tests/ src/lib/ | wc -l`,
      { cwd: root, encoding: "utf8" },
    );
    const [unitFiles, filesFiles] = out.trim().split("\n").map(Number);
    expect(unitFiles).toBe(78);
    expect(filesFiles).toBe(77);
    // the L-1 fix: the corrected figures at all six live claim sites,
    // the stale figures gone from each (the frozen session-117/118
    // records stay — the s117/s118 specs' birth-record comments, the
    // PAD's frozen v1.96.0/v1.97.0 chain lines, the worklog's
    // s117/s118 records, the s117/s118 commit messages).
    expect(editorSource).toContain("(~510 chars measured — ids, coordinates, timestamps, field names,");
    expect(editorSource).not.toContain("~380 chars measured");
    expect(editorSource).toContain("fixed slack is ~1.02 MB");
    expect(editorSource).not.toContain("~0.76 MB");
    expect(agentsSource).toContain("(~510 chars measured) stays outside the count — ~1.02 MB at ELEMENT_LIMIT");
    expect(agentsSource).not.toContain("~380 chars measured");
    // the stale-gone form targets the CLAIM ("— ~0.76 MB at
    // ELEMENT_LIMIT"), not the bare substring — the session-197
    // bullet's own historical defect description ("its ~0.76 MB
    // companion") is an honest reference, not a live claim.
    expect(agentsSource).not.toContain("— ~0.76 MB at ELEMENT_LIMIT");
    expect(padSource).toContain("(~510 chars measured) stays outside the count — ~1.02 MB at ELEMENT_LIMIT");
    expect(padSource).not.toContain("(~380 chars measured) stays outside the count");
    expect(padSource).toContain("the fixed per-row serialization ~510 chars measured stays outside the count, ~1.02 MB at ELEMENT_LIMIT");
    expect(padSource).toContain("the ~1.02 MB fixed per-row slack");
    // the frozen records stay frozen: the PAD :80 v1.96.0 chain line's
    // own ~380/~0.76 forms and the :167 lead-measured parenthetical's
    // id-less "minimal row at 380" provenance untouched.
    expect(padSource).toContain("the fixed per-row serialization ~380 chars measured stays outside the count — ~0.76 MB");
    expect(padSource).toContain("the minimal row at 380");
  });

  it("SURVIVAL (worklog): the bracketed s197-below-threshold-note registers the twenty-seventh-generation verification (:2846..:2870 = s172..s196, 25 rows, :2845 the s171 row, :2844 the s170 row — the F174-corrected window form verified at its own generation) + the F184 BORN-STALE-COORDINATE truth lesson + the L-1 comment-truth registration + the dispatch-currency-honored registration + the A-I-1 carried §8 letter posture + the vocabulary-HOLD registration + the honest environment record (the SANDBOX-RESET form — the workspace found empty, the fresh clone verified before the gates rode it) + the F138 FORTY-EIGHTH instance + the twenty-eighth-generation pre-registration", () => {
    expect(worklogSource).toContain("[s197-below-threshold-note: THE TWENTY-SEVENTH-GENERATION COORDINATE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s197-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s197-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F184 LESSON — THE BORN-STALE COORDINATE MEMBER");
    expect(collapsed(note)).toContain(":2846..:2870 = s172..s196 (TWENTY-FIVE rows, arithmetic-consistent) with :2845 the s171 row and :2844 the s170 row");
    expect(collapsed(note)).toContain("THE L-1 COMMENT-TRUTH REGISTRATION");
    expect(collapsed(note)).toContain("THE DISPATCH-CURRENCY-HONORED REGISTRATION");
    expect(collapsed(note)).toContain("THE A-I-1 CARRIED §8 LETTER POSTURE");
    expect(collapsed(note)).toContain("THE VOCABULARY-HOLD REGISTRATION");
    expect(collapsed(note)).toContain("THE SANDBOX-RESET FORM");
    expect(collapsed(note)).toContain("FORTY-EIGHTH INSTANCE");
    expect(collapsed(note)).toContain("THE TWENTY-EIGHTH-GENERATION PRE-REGISTRATION");
  });

  it("SURVIVAL (worklog): the bracketed s197-id-stable-premises-note registers the CANONICAL quartet — the 72nd ordinal, the four premises at their seams, the F176 quoting prescription's EIGHTH full-cycle test (zero label drift again, the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180), and the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s197-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SEVENTY-SECOND CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s197-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s197-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CANONICAL QUARTET");
    expect(collapsed(note)).toContain("the F176 prescription's EIGHTH full-cycle test — zero label drift again");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan): the F138 guard's FORTY-EIGHTH instance — the s196 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_558/559 directive; the forty-sixth consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S197 total rides the spec's own census: 913 + 12 = 925)", () => {
    const ticked = s196PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s196PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(913 + 12).toBe(925);
  });

  it("SURVIVAL (scripts): the s197 script provenance — live197/nav197/digma-seo-s197 tokens, the 173rd/174th/134th ordinals, the S196 delivery at 2106eaa8, zero s196 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live197");
    expect(refAuditSource).toContain("the 173rd reference audit");
    expect(refAuditSource).toContain("the S196 delivery at HEAD 2106eaa8");
    expect(refAuditSource).toContain("byte-identical the 134th");
    expect(refAuditSource).not.toContain("live196");
    expect(refAuditSource).not.toContain("172nd reference audit");
    expect(navSource).toContain("nav197");
    expect(navSource).toContain("174th session, S197-cycle");
    expect(navSource).toContain("the S196 delivery 2106eaa8 + the S197 remediation");
    expect(navSource).not.toContain("nav196");
    expect(seoSource).toContain("digma-seo-s197");
    expect(seoSource).toContain("session 197, S197-cycle");
    expect(seoSource).not.toContain("digma-seo-s196");
  });

  it("SURVIVAL (worklog): the two s197 audit entries ride at their Task-ID anchors with their census lines — auditor A's 1L/1I at the standing anchor (with the 49-sampled comment-truth census at 48 TRUE / 1 FALSE — the honest form, the FALSE member being the L-1 stale-figure finding, the FOURTH consecutive single-FALSE cycle, all caught by deriving more; the pin subset 129/129 across the 12 dispatched files; the FOURTH-consecutive-comment-truth-Low registration; and the 22-file layer census at 14,373) and auditor B's 0L/1I at the standing anchor (with the 72nd premises cycle, the 13 + 6 + 1 + 5 = 25 write-set arithmetic, and the 18-route census at 2,461) — both spellings at the standing form", () => {
    const a = auditEntry("Task ID: digma-s197-auditor-A");
    expect(a).toContain("1 Low / 1 Informational");
    expect(collapsed(a)).toContain("48 TRUE / 1 FALSE");
    expect(collapsed(a)).toContain("129/129 passed across 12 files");
    expect(a).toContain("14,373");
    expect(collapsed(a)).toContain("FOURTH consecutive single-FALSE cycle");
    const b = auditEntry("Task ID: digma-s197-auditor-B");
    expect(collapsed(b)).toContain("0 Low / 1 Informational");
    expect(collapsed(b)).toContain("the 72nd consecutive cycle");
    expect(collapsed(b)).toContain("13 + 6 + 1 + 5 = 25");
    expect(b).toContain("2,461");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the twenty-third re-quote cycle), call.ts still exactly 80 lines", () => {
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

  it("SURVIVAL (layer): the in-place comment-correction form's own receipt — the layer total STAYING at 14,373 (the L-1 fix swapping two figures at six live claim sites, zero line-count movement, no F40 rider) derived LIVE with the PER-FILE probe closing, editor.ts at exactly 1,263 (the L-1 fix site — the in-place substitution moving no line), properties-panel.tsx at exactly 2,378, globals.css STAYING at 300, login-screen.tsx STAYING at 747", () => {
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
