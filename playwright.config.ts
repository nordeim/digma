import { defineConfig, devices } from "@playwright/test";

// E2E layer: boots the PRODUCTION standalone server on an isolated port
// with its own scratch database (db/e2e.db, schema-pushed + seeded by the
// global setup), then drives the real UI in Chromium.
//
// Prerequisites: `bun run build` (the standalone server must exist).
// Run with: `bun run test:e2e`.
//
// Routes are CAPITALIZED (/Dashboard, /Recent, /Teams, /Editor) with a
// lowercase /login — reference-app parity (see PAD ADR-008); legacy
// lowercase URLs 307-redirect to the canonical ones.
//
// Auth strategy: the "setup" project signs the demo user in ONCE and saves
// the session cookie to tests/e2e/.auth/user.json; every spec in the main
// project starts with that storageState. This is not just speed — the auth
// endpoints are rate-limited (10 attempts/IP/15 min), so per-test logins
// would trip the limiter mid-suite. tests/e2e/auth.spec.ts opts back out
// with an empty storageState because it tests the logged-out surface.
//
// The unit layer stays in Vitest (see vitest.config.ts — it matches
// *.test.ts only, so these *.spec.ts / *.setup.ts files are never picked
// up twice). The skills/ folder is not app code and never enters any gate.

const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = `http://localhost:${PORT}`;
const E2E_DATABASE_URL = "file:../db/e2e.db";
const AUTH_STATE = "tests/e2e/.auth/user.json";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1, // one worker: the specs share a single seeded SQLite file
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      testIgnore: /auth\.setup\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: AUTH_STATE,
      },
    },
  ],
  globalSetup: "./tests/e2e/global-setup.ts",
  webServer: {
    // Session 68 (S68-D — the sixteenth audit's L-6): a leftover :3100
    // standalone server is NEVER silently reused — a stale server
    // carries old code and SURVIVING in-memory rate-limit buckets (the
    // global-setup re-seed resets the DB file, not process memory — a
    // prior run's exhausted ai:/auth: bucket fails later runs
    // nondeterministically). The pre-kill mirrors the smoke suite's own
    // discipline; the ANCHORED pattern (^bun .next/standalone) matches
    // only a real bun server process — never this command's own shell,
    // whose cmdline carries the pattern text inside the full command
    // string (the naive unanchored form killed the shell itself).
    //
    // Session 84 (S84-C revision — the F71 runtime discovery): the
    // hermetic knob removal moved INTO THE COMMAND. Playwright's
    // webServer env MERGES the provided object OVER process.env —
    // `delete` lines in the env object (the S83-C form) were
    // INEFFECTIVE for parent-exported vars: the merged child env simply
    // re-inherited them (proven live: a probe config with a deleted
    // HOSTNAME still delivered it to the spawned server; an exported
    // HOSTNAME binds the standalone server non-loopback and the health
    // URL times out — the exact webServer timeout this session's
    // runtime witness caught, falsifying the S83-C source-only pins).
    // The command-level `env -u` form is the only effective removal:
    // coreutils env execs bun directly (the process cmdline keeps the
    // ^bun anchor the pre-kill needs) with the seven knobs REMOVED —
    // the five app knobs (the four of S83-C plus DIGMA_SITE_URL, the
    // S100-D/B100-L2 addition: the SEO-surface knob landed in S99-G
    // without joining either removal list — unobservable only while
    // the prerender defect B100-H1 baked the body at build, so the
    // day the force-dynamic fix made the knob live at runtime, a
    // parent-shell export would have steered the e2e server's
    // robots/sitemap — the exact class the S84-C revision closed)
    // plus the standalone runtime's own HOSTNAME (Docker exports it
    // as the container id; a resolvable value binds a non-loopback
    // address so the localhost health URL never answers) and
    // KEEP_ALIVE_TIMEOUT.
    command:
      'pkill -f "^bun .next/standalone" >/dev/null 2>&1 || true; exec env -u DIGMA_PROXY_HOPS -u DIGMA_DISABLE_IN_APP_RESET -u DIGMA_DISABLE_IN_APP_OTP -u DIGMA_REPO_ROOT -u DIGMA_SITE_URL -u HOSTNAME -u KEEP_ALIVE_TIMEOUT bun .next/standalone/server.js',
    url: `${BASE_URL}/api/health`,
    timeout: 60_000,
    reuseExistingServer: false,
    env: {
      // Session 84 (S84-C revision): the OVERRIDES below are the env
      // object's real job — Playwright merges this object OVER the
      // parent process.env (the F71 discovery), so overriding is
      // effective while DELETING is not (a deleted key simply
      // re-inherits the parent's value in the merged child env — the
      // S83-C delete lines were removed for that reason; the
      // removal now lives in the command's `env -u` prefix above).
      // The five pinned overrides stand:
      ...process.env as Record<string, string>,
      PORT: String(PORT),
      NODE_ENV: "production",
      DATABASE_URL: E2E_DATABASE_URL,
      AUTH_SECRET: "playwright-e2e-session-secret",
      // Deterministic AI seam (session 27): the z-ai SDK is REACHABLE from
      // the standalone server in this environment, so the LLM path can win
      // and its free-form replies make every AI assertion non-deterministic
      // (observed live: the LLM echoed "Deleted selected element" with
      // bogus ids while the fallback would have said "Deleted 1 element.").
      // The e2e suite pins the DETERMINISTIC FALLBACK's exact replies — the
      // LLM path stays covered by its degrade-not-fail contract (any reply
      // shape, canvas mutation, no crash).
      DIGMA_DISABLE_AI_LLM: "1",
    } as Record<string, string>,
  },
});
