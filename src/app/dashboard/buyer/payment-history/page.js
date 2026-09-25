"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";

export default function BuyerPaymentHistoryPage() {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["paymentHistory"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments/history");
      return res.data?.payments || [];
    },
  });

  const rows = payments.map((t) => [
    <span key={t.id} className="font-mono text-xs font-semibold">{t.transactionId}</span>,
    `${t.coins.toLocaleString()} Coins`,
    `$${t.amount.toFixed(2)}`,
    new Date(t.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    <StatusBadge tone="success" key={t.id}>
      {t.status}
    </StatusBadge>,
  ]);

  return (
    <>
      <DashboardHeader
        title="Payment history"
        subtitle="Review every coin purchase and receipt."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading payment history...</div>
        ) : (
          <DataTable
            headers={["Transaction ID", "Coin package", "Amount", "Date", "Status"]}
            rows={rows}
            total={payments.length}
          />
        )}
      </main>
    </>
  );
}
