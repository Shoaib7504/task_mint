import { Button } from "@/components/ui/Button";

/**
 * Simple pagination component.
 *
 * @param {{ current?: number, total?: number, pageSize?: number }} props
 */
export default function Pagination({ current = 1, total = 24, pageSize = 6 }) {
  const totalPages = Math.ceil(total / pageSize);
  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex gap-1">
        <Button size="sm" variant="outline" disabled={current === 1}>
          Previous
        </Button>
        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => (
          <Button
            key={i + 1}
            size="sm"
            variant={i + 1 === current ? "primary" : "outline"}
          >
            {i + 1}
          </Button>
        ))}
        <Button size="sm" variant="outline" disabled={current === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}
