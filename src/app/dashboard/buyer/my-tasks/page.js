"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, Plus, Calendar, Coins, Users } from "lucide-react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

export default function BuyerMyTasksPage() {
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const queryClient = useQueryClient();
  const { refetch: refetchAuth } = useAuth();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["buyerTasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tasks/buyer/my-tasks");
      return res.data?.tasks || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      await axiosSecure.put(`/tasks/${editingTask.id}`, {
        title: formData.taskTitle,
        detail: formData.taskDetail,
        submissionInfo: formData.submissionInfo,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyerTasks"] });
      setEditingTask(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId) => {
      await axiosSecure.delete(`/tasks/${taskId}`);
    },
    onSuccess: async () => {
      await refetchAuth();
      queryClient.invalidateQueries({ queryKey: ["buyerTasks"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setDeleteTask(null);
    },
  });

  function openEdit(task) {
    setEditingTask(task);
    reset({
      taskTitle: task.title,
      taskDetail: task.detail,
      submissionInfo: task.submissionInfo,
    });
  }

  const rows = tasks.map((t) => [
    <div key={t.id} className="min-w-[200px]">
      <b className="block text-sm">{t.title}</b>
      <small className="text-xs text-muted-foreground line-clamp-1">{t.detail}</small>
    </div>,
    `${t.requiredWorkers} / ${t.totalWorkers} slots`,
    `${t.payableAmount} coins`,
    new Date(t.completionDate).toLocaleDateString(),
    <StatusBadge
      key={`s-${t.id}`}
      tone={t.status === "ACTIVE" ? "success" : t.status === "COMPLETED" ? "info" : "warning"}
    >
      {t.status}
    </StatusBadge>,
    <div className="flex gap-2" key={`a-${t.id}`}>
      <Button size="icon" variant="ghost" onClick={() => openEdit(t)}>
        <Pencil className="size-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="text-danger hover:bg-danger/10"
        onClick={() => setDeleteTask(t)}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>,
  ]);

  return (
    <>
      <DashboardHeader
        title="My tasks"
        subtitle="Manage active listings and refund unused slots."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Total listings: <b>{tasks.length}</b>
          </p>
          <Button asChild>
            <Link href="/dashboard/buyer/add-task">
              <Plus className="size-4 mr-1.5" /> Create New Task
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading your tasks...</div>
        ) : (
          <DataTable
            headers={["Title", "Available Slots", "Coins Each", "Deadline", "Status", "Actions"]}
            rows={rows}
            total={tasks.length}
          />
        )}
      </main>

      {/* Edit modal */}
      {editingTask && (
        <Dialog open={true} onOpenChange={() => setEditingTask(null)}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Modify instructions and submission details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))}>
            <DialogBody className="space-y-4 py-4">
              <div>
                <Label htmlFor="taskTitle">Task Title</Label>
                <Input id="taskTitle" className="mt-1" {...register("taskTitle", { required: true })} />
              </div>
              <div>
                <Label htmlFor="taskDetail">Task Details</Label>
                <Textarea id="taskDetail" className="mt-1 min-h-24" {...register("taskDetail", { required: true })} />
              </div>
              <div>
                <Label htmlFor="submissionInfo">Submission Requirements</Label>
                <Textarea id="submissionInfo" className="mt-1" {...register("submissionInfo", { required: true })} />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      )}

      {/* Delete confirmation modal */}
      {deleteTask && (
        <Dialog open={true} onOpenChange={() => setDeleteTask(null)}>
          <DialogHeader>
            <DialogTitle>Delete Task & Refund Coins</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTask.title}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="py-4 text-sm">
            <p className="text-muted-foreground">
              Deleting this task will permanently cancel it and refund{" "}
              <b className="text-amber-500 font-bold">
                {deleteTask.requiredWorkers * deleteTask.payableAmount} coins
              </b>{" "}
              (for {deleteTask.requiredWorkers} remaining slots) back to your balance immediately.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTask(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deleteTask.id)}
            >
              {deleteMutation.isPending ? "Refunding..." : "Delete & Refund"}
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}
