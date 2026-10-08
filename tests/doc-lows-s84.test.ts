import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-84 docs honesty batch (S84-E — the thirty-second audit's
// B84-L1 doctrine half + the delivery counts).
//
// The F68/F70 count-drift family's discipline: every count claim is
// pinned at DELIVERY time with the realized counts, and the family
// grep reaches BOTH the doctrine files AND the tests that pin the
// numbers. This cycle's own member: the auth-call BUDGET's arithmetic
// itself miscounted at four sites (the RA-59 forgot POST rode the
// shared bucket at 10 of 10 while the comments said 9) — the repair
// moves the call into its own bucket and the claims gain the honest
// carve-out enumeration.

const AGENTS = readFileSync(path.resolve(import.meta.dirname, "../AGENTS.md"), "utf8");
const CLAUDE = readFileSync(path.resolve(import.meta.dirname, "../CLAUDE.md"), "utf8");
const README = readFileSync(path.resolve(import.meta.dirname, "../README.md"), "utf8");
const PAD = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);
const SKILL = readFileSync(path.resolve(import.meta.dirname, "../digma_SKILL.md"), "utf8");

// Session 90 (S90-D): re-anchored to the session-90 delivery counts —
// 1131 unit (1123 + client-lows-s90 8 — the S90-A doc-honesty pins +
// the S90-B calendar-independence pins) / 152 files (+1) / 63 smoke
// (unchanged) / 262 e2e (unchanged); the intents (the docs carry the
// DELIVERED counts) unchanged.
// Session 89 (S89-C): re-anchored to the session-89 delivery counts —
// 1123 unit (1112 + client-lows-s89 6 + doc-lows-s89 5 — the S89-A
// cap-mirror pins + the S89-B marker-widening pins) / 151 files (+2)
// / 63 smoke (unchanged) / 262 e2e (unchanged); the intents (the docs
// carry the DELIVERED counts) unchanged.
// Session 88 (S88-F): re-anchored to the session-88 delivery counts —
// 1112 unit (1098 + editor-lows-s88 7 + doc-lows-s88 5 + doc-lows-s87
// +2 — the S88-B coverage/exemption pins) / 149 files (+2) / 63 smoke
// (unchanged) / 262 e2e (unchanged); the intents (the docs carry the
// DELIVERED counts) unchanged.
// Session 85 (S85-F): re-anchored to the session-85 delivery counts —
// 1047 unit (1024 + the FILES pin +1 here, editor-lows-s85 +13,
// doc-lows-s85 +9) / 143 files (+2) / 63 smoke (unchanged) / 262 e2e
// (+2 — the session85-fixes re-entry discriminators); the intents (the
// docs carry the DELIVERED counts) unchanged.
// Session 91 (S91-D): re-anchored to the session-91 delivery counts —
// 1141 unit (1131 + doc-lows-s91 10 — the S91-A count-family two-shape
// pins + the S91-B editor-* doctrine conditional pins) / 153 files (+1)
// / 63 smoke (unchanged) / 262 e2e (unchanged); the intents (the docs
// carry the DELIVERED counts) unchanged.
const UNIT = "1141";
// Session 85 (S85-E / A85-I1): the constant was "140" — dead (never
// asserted) AND wrong — a dead wrong copy one edit away from becoming
// a live wrong pin. Corrected and made LIVE (the pin below asserts it
// against the PAD §7.1 total row DYNAMICALLY).
const FILES = "153";
const SMOKE = "63";
const E2E = "262";

// ---------------------------------------------------------------------------
// The auth-call budget's honest enumeration (S84-A's doctrine half)
// ---------------------------------------------------------------------------

describe("the auth-call budget claims name the RA-59 carve-out (S84-A / B84-L1)", () => {
  it("AGENTS names session 84's RA-59 bucket in the budget enumeration", () => {
    // Pre-fix: the site says "session 46's reset spec declares its own"
    // and stops — the RA-59 carve-out is absent.
    expect(AGENTS).toMatch(/session 84's RA-59 forgot round-trip/);
    expect(AGENTS).toMatch(/shared-bucket TOTAL auth calls at 9 of 10/);
  });

  it("CLAUDE names session 84's RA-59 bucket in the budget enumeration", () => {
    expect(CLAUDE).toMatch(/session 84's RA-59 forgot round-trip/);
    expect(CLAUDE).toMatch(/shared-bucket calls at 9 of 10/);
  });

  it("PAD's ADR-14 consequences block names session 84's RA-59 bucket", () => {
    expect(PAD).toMatch(/session 84's RA-59 forgot round-trip/);
  });
});

// ---------------------------------------------------------------------------
// The delivery counts (the F68 discipline — delivery-time reality)
// ---------------------------------------------------------------------------

describe("the delivery counts are honest (S84-E — the live UNIT/FILES/SMOKE/E2E constants)", () => {
  it("AGENTS' commands table and gate order carry 1098", () => {
    expect(AGENTS).toMatch(new RegExp(`\\| Unit tests \\(${UNIT} checks\\) \\|`));
    expect(AGENTS).toMatch(new RegExp("bun run test` \\(" + UNIT + "\\)"));
  });

  it("CLAUDE's table, gate order, and unit-tests line carry 1098", () => {
    expect(CLAUDE).toMatch(new RegExp(`\\| \`bun run test\` \\| Unit tests \\(${UNIT} checks, Vitest\\) \\|`));
    expect(CLAUDE).toMatch(new RegExp(`${UNIT} unit / ${SMOKE} smoke / ${E2E} e2e`));
    expect(CLAUDE).toMatch(new RegExp(`\\*\\*Unit Tests\\*\\* \\(Vitest, ${UNIT} checks\\)`));
  });

  it("README's tech-stack row and quick-start command comment carry 1098", () => {
    expect(README).toMatch(new RegExp(`\\| Unit tests \\| Vitest \\| 5 \\| ${UNIT} checks`));
    expect(README).toMatch(new RegExp(`unit tests — ${UNIT} checks on the pure domain seams`));
  });

  it("digma_SKILL's project_state carries the 1098 delivery count", () => {
    expect(SKILL).toMatch(new RegExp(`${UNIT} unit`));
    expect(SKILL).toMatch(new RegExp(`\\| Unit tests \\| Vitest \\| [^|]*\\| ${UNIT} checks`));
  });

  it("the 147-files claims — AGENTS' seam bullet and PAD's §7.1 total row (S85-E / A85-I1: the FILES constant made live)", () => {
    // Session 85: the FILES constant was "140" — dead AND wrong. It now
    // pins the live file-count family DYNAMICALLY (the constant must
    // always equal the PAD §7.1 total row's file count — the same
    // totals the row-sum pin in doc-lows-s85.test.ts guards
    // structurally); AGENTS carries the same count in its seam bullet.
    const padTotalFiles = PAD.match(/\| \*\*Unit total\*\* \| \*\*(\d+) files\*\*/)?.[1];
    expect(FILES).toBe(padTotalFiles);
    expect(AGENTS).toMatch(new RegExp(`${padTotalFiles} files`));
  });

  it("the negative forms — no stale 994 claims survive outside historical records", () => {
    // The F70 closure: grep the doctrine files for the stale number —
    // historical session logs / revision blocks carry their own time's
    // counts and stay; the LIVE claim sites must all read 1098. A
    // TRANSITION record ("994 -> 1024") is an honest delivery note,
    // not a current-state claim — the forms are stripped before the
    // negative check.
    const stripTransitions = (s: string) => s.replace(/994 -> \d+/g, "");
    const liveAgents = stripTransitions(AGENTS.replace(/^.*session 83.*$/gm, ""));
    expect(liveAgents).not.toMatch(/\b994\b/);
    const liveClaude = stripTransitions(CLAUDE.replace(/^.*session 83.*$/gm, ""));
    expect(liveClaude).not.toMatch(/\b994\b/);
    expect(README).not.toMatch(/\b994\b/);
  });
});

// ---------------------------------------------------------------------------
// The session-84 seam bullet (the AGENTS architecture-facts family)
// ---------------------------------------------------------------------------

describe("AGENTS carries the session-84 seam bullet (S84-E)", () => {
  it("the bullet names the four slices with their finding IDs", () => {
    expect(AGENTS).toMatch(/session 84, S84-A\.\.S84-F/);
    expect(AGENTS).toMatch(/RA-59 forgot round-trip[\s\S]{0,800}declaring its own `X-Forwarded-For` bucket/);
    expect(AGENTS).toMatch(/clampPositionField|number-field clamp/);
    expect(AGENTS).toMatch(/delete|deletes[\s\S]{0,60}HOSTNAME|HOSTNAME/);
  });
});
