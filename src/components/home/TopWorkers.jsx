import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowRight, BadgeCheck, Coins, Star } from "lucide-react";

const workers = [
  { name: "Marcus Chen", initials: "MC", tasks: 482, coins: "14,200", rating: "4.98" },
  { name: "Sara Okonkwo", initials: "SO", tasks: 391, coins: "11,750", rating: "4.95" },
  { name: "Alex Rivera", initials: "AR", tasks: 310, coins: "9,300", rating: "4.92" },
  { name: "Priya Gupta", initials: "PG", tasks: 275, coins: "8,100", rating: "4.90" },
  { name: "Tomas Ek", initials: "TE", tasks: 260, coins: "7,800", rating: "4.88" },
  { name: "Lily Zhang", initials: "LZ", tasks: 240, coins: "7,200", rating: "4.87" },
];

export default function TopWorkers() {
  return (
    <section className="section bg-surface">
      <div className="section-head row">
        <div>
          <span className="eyebrow">Marketplace leaders</span>
          <h2>Meet our best workers</h2>
        </div>
        <Button variant="outline" asChild>
          <Link href="/tasks">
            View leaderboard <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {workers.map((w, i) => (
          <Card
            className={`worker-card ${i < 2 ? "lg:col-span-3" : "lg:col-span-2"}`}
            key={w.name}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="avatar-lg">{w.initials}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-xl">{w.name}</h3>
                  {i < 3 && (
                    <BadgeCheck className="size-4 shrink-0 text-primary" />
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Top worker · {w.tasks} tasks
                </p>
                <div className="mt-3 flex gap-4 text-sm">
                  <b className="text-coin">
                    <Coins className="mr-1 inline size-4" />
                    {w.coins}
                  </b>
                  <span>
                    <Star className="mr-1 inline size-4 fill-warning text-warning" />
                    {w.rating}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
