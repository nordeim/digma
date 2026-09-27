import { describe, expect, it } from "vitest";
import { memberColorFor, memberDisplayFor } from "@/lib/team";

// Invite-form normalization: the Create Team dialog and the API route must
// agree on the derived display name and avatar color.

describe("memberDisplayFor", () => {
  it("derives a display name from the email's local part", () => {
    expect(memberDisplayFor("jane.doe@example.com")).toBe("Jane Doe");
  });

  it("splits on dashes and underscores too", () => {
    expect(memberDisplayFor("alex-ui@example.com")).toBe("Alex Ui");
    expect(memberDisplayFor("sarah_ui@example.com")).toBe("Sarah Ui");
  });

  it("degrades gracefully for an empty local part", () => {
    expect(memberDisplayFor("@example.com")).toBe("Member");
  });
});

describe("memberColorFor", () => {
  it("is stable for the same seed", () => {
    expect(memberColorFor("a@b.com")).toBe(memberColorFor("a@b.com"));
  });

  it("returns a known palette color", () => {
    const palette = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4"];
    expect(palette).toContain(memberColorFor("anyone@example.com"));
  });
});
