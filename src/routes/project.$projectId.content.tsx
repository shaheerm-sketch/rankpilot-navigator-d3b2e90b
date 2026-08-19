import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, FilePlus2, PenLine, Plus, Target } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/rankpilot/app-shell";
import { FilterBar, FilterChips, SearchInput } from "@/components/rankpilot/filter-bar";
import { OpportunityBadge } from "@/components/rankpilot/badges";
import { EmptyState } from "@/components/rankpilot/states";
import { CreateTaskDialog } from "@/components/rankpilot/create-task-dialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { ContentOpportunity } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/project/$projectId/content")({
  head: () => ({
    meta: [
      { title: "Content Opportunities — RankPilot" },
      { name: "description", content: "Content to create, refresh or realign with search intent." },
      { property: "og:title", content: "Content Opportunities — RankPilot" },
      { property: "og:description", content: "Content to create, refresh or realign with search intent." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ focus: typeof s["focus"] === "string" ? s["focus"] : undefined }),
  component: ContentPage,
});

const typeMeta = {
  create: { label: "Create New Content", icon: FilePlus2, tone: "bg-insight-soft text-insight" },
  refresh: { label: "Refresh Existing Content", icon: PenLine, tone: "bg-warning-soft text-warning-foreground" },
  improve: { label: "Improve Search Intent", icon: Target, tone: "bg-info-soft text-primary" },
} as const;

function ContentPage() {
  const { projectId } = Route.useParams();
  const { focus } = Route.useSearch();
  const { content, completeContent } = useStore();
  const [filter, setFilter] = useState<"all" | "create" | "refresh" | "improve" | "high" | "medium">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(focus ?? null);
  const [taskOpen, setTaskOpen] = useState(false);

  const rows = useMemo(() => {
    let list = content.filter((c) => c.projectId === projectId);
    if (filter === "create" || filter === "refresh" || filter === "improve") list = list.filter((c) => c.type === filter);
    if (filter === "high" || filter === "medium") list = list.filter((c) => c.opportunity === filter);
    if (query.trim()) list = list.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [content, projectId, filter, query]);

  const selected = content.find((c) => c.id === selectedId) ?? null;

  const markComplete = (c: ContentOpportunity) => {
    completeContent(c.id, !c.completed);
    toast.success(c.completed ? "Marked as open" : "Marked complete", { description: c.title });
  };

  return (
    <div>
      <PageHeader title="Content Opportunities" description="Where new or improved content will move rankings." />

      <FilterBar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search content topics…" />
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "create", label: "Create" },
            { value: "refresh", label: "Refresh" },
            { value: "improve", label: "Improve" },
            { value: "high", label: "High Priority" },
            { value: "medium", label: "Medium Priority" },
          ]}
        />
      </FilterBar>

      {rows.length === 0 ? (
        <EmptyState
          title="No SEO opportunities found"
          message="Opportunities will appear here when project data is available."
          action={
            <Button variant="outline" onClick={() => { setFilter("all"); setQuery(""); }}>
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => {
            const meta = typeMeta[c.type];
            return (
              <article key={c.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.tone}`}>
                    <meta.icon className="size-3.5" /> {meta.label}
                  </span>
                  <OpportunityBadge level={c.opportunity} />
                </div>
                <h3 className="mt-3 text-base font-semibold">{c.title}</h3>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    Search volume: <span className="tabular font-semibold text-foreground">{c.volume.toLocaleString()}</span>
                  </div>
                  <div>
                    Difficulty: <span className="tabular font-semibold text-foreground">{c.difficulty}</span>
                  </div>
                  <div>
                    Current URL: <span className="font-semibold text-foreground">{c.currentUrl ?? "None"}</span>
                  </div>
                  <div>
                    Trend: <span className="font-semibold text-foreground">{c.trafficTrend}</span>
                  </div>
                </dl>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{c.recommendation}</p>
                {c.completed ? (
                  <p className="mt-3 text-xs font-semibold text-success">Completed</p>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedId(c.id)}>
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedId(c.id);
                      setTaskOpen(true);
                    }}
                  >
                    <Plus className="size-4" /> Create Task
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => markComplete(c)}>
                    <CheckCircle2 className="size-4" /> {c.completed ? "Reopen" : "Mark Complete"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Sheet open={!!selected && !taskOpen} onOpenChange={(v) => !v && setSelectedId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{selected.title}</SheetTitle>
                <SheetDescription>{typeMeta[selected.type].label}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-6">
                <dl className="grid grid-cols-2 gap-3">
                  {[
                    ["Search volume", selected.volume.toLocaleString()],
                    ["Difficulty", String(selected.difficulty)],
                    ["Current rank", selected.rank ? `#${selected.rank}` : "—"],
                    ["Previous rank", selected.previousRank ? `#${selected.previousRank}` : "—"],
                    ["Traffic trend", selected.trafficTrend],
                    ["Current URL", selected.currentUrl ?? "None"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-muted p-3">
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd className="mt-0.5 text-sm font-semibold break-all">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="rounded-xl border border-primary/20 bg-info-soft p-4">
                  <p className="text-sm font-semibold text-primary">Recommendation</p>
                  <p className="mt-1 text-sm">{selected.recommendation}</p>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => setTaskOpen(true)}>
                    <Plus className="size-4" /> Create Task
                  </Button>
                  <Button variant="outline" onClick={() => markComplete(selected)}>
                    <CheckCircle2 className="size-4" /> {selected.completed ? "Reopen" : "Complete"}
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <CreateTaskDialog
        open={taskOpen}
        onOpenChange={setTaskOpen}
        projectId={projectId}
        prefill={{
          title: selected ? `${typeMeta[selected.type].label}: ${selected.title}` : "",
          description: selected?.recommendation ?? "",
          priority: selected?.opportunity ?? "medium",
          source: "Content Opportunity",
        }}
      />
    </div>
  );
}