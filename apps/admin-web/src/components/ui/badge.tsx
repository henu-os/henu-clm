import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'neutral';
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  const variants = {
    primary: 'bg-primary-fixed text-on-primary-fixed',
    secondary: 'bg-secondary-container text-on-secondary-container',
    success: 'bg-secondary text-on-secondary',
    warning: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    danger: 'bg-error-container text-on-error-container',
    outline: 'border border-outline-variant text-on-surface-variant bg-transparent',
    neutral: 'bg-surface-container-high text-on-surface-variant',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
