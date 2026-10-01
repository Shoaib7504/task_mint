import { Card, CardContent } from "@/components/ui/Card";

/**
 * StatCard — a metric card with icon, value, label, and change indicator.
 *
 * @param {{ label: string, value: string, change: string, icon: import('lucide-react').LucideIcon, tone?: string }} props
 */
export default function StatCard({ label, value, change, icon: Icon, tone = "primary" }) {
  return (
    <Card className="metric-card">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <span className={`metric-icon shrink-0 ${tone}`}>
            <Icon />
          </span>
          <span className="rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground truncate max-w-[140px] sm:max-w-none text-right">
            {change}
          </span>
        </div>
        <p className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-semibold break-words tracking-tight">{value}</p>
        <p className="mt-1 text-xs font-medium uppercase text-muted-foreground truncate">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}
