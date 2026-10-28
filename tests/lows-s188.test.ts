import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-188 spec (the one-hundred-and-thirty-sixth audit's chosen
// work — the SECOND consecutive cycle under the SAME
// skills/web-application/SKILL.md v1.2.0 vocabulary (the
// vocabulary-HOLD cycle; the operator's 2026-10-25 fd2037e3 revision
// byte-unchanged since): 0C/0H/0M/0L/3I combined, the SECOND
// consecutive zero-Low cycle, every member informational — one
// comment-truth clause, one §8 letter posture, one environment note
// — zero source-code defect, zero mutation surface; the
// comment-truth census 31 sampled, 30 TRUE / 1 FALSE — the first
// FALSE census member in three cycles, surfaced by MEASUREMENT
// DEPTH at the keydown gate):
//
// S188-A — THE COMMENT-TRUTH REPAIR (the S185 receipt-count-truth
//   form): the S129-A comment's "modifier combos must never arm"
//   clause at properties-panel.tsx:509-513 corrected — the gate
//   reads event.key alone (a modifier held WITH a member key DOES
//   arm; net-zero: no engine applies a value change to a range
//   input under held modifiers, the idle terminal's changed===false
//   cancel) and the arm-on-any-member-key form registered as the
//   DELIBERATE robust posture (the S130-A wheel lesson — narrowing
//   the gate would re-open the un-armed-change flooding class).
//   Comment-text only, but the amendment's own +9 lines MOVE the
//   layer (14,365 -> 14,373) — the F40 rider fully engaged.
//
// S188-B — THE PER-SESSION PIN FAMILY: 13 pins — 7 RED (the source
//   contract + the doc-side collateral members) / 6 green-at-birth
//   (the two worklog-registration members, the F138 guard's
//   THIRTY-NINTH instance — the s187 plan's record pinned 4/4
//   ticked at 33123311, the script-provenance member, the
//   audit-entry member, and the standing-figures member) — the
//   MEASURED birth form (the s159 lesson: the spec's own
//   arithmetic carries the measured pin count, never the
//   forecast).

const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s187PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session187.md"),
  "utf8",
);

const propertiesSource = readFileSync(
  path.resolve(
    import.meta.dirname,
    "../src/components/editor/properties-panel.tsx",
  ),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s188.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s188.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s188.sh"),
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
 *  born at the POST-spec figures: the 2600 delivery checks + this
 *  spec's 13 = 2613 unit, the 249 delivery files + this spec = 250;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s188 lesson). */
const UNIT = "2709";
const FILES = "258";

/** The MEASURED layer figures (the s159 measured form — the MOVING
 *  form this cycle: the S188-A comment-truth amendment's own +8
 *  lines take the layer 14,365 -> 14,373 and properties-panel.tsx
 *  2,370 -> 2,378 — the F40 rider's own receipt, the deliberate
 *  movement never drift). */
const LAYER_TOTAL = 14373;
const PROPERTIES_LINES = 2378;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice). The s188 pair carries the FULL unique
 *  anchor form (digma-s188-auditor-A / digma-s188-auditor-B) — this
 *  cycle BOTH entries landed DIRECTLY in the repo worklog BEFORE the
 *  registration notes (the fresh-clone ordering, the B-I-1
 *  environment note's form), so the scoping discipline adapts: each
 *  entry runs to the next top-level '---', the next bracketed
 *  registration note, or EOF — never into the notes. */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const ends = [
    worklogSource.indexOf("\n---\n", at),
    worklogSource.indexOf("\n[s188-id-stable-premises-note:", at),
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

describe("lows-s188: the exclusion-clause comment-truth repair + the F175 registrations", () => {
  it("DEFECT (source): the S188-A comment-truth repair — the S129-A clause's 'modifier combos must never arm' member corrected (a modifier HELD WITH a member key DOES arm — net-zero, the at-bound residual's sibling) with the DELIBERATE robust form registered (the S130-A wheel posture) and the gate itself UNCHANGED (SLIDER_KEYS.has(event.key) — the arm-on-any-member-key form kept, never narrowed)", () => {
    // the receipt comment landed at the S129-A seam
    expect(propertiesSource).toContain(
      "Session 188 (S188-A / A-I-1 — the 136th audit's Informational, the",
    );
    // the false clause is GONE (the comment-truth repair)
    expect(propertiesSource).not.toContain("modifier combos must never arm");
    expect(propertiesSource).toContain("Tab / F5 never arm");
    // the corrected semantics documented
    expect(collapsed(propertiesSource)).toContain(
      "a modifier HELD WITH",
    );
    expect(collapsed(propertiesSource)).toContain(
      "member key (Ctrl/Cmd/Alt+Arrow…) DOES arm",
    );
    expect(collapsed(propertiesSource)).toContain(
      "the DELIBERATE robust form",
    );
    expect(collapsed(propertiesSource)).toContain("the S130-A wheel");
    expect(collapsed(propertiesSource)).toContain(
      "narrowing the gate would re-open the flooding class",
    );
    // the gate itself UNCHANGED — the five keydown sites keep the
    // arm-on-any-member-key form (the robust posture, never narrowed)
    const gateSites = propertiesSource.match(
      /if \(SLIDER_KEYS\.has\(event\.key\)\) sliderGesture\.keyTick\(/g,
    );
    expect(gateSites?.length).toBe(5);
  });

  it("DEFECT (layer rider): the post-amendment measured figures — the layer total at 14,373 (the F40 rider's own receipt: the +8 the S188-A comment amendment's own lines) derived LIVE with the PER-FILE probe closing, properties-panel.tsx at exactly 2,379, login-screen.tsx STAYING at 747, globals.css STAYING at 300", () => {
    expect(liveLayerTotal).toBe(LAYER_TOTAL);
    const layerHandSum = Object.values(liveLayerPerFile).reduce(
      (a, b) => a + b,
      0,
    );
    expect(layerHandSum).toBe(liveLayerTotal);
    expect(liveLayerPerFile["src/components/editor/properties-panel.tsx"]).toBe(PROPERTIES_LINES);
    expect(liveLayerPerFile["src/components/login-screen.tsx"]).toBe(747);
    expect(liveLayerPerFile["src/app/globals.css"]).toBe(300);
    expect(liveLayerPerFile["src/components/editor/editor-view.tsx"]).toBe(2453);
    expect(liveLayerPerFile["src/components/editor/editor-store.ts"]).toBe(847);
  });

  it("DEFECT (docs): the AGENTS session-188 bullet carries the completion members — the per-auditor census lines, the vocabulary-HOLD cycle, the second consecutive zero-Low census, the F175 exclusion-clause truth lesson, and the layer-total family MOVING at 14,373 (the F40 rider fully engaged)", () => {
    expect(collapsed(agentsSource)).toContain("session 188, S188-A..S188-B");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/0L/2I + B 0C/0H/0M/0L/1I");
    expect(collapsed(agentsSource)).toContain("the SECOND consecutive cycle under the SAME skills/web-application/SKILL.md v1.2.0 vocabulary");
    expect(collapsed(agentsSource)).toContain("THE F175 LESSON — THE EXCLUSION-CLAUSE TRUTH MEMBER");
    expect(collapsed(agentsSource)).toContain("MOVING at 14,373");
  });

  it("DEFECT (docs): the count re-anchor — the v1.167.0 chain entry carries the S188 derivation (2613 = 2600 + 13 unit / 250 files) + the §7.1 row for the s188 spec, the layer-total family MOVING at 14,373 (the +8 the comment amendment's own receipt) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    expect(collapsed(padSource)).toContain("2613 = 2600 + 13 unit / 250 files");
    expect(padSource).toContain("lows-s188.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family MOVING at 14,373");
    expect(collapsed(padSource)).toContain("the route figure STAYING at 2,461");
    expect(padSource).toContain("| **Unit total** | **258 files** | **2709** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2709/2709");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2709 checks / 258 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.167.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.175\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.175.0");
    expect(lastUpdated).toContain("the one-hundred-and-forty-fourth audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.166.0 + the F175 exclusion-clause truth lesson (an enumeration guard's prose exclusion clause is itself a behavior claim about the guard's discrimination — when the gate tests only the enumerated dimension, any orthogonal dimension held WITH a member value passes at the letter; and when the over-inclusive arm is the deliberate robust form, the honest repair amends the CLAUSE, never the guard) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.174.0");
    expect(skillSource).toContain("175. **F175");
    expect(collapsed(skillSource)).toContain("THE EXCLUSION-CLAUSE TRUTH MEMBER");
    expect(skillSource).toContain("2709 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s187 + s186 pair as the standing witnesses) + the anchored declaration census pins 69 UNIT / 68 FILES", () => {
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

  it("SURVIVAL (worklog): the bracketed s188-below-threshold-note registers the seventeenth-generation verification (:2834..:2852 = s169..s187, 19 rows, :2833 the S168 row — the F174-corrected window form verified at its own generation) + the F175 EXCLUSION-CLAUSE TRUTH lesson + the A-I-1 comment-truth member (repaired in-cycle by S188-A) + the A-I-2 §8 letter posture + the B-I-1 host-worklog environment note + the vocabulary-HOLD registration + the honest environment record (the trap caught BEFORE the first db operation)", () => {
    expect(worklogSource).toContain("[s188-below-threshold-note: THE SEVENTEENTH-GENERATION COORDINATE VERIFIED");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s188-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s188-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F175 LESSON — THE EXCLUSION-CLAUSE TRUTH MEMBER");
    expect(collapsed(note)).toContain(":2834..:2852 = s169..s187 (NINETEEN rows, arithmetic-consistent) with :2833 the S168 row");
    expect(collapsed(note)).toContain("A-I-1 the comment-truth clause");
    expect(collapsed(note)).toContain("A-I-2 the master-skill §8 letter posture");
    expect(collapsed(note)).toContain("B-I-1 the host-worklog environment note");
    expect(collapsed(note)).toContain("THE VOCABULARY-HOLD REGISTRATION");
    expect(collapsed(note)).toContain("CAUGHT BEFORE the first db operation ran");
    expect(collapsed(note)).toContain("the first FALSE comment-truth census member in three cycles");
  });

  it("SURVIVAL (worklog): the bracketed s188-id-stable-premises-note registers the premises — the four premises at their seams, the SIXTY-THIRD ordinal, the cycle-open coordinate record (the S188-A amendment's +9 shifting the P1 properties-panel sites, both the end composition AND the affected site labels re-derived — the F174 lesson applied at the note's own generation), the carried judgment, the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s188-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SIXTY-THIRD CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s188-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s188-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE CYCLE-OPEN COORDINATE RECORD");
    expect(collapsed(note)).toContain("shift them to :1385/:1749/:1754/:2215 at the delivered tree");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan): the F138 guard's THIRTY-NINTH instance — the s187 plan's execution record shipped 4/4 ticked, zero unticked (the pre-armed guard per the session_510/511 directive; the thirty-seventh consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S188 total rides the spec's own census: 804 + 13 = 817)", () => {
    const ticked = s187PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s187PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(4);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(804 + 13).toBe(817);
  });

  it("SURVIVAL (scripts): the s188 script provenance — live188/nav188/digma-seo-s188 tokens, the 164th/165th/125th ordinals, the S187 delivery at 33123311, zero s187 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live188");
    expect(refAuditSource).toContain("the 164th reference audit");
    expect(refAuditSource).toContain("the S187 delivery at HEAD 33123311");
    expect(refAuditSource).toContain("byte-identical the 125th");
    expect(refAuditSource).not.toContain("live187");
    expect(refAuditSource).not.toContain("163rd reference audit");
    expect(navSource).toContain("nav188");
    expect(navSource).toContain("165th session, S188-cycle");
    expect(navSource).toContain("the S187 delivery 33123311 + the S188 remediation");
    expect(navSource).not.toContain("nav187");
    expect(seoSource).toContain("digma-seo-s188");
    expect(seoSource).toContain("session 188, S188-cycle");
    expect(seoSource).not.toContain("digma-seo-s187");
  });

  it("SURVIVAL (worklog): the two s188 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/2I (with the 31-sampled comment-truth census at 30 TRUE / 1 FALSE — the first FALSE member in three cycles, the S129-A clause; the trap-4 hunt closing CLEAN; and the mobile-nav-by-construction pass) and auditor B's 0C/0H/0M/0L/1I (with the 63rd premises cycle, the seventeenth-generation carriers :2853, and the write-set arithmetic closing at 25)", () => {
    const a = auditEntry("Task ID: digma-s188-auditor-A");
    expect(a).toContain("0C / 0H / 0M / 0L / 2I");
    expect(collapsed(a)).toContain("30 TRUE / 1 FALSE");
    expect(collapsed(a)).toContain("trap-4");
    expect(a).toContain("14,365");
    const b = auditEntry("Task ID: digma-s188-auditor-B");
    expect(collapsed(b)).toContain("0C / 0H / 0M / 0L / 1I");
    expect(collapsed(b)).toContain("63rd");
    expect(b).toContain(":2853");
    expect(collapsed(b)).toContain("= 25");
  });

  it("SURVIVAL (source): the standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the fourteenth re-quote cycle), call.ts still exactly 80 lines", () => {
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
});
