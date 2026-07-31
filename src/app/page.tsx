'use client';

import { useStore } from '@/store/useStore';
import { LandingView } from '@/components/portfolio/LandingView';
import { LoginForm, RegisterForm } from '@/components/portfolio/AuthForms';
import { CreatorDashboard } from '@/components/portfolio/DashboardViews';
import { PublicProfileView } from '@/components/portfolio/PublicProfileView';

export default function Home() {
  const { viewMode } = useStore();

  switch (viewMode) {
    case 'login':
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <LoginForm />
        </div>
      );
    case 'register':
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <RegisterForm />
        </div>
      );
    case 'dashboard':
      return <CreatorDashboard />;
    case 'public-profile':
      return <PublicProfileView />;
    default:
      return <LandingView />;
  }
}