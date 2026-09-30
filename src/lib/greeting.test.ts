import { describe, expect, it } from "vitest";
import { greetingFor, greetingName } from "@/lib/greeting";

// The dashboard greeting switches at 12:00 and 17:00 local time — the
// reference app's DECODED contract (session 35, RA-38: its shipped bundle
// computes D<12 ? "Good morning" : D<17 ? "Good afternoon" : "Good evening").
// The historical 18:00 boundary was a measurement taken on hours that never
// discriminated it (16:00 vs 20:00) — corrected with the boundary's own
// edge hours, per the F18 discipline.

describe("greetingFor", () => {
  it("greets morning before noon", () => {
    expect(greetingFor(new Date("2026-09-27T08:00:00"))).toBe("Good morning");
  });

  it("greets afternoon from 12:00", () => {
    expect(greetingFor(new Date("2026-09-27T12:00:00"))).toBe("Good afternoon");
    expect(greetingFor(new Date("2026-09-27T16:59:00"))).toBe("Good afternoon");
  });

  it("greets evening from 17:00 (the reference's decoded boundary, RA-38)", () => {
    expect(greetingFor(new Date("2026-09-27T17:00:00"))).toBe("Good evening");
    expect(greetingFor(new Date("2026-09-27T17:59:00"))).toBe("Good evening");
    expect(greetingFor(new Date("2026-09-27T18:00:00"))).toBe("Good evening");
    expect(greetingFor(new Date("2026-09-27T23:59:00"))).toBe("Good evening");
  });

  it("treats the small hours as morning (hour < 12)", () => {
    expect(greetingFor(new Date("2026-09-27T00:01:00"))).toBe("Good morning");
    expect(greetingFor(new Date("2026-09-27T05:59:00"))).toBe("Good morning");
  });
});

// The greeting's NAME contract (session 35, RA-39 — decoded from the
// reference's bundle): the FIRST WORD of the user's full name, falling back
// to "Designer" when the name is absent or empty. The reference greets an
// account "Jane Doe" as "Jane".
describe("greetingName", () => {
  it("renders the first word of a full name", () => {
    expect(greetingName("Jane Doe")).toBe("Jane");
    expect(greetingName("John Jacob Jingleheimer Schmidt")).toBe("John");
  });

  it("renders a single-word name verbatim", () => {
    expect(greetingName("Designer")).toBe("Designer");
    expect(greetingName("sepnetflix2023")).toBe("sepnetflix2023");
  });

  it("falls back to Designer for empty or absent names", () => {
    expect(greetingName("")).toBe("Designer");
    expect(greetingName(undefined)).toBe("Designer");
    expect(greetingName(null)).toBe("Designer");
  });

  it("trims whitespace before splitting (hardened)", () => {
    expect(greetingName("  Jane Doe  ")).toBe("Jane");
    expect(greetingName("   ")).toBe("Designer");
  });
});
