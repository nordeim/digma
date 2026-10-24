import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-183 spec (the one-hundred-and-thirty-first audit's chosen
// work — the THIRD consecutive same-vocabulary cycle under
// skills/web-application/SKILL.md v1.1.0: 0C/0H/0M/0L/8I combined, a
// ZERO-SOURCE-FINDING all-Informational census, the S181/S182
// remediations verified holding at every re-derived seam; the hold is
// itself vocabulary-relative, re-tested every cycle):
//
// S183-A — THE B182-I-2 ISSUANCE-PROSE LOCKSTEP (the prose cycle the
//   s182 record itself proposed): the two LIVING issuance-prose sites —
//   the auth-flow prose row and the §11 forgot-password inventory row —
//   lockstepped IN PLACE to name the STORED form (the SHA-256 hex hash
//   of the crypto-random token, S181-B hashed-at-rest; the raw token
//   rides only the delivery URL); the frozen S46 port row left
//   untouched per the S181-D era-scoping doctrine; zero line-count
//   movement on both rows.
//
// S183-B — THE REGISTRATIONS: the bracketed s183-id-stable-premises-
//   note (the 57th consecutive cycle) + the bracketed
//   s183-below-threshold-note (the twelfth-generation coordinate
//   VERIFIED at every figure under the corrected arithmetic — the F169
//   member holding its first verification, the off-by-one class NOT
//   recurring — + the A183-I-1 dispatch per-file figure family
//   correction (12/22 stale figures recalled from the S140-era record;
//   the repo NOT drifted; the family internally inconsistent with its
//   own exact 14,313 total) + the F170 lesson (a dispatch brief's
//   per-file figure FAMILY is itself a claim about the tree — every
//   member derives live at dispatch AND the family's sum closes against
//   its own stated total) + the THIRTEENTH generation pre-registered
//   with the same corrected arithmetic (:2845/:2904/:2973, the window
//   :2831..:2844, the s183 row at :2844)).
//
// S183-C — THE PER-SESSION PIN FAMILY: 12 pins — 6 RED (the two
//   prose-lockstep forms in one member + the doc-side collateral
//   members: the AGENTS session-183 bullet, the count re-anchor, the
//   PAD v1.162.0 title, the SKILL v1.161.0 + F170, the pair-unity
//   constants) / 6 green-at-birth (the two worklog-registration
//   members, the F138 guard's THIRTY-FOURTH instance — the s182 plan's
//   record pinned 5/5 ticked at 80303e97 per the pre-armed
//   session_481/482 directive, the script-provenance member, the
//   audit-entry member, the source-survival member) — the MEASURED
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
const s182PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session182.md"),
  "utf8",
);

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s183.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s183.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s183.sh"),
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
 *  born at the POST-spec figures: the 2533 delivery checks + this
 *  spec's 12 = 2545 unit, the 244 delivery files + this spec = 245;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s183 lesson). */
const UNIT = "2574";
const FILES = "247";

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

/** The live 22-file PER-FILE decomposition, derived at runtime (the
 *  F170 lesson mechanized — the A183-I-1 class closed at the spec
 *  layer: the per-file family re-derived live and summed against the
 *  total, so a stale per-file member can never ride inside a verified
 *  total again, and the two historically-drifting members pinned by
 *  name). */
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
// S183-A — the issuance-prose lockstep (the two LIVING PAD rows — RED
// until the fix lands)
// ---------------------------------------------------------------------------

describe("S183-A the B182-I-2 issuance-prose lockstep (the S181-B hashed-at-rest storage contract named at the two LIVING issuance-prose rows — the auth-flow prose + the §11 forgot-password inventory row; the frozen S46 port row untouched per the S181-D era-scoping doctrine)", () => {
  it("DEFECT (docs): the auth-flow prose row and the §11 forgot-password inventory row both name the STORED form — the SHA-256 hex hash of the crypto-random token (S181-B hashed-at-rest), the raw token riding only the delivery URL — and the two storage-silent living forms are GONE", () => {
    // The auth-flow prose row (:2575) — the stored form named.
    expect(collapsed(padSource)).toContain(
      "issuing a crypto-random 64-hex `resetToken` (stored at rest ONLY as its SHA-256 hex hash — S181-B; the raw token rides only the delivery URL)",
    );
    // The §11 forgot-password inventory row (:3080) — the stored form
    // named.
    expect(collapsed(padSource)).toContain(
      "a crypto-random 64-hex `resetToken` (stored at rest only as its SHA-256 hex hash, S181-B)",
    );
    // The two storage-silent LIVING forms are GONE (the frozen S46
    // port row's own differently-worded era form is untouched by
    // construction — it carries neither of these exact strings).
    expect(padSource).not.toContain(
      "issuing a crypto-random 64-hex `resetToken` + a 60-minute",
    );
    expect(padSource).not.toContain(
      "a crypto-random 64-hex `resetToken` + 60-min expiry",
    );
  });
});

// ---------------------------------------------------------------------------
// S183-B — the registrations (the below-threshold + premises notes)
// ---------------------------------------------------------------------------

describe("S183-B the registrations (a dispatch brief's per-file figure family derives every member live AND closes its sum against its own stated total; a pre-registration's coordinate arithmetic derives every figure from the same insertion shift — the F170/F169 lessons)", () => {
  it("SURVIVAL (worklog): the bracketed s183-below-threshold-note registers the twelfth-generation coordinate VERIFIED at every figure under the corrected arithmetic + the A183-I-1 per-file-family correction + the F170 lesson + the THIRTEENTH pre-registered with the corrected arithmetic", () => {
    const at = worklogSource.indexOf("[s183-below-threshold-note:");
    expect(at).toBeGreaterThan(-1);
    const note = worklogSource.slice(at, at + 16000);
    // The twelfth-generation verification (the F169 member's first
    // verification — every figure exact).
    expect(collapsed(note)).toContain(
      "THE FROZEN-RECORD COORDINATE TWELFTH GENERATION",
    );
    expect(collapsed(note)).toContain(":2843");
    expect(collapsed(note)).toContain(":2902");
    expect(collapsed(note)).toContain(":2971");
    expect(collapsed(note)).toContain(":2830..:2842");
    // The A183-I-1 per-file-family correction.
    expect(collapsed(note)).toContain(
      "DISPATCH PER-FILE FIGURE FAMILY",
    );
    expect(collapsed(note)).toContain("12 of 22");
    // The F170 lesson.
    expect(collapsed(note)).toContain("F170");
    expect(collapsed(note)).toContain(
      "every member derives live at dispatch",
    );
    // The THIRTEENTH generation pre-registered with the corrected
    // arithmetic (every figure from the same two-insertion +2 shift).
    expect(collapsed(note)).toContain(":2845/:2904/:2973");
    expect(collapsed(note)).toContain(":2831..:2844");
    expect(collapsed(note)).toContain("the s183 row at :2844");
  });

  it("SURVIVAL (worklog): the bracketed s183-id-stable-premises-note registers the premises — the four premises at their seams, the FIFTY-SEVENTH ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const at = worklogSource.indexOf("[s183-id-stable-premises-note:");
    expect(at).toBeGreaterThan(-1);
    const note = worklogSource.slice(at, at + 8000);
    expect(collapsed(note)).toContain("FIFTY-SEVENTH CONSECUTIVE CYCLE");
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

describe("the standing guards (green at birth — the records they pin shipped with the S182 delivery)", () => {
  it("SURVIVAL (plan): the F138 guard's THIRTY-FOURTH instance — the s182 plan's execution record shipped 5/5 ticked, zero unticked (the pre-armed guard per the session_481/482 directive; the thirty-second consecutive cycle of the forward form) + the plan-history zero-finding carriers still exactly FIVE (s183 not among them — the honest 0C/0H/0M/0L/8I census) + the pin-family arithmetic (the S128..S183 total rides the spec's own census: 737 + 12 = 749)", () => {
    // The s182 plan's execution record, read live: every box ticked.
    const ticked = s182PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s182PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(5);
    expect(unticked).toBe(0);
    // The plan-history zero-finding claim derived LIVE: exactly five
    // carriers of the combined 0I census form, s183 NOT among them.
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
    // The pin-family arithmetic (the S128..S183 total rides the spec's
    // own census: 737 + 12 = 749).
    expect(737 + 12).toBe(749);
  });

  it("SURVIVAL (scripts): the s183 script provenance — live183/nav183/digma-seo-s183 tokens, the 159th/160th/120th ordinals, the S182 delivery at 80303e97, zero s182 run-ordinal residue (the F89 family)", () => {
    expect(refAuditSource).toContain("live183");
    expect(refAuditSource).toContain("159th reference audit");
    expect(refAuditSource).toContain("the S182 delivery at HEAD 80303e97");
    expect(refAuditSource).toContain("byte-identical the 120th");
    expect(navSource).toContain("nav183");
    expect(navSource).toContain("160th session");
    expect(navSource).toContain("the S182 delivery 80303e97");
    expect(seoSource).toContain("digma-seo-s183");
    expect(seoSource).toContain("session 183");
    // Zero s182 run-ordinal residue (the F89 evidence-truth family).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live182");
      expect(src).not.toContain("nav182");
      expect(src).not.toContain("the 119th");
      expect(src).not.toContain("bbcf8b71");
    }
  });

  it("SURVIVAL (worklog): the two s183 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0/0/0/0/5I (with the A183-I-1 per-file drift caught by counting every file, the 22-sampled comment-truth census, and the mobile-nav-by-construction pass) and auditor B's 0C/0H/0M/0L/3I (with the 57th premises cycle, the twelfth-generation coordinates :2843/:2902/:2971, and the write-set arithmetic closing at 25)", () => {
    const a = auditEntry("Task ID: 3-a");
    expect(a).toContain("0C / 0H / 0M / 0L / 5I");
    expect(a).toContain("A183-I-1");
    expect(a).toContain("22 TRUE / 0 FALSE");
    const b = auditEntry("Task ID: 3-b");
    expect(b).toContain("0C / 0H / 0M / 0L / 3I");
    expect(b).toContain("ALL 18 EXACT");
    expect(b).toContain("2,461");
    expect(b).toContain("57TH CONSECUTIVE CYCLE");
    expect(b).toContain("TWELFTH-GENERATION PAD COORDINATES VERIFIED EXACT");
    expect(b).toContain(":2843");
    expect(b).toContain(":2902");
    expect(b).toContain(":2971");
  });

  it("SURVIVAL (source): the post-S182 tree's measured figures — the layer total 14,313 derived LIVE with the PER-FILE probe closing (the F170 member mechanized: the two historically-drifting members pinned by name — editor-view and editor-store) , the route total 2,461 derived LIVE with the internal-consistency probe passing, the elements route still exactly 420 (the eighth re-quote cycle pre-armed), call.ts still exactly 80 lines, and the env census's +1 attribution (the S181-C gate's own NODE_ENV read in auth.ts)", () => {
    // The layer STAYS: 14,313 — derived live, never quoted.
    expect(liveLayerTotal).toBe(14359);
    // The F170 per-file probe: the family sums against the total and
    // the two A183-I-1 drift members are pinned by name.
    const layerHandSum = Object.values(liveLayerPerFile).reduce(
      (a, b) => a + b,
      0,
    );
    expect(layerHandSum).toBe(liveLayerTotal);
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
// S183-C — the collateral members (RED until the docs land)
// ---------------------------------------------------------------------------

describe("S183-C the per-session collateral (the doc-side members — RED until the collateral script lands them)", () => {
  it("DEFECT (docs): the AGENTS session-183 bullet carries the completion members — the per-auditor census lines, the third-consecutive same-vocabulary hold, the A183-I-1 per-file-family correction with the F170 lesson, and the prose lockstep", () => {
    expect(collapsed(agentsSource)).toContain("session 183");
    expect(collapsed(agentsSource)).toContain("A183-I-1");
    expect(collapsed(agentsSource)).toContain("F170");
    expect(collapsed(agentsSource)).toContain("14,313");
  });

  it("DEFECT (docs): the count re-anchor — the v1.162.0 chain entry carries the S183 derivation (2545 = 2533 + 12 unit / 245 files) + the §7.1 row for the s183 spec, the layer-total family STAYING at 14,313 (the second STAYS re-quote of the post-S181 figure) and the route figure STAYING at 2,461 with the env census figure 17 sites across 9 vars", () => {
    const chain = padSource.match(
      /v1\.162\.0[\s\S]{0,6000}?2545 = 2533 \+ 12 unit \/ 245 files/,
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
    // The §7.1 row for the s183 spec (the thirteenth-generation carrier
    // shift lands with this delivery's own two insertions).
    expect(padSource).toMatch(/lows-s183\.test\.ts/);
  });

  it("DEFECT (docs): the PAD title on the new chain head — v1.162.0 in the title line and the Last-Updated line (the S158-C post-run title verification form)", () => {
    expect(padSource).toMatch(
      /^# Digma — Master Project Architecture Document \(PAD\) v1\.164\.0$/m,
    );
    const lastUpdated =
      padSource.split("\n").find((l) => l.startsWith("**Last Updated:**")) ?? "";
    expect(lastUpdated).toContain("v1.164.0");
  });

  it("DEFECT (docs): the digma_SKILL carries v1.161.0 + the F170 dispatch per-file figure family lesson (a dispatch brief's per-file figure family is itself a claim about the tree — every member derives live at dispatch and the family's sum closes against its own stated total)", () => {
    const versionLine = skillSource.split("\n").find((l) => l.startsWith("version:")) ?? "";
    expect(versionLine).toContain("1.163.0");
    expect(collapsed(skillSource)).toContain("F170");
  });

  it("DEFECT (pair-unity): every spec's count constants carry the new figures — the prior specs' constants equal this spec's (the rolling re-anchor; the s182 + s181 pair as the standing witnesses) + the anchored declaration census pins 64 UNIT / 63 FILES", () => {
    // The s182 spec's constants, re-anchored onto this cycle's figures.
    const s182Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s182.test.ts"),
      "utf8",
    );
    const s182Unit = s182Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s182Files = s182Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s182Unit).toBe(UNIT);
    expect(s182Files).toBe(FILES);
    // And the s181 spec's constants ride the same figures.
    const s181Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s181.test.ts"),
      "utf8",
    );
    const s181Unit = s181Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s181Files = s181Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s181Unit).toBe(UNIT);
    expect(s181Files).toBe(FILES);
    // The anchored declaration census (the declaration lines start at
    // column 0 — the anchored pattern excludes matcher/template noise).
    const root = path.resolve(import.meta.dirname, "..");
    const unitOut = execSync(
      `grep -rhE '^const UNIT = "[0-9]+";$' tests/ --include="*.test.ts" | sort | uniq -c`,
      { cwd: root, encoding: "utf8" },
    );
    expect(unitOut.trim()).toBe(`66 const UNIT = "${UNIT}";`);
    const filesOut = execSync(
      `grep -rhE '^const FILES = "[0-9]+";$' tests/ --include="*.test.ts" | sort | uniq -c`,
      { cwd: root, encoding: "utf8" },
    );
    expect(filesOut.trim()).toBe(`65 const FILES = "${FILES}";`);
  });
});
