'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { ArrowRight, Search, LayoutDashboard, Globe, FolderOpen, User, Zap, Shield } from 'lucide-react';

export function LandingView() {
  const { setViewMode, setPublicUsername } = useStore();
  const [searchUsername, setSearchUsername] = useState('');

  const handleViewPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchUsername.trim().replace(/^@/, '').toLowerCase();
    if (clean) {
      setPublicUsername(clean);
      setViewMode('public-profile');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg">Folio</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setViewMode('login')}>
              Sign In
            </Button>
            <Button size="sm" onClick={() => setViewMode('register')}>
              Get Started
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">Week 03 Internship Task</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Build Your{' '}
            <span className="text-primary">Portfolio</span>
            {' '}in Minutes
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            A dynamic, multi-tenant portfolio management system. Create your profile,
            showcase projects, and share your unique portfolio URL with the world.
          </p>

          {/* Search portfolio */}
          <form onSubmit={handleViewPortfolio} className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="@username — View a portfolio"
                className="pl-10 h-11"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-11 px-6">
              <Globe className="mr-2 h-4 w-4" />
              View
            </Button>
          </form>

          <div className="flex gap-3 justify-center pt-2">
            <Button variant="outline" onClick={() => setViewMode('login')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Creator Dashboard
            </Button>
            <Button onClick={() => setViewMode('register')}>
              Create Portfolio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl w-full mt-20">
          <Card className="border-border/50">
            <CardContent className="pt-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Dynamic Profiles</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bio, social links, avatar, skills — fully customizable profiles
                that reflect your professional identity.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Project Showcase</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add projects with tech tags, live demos, repo links, and media.
                Drag-to-reorder for the perfect layout.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Public URLs</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Each user gets a unique, shareable portfolio URL.
                Lightweight, responsive, and optimized for viewing.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container max-w-5xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Portfolio Management System — Full Stack Development Internship Task Week 03
        </div>
      </footer>
    </div>
  );
}