import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/rankpilot/app-shell";
import { EmptyState } from "@/components/rankpilot/states";
import { Button } from "@/components/ui/button";
import { useProject, useStore } from "@/lib/store";

export const Route = createFileRoute("/project/$projectId")({
  component: ProjectLayout,
});

function ProjectLayout() {
  const { projectId } = Route.useParams();
  const project = useProject(projectId);
  const { projectsLoading } = useStore();

  if (projectsLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <div className="h-40 animate-pulse rounded-2xl border border-border bg-card" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="Project not found"
          message="This project may have been deleted in this prototype session."
          action={
            <Button asChild>
              <Link to="/projects">Back to Projects</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}