"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  CalendarDays,
  BedDouble,
  User,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { roomService, reservationService } from "@/services";
import { Spinner } from "@/components/Ui";
import { Input, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const schema = z
  .object({
    roomId: z.string().min(1, "Select a room"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(1, "Phone is required"),
  })
  .refine((d) => !d.endDate || new Date(d.endDate) > new Date(d.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

const STEPS = [
  { title: "Dates", icon: CalendarDays },
  { title: "Room", icon: BedDouble },
  { title: "Guest", icon: User },
  { title: "Confirm", icon: Check },
];

const FIELDS = [
  ["startDate", "endDate"],
  ["roomId"],
  ["firstName", "lastName", "email", "phone"],
  [],
];

export default function ReservationForm() {
  const searchParams = useSearchParams();
  const prefillRoom = searchParams.get("roomId") || "";
  const [step, setStep] = useState(0);

  const { data: rooms, isLoading } = useQuery({
    queryKey: ["rooms-all"],
    queryFn: roomService.all,
  });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { roomId: prefillRoom },
  });

  const mutation = useMutation({
    mutationFn: reservationService.create,
    onSuccess: (data) => {
      reset();
      window.location.href = `/reservation/success?number=${data.reservationNumber}`;
    },
  });

  const values = watch();
  const nights =
    values.startDate && values.endDate
      ? Math.max(
          0,
          Math.round(
            (new Date(values.endDate) - new Date(values.startDate)) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;
  const selectedRoom = rooms?.find((r) => r.id === values.roomId);

  const next = async () => {
    const valid = await trigger(FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const submit = (data) => mutation.mutate(data);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Make a Reservation
        </h1>
        <p className="mt-1 text-ink-muted">
          A few steps to secure your stay.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8 flex items-center justify-center">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.title} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    done
                      ? "border-brand-500 bg-brand-500 text-white"
                      : active
                        ? "border-brand-500 text-brand-600"
                        : "border-border text-ink-muted"
                  }`}
                >
                  {done ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                </div>
                <span
                  className={`text-xs font-medium ${
                    active || done ? "text-ink" : "text-ink-muted"
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-8 rounded lg:w-16 ${
                    i < step ? "bg-brand-500" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <Card>
        <CardContent className="pt-6">
          {mutation.isError && (
            <div className="mb-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
              {mutation.error.response?.data?.error ||
                "Failed to create reservation."}
            </div>
          )}

          {isLoading ? (
            <Spinner />
          ) : (
            <form onSubmit={handleSubmit(submit)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label>Arrival</Label>
                        <Input
                          type="date"
                          icon={CalendarDays}
                          {...register("startDate")}
                        />
                        {errors.startDate && (
                          <p className="mt-1 text-sm text-danger">
                            {errors.startDate.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Departure</Label>
                        <Input
                          type="date"
                          icon={CalendarDays}
                          {...register("endDate")}
                        />
                        {errors.endDate && (
                          <p className="mt-1 text-sm text-danger">
                            {errors.endDate.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <Label>Choose a room</Label>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {rooms?.map((room) => {
                          const sel = values.roomId === room.id;
                          return (
                            <label
                              key={room.id}
                              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                                sel
                                  ? "border-brand-500 bg-brand-50"
                                  : "border-border hover:border-brand-500/40"
                              }`}
                            >
                              <input
                                type="radio"
                                value={room.id}
                                {...register("roomId")}
                                className="sr-only"
                              />
                              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                                <BedDouble className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-medium text-ink">
                                  {room.riad?.name} — {room.name}
                                </span>
                                <span className="text-xs text-ink-muted">
                                  {room.type} · {room.pricePerNight} MAD
                                </span>
                              </span>
                              <Badge variant={room.available ? "available" : "inactive"}>
                                {room.available ? "Free" : "Booked"}
                              </Badge>
                            </label>
                          );
                        })}
                      </div>
                      {errors.roomId && (
                        <p className="mt-2 text-sm text-danger">
                          {errors.roomId.message}
                        </p>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label>First name</Label>
                        <Input icon={User} {...register("firstName")} />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-danger">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Last name</Label>
                        <Input {...register("lastName")} />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-danger">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Email</Label>
                        <Input type="email" {...register("email")} />
                        {errors.email && (
                          <p className="mt-1 text-sm text-danger">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Phone</Label>
                        <Input {...register("phone")} />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-danger">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-ink">
                        Review your booking
                      </p>
                      <div className="rounded-xl border border-border bg-bg p-4 text-sm">
                        <Row label="Riad / Room" value={selectedRoom ? `${selectedRoom.riad?.name} — ${selectedRoom.name}` : "-"} />
                        <Row
                          label="Dates"
                          value={
                            values.startDate && values.endDate
                              ? `${values.startDate} → ${values.endDate} (${nights} nights)`
                              : "-"
                          }
                        />
                        <Row label="Guest" value={`${values.firstName || ""} ${values.lastName || ""}`.trim()} />
                        <Row label="Email" value={values.email} />
                        <Row label="Phone" value={values.phone} />
                        {selectedRoom && (
                          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-semibold text-ink">
                            <span>Estimated total</span>
                            <span className="text-brand-600">
                              {selectedRoom.pricePerNight * nights} MAD
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep((s) => s - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                ) : (
                  <span />
                )}

                {step < STEPS.length - 1 ? (
                  <Button type="button" onClick={next}>
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Submitting..." : "Confirm Reservation"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-ink-muted">{label}</span>
      <span className="font-medium text-ink">{value || "-"}</span>
    </div>
  );
}
