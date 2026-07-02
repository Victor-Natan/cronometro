'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type AdminContentRowActionsProps = {
  contentId: string;
};

export default function AdminContentRowActions({ contentId }: AdminContentRowActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm('Deseja realmente excluir este conteúdo?');

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/admin/conteudos/${contentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data?.error || 'Erro ao excluir conteúdo';
        throw new Error(message);
      }

      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido ao excluir conteúdo';
      window.alert(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Link href={`/admin/conteudos/${contentId}`} className="text-sky-600 hover:underline">
        Editar
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 transition hover:underline disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? 'Excluindo...' : 'Excluir'}
      </button>
    </div>
  );
}
