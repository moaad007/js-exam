"use client";

import { Suspense } from "react";
import ReservationForm from "@/components/ReservationForm";

export default function ReservationPage() {
  return (
    <Suspense fallback={<p className="text-center py-10">Loading...</p>}>
      <ReservationForm />
    </Suspense>
  );
}
