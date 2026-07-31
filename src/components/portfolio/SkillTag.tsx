'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SkillTagProps {
  label: string;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

export function SkillTag({ label, variant = 'secondary', className }: SkillTagProps) {
  return (
    <Badge
      variant={variant}
      className={cn(
        'font-mono text-xs px-2.5 py-0.5 transition-colors hover:bg-primary hover:text-primary-foreground',
        className
      )}
    >
      {label}
    </Badge>
  );
}

interface SkillTagListProps {
  skills: string[];
  maxDisplay?: number;
  className?: string;
}

export function SkillTagList({ skills, maxDisplay, className }: SkillTagListProps) {
  const displaySkills = maxDisplay ? skills.slice(0, maxDisplay) : skills;
  const remaining = maxDisplay ? skills.length - maxDisplay : 0;

  if (skills.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {displaySkills.map((skill) => (
        <SkillTag key={skill} label={skill} />
      ))}
      {remaining > 0 && (
        <Badge variant="outline" className="text-xs px-2.5 py-0.5">
          +{remaining} more
        </Badge>
      )}
    </div>
  );
}