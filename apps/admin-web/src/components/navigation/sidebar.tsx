'use client';

import * as React from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Layers,
  FileText,
  ShoppingBag,
  Receipt,
  CreditCard,
  MessageSquare,
  Globe,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Repeat,
  FileMinus,
  KanbanSquare,
  Building2,
  Tag,
  Clock,
  ChevronDown,
  FolderKanban
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [timeTrackingExpanded, setTimeTrackingExpanded] = React.useState(
    pathname?.startsWith('/time-tracking') || pathname === '/delivery'
  );

  const mainNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Customers', href: '/customers', icon: Users },
    { label: 'Catalog', href: '/catalog', icon: Layers },
    { label: 'Quotes', href: '/quotes', icon: FileText },
    { label: 'Sales Orders', href: '/orders', icon: ShoppingBag },
    { label: 'Invoices', href: '/invoices', icon: Receipt },
    { label: 'Recurring Invoices', href: '/recurring-invoices', icon: Repeat },
    { label: 'Credit Notes', href: '/credit-notes', icon: FileMinus },
    { label: 'Payments', href: '/payments', icon: CreditCard },
    { label: 'Banking', href: '/banking', icon: Building2 },
    { label: 'Offers & Promos', href: '/offers', icon: Tag },
  ];

  const timeTrackingChildren = [
    { label: 'Projects', href: '/time-tracking/projects', icon: FolderKanban },
    { label: 'Timesheet', href: '/time-tracking/timesheet', icon: Clock },
    { label: 'Progress / Delivery', href: '/delivery', icon: KanbanSquare },
  ];

  const secondaryNavItems = [
    { label: 'Support', href: '/support', icon: MessageSquare },
    { label: 'App CMS', href: '/cms', icon: Globe },
    { label: 'Notifications', href: '/notifications', icon: Bell },
  ];

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-screen z-30 transition-all duration-300 border-r border-outline-variant/40 bg-surface-container-low flex flex-col justify-between p-space-sm',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div>
        {/* Brand / Org Header */}
        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg hover:bg-surface-container-high/50 transition-colors overflow-hidden">
          <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold tracking-tighter shrink-0">
            H
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-on-surface truncate">HENU OS</span>
              <span className="text-xs text-on-surface-variant truncate">Enterprise CLM</span>
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        {!collapsed ? (
          <a
            href="/quotes"
            className="w-full flex items-center justify-center gap-2 mb-4 px-3 py-2 bg-primary text-on-primary rounded font-semibold text-xs active:scale-[0.99] transition-transform duration-100 hover:bg-primary-container shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Create</span>
          </a>
        ) : (
          <a
            href="/quotes"
            className="w-8 h-8 mx-auto flex items-center justify-center mb-4 bg-primary text-on-primary rounded active:scale-[0.99]"
            title="Quick Create"
          >
            <Plus className="w-4 h-4" />
          </a>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1 max-h-[calc(100vh-230px)] overflow-y-auto pr-1 scrollbar-none text-xs">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded font-medium transition-colors duration-150 active:scale-[0.99]',
                  isActive
                    ? 'text-primary bg-surface-container-high/80 border-l-2 border-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-primary' : 'text-outline')} />
                {!collapsed && <span>{item.label}</span>}
              </a>
            );
          })}

          {/* Time Tracking Dropdown Section */}
          <div>
            {!collapsed ? (
              <button
                type="button"
                onClick={() => setTimeTrackingExpanded(!timeTrackingExpanded)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded font-medium transition-colors duration-150',
                  pathname?.startsWith('/time-tracking') || pathname === '/delivery'
                    ? 'text-primary font-semibold bg-surface-container-high/40'
                    : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface'
                )}
              >
                <div className="flex items-center gap-3">
                  <Clock className={cn('w-4 h-4 shrink-0', pathname?.startsWith('/time-tracking') || pathname === '/delivery' ? 'text-primary' : 'text-outline')} />
                  <span>Time Tracking</span>
                </div>
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', timeTrackingExpanded && 'rotate-180')} />
              </button>
            ) : (
              <a
                href="/time-tracking/projects"
                className="flex items-center justify-center p-2 rounded text-on-surface-variant hover:bg-surface-container-high/50"
                title="Time Tracking"
              >
                <Clock className="w-4 h-4 text-outline" />
              </a>
            )}

            {/* Time Tracking Dropdown Children */}
            {!collapsed && timeTrackingExpanded && (
              <div className="pl-6 space-y-1 mt-1 border-l border-outline-variant/50 ml-4 animate-in fade-in">
                {timeTrackingChildren.map((sub) => {
                  const SubIcon = sub.icon;
                  const isSubActive = pathname === sub.href;
                  return (
                    <a
                      key={sub.href}
                      href={sub.href}
                      className={cn(
                        'flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] font-medium transition-colors',
                        isSubActive
                          ? 'text-primary font-bold bg-primary/10'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40'
                      )}
                    >
                      <SubIcon className="w-3.5 h-3.5" />
                      <span>{sub.label}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Secondary Items */}
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded font-medium transition-colors duration-150 active:scale-[0.99]',
                  isActive
                    ? 'text-primary bg-surface-container-high/80 border-l-2 border-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-primary' : 'text-outline')} />
                {!collapsed && <span>{item.label}</span>}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Nav Footer */}
      <div className="space-y-1 pt-3 border-t border-outline-variant/30">
        <a
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors',
            pathname?.startsWith('/settings')
              ? 'text-primary bg-surface-container-high font-semibold'
              : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface'
          )}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 shrink-0 text-outline" />
          {!collapsed && <span>Settings</span>}
        </a>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant rounded text-xs font-medium hover:bg-surface-container-high/50 hover:text-on-surface transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
