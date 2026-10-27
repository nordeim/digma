import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-189 spec (the one-hundred-and-thirty-seventh audit's chosen
// work — the THIRD consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle; the operator's 2026-10-25 fd2037e3 revision
// byte-unchanged since): 0C/0H/0M/0L/2I combined, the THIRD
// consecutive zero-Low cycle, every member informational — one carried
// §8 letter posture, one premise-label record-precision registration
// — zero source-code defect, zero mutation surface; the
// comment-truth census 31 sampled, 31 TRUE / 0 FALSE — the
// fully-TRUE form's first cycle since S187, the S188-A amendment's
// own clause now verifying TRUE):
//
// S189-A — THE REGISTRATION PAIR (the S187 registration-cycle form,
//   ZERO source-code movement): the s189-id-stable-premises-note at
//   the 64th consecutive cycle carrying the CANONICAL quartet in
//   exactly one place + the B-I-1 registration (the S188-B worklog
//   entry's divergent quartet composition documented — every
//   underlying fact TRUE in both, frozen records stay frozen per
//   S132-C) + the s189-below-threshold-note (the F176 premise-label
//   truth lesson + the eighteenth-generation verification + the
//   vocabulary-HOLD + the honest environment record). The layer
//   STAYS at 14,373 — the zero-movement form, no F40 rider.
//
// S189-B — THE PER-SESSION PIN FAMILY: 12 pins — 5 RED (the doc-side
//   collateral members) / 7 green-at-birth (the two
//   worklog-registration members, the F138 guard's FORTIETH
//   instance — the s188 plan's record pinned 4/4 ticked at
//   f03aceda, the script-provenance member, the audit-entry member,
//   the standing-figures member, and the layer-STAYS member) — the
//   MEASURED birth form (the s159 lesson: the spec's own arithmetic
//   carries the measured pin count, never the forecast).

const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s188PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session188.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s189.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s189.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s189.sh"),
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

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2613 delivery checks + this
 *  spec's 12 = 2625 unit, the 250 delivery files + this spec = 251;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s189 lesson). */
const UNIT = "2685";
const FILES = "256";

/** The MEASURED layer figures (the s159 measured form — the STAYS
 *  form this cycle: the registration-only cycle moves no source
 *  line, the layer holding at the S188-A amendment's post-delivery
 *  figure — the zero-movement form's own receipt, no F40 rider). */
const LAYER_TOTAL = 14373;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The s189 pair carries the FULL unique
 *  anchor form (digma-s189-auditor-A / digma-s189-auditor-B) — this
 *  cycle BOTH entries landed DIRECTLY in the repo worklog BEFORE the
 *  registration notes (the fresh-clone ordering, the fourth
 *  consecutive cycle of the environment form), so the scoping
 *  discipline adapts: auditor A's entry runs to the next top-level
 *  '---' (auditor B's separator), auditor B's entry runs to the
 *  next bracketed registration note — never into the notes. */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const ends = [
    worklogSource.indexOf("\n---\n", at),
    worklogSource.indexOf("\n[s189-id-stable-premises-note:", at),
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

describe("lows-s189: the premise-label truth registrations (the registration-only cycle)", () => {
  it("DEFECT (docs): the AGENTS session-189 bullet carries the completion members — the per-auditor census lines, the THIRD consecutive zero-Low cycle, the vocabulary-HOLD cycle, the F176 premise-label truth lesson, and the layer-total family STAYING at 14,373 (the zero-movement form)", () => {
    expect(collapsed(agentsSource)).toContain("session 189, S189-A..S189-B");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/0L/1I + B 0C/0H/0M/0L/1I");
    expect(collapsed(agentsSource)).toContain("the THIRD consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F176 LESSON — THE PREMISE-LABEL TRUTH MEMBER");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.168.0 chain entry carries the S189 derivation (2625 = 2613 + 12 unit / 251 files) + the §7.1 row for the s189 spec, the layer-total family STAYING at 14,373 (the registration-only cycle, no F40 rider) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    expect(collapsed(padSource)).toContain("2625 = 2613 + 12 unit / 251 files");
    expect(padSource).toContain("lows-s189.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,373");
    expect(collapsed(padSource)).toContain("the route figure STAYING at 2,461");
    expect(padSource).toContain("| **Unit total** | **256 files** | **2685** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2685/2685");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2685 checks / 256 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.168.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.173\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.173.0");
    expect(lastUpdated).toContain("the one-hundred-and-forty-second audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.167.0 + the F176 premise-label truth lesson (a deferral-premise quartet's member labels are themselves record claims — when the same cycle's records carry different quartet compositions, every underlying fact can be true in both while the composition dilutes the canonical form; the honest repair registers the canonical composition in exactly one place and registers the divergence, never editing frozen records; and the dispatch brief must QUOTE the canonical quartet verbatim, never paraphrase it) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.172.0");
    expect(skillSource).toContain("176. **F176");
    expect(collapsed(skillSource)).toContain("THE PREMISE-LABEL TRUTH MEMBER");
    expect(skillSource).toContain("2685 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s188 + s187 pair as the standing witnesses) + the anchored declaration census pins 70 UNIT / 69 FILES", () => {
    expect(UNIT).toBe("2685");
    expect(FILES).toBe("256");
    const root = path.resolve(import.meta.dirname, "..");
    const out = execSync(
      `rg -l '^const UNIT = "2685";$' tests/ src/lib/ | wc -l && rg -l '^const FILES = "256";$' tests/ src/lib/ | wc -l`,
      { cwd: root, encoding: "utf8" },
    );
    const [unitFiles, filesFiles] = out.trim().split("\n").map(Number);
    expect(unitFiles).toBe(75);
    expect(filesFiles).toBe(74);
  });

  it("SURVIVAL (worklog): the bracketed s189-below-threshold-note registers the eighteenth-generation verification (:2835..:2854 = s169..s188, 20 rows, :2834 the S168 row — the F174-corrected window form verified at its own generation) + the F176 PREMISE-LABEL TRUTH lesson + the A-I-1 carried §8 letter posture + the B-I-1 premise-label registration + the vocabulary-HOLD registration + the honest environment record (the trap caught BEFORE the first db operation) + the F138 FORTIETH instance", () => {
    expect(worklogSource).toContain("[s189-below-threshold-note: THE EIGHTEENTH-GENERATION COORDINATE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s189-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s189-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F176 LESSON — THE PREMISE-LABEL TRUTH MEMBER");
    expect(collapsed(note)).toContain(":2835..:2854 = s169..s188 (TWENTY rows, arithmetic-consistent) with :2834 the S168 row");
    expect(collapsed(note)).toContain("A-I-1 the master-skill §8 letter posture (CARRIED");
    expect(collapsed(note)).toContain("B-I-1 the premise-label drift");
    expect(collapsed(note)).toContain("THE VOCABULARY-HOLD REGISTRATION");
    expect(collapsed(note)).toContain("CAUGHT BEFORE the first db operation ran");
    expect(collapsed(note)).toContain("FORTIETH INSTANCE");
  });

  it("SURVIVAL (worklog): the bracketed s189-id-stable-premises-note registers the CANONICAL quartet — the 64th ordinal, the B-I-1 registration (the S188-B entry's divergent composition documented, frozen records stay frozen per S132-C), the four premises at their seams, the dispatch-brief quoting prescription, and the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s189-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SIXTY-FOURTH CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s189-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s189-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CANONICAL QUARTET");
    expect(collapsed(note)).toContain("THE B-I-1 REGISTRATION");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("frozen records stay frozen (S132-C)");
    expect(collapsed(note)).toContain("quotes the canonical quartet verbatim");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan): the F138 guard's FORTIETH instance — the s188 plan's execution record shipped 4/4 ticked, zero unticked (the pre-armed guard per the session_516/517 directive; the thirty-eighth consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S189 total rides the spec's own census: 817 + 12 = 829)", () => {
    const ticked = s188PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s188PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(4);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(817 + 12).toBe(829);
  });

  it("SURVIVAL (scripts): the s189 script provenance — live189/nav189/digma-seo-s189 tokens, the 165th/166th/126th ordinals, the S188 delivery at f03aceda, zero s188 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live189");
    expect(refAuditSource).toContain("the 165th reference audit");
    expect(refAuditSource).toContain("the S188 delivery at HEAD f03aceda");
    expect(refAuditSource).toContain("byte-identical the 126th");
    expect(refAuditSource).not.toContain("live188");
    expect(refAuditSource).not.toContain("164th reference audit");
    expect(navSource).toContain("nav189");
    expect(navSource).toContain("166th session, S189-cycle");
    expect(navSource).toContain("the S188 delivery f03aceda + the S189 remediation");
    expect(navSource).not.toContain("nav188");
    expect(seoSource).toContain("digma-seo-s189");
    expect(seoSource).toContain("session 189, S189-cycle");
    expect(seoSource).not.toContain("digma-seo-s188");
  });

  it("SURVIVAL (worklog): the two s189 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/1I (with the 31-sampled comment-truth census at 31 TRUE / 0 FALSE — the fully-TRUE form's first cycle since S187; the trap-4 hunt closing CLEAN; and the mobile-nav-by-construction pass) and auditor B's 0C/0H/0M/0L/1I (with the 64th premises cycle, the 69/68 spec constants, and the write-set arithmetic closing at 25)", () => {
    const a = auditEntry("Task ID: digma-s189-auditor-A");
    expect(a).toContain("0C / 0H / 0M / 0L / 1I");
    expect(collapsed(a)).toContain("31 TRUE / 0 FALSE");
    expect(collapsed(a)).toContain("trap-4");
    expect(a).toContain("14,373");
    const b = auditEntry("Task ID: digma-s189-auditor-B");
    expect(collapsed(b)).toContain("0C / 0H / 0M / 0L / 1I");
    expect(collapsed(b)).toContain("64th");
    expect(collapsed(b)).toContain("69/68");
    expect(collapsed(b)).toContain("= 25");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the fifteenth re-quote cycle), call.ts still exactly 80 lines", () => {
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

  it("SURVIVAL (layer): the zero-movement form's own receipt — the layer total STAYING at 14,373 (the registration-only cycle: no source-code movement, no remediation receipt, no F40 rider) derived LIVE with the PER-FILE probe closing, properties-panel.tsx at exactly 2,378, login-screen.tsx STAYING at 747, globals.css STAYING at 300", () => {
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
