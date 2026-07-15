"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { isAuthenticated, logout } from "@/lib/auth";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const [ready, setReady] = useState(isLogin);

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    if (!isAuthenticated()) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [router, isLogin]);

  if (!ready) {
    return <p className="py-20 text-center text-ink-muted">Checking access...</p>;
  }

  if (isLogin) return children;

  return <AdminShell>{children}</AdminShell>;
}
