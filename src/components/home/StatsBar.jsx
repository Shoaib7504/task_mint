import { Users, CheckCircle, Coins, Star } from "lucide-react";

const stats = [
  { label: "Active workers", value: "12K+", icon: Users },
  { label: "Tasks completed", value: "58K+", icon: CheckCircle },
  { label: "Coins earned", value: "1.2M", icon: Coins },
  { label: "Avg. rating", value: "4.9", icon: Star },
];

export default function StatsBar() {
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
