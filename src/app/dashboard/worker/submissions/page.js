"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { submissions } from "@/lib/dashboardData";

export default function WorkerSubmissionsPage() {
  const rows = submissions.map((s) => [
    s.taskTitle,
    s.buyerName,
    `${s.payableAmount} coins`,
    s.date,
    <StatusBadge
      key={s.id}
      tone={
        s.status === "pending"
          ? "warning"
          : s.status === "rejected"
            ? "danger"
            : "success"
      }
    >
      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
    </StatusBadge>,
  ]);

  return (
    <>
      <DashboardHeader
        title="My submissions"
        subtitle="Track proof reviews and earned rewards."
      />
      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        <DataTable
          headers={["Task", "Buyer", "Reward", "Submission date", "Status"]}
          rows={rows}
          total={submissions.length}
        />
      </main>
    </>
  );
}
