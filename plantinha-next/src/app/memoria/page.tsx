import ModulePageLayout from '@/components/ModulePageLayout';
import PublishedEntriesSection from '@/components/PublishedEntriesSection';
import { memoryImages } from '@/lib/data-simple';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Memória - Plantinha',
  description: 'Jogo da memória com cartas especiais',
};

export default async function MemoriaPage() {
  return (
    <ModulePageLayout
      module="memoria"
      title="Memória"
      description="Jogo da memória com cartas especiais"
    >
      <div className="space-y-8">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <p className="mb-8 text-slate-600">
            Galeria de imagens para o jogo da memória:
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {memoryImages.map((image, idx) => (
              <div key={idx} className="aspect-square overflow-hidden rounded-xl bg-slate-200 shadow-sm">
                <Image
                  src={image}
                  alt={`Memória ${idx + 1}`}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover transition hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Conteúdos do módulo</h2>
          <PublishedEntriesSection
            moduleSlug="memoria"
            emptyMessage="Nenhum conteúdo publicado para Memória ainda."
          />
        </section>
      </div>
    </ModulePageLayout>
  );
}
