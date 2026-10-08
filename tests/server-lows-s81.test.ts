import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-81 server low batch (S81-C — the twenty-ninth audit's
// B81-L1 + B81-I2 + the S81-E docs-honesty pins).
//
// S81-C / B81-L1 — THE DEFECT: the smoke suite pinned the AI
// fallback's exact output (len(ops) == 3, all op == "add") while the
// smoke server booted WITHOUT DIGMA_DISABLE_AI_LLM=1 — the LLM path
// was live. playwright.config.ts forces the knob with the explicit
// documented rationale ("the z-ai SDK is REACHABLE from the
// standalone server … free-form replies make every AI assertion
// non-deterministic") — the smoke gate carried the same
// nondeterminism: when the LLM won with a differently-shaped reply
// the suite failed spuriously; when it happened to return 3 adds, a
// check named "fallback" actually tested the LLM.
//
// THE FIX: the smoke boot line gains DIGMA_DISABLE_AI_LLM=1 — the
// e2e posture extended to the smoke gate.
//
// B81-I2 — the pin-precision tightening: the three S80-D header
// pins' `\^?` optional anchors tightened to the literal `^` form
// (a future edit dropping the shipped grep's line-start anchor
// would otherwise keep the pins green — edited IN PLACE in
// server-lows-s80.test.ts, the pin-precision family).
//
// S81-E — the docs-honesty pins live here too (the corrected counts
// at the eleven stale sites — see the end of this file).

const smoke = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/smoke-test.sh"),
  "utf8",
);

// ---------------------------------------------------------------------------
// S81-C — the smoke gate forces the fallback path
// ---------------------------------------------------------------------------

describe("the smoke server boots with the AI knob forced (S81-C / B81-L1)", () => {
  it("the boot line carries DIGMA_DISABLE_AI_LLM=1", () => {
    // THE DEFECT PIN: pre-fix the boot env omitted the knob — the
    // LLM path was live under an exact-output assertion.
    const bootSite = smoke.indexOf(".next/standalone/server.js");
    expect(bootSite).toBeGreaterThanOrEqual(0);
    // The boot invocation's env prefix (the same logical line).
    const lineStart = smoke.lastIndexOf("\n", bootSite) + 1;
    const lineEnd = smoke.indexOf("\n", bootSite);
    const bootLine = smoke.slice(lineStart, lineEnd);
    expect(bootLine).toMatch(/DIGMA_DISABLE_AI_LLM=1/);
  });

  it("the knob's value is the documented degrade form (1 — the deterministic fallback parser)", () => {
    // The knob must be the active degrade, not a falsy declaration.
    expect(smoke).toMatch(/DIGMA_DISABLE_AI_LLM=["']?1["']?/);
  });

  it("the smoke header documents the hermeticity contract (re-seed after the run)", () => {
    // B81-I3: the suite registers 3 users + bumps the demo
    // tokenVersion — the re-seed-after-smoke discipline, now
    // documented in the header comment instead of living only in
    // the session logs.
    const header = smoke.slice(0, smoke.indexOf('set -u'));
    expect(header).toMatch(/re-?seed/i);
  });
});

// ---------------------------------------------------------------------------
// The S80-D anchor-precision cross-check (B81-I2 — the tightened
// pins live in server-lows-s80.test.ts; this block re-verifies the
// SHIPPED grep forms the pins must match exactly)
// ---------------------------------------------------------------------------

describe("the shipped smoke header greps stay line-start anchored (B81-I2 cross-check)", () => {
  it("all three header greps carry the literal ^ anchor", () => {
    const sites = [...smoke.matchAll(/grep -qi "\^?[a-z-]+:/g)].map((m) => m[0]);
    expect(sites.length).toBeGreaterThanOrEqual(3);
    // Every shipped form is anchored — the tightened pins' target.
    for (const s of sites) {
      expect(s).toMatch(/grep -qi "\^/);
    }
  });
});

// ---------------------------------------------------------------------------
// S81-E — the docs-honesty pins (the eleven stale count sites)
// ---------------------------------------------------------------------------

const readme = readFileSync(
  path.resolve(import.meta.dirname, "../README.md"),
  "utf8",
);
const agents = readFileSync(
  path.resolve(import.meta.dirname, "../AGENTS.md"),
  "utf8",
);
const claude = readFileSync(
  path.resolve(import.meta.dirname, "../CLAUDE.md"),
  "utf8",
);
const pad = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const skill = readFileSync(
  path.resolve(import.meta.dirname, "../digma_SKILL.md"),
  "utf8",
);

// The session-81 delivery counts — written at delivery time (the
// realized totals after the S81 slices land): 943 unit / 61 smoke /
// 259 e2e. (Adjust here if the realized totals differ — the pins
// must always match the DELIVERED reality.)
// Session 82: re-anchored to the session-82 delivery counts —
// 961 unit (+18) / 63 smoke (+2 the body-cap probes) / 260 e2e
// (+1 the open-Select discriminator); the intents (the docs carry
// the DELIVERED counts) unchanged.
// Session 83: re-anchored to the session-83 delivery counts —
// 994 unit (+33: the client-lows-s83 isTypingTarget behavioral
// family 6, the server-lows-s83 hermeticity + hash-before-tx pins
// 6, the doc-lows-s83 docs-honesty pins 21) / 63 smoke (unchanged)
// / 260 e2e (unchanged — the color carve-out rides the unit
// behavioral pin, the S64-G sibling's own form); the intents
// unchanged.
// Session 84: re-anchored to the session-84 delivery counts —
// 1024 unit (+29: the client-lows-s84 clamp behavioral + source +
// survival family and the dashboard date pin 10, the server-lows-s84
// hermetic-HOSTNAME + derived-name + auth.spec-carve-out pins 10)
// / 63 smoke (unchanged) / 260 e2e (unchanged — the RA-59
// re-bucketing moves a test between describes, adds none); the
// intents (the docs carry the DELIVERED counts) unchanged.
// Session 90 (S90-D): re-anchored again — 1131 unit / 152 files /
// 63 smoke (unchanged) / 262 e2e (unchanged — the one new UNIT spec
// file: client-lows-s90 8); the intents unchanged.
// Session 89 (S89-C): re-anchored again — 1123 unit / 151 files /
// 63 smoke (unchanged) / 262 e2e (unchanged — the two new UNIT spec
// files: client-lows-s89 6 + doc-lows-s89 5); the intents unchanged.
// Session 88 (S88-F): re-anchored again — 1112 unit / 149 files /
// 63 smoke (unchanged) / 262 e2e (unchanged — the two new UNIT spec
// files: editor-lows-s88 7 + doc-lows-s88 5, plus doc-lows-s87 +2);
// the intents unchanged.
// Session 87 (S87-F): re-anchored again — 1098 unit / 147 files /
// 63 smoke (unchanged) / 262 e2e (unchanged — the two new UNIT spec
// files: editor-lows-s87 16 + doc-lows-s87 6); the intents unchanged.
// Session 85 (S85-F): re-anchored again — 1047 unit / 143 files /
// 63 smoke (unchanged) / 262 e2e (+2 — the session85-fixes re-entry
// discriminators); the intents unchanged.
// Session 91 (S91-D): re-anchored again — 1141 unit / 153 files /
// 63 smoke (unchanged) / 262 e2e (unchanged — doc-lows-s91 +10, the
// S91-A count-family two-shape pins + the S91-B doctrine conditional);
// the intents unchanged.
// Session 93 (S93-E): re-anchored — 1158 unit / 155 files (the s93
// delivery's editor-utilities-s93 +8).
// Session 92 (S92-E): re-anchored again — 1150 unit / 154 files /
// 63 smoke (unchanged) / 262 e2e (unchanged — lows-s92 +9, the S92
// low-batch pins); the intents unchanged.
const UNIT = "1212";
const SMOKE = "63";
const E2E = "262";

describe("the stale-count family is corrected (S81-E / B81-L-family)", () => {
  it("README: the tech-stack table's unit row and e2e row carry the real counts", () => {
    // Pre-fix: "724 checks" (README:139) and "245 browser checks"
    // (README:140) — the session-77-era numbers.
    expect(readme).toMatch(new RegExp(`\\| Unit tests \\| Vitest \\| [^|]*\\| ${UNIT} checks`));
    expect(readme).toMatch(new RegExp(`\\| E2E tests \\| Playwright \\| [^|]*\\| ${E2E} browser checks`));
  });

  it("README: the smoke count sites (173 / 319 / 326) carry the live SMOKE constant", () => {
    // Pre-fix: "58-check" / "58 checks" x3.
    const count58 = readme.match(/\b58[- ]check|\b58 checks/g) ?? [];
    expect(count58.length).toBe(0);
    expect(readme).toMatch(new RegExp(`${SMOKE}-check E2E suite`));
    expect(readme).toMatch(new RegExp(`${SMOKE} checks against the production build`));
    expect(readme).toMatch(new RegExp(`runs ${SMOKE} checks`));
  });

  it("AGENTS: the commands table's e2e row carries the live E2E constant", () => {
    // Pre-fix: "Browser E2E (256 checks" (AGENTS:16).
    expect(agents).toMatch(new RegExp(`Browser E2E \\(${E2E} checks`));
  });

  it("CLAUDE: the test-pyramid bullets carry the real counts", () => {
    // Pre-fix: "(Vitest, 796 checks)" (CLAUDE:106), "(Playwright, 245
    // checks)" (CLAUDE:108), "(58 checks" (CLAUDE:107).
    expect(claude).toMatch(new RegExp(`Vitest, ${UNIT} checks`));
    expect(claude).toMatch(new RegExp(`Playwright, ${E2E} checks`));
    expect(claude).toMatch(new RegExp(`Smoke Tests\\*+ \\(${SMOKE} checks`));
  });

  it("CLAUDE: the commands table's smoke row carries the live SMOKE constant", () => {
    // Pre-fix: "58-check HTTP smoke suite" (CLAUDE:98).
    expect(claude).toMatch(new RegExp(`${SMOKE}-check HTTP smoke suite`));
  });

  it("PAD: the §7.1 smoke row and the §7.4 checklist carry the real counts", () => {
    // Pre-fix: the smoke row "58" (PAD:2238); the §7.4 checklist
    // "117/117" / "35/35" / "128/128" (PAD:2255-2258).
    expect(pad).toMatch(new RegExp(`\\| Smoke — HTTP surface \\| \`scripts/smoke-test.sh\` \\| ${SMOKE} \\|`));
    expect(pad).toMatch(new RegExp(`bun run test\` → ${UNIT}/${UNIT}`));
    expect(pad).toMatch(new RegExp(`./scripts/smoke-test.sh\` → ${SMOKE}/${SMOKE}`));
    expect(pad).toMatch(new RegExp(`bun run test:e2e\` → ${E2E}/${E2E}`));
  });

  it("digma_SKILL: the §2 tool table carries the real counts", () => {
    // Pre-fix: "74 checks" / "79 checks" (digma_SKILL:71-72).
    expect(skill).toMatch(new RegExp(`\\| Unit tests \\| Vitest \\| [^|]*\\| ${UNIT} checks`));
    expect(skill).toMatch(new RegExp(`\\| E2E tests \\| Playwright \\| [^|]*\\| ${E2E} checks`));
  });

  it("DEPLOYMENT: the db:push hazard is called out (B81-I4)", () => {
    const deployment = readFileSync(
      path.resolve(import.meta.dirname, "../docs/DEPLOYMENT.md"),
      "utf8",
    );
    expect(deployment).toMatch(/accept-data-loss/);
  });
});
