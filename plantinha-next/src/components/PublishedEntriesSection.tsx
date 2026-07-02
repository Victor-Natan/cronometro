import { ContentStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type PublishedEntriesSectionProps = {
  moduleSlug: string;
  emptyMessage: string;
};

function formatEntryDate(date: Date | null) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default async function PublishedEntriesSection({
  moduleSlug,
  emptyMessage,
}: PublishedEntriesSectionProps) {
  const entries = await (async () => {
    try {
      return await prisma.contentEntry.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          deletedAt: null,
          module: {
            slug: moduleSlug,
          },
        },
        include: {
          media: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: [{ order: 'asc' }, { eventDate: 'desc' }, { createdAt: 'desc' }],
      });
    } catch {
      return null;
    }
  })();

  if (!entries) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-md">
        <p className="text-slate-600">Conteúdo temporariamente indisponível. Tente novamente em instantes.</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-md">
        <p className="text-slate-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {entries.map((entry) => {
        const entryDate = formatEntryDate(entry.eventDate ?? entry.createdAt);

        return (
          <article key={entry.id} className="rounded-2xl bg-white p-8 shadow-md">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{entry.title}</h2>
                {entry.summary ? (
                  <p className="mt-2 text-slate-500">{entry.summary}</p>
                ) : null}
              </div>
              {entryDate ? (
                <p className="text-sm text-slate-500">{entryDate}</p>
              ) : null}
            </div>
            {entry.body ? (
              <div className="mt-6 whitespace-pre-wrap leading-7 text-slate-700">
                {entry.body}
              </div>
            ) : null}
            {entry.media.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {entry.media.map((image) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt={image.altText || entry.title}
                    className="w-full rounded-2xl object-cover shadow-sm"
                  />
                ))}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
