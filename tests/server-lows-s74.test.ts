import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-74 server/infra low batch (S74-D + S74-E + S74-F +
// S74-G + S74-H — the twenty-second audit's B74-F1 + B74-F2 + B74-F3 +
// B74-F6 + B74-F7 + A74-I2).
//
// S74-D / B74-F1 — THE DEFECT: db.ts's header still asserts the RETIRED
// chdir mechanism ("the engine against the CWD") — the wrong mechanism
// session-73's live probes disproved (the Prisma 6 runtime anchors
// relative file: URLs against the schema directory the client was
// generated against). The S73-H correction fixed db-path.ts + AGENTS +
// the skill but missed this second code site — the comment steers path
// debugging toward chdir-based non-fixes.
//
// S74-E / B74-F2 — THE DEFECT: check-db-contract.ts resolves
// process.env.DATABASE_URL verbatim — under the sandbox's standing
// exported var it validates a FOREIGN checkout's DB (the exact
// false-green family the smoke-test.sh refusal killed). The F60
// discipline-becomes-mechanism lesson: the guard belongs in BOTH
// siblings.
//
// S74-F — the honesty batch: the stale "three list-family routes"
// count (S73-H made the projects POST the FOURTH consumer); the PAD
// §931 S58-E bullet's phantom canvasStyleFor citation (the retirement
// pin scans only src/tests — the living architecture doc keeps the
// name that masked the session-73 headline).
//
// S74-G / A74-I2 — THE DEFECT: bg-neutral-900 is the one
// consumed-but-unpinned palette scale (four view-toggle sites) — the
// @theme pins block's own rule ("every palette scale the app consumes
// is pinned") is violated; a future neutral-500/700 use would silently
// take the v4 oklch default.
//
// S74-H / B74-F6 — THE DEFECT: verify-otp has no terminal return
// after the `if (verifiedResult.count === 0)` block — a count outside
// {0,1} (impossible for a unique-id updateMany, but the compiler
// cannot prove it) would return undefined (an empty 200).

const ROOT = path.resolve(import.meta.dirname, "..");

function src(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

describe("the db.ts mechanism comment joins the correction (S74-D)", () => {
  it("db.ts's header states the schema-anchoring mechanism (no chdir claim)", () => {
    // THE DEFECT PIN: pre-fix the header says "the engine against the
    // CWD" — the retired theory.
    const db = src("src/lib/db.ts");
    expect(db).not.toMatch(/engine anchors[^.]*against the CWD/i);
    expect(db).not.toMatch(/the engine against the CWD/);
    expect(db).toMatch(/schema[- ]anchoring|schema directory/i);
  });

  it("db-path.ts keeps the S73-H corrected mechanism (the preservation pin)", () => {
    const dbPath = src("src/lib/db-path.ts");
    expect(dbPath).toMatch(/schema directory/i);
  });
});

describe("the check-db-contract refusal mechanism (S74-E)", () => {
  it("the script REFUSES an exported DATABASE_URL before any count runs", () => {
    // THE DEFECT PIN: pre-fix the script resolves
    // process.env.DATABASE_URL verbatim — the false-green
    // foreign-checkout family.
    const script = src("scripts/check-db-contract.ts");
    expect(script).toMatch(
      /DATABASE_URL[^\n]*(refus|exit\(1\))|refus[^\n]*DATABASE_URL/i,
    );
    expect(script).toMatch(/process\.exit\(1\)/);
  });

  it("the smoke script keeps its S73-D refusal (the preservation pin)", () => {
    expect(src("scripts/smoke-test.sh")).toMatch(/DATABASE_URL/);
    expect(src("scripts/smoke-test.sh")).toMatch(/exit 1/);
  });
});

describe("the honesty batch (S74-F)", () => {
  it("the THUMBNAIL_ELEMENT_SELECT doc counts FOUR list-family routes", () => {
    // THE DEFECT PIN: pre-fix the seam's doc says "the three
    // list-family routes" — S73-H made the projects POST the fourth
    // consumer; the seam's own doc is stale by one.
    const editor = src("src/lib/editor.ts");
    expect(editor).toMatch(/four list-family routes/i);
    expect(editor).not.toMatch(/three list-family routes/i);
  });

  it("the PAD's historical S58-E bullet no longer cites the phantom seam", () => {
    // THE DEFECT PIN: the PAD §931 bullet cites "(matching
    // `canvasStyleFor`)" — the seam that never existed; the retirement
    // pin scans only src/tests, so the living doc kept it. The v1.52.0
    // revision block's own RETIREMENT note legitimately names the dead
    // identifier (the record of what was retired) — the pin anchors on
    // the CITATION form ("matching …"), not the retirement note's.
    const pad = src("Project_Architecture_Document.md");
    expect(pad).not.toMatch(/matching\s+`?canvasStyleFor`?/);
    // And the citation family is gone from the historical S58-E bullet:
    // the §931 bullet's EXACT contract claim now names a real seam.
    const s58e = pad.slice(pad.indexOf("S58-E (B-M-1"));
    expect(s58e.slice(0, 700)).not.toMatch(/canvasStyleFor/);
  });

  it("the src-wide phantom-citation retirement stays complete (the preservation pin)", () => {
    for (const rel of [
      "src/components/editor/editor-view.tsx",
      "tests/present-text.test.ts",
      "tests/e2e/session58-fixes.spec.ts",
    ]) {
      expect(src(rel)).not.toMatch(/canvasStyleFor/);
    }
  });
});

describe("the neutral-900 palette pin (S74-G)", () => {
  it("the @theme pins block carries the literal neutral-900 hex", () => {
    // THE DEFECT PIN: pre-fix the pins block pins gray/slate but NOT
    // neutral — the one consumed-but-unpinned scale (four view-toggle
    // sites), the exact trap the block's own rule documents.
    const css = src("src/app/globals.css");
    expect(css).toMatch(/--color-neutral-900: #171717;/);
  });

  it("the consumed sites stay the modifier form (the preservation pin)", () => {
    const dash = src("src/components/dashboard-view.tsx");
    const recent = src("src/components/recent-view.tsx");
    expect(dash).toMatch(/bg-neutral-900 \/|bg-neutral-900\b/);
    expect(recent).toMatch(/hover:bg-neutral-900\/90/);
  });
});

describe("the verify-otp terminal return (S74-H)", () => {
  it("the handler answers the envelope after the count===0 block (totality)", () => {
    // THE DEFECT PIN: pre-fix the function falls off its end after the
    // count===0 block — an impossible count returns undefined (an
    // empty 200). noImplicitReturns is off, so only a source pin
    // holds the totality.
    const route = src("src/app/api/auth/verify-otp/route.ts");
    expect(route).toMatch(
      /return fail\("NOT_FOUND", "User not found", 404\);/,
    );
    // The terminal return sits AFTER the count===0 block's closing.
    const body = route.slice(route.indexOf("verifiedResult.count === 0"));
    expect(body).toMatch(/return fail\("NOT_FOUND", "User not found", 404\);/);
  });

  it("the S73-H live-condition simplification stays (the preservation pin)", () => {
    const route = src("src/app/api/auth/verify-otp/route.ts");
    expect(route).toMatch(/if \(verifiedResult\.count === 0\) \{/);
    expect(route).not.toMatch(/user\.verifyCode !== code \|\| verifiedResult/);
  });
});
