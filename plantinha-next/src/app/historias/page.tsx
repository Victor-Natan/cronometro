import ModulePageLayout from '@/components/ModulePageLayout';
import PublishedEntriesSection from '@/components/PublishedEntriesSection';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Histórias - Plantinha',
  description: 'Contos e memórias românticas',
};

export default async function HistoriasPage() {
  return (
    <ModulePageLayout
      module="historias"
      title="Histórias de Ninar"
      description="Contos e memórias românticas para compartilhar"
    >
      <PublishedEntriesSection
        moduleSlug="historias"
        emptyMessage="Nenhuma história foi publicada ainda."
      />
    </ModulePageLayout>
  );
}
