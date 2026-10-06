import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-89 marker-widening pass (S89-B — the thirty-seventh
// audit's B89-L1, the F68/F70/F74/F75 family's forward-looking member
// ONE LAYER DOWN: the coverage-completeness companion's own MARKER was
// pattern-shaped beneath the enumerator it guards).
//
// THE DEFECT: the S88-B coverage companion swept the family's markers
// via ASSISTANT_MARKER — whose direct-API alternative enumerated only
// the literal `fetch(["']/api/ai-assistant` form. A future spec using
// the Playwright-native request.post("/api/ai-assistant") or
// page.request.post(...) form — ALREADY the suite's established
// vocabulary (session71-fixes.spec.ts:193/:207/:230 uses it for auth
// calls) — touches no marker, contributes zero enumerated sends, and
// needs no exemption: the sweep stays green while the file consumes
// the REAL shared ai: bucket, with the eventual failure mode the
// B88-L1 class (a mid-suite 429 RATE_LIMITED envelope with no reply
// cascading through every 15s fallback assertion). The forcing
// function deserved the same family-widening its enumerator received
// in S88-B — the F75 lesson applied to the marker itself.
//
// THE FIX: the marker's direct-API alternative widens to the
// ROUTE-PATH family — any `["']\/api\/ai-assistant` string literal,
// complete by construction over every transport (fetch(,
// request.post(, page.request.post(, whatever comes) — the
// e2eBaseUrlReaders doctrine's form. The locator-family and
// askAssistant( alternatives ride through unchanged; the EXEMPTED
// record rides through unchanged (session67 still matches via the path
// literal, so its exemption stays load-bearing).

const ROOT = path.resolve(import.meta.dirname, "..");
const specDir = path.join(ROOT, "tests/e2e");

const docLowsS87Source = readFileSync(
  path.join(ROOT, "tests/doc-lows-s87.test.ts"),
  "utf8",
);

const session71Source = readFileSync(
  path.join(specDir, "session71-fixes.spec.ts"),
  "utf8",
);

/** The widened direct-API alternative in the marker's own escaped SOURCE
 * form: the route-path family joined directly onto the askAssistant
 * branch (the askAssistant prefix is what keeps this pin RED pre-fix:
 * the narrow form's own tail already contains the bare path-literal
 * sequence, so only the JOINED form discriminates the widening). The
 * pin matches the SOURCE CHARACTERS of the four-char bracket-quote
 * sequence itself — never a regex char class. */
const WIDENED_ALTERNATIVE =
  /\|askAssistant\\\(\|\["'\]\\\/api\\\/ai-assistant\//;

/** The pattern-shaped narrow form in the same literal-source terms —
 * the fetch-prefixed alternative — must be GONE post-fix (a stale
 * alternative surviving beside the family form would keep the narrowed
 * semantics readable as the real branch). */
const NARROW_FORM = /fetch\\\(\["'\]\\\/api\\\/ai-assistant/;

describe("the assistant marker's direct-API alternative is the route-path family (S89-B / B89-L1)", () => {
  it("SOURCE — the marker matches ANY string literal naming the route path (not only the fetch form)", () => {
    // THE DEFECT PIN: pre-fix the marker's direct-API branch is
    // `fetch\(["']\/api\/ai-assistant` — a request.post( or
    // page.request.post( call to the same path touches no marker. The
    // widened form keys on the PATH LITERAL itself, complete by
    // construction over every transport — the alternative joined
    // directly after the askAssistant branch with no fetch( prefix.
    expect(docLowsS87Source).toMatch(WIDENED_ALTERNATIVE);
    // And the pattern-shaped fetch-prefixed form is GONE (the narrow
    // literal must not survive beside the family form — a stale
    // alternative would keep the narrowed semantics readable as the
    // real branch).
    expect(docLowsS87Source).not.toMatch(NARROW_FORM);
  });

  it("LIVE — the route-path family matches every transport shape (the widening's behavioral proof)", () => {
    // The family form matches the three transports the suite's
    // vocabulary already uses — fetch( (session67's limiter test),
    // request.post( and page.request.post( (session71's auth calls) —
    // plus any future shape carrying the path literal.
    const family = /["']\/api\/ai-assistant/;
    expect(family.test('await request.post("/api/ai-assistant", {')).toBe(true);
    expect(family.test("await page.request.post('/api/ai-assistant')")).toBe(
      true,
    );
    expect(family.test('await fetch("/api/ai-assistant", payload)')).toBe(true);
    // And a file that never names the path (the locator-only consumers)
    // still does not match the direct-API branch.
    expect(family.test('await request.post("/api/auth/login", {')).toBe(false);
  });

  it("LIVE — the suite's request.post vocabulary exists (the motivating form, witnessed)", () => {
    // THE VOCABULARY WITNESS: session71-fixes.spec.ts already sends
    // auth calls through request.post / page.request.post — the exact
    // form the pre-fix marker was blind to. The pin keeps the
    // widening's rationale documented in the suite: the next
    // assistant-consuming spec will reach for this vocabulary, and the
    // route-path family is what meets it there.
    expect(session71Source).toMatch(/request\.post\(/);
    expect(session71Source).toMatch(/page\.request\.post\(/);
  });
});

describe("the widened marker's equivalence at the current tree (the S89-B proof)", () => {
  it("LIVE — the widened sweep introduces NO unaccounted file (the coverage companion stays green)", () => {
    // THE EQUIVALENCE PIN: the widened marker's first run must equal
    // the old form's coverage — no file at the current tree carries
    // the path literal in a non-fetch transport (grep-proven zero
    // request.post forms on the assistant today; only session67
    // references the path, via fetch(, and it is EXEMPTED as the
    // limiter-trip verifier). The sweep reconstructed with the widened
    // marker: every matching file either carries an assistant-textbox
    // locator (counted by the enumerator) or is the exempted pair.
    const TEXTBOX_LOCATOR_FAMILY =
      /(?:getByRole|getByLabel|locator|getByPlaceholder)\([^)]*?(?:(?:textbox|input|textarea|Message|Ask|placeholder|aria-label)[^)]*?[Aa]ssistant|[Aa]ssistant[^)]*?(?:textbox|input|textarea|Message|Ask|placeholder|aria-label))/;
    const WIDENED_MARKER = new RegExp(
      TEXTBOX_LOCATOR_FAMILY.source + "|askAssistant\\(|[\"']\\/api\\/ai-assistant",
    );
    const EXEMPTED = new Set(["parity.spec.ts", "session67-fixes.spec.ts"]);
    const unaccounted: string[] = [];
    for (const file of readdirSync(specDir).filter((f) => f.endsWith(".spec.ts"))) {
      const src = readFileSync(path.join(specDir, file), "utf8");
      if (!WIDENED_MARKER.test(src)) continue;
      if (TEXTBOX_LOCATOR_FAMILY.test(src)) continue; // counted by the enumerator
      if (/askAssistant\(page, /.test(src)) continue; // counted by the enumerator
      if (EXEMPTED.has(file)) continue;
      unaccounted.push(file);
    }
    expect(unaccounted).toEqual([]);
  });

  it("LIVE — the only path-literal file is the exempted limiter verifier (session67)", () => {
    // The exemption stays load-bearing under the widened form: the
    // route-path family still matches session67-fixes.spec.ts (its 21
    // fetches carry the literal), and no OTHER file does — the
    // equivalence's sharpest statement.
    const pathFiles = readdirSync(specDir)
      .filter((f) => f.endsWith(".spec.ts"))
      .filter((f) =>
        /["']\/api\/ai-assistant/.test(
          readFileSync(path.join(specDir, f), "utf8"),
        ),
      );
    expect(pathFiles).toEqual(["session67-fixes.spec.ts"]);
  });
});
