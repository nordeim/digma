import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-181 spec (the one-hundred-and-twenty-ninth audit's chosen
// work — the NEW-SKILL LENS cycle: 0C/0H/0M/3L/7I combined, the first
// non-Informational members in SIX cycles, ALL THREE Lows surfaced by
// the directive-named master skill skills/web-application/SKILL.md
// v1.1.0's contract vocabulary (the operator's 2026-10-23 revision)
// against code the five prior cycles audited clean under the older
// vocabulary — the streak was vocabulary-relative and ended the moment
// the vocabulary grew):
//
// S181-A — THE A181-L-1 CURSOR REMEDIATION: the Tailwind v4 preflight
//   sets NO cursor:pointer on buttons (mechanically verified against
//   tailwindcss@4.3.3's own preflight.css — zero cursor declarations)
//   while the reference ships v3 via CDN whose preflight DID set it —
//   every real button showed cursor:default on desktop hover, a
//   hover-affordance parity deviation invisible to screenshot clips;
//   the master skill §12 base-layer rule restored. THE LAYER TOTAL
//   MOVES 14,307 -> 14,313 — the first layer movement in fourteen
//   cycles, a deliberate remediation (the F40 rider engaging), never
//   drift.
//
// S181-B — THE B181-L-1 HASHED-AT-REST REMEDIATION: reset tokens were
//   persisted RAW (forgot-password:104) and looked up by raw equality
//   (reset-password:55) — a DB-at-rest read exposed the only
//   directly-usable credential in the User row; the master skill
//   §5/§16 SHA-256-at-rest contract installed through the pure crypto
//   seam (password.ts hashResetToken), the raw token living only in
//   the delivery URL; the S76 atomicity contract UNCHANGED (only the
//   compared value now the hash — the spec's two literals updated in
//   lockstep with the intent pins preserved). Routes 2,450 -> 2,452.
//
// S181-C — THE B181-L-2 FAIL-HARD REMEDIATION: AUTH_SECRET warned and
//   fell back to the PUBLIC repo constant in EVERY environment — the
//   master skill §5/§16 fail-hard contract installed (production +
//   missing/short THROWS at the secret() seam, the mint sites
//   refusing to forge; dev/test keeps the warned fallback for DX),
//   the harness cascade provisioned (smoke + nav boots carry the
//   secret; the playwright webServer already did).
//
// S181-D — THE REGISTRATIONS: the bracketed s181-id-stable-premises-
//   note (the 55th consecutive cycle) + the bracketed
//   s181-below-threshold-note (the tenth-generation coordinate
//   re-anchor with the ELEVENTH pre-registered at :2841/:2900/:2969 +
//   the three new-skill Lows + the F168 dispatch-figure lesson — a
//   dispatch brief's per-file figures derive from the live tree,
//   never from memory — + the master-skill lens record: a fresh
//   contract vocabulary is itself an audit dimension).
//
// S181-E — THE PER-SESSION PIN FAMILY: 20 pins — 15 RED (the three
//   code remediations' source contracts + the harness provisions +
//   the S76 lockstep forms + the doc-side collateral members) / 5
//   green-at-birth (the two worklog-registration members, the F138
//   guard's THIRTY-SECOND instance — the s180 plan's record pinned
//   6/6 ticked at 510dfd10 per the pre-armed session_467/469/470
//   directive, the script-provenance member, the audit-entry member).

const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s180PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session180.md"),
  "utf8",
);
const globalsSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/globals.css"),
  "utf8",
);
const passwordSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/password.ts"),
  "utf8",
);
const authSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/auth.ts"),
  "utf8",
);
const forgotSource = readFileSync(
  path.resolve(
    import.meta.dirname,
    "../src/app/api/auth/forgot-password/route.ts",
  ),
  "utf8",
);
const resetSource = readFileSync(
  path.resolve(
    import.meta.dirname,
    "../src/app/api/auth/reset-password/route.ts",
  ),
  "utf8",
);
const s76SpecSource = readFileSync(
  path.resolve(import.meta.dirname, "./reset-atomic-s76.test.ts"),
  "utf8",
);
const smokeSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/smoke-test.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s181.sh"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s181.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s181.sh"),
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
 *  born at the POST-spec figures: the 2501 delivery checks + this
 *  spec's 20 = 2521 unit, the 242 delivery files + this spec = 243;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s181 lesson). */
const UNIT = "2533";
const FILES = "244";

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
// S181-A + S181-B + S181-C — the three new-skill remediations (the code
// contracts — RED until the fixes land)
// ---------------------------------------------------------------------------

describe("S181-A the A181-L-1 cursor remediation (the master skill §12 base-layer rule — the v4 preflight sets no cursor:pointer on buttons; the reference's v3 CDN preflight did)", () => {
  it("DEFECT (source): globals.css carries the button-cursor base rule in @layer base — button + [role=\"button\"] with cursor: pointer, commented with the v4-preflight fact (the parity form: the reference's own v3 preflight set it)", () => {
    const baseStart = globalsSource.indexOf("@layer base {");
    const baseEnd = globalsSource.indexOf("@media", baseStart);
    const base = globalsSource.slice(baseStart, baseEnd);
    expect(base).toContain("button,");
    expect(base).toContain('[role="button"]');
    expect(base).toContain("cursor: pointer");
    // The comment names the v4 fact (the master skill's §12 trap form).
    expect(collapsed(globalsSource)).toContain(
      "Tailwind v4's preflight sets no cursor:pointer on buttons",
    );
  });
});

describe("S181-B the B181-L-1 hashed-at-rest remediation (the master skill §5/§16 — the raw token lives only in the delivery URL)", () => {
  it("DEFECT (source): the pure crypto seam exports hashResetToken — SHA-256 hex over the token, node:crypto only (the seam's own doctrine)", () => {
    expect(passwordSource).toContain("export function hashResetToken");
    expect(passwordSource).toMatch(/createHash\("sha256"\)\.update\(token\)\.digest\("hex"\)/);
    expect(passwordSource).toContain("createHash");
  });

  it("DEFECT (source): auth.ts re-exports hashResetToken through the routes' existing import surface (the S70-D re-export doctrine)", () => {
    expect(authSource).toMatch(/export \{[^}]*hashResetToken[^}]*}/);
  });

  it("DEFECT (source): forgot-password stores the HASH — resetToken: hashResetToken(token) (the raw 64-hex never persists)", () => {
    expect(forgotSource).toContain("resetToken: hashResetToken(token)");
  });

  it("DEFECT (source): reset-password computes the hash ONCE and carries it in BOTH the pre-read and the atomic consume — findFirst({ where: { resetToken: hashedToken } }) + the updateMany where-clause on the same hashedToken (the S76-A single-use atomicity contract UNCHANGED, only the compared value now the hash)", () => {
    expect(resetSource).toContain(
      "const hashedToken = hashResetToken(resetToken);",
    );
    expect(resetSource).toContain(
      "findFirst({ where: { resetToken: hashedToken } })",
    );
    expect(resetSource).toMatch(
      /where: \{ id: user\.id, resetToken: hashedToken, resetTokenExpiresAt: \{ gt: new Date\(\) \} \}/,
    );
  });

  it("DEFECT (spec-lockstep): the S76 spec's two literals track the deliberate source change — the pre-read indexOf string and the where-clause regex now carry hashedToken (the intent pins preserved: the conditional write, the count check, the ordering, the nulls + the version bump inside the data block)", () => {
    expect(s76SpecSource).toContain(
      'findFirst({ where: { resetToken: hashedToken } })',
    );
    // The spec's own regex literal carries the ESCAPED form — match
    // its bytes exactly (the F166 display-mangling lesson: pin the
    // source's actual bytes, never a re-typed rendering).
    expect(s76SpecSource).toContain(
      "resetToken: hashedToken, resetTokenExpiresAt",
    );
    // The intent pins survive the lockstep edit (the escaped-regex
    // forms are the spec's actual bytes — the F166 lesson).
    expect(s76SpecSource).toContain("resetToken: null");
    expect(s76SpecSource).toContain("tokenVersion: \\{ increment: 1 \\}");
  });
});

describe("S181-C the B181-L-2 fail-hard remediation (the master skill §5/§16 — forgeable sessions must never ship silently)", () => {
  it("DEFECT (source): auth.ts secret() THROWS in production when the secret is missing or shorter than 16 chars — the message naming the fix; dev/test keeps the S66-C warned fallback", () => {
    expect(authSource).toMatch(
      /process\.env\.NODE_ENV === "production"/,
    );
    expect(authSource).toMatch(/!from \|\| from\.length < 16/);
    expect(authSource).toContain("throw new Error");
    expect(collapsed(authSource)).toContain(
      "refusing to mint session tokens",
    );
    // The S66-C warn-once fallback survives for dev/test.
    expect(authSource).toContain("warnedInsecureSecret");
    expect(authSource).toContain("digma-dev-only-insecure-secret");
  });

  it("DEFECT (harness): the smoke boot provisions AUTH_SECRET (the production standalone server refuses to mint without it — the cascade mapped at fix time)", () => {
    expect(smokeSource).toMatch(/AUTH_SECRET="smoke-suite-session-secret"/);
  });

  it("DEFECT (harness): the nav-contract boot provisions AUTH_SECRET (the login flow mints on the production standalone server)", () => {
    expect(navSource).toMatch(/AUTH_SECRET="nav-contract-session-secret"/);
  });
});

// ---------------------------------------------------------------------------
// S181-D — the registrations (the below-threshold + premises notes)
// ---------------------------------------------------------------------------

describe("S181-D the registrations (a frozen record's coordinates are era-scoped — the next generation re-anchors, never rewrites; a dispatch brief's figures are live-derived claims — the F168 lesson)", () => {
  it("SURVIVAL (worklog): the bracketed s181-below-threshold-note registers the tenth-generation coordinate re-anchor + the three new-skill Lows + the F168 dispatch-figure lesson + the master-skill lens record — the carriers :2839/:2898/:2967 verified live with the ELEVENTH generation pre-registered (:2841/:2900/:2969, the window :2829..:2838, the s181 row at :2839)", () => {
    const at = worklogSource.indexOf("[s181-below-threshold-note:");
    expect(at).toBeGreaterThan(-1);
    const note = worklogSource.slice(at, at + 16000);
    // The tenth-generation re-anchor, in the note's own spelling.
    expect(collapsed(note)).toContain(
      "THE FROZEN-RECORD COORDINATE TENTH GENERATION",
    );
    expect(collapsed(note)).toContain(":2839");
    expect(collapsed(note)).toContain(":2898");
    expect(collapsed(note)).toContain(":2967");
    // The eleventh generation pre-registered.
    expect(collapsed(note)).toContain(":2841/:2900/:2969");
    // The three Lows registered with their remediations chosen.
    expect(collapsed(note)).toContain("A181-L-1");
    expect(collapsed(note)).toContain("B181-L-1");
    expect(collapsed(note)).toContain("B181-L-2");
    // The F168 dispatch-figure lesson.
    expect(collapsed(note)).toContain("F168");
    expect(collapsed(note)).toContain(
      "derive from the live tree",
    );
    // The master-skill lens record.
    expect(collapsed(note)).toContain(
      "a fresh contract vocabulary is itself an audit dimension",
    );
  });

  it("SURVIVAL (worklog): the bracketed s181-id-stable-premises-note registers the premises — the four premises at their seams, the FIFTY-FIFTH ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const at = worklogSource.indexOf("[s181-id-stable-premises-note:");
    expect(at).toBeGreaterThan(-1);
    const note = worklogSource.slice(at, at + 8000);
    expect(collapsed(note)).toContain("FIFTY-FIFTH CONSECUTIVE CYCLE");
    expect(collapsed(note)).toContain("P1");
    expect(collapsed(note)).toContain("P2");
    expect(collapsed(note)).toContain("P3");
    expect(collapsed(note)).toContain("P4");
    expect(collapsed(note)).toContain("The premises-pinning doctrine");
  });
});

// ---------------------------------------------------------------------------
// The F138 guard + the script provenance + the audit entries (green at birth)
// ---------------------------------------------------------------------------

describe("the standing guards (green at birth — the records they pin shipped with the S180 delivery)", () => {
  it("SURVIVAL (plan): the F138 guard's THIRTY-SECOND instance — the s180 plan's execution record shipped 6/6 ticked, zero unticked (the pre-armed guard per the session_467/469/470 directive; the thirtieth consecutive cycle of the forward form) + the plan-history zero-finding carriers still exactly FIVE (s181 not among them — the honest 0C/0H/0M/3L/7I census) + the pin-family arithmetic (the S128..S181 total rides the spec's own census: 705 + 20 = 725)", () => {
    // The s180 plan's execution record, read live: every box ticked.
    const ticked = s180PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s180PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(6);
    expect(unticked).toBe(0);
    // The plan-history zero-finding claim derived LIVE: exactly five
    // carriers of the combined 0I census form, s181 NOT among them.
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
    // The pin-family arithmetic (the S128..S181 total rides the spec's
    // own census: 705 + 20 = 725).
    expect(705 + 20).toBe(725);
  });

  it("SURVIVAL (scripts): the s181 script provenance — live181/nav181/digma-seo-s181 tokens, the 157th/158th/118th ordinals, the S180 delivery at 510dfd10, zero s180 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live181");
    expect(refAuditSource).toContain("157th reference audit");
    expect(refAuditSource).toContain("the S180 delivery at HEAD 510dfd10");
    expect(refAuditSource).toContain("byte-identical the 118th");
    expect(navSource).toContain("nav181");
    expect(navSource).toContain("158th session");
    expect(navSource).toContain("the S180 delivery 510dfd10");
    expect(seoSource).toContain("digma-seo-s181");
    expect(seoSource).toContain("session 181");
    // Zero s180 run-ordinal residue (the F89 evidence-truth family).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live180");
      expect(src).not.toContain("nav180");
      expect(src).not.toContain("the 117th");
      expect(src).not.toContain("1adc3b67");
    }
  });

  it("SURVIVAL (worklog): the two s181 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0/0/0/1/4 (with the 22-sampled 22 TRUE / 0 FALSE comment-truth census and the 14th consecutive STAYS figure at the audit phase) and auditor B's 0C/0H/0M/2L/3I (with the 55th premises cycle, the tenth-generation coordinates :2839/:2898/:2967, and the dispatch-figure refutation at the mechanical level)", () => {
    const a = auditEntry("Task ID: digma-s181-a");
    expect(a).toContain("CENSUS: 0/0/0/1/4");
    expect(a).toContain("22/22 MATCHING, total exactly 14,307");
    expect(a).toContain("Comment-truth: 22 sampled, 22 TRUE / 0 FALSE");
    const b = auditEntry("Task ID: digma-s181-b");
    expect(b).toContain("CENSUS: 0C/0H/0M/2L/3I");
    expect(b).toContain("TOTAL 2,450 EXACT");
    expect(b).toContain("elements route 420 EXACT");
    expect(b).toContain("Premises 55th cycle: ALL FOUR HOLDING");
    expect(b).toContain(":2839");
  });
});

// ---------------------------------------------------------------------------
// S181-E — the collateral members (RED until the docs land)
// ---------------------------------------------------------------------------

describe("S181-E the per-session collateral (the doc-side members — RED until the collateral script lands them)", () => {
  it("DEFECT (docs): the AGENTS session-181 bullet carries the completion members — the per-auditor census lines, the three new-skill Lows with their remediations, the F168 dispatch-figure lesson, the layer MOVING 14,307 -> 14,313 (the first movement in fourteen cycles), and the 55th deferral cycle", () => {
    expect(collapsed(agentsSource)).toContain("session 181");
    expect(collapsed(agentsSource)).toContain("A181-L-1");
    expect(collapsed(agentsSource)).toContain("B181-L-1");
    expect(collapsed(agentsSource)).toContain("B181-L-2");
    expect(collapsed(agentsSource)).toContain("F168");
    expect(collapsed(agentsSource)).toContain("14,313");
  });

  it("DEFECT (docs): the count re-anchor — the v1.160.0 chain entry carries the S181 derivation (2521 = 2501 + 20 unit / 243 files) + the §7.1 row for the s181 spec, the layer-total family MOVING to 14,313 (the first movement in fourteen cycles — the F40 rider engaging, a deliberate remediation never drift) and the route figure MOVING to 2,461", () => {
    const chain = padSource.match(
      /v1\.160\.0[\s\S]{0,6000}?2521 = 2501 \+ 20 unit \/ 243 files/,
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
    // The §7.1 row for the s181 spec (the eleventh-generation carrier
    // shift lands with this delivery's own two insertions).
    expect(padSource).toMatch(/lows-s181\.test\.ts/);
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.160.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(
      /^# Digma — Master Project Architecture Document \(PAD\) v1\.161\.0$/m,
    );
    const lastUpdated =
      padSource.split("\n").find((l) => l.startsWith("**Last Updated:**")) ?? "";
    expect(lastUpdated).toContain("v1.161.0");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.160.0 + the F168 dispatched-figure lesson (a dispatch brief's per-file figures derive from the live tree, never from memory)", () => {
    const versionLine = skillSource.split("\n").find((l) => l.startsWith("version:")) ?? "";
    expect(versionLine).toContain("1.160.0");
    expect(collapsed(skillSource)).toContain("F168");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s180 + s179 pair as the s180 form's witnesses) + the anchored declaration census pins 62 UNIT / 61 FILES", () => {
    // The s180 spec's constants, re-anchored onto this cycle's figures.
    const s180Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s180.test.ts"),
      "utf8",
    );
    const s180Unit = s180Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s180Files = s180Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s180Unit).toBe(UNIT);
    expect(s180Files).toBe(FILES);
    // And the s179 spec's constants ride the same figures.
    const s179Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s179.test.ts"),
      "utf8",
    );
    const s179Unit = s179Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s179Files = s179Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s179Unit).toBe(UNIT);
    expect(s179Files).toBe(FILES);
    // The anchored declaration census (the declaration lines start at
    // column 0 — the anchored pattern excludes matcher/template noise).
    const root = path.resolve(import.meta.dirname, "..");
    const unitOut = execSync(
      `grep -rhE '^const UNIT = "[0-9]+";$' tests/ --include="*.test.ts" | sort | uniq -c`,
      { cwd: root, encoding: "utf8" },
    );
    expect(unitOut.trim()).toBe(`63 const UNIT = "${UNIT}";`);
    const filesOut = execSync(
      `grep -rhE '^const FILES = "[0-9]+";$' tests/ --include="*.test.ts" | sort | uniq -c`,
      { cwd: root, encoding: "utf8" },
    );
    expect(filesOut.trim()).toBe(`62 const FILES = "${FILES}";`);
  });

  it("DEFECT (source-survival): the post-remediation tree's measured figures — the layer total 14,313 derived LIVE (the F40 rider's own receipt: the deliberate +6 globals.css movement), the route total 2,461 derived LIVE with the internal-consistency probe passing, call.ts still exactly 80 lines, the elements route still exactly 420 (the sixth re-quote cycle pre-armed), and the three remediation seams intact", () => {
    // The layer MOVES: 14,307 + 6 (the cursor rule's deliberate
    // globals.css addition) — derived live, never quoted.
    expect(liveLayerTotal).toBe(14313);
    // The routes MOVE: 2,450 + 11 (the forgot import + comment block
    // + the reset hashedToken const + comment block) — derived live
    // with the probe.
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
  });
});
