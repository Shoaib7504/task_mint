"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  CircleDollarSign,
  Coins,
  Users,
  Clock3,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/admin-stats");
      return res.data;
    },
  });

  const stats = [
    {
      label: "Total workers",
      value: (data?.stats?.totalWorkers ?? 0).toLocaleString(),
      change: "Active on platform",
      icon: Users,
      tone: "primary",
    },
    {
      label: "Total buyers",
      value: (data?.stats?.totalBuyers ?? 0).toLocaleString(),
      change: "Creating tasks",
      icon: BriefcaseBusiness,
      tone: "info",
    },
    {
      label: "Platform coins",
      value: (data?.stats?.totalAvailableCoins ?? 0).toLocaleString(),
      change: "Circulating across users",
      icon: Coins,
      tone: "coin",
    },
    {
      label: "Total payments",
      value: `$${(data?.stats?.totalPaymentsAmount ?? 0).toFixed(2)}`,
      change: `${data?.stats?.pendingWithdrawals ?? 0} withdrawals pending`,
      icon: CircleDollarSign,
      tone: "success",
    },
  ];

  const recentUsers = data?.recentUsers || [];
  const rows = recentUsers.map((u) => [
    u.fullName || "User",
    u.email,
    <StatusBadge key={u.id} tone={u.role === "ADMIN" ? "info" : u.role === "BUYER" ? "warning" : "success"}>
      {u.role}
    </StatusBadge>,
    `${u.coins.toLocaleString()} coins`,
    new Date(u.createdAt).toLocaleDateString(),
  ]);

  return (
    <>
      <DashboardHeader
        title="Welcome back, Admin"
        subtitle="Platform-wide overview, user roles, and task management."
      />
      <main className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-8">
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Recent users table */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Recent Platform Registrations</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/admin/users">Manage All Users</Link>
              </Button>
            </div>
            {recentUsers.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No users found.</p>
            ) : (
              <DataTable
                headers={["User", "Email", "Role", "Coins", "Joined"]}
                rows={rows}
                total={recentUsers.length}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
