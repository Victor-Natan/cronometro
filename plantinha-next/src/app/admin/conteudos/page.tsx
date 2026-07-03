import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminContentRowActions from "@/components/AdminContentRowActions";

export const dynamic = "force-dynamic";

export default async function AdminConteudosPage() {
  const conteudos = await (async () => {
    try {
      return await prisma.contentEntry.findMany({
        where: {
          deletedAt: null,
        },
        include: { module: true },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      return null;
    }
  })();

  if (!conteudos) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-semibold">Gerenciar Conteúdos</h1>
            <p className="mt-3 text-slate-600">Conteúdo temporariamente indisponível. Tente novamente em instantes.</p>
            <Link href="/admin/conteudos/novo" className="mt-6 inline-flex rounded-2xl bg-sky-700 px-5 py-3 text-white transition hover:bg-sky-800">
              Novo conteúdo
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Gerenciar Conteúdos</h1>
              <p className="mt-2 text-slate-600">Visualize, edite ou crie novas entradas para os módulos do site.</p>
            </div>
            <Link href="/admin/conteudos/novo" className="rounded-2xl bg-sky-700 px-5 py-3 text-white transition hover:bg-sky-800">
              Novo conteúdo
            </Link>
          </div>
          
          {conteudos.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-slate-600">Nenhum conteúdo cadastrado ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Título</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Módulo</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {conteudos.map((conteudo) => (
                    <tr key={conteudo.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm">{conteudo.title}</td>
                      <td className="px-6 py-4 text-sm">{conteudo.module?.name || "-"}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                          conteudo.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800"
                            : conteudo.status === "DRAFT"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {conteudo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <AdminContentRowActions contentId={conteudo.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
