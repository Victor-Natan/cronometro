'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';

type Module = 
  | 'diario' 
  | 'declaracoes' 
  | 'historias' 
  | 'desenhos' 
  | 'memoria'
  | 'recordacao-1-ano';

interface ModulePageProps {
  module: Module;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ModulePageLayout({
  module,
  title,
  description,
  children,
}: ModulePageProps) {
  const [isLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header da página */}
        <div className="mb-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900"
          >
            ← Voltar
          </Link>

          <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-white shadow-xl">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-200">
              {module}
            </span>
            <h1 className="mt-6 text-4xl font-bold sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">{description}</p>
          </div>
        </div>

        {/* Conteúdo do módulo */}
        <div className={isLoading ? 'opacity-50' : ''}>
          {children}
        </div>
      </main>
    </div>
  );
}
