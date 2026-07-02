import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { verifyToken } from '@/lib/auth';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function getFileExtension(fileName: string) {
  const ext = path.extname(fileName || '').toLowerCase();
  return ext || '.png';
}

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

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

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

      const ext = getFileExtension(file.name);
      const fileName = `${Date.now()}-${randomUUID()}${ext}`;
      const absolutePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());

      await writeFile(absolutePath, buffer);
      urls.push(`/uploads/${fileName}`);
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json({ error: 'Falha no upload das imagens.' }, { status: 500 });
  }
}
