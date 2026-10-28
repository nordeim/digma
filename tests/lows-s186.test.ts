import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-186 spec (the one-hundred-and-thirty-fourth audit's chosen
// work — the SIXTH consecutive same-vocabulary cycle under
// skills/web-application/SKILL.md v1.1.0: 0C/0H/0M/1L/6I combined, the
// third consecutive cycle with Low-severity members, again surfaced by
// measurement depth):
//
// S186-A — THE TRAP-4 SUBTRACTIVE REPAIR (A-L-1, the §12 trap-4
//   subtractive member, the F173 copied-composition lesson): the
//   minimal-card back-link's v3-born -mb-2 (login-screen.tsx:314)
//   composed with the LATER sibling's space-y margin under v3
//   (24-8=16px mobile / 32-8=24px sm+) but REPLACES v4's :where()
//   margin-block-end (specificity (0,1,0) over (0,0,0)) — an 8px
//   overlap on the signup/forgot/verify states since the minimal
//   card's birth. Mirrored per the skill's own §12 form: the -mb-2
//   dropped, the explicit -mt-2 riding the header wrapper (the LATER
//   child) in the minimal-conditional form; the e2e locator retired
//   with the class + the geometry pin added (24px on the 1280px
//   viewport).
//
// S186-B — THE REGISTRATIONS: the bracketed s186-id-stable-premises-
//   note (the 60th consecutive cycle, the P2 member's FILE LABEL
//   CORRECTED to editor-view.tsx:413-419 per B-I-1 — the F170
//   family's file-label member, the cycle after the line-label
//   member) + the bracketed s186-below-threshold-note (the
//   fifteenth-generation carriers :2849/:2908/:2977 verified EXACT —
//   the corrected arithmetic's FOURTH application + THE F173 LESSON:
//   THE COPIED-COMPOSITION TRUTH MEMBER (a class composition measured
//   from a reference rendered by a DIFFERENT engine version is itself
//   a rendering claim about the target's engine — the composition
//   re-derived under the target's own cascade law before shipping) +
//   the A-I-4 coordinate correction (the S184-A guard at :246) + the
//   A-I-1 scope-precision note + the SIXTEENTH generation pre-
//   registered at the MEASURED post-collateral coordinates + the
//   postures + the same-vocabulary SIXTH + the honest environment
//   record).
//
// S186-C — THE PER-SESSION PIN FAMILY: 14 pins — 8 RED (the trap-4
//   source contract + the e2e rider + the doc-side collateral
//   members) / 6 green-at-birth (the two worklog-registration
//   members, the F138 guard's THIRTY-SEVENTH instance — the s185
//   plan's record pinned 5/5 ticked at d8e29f63, the
//   script-provenance member, the audit-entry member, the
//   source-survival member, the source-standing member) — the MEASURED
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
const s185PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session185.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s186.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s186.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s186.sh"),
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

const loginSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/login-screen.tsx"),
  "utf8",
);

const e2eAuthSource = readFileSync(
  path.resolve(import.meta.dirname, "../tests/e2e/auth.spec.ts"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2574 delivery checks + this
 *  spec's 14 = 2588 unit, the 247 delivery files + this spec = 248;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s186 lesson). */
const UNIT = "2709";
const FILES = "258";

/** The MEASURED post-fix layer figures (the s159 measured form — the
 *  receipt comment's own lines carried in the count: login-screen
 *  741 + 6 = 747, the layer 14,359 + 6 = 14,365; corrected at birth
 *  if the measured tree disagrees). */
const LAYER_TOTAL = 14373;
const LOGIN_LINES = 747;

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:"
 *  prefix rides the slice; the census lines ride kilobytes past the
 *  anchor). The s186 pair carries the FULL unique anchor form
 *  (digma-s186-3-a / digma-s186-3-b) and the scoping discipline
 *  holds: scoped AFTER the s186-below-threshold-note. */
const auditEntry = (anchor: string) => {
  const scope = worklogSource.indexOf("[s186-below-threshold-note:");
  if (scope === -1) return "";
  const at = worklogSource.indexOf(anchor, scope);
  if (at === -1) return "";
  const lineStart = worklogSource.lastIndexOf("\n", at) + 1;
  const end = worklogSource.indexOf("\n---\n", at);
  return worklogSource.slice(lineStart, end === -1 ? at + 16000 : end);
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

describe("lows-s186: the trap-4 subtractive repair + the copied-composition registrations", () => {
  it("DEFECT (source): the S186-A composition mirror — the v3-born -mb-2 GONE from login-screen.tsx at every CLASS site (the file's only class-site occurrence was the minimal back-link; the receipt comment's historical mention the sanctioned F172 exclusion), the explicit -mt-2 riding the header wrapper (the LATER child) in the minimal-conditional template-literal form, and the receipt comment carrying the §12 trap-4 subtractive + F173 attribution (A-L-1)", () => {
    // the comment-excluding class-site census (the F172 form — the
    // receipt's historical mention is not a class site):
    const classSites = loginSource
      .split("\n")
      .filter((ln) => /className=.*-mb-2/.test(ln));
    expect(classSites).toHaveLength(0);
    expect(loginSource).toContain(
      'space-y-2 sm:space-y-3${minimal ? " -mt-2" : ""}',
    );
    // the receipt comment (the F172 receipt-count family's form —
    // the fix's own documentation a claim about the tree):
    expect(collapsed(loginSource)).toContain("the §12 trap-4 subtractive");
    expect(collapsed(loginSource)).toContain("F173");
    expect(collapsed(loginSource)).toContain(
      "the explicit -mt-2 rides the header wrapper below, minimal-only",
    );
  });

  it("DEFECT (e2e): the auth.spec rider — the button.-mb-2 locator RETIRED with the class (the honest getByRole count(1) one-button form on the sent state) + the S186-A geometry pin present in the signup minimal-state test (the computed back-link→header gap asserted at 24px on the 1280px viewport — the class family no longer geometrically unpinned; assertions only, the e2e count STAYING at 262)", () => {
    expect(e2eAuthSource).not.toContain('button.-mb-2');
    expect(e2eAuthSource).toContain(
      'getByRole("button", { name: "Back to sign in" })',
    );
    expect(e2eAuthSource).toContain("backLinkGap");
    expect(e2eAuthSource).toContain("expect(backLinkGap).toBe(24)");
  });

  it("DEFECT (docs): the AGENTS session-186 bullet carries the completion members — the per-auditor census lines, the sixth-consecutive same-vocabulary hold, the A-L-1 trap-4 remediation with the F173 lesson, and the layer MOVING to the measured figure (the F40 rider engaging, a deliberate remediation never drift)", () => {
    expect(collapsed(agentsSource)).toContain("session 186, S186-A..S186-C");
    expect(collapsed(agentsSource)).toContain("A 0C/0H/0M/1L/4I + B 0C/0H/0M/0L/2I");
    expect(collapsed(agentsSource)).toContain("SIXTH consecutive same-vocabulary cycle");
    expect(collapsed(agentsSource)).toContain("the F173 copied-composition truth lesson");
    expect(collapsed(agentsSource)).toContain("MOVING at 14,365");
  });

  it("DEFECT (docs): the count re-anchor — the v1.165.0 chain entry carries the S186 derivation (2588 = 2574 + 14 unit / 248 files) + the §7.1 row for the s186 spec, the layer-total family MOVING at 14,365 (the F40 rider engaging) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    expect(collapsed(padSource)).toContain("2588 = 2574 + 14 unit / 248 files");
    expect(padSource).toContain("lows-s186.test.ts");
    expect(collapsed(padSource)).toContain("the layer-total family MOVING at 14,365");
    expect(collapsed(padSource)).toContain("the route figure STAYING at 2,461");
    expect(padSource).toContain("| **Unit total** | **258 files** | **2709** | | Vitest |");
    expect(padSource).toContain("- [ ] `bun run test` → 2709/2709");
    expect(padSource).toContain(
      "| `bun run test` / `bun run test:watch` | repo root | unit tests (2709 checks / 258 files) |",
    );
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.165.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(/^# Digma — Master Project Architecture Document \(PAD\) v1\.175\.0$/m);
    const lastUpdated = padSource.match(/\*\*Last Updated:\*\* .*/)?.[0] ?? "";
    expect(lastUpdated).toContain("v1.175.0");
    expect(lastUpdated).toContain("the one-hundred-and-forty-fourth audit");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.164.0 + the F173 copied-composition truth lesson (a class composition measured from a reference rendered by a DIFFERENT engine version is itself a rendering claim about the target's engine — the composition re-derived under the target's own cascade law before shipping) + the project_state re-anchored onto the live count", () => {
    expect(skillSource).toContain("version: 1.174.0");
    expect(skillSource).toContain("173. **F173");
    expect(collapsed(skillSource)).toContain("THE COPIED-COMPOSITION TRUTH MEMBER");
    expect(skillSource).toContain("2709 unit checks green");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s185 + s184 pair as the standing witnesses) + the anchored declaration census pins 67 UNIT / 66 FILES", () => {
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

  it("DEFECT (layer rider): the post-fix measured figures — the layer total at 14,365 (the F40 rider's own receipt: the +6 the S186-A receipt comment's own lines) derived LIVE with the PER-FILE probe closing, login-screen.tsx at exactly 747, globals.css STAYING at 300", () => {
    expect(liveLayerTotal).toBe(LAYER_TOTAL);
    const layerHandSum = Object.values(liveLayerPerFile).reduce(
      (a, b) => a + b,
      0,
    );
    expect(layerHandSum).toBe(liveLayerTotal);
    expect(liveLayerPerFile["src/components/login-screen.tsx"]).toBe(LOGIN_LINES);
    expect(liveLayerPerFile["src/app/globals.css"]).toBe(300);
    expect(liveLayerPerFile["src/components/editor/editor-view.tsx"]).toBe(2453);
    expect(liveLayerPerFile["src/components/editor/editor-store.ts"]).toBe(847);
  });

  it("SURVIVAL (worklog): the bracketed s186-below-threshold-note registers the fifteenth-generation verification (the carriers :2849/:2908/:2977 — the corrected arithmetic's FOURTH application) + the F173 COPIED-COMPOSITION TRUTH lesson + the A-I-4 coordinate correction + the A-I-1 scope-precision note + the sixteenth pre-registered at the MEASURED post-collateral coordinates", () => {
    expect(worklogSource).toContain("[s186-below-threshold-note: THE FIFTEENTH-GENERATION COORDINATE VERIFIED");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s186-below-threshold-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s186-below-threshold-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE F173 LESSON — THE COPIED-COMPOSITION TRUTH MEMBER");
    expect(collapsed(note)).toContain("the target's own cascade law before shipping");
    expect(collapsed(note)).toContain("the corrected arithmetic's FOURTH application");
    expect(collapsed(note)).toContain("A-I-4 the S184-A OTP guard's dispatch coordinate corrected to :246");
    expect(collapsed(note)).toContain("THE SIXTEENTH GENERATION PRE-REGISTRATION — THE MEASURED FORM");
    expect(collapsed(note)).toContain("the SIXTH consecutive");
    expect(collapsed(note)).toContain("31 TRUE / 0 FALSE");
  });

  it("SURVIVAL (worklog): the bracketed s186-id-stable-premises-note registers the premises — the four premises at their seams, the SIXTIETH ordinal, the P2 FILE-LABEL correction (the remap at editor-view.tsx:413-419, the dispatch's elements/route.ts label corrected per B-I-1), the carried judgment, the premises-pinning doctrine", () => {
    expect(worklogSource).toContain("[s186-id-stable-premises-note: THE ID-STABLE PUT DEFERRAL — THE SIXTIETH CONSECUTIVE CYCLE");
    const note = worklogSource.slice(
      worklogSource.indexOf("[s186-id-stable-premises-note:"),
      worklogSource.indexOf("]", worklogSource.indexOf("[s186-id-stable-premises-note:") + 10) + 1,
    );
    expect(collapsed(note)).toContain("THE FILE LABEL CORRECTED THIS CYCLE");
    expect(collapsed(note)).toContain("P2 the index-stable remap at editor-view.tsx:413-419");
    expect(collapsed(note)).toContain("the F170 family's FILE-LABEL member");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams at elements/route.ts:365-382");
    expect(collapsed(note)).toContain("The premises-pinning doctrine (F130, carried)");
  });

  it("SURVIVAL (plan): the F138 guard's THIRTY-SEVENTH instance — the s185 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_499/500 directive; the thirty-fifth consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S186 total rides the spec's own census: 778 + 14 = 792)", () => {
    const ticked = s185PlanSource.split("\n").filter((ln) => ln.startsWith("- [x]")).length;
    const unticked = s185PlanSource.split("\n").filter((ln) => ln.startsWith("- [ ]")).length;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
    // the pin-family arithmetic (the spec's own census closing):
    expect(778 + 14).toBe(792);
  });

  it("SURVIVAL (scripts): the s186 script provenance — live186/nav186/digma-seo-s186 tokens, the 162nd/163rd/123rd ordinals, the S185 delivery at d8e29f63, zero s185 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live186");
    expect(refAuditSource).toContain("the 162nd reference audit");
    expect(refAuditSource).toContain("the S185 delivery at HEAD d8e29f63");
    expect(refAuditSource).toContain("byte-identical the 123rd");
    expect(refAuditSource).not.toContain("live185");
    expect(refAuditSource).not.toContain("161st reference audit");
    expect(navSource).toContain("nav186");
    expect(navSource).toContain("163rd session, S186-cycle");
    expect(navSource).toContain("the S185 delivery d8e29f63 + the S186 remediation");
    expect(navSource).not.toContain("nav185");
    expect(seoSource).toContain("digma-seo-s186");
    expect(seoSource).toContain("session 186, S186-cycle");
    expect(seoSource).not.toContain("digma-seo-s185");
  });

  it("SURVIVAL (worklog): the two s186 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/1L/4I (with the 31-sampled comment-truth census at 31 TRUE / 0 FALSE, the mobile-nav-by-construction pass, and the A-L-1 trap-4 member) and auditor B's 0C/0H/0M/0L/2I (with the 60th premises cycle, the fifteenth-generation coordinates :2849/:2908/:2977, and the write-set arithmetic closing at 25)", () => {
    const a = auditEntry("Task ID: digma-s186-3-a");
    expect(a).toContain("0C/0H/0M/1L/4I");
    expect(collapsed(a)).toContain("31 TRUE / 0 FALSE");
    expect(collapsed(a)).toContain("trap-4");
    expect(a).toContain("14,359");
    const b = auditEntry("Task ID: digma-s186-3-b");
    // the s159 pin-form lesson: each entry's actual census spelling —
    // A's un-spaced "0C/0H/0M/1L/4I", B's spaced "0C / 0H / 0M / 0L / 2I".
    expect(collapsed(b)).toContain("0C / 0H / 0M / 0L / 2I");
    expect(collapsed(b)).toContain("60th");
    expect(collapsed(b)).toContain(":2849");
    expect(collapsed(b)).toContain("= 25");
  });

  it("SURVIVAL (source): the post-remediation tree's standing figures — the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the twelfth re-quote cycle pre-armed), call.ts still exactly 80 lines", () => {
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
