export interface UserProfile {
  id: string;
  username: string;
  name: string | null;
  email: string;
  profile: {
    id: string;
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
  projects: Project[];
}

export interface Project {
  id: string;
  profileId: string;
  title: string;
  description: string;
  link: string;
  repoUrl: string;
  techTags: string[];
  mediaUrls: string[];
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileFormData {
  bio: string;
  avatarUrl: string;
  title: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  skills: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  link: string;
  repoUrl: string;
  techTags: string;
  mediaUrls: string;
  featured: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string | null;
}

export type ViewMode = 'landing' | 'login' | 'register' | 'dashboard' | 'public-profile';
