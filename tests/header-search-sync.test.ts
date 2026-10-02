import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The header-search same-route sync (session 58, S58-D — the sixth Mode C
// audit's A-M-4).
//
// RecentView seeded its search state from the URL param via a useState
// INITIALIZER with no sync — on a same-route soft navigation (searching
// from the app-header while already on /Recent) the URL updated but the
// filter and the page's own search box never changed: the header search
// visibly no-oped. It worked only when arriving from another page (a
// fresh mount).
//
// The fix: the render-time compare-and-adjust pattern (the S53-A
// GuardedNumberInput family — the repo's sanctioned adjust-state-during-
// render idiom, no effect): a params-key snapshot state; when the params
// string changes, the key and the search re-derive together.

const recentSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/recent-view.tsx"),
  "utf8",
);

describe("the header-search same-route sync (session 58, S58-D / A-M-4)", () => {
  it("the search state derives from the param through the compare-and-adjust seam", () => {
    // The tracked key initializes from the params string…
    expect(recentSource).toMatch(
      /const \[paramsKey, setParamsKey\] = React\.useState\(params\.toString\(\)\);/,
    );
    // …the search still seeds from the param (the fresh-mount path)…
    expect(recentSource).toMatch(
      /const \[search, setSearch\] = React\.useState\(params\.get\("search"\) \?\? ""\);/,
    );
    // …and a CHANGING params string re-derives both during render.
    expect(recentSource).toMatch(
      /if \(params\.toString\(\) !== paramsKey\) \{\s*setParamsKey\(params\.toString\(\)\);\s*setSearch\(params\.get\("search"\) \?\? ""\);\s*\}/,
    );
  });

  it("the sort state stays a fresh-load contract (no param sync — RA-45)", () => {
    // The sort resets on every fresh LOAD (the reference's measured
    // contract); a same-route param change is not a fresh load, so the
    // sort keeps its local state — no params-based re-derivation of sort.
    const sortSync = recentSource.match(/setSort\(params\.get\(/);
    expect(sortSync).toBeNull();
    expect(recentSource).toMatch(
      /const \[sort, setSort\] = React\.useState<SortKey>\("last_accessed"\);/,
    );
  });
});
