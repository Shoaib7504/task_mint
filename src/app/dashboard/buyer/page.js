"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Clock3,
  Coins,
  CreditCard,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { tasks, submissions, chartData } from "@/lib/dashboardData";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const stats = [
  { label: "Total tasks", value: "64", change: "+4 this month", icon: BriefcaseBusiness, tone: "primary" },
  { label: "Pending tasks", value: "7", change: "Needs attention", icon: Clock3, tone: "warning" },
  { label: "Total payments", value: "$4,820", change: "+9%", icon: CreditCard, tone: "success" },
  { label: "Available coins", value: "2,480", change: "Ready to spend", icon: Coins, tone: "coin" },
];

export default function BuyerDashboardPage() {
  const pendingSubmissions = submissions.filter((s) => s.status === "pending");

  const reviewRows = pendingSubmissions.map((s) => [
    s.workerName,
    s.taskTitle,
    `${s.payableAmount} coins`,
    s.date,
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
            <span className="eyebrow">buyer workspace</span>
            <h2 className="mt-2 text-2xl font-bold">Your marketplace, at a glance.</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage tasks, review submissions, and track spending.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/buyer/add-task">
              Create task <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Chart + Activity */}
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-base font-semibold">Spending overview</h3>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="buyerAreaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fill="url(#buyerAreaFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-base font-semibold">Tasks needing review</h3>
              <div className="mt-4 space-y-1">
                {tasks.slice(0, 4).map((t, i) => (
                  <div className="activity-row" key={t.id}>
                    <span className={`metric-icon ${i % 2 ? "success" : "primary"}`}>
                      {i % 2 ? <Check /> : <Activity />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="truncate">{t.title}</b>
                      <small>{t.workers} workers</small>
                    </span>
                    <time>{i + 1}h</time>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task to Review table */}
        <div>
          <h2 className="mb-4 text-xl font-bold">Submissions to review</h2>
          <DataTable
            headers={["Worker", "Task", "Amount", "Date", "Status", "Action"]}
            rows={reviewRows}
            total={pendingSubmissions.length}
          />
        </div>
      </main>
    </>
  );
}
