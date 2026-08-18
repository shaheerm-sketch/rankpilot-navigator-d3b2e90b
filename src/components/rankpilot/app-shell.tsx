import { useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronDown,
  FileSearch,
  FileText,
  Gauge,
  Link2,
  ListChecks,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/project/$projectId/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/project/$projectId/audit", label: "SEO Audit", icon: FileSearch },
  { to: "/project/$projectId/keywords", label: "Keywords", icon: BarChart3 },
  { to: "/project/$projectId/content", label: "Content Opportunities", icon: FileText },
  { to: "/project/$projectId/links", label: "Internal Links", icon: Link2 },
  { to: "/project/$projectId/tasks", label: "Tasks", icon: ListChecks },
  { to: "/project/$projectId/settings", label: "Settings", icon: Settings },
] as const;

export function Logo({ inverted }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </span>
      <span className={cn("text-base font-bold tracking-tight", inverted && "text-sidebar-accent-foreground")}>
        RankPilot
      </span>
    </span>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { projectId } = useParams({ from: "/project/$projectId" });
  const { projects, role, setRole } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const project = projects.find((p) => p.id === projectId);

  const sidebar = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center justify-between px-5">
        <Logo inverted />
        <button
          className="text-sidebar-foreground lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="px-3">
        <Link
          to="/projects"
          className="flex items-center justify-between rounded-xl border border-sidebar-border px-3 py-2.5 transition hover:bg-sidebar-accent"
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-sidebar-accent-foreground">
              {project?.name ?? "Select project"}
            </span>
            <span className="block truncate text-xs opacity-70">{project?.domain ?? "All projects"}</span>
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-70" />
        </Link>
      </div>
      <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            params={{ projectId }}
            onClick={() => setOpen(false)}
            activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground" }}
            inactiveProps={{ className: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition"
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-sidebar-border px-5 py-4 text-xs opacity-60">Frontend prototype</div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">{sidebar}</div>
      </aside>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72">{sidebar}</div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
              <Menu className="size-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{project?.name ?? "RankPilot"}</p>
              <p className="truncate text-xs text-muted-foreground">{project?.domain}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <Link to="/manager">
                <ShieldCheck className="size-4" /> Manager view
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pr-3 pl-1 text-sm font-medium transition hover:bg-accent">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  SK
                </span>
                <span className="hidden sm:inline">Sarah Klein</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  Sarah Klein
                  <span className="block text-xs font-normal text-muted-foreground">
                    Demo role: {role === "manager" ? "SEO Manager" : "SEO Specialist"}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setRole(role === "manager" ? "specialist" : "manager")}>
                  Switch to {role === "manager" ? "SEO Specialist" : "SEO Manager"}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate({ to: "/manager" })}>
                  <ShieldCheck className="size-4" /> Manager dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate({ to: "/projects" })}>All projects</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate({ to: "/" })}>
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}