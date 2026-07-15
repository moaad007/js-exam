"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Hotel,
  BedDouble,
  CheckCircle2,
  CalendarDays,
  DollarSign,
} from "lucide-react";
import { statsService, reservationService } from "@/services";
import { Spinner, ErrorMessage } from "@/components/Ui";
import KpiCard from "@/components/KpiCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/badge";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function last6() {
  const out = [];
  const d = new Date();
  for (let i = 5; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push({ key: `${m.getFullYear()}-${m.getMonth()}`, label: MONTHS[m.getMonth()] });
  }
  return out;
}

export default function AdminDashboard() {
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ["stats"],
    queryFn: statsService.get,
  });
  const { data: reservations } = useQuery({
    queryKey: ["reservations"],
    queryFn: reservationService.list,
  });

  const { revenue, revSeries, resSeries, topRiads } = useMemo(() => {
    const list = reservations || [];
    let revenue = 0;
    const revMap = {};
    const resMap = {};
    last6().forEach((m) => {
      revMap[m.key] = 0;
      resMap[m.key] = 0;
    });
    list.forEach((r) => {
      const nights = Math.max(
        0,
        Math.round(
          (new Date(r.endDate) - new Date(r.startDate)) /
            (1000 * 60 * 60 * 24)
        )
      );
      const amt = (r.room.pricePerNight || 0) * nights;
      revenue += r.status === "Cancelled" ? 0 : amt;
      const d = new Date(r.startDate);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (revMap[key] !== undefined) {
        revMap[key] += amt;
        resMap[key] += 1;
      }
    });
    const months = last6();
    const revSeries = months.map((m) => ({ label: m.label, value: Math.round(revMap[m.key]) }));
    const resSeries = months.map((m) => ({ label: m.label, value: resMap[m.key] }));

    const byRiad = {};
    list.forEach((r) => {
      const name = r.room.riad?.name || "Unknown";
      byRiad[name] = (byRiad[name] || 0) + 1;
    });
    const topRiads = Object.entries(byRiad)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { revenue, revSeries, resSeries, topRiads };
  }, [reservations]);

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage message={error.message} />;

  const recent = (reservations || []).slice(0, 5);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard icon={Hotel} label="Total Riads" value={stats.totalRiads} accent="brand" hint="Properties listed" />
        <KpiCard icon={BedDouble} label="Total Rooms" value={stats.totalRooms} accent="info" hint="Across all riads" />
        <KpiCard icon={CheckCircle2} label="Available Rooms" value={stats.availableRooms} accent="success" />
        <KpiCard icon={CalendarDays} label="Reservations" value={stats.reservations} accent="warning" />
        <KpiCard icon={DollarSign} label="Revenue" value={`${revenue} MAD`} accent="brand" hint="Excl. cancelled" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revSeries}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#64748B" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#64748B" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    fontSize: 12,
                  }}
                  formatter={(v) => [`${v} MAD`, "Revenue"]}
                />
                <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reservation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={resSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#64748B" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#64748B" allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "#F8FAFC" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Latest Reservations</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <THead>
                <TR>
                  <TH>Customer</TH>
                  <TH>Room</TH>
                  <TH>Dates</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {recent.map((r) => (
                  <TR key={r.id}>
                    <TD>
                      <div className="font-medium text-ink">
                        {r.client.firstName} {r.client.lastName}
                      </div>
                      <div className="text-xs text-ink-muted">{r.client.email}</div>
                    </TD>
                    <TD className="text-ink-muted">{r.room.name}</TD>
                    <TD className="text-ink-muted">
                      {new Date(r.startDate).toLocaleDateString()} →{" "}
                      {new Date(r.endDate).toLocaleDateString()}
                    </TD>
                    <TD>
                      <StatusBadge status={r.status} />
                    </TD>
                  </TR>
                ))}
                {recent.length === 0 && (
                  <TR>
                    <TD colSpan={4} className="text-center text-ink-muted">
                      No reservations yet.
                    </TD>
                  </TR>
                )}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Riads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {topRiads.length === 0 && (
              <p className="text-sm text-ink-muted">No data yet.</p>
            )}
            {topRiads.map(([name, count], i) => (
              <div key={name} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-xs font-semibold text-brand-600">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{name}</p>
                </div>
                <span className="text-sm text-ink-muted">{count} bookings</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
