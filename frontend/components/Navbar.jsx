"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Hotel, Menu, X } from "lucide-react";
import { isAuthenticated, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/riads", label: "Riads" },
  { href: "/reservation", label: "Reserve" },
];

export default function Navbar() {
  const [auth, setAuth] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setAuth(isAuthenticated()), []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-sidebar/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Hotel className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-ink">
            RiadReserve
          </span>
        </Link>

        <nav className="ml-8 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-bg hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {auth ? (
            <>
              <Link href="/admin" className="hidden sm:block">
                <Button size="sm" variant="ghost">
                  Dashboard
                </Button>
              </Link>
              <Button
                size="sm"
                variant="secondary"
                className="hidden sm:inline-flex"
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/admin/login" className="hidden sm:block">
              <Button size="sm">Admin Login</Button>
            </Link>
          )}
          <button
            className="rounded-lg p-2 text-ink-muted hover:bg-bg md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-sidebar px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-bg hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            {auth ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-brand-600"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-brand-600"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
