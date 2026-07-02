import Header from "@/components/Header";
import Cronometro from "@/components/Cronometro";
import ContentCard from "@/components/ContentCard";
import { siteConfig, modules } from "@/lib/data-simple";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl bg-gradient-to-br from-sky-700 to-cyan-600 p-10 text-white shadow-xl shadow-sky-600/10">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.24em] text-cyan-100">
              {siteConfig.title}
            </span>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">O seu lugar para memórias, declarações e recordações.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-cyan-100/90">
              Descubra o novo Plantinha com conteúdo dinâmico, cronômetro configurável e módulos que podem ser atualizados pelo admin.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-6">
                <h2 className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">Cronômetro</h2>
                <p className="mt-3 text-base text-white/85">Tempo desde a data inicial e liberação automática da recordação.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6">
                <h2 className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">Conteúdo</h2>
                <p className="mt-3 text-base text-white/85">Diário, declarações, histórias e galeria com CRUD via admin.</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-10 shadow-lg shadow-slate-200/50">
            <Cronometro />
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Módulos</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Navegue pelos módulos</h2>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Dashboard Admin</p>
              <Link
                href="/admin/conteudos/novo"
                className="mt-2 inline-flex rounded-xl bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
              >
                Adicionar conteúdo novo
              </Link>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <ContentCard key={module.slug} title={module.title} summary={module.description} href={`/${module.slug}`} tag={module.slug} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
