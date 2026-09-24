"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, Pencil, Trash2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { tasks } from "@/lib/dashboardData";

export default function BuyerMyTasksPage() {
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  function openEdit(task) {
    setEditingTask(task);
    reset({
      taskTitle: task.title,
      taskDetail: task.detail,
      submissionInfo: task.submissionInfo,
    });
  }

  function onUpdate(data) {
    console.log("Update task:", { taskId: editingTask.id, ...data });
    alert("Update logged to console!");
    setEditingTask(null);
  }

  function onDelete(task) {
    const refillAmount = task.requiredWorkers * task.reward;
    console.log("Delete task:", {
      taskId: task.id,
      refillAmount,
      message: `Refill ${refillAmount} coins to buyer`,
    });
    alert(`Task deleted! ${refillAmount} coins refilled. Logged to console.`);
    setDeleteTask(null);
  }

  const rows = tasks.map((t, i) => [
    t.title,
    `${t.requiredWorkers} / ${t.workers}`,
    `${t.reward} coins`,
    t.deadline,
    <StatusBadge key={`s${i}`} tone={t.status === "paused" ? "warning" : "success"}>
      {t.status === "paused" ? "Paused" : "Active"}
    </StatusBadge>,
    <div className="flex gap-1" key={`a${i}`}>
      <Button size="icon" variant="ghost" aria-label="View">
        <Eye className="size-4" />
      </Button>
      <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => openEdit(t)}>
        <Pencil className="size-4" />
      </Button>
      <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setDeleteTask(t)}>
        <Trash2 className="size-4 text-danger" />
      </Button>
    </div>,
  ]);

  return (
    <>
      <DashboardHeader
        title="My tasks"
        subtitle="Manage performance, deadlines, and worker capacity."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        <DataTable
          headers={["Task", "Workers", "Reward", "Deadline", "Status", "Actions"]}
          rows={rows}
          total={tasks.length}
        />

        {/* Edit dialog */}
        <Dialog open={!!editingTask} onClose={() => setEditingTask(null)}>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>Update the title, details, or submission requirements.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onUpdate)}>
            <DialogBody>
              <div>
                <Label htmlFor="editTitle">Task title</Label>
                <Input id="editTitle" className="mt-1" {...register("taskTitle", { required: "Required" })} />
                {errors.taskTitle && <p className="mt-1 text-xs text-danger">{errors.taskTitle.message}</p>}
              </div>
              <div>
                <Label htmlFor="editDetail">Task details</Label>
                <Textarea id="editDetail" className="mt-1 min-h-24" {...register("taskDetail", { required: "Required" })} />
              </div>
              <div>
                <Label htmlFor="editSubmission">Submission requirements</Label>
                <Textarea id="editSubmission" className="mt-1" {...register("submissionInfo")} />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setEditingTask(null)}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Dialog>

        {/* Delete confirmation dialog */}
        <Dialog open={!!deleteTask} onClose={() => setDeleteTask(null)}>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogDescription>
              This will remove the task and refill{" "}
              <b>{deleteTask ? deleteTask.requiredWorkers * deleteTask.reward : 0} coins</b> for uncompleted work.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTask(null)}>Cancel</Button>
            <Button
              className="bg-danger text-white hover:bg-danger/90"
              onClick={() => onDelete(deleteTask)}
            >
              <Trash2 className="size-4" /> Delete
            </Button>
          </DialogFooter>
        </Dialog>
      </main>
    </>
  );
}
