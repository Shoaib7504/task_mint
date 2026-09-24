"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { transactions } from "@/lib/dashboardData";

export default function BuyerPaymentHistoryPage() {
  const rows = transactions.map((t) => [
    t.id,
    t.item,
    t.amount,
    t.date,
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
        <DataTable
          headers={["Transaction ID", "Coin package", "Amount", "Date", "Status"]}
          rows={rows}
          total={transactions.length}
        />
      </main>
    </>
  );
}
