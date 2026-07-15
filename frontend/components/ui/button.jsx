import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-500 text-white shadow-sm hover:bg-brand-600 hover:shadow-lift",
        secondary:
          "bg-white text-ink border border-border hover:bg-bg hover:border-brand-500/40",
        danger: "bg-danger text-white shadow-sm hover:bg-red-600",
        success: "bg-success text-white shadow-sm hover:bg-green-600",
        ghost: "text-ink-muted hover:bg-bg hover:text-ink",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-5 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
