"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, Hotel } from "lucide-react";
import { riadService } from "@/services";
import RiadCard from "@/components/RiadCard";
import { Spinner, ErrorMessage, Pagination, EmptyState } from "@/components/Ui";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LIMIT = 6;

function CardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
    </Card>
  );
}

export default function RiadExplorer() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["riads", page, search, city],
    queryFn: () => riadService.list({ page, limit: LIMIT, search, city }),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Discover Riads
        </h1>
        <p className="mt-1 text-ink-muted">
          Authentic Moroccan riads for your perfect stay in Marrakech & beyond.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="sm:w-56">
            <Input
              icon={SlidersHorizontal}
              placeholder="Filter by city..."
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {isError && <ErrorMessage message={error.message} />}

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {data && data.data.length === 0 && (
        <EmptyState
          icon={Hotel}
          title="No riads found"
          description="Try adjusting your search or city filter to discover more stays."
        />
      )}

      {data && data.data.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((riad) => (
            <RiadCard key={riad.id} riad={riad} />
          ))}
        </div>
      )}

      {data && (
        <Pagination
          page={page}
          total={data.total}
          limit={LIMIT}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
