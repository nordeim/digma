import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-190 spec (the one-hundred-and-thirty-eighth audit's chosen
// work — the FOURTH consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle; the operator's 2026-10-25 fd2037e3 revision
// byte-unchanged since): 0C/0H/0M/0L/3I combined, the FOURTH
// consecutive zero-Low cycle, every member informational — one carried
// §8 letter posture, two record-precision registrations (the
// enumeration-axis note + the dispatch-currency note) — zero
// source-code defect, zero mutation surface; the comment-truth census
// 31 sampled, 31 TRUE / 0 FALSE — the fully-TRUE form's SECOND
// consecutive cycle):
//
// S190-A — THE REGISTRATION PAIR (the S187/S189 registration-cycle
//   form, ZERO source-code movement): the s190-id-stable-premises-note
//   at the 65th consecutive cycle carrying the CANONICAL quartet in
//   exactly one place (the dispatch QUOTING it verbatim — the F176
//   prescription honored at its first full-cycle test, zero label
//   drift) + the s190-below-threshold-note (the F177 enumeration-axis
//   truth lesson + the twentieth-generation verification + the
//   dispatch-currency registration + the vocabulary-HOLD + the honest
//   environment record). The layer STAYS at 14,373 — the
//   zero-movement form, no F40 rider.
//
// S190-B — THE PER-SESSION PIN FAMILY: 12 pins — 5 RED (the doc-side
//   collateral members) / 7 green-at-birth (the two
//   worklog-registration members, the F138 guard's FORTY-FIRST
//   instance — the s189 plan's record pinned 4/4 ticked at e25238af,
//   the script-provenance member, the audit-entry member — with the
//   B-anchor spelling divergence pinned as-written (the s159
//   pin-the-record's-own-spelling lesson: auditor B's entry carries
//   "s190-auditor-B" where the standing convention is
//   "digma-s190-auditor-B"; both anchors unique and greppable, frozen
//   records stay frozen per S132-C), the standing-figures member, and
//   the layer-STAYS member) — the MEASURED birth form (the s159
//   lesson: the spec's own arithmetic carries the measured pin count,
//   never the forecast).

const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s189PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session189.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s190.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s190.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s190.sh"),
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
 *  born at the POST-spec figures: the 2625 delivery checks + this
 *  spec's 12 = 2637 unit, the 251 delivery files + this spec = 252;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s190 lesson). */
const UNIT = "2709";
const FILES = "258";

/** The MEASURED layer figures (the s159 measured form — the STAYS
 *  form this cycle: the registration-only cycle moves no source
 *  line, the layer holding at the S188-A amendment's post-delivery
 *  figure — the zero-movement form's own receipt, no F40 rider). */
const LAYER_TOTAL = 14373;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The S190 anchors carry a SPELLING
 *  DIVERGENCE pinned as-written (the s159 lesson): auditor A's entry
 *  rides the full standing form (digma-s190-auditor-A) while auditor
 *  B's carries the bare form (s190-auditor-B) — both unique, both
 *  greppable, the frozen records left as they landed. This cycle B's
 *  entry landed FIRST (:7593, running to auditor A's separator) and
 *  A's second (:7619, running to the bracketed registration note). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const ends = [
    worklogSource.indexOf("\n---\n", at),
    worklogSource.indexOf("\n[s190-id-stable-premises-note:", at),
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

describe("lows-s190: the enumeration-axis truth registrations (the registration-only cycle)", () => {
  it("DEFECT (docs): the AGENTS session-190 bullet carries the completion members — the per-auditor census lines, the FOURTH consecutive zero-Low cycle, the vocabulary-HOLD cycle, the F177 enumeration-axis truth lesson, and the layer-total family STAYING at 14,373 (the zero-movement form)", () => {
    expect(collapsed(agentsSource)).toContain("session 190, S190-A..S190-B");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/1I");
    expect(collapsed(agentsSource)).toContain("the FOURTH consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F177 LESSON — THE ENUMERATION-AXIS TRUTH MEMBER");
    expect(collapsed(agentsSource)).toContain("STAYING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.169.0 chain entry carries the S190 derivation (2637 = 2625 + 12 unit / 252 files) + the §7.1 row for the s190 spec, the layer-total family STAYING at 14,373 (the registration-only cycle, no F40 rider) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    expect(collapsed(padSource)).toContain("2637 = 2625 + 12 unit / 252 files");
    expect(padSource).toContain("lows-s190.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family STAYING at 14,373");
    expect(collapsed(padSource)).toContain("the route figure STAYING at 2,461");
    expect(padSource).toContain("| **Unit total** | **258 files** | **2709** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2709/2709");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2709 checks / 258 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.169.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.175\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.175.0");
    expect(lastUpdated).toContain("the one-hundred-and-forty-fourth audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.168.0 + the F177 enumeration-axis truth lesson (an enumeration pattern's registered axis span is itself a record claim — when a negative-margin hunt registers `-m[tblr]-*`, the pattern spans only the four single-side axes and the compound-axis forms fall outside its span by construction; the honest repair registers the axis dimension explicitly and registers the out-of-span live sites it finds, never editing frozen records) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.174.0");
    expect(skillSource).toContain("177. **F177");
    expect(collapsed(skillSource)).toContain("THE ENUMERATION-AXIS TRUTH MEMBER");
    expect(skillSource).toContain("2709 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s189 + s188 pair as the standing witnesses) + the anchored declaration census pins 71 UNIT / 70 FILES", () => {
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
  });

  it("SURVIVAL (worklog): the bracketed s190-below-threshold-note registers the twentieth-generation verification (:2836..:2856 = s169..s189, 21 rows, :2835 the S168 row — the F174-corrected window form verified at its own generation) + the F177 ENUMERATION-AXIS TRUTH lesson + the dispatch-currency registration + the A-I-1 carried §8 letter posture + the A-I-2/B-I-1 registrations + the vocabulary-HOLD registration + the honest environment record (the trap caught BEFORE the first db operation) + the F138 FORTY-FIRST instance", () => {
    expect(worklogSource).toContain("[s190-below-threshold-note: THE TWENTIETH-GENERATION COORDINATE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s190-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s190-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F177 LESSON — THE ENUMERATION-AXIS TRUTH MEMBER");
    expect(collapsed(note)).toContain(":2836..:2856 = s169..s189 (TWENTY-ONE rows, arithmetic-consistent) with :2835 the S168 row");
    expect(collapsed(note)).toContain("THE B-I-1 DISPATCH-CURRENCY REGISTRATION");
    expect(collapsed(note)).toContain("A-I-1 the master-skill §8 letter posture (CARRIED");
    expect(collapsed(note)).toContain("A-I-2 the enumeration-axis note");
    expect(collapsed(note)).toContain("THE VOCABULARY-HOLD REGISTRATION");
    expect(collapsed(note)).toContain("CAUGHT BEFORE the first db operation ran");
    expect(collapsed(note)).toContain("FORTY-FIRST INSTANCE");
  });

  it("SURVIVAL (worklog): the bracketed s190-id-stable-premises-note registers the CANONICAL quartet — the 65th ordinal, the four premises at their seams, the F176 quoting prescription's first full-cycle test (zero label drift), and the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s190-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SIXTY-FIFTH CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s190-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s190-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CANONICAL QUARTET");
    expect(collapsed(note)).toContain("the F176 prescription's first full-cycle test — zero label drift");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan): the F138 guard's FORTY-FIRST instance — the s189 plan's execution record shipped 4/4 ticked, zero unticked (the pre-armed guard per the session_522/523 directive; the thirty-ninth consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S190 total rides the spec's own census: 829 + 12 = 841)", () => {
    const ticked = s189PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s189PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(4);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(829 + 12).toBe(841);
  });

  it("SURVIVAL (scripts): the s190 script provenance — live190/nav190/digma-seo-s190 tokens, the 166th/167th/127th ordinals, the S189 delivery at e25238af, zero s189 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live190");
    expect(refAuditSource).toContain("the 166th reference audit");
    expect(refAuditSource).toContain("the S189 delivery at HEAD e25238af");
    expect(refAuditSource).toContain("byte-identical the 127th");
    expect(refAuditSource).not.toContain("live189");
    expect(refAuditSource).not.toContain("165th reference audit");
    expect(navSource).toContain("nav190");
    expect(navSource).toContain("167th session, S190-cycle");
    expect(navSource).toContain("the S189 delivery e25238af + the S190 remediation");
    expect(navSource).not.toContain("nav189");
    expect(seoSource).toContain("digma-seo-s190");
    expect(seoSource).toContain("session 190, S190-cycle");
    expect(seoSource).not.toContain("digma-seo-s189");
  });

  it("SURVIVAL (worklog): the two s190 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/2I at the standing anchor (with the 31-sampled comment-truth census at 31 TRUE / 0 FALSE — the fully-TRUE form's second consecutive cycle; the trap-4 hunt with the enumeration-axis note; and the mobile-nav-by-construction pass) and auditor B's 0C/0H/0M/0L/1I at the divergent bare anchor (with the 65th premises cycle, the 70/69 spec constants, and the write-set arithmetic closing at 25) — both spellings pinned as-written (the s159 lesson, frozen records stay frozen)", () => {
    const a = auditEntry("Task ID: digma-s190-auditor-A");
    expect(a).toContain("0C / 0H / 0M / 0L / 2I");
    expect(collapsed(a)).toContain("31 TRUE / 0 FALSE");
    expect(collapsed(a)).toContain("trap-4");
    expect(a).toContain("14,373");
    const b = auditEntry("Task ID: s190-auditor-B");
    expect(collapsed(b)).toContain("0C / 0H / 0M / 0L / 1I");
    expect(collapsed(b)).toContain("65th cycle");
    expect(collapsed(b)).toContain("70 UNIT + 69 FILES");
    expect(collapsed(b)).toContain("= 25");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the sixteenth re-quote cycle), call.ts still exactly 80 lines", () => {
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
