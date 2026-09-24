"use client";

import { use } from "react";
import { useForm } from "react-hook-form";
import { BriefcaseBusiness, CalendarDays, Clock3, Coins, ShieldCheck, Upload, Users } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Card, CardContent } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { tasks } from "@/lib/dashboardData";

export default function TaskDetailPage({ params }) {
  const { id } = use(params);
  const task = tasks.find((t) => t.id === id) || tasks[0];

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  function onSubmit(data) {
    console.log("Submission data:", {
      taskId: task.id,
      taskTitle: task.title,
      payableAmount: task.reward,
      workerEmail: "worker@example.com",
      workerName: "Worker",
      buyerName: task.buyer,
      buyerEmail: task.buyerEmail,
      submissionDetails: data.submissionDetails,
      currentDate: new Date().toISOString(),
      status: "pending",
    });
    alert("Submission logged to console!");
  }

  return (
    <>
      <DashboardHeader
        title="Task details"
        subtitle="Review requirements and submit your proof."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* Task info */}
          <div className="space-y-6">
            <Card>
              {/* Gradient cover */}
              <div className="task-cover rounded-t-xl">
                <BriefcaseBusiness />
              </div>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge>{task.category}</StatusBadge>
                  <StatusBadge tone="success">Verified buyer</StatusBadge>
                </div>

                <h2 className="mt-4 text-2xl font-bold">{task.title}</h2>
                <p className="mt-2 text-muted-foreground">
                  {task.buyer} · 4.9 buyer rating
                </p>

                {/* Quick stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Reward</p>
                    <b className="mt-1 flex items-center gap-1 text-sm">
                      <Coins className="size-3.5 text-info" /> {task.reward} coins
                    </b>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Workers</p>
                    <b className="mt-1 flex items-center gap-1 text-sm">
                      <Users className="size-3.5" /> {task.requiredWorkers} / {task.workers}
                    </b>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <b className="mt-1 flex items-center gap-1 text-sm">
                      <CalendarDays className="size-3.5" /> {task.deadline}
                    </b>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Est. time</p>
                    <b className="mt-1 flex items-center gap-1 text-sm">
                      <Clock3 className="size-3.5" /> 12 min
                    </b>
                  </div>
                </div>

                {/* Instructions */}
                <h3 className="mt-7 font-semibold">Task instructions</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground whitespace-pre-line">
                  {task.detail}
                </p>

                {/* Submission requirements */}
                <h3 className="mt-7 font-semibold">Submission requirements</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {task.submissionInfo}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Submission form */}
          <Card className="h-fit xl:sticky xl:top-24">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">Submit your proof</h3>
              <p className="text-xs text-muted-foreground">
                Your work is securely shared with the buyer.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                <div>
                  <Label htmlFor="submissionDetails">Proof summary</Label>
                  <Textarea
                    id="submissionDetails"
                    placeholder="Describe what you completed and what you found…"
                    className="mt-2 min-h-32"
                    {...register("submissionDetails", {
                      required: "Submission details are required",
                      minLength: { value: 20, message: "At least 20 characters" },
                    })}
                  />
                  {errors.submissionDetails && (
                    <p className="mt-1 text-xs text-danger">{errors.submissionDetails.message}</p>
                  )}
                </div>

                <div className="upload-zone">
                  <Upload />
                  <b>Add screenshots</b>
                  <small>PNG, JPG, or PDF up to 10 MB</small>
                </div>

                <Button className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting…" : "Submit for review"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  <ShieldCheck className="mr-1 inline size-3" />
                  Protected by TaskMint review
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
