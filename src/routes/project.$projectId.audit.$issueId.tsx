import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Plus } from "lucide-react";
import { toast } from "sonner";
import { IssueStatusBadge, SeverityBadge } from "@/components/rankpilot/badges";
import { CreateTaskDialog } from "@/components/rankpilot/create-task-dialog";
import { EmptyState } from "@/components/rankpilot/states";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/project/$projectId/audit/$issueId")({
  head: () => ({
    meta: [
      { title: "Issue details — RankPilot SEO Audit" },
      { name: "description", content: "Why this SEO issue matters and the recommended action to resolve it." },
      { property: "og:title", content: "Issue details — RankPilot SEO Audit" },
      { property: "og:description", content: "Why this SEO issue matters and the recommended action to resolve it." },
    ],
  }),
  component: IssueDetailPage,
});

function IssueDetailPage() {
  const { projectId, issueId } = Route.useParams();
  const { issues, resolveIssue } = useStore();
  const navigate = useNavigate();
  const [taskOpen, setTaskOpen] = useState(false);
  const issue = issues.find((i) => i.id === issueId);

  if (!issue) {
    return (
      <EmptyState
        title="Issue not found"
        message="This issue is not part of the current crawl."
        action={
          <Button asChild>
            <Link to="/project/$projectId/audit" params={{ projectId }}>
              Back to Audit
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
        <Link to="/project/$projectId/audit" params={{ projectId }}>
          <ArrowLeft className="size-4" /> Back to Audit
        </Link>
      </Button>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={issue.severity} />
          <IssueStatusBadge status={issue.status} />
        </div>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{issue.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{issue.description}</p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-muted p-4">
            <dt className="text-xs text-muted-foreground">Affected URL</dt>
            <dd className="mt-1 font-mono text-sm break-all">{issue.url}</dd>
          </div>
          <div className="rounded-xl bg-muted p-4">
            <dt className="text-xs text-muted-foreground">Affected pages</dt>
            <dd className="tabular mt-1 text-lg font-semibold">{issue.affectedPages}</dd>
          </div>
          <div className="rounded-xl bg-muted p-4">
            <dt className="text-xs text-muted-foreground">Current status</dt>
            <dd className="mt-1 text-sm font-semibold capitalize">{issue.status}</dd>
          </div>
        </dl>

        <section className="mt-7">
          <h2 className="text-sm font-semibold">Example affected pages</h2>
          <ul className="mt-2 space-y-1">
            {issue.examplePages.map((p) => (
              <li key={p} className="font-mono text-sm text-muted-foreground">
                {p}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-7">
          <h2 className="text-sm font-semibold">Why it matters</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{issue.whyItMatters}</p>
        </section>

        <section className="mt-7 rounded-xl border border-primary/20 bg-info-soft p-5">
          <h2 className="text-sm font-semibold text-primary">Recommended action</h2>
          <p className="mt-1.5 text-sm">{issue.recommendedAction}</p>
        </section>

        <div className="mt-7 flex flex-wrap gap-2">
          <Button onClick={() => setTaskOpen(true)}>
            <Plus className="size-4" /> Create Task
          </Button>
          <Button
            variant="outline"
            disabled={issue.status === "resolved"}
            onClick={() => {
              resolveIssue(issue.id);
              toast.success("Issue marked resolved", { description: issue.title });
            }}
          >
            <CheckCircle2 className="size-4" /> Mark Resolved
          </Button>
          <Button variant="ghost" onClick={() => navigate({ to: "/project/$projectId/audit", params: { projectId } })}>
            Back to Audit
          </Button>
        </div>
      </div>

      <CreateTaskDialog
        open={taskOpen}
        onOpenChange={setTaskOpen}
        projectId={projectId}
        prefill={{
          title: issue.title,
          description: issue.recommendedAction,
          priority: issue.severity === "low" ? "low" : issue.severity === "medium" ? "medium" : "high",
          source: "SEO Audit",
        }}
      />
    </div>
  );
}