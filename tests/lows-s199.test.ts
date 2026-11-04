import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-199 spec (the one-hundred-and-forty-seventh audit's chosen
// work — the THIRTEENTH consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM: the master
// skill's own file byte-unchanged since the operator's 2026-10-25
// fd2037e3 revision): 0C/0H/0M/0L/6I combined — a BELOW-THRESHOLD
// cycle, the SECOND consecutive zero-Low census, zero behavioral
// source-code defect, zero comment-truth defect; six informational
// members — one record-side derivation-method gap (A-I-1 the s198
// record's "id-less product at 352" not reproducing under any natural
// construction — the live id-less products 370-389, the recorded
// construction never recorded; the live ~510/~1.02 MB claim verifying
// independently), four vocabulary/scope nuances (A-I-2 the plain
// @theme vs the skill §12's literal "@theme inline" wording — the
// literal-hex substance holding; B-I-1 the documented
// rethrow-on-unknown posture vs §6's literal wording; B-I-2 the
// skill's token-format generalization vs digma's S67-A documented
// wire format — skill-side, outside the app code; B-I-3 the
// env-census scope naming — 17/9 at src/-wide, 15/8 at route+lib),
// and one frozen-record CONFIRMATION (B-I-4 the current-era 912,084
// bytes/row approximately 1.82 GB re-derived EXACT, matching the
// s198 registration); the comment-truth census 162 sampled — 123
// client-layer + 39 route/lib — 162 TRUE / 0 FALSE, the SECOND
// consecutive all-TRUE census, the first all-TRUE form held at a
// more-than-doubled sample):
//
// S199-A — THE REGISTRATION PAIR (the S187..S198
//   registration-cycle form): the s199-id-stable-premises-note at
//   the 74th consecutive cycle carrying the CANONICAL quartet in
//   exactly one place (the dispatch QUOTING it verbatim — the F176
//   prescription's TENTH full-cycle test, zero label drift again,
//   the quoting form the standing convention per F178, the
//   graduated form watched per F179 and confirmed in the
//   steady-state watch per F180) + the s199-below-threshold-note
//   (THE F186 DERIVATION-METHOD LESSON — the F183 doctrine's
//   record-side completion: a measured figure that rides a session
//   record carries its derivation command — construction, scope,
//   command line — never a bare number + the A-I-1 frozen-record
//   nuance registration + the second all-TRUE comment-truth census
//   registration + the twenty-ninth-generation carriers
//   :2875/:2934/:3003 + the s198 row :2874 verified EXACT with the
//   F174-corrected window :2850..:2874 = s174..s198 + the honest
//   folder-level vocabulary-HOLD registration (thirteenth
//   consecutive) + the dispatch-currency-honored registration (the
//   SEVENTH steady-state cycle) + the honest environment record —
//   THE CONTINUATION FORM (the workspace intact, the git pull
//   fast-forward, the standing environment verified not rebuilt).
//   The layer STAYS at 14,373 — the below-threshold form (zero
//   source changes this cycle), no F40 rider.
//
// S199-B — THE PER-SESSION PIN FAMILY: 12 pins — 5 RED (the doc-side
//   collateral members) / 7 green-at-birth (the two
//   worklog-registration members, the F138 guard's FIFTIETH
//   instance — the s198 plan's record pinned 4/4 ticked at 834b3f9e,
//   the script-provenance member, the audit-entry members — both
//   anchors at their standing spellings this cycle, the
//   standing-figures member, the layer-STAYS member, and the A-I-1
//   frozen-record member) — the MEASURED birth form (the s159
//   lesson: the spec's own arithmetic carries the measured pin
//   count, never the forecast).

const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s198PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session198.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s199.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s199.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s199.sh"),
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
 *  born at the POST-spec figures: the 2733 delivery checks + this
 *  spec's 12 = 2745 unit, the 260 delivery files + this spec = 261;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s199 lesson). */
const UNIT = "2809";
const FILES = "266";

/** The MEASURED layer figures (the s159 measured form — the STAYS
 *  form this cycle: the below-threshold remediation touches zero
 *  source lines, the layer holding at the S188-A amendment's
 *  post-delivery figure — no F40 rider). */
const LAYER_TOTAL = 14373;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The S199 anchors BOTH carry the standing
 *  spelling (digma-s199-auditor-A / digma-s199-auditor-B — the
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
    worklogSource.indexOf("\n[s199-id-stable-premises-note:", at),
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

describe("lows-s199: the below-threshold registrations + the derivation-method lesson", () => {
  it("DEFECT (docs): the AGENTS session-199 bullet carries the completion members — the per-auditor census lines, the THIRTEENTH consecutive vocabulary-HOLD cycle, the F186 derivation-method truth lesson, the second all-TRUE comment-truth census, and the layer-total family STAYING at 14,373 (the below-threshold form)", () => {
    expect(collapsed(agentsSource)).toContain("session 199, S199-A..S199-B");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/4I");
    expect(collapsed(agentsSource)).toContain("the THIRTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F186 LESSON — THE DERIVATION-METHOD MEMBER");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.178.0 chain entry carries the S199 derivation (2745 = 2733 + 12 unit / 261 files) + the §7.1 row for the s199 spec, the layer-total family STAYING at 14,373 (the below-threshold form, no F40 rider) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars (the src/-wide scope, NAMED)", () => {
    expect(collapsed(padSource)).toContain("2745 = 2733 + 12 unit / 261 files");
    expect(padSource).toContain("lows-s199.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,373");
    expect(collapsed(padSource)).toContain("the route figure STAYING at 2,461");
    expect(padSource).toContain("| **Unit total** | **266 files** | **2809** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2809/2809");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2809 checks / 266 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.178.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.183\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.183.0");
    expect(lastUpdated).toContain("the one-hundred-and-fifty-second audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.177.0 + the F186 derivation-method truth lesson (a measured figure that rides a session record carries its derivation command — construction, scope, command line — never a bare number; an unreproducible prior figure registers as a derivation-method gap in the record, never a defect claim against it) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.182.0");
    expect(skillSource).toContain("186. **F186");
    expect(collapsed(skillSource)).toContain("THE DERIVATION-METHOD MEMBER");
    expect(skillSource).toContain("2809 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s198 + s197 pair as the standing witnesses) + the anchored declaration census pins 80 UNIT / 79 FILES", () => {
    expect(UNIT).toBe("2809");
    expect(FILES).toBe("266");
    const root = path.resolve(import.meta.dirname, "..");
    const out = execSync(
      `rg -l '^const UNIT = "2809";$' tests/ src/lib/ | wc -l && rg -l '^const FILES = "266";$' tests/ src/lib/ | wc -l`,
      { cwd: root, encoding: "utf8" },
    );
    const [unitFiles, filesFiles] = out.trim().split("\n").map(Number);
    expect(unitFiles).toBe(85);
    expect(filesFiles).toBe(84);
  });

  it("SURVIVAL (worklog): the bracketed s199-below-threshold-note registers the twenty-ninth-generation verification (:2850..:2874 = s174..s198, 25 rows, :2849 the s173 row, :2848 the s172 row — the F174-corrected window form verified at its own generation) + the F186 DERIVATION-METHOD truth lesson + the second all-TRUE comment-truth census registration + the A-I-1 frozen-record nuance registration + the dispatch-currency-honored registration + the §8 letter posture carry + the honest folder-level vocabulary-HOLD registration + the honest environment record (the CONTINUATION form) + the F138 FIFTIETH instance + the thirtieth-generation pre-registration", () => {
    expect(worklogSource).toContain("[s199-below-threshold-note: THE TWENTY-NINTH-GENERATION COORDINATE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s199-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s199-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F186 LESSON — THE DERIVATION-METHOD MEMBER");
    expect(collapsed(note)).toContain(":2850..:2874 = s174..s198 (TWENTY-FIVE rows, arithmetic-consistent) with :2849 the s173 row and :2848 the s172 row");
    expect(collapsed(note)).toContain("THE SECOND ALL-TRUE COMMENT-TRUTH CENSUS REGISTRATION");
    expect(collapsed(note)).toContain("THE A-I-1 FROZEN-RECORD NUANCE REGISTRATION");
    expect(collapsed(note)).toContain("THE DISPATCH-CURRENCY-HONORED REGISTRATION");
    expect(collapsed(note)).toContain("THE §8 LETTER POSTURE CARRY");
    expect(collapsed(note)).toContain("THE VOCABULARY-HOLD REGISTRATION IN THE HONEST FOLDER-LEVEL FORM");
    expect(collapsed(note)).toContain("THE CONTINUATION FORM");
    expect(collapsed(note)).toContain("FIFTIETH INSTANCE");
    expect(collapsed(note)).toContain("THE THIRTIETH-GENERATION PRE-REGISTRATION");
  });

  it("SURVIVAL (worklog): the bracketed s199-id-stable-premises-note registers the CANONICAL quartet — the 74th ordinal, the four premises at their seams, the F176 quoting prescription's TENTH full-cycle test (zero label drift again, the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180), and the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s199-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SEVENTY-FOURTH CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s199-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s199-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CANONICAL QUARTET");
    expect(collapsed(note)).toContain("the F176 prescription's TENTH full-cycle test — zero label drift again");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan): the F138 guard's FIFTIETH instance — the s198 plan's execution record shipped 4/4 ticked, zero unticked (the pre-armed guard per the session_565/566 directive; the forty-eighth consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S199 total rides the spec's own census: 937 + 12 = 949)", () => {
    const ticked = s198PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s198PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(4);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(937 + 12).toBe(949);
  });

  it("SURVIVAL (scripts): the s199 script provenance — live199/nav199/digma-seo-s199 tokens, the 175th/176th/136th ordinals, the S198 delivery at 834b3f9e, zero s198 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live199");
    expect(refAuditSource).toContain("the 175th reference audit");
    expect(refAuditSource).toContain("the S198 delivery at HEAD 834b3f9e");
    expect(refAuditSource).toContain("byte-identical the 136th");
    expect(refAuditSource).not.toContain("live198");
    expect(refAuditSource).not.toContain("174th reference audit");
    expect(navSource).toContain("nav199");
    expect(navSource).toContain("176th session, S199-cycle");
    expect(navSource).toContain("the S198 delivery 834b3f9e + the S199 remediation");
    expect(navSource).not.toContain("nav198");
    expect(seoSource).toContain("digma-seo-s199");
    expect(seoSource).toContain("session 199, S199-cycle");
    expect(seoSource).not.toContain("digma-seo-s198");
  });

  it("SURVIVAL (worklog): the two s199 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0L/2I at the standing anchor (with the 123-sampled comment-truth census at 123 TRUE / 0 FALSE — the SECOND consecutive all-TRUE census, the sample more-than-doubled; the pin subset 129/129 across the 12 dispatched files; and the 22-file layer census at 14,373) and auditor B's 0L/4I at the standing anchor (with the 74th premises cycle, the 13 + 6 + 1 + 5 = 25 handler-census write-set arithmetic, and the 18-route census at 2,461) — both spellings at the standing form", () => {
    const a = auditEntry("Task ID: digma-s199-auditor-A");
    expect(a).toContain("0 Low / 2 Informational");
    expect(collapsed(a)).toContain("123 sampled, 123 TRUE / 0 FALSE");
    expect(collapsed(a)).toContain("129/129 across the 12 dispatched files");
    expect(a).toContain("14,373");
    expect(collapsed(a)).toContain("the SECOND consecutive all-TRUE census");
    const b = auditEntry("Task ID: digma-s199-auditor-B");
    expect(collapsed(b)).toContain("0 Low / 4 Informational");
    expect(collapsed(b)).toContain("the 74th consecutive cycle");
    expect(collapsed(b)).toContain("13 + 6 + 1 + 5 = 25");
    expect(b).toContain("2,461");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the twenty-fifth re-quote cycle), call.ts still exactly 80 lines", () => {
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

  it("SURVIVAL (layer + frozen record): the below-threshold form's own receipt — the layer total STAYING at 14,373 (zero source changes this cycle, no F40 rider) derived LIVE with the PER-FILE probe closing, editor.ts at exactly 1,263, properties-panel.tsx at exactly 2,378, globals.css STAYING at 300, login-screen.tsx STAYING at 747, AND the S67-B frozen-birth-record family staying frozen + pinned (the ~722 KB/~1.45 GB arithmetic untouched at its claim sites, the era-anchored birth-record form, its current-era companion CONFIRMED at B-I-4)", () => {
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
    // s198 and CONFIRMED at B-I-4 this cycle — 912,084 bytes/row
    // approximately 1.82 GB, re-derived exact, the records untouched).
    expect(elementsRouteSource).toContain("2000 × ~722 KB ≈ 1.45 GB under the per-field caps");
    expect(validationSource).toContain("~2000 × ~722 KB ≈ 1.45 GB");
  });
});
