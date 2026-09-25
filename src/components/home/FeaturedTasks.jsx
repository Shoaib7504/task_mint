"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Coins } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "@/lib/axios";

export default function FeaturedTasks() {
  const { data } = useQuery({
    queryKey: ["featuredTasks"],
    queryFn: async () => {
      const res = await axiosPublic.get("/tasks/featured");
      return res.data?.tasks || [];
    },
    staleTime: 60000,
  });

  const tasks = data || [];

  return (
    <section className="section">
      <div className="section-head row">
        <div>
          <span className="eyebrow">Active listings</span>
          <h2>Featured Opportunities</h2>
        </div>
        <Button variant="outline" asChild>
          <Link href="/tasks">
            View all tasks <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-xl border border-border bg-card p-5 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-full bg-accent px-2.5 py-0.5 font-medium">{task.category}</span>
                <span className="font-bold text-amber-500 flex items-center gap-1">
                  <Coins className="size-3.5" />
                  {task.payableAmount} coins
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold line-clamp-1">{task.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.detail}</p>
            </div>
            <div className="mt-4 border-t border-border pt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground"><b>{task.requiredWorkers}</b> slots remaining</span>
              <Button size="sm" variant="ghost" asChild>
                <Link href={`/tasks/${task.id}`}>View Task</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
