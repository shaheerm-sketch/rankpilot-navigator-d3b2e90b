import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignees, type Priority, type Task } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export type TaskPrefill = {
  title?: string;
  description?: string;
  priority?: Priority;
  source?: Task["source"];
};

export function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-critical">{message}</p>;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  projectId,
  prefill,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  projectId: string;
  prefill?: TaskPrefill;
}) {
  const { addTask } = useStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [assignee, setAssignee] = useState(assignees[0]!);
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setTitle(prefill?.title ?? "");
      setDescription(prefill?.description ?? "");
      setPriority(prefill?.priority ?? "medium");
      setAssignee(assignees[0]!);
      setDueDate("");
      setErrors({});
    }
  }, [open, prefill?.title, prefill?.description, prefill?.priority]);

  const submit = () => {
    const next: Record<string, string> = {};
    if (!title.trim()) next["title"] = "Task title is required.";
    if (!dueDate) next["dueDate"] = "Due date is required.";
    setErrors(next);
    if (Object.keys(next).length) return;
    addTask({
      projectId,
      title: title.trim(),
      description: description.trim(),
      priority,
      assignee,
      dueDate,
      ...(prefill?.source ? { source: prefill.source } : {}),
    });
    toast.success("Task created", { description: `"${title.trim()}" added to Tasks as To Do.` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create SEO task</DialogTitle>
          <DialogDescription>
            {prefill?.source ? `Sourced from ${prefill.source}.` : "Add a task to the project backlog."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-title">Task title</Label>
            <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" />
            <FieldError message={errors["title"]} />
          </div>
          <div>
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1.5"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assignee</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assignees.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="task-due">Due date</Label>
            <Input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1.5"
            />
            <FieldError message={errors["dueDate"]} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}