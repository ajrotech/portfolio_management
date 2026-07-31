import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/portfolio/[username] - Fetch public-facing portfolio data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await db.user.findUnique({
      where: { username: username.toLowerCase() },
      select: {
        id: true,
        username: true,
        name: true,
        profile: {
          select: {
            id: true,
            bio: true,
            avatarUrl: true,
            title: true,
            location: true,
            website: true,
            github: true,
            linkedin: true,
            twitter: true,
            skills: true,
            projects: {
              select: {
                id: true,
                profileId: true,
                title: true,
                description: true,
                link: true,
                repoUrl: true,
                techTags: true,
                mediaUrls: true,
                order: true,
                featured: true,
                createdAt: true,
                updatedAt: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    const profile = user.profile
      ? {
          ...user.profile,
          skills: JSON.parse(user.profile.skills || '[]'),
        }
      : null;

    const projects = user.profile?.projects.map((p) => ({
      ...p,
      techTags: JSON.parse(p.techTags || '[]'),
      mediaUrls: JSON.parse(p.mediaUrls || '[]'),
    })) || [];

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: '',
        profile,
        projects,
      },
    });
  } catch (error) {
    console.error('Fetch portfolio error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
