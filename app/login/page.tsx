"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password
    });
    setSubmitting(false);
    if (!result) {
      setError("Unexpected error");
      return;
    }
    if (result.error) {
      setError("Invalid credentials");
      return;
    }
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    router.push(callbackUrl);
  }

  const registered = searchParams.get("registered") === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm border border-border bg-accent p-6">
        <h1 className="mb-2 text-lg font-semibold text-foreground">
          Salsabel Dashboard
        </h1>
        {registered && (
          <p className="mb-2 text-xs text-green-400">
            تم إنشاء الحساب بنجاح، قم بتسجيل الدخول الآن.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1 text-xs">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1 text-xs">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-xs text-red-400">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={submitting || !email || !password}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
          <button
            type="button"
            className="mt-2 w-full text-center text-[11px] text-muted underline"
            onClick={() => router.push("/register")}
          >
            إنشاء حساب جديد
          </button>
        </form>
      </div>
    </div>
  );
}
