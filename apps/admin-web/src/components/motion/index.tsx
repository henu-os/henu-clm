'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('animate-fade-in w-full', className)}>
      {children}
    </div>
  );
}

export function FadeIn({
  children,
  className,
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  return (
    <div
      className={cn('animate-fade-in', className)}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

export function SlideIn({
  children,
  className,
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  return (
    <div
      className={cn('animate-slide-up', className)}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

export function HoverCard({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'card-hover-effect rounded border border-outline-variant/60 bg-surface-container-lowest transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({
  children,
  className,
  staggerIntervalMs = 50,
}: {
  children: React.ReactNode;
  className?: string;
  staggerIntervalMs?: number;
}) {
  const count = React.Children.count(children);

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <div
            className="animate-slide-up"
            style={{ animationDelay: `${index * staggerIntervalMs}ms` }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
