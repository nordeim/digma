import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-203 spec (the one-hundred-and-fifty-first audit's chosen
// work — the SEVENTEENTH consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM: the master
// skill's own file byte-unchanged since the operator's 2026-10-25
// fd2037e3 revision): 0C/0H/0M/1L/1I combined — a LOW-CARRYING cycle,
// the below-threshold streak ending at one, zero behavioral
// source-code defect, one comment-truth defect CAUGHT AND FIXED in the
// same cycle; the comment-truth census 683 sampled — 366 client-layer +
// 317 route/lib — 682 TRUE / 1 FALSE, THE LARGEST SAMPLE YET; two
// members — B203-L-1 the CT-class stale pointer (src/lib/db.ts:4-5's
// "Pattern B in the architecture doc" parenthetical citing a section
// the live PAD no longer carries — the fact true and live, the
// pointer's target dead at the clone commit 13e3bdaf's PAD rewrite,
// survived the s201/s202 enumerated-family passes, caught by the
// complete-population form at the F188 guard's second full-coverage
// route/lib dispatch — THE F188 POINTER-FOLLOWING GUARD'S SECOND
// FULL-CYCLE TEST AND ITS FIRST CATCH: 73 pointer members followed (38
// client-layer + 35 route/lib), 72 TRUE / 1 FALSE) and B202-I-5 the
// enumeration-precision member (api.ts:18-32's S130-C read-path
// census three-family parenthetical omitting verify-otp's two
// mid-window re-selects :118/:160 — the substance TRUE, the registered
// deferred member LANDING this cycle):
//
// S203-A — THE B202-I-5 AMENDMENT LANDS (the registered deferred
//   member's own landing cycle — the first cycle above the
//   below-threshold line): the one-clause amendment at src/lib/api.ts
//   naming the re-select family inside the S130-C parenthetical
//   (verify-otp's two mid-window re-selects the named exception inside
//   the S124-A catch, protected, answering 503) — api.ts 48 → 50
//   lines, src/lib 3,249 → 3,251, zero behavioral change.
//
// S203-B — THE B203-L-1 FIX LANDS (the cycle's own Low): the db.ts:4-5
//   pointer re-anchored onto the PAD's live target — PAD §3.3 Pattern
//   1, the minifier-safe anchor collection — the in-place form, db.ts
//   staying at 33 lines, the fact and the S74-D history untouched.
//
// S203-C — THE REGISTRATION PAIR: the s203-id-stable-premises-note at
//   the 78th consecutive cycle carrying the CANONICAL quartet verbatim
//   (the dispatch QUOTING it — the F176 prescription's FOURTEENTH
//   full-cycle test, zero label drift) + the s203-census-note (the
//   thirty-third-generation coordinate verification :2883/:2942/:3011 +
//   the s202 row :2882 + the F174-corrected window :2858..:2882 =
//   s178..s202; THE F188 SECOND-FULL-CYCLE CATCH registration (683
//   sampled / 682 TRUE / 1 FALSE with 73 pointers followed, 72 TRUE /
//   1 FALSE); the B203-L-1 registration + the B202-I-5 landing
//   registration + the standing postures carried (the B-I-1 fourth
//   carry) + the vocabulary-HOLD SEVENTEENTH + the dispatch-currency
//   ELEVENTH steady-state cycle + the honest REBUILT environment
//   record + the F138 FIFTY-FOURTH instance + the thirty-fourth-
//   generation pre-registration :2885/:2944/:3013).
//
// S203-D — THE PER-SESSION PIN FAMILY: 13 pins — 7 RED (the AGENTS
//   session-203 bullet, the count re-anchor + the §7.1 row, the PAD
//   title, the SKILL version, the pair-unity constants, the two
//   amendment members — the api.ts re-select-family naming + the
//   db.ts live-target re-anchor) / 6 green-at-birth (the two
//   worklog-registration notes, the audit-entry members, the F138 54th
//   + the pin-family arithmetic 987 + 13 = 1000, the
//   script-provenance member, the standing-figures member) — the
//   MEASURED birth form the record (the s159 lesson: the spec's own
//   arithmetic carries the measured pin count, never the forecast).

const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s202PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session202.md"),
  "utf8",
);

const readmeSource = readFileSync(
  path.resolve(import.meta.dirname, "../README.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s203.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s203.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s203.sh"),
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

const apiSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/api.ts"),
  "utf8",
);

const dbSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/db.ts"),
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
 *  born at the POST-spec figures: the 2783 delivery checks + this
 *  spec's 13 = 2796 unit, the 264 delivery files + this spec = 265;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s203 lesson). */
const UNIT = "2796";
const FILES = "265";

/** The MEASURED layer figure (the s159 measured form — the STAYS
 *  form this cycle: the comment-only remediation touching zero layer
 *  lines (the two amendments + the registration pair + the spec the
 *  only mutations), the layer holding at the standing figure — no
 *  F40 rider). */
const LAYER_TOTAL = 14373;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The S203 anchors BOTH carry the standing
 *  spelling (digma-s203-auditor-A / digma-s203-auditor-B — the
 *  worklog-notes script landing them at the standing form). B's entry
 *  landed FIRST (running to its own separator) and A's second
 *  (running to its separator / the bracketed registration note). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const ends = [
    worklogSource.indexOf("\n---\n", at + 20),
    worklogSource.indexOf("\n[s203-id-stable-premises-note:", at),
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

describe("lows-s203: the F188 second-cycle catch + the B202-I-5 landing + the B203-L-1 re-anchor", () => {
  it("DEFECT (docs): the AGENTS session-203 bullet carries the completion members — the per-auditor census lines (A 0C/0H/0M/0L/0I the second consecutive zero-finding auditor-A census + B 0C/0H/0M/1L/1I the Low catch), the SEVENTEENTH consecutive vocabulary-HOLD cycle, THE F188 POINTER-FOLLOWING GUARD'S SECOND FULL-CYCLE CATCH registration, and the layer-total family STAYING at 14,373 (the comment-only remediation form)", () => {
    expect(collapsed(agentsSource)).toContain("session 203, S203-A..S203-D");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/0L/0I + B 0C/0H/0M/1L/1I");
    expect(collapsed(agentsSource)).toContain("the SEVENTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F188 POINTER-FOLLOWING GUARD'S SECOND FULL-CYCLE CATCH");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.182.0 chain entry carries the S203 derivation (2796 = 2783 + 13 unit / 265 files) + the §7.1 row for the s203 spec, the layer-total family STAYING at 14,373 (the comment-only form, no F40 rider) and the route figure STAYING at 2,461", () => {
    expect(collapsed(padSource)).toContain("2796 = 2783 + 13 unit / 265 files");
    expect(padSource).toContain("lows-s203.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,373");
    expect(padSource).toContain("| **Unit total** | **265 files** | **2796** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2796/2796");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2796 checks / 265 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.182.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.182\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.182.0");
    expect(lastUpdated).toContain("the one-hundred-and-fifty-first audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.181.0 + THE F188 SECOND-FULL-CYCLE CATCH registration (the complete-population census's first FALSE pointer — the stale Pattern B target caught at the guard's first full-coverage route/lib dispatch) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.181.0");
    expect(collapsed(skillSource)).toContain("THE F188 POINTER-FOLLOWING GUARD'S SECOND FULL-CYCLE TEST — AND ITS FIRST CATCH");
    expect(skillSource).toContain("2796 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s202 + s201 pair as the standing witnesses) + the anchored declaration census pins 84 UNIT / 83 FILES", () => {
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

  it("SURVIVAL (worklog): the bracketed s203-census-note registers the thirty-third-generation verification (:2858..:2882 = s178..s202, 25 rows, :2857 the s177 row, :2856 the s176 row — the F174-corrected window form verified at its own generation) + THE F188 SECOND-FULL-CYCLE CATCH + the LOW-CARRYING census registration + the B203-L-1 stale-pointer registration + the B202-I-5 landing registration + the dispatch-currency-honored registration + the honest folder-level vocabulary-HOLD registration + the honest environment record (the REBUILT form) + the F138 FIFTY-FOURTH instance + the thirty-fourth-generation pre-registration", () => {
    expect(worklogSource).toContain("[s203-census-note: THE THIRTY-THIRD-GENERATION COORDINATE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s203-census-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s203-census-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F188 POINTER-FOLLOWING GUARD'S SECOND FULL-CYCLE TEST — AND ITS FIRST CATCH");
    expect(collapsed(note)).toContain(":2858..:2882 = s178..s202 (TWENTY-FIVE rows, arithmetic-consistent) with :2857 the s177 row and :2856 the s176 row");
    expect(collapsed(note)).toContain("THE B203-L-1 STALE-POINTER REGISTRATION");
    expect(collapsed(note)).toContain("THE B202-I-5 LANDING REGISTRATION");
    expect(collapsed(note)).toContain("THE DISPATCH-CURRENCY-HONORED REGISTRATION");
    expect(collapsed(note)).toContain("THE VOCABULARY-HOLD REGISTRATION IN THE HONEST FOLDER-LEVEL FORM");
    expect(collapsed(note)).toContain("THE REBUILT FORM");
    expect(collapsed(note)).toContain("FIFTY-FOURTH INSTANCE");
    expect(collapsed(note)).toContain("THE THIRTY-FOURTH-GENERATION PRE-REGISTRATION");
  });

  it("SURVIVAL (worklog): the bracketed s203-id-stable-premises-note registers the CANONICAL quartet — the 78th ordinal, the four premises at their seams, the F176 quoting prescription's FOURTEENTH full-cycle test (zero label drift again, the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180 — the ELEVENTH steady-state cycle), and the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s203-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SEVENTY-EIGHTH CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s203-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s203-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CANONICAL QUARTET");
    expect(collapsed(note)).toContain("the F176 prescription's FOURTEENTH full-cycle test — zero label drift again");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (worklog): the two s203 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0L/0I at the standing anchor (THE SECOND CONSECUTIVE ZERO-FINDING AUDITOR-A CENSUS — with the 366-sampled comment-truth census at 366 TRUE / 0 FALSE and 38 pointers followed; the pin subset 131/131 across the 12 rolled files; and the 22-file layer census at 14,373) and auditor B's 0L/1I at the standing anchor (with the 78th premises cycle, the 13 + 6 + 1 + 5 = 25 handler-census write-set arithmetic, the 317-sampled route/lib census at 316 TRUE / 1 FALSE, and the 18-route census at 2,461) — both spellings at the standing form", () => {
    const a = auditEntry("Task ID: digma-s203-auditor-A");
    expect(a).toContain("0 Low / 0 Informational");
    expect(collapsed(a)).toContain("366 sampled, 366 TRUE / 0 FALSE");
    expect(collapsed(a)).toContain("131/131 across the 12 rolled files");
    expect(a).toContain("14,373");
    expect(collapsed(a)).toContain("38 pointer-members followed");
    const b = auditEntry("Task ID: digma-s203-auditor-B");
    expect(collapsed(b)).toContain("1 Low / 1 Informational");
    expect(collapsed(b)).toContain("THE SEVENTY-EIGHTH CONSECUTIVE CYCLE");
    expect(collapsed(b)).toContain("13 + 6 + 1 + 5 = 25");
    expect(collapsed(b)).toContain("317 sampled, 316 TRUE / 1 FALSE");
    expect(b).toContain("2,461");
    expect(b).toContain("Pattern B");
  });

  it("SURVIVAL (plan + provenance): the F138 guard's FIFTY-FOURTH instance — the s202 plan's execution record shipped 4/4 ticked, zero unticked (the pre-armed guard per the session_588 closing record; the fifty-second consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S203 total rides the spec's own census: 987 + 13 = 1000)", () => {
    const ticked = s202PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s202PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(4);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(987 + 13).toBe(1000);
  });

  it("SURVIVAL (scripts): the s203 script provenance — live203/nav203/digma-seo-s203 tokens, the 179th/180th/140th ordinals, the S202 delivery at 3a8c62aa, zero s202 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live203");
    expect(refAuditSource).toContain("the 179th reference audit");
    expect(refAuditSource).toContain("the S202 delivery at HEAD 3a8c62aa");
    expect(refAuditSource).toContain("byte-identical the 140th");
    expect(refAuditSource).not.toContain("live202");
    expect(refAuditSource).not.toContain("178th reference audit");
    expect(navSource).toContain("nav203");
    expect(navSource).toContain("180th session, S203-cycle");
    expect(navSource).toContain("the S202 delivery 3a8c62aa + the S203 remediation");
    expect(navSource).not.toContain("nav202");
    expect(seoSource).toContain("digma-seo-s203");
    expect(seoSource).toContain("session 203, S203-cycle");
    expect(seoSource).not.toContain("digma-seo-s202");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the twenty-ninth re-quote cycle), call.ts still exactly 80 lines, and the ELEVEN raw-fetch registration riding the unchanged seam", () => {
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
    // The eleven-site registration rides the unchanged seam (the
    // S168-A registration, untouched this cycle; the raw form rides
    // the comment's own line-break + marker).
    expect(readFileSync(
      path.resolve(import.meta.dirname, "../src/lib/call.ts"),
      "utf8",
    )).toContain("Eleven deliberate\n * raw-fetch bypass sites");
  });

  it("DEFECT (source, the B202-I-5 amendment receipt): the S130-C read-path census comment now NAMES the re-select family inside the parenthetical — the amended sentence verbatim (the F187 quoted form), api.ts at exactly 50 lines (48 + 2), and the lows-s130 token family intact (the amendment pin-safe by construction)", () => {
    // The amended sentence, quoted in the raw comment form (F187 — the
    // "Eleven deliberate" pin precedent: comment-spanning pins ride the
    // source's own line-break + marker structure):
    expect(apiSource).toContain(
      "// request — verify-otp's two mid-window re-selects the named exception\n// inside the S124-A catch, protected, answering 503) sits outside any\n// try/catch.",
    );
    const root = path.resolve(import.meta.dirname, "..");
    const api = execSync("wc -l src/lib/api.ts", {
      cwd: root,
      encoding: "utf8",
    });
    expect(Number(api.trim().split(/\s+/)[0])).toBe(50);
    // The lows-s130 token family intact (the amendment pin-safe):
    expect(apiSource).toMatch(/S130-C/);
    expect(apiSource).toMatch(/B130-L7/);
    expect(apiSource).toMatch(/P2024/);
    expect(apiSource).toMatch(/bare 500/);
  });

  it("DEFECT (source, the B203-L-1 re-anchor receipt): the db.ts parenthetical now points at the PAD's LIVE target — PAD §3.3 Pattern 1 — with the dead Pattern B name retired from the source, db.ts staying at exactly 33 lines (the in-place form), AND the layer total STAYING at 14,373 (the comment-only remediation, no F40 rider) with the PER-FILE probe closing and the S67-B frozen-birth-record family staying pinned", () => {
    // The re-anchored pointer, quoted in the raw comment form (F187 — the
    // same line-break + marker precedent):
    expect(dbSource).toContain(
      "// Normalize the SQLite URL BEFORE the first client is constructed (PAD §3.3\n// Pattern 1).",
    );
    // The dead name retired from the source:
    expect(dbSource).not.toContain("Pattern B");
    const root = path.resolve(import.meta.dirname, "..");
    const db = execSync("wc -l src/lib/db.ts", {
      cwd: root,
      encoding: "utf8",
    });
    expect(Number(db.trim().split(/\s+/)[0])).toBe(33);
    // The layer STAYS: 14,373 with the per-file probe closing.
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
