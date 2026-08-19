import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/rankpilot/app-shell";
import { FilterBar, FilterChips, SearchInput, TableShell } from "@/components/rankpilot/filter-bar";
import { PriorityBadge } from "@/components/rankpilot/badges";
import { EmptyState } from "@/components/rankpilot/states";
import { CreateTaskDialog } from "@/components/rankpilot/create-task-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LinkOpportunity } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/project/$projectId/links")({
  head: () => ({
    meta: [
      { title: "Internal Links — RankPilot" },
      { name: "description", content: "Suggested internal links to spread authority across key pages." },
      { property: "og:title", content: "Internal Links — RankPilot" },
      { property: "og:description", content: "Suggested internal links to spread authority across key pages." },
    ],
  }),
  component: LinksPage,
});

function LinksPage() {
  const { projectId } = Route.useParams();
  const { links, setLinkStatus } = useStore();
  const [filter, setFilter] = useState<"all" | "open" | "accepted" | "dismissed" | "high">("all");
  const [query, setQuery] = useState("");
  const [taskOpen, setTaskOpen] = useState(false);
  const [active, setActive] = useState<LinkOpportunity | null>(null);

  const rows = useMemo(() => {
    let list = links.filter((l) => l.projectId === projectId);
    if (filter === "high") list = list.filter((l) => l.priority === "high");
    else if (filter !== "all") list = list.filter((l) => l.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((l) => l.source.toLowerCase().includes(q) || l.target.toLowerCase().includes(q) || l.anchor.toLowerCase().includes(q));
    }
    return list;
  }, [links, projectId, filter, query]);

  return (
    <div>
      <PageHeader
        title="Internal Links"
        description="Link suggestions that pass authority to pages with the most upside."
      />

      <FilterBar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search source, target or anchor…" />
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "open", label: "Open" },
            { value: "accepted", label: "Accepted" },
            { value: "dismissed", label: "Dismissed" },
            { value: "high", label: "High Priority" },
          ]}
        />
      </FilterBar>

      {rows.length === 0 ? (
        <EmptyState
          title="No internal link opportunities"
          message="Link suggestions will appear here once pages are crawled."
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
                <TableHead>Suggested link</TableHead>
                <TableHead>Anchor text</TableHead>
                <TableHead className="text-right">Relevance</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="truncate">{l.source}</span>
                      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate font-semibold">{l.target}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{l.reason}</p>
                  </TableCell>
                  <TableCell className="text-sm">"{l.anchor}"</TableCell>
                  <TableCell className="tabular text-right">{l.relevance}%</TableCell>
                  <TableCell>
                    <PriorityBadge priority={l.priority} />
                  </TableCell>
                  <TableCell className="text-sm capitalize">{l.status}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setLinkStatus(l.id, "accepted");
                          toast.success("Link accepted", { description: `${l.source} → ${l.target}` });
                        }}
                      >
                        <Check className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setLinkStatus(l.id, "dismissed");
                          toast("Link dismissed", { description: `${l.source} → ${l.target}` });
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setActive(l);
                          setTaskOpen(true);
                        }}
                      >
                        <Plus className="size-4" /> Task
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableShell>
      )}

      <CreateTaskDialog
        open={taskOpen}
        onOpenChange={setTaskOpen}
        projectId={projectId}
        prefill={{
          title: active ? `Add internal link: ${active.source} → ${active.target}` : "",
          description: active ? `${active.reason} Suggested anchor: "${active.anchor}".` : "",
          priority: active?.priority ?? "medium",
          source: "Internal Links",
        }}
      />
    </div>
  );
}