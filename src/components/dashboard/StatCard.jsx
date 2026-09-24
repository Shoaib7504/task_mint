import { Card, CardContent } from "@/components/ui/Card";

/**
 * StatCard — a metric card with icon, value, label, and change indicator.
 *
 * @param {{ label: string, value: string, change: string, icon: import('lucide-react').LucideIcon, tone?: string }} props
 */
export default function StatCard({ label, value, change, icon: Icon, tone = "primary" }) {
  return (
    <Card className="metric-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <span className={`metric-icon ${tone}`}>
            <Icon />
          </span>
          <span className="rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
            {change}
          </span>
        </div>
        <p className="mt-6 text-3xl font-semibold">{value}</p>
        <p className="mt-1 text-xs font-medium uppercase text-muted-foreground">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}
