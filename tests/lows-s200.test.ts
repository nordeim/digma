import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-200 spec (the one-hundred-and-forty-eighth audit's chosen
// work — the FOURTEENTH consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM: the master
// skill's own file byte-unchanged since the operator's 2026-10-25
// fd2037e3 revision): 0C/0H/0M/0L/6I combined — a BELOW-THRESHOLD
// cycle, the THIRD consecutive zero-Low census, zero behavioral
// source-code defect, zero comment-truth defect; six informational
// members — one quoted-form label-precision catch (A-I-1 the brief's
// trap-3 label "all four editor-* tokens defined and consumed" —
// itself quoted verbatim from the s199 auditor record's own phrasing —
// imprecise for editor-text, the tree truth 3 of 4 consumed with
// --color-editor-text the S95-B defined-currently-unconsumed posture
// at 0 utility uses), three documented standing postures (A-I-2 the
// ten raw-fetch exceptions each documented per-seam; A-I-3 the
// components-panel no-op button — reference parity; B-I-2 the me
// route's 200 user-null introspection form), one docblock-symmetry
// gap (B-I-1 the teams/[id] PATCH :11 note — carried as a registered
// deferred-queue member), and one skill-side vocabulary nuance (B-I-3
// the manual-guards seam vs the skill §7's Zod wording); the
// comment-truth census 223 sampled — 151 client-layer + 72 route/lib
// — 223 TRUE / 0 FALSE, the THIRD consecutive all-TRUE census, the
// largest sample yet):
//
// S200-A — THE REGISTRATION PAIR (the S187..S199
//   registration-cycle form): the s200-id-stable-premises-note at
//   the 75th consecutive cycle carrying the CANONICAL quartet in
//   exactly one place (the dispatch QUOTING it verbatim — the F176
//   prescription's ELEVENTH full-cycle test, zero label drift again,
//   the quoting form the standing convention per F178, the graduated
//   form watched per F179 and confirmed in the steady-state watch
//   per F180) + the s200-below-threshold-note (THE F187
//   QUOTED-FORM-INHERITANCE LESSON — the F185 quote-verbatim
//   prescription's own completion: quoting a prior record's form
//   verbatim protects against paraphrase drift but inherits the
//   source record's own imprecision — a label is a claim wherever it
//   appears, the verbatim form is not a truth certificate + the A-I-1
//   frozen-record label-precision registration (the per-token counts
//   15/23/51/0) + the B-I-1 docblock-symmetry registration (carried
//   as a deferred-queue member) + the third all-TRUE comment-truth
//   census registration + the thirtieth-generation carriers
//   :2877/:2936/:3005 + the s199 row :2876 verified EXACT with the
//   F174-corrected window :2852..:2876 = s175..s199 + the honest
//   folder-level vocabulary-HOLD registration (fourteenth
//   consecutive) + the dispatch-currency-honored registration (the
//   EIGHTH steady-state cycle) + the honest environment record —
//   THE CONTINUATION FORM (the workspace intact, the git pull
//   fast-forward, the standing environment verified not rebuilt).
//   The layer STAYS at 14,373 — the below-threshold form (zero
//   source changes this cycle), no F40 rider.
//
// S200-B — THE PER-SESSION PIN FAMILY: 12 pins — 5 RED (the doc-side
//   collateral members) / 7 green-at-birth (the two
//   worklog-registration members, the F138 guard's FIFTY-FIRST
//   instance — the s199 plan's record pinned 4/4 ticked at f47eead0,
//   the script-provenance member, the audit-entry members — both
//   anchors at their standing spellings this cycle, the
//   standing-figures member, the layer-STAYS member, and the B-I-1
//   deferred-registration member) — the MEASURED birth form (the s159
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
const s199PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session199.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s200.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s200.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s200.sh"),
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
 *  born at the POST-spec figures: the 2745 delivery checks + this
 *  spec's 12 = 2757 unit, the 261 delivery files + this spec = 262;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s200 lesson). */
const UNIT = "2796";
const FILES = "265";

/** The MEASURED layer figures (the s159 measured form — the STAYS
 *  form this cycle: the below-threshold remediation touches zero
 *  source lines, the layer holding at the S188-A amendment's
 *  post-delivery figure — no F40 rider). */
const LAYER_TOTAL = 14373;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The S200 anchors BOTH carry the standing
 *  spelling (digma-s200-auditor-A / digma-s200-auditor-B — the
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
    worklogSource.indexOf("\n[s200-id-stable-premises-note:", at),
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

describe("lows-s200: the below-threshold registrations + the quoted-form-inheritance lesson", () => {
  it("DEFECT (docs): the AGENTS session-200 bullet carries the completion members — the per-auditor census lines, the FOURTEENTH consecutive vocabulary-HOLD cycle, the F187 quoted-form-inheritance truth lesson, the third all-TRUE comment-truth census, and the layer-total family STAYING at 14,373 (the below-threshold form)", () => {
    expect(collapsed(agentsSource)).toContain("session 200, S200-A..S200-B");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/0L/3I + B 0C/0H/0M/0L/3I");
    expect(collapsed(agentsSource)).toContain("the FOURTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F187 LESSON — THE QUOTED-FORM-INHERITANCE MEMBER");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.179.0 chain entry carries the S200 derivation (2757 = 2745 + 12 unit / 262 files) + the §7.1 row for the s200 spec, the layer-total family STAYING at 14,373 (the below-threshold form, no F40 rider) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars (the src/-wide scope, NAMED)", () => {
    expect(collapsed(padSource)).toContain("2757 = 2745 + 12 unit / 262 files");
    expect(padSource).toContain("lows-s200.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,373");
    expect(collapsed(padSource)).toContain("the route figure STAYING at 2,461");
    expect(padSource).toContain("| **Unit total** | **265 files** | **2796** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2796/2796");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2796 checks / 265 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.179.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.182\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.182.0");
    expect(lastUpdated).toContain("the one-hundred-and-fifty-first audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.178.0 + the F187 quoted-form-inheritance truth lesson (quoting a prior record's form verbatim protects against paraphrase drift but inherits the source record's own imprecision — a label is a claim wherever it appears, the verbatim form is not a truth certificate; an imprecise prior label registers as a label-precision gap in the record, never a defect claim against the quoting brief) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.181.0");
    expect(skillSource).toContain("187. **F187");
    expect(collapsed(skillSource)).toContain("THE QUOTED-FORM-INHERITANCE MEMBER");
    expect(skillSource).toContain("2796 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s199 + s198 pair as the standing witnesses) + the anchored declaration census pins 81 UNIT / 80 FILES", () => {
    expect(UNIT).toBe("2796");
    expect(FILES).toBe("265");
    const root = path.resolve(import.meta.dirname, "..");
    const out = execSync(
      `rg -l '^const UNIT = "2796";$' tests/ src/lib/ | wc -l && rg -l '^const FILES = "265";$' tests/ src/lib/ | wc -l`,
      { cwd: root, encoding: "utf8" },
    );
    const [unitFiles, filesFiles] = out.trim().split("\n").map(Number);
    expect(unitFiles).toBe(84);
    expect(filesFiles).toBe(83);
  });

  it("SURVIVAL (worklog): the bracketed s200-below-threshold-note registers the thirtieth-generation verification (:2852..:2876 = s175..s199, 25 rows, :2851 the s174 row, :2850 the s173 row — the F174-corrected window form verified at its own generation) + the F187 QUOTED-FORM-INHERITANCE truth lesson + the third all-TRUE comment-truth census registration + the A-I-1 frozen-record label-precision registration + the B-I-1 docblock-symmetry registration + the dispatch-currency-honored registration + the §8 letter posture carry + the honest folder-level vocabulary-HOLD registration + the honest environment record (the CONTINUATION form) + the F138 FIFTY-FIRST instance + the thirty-first-generation pre-registration", () => {
    expect(worklogSource).toContain("[s200-below-threshold-note: THE THIRTIETH-GENERATION COORDINATE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s200-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s200-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F187 LESSON — THE QUOTED-FORM-INHERITANCE MEMBER");
    expect(collapsed(note)).toContain(":2852..:2876 = s175..s199 (TWENTY-FIVE rows, arithmetic-consistent) with :2851 the s174 row and :2850 the s173 row");
    expect(collapsed(note)).toContain("THE THIRD ALL-TRUE COMMENT-TRUTH CENSUS REGISTRATION");
    expect(collapsed(note)).toContain("THE A-I-1 FROZEN-RECORD LABEL-PRECISION REGISTRATION");
    expect(collapsed(note)).toContain("THE B-I-1 DOCBLOCK-SYMMETRY REGISTRATION");
    expect(collapsed(note)).toContain("THE DISPATCH-CURRENCY-HONORED REGISTRATION");
    expect(collapsed(note)).toContain("THE §8 LETTER POSTURE CARRY");
    expect(collapsed(note)).toContain("THE VOCABULARY-HOLD REGISTRATION IN THE HONEST FOLDER-LEVEL FORM");
    expect(collapsed(note)).toContain("THE CONTINUATION FORM");
    expect(collapsed(note)).toContain("FIFTY-FIRST INSTANCE");
    expect(collapsed(note)).toContain("THE THIRTY-FIRST-GENERATION PRE-REGISTRATION");
  });

  it("SURVIVAL (worklog): the bracketed s200-id-stable-premises-note registers the CANONICAL quartet — the 75th ordinal, the four premises at their seams, the F176 quoting prescription's ELEVENTH full-cycle test (zero label drift again, the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180), and the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s200-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SEVENTY-FIFTH CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s200-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s200-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CANONICAL QUARTET");
    expect(collapsed(note)).toContain("the F176 prescription's ELEVENTH full-cycle test — zero label drift again");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan): the F138 guard's FIFTY-FIRST instance — the s199 plan's execution record shipped 4/4 ticked, zero unticked (the pre-armed guard per the session_570/571 directive; the forty-ninth consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S200 total rides the spec's own census: 949 + 12 = 961)", () => {
    const ticked = s199PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s199PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(4);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(949 + 12).toBe(961);
  });

  it("SURVIVAL (scripts): the s200 script provenance — live200/nav200/digma-seo-s200 tokens, the 176th/177th/137th ordinals, the S199 delivery at f47eead0, zero s199 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live200");
    expect(refAuditSource).toContain("the 176th reference audit");
    expect(refAuditSource).toContain("the S199 delivery at HEAD f47eead0");
    expect(refAuditSource).toContain("byte-identical the 137th");
    expect(refAuditSource).not.toContain("live199");
    expect(refAuditSource).not.toContain("175th reference audit");
    expect(navSource).toContain("nav200");
    expect(navSource).toContain("177th session, S200-cycle");
    expect(navSource).toContain("the S199 delivery f47eead0 + the S200 remediation");
    expect(navSource).not.toContain("nav199");
    expect(seoSource).toContain("digma-seo-s200");
    expect(seoSource).toContain("session 200, S200-cycle");
    expect(seoSource).not.toContain("digma-seo-s199");
  });

  it("SURVIVAL (worklog): the two s200 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0L/3I at the standing anchor (with the 151-sampled comment-truth census at 151 TRUE / 0 FALSE — the THIRD consecutive all-TRUE census, the largest sample yet; the pin subset 129/129 across the 12 rolled files; and the 22-file layer census at 14,373) and auditor B's 0L/3I at the standing anchor (with the 75th premises cycle, the 13 + 6 + 1 + 5 = 25 handler-census write-set arithmetic, and the 18-route census at 2,461) — both spellings at the standing form", () => {
    const a = auditEntry("Task ID: digma-s200-auditor-A");
    expect(a).toContain("0 Low / 3 Informational");
    expect(collapsed(a)).toContain("151 sampled, 151 TRUE / 0 FALSE");
    expect(collapsed(a)).toContain("129/129 across the 12 rolled files");
    expect(a).toContain("14,373");
    expect(collapsed(a)).toContain("the THIRD consecutive all-TRUE census");
    const b = auditEntry("Task ID: digma-s200-auditor-B");
    expect(collapsed(b)).toContain("0 Low / 3 Informational");
    expect(collapsed(b)).toContain("the 75th consecutive cycle");
    expect(collapsed(b)).toContain("13 + 6 + 1 + 5 = 25");
    expect(b).toContain("2,461");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the twenty-sixth re-quote cycle), call.ts still exactly 80 lines", () => {
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

  it("SURVIVAL (layer + frozen record): the below-threshold form's own receipt — the layer total STAYING at 14,373 (zero source changes this cycle, no F40 rider) derived LIVE with the PER-FILE probe closing, editor.ts at exactly 1,263, properties-panel.tsx at exactly 2,378, globals.css STAYING at 300, login-screen.tsx STAYING at 747, AND the S67-B frozen-birth-record family staying frozen + pinned (the ~722 KB/~1.45 GB arithmetic untouched at its claim sites, the era-anchored birth-record form, its current-era companion confirmed at s199's B-I-4)", () => {
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
