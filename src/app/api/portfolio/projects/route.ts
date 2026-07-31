import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/portfolio/projects - Fetch all projects for authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await db.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ projects: [] });
    }

    const projects = await db.project.findMany({
      where: { profileId: profile.id },
      orderBy: { order: 'asc' },
    });

    const parsed = projects.map((p) => ({
      ...p,
      techTags: JSON.parse(p.techTags || '[]'),
      mediaUrls: JSON.parse(p.mediaUrls || '[]'),
    }));

    return NextResponse.json({ projects: parsed });
  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/portfolio/projects - Append new project item
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, link, repoUrl, techTags, mediaUrls, featured } = body;

    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Find or create profile
    let profile = await db.profile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await db.profile.create({ data: { userId } });
    }

    // Get the next order number
    const maxOrder = await db.project.findFirst({
      where: { profileId: profile.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const tags = typeof techTags === 'string' ? techTags : JSON.stringify(techTags || []);
    const media = typeof mediaUrls === 'string' ? mediaUrls : JSON.stringify(mediaUrls || []);

    const project = await db.project.create({
      data: {
        profileId: profile.id,
        title: title.trim(),
        description: description || '',
        link: link || '',
        repoUrl: repoUrl || '',
        techTags: tags,
        mediaUrls: media,
        order: (maxOrder?.order ?? -1) + 1,
        featured: featured || false,
      },
    });

    return NextResponse.json(
      {
        project: {
          ...project,
          techTags: JSON.parse(project.techTags),
          mediaUrls: JSON.parse(project.mediaUrls),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
