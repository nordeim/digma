import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The Create-Team inline member email validation (session 60, S60-C —
// the eighth Mode C audit's B-L-1).
//
// The Create-Team POST gated on a raw truthy body?.memberEmail and
// wrote email: the text clamp with NO format check, while the
// sibling invite route (members/route.ts) validates
// /^[^\s@]+@[^\s@]+\.[^\s@]+$/ and 400s. The Create Team dialog sends
// unvalidated input, so "abc" in the Create Team dialog silently
// created a garbage member while the same input in the Invite Member
// dialog was rejected with "Enter a valid email address".
//
// The fix: the inline first-member creation validates the email with
// the SAME regex the members route enforces — an invalid memberEmail
// returns the same fail("VALIDATION", "Enter a valid email address",
// 400); the two invite paths answer identically.

const teamsRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/teams/route.ts"),
  "utf8",
);
const membersRouteSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/teams/[id]/members/route.ts"),
  "utf8",
);

describe("the Create-Team inline member email validation (session 60, S60-C / B-L-1)", () => {
  it("the create path validates memberEmail BEFORE creating the member", () => {
    // THE DEFECT PIN: pre-fix the create path had no email format check
    // at all — only the raw truthy gate.
    const createIndex = teamsRouteSource.indexOf("body?.memberEmail");
    expect(createIndex).toBeGreaterThan(-1);
    const validateIndex = teamsRouteSource.indexOf(
      "/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/",
    );
    expect(validateIndex).toBeGreaterThan(-1);
    // The validation guards the create (before the team.create call).
    const createCall = teamsRouteSource.indexOf("db.team.create");
    expect(createCall).toBeGreaterThan(-1);
    expect(validateIndex).toBeLessThan(createCall);
    // The invalid email answers the SAME message the members route 400s.
    expect(teamsRouteSource).toContain('fail("VALIDATION", "Enter a valid email address", 400)');
  });

  it("an absent memberEmail still creates the team without members (the optional contract)", () => {
    // The members spread stays conditional — no email, no member. The
    // S60-C fix normalizes memberEmail into a local (the text clamp —
    // session 71 folded the twin helpers into the ONE clampText)
    // before the validation gate, so the spread keys off the LOCAL, not
    // the raw body field (a line-break-aware ternary anchor — the spread's
    // `? {` sits on its own line, the F46 lesson).
    expect(teamsRouteSource).toMatch(/\.\.\.\(memberEmail\s*\?/);
    expect(teamsRouteSource).toContain("members: {");
  });

  it("the members route keeps its own identical validation (the sibling contract)", () => {
    expect(membersRouteSource).toContain("/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/");
    expect(membersRouteSource).toContain('fail("VALIDATION", "Enter a valid email address", 400)');
  });
});
