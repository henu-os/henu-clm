'use client';

import * as React from 'react';
import { AlertTriangle, RefreshCw, FolderSearch, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LoadingSkeleton({
  rows = 4,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn('w-full space-y-3 p-4 animate-pulse', className)}>
      <div className="h-6 bg-surface-container-high rounded w-1/3" />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-10 bg-surface-container rounded w-full flex items-center px-3 justify-between"
          >
            <div className="h-3.5 bg-surface-container-high rounded w-1/4" />
            <div className="h-3.5 bg-surface-container-high rounded w-1/6" />
            <div className="h-3.5 bg-surface-container-high rounded w-1/12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({
  title = 'No records found',
  description = 'There are no active records in this view. Create one to get started.',
  actionLabel,
  onAction,
  icon: Icon = FolderSearch,
  className,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'w-full py-12 px-4 rounded-lg border border-dashed border-outline-variant/60 bg-surface-container-low/50 flex flex-col items-center justify-center text-center animate-fade-in',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-outline mb-3">
        <Icon className="w-6 h-6 text-on-surface-variant" />
      </div>
      <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
      <p className="text-xs text-outline max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Unable to load data',
  description = 'An unexpected error occurred while communicating with the server.',
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'w-full py-10 px-4 rounded-lg border border-error/30 bg-error-container/20 flex flex-col items-center justify-center text-center animate-fade-in',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error mb-2">
        <AlertTriangle className="w-5 h-5 text-error" />
      </div>
      <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
      <p className="text-xs text-on-surface-variant max-w-sm mt-1 mb-4">{description}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="gap-1.5 border-error/40 text-error hover:bg-error-container/30">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </Button>
      )}
    </div>
  );
}
