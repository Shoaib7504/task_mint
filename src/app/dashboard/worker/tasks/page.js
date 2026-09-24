"use client";

import { useState, useMemo } from "react";
import { Filter, Search } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TaskMarketplaceCard from "@/components/worker/TaskMarketplaceCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { tasks } from "@/lib/dashboardData";

export default function WorkerTasksPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <>
      <DashboardHeader
        title="Find your next task"
        subtitle="Discover verified opportunities matched to your skills."
      />
      <main className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-8">
        {/* Section header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Task marketplace</span>
            <h2 className="mt-2 text-xl font-bold">Find work worth your time.</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Verified opportunities, transparent rewards, and clear deadlines.
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-center">
              <small className="block text-muted-foreground">Earnings this month</small>
              <b>1,840 coins</b>
            </span>
            <span className="text-center">
              <small className="block text-muted-foreground">Active tasks</small>
              <b>3</b>
            </span>
          </div>
        </div>

        {/* Search + filters */}
        <div className="filter-bar">
          <div className="input-icon min-w-60 flex-1">
            <Search />
            <Input
              placeholder="Search tasks, buyers, or categories"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {["Category", "Reward", "Deadline"].map((x) => (
            <Button variant="outline" key={x}>
              <Filter className="size-4" /> {x}
            </Button>
          ))}
        </div>

        {/* Task grid */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <TaskMarketplaceCard task={t} key={t.id} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No tasks found matching "{query}"
          </p>
        )}
      </main>
    </>
  );
}
