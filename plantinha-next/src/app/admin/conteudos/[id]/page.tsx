'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

type FormState = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  moduleSlug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  eventDate: string;
  imageUrls: string[];
};

const defaultForm: FormState = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  moduleSlug: 'diario',
  status: 'PUBLISHED',
  eventDate: '',
  imageUrls: [],
};

function toDateInputValue(value?: string | null) {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toISOString().slice(0, 10);
}

export default function AdminEditarConteudoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<FormState>(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  async function uploadImages(files: File[]) {
    if (files.length === 0) {
      return [] as string[];
    }

    const convertFileToDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Falha ao ler a imagem'));
        reader.readAsDataURL(file);
      });

    return Promise.all(files.map((file) => convertFileToDataUrl(file)));
  }

  useEffect(() => {
    async function loadContent() {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(`/api/admin/conteudos/${params.id}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Não foi possível carregar o conteúdo');
        }

        const data = await response.json();

        setForm({
          title: data.title || '',
          slug: data.slug || '',
          summary: data.summary || '',
          content: data.body || '',
          moduleSlug: data.module?.slug || 'diario',
          status: data.status || 'PUBLISHED',
          eventDate: toDateInputValue(data.eventDate),
          imageUrls: Array.isArray(data.media)
            ? data.media.map((item: { url: string }) => item.url)
            : [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar conteúdo');
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      loadContent();
    }
  }, [params.id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const uploadedUrls = await uploadImages(selectedFiles);

      const response = await fetch(`/api/admin/conteudos/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          imageUrls: [...form.imageUrls, ...uploadedUrls],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao salvar alterações');
      }

      router.push('/admin/conteudos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setSelectedFiles([]);
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm('Deseja realmente excluir este conteúdo?');

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/conteudos/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao excluir conteúdo');
      }

      router.push('/admin/conteudos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Editar conteúdo</h1>
              <p className="mt-2 text-slate-600">Atualize os dados e publique quando estiver pronto.</p>
            </div>
            <Link
              href="/admin/conteudos"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 transition hover:bg-slate-100"
            >
              Voltar
            </Link>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
              Carregando conteúdo...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="title"
                  required
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                  placeholder="Título"
                />
                <input
                  name="slug"
                  required
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                  placeholder="Slug"
                />
              </div>

              <input
                name="summary"
                value={form.summary}
                onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Resumo curto (opcional)"
              />

              <select
                name="moduleSlug"
                value={form.moduleSlug}
                onChange={(e) => setForm((prev) => ({ ...prev, moduleSlug: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              >
                <option value="diario">Diário</option>
                <option value="declaracoes">Declarações</option>
                <option value="historias">Histórias</option>
                <option value="desenhos">Desenhos</option>
                <option value="memoria">Memória</option>
                <option value="recordacao-1-ano">Recordação 1 Ano</option>
              </select>

              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  name="status"
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value as FormState['status'],
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                >
                  <option value="DRAFT">Rascunho</option>
                  <option value="PUBLISHED">Publicado</option>
                  <option value="ARCHIVED">Arquivado</option>
                </select>
                <input
                  name="eventDate"
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, eventDate: e.target.value }))}
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />
              </div>

              <textarea
                name="content"
                required
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                className="w-full rounded-3xl border border-slate-200 px-4 py-4"
                rows={8}
                placeholder="Conteúdo principal"
              />

              <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
                <label className="block text-sm font-medium text-slate-700">Imagens do conteúdo</label>

                {form.imageUrls.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {form.imageUrls.map((url) => (
                      <div key={url} className="rounded-xl border border-slate-200 p-3">
                        <img src={url} alt="Imagem do conteúdo" className="h-32 w-full rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              imageUrls: prev.imageUrls.filter((item) => item !== url),
                            }))
                          }
                          className="mt-2 text-sm text-red-600 hover:underline"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Nenhuma imagem associada a este conteúdo.</p>
                )}

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files || []);
                    setSelectedFiles(files);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                />

                {selectedFiles.length > 0 ? (
                  <ul className="space-y-1 text-sm text-slate-600">
                    {selectedFiles.map((file) => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                ) : null}

                <p className="text-xs text-slate-500">As imagens serão exibidas no final do texto público.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isSaving || isDeleting}
                  className="rounded-2xl bg-sky-700 px-5 py-3 text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? 'Salvando...' : 'Salvar alterações'}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving || isDeleting}
                  className="rounded-2xl bg-red-600 px-5 py-3 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
