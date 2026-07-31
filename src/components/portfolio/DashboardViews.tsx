'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/store/useStore';
import { ProjectCard } from './ProjectCard';
import { ProfileHeader } from './ProfileHeader';
import {
  Plus, LogOut, Eye, Settings, FolderOpen, Loader2, X, GripVertical, Trash2
} from 'lucide-react';
import type { Project, ProfileFormData, ProjectFormData } from '@/types/portfolio';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ============================================
// Profile Edit Form
// ============================================
function ProfileEditForm() {
  const { user, setViewMode, setPublicUsername } = useStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProfileFormData>({
    bio: '', avatarUrl: '', title: '', location: '',
    website: '', github: '', linkedin: '', twitter: '', skills: '',
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user && !initialized) {
      fetch('/api/portfolio/profile', {
        headers: { 'x-user-id': user.id },
      })
        .then(r => r.json())
        .then(data => {
          if (data.profile) {
            setForm({
              bio: data.profile.bio || '',
              avatarUrl: data.profile.avatarUrl || '',
              title: data.profile.title || '',
              location: data.profile.location || '',
              website: data.profile.website || '',
              github: data.profile.github || '',
              linkedin: data.profile.linkedin || '',
              twitter: data.profile.twitter || '',
              skills: Array.isArray(data.profile.skills) ? data.profile.skills.join(', ') : '',
            });
          }
          setInitialized(true);
        })
        .catch(() => setInitialized(true));
    }
  }, [user, initialized]);

  const save = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const skillsArray = form.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const res = await fetch('/api/portfolio/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ ...form, skills: skillsArray }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Profile updated', description: 'Your profile has been saved.' });
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save profile.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <p className="text-sm text-muted-foreground">Update your personal information and social links</p>
        </div>
        <Button onClick={save} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 md:col-span-2">
          <Label>Avatar URL</Label>
          <Input placeholder="https://example.com/avatar.jpg" value={form.avatarUrl}
            onChange={(e) => setForm(f => ({ ...f, avatarUrl: e.target.value }))} />
        </div>

        <div className="space-y-4">
          <Label>Job Title / Role</Label>
          <Input placeholder="Full Stack Developer" value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="space-y-4">
          <Label>Location</Label>
          <Input placeholder="San Francisco, CA" value={form.location}
            onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />
        </div>

        <div className="space-y-4 md:col-span-2">
          <Label>Bio</Label>
          <Textarea placeholder="Tell the world about yourself..." rows={4} value={form.bio}
            onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} />
        </div>

        <div className="space-y-4 md:col-span-2">
          <Label>Skills (comma-separated)</Label>
          <Input placeholder="React, TypeScript, Node.js, Python" value={form.skills}
            onChange={(e) => setForm(f => ({ ...f, skills: e.target.value }))} />
        </div>

        <Separator className="md:col-span-2" />

        <div className="space-y-4">
          <Label>Website</Label>
          <Input placeholder="https://yoursite.com" value={form.website}
            onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))} />
        </div>
        <div className="space-y-4">
          <Label>GitHub</Label>
          <Input placeholder="https://github.com/username" value={form.github}
            onChange={(e) => setForm(f => ({ ...f, github: e.target.value }))} />
        </div>
        <div className="space-y-4">
          <Label>LinkedIn</Label>
          <Input placeholder="https://linkedin.com/in/username" value={form.linkedin}
            onChange={(e) => setForm(f => ({ ...f, linkedin: e.target.value }))} />
        </div>
        <div className="space-y-4">
          <Label>Twitter / X</Label>
          <Input placeholder="https://twitter.com/username" value={form.twitter}
            onChange={(e) => setForm(f => ({ ...f, twitter: e.target.value }))} />
        </div>
      </div>
    </div>
  );
}

// ============================================
// Project Form (Add / Edit)
// ============================================
function ProjectForm({
  project,
  onClose,
  onSaved,
}: {
  project?: Project;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { user } = useStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProjectFormData>({
    title: '', description: '', link: '', repoUrl: '',
    techTags: '', mediaUrls: '', featured: false,
  });

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title,
        description: project.description,
        link: project.link,
        repoUrl: project.repoUrl,
        techTags: project.techTags.join(', '),
        mediaUrls: project.mediaUrls.join(', '),
        featured: project.featured,
      });
    }
  }, [project]);

  const update = (field: keyof ProjectFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const techTags = form.techTags.split(',').map(s => s.trim()).filter(Boolean);
      const mediaUrls = form.mediaUrls.split(',').map(s => s.trim()).filter(Boolean);

      const isEdit = !!project;
      const url = isEdit
        ? `/api/portfolio/projects/${project.id}`
        : '/api/portfolio/projects';

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({ ...form, techTags, mediaUrls }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: isEdit ? 'Project updated' : 'Project added',
          description: `"${form.title}" has been ${isEdit ? 'updated' : 'created'}.`,
        });
        onSaved();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save project.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">{project ? 'Edit Project' : 'Add New Project'}</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="proj-title">Project Title *</Label>
              <Input id="proj-title" placeholder="My Awesome Project" value={form.title}
                onChange={(e) => update('title', e.target.value)} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="proj-desc">Description</Label>
              <Textarea id="proj-desc" placeholder="Describe what this project does..." rows={3} value={form.description}
                onChange={(e) => update('description', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-link">Live URL</Label>
              <Input id="proj-link" placeholder="https://myproject.com" value={form.link}
                onChange={(e) => update('link', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-repo">Repository URL</Label>
              <Input id="proj-repo" placeholder="https://github.com/user/repo" value={form.repoUrl}
                onChange={(e) => update('repoUrl', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-tags">Tech Tags (comma-separated)</Label>
              <Input id="proj-tags" placeholder="React, TypeScript, Prisma" value={form.techTags}
                onChange={(e) => update('techTags', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-media">Media URLs (comma-separated)</Label>
              <Input id="proj-media" placeholder="https://imgur.com/screenshot1.png" value={form.mediaUrls}
                onChange={(e) => update('mediaUrls', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.featured} onCheckedChange={(v) => update('featured', v)} />
            <Label>Mark as featured project</Label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {project ? 'Update Project' : 'Add Project'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ============================================
// Sortable Project Item
// ============================================
function SortableProjectItem({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (p: Project) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        className="absolute left-0 top-4 -translate-x-1/2 z-10 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="ml-4">
        <ProjectCard project={project} showActions onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

// ============================================
// Projects Manager (with drag-to-reorder)
// ============================================
function ProjectsManager() {
  const { user, projects, setProjects } = useStore();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/portfolio/projects', {
        headers: { 'x-user-id': user.id },
      });
      const data = await res.json();
      if (res.ok) setProjects(data.projects);
    } catch {
      // silent
    }
  }, [user, setProjects]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex).map((p, i) => ({
      ...p,
      order: i,
    }));

    setProjects(reordered);

    try {
      await fetch('/api/portfolio/projects/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user!.id },
        body: JSON.stringify({ projectIds: reordered.map((p) => ({ id: p.id, order: p.order })) }),
      });
    } catch {
      toast({ title: 'Error', description: 'Failed to reorder projects.', variant: 'destructive' });
      loadProjects();
    }
  };

  const handleDelete = async (project: Project) => {
    setDeletingId(project.id);
    try {
      const res = await fetch(`/api/portfolio/projects/${project.id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user!.id },
      });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== project.id));
        toast({ title: 'Deleted', description: `"${project.title}" removed.` });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete project.', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Projects ({projects.length})</h2>
          <p className="text-sm text-muted-foreground">Drag to reorder. Click Edit to modify.</p>
        </div>
        <Button onClick={() => { setEditingProject(null); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {(showForm || editingProject) && (
        <ProjectForm
          project={editingProject || undefined}
          onClose={() => { setShowForm(false); setEditingProject(null); }}
          onSaved={() => { setShowForm(false); setEditingProject(null); loadProjects(); }}
        />
      )}

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-muted-foreground">No projects yet</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Add your first project to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4 pl-4">
              {projects.map((project) => (
                <SortableProjectItem
                  key={project.id}
                  project={project}
                  onEdit={(p) => { setEditingProject(p); setShowForm(true); }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

// ============================================
// Creator Dashboard (main export)
// ============================================
export function CreatorDashboard() {
  const { user, setViewMode, setPublicUsername } = useStore();
  const [activeTab, setActiveTab] = useState('projects');

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-lg">Portfolio</h1>
            <Badge variant="outline" className="font-mono text-xs">Dashboard</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost" size="sm"
              onClick={() => {
                setPublicUsername(user.username);
                setViewMode('public-profile');
              }}
            >
              <Eye className="mr-1.5 h-4 w-4" />
              View Portfolio
            </Button>
            <Button
              variant="ghost" size="sm"
              onClick={() => {
                useStore.getState().setUser(null);
                setViewMode('landing');
              }}
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Welcome back, {user.name || user.username}</h2>
          <p className="text-muted-foreground mt-1">
            Your portfolio URL:{' '}
            <span className="font-mono text-primary">/portfolio/{user.username}</span>
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-md grid grid-cols-2 mb-6">
            <TabsTrigger value="projects" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Profile Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="settings">
            <ProfileEditForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
