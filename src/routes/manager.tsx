import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/rankpilot/app-shell";
import { PriorityBadge, StatusBadge } from "@/components/rankpilot/badges";
import { StatCard } from "@/components/rankpilot/cards";
import { EmptyState } from "@/components/rankpilot/states";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/manager")({
  head: () => ({
    meta: [
      { title: "Manager Dashboard — RankPilot" },
      { name: "description", content: "Review completed SEO work and monitor portfolio health across projects." },
      { property: "og:title", content: "Manager Dashboard — RankPilot" },
      { property: "og:description", content: "Review completed SEO work and monitor portfolio health across projects." },
    ],
  }),
  component: ManagerPage,
});

function ManagerPage() {
  const { projects, tasks, reviewTask } = useStore();

  const pending = useMemo(() => tasks.filter((t) => t.awaitingReview), [tasks]);
  const avgHealth = projects.length
    ? Math.round(projects.reduce((sum, p) => sum + p.health, 0) / projects.length)
    : 0;
  const completed = tasks.filter((t) => t.status === "completed" && !t.awaitingReview).length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Logo />
          <Button variant="ghost" size="sm" asChild>
            <Link to="/projects">
              <ArrowLeft className="size-4" /> Back to projects
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Manager dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Portfolio health and completed work waiting on review.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Projects" value={projects.length} />
          <StatCard label="Average SEO health" value={`${avgHealth}`} />
          <StatCard label="Tasks in progress" value={inProgress} />
          <StatCard label="Approved completions" value={completed} />
        </div>

        <section className="mt-8">
          <h2 className="text-base font-semibold">Awaiting review</h2>
          <div className="mt-3">
            {pending.length === 0 ? (
              <EmptyState title="Nothing to review" message="Completed tasks will appear here for approval." />
            ) : (
              <ul className="space-y-3">
                {pending.map((t) => {
                  const project = projects.find((p) => p.id === t.projectId);
                  return (
                    <li key={t.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{t.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {project?.name ?? "Unknown project"} · Completed by {t.completedBy ?? t.assignee} · Source: {t.source}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={t.priority} />
                          <StatusBadge status={t.status} />
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            reviewTask(t.id, true);
                            toast.success("Task approved", { description: t.title });
                          }}
                        >
                          <CheckCircle2 className="size-4" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            reviewTask(t.id, false);
                            toast("Sent back for rework", { description: t.title });
                          }}
                        >
                          <RotateCcw className="size-4" /> Request changes
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-semibold">Projects overview</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                to="/project/$projectId/dashboard"
                params={{ projectId: p.id }}
                className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary/40"
              >
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.domain}</p>
                <p className="tabular mt-3 text-2xl font-bold">{p.health}</p>
                <p className="text-xs text-muted-foreground">SEO health · {p.openIssues} open issues</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}