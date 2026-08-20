import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  auditIssues as seedIssues,
  contentOpportunities as seedContent,
  keywords as seedKeywords,
  linkOpportunities as seedLinks,
  tasks as seedTasks,
  type AuditIssue,
  type ContentOpportunity,
  type Keyword,
  type LinkOpportunity,
  type Priority,
  type Project,
  type Task,
  type TaskStatus,
} from "./mock-data";

type NewProject = { name: string; domain: string; description: string };
type NewTask = {
  projectId: string;
  title: string;
  description: string;
  priority: Priority;
  assignee: string;
  dueDate: string;
  source?: Task["source"];
};

type Store = {
  projects: Project[];
  projectsLoading: boolean;
  issues: AuditIssue[];
  keywords: Keyword[];
  content: ContentOpportunity[];
  links: LinkOpportunity[];
  tasks: Task[];
  role: "specialist" | "manager";
  setRole: (r: "specialist" | "manager") => void;
  addProject: (p: NewProject) => Promise<Project | null>;
  updateProject: (id: string, p: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  resolveIssue: (id: string) => void;
  completeContent: (id: string, completed: boolean) => void;
  setLinkStatus: (id: string, status: LinkOpportunity["status"]) => void;
  addTask: (t: NewTask) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  reviewTask: (id: string, approve: boolean) => void;
};

const StoreContext = createContext<Store | null>(null);

const slug = () => Math.random().toString(36).slice(2, 8);

type ProjectRow = {
  id: string;
  name: string;
  domain: string;
  description: string;
  health: number;
  open_issues: number;
  keyword_opportunities: number;
  content_opportunities: number;
  link_opportunities: number;
  status: string;
  updated_at: string;
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    domain: row.domain,
    description: row.description ?? "",
    health: row.health,
    openIssues: row.open_issues,
    keywordOpportunities: row.keyword_opportunities,
    contentOpportunities: row.content_opportunities,
    linkOpportunities: row.link_opportunities,
    lastUpdated: relativeTime(row.updated_at),
    status: (["active", "crawling", "needs-attention"].includes(row.status)
      ? row.status
      : "crawling") as Project["status"],
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [issues, setIssues] = useState<AuditIssue[]>(seedIssues);
  const [keywordList] = useState<Keyword[]>(seedKeywords);
  const [content, setContent] = useState<ContentOpportunity[]>(seedContent);
  const [links, setLinks] = useState<LinkOpportunity[]>(seedLinks);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [role, setRole] = useState<"specialist" | "manager">("specialist");

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setProjects([]);
      setProjectsLoading(false);
      return;
    }
    setProjectsLoading(true);
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error("[projects] load failed", error.message);
        setProjects(((data ?? []) as ProjectRow[]).map(toProject));
        setProjectsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const addProject = useCallback(
    async (p: NewProject) => {
      if (!user) throw new Error("You must be signed in to create a project.");
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: p.name,
          domain: p.domain.replace(/^https?:\/\//, "").replace(/\/$/, ""),
          description: p.description,
          status: "crawling",
        })
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      const project = toProject(data as ProjectRow);
      setProjects((prev) => [project, ...prev]);
      return project;
    },
    [user],
  );

  const updateProject = useCallback(async (id: string, patch: Partial<Project>) => {
    const row: Record<string, unknown> = {};
    if (patch.name !== undefined) row["name"] = patch.name;
    if (patch.domain !== undefined) row["domain"] = patch.domain;
    if (patch.description !== undefined) row["description"] = patch.description;
    if (patch.health !== undefined) row["health"] = patch.health;
    if (patch.status !== undefined) row["status"] = patch.status;
    const { error } = await supabase.from("projects").update(row).eq("id", id);
    if (error) throw new Error(error.message);
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch, lastUpdated: "Just now" } : p)));
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resolveIssue = useCallback((id: string) => {
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, status: "resolved" } : i)));
  }, []);

  const completeContent = useCallback((id: string, completed: boolean) => {
    setContent((prev) => prev.map((c) => (c.id === id ? { ...c, completed } : c)));
  }, []);

  const setLinkStatus = useCallback((id: string, status: LinkOpportunity["status"]) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }, []);

  const addTask = useCallback((t: NewTask) => {
    setTasks((prev) => [
      {
        id: `tk-${slug()}`,
        projectId: t.projectId,
        title: t.title,
        description: t.description,
        source: t.source ?? "Manual",
        priority: t.priority,
        assignee: t.assignee,
        status: "todo",
        dueDate: t.dueDate,
      },
      ...prev,
    ]);
  }, []);

  const setTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status, awaitingReview: status === "completed" ? true : false, completedBy: status === "completed" ? t.assignee : undefined }
          : t,
      ),
    );
  }, []);

  const reviewTask = useCallback((id: string, approve: boolean) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, awaitingReview: false, status: approve ? "completed" : "in-progress" } : t,
      ),
    );
  }, []);

  const value = useMemo<Store>(
    () => ({
      projects,
      projectsLoading,
      issues,
      keywords: keywordList,
      content,
      links,
      tasks,
      role,
      setRole,
      addProject,
      updateProject,
      deleteProject,
      resolveIssue,
      completeContent,
      setLinkStatus,
      addTask,
      setTaskStatus,
      reviewTask,
    }),
    [
      projects,
      projectsLoading,
      issues,
      keywordList,
      content,
      links,
      tasks,
      role,
      addProject,
      updateProject,
      deleteProject,
      resolveIssue,
      completeContent,
      setLinkStatus,
      addTask,
      setTaskStatus,
      reviewTask,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useProject(projectId: string) {
  const { projects } = useStore();
  return projects.find((p) => p.id === projectId);
}