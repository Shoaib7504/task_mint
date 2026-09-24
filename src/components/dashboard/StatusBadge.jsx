/**
 * StatusBadge — a colored status pill.
 *
 * @param {{ children: React.ReactNode, tone?: "info" | "success" | "warning" | "danger" }} props
 */
export default function StatusBadge({ children, tone = "info" }) {
  return <span className={`status ${tone}`}>{children}</span>;
}
