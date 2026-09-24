export function Table({ children, className = "", ...props }) {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = "", ...props }) {
  return (
    <thead className={`[&_tr]:border-b ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "", ...props }) {
  return (
    <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "", ...props }) {
  return (
    <tr
      className={`border-b border-border transition-colors hover:bg-muted/50 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "", ...props }) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", ...props }) {
  return (
    <td className={`px-4 py-3 align-middle ${className}`} {...props}>
      {children}
    </td>
  );
}

export default Table;
