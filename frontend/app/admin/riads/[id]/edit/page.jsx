"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { riadService } from "@/services";
import RiadForm from "@/components/RiadForm";
import { Spinner } from "@/components/Ui";

export default function EditRiadPage() {
  const params = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["riad-edit", params.id],
    queryFn: () => riadService.get(params.id),
  });

  if (isLoading) return <Spinner />;
  if (!data) return <p className="text-ink-muted">Riad not found.</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-ink">
        Edit Riad
      </h1>
      <RiadForm initial={data} />
    </div>
  );
}
