import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT /api/portfolio/profile - Update personal profile headers
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bio, avatarUrl, title, location, website, github, linkedin, twitter, skills } = body;

    // Find or create profile
    const existingProfile = await db.profile.findUnique({
      where: { userId },
    });

    let profile;
    if (existingProfile) {
      profile = await db.profile.update({
        where: { userId },
        data: {
          ...(bio !== undefined && { bio }),
          ...(avatarUrl !== undefined && { avatarUrl }),
          ...(title !== undefined && { title }),
          ...(location !== undefined && { location }),
          ...(website !== undefined && { website }),
          ...(github !== undefined && { github }),
          ...(linkedin !== undefined && { linkedin }),
          ...(twitter !== undefined && { twitter }),
          ...(skills !== undefined && { skills: typeof skills === 'string' ? skills : JSON.stringify(skills) }),
        },
      });
    } else {
      profile = await db.profile.create({
        data: {
          userId,
          bio: bio || '',
          avatarUrl: avatarUrl || '',
          title: title || '',
          location: location || '',
          website: website || '',
          github: github || '',
          linkedin: linkedin || '',
          twitter: twitter || '',
          skills: typeof skills === 'string' ? skills : JSON.stringify(skills || []),
        },
      });
    }

    return NextResponse.json({
      profile: {
        ...profile,
        skills: JSON.parse(profile.skills || '[]'),
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
