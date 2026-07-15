"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function KpiCard({ icon: Icon, label, value, hint, accent = "brand" }) {
  const accents = {
    brand: "bg-brand-50 text-brand-500",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "tween", duration: 0.15 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-soft"
    >
      <div className="flex items-center justify-between">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", accents[accent])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-ink-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </motion.div>
  );
}
