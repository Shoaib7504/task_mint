"use client";

import { useState } from "react";
import { CheckCircle2, FileCheck2, XCircle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Card, CardContent } from "@/components/ui/Card";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { submissions } from "@/lib/dashboardData";

export default function BuyerReviewPage() {
  const [viewSubmission, setViewSubmission] = useState(null);
  const pendingSubmissions = submissions.filter((s) => s.status === "pending");

  function handleApprove(submission) {
    console.log("Approve submission:", {
      submissionId: submission.id,
      action: "approve",
      workerEmail: submission.workerEmail,
      payableAmount: submission.payableAmount,
      message: `Increase ${submission.payableAmount} coins for ${submission.workerName}`,
    });
    alert(`Approved! ${submission.payableAmount} coins sent to ${submission.workerName}. Logged to console.`);
    setViewSubmission(null);
  }

  function handleReject(submission) {
    console.log("Reject submission:", {
      submissionId: submission.id,
      action: "reject",
      message: "Status changed to rejected. required_workers increased by 1.",
    });
    alert(`Rejected. required_workers increased by 1. Logged to console.`);
    setViewSubmission(null);
  }

  return (
    <>
      <DashboardHeader
        title="Submission review"
        subtitle="Review proof and reward great work."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        {pendingSubmissions.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <CheckCircle2 className="mx-auto size-12 text-success/40" />
            <p className="mt-3 text-lg font-semibold">All caught up!</p>
            <p className="text-sm">No pending submissions to review.</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {pendingSubmissions.map((sub) => (
              <Card key={sub.id}>
                <CardContent className="p-5">
                  {/* Worker header */}
                  <div className="flex items-center gap-3">
                    <div className="avatar-sm">
                      {sub.workerName
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <b className="text-sm">{sub.workerName}</b>
                      <p className="text-xs text-muted-foreground">
                        Submitted {sub.date}
                      </p>
                    </div>
                    <StatusBadge tone="warning">Pending</StatusBadge>
                  </div>

                  {/* Task info */}
                  <h3 className="mt-5 font-semibold">{sub.taskTitle}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {sub.submissionDetails}
                  </p>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <b className="text-success">{sub.payableAmount} coins</b>
                    <Button onClick={() => setViewSubmission(sub)}>
                      Review proof
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review dialog */}
        <Dialog open={!!viewSubmission} onClose={() => setViewSubmission(null)}>
          <DialogHeader>
            <DialogTitle>Submission from {viewSubmission?.workerName}</DialogTitle>
            <DialogDescription>
              Review the worker's proof before making a decision.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="proof-preview">
              <FileCheck2 />
              <span>submission-proof.png</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {viewSubmission?.submissionDetails}
            </p>
            <div className="flex justify-between rounded-lg bg-surface p-3 text-sm">
              <span>Payable amount</span>
              <b className="text-success">{viewSubmission?.payableAmount} coins</b>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleReject(viewSubmission)}>
              <XCircle className="size-4" /> Reject
            </Button>
            <Button variant="success" onClick={() => handleApprove(viewSubmission)}>
              <CheckCircle2 className="size-4" /> Approve & pay
            </Button>
          </DialogFooter>
        </Dialog>
      </main>
    </>
  );
}
