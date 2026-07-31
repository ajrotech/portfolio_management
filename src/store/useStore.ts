import { create } from 'zustand';
import type { AuthUser, ViewMode, UserProfile, Project } from '@/types/portfolio';

interface PortfolioStore {
  // Navigation
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  publicUsername: string;
  setPublicUsername: (username: string) => void;

  // Auth
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;

  // Portfolio data
  portfolioData: UserProfile | null;
  setPortfolioData: (data: UserProfile | null) => void;

  // Dashboard data
  projects: Project[];
  setProjects: (projects: Project[]) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<PortfolioStore>((set) => ({
  // Navigation defaults
  viewMode: 'landing',
  setViewMode: (mode) => set({ viewMode: mode }),
  publicUsername: '',
  setPublicUsername: (username) => set({ publicUsername: username }),

  // Auth defaults
  user: null,
  setUser: (user) => set({ user }),

  // Portfolio data
  portfolioData: null,
  setPortfolioData: (data) => set({ portfolioData: data }),

  // Dashboard data
  projects: [],
  setProjects: (projects) => set({ projects }),

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
