'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  width?: 'md' | 'lg' | 'xl';
}

export function Drawer({ isOpen, onClose, title, description, children, width = 'lg' }: DrawerProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widths = {
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-on-surface/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={cn(
          'w-full h-full bg-surface-container-lowest border-l border-outline-variant/60 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200',
          widths[width]
        )}
      >
        <div className="p-space-md border-b border-outline-variant/40 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-semibold text-on-surface">{title}</h3>
            {description && <p className="text-xs text-outline mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-space-lg flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
