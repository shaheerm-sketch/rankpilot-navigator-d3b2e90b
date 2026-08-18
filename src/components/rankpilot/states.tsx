import type { ReactNode } from "react";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyState({
  title,
  message,
  action,
  icon,
}: {
  title: string;
  message: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        {icon ?? <Inbox className="size-5" />}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ onRetry, message }: { onRetry: () => void; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-critical/20 bg-critical-soft px-6 py-12 text-center">
      <AlertTriangle className="mb-3 size-6 text-critical" />
      <h3 className="text-base font-semibold">Something went wrong</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {message ?? "Something went wrong while loading this data."}
      </p>
      <Button className="mt-5" variant="outline" onClick={onRetry}>
        <RefreshCw className="size-4" /> Try Again
      </Button>
    </div>
  );
}

export function LoadingCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-8 w-20" />
          <Skeleton className="mt-4 h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

export function LoadingTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-card">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}