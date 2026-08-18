import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  auditIssues as seedIssues,
  contentOpportunities as seedContent,
  keywords as seedKeywords,
  linkOpportunities as seedLinks,
  projects as seedProjects,
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
  issues: AuditIssue[];
  keywords: Keyword[];
  content: ContentOpportunity[];
  links: LinkOpportunity[];
  tasks: Task[];
  role: "specialist" | "manager";
  setRole: (r: "specialist" | "manager") => void;
  addProject: (p: NewProject) => void;
  updateProject: (id: string, p: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  resolveIssue: (id: string) => void;
  completeContent: (id: string, completed: boolean) => void;
  setLinkStatus: (id: string, status: LinkOpportunity["status"]) => void;
  addTask: (t: NewTask) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  reviewTask: (id: string, approve: boolean) => void;
};

const StoreContext = createContext<Store | null>(null);

const slug = () => Math.random().toString(36).slice(2, 8);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [issues, setIssues] = useState<AuditIssue[]>(seedIssues);
  const [keywordList] = useState<Keyword[]>(seedKeywords);
  const [content, setContent] = useState<ContentOpportunity[]>(seedContent);
  const [links, setLinks] = useState<LinkOpportunity[]>(seedLinks);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [role, setRole] = useState<"specialist" | "manager">("specialist");

  const addProject = useCallback((p: NewProject) => {
    setProjects((prev) => [
      {
        id: `proj-${slug()}`,
        name: p.name,
        domain: p.domain.replace(/^https?:\/\//, "").replace(/\/$/, ""),
        description: p.description,
        health: 0,
        openIssues: 0,
        keywordOpportunities: 0,
        contentOpportunities: 0,
        linkOpportunities: 0,
        lastUpdated: "Just now",
        status: "crawling",
      },
      ...prev,
    ]);
  }, []);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch, lastUpdated: "Just now" } : p)));
  }, []);

  const deleteProject = useCallback((id: string) => {
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