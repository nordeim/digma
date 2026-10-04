import { describe, expect, it } from "vitest";
import { redactDatabaseUrl } from "../src/lib/db-path";
import { readFileSync } from "node:fs";
import path from "node:path";

// The startup log's credential redaction + the unified member color
// (session 64, S64-F — the twelfth audit's B-6 + B-7).
//
// B-6 THE DEFECT: the db module logged the RESOLVED database URL
// verbatim on every boot. The SQLite family is harmless, but the
// resolution passes non-file URLs through unchanged — a connection
// string carrying credentials would print them to stdout (the
// .env.example documents the postgres option).
//
// B-7 THE DEFECT: the two member-creation paths disagreed on the
// avatar color seed — the create-team path hardcoded a fixed blue
// while the invite-member path derived it from the email through the
// shared helper. The same email rendered two different colors
// depending on which dialog created it.
//
// THE FIX: a pure redaction helper feeds the log line (the
// user:password authority section collapses to user:***); the
// create-team path consumes the same derivation helper the invite
// path uses.

describe("redactDatabaseUrl (session 64, S64-F / B-6)", () => {
  it("redacts the credential section of a postgres connection string", () => {
    expect(redactDatabaseUrl("postgresql://alice:s3cret@localhost:5432/digma")).toBe(
      "postgresql://alice:***@localhost:5432/digma",
    );
  });

  it("redacts the credential section of a mysql connection string", () => {
    expect(redactDatabaseUrl("mysql://bob:hunter2@db.example.com:3306/prod")).toBe(
      "mysql://bob:***@db.example.com:3306/prod",
    );
  });

  it("passes the file: family through verbatim (no credentials to hide)", () => {
    expect(redactDatabaseUrl("file:../db/custom.db")).toBe("file:../db/custom.db");
    expect(redactDatabaseUrl("file:/abs/path/e2e.db")).toBe("file:/abs/path/e2e.db");
  });

  it("passes credential-less URLs through verbatim", () => {
    expect(redactDatabaseUrl("postgresql://localhost:5432/digma")).toBe("postgresql://localhost:5432/digma");
    expect(redactDatabaseUrl("")).toBe("");
  });
});

describe("the db log line + the unified member color (session 64, S64-F / B-6 + B-7)", () => {
  it("the startup log routes through the redaction helper", () => {
    const dbSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/lib/db.ts"),
      "utf8",
    );
    // THE DEFECT PIN: pre-fix the template interpolated the resolved
    // URL directly.
    expect(dbSource).toMatch(/redactDatabaseUrl\(/);
    expect(dbSource).toMatch(/import .*redactDatabaseUrl.* from "\.\/db-path"/);
  });

  it("the create-team member path derives the avatar color through the shared helper", () => {
    const teamsSource = readFileSync(
      path.resolve(import.meta.dirname, "../src/app/api/teams/route.ts"),
      "utf8",
    );
    // THE DEFECT PIN: pre-fix this route hardcoded a fixed hex while
    // the invite route derived from the email — the same person could
    // wear two colors. Anchored on the POST route's own create call
    // (the GET route's include block also says "members: {").
    // Session 72 (S72-E) contract re-anchor: the create moved INSIDE
    // the TOCTOU transaction (tx.team.create) — the member-color
    // contract is pinned on the transactional create.
    const createIdx = teamsSource.indexOf("tx.team.create(");
    expect(createIdx).toBeGreaterThan(-1);
    const createBody = teamsSource.slice(createIdx, createIdx + 900);
    expect(createBody).toMatch(/memberColorFor\(memberEmail\)/);
    expect(teamsSource).toMatch(/import \{ memberColorFor, memberDisplayFor \} from "@\/lib\/team"/);
  });
});
