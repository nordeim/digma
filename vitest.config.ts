import { defineConfig } from "vitest/config";
import path from "node:path";

// Unit-test layer for the pure domain seams (editor geometry/clamps, AI
// assistant parsing/sanitization, greeting buckets, rate limiter, team
// stats, db-path resolution incl. the DIGMA_REPO_ROOT anchor). Browser/E2E
// coverage lives in tests/e2e/*.spec.ts (Playwright — never picked up by
// this config, which matches *.test.ts only) plus scripts/smoke-test.sh.
// The skills/ folder is NOT app code: it is excluded from lint (eslint
// ignores), compilation (tsconfig exclude), and this include pattern.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
