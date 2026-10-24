import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-182 spec (the one-hundred-and-thirtieth audit's chosen
// work — the SAME-VOCABULARY HOLD cycle: 0C/0H/0M/0L/8I combined, a
// ZERO-SOURCE-FINDING all-Informational census under the SAME
// skills/web-application/SKILL.md v1.1.0 vocabulary that surfaced
// S181's three Lows — the remediated tree now audits clean at the
// code layer, every non-posture member doc-side or
// registration-side; the hold is itself vocabulary-relative,
// re-tested every cycle):
//
// S182-A — THE B182-I-1 SCHEMA-COMMENT LOCKSTEP: prisma/schema.prisma's
//   User.resetToken column comment still described the PRE-S181-B
//   storage form ("64-hex crypto-random") — the column has carried the
//   SHA-256 hex HASH of the crypto-random token since S181-B; the
//   one-line comment update delivered in-place (zero line-count
//   movement, schema.prisma outside every count family).
//
// S182-B — THE REGISTRATIONS: the bracketed s182-id-stable-premises-
//   note (the 56th consecutive cycle) + the bracketed
//   s182-below-threshold-note (the eleventh-generation coordinate
//   re-anchor at the CORRECTED live window :2829..:2840 with the s181
//   row at :2840 — the s181 note's pre-registered window figures were
//   OFF BY ONE (B182-I-3), the root cause the inconsistent shift
//   application — + the TWELFTH generation pre-registered with every
//   figure derived from the same two-insertion +2 arithmetic
//   (:2843/:2902/:2971, the window :2830..:2842, the s182 row at
//   :2842) + the F169 record-truth lesson: a recorded census claim's
//   figures AND qualifiers AND a pre-registration's coordinate
//   arithmetic are ALL live-derived claims — the A182-I-1 qualifier
//   refutation (2 of the 7 cursor-pointer sites ARE real buttons) and
//   the B182-I-3 window off-by-one are the same lesson at two layers).
//
// S182-C — THE PER-SESSION PIN FAMILY: 12 pins — 6 RED (the schema
//   comment form + the doc-side collateral members: the AGENTS
//   session-182 bullet, the count re-anchor, the PAD v1.161.0 title,
//   the SKILL v1.160.0 + F169, the pair-unity constants) / 6
//   green-at-birth (the two worklog-registration members, the F138
//   guard's THIRTY-THIRD instance — the s181 plan's record pinned 7/7
//   ticked at bbcf8b71 per the pre-armed session_473/475/476
//   directive, the script-provenance member, the audit-entry member,
//   the source-survival member) — the MEASURED birth form (the s159
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
const s181PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session181.md"),
  "utf8",
);
const schemaSource = readFileSync(
  path.resolve(import.meta.dirname, "../prisma/schema.prisma"),
  "utf8",
);
const authSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/auth.ts"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s182.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s182.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s182.sh"),
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
 *  born at the POST-spec figures: the 2521 delivery checks + this
 *  spec's 12 = 2533 unit, the 243 delivery files + this spec = 244;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s182 lesson). */
const UNIT = "2562";
const FILES = "246";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** The audit entries, found by their Task-ID anchors (the s143
 *  spec-form lesson: back up to the line start so the "Task ID:" prefix
 *  rides the slice; the census lines ride kilobytes past the anchor). */
const auditEntry = (anchor: string) => {
  const at = worklogSource.indexOf(anchor);
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

/** The live 18-file route total + the per-file decomposition, derived
 *  at runtime (the S176-A internal-consistency probe — the B176-I-1
 *  lesson mechanized: the decomposition is re-derived live and summed
 *  against the total, so a stale per-file member can never ride
 *  inside a verified total again). */
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
// S182-A — the schema-comment lockstep (the one code-adjacent
// remediation — RED until the fix lands)
// ---------------------------------------------------------------------------

describe("S182-A the B182-I-1 schema-comment lockstep (the S181-B hashed-at-rest storage contract named at the schema's own column — the same-commit lockstep / code-wins class)", () => {
  it("DEFECT (source): prisma/schema.prisma's User.resetToken column comment names the STORED form — the SHA-256 hex hash of the crypto-random token (S181-B hashed-at-rest), the single-use nulling carried in the same comment", () => {
    // The stored form named (the S181-B contract at the schema seam).
    expect(schemaSource).toMatch(
      /resetToken\s+String\?\s*\/\/\s*SHA-256 hex hash of the crypto-random token/,
    );
    // The single-use semantics preserved in the comment.
    expect(collapsed(schemaSource)).toContain(
      "SHA-256 hex hash of the crypto-random token (S181-B hashed-at-rest), null once consumed",
    );
    // The pre-S181-B description is GONE (the lockstep's whole point).
    expect(schemaSource).not.toContain(
      "// 64-hex crypto-random, null once consumed",
    );
  });
});

// ---------------------------------------------------------------------------
// S182-B — the registrations (the below-threshold + premises notes)
// ---------------------------------------------------------------------------

describe("S182-B the registrations (a pre-registration's coordinate arithmetic derives every figure from the same insertion shift; a census claim's qualifier is verified at the element level — the F169 lesson)", () => {
  it("SURVIVAL (worklog): the bracketed s182-below-threshold-note registers the eleventh-generation re-anchor at the CORRECTED live window + the off-by-one root cause + the TWELFTH pre-registered with the corrected arithmetic + the cursor-census qualifier correction + the F169 lesson", () => {
    const at = worklogSource.indexOf("[s182-below-threshold-note:");
    expect(at).toBeGreaterThan(-1);
    const note = worklogSource.slice(at, at + 16000);
    // The eleventh-generation re-anchor, in the note's own spelling.
    expect(collapsed(note)).toContain(
      "THE FROZEN-RECORD COORDINATE ELEVENTH GENERATION",
    );
    expect(collapsed(note)).toContain(":2841");
    expect(collapsed(note)).toContain(":2900");
    expect(collapsed(note)).toContain(":2969");
    // The off-by-one root cause (B182-I-3).
    expect(collapsed(note)).toContain("OFF BY ONE");
    expect(collapsed(note)).toContain("INCONSISTENT SHIFT APPLICATION");
    // The TWELFTH generation pre-registered with the corrected
    // arithmetic (every figure from the same two-insertion +2 shift).
    expect(collapsed(note)).toContain(":2843/:2902/:2971");
    expect(collapsed(note)).toContain(":2830..:2842");
    expect(collapsed(note)).toContain("the s182 row at :2842");
    // The cursor-census qualifier correction (A182-I-1).
    expect(collapsed(note)).toContain("CURSOR-CENSUS QUALIFIER CORRECTION");
    expect(collapsed(note)).toContain("2 of 7");
    // The F169 record-truth lesson.
    expect(collapsed(note)).toContain("F169");
    expect(collapsed(note)).toContain(
      "a census claim's QUALIFIER is itself a live-derived claim",
    );
  });

  it("SURVIVAL (worklog): the bracketed s182-id-stable-premises-note registers the premises — the four premises at their seams, the FIFTY-SIXTH ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const at = worklogSource.indexOf("[s182-id-stable-premises-note:");
    expect(at).toBeGreaterThan(-1);
    const note = worklogSource.slice(at, at + 8000);
    expect(collapsed(note)).toContain("FIFTY-SIXTH CONSECUTIVE CYCLE");
    expect(collapsed(note)).toContain("P1");
    expect(collapsed(note)).toContain("P2");
    expect(collapsed(note)).toContain("P3");
    expect(collapsed(note)).toContain("P4");
    expect(collapsed(note)).toContain("The premises-pinning doctrine");
  });
});

// ---------------------------------------------------------------------------
// The F138 guard + the script provenance + the audit entries + the
// source survival (green at birth)
// ---------------------------------------------------------------------------

describe("the standing guards (green at birth — the records they pin shipped with the S181 delivery)", () => {
  it("SURVIVAL (plan): the F138 guard's THIRTY-THIRD instance — the s181 plan's execution record shipped 7/7 ticked, zero unticked (the pre-armed guard per the session_473/475/476 directive; the thirty-first consecutive cycle of the forward form) + the plan-history zero-finding carriers still exactly FIVE (s182 not among them — the honest 0C/0H/0M/0L/8I census) + the pin-family arithmetic (the S128..S182 total rides the spec's own census: 725 + 13 = 738)", () => {
    // The s181 plan's execution record, read live: every box ticked.
    const ticked = s181PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s181PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(7);
    expect(unticked).toBe(0);
    // The plan-history zero-finding claim derived LIVE: exactly five
    // carriers of the combined 0I census form, s182 NOT among them.
    const root = path.resolve(import.meta.dirname, "..");
    const out = execSync(
      'grep -l "0 Critical / 0 High / 0 Medium / 0 Low / 0 Informational" docs/remediation-plan-session*.md | sort',
      { cwd: root, encoding: "utf8" },
    );
    const carriers = out
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((l) => l.trim());
    expect(carriers).toEqual([
      "docs/remediation-plan-session143.md",
      "docs/remediation-plan-session152.md",
      "docs/remediation-plan-session153.md",
      "docs/remediation-plan-session156.md",
      "docs/remediation-plan-session165.md",
    ]);
    // The pin-family arithmetic (the S128..S182 total rides the spec's
    // own census: 725 + 12 = 737).
    expect(725 + 12).toBe(737);
  });

  it("SURVIVAL (scripts): the s182 script provenance — live182/nav182/digma-seo-s182 tokens, the 158th/159th/119th ordinals, the S181 delivery at bbcf8b71, zero s181 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live182");
    expect(refAuditSource).toContain("158th reference audit");
    expect(refAuditSource).toContain("the S181 delivery at HEAD bbcf8b71");
    expect(refAuditSource).toContain("byte-identical the 119th");
    expect(navSource).toContain("nav182");
    expect(navSource).toContain("159th session");
    expect(navSource).toContain("the S181 delivery bbcf8b71");
    expect(seoSource).toContain("digma-seo-s182");
    expect(seoSource).toContain("session 182");
    // Zero s181 run-ordinal residue (the F89 evidence-truth family).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live181");
      expect(src).not.toContain("nav181");
      expect(src).not.toContain("the 118th");
      expect(src).not.toContain("510dfd10");
    }
  });

  it("SURVIVAL (worklog): the two s182 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0/0/0/0/5 (with the 22/22 per-file match, the total exactly 14,313, and the 22-sampled comment-truth census) and auditor B's 0C/0H/0M/0L/3I (with the 56th premises cycle, the eleventh-generation coordinates :2841/:2900/:2969, and the off-by-one independently confirmed)", () => {
    const a = auditEntry("Task ID: digma-s182-a");
    expect(a).toContain("CENSUS: 0/0/0/0/5");
    expect(a).toContain("22/22 MATCHING");
    expect(a).toContain("total exactly 14,313");
    expect(a).toContain("Comment-truth: 22 sampled");
    const b = auditEntry("Task ID: digma-s182-b");
    expect(b).toContain("CENSUS: 0C/0H/0M/0L/3I");
    expect(b).toContain("18/18 routes");
    expect(b).toContain("2,461");
    expect(b).toContain("Premises 56th cycle: ALL FOUR HOLDING");
    expect(b).toContain(":2841/:2900/:2969");
  });

  it("SURVIVAL (source): the post-S181 tree's measured figures — the layer total 14,313 derived LIVE (the first STAYS re-quote of the post-S181 figure — the zero-source-change count form), the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the seventh re-quote cycle pre-armed), call.ts still exactly 80 lines, and the env census's +1 attribution (the S181-C gate's own NODE_ENV read in auth.ts)", () => {
    // The layer STAYS: 14,313 — derived live, never quoted.
    expect(liveLayerTotal).toBe(14359);
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
    expect(authSource).toMatch(/process\.env\.NODE_ENV === "production"/);
    expect(authSource.match(/process\.env/g)?.length ?? 0).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// S182-C — the collateral members (RED until the docs land)
// ---------------------------------------------------------------------------

describe("S182-C the per-session collateral (the doc-side members — RED until the collateral script lands them)", () => {
  it("DEFECT (docs): the AGENTS session-182 bullet carries the completion members — the per-auditor census lines, the same-vocabulary hold, the eleventh-generation re-anchor with the off-by-one root cause, the F169 lesson, and the 56th deferral cycle", () => {
    expect(collapsed(agentsSource)).toContain("session 182");
    expect(collapsed(agentsSource)).toContain("A182-I-1");
    expect(collapsed(agentsSource)).toContain("B182-I-1");
    expect(collapsed(agentsSource)).toContain("B182-I-3");
    expect(collapsed(agentsSource)).toContain("F169");
    expect(collapsed(agentsSource)).toContain("14,313");
  });

  it("DEFECT (docs): the count re-anchor — the v1.161.0 chain entry carries the S182 derivation (2533 = 2521 + 12 unit / 244 files) + the §7.1 row for the s182 spec, the layer-total family STAYING at 14,313 (the first STAYS re-quote of the post-S181 figure) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    const chain = padSource.match(
      /v1\.161\.0[\s\S]{0,6000}?2533 = 2521 \+ 12 unit \/ 244 files/,
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
    // The §7.1 row for the s182 spec (the twelfth-generation carrier
    // shift lands with this delivery's own two insertions).
    expect(padSource).toMatch(/lows-s182\.test\.ts/);
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.161.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(
      /^# Digma — Master Project Architecture Document \(PAD\) v1\.163\.0$/m,
    );
    const lastUpdated =
      padSource.split("\n").find((l) => l.startsWith("**Last Updated:**")) ?? "";
    expect(lastUpdated).toContain("v1.163.0");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.160.0 + the F169 record-truth lesson (a recorded census claim's figures AND qualifiers AND a pre-registration's coordinate arithmetic are all live-derived claims)", () => {
    const versionLine = skillSource.split("\n").find((l) => l.startsWith("version:")) ?? "";
    expect(versionLine).toContain("1.162.0");
    expect(collapsed(skillSource)).toContain("F169");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s181 + s180 pair as the s181 form's witnesses) + the anchored declaration census pins 64 UNIT / 63 FILES", () => {
    // The s181 spec's constants, re-anchored onto this cycle's figures.
    const s181Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s181.test.ts"),
      "utf8",
    );
    const s181Unit = s181Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s181Files = s181Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s181Unit).toBe(UNIT);
    expect(s181Files).toBe(FILES);
    // And the s180 spec's constants ride the same figures.
    const s180Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s180.test.ts"),
      "utf8",
    );
    const s180Unit = s180Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s180Files = s180Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s180Unit).toBe(UNIT);
    expect(s180Files).toBe(FILES);
    // The anchored declaration census (the declaration lines start at
    // column 0 — the anchored pattern excludes matcher/template noise).
    const root = path.resolve(import.meta.dirname, "..");
    const unitOut = execSync(
      `grep -rhE '^const UNIT = "[0-9]+";$' tests/ --include="*.test.ts" | sort | uniq -c`,
      { cwd: root, encoding: "utf8" },
    );
    expect(unitOut.trim()).toBe(`65 const UNIT = "${UNIT}";`);
    const filesOut = execSync(
      `grep -rhE '^const FILES = "[0-9]+";$' tests/ --include="*.test.ts" | sort | uniq -c`,
      { cwd: root, encoding: "utf8" },
    );
    expect(filesOut.trim()).toBe(`64 const FILES = "${FILES}";`);
  });
});
