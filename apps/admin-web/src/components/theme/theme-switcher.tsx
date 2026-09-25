'use client';

import * as React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme, type Theme } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { label: string; value: Theme; icon: React.ElementType }[] = [
    { label: 'Light', value: 'light', icon: Sun },
    { label: 'Dark', value: 'dark', icon: Moon },
    { label: 'System', value: 'system', icon: Laptop },
  ];

  const CurrentIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container-high/60 transition-colors flex items-center justify-center"
        title={`Theme: ${theme} (Click to change)`}
        aria-label="Toggle theme selector"
      >
        <CurrentIcon className="w-4 h-4 transition-transform duration-200" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-surface-container-lowest border border-outline-variant/60 rounded-md shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1 text-[10px] font-semibold text-outline uppercase tracking-wider">
            Appearance
          </div>
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors',
                  isSelected
                    ? 'text-primary font-semibold bg-surface-container-high'
                    : 'text-on-surface hover:bg-surface-container-low'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', isSelected ? 'text-primary' : 'text-outline')} />
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ThemeSegmentedControl({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        'inline-flex items-center p-0.5 rounded-md bg-surface-container-low border border-outline-variant/50',
        className
      )}
    >
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all',
          theme === 'light'
            ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
            : 'text-on-surface-variant hover:text-on-surface'
        )}
      >
        <Sun className="w-3.5 h-3.5" />
        <span>Light</span>
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all',
          theme === 'dark'
            ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
            : 'text-on-surface-variant hover:text-on-surface'
        )}
      >
        <Moon className="w-3.5 h-3.5" />
        <span>Dark</span>
      </button>

      <button
        onClick={() => setTheme('system')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all',
          theme === 'system'
            ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
            : 'text-on-surface-variant hover:text-on-surface'
        )}
      >
        <Laptop className="w-3.5 h-3.5" />
        <span>System</span>
      </button>
    </div>
  );
}
