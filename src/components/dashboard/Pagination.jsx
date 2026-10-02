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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-center sm:text-left">
      <p className="text-[11px] sm:text-xs text-muted-foreground">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1">
        <Button size="sm" variant="outline" disabled={current === 1} className="text-xs px-2 sm:px-3">
          <span className="sm:hidden">Prev</span>
          <span className="hidden sm:inline">Previous</span>
        </Button>
        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => (
          <Button
            key={i + 1}
            size="sm"
            variant={i + 1 === current ? "primary" : "outline"}
            className="text-xs px-2.5 sm:px-3"
          >
            {i + 1}
          </Button>
        ))}
        <Button size="sm" variant="outline" disabled={current === totalPages} className="text-xs px-2 sm:px-3">
          Next
        </Button>
      </div>
    </div>
  );
}
