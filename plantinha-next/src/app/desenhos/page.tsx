import ModulePageLayout from '@/components/ModulePageLayout';
import PublishedEntriesSection from '@/components/PublishedEntriesSection';
import { drawingImages } from '@/lib/data-simple';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Desenhos - Plantinha',
  description: 'Galeria de imagens e ilustrações',
};

export default async function DesenhoPage() {
  return (
    <ModulePageLayout
      module="desenhos"
      title="Desenhos"
      description="Galeria de imagens e ilustrações compartilhadas"
    >
      <div className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {drawingImages.map((image, idx) => (
            <div key={idx} className="aspect-square overflow-hidden rounded-2xl bg-slate-200 shadow-md">
              <Image
                src={image}
                alt={`Desenho ${idx + 1}`}
                width={400}
                height={400}
                className="h-full w-full object-cover transition hover:scale-110"
              />
            </div>
          ))}
        </div>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Textos e legendas do módulo</h2>
          <PublishedEntriesSection
            moduleSlug="desenhos"
            emptyMessage="Nenhum conteúdo publicado para Desenhos ainda."
          />
        </section>
      </div>
    </ModulePageLayout>
  );
}
