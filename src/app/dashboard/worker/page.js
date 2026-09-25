"use client";

import Link from "next/link";
import {
  Clock3,
  Coins,
  FileCheck2,
  TrendingUp,
  Search,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";

export default function WorkerDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["workerStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/worker-stats");
      return res.data;
    },
  });

  const stats = [
    {
      label: "Total submissions",
      value: (data?.stats?.totalSubmissions ?? 0).toString(),
      change: "Proof submitted",
      icon: FileCheck2,
      tone: "primary",
    },
    {
      label: "Pending review",
      value: (data?.stats?.pendingSubmissions ?? 0).toString(),
      change: "Awaiting approval",
      icon: Clock3,
      tone: "warning",
    },
    {
      label: "Total earnings",
      value: `$${(data?.stats?.totalEarnedDollars ?? 0).toFixed(2)}`,
      change: `${(data?.stats?.totalEarnedCoins ?? 0).toLocaleString()} coins earned`,
      icon: TrendingUp,
      tone: "success",
    },
    {
      label: "Available coins",
      value: (data?.stats?.availableCoins ?? 0).toLocaleString(),
      change: `$${(data?.stats?.availableDollars ?? 0).toFixed(2)} cash value`,
      icon: Coins,
      tone: "coin",
    },
  ];

  const recentApproved = data?.recentApproved || [];
  const rows = recentApproved.map((s) => [
    s.task?.title || "Task",
    s.task?.buyer?.fullName || "Buyer",
    `+${s.payableAmount} coins`,
    new Date(s.updatedAt).toLocaleDateString(),
    <StatusBadge key={s.id} tone="success">Approved</StatusBadge>,
  ]);

  return (
    <>
      <DashboardHeader
        title="Welcome back, Worker"
        subtitle="Here's what's happening with your TaskMint account."
      />
      <main className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-8">
        {/* Intro banner */}
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="eyebrow">Worker Workspace</span>
            <h2 className="mt-2 text-2xl font-bold">Your marketplace, at a glance.</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Discover opportunities, submit proof, earn coins, and cash out anytime.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard/worker/withdrawals">
                <Coins className="size-4 mr-1.5 text-amber-500" /> Withdraw Earnings
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/worker/tasks">
                <Search className="size-4 mr-1.5" /> Browse Tasks
              </Link>
            </Button>
          </div>
        </section>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Recent approved earnings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Recent Approved Rewards</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/worker/submissions">View All Submissions</Link>
              </Button>
            </div>
            {recentApproved.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No approved submissions yet. Explore the marketplace to earn coins!
              </p>
            ) : (
              <DataTable
                headers={["Task", "Buyer", "Reward", "Approved Date", "Status"]}
                rows={rows}
                total={recentApproved.length}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
