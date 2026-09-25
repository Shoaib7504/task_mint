"use client";

import { useState } from "react";
import { Search, Briefcase, Coins, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "@/lib/axios";

export default function WorkerTasksPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["workerTasks", query, category],
    queryFn: async () => {
      const res = await axiosPublic.get("/tasks", {
        params: {
          search: query || undefined,
          category: category !== "All" ? category : undefined,
          limit: 20,
        },
      });
      return res.data;
    },
  });

  const tasks = data?.tasks || [];
  const categories = ["All", "Testing", "Social Media", "Surveys", "Content", "General"];

  return (
    <>
      <DashboardHeader
        title="Find your next task"
        subtitle="Discover verified opportunities matched to your skills."
      />
      <main className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-8">
        {/* Search + categories */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks by title or details..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={category === c ? "default" : "outline"}
                onClick={() => setCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        {/* Task Grid */}
        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground">Loading available tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Briefcase className="mx-auto size-12 opacity-40" />
            <p className="mt-3 text-lg font-semibold">No tasks found</p>
            <p className="text-sm">Check back later or try clearing filters.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <Card key={task.id} className="flex flex-col justify-between hover:border-primary/50 transition-colors">
                <CardContent className="p-5 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge>{task.category}</StatusBadge>
                      <span className="flex items-center gap-1 font-bold text-amber-500 text-sm">
                        <Coins className="size-4" />
                        {task.payableAmount} coins
                      </span>
                    </div>

                    <h3 className="mt-3 font-semibold text-lg line-clamp-1">{task.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.detail}</p>
                  </div>

                  <div className="mt-5 border-t border-border pt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>Buyer: <b>{task.buyer?.fullName}</b></span>
                      <span><b>{task.requiredWorkers}</b> slots left</span>
                    </div>
                    <Button className="w-full" size="sm" asChild>
                      <Link href={`/dashboard/worker/tasks/${task.id}`}>
                        View Details & Apply <ArrowRight className="size-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
