"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

const AVAILABLE_COINS = 2480;

export default function BuyerAddTaskPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      taskTitle: "",
      taskDetail: "",
      requiredWorkers: 25,
      payableAmount: 8,
      completionDate: "",
      submissionInfo: "",
      taskImageUrl: "",
    },
  });

  const workers = Number(watch("requiredWorkers") || 0);
  const reward = Number(watch("payableAmount") || 0);
  const totalCost = workers * reward;
  const canAfford = totalCost <= AVAILABLE_COINS;

  function onSubmit(data) {
    const total = Number(data.requiredWorkers) * Number(data.payableAmount);

    if (total > AVAILABLE_COINS) {
      alert("Not available Coin. Purchase Coin");
      // In real app: router.push("/dashboard/buyer/purchase-coins");
      return;
    }

    console.log("New task data:", {
      ...data,
      requiredWorkers: Number(data.requiredWorkers),
      payableAmount: Number(data.payableAmount),
      totalCost: total,
      remainingCoins: AVAILABLE_COINS - total,
    });
    alert("Task data logged to console!");
  }

  return (
    <>
      <DashboardHeader
        title="Create a new task"
        subtitle="Give workers everything they need to deliver great work."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
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
                        placeholder="e.g. Watch my YouTube video and make a comment"
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

                    <div>
                      <Label htmlFor="taskDetail">Task details</Label>
                      <Textarea
                        id="taskDetail"
                        className="mt-2 min-h-36"
                        placeholder="Explain the task step by step…"
                        {...register("taskDetail", {
                          required: "Task details are required",
                          minLength: { value: 20, message: "At least 20 characters" },
                        })}
                      />
                      {errors.taskDetail && (
                        <p className="mt-1 text-xs text-danger">{errors.taskDetail.message}</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Capacity & reward */}
                <section>
                  <h3 className="mb-4 border-b border-border pb-3 text-lg font-semibold">Capacity & reward</h3>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="requiredWorkers">Required workers</Label>
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
                        {errors.requiredWorkers && (
                          <p className="mt-1 text-xs text-danger">{errors.requiredWorkers.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="payableAmount">Payable amount (coins per worker)</Label>
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
                        {errors.payableAmount && (
                          <p className="mt-1 text-xs text-danger">{errors.payableAmount.message}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="completionDate">Completion date</Label>
                      <Input
                        id="completionDate"
                        type="date"
                        className="mt-2"
                        {...register("completionDate", { required: "Deadline is required" })}
                      />
                      {errors.completionDate && (
                        <p className="mt-1 text-xs text-danger">{errors.completionDate.message}</p>
                      )}
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
                        placeholder="What to submit: screenshot, proof, etc."
                        className="mt-2"
                        {...register("submissionInfo", {
                          required: "Submission info is required",
                        })}
                      />
                      {errors.submissionInfo && (
                        <p className="mt-1 text-xs text-danger">{errors.submissionInfo.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="taskImageUrl">Task image URL (optional)</Label>
                      <Input
                        id="taskImageUrl"
                        placeholder="https://i.ibb.co/..."
                        className="mt-2"
                        {...register("taskImageUrl")}
                      />
                    </div>

                    <div className="upload-zone">
                      <Upload />
                      <b>Upload task image</b>
                      <small>Recommended 1200 × 800 px</small>
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
                    <span>Workers</span>
                    <b>{workers}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Reward each</span>
                    <b>{reward} coins</b>
                  </div>
                  <div className="flex justify-between border-t border-border pt-4 text-base">
                    <span>Total cost</span>
                    <b className="text-primary">{totalCost} coins</b>
                  </div>
                </div>
                <div
                  className={`mt-5 rounded-lg p-4 text-sm ${
                    canAfford
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  <b className="block">Available: {AVAILABLE_COINS.toLocaleString()} coins</b>
                  {canAfford
                    ? `${AVAILABLE_COINS - totalCost} coins remaining after publish.`
                    : "Purchase more coins to publish this task."}
                </div>
                <Button className="mt-5 w-full" size="lg" disabled={!canAfford || isSubmitting}>
                  {isSubmitting ? "Publishing…" : "Publish task"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </>
  );
}
