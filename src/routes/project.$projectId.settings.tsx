import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/rankpilot/app-shell";
import { FieldError } from "@/components/rankpilot/create-task-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import { assignees } from "@/lib/mock-data";
import { useProject, useStore } from "@/lib/store";

export const Route = createFileRoute("/project/$projectId/settings")({
  head: () => ({
    meta: [
      { title: "Project Settings — RankPilot" },
      { name: "description", content: "Manage project details, crawl preferences and team access." },
      { property: "og:title", content: "Project Settings — RankPilot" },
      { property: "og:description", content: "Manage project details, crawl preferences and team access." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  const { updateProject, deleteProject, role, setRole } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [weeklyCrawl, setWeeklyCrawl] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDomain(project.domain);
      setDescription(project.description);
    }
  }, [project?.id, project?.name, project?.domain, project?.description]);

  if (!project) return null;

  const save = async () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next["name"] = "Project name is required.";
    if (!domain.trim()) next["domain"] = "Domain is required.";
    setErrors(next);
    if (Object.keys(next).length) return;
    try {
      await updateProject(project.id, {
        name: name.trim(),
        domain: domain.trim(),
        description: description.trim(),
      });
      toast.success("Settings saved", { description: "Project details updated." });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save settings");
    }
  };

  return (
    <div>
      <PageHeader title="Project Settings" description="Manage this project's details and team." />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <h2 className="text-base font-semibold">Project details</h2>
          <div>
            <Label htmlFor="p-name">Project name</Label>
            <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
            <FieldError message={errors["name"]} />
          </div>
          <div>
            <Label htmlFor="p-domain">Domain</Label>
            <Input id="p-domain" value={domain} onChange={(e) => setDomain(e.target.value)} className="mt-1.5" />
            <FieldError message={errors["domain"]} />
          </div>
          <div>
            <Label htmlFor="p-desc">Description</Label>
            <Textarea id="p-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5" />
          </div>
          <Button onClick={save}>Save changes</Button>
        </section>

        <div className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-base font-semibold">Preferences</h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Weekly crawl</p>
                <p className="text-xs text-muted-foreground">Re-scan the site every Monday.</p>
              </div>
              <Switch checked={weeklyCrawl} onCheckedChange={setWeeklyCrawl} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Email alerts</p>
                <p className="text-xs text-muted-foreground">Notify on new critical issues.</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Manager role</p>
                <p className="text-xs text-muted-foreground">Demo role: {role === "manager" ? "SEO Manager" : "SEO Specialist"}</p>
              </div>
              <Switch checked={role === "manager"} onCheckedChange={(v) => setRole(v ? "manager" : "specialist")} />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-base font-semibold">Team</h2>
            <ul className="mt-3 space-y-2">
              {assignees.map((a) => (
                <li key={a} className="flex items-center gap-3 rounded-xl bg-muted px-3 py-2 text-sm">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {a.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-critical/30 bg-critical-soft p-6">
            <h2 className="text-base font-semibold text-critical">Danger zone</h2>
            <p className="mt-1 text-sm text-muted-foreground">Deleting removes the project from this prototype session.</p>
            <Button variant="destructive" className="mt-4" onClick={() => setConfirmOpen(true)}>
              Delete project
            </Button>
          </section>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{project.name}"?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes the project from your account.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  await deleteProject(project.id);
                  toast.success("Project deleted", { description: project.name });
                  navigate({ to: "/projects" });
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Could not delete project");
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}