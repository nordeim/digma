// Session-59 baseline: verify the dev DB is at the pristine seed contract.
// Usage: cd /home/z/my-project/digma && unset DATABASE_URL && bun run scripts/check-db-contract.ts
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl, candidateRoots, redactDatabaseUrl } from "../src/lib/db-path";

// Session 74 (S74-E — B74-F2): the refusal guard joins the smoke
// script's S73-D mechanism — a shell-exported DATABASE_URL pointing at
// a foreign checkout's database (the parent-env trap: the exported var
// re-inherits from the parent shell on every tool invocation, and a
// REAL env var overrides bun's auto-loaded .env) would false-green
// this check against the wrong DB. The operator discipline "unset
// DATABASE_URL && ..." is now enforced by BOTH siblings: refuse
// before any count runs.
//
// THE DISTINCTION (why the value is COMPARED, not just checked for
// presence): `bun run` auto-loads the repo's own .env into
// process.env — the RELATIVE "file:../db/custom.db" form is the repo's
// own config, not the trap. A real shell export WINS over .env, so the
// live value differing from the .env file's own value is exactly the
// foreign-export signature. An export equal to the .env value targets
// the same database either way — proceed.
function repoEnvDatabaseUrl(): string | null {
  try {
    const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
    const match = env.match(/^DATABASE_URL=("?)([^"\r\n]+)\1\s*$/m);
    return match ? match[2] : null;
  } catch {
    return null;
  }
}

const liveDatabaseUrl = process.env.DATABASE_URL ?? "";
const ownDatabaseUrl = repoEnvDatabaseUrl();
if (liveDatabaseUrl.trim() !== "" && liveDatabaseUrl !== ownDatabaseUrl) {
  // Session 82 (S82-C / B82-M3): both interpolations route through
  // redactDatabaseUrl() — the resolved-URL line below has done so
  // since S78-G precisely because "a Postgres-backed checkout never
  // prints its credentialed connection string"; the REFUSAL path was
  // the family's missed sibling (a credentialed foreign export — or
  // the repo's own .env Postgres value — printed its password to the
  // terminal on refusal). The diagnostic shape is unchanged.
  console.error(
    "REFUSED: DATABASE_URL (" +
      redactDatabaseUrl(liveDatabaseUrl).slice(0, 60) +
      ") is a foreign export — it differs from the repo's own .env value" +
      (ownDatabaseUrl ? " (" + redactDatabaseUrl(ownDatabaseUrl) + ")" : "") +
      " — so this check would run against the WRONG database. " +
      "Run it as: unset DATABASE_URL && bun run scripts/check-db-contract.ts"
  );
  process.exit(1);
}

const url = resolveDatabaseUrl(process.env.DATABASE_URL ?? "file:../db/custom.db", candidateRoots());
// Session 78 (S78-G / B-L6): the db.ts startup line's sibling — the
// resolved URL routes through redactDatabaseUrl so a Postgres-backed
// checkout never prints its credentialed connection string to the
// terminal (resolveDatabaseUrl passes non-SQLite URLs through
// UNTOUCHED — the S64-F redaction contract).
console.log("[db] URL ->", redactDatabaseUrl(url));
const prisma = new PrismaClient({ datasources: { db: { url } } });

async function main() {
  const [users, projects, elements, teams, members] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.designElement.count(),
    prisma.team.count(),
    prisma.teamMember.count(),
  ]);
  console.log(
    `users=${users} projects=${projects} elements=${elements} teams=${teams} members=${members}`
  );
  // Session 73 (S73-D — B-F9): the FIFTH count joins the contract — the
  // documented pristine form is 1/2/6/1/3, and a member-row mutation in
  // the dev DB previously passed this gate unchallenged.
  const ok = users === 1 && projects === 2 && elements === 6 && teams === 1 && members === 3;
  console.log(ok ? "PRISTINE CONTRACT OK" : "CONTRACT MISMATCH — re-seed needed");
  process.exit(ok ? 0 : 1);
}

// Session 85 (S85-D / B85-L2 — the thirty-third audit's diagnostic-quality
// fix): main() previously had NO .catch — a missing SQLite file at the
// resolved URL (the checker's MOST LIKELY failure mode: a fresh checkout,
// or a seed trapped by a parent-shell DATABASE_URL export — observed live
// this session) rejected the first count() and bun printed a minified
// PrismaClientInitializationError stack while the script's designed
// instruction line never printed. The catch answers the clean diagnostic;
// the exit code stays non-zero either way (fails closed, no false-green).
main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    "DATABASE FILE MISSING (or unreachable): " + message.slice(0, 200)
  );
  console.error(
    "Re-seed the pristine contract with: unset DATABASE_URL && bun run db:push && bun run db:seed"
  );
  process.exit(1);
}).finally(() => prisma.$disconnect());
