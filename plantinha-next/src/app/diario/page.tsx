import ModulePageLayout from '@/components/ModulePageLayout';
import PublishedEntriesSection from '@/components/PublishedEntriesSection';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Diário - Plantinha',
  description: 'Relatos e lembranças publicadas',
};

export default async function DiarioPage() {
  return (
    <ModulePageLayout
      module="diario"
      title="Diário"
      description="Relatos e lembranças publicadas no nosso diário compartilhado"
    >
      <PublishedEntriesSection
        moduleSlug="diario"
        emptyMessage="Nenhuma entrada do diário foi publicada ainda."
      />
    </ModulePageLayout>
  );
}
