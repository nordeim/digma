import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-69 route-race + OTP-knob client batch (S69-C — the
// seventeenth audit's L-B + L-C).
//
// THE DEFECTS: (L-B) the DELETE handlers bare-throw Prisma P2025
// under a double-delete race — projects/[id] and teams/[id] both
// pre-check with findUnique then await db.*.delete with NO catch, so
// the loser of two concurrent DELETEs throws past the { ok, error }
// envelope (an unstructured 500), exactly the race family the sibling
// PATCH handlers already catch (S62-G) and the elements PUT catches
// (P2025/P2003). The members POST likewise bare-throws P2003 when the
// team vanishes mid-invite. (L-C) the login screen's VERIFY_EMAIL
// recovery guard requires a TRUTHY verificationCode — under
// DIGMA_DISABLE_IN_APP_OTP=1 the route answers verificationCode: null
// (login/route.ts:71), the guard fails, and an unverified user gets
// the generic inline error with NO path to the verify card: the knob
// posture locks them out of the recovery flow entirely. Register's
// sibling already degrades correctly (the ?? "" form).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the DELETE race catches (S69-C / L-B)", () => {
  it("the project DELETE answers P2025 through the envelope (the sibling PATCH's S62-G form)", () => {
    // THE DEFECT PIN: pre-fix the DELETE body has no try/catch — the
    // bare `await db.project.delete` throws past the envelope.
    const route = src("src/app/api/projects/[id]/route.ts");
    const del = route.slice(route.indexOf("export async function DELETE"));
    expect(del).toMatch(/try\s*\{/);
    expect(del).toMatch(/P2025/);
    expect(del).toMatch(/fail\("NOT_FOUND", "Project not found", 404\)/);
    // The delete itself stays INSIDE the try (the guarded form).
    const tryIdx = del.indexOf("try {");
    const delIdx = del.indexOf("db.project.delete");
    expect(delIdx).toBeGreaterThan(tryIdx);
  });

  it("the team DELETE answers P2025 through the envelope", () => {
    const route = src("src/app/api/teams/[id]/route.ts");
    const del = route.slice(route.indexOf("export async function DELETE"));
    expect(del).toMatch(/try\s*\{/);
    expect(del).toMatch(/P2025/);
    expect(del).toMatch(/fail\("NOT_FOUND", "Team not found", 404\)/);
    const tryIdx = del.indexOf("try {");
    const delIdx = del.indexOf("db.team.delete");
    expect(delIdx).toBeGreaterThan(tryIdx);
  });

  it("the members POST answers P2003 (the team vanished mid-invite) through the envelope", () => {
    const route = src("src/app/api/teams/[id]/members/route.ts");
    const post = route.slice(route.indexOf("export async function POST"));
    expect(post).toMatch(/P2003/);
    expect(post).toMatch(/fail\("NOT_FOUND"/);
    const tryIdx = post.indexOf("try {");
    const createIdx = post.indexOf("db.teamMember.create");
    expect(createIdx).toBeGreaterThan(tryIdx);
    expect(createIdx).toBeGreaterThan(-1);
  });

  it("the sibling PATCH catches are PRESERVED (the S62-G family untouched)", () => {
    const projects = src("src/app/api/projects/[id]/route.ts");
    const patch = projects.slice(projects.indexOf("export async function PATCH"));
    expect(patch).toMatch(/P2025/);
    expect(patch).toMatch(/fail\("NOT_FOUND", "Project not found", 404\)/);
    const teams = src("src/app/api/teams/[id]/route.ts");
    const teamPatch = teams.slice(teams.indexOf("export async function PATCH"));
    expect(teamPatch).toMatch(/P2025/);
    expect(teamPatch).toMatch(/fail\("NOT_FOUND", "Team not found", 404\)/);
  });
});

describe("the login screen's VERIFY_EMAIL knob-posture guard (S69-C / L-C)", () => {
  const view = src("src/components/login-screen.tsx");

  it("the recovery guard opens the verify card on the 403 VERIFY_EMAIL envelope WITHOUT requiring a truthy code", () => {
    // THE DEFECT PIN: pre-fix the guard reads
    // `... && body?.verificationCode` — the null code under the OTP
    // knob fails the condition and the recovery path dead-ends.
    const guard = view.slice(
      view.indexOf('body?.error?.code === "VERIFY_EMAIL"') - 80,
      view.indexOf('body?.error?.code === "VERIFY_EMAIL"') + 200,
    );
    expect(guard).not.toMatch(/VERIFY_EMAIL"\s*&&\s*body\?\.verificationCode\)/);
  });

  it("the code passes through the null-tolerant degrade form (register's exact sibling)", () => {
    // Session 71 re-anchor (S71-C / L-A5): the code rides INSIDE the
    // 403's error member (the envelope fold) — the degrade form is
    // unchanged, the read moved.
    const guard = view.slice(
      view.indexOf('body?.error?.code === "VERIFY_EMAIL"') - 80,
      view.indexOf('body?.error?.code === "VERIFY_EMAIL"') + 1100,
    );
    expect(guard).toMatch(/enterVerify\(String\(body\?\.error\?\.verificationCode \?\? ""\)\)/);
  });

  it("register's degrade form is PRESERVED (the S67-C knob contract untouched)", () => {
    expect(view).toMatch(/enterVerify\(String\(body\?\.data\?\.verificationCode \?\? ""\)\)/);
  });
});
