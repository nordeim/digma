import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-72 server/overlay low batch (S72-B + S72-C + S72-E — the
// twentieth audit's L-A2 + L-B1 + L-B2 + L-B5).
//
// THE DEFECTS: (L-A2) the Toaster is z-[100] while the PresentOverlay is
// z-[200] — the autosave machine keeps running during a presentation and
// its failure family (the destructive "Autosave failed" toast, the
// S68-D "Session expired" terminal, the network-error toast) paints
// BEHIND the fullscreen overlay for the toast's whole lifetime. (L-B1)
// the elements POST's create runs unguarded after the loadProject
// pre-check — a concurrent project DELETE between the two fires the FK
// violation as an unstructured 500 (the members POST's S69-C sibling
// answers P2003 through the NOT_FOUND envelope; the route's own PUT
// catches P2025/P2003). (L-B2) the login route's `!user ||` short-circuit
// skips the scrypt work for unknown emails — the latency oracle that
// survives S71-C's status-code fix. (L-B5) the five creation ceilings
// count, check, then create in separate awaits — a concurrent burst
// between the count and the create inserts past the ceiling (the TOCTOU
// family; SQLite serializes writers, so moving the count inside the
// create's transaction closes the window).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the toaster z-order vs the present overlay (S72-B / L-A2)", () => {
  it("the Toaster stacks ABOVE the PresentOverlay (the failure toasts stay visible while presenting)", () => {
    // THE DEFECT PIN: pre-fix toaster z-[100] < present z-[200] — the
    // autosave failure family paints behind the fullscreen overlay.
    const toaster = src("src/components/ui/toaster.tsx");
    const overlay = src("src/components/editor/editor-view.tsx");
    const toasterZ = Number(toaster.match(/z-\[(\d+)\]/)?.[1] ?? 0);
    const presentZ = Number(overlay.match(/className="fixed inset-0 z-\[(\d+)\]/)?.[1] ?? 0);
    expect(toasterZ).toBeGreaterThan(0);
    expect(presentZ).toBeGreaterThan(0);
    expect(toasterZ).toBeGreaterThan(presentZ);
  });
});

describe("the elements POST P2003 envelope (S72-C / L-B1)", () => {
  it("the create is wrapped — a vanished project answers the NOT_FOUND envelope, never a bare 500", () => {
    // THE DEFECT PIN: pre-fix the create runs bare; the members POST's
    // S69-C form is the pattern (P2003 → fail("NOT_FOUND", ..., 404)).
    const route = src("src/app/api/projects/[id]/elements/route.ts");
    const postStart = route.indexOf("export async function POST");
    // Bounded to the POST function only (the PUT's own P2025/P2003
    // catch sits after — an unbounded slice false-matches it).
    const putStart = route.indexOf("export async function PUT", postStart);
    const postBody = route.slice(postStart, putStart === -1 ? undefined : putStart);
    expect(postBody).toMatch(/P2003/);
    expect(postBody).toMatch(/fail\("NOT_FOUND"/);
    // The catch wraps the create (P2003 from the FK on the vanished
    // project), not some unrelated surface — the catch block's own
    // P2003 test sits AFTER the create call it guards (the leading
    // comment block mentions the code family earlier).
    expect(postBody).toMatch(/designElement\.create/);
    const catchIdx = postBody.indexOf("} catch (error) {");
    const catchP2003 = postBody.indexOf('"P2003"', catchIdx);
    expect(catchIdx).toBeGreaterThan(-1);
    expect(catchP2003).toBeGreaterThan(catchIdx);
    expect(catchIdx).toBeGreaterThan(postBody.indexOf("designElement.create"));
  });
});

describe("the login timing equalizer (S72-C / L-B2)", () => {
  it("the password seam exposes the lazy equalizer hash (computed once per process)", () => {
    // THE DEFECT PIN: pre-fix no equalizer exists — the miss branch
    // skips the scrypt work entirely.
    const password = src("src/lib/password.ts");
    expect(password).toMatch(/export function timingEqualizerHash\(\):\s*string/);
    // Lazy: a module-scope cache armed on first call, never a cold-start
    // scrypt on every import.
    expect(password).toMatch(/let\s+equalizerHash:\s*string\s*\|\s*null\s*=\s*null/);
  });

  it("the login route burns the equal work on the unknown-email branch (the constant-work envelope)", () => {
    // THE DEFECT PIN: pre-fix `!user ||` short-circuits — the scrypt
    // never runs for unknown emails, and latency distinguishes
    // registered ones.
    const login = src("src/app/api/auth/login/route.ts");
    expect(login).toMatch(/timingEqualizerHash\(\)/);
    // The form: the user's own hash when present, the equalizer
    // otherwise — verifyPassword ALWAYS runs.
    expect(login).toMatch(/verifyPassword\(\s*password,\s*user\?\.passwordHash\s*\?\?\s*timingEqualizerHash\(\)\s*\)/);
    // The short-circuit on !user alone is gone (the check moves past
    // the constant-work compare).
    expect(login).not.toMatch(/if\s*\(!user\s*\|\|\s*!verifyPassword/);
  });

  it("the 401 envelope family is byte-identical (the preservation pin)", () => {
    // THE PRESERVATION PIN: only the timing changes — the envelope, the
    // message, and the status stay exactly the reference's measured
    // contract (RA-60's inline-alert text + the unverified branch's 403
    // with the folded verificationCode member).
    const login = src("src/app/api/auth/login/route.ts");
    expect(login).toMatch(/Invalid email or password/);
    expect(login).toMatch(/verificationCode: inAppOtpEnabled \? verifyCode : null/);
    expect(login).toMatch(/code: "VERIFY_EMAIL"/);
  });
});

describe("the TOCTOU count-then-create ceilings (S72-E / L-B5 — the five sites)", () => {
  it("the projects POST counts INSIDE the create transaction", () => {
    // THE DEFECT PIN: pre-fix the count is a separate await before the
    // create — the window between them admits a concurrent burst past
    // the ceiling.
    const route = src("src/app/api/projects/route.ts");
    const postStart = route.indexOf("export async function POST");
    const postBody = route.slice(postStart);
    expect(postBody).toMatch(/db\.\$transaction\(async \(tx\) =>/);
    expect(postBody).toMatch(/tx\.project\.count\(\)/);
    expect(postBody).toMatch(/tx\.project\.create\(/);
    // The count precedes the create INSIDE the same transaction body.
    expect(postBody.indexOf("tx.project.count()")).toBeLessThan(postBody.indexOf("tx.project.create("));
    // The envelope is unchanged.
    expect(postBody).toMatch(/Too many projects \(max 500\)/);
  });

  it("the duplicate POST counts inside the EXISTING copy transaction", () => {
    const route = src("src/app/api/projects/[id]/duplicate/route.ts");
    const postStart = route.indexOf("export async function POST");
    const postBody = route.slice(postStart);
    expect(postBody).toMatch(/db\.\$transaction\(async \(tx\) =>/);
    expect(postBody).toMatch(/tx\.project\.count\(\)/);
    expect(postBody.indexOf("tx.project.count()")).toBeLessThan(postBody.indexOf("tx.project.create("));
    expect(postBody).toMatch(/Too many projects \(max 500\)/);
  });

  it("the teams POST counts INSIDE the create transaction (with the nested first member)", () => {
    const route = src("src/app/api/teams/route.ts");
    const postStart = route.indexOf("export async function POST");
    const postBody = route.slice(postStart);
    expect(postBody).toMatch(/db\.\$transaction\(async \(tx\) =>/);
    expect(postBody).toMatch(/tx\.team\.count\(\)/);
    expect(postBody).toMatch(/tx\.team\.create\(/);
    expect(postBody.indexOf("tx.team.count()")).toBeLessThan(postBody.indexOf("tx.team.create("));
    expect(postBody).toMatch(/Too many teams \(max 100\)/);
  });

  it("the members POST counts INSIDE the create transaction (the P2003 catch survives)", () => {
    const route = src("src/app/api/teams/[id]/members/route.ts");
    const postStart = route.indexOf("export async function POST");
    const postBody = route.slice(postStart);
    expect(postBody).toMatch(/db\.\$transaction\(async \(tx\) =>/);
    expect(postBody).toMatch(/tx\.teamMember\.count\(/);
    expect(postBody).toMatch(/tx\.teamMember\.create\(/);
    expect(postBody.indexOf("tx.teamMember.count(")).toBeLessThan(postBody.indexOf("tx.teamMember.create("));
    expect(postBody).toMatch(/Too many members \(max 100\)/);
    // The S69-C race catch survives the restructure.
    expect(postBody).toMatch(/P2003/);
    expect(postBody).toMatch(/fail\("NOT_FOUND"/);
  });

  it("the elements POST counts INSIDE the create transaction (the sortOrder clamp reads the transactional count)", () => {
    const route = src("src/app/api/projects/[id]/elements/route.ts");
    const postStart = route.indexOf("export async function POST");
    const putStart = route.indexOf("export async function PUT", postStart);
    const postBody = route.slice(postStart, putStart === -1 ? undefined : putStart);
    expect(postBody).toMatch(/db\.\$transaction\(async \(tx\) =>/);
    expect(postBody).toMatch(/tx\.designElement\.count\(/);
    expect(postBody).toMatch(/tx\.designElement\.create\(/);
    expect(postBody.indexOf("tx.designElement.count(")).toBeLessThan(postBody.indexOf("tx.designElement.create("));
    expect(postBody).toMatch(/Too many elements \(max 2000\)/);
    // The S71-C clamp survives (the max agrees with ELEMENT_LIMIT).
    expect(postBody).toMatch(/clampNumber\(body\?\.sortOrder, 0, ELEMENT_LIMIT - 1, count\)/);
  });

  it("the over-cap answer stays the fail() envelope (no exception control flow leaks)", () => {
    // The five routes keep the fail() envelope family — the over-cap
    // sentinel skips the create inside the transaction and the route
    // answers the SAME VALIDATION 400 with the SAME message.
    const projects = src("src/app/api/projects/route.ts").slice(
      src("src/app/api/projects/route.ts").indexOf("export async function POST"),
    );
    expect(projects).not.toMatch(/throw new Error\("Too many/);
  });
});
