"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";

export default function AdminTasksPage() {
  const [deleteTask, setDeleteTask] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminTasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tasks?limit=50");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTasks"] });
      setDeleteTask(null);
    },
  });

  const tasks = data?.tasks || [];

  const rows = tasks.map((t) => [
    <div key={t.id} className="min-w-[200px]">
      <b className="block text-sm">{t.title}</b>
      <small className="text-xs text-muted-foreground line-clamp-1">{t.detail}</small>
    </div>,
    t.buyer?.fullName || "Buyer",
    `${t.requiredWorkers} / ${t.totalWorkers}`,
    `${t.payableAmount} coins`,
    new Date(t.completionDate).toLocaleDateString(),
    <StatusBadge key={`s-${t.id}`} tone={t.status === "ACTIVE" ? "success" : "warning"}>
      {t.status}
    </StatusBadge>,
    <Button
      key={`b-${t.id}`}
      size="icon"
      variant="ghost"
      aria-label="Delete task"
      onClick={() => setDeleteTask(t)}
    >
      <Trash2 className="size-4 text-danger" />
    </Button>,
  ]);

  return (
    <>
      <DashboardHeader
        title="Manage tasks"
        subtitle="Monitor quality and remove problematic marketplace listings."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading tasks...</div>
        ) : (
          <DataTable
            headers={["Task", "Buyer", "Slots", "Reward", "Deadline", "Status", "Actions"]}
            rows={rows}
            total={tasks.length}
          />
        )}
      </main>

      {/* Delete Dialog */}
      {deleteTask && (
        <Dialog open={true} onOpenChange={() => setDeleteTask(null)}>
          <DialogHeader>
            <DialogTitle>Admin Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTask.title}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTask(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deleteTask.id)}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Task"}
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}
