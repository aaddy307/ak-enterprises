"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export const Select = forwardRef(
  ({ className, options = [], label, error, placeholder, icon, ...props }, ref) => {
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
          <select
            ref={ref}
            className={cn(
              "w-full bg-surface-container-low border border-outline-variant rounded-lg",
              "px-4 py-3 text-on-surface appearance-none",
              "focus:outline-none focus:border-primary transition-colors",
              "cursor-pointer",
              icon && "pl-12",
              error && "border-error",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-surface-container text-on-surface"
              >
                {option.label}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
            <Icon name="expand_more" size={20} />
          </span>
        </div>
        {error && <p className="mt-2 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
