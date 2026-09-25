"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, AlertCircle, Coins, CheckCircle2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { axiosSecure } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function BuyerAddTaskPage() {
  const router = useRouter();
  const { user, refetch } = useAuth();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const availableCoins = user?.coins ?? 0;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      taskTitle: "",
      taskDetail: "",
      requiredWorkers: 20,
      payableAmount: 10,
      completionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      submissionInfo: "Provide screenshot proof of completed task.",
      taskLink: "",
      taskImageUrl: "",
      category: "General",
    },
  });

  const workers = Number(watch("requiredWorkers") || 0);
  const reward = Number(watch("payableAmount") || 0);
  const totalCost = workers * reward;
  const canAfford = totalCost <= availableCoins;

  async function onSubmit(data) {
    setErrorMsg("");
    setSuccessMsg("");

    if (!canAfford) {
      setErrorMsg(`Insufficient coins. You need ${totalCost} coins but have ${availableCoins}. Please purchase more coins.`);
      return;
    }

    try {
      const res = await axiosSecure.post("/tasks", {
        title: data.taskTitle,
        detail: data.taskDetail,
        taskLink: data.taskLink || null,
        requiredWorkers: Number(data.requiredWorkers),
        payableAmount: Number(data.payableAmount),
        completionDate: data.completionDate,
        submissionInfo: data.submissionInfo,
        imageUrl: data.taskImageUrl || null,
        category: data.category || "General",
      });

      if (res.data?.success) {
        setSuccessMsg("Task published successfully! Coins have been deducted.");
        await refetch();
        queryClient.invalidateQueries({ queryKey: ["buyerTasks"] });
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        queryClient.invalidateQueries({ queryKey: ["buyerStats"] });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        setTimeout(() => {
          router.push("/dashboard/buyer/my-tasks");
        }, 1200);
      }
    } catch (err) {
      console.error("Task creation error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to create task.");
    }
  }

  return (
    <>
      <DashboardHeader
        title="Create a new task"
        subtitle="Give workers everything they need to deliver great work."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        {errorMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-danger/10 p-4 text-sm text-danger border border-danger/20">
            <AlertCircle className="size-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-success/10 p-4 text-sm text-success border border-success/20">
            <CheckCircle2 className="size-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            {/* Form */}
            <Card>
              <CardContent className="space-y-6 p-6">
                {/* Task basics */}
                <section>
                  <h3 className="mb-4 border-b border-border pb-3 text-lg font-semibold">Task basics</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="taskTitle">Task title</Label>
                      <Input
                        id="taskTitle"
                        placeholder="e.g. Watch our tutorial and leave constructive feedback"
                        className="mt-2"
                        {...register("taskTitle", {
                          required: "Task title is required",
                          minLength: { value: 5, message: "At least 5 characters" },
                        })}
                      />
                      {errors.taskTitle && (
                        <p className="mt-1 text-xs text-danger">{errors.taskTitle.message}</p>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          placeholder="Testing, Social Media, Survey, etc."
                          className="mt-2"
                          {...register("category")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="completionDate">Completion deadline</Label>
                        <Input
                          id="completionDate"
                          type="date"
                          className="mt-2"
                          {...register("completionDate", { required: "Deadline is required" })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="taskDetail">Task details</Label>
                      <Textarea
                        id="taskDetail"
                        className="mt-2 min-h-36"
                        placeholder="Explain the step-by-step instructions clearly for workers..."
                        {...register("taskDetail", {
                          required: "Task details are required",
                          minLength: { value: 20, message: "At least 20 characters" },
                        })}
                      />
                      {errors.taskDetail && (
                        <p className="mt-1 text-xs text-danger">{errors.taskDetail.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="taskLink">Task Link / Target URL (where workers go)</Label>
                      <Input
                        id="taskLink"
                        type="url"
                        placeholder="https://youtube.com/watch?v=... or https://example.com/survey"
                        className="mt-2"
                        {...register("taskLink")}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Provide the direct URL workers should visit to execute this task (YouTube video, website, survey form, etc.).
                      </p>
                    </div>
                  </div>
                </section>

                {/* Capacity & reward */}
                <section>
                  <h3 className="mb-4 border-b border-border pb-3 text-lg font-semibold">Capacity & reward</h3>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="requiredWorkers">Required workers (slots)</Label>
                        <Input
                          id="requiredWorkers"
                          type="number"
                          min="1"
                          className="mt-2"
                          {...register("requiredWorkers", {
                            required: "Required",
                            min: { value: 1, message: "At least 1" },
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="payableAmount">Coins per worker</Label>
                        <Input
                          id="payableAmount"
                          type="number"
                          min="1"
                          className="mt-2"
                          {...register("payableAmount", {
                            required: "Required",
                            min: { value: 1, message: "At least 1" },
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Proof requirements */}
                <section>
                  <h3 className="mb-4 border-b border-border pb-3 text-lg font-semibold">Proof requirements</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="submissionInfo">Submission requirements</Label>
                      <Textarea
                        id="submissionInfo"
                        placeholder="What proof does the worker need to provide? (e.g. Screenshot URL, transaction ID)"
                        className="mt-2"
                        {...register("submissionInfo", {
                          required: "Submission info is required",
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="taskImageUrl">Task banner image URL (optional)</Label>
                      <Input
                        id="taskImageUrl"
                        placeholder="https://images.unsplash.com/..."
                        className="mt-2"
                        {...register("taskImageUrl")}
                      />
                    </div>
                  </div>
                </section>
              </CardContent>
            </Card>

            {/* Cost summary sidebar */}
            <Card className="h-fit xl:sticky xl:top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">Cost summary</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Required workers</span>
                    <b>{workers}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Reward per worker</span>
                    <b>{reward} coins</b>
                  </div>
                  <div className="flex justify-between border-t border-border pt-4 text-base">
                    <span>Total cost</span>
                    <b className="text-primary font-bold">{totalCost} coins</b>
                  </div>
                </div>
                <div
                  className={`mt-5 rounded-lg p-4 text-sm ${
                    canAfford
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  <b className="block">Your Balance: {availableCoins.toLocaleString()} coins</b>
                  {canAfford
                    ? `${(availableCoins - totalCost).toLocaleString()} coins will remain after publishing.`
                    : "Insufficient coins. Go to 'Purchase coins' to top up."}
                </div>
                <Button className="mt-5 w-full" size="lg" disabled={!canAfford || isSubmitting}>
                  {isSubmitting ? "Publishing..." : "Publish Task Now"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </>
  );
}
