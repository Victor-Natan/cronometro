import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const validStatuses = new Set(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

async function ensureAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('plantinha_token')?.value;

  if (!token) {
    return false;
  }

  const decoded = verifyToken(token);
  return !!decoded;
}

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const isAuthenticated = await ensureAuthenticated();

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const contentEntry = await prisma.contentEntry.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        module: true,
        media: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!contentEntry) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(contentEntry);
  } catch (error) {
    console.error('Error loading content entry:', error);
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const isAuthenticated = await ensureAuthenticated();

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const {
      title,
      slug,
      summary,
      content,
      moduleSlug,
      status = 'PUBLISHED',
      eventDate,
      imageUrls = [],
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content' },
        { status: 400 }
      );
    }

    if (!validStatuses.has(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const existingEntry = await prisma.contentEntry.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const targetModule = moduleSlug
      ? await prisma.module.findUnique({ where: { slug: moduleSlug } })
      : await prisma.module.findUnique({ where: { id: existingEntry.moduleId } });

    if (!targetModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const duplicateSlug = await prisma.contentEntry.findFirst({
      where: {
        moduleId: targetModule.id,
        slug,
        deletedAt: null,
        NOT: {
          id,
        },
      },
    });

    if (duplicateSlug) {
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

    await prisma.mediaAsset.deleteMany({
      where: {
        contentEntryId: id,
      },
    });

    const updated = await prisma.contentEntry.update({
      where: { id },
      data: {
        title,
        slug,
        summary: summary?.trim() ? summary.trim() : content.substring(0, 200),
        body: content,
        status,
        eventDate: parsedEventDate,
        moduleId: targetModule.id,
        media: normalizedImageUrls.length
          ? {
              create: normalizedImageUrls.map((url) => ({
                url,
                moduleId: targetModule.id,
              })),
            }
          : undefined,
      },
      include: {
        module: true,
        media: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating content entry:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const isAuthenticated = await ensureAuthenticated();

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const existingEntry = await prisma.contentEntry.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    await prisma.contentEntry.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'ARCHIVED',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content entry:', error);
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}
