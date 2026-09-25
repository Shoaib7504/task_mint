"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";

export default function AdminWithdrawalsPage() {
  const [approving, setApproving] = useState(null);
  const queryClient = useQueryClient();

  const { data: withdrawals = [], isLoading } = useQuery({
    queryKey: ["adminWithdrawals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/withdrawals/all");
      return res.data?.withdrawals || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/withdrawals/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setApproving(null);
    },
  });

  const rows = withdrawals.map((w) => [
    w.worker?.fullName || "Worker",
    `${w.coins} coins`,
    `$${w.amount.toFixed(2)}`,
    w.paymentMethod,
    w.accountNumber,
    new Date(w.createdAt).toLocaleDateString(),
    w.status === "PENDING" ? (
      <Button
        key={w.id}
        size="sm"
        disabled={approveMutation.isPending}
        onClick={() => setApproving(w)}
      >
        Approve Payment
      </Button>
    ) : (
      <StatusBadge tone="success" key={w.id}>
        {w.status}
      </StatusBadge>
    ),
  ]);

  return (
    <>
      <DashboardHeader
        title="Withdrawal requests"
        subtitle="Review and approve worker payouts."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading withdrawal requests...</div>
        ) : (
          <DataTable
            headers={["Worker", "Coins", "Amount", "Method", "Account", "Date", "Action"]}
            rows={rows}
            total={withdrawals.length}
          />
        )}
      </main>

      {/* Approve Dialog */}
      {approving && (
        <Dialog open={true} onOpenChange={() => setApproving(null)}>
          <DialogHeader>
            <DialogTitle>Confirm Worker Payout</DialogTitle>
            <DialogDescription>
              Approve payout of ${approving.amount.toFixed(2)} to {approving.worker?.fullName} via {approving.paymentMethod} ({approving.accountNumber})?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproving(null)}>Cancel</Button>
            <Button
              disabled={approveMutation.isPending}
              onClick={() => approveMutation.mutate(approving.id)}
            >
              {approveMutation.isPending ? "Approving..." : "Confirm & Send Notification"}
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}
