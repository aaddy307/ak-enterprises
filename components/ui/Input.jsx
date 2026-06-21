"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export const Input = forwardRef(
  (
    {
      className,
      type = "text",
      icon,
      error,
      label,
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
              <Icon name={icon} size={20} />
            </span>
          )}
          <input
            type={type}
            ref={ref}
            placeholder={placeholder}
            className={cn(
              "w-full bg-surface-container-low border border-outline/20 rounded-lg",
              "px-4 py-4 text-on-surface placeholder:text-on-surface-variant/50",
              "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
              "transition-all duration-300",
              icon && "pl-12",
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
