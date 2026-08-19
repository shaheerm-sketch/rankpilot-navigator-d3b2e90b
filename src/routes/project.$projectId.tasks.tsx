import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Plus, User } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/rankpilot/app-shell";
import { FilterBar, FilterChips, SearchInput } from "@/components/rankpilot/filter-bar";
import { PriorityBadge, taskStatusLabels } from "@/components/rankpilot/badges";
import { EmptyState } from "@/components/rankpilot/states";
import { CreateTaskDialog } from "@/components/rankpilot/create-task-dialog";
import { Button } from "@/components/ui/button";
import type { Task, TaskStatus } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/project/$projectId/tasks")({
  head: () => ({
    meta: [
      { title: "SEO Tasks — RankPilot" },
      { name: "description", content: "Track SEO tasks from backlog to completion across your team." },
      { property: "og:title", content: "SEO Tasks — RankPilot" },
      { property: "og:description", content: "Track SEO tasks from backlog to completion across your team." },
    ],
  }),
  component: TasksPage,
});

const columns: TaskStatus[] = ["todo", "in-progress", "completed"];

function TaskCard({ task }: { task: Task }) {
  const { setTaskStatus } = useStore();
  const next: Record<TaskStatus, TaskStatus | null> = {
    todo: "in-progress",
    "in-progress": "completed",
    completed: null,
  };
  const nextStatus = next[task.status];

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold">{task.title}</h3>
        <PriorityBadge priority={task.priority} />
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
      <p className="mt-2 text-[11px] font-medium text-muted-foreground">Source: {task.source}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <User className="size-3.5" /> {task.assignee}
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="size-3.5" /> {task.dueDate}
        </span>
      </div>
      {task.awaitingReview ? (
        <p className="mt-2 text-xs font-semibold text-warning-foreground">Awaiting manager review</p>
      ) : null}
      {nextStatus ? (
        <Button
          size="sm"
          variant="outline"
          className="mt-3 w-full"
          onClick={() => {
            setTaskStatus(task.id, nextStatus);
            toast.success(`Moved to ${taskStatusLabels[nextStatus]}`, { description: task.title });
          }}
        >
          Move to {taskStatusLabels[nextStatus]}
        </Button>
      ) : null}
    </article>
  );
}

function TasksPage() {
  const { projectId } = Route.useParams();
  const { tasks } = useStore();
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    let list = tasks.filter((t) => t.projectId === projectId);
    if (filter !== "all") list = list.filter((t) => t.priority === filter);
    if (query.trim()) list = list.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [tasks, projectId, filter, query]);

  return (
    <div>
      <PageHeader
        title="SEO Tasks"
        description="Everything your team committed to, grouped by status."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> New Task
          </Button>
        }
      />

      <FilterBar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search tasks…" />
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" },
          ]}
        />
      </FilterBar>

      {rows.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          message="Create a task manually or from any recommendation in the app."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" /> New Task
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((status) => {
            const items = rows.filter((t) => t.status === status);
            return (
              <section key={status} className="rounded-2xl bg-muted/60 p-3">
                <header className="flex items-center justify-between px-1 pb-3">
                  <h2 className="text-sm font-semibold">{taskStatusLabels[status]}</h2>
                  <span className="tabular rounded-full bg-card px-2 py-0.5 text-xs font-semibold">{items.length}</span>
                </header>
                <div className="space-y-3">
                  {items.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                      Nothing here
                    </p>
                  ) : (
                    items.map((t) => <TaskCard key={t.id} task={t} />)
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <CreateTaskDialog open={open} onOpenChange={setOpen} projectId={projectId} />
    </div>
  );
}