import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/rankpilot/app-shell";
import { FilterBar, FilterChips, SearchInput, TableShell } from "@/components/rankpilot/filter-bar";
import { OpportunityBadge } from "@/components/rankpilot/badges";
import { EmptyState } from "@/components/rankpilot/states";
import { CreateTaskDialog } from "@/components/rankpilot/create-task-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Keyword } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/project/$projectId/keywords")({
  head: () => ({
    meta: [
      { title: "Keywords — RankPilot" },
      { name: "description", content: "Keyword opportunities scored by rank, volume, difficulty and trend." },
      { property: "og:title", content: "Keywords — RankPilot" },
      { property: "og:description", content: "Keyword opportunities scored by rank, volume, difficulty and trend." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ focus: typeof s["focus"] === "string" ? s["focus"] : undefined }),
  component: KeywordsPage,
});

const TrendIcon = ({ trend }: { trend: Keyword["trend"] }) =>
  trend === "up" ? (
    <ArrowUpRight className="size-4 text-success" />
  ) : trend === "down" ? (
    <ArrowDownRight className="size-4 text-critical" />
  ) : (
    <ArrowRight className="size-4 text-muted-foreground" />
  );

function KeywordsPage() {
  const { projectId } = Route.useParams();
  const { focus } = Route.useSearch();
  const { keywords } = useStore();
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "improving" | "declining">("all");
  const [sort, setSort] = useState<"opportunity" | "rank" | "volume">("opportunity");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(focus ?? null);
  const [taskOpen, setTaskOpen] = useState(false);

  const rows = useMemo(() => {
    let list = keywords.filter((k) => k.projectId === projectId);
    if (filter === "high" || filter === "medium") list = list.filter((k) => k.opportunity === filter);
    if (filter === "improving") list = list.filter((k) => k.trend === "up");
    if (filter === "declining") list = list.filter((k) => k.trend === "down");
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((k) => k.keyword.toLowerCase().includes(q) || k.url.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) =>
      sort === "rank" ? a.rank - b.rank : sort === "volume" ? b.volume - a.volume : b.opportunityScore - a.opportunityScore,
    );
  }, [keywords, projectId, filter, query, sort]);

  const selected = keywords.find((k) => k.id === selectedId) ?? null;

  return (
    <div>
      <PageHeader title="Keywords" description="Ranked opportunities based on position, volume and momentum." />

      <FilterBar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search keywords or URLs…" />
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "high", label: "High Opportunity" },
            { value: "medium", label: "Medium Opportunity" },
            { value: "improving", label: "Improving" },
            { value: "declining", label: "Declining" },
          ]}
        />
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger className="h-10 w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opportunity">Sort: Opportunity</SelectItem>
            <SelectItem value="rank">Sort: Rank</SelectItem>
            <SelectItem value="volume">Sort: Volume</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      {rows.length === 0 ? (
        <EmptyState
          title="No keywords match these filters"
          message="Opportunities will appear here when project data is available."
          action={
            <Button variant="outline" onClick={() => { setFilter("all"); setQuery(""); }}>
              Reset filters
            </Button>
          }
        />
      ) : (
        <TableShell>
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">Rank</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Difficulty</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Opportunity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((k) => (
                <TableRow
                  key={k.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedId(k.id)}
                >
                  <TableCell className="font-medium">{k.keyword}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{k.url}</TableCell>
                  <TableCell className="tabular text-right">{k.rank}</TableCell>
                  <TableCell className="tabular text-right">{k.volume.toLocaleString()}</TableCell>
                  <TableCell className="tabular text-right">{k.difficulty}</TableCell>
                  <TableCell>
                    <TrendIcon trend={k.trend} />
                  </TableCell>
                  <TableCell>
                    <OpportunityBadge level={k.opportunity} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableShell>
      )}

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelectedId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{selected.keyword}</SheetTitle>
                <SheetDescription>Keyword opportunity detail</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-6">
                <dl className="grid grid-cols-2 gap-3">
                  {[
                    ["Current rank", `#${selected.rank}`],
                    ["Previous rank", `#${selected.previousRank}`],
                    ["Search volume", selected.volume.toLocaleString()],
                    ["Difficulty", String(selected.difficulty)],
                    ["CTR", selected.ctr],
                    ["Opportunity score", `${selected.opportunityScore}/100`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-muted p-3">
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd className="tabular mt-0.5 text-base font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Trend:</span>
                  <TrendIcon trend={selected.trend} />
                  <span className="font-medium capitalize">{selected.trend}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ranking URL</p>
                  <p className="font-mono text-sm break-all">{selected.url}</p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-info-soft p-4">
                  <p className="text-sm font-semibold text-primary">Recommended action</p>
                  <p className="mt-1 text-sm">{selected.recommendedAction}</p>
                </div>
                <Button className="w-full" onClick={() => setTaskOpen(true)}>
                  <Plus className="size-4" /> Create SEO Task
                </Button>
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
          title: selected ? `Improve ranking for "${selected.keyword}"` : "",
          description: selected?.recommendedAction ?? "",
          priority: selected?.opportunity ?? "medium",
          source: "Keyword",
        }}
      />
    </div>
  );
}