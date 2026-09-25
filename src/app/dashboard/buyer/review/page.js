"use client";

import { useState } from "react";
import { CheckCircle2, FileCheck2, XCircle, Clock, User, Coins, ExternalLink, Image as ImageIcon } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Card, CardContent } from "@/components/ui/Card";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import { parseProof } from "@/lib/imageUtils";

export default function BuyerReviewPage() {
  const [viewSubmission, setViewSubmission] = useState(null);
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["buyerReviews"],
    queryFn: async () => {
      const res = await axiosSecure.get("/submissions/buyer/reviews?status=PENDING");
      return res.data?.submissions || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/submissions/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyerReviews"] });
      queryClient.invalidateQueries({ queryKey: ["buyerStats"] });
      setViewSubmission(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/submissions/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyerReviews"] });
      queryClient.invalidateQueries({ queryKey: ["buyerStats"] });
      setViewSubmission(null);
    },
  });

  return (
    <>
      <DashboardHeader
        title="Submission review"
        subtitle="Review proof submitted by workers and release rewards."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground">Loading pending submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <CheckCircle2 className="mx-auto size-12 text-success/40" />
            <p className="mt-3 text-lg font-semibold">All caught up!</p>
            <p className="text-sm">No pending submissions awaiting your review.</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {submissions.map((sub) => (
              <Card key={sub.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-base">{sub.task?.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <User className="size-3.5" />
                        Submitted by: <b>{sub.worker?.fullName || sub.worker?.email}</b>
                      </p>
                    </div>
                    <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-500">
                      <Coins className="size-3.5" />
                      {sub.payableAmount} coins
                    </span>
                  </div>

                  {(() => {
                    const proof = parseProof(sub.submissionDetails);
                    return (
                      <div className="mt-3 space-y-2">
                        {proof.image && (
                          <div
                            onClick={() => setViewSubmission(sub)}
                            className="flex items-center gap-3 rounded-lg border border-border bg-accent/30 p-2 cursor-pointer hover:bg-accent/50 transition-colors"
                          >
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border bg-black/10">
                              <img
                                src={proof.image}
                                alt="Proof screenshot"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                <ImageIcon className="size-3.5" /> Proof Screenshot Attached
                              </span>
                              <p className="text-[11px] text-muted-foreground truncate">
                                Click to inspect screenshot in high resolution
                              </p>
                            </div>
                          </div>
                        )}

                        {proof.notes && (
                          <div className="rounded-lg bg-accent/40 p-2.5 text-xs text-muted-foreground">
                            <p className="font-semibold text-foreground mb-0.5">Worker Notes:</p>
                            <p className="whitespace-pre-wrap line-clamp-2">{proof.notes}</p>
                          </div>
                        )}

                        {!proof.image && !proof.notes && (
                          <div className="rounded-lg bg-accent/40 p-2.5 text-xs text-muted-foreground">
                            <p className="font-semibold text-foreground mb-0.5">Proof Submitted:</p>
                            <p className="whitespace-pre-wrap line-clamp-3">{sub.submissionDetails}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-border">
                    <small className="text-[11px] text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewSubmission(sub)}
                      >
                        Inspect Proof
                      </Button>
                      <Button
                        size="sm"
                        className="bg-success text-white hover:bg-success/90"
                        disabled={approveMutation.isPending}
                        onClick={() => approveMutation.mutate(sub.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={rejectMutation.isPending}
                        onClick={() => rejectMutation.mutate(sub.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Detail Dialog */}
      {viewSubmission && (
        <Dialog open={true} onOpenChange={() => setViewSubmission(null)}>
          <DialogHeader>
            <DialogTitle>Submission Proof Inspection</DialogTitle>
            <DialogDescription>
              Task: &quot;{viewSubmission.task?.title}&quot;
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4 py-4 text-sm">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Worker</p>
              <p className="font-medium mt-0.5">{viewSubmission.worker?.fullName} ({viewSubmission.worker?.email})</p>
            </div>
            
            {(() => {
              const dialogProof = parseProof(viewSubmission.submissionDetails);
              return (
                <div className="space-y-4">
                  {dialogProof.image && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Proof Screenshot
                        </p>
                        <a
                          href={dialogProof.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                        >
                          <ExternalLink className="size-3" /> Open Original
                        </a>
                      </div>
                      <div className="overflow-hidden rounded-lg border border-border bg-black/5 dark:bg-white/5 p-1 max-h-[380px] flex items-center justify-center">
                        <img
                          src={dialogProof.image}
                          alt="Submitted task proof"
                          className="max-h-[360px] w-auto max-w-full rounded-md object-contain shadow-xs"
                        />
                      </div>
                    </div>
                  )}

                  {dialogProof.notes && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Worker Notes
                      </p>
                      <div className="mt-1 rounded-lg border border-border bg-card p-3 text-sm whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                        {dialogProof.notes}
                      </div>
                    </div>
                  )}

                  {!dialogProof.image && !dialogProof.notes && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Submitted Proof
                      </p>
                      <div className="mt-1 rounded-lg border border-border bg-card p-3 text-sm font-mono whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
                        {viewSubmission.submissionDetails}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </DialogBody>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="destructive"
              disabled={rejectMutation.isPending}
              onClick={() => rejectMutation.mutate(viewSubmission.id)}
            >
              Reject (Re-open Slot)
            </Button>
            <Button
              className="bg-success text-white hover:bg-success/90"
              disabled={approveMutation.isPending}
              onClick={() => approveMutation.mutate(viewSubmission.id)}
            >
              Approve & Release {viewSubmission.payableAmount} Coins
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}
