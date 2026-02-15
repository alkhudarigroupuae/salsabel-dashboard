"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.message ?? "فشل إنشاء الحساب");
        setSubmitting(false);
        return;
      }
      router.push("/login?registered=1");
    } catch (err) {
      setError("خطأ في الاتصال، حاول مرة أخرى");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm border border-border bg-accent p-6">
        <h1 className="mb-4 text-lg font-semibold text-foreground">
          إنشاء حساب جديد
        </h1>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label htmlFor="name">الاسم</label>
            <Input
              id="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email">البريد الإلكتروني</label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password">كلمة المرور</label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={submitting || !name || !email || !password}
          >
            {submitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          </Button>
          <button
            type="button"
            className="mt-2 w-full text-center text-[11px] text-muted underline"
            onClick={() => router.push("/login")}
          >
            لديك حساب بالفعل؟ تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}

