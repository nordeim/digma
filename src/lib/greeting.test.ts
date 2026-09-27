import { describe, expect, it } from "vitest";
import { greetingFor } from "@/lib/greeting";

// The dashboard greeting switches at 12:00 and 18:00 local time.

describe("greetingFor", () => {
  it("greets morning before noon", () => {
    expect(greetingFor(new Date("2026-09-27T08:00:00"))).toBe("Good morning");
  });

  it("greets afternoon from 12:00", () => {
    expect(greetingFor(new Date("2026-09-27T12:00:00"))).toBe("Good afternoon");
    expect(greetingFor(new Date("2026-09-27T17:59:00"))).toBe("Good afternoon");
  });

  it("greets evening from 18:00", () => {
    expect(greetingFor(new Date("2026-09-27T18:00:00"))).toBe("Good evening");
    expect(greetingFor(new Date("2026-09-27T23:59:00"))).toBe("Good evening");
  });

  it("treats the small hours as morning (hour < 12)", () => {
    expect(greetingFor(new Date("2026-09-27T00:01:00"))).toBe("Good morning");
    expect(greetingFor(new Date("2026-09-27T05:59:00"))).toBe("Good morning");
  });
});
