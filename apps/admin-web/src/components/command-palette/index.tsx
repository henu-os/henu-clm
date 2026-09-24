'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
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
  X,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  route: string;
}

const commands: CommandItem[] = [
  { id: '1', title: 'Dashboard & KPIs', category: 'Navigation', icon: <LayoutDashboard className="w-4 h-4" />, route: '/dashboard' },
  { id: '2', title: 'Customer Management', category: 'CRM', icon: <Users className="w-4 h-4" />, route: '/customers' },
  { id: '3', title: 'Services & Add-on Catalog', category: 'Catalog', icon: <Layers className="w-4 h-4" />, route: '/catalog' },
  { id: '4', title: 'Quotes Workbench', category: 'Sales', icon: <FileText className="w-4 h-4" />, route: '/quotes' },
  { id: '5', title: 'Sales Orders', category: 'Sales', icon: <ShoppingBag className="w-4 h-4" />, route: '/orders' },
  { id: '6', title: 'Tax Invoices', category: 'Finance', icon: <Receipt className="w-4 h-4" />, route: '/invoices' },
  { id: '7', title: 'Payments Ledger', category: 'Finance', icon: <CreditCard className="w-4 h-4" />, route: '/payments' },
  { id: '8', title: 'Customer Support Desk', category: 'Support', icon: <MessageSquare className="w-4 h-4" />, route: '/support' },
  { id: '9', title: 'Mobile App CMS', category: 'CMS', icon: <Globe className="w-4 h-4" />, route: '/cms' },
  { id: '10', title: 'Notifications Center', category: 'System', icon: <Bell className="w-4 h-4" />, route: '/notifications' },
  { id: '11', title: 'Payment Gateway Configuration', category: 'Settings', icon: <CreditCard className="w-4 h-4" />, route: '/settings/payments' },
  { id: '12', title: 'AI Assistant Configuration', category: 'Settings', icon: <Settings className="w-4 h-4" />, route: '/settings/ai' },
  { id: '13', title: 'Roles & Permissions Matrix', category: 'Settings', icon: <Settings className="w-4 h-4" />, route: '/settings/roles' },
];

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (route: string) => {
    router.push(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-lg border border-outline-variant/60 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="relative border-b border-outline-variant/40 flex items-center px-3">
          <Search className="w-4 h-4 text-outline mr-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search modules... [Esc to close]"
            className="w-full h-12 bg-transparent text-sm text-on-surface focus:outline-none placeholder:text-outline"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-outline">No commands found matching "{query}"</div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.route)}
                className="w-full flex items-center justify-between p-2.5 rounded hover:bg-surface-container-high/60 text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-primary group-hover:text-primary-container transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium text-on-surface">{item.title}</span>
                </div>
                <span className="text-[10px] uppercase font-semibold text-outline tracking-wider bg-surface-container px-1.5 py-0.5 rounded">
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
