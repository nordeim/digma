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
  // Session 83 (S83-C — the thirty-first audit's B83-L1): the seed
  // commands' env DELETES the operator-exportable app knobs before the
  // pinned DATABASE_URL applies — the same hermeticity discipline the
  // webServer env gained this session (the raw `...process.env` spread
  // leaked the parent shell's exports into the e2e tooling).
  const hermetic = { ...process.env } as NodeJS.ProcessEnv;
  delete hermetic.DIGMA_PROXY_HOPS;
  delete hermetic.DIGMA_DISABLE_IN_APP_RESET;
  delete hermetic.DIGMA_DISABLE_IN_APP_OTP;
  delete hermetic.DIGMA_REPO_ROOT;
  const env = {
    ...hermetic,
    DATABASE_URL: "file:../db/e2e.db",
  } as NodeJS.ProcessEnv;

  // Prefer bun (the documented runtime); fall back to npx tsx for npm users.
  const run = (cmd: string) =>
    execSync(cmd, { cwd: repo, env, stdio: "pipe" }).toString();

  // Session 70 (S70-B): --accept-data-loss — the e2e database is a
  // throwaway (wiped + re-seeded by this very setup); a destructive
  // schema push (the session-70 dead-column drop was the first) must not
  // stall on the interactive confirmation the piped execSync cannot
  // answer.
  try {
    run("bunx prisma db push --skip-generate --accept-data-loss");
  } catch {
    run("npx prisma db push --skip-generate --accept-data-loss");
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
