import Link from "next/link";
import { ArrowRight, CalendarDays, Coins, Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/Button";

/**
 * TaskMarketplaceCard — a visually rich card for the task marketplace.
 */
export default function TaskMarketplaceCard({ task }) {
  return (
    <Card className="task-card overflow-hidden">
      {/* Colored top band */}
      <div className="h-2 bg-gradient-to-r from-primary to-info" />
      <CardContent className="p-5">
        {/* Category + buyer */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge>{task.category}</StatusBadge>
          <StatusBadge tone="success">Verified</StatusBadge>
        </div>

        <h3 className="mt-3 text-base font-bold leading-snug">{task.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{task.buyer}</p>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Coins className="size-3.5 text-info" />
            <b className="text-foreground">{task.reward} coins</b>
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            {task.requiredWorkers} / {task.workers}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {task.deadline}
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="size-3.5 text-warning" />
            4.9 rating
          </span>
        </div>

        {/* CTA */}
        <Button asChild variant="outline" className="mt-4 w-full">
          <Link href={`/dashboard/worker/tasks/${task.id}`}>
            View details <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
