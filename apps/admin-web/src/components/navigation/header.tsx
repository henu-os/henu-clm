'use client';

import * as React from 'react';
import { Search, Bell, HelpCircle, User, LogOut, Settings } from 'lucide-react';
import { CommandPalette } from '../command-palette';
import { ThemeSwitcher, ThemeSegmentedControl } from '../theme/theme-switcher';
import { useRouter } from 'next/navigation';

export function Header() {
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <>
      <header className="sticky top-0 right-0 h-14 z-20 border-b border-outline-variant/40 bg-surface-container-lowest flex items-center justify-between px-space-lg w-full transition-colors duration-200">
        {/* Search & Cmd+K Trigger */}
        <div className="flex items-center gap-4 w-72 md:w-96">
          <button
            onClick={() => setCommandOpen(true)}
            className="w-full h-9 pl-3 pr-2 bg-surface-container-low border border-outline-variant rounded flex items-center justify-between text-xs text-outline hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-outline" />
              <span>Search clients, quotes, invoices...</span>
            </div>
            <span className="px-1.5 py-0.5 border border-outline-variant/70 rounded text-[10px] font-semibold text-outline-variant bg-surface-container-lowest">
              ⌘K
            </span>
          </button>
        </div>

        {/* Action Cluster */}
        <div className="flex items-center gap-3">
          {/* Quick Actions Links */}
          <div className="hidden md:flex items-center gap-4 mr-2">
            <a href="/customers" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">
              All Clients
            </a>
            <a href="/invoices" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">
              Invoices
            </a>
            <a href="/quotes" className="text-xs text-primary font-semibold border-b-2 border-primary pb-0.5">
              Pipeline
            </a>
          </div>

          <a
            href="/quotes"
            className="h-8 px-3 bg-primary text-on-primary rounded text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-1.5 active:scale-[0.98] shadow-xs"
          >
            <span>+ New Transaction</span>
          </a>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-outline-variant/50 mx-1" />

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Notification & Help Icons */}
          <div className="flex items-center gap-1">
            <a
              href="/notifications"
              className="relative p-1.5 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container-high/40 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error" />
            </a>
            <a
              href="/settings"
              className="p-1.5 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container-high/40 transition-colors"
              title="System Settings"
            >
              <Settings className="w-4 h-4" />
            </a>
          </div>

          {/* Admin Profile Dropdown */}
          <div className="relative pl-1">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                AS
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-xs font-semibold text-on-surface leading-tight">Aarav Sharma</span>
                <span className="text-[10px] text-outline leading-none">Super Admin</span>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-md border border-outline-variant/60 shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-outline-variant/30">
                  <p className="text-xs font-semibold text-on-surface">Aarav Sharma</p>
                  <p className="text-[10px] text-outline truncate">aarav.sharma@henuos.com</p>
                </div>
                
                {/* Theme Selector in Profile */}
                <div className="px-3 py-2 border-b border-outline-variant/30">
                  <p className="text-[10px] font-semibold text-outline uppercase tracking-wider mb-1.5">Theme</p>
                  <ThemeSegmentedControl className="w-full justify-between" />
                </div>

                <a
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-xs text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface"
                  onClick={() => setProfileOpen(false)}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Profile & Settings</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-error hover:bg-error-container/30 text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}
