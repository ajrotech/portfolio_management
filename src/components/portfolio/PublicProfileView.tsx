'use client';

import { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { ProjectCard } from './ProjectCard';
import { ProfileHeader } from './ProfileHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle, Construction } from 'lucide-react';

export function PublicProfileView() {
  const { publicUsername, portfolioData, setPortfolioData, setViewMode, user } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPortfolio = useCallback(() => {
    if (!publicUsername) return;

    fetch(`/api/portfolio/${publicUsername}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 404 ? 'not_found' : 'server_error');
        return res.json();
      })
      .then((data) => {
        setPortfolioData(data.user);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === 'not_found') {
          setError(`The portfolio "@${publicUsername}" does not exist.`);
        } else {
          setError('Failed to load portfolio. Please try again.');
        }
        setLoading(false);
      });
  }, [publicUsername, setPortfolioData]);

  useEffect(() => {
    if (!publicUsername) {
      setViewMode('landing');
      return;
    }
    loadPortfolio();
  }, [publicUsername, setViewMode, loadPortfolio]);

  const isOwner = user?.username === publicUsername;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="text-center space-y-2 w-full max-w-sm">
              <Skeleton className="h-7 w-48 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
            <div className="w-full grid gap-4 md:grid-cols-2 mt-8">
              <Skeleton className="h-48 rounded-lg" />
              <Skeleton className="h-48 rounded-lg" />
              <Skeleton className="h-48 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <AlertCircle className="h-16 w-16 text-muted-foreground/50 mx-auto" />
          <h2 className="text-xl font-semibold">Portfolio Not Found</h2>
          <p className="text-muted-foreground max-w-md">{error}</p>
          <Button variant="outline" onClick={() => setViewMode('landing')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!portfolioData) return null;

  const featuredProjects = portfolioData.projects.filter((p) => p.featured);
  const otherProjects = portfolioData.projects.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between max-w-4xl mx-auto px-4">
          <Button variant="ghost" size="sm" onClick={() => setViewMode('landing')}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Home
          </Button>
          {isOwner && (
            <Button variant="outline" size="sm" onClick={() => setViewMode('dashboard')}>
              <Construction className="mr-1.5 h-4 w-4" />
              Edit Dashboard
            </Button>
          )}
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <ProfileHeader
          username={portfolioData.username}
          name={portfolioData.name}
          profile={portfolioData.profile}
          isOwner={isOwner}
          onEditProfile={() => setViewMode('dashboard')}
        />

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span>Featured</span>
              <span className="text-xs text-muted-foreground font-normal">
                ({featuredProjects.length})
              </span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* All Projects */}
        {otherProjects.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span>Projects</span>
              <span className="text-xs text-muted-foreground font-normal">
                ({otherProjects.length})
              </span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {otherProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {portfolioData.projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No projects added yet.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Powered by Portfolio Management System
        </div>
      </footer>
    </div>
  );
}