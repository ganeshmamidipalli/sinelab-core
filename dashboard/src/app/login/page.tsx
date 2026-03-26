"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "client";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with Supabase auth
    if (role === "ceo") {
      router.push("/ceo/dashboard");
    } else {
      router.push("/client/portal");
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-semibold text-text-primary">
            SineLab
          </Link>
          <p className="text-sm text-text-muted mt-2">
            {role === "ceo" ? "CEO Command Center" : "Client Portal"}
          </p>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
          {/* Role Toggle */}
          <div className="flex bg-bg-secondary rounded-lg p-1 mb-6">
            <button
              onClick={() => router.replace("/login?role=client")}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition ${
                role === "client"
                  ? "bg-white text-text-primary shadow-sm"
                  : "text-text-muted"
              }`}
            >
              Client
            </button>
            <button
              onClick={() => router.replace("/login?role=ceo")}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition ${
                role === "ceo"
                  ? "bg-white text-text-primary shadow-sm"
                  : "text-text-muted"
              }`}
            >
              CEO
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-bg-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-subtle transition"
                placeholder="you@company.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-bg-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-subtle transition"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition"
            >
              {role === "ceo" ? "Enter Command Center" : "Enter Portal"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-text-muted">
          {role === "client" ? (
            <>
              New here?{" "}
              <Link href="/login?role=client" className="text-accent">
                Request access
              </Link>
            </>
          ) : (
            <>
              Not the CEO?{" "}
              <Link href="/login?role=client" className="text-accent">
                Client login
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
      <LoginForm />
    </Suspense>
  );
}
