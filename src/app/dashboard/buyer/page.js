"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  Clock3,
  Coins,
  CreditCard,
  Plus,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";

export default function BuyerDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["buyerStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/buyer-stats");
      return res.data;
    },
  });

  const stats = [
    {
      label: "Total tasks",
      value: (data?.stats?.totalTasks ?? 0).toString(),
      change: "Published by you",
      icon: BriefcaseBusiness,
      tone: "primary",
    },
    {
      label: "Pending reviews",
      value: (data?.stats?.pendingReviewCount ?? 0).toString(),
      change: "Submissions awaiting review",
      icon: Clock3,
      tone: "warning",
    },
    {
      label: "Total spent",
      value: `$${(data?.stats?.totalPaymentDollars ?? 0).toFixed(2)}`,
      change: `${(data?.stats?.totalPurchasedCoins ?? 0).toLocaleString()} coins purchased`,
      icon: CreditCard,
      tone: "success",
    },
    {
      label: "Available coins",
      value: (data?.stats?.availableCoins ?? 0).toLocaleString(),
      change: "Ready to fund tasks",
      icon: Coins,
      tone: "coin",
    },
  ];

  const pendingReviews = data?.pendingReviews || [];

  const reviewRows = pendingReviews.map((s) => [
    s.worker?.fullName || "Worker",
    s.task?.title || "Task",
    `${s.payableAmount} coins`,
    new Date(s.createdAt).toLocaleDateString(),
    <StatusBadge key={s.id} tone="warning">Pending</StatusBadge>,
    <Button key={`btn-${s.id}`} size="sm" asChild>
      <Link href="/dashboard/buyer/review">Review</Link>
    </Button>,
  ]);

  return (
    <>
      <DashboardHeader
        title="Welcome back, Buyer"
        subtitle="Here's what's happening with your TaskMint account."
      />
      <main className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-8">
        {/* Intro banner */}
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="eyebrow">Buyer Workspace</span>
            <h2 className="mt-2 text-2xl font-bold">Manage your tasks and worker payouts.</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Need more coins for your tasks? Purchase coins instantly or publish a new task.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard/buyer/purchase-coins">
                <Coins className="size-4 mr-1.5 text-amber-500" /> Purchase Coins
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/buyer/add-task">
                <Plus className="size-4 mr-1.5" /> Create Task
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

        {/* Pending reviews table */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Submissions Needing Review</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/buyer/review">View All Reviews</Link>
              </Button>
            </div>
            {pendingReviews.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No submissions currently pending review. Great job!
              </p>
            ) : (
              <DataTable
                headers={["Worker", "Task", "Reward", "Submitted", "Status", "Action"]}
                rows={reviewRows}
                total={pendingReviews.length}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
