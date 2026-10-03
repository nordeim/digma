import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session 63 (S63-C / A-L2 — the eleventh audit's Low): the avatar
// stack's FIRST chip hardcoded "Y" instead of the documented real-user
// initial. The RA-53 documented contract: "the first chip keeps the
// clone's real-user identity (title 'You', the RA-40 working-superset
// family) … carrying the real-user initial + title='You'". The code
// shipped the constant "Y", the e2e pin (parity.spec.ts) blessed the
// constant, and the docs claimed real-user — a three-way drift. The fix:
// ProjectCard gains a `userInitial` prop; both call sites (DashboardView
// and RecentView — both already receive `user: HeaderUser`) pass
// `user.name.trim().charAt(0).toUpperCase() || "D"` (the "Designer"
// fallback convention from greetingName); the chip renders the prop.

const cardSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/project-card.tsx"),
  "utf8",
);
const dashSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/dashboard-view.tsx"),
  "utf8",
);
const recentSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/recent-view.tsx"),
  "utf8",
);

describe("the real-user avatar initial (session 63, S63-C / A-L2)", () => {
  it("ProjectCard accepts a userInitial prop", () => {
    // THE DEFECT PIN: pre-fix the signature carried only
    // project/onRenamed/onDeleted and the chip rendered a constant "Y".
    expect(cardSource).toContain("userInitial");
  });

  it("the first chip renders the prop, not the hardcoded 'Y' constant", () => {
    // The pre-fix form: <span className="text-[9px] font-medium
    // text-white">Y</span> — the constant. The post-fix form renders
    // {userInitial} with the same chrome. (The text-[9px] class carries
    // a literal bracket sequence — plain-string anchors per F49(5).)
    expect(cardSource).not.toContain(">Y</span>");
    expect(cardSource).toContain("{userInitial}</span>");
  });

  it("both call sites derive the initial from the signed-in user's name", () => {
    // DashboardView and RecentView both receive user: HeaderUser — the
    // initial is the first character of the name, uppercased, with the
    // "D" (Designer) fallback.
    for (const source of [dashSource, recentSource]) {
      expect(source).toContain("userInitial=");
      expect(source).toContain('user.name.trim().charAt(0).toUpperCase() || "D"');
    }
  });

  it("the 'You' title is preserved (the RA-40 identity contract)", () => {
    // Preservation: the fix swaps the constant for the real initial
    // only — the title stays.
    expect(cardSource).toContain('title="You"');
  });
});
