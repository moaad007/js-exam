"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const params = useSearchParams();
  const number = params.get("number");

  return (
    <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl border border-brand-100">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-brand-700">Reservation Confirmed</h1>
      <p className="mt-3 text-gray-600">
        Thank you! Your reservation has been received and is pending confirmation.
      </p>
      {number && (
        <p className="mt-4 text-lg">
          Reservation number:{" "}
          <span className="font-bold text-brand-600">{number}</span>
        </p>
      )}
      <Link
        href="/"
        className="inline-block mt-6 bg-brand-600 text-white px-4 py-2 rounded hover:bg-brand-700"
      >
        Back to home
      </Link>
    </div>
  );
}

export default function ReservationSuccess() {
  return (
    <Suspense fallback={<p className="text-center py-10">Loading...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
