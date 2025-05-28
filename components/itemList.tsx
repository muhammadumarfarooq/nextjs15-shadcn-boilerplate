"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ItemFormData } from "@/lib/validation/itemSchema";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle2, Clock3 } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";

type Task = ItemFormData & { id: string; status: "completed" | "pending" };

export default function ItemList({ refreshKey }: { refreshKey: number }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase.from("tasks").select("*");

      if (error) {
        toast.error("Failed to fetch tasks");
      } else {
        setTasks(data || []);
      }
    }

    fetchTasks();
  }, [refreshKey, refresh]);

  const handleDelete = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      toast.error("Failed to delete task");
    } else {
      toast.success("Task deleted");
      setRefresh((r) => r + 1);
    }
  };

  const handleEditOpen = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const handleEditSave = async () => {
    if (!editingTask) return;
    setIsLoading(true);

    const { error } = await supabase
      .from("tasks")
      .update({ title: editTitle, description: editDescription })
      .eq("id", editingTask.id);

    setIsLoading(false);

    if (error) {
      toast.error("Failed to update task");
    } else {
      toast.success("Task updated");
      setEditingTask(null);
      setRefresh((r) => r + 1);
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", task.id);

    if (error) {
      toast.error("Failed to update task status");
    } else {
      toast.success(`Marked as ${newStatus}`);
      setRefresh((r) => r + 1);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tasks yet.</p>
      ) : (
        <TooltipProvider>
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="bg-white shadow-sm hover:shadow-md transition"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {task.title}
                    </CardTitle>
                    {task.description && (
                      <CardDescription className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            task.status === "completed"
                              ? "secondary"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleTaskStatus(task)}
                        >
                          {task.status === "completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock3 className="h-4 w-4 text-yellow-500" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {task.status === "completed"
                          ? "Mark as Pending"
                          : "Mark as Completed"}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditOpen(task)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Task</TooltipContent>
                    </Tooltip>

                    <AlertDialog>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Delete Task</TooltipContent>
                      </Tooltip>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the task.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(task.id)}
                          >
                            Yes
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4" />
            </Card>
          ))}
        </TooltipProvider>
      )}

      <Dialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the title or description of your task below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm"
              placeholder="Title"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm"
              placeholder="Description"
              rows={4}
            />
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setEditingTask(null)}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleEditSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
