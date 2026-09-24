"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CircleDollarSign,
  Coins,
  Users,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { tasks, users as usersData, chartData } from "@/lib/dashboardData";
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
  { label: "Total workers", value: "24,842", change: "+8.4%", icon: Users, tone: "primary" },
  { label: "Total buyers", value: "3,218", change: "+6.1%", icon: BriefcaseBusiness, tone: "info" },
  { label: "Available coins", value: "8.4M", change: "Across platform", icon: Coins, tone: "coin" },
  { label: "Total payments", value: "$2.8M", change: "+14.2%", icon: CircleDollarSign, tone: "success" },
];

export default function AdminDashboardPage() {
  const recentUserRows = usersData.slice(0, 4).map((u, i) => [
    u.name,
    <StatusBadge key={i} tone={i === 1 ? "warning" : "success"}>
      {i === 1 ? "Pending" : "Active"}
    </StatusBadge>,
    `${u.coins} coins`,
    `Sep ${6 - i}`,
  ]);

  return (
    <>
      <DashboardHeader
        title="Welcome back, Admin"
        subtitle="Here's what's happening across the TaskMint platform."
      />
      <main className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-8">
        {/* Intro banner */}
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="eyebrow">admin workspace</span>
            <h2 className="mt-2 text-2xl font-bold">Your marketplace, at a glance.</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor users, tasks, and platform health.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/admin/withdrawals">
              Review payouts <ArrowRight className="size-4" />
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
              <h3 className="text-base font-semibold">Platform activity</h3>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="adminAreaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fill="url(#adminAreaFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-base font-semibold">Withdrawal requests</h3>
              <div className="mt-4 space-y-1">
                {tasks.slice(0, 4).map((t, i) => (
                  <div className="activity-row" key={t.id}>
                    <span className={`metric-icon ${i % 2 ? "success" : "primary"}`}>
                      {i % 2 ? <Check /> : <Activity />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="truncate">{t.title}</b>
                      <small>{t.reward * 4} coins requested</small>
                    </span>
                    <time>{i + 1}h</time>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent users table */}
        <div>
          <h2 className="mb-4 text-xl font-bold">Recent users</h2>
          <DataTable
            headers={["User", "Status", "Coins", "Date"]}
            rows={recentUserRows}
            total={usersData.length}
          />
        </div>
      </main>
    </>
  );
}
