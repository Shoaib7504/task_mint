"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { withdrawals } from "@/lib/dashboardData";

export default function AdminWithdrawalsPage() {
  const [approving, setApproving] = useState(null);

  function handleApprove(withdrawal) {
    console.log("Approve withdrawal:", {
      worker: withdrawal.worker,
      email: withdrawal.email,
      coins: withdrawal.coins,
      amount: withdrawal.amount,
      method: withdrawal.method,
      action: "Change status to approved. Decrease user coin by withdrawal amount.",
    });
    alert(`Withdrawal approved for ${withdrawal.worker}. ${withdrawal.amount} payout. Logged to console.`);
    setApproving(null);
  }

  const rows = withdrawals.map((w) => [
    w.worker,
    `${w.coins} coins`,
    w.amount,
    w.method,
    w.account,
    w.date,
    <Button
      key={w.worker}
      size="sm"
      onClick={() => setApproving(w)}
    >
      Approve payment
    </Button>,
  ]);

  return (
    <>
      <DashboardHeader
        title="Withdrawal requests"
        subtitle="Review and approve worker payouts."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        <DataTable
          headers={["Worker", "Requested coins", "Dollar amount", "Method", "Account", "Date", "Action"]}
          rows={rows}
          total={withdrawals.length}
        />

        {/* Approve confirmation */}
        <Dialog open={!!approving} onClose={() => setApproving(null)}>
          <DialogHeader>
            <DialogTitle>
              Approve {approving?.amount} payout?
            </DialogTitle>
            <DialogDescription>
              This marks the request from <b>{approving?.worker}</b> as approved and ready for payment.
              Their coin balance will be decreased by <b>{approving?.coins} coins</b>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproving(null)}>Cancel</Button>
            <Button variant="success" onClick={() => handleApprove(approving)}>
              <Check className="size-4" /> Approve
            </Button>
          </DialogFooter>
        </Dialog>
      </main>
    </>
  );
}
