import { Card, CardContent } from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import Pagination from "./Pagination";

/**
 * DataTable — a generic table inside a card with pagination footer.
 *
 * @param {{ headers: string[], rows: React.ReactNode[][], total?: number }} props
 */
export default function DataTable({ headers, rows, total }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((h) => (
                <TableHead className="px-2 sm:px-4 whitespace-nowrap" key={h}>
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell
                    className={`px-2 sm:px-4 py-2 sm:py-3 ${j === 0 ? "font-semibold" : ""}`}
                    key={j}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="border-t border-border p-2.5 sm:p-4">
          <Pagination total={total || rows.length} />
        </div>
      </CardContent>
    </Card>
  );
}
