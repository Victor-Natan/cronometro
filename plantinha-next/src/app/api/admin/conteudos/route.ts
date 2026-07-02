import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

const validStatuses = new Set(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('plantinha_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      summary,
      content,
      moduleSlug = 'diario',
      status = 'PUBLISHED',
      eventDate,
      imageUrls = [],
    } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content' },
        { status: 400 }
      );
    }

    if (!validStatuses.has(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Find module by slug
    const module = await prisma.module.findUnique({
      where: { slug: moduleSlug },
    });

    if (!module) {
      return NextResponse.json(
        { error: `Module with slug "${moduleSlug}" not found` },
        { status: 404 }
      );
    }

    const existingEntry = await prisma.contentEntry.findFirst({
      where: {
        moduleId: module.id,
        slug,
        deletedAt: null,
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Já existe um conteúdo com esse slug neste módulo.' },
        { status: 409 }
      );
    }

    const parsedEventDate = eventDate ? new Date(eventDate) : null;

    if (parsedEventDate && Number.isNaN(parsedEventDate.getTime())) {
      return NextResponse.json({ error: 'Invalid event date' }, { status: 400 });
    }

    const normalizedImageUrls = Array.isArray(imageUrls)
      ? imageUrls.filter((url) => typeof url === 'string' && url.trim().length > 0)
      : [];

    // Create content entry
    const contentEntry = await prisma.contentEntry.create({
      data: {
        title,
        slug,
        summary: summary?.trim() ? summary.trim() : content.substring(0, 200),
        body: content,
        status,
        eventDate: parsedEventDate,
        moduleId: module.id,
        media: normalizedImageUrls.length
          ? {
              create: normalizedImageUrls.map((url) => ({
                url,
                moduleId: module.id,
              })),
            }
          : undefined,
      },
      include: { module: true, media: true },
    });

    return NextResponse.json(contentEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
