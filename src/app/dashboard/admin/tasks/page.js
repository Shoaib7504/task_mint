"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { tasks } from "@/lib/dashboardData";

export default function AdminTasksPage() {
  const [deleteTask, setDeleteTask] = useState(null);

  function handleDelete(task) {
    console.log("Admin delete task:", { taskId: task.id, title: task.title });
    alert(`Task "${task.title}" deleted. Logged to console.`);
    setDeleteTask(null);
  }

  const rows = tasks.map((t, i) => [
    t.title,
    t.buyer,
    `${t.requiredWorkers} / ${t.workers}`,
    `${t.reward} coins`,
    t.deadline,
    <StatusBadge key={`s${i}`} tone={t.status === "paused" ? "warning" : "success"}>
      {t.status === "paused" ? "Review" : "Active"}
    </StatusBadge>,
    <Button
      key={`b${i}`}
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
        subtitle="Monitor quality and marketplace activity."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        <DataTable
          headers={["Task", "Buyer", "Workers", "Reward", "Deadline", "Status", "Actions"]}
          rows={rows}
          total={tasks.length}
        />

        {/* Delete confirmation */}
        <Dialog open={!!deleteTask} onClose={() => setDeleteTask(null)}>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogDescription>
              This will permanently remove <b>"{deleteTask?.title}"</b> from the marketplace.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTask(null)}>Cancel</Button>
            <Button
              className="bg-danger text-white hover:bg-danger/90"
              onClick={() => handleDelete(deleteTask)}
            >
              <Trash2 className="size-4" /> Delete
            </Button>
          </DialogFooter>
        </Dialog>
      </main>
    </>
  );
}
