import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-184 spec (the one-hundred-and-thirty-second audit's chosen
// work — the FOURTH consecutive same-vocabulary cycle under
// skills/web-application/SKILL.md v1.1.0: 0C/0H/0M/2L/6I combined, the
// first Low-severity members since S181, both surfaced by measurement
// depth rather than vocabulary change):
//
// S184-A — THE OTP APPEND-INTO-FILLED-CELL GUARD (A-L-1): the S160-D
//   autofill-distribution branch was un-scoped — ANY multi-char value
//   rebuilt the code from cell 0, so clicking an already-filled middle
//   cell and typing one char WIPED the other cells; the branch is now
//   scoped to input[0] (the only autoComplete="one-time-code" field),
//   the append path falling to the slice(-1) form that lands the digit
//   in the typed cell.
//
// S184-B — THE RENDERED-OUTPUT REMEDIATION (A-L-2, the §12 trap-5 +
//   trap-3 contract, the F171 evidence form): the --shadow-sm token
//   pinned to the v3 geometry (the installed tailwindcss@4.3.3
//   theme.css carries --shadow-sm byte-identical to --shadow — the v3
//   DEFAULT, one notch heavier than the v3 sm the shadcn chrome was
//   designed against) + the brand-gradient family converted to inline
//   sRGB linear-gradient() styles (the 160th reference audit's
//   hero-banner midzone sampled 4x closer to sRGB than oklab: dist 101
//   vs 405 — the reference renders the sRGB family, the utilities
//   interpolate oklab); the teams chip KEEPS the bg-gradient-to-r class
//   as the e2e query hook; the neutral washes stay on the utilities.
//
// S184-C — THE COMMENT-TRUTH REPAIR (A-I-3): the properties-panel
//   stale session-62 "Single-pointer-safe" rationale annotated
//   superseded by the S123-C/S125-B/S126-B multi-touch token guards
//   (the zero-false direction broke its eight-cycle streak on this
//   member — repaired in-cycle).
//
// S184-D — THE REGISTRATIONS: the bracketed s184-id-stable-premises-
//   note (the 58th consecutive cycle, the layers-panel retype
//   coordinate CORRECTED to :39 per B-I-2 — the F170 family's
//   coordinate member) + the bracketed s184-below-threshold-note (the
//   thirteenth-generation coordinate VERIFIED at every figure — the
//   corrected arithmetic's second application + the F171 LESSON: a
//   posture claim about RENDERED output is verified against the
//   reference's rendered pixels, never against the source classes'
//   letter alone + the FOURTEENTH generation pre-registered at the
//   MEASURED post-collateral coordinates, never a +2 forecast + the
//   B-I-1 write-path rethrow-tail and B-I-3 e2e-annotation
//   registrations + the postures).
//
// S184-E — THE PER-SESSION PIN FAMILY: 17 pins — 11 RED (the three
//   code remediations' source contracts + the doc-side collateral
//   members) / 6 green-at-birth (the two worklog-registration
//   members, the F138 guard's THIRTY-FIFTH instance — the s183 plan's
//   record pinned 5/5 ticked at c36ac470, the script-provenance
//   member, the audit-entry member, the source-survival member) — the
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
const s183PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session183.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s184.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s184.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s184.sh"),
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
const cssSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/globals.css"),
  "utf8",
);
const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);
const dashboardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/dashboard-view.tsx"),
  "utf8",
);
const teamsSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/teams-view.tsx"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2545 delivery checks + this
 *  spec's 17 = 2562 unit, the 245 delivery files + this spec = 246;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s184 lesson). */
const UNIT = "2637";
const FILES = "252";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:" prefix
 *  rides the slice; the census lines ride kilobytes past the anchor).
 *  The s184 pair is scoped AFTER the s184-below-threshold-note — the
 *  s183 cycle's transplanted auditors ride the same 3-a/3-b Task-ID
 *  anchors, so a naive first-occurrence lookup finds the WRONG era
 *  (the anchor-collision class, caught at the RED birth). */
const auditEntry = (anchor: string) => {
  const scope = worklogSource.indexOf("[s184-below-threshold-note:");
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
 *  F170 lesson mechanized — plus the F171 extension: this cycle's
 *  historically-moving members pinned by name so the family's own
 *  members can never silently drift inside a verified total). */
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
  const handSum = Object.values(perFile).reduce((a, b) => a + b, 0);
  return { total, perFile, handSum };
})();

// ---------------------------------------------------------------------------
// S184-A — the OTP append-into-filled-cell guard (RED until the fix lands)
// ---------------------------------------------------------------------------

describe("S184-A the OTP append-into-filled-cell guard (A-L-1 — the S160-D distribution branch scoped to input[0], the only one-time-code autofill target; the append-into-a-filled-cell path falls to slice(-1) landing the digit in the typed cell)", () => {
  it("DEFECT (source): the distribution branch is scoped to index === 0 — the one-time-code autoComplete rides input[0] alone, and the un-scoped form is GONE", () => {
    // The scoped guard (the S184-A form).
    expect(loginSource).toContain("if (index === 0 && cleaned.length > 1) {");
    // The un-scoped S160-D form is GONE.
    expect(loginSource).not.toMatch(/^    if \(cleaned\.length > 1\) \{$/m);
    // The one-time-code autoComplete rides input[0] alone (the scoping's
    // own premise, pinned at its seam).
    expect(loginSource).toContain(
      'autoComplete={index === 0 ? "one-time-code" : "off"}',
    );
    // The S184-A registration comment at the seam (the collapsed form
    // tolerates the comment-marker line break).
    expect(collapsed(loginSource)).toContain(
      "Session 184 (S184-A / A-L-1): the distribution branch is",
    );
    expect(collapsed(loginSource)).toContain("SCOPED to input[0]");
  });

  it("DEFECT (source): the append path keeps the slice(-1) landing form (a multi-char value at any non-zero cell takes the LAST digit into the TYPED cell — the pre-S160-D behavior restored for the append case)", () => {
    // The slice(-1) form still serves the append path after the scoped
    // branch (the fall-through semantics: non-zero-index multi-char
    // values reach this line).
    const at = loginSource.indexOf("const digit = cleaned.slice(-1);");
    expect(at).toBeGreaterThan(-1);
    const scopedAt = loginSource.indexOf(
      "if (index === 0 && cleaned.length > 1) {",
    );
    expect(scopedAt).toBeGreaterThan(-1);
    expect(at).toBeGreaterThan(scopedAt);
  });
});

// ---------------------------------------------------------------------------
// S184-B — the rendered-output remediation (RED until the fixes land)
// ---------------------------------------------------------------------------

describe("S184-B the rendered-output remediation (A-L-2 — the §12 trap-5 shadow pin + the trap-3 brand-gradient family onto inline sRGB linear-gradient() styles; the reference's interpolation family verified against its rendered pixels, the F171 evidence form)", () => {
  it("DEFECT (source): the --shadow-sm token pinned to the v3 geometry in @theme (the installed v4 theme.css carries --shadow-sm byte-identical to --shadow — the v3 DEFAULT, one notch heavier than the v3 sm the shadcn chrome was designed against)", () => {
    expect(cssSource).toContain("--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);");
    // The trap-5 registration comment at the pin.
    expect(collapsed(cssSource)).toContain("S184-B / A-L-2 — the §12 trap-5 pin");
  });

  it("DEFECT (source): the brand-gradient family renders sRGB — the hero banner's inline linear-gradient with the pinned v3 stop hexes, the CTA buttons on the .brand-cta-gradient custom class with the v3 hover stops, and the branded utility strings GONE from the converted surfaces", () => {
    // The hero banner: the inline sRGB form (the pinned stop hexes).
    expect(dashboardSource).toContain(
      'style={{ background: "linear-gradient(90deg, var(--color-purple-600), var(--color-pink-600), var(--color-blue-600))" }}',
    );
    // The un-converted hero utility string is GONE.
    expect(dashboardSource).not.toContain(
      "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600",
    );
    // The CTA button family: the custom class + the v3 hover stops.
    expect(cssSource).toContain(".brand-cta-gradient {");
    expect(cssSource).toContain(
      "background: linear-gradient(90deg, var(--color-purple-600), var(--color-pink-600));",
    );
    expect(cssSource).toContain(
      "background: linear-gradient(90deg, var(--color-purple-700), var(--color-pink-700));",
    );
    expect(dashboardSource).toContain('"brand-cta-gradient h-10 rounded-lg');
    // The empty-state and stat icons render inline sRGB.
    expect(dashboardSource).toContain(
      'style={{ background: "linear-gradient(90deg, var(--color-yellow-400), var(--color-orange-500))" }}',
    );
    expect(dashboardSource).toContain(
      'style={{ background: "linear-gradient(90deg, var(--color-purple-500), var(--color-pink-500))" }}',
    );
    // The trap-3 registration comment at the custom class.
    expect(collapsed(cssSource)).toContain(
      "S184-B / A-L-2 — the §12 trap-3 brand-gradient",
    );
  });

  it("DEFECT (source): the teams chip keeps the bg-gradient-to-r class as the e2e query hook (parity.spec :657) while the inline style owns the paint — and the branded avatar/title surfaces render inline sRGB", () => {
    // The teams chip: the class hook KEPT + the inline paint.
    expect(teamsSource).toContain(
      'rounded-xl bg-gradient-to-r" style={{ background: "linear-gradient(90deg, var(--color-blue-500), var(--color-purple-600))" }}',
    );
    // The stop utilities are GONE from the chip (the class hook carries
    // no from-/to- members).
    expect(teamsSource).not.toContain("from-blue-500 to-purple-600");
    // The dialog-title text gradient: inline sRGB + the clip utilities.
    expect(teamsSource).toContain(
      'style={{ background: "linear-gradient(90deg, var(--color-purple-600), var(--color-pink-600))" }}',
    );
    expect(teamsSource).not.toContain("from-purple-600 to-pink-600");
    // The e2e-hook registration comment at the chip.
    expect(collapsed(teamsSource)).toContain(
      "the bg-gradient-to-r class KEPT as the e2e query hook",
    );
  });
});

// ---------------------------------------------------------------------------
// S184-C — the comment-truth repair (RED until the annotation lands)
// ---------------------------------------------------------------------------

describe("S184-C the comment-truth repair (A-I-3 — the properties-panel stale session-62 single-pointer rationale annotated superseded by the S123-C/S125-B/S126-B multi-touch token guards)", () => {
  it("DEFECT (source): the stale clause carries the superseded annotation naming the multi-touch token guards as the actual safety mechanism", () => {
    expect(collapsed(panelSource)).toContain(
      "Session 184, S184-C / A-I-3 — the comment-truth repair",
    );
    expect(collapsed(panelSource)).toContain(
      "superseded by the S123-C/S125-B/S126-B multi-touch token guards",
    );
  });
});

// ---------------------------------------------------------------------------
// S184-D — the registrations (the below-threshold + premises notes)
// ---------------------------------------------------------------------------

describe("S184-D the registrations (a rendered-output posture claim is verified against the reference's rendered pixels — the F171 lesson; a pre-registration's coordinates derive from the MEASURED post-collateral tree when the delivery's insertion count exceeds two — the F169/F170 family's measured form)", () => {
  it("SURVIVAL (worklog): the bracketed s184-below-threshold-note registers the thirteenth-generation verification + the F171 rendered-output evidence lesson + the fourteenth pre-registered at the MEASURED post-collateral coordinates", () => {
    const at = worklogSource.indexOf("[s184-below-threshold-note:");
    expect(at).toBeGreaterThan(-1);
    const note = worklogSource.slice(at, at + 16000);
    // The thirteenth-generation verification (the corrected
    // arithmetic's second application).
    expect(collapsed(note)).toContain(
      "THE FROZEN-RECORD COORDINATE THIRTEENTH GENERATION",
    );
    expect(collapsed(note)).toContain(":2845");
    expect(collapsed(note)).toContain(":2904");
    expect(collapsed(note)).toContain(":2973");
    expect(collapsed(note)).toContain(":2831..:2844");
    // The F171 lesson.
    expect(collapsed(note)).toContain("F171");
    expect(collapsed(note)).toContain(
      "verified against the REFERENCE'S RENDERED PIXELS",
    );
    // The fourteenth generation: the MEASURED form.
    expect(collapsed(note)).toContain("MEASURED POST-COLLATERAL COORDINATES");
  });

  it("SURVIVAL (worklog): the bracketed s184-id-stable-premises-note registers the premises — the four premises at their seams, the FIFTY-EIGHTH ordinal, the :39 coordinate correction, the carried judgment, the premises-pinning doctrine", () => {
    const at = worklogSource.indexOf("[s184-id-stable-premises-note:");
    expect(at).toBeGreaterThan(-1);
    const note = worklogSource.slice(at, at + 8000);
    expect(collapsed(note)).toContain("FIFTY-EIGHTH CONSECUTIVE CYCLE");
    expect(collapsed(note)).toContain("P1");
    expect(collapsed(note)).toContain("P2");
    expect(collapsed(note)).toContain("P3");
    expect(collapsed(note)).toContain("P4");
    // The B-I-2 coordinate correction (the F170 family's coordinate
    // member).
    expect(collapsed(note)).toContain("THE S134-B REGISTRATION TEXT AT :39");
    expect(collapsed(note)).toContain("The premises-pinning doctrine");
  });
});

// ---------------------------------------------------------------------------
// The F138 guard + the script provenance + the audit entries + the
// source survival (green at birth)
// ---------------------------------------------------------------------------

describe("the standing guards (green at birth — the records they pin shipped with the S183 delivery)", () => {
  it("SURVIVAL (plan): the F138 guard's THIRTY-FIFTH instance — the s183 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_487/488 directive; the thirty-third consecutive cycle of the forward form) + the pin-family arithmetic (the S128..S184 total rides the spec's own census: 749 + 17 = 766)", () => {
    // The s183 plan's execution record, read live: every box ticked.
    const ticked = s183PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s183PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
    // The pin-family arithmetic (the S128..S184 total rides the spec's
    // own census: 749 + 17 = 766).
    expect(749 + 17).toBe(766);
  });

  it("SURVIVAL (scripts): the s184 script provenance — live184/nav184/digma-seo-s184 tokens, the 160th/161st/121st ordinals, the S183 delivery at c36ac470, zero s183 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live184");
    expect(refAuditSource).toContain("160th reference audit");
    expect(refAuditSource).toContain("the S183 delivery at HEAD c36ac470");
    expect(refAuditSource).toContain("byte-identical the 121st");
    expect(navSource).toContain("nav184");
    expect(navSource).toContain("161st session");
    expect(navSource).toContain("the S183 delivery c36ac470");
    expect(seoSource).toContain("digma-seo-s184");
    expect(seoSource).toContain("session 184");
    // Zero s183 run-ordinal residue (the F89 evidence-truth family).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live183");
      expect(src).not.toContain("nav183");
      expect(src).not.toContain("the 159th");
      expect(src).not.toContain("80303e97");
    }
  });

  it("SURVIVAL (worklog): the two s184 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0/0/0/2L/3I (with the 26-sampled comment-truth census at 25 TRUE / 1 FALSE, the mobile-nav-by-construction pass, and the A-L-1/A-L-2 members) and auditor B's 0C/0H/0M/0L/3I (with the 58th premises cycle, the thirteenth-generation coordinates :2845/:2904/:2973, and the write-set arithmetic closing at 25)", () => {
    const a = auditEntry("Task ID: 3-a");
    expect(a).toContain("0C / 0H / 0M / 2L / 3I");
    expect(a).toContain("L-1 the OTP append-into-filled-cell regression");
    expect(a).toContain("L-2 the §12 trap-3/trap-5 mitigations absent");
    expect(a).toContain("26 sampled, 25 TRUE");
    const b = auditEntry("Task ID: 3-b");
    expect(b).toContain("0C / 0H / 0M / 0L / 3I");
    expect(b).toContain("ALL 18 EXACT");
    expect(b).toContain("2,461");
    expect(b).toContain("58TH CONSECUTIVE CYCLE");
    expect(b).toContain("THIRTEENTH-GENERATION PAD COORDINATES VERIFIED EXACT");
    expect(b).toContain(":2845");
    expect(b).toContain(":2904");
    expect(b).toContain(":2973");
  });

  it("SURVIVAL (source): the post-remediation tree's measured figures — the layer total MOVING to 14,359 derived LIVE with the PER-FILE probe closing (the F170/F171 member mechanized: this cycle's moving members pinned by name — login-screen and globals.css), the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the ninth re-quote cycle pre-armed), call.ts still exactly 80 lines, and the env census's +1 attribution (the S181-C gate's own NODE_ENV read in auth.ts)", () => {
    // The layer MOVES: 14,313 -> 14,359 (the first movement since
    // S181, the F40 rider engaging, a deliberate remediation never
    // drift) — derived live, never quoted.
    expect(liveLayerTotal).toBe(14373);
    // The F170/F171 per-file probe: the family sums against the total
    // and this cycle's moving members are pinned by name.
    const layerHandSum = Object.values(liveLayerPerFile).reduce(
      (a, b) => a + b,
      0,
    );
    expect(layerHandSum).toBe(liveLayerTotal);
    expect(liveLayerPerFile["src/components/login-screen.tsx"]).toBe(747);
    expect(liveLayerPerFile["src/app/globals.css"]).toBe(300);
    expect(liveLayerPerFile["src/components/editor/editor-view.tsx"]).toBe(2453);
    expect(liveLayerPerFile["src/components/editor/editor-store.ts"]).toBe(847);
    // The routes STAY: 2,461 — derived live with the probe.
    expect(liveRouteFigures.total).toBe(2461);
    expect(liveRouteFigures.handSum).toBe(liveRouteFigures.total);
    expect(liveRouteFigures.perFile["src/app/api/auth/forgot-password/route.ts"]).toBe(138);
    expect(liveRouteFigures.perFile["src/app/api/auth/reset-password/route.ts"]).toBe(130);
    expect(liveRouteFigures.perFile["src/app/api/projects/[id]/elements/route.ts"]).toBe(420);
    const root = path.resolve(import.meta.dirname, "..");
    const call = execSync("wc -l src/lib/call.ts", {
      cwd: root,
      encoding: "utf8",
    });
    expect(Number(call.trim().split(/\s+/)[0])).toBe(80);
    // The env census's +1 attribution: the S181-C production gate is
    // auth.ts's own fourth process.env site (17 sites across 9 vars).
    const authSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/lib/auth.ts"),
      "utf8",
    );
    expect(authSource).toMatch(/process\.env\.NODE_ENV === "production"/);
    expect(authSource.match(/process\.env/g)?.length ?? 0).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// S184-E — the collateral members (RED until the docs land)
// ---------------------------------------------------------------------------

describe("S184-E the per-session collateral (the doc-side members — RED until the collateral script lands them)", () => {
  it("DEFECT (docs): the AGENTS session-184 bullet carries the completion members — the per-auditor census lines, the fourth-consecutive same-vocabulary hold, the A-L-1/A-L-2 remediations with the F171 lesson, and the layer MOVING 14,313 -> 14,359", () => {
    expect(collapsed(agentsSource)).toContain("session 184");
    expect(collapsed(agentsSource)).toContain("A-L-1");
    expect(collapsed(agentsSource)).toContain("A-L-2");
    expect(collapsed(agentsSource)).toContain("F171");
    expect(collapsed(agentsSource)).toContain("14,359");
  });

  it("DEFECT (docs): the count re-anchor — the v1.163.0 chain entry carries the S184 derivation (2562 = 2545 + 17 unit / 246 files) + the §7.1 row for the s184 spec, the layer-total family MOVING 14,313 -> 14,359 (the first movement since S181, the F40 rider) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    const chain = padSource.match(
      /v1\.163\.0[\s\S]{0,6000}?2562 = 2545 \+ 17 unit \/ 246 files/,
    );
    expect(chain).not.toBeNull();
    const unitRow = padSource.split("\n").find((l) => l.includes("**Unit total**")) ?? "";
    expect(unitRow).toContain(UNIT);
    expect(unitRow).toContain(FILES);
    const checkRow = padSource.split("\n").find((l) => l.startsWith("- [ ] `bun run test` →")) ?? "";
    expect(checkRow).toContain(`${UNIT}/${UNIT}`);
    const cmdRow = padSource
      .split("\n")
      .find((l) => l.includes("| `bun run test` / `bun run test:watch` |")) ?? "";
    expect(cmdRow).toContain(`${UNIT} checks`);
    expect(cmdRow).toContain(`${FILES} files`);
    // The §7.1 row for the s184 spec (the fourteenth-generation
    // carriers shift with this delivery's insertions — the MEASURED
    // form pre-registered in the s184-below-threshold-note).
    expect(padSource).toMatch(/lows-s184\.test\.ts/);
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.163.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(
      /^# Digma — Master Project Architecture Document \(PAD\) v1\.169\.0$/m,
    );
    const lastUpdated =
      padSource.split("\n").find((l) => l.startsWith("**Last Updated:**")) ?? "";
    expect(lastUpdated).toContain("v1.169.0");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.162.0 + the F171 rendered-output evidence lesson (a posture claim about rendered output is verified against the reference's rendered pixels, never against the source classes' letter alone) + the globals.css line-count claim re-anchored onto the live count (300)", () => {
    const versionLine = skillSource.split("\n").find((l) => l.startsWith("version:")) ?? "";
    expect(versionLine).toContain("1.168.0");
    expect(collapsed(skillSource)).toContain("F171");
    expect(skillSource).toMatch(/src\/app\/globals\.css` \(300 lines\)/);
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s183 + s182 pair as the standing witnesses) + the anchored declaration census pins 65 UNIT / 64 FILES", () => {
    // The s183 spec's constants, re-anchored onto this cycle's figures.
    const s183Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s183.test.ts"),
      "utf8",
    );
    const s183Unit = s183Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s183Files = s183Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s183Unit).toBe(UNIT);
    expect(s183Files).toBe(FILES);
    // And the s182 spec's constants ride the same figures.
    const s182Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s182.test.ts"),
      "utf8",
    );
    const s182Unit = s182Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s182Files = s182Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s182Unit).toBe(UNIT);
    expect(s182Files).toBe(FILES);
    // The anchored declaration census (the declaration lines start at
    // column 0 — the anchored pattern excludes matcher/template noise).
    const root = path.resolve(import.meta.dirname, "..");
    const unitOut = execSync(
      `grep -rhE '^const UNIT = "[0-9]+";$' tests/ --include="*.test.ts" | sort | uniq -c`,
      { cwd: root, encoding: "utf8" },
    );
    expect(unitOut.trim()).toBe(`71 const UNIT = "${UNIT}";`);
    const filesOut = execSync(
      `grep -rhE '^const FILES = "[0-9]+";$' tests/ --include="*.test.ts" | sort | uniq -c`,
      { cwd: root, encoding: "utf8" },
    );
    expect(filesOut.trim()).toBe(`70 const FILES = "${FILES}";`);
  });
});
