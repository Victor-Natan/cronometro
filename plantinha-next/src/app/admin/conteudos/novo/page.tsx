'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const moduleRoutes: Record<string, string> = {
  diario: '/diario',
  declaracoes: '/declaracoes',
  historias: '/historias',
  desenhos: '/desenhos',
  memoria: '/memoria',
  'recordacao-1-ano': '/recordacao-1-ano',
};

export default function AdminNovoConteudoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModule, setSelectedModule] = useState('diario');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const moduleSlug = formData.get('moduleSlug') as string;
    const status = formData.get('status') as string;
    const eventDate = formData.get('eventDate') as string;

    try {
      const imageUrls = await uploadImages(selectedFiles);

      const response = await fetch('/api/admin/conteudos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          summary,
          content,
          moduleSlug,
          status,
          eventDate,
          imageUrls,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao salvar conteúdo');
      }

      router.push('/admin/conteudos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Novo conteúdo</h1>
              <p className="mt-2 text-slate-600">Cadastre uma nova entrada para qualquer módulo do site.</p>
            </div>
            <Link href="/admin/conteudos" className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 transition hover:bg-slate-100">
              Voltar
            </Link>
          </div>
          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="title"
                required
                className="rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Título"
              />
              <input
                name="slug"
                required
                className="rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Slug"
              />
            </div>
            <input
              name="summary"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              placeholder="Resumo curto (opcional)"
            />
            <select
              name="moduleSlug"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 w-full"
            >
              <option value="diario">Diário</option>
              <option value="declaracoes">Declarações</option>
              <option value="historias">Histórias</option>
              <option value="desenhos">Desenhos</option>
              <option value="memoria">Memória</option>
              <option value="recordacao-1-ano">Recordação 1 Ano</option>
            </select>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Esse conteúdo será exibido em:
              <Link href={moduleRoutes[selectedModule]} className="ml-2 font-medium text-sky-700 hover:underline">
                {moduleRoutes[selectedModule]}
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <select
                name="status"
                defaultValue="PUBLISHED"
                className="rounded-2xl border border-slate-200 px-4 py-3 w-full"
              >
                <option value="DRAFT">Rascunho</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="ARCHIVED">Arquivado</option>
              </select>
              <input
                name="eventDate"
                type="date"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
            </div>
            <textarea
              name="content"
              required
              className="w-full rounded-3xl border border-slate-200 px-4 py-4"
              rows={6}
              placeholder="Conteúdo principal"
            />
            <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
              <label className="block text-sm font-medium text-slate-700">Imagens do conteúdo (opcional)</label>
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
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-sky-700 px-5 py-3 text-white transition hover:bg-sky-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
