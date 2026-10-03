"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Grid3x3,
  List,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { AppHeader, type HeaderUser } from "@/components/app-header";
import { CanvasThumbnail, InlineProjectRename, ProjectCard } from "@/components/project-card";
import { toast } from "@/hooks/use-toast";
import type { ProjectDTO } from "@/lib/editor";
// Session 65 (S65-E — the thirteenth audit's A-5): the envelope-unwrap
// client lives in its own seam now — the files view's GET-only local
// copy (which had already lost the init parameter) is gone; its call
// sites are behavior-identical through the shared init-aware form
// (a body-less init passes through unchanged).
import { call } from "@/lib/call";

type SortKey = "last_accessed" | "updated_date" | "created_date" | "name";

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "last_accessed", label: "Last Opened" },
  { value: "updated_date", label: "Last Modified" },
  { value: "created_date", label: "Date Created" },
  { value: "name", label: "Name" },
];

function sortProjects(projects: ProjectDTO[], sort: SortKey): ProjectDTO[] {
  const copy = [...projects];
  switch (sort) {
    case "last_accessed":
      return copy.sort((a, b) => +new Date(b.lastOpenedAt) - +new Date(a.lastOpenedAt));
    case "updated_date":
      return copy.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
    case "created_date":
      return copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "name":
      // RA-45 (session 39): the reference's name sort is DESCENDING — its
      // select refetches entities/Project?sort=-name and the rendered order
      // followed Z > T > A on the discriminating probe set. All four sorts
      // carry the - (descending) prefix; the three date branches above
      // already sorted descending.
      return copy.sort((a, b) => b.name.localeCompare(a.name));
  }
}

// ---------------------------------------------------------------------------
// List-row card — measured from the reference's /Recent list view (session 39,
// RA-48/RA-49): a SEPARATE p-3 card (space-y-2 container, NOT a bordered
// table) carrying a 40x40 mini-canvas thumbnail on the blue-100/purple-100
// gradient, a name-ONLY link (the row itself never navigates — cursor stays
// auto on the reference), and a right slot with the clock icon + a
// "Sep 30, 2026" short date + the ellipsis dropdown (w-7 h-7). The
// reference's own list Rename is DEAD and its Delete is a native
// window.confirm — the clone's working Rename dialog + card-local
// "Delete project?" confirm are the documented supersets (the RA-16/S31
// family), ported here from the grid ProjectCard.

function RecentListCard({
  project,
  onRenamed,
  onDeleted,
}: {
  project: ProjectDTO;
  onRenamed: (project: ProjectDTO) => void;
  onDeleted: (id: string) => void;
}) {
  const router = useRouter();
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  async function openProject() {
    // Touch lastOpenedAt so Recent reorders — the grid card's PATCH.
    // Session 61 (S61-H / B-L-5): fire-and-forget — the navigation is
    // immediate (the grid-card variant's rationale).
    fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastOpened: true }),
    }).catch(() => null);
    router.push(`/Editor?projectId=${project.id}`);
  }

  async function deleteProject() {
    setDeleting(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        toast.error("Delete failed", body?.error?.message ?? "Please try again.");
        return;
      }
      onDeleted(project.id);
      setDeleteConfirmOpen(false);
      toast.success("Project deleted", project.name);
    } catch {
      toast.error("Network error", "Could not delete the project.");
    } finally {
      setDeleting(false);
    }
  }

  // RA-48: the reference's list date is "Sep 30, 2026" — month short,
  // day, YEAR (the grid's "Opened Sep 30" carries no year).
  const openedLabel = new Date(project.lastOpenedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 transition-all duration-200 hover:shadow-sm">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-blue-100 to-purple-100">
          <CanvasThumbnail project={project} elements={project.elements ?? []} />
        </div>
        <div className="min-w-0">
          {/* Session 41 (RA-52): the reference's LIST rename is DEAD (RA-49) —
              the clone's working rename is the documented superset, now
              rendered as the reference's own INLINE editor design (the
              grid card's mechanism, unified for cross-view coherence). */}
          {renameOpen ? (
            <InlineProjectRename
              project={project}
              onRenamed={(updated) => {
                setRenameOpen(false);
                onRenamed(updated);
              }}
              onCancel={() => setRenameOpen(false)}
            />
          ) : (
          <a
            href={`/Editor?projectId=${project.id}`}
            onClick={(event) => {
              event.preventDefault();
              void openProject();
            }}
            className="block truncate text-sm font-semibold text-gray-800 transition-colors group-hover:text-purple-600"
          >
            {project.name}
          </a>
          )}
        </div>
      </div>
      <div className="ml-4 flex flex-shrink-0 items-center gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden />
          <span>{openedLabel}</span>
        </div>
        <div onClick={(event) => event.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="iconSm"
                className="data-[state=open]:bg-gray-100"
                aria-label={`More options for ${project.name}`}
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => {
                  setRenameOpen(true);
                }}
              >
                <Pencil />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  setDeleteConfirmOpen(true);
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Card-local dialogs render through React PORTALS — the S31-3
          stopPropagation seam (defense-in-depth; the row itself never
          navigates, so the bubble has no target — the guard stays for the
          keydown path and future wrappers). Session 41 (RA-52): the rename
          DIALOG retired — the working rename renders as the INLINE editor
          in the name slot above (the grid card's mechanism, unified); only
          the delete confirm remains here. */}
      <div
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-[420px] [&>button]:h-11 [&>button]:w-11">
            <DialogHeader>
              <DialogTitle>Delete project?</DialogTitle>
              <DialogDescription>
                This permanently removes &ldquo;{project.name}&rdquo; and its canvas. This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" disabled={deleting} onClick={deleteProject}>
                {deleting ? "Deleting…" : "Yes, Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export function RecentView({ user }: { user: HeaderUser }) {
  const params = useSearchParams();
  const [projects, setProjects] = React.useState<ProjectDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  // Session 58 (S58-D — the sixth audit's A-M-4): the search seeds from the
  // ?search param and RE-DERIVES on same-route param changes through the
  // render-time compare-and-adjust pattern (the S53-A GuardedNumberInput
  // family — no effect). Pre-fix the initializer-only state made the
  // app-header's search a visible no-op when the user was already on
  // /Recent: the URL updated but the filter (and the page's own search
  // box) never changed. The SORT deliberately stays fresh-load-only — the
  // RA-45 "resets on every fresh load" contract; a param change is not a
  // fresh load.
  const [paramsKey, setParamsKey] = React.useState(params.toString());
  const [search, setSearch] = React.useState(params.get("search") ?? "");
  if (params.toString() !== paramsKey) {
    setParamsKey(params.toString());
    setSearch(params.get("search") ?? "");
  }
  const [sort, setSort] = React.useState<SortKey>("last_accessed");
  const [view, setView] = React.useState<"grid" | "list">("grid");

  React.useEffect(() => {
    // Session 63 (S63-F / A-L3): the documented unmount guard (the sibling
    // views' pattern) — an unmount mid-fetch must not commit state after
    // teardown. Async function inside the effect; setState only in the
    // awaited continuation behind the ignore flag.
    let ignore = false;
    async function run() {
      const data = await call<{ projects: ProjectDTO[] }>("/api/projects");
      if (ignore) return;
      if (data) setProjects(data.projects);
      setLoading(false);
    }
    run();
    return () => {
      ignore = true;
    };
  }, []);

  const visible = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q ? projects.filter((p) => p.name.toLowerCase().includes(q)) : projects;
    return sortProjects(filtered, sort);
  }, [projects, search, sort]);

  return (
    <>
      <AppHeader user={user} />
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {/* Header — measured: h1 + subtitle, search, calendar sort, view toggles. */}
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recent Files</h1>
              <p className="mt-1 text-gray-500">Your recently accessed design files</p>
            </div>
            <div className="flex w-full items-center gap-4 lg:w-auto">
              {/* Live DOM: relative flex-1 md:w-80 with an h-9 shadcn-style
                  input (rounded-md, icon at left-3, pl-9). */}
              <div className="relative flex-1 md:w-80">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden
                />
                <label htmlFor="recent-search" className="sr-only">
                  Search files
                </label>
                <input
                  id="recent-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files..."
                  className="h-9 w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              {/* Reference parity (measured live on /Recent): a BARE
                  flex gap-2 row — no gray container (that is the Dashboard's
                  pattern) — w-10 h-10 buttons, active = the reference's
                  --primary (#171717) with shadow, inactive = outline. */}
              <div className="flex items-center gap-2" role="group" aria-label="View mode">
                <Button
                  type="button"
                  variant={view === "grid" ? "default" : "outline"}
                  className={cn(
                    "h-10 w-10 rounded-md p-0 text-xs",
                    view === "grid" &&
                      "bg-neutral-900 text-white shadow-sm hover:bg-neutral-900/90",
                  )}
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={view === "list" ? "default" : "outline"}
                  className={cn(
                    "h-10 w-10 rounded-md p-0 text-xs",
                    view === "list" &&
                      "bg-neutral-900 text-white shadow-sm hover:bg-neutral-900/90",
                  )}
                  onClick={() => setView("list")}
                  aria-label="List view"
                  aria-pressed={view === "list"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sort — the reference uses a native select with a calendar glyph. */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" aria-hidden />
              <label htmlFor="recent-sort" className="sr-only">
                Sort files
              </label>
              <select
                id="recent-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Session 63 (S63-G / A-L5): the pre-fix wrapper duplicated the
              parent container's max-width/margins plus zero-padding
              overrides inside the identical parent — every class except
              the py-8 spacing was a no-op. Only the load-bearing vertical
              spacing stays (layout pixel-identical). */}
          <div className="py-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {loading ? "Loading…" : `${visible.length} ${visible.length === 1 ? "file" : "files"} found`}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-52 animate-pulse rounded-lg bg-gray-100" />
                ))}
              </div>
            ) : visible.length > 0 ? (
              view === "grid" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {visible.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      // Session 63 (S63-C / A-L2): the first avatar chip
                      // carries the real-user initial (RA-53) — the
                      // greetingName "D" (Designer) fallback convention.
                      userInitial={user.name.trim().charAt(0).toUpperCase() || "D"}
                      onRenamed={(updated) =>
                        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
                      }
                      onDeleted={(id) => setProjects((prev) => prev.filter((p) => p.id !== id))}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {visible.map((project) => (
                    <RecentListCard
                      key={project.id}
                      project={project}
                      onRenamed={(updated) =>
                        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
                      }
                      onDeleted={(id) => setProjects((prev) => prev.filter((p) => p.id !== id))}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="py-16 text-center">
                <Search className="mx-auto mb-4 h-16 w-16 text-gray-300" aria-hidden />
                <h3 className="mb-2 text-xl font-semibold text-gray-900">No files found</h3>
                <p className="text-gray-500">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
