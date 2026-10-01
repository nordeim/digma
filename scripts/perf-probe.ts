// Perf probe (session 49, S49-1): boot the PRODUCTION standalone build with
// a scratch SQLite DB, create a scratch project, push 120 elements through
// the public API, then measure in-browser: idle rAF pacing, long-task
// counts during a synthetic element drag, and first-content render of the
// 120-element canvas. The dev-server variant of this probe (session 48)
// measured ~39ms/frame synthetic drag — dev-mode overhead; THIS pass runs
// the standalone build (the production artifact).
//
// Usage: bun scripts/perf-probe.ts   (keep it in the foreground or nohup it;
// the server stays up until killed)
// Cleanup: pkill -f perf-probe (plus the standalone server), then
// rm db/perf.db — the scratch project lives only in that scratch DB.

import { execSync, spawn } from "node:child_process";
import path from "node:path";

const repo = path.resolve(import.meta.dirname, "..");
const PORT = 3200;
const BASE = `http://localhost:${PORT}`;
const DB = "file:../db/perf.db";

function run(cmd: string) {
  execSync(cmd, { cwd: repo, env: { ...process.env, DATABASE_URL: DB }, stdio: "pipe" });
}

async function main() {
  // 1. Fresh scratch DB (schema + seed so the demo user exists).
  run("bunx prisma db push --skip-generate");
  run("bun prisma/seed.ts");

  // 2. Boot the standalone production server on :3200.
  const server = spawn("bun", [".next/standalone/server.js"], {
    cwd: repo,
    env: {
      ...process.env,
      PORT: String(PORT),
      NODE_ENV: "production",
      DATABASE_URL: DB,
      AUTH_SECRET: "perf-probe-session-secret",
      DIGMA_DISABLE_AI_LLM: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (d) => process.stdout.write(`[srv] ${d}`));
  server.stderr.on("data", (d) => process.stderr.write(`[srv-err] ${d}`));

  // Wait for health.
  let healthy = false;
  for (let i = 0; i < 60 && !healthy; i++) {
    try {
      const r = await fetch(`${BASE}/api/health`);
      healthy = r.ok;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  if (!healthy) throw new Error("standalone server never became healthy");
  console.log("[probe] server healthy on :", PORT);

  // 3. Login (demo) + create scratch project + push 120 elements.
  const login = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": "203.0.113.77" },
    body: JSON.stringify({ email: "demo@digma.app", password: "Digma1234!" }),
  });
  const cookie = login.headers.get("set-cookie")!.split(";")[0];

  const created = await fetch(`${BASE}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({ name: "PERF PROBE SCRATCH", description: "delete me" }),
  });
  const cjson = await created.json();
  const projectId = cjson.data.project.id;
  console.log("[probe] scratch project:", projectId);

  const elements = Array.from({ length: 120 }, (_, i) => ({
    type: "rectangle",
    name: `Perf Rect ${i + 1}`,
    x: 40 + (i % 12) * 80,
    y: 40 + Math.floor(i / 12) * 70,
    width: 70,
    height: 55,
    fill: i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#8b5cf6" : "#10b981",
    stroke: null,
    strokeWidth: 0,
    rotation: 0,
    scale: 1,
    opacity: 1,
    radius: 0,
    visible: true,
    locked: false,
  }));
  const t0 = Date.now();
  const put = await fetch(`${BASE}/api/projects/${projectId}/elements`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({ elements }),
  });
  const putMs = Date.now() - t0;
  const putJson = await put.json();
  console.log(`[probe] full-list PUT of 120 elements: ${putMs}ms, ok=${putJson.ok}, count=${putJson.data?.elements?.length ?? "?"}`);

  // 4. Drive the browser: agent-browser measures rAF pacing + long tasks.
  console.log("[probe] project URL:", `${BASE}/Editor?projectId=${projectId}`);
  console.log("[probe] cookie for agent-browser state:", cookie);
  console.log("[probe] DONE-SERVER-READY");

  // Keep the server alive until killed; the shell orchestrates the rest.
  await new Promise(() => {});
}

main().catch((e) => {
  console.error("[probe] failed:", e);
  process.exit(1);
});
