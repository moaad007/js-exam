"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Hotel, Mail, Lock, ArrowRight } from "lucide-react";
import { authService } from "@/services";
import { setToken } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@riad.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await authService.login({ email, password });
      setToken(token);
      router.push("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Hotel className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold tracking-tight text-ink">
            RiadReserve
          </span>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h1 className="text-center text-xl font-semibold tracking-tight text-ink">
              Admin Login
            </h1>
            <p className="mb-6 mt-1 text-center text-sm text-ink-muted">
              Sign in to manage your riads.
            </p>

            {error && (
              <div className="mb-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  icon={Lock}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Signing in..." : (
                  <>
                    Sign in <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-5 text-center text-xs text-ink-muted">
              Default: <code className="text-ink">admin@riad.com / admin123</code>
            </p>
            <div className="mt-3 text-center">
              <Link href="/" className="text-sm text-brand-600 hover:underline">
                ← Back to site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
