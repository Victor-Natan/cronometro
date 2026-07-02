"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = searchParams.get("next");

  const getRedirectPath = () => {
    if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
      return "/admin/dashboard";
    }

    return nextPath;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const responseIsJson = response.headers.get("content-type")?.includes("application/json");
      const body = responseIsJson ? await response.json() : null;

      if (!response.ok) {
        setError(body?.error || "Falha ao autenticar.");
        return;
      }

      router.push(getRedirectPath());
    } catch {
      setError("Nao foi possivel concluir o login agora. Tente novamente em instantes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white px-8 py-10 shadow-lg shadow-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">Painel Admin</h1>
          <p className="mt-3 text-slate-600">Faça login para gerenciar conteúdos e configurações.</p>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@exemplo.com"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-sky-700 px-4 py-3 text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-sky-400"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Ainda não tem conta? <Link href="/admin/configuracoes" className="font-semibold text-sky-700">Configurar</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 text-slate-900">
          <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-white px-8 py-10 shadow-lg shadow-slate-200">
              <h1 className="text-3xl font-semibold text-slate-900">Painel Admin</h1>
              <p className="mt-3 text-slate-600">Carregando login...</p>
            </div>
          </main>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
