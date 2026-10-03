"use client";

import * as React from "react";
import { Plus, UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppHeader, type HeaderUser } from "@/components/app-header";
import { toast } from "@/hooks/use-toast";
import { memberColorFor } from "@/lib/team";

type TeamMemberDTO = {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  avatarColor: string;
};

type TeamDTO = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  members: TeamMemberDTO[];
};

async function call<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...init,
      ...(init?.body ? { headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } } : {}),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok || !body?.ok) {
      toast.error("Something went wrong", body?.error?.message ?? `Request failed (${response.status}).`);
      return null;
    }
    return (body.data ?? null) as T | null;
  } catch {
    toast.error("Network error", "Could not reach the server.");
    return null;
  }
}

const TEAM_COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#06B6D4"];

export function TeamsView({ user }: { user: HeaderUser }) {
  const [teams, setTeams] = React.useState<TeamDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [inviteFor, setInviteFor] = React.useState<TeamDTO | null>(null);

  const refresh = React.useCallback(async () => {
    const data = await call<{ teams: TeamDTO[] }>("/api/teams");
    if (data) setTeams(data.teams);
    setLoading(false);
  }, []);

  // Initial fetch — the docs-approved effect pattern (async function inside
  // the effect; setState only in the awaited continuation).
  React.useEffect(() => {
    let ignore = false;
    async function run() {
      const data = await call<{ teams: TeamDTO[] }>("/api/teams");
      if (ignore) return;
      if (data) setTeams(data.teams);
      setLoading(false);
    }
    run();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <AppHeader user={user} />
      <main className="min-h-[calc(100vh-4rem)]">
        {/* The page header renders in its own FULL-WIDTH BORDERED BAND
            (session 37, RA-44 — bundle-decoded + live-measured at 113px):
            `border-b border-gray-200 bg-white` wrapping a flat
            `max-w-7xl mx-auto px-6 py-6` (no sm: gating — the reference
            computes 24px at every viewport), with the row ported to the
            reference's exact `flex flex-col md:flex-row justify-between
            items-start md:items-center gap-4`. The grid container below is
            SEPARATE (`px-6 py-8`) — the band's border carries the
            separation. The Create Team button carries the reference's
            standard `shadow` token (live-measured — the bundle's custom
            className MERGES onto the Fe button base, whose default variant
            renders `shadow`; reading only the decoded custom string missed
            the base-variant token — the F26 className-reading lesson). */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
                <p className="mt-1 text-gray-500">Collaborate with your team members</p>
              </div>
              <Button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="h-9 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow hover:bg-blue-700"
              >
                <Plus />
                Create Team
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* The reference's loading state (RA-44, bundle-decoded):
                  Array(6) skeleton cards, `bg-gray-100 rounded-xl h-48
                  animate-pulse` (192px). */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : teams.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onInvite={() => setInviteFor(team)}
                  onDeleted={(id) => setTeams((prev) => prev.filter((t) => t.id !== id))}
                  onMemberAdded={refresh}
                />
              ))}
            </div>
          ) : (
            /* Reference empty state (measured live): a plain gray-300 Users
               glyph — no gradient circle — with semibold copy at the default
               size, on a py-16 centered block. The button renders at the Fe
               default padding + the standard shadow token (RA-44). */
            <div className="py-16 text-center">
              <Users className="mx-auto mb-4 h-16 w-16 text-gray-300" aria-hidden />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No teams yet</h3>
              <p className="mb-6 text-gray-500">Create a team to collaborate with others</p>
              <Button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="h-9 bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
              >
                <Plus />
                Create Your First Team
              </Button>
            </div>
          )}
        </div>
      </main>

      <CreateTeamDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => refresh()}
      />
      <InviteMemberDialog
        key={inviteFor?.id ?? "none"}
        team={inviteFor}
        onOpenChange={(open) => !open && setInviteFor(null)}
        onInvited={refresh}
      />
    </>
  );
}

function TeamCard({
  team,
  onInvite,
  onDeleted,
  onMemberAdded,
}: {
  team: TeamDTO;
  onInvite: () => void;
  onDeleted: (id: string) => void;
  onMemberAdded: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  // Session 58 (S58-F — the sixth audit's A-L-1): the in-flight guard the
  // project-card delete dialogs already carry (disabled={deleting}) — a
  // double-click previously fired two DELETEs, the loser 404ing into a
  // spurious destructive toast after a successful delete.
  const [deleting, setDeleting] = React.useState(false);

  async function deleteTeam() {
    if (deleting) return;
    setDeleting(true);
    const data = await call<{ deleted: boolean }>(`/api/teams/${team.id}`, { method: "DELETE" });
    if (data) {
      onDeleted(team.id);
      toast.success("Team deleted", team.name);
    }
    setDeleting(false);
  }

  const shown = team.members.slice(0, 5);

  return (
    /* The reference's card chrome (session 37, RA-43 — bundle-decoded):
       `bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg
       transition-all duration-300` — 24px padding, NO base shadow, NO
       border-color change on hover. The reference's own ellipsis and
       "Manage" buttons render with NO onClick (dead chrome — RA-42/RA-43);
       this clone's Delete confirm and Invite Member are the working
       supersets in those slots. */
    <div className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg">
      {/* Header row — the reference's: `flex items-start justify-between
          mb-4` carrying the 48px FIXED blue-to-purple GRADIENT chip (Users
          w-6 h-6 white — the card NEVER paints the team's color) left and
          its dead ellipsis right; the clone's Delete-confirm cluster is the
          working superset in the right slot. */}
      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600"
          aria-hidden
        >
          <Users className="h-6 w-6 text-white" />
        </div>
        {confirmDelete ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Delete team?</span>
            <Button variant="destructive" size="sm" disabled={deleting} onClick={deleteTeam}>
              Yes, Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)} aria-label={`Delete ${team.name}`}>
            Delete
          </Button>
        )}
      </div>

      {/* The name renders BELOW the header row at the reference's
          `text-xl font-semibold mb-2` (20px) — not beside the chip. */}
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{team.name}</h3>

      {team.description && <p className="mb-4 line-clamp-2 text-sm text-gray-500">{team.description}</p>}

      {/* The member LIST is the clone's WORKING SUPERSET (RA-43: the
          reference's card renders NO member list — members exist only as a
          count) — avatars + names + role sub-labels, unchanged. */}
      <ul className="mb-4 space-y-2">
        {shown.map((member) => (
          <li key={member.id} className="flex items-center gap-3">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: member.avatarColor || memberColorFor(member.name) }}
              aria-hidden
            >
              {member.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-800">{member.name}</p>
              {/* Session 63 (S63-B / A-M1 — the eleventh audit's M-1): the
                  gray-500 (#6b7280) reads at 4.83:1 on white — AA at 12px.
                  The pre-fix gray-400 (#9ca3af) computed to 2.54:1 — the
                  S61-B family's two missed sites. */}
              <p className="truncate text-xs text-gray-500">{member.role ?? member.email ?? "Member"}</p>
            </div>
          </li>
        ))}
        {team.members.length > shown.length && (
          <li className="text-xs text-gray-500">+{team.members.length - shown.length} more</li>
        )}
      </ul>

      {/* The reference's FOOTER row: `flex items-center justify-between
          text-sm` with the member COUNT left — `flex items-center gap-2
          text-gray-500` + Users w-4 h-4 + "N members" (the reference
          renders the plural unconditionally, "1 members" — its own grammar
          bug; the clone's proper singular stays the coherent superset, the
          RA-35 family). Its right slot (the dead "Manage") stays empty
          here — the Invite Member button below is the working superset. */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <Users className="h-4 w-4" aria-hidden />
          {team.members.length} {team.members.length === 1 ? "member" : "members"}
        </div>
      </div>

      <Button type="button" variant="outline" size="sm" onClick={onInvite} className="mt-4 w-full border-gray-200">
        <UserPlus />
        Invite Member
      </Button>
    </div>
  );
}

function CreateTeamDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [color, setColor] = React.useState(TEAM_COLORS[0]);
  const [memberEmail, setMemberEmail] = React.useState("");
  const [memberRole, setMemberRole] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting || !name.trim()) return;
    setSubmitting(true);
    try {
      const data = await call<{ team: TeamDTO }>("/api/teams", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          color,
          memberEmail: memberEmail.trim() || null,
          memberRole: memberRole.trim() || null,
        }),
      });
      if (data) {
        onCreated();
        onOpenChange(false);
        reset();
        toast.success("Team created", data.team.name);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setName("");
    setDescription("");
    setColor(TEAM_COLORS[0]);
    setMemberEmail("");
    setMemberRole("");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create a Team
          </DialogTitle>
          <DialogDescription>Group collaborators and invite your first member.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">Team name *</Label>
            <Input
              id="team-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Design Team"
              maxLength={80}
              required
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team-description">Description</Label>
            <Textarea
              id="team-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this team work on?"
              maxLength={300}
              className="h-16 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="block">Team color</Label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Team color">
              {TEAM_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Team color ${c}`}
                  aria-pressed={color === c}
                  onClick={() => setColor(c)}
                  className="h-8 w-8 rounded-full border-2"
                  style={{ backgroundColor: c, borderColor: color === c ? "#111827" : "#E5E7EB" }}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="team-member-email">Invite member (optional)</Label>
              <Input
                id="team-member-email"
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="teammate@example.com"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-member-role">Role</Label>
              <Input
                id="team-member-role"
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
                placeholder="Designer"
                maxLength={80}
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || submitting}>
              {submitting ? "Creating…" : "Create Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function InviteMemberDialog({
  team,
  onOpenChange,
  onInvited,
}: {
  team: TeamDTO | null;
  onOpenChange: (open: boolean) => void;
  onInvited: () => void;
}) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // Form reset happens by remounting: the parent keys this dialog on the
  // team id, so switching teams re-creates it with fresh state (no
  // set-state-in-effect).

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!team || submitting) return;
    setSubmitting(true);
    try {
      const data = await call<{ member: TeamMemberDTO }>(`/api/teams/${team.id}/members`, {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), role: role.trim() || null }),
      });
      if (data) {
        onInvited();
        onOpenChange(false);
        toast.success("Invite sent", `${email.trim()} joined ${team.name}.`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={team !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Invite to {team?.name}</DialogTitle>
          <DialogDescription>Send an invite by email and set their role.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email *</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@example.com"
              required
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Input
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Designer"
              maxLength={80}
              className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Inviting…" : "Send Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
