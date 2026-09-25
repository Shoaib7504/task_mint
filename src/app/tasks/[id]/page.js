"use client";

import { use } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import StatusBadge from "@/components/dashboard/StatusBadge";
import {
  ArrowLeft,
  CalendarDays,
  Coins,
  ShieldCheck,
  User,
  Users,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

export default function PublicTaskDetailPage({ params }) {
  const { id } = use(params);
  const { user, isLoggedIn } = useAuth();
  const isWorker = user?.role === "WORKER";

  const { data: task, isLoading, isError } = useQuery({
    queryKey: ["publicTaskDetail", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/tasks/${id}`);
      return res.data?.task;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="w-11/12 mx-auto">
          <Navbar />
        </div>
        <main className="flex-1 flex items-center justify-center py-24">
          <div className="text-center">
            <div className="mx-auto size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading task details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="w-11/12 mx-auto">
          <Navbar />
        </div>
        <main className="flex-1 flex items-center justify-center py-24 px-4">
          <div className="max-w-md text-center">
            <AlertCircle className="mx-auto size-12 text-danger" />
            <h2 className="mt-4 text-xl font-bold">Task Not Found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The requested task does not exist or may have been completed and closed.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/tasks">Browse other tasks</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-11/12 mx-auto">
        <Navbar />
      </div>

      <main className="flex-1 w-11/12 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb navigation */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/tasks" className="hover:text-foreground transition-colors">
            Tasks
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-xs sm:max-w-sm">
            {task.title}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Main Task Description */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge>{task.category || "General"}</StatusBadge>
                  <StatusBadge tone="success">
                    <ShieldCheck className="mr-1 size-3.5" /> Verified Escrow
                  </StatusBadge>
                  <StatusBadge tone={task.status === "ACTIVE" ? "info" : "neutral"}>
                    {task.status}
                  </StatusBadge>
                </div>

                <h1 className="mt-4 text-2xl font-bold md:text-3xl text-foreground">
                  {task.title}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Published by <b>{task.buyer?.fullName || "Verified Buyer"}</b></span>
                  <span>•</span>
                  <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Banner image if available */}
                {task.imageUrl && (
                  <div className="mt-6 overflow-hidden rounded-xl border border-border bg-black/5 max-h-72">
                    <img
                      src={task.imageUrl}
                      alt={task.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Task Instructions */}
                <div className="mt-8 space-y-6">
                  {/* Task Link / Destination */}
                  {task.taskLink && (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                            <ExternalLink className="size-3.5" />
                            <span>Task Destination Link</span>
                          </div>
                          <p className="mt-1 text-sm font-semibold text-foreground">
                            Go to the external task URL to perform the task:
                          </p>
                          <a
                            href={task.taskLink.startsWith("http") ? task.taskLink : `https://${task.taskLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-xs text-primary hover:underline font-mono truncate max-w-full"
                          >
                            {task.taskLink}
                          </a>
                        </div>
                        <Button
                          size="default"
                          className="shrink-0 font-semibold gap-2 shadow-xs"
                          asChild
                        >
                          <a
                            href={task.taskLink.startsWith("http") ? task.taskLink : `https://${task.taskLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>Go to Task</span>
                            <ExternalLink className="size-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Task Description & Instructions
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-relaxed whitespace-pre-wrap text-foreground">
                      {task.detail}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Required Proof & Submission Instructions
                    </h2>
                    <div className="mt-3 rounded-xl border border-border bg-accent/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                      <div className="flex items-center gap-2 font-medium text-foreground mb-1.5">
                        <FileCheck2 className="size-4 text-primary" />
                        <span>What you must submit:</span>
                      </div>
                      <p className="text-muted-foreground">{task.submissionInfo}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" asChild>
              <Link href="/tasks">
                <ArrowLeft className="mr-2 size-4" /> Back to all tasks
              </Link>
            </Button>
          </div>

          {/* Sidebar Info & Action */}
          <div className="space-y-6">
            <Card className="lg:sticky lg:top-24">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                    Task Reward
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-amber-500 flex items-center gap-1.5">
                      <Coins className="size-7" /> {task.payableAmount} coins
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (${(task.payableAmount / 20).toFixed(2)} USD)
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Remaining Worker Slots</span>
                    <b className="font-semibold text-foreground">
                      {task.requiredWorkers} {task.requiredWorkers === 1 ? "slot" : "slots"}
                    </b>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Slots</span>
                    <span className="font-medium text-foreground">{task.totalWorkers || task.requiredWorkers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Completion Deadline</span>
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <CalendarDays className="size-3.5 text-muted-foreground" />
                      {new Date(task.completionDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Call to action */}
                <div className="border-t border-border pt-4 space-y-3">
                  {isLoggedIn && isWorker ? (
                    <Button className="w-full font-semibold" size="lg" asChild>
                      <Link href={`/dashboard/worker/tasks/${task.id}`}>
                        Submit Proof Now
                      </Link>
                    </Button>
                  ) : isLoggedIn && !isWorker ? (
                    <div className="rounded-lg bg-accent/40 p-3 text-center text-xs text-muted-foreground">
                      You are logged in as <b>{user?.role}</b>. Only registered workers can submit task proof.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button className="w-full font-semibold" size="lg" asChild>
                        <Link href="/register?role=worker">
                          Sign Up to Complete & Earn
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login">
                          Log In to Apply
                        </Link>
                      </Button>
                    </div>
                  )}

                  <p className="text-[11px] text-center text-muted-foreground">
                    Rewards are credited automatically upon buyer approval.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
