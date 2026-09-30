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
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-6 sm:px-6 sm:py-7 md:grid-cols-4 md:gap-0 lg:px-8">
        {stats.map(({ label, value, icon: Icon }, idx) => (
          <div
            className={`flex items-center gap-2.5 sm:gap-3 px-2 py-2 sm:px-4 md:px-6 ${
              idx % 2 === 0 ? "border-r border-border md:border-r-0" : ""
            } md:not-last:border-r`}
            key={label}
          >
            <span className="icon-box shrink-0">
              <Icon />
            </span>
            <span className="min-w-0 flex-1">
              <b className="block text-lg sm:text-xl md:text-2xl truncate">{value}</b>
              <small className="block text-xs sm:text-sm text-muted-foreground truncate">{label}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
