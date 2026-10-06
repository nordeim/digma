import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-85 docs-honesty batch (S85-C + S85-E — the thirty-third
// audit's B85-L1 + the informational set).
//
// S85-C — THE DEFECT (B85-L1, the F68/F70 count family's recurrence):
// the PAD §7.1 per-row counts had drifted while the totals stayed
// correct — server-lows-s84 said 10 (the file holds 11 it() blocks;
// the S84 delivery's own arithmetic "1024 = 994 + 30" with
// client-lows=10 + doc-lows=9 REQUIRES 11 — the row was born
// miscounted) and workspace.spec said 10 (Playwright lists 11; the
// session-56 bell test landed after the row was last touched). The §7.1
// unit rows summed to 1023 against the correct total 1024; the e2e rows
// to 259 against 260. The count pins pin the TOTALS — they cannot see
// per-row drift.
//
// THE FIX: the two rows corrected + THE ROW-SUM PIN — this file parses
// the §7.1 table and asserts each family's rows SUM to its total, so a
// per-row drift can never again hide behind a correct total (this
// session's exact finding mode becomes structurally un-redistributable).

const PAD = readFileSync(
  path.resolve(import.meta.dirname, "../Project_Architecture_Document.md"),
  "utf8",
);

const ENV_EXAMPLE = readFileSync(
  path.resolve(import.meta.dirname, "../.env.example"),
  "utf8",
);

const panelSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/editor/properties-panel.tsx"),
  "utf8",
);

const recentSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/recent-view.tsx"),
  "utf8",
);

const docLowsS84Source = readFileSync(
  path.resolve(import.meta.dirname, "./doc-lows-s84.test.ts"),
  "utf8",
);

// ---------------------------------------------------------------------------
// S85-C — the PAD §7.1 row repair + the row-sum pin (B85-L1)
// ---------------------------------------------------------------------------

/** Parse the §7.1 coverage table's per-file rows and totals. */
function parseCoverageTable() {
  // Both unit-row location forms: the tests/ family and the src/lib
  // colocated family (editor/export-png/ai-assistant/validation/
  // rate-limit/greeting/team — 7 rows whose location column reads
  // "src/lib").
  const unitRows = [...PAD.matchAll(/^\| Unit — .*? \| `([^`]+)` \| (\d+) \| (?:tests|src\/lib) \| Vitest \|$/gm)]
    .map((m) => ({ file: m[1], count: Number(m[2]) }));
  const e2eRows = [...PAD.matchAll(/^\| E2E — .*? \| `([^`]+)` \| (\d+) \| tests\/e2e \| Playwright \|$/gm)]
    .map((m) => ({ file: m[1], count: Number(m[2]) }));
  const unitTotal = PAD.match(/^\| \*\*Unit total\*\* \| \*\*(\d+) files\*\* \| \*\*(\d+)\*\* \| \| Vitest \|$/m);
  const e2eTotal = PAD.match(/^\| \*\*E2E total\*\* \| \*\*(\d+) files\*\* \| \*\*(\d+)\*\* \| \| Playwright \|$/m);
  return {
    unitRows,
    e2eRows,
    unitFiles: unitTotal ? Number(unitTotal[1]) : null,
    unitTotal: unitTotal ? Number(unitTotal[2]) : null,
    e2eFiles: e2eTotal ? Number(e2eTotal[1]) : null,
    e2eTotal: e2eTotal ? Number(e2eTotal[2]) : null,
  };
}

describe("the PAD §7.1 row-sum pin — per-row drift can never again hide behind a correct total (S85-C / B85-L1)", () => {
  const table = parseCoverageTable();

  it("ROW-SUM — the unit rows sum to the Unit total (the F68/F70 closure for the table)", () => {
    // THE DEFECT PIN: pre-fix the unit rows sum to 1023 against the
    // correct total 1024 (server-lows-s84's row said 10; the file holds
    // 11 it() blocks — born miscounted in the S84 commit itself).
    expect(table.unitRows.length).toBeGreaterThanOrEqual(130);
    const sum = table.unitRows.reduce((acc, row) => acc + row.count, 0);
    expect(sum).toBe(table.unitTotal);
  });

  it("ROW-SUM — the e2e rows sum to the E2E total", () => {
    // THE DEFECT PIN: pre-fix the e2e rows sum to 259 against the correct
    // total 260 (workspace.spec's row said 10; Playwright lists 11 — the
    // session-56 bell test landed after the row was last touched).
    expect(table.e2eRows.length).toBeGreaterThan(35);
    const sum = table.e2eRows.reduce((acc, row) => acc + row.count, 0);
    expect(sum).toBe(table.e2eTotal);
  });

  it("ROW — the server-lows-s84 row says 11 (the S84 delivery's own arithmetic requires it)", () => {
    const row = table.unitRows.find((r) => r.file === "tests/server-lows-s84.test.ts");
    expect(row?.count).toBe(11);
  });

  it("ROW — the workspace.spec row says 11 (the session-56 bell test is in the file's runtime count)", () => {
    const row = table.e2eRows.find((r) => r.file === "tests/e2e/workspace.spec.ts");
    expect(row?.count).toBe(11);
  });
});

// ---------------------------------------------------------------------------
// S85-E — the small-honesty batch (the informational set)
// ---------------------------------------------------------------------------

describe("the S85-E small-honesty batch", () => {
  it("SOURCE — the doc-lows-s84 FILES constant is corrected AND made live (the dead wrong copy)", () => {
    // A85-I1: `const FILES = "140"` was declared and never asserted — a
    // dead wrong copy one edit away from becoming a live wrong pin. The
    // fix: corrected and ASSERTED DYNAMICALLY — the constant must equal
    // the PAD §7.1 total row's file count (self-maintaining across
    // future deliveries), and it must be USED (occurrences beyond the
    // lone declaration).
    const padTotalFiles = PAD.match(/\| \*\*Unit total\*\* \| \*\*(\d+) files\*\*/)?.[1];
    expect(docLowsS84Source).toMatch(new RegExp(`const FILES = "${padTotalFiles}";`));
    const uses = docLowsS84Source.match(/\bFILES\b/g) ?? [];
    expect(uses.length).toBeGreaterThanOrEqual(3);
  });

  it("SOURCE — the H-field's displayed min aligns with the enforced type-aware floor (the display asymmetry)", () => {
    // A85-I3: the H field rendered min={0} while its onChange clamps
    // through clampSizeField (floor 1 for non-line types) and the W
    // sibling carried the type-conditional min. Cosmetic — but the
    // displayed floor should agree with the enforced one.
    expect(panelSource).toMatch(
      /label="H"[\s\S]{0,400}?min=\{element\.type === "line" \? 0 : 1\}/
    );
  });

  it("SOURCE — the Recent name sort pins the explicit locale (the S84-D en-US family's sort sibling)", () => {
    // A85-I4: bare localeCompare collates per the runtime locale —
    // diacritic names order differently per device. The date siblings
    // pinned "en-US" in S84-D; the sort sibling now pins "en".
    expect(recentSource).toMatch(/b\.name\.localeCompare\(a\.name, "en"\)/);
  });

  it("DOC — the .env.example test-infra header names both readers honestly (the config AND the spec files)", () => {
    // B85-I1: "read by the Playwright config, not the app" — E2E_BASE_URL
    // is actually read by the spec files; only E2E_PORT is the config's.
    // Session 86 (S86-C / B86-L1): legitimately re-anchored — the pin
    // asserted the literal "five spec files" while session85-fixes.spec.ts
    // (itself a reader) had landed in the same commit as the S85-E
    // correction; the header now says six and the COUNT lives in
    // doc-lows-s86's reality-derived pin (grep the spec files, parse the
    // header's number, assert equality — no second copy can rot).
    expect(ENV_EXAMPLE).toMatch(/read by the Playwright layer/i);
    expect(ENV_EXAMPLE).toMatch(/six spec files/i);
    expect(ENV_EXAMPLE).toMatch(/E2E_PORT/);
    expect(ENV_EXAMPLE).toMatch(/E2E_BASE_URL/);
  });

  it("SOURCE — the check-db-contract script answers its clean diagnostic instead of a raw Prisma dump (the missing-file mode)", () => {
    // B85-L2: main() had NO .catch — a missing SQLite file at the
    // resolved URL rejected the first count() and the script's designed
    // instruction line never printed (a minified PrismaClientInitialization
    // Error stack instead). The checker's MOST LIKELY failure mode (a
    // fresh checkout / a trapped seed) now prints the re-seed instruction.
    const script = readFileSync(
      path.resolve(import.meta.dirname, "../scripts/check-db-contract.ts"),
      "utf8",
    );
    expect(script).toMatch(/\.catch\(/);
    expect(script).toMatch(/re-seed|DATABASE FILE MISSING/i);
  });
});
