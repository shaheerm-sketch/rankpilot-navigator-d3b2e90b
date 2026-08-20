import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Globe, MoreHorizontal, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/rankpilot/create-task-dialog";
import { EmptyState } from "@/components/rankpilot/states";
import { Logo } from "@/components/rankpilot/app-shell";
import { useStore } from "@/lib/store";
import type { Project } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — RankPilot" },
      { name: "description", content: "All websites you manage in RankPilot, with SEO health and open work." },
      { property: "og:title", content: "Projects — RankPilot" },
      { property: "og:description", content: "All websites you manage in RankPilot, with SEO health and open work." },
    ],
  }),
  component: ProjectsPage,
});

const statusStyles: Record<Project["status"], string> = {
  active: "bg-success-soft text-success",
  crawling: "bg-info-soft text-primary",
  "needs-attention": "bg-warning-soft text-warning-foreground",
};
const statusLabels: Record<Project["status"], string> = {
  active: "Active",
  crawling: "Crawling",
  "needs-attention": "Needs attention",
};

function ProjectsPage() {
  const { projects, projectsLoading, addProject, updateProject, deleteProject } = useStore();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openCreate = () => {
    setEditing(null);
    setName("");
    setUrl("");
    setDescription("");
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setName(p.name);
    setUrl(p.domain);
    setDescription(p.description);
    setErrors({});
    setFormOpen(true);
  };

  const save = async () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next["name"] = "Project name is required.";
    if (!url.trim()) next["url"] = "Website URL is required.";
    else if (!/^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/.*)?$/i.test(url.trim()))
      next["url"] = "Invalid website URL.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      if (editing) {
        await updateProject(editing.id, {
          name: name.trim(),
          domain: url.trim().replace(/^https?:\/\//, "").replace(/\/$/, ""),
          description: description.trim(),
        });
        toast.success("Project updated");
      } else {
        await addProject({ name: name.trim(), domain: url.trim(), description: description.trim() });
        toast.success("Project created", { description: "Saved to your account." });
      }
      setFormOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteProject(pendingDelete.id);
      toast.success(`${pendingDelete.name} deleted`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete project");
    }
    setPendingDelete(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/manager">
                <ShieldCheck className="size-4" /> Manager view
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1 text-sm font-medium hover:bg-accent">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  SK
                </span>
                <span className="hidden sm:inline">Sarah Klein</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => navigate({ to: "/manager" })}>Manager dashboard</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate({ to: "/" })}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {projects.length} website{projects.length === 1 ? "" : "s"} under management.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Create Project
          </Button>
        </div>

        {projectsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            message="Create your first project to start tracking SEO opportunities."
            icon={<Globe className="size-5" />}
            action={
              <Button onClick={openCreate}>
                <Plus className="size-4" /> Create Project
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((p) => (
              <article
                key={p.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:shadow-pop"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold">{p.name}</h2>
                    <p className="truncate text-sm text-muted-foreground">{p.domain}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={`Actions for ${p.name}`}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => openEdit(p)}>
                        <Pencil className="size-4" /> Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onSelect={() => setPendingDelete(p)}>
                        <Trash2 className="size-4" /> Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="tabular text-3xl font-bold">{p.health}</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground">SEO health score</p>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          p.health >= 80 ? "bg-success" : p.health >= 60 ? "bg-warning" : "bg-critical",
                        )}
                        style={{ width: `${p.health}%` }}
                      />
                    </div>
                  </div>
                </div>

                <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
                  <div>
                    <dt className="text-[11px] text-muted-foreground">Open issues</dt>
                    <dd className="tabular text-lg font-semibold text-critical">{p.openIssues}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-muted-foreground">Keywords</dt>
                    <dd className="tabular text-lg font-semibold">{p.keywordOpportunities}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-muted-foreground">Content</dt>
                    <dd className="tabular text-lg font-semibold">{p.contentOpportunities}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-center justify-between gap-2 text-xs">
                  <span className={cn("rounded-full px-2.5 py-1 font-semibold", statusStyles[p.status])}>
                    {statusLabels[p.status]}
                  </span>
                  <span className="text-muted-foreground">Updated {p.lastUpdated}</span>
                </div>

                <Button className="mt-5 w-full" asChild>
                  <Link to="/project/$projectId/dashboard" params={{ projectId: p.id }}>
                    Open Project
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </main>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit project" : "Create project"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update project details." : "Add a website to track SEO opportunities."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="p-name">Project name</Label>
              <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
              <FieldError message={errors["name"]} />
            </div>
            <div>
              <Label htmlFor="p-url">Website URL</Label>
              <Input
                id="p-url"
                value={url}
                placeholder="acmedigital.com"
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1.5"
              />
              <FieldError message={errors["url"]} />
            </div>
            <div>
              <Label htmlFor="p-desc">Description</Label>
              <Textarea
                id="p-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pendingDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}