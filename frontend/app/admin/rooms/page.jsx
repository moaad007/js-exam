"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Pencil, Trash2, BedDouble, X } from "lucide-react";
import { riadService, roomService } from "@/services";
import { Spinner, ErrorMessage, EmptyState } from "@/components/Ui";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";

const ROOM_TYPES = ["Single", "Double", "Suite", "Family"];

export default function RoomsManager() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [form, setForm] = useState({
    id: null,
    riadId: "",
    name: "",
    type: "Double",
    pricePerNight: "",
    available: true,
  });

  const { data: rooms, isLoading, isError, error } = useQuery({
    queryKey: ["admin-rooms"],
    queryFn: roomService.all,
  });
  const { data: riads } = useQuery({
    queryKey: ["admin-riads-rooms"],
    queryFn: () => riadService.list({ limit: 100 }),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      form.id ? roomService.update(form.id, data) : roomService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-rooms"] });
      resetForm();
    },
  });
  const delMutation = useMutation({
    mutationFn: roomService.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-rooms"] }),
  });
  const toggleMutation = useMutation({
    mutationFn: (room) => roomService.update(room.id, { available: !room.available }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-rooms"] }),
  });

  const resetForm = () =>
    setForm({
      id: null,
      riadId: "",
      name: "",
      type: "Double",
      pricePerNight: "",
      available: true,
    });

  const submit = (e) => {
    e.preventDefault();
    const payload = { ...form, pricePerNight: Number(form.pricePerNight) };
    if (!payload.riadId) return alert("Select a riad");
    saveMutation.mutate(payload);
  };

  const filtered = (rooms || []).filter((r) =>
    q ? (r.name + " " + (r.riad?.name || "")).toLowerCase().includes(q.toLowerCase()) : true
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-ink">
        Manage Rooms
      </h1>

      <Card className="mb-6">
        <CardContent>
          <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:items-end">
            <div className="lg:col-span-2">
              <Label>Riad</Label>
              <Select
                value={form.riadId}
                onChange={(e) => setForm({ ...form, riadId: e.target.value })}
              >
                <option value="">Select riad</option>
                {riads?.data.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {ROOM_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Price / night</Label>
              <Input
                type="number"
                value={form.pricePerNight}
                onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                <Plus className="h-4 w-4" /> {form.id ? "Update" : "Add"}
              </Button>
              {form.id && (
                <Button type="button" variant="secondary" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="border-b border-border pb-0">
          <div className="max-w-xs">
            <Input icon={Search} placeholder="Search rooms..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </CardContent>
        <CardContent>
          {isError && <ErrorMessage message={error.message} />}
          {isLoading ? (
            <Spinner />
          ) : filtered.length === 0 ? (
            <EmptyState icon={BedDouble} title="No rooms found" description="Add a room using the form above." />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Room</TH>
                  <TH>Riad</TH>
                  <TH>Type</TH>
                  <TH>Price</TH>
                  <TH>Available</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.map((room) => (
                  <TR key={room.id}>
                    <TD className="font-medium text-ink">{room.name}</TD>
                    <TD className="text-ink-muted">{room.riad?.name}</TD>
                    <TD className="text-ink-muted">{room.type}</TD>
                    <TD className="font-medium text-ink">{room.pricePerNight} MAD</TD>
                    <TD>
                      <button onClick={() => toggleMutation.mutate(room)}>
                        <StatusBadge status={room.available ? "Available" : "Inactive"} />
                      </button>
                    </TD>
                    <TD>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setForm({
                              id: room.id,
                              riadId: room.riadId,
                              name: room.name,
                              type: room.type,
                              pricePerNight: room.pricePerNight,
                              available: room.available,
                            })
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-danger hover:bg-danger/10"
                          onClick={() => {
                            if (confirm("Delete this room?")) delMutation.mutate(room.id);
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
