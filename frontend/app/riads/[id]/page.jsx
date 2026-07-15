"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MapPin, BedDouble, Check, X, ArrowRight } from "lucide-react";
import { riadService } from "@/services";
import { Spinner, ErrorMessage } from "@/components/Ui";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RiadDetail() {
  const params = useParams();
  const id = params.id;

  const { data: riad, isLoading, isError, error } = useQuery({
    queryKey: ["riad", id],
    queryFn: () => riadService.get(id),
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage message={error.message} />;
  if (!riad) return <p className="text-ink-muted">Riad not found.</p>;

  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-cover bg-center lg:h-96">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${riad.imageUrl})` }}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <Badge variant="info">
              <MapPin className="h-3.5 w-3.5" /> {riad.city}
            </Badge>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            {riad.name}
          </h1>
          <p className="mt-1 text-ink-muted">{riad.address}</p>
          <p className="mt-5 leading-relaxed text-ink-muted">
            {riad.description}
          </p>

          <h2 className="mb-4 mt-10 text-xl font-semibold tracking-tight text-ink">
            Available Rooms
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {riad.rooms.map((room) => (
              <Card key={room.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                      <BedDouble className="h-4 w-4" />
                    </span>
                    <h3 className="font-semibold text-ink">{room.name}</h3>
                  </div>
                  <Badge variant={room.available ? "available" : "inactive"}>
                    {room.available ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Available
                      </>
                    ) : (
                      <>
                        <X className="h-3.5 w-3.5" /> Booked
                      </>
                    )}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-ink-muted">
                    {room.type} ·{" "}
                    <span className="font-semibold text-ink">
                      {room.pricePerNight} MAD
                    </span>{" "}
                    / night
                  </span>
                  <Link href={`/reservation?roomId=${room.id}`}>
                    <Button size="sm" variant={room.available ? "primary" : "secondary"} disabled={!room.available}>
                      Reserve
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
            {riad.rooms.length === 0 && (
              <p className="text-ink-muted">No rooms listed yet.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <Card className="p-6">
              <p className="text-sm text-ink-muted">Starts from</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">
                {riad.pricePerNight}{" "}
                <span className="text-base font-normal text-ink-muted">MAD / night</span>
              </p>
              <div className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">City</span>
                  <span className="font-medium text-ink">{riad.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Rooms</span>
                  <span className="font-medium text-ink">{riad.rooms.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Available now</span>
                  <span className="font-medium text-ink">
                    {riad.rooms.filter((r) => r.available).length}
                  </span>
                </div>
              </div>
              <Link href="/reservation" className="mt-6 block">
                <Button className="w-full" size="lg">
                  Book this Riad
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
