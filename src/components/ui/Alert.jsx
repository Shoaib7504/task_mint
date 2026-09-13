export function Alert({ children, variant = "default", className = "", ...props }) {
  const variants = {
    default: "border-border bg-background text-foreground",
    destructive: "border-danger/50 bg-danger/5 text-danger",
  };

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${variants[variant] ?? variants.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertDescription({ children, className = "" }) {
  return <div className={`text-sm leading-relaxed ${className}`}>{children}</div>;
}

export default Alert;
