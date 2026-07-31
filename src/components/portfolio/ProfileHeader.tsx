'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { SkillTagList } from './SkillTag';

interface ProfileHeaderProps {
  username: string;
  name: string | null;
  profile: {
    bio: string;
    avatarUrl: string;
    title: string;
    location: string;
    website: string;
    github: string;
    linkedin: string;
    twitter: string;
    skills: string[];
  } | null;
  isOwner?: boolean;
  onEditProfile?: () => void;
}

export function ProfileHeader({ username, name, profile, isOwner, onEditProfile }: ProfileHeaderProps) {
  const displayName = name || username;
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col items-center text-center gap-4 pb-8 border-b border-border/50 mb-8">
      <Avatar className="h-24 w-24 ring-4 ring-primary/10 ring-offset-2 ring-offset-background">
        <AvatarImage src={profile?.avatarUrl || undefined} alt={displayName} />
        <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
        {profile?.title && (
          <p className="text-muted-foreground font-medium">{profile.title}</p>
        )}
        <p className="text-sm text-muted-foreground/70 font-mono">@{username}</p>
      </div>

      {profile?.bio && (
        <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
          {profile.bio}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
        {profile?.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {profile.location}
          </span>
        )}
        {profile?.website && (
          <a href={profile.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Globe className="h-3.5 w-3.5" />
            Website
          </a>
        )}
        {profile?.github && (
          <a href={profile.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
        )}
        {profile?.linkedin && (
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Linkedin className="h-3.5 w-3.5" />
            LinkedIn
          </a>
        )}
        {profile?.twitter && (
          <a href={profile.twitter} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Twitter className="h-3.5 w-3.5" />
            Twitter
          </a>
        )}
      </div>

      {profile?.skills && profile.skills.length > 0 && (
        <SkillTagList skills={profile.skills} className="justify-center mt-2" />
      )}

      {isOwner && onEditProfile && (
        <Button variant="outline" size="sm" onClick={onEditProfile} className="mt-2">
          Edit Profile
        </Button>
      )}
    </div>
  );
}
