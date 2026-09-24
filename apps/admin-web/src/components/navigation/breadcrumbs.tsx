'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === '/dashboard' || pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-xs text-outline mb-3">
      <a href="/dashboard" className="hover:text-primary flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </a>
      {segments.map((segment, idx) => {
        const href = `/${segments.slice(0, idx + 1).join('/')}`;
        const isLast = idx === segments.length - 1;
        const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3 h-3 text-outline/60" />
            {isLast ? (
              <span className="font-semibold text-on-surface">{title}</span>
            ) : (
              <a href={href} className="hover:text-primary transition-colors">
                {title}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
