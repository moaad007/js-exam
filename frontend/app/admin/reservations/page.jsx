"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, CalendarDays, ArrowUpDown } from "lucide-react";
import { reservationService } from "@/services";
import { Spinner, ErrorMessage, EmptyState } from "@/components/Ui";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STATUSES = ["All", "Pending", "Confirmed", "Cancelled"];

export default function ReservationsManager() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reservations"],
    queryFn: reservationService.list,
  });

  const rows = useMemo(() => {
    let list = data || [];
    if (status !== "All") list = list.filter((r) => r.status === status);
    if (q) {
      const t = q.toLowerCase();
      list = list.filter(
        (r) =>
          (r.client.firstName + " " + r.client.lastName).toLowerCase().includes(t) ||
          r.client.email.toLowerCase().includes(t)
      );
    }
    list = [...list].sort((a, b) =>
      sort === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
    return list;
  }, [data, q, status, sort]);

  const mutation = useMutation({
    mutationFn: ({ id, status }) => reservationService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reservations"] }),
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-ink">
        Reservations
      </h1>

      <Card>
        <CardContent className="flex flex-col gap-3 border-b border-border pb-0 sm:flex-row sm:items-center">
          <div className="max-w-xs flex-1">
            <Input
              icon={Search}
              placeholder="Search guest or email..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-40">
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Button
            variant="secondary"
            onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sort === "newest" ? "Newest" : "Oldest"}
          </Button>
        </CardContent>

        <CardContent>
          {isError && <ErrorMessage message={error.message} />}
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No reservations"
              description="Reservations will appear here once guests book a room."
            />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Customer</TH>
                  <TH>Room</TH>
                  <TH>Riad</TH>
                  <TH>Arrival</TH>
                  <TH>Departure</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {rows.map((r) => (
                  <TR key={r.id}>
                    <TD>
                      <div className="font-medium text-ink">
                        {r.client.firstName} {r.client.lastName}
                      </div>
                      <div className="text-xs text-ink-muted">{r.client.email}</div>
                    </TD>
                    <TD className="text-ink-muted">{r.room.name}</TD>
                    <TD className="text-ink-muted">{r.room.riad?.name}</TD>
                    <TD className="text-ink-muted">
                      {new Date(r.startDate).toLocaleDateString()}
                    </TD>
                    <TD className="text-ink-muted">
                      {new Date(r.endDate).toLocaleDateString()}
                    </TD>
                    <TD>
                      <StatusBadge status={r.status} />
                    </TD>
                    <TD>
                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={() => mutation.mutate({ id: r.id, status: "Confirmed" })}
                          disabled={r.status === "Confirmed"}
                          className="text-sm font-medium text-success hover:underline disabled:opacity-30"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => mutation.mutate({ id: r.id, status: "Cancelled" })}
                          disabled={r.status === "Cancelled"}
                          className="text-sm font-medium text-danger hover:underline disabled:opacity-30"
                        >
                          Cancel
                        </button>
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
