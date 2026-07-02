import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="mt-3 text-slate-600">Resumo rápido do Plantinha e navegação para o CRUD de conteúdos.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "Conteúdos", href: "/admin/conteudos" },
              { label: "Imagens", href: "/admin/imagens" },
              { label: "Configurações", href: "/admin/configuracoes" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-900 transition hover:-translate-y-1 hover:shadow-lg">
                <p className="text-lg font-semibold">{item.label}</p>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold">Ir para páginas públicas</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Diário", href: "/diario" },
                { label: "Declarações", href: "/declaracoes" },
                { label: "Histórias", href: "/historias" },
                { label: "Desenhos", href: "/desenhos" },
                { label: "Memória", href: "/memoria" },
                { label: "Recordação 1 Ano", href: "/recordacao-1-ano" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 transition hover:bg-slate-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
