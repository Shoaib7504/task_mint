"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Image as ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import { parseProof } from "@/lib/imageUtils";

export default function WorkerSubmissionsPage() {
  const [viewingProof, setViewingProof] = useState(null);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["mySubmissions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/submissions/my-submissions");
      return res.data?.submissions || [];
    },
  });

  const rows = submissions.map((s) => {
    const proof = parseProof(s.submissionDetails);
    return [
      <div key={s.id} className="min-w-[220px]">
        <b className="block text-sm">{s.task?.title || "Task"}</b>
        {proof.image && (
          <button
            type="button"
            onClick={() => setViewingProof({ ...s, proof })}
            className="mt-1 inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium cursor-pointer"
          >
            <ImageIcon className="size-3.5" />
            <span>View proof screenshot</span>
          </button>
        )}
        {proof.notes && (
          <small className="text-xs text-muted-foreground line-clamp-1 block mt-0.5">
            {proof.notes}
          </small>
        )}
        {!proof.image && !proof.notes && (
          <small className="text-xs text-muted-foreground line-clamp-1 block mt-0.5">
            {s.submissionDetails}
          </small>
        )}
      </div>,
      s.task?.buyer?.fullName || "Buyer",
      `${s.payableAmount} coins`,
      new Date(s.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      <StatusBadge
        key={s.id}
        tone={
          s.status === "PENDING"
            ? "warning"
            : s.status === "REJECTED"
            ? "danger"
            : "success"
        }
      >
        {s.status}
      </StatusBadge>,
    ];
  });

  return (
    <>
      <DashboardHeader
        title="My submissions"
        subtitle="Track proof reviews and earned rewards."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading your submissions...</div>
        ) : (
          <DataTable
            headers={["Task", "Buyer", "Reward", "Submission date", "Status"]}
            rows={rows}
            total={submissions.length}
          />
        )}
      </main>

      {/* Proof Preview Modal */}
      {viewingProof && (
        <Dialog open={true} onOpenChange={() => setViewingProof(null)}>
          <DialogHeader>
            <DialogTitle>Submitted Task Proof</DialogTitle>
            <DialogDescription>
              Task: &quot;{viewingProof.task?.title}&quot;
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4 py-4 text-sm">
            {viewingProof.proof?.image && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Uploaded Screenshot
                  </p>
                  <a
                    href={viewingProof.proof.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="size-3" /> Open Full Image
                  </a>
                </div>
                <div className="overflow-hidden rounded-lg border border-border bg-black/5 dark:bg-white/5 p-1 max-h-[380px] flex items-center justify-center">
                  <img
                    src={viewingProof.proof.image}
                    alt="Proof screenshot"
                    className="max-h-[360px] w-auto max-w-full rounded-md object-contain shadow-xs"
                  />
                </div>
              </div>
            )}

            {viewingProof.proof?.notes && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Notes
                </p>
                <div className="mt-1 rounded-lg border border-border bg-card p-3 text-sm whitespace-pre-wrap break-words">
                  {viewingProof.proof.notes}
                </div>
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingProof(null)}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}

