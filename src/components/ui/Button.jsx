import { forwardRef } from "react";

const sizeMap = {
  sm: "h-8 px-3 text-xs rounded-md",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-11 px-6 text-sm rounded-lg",
  xl: "h-12 px-8 text-base font-semibold rounded-xl",
  icon: "size-10 rounded-lg",
};

const variantMap = {
  primary:
    "bg-primary text-primary-foreground shadow-brand hover:brightness-110",
  outline:
    "border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground",
  ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
  success:
    "bg-success text-success-foreground shadow-success hover:brightness-110",
  darkOutline:
    "border border-ink-border text-ink-foreground hover:bg-ink-soft",
};

const Button = forwardRef(function Button(
  {
    children,
    className = "",
    variant = "primary",
    size = "md",
    asChild = false,
    ...props
  },
  ref,
) {
  const classes = `inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all cursor-pointer ${variantMap[variant] ?? variantMap.primary} ${sizeMap[size] ?? sizeMap.md} ${className}`;

  // asChild: render the single child element with merged classes
  if (asChild) {
    const { children: child, ...rest } = props;
    // Expect a single child element
    const onlyChild =
      Array.isArray(children) ? children[0] : children;
    if (!onlyChild?.props) {
      return (
        <span ref={ref} className={classes} {...rest}>
          {children}
        </span>
      );
    }
    const { className: childClass = "", ...childProps } = onlyChild.props;
    // Clone element approach – works with Next Link etc.
    return (
      <onlyChild.type
        ref={ref}
        className={`${classes} ${childClass}`}
        {...rest}
        {...childProps}
      >
        {onlyChild.props.children}
      </onlyChild.type>
    );
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});

Button.displayName = "Button";
export { Button };
export default Button;
