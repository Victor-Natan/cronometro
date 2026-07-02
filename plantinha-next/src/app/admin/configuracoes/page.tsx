export default function AdminConfiguracoesPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">Configurações do site</h1>
          <p className="mt-3 text-slate-600">Ajuste o cronômetro, configure a liberação da página especial e gerencie a experiência do Plantinha.</p>
          <div className="mt-8 space-y-6">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-slate-700">Em breve aqui estarão as configurações de data inicial, liberação automática e exibição de confete.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
