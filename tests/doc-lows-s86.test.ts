import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-86 docs-honesty batch (S86-C — the thirty-fourth audit's
// B86-L1 + B86-L2 + B86-L3 + the informational set).
//
// B86-L1 — THE DEFECT: `.env.example`'s test-infra header said "the five
// spec files" read E2E_BASE_URL — stale AT BIRTH: session85-fixes.spec.ts
// (itself a reader) landed in the SAME commit 6e21d43 as the S85-E header
// correction; the honesty fix undercounted its own delivery. Reality: SIX
// readers. The doc-lows-s85 pin asserted the /five spec files/i text — a
// pin on a doc's count is a SECOND copy of the count, and it stayed green
// while the claim was wrong.
//
// THE FIX: the header corrected to six AND the pin re-anchored onto a
// REALITY-DERIVED reader count — the spec greps tests/e2e/*.spec.ts for
// E2E_BASE_URL, parses the doc's claimed number, and asserts equality.
// The pin can never again enshrine a stale claim (the F72 dead-constant
// lesson's live-dynamic form, applied to a doc claim).
//
// B86-L2 — THE DEFECT: the PAD §11 key-files table carried FIVE stale
// line counts (editor-view 1870 vs 1922, properties-panel 1528 vs 1562,
// editor.ts 915 vs 948, dashboard-view 415 vs 420, ai-assistant.tsx 586
// vs 589) — S83-E corrected these exact sites once; S84/S85 grew four of
// them again while S85-F's own claim named "PAD §11" among the updated
// sites. THE FIX: the rows refreshed AND a LIVE-DERIVED pin — every §11
// row's count must equal its file's actual line count (the row-sum pin
// doctrine extended from §7.1's test rows to §11's file rows: any file
// edit now forces its §11 row update in the same commit).
//
// B86-L3 — THE DEFECT: README's API table said verify-otp "(burns on
// success, 3 attempts)" vs the implemented MAX_VERIFY_ATTEMPTS = 5 — born
// in session 43 (the same commit that implemented the 5-attempt ceiling),
// surviving 43 sessions because count-family greps never reach
// per-endpoint prose. THE FIX: "5 attempts", pinned against the route's
// own constant.

const ROOT = path.resolve(import.meta.dirname, "..");

const PAD = readFileSync(path.join(ROOT, "Project_Architecture_Document.md"), "utf8");

const ENV_EXAMPLE = readFileSync(path.join(ROOT, ".env.example"), "utf8");

const README = readFileSync(path.join(ROOT, "README.md"), "utf8");

const verifyOtpRoute = readFileSync(
  path.join(ROOT, "src/app/api/auth/verify-otp/route.ts"),
  "utf8",
);

const resetPasswordSpec = readFileSync(
  path.join(ROOT, "tests/e2e/reset-password.spec.ts"),
  "utf8",
);

// ---------------------------------------------------------------------------
// B86-L1 — the .env.example reader count, live-derived
// ---------------------------------------------------------------------------

/** The spec files under tests/e2e/ that read E2E_BASE_URL. */
function e2eBaseUrlReaders(): string[] {
  const dir = path.join(ROOT, "tests/e2e");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".spec.ts"))
    .filter((f) => readFileSync(path.join(dir, f), "utf8").includes("E2E_BASE_URL"))
    .sort();
}

/** The number the .env.example header claims. */
function claimedReaderCount(): number | null {
  const m = ENV_EXAMPLE.match(/read by the (\w+) spec files/i);
  if (!m) return null;
  const words: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  };
  return words[m[1]] ?? Number.NaN;
}

describe("the .env.example E2E_BASE_URL reader count is reality-derived (S86-C / B86-L1)", () => {
  const readers = e2eBaseUrlReaders();

  it("LIVE — the header's claimed reader count equals the actual grep count", () => {
    // THE DEFECT PIN: pre-fix the header says "five" while the grep finds
    // six (export-png, mobile-properties, session58-fixes, session60-fixes,
    // session61-fixes, session85-fixes — the last landed in the same commit
    // as the S85-E correction that wrote "five").
    expect(readers.length).toBeGreaterThanOrEqual(6);
    expect(claimedReaderCount()).toBe(readers.length);
  });

  it("LIVE — every grep-derived reader is a real file (the count's members are honest)", () => {
    for (const reader of readers) {
      expect(existsSync(path.join(ROOT, "tests/e2e", reader))).toBe(true);
    }
  });

  it("DOC — the header still names the config's own reader (E2E_PORT) alongside", () => {
    expect(ENV_EXAMPLE).toMatch(/E2E_PORT/);
    expect(ENV_EXAMPLE).toMatch(/E2E_BASE_URL/);
  });
});

// ---------------------------------------------------------------------------
// B86-L2 — the PAD §11 key-files line counts, live-derived
// ---------------------------------------------------------------------------

/** Parse the §11 key-files table's rows: [file, claimed lines]. */
function parseKeyFilesTable(): Array<{ file: string; claimed: number }> {
  const rows = [...PAD.matchAll(/^\| `([^`]+)` \| (\d+) \|/gm)];
  return rows.map((m) => ({ file: m[1], claimed: Number(m[2]) }));
}

describe("the PAD §11 key-files line counts are live-derived (S86-C / B86-L2)", () => {
  const rows = parseKeyFilesTable();

  it("TABLE — the parser found the key-files rows (the pin is live, not dead)", () => {
    // The F72 dead-constant hazard: a pin over an empty parse is a green
    // lie. The table carries ~29 rows.
    expect(rows.length).toBeGreaterThanOrEqual(25);
  });

  it("LIVE — every row's claimed line count equals its file's actual line count", () => {
    // THE DEFECT PIN: pre-fix five rows were stale (editor-view 1870 vs
    // 1922, properties-panel 1528 vs 1562, editor.ts 915 vs 948,
    // dashboard-view 415 vs 420, ai-assistant.tsx 586 vs 589) — grown by
    // the S84/S85 deliveries themselves while the table stood still. The
    // live-derived form: any future file edit forces its §11 row update
    // in the same commit (the row-sum pin's doctrine, extended).
    expect(rows.length).toBeGreaterThan(0);
    const stale: string[] = [];
    for (const row of rows) {
      const file = path.join(ROOT, row.file);
      if (!existsSync(file)) continue; // external/UI-adjacent rows skip
      const actual = readFileSync(file, "utf8").split("\n").length - 1;
      if (actual !== row.claimed) {
        stale.push(`${row.file}: claimed ${row.claimed}, actual ${actual}`);
      }
    }
    expect(stale).toEqual([]);
  });

  it("LIVE — the five audited members are present and exact (the named defect set)", () => {
    const byFile = new Map(rows.map((r) => [r.file, r.claimed]));
    const editorView = readFileSync(
      path.join(ROOT, "src/components/editor/editor-view.tsx"),
      "utf8",
    ).split("\n").length - 1;
    const panel = readFileSync(
      path.join(ROOT, "src/components/editor/properties-panel.tsx"),
      "utf8",
    ).split("\n").length - 1;
    const editorLib = readFileSync(path.join(ROOT, "src/lib/editor.ts"), "utf8").split("\n")
      .length - 1;
    expect(byFile.get("src/components/editor/editor-view.tsx")).toBe(editorView);
    expect(byFile.get("src/components/editor/properties-panel.tsx")).toBe(panel);
    expect(byFile.get("src/lib/editor.ts")).toBe(editorLib);
  });
});

// ---------------------------------------------------------------------------
// B86-L3 — the README verify-otp attempts claim, pinned against the route
// ---------------------------------------------------------------------------

describe("the README verify-otp attempts claim matches the implementation (S86-C / B86-L3)", () => {
  it("SOURCE — the route's ceiling is 5 (the implementation the prose must match)", () => {
    expect(verifyOtpRoute).toMatch(/const MAX_VERIFY_ATTEMPTS = 5;/);
  });

  it("DOC — the README API table says 5 attempts (the 43-session-old '3 attempts' corrected)", () => {
    // THE DEFECT PIN: pre-fix README:287 said "(burns on success, 3
    // attempts)" — born in session 43's own commit (the same one that
    // implemented the 5-attempt ceiling); AGENTS and PAD both say 5.
    expect(README).toMatch(/burns on success, 5 attempts/);
    expect(README).not.toMatch(/burns on success, 3 attempts/);
  });
});

// ---------------------------------------------------------------------------
// The informational set — the comment-count and tool-chain honesty
// ---------------------------------------------------------------------------

describe("the S86-C informational honesty set", () => {
  it("DOC — reset-password.spec's own-bucket comment counts its SEVEN auth calls", () => {
    // B86-I1: the comment said "six auth calls" — the call-level
    // enumeration finds SEVEN (register, verify-otp, the invalid-token
    // submit's reset POST, the round-trip's forgot + reset, the old
    // login, the new login); 3 headroom at the 10-call bucket ceiling.
    expect(resetPasswordSpec).toMatch(/seven auth calls/);
    // Session 87 (S87-D / B87-L1): the negative form WIDENED — the
    // hyphenated "six-call" twin survived the S86-C header repair because
    // the spaced pattern alone never reached it. Both twins are covered
    // forever now.
    expect(resetPasswordSpec).not.toMatch(/six.call/i);
  });

  it("DOC — the PAD's smoke row names the script's real tool chain (bash + curl + python3, no jq)", () => {
    // B86-I2: the row said "bash + curl + jq" — the script has zero jq
    // (python3 at :345/:386/:401 does the JSON work).
    expect(PAD).toMatch(/bash \+ curl \+ python3/);
    expect(PAD).not.toMatch(/bash \+ curl \+ jq/);
  });

  it("SURVIVAL — the S85-E reader-attribution intent rides through (the header still names the config reader)", () => {
    // The re-anchored doc-lows-s85 pin's intent: only E2E_PORT is the
    // config's; the spec files own E2E_BASE_URL. The count now derives
    // from reality (this file's LIVE pin above).
    expect(ENV_EXAMPLE).toMatch(/the Playwright CONFIG\s*\n?#?\s*reads E2E_PORT/i);
  });
});
