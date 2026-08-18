import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Eye, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/rankpilot/app-shell";
import { FilterBar, FilterChips, SearchInput, TableShell } from "@/components/rankpilot/filter-bar";
import { IssueStatusBadge, SeverityBadge } from "@/components/rankpilot/badges";
import { EmptyState } from "@/components/rankpilot/states";
import { CreateTaskDialog, type TaskPrefill } from "@/components/rankpilot/create-task-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store";
import type { AuditIssue } from "@/lib/mock-data";

export const Route = createFileRoute("/project/$projectId/audit/")({
  head: () => ({
    meta: [
      { title: "SEO Audit — RankPilot" },
      { name: "description", content: "Technical SEO issues found in the latest crawl, ranked by severity." },
      { property: "og:title", content: "SEO Audit — RankPilot" },
      { property: "og:description", content: "Technical SEO issues found in the latest crawl, ranked by severity." },
    ],
  }),
  component: AuditPage,
});

const severityRank = { critical: 0, high: 1, medium: 2, low: 3 } as const;

function AuditPage() {
  const { projectId } = Route.useParams();
  const { issues, resolveIssue } = useStore();
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low" | "resolved">("all");
  const [status, setStatus] = useState<"any" | "open" | "resolved">("any");
  const [sort, setSort] = useState<"severity" | "pages" | "title">("severity");
  const [query, setQuery] = useState("");
  const [taskFor, setTaskFor] = useState<TaskPrefill | null>(null);

  const rows = useMemo(() => {
    let list = issues.filter((i) => i.projectId === projectId);
    if (filter === "resolved") list = list.filter((i) => i.status === "resolved");
    else if (filter !== "all") list = list.filter((i) => i.severity === filter && i.status === "open");
    if (status !== "any") list = list.filter((i) => i.status === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q) || i.url.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) =>
      sort === "pages"
        ? b.affectedPages - a.affectedPages
        : sort === "title"
          ? a.title.localeCompare(b.title)
          : severityRank[a.severity] - severityRank[b.severity],
    );
  }, [issues, projectId, filter, status, query, sort]);

  const markResolved = (issue: AuditIssue) => {
    resolveIssue(issue.id);
    toast.success("Issue resolved", { description: issue.title });
  };

  return (
    <div>
      <PageHeader
        title="SEO Audit"
        description="Technical issues detected in the latest crawl. Turn any issue into a task."
      />

      <FilterBar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search issues or URLs…" />
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "critical", label: "Critical" },
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" },
            { value: "resolved", label: "Resolved" },
          ]}
        />
        <div className="flex gap-2">
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="h-10 w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="h-10 w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="severity">Sort: Severity</SelectItem>
              <SelectItem value="pages">Sort: Pages</SelectItem>
              <SelectItem value="title">Sort: Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FilterBar>

      {rows.length === 0 ? (
        <EmptyState
          title="No issues match these filters"
          message="Try clearing the search or switching back to All severities."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setFilter("all");
                setStatus("any");
                setQuery("");
              }}
            >
              Reset filters
            </Button>
          }
        />
      ) : (
        <TableShell>
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow>
                <TableHead>Issue</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="text-right">Affected pages</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">
                    <Link
                      to="/project/$projectId/audit/$issueId"
                      params={{ projectId, issueId: issue.id }}
                      className="hover:text-primary hover:underline"
                    >
                      {issue.title}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{issue.url}</TableCell>
                  <TableCell>
                    <SeverityBadge severity={issue.severity} />
                  </TableCell>
                  <TableCell className="tabular text-right">{issue.affectedPages}</TableCell>
                  <TableCell>
                    <IssueStatusBadge status={issue.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label={`Actions for ${issue.title}`}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to="/project/$projectId/audit/$issueId" params={{ projectId, issueId: issue.id }}>
                            <Eye className="size-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            setTaskFor({
                              title: issue.title,
                              description: issue.recommendedAction,
                              priority: issue.severity === "low" ? "low" : issue.severity === "medium" ? "medium" : "high",
                              source: "SEO Audit",
                            })
                          }
                        >
                          <Plus className="size-4" /> Create Task
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={issue.status === "resolved"}
                          onSelect={() => markResolved(issue)}
                        >
                          <CheckCircle2 className="size-4" /> Mark Resolved
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableShell>
      )}

      <CreateTaskDialog
        open={!!taskFor}
        onOpenChange={(v) => !v && setTaskFor(null)}
        projectId={projectId}
        {...(taskFor ? { prefill: taskFor } : {})}
      />
    </div>
  );
}