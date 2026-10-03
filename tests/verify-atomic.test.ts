import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The atomic verify-otp counter (session 62, S62-E — the tenth audit's
// B-M2) and the XFF last-hop keying (S62-D / B-M1).
//
// B-M2 THE DEFECT: the wrong-code counter was a read-modify-write —
// `findUnique` read then `update` write as separate awaits. N
// concurrent wrong-code requests all read the same `verifyAttempts`
// and write the same incremented value, so the documented 5-attempt
// ceiling undercounts under concurrency (10 concurrent wrong guesses
// consume 1 attempt). THE FIX: a conditional `updateMany` with
// `increment` — the ceiling is enforced atomically; `count === 0`
// answers the exhausted 429.
//
// B-M1 THE DEFECT: `clientIpOf` trusted the FIRST x-forwarded-for hop
// — a value the CLIENT can supply (the proxy appends the real IP
// after it). The auth brute-force defense (10/IP/15min) was
// client-evadable by rotating the header. THE FIX: parse the LAST
// entry — the proxy-appended real IP (a single-value header, the
// e2e/smoke form, is both first and last — unaffected).

const verifySource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/verify-otp/route.ts"),
  "utf8",
);
const rateLimitSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/rate-limit.ts"),
  "utf8",
);

describe("the atomic verify-otp counter (session 62, S62-E / B-M2)", () => {
  it("the wrong-code increment is a conditional updateMany (atomic under concurrency)", () => {
    // THE DEFECT PIN: pre-fix the counter was
    //   const attempts = user.verifyAttempts + 1;
    //   await db.user.update({ where: { id: user.id },
    //     data: { verifyAttempts: attempts } });
    expect(verifySource).toMatch(
      /const result = await db\.user\.updateMany\(\{\s*where: \{ id: user\.id, verifyAttempts: \{ lt: MAX_VERIFY_ATTEMPTS \} \},\s*data: \{ verifyAttempts: \{ increment: 1 \} \},\s*\}\);/,
    );
  });

  it("a zero-count updateMany answers the exhausted 429 (the ceiling holds)", () => {
    // THE DEFECT PIN: pre-fix the concurrent path let the ceiling be
    // undercounted — the lock only engaged on sequential attempts.
    expect(verifySource).toMatch(/if \(result\.count === 0\) \{/);
    const idx = verifySource.indexOf("if (result.count === 0) {");
    const block = verifySource.slice(idx, verifySource.indexOf("}", verifySource.indexOf("VERIFY_LOCKED", idx)));
    expect(block).toContain("429");
  });
});

describe("the XFF last-hop keying (session 62, S62-D / B-M1)", () => {
  it("clientIpOf parses the LAST x-forwarded-for hop (the proxy-appended real IP)", () => {
    // THE DEFECT PIN: pre-fix the first hop was taken —
    //   return forwarded.split(",")[0]?.trim() || "unknown";
    // Session 69 (S69-A — a legitimate contract update): the last-hop
    // doctrine became the DEPTH-1 default of the deploy-declared trust
    // family (DIGMA_PROXY_HOPS) — the behavioral contract (last hop at
    // the default) is pinned in src/lib/rate-limit.test.ts and
    // tests/proxy-hops-s69.test.ts; this source pin re-anchors onto
    // the depth-aware index form.
    const fnStart = rateLimitSource.indexOf("export function clientIpOf");
    expect(fnStart).toBeGreaterThan(-1);
    const fnEnd = rateLimitSource.indexOf("const real = headers.get(", fnStart);
    const fn = rateLimitSource.slice(fnStart, fnEnd);
    expect(fn).toContain('const hops = forwarded.split(",").map((hop) => hop.trim()).filter(Boolean);');
    expect(fn).toContain("return hops[hops.length - depth] ?? ");
    expect(fn).toContain("if (hops.length < depth) return \"unknown\";");
  });

  it("the first-hop form is gone", () => {
    expect(rateLimitSource).not.toMatch(/forwarded\.split\(","\)\[0\]/);
  });
});
