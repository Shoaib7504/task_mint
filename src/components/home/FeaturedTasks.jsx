import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Users, Clock3, Coins } from "lucide-react";

const categoryColors = {
  Survey: "from-primary/15 to-info/10 text-primary border-primary/20",
  Testing: "from-warning/15 to-warning/5 text-warning border-warning/20",
  Data: "from-success/15 to-success/5 text-success border-success/20",
  Writing: "from-info/15 to-info/5 text-info border-info/20",
  Review: "from-coin/15 to-coin/5 text-coin border-coin/20",
  Design: "from-primary/15 to-primary/5 text-primary border-primary/20",
};

const tasks = [
  {
    category: "Survey",
    reward: 50,
    title: "Rate mobile checkout flow",
    buyer: "ShopEasy",
    workers: "24 / 30 slots",
    deadline: "2 days left",
  },
  {
    category: "Testing",
    reward: 75,
    title: "Test signup on iOS Safari",
    buyer: "LaunchPad",
    workers: "12 / 20 slots",
    deadline: "3 days left",
  },
  {
    category: "Data",
    reward: 40,
    title: "Categorise product images",
    buyer: "PixelMart",
    workers: "48 / 60 slots",
    deadline: "5 days left",
  },
  {
    category: "Writing",
    reward: 60,
    title: "Write 100‑word product blurbs",
    buyer: "CopyCraft",
    workers: "9 / 15 slots",
    deadline: "1 day left",
  },
  {
    category: "Review",
    reward: 35,
    title: "Review restaurant listings",
    buyer: "FoodieMap",
    workers: "30 / 50 slots",
    deadline: "4 days left",
  },
  {
    category: "Design",
    reward: 90,
    title: "Annotate UI screenshots",
    buyer: "DesignLab",
    workers: "6 / 10 slots",
    deadline: "2 days left",
  },
];

export default function FeaturedTasks() {
  return (
    <section className="section">
      <div className="section-head row">
        <div>
          <span className="eyebrow">Fresh opportunities</span>
          <h2>Featured tasks</h2>
        </div>
        <Button variant="outline" asChild>
          <Link href="/tasks">
            Browse all tasks <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {tasks.map((t, i) => (
          <div
            className={`group relative overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] ${
              i < 2 ? "lg:col-span-3" : "lg:col-span-2"
            }`}
            key={t.title}
          >
            {/* Top shimmer accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="p-6">
              {/* Header: category + reward */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border bg-gradient-to-r px-3 py-1 text-xs font-bold ${
                    categoryColors[t.category] || categoryColors.Survey
                  }`}
                >
                  {t.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                  <Coins className="size-3.5" />+{t.reward}
                </span>
              </div>

              {/* Title + buyer */}
              <h3 className="mt-6 text-xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-2xl">
                {t.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                by{" "}
                <span className="font-medium text-foreground/70">
                  {t.buyer}
                </span>
              </p>

              {/* Meta row */}
              <div className="mt-6 flex items-center gap-4 rounded-2xl bg-surface/80 px-4 py-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  {t.workers}
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5" />
                  {t.deadline}
                </span>
              </div>

              {/* CTA button */}
              <Button
                variant="ghost"
                className="mt-4 w-full justify-between rounded-2xl text-sm font-semibold transition-colors hover:bg-primary/5 hover:text-primary"
                asChild
              >
                <Link href="/tasks">
                  View task <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
