import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// The SQLite URL contract (pinned by tests/db-path.test.ts):
//
// The Prisma CLI resolves RELATIVE `file:` URLs against prisma/schema.prisma
// (the file that declares the datasource). The runtime engine, however,
// anchors them against the process CWD — and Next's standalone server.js
// chdirs into .next/standalone before any module executes. Without
// normalization the CLI and the server can open DIFFERENT database files
// ("Error code 14: Unable to open the database file").
//
// Resolution rule: a relative `file:` URL resolves against the first
// "anchor" directory that contains prisma/schema.prisma — the same rule the
// CLI applies. Absolute file: URLs and non-SQLite URLs pass through
// untouched. A missing/blank env value falls back to <anchor>/db/custom.db.

/**
 * Recognizes Next.js's standalone output directory — <repo>/.next/standalone,
 * identifiable by its server.js — and returns the REAL repo root two levels
 * up. Returns null for anything else (a deployed standalone copy with no repo
 * above it, or a plain directory that merely contains prisma/schema.prisma).
 */
export function standaloneRepoRoot(dir: string): string | null {
  const normalized = path.resolve(dir);
  if (!normalized.endsWith(path.join(".next", "standalone"))) return null;
  if (!existsSync(path.join(normalized, "server.js"))) return null;
  const repo = path.dirname(path.dirname(normalized));
  if (existsSync(path.join(repo, "prisma", "schema.prisma"))) return repo;
  return null;
}

/**
 * Resolves a DATABASE_URL value against candidate anchor directories.
 * Pure: takes the env value and the anchors, returns the resolved URL.
 */
export function resolveDatabaseUrl(envValue: string | undefined, anchors: string[]): string {
  const raw = envValue?.trim();
  const anchor =
    anchors.find((a) => existsSync(path.join(a, "prisma", "schema.prisma"))) ??
    anchors[anchors.length - 1];

  if (!raw) {
    return `file:${path.resolve(anchor, "prisma", "..", "db", "custom.db")}`;
  }
  if (!/^file:/i.test(raw)) {
    return raw; // non-SQLite URLs (e.g. postgres://) pass through untouched
  }
  const filePath = raw.replace(/^file:/i, "");
  // Absolute POSIX path or a Windows drive letter — leave as-is.
  if (path.isAbsolute(filePath) || /^[A-Za-z]:[\\/]/.test(filePath)) {
    return `file:${filePath}`;
  }
  // Relative: the CLI rule — resolve against the anchor's prisma/ directory.
  return `file:${path.resolve(anchor, "prisma", filePath)}`;
}

/**
 * The anchor candidates for the running process, in priority order:
 *
 * 1. The standalone-detector root — when the process CWD is
 *    <repo>/.next/standalone (Next chdirs there), the real repo is two
 *    levels up. The detection is INLINE (push side effects, not return
 *    values): the production minifier inlines and drops unused returns from
 *    helper functions, which silently ate the detector's result in the
 *    standalone bundle (observed: roots shrank to the chdir'd CWD).
 * 2. This module's own repo root — valid only when the SOURCE file exists
 *    on disk (the standalone bundle rewrites import.meta.url into a virtual
 *    path that must be ignored).
 * 3. The plain CWD (dev server and scripts run from the repo root).
 */
export function candidateRoots(): string[] {
  const roots: string[] = [];
  const cwd = process.cwd();

  if (
    cwd.endsWith(path.join(".next", "standalone")) &&
    existsSync(path.join(cwd, "server.js"))
  ) {
    const repo = path.dirname(path.dirname(cwd));
    if (existsSync(path.join(repo, "prisma", "schema.prisma"))) {
      roots.push(repo); // side effect — cannot be optimized away
    }
  }

  try {
    const moduleDir = path.dirname(fileURLToPath(import.meta.url));
    const moduleRoot = path.resolve(moduleDir, "..", "..");
    if (existsSync(path.join(moduleRoot, "src", "lib", "db-path.ts"))) {
      roots.push(moduleRoot);
    }
  } catch {
    // import.meta.url unavailable or virtual — skip this anchor.
  }

  roots.push(cwd);
  return [...new Set(roots)];
}
