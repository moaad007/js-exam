import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef(
  ({ className, icon: Icon, ...props }, ref) => {
    return (
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        )}
        <input
          ref={ref}
          className={cn("input-base", Icon && "pl-9", className)}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn("input-base appearance-none pr-8", className)}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

export function Label({ className, ...props }) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-medium text-ink", className)}
      {...props}
    />
  );
}
