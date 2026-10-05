import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-82 server low batch (S82-C + S82-D — the thirtieth
// audit's B82-M3, B82-L4, B82-L5).
//
// S82-C — THE DEFECTS: (1) B82-M3 — check-db-contract.ts's
// foreign-export REFUSAL printed the raw (potentially credentialed)
// DATABASE_URL into console.error while the script's own resolved-URL
// line routes through redactDatabaseUrl() precisely because "a
// Postgres-backed checkout never prints its credentialed connection
// string" — the missed sibling of the S64-F/S78-G/S79-C redaction
// family. (2) B82-L4 — the PUBLIC register route carried no
// user-count ceiling (the only unbounded creation surface; every
// authenticated surface carries one: 500/100/100/2000), and each
// accepted request burns a scrypt hash.
//
// THE FIXES: both refusal interpolations route through
// redactDatabaseUrl(); USER_LIMIT joins the creation-ceiling family in
// validation.ts and the register route's create moves into the
// family's TOCTOU-safe count-guarded transaction form.
//
// S82-D — THE GAP (B82-L5): no runtime gate probed the 32 MB body
// cap — the bounded-input doctrine's flagship control was covered
// only by the unit seam. The smoke gate gains two runtime probes (the
// S80-D form): the content-length fast path (a 33 MB --data-binary
// POST answers the 400 envelope) and the chunked stream counter (the
// same body piped through stdin, Transfer-Encoding: chunked, answers
// the SAME 400 envelope). GREEN-immediately by design — the probes
// are the drift mechanism, not a defect fix.

const contract = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/check-db-contract.ts"),
  "utf8",
);
const register = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/auth/register/route.ts"),
  "utf8",
);
const validation = readFileSync(
  path.resolve(import.meta.dirname, "../src/lib/validation.ts"),
  "utf8",
);
const smoke = readFileSync(
  path.resolve(import.meta.dirname, "../scripts/smoke-test.sh"),
  "utf8",
);

// ---------------------------------------------------------------------------
// S82-C.1 — the refusal path's redaction fold (B82-M3)
// ---------------------------------------------------------------------------

describe("check-db-contract's foreign-export refusal redacts the URLs (S82-C / B82-M3)", () => {
  it("the LIVE (exported) URL interpolation routes through redactDatabaseUrl", () => {
    // THE DEFECT PIN: pre-fix the refusal interpolated the raw
    // liveDatabaseUrl slice — a credentialed foreign export printed
    // its password to the terminal.
    const site = contract.indexOf("REFUSED: DATABASE_URL");
    expect(site).toBeGreaterThanOrEqual(0);
    const refusal = contract.slice(site, site + 700);
    expect(refusal).toMatch(/redactDatabaseUrl\(\s*liveDatabaseUrl/);
  });

  it("the OWN (.env) URL interpolation routes through redactDatabaseUrl", () => {
    // The twin: the repo's own .env value rides the same leak when a
    // Postgres checkout carries credentials there.
    const site = contract.indexOf("REFUSED: DATABASE_URL");
    const refusal = contract.slice(site, site + 900);
    expect(refusal).toMatch(/redactDatabaseUrl\(\s*ownDatabaseUrl/);
  });

  it("the refusal keeps its diagnostic shape (the mismatch explanation + the unset instruction)", () => {
    // The redaction must not shrink the message — the operator still
    // needs the full diagnosis and the fix command.
    const site = contract.indexOf("REFUSED: DATABASE_URL");
    const refusal = contract.slice(site, site + 900);
    expect(refusal).toMatch(/foreign export/);
    expect(refusal).toMatch(/unset DATABASE_URL/);
  });
});

// ---------------------------------------------------------------------------
// S82-C.2 — the register user ceiling (B82-L4)
// ---------------------------------------------------------------------------

describe("the register route gains the USER_LIMIT ceiling (S82-C / B82-L4)", () => {
  it("validation.ts exports USER_LIMIT in the creation-ceiling family", () => {
    // THE DEFECT PIN: pre-fix no user ceiling existed anywhere.
    const site = validation.indexOf("USER_LIMIT");
    expect(site).toBeGreaterThanOrEqual(0);
    const line = validation.slice(site, site + 200);
    expect(line).toMatch(/=\s*500/);
  });

  it("the register route imports USER_LIMIT", () => {
    expect(register).toMatch(/import[^\n]*USER_LIMIT/);
  });

  it("the create moves into the count-guarded transaction (the family's TOCTOU-safe form)", () => {
    // The projects route's own pattern: the count check and the create
    // share ONE transaction so a concurrent register cannot slip past
    // the ceiling.
    expect(register).toMatch(/\$transaction/);
    expect(register).toMatch(/user\.count\(\)/);
    expect(register).toMatch(/USER_LIMIT/);
  });

  it("the over-cap answer is the family's VALIDATION envelope (400)", () => {
    expect(register).toMatch(/Too many users \(max 500\)/);
    expect(register).toMatch(/"VALIDATION"/);
  });

  it("the P2002 conflict catch survives the transactional shape (the S64-E contract)", () => {
    // The concurrent same-email register still answers the 409
    // envelope — the catch must wrap the transaction, not bypass it.
    const site = register.indexOf("P2002");
    expect(site).toBeGreaterThanOrEqual(0);
    expect(register).toMatch(/CONFLICT/);
  });
});

// ---------------------------------------------------------------------------
// S82-D — the smoke gate's runtime body-cap probes (B82-L5)
// ---------------------------------------------------------------------------

describe("the smoke gate probes the 32 MB body cap at runtime (S82-D / B82-L5)", () => {
  it("the content-length fast-path probe POSTs an over-cap body and asserts the 400 envelope", () => {
    // THE GAP PIN: pre-fix no runtime check sent an over-cap body —
    // a Next/undici stream regression would fail only source pins.
    expect(smoke).toMatch(/dd if=\/dev\/zero/);
    expect(smoke).toMatch(/--data-binary @/);
    expect(smoke).toMatch(/Request body too large/);
  });

  it("the chunked stream-counter probe pipes the body through stdin (Transfer-Encoding: chunked)", () => {
    // The S75-B stream-counter family's only runtime witness: a pipe
    // of unknown size forces curl onto the chunked transfer form.
    expect(smoke).toMatch(/cat [^|]+\|\s*curl/);
    expect(smoke).toMatch(/--data-binary @-/);
  });

  it("the probes carry their own XFF identities (the auth limiter runs before the body parse)", () => {
    // Each probe burns one auth-rate call — dedicated XFF buckets keep
    // the shared budgets' arithmetic intact.
    const probes = smoke.match(/X-Forwarded-For: 10\.9\.8\.[0-9]+/g) ?? [];
    expect(probes.length).toBeGreaterThanOrEqual(2);
  });
});
