import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The elements route hardening (session 56, S56-H — the Mode C audit's
// L-1 + L-2).
//
// L-1: a bare `throw new Error("invalid type at …")` inside the row map
// escaped the { ok, error } envelope as an unstructured 500. The fix: a
// pre-validation loop returning fail("VALIDATION", …, 400) — the app's
// envelope contract, like every sibling check.
//
// L-2: the response findMany ran OUTSIDE the $transaction — a concurrent
// PUT landing between the commit and the read returned a list this
// request did not write. The fix: the read moves INSIDE the interactive
// transaction.

const routeSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/app/api/projects/[id]/elements/route.ts"),
  "utf8",
);

describe("the elements route hardening (session 56, S56-H / L-1 + L-2)", () => {
  it("no bare throw escapes the envelope (L-1)", () => {
    expect(routeSource).not.toMatch(/throw new Error\(`invalid type/);
    // The pre-validation loop returns the envelope failure instead.
    expect(routeSource).toMatch(/return fail\("VALIDATION", `Invalid element type at index \$\{index\}`,\s*400\)/);
  });

  it("the response read is INSIDE the transaction (L-2)", () => {
    // The PUT's response read flows through `tx.` (the interactive
    // transaction's client) — the read and the write share one
    // transaction, so a concurrent PUT can never interleave between
    // them…
    expect(routeSource).toMatch(/return tx\.designElement\.findMany\(\{/);
    // …and the old outside-read (a bare db.designElement.findMany
    // directly after the transaction's closing) is gone.
    expect(routeSource).not.toMatch(
      /\}\);\s*const elements = await db\.designElement\.findMany/,
    );
  });
});
