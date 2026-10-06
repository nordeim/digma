import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The session-89 silent-truncation mirror pass (S89-A — the thirty-
// seventh audit's A89-L1 + A89-I2, the client-cap-vs-server-bound
// mirror table's last unmirrored fields).
//
// A89-L1 — THE DEFECT: the teams-view member-email inputs carried no
// client maxLength while the server SILENTLY TRUNCATES at 200 —
// clampText(body?.email, 200) at members/route.ts:30 and
// clampText(body?.memberEmail, 200) at teams/route.ts:57. A legal
// 254-char email typed into either surface (the create-team form's
// "team-member-email" or the invite dialog's "invite-email") silently
// truncated server-side: the stored email diverged from what the user
// typed, and every derived row (the memberDisplayFor name seed, the
// memberColorFor chip color) derived from the TRUNCATED form. The
// contract is asymmetric with register (auth/register/route.ts:41
// REJECTS >200 — an honest 400 the login form surfaces as an inline
// alert), so the cap belongs on the client input, matching the teams
// routes' clamp — the S63-D layers-rename doctrine (maxLength matching
// the server clamp exactly) on the mirror table's last unmirrored
// field.
//
// A89-I2 — THE SIBLING: the assistant's message input carried no
// maxLength while the route slices the prompt at 1000
// (ai-assistant/route.ts:44) — the transcript echoes the full message
// while the reply is computed on the truncated prompt (a trailing
// instruction past 1000 chars silently never reached the model). The
// same fix shape closing the same family on the third surface.
//
// THE FIX: maxLength={200} on both teams-view inputs + maxLength={1000}
// on the assistant input — three surfaces, one family, the client
// cap mirroring the server's silent-truncation seam exactly.

const ROOT = path.resolve(import.meta.dirname, "..");

const teamsViewSource = readFileSync(
  path.join(ROOT, "src/components/teams-view.tsx"),
  "utf8",
);

const assistantSource = readFileSync(
  path.join(ROOT, "src/components/editor/ai-assistant.tsx"),
  "utf8",
);

const membersRouteSource = readFileSync(
  path.join(ROOT, "src/app/api/teams/[id]/members/route.ts"),
  "utf8",
);

const teamsRouteSource = readFileSync(
  path.join(ROOT, "src/app/api/teams/route.ts"),
  "utf8",
);

const assistantRouteSource = readFileSync(
  path.join(ROOT, "src/app/api/ai-assistant/route.ts"),
  "utf8",
);

/** The layers-rename-cap locator form: slice the input tag out of the
 * component source by its anchor attribute (the id for the shadcn
 * Inputs, the aria-label for the bare input), bounded by the tag's
 * own self-closing bracket — the cap is asserted on the tag's own
 * attributes, never on a loose file-wide grep. */
function tagAround(source: string, anchor: string): string {
  const anchorIndex = source.indexOf(anchor);
  expect(anchorIndex).toBeGreaterThanOrEqual(0);
  const tagStart = source.lastIndexOf("<", anchorIndex);
  const tagEnd = source.indexOf("/>", anchorIndex);
  return source.slice(tagStart, tagEnd);
}

describe("the member-email inputs mirror the server's 200 truncation (S89-A / A89-L1)", () => {
  it("SOURCE — the create-team form's member-email Input caps at 200, matching the server clamp exactly", () => {
    // THE DEFECT PIN: pre-fix the "team-member-email" Input carried no
    // maxLength — a 254-char email rendered locally in full while the
    // server's clampText(memberEmail, 200) silently truncated it.
    const tag = tagAround(teamsViewSource, 'id="team-member-email"');
    expect(tag).toContain('type="email"');
    expect(tag).toContain("maxLength={200}");
  });

  it("SOURCE — the invite dialog's email Input caps at 200, matching the server clamp exactly", () => {
    // THE DEFECT PIN: pre-fix the "invite-email" Input carried no
    // maxLength — the same silent truncation on the second surface.
    const tag = tagAround(teamsViewSource, 'id="invite-email"');
    expect(tag).toContain('type="email"');
    expect(tag).toContain("maxLength={200}");
  });

  it("SOURCE — the server clamps stay canonical (the single source of the 200)", () => {
    // THE SURVIVAL PIN: the client cap mirrors the SERVER's seam — the
    // clampText(_, 200) lines are the canonical numbers, and they stay
    // exactly where they are (the client must never diverge from the
    // seam it mirrors; a future widening of one without the other is
    // this family's recurrence).
    expect(membersRouteSource).toMatch(/clampText\(body\?\.email, 200\)/);
    expect(teamsRouteSource).toMatch(/clampText\(body\?\.memberEmail, 200\)/);
  });
});

describe("the assistant input mirrors the server's 1000 prompt slice (S89-A / A89-I2)", () => {
  it("SOURCE — the message input caps at 1000, matching the route's prompt slice exactly", () => {
    // THE DEFECT PIN: pre-fix the input carried no maxLength — the
    // transcript echoed the full message while the reply was computed
    // on the route's slice(0, 1000) truncation (a trailing instruction
    // silently never reached the model).
    const tag = tagAround(
      assistantSource,
      'aria-label="Message the AI design assistant"',
    );
    expect(tag).toContain("maxLength={1000}");
  });

  it("SOURCE — the route's prompt slice stays canonical (the single source of the 1000)", () => {
    // THE SURVIVAL PIN: the slice(0, 1000) line is the canonical seam
    // the client cap mirrors.
    expect(assistantRouteSource).toMatch(
      /body\.message\.trim\(\)\.slice\(0, 1000\)/,
    );
  });
});

describe("the register asymmetry stays honest (the S89-A doctrine's boundary)", () => {
  it("SOURCE — register still REJECTS >200 (the honest 400), never truncating", () => {
    // THE DOCTRINE PIN: the mirror rule is for SILENT truncation seams
    // only — register's contract is a REJECTION (email.length > 200 →
    // 400), which the login form surfaces as an inline alert. The
    // asymmetric family stays asymmetric: the teams routes truncate
    // (so the client caps), register rejects (so the client surfaces).
    const registerRouteSource = readFileSync(
      path.join(ROOT, "src/app/api/auth/register/route.ts"),
      "utf8",
    );
    expect(registerRouteSource).toMatch(/email\.length > 200/);
  });
});
