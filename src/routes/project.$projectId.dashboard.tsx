import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, ArrowRight, FileText, Link2, ListChecks, Search, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/rankpilot/app-shell";
import { ChartCard, SEOHealthCard, StatCard } from "@/components/rankpilot/cards";
import { PriorityBadge, taskStatusLabels } from "@/components/rankpilot/badges";
import { LoadingCards } from "@/components/rankpilot/states";
import { Button } from "@/components/ui/button";
import { rankTrend } from "@/lib/mock-data";
import { useProject, useStore } from "@/lib/store";

export const Route = createFileRoute("/project/$projectId/dashboard")({
  head: () => ({
    meta: [
      { title: "Project dashboard — RankPilot" },
      { name: "description", content: "SEO command center: health score, priority actions and task progress." },
      { property: "og:title", content: "Project dashboard — RankPilot" },
      { property: "og:description", content: "SEO command center: health score, priority actions and task progress." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId)!;
  const { issues, keywords, content, links, tasks } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const projectIssues = issues.filter((i) => i.projectId === projectId);
  const openIssues = projectIssues.filter((i) => i.status === "open");
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  const activeTasks = projectTasks.filter((t) => t.status !== "completed");
  const openLinks = links.filter((l) => l.projectId === projectId && l.status === "open");
  const openContent = content.filter((c) => c.projectId === projectId && !c.completed);
  const kwOpps = keywords.filter((k) => k.projectId === projectId);

  const severityData = (["critical", "high", "medium", "low"] as const).map((s) => ({
    name: s[0]!.toUpperCase() + s.slice(1),
    value: openIssues.filter((i) => i.severity === s).length,
    fill:
      s === "critical" || s === "high"
        ? "var(--critical)"
        : s === "medium"
          ? "var(--warning)"
          : "var(--muted-foreground)",
  }));

  const taskData = (["todo", "in-progress", "completed"] as const).map((s) => ({
    name: taskStatusLabels[s],
    value: projectTasks.filter((t) => t.status === s).length,
    fill: s === "completed" ? "var(--success)" : s === "in-progress" ? "var(--primary)" : "var(--muted-foreground)",
  }));

  return (
    <div>
      <PageHeader
        title={project.name}
        description={`${project.domain} · last crawl ${project.lastUpdated.toLowerCase()}`}
        action={
          <Button asChild>
            <Link to="/project/$projectId/tasks" params={{ projectId }}>
              <ListChecks className="size-4" /> View Tasks
            </Link>
          </Button>
        }
      />

      {loading ? (
        <LoadingCards count={6} />
      ) : (
        <>
          <section className="mb-4 rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="text-sm font-semibold text-muted-foreground">Project details</h2>
            <dl className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs text-muted-foreground">Name</dt>
                <dd className="mt-0.5 font-semibold">{project.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Website</dt>
                <dd className="mt-0.5 truncate font-semibold">{project.domain}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="mt-0.5 font-semibold capitalize">{project.status.replace("-", " ")}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Last updated</dt>
                <dd className="mt-0.5 font-semibold">{project.lastUpdated}</dd>
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <dt className="text-xs text-muted-foreground">Description</dt>
                <dd className="mt-0.5 text-sm">
                  {project.description || "No description added yet."}
                </dd>
              </div>
            </dl>
          </section>

          <div className="grid gap-4 lg:grid-cols-3">
            <SEOHealthCard score={project.health} domain={project.domain} />
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
              <StatCard
                label="Technical Issues"
                value={`${openIssues.length} open`}
                hint="Across the latest crawl"
                tone="critical"
                icon={<AlertTriangle className="size-4" />}
              />
              <StatCard
                label="Keyword Opportunities"
                value={project.keywordOpportunities}
                hint={`${kwOpps.filter((k) => k.opportunity === "high").length} rated high`}
                tone="primary"
                icon={<Search className="size-4" />}
              />
              <StatCard
                label="Content Opportunities"
                value={openContent.length}
                hint="Create, refresh and intent fixes"
                tone="insight"
                icon={<FileText className="size-4" />}
              />
              <StatCard
                label="Internal Link Opportunities"
                value={project.linkOpportunities}
                hint={`${openLinks.length} not yet actioned`}
                tone="warning"
                icon={<Link2 className="size-4" />}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Tasks"
              value={`${activeTasks.length} active`}
              hint={`${projectTasks.filter((t) => t.status === "completed").length} completed`}
              tone="success"
              icon={<ListChecks className="size-4" />}
            />
            <StatCard
              label="Avg. position (tracked)"
              value={Math.round(kwOpps.reduce((a, k) => a + k.rank, 0) / Math.max(kwOpps.length, 1))}
              hint="Improving over last 6 months"
              tone="primary"
              icon={<TrendingUp className="size-4" />}
            />
          </div>

          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold">Priority Actions</h2>
              <span className="text-xs text-muted-foreground">What to work on next</span>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <RecommendationCard
                priority="high"
                title="Fix missing title tags"
                meta="8 pages affected"
                impact="High"
                to="/project/$projectId/audit/$issueId"
                params={{ projectId, issueId: "iss-1" }}
                cta="View Issue"
              />
              <RecommendationCard
                priority="high"
                title="Refresh declining SEO guide"
                meta="Current position #17 · previous #8"
                impact="High"
                to="/project/$projectId/content"
                params={{ projectId }}
                search={{ focus: "co-2" }}
                cta="View Opportunity"
              />
              <RecommendationCard
                priority="medium"
                title="Add internal links to SEO Audit page"
                meta="14 relevant source pages"
                impact="Medium"
                to="/project/$projectId/links"
                params={{ projectId }}
                search={{ focus: "ln-1" }}
                cta="View Recommendation"
              />
            </div>
          </section>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <ChartCard title="Keyword Performance" subtitle="Average position, 'SEO audit' cluster">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rankTrend} margin={{ left: -20, right: 8, top: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis reversed tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
                      formatter={(v) => [`#${v}`, "Position"]}
                    />
                    <Line type="monotone" dataKey="position" stroke="var(--primary)" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="SEO Issues" subtitle="Open issues by severity">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityData} margin={{ left: -20, right: 8, top: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip
                      cursor={{ fill: "var(--muted)" }}
                      contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {severityData.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Task Progress" subtitle="Current sprint">
              <ul className="space-y-4 pt-2">
                {taskData.map((t) => {
                  const total = Math.max(projectTasks.length, 1);
                  return (
                    <li key={t.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{t.name}</span>
                        <span className="tabular text-muted-foreground">{t.value}</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(t.value / total) * 100}%`, backgroundColor: t.fill }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Button variant="outline" className="mt-6 w-full" asChild>
                <Link to="/project/$projectId/tasks" params={{ projectId }}>
                  Open task board
                </Link>
              </Button>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

type RecProps = {
  priority: "high" | "medium" | "low";
  title: string;
  meta: string;
  impact: string;
  cta: string;
  to: string;
  params: Record<string, string>;
  search?: Record<string, string>;
};

function RecommendationCard({ priority, title, meta, impact, cta, to, params, search }: RecProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:shadow-pop">
      <PriorityBadge priority={priority} />
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Estimated impact: <span className="font-semibold text-foreground">{impact}</span>
      </p>
      <Button variant="outline" className="mt-5 w-full justify-between" asChild>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Link to={to as any} params={params as any} search={search as any}>
          {cta} <ArrowRight className="size-4" />
        </Link>
      </Button>
    </article>
  );
}