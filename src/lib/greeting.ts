// Pure greeting seam (unit-tested). The dashboard hero's contract, decoded
// from the reference app's shipped client bundle (session 35):
//   D < 12 ? "Good morning" : D < 17 ? "Good afternoon" : "Good evening"
// and the greeted name is the FIRST WORD of the user's full name, falling
// back to "Designer" when absent (an account "Jane Doe" is greeted "Jane").
// The historical 18:00 boundary was a measurement taken on hours that never
// discriminated it; the historical full-name render was never measured
// against a multi-word account.

export function greetingFor(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// The reference's decoded expression: `full_name?.split(" ")[0] || "Designer"`
// (RA-39) — hardened against whitespace-only names so the fallback fires.
export function greetingName(fullName?: string | null): string {
  return fullName?.trim().split(/\s+/)[0] || "Designer";
}
