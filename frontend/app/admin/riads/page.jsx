"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2, Hotel } from "lucide-react";
import { riadService } from "@/services";
import { Spinner, ErrorMessage, EmptyState } from "@/components/Ui";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminRiads() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-riads"],
    queryFn: () => riadService.list({ limit: 100 }),
  });

  const delMutation = useMutation({
    mutationFn: riadService.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-riads"] }),
  });

  const rows = useMemo(() => {
    const list = data?.data || [];
    if (!q) return list;
    const t = q.toLowerCase();
    return list.filter(
      (r) =>
        r.name.toLowerCase().includes(t) || r.city.toLowerCase().includes(t)
    );
  }, [data, q]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Manage Riads
          </h1>
          <p className="text-sm text-ink-muted">
            {data?.total ?? 0} properties
          </p>
        </div>
        <Link href="/admin/riads/new">
          <Button>
            <Plus className="h-4 w-4" /> New Riad
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="border-b border-border pb-0">
          <div className="max-w-xs">
            <Input
              icon={Search}
              placeholder="Search riads..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </CardContent>

        <CardContent>
          {isError && <ErrorMessage message={error.message} />}
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <EmptyState
              icon={Hotel}
              title="No riads found"
              description="Create your first riad to start accepting reservations."
              action={
                <Link href="/admin/riads/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4" /> New Riad
                  </Button>
                </Link>
              }
            />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Riad</TH>
                  <TH>City</TH>
                  <TH>Price / night</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {rows.map((riad) => (
                  <TR key={riad.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <span
                          className="h-10 w-10 shrink-0 rounded-xl bg-cover bg-center"
                          style={{ backgroundImage: `url(${riad.imageUrl})` }}
                        />
                        <span className="font-medium text-ink">{riad.name}</span>
                      </div>
                    </TD>
                    <TD className="text-ink-muted">{riad.city}</TD>
                    <TD className="font-medium text-ink">
                      {riad.pricePerNight} MAD
                    </TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/riads/${riad.id}/edit`}>
                          <Button size="sm" variant="ghost">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-danger hover:bg-danger/10"
                          onClick={() => {
                            if (confirm("Delete this riad?")) delMutation.mutate(riad.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
