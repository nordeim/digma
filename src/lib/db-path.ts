import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// The SQLite URL contract (pinned by tests/db-path.test.ts):
//
// The Prisma CLI resolves RELATIVE `file:` URLs against prisma/schema.prisma
// (the file that declares the datasource). The Prisma 6 RUNTIME engine
// anchors them the same way — against the schema directory the client was
// GENERATED against, NOT the process working directory (session 73's live
// probes: from cwd=/tmp, a relative file: URL still resolves beside the
// schema; the engine ignores the process CWD entirely). The standalone
// trap is real for a different reason: `next build` TRACES a copy of the
// generated client into .next/standalone/prisma/ — the traced schema
// relocates the engine's anchor to .next/standalone/, so a relative URL
// would resolve to .next/standalone/db/… ("Error code 14: Unable to open
// the database file"). The process.chdir(__dirname) into .next/standalone
// is REAL but causally irrelevant — the wrong mechanism steered path
// debugging toward chdir-based non-fixes for 59 sessions.
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
 * 0. DIGMA_REPO_ROOT — an explicit env override (the PAD-documented escape
 *    hatch for containers/copies where no other anchor can find the repo).
 *    Blank values add nothing. Like every anchor below it participates via
 *    the side-effect push: the production minifier cannot drop it.
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

  const envRoot = process.env.DIGMA_REPO_ROOT?.trim();
  if (envRoot) {
    roots.push(envRoot); // side effect — cannot be optimized away
  }

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

/** Session 64 (S64-F — the twelfth audit's B-6): redacts the credential
 * section of a connection URL for SAFE LOGGING. The SQLite `file:` family
 * carries no credentials and passes through verbatim; any URL whose
 * authority embeds a `user:password` pair collapses the password to `***`
 * (the username stays — it names the connection, the secret does not).
 * The startup log line prints the RESOLVED url on every boot, and the
 * resolver passes non-file URLs through unchanged — without this seam a
 * credentialed connection string would print its secret to stdout. */
export function redactDatabaseUrl(url: string): string {
  // Session 65 (S65-D — the thirteenth audit's B-3): the split runs on
  // the AUTHORITY segment (everything after scheme:// up to the first
  // path/query/hash delimiter), and within it the LAST @ separates
  // userinfo from host — the pre-fix first-@ split leaked the tail of
  // a password that itself contains the separator character (the
  // characters between the first and last separator were password
  // material, printed verbatim). Over-redaction is safe; a redaction
  // seam's contract is that the secret never prints.
  const m = /^([a-zA-Z][a-zA-Z0-9+.-]*:\/\/)([^/?#]*)/.exec(url);
  if (!m) return url;
  const [, scheme, authority] = m;
  const at = authority.lastIndexOf("@");
  if (at === -1) {
    // Session 66 (S66-C — the fourteenth audit's B-7): fail-closed for
    // the malformed family. A password containing a RAW path/query/hash
    // delimiter truncates the strict authority parse BEFORE the @ lands
    // inside it (postgres://user:pa/ss@host parsed "user:pa" as the whole
    // authority, found no @, and printed the credential verbatim —
    // against this seam's own "the secret never prints" contract). When
    // the strict parse found no separator but a LATER one exists in the
    // string, the whole span from the scheme to that LAST separator
    // collapses to *** — over-redaction is the documented safe
    // direction, and the host tail after the separator survives for
    // diagnostics. The schemeless non-URL (no scheme:// prefix) is out
    // of contract entirely and passes verbatim.
    const looseAt = url.lastIndexOf("@");
    if (looseAt > scheme.length) {
      return `${scheme}***${url.slice(looseAt)}`;
    }
    return url;
  }
  const userinfo = authority.slice(0, at);
  const colon = userinfo.indexOf(":");
  if (colon === -1) return url;
  const user = userinfo.slice(0, colon);
  // Everything after the LAST @ in the authority (the host + the
  // preserved path/query/hash tail of the original string).
  const rest = url.slice(scheme.length + at + 1);
  return `${scheme}${user}:***@${rest}`;
}
