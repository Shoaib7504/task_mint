"use client";

import Link from "next/link";
import {
  Clock3,
  Coins,
  FileCheck2,
  TrendingUp,
  Search,
  ArrowUpCircle,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import { useState } from "react";

export default function WorkerDashboardPage() {
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["workerStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/worker-stats");
      return res.data;
    },
  });

  // Fetch current role request
  const { data: roleReqData, isLoading: roleReqLoading } = useQuery({
    queryKey: ["myRoleRequest"],
    queryFn: async () => {
      const res = await axiosSecure.get("/role-requests/my");
      return res.data;
    },
  });

  const requestMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post("/role-requests", { note });
      return res.data;
    },
    onSuccess: (data) => {
      setRequestSuccess(data.message || "Request submitted!");
      setRequestError("");
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["myRoleRequest"] });
    },
    onError: (err) => {
      setRequestError(
        err?.response?.data?.message || "Failed to submit request."
      );
    },
  });

  const roleRequest = roleReqData?.request;

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
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="eyebrow">Worker Workspace</span>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold">Your marketplace, at a glance.</h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Discover opportunities, submit proof, earn coins, and cash out anytime.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/dashboard/worker/withdrawals">
                <Coins className="size-4 mr-1.5 text-amber-500" /> Withdraw Earnings
              </Link>
            </Button>
            <Button className="w-full sm:w-auto" asChild>
              <Link href="/dashboard/worker/tasks">
                <Search className="size-4 mr-1.5" /> Browse Tasks
              </Link>
            </Button>
          </div>
        </section>

        {/* ── Become a Buyer Banner ── */}
        <Card className="border-primary/40 bg-gradient-to-r from-primary/10 via-card to-background shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <ArrowUpCircle className="mt-0.5 size-6 sm:size-7 shrink-0 text-primary" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-foreground">Want to Post Tasks? Become a Buyer</h3>
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      Upgrade
                    </span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    Request buyer status to create tasks, hire workers, and manage campaigns.
                  </p>
                </div>
              </div>

              {/* Status logic */}
              <div className="flex shrink-0 items-center gap-2 w-full sm:w-auto">
                {roleReqLoading ? (
                  <span className="text-xs text-muted-foreground">Loading status…</span>
                ) : roleRequest?.status === "PENDING" ? (
                  <Link
                    href="/dashboard/worker/upgrade"
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-amber-400 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 transition-colors hover:bg-amber-500/20"
                  >
                    <Hourglass className="size-4 animate-spin" />
                    Request Pending Review
                  </Link>
                ) : roleRequest?.status === "APPROVED" ? (
                  <Link
                    href="/dashboard/buyer"
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-emerald-400 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20"
                  >
                    <CheckCircle2 className="size-4" />
                    Approved! Go to Buyer Hub
                  </Link>
                ) : (
                  <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href="/dashboard/worker/upgrade">
                      <ArrowUpCircle className="size-4 mr-1.5" />
                      Request to Become a Buyer
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stat cards */}
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Recent approved earnings */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="font-semibold text-base sm:text-lg">Recent Approved Rewards</h3>
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
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
