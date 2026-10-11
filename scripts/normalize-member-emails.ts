/**
 * Session 113 (S113-E / B-I1 — the sixty-first audit's legacy-row
 * normalization): the ONE-SHOT OPERATOR SCRIPT for pre-S111-D member
 * rows.
 *
 * THE RESIDUE: before session 111's dedup landed, the members POST
 * wrote `email` through a bare trim() read — case-preserved. The
 * @@unique([teamId, email]) constraint and the 409 sentinel compare
 * under SQLite's BINARY collation, so a pre-S111 row
 * ("Alex@digma.app") is NOT deduped against a normalized re-invite
 * ("alex@digma.app") — the write path is closed going forward; this
 * script closes the READ-side residue for databases that carry the
 * legacy rows.
 *
 * WHY A SCRIPT, NOT A PRISMA MIGRATION (the design decision, per the
 * sixty-first audit's B-lead judgment): (a) the repo's schema
 * workflow is `db push` — no migrations directory exists, and a
 * one-time data fix does not belong in schema history that re-runs on
 * every fresh deploy (the seed would then need the same dedup logic);
 * (b) THE CONSTRAINT-COLLISION FAILURE MODE IS REAL — a blind
 * `UPDATE teamMember SET email = lower(trim(email))` ABORTS with
 * SQLITE_CONSTRAINT UNIQUE when two pre-S111 rows in one team
 * normalize to the same key ("Alex@…" + "alex@…" — exactly the
 * residue this script targets), and a failed migration marks itself
 * failed on every deploy after. The fix requires the DEDUP-FIRST
 * POLICY: keep the EARLIEST createdAt survivor per (teamId,
 * normalized email), DELETE the later duplicates — a data-loss
 * decision that belongs in an explicit, reviewable, opt-in script.
 *
 * EDGE GUARDS: NULL and empty-string emails stay UNTOUCHED (SQLite
 * unique treats NULLs as distinct — a GROUP BY on the normalized key
 * would wrongly collapse every NULL row into one; the API's
 * clampText-nulls-empty path makes empty strings near-impossible, but
 * the guard is cheap and the failure mode is silent row loss).
 *
 * USAGE:
 *   bunx tsx scripts/normalize-member-emails.ts --dry-run   # report only
 *   bunx tsx scripts/normalize-member-emails.ts             # apply
 *
 * Idempotent: a second run finds zero duplicates and zero rewrites
 * (the seed's own data is already lowercase — running on a fresh
 * database is a no-op). Referenced from docs/DEPLOYMENT.md's upgrade
 * note for pre-S111 databases.
 */
import { PrismaClient } from "@prisma/client";

import { normalizeEmail } from "../src/lib/validation";

const db = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

async function main() {
  // createdAt ascending — the FIRST row per key is the survivor (the
  // earliest invite wins; the later duplicates are the residue).
  const rows = await db.teamMember.findMany({ orderBy: { createdAt: "asc" } });
  const byKey = new Map<string, typeof rows>();
  let skipped = 0;
  for (const row of rows) {
    // THE NULL/EMPTY GUARD: untouched, never collapsed, never deleted.
    if (row.email === null || row.email.trim() === "") {
      skipped += 1;
      continue;
    }
    const key = `${row.teamId}::${normalizeEmail(row.email)}`;
    const bucket = byKey.get(key) ?? [];
    bucket.push(row);
    byKey.set(key, bucket);
  }

  // THE DEDUP-FIRST POLICY: per (teamId, normalized email) bucket, the
  // earliest row survives and every later duplicate is deleted BEFORE
  // any rewrite runs — the survivor's rewrite can never collide with a
  // row the constraint still sees.
  const doomed: string[] = [];
  const rewritable: { id: string; email: string }[] = [];
  for (const bucket of byKey.values()) {
    const [survivor, ...duplicates] = bucket;
    doomed.push(...duplicates.map((d) => d.id));
    const normalized = normalizeEmail(survivor.email);
    if (survivor.email !== normalized) {
      rewritable.push({ id: survivor.id, email: normalized });
    }
  }

  console.log(
    `[normalize-member-emails] rows: ${rows.length} · duplicate deletions: ${doomed.length} · rewrites: ${rewritable.length} · null/empty skipped: ${skipped}${dryRun ? " (DRY RUN — nothing applied)" : ""}`,
  );
  for (const d of doomed) console.log(`  would delete member ${d}`);
  for (const r of rewritable) console.log(`  would rewrite member ${r.id} -> ${r.email}`);

  if (dryRun) return;

  // THE ONE TRANSACTION: the deletes and the rewrites land atomically —
  // a failure mid-script leaves the database exactly as it was.
  // Session 114 (S114-E / B114-L3): the route family's own timeout
  // doctrine for row-heavy interactive transactions (duplicate and
  // elements both ride 30s) — Prisma's default 5s window aborts the
  // worst-case dirty DB (a 100x100 member board of all-rewrites is
  // up to 10,000 sequential awaits) exactly when the script matters.
  await db.$transaction(
    async (tx) => {
      if (doomed.length > 0) {
        await tx.teamMember.deleteMany({ where: { id: { in: doomed } } });
      }
      for (const r of rewritable) {
        await tx.teamMember.update({ where: { id: r.id }, data: { email: r.email } });
      }
    },
    { timeout: 30_000 },
  );
  console.log("[normalize-member-emails] applied.");
}

main()
  .catch((error) => {
    console.error("[normalize-member-emails] failed:", error);
    process.exitCode = 1;
  })
  .finally(() => {
    void db.$disconnect();
  });
