// Pure greeting seam (unit-tested): the dashboard hero switches at 12:00 and
// 18:00 local time, matching the reference app's behavior.

export function greetingFor(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
