import ModulePageLayout from '@/components/ModulePageLayout';
import PublishedEntriesSection from '@/components/PublishedEntriesSection';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Recordação 1 Ano - Plantinha',
  description: 'Página especial liberada após o primeiro ano',
};

export default async function Recordacao1AnoPage() {
  return (
    <ModulePageLayout
      module="recordacao-1-ano"
      title="Recordação 1 Ano"
      description="Página especial e exclusiva liberada após o primeiro ano de relacionamento"
    >
      <div className="space-y-8">
        <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 p-8 shadow-md border border-pink-200">
          <h2 className="text-2xl font-semibold text-pink-900 mb-4">🎉 Um Ano Juntos! 🎉</h2>
          <p className="text-slate-700 leading-relaxed">
            Esta é uma página especial que foi liberada automaticamente após completar um ano de relacionamento.
            Aqui será possível acessar conteúdo exclusivo e memórias especiais do nosso primeiro ano juntos.
          </p>
        </div>
        <PublishedEntriesSection
          moduleSlug="recordacao-1-ano"
          emptyMessage="Nenhuma recordação especial foi publicada ainda."
        />
      </div>
    </ModulePageLayout>
  );
}
