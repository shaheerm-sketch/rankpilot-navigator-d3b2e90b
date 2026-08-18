import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/project/$projectId/audit")({
  component: () => <Outlet />,
});