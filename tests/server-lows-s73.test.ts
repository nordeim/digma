import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-73 server/config lows (S73-B..S73-E + the S73-H riders —
// the twenty-first audit's B-F1/B-F2/B-F3/B-F6/B-F8/B-F9 and the deferred
// DQ-1 name-cap decision).
//
// THE DEFECTS: (1) the duplicate's post-commit re-read answers
// 201 { project: null } when a concurrent DELETE lands between the commit
// and the re-read — the one unguarded post-commit read in the repo (every
// sibling answers 404); (2) the elements PUT and duplicate transactions
// rely on Prisma's default 5s timeout — a max-ceiling save on a slow
// self-hosted disk aborts with a P2028-family error that escapes as an
// unstructured 500; (3) the smoke gate's parent-env trap is operator
// discipline, not a mechanism — an exported DATABASE_URL pointing at a
// second seeded checkout false-greens the gate; (4) the projects PATCH
// silently truncates name >120 while the POST REJECTS with a pinned 400 —
// the API-semantics asymmetry; (5) the list GET's findMany is unbounded —
// no take between the caller and the 500-row product ceiling; (6) the
// projects POST's include ships the full-row element form — the one
// list-family reply off the S70-C projection, with a client comment that
// claims "no element include"; (7) verify-otp's line-107 condition keeps
// a half-dead disjunct; (8) check-db-contract validates 4 of the pristine
// contract's 5 counts (members missing); (9) the db-path header states
// the WRONG mechanism for the standalone trap (CWD anchoring — the Prisma
// 6 runtime anchors relative file: URLs against the schema directory).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("S73-B — the duplicate post-commit null guard (B-F1)", () => {
  const route = src("src/app/api/projects/[id]/duplicate/route.ts");

  it("the re-read answers 404 when the copy vanished before the response", () => {
    // THE DEFECT PIN: pre-fix the re-read's result feeds ok() unguarded —
    // a concurrent DELETE between the commit and the re-read answers a
    // success-status envelope with a null payload.
    const reRead = route.indexOf("const project = await db.project.findUnique({");
    expect(reRead).toBeGreaterThan(-1);
    const body = route.slice(reRead, route.indexOf("return ok({ project }, 201);"));
    expect(body).toMatch(/if \(!project\) return fail\("NOT_FOUND", "Project not found", 404\);/);
  });

  it("the 201 still carries the copy (the happy path unchanged)", () => {
    expect(route).toMatch(/return ok\(\{ project \}, 201\);/);
  });
});

describe("S73-C — the row-heavy transaction timeouts (B-F2)", () => {
  it("the elements PUT transaction carries the 30s timeout", () => {
    const route = src("src/app/api/projects/[id]/elements/route.ts");
    // THE DEFECT PIN: pre-fix the deleteMany+createMany transaction runs
    // at Prisma's default 5s — a max-ceiling save on a slow disk aborts
    // outside the envelope.
    const put = route.indexOf("const elements = await db.$transaction(async (tx) => {");
    expect(put).toBeGreaterThan(-1);
    const tail = route.slice(put, put + 2400);
    expect(tail).toMatch(/,\s*\{ timeout: 30_000 \}\s*\)/);
  });

  it("the duplicate copy transaction carries the 30s timeout", () => {
    // Session 77 (S77-G / B-I2): RE-ANCHORED onto the helper form — the
    // transaction body moved into runCopyTx() so the P2024/P2028 catch
    // can wrap it (the transactional shape is unchanged: same body,
    // same sentinel, same timeout). The pre-S77 form anchored on
    // `const copy = await db.$transaction(...)` inline.
    const route = src("src/app/api/projects/[id]/duplicate/route.ts");
    const tx = route.indexOf("return db.$transaction(async (tx) => {");
    expect(tx).toBeGreaterThan(-1);
    const tail = route.slice(tx, tx + 2400);
    expect(tail).toMatch(/,\s*\{ timeout: 30_000 \}\s*\)/);
  });

  it("the cosmetic transactions stay at the default (the projects POST ceiling form untouched)", () => {
    const route = src("src/app/api/projects/route.ts");
    expect(route).not.toMatch(/timeout: 30_000/);
  });
});

describe("S73-D — the smoke-gate parent-env mechanism + the fifth count (B-F3 + B-F9)", () => {
  it("the smoke script REFUSES an exported DATABASE_URL before any check runs", () => {
    const script = src("scripts/smoke-test.sh");
    // THE DEFECT PIN: pre-fix the script never looks at the parent env —
    // the operator discipline (unset DATABASE_URL && …) is the only thing
    // standing between the gate and a false green against a foreign DB.
    expect(script).toMatch(/DATABASE_URL/);
    expect(script).toMatch(/refus|unset DATABASE_URL/);
    expect(script).toMatch(/exit 1/);
  });

  it("check-db-contract validates the pristine contract's FIFTH count (members)", () => {
    const script = src("scripts/check-db-contract.ts");
    // THE DEFECT PIN: pre-fix the ok-line checks users/projects/elements/
    // teams but not members — the 1/2/6/1/3 contract's last digit.
    expect(script).toMatch(/members === 3/);
  });
});

describe("S73-E — the name-cap symmetry (DQ-1: PATCH rejects like POST)", () => {
  const post = src("src/app/api/projects/route.ts");
  const patch = src("src/app/api/projects/[id]/route.ts");

  it("the POST still rejects name >120 with the pinned message (the anchor contract)", () => {
    expect(post).toMatch(
      /if \(name\.length > 120\) return fail\("VALIDATION", "Project name is too long \(max 120\)", 400\);/,
    );
  });

  it("the PATCH REJECTS name >120 with the SAME message (the asymmetry closed)", () => {
    // THE DEFECT PIN: pre-fix the PATCH truncates via
    // clampText(body.name, 120) — a scripted 200-char rename silently
    // lands truncated while the POST teaches consumers to expect a 400.
    const nameBranch = patch.indexOf('if (body?.name !== undefined) {');
    expect(nameBranch).toBeGreaterThan(-1);
    const branch = patch.slice(nameBranch, patch.indexOf("if (body?.description"));
    expect(branch).toMatch(/name\.length > 120/);
    expect(branch).toMatch(/"Project name is too long \(max 120\)"/);
    expect(branch).not.toMatch(/clampText\(body\.name, 120\)/);
  });

  it("the description fields stay truncate-at-500 (the documented product semantics: names reject, prose truncates)", () => {
    expect(patch).toMatch(/clampText\(body\.description, 500\)/);
    // Session 99 (S99-D / B99-I1): the POST's inline trim-slice twin
    // joined the S71-D clampText fold — the truncate-at-500 semantics
    // ride through the shared clamp (byte-identical; the S93-A form).
    expect(post).toMatch(/clampText\(body\?\.description, 500\)/);
  });
});

describe("S73-F — the list aggregate bound (DQ-2 half A)", () => {
  it("the list GET's findMany carries take: PROJECT_LIMIT", () => {
    const route = src("src/app/api/projects/route.ts");
    // THE DEFECT PIN: pre-fix the findMany has no take — the aggregate is
    // bounded by nothing between the caller and the 500-row ceiling.
    const findMany = route.indexOf("const projects = await db.project.findMany({");
    expect(findMany).toBeGreaterThan(-1);
    const body = route.slice(findMany, findMany + 800);
    expect(body).toMatch(/take: PROJECT_LIMIT/);
    expect(route).toMatch(/PROJECT_LIMIT[,}]/);
  });
});

describe("S73-H riders — the POST projection + the verify-otp condition + the db-path mechanism", () => {
  it("the projects POST's include ships the bounded thumbnail projection (B-F8)", () => {
    const route = src("src/app/api/projects/route.ts");
    // THE DEFECT PIN: pre-fix the create's include is { elements: true } —
    // the full-row form; the S70-C projection family's one outlier.
    const create = route.indexOf("return tx.project.create({");
    expect(create).toBeGreaterThan(-1);
    const body = route.slice(create, create + 900);
    expect(body).toMatch(/elements: \{ orderBy: \{ sortOrder: "asc" \}, select: THUMBNAIL_ELEMENT_SELECT \}/);
    expect(body).not.toMatch(/include: \{ elements: true \}/);
  });

  it("the client comment states the honest include form (B-F8's comment half)", () => {
    const card = src("src/components/project-card.tsx");
    expect(card).not.toMatch(/no element include on the POST/);
  });

  it("verify-otp's post-atomic branch tests the live condition only (B-F6)", () => {
    const route = src("src/app/api/auth/verify-otp/route.ts");
    // THE DEFECT PIN: pre-fix `user.verifyCode !== code ||
    // verifiedResult.count === 0` — reaching this line implies count===0
    // (the count===1 path returned), so the first disjunct is dead.
    expect(route).not.toMatch(/user\.verifyCode !== code \|\| verifiedResult\.count === 0/);
    expect(route).toMatch(/if \(verifiedResult\.count === 0\)/);
  });

  it("the db-path header states the schema-anchoring mechanism (B-F5)", () => {
    const lib = src("src/lib/db-path.ts");
    // THE DEFECT PIN: pre-fix the header claims the runtime anchors
    // relative URLs against the process CWD — live probes show the
    // Prisma 6 engine anchors against the schema directory the client
    // was generated against; the chdir is causally irrelevant.
    expect(lib).toMatch(/schema/i);
    expect(lib).not.toMatch(/anchors them against the process CWD/);
    // The REAL trap survives: the traced schema copy relocates the anchor.
    expect(lib).toMatch(/standalone/);
  });
});
