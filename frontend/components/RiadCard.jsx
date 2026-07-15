import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RiadCard({ riad }) {
  return (
    <Link
      href={`/riads/${riad.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative h-48 overflow-hidden">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${riad.imageUrl})` }}
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ink shadow-sm backdrop-blur">
          <MapPin className="h-3.5 w-3.5 text-brand-500" />
          {riad.city}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold tracking-tight text-ink">{riad.name}</h3>
          <span className="whitespace-nowrap text-sm font-semibold text-brand-600">
            {riad.pricePerNight} MAD
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
          {riad.description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-ink-muted">per night</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600">
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
