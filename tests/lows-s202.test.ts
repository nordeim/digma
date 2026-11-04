import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-202 spec (the one-hundred-and-fiftieth audit's chosen
// work — the SIXTEENTH consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle in the HONEST FOLDER-LEVEL FORM: the master
// skill's own file byte-unchanged since the operator's 2026-10-25
// fd2037e3 revision): 0C/0H/0M/0L/5I combined — a BELOW-THRESHOLD
// cycle, the fourth zero-Low census in five cycles, zero behavioral
// source-code defect, zero comment-truth defect; the comment-truth
// census 627 sampled — 365 client-layer + 262 route/lib — 627 TRUE /
// 0 FALSE, THE LARGEST SAMPLE YET, THE ALL-TRUE CENSUS RESTORED (the
// streak at one); five informational members — one label-precision
// catch (B202-I-1 the dispatch brief's two per-file approximation
// markers — register 146 / resend-otp 122 the live figures, the F186
// record-gap form), one precision registration (B202-I-2 the no-e2e
// set strictly six — health GET the +1 liveness-carve-out bucket of
// the 13+6+1+5=25 arithmetic), one enumeration-precision member
// carried (B202-I-5 api.ts's S130-C read-path census parenthetical
// omitting verify-otp's two mid-window re-selects :118/:160 — the
// substance TRUE, the one-line amendment registered and carried under
// the below-threshold zero-source-change discipline, the B-I-1
// precedent), and two documented standing postures (B202-I-3
// register's 409 open enumeration by design; B202-I-4 the single-
// tenant ownership model, ADR-003 documented)):
//
// S202-A — THE REGISTRATION PAIR (the below-threshold registration-
//   cycle form): the s202-id-stable-premises-note at the 77th
//   consecutive cycle carrying the CANONICAL quartet in exactly one
//   place (the dispatch QUOTING it verbatim — the F176 prescription's
//   THIRTEENTH full-cycle test, zero label drift again) + the
//   s202-below-threshold-note (THE F188 POINTER-FOLLOWING GUARD'S
//   FIRST FULL-CYCLE TEST PASSED — 53 pointer members followed to
//   their targets (42 client-layer + 11 route/lib), every target
//   carrying its promised content, the all-TRUE census restored at
//   the largest sample yet; the thirty-second-generation coordinate
//   verification :2881/:2940/:3009 + the s201 row :2880 + the
//   F174-corrected window :2856..:2880 = s177..s201; the B202-I-1
//   label-precision registration with the live 146/122 figures + the
//   B202-I-2 precision registration + the B202-I-5 enumeration-
//   precision registration carried + the standing postures carried +
//   the vocabulary-HOLD sixteenth + the dispatch-currency TENTH
//   steady-state cycle + the honest REBUILT environment record + the
//   F138 FIFTY-THIRD instance + the thirty-third-generation
//   pre-registration :2883/:2942/:3011).
//
// S202-B — THE PER-SESSION PIN FAMILY: 13 pins — 8 RED (the AGENTS
//   session-202 bullet, the count re-anchor + the §7.1 row, the PAD
//   title, the SKILL version, the pair-unity constants, the two
//   worklog-registration notes, the audit-entry members) / 5
//   green-at-birth (the F138 53rd + the pin-family arithmetic 974 +
//   13 = 987, the script-provenance member, the standing-figures
//   member, the layer-STAYS member, the B202-I-1 live per-file
//   figures member) — the MEASURED birth form the record (the s159
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
const s201PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session201.md"),
  "utf8",
);

const readmeSource = readFileSync(
  path.resolve(import.meta.dirname, "../README.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s202.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s202.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s202.sh"),
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
 *  born at the POST-spec figures: the 2770 delivery checks + this
 *  spec's 13 = 2783 unit, the 263 delivery files + this spec = 264;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s202 lesson). */
const UNIT = "2809";
const FILES = "266";

/** The MEASURED layer figures (the s159 measured form — the STAYS
 *  form this cycle: the below-threshold registration-only remediation
 *  touching zero source lines (the registration pair + the spec the
 *  only mutations), the layer holding at the standing figure — no
 *  F40 rider). */
const LAYER_TOTAL = 14373;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The S202 anchors BOTH carry the standing
 *  spelling (digma-s202-auditor-A / digma-s202-auditor-B — the
 *  worklog-notes script landing them at the standing form). B's entry
 *  landed FIRST (running to its own separator) and A's second
 *  (running to its separator / the bracketed registration note). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const ends = [
    worklogSource.indexOf("\n---\n", at + 20),
    worklogSource.indexOf("\n[s202-id-stable-premises-note:", at),
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

describe("lows-s202: the below-threshold registrations + the F188 first-full-cycle census", () => {
  it("DEFECT (docs): the AGENTS session-202 bullet carries the completion members — the per-auditor census lines (A 0C/0H/0M/0L/0I the first zero-finding auditor census in the record + B 0C/0H/0M/0L/5I), the SIXTEENTH consecutive vocabulary-HOLD cycle, the F188 pointer-following guard's first-full-census registration, and the layer-total family STAYING at 14,373 (the below-threshold registration-only remediation form)", () => {
    expect(collapsed(agentsSource)).toContain("session 202, S202-A..S202-B");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/0L/0I + B 0C/0H/0M/0L/5I");
    expect(collapsed(agentsSource)).toContain("the SIXTEENTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F188 POINTER-FOLLOWING GUARD'S FIRST FULL-CYCLE TEST");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.181.0 chain entry carries the S202 derivation (2783 = 2770 + 13 unit / 264 files) + the §7.1 row for the s202 spec, the layer-total family STAYING at 14,373 (the below-threshold form, no F40 rider) and the route figure STAYING at 2,461 — the B202-I-1 label-precision live figures REGISTERED (register 146 / resend-otp 122, the approximation-marker form retired)", () => {
    expect(collapsed(padSource)).toContain("2783 = 2770 + 13 unit / 264 files");
    expect(padSource).toContain("lows-s202.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,373");
    expect(padSource).toContain("| **Unit total** | **266 files** | **2809** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2809/2809");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2809 checks / 266 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.181.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.183\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.183.0");
    expect(lastUpdated).toContain("the one-hundred-and-fifty-second audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.180.0 + the F188 first-full-cycle census registration (the all-TRUE census restored at the largest sample yet — 627 sampled / 627 TRUE / 0 FALSE with 53 pointers followed, every target carrying its promised content) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.182.0");
    expect(collapsed(skillSource)).toContain("THE F188 POINTER-FOLLOWING GUARD'S FIRST FULL-CYCLE TEST");
    expect(skillSource).toContain("2809 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s201 + s200 pair as the standing witnesses) + the anchored declaration census pins 83 UNIT / 82 FILES", () => {
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

  it("SURVIVAL (worklog): the bracketed s202-below-threshold-note registers the thirty-second-generation verification (:2856..:2880 = s177..s201, 25 rows, :2855 the s176 row, :2854 the s175 row — the F174-corrected window form verified at its own generation) + the F188 POINTER-FOLLOWING GUARD'S FIRST FULL-CYCLE TEST + the below-threshold census registration + the B202-I-1 label-precision registration + the B202-I-2 precision registration + the B202-I-5 enumeration-precision registration carried + the dispatch-currency-honored registration + the honest folder-level vocabulary-HOLD registration + the honest environment record (the REBUILT form) + the F138 FIFTY-THIRD instance + the thirty-third-generation pre-registration", () => {
    expect(worklogSource).toContain("[s202-below-threshold-note: THE THIRTY-SECOND-GENERATION COORDINATE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s202-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s202-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F188 POINTER-FOLLOWING GUARD'S FIRST FULL-CYCLE TEST PASSED");
    expect(collapsed(note)).toContain(":2856..:2880 = s177..s201 (TWENTY-FIVE rows, arithmetic-consistent) with :2855 the s176 row and :2854 the s175 row");
    expect(collapsed(note)).toContain("THE B202-I-1 LABEL-PRECISION REGISTRATION");
    expect(collapsed(note)).toContain("THE B202-I-2 PRECISION REGISTRATION");
    expect(collapsed(note)).toContain("THE B202-I-5 ENUMERATION-PRECISION REGISTRATION");
    expect(collapsed(note)).toContain("THE DISPATCH-CURRENCY-HONORED REGISTRATION");
    expect(collapsed(note)).toContain("THE VOCABULARY-HOLD REGISTRATION IN THE HONEST FOLDER-LEVEL FORM");
    expect(collapsed(note)).toContain("THE REBUILT FORM");
    expect(collapsed(note)).toContain("FIFTY-THIRD INSTANCE");
    expect(collapsed(note)).toContain("THE THIRTY-THIRD-GENERATION PRE-REGISTRATION");
  });

  it("SURVIVAL (worklog): the bracketed s202-id-stable-premises-note registers the CANONICAL quartet — the 77th ordinal, the four premises at their seams, the F176 quoting prescription's THIRTEENTH full-cycle test (zero label drift again, the standing convention per F178, the graduated form watched per F179 and confirmed in the steady-state watch per F180 — the TENTH steady-state cycle), and the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s202-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SEVENTY-SEVENTH CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s202-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s202-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CANONICAL QUARTET");
    expect(collapsed(note)).toContain("the F176 prescription's THIRTEENTH full-cycle test — zero label drift again");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (worklog): the two s202 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0L/0I at the standing anchor (THE FIRST ZERO-FINDING AUDITOR CENSUS IN THE RECORD — with the 365-sampled comment-truth census at 365 TRUE / 0 FALSE and 42 pointers followed; the pin subset 130/130 across the 12 rolled files; and the 22-file layer census at 14,373) and auditor B's 0L/5I at the standing anchor (with the 77th premises cycle, the 13 + 6 + 1 + 5 = 25 handler-census write-set arithmetic, the 262-sampled route/lib census at 262 TRUE / 0 FALSE with 11 pointer families followed, and the 18-route census at 2,461 with the B202-I-1 live figures 146/122) — both spellings at the standing form", () => {
    const a = auditEntry("Task ID: digma-s202-auditor-A");
    expect(a).toContain("0 Low / 0 Informational");
    expect(collapsed(a)).toContain("365 sampled, 365 TRUE / 0 FALSE");
    expect(collapsed(a)).toContain("130/130 across the 12 rolled files");
    expect(a).toContain("14,373");
    expect(collapsed(a)).toContain("42 pointer-members followed");
    const b = auditEntry("Task ID: digma-s202-auditor-B");
    expect(collapsed(b)).toContain("0 Low / 5 Informational");
    expect(collapsed(b)).toContain("the 77th consecutive cycle");
    expect(collapsed(b)).toContain("13 + 6 + 1 + 5 = 25");
    expect(collapsed(b)).toContain("262 sampled, 262 TRUE / 0 FALSE");
    expect(b).toContain("2,461");
    expect(collapsed(b)).toContain("register 146 · resend-otp 122");
  });

  it("SURVIVAL (plan + provenance): the F138 guard's FIFTY-THIRD instance — the s201 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_583 closing record; the fifty-first consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S202 total rides the spec's own census: 974 + 13 = 987)", () => {
    const ticked = s201PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s201PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(974 + 13).toBe(987);
  });

  it("SURVIVAL (scripts): the s202 script provenance — live202/nav202/digma-seo-s202 tokens, the 178th/179th/139th ordinals, the S201 delivery at e7e0ecde, zero s201 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live202");
    expect(refAuditSource).toContain("the 178th reference audit");
    expect(refAuditSource).toContain("the S201 delivery at HEAD e7e0ecde");
    expect(refAuditSource).toContain("byte-identical the 139th");
    expect(refAuditSource).not.toContain("live201");
    expect(refAuditSource).not.toContain("177th reference audit");
    expect(navSource).toContain("nav202");
    expect(navSource).toContain("179th session, S202-cycle");
    expect(navSource).toContain("the S201 delivery e7e0ecde + the S202 remediation");
    expect(navSource).not.toContain("nav201");
    expect(seoSource).toContain("digma-seo-s202");
    expect(seoSource).toContain("session 202, S202-cycle");
    expect(seoSource).not.toContain("digma-seo-s201");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the twenty-eighth re-quote cycle), call.ts still exactly 80 lines, and the ELEVEN raw-fetch registration riding the unchanged seam", () => {
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

  it("SURVIVAL (source, the B202-I-1 live receipt): the two label-precision figures derived LIVE — auth/register at exactly 146 and auth/resend-otp at exactly 122 (the approximation-marker form retired; every per-file route figure exact at the brief from the next dispatch)", () => {
    expect(liveRouteFigures.perFile["src/app/api/auth/register/route.ts"]).toBe(146);
    expect(liveRouteFigures.perFile["src/app/api/auth/resend-otp/route.ts"]).toBe(122);
  });

  it("SURVIVAL (layer + frozen record): the below-threshold form's own receipt — the layer total STAYING at 14,373 (the registration-only remediation touching zero source lines, no F40 rider) derived LIVE with the PER-FILE probe closing, editor.ts at exactly 1,263, properties-panel.tsx at exactly 2,378, globals.css STAYING at 300, login-screen.tsx STAYING at 747, AND the S67-B frozen-birth-record family staying frozen + pinned (the ~722 KB/~1.45 GB arithmetic untouched at its claim sites, the era-anchored birth-record form, its current-era companion confirmed at s199's B-I-4)", () => {
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
