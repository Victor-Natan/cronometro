import ModulePageLayout from '@/components/ModulePageLayout';
import PublishedEntriesSection from '@/components/PublishedEntriesSection';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Declarações - Plantinha',
  description: 'Mensagens de amor e carinho',
};

export default async function DeclaracoesPage() {
  return (
    <ModulePageLayout
      module="declaracoes"
      title="Declarações"
      description="Mensagens de amor e carinho dedicadas"
    >
      <PublishedEntriesSection
        moduleSlug="declaracoes"
        emptyMessage="Nenhuma declaração foi publicada ainda."
      />
    </ModulePageLayout>
  );
}
