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
    .join(" ")
    // Session 84 (S84-D / B84-I2): the derived display name caps at the
    // stored-name bound. The member-creation fallbacks (teams POST +
    // members POST) store this string, and an email with a ~190-char
    // local part (the 200-char email cap) previously derived a
    // ~190-char stored name — the one path around the 80-char cap the
    // explicit name path enforces (S62-G's "every stored string is
    // capped" rationale, the derivation paths it missed).
    .slice(0, 80);
}

const MEMBER_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4"];

export function memberColorFor(seed: string): string {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return MEMBER_COLORS[hash % MEMBER_COLORS.length];
}
