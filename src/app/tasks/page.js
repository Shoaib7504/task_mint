"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import StatusBadge from "@/components/dashboard/StatusBadge";
import {
  Search,
  Coins,
  Calendar,
  Users,
  Briefcase,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

const categories = ["All", "Testing", "Social Media", "Surveys", "Content", "General"];

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const { user, isLoggedIn } = useAuth();
  const isWorker = user?.role === "WORKER";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["publicTasks", search, category, sortBy, sortOrder],
    queryFn: async () => {
      const res = await axiosPublic.get("/tasks", {
        params: {
          search: search.trim() || undefined,
          category: category !== "All" ? category : undefined,
          sortBy,
          sortOrder,
          limit: 24,
        },
      });
      return res.data;
    },
  });

  const tasks = data?.tasks || [];
  const totalCount = data?.pagination?.total ?? tasks.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-11/12 mx-auto">
        <Navbar />
      </div>

      <main className="flex-1 w-11/12 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-10 shadow-xs mb-8">
          <div className="relative z-10 max-w-2xl">
            <span className="eyebrow">
              <Sparkles className="size-3.5" /> Public Marketplace
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Browse Available Tasks
            </h1>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">
              Discover verified micro-tasks, follow step-by-step instructions, submit your proof, and earn instant coin payouts.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <CheckCircle2 className="size-4 text-success" /> Verified Escrow Payouts
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <Coins className="size-4 text-amber-500" /> Fast Reward Approvals
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <Users className="size-4 text-primary" /> Active Community
            </span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks by title, instructions, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="h-11 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="payableAmount-desc">Highest Reward</option>
                <option value="payableAmount-asc">Lowest Reward</option>
                <option value="requiredWorkers-desc">Most Slots Left</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={category === cat ? "default" : "outline"}
                onClick={() => setCategory(cat)}
                className="shrink-0 text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Task Counter */}
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <p>
            Showing <b>{tasks.length}</b> {tasks.length === 1 ? "task" : "tasks"}
            {category !== "All" && ` in ${category}`}
          </p>
          {isLoggedIn && !isWorker && (
            <p className="text-amber-500 font-medium">
              Logged in as {user?.role}. Only workers can submit task proof.
            </p>
          )}
        </div>

        {/* Task Grid */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="mx-auto size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading available tasks...</p>
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-danger/20 bg-danger/5 p-8 text-center text-sm text-danger">
            Failed to load tasks. Please refresh or try again later.
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Briefcase className="mx-auto size-12 text-muted-foreground/40" />
            <h3 className="mt-3 text-lg font-semibold">No tasks found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No tasks matched your search or category filter. Try clearing filters.
            </p>
            {(search || category !== "All") && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => {
              const applyHref = isWorker
                ? `/dashboard/worker/tasks/${task.id}`
                : `/tasks/${task.id}`;

              return (
                <Card
                  key={task.id}
                  className="flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-card bg-card"
                >
                  <CardContent className="p-5 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <StatusBadge>{task.category || "General"}</StatusBadge>
                        <span className="flex items-center gap-1 font-bold text-amber-500 text-sm">
                          <Coins className="size-4" />
                          {task.payableAmount} coins
                        </span>
                      </div>

                      <h3 className="mt-3 font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
                        <Link href={`/tasks/${task.id}`}>{task.title}</Link>
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {task.detail}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-border pt-3 space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Buyer: <b>{task.buyer?.fullName || "Verified Buyer"}</b>
                        </span>
                        <span className="font-medium text-foreground">
                          {task.requiredWorkers} slots left
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(task.completionDate).toLocaleDateString()}
                          </span>
                          {task.taskLink && (
                            <a
                              href={task.taskLink.startsWith("http") ? task.taskLink : `https://${task.taskLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-primary hover:underline font-medium inline-flex items-center gap-0.5"
                              title="Direct task destination"
                            >
                              <ExternalLink className="size-3" />
                              <span>Link</span>
                            </a>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/tasks/${task.id}`}>Details</Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={applyHref}>
                              Apply <ArrowRight className="ml-1 size-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
