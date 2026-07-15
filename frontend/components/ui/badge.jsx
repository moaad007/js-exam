import { cn } from "@/lib/utils";

const variants = {
  available: "bg-success/10 text-success",
  booked: "bg-info/10 text-info",
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
  inactive: "bg-ink-muted/10 text-ink-muted",
  default: "bg-ink-muted/10 text-ink-muted",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  warning: "bg-warning/10 text-warning",
};

export function Badge({ className, variant = "default", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Pending: "pending",
    Confirmed: "confirmed",
    Cancelled: "cancelled",
    Available: "available",
    Booked: "booked",
    Inactive: "inactive",
  };
  return (
    <Badge variant={map[status] || "default"}>
      {status === "Confirmed" && "● "}
      {status}
    </Badge>
  );
}
