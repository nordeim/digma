"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Grid3x3, List, Plus, Search, Sparkles, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AppHeader, type HeaderUser } from "@/components/app-header";
import { CreateProjectDialog, ProjectCard } from "@/components/project-card";
import { toast } from "@/hooks/use-toast";
import { greetingFor, greetingName } from "@/lib/greeting";
import type { ProjectDTO } from "@/lib/editor";

type Stats = {
  projects: number;
  teams: number;
  activeThisWeek: number;
  plan: string;
};

// call() — the single sanctioned API client (envelope unwrapper): failures
// degrade to a destructive toast + null, never into React render.
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

export function DashboardView({ user }: { user: HeaderUser }) {
  const router = useRouter();
  const [projects, setProjects] = React.useState<ProjectDTO[]>([]);
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [view, setView] = React.useState<"grid" | "list">("grid");

  const refresh = React.useCallback(async () => {
    const [projectsData, statsData] = await Promise.all([
      call<{ projects: ProjectDTO[] }>("/api/projects"),
      call<Stats>("/api/stats"),
    ]);
    if (projectsData) setProjects(projectsData.projects);
    if (statsData) setStats(statsData);
    setLoading(false);
  }, []);

  // Initial fetch — the docs-approved effect pattern (async function inside
  // the effect; setState only in the awaited continuation).
  React.useEffect(() => {
    let ignore = false;
    async function run() {
      const [projectsData, statsData] = await Promise.all([
        call<{ projects: ProjectDTO[] }>("/api/projects"),
        call<Stats>("/api/stats"),
      ]);
      if (ignore) return;
      if (projectsData) setProjects(projectsData.projects);
      if (statsData) setStats(statsData);
      setLoading(false);
    }
    run();
    return () => {
      ignore = true;
    };
  }, []);

  const greeting = React.useMemo(() => greetingFor(), []);
  const recent = React.useMemo(() => projects.slice(0, 4), [projects]);
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? projects.filter((p) => p.name.toLowerCase().includes(q)) : projects;
  }, [projects, search]);

  function openEditor(projectId: string) {
    router.push(`/Editor?projectId=${projectId}`);
  }

  return (
    <>
      <AppHeader user={user} />
      {/* Session 61 (S61-G — the ninth audit's B-L-1): the gradient lives on
       * the main element. The pre-fix inner div carried min-h-screen (100vh),
       * defeating the calc above it — the page was always ~64px taller than
       * the viewport (a permanent phantom scroll). The gradient still paints
       * the full viewport through main's own min-height. */}
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <div>
          {/* Hero — measured: purple→pink→blue gradient, greeting, CTAs, glass stats card.
           * The chrome renders FLAT at every viewport (session 35, RA-36 —
           * measured on the reference at 390×844: text-4xl h1 / text-lg
           * paragraph / px-6 py-12 containers / plain flex-1 text block
           * (left-aligned at mobile) / flex-col-then-row buttons / a
           * flex-1 max-w-sm stats wrapper (content-width at mobile). The
           * pre-fix responsive downsizing diverged below sm/lg while
           * desktop stayed equal. */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
            <div className="mx-auto max-w-7xl px-6 py-12">
              <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
                <div className="flex-1">
                  <h1 className="mb-3 text-4xl font-bold">
                    {greeting}, {greetingName(user.name)} ✨
                  </h1>
                  <p className="mb-6 max-w-xl text-lg text-purple-100">
                    Ready to bring your ideas to life? Create stunning designs with Digma.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                      type="button"
                      onClick={() => setCreateOpen(true)}
                      className="h-10 rounded-lg bg-white px-6 py-3 font-semibold text-purple-600 shadow hover:bg-gray-50"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Create New Design
                    </Button>
                    <Button
                      type="button"
                      onClick={() =>
                        toast.show({
                          title: "Template gallery",
                          description:
                            "Pick a template directly in the Create dialog — Blank Canvas, Mobile App, Desktop App, or Website.",
                        })
                      }
                      className="flex h-10 items-center gap-2 rounded-lg border border-white/30 bg-transparent px-6 py-3 font-medium text-white backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-white/10"
                    >
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                        aria-hidden
                      >
                        <Sparkles className="h-3 w-3 text-white" />
                      </span>
                      Explore Templates
                    </Button>
                  </div>
                </div>

                <div className="flex-1 max-w-sm">
                  <div className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg">
                    <h3 className="mb-3 text-base font-semibold">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-left">
                        <div className="text-xl font-bold">{stats?.projects ?? "—"}</div>
                        <div className="text-xs text-purple-200">Projects</div>
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-bold">{stats?.teams ?? "—"}</div>
                        <div className="text-xs text-purple-200">Teams</div>
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-bold">{stats?.activeThisWeek ?? "—"}</div>
                        <div className="text-xs text-purple-200">Active this week</div>
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-bold">{stats?.plan ?? "Pro"}</div>
                        <div className="text-xs text-purple-200">Current Plan</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 py-12">
            {/* Continue Working */}
            <section aria-labelledby="continue-working" className="mb-16">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 id="continue-working" className="mb-1 text-2xl font-bold text-gray-900">
                    Continue Working
                  </h2>
                  <p className="text-sm text-gray-600">Pick up where you left off</p>
                </div>
                {/* Session 61 (S61-H / B-L-4): next/link — the raw <a> was a
                 * full document reload (client state lost, prefetch gone);
                 * every other internal link already used the router. */}
                <Link
                  href="/Recent"
                  className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  View all
                  <TrendingUp className="h-4 w-4" aria-hidden />
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-52 animate-pulse rounded-lg bg-gray-100" />
                  ))}
                </div>
              ) : recent.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                  {recent.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      // Session 63 (S63-C / A-L2): the first avatar chip
                      // carries the real-user initial (RA-53) — derived from
                      // the signed-in name with the "D" (Designer) fallback,
                      // the greetingName convention.
                      userInitial={user.name.trim().charAt(0).toUpperCase() || "D"}
                      onRenamed={() => refresh()}
                      onDeleted={(id) => {
                        // Session 58 (S58-F — the sixth audit's A-L-3): the
                        // stats refresh beside the list filter — the hero's
                        // counts previously kept the pre-delete values until
                        // the next navigation (the create path already
                        // refreshed).
                        setProjects((prev) => prev.filter((p) => p.id !== id));
                        void refresh();
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                    <FileText className="h-8 w-8 text-white" aria-hidden />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900">
                    Ready to create something amazing?
                  </h3>
                  <p className="mx-auto mb-6 max-w-md text-sm text-gray-600">
                    Start your first project and bring your creative vision to life with Digma&apos;s
                    powerful design tools.
                  </p>
                  <Button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white hover:from-purple-700 hover:to-pink-700"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Project
                  </Button>
                </div>
              )}
            </section>

            {/* All Projects */}
            <section aria-labelledby="all-projects">
              <div className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                  <h2 id="all-projects" className="mb-1 text-2xl font-bold text-gray-900">
                    All Projects
                  </h2>
                  <p className="text-sm text-gray-600">Organize and manage your design files</p>
                </div>
                <div className="flex w-full items-center gap-4 lg:w-auto">
                  <div className="relative flex-1 lg:w-64">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                      aria-hidden
                    />
                    <label htmlFor="projects-search" className="sr-only">
                      Search projects
                    </label>
                    <input
                      id="projects-search"
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search projects..."
                      className="h-9 w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div
                    className="flex items-center gap-1 rounded-lg bg-gray-100 p-1"
                    role="group"
                    aria-label="View mode"
                  >
                    {/* Reference parity: the active toggle is the reference's
                        --primary (#171717, near-black) with shadow — NOT the
                        clone's purple token. Measured live on /Dashboard. */}
                    <Button
                      type="button"
                      variant="ghost"
                      className={cn(
                        "h-8 w-9 rounded-md p-0 text-xs",
                        view === "grid" &&
                          "bg-neutral-900 text-white shadow-sm hover:bg-neutral-900/90 hover:text-white",
                      )}
                      onClick={() => setView("grid")}
                      aria-label="Grid view"
                      aria-pressed={view === "grid"}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className={cn(
                        "h-8 w-9 rounded-md p-0 text-xs",
                        view === "list" &&
                          "bg-neutral-900 text-white shadow-sm hover:bg-neutral-900/90 hover:text-white",
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

              {view === "grid" ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                  {filtered.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      userInitial={user.name.trim().charAt(0).toUpperCase() || "D"}
                      onRenamed={() => refresh()}
                      onDeleted={(id) => {
                        // Session 58 (S58-F — the sixth audit's A-L-3): the
                        // stats refresh beside the list filter — the hero's
                        // counts previously kept the pre-delete values until
                        // the next navigation (the create path already
                        // refreshed).
                        setProjects((prev) => prev.filter((p) => p.id !== id));
                        void refresh();
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                  {filtered.map((project, index) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => openEditor(project.id)}
                      className={cn(
                        "flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-gray-50",
                        index > 0 && "border-t border-gray-100",
                      )}
                    >
                      <FileText className="h-5 w-5 flex-shrink-0 text-purple-500" aria-hidden />
                      <span className="flex-1 truncate text-sm font-medium text-gray-800">
                        {project.name}
                      </span>
                      {/* Session 61 (S61-B — the ninth audit's M-2): AA at
                          12px — gray-500, not the 2.54:1 gray-400. */}
                      <span className="hidden text-xs text-gray-500 sm:block">
                        {new Date(project.lastOpenedAt).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {!loading && filtered.length === 0 && (
                <div className="py-16 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden />
                  <p className="text-sm text-gray-500">
                    {search ? `No projects match “${search}”.` : "No projects yet."}
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(project) => {
          setProjects((prev) => [project, ...prev]);
          refresh();
          openEditor(project.id);
        }}
      />
    </>
  );
}
