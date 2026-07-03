import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

async function ensureAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('plantinha_token')?.value;

  if (!token) {
    return false;
  }

  return !!verifyToken(token);
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await ensureAuthenticated();

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files').filter((entry) => entry instanceof File) as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'Nenhuma imagem enviada.' }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: `Arquivo inválido: ${file.name}` }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Arquivo muito grande (${file.name}). Limite de 10MB.` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      urls.push(`data:${file.type};base64,${buffer.toString('base64')}`);
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json({ error: 'Falha no upload das imagens.' }, { status: 500 });
  }
}
