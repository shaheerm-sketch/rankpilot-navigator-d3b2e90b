import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
  onClick,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  tone?: "neutral" | "critical" | "warning" | "success" | "insight" | "primary";
  onClick?: () => void;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-muted text-muted-foreground",
    critical: "bg-critical-soft text-critical",
    warning: "bg-warning-soft text-warning-foreground",
    success: "bg-success-soft text-success",
    insight: "bg-insight-soft text-insight",
    primary: "bg-info-soft text-primary",
  };
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-border bg-card p-5 text-left shadow-card transition",
        onClick && "hover:-translate-y-0.5 hover:shadow-pop focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon ? (
          <span className={cn("flex size-8 items-center justify-center rounded-lg", tones[tone])}>{icon}</span>
        ) : null}
      </div>
      <p className="tabular mt-3 text-3xl font-bold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </Comp>
  );
}

export function SEOHealthCard({ score, domain }: { score: number; domain: string }) {
  const tone = score >= 80 ? "text-success" : score >= 60 ? "text-warning-foreground" : "text-critical";
  const stroke = score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--critical)";
  const circumference = 2 * Math.PI * 42;
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="relative size-24 shrink-0">
        <svg viewBox="0 0 100 100" className="size-24 -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--muted)" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("tabular text-2xl font-bold", tone)}>{score}</span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">SEO Health Score</p>
        <p className="mt-1 text-lg font-semibold">{domain}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {score >= 80 ? "Healthy — maintain momentum" : score >= 60 ? "Needs attention this sprint" : "At risk — prioritise fixes"}
        </p>
      </div>
    </div>
  );
}

export function ChartCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}