import { execSync } from "node:child_process";
import path from "node:path";

/**
 * Playwright global setup: guarantee the isolated e2e database exists and
 * carries the demo seed, so every spec run starts from the same state.
 *
 * The database lives at <repo>/db/e2e.db (gitignored like every db/*.db).
 * `DATABASE_URL="file:../db/e2e.db"` resolves against prisma/ for the CLI
 * and against the schema anchor at runtime — one file, both tools.
 */
export default function globalSetup(): void {
  const repo = path.resolve(__dirname, "..", "..");
  const env = {
    ...process.env,
    DATABASE_URL: "file:../db/e2e.db",
  } as NodeJS.ProcessEnv;

  // Prefer bun (the documented runtime); fall back to npx tsx for npm users.
  const run = (cmd: string) =>
    execSync(cmd, { cwd: repo, env, stdio: "pipe" }).toString();

  try {
    run("bunx prisma db push --skip-generate");
  } catch {
    run("npx prisma db push --skip-generate");
  }
  try {
    run("bun prisma/seed.ts");
  } catch {
    run("npx tsx prisma/seed.ts");
  }
  // Seed amendment (session 35, S35-1): backdate one seed project's
  // lastOpenedAt past the 7-day activity window (its updatedAt stays fresh —
  // Prisma bumps it on this write) so the Quick Stats formula pin has a
  // discriminating datum. See tests/e2e/backdate-portfolio.ts.
  try {
    run("bun tests/e2e/backdate-portfolio.ts");
  } catch {
    run("npx tsx tests/e2e/backdate-portfolio.ts");
  }
}
