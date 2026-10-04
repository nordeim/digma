import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-71 server low batch (S71-C — the nineteenth audit's L-A4 +
// L-A5 + L-A6 + L-A7).
//
// THE DEFECTS: (L-A4) the resend-otp route answers known+verified
// accounts with a 409 CONFLICT ("This account is already verified — sign
// in.") while unknown emails answer the uniform VALIDATION 400 — a
// remotely measurable three-way account-state oracle (200/409/400) that
// DIGMA_DISABLE_IN_APP_OTP=1 does NOT close (the knob nulls the code
// payload only). (L-A5) the login 403 carries TWO fields outside the
// envelope member — email (read by nobody) and verificationCode (the one
// consumed field, at the top level instead of inside error). (L-A6) the
// redundant @@index([projectId]) survived the S70-B swap — the composite
// @@index([projectId, sortOrder]) leftmost prefix serves every query the
// app runs. (L-A7) the elements POST sortOrder clamp is stale (999 vs the
// 2000-element ceiling) and the count fallback escapes it.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the resend-otp uniform 400 (S71-C / L-A4)", () => {
  const route = src("src/app/api/auth/resend-otp/route.ts");

  it("the verified-account branch answers the SAME uniform VALIDATION 400 as unknown emails", () => {
    // THE DEFECT PIN: pre-fix fail("CONFLICT", "This account is already
    // verified — sign in.", 409) — the 200/409/400 oracle.
    expect(route).not.toMatch(/"CONFLICT",\s*"This account is already verified/);
    expect(route).not.toMatch(/409/);
    // The verified branch mirrors the unknown branch's uniform answer.
    const unknownIdx = route.indexOf('fail("VALIDATION", "Enter a valid email address", 400)');
    expect(unknownIdx).toBeGreaterThan(-1);
    const verifiedIdx = route.indexOf("if (user.verified) {");
    expect(verifiedIdx).toBeGreaterThan(-1);
    const branch = route.slice(verifiedIdx, verifiedIdx + 1200);
    expect(branch).toMatch(/fail\("VALIDATION",\s*"Enter a valid email address",\s*400\)/);
  });

  it("the uniform answer's rationale is documented at the branch (no-enumeration)", () => {
    // THE DOC PIN: the branch carries the no-enumeration rationale (the
    // verify route's own convention).
    const verifiedIdx = route.indexOf("if (user.verified) {");
    const branch = route.slice(verifiedIdx, verifiedIdx + 600);
    expect(branch).toMatch(/enumeration|indistinguishab|uniform/i);
  });
});

describe("the login 403 envelope fold (S71-C / L-A5)", () => {
  const route = src("src/app/api/auth/login/route.ts");

  it("verificationCode lives INSIDE error; the top-level email field is gone", () => {
    // THE DEFECT PIN: pre-fix the response carries { ok, error, email,
    // verificationCode } — two fields outside the envelope member.
    // The 403 response object is extracted as a slice (the ternary
    // form itself SURVIVES inside error — the standing ai-limit-otp-s67
    // pin's contract — so the absence must read the object's shape,
    // not the expression). Anchored AFTER the unverified branch (the
    // route's earlier 429 NextResponse.json is not this response).
    const unverifiedIdx = route.indexOf("if (!user.verified) {");
    expect(unverifiedIdx).toBeGreaterThan(-1);
    const jsonIdx = route.indexOf("NextResponse.json(", unverifiedIdx);
    const statusIdx = route.indexOf("{ status: 403 }", unverifiedIdx);
    expect(jsonIdx).toBeGreaterThan(unverifiedIdx);
    expect(statusIdx).toBeGreaterThan(jsonIdx);
    const response403 = route.slice(jsonIdx, statusIdx);
    // The response object carries ONLY the envelope members — no
    // top-level `email,` key line (the pre-fix dead field; the error
    // MESSAGE's own prose may legitimately contain the word).
    expect(response403).not.toMatch(/^\s*email,\s*$/m);
    // verificationCode appears exactly once — INSIDE the error braces.
    const codeOccurrences = response403.match(/verificationCode/g) ?? [];
    expect(codeOccurrences.length).toBe(1);
    const errorIdx = response403.indexOf("error: {");
    expect(errorIdx).toBeGreaterThan(-1);
    expect(response403.indexOf("verificationCode")).toBeGreaterThan(errorIdx);
    // The folded envelope's closing shape: the error object is the
    // response's LAST member before the status argument.
    expect(response403).toMatch(/verificationCode:\s*inAppOtpEnabled\s*\?\s*verifyCode\s*:\s*null,?\s*\},?\s*\},\s*$/);
  });

  it("the client reads error.verificationCode (the single consumer follows the fold)", () => {
    // THE DEFECT PIN: pre-fix login-screen.tsx:132 reads
    // body?.verificationCode (top level).
    const screen = src("src/components/login-screen.tsx");
    expect(screen).toMatch(/body\?\.error\?\.verificationCode/);
    expect(screen).not.toMatch(/body\?\.verificationCode\b(?!error)/);
  });

  it("the knob ternary form survives byte-identically (the ai-limit-otp-s67 pin's contract)", () => {
    // THE PRESERVATION PIN: the S67-C knob form — verificationCode:
    // inAppOtpEnabled ? verifyCode : null — merely relocates inside
    // error; the standing pin's regex still matches.
    expect(route).toMatch(/verificationCode:\s*inAppOtpEnabled\s*\?\s*verifyCode\s*:\s*null/);
  });
});

describe("the redundant index drop (S71-C / L-A6)", () => {
  const schema = src("prisma/schema.prisma");

  it("the single-column @@index([projectId]) is gone; only the composite serves the queries", () => {
    // THE DEFECT PIN: pre-fix the single-column index (line 104) rides
    // beside the composite — pure write amplification (every composite
    // leftmost-prefix query is served by the composite).
    expect(schema).not.toMatch(/@@index\(\[projectId\]\)/);
    expect(schema).toMatch(/@@index\(\[projectId,\s*sortOrder\]\)/);
  });

  it("the DesignElement model keeps exactly ONE index (the composite)", () => {
    // THE STRUCTURAL PIN: no second element index hides elsewhere in the
    // model block. The block is sliced to the model's CLOSING line (the
    // leading-`}` form) — inner braces in field types/comments cannot
    // cut the slice short.
    const modelStart = schema.indexOf("model DesignElement {");
    const modelEnd = schema.indexOf("\n}", modelStart);
    expect(modelStart).toBeGreaterThan(-1);
    expect(modelEnd).toBeGreaterThan(modelStart);
    const block = schema.slice(modelStart, modelEnd);
    const indexes = block.match(/@@index\([^)]*\)/g) ?? [];
    expect(indexes.length).toBe(1);
    expect(indexes[0]).toBe("@@index([projectId, sortOrder])");
  });
});

describe("the elements POST sortOrder clamp (S71-C / L-A7)", () => {
  it("the clamp max agrees with ELEMENT_LIMIT (the 2000-row ceiling)", () => {
    // THE DEFECT PIN: pre-fix clampNumber(body?.sortOrder, 0, 999, count)
    // — the PUT legitimately writes sortOrder 0..1999 from array index,
    // so an explicit 1500 clamps to 999 and ties unstably.
    const route = src("src/app/api/projects/[id]/elements/route.ts");
    expect(route).not.toMatch(/clampNumber\(body\?\.sortOrder,\s*0,\s*999,\s*count\)/);
    expect(route).toMatch(/clampNumber\(body\?\.sortOrder,\s*0,\s*ELEMENT_LIMIT - 1,\s*count\)/);
  });
});
