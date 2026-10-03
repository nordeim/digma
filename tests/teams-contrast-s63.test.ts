import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Session 63 (S63-B / A-M1 — the eleventh audit's MEDIUM): two missed
// AA-contrast micro-labels on the Teams page — the member role line and
// the "+N more" line rendered `text-xs text-gray-400` (#9ca3af on white
// = 2.54:1 at 12px), the exact S61-B/M-2 defect family. Session 61 fixed
// the three sibling sites (the project-card opened-date row, the
// MobileNav drawer footer, the Dashboard list dates); these two
// clone-superset surfaces (the reference renders no member list, RA-43)
// were missed. The fix: text-gray-500 (#6b7280 = 4.83:1 — AA at 12px).
// The parity-pinned gray-400 sites (the editor avatar counter) are NOT
// touched — the contrast-tokens preservation pin guards them.

const teamsSource = readFileSync(
  path.resolve(import.meta.dirname, "../src/components/teams-view.tsx"),
  "utf8",
);

describe("the Teams micro-label contrast (session 63, S63-B / A-M1)", () => {
  it("the member role line renders the AA gray-500, not the 2.54:1 gray-400", () => {
    // THE DEFECT PIN: pre-fix the member role line carried
    // `truncate text-xs text-gray-400`.
    expect(teamsSource).toContain(
      'truncate text-xs text-gray-500">{member.role ?? member.email ?? "Member"}',
    );
  });

  it("the '+N more' line renders the AA gray-500 too", () => {
    // THE DEFECT PIN: pre-fix the overflow line carried
    // `text-xs text-gray-400`.
    expect(teamsSource).toContain(
      'text-xs text-gray-500">+{team.members.length - shown.length} more',
    );
  });

  it("no other gray-400 micro-label ships on the Teams page (the family sweep)", () => {
    // The sweep: every remaining text-xs gray-400 pairing in the file
    // would be the same defect family — the fix leaves zero.
    const lines = teamsSource.split("\n");
    const offenders = lines.filter(
      (line) => line.includes("text-xs") && line.includes("text-gray-400"),
    );
    expect(offenders).toEqual([]);
  });
});
