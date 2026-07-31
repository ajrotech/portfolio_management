'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Star } from 'lucide-react';
import type { Project } from '@/types/portfolio';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  showActions?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  className?: string;
}

export function ProjectCard({ project, showActions = false, onEdit, onDelete, className }: ProjectCardProps) {
  return (
    <Card
      className={cn(
        'group relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50',
        project.featured && 'ring-2 ring-primary/20 border-primary/30',
        className
      )}
    >
      {project.featured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="default" className="gap-1 text-xs">
            <Star className="h-3 w-3" />
            Featured
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
          {project.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        )}
        
        {project.techTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.techTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-mono text-[10px] px-2 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 gap-2 flex-wrap">
        {project.link && (
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" asChild>
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Live Demo
            </a>
          </Button>
        )}
        {project.repoUrl && (
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" asChild>
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-3.5 w-3.5" />
              Source
            </a>
          </Button>
        )}
        {showActions && (
          <div className="flex gap-2 ml-auto">
            {onEdit && (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => onEdit(project)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-destructive hover:text-destructive"
                onClick={() => onDelete(project)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
