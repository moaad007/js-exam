import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full text-sm", className)} {...props} />
    </div>
  );
}

export function THead({ className, ...props }) {
  return (
    <thead
      className={cn("border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-ink-muted", className)}
      {...props}
    />
  );
}

export function TH({ className, ...props }) {
  return <th className={cn("px-4 py-3 font-medium", className)} {...props} />;
}

export function TBody({ className, ...props }) {
  return (
    <tbody className={cn("divide-y divide-border", className)} {...props} />
  );
}

export function TR({ className, ...props }) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-bg/70",
        className
      )}
      {...props}
    />
  );
}

export function TD({ className, ...props }) {
  return <td className={cn("px-4 py-3 align-middle", className)} {...props} />;
}
