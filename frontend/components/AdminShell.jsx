"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Hotel,
  BedDouble,
  CalendarDays,
  Users,
  Settings,
  Menu,
  Search,
  Bell,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Riads", href: "/admin/riads", icon: Hotel },
  { label: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { label: "Reservations", href: "/admin/reservations", icon: CalendarDays },
  { label: "Clients", href: null, icon: Users, soon: true },
  { label: "Settings", href: null, icon: Settings, soon: true },
];

function SidebarContent({ pathname, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
          <Hotel className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-ink">
          RiadReserve
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active =
            item.href && pathname === item.href ||
            (item.href && item.href !== "/admin" && pathname.startsWith(item.href));
          if (!item.href) {
            return (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-ink-muted/50"
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                <span className="rounded bg-ink-muted/10 px-1.5 py-0.5 text-[10px] font-medium">
                  Soon
                </span>
              </div>
            );
          }
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-brand-50 text-brand-600"
                  : "text-ink-muted hover:bg-bg hover:text-ink"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-xl bg-bg p-3 text-xs text-ink-muted">
          <p className="font-medium text-ink">Admin workspace</p>
          <p>Manage your riads & bookings.</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);

  useEffect(() => setDrawer(false), [pathname]);

  const title =
    NAV.find((n) => n.href && pathname.startsWith(n.href))?.label || "Dashboard";
  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <SidebarContent pathname={pathname} onNavigate={() => setDrawer(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-sidebar/80 px-4 backdrop-blur lg:px-8">
          <button
            className="rounded-lg p-2 text-ink-muted hover:bg-bg lg:hidden"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden min-w-0 flex-col lg:flex">
            <div className="flex items-center gap-1 text-xs text-ink-muted">
              <span>Admin</span>
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3" />
                  <span className="capitalize">{c}</span>
                </span>
              ))}
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-ink">
              {title}
            </h1>
          </div>

          <div className="relative ml-auto hidden max-w-xs flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              placeholder="Search..."
              className="input-base pl-9"
              aria-label="Search"
            />
          </div>

          <button
            className="relative rounded-lg p-2 text-ink-muted hover:bg-bg"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
          </button>

          <button
            onClick={() => {
              logout();
              router.replace("/admin/login");
            }}
            className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-bg"
            aria-label="Account"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
              A
            </span>
          </button>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
