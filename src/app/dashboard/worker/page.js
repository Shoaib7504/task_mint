"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Check,
  Clock3,
  Coins,
  FileCheck2,
  TrendingUp,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import TaskMarketplaceCard from "@/components/worker/TaskMarketplaceCard";
import { tasks, chartData } from "@/lib/dashboardData";
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
  { label: "Total submissions", value: "428", change: "+12%", icon: FileCheck2, tone: "primary" },
  { label: "Pending review", value: "8", change: "3 today", icon: Clock3, tone: "warning" },
  { label: "Total earnings", value: "$1,842", change: "+18%", icon: TrendingUp, tone: "success" },
  { label: "Available coins", value: "2,480", change: "$248.00", icon: Coins, tone: "coin" },
];

export default function WorkerDashboardPage() {
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
            <span className="eyebrow">worker workspace</span>
            <h2 className="mt-2 text-2xl font-bold">Your marketplace, at a glance.</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Track momentum, discover the next opportunity, and keep every payment moving.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/worker/tasks">
              Browse tasks <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>

        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Charts + Activity bento grid */}
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          {/* Earnings chart */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-base font-semibold">Earnings momentum</h3>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--primary)"
                      strokeWidth={3}
                      fill="url(#areaFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-base font-semibold">Recent activity</h3>
              <div className="mt-4 space-y-1">
                {tasks.slice(0, 4).map((t, i) => (
                  <div className="activity-row" key={t.id}>
                    <span className={`metric-icon ${i % 2 ? "success" : "primary"}`}>
                      {i % 2 ? <Check /> : <Activity />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="truncate">{t.title}</b>
                      <small>+{t.reward} coins</small>
                    </span>
                    <time>{i + 1}h</time>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended tasks */}
        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">Recommended work</span>
              <h2 className="mt-2 text-xl font-bold">Tasks matched to your momentum.</h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/worker/tasks">
                View marketplace <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tasks.slice(0, 3).map((task) => (
              <TaskMarketplaceCard task={task} key={task.id} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
