import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
  outline: "border border-primary text-primary bg-transparent",
};

const sizes = {
  xs: "px-2 py-0.5 text-[10px]",
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-1.5 text-sm",
};

export function Badge({
  children,
  variant = "primary",
  size = "sm",
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-block rounded font-semibold uppercase tracking-widest",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
