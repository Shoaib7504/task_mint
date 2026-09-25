"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowRight, BadgeCheck, Coins } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "@/lib/axios";

export default function TopWorkers() {
  const { data } = useQuery({
    queryKey: ["topWorkers"],
    queryFn: async () => {
      const res = await axiosPublic.get("/users/top-workers");
      return res.data?.workers || [];
    },
    staleTime: 60000,
  });

  const workers = data && data.length > 0 ? data : [
    { fullName: "David Chen", coins: 680 },
    { fullName: "Elena Rostova", coins: 430 },
    { fullName: "Marcus Johnson", coins: 290 },
  ];

  return (
    <section id="top-workers" className="section bg-surface scroll-mt-20">
      <div className="section-head row">
        <div>
          <span className="eyebrow">Marketplace leaders</span>
          <h2>Meet our top workers</h2>
        </div>
        <Button variant="outline" asChild>
          <Link href="/tasks">
            Browse tasks <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workers.map((w, i) => {
          const initials = w.fullName
            ? w.fullName.split(" ").map((x) => x[0]).join("").slice(0, 2)
            : "W";

          return (
            <Card className="worker-card" key={w.id || w.fullName}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="avatar-lg">{initials}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-lg font-bold">{w.fullName}</h3>
                    {i < 3 && <BadgeCheck className="size-4 shrink-0 text-primary" />}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Verified TaskMint Worker
                  </p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <b className="text-amber-500 flex items-center gap-1">
                      <Coins className="size-4" />
                      {w.coins?.toLocaleString()} coins
                    </b>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
