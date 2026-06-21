"use client";

import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

const variants = {
  primary:
    "bg-primary text-on-primary hover:brightness-110 shadow-lg shadow-primary/10",
  secondary:
    "border border-primary text-primary hover:bg-primary/10",
  outlined:
    "border border-outline text-on-surface hover:border-primary hover:text-primary",
  ghost:
    "text-on-surface hover:bg-surface-container",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3",
  lg: "px-10 py-4 text-lg",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  className,
  disabled = false,
  loading = false,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300",
        "hover:scale-[1.02] active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Icon name="hourglass_empty" size={18} className="animate-spin" />
      ) : icon && iconPosition === "left" ? (
        <Icon name={icon} size={18} />
      ) : null}
      {children}
      {!loading && icon && iconPosition === "right" ? (
        <Icon name={icon} size={18} />
      ) : null}
    </button>
  );
}
