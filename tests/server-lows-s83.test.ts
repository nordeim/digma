import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-83 server low batch (S83-C + S83-D — the thirty-first
// audit's B83-L1, B83-L2).
//
// S83-C — THE DEFECT (B83-L1): the e2e webServer spread
// `...process.env` into the "hermetic" standalone server (and
// tests/e2e/global-setup.ts did the same for the seed commands) —
// only DATABASE_URL/PORT/NODE_ENV/AUTH_SECRET/DIGMA_DISABLE_AI_LLM
// are pinned. An operator-exported DIGMA_PROXY_HOPS=0 collapses the
// whole auth budget into the shared "unknown" bucket and breaks
// auth.spec's arithmetic; DIGMA_DISABLE_IN_APP_OTP=1 /
// DIGMA_DISABLE_IN_APP_RESET=1 / DIGMA_REPO_ROOT all leak and fail
// the gate spuriously. The documented hermeticity posture covered the
// smoke parent DATABASE_URL trap, the stale-server pre-kill, and the
// AI knob — this leak class was undocumented.
//
// THE FIX: the env copy DELETES the four app knobs before the pinned
// overrides apply (PATH/HOME survive for the spawn; the five pinned
// overrides unchanged).
//
// S83-D — THE DEFECT (B83-L2): the register route burned its scrypt
// hash INSIDE the interactive transaction — hashPassword(password)
// ran within the db.$transaction callback, sync CPU work inside the
// SQLite writer window. No functional issue at documented scale; the
// S82-C re-shape placed it there.
//
// THE FIX: the hash computed above the transaction (a const
// passwordHash line), the create consuming the constant — the scrypt
// cost leaves the writer window, behavior identical.

const playwrightSource = readFileSync(
  path.resolve(import.meta.dirname, "../playwright.config.ts"),
  "utf8",
);

const globalSetupSource = readFileSync(
  path.resolve(import.meta.dirname, "e2e/global-setup.ts"),
  "utf8",
);

const registerSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/register/route.ts"),
  "utf8",
);

// ---------------------------------------------------------------------------
// S83-C — the e2e server's hermetic env (B83-L1)
// ---------------------------------------------------------------------------

describe("the e2e server's env is hermetic against operator exports (S83-C / B83-L1 — the S84-C revision form)", () => {
  it("the webServer COMMAND strips the seven knobs via env -u (the merge discovery's effective form)", () => {
    // Session 84 (S84-C revision — the F71 runtime discovery): the
    // S83-C delete-lines-in-the-env-object form was INEFFECTIVE —
    // Playwright MERGES the webServer env object OVER process.env, so
    // a deleted key re-inherits the parent's value (proven live with a
    // probe config: a deleted HOSTNAME still reached the spawned
    // server). The removal moved INTO THE COMMAND: the `env -u`
    // prefix strips the four app knobs plus the standalone runtime's
    // own HOSTNAME/KEEP_ALIVE_TIMEOUT — the only form that actually
    // reaches the child process.
    expect(playwrightSource).toMatch(
      // Session 100 (S100-D / B100-L2) re-anchored in-commit: the FIFTH
      // app knob DIGMA_SITE_URL joins the removal list (the S83-A
      // precedent — the prior-session pin tracks the delivered form).
      /exec env -u DIGMA_PROXY_HOPS -u DIGMA_DISABLE_IN_APP_RESET -u DIGMA_DISABLE_IN_APP_OTP -u DIGMA_REPO_ROOT -u DIGMA_SITE_URL -u HOSTNAME -u KEEP_ALIVE_TIMEOUT bun \.next\/standalone\/server\.js/,
    );
  });

  it("the webServer keeps the five pinned overrides (the standing hermeticity contract, unchanged)", () => {
    // SURVIVAL PIN: the pinned overrides must survive the re-shape.
    expect(playwrightSource).toMatch(/DATABASE_URL: E2E_DATABASE_URL/);
    expect(playwrightSource).toMatch(/DIGMA_DISABLE_AI_LLM: "1"/);
    expect(playwrightSource).toMatch(/AUTH_SECRET: "playwright-e2e-session-secret"/);
  });

  it("the global-setup deletes the same knobs for the seed commands (the uniform discipline — execSync env REPLACES, so deletes are effective there)", () => {
    expect(globalSetupSource).toMatch(/delete .*DIGMA_PROXY_HOPS/);
    expect(globalSetupSource).toMatch(/delete .*DIGMA_REPO_ROOT/);
    // The seed commands keep their own pinned DATABASE_URL.
    expect(globalSetupSource).toMatch(/DATABASE_URL: "file:\.\.\/db\/e2e\.db"/);
  });
});

// ---------------------------------------------------------------------------
// S83-D — the register hash above the transaction (B83-L2)
// ---------------------------------------------------------------------------

describe("the register route computes its scrypt hash OUTSIDE the transaction (S83-D / B83-L2)", () => {
  it("the hash line precedes the $transaction call (the scrypt cost leaves the SQLite writer window)", () => {
    // THE DEFECT PIN: pre-fix hashPassword runs INSIDE the tx callback
    // (the passwordHash: hashPassword(password) form at the create
    // site); post-fix a const above the try/transaction.
    const hashIdx = registerSource.indexOf("const passwordHash = hashPassword(");
    const txIdx = registerSource.indexOf("db.$transaction(");
    expect(hashIdx).toBeGreaterThan(-1);
    expect(txIdx).toBeGreaterThan(-1);
    expect(hashIdx).toBeLessThan(txIdx);
  });

  it("the create consumes the pre-computed constant (no scrypt inside the transaction callback)", () => {
    // The create's field reads the constant, not the call.
    expect(registerSource).toMatch(/passwordHash,\s*\n/);
    expect(registerSource).not.toMatch(/passwordHash: hashPassword\(password\)/);
  });

  it("the transaction keeps the count-guard + USER_LIMIT + abort arms (the S82-C survivors, unchanged)", () => {
    // SURVIVAL PIN: the ceiling family's contract must survive the
    // re-shape — the count check, the sentinel, and the P2024/P2028
    // arms all ride the transaction unchanged.
    expect(registerSource).toMatch(/USER_LIMIT/);
    expect(registerSource).toMatch(/tx\.user\.count\(\)/);
    expect(registerSource).toMatch(/overCap/);
    expect(registerSource).toMatch(/P2024|P2028/);
  });
});
