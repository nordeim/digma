// Pure team-form helpers (unit-tested seam): deriving a member's display
// name from an invite email — the part the Create Team dialog and the API
// route must agree on.

export function memberDisplayFor(email: string): string {
  const local = email.trim().split("@")[0] ?? "";
  if (!local) return "Member";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const MEMBER_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4"];

export function memberColorFor(seed: string): string {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return MEMBER_COLORS[hash % MEMBER_COLORS.length];
}
