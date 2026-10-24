import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-171 spec (the one-hundred-and-nineteenth audit's chosen work —
// the ZERO-SOURCE-FINDING dependency-bump cycle: every actionable member of
// the auditors' census A 0C/0H/0M/0L/3I + B 0C/0H/2M/3L/4I lives on the
// DEPENDENCY/DOC surface, all five tracing to one cause — the repo's
// first-ever dependency-range bump (the operator's 129e49df) landing its
// manifest + lockfiles without the doc/registration collateral):
//
// S171-A — THE DEPENDENCY-BUMP DOC-TRUTH REPAIR (the B171-M1 + B171-L1 +
//   B171-L2 remediation, the FIX form — live claim sites, never frozen
//   records): AGENTS.md:22's "bun.lock is the only lockfile" claim is FALSE
//   since 129e49df committed package-lock.json — re-worded onto the
//   two-lockfile reality (bun.lock the gate-verified canonical, package-
//   lock.json the operator-committed npm mirror with its transitive layer
//   registered unverified); README's two stale cells (16.3 -> 16.4, 1.63 ->
//   1.64); the eight PAD/SKILL floor sites re-anchored onto the manifest's
//   new ^ floors (>=16.4.2 / >=19.3.1 / >=5.0.5 / >=1.64.1); plus the
//   three opportunistic table truths (the radix ^1.x/^2.x form, the Bun
//   both-units form, the SKILL env-table completion). ZERO source changes.
//
// S171-B — THE DEPENDENCY-BUMP REGISTRATION (the B171-M2 + B171-L3
//   remediation, the registration form): the bracketed
//   s171-dependency-bump-note at the worklog — the operator's 129e49df
//   registered in full (what landed, the gate re-verification on the new
//   stack, the chromium-1248 re-provisioning, the dual-lockfile truth with
//   the named transitive exemplars, the canonical-lockfile judgment, the
//   collateral misses), the frozen commit message never rewritten.
//
// S171-C — THE PREMISES REGISTRATION: the bracketed
//   s171-id-stable-premises-note — the 45th consecutive cycle, the four
//   premises at their seams, the judgment carried unchanged.
//
// S171-D — THE PER-SESSION PIN FAMILY: 15 pins — 8 RED doc-side members
//   (the AGENTS re-word + README cells + floors, the AGENTS session-171
//   bullet, the count re-anchor, the forward count-truth guard, the F158
//   lesson, the pair-unity RED-until-collateral) / 7 green-at-birth (the
//   two worklog-registration members, the dual-lockfile live census, the
//   premises note, the F138
//   guard's TWENTY-SECOND instance — the s170 plan's record pinned 6/6
//   ticked at 916f3160 per the pre-armed session_409/410 directive, the
//   script provenance, the audit entries, the source-survival member).
//
// The collateral family: the count re-anchor 2391 = 2377 + 14 / 233 files;
// the layer-total family STAYING at 14,307 (the FOURTH consecutive STAYS
// cycle, the zero-source-change form); the route figure STAYING at 2,450;
// PAD v1.150.0; digma_SKILL v1.149.0 + F158 (the dependency-bump
// version-truth member).

const worklogSource = readFileSync(
  path.resolve(import.meta.dirname, "../worklog.md"),
  "utf8",
);
const padSource = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skillSource = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);
const s170PlanSource = readFileSync(
  path.resolve(import.meta.dirname, "../docs/remediation-plan-session170.md"),
  "utf8",
);
const packageJsonSource = readFileSync(
  path.resolve(import.meta.dirname, "../package.json"),
  "utf8",
);
const bunLockSource = readFileSync(
  path.resolve(import.meta.dirname, "../bun.lock"),
  "utf8",
);

interface PkgLock {
  packages?: Record<string, { version?: string }>;
}
const pkgLock: PkgLock = JSON.parse(
  readFileSync(
    path.resolve(import.meta.dirname, "../package-lock.json"),
    "utf8",
  ),
);
const npmVersion = (name: string): string =>
  pkgLock.packages?.[`node_modules/${name}`]?.version ?? "";

const refAuditSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/ref-audit-s171.sh"),
  "utf8",
);
const navSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/verify-nav-s171.sh"),
  "utf8",
);
const seoSource = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/seo-check-s171.sh"),
  "utf8",
);

/** The per-session count-family constants (the standing convention —
 *  born at the POST-spec figures: the 2377 delivery checks + this
 *  spec's 15 = 2392 unit, the 232 delivery files + this spec = 233;
 *  the doc-update script re-anchors the docs and these constants
 *  TOGETHER so the pair-unity pins stay green through the transition
 *  — the rolling-safe form at birth, the s140–s171 lesson). */
const UNIT = "2574";
const FILES = "247";

/** Collapse whitespace for comment-token matching (the standing form). */
const collapsed = (s: string) => s.replace(/\s+/g, " ");

/** Collapse a TS source's docblock body: strip the leading ' * '
 *  markers from every line, then collapse whitespace — so a phrase
 *  spanning docblock continuation lines matches as contiguous text
 *  (the s168 arm of the same standing form: the docblock IS a
 *  comment member). */
const strippedDocblockComments = (s: string) =>
  s.replace(/^[ \t]*\*[ \t]?/gm, "").replace(/\s+/g, " ");

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

/** The figure the v1.164.0 PAD block quotes for the layer total (the
 *  doc-side claim this spec's forward guard holds to the live tree —
 *  the F138 receipt shape at the count family, its eighteenth
 *  instance, this cycle in its STAYS form: 14,307 unchanged, the
 *  dependency-bump cycle touching zero source files). */
const padQuotedLayerTotal = (() => {
  const m = padSource.match(
    /v1\.164\.0[\s\S]{0,6000}?the 22-file layer at \*\*(\d[\d,]*) lines?\*\*/,
  );
  return m ? m[1] : "";
})();

// ---------------------------------------------------------------------------
// S171-A — the dependency-bump doc-truth repair (the FIX form)
// ---------------------------------------------------------------------------

describe("S171-A the dependency-bump doc-truth repair (the B171-M1 + B171-L1 + B171-L2 remediation — a dependency-range bump joins every version-claim site its family holds IN THE SAME COMMIT; live claim sites are repaired, never registered frozen)", () => {
  it("DEFECT (docs): the AGENTS lockfile claim re-worded onto the two-lockfile reality — bun.lock the gate-verified canonical, package-lock.json the operator-committed npm mirror with its transitive layer registered unverified (the only-lockfile claim gone)", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    // The born-false claim is GONE (the operative form with its
    // parenthetical — the session-171 bullet's own historical QUOTATION
    // of the claim, without the parenthetical, correctly survives).
    expect(agents).not.toContain("is the only lockfile (npm users regenerate their own)");
    // The two-lockfile reality, in the operative doc's own voice (the
    // record's own spelling — backticked identifiers, the F143 lesson).
    expect(collapsed(agents)).toContain("`bun.lock` is the canonical lockfile");
    expect(collapsed(agents)).toContain("`package-lock.json` is the operator-committed npm mirror");
    expect(collapsed(agents)).toContain("npm users regenerate their own or verify before trusting");
  });

  it("DEFECT (docs): README's two stale cells re-anchored onto the live manifest — the Next.js cell 16.4 and the Playwright cell 1.64 (the bump commit touched no docs; the cells born-stale against ^16.4.2/^1.64.1)", () => {
    const readme = readFileSync(
      path.resolve(import.meta.dirname, "../README.md"),
      "utf8",
    );
    expect(readme).toContain("| Next.js (App Router) | 16.4 |");
    expect(readme).toContain("| Playwright | 1.64 |");
    // The stale cells are GONE.
    expect(readme).not.toContain("| Next.js (App Router) | 16.3 |");
    expect(readme).not.toContain("| Playwright | 1.63 |");
  });

  it("DEFECT (docs): the eight PAD/SKILL floor sites re-anchored onto the manifest's new ^ floors — >=16.4.2 / >=19.3.1 / >=5.0.5 / >=1.64.1 (a reader taking the floor from the doc installs a version the range accepts; the old floors gone)", () => {
    for (const doc of [padSource, skillSource]) {
      expect(doc).toContain("≥16.4.2");
      expect(doc).toContain("≥19.3.1");
      expect(doc).toContain("≥5.0.5");
      expect(doc).toContain("≥1.64.1");
      // The under-specifying floors are GONE from the tech-stack tables
      // (the cell-pipe anchors — a bare "≥5.0.1" would collide with
      // Zustand's legitimate "≥5.0.15" cell, the F143 subclass lesson).
      expect(doc).not.toContain("| ≥16.3.6 |");
      expect(doc).not.toContain("| ≥19.3.0 |");
      expect(doc).not.toContain("| ≥5.0.1 |");
      expect(doc).not.toContain("| ≥1.63.0 |");
    }
    // The manifest's own ranges (the floors' derivation source, live).
    expect(packageJsonSource).toContain('"next": "^16.4.2"');
    expect(packageJsonSource).toContain('"react": "^19.3.1"');
    expect(packageJsonSource).toContain('"vitest": "^5.0.5"');
    expect(packageJsonSource).toContain('"@playwright/test": "^1.64.1"');
  });
});

// ---------------------------------------------------------------------------
// S171-B — the dependency-bump registration (the registration form)
// ---------------------------------------------------------------------------

describe("S171-B the dependency-bump registration (the B171-M2 + B171-L3 remediation — the repo's first-ever dependency-range bump registered in full; the canonical-lockfile posture; the frozen commit message never rewritten)", () => {
  it("SURVIVAL (worklog): the bracketed s171-dependency-bump-note registers B171-M2 + B171-L3 — the 129e49df registration (what landed, the gate re-verification, the chromium-1248 re-provisioning, the dual-lockfile truth, the canonical-lockfile judgment, the collateral misses, the F158 doctrine)", () => {
    const noteAt = worklogSource.indexOf("[s171-dependency-bump-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 12000);
    // The two findings and their registrations.
    expect(collapsed(note)).toContain("B171-M2 + B171-L3");
    // What landed.
    expect(collapsed(note)).toContain("^16.3.6->^16.4.2");
    expect(collapsed(note)).toContain("package-lock.json created");
    expect(collapsed(note)).toContain("ZERO src/ files touched");
    // The infrastructure consequence.
    expect(collapsed(note)).toContain("chromium-1248");
    expect(collapsed(note)).toContain("THIRD consecutive cycle");
    // The dual-lockfile truth + the canonical judgment.
    expect(collapsed(note)).toContain("~45 transitive packages");
    expect(collapsed(note)).toContain("vite 8.3.0 vs 8.3.5");
    expect(collapsed(note)).toContain("UNVERIFIED-AT-THE-TRANSITIVE-LAYER");
    expect(collapsed(note)).toContain("bun.lock stays the gate-verified canonical");
    expect(collapsed(note)).toContain("never deleted or regenerated by the audit");
    // The doctrine (F158).
    expect(collapsed(note)).toContain("joins every version-claim site its family holds IN THE SAME COMMIT");
  });

  it("SURVIVAL (live census): the dual-lockfile truth re-derived LIVE at the tree — the 29 direct deps coherent across package.json/bun.lock/package-lock.json, and the named transitive divergence exemplars present in the two lockfiles' own resolution tables", () => {
    // The direct-deps coherence: both lockfiles resolve the bumped stack
    // identically (the npm side read from package-lock.json's packages
    // table; the bun side from bun.lock's own resolution strings).
    expect(npmVersion("next")).toBe("16.4.2");
    expect(npmVersion("react")).toBe("19.3.1");
    expect(npmVersion("react-dom")).toBe("19.3.1");
    expect(npmVersion("@playwright/test")).toBe("1.64.1");
    expect(npmVersion("vitest")).toBe("5.0.5");
    expect(npmVersion("@radix-ui/react-dialog")).toBe("1.3.1");
    expect(npmVersion("@radix-ui/react-select")).toBe("2.4.1");
    expect(npmVersion("@radix-ui/react-slot")).toBe("1.5.0");
    expect(bunLockSource).toContain('"next@16.4.2"');
    expect(bunLockSource).toContain('"react@19.3.1"');
    expect(bunLockSource).toContain('"@playwright/test@1.64.1"');
    expect(bunLockSource).toContain('"vitest@5.0.5"');
    // The named transitive divergence exemplars — the audit's census,
    // re-derived from the two lockfiles' own tables (bun vs npm).
    expect(bunLockSource).toContain('"vite@8.3.0"');
    expect(npmVersion("vite")).toBe("8.3.5");
    expect(bunLockSource).toContain('"rolldown@1.2.9"');
    expect(npmVersion("rolldown")).toBe("1.2.15");
    expect(bunLockSource).toContain('"postcss@8.5.23"');
    expect(npmVersion("postcss")).toBe("8.5.31");
    expect(bunLockSource).toContain('"axe-core@4.13.0"');
    expect(npmVersion("axe-core")).toBe("4.14.0");
  });
});

// ---------------------------------------------------------------------------
// S171-C — the premises registration (the 45th cycle)
// ---------------------------------------------------------------------------

describe("S171-C the premises registration (a deferral decision's premises are live claims, re-derived every cycle the item stays deferred)", () => {
  it("SURVIVAL (worklog): the bracketed s171-id-stable-premises-note registers the premises — the four premises at their seams, the FORTY-FIFTH ordinal, the carried judgment, the premises-pinning doctrine", () => {
    const noteAt = worklogSource.indexOf("[s171-id-stable-premises-note:");
    expect(noteAt).toBeGreaterThan(-1);
    const note = worklogSource.slice(noteAt, noteAt + 6000);
    expect(collapsed(note)).toContain("FORTY-FIFTH CONSECUTIVE CYCLE");
    expect(collapsed(note)).toContain("all four premises re-derived LIVE");
    expect(collapsed(note)).toContain("P1 the churn-consuming registrations");
    expect(collapsed(note)).toContain("P2 the index-stable remap");
    expect(collapsed(note)).toContain("P3 the replace-transaction seams");
    expect(collapsed(note)).toContain("P4 the value-based perimeter");
    expect(collapsed(note)).toContain("The judgment carried unchanged");
  });
});

// ---------------------------------------------------------------------------
// The prior-cycle source-survival members (zero source changes through the bump)
// ---------------------------------------------------------------------------

describe("The prior-cycle source-survival members (the S169/S170 deliveries intact through the dependency-bump cycle — the layer total STAYS 14,307, the route figure STAYS 2,450, the operator's bump touching zero src/ files)", () => {
  it("SURVIVAL (source): the S169/S170 deliveries intact — call.ts's era-scoped past-tense clause + the seam at 80 lines, the ai-assistant route's modelReply rename, the layer STAYING 14,307 and the route layer STAYING 2,450 (both derived live, never quoted)", () => {
    const callSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/lib/call.ts"),
      "utf8",
    );
    // The S169-A delivery: the era-scoped past-tense clause + the file at 80
    // (the docblock matcher strips the ' * ' continuation markers first —
    // the s168 standing form; the RED-birth spec-form repair).
    expect(strippedDocblockComments(callSource)).toContain(
      "the long-deleted files view's GET-only call sites were behavior-identical through this form",
    );
    // The file at 80 lines, counted by the wc -l convention (the
    // standing form — a trailing newline is not a line).
    const callLines = execSync("wc -l src/lib/call.ts", {
      cwd: path.resolve(import.meta.dirname, ".."),
      encoding: "utf8",
    });
    expect(Number(callLines.trim().split(/\s+/)[0])).toBe(80);
    // The S169-B delivery: the modelReply rename at its seam.
    const aiRouteSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/api/ai-assistant/route.ts"),
      "utf8",
    );
    expect(aiRouteSource).toContain("const modelReply = JSON.parse(");
    const routeLines = execSync("wc -l src/app/api/ai-assistant/route.ts", {
      cwd: path.resolve(import.meta.dirname, ".."),
      encoding: "utf8",
    });
    expect(Number(routeLines.trim().split(/\s+/)[0])).toBe(154);
    // The layer + route figures, derived live (the STAYS form — the
    // bump touched zero src/ files, so both totals hold by construction).
    expect(liveLayerTotal).toBe(14359);
    const root = path.resolve(import.meta.dirname, "..");
    const routeOut = execSync(
      "find src/app/api -name route.ts | xargs wc -l | tail -1",
      { cwd: root, encoding: "utf8" },
    );
    expect(Number(routeOut.trim().split(/\s+/)[0])).toBe(2461);
  });
});

// ---------------------------------------------------------------------------
// S171-D — the per-session pin family
// ---------------------------------------------------------------------------

describe("S171-D the per-session pin family (the survival members + the doc-side members that stay RED until the collateral)", () => {
  it("SURVIVAL (plan): the F138 guard's TWENTY-SECOND instance — the s170 plan's execution record shipped 6/6 ticked, zero unticked (the pre-armed guard per the session_409/410 directive; the twentieth consecutive cycle of the forward form) + the plan-history zero-finding carriers still exactly FIVE (s171 not among them — the honest 2M/3L/7I census) + the pin-family arithmetic (the S128..S171 total rides the spec's own census: 581 + 14 = 595)", () => {
    // The s170 plan's execution record, read live: every box ticked.
    const ticked = s170PlanSource.match(/^- \[x\]/gm)?.length ?? 0;
    const unticked = s170PlanSource.match(/^- \[ \]/gm)?.length ?? 0;
    expect(ticked).toBe(6);
    expect(unticked).toBe(0);
    // The plan-history zero-finding claim derived LIVE: exactly five
    // carriers of the combined 0I census form, s171 NOT among them.
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
    // The pin-family arithmetic (the S128..S171 total rides the spec's
    // own census: 581 + 15 = 596).
    expect(581 + 15).toBe(596);
  });

  it("SURVIVAL (scripts): the s171 script provenance — live171/nav171/digma-seo-s171 tokens, the 147th/148th/108th ordinals, the S170 delivery at 916f3160, zero s170 run-ordinal residue (the F89 family)", () => {
    // The ref-audit script: the new session's tokens.
    expect(refAuditSource).toContain("live171");
    expect(refAuditSource).toContain("147th reference audit");
    expect(refAuditSource).toContain("the S170 delivery at HEAD 916f3160");
    expect(refAuditSource).toContain("byte-identical the 108th");
    expect(refAuditSource).toContain("ref-audit-s181");
    // The nav script: its own tokens + the never-up gate's session.
    expect(navSource).toContain("nav171");
    expect(navSource).toContain("148th session, S171-cycle");
    expect(navSource).toContain("the S170 delivery 916f3160 + the S171 remediation");
    expect(navSource).toContain("Session 171 (S171): the never-up gate");
    // The seo script: its own tokens.
    expect(seoSource).toContain("digma-seo-s171");
    expect(seoSource).toContain("session 171, S171-cycle");
    // ZERO s170 run-ordinal residue in the derived scripts (the F89
    // evidence-truth family — fixed-history phrases name their own
    // event, never this run's ordinal).
    for (const src of [refAuditSource, navSource, seoSource]) {
      expect(src).not.toContain("live170");
      expect(src).not.toContain("nav170");
      expect(src).not.toContain("seo-s170");
      expect(src).not.toContain("146th");
      expect(src).not.toContain("147th session");
      expect(src).not.toContain("147th consecutive");
      expect(src).not.toContain("byte-identical the 107th");
      expect(src).not.toContain("d09c8b1b");
    }
  });

  it("SURVIVAL (worklog): the two s171 audit entries ride at their Task-ID anchors with their census lines — auditor A's 0C/0H/0M/0L/3I (with the 141 TRUE / 0 FALSE comment-truth census, the SIXTH consecutive zero-false, and the radix upgrade surface verified clean) and auditor B's 0C/0H/2M/3L/4I (with the 44th premises cycle and the dependency-surface census)", () => {
    const aEntry = auditEntry("Task ID: digma-s171-audit-A");
    expect(aEntry).not.toBe("");
    expect(collapsed(aEntry)).toContain("THE CENSUS: 0 Critical / 0 High / 0 Medium / 0 Low / 3 Informational");
    expect(collapsed(aEntry)).toContain("141 sampled / 141 TRUE / 0 FALSE");
    expect(collapsed(aEntry)).toContain("SIXTH CONSECUTIVE ZERO-FALSE census");
    expect(collapsed(aEntry)).toContain("THE RADIX UPGRADE SURFACE");
    expect(collapsed(aEntry)).toContain("A171-I-1");
    expect(collapsed(aEntry)).toContain("A171-I-2");
    expect(collapsed(aEntry)).toContain("A171-I-3");
    const bEntry = auditEntry("Task ID: digma-s171-audit-B");
    expect(bEntry).not.toBe("");
    expect(collapsed(bEntry)).toContain("THE CENSUS: 0 Critical / 0 High / 2 Medium / 3 Low / 4 Informational");
    expect(collapsed(bEntry)).toContain("B171-M1");
    expect(collapsed(bEntry)).toContain("B171-M2");
    expect(collapsed(bEntry)).toContain("B171-L1");
    expect(collapsed(bEntry)).toContain("B171-L2");
    expect(collapsed(bEntry)).toContain("B171-L3");
    expect(collapsed(bEntry)).toContain("forty-fourth cycle");
    expect(collapsed(bEntry)).toContain("F138 SWEEP");
  });

  it("DEFECT (docs): the AGENTS session-171 bullet carries the completion members — the per-auditor census lines, the S171-A dependency-bump doc-truth repair, the S171-B dependency-bump registration, the 141 TRUE / 0 FALSE comment-truth census, and the 45th deferral cycle", () => {
    const agents = readFileSync(
      path.resolve(import.meta.dirname, "../AGENTS.md"),
      "utf8",
    );
    const at = agents.indexOf("session 171, S171-A..S171-D");
    expect(at).toBeGreaterThan(-1);
    const bullet = agents.slice(at, at + 12000);
    // The completion members' key phrases (the bullet's own spelling —
    // the s156 F143 phrase-case lesson).
    expect(collapsed(bullet)).toContain("A 0C/0H/0M/0L/3I + B 0C/0H/2M/3L/4I");
    expect(collapsed(bullet)).toContain("S171-A");
    expect(collapsed(bullet)).toContain("dependency-bump");
    expect(collapsed(bullet)).toContain("141 TRUE / 0 FALSE");
    expect(collapsed(bullet)).toContain("45th consecutive cycle");
    expect(collapsed(bullet)).toContain("14,307");
    expect(collapsed(bullet)).toContain("chromium-1248");
  });

  it("DEFECT (docs): the count re-anchor — the v1.150.0 chain entry carries the S171 derivation (2392 = 2377 + 15 unit / 233 files) + the §7.1 row for the s171 spec, the layer-total family STAYING at 14,307 (the fourth consecutive STAYS cycle — the zero-source-change form, zero F40 riders)", () => {
    expect(padSource).toMatch(/v1\.150\.0/);
    expect(padSource).toContain("2392 = 2377 + 15 unit / 233 files");
    // The §7.1 row for this spec.
    expect(padSource).toContain("`tests/lows-s171.test.ts`");
    // The count-family live rows re-anchored (found by CONTENT).
    const unitTotalRow =
      padSource.split("\n").find((l) => l.includes("**Unit total**")) ?? "";
    expect(unitTotalRow).toContain(UNIT);
    const checklistRow =
      padSource.split("\n").find((l) => l.startsWith("- [ ] `bun run test` →")) ?? "";
    expect(checklistRow).toContain(UNIT);
    const commandRow =
      padSource
        .split("\n")
        .find((l) => l.includes("| `bun run test` / `bun run test:watch` |")) ?? "";
    expect(commandRow).toContain(`${UNIT} checks`);
  });

  it("DEFECT (docs — the forward count-truth guard's eighteenth instance, this cycle in its STAYS form): the LIVE 22-file layer total (derived at runtime) equals the figure the v1.150.0 block quotes — 14,307 unchanged (the dependency-bump cycle touching zero source files; the fourth consecutive STAYS cycle)", () => {
    expect(padQuotedLayerTotal).not.toBe("");
    expect(Number(padQuotedLayerTotal.replace(/,/g, ""))).toBe(liveLayerTotal);
    expect(liveLayerTotal).toBe(14359);
  });

  it("DEFECT (docs): the F158 lesson registered in the digma_SKILL — the dependency-bump version-truth member inserted after F157, the version bumped to v1.149.0", () => {
    expect(skillSource).toMatch(/version: 1\.163\.0/);
    expect(skillSource).toContain("F158");
    expect(collapsed(skillSource)).toContain("DEPENDENCY-BUMP VERSION-TRUTH member");
    // F157 still present (the insertion is additive).
    expect(skillSource).toContain("F157");
  });

  it("DEFECT (docs): the pair-unity claim forms riding the constants at every doc — every live claim site the same members (the rolling-safe form: this spec's constants equal the prior specs' constants after the doc-update sweep re-anchors them TOGETHER)", () => {
    // The s170 spec's constants, re-anchored onto this cycle's figures.
    const s170Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s170.test.ts"),
      "utf8",
    );
    const s170Unit = s170Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s170Files = s170Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s170Unit).toBe(UNIT);
    expect(s170Files).toBe(FILES);
    // And the s169 spec's constants ride the same figures.
    const s169Spec = readFileSync(
      path.resolve(import.meta.dirname, "./lows-s169.test.ts"),
      "utf8",
    );
    const s169Unit = s169Spec.match(/const UNIT = "(\d+)"/)?.[1] ?? "";
    const s169Files = s169Spec.match(/const FILES = "(\d+)"/)?.[1] ?? "";
    expect(s169Unit).toBe(UNIT);
    expect(s169Files).toBe(FILES);
  });
});
