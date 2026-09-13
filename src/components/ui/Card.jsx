export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-xl border border-border bg-card text-card-foreground shadow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export default Card;
