"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Grid3x3, List, Search, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AppHeader, type HeaderUser } from "@/components/app-header";
import { ProjectCard } from "@/components/project-card";
import { toast } from "@/hooks/use-toast";
import type { ProjectDTO } from "@/lib/editor";

type SortKey = "last_accessed" | "updated_date" | "created_date" | "name";

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "last_accessed", label: "Last Opened" },
  { value: "updated_date", label: "Last Modified" },
  { value: "created_date", label: "Date Created" },
  { value: "name", label: "Name" },
];

async function call<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
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
      return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function RecentView({ user }: { user: HeaderUser }) {
  const params = useSearchParams();
  const [projects, setProjects] = React.useState<ProjectDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState(params.get("search") ?? "");
  const [sort, setSort] = React.useState<SortKey>("last_accessed");
  const [view, setView] = React.useState<"grid" | "list">("grid");

  React.useEffect(() => {
    call<{ projects: ProjectDTO[] }>("/api/projects").then((data) => {
      if (data) setProjects(data.projects);
      setLoading(false);
    });
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

          <div className="mx-auto max-w-7xl px-0 py-8 sm:px-0">
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
                      onRenamed={() => setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)))}
                      onDeleted={(id) => setProjects((prev) => prev.filter((p) => p.id !== id))}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                  {visible.map((project, index) => (
                    <a
                      key={project.id}
                      href={`/Editor?projectId=${project.id}`}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50",
                        index > 0 && "border-t border-gray-100",
                      )}
                    >
                      <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                      <span className="flex-1 truncate text-sm font-medium text-gray-800">
                        {project.name}
                      </span>
                      <span className="hidden text-xs text-gray-400 sm:block">
                        {new Date(project.lastOpenedAt).toLocaleString()}
                      </span>
                    </a>
                  ))}
                </div>
              )
            ) : (
              <div className="py-20 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                  <Users className="h-8 w-8 text-white" aria-hidden />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">No recent files</h3>
                <p className="text-sm text-gray-600">Files you&apos;ve recently worked on will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
