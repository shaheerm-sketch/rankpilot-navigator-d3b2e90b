import { cn } from "@/lib/utils";
import type { Priority, Severity, TaskStatus } from "@/lib/mock-data";

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap";

const severityStyles: Record<Severity, string> = {
  critical: "border-critical/25 bg-critical-soft text-critical",
  high: "border-critical/20 bg-critical-soft text-critical",
  medium: "border-warning/30 bg-warning-soft text-warning-foreground",
  low: "border-border bg-muted text-muted-foreground",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn(base, severityStyles[severity])}>
      <span className="size-1.5 rounded-full bg-current" />
      {severity[0]!.toUpperCase() + severity.slice(1)}
    </span>
  );
}

const priorityStyles: Record<Priority, string> = {
  high: "border-critical/20 bg-critical-soft text-critical",
  medium: "border-warning/30 bg-warning-soft text-warning-foreground",
  low: "border-border bg-muted text-muted-foreground",
};

export function PriorityBadge({ priority, label }: { priority: Priority; label?: string }) {
  return (
    <span className={cn(base, priorityStyles[priority])}>
      <span className="size-1.5 rounded-full bg-current" />
      {label ?? `${priority[0]!.toUpperCase()}${priority.slice(1)} priority`}
    </span>
  );
}

const taskStatusStyles: Record<TaskStatus, string> = {
  todo: "border-border bg-muted text-muted-foreground",
  "in-progress": "border-primary/25 bg-info-soft text-primary",
  completed: "border-success/25 bg-success-soft text-success",
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  completed: "Completed",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={cn(base, taskStatusStyles[status])}>
      <span className="size-1.5 rounded-full bg-current" />
      {taskStatusLabels[status]}
    </span>
  );
}

export function IssueStatusBadge({ status }: { status: "open" | "resolved" }) {
  return (
    <span
      className={cn(
        base,
        status === "open"
          ? "border-border bg-muted text-muted-foreground"
          : "border-success/25 bg-success-soft text-success",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status === "open" ? "Open" : "Resolved"}
    </span>
  );
}

export function OpportunityBadge({ level }: { level: Priority }) {
  return (
    <span
      className={cn(
        base,
        level === "high"
          ? "border-insight/25 bg-insight-soft text-insight"
          : level === "medium"
            ? "border-warning/30 bg-warning-soft text-warning-foreground"
            : "border-border bg-muted text-muted-foreground",
      )}
    >
      {level[0]!.toUpperCase() + level.slice(1)}
    </span>
  );
}