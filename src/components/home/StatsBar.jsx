"use client";

import { Users, CheckCircle, Coins, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "@/lib/axios";

export default function StatsBar() {
  const { data } = useQuery({
    queryKey: ["platformStats"],
    queryFn: async () => {
      const res = await axiosPublic.get("/users/platform-stats");
      return res.data?.stats;
    },
    staleTime: 60000,
  });

  const stats = [
    {
      label: "Active workers",
      value: (data?.totalWorkers ?? 24).toString(),
      icon: Users,
    },
    {
      label: "Active buyers",
      value: (data?.totalBuyers ?? 8).toString(),
      icon: CheckCircle,
    },
    {
      label: "Tasks published",
      value: (data?.totalTasks ?? 12).toString(),
      icon: Coins,
    },
    {
      label: "Total payouts",
      value: `$${(data?.totalPayouts ?? 120).toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <section className="border-b bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 py-7 md:grid-cols-4 lg:px-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            className="flex items-center gap-3 border-border px-2 py-3 md:not-last:border-r md:px-6"
            key={label}
          >
            <span className="icon-box">
              <Icon />
            </span>
            <span>
              <b className="block text-xl md:text-2xl">{value}</b>
              <small className="text-muted-foreground">{label}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
