import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT /api/portfolio/projects/[id] - Update a specific project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, link, repoUrl, techTags, mediaUrls, featured } = body;

    // Verify ownership via profile
    const profile = await db.profile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const existing = await db.project.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const tags = techTags !== undefined
      ? (typeof techTags === 'string' ? techTags : JSON.stringify(techTags))
      : undefined;
    const media = mediaUrls !== undefined
      ? (typeof mediaUrls === 'string' ? mediaUrls : JSON.stringify(mediaUrls))
      : undefined;

    const project = await db.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(link !== undefined && { link }),
        ...(repoUrl !== undefined && { repoUrl }),
        ...(tags !== undefined && { techTags: tags }),
        ...(media !== undefined && { mediaUrls: media }),
        ...(featured !== undefined && { featured }),
      },
    });

    return NextResponse.json({
      project: {
        ...project,
        techTags: JSON.parse(project.techTags),
        mediaUrls: JSON.parse(project.mediaUrls),
      },
    });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/portfolio/projects/[id] - Delete a specific project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const profile = await db.profile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const existing = await db.project.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await db.project.delete({ where: { id } });
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
