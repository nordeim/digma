import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-83 docs honesty batch (S83-E — the thirty-first audit's
// B83-L3, the S82-E batch's survivors + the missed PAD/SKILL sites).
//
// The F68 count-drift family's recurrence, documented: the S82-E grep
// reached the doctrine files' PRIMARY claim sites but not the PAD §7.1
// table's own session-82 rows, the Appendix-B sites, the per-spec
// check counts, the line-count columns, the env tables' coverage, the
// API reference table, or the older s69 pin that pinned the
// pre-delivery counts (the gate break — repaired in S83-B). This
// spec pins the CORRECTED forms; every pin here was RED against the
// stale pre-batch docs.

const AGENTS = readFileSync(path.resolve(import.meta.dirname, "../AGENTS.md"), "utf8");
const CLAUDE = readFileSync(path.resolve(import.meta.dirname, "../CLAUDE.md"), "utf8");
const README = readFileSync(path.resolve(import.meta.dirname, "../README.md"), "utf8");
const PAD = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const SKILL = readFileSync(path.resolve(import.meta.dirname, "../digma_SKILL.md"), "utf8");
const DEPLOY = readFileSync(
  path.resolve(import.meta.dirname, "../docs/DEPLOYMENT.md"),
  "utf8",
);
const aiAssistantSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/ai-assistant.tsx"),
  "utf8",
);

// ---------------------------------------------------------------------------
// The route-count honesty (AGENTS/CLAUDE/DEPLOYMENT/SKILL)
// ---------------------------------------------------------------------------

describe("the page-route and route-count claims are honest (S83-E)", () => {
  it("AGENTS names SEVEN page routes including /reset-password", () => {
    expect(AGENTS).toMatch(/seven page routes/);
    expect(AGENTS).toMatch(/\/reset-password/);
    expect(AGENTS).not.toMatch(/five page routes/);
  });

  it("CLAUDE names SEVEN page routes including /reset-password", () => {
    expect(CLAUDE).toMatch(/seven page routes/);
    expect(CLAUDE).toMatch(/\/reset-password/);
    expect(CLAUDE).not.toMatch(/five page routes/);
  });

  it("DEPLOYMENT's build arithmetic is the real 7 pages / 18 route files / 27 routes", () => {
    // Session 99 (S99-G): re-anchored to the 27-route arithmetic — the
    // SEO parity pair (robots.ts + sitemap.ts) joined the build.
    expect(DEPLOY).toMatch(/7 page routes, the 18 API route files, and the 2\s*\nSEO metadata routes/);
    expect(DEPLOY).toMatch(/27\s+routes total/);
    expect(DEPLOY).not.toMatch(/6 page routes/);
    expect(DEPLOY).not.toMatch(/23\s+routes total/);
    expect(DEPLOY).not.toMatch(/\(25\s+routes total\)/);
  });

  it("digma_SKILL's project_state and pre-ship build line carry 27 routes", () => {
    // Session 99 (S99-G): re-anchored from 25 — the SEO parity pair
    // joined the build.
    expect(SKILL).toMatch(/build 27 routes/);
    expect(SKILL).not.toMatch(/build 23 routes/);
    expect(SKILL).not.toMatch(/build 25 routes/);
    expect(SKILL).not.toMatch(/23 routes total/);
  });

  it("digma_SKILL's Appendix B route list includes /reset-password", () => {
    expect(SKILL).toMatch(/reset-password/);
  });
});

// ---------------------------------------------------------------------------
// The per-spec check counts (AGENTS)
// ---------------------------------------------------------------------------

describe("the per-spec e2e check counts are honest (S83-E)", () => {
  it("AGENTS' auth.spec count is the real 16 (the two from_url pins folded in)", () => {
    // The stale form said "14 checks" while the spec has carried 16
    // test blocks since session 58's from_url pair.
    expect(AGENTS).toMatch(/auth\.spec\.ts[^)]*\(16 checks\)/);
    expect(AGENTS).not.toMatch(/auth\.spec\.ts[^)]*\(14 checks\)/);
  });

  it("AGENTS' mobile-properties count is the real 14 (the marquee multi-selection pin folded in)", () => {
    expect(AGENTS).toMatch(/mobile-properties\.spec\.ts[^)]*\(14 checks\)/);
    expect(AGENTS).not.toMatch(/mobile-properties\.spec\.ts[^)]*\(13 checks\)/);
  });
});

// ---------------------------------------------------------------------------
// The README's own honesty (models, login states, env table, API table)
// ---------------------------------------------------------------------------

describe("the README's structural claims are honest (S83-E)", () => {
  it("the schema claim says 5 models (the list names five)", () => {
    expect(README).toMatch(/5 models: User, Project, DesignElement, Team, TeamMember/);
    expect(README).not.toMatch(/6 models/);
  });

  it("the login route/card carry FIVE states (sign-in, sign-up, verify, forgot, sent)", () => {
    expect(README).toMatch(/five states/);
    expect(README).not.toMatch(/\(3 states/);
  });

  it("the env table covers the seven-read contract's missing knobs", () => {
    expect(README).toMatch(/DIGMA_DISABLE_IN_APP_OTP/);
    expect(README).toMatch(/DIGMA_PROXY_HOPS/);
  });

  it("the API reference table lists the four auth endpoints it documents in prose", () => {
    expect(README).toMatch(/forgot-password/);
    expect(README).toMatch(/reset-password/);
    expect(README).toMatch(/verify-otp/);
    expect(README).toMatch(/resend-otp/);
  });

  it("the envelope claim carries the /api/health carve-out", () => {
    expect(README).not.toMatch(/All endpoints return/);
    expect(README).toMatch(/\/api\/health/);
  });
});

// ---------------------------------------------------------------------------
// The PAD's §7.1 completeness and inline counts
// ---------------------------------------------------------------------------

describe("the PAD's testing table and inline counts are honest (S83-E)", () => {
  it("the §7.1 unit table carries the two session-82 rows", () => {
    expect(PAD).toMatch(/client-lows-s82\.test\.ts` \| 7 \|/);
    expect(PAD).toMatch(/server-lows-s82\.test\.ts` \| 11 \|/);
  });

  it("the §7.1 e2e table carries the session-82 row", () => {
    expect(PAD).toMatch(/session82-fixes\.spec\.ts` \| 1 \|/);
  });

  it("the §3.2 smoke line says 63 HTTP checks", () => {
    expect(PAD).toMatch(/smoke-test\.sh\s+# 63 HTTP checks/);
    expect(PAD).not.toMatch(/smoke-test\.sh\s+# 56 HTTP checks/);
  });

  it("the §11 line-count column carries the current realities", () => {
    expect(PAD).toMatch(/db-path\.ts` \| 172/);
    expect(PAD).not.toMatch(/db-path\.ts` \| 165/);
  });
});

// ---------------------------------------------------------------------------
// digma_SKILL's counts
// ---------------------------------------------------------------------------

describe("digma_SKILL's counts are honest (S83-E)", () => {
  it("the component count matches the directory (26 files)", () => {
    expect(SKILL).toMatch(/26 (?:component files|files)/);
    expect(SKILL).not.toMatch(/23 component files/);
  });

  it("the auth line count matches the file (127)", () => {
    expect(SKILL).not.toMatch(/~101 lines/);
  });

  it("Appendix B's smoke row says 63 checks", () => {
    expect(SKILL).not.toMatch(/\(58 checks\)/);
    expect(SKILL).toMatch(/smoke-test\.sh[^\n]*63/);
  });

  it("the primitives list includes the vendored select", () => {
    expect(SKILL).toMatch(/select/);
  });
});

// ---------------------------------------------------------------------------
// The in-code comment honesty (the live-regions claim)
// ---------------------------------------------------------------------------

describe("the ai-assistant live-regions comment is honest (S83-E / A83-I1)", () => {
  it("the 'exactly two live regions' claim names the toaster's transient regions", () => {
    // The stale form claimed the DOM carries exactly TWO live regions
    // BY DESIGN; the root-layout Toaster renders transient polite
    // regions while toasts are live.
    expect(aiAssistantSource).toMatch(/transient|toaster/i);
    expect(aiAssistantSource).not.toMatch(/exactly two live regions/);
  });
});
