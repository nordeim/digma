import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-78 server low batch (S78-B + S78-E + the server half of
// S78-G — the twenty-sixth audit's B-M1, B-L1, B-L2, B-L3, B-L4, B-L5,
// B-L6, B-L7).
//
// S78-B — THE DEFECT (B-M1): the P2024/P2028 -> 503 UNAVAILABLE arm
// reached only 2 of the 6 transaction-carrying routes (the S77-G pair —
// the elements PUT and the duplicate). The four uncovered sites: the
// projects POST and the teams POST (NO catch at all), the elements POST
// and the members POST (only the P2003 foreign-key arm). All six are
// the same transaction family; the abort families are not
// row-size-dependent (a concurrent small create queues behind a
// row-heavy 30s-allowed writer and hits Prisma's DEFAULT 5s interactive
// timeout -> P2028, or P2024 pool-wait), rethrowing past the
// { ok, error } envelope as unstructured 500s — the F61 N-1-of-N guard
// class the audits exist to close.
//
// THE FIX: every transaction site answers the structured arm (the
// S77-G form — instanceof Prisma.PrismaClientKnownRequestError && the
// P2024/P2028 pair -> fail("UNAVAILABLE", <route-honest copy>, 503)).
//
// S78-E — THE DEFECTS (B-L1, B-L2): GET /api/teams carried no
// take: TEAM_LIMIT (the S73-F list-bound family's missed sibling), and
// sanitizeLlmOperations' LLM-chosen ids filter kept the count cap but
// not the per-string clamp S77-F added to the route-side twins (the
// S68-C mirror never re-run).
//
// S78-G (the server honesty set): the clamp twin fold (ai-assistant.ts
// imports clampNumber from validation — the S71-D numeric leftover);
// the standaloneRepoRoot TEST-ONLY doc; the DEPLOYMENT.md
// X-Forwarded-Proto reword (the code derives cookie secure solely from
// NODE_ENV — the header is never read); the check-db-contract raw URL
// print routed through redactDatabaseUrl; the buildElementRow doc's
// honest replace-mode name semantics.

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

// The six transaction-carrying route files (the F61 enumeration — the
// family is the unit, not the member).
const TX_ROUTES = [
  "src/app/api/projects/route.ts",
  "src/app/api/teams/route.ts",
  "src/app/api/projects/[id]/elements/route.ts",
  "src/app/api/projects/[id]/duplicate/route.ts",
  "src/app/api/teams/[id]/members/route.ts",
];

// ---------------------------------------------------------------------------
// S78-B — the transaction-abort envelope family completion
// ---------------------------------------------------------------------------
describe("the transaction-abort envelope family (S78-B / B-M1)", () => {
  it("every transaction-carrying route answers the P2024/P2028 structured arm (the family pin)", () => {
    // THE DEFECT PIN: pre-fix only the elements PUT and the duplicate
    // carried the arm (2 of 6) — the four others escaped as bare 500s.
    // The family-completeness pin: the arm's presence is counted across
    // the whole family, so the next route can never silently drift.
    for (const rel of TX_ROUTES) {
      const route = src(rel);
      const arms = (route.match(/error\.code === "P2024" \|\| error\.code === "P2028"/g) ?? []).length;
      expect(arms, `${rel} must carry the P2024/P2028 arm`).toBeGreaterThanOrEqual(1);
    }
  });

  it("each arm answers the 503 UNAVAILABLE envelope (not a bare rethrow)", () => {
    for (const rel of TX_ROUTES) {
      const route = src(rel);
      const m = route.match(
        /error\.code === "P2024" \|\| error\.code === "P2028"\)\s*\)\s*\{\s*\n\s*return fail\("UNAVAILABLE", "([^"]+)", 503\);/,
      );
      expect(m, `${rel} must answer the 503 envelope`).not.toBeNull();
      expect(m?.[1]?.length ?? 0).toBeGreaterThan(10);
    }
  });

  it("the projects POST transaction gained its first catch (the S77-G helper form)", () => {
    // THE DEFECT PIN: pre-fix the projects POST had NO catch at all —
    // one future FK/unique-family error away from the same escape.
    // The S77-G runCopyTx form: the transaction body in a helper, the
    // catch wrapping the call without changing the transactional
    // shape.
    const projects = src("src/app/api/projects/route.ts");
    expect(projects).toMatch(/const runCreateTx = \(\) =>\s*\n?\s*db\.\$transaction\(/);
    expect(projects).toMatch(/try \{\s*\n\s*project = await runCreateTx\(\);[\s\S]*?\} catch \(error\) \{/);
  });

  it("the teams POST transaction gained its first catch", () => {
    const teams = src("src/app/api/teams/route.ts");
    expect(teams).toMatch(/const runCreateTx = \(\) =>\s*\n?\s*db\.\$transaction\(/);
    expect(teams).toMatch(/try \{\s*\n\s*team = await runCreateTx\(\);[\s\S]*?\} catch \(error\) \{/);
  });

  it("the elements POST's existing P2003 catch gains the abort arm beside it", () => {
    // THE DEFECT PIN: pre-fix the POST's catch handled ONLY P2003 (the
    // vanished-project foreign key); the abort family rethrew.
    const elements = src("src/app/api/projects/[id]/elements/route.ts");
    const m = elements.match(
      /error\.code === "P2003"\)\s*\{\s*\n\s*return fail\("NOT_FOUND"[^;]+;\s*\n\s*\}([\s\S]*?)throw error;/,
    );
    expect(m).not.toBeNull();
    expect(m?.[1] ?? "").toMatch(/P2024/);
  });

  it("the members POST's existing P2003 catch gains the abort arm beside it", () => {
    const members = src("src/app/api/teams/[id]/members/route.ts");
    const m = members.match(
      /error\.code === "P2003"\)\s*\{\s*\n\s*return fail\("NOT_FOUND"[^;]+;\s*\n\s*\}([\s\S]*?)(?:throw error;|return fail)/,
    );
    expect(m).not.toBeNull();
    expect(m?.[1] ?? "").toMatch(/P2024/);
  });
});

// ---------------------------------------------------------------------------
// S78-E — the server pair
// ---------------------------------------------------------------------------
describe("the teams list bound (S78-E / B-L1)", () => {
  it("the teams GET carries take: TEAM_LIMIT (the S73-F sibling)", () => {
    // THE DEFECT PIN: pre-fix nothing stood between the caller and an
    // unbounded scan — the projects list GET's exact pre-S73-F shape.
    const teams = src("src/app/api/teams/route.ts");
    const m = teams.match(/const teams = await db\.team\.findMany\(\{([\s\S]*?)\}\);/);
    expect(m).not.toBeNull();
    expect(m?.[1]).toMatch(/take:\s*TEAM_LIMIT/);
  });
});

describe("the sanitizer's per-string id clamp (S78-E / B-L2)", () => {
  it("the LLM-chosen ids filter mirrors the route-side clamp (the S68-C mirror re-run)", () => {
    // THE DEFECT PIN: pre-fix the mirror kept the count cap only — a
    // hallucinated id of unbounded length rode the operations[] to the
    // client's membership scans. Real ids are cuid-length (~25); the
    // 64-char bound matches the route-side S77-F form.
    const sanitizer = src("src/lib/ai-assistant.ts");
    const m = sanitizer.match(
      /const ids = Array\.isArray\(rawIds\)\s*\n\s*\? rawIds\.filter\(\(i\): i is string => ([^)]+)\)\.slice\(0, 100\)/,
    );
    expect(m).not.toBeNull();
    expect(m?.[1]).toMatch(/typeof i === "string" && i\.length <= 64/);
  });
});

// ---------------------------------------------------------------------------
// S78-G — the server honesty set
// ---------------------------------------------------------------------------
describe("the clamp twin fold (S78-G / B-L3)", () => {
  it("ai-assistant.ts imports clampNumber from validation (the private twin deleted)", () => {
    // THE DEFECT PIN: pre-fix a byte-identical private copy lived in
    // ai-assistant.ts beside validation.ts's export — the S71-D fold's
    // numeric leftover (a future edit to one twin silently diverging
    // the other).
    const sanitizer = src("src/lib/ai-assistant.ts");
    expect(sanitizer).toMatch(/import \{[^}]*clampNumber[^}]*\} from "@\/lib\/validation"/);
    expect(sanitizer).not.toMatch(/^function clamp\(/m);
  });
});

describe("the standaloneRepoRoot TEST-ONLY doc (S78-G / B-L4)", () => {
  it("the export's JSDoc carries the honest zero-production-consumer status", () => {
    // THE DEFECT PIN: pre-fix the JSDoc read as the production
    // detector while candidateRoots() deliberately re-implements the
    // detection inline (the minifier-drops-unused-returns reason) — the
    // family's TEST-ONLY doc convention (S63-G/S68-D) missed member.
    const dbPath = src("src/lib/db-path.ts");
    const m = dbPath.match(/export function standaloneRepoRoot\([^)]*\)[^{]*\{[\s\S]*?\n\}/);
    // Look at the doc block above the export:
    const doc = dbPath.slice(0, dbPath.indexOf("export function standaloneRepoRoot"));
    const tail = doc.slice(Math.max(0, doc.length - 1200));
    expect(tail).toMatch(/TEST-ONLY/);
  });
});

describe("the DEPLOYMENT cookie-scheme reword (S78-G / B-L5)", () => {
  it("the doc names the real mechanism (NODE_ENV), not the unread header", () => {
    // THE DEFECT PIN (F58 doc-code drift): the doc claimed
    // X-Forwarded-Proto drives cookie attributes — the code never reads
    // that header (cookie secure derives solely from NODE_ENV). The
    // honest line names NODE_ENV + the TLS-terminating-proxy guidance.
    const deployment = src("docs/DEPLOYMENT.md");
    expect(deployment).not.toMatch(/forward `X-Forwarded-Proto` so cookie/i);
    expect(deployment).toMatch(/NODE_ENV=production/);
  });
});

describe("the check-db-contract redacted print (S78-G / B-L6)", () => {
  it("the URL print routes through redactDatabaseUrl (the db.ts seam's sibling)", () => {
    // THE DEFECT PIN: pre-fix the script printed the resolved URL raw —
    // a Postgres-backed checkout printed its credentialed connection
    // string to the terminal. The db.ts startup line routes through the
    // seam precisely for this.
    const script = src("scripts/check-db-contract.ts");
    expect(script).toMatch(/redactDatabaseUrl/);
    expect(script).not.toMatch(/console\.log\("\[db\] URL ->", url\)/);
  });
});

describe("the buildElementRow doc's replace-mode honesty (S78-G / B-L7)", () => {
  it("the doc names the name-synthesis and the in-seam clamp (not the routes)", () => {
    // THE DEFECT PIN: pre-fix the comment claimed replace mode "nulls
    // omitted fields" (an omitted/empty name is SYNTHESIZED, not
    // nulled) and that name/type validation "stay at the routes" (the
    // name clamp lives in the seam one line below the claim).
    const editor = src("src/lib/editor.ts");
    // The comment-literal discipline (F58): the phrase wraps across
    // doc-comment lines — extract the block FIRST, then flatten the
    // [*\s]+ separators (the markers and wrapping collapse; the s77
    // lesson's extract-then-flatten form).
    const block = editor.match(/\/\*\* The element row shape[\s\S]*?\*\//);
    expect(block).not.toBeNull();
    const flat = (block?.[0] ?? "").replace(/[*\s]+/g, " ");
    expect(flat).toMatch(/name/);
    expect(flat).not.toMatch(/name\/type validation and the sortOrder source stay at the routes/);
    expect(flat).toMatch(/name falls back to the sequential default/);
    expect(flat).toMatch(/name clamp \(80\) lives/);
  });
});
