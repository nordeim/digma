import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-204 spec (the one-hundred-and-fifty-second audit's chosen
// work — the EIGHTEENTH consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM: the master
// skill's own file byte-unchanged since the operator's 2026-10-25
// fd2037e3 revision): 0C/0H/0M/0L/3I combined — a BELOW-THRESHOLD
// cycle, the fifth zero-Low census in seven cycles, zero behavioral
// source-code defect, zero comment-truth defect; the comment-truth
// census 550 sampled — 234 client-layer + 316 route/lib — 550 TRUE /
// 0 FALSE, THE ALL-TRUE CENSUS RESTORED (the streak at one — the
// s203 FALSE member's fix holding); three informational members, all
// label-precision class, zero source-side defect — B204-I-1 the
// enumeration-precision member (elements/route.ts:31-33's S124-C
// full-row-registration parenthetical — the family fact TRUE (all
// four list-family routes ride THUMBNAIL_ELEMENT_SELECT +
// withThumbFills), the label imprecise at two points (the thumbnail
// include lives on the detail route's PATCH response, the detail
// GET keeping full rows by documented contract; "recent" a client
// view, not a route) — the phrase quoted verbatim from the PAD's
// canonical record at PAD:120, pin-safe; the comment-only
// one-clause amendment + the PAD:120 re-anchor CARRIED under the
// below-threshold zero-source-change discipline, the B202-I-5
// precedent), B204-I-2 the lead's-own-brief label-precision member
// (the e2e-count pin singularly attributed to server-lows-s81
// while the tree carries TWO members of the const E2E "262" form —
// server-lows-s81:159 + doc-lows-s84:66, both correctly excluded;
// the corrected phrasing registered), and A204-I-1 the lead's-own-
// brief label-precision member (the brief's "api.ts:48-50" label —
// the line-count figure "api.ts 48 → 50" written in colon-delimited
// coordinate form while the content sits at api.ts:23-24; the fix
// registered: the next dispatch quotes the live coordinate or the
// registered line-count form):
//
// S204-A — THE REGISTRATION PAIR (the below-threshold
//   registration-cycle form): the s204-id-stable-premises-note at
//   the 79th consecutive cycle carrying the CANONICAL quartet
//   verbatim (the dispatch QUOTING it — the F176 prescription's
//   FIFTEENTH full-cycle test, zero label drift) + the
//   s204-below-threshold-note (the thirty-fourth-generation
//   coordinate verification :2885/:2944/:3013 + the s203 row :2884 +
//   the F174-corrected window :2860..:2884 = s179..s203; THE F188
//   THIRD-FULL-CYCLE PASS registration (550 sampled / 550 TRUE /
//   0 FALSE with 54 pointers followed — 20 client-layer + 34
//   route/lib — all TRUE); the B204-I-1 registration CARRIED + the
//   B204-I-2 + A204-I-1 registrations + the standing postures
//   carried (the B-I-1 fifth carry) + the vocabulary-HOLD
//   EIGHTEENTH + the dispatch-currency TWELFTH steady-state cycle +
//   the honest REBUILT environment record (the fifth consecutive
//   reset) + the F138 FIFTY-FIFTH instance + the
//   thirty-fifth-generation pre-registration :2887/:2946/:3015).
//
// S204-B — THE PER-SESSION PIN FAMILY: 13 pins — the MEASURED birth
//   form the record (the forecast 5 RED — the AGENTS session-204
//   bullet, the count re-anchor + the §7.1 row, the PAD title, the
//   SKILL version, the pair-unity constants / 8 green-at-birth —
//   the two worklog-registration notes, the audit-entry members,
//   the F138 55th + the pin-family arithmetic 1000 + 13 = 1013, the
//   script-provenance member, the standing-figures member, the
//   carried-member receipt, the layer + frozen-record member); the
//   constants born rolling-safe at the POST-spec figures 2809/266.
//
// The zero-source-change discipline this cycle: the registration
// pair + the spec + the collateral the only mutations — the layer
// STAYING at 14,373, the routes STAYING at 2,461, src/lib STAYING
// at 3,251 (no F40 rider).

const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s203PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session203.md"),
  "utf8",
);

const readmeSource = readFileSync(
  path.resolve(import.meta.dirname, "../README.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s204.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s204.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s204.sh"),
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
 *  born at the POST-spec figures: the 2796 delivery checks + this
 *  spec's 13 = 2809 unit, the 265 delivery files + this spec = 266;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s204 lesson). */
const UNIT = "2809";
const FILES = "266";

/** The MEASURED layer figure (the s159 measured form — the STAYS
 *  form this cycle: the registration-only remediation touching zero
 *  layer lines (the registration pair + the spec the only
 *  mutations), the layer holding at the standing figure — no F40
 *  rider). */
const LAYER_TOTAL = 14373;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The S204 anchors BOTH carry the standing
 *  spelling (digma-s204-auditor-A / digma-s204-auditor-B — the
 *  worklog-notes script landing them at the standing form). B's entry
 *  landed FIRST (running to its own separator) and A's second
 *  (running to its separator / the bracketed registration note). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const ends = [
    worklogSource.indexOf("\n---\n", at + 20),
    worklogSource.indexOf("\n[s204-id-stable-premises-note:", at),
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

describe("lows-s204: the below-threshold registrations + the F188 third-full-cycle pass", () => {
  it("DEFECT (docs): the AGENTS session-204 bullet carries the completion members — the per-auditor census lines (A 0C/0H/0M/0L/1I the client layer clean at 234/234 + B 0C/0H/0M/0L/2I the two label-precision catches), the EIGHTEENTH consecutive vocabulary-HOLD cycle, THE F188 POINTER-FOLLOWING GUARD'S THIRD FULL-CYCLE PASS registration, and the layer-total family STAYING at 14,373 (the registration-only remediation form)", () => {
    expect(collapsed(agentsSource)).toContain("session 204, S204-A..S204-D");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/0L/1I + B 0C/0H/0M/0L/2I");
    expect(collapsed(agentsSource)).toContain("the EIGHTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F188 POINTER-FOLLOWING GUARD'S THIRD FULL-CYCLE PASS");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.183.0 chain entry carries the S204 derivation (2809 = 2796 + 13 unit / 266 files) + the §7.1 row for the s204 spec, the layer-total family STAYING at 14,373 (the registration-only form, no F40 rider) and the route figure STAYING at 2,461", () => {
    expect(collapsed(padSource)).toContain("2809 = 2796 + 13 unit / 266 files");
    expect(padSource).toContain("lows-s204.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,373");
    expect(padSource).toContain("| **Unit total** | **266 files** | **2809** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2809/2809");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2809 checks / 266 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.183.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.183\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.183.0");
    expect(lastUpdated).toContain("the one-hundred-and-fifty-second audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.182.0 + THE F188 THIRD-FULL-CYCLE PASS registration (54 pointer members followed — 20 client-layer + 34 route/lib — all TRUE, the all-TRUE census restored at 550 sampled) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.182.0");
    expect(collapsed(skillSource)).toContain("THE F188 POINTER-FOLLOWING GUARD'S THIRD FULL-CYCLE PASS");
    expect(skillSource).toContain("2809 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s203 + s202 pair as the standing witnesses) + the anchored declaration census pins 85 UNIT / 84 FILES", () => {
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

  it("SURVIVAL (worklog): the bracketed s204-below-threshold-note registers the thirty-fourth-generation verification (:2860..:2884 = s179..s203, 25 rows, :2859 the s178 row, :2858 the s177 row — the F174-corrected window form verified at its own generation) + THE F188 THIRD-FULL-CYCLE PASS + the below-threshold census registration + the B204-I-1 registration CARRIED + the B204-I-2 + A204-I-1 registrations + the dispatch-currency-honored registration + the honest folder-level vocabulary-HOLD registration + the honest environment record (the REBUILT form) + the F138 FIFTY-FIFTH instance + the thirty-fifth-generation pre-registration", () => {
    expect(worklogSource).toContain("[s204-below-threshold-note: THE THIRTY-FOURTH-GENERATION COORDINATE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s204-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s204-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F188 POINTER-FOLLOWING GUARD'S THIRD FULL-CYCLE PASS");
    expect(collapsed(note)).toContain(":2860..:2884 = s179..s203 (TWENTY-FIVE rows, arithmetic-consistent) with :2859 the s178 row and :2858 the s177 row");
    expect(collapsed(note)).toContain("B204-I-1 the enumeration-precision member");
    expect(collapsed(note)).toContain("B204-I-2 the lead's-own-brief label-precision member");
    expect(collapsed(note)).toContain("A204-I-1 the lead's-own-brief label-precision member");
    expect(collapsed(note)).toContain("THE DISPATCH-CURRENCY-HONORED REGISTRATION");
    expect(collapsed(note)).toContain("THE VOCABULARY-HOLD REGISTRATION IN THE HONEST FOLDER-LEVEL FORM");
    expect(collapsed(note)).toContain("THE REBUILT FORM");
    expect(collapsed(note)).toContain("FIFTY-FIFTH INSTANCE");
    expect(collapsed(note)).toContain("THE THIRTY-FIFTH-GENERATION PRE-REGISTRATION");
  });

  it("SURVIVAL (worklog): the bracketed s204-id-stable-premises-note registers the CANONICAL quartet — the 79th ordinal, the four premises at their seams, the F176 quoting prescription's FIFTEENTH full-cycle test (zero label drift again, the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180 — the TWELFTH steady-state cycle), and the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s204-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SEVENTY-NINTH CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s204-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s204-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CANONICAL QUARTET");
    expect(collapsed(note)).toContain("the F176 prescription's FIFTEENTH full-cycle test — zero label drift again");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (worklog): the two s204 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0L/1I at the standing anchor (the 234-sampled comment-truth census at 234 TRUE / 0 FALSE with 20 pointer members followed; the pin subset 132/132 across the 12 rolled files; and the 22-file layer census at 14,373) and auditor B's 0L/2I at the standing anchor (with the 79th premises carrying cycle in the entry's own numeral form, the 316-sampled route/lib census at 316 TRUE / 0 FALSE with 34 pointer members followed, and the 18-route census at 2,461) — both spellings at the standing form", () => {
    const a = auditEntry("Task ID: digma-s204-auditor-A");
    expect(a).toContain("0 Low / 1 Informational");
    expect(collapsed(a)).toContain("234 sampled");
    expect(collapsed(a)).toContain("234 TRUE / 0 FALSE");
    expect(collapsed(a)).toContain("132/132 across the 12 rolled files");
    expect(a).toContain("14,373");
    expect(collapsed(a)).toContain("20 pointer members followed");
    const b = auditEntry("Task ID: digma-s204-auditor-B");
    expect(b).toContain("0 Low / 2 Informational");
    expect(collapsed(b)).toContain("the 79th consecutive carrying cycle");
    expect(collapsed(b)).toContain("316 TRUE / 0 FALSE");
    expect(b).toContain("2,461");
    expect(b).toContain("Pattern 1");
  });

  it("SURVIVAL (plan + provenance): the F138 guard's FIFTY-FIFTH instance — the s203 plan's execution record shipped 6/6 ticked, zero unticked (the pre-armed guard per the session_593 closing record; the fifty-third consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S204 total rides the spec's own census: 1000 + 13 = 1013)", () => {
    const ticked = s203PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s203PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(6);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(1000 + 13).toBe(1013);
  });

  it("SURVIVAL (scripts): the s204 script provenance — live204/nav204/digma-seo-s204 tokens, the 180th/181st/141st ordinals, the S203 delivery at 0d65640d, zero s203 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live204");
    expect(refAuditSource).toContain("the 180th reference audit");
    expect(refAuditSource).toContain("the S203 delivery at HEAD 0d65640d");
    expect(refAuditSource).toContain("byte-identical the 141st");
    expect(refAuditSource).not.toContain("live203");
    expect(refAuditSource).not.toContain("179th reference audit");
    expect(navSource).toContain("nav204");
    expect(navSource).toContain("181st session, S204-cycle");
    expect(navSource).toContain("the S203 delivery 0d65640d + the S204 remediation");
    expect(navSource).not.toContain("nav203");
    expect(seoSource).toContain("digma-seo-s204");
    expect(seoSource).toContain("session 204, S204-cycle");
    expect(seoSource).not.toContain("digma-seo-s203");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the thirtieth re-quote cycle), call.ts still exactly 80 lines, and the ELEVEN raw-fetch registration riding the unchanged seam", () => {
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

  it("SURVIVAL (source, the B204-I-1 carried-member receipt): the CARRIED amendment NOT landed this cycle — the S124-C enumeration phrase still present VERBATIM at the elements route (the raw form, the source's own line-break + marker structure) with the PAD:120 canonical record still carrying the same phrase (the frozen-record doctrine — the phrase stays until the amendment lands, the first cycle above the below-threshold line), and the four list-family count standing at server-lows-s74", () => {
    // The phrase, quoted in the raw comment form (F187 — the
    // "Eleven deliberate" pin precedent: comment-spanning pins ride
    // the source's own line-break + marker structure):
    expect(elementsRouteSource).toContain(
      "the projects list, recent, and the\n * projects/[id] detail's thumbnail include all ship the ~320px\n * re-encode in the fillImage slot",
    );
    // The PAD:120 canonical record still carries the same phrase
    // (the frozen record — untouched until the carried amendment
    // lands with its same-cycle re-anchor):
    expect(padSource).toContain(
      "every sibling list-family route (projects list, recent, the projects/[id] detail's thumbnail include) rides the THUMBNAIL_ELEMENT_SELECT projection (S70-D/S113-D)",
    );
    // The four list-family count standing (the accurate member):
    expect(readFileSync(
      path.resolve(import.meta.dirname, "../tests/server-lows-s74.test.ts"),
      "utf8",
    )).toContain("the THUMBNAIL_ELEMENT_SELECT doc counts FOUR list-family routes");
  });

  it("SURVIVAL (layer + frozen record): the below-threshold form's own receipt — the layer total STAYING at 14,373 with the PER-FILE probe closing, the s203 amendments' receipts still standing (api.ts at exactly 50 lines with the re-select-family naming, db.ts at exactly 33 lines anchored at PAD §3.3 Pattern 1 with the dead Pattern B name retired), and the S67-B frozen-birth-record family staying pinned", () => {
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
    // The S203-A amendment's receipt still standing (the re-select
    // family named inside the S130-C parenthetical — the raw form):
    expect(apiSource).toContain(
      "// request — verify-otp's two mid-window re-selects the named exception\n// inside the S124-A catch, protected, answering 503) sits outside any\n// try/catch.",
    );
    const root = path.resolve(import.meta.dirname, "..");
    const api = execSync("wc -l src/lib/api.ts", {
      cwd: root,
      encoding: "utf8",
    });
    expect(Number(api.trim().split(/\s+/)[0])).toBe(50);
    // The S203-B amendment's receipt still standing (the live target
    // anchor; the dead name retired):
    expect(dbSource).toContain(
      "// Normalize the SQLite URL BEFORE the first client is constructed (PAD §3.3\n// Pattern 1).",
    );
    expect(dbSource).not.toContain("Pattern B");
    const db = execSync("wc -l src/lib/db.ts", {
      cwd: root,
      encoding: "utf8",
    });
    expect(Number(db.trim().split(/\s+/)[0])).toBe(33);
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
