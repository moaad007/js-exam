import Link from "next/link";
import { cn } from "@/lib/utils";

export function Spinner({ className }) {
  return (
    <div className="flex justify-center py-12">
      <div
        className={cn(
          "h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500",
          className
        )}
      />
    </div>
  );
}

export function ErrorMessage({ message, className }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger",
        className
      )}
    >
      {message || "Something went wrong."}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      )}
      {action}
    </div>
  );
}

export function Pagination({ page, total, limit, onPageChange }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="h-9 rounded-lg border border-border px-3 text-sm text-ink-muted transition hover:bg-bg disabled:opacity-40"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            "h-9 w-9 rounded-lg text-sm transition",
            p === page
              ? "bg-brand-500 text-white"
              : "border border-border text-ink-muted hover:bg-bg"
          )}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="h-9 rounded-lg border border-border px-3 text-sm text-ink-muted transition hover:bg-bg disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
