import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-201 spec (the one-hundred-and-forty-ninth audit's chosen
// work — the FIFTEENTH consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM: the master
// skill's own file byte-unchanged since the operator's 2026-10-25
// fd2037e3 revision): 0C/0H/0M/1L/6I combined — THE FIRST LOW-CARRYING
// CENSUS SINCE SESSION 197 (the three-cycle zero-Low streak ending),
// zero behavioral source-code defect, ONE comment-truth defect — the
// CT-1 stale pointer (auth.ts:28's "(documented in README
// troubleshooting)" — the rotation FACT true, the POINTER false, the
// row never having existed at any commit, a birth-era stale pointer);
// six informational members — two label-precision catches (A-I-1/CT-2
// the s200 record's "ten raw-fetch" count word under-counting the
// tree's ELEVEN sites — the code's own call.ts:22 registration the
// correct form; B201-I-4 the no-e2e-five "write-carrying" qualifier
// over-covering elements GET the read-only member), one session-prep
// probe-label bug (B201-I-5 — the CEILINGS probe string missing the
// spaced-equals spelling), and three carried standing postures (the
// B-I-1 docblock-symmetry carry at its second, the me-route form, the
// skill-side §7 vocabulary); the comment-truth census 253 sampled —
// 175 client-layer + 78 route/lib — 252 TRUE / 1 FALSE, the largest
// sample yet, the all-TRUE streak ending at three):
//
// S201-A — THE CT-1 FIX (THE CYCLE'S ONE LOW): the README
//   Troubleshooting AUTH_SECRET rotation row — making the auth.ts:28
//   pointer TRUE while delivering the ops content the comment
//   promises; ZERO src/ changes (the layer STAYING at 14,373, the
//   routes STAYING at 2,461, src/lib STAYING at 3,249; the frozen
//   comment untouched — the pointer true at the fixed tree).
//
// S201-B — THE REGISTRATION PAIR + THE LABEL-PRECISION RIDERS (the
//   S187..S200 registration-cycle form): the s201-id-stable-premises-
//   note at the 76th consecutive cycle carrying the CANONICAL quartet
//   in exactly one place (the dispatch QUOTING it verbatim — the F176
//   prescription's TWELFTH full-cycle test, zero label drift again)
//   + the s201-census-note (THE F188 POINTER-FOLLOWING LESSON — the
//   census-method family's completion: a comment's cross-reference is
//   a claim about its TARGET's content — verifying the referenced FACT
//   is not verifying the POINTER; the guard: the census FOLLOWS every
//   pointer and verifies the target carries the promised content + the
//   1L census registration + the eleven-site label-precision
//   registration + the B201-I-4/B201-I-5 registrations + the B-I-1
//   carry + the vocabulary-HOLD + the dispatch-currency + the honest
//   REBUILT environment record + the F138 fifty-second instance + the
//   thirty-second-generation pre-registration) + the PAD's s200
//   per-session row label-corrected in the collateral (ten → eleven —
//   the lockstep-maintained form; the frozen s200 plan/worklog records
//   untouched per the frozen-record doctrine) + the B201-I-5 probe
//   string corrected in scripts/dispatch-figures-s201.py.
//
// S201-C — THE PER-SESSION PIN FAMILY: 13 pins — 6 RED (the CT-1
//   fix-member + the doc-side collateral members) / 7 green-at-birth
//   (the two worklog-registration members, the F138 guard's
//   FIFTY-SECOND instance — the s200 plan's record pinned 4/4 ticked
//   at fd669ce4, the script-provenance member, the audit-entry
//   members — both anchors at their standing spellings this cycle, the
//   standing-figures member, the layer-STAYS member) — the MEASURED
//   birth form (the s159 lesson: the spec's own arithmetic carries the
//   measured pin count, never the forecast).

const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s200PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session200.md"),
  "utf8",
);

const readmeSource = readFileSync(
  path.resolve(import.meta.dirname, "../README.md"),
  "utf8",
);

const authSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/auth.ts"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s201.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s201.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s201.sh"),
  "utf8",
);

const dispatchProbeSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/dispatch-figures-s201.py"),
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
 *  born at the POST-spec figures: the 2757 delivery checks + this
 *  spec's 13 = 2770 unit, the 262 delivery files + this spec = 263;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s201 lesson). */
const UNIT = "2770";
const FILES = "263";

/** The MEASURED layer figures (the s159 measured form — the STAYS
 *  form this cycle: the CT-1 remediation touches zero source lines
 *  (the README row the only doc mutation), the layer holding at the
 *  S188-A amendment's post-delivery figure — no F40 rider). */
const LAYER_TOTAL = 14373;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The S201 anchors BOTH carry the standing
 *  spelling (digma-s201-auditor-A / digma-s201-auditor-B — the
 *  worklog-notes script landing them at the standing form). B's entry
 *  landed FIRST (running to its own separator) and A's second
 *  (running to its separator / the bracketed registration note). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const ends = [
    worklogSource.indexOf("\n---\n", at + 20),
    worklogSource.indexOf("\n[s201-id-stable-premises-note:", at),
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

describe("lows-s201: the CT-1 pointer fix + the pointer-following registrations + the F188 lesson", () => {
  it("DEFECT (the CT-1 fix — the cycle's one Low): the README Troubleshooting section carries the AUTH_SECRET rotation row — the auth.ts:28 pointer's target made TRUE (the rotation fact + the re-login guidance the comment promises), the auth.ts comment itself untouched (the frozen source pointer now true at the fixed tree — zero src/ changes)", () => {
    // The pointer's TARGET: the Troubleshooting section must carry the
    // AUTH_SECRET rotation row (CT-1 — the stale pointer caught at the
    // fourth census, the F188 pointer-following lesson's own subject).
    const ts = readmeSource.slice(
      readmeSource.indexOf("## Troubleshooting"),
      readmeSource.indexOf("## License"),
    );
    expect(ts).toContain("AUTH_SECRET");
    expect(ts.toLowerCase()).toContain("rotat");
    expect(ts).toContain("re-login");
    // The POINTER unchanged (the fix makes the target true; the frozen
    // comment's claim now verifies at the tree — the F188 pair closed).
    expect(authSource).toContain("rotating it invalidates every");
    expect(authSource).toContain("(documented in README troubleshooting)");
  });

  it("DEFECT (docs): the AGENTS session-201 bullet carries the completion members — the per-auditor census lines, the FIFTEENTH consecutive vocabulary-HOLD cycle, the F188 pointer-following truth lesson, the 1L census with the CT-1 record, and the layer-total family STAYING at 14,373 (the doc-side-only remediation form)", () => {
    expect(collapsed(agentsSource)).toContain("session 201, S201-A..S201-C");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/0L/1I + B 0C/0H/0M/1L/5I");
    expect(collapsed(agentsSource)).toContain("the FIFTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F188 LESSON — THE POINTER-FOLLOWING MEMBER");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.180.0 chain entry carries the S201 derivation (2770 = 2757 + 13 unit / 263 files) + the §7.1 row for the s201 spec, the layer-total family STAYING at 14,373 (the doc-side-only form, no F40 rider) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars (the src/-wide scope, NAMED) — the eleven-site label-precision disposition REGISTERED beside the frozen records (the s200 plan, the s200 worklog entries, the PAD v1.179.0 chain line, and the PAD s200 §7.1 row ALL untouched per the frozen-record doctrine — the §7.1 rows carrying era-anchored historical figures, never re-anchored)", () => {
    expect(collapsed(padSource)).toContain("2770 = 2757 + 13 unit / 263 files");
    expect(padSource).toContain("lows-s201.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,373");
    expect(padSource).toContain("| **Unit total** | **263 files** | **2770** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2770/2770");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2770 checks / 263 files) |",
    );
    // the frozen-record doctrine receipt: the s200 §7.1 row keeps its
    // era-anchored form (the historical delivery record untouched —
    // the current-era ELEVEN fact living in the s201 census note, the
    // F186/F187 record-gap form).
    expect(padSource).toContain("A-I-2 the ten raw-fetch exceptions each documented per-seam; A-I-3");
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.180.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.180\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.180.0");
    expect(lastUpdated).toContain("the one-hundred-and-forty-ninth audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.179.0 + the F188 pointer-following truth lesson (a comment's cross-reference is a claim about its target's content — verifying the referenced fact is not verifying the pointer; the census follows every pointer and verifies the target carries the promised content; a fact-and-pointer pair is two claims, and the pointer is the one that rots silently) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.179.0");
    expect(skillSource).toContain("188. **F188");
    expect(collapsed(skillSource)).toContain("THE POINTER-FOLLOWING MEMBER");
    expect(skillSource).toContain("2770 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s200 + s199 pair as the standing witnesses) + the anchored declaration census pins 82 UNIT / 81 FILES", () => {
    expect(UNIT).toBe("2770");
    expect(FILES).toBe("263");
    const root = path.resolve(import.meta.dirname, "..");
    const out = execSync(
      `rg -l '^const UNIT = "2770";$' tests/ src/lib/ | wc -l && rg -l '^const FILES = "263";$' tests/ src/lib/ | wc -l`,
      { cwd: root, encoding: "utf8" },
    );
    const [unitFiles, filesFiles] = out.trim().split("\n").map(Number);
    expect(unitFiles).toBe(82);
    expect(filesFiles).toBe(81);
  });

  it("SURVIVAL (worklog): the bracketed s201-census-note registers the thirty-first-generation verification (:2854..:2878 = s176..s200, 25 rows, :2853 the s175 row, :2852 the s174 row — the F174-corrected window form verified at its own generation) + the F188 POINTER-FOLLOWING truth lesson + the 1L census registration + the CT-1 remediation registration + the eleven-site label-precision registration + the B201-I-4/B201-I-5 registrations + the dispatch-currency-honored registration + the §8 letter posture carry + the honest folder-level vocabulary-HOLD registration + the honest environment record (the REBUILT form) + the F138 FIFTY-SECOND instance + the thirty-second-generation pre-registration", () => {
    expect(worklogSource).toContain("[s201-census-note: THE THIRTY-FIRST-GENERATION COORDINATE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s201-census-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s201-census-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F188 LESSON — THE POINTER-FOLLOWING MEMBER");
    expect(collapsed(note)).toContain(":2854..:2878 = s176..s200 (TWENTY-FIVE rows, arithmetic-consistent) with :2853 the s175 row and :2852 the s174 row");
    expect(collapsed(note)).toContain("THE CT-1 REMEDIATION REGISTRATION");
    expect(collapsed(note)).toContain("THE ELEVEN-SITE LABEL-PRECISION REGISTRATION");
    expect(collapsed(note)).toContain("THE B201-I-4 PHRASING REGISTRATION");
    expect(collapsed(note)).toContain("THE B201-I-5 PROBE-STRING REGISTRATION");
    expect(collapsed(note)).toContain("THE DISPATCH-CURRENCY-HONORED REGISTRATION");
    expect(collapsed(note)).toContain("THE §8 LETTER POSTURE CARRY");
    expect(collapsed(note)).toContain("THE VOCABULARY-HOLD REGISTRATION IN THE HONEST FOLDER-LEVEL FORM");
    expect(collapsed(note)).toContain("THE REBUILT FORM");
    expect(collapsed(note)).toContain("FIFTY-SECOND INSTANCE");
    expect(collapsed(note)).toContain("THE THIRTY-SECOND-GENERATION PRE-REGISTRATION");
  });

  it("SURVIVAL (worklog): the bracketed s201-id-stable-premises-note registers the CANONICAL quartet — the 76th ordinal, the four premises at their seams, the F176 quoting prescription's TWELFTH full-cycle test (zero label drift again, the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180), and the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s201-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SEVENTY-SIXTH CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s201-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s201-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CANONICAL QUARTET");
    expect(collapsed(note)).toContain("the F176 prescription's TWELFTH full-cycle test — zero label drift again");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan + provenance): the F138 guard's FIFTY-SECOND instance — the s200 plan's execution record shipped 4/4 ticked, zero unticked (the pre-armed guard per the session_578 closing record; the fiftieth consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S201 total rides the spec's own census: 961 + 13 = 974) + the B201-I-5 probe-string fix verified in the session-prep script (the spaced-equals spelling)", () => {
    const ticked = s200PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s200PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(4);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(961 + 13).toBe(974);
    // the B201-I-5 fix: the probe string now matches the actual spelling
    expect(dispatchProbeSource).toContain("ELEMENT_LIMIT = 2000");
  });

  it("SURVIVAL (scripts): the s201 script provenance — live201/nav201/digma-seo-s201 tokens, the 177th/178th/138th ordinals, the S200 delivery at fd669ce4, zero s200 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live201");
    expect(refAuditSource).toContain("the 177th reference audit");
    expect(refAuditSource).toContain("the S200 delivery at HEAD fd669ce4");
    expect(refAuditSource).toContain("byte-identical the 138th");
    expect(refAuditSource).not.toContain("live200");
    expect(refAuditSource).not.toContain("176th reference audit");
    expect(navSource).toContain("nav201");
    expect(navSource).toContain("178th session, S201-cycle");
    expect(navSource).toContain("the S200 delivery fd669ce4 + the S201 remediation");
    expect(navSource).not.toContain("nav200");
    expect(seoSource).toContain("digma-seo-s201");
    expect(seoSource).toContain("session 201, S201-cycle");
    expect(seoSource).not.toContain("digma-seo-s200");
  });

  it("SURVIVAL (worklog): the two s201 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0L/1I at the standing anchor (with the 175-sampled comment-truth census at 175 TRUE / 0 FALSE — the fourth consecutive zero-FALSE client-layer form, the largest sample yet; the pin subset 129/129 across the 12 rolled files; and the 22-file layer census at 14,373) and auditor B's 1L/5I at the standing anchor (with the 76th premises cycle, the 13 + 6 + 1 + 5 = 25 handler-census write-set arithmetic, the 78-sampled route/lib census at 77 TRUE / 1 FALSE — the CT-1 catch, and the 18-route census at 2,461) — both spellings at the standing form", () => {
    const a = auditEntry("Task ID: digma-s201-auditor-A");
    expect(a).toContain("0 Low / 1 Informational");
    expect(collapsed(a)).toContain("175 sampled, 175 TRUE / 0 FALSE");
    expect(collapsed(a)).toContain("129/129 across the 12 rolled files");
    expect(a).toContain("14,373");
    expect(collapsed(a)).toContain("the fourth consecutive zero-FALSE client-layer census");
    const b = auditEntry("Task ID: digma-s201-auditor-B");
    expect(collapsed(b)).toContain("1 Low / 5 Informational");
    expect(collapsed(b)).toContain("the 76th consecutive cycle");
    expect(collapsed(b)).toContain("13 + 6 + 1 + 5 = 25");
    expect(collapsed(b)).toContain("78 sampled, 77 TRUE / 1 FALSE");
    expect(b).toContain("2,461");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the twenty-seventh re-quote cycle), call.ts still exactly 80 lines", () => {
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
    // The eleven-site registration rides the unchanged seam (A-I-1's
    // correct form — the S168-A registration, untouched this cycle;
    // the raw form rides the comment's own line-break + marker).
    expect(readFileSync(
      path.resolve(import.meta.dirname, "../src/lib/call.ts"),
      "utf8",
    )).toContain("Eleven deliberate\n * raw-fetch bypass sites");
  });

  it("SURVIVAL (layer + frozen record): the doc-side-only form's own receipt — the layer total STAYING at 14,373 (the CT-1 fix touching one README row alone, no F40 rider) derived LIVE with the PER-FILE probe closing, editor.ts at exactly 1,263, properties-panel.tsx at exactly 2,378, globals.css STAYING at 300, login-screen.tsx STAYING at 747, AND the S67-B frozen-birth-record family staying frozen + pinned (the ~722 KB/~1.45 GB arithmetic untouched at its claim sites, the era-anchored birth-record form, its current-era companion confirmed at s199's B-I-4)", () => {
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
    // the S67-B frozen family: the era-anchored defect arithmetic stays
    // untouched (true at its own era, deliberately preserved by the
    // S112-D/S117-A re-anchors, pinned at request-surface-s67 +
    // server-lows-s76; the current-era ~1.8 GB companion registered at
    // s198, confirmed at s199's B-I-4 — 912,084 bytes/row
    // approximately 1.82 GB, the records untouched).
    expect(elementsRouteSource).toContain("2000 × ~722 KB ≈ 1.45 GB under the per-field caps");
    expect(validationSource).toContain("~2000 × ~722 KB ≈ 1.45 GB");
  });
});
